"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Car, Zap, Apple, ShoppingBag, Leaf, Trash2, Edit2, RefreshCw, Loader2, Droplet, Trash } from "lucide-react"
import { activityService, ActivityDocument } from "@/services/activityService"
import { LogActivityModal } from "@/components/dashboard/LogActivityModal"

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'transport': return Car;
    case 'energy': return Zap;
    case 'food': return Apple;
    case 'shopping': return ShoppingBag;
    case 'water': return Droplet;
    case 'waste': return Trash;
    default: return Leaf;
  }
}

export default function LogActivityPage() {
  const [activities, setActivities] = useState<ActivityDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activityToEdit, setActivityToEdit] = useState<ActivityDocument | null>(null)

  const loadActivities = async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await activityService.getActivities()
      setActivities(data)
    } catch (err: any) {
      setError(err.message || "Failed to load activities")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadActivities()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    try {
      await activityService.deleteActivity(id);
      loadActivities();
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  }

  const openEditModal = (activity: ActivityDocument) => {
    setActivityToEdit(activity);
    setIsModalOpen(true);
  }

  const openCreateModal = () => {
    setActivityToEdit(null);
    setIsModalOpen(true);
  }

  const filteredActivities = activities.filter(act => {
    const matchesCategory = categoryFilter === "all" || act.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch = (act.title || act.activityType).toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (act.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <LogActivityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={loadActivities}
        activityToEdit={activityToEdit}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-muted-foreground mt-1">Track and manage your sustainability actions.</p>
        </div>
        <Button className="shrink-0 gap-2" onClick={openCreateModal}>
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
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto items-center">
              <Button variant="outline" size="icon" onClick={loadActivities} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search activities..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="waste">Waste</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}
          
          <div className="rounded-md border w-full overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title & Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Impact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : filteredActivities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No activities found. Log your first activity!
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredActivities.map((activity) => {
                    const Icon = getCategoryIcon(activity.category);
                    return (
                      <TableRow key={activity._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <span className="capitalize">{activity.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold">{activity.title || activity.activityType}</span>
                            {activity.description && <span className="text-xs text-muted-foreground">{activity.description}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={activity.carbonEmission <= 0 ? "default" : "destructive"}>
                            {activity.carbonEmission > 0 ? "+" : ""}{activity.carbonEmission} kg CO2e
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(activity)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(activity._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredActivities.length < 10}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
