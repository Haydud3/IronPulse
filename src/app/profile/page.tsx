"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserPreferences } from "@/lib/firestore-models";

type AllEquipment = string[];

export default function ProfilePage() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [allEquipment, setAllEquipment] = useState<AllEquipment>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchPreferences = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/user/preferences');
          const data = await response.json();
          setPreferences(data.preferences);
          setAllEquipment(data.allEquipment);
        } catch (error) {
          console.error("Failed to fetch preferences:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPreferences();
    }
  }, [user]);

  const handleSplitChange = (value: string) => {
    if (preferences) {
      setPreferences({ ...preferences, workoutSplit: value as UserPreferences['workoutSplit'] });
    }
  };

  const handleEquipmentChange = (item: string) => {
    if (preferences) {
      const newEquipment = preferences.availableEquipment.includes(item)
        ? preferences.availableEquipment.filter(eq => eq !== item)
        : [...preferences.availableEquipment, item];
      setPreferences({ ...preferences, availableEquipment: newEquipment });
    }
  };

  const handleSave = async () => {
    if (!preferences) return;
    setSaving(true);
    try {
      await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences }),
      });
      // Here you might want to show a toast notification
      alert("Preferences saved!");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      alert("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-8">Loading profile...</p>;
  }

  if (!user || !preferences) {
    return <p className="p-8">Please log in to view your profile.</p>;
  }

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Profile & Preferences</h1>
        <p className="text-muted-foreground">
          Welcome, {user.displayName || 'user'}! Customize your workout experience.
        </p>
      </header>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Workout Split</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={preferences.workoutSplit} onValueChange={handleSplitChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full-body" id="full-body" />
                <Label htmlFor="full-body">Full Body</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upper-lower" id="upper-lower" />
                <Label htmlFor="upper-lower">Upper/Lower</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ppl" id="ppl" />
                <Label htmlFor="ppl">Push/Pull/Legs (PPL)</Label>
              </div>
               <div className="flex items-center space-x-2">
                <RadioGroupItem value="body-part" id="body-part" />
                <Label htmlFor="body-part">Body Part Split</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Equipment</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allEquipment.map(item => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={item}
                  checked={preferences.availableEquipment.includes(item)}
                  onCheckedChange={() => handleEquipmentChange(item)}
                />
                <Label htmlFor={item} className="leading-none">{item}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
}
