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
 * GrahaOdtPageSplitter
 * GrahaOdt2HtmlConverter 로 변환한 HTML 을 페이지 별로 분리한다.

 * GrahaOdt2PdfConverter 전체적인 사용법은 README.md 를 참조한다.

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.5.0.4
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/odt2pdf/0.5.0.4
 */

function GrahaOdtPageSplitter(options) {
	if(options && options != null && options.scaleRatio && options.scaleRatio != null) {
		this.scaleRatio = options.scaleRatio;
	} else {
		this.scaleRatio = 1;
	}
	if(options && options != null && options.pageLayout && options.pageLayout != null) {
		this.pageLayout = options.pageLayout;
	} else {
		this.pageLayout = null;
	}
	this.availableMode = "page";
}
GrahaOdtPageSplitter.prototype.parseInt = function(str, defaultValue) {
	return GrahaPdfConverterUtility.parseInt(str, defaultValue);
};
GrahaOdtPageSplitter.prototype.parseFloat = function(str, defaultValue) {
	return GrahaPdfConverterUtility.parseFloat(str, defaultValue);
};
GrahaOdtPageSplitter.prototype.offsetBottomWithoutMargin = function(node) {
	return GrahaPdfConverterUtility.offsetBottomWithoutMargin(node, this.scaleRatio);
};
GrahaOdtPageSplitter.prototype.width = function(node) {
	return GrahaPdfConverterUtility.width(node, this.scaleRatio);
};
GrahaOdtPageSplitter.prototype.positionBottomWithMargin = function(node) {
	return GrahaPdfConverterUtility.positionBottomWithMargin(node, this.scaleRatio);
};
GrahaOdtPageSplitter.prototype.offsetTopWithoutMargin = function(node) {
	return GrahaPdfConverterUtility.offsetTopWithoutMargin(node, this.scaleRatio);
};
GrahaOdtPageSplitter.prototype.offsetBottomWithMargin = function(node) {
	return GrahaPdfConverterUtility.offsetBottomWithMargin(node, this.scaleRatio);
};
GrahaOdtPageSplitter.prototype.height = function(node) {
	return GrahaPdfConverterUtility.height(node, this.scaleRatio);
};
GrahaOdtPageSplitter.prototype.offsetTopWithMargin = function(node) {
	return GrahaPdfConverterUtility.offsetTopWithMargin(node, this.scaleRatio);
};
GrahaOdtPageSplitter.prototype.outerHeightWithMargin = function(node) {
	return GrahaPdfConverterUtility.outerHeightWithMargin(node, this.scaleRatio);
};
GrahaOdtPageSplitter.prototype.clear = function(node) {
	GrahaOdtPageSplitterUtility.clear(node);
};
GrahaOdtPageSplitter.prototype.copy = function(node) {
	return GrahaOdtPageSplitterUtility.copy(node);
};
GrahaOdtPageSplitter.prototype.copyA = function(node, root) {
	return GrahaOdtPageSplitterUtility.copyA(node, root);
};
GrahaOdtPageSplitter.prototype.footNoteCurrentHeight = function(node) {
	if(node && node != null) {
		if(this.footNotes && this.footNotes != null) {
			return this.footNoteHeight($(node));
		}
	}
	return 0;
};
GrahaOdtPageSplitter.prototype.footNoteHeight = function(node) {
	var nodeOffsetBottom = 0;
	if(node && node != null && node.length > 0) {
		nodeOffsetBottom = this.offsetBottomWithMargin(node);
	}
	var footNoteHeight = 0;
	if(this.footNotes != null) {
		for(var i = 0; i < this.footNotes.length; i++) {
			if(this.footNotes[i].page == null) {
				if(nodeOffsetBottom > this.footNotes[i].refTop + this.footNotes[i].refHeight) {
					footNoteHeight += this.footNotes[i].height;
				}
			} else if(this.footNotes[i].page == this.lastPageNumber) {
				footNoteHeight += this.footNotes[i].height;
			}
		}
		if(footNoteHeight > 0) {
			if(this.footNoteSep && this.footNoteSep != null && this.footNoteSep.height && this.footNoteSep.height != null) {
				footNoteHeight += this.footNoteSep.height;
			}
		}
	}
	return footNoteHeight;
};
GrahaOdtPageSplitter.prototype.prevNodeForOffset = function(node) {
	return GrahaOdtPageSplitterUtility.prevNodeForOffset(node);
};
GrahaOdtPageSplitter.prototype.footNotePrevHeight = function(node) {
	if(node && node != null) {
		if(this.footNotes && this.footNotes != null) {
			return this.footNoteHeight(this.prevNodeForOffset($(node)));
		}
	}
	return 0;
};
GrahaOdtPageSplitter.prototype.footerHeight = function() {
	if(this.footerNode && this.footerNode != null && this.footerNode.length > 0) {
		return this.outerHeightWithMargin(this.footerNode);
	}
	return 0;
};
GrahaOdtPageSplitter.prototype.headerHeight = function() {
	if(this.headerNode && this.headerNode != null && this.headerNode.length > 0) {
		return this.outerHeightWithMargin(this.headerNode);
	}
	return 0;
};
GrahaOdtPageSplitter.prototype.pageHeight = function() {
	if(this.currentPage && this.currentPage != null) {
		return this.height(this.currentPage);
	} else {
	}
	return 0;
};
GrahaOdtPageSplitter.prototype.pageWidth = function() {
	if(this.currentPage && this.currentPage != null) {
		return this.width(this.currentPage);
	} else {
	}
	return 0;
};
GrahaOdtPageSplitter.prototype.availablePageHeight = function() {
	if(this.offsetBottomLimit && this.offsetBottomLimit != null) {
		return Math.floor(this.offsetBottomLimit  - this.offsetTopWithoutMargin(this.entirePageNode));
	} else {
		return Math.floor(this.pageHeight() - this.footerHeight() - this.headerHeight());
	}
};
GrahaOdtPageSplitter.prototype.availablePageHeightWithPrevFootNote = function(node) {
	if(this.offsetBottomLimit && this.offsetBottomLimit != null) {
		if(this.availableMode == "note") {
			return Math.floor(this.offsetBottomLimit - this.availableCurrentPageBottom - this.footerHeight());
		} else {
			return Math.floor(this.offsetBottomLimit - this.offsetTopWithoutMargin(this.entirePageNode));
		}
	} else {
		if(this.availableMode == "note") {
			return Math.floor(this.pageHeight() - this.availableCurrentPageBottom - this.footerHeight());
		} else {
			return Math.floor(this.availablePageHeight() - this.footNotePrevHeight(node));
		}
	}
};
GrahaOdtPageSplitter.prototype.availablePageHeightWithCurrentFootNote = function(node) {
	if(this.offsetBottomLimit && this.offsetBottomLimit != null) {
		return Math.floor(this.offsetBottomLimit - this.offsetTopWithoutMargin(this.entirePageNode));
	} else {
		return Math.floor(this.availablePageHeight() - this.footNoteCurrentHeight(node));
	}
};
GrahaOdtPageSplitter.prototype.availableWithCurrentFootNote = function(node, extraHeight) {
	if(node == null) {
		return true;
	}
	if(extraHeight && extraHeight != null) {
	} else {
		extraHeight = 0;
	}
	if(this.availablePageHeightWithCurrentFootNote(node) > this.offsetBottomWithMargin(node) - this.offsetTopWithoutMargin(this.entirePageNode) + extraHeight) {
		return true;
	}
	return false;
};
GrahaOdtPageSplitter.prototype.available = function(node, extraHeight) {
	if(node == null) {
		return true;
	}
	if(extraHeight && extraHeight != null) {
		extraHeight = extraHeight;
	} else {
		extraHeight = 0;
	}
	if(this.availableMode == "note") {
		if(this.availablePageHeightWithPrevFootNote(node) > this.outerHeightWithMargin(node)) {
			return true;
		}
	} else {
		if(this.availablePageHeightWithPrevFootNote(node) > this.offsetBottomWithMargin(node) - this.offsetTopWithoutMargin(this.entirePageNode) + extraHeight) {
			return true;
		}
	}
	return false;
};
GrahaOdtPageSplitter.prototype.init = function() {
	this.prevFootNoteId = null;
	this.wrapperSelector = "div#GrahaOdt2HtmlConverterWrapper";
	this.entirePageSelector = this.wrapperSelector + " p.graha_entire_page";
	
	this.scaleWrapperSelector = "div#GrahaOdt2HtmlConverterScaleWrapper";
	
	this.footNoteSelector = this.wrapperSelector + " div.graha_footnote";
	this.footerSelector = this.wrapperSelector + " div.graha_footer";
	this.headerSelector = this.wrapperSelector + " div.graha_header";
	
	this.footNoteNode = $(this.footNoteSelector);
	this.footerNode = $(this.footerSelector);
	this.headerNode = $(this.headerSelector);
	
	this.footNotes = null;
	this.footNoteSep = null;
	if(this.footNoteNode && this.footNoteNode != null && this.footNoteNode.length > 0) {
		this.footNotes = new Array();
		for(var i = 0; i < this.footNoteNode[0].childNodes.length; i++) {
			if(this.footNoteNode[0].childNodes[i].nodeName == "HR") {
				this.footNoteSep = {
					height: this.outerHeightWithMargin(this.footNoteNode[0].childNodes[i]),
					element: this.footNoteNode[0].childNodes[i]
				};
			} else {
				var footnote = {
					page: null,
					ref: "footnote_" + this.footNoteNode[0].childNodes[i].getAttribute("id"),
					height: this.outerHeightWithMargin(this.footNoteNode[0].childNodes[i]),
					element: this.footNoteNode[0].childNodes[i]
				};
				this.footNotes.push(footnote);
			}
		}
	}
	this.pageTagName = "p";
	this.pageClassName = "graha_page";
	this.pageSelector = this.wrapperSelector + " " + this.pageTagName + "." + this.pageClassName;
	this.lastPageNumber = 0;
};
GrahaOdtPageSplitter.prototype.refreshFootNote = function() {
	if(this.footNotes && this.footNotes != null && this.footNotes.length > 0) {
		for(var i = 0; i < this.footNotes.length; i++) {
			if(this.footNotes[i].page == null) {
				var refNode = $(this.entirePageSelector + " span#" + this.footNotes[i].ref);
				if(refNode && refNode != null && refNode.length > 0) {
					this.footNotes[i].refTop = this.offsetTopWithMargin(refNode);
					this.footNotes[i].refHeight = this.outerHeightWithMargin(refNode);
				} else {
					refNode = $(this.currentPage).find("span#" + this.footNotes[i].ref);
					if(refNode && refNode != null && refNode.length > 0) {
						this.footNotes[i].page = (this.lastPageNumber + 1);
						this.footNotes[i].refTop = 0;
						this.footNotes[i].refHeight = 0;
					} else {
						console.error(this.footNotes[i]);
					}
				}
			}
		}
	}
};
GrahaOdtPageSplitter.prototype.addPage = function() {
	this.refreshFootNote();
	this.lastPageNumber++;
	this.currentPage = document.createElement(this.pageTagName);
	this.currentPage.setAttribute("class", this.pageClassName);
	this.currentPage.setAttribute("data-graha-page-number", this.lastPageNumber);
	this.currentPage.setAttribute("data-graha-page-status", "init");
	$(this.wrapperSelector).append(this.currentPage);
	
	var bottom = document.createElement("p");
	bottom.setAttribute("class", "graha-dummy-bottom");
	bottom.setAttribute("data-graha-page-number", this.lastPageNumber);
	$(bottom).css("box-sizing", "border-box");
	if(this.pageLayout && this.pageLayout != null && this.pageLayout.marginBottom && this.pageLayout.marginBottom != null) {
		$(bottom).css("height", this.pageLayout.marginBottom);
	} else {
		$(bottom).css("height", $(this.wrapperSelector).css("padding-bottom"));
	}
	$(bottom).css("border-bottom", "gray 1px dashed");
	$(this.wrapperSelector).append(bottom);
	
	var top = document.createElement("p");
	top.setAttribute("data-graha-page-number", (this.lastPageNumber + 1));
	top.setAttribute("class", "graha-dummy-top");
	if(this.pageLayout && this.pageLayout != null && this.pageLayout.marginTop && this.pageLayout.marginTop != null) {
		$(top).css("height", this.pageLayout.marginTop);
	} else {
		$(top).css("height", $(this.wrapperSelector).css("padding-top"));
	}
	$(top).css("box-sizing", "border-box");
	$(this.wrapperSelector).append(top);
};
GrahaOdtPageSplitter.prototype.singleLine = function(node) {
	if(node == null) {
		return true;
	}
	var result = false;
	if(node.nodeName == "P") {
		return this.singleLineP(node);
	} else if(node.nodeName == "TR") {
		return this.singleLineTR(node);
	} else if(node.nodeName == "TD") {
		return this.singleLineTD(node);
	} else {
	}
	return result;
};
GrahaOdtPageSplitter.prototype.singleLineTR = function(node) {
	if(node == null) {
		return true;
	}
	if(this.outerHeightWithMargin(node) > this.availablePageHeightWithPrevFootNote(node)) {
		return false;
	}
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "TD") {
				if(this.singleLine(node.childNodes[i])) {
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
GrahaOdtPageSplitter.prototype.singleLineTD = function(node) {
	if(node == null) {
		return true;
	}
	if($(node).find("table").length > 0) {
		return false;
	} else if($(node).find("img").length > 0) {
		return false;
	} else if($(node).find("p").length > 1) {
		return false;
	}
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "P") {
				if(this.singleLine(node.childNodes[i])) {
					if(this.height(node) > this.outerHeightWithMargin(node.childNodes[i]) * 2) {
						return false;
					}
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
GrahaOdtPageSplitter.prototype.singleLineP = function(node) {
	if(node == null) {
		return true;
	}
	if($(node).find("table").length > 0) {
		return false;
	} else if($(node).find("img").length > 0) {
		return false;
	}
	var result = false;
	var dummy = $(node).clone(true);
	dummy.css("white-space", "nowrap");
	dummy.attr("data-dummy", "true");
	$(node).before(dummy);
	if(this.available(dummy)) {
		if(this.outerHeightWithMargin(dummy) == this.outerHeightWithMargin(node)) {
			result = true;
		}
	} else {
		result = true;
	}
	dummy.remove();
	return result;
};
GrahaOdtPageSplitter.prototype.getCurrentSep = function(node) {
	if(node && node != null && node.length > 0) {
		return this.offsetBottomWithMargin(node);
	}
	return null;
};
GrahaOdtPageSplitter.prototype.getPrevSep = function(node) {
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
GrahaOdtPageSplitter.prototype.paragraph = function(node) {
	if(node == null) {
		return null;
	}
	if(this.singleLine(node)) {
		return {
			before: null,
			after: node,
			sep: this.getPrevSep($(node))
		};
	} else {
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "FONT") {
					var result = this.font(node.childNodes[i], node);
					return result;
				} else {
					console.error(node.childNodes[i]);
				}
			} else if(Node.TEXT_NODE == node.childNodes[i].nodeType) {
				console.error(node.outerHTML);
				console.error(node.childNodes[i]);
			}
		}
	}
};
GrahaOdtPageSplitter.prototype.span = function(node, splitter) {
	if(node == null) {
		return;
	}
	var spanB = this.copy(node);
	var spanA = null;
	if(splitter.pageBreak) {
		spanA = this.copy(node);
		splitter.parentA.appendChild(spanA);
	} else {
		splitter.parentB.appendChild(spanB);
	}
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "SPAN") {
				splitter.parentB = spanB;
				splitter.parentA = spanA;
				this.span(node.childNodes[i], splitter);
			} else {
				console.error(node.childNodes[i]);
			}
		} else if(Node.TEXT_NODE == node.childNodes[i].nodeType) {
			var text = node.childNodes[i].nodeValue;
			for(var x = 0; x < text.length; x++) {
				if(splitter.pageBreak) {
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
GrahaOdtPageSplitter.prototype.parentNode = function(node, parentNodeName) {
	return GrahaOdtPageSplitterUtility.parentNode(node, parentNodeName);
};
GrahaOdtPageSplitter.prototype.font = function(node, paragraph) {
	if(node == null) {
		return null;
	}
	var fontB = this.copy(node);
	var fontA = null;
	var splitter = {
		root: node,
		before: this.copy(paragraph),
		after: null,
		pageBreak: false
	};
	splitter.before.appendChild(fontB);
	$(paragraph).before($(splitter.before));
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "SPAN") {
				splitter.parentB = fontB;
				splitter.parentA = fontA;
				this.span(node.childNodes[i], splitter, node);
				if(fontA == null && splitter.after != null && splitter.parentA != null) {
					fontA = this.parentNode(splitter.parentA, "FONT");
				}
			} else {
				console.error(node.childNodes[i]);
			}
		} else if(Node.TEXT_NODE == node.childNodes[i].nodeType) {
			var text = node.childNodes[i].nodeValue;
			for(var x = 0; x < text.length; x++) {
				if(splitter.pageBreak) {
					fontA.appendChild(document.createTextNode(text.charAt(x)));
				} else {
					fontB.appendChild(document.createTextNode(text.charAt(x)));
					if(this.available(splitter.before)) {
					} else {
						splitter.pageBreak = true;
						fontB.removeChild(fontB.lastChild);
						var copyed = this.copyA($(fontB), splitter.before);

						if(copyed != null) { 
							splitter.after = copyed.after;
							fontA = copyed.parentA;
						} else {
							console.error(fontB, splitter.before);
						}
						x--;
					}
				}
			}
		}
	}
	if(splitter.pageBreak) {
		$(paragraph).before($(splitter.after));
		$(paragraph).remove();
		return {
			before: splitter.before,
			after: splitter.after,
			sep: this.getCurrentSep($(splitter.before))
		};
	} else {
		$(splitter.before).remove();
		return {
			before: paragraph,
			after: null,
			sep: this.getCurrentSep($(paragraph))
		};
	}
};
GrahaOdtPageSplitter.prototype.move = function(node, parent) {
	GrahaOdtPageSplitterUtility.move(node, parent);
};
GrahaOdtPageSplitter.prototype.copyBorder = function(before, after) {
	GrahaOdtPageSplitterUtility.copyBorder(before, after);
};

GrahaOdtPageSplitter.prototype.td = function(node) {
	var before = this.copy(node);
	var nodeOuterHeight = this.outerHeightWithMargin(node);
	var nodeOffsetTop = this.offsetTopWithMargin(node);
	var beforeLimitHeight = this.availablePageHeightWithPrevFootNote(node) + this.offsetTopWithoutMargin(this.entirePageNode);

	$(before).css("height", 0);
	var paddingBottom = this.parseFloat($(node).css("padding-bottom"), 0);
	var borderBottom = this.parseFloat($(node).css("border-bottom-width"), 0);
	var paddingTop = this.parseFloat($(node).css("padding-top"), 0);
	var borderTop = this.parseFloat($(node).css("border-top-width"), 0);
	
	var bottomExtraHeight = borderBottom + paddingBottom;
	var topExtraHeight = borderTop + paddingTop;
	var extraHeight = borderBottom + paddingBottom + borderTop + paddingTop;
	
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(this.available(node.childNodes[i], bottomExtraHeight)) {
			} else {
				var result = this.node(node.childNodes[i]);
				this.move(node.childNodes[i], before);
				if(result != null && result.before != null) {
					before.appendChild(result.before);
				}
				if(before.childNodes.length == 0) {
					var p = document.createElement("p");
					var font = document.createElement("font");
					var span = document.createElement("span");
					span.setAttribute("class", "graha_transparent_");
					span.appendChild(document.createTextNode('\u00A0'));
					font.appendChild(span);
					p.appendChild(font);
					before.appendChild(p);
				}
				if(result != null && result.after != null) {
					$(node).prepend(result.after);
				}

				var beforeOuterHeight = Math.min(result.sep, beforeLimitHeight) - nodeOffsetTop;
				
				if(beforeOuterHeight < 1) {
					beforeOuterHeight = this.availablePageHeightWithPrevFootNote(node) - nodeOffsetTop + this.offsetTopWithoutMargin(this.entirePageNode) - (extraHeight * 3);
				}
				var afterOuterHeight = nodeOuterHeight - beforeOuterHeight;
				
				$(before).innerHeight(beforeOuterHeight - bottomExtraHeight - topExtraHeight);
				$(node).outerHeight(afterOuterHeight);
				return {
					before: before,
					after: node,
					sep: Math.min(result.sep, beforeLimitHeight) + bottomExtraHeight
				};
			}
		}
	}
	var beforeOuterHeight = this.availablePageHeightWithPrevFootNote(node) - nodeOffsetTop;
	var afterOuterHeight = nodeOuterHeight - beforeOuterHeight;
	$(node).outerHeight(beforeOuterHeight + bottomExtraHeight);
	$(before).outerHeight(afterOuterHeight);
