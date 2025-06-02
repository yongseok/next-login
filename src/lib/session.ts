import 'server-only';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secretKey = process.env.AUTH_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  userId: string;
  expiresAt: Date;
  role?: string;
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.log('세션 검증에 실패했습니다', error);
    return null;
  }
}

export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('next-auth.session-token');
  console.log('🚀 | getServerSession | sessionCookie:', sessionCookie);

  if (!sessionCookie?.value) {
    return null;
  }

  return await decrypt(sessionCookie.value);
}

export async function verifySession() {
  const session = await getServerSession();

  if (!session?.userId) {
    return { isAuth: false, userId: null };
  }

  return { isAuth: true, userId: session.userId };
}
