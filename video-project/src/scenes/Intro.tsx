import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const Intro: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const scale = interpolate(frame, [0, 100], [0.8, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontSize: 100, opacity, transform: `scale(${scale})`, fontFamily: 'Arial' }}>
                Welcome to Reading Club App Demo
            </h1>
        </AbsoluteFill>
    );
};
