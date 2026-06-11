const Activity = require('../models/Activity');
const aiService = require('../services/aiService');
const mongoose = require('mongoose');

// Helper to get start and end of week
const getWeekRange = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const start = new Date(date.setDate(diff));
  start.setHours(0,0,0,0);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23,59,59,999);
  return { start, end };
};

// @desc    Get forecast summary (monthly and weekly emissions)
// @route   GET /api/forecast/summary
// @access  Private
const getForecastSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const objectIdUser = new mongoose.Types.ObjectId(userId);
    
    const now = new Date();
    
    // Current month
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    // Weekly
    const { start: startOfCurrentWeek } = getWeekRange(new Date(now));
    const startOfLastWeek = new Date(startOfCurrentWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const aggregations = await Promise.all([
      Activity.aggregate([
        { $match: { userId: objectIdUser, date: { $gte: startOfCurrentMonth } } },
        { $group: { _id: null, total: { $sum: '$carbonEmission' } } }
      ]),
      Activity.aggregate([
        { $match: { userId: objectIdUser, date: { $gte: startOfLastMonth, $lt: startOfCurrentMonth } } },
        { $group: { _id: null, total: { $sum: '$carbonEmission' } } }
      ]),
      Activity.aggregate([
        { $match: { userId: objectIdUser, date: { $gte: startOfCurrentWeek } } },
        { $group: { _id: null, total: { $sum: '$carbonEmission' } } }
      ]),
      Activity.aggregate([
        { $match: { userId: objectIdUser, date: { $gte: startOfLastWeek, $lt: startOfCurrentWeek } } },
        { $group: { _id: null, total: { $sum: '$carbonEmission' } } }
      ])
    ]);

    const currentMonthCarbon = aggregations[0].length ? aggregations[0][0].total : 0;
    const lastMonthCarbon = aggregations[1].length ? aggregations[1][0].total : 0;
    const currentWeekCarbon = aggregations[2].length ? aggregations[2][0].total : 0;
    const lastWeekCarbon = aggregations[3].length ? aggregations[3][0].total : 0;

    let monthlyTrend = 0;
    if (lastMonthCarbon > 0) {
      monthlyTrend = ((currentMonthCarbon - lastMonthCarbon) / lastMonthCarbon) * 100;
    }

    let weeklyTrend = 0;
    if (lastWeekCarbon > 0) {
      weeklyTrend = ((currentWeekCarbon - lastWeekCarbon) / lastWeekCarbon) * 100;
    }

    return res.status(200).json({
      success: true,
      data: {
        currentMonthCarbon,
        lastMonthCarbon,
        monthlyTrend,
        currentWeekCarbon,
        lastWeekCarbon,
        weeklyTrend
      }
    });

  } catch (error) {
    console.error(`Error in getForecastSummary: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get category trends and reduction trends
// @route   GET /api/forecast/trends
// @access  Private
const getForecastTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const objectIdUser = new mongoose.Types.ObjectId(userId);
    
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    
    // Aggregate by category
    const categoryAgg = await Activity.aggregate([
      { $match: { userId: objectIdUser, date: { $gte: sixMonthsAgo } } },
      { $group: { _id: '$category', total: { $sum: '$carbonEmission' } } },
      { $sort: { total: -1 } }
    ]);

    // Aggregate by month for total historical trend
    const monthlyTrendAgg = await Activity.aggregate([
      { $match: { userId: objectIdUser, date: { $gte: sixMonthsAgo } } },
      { $group: { 
          _id: { year: { $year: '$date' }, month: { $month: '$date' } }, 
          total: { $sum: '$carbonEmission' } 
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const historicalTrend = monthlyTrendAgg.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      actual: item.total
    }));

    return res.status(200).json({
      success: true,
      data: {
        categories: categoryAgg,
        historicalTrend
      }
    });

  } catch (error) {
    console.error(`Error in getForecastTrends: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get statistical predictions for next 1, 3, 6 months
// @route   GET /api/forecast/predictions
// @access  Private
const getForecastPredictions = async (req, res) => {
  try {
    const userId = req.user.id;
    const objectIdUser = new mongoose.Types.ObjectId(userId);
    
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    
    // Get monthly totals for the past year
    const monthlyAgg = await Activity.aggregate([
      { $match: { userId: objectIdUser, date: { $gte: oneYearAgo } } },
      { $group: { 
          _id: { year: { $year: '$date' }, month: { $month: '$date' } }, 
          total: { $sum: '$carbonEmission' } 
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    console.log("[DEBUG] getForecastPredictions - monthlyAgg:", JSON.stringify(monthlyAgg));

    if (monthlyAgg.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          sufficientData: false,
          message: "Not enough historical data to generate accurate predictions. Please continue logging your activities.",
          predictions: []
        }
      });
    }

    // Simple Linear Regression over monthly totals
    const xValues = monthlyAgg.map((_, i) => i);
    const yValues = monthlyAgg.map(item => item.total);
    
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    const n = xValues.length;
    
    for (let i = 0; i < n; i++) {
      sumX += xValues[i];
      sumY += yValues[i];
      sumXY += xValues[i] * yValues[i];
      sumXX += xValues[i] * xValues[i];
    }
    
    let slope = 0;
    let intercept = 0;

    if (n === 1) {
      slope = 0;
      intercept = yValues[0];
    } else {
      slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      intercept = (sumY - slope * sumX) / n;
    }

    // Generate forecasts
    const predictions = [];
    const monthsToPredict = 6;
    
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth() + 1; // 1-12

    for (let i = 1; i <= monthsToPredict; i++) {
      const x = n - 1 + i;
      let predictedValue = intercept + slope * x;
      if (predictedValue < 0) predictedValue = 0; // Prevent negative emissions
      
      let nextMonth = currentMonth + i;
      let nextYear = currentYear;
      if (nextMonth > 12) {
        nextMonth -= 12;
        nextYear += 1;
      }
      
      predictions.push({
        month: `${nextYear}-${String(nextMonth).padStart(2, '0')}`,
        predicted: predictedValue
      });
    }

    // Goal prediction: if slope is negative, when will it reach 50% of current?
    const currentAverage = sumY / n;
    let goalPrediction = "Trend is not decreasing.";
    if (slope < 0) {
      const target = currentAverage * 0.5;
      const xTarget = (target - intercept) / slope;
      const monthsAway = Math.ceil(xTarget - (n - 1));
      if (monthsAway > 0) {
         goalPrediction = `On track to reduce emissions by 50% in approximately ${monthsAway} months.`;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        sufficientData: true,
        slope,
        currentAverage,
        predictions,
        nextMonth: predictions[0].predicted,
        next3Months: predictions.slice(0,3).reduce((acc, curr) => acc + curr.predicted, 0),
        next6Months: predictions.reduce((acc, curr) => acc + curr.predicted, 0),
        goalPrediction
      }
    });

  } catch (error) {
    console.error(`Error in getForecastPredictions: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get AI Insights based on forecast
// @route   GET /api/forecast/insights
// @access  Private
const getForecastInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const objectIdUser = new mongoose.Types.ObjectId(userId);
    
    // Quickly gather limited data to feed AI
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const recentAgg = await Activity.aggregate([
      { $match: { userId: objectIdUser, date: { $gte: startOfLastMonth } } },
      { $group: { _id: '$category', total: { $sum: '$carbonEmission' } } }
    ]);

    if (recentAgg.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          insight: "Not enough recent data to generate AI insights. Log some activities first!",
          recommendations: []
        }
      });
    }

    const dataString = recentAgg.map(r => `${r._id}: ${r.total.toFixed(2)} tCO2e`).join(', ');

    const prompt = `
      Act as an AI sustainability coach.
      Here is the user's recent carbon emissions by category: ${dataString}.
      Generate a brief, highly actionable forecast insight and recommendations in JSON format.
      Do not include markdown tags outside of the JSON.
      Structure:
      {
        "insight": "A 1-2 sentence summary of what this means for their immediate future.",
        "highestRiskArea": "Category name",
        "potentialIncrease": "Estimated numeric increase if unchecked",
        "mostImpactfulArea": "Category name",
        "potentialReduction": "Estimated numeric reduction if optimized",
        "recommendations": [
          {
            "title": "Action title",
            "description": "How to do it",
            "reduction": "Estimated reduction (e.g. 0.2 tCO2e/yr)",
            "difficulty": "Easy/Medium/Hard",
            "impact": "Low/Medium/High"
          }
        ]
      }
      Provide 4 recommendations.
    `;

    const aiResponse = await aiService.generateAssistantResponse(prompt);

    return res.status(200).json({
      success: true,
      data: aiResponse
    });

  } catch (error) {
    console.error(`Error in getForecastInsights: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getForecastSummary,
  getForecastTrends,
  getForecastPredictions,
  getForecastInsights
};
