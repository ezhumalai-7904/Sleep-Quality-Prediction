import { Button } from './ui/button';
import { Moon, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Moon className="w-24 h-24 text-gray-800 animate-pulse" strokeWidth={1.5} />
            <Sparkles className="w-8 h-8 text-gray-600 absolute -top-2 -right-2" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl mb-4 text-gray-900">
          Sleep Quality Predictor 😴
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto">
          Find out how your habits affect your sleep.
        </p>

        {/* CTA Button */}
        <Button
          onClick={onGetStarted}
          size="lg"
          className="bg-black hover:bg-gray-800 text-white px-12 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Get Started
        </Button>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-8 text-gray-600">
          <div className="text-center">
            <div className="text-3xl mb-2">🌙</div>
            <p className="text-sm">Better Sleep</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm">Track Habits</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-sm">Get Insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}
