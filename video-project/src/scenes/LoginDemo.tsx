import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const LoginDemo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Phone mockup slide in
    const phoneY = spring({
        frame,
        fps,
        config: {
            damping: 100,
        },
        from: 1000,
        to: 0,
    });

    // Content fade in
    const contentOpacity = interpolate(frame, [20, 40], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Typing animation
    const typingProgress = interpolate(frame, [40, 100], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Button click animation
    const buttonScale = interpolate(frame, [100, 110, 120], [1, 0.95, 1], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontFamily: 'Inter, system-ui, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* Background blur circles */}
            <div
                style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    top: '-150px',
                    right: '-100px',
                    filter: 'blur(100px)',
                }}
            />

            <div
                style={{
                    display: 'flex',
                    gap: '80px',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Text Content */}
                <div style={{ maxWidth: '500px', opacity: contentOpacity }}>
                    <h2
                        style={{
                            fontSize: 56,
                            fontWeight: 800,
                            color: 'white',
                            margin: '0 0 20px 0',
                            textShadow: '0 2px 20px rgba(0,0,0,0.2)',
                        }}
                    >
                        Seamless Authentication
                    </h2>
                    <p
                        style={{
                            fontSize: 24,
                            color: 'rgba(255, 255, 255, 0.9)',
                            margin: 0,
                            lineHeight: 1.6,
                        }}
                    >
                        Register and login with Google OAuth or traditional email/password.
                        Secure, fast, and user-friendly.
                    </p>
                    <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ fontSize: 28 }}>✅</div>
                            <span style={{ color: 'white', fontSize: 18 }}>Google OAuth</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ fontSize: 28 }}>✅</div>
                            <span style={{ color: 'white', fontSize: 18 }}>Email/Password</span>
                        </div>
                    </div>
                </div>

                {/* Phone Mockup */}
                <div
                    style={{
                        transform: `translateY(${phoneY}px)`,
                        position: 'relative',
                    }}
                >
                    {/* Phone Frame */}
                    <div
                        style={{
                            width: '380px',
                            height: '760px',
                            background: 'linear-gradient(145deg, #1f2937, #111827)',
                            borderRadius: '50px',
                            padding: '20px',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                            border: '8px solid #374151',
                        }}
                    >
                        {/* Status bar */}
                        <div
                            style={{
                                height: '30px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0 20px',
                                color: 'white',
                                fontSize: 14,
                            }}
                        >
                            <span>9:41</span>
                            <span>⚡📶</span>
                        </div>

                        {/* App Content */}
                        <div
                            style={{
                                background: 'white',
                                height: 'calc(100% - 50px)',
                                borderRadius: '30px',
                                padding: '40px 30px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {/* Logo */}
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <div style={{ fontSize: 64, marginBottom: '10px' }}>📚</div>
                                <h1
                                    style={{
                                        fontSize: 32,
                                        fontWeight: 800,
                                        color: '#667eea',
                                        margin: 0,
                                    }}
                                >
                                    Reading Club
                                </h1>
                            </div>

                            {/* Login Form */}
                            <div style={{ flex: 1 }}>
                                {/* Email Input */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label
                                        style={{
                                            fontSize: 14,
                                            color: '#6b7280',
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: 500,
                                        }}
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={
                                            typingProgress > 0
                                                ? 'user@example.com'.slice(
                                                      0,
                                                      Math.floor(typingProgress * 17)
                                                  )
                                                : ''
                                        }
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            borderRadius: '12px',
                                            border: '2px solid #e5e7eb',
                                            fontSize: 16,
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                {/* Password Input */}
                                <div style={{ marginBottom: '30px' }}>
                                    <label
                                        style={{
                                            fontSize: 14,
                                            color: '#6b7280',
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: 500,
                                        }}
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        readOnly
                                        value="••••••••"
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            borderRadius: '12px',
                                            border: '2px solid #e5e7eb',
                                            fontSize: 16,
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                {/* Login Button */}
                                <button
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: 18,
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transform: `scale(${buttonScale})`,
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                    }}
                                >
                                    Sign In
                                </button>

                                {/* Divider */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        margin: '25px 0',
                                    }}
                                >
                                    <div
                                        style={{
                                            flex: 1,
                                            height: '1px',
                                            background: '#e5e7eb',
                                        }}
                                    />
                                    <span style={{ color: '#9ca3af', fontSize: 14 }}>OR</span>
                                    <div
                                        style={{
                                            flex: 1,
                                            height: '1px',
                                            background: '#e5e7eb',
                                        }}
                                    />
                                </div>

                                {/* Google Sign In */}
                                <button
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: 'white',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '12px',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        color: '#374151',
                                    }}
                                >
                                    <span style={{ fontSize: 20 }}>🔐</span>
                                    Continue with Google
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
