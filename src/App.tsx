import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { PredictionForm } from './components/PredictionForm';
import { ResultPage } from './components/ResultPage';
import { Dashboard } from './components/Dashboard';
import { sleepQualityPredictor } from './models/sleepQualityModel';

export interface SleepData {
  age: number;
  gender: string;
  sleepDuration: number;
  caffeineIntake: number;
  screenTime: number;
  physicalActivity: number;
  stressLevel: number;
  workHours: number;
  bmiCategory?: string;
  heartRate?: number;
  dailySteps?: number;
  systolicBP?: number;
  diastolicBP?: number;
}

export interface PredictionResult {
  quality: 'Good' | 'Poor';
  confidence: number;
  factors: {
    name: string;
    impact: number;
  }[];
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'form' | 'result' | 'dashboard'>('landing');
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [sleepData, setSleepData] = useState<SleepData | null>(null);

  const handlePrediction = (data: SleepData) => {
    setSleepData(data);
    
    // Use our trained model for prediction
    const modelInput = {
      age: data.age,
      gender: data.gender === 'male' ? 'Male' : 'Female',
      sleepDuration: data.sleepDuration,
      physicalActivity: data.physicalActivity,
      stressLevel: data.stressLevel,
      bmiCategory: data.bmiCategory || 'Normal',
      heartRate: data.heartRate || 70,
      dailySteps: data.dailySteps || 5000,
      systolicBloodPressure: data.systolicBP || 120,
      diastolicBloodPressure: data.diastolicBP || 80
    };
    
    const result = sleepQualityPredictor.predict(modelInput);
    
    setPredictionResult(result);
    setCurrentPage('result');
  };

  const handleTryAgain = () => {
    setCurrentPage('form');
  };

  const handleViewDashboard = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {currentPage === 'landing' && (
        <LandingPage onGetStarted={() => setCurrentPage('form')} />
      )}
      {currentPage === 'form' && (
        <PredictionForm onSubmit={handlePrediction} />
      )}
      {currentPage === 'result' && predictionResult && (
        <ResultPage
          result={predictionResult}
          onTryAgain={handleTryAgain}
          onViewDashboard={handleViewDashboard}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard
          sleepData={sleepData}
          onBack={() => setCurrentPage('form')}
        />
      )}
    </div>
  );
}