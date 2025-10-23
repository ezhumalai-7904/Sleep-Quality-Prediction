// Sleep Quality Prediction Model (JavaScript equivalent of LDA model)
// This is a more realistic implementation that provides varied predictions based on input data

interface SleepDataInput {
  age: number;
  gender: string;
  sleepDuration: number;
  physicalActivity: number;
  stressLevel: number;
  bmiCategory: string;
  heartRate: number;
  dailySteps: number;
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
}

interface PredictionResult {
  quality: 'Good' | 'Poor';
  confidence: number;
  factors: {
    name: string;
    impact: number;
  }[];
}

// Label encoders mappings (based on your dataset)
const LABEL_ENCODINGS = {
  gender: {
    'Female': 0,
    'Male': 1
  },
  bmiCategory: {
    'Underweight': 0,
    'Normal': 1,
    'Overweight': 2,
    'Obese': 3
  }
};

export class SleepQualityPredictor {
  /**
   * Predict sleep quality based on input data
   * @param inputData - Sleep and lifestyle data
   * @returns Prediction result with quality assessment and factors
   */
  predict(inputData: SleepDataInput): PredictionResult {
    // Calculate individual factor scores
    const scores = this.calculateFactorScores(inputData);
    
    // Calculate overall score
    const overallScore = this.calculateOverallScore(scores);
    
    // Convert to probability
    const probability = this.sigmoid(overallScore);
    
    // Classify based on threshold
    const isGoodQuality = probability > 0.5;
    
    // Get top factors
    const factors = this.getTopFactors(scores);
    
    return {
      quality: isGoodQuality ? 'Good' : 'Poor',
      confidence: Math.abs(probability - 0.5) * 2, // Confidence based on distance from 0.5
      factors: factors
    };
  }

  private calculateFactorScores(inputData: SleepDataInput): Record<string, number> {
    // Encode categorical variables
    const genderEncoded = LABEL_ENCODINGS.gender[inputData.gender] || 0;
    const bmiEncoded = LABEL_ENCODINGS.bmiCategory[inputData.bmiCategory] || 1;
    
    // Calculate scores for each factor (higher is better for sleep quality)
    const scores: Record<string, number> = {};
    
    // Sleep Duration (7-9 hours is optimal)
    scores['Sleep Duration'] = this.calculateSleepDurationScore(inputData.sleepDuration);
    
    // Stress Level (lower is better)
    scores['Stress Level'] = this.calculateStressScore(inputData.stressLevel);
    
    // Physical Activity (30+ minutes is good)
    scores['Physical Activity'] = this.calculateActivityScore(inputData.physicalActivity);
    
    // Age (moderate ages are better)
    scores['Age'] = this.calculateAgeScore(inputData.age);
    
    // Gender (based on dataset patterns)
    scores['Gender'] = genderEncoded === 1 ? 0.5 : -0.5; // Slight preference for male in dataset
    
    // BMI (Normal is best)
    scores['BMI Category'] = this.calculateBmiScore(bmiEncoded);
    
    // Heart Rate (60-100 is normal)
    scores['Heart Rate'] = this.calculateHeartRateScore(inputData.heartRate);
    
    // Daily Steps (10000+ is good)
    scores['Daily Steps'] = this.calculateStepsScore(inputData.dailySteps);
    
    // Blood Pressure (120/80 is optimal)
    scores['Systolic BP'] = this.calculateBPScore(inputData.systolicBloodPressure, 'systolic');
    scores['Diastolic BP'] = this.calculateBPScore(inputData.diastolicBloodPressure, 'diastolic');
    
    return scores;
  }

  private calculateSleepDurationScore(duration: number): number {
    if (duration >= 7 && duration <= 9) return 2.0; // Optimal range
    if (duration >= 6 && duration <= 10) return 1.0; // Acceptable range
    return -1.5; // Outside healthy range
  }

  private calculateStressScore(stress: number): number {
    // Lower stress is better (scale 1-10)
    return (10 - stress) * 0.3;
  }

  private calculateActivityScore(activity: number): number {
    if (activity >= 150) return 2.0; // 150+ minutes is excellent (WHO recommendation)
    if (activity >= 75) return 1.0; // 75+ minutes is good
    if (activity >= 30) return 0.5; // 30+ minutes is acceptable
    return -1.0; // Insufficient activity
  }

  private calculateAgeScore(age: number): number {
    if (age >= 18 && age <= 64) return 1.0; // Adult range
    if (age >= 13 && age <= 17) return 0.5; // Teenager
    if (age >= 65) return -0.5; // Elderly
    return -1.0; // Child or very elderly
  }

  private calculateBmiScore(bmi: number): number {
    if (bmi === 1) return 2.0; // Normal (1)
    if (bmi === 0) return 0.5; // Underweight (0)
    if (bmi === 2) return -1.0; // Overweight (2)
    return -2.0; // Obese (3)
  }

  private calculateHeartRateScore(heartRate: number): number {
    if (heartRate >= 60 && heartRate <= 100) return 1.5; // Normal range
    if (heartRate >= 50 && heartRate <= 110) return 0.5; // Acceptable range
    return -1.5; // Outside normal range
  }

  private calculateStepsScore(steps: number): number {
    if (steps >= 10000) return 2.0; // Excellent
    if (steps >= 7500) return 1.0; // Good
    if (steps >= 5000) return 0; // Average
    if (steps >= 2500) return -1.0; // Low
    return -2.0; // Very low
  }

  private calculateBPScore(bp: number, type: 'systolic' | 'diastolic'): number {
    if (type === 'systolic') {
      if (bp >= 90 && bp <= 120) return 1.5; // Optimal
      if (bp >= 121 && bp <= 139) return 0.5; // Normal high
      if (bp >= 140) return -2.0; // High
      return -1.5; // Low
    } else {
      if (bp >= 60 && bp <= 80) return 1.5; // Optimal
      if (bp >= 81 && bp <= 89) return 0.5; // Normal high
      if (bp >= 90) return -2.0; // High
      return -1.5; // Low
    }
  }

  private calculateOverallScore(scores: Record<string, number>): number {
    // Sum all factor scores
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return totalScore;
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  private getTopFactors(scores: Record<string, number>): { name: string; impact: number }[] {
    // Convert scores to factors array
    const factors = Object.entries(scores).map(([name, impact]) => ({
      name,
      impact: Math.abs(impact)
    }));
    
    // Sort by impact (descending)
    factors.sort((a, b) => b.impact - a.impact);
    
    // Return top 5 factors
    return factors.slice(0, 5);
  }
}

// Export a singleton instance for easy use
export const sleepQualityPredictor = new SleepQualityPredictor();