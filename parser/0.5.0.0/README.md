# DateParser.js

## 1. about

### 1.1. 소개 

문자열 형태의 날짜를 입력받아, Date 객체나 ISO 포맷의 문자열을 반환하는 Javascript 라이브러리이다.

### 1.2. 다운로드

https://github.com/logicielkr/client_lib/tree/master/date_parser/0.5.0.0

### 1.3. 호환성

이 라이브러리는 다음의 환경에서 테스트했다.

- Firefox 최신버전
- Google Chrome 최신버전
- Internet Explorer 11

### 1.4. 중요한 알림

- 0.5.0.0 ~ 0.5.0.2 사이의 버전은 31 일에서 버그가 발견되었다(상세내용은 0.5.0.0의 HISTORY.md 참조).

## 2. DateParser.js 사용법

### 2.1. DateParser.js 가 제공하는 함수

- DateParser.parseDate : 문자열 형태의 날짜를 입력받아 Date 객체를 반환한다.
- DateParser.parse : 문자열 형태의 날짜를 입력받아 ISO 포맷의 문자열을 반환한다.

### 2.2. 입력값과 반환값 (오늘이 2021년 10월 28일 인 경우)

- DateParser.parse("1") : 2021-10-01
- DateParser.parse("+0") : 2021-10-28
- DateParser.parse("-1") : 2021-10-27
- DateParser.parse("+1") : 2021-10-29
- DateParser.parse("1031") : 2021-10-31
- DateParser.parse("211031") : 2021-10-31
- DateParser.parse("20211031") : 2021-10-31
- DateParser.parse("10-31") : 2021-10-31
- DateParser.parse("21-10-31") : 2021-10-31
- DateParser.parse("2021-10-31") : 2021-10-31
- DateParser.parse("10.31") : 2021-10-31
- DateParser.parse("21.10.31") : 2021-10-31
- DateParser.parse("2021.10.31") : 2021-10-31
- DateParser.parse("10.31.") : 2021-10-31
- DateParser.parse("21.10.31.") : 2021-10-31
- DateParser.parse("2021.10.31.") : 2021-10-31
- DateParser.parse("10월31일") : 2021-10-31
- DateParser.parse("21년10월31일") : 2021-10-31
- DateParser.parse("2021년10월31일") : 2021-10-31
- DateParser.parse("10月31日") : 2021-10-31
- DateParser.parse("21年10月31日") : 2021-10-31
- DateParser.parse("2021年10月31日") : 2021-10-31

### 2.3. 예제

DateParser.js 예제는 test.html 파일에서 찾을 수 있고, input 요소에서 blur 이벤트를 발생시키면 결과를 확인할 수 있다.
