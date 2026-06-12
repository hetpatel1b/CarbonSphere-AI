const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Models
const User = require('../src/models/User');
const Activity = require('../src/models/Activity');
const CarbonLog = require('../src/models/CarbonLog');
const Challenge = require('../src/models/Challenge');
const UserChallenge = require('../src/models/UserChallenge');
const Achievement = require('../src/models/Achievement');
const UserAchievement = require('../src/models/UserAchievement');
const OffsetProject = require('../src/models/OffsetProject');
const OffsetPurchase = require('../src/models/OffsetPurchase');
const Report = require('../src/models/Report');
const Simulation = require('../src/models/Simulation');
const UserAction = require('../src/models/UserAction');

dotenv.config({ path: path.join(__dirname, '../.env') });

const DEMO_EMAIL = 'demo@carbonsphere.ai';
const DEMO_PASSWORD = 'password123';
const DEMO_NAME = 'Het Patel';

const seedDemoData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected for demo seeding...');
    } else {
      console.log('MongoDB already connected.');
    }

    // 1. CLEAR EXISTING DEMO DATA
    const existingDemoUser = await User.findOne({ email: DEMO_EMAIL });
    let demoUserId;

    if (existingDemoUser) {
      demoUserId = existingDemoUser._id;
      console.log(`Deleting existing data for demo user: ${demoUserId}`);
      
      await CarbonLog.deleteMany({ userId: demoUserId });
      await UserChallenge.deleteMany({ userId: demoUserId });
      await UserAchievement.deleteMany({ userId: demoUserId });
      await OffsetPurchase.deleteMany({ userId: demoUserId });
      await Report.deleteMany({ userId: demoUserId });
      await Simulation.deleteMany({ userId: demoUserId });
      await UserAction.deleteMany({ userId: demoUserId });
      await User.deleteOne({ _id: demoUserId });
    }

    // 2. CREATE DEMO USER
    console.log('Creating demo user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, salt);

    const demoUser = new User({
      name: DEMO_NAME,
      email: DEMO_EMAIL,
      password: hashedPassword,
      avatar: '/avatars/het.png',
      location: 'San Francisco, CA',
      totalCarbonSaved: 1250,
      totalActivities: 28,
      totalChallenges: 5,
      totalAchievements: 3,
      preferences: {
        goal: "neutrality",
        transport: "public",
        energy: "renewable",
        dietary: "balanced",
        compactView: false,
        darkMode: true,
        reduceAnimations: false
      }
    });

    await demoUser.save();
    demoUserId = demoUser._id;
    console.log(`Demo user created with ID: ${demoUserId}`);

    // Fetch activities for carbon logs
    const activities = await Activity.find();
    if (activities.length === 0) {
      console.warn('No global activities found to seed carbon logs. Run seedActivities.js first.');
      process.exit(1);
    }

    // Helper to get random activity from a category
    const getActivityByCategory = (cat) => {
      const filtered = activities.filter(a => a.category === cat);
      if (filtered.length === 0) return activities[Math.floor(Math.random() * activities.length)];
      return filtered[Math.floor(Math.random() * filtered.length)];
    };

    // 3. SEED CARBON LOGS (Activities)
    console.log('Seeding carbon logs...');
    const now = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    for (let i = 0; i < 28; i++) {
      // Random date within the last 90 days
      const daysAgo = Math.floor(Math.random() * 90);
      const logDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      const monthStr = months[logDate.getMonth()];
      
      const categories = ['Transport', 'Energy', 'Food', 'Shopping', 'Water'];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      
      const activity = getActivityByCategory(cat);
      const emission = Math.random() * 50 + 10; // Random emission 10-60

      await CarbonLog.create({
        userId: demoUserId,
        activityId: activity._id,
        carbonEmission: parseFloat(emission.toFixed(2)),
        category: cat,
        month: monthStr,
        year: logDate.getFullYear(),
        createdAt: logDate
      });
    }

    // 4. SEED CHALLENGES
    console.log('Seeding challenges...');
    const allChallenges = await Challenge.find();
    if (allChallenges.length >= 5) {
      // 3 Active
      for (let i = 0; i < 3; i++) {
        await UserChallenge.create({
          userId: demoUserId,
          challengeId: allChallenges[i]._id,
          progress: Math.floor(Math.random() * 80) + 10,
          completed: false,
          joinedAt: new Date(now.getTime() - (Math.random() * 10 * 24 * 60 * 60 * 1000))
        });
      }
      // 2 Completed
      for (let i = 3; i < 5; i++) {
        await UserChallenge.create({
          userId: demoUserId,
          challengeId: allChallenges[i]._id,
          progress: 100,
          completed: true,
          joinedAt: new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
        });
      }
    } else {
      console.warn('Not enough global challenges to seed. Run seedChallenges.js first.');
    }

    // 5. SEED ACHIEVEMENTS
    console.log('Seeding achievements...');
    const allAchievements = await Achievement.find();
    if (allAchievements.length >= 3) {
      for (let i = 0; i < 3; i++) {
        await UserAchievement.create({
          userId: demoUserId,
          achievementId: allAchievements[i]._id,
          unlockedAt: new Date(now.getTime() - (Math.random() * 60 * 24 * 60 * 60 * 1000))
        });
      }
    }

    // 6. SEED MARKETPLACE PURCHASES
    console.log('Seeding offset purchases...');
    const offsetProjects = await OffsetProject.find();
    if (offsetProjects.length > 0) {
      await OffsetPurchase.create({
        userId: demoUserId,
        projectId: offsetProjects[0]._id,
        credits: 5,
        cost: offsetProjects[0].costPerTon * 5
      });
      if (offsetProjects.length > 1) {
        await OffsetPurchase.create({
          userId: demoUserId,
          projectId: offsetProjects[1]._id,
          credits: 10,
          cost: offsetProjects[1].costPerTon * 10
        });
      }
    }

    // 7. SEED REPORTS
    console.log('Seeding reports...');
    await Report.create({
      userId: demoUserId,
      reportType: 'monthly',
      reportData: {
        month: months[now.getMonth() === 0 ? 11 : now.getMonth() - 1],
        totalEmissions: 320,
        topCategory: 'Transport',
        savedEmissions: 45
      },
      generatedAt: new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000))
    });
    
    await Report.create({
      userId: demoUserId,
      reportType: 'comprehensive',
      reportData: {
        year: now.getFullYear(),
        totalEmissions: 4200,
        averageMonthly: 350,
        offsetAmount: 15
      },
      generatedAt: new Date(now.getTime() - (15 * 24 * 60 * 60 * 1000))
    });

    // 8. SEED SIMULATIONS
    console.log('Seeding simulations...');
    await Simulation.create({
      userId: demoUserId,
      scenarioType: 'EV Transition',
      assumptions: {
        currentVehicleMpg: 25,
        annualMileage: 12000,
        evEfficiencyKwhPer100Mi: 30
      },
      results: {
        annualSavingsCo2: 2.4,
        paybackPeriodYears: 5.2
      },
      createdAt: new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000))
    });
    await Simulation.create({
      userId: demoUserId,
      scenarioType: 'Solar Panel Installation',
      assumptions: {
        systemSizeKw: 5,
        sunlightHoursPerDay: 4.5
      },
      results: {
        annualSavingsCo2: 3.1,
        paybackPeriodYears: 6.8
      },
      createdAt: new Date(now.getTime() - (10 * 24 * 60 * 60 * 1000))
    });

    // 9. SEED USER ACTIONS (Forecast / Action Plan)
    console.log('Seeding user actions for forecast...');
    await UserAction.create({
      userId: demoUserId,
      actionTitle: 'Switch to Renewable Energy Plan',
      category: 'Energy',
      reduction: 15,
      difficulty: 'Medium',
      impact: 'High',
      status: 'active'
    });
    await UserAction.create({
      userId: demoUserId,
      actionTitle: 'Carpool twice a week',
      category: 'Transport',
      reduction: 5,
      difficulty: 'Easy',
      impact: 'Medium',
      status: 'active'
    });
    await UserAction.create({
      userId: demoUserId,
      actionTitle: 'Plant a tree',
      category: 'General',
      reduction: 2,
      difficulty: 'Easy',
      impact: 'Low',
      status: 'completed'
    });

    console.log('✅ Demo Data Seeded Successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  }
};

// Export the function for use in the API endpoint
module.exports = seedDemoData;

// Run directly if called from command line
if (require.main === module) {
  seedDemoData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
