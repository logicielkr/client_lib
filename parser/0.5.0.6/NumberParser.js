/*
 *
 * Copyright (C) HeonJik, KIM
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 * 
 * You should have received a copy of the GNU Library General Public
 * License along with this library; if not, write to the Free
 * Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 *
 */

/**
 * NumberParser.js
 * 
* [파라미터가 3개인 경우]
 *
 * 첫 번째 파라미터 : HTML Form
 * 두 번째 파라미터 : HTML Form 내의 요소의 이름(name 속성)
 * 세 번째 파라미터 : 데이타 타입 (int, long, float, double)
 *
 *
 * [파라미터가 2개인 경우]
 *
 * 첫 번째 파라미터 : 숫자로 변환할 문자열
 * 두 번째 파라미터 : 데이타 타입 (int, long, float, double)
 *
 *
 * [파라미터가 1개인 경우]
 *
 * 첫 번째 파라미터 : 숫자로 변환할 문자열
 * 숫자로 변환할 문자열 내에 "." 이 있는 경우 double 로, 그렇지 않은 경우 long 으로 변환한다.
 *
 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.5.0.5
 * @since 0.5.0.5
 */

function NumberParser() {
}

NumberParser.parse = function(form, name, t) {
	var v = null;
	var dataType = null;
	if(arguments.length == 3) {
		if(!_notNull(form, name)) {
			return 0;
		}
		var obj = form[name];
		v = obj.value;
		dataType = t;
	} else if(arguments.length == 2) {
		v = arguments[0];
		dataType = arguments[1];
	} else if(arguments.length == 1) {
		v = arguments[0];
		if(v != null && v.indexOf(".") >= 0) {
			dataType = "double";
		} else {
			dataType = "long";
		}
	} else {
		return NaN;
	}
	v = v.replace(/,/g, "");
	v = v.replace(/ /g, "");
	if(v == "") {
		return 0;
	}
	if(dataType == "int" || dataType == "long") {
		if(!isNaN(Number(v)) && !isNaN(parseInt(v)) && parseInt(v).toString() == v) {
			if(dataType == "int") {
				if(parseInt(v) >= -2147483648 && parseInt(v) <= 2147483647) {
					return parseInt(v);
				} else {
					return NaN;
				}
			}
			return parseInt(v);
		}
	} else if(dataType == "float" || dataType == "double") {
		if(!isNaN(Number(v)) && !isNaN(parseFloat(v))) {
			if(dataType == "float") {
				if(parseFloat(v) >= 1.4E-45 && parseFloat(v) <= 3.4028235E38) {
					return parseFloat(v);
				} else {
					return NaN;
				}
			}
			return parseFloat(v);
		}
	}
	return NaN;
};
