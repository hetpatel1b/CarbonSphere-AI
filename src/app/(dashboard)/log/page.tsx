import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Car, Zap, Apple, ShoppingBag } from "lucide-react"

const activities = [
  { id: "1", type: "Transport", desc: "Commute by train (15km)", date: "Today, 09:00 AM", impact: "-2.5 kg CO2e", icon: Car },
  { id: "2", type: "Energy", desc: "Paid electricity bill (Green tariff)", date: "Yesterday, 14:30 PM", impact: "Neutral", icon: Zap },
  { id: "3", type: "Food", desc: "Plant-based lunch", date: "Oct 24, 12:45 PM", impact: "-1.2 kg CO2e", icon: Apple },
  { id: "4", type: "Shopping", desc: "Bought second-hand clothes", date: "Oct 22, 16:20 PM", impact: "-5.0 kg CO2e", icon: ShoppingBag },
  { id: "5", type: "Transport", desc: "Flight to New York (Economy)", date: "Oct 15, 08:00 AM", impact: "+450 kg CO2e", icon: Car },
]

export default function LogActivityPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-muted-foreground mt-1">Track and manage your sustainability actions.</p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="h-4 w-4" />
          Log Activity
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>A complete history of your logged events.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search activities..." className="pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <activity.icon className="h-4 w-4 text-primary" />
                        </div>
                        {activity.type}
                      </div>
                    </TableCell>
                    <TableCell>{activity.desc}</TableCell>
                    <TableCell className="text-muted-foreground">{activity.date}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={activity.impact.startsWith("-") ? "default" : activity.impact === "Neutral" ? "secondary" : "destructive"}>
                        {activity.impact}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
