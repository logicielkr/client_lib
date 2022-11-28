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
 * Lang.js
 * 
 * UTF-8 인코딩된 문자열에 한국어, 일본어, 한자, 혹은 ASCII, ISO-8859-1 범위를 넘어서는 문자가 포함되어 있는지 검사한다.
 * 한국어, 일본어의 범위에 한자는 포함되어 있지 않다.
 * 구체적인 상황에 맞게 Lang.onlyKoreanWithAscii 나 Lang.onlyAscii 같은 함수를 만들어서 사용하기를 권한다.
 * 
 * [사용법]
 * 1. Lang.guess : 문자열의 각 문자가 한국어, 일본어, 한자, 혹은 ASCII, ISO-8859-1 범위를 넘어서는 문자가 포함되어 있는지 검사한다.
 *    가. 리턴하는 Object 는 다음과 같다.
 *        - ko : 한글(한자 제외)이 포함되어 있다면 true
 *        - jp : 일본어(한자 제외)가 포함되어 있다면 true
 *        - hanja : 한자가 포함되어 있다면 true
 *        - overAscii : ASCII 범위를 넘어서는 문자가 포함되어 있다면 true
 *        - overISO_8859_1 : ISO-8859-1 범위를 넘어서는 문자가 포함되어 있다면 true
 *        - ascii : ASCII 범위 내의 문자가 포함되어 있다면 true
 * 2. Lang.onlyAscii : 문자열이 ASCII 범위내에 있으면 true 를 반환한다.
 *        - null 이나 공백인 경우에도 true
 * 3. Lang.onlyKoreanWithAscii : 문자열에 한국어가 포함되어 있고, 문자열이 ASCII 와 한국어 범위내에 있으면 true 를 반환한다.
 *        - null 이나 공백인 경우에는 false
 *        - 한자가 포함되어 있으면 false 를 반환함에 주의!!!
 * 4. Lang.onlyKoreanWithAscii : 문자열이 한국어로만 구성되어 있는 경우 true 를 반환한다.
 *        - null 이나 공백인 경우에는 false
 *        - 한자가 포함되어 있으면 false 를 반환함에 주의!!!
 * 
 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.5.0.0
 * @since 0.5
 */

function Lang() {
}
Lang.guess = function(str) {
	if(str == null || str.trim() == "") {
		return null;
	}
	var lang = {
		ko:false,
		jp:false,
		hanja:false,
		overAscii:false,
		overISO_8859_1:false,
		ascii:false
	};
	for(var i = 0; i < str.length; i++) {
		if(
			(
				str.charCodeAt(i) >= parseInt("1100", 16) && 
				str.charCodeAt(i) <= parseInt("11FF", 16)
			) ||
			(
				str.charCodeAt(i) >= parseInt("3131", 16) && 
				str.charCodeAt(i) <= parseInt("318F", 16)
			) ||
			(
				str.charCodeAt(i) >= parseInt("AC00", 16) && 
				str.charCodeAt(i) <= parseInt("D7A3", 16)
			)
		) {
			lang.ko = true;
		} else if(
			(
				str.charCodeAt(i) >= parseInt("3040", 16) && 
				str.charCodeAt(i) <= parseInt("309F", 16)
			) ||
			(
				str.charCodeAt(i) >= parseInt("30A0", 16) && 
				str.charCodeAt(i) <= parseInt("30FF", 16)
			) ||
			(
				str.charCodeAt(i) >= parseInt("31F0", 16) && 
				str.charCodeAt(i) <= parseInt("31FF", 16)
			)
		) {
			lang.jp = true;
		} else if(
			(
				str.charCodeAt(i) >= parseInt("2E80", 16) && 
				str.charCodeAt(i) <= parseInt("2EFF", 16)
			) ||
			(
				str.charCodeAt(i) >= parseInt("3400", 16) && 
				str.charCodeAt(i) <= parseInt("4DBF", 16)
			) ||
			(
				str.charCodeAt(i) >= parseInt("4E00", 16) && 
				str.charCodeAt(i) <= parseInt("9FBF", 16)
			) ||
			(
				str.charCodeAt(i) >= parseInt("F900", 16) && 
				str.charCodeAt(i) <= parseInt("FAFF", 16)
			) ||
			(
				str.charCodeAt(i) >= parseInt("20000", 16) && 
				str.charCodeAt(i) <= parseInt("2A6DF", 16)
			) ||
			(
				str.charCodeAt(i) >= parseInt("2F800", 16) && 
				str.charCodeAt(i) <= parseInt("2FA1F", 16)
			)
		) {
			lang.hanja = true;
		} else if(str.charCodeAt(i) > parseInt("FF", 16)) {
			lang.overISO_8859_1 = true;
		} else if(str.charCodeAt(i) > parseInt("7F", 16)) {
			lang.overAscii = true;
		} else {
			lang.ascii = true;
		}
	}
	return lang;
};
Lang.onlyAscii = function(str) {
	var lang = Lang.guess(str);
	if(lang == null) {
		return true;
	}
	if(
		!lang.ko &&
		!lang.jp &&
		!lang.hanja &&
		!lang.overISO_8859_1 &&
		!lang.overAscii
	) {
		return true;
	}
	return false;
};
Lang.onlyKoreanWithAscii = function(str) {
	var lang = Lang.guess(str);
	if(lang == null) {
		return false;
	}
	if(
		lang.ko &&
		!lang.jp &&
		!lang.hanja &&
		!lang.overISO_8859_1 &&
		!lang.overAscii
	) {
		return true;
	}
	return false;
};
Lang.onlyKorean = function(str) {
	var lang = Lang.guess(str);
	if(lang == null) {
		return false;
	}
	if(
		lang.ko &&
		!lang.jp &&
		!lang.hanja &&
		!lang.overISO_8859_1 &&
		!lang.overAscii &&
		!lang.ascii
	) {
		return true;
	}
	return false;
};
