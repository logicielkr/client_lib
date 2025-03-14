# GrahaReporter.js

##	1. about

###		1.1. 소개 

한/글, Microsoft Word, OpenOffice(LibreOffice) 등으로 작성한 문서를 기반으로 만든 Template 으로부터
hwpx, oft, docx 등의 문서파일을 생성하기 위한 Javascript 라이브러리이다. 

문서 파일이
zip 으로 압축되어 있고,
압축파일 내부에는 xml 등 text 기반의 파일로 구성되어 있으면 되는데,
대표적으로 다음과 같은 것들이다.

- [개방형문서 형식(Open Document Format for Office Applications, ODF)](https://ko.wikipedia.org/wiki/%EC%98%A4%ED%94%88%EB%8F%84%ED%81%90%EB%A8%BC%ED%8A%B8)
- [오피스 오픈 XML(Office Open XML, OOXML, 오픈XML)](https://ko.wikipedia.org/wiki/%EC%98%A4%ED%94%BC%EC%8A%A4_%EC%98%A4%ED%94%88_XML)
- [한/글 표준 문서 형식(hwpx)](https://www.hancom.com/board/csnoticeView.do?artcl_seq=10903)

###		1.2. 다운로드

https://github.com/logicielkr/client_lib/tree/master/reporter/0.5.0.3

###		1.3. 호환성

이 라이브러리는 다음의 환경에서 테스트했다.

- Firefox 최신버전
- Google Chrome 최신버전
- Internet Explorer 11

###		1.4. 의존성

jquery, jszip, iconv-lite 에 의존하며, cdn 은 다음과 같다.

- https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
- https://cdn.jsdelivr.net/gh/jcubic/static@master/js/iconv.js
- https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
- https://cdn.jsdelivr.net/npm/jszip-utils@0.1.0/dist/jszip-utils.min.js

> iconv-lite 는
> 파일이름을 EUC-KR (MS949) 로 하기 위한 것으로
> 오래된 Windows O/S (7 이하) 에서만 필요하다.

##	2. GrahaReporter.js 사용방법

###		2.1. 파일이 1개인 경우

```javascript
var dataUrl = "report.xml";
GrahaReporter.report(
	{
		dataUrl: dataUrl,
		entries: [
			{
				templateUrl: "template.odft",
				fileName:"result.odt",
				mimeType:"application/vnd.oasis.opendocument.text"
			}
		]
	}
);
```

혹은 다음과 같이 여러 개의 파라미터로 GrahaReporter.create 함수를 호출 할 수도 있다.

> GrahaReporter.create 함수는 이전 버전과의 호환성을 위해. 부득이하게 제공하는 함수이므로 이후의 버전에서 예고없이 삭제될 수도 있다.

```javascript
var dataUrl = "report.xml";
GrahaReporter.create(
	dataUrl,
	[
		{
			templateUrl: "template.odft",
			fileName:"result.odt",
			mimeType:"application/vnd.oasis.opendocument.text"
		}
	]
);
```

> 함수의 이름이 각각 GrahaReporter.report 와 GrahaReporter.create 로 다르다는 것에 유의한다.

###		2.2. template.odft 작성요령

1. 한/글, OpenOffice(LibreOffice), Microsft Word 같은 프로그램으로 서식 파일을 작성하고(xslt 로 변경할 부분은 뭔가 글자를 채워 넣는 것을 권장함), 파일이름을 template.hwpx (혹은 odt, docx) 으로 한다.

> 한/글 로 서식파일을 만들 때는 한/글 만 지원하는 특수문자 는 사용하지 않기로 한다.

2. template.hwpx (혹은 odt, docx) 파일의 압축을 해제한다(Windows O/S 에서는 7-zip 이 편리하고, Linux 에서는 unzip 명령어를 사용할 수 있다).

3. GrahaReporter.js 가 변경 할 파일에 ".xslt" 확장자를 추가한다.

4. ".xslt" 파일을 xsl 형식으로 만들되, "report.xml" (dataUrl) 을 기준으로 한다.

> xml 형식은 파일들은 개행문자 없이 1줄로 저장되어 있는데, ```><``` 사이에 개행문자를 추가해서 편집한다.

5. ".xslt" 파일의 편집이 완료되었다면, 다시 zip 으로 묶는다(templateUrl 과 파일이름이 같아야 한다).

####			2.2.1. hwpx 에서 편집할 파일

- Preview/PrvText.txt : Preview/PrvText.txt.xslt
- Contents/content.hpf : Contents/content.hpf.xslt
- Contents/section0.xml : Contents/section0.xml.xslt (section1 등 일련번호가 붙어 있는 파일 모두)

####			2.2.2. odt 에서 편집할 파일

- content.xml : content.xml.xslt
- meta.xml : meta.xml.xslt
- Thumbnails/thumbnail.png : 이미지 파일이므로 적당히 처리한다.

###		2.3. 파일이 여러 개인 경우

```javascript
var dataUrl = "report.xml";
var fileName = "result.zip";
var mimeType = "application/zip";
GrahaReporter.report(
	{
		dataUrl: dataUrl,
		entries: [
			{
				templateUrl: "template01.odft",
				fileName:"result01.odt"
			},
			{
				templateUrl: "template02.odft",
				fileName:"result02.odt"
			}
		],
		fileName: fileName,
		mimeType: mimeType
	}
);
```

혹은 다음과 같이 여러 개의 파라미터로 GrahaReporter.create 함수를 호출 할 수도 있다.

> GrahaReporter.create 함수는 이전 버전과의 호환성을 위해. 부득이하게 제공하는 함수이므로 이후의 버전에서 예고없이 삭제될 수도 있다.

```javascript
var dataUrl = "report.xml";
var fileName = "result.zip";
var mimeType = "application/zip";
GrahaReporter.create(
	dataUrl,
	[
		{
			templateUrl: "template01.odft",
			fileName:"result01.odt"
		},
		{
			templateUrl: "template02.odft",
			fileName:"result02.odt"
		}
	],
	fileName,
	mimeType
);
```

> 함수의 이름이 각각 GrahaReporter.report 와 GrahaReporter.create 로 다르다는 것에 유의한다.

###		2.4. dataUrl 로부터 서버에서 가져온 데이타의 무결성 검사

GrahaReporter.report 를 호출하면서 다음과 같이 check 함수를 추가한다.

```javascript
var dataUrl = "report.xml";
GrahaReporter.report(
	{
		dataUrl: dataUrl,
		entries: [
			{
				templateUrl: "template.odft",
				fileName:"result.odt",
				mimeType:"application/vnd.oasis.opendocument.text"
			}
		],
		check: function(data) {
			return true;
		}
	}
);
```

check 함수가 있고,
무결성 검사를 통과한 경우 true 를 리턴하고,
그렇지 않다면, alert 메시지를 띄우고 false 를 리턴한다.

> dataUrl 로 지정된 주소가 Graha 라이브러리가 생성한 XML 을 가리키고 있다면, 
> [parse_graha_xml_document.js](https://github.com/logicielkr/client_lib/blob/master/graha_base_library/0.5.0.4/parse_graha_xml_document.js) 로 Javascript Object 로 변환하여 검사 할 수 있다.

###		2.5. 문제해결

####			2.5.1. "Buffer.isBuffer is not a function"

GrahaReporter.js 를 호출하기 전에, JSZip 을 먼저 호출해서 사용한 경우에 발생할 수 있다.

JSZip 이 호출되기 전에 다음과 같은 코드가 호출되어야 한다.

```javascript
JSZip.support.nodebuffer = false;
```

iconv-lite 을 이용해서 파일이름을 EUC-KR 로 저장하려고 할 때,
JSZip 이 내부적으로 Buffer.isBuffer 함수(웹브라우저에서는 지원하지 않고, Node.js 에서만 지원)를 호출하는데,
Buffer.isBuffer 를 사용하지 않도록 해야 한다.

Windows 7 이하에서
zip 파일 내의 파일이름이 (UTF-8이 아니라) EUC-KR 등으로 인코딩되어 있어야 하는데(Windows 10 이상은 UTF-8 지원),
이를 처리하기 위함이다.

####			2.5.2. 원인을 알 수 없는 에러가 발생했습니다(001)

templateUrl 로 지정된 "template.odft" 등의 파일을 zip 으로 읽을 수 없을 경우 발생하는 에러이다.

- 404 등의 에러가 발생했거나,
- 압축파일이 아니거나 
- 압축파일이 zip 형식이 아니거나, 
- 압축파일이 깨진 경우

####			2.5.3. 원인을 알 수 없는 에러가 발생했습니다(002)

templateUrl 로 지정된 "template.odft" 파일 내의 파일들을 읽을 수 없을 때 발생하는 에러이다.

- 압축파일이 깨진 경우

####			2.5.4. 원인을 알 수 없는 에러가 발생했습니다(003)

templateUrl 로 지정된 "template.odft" 파일 내의 파일들을 읽을 수 없을 때 발생하는 에러이다.

- 압축파일이 깨진 경우

####			2.5.5. 파일을 다운로드 할 수 없습니다(004)

window.URL 혹은 window.webkitURL 을 모두 사용할 수 없는 경우메 발생한다.

blob 를 다운로드하는 부분에서 발생한다.

####			2.5.6. 파일을 다운로드 할 수 없습니다(005)

- fileName 파라미터 값이 들어오지 않았거나(가능성이 거의 없음),
- document.createElement("a") 로 생성한 객체의 download 속성이 없는 경우에 발생한다.

blob 를 다운로드하는 부분에서 발생한다.

####			2.5.7. 파일을 생성할 수 없습니다(006)

IE 에서 XSLT 에 실패했을 때 발생하는 에러이다.

- xslt 파일이 잘못되었거나,
- XSLT 를 위한 ActiveXObject(MSXML2.FreeThreadedDOMDocument.6.0 그리고 MSXML2.XSLTemplate.6.0) 를 초기화 하는데 실패한 경우

####			2.5.8. 파일을 생성할 수 없습니다(007)

XSLT 에 실패했을 때 발생하는 에러이다.

웹브라우저가 DOMParser 와 XSLTProcessor 를 지원하지 않을 가능성도 있지만, 
xslt 파일의 구문 오류일 가능성이 높다.

- 웹브라우저에서 xslt 파일을 불러오면, xml 형식 자체가 잘못되었는지 확인 할 수 있다.
- 웹브라우저에서 report.xml 에 xslt 파일을 stylesheet로 지정해서 불러오면, xsl 구문 오류를 확인 할 수 있다(서버에 올려서 테스트 해야 한다).
- xslt 파일내에서 속성값을 "{}" 안에 넣어서 처리하는 부분에서 에러가 발생한 경우 웹브라우저에서 오류 메시지를 확인 할 수 없다.

마지막은 Java 의 xslt 로 오류 메시지를 확인하거나,
우리가 많이 사용하는 비공학적 방식으로 해결해야 한다.

#####				2.5.8.1. 한/글(hwpx) 에서 자주 발생하는 사례

1. Preview/PrvText.txt 파일에 ```<``` 등 xsl 에서 허용되지 않는 문자가 있는 경우

	도표가 있는 경우 셀의 내용이 ```<>``` 안에 들어가는데 ```<``` 는 xsl 에서 허용되지 않는다.

	PrvText.txt 은 xslt 를 생략하고 적당히 빈 파일로 만들어도 되고,
	.xlst 파일로 변경하기 전에 문제가 생길 수 있는 문자들을 적당히 처리한다
	(예를 들어 ```<``` 를 ```&lt;``` 로 replace 한다).
	
####			2.5.9. 서버에서 데이타를 가져오지 못했습니다(008)

dataUrl 로 지정된 URL 에서 데이타를 가져오는 데 실패했다.

서버가 404, 403, 500 등의 에러를 반환했을 때 발생한다.

개발자도구 및 서버 로그를 통해 원인을 찾고 문제를 해결한다.

#####			2.5.9.1. 사례 1 

GrahaReporter.create 함수를 호출하면서,
1개의 Object 로 파라미터를 넘긴 경우(함수의 이름을 잘못 적은 경우),
404 에러가 발생한 URL 이 "[object Object]" 끝난다면,
함수의 이름을 GrahaReporter.report 으로 변경한다.

####			2.5.10. 템플릿 파일이 잘못되었습니다(009)

template.odft (혹은 template.hwpxt) 파일 내에 .xslt 확장자를 가진 파일(GrahaReporter.js 가 변경 할 파일)이 1개도 없다.

####			2.5.11. 데이타를 가져올 주소가 누락되었습니다(009)

dataUrl 파라미터가 null 이 입력되었다.

####			2.5.12. 데이타를 가져올 주소가 누락되었습니다(010)

data 파라미터와 dataUrl 파라미터가 모두 입력되지 않았다. 

####			2.5.13. 한/글, OpenOffice(LibreOffice), Microsft Word 같은 프로그램으로 열 수 없는 경우

.xslt 로 부터 생성한 파일에 xml 구문 에러가 없는지 확인한다(웹브라우저에서 열어보면 확인 가능).

도표가 있는 한/글(hwpx) 이고,
xslt 의 결과 행의 갯수가 달라진다면,
hp:tbl 의 rowCnt 속성값과 hp:cellAddr 의 rowAddr 속성값을 확인한다.

한/글(hwpx) 에서 줄의 갯수가 달라지는 경우 아래의 내용을 참조한다.

####			2.5.14. 한/글(hwpx) 관련

1. 공백이 사라지는 경우

	사라지는 공백을 다음과 같이 처리한다.

	```xml
	<xsl:text> </xsl:text>
	```
	
	xslt 에서 공백이 사라지는 것이기 때문에, oft, docx 등 다른 문서도 마찬가지이다.

2. 한/글 만 지원하는 특수문자

	동그라미 안에 있는 "인" 을 포함하여 대부분의 문자는 사용할 수 있다.
	
	> ① ~ ⑳ 까지는 [유니코드 2000~2FFF](https://ko.wikipedia.org/wiki/%EC%9C%A0%EB%8B%88%EC%BD%94%EB%93%9C_2000~2FFF) 에,
	> ㉑ ~ ㊿ 까지는 [유니코드 3000~3FFF](https://ko.wikipedia.org/wiki/%EC%9C%A0%EB%8B%88%EC%BD%94%EB%93%9C_3000~3FFF) 에 있다.
	
	동그라미 안에 있는 "인" 의 경우 한/글이 아닌 다른 프로그램에서는 글자가 깨진 것처럼 보일 수는 있다.
	
	> 다른 프로그램에서 글자가 깨져서 보이는 것이 싫다면, 동그라미 안에 있는 "인" 대신에 (인) 이나 ㊞ 을 사용하는 것을 검토한다.
	
	사용하는 editor 가 다국어를 불완전하게 지원한다면,
	저장하면서 특수문자가 깨질 수 있다(이 경우는 필자가 사용하는 jEdit 를 추천한다).
	
	동그라미 안에 있는 "인" 의 경우 xslt 파일의 가독성을 위하여 ENTITY 로 정의하여 사용하는 것을 검토한다.
	
3. 줄의 갯수가 달라지는 경우

	GrahaReporter.js 가 변환하면서 줄의 갯수가 달라지는 경우 ```<hp:run>``` 아래 쪽의 ```<hp:linesegarray>``` 부분을 삭제한다.

	```<hp:linesegarray>``` 는 문단 내의 각 줄에 관한 정보를 가지고 있는데,
	```<hp:run>``` 에 포함되어 있는 것과 다르게 되면,
	내용이 깨지거나, 한/글(hwpx) 프로그램이 비정상적으로 종료된다.
	
	예를 들어
	```<hp:linesegarray>``` 아래의 ```<hp:lineseg>``` 가 1개인데,
	```<hp:run>``` 에 포함된 내용이 많아서 2줄 이상이 되는 경우
	한/글(hwpx) 프로그램에서 글자간격을 줄여서 1줄로 만들어버리고,
	반대의 경우에는 예상치 못했던 문자나 깨진 문자가 표시되는 식이다.
	
	> ```<hp:run>``` 의 글자수를 세어서
	> ```<hp:lineseg>``` 의 갯수와 textpos/vertpos 속성 값을 설정하는 방법이 있기는 하지만,
	> 한글과 영문, 숫자가 차지하는 넓이가 다르기 때문에 textpos 값을 프로그램적으로 얻어내는데 다소간의 어려움이 있다.
	
####			2.5.15. 생성한 파일이 한/글, OpenOffice(LibreOffice), Microsft Word 같은 프로그램에서 깨지는 경우

template.odft 작성요령에서 한/글, OpenOffice(LibreOffice), Microsft Word 같은 프로그램으로 서식 파일을 작성하는 첫 번째 단계부터 다시 시작한다.

> GrahaReporter.js 는 
> 한/글, OpenOffice(LibreOffice), Microsft Word 같은 프로그램에서 작성한 서식을 프로그램적으로 간이하게 변형하는 것이기 때문에
> hwpx, oft, docx 의 내부적인 구문에 접근하는 것은 지양하는 것으로 한다.
