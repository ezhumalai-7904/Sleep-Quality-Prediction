import { Card } from './ui/card';
import { Button } from './ui/button';
import { PredictionResult } from '../App';
import { CheckCircle2, XCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultPageProps {
  result: PredictionResult;
  onTryAgain: () => void;
  onViewDashboard: () => void;
}

export function ResultPage({ result, onTryAgain, onViewDashboard }: ResultPageProps) {
  const isGood = result.quality === 'Good';
  const confidencePercentage = Math.round(result.confidence * 100);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 py-12">
      <Card className="max-w-3xl w-full p-8 bg-white border-gray-200 shadow-xl">
        {/* Result Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {isGood ? (
              <CheckCircle2 className="w-24 h-24 text-green-600 animate-pulse" strokeWidth={1.5} />
            ) : (
              <XCircle className="w-24 h-24 text-red-600 animate-pulse" strokeWidth={1.5} />
            )}
          </div>
          
          <h2 className="text-5xl text-gray-900 mb-4">
            {isGood ? 'Good Sleep Quality! 🌙' : 'Poor Sleep Quality 😴'}
          </h2>
          
          <p className="text-xl text-gray-600">
            {isGood 
              ? `Your sleep quality is good (${confidencePercentage}% confidence). Keep up your healthy routine!`
              : `Your sleep quality needs improvement (${confidencePercentage}% confidence). Consider adjusting your habits.`}
          </p>
        </div>

        {/* Factors Chart */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gray-700" />
            <h3 className="text-xl text-gray-900">
              Factors Affecting Your Sleep
            </h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={result.factors}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="#374151"
                  tick={{ fill: '#374151', fontSize: 12 }}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#374151"
                  tick={{ fill: '#374151' }}
                  label={{ value: 'Impact Score', angle: -90, position: 'insideLeft', fill: '#374151' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#000'
                  }}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Bar dataKey="impact" radius={[8, 8, 0, 0]}>
                  {result.factors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`rgba(0, 0, 0, ${0.9 - index * 0.15})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
            💡 Tips for Better Sleep
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Aim for 7-9 hours of sleep per night</li>
            <li>• Reduce screen time at least 1 hour before bed</li>
            <li>• Limit caffeine intake, especially after 2 PM</li>
            <li>• Exercise regularly, but not right before bedtime</li>
            <li>• Create a relaxing bedtime routine</li>
            <li>• Keep your bedroom cool, dark, and quiet</li>
            <li>• Manage stress through meditation or journaling</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onTryAgain}
            className="flex-1 bg-black hover:bg-gray-800 text-white py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Try Again
          </Button>
          <Button
            onClick={onViewDashboard}
            variant="outline"
            className="flex-1 border-2 border-gray-300 text-gray-900 hover:bg-gray-100 py-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <BarChart3 className="w-5 h-5" />
            View Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}