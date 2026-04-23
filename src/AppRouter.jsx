import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import SetupScreen from './screens/SetupScreen';
import TossScreen from './screens/TossScreen';
import PlayingScreen from './screens/PlayingScreen';
import Team2Screen from './screens/Team2Screen';
import ResultScreen from './screens/ResultScreen';

export default function AppRouter() {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2500);
    return () => clearTimeout(t);
  }, []);

  if (splash) return <SplashScreen />;

  return (
    <Routes>
      <Route path="/" element={<SetupScreen />} />
      <Route path="/toss" element={<TossScreen />} />
      <Route path="/playing" element={<PlayingScreen />} />
      <Route path="/team2" element={<Team2Screen />} />
      <Route path="/result" element={<ResultScreen />} />
    </Routes>
  );
}
