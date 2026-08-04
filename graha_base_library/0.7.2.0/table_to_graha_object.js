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
 * table_to_graha_object.js
 
 * Graha 로 생성한 화면에서 parse_graha_xml_document.js 로 만드는 object 를 생성한다.
 
 * 내부적으로 jQuery 를 사용한다.
 * Graha 0.7.1.0 이후 버전에서만 사용할 수 있다.
 
 * rows 만 생성한다.
 * prop 와 같은 것들은 서버에서 Graha XML 를 불어와야만 만들 수 있다.
 
 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.7.2.0
 * @since 0.7.2.0
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/graha_base_library
 */

function table_to_graha_object() {
	var obj = new Object();
	obj.rows = new Object();
	var insert = false;
	$("form.graha table.graha").add("form.graha div.graha.table").each(function() {
		var rowsId = $(this).attr("id");
		obj.rows[rowsId] = new Array();
		var row = new Object();
		$(this).find("input.graha").add($(this).find("select.graha")).add($(this).find("textarea.graha")).each(function() {
			var type = $(this).attr("type");
			if(type != "submit" && type != "button") {
				var name = $(this).attr("class");
				if(name.indexOf("graha ") == 0) {
					name = name.substring("graha ".length);
				}
				if(row.hasOwnProperty(name)) {
					obj.rows[rowsId].push(row);
					row = new Object();
				}
				row[name] = $(this).val();
				insert = true;
			}
		});
		obj.rows[rowsId].push(row);
	});
	if(!insert) {
		$("table.graha").add("div.graha.table").each(function() {
			var rowsId = $(this).attr("id");
			obj.rows[rowsId] = new Array();
			var row = new Object();
			$(this).find("div.graha.td").add($(this).find("td.graha")).each(function() {
				var name = $(this).attr("class");
				if(name.indexOf("graha td ") == 0) {
					name = name.substring("graha td ".length);
				} else if(name.indexOf("graha ") == 0) {
					name = name.substring("graha ".length);
				}
				if(row.hasOwnProperty(name)) {
					obj.rows[rowsId].push(row);
					row = new Object();
				}
				row[name] = $(this).text();
			});
			obj.rows[rowsId].push(row);
		});
	}
	return obj;
}
