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
 * object_to_graha_xml_document.js
 
 * parse_graha_xml_document 와 반대로 parse_graha_xml_document 에서 만든 object 를 XMLDocument 로 변경한다.
 
 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.7.2.0
 * @since 0.7.2.0
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/graha_base_library
 */

function object_to_graha_xml_document(obj) {
	if(obj != null) {
		var keys = Object.keys(obj);
		if(keys.length > 0) {
			var grahaXML = document.implementation.createDocument(null, "document", null);
			for(var i = 0; i < keys.length; i++) {
				if(keys[i] == "code") {
					var codeKeys = Object.keys(obj[keys[i]]);
					if(codeKeys.length > 0) {
						for(var x = 0; x < codeKeys.length; x++) {
							var code = grahaXML.createElement("code");
							code.setAttribute("name", codeKeys[x]);
							for(var z = 0; z < obj[keys[i]][codeKeys[x]].length; z++) {
								var option = grahaXML.createElement("option");
								option.setAttribute("value", obj[keys[i]][codeKeys[x]][z].value);
								option.setAttribute("label", obj[keys[i]][codeKeys[x]][z].label);
								code.appendChild(option);
							}
							grahaXML.documentElement.appendChild(code);
						}
					}
				} else if(keys[i] == "files") {
					var fileKeys = Object.keys(obj[keys[i]]);
					if(fileKeys.length > 0) {
						for(var x = 0; x < fileKeys.length; x++) {
							var files = grahaXML.createElement("files");
							files.setAttribute("id", fileKeys[x]);
							for(var z = 0; z < obj[keys[i]][fileKeys[x]].length; z++) {
								var file = grahaXML.createElement("file");
								var itemKeys = Object.keys(obj[keys[i]][fileKeys[x]][z]);
								for(var a = 0; a < itemKeys.length; a++) {
									var item = grahaXML.createElement(itemKeys[a]);
									item.textContent = obj[keys[i]][fileKeys[x]][z][itemKeys[a]];
									file.appendChild(item);
								}
								files.appendChild(file);
							}
							grahaXML.documentElement.appendChild(files);
						}
					}
				} else if(keys[i] == "params" || keys[i] == "results" || keys[i] == "props" || keys[i] == "errors") {
					var paramsKeys = Object.keys(obj[keys[i]]);
					if(paramsKeys.length > 0) {
						var params = grahaXML.createElement(keys[i]);
						for(var x = 0; x < paramsKeys.length; x++) {
							var item = grahaXML.createElement(paramsKeys[x]);
							item.textContent = obj[keys[i]][paramsKeys[x]];
							params.appendChild(item);
						}
						grahaXML.documentElement.appendChild(params);
					}
				} else if(keys[i] == "rows") {
					var rowsKeys = Object.keys(obj[keys[i]]);
					if(rowsKeys.length > 0) {
						for(var x = 0; x < rowsKeys.length; x++) {
							var rows = grahaXML.createElement(keys[i]);
							rows.setAttribute("id", rowsKeys[x]);
							for(var z = 0; z < obj[keys[i]][rowsKeys[x]].length; z++) {
								var row = grahaXML.createElement("row");
								var itemKeys = Object.keys(obj[keys[i]][rowsKeys[x]][z]);
								for(var a = 0; a < itemKeys.length; a++) {
									var item = grahaXML.createElement(itemKeys[a]);
									item.textContent = obj[keys[i]][rowsKeys[x]][z][itemKeys[a]];
									row.appendChild(item);
								}
								rows.appendChild(row);
							}
							grahaXML.documentElement.appendChild(rows);
						}
					}
				} else if(keys[i] == "pages") {
					if(obj[keys[i]].length > 0) {
						var pages = grahaXML.createElement(keys[i]);
						for(var x = 0; x < obj[keys[i]].length; x++) {
							var page = grahaXML.createElement("page");
							var itemKeys = Object.keys(obj[keys[i]][x]);
							for(var z = 0; z < itemKeys.length; z++) {
								var item = grahaXML.createElement(itemKeys[z]);
								item.textContent = obj[keys[i]][x][itemKeys[z]];
								page.appendChild(item);
							}
							pages.appendChild(page);
						}
						grahaXML.documentElement.appendChild(pages);
					}
				} else {
					console.error(
						keys[i],
						obj[keys[i]]
					);
				}
			}
			return grahaXML;
		}
	}
	return null;
}
