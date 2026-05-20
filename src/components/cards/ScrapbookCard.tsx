import { useMemo } from 'react';
import { useLifeStore } from '../../store/useLifeStore';
import { computeLiveMetrics } from '../../utils/weekUtils';
import { MiniGrid } from './MiniGrid';

interface ScrapbookCardProps {
  scale?: number;
}

export function ScrapbookCard({ scale = 1 }: ScrapbookCardProps) {
  const { name, age, vibe, zodiac, seasonSubtitle, favorites, bucketList, birthdate, settings } = useLifeStore();

  const metrics = useMemo(() => {
    if (!birthdate) return null;
    return computeLiveMetrics(new Date(birthdate), settings.lifespan);
  }, [birthdate, settings.lifespan]);

  const favoriteItems = [
    { label: '📖', value: favorites.reading },
    { label: '🎵', value: favorites.obsessed },
    { label: '🌍', value: favorites.visit },
  ].filter((item) => item.value);

  const bucketItems = bucketList.filter((item) => item.text).slice(0, 3);

  return (
    <div
      className="scrapbook-bg"
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
      {/* Decorative stars */}
      <div className="scrapbook-star" style={{ top: '90px', left: '80px' }}>✦</div>
      <div className="scrapbook-star" style={{ top: '140px', right: '120px' }}>✦</div>
      <div className="scrapbook-star" style={{ bottom: '160px', right: '140px' }}>✦</div>

      {/* Name badge */}
      <div className="scrapbook-badge" style={{ transform: 'rotate(-2deg)' }}>
        <div className="text-[18px] uppercase tracking-[0.25em] text-white/80">Hello, my name is</div>
        <div className="font-serif text-5xl text-white mt-2">
          {name || 'Your Name'}
        </div>
      </div>

      {/* Age tag */}
      <div className="scrapbook-sticky" style={{ transform: 'rotate(3deg)', top: '280px', right: '90px' }}>
        <div className="text-[24px] font-bold">{age || '19'} Y/O {vibe || 'Builder'}</div>
        <div className="text-[14px] uppercase tracking-widest text-black/70 mt-1">{zodiac || 'Scorpio'}</div>
      </div>

      {/* About box */}
      <div className="scrapbook-about" style={{ marginTop: '260px' }}>
        <div className="text-[14px] uppercase tracking-[0.2em] text-[#cbe9b7] mb-3">Currently...</div>
        <div className="text-2xl leading-tight text-[#e8f0d8] font-serif">
          {seasonSubtitle || 'building something real, one week at a time'}
        </div>
      </div>

      {/* Favorites pills */}
      <div className="mt-10 flex flex-wrap gap-3">
        {favoriteItems.length === 0 && (
          <div className="favorite-pill bg-[#ff6b9d] text-white">📖 Atomic Habits</div>
        )}
        {favoriteItems.map((item, idx) => (
          <div key={item.label} className={`favorite-pill ${['bg-[#ff6b9d] text-white', 'bg-[#6b5cff] text-white', 'bg-[#ff9f1c] text-white'][idx % 3]}`}>
            {item.label} {item.value}
          </div>
        ))}
      </div>

      {/* Life numbers */}
      <div className="scrapbook-numbers" style={{ marginTop: '40px' }}>
        <div className="text-[#f5c542] text-3xl font-serif font-bold">
          {metrics ? Math.floor(metrics.weeksLived).toLocaleString() : '1,037'} weeks lived
        </div>
        <div className="text-[#e8e4dd] text-xl mt-2">
          {metrics ? metrics.percentLived.toFixed(1) : '22.1'}% through life
        </div>
      </div>

      {/* Bucket list */}
      <div className="scrapbook-bucket" style={{ marginTop: '40px' }}>
        <div className="text-[12px] uppercase tracking-[0.3em] text-[#6b625c] mb-3">Bucket list</div>
        {(bucketItems.length ? bucketItems : [
          { id: 'p1', text: 'Visit Japan' },
          { id: 'p2', text: 'Write a book' },
          { id: 'p3', text: 'Start a startup' },
        ]).map((item) => (
          <div key={item.id} className="text-lg text-[#1a1917]">○ {item.text}</div>
        ))}
      </div>

      {/* Decorative grid */}
      <div className="absolute bottom-[220px] left-[80px]">
        <MiniGrid width={200} />
      </div>

      {/* Footer */}
      <div className="absolute bottom-[90px] left-[80px] text-sm text-[#6b625c]">
        chronos.app
      </div>
    </div>
  );
}
