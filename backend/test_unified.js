const mongoose = require('mongoose');
const Activity = require('./src/models/Activity');
const User = require('./src/models/User');
require('dotenv').config({ path: './.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  // Find user with most activities
  const userStats = await Activity.aggregate([
    { $group: { _id: '$userId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);
  
  if (userStats.length === 0) {
    console.log("No data");
    process.exit(0);
  }

  const objectIdUser = userStats[0]._id;
  console.log(`Testing with user: ${objectIdUser}`);

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
      slope = 0;
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

  let trendDirection = "Stable";
  let riskLevel = "LOW";
  
  const avgEmission = historicalSeries.length > 0 ? (historicalSeries.reduce((a, b) => a + b.actual, 0) / historicalSeries.length) : 0;
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

  if (categoryBreakdown.length > 0 && categoryBreakdown[0].percentage > 70) {
    if (riskLevel === "LOW") riskLevel = "MEDIUM";
    else if (riskLevel === "MEDIUM") riskLevel = "HIGH";
  }

  console.log("Output:");
  console.log({
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
  });

  process.exit(0);
}

run().catch(console.error);
