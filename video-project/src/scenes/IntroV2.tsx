import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Rec } from '@remotion/shapes';

export const IntroV2: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Animated particles
    const particles = Array.from({ length: 50 }, (_, i) => ({
        x: (Math.sin(i * 0.5) * width) / 2 + width / 2,
        y: (Math.cos(i * 0.7) * height) / 2 + height / 2,
        delay: i * 2,
        speed: 0.5 + (i % 3) * 0.3,
    }));

    // Logo reveal animation
    const logoScale = interpolate(frame, [0, 40], [0, 1.2], {
        extrapolateRight: 'clamp',
    });

    const logoRotate = interpolate(frame, [0, 60], [180, 0], {
        extrapolateRight: 'clamp',
    });

    const logoFinalScale = interpolate(frame, [40, 60], [1.2, 1], {
        extrapolateRight: 'clamp',
    });

    // Title animation with bounce
    const titleY = interpolate(frame, [60, 90], [100, 0], {
        extrapolateRight: 'clamp',
    });

    const titleOpacity = interpolate(frame, [60, 80], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Subtitle animation
    const subtitleScale = interpolate(frame, [90, 120], [0.8, 1], {
        extrapolateRight: 'clamp',
    });

    const subtitleOpacity = interpolate(frame, [90, 110], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Shine effect
    const shineX = interpolate(frame, [100, 150], [-500, width + 500], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                fontFamily: 'Inter, system-ui, sans-serif',
            }}
        >
            {/* Animated background particles */}
            {particles.map((particle, i) => {
                const particleFrame = Math.max(0, frame - particle.delay);
                const particleY = interpolate(
                    particleFrame,
                    [0, 180],
                    [particle.y, particle.y - height - 200],
                    {
                        extrapolateRight: 'clamp',
                    }
                );

                const particleOpacity = interpolate(particleFrame, [0, 20, 160, 180], [0, 1, 1, 0], {
                    extrapolateRight: 'clamp',
                });

                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: particle.x,
                            top: particleY,
                            width: 4,
                            height: 20,
                            background: 'rgba(255, 255, 255, 0.6)',
                            borderRadius: '2px',
                            opacity: particleOpacity,
                            filter: 'blur(1px)',
                        }}
                    />
                );
            })}

            {/* Radial gradient overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.2) 100%)`,
                }}
            />

            {/* Main content */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }}
            >
                {/* Logo with glow effect */}
                <div
                    style={{
                        fontSize: 140,
                        transform: `scale(${logoScale * logoFinalScale}) rotate(${logoRotate}deg)`,
                        filter:
                            'drop-shadow(0 0 30px rgba(255,255,255,0.8)) drop-shadow(0 20px 40px rgba(0,0,0,0.4))',
                        marginBottom: '40px',
                    }}
                >
                    📚
                </div>

                {/* Title with shine effect */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <h1
                        style={{
                            fontSize: 100,
                            fontWeight: 900,
                            color: 'white',
                            margin: 0,
                            opacity: titleOpacity,
                            transform: `translateY(${titleY}px)`,
                            textShadow:
                                '0 4px 20px rgba(0,0,0,0.3), 0 0 60px rgba(255,255,255,0.3)',
                            letterSpacing: '-3px',
                            position: 'relative',
                        }}
                    >
                        Reading Club
                    </h1>

                    {/* Shine overlay */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: shineX,
                            width: '200px',
                            height: '100%',
                            background:
                                'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                            filter: 'blur(20px)',
                            pointerEvents: 'none',
                        }}
                    />
                </div>

                {/* Subtitle with scale animation */}
                <p
                    style={{
                        fontSize: 38,
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.95)',
                        margin: '30px 0 0 0',
                        opacity: subtitleOpacity,
                        transform: `scale(${subtitleScale})`,
                        textAlign: 'center',
                        letterSpacing: '2px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    }}
                >
                    Share Reviews • Discover Books • Connect with Readers
                </p>

                {/* Decorative line */}
                <div
                    style={{
                        width: interpolate(frame, [120, 150], [0, 400], {
                            extrapolateRight: 'clamp',
                        }),
                        height: '4px',
                        background: 'linear-gradient(90deg, transparent, white, transparent)',
                        marginTop: '40px',
                        borderRadius: '2px',
                        opacity: subtitleOpacity,
                    }}
                />
            </div>
        </AbsoluteFill>
    );
};
