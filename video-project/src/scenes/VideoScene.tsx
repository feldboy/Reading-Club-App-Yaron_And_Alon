import { AbsoluteFill, OffthreadVideo, useCurrentFrame, interpolate, staticFile } from 'remotion';

interface VideoSceneProps {
    videoSrc: string;
    title?: string;
    subtitle?: string;
    showTitle?: boolean;
    titlePosition?: 'top' | 'bottom' | 'center';
    titleDuration?: number; // frames to show title
}

export const VideoScene: React.FC<VideoSceneProps> = ({
    videoSrc,
    title,
    subtitle,
    showTitle = true,
    titlePosition = 'bottom',
    titleDuration = 90, // 3 seconds at 30fps
}) => {
    const frame = useCurrentFrame();

    // Title animation
    const titleOpacity = interpolate(
        frame,
        [0, 20, titleDuration - 20, titleDuration],
        [0, 1, 1, 0],
        { extrapolateRight: 'clamp' }
    );

    const titleY = interpolate(
        frame,
        [0, 20],
        [30, 0],
        { extrapolateRight: 'clamp' }
    );

    const getTitleStyle = (): React.CSSProperties => {
        const base: React.CSSProperties = {
            position: 'absolute',
            left: 0,
            right: 0,
            padding: '40px 60px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            zIndex: 10,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
        };

        switch (titlePosition) {
            case 'top':
                return { ...base, top: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)' };
            case 'center':
                return {
                    ...base,
                    top: '50%',
                    transform: `translateY(calc(-50% + ${titleY}px))`,
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: '20px',
                    left: '10%',
                    right: '10%',
                    padding: '40px',
                    textAlign: 'center',
                };
            default:
                return { ...base, bottom: 0 };
        }
    };

    return (
        <AbsoluteFill style={{ background: '#000' }}>
            {/* Video Layer */}
            <OffthreadVideo
                src={staticFile(videoSrc)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                }}
            />

            {/* Title Overlay */}
            {showTitle && title && (
                <div style={getTitleStyle()}>
                    <h2
                        style={{
                            fontSize: 48,
                            fontWeight: 800,
                            color: 'white',
                            margin: 0,
                            fontFamily: 'Inter, system-ui, sans-serif',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        }}
                    >
                        {title}
                    </h2>
                    {subtitle && (
                        <p
                            style={{
                                fontSize: 24,
                                color: 'rgba(255,255,255,0.9)',
                                margin: '10px 0 0 0',
                                fontFamily: 'Inter, system-ui, sans-serif',
                            }}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            )}
        </AbsoluteFill>
    );
};
