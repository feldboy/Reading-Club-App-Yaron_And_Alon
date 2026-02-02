import { useNavigate, useLocation } from 'react-router-dom';

interface NavItemProps {
    icon: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 transition-all active:scale-95 min-w-[48px] min-h-[48px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark rounded-lg ${
                isActive ? 'text-primary' : 'text-[#b09db9] hover:text-white'
            }`}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            role="link"
        >
            <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                aria-hidden="true"
            >
                {icon}
            </span>
            <span className="text-[10px] font-bold">{label}</span>
        </button>
    );
}

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/', icon: 'home', label: 'Home' },
        { path: '/discover', icon: 'explore', label: 'Discover' },
        { path: '/clubs', icon: 'groups', label: 'Clubs' },
        { path: '/profile', icon: 'person', label: 'Profile' }
    ];

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 glass-header px-4 py-3 flex justify-around items-center rounded-t-3xl border-t-0 z-50 bg-background-dark/90 backdrop-blur-md border-t border-white/10 md:px-12 md:max-w-screen-md md:mx-auto md:mb-4 md:rounded-full safe-area-inset-bottom"
            role="navigation"
            aria-label="Main navigation"
        >
            {navItems.slice(0, 2).map((item) => (
                <NavItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                />
            ))}

            {/* Create Review FAB - Mobile only */}
            <div className="md:hidden relative">
                <button
                    onClick={() => navigate('/create-review')}
                    className="size-14 -mt-8 rounded-full bg-gradient-to-tr from-primary to-[#cc49ff] text-white shadow-lg shadow-primary/30 flex items-center justify-center active:scale-90 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background-dark"
                    aria-label="Create new review"
                >
                    <span className="material-symbols-outlined text-3xl" aria-hidden="true">add</span>
                </button>
            </div>

            {/* Desktop: Create button in-line */}
            <div className="hidden md:block">
                <NavItem
                    icon="add_circle"
                    label="Create"
                    isActive={isActive('/create-review')}
                    onClick={() => navigate('/create-review')}
                />
            </div>

            {navItems.slice(2).map((item) => (
                <NavItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                />
            ))}
        </nav>
    );
}
