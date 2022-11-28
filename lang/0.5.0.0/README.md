# Lang.js

## 1. about

### 1.1. 소개 

UTF-8 인코딩된 문자열에 한국어, 일본어, 한자, 혹은 ASCII, ISO-8859-1 범위를 넘어서는 문자가 포함되어 있는지 검사한다.

한국어, 일본어의 범위에 한자는 포함되어 있지 않다.

구체적인 상황에 맞게 Lang.onlyKoreanWithAscii 나 Lang.onlyAscii 같은 함수를 만들어서 사용하기를 권한다.

소스를 보면 알겠지만, 그냥 1글자씩 검사한다.

### 1.2. 다운로드

https://github.com/logicielkr/client_lib/tree/master/lang/0.5.0.0

### 1.3. 호환성

이 라이브러리는 다음의 환경에서 테스트했다.

- Firefox 최신버전
- Google Chrome 최신버전
- Internet Explorer 11

## 2. Lang.js 사용법

### 2.1. Lang.js 가 제공하는 함수

- Lang.guess
- Lang.onlyAscii
- Lang.onlyKoreanWithAscii
- Lang.onlyKorean

#### 2.1.1. Lang.guess

문자열의 각 문자가 한국어, 일본어, 한자, 혹은 ASCII, ISO-8859-1 범위를 넘어서는 문자가 포함되어 있는지 검사한다.

리턴하는 Object 속성은 다음과 같다.

- ko : 한글(한자 제외)이 포함되어 있다면 true
- jp : 일본어(한자 제외)가 포함되어 있다면 true
- hanja : 한자가 포함되어 있다면 true
- overAscii : ASCII 범위를 넘어서는 문자가 포함되어 있다면 true
- overISO_8859_1 : ISO-8859-1 범위를 넘어서는 문자가 포함되어 있다면 true
- ascii : ASCII 범위 내의 문자가 포함되어 있다면 true

#### 2.1.2. Lang.onlyAscii

문자열이 ASCII 범위내에 있으면 true 를 반환한다.

- null 이나 공백인 경우에도 true

#### 2.1.3. Lang.onlyKoreanWithAscii

문자열에 한국어가 포함되어 있고, 문자열이 ASCII 와 한국어 범위내에 있으면 true 를 반환한다.

- null 이나 공백인 경우에는 false
- 한자가 포함되어 있으면 false 를 반환함에 주의!!!

#### 2.1.4. Lang.onlyKorean

문자열이 한국어로만 구성되어 있는 경우 true 를 반환한다.

- null 이나 공백인 경우에는 false
- 한자가 포함되어 있으면 false 를 반환함에 주의!!!

### 2.2. 예제

Lang.js 예제는 test.html 파일에서 찾을 수 있고, input 요소에서 blur 이벤트를 발생시키면 결과를 확인할 수 있다.