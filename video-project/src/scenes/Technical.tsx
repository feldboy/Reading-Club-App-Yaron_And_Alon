import { AbsoluteFill, Series } from 'remotion';

const TechSlide: React.FC<{ title: string; color: string }> = ({ title, color }) => {
    return (
        <AbsoluteFill style={{ backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ fontSize: 80, color: 'white' }}>{title}</h2>
            <p style={{ fontSize: 40, color: 'white' }}>Placeholder for CLI/Docs</p>
        </AbsoluteFill>
    );
};

export const Technical: React.FC = () => {
    // Total Duration: 3 minutes = 180 seconds = 5400 frames
    // 4 sections, so ~1350 frames each (45 seconds each)

    return (
        <Series>
            <Series.Sequence durationInFrames={1350}>
                <TechSlide title="Swagger Documentation" color="#34495e" />
            </Series.Sequence>
            <Series.Sequence durationInFrames={1350}>
                <TechSlide title="Jest Tests (npm test)" color="#16a085" />
            </Series.Sequence>
            <Series.Sequence durationInFrames={1350}>
                <TechSlide title="PM2 Status" color="#2c3e50" />
            </Series.Sequence>
            <Series.Sequence durationInFrames={1350}>
                <TechSlide title="Production Mode" color="#8e44ad" />
            </Series.Sequence>
        </Series>
    );
};
