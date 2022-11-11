# History of Graha Base Library

## 1. 0.5

### 1.1.	0.5.0.0

- 배포 시작

### 1.2.	0.5.0.1

- bug fix
- form 아래의 element 가져오는 코드에서 element 의 이름이 "." 이 포함된 경우 element를 가져오지 못한다.
- fn_check.js 파일에서 eval 함수 대신에 form[name] 으로 변경

### 1.3.	0.5.0.2

#### 1.3.1.		fn_check.js 파일의 _numberFormat 함수 개선

- 값이 입력되지 않은 경우 true 를 리턴한다.
- 공백( ) 과 콤마(,)는 제거하고 값을 검사한다.
- int 는 java 의 Integer.MIN_VALUE ~ Integer.MAX_VALUE 의 범위에 들어오는지 검사한다.
- float 는 java 의 Float.MIN_VALUE ~ Float.MAX_VALUE 의 범위에 들어오는지 검사한다.
* long 이나 double 은 javascript 와 java 의 범위가 달라서 구현이 불분명하다.

#### 1.3.2.		fn_check.js 파일의 _minLength 함수 개선

- 값이 없는 경우 false 를 리턴한다.

#### 1.3.3.		_minValue / _maxValue 함수 추가

### 1.3.	0.5.0.3

- _notNull 함수를 제외한 다른 함수들은 null 이거나 공백인 경우 true 를 리턴하도록 변경

### 1.4.	0.5.0.4

- input.width.css 파일을 변경함.
- "width: -webkit-fill-available;" 를 주석으로 처리함.
- chrome 및 이를 기반으로 한 edge 에서 "width: -webkit-fill-available;" 가 있으면,
- input 의 width 를 지정하지 않은 것과 같다.