"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { activityService, CreateActivityDTO, ActivityDocument } from "@/services/activityService";

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
    }
    setError("");
  }, [activityToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "carbonEmission" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (activityToEdit) {
        await activityService.updateActivity(activityToEdit._id, formData);
      } else {
        await activityService.createActivity(formData);
      }
      onSave(); // Trigger parent refresh
      onClose(); // Close modal
    } catch (err: any) {
      setError(err.message || "Failed to save activity");
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
                  <SelectTrigger>
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
                <Label htmlFor="carbonEmission">Carbon Impact (kg CO2e) *</Label>
                <Input
                  id="carbonEmission"
                  name="carbonEmission"
                  type="number"
                  step="0.01"
                  min="-10000"
                  max="10000"
                  value={formData.carbonEmission}
                  onChange={handleChange}
                  required
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
              {activityToEdit ? "Update Activity" : "Save Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
