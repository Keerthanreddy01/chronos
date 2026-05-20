import { useLifeStore } from '../../store/useLifeStore';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export function Step3Favorites({ onNext, onBack }: StepProps) {
  const { favorites, setFavorites } = useLifeStore();

  return (
    <div className="wizard-step">
      <h2 className="wizard-title">Your favorites</h2>
      <p className="wizard-subtitle">Add a few things that define this moment.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="wizard-label">
          📖 Reading
          <input
            value={favorites.reading}
            onChange={(e) => setFavorites({ reading: e.target.value })}
            placeholder="Atomic Habits"
            className="wizard-input"
          />
        </label>
        <label className="wizard-label">
          🎵 Obsessed with
          <input
            value={favorites.obsessed}
            onChange={(e) => setFavorites({ obsessed: e.target.value })}
            placeholder="Tame Impala"
            className="wizard-input"
          />
        </label>
        <label className="wizard-label">
          🌍 Want to visit
          <input
            value={favorites.visit}
            onChange={(e) => setFavorites({ visit: e.target.value })}
            placeholder="Tokyo"
            className="wizard-input"
          />
        </label>
        <label className="wizard-label">
          🍜 Comfort food
          <input
            value={favorites.comfort}
            onChange={(e) => setFavorites({ comfort: e.target.value })}
            placeholder="Biryani"
            className="wizard-input"
          />
        </label>
        <label className="wizard-label">
          🎬 Watching
          <input
            value={favorites.watching}
            onChange={(e) => setFavorites({ watching: e.target.value })}
            placeholder="Succession"
            className="wizard-input"
          />
        </label>
        <label className="wizard-label">
          💭 Current thought
          <input
            value={favorites.thought}
            onChange={(e) => setFavorites({ thought: e.target.value })}
            placeholder="just ship it"
            className="wizard-input"
          />
        </label>
      </div>

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
