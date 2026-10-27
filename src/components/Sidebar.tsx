import { Trash2 } from 'lucide-react';
import { navItems, type ViewId } from '@/types/nav';

interface SidebarProps {
  current: ViewId;
  onNavigate: (view: ViewId) => void;
  open: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export default function Sidebar({ current, onNavigate, open, onClose, onResetData }: SidebarProps) {

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-mark">K</span>
            <span className="sidebar-logo-text">Khovera</span>
          </div>
          <p className="sidebar-tagline">Your Skill Passport</p>
        </div>


        <p className="sidebar-section-label">Menu</p>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${current === item.id ? 'active' : ''}`}
                onClick={() => { onNavigate(item.id); onClose(); }}
              >
                <Icon />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-reset-btn" onClick={onResetData}>
            <Trash2 />
            Reset demo data
          </button>
        </div>

        <div className="sidebar-prototype-badge">
          Prototype — saved in this browser
        </div>
      </aside>
    </>
  );
}
