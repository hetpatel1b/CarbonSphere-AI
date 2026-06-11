const Activity = require('../models/Activity');
const groqService = require('../services/groqService');
const mongoose = require('mongoose');

// @desc    Get Unified Forecast Data
// @route   GET /api/forecast/data
// @access  Private
const getUnifiedForecast = async (req, res) => {
  try {
    const userId = req.user.id;
    const objectIdUser = new mongoose.Types.ObjectId(userId);
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    // 1. Historical Monthly Aggregation
    const monthlyAgg = await Activity.aggregate([
      { $match: { userId: objectIdUser, date: { $gte: oneYearAgo } } },
      { $group: { 
          _id: { year: { $year: '$date' }, month: { $month: '$date' } }, 
          total: { $sum: '$carbonEmission' } 
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // 2. Category Breakdown Aggregation
    const categoryAgg = await Activity.aggregate([
      { $match: { userId: objectIdUser, date: { $gte: sixMonthsAgo } } },
      { $group: { _id: '$category', total: { $sum: '$carbonEmission' } } },
      { $sort: { total: -1 } }
    ]);

    let totalCat = 0;
    categoryAgg.forEach(c => totalCat += c.total);
    const categoryBreakdown = categoryAgg.map(c => ({
      category: c._id,
      total: c.total,
      percentage: totalCat > 0 ? (c.total / totalCat) * 100 : 0
    }));

    const historicalSeries = monthlyAgg.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      actual: item.total
    }));

    // Find exact current and previous months
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const previousDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthKey = `${previousDate.getFullYear()}-${String(previousDate.getMonth() + 1).padStart(2, '0')}`;

    const currentMonthData = historicalSeries.find(s => s.month === currentMonthKey);
    const currentMonth = currentMonthData ? currentMonthData.actual : 0;
    
    const previousMonthData = historicalSeries.find(s => s.month === previousMonthKey);
    const previousMonth = previousMonthData ? previousMonthData.actual : 0;

    // 3. Weighted Linear Regression for Prediction
    const predictionSeries = [];
    let forecastNextMonth = currentMonth;
    let forecast3Months = currentMonth * 3;
    let forecast6Months = currentMonth * 6;
    let slope = 0;

    if (historicalSeries.length > 0) {
      const yValues = historicalSeries.map(s => s.actual);
      const xValues = yValues.map((_, i) => i);
      const n = xValues.length;

      let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, wSum = 0;
      
      // Apply increasing weight to recent months (time-decay approach)
      for (let i = 0; i < n; i++) {
        const w = (i + 1); // Linear weight multiplier
        wSum += w;
        sumX += w * xValues[i];
        sumY += w * yValues[i];
        sumXY += w * xValues[i] * yValues[i];
        sumXX += w * xValues[i] * xValues[i];
      }

      let intercept = 0;

      if (n === 1) {
        // Build a realistic baseline model from current activity patterns (daily intra-month trends)
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const dailyAgg = await Activity.aggregate([
          { $match: { userId: objectIdUser, date: { $gte: startOfCurrentMonth } } },
          { $group: {
              _id: { day: { $dayOfMonth: '$date' } },
              total: { $sum: '$carbonEmission' }
          }},
          { $sort: { '_id.day': 1 } }
        ]);

        if (dailyAgg.length > 1) {
          // Calculate slope based on the days within the single month
          let dSumX = 0, dSumY = 0, dSumXY = 0, dSumXX = 0;
          const dn = dailyAgg.length;
          const dxValues = dailyAgg.map((_, i) => i);
          const dyValues = dailyAgg.map(item => item.total);

          for (let i = 0; i < dn; i++) {
            dSumX += dxValues[i];
            dSumY += dyValues[i];
            dSumXY += dxValues[i] * dyValues[i];
            dSumXX += dxValues[i] * dxValues[i];
          }

          const dailySlope = (dn * dSumXY - dSumX * dSumY) / (dn * dSumXX - dSumX * dSumX);
          
          // Extrapolate daily slope to monthly
          slope = dailySlope * 30;
        } else {
           // If only 1 day of data exists, apply a modest default curve based on highest category
           if (categoryBreakdown.length > 0 && categoryBreakdown[0].category === 'Transport') {
              slope = yValues[0] * 0.05; // 5% expected growth for heavy transport
           } else {
              slope = yValues[0] * -0.02; // 2% expected reduction baseline
           }
        }
        intercept = yValues[0];
      } else {
        slope = (wSum * sumXY - sumX * sumY) / (wSum * sumXX - sumX * sumX);
        intercept = (sumY - slope * sumX) / wSum;
      }

      let currentYear = now.getFullYear();
      let currentMonthIndex = now.getMonth() + 1;

      for (let i = 1; i <= 6; i++) {
        const x = n - 1 + i;
        let predictedValue = intercept + slope * x;
        if (predictedValue < 0) predictedValue = 0;
        
        let nextMonthIndex = currentMonthIndex + i;
        let nextYear = currentYear;
        while (nextMonthIndex > 12) {
          nextMonthIndex -= 12;
          nextYear += 1;
        }
        
        predictionSeries.push({
          month: `${nextYear}-${String(nextMonthIndex).padStart(2, '0')}`,
          predicted: predictedValue
        });
      }

      forecastNextMonth = predictionSeries[0].predicted;
      forecast3Months = predictionSeries.slice(0, 3).reduce((acc, curr) => acc + curr.predicted, 0);
      forecast6Months = predictionSeries.reduce((acc, curr) => acc + curr.predicted, 0);
    }

    // 4. Smart Risk Detection
    let trendDirection = "Stable";
    let riskLevel = "LOW";
    
    // Average monthly emission context
    const avgEmission = historicalSeries.length > 0 ? (historicalSeries.reduce((a, b) => a + b.actual, 0) / historicalSeries.length) : 0;
    
    // Calculate slope percentage relative to average
    const slopePercentage = avgEmission > 0 ? (slope / avgEmission) * 100 : 0;

    if (slopePercentage > 5) {
      trendDirection = "Increasing";
      riskLevel = "CRITICAL";
    } else if (slopePercentage > 1) {
      trendDirection = "Increasing";
      riskLevel = "HIGH";
    } else if (slopePercentage < -1) {
      trendDirection = "Decreasing";
      riskLevel = "LOW";
    } else {
      trendDirection = "Stable";
      riskLevel = "MEDIUM";
    }

    // Concentration penalty: If one category dominates > 70%, increase risk
    if (categoryBreakdown.length > 0 && categoryBreakdown[0].percentage > 70) {
      if (riskLevel === "LOW") riskLevel = "MEDIUM";
      else if (riskLevel === "MEDIUM") riskLevel = "HIGH";
    }

    // 5. Personalized AI Insights
    let aiInsights = { insight: "Start logging activities to see personalized AI insights.", highestRiskArea: "None", potentialReduction: "0", recommendations: [] };
    
    if (historicalSeries.length > 0) {
      const highestEmission = categoryBreakdown.length > 0 ? categoryBreakdown[0].category : "None";
      const highestPercentage = categoryBreakdown.length > 0 ? categoryBreakdown[0].percentage.toFixed(1) : 0;
      const categoryContext = categoryBreakdown.map(c => `${c.category}: ${c.percentage.toFixed(1)}%`).join(', ');
      
      const prompt = `
        Act as an expert AI sustainability coach.
        The user's recent carbon emissions show a ${trendDirection} trend.
        Their current month emissions: ${currentMonth.toFixed(2)} tCO2e.
        Their category breakdown is: ${categoryContext}.
        
        Generate a brief, highly personalized forecast insight and recommendations in JSON format.
        Do not include markdown tags outside of the JSON.
        Structure:
        {
          "insight": "A 1-2 sentence personalized summary, mentioning the ${highestEmission} category and their ${trendDirection} trend.",
          "highestRiskArea": "${highestEmission}",
          "potentialReduction": "Estimated numeric reduction if optimized",
          "recommendations": [
            {
              "title": "Action title (personalized to ${highestEmission})",
              "description": "How to do it",
              "reduction": "Estimated reduction (e.g. 0.2 tCO2e/yr)",
              "difficulty": "Easy/Medium/Hard",
              "impact": "Low/Medium/High"
            }
          ]
        }
        Provide 4 recommendations. At least two should specifically target the ${highestEmission} category.
      `;
      
      aiInsights = await groqService.generateAssistantResponse(prompt);
    }

    return res.status(200).json({
      success: true,
      data: {
        currentMonth,
        previousMonth,
        forecastNextMonth,
        forecast3Months,
        forecast6Months,
        trendDirection,
        riskLevel,
        categoryBreakdown,
        historicalSeries,
        predictionSeries,
        recommendations: aiInsights.recommendations || [],
        aiInsights
      }
    });

  } catch (error) {
    console.error(`Error in getUnifiedForecast: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getUnifiedForecast
};
