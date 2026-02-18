import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export const ReviewDemo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const formScale = spring({
        frame,
        fps,
        config: {
            damping: 100,
        },
        from: 0.8,
        to: 1,
    });

    const formOpacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Typing animation for review
    const typingProgress = interpolate(frame, [40, 80], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Image upload animation
    const imageScale = interpolate(frame, [80, 100], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Star rating animation
    const starsOpacity = interpolate(frame, [60, 80], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const reviewText = "This book changed my perspective on life! Highly recommend.";
    const displayedText = reviewText.slice(0, Math.floor(typingProgress * reviewText.length));

    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
                    bottom: '-200px',
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
                        Share Your Thoughts
                    </h2>
                    <p
                        style={{
                            fontSize: 24,
                            color: 'rgba(255, 255, 255, 0.95)',
                            margin: '0 0 30px 0',
                            lineHeight: 1.6,
                        }}
                    >
                        Write detailed reviews with images, rate books, and inspire fellow readers with
                        your insights.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: 28 }}>⭐</div>
                            <span style={{ fontSize: 18, fontWeight: 500 }}>Rate with stars</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: 28 }}>📷</div>
                            <span style={{ fontSize: 18, fontWeight: 500 }}>Upload images</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: 28 }}>✍️</div>
                            <span style={{ fontSize: 18, fontWeight: 500 }}>Rich text editor</span>
                        </div>
                    </div>
                </div>

                {/* Review Form Mockup */}
                <div
                    style={{
                        flex: 1,
                        opacity: formOpacity,
                        transform: `scale(${formScale})`,
                    }}
                >
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            padding: '40px',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                    >
                        {/* Form Header */}
                        <h3
                            style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: '#1f2937',
                                margin: '0 0 24px 0',
                            }}
                        >
                            Create Review
                        </h3>

                        {/* Book Title Input */}
                        <div style={{ marginBottom: '20px' }}>
                            <label
                                style={{
                                    fontSize: 14,
                                    color: '#6b7280',
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 600,
                                }}
                            >
                                Book Title
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="Atomic Habits"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #e5e7eb',
                                    fontSize: 16,
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    background: 'white',
                                }}
                            />
                        </div>

                        {/* Rating */}
                        <div style={{ marginBottom: '20px', opacity: starsOpacity }}>
                            <label
                                style={{
                                    fontSize: 14,
                                    color: '#6b7280',
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 600,
                                }}
                            >
                                Rating
                            </label>
                            <div style={{ fontSize: 32, letterSpacing: '4px' }}>⭐⭐⭐⭐⭐</div>
                        </div>

                        {/* Review Text */}
                        <div style={{ marginBottom: '20px' }}>
                            <label
                                style={{
                                    fontSize: 14,
                                    color: '#6b7280',
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 600,
                                }}
                            >
                                Your Review
                            </label>
                            <textarea
                                readOnly
                                value={displayedText}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #e5e7eb',
                                    fontSize: 15,
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    resize: 'none',
                                    height: '100px',
                                    fontFamily: 'inherit',
                                    lineHeight: 1.5,
                                    background: 'white',
                                }}
                            />
                        </div>

                        {/* Image Upload */}
                        <div style={{ marginBottom: '24px' }}>
                            <label
                                style={{
                                    fontSize: 14,
                                    color: '#6b7280',
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 600,
                                }}
                            >
                                Cover Image
                            </label>
                            <div
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    borderRadius: '12px',
                                    border: '2px dashed #d1d5db',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#f9fafb',
                                    transform: `scale(${imageScale})`,
                                }}
                            >
                                {imageScale > 0.5 ? (
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            padding: '20px',
                                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: 14,
                                            fontWeight: 600,
                                        }}
                                    >
                                        📷 book-cover.jpg
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                                        <div style={{ fontSize: 32 }}>📷</div>
                                        <div style={{ fontSize: 14 }}>Click to upload</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: 18,
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)',
                            }}
                        >
                            Publish Review
                        </button>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
