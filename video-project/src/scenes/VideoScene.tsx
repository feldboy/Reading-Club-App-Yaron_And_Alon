import { AbsoluteFill, OffthreadVideo, useCurrentFrame, interpolate, staticFile } from 'remotion';

/**
 * Design System Colors (from ui-ux-pro-max skill)
 * Primary: #18181B
 * Secondary: #3F3F46
 * CTA/Accent: #EC4899
 * Background: #FAFAFA
 * Text: #09090B
 *
 * Typography:
 * Heading: Cormorant Garamond
 * Body: Libre Baskerville
 */

interface VideoSceneProps {
    videoSrc: string;
    title?: string;
    subtitle?: string;
    showTitle?: boolean;
    titlePosition?: 'top' | 'bottom' | 'center';
    titleDuration?: number;
}

export const VideoScene: React.FC<VideoSceneProps> = ({
    videoSrc,
    title,
    subtitle,
    showTitle = true,
    titlePosition = 'bottom',
    titleDuration = 90,
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

    // Accent bar animation
    const accentWidth = interpolate(
        frame,
        [0, 30],
        [0, 60],
        { extrapolateRight: 'clamp' }
    );

    const getTitleStyle = (): React.CSSProperties => {
        const base: React.CSSProperties = {
            position: 'absolute',
            left: 0,
            right: 0,
            padding: '40px 60px',
            background: 'linear-gradient(to top, rgba(24,24,27,0.95) 0%, rgba(24,24,27,0.7) 50%, transparent 100%)',
            zIndex: 10,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
        };

        switch (titlePosition) {
            case 'top':
                return {
                    ...base,
                    top: 0,
                    background: 'linear-gradient(to bottom, rgba(24,24,27,0.95) 0%, rgba(24,24,27,0.7) 50%, transparent 100%)',
                };
            case 'center':
                return {
                    ...base,
                    top: '50%',
                    transform: `translateY(calc(-50% + ${titleY}px))`,
                    background: 'rgba(24,24,27,0.9)',
                    borderRadius: '16px',
                    left: '10%',
                    right: '10%',
                    padding: '40px',
                    textAlign: 'center',
                    border: '1px solid rgba(236,72,153,0.3)',
                };
            default:
                return { ...base, bottom: 0 };
        }
    };

    return (
        <AbsoluteFill style={{ background: '#18181B' }}>
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
                    {/* Accent bar */}
                    <div
                        style={{
                            width: accentWidth,
                            height: 4,
                            background: '#EC4899',
                            borderRadius: 2,
                            marginBottom: 16,
                        }}
                    />
                    <h2
                        style={{
                            fontSize: 52,
                            fontWeight: 600,
                            color: '#FAFAFA',
                            margin: 0,
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            letterSpacing: '-0.02em',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        }}
                    >
                        {title}
                    </h2>
                    {subtitle && (
                        <p
                            style={{
                                fontSize: 22,
                                color: 'rgba(250,250,250,0.85)',
                                margin: '12px 0 0 0',
                                fontFamily: "'Libre Baskerville', Georgia, serif",
                                fontWeight: 400,
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
