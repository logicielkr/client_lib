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
 * GrahaHtmlConverterWrapper

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.6.0.1
 * @since 0.6
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.6.0.1
 */

function GrahaHtmlConverterWrapper(format) {
	this.format = format;
	this.init();
}

GrahaHtmlConverterWrapper.ODT_FORMAT = 10;
GrahaHtmlConverterWrapper.HWPX_FORMAT = 20;

GrahaHtmlConverterWrapper.prototype.init = function() {
	this.wrapperTagName = "div";
	this.wrapperId = "GrahaHtmlConverterWrapper";
	this.wrapperSelector = this.wrapperTagName + "#" + this.wrapperId;
	
	this.fileWrapperTagName = "div";
	this.fileWrapperClassName = "GrahaHtmlConverterFileWrapper";
	this.fileWrapperIdPrefix = "GrahaHtmlConverterFileWrapper";
	
	this.lastIndexOfFileWrapper = 0;
	
	this.grahaEntirePageTagName = "p";
	this.grahaEntirePageClassName = "graha_entire_page";
	this.grahaEntirePageSelector = this.grahaEntirePageTagName + "." + this.grahaEntirePageClassName;
	
	this.grahaPageTagName = "p";
	this.grahaPageClassName = "graha_page";
	this.grahaPageSelector = this.grahaPageTagName + "." + this.grahaPageClassName;
	
	this.scaleWrapperTagName = "div";
	this.scaleWrapperId = "GrahaHtmlConverterScaleWrapper";
	this.scaleWrapperSelector = this.scaleWrapperTagName + "#" + this.scaleWrapperId;
	
	this.headerTagName = "div";
	this.headerClassName = "graha_header";
	this.headerSelector = this.headerTagName + "." + this.headerClassName;
	
	this.footerTagName = "div";
	this.footerClassName = "graha_footer";
	this.footerSelector = this.footerTagName + "." + this.footerClassName;
	
	this.footNoteTagName = "div";
	this.footNoteClassName = "graha_footnote";
	this.footNoteSelector = this.footNoteTagName + "." + this.footNoteClassName;
	
	this.pageFootNoteTagName = "div";
	this.pageFootNoteClassName = "graha_page_footnote";
	this.pageFootNoteSelector = this.pageFootNoteTagName + "." + this.pageFootNoteClassName;
	
	this.pageHeaderTagName = "p";
	this.pageHeaderClassName = "graha_page_header";
	this.pageHeaderSelector = this.pageHeaderTagName + "." + this.pageHeaderClassName;
	
	this.pageFooterTagName = "p";
	this.pageFooterClassName = "graha_page_footer";
	this.pageFooterSelector = this.pageFooterTagName + "." + this.pageFooterClassName;
	
	this.pageNumberTagName = "p";
	this.pageNumberClassName = "graha_page_number";
	this.pageNumberSelector = this.pageNumberTagName + "." + this.pageNumberClassName;
	
	this.pageInnerSectionTagName = "p";
	this.pageInnerSectionClassName = "graha_page_inner_section";
	this.pageInnerSectionSelector = this.pageInnerSectionTagName + "." + this.pageInnerSectionClassName;
	
	this.wrapper = null;
	this.scaleWrapper = null;
	this.fileWrapper = null;
	this.wrapperStyles = null;
	this.footnote = null;
	
	this.lastPage = null;
};
GrahaHtmlConverterWrapper.prototype.clearAll = function() {
	$(this.wrapperSelector).remove();
	$(this.scaleWrapperSelector).remove();
};
GrahaHtmlConverterWrapper.prototype.getScaleWrapperSelector = function() {
	if(this.wrapper != null) {
		return this.scaleWrapperSelector;
	}
	throw new Error("this.wrapper is null");
};
GrahaHtmlConverterWrapper.prototype.getWrapperSelector = function() {
	if(this.wrapper != null) {
		return this.wrapperSelector;
	}
	throw new Error("this.wrapper is null");
};
GrahaHtmlConverterWrapper.prototype.getWrapper = function() {
	if(this.wrapper != null) {
		return this.wrapper;
	}
	throw new Error("this.wrapper is null");
};
GrahaHtmlConverterWrapper.prototype.getPageStyleSelector = function() {
	return this.getLastFileWrapperSelector() + " " + this.grahaPageSelector;
};
GrahaHtmlConverterWrapper.prototype.getPageFullSelector = function() {
	return this.getLastFileWrapperFullSelector() + " " + this.grahaPageSelector;
};
GrahaHtmlConverterWrapper.prototype.getPageSelector = function() {
	return this.grahaPageSelector;
};
GrahaHtmlConverterWrapper.prototype.getEntirePageStyleSelector = function() {
	return this.getLastFileWrapperSelector() + " " + this.grahaEntirePageSelector;
};
GrahaHtmlConverterWrapper.prototype.getEntirePageFullSelector = function() {
	return this.getLastFileWrapperFullSelector() + " " + this.grahaEntirePageSelector;
};
GrahaHtmlConverterWrapper.prototype.getEntirePageSelector = function() {
	return this.grahaEntirePageSelector;
};
GrahaHtmlConverterWrapper.prototype.getLastFileWrapper = function() {
	if(this.fileWrapper != null && this.fileWrapper.length > 0) {
		return this.fileWrapper[this.fileWrapper.length - 1];
	}
	throw new Error("this.fileWrapper is null or empty");
};
GrahaHtmlConverterWrapper.prototype.rewidthLastFileWrapperElement = function() {
	var lastFileWrapperElement = this.getLastFileWrapperElement();
	var maxWidth = 0;
	if(lastFileWrapperElement.childNodes && lastFileWrapperElement.childNodes != null && lastFileWrapperElement.childNodes.length > 0) {
		for(var i = 0; i < lastFileWrapperElement.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == lastFileWrapperElement.childNodes[i].nodeType || Node.ELEMENT_NODE == lastFileWrapperElement.childNodes[i].nodeType) {
				if(lastFileWrapperElement.childNodes[i].nodeName == this.grahaPageTagName.toUpperCase() && lastFileWrapperElement.childNodes[i].getAttribute("class") == this.grahaPageClassName) {
					maxWidth = Math.max(maxWidth, $(lastFileWrapperElement.childNodes[i]).outerWidth(true));
				}
			}
		}
	}
	if(maxWidth > 0) {
		$(lastFileWrapperElement).outerWidth(maxWidth);
	}
};
GrahaHtmlConverterWrapper.prototype.createElement = function(nodeName) {
	var node = document.createElement(nodeName);
	node.pageInnerSectionTagName = this.pageInnerSectionTagName.toUpperCase();
	node.pageInnerSectionClassName = this.pageInnerSectionClassName;
	node.pageFootNoteClassName = this.pageFootNoteClassName;
	node.last = function(skipFootnote) {
		if(arguments.length > 0 && skipFootnote) {
			if(this.nodeName == this.pageInnerSectionTagName && this.getAttribute("class") == this.pageInnerSectionClassName) {
				if(this.childNodes && this.childNodes != null && this.childNodes.length > 0) {
					for(var i = this.childNodes.length - 1; i >= 0 ; i--) {
						if(Node.DOCUMENT_NODE == this.childNodes[i].nodeType || Node.ELEMENT_NODE == this.childNodes[i].nodeType) {
							if(this.childNodes[i].getAttribute("class") == this.pageFootNoteClassName) {
							} else {
								return this.childNodes[i];
							}
						}
					}
				}
			}
		}
		if(this.childNodes && this.childNodes != null && this.childNodes.length > 0) {
			for(var i = this.childNodes.length - 1; i >= 0 ; i--) {
				if(Node.DOCUMENT_NODE == this.childNodes[i].nodeType || Node.ELEMENT_NODE == this.childNodes[i].nodeType) {
					return this.childNodes[i];
				}
			}
		}
		return null;
	};
	node.footnote = function() {
		if(this.nodeName == this.pageInnerSectionTagName && this.getAttribute("class") == this.pageInnerSectionClassName) {
			if(this.lastChild && this.lastChild != null) {
				if(this.lastChild.getAttribute("class") == this.pageFootNoteClassName) {
					return this.lastChild;
				}
			}
		}
		return null;
	};
	node.append = function(other) {
		if(this.nodeName == this.pageInnerSectionTagName && this.getAttribute("class") == this.pageInnerSectionClassName) {
			if(this.lastChild && this.lastChild != null) {
				if(this.lastChild.getAttribute("class") == this.pageFootNoteClassName) {
					$(this.lastChild).before(other);
					return;
				}
			}
		}
		this.appendChild(other);
	};
	return node;
};
GrahaHtmlConverterWrapper.prototype.getLastFileWrapperElement = function() {
	if(this.fileWrapper != null && this.fileWrapper.length > 0) {
		return this.fileWrapper[this.fileWrapper.length - 1].node;
	}
	throw new Error("this.fileWrapper is null or empty");
};
GrahaHtmlConverterWrapper.prototype.getLastFileWrapperSelector = function() {
	if(this.fileWrapper != null && this.fileWrapper.length > 0) {
		return this.fileWrapperTagName + "#" + this.fileWrapperIdPrefix + this.lastIndexOfFileWrapper;
	}
	throw new Error("this.fileWrapper is null or empty");
};
GrahaHtmlConverterWrapper.prototype.getLastFileWrapperClassSelector = function() {
	if(this.fileWrapper != null && this.fileWrapper.length > 0) {
		return this.fileWrapperTagName + "." + this.fileWrapperClassName;
	}
	throw new Error("this.fileWrapper is null or empty");
};
GrahaHtmlConverterWrapper.prototype.getLastFileWrapperFullSelector = function() {
	if(this.fileWrapper != null && this.fileWrapper.length > 0) {
		return this.wrapperSelector + " " + this.fileWrapperTagName + "#" + this.fileWrapperIdPrefix + this.lastIndexOfFileWrapper;
	}
	throw new Error("this.fileWrapper is null or empty");
};
GrahaHtmlConverterWrapper.prototype.getLastPage = function(page) {
	return this.lastPage;
};
GrahaHtmlConverterWrapper.prototype.addPage = function(page) {
	this.getLastFileWrapperElement().appendChild(page);
	this.lastPage = page;
};
GrahaHtmlConverterWrapper.prototype.createPage = function() {
	if(this.format == GrahaHtmlConverterWrapper.HWPX_FORMAT) {
		var page = this.createElement(this.grahaPageTagName);
		page.setAttribute("class", this.grahaPageClassName);
		return page;
	} else {
		var page = document.createElement(this.grahaPageTagName);
		page.setAttribute("class", this.grahaPageClassName);
		return page;
	}
};
GrahaHtmlConverterWrapper.prototype.getPageInnerSectionClassName = function() {
	return this.pageInnerSectionClassName;
};
GrahaHtmlConverterWrapper.prototype.addPageInnerSection = function(pageInnerSection) {
	if(this.lastPage != null) {
		this.lastPage.appendChild(pageInnerSection);
	} else {
		throw new Error("this.lastPage is null or empty");
	}
};
GrahaHtmlConverterWrapper.prototype.createPageInnerSection = function() {
	if(this.format == GrahaHtmlConverterWrapper.HWPX_FORMAT) {
		var pageInnerSection = this.createElement(this.pageInnerSectionTagName);
		pageInnerSection.setAttribute("class", this.pageInnerSectionClassName);
		return pageInnerSection;
	} else {
		var pageInnerSection = document.createElement(this.pageInnerSectionTagName);
		pageInnerSection.setAttribute("class", this.pageInnerSectionClassName);
		return pageInnerSection;
	}
};
GrahaHtmlConverterWrapper.prototype.addEntirePage = function(page) {
	if(this.getFirstFooter() != null) {
		$(this.getFirstFooter()).before(page);
	} else {
		this.getLastFileWrapperElement().appendChild(page);
	}
};
GrahaHtmlConverterWrapper.prototype.getHtmlElement = function() {
	return this.getLastFileWrapperElement();
};
GrahaHtmlConverterWrapper.prototype.addFootNote = function(footnote) {
	if(this.getFirstFooter() != null) {
		if(footnote && footnote != null) {
			if(footnote.body && footnote.body != null) {
				$(this.getFirstFooter()).before(footnote.body);
			}
		}
	} else {
		if(footnote && footnote != null) {
			if(footnote.body && footnote.body != null) {
				this.getLastFileWrapperElement().appendChild(footnote.body);
			}
		}
	}
	if(this.footnote == null) {
		this.footnote = footnote;
	}
};
GrahaHtmlConverterWrapper.prototype.addWrapper = function() {
	if(this.format == GrahaHtmlConverterWrapper.HWPX_FORMAT) {
		this.wrapper = this.createElement(this.wrapperTagName);
	} else {
		this.wrapper = document.createElement(this.wrapperTagName);
	}
	this.wrapper.setAttribute("id", this.wrapperId);
	if(this.format == GrahaHtmlConverterWrapper.HWPX_FORMAT) {
		this.scaleWrapper = this.createElement(this.scaleWrapperTagName);
	} else {
		this.scaleWrapper = document.createElement(this.scaleWrapperTagName);
	}
	this.scaleWrapper.setAttribute("id", this.scaleWrapperId);
	this.scaleWrapper.appendChild(this.wrapper);
	
	document.body.appendChild(this.scaleWrapper);
};
GrahaHtmlConverterWrapper.prototype.addFile = function() {
	if(this.wrapper == null) {
		this.addWrapper();
	}
	if(this.fileWrapper == null) {
		this.fileWrapper = new Array();
	}
	this.lastIndexOfFileWrapper++;
	var fileWrapperElement = null;
	if(this.format == GrahaHtmlConverterWrapper.HWPX_FORMAT) {
		fileWrapperElement = this.createElement(this.fileWrapperTagName);
	} else {
		fileWrapperElement = document.createElement(this.fileWrapperTagName);
	}

	fileWrapperElement.setAttribute("id", this.fileWrapperIdPrefix + this.lastIndexOfFileWrapper);
	fileWrapperElement.setAttribute("class", this.fileWrapperClassName);
	this.wrapper.appendChild(fileWrapperElement);
	this.fileWrapper.push({node: fileWrapperElement, styles: null});
};
GrahaHtmlConverterWrapper.prototype.getLastHeader = function() {
	if(this.header && this.header != null) {
		return this.header;
	}
	return null;
};
GrahaHtmlConverterWrapper.prototype.getFirstFooter = function() {
	if(this.footer && this.footer != null) {
		return this.footer;
	}
	return null;
};
GrahaHtmlConverterWrapper.prototype.appendHeader = function(header) {
	$(this.getLastFileWrapperElement()).prepend(header);
	if(this.header && this.header != null) {
	} else {
		this.header = header;
	}
};
GrahaHtmlConverterWrapper.prototype.appendFooter = function(footer) {
	this.getLastFileWrapperElement().appendChild(footer);
	if(this.footer && this.footer != null) {
	} else {
		this.footer = footer;
	}
};
GrahaHtmlConverterWrapper.prototype.getWrapperStyles = function(style) {
	return this.wrapperStyles;
};
GrahaHtmlConverterWrapper.prototype.appendStyle = function(node, style) {
	$(node).prepend(style);
};
GrahaHtmlConverterWrapper.prototype.appendStyleForWrapper = function(style) {
	if(this.wrapperStyles == null) {
		this.wrapperStyles = new Array();
	}
	this.wrapperStyles.push(style);
	this.appendStyle(this.getWrapper(), style);
};
GrahaHtmlConverterWrapper.prototype.appendStyleForLastFileWrapper = function(style) {
	var fileWrapper = this.getLastFileWrapper();
	if(fileWrapper.styles == null) {
		fileWrapper.styles = new Array();
	}
	fileWrapper.styles.push(style);
	this.appendStyle(this.getLastFileWrapperElement(), style);
};
GrahaHtmlConverterWrapper.prototype.createEntirePageElement = function() {
	var page = document.createElement(this.grahaEntirePageTagName);
	page.setAttribute("class", this.grahaEntirePageClassName);
	return page;
};
GrahaHtmlConverterWrapper.prototype.createHeaderElement = function() {
	var header = document.createElement(this.headerTagName);
	header.setAttribute("class", this.headerClassName);
	return header;
};
GrahaHtmlConverterWrapper.prototype.createFooterElement = function() {
	var footer = document.createElement(this.footerTagName);
	footer.setAttribute("class", this.footerClassName);
	return footer;
};
GrahaHtmlConverterWrapper.prototype.createFootNoteElement = function() {
	var footer = document.createElement(this.footNoteTagName);
	footer.setAttribute("class", this.footNoteClassName);
	return footer;
};
GrahaHtmlConverterWrapper.prototype.createPageFootNoteElement = function() {
	var footer = document.createElement(this.pageFootNoteTagName);
	footer.setAttribute("class", this.pageFootNoteClassName);
	return footer;
};
GrahaHtmlConverterWrapper.prototype.createPageHeaderElement = function() {
	var pageHeader = this.createElement(this.pageHeaderTagName);
	pageHeader.setAttribute("class", this.pageHeaderClassName);
	return pageHeader;
};
GrahaHtmlConverterWrapper.prototype.createPageFooterElement = function() {
	var pageFooter = this.createElement(this.pageFooterTagName);
	pageFooter.setAttribute("class", this.pageFooterClassName);
	return pageFooter;
};
GrahaHtmlConverterWrapper.prototype.createPageNumberElement = function() {
	var pageNumber = this.createElement(this.pageNumberTagName);
	pageNumber.setAttribute("class", this.pageNumberClassName);
	return pageNumber;
};
GrahaHtmlConverterWrapper.prototype.getHeaderStyleSelector = function() {
	return this.getLastFileWrapperSelector() + " " + this.headerSelector;
};
GrahaHtmlConverterWrapper.prototype.getFooterStyleSelector = function() {
	return this.getLastFileWrapperSelector() + " " + this.footerSelector;
};
GrahaHtmlConverterWrapper.prototype.getFootNoteStyleSelector = function() {
	return this.getLastFileWrapperSelector() + " " + this.footNoteSelector;
};
GrahaHtmlConverterWrapper.prototype.getPageHeaderStyleSelector = function() {
	return this.getPageStyleSelector() + " " + this.headerSelector;
};
GrahaHtmlConverterWrapper.prototype.getPageFooterStyleSelector = function() {
	return this.getPageStyleSelector() + " " + this.footerSelector;
};
GrahaHtmlConverterWrapper.prototype.getPageFootNoteStyleSelector = function() {
	return this.getPageStyleSelector() + " " + this.footNoteSelector;
};
GrahaHtmlConverterWrapper.prototype.getHeaderSelector = function() {
	return this.headerSelector;
};
GrahaHtmlConverterWrapper.prototype.getFooterSelector = function() {
	return this.footerSelector;
};
GrahaHtmlConverterWrapper.prototype.getFootNoteSelector = function() {
	return this.footNoteSelector;
};
GrahaHtmlConverterWrapper.prototype.getPageFootNoteSelector = function() {
	return this.pageFootNoteSelector;
};
GrahaHtmlConverterWrapper.prototype.getHeaderTagName = function() {
	return this.headerTagName;
};
GrahaHtmlConverterWrapper.prototype.getHeaderClassName = function() {
	return this.headerClassName;
};
GrahaHtmlConverterWrapper.prototype.getFooterTagName = function() {
	return this.footerTagName;
};
GrahaHtmlConverterWrapper.prototype.getFooterClassName = function() {
	return this.footerClassName;
};
GrahaHtmlConverterWrapper.prototype.getPageHeaderUpperCaseTagName = function() {
	return this.pageHeaderTagName.toUpperCase();
};
GrahaHtmlConverterWrapper.prototype.getPageFooterUpperCaseTagName = function() {
	return this.pageFooterTagName.toUpperCase();
};
GrahaHtmlConverterWrapper.prototype.getPageNumberUpperCaseTagName = function() {
	return this.pageNumberTagName.toUpperCase();
};
GrahaHtmlConverterWrapper.prototype.getPageHeaderClassName = function() {
	return this.pageHeaderClassName;
};
GrahaHtmlConverterWrapper.prototype.getPageFooterClassName = function() {
	return this.pageFooterClassName;
};
GrahaHtmlConverterWrapper.prototype.getPageNumberClassName = function() {
	return this.pageNumberClassName;
};
GrahaHtmlConverterWrapper.prototype.getLastFootNoteElement = function() {
	if(this.footnote && this.footnote != null) {
		if(this.footnote.body && this.footnote.body != null) {
			return this.footnote.body;
		}
	}
	return null;
};
GrahaHtmlConverterWrapper.prototype.removeLastFootNote = function() {
	if(this.getLastFootNoteElement() != null) {
		$(this.getLastFootNoteElement()).remove();
	}
};
GrahaHtmlConverterWrapper.prototype.removeLastHeader = function() {
	if(this.getLastHeader() != null) {
		$(this.getLastHeader()).remove();
	}
};
GrahaHtmlConverterWrapper.prototype.removeFirstFooter = function() {
	if(this.getFirstFooter() != null) {
		$(this.getFirstFooter()).remove();
	}
};
