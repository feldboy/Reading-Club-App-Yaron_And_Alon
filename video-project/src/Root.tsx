import { Composition } from 'remotion';
import { Main } from './Main';
import { MainWithFootage } from './MainWithFootage';

export const Root: React.FC = () => {
    // ANIMATED VERSION (Original mockups)
    // Total: ~36 seconds demo

    // FOOTAGE VERSION (Real screen recordings)
    // Total Duration breakdown:
    // Intro: 30s (900 frames)
    // Login: 60s (1800 frames)
    // Home Feed: 75s (2250 frames)
    // AI Search: 60s (1800 frames)
    // Create Review: 90s (2700 frames)
    // Social: 90s (2700 frames)
    // Discover: 60s (1800 frames)
    // Clubs: 75s (2250 frames)
    // Wishlist: 45s (1350 frames)
    // Profile: 60s (1800 frames)
    // Swagger: 60s (1800 frames)
    // Tests: 45s (1350 frames)
    // Responsive: 45s (1350 frames)
    // Outro: 30s (900 frames)
    // Total: ~825s = 13.75 min (~24750 frames)
    // Target after editing: 8-9 minutes

    return (
        <>
            {/* Animated Demo (short version) */}
            <Composition
                id="Main"
                component={Main}
                durationInFrames={16200}
                width={1920}
                height={1080}
                fps={30}
            />

            {/* Real Footage Version - ~12 min total */}
            <Composition
                id="MainWithFootage"
                component={MainWithFootage}
                durationInFrames={22100}
                width={1920}
                height={1080}
                fps={30}
            />
        </>
    );
};
