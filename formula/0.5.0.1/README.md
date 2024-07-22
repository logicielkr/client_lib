# GrahaFormula.js

## 1. about

### 1.1. 소개 

Javascript 로 Microsoft Excel 이나 LibreOffice(Openoffice) Calc 에서 제공하는 수식과 유사한 방식으로 처리하는 라이브러리이다.

이 라이브러리는 Graha 의 자동계산기능을 위해 작성되었지만, 독립적으로 사용할 수 있다.

### 1.2. 다운로드

https://github.com/logicielkr/client_lib/tree/master/formula/0.5.0.1

### 1.3. 호환성

이 라이브러리는 다음의 환경에서 테스트했다.

- Firefox 최신버전
- Google Chrome 최신버전
- Internet Explorer 11

이 라이브러리에서는 ECMA-262 제5판에 추가된 Function.prototype.bind() 함수를 사용하기 때문에 Internet Explorer 9 이전 버전에서 동작하지 않는다.

[MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) 에서는 bind 함수를 지원하지 않는 브라우저를 위한 방법(폴리필)을 안내하고 있지만,
필자는 이에 대한 테스트를 수행하지 않았다.

## 2. GrahaFormula.js 사용방법

### 2.1. 가장 간단한 사용예

```javascript
GrahaFormula.expr = [
	{
		name:"firstName",
		expr:"trim(firstName)",
		formName:"formula",
		event:"blur ready submit"
	}
];
GrahaFormula.addEvent(document, GrahaFormula.ready, "ready");
```

위의 Javascript는 다음과 같은 HTML 코드에서 동작한다.

```html
<form name="formula">
	<input name="firstName" type="text" />
</form>
```

위의 Javascript는 name 속성값이 firstName 인 input 요소 값에서 좌우공백을 제거한다.

GrahaFormula.addEvent로 시작하는 마지막 줄은 이벤트를 추가하는 명령이다.

### 2.2. GrahaFormula.expr에서 사용할수 있는 속성값

- formName : ```<form>``` 태그의 name 속성값
- name : ```<input>``` 태그의 name 속성값.  값을 변경할 대상.  blur 이벤트가 걸리는 input 태그
- expr : 수식 (구체적인 사용방법은 뒤에서 기술함)
- event : 수식을 실행할 이벤트 (blur, ready, submit 만 사용가능)
- func : 수식을 지정하는 대신 사용할 사용자 정의 함수 
- refer : func 속성이 지정된 경우, 사용자 정의 함수에서 참조하는 다른 input 태그

func, refer 속성은 expr 을 지정하기 어려운 경우에만 사용하며, func 속성이 사용된 경우 refer 속성도 지정해야 한다.

### 2.3. 여러개를 정의하는 경우

여러개를 정의하는 경우 주의사항은 다음과 같다.

- GrahaFormula.expr은 순서대로 1번만 실행된다.
- 순환참조 따위의 에러가 발생하지 않는다.
- 순서에 유의해야 하는 경우도 있다.

### 2.4. 예제

GrahaFormula.js 예제는 다음의 파일에서 찾을 수 있다.

> 이 예제는 GrahaFormula.js 가 제공하는 기능들이 이상없이 동작하는지 테스트를 위한 목적에서 개발되었다.

- test_aa.html
- test_bb.html

예제를 실행하기 위해서는 tax.js 파일이 같은 경로에 있어야 한다.

> 예제 파일 2개는 화면이나 기능에서 완전히 동일하지만, 내부적으로 ```<input>``` 태그의 name 속성을 지정하는 방식이 약간 다르다.

## 3. GrahaFormula.js 수식 사용방법

GrahaFormula.js 수식은 독립적으로 사용할 수 있다.

### 3.1. 가장 간단한 예제

```javascript
var expr = "1 + 1";
var formula = GrahaFormula.parseFormula(expr);
var result = formula.expr.valueOf();
var refer = formula.refer;
```

위의 Javascript를 실행하면 result 변수에 2가 할당되고, refer 변수에 수식이 참조하는 HTML Form 요소의 이름의 배열이 할당된다.

### 3.2. 지원하는 연산자

- ```+``` : 더하기
- ```-``` : 빼기
- ```*``` : 곱하기
- ```/``` : 나누기
- ```%``` : 퍼센트(나누기 100이 추가된다)
- ```&``` : 문자열 연결 연산자

### 3.3. 지원하는 함수

