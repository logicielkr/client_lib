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
 * GrahaOdtTableBorderCollapser
 * GrahaOdt2HtmlConverter 로 odt 를 HTML 로 변환하는 마지막 단계에서 Table border 를 PDF 변환에 적합하도록 변경한다.

 * GrahaOdt2PdfConverter 전체적인 사용법은 README.md 를 참조한다.

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.5.0.3
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/odt2pdf/0.5.0.3
 */

function GrahaOdtTableBorderCollapser(options) {
	if(arguments.length > 0) {
		this.init(options);
	} else {
		this.init();
	}
}
GrahaOdtTableBorderCollapser.prototype.init = function(options) {
	if(arguments.length > 0 && options != null) {
		this.options = options;
	} else {
		this.options = {};
	}
	if(arguments.length > 0 && options != null && options.ignoreDotted && options.ignoreDotted != null) {
		this.ignoreDotted = options.ignoreDotted;
	} else {
		this.ignoreDotted = false;
	}
	this.wrapperSelector = "div#GrahaOdt2HtmlConverterWrapper";
	this.entirePageSelector = this.wrapperSelector + " p.graha_entire_page";
	this.css = null;
};
GrahaOdtTableBorderCollapser.prototype.parseInt = function(str, defaultValue) {
	return GrahaOdt2PdfConverterUtility.parseInt(str, defaultValue);
};
GrahaOdtTableBorderCollapser.prototype.parseFloat = function(str, defaultValue) {
	return GrahaOdt2PdfConverterUtility.parseFloat(str, defaultValue);
};
GrahaOdtTableBorderCollapser.prototype.collapse = function() {
	var _this = this;
	$(this.entirePageSelector + " table").each(function(index, table) {
		_this.table(table);
	});
};
GrahaOdtTableBorderCollapser.prototype.applyBorderMininumWidth = function(node) {
	var minimumBorderWidth = 0.5;
	if($(node).css("border-top-width") != "0px") {
		var border = this.parseFloat($(node).css("border-top-width"), 0);
		if(border > 0 && border <= minimumBorderWidth) {
			this.applyCss(node, "border-top-width", minimumBorderWidth + "px");
		}
	}
	if($(node).css("border-bottom-width") != "0px") {
		var border = this.parseFloat($(node).css("border-bottom-width"), 0);
		if(border > 0 && border <= minimumBorderWidth) {
			this.applyCss(node, "border-bottom-width", minimumBorderWidth + "px");
		}
	}
	if($(node).css("border-left-width") != "0px") {
		var border = this.parseFloat($(node).css("border-left-width"), 0);
		if(border > 0 && border <= minimumBorderWidth) {
			this.applyCss(node, "border-left-width", minimumBorderWidth + "px");
		}
	}
	if($(node).css("border-right-width") != "0px") {
		var border = this.parseFloat($(node).css("border-right-width"), 0);
		if(border > 0 && border <= minimumBorderWidth) {
			this.applyCss(node, "border-right-width", minimumBorderWidth + "px");
		}
	}
};
GrahaOdtTableBorderCollapser.prototype.copyBorder = function(from, to, fromPosition, toPosition) {
	if(this.validBorderStyle(to, toPosition)) {
	} else {
		if(this.validBorderStyle(from, fromPosition)) {
			var border = this.getBorder(from, fromPosition);
			this.applyCss(to, "border-" + toPosition, border.toString());
			return true;
		}
	}
	return false;
};
GrahaOdtTableBorderCollapser.prototype.validBorderStyle = function(node, position) {
	if(node != null) {
		if($(node).css("border-" + position + "-style")) {
			if($(node).css("border-" + position + "-style") != null) {
				if($(node).css("border-" + position + "-style") != "") {
					if($(node).css("border-" + position + "-style") != "none") {
						return true;
					}
				}
			}
		}
	}
	return false;
};
GrahaOdtTableBorderCollapser.prototype.removeBorder = function(node, position) {
	if(node != null) {
		this.applyCss(node, "border-" + position + "-style", "none");
	}
};
GrahaOdtTableBorderCollapser.prototype.td = function(node, rowIndex, colCount) {
	if(node == null) {
		return null;
	}
	var colIndex = this.parseInt(node.getAttribute("data-table-cell-index"), 0);
	this.fixDotted(node);
	if(rowIndex == 1) {
		this.copyBorder(this.tableElement, node, "top", "top");
	}
	if(colIndex == 1) {
		this.copyBorder(this.tableElement, node, "left", "left");
	}
	if(this.validBorderStyle(node, "right")) {
		var rightCellIndex = colIndex;
		if(node.getAttribute("colspan") != null) {
			rightCellIndex += (this.parseInt(node.getAttribute("colspan"), 0) - 1);
		}
		rightCellIndex++;
		if(colCount >= rightCellIndex) {
			var rightCell = null;
			var right = $(node).next();
			if(right && right != null && right.length > 0) {
				if(this.parseInt(right[0].getAttribute("data-table-cell-index"), 0) == rightCellIndex) {
					right = right[0];
				} else {
					right = null;
				}
			} else {
				right = null;
			}
			if(right == null) {
				var tr = $(node).parent();
				if(tr && tr != null && tr.length > 0 && tr[0].nodeName == "TR") {
					var index = 1;
					while(tr && tr != null && tr.length > 0) {
						for(var i = 0; i < tr.children().length; i++) {
							var td = tr.children().get(i);
							if(
								rightCellIndex == this.parseInt(td.getAttribute("data-table-cell-index"), 0)
							) {
								right = td;
								break;
							}
						}
						if(right != null) {
							break;
						}
						if(tr[0].nodeName == "TR") {
							index++;
						}
						tr = tr.prev();
					}
				}
			}
			if(right != null) {
				rightCell = new Array();
				if(node.getAttribute("rowspan") != null) {
					rightCell.push(right);
					var tr = $(node).parent();
					if(tr && tr != null && tr.length > 0 && tr[0].nodeName == "TR") {
						var index = 1;
						var rowspan = this.parseInt(node.getAttribute("rowspan"), 1);
						while(tr && tr != null && tr.length > 0) {
							if(index > rowspan) {
								break;
							}
							for(var i = 0; i < tr.children().length; i++) {
								var td = tr.children().get(i);
								if(rightCellIndex == this.parseInt(td.getAttribute("data-table-cell-index"), 0)) {
									if(index > 1) {
										rightCell.push(td);
									}
									if(this.parseInt(td.getAttribute("rowspan"), 1) > 1) {
										index += (this.parseInt(td.getAttribute("rowspan"), 1) - 1);
									}
								}
							}
							if(tr[0].nodeName == "TR") {
								index++;
							}
							tr = tr.next();
						}
					} else {
						console.error(node);
					}
				} else {
					rightCell.push(right);
				}
			}
			if(rightCell != null && rightCell.length > 0) {
				var copyBorderRight = true;
				var copyBorderLeft = false;
				for(var i = 0; i < rightCell.length; i++) {
					if(this.validBorderStyle(rightCell[i], "left")) {
						copyBorderLeft = true;
					} else {
						copyBorderRight = false;
					}
				}
				if(copyBorderRight) {
					for(var i = 0; i < rightCell.length; i++) {
						this.copyBorder(node, rightCell[i], "right", "left");
					}
					this.removeBorder(node, "right");
				} else if(copyBorderLeft) {
					for(var i = 0; i < rightCell.length; i++) {
						this.copyBorder(rightCell[i], node, "left", "right");
						this.removeBorder(rightCell[i], "left");
					}
				}
			}
		} else {
			this.copyBorder(this.tableElement, node, "right", "right");
		}
	}
	if(this.validBorderStyle(node, "bottom")) {
		var tr = $(node).parent();
		if(tr && tr != null && tr.length > 0 && tr[0].nodeName == "TR") {
			var index = 0;
			var rowspan = this.parseInt(node.getAttribute("rowspan"), 1);
			while(tr && tr != null && tr.length > 0) {
				if(index >= rowspan) {
					break;
				}
				if(tr[0].nodeName == "TR") {
					index++;
				}
				tr = tr.next();
			}
			if(tr && tr != null && tr.length > 0) {
				var overCell = null;
				for(var i = 0; i < tr.children().length; i++) {
					var td = tr.children().get(i);
					if(
						colIndex < this.parseInt(td.getAttribute("data-table-cell-index"), 1) + this.parseInt(td.getAttribute("colspan"), 1) &&
						colIndex + this.parseInt(node.getAttribute("colspan"), 1) > this.parseInt(td.getAttribute("data-table-cell-index"), 1)
					) {
						if(overCell == null) {
							overCell = new Array();
						}
						overCell.push(td);
					}
				}
				if(overCell != null) {
					var copyBorderBottom = true;
					var copyBorderTop = false;
					for(var i = 0; i < overCell.length; i++) {
						if(this.validBorderStyle(overCell[i], "top")) {
							copyBorderTop = true;
						} else {
							copyBorderBottom = false;
						}
					}
					if(copyBorderBottom) {
						for(var i = 0; i < overCell.length; i++) {
							this.copyBorder(node, overCell[i], "bottom", "top");
						}
						this.removeBorder(node, "bottom");
					} else if(copyBorderTop) {
						for(var i = 0; i < overCell.length; i++) {
							this.copyBorder(node, overCell[i], "top", "bottom");
							this.removeBorder(overCell[i], "top");
						}
					}
				} else {
					this.copyBorder(this.tableElement, node, "bottom", "bottom");
				}
			} else {
				this.copyBorder(this.tableElement, node, "bottom", "bottom");
			}
		} else {
			console.error(node);
		}
	}
	if(window.document.documentMode) {
		this.applyBorderMininumWidth(node);
	}
};
GrahaOdtTableBorderCollapser.prototype.tr = function(node, rowIndex, colCount) {
	if(node == null) {
		return null;
	}
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "TH") {
				this.td(node.childNodes[i], rowIndex, colCount);
			} else if(node.childNodes[i].nodeName == "TD") {
				this.td(node.childNodes[i], rowIndex, colCount);
			}
		}
	}
};
GrahaOdtTableBorderCollapser.prototype.colgroup = function(node) {
	if(node == null) {
		return null;
	}
	var colCount = 0;
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "COL") {
				colCount++;
			}
		}
	}
	return colCount;
};
GrahaOdtTableBorderCollapser.prototype.getBorder = function(node, position) {
	return {
		style: $(node).css("border-" + position + "-style"),
		width: $(node).css("border-" + position + "-width"),
		color: $(node).css("border-" + position + "-color"),
		toString: function() {
			if(this.ignoreDotted) {
				return (this.width + " solid " + this.color + "");
			} else {
				return (this.width + " " + this.style + " " + this.color + "");
			}
		}
	};
};
GrahaOdtTableBorderCollapser.prototype.applyCss = function(node, name, value) {
	if(arguments.length > 0) {
		if(this.css == null) {
			this.css = new Array();
		}
		var css = {
			node: node,
			name: name,
			value: value,
			log: function() {
				console.log($(this.node), this.name, this.value);
			}
		};
		this.css.push(css);
	} else {
		if(this.css != null) {
			for(var i = 0; i < this.css.length; i++) {
				$(this.css[i].node).css(this.css[i].name, this.css[i].value);
			}
		}
	}
};
GrahaOdtTableBorderCollapser.prototype.fixDotted = function(node) {
	if(this.ignoreDotted) {
		var border = this.getBorder(node, "top");
		if(border.style == "dotted") {
			border.style = "solid";
			this.applyCss(node, "border-top", border.toString());
		}
		border = this.getBorder(node, "right");
		if(border.style == "dotted") {
			border.style = "solid";
			this.applyCss(node, "border-right", border.toString());
		}
		border = this.getBorder(node, "bottom");
		if(border.style == "dotted") {
			border.style = "solid";
			this.applyCss(node, "border-bottom", border.toString());
		}
		border = this.getBorder(node, "left");
		if(border.style == "dotted") {
			border.style = "solid";
			this.applyCss(node, "border-left", border.toString());
		}
	}
};
GrahaOdtTableBorderCollapser.prototype.table = function(node) {
	if(node == null) {
		return;
	}
	if($(node).css("border-collapse") != null && $(node).css("border-collapse") == "collapse") {
		this.tableElement = node;
		var rowIndex = 1;
		var colCount = 0;
		this.fixDotted(node);
		if(node.getAttribute("data-hwpx-column-count") != null) {
			colCount = this.parseInt(node.getAttribute("data-hwpx-column-count"), 0);
		} else {
			for(var i = 0; i < node.childNodes.length; i++) {
				if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
					if(node.childNodes[i].nodeName == "COLGROUP") {
						colCount += this.colgroup(node.childNodes[i]);
					} else if(node.childNodes[i].nodeName == "COL") {
						colCount++;
					}
				}
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "TR") {
					this.tr(node.childNodes[i], rowIndex, colCount);
					rowIndex++;
				}
			}
		}
		if(this.validBorderStyle(node, "left")) {
			this.removeBorder(node, "left");
		}
		if(this.validBorderStyle(node, "right")) {
			this.removeBorder(node, "right");
		}
		if(this.validBorderStyle(node, "top")) {
			this.removeBorder(node, "top");
		}
		if(this.validBorderStyle(node, "bottom")) {
			this.removeBorder(node, "bottom");
		}
		this.applyCss(node, "border-collapse", "separate");
		this.applyCss();
	}
};

