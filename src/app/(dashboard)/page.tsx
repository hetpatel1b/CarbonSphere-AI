export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to CarbonSphere AI. Here is your footprint overview.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Sustainability Score</h3>
          </div>
          <div className="text-2xl font-bold text-primary">780</div>
          <p className="text-xs text-muted-foreground mt-1">+15 pts this week</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Monthly Emissions</h3>
          </div>
          <div className="text-2xl font-bold">1.2 tCO2e</div>
          <p className="text-xs text-muted-foreground mt-1">-5% from last month</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Streak</h3>
          </div>
          <div className="text-2xl font-bold text-accent">12 Days</div>
          <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Goal Status</h3>
          </div>
          <div className="text-2xl font-bold text-yellow-500">On Track</div>
          <p className="text-xs text-muted-foreground mt-1">Target: 1.0 tCO2e/month</p>
        </div>
      </div>
    </div>
  );
}
