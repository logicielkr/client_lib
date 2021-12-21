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
 * parse_xml_document.js
 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.5
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/graha_base_library
 */

/**
이 함수는 버그가 발견되었다.
detail 혹은 insert/update 기능과 같이 rows 가 2개 이상인 경우, 즉 2개 이상의 테이블을 불러오는 경우 마지막 테이블을 제외한 나머지 테이블이 누락되는 현상이 발견되었다.
이를 변경한 함수는 사용법이 달라지게 되므로 부득이 parse_graha_xml_document 로 이름을 변경한다.
이 함수는 데이타를 누락시키지는 않지만, 데이터를 구분하기 위한 별도의 코드를 작성해야 하므로, 새로운 함수(parse_graha_xml_document)의 사용을 권장한다.
*/

function parse_xml_document(result) {
	var obj = new Object();
	var root = result.childNodes;
	for(var i = 0; i < root.length; i++) {
		if(root[i].nodeName == "document") {
			for(var x = 0; x < root[i].childNodes.length; x++) {
				if(root[i].childNodes[x].nodeType == 1) {
					if(root[i].childNodes[x].nodeName == "params" || root[i].childNodes[x].nodeName == "results" || root[i].childNodes[x].nodeName == "props" || root[i].childNodes[x].nodeName == "errors") {
						obj[root[i].childNodes[x].nodeName] = new Object();
					} else  if(root[i].childNodes[x].nodeName == "code") {
						if(!obj[root[i].childNodes[x].nodeName]) {
							obj[root[i].childNodes[x].nodeName] = new Object();
						}
						obj[root[i].childNodes[x].nodeName][root[i].childNodes[x].getAttribute("name")] = new Array();
					} else {
						if(!obj[root[i].childNodes[x].nodeName]) {
							obj[root[i].childNodes[x].nodeName] = new Array();
						}
					}
					for(var y = 0; y < root[i].childNodes[x].childNodes.length; y++) {
						if(root[i].childNodes[x].childNodes[y].nodeType == 1) {
							if(root[i].childNodes[x].nodeName == "params" || root[i].childNodes[x].nodeName == "results" || root[i].childNodes[x].nodeName == "props" || root[i].childNodes[x].nodeName == "errors") {
								obj[root[i].childNodes[x].nodeName][root[i].childNodes[x].childNodes[y].nodeName] = root[i].childNodes[x].childNodes[y].firstChild.nodeValue;
							} else if(root[i].childNodes[x].nodeName == "code") {
								var row = new Object();
								row["value"] = root[i].childNodes[x].childNodes[y].getAttribute("value");
								row["label"] = root[i].childNodes[x].childNodes[y].getAttribute("label");
								obj[root[i].childNodes[x].nodeName][root[i].childNodes[x].getAttribute("name")].push(row);
							} else {
								var row = new Object();
								for(var z = 0; z < root[i].childNodes[x].childNodes[y].childNodes.length; z++) {
									if(root[i].childNodes[x].childNodes[y].childNodes[z].nodeType == 1) {
										row[root[i].childNodes[x].childNodes[y].childNodes[z].nodeName] = root[i].childNodes[x].childNodes[y].childNodes[z].firstChild.nodeValue;
									}
								}
								obj[root[i].childNodes[x].nodeName].push(row);
							}
						}
					}
				}
			}
		}
	}
	/*
	console.log(new XMLSerializer().serializeToString(result));
	console.log(JSON.stringify(obj));
	*/
	return obj;
}