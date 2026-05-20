import { useLifeStore } from '../../store/useLifeStore';
import type { LifeSeason } from '../../store/useLifeStore';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

const SEASONS: { id: LifeSeason; emoji: string; label: string }[] = [
  { id: 'Growing', emoji: '🌱', label: 'Growing' },
  { id: 'Hustling', emoji: '🔥', label: 'Hustling' },
  { id: 'Building', emoji: '🏗', label: 'Building' },
  { id: 'Transitioning', emoji: '🌊', label: 'Transitioning' },
  { id: 'Healing', emoji: '💛', label: 'Healing' },
  { id: 'Launching', emoji: '🚀', label: 'Launching' },
  { id: 'Learning', emoji: '📚', label: 'Learning' },
  { id: 'Loving', emoji: '❤️', label: 'Loving' },
];

export function Step2Season({ onNext, onBack }: StepProps) {
  const { season, seasonSubtitle, setSeason, setSeasonSubtitle } = useLifeStore();

  return (
    <div className="wizard-step">
      <h2 className="wizard-title">Your season</h2>
      <p className="wizard-subtitle">What chapter of life are you in right now?</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {SEASONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSeason(s.id)}
            className={`season-card ${season === s.id ? 'season-card-active' : ''}`}
          >
            <div className="text-2xl mb-2">{s.emoji}</div>
            <div className="text-sm font-semibold">{s.label}</div>
          </button>
        ))}
      </div>

      <label className="wizard-label">
        Custom subtitle
        <input
          value={seasonSubtitle}
          onChange={(e) => setSeasonSubtitle(e.target.value)}
          placeholder="Currently... building something real"
          className="wizard-input"
        />
      </label>

      <div className="wizard-actions">
        <button onClick={onBack} className="wizard-secondary">
          ← Back
        </button>
        <button onClick={onNext} className="wizard-primary">
          Next →
        </button>
      </div>
    </div>
  );
}
