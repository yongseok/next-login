// 비밀번호 해싱
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16)); // 랜덤 솔트 생성
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000, // 보안 강화를 위해 반복 횟수 증가
      hash: 'SHA-256',
    },
    key,
    256
  );
  const hashArray = new Uint8Array(hash);
  const saltAndHash = new Uint8Array([...salt, ...hashArray]);
  return Buffer.from(saltAndHash).toString('base64');
}

// 비밀번호 검증
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const buffer = Buffer.from(storedHash, 'base64');
  const salt = buffer.subarray(0, 16); // 솔트 추출
  const originalHash = buffer.subarray(16); // 해시 추출

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    key,
    256
  );
  const hashArray = new Uint8Array(hash);
  return Buffer.from(hashArray).equals(originalHash);
}
