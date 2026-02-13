import { Audio, AbsoluteFill } from 'remotion';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import { IntroV2 } from './scenes/IntroV2';
import { VideoScene } from './scenes/VideoScene';
import { Outro } from './scenes/Outro';

/**
 * Reading Club App Demo - Using Real Footage
 *
 * INSTRUCTIONS:
 * 1. Record your screen using OBS, QuickTime, or Loom
 * 2. Save videos to: video-project/public/footage/
 * 3. Name your files to match the scene names below
 *
 * Required footage files (place in public/footage/):
 * - login.mp4        (User registration & login demo)
 * - home-feed.mp4    (Home page with infinite scroll)
 * - ai-search.mp4    (AI-powered book search)
 * - create-review.mp4 (Creating a new book review)
 * - social.mp4       (Likes, comments, interactions)
 * - discover.mp4     (Book discovery & categories)
 * - clubs.mp4        (Reading clubs demo)
 * - wishlist.mp4     (Wishlist functionality)
 * - profile.mp4      (User profile & editing)
 * - swagger.mp4      (API documentation demo)
 * - tests.mp4        (Running Jest tests)
 * - responsive.mp4   (Mobile/tablet responsive demo)
 */

export const MainWithFootage: React.FC = () => {
    // Video structure following VIDEO-DEMO-SCRIPT.md
    // Adjust durationInFrames based on your actual footage length
    // 30 fps = 1 second is 30 frames

    return (
        <AbsoluteFill>
            {/* Background Music - softer for voiceover */}
            <Audio
                src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"
                volume={0.1}
                startFrom={0}
            />

            <TransitionSeries>
                {/* 1. INTRO - Animated title (30 seconds = 900 frames) */}
                <TransitionSeries.Sequence durationInFrames={900}>
                    <IntroV2 />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 30 })}
                />

                {/* 2. AUTHENTICATION - Login & Register (60 seconds = 1800 frames) */}
                <TransitionSeries.Sequence durationInFrames={1800}>
                    <VideoScene
                        videoSrc="footage/login.mp4"
                        title="User Authentication"
                        subtitle="JWT & Google OAuth login"
                        titleDuration={120}
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-right' })}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                {/* 3. HOME PAGE & FEED (75 seconds = 2250 frames) */}
                <TransitionSeries.Sequence durationInFrames={2250}>
                    <VideoScene
                        videoSrc="footage/home-feed.mp4"
                        title="Home Page & Feed"
                        subtitle="Personalized reviews with infinite scroll"
                        titleDuration={120}
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                {/* 4. AI SEARCH (60 seconds = 1800 frames) */}
                <TransitionSeries.Sequence durationInFrames={1800}>
                    <VideoScene
                        videoSrc="footage/ai-search.mp4"
                        title="AI-Powered Search"
                        subtitle="Gemini AI book recommendations"
                        titleDuration={120}
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={wipe({ direction: 'from-top' })}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                {/* 5. CREATE REVIEW (90 seconds = 2700 frames) */}
                <TransitionSeries.Sequence durationInFrames={2700}>
                    <VideoScene
                        videoSrc="footage/create-review.mp4"
                        title="Creating Reviews"
                        subtitle="Google Books API integration"
                        titleDuration={120}
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-left' })}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                {/* 6. SOCIAL INTERACTIONS (90 seconds = 2700 frames) */}
                <TransitionSeries.Sequence durationInFrames={2700}>
                    <VideoScene
                        videoSrc="footage/social.mp4"
                        title="Social Features"
                        subtitle="Likes, comments & engagement"
                        titleDuration={120}
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                {/* 7. BOOK DISCOVERY (60 seconds = 1800 frames) */}
                <TransitionSeries.Sequence durationInFrames={1800}>
                    <VideoScene
                        videoSrc="footage/discover.mp4"
                        title="Book Discovery"
                        subtitle="Categories & real-time search"
                        titleDuration={120}
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={wipe({ direction: 'from-bottom' })}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                {/* 8. READING CLUBS (75 seconds = 2250 frames) */}
                <TransitionSeries.Sequence durationInFrames={2250}>
                    <VideoScene
                        videoSrc="footage/clubs.mp4"
                        title="Reading Clubs"
                        subtitle="Join & create book communities"
                        titleDuration={120}
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-right' })}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                {/* 9. WISHLIST (45 seconds = 1350 frames) */}
                <TransitionSeries.Sequence durationInFrames={1350}>
                    <VideoScene
                        videoSrc="footage/wishlist.mp4"
                        title="Wishlist"
                        subtitle="Save books for later"
                        titleDuration={90}
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                {/* 10. USER PROFILE (60 seconds = 1800 frames) */}
                <TransitionSeries.Sequence durationInFrames={1800}>
                    <VideoScene
                        videoSrc="footage/profile.mp4"
                        title="User Profile"
                        subtitle="Customization & activity history"
                        titleDuration={120}
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={wipe({ direction: 'from-left' })}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                {/* 11. TECHNICAL - SWAGGER (60 seconds = 1800 frames) */}
                <TransitionSeries.Sequence durationInFrames={1800}>
                    <VideoScene
                        videoSrc="footage/swagger.mp4"
                        title="API Documentation"
                        subtitle="Swagger/OpenAPI REST endpoints"
                        titleDuration={120}
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                {/* 12. TECHNICAL - TESTS (45 seconds = 1350 frames) */}
                <TransitionSeries.Sequence durationInFrames={1350}>
                    <VideoScene
                        videoSrc="footage/tests.mp4"
                        title="Test Suite"
                        subtitle="Jest with 80%+ coverage"
                        titleDuration={90}
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-bottom' })}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                {/* 13. RESPONSIVE DESIGN (45 seconds = 1350 frames) */}
                <TransitionSeries.Sequence durationInFrames={1350}>
                    <VideoScene
                        videoSrc="footage/responsive.mp4"
                        title="Responsive Design"
                        subtitle="Mobile-first with Tailwind CSS"
                        titleDuration={90}
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 30 })}
                />

                {/* 14. OUTRO (30 seconds = 900 frames) */}
                <TransitionSeries.Sequence durationInFrames={900}>
                    <Outro />
                </TransitionSeries.Sequence>
            </TransitionSeries>
        </AbsoluteFill>
    );
};
