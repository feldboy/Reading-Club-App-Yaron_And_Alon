import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const Intro: React.FC = () => {
    const frame = useCurrentFrame();

    const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const titleY = interpolate(frame, [0, 30], [50, 0], {
        extrapolateRight: 'clamp',
    });

    const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const subtitleY = interpolate(frame, [20, 50], [30, 0], {
        extrapolateRight: 'clamp',
    });

    const bookScale = interpolate(frame, [30, 60], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const bookRotate = interpolate(frame, [30, 90], [-20, 0], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Inter, system-ui, sans-serif',
            }}
        >
            {/* Animated background circles */}
            <div
                style={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    top: '-200px',
                    right: '-100px',
                    filter: 'blur(80px)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.15)',
                    bottom: '-100px',
                    left: '-50px',
                    filter: 'blur(60px)',
                }}
            />

            {/* Main content container */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Book icon decoration */}
                <div
                    style={{
                        fontSize: 120,
                        opacity: bookScale,
                        transform: `scale(${bookScale}) rotate(${bookRotate}deg)`,
                        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
                    }}
                >
                    📚
                </div>

                {/* Title */}
                <h1
                    style={{
                        fontSize: 90,
                        fontWeight: 900,
                        color: 'white',
                        margin: 0,
                        opacity: titleOpacity,
                        transform: `translateY(${titleY}px)`,
                        textAlign: 'center',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        letterSpacing: '-2px',
                    }}
                >
                    Reading Club
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: 36,
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.95)',
                        margin: 0,
                        opacity: subtitleOpacity,
                        transform: `translateY(${subtitleY}px)`,
                        textAlign: 'center',
                        letterSpacing: '1px',
                    }}
                >
                    Share Reviews • Discover Books • Connect with Readers
                </p>
            </div>
        </AbsoluteFill>
    );
};
