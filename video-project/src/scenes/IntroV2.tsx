import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

/**
 * Design System (ui-ux-pro-max)
 * Primary: #18181B, CTA: #EC4899
 * Fonts: Cormorant Garamond (headings), Libre Baskerville (body)
 */

export const IntroV2: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    // Animated particles
    const particles = Array.from({ length: 40 }, (_, i) => ({
        x: (Math.sin(i * 0.5) * width) / 2 + width / 2,
        y: (Math.cos(i * 0.7) * height) / 2 + height / 2,
        delay: i * 2,
    }));

    // Logo reveal animation
    const logoScale = interpolate(frame, [0, 40], [0, 1.2], {
        extrapolateRight: 'clamp',
    });

    const logoFinalScale = interpolate(frame, [40, 60], [1.2, 1], {
        extrapolateRight: 'clamp',
    });

    // Title animation
    const titleY = interpolate(frame, [60, 90], [80, 0], {
        extrapolateRight: 'clamp',
    });

    const titleOpacity = interpolate(frame, [60, 80], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Subtitle animation
    const subtitleOpacity = interpolate(frame, [90, 110], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Accent line
    const lineWidth = interpolate(frame, [120, 150], [0, 300], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: '#18181B',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}
        >
            {/* Gradient overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at 50% 30%, rgba(236,72,153,0.15) 0%, transparent 60%)',
                }}
            />

            {/* Animated particles */}
            {particles.map((particle, i) => {
                const particleFrame = Math.max(0, frame - particle.delay);
                const particleY = interpolate(
                    particleFrame,
                    [0, 180],
                    [particle.y, particle.y - height - 200],
                    { extrapolateRight: 'clamp' }
                );
                const particleOpacity = interpolate(particleFrame, [0, 20, 160, 180], [0, 0.6, 0.6, 0], {
                    extrapolateRight: 'clamp',
                });

                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: particle.x,
                            top: particleY,
                            width: 3,
                            height: 16,
                            background: '#EC4899',
                            borderRadius: '2px',
                            opacity: particleOpacity,
                            filter: 'blur(1px)',
                        }}
                    />
                );
            })}

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
                {/* Logo */}
                <div
                    style={{
                        fontSize: 120,
                        transform: `scale(${logoScale * logoFinalScale})`,
                        filter: 'drop-shadow(0 0 40px rgba(236,72,153,0.5))',
                        marginBottom: '30px',
                    }}
                >
                    📚
                </div>

                {/* Title */}
                <h1
                    style={{
                        fontSize: 110,
                        fontWeight: 600,
                        color: '#FAFAFA',
                        margin: 0,
                        opacity: titleOpacity,
                        transform: `translateY(${titleY}px)`,
                        textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                        letterSpacing: '-2px',
                    }}
                >
                    Reading Club
                </h1>

                {/* Accent line */}
                <div
                    style={{
                        width: lineWidth,
                        height: 4,
                        background: '#EC4899',
                        marginTop: 30,
                        borderRadius: 2,
                        opacity: subtitleOpacity,
                    }}
                />

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: 32,
                        fontWeight: 400,
                        color: 'rgba(250,250,250,0.85)',
                        margin: '30px 0 0 0',
                        opacity: subtitleOpacity,
                        textAlign: 'center',
                        letterSpacing: '3px',
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                    }}
                >
                    Share Reviews • Discover Books • Connect with Readers
                </p>

                {/* Tech stack badges */}
                <div
                    style={{
                        display: 'flex',
                        gap: 20,
                        marginTop: 50,
                        opacity: interpolate(frame, [130, 150], [0, 1], { extrapolateRight: 'clamp' }),
                    }}
                >
                    {['React', 'TypeScript', 'Node.js', 'MongoDB', 'AI'].map((tech) => (
                        <div
                            key={tech}
                            style={{
                                padding: '10px 24px',
                                background: 'rgba(250,250,250,0.1)',
                                borderRadius: 8,
                                border: '1px solid rgba(236,72,153,0.3)',
                                color: '#FAFAFA',
                                fontSize: 18,
                                fontFamily: "'Libre Baskerville', Georgia, serif",
                            }}
                        >
                            {tech}
                        </div>
                    ))}
                </div>
            </div>
        </AbsoluteFill>
    );
};
