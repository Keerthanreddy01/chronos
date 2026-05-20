import { useMemo } from 'react';
import { useLifeStore } from '../../store/useLifeStore';
import { computeLiveMetrics } from '../../utils/weekUtils';

interface StepProps {
  onBack: () => void;
  onFinish: () => void;
}

export function Step5Numbers({ onBack, onFinish }: StepProps) {
  const { birthdate, settings, tagline, setTagline } = useLifeStore();

  const metrics = useMemo(() => {
    if (!birthdate) return null;
    return computeLiveMetrics(new Date(birthdate), settings.lifespan);
  }, [birthdate, settings.lifespan]);

  const ageDays = useMemo(() => {
    if (!birthdate) return null;
    const diffMs = new Date().getTime() - new Date(birthdate).getTime();
    return Math.max(0, Math.floor(diffMs / (24 * 60 * 60 * 1000)));
  }, [birthdate]);

  return (
    <div className="wizard-step">
      <h2 className="wizard-title">Life in numbers</h2>
      <p className="wizard-subtitle">Auto-calculated from your birthday.</p>

      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="number-card">
            <div className="number-label">You&apos;ve lived</div>
            <div className="number-value">{Math.floor(metrics.weeksLived).toLocaleString()} weeks</div>
          </div>
          <div className="number-card">
            <div className="number-label">Weeks remaining</div>
            <div className="number-value">{Math.ceil(metrics.weeksRemaining).toLocaleString()} weeks</div>
          </div>
          <div className="number-card">
            <div className="number-label">You are</div>
            <div className="number-value">{metrics.percentLived.toFixed(1)}% through your life</div>
          </div>
          <div className="number-card">
            <div className="number-label">Age in days</div>
            <div className="number-value">{ageDays?.toLocaleString()} days</div>
          </div>
        </div>
      )}

      <label className="wizard-label">
        Tagline
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Just a 19-year-old trying to make every week count."
          className="wizard-input"
        />
      </label>

      <div className="wizard-actions">
        <button onClick={onBack} className="wizard-secondary">
          ← Back
        </button>
        <button onClick={onFinish} className="wizard-primary">
          Build my card →
        </button>
      </div>
    </div>
  );
}
