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
 * @version 0.6.0.1
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.6.0.1
 */

function GrahaOdtPageSplitter(options, htmlConverterWrapper) {
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
	this.htmlConverterWrapper = htmlConverterWrapper;
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
/*
GrahaOdtPageSplitter.prototype.widthWithoutPadding = function(node) {
	return GrahaPdfConverterUtility.widthWithoutPadding(node, this.scaleRatio);
};
*/
GrahaOdtPageSplitter.prototype.offsetTopWithoutMargin = function(node) {
	return GrahaPdfConverterUtility.offsetTopWithoutMargin(node, this.scaleRatio);
};
GrahaOdtPageSplitter.prototype.paddingTop = function(node) {
	return GrahaPdfConverterUtility.paddingTop(node, this.scaleRatio);
};
GrahaOdtPageSplitter.prototype.paddingBottom = function(node) {
	return GrahaPdfConverterUtility.paddingBottom(node, this.scaleRatio);
};
GrahaOdtPageSplitter.prototype.offsetBottomWithMarginWithoutPaddingTop = function(node) {
	return GrahaPdfConverterUtility.offsetBottomWithMargin(node, this.scaleRatio) - this.paddingTop(this.entirePageNode);
};
GrahaOdtPageSplitter.prototype.positionBottomWithMarginWithoutPaddingTop = function(node) {
	return GrahaPdfConverterUtility.positionBottomWithMargin(node, this.scaleRatio) - this.paddingTop(this.entirePageNode);
};
GrahaOdtPageSplitter.prototype.height = function(node) {
	return GrahaPdfConverterUtility.height(node, this.scaleRatio);
};
/*
GrahaOdtPageSplitter.prototype.heightWithoutPadding = function(node) {
	return GrahaPdfConverterUtility.heightWithoutPadding(node, this.scaleRatio);
};
*/
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
		nodeOffsetBottom = this.offsetBottomWithMarginWithoutPaddingTop(node);
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
	if(this.htmlConverterWrapper.getFirstFooter() != null) {
		return this.outerHeightWithMargin(this.htmlConverterWrapper.getFirstFooter());
	}
	return 0;
};
GrahaOdtPageSplitter.prototype.headerHeight = function() {
	if(this.htmlConverterWrapper.getLastHeader() != null) {
		return this.outerHeightWithMargin(this.htmlConverterWrapper.getLastHeader());
	}
	return 0;
};
GrahaOdtPageSplitter.prototype.pagePaddingBottom = function() {
	if(this.currentPage && this.currentPage != null) {
		return this.paddingBottom(this.currentPage);
	} else {
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
GrahaOdtPageSplitter.prototype.offsetTopEntirePage = function() {
	return this.offsetTopWithoutMargin(this.entirePageNode);
};
GrahaOdtPageSplitter.prototype.availablePageHeight = function() {
	if(this.offsetBottomLimit && this.offsetBottomLimit != null) {
		return Math.floor(this.offsetBottomLimit  - this.offsetTopEntirePage());
	} else {
		return Math.floor(this.pageHeight() - this.footerHeight() - this.headerHeight());
	}
};
GrahaOdtPageSplitter.prototype.availablePageHeightWithPrevFootNote = function(node) {
	if(this.offsetBottomLimit && this.offsetBottomLimit != null) {
		if(this.availableMode == "note") {
			return Math.floor(this.offsetBottomLimit - this.availableCurrentPageBottom - this.footerHeight());
		} else {
			return Math.floor(this.offsetBottomLimit - this.offsetTopEntirePage());
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
		return Math.floor(this.offsetBottomLimit - this.offsetTopEntirePage());
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
	if(this.availablePageHeightWithCurrentFootNote(node) > this.offsetBottomWithMarginWithoutPaddingTop(node) - this.offsetTopEntirePage() + extraHeight) {
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
		if(this.availablePageHeightWithPrevFootNote(node) > this.offsetBottomWithMarginWithoutPaddingTop(node) - this.offsetTopEntirePage() + extraHeight) {
			return true;
		}
	}
	return false;
};
GrahaOdtPageSplitter.prototype.init = function() {
	this.prevFootNoteId = null;
	var footNoteElement = this.htmlConverterWrapper.getLastFootNoteElement();
	this.footNotes = null;
	this.footNoteSep = null;
	if(footNoteElement != null) {
		this.footNotes = new Array();
		for(var i = 0; i < footNoteElement.childNodes.length; i++) {
			if(footNoteElement.childNodes[i].nodeName == "HR") {
				this.footNoteSep = {
					height: this.outerHeightWithMargin(footNoteElement.childNodes[i]),
					element: footNoteElement.childNodes[i]
				};
			} else {
				var footnote = {
					page: null,
					ref: "footnote_" + footNoteElement.childNodes[i].getAttribute("id"),
					height: this.outerHeightWithMargin(footNoteElement.childNodes[i]),
					element: footNoteElement.childNodes[i]
				};
				this.footNotes.push(footnote);
			}
		}
	}
	this.lastPageNumber = 0;
};
GrahaOdtPageSplitter.prototype.refreshFootNote = function() {
	if(this.footNotes && this.footNotes != null && this.footNotes.length > 0) {
		for(var i = 0; i < this.footNotes.length; i++) {
			if(this.footNotes[i].page == null) {
				var refNode = $(this.htmlConverterWrapper.getEntirePageFullSelector() + " span#" + this.footNotes[i].ref);
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
	this.currentPage = this.htmlConverterWrapper.createPage();
	this.currentPage.setAttribute("data-graha-page-number", this.lastPageNumber);
	this.currentPage.setAttribute("data-graha-page-status", "init");
	this.htmlConverterWrapper.addPage(this.currentPage);
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
		return this.offsetBottomWithMarginWithoutPaddingTop(node);
	}
	return null;
};
GrahaOdtPageSplitter.prototype.getPrevSep = function(node) {
	if(node && node != null && node.length > 0) {
		var prev = this.prevNodeForOffset(node);
		if(prev && prev != null && prev.length > 0) {
			sep = this.offsetBottomWithMarginWithoutPaddingTop(prev);
		} else {
			sep = this.offsetBottomWithMarginWithoutPaddingTop(node);
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
	var nodeOuterHeight = null;
	if(node.getAttribute("data-initial-height") != null) {
		nodeOuterHeight = node.getAttribute("data-initial-height");
	} else {
		nodeOuterHeight = this.outerHeightWithMargin(node);
	}
	var nodeOffsetTop = this.offsetTopWithMargin(node);
	var beforeLimitHeight = this.availablePageHeightWithPrevFootNote(node) + this.offsetTopEntirePage();

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
					beforeOuterHeight = this.availablePageHeightWithPrevFootNote(node) - nodeOffsetTop + this.offsetTopEntirePage() - (extraHeight * 3);
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
				if(node.childNodes[i].getAttribute("data-graha-splitted") != null && node.childNodes[i].getAttribute("data-graha-splitted") == "true") {
					continue;
				}
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
GrahaOdtPageSplitter.prototype.setTableInitialHeightAttribute = function(node) {
	return GrahaOdtPageSplitterUtility.setTableInitialHeightAttribute(node);
};
GrahaOdtPageSplitter.prototype.modifyRowspan = function(requireModifyRowspan) {
	return GrahaOdtPageSplitterUtility.modifyRowspan(requireModifyRowspan);
};
GrahaOdtPageSplitter.prototype.table = function(node) {
	if(node == null) {
		return null;
	}
	this.setTableInitialHeightAttribute(node);
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
						var requireModifyRowspan = null;
						if(tds != null) {
							if(lastAvailableNode != null) {
								this.offsetBottomLimit = this.offsetBottomWithMarginWithoutPaddingTop($(lastAvailableNode));
							}
							requireModifyRowspan = this.splitRowspan(node.childNodes[i], tds);
							this.offsetBottomLimit = null;
						}
						this.move(node.childNodes[i], before);
						if(requireModifyRowspan != null) {
							this.modifyRowspan(requireModifyRowspan);
						}
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
						var requireModifyRowspan = null;
						if(tds != null) {
							requireModifyRowspan = this.splitRowspan(node.childNodes[i], tds);
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
	this.availableCurrentPageBottom = this.positionBottomWithMarginWithoutPaddingTop(pageFootNote);
	for(var i = 0; i < childNodesLength; i++) {
		if(this.available(footNote.element.childNodes[i])) {
			$(pageFootNote).append(footNote.element.childNodes[i]);
			this.availableCurrentPageBottom = this.positionBottomWithMarginWithoutPaddingTop(pageFootNote);
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
	var pageFootNote = this.htmlConverterWrapper.createPageFootNoteElement();
	$(this.currentPage).append(pageFootNote);
	if(this.footNoteSep && this.footNoteSep != null && this.footNoteSep.element && this.footNoteSep.element != null) {
		$(pageFootNote).prepend($(this.footNoteSep.element).clone());
	}
	return pageFootNote;
};
GrahaOdtPageSplitter.prototype.moveToCurrentPage = function(node) {
	var nodeOffsetBottom = null;
	if(node && node != null) {
		nodeOffsetBottom = this.offsetBottomWithMarginWithoutPaddingTop(node);
	}
	if(this.headerHeight() > 0) {
		var header = this.htmlConverterWrapper.getLastHeader().clone();
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
				pageFootNote.setAttribute("style", "width: " + this.pageWidth() + "px; position: absolute; bottom:" + (this.footerHeight() + this.pagePaddingBottom()) + "px;");
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
				pageFootNote.setAttribute("style", "width: " + this.pageWidth() + "px; position: absolute; bottom:" + (this.footerHeight() + this.pagePaddingBottom()) + "px;");
			}
		}
	}
	if(this.footerHeight() > 0) {
		var footer = this.htmlConverterWrapper.getFirstFooter().clone();
		var _this = this;
		footer.find("span.graha-page-number").each(function() {
			$(this).text(_this.currentPage.getAttribute("data-graha-page-number"));
		});
		footer.css("position", "absolute");
		footer.css("bottom",  + this.pagePaddingBottom() + "px");
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
	this.htmlConverterWrapper.removeLastFootNote();
	this.htmlConverterWrapper.removeLastHeader();
	this.htmlConverterWrapper.removeFirstFooter();
	var _this = this;
	_this.lastPageNumber--;
	$(this.htmlConverterWrapper.getPageFullSelector()).each(function() {
		if(_this.parseInt(this.getAttribute("data-graha-page-number")) > _this.lastPageNumber) {
			$(this).remove();
		}
	});
	if($(this.htmlConverterWrapper.getLastFileWrapperFullSelector()).children().length > 1) {
		var outerHeight = this.offsetBottomWithoutMargin($(this.htmlConverterWrapper.getLastFileWrapperFullSelector()).children().last());
		outerHeight -= this.offsetTopWithoutMargin($(this.htmlConverterWrapper.getLastFileWrapperFullSelector()));
		if(outerHeight > $(this.htmlConverterWrapper.getLastFileWrapperFullSelector()).outerHeight(true)) {
			$(this.htmlConverterWrapper.getLastFileWrapperFullSelector()).outerHeight(Math.floor(outerHeight));
		}
		if(this.scaleRatio < 1) {
			var scaledOuterHeight = $(this.htmlConverterWrapper.getLastFileWrapperFullSelector()).outerHeight(true) * this.scaleRatio;
			$(this.htmlConverterWrapper.getScaleWrapperSelector()).outerHeight(scaledOuterHeight);
			$(this.htmlConverterWrapper.getScaleWrapperSelector()).css("overflow", "hidden");
		}
	}
};
GrahaOdtPageSplitter.prototype.split = function() {
	var _this = this;
	this.init();
	$(this.htmlConverterWrapper.getEntirePageFullSelector()).each(function() {
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
