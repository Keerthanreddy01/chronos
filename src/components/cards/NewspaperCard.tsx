import { useMemo } from 'react';
import { useLifeStore } from '../../store/useLifeStore';
import { computeLiveMetrics } from '../../utils/weekUtils';

interface NewspaperCardProps {
  scale?: number;
}

export function NewspaperCard({ scale = 1 }: NewspaperCardProps) {
  const { name, age, vibe, birthdate, settings, favorites, bucketList, tagline } = useLifeStore();

  const metrics = useMemo(() => {
    if (!birthdate) return null;
    return computeLiveMetrics(new Date(birthdate), settings.lifespan);
  }, [birthdate, settings.lifespan]);

  const bucketItems = bucketList.filter((item) => item.text).slice(0, 3);

  return (
    <div
      className="newspaper-bg"
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
      <div className="newspaper-paper">
        {/* Tape */}
        <div className="tape" style={{ top: '-12px', left: '120px', transform: 'rotate(-4deg)' }} />
        <div className="tape" style={{ top: '-8px', right: '140px', transform: 'rotate(3deg)' }} />

        <div className="text-[60px] font-serif font-bold leading-tight">
          Who is <span className="underline decoration-[#ff6b00]">{name || 'Keerthan'}</span>?
        </div>
        <div className="text-[28px] italic mt-2">→ just a {vibe || 'builder'}!</div>

        <div className="mt-8 flex items-center gap-4">
          <div className="label-chip">My name is {name || 'Keerthan'}</div>
          <div className="label-chip">I&apos;m {age || '19'} years old</div>
        </div>

        <div className="mt-8 p-4 bg-[#1a1917] text-[#f5c542] text-xl font-semibold">
          {metrics ? Math.floor(metrics.weeksLived).toLocaleString() : '1,037'} weeks · {metrics ? metrics.percentLived.toFixed(1) : '22.1'}% lived
        </div>

        <div className="mt-6 text-lg">
          Currently chasing after <span className="highlight">my dreams</span>
        </div>

        <div className="mt-6 space-y-2 text-base">
          <div>📖 Reading {favorites.reading || 'Atomic Habits'}</div>
          <div>🎵 Obsessed with {favorites.obsessed || 'Tame Impala'}</div>
          <div>🌍 Born to visit {favorites.visit || 'Tokyo'}</div>
        </div>

        <div className="mt-8">
          <div className="text-sm uppercase tracking-[0.2em] text-black/60 mb-2">Bucket list</div>
          <div className="text-base">
            ○ {(bucketItems[0]?.text || 'Japan')}  ○ {(bucketItems[1]?.text || 'Write a book')}  ○ {(bucketItems[2]?.text || 'Build a startup')}
          </div>
        </div>

        <div className="mt-8 text-lg italic text-black/70">
          “{tagline || 'Just a 19-year-old trying to make every week count.'}”
        </div>

        <div className="mt-10 text-sm text-black/60">
          chronos.app  ✦  Week {metrics ? Math.floor(metrics.weeksLived).toLocaleString() : '1,037'}
        </div>
      </div>

      <div className="corner-badge">I&apos;m {age || '19'} years old</div>
      <div className="star-deco" style={{ top: '120px', right: '120px' }}>☆</div>
      <div className="star-deco" style={{ bottom: '160px', left: '140px' }}>☆</div>
    </div>
  );
}
