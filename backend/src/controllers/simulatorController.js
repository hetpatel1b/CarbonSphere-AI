const mongoose = require('mongoose');
const Simulation = require('../models/Simulation');
const Activity = require('../models/Activity');
const aiService = require('../services/aiService');

const SCENARIOS = {
  'switch_to_ev': { category: 'Transport', reductionFactor: 0.70, baseCost: 40000, annualSavings: 1500, title: 'Switch to EV' },
  'public_transport': { category: 'Transport', reductionFactor: 0.50, baseCost: 0, annualSavings: 2000, title: 'Use Public Transport' },
  'reduce_flights': { category: 'Transport', reductionFactor: 0.30, baseCost: 0, annualSavings: 1000, title: 'Reduce Flights' },
  'solar_panels': { category: 'Energy', reductionFactor: 0.80, baseCost: 15000, annualSavings: 1200, title: 'Install Solar Panels' },
  'plant_based': { category: 'Food', reductionFactor: 0.50, baseCost: 0, annualSavings: 500, title: 'Plant-Based Diet' },
  'second_hand': { category: 'Shopping', reductionFactor: 0.40, baseCost: 0, annualSavings: 800, title: 'Buy Second-Hand' }
};

// @desc    Run a new simulation
// @route   POST /api/simulator/run
// @access  Private
const runSimulation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { scenarioId } = req.body;
    
    const scenario = SCENARIOS[scenarioId];
    if (!scenario) {
      return res.status(400).json({ success: false, message: 'Invalid scenario ID' });
    }

    const objectIdUser = new mongoose.Types.ObjectId(userId);

    // Fetch baseline actual emissions (Last 6 months approximation)
    const emissionsAgg = await Activity.aggregate([
      { $match: { userId: objectIdUser } },
      { $group: { _id: '$category', total: { $sum: '$carbonEmission' } } }
    ]);

    let currentEmissions = 0;
    let targetCategoryEmissions = 0;

    emissionsAgg.forEach(item => {
      currentEmissions += item.total;
      if (item._id === scenario.category) {
        targetCategoryEmissions = item.total;
      }
    });

    // If they have no footprint, give them a baseline to simulate on
    if (currentEmissions === 0) {
      currentEmissions = 500; // Mock baseline
      targetCategoryEmissions = 200; 
    }

    // Apply Math
    const carbonReduction = targetCategoryEmissions * scenario.reductionFactor;
    const simulatedEmissions = Math.max(0, currentEmissions - carbonReduction);
    const percentageImprovement = currentEmissions > 0 ? (carbonReduction / currentEmissions) * 100 : 0;
    const treesEquivalent = Math.round(carbonReduction * 50); // 1 ton = 50 trees roughly over a year
    const roiEstimate = scenario.baseCost > 0 ? (scenario.baseCost / scenario.annualSavings).toFixed(1) + ' years' : 'Immediate';

    const resultsData = {
      currentEmissions,
      simulatedEmissions,
      carbonReduction,
      percentageImprovement,
      treesEquivalent,
      costEstimate: scenario.baseCost,
      annualSavings: scenario.annualSavings,
      roiEstimate,
    };

    // AI Analysis
    const prompt = `
      Act as an ESG Sustainability AI Coach.
      A user ran a simulation: "${scenario.title}".
      Results: Reduced their carbon footprint by ${carbonReduction.toFixed(2)} tCO2e (${percentageImprovement.toFixed(1)}%).
      Cost: $${scenario.baseCost}. Savings: $${scenario.annualSavings}/yr.
      
      Return a JSON strictly in this format with no markdown:
      {
        "environmentalSummary": "2 sentences summarizing the planetary impact.",
        "longTermBenefits": ["Benefit 1", "Benefit 2"],
        "recommendedActions": ["Step 1", "Step 2"],
        "riskReduction": "1 sentence on how this reduces climate risk exposure."
      }
    `;

    let aiInsights = {
      environmentalSummary: "This decision positively impacts the environment by reducing greenhouse gas emissions.",
      longTermBenefits: ["Lower carbon footprint", "Financial savings"],
      recommendedActions: ["Research local options", "Start tracking progress"],
      riskReduction: "Reduces your personal contribution to global warming."
    };

    try {
      const aiResponse = await aiService.generateAssistantResponse(prompt);
      const parsed = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;
      aiInsights = { ...aiInsights, ...parsed };
    } catch (err) {
      console.warn("AI simulation generation failed, using defaults:", err.message);
    }

    // Combine results
    const fullResults = {
      ...resultsData,
      aiInsights
    };

    // Save Simulation
    const simulation = await Simulation.create({
      userId,
      scenarioType: scenario.title,
      assumptions: {
        reductionFactor: scenario.reductionFactor,
        baseCost: scenario.baseCost,
        annualSavings: scenario.annualSavings,
        targetCategory: scenario.category
      },
      results: fullResults
    });

    return res.status(201).json({ success: true, data: simulation });
  } catch (error) {
    console.error(`Error in runSimulation: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get simulation history
// @route   GET /api/simulator/history
// @access  Private
const getSimulationHistory = async (req, res) => {
  try {
    const simulations = await Simulation.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: simulations.length,
      data: simulations
    });
  } catch (error) {
    console.error(`Error in getSimulationHistory: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  runSimulation,
  getSimulationHistory
};
