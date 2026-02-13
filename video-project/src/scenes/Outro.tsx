import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

export const Outro: React.FC = () => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const opacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill style={{ backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontSize: 100, color: 'white', opacity, fontFamily: 'Arial' }}>
                Thank You!
            </h1>
            <p style={{ fontSize: 40, color: 'white', marginTop: 20, opacity }}>
                github.com/feldboy/Reading-Club-App-Yaron_And_Alon
            </p>
        </AbsoluteFill>
    );
};
