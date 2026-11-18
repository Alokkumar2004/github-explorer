import { useCallback, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TopNavBar } from './components/TopNavBar';
import { DashboardView } from './views/DashboardView';
import { fetchProfile, fetchTrendingRepos, normalizeUsername } from './services/githubApi';
import type { GitHubUser, ProfileData, Repository } from './types/github';
import './App.css';

export type SearchEntry = { login: string; avatar_url: string; searchedAt: number };
const loadStore = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
};

export default function App() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [trending, setTrending] = useState<Repository[]>([]);
  const [history, setHistory] = useState<SearchEntry[]>(() => loadStore('github-explorer-history', []));
  const [favorites, setFavorites] = useState<GitHubUser[]>(() => loadStore('github-explorer-favorites', []));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const searchSequence = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { localStorage.setItem('github-explorer-history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('github-explorer-favorites', JSON.stringify(favorites)); }, [favorites]);

  const searchUser = useCallback(async (input: string) => {
    let username: string;
    try { username = normalizeUsername(input); } catch (e) { setError(e instanceof Error ? e.message : 'Enter a GitHub username.'); return; }
    const requestId = ++searchSequence.current;
    setLoading(true); setError(''); setNotice('');
    try {
      const result = await fetchProfile(username);
      if (requestId !== searchSequence.current) return;
      setProfile(result);
      setHistory((current) => [{ login: result.user.login, avatar_url: result.user.avatar_url, searchedAt: Date.now() }, ...current.filter((entry) => entry.login.toLowerCase() !== result.user.login.toLowerCase())].slice(0, 8));
      navigate(`/search?user=${encodeURIComponent(result.user.login)}`);
    } catch (e) { if (requestId === searchSequence.current) setError(e instanceof Error ? e.message : 'Unable to search GitHub right now.'); }
    finally { if (requestId === searchSequence.current) setLoading(false); }
  }, [navigate]);

  useEffect(() => {
    const username = new URLSearchParams(location.search).get('user');
    if (location.pathname === '/search' && username && profile?.user.login.toLowerCase() !== username.toLowerCase()) void searchUser(username);
  }, [location.pathname, location.search, profile?.user.login, searchUser]);

  useEffect(() => {
    const controller = new AbortController();
    const cacheKey = 'github-explorer-trending';
    let cache: { items: Repository[]; savedAt: number } | null = null;
    try { cache = JSON.parse(localStorage.getItem(cacheKey) || 'null'); } catch { /* Ignore malformed cache and refresh from GitHub. */ }
    if (cache && Array.isArray(cache.items) && Date.now() - cache.savedAt < 10 * 60_000) setTrending(cache.items);
    else fetchTrendingRepos(controller.signal).then((items) => { setTrending(items); localStorage.setItem(cacheKey, JSON.stringify({ items, savedAt: Date.now() })); }).catch((e) => { if (!controller.signal.aborted) setNotice(e instanceof Error ? e.message : 'Trending repositories are temporarily unavailable.'); });
    return () => controller.abort();
  }, []);

  const toggleFavorite = (user: GitHubUser) => setFavorites((current) => current.some((item) => item.login.toLowerCase() === user.login.toLowerCase()) ? current.filter((item) => item.login.toLowerCase() !== user.login.toLowerCase()) : [user, ...current]);
  const clearNotice = () => setNotice('');
  const viewProps = { profile, trending, history, favorites, loading, onSearch: searchUser, onToggleFavorite: toggleFavorite, onClearHistory: () => setHistory([]) };

  return <div className="app-shell">
    <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} favoriteCount={favorites.length} />
    <button className={`app-backdrop ${mobileOpen ? 'backdrop-visible' : ''}`} aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
    <div className="main-column">
      <TopNavBar onSearch={searchUser} loading={loading} avatarUrl={profile?.user.avatar_url} onMenu={() => setMobileOpen(true)} onNotice={() => setNotice('You’re all caught up.')} />
      <main className="main-content">
        {(error || notice) && <div className={`app-alert ${error ? 'alert-error' : ''}`} role={error ? 'alert' : 'status'}><span>{error || notice}</span><button onClick={() => { setError(''); clearNotice(); }} aria-label="Dismiss">×</button></div>}
        <Routes>
          <Route path="/" element={<DashboardView page="dashboard" {...viewProps} />} />
          <Route path="/search" element={<DashboardView page="search" {...viewProps} />} />
          <Route path="/compare" element={<DashboardView page="compare" {...viewProps} />} />
          <Route path="/favorites" element={<DashboardView page="favorites" {...viewProps} />} />
          <Route path="/analytics" element={<DashboardView page="analytics" {...viewProps} />} />
          <Route path="/history" element={<DashboardView page="history" {...viewProps} />} />
          <Route path="*" element={<DashboardView page="dashboard" {...viewProps} />} />
        </Routes>
      </main>
    </div>
  </div>;
}
