import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { useLifeStore, type LifeSeason } from './store/useLifeStore';
import { decodeShareData } from './utils/exportUtils';
import { Landing } from './pages/Landing.tsx';
import { ProfileBuilder } from './pages/ProfileBuilder.tsx';
import { CardPreview } from './pages/CardPreview.tsx';

function AppRouter() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isOnboarded, hydrateSharedState } = useLifeStore();

  // Intercept shared links on any page load
  useEffect(() => {
    const dParam = searchParams.get('d');
    if (dParam) {
      const decodedData = decodeShareData(dParam);
      if (decodedData) {
        hydrateSharedState({
          birthdate: decodedData.birthdate,
          name: decodedData.name,
          age: decodedData.age,
          vibe: decodedData.vibe,
          zodiac: decodedData.zodiac,
          season: (decodedData.season as LifeSeason | null) || null,
          seasonSubtitle: decodedData.seasonSubtitle,
          favorites: decodedData.favorites,
          bucketList: decodedData.bucketList,
          tagline: decodedData.tagline,
          settings: decodedData.settings,
          events: [],
        });
        navigate('/preview', { replace: true });
      }
    }
  }, [searchParams, hydrateSharedState, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/build" element={<ProfileBuilder />} />
      <Route
        path="/preview"
        element={isOnboarded ? <CardPreview /> : <Landing />}
      />
      {/* Catch-all */}
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
