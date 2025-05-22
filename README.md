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
- [ ] 권한 접근 제어 구현(admin, user)  

**2025.05.22**  

- [x] OAuth 구현  
  - [ ] 🚨 middleware 학습
- [x] 커스텀 에러 클래스 도입: 🚨 withActionErrorHandler 함수의 제네릭 타입 선언 시 많이 헤맴
- [ ] 에러 로깅/모니터링
- [ ] 메인창 구현  
- [ ] 권한 접근 제어 구현(admin, user)  

**추가 작업**  
[] 세션 관리

### 작업 내용

- 구글 아이콘이 없어서 `react-icons` 라이브러리 추가함
- 

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
npm install next-auth
```
