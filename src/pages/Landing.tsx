import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useLifeStore, type LifeSeason } from '../store/useLifeStore';
import { computeLiveMetrics, WEEK_IN_MS } from '../utils/weekUtils';
import { ScrapbookCard } from '../components/cards/ScrapbookCard';
import { NewspaperCard } from '../components/cards/NewspaperCard';
import { NotebookCard } from '../components/cards/NotebookCard';

const mockData = {
  name: 'Your Name',
  age: 24,
  zodiac: 'Scorpio',
  vibe: 'Builder',
  season: 'Building' as LifeSeason,
  seasonEmoji: '🏗',
  seasonSubtitle: 'building something real',
  favorites: {
    reading: 'Atomic Habits',
    obsessed: 'Tame Impala',
    visit: 'Tokyo',
    comfort: 'Biryani',
    watching: 'Succession',
    thought: 'just ship it',
  },
  bucketList: ['Visit Japan', 'Write a book', 'Build a startup'],
  tagline: 'Just a 24-year-old trying to make every week count.',
  weeksLived: 1252,
  weeksRemaining: 3428,
  percentage: 26.8,
};

// Memory fragment component
function MemoryFragment({ 
  index, 
  emoji, 
  text 
}: { 
  index: number; 
  emoji: string; 
  text: string 
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        width: '280px',
        height: '380px',
        background: 'white',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        border: '2px solid rgba(255,255,255,0.6)',
      }}
      animate={{ y: index * -120, opacity: 0.9 - index * 0.15 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="text-6xl mb-4">{emoji}</div>
      <div className="text-xl font-bold text-slate-900 leading-tight">{text}</div>
    </motion.div>
  );
}

function StatCard() {
  // Removed - no longer used in new design
  return null;
}

