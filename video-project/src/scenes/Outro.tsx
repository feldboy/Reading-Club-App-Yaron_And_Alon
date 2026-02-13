import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

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

    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #581c87 100%)',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Inter, system-ui, sans-serif',
            }}
        >
            {/* Background decoration */}
            <div
                style={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    top: '-200px',
                    left: '-100px',
                    filter: 'blur(100px)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    bottom: '-150px',
                    right: '-80px',
                    filter: 'blur(80px)',
                }}
            />

            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '40px',
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
                            fontSize: 80,
                            fontWeight: 900,
                            color: 'white',
                            margin: 0,
                            textShadow: '0 4px 30px rgba(0,0,0,0.3)',
                            letterSpacing: '-1px',
                        }}
                    >
                        Join the Reading Club
                    </h1>
                    <p
                        style={{
                            fontSize: 36,
                            color: 'rgba(255, 255, 255, 0.9)',
                            margin: '20px 0 0 0',
                            fontWeight: 500,
                        }}
                    >
                        Share • Discover • Connect
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
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            padding: '20px 60px',
                            borderRadius: '16px',
                            fontSize: 32,
                            fontWeight: 700,
                            color: 'white',
                            boxShadow: '0 10px 40px rgba(245, 87, 108, 0.4)',
                            cursor: 'pointer',
                        }}
                    >
                        Get Started Today
                    </div>
                </div>

                {/* GitHub link */}
                <div
                    style={{
                        opacity: linkOpacity,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                >
                    <div style={{ fontSize: 32 }}>⭐</div>
                    <p
                        style={{
                            fontSize: 24,
                            color: 'rgba(255, 255, 255, 0.8)',
                            margin: 0,
                            fontFamily: 'monospace',
                        }}
                    >
                        github.com/feldboy/Reading-Club-App
                    </p>
                </div>
            </div>
        </AbsoluteFill>
    );
};
