import { Composition } from 'remotion';
import { Main } from './Main';

export const Root: React.FC = () => {
    // Total Duration:
    // Intro: 30s
    // Features: 5m (300s)
    // Technical: 3m (180s)
    // Outro: 30s
    // Total: 30 + 300 + 180 + 30 = 540s
    // Frames: 540 * 30 = 16200

    return (
        <>
            <Composition
                id="Main"
                component={Main}
                durationInFrames={16200}
                width={1920}
                height={1080}
                fps={30}
            />
        </>
    );
};
