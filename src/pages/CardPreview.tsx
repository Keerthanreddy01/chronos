import { useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useLifeStore } from '../store/useLifeStore';
import { ScrapbookCard } from '../components/cards/ScrapbookCard';
import { NewspaperCard } from '../components/cards/NewspaperCard';
import { NotebookCard } from '../components/cards/NotebookCard';
import { CardModal } from '../components/cards/CardModal';
import { encodeShareData } from '../utils/exportUtils';

export function CardPreview() {
  const store = useLifeStore();
  const [template, setTemplate] = useState<'scrapbook' | 'newspaper' | 'notebook'>('scrapbook');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const hiddenRef = useRef<HTMLDivElement>(null);

  const shareLink = useMemo(() => {
    const data = {
      birthdate: store.birthdate || '',
      name: store.name,
      age: store.age,
      vibe: store.vibe,
      zodiac: store.zodiac,
      season: store.season,
      seasonSubtitle: store.seasonSubtitle,
      favorites: store.favorites,
      bucketList: store.bucketList,
      tagline: store.tagline,
      settings: store.settings,
    };
    const encoded = encodeShareData(data);
    return `${window.location.origin}/preview?d=${encoded}`;
  }, [store]);

  const handleDownload = async () => {
    if (!hiddenRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(hiddenRef.current, {
        pixelRatio: 2,
        quality: 1,
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `chronos-${template}.png`;
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1917]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl">Your Life Card</h1>
            <p className="text-[#6b625c]">Preview, download, and share your story.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsModalOpen(true)} className="btn-secondary">
              Preview my card
            </button>
            <button onClick={handleDownload} className="btn-primary" disabled={isDownloading}>
              {isDownloading ? 'Preparing...' : '⬇ Download PNG'}
            </button>
            <button onClick={handleCopy} className="btn-secondary">
              🔗 Copy link
            </button>
          </div>
        </div>

        {/* Template tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'scrapbook', label: 'Scrapbook' },
            { id: 'newspaper', label: 'Newspaper' },
            { id: 'notebook', label: 'Notebook' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTemplate(tab.id as any)}
              className={`tab-pill ${template === tab.id ? 'tab-pill-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Phone mockup */}
        <div className="flex justify-center">
          <div className="phone-frame">
            {template === 'scrapbook' && <ScrapbookCard scale={0.28} />}
            {template === 'newspaper' && <NewspaperCard scale={0.28} />}
            {template === 'notebook' && <NotebookCard scale={0.28} />}
          </div>
        </div>
      </div>

      {/* Hidden full-size card for download */}
      <div style={{ position: 'absolute', left: '-99999px', top: 0 }}>
        <div ref={hiddenRef}>
          {template === 'scrapbook' && <ScrapbookCard />}
          {template === 'newspaper' && <NewspaperCard />}
          {template === 'notebook' && <NotebookCard />}
        </div>
      </div>

      <CardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
