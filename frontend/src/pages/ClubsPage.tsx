import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, AvatarGroup, Chip, EmptyState, ClubCardSkeleton } from '../components/ui';
import { useToggle } from '../hooks';
import { getClubs, joinClub, type Club } from '../services/clubs.api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'My Clubs', 'Sci-Fi', 'Fantasy', 'Mystery', 'Romance', 'Non-Fiction'];

export default function ClubsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, toggleCreateModal] = useToggle(false);

    // Fetch clubs
    useEffect(() => {
        const fetchClubs = async () => {
            setIsLoading(true);
            try {
                const data = await getClubs();
                // Map backend data to UI expected format
                const processedClubs = data.map(club => ({
                    ...club,
                    id: club._id, // Map _id to id
                    memberCount: club.members.length,
                    // Check membership - handle populate vs raw ID
                    isJoined: user ? club.members.some((m: any) => (m._id === user.id || m === user.id)) : false,
                    members: club.members.map((m: any) => ({
                        alt: m.username || 'Member',
                        src: m.profilePicture
                    }))
                }));
                setClubs(processedClubs);
            } catch (error) {
                console.error('Failed to load clubs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClubs();
    }, [user]);

    // Filter clubs based on category
    const filteredClubs = clubs.filter(club => {
        if (selectedCategory === 'All') return true;
        if (selectedCategory === 'My Clubs') return (club as any).isJoined;
        return club.category === selectedCategory;
    });

    // Handle join/leave club
    const handleToggleJoin = async (clubId: string) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            // Optimistic update
            setClubs(prev => prev.map(club => {
                if (club._id === clubId) {
                    const isJoined = !(club as any).isJoined;
                    return {
                        ...club,
                        isJoined,
                        memberCount: isJoined ? club.memberCount + 1 : club.memberCount - 1
                    } as Club;
                }
                return club;
            }));

            await joinClub(clubId);
            // Ideally re-fetch or use returned data
        } catch (error) {
            console.error('Failed to join club:', error);
            // Revert on error could be implemented here
        }
    };

    const joinedClubsCount = clubs.filter(c => (c as any).isJoined).length;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-screen pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 glass-header px-4 pt-12 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Reading Clubs</h1>
                        <p className="text-white/60 text-sm">
                            {joinedClubsCount > 0
                                ? `You're in ${joinedClubsCount} club${joinedClubsCount > 1 ? 's' : ''}`
                                : 'Join a club to start reading together'}
                        </p>
                    </div>
                    <button
                        onClick={toggleCreateModal}
                        className="size-10 rounded-full flex items-center justify-center bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                        aria-label="Create new club"
                    >
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </div>
            </header>

            {/* Category Pills */}
            <div className="px-4 py-4">
                <div className="flex gap-3 overflow-x-auto no-scrollbar" role="listbox" aria-label="Filter by category">
                    {CATEGORIES.map((category) => (
                        <Chip
                            key={category}
                            selected={selectedCategory === category}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category === 'My Clubs' && joinedClubsCount > 0 ? `My Clubs (${joinedClubsCount})` : category}
                        </Chip>
                    ))}
                </div>
            </div>

            {/* Clubs List */}
            <main className="px-4 pb-8 space-y-4">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <ClubCardSkeleton key={i} />
                    ))
                ) : filteredClubs.length === 0 ? (
                    <EmptyState
                        icon={selectedCategory === 'My Clubs' ? 'group_off' : 'search_off'}
                        title={selectedCategory === 'My Clubs' ? "You haven't joined any clubs yet" : 'No clubs found'}
                        description={selectedCategory === 'My Clubs'
                            ? 'Join a club to read and discuss books with others'
                            : `No clubs in the ${selectedCategory} category`}
                        action={selectedCategory === 'My Clubs' ? {
                            label: 'Explore Clubs',
                            onClick: () => setSelectedCategory('All')
                        } : undefined}
                    />
                ) : (
                    filteredClubs.map((club, index) => (
                        <Card
                            key={club._id}
                            variant="glass"
                            className="overflow-hidden animate-fade-in"
                            style={{ animationDelay: `${index * 75}ms` } as React.CSSProperties}
                        >
                            {/* Club Cover Image */}
                            <div className="relative h-32 overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-center bg-cover"
                                    style={{ backgroundImage: `url("${club.cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop'}")` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent" />
                                <div className="absolute top-3 right-3">
                                    <Badge variant={(club as any).isJoined ? 'success' : 'default'}>
                                        {(club as any).isJoined ? 'Joined' : club.category}
                                    </Badge>
                                </div>
                            </div>

                            {/* Club Info */}
                            <div className="p-4 -mt-8 relative">
                                <h3 className="text-lg font-bold text-white mb-1">{club.name}</h3>
                                <p className="text-white/60 text-sm line-clamp-2 mb-4">{club.description}</p>

                                {/* Current Book */}
                                {club.currentBook && (
                                    <div className="flex items-center gap-2 mb-4 p-3 bg-white/5 rounded-xl">
                                        <span className="material-symbols-outlined text-primary text-lg">auto_stories</span>
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Currently Reading</p>
                                            <p className="text-sm font-medium text-white">{club.currentBook}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Club Stats */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <AvatarGroup avatars={club.members} max={4} size="sm" />
                                        <span className="text-white/60 text-xs">{club.memberCount.toLocaleString()} members</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-white/40 text-xs">
                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                        Next: {club.nextMeeting || 'TBA'}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button
                                        variant={(club as any).isJoined ? 'secondary' : 'primary'}
                                        onClick={() => handleToggleJoin(club._id)}
                                        fullWidth
                                        leftIcon={
                                            <span className="material-symbols-outlined text-lg">
                                                {(club as any).isJoined ? 'check' : 'group_add'}
                                            </span>
                                        }
                                    >
                                        {(club as any).isJoined ? 'Joined' : 'Join Club'}
                                    </Button>
                                    {(club as any).isJoined && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => navigate(`/clubs/${club._id}`)}
                                            aria-label="View club details"
                                        >
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </main>

            {/* Floating Create Button (Mobile) */}
            <button
                onClick={toggleCreateModal}
                className="fixed bottom-24 right-4 md:hidden size-14 rounded-full bg-gradient-to-tr from-primary to-purple-600 text-white shadow-lg flex items-center justify-center active:scale-90 transition-transform"
                aria-label="Create new club"
            >
                <span className="material-symbols-outlined text-2xl">add</span>
            </button>

            {/* Create Club Modal (Simple placeholder) */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <Card variant="glass" className="w-full max-w-md p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Create a Club</h2>
                            <button
                                onClick={toggleCreateModal}
                                className="size-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                aria-label="Close modal"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>
                        <p className="text-white/60 mb-6">
                            Start your own reading club and invite others to join your literary journey.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-primary text-xs font-bold uppercase tracking-widest block mb-2">Club Name</label>
                                <input
                                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                                    placeholder="Enter club name..."
                                />
                            </div>
                            <div>
                                <label className="text-primary text-xs font-bold uppercase tracking-widest block mb-2">Category</label>
                                <select className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary/50 outline-none transition-all">
                                    <option value="">Select category</option>
                                    <option value="Sci-Fi">Sci-Fi</option>
                                    <option value="Fantasy">Fantasy</option>
                                    <option value="Mystery">Mystery</option>
                                    <option value="Romance">Romance</option>
                                    <option value="Non-Fiction">Non-Fiction</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-primary text-xs font-bold uppercase tracking-widest block mb-2">Description</label>
                                <textarea
                                    className="w-full min-h-24 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all resize-none"
                                    placeholder="Tell people what your club is about..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button variant="secondary" onClick={toggleCreateModal} fullWidth>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={toggleCreateModal} fullWidth>
                                Create Club
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
