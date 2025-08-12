# GrahaViewer

## 1. about

### 1.1. 소개 

GrahaViewer 는 웹브라우저에서 동작하는 다음 2가지 형식의 HTML Viewer 이다. 

- [한/글]의 .hwpx
- [Apache OpenOffice](https://www.openoffice.org/) Text 혹은 [LibreOffice](https://www.libreoffice.org/) Text 의 .odt

### 1.2. 다운로드

https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.6.0.1

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

어떤 항목은 표시되지 않을 수도 있고,
페이지 레이아웃이 망가지는 경우도 있고,
페이지 넘김이 발생하는 위치가 다를 수도 있다.

[한/글]이나 [Apache OpenOffice](https://www.openoffice.org/) Text / [LibreOffice](https://www.libreoffice.org/) Text 등과 비교하면 글자등이 표시되는 위치가 약간씩 다르다.

따라서 위치가 종이나 쪽 기준의 어떤 좌표값으로 정해진 것이라면, 다르게 표시될 수 있다.

GrahaViewer 는 필자가 만들어서 배포중인 [GrahaReporter.js](https://github.com/logicielkr/client_lib/tree/master/reporter/0.6.0.1)
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

## 3. 프로그래머를 위하여

### 3.1. hwpx.html 과 odt.html 에 대해서

hwpx.html 과 odt.html 는 예제이므로
누구든 저작권에 구애받지 않고,
자유롭게 변경해서 사용하거나 다시 배포할 수 있다.

### 3.2. 폰트 변경 방법

폰트와 관련된 것은 다음과 같다.

- odt.html 혹은 hwpx.html 의 css
- GrahaPdfConverter.prototype.defaultFonts
- GrahaPdfConverterUtility.defaultFontFamilyConverter

GrahaPdfConverter.prototype.defaultFonts 및 GrahaPdfConverterUtility.defaultFontFamilyConverter 는
다음과 같이 GrahaPdfConverter 를 생성할 때, 새롭게 작성한 함수를 파라미터로 넘길 수 있다.

```javascript
var converter = new GrahaPdfConverter({
	fonts: GrahaViewerFontPlugin.fonts(),
	fontFamilyConverter: GrahaViewerFontPlugin.fontFamilyConverter,
	defaultFontFamily: "Nanum Myeongjo"
});
```

```fonts: GrahaViewerFontPlugin.fonts()``` 는 PDF 로 변환 할 때, jsPDF 에 공급되는 TrueType 폰트의 배열이며,
GrahaPdfConverter.prototype.defaultFonts 함수를 참조하여 작성한다.

> 파라미터로 넘어가는 것은 함수가 아니라, 함수의 실행결과(Array)이다.

각각의 폰트는 다음과 같이 family, truetype, weight 속성값을 가져야 한다.

```javascript
fonts.push({
	family: "Nanum Gothic",
	truetype: "//cdn.jsdelivr.net/font-nanum/1.0/nanumgothic/v3/NanumGothic-Regular.ttf",
	weight: "400"
});
```

```fontFamilyConverter: GrahaViewerFontPlugin.fontFamilyConverter``` 는 hwpx 혹은 odt 파일의 font-family 를 GrahaViewer 에서 사용할 폰트로 변환하는 함수이며,
```GrahaPdfConverterUtility.defaultFontFamilyConverter``` 함수를 참조하여 작성한다.

> 파라미터로 넘어가는 것은 함수다.

```defaultFontFamily: "Nanum Myeongjo"``` 은 미리 정의해 놓은 폰트 외에 다른 font-family 가 들어온 경우에 사용한다.

## 4. 남겨진 일들

### 4.1. 6개월 이내에는 처리할 것들

- [ ] hwpx.html 혹은 odt.html 없이 실행할 수 있도록 변경
	- ```GrahaPdfConverter.prototype.ready``` 함수 같은 것을 추가해서...

- [ ] 여러 개의 hwpx 파일 혹은 여러 개의 odt 파일을 일괄 변환할 수 있도록 개선
	- blob 으로부터 변환하는 경우에만 지원
	- blob 배열로 입력받고, 다운로드는 압축 한 후에...

- [ ] ```<hp:autoNum numType="TOTAL_PAGE" num="1">``` 처리
	- ```<hp:autoNum numType="PAGE" num="1">``` 는 각 페이지가 끝날 때 처리하고 있으나,
	- TOTAL_PAGE 는 ```GrahaHwpX2HtmlConverter.prototype.sections``` 가 끝날 때 처리해야 하는 것으로 생각됨. 
	- "여러 개의 hwpx 파일~~~" 이후에 처리 예정

- [x] hwpx.html 과 odt.html 에서 font cdn 에 preconnect 하도록 변경

- [x] hwpx 에서 ```<font>``` 의 css 가 그 아래의 ```<table>``` 에 적용되지 않도록 수정

- [x] hwpx 에서 color 값이 html 의 그것과 다르다.
	- ```#0000FF``` : [한/글]에서는 red 로 표시
	- ```#FF0000``` : [한/글]에서는 blue 로 표시
	- [한/글] 은 color 값을 BGR 로 저장하는 것으로 생각됨 (R : 233, G : 174, B : 42 가 #2BAEE9으로 저장됨)
	- ```#FFFFFFFF``` 혹은 ```#FF000000``` 와 같은 것들은,  RGBA 와 유사한 BGRA 라고 가정하고 처리하였음(테스트 X). 

- [x] font-stretch (장평) 가 지원되는지 여부를 확인하여 관련 코드를 정리할 필요가 있음
	- 기본 폰트 cdn (```//cdn.jsdelivr.net/font-nanum/1.0/nanumgothic/nanumgothic.css```) 의 font 는 font-stretch 를 지원하지 않음.
	- 폰트 cdn 을 ```//fonts.googleapis.com/css2``` 로 시작하는 것으로 변경하면, font-stretch (장평) 가 처리되는 것으로 보임.
	- 장평에 따라 font-size 를 줄이는 코드는 주석으로 막았음.
	- PDF 변환할 때 사용하는 TrueType 도 같이 변경해야 함.

### 4.2. 1년 이내에는 처리할 것으로 기대되는 것들

- [ ] ```<hp:rect>```
	- hwpx
	- odt 는 div 로 구현함
	- ```<hp:line>``` 등 다른 것들은 구현하지 않을 계획

- [ ] ```<hp:pic>```
	- hwpx
	- odt 는 구현

### 4.3. 1년이 지나도 처리하지 않을 가능성이 높은 것들
 
- [ ] hwpx 파일 내에서 페이지 크기나 가로/세로를 다르게 정의한 페이지가 있는 경우

### 4.4. 처리 할 생각이 없는 것들

- [ ] hwpx 에서 양쪽 어울림

- [ ] hwpx 에서 "text - 표 - text" 가 있고, 표의 세로 위치가 글자의 높이보다 큰 값인 경우