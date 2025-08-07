# GrahaOdt2PdfConverter

## 1. about

### 1.1. 소개 

GrahaOdt2PdfConverter 는 
[Apache OpenOffice](https://www.openoffice.org/) Text 
혹은 [LibreOffice](https://www.libreoffice.org/) Text 로 
작성한 문서(.odt)를
html 
혹은 pdf 로 변환하는 
실험적인 라이브러리이다.

필자가 만들어서 배포중인 [GrahaReporter.js](https://github.com/logicielkr/client_lib/tree/master/reporter/0.5.0.2)
혹은 GrahaReporter.js 의
Java 버전인 [GrahaExtension](https://github.com/logicielkr/GrahaExtension) 의 구성요소 중 하나인 GrahaReporterImpl 로
생성한 odt 파일을
HTML 로 변환하여 미리보기 기능을 제공하거나
HTML 을 다시 PDF 로 변환하여 출력 기능을 제공 하기 위해 만들었다.

### 1.2. 다운로드

https://github.com/logicielkr/client_lib/tree/master/odt2pdf/0.5.0.0

### 1.3. 호환성

다음의 환경에서 테스트했다.

- Firefox 최신버전
- Google Chrome 최신버전
- IE 11

> IE 11 에서는
> Javascript 오류가 나지는 않지만,
> 매우 느리고([html2canvas.min.js](//cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js) 때문이라고 생각한다),
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

1. [odt.html](//graha.kr/static-contents/client_lib/odt2pdf/lastest/odt.html) 을 웹브라우저에서 불러온다.

2. 상단의 "찾아보기"를 클릭해서 odt 파일을 선택하거나, odt 파일 1개를 드래그 앤 드롭(Drag and Drop) 하면, HTML 로 변환한다.

3. 여러 페이지라면 Split 를 클릭해서 페이지를 분리한다.

4. PDF 를 클릭하면, PDF 로 변환한다.

> 서버에 upload 하지 않으므로, 이에 대한 걱정은 필요 없고,
> 의심을 지울 수 없다면,
> odt.html 파일 등을 다운로드 받아서 사용하되,
> ```file://``` 이라면,
> ```//``` 로 시작하는 경로들은 ```https://``` 로 변경하여 사용한다.

### 2.2. Notice

1. GrahaOdt2PdfConverter 는 범용으로 만든 것이 아니다.

	[Apache OpenOffice](https://www.openoffice.org/) 나 [LibreOffice](https://www.libreoffice.org/) 의 PDF 변환기능과 비교하면 안된다.

	GrahaOdt2PdfConverter는
	여차하면 odt 파일을 GrahaOdt2PdfConverter 에 맞추어 수정할 수도 있다는 전제하에 만들었다.
	
	[odt.html](//graha.kr/static-contents/client_lib/odt2pdf/lastest/odt.html) 에서 odt 파일을 변환해 보고 쓸만하면 사용하기로 한다.
	
	> odt 파일을 pdf 로 변환하는 것은
	> 서버에 [Apache OpenOffice](https://www.openoffice.org/) 나 [LibreOffice](https://www.libreoffice.org/) 를 설치하고,
	> JODConverter 를 이용하는 다른 여타의 방법과 비교할 수 없는 확실한 방법이 있으며, 
	> 이에 대해서는 필자가 장황하게 설명한 [Office Document to PDF using JODConverter](https://github.com/logicielkr/misc/tree/master/Java_Source_Code/Office_Document_to_PDF_using_JODConverter) 를 참조하고,
	> [GrahaExtension](https://github.com/logicielkr/GrahaExtension) 의 구성요소 중 하나인 GrahaReporterImpl 과 함께 사용한다면, odt 파일과 pdf 파일을 모두 자동화 할 수 있다.

2. 한글 서체는 나눔폰트를 사용한다.
	
	나눔폰트가 아닌 것들은 전부 다 나눔폰트로 변경해 버린다.
	
	> 이렇게 하지 않으면, PDF 로 변환했을 때, 한글이 깨진다.
	
	폰트 이름에 "바탕" "명조" 따위가 들어간다면, 나눔명조로 변경하고,
	"고딕" "굴림" 따위가 들어간다면, 나눔고딕으로 변경한다.
	
	> 필자가 나눔폰트를 특별히 좋아하는 것까지는 아니지만,
	> 프로그램적으로 ttf 파일을 PDF 에 포함시키는 것에 대한 별도의 License 를 요구하지 않으면서,
	> ttf 파일을 지원하는 CDN 이 있는 한글 폰트를 찾기가 쉽지 않았다.

3. 경우에 따라서 쓸만 할 수도 있다.

	운영환경에서 사용중이고,
	신경써서 구현한 것들도 있다.

## 3. 구현에 대한 넋두리

### 3.1. 시작에 대해서

확장자 .odt 나 .hwpx 파일의 HTML Viewer 를 찾다가,
오래 전에 개발이 멈춰진 것으로 보이는 [WebODF](https://webodf.org/) 를 우연히 발견했는데,
Table 의 rowspan 과 colspan 을 지원하지 않는 문제가 있었다.

처음에는 [WebODF](https://webodf.org/) 소스를 적당히 수정해서,
다른 사람의 저장소에 기웃거릴 생각이었지만,
css 의 display 속성을 이용해서 ```<td>``` 처럼 보이게 하는 방식은
rowspan 과 colspan 을 사용할 수 없고,
이를 해결하기 위해서는
대규모 변경이 필요한데,
필자의 일천한 Javascript 기술을 감안하면 대규모 변경은 물론이고 소스를 적당히 수정하는 일도 불가능해 보였다.

### 3.2. 필자가 사용하는 .odt 파일만을 대상으로 적당히 만들었다.

처음부터 모든 것을 구현할 생각이 없었다.

필자가 평소 사용하지 않는 명세는 관심조차 없었다.

HTML 에서 지원하지 않는 OpenDocument 명세를 사용했다면,
그런 것들은 당연히 지원하지 않는다.

### 3.3. 테이블의 rowspan / colspan 을 지원한다.

결국 이것 때문에 GrahaOdt2PdfConverter 를 만들었지만,
경우에 따라서 근사한 결과물을 얻을 수도 있다.

### 3.4. ```<draw:>``` 쪽은 구현하지 않았다.

```<draw:>``` 이쪽은 ```<draw:rect>``` 만 구현하였으나,
(착오로) svg 가 아니라 div 로 구현하였으므로 완전치 않고,
```<draw:>``` 의 나머지 것들은 전혀 구현하지 않았다.

### 3.5. odt 파일은 [Apache OpenOffice](https://www.openoffice.org/) 와 [LibreOffice](https://www.libreoffice.org/) 에서도 서로 다르게 보이는 경우도 많다.

[Apache OpenOffice](https://www.openoffice.org/) 에서 여백이 더 커지는 경향이 있다고 생각한다.

페이지 넘김이 발생하는 곳도 다를 수 밖에 없다.

심지어 구성요소 중 일부가 이상한 곳에 배치되는 경우도 있었다.

GrahaOdt2PdfConverter 가 더 정확한 결과를 보장 하기는 힘들 것이고,
여백이나 페이지 넘김이 발생하는 곳은
웹브라우저에 따라 약간씩 달라지기도 한다.

부연하자면,
[Apache OpenOffice](https://www.openoffice.org/) 는 거의 사용하지 않는 것으로 생각되지만,
그냥 OpenOffice 였던 시절부터
[Apache OpenOffice](https://www.openoffice.org/) 를 사용해왔던 사용자들은
관성의 법칙을 따르는 경향이 있다.

[Apache OpenOffice](https://www.openoffice.org/) 와 [LibreOffice](https://www.libreoffice.org/) 에서
완전히 동일한 레이아웃을 만들겠다는 생각은 버려야 한다.

[LibreOffice](https://www.libreoffice.org/) 에서는 1 페이지이지만,
아래 쪽에 여백이 거의 없다면, [Apache OpenOffice](https://www.openoffice.org/) 에서는 페이지 넘김이 발생한다.

빈도가 적지만,
[Apache OpenOffice](https://www.openoffice.org/) 에서는 제대로 자리를 잡았다고 생각되는 어떤 구성요소들이
[LibreOffice](https://www.libreoffice.org/) 에서는 엉뚱한 곳에 배치되는 경우도 있었다.

[LibreOffice](https://www.libreoffice.org/) 는 빠르게 개선되고 있기 때문에 버전에 따라 다소간의 차이도 있다.

### 3.6. 문자로 취급되지 않는 이미지나 테이블

문자로 취급되지 않는 이미지나 테이블도 적당히 처리 했지만,
다소간의 버그가 있을 수 있다.

> ```text:anchor-type``` 이 ```paragraph``` 나 ```page``` 인 것들이 있던데(문자로 취급되는 것들은 ```as-char```),
> ```svg:x``` 와 ```svg:y``` 속성으로 ```paragraph``` 혹은 ```page``` 내에서 상대적인 위치를 지정하는 것들이다.

이미지가 ```<td>``` 안에 있는 경우,
[Apache OpenOffice](https://www.openoffice.org/) 나 [LibreOffice](https://www.libreoffice.org/)는
```<td>``` 의 height 를 보존하지만,
웹브라우저는
이미지의 height가 ```<td>``` 의 height 보다 크다면, ```<td>``` 의 height 를 알아서 키워버린다.

문자로 취급되지 않는 이미지나 테이블은
[Apache OpenOffice](https://www.openoffice.org/) 나 [LibreOffice](https://www.libreoffice.org/)에서는
css 의 ```position:relative``` 와 top/left 를 지정한 것과 유사하지만,
그 위치에 자리를 차지하고,
그 뒤에 오는 ```<p>``` 와의 관계에서는 ```float:left``` 혹은 ```float:right``` 로 배치된다.

> HTML로 변환하면서 이에 대한 아무런 처리도 하지 않았다면,
> 문자로 취급되지 않는 이미지나 테이블은 그 뒤의 ```<p>``` 와 겹쳐져서 보이게 된다.
> 그 뒤에 오는 ```<p>``` 가 테이블이나 이미지 보다 위에 배치되는 것을 감안하면,
> ```margin-left``` 나 ```margin-top``` 으로 대체할 성질의 것도 아니다.

HTML 에서는 오른쪽이나 왼쪽에 남아 있는 여백이 공백(```&nbsp;```) 1개 정도가 간신히 들어갈 정도라면,
그 아래쪽에서 공백(```&nbsp;```) 이 2개 이상 있는 ```<p>``` 부터는 옆으로 배치하지 않고 아래 쪽으로 떨어뜨리게 된다.

[Apache OpenOffice](https://www.openoffice.org/) 나 [LibreOffice](https://www.libreoffice.org/) 는
```<p>``` 가 여러 개의 공백으로만 구성되어 있다면, 마치 1개의 공백인 것처럼 처리해 버려서,
HTML 의 그것과 처리가 다르다.

이런 부분들은
OpenDocument 명세에도 처리 방법에 대한 명확한 기술이 없고,
필자가 가지고 있는 몇 개의 odt 파일만을 대상으로
[Apache OpenOffice](https://www.openoffice.org/) 와 [LibreOffice](https://www.libreoffice.org/) 로 열었을 때와 비교해 가면서
최대한 비슷하게 구현했으므로,
정확하지 않을 가능성이 있다.

```text:anchor-type``` 이 ```page``` 인 것들은 2 페이지부터는 위치를 정확히 잡지 못한다.

GrahaOdtPageSplitter.js 로 페이지를 먼저 분리한 다음에 처리하면 될 것으로 보이지만,
[Apache OpenOffice](https://www.openoffice.org/) 와 [LibreOffice](https://www.libreoffice.org/) 간에도
페이지 넘김이 발생하는 위치가 다르다는 것까지 감안하면
완벽한 처리는 쉽지 않은 것으로 생각된다.

> [Apache OpenOffice](https://www.openoffice.org/) 와 [LibreOffice](https://www.libreoffice.org/) 사용자들은
> 마우스로 끄는 방법으로 어떤 구성요소의 정확한 위치를 잡기 때문인데,
> GrahaOdt2PdfConverter 를 필자와 같은 용도로 사용한다면,
> 이미지나 테이블을 문자로 취급되도록 .odt 파일 내부의 context.xml 파일을 잘 편집해서 사용하는 방법이 있고,
> ```text:anchor-type``` 를 ```as-char``` 로 변경하고, ```margin``` 따위로 정확한 위치를 잡으면 된다.

### 3.7. Table border

```border-width``` 값이 너무 작다면, PDF 로 변환했을 때,
```border-width``` 가 균일하게 보이지 않을 수 있다.

> 이런 문제를 확인하려면 PDF 를 Acrobat Reader 에서 열어봐야 하고,
> PDF.js 혹은 내부적으로 PDF.js 를 사용하는 웹브라우저 등 에서는
> ```border-width``` 가 약간 두껍지만 균일하게 보이기 때문에 이런 문제를 확인하기 어렵다.

border-collapse 스타일을 collapse 로 하면,
PDF 로 변환할 때 사용한 [jsPDF](//parall.ax/products/jspdf) 에서
border-width 중 일부를 2중으로 표시한다.

> PDF 변환은
> [jsPDF](//parall.ax/products/jspdf) 의 html 함수를 이용하는데,
> 내부적으로 HTML 을 [html2canvas](//html2canvas.hertzen.com/) 로 canvas 로 변환하고,
> 다시 canvas 를 PDF 로 변환하는 방식인데, 어느 쪽에서 border 를 그렇게 만드는지는 확인하지 않았다. 

이를 교정하기 위해 GrahaOdtTableBorderCollapser.js 를 만들었는데,
GrahaOdtTableBorderCollapser 는
```<td>``` 에 ```data-table-cell-index``` 속성 값이 있는 경우에만 사용할 수 있다.

> 범용으로 사용할 수 없다는 취지이다.
> .odt 파일은 ```rowspan``` 이나 ```colspan``` 으로 없어진 자리에
> ```<td>``` 와 유사한 가상의 ```table:covered-table-cell``` 이라는 것이 있어서
> ```data-table-cell-index``` 계산이 용이하다.
> Javascript 로 ```<td>``` 의 ```colIndex``` 값을 얻을 수는 있지만, 
> ```colIndex``` 는 ```rowspan``` 이나 ```colspan``` 을 고려하지 않기 때문에
> ```colIndex``` 로 ```data-table-cell-index``` 를 대체할 수는 없다.

GrahaOdtTableBorderCollapser.js 는 구현이 정확하지 않을 수 있다.

[Apache OpenOffice](https://www.openoffice.org/) 는 Table 의 border-style 중 dotted 를 지원하지 않고,
.odt 파일 내에서는 ```dotted``` 로 명시되어 있지만,
화면에는 solid 로 표시된다.

> 비교적 최신의 [LibreOffice](https://www.libreoffice.org/) 는 ```dotted``` 를 지원하고 있다.

GrahaOdtTableBorderCollapser 에서는 ```border-style: dotted``` 를 solid 로 변경해 버리기 때문에,
```border-style: dotted``` 는 사용할 수 없다.

> 이건 향후에 옵션을 추가하는 방식으로 개선될 가능성이 있다.

```border-collapse: collapse``` 나 ```border-style: dotted``` 같은 것들이 발견되는 odt 파일들은
프로그램이 자동으로 생성한 것으로 생각된다.

### 3.8. 각주(footnote)는 지원하고, 미주(endnote)는 지원하지 않는다.

미주(endnote)는 아직 지원하지 않는다.  이건 추후에 지원할 계획도 있다.

GrahaOdtPageSplitter.js 에서 각주(footnote)를 페이지마다 적당히 잘라서 집어 넣는다.

각주(footnote)는 [Apache OpenOffice](https://www.openoffice.org/) 나 [LibreOffice](https://www.libreoffice.org/) 와 다른 페이지에 붙어 있을 수 있다.

### 3.9. 페이지 분리(GrahaOdtPageSplitter.js) 에 대해서

```fo:break-before``` 는 처리하지만,
```text:soft-page-break``` 는 무시한다.

> ```fo:break-before``` 는 사용자가 명시적으로 페이지를 나눈 것이고,
> ```text:soft-page-break``` [Apache OpenOffice](https://www.openoffice.org/) 나 [LibreOffice](https://www.libreoffice.org/) 가
> 자동으로 페이지를 나눈 곳을 표시해 둔 것이다.

```<p>``` 나 ```<td>``` 가 1줄이라고 평가된다면,
다음 페이지로 넘기지만,
2줄 이상이라고 평가된다면 ```<p>``` 나 ```<td>``` 를 중간에서 잘라서,
일부는 이전 페이지에, 나머지는 다음 페이지에 배치한다.

1개의 ```<p>``` 가 2개 이상의 ```<p>``` 로 분리되는 것이다.

```<p>``` 나 ```<td>``` 의 height 가 페이지에 남아 있는 여백보다 큰 경우,
무조건 다음 페이지에 배치하는 방법이 있을 수 있는데,
그렇게 하면 이전 페이지의 아래 쪽에 너무 많은 여백이 발생하고,
```<td>``` 의 경우 1 페이지를 초과하는 것도 있을 수 있기 때문에,
이를 분리하는 것은 불가피한 일이라고 생각한다.

1줄인지 평가하는 방법은
원래 ```<p>``` 의 ```outerHeight(true)``` 와
```white-space``` 를 ```nowrap``` 으로 변경한 복사본의 
```outerHeight(true)``` 를
비교하는 방식으로 한다.

### 3.10. ```text-justify: inter-character``` 에 대해서

[Apache OpenOffice](https://www.openoffice.org/) 나 [LibreOffice](https://www.libreoffice.org/) 에서는
```style:justify-single-word``` 가 ```true``` 인 경우,
```text-align: justify``` 를 처리 할 때,
글자를 기준으로 한다.

> 이건 ```<th>``` 성격의 ```<td>``` 에서 주로 사용되는데,
```text-align: justify``` 는 마지막 줄에는 적용되지 않으므로,
> 1줄인 경우에도 적용되게 하려면, ```text-align-last: justify``` 도 같이 설정해야 한다.

css 에서도 이와 유사한
```text-justify: inter-character``` 가 있지만,
불행하게도 Firefox 만 지원하고 있다.

> [text-justify](https://developer.mozilla.org/en-US/docs/Web/CSS/text-justify) 를 참조한다.

GrahaOdt2PdfConverter 에는 Firefox 외의 다른 웹브라우저를 위해서
글자마다 ```<span>&nbsp;</span>``` 를 집어 넣고,
```<span>``` 의 ```word-spacing``` 을 ```font-size``` 의 1/3 로 처리한다.

> ```&nbsp;``` (```U+00A0```) 의 width 는 한글의 1/4(40/160), 영문 대문자의 1/3(40/116) 이고, 영문 소문자의 1/2 보다는 약간 큰 값(40/71 가량)인데,
> ```font-kerning``` 에 따라 상대적으로 더 큰 값이 되기도 한다.

```word-spacing``` 이 너무 큰 값이라면, 줄바꿈이 발생하고,
반대로 너무 작은 값이라면 웹브라우저에 따라 오른 쪽 여백에서 문제가 발생하기도 하는데,
이와 관련해서 다소간의 버그가 있을 수 있다.

### 3.11. HTML 로 변경한 것을 document.body 에 추가하고 나서 처리되는 것들

ODT 파일을 HTML 로 변경한 이후에, 화면에 HTML 을 추가하고 나서 처리되는 것들이 있다.

- ```text-justify: inter-character```
- 문자로 취급되지 않는 이미지나 테이블
- Table border
- 페이지 분리(GrahaOdtPageSplitter.js) 
- 그 외의 몇 가지 것들

이런 것들은 순차적으로 처리된다고 가정했고,
만일을 위해서 ```window.setTimeout``` 를 이용했는데,
웹브라우저에서 구체적인 상황에 따라
처리 순서가 뒤바뀌게 되면 문제가 발생할 수 있다.

> loop 를 돌리지 않는 한,
> 앞서서 처리한 변경사항이 화면에 반영이 완료되었다는 정확한 event 를 받는 것을 불가능하다고 생각한다.

### 3.12. 한글 폰트와 관련된 이슈

필자가 [jsPDF 사용법](//logiciel.kr/graha/article/detail.html?contents_id=3257&article_id=3286) 에서
이미 장황하게 설명하였지만,
웹브라우저의 화면에 한글 폰트가 완전히게 표시되기 전에 PDF 변환이 이루어지면,
한글이 깨지는 불상사까지는 아니더라도,
글자의 크기나 간격 같은 것들이 맞지 않아서 발생하는 여러가지 문제가 발생한다.

웹페이지가 열리고 나서
웹브라우저가 한글 폰트를 불러올 충분한 시간이 지난 다음이라면
이런 문제가 발생할 가능성이 높지는 않고,
그런 이유로 [odt.html](//graha.kr/static-contents/client_lib/odt2pdf/lastest/odt.html) 에서는 이런 문제가 발생할 가능성은 거의 없을 것이다.

문제가 발생한 가능성이 있는 것은
```$(window).on();``` 이나 ```$(document).ready();``` 내에서
PDF 변환까지 한꺼번에 이루어지는 상황일 것이다. 

> 필자의 환경에서는 이와 같은 문제가 발생하지 않았지만,
> 가능성을 배제할 수 없다고 생각한다.

### 3.13. 글자 크기, 줄 간격과 관련 된 것들

```line-height``` 를 ```%``` 로 했다면,
```line-height``` 의 기준이 되는 ```font-size``` 는
```<p>``` 를 둘어싸고 있는 ```<td>``` 와 같은 것에서 가져와서 사용한다.

.odt 에서는 ```<text:p>``` 의
line-height 는 ```<style:paragraph-properties>``` 에,
font-size 는 ```<style:text-properties>``` 에 정의되어 있어서,
```<p>``` 에 한 번에 정의하면 될 것처럼 보이지만,
HTML 로 변환할 때에는 다음과 같이 처리해야 한다.

```html
<p style="line-height:150%;"><font style="font-size:14pt;"></font></p>
```

따라서 ```<style:text-properties>``` 에 정의된 것들은 ```<font>``` 에
```<style:paragraph-properties>``` 에 정의된 것들은 ```<p>``` 에 각각 대응하는 style 로 변환했어야 했다고 생각한다.

> 이 부분은 구현이 거의 다 된 이후에야 깨달은 것이어서 ```<p>``` 와 ```<font>``` 가 같은 style 을 사용하는 꼼수로 정리했다.

글자 크기와 관련해서는 특별히 숨겨진 것이 있는데,
글자 크기가 ```2pt``` 라면, 어차피 사람이 볼수 없을 것이기에,
```font-size: 0.5px``` 로 변경하고,
legacy Chrome 을 위해 ```zoom: 0.05;``` 로 변경하도록 했다.

[Apache OpenOffice](https://www.openoffice.org/) 나 [LibreOffice](https://www.libreoffice.org/) 는
```style:font-size-asian``` 이나 ```style:font-family-asian``` 과 같이 asian 문자를 특별히 대접해 주고 있다.

UI 에서도 asian 에 대해서 글자체나 글자크기를 다르게 지정할 수 있다.

이런 것들은 CSS 에서도 ```lang=""```
혹은 ```@font-face``` 의 ```unicode-range:``` 같은 것들을
어떻게 잘 조합하다 보면 구현할 수 있을 것으로 생각되었지만,
GrahaOdt2PdfConverter 에서는 이를 구현하지 않았고,
asian 을 우선 순위로 해서 1개만 적용되도록 하였다.

> 사용자가
> [Apache OpenOffice](https://www.openoffice.org/) 나 [LibreOffice](https://www.libreoffice.org/) 에서
> 특별한 의도를 가지고 이와 같은 기능을 사용할 가능성은 높지 않다고 생각한다.

### 3.14. scale 변경

모바일과 같이 화면의 width 가 A4 나 Letter 보다 작은 경우 
scale 을 변경하는 방법으로 화면에 끼워 맞추는 기능은
다음과 같이 아직 구현이 완전하지 않은 부분이 있어서 추후에 보완하여 완성할 예정이다.

- 아래 쪽의 매우 큰 여백을 없애 버려야 한다.
- border 가 사라지는 현상이 있음.

border 를 사라지지 않게 하려면,
```border-width``` 값을 임의로 키워야 하는데,
다음 중 1개의 방법을 선택해야 함.

- border 가 사라지는 현상을 개선하지 않음.
- PDF 변환 자체를 막아버리고, HTML Viewer 기능만 제공함.
- PDF 로 변환할 때, ```border-width``` 값을 원래 값으로 다시 변경 한 후에 처리

### 3.15. IE 11 에서 알려진 버그

IE 11 에서 버그를 확인했지만,
개선할 생각이 없는 버그들의 목록이다.

1. ```text-align: start``` 는 처리되지 않는다.

	```style:parent-style-name``` 에서 ```text-align: center``` 가 정의된 경우에 발생하는데,
	```style:style-name``` 에서 정의된 ```text-align: start``` 는 css 구문 오류가 되고,
	구문 오류가 아니라면 무시되었을
	```style:parent-style-name``` 의 ```text-align: center``` 살아나서
	결과적으로 center 정렬이 되는 경우가 있는데,
	빈도가 매우 많지는 않은 것으로 생각된다.