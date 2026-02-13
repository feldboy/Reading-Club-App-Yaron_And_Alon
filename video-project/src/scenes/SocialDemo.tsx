import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const SocialDemo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const cardOpacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Like button animation
    const likeScale = interpolate(frame, [40, 45, 50], [1, 1.3, 1], {
        extrapolateRight: 'clamp',
    });

    const likeFilled = frame > 45;

    // Comment animation
    const comment1Opacity = interpolate(frame, [60, 75], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const comment2Opacity = interpolate(frame, [80, 95], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Like count animation
    const likeCount = frame > 45 ? '124' : '123';

    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    top: '-150px',
                    left: '-100px',
                    filter: 'blur(100px)',
                }}
            />

            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    gap: '60px',
                    alignItems: 'center',
                    maxWidth: '1400px',
                }}
            >
                {/* Text Content */}
                <div style={{ flex: 1, color: 'white' }}>
                    <h2
                        style={{
                            fontSize: 56,
                            fontWeight: 800,
                            margin: '0 0 20px 0',
                            textShadow: '0 2px 20px rgba(0,0,0,0.2)',
                        }}
                    >
                        Engage with Community
                    </h2>
                    <p
                        style={{
                            fontSize: 24,
                            color: 'rgba(255, 255, 255, 0.95)',
                            margin: '0 0 30px 0',
                            lineHeight: 1.6,
                        }}
                    >
                        Like reviews you love and join conversations with meaningful comments. Build
                        connections with fellow book enthusiasts.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: 28 }}>❤️</div>
                            <span style={{ fontSize: 18, fontWeight: 500 }}>Like reviews</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: 28 }}>💬</div>
                            <span style={{ fontSize: 18, fontWeight: 500 }}>Comment & discuss</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: 28 }}>🔔</div>
                            <span style={{ fontSize: 18, fontWeight: 500 }}>Get notifications</span>
                        </div>
                    </div>
                </div>

                {/* Review Card Mockup */}
                <div style={{ flex: 1, opacity: cardOpacity }}>
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            padding: '30px',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                    >
                        {/* User Header */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '20px',
                            }}
                        >
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 24,
                                    color: 'white',
                                    fontWeight: 700,
                                }}
                            >
                                S
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 700,
                                        color: '#1f2937',
                                    }}
                                >
                                    Sarah Johnson
                                </div>
                                <div style={{ fontSize: 14, color: '#6b7280' }}>2 days ago</div>
                            </div>
                        </div>

                        {/* Book Info */}
                        <div style={{ marginBottom: '16px' }}>
                            <h4
                                style={{
                                    fontSize: 24,
                                    fontWeight: 700,
                                    color: '#1f2937',
                                    margin: '0 0 8px 0',
                                }}
                            >
                                The Midnight Library
                            </h4>
                            <div style={{ fontSize: 20, marginBottom: '8px' }}>⭐⭐⭐⭐⭐</div>
                        </div>

                        {/* Review Text */}
                        <p
                            style={{
                                fontSize: 16,
                                color: '#374151',
                                lineHeight: 1.6,
                                margin: '0 0 20px 0',
                            }}
                        >
                            A beautiful exploration of life's infinite possibilities. This book made me
                            reflect on my choices and appreciate the present moment. Highly recommended!
                        </p>

                        {/* Interaction Bar */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '24px',
                                paddingTop: '20px',
                                borderTop: '1px solid #e5e7eb',
                            }}
                        >
                            {/* Like Button */}
                            <button
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: 16,
                                    color: likeFilled ? '#f5576c' : '#6b7280',
                                    fontWeight: 600,
                                    transform: `scale(${likeScale})`,
                                    transition: 'all 0.2s',
                                }}
                            >
                                <span style={{ fontSize: 24 }}>{likeFilled ? '❤️' : '🤍'}</span>
                                <span>{likeCount}</span>
                            </button>

                            {/* Comment Button */}
                            <button
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: 16,
                                    color: '#6b7280',
                                    fontWeight: 600,
                                }}
                            >
                                <span style={{ fontSize: 24 }}>💬</span>
                                <span>12</span>
                            </button>
                        </div>

                        {/* Comments Section */}
                        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                            {/* Comment 1 */}
                            <div
                                style={{
                                    opacity: comment1Opacity,
                                    marginBottom: '16px',
                                }}
                            >
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 16,
                                            color: 'white',
                                            fontWeight: 700,
                                            flexShrink: 0,
                                        }}
                                    >
                                        M
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 700,
                                                color: '#1f2937',
                                                marginBottom: '4px',
                                            }}
                                        >
                                            Mike Chen
                                        </div>
                                        <p
                                            style={{
                                                fontSize: 14,
                                                color: '#4b5563',
                                                margin: 0,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            I agree! This book is a masterpiece. 📚
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Comment 2 */}
                            <div style={{ opacity: comment2Opacity }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 16,
                                            color: 'white',
                                            fontWeight: 700,
                                            flexShrink: 0,
                                        }}
                                    >
                                        E
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 700,
                                                color: '#1f2937',
                                                marginBottom: '4px',
                                            }}
                                        >
                                            Emma Davis
                                        </div>
                                        <p
                                            style={{
                                                fontSize: 14,
                                                color: '#4b5563',
                                                margin: 0,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            Added to my reading list! Thanks for the recommendation ⭐
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
