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
GrahaOdtTableBorderCollapser.prototype.copyBorder = function(from, to, fromPosition, toPosition) {
	if($(to).css("border-" + toPosition + "-style") == "none") {
		if(
			$(from).css("border-" + fromPosition + "-style") &&
			$(from).css("border-" + fromPosition + "-style") != null &&
			$(from).css("border-" + fromPosition + "-style") != "none"
		) {
			$(to).css("border-" + toPosition + "-width", $(from).css("border-" + fromPosition + "-width"));
			$(to).css("border-" + toPosition + "-color", $(from).css("border-" + fromPosition + "-color"));
			$(to).css("border-" + toPosition + "-style", $(from).css("border-" + fromPosition + "-style"));
		}
	}
};
GrahaOdtTableBorderCollapser.prototype.td = function(node, rowIndex, colCount) {
	if(node == null) {
		return null;
	}
	var colIndex = this.parseInt(node.getAttribute("data-table-cell-index"), 0);
	this.fixDotted(node);
	if(rowIndex == 1) {
		this.copyBorder(this.table, node, "top", "top");
	}
	if(colIndex == 1) {
		this.copyBorder(this.table, node, "left", "left");
	}
	if($(node).css("border-right-style") == "none") {
	} else {
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
			if(right != null) {
				rightCell = new Array();
				if(node.getAttribute("rowspan") != null) {
					var tr = $(node).parent();
					if(tr && tr != null && tr.length > 0 && tr[0].nodeName == "TR") {
						var index = 1;
						var rowspan = this.parseInt(node.getAttribute("rowspan"), 1);
						while(tr && tr != null && tr.length > 0) {
							if(index >= rowspan) {
								break;
							}
							for(var i = 0; i < tr.children().length; i++) {
								var td = tr.children().get(i);
								if(rightCellIndex == this.parseInt(td.getAttribute("data-table-cell-index"), 0)) {
									rightCell.push(td);
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
				if(rightCell.length == 1) {
					if($(rightCell).css("border-left-style") == "none") {
					} else {
						$(node).css("border-right-style", "none");
					}
				} else {
					for(var i = 0; i < rightCell.length; i++) {
						this.copyBorder(node, rightCell[i], "right", "left");
					}
					$(node).css("border-right-style", "none");
				}
			}
		} else {
			this.copyBorder(this.table, node, "right", "right");
		}
	}
	if($(node).css("border-bottom-style") == "none") {
	} else {
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
					if(overCell.length == 1) {
						if($(overCell).css("border-top-style") == "none") {
						} else {
							$(node).css("border-bottom-style", "none");
						}
					} else {
						for(var i = 0; i < overCell.length; i++) {
							this.copyBorder(node, overCell[i], "bottom", "top");
						}
						$(node).css("border-bottom-style", "none");
					}
				} else {
					this.copyBorder(this.table, node, "bottom", "bottom");
				}
			} else {
				this.copyBorder(this.table, node, "bottom", "bottom");
			}
		} else {
			console.error(node);
		}
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
GrahaOdtTableBorderCollapser.prototype.fixDotted = function(node) {
	if(this.ignoreDotted) {
		if($(node).css("border-top-style") == "dotted") {
			$(node).css("border-top-style", "solid");
		}
		if($(node).css("border-bottom-style") == "dotted") {
			$(node).css("border-bottom-style", "solid");
		}
		if($(node).css("border-left-style") == "dotted") {
			$(node).css("border-left-style", "solid");
		}
		if($(node).css("border-right-style") == "dotted") {
			$(node).css("border-right-style", "solid");
		}
	}
};
GrahaOdtTableBorderCollapser.prototype.table = function(node) {
	if(node == null) {
		return null;
	}
	this.table = node;
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
};

