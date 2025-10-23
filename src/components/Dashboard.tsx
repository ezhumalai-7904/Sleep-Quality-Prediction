import { Card } from './ui/card';
import { Button } from './ui/button';
import { SleepData } from '../App';
import { ArrowLeft, TrendingUp, Clock, Brain, Moon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  sleepData: SleepData | null;
  onBack: () => void;
}

export function Dashboard({ sleepData, onBack }: DashboardProps) {
  // Mock data for weekly sleep scores
  const weeklyData = [
    { day: 'Mon', sleepHours: 7, stressLevel: 4 },
    { day: 'Tue', sleepHours: 6.5, stressLevel: 6 },
    { day: 'Wed', sleepHours: 8, stressLevel: 3 },
    { day: 'Thu', sleepHours: 7.5, stressLevel: 5 },
    { day: 'Fri', sleepHours: 6, stressLevel: 7 },
    { day: 'Sat', sleepHours: 9, stressLevel: 2 },
    { day: 'Sun', sleepHours: 8.5, stressLevel: 2 },
  ];

  // Calculate average sleep
  const avgSleep = weeklyData.reduce((acc, day) => acc + day.sleepHours, 0) / weeklyData.length;
  const avgStress = weeklyData.reduce((acc, day) => acc + day.stressLevel, 0) / weeklyData.length;

  // Habit comparison data
  const habitData = sleepData ? [
    { habit: 'Sleep', value: (sleepData.sleepDuration / 9) * 100 },
    { habit: 'Activity', value: (sleepData.physicalActivity / 60) * 100 },
    { habit: 'Screen Time', value: 100 - (sleepData.screenTime / 8) * 100 },
    { habit: 'Caffeine', value: 100 - (sleepData.caffeineIntake / 400) * 100 },
    { habit: 'Stress', value: 100 - (sleepData.stressLevel / 10) * 100 },
  ] : [];

  return (
    <div className="min-h-screen p-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-4xl text-gray-900 mb-2 flex items-center gap-3">
              <Moon className="w-10 h-10 text-gray-800" />
              Sleep Dashboard
            </h2>
            <p className="text-gray-600">
              Track your sleep patterns and habits
            </p>
          </div>
          <Button
            onClick={onBack}
            variant="outline"
            className="border-2 border-gray-300 text-gray-900 hover:bg-gray-100 rounded-lg flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white border-gray-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Clock className="w-8 h-8 text-gray-700" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Avg Sleep Duration</p>
                <p className="text-3xl text-gray-900">{avgSleep.toFixed(1)}h</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-gray-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Brain className="w-8 h-8 text-gray-700" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Avg Stress Level</p>
                <p className="text-3xl text-gray-900">{avgStress.toFixed(1)}/10</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-gray-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <TrendingUp className="w-8 h-8 text-gray-700" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Sleep Quality</p>
                <p className="text-3xl text-gray-900">
                  {avgSleep >= 7 && avgStress <= 5 ? 'Good' : 'Fair'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Sleep Duration vs Stress Level */}
          <Card className="p-6 bg-white border-gray-200 shadow-lg">
            <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
              📊 Sleep Duration vs Stress Level
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis 
                  dataKey="day" 
                  stroke="#374151"
                  tick={{ fill: '#374151' }}
                />
                <YAxis 
                  stroke="#374151"
                  tick={{ fill: '#374151' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#000'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#374151' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sleepHours" 
                  stroke="#000" 
                  strokeWidth={3}
                  name="Sleep (hours)"
                  dot={{ fill: '#000', r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="stressLevel" 
                  stroke="#6b7280" 
                  strokeWidth={3}
                  name="Stress Level"
                  dot={{ fill: '#6b7280', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Habit Health Score */}
          <Card className="p-6 bg-white border-gray-200 shadow-lg">
            <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
              💪 Habit Health Score
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={habitData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis 
                  type="number"
                  domain={[0, 100]}
                  stroke="#374151"
                  tick={{ fill: '#374151' }}
                />
                <YAxis 
                  type="category"
                  dataKey="habit" 
                  stroke="#374151"
                  tick={{ fill: '#374151' }}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#000'
                  }}
                  formatter={(value: number) => `${Math.round(value)}%`}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {habitData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value >= 70 ? '#000' : entry.value >= 40 ? '#6b7280' : '#9ca3af'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-6 p-8 bg-white border-gray-200 shadow-lg">
          <h3 className="text-2xl text-gray-900 mb-6 flex items-center gap-2">
            🌟 Tips for Better Sleep
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-900">
                <Moon className="w-5 h-5" />
                <h4 className="text-lg">Sleep Schedule</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Go to bed and wake up at the same time every day, even on weekends. This helps regulate your body's internal clock.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-900">
                <Brain className="w-5 h-5" />
                <h4 className="text-lg">Stress Management</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Practice relaxation techniques like meditation, deep breathing, or yoga before bed to calm your mind.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-900">
                <TrendingUp className="w-5 h-5" />
                <h4 className="text-lg">Stay Active</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Regular physical activity can help you fall asleep faster and enjoy deeper sleep. Avoid exercise close to bedtime.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
