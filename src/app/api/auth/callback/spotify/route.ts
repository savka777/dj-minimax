import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect('http://127.0.0.1:3000?error=auth_denied');
  }

  if (!code) {
    return NextResponse.redirect('http://127.0.0.1:3000?error=no_code');
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect('http://127.0.0.1:3000?error=missing_credentials');
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://127.0.0.1:3000/api/auth/callback/spotify',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Token exchange error:', errorData);
      return NextResponse.redirect('http://127.0.0.1:3000?error=token_exchange_failed');
    }

    const data = await response.json();

    // Store tokens in HTTP-only cookies
    const cookieStore = await cookies();

    cookieStore.set('spotify_access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.expires_in,
      path: '/',
    });

    if (data.refresh_token) {
      cookieStore.set('spotify_refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    return NextResponse.redirect('http://127.0.0.1:3000?auth=success');
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect('http://127.0.0.1:3000?error=unknown');
  }
}
