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
 * GrahaHwpXPageSplitter

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.6.0.1
 * @since 0.6
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.6.0.1
 */

function GrahaHwpXPageSplitter(options) {
	if(options && options != null && options.scaleRatio && options.scaleRatio != null) {
		this.scaleRatio = options.scaleRatio;
	} else {
		this.scaleRatio = 1;
	}
	if(options && options != null && options.grahaPageInnerSectionClassName && options.grahaPageInnerSectionClassName != null) {
		this.grahaPageInnerSectionClassName = options.grahaPageInnerSectionClassName;
	}
	this.availableMode = "page";
	this.availableHeight = 0;
}
GrahaHwpXPageSplitter.prototype.parseInt = function(str, defaultValue) {
	return GrahaPdfConverterUtility.parseInt(str, defaultValue);
};
GrahaHwpXPageSplitter.prototype.parseFloat = function(str, defaultValue) {
	return GrahaPdfConverterUtility.parseFloat(str, defaultValue);
};
GrahaHwpXPageSplitter.prototype.offsetTopWithMargin = function(node) {
	return GrahaPdfConverterUtility.offsetTopWithMargin(node, this.scaleRatio);
};
GrahaHwpXPageSplitter.prototype.offsetTopWithoutMargin = function(node) {
	return GrahaPdfConverterUtility.offsetTopWithoutMargin(node, this.scaleRatio);
};
GrahaHwpXPageSplitter.prototype.offsetBottomWithMargin = function(node) {
	return GrahaPdfConverterUtility.offsetBottomWithMargin(node, this.scaleRatio);
};
GrahaHwpXPageSplitter.prototype.offsetBottomWithoutMargin = function(node) {
	return GrahaPdfConverterUtility.offsetBottomWithoutMargin(node, this.scaleRatio);
};
GrahaHwpXPageSplitter.prototype.outerHeightWithMargin = function(node) {
	return GrahaPdfConverterUtility.outerHeightWithMargin(node, this.scaleRatio);
};
GrahaHwpXPageSplitter.prototype.height = function(node) {
	return GrahaPdfConverterUtility.height(node, this.scaleRatio);
};
GrahaHwpXPageSplitter.prototype.copy = function(node) {
	return GrahaOdtPageSplitterUtility.copy(node);
};
GrahaHwpXPageSplitter.prototype.copyA = function(node, root) {
	return GrahaOdtPageSplitterUtility.copyA(node, root);
};
GrahaHwpXPageSplitter.prototype.getCurrentSep = function(node) {
	if(node && node != null && node.length > 0) {
		return this.offsetBottomWithMargin(node);
	}
	return null;
};
GrahaHwpXPageSplitter.prototype.prevNodeForOffset = function(node) {
	return GrahaOdtPageSplitterUtility.prevNodeForOffset(node);
};
GrahaHwpXPageSplitter.prototype.getPrevSep = function(node) {
	if(node && node != null && node.length > 0) {
		var prev = this.prevNodeForOffset(node);
		if(prev && prev != null && prev.length > 0) {
			sep = this.offsetBottomWithMargin(prev);
		} else {
			sep = this.offsetBottomWithMargin(node);
		}
		return sep;
	} else {
		console.log(node);
	}
	return null;
};
GrahaHwpXPageSplitter.prototype.getLastPageInnerSection = function(lastPage) {
	if(lastPage != null) {
		if(lastPage.childNodes && lastPage.childNodes != null && lastPage.childNodes.length > 0) {
			for(var i = 0; i < lastPage.childNodes.length; i++) {
				if(Node.DOCUMENT_NODE == lastPage.childNodes[i].nodeType || Node.ELEMENT_NODE == lastPage.childNodes[i].nodeType) {
					if(lastPage.childNodes[i].nodeName == "P") {
						if(lastPage.childNodes[i].getAttribute("class") == this.grahaPageInnerSectionClassName) {
							return lastPage.childNodes[i];
						}
					}
				}
			}
		}
		console.error(lastPage);
	}
	return null;
};
GrahaHwpXPageSplitter.prototype.available = function(node) {
	if(arguments.length > 1) {
		var extra = 0;
		for(var i = 1; i < arguments.length; i++) {
			extra += arguments[i];
		}
		if(this.validAvailableHeightLimit()) {
			if(this.availableHeightLimit > this.outerHeightWithMargin(node) + extra) {
				return true;
			}
		} else {
			if(this.availableHeight > this.outerHeightWithMargin(node) + extra) {
				return true;
			}
		}
	} else if(this.validAvailableHeightLimit()) {
		if(this.availableHeightLimit > this.outerHeightWithMargin(node)) {
			return true;
		}
	} else if(this.availableHeight > this.outerHeightWithMargin(node)) {
		return true;
	}
	return false;
};
GrahaHwpXPageSplitter.prototype.validAvailableHeightLimit = function(node) {
	if(this.availableHeightLimit && this.availableHeightLimit != null) {
		return true;
	} else {
		return false;
	}
};
GrahaHwpXPageSplitter.prototype.plusAvailableHeightLimit = function(node) {
	if(node.nodeName == "TR") {
		var height = null;
		if(node.getAttribute && node.getAttribute("data-height") != null) {
			height = this.parseFloat(node.getAttribute("data-height"));
		} else if(node.attr && node.attr("data-height") != null) {
			height = this.parseFloat(node.attr("data-height"));
		}
		if(height == null) {
			height = this.outerHeightWithMargin(node);
			this.availableHeightLimit += height;
			if(node.setAttribute) {
				node.setAttribute("data-height", height);
			} else if(node.attr) {
				node.attr("data-height", height);
			}
		} else {
			this.availableHeightLimit += height;
		}
		return height;
	} else {
		console.error(node);
	}
};
GrahaHwpXPageSplitter.prototype.resetAvailableHeightLimit = function() {
	this.availableHeightLimit = this.availableHeight;
};
GrahaHwpXPageSplitter.prototype.getAvailableHeight = function() {
	if(this.validAvailableHeightLimit()) {
		return this.availableHeightLimit;
	} else {
		return this.availableHeight;
	}
};
GrahaHwpXPageSplitter.prototype.setAvailableHeight = function(availableHeight) {
	if(this.validAvailableHeightLimit()) {
		this.availableHeightLimit = availableHeight;
	} else {
		this.availableHeight = availableHeight;
	}
};
GrahaHwpXPageSplitter.prototype.clearAvailableHeightLimit = function() {
	this.availableHeightLimit = null;
};
GrahaHwpXPageSplitter.prototype.minusAvailableHeight = function(node) {
	if(node.nodeName == "TABLE") {
		if(this.validAvailableHeightLimit()) {
			if($(node).css("top") == "auto") {
			} else {
				this.availableHeightLimit -= this.parseInt($(node).css("top"), 0);
			}
			this.availableHeightLimit -= this.parseInt($(node).css("margin-top"), 0);
			this.availableHeightLimit -= this.parseInt($(node).css("margin-bottom"), 0);
		} else {
			if($(node).css("top") == "auto") {
			} else {
				this.availableHeight -= this.parseInt($(node).css("top"), 0);
			}
			this.availableHeight -= this.parseInt($(node).css("margin-top"), 0);
			this.availableHeight -= this.parseInt($(node).css("margin-bottom"), 0);
		}
	} else if(node.nodeName == "TR") {
		if(this.validAvailableHeightLimit()) {
			this.availableHeightLimit -= this.outerHeightWithMargin(node);
		} else {
			this.availableHeight -= this.outerHeightWithMargin(node);
		}
	} else if(node.nodeName == "P") {
		if(this.validAvailableHeightLimit()) {
			this.availableHeightLimit -= this.outerHeightWithMargin(node);
		} else {
			this.availableHeight -= this.outerHeightWithMargin(node);
		}
	} else {
		console.error(node);
	}
};
GrahaHwpXPageSplitter.prototype.overflow = function(node, lastPage, footNote) {
	var lastPageInnerSection = null;
	if(arguments.length > 2 && footNote && footNote != null) {
		lastPageInnerSection = this.getLastPageInnerSection(lastPage);
	} else if(node instanceof GrahaDummyElement) {
		lastPageInnerSection = this.getLastPageInnerSection(lastPage);
	} else {
		lastPageInnerSection = node;
	}
	if(lastPageInnerSection == null) {
		throw new Error("lastPageInnerSection is null");
	}
	var lastChild = null;
	if(node.last) {
		lastChild = node.last(false);
	} else {
		lastChild = GrahaDummyElement.last(node);
	}
	if(lastChild == null) {
		throw new Error("lastChild is null");
	}
	var lastPageInnerSectionOffsetBottom = this.offsetBottomWithoutMargin(lastPageInnerSection);
	for(var i = 0; i < lastPageInnerSection.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == lastPageInnerSection.childNodes[i].nodeType || Node.ELEMENT_NODE == lastPageInnerSection.childNodes[i].nodeType) {
			if(lastPageInnerSection.childNodes[i].nodeName == "P") {
				if(lastPageInnerSection.childNodes[i].getAttribute("class") == "graha_page_footnote") {
				} else {
					lastPageInnerSectionOffsetBottom -= this.parseFloat($(lastPageInnerSection.childNodes[i]).css("margin-top"));
				}
				break;
			}
		}
	}
	if(this.offsetBottomWithMargin(lastChild) > lastPageInnerSectionOffsetBottom) {
		var last = null;
		if(arguments.length > 2 && footNote && footNote != null) {
			last = node;
		} else if(lastChild.getAttribute("class") == "graha_page_footnote") {
			lastPageInnerSectionOffsetBottom -= this.outerHeightWithMargin(lastChild);
			last = node.last(true);
		} else {
			last = lastChild;
		}
		this.availableHeight = lastPageInnerSectionOffsetBottom - this.offsetTopWithoutMargin(last);
		if(arguments.length > 2 && footNote && footNote != null) {
		} else if(node instanceof GrahaDummyElement) {
		} else {
			if(lastChild && lastChild != null) {
				if(lastChild.getAttribute("class") == "graha_page_footnote") {
					this.availableHeight -= this.outerHeightWithMargin(lastChild);
				}
			}
		}
		return true;
	}
	return false;
};
GrahaHwpXPageSplitter.prototype.singleLine = function(node, lastPage) {
	if(node == null) {
		return true;
	}
	var result = false;
	if(node.nodeName == "P") {
		return this.singleLineP(node, lastPage);
	} else if(node.nodeName == "TR") {
		return this.singleLineTR(node, lastPage);
	} else if(node.nodeName == "TD") {
		return this.singleLineTD(node, lastPage);
	} else {
	}
	return result;
};
GrahaHwpXPageSplitter.prototype.singleLineP = function(node, lastPage) {
	if(node == null) {
		return true;
	}
	if($(node).find("table").length > 0) {
		return false;
	} else if($(node).find("img").length > 0) {
		return false;
	}
	var index = 0;
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "P") {
				if(index > 0) {
					return false;
				}
				if(this.singleLine(node.childNodes[i])) {
				} else {
					return false;
				}
				index++;
			}
		}
	}
	var result = false;
	var dummy = $(node).clone(true);
	dummy.css("white-space", "nowrap");
	dummy.attr("data-dummy", "true");
	$(node).before(dummy);
	if(this.outerHeightWithMargin(dummy) == this.outerHeightWithMargin(node)) {
		result = true;
	}
	dummy.remove();
	return result;
};
GrahaHwpXPageSplitter.prototype.singleLineTD = function(node, lastPage) {
	if(node == null) {
		return true;
	}
	if($(node).find("table").length > 0) {
		return false;
	} else if($(node).find("img").length > 0) {
		return false;
	}
	var index = 0;
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "P") {
				if(index > 0) {
					return false;
				}
				if(this.singleLine(node.childNodes[i])) {
					if(this.height(node) > this.outerHeightWithMargin(node.childNodes[i]) * 2) {
						return false;
					}
				} else {
					return false;
				}
				index++;
			} else {
				console.error(node.childNodes[i]);
			}
		}
	}
	return true;
};
GrahaHwpXPageSplitter.prototype.singleLineTR = function(node, lastPage) {
	if(node == null) {
		return true;
	}
	if(this.available(node)) {
		return false;
	}
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "TD") {
				if(node.childNodes[i].getAttribute("rowspan") != null && this.parseInt(node.childNodes[i].getAttribute("rowspan"), 1) > 1) {
					continue;
				}
				if(this.singleLineTD(node.childNodes[i])) {
				} else {
					return false;
				}
			} else {
				console.error(node.childNodes[i]);
			}
		}
	}
	return true;
};
GrahaHwpXPageSplitter.prototype.rowspan = function(node, before) {
	return GrahaOdtPageSplitterUtility.rowspan(node, before);
};
GrahaHwpXPageSplitter.prototype.move = function(node, parent) {
	GrahaOdtPageSplitterUtility.move(node, parent);
};
GrahaHwpXPageSplitter.prototype.copyBorder = function(before, after) {
	GrahaOdtPageSplitterUtility.copyBorder(before, after);
};
GrahaHwpXPageSplitter.prototype.td = function(node) {
	var beforeTD = this.copy(node);
	var before = null;
	var initAvailableHeight = this.getAvailableHeight();
	var tdHeight = null;
	if(node.getAttribute("data-initial-height") != null) {
		tdHeight = node.getAttribute("data-initial-height");
	} else {
		tdHeight = $(node).height();
	}
	var beforeHeight = 0;
	if(beforeTD.style && beforeTD.style != null) {
		beforeTD.style.removeProperty("height");
	}
	if(node.style && node.style != null) {
		node.style.removeProperty("height");
	}
	var paddingBottom = 0;
	var borderBottom = 0;
	var paddingTop = 0;
	var borderTop = 0;
	var bottomExtraHeight = 0;
	var topExtraHeight = 0;
	var extraHeight = 0;
	var pIndex = 0;
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "P") {
				if(before == null) {
					before = this.copy(node.childNodes[i]);
					beforeTD.appendChild(before);
				}
				paddingBottom = this.parseFloat($(node.childNodes[i]).css("padding-bottom"), 0);
				paddingTop = this.parseFloat($(node.childNodes[i]).css("padding-top"), 0);
				borderBottom = this.parseFloat($(node).css("border-bottom-width"), 0);
				borderTop = this.parseFloat($(node).css("border-top-width"), 0);
				bottomExtraHeight = borderBottom + paddingBottom;
				topExtraHeight = borderTop + paddingTop;
				extraHeight = borderBottom + paddingBottom + borderTop + paddingTop;
				
				var childNodesLength = node.childNodes[i].childNodes.length;
				for(var x = 0; x < childNodesLength; x++) {
					if(Node.DOCUMENT_NODE == node.childNodes[i].childNodes[x].nodeType || Node.ELEMENT_NODE == node.childNodes[i].childNodes[x].nodeType) {
						if(node.childNodes[i].childNodes[x].nodeName == "P") {
							beforeHeight += this.outerHeightWithMargin(node.childNodes[i].childNodes[x]);
							if(this.available(node.childNodes[i].childNodes[x], extraHeight)) {
								this.minusAvailableHeight(node.childNodes[i].childNodes[x]);
								before.appendChild(node.childNodes[i].childNodes[x]);
								x--;
								childNodesLength--;
							} else {
								var result = this.paragraph(node.childNodes[i].childNodes[x]);
								this.move(node.childNodes[i].childNodes[x], before);
								if(result != null && result.before != null) {
									before.appendChild(result.before);
								} else if(pIndex == 0) {
									return {
										before: null,
										after: node,
										extraHeight: extraHeight,
										sep: result.sep
									};
								}
								if(before.childNodes.length == 0) {
									var p = document.createElement("p");
									var font = document.createElement("font");
									var span = document.createElement("span");
									span.appendChild(document.createTextNode('\u180E'));
									font.appendChild(span);
									p.appendChild(font);
									before.appendChild(p);
								}
								if(result != null && result.after != null) {
									$(node.childNodes[i]).prepend(result.after);
								}
								beforeHeight -= this.outerHeightWithMargin(result.after);
								var beforeOuterHeight = Math.max(beforeHeight, initAvailableHeight - (extraHeight * 2));
								var afterOuterHeight = tdHeight - beforeOuterHeight - extraHeight;

								$(beforeTD).css("height", beforeOuterHeight + "px");
								$(node).css("height", afterOuterHeight + "px");
								return {
									before: beforeTD,
									after: node,
									extraHeight: extraHeight,
									sep: result.sep
								};
							}
							pIndex++;
						} else {
							console.error(node.childNodes[i].childNodes[x]);
						}
					}
				}
			} else {
				console.error(node.childNodes[i]);
			}
		}
	}
	var beforeOuterHeight = Math.max(beforeHeight, initAvailableHeight - (extraHeight * 2));
	var afterOuterHeight = tdHeight - beforeOuterHeight - extraHeight;
	
	$(beforeTD).css("height", beforeOuterHeight + "px");
	$(node).css("height", afterOuterHeight + "px");

	return {
		before: beforeTD,
		after: node,
		extraHeight: extraHeight,
		sep: this.getCurrentSep($(node))
	};
};
GrahaHwpXPageSplitter.prototype.tr = function(node) {
	if(node == null) {
		return null;
	}
	var before = this.copy(node);
	var initAvailableHeight = this.getAvailableHeight();
	var trHeight = $(node).height();
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "TD") {
				if(node.childNodes[i].getAttribute("data-graha-splitted") != null && node.childNodes[i].getAttribute("data-graha-splitted") == "true") {
					continue;
				}
				this.setAvailableHeight(initAvailableHeight);
				var result = this.td(node.childNodes[i]);
				if(result != null && result.before != null) {
					before.appendChild(result.before);
				}
				if(result != null && result.after != null) {
				}
			}
		}
	}
	$(node).before(before);

	return {
		before: before,
		after: node,
		sep: this.getCurrentSep($(before))
	};
};
GrahaHwpXPageSplitter.prototype.splitRowspan = function(node, tds) {
	return GrahaOdtPageSplitterUtility.splitRowspan(node, tds, this);
};
GrahaHwpXPageSplitter.prototype.setTableInitialHeightAttribute = function(node) {
	return GrahaOdtPageSplitterUtility.setTableInitialHeightAttribute(node);
};
GrahaHwpXPageSplitter.prototype.modifyRowspan = function(requireModifyRowspan) {
	return GrahaOdtPageSplitterUtility.modifyRowspan(requireModifyRowspan);
};
GrahaHwpXPageSplitter.prototype.table = function(node) {
	if(node == null) {
		return null;
	}
	this.setTableInitialHeightAttribute(node);
	var before = null;
	var lastAvailableNode = null;
	var tableHeight = $(node).height();
	this.minusAvailableHeight(node);
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "COLGROUP") {
			} else if(node.childNodes[i].nodeName == "TR") {
				if(this.available(node.childNodes[i])) {
					this.minusAvailableHeight(node.childNodes[i]);
					lastAvailableNode = node.childNodes[i];
				} else {
					if(this.singleLine(node.childNodes[i])) {
						before = this.copy(node);
						if(before.style && before.style != null) {
							before.style.removeProperty("height");
						}
						var tds = this.rowspan(node.childNodes[i], node);
						var requireModifyRowspan = null;
						if(tds != null) {
							requireModifyRowspan = this.splitRowspan(node.childNodes[i], tds);
							this.clearAvailableHeightLimit();
						}
						this.move(node.childNodes[i], before);
						if(requireModifyRowspan != null) {
							this.modifyRowspan(requireModifyRowspan);
						}
						$(node).before(before);
						this.copyBorder(before, node);
						$(node).height(tableHeight - $(before).height());
						return {
							before: before,
							after: node,
							sep: this.getCurrentSep($(before))
						};
					} else {
						before = this.copy(node);
						if(before.style && before.style != null) {
							before.style.removeProperty("height");
						}
						var tds = this.rowspan(node.childNodes[i], node);
						var requireModifyRowspan = null;
						if(tds != null) {
							requireModifyRowspan = this.splitRowspan(node.childNodes[i], tds);
							this.clearAvailableHeightLimit();
						}
						$(node).before(before);
						if(this.available(before)) {
							var result = this.tr(node.childNodes[i]);
							this.move(node.childNodes[i], before);
							if(requireModifyRowspan != null) {
								this.modifyRowspan(requireModifyRowspan);
							}
							before.appendChild(result.before);
							if(result.after != null) {
								if(node.firstChild && node.firstChild != null && node.firstChild.nodeName == "COLGROUP") {
									$(node.firstChild).after(result.after);
								} else {
									$(node).prepend(result.after);
								}
								this.copyBorder(before, node);
							}
							$(node).height(tableHeight - $(before).height());
							return {
								before: before,
								after: node,
								sep: this.getCurrentSep($(before))
							};
						} else {
							$(before).remove();
							return {
								before: null,
								after: node,
								sep: this.getPrevSep($(before))
							};
						}
					}
				}
			} else {
				console.error(node.childNodes[i]);
			}
		} else if(Node.TEXT_NODE == node.childNodes[i].nodeType) {
		}
	}
	return {
		before: node,
		after: null,
		sep: this.getCurrentSep($(node))
	};
};
GrahaHwpXPageSplitter.prototype.span = function(node, splitter, lastPage) {
	if(node == null) {
		return;
	}
	var spanB = this.copy(node);
	var spanA = null;
	if(splitter.pageBreak) {
	} else {
		splitter.parentB.appendChild(spanB);
	}
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			console.error(node.childNodes[i]);
		} else if(Node.TEXT_NODE == node.childNodes[i].nodeType) {
			var text = node.childNodes[i].nodeValue;
			for(var x = 0; x < text.length; x++) {
				if(splitter.pageBreak) {
					if(spanA == null) {
						spanA = this.copy(node);
						splitter.parentA.appendChild(spanA);
					}
					spanA.appendChild(document.createTextNode(text.charAt(x)));
				} else {
					spanB.appendChild(document.createTextNode(text.charAt(x)));
					if(this.available(splitter.before)) {
					} else {
						splitter.pageBreak = true;
						spanB.removeChild(spanB.lastChild);
						var copyed = this.copyA($(spanB), splitter.before);
						if(copyed != null) {
							splitter.after = copyed.after;
							spanA = copyed.parentA;
							if(
								splitter.parentA == null &&
								$(spanA).parent() &&
								$(spanA).parent() != null &&
								$(spanA).parent().length > 0
							) {
								splitter.parentA = $(spanA).parent()[0];
							}
						} else {
							console.error(spanB, splitter.before);
						}
						x--;
					}
				}
			}
		}
	}
};
GrahaHwpXPageSplitter.prototype.parentNode = function(node, parentNodeName) {
	return GrahaOdtPageSplitterUtility.parentNode(node, parentNodeName);
};
GrahaHwpXPageSplitter.prototype.font = function(node, paragraph, splitter, lastPage) {
	if(node == null) {
		return null;
	}
	splitter.parentB = this.copy(node);
	var fontA = null;
	splitter.before.appendChild(splitter.parentB);
	var childNodesLength = node.childNodes.length;
	var orig = node.outerHTML;
	for(var i = 0; i < childNodesLength; i++) {
		if(node.childNodes[i] && node.childNodes[i] != null) {
		} else {
			continue;
		}
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "SPAN") {
				if(splitter.pageBreak) {
					if(splitter.parentA && splitter.parentA != null) {
					} else {
						fontA = this.copy(node);
						splitter.parentA = fontA;
						splitter.after.appendChild(fontA);
					}
					splitter.parentA.appendChild(node.childNodes[i]);
					continue;
				}
				this.span(node.childNodes[i], splitter, lastPage);
				if(splitter.after != null) {
					if(fontA == null && splitter.parentA != null) {
						fontA = this.parentNode(splitter.parentA, "FONT");
					}
					splitter.pageBreak = true;
				}
			} else if(node.childNodes[i].nodeName == "TABLE") {
				if(splitter.pageBreak) {
					if(splitter.parentA && splitter.parentA != null) {
					} else {
						fontA = this.copy(node);
						splitter.parentA = fontA;
						splitter.after.appendChild(fontA);
					}
					splitter.parentA.appendChild(node.childNodes[i]);
				} else {
					var splittedTable = this.table(node.childNodes[i]);
					if(splittedTable.after != null) {
						if(splitter.after == null) {
							splitter.after = this.copy(paragraph);
						}
						if(fontA == null) {
							fontA = this.copy(node);
							splitter.parentA = fontA;
							splitter.after.appendChild(fontA);
						}
						splitter.parentA.appendChild(splittedTable.after);
						splitter.pageBreak = true;
					}
					if(splittedTable.before != null) {
						splitter.parentB.appendChild(splittedTable.before);
						if(splittedTable.after == null) {
							i--;
							childNodesLength--;
						}
					}
				}
			} else {
				console.error(node.childNodes[i]);
			}
		}
	}
	var splitted = null;
	if(splitter.pageBreak) {
		$(paragraph).before($(splitter.after));
		$(paragraph).remove();
		if(this.empty(splitter.before)) {
			splitted = {
				before: null,
				after: splitter.after,
				sep: this.getCurrentSep($(splitter.before))
			};
		} else {
			$(splitter.after).css("text-indent", 0);
			splitted = {
				before: splitter.before,
				after: splitter.after,
				sep: this.getCurrentSep($(splitter.before))
			};
		}
	} else {
		splitted = {
			before: splitter.before,
			after: null,
			sep: this.getCurrentSep($(splitter.before))
		};
	}
	splitter.parentA = null;
	return splitted;
};
GrahaHwpXPageSplitter.prototype.empty = function(node) {
	if($.trim($(node).text()) == "") {
		return true;
	} else {
		return false;
	}
};
GrahaHwpXPageSplitter.prototype.paragraph = function(node, lastPage) {
	if(node != null) {
		if(this.singleLine(node, lastPage)) {
			return {
				before: null,
				after: node,
				sep: this.getPrevSep($(node))
			};
		} else {
		}
		var splitted = null;
		var splitter = null;
		if(node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
			for(var i = 0; i < node.childNodes.length; i++) {
				if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
					if(node.childNodes[i].nodeName == "FONT") {
						if(splitter == null) {
							splitter = {
								root: node,
								before: this.copy(node),
								after: null,
								pageBreak: false
							};
							$(node).before($(splitter.before));
						}
						splitted = this.font(node.childNodes[i], node, splitter, lastPage);
					} else {
						console.error(node.childNodes[i]);
					}
				}
			}
			$(node).remove();
		}
		return splitted;
	}
	return null;
};
GrahaHwpXPageSplitter.prototype.splitFootNote = function(footNote, lastPage) {
	if(footNote != null) {
		if(footNote instanceof GrahaDummyElement) {
			var result = {before:null, after: null};
			var overflowed = false;
			for(var a = 0; a < footNote.elements.length; a++) {
				var node = footNote.elements[a];
				if(node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
					if(overflowed) {
						if(result.after == null) {
							result.after = new Array();
						}
						result.after.push(node.childNodes[i]);
						continue;
					}
					if(this.overflow(node, lastPage, true)) {
					} else {
						if(result.before == null) {
							result.before = new Array();
						}
						result.before.push(node);
						continue;
					}
					var childNodesLength = node.childNodes.length;
					for(var i = 0; i < childNodesLength; i++) {
						if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
							if(node.childNodes[i].nodeName == "P") {
								if(overflowed) {
									if(result.after == null) {
										result.after = new Array();
									}
									result.after.push(node.childNodes[i]);
								} else {
									overflowed = this.overflow(node.childNodes[i], lastPage, true);
									if(overflowed) {
										if(this.singleLine(node.childNodes[i])) {
											if(result.after == null) {
												result.after = new Array();
											}
											result.after.push(node.childNodes[i]);
											continue;
										}
										var splitted = this.split(node.childNodes[i]);
										if(splitted.before != null && splitted.after != null) {
											i++;
											childNodesLength++;
										}
										if(splitted.before != null) {
											if(result.before == null) {
												result.before = new Array();
											}
											result.before.push(splitted.before);
										}
										if(splitted.after != null) {
											if(result.after == null) {
												result.after = new Array();
											}
											result.after.push(splitted.after);
										}
									} else {
										if(result.before == null) {
											result.before = new Array();
										}
										result.before.push(node.childNodes[i]);
									}
								}
							} else {
								console.error(node.childNodes[i]);
							}
						}
					}
				}
			}
			return result;
		} else {
			console.error(footNote);
		}
	}
	return null;
};
GrahaHwpXPageSplitter.prototype.split = function(node, lastPage) {
	if(node != null) {
		if(node instanceof GrahaDummyElement) {
			return this.splitFootNote(node, lastPage);
		} else if(node.nodeName == "P") {
			return this.paragraph(node, lastPage);
		}
	}
	return null;
};
