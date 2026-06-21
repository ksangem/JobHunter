// ============================================================================
// Google OAuth2 strategy (FR-JS-002 social login). On callback the profile is
// handed to AuthService.findOrCreateOAuthUser to mint platform tokens.
// ============================================================================
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

export interface GoogleProfile {
  google_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ??
        'http://localhost:3001/api/v1/auth/oauth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const user: GoogleProfile = {
      google_id: profile.id,
      email: profile.emails?.[0]?.value ?? '',
      full_name: profile.displayName,
      avatar_url: profile.photos?.[0]?.value,
    };
    done(null, user);
  }
}
