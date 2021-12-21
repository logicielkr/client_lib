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
 * DateParser.js
 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.5
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/date_parser
 */

function DateParser() {
}
DateParser.parseDate = function(value) {
	var v2 = value.replace(/ /g, "");
	var date = new Date();
	if(new RegExp(/^\d{1,2}$/).test(v2)) {
		date.setDate(parseInt(v2));
	} else if(new RegExp(/^-\d*$/).test(v2)) {
		date = new Date(date.getTime() - (parseInt(value.substring(1)) * 24 * 60 * 60 * 1000));
	} else if(new RegExp(/^\+\d*$/).test(v2)) {
		date = new Date(date.getTime() + (parseInt(value.substring(1)) * 24 * 60 * 60 * 1000));
	} else if(new RegExp(/^\d{4}$/).test(v2)) {
		date.setMonth(parseInt(value.substring(0,2)) - 1);
		date.setDate(parseInt(value.substring(2)));
	} else if(new RegExp(/^\d{6}$/).test(v2)) {
		date.setFullYear(parseInt(value.substring(0,2)) + 2000);
		date.setMonth(parseInt(value.substring(2,4)) - 1);
		date.setDate(parseInt(value.substring(4)));
	} else if(new RegExp(/^\d{8}$/).test(v2)) {
		date.setFullYear(parseInt(value.substring(0,4)));
		date.setMonth(parseInt(value.substring(4,6)) - 1);
		date.setDate(parseInt(value.substring(6)));
	} else if(new RegExp(/^\d{1,2}-\d{1,2}$/).test(v2)) {
		date.setMonth(parseInt(value.substring(0,value.indexOf("-"))) - 1);
		date.setDate(parseInt(value.substring(value.indexOf("-") + 1)));
	} else if(new RegExp(/^\d{1,2}\.\d{1,2}$/).test(v2)) {
		date.setMonth(parseInt(value.substring(0,value.indexOf("."))) - 1);
		date.setDate(parseInt(value.substring(value.indexOf(".") + 1)));
	} else if(new RegExp(/^\d{1,2}\.\d{1,2}\.$/).test(v2)) {
		date.setMonth(parseInt(value.substring(0,value.indexOf("."))) - 1);
		date.setDate(parseInt(value.substring(value.indexOf(".") + 1, value.length - 1)));
	} else if(new RegExp(/^\d{1,2}월\d{1,2}일$/).test(v2)) {
		date.setMonth(parseInt(value.substring(0,value.indexOf("월"))) - 1);
		date.setDate(parseInt(value.substring(value.indexOf("월") + "월".length, value.length - "일".length)));
	} else if(new RegExp(/^\d{1,2}月\d{1,2}日$/).test(v2)) {
		date.setMonth(parseInt(value.substring(0,value.indexOf("月"))) - 1);
		date.setDate(parseInt(value.substring(value.indexOf("月") + "月".length, value.length - "日".length)));
	} else if(new RegExp(/^\d{2}-\d{1,2}-\d{1,2}$/).test(v2)) {
		date.setFullYear(parseInt(value.substring(0,value.indexOf("-"))) + 2000);
		date.setMonth(parseInt(value.substring(value.indexOf("-") + 1, value.lastIndexOf("-"))) - 1);
		date.setDate(parseInt(value.substring(value.lastIndexOf("-") + 1)));
	} else if(new RegExp(/^\d{2}\.\d{1,2}\.\d{1,2}$/).test(v2)) {
		date.setFullYear(parseInt(value.substring(0,value.indexOf("."))) + 2000);
		date.setMonth(parseInt(value.substring(value.indexOf(".") + 1, value.lastIndexOf("."))) - 1);
		date.setDate(parseInt(value.substring(value.lastIndexOf(".") + 1)));
	} else if(new RegExp(/^\d{2}\.\d{1,2}\.\d{1,2}\.$/).test(v2)) {
		date.setFullYear(parseInt(value.substring(0,value.indexOf("."))) + 2000);
		date.setMonth(parseInt(value.substring(value.indexOf(".") + 1, value.lastIndexOf(".", value.length - 2))) - 1);
		date.setDate(parseInt(value.substring(value.lastIndexOf(".", value.length - 2) + 1)));
	} else if(new RegExp(/^\d{4}-\d{1,2}-\d{1,2}$/).test(v2)) {
		date.setFullYear(parseInt(value.substring(0,value.indexOf("-"))));
		date.setMonth(parseInt(value.substring(value.indexOf("-") + 1, value.lastIndexOf("-"))) - 1);
		date.setDate(parseInt(value.substring(value.lastIndexOf("-") + 1)));
	} else if(new RegExp(/^\d{4}\.\d{1,2}\.\d{1,2}$/).test(v2)) {
		date.setFullYear(parseInt(value.substring(0,value.indexOf("."))));
		date.setMonth(parseInt(value.substring(value.indexOf(".") + 1, value.lastIndexOf("."))) - 1);
		date.setDate(parseInt(value.substring(value.lastIndexOf(".") + 1)));
	} else if(new RegExp(/^\d{4}\.\d{1,2}\.\d{1,2}\.$/).test(v2)) {
		date.setFullYear(parseInt(value.substring(0,value.indexOf("."))));
		date.setMonth(parseInt(value.substring(value.indexOf(".") + 1, value.lastIndexOf(".", value.length - 2))) - 1);
		date.setDate(parseInt(value.substring(value.lastIndexOf(".", value.length - 2) + 1)));
	} else if(new RegExp(/^\d{2}년\d{1,2}월\d{1,2}일$/).test(v2)) {
		date.setFullYear(parseInt(value.substring(0,value.indexOf("년"))) + 2000);
		date.setMonth(parseInt(value.substring(value.indexOf("년") + "년".length, value.indexOf("월"))) - 1);
		date.setDate(parseInt(value.substring(value.indexOf("월") + "월".length, value.indexOf("일"))));
	} else if(new RegExp(/^\d{2}年\d{1,2}月\d{1,2}日$/).test(v2)) {
		date.setFullYear(parseInt(value.substring(0,value.indexOf("年"))) + 2000);
		date.setMonth(parseInt(value.substring(value.indexOf("年") + "年".length, value.indexOf("月"))) - 1);
		date.setDate(parseInt(value.substring(value.indexOf("月") + "月".length, value.indexOf("日"))));
	} else if(new RegExp(/^\d{4}년\d{1,2}월\d{1,2}일$/).test(v2)) {
		date.setFullYear(parseInt(value.substring(0,value.indexOf("년"))));
		date.setMonth(parseInt(value.substring(value.indexOf("년") + "년".length, value.indexOf("월"))) - 1);
		date.setDate(parseInt(value.substring(value.indexOf("월") + "월".length, value.indexOf("일"))));
	} else if(new RegExp(/^\d{4}年\d{1,2}月\d{1,2}日$/).test(v2)) {
		date.setFullYear(parseInt(value.substring(0,value.indexOf("年"))));
		date.setMonth(parseInt(value.substring(value.indexOf("年") + "年".length, value.indexOf("月"))) - 1);
		date.setDate(parseInt(value.substring(value.indexOf("月") + "月".length, value.indexOf("日"))));
	} else if(!isNaN(new Date(value))) {
		date = new Date(value);
	}
	return date;
};
DateParser.parse = function(value) {
	if(value == null || value.trim() == "") {
		return "";
	}
	var d = DateParser.parseDate(value);
	var r = d.getFullYear() + "-";
	if(d.getMonth() < 9) {
		r += "0";
	}
	r += (d.getMonth() + 1) + "-";
	if(d.getDate() < 10) {
		r += "0";
	}
	r += (d.getDate());
	return r;
};
