const CarbonLog = require('../models/CarbonLog');
const Forecast = require('../models/Forecast');
const mongoose = require('mongoose');

// @desc    Get monthly forecast
// @route   GET /api/forecast/monthly
// @access  Private
const getMonthlyForecast = async (req, res) => {
  try {
    const userId = req.user.id;
    const objectIdUser = new mongoose.Types.ObjectId(userId);
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Calculate current month carbon from CarbonLog
    const currentMonthAgg = await CarbonLog.aggregate([
      { 
        $match: { 
          userId: objectIdUser,
          createdAt: { $gte: startOfMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$carbonEmission' } } }
    ]);
    const currentMonthCarbon = currentMonthAgg.length > 0 ? currentMonthAgg[0].total : 0;
    
    // Historical Data (previous 3 months) to predict next month
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const historicalAgg = await CarbonLog.aggregate([
      { 
        $match: { 
          userId: objectIdUser,
          createdAt: { $gte: threeMonthsAgo, $lt: startOfMonth }
        } 
      },
      { $group: { _id: { month: { $month: '$createdAt' } }, total: { $sum: '$carbonEmission' } } }
    ]);
    
    // Simple average prediction for next month based on history
    let predictedNextMonthCarbon = 0;
    if (historicalAgg.length > 0) {
      const sum = historicalAgg.reduce((acc, curr) => acc + curr.total, 0);
      predictedNextMonthCarbon = sum / historicalAgg.length;
    } else {
      predictedNextMonthCarbon = currentMonthCarbon; // fallback
    }

    // reduction percentage (how much predicted drops compared to current)
    let reductionPercentage = 0;
    if (currentMonthCarbon > 0) {
      reductionPercentage = ((currentMonthCarbon - predictedNextMonthCarbon) / currentMonthCarbon) * 100;
    }
    
    // trend
    let trend = 'stable';
    // Small threshold to determine trend
    const diff = predictedNextMonthCarbon - currentMonthCarbon;
    if (diff > (currentMonthCarbon * 0.05)) {
      trend = 'increasing';
    } else if (diff < -(currentMonthCarbon * 0.05)) {
      trend = 'decreasing';
    }

    // Store in DB according to Forecast Schema requirements
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    await Forecast.findOneAndUpdate(
      { userId: objectIdUser, month: monthStr },
      { 
        currentCarbon: currentMonthCarbon, 
        predictedCarbon: predictedNextMonthCarbon,
        reductionPercentage,
        trend
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      data: {
        currentMonthCarbon,
        predictedNextMonthCarbon,
        reductionPercentage,
        trend
      }
    });
  } catch (error) {
    console.error(`Error in getMonthlyForecast: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get yearly forecast trend
// @route   GET /api/forecast/yearly
// @access  Private
const getYearlyForecast = async (req, res) => {
  try {
    const userId = req.user.id;
    const objectIdUser = new mongoose.Types.ObjectId(userId);
    
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    // Aggregate carbon logs by month
    const yearlyTrendAgg = await CarbonLog.aggregate([
      { 
        $match: { 
          userId: objectIdUser,
          createdAt: { $gte: startOfYear }
        } 
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          totalCarbon: { $sum: '$carbonEmission' }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);

    const yearlyTrendData = yearlyTrendAgg.map(item => ({
      month: item._id.month,
      totalCarbon: item.totalCarbon
    }));

    return res.status(200).json({
      success: true,
      data: yearlyTrendData
    });

  } catch (error) {
    console.error(`Error in getYearlyForecast: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get forecast trends
// @route   GET /api/forecast/trends
// @access  Private
const getForecastTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const objectIdUser = new mongoose.Types.ObjectId(userId);
    
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    
    // Carbon trend
    const carbonTrendAgg = await CarbonLog.aggregate([
      { 
        $match: { 
          userId: objectIdUser,
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          totalCarbon: { $sum: '$carbonEmission' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    const carbonTrend = carbonTrendAgg.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      totalCarbon: item.totalCarbon
    }));

    // Monthly comparison
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthAgg = await CarbonLog.aggregate([
      { 
        $match: { 
          userId: objectIdUser,
          createdAt: { $gte: startOfCurrentMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$carbonEmission' } } }
    ]);
    const currentMonthCarbon = currentMonthAgg.length > 0 ? currentMonthAgg[0].total : 0;

    const lastMonthAgg = await CarbonLog.aggregate([
      { 
        $match: { 
          userId: objectIdUser,
          createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$carbonEmission' } } }
    ]);
    const lastMonthCarbon = lastMonthAgg.length > 0 ? lastMonthAgg[0].total : 0;

    const monthlyComparison = {
      currentMonth: currentMonthCarbon,
      lastMonth: lastMonthCarbon,
      difference: currentMonthCarbon - lastMonthCarbon
    };

    // Recommendations
    let recommendations = [];
    if (currentMonthCarbon > lastMonthCarbon) {
      recommendations.push("Your emissions are trending higher than last month. Consider taking public transit or carpooling.");
      recommendations.push("Try reducing energy consumption at home by turning off unused electronics.");
    } else {
      recommendations.push("Great progress! You are emitting less carbon than last month.");
      recommendations.push("Keep up the sustainable habits to continue this downward trend.");
    }

    return res.status(200).json({
      success: true,
      data: {
        carbonTrend,
        monthlyComparison,
        recommendations
      }
    });

  } catch (error) {
    console.error(`Error in getForecastTrends: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getMonthlyForecast,
  getYearlyForecast,
  getForecastTrends
};
