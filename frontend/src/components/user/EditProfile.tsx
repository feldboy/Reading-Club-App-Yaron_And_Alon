import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile, uploadImage } from '../../services/user.api';
import './EditProfile.css';

/**
 * Edit Profile Component
 */
const EditProfile = () => {
    const { user: currentUser, setUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // profile state removed as it was unused
    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        favoriteGenres: [] as string[],
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Available genres
    const availableGenres = [
        'Fiction',
        'Non-Fiction',
        'Mystery',
        'Science Fiction',
        'Fantasy',
        'Romance',
        'Thriller',
        'Horror',
        'Biography',
        'History',
        'Self-Help',
        'Philosophy',
        'Poetry',
        'Drama',
        'Comedy',
    ];

    // Load profile on mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const profileData = await getProfile();
                // setProfile(profileData); // Removed
                setFormData({
                    username: profileData.username,
                    bio: profileData.bio || '',
                    favoriteGenres: profileData.favoriteGenres || [],
                });
                setImagePreview(`http://localhost:3000${profileData.profileImage}`);
            } catch (err: any) {
                console.error('Failed to load profile:', err);
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    /**
     * Handle form input changes
     */
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * Handle genre toggle
     */
    const handleGenreToggle = (genre: string) => {
        setFormData((prev) => {
            const genres = prev.favoriteGenres.includes(genre)
                ? prev.favoriteGenres.filter((g) => g !== genre)
                : [...prev.favoriteGenres, genre];
            return {
                ...prev,
                favoriteGenres: genres,
            };
        });
    };

    /**
     * Handle image file selection
     */
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }

            setSelectedFile(file);
            setError(null);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setSaving(true);

        try {
            // Upload image first if selected
            if (selectedFile) {
                const imageResult = await uploadImage(selectedFile);
                setImagePreview(`http://localhost:3000${imageResult.imageUrl}`);
            }

            // Update profile
            const updatedProfile = await updateProfile({
                username: formData.username,
                bio: formData.bio,
                favoriteGenres: formData.favoriteGenres,
            });

            // profile state update removed
            setSuccess(true);

            // Update AuthContext if it's the current user
            if (currentUser && updatedProfile.id === currentUser.id) {
                setUser({
                    id: updatedProfile.id,
                    username: updatedProfile.username,
                    email: updatedProfile.email,
                    profileImage: updatedProfile.profileImage,
                });
            }

            // Reset file selection
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Show success message and redirect after a moment
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (err: any) {
            console.error('Failed to update profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    /**
     * Handle cancel
     */
    const handleCancel = () => {
        navigate('/profile');
    };

    if (loading) {
        return (
            <div className="edit-profile-loading">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="edit-profile">
            <h1>Edit Profile</h1>

            <form onSubmit={handleSubmit} className="edit-profile-form">
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Profile updated successfully!</div>}

                {/* Profile Image Upload */}
                <div className="form-group image-upload-group">
                    <label>Profile Image</label>
                    <div className="image-upload-container">
                        <div className="image-preview">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile preview" />
                            ) : (
                                <div className="image-placeholder">No image</div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file-input"
                            id="profile-image-input"
                        />
                        <label htmlFor="profile-image-input" className="file-input-label">
                            {selectedFile ? 'Change Image' : 'Choose Image'}
                        </label>
                        {selectedFile && (
                            <span className="file-name">{selectedFile.name}</span>
                        )}
                    </div>
                    <p className="form-hint">JPEG, PNG, GIF, or WebP. Max 5MB.</p>
                </div>

                {/* Username */}
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        minLength={3}
                        maxLength={30}
                        className="form-input"
                    />
                    <p className="form-hint">3-30 characters</p>
                </div>

                {/* Bio */}
                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        maxLength={500}
                        rows={4}
                        className="form-textarea"
                        placeholder="Tell us about yourself..."
                    />
                    <p className="form-hint">
                        {formData.bio.length}/500 characters
                    </p>
                </div>

                {/* Favorite Genres */}
                <div className="form-group">
                    <label>Favorite Genres</label>
                    <div className="genres-container">
                        {availableGenres.map((genre) => (
                            <button
                                key={genre}
                                type="button"
                                onClick={() => handleGenreToggle(genre)}
                                className={`genre-button ${formData.favoriteGenres.includes(genre) ? 'selected' : ''
                                    }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                    <p className="form-hint">
                        Selected: {formData.favoriteGenres.length} genre(s)
                    </p>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-secondary"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
