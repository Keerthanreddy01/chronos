import { useMemo } from 'react';
import { useLifeStore } from '../../store/useLifeStore';
import { computeLiveMetrics } from '../../utils/weekUtils';

interface NotebookCardProps {
  scale?: number;
}

export function NotebookCard({ scale = 1 }: NotebookCardProps) {
  const { name, age, vibe, zodiac, birthdate, favorites, bucketList } = useLifeStore();

  const metrics = useMemo(() => {
    if (!birthdate) return null;
    return computeLiveMetrics(new Date(birthdate), 90);
  }, [birthdate]);

  const bucketItems = bucketList.filter((item) => item.text).slice(0, 3);

  return (
    <div
      className="notebook-bg"
      style={{
        width: 1080,
        height: 1920,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px',
        boxSizing: 'border-box',
      }}
    >
      {/* Binder clip */}
      <div className="binder-clip" />

      <div className="text-5xl font-serif italic mb-6">
        Who is {name || 'Keerthan'}?!
      </div>

      <div className="hand-circle mb-6">
        <span className="text-3xl font-serif">{name || 'Keerthan K.'}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="note-card" style={{ transform: 'rotate(-2deg)' }}>
          🗓 Born {birthdate ? new Date(birthdate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'June 15, 1995'}
        </div>
        <div className="note-card" style={{ transform: 'rotate(2deg)' }}>
          ♏ {zodiac || 'Scorpio'}
        </div>
        <div className="note-card" style={{ transform: 'rotate(-1deg)' }}>
          🏗 {vibe || 'Builder'}
        </div>
        <div className="note-card" style={{ transform: 'rotate(1deg)' }}>
          ♥ {age || '19'} years old
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xl font-semibold mb-2">About them:</div>
        <div className="space-y-2 text-lg">
          <div>♥ Loves building things</div>
          <div>♥ {favorites.reading ? `${favorites.reading} reader` : 'Atomic Habits reader'}</div>
          <div>♥ {favorites.obsessed ? `${favorites.obsessed} fan` : 'Tame Impala fan'}</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xl font-semibold mb-2">Favorites</div>
        <div className="space-y-2 text-lg">
          <div>Favorite food: {favorites.comfort || 'Biryani'} 🍛</div>
          <div>Watching: {favorites.watching || 'Succession'} 📺</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xl font-semibold mb-2">Bucket list:</div>
        <div className="space-y-2 text-lg">
          <div>→ {bucketItems[0]?.text || 'Visit Japan'}</div>
          <div>→ {bucketItems[1]?.text || 'Write a book'}</div>
          <div>→ {bucketItems[2]?.text || 'Build a startup'}</div>
        </div>
      </div>

      <div className="text-sm text-black/60 mt-10">
        Week {metrics ? Math.floor(metrics.weeksLived).toLocaleString() : '1,037'} of their life
      </div>
      <div className="text-sm text-black/60">chronos.app</div>
    </div>
  );
}
