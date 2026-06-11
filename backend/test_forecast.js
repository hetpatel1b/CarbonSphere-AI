const mongoose = require('mongoose');
const Activity = require('./src/models/Activity');
const User = require('./src/models/User');
require('dotenv').config({ path: './.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const activities = await Activity.find();
  console.log(`Total activities in DB: ${activities.length}`);
  
  if (activities.length === 0) {
    console.log("No activities found.");
    process.exit(0);
  }

  // Find user with most activities
  const userStats = await Activity.aggregate([
    { $group: { _id: '$userId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  const userId = userStats[0]._id;
  console.log(`User with most activities: ${userId} (${userStats[0].count} activities)`);

  const userActivities = await Activity.find({ userId });
  let totalEmissions = 0;
  userActivities.forEach(a => totalEmissions += a.carbonEmission);
  console.log(`Total emissions for user: ${totalEmissions}`);

  // Run the aggregation logic for this user
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

  const monthlyAgg = await Activity.aggregate([
    { $match: { userId: userId, date: { $gte: oneYearAgo } } },
    { $group: { 
        _id: { year: { $year: '$date' }, month: { $month: '$date' } }, 
        total: { $sum: '$carbonEmission' } 
    }},
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  console.log("Monthly Aggregation used:");
  console.log(JSON.stringify([
    { "$match": { "userId": "ObjectId(...)", "date": { "$gte": "oneYearAgo" } } },
    { "$group": { 
        "_id": { "year": { "$year": "$date" }, "month": { "$month": "$date" } }, 
        "total": { "$sum": "$carbonEmission" } 
    }},
    { "$sort": { "_id.year": 1, "_id.month": 1 } }
  ], null, 2));

  console.log("Monthly Aggregation results:", monthlyAgg);

  if (monthlyAgg.length === 0) {
    console.log("Not enough data to generate accurate predictions (needs at least 1 month).");
  } else {
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

    const predictions = [];
    const monthsToPredict = 6;
    
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth() + 1; // 1-12

    for (let i = 1; i <= monthsToPredict; i++) {
      const x = n - 1 + i;
      let predictedValue = intercept + slope * x;
      if (predictedValue < 0) predictedValue = 0;
      
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

    console.log("Generated Predictions:");
    console.table(predictions);
  }

  process.exit(0);
}

run().catch(console.error);
