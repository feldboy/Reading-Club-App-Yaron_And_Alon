import { useState } from 'react';
import { addToWishlist, removeFromWishlist } from '../../services/user.api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface WishlistButtonProps {
    bookId: string;
    title: string;
    authors: string[];
    cover: string;
    isInWishlist: boolean;
    onToggle?: (newState: boolean) => void;
    className?: string;
}

export default function WishlistButton({
    bookId,
    title,
    authors,
    cover,
    isInWishlist: initialStatus,
    onToggle,
    className = ''
}: WishlistButtonProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isInWishlist, setIsInWishlist] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate('/login');
            return;
        }

        setIsLoading(true);
        // Optimistic update
        const newState = !isInWishlist;
        setIsInWishlist(newState);
        if (onToggle) onToggle(newState);

        try {
            if (newState) {
                await addToWishlist({ bookId, title, authors, cover });
            } else {
                await removeFromWishlist(bookId);
            }
        } catch (error) {
            console.error('Failed to update wishlist:', error);
            // Revert optimistic update
            setIsInWishlist(!newState);
            if (onToggle) onToggle(!newState);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`rounded-full p-2 transition-all ${isInWishlist
                    ? 'text-primary bg-primary/10 hover:bg-primary/20'
                    : 'text-white/60 hover:text-primary hover:bg-white/10'
                } ${className}`}
            title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
            <span
                className={`material-symbols-outlined text-xl ${isLoading ? 'animate-pulse' : ''}`}
                style={{ fontVariationSettings: isInWishlist ? "'FILL' 1" : "'FILL' 0" }}
            >
                bookmark
            </span>
        </button>
    );
}
