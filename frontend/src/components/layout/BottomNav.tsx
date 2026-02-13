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
            className={`group relative flex flex-col items-center gap-1.5 transition-all duration-300 active:scale-95 min-w-[60px] min-h-[60px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a0f2e] rounded-2xl cursor-pointer ${
                isActive
                    ? 'text-[#7C3AED]'
                    : 'text-purple-300/60 hover:text-purple-200'
            }`}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            role="link"
        >
            {isActive && (
                <div className="absolute inset-0 bg-[#7C3AED]/10 rounded-2xl" />
            )}
            <span
                className={`material-symbols-outlined text-2xl sm:text-3xl relative z-10 transition-all duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                }`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                aria-hidden="true"
            >
                {icon}
            </span>
            <span className={`text-[10px] sm:text-xs font-bold relative z-10 transition-all duration-300 ${
                isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
            }`}>
                {label}
            </span>
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
            className="fixed bottom-0 left-0 right-0 px-4 sm:px-6 py-4 flex justify-around items-center z-[100] bg-[#1a0f2e]/95 backdrop-blur-2xl border-t border-white/10 md:px-12 md:max-w-screen-md md:mx-auto md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:rounded-3xl md:border md:shadow-2xl md:shadow-purple-500/10 safe-area-inset-bottom shadow-2xl shadow-black/20"
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
                    className="group size-16 -mt-10 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] text-white shadow-xl shadow-purple-500/40 flex items-center justify-center active:scale-90 hover:scale-110 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-4 focus-visible:ring-offset-[#1a0f2e] cursor-pointer"
                    aria-label="Create new review"
                >
                    <span className="material-symbols-outlined text-4xl group-hover:rotate-90 transition-transform duration-300" aria-hidden="true">add</span>
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
