import { Series } from 'remotion';
import { Intro } from './scenes/Intro';
import { Features } from './scenes/Features';
import { Technical } from './scenes/Technical';
import { Outro } from './scenes/Outro';

export const Main: React.FC = () => {
    // Frames breakdown:
    // Intro: 900 frames (30s)
    // Features: 9000 frames (5m)
    // Technical: 5400 frames (3m)
    // Outro: 900 frames (30s)

    return (
        <Series>
            <Series.Sequence durationInFrames={900}>
                <Intro />
            </Series.Sequence>
            <Series.Sequence durationInFrames={9000}>
                <Features />
            </Series.Sequence>
            <Series.Sequence durationInFrames={5400}>
                <Technical />
            </Series.Sequence>
            <Series.Sequence durationInFrames={900}>
                <Outro />
            </Series.Sequence>
        </Series>
    );
};