- trim : 앞뒤의 여백을 제거한다.
- upper : 대문자로 변경한다.
- lower : 소문자로 변경한다.
- comma : 천단위마다 ","를 추가한다(toLocaleString 함수를 사용하므로 클라이언트의 locale에 따라 다르게 표시될 수 있음).
- nvl : 첫번째 파라미터값이 null인 경우 두번째 파라미터값을 돌려준다.
- round : 반올림한다.(0.5보다 같거나 크면 올리고, 그렇지 않으면 내린다) (Math.round 함수를 사용해서 구현했으며, 자리수를 지정하는 2번째 파라미터는 없다)
- ceil : 무조건 올린다 (Math.ceil 함수를 사용해서 구현했으며, 자리수를 지정하는 2번째 파라미터는 없다).
- floor : 무조건 내린다 (Math.floor 함수를 사용해서 구현했으며, 자리수를 지정하는 2번째 파라미터는 없다).
- abs : 절대값을 돌려준다.
- number : 숫자형으로 변경한다.
- string : 문자열형으로 변경한다.
- sum : 합계를 구한다.
- max : 최대값을 구한다.
- min : 최소값을 구한다.
- avg : 평균을 구한다.
- count : 갯수를 구한다.


<!--
- plus
- minus
- concat
- multiplication
- division
- _int
- _float
- _extract
- typeof
-->

### 3.4. 몇 가지 예제들

- ```trim(' 1')```
- ```2 * (3 + 1) * 2 & trim(' 1')```
- ```number(trim('1,000'))```
- ```upper(trim(' a '))```
- ```lower(trim(' A '))```
- ```trim(' 2') * 3```
- ```' 2' * 3```
- ```comma(' 2000' * 3)```
- ```max(1, 2, 3)```
- ```min(1, 2, 3)```
- ```round(1.2)```
- ```round(1.5)```
- ```round(1.9)```
- ```floor(1.9)```
- ```ceil(1.9)```
- ```sum(1,'9,000')```
- ```nvl('','0')```

### 3.5. HTML Form 요소에 접근하는 방법

#### 3.5.1. 간단한 사용법

```<form>``` 요소가 생략된 것은 사용할 수 없고, ```<form>``` 요소의 name 속성은 반드시 지정되어야 한다.

기본적인 예제를 위한 HTML 코드는 다음과 같다.

```html
<form name="insert">
	<input name="name" value=" 홍길동 " />
</form>
```

다음과 같은 코드는 result 변수에 "홍길동" 이 할당된다.

```javascript
var expr = "trim(insert#name)";
var formula = GrahaFormula.parseFormula(expr);
var result = formula.expr.valueOf();
```

HTML Form 요소에 접근하는 구문은 ```insert#name``` 와 같은데, ```insert``` 는 ```<form>``` 태그의 name 속성값이고, ```#``` 은 구분자이고, ```name``` 은 ```<input>``` 태그의 name 속성값이다.

만약 1개의 ```<form>``` 태그만 사용하는 경우 다음과 같이 할 수도 있다.

```javascript
var expr = "trim(name)";
GrahaFormula.FORM_NAME = "insert";
var formula = GrahaFormula.parseFormula(expr);
var result = formula.expr.valueOf();
```

#### 3.5.2. 범위를 지정하는 방법

sum, max, min 과 같은 함수에서는 범위를 지정하여 사용할 수 있다.

> 좌우의 범위는 안되고, 위 아래의 범위만 지정할 수 있다.

예제를 위한 HTML 은 다음과 같다.

```html
<form name="insert">
	<input name="name.1" value=" 홍일동 " />
	<input name="salary.1" value="1000000" />
	<input name="name.2" value=" 홍이동 " />
	<input name="salary.2" value="2000000" />
	<input name="name.3" value=" 홍삼동 " />
	<input name="salary.3" value="3000000" />
</form>
```

급여(salary)의 합계를 구하는 코드는 다음과 같다.

```javascript
var expr = "sum(salary.1:salary.3)";
GrahaFormula.FORM_NAME = "insert";
var formula = GrahaFormula.parseFormula(expr);
var result = formula.expr.valueOf();
```

다음과 같은 경우에도 결과는 같다.

```javascript
var expr = "sum(salary.)";
GrahaFormula.FORM_NAME = "insert";
var formula = GrahaFormula.parseFormula(expr);
var result = formula.expr.valueOf();
```

위의 수식은 sum 함수안의 파라미터가 ```.``` 으로 끝났다.

> ```<input>``` 태그의 name 속성값의 일련번호가 비는 일이 없도록 주의해야 한다. 

개인적으로 추천하는 방식은 아니지만, 다음과 같은 HTML 코드에서도 처리가 가능하다.

```html
<form name="insert">
	<input name="name" value=" 홍일동 " />
	<input name="salary" value="1000000" />
	<input name="name" value=" 홍이동 " />
	<input name="salary" value="2000000" />
	<input name="name" value=" 홍삼동 " />
	<input name="salary" value="3000000" />
</form>
```

Javascript 코드는 다음과 같다.

```javascript
var expr = "sum(salary)";
GrahaFormula.FORM_NAME = "insert";
var formula = GrahaFormula.parseFormula(expr);
var result = formula.expr.valueOf();
```

위의 수식은 sum 함수안의 파라미터가 ```.``` 으로 끝나지 않았다.

```salary[1]:salary[3]``` 같은 형태의 수식은 지원하지 않는다.

#### 3.5.3. 수식이 참조하는 HTML Form 요소를 얻는 방법

