# DateParser.js

## 1. about

### 1.1. 소개 

여러 포맷의 날짜 문자열을 입력받아, ISO 포맷으로 변환하는 Javascript Library

### 1.2. 다운로드

https://github.com/logicielkr/client_lib/tree/master/parser/0.5.0.5

### 1.3. 호환성

이 라이브러리는 다음의 환경에서 테스트했다.

- Firefox 최신버전
- Google Chrome 최신버전
- Internet Explorer 11

### 1.4. 중요한 알림

- 0.5.0.0 ~ 0.5.0.2 사이의 버전은 31 일에서 버그가 발견되었다(상세내용은 HISTORY.md 참조).

## 2. DateParser.js 사용법

### 2.1. DateParser.js 가 제공하는 함수

- DateParser.parseDate : 문자열 형태의 날짜를 입력받아 Date 객체를 반환한다.
- DateParser.parse : 문자열 형태의 날짜를 입력받아 ISO 포맷의 문자열을 반환한다.

### 2.2. 입력값과 반환값 (오늘이 2021년 10월 28일 인 경우)

- DateParser.parse("+") : 2021-10-28
- DateParser.parse("-") : 2021-10-28
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


# NumberParser.js

## 1. about

### 1.1. 소개 

문자열을 입력받아, Number 형식으로 변환하는 Javascript Library

### 1.2. 다운로드

https://github.com/logicielkr/client_lib/tree/master/parser/0.5.0.5

### 1.3. 호환성

이 라이브러리는 다음의 환경에서 테스트했다.

- Firefox 최신버전
- Google Chrome 최신버전
- Internet Explorer 11

## 2. NumberParser.js 사용법

### 2.1. 파라미터가 1개인 경우

- NumberParser.parse("1") : 1
- NumberParser.parse("1.1") : 1.1
- NumberParser.parse("1,000") : 1000

입력값에 소수점이 포함되어 있으면, parseFloat을 그렇지 않으면 parseInt 로 처리한다.

### 2.2. 파라미터가 2개인 경우

- NumberParser.parse("1", "int") : 1
- NumberParser.parse("1.1", "float") : 1.1

2번 째 파라미터는 Data Type 이며, 다음 중 1개이어야 한다.

- int : -2147483648 ~ 2147483647 
- long
- float : 1.4E-45 ~ 3.4028235E38
- double

> 2번 째 파라미터가 각각 "int", "float" 인 경우,
> 첫 번째 파라미터로 입력된 문자열이 각각 그 범위를 넘은 경우
> NaN 을 반환한다.

### 2.3. 파라미터가 3개인 경우

HTML Form 아래의 Element 값을 얻어서 Number Type 으로 변형한다.

- NumberParser.parse(form, elementName, "int")

