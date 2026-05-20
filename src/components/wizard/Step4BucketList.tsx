import { useLifeStore } from '../../store/useLifeStore';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function Step4BucketList({ onNext, onBack, onSkip }: StepProps) {
  const { bucketList, updateBucketItemText } = useLifeStore();

  return (
    <div className="wizard-step">
      <h2 className="wizard-title">Your bucket list</h2>
      <p className="wizard-subtitle">Three things you want to do before you die.</p>

      <div className="space-y-4">
        {bucketList.slice(0, 3).map((item, index) => (
          <label key={item.id} className="wizard-label">
            {index + 1}.
            <input
              value={item.text}
              onChange={(e) => updateBucketItemText(item.id, e.target.value)}
              placeholder=""
              className="wizard-input"
            />
          </label>
        ))}
      </div>

      <div className="wizard-actions">
        <button onClick={onBack} className="wizard-secondary">
          ← Back
        </button>
        <button onClick={onSkip} className="wizard-tertiary">
          Skip
        </button>
        <button onClick={onNext} className="wizard-primary">
          Next →
        </button>
      </div>
    </div>
  );
}
