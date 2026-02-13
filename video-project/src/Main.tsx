import { Audio, AbsoluteFill } from 'remotion';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import { IntroV2 } from './scenes/IntroV2';
import { LoginDemo } from './scenes/LoginDemo';
import { ReviewDemo } from './scenes/ReviewDemo';
import { SocialDemo } from './scenes/SocialDemo';
import { AISearchDemo } from './scenes/AISearchDemo';
import { TechnicalDemo } from './scenes/TechnicalDemo';
import { Outro } from './scenes/Outro';

export const Main: React.FC = () => {
    // Professional demo video showcasing Reading Club App
    // Frames breakdown (30 fps):
    // Intro: 180 frames (6s) - Brand reveal with smooth animations
    // Login Demo: 150 frames (5s) - Authentication & registration
    // Review Demo: 150 frames (5s) - Create review with image
    // Social Demo: 150 frames (5s) - Likes & comments interaction
    // AI Search Demo: 180 frames (6s) - AI-powered book discovery
    // Technical: 150 frames (5s) - Swagger, Jest, PM2
    // Outro: 120 frames (4s) - CTA and GitHub link
    // Total: ~36 seconds - Professional, fast-paced demo

    return (
        <AbsoluteFill>
            {/* Background Music */}
            <Audio
                src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"
                volume={0.2}
                startFrom={0}
            />

            <TransitionSeries>
                <TransitionSeries.Sequence durationInFrames={180}>
                    <IntroV2 />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-right' })}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                <TransitionSeries.Sequence durationInFrames={150}>
                    <LoginDemo />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                <TransitionSeries.Sequence durationInFrames={150}>
                    <ReviewDemo />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={wipe({ direction: 'from-top' })}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                <TransitionSeries.Sequence durationInFrames={150}>
                    <SocialDemo />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={slide({ direction: 'from-left' })}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                <TransitionSeries.Sequence durationInFrames={180}>
                    <AISearchDemo />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 15 })}
                />

                <TransitionSeries.Sequence durationInFrames={150}>
                    <TechnicalDemo />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={wipe({ direction: 'from-bottom' })}
                    timing={linearTiming({ durationInFrames: 20 })}
                />

                <TransitionSeries.Sequence durationInFrames={120}>
                    <Outro />
                </TransitionSeries.Sequence>
            </TransitionSeries>
        </AbsoluteFill>
    );
};
