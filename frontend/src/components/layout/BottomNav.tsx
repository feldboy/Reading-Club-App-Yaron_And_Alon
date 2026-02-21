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
            className={`group relative flex flex-col items-center gap-1 transition-all duration-300 active:scale-95 min-w-[56px] min-h-[56px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] rounded-2xl cursor-pointer ${
                isActive
                    ? 'text-primary'
                    : 'text-white/40 hover:text-white/70'
            }`}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            role="link"
        >
            {/* Active background glow */}
            {isActive && (
                <div className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20" />
            )}
            {/* Icon with glow on active */}
            <span
                className={`material-symbols-outlined text-[22px] sm:text-2xl relative z-10 transition-all duration-300 ${
                    isActive
                        ? 'scale-110 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                        : 'group-hover:scale-105'
                }`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                aria-hidden="true"
            >
                {icon}
            </span>
            <span className={`text-[10px] font-bold relative z-10 transition-all duration-300 font-ui uppercase tracking-wide ${
                isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'
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
        { path: '/wishlist', icon: 'bookmarks', label: 'Saved' },
        { path: '/profile', icon: 'person', label: 'Profile' }
    ];

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 w-full md:max-w-[480px] md:mx-auto md:left-1/2 md:-translate-x-1/2 px-3 sm:px-5 py-3 flex justify-around items-center z-[100] border-t border-white/[0.04] md:rounded-b-3xl md:border-b-0"
            style={{
                background: 'linear-gradient(180deg, rgba(3,3,3,0.95) 0%, rgba(3,3,3,0.98) 100%)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                boxShadow: '0 -10px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)'
            }}
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

            {/* Premium Create Review FAB - Mobile only */}
            <div className="md:hidden relative">
                <button
                    onClick={() => navigate('/create-review')}
                    className="group relative size-14 -mt-8 rounded-full text-white flex items-center justify-center active:scale-90 hover:scale-105 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#030303] cursor-pointer overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
                        boxShadow: '0 10px 30px -5px rgba(139,92,246,0.5), 0 0 40px -10px rgba(139,92,246,0.4)'
                    }}
                    aria-label="Create new review"
                >
                    {/* Shimmer effect */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            animation: 'shimmer-slide 2s ease-in-out infinite',
                            backgroundSize: '200% 100%'
                        }}
                    />
                    <span className="material-symbols-outlined text-3xl relative z-10 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true">add</span>
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
