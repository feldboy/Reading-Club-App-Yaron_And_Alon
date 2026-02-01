import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './OAuthCallbackPage.css';

/**
 * OAuth Callback Page
 * Handles the redirect from Google OAuth
 * Expects tokens in URL query params: ?accessToken=xxx&refreshToken=xxx&user=xxx
 */
const OAuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleOAuthCallback } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const processCallback = async () => {
            try {
                // Check for error first
                const error = searchParams.get('error');
                if (error) {
                    setError(decodeURIComponent(error));
                    setLoading(false);
                    return;
                }

                // Get tokens from URL query params
                const accessToken = searchParams.get('accessToken');
                const refreshToken = searchParams.get('refreshToken');
                const userJson = searchParams.get('user');

                if (!accessToken || !refreshToken) {
                    // Try to get from hash (alternative method)
                    const hash = window.location.hash.substring(1);
                    const hashParams = new URLSearchParams(hash);
                    const hashAccessToken = hashParams.get('accessToken');
                    const hashRefreshToken = hashParams.get('refreshToken');
                    const hashUser = hashParams.get('user');

                    if (hashAccessToken && hashRefreshToken) {
                        // Parse user from JSON string
                        let userData;
                        if (hashUser) {
                            try {
                                userData = JSON.parse(decodeURIComponent(hashUser));
                            } catch {
                                // If user data not in hash, decode from token
                                const tokenParts = hashAccessToken.split('.');
                                if (tokenParts.length === 3) {
                                    const payload = JSON.parse(atob(tokenParts[1]));
                                    userData = {
                                        id: payload.userId,
                                        email: payload.email,
                                        username: payload.email.split('@')[0],
                                        profileImage: '/uploads/profiles/default-avatar.png',
                                    };
                                }
                            }
                        }

                        if (userData) {
                            handleOAuthCallback(hashAccessToken, hashRefreshToken, userData);
                            navigate('/');
                            return;
                        }
                    }

                    setError('Missing authentication tokens');
                    setLoading(false);
                    return;
                }

                // Parse user data
                let userData;
                if (userJson) {
                    try {
                        userData = JSON.parse(decodeURIComponent(userJson));
                    } catch {
                        // If parsing fails, decode from token
                        const tokenParts = accessToken.split('.');
                        if (tokenParts.length === 3) {
                            const payload = JSON.parse(atob(tokenParts[1]));
                            userData = {
                                id: payload.userId,
                                email: payload.email,
                                username: payload.email.split('@')[0],
                                profileImage: '/uploads/profiles/default-avatar.png',
                            };
                        }
                    }
                } else {
                    // Decode user from token
                    const tokenParts = accessToken.split('.');
                    if (tokenParts.length === 3) {
                        const payload = JSON.parse(atob(tokenParts[1]));
                        userData = {
                            id: payload.userId,
                            email: payload.email,
                            username: payload.email.split('@')[0],
                            profileImage: '/uploads/profiles/default-avatar.png',
                        };
                    }
                }

                if (userData) {
                    handleOAuthCallback(accessToken, refreshToken, userData);
                    navigate('/');
                } else {
                    setError('Failed to parse user data');
                    setLoading(false);
                }
            } catch (err: any) {
                console.error('OAuth callback error:', err);
                setError(err.message || 'Authentication failed');
                setLoading(false);
            }
        };

        processCallback();
    }, [searchParams, navigate, handleOAuthCallback]);

    if (loading) {
        return (
            <div className="oauth-callback-container">
                <div className="oauth-callback-loading">
                    <div className="oauth-spinner"></div>
                    <p>Completing authentication...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="oauth-callback-container">
                <div className="oauth-callback-error">
                    <h2>Authentication Failed</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/login')} className="oauth-retry-button">
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default OAuthCallbackPage;

