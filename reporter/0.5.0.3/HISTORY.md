# History of Reporter.js

## 1. 0.5

### 1.1. 0.5.0.0

- 배포 시작

### 1.2. 0.5.0.1

- dataUrl 로부터 데이타를 가져오는데 실패한 경우(ajax 에러인 경우) alert 을 띄우고 실행을 종료
- templateUrl 로부터 가져온 파일에서 .xslt 확장자를 갖는 파일이 1개로 없는 경우 alert 을 띄우고 실행을 종료

### 1.3. 0.5.0.2

- GrahaReporter.report 함수 추가
- 종전의 GrahaReporter.create 함수는 내부적으로 GrahaReporter.report 함수를 호출하는 방식으로 변경
- ajax 통신을 통해서 받아온 data 를 GrahaReporter.report 함수의 파라미터로 전달 할 수 있고,
- (이 경우 응용프로그램에서 ajax 통신을 통해서 data 를 받아온 다음, 데이타무결성 검사를 통과한 경우에만 GrahaReporter.report 함수를 호출 할 수 수 있다)
- dataUrl 만 혹은 dataUrl과 check 함수와 함께 파라미터로 전달 할 수도 있다.
- (이 경우 응용프로그램에서 파라미터로 전달한 check 함수가 데이타무결성을 검사한다).

### 1.4. 0.5.0.3

- GrahaReporter 가 변경한 파일을 압축 파일에 추가할 때, 날짜가 누락된 것 보완
