"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { activityService, CreateActivityDTO, ActivityDocument } from "@/services/activityService";
import { calculateCarbonImpact, CarbonCalculationParams } from "@/utils/carbonCalculator";
import { toast } from "sonner";

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  activityToEdit?: ActivityDocument | null;
}

const CATEGORIES = [
  { value: "Transport", label: "Transport" },
  { value: "Energy", label: "Energy" },
  { value: "Food", label: "Food" },
  { value: "Shopping", label: "Shopping" },
  { value: "Waste", label: "Waste" },
  { value: "Water", label: "Water" },
  { value: "Other", label: "Other" },
];

export function LogActivityModal({ isOpen, onClose, onSave, activityToEdit }: LogActivityModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<CreateActivityDTO>({
    title: "",
    activityType: "",
    description: "",
    carbonEmission: 0,
    category: "",
    date: new Date().toISOString().split('T')[0],
    notes: "",
  });

  const [calcParams, setCalcParams] = useState<CarbonCalculationParams>({ category: "" });
  const [manualEmission, setManualEmission] = useState<string>("");

  const estimatedCarbon = calculateCarbonImpact({
    ...calcParams,
    category: formData.category
  });

  useEffect(() => {
    if (activityToEdit && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: activityToEdit.title || activityToEdit.activityType, // fallback to old schema
        activityType: activityToEdit.activityType,
        description: activityToEdit.description || "",
        carbonEmission: activityToEdit.carbonEmission,
        category: activityToEdit.category,
        date: new Date(activityToEdit.date).toISOString().split('T')[0],
        notes: activityToEdit.notes || "",
      });
    } else if (isOpen) {
      setFormData({
        title: "",
        activityType: "",
        description: "",
        carbonEmission: 0,
        category: "",
        date: new Date().toISOString().split('T')[0],
        notes: "",
      });
      setManualEmission("");
      setCalcParams({ category: "" });
    }
    setError("");
  }, [activityToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleManualEmissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualEmission(e.target.value);
  };

  const handleCalcParamChange = (name: string, value: string | number) => {
    setCalcParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const finalEmission = manualEmission !== "" ? parseFloat(manualEmission) : (estimatedCarbon > 0 ? estimatedCarbon : formData.carbonEmission);
      
      const submitData = {
        ...formData,
        carbonEmission: finalEmission
      };

      const savePromise = activityToEdit
        ? activityService.updateActivity(activityToEdit._id, submitData)
        : activityService.createActivity(submitData);

      toast.promise(savePromise, {
        loading: activityToEdit ? "Updating activity..." : "Logging activity...",
        success: (data: any) => {
          if (!activityToEdit) {
            const { newlyUnlocked, newlyCompletedChallenges } = data || {};
            if (newlyUnlocked && newlyUnlocked.length > 0) {
              setTimeout(() => {
                toast.success("🏆 Achievement Unlocked!", {
                  description: `You just unlocked ${newlyUnlocked.length} new achievement(s)!`,
                });
              }, 500);
            }
            if (newlyCompletedChallenges && newlyCompletedChallenges.length > 0) {
              setTimeout(() => {
                toast.success("🏆 Challenge Completed!", {
                  description: `You completed ${newlyCompletedChallenges.length} challenge(s)!`,
                });
              }, 500);
            }
          }
          return activityToEdit ? "Activity updated successfully" : "Activity logged successfully";
        },
        error: "Failed to log activity"
      });

      await savePromise;
      onSave(); // Trigger parent refresh
      onClose(); // Close modal
    } catch (err: unknown) {
      setError((err instanceof Error ? (err instanceof Error ? (err as Error).message : String(err)) : String(err)) || "Failed to save activity");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{activityToEdit ? "Edit Activity" : "Log New Activity"}</DialogTitle>
            <DialogDescription>
              {activityToEdit ? "Update the details of your tracked activity." : "Track your carbon footprint by logging a new activity."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityType">Activity Type *</Label>
                <Input
                  id="activityType"
                  name="activityType"
                  placeholder="e.g. Flight, Commute"
                  value={formData.activityType}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Morning train ride"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {formData.category === "Transport" && (
              <div className="grid grid-cols-2 gap-4 bg-muted/50 p-3 rounded-lg border">
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <Select value={calcParams.vehicleType || ""} onValueChange={(val) => handleCalcParamChange("vehicleType", val)}>
                    <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol Car">Petrol Car</SelectItem>
                      <SelectItem value="Diesel Car">Diesel Car</SelectItem>
                      <SelectItem value="Electric Vehicle">Electric Vehicle</SelectItem>
                      <SelectItem value="Bus">Bus</SelectItem>
                      <SelectItem value="Train">Train</SelectItem>
                      <SelectItem value="Flight">Flight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Distance (km)</Label>
                  <Input type="number" min="0" step="0.1" value={calcParams.distance || ""} onChange={(e) => handleCalcParamChange("distance", parseFloat(e.target.value) || 0)} placeholder="e.g. 15" />
                </div>
              </div>
            )}
            
            {formData.category === "Energy" && (
              <div className="space-y-2 bg-muted/50 p-3 rounded-lg border">
                <Label>Electricity Consumption (kWh)</Label>
                <Input type="number" min="0" step="0.1" value={calcParams.electricity || ""} onChange={(e) => handleCalcParamChange("electricity", parseFloat(e.target.value) || 0)} placeholder="e.g. 100" />
              </div>
            )}

            {formData.category === "Water" && (
              <div className="space-y-2 bg-muted/50 p-3 rounded-lg border">
                <Label>Water Consumption (liters)</Label>
                <Input type="number" min="0" step="1" value={calcParams.waterUsage || ""} onChange={(e) => handleCalcParamChange("waterUsage", parseFloat(e.target.value) || 0)} placeholder="e.g. 500" />
              </div>
            )}

            {formData.category === "Food" && (
              <div className="space-y-2 bg-muted/50 p-3 rounded-lg border">
                <Label>Meal Type</Label>
                <Select value={calcParams.mealType || ""} onValueChange={(val) => handleCalcParamChange("mealType", val)}>
                  <SelectTrigger><SelectValue placeholder="Select meal" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beef">Beef</SelectItem>
                    <SelectItem value="Chicken">Chicken</SelectItem>
                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="Vegan">Vegan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.category === "Shopping" && (
              <div className="space-y-2 bg-muted/50 p-3 rounded-lg border">
                <Label>Shopping Impact</Label>
                <Select value={calcParams.shoppingImpact || ""} onValueChange={(val) => handleCalcParamChange("shoppingImpact", val)}>
                  <SelectTrigger><SelectValue placeholder="Select impact" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low Impact">Low Impact</SelectItem>
                    <SelectItem value="Medium Impact">Medium Impact</SelectItem>
                    <SelectItem value="High Impact">High Impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {formData.category && estimatedCarbon > 0 && (
              <div className="bg-primary/10 border border-primary/20 p-3 rounded-md flex items-center justify-between">
                <span className="text-sm font-medium">Estimated Carbon Impact:</span>
                <span className="text-sm font-bold text-primary">{estimatedCarbon} kg CO2e</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Brief details about the activity"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carbonEmission">Carbon Impact (kg CO2e) {estimatedCarbon > 0 ? "(Optional override)" : "*"}</Label>
                <Input
                  id="carbonEmission"
                  name="carbonEmission"
                  type="number"
                  step="0.01"
                  min="-10000"
                  max="10000"
                  value={manualEmission}
                  onChange={handleManualEmissionChange}
                  placeholder={estimatedCarbon > 0 ? `${estimatedCarbon} (Auto-calculated)` : (activityToEdit ? activityToEdit.carbonEmission.toString() : "0")}
                  required={estimatedCarbon === 0 && !activityToEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                placeholder="Optional internal notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Saving..." : activityToEdit ? "Update Activity" : "Save Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
