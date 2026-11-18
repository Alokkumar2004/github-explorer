import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, LoaderCircle, Menu, Search } from 'lucide-react';

type Props = { onSearch: (username: string) => void; loading: boolean; avatarUrl?: string; onMenu: () => void; onNotice: () => void };
const titles: Record<string, string> = { '/': 'Dashboard', '/search': 'Search results', '/compare': 'Compare developers', '/favorites': 'Favorites', '/analytics': 'Analytics', '/history': 'Search history' };

export function TopNavBar({ onSearch, loading, avatarUrl, onMenu, onNotice }: Props) {
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => { const user = new URLSearchParams(location.search).get('user'); if (user) setQuery(user); }, [location.search]);
  const submit = (event: FormEvent) => { event.preventDefault(); onSearch(query); };
  const title = titles[location.pathname] || 'Dashboard';

  return <header className="topbar"><button className="mobile-menu" aria-label="Open navigation" onClick={onMenu}><Menu size={20}/></button><div className="breadcrumb"><span>Workspace</span><i>/</i><b>{title}</b></div><form className="search-form" onSubmit={submit}><Search size={16}/><input aria-label="GitHub username" value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => { if (location.pathname !== '/search') navigate('/search'); }} placeholder="Search GitHub username..."/><kbd>⌘ K</kbd><button type="submit" disabled={loading} aria-label="Search GitHub">{loading ? <LoaderCircle size={16} className="spin"/> : <ArrowRight size={16}/>}</button></form><div className="topbar-actions"><span className="api-live"><i/> API connected</span><button className="notification-button" aria-label="Notifications" onClick={onNotice}><Bell size={18}/><i/></button><div className="top-avatar">{avatarUrl ? <img src={avatarUrl} alt="Current GitHub profile"/> : <span>⌘</span>}</div></div></header>;
}
