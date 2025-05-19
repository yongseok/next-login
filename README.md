# 로그인 및 권한관리 구현

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
```
