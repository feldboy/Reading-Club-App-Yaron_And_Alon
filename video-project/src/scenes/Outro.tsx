import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

/**
 * Design System (ui-ux-pro-max)
 * Primary: #18181B, CTA: #EC4899
 * Fonts: Cormorant Garamond (headings), Libre Baskerville (body)
 */

export const Outro: React.FC = () => {
    const frame = useCurrentFrame();

    const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const titleScale = interpolate(frame, [0, 30], [0.9, 1], {
        extrapolateRight: 'clamp',
    });

    const ctaOpacity = interpolate(frame, [20, 40], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const ctaY = interpolate(frame, [20, 50], [30, 0], {
        extrapolateRight: 'clamp',
    });

    const linkOpacity = interpolate(frame, [40, 60], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const accentWidth = interpolate(frame, [50, 80], [0, 200], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: '#18181B',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}
        >
            {/* Gradient accents */}
            <div
                style={{
                    position: 'absolute',
                    width: '700px',
                    height: '700px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
                    top: '-200px',
                    left: '-100px',
                    filter: 'blur(60px)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
                    bottom: '-150px',
                    right: '-80px',
                    filter: 'blur(50px)',
                }}
            />

            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '30px',
                }}
            >
                {/* Main message */}
                <div
                    style={{
                        opacity: titleOpacity,
                        transform: `scale(${titleScale})`,
                        textAlign: 'center',
                    }}
                >
                    <h1
                        style={{
                            fontSize: 90,
                            fontWeight: 600,
                            color: '#FAFAFA',
                            margin: 0,
                            textShadow: '0 4px 30px rgba(0,0,0,0.3)',
                            letterSpacing: '-1px',
                        }}
                    >
                        Thank You
                    </h1>

                    {/* Accent line */}
                    <div
                        style={{
                            width: accentWidth,
                            height: 4,
                            background: '#EC4899',
                            margin: '25px auto',
                            borderRadius: 2,
                        }}
                    />

                    <p
                        style={{
                            fontSize: 32,
                            color: 'rgba(250,250,250,0.85)',
                            margin: 0,
                            fontWeight: 400,
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                        }}
                    >
                        Full-Stack • AI-Powered • Production-Ready
                    </p>
                </div>

                {/* CTA Button */}
                <div
                    style={{
                        opacity: ctaOpacity,
                        transform: `translateY(${ctaY}px)`,
                    }}
                >
                    <div
                        style={{
                            background: '#EC4899',
                            padding: '18px 50px',
                            borderRadius: '12px',
                            fontSize: 28,
                            fontWeight: 600,
                            color: 'white',
                            boxShadow: '0 10px 40px rgba(236,72,153,0.4)',
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                        }}
                    >
                        Join Reading Club
                    </div>
                </div>

                {/* GitHub link */}
                <div
                    style={{
                        opacity: linkOpacity,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginTop: 20,
                    }}
                >
                    <p
                        style={{
                            fontSize: 22,
                            color: 'rgba(250,250,250,0.7)',
                            margin: 0,
                            fontFamily: 'monospace',
                            background: 'rgba(250,250,250,0.1)',
                            padding: '12px 24px',
                            borderRadius: 8,
                            border: '1px solid rgba(236,72,153,0.3)',
                        }}
                    >
                        github.com/feldboy/Reading-Club-App
                    </p>
                </div>

                {/* Team */}
                <div
                    style={{
                        opacity: linkOpacity,
                        marginTop: 30,
                        textAlign: 'center',
                    }}
                >
                    <p
                        style={{
                            fontSize: 20,
                            color: 'rgba(250,250,250,0.6)',
                            margin: 0,
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                        }}
                    >
                        Created by Yaron & Alon • 2026
                    </p>
                </div>
            </div>
        </AbsoluteFill>
    );
};
