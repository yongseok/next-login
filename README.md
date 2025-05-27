# 로그인 및 권한관리 구현

## 오늘의 목표

**2025.05.20**  

- [x] Prisma 모델: User  
- [ ] 메인창 구현  
- [ ] 회원가입창 구현  
  - [x] UI
  - [x] 유효성 검사 로직 구현
  - [ ] 비지니스 로직
- [ ] 로그인창 구현  
  - [x] UI
  - [x] 유효성 검사 로직 구현
  - [ ] 비지니스 로직  
- [x] prisma client, user.repository, user.service 클래스 구현
- [ ] OAuth 구현  
- [ ] 권한 접근 제어 구현(admin, user)  

**2025.05.21**  

- [ ] 커스텀 에러 클래스 도입
- [ ] 에러 로깅/모니터링
- [ ] 메인창 구현  
- [ ] 회원가입창 구현  
  - [x] 비지니스 로직
- [ ] 로그인창 구현  
  - [x] 비지니스 로직  
- [x] prisma client, user.repository, user.service 클래스 구현
- [ ] OAuth 구현
  - [x] 미들웨어  
  - [ ] 회원가입
  - [ ] 로그인
- [ ] 권한 접근 제어 구현(admin, user)  

**2025.05.22**  

- [x] OAuth 구현  
  - [ ] auth: NextAuth.js v5로 작업(@next-auth/prisma-adapter가 NextAuth.js v5 버전을 미지원 하는걸로 착각해서 삽질함)
- [x] 커스텀 에러 클래스 도입: 🚨 withActionErrorHandler 함수의 제네릭 타입 선언 시 많이 헤맴
- [ ] 에러 로깅/모니터링
- [ ] 메인창 구현  
- [ ] 권한 접근 제어 구현(admin, user)  
- [ ] 세션 전략
  - [ ] jwt
  - [x] db

**2025.05.23**  

- [진행중] 사용자 인증
  - [진행중] Credentials(직접 입력)
  - [ ] 커스텀 인증 화면
- [x] OAuth 구현  
  - [보류] auth: NextAuth.js v5로 작업(@next-auth/prisma-adapter가 NextAuth.js v5 버전을 미지원 하는걸로 착각해서 삽질함)
- [ ] 에러 로깅/모니터링
- [ ] 메인창 구현  
- [ ] 권한 접근 제어 구현(admin, user)  
- [보류] 세션 전략
  - [ ] jwt
  - [x] db

**2025.05.27**  

- [x] 세션 관리 정책: jwt
  - 추후 database로 변경 예정: 계정 연결 및 데이터 영속성 부족 등의 이유로 변경 예정
  - 현재는 email을 고유 아이디로 하여 oauth의 email이 같으면 동일 사용자로 간주한다.
- [x] 사용자 Role 선택

**2025.05.28**  

- [ ] 사용자 업데이트 로직 구현
  - [ ] 서버 엔드 포인트 구현
  - [ ] 클라이언트 통신 custom hooks 구현(SWR)

**추가 작업**  

- [ ] 세션 관리
- [ ] 사용자 인증 추가
  - [ ] 이메일 인증
  - [ ] Credentials(직접 입력)
  - [ ] WebAuthn(생체/보안키)

### 작업 내용

- 구글 아이콘이 없어서 `react-icons` 라이브러리 추가함

## 구현 기능  

- 회원가입
- oauth 연동(구글, 깃허브)
- 로그인
- 권한에 따른 접근 제어

## 기술 스팩

- typescript  
- 웹 프레임워크: next.js(v15, app route)
- nextauth
- 데이터 패칭: SWR
- UI: shadcn
- db: sqlite
- orm: prisma
- form 처리: react-hook-form
- 유효성 체크: zod, @hookform/resolvers
- auth: auth.js(v5)

```zsh
npm install next-auth@beta
npm i swr
npx shadcn@latest init
npm install prisma --save-dev
npx prisma init --datasource-provider sqlite --output ../generated/prisma
npm install react-hook-form
npm install @hookform/resolvers
npm install zod
npm install @faker-js/faker --save-dev
npm install react-icons --save
npm install next-auth@beta
npm install @prisma/client @auth/prisma-adapter
```
