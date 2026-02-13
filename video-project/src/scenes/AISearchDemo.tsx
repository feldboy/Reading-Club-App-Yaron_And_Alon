import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const AISearchDemo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const searchBarOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Typing animation
    const searchQuery = "books about personal growth and habits";
    const typingProgress = interpolate(frame, [20, 70], [0, 1], {
        extrapolateRight: 'clamp',
    });
    const displayedQuery = searchQuery.slice(0, Math.floor(typingProgress * searchQuery.length));

    // AI thinking animation
    const aiThinking = frame > 70 && frame < 90;

    // Results appearing
    const result1Opacity = interpolate(frame, [90, 105], [0, 1], {
        extrapolateRight: 'clamp',
    });
    const result2Opacity = interpolate(frame, [100, 115], [0, 1], {
        extrapolateRight: 'clamp',
    });
    const result3Opacity = interpolate(frame, [110, 125], [0, 1], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 50%, #16a085 100%)',
                fontFamily: 'Inter, system-ui, sans-serif',
                display: 'flex',
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
                    background: 'rgba(255, 255, 255, 0.1)',
                    top: '-200px',
                    right: '-150px',
                    filter: 'blur(100px)',
                }}
            />

            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    maxWidth: '1200px',
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2
                        style={{
                            fontSize: 56,
                            fontWeight: 800,
                            color: 'white',
                            margin: '0 0 16px 0',
                            textShadow: '0 2px 20px rgba(0,0,0,0.2)',
                        }}
                    >
                        AI-Powered Book Discovery
                    </h2>
                    <p
                        style={{
                            fontSize: 24,
                            color: 'rgba(255, 255, 255, 0.95)',
                            margin: 0,
                        }}
                    >
                        Find your next great read with intelligent recommendations
                    </p>
                </div>

                {/* Search Bar */}
                <div
                    style={{
                        opacity: searchBarOpacity,
                        marginBottom: '40px',
                    }}
                >
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '20px',
                            padding: '8px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        <div style={{ fontSize: 28, paddingLeft: '12px' }}>🤖</div>
                        <input
                            type="text"
                            readOnly
                            value={displayedQuery}
                            placeholder="Ask AI to find books..."
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                fontSize: 20,
                                padding: '16px 0',
                                background: 'transparent',
                                color: '#1f2937',
                            }}
                        />
                        <button
                            style={{
                                background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '14px 32px',
                                fontSize: 18,
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)',
                            }}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* AI Thinking Indicator */}
                {aiThinking && (
                    <div
                        style={{
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 18,
                            marginBottom: '30px',
                        }}
                    >
                        <div style={{ marginBottom: '10px', fontSize: 32 }}>🧠</div>
                        <div>AI is analyzing your request...</div>
                    </div>
                )}

                {/* Results Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '24px',
                    }}
                >
                    {/* Result 1 */}
                    <div
                        style={{
                            opacity: result1Opacity,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '20px',
                            padding: '24px',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: '240px',
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                borderRadius: '12px',
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 64,
                            }}
                        >
                            📚
                        </div>
                        <h4
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: '#1f2937',
                                margin: '0 0 8px 0',
                            }}
                        >
                            Atomic Habits
                        </h4>
                        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 12px 0' }}>
                            by James Clear
                        </p>
                        <div style={{ fontSize: 16, marginBottom: '12px' }}>⭐ 4.8 (2.5K reviews)</div>
                        <p
                            style={{
                                fontSize: 14,
                                color: '#4b5563',
                                lineHeight: 1.5,
                                margin: 0,
                            }}
                        >
                            Perfect match! A practical guide to building good habits and breaking bad
                            ones.
                        </p>
                    </div>

                    {/* Result 2 */}
                    <div
                        style={{
                            opacity: result2Opacity,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '20px',
                            padding: '24px',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: '240px',
                                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                                borderRadius: '12px',
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 64,
                            }}
                        >
                            📖
                        </div>
                        <h4
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: '#1f2937',
                                margin: '0 0 8px 0',
                            }}
                        >
                            The Power of Now
                        </h4>
                        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 12px 0' }}>
                            by Eckhart Tolle
                        </p>
                        <div style={{ fontSize: 16, marginBottom: '12px' }}>⭐ 4.6 (1.8K reviews)</div>
                        <p
                            style={{
                                fontSize: 14,
                                color: '#4b5563',
                                lineHeight: 1.5,
                                margin: 0,
                            }}
                        >
                            Highly recommended! Transform your mindset and embrace the present moment.
                        </p>
                    </div>

                    {/* Result 3 */}
                    <div
                        style={{
                            opacity: result3Opacity,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '20px',
                            padding: '24px',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: '240px',
                                background: 'linear-gradient(135deg, #3498db, #2980b9)',
                                borderRadius: '12px',
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 64,
                            }}
                        >
                            📕
                        </div>
                        <h4
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: '#1f2937',
                                margin: '0 0 8px 0',
                            }}
                        >
                            Can't Hurt Me
                        </h4>
                        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 12px 0' }}>
                            by David Goggins
                        </p>
                        <div style={{ fontSize: 16, marginBottom: '12px' }}>⭐ 4.7 (3.2K reviews)</div>
                        <p
                            style={{
                                fontSize: 14,
                                color: '#4b5563',
                                lineHeight: 1.5,
                                margin: 0,
                            }}
                        >
                            Great match! Master your mind and defy the odds with this powerful memoir.
                        </p>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
