# GrahaViewer

## 1. about

### 1.1. 소개 

GrahaViewer 는 웹브라우저에서 동작하는 다음 2가지 형식의 HTML Viewer 이다. 

- [한/글]의 .hwpx
- [Apache OpenOffice](https://www.openoffice.org/) Text 혹은 [LibreOffice](https://www.libreoffice.org/) Text 의 .odt

### 1.2. 다운로드

https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.7.1.2

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

#### 1.4.1. 항상 사용하는 것

- [Nanum Gothic 및 Nanum Myeongjo font css](//fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&amp;family=Nanum+Myeongjo:wght@400;700;800&amp;display=swap)
- [jquery.min.js](//cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js)
- [jszip.min.js](//cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js)
- [jszip-utils.min.js](//cdn.jsdelivr.net/npm/jszip-utils@0.1.0/dist/jszip-utils.min.js)

#### 1.4.2. PDF 변환을 위해 사용하는 것

- [nanummyeongjo.css](//cdn.jsdelivr.net/font-nanum/1.0/nanummyeongjo/nanummyeongjo.css)
- [nanumgothic.css](//cdn.jsdelivr.net/font-nanum/1.0/nanumgothic/nanumgothic.css)

- [html2canvas.min.js](//cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js)

- [jspdf.umd.min.js](//cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js)

#### 1.4.3. IE 11 을 위해서 사용하는 것

- [bluebird.min.js](//cdn.jsdelivr.net/npm/bluebird@3.3.4/js/browser/bluebird.min.js)
- [hasfont.min.js](//cdn.jsdelivr.net/npm/has-font@1.0.2/hasfont.min.js)
- [polyfills.umd.js](//cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/polyfills.umd.js)

#### 1.4.4. GrahaReporter.js 와 함께 사용하는 경우

* [iconv.js](https://cdn.jsdelivr.net/gh/jcubic/static@master/js/iconv.js)

## 2. 사용법

### 2.1. 사용법

1. .odt 문서는 [odt.html](//graha.kr/static-contents/client_lib/GrahaViewer/lastest/odt.html) 을 웹브라우저에서 불러온다.

2. .hwpx 문서는 [hwpx.html](//graha.kr/static-contents/client_lib/GrahaViewer/lastest/hwpx.html) 을 웹브라우저에서 불러온다.

2. 상단의 "찾아보기"를 클릭해서 odt 혹은 hwpx 파일을 선택하거나, odt 혹은 hwpx 파일 1개를 드래그 앤 드롭(Drag and Drop) 하면, HTML 로 변환한다.

3. PDF 아이콘을 클릭하면, PDF 로 변환한다 (only IE 11).

	PDF 변환 기능은 소스코드에 함수가 남겨져 있지만, deprecated 되었다.
	웹브라우저의 인쇄기능 or 웹브라우저 확장기능으로 쉽게 구현이 가능하다.
	jsPDF 를 이용해서 pdf 변환을 하기 위해서는 ttf 파일을 다운로드 받아야 하기 때문에 여러가지 문제가 발생한다.
	jsPDF는 underline 을 지원하지 않는 등 아주 소소한 이슈도 있도 있고, 웹브라우저의 인쇄기능을 이용해서 PDF 로 변환한 것과 결과물에서 약간의 차이가 있다.

4. 인쇄(Print) 아이콘을 클릭하면, 웹페이지를 인쇄한다.

	odt 혹은 hwpx 파일과 웹브라우저의 용지 크기, 여백, 기타 인쇄와 관련된 설정이 맞지 않는다면, 페이지 넘김이 발생하는 위치가 다를 수 있으므로 주의를 요한다.
	IE 11 은 웹브라우저의 인쇄기능을 사용했을 경우 화면 layout 이 엉망이 되므로, 인쇄(Print) 아이콘은 숨겨진다.

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
HTML 로 변환하여 미리보기 혹은 인쇄 기능을 제공 하기 위해 만들었다.

#### 2.2.2. 한글 서체는 나눔폰트를 사용한다.

나눔폰트가 아닌 것들은 전부 다 나눔폰트로 변경해 버린다.

> PDF 변환 기능을 사용하지 않는다면, 필수는 아니다.  아래의 폰트 변경 방법에 따라 변경할 수 있다.

폰트 이름에 "바탕" "명조" 따위가 들어간다면, 나눔명조로 변경하고,

"고딕" "굴림" 따위가 들어간다면, 나눔고딕으로 변경한다.

폰트에 따라 문자의 width 가 달라져서 발생하는 여러 문제들이 있을 수 있다.

## 3. 프로그래머를 위하여

### 3.1. hwpx.html 과 odt.html 에 대해서

hwpx.html 과 odt.html 는 예제이므로
누구든 저작권에 구애받지 않고,
자유롭게 변경해서 사용하거나 다시 배포할 수 있다.

### 3.2. 폰트 변경 방법

폰트와 관련된 것은 다음과 같다.

- odt.html 혹은 hwpx.html 의 css
- GrahaConverter.prototype.defaultFonts : PDF 변환기능에서만 사용
- GrahaConverterUtility.defaultFontFamilyConverter

GrahaConverter.prototype.defaultFonts 및 GrahaConverterUtility.defaultFontFamilyConverter 는
odt.html 이나 hwpx.html 과 같이 단독 실행형 GrahaViewer 에서는 다음과 같이 
```GrahaViewer.ready``` 함수의 opts 파라미터로 넘길 수 있다.
처리한다.

```javascript
var opts = {
	fonts: GrahaViewerFontPlugin.fonts(),
	fontFamilyConverter: GrahaViewerFontPlugin.fontFamilyConverter,
	defaultFontFamily: "Nanum Myeongjo"
};
GrahaViewer.ready(opts);
```

```fonts: GrahaViewerFontPlugin.fonts()``` 는 PDF 로 변환 할 때, jsPDF 에 공급되는 TrueType 폰트의 배열이며,
GrahaConverter.prototype.defaultFonts 함수를 참조하여 작성한다.

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
```GrahaConverterUtility.defaultFontFamilyConverter``` 함수를 참조하여 작성한다.

> 파라미터로 넘어가는 것은 함수다.

```defaultFontFamily: "Nanum Myeongjo"``` 은 미리 정의해 놓은 폰트 외에 다른 font-family 가 들어온 경우에 사용한다.

### 3.3. 웹페이지내에서 GrahaViewer 를 올리는 방법

먼저 다음과 같이 의존성 있는 외부 파일과 GrahaViewer 파일들을 html 에 추가한다.

```html
<link rel="preconnect" href="//fonts.googleapis.com" />
<link rel="preconnect" href="//fonts.gstatic.com" crossorigin="anonymous" />
<style src="//fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&amp;amp;family=Nanum+Myeongjo:wght@400;700;800&amp;amp;display=swap" />
<script src="//cdn.jsdelivr.net/npm/bluebird@3.3.4/js/browser/bluebird.min.js" />
<script src="//cdn.jsdelivr.net/npm/has-font@1.0.2/hasfont.min.js" />
<script src="//cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js" />
<script src="//cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js" />
<script src="//cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js" />
<script src="//cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/polyfills.umd.js" />
<script src="//cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js" />
<script src="//cdn.jsdelivr.net/npm/jszip-utils@0.1.0/dist/jszip-utils.min.js" />

<style src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaViewer.css" />
<style src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaViewer.print.css" media="print" />
<script src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaHtmlConverterWrapper.js" />
<script src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaCSSProperties.js" />
<script src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaDummyElement.js" />
<script src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaOdtPageSplitterUtility.js" />
<script src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaHwpXPageSplitter.js" />
<script src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaConverterUtility.js" />
<script src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaOdtTableBorderCollapser.js" />
<script src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaHwpX2HtmlConverter.js" />
<script src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaOdt2HtmlConverter.js" />
<script src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaOdtPageSplitter.js" />
<script src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaConverter.js" />
<script src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaMenu.js" />
<script src="//graha.kr/static-contents/client_lib/GrahaViewer/lastest/GrahaViewer.js" />
```

다음과 같이 ```GrahaViewer.convert``` 를 호출한다.

```javascript
GrahaViewer.convert(source);
```

source 는 string type 의 url 이거나, blob 이거나 file 이다.

폰트를 변경하기 위해서는 다음과 같이 처리한다.

```javascript
var opts = {
	fonts: GrahaViewerFontPlugin.fonts(),
	fontFamilyConverter: GrahaViewerFontPlugin.fontFamilyConverter,
	defaultFontFamily: "Nanum Myeongjo"
};
GrahaViewer.convert(source, opts);
```

### 3.4. 메뉴 변경 방법

#### 3.4.1. 메뉴를 완전히 새롭게 작성하는 방법

GrahaMenu.js 의 GrahaMenus.default() 함수를 참조하여 작성한다.

#### 3.4.2. title 변경 방법

GrahaViewer 의 default 메뉴에서 title 과 같이 일부 속성을 변경한 메뉴를 적용한다면 다음과 같은 형태이다.

```javascript
var menus = GrahaMenus.default();
var list = menus.find("download");
if(list != null && Array.isArray(list) && list.length > 0) {
	for(var i = 0; i < list.length; i++) {
		list[i].setTitle("다운로드");
	}
}

var opts = null;
GrahaViewer.convert(source, opts, menus);
```

odt.html 이나 hwpx.html 과 같이 단독 실행형 GrahaViewer 에서는 다음과 같이 
``GrahaViewer.ready``` 함수의 menus 파라미터로 넘길 수 있다.

```javascript
var opts = null;
GrahaViewer.ready(opts, menus);
```

#### 3.4.3. 단축키 변경 방법

현재 버전의 GrahaViewer 는 Esc 키를 누르면 close 메뉴가 실행된다.

만약 print 에 Alt + p 단축키를 추가하고 싶다면, 다음과 같이 한다.

```javascript
var menus = GrahaMenus.default();
var list = menus.find("print");
if(list != null && Array.isArray(list) && list.length > 0) {
	for(var i = 0; i < list.length; i++) {
		list[i].setShortcut("KeyP");
		list[i].setModifier("alt");
	}
}
var opts = null;
GrahaViewer.convert(source, opts, menus);
```

> 위의 경우에 action 이 print 인 menu 는 1개만 있어야 할 것이다.

modifier 는 소문자 alt, ctrl, shift, meta 중 하나이다.

## 4. 남겨진 일들

### 4.1. 6개월 이내에는 처리할 것들 (처리가 완료되면 0.8.0.0 으로 release)

- [ ] 여러 개의 hwpx 파일 혹은 여러 개의 odt 파일을 일괄 변환할 수 있도록 개선
	- blob 으로부터 변환하는 경우에만 지원
	- blob 배열로 입력받고, 다운로드는 압축 한 후에...

- [ ] ```<hp:autoNum numType="TOTAL_PAGE" num="1">``` 처리
	- ```<hp:autoNum numType="PAGE" num="1">``` 는 각 페이지가 끝날 때 처리하고 있으나,
	- TOTAL_PAGE 는 ```GrahaHwpX2HtmlConverter.prototype.sections``` 가 끝날 때 처리해야 하는 것으로 생각됨. 
	- "여러 개의 hwpx 파일~~~" 이후에 처리 예정

### 4.2. 1년 이내에는 처리할 것으로 기대되는 것들 (처리가 완료되면 0.9.0.0 으로 release)

- [ ] ```<hp:rect>```
	- hwpx
	- odt 는 div 로 구현함
	- ```<hp:line>``` 등 다른 것들은 구현하지 않을 계획

- [ ] ```<hp:pic>```
	- hwpx
	- odt 는 구현함

### 4.3. 1년이 지나도 처리하지 않을 가능성이 높은 것들
 
- [ ] hwpx 파일 내에서 페이지 크기나 가로/세로가 다르게 정의된 경우
	- [한/글]에서 메뉴 > 쪽 > 구역 나누기(Alt + Shift + Enter) 를 하면, 각 구역마다 편집용지의 크기나 방향, 머리말/꼬리말을 다르게 설정할 수 있다.

### 4.4. 처리 할 생각이 없는 것들

- [ ] hwpx : 양쪽 어울림
	- [한/글] 에서 "표/그림"이 어울림이라면 기본값이 "양쪽"이다.
	- html/css 는 양쪽 어울림을 지원하지 않으므로 페이지 넘김까지 고려하여 이를 처리하는 것은 구조적인 문제까지 다시 검토해야 한다.

- [ ] hwpx : "text - 표 - text" 가 있고, 표의 세로 위치가 글자의 높이보다 큰 값인 경우

- [ ] hwp 지원
	- 서버 쪽에서 [hwp2hwpx](https://github.com/neolord0/hwp2hwpx) 를 이용해서, 간단하게 hwp 파일을 hwpx 파일로 변환할 수 있기 때문에 구현하지 않는다.

### 4.5. 완료된 것들

- [x] hwpx.html 과 odt.html 에서 font cdn 에 preconnect 하도록 변경
	- 0.6.0.1 에서 처리 완료

- [x] hwpx 에서 ```<font>``` 의 css 가 그 아래의 ```<table>``` 에 적용되지 않도록 수정
	- 0.6.0.1 에서 처리 완료

- [x] hwpx 에서 color 값이 html 의 그것과 다르다.
	- ```#0000FF``` : [한/글]에서는 red 로 표시
	- ```#FF0000``` : [한/글]에서는 blue 로 표시
	- [한/글] 은 color 값을 BGR 로 저장하는 것으로 생각됨 (R : 233, G : 174, B : 42 가 #2BAEE9으로 저장됨)
	- ```#FFFFFFFF``` 혹은 ```#FF000000``` 와 같은 것들은,  RGBA 와 유사한 BGRA 라고 가정하고 처리하였음(테스트 X).
	- 0.6.0.1 에서 처리 완료

- [x] font-stretch (장평) 가 지원되는지 여부를 확인하여 관련 코드를 정리할 필요가 있음
	- 기본 폰트 cdn (```//cdn.jsdelivr.net/font-nanum/1.0/nanumgothic/nanumgothic.css```) 의 font 는 font-stretch 를 지원하지 않음.
	- 폰트 cdn 을 ```//fonts.googleapis.com/css2``` 로 시작하는 것으로 변경하면, font-stretch (장평) 가 처리되는 것으로 보임.
	- 장평에 따라 font-size 를 줄이는 코드는 주석으로 막았음.
	- PDF 변환할 때 사용하는 TrueType 도 같이 변경해야 함.
	- 0.6.0.1 에서 처리 완료

- [x] hwpx.html 혹은 odt.html 없이 실행할 수 있도록 변경
	- ```GrahaConverter.prototype.ready``` 함수 같은 것을 추가해서...