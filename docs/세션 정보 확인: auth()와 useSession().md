# **세션 정보 확인: `auth()`와 `useSession()`**

1. **`useSession()` (클라이언트 측)**:

   - React/Next.js에서 사용하는 훅으로, 클라이언트에서 세션 데이터를 가져옵니다.
   - 반환값: `{ data: session, status: "authenticated" | "unauthenticated" | "loading" }`.
   - `session` 객체는 `session` 콜백에서 구성된 데이터를 포함(예: `session.user.name`, `session.user.email`).
   - 사용 예시:

     ```tsx
     import { useSession } from "next-auth/react";
     
     function Component() {
       const { data: session, status } = useSession();
       if (status === "authenticated") {
         return <p>User: {session.user.name}, Role: {session.user.role}</p>;
       }
       return <p>Not logged in</p>;
     }
     ```

2. **`auth()` (서버 측)**:

   - 서버 측에서 세션 데이터를 가져오는 함수로, API 라우트, 서버 컴포넌트, 또는 미들웨어에서 사용.
   - 반환값: `session` 객체 또는 `null`(로그인되지 않은 경우).
   - 사용 예시:
   
     ```typescript
     import { auth } from "@/auth";
     
     export default async function ServerComponent() {
       const session = await auth();
       if (session) {
         return <p>User: {session.user.name}, Role: {session.user.role}</p>;
       }
       return <p>Not logged in</p>;
     }
     ```

- **공통점**: `useSession()`과 `auth()`는 모두 **세션 객체**를 반환하며, 이 객체는 `session` 콜백에서 구성된 데이터를 기반으로 합니다.