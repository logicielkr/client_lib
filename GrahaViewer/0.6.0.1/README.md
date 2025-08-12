# GrahaViewer

## 1. about

### 1.1. 소개 

GrahaViewer 는 웹브라우저에서 동작하는 다음 2가지 형식의 HTML Viewer 이다. 

- [한/글]의 .hwpx
- [Apache OpenOffice](https://www.openoffice.org/) Text 혹은 [LibreOffice](https://www.libreoffice.org/) Text 의 .odt

### 1.2. 다운로드

https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.6.0.0

### 1.3. 호환성

다음의 환경에서 테스트했다.

- Firefox 최신버전
- Google Chrome 최신버전
- IE 11

> IE 11 에서는
> Javascript 오류가 나지는 않지만,
> 인쇄 기능을 지원하지 않고,
> PDF 변환이 매우 느리고([html2canvas.min.js](//cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js) 때문이라고 생각한다),
> 여러 상황에 따라 결과물이 고르지 않을 수 있다.

### 1.4. 의존성

CDN 에서 다음과 같은 css 와 Javascript 라이브러리를 불러와서 사용한다.

- [nanummyeongjo.css](//cdn.jsdelivr.net/font-nanum/1.0/nanummyeongjo/nanummyeongjo.css)
- [nanumgothic.css](//cdn.jsdelivr.net/font-nanum/1.0/nanumgothic/nanumgothic.css)

- [bluebird.min.js](//cdn.jsdelivr.net/npm/bluebird@3.3.4/js/browser/bluebird.min.js)
- [hasfont.min.js](//cdn.jsdelivr.net/npm/has-font@1.0.2/hasfont.min.js)

- [jquery.min.js](//cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js)

- [html2canvas.min.js](//cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js)

- [jspdf.umd.min.js](//cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js)
- [polyfills.umd.js](//cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/polyfills.umd.js)

- [jszip.min.js](//cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js)
- [jszip-utils.min.js](//cdn.jsdelivr.net/npm/jszip-utils@0.1.0/dist/jszip-utils.min.js)

> [bluebird.min.js](//cdn.jsdelivr.net/npm/bluebird@3.3.4/js/browser/bluebird.min.js) 과
> [hasfont.min.js](//cdn.jsdelivr.net/npm/has-font@1.0.2/hasfont.min.js) 는 IE 11 를 위한 것이고,
> 현대적인 웹브라우저에서는 필요없는 것들이다.

## 2. 사용법

### 2.1. 사용법

1. .odt 문서는 [odt.html](//graha.kr/static-contents/client_lib/GrahaViewer/lastest/odt.html) 을 웹브라우저에서 불러온다.

2. .hwpx 문서는 [hwpx.html](//graha.kr/static-contents/client_lib/GrahaViewer/lastest/hwpx.html) 을 웹브라우저에서 불러온다.

2. 상단의 "찾아보기"를 클릭해서 odt 혹은 hwpx 파일을 선택하거나, odt 혹은 hwpx 파일 1개를 드래그 앤 드롭(Drag and Drop) 하면, HTML 로 변환한다.

3. PDF 아이콘을 클릭하면, PDF 로 변환한다.

4. 인쇄(Print) 아이콘을 클릭하면, 웹페이지를 인쇄한다.

	odt 혹은 hwpx 파일과 웹브라우저의 용지 크기, 여백, 기타 인쇄와 관련된 설정이 맞지 않는다면, 페이지 넘김이 발생하는 위치가 다를 수 있으므로 주의를 요한다.

5. 다운로드 아이콘을 클릭하면, odt 혹은 hwpx 원본 파일을 다운로드 한다.

> 서버에 upload 하지 않고 client 에서 처리한다.

### 2.2. Notice

#### 2.2.1. GrahaViewer 는 범용으로 사용 할 수 없다.

[한/글] 혹은 [Apache OpenOffice](https://www.openoffice.org/) Text, [LibreOffice](https://www.libreoffice.org/) Text 의 극히 일부만 지원한다.

어떤 항목이 표시되지 않을 수도 있고,
페이지 레이아웃이 망가지는 경우도 있고,
페이지 넘김이 발생하는 위치가 다를 수도 있다.

GrahaViewer 는 필자가 만들어서 배포중인 [GrahaReporter.js](https://github.com/logicielkr/client_lib/tree/master/reporter/0.6.0.0)
혹은 GrahaReporter.js 의
Java 버전인 [GrahaExtension](https://github.com/logicielkr/GrahaExtension) 의 구성요소 중 하나인 GrahaReporterImpl 로
생성한 odt 혹은 hwpx 파일을
HTML 로 변환하여 미리보기 혹은 인쇄 기능을 제공하거나
HTML 을 다시 PDF 로 변환하여 출력 기능을 제공 하기 위해 만들었다.

#### 2.2.2. 한글 서체는 나눔폰트를 사용한다.

나눔폰트가 아닌 것들은 전부 다 나눔폰트로 변경해 버린다.

> 이렇게 하지 않으면, PDF 로 변환했을 때, 한글이 깨진다.

폰트 이름에 "바탕" "명조" 따위가 들어간다면, 나눔명조로 변경하고,

"고딕" "굴림" 따위가 들어간다면, 나눔고딕으로 변경한다.

> 필자가 나눔폰트를 특별히 좋아하는 것까지는 아니지만,
> 프로그램적으로 ttf 파일을 PDF 에 포함시키는 것에 대한 별도의 License 를 요구하지 않으면서,
> ttf 파일을 지원하는 CDN 이 있는 한글 폰트를 찾기가 쉽지 않았다.

폰트에 따라 문자의 width 가 달라져서 발생하는 여러 문제들이 있을 수 있다.
