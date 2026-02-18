import { Link } from 'react-router-dom';
import { Badge } from '../ui';

interface ClubCardProps {
    club: {
        id: string;
        name: string;
        description?: string;
        memberCount?: number;
        bookCount?: number;
        category?: string;
        coverImage?: string;
        isPrivate?: boolean;
        recentActivity?: string;
    };
    variant?: 'grid' | 'list' | 'featured';
    showJoinButton?: boolean;
    onJoin?: (clubId: string) => void;
    isMember?: boolean;
}

/**
 * Club Card Component with multiple display variants
 */
export default function ClubCard({
    club,
    variant = 'grid',
    showJoinButton = true,
    onJoin,
    isMember = false,
}: ClubCardProps) {
    const handleJoinClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onJoin?.(club.id);
    };

    // Featured variant - large hero card
    if (variant === 'featured') {
        return (
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7C3AED] via-[#A78BFA] to-[#7C3AED] shadow-2xl hover:shadow-3xl transition-all duration-500 animate-scale-in">
                {club.coverImage && (
                    <div className="absolute inset-0">
                        <img
                            src={club.coverImage}
                            alt={`${club.name} cover`}
                            className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/90 via-[#A78BFA]/90 to-[#7C3AED]/90" />
                    </div>
                )}

                <div className="relative z-10 p-8 sm:p-12">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            {club.category && (
                                <Badge variant="primary" size="md" className="mb-4 bg-white/20 text-white backdrop-blur-sm">
                                    {club.category}
                                </Badge>
                            )}
                            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                {club.name}
                            </h2>
                            {club.description && (
                                <p className="font-body text-lg sm:text-xl text-white/90 leading-relaxed line-clamp-3 mb-8">
                                    {club.description}
                                </p>
                            )}
                        </div>
                        {club.isPrivate && (
                            <div className="flex-shrink-0">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <span className="material-symbols-outlined text-white text-2xl">lock</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 mb-8">
                        {club.memberCount !== undefined && (
                            <div className="flex items-center gap-2 text-white">
                                <span className="material-symbols-outlined text-2xl">group</span>
                                <span className="font-bold text-xl">{club.memberCount}</span>
                                <span className="text-white/80">members</span>
                            </div>
                        )}
                        {club.bookCount !== undefined && (
                            <div className="flex items-center gap-2 text-white">
                                <span className="material-symbols-outlined text-2xl">menu_book</span>
                                <span className="font-bold text-xl">{club.bookCount}</span>
                                <span className="text-white/80">books</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link
                            to={`/clubs/${club.id}`}
                            className="px-8 py-4 bg-white text-[#7C3AED] hover:bg-white/90 rounded-2xl font-bold text-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                        >
                            View Club
                        </Link>
                        {showJoinButton && !isMember && (
                            <button
                                onClick={handleJoinClick}
                                className="px-8 py-4 bg-[#22C55E] text-white hover:bg-[#22C55E]/90 rounded-2xl font-bold text-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                            >
                                Join Club
                            </button>
                        )}
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
                </div>
            </div>
        );
    }

    // List variant - horizontal card
    if (variant === 'list') {
        return (
            <Link
                to={`/clubs/${club.id}`}
                className="group flex gap-4 p-6 bg-white dark:bg-white/5 rounded-2xl border-2 border-transparent hover:border-[#7C3AED]/30 dark:hover:border-white/20 shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in cursor-pointer"
            >
                {/* Cover Image */}
                {club.coverImage && (
                    <div className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden shadow-md">
                        <img
                            src={club.coverImage}
                            alt={`${club.name} cover`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                {club.category && (
                                    <Badge variant="primary" size="sm">
                                        {club.category}
                                    </Badge>
                                )}
                                {club.isPrivate && (
                                    <span className="material-symbols-outlined text-[#7C3AED] dark:text-white/60 text-sm">
                                        lock
                                    </span>
                                )}
                            </div>
                            <h3 className="font-heading font-bold text-[#4C1D95] dark:text-white text-xl sm:text-2xl leading-tight mb-2 group-hover:text-[#7C3AED] transition-colors">
                                {club.name}
                            </h3>
                        </div>
                    </div>
                    {club.description && (
                        <p className="font-body text-[#4C1D95]/70 dark:text-white/70 text-sm sm:text-base leading-relaxed line-clamp-2 mb-4">
                            {club.description}
                        </p>
                    )}
                    <div className="flex items-center gap-6 text-[#7C3AED] dark:text-white/60 text-sm">
                        {club.memberCount !== undefined && (
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base">group</span>
                                <span className="font-medium">{club.memberCount}</span>
                            </div>
                        )}
                        {club.bookCount !== undefined && (
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base">menu_book</span>
                                <span className="font-medium">{club.bookCount} books</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Join Button */}
                {showJoinButton && !isMember && (
                    <div className="flex-shrink-0 flex items-center">
                        <button
                            onClick={handleJoinClick}
                            className="px-6 py-3 bg-[#7C3AED] text-white hover:bg-[#6D31D4] rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                        >
                            Join
                        </button>
                    </div>
                )}
            </Link>
        );
    }

    // Grid variant - vertical card (default)
    return (
        <Link
            to={`/clubs/${club.id}`}
            className="group block h-full animate-fade-in"
        >
            <div className="h-full flex flex-col bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#7C3AED]/20 dark:hover:border-white/10 transition-all duration-300 cursor-pointer">
                {/* Cover Image */}
                <div className="relative">
                    <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#7C3AED]/20 to-[#A78BFA]/20 dark:from-[#7C3AED]/10 dark:to-[#A78BFA]/10">
                        {club.coverImage ? (
                            <img
                                src={club.coverImage}
                                alt={`${club.name} cover`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-6xl text-[#7C3AED]/30 dark:text-white/20">
                                    groups
                                </span>
                            </div>
                        )}
                    </div>
                    {club.isPrivate && (
                        <div className="absolute top-3 right-3">
                            <div className="p-2 bg-black/40 backdrop-blur-sm rounded-lg">
                                <span className="material-symbols-outlined text-white text-lg">lock</span>
                            </div>
                        </div>
                    )}
                    {club.category && (
                        <div className="absolute top-3 left-3">
                            <Badge variant="primary" size="sm" className="shadow-md backdrop-blur-sm">
                                {club.category}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-heading font-bold text-[#4C1D95] dark:text-white text-lg sm:text-xl leading-tight line-clamp-2 mb-3 group-hover:text-[#7C3AED] transition-colors">
                        {club.name}
                    </h3>
                    {club.description && (
                        <p className="font-body text-[#4C1D95]/70 dark:text-white/70 text-sm leading-relaxed line-clamp-3 mb-4">
                            {club.description}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-auto pt-4 border-t-2 border-[#7C3AED]/10 dark:border-white/10 text-[#7C3AED] dark:text-white/60 text-xs sm:text-sm">
                        {club.memberCount !== undefined && (
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base">group</span>
                                <span className="font-medium">{club.memberCount}</span>
                            </div>
                        )}
                        {club.bookCount !== undefined && (
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base">menu_book</span>
                                <span className="font-medium">{club.bookCount}</span>
                            </div>
                        )}
                    </div>

                    {/* Join Button */}
                    {showJoinButton && !isMember && (
                        <button
                            onClick={handleJoinClick}
                            className="mt-4 w-full px-4 py-3 bg-[#7C3AED] text-white hover:bg-[#6D31D4] rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                        >
                            Join Club
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
}
