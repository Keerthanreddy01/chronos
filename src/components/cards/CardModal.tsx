import { useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { ScrapbookCard } from './ScrapbookCard';
import { NewspaperCard } from './NewspaperCard';
import { NotebookCard } from './NotebookCard';
import { useLifeStore } from '../../store/useLifeStore';
import { encodeShareData } from '../../utils/exportUtils';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CardModal({ isOpen, onClose }: CardModalProps) {
  const [template, setTemplate] = useState<'scrapbook' | 'newspaper' | 'notebook'>('scrapbook');
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const store = useLifeStore();

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
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div className="text-lg font-semibold">Preview your card</div>
          <button onClick={onClose} className="text-xl">×</button>
        </div>

        <div className="modal-tabs">
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

        <div className="modal-body">
          <div className="phone-frame">
            <div ref={cardRef}>
              {template === 'scrapbook' && <ScrapbookCard scale={0.28} />}
              {template === 'newspaper' && <NewspaperCard scale={0.28} />}
              {template === 'notebook' && <NotebookCard scale={0.28} />}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <div className="text-xs text-black/60">Designed for Instagram stories (9:16)</div>
          <div className="flex gap-2">
            <button onClick={handleDownload} className="modal-primary" disabled={isDownloading}>
              {isDownloading ? 'Downloading...' : '⬇ Download PNG'}
            </button>
            <button onClick={handleCopy} className="modal-secondary">
              🔗 Copy link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
