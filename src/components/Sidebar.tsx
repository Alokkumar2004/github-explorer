import { NavLink } from 'react-router-dom';
import { Activity, BarChart3, Code2, GitCompareArrows, Heart, History, LayoutDashboard, Search, Terminal, X } from 'lucide-react';

type Props = { mobileOpen: boolean; onNavigate: () => void; favoriteCount: number };
const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: GitCompareArrows, label: 'Compare', path: '/compare' },
  { icon: Heart, label: 'Favorites', path: '/favorites' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: History, label: 'History', path: '/history' },
];

export function Sidebar({ mobileOpen, onNavigate, favoriteCount }: Props) {
  return <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
    <div className="sidebar-brand"><span className="brand-icon"><Code2 size={21}/></span><span className="brand-copy"><b>GitHub <i>Explorer</i></b><small>DEVELOPER INTELLIGENCE</small></span><button className="close-sidebar" onClick={onNavigate} aria-label="Close menu"><X size={18}/></button></div>
    <div className="workspace-select"><span className="workspace-indicator"/> <span>Personal workspace</span><span className="workspace-chevron">⌄</span></div>
    <div className="sidebar-caption">WORKSPACE</div>
    <nav className="sidebar-nav">{navItems.map(({ icon: Icon, label, path }) => <NavLink key={path} to={path} onClick={onNavigate} end={path === '/'} className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}><Icon size={17}/><span>{label}</span>{label === 'Favorites' && favoriteCount > 0 && <em>{favoriteCount}</em>}</NavLink>)}</nav>
    <div className="sidebar-caption discover-caption">DISCOVER</div>
    <button className="sidebar-link" onClick={() => { document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' }); onNavigate(); }}><Activity size={17}/><span>Trending repositories</span></button>
    <button className="sidebar-link" onClick={() => { document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth' }); onNavigate(); }}><BarChart3 size={17}/><span>Analytics</span></button>
    <div className="sidebar-bottom"><div className="rocket-card"><div className="rocket-card-glow"/><img src="src={import.meta.env.BASE_URL + 'Rocket.png'}" alt="Neon rocket launching"/><div className="rocket-content"><Terminal size={14}/><b>Build. Explore.<br/>Grow.</b><span>Every commit moves you forward.</span></div></div><div className="sidebar-footer"><span className="status-led"/> GitHub REST API <span className="version-label">v1.0</span></div></div>
  </aside>;
}
