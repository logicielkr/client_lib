# History of GrahaOdt2PdfConverter

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
