import { Audio as RemotionAudio } from 'remotion';

export const BackgroundMusic: React.FC = () => {
    return (
        <RemotionAudio
            src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"
            volume={0.3}
            startFrom={0}
        />
    );
};