/**
여기서는 before 변수의 명명법이 정확하지 않다는 사실에 유의한다.
*/
	return {
		before: node,
		after: before,
		sep: this.getCurrentSep($(node))
	};
};
GrahaOdtPageSplitter.prototype.tr = function(node) {
	if(node == null) {
		return null;
	}
	var before = this.copy(node);
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "TD") {
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
	$(before).css("height", 0);
	$(node).css("height", 0);
	return {
		before: before,
		after: node,
		sep: this.getCurrentSep($(before))
	};
};
GrahaOdtPageSplitter.prototype.rowspan = function(node, before) {
	return GrahaOdtPageSplitterUtility.rowspan(node, before);
};
GrahaOdtPageSplitter.prototype.findNthTdChild = function(node, tableCellIndex) {
	return GrahaOdtPageSplitterUtility.findNthTdChild(node, tableCellIndex);
};
GrahaOdtPageSplitter.prototype.splitRowspan = function(node, tds) {
	GrahaOdtPageSplitterUtility.splitRowspan(node, tds, this);
};
GrahaOdtPageSplitter.prototype.table = function(node) {
	if(node == null) {
		return null;
	}
	var before = null;
	var lastAvailableNode = null;
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "COLGROUP") {
			} else if(node.childNodes[i].nodeName == "TR") {
				if(this.available(node.childNodes[i])) {
					lastAvailableNode = node.childNodes[i];
				} else {
					if(this.singleLine(node.childNodes[i])) {
						before = this.copy(node);
						var tds = this.rowspan(node.childNodes[i], node);
						if(tds != null) {
							if(lastAvailableNode != null) {
								this.offsetBottomLimit = this.offsetBottomWithMargin($(lastAvailableNode));
							}
							this.splitRowspan(node.childNodes[i], tds);
							this.offsetBottomLimit = null;
						}
						this.move(node.childNodes[i], before);
						$(node).before(before);
						this.copyBorder(before, node);
						return {
							before: before,
							after: node,
							sep: this.getCurrentSep($(before))
						};
					} else {
						before = this.copy(node);
						var tds = this.rowspan(node.childNodes[i], node);
						if(tds != null) {
							this.splitRowspan(node.childNodes[i], tds);
						}
						$(node).before(before);
						if(this.available(before)) {
							var result = this.tr(node.childNodes[i]);
							this.move(node.childNodes[i], before);
							before.appendChild(result.before);
							if(result.after != null) {
								if(node.firstChild && node.firstChild != null && node.firstChild.nodeName == "COLGROUP") {
									$(node.firstChild).after(result.after);
								} else {
									$(node).prepend(result.after);
								}
								this.copyBorder(before, node);
							}
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
GrahaOdtPageSplitter.prototype.node = function(node) {
	if(node == null) {
		return null;
	}
	if(Node.DOCUMENT_NODE == node.nodeType || Node.ELEMENT_NODE == node.nodeType) {
		if(node.nodeName == "P") {
			var result = this.paragraph(node);
			return result;
		} else if(node.nodeName == "TABLE") {
			var result = this.table(node);
			return result;
		} else {
			console.error(node);
		}
	} else if(Node.TEXT_NODE == node.nodeType) {
		console.error(node);
	}
};
GrahaOdtPageSplitter.prototype.appendPageFootNote = function(footNote, pageFootNote) {
	if(pageFootNote == null) {
		pageFootNote = this.createPageFootNote();
	} else {
		if(pageFootNote.getAttribute("data-split-note") == "yes") {
			footNote.page = this.lastPageNumber + 1;
			return pageFootNote;
		}
	}
	footNote.page = this.lastPageNumber;
	var childNodesLength = footNote.element.childNodes.length;
	this.availableMode = "note";
	this.availableCurrentPageBottom = this.positionBottomWithMargin(pageFootNote);
	for(var i = 0; i < childNodesLength; i++) {
		if(this.available(footNote.element.childNodes[i])) {
			$(pageFootNote).append(footNote.element.childNodes[i]);
			this.availableCurrentPageBottom = this.positionBottomWithMargin(pageFootNote);
			i = -1;
			childNodesLength = footNote.element.childNodes.length;
		} else {
			var obj = this.node(footNote.element.childNodes[i]);
			if(obj && obj != null) {
				if(obj.before && obj.before != null) {
					$(pageFootNote).append(obj.before);
				}
				if(obj.after && obj.after != null) {
					obj.after.setAttribute("style", "text-indent: 0px;");
				}
				footNote.page = this.lastPageNumber + 1;
				footNote.height = this.outerHeightWithMargin(footNote.element);
				pageFootNote.setAttribute("data-split-note", "yes");
				break;
			} else {
				console.error(footNote.element.childNodes[i]);
			}
		}
	}
	this.availableMode = "page";
	return pageFootNote;
};
GrahaOdtPageSplitter.prototype.createPageFootNote = function() {
	var pageFootNote = document.createElement("div");
	$(this.currentPage).append(pageFootNote);
	pageFootNote.setAttribute("class", "graha_page_footnote");
	if(this.footNoteSep && this.footNoteSep != null && this.footNoteSep.element && this.footNoteSep.element != null) {
		$(pageFootNote).prepend($(this.footNoteSep.element).clone());
	}
	return pageFootNote;
};
GrahaOdtPageSplitter.prototype.moveToCurrentPage = function(node) {
	var nodeOffsetBottom = null;
	if(node && node != null) {
		nodeOffsetBottom = this.offsetBottomWithMargin(node);
	}
	if(this.headerHeight() > 0) {
		var header = this.headerNode.clone();
		var _this = this;
		header.find("span.graha-page-number").each(function() {
			$(this).text(_this.currentPage.getAttribute("data-graha-page-number"));
		});
		$(this.currentPage).append(header);
	}
	if(node && node != null) {
		var current = $(node);
		var elements = new Array();
		var index = 0;
		while(current && current != null && current.length > 0) {
			elements.push(current);
			current = current.prev();
			index++;
		}
		for(var i = 0; i < elements.length; i++) {
			if(elements[i] && elements[i] != null && elements[i].length > 0) {
				$(this.currentPage).prepend(elements[i]);
			}
		}
		if(this.footNotes && this.footNotes != null) {
			var pageFootNote = null;
			for(var i = 0; i < this.footNotes.length; i++) {
				if(this.footNotes[i].page == null) {
					if(nodeOffsetBottom > this.footNotes[i].refTop + this.footNotes[i].refHeight) {
						pageFootNote = this.appendPageFootNote(this.footNotes[i], pageFootNote);
					}
				} else if(this.footNotes[i].page == this.lastPageNumber) {
					pageFootNote = this.appendPageFootNote(this.footNotes[i], pageFootNote);
				}
			}
			if(pageFootNote != null) {
				pageFootNote.setAttribute("style", "width: " + this.pageWidth() + "px; position: absolute; bottom:" + (this.footerHeight()) + "px;");
			}
		}
	} else {
		if(this.footNotes && this.footNotes != null) {
			var pageFootNote = null;
			for(var i = 0; i < this.footNotes.length; i++) {
				if(this.footNotes[i].page != null && this.footNotes[i].page == this.lastPageNumber) {
					pageFootNote = this.appendPageFootNote(this.footNotes[i], pageFootNote);
				}
			}
			if(pageFootNote != null) {
				pageFootNote.setAttribute("style", "width: " + this.pageWidth() + "px; position: absolute; bottom:" + (this.footerHeight()) + "px;");
			}
		}
	}
	if(this.footerHeight() > 0) {
		var footer = this.footerNode.clone();
		var _this = this;
		footer.find("span.graha-page-number").each(function() {
			$(this).text(_this.currentPage.getAttribute("data-graha-page-number"));
		});
		footer.css("position", "absolute");
		footer.css("bottom", "0" + "px");
		footer.css("width", this.pageWidth() + "px");
		$(this.currentPage).append(footer);
	}
	this.currentPage.setAttribute("data-graha-page-status", "fill");
	this.addPage();
	
	if(this.footNoteHeight(null) >= this.availablePageHeight()) {
		this.moveToCurrentPage(null);
	}
};
GrahaOdtPageSplitter.prototype.clear = function() {
	this.footNoteNode.remove();
	this.footerNode.remove();
	this.headerNode.remove();
	var _this = this;
	_this.lastPageNumber--;
	$("p.graha-dummy-bottom").add("p.graha-dummy-top").each(function() {
		if(_this.parseInt(this.getAttribute("data-graha-page-number")) > _this.lastPageNumber) {
			$(this).remove();
		}
	});
	$(this.pageSelector).each(function() {
		if(_this.parseInt(this.getAttribute("data-graha-page-number")) > _this.lastPageNumber) {
			$(this).remove();
		}
	});
	if($(this.wrapperSelector).children().length > 0) {
		if($(this.wrapperSelector).children().last().attr("class") == "graha-dummy-bottom") {
			$(this.wrapperSelector).children().last().css("border-bottom", "none")
		}
		var outerHeight = this.offsetBottomWithoutMargin($(this.wrapperSelector).children().last());
		outerHeight -= this.offsetTopWithoutMargin($(this.wrapperSelector));
		if(outerHeight > $(this.wrapperSelector).outerHeight(true)) {
			$(this.wrapperSelector).outerHeight(Math.floor(outerHeight));
		}
		if(this.scaleRatio < 1) {
			var scaledOuterHeight = $(this.wrapperSelector).outerHeight(true) * this.scaleRatio;
			$(this.scaleWrapperSelector).outerHeight(scaledOuterHeight);
			$(this.scaleWrapperSelector).css("overflow", "hidden");
		}
	}
};
GrahaOdtPageSplitter.prototype.split = function() {
	var _this = this;
	this.init();
	$(this.entirePageSelector).each(function() {
		_this.entirePageNode = this;
		if(_this.lastPageNumber == 0) {
			_this.addPage();
		}
		var childNodesLength = this.childNodes.length;
		for(var i = 0; i < childNodesLength; i++) {
			if(_this.available(this.childNodes[i])) {
			} else {
				var obj = _this.node(this.childNodes[i]);
				if(obj && obj != null) {
					if(obj.before && obj.before != null) {
						_this.moveToCurrentPage(obj.before);
					} else {
						_this.moveToCurrentPage(this.childNodes[i - 1]);
					}
					if(obj.after && obj.after != null) {
					}
					childNodesLength = this.childNodes.length;
					i = -1;
				} else {
					console.error(this.childNodes[i]);
				}
			}
		}
		if(this.childNodes.length > 0) {
			_this.moveToCurrentPage(this.childNodes[this.childNodes.length - 1]);
		}
		$(this).remove();
	});
	this.clear();
};