```javascript
var expr = "trim(name)";
GrahaFormula.FORM_NAME = "insert";
var formula = GrahaFormula.parseFormula(expr);
var result = formula.expr.valueOf();
var refer = formula.refer;
```

위의 Javascript 코드에서 refer 변수는 문자열 배열 인데, ```name``` 이 할당된다.

수식이 ```salary.1:salary.3``` 이거나 salary. 의 경우 ```salary.1```, ```salary.2```, ```salary.3``` 이 반환된다.

하지만 위에서 개인적으로 추천하지 않았던 ```salary``` 의 경우  ```salary``` 만 반환된다.

#### 3.5.4. 특수한 방법

예제를 위한 HTML 코드는 다음과 같다.

```html
<form name="insert">
	<input name="name.1" value=" 홍일동 " />
	<input name="salary.1" value="1000000" />
	<input name="tax.1" />
	<input name="name.2" value=" 홍이동 " />
	<input name="salary.2" value="2000000" />
	<input name="tax.2" />
	<input name="name.3" value=" 홍삼동 " />
	<input name="salary.3" value="3000000" />
	<input name="tax.3" />
</form>
```

```tax.1``` 부터 ```tax.3``` 까지 각각 ```salary.``` 에서 3.3% 를 곱해 값을 채워넣는 코드는 다음과 같다.

```javascript
var expr = "salary.{N} * 3.3%";
GrahaFormula.FORM_NAME = "insert";
for(var i = 1; i <= 3; i++) {
	GrahaFormula.INDEX = i;
	var formula = GrahaFormula.parseFormula(expr);
	var result = formula.expr.valueOf();
	document.forms["insert"].elements["tax." + i].value = result;
	var refer = formula.refer;
}
```

수식에서 ```salary``` 에 접근하기 위해 ```salary.{N}``` 를 사용했고, ```GrahaFormula.INDEX``` 변수를 할당했다는 것에 주의해야 한다.

> refer 변수의 경우 "salary.{N}" 이 반환된다. 

개인적으로 추천하지 않는 방식의 HTML 코드는 다음과 같다.

```html
<form name="insert">
	<input name="name" value=" 홍일동 " />
	<input name="salary" value="1000000" />
	<input name="tax" />
	<input name="name" value=" 홍이동 " />
	<input name="salary" value="2000000" />
	<input name="tax" />
	<input name="name" value=" 홍삼동 " />
	<input name="salary" value="3000000" />
	<input name="tax" />
</form>
```

이에 해당하는 Javascript 코드는 다음과 같다.

```javascript
var expr = "salary[N] * 3.3%";
GrahaFormula.FORM_NAME = "insert";
for(var i = 1; i <= 3; i++) {
	GrahaFormula.INDEX = i;
	var formula = GrahaFormula.parseFormula(expr);
	var result = formula.expr.valueOf();
	document.forms["insert"].elements["tax." + i].value = result;
	var refer = formula.refer;
}
```

차이는 ```salary.{N}``` 와 ```salary[N]``` 이다.  후자의 경우 ```.``` 도 없어졌고, ```{``` 대신에 ```[``` 가 사용되었다.

## 4. 프로그래머를 위해서

### 4.1. 사용자 정의 함수

사용자 정의 함수는 예제로 제공된 다음 2개의 파일에서 ```tax``` 함수를 참조하면 된다.

- test_aa.html
- test_bb.html

### 4.2. 내장 함수 추가

내장 함수를 추가하는 방법은 2가지 방법이 있다.

- ```GrahaFormula.Func.udf.``` 으로 시작하는 Javascript 함수를 추가한다.
- ```GrahaFormula.Func.contains``` 함수와 ```GrahaFormula.Func.prototype.valueOf``` 함수를 변경한다.

첫 번째 방법은 일반적이고, 두 번째 방법은 많은 내장 함수를 일정한 규칙하에 추가할 수 있는 방법이다.

첫 번째 방법으로 내장 함수를 추가하기 위해서 참조할 만한 내장 함수는 다음과 같다.

- GrahaFormula.Func.udf.round : 파라미터로 숫자 1개가 들어온 경우
- GrahaFormula.Func.udf.trim : 파라미터로 문자열 1개가 들어온 경우
- GrahaFormula.Func.udf.nvl : 2개의 파라미터가 들어온 경우
- GrahaFormula.Func.udf.sum : 여러개의 파라미터가 들어오고, 각각의 파라미터가 범위를 지정한 경우

### 4.3. HTML Form 요소에 접근하는 방법을 변경하는 방법

GrahaFormula.Val 로 시작하는 것들을 변경하면 된다.

외부에서 호출하는 함수는 다음과 같고, 나머지 함수들은 중복된 코드를 줄이기 위한 것이다.

- GrahaFormula.Val.contains
- GrahaFormula.Val._isExtract
- GrahaFormula.Val._extract
- GrahaFormula.Val.prototype.valueOf
- GrahaFormula.Val.prototype.isExtract
- GrahaFormula.Val.prototype.extract
