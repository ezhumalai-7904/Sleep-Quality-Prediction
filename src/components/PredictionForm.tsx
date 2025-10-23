import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SleepData } from '../App';
import { Activity, Brain, Clock, Coffee, Monitor, Moon, Briefcase, Heart, Ruler, Dumbbell } from 'lucide-react';

interface PredictionFormProps {
  onSubmit: (data: SleepData) => void;
}

export function PredictionForm({ onSubmit }: PredictionFormProps) {
  const [formData, setFormData] = useState<SleepData>({
    age: 30,
    gender: 'male',
    sleepDuration: 7,
    caffeineIntake: 100,
    screenTime: 4,
    physicalActivity: 30,
    stressLevel: 5,
    workHours: 8,
    bmiCategory: 'Normal',
    heartRate: 70,
    dailySteps: 5000,
    systolicBP: 120,
    diastolicBP: 80,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 py-12">
      <Card className="max-w-3xl w-full p-8 bg-white border-gray-200 shadow-xl">
        <div className="mb-8">
          <h2 className="text-4xl text-gray-900 mb-2 flex items-center gap-3">
            <Moon className="w-10 h-10 text-gray-800" />
            Sleep Quality Prediction
          </h2>
          <p className="text-gray-600">
            Enter your daily habits to predict your sleep quality
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Age & Gender Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-gray-700 flex items-center gap-2">
                <span>Age</span>
              </Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-700">
                Gender
              </Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sleep Duration */}
          <div className="space-y-3">
            <Label className="text-gray-700 flex items-center gap-2">
              <Moon className="w-4 h-4 text-gray-700" />
              Sleep Duration: {formData.sleepDuration} hours
            </Label>
            <Slider
              value={[formData.sleepDuration]}
              onValueChange={([value]) => setFormData({ ...formData, sleepDuration: value })}
              min={0}
              max={14}
              step={0.5}
              className="py-2"
            />
          </div>

          {/* Caffeine Intake */}
          <div className="space-y-3">
            <Label className="text-gray-700 flex items-center gap-2">
              <Coffee className="w-4 h-4 text-gray-700" />
              Caffeine Intake: {formData.caffeineIntake} mg/day
            </Label>
            <Slider
              value={[formData.caffeineIntake]}
              onValueChange={([value]) => setFormData({ ...formData, caffeineIntake: value })}
              min={0}
              max={600}
              step={10}
              className="py-2"
            />
          </div>

          {/* Screen Time */}
          <div className="space-y-3">
            <Label className="text-gray-700 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-gray-700" />
              Screen Time: {formData.screenTime} hours/day
            </Label>
            <Slider
              value={[formData.screenTime]}
              onValueChange={([value]) => setFormData({ ...formData, screenTime: value })}
              min={0}
              max={16}
              step={0.5}
              className="py-2"
            />
          </div>

          {/* Physical Activity */}
          <div className="space-y-3">
            <Label className="text-gray-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-700" />
              Physical Activity: {formData.physicalActivity} minutes/day
            </Label>
            <Slider
              value={[formData.physicalActivity]}
              onValueChange={([value]) => setFormData({ ...formData, physicalActivity: value })}
              min={0}
              max={180}
              step={5}
              className="py-2"
            />
          </div>

          {/* Stress Level */}
          <div className="space-y-3">
            <Label className="text-gray-700 flex items-center gap-2">
              <Brain className="w-4 h-4 text-gray-700" />
              Stress Level: {formData.stressLevel}/10
            </Label>
            <Slider
              value={[formData.stressLevel]}
              onValueChange={([value]) => setFormData({ ...formData, stressLevel: value })}
              min={1}
              max={10}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Work Hours */}
          <div className="space-y-3">
            <Label className="text-gray-700 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-700" />
              Work Hours: {formData.workHours} hours/day
            </Label>
            <Slider
              value={[formData.workHours]}
              onValueChange={([value]) => setFormData({ ...formData, workHours: value })}
              min={0}
              max={16}
              step={0.5}
              className="py-2"
            />
          </div>

          {/* BMI Category */}
          <div className="space-y-2">
            <Label htmlFor="bmiCategory" className="text-gray-700 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-gray-700" />
              BMI Category
            </Label>
            <Select value={formData.bmiCategory} onValueChange={(value) => setFormData({ ...formData, bmiCategory: value })}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Select BMI category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Underweight">Underweight</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Overweight">Overweight</SelectItem>
                <SelectItem value="Obese">Obese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Heart Rate */}
          <div className="space-y-2">
            <Label htmlFor="heartRate" className="text-gray-700 flex items-center gap-2">
              <Heart className="w-4 h-4 text-gray-700" />
              Heart Rate: {formData.heartRate} bpm
            </Label>
            <Slider
              value={[formData.heartRate || 70]}
              onValueChange={([value]) => setFormData({ ...formData, heartRate: value })}
              min={40}
              max={120}
              step={1}
              className="py-2"
            />
          </div>

          {/* Daily Steps */}
          <div className="space-y-2">
            <Label htmlFor="dailySteps" className="text-gray-700 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-gray-700" />
              Daily Steps: {formData.dailySteps}
            </Label>
            <Slider
              value={[formData.dailySteps || 5000]}
              onValueChange={([value]) => setFormData({ ...formData, dailySteps: value })}
              min={0}
              max={20000}
              step={100}
              className="py-2"
            />
          </div>

          {/* Blood Pressure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="systolicBP" className="text-gray-700">
                Systolic BP: {formData.systolicBP} mmHg
              </Label>
              <Slider
                value={[formData.systolicBP || 120]}
                onValueChange={([value]) => setFormData({ ...formData, systolicBP: value })}
                min={90}
                max={180}
                step={1}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diastolicBP" className="text-gray-700">
                Diastolic BP: {formData.diastolicBP} mmHg
              </Label>
              <Slider
                value={[formData.diastolicBP || 80]}
                onValueChange={([value]) => setFormData({ ...formData, diastolicBP: value })}
                min={60}
                max={120}
                step={1}
                className="py-2"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 mt-8"
          >
            Predict My Sleep Quality
          </Button>
        </form>
      </Card>
    </div>
  );
}