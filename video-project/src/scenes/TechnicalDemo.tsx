import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const TechnicalDemo: React.FC = () => {
    const frame = useCurrentFrame();

    const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const swaggerOpacity = interpolate(frame, [20, 40], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const testsOpacity = interpolate(frame, [50, 70], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const pm2Opacity = interpolate(frame, [80, 100], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Test progress animation
    const testProgress = interpolate(frame, [60, 90], [0, 100], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #581c87 100%)',
                fontFamily: 'Inter, system-ui, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px',
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
                    right: '-100px',
                    filter: 'blur(100px)',
                }}
            />

            {/* Header */}
            <div
                style={{
                    textAlign: 'center',
                    marginBottom: '50px',
                    opacity: titleOpacity,
                }}
            >
                <h2
                    style={{
                        fontSize: 56,
                        fontWeight: 800,
                        color: 'white',
                        margin: '0 0 16px 0',
                        textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                    }}
                >
                    Production-Ready Architecture
                </h2>
                <p
                    style={{
                        fontSize: 24,
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                    }}
                >
                    Built with industry best practices and modern tooling
                </p>
            </div>

            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    maxWidth: '1200px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '30px',
                }}
            >
                {/* Swagger Documentation */}
                <div
                    style={{
                        opacity: swaggerOpacity,
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '30px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 48,
                            marginBottom: '20px',
                            textAlign: 'center',
                        }}
                    >
                        📚
                    </div>
                    <h3
                        style={{
                            fontSize: 28,
                            fontWeight: 700,
                            color: 'white',
                            margin: '0 0 16px 0',
                            textAlign: 'center',
                        }}
                    >
                        API Documentation
                    </h3>
                    <p
                        style={{
                            fontSize: 16,
                            color: 'rgba(255, 255, 255, 0.85)',
                            margin: '0 0 20px 0',
                            textAlign: 'center',
                            lineHeight: 1.5,
                        }}
                    >
                        Complete Swagger/OpenAPI docs for all endpoints
                    </p>
                    <div
                        style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '12px',
                            padding: '16px',
                            fontFamily: 'monospace',
                            fontSize: 14,
                            color: '#4ade80',
                        }}
                    >
                        <div style={{ marginBottom: '8px' }}>✓ 25+ API Endpoints</div>
                        <div style={{ marginBottom: '8px' }}>✓ Full Request/Response Schemas</div>
                        <div style={{ marginBottom: '8px' }}>✓ Interactive Testing</div>
                        <div>✓ Authentication Flows</div>
                    </div>
                </div>

                {/* Jest Tests */}
                <div
                    style={{
                        opacity: testsOpacity,
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '30px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 48,
                            marginBottom: '20px',
                            textAlign: 'center',
                        }}
                    >
                        ✅
                    </div>
                    <h3
                        style={{
                            fontSize: 28,
                            fontWeight: 700,
                            color: 'white',
                            margin: '0 0 16px 0',
                            textAlign: 'center',
                        }}
                    >
                        Comprehensive Tests
                    </h3>
                    <p
                        style={{
                            fontSize: 16,
                            color: 'rgba(255, 255, 255, 0.85)',
                            margin: '0 0 20px 0',
                            textAlign: 'center',
                            lineHeight: 1.5,
                        }}
                    >
                        Full test coverage with Jest
                    </p>
                    <div
                        style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '12px',
                            padding: '16px',
                            fontFamily: 'monospace',
                            fontSize: 13,
                        }}
                    >
                        <div style={{ color: '#4ade80', marginBottom: '12px' }}>
                            PASS backend/tests/
                        </div>
                        <div style={{ color: '#a3e635', marginBottom: '4px' }}>✓ Auth tests (8)</div>
                        <div style={{ color: '#a3e635', marginBottom: '4px' }}>
                            ✓ Review tests (12)
                        </div>
                        <div style={{ color: '#a3e635', marginBottom: '4px' }}>
                            ✓ User tests (6)
                        </div>
                        <div style={{ color: '#a3e635', marginBottom: '12px' }}>
                            ✓ Integration (10)
                        </div>
                        <div
                            style={{
                                marginTop: '12px',
                                paddingTop: '12px',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            <div style={{ color: 'white', marginBottom: '8px' }}>
                                Tests: {Math.floor((testProgress / 100) * 36)}/36 passed
                            </div>
                            <div
                                style={{
                                    width: '100%',
                                    height: '8px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        width: `${testProgress}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                                        transition: 'width 0.3s',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* PM2 Production */}
                <div
                    style={{
                        opacity: pm2Opacity,
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '30px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 48,
                            marginBottom: '20px',
                            textAlign: 'center',
                        }}
                    >
                        🚀
                    </div>
                    <h3
                        style={{
                            fontSize: 28,
                            fontWeight: 700,
                            color: 'white',
                            margin: '0 0 16px 0',
                            textAlign: 'center',
                        }}
                    >
                        Production Mode
                    </h3>
                    <p
                        style={{
                            fontSize: 16,
                            color: 'rgba(255, 255, 255, 0.85)',
                            margin: '0 0 20px 0',
                            textAlign: 'center',
                            lineHeight: 1.5,
                        }}
                    >
                        PM2 process management
                    </p>
                    <div
                        style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '12px',
                            padding: '16px',
                            fontFamily: 'monospace',
                            fontSize: 13,
                        }}
                    >
                        <div style={{ color: '#60a5fa', marginBottom: '12px' }}>$ pm2 status</div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '8px',
                                marginBottom: '12px',
                            }}
                        >
                            <div style={{ color: '#9ca3af' }}>App:</div>
                            <div style={{ color: 'white' }}>reading-club</div>
                            <div style={{ color: '#9ca3af' }}>Status:</div>
                            <div style={{ color: '#4ade80' }}>● online</div>
                            <div style={{ color: '#9ca3af' }}>CPU:</div>
                            <div style={{ color: 'white' }}>2.1%</div>
                            <div style={{ color: '#9ca3af' }}>Memory:</div>
                            <div style={{ color: 'white' }}>145 MB</div>
                        </div>
                        <div
                            style={{
                                marginTop: '12px',
                                paddingTop: '12px',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                color: '#4ade80',
                            }}
                        >
                            ✓ Auto-restart enabled
                            <br />✓ Load balancing
                            <br />✓ Zero-downtime deploys
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div
                style={{
                    marginTop: '50px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 18,
                    opacity: pm2Opacity,
                }}
            >
                <div style={{ marginBottom: '10px' }}>
                    <strong>Tech Stack:</strong> React • Node.js • Express • MongoDB • TypeScript
                </div>
                <div>
                    <strong>Features:</strong> OAuth • JWT • REST API • Real-time Updates
                </div>
            </div>
        </AbsoluteFill>
    );
};
