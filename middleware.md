NextRequest 주요 속성

request.url: 요청 URL.
request.nextUrl: 파싱된 URL 객체(예: pathname, searchParams).
request.cookies: 요청 쿠키에 접근.
request.headers: 요청 헤더에 접근.
NextResponse 주요 메서드

NextResponse.next(): 요청을 다음 핸들러로 전달.
NextResponse.redirect(url): 클라이언트를 지정된 URL로 리디렉션.
NextResponse.rewrite(url): 클라이언트 URL 변경 없이 내부적으로 다른 경로로 라우팅.
NextResponse.json(): JSON 응답 반환.