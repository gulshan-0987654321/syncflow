import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';

/**
 * Triggers official Google Account Chooser popup:
 * 1. Attempts Firebase OAuth popup with prompt: 'select_account'
 * 2. If Firebase API key is restricted on Google Cloud, triggers Google Identity Services OAuth 2.0 Web Popup
 * 3. Returns the real, verified Google email, name, avatar, and token.
 */
export const triggerGoogleAccountChooser = async () => {
  // Strategy 1: Firebase Google OAuth Popup
  if (auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user && user.email) {
        return {
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          avatar: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`,
          googleId: user.uid,
          token: await user.getIdToken()
        };
      }
    } catch (firebaseErr) {
      if (firebaseErr.code === 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in popup was closed.');
      }
      console.warn("Firebase popup note:", firebaseErr.code, firebaseErr.message);
    }
  }

  // Strategy 2: Google Identity Services (GSI) Browser Account Chooser
  if (window.google?.accounts?.oauth2) {
    return new Promise((resolve, reject) => {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: '933202576741-55518a3bda160955d28d8c.apps.googleusercontent.com', // Firebase Web Client ID
          scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          prompt: 'select_account',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              reject(new Error(tokenResponse.error_description || 'Google sign-in was cancelled.'));
              return;
            }

            try {
              // Fetch user profile from official Google userinfo endpoint
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              });
              const profile = await userInfoRes.json();

              if (!profile.email) {
                reject(new Error('Failed to retrieve verified email from Google.'));
                return;
              }

              resolve({
                email: profile.email,
                name: profile.name || profile.given_name || profile.email.split('@')[0],
                avatar: profile.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.email}`,
                googleId: profile.sub,
                token: tokenResponse.access_token
              });
            } catch (fetchErr) {
              reject(fetchErr);
            }
          },
        });

        client.requestAccessToken({ prompt: 'select_account' });
      } catch (gsiErr) {
        reject(gsiErr);
      }
    });
  }

  throw new Error('Google Sign-In services are initializing in browser. Please try again in 2 seconds.');
};

export default triggerGoogleAccountChooser;
