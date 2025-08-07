# History of GrahaViewer

## 1. 0.5

### 1.1. 0.5.0.0

- 배포 시작

### 1.2. 0.5.0.1

- thead 와 tbody 에 대응하는 것들 처리(tbody 나 thead 태그는 생략)
- col 의 넓이를 자동으로 결정할 수 있도록 변경
- style.xml 의 office:automatic-styles 도 처리하도록 변경

### 1.3. 0.5.0.2

- 화면의 width 가 페이지의 width 보다 작은 경우 scale을  적용해서 자동으로 축소한다.
- convertToPx 에 in, m, pt, points, px 추가(종래에는 cm 와 mm 만 구현되어 있었으나, getUnit 에 맞추어 구현)
- header 나 footer 가 여러 개 정의되어 있는 odt 파일은 Split 과정에서 무한 루프에 빠질 가능성이 있으므로, 경고 메시지 띄우고 Split 나 PDF 변환을 할 수 없도록 변경
- 기능상의 변화나 버그의 수정없이 일부 함수의 구현을 GrahaOdt2PdfConverterUtility.js 로 이동함(버전을 변경하지 않음)

### 1.3. 0.5.0.3

- GrahaOdtTableBorderCollapser 버그 수정
	- Firefox 115.21.0 esr 에서 border 가 반영되지 않는 버그 수정 (border 를 한번에 반영하도록 변경)
	- 오른쪽 td 가 없는 경우 오른쪽 위에서 rowspan 된 것을 찾는 방식으로 개선
- GrahaOdt2HtmlConverter 에서 ```div#GrahaOdt2HtmlConverterWrapper``` 를 document.body 에 먼저 추가하는 것으로 변경
	- ```div#GrahaOdt2HtmlConverterWrapper``` 가 렌더링 되지 않았다면, data-anchor-type 이 page 인 것들이 자리를 제대로 잡지 못하는 버그가 있다,
- 기능상의 변화나 버그의 수정없이 일부 함수의 구현을 GrahaOdtPageSplitterUtility.js 로 이동함.
- heightForParent 함수가 td 대신 tr 의 height 를 리턴하는 경우(IE 11 에서만 발생하는 것으로 추정) td 의 padding-top 과 padding-bottom 을 공제하도록 변경(버그 fix 이지만, IE 11 관련이므로, 버전을 변경하지 않음)
- window.devicePixelRatio 를 1.25 로 고정함(잠재적인 것이므로, 버전을 변경하지 않음)
- 웹브라우저의 인쇄 (Ctrl + P) 미리보기를 위한 몇 가지 작업
- 페이지를 분리 하면서 table 의 border 를 복사 할 때 rowspan 이 적용되어 있는 cell 의 border 는 복사하지 못하는 버그 수정

### 1.4. 0.5.0.4

- GrahaOdtPageSplitterUtility 버그 수정
	- Table 을 잘라낼 때, border 일부를 복사하지 못하는 버그 수정
- GrahaOdtTableBorderCollapser 보완
	- collapse 함수에서 Table 을 파라미터로 받을 수 있도록 개선
	
## 2. 0.6

### 2.1. 0.6.0.0

- Viewer 기능을 중심으로 변경
- hwpx 지원 추가
