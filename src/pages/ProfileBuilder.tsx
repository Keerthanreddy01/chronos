import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLifeStore } from '../store/useLifeStore';
import { Step1Basics } from '../components/wizard/Step1Basics';
import { Step2Season } from '../components/wizard/Step2Season';
import { Step3Favorites } from '../components/wizard/Step3Favorites';
import { Step4BucketList } from '../components/wizard/Step4BucketList';
import { Step5Numbers } from '../components/wizard/Step5Numbers';

export function ProfileBuilder() {
  const navigate = useNavigate();
  const { onboardingStep, setOnboardingStep, setIsOnboarded } = useLifeStore();
  const [step, setStep] = useState(onboardingStep || 1);

  useEffect(() => {
    setOnboardingStep(step);
  }, [step, setOnboardingStep]);

  const goNext = () => setStep((s) => Math.min(5, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));
  const skipToNumbers = () => setStep(5);

  const finish = () => {
    setIsOnboarded(true);
    navigate('/preview');
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1917]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="text-sm text-[#6b625c] mb-2">Step {step} of 5</div>
          <div className="h-1 w-full bg-black/10 rounded">
            <div
              className="h-1 bg-[#1a1917] rounded transition-all"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && <Step1Basics onNext={goNext} />}
        {step === 2 && <Step2Season onNext={goNext} onBack={goBack} />}
        {step === 3 && <Step3Favorites onNext={goNext} onBack={goBack} />}
        {step === 4 && (
          <Step4BucketList onNext={goNext} onBack={goBack} onSkip={skipToNumbers} />
        )}
        {step === 5 && <Step5Numbers onBack={goBack} onFinish={finish} />}
      </div>
    </div>
  );
}
