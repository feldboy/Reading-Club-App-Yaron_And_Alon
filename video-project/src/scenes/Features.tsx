import { AbsoluteFill, useCurrentFrame, interpolate, Series } from 'remotion';

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    index: number;
    totalFrames: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index, totalFrames }) => {
    const frame = useCurrentFrame();

    // Stagger the entrance animation
    const delay = index * 8;
    const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const scale = interpolate(frame, [delay, delay + 25], [0.8, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const y = interpolate(frame, [delay, delay + 25], [40, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return (
        <div
            style={{
                opacity,
                transform: `scale(${scale}) translateY(${y}px)`,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                minWidth: '280px',
                transition: 'all 0.3s ease',
            }}
        >
            <div style={{ fontSize: 64 }}>{icon}</div>
            <h3
                style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: 'white',
                    margin: 0,
                    textAlign: 'center',
                }}
            >
                {title}
            </h3>
            <p
                style={{
                    fontSize: 18,
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: 0,
                    textAlign: 'center',
                    lineHeight: 1.5,
                }}
            >
                {description}
            </p>
        </div>
    );
};

const FeatureScene: React.FC<{
    features: Array<{ icon: string; title: string; description: string }>;
    title: string;
    gradient: string;
}> = ({ features, title, gradient }) => {
    const frame = useCurrentFrame();

    const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
        extrapolateRight: 'clamp',
    });

    const titleY = interpolate(frame, [0, 20], [30, 0], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: gradient,
                fontFamily: 'Inter, system-ui, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 60px',
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
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    bottom: '-100px',
                    left: '-80px',
                    filter: 'blur(80px)',
                }}
            />

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px' }}>
                {/* Section title */}
                <h2
                    style={{
                        fontSize: 56,
                        fontWeight: 800,
                        color: 'white',
                        margin: '0 0 60px 0',
                        textAlign: 'center',
                        opacity: titleOpacity,
                        transform: `translateY(${titleY}px)`,
                        textShadow: '0 2px 20px rgba(0,0,0,0.2)',
                    }}
                >
                    {title}
                </h2>

                {/* Feature cards grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: features.length <= 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                        gap: '32px',
                        justifyItems: 'center',
                    }}
                >
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            index={index}
                            totalFrames={90}
                        />
                    ))}
                </div>
            </div>
        </AbsoluteFill>
    );
};

export const Features: React.FC = () => {
    return (
        <Series>
            {/* Core Features - 8 seconds */}
            <Series.Sequence durationInFrames={240}>
                <FeatureScene
                    title="Core Features"
                    gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    features={[
                        {
                            icon: '✍️',
                            title: 'Write Reviews',
                            description: 'Share your thoughts on books with rich text and images',
                        },
                        {
                            icon: '💬',
                            title: 'Social Engagement',
                            description: 'Like and comment on reviews from fellow readers',
                        },
                        {
                            icon: '📖',
                            title: 'Personal Wishlist',
                            description: 'Save books you want to read for later',
                        },
                    ]}
                />
            </Series.Sequence>

            {/* AI & Discovery - 6 seconds */}
            <Series.Sequence durationInFrames={180}>
                <FeatureScene
                    title="Smart Discovery"
                    gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    features={[
                        {
                            icon: '🤖',
                            title: 'AI-Powered Search',
                            description: 'Find books with intelligent recommendations',
                        },
                        {
                            icon: '🎯',
                            title: 'Personalized Feed',
                            description: 'Discover content tailored to your interests',
                        },
                    ]}
                />
            </Series.Sequence>
        </Series>
    );
};
