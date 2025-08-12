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
 * @version 0.6.0.1
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.6.0.1
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
GrahaOdtPageSplitterUtility.getFirstTrNode = function(node) {
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "TR") {
				return node.childNodes[i];
			}
		}
	}
	return null;
};
GrahaOdtPageSplitterUtility.getLastTdNode = function(node, colIndex, colspan) {
	for(var i = node.childNodes.length - 1; i > 0 ; i--) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "TR") {
				for(var x = 0; x < node.childNodes[i].childNodes.length; x++) {
					if(Node.DOCUMENT_NODE == node.childNodes[i].childNodes[x].nodeType || Node.ELEMENT_NODE == node.childNodes[i].childNodes[x].nodeType) {
						if(node.childNodes[i].childNodes[x].nodeName == "TD") {
							var td = node.childNodes[i].childNodes[x];
							if(
								colIndex < GrahaPdfConverterUtility.parseInt(td.getAttribute("data-table-cell-index"), 1) + GrahaPdfConverterUtility.parseInt(td.getAttribute("colspan"), 1) &&
								colIndex + colspan > GrahaPdfConverterUtility.parseInt(td.getAttribute("data-table-cell-index"), 1)
							) {
								return td;
							}
						}
					}
				}
			}
		}
	}
	return null;
};
GrahaOdtPageSplitterUtility.getTdBorder = function(node, last) {
	var border = null;
	if(last) {
		border = {
			width: $(node).css("border-bottom-width"),
			color: $(node).css("border-bottom-color"),
			style: $(node).css("border-bottom-style")
		};
	} else {
		border = {
			width: $(node).css("border-top-width"),
			color: $(node).css("border-top-color"),
			style: $(node).css("border-top-style")
		};
	}
	if(GrahaPdfConverterUtility.parseFloat(border.width) > 0 && border.style != "none") {
		return border;
	}
	return null;
};
GrahaOdtPageSplitterUtility.copyBorder = function(before, after) {
	if(before == null) {
		return;
	}
	if(after == null) {
		return;
	}
	var firstTrNode = GrahaOdtPageSplitterUtility.getFirstTrNode(after);
	if(firstTrNode != null) {
		var css = new Array();
		for(var i = 0; i < firstTrNode.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == firstTrNode.childNodes[i].nodeType || Node.ELEMENT_NODE == firstTrNode.childNodes[i].nodeType) {
				if(firstTrNode.childNodes[i].nodeName == "TD") {
					var lastTdNode = GrahaOdtPageSplitterUtility.getLastTdNode(
						before,
						GrahaPdfConverterUtility.parseInt($(firstTrNode.childNodes[i]).attr("data-table-cell-index"), 1),
						GrahaPdfConverterUtility.parseInt($(firstTrNode.childNodes[i]).attr("colspan"), 1)
					);
					var border = GrahaOdtPageSplitterUtility.getTdBorder(lastTdNode, true);
					if(border != null) {
						if(
							border.width && border.width != null &&
							border.color && border.color != null &&
							border.style && border.style != null
						) {
							css.push({
								node: firstTrNode.childNodes[i],
								name: "border-top",
								value: border.color + " " + border.width + " " + border.style,
								log: function() {
									console.log($(this.node), this.name, this.value);
								}
							});
						}
					} else {
						border = GrahaOdtPageSplitterUtility.getTdBorder(firstTrNode.childNodes[i], false);
						if(border != null) {
							if(
								border.width && border.width != null &&
								border.color && border.color != null &&
								border.style && border.style != null
							) {
								if(lastTdNode && lastTdNode != null) {
									css.push({
										node: lastTdNode,
										name: "border-bottom",
										value: border.color + " " + border.width + " " + border.style,
										log: function() {
											console.log($(this.node), this.name, this.value);
										}
									});
								}
							}
						}
					}
				}
			}
		}
		for(var i = 0; i < css.length; i++) {
			if(css[i].node != null) {
				$(css[i].node).css(css[i].name, css[i].value);
				if(css[i].node.style && css[i].node.style != null) {
					if(css[i].name == "border-bottom") {
						css[i].node.style.borderBottom = css[i].value;
					} else if(css[i].name == "border-top") {
						css[i].node.style.borderTop = css[i].value;
					}
				} else {
					css[i].node.setAttribute("style", css[i].name + ": " + css[i].value + ";");
				}
			} else {
				console.error(css[i]);
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
				var currentTableCellIndex = GrahaPdfConverterUtility.parseInt(node.childNodes[i].getAttribute("data-table-cell-index"), 1);
				if(currentTableCellIndex == tableCellIndex) {
					return node.childNodes[i];
				}
			}
		}
	}
	return null;
};
GrahaOdtPageSplitterUtility.prevNodeForOffset = function(node) {
	if(node && node != null && node.length > 0) {
		var prev = node.prev();
		if(prev && prev != null && prev.length > 0) {
			if(node[0].nodeName == "TD") {
			} else {
				return prev;
			}
		}
		if(node[0].nodeName == "P") {
			var parent = node.parent();
			if(parent && parent != null && parent.length > 0) {
				if(parent[0].nodeName == "TD") {
					return GrahaOdtPageSplitterUtility.prevNodeForOffset(parent);
				}
			}
		} else if(node[0].nodeName == "TD" || node[0].nodeName == "TH") {
			var parent = node.parent();
			if(parent && parent != null && parent.length > 0) {
				if(parent[0].nodeName == "TR") {
					return GrahaOdtPageSplitterUtility.prevNodeForOffset(parent);
				}
			}
		} else if(node[0].nodeName == "TR") {
			var parent = node.parent();
			if(parent && parent != null && parent.length > 0) {
				if(parent[0].nodeName == "TABLE" || parent[0].nodeName == "TBODY" || parent[0].nodeName == "THEAD" || parent[0].nodeName == "TFOOT") {
					return GrahaOdtPageSplitterUtility.prevNodeForOffset(parent);
				}
			}
		} else if(node[0].nodeName == "TBODY" || node[0].nodeName == "THEAD" || node[0].nodeName == "TFOOT") {
			var parent = node.parent();
			if(parent && parent != null && parent.length > 0) {
				if(parent[0].nodeName == "TABLE") {
					return GrahaOdtPageSplitterUtility.prevNodeForOffset(parent);
				}
			}
		}
	}
	return null;
};
GrahaOdtPageSplitterUtility.parentNode = function(node, parentNodeName) {
	if(node == null) {
		return null;
	}
	if(node.nodeName == parentNodeName) {
		return node;
	}
	var parent = $(node).parent();
	if(parent && parent != null && parent.length > 0) {
		if(parent[0].nodeName == parentNodeName) {
			return parent[0];
		} else {
			return GrahaOdtPageSplitterUtility.parentNode(parent[0], parentNodeName);
		}
	}
	return null;
};
GrahaOdtPageSplitterUtility.rowspan = function(node, before) {
	var countOfCol = 0;
	if(node.getAttribute("data-hwpx-colcnt") != null) {
		countOfCol = GrahaPdfConverterUtility.parseInt(node.getAttribute("data-hwpx-colcnt"), 0);
	} else {
		for(var i = 0; i < before.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == before.childNodes[i].nodeType || Node.ELEMENT_NODE == before.childNodes[i].nodeType) {
				if(before.childNodes[i].nodeName == "COLGROUP") {
					var colgroup = before.childNodes[i];
					for(var x = 0; x < colgroup.childNodes.length; x++) {
						if(Node.DOCUMENT_NODE == colgroup.childNodes[x].nodeType || Node.ELEMENT_NODE == colgroup.childNodes[x].nodeType) {
							if(colgroup.childNodes[x].nodeName == "COL") {
								countOfCol++;
							}
						}
					}
					break;
				}
			}
		}
	}
	if(countOfCol == 0) {
		return null;
	}
	var tds = new Array();
	var tableCellIndex = 1;
	var lastTableCellIndex = 0;
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "TD" || node.childNodes[i].nodeName == "TH") {
				tableCellIndex = GrahaPdfConverterUtility.parseInt(node.childNodes[i].getAttribute("data-table-cell-index"), 1);
				if(tableCellIndex > lastTableCellIndex + 1) {
					for(var x = (lastTableCellIndex + 1); x < tableCellIndex; x++) {
						tds.push(x);
					}
				}
				lastTableCellIndex = tableCellIndex + GrahaPdfConverterUtility.parseInt(node.childNodes[i].getAttribute("colspan"), 0);
			}
		}
	}
	if(countOfCol > lastTableCellIndex) {
		for(var x = lastTableCellIndex + 1; x <= countOfCol; x++) {
			tds.push(x);
		}
	}
	if(tds.length > 0) {
		return tds;
	} else {
		return null;
	}
};
GrahaOdtPageSplitterUtility.splitRowspan = function(node, tds, caller) {
	if(node == null) {
		return;
	}
	if(tds == null) {
		return;
	} else if(tds.length == 0) {
		return;
	}
	var requireModifyRowspan = {};
	requireModifyRowspan.before = new Array();
	requireModifyRowspan.after = new Array();
	for(var x = 0; x < tds.length; x++) {
		if(caller.resetAvailableHeightLimit) {
			caller.resetAvailableHeightLimit();
		}
		var current = $(node);
		var td = null;
		var rowspan = 0;
		while(td == null && current && current != null && current.length > 0) {
			td = GrahaOdtPageSplitterUtility.findNthTdChild(current[0], tds[x]);
			if(caller.plusAvailableHeightLimit) {
				if(rowspan > 0) {
					var h = caller.plusAvailableHeightLimit(current[0]);
				}
			}
			current = current.prev();
			rowspan++;
		}
		if(td != null) {
			var result = caller.td(td);
			if(result != null) {
				if(result.before && result.before != null) {
					result.before.setAttribute("rowspan", (rowspan - 1));
					var after = $(td).clone(true, true);
					$(td).replaceWith(result.before);
					requireModifyRowspan.before.push($(result.before));
					requireModifyRowspan.after.push(after);
					if(GrahaPdfConverterUtility.parseInt(after.attr("rowspan"), 0) - (rowspan) > 1) {
						$(after).attr("rowspan", GrahaPdfConverterUtility.parseInt(after.attr("rowspan"), 0) - (rowspan));
					} else {
						$(after).attr("rowspan", null);
					}
					if(GrahaPdfConverterUtility.parseInt(after.attr("rowspan"), 0) - (rowspan - 1) > 1) {
						$(after).attr("rowspan", GrahaPdfConverterUtility.parseInt(after.attr("rowspan"), 0) - (rowspan - 1));
					} else {
						$(after).attr("rowspan", null);
					}
					var afterTd = GrahaOdtPageSplitterUtility.findNthTdChild(node, tds[x] + GrahaPdfConverterUtility.parseInt(after.attr("colspan"), 1));
					after.attr("data-graha-splitted", "true");
					
					if(afterTd == null) {
						$(node).append(after);
					} else {
						$(afterTd).before(after);
					}
				}
			}
		}
	}
	return requireModifyRowspan;
};
GrahaOdtPageSplitterUtility.setTableInitialHeightAttribute = function(node) {
	if(node == null) {
		return;
	}
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "COLGROUP") {
			} else if(node.childNodes[i].nodeName == "THEAD") {
				GrahaOdtPageSplitterUtility.setTHeadInitialHeightAttribute(node.childNodes[i]);
			} else if(node.childNodes[i].nodeName == "TBODY") {
				GrahaOdtPageSplitterUtility.setTHeadInitialHeightAttribute(node.childNodes[i]);
			} else if(node.childNodes[i].nodeName == "TR") {
				GrahaOdtPageSplitterUtility.setTrInitialHeightAttribute(node.childNodes[i]);
			} else {
				console.error(node.childNodes[i]);
			}
		}
	}
};
GrahaOdtPageSplitterUtility.setTBodyInitialHeightAttribute = function(node) {
	if(node == null) {
		return;
	}
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "TR") {
				GrahaOdtPageSplitterUtility.setTrInitialHeightAttribute(node.childNodes[i]);
			} else {
				console.error(node.childNodes[i]);
			}
		}
	}
};
GrahaOdtPageSplitterUtility.setTHeadInitialHeightAttribute = function(node) {
	GrahaOdtPageSplitterUtility.setTBodyInitialHeightAttribute(node);
};
GrahaOdtPageSplitterUtility.setTrInitialHeightAttribute = function(node) {
	if(node == null) {
		return;
	}
	node.setAttribute("data-initial-height", $(node).height());
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "TD") {
				GrahaOdtPageSplitterUtility.setTdInitialHeightAttribute(node.childNodes[i]);
			} else {
				console.error(node.childNodes[i]);
			}
		}
	}
};
GrahaOdtPageSplitterUtility.setTdInitialHeightAttribute = function(node) {
	if(node == null) {
		return;
	}
	node.setAttribute("data-initial-height", $(node).height());
};
GrahaOdtPageSplitterUtility.modifyRowspan = function(requireModifyRowspan) {
	if(requireModifyRowspan != null) {
		for(var x = 0; x < requireModifyRowspan.before.length; x++) {
			if(requireModifyRowspan.before[x].attr("rowspan") != null) {
				var rowspan = GrahaPdfConverterUtility.parseInt(requireModifyRowspan.before[x].attr("rowspan"), 0);
				requireModifyRowspan.before[x].attr("rowspan", rowspan + 1);
			}
		}
		for(var x = 0; x < requireModifyRowspan.after.length; x++) {
			if(requireModifyRowspan.after[x].attr("rowspan") != null) {
				var rowspan = GrahaPdfConverterUtility.parseInt(requireModifyRowspan.after[x].attr("rowspan"), 0);
				if(rowspan - 1 > 1) {
					requireModifyRowspan.after[x].attr("rowspan", rowspan - 1);
				} else {
					requireModifyRowspan.after[x].attr("rowspan", null);
				}
			}
		}
	}
};