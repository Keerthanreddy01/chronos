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
  visible: { transition: { staggerChildren: 0.12 } },
};

const floatVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.5 },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
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

function StatCard({ 
  value, 
  label, 
  rotate,
  bgColor = 'bg-gradient-to-br from-emerald-300 to-teal-400'
}: { 
  value: number; 
  label: string; 
  rotate: string;
  bgColor?: string;
}) {
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
      className={`relative ${bgColor} p-8 rounded-3xl text-center shadow-lg border-2 border-white/30 backdrop-blur-sm`}
      style={{ transform: `rotate(${rotate})` }}
      whileHover={{ y: -8, rotate: '0deg' }}
    >
      <div className="text-5xl font-bold text-white mb-3">{display.toLocaleString()}</div>
      <div className="text-sm font-semibold text-white/90">{label}</div>
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full shadow-md" />
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-pink-50 to-purple-50 text-slate-900 overflow-hidden">
      <style>{`
        html { scroll-behavior: smooth; }
        .section-full { width: 100%; box-sizing: border-box; }
        
        .hero-section {
          min-height: 100vh;
          width: 100%;
          padding: 60px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(254, 243, 199, 0.6) 0%, rgba(244, 204, 204, 0.4) 100%);
          position: relative;
          overflow: hidden;
        }
        
        .hero-decoration {
          position: absolute;
          pointer-events: none;
        }
        
        .decoration-circle {
          width: 280px;
          height: 280px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 50%;
          position: absolute;
        }
        
        .decoration-square {
          width: 120px;
          height: 120px;
          background: rgba(236, 72, 153, 0.08);
          transform: rotate(45deg);
          position: absolute;
        }
        
        .hero-layout { 
          display: flex; 
          gap: 60px; 
          align-items: center; 
          width: 100%; 
          max-width: 1200px;
          position: relative;
          z-index: 2;
        }
        
        .hero-left { width: 55%; }
        .hero-right { width: 45%; position: relative; height: 500px; }
        
        .pill-pulse { 
          animation: pulse 2.8s ease-in-out infinite; 
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
          border: 2px solid rgba(59, 130, 246, 0.3);
        }
        
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 rgba(59, 130, 246, 0.2); }
          50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          100% { transform: scale(1); box-shadow: 0 0 0 rgba(59, 130, 246, 0.2); }
        }
        
        .hero-card {
          width: 260px;
          height: 460px;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          border: 2px solid rgba(255, 255, 255, 0.8);
        }
        
        .card-1 { transform: rotate(-12deg) translateX(-30px); z-index: 1; }
        .card-2 { transform: rotate(0deg) translateY(-30px); z-index: 3; }
        .card-3 { transform: rotate(8deg) translateX(30px); z-index: 2; }
        
        .card-fan { 
          position: absolute; 
          transition: all 0.3s ease;
        }
        
        .card-fan:hover { 
          z-index: 10; 
          transform: translateY(-20px) rotate(0deg) !important;
        }
        
        .float-card { 
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }
        
        .timeline-step {
          display: flex;
          gap: 60px;
          align-items: flex-start;
          padding: 80px 120px;
          width: 100%;
          box-sizing: border-box;
        }
        
        .timeline-number {
          min-width: 140px;
          font-size: 100px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .timeline-divider {
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%);
        }
        
        .templates-section {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 40, 0.95) 100%);
          color: #faf9f6;
          padding: 120px 60px;
        }
        
        .template-grid { 
          display: flex; 
          gap: 48px; 
          justify-content: center; 
          padding: 60px 0;
          flex-wrap: wrap;
        }
        
        .template-frame {
          width: 240px;
          height: 420px;
          border-radius: 32px;
          border: 8px solid #3b82f6;
          overflow: hidden;
          background: white;
          box-shadow: 0 20px 50px rgba(59, 130, 246, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .template-frame:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 70px rgba(59, 130, 246, 0.4);
        }
        
        .template-inner {
          width: 1080px;
          height: 1920px;
          transform: scale(0.222) translateX(0) translateY(0);
          transform-origin: top left;
        }
        
        .numbers-section {
          min-height: 100vh;
          padding: 120px 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, rgba(254, 243, 199, 0.5) 0%, rgba(248, 187, 208, 0.5) 100%);
        }
        
        .final-cta {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
          background: linear-gradient(135deg, rgba(30, 27, 40, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%);
          color: #faf9f6;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .cta-button {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          font-size: 18px;
          font-weight: 700;
          padding: 16px 40px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }
        
        .cta-button:hover { 
          transform: scale(1.08);
          box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5);
        }
        
        .particle {
          width: 4px;
          height: 4px;
          background: rgba(59, 130, 246, 0.6);
          border-radius: 50%;
          position: absolute;
        }
        
        @keyframes floatParticle {
          0% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(-15px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.7; }
        }
        
        @media (max-width: 1100px) {
          .hero-layout { flex-direction: column; gap: 40px; }
          .hero-left, .hero-right { width: 100%; }
          .hero-right { height: 450px; }
          .hero-section { padding: 40px 20px; }
          .timeline-step { flex-direction: column; gap: 20px; padding: 40px 20px; }
          .templates-section { padding: 60px 20px; }
          .numbers-section { padding: 60px 20px; }
          .decoration-circle { display: none; }
          .decoration-square { display: none; }
        }
      `}</style>

      {/* Section 1: Hero */}
      <section className="hero-section section-full">
        <div className="hero-decoration decoration-circle" style={{ top: '-100px', right: '-100px' }} />
        <div className="hero-decoration decoration-square" style={{ top: '20%', left: '-60px' }} />
        <div className="hero-decoration decoration-circle" style={{ bottom: '-80px', left: '10%', width: '200px', height: '200px' }} />
        
        <div className="hero-layout">
          <div className="hero-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 pill-pulse px-4 py-2.5 rounded-full text-sm font-semibold mb-8"
            >
              ✨ 4,000 weeks · One extraordinary life
            </motion.div>

            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeUp} className="text-5xl font-bold text-slate-900 leading-tight mb-2">
                You&apos;ve lived
              </motion.div>
              <motion.div variants={fadeUp} className="text-7xl font-black bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent mb-3 leading-tight">
                {livedWeeks.toLocaleString()} weeks.
              </motion.div>
              <motion.div variants={fadeUp} className="text-4xl font-bold text-slate-800 leading-tight">
                What&apos;s your story?
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-lg text-slate-700 mt-6 max-w-xl leading-relaxed font-medium"
            >
              Turn your life into a beautiful visual story. Capture what matters. Share what&apos;s real.
            </motion.p>

            <div className="flex gap-4 mt-10 flex-wrap">
              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/build')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Create my story →
              </motion.button>
              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleScrollToHow}
                className="border-2 border-slate-900 text-slate-900 px-7 py-3 rounded-full text-sm font-bold bg-white/50 backdrop-blur hover:bg-white transition-all"
              >
                How it works ↓
              </motion.button>
            </div>
          </div>

          <div className="hero-right">
            <div className="card-fan float-card card-1" style={{ top: '20px', left: '40px' }}>
              <div className="hero-card">
                <ScrapbookCard scale={0.25} />
              </div>
            </div>
            <div className="card-fan float-card card-2" style={{ top: '60px', left: '140px', animationDelay: '0.3s' }}>
              <div className="hero-card">
                <NewspaperCard scale={0.25} />
              </div>
            </div>
            <div className="card-fan float-card card-3" style={{ top: '100px', left: '20px', animationDelay: '0.6s' }}>
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
          className="text-5xl font-black text-center py-20 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent"
        >
          Three steps to your story
        </motion.div>

        <div className="timeline-divider" />

        {[{
          step: '01',
          title: 'Tell us who you are',
          text: 'Your name, age, birthday, zodiac. The essentials that make you, you.',
          emoji: '👤'
        }, {
          step: '02',
          title: 'Paint what matters',
          text: 'Your reads, obsessions, bucket list. All the things that make your life interesting.',
          emoji: '🎨'
        }, {
          step: '03',
          title: 'Share your story',
          text: 'Download your beautiful card. Post it. Own it. Inspire others.',
          emoji: '✨'
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
              <div className="flex-1">
                <div className="text-3xl mb-4">{item.emoji}</div>
                <div className="text-2xl font-bold text-slate-900 mb-2">{item.title}</div>
                <div className="text-lg text-slate-700 leading-relaxed max-w-xl">{item.text}</div>
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
          className="text-5xl font-black text-center pt-16 mb-6"
        >
          Choose your vibe
        </motion.h2>
        
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center text-lg text-white/70 mb-16 max-w-2xl mx-auto"
        >
          Three distinct design templates. All equally beautiful. Pick the one that feels like you.
        </motion.p>

        <div className="template-grid">
          {[{
            component: <ScrapbookCard scale={0.222} />,
            label: 'Scrapbook',
            desc: 'Chaotic & creative',
            accent: 'from-pink-500 to-rose-500'
          }, {
            component: <NewspaperCard scale={0.222} />,
            label: 'Newspaper',
            desc: 'Bold & striking',
            accent: 'from-yellow-500 to-orange-500'
          }, {
            component: <NotebookCard scale={0.222} />,
            label: 'Notebook',
            desc: 'Dreamy & introspective',
            accent: 'from-purple-500 to-pink-500'
          }].map((card, idx) => (
            <motion.div
              key={card.label}
              variants={floatVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              custom={idx}
              className="flex flex-col items-center"
            >
              <div className="template-frame">
                <div className="template-inner">{card.component}</div>
              </div>
              <div className="mt-6 text-center">
                <div className="text-xl font-bold">{card.label}</div>
                <div className={`text-sm font-semibold bg-gradient-to-r ${card.accent} bg-clip-text text-transparent`}>{card.desc}</div>
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
          className="text-5xl font-black text-center mb-20 text-slate-900"
        >
          The numbers that hit different
        </motion.h2>

        <div className="flex flex-wrap gap-8 justify-center">
          <StatCard 
            value={4000} 
            label="weeks in an average life" 
            rotate="-3deg"
            bgColor="bg-gradient-to-br from-blue-400 to-cyan-500"
          />
          <StatCard 
            value={168} 
            label="hours in every week" 
            rotate="2deg"
            bgColor="bg-gradient-to-br from-pink-400 to-rose-500"
          />
          <StatCard 
            value={2920} 
            label="weekends remaining" 
            rotate="-1deg"
            bgColor="bg-gradient-to-br from-purple-400 to-indigo-500"
          />
        </div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center text-slate-700 mt-16 italic text-lg font-medium max-w-2xl"
        >
          The average person gets about 4,000 weeks. You&apos;ve already used {birthdate ? livedWeeks.toLocaleString() : 'some'} of them. 
          <br />
          What will you do with the rest?
        </motion.p>
      </section>

      {/* Section 5: Final CTA */}
      <section className="final-cta section-full">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-sm font-semibold text-blue-400 mb-4"
        >
          Week {birthdate ? livedWeeks.toLocaleString() : '???'} of your life
        </motion.div>
        
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-6xl sm:text-7xl font-black text-white leading-tight"
        >
          Your life is
        </motion.div>
        
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent leading-tight"
        >
          worth sharing.
        </motion.div>
        
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-xl text-white/70 mt-8"
        >
          Create your card. Download instantly. No account needed.
        </motion.p>
        
        <motion.button 
          onClick={() => navigate('/build')} 
          className="cta-button mt-8"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          Create my story — it&apos;s free →
        </motion.button>
        
        <div className="text-sm text-white/50 mt-6">
          ✦ Beautiful card designs · Instagram ready · Share or download · No signup required
        </div>

        {[{
          top: '15%',
          left: '10%',
          duration: '4s',
        }, {
          top: '30%',
          left: '85%',
          duration: '6s',
        }, {
          top: '55%',
          left: '8%',
          duration: '7s',
        }, {
          top: '70%',
          left: '80%',
          duration: '5s',
        }, {
          top: '45%',
          left: '45%',
          duration: '6.5s',
        }, {
          top: '25%',
          left: '75%',
          duration: '4.5s',
        }, {
          top: '80%',
          left: '25%',
          duration: '5.5s',
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
