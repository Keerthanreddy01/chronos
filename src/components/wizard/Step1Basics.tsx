import { useMemo } from 'react';
import { useLifeStore } from '../../store/useLifeStore';
import { computeLiveMetrics } from '../../utils/weekUtils';

interface StepProps {
  onNext: () => void;
}

export function Step1Basics({ onNext }: StepProps) {
  const {
    name,
    age,
    birthdate,
    vibe,
    zodiac,
    setName,
    setAge,
    setBirthdate,
    setVibe,
    setZodiac,
  } = useLifeStore();

  const liveWeeks = useMemo(() => {
    if (!birthdate) return null;
    const date = new Date(birthdate);
    if (Number.isNaN(date.getTime())) return null;
    return Math.floor(computeLiveMetrics(date, 90).weeksLived);
  }, [birthdate]);

  const isReady = Boolean(name.trim() && birthdate);

  return (
    <div className="wizard-step">
      <h2 className="wizard-title">The basics</h2>
      <p className="wizard-subtitle">Start with a few simple details.</p>

      <div className="wizard-form">
        <label className="wizard-label">
          What&apos;s your name?
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Keerthan"
            className="wizard-input"
          />
        </label>

        <label className="wizard-label">
          How old are you?
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="19"
            className="wizard-input"
          />
        </label>

        <label className="wizard-label">
          Your birthday?
          <input
            type="date"
            value={birthdate || ''}
            onChange={(e) => setBirthdate(e.target.value)}
            className="wizard-input"
          />
        </label>

        {liveWeeks !== null && (
          <div className="wizard-hint">
            You&apos;ve lived approximately <strong>{liveWeeks.toLocaleString()}</strong> weeks.
          </div>
        )}

        <label className="wizard-label">
          One word that describes you?
          <input
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            placeholder="Builder"
            className="wizard-input"
          />
        </label>

        <label className="wizard-label">
          Your zodiac / vibe?
          <input
            value={zodiac}
            onChange={(e) => setZodiac(e.target.value)}
            placeholder="Scorpio / Baddie / etc"
            className="wizard-input"
          />
        </label>
      </div>

      <div className="wizard-actions">
        <button
          onClick={onNext}
          className="wizard-primary"
          disabled={!isReady}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
