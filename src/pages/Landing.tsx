import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useLifeStore, type LifeSeason } from '../store/useLifeStore';
import { computeLiveMetrics, WEEK_IN_MS } from '../utils/weekUtils';
import { ScrapbookCard } from '../components/cards/ScrapbookCard';
import { NewspaperCard } from '../components/cards/NewspaperCard';
import { NotebookCard } from '../components/cards/NotebookCard';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

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

function StatCard({ value, label, rotate }: { value: number; label: string; rotate: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const startTime = performance.now();
    const startValue = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const nextValue = Math.floor(startValue + (value - startValue) * progress);
      setDisplay(nextValue);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="stat-card"
      style={{ transform: `rotate(${rotate})` }}
    >
      <div className="stat-number">{display.toLocaleString()}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
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
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1917]">
      <style>{`
        html { scroll-behavior: smooth; }
        .section-full { width: 100%; box-sizing: border-box; }
        .hero-section {
          min-height: 100vh;
          width: 100%;
          padding: 80px;
          display: flex;
          align-items: center;
          background-color: #faf9f6;
          background-image: radial-gradient(circle, #d4d0c8 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .hero-layout { display: flex; gap: 80px; align-items: center; width: 100%; }
        .hero-left { width: 60%; }
        .hero-right { width: 40%; position: relative; height: 560px; }
        .pill-pulse { animation: pulse 2.8s ease-in-out infinite; }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 rgba(201, 169, 110, 0.25); }
          50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(201, 169, 110, 0.25); }
          100% { transform: scale(1); box-shadow: 0 0 0 rgba(201, 169, 110, 0.25); }
        }
        .hero-card {
          width: 280px;
          height: 480px;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
        }
        .card-1 { transform: rotate(-8deg) translateX(-20px); z-index: 1; }
        .card-2 { transform: rotate(0deg) translateY(-20px); z-index: 3; }
        .card-3 { transform: rotate(6deg) translateX(20px); z-index: 2; }
        .card-fan { position: absolute; transition: all 0.25s ease; }
        .card-fan:hover { z-index: 10; transform: translateY(-12px) rotate(0deg); }
        .float-card { animation: float 3s ease-in-out infinite; }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        .timeline-step {
          display: flex;
          gap: 80px;
          align-items: center;
          padding: 60px 120px;
          width: 100%;
          box-sizing: border-box;
        }
        .timeline-number {
          min-width: 160px;
          font-size: 120px;
          font-family: 'Playfair Display', serif;
          color: #c9a96e;
        }
        .timeline-divider {
          width: 100%;
          height: 1px;
          background: rgba(0, 0, 0, 0.12);
        }
        .templates-section {
          background: #1a1917;
          color: #faf9f6;
          padding: 80px 0;
        }
        .template-grid { display: flex; gap: 48px; justify-content: center; padding: 80px 0; }
        .template-frame {
          width: 240px;
          height: 420px;
          border-radius: 32px;
          border: 8px solid #2a2a2a;
          overflow: hidden;
          background: white;
        }
        .template-inner {
          width: 1080px;
          height: 1920px;
          transform: scale(0.222) translateX(0) translateY(0);
          transform-origin: top left;
        }
        .numbers-section {
          min-height: 80vh;
          padding: 120px 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #faf9f6;
        }
        .stat-card {
          width: 280px;
          padding: 48px 32px;
          background: white;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.08);
          text-align: center;
          transition: transform 0.2s ease;
        }
        .stat-card:hover { transform: scale(1.05); }
        .stat-number { font-size: 80px; font-family: 'Playfair Display', serif; color: #1a1917; font-weight: 600; }
        .stat-label { font-size: 16px; color: #8a8580; margin-top: 8px; }
        .final-cta {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
          background: #0f0e0d;
          color: #faf9f6;
          text-align: center;
          position: relative;
        }
        .cta-button {
          background: #c9a96e;
          color: #1a1917;
          font-size: 18px;
          font-weight: 600;
          padding: 18px 48px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .cta-button:hover { transform: scale(1.04); }
        .particle { width: 3px; height: 3px; background: #c9a96e; border-radius: 999px; position: absolute; opacity: 0.7; }
        @keyframes floatParticle {
          0% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(-10px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.7; }
        }
        @media (max-width: 1100px) {
          .hero-layout { flex-direction: column; }
          .hero-left, .hero-right { width: 100%; }
          .hero-right { height: 520px; }
          .timeline-step { padding: 48px 24px; }
          .template-grid { flex-direction: column; align-items: center; }
        }
      `}</style>

      {/* Section 1: Hero */}
      <section className="hero-section section-full">
        <div className="hero-layout">
          <div className="hero-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/70 border border-black/5 px-4 py-1.5 rounded-full text-sm text-[#6b625c] mb-8 pill-pulse"
            >
              ✦ 4,000 weeks. One life. Your story.
            </motion.div>

            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeUp} style={{ fontSize: '52px' }} className="font-serif text-[#8a827a] leading-tight">
                You&apos;ve lived
              </motion.div>
              <motion.div variants={fadeUp} style={{ fontSize: '96px', color: '#c9a96e' }} className="font-serif font-bold leading-tight">
                {livedWeeks.toLocaleString()} weeks.
              </motion.div>
              <motion.div variants={fadeUp} style={{ fontSize: '52px' }} className="font-serif text-[#1a1917] leading-tight">
                What have you done with them?
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-lg text-[#6b625c] mt-6 max-w-xl"
            >
              Most people never stop to count. We made it beautiful.
            </motion.p>

            <div className="flex gap-3 mt-8">
              <motion.button
                whileHover={{ y: -4 }}
                onClick={() => navigate('/build')}
                className="bg-[#1a1917] text-[#faf9f6] px-6 py-3 rounded-full text-sm font-semibold"
              >
                Create my life card →
              </motion.button>
              <motion.button
                whileHover={{ y: -4 }}
                onClick={handleScrollToHow}
                className="border border-black/10 text-[#1a1917] px-6 py-3 rounded-full text-sm"
              >
                See how it works ↓
              </motion.button>
            </div>
          </div>

          <div className="hero-right">
            <div className="card-fan float-card card-1" style={{ top: '20px', left: '40px' }}>
              <div className="hero-card">
                <ScrapbookCard scale={0.25} />
              </div>
            </div>
            <div className="card-fan float-card card-2" style={{ top: '40px', left: '160px', animationDelay: '0.3s' }}>
              <div className="hero-card">
                <NewspaperCard scale={0.25} />
              </div>
            </div>
            <div className="card-fan float-card card-3" style={{ top: '80px', left: '60px', animationDelay: '0.6s' }}>
              <div className="hero-card">
                <NotebookCard scale={0.25} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How it works */}
      <section id="how-it-works" className="section-full" style={{ background: 'white' }}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-4xl font-serif text-center py-20"
        >
          Three steps to your story
        </motion.div>

        <div className="timeline-divider" />

        {[{
          step: '01',
          title: 'Tell us who you are',
          text: 'Your name, age, birthday, zodiac. The basics that make you, you.',
        }, {
          step: '02',
          title: 'Paint what matters',
          text: 'Your reads, obsessions, bucket list.',
        }, {
          step: '03',
          title: 'Get your card',
          text: 'Instagram story ready. Download instantly.',
        }].map((item) => (
          <div key={item.step}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="timeline-step"
            >
              <div className="timeline-number">{item.step}</div>
              <div>
                <div className="text-2xl font-semibold mb-2">{item.title}</div>
                <div className="text-[#6b625c] text-lg">{item.text}</div>
              </div>
            </motion.div>
            <div className="timeline-divider" />
          </div>
        ))}
      </section>

      {/* Section 3: Templates */}
      <section className="templates-section section-full">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-4xl font-serif text-center pt-16"
        >
          Three templates. All beautiful.
        </motion.h2>

        <div className="template-grid">
          {[{
            component: <ScrapbookCard scale={0.222} />,
            label: 'Scrapbook',
            desc: 'For the creatives',
          }, {
            component: <NewspaperCard scale={0.222} />,
            label: 'Newspaper',
            desc: 'For the bold',
          }, {
            component: <NotebookCard scale={0.222} />,
            label: 'Notebook',
            desc: 'For the dreamers',
          }].map((card) => (
            <motion.div
              key={card.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="flex flex-col items-center"
            >
              <div className="template-frame">
                <div className="template-inner">{card.component}</div>
              </div>
              <div className="mt-5 text-center">
                <div className="text-lg font-semibold">{card.label}</div>
                <div className="text-sm text-[#c9a96e]">{card.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 4: Numbers */}
      <section className="numbers-section section-full">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-4xl font-serif text-center mb-16"
        >
          The numbers that will stop you
        </motion.h2>

        <div className="flex flex-wrap gap-8 justify-center">
          <StatCard value={4000} label="weeks in an average life" rotate="-2deg" />
          <StatCard value={168} label="hours in every cell" rotate="1deg" />
          <StatCard value={2920} label="weekends left in your life" rotate="-1deg" />
        </div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center text-[#6b625c] mt-10 italic"
        >
          The average person gets about 4,000 weeks. You&apos;ve already used {birthdate ? livedWeeks.toLocaleString() : 'some'} of them.
        </motion.p>
      </section>

      {/* Section 5: Final CTA */}
      <section className="final-cta section-full">
        <div className="text-sm text-white/40">
          {birthdate ? `Week ${livedWeeks.toLocaleString()} of your life` : ''}
        </div>
        <div className="text-5xl sm:text-6xl font-serif text-white">Your story deserves</div>
        <div className="text-5xl sm:text-6xl font-serif text-[#c9a96e]">to be told.</div>
        <div className="text-lg text-white/60">
          Join thousands turning their weeks into something worth sharing.
        </div>
        <button onClick={() => navigate('/build')} className="cta-button">
          Create my life card — it&apos;s free →
        </button>
        <div className="text-sm text-white/40">
          ✦ Designed for Instagram stories · Downloads as PNG · No account needed
        </div>

        {[{
          top: '20%',
          left: '20%',
          duration: '4s',
        }, {
          top: '35%',
          left: '70%',
          duration: '6s',
        }, {
          top: '60%',
          left: '15%',
          duration: '7s',
        }, {
          top: '75%',
          left: '55%',
          duration: '5s',
        }, {
          top: '40%',
          left: '40%',
          duration: '6.5s',
        }, {
          top: '25%',
          left: '85%',
          duration: '4.5s',
        }].map((dot, idx) => (
          <span
            key={idx}
            className="particle"
            style={{ top: dot.top, left: dot.left, animation: `floatParticle ${dot.duration} ease-in-out infinite` }}
          />
        ))}
      </section>
    </div>
  );
}
