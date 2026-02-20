import { Audio, AbsoluteFill } from 'remotion';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { fade } from '@remotion/transitions/fade';
import { IntroV2 } from './scenes/IntroV2';
import { VideoScene } from './scenes/VideoScene';
import { Outro } from './scenes/Outro';

/**
 * Reading Club App Demo - Real Footage Version
 * Durations calculated from actual video files at 30fps
 */

export const MainWithFootage: React.FC = () => {
    return (
        <AbsoluteFill>
            {/* Background Music */}
            <Audio
                src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"
                volume={0.08}
                startFrom={0}
            />

            <TransitionSeries>
                {/* INTRO - 900 frames (30s) */}
                <TransitionSeries.Sequence durationInFrames={900}>
                    <IntroV2 />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                {/* LOGIN - 1425 frames (47.5s) */}
                <TransitionSeries.Sequence durationInFrames={1425}>
                    <VideoScene
                        videoSrc="footage/login.mp4"
                        title="User Authentication"
                        subtitle="JWT & Google OAuth"
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-right' })}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* HOME FEED - 2223 frames (74.1s) */}
                <TransitionSeries.Sequence durationInFrames={2223}>
                    <VideoScene
                        videoSrc="footage/home-feed.mp4"
                        title="Home Page & Feed"
                        subtitle="Infinite scroll with reviews"
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* AI SEARCH - 1683 frames (56.1s) */}
                <TransitionSeries.Sequence durationInFrames={1683}>
                    <VideoScene
                        videoSrc="footage/ai-search.mp4"
                        title="AI-Powered Search"
                        subtitle="Gemini AI recommendations"
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-left' })}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* CREATE REVIEW - 2415 frames (80.5s) */}
                <TransitionSeries.Sequence durationInFrames={2415}>
                    <VideoScene
                        videoSrc="footage/create-review.mp4"
                        title="Creating Reviews"
                        subtitle="Google Books API integration"
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* SOCIAL - 1806 frames (60.2s) */}
                <TransitionSeries.Sequence durationInFrames={1806}>
                    <VideoScene
                        videoSrc="footage/social.mp4"
                        title="Social Features"
                        subtitle="Likes, comments & engagement"
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-right' })}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* DISCOVER - 1950 frames (65s) */}
                <TransitionSeries.Sequence durationInFrames={1950}>
                    <VideoScene
                        videoSrc="footage/discover.mp4"
                        title="Book Discovery"
                        subtitle="Categories & search"
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* CLUBS - 3027 frames (100.9s) */}
                <TransitionSeries.Sequence durationInFrames={3027}>
                    <VideoScene
                        videoSrc="footage/clubs.mp4"
                        title="Reading Clubs"
                        subtitle="Join & create communities"
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-left' })}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* WISHLIST - 2148 frames (71.6s) */}
                <TransitionSeries.Sequence durationInFrames={2148}>
                    <VideoScene
                        videoSrc="footage/wishlist.mp4"
                        title="Wishlist"
                        subtitle="Save books for later"
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* PROFILE - 1167 frames (38.9s) */}
                <TransitionSeries.Sequence durationInFrames={1167}>
                    <VideoScene
                        videoSrc="footage/profile.mp4"
                        title="User Profile"
                        subtitle="Customization & history"
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-right' })}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* SWAGGER - 555 frames (18.5s) */}
                <TransitionSeries.Sequence durationInFrames={555}>
                    <VideoScene
                        videoSrc="footage/swagger.mp4"
                        title="API Documentation"
                        subtitle="Swagger/OpenAPI"
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* TESTS - 915 frames (30.5s) */}
                <TransitionSeries.Sequence durationInFrames={915}>
                    <VideoScene
                        videoSrc="footage/tests.mp4"
                        title="Test Suite"
                        subtitle="Jest with coverage"
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-left' })}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                {/* RESPONSIVE - 732 frames (24.4s) */}
                <TransitionSeries.Sequence durationInFrames={732}>
                    <VideoScene
                        videoSrc="footage/responsive.mp4"
                        title="Responsive Design"
                        subtitle="Mobile-first with Tailwind"
                    />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                {/* OUTRO - 900 frames (30s) */}
                <TransitionSeries.Sequence durationInFrames={900}>
                    <Outro />
                </TransitionSeries.Sequence>
            </TransitionSeries>
        </AbsoluteFill>
    );
};
