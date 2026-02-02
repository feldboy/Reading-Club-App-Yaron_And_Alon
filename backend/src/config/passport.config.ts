import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';

/**
 * Configure Passport with Google OAuth Strategy
 */
export const setupPassport = (): void => {
    // Read env vars inside function to ensure dotenv has been loaded
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
    const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';

    // Google OAuth Strategy - only set up if credentials are provided
    if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: GOOGLE_CLIENT_ID,
                    clientSecret: GOOGLE_CLIENT_SECRET,
                    callbackURL: GOOGLE_CALLBACK_URL,
                    scope: ['profile', 'email'],
                },
                async (
                    _accessToken: string,
                    _refreshToken: string,
                    profile: Profile,
                    done: VerifyCallback
                ) => {
                    try {
                        // Extract user info from Google profile
                        const googleUser = {
                            googleId: profile.id,
                            email: profile.emails?.[0]?.value || '',
                            username: profile.displayName || profile.emails?.[0]?.value?.split('@')[0] || '',
                            profileImage: profile.photos?.[0]?.value || '/uploads/profiles/default-avatar.png',
                        };

                        // Pass to callback - will be handled in controller
                        done(null, googleUser);
                    } catch (error) {
                        done(error as Error, undefined);
                    }
                }
            )
        );
        console.log('✅ Google OAuth configured');
    } else {
        console.log('⚠️  Google OAuth not configured (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET required)');
    }

    // Serialize user for session (not used with JWT, but required by Passport)
    passport.serializeUser((user: any, done) => {
        done(null, user);
    });

    // Deserialize user from session
    passport.deserializeUser((user: any, done) => {
        done(null, user);
    });
};
