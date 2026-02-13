import { AbsoluteFill, Series } from 'remotion';

const FeatureSlide: React.FC<{ title: string; color: string }> = ({ title, color }) => {
    return (
        <AbsoluteFill style={{ backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ fontSize: 80, color: 'white' }}>{title}</h2>
            <p style={{ fontSize: 40, color: 'white' }}>Placeholder for Screen Recording</p>
        </AbsoluteFill>
    );
};

export const Features: React.FC = () => {
    // Total Duration: 5 minutes = 300 seconds = 9000 frames
    // 5 features, so roughly 1800 frames each (1 minute each)

    return (
        <Series>
            <Series.Sequence durationInFrames={1800}>
                <FeatureSlide title="Register & Login" color="#3498db" />
            </Series.Sequence>
            <Series.Sequence durationInFrames={1800}>
                <FeatureSlide title="Create Review with Image" color="#e74c3c" />
            </Series.Sequence>
            <Series.Sequence durationInFrames={1800}>
                <FeatureSlide title="Like & Comment" color="#9b59b6" />
            </Series.Sequence>
            <Series.Sequence durationInFrames={1800}>
                <FeatureSlide title="AI Search for Books" color="#2ecc71" />
            </Series.Sequence>
            <Series.Sequence durationInFrames={1800}>
                <FeatureSlide title="Edit Profile" color="#f1c40f" />
            </Series.Sequence>
        </Series>
    );
};
