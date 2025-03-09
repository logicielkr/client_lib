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
 * GrahaOdtPageSplitterUtility
 * GrahaOdtPageSplitter 에서 사용하는 함수 모음.

 * GrahaOdt2PdfConverter 전체적인 사용법은 README.md 를 참조한다.

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.5.0.3
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/odt2pdf/0.5.0.3
 */

function GrahaOdtPageSplitterUtility(options) {
	
}
GrahaOdtPageSplitterUtility.clear = function(node) {
	for(var i = node.childNodes.length - 1; i >= 0; i--) {
		node.removeChild(node.childNodes[i]);
	}
};
GrahaOdtPageSplitterUtility.copy = function(node) {
	var obj = document.createElement(node.nodeName);
	var attributes = node.attributes;
	for(var i = 0; i < attributes.length; i++) {
		obj.setAttribute(attributes.item(i).name, attributes.item(i).value);
	}
	return obj;
};
GrahaOdtPageSplitterUtility.copyA = function(node, root) {
	if(node && node != null && node.length > 0) {
		var obj = GrahaOdtPageSplitterUtility.copy(node[0]);
		if(node.is(root)) {
			return obj;
		}
		var current = node;
		var child = obj;
		var parent = null;
		while(current && current != null && current.length > 0 && !(current.is(root))) {
			current = current.parent();
			if(current && current != null && current.length > 0) {
				parent = GrahaOdtPageSplitterUtility.copy(current[0]);
				parent.appendChild(child);
				child = parent;
			} else {
				break;
			}
		}
		return {
			after: parent,
			parentA: obj
		};
	} else {
		return null;
	}
};
GrahaOdtPageSplitterUtility.move = function(node, parent) {
	var current = $(node);
	current = current.prev();
	var elements = new Array();
	while(current && current != null && current.length > 0) {
		elements.push(current);
		current = current.prev();
	}
	for(var i = 0; i < elements.length; i++) {
		if(elements[i] && elements[i] != null && elements[i].length > 0) {
			if(elements[i][0].nodeName == "COLGROUP") {
				$(parent).prepend(elements[i].clone());
			} else {
				$(parent).prepend(elements[i]);
			}
		}
	}
};
GrahaOdtPageSplitterUtility.copyBorder = function(before, after) {
	if(before == null) {
		return;
	}
	if(after == null) {
		return;
	}
	var lastTrNode = null;
	var firstTrNode = null;
	for(var i = before.childNodes.length - 1; i > 0 ; i00) {
		if(Node.DOCUMENT_NODE == before.childNodes[i].nodeType || Node.ELEMENT_NODE == before.childNodes[i].nodeType) {
			if(before.childNodes[i].nodeName == "TR") {
				lastTrNode = before.childNodes[i];
				break;
			}
		}
	}
	for(var i = 0; i < after.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == after.childNodes[i].nodeType || Node.ELEMENT_NODE == after.childNodes[i].nodeType) {
			if(after.childNodes[i].nodeName == "TR") {
				firstTrNode = after.childNodes[i];
				break;
			}
		}
	}
	if(lastTrNode != null && firstTrNode != null) {
		var lastBorders = new Array();
		for(var i = 0; i < lastTrNode.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == lastTrNode.childNodes[i].nodeType || Node.ELEMENT_NODE == lastTrNode.childNodes[i].nodeType) {
				if(lastTrNode.childNodes[i].nodeName == "TD") {
					for(var x = 0; x < GrahaOdt2PdfConverterUtility.parseInt($(lastTrNode.childNodes[i]).attr("colspan"), 1); x++) {
						lastBorders.push({
							width: $(lastTrNode.childNodes[i]).css("border-bottom-width"),
							color: $(lastTrNode.childNodes[i]).css("border-bottom-color"),
							style: $(lastTrNode.childNodes[i]).css("border-bottom-style")
						});
					}
				}
			}
		}
		for(var i = 0; i < firstTrNode.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == firstTrNode.childNodes[i].nodeType || Node.ELEMENT_NODE == firstTrNode.childNodes[i].nodeType) {
				if(firstTrNode.childNodes[i].nodeName == "TD") {
					var cellIndex = GrahaOdt2PdfConverterUtility.parseInt($(firstTrNode.childNodes[i]).attr("data-table-cell-index"), 0);
					var border = null;
					if(cellIndex <= lastBorders.length) {
						border = lastBorders[cellIndex - 1];
					} else {
						border = lastBorders[lastBorders.length - 1];
					}
					if(border != null) {
						if(border.width && border.width != null) {
							$(firstTrNode.childNodes[i]).css("border-top-width", border.width);
						}
						if(border.color && border.color != null) {
							$(firstTrNode.childNodes[i]).css("border-top-color", border.color);
						}
						if(border.style && border.style != null) {
							$(firstTrNode.childNodes[i]).css("border-top-style", border.style);
						}
					}
				}
			}
		}
	}
};
GrahaOdtPageSplitterUtility.findNthTdChild = function(node, tableCellIndex) {
	if(node == null) {
		return null;
	}
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "TD") {
				var currentTableCellIndex = GrahaOdt2PdfConverterUtility.parseInt(node.childNodes[i].getAttribute("data-table-cell-index"), 1);
				if(currentTableCellIndex == tableCellIndex) {
					return node.childNodes[i];
				}
			}
		}
	}
	return null;
};