export function Landing() {
  const navigate = useNavigate();
  const {
    name,
    birthdate,
    bucketList,
    setName,
    setAge,
    setVibe,
    setZodiac,
    setSeason,
    setSeasonSubtitle,
    setFavorites,
    setTagline,
    setBirthdate,
    updateBucketItemText,
    addBucketItem,
  } = useLifeStore();

  useEffect(() => {
    if (name || birthdate) return;

    setName(mockData.name);
    setAge(String(mockData.age));
    setVibe(mockData.vibe);
    setZodiac(mockData.zodiac);
    setSeason(mockData.season);
    setSeasonSubtitle(mockData.seasonSubtitle);
    setFavorites(mockData.favorites);
    setTagline(mockData.tagline);

    const targetDate = new Date(Date.now() - mockData.weeksLived * WEEK_IN_MS);
    setBirthdate(targetDate.toISOString().split('T')[0]);

    const existing = bucketList.slice(0, 3);
    existing.forEach((item, idx) => {
      updateBucketItemText(item.id, mockData.bucketList[idx]);
    });
    if (existing.length < 3) {
      mockData.bucketList.slice(existing.length).forEach((text) => addBucketItem(text));
    }
  }, [
    name,
    birthdate,
    bucketList,
    setName,
    setAge,
    setVibe,
    setZodiac,
    setSeason,
    setSeasonSubtitle,
    setFavorites,
    setTagline,
    setBirthdate,
    updateBucketItemText,
    addBucketItem,
  ]);

  const metrics = useMemo(() => {
    if (!birthdate) return null;
    return computeLiveMetrics(new Date(birthdate), 90);
  }, [birthdate]);

  const livedWeeks = metrics ? Math.floor(metrics.weeksLived) : mockData.weeksLived;

  const handleScrollToHow = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-white text-slate-900" style={{ overflow: 'clip' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        body { margin: 0; }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 30px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scaleY(1); }
          25% { transform: scaleY(1.2); }
          50% { transform: scaleY(1); }
        }
        
        .hero-enormous {
          height: 100vh;
          background: linear-gradient(135deg, #fef3c7 0%, #fecaca 50%, #f3e8ff 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 1400px;
          width: 100%;
          padding: 0 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
          align-items: center;
        }
        
        .hero-text h1 {
          font-size: clamp(3.5rem, 12vw, 8rem);
          font-weight: 900;
          line-height: 1;
          margin: 0;
          margin-bottom: 20px;
          letter-spacing: -2px;
        }
        
        .hero-number {
          background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-bg-decor {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          pointer-events: none;
        }
        
        .memory-stack {
          position: relative;
          height: 600px;
        }
        
        .memory-card {
          position: absolute;
          width: 300px;
          height: 400px;
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.7);
        }
        
        .timeline-diagonal {
          position: relative;
          padding: 120px 60px;
          background: white;
        }
        
        .timeline-path {
          position: absolute;
          width: 3px;
          height: 100%;
          background: linear-gradient(180deg, rgba(59, 130, 246, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%);
          left: 20%;
          top: 0;
          transform: skewX(-20deg);
        }
        
        .timeline-item {
          position: relative;
          margin-bottom: 80px;
          padding-left: 120px;
        }
        
        .timeline-dot {
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b82f6;
          border: 4px solid white;
          left: 0;
          top: 0;
          box-shadow: 0 0 0 3px #3b82f6;
        }
        
        .emoji-huge {
          font-size: 72px;
          margin-bottom: 16px;
        }
        
        .template-stack {
          perspective: 1000px;
          position: relative;
          height: 500px;
          margin: 80px auto;
        }
        
        .card-stack-item {
          position: absolute;
          width: 280px;
          height: 450px;
          background: white;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          border: 3px solid rgba(0, 0, 0, 0.05);
        }
        
        .template-dark-bg {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b28 100%);
          color: #faf9f6;
          padding: 120px 60px;
          position: relative;
          overflow: hidden;
        }
        
        .stat-tile {
          background: white;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 2px solid rgba(0, 0, 0, 0.05);
          min-width: 240px;
        }
        
        .stat-number {
          font-size: 64px;
          font-weight: 900;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
        }
        
        .stat-label {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .cinematic-cta {
          background: linear-gradient(135deg, #000000 0%, #1e1b28 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 60px;
        }
        
        .cta-text h2 {
          font-size: clamp(2.5rem, 10vw, 5rem);
          font-weight: 900;
          color: white;
          margin: 0;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        
        .cta-gradient-text {
          background: linear-gradient(135deg, #60a5fa 0%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @media (max-width: 1024px) {
          .hero-content { grid-template-columns: 1fr; gap: 40px; padding: 0 40px; }
          .hero-text h1 { font-size: clamp(2.5rem, 8vw, 4rem); }
          .memory-stack { height: 400px; }
          .memory-card { width: 240px; height: 320px; }
          .template-dark-bg { padding: 60px 20px; }
          .cinematic-cta { padding: 40px 20px; }
          .cta-text h2 { font-size: clamp(1.8rem, 6vw, 3rem); }
        }
      `}</style>

      {/* HERO MOMENT - Massive asymmetrical opening */}
      <section className="hero-enormous">
        <div className="hero-bg-decor" style={{ width: '500px', height: '500px', top: '-150px', right: '-150px' }} />
        <div className="hero-bg-decor" style={{ width: '300px', height: '300px', bottom: '-100px', left: '10%' }} />
        
        <div className="hero-content">
          <motion.div className="hero-text">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-bold text-slate-700 mb-4"
            >
              ✨ you&apos;ve lived
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="hero-number">{livedWeeks.toLocaleString()}</span>
              <br />
              weeks.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-slate-800 mt-8 mb-8 max-w-md"
            >
              What&apos;s your story?
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-slate-700 leading-relaxed max-w-md mb-10"
            >
              Turn your life into a beautiful visual story. Capture what matters. Share what&apos;s real.
            </motion.p>
            
            <div className="flex gap-4">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                onClick={() => navigate('/build')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all"
              >
                Create my story →
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95 }}
                onClick={handleScrollToHow}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-slate-900 text-slate-900 px-8 py-3 rounded-full font-bold bg-white/40 backdrop-blur hover:bg-white/60 transition-all"
              >
                How it works ↓
              </motion.button>
            </div>
          </motion.div>

          {/* Memory card stack - floating */}
          <motion.div className="memory-stack">
            <MemoryFragment index={0} emoji="🎨" text="Capturing moments that matter" />
            <MemoryFragment index={1} emoji="🌟" text="Living with intention" />
            <MemoryFragment index={2} emoji="📖" text="Your life. Your story." />
          </motion.div>
        </div>
      </section>

      {/* TIMELINE - Tilted diagonal with emoji milestones */}
      <section className="timeline-diagonal" id="how-it-works">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          viewport={{ once: true }}
          className="timeline-path"
        />
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-black text-center mb-20 text-slate-900"
        >
          How your story comes to life
        </motion.h2>

        {[{
          emoji: '👤',
          title: 'Tell us who you are',
          desc: 'Your name, birthday, zodiac. The essentials that make you, you.'
        }, {
          emoji: '🎨',
          title: 'Paint what matters',
          desc: 'Your reads, obsessions, bucket list. All the things that make your life interesting.'
        }, {
          emoji: '✨',
          title: 'Share your story',
          desc: 'Download your beautiful card. Post it. Own it. Inspire others.'
        }].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: idx * 0.2 }}
            className="timeline-item"
          >
            <div className="timeline-dot" />
            <div className="emoji-huge">{item.emoji}</div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">{item.title}</h3>
            <p className="text-lg text-slate-700 leading-relaxed max-w-md">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* TEMPLATES - Overlapping card stack */}
      <section className="template-dark-bg">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-black text-center mb-8"
        >
          Choose your vibe
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-lg text-white/70 mb-20 max-w-2xl mx-auto"
        >
          Three distinct templates. All equally beautiful. Pick the one that feels like you.
        </motion.p>

        <div className="template-stack mx-auto" style={{ maxWidth: '500px' }}>
          {[
            { component: <ScrapbookCard scale={0.222} />, label: 'Scrapbook', color: 'from-pink-500' },
            { component: <NewspaperCard scale={0.222} />, label: 'Newspaper', color: 'from-yellow-500' },
            { component: <NotebookCard scale={0.222} />, label: 'Notebook', color: 'from-purple-500' },
          ].map((card, idx) => (
            <motion.div
              key={card.label}
              className="card-stack-item"
              style={{
                zIndex: 3 - idx,
                left: `${idx * 40}px`,
                top: `${idx * 80}px`,
              }}
              whileHover={{
                z: 10,
                rotate: -5 + idx * 2,
                y: -30,
              }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ width: '1080px', height: '1920px', transform: 'scale(0.222)', transformOrigin: 'top left' }}>
                {card.component}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/60 mt-20 text-sm font-medium"
        >
          Hover to preview. Each design tells your story differently.
        </motion.p>
      </section>

      {/* NUMBERS - Emotional stat reveals */}
      <section className="py-32 px-8 bg-gradient-to-b from-white to-slate-50">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-black text-center mb-8 text-slate-900"
        >
          The numbers that hit different
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-lg text-slate-700 mb-20 max-w-2xl mx-auto"
        >
          Most people never stop to count. Here&apos;s what the numbers mean.
        </motion.p>

        <div className="flex flex-wrap gap-8 justify-center mb-16">
          {[
            { num: 4000, label: 'weeks in an average life' },
            { num: 168, label: 'hours in every week' },
            { num: 2920, label: 'weekends remaining (avg)' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="stat-tile"
            >
              <motion.div
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 + 0.2, duration: 0.8 }}
                className="stat-number"
              >
                {stat.num.toLocaleString()}
              </motion.div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-700 italic text-lg max-w-2xl mx-auto leading-relaxed"
        >
          You&apos;ve already used {birthdate ? livedWeeks.toLocaleString() : 'some'} weeks.<br />
          What will you do with the rest?
        </motion.p>
      </section>

      {/* FINAL CTA - Cinematic climax */}
      <section className="cinematic-cta">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          viewport={{ once: true }}
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="relative z-10 text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm font-semibold text-blue-400 mb-6"
          >
            Week {birthdate ? livedWeeks.toLocaleString() : '???'} of your life
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="cta-text"
          >
            <h2>Your life is</h2>
            <h2 className="cta-gradient-text">worth sharing.</h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-xl text-white/70 mt-8 mb-10"
          >
            No signup. No payment. Just pure, authentic storytelling.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            onClick={() => navigate('/build')}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all"
          >
            Create my story — it&apos;s free →
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="text-sm text-white/50 mt-8"
          >
            ✦ Beautiful designs · Instagram ready · Shareable · Instant download
          </motion.p>
        </div>
      </section>
    </div>
  );
}
