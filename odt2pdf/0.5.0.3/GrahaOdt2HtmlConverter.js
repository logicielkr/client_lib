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
 * GrahaOdt2HtmlConverter
 * odt 를 HTML 로 변경한다.

 * GrahaOdt2PdfConverter 전체적인 사용법은 README.md 를 참조한다.

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.5.0.3
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/odt2pdf/0.5.0.3
 */

function GrahaOdt2HtmlConverter() {
	this.init();
}
GrahaOdt2HtmlConverter.prototype.init = function() {
	this.wrapperId = "GrahaOdt2HtmlConverterWrapper";
	this.wrapperSelector = "div#" + this.wrapperId;
	this.grahaEntirePageClassName = "graha_entire_page";
	this.grahaEntirePageSelector = "p." + this.grahaEntirePageClassName;
	
	this.adjustScale = false;
	this.scale = 1;
	
	this.overflow = false;
	this.odtBinary = null;
	
	this.scaleWrapperId = "GrahaOdt2HtmlConverterScaleWrapper";
	this.scaleWrapperSelector = "div#" + this.scaleWrapperId;
};
GrahaOdt2HtmlConverter.prototype.parseInt = function(str, defaultValue) {
	return GrahaOdt2PdfConverterUtility.parseInt(str, defaultValue);
};
GrahaOdt2HtmlConverter.prototype.parseFloat = function(str, defaultValue) {
	return GrahaOdt2PdfConverterUtility.parseFloat(str, defaultValue);
};
/*
GrahaOdt2HtmlConverter.prototype.width = function(node) {
	return GrahaOdt2PdfConverterUtility.width(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.outerHeightWithMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.outerHeightWithMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.positionLeftWithMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.positionLeftWithMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.positionRightWithMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.positionRightWithMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.positionRightWithoutMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.positionRightWithoutMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.positionTopWithMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.positionTopWithMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.positionBottomWithoutMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.positionBottomWithoutMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.offsetBottomWithoutMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.offsetBottomWithoutMargin(node, this.scale);
};
*/
GrahaOdt2HtmlConverter.prototype.positionBottomWithMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.positionBottomWithMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.offsetRightWithoutMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.offsetRightWithoutMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.outerWidthWithoutMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.outerWidthWithoutMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.offsetRightWithMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.offsetRightWithMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.offsetLeftWithoutMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.offsetLeftWithoutMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.offsetLeftWithMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.offsetLeftWithMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.offsetTopWithMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.offsetTopWithMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.positionLeftWithoutMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.positionLeftWithoutMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.positionTopWithoutMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.positionTopWithoutMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.outerWidthWithMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.outerWidthWithMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.height = function(node) {
	return GrahaOdt2PdfConverterUtility.height(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.outerHeightWithoutMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.outerHeightWithoutMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.offsetTopWithoutMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.offsetTopWithoutMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.offsetBottomWithMargin = function(node) {
	return GrahaOdt2PdfConverterUtility.offsetBottomWithMargin(node, this.scale);
};
GrahaOdt2HtmlConverter.prototype.parseFromStringForIE = function(str) {
	try {
		var xml = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.6.0");
		xml.validateOnParse = false;
		xml.setProperty("ProhibitDTD", false);
		xml.async = false;
		xml.loadXML(str);
		return xml;
	} catch (error) {
		console.error(str);
		console.error(error);
		throw error;
	}
};
GrahaOdt2HtmlConverter.prototype.load = function(meta, header, content) {
	if(window.ActiveXObject || "ActiveXObject" in window) {
		this.meta = this.parseFromStringForIE(meta);
		this.header = this.parseFromStringForIE(header);
		this.content = this.parseFromStringForIE(content);
	} else {
		var parser = new DOMParser();
		this.meta = parser.parseFromString(meta, "text/xml");
		this.header = parser.parseFromString(header, "text/xml");
		this.content = parser.parseFromString(content, "text/xml");
	}
};
GrahaOdt2HtmlConverter.prototype.loadOdfFromFile = function(file) {
	return this.loadOdfFromBlob(file);
};
GrahaOdt2HtmlConverter.prototype.loadOdfFromBlob = function(blob) {
	this.odtBinary = blob;
	var _this = this;
	return new Promise(function(resolve, reject) {
		_this.zip = new JSZip();
		_this.zip.loadAsync(blob).then(function (zip) {
			Promise.all([zip.file("meta.xml").async("string"), zip.file("styles.xml").async("string"), zip.file("content.xml").async("string")]).then(function(values) {
				_this.load(values[0], values[1], values[2]);
				resolve(values);
			}).catch(function(error) {
				console.error(error);
				reject(error);
			});
		}).catch(function(error) {
			console.error(error);
			reject(error);
		});
	});
};
GrahaOdt2HtmlConverter.prototype.loadOdfFromUrl = function(url) {
	var _this = this;
	return new Promise(function(resolve, reject) {
		JSZipUtils.getBinaryContent(url, function(err, zipData) {
			if(err) {
				console.error(err);
				reject(err);
			} else {
				_this.loadOdfFromBlob(zipData).then(function(data) {
					resolve(data);
				}).catch(function(error) {
					console.error(error);
					reject(error);
				});
			}
		});
	});
};
GrahaOdt2HtmlConverter.prototype.loadFromUrl = function(metaUrl, headerUrl, contentUrl) {
	var _this = this;
	var tasks = new Array();
	tasks.push(this.loadXmlFromUrl(metaUrl));
	tasks.push(this.loadXmlFromUrl(headerUrl));
	tasks.push(this.loadXmlFromUrl(contentUrl));
	return new Promise(function(resolve, reject) {
		Promise.all(tasks).then(function(values) {
			_this.meta = values[0];
			_this.header = values[1];
			_this.content = values[2];
			resolve(values);
		}).catch(function(error) {
			console.error(error);
			reject(error);
		});
	});
};
GrahaOdt2HtmlConverter.prototype.loadXmlFromUrl = function(url) {
	return new Promise(function(resolve, reject) {
		$.ajax({
			url: url,
			cache: true,
			success: function(data, textStatus, jqXHR) {
				resolve(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
				reject(errorThrown);
			}
		});
	});
};
GrahaOdt2HtmlConverter.prototype.findByTagName = function(node, nodeName) {
	return GrahaOdt2PdfConverterUtility.findByTagName(node, nodeName);
};
GrahaOdt2HtmlConverter.prototype.toCSSObject = function(name, value) {
	return GrahaOdt2PdfConverterUtility.toCSSObject(name, value);
};
GrahaOdt2HtmlConverter.prototype.toCSSSelector = function(typeSelector, classSelector) {
	return {
		typeSelector: typeSelector,
		classSelector: classSelector
		, toString: function() {
			var selector = "";
			if(this.typeSelector && this.typeSelector != null) {
				selector += this.typeSelector;
			}
			if(this.classSelector && this.classSelector != null) {
				selector += "." + (this.classSelector).replace(/\./g, "\\.") + "";
			}
			return selector;
		}
	};
};
GrahaOdt2HtmlConverter.prototype.getStyle = function() {
	return {
		styles: {
			styles: this.findByTagName(this.header, "office:styles"),
			automaticStyles: this.findByTagName(this.header, "office:automatic-styles"),
			masterStyles: this.findByTagName(this.header, "office:master-styles")
		},
		content: {automaticStyles: this.findByTagName(this.content, "office:automatic-styles")}
	};
};
GrahaOdt2HtmlConverter.prototype.fontFamily = function(fontFamily) {
	if(this.fontFamilyConverter && this.fontFamilyConverter != null) {
		return this.fontFamilyConverter(fontFamily, this.defaultFontFamily);
	} else {
		return this.defaultFontFamily;
	}
};
GrahaOdt2HtmlConverter.prototype.fontWeight = function(weight) {
	if(weight == "600") {
		return "bold";
	} else if(weight == "700") {
		return "bold";
	} else if(weight == "bold") {
		return "bold";
	} else if(weight == "normal") {
		return "normal";
	} else if(weight == "400") {
		return "normal";
	} else if(weight == "800") {
		return "800";
	} else {
		console.error(weight);
		return weight;
	}
};
GrahaOdt2HtmlConverter.prototype.localName = function(attr) {
	if(attr.localName) {
		return attr.localName;
	} else {
		if(attr.prefix != null) {
			return attr.name.substring(attr.prefix.length + 1);
		}
	}
};
GrahaOdt2HtmlConverter.prototype.rule = function(node, rule) {
	if(node != null) {
		var attributes = node.attributes;
		for(var i = 0; i < attributes.length; i++) {
			if(attributes.item(i).name == "style:writing-mode") {

			} else if(attributes.item(i).name == "fo:keep-together") {
			
			} else if(attributes.item(i).name == "style:punctuation-wrap") {
			} else if(attributes.item(i).name == "style:language-asian") {
			} else if(attributes.item(i).name == "style:country-asian") {
			} else if(attributes.item(i).name == "style:language-complex") {
			} else if(attributes.item(i).name == "style:country-complex") {
			} else if(attributes.item(i).name == "style:line-break") {
//Nothing
			} else if(attributes.item(i).name == "fo:language") {
				rule.push(this.toCSSObject("-graha-fo-language", attributes.item(i).value));
			} else if(attributes.item(i).name == "fo:country") {
				rule.push(this.toCSSObject("-graha-fo-country", attributes.item(i).value));
			} else if(attributes.item(i).name == "style:font-size-asian") {
				rule.push(this.toCSSObject("font-size", attributes.item(i).value));
			} else if(attributes.item(i).name == "style:font-size-complex") {
//Nothing
			} else if(attributes.item(i).name == "fo:font-size") {
				if(node.getAttribute("style:font-size-asian") == null) {
					rule.push(this.toCSSObject(this.localName(attributes.item(i)), attributes.item(i).value));
				}
			} else if(attributes.item(i).name == "style:font-name-asian") {
				rule.push(this.toCSSObject("font-family", this.fontFamily(attributes.item(i).value)));
			} else if(attributes.item(i).name == "loext:contextual-spacing") {
			} else if(attributes.item(i).name == "officeooo:rsid") {
			} else if(attributes.item(i).name == "draw:fill-image-width") {
			} else if(attributes.item(i).name == "draw:fill-image-height") {
			} else if(attributes.item(i).name == "officeooo:paragraph-rsid") {
//Nothing
			} else if(
				attributes.item(i).name == "style:font-name-complex" ||
				attributes.item(i).name == "style:font-family-generic-complex"
			) {
//Nothing
			} else if(attributes.item(i).name == "fo:break-before") {
				rule.push(this.toCSSObject("-graha-break-before", attributes.item(i).value));
			} else if(attributes.item(i).name == "style:font-name") {
				if(node.getAttribute("style:font-name-asian") == null) {
					rule.push(this.toCSSObject("font-family", this.fontFamily(attributes.item(i).value)));
				}
			} else if(attributes.item(i).name == "style:font-family-asian") {
				rule.push(this.toCSSObject("font-family", this.fontFamily(attributes.item(i).value)));
			} else if(
				attributes.item(i).name == "style:font-family-generic-asian" ||
				attributes.item(i).name == "style:font-family-generic"
			) {
				if(node.getAttribute("style:font-family-asian") == null) {
					rule.push(this.toCSSObject("font-family", this.fontFamily(attributes.item(i).value)));
				}
			} else if(
				attributes.item(i).name == "style:font-pitch" ||
				attributes.item(i).name == "style:font-pitch-complex"
			) {
				if(attributes.item(i).value == "fixed") {
					rule.push(this.toCSSObject("font-variant", "no-common-ligatures proportional-nums"));
				} else if(attributes.item(i).value == "variable") {
					rule.push(this.toCSSObject("font-variant", "common-ligatures tabular-nums"));
				} else {
					console.error(attributes.item(i).name);
				}				
			} else if(attributes.item(i).name == "style:font-pitch-asian") {
				if(attributes.item(i).value == "fixed") {
					rule.push(this.toCSSObject("font-variant-east-asian", "full-width"));
				} else if(attributes.item(i).value == "variable") {
					rule.push(this.toCSSObject("font-variant-east-asian", "proportional-width"));
				} else {
					console.error(attributes.item(i).name);
				}
			} else if(attributes.item(i).name == "style:font-family-complex") {
//Nothing
			} else if(attributes.item(i).name == "style:font-family" || attributes.item(i).name == "fo:font-family") {
				if(node.getAttribute("style:font-family-asian") == null) {
					rule.push(this.toCSSObject("font-family", this.fontFamily(attributes.item(i).value)));
				}
			} else if(attributes.item(i).name == "style:font-style-name-asian") {
				if(attributes.item(i).value == "보통") {
					rule.push(this.toCSSObject("font-weight", "normal"));
				} else if(attributes.item(i).value == "굵게") {
					rule.push(this.toCSSObject("font-weight", "bold"));
				} else {
					console.error(attributes.item(i).name);
				}
			} else if(attributes.item(i).name == "style:text-autospace") {
//Nothing
			} else if(
				attributes.item(i).name == "fo:color"
			) {
				rule.push(this.toCSSObject(this.localName(attributes.item(i)), attributes.item(i).value));
			} else if(attributes.item(i).name == "table:border-model") {
//Nothing
				if(attributes.item(i).value == "collapsing") {
					rule.push(this.toCSSObject("border-collapse", "collapse"));
				} else if(attributes.item(i).value == "separating") {
					rule.push(this.toCSSObject("border-collapse", "separate"));
				}
/*
				if(window.document.documentMode) {
//legacy Firefox 에서 table border 중 일부가 사라지고, IE 11 에서는 table border 중 일부가 겹쳐져서 (두껍게) 나온다.
					if(attributes.item(i).value == "collapsing") {
						rule.push(this.toCSSObject("border-collapse", "collapse"));
					} else if(attributes.item(i).value == "separating") {
						rule.push(this.toCSSObject("border-collapse", "separate"));
					}
				}
*/
			} else if(attributes.item(i).name == "style:auto-text-indent") {
			} else if(attributes.item(i).name == "text:line-number") {
			} else if(attributes.item(i).name == "text:number-lines") {
			} else if(attributes.item(i).name == "fo:keep-with-next") {
			} else if(attributes.item(i).name == "style:page-number") {
//Nothing
			} else if(attributes.item(i).name == "style:justify-single-word") {
				if(attributes.item(i).value == "true") {
					rule.push(this.toCSSObject("text-justify", "inter-character"));
				} else {
					rule.push(this.toCSSObject("text-justify", "inter-word"));
				}
			} else if(attributes.item(i).name == "style:font-weight-asian") {
				rule.push(this.toCSSObject("font-weight", this.fontWeight(attributes.item(i).value)));
			} else if(attributes.item(i).name == "style:font-weight-complex") {
//Nothing
			} else if(attributes.item(i).name == "fo:font-weight") {
				if(node.getAttribute("style:font-weight-asian") == null) {
					rule.push(this.toCSSObject(this.localName(attributes.item(i)), this.fontWeight(attributes.item(i).value)));
				}
			
			} else if(attributes.item(i).name == "style:font-style-asian") {
				rule.push(this.toCSSObject("font-style", attributes.item(i).value));
			} else if(attributes.item(i).name == "style:font-style-complex") {
//Nothing
			} else if(attributes.item(i).name == "fo:font-style") {
				if(node.getAttribute("style:font-style-asian") == null) {
					rule.push(this.toCSSObject(this.localName(attributes.item(i)), attributes.item(i).value));
				}
			} else if(
				attributes.item(i).name == "fo:widows" ||
				attributes.item(i).name == "fo:orphans" ||
				attributes.item(i).name == "fo:line-height" ||
				attributes.item(i).name == "fo:text-align" ||
				attributes.item(i).name == "fo:text-align-last" ||
				attributes.item(i).name == "fo:margin-bottom" ||
				attributes.item(i).name == "fo:margin-left" ||
				attributes.item(i).name == "fo:margin-right" ||
				attributes.item(i).name == "fo:margin-top" ||
				attributes.item(i).name == "fo:text-indent"
			) {
				rule.push(this.toCSSObject(this.localName(attributes.item(i)), attributes.item(i).value));
			} else if(attributes.item(i).name == "style:rel-column-width") {
//Nothing
			} else if(attributes.item(i).name == "style:column-width") {
				if(
					node.getAttribute("style:use-optimal-column-width") != null &&
					node.getAttribute("style:use-optimal-column-width") == "true"
				) {
					rule.push(this.toCSSObject("width", "auto"));
				} else {
					rule.push(this.toCSSObject("width", attributes.item(i).value));
				}
			} else if(attributes.item(i).name == "table:align") {
				if(attributes.item(i).value == "margins") {
//Nothing
				} else if(attributes.item(i).value == "center") {
					rule.push(this.toCSSObject("margin-left", "auto"));
					rule.push(this.toCSSObject("margin-right", "auto"));
				} else {
					rule.push(this.toCSSObject("text-align", attributes.item(i).value));
				}
			} else if(attributes.item(i).name == "style:min-row-height") {
				rule.push(this.toCSSObject("height", attributes.item(i).value));
			} else if(attributes.item(i).name == "style:row-height") {
				rule.push(this.toCSSObject("height", attributes.item(i).value + " !important"));
			} else if(attributes.item(i).name == "style:width") {
				if(node.nodeName == "style:footnote-sep") {
					rule.push(this.toCSSObject("height", attributes.item(i).value));
				} else {
					rule.push(this.toCSSObject(this.localName(attributes.item(i)), attributes.item(i).value));
				}
			} else if(attributes.item(i).name == "style:vertical-align") {
				if(attributes.item(i).value == "") {
					rule.push(this.toCSSObject(this.localName(attributes.item(i)), "top"));
				} else {
					rule.push(this.toCSSObject(this.localName(attributes.item(i)), attributes.item(i).value));
				}
			} else if(
				attributes.item(i).name == "fo:background-color" ||
				attributes.item(i).name == "fo:border" ||
				attributes.item(i).name == "fo:border-bottom" ||
				attributes.item(i).name == "fo:border-left" ||
				attributes.item(i).name == "fo:border-right" ||
				attributes.item(i).name == "fo:border-top" ||
				attributes.item(i).name == "fo:padding" ||
				attributes.item(i).name == "fo:padding-bottom" ||
				attributes.item(i).name == "fo:padding-left" ||
				attributes.item(i).name == "fo:padding-right" ||
				attributes.item(i).name == "fo:padding-top"
			) {
				rule.push(this.toCSSObject(this.localName(attributes.item(i)), attributes.item(i).value));
			} else if(attributes.item(i).name == "style:num-format") {
			} else if(attributes.item(i).name == "style:layout-grid-color") {
			} else if(attributes.item(i).name == "style:layout-grid-lines") {
			} else if(attributes.item(i).name == "style:layout-grid-base-height") {
			} else if(attributes.item(i).name == "style:layout-grid-ruby-height") {
			} else if(attributes.item(i).name == "style:layout-grid-mode") {
			} else if(attributes.item(i).name == "style:layout-grid-ruby-below") {
			} else if(attributes.item(i).name == "style:layout-grid-print") {
			} else if(attributes.item(i).name == "style:layout-grid-display") {
			} else if(attributes.item(i).name == "loext:margin-gutter") {
			} else if(attributes.item(i).name == "style:footnote-max-height") {
//Nothing
			} else if(
				attributes.item(i).name == "fo:page-width" ||
				attributes.item(i).name == "fo:page-height" ||
				attributes.item(i).name == "style:print-orientation"
			) {
				rule.push(this.toCSSObject(this.localName(attributes.item(i)), attributes.item(i).value));
			} else if(attributes.item(i).name == "style:text-line-through-type") {
				if(attributes.item(i).value != "none") {
					if(window.document.documentMode) {
						rule.push(this.toCSSObject("text-decoration", "line-through"));
					}
					rule.push(this.toCSSObject("text-decoration-line", "line-through"));
					rule.push(this.toCSSObject("text-decoration-style", attributes.item(i).value));
				}
			} else if(
				attributes.item(i).name == "style:text-underline-style" ||
				attributes.item(i).name == "style:text-underline-type"
			) {
				if(attributes.item(i).value != "none") {
					if(window.document.documentMode) {
						rule.push(this.toCSSObject("text-decoration", "underline"));
					}
					rule.push(this.toCSSObject("text-decoration-line", "underline"));
					rule.push(this.toCSSObject("text-decoration-style", attributes.item(i).value));
				}
			} else if(attributes.item(i).name == "style:text-underline-width") {
				rule.push(this.toCSSObject("text-decoration-thickness", attributes.item(i).value));
			} else if(attributes.item(i).name == "style:text-underline-color") {
				if(attributes.item(i).value == "font-color") {
					rule.push(this.toCSSObject("text-decoration-color", "currentcolor"));
				} else {
					rule.push(this.toCSSObject("text-decoration-color", attributes.item(i).value));
				}
			} else if(attributes.item(i).name == "style:letter-kerning") {
				if(attributes.item(i).value == "true") {
					rule.push(this.toCSSObject("font-kerning", "normal"));
				} else {
					rule.push(this.toCSSObject("font-kerning", "none"));
				}
			} else if(attributes.item(i).name == "style:tab-stop-distance") {
				rule.push(this.toCSSObject("tab-size", attributes.item(i).value));
			} else if(attributes.item(i).name == "style:writing-mode") {
				rule.push(this.toCSSObject(this.localName(attributes.item(i)), attributes.item(i).value));
				if(attributes.item(i).value == "rl-tb" || attributes.item(i).value == "rl") {
					rule.push(this.toCSSObject("direction", "rtl"));
					rule.push(this.toCSSObject("unicode-bidi", "bidi-override"));
				}
			} else if(
				attributes.item(i).name == "fo:letter-spacing"
			) {
				rule.push(this.toCSSObject(this.localName(attributes.item(i)), attributes.item(i).value));
			} else if(attributes.item(i).name == "text:anchor-type") {
			} else if(attributes.item(i).name == "style:horizontal-rel") {
			} else if(attributes.item(i).name == "style:vertical-pos") {
			} else if(attributes.item(i).name == "style:vertical-rel") {
			} else if(attributes.item(i).name == "draw:gamma") {
			} else if(attributes.item(i).name == "fo:hyphenation-ladder-count") {
			} else if(attributes.item(i).name == "fo:hyphenate") {
			} else if(attributes.item(i).name == "fo:hyphenation-push-char-count") {
			} else if(attributes.item(i).name == "fo:hyphenation-remain-char-count") {
			} else if(attributes.item(i).name == "style:mirror") {
			} else if(attributes.item(i).name == "style:use-window-font-color") {
			} else if(attributes.item(i).name == "style:run-through") {
			} else if(attributes.item(i).name == "style:number-wrapped-paragraphs") {
			} else if(attributes.item(i).name == "draw:shadow-opacity") {
//Nothing
			} else if(attributes.item(i).name == "style:shadow") {
				rule.push(this.toCSSObject("box-shadow", attributes.item(i).value));
			} else if(attributes.item(i).name == "svg:x") {
				rule.push(this.toCSSObject("left", attributes.item(i).value));
			} else if(attributes.item(i).name == "svg:y") {
				rule.push(this.toCSSObject("top", attributes.item(i).value));
			} else if(attributes.item(i).name == "style:horizontal-pos") {
				rule.push(this.toCSSObject("text-align", attributes.item(i).value));
			} else if(attributes.item(i).name == "style:wrap") {
				rule.push(this.toCSSObject("-graha-style-wrap", attributes.item(i).value));
			} else if(attributes.item(i).name == "draw:contrast") {
				rule.push(this.toCSSObject("filter", "contrast(" + attributes.item(i).value + ")"));
			} else if(attributes.item(i).name == "draw:image-opacity") {
				rule.push(this.toCSSObject("filter", "opacity(" + attributes.item(i).value + ")"));
			} else if(attributes.item(i).name == "draw:luminance") {
				rule.push(this.toCSSObject("filter", "brightness(" + attributes.item(i).value + ")"));
			} else if(attributes.item(i).name == "draw:color-inversion") {
				if(
					attributes.item(i).value &&
					attributes.item(i).value != null &&
					attributes.item(i).value == "true"
				) {
					rule.push(this.toCSSObject("filter", "invert(100%)"));
				}
			} else if(attributes.item(i).name == "draw:color-mode") {
				if(attributes.item(i).value && attributes.item(i).value != null) {
					if(attributes.item(i).value == "standard") {
					} else if(attributes.item(i).value == "mono") {
					} else if(attributes.item(i).value == "watermark") {
//Nothing
					} else if(attributes.item(i).value == "greyscale") {
						rule.push(this.toCSSObject("filter", "grayscale(100%)"));
					}
				}
			} else if(
				attributes.item(i).name == "draw:blue" ||
				attributes.item(i).name == "draw:green" ||
				attributes.item(i).name == "draw:red"
			) {
				var red = "0%";
				var green = "0%";
				var blue = "0%";
				if(node.getAttribute("draw:red") != null) {
					red = node.getAttribute("draw:red");
				}
				if(node.getAttribute("draw:green") != null) {
					green = node.getAttribute("draw:green");
				}
				if(node.getAttribute("draw:blue") != null) {
					blue = node.getAttribute("draw:blue");
				}
				rule.push(this.toCSSObject("color", "rgb(" + red + ", " + green + ", " + blue + ")"));
			} else if(
				attributes.item(i).name == "fo:clip"
			) {
				rule.push(this.toCSSObject(this.localName(attributes.item(i)), attributes.item(i).value));
			} else if(attributes.item(i).name == "style:text-position") {
				if(attributes.item(i).value && attributes.item(i).value != null) {
					if(attributes.item(i).value.indexOf(" ") > 0) {
						var textPosition = attributes.item(i).value;
						rule.push(this.toCSSObject("vertical-align", textPosition.substring(0, textPosition.indexOf(" "))));
						rule.push(this.toCSSObject("font-size", textPosition.substring(textPosition.indexOf(" ") + 1)));
					} else {
						rule.push(this.toCSSObject("vertical-align", attributes.item(i).value));
					}
				}
			} else if(attributes.item(i).name == "style:dynamic-spacing") {
			} else if(attributes.item(i).name == "draw:fill") {
//Nothing

			} else if(attributes.item(i).name == "style:color") {
				rule.push(this.toCSSObject(this.localName(attributes.item(i)), attributes.item(i).value));
				if(node.nodeName == "style:footnote-sep") {
					rule.push(this.toCSSObject("background-color", attributes.item(i).value));
				}
			} else if(attributes.item(i).name == "style:rel-width") {
				if(node.nodeName == "style:footnote-sep") {
					rule.push(this.toCSSObject("width", attributes.item(i).value));
				}
			} else if(attributes.item(i).name == "style:adjustment") {
				if(node.nodeName == "style:footnote-sep") {
					if(attributes.item(i).value == "left") {
						rule.push(this.toCSSObject("margin-right", "100%"));
					}
				}
			} else if(attributes.item(i).name == "style:line-style") {
				if(node.nodeName == "style:footnote-sep") {
					rule.push(this.toCSSObject("border-style", attributes.item(i).value));
				}
			} else if(attributes.item(i).name == "style:distance-before-sep") {
				if(node.nodeName == "style:footnote-sep") {
					rule.push(this.toCSSObject("margin-top", attributes.item(i).value));
				}
			} else if(attributes.item(i).name == "style:distance-after-sep") {
				if(node.nodeName == "style:footnote-sep") {
					rule.push(this.toCSSObject("margin-bottom", attributes.item(i).value));
				}
			} else if(
				attributes.item(i).name == "fo:min-height" ||
				attributes.item(i).name == "fo:font-variant" ||
				attributes.item(i).name == "fo:text-transform"
			) {
				rule.push(this.toCSSObject(this.localName(attributes.item(i)), attributes.item(i).value));
			} else if(attributes.item(i).name == "text:display") {
				console.error(node, attributes.item(i));
			} else if(attributes.item(i).name == "style:use-optimal-column-width") {
			} else if(attributes.item(i).name == "style:use-optimal-row-height") {
			} else if(attributes.item(i).name == "style:glyph-orientation-vertical") {
			} else if(attributes.item(i).name == "style:layout-grid-standard-mode") {
			} else if(attributes.item(i).name == "style:snap-to-layout-grid") {
			} else if(attributes.item(i).name == "style:font-relief") {
			} else if(attributes.item(i).name == "style:layout-grid-base-width") {
			} else if(attributes.item(i).name == "style:layout-grid-snap-to") {
//Nothing
			} else if(attributes.item(i).name == "style:text-outline") {
				rule.push(this.toCSSObject("text-stroke", attributes.item(i).value));
			} else if(attributes.item(i).name == "fo:wrap-option") {
				rule.push(this.toCSSObject("text-wrap", attributes.item(i).value));
			} else if(attributes.item(i).name == "style:text-emphasize") {
				rule.push(this.toCSSObject("text-emphasis", attributes.item(i).value));
			} else if(attributes.item(i).name == "style:text-scale") {
				rule.push(this.toCSSObject("font-size", attributes.item(i).value));
			} else if(attributes.item(i).name == "style:text-combine") {
				rule.push(this.toCSSObject("text-combine-upright", attributes.item(i).value));
			} else if(attributes.item(i).name == "draw:fill-color") {
				rule.push(this.toCSSObject("background-color", attributes.item(i).value));
			} else if(attributes.item(i).name == "svg:stroke-width") {
				rule.push(this.toCSSObject("border-width", attributes.item(i).value));
			} else if(attributes.item(i).name == "svg:stroke-color") {
				rule.push(this.toCSSObject("border-color", attributes.item(i).value));
			} else if(attributes.item(i).name == "draw:stroke") {
				if(attributes.item(i).value == "dash") {
					rule.push(this.toCSSObject("border-style", "dashed"));
				} else {
					rule.push(this.toCSSObject("border-style", attributes.item(i).value));
				}
			} else if(attributes.item(i).name == "draw:stroke-dash") {
//Nothing
			} else if(attributes.item(i).name == "draw:stroke-linejoin") {
			} else if(attributes.item(i).name == "draw:wrap-influence-on-position") {
			} else if(attributes.item(i).name == "style:flow-with-text") {
//Nothing
			} else if(attributes.item(i).name == "draw:textarea-horizontal-align") {
				rule.push(this.toCSSObject("text-align", attributes.item(i).value));
			} else if(attributes.item(i).name == "style:line-height-at-least") {
				rule.push(this.toCSSObject("line-height", attributes.item(i).value));
			} else if(attributes.item(i).name == "draw:textarea-vertical-align") {
				rule.push(this.toCSSObject("vertical-align", attributes.item(i).value));
//Todo
			} else {
				console.error(attributes.item(i).name, attributes.item(i).value);
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
//Nothing
		}
	}
};
GrahaOdt2HtmlConverter.prototype.footer = function(node) {
	if(node != null) {
		var element = document.createElement("div");
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "text:p") {
					var paragraph = document.createElement("p");
					this.paragraph(node.childNodes[i], paragraph);
					element.appendChild(paragraph);
				} else if(node.childNodes[i].nodeName == "table:table") {
					var table = document.createElement("table");
					this.table(node.childNodes[i], table);
					element.appendChild(table);
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		if(node.nodeName == "style:header") {
			element.setAttribute("class", "graha_header");
			$(this.wrapper).prepend(element);
			if(this.pageHeader && this.pageHeader != null) {
			} else {
				this.pageHeader = element;
			}
		} else if(node.nodeName == "style:footer") {
			element.setAttribute("class", "graha_footer");
			this.wrapper.appendChild(element);
			if(this.pageFooter && this.pageFooter != null) {
			} else {
				this.pageFooter = element;
			}
		} else {
			console.error(node);
		}
	}
};
GrahaOdt2HtmlConverter.prototype.css = function(node, rules) {
	if(node != null) {
		var rule = new Array();
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				this.rule(node.childNodes[i], rule);
			}
		}
		if(node.nodeName == "style:master-page") {
			if(node.getAttribute("style:name") != null && node.getAttribute("style:page-layout-name") != null) {
				rules.push({
					selector: this.toCSSSelector("master-page", node.getAttribute("style:name")),
					rule : null,
					extend: node.getAttribute("style:page-layout-name")
				});
			}
			for(var i = 0; i < node.childNodes.length; i++) {
				if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
					if(
						node.childNodes[i].nodeName == "style:header" ||
						node.childNodes[i].nodeName == "style:footer"
					) {
						this.footer(node.childNodes[i]);
					}
				}
			}
		} else {
			var classSelector = null;
			if(node.getAttribute("style:name") != null) {
				classSelector = node.getAttribute("style:name");
			}
			var typeSelector = null;
			if(node.getAttribute("style:family") == "paragraph") {
				typeSelector = "p";
			} else if(node.getAttribute("style:family") == "table") {
				typeSelector = "table";
				rule.push(this.toCSSObject("border-spacing", "0"));
//				rule.push(this.toCSSObject("table-layout", "fixed"));
			} else if(node.getAttribute("style:family") == "table-row") {
				typeSelector = "tr";
			} else if(node.getAttribute("style:family") == "table-column") {
				typeSelector = "col";
			} else if(node.getAttribute("style:family") == "table-cell") {
				typeSelector = "td";
			} else if(node.getAttribute("style:family") == "text") {
				typeSelector = "span";
			} else if(
				node.nodeName == "style:page-layout" ||
				node.nodeName == "style:default-page-layout"
			) {
			} else if(node.nodeName == "style:page-layout-properties") {
				typeSelector = "hr";
				classSelector = "graha_footnote_sep";
			} else if(node.nodeName == "style:header-style") {
				typeSelector = "div";
				classSelector = "graha_header";
			} else if(node.nodeName == "style:footer-style") {
				typeSelector = "div";
				classSelector = "graha_footer";
			} else if(node.getAttribute("style:family") == "graphic") {
				typeSelector = "div";
			} else {
				console.error(node);
			}
			
			var extend = null;
			if(node.getAttribute("style:parent-style-name") != null) {
				extend = node.getAttribute("style:parent-style-name");
			}
			if(typeSelector != null || classSelector != null) {
				rules.push({
					selector: this.toCSSSelector(typeSelector, classSelector),
					rule : rule,
					extend: extend
				});
			}
			if(node.nodeName == "style:page-layout") {
				for(var i = 0; i < node.childNodes.length; i++) {
					if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
						if(node.childNodes[i].nodeName == "style:header-style") {
							this.css(node.childNodes[i], rules);
						} else if(node.childNodes[i].nodeName == "style:footer-style") {
							this.css(node.childNodes[i], rules);
						} else if(node.childNodes[i].nodeName == "style:page-layout-properties") {
							this.css(node.childNodes[i], rules);
						}
					}
				}
			}
		}
	}
};
GrahaOdt2HtmlConverter.prototype.notes = function(node, rules) {
	if(node.getAttribute("text:note-class") != null) {
		if(node.getAttribute("text:note-class") == "endnote" || node.getAttribute("text:note-class") == "footnote") {
			var note = {};
			if(node.getAttribute("style:num-format") != null) {
				note.numFormat = node.getAttribute("style:num-format");
			}
			if(node.getAttribute("text:start-value") != null) {
				note.startValue = node.getAttribute("text:start-value");
			}
			if(node.getAttribute("text:start-numbering-at") != null) {
				note.startNumberingAt = node.getAttribute("text:start-numbering-at");
			}
			if(node.getAttribute("text:footnotes-position") != null) {
				note.footnotesPosition = node.getAttribute("text:footnotes-position");
			}
			if(node.getAttribute("text:citation-body-style-name") != null) {
				note.citationBodyStyleName = node.getAttribute("text:citation-body-style-name");
			}
			if(node.getAttribute("text:citation-style-name") != null) {
				note.citationStyleName = node.getAttribute("text:citation-style-name");
			}
			if(node.getAttribute("text:note-class") == "endnote") {
				this.endnote = note;
			} else if(node.getAttribute("text:note-class") == "footnote") {
				this.footnote = note;
			}
		} else {
			console.error(node.childNodes[i]);
		}
	} else {
		console.error(node.childNodes[i]);
	}
};
GrahaOdt2HtmlConverter.prototype.rules = function(node, rules) {
	for(var i = 0; i < node.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
			if(node.childNodes[i].nodeName == "text:outline-style") {
			} else if(node.childNodes[i].nodeName == "text:linenumbering-configuration") {
//Nothing
			} else if(node.childNodes[i].nodeName == "text:notes-configuration") {
				this.notes(node.childNodes[i], rules);
			} else if(node.childNodes[i].nodeName == "style:style") {
				this.css(node.childNodes[i], rules);
			} else if(node.childNodes[i].nodeName == "style:default-style") {
				if(node.childNodes[i].getAttribute("style:family") == "graphic") {
//Nothing
					continue;
				}
				this.css(node.childNodes[i], rules);
			} else if(
				node.childNodes[i].nodeName == "style:page-layout" ||
				node.childNodes[i].nodeName == "style:default-page-layout"
			) {
				this.css(node.childNodes[i], rules);
			} else if(node.childNodes[i].nodeName == "style:master-page") {
				this.css(node.childNodes[i], rules);
			} else if(node.childNodes[i].nodeName == "number:number-style") {
//Nothing
			} else {
				console.error(node.childNodes[i]);
			}
		}
	}
};
GrahaOdt2HtmlConverter.prototype.getPageRule = function(styles) {
	if(styles != null && styles.styles && styles.styles != null) {
		var rules = new Array();
		if(styles.styles.automaticStyles != null) {
			var node = styles.styles.automaticStyles;
			this.rules(node, rules);
		}
		if(styles.styles.masterStyles != null) {
			var node = styles.styles.masterStyles;
			this.rules(node, rules);
		}
		var masterPageRule = null;
		var footerRule = null;
		var headerRule = null;
		var grahaHeaderRule = null;
		var grahaFooterRule = null;
		var grahaFootnoteSep = null;
		if(rules != null) {
			for(var i = 0; i < rules.length; i++) {
				if(
					rules[i] != null &&
					rules[i].selector &&
					rules[i].selector != null &&
					rules[i].selector.typeSelector &&
					rules[i].selector.typeSelector != null &&
					rules[i].selector.typeSelector == "master-page" &&
					rules[i].selector.classSelector &&
					rules[i].selector.classSelector != null &&
					rules[i].selector.classSelector != "HTML"
				) {
					masterPageRule = rules[i];
				} else if(
					rules[i] != null &&
					rules[i].extend &&
					rules[i].extend != null &&
					rules[i].extend == "Footer"
				) {
					var footerRule = rules[i];
				} else if(
					rules[i] != null &&
					rules[i].extend &&
					rules[i].extend != null &&
					rules[i].extend == "Header"
				) {
					var headerRule = rules[i];
				} else if(
					rules[i] != null &&
					rules[i].selector &&
					rules[i].selector != null &&
					rules[i].selector.typeSelector &&
					rules[i].selector.typeSelector != null &&
					rules[i].selector.typeSelector == "hr" &&
					rules[i].selector.classSelector &&
					rules[i].selector.classSelector != null &&
					rules[i].selector.classSelector == "graha_footnote_sep"
				) {
					grahaFootnoteSep = rules[i];
				} else if(
					rules[i] != null &&
					rules[i].selector &&
					rules[i].selector != null &&
					rules[i].selector.typeSelector &&
					rules[i].selector.typeSelector != null &&
					rules[i].selector.typeSelector == "div" &&
					rules[i].selector.classSelector &&
					rules[i].selector.classSelector != null &&
					rules[i].selector.classSelector == "graha_header"
				) {
					grahaHeaderRule = rules[i];
				} else if(
					rules[i] != null &&
					rules[i].selector &&
					rules[i].selector != null &&
					rules[i].selector.typeSelector &&
					rules[i].selector.typeSelector != null &&
					rules[i].selector.typeSelector == "div" &&
					rules[i].selector.classSelector &&
					rules[i].selector.classSelector != null &&
					rules[i].selector.classSelector == "graha_footer"
				) {
					grahaFooterRule = rules[i];
				}
			}

			if(masterPageRule == null) {
				return;
			} else if(masterPageRule.extend && masterPageRule.extend != null) {
				for(var i = 0; i < rules.length; i++) {
					if(
						rules[i] != null &&
						rules[i].selector &&
						rules[i].selector != null &&
						rules[i].selector.classSelector &&
						rules[i].selector.classSelector != null &&
						rules[i].selector.classSelector == masterPageRule.extend
					) {
						masterPageRule = rules[i];
					}
				}
			}
			return {
				masterPageRule: masterPageRule,
				footerRule: footerRule,
				headerRule: headerRule,
				grahaHeaderRule: grahaHeaderRule,
				grahaFooterRule: grahaFooterRule,
				grahaFootnoteSep: grahaFootnoteSep
			};
		}
	}
};
GrahaOdt2HtmlConverter.prototype.mergeCSSRule = function(rules, font) {
	if(rules == null) {
		return "";
	}
	var rule = "";
	var index = 0;
	for(var i = 0; i < rules.length; i++) {
		if(font == 1 && rules[i].name && rules[i].name != null && rules[i].name == "font-size") {
			continue;
		} else if(font == 2 && rules[i].name && rules[i].name != null && rules[i].name != "font-size") {
			continue;
		}
		if(index > 0) {
			rule += "\n\t";
		}
		if(rules[i].name && rules[i].name != null && rules[i].name == "text-justify") {
			rule += "-graha-text-justify: " + rules[i].value + ";";
		} else if(rules[i].name && rules[i].name != null && rules[i].name == "font-size") {
			if(rules[i].value == "2pt") {
				rule += "-webkit-text-size-adjust: none;";
				rule += "font-size: 0.5px !important;";
				rule += "zoom: 0.05;";
			} else {
				rule += "font-size: " + rules[i].value + ";";
			}
		} else if(rules[i].name && rules[i].name != null && rules[i].name == "font-family") {
			if(
				rules[i].value &&
				typeof(rules[i].value) == "object" &&
				rules[i].value.fontStyle &&
				rules[i].value.fontStyle != null
			) {
				rule += "font-style: " + rules[i].value.fontStyle + ";";
			}
			if(
				rules[i].value &&
				typeof(rules[i].value) == "object" &&
				rules[i].value.fontWeight &&
				rules[i].value.fontWeight != null
			) {
				rule += "font-weight: " + rules[i].value.fontWeight + ";";
			}
			rule += rules[i].toString() + ";";
		} else if(rules[i].name && rules[i].name != null && rules[i].name == "text-align") {
			if(rules[i].value && rules[i].value != null) {
				if(rules[i].value == "end") {
					rule += rules[i].name + ": right;";
				} else {
					rule += rules[i].toString() + ";";
				}
			}
		} else if(rules[i].name && rules[i].name != null && rules[i].name == "page-width") {
			if(rules[i].value && rules[i].value != null) {
				rule += "width: " + rules[i].value + ";";
			}
		} else if(rules[i].name && rules[i].name != null && rules[i].name == "page-height") {
			if(rules[i].value && rules[i].value != null) {
				rule += "height: " + rules[i].value + ";";
			}
		} else if(rules[i].name && rules[i].name != null && rules[i].name == "print-orientation") {
//IGNORE
		} else {
			rule += rules[i].toString() + ";";
		}
		index++;
	}
	return rule;
};
GrahaOdt2HtmlConverter.prototype.mergeCSSRuleList = function(ruleList, font) {
	if(ruleList == null) {
		return "";
	}
	var rule = "";
	var index = 0;
	for(var x = ruleList.length - 1; x >= 0; x--) {
		var rules = ruleList[x];
		for(var i = 0; i < rules.length; i++) {
			if(font == 1 && rules[i].name && rules[i].name != null && rules[i].name == "font-size") {
				continue;
			} else if(font == 2 && rules[i].name && rules[i].name != null && rules[i].name != "font-size") {
				continue;
			}
			if(index > 0) {
				rule += "\n\t";
			}
			if(rules[i].name && rules[i].name != null && rules[i].name == "text-justify") {
				rule += "-graha-text-justify: " + rules[i].value + ";";
			} else if(rules[i].name && rules[i].name != null && rules[i].name == "font-size") {
				if(rules[i].value == "2pt") {
					rule += "-webkit-text-size-adjust: none;";
					rule += "font-size: 0.5px !important;";
					rule += "zoom: 0.05;";
				} else {
					rule += "font-size: " + rules[i].value + ";";
				}
			} else if(rules[i].name && rules[i].name != null && rules[i].name == "font-family") {
				if(
					rules[i].value &&
					typeof(rules[i].value) == "object" &&
					rules[i].value.fontStyle &&
					rules[i].value.fontStyle != null
				) {
					rule += "font-style: " + rules[i].value.fontStyle + ";";
				}
				if(
					rules[i].value &&
					typeof(rules[i].value) == "object" &&
					rules[i].value.fontWeight &&
					rules[i].value.fontWeight != null
				) {
					rule += "font-weight: " + rules[i].value.fontWeight + ";";
				}
				rule += rules[i].toString() + ";";
			} else if(rules[i].name && rules[i].name != null && rules[i].name == "text-align") {
				if(rules[i].value && rules[i].value != null) {
					if(rules[i].value == "end") {
						rule += rules[i].name + ": right;";
					} else {
						rule += rules[i].toString() + ";";
					}
				}
			} else if(rules[i].name && rules[i].name != null && rules[i].name == "page-width") {
				if(rules[i].value && rules[i].value != null) {
					rule += "width: " + rules[i].value + ";";
				}
			} else if(rules[i].name && rules[i].name != null && rules[i].name == "page-height") {
				if(rules[i].value && rules[i].value != null) {
					rule += "height: " + rules[i].value + ";";
				}
			} else if(rules[i].name && rules[i].name != null && rules[i].name == "print-orientation") {
//IGNORE
			} else {
				rule += rules[i].toString() + ";";
			}
			index++;
		}
	}
	return rule;
};
GrahaOdt2HtmlConverter.prototype.addRuleByClassSelector = function(rules, rule, ruleList) {
	if(rules != null) {
		for(var i = 0; i < rules.length; i++) {
			if(rules[i].selector.classSelector && rules[i].selector.classSelector != null) {
				if(rules[i].selector.classSelector == rule.extend) {
					ruleList.push(rules[i].rule);
					if(rules[i].extend && rules[i].extend != null) {
						this.addRuleByClassSelector(rules, rules[i], ruleList);
					}
				}
			}
		}
	}
};
GrahaOdt2HtmlConverter.prototype.appendStyleNode = function(rule, rules, root, styleNode) {
	var ruleList = null;
	if(rule.extend && rule.extend != null) {
		ruleList = new Array();
		ruleList.push(rule.rule);
		this.addRuleByClassSelector(rules, rule, ruleList);
	}
	var font = 0;
	if(
		rule.selector.typeSelector &&
		rule.selector.typeSelector != null &&
		rule.selector.typeSelector == "p" &&
		rule.selector.classSelector &&
		rule.selector.classSelector != null
	) {
		font = 1;
	}
	font = 0;
	var cssStyleRule = root + " " + rule.selector.toString();
	cssStyleRule += " {\n\t";
	if(ruleList != null) {
		cssStyleRule += this.mergeCSSRuleList(ruleList, font);
	} else {
		cssStyleRule += this.mergeCSSRule(rule.rule, font);
	}
	cssStyleRule += "\n}\n";
	if(font == 1) {
		cssStyleRule += root + " " + "font." + rule.selector.classSelector;
		cssStyleRule += " {\n\t";
		if(ruleList != null) {
			cssStyleRule += this.mergeCSSRuleList(ruleList, 2);
		} else {
			cssStyleRule += this.mergeCSSRule(rule.rule, 2);
		}
		cssStyleRule += "\n}\n";
	}
	styleNode.appendChild(document.createTextNode(cssStyleRule));
};
GrahaOdt2HtmlConverter.prototype.style = function(root) {
	var styleNode = document.createElement("style");
	styleNode.type = "text/css";
	styleNode.setAttribute("type", "text/css");
	styleNode.appendChild(document.createTextNode(root + " " + this.grahaEntirePageSelector + " {margin: 0; padding: 0; position: relative;}"));
	styleNode.appendChild(document.createTextNode(root + " p {margin: 0;z-index: 1;}"));
	styleNode.appendChild(document.createTextNode(root + " td {vertical-align:top;}"));
	styleNode.appendChild(document.createTextNode(root + " span.graha-text-justify {word-spacing: -3pt;}"));
	styleNode.appendChild(document.createTextNode(root + " span.graha_transparent {text-decoration: none;}"));
	styleNode.appendChild(document.createTextNode(root + " div.graha_draw_frame {display: none;position: relative;}"));
	styleNode.appendChild(document.createTextNode(root + " img.graha_draw_image {position: relative;}"));
	styleNode.appendChild(document.createTextNode(root + " div.graha_draw_frame_as_table {position: absolute;}"));
	
	var styles = this.getStyle();
	if(styles != null) {
		var rules = new Array();
		if(styles.styles != null) {
			if(styles.styles.styles != null) {
				var node = styles.styles.styles;
				this.rules(node, rules);
			}
			if(styles.styles.automaticStyles != null) {
				var node = styles.styles.automaticStyles;
				this.rules(node, rules);
			}
		}
		if(styles.content != null) {
			if(styles.content.automaticStyles != null) {
				var node = styles.content.automaticStyles;
				this.rules(node, rules);
			}
		}
		if(rules != null) {
			for(var i = 0; i < rules.length; i++) {
				this.appendStyleNode(rules[i], rules, root, styleNode);
			}
		}
		var pageRule = this.getPageRule(styles);
		var masterPageRule = null;
		if(pageRule != null) {
			masterPageRule = pageRule.masterPageRule;
			if(pageRule.footerRule != null) {
				this.appendStyleNode(pageRule.footerRule, rules, root, styleNode);
			}
			if(pageRule.headerRule != null) {
				this.appendStyleNode(pageRule.headerRule, rules, root, styleNode);
			}
			if(pageRule.grahaHeaderRule != null) {
				this.appendStyleNode(pageRule.grahaHeaderRule, rules, root, styleNode);
			}
			if(pageRule.grahaFooterRule != null) {
				this.appendStyleNode(pageRule.grahaFooterRule, rules, root, styleNode);
			}
			if(pageRule.grahaFootnoteSep != null) {
				this.appendStyleNode(pageRule.grahaFootnoteSep, rules, root, styleNode);
			}
		}
		this.pageLayout = {};
		if(masterPageRule != null && masterPageRule.rule && masterPageRule.rule != null && masterPageRule.rule.length > 0) {
			var cssStyleRule = root + " {\n";
			for(var i = 0; i < masterPageRule.rule.length; i++) {
				if(masterPageRule.rule[i].name == "page-width") {
					cssStyleRule += "\twidth: " + masterPageRule.rule[i].value + ";\n";
					this.pageLayout.pageWidth = masterPageRule.rule[i].value;
				} else if(masterPageRule.rule[i].name == "page-height") {
					cssStyleRule += "\theight: " + masterPageRule.rule[i].value + ";\n";
					this.pageLayout.pageHeight = masterPageRule.rule[i].value;
				} else if(masterPageRule.rule[i].name == "print-orientation") {
					this.pageLayout.pageOrientation = masterPageRule.rule[i].value;
//Nothing
				} else if(masterPageRule.rule[i].name == "margin-top") {
					cssStyleRule += "\tpadding-top: " + masterPageRule.rule[i].value + ";\n";
					this.pageLayout.marginTop = masterPageRule.rule[i].value;
				} else if(masterPageRule.rule[i].name == "margin-bottom") {
					cssStyleRule += "\tpadding-bottom: " + masterPageRule.rule[i].value + ";\n";
					this.pageLayout.marginBottom = masterPageRule.rule[i].value;
				} else if(masterPageRule.rule[i].name == "margin-left") {
					cssStyleRule += "\tpadding-left: " + masterPageRule.rule[i].value + ";\n";
					this.pageLayout.marginLeft = masterPageRule.rule[i].value;
				} else if(masterPageRule.rule[i].name == "margin-right") {
					cssStyleRule += "\tpadding-right: " + masterPageRule.rule[i].value + ";\n";
					this.pageLayout.marginRight = masterPageRule.rule[i].value;
				}
			}
			cssStyleRule += "\tbox-sizing: border-box;\n";
			if(this.defaultFontFamily && this.defaultFontFamily != null) {
				cssStyleRule += "\tfont-family: " + this.defaultFontFamily + ";\n";
			}
/*
			cssStyleRule += "\tmargin:auto;\n";
			cssStyleRule += "\tborder:black 1px solid;\n";
			cssStyleRule += "\tbackground-color:#F3F3F3;\n";
*/
			cssStyleRule += "}\n";
			styleNode.appendChild(document.createTextNode(cssStyleRule));
			
			var cssStylePageTemplateRule = root + " p.graha_page {\n";
			cssStylePageTemplateRule += "\tbox-sizing: border-box;\n";
			cssStylePageTemplateRule += "\tposition: relative;\n";
			cssStylePageTemplateRule += "\tmargin: 0;\n";
			cssStylePageTemplateRule += "\tpadding: 0;\n";
			if(this.pageLayout.pageWidth != null) {
				var unit = this.getUnit(this.pageLayout.pageWidth);
				if(unit != null) {
					var pageWidth = this.parseFloat(this.getValueStripUnit(this.pageLayout.pageWidth, unit), 0);
					var pageHeight = this.parseFloat(this.getValueStripUnit(this.pageLayout.pageHeight, unit), 0);
					var marginTop = this.parseFloat(this.getValueStripUnit(this.pageLayout.marginTop, unit), 0);
					var marginBottom = this.parseFloat(this.getValueStripUnit(this.pageLayout.marginBottom, unit), 0);
					var marginLeft = this.parseFloat(this.getValueStripUnit(this.pageLayout.marginLeft, unit), 0);
					var marginRight = this.parseFloat(this.getValueStripUnit(this.pageLayout.marginRight, unit), 0);
					cssStylePageTemplateRule += "\twidth: " + (pageWidth - marginLeft - marginRight) + unit + ";\n";
					cssStylePageTemplateRule += "\theight: " + (pageHeight - marginTop - marginBottom) + unit + ";\n";
				}
			}
			cssStylePageTemplateRule += "}\n";
			styleNode.appendChild(document.createTextNode(cssStylePageTemplateRule));
		}
	}
/*
	if(this.adjustScale) {
		if(this.pageLayout.pageWidth != null) {
			var pageWidthPxUnit = this.convertToPx(this.pageLayout.pageWidth);
			if($(document.body).width() < pageWidthPxUnit) {
				this.scale = $(document.body).width()/pageWidthPxUnit;
				styleNode.appendChild(document.createTextNode(this.wrapperSelector + " {transform: scale(" + this.scale + ");transform-origin: left top;}"));
			}
		}
	}
*/
	return styleNode;
};
GrahaOdt2HtmlConverter.prototype.getBody = function() {
		return this.findByTagName(this.content, "office:body");
};
GrahaOdt2HtmlConverter.prototype.body = function() {
	var node = this.getBody();
	if(node != null) {
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "office:text") {
					this.wrapper = document.createElement("div");
					this.wrapper.setAttribute("id", this.wrapperId);
					if(this.adjustScale) {
						var scaleWrapper = document.createElement("div");
						scaleWrapper.setAttribute("id", this.scaleWrapperId);
						scaleWrapper.appendChild(this.wrapper);
						document.body.appendChild(scaleWrapper);
					} else {
						document.body.appendChild(this.wrapper);
					}
					this.styleNode = this.style(this.wrapperSelector);
					$(this.wrapper).prepend(this.styleNode);
					var page = document.createElement("p");
					page.setAttribute("class", this.grahaEntirePageClassName);
					
					if(this.pageFooter && this.pageFooter != null) {
						$(this.pageFooter).before(page);
					} else {
						this.wrapper.appendChild(page);
					}
					this.text(node.childNodes[i], page);
					if(this.pageFooter && this.pageFooter != null) {
						if(this.footnote && this.footnote != null) {
							if(this.footnote.body && this.footnote.body != null) {
								$(this.pageFooter).before(this.footnote.body);
							}
						}
					} else {
						if(this.footnote && this.footnote != null) {
							if(this.footnote.body && this.footnote.body != null) {
								this.wrapper.appendChild(this.footnote.body);
							}
						}
					}
					return this.wrapper;
				}
			}
		}
	}
};
GrahaOdt2HtmlConverter.prototype.td = function(node, element) {
	if(node != null) {
		if(node.getAttribute("table:style-name") != null) {
			element.setAttribute("class", node.getAttribute("table:style-name"));
		}
		if(node.getAttribute("table:number-rows-spanned") != null) {
			element.setAttribute("rowspan", node.getAttribute("table:number-rows-spanned"));
		}
		if(node.getAttribute("table:number-columns-spanned") != null) {
			element.setAttribute("colspan", node.getAttribute("table:number-columns-spanned"));
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "text:p") {
					var paragraph = document.createElement("p");
					this.paragraph(node.childNodes[i], paragraph);
					element.appendChild(paragraph);
				} else if(node.childNodes[i].nodeName == "table:table") {
					var table = document.createElement("table");
					this.table(node.childNodes[i], table);
					element.appendChild(table);
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
	}
};
GrahaOdt2HtmlConverter.prototype.tr = function(node, element) {
	if(node != null) {
		if(node.getAttribute("table:style-name") != null) {
			element.setAttribute("class", node.getAttribute("table:style-name"));
		}
		var dataTableCellIndex = 1;
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "table:covered-table-cell") {
					dataTableCellIndex++;
//Nothing
/*
IE 11 Error
					var td = document.createElement("td");
					td.setAttribute("class", "graha-covered-table-cell");
					td.setAttribute("style", "display:none;");
					td.style.display = "none";
					element.appendChild(td);
*/
				} else if(node.childNodes[i].nodeName == "table:table-cell") {
					var td = document.createElement("td");
					td.setAttribute("data-table-cell-index", dataTableCellIndex.toString());
					this.td(node.childNodes[i], td);
					element.appendChild(td);
					dataTableCellIndex++;
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
	}
};
GrahaOdt2HtmlConverter.prototype.col = function(node, element) {
	if(node != null) {
		var repeat = 1;
		if(node.getAttribute("table:number-columns-repeated") != null) {
			repeat = this.parseInt(node.getAttribute("table:number-columns-repeated"), 1);
		}
		for(var x = 0; x < repeat; x++) {
			var col = document.createElement("col");
			if(node.getAttribute("table:style-name") != null) {
				col.setAttribute("class", node.getAttribute("table:style-name"));
			}
			element.appendChild(col);
		}
	}
};
GrahaOdt2HtmlConverter.prototype.colgroup = function(node, element) {
	if(node != null) {
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "table:table-column") {
					this.col(node.childNodes[i], element);
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
	}
};
GrahaOdt2HtmlConverter.prototype.tbody = function(node, element) {
	if(node != null) {
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "table:table-row") {
					var tr = document.createElement("tr");
					this.tr(node.childNodes[i], tr);
					element.appendChild(tr);
				} else if(node.childNodes[i].nodeName == "text:soft-page-break") {
//Nothing
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
	}
};
GrahaOdt2HtmlConverter.prototype.table = function(node, element) {
	if(node != null) {
		if(node.getAttribute("table:style-name") != null) {
			element.setAttribute("class", node.getAttribute("table:style-name"));
		}

		var colgroup = null;
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "table:table-column") {
					if(colgroup == null) {
						colgroup = document.createElement("colgroup");
					}
					this.col(node.childNodes[i], colgroup);
				} else if(node.childNodes[i].nodeName == "table:table-columns") {
					if(colgroup == null) {
						colgroup = document.createElement("colgroup");
					}
					this.colgroup(node.childNodes[i], colgroup);
				} else if(node.childNodes[i].nodeName == "table:table-row") {
					} else if(node.childNodes[i].nodeName == "table:table-header-rows") {
				} else if(node.childNodes[i].nodeName == "table:table-rows") {
				} else if(node.childNodes[i].nodeName == "text:soft-page-break") {
//Nothing
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		if(colgroup != null) {
			element.appendChild(colgroup);
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "table:table-column") {
				} else if(node.childNodes[i].nodeName == "table:table-columns") {
				} else if(node.childNodes[i].nodeName == "table:table-row") {
					var tr = document.createElement("tr");
					this.tr(node.childNodes[i], tr);
					element.appendChild(tr);
				} else if(node.childNodes[i].nodeName == "table:table-header-rows") {
					this.tbody(node.childNodes[i], element);
				} else if(node.childNodes[i].nodeName == "table:table-rows") {
					this.tbody(node.childNodes[i], element);
//					var tbody = document.createElement("tbody");
//					this.tbody(node.childNodes[i], tbody);
//					element.appendChild(tbody);
				} else if(node.childNodes[i].nodeName == "text:soft-page-break") {
//Nothing
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
	}
};
GrahaOdt2HtmlConverter.prototype.text = function(node, element) {
	if(node != null) {
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "text:sequence-decls") {
				} else if(node.childNodes[i].nodeName == "office:forms") {
//Nothing
				} else if(node.childNodes[i].nodeName == "text:p") {
					var paragraph = document.createElement("p");
					this.paragraph(node.childNodes[i], paragraph);
					if(node.childNodes[i].getAttribute("text:style-name") != null) {
						var preakBefore = this.getWrapperCssRuleValue(this.toCSSSelector("p", node.childNodes[i].getAttribute("text:style-name")).toString(), "-graha-break-before");
						if(preakBefore != null && preakBefore == "page") {
							element = document.createElement("p");
							element.setAttribute("class", this.grahaEntirePageClassName);
							if(this.pageFooter && this.pageFooter != null) {
								$(this.pageFooter).before(element);
							} else {
								this.wrapper.appendChild(element);
							}
						}
					}
					element.appendChild(paragraph);
				} else if(node.childNodes[i].nodeName == "table:table") {
					var table = document.createElement("table");
					this.table(node.childNodes[i], table);
					element.appendChild(table);
				} else if(node.childNodes[i].nodeName == "text:note-body") {
					var note = document.createElement("p");
					this.paragraph(node.childNodes[i], note);
					element.appendChild(note);
				} else if(node.childNodes[i].nodeName == "draw:frame") {
					var div = document.createElement("div");
					this.draw(node.childNodes[i], div);
					element.appendChild(div);
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
	}
};
GrahaOdt2HtmlConverter.prototype.span = function(node, element, grahaTextJustify) {
	if(node != null) {
		if(node.getAttribute("text:style-name") != null) {
			element.setAttribute("class", node.getAttribute("text:style-name"));
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "text:span") {
					var span = document.createElement("span");
					this.span(node.childNodes[i], span, grahaTextJustify);
					element.appendChild(span);
				} else if(node.childNodes[i].nodeName == "text:note") {
					this.note(node.childNodes[i], element);
				} else if(node.childNodes[i].nodeName == "text:s") {
					this.space(node.childNodes[i], element);
				} else if(node.childNodes[i].nodeName == "text:line-break") {
					var br = document.createElement("br");
					element.appendChild(br);
				} else if(node.childNodes[i].nodeName == "text:page-number") {
					var span = document.createElement("span");
					span.setAttribute("class", "graha-page-number");
					if(node.childNodes[i].firstChild) {
						span.appendChild(document.createTextNode(node.childNodes[i].firstChild.nodeValue));
					}
					element.appendChild(span);
				} else {
					console.error(node.childNodes[i]);
				}
			} else if(Node.TEXT_NODE == node.childNodes[i].nodeType) {
				if(grahaTextJustify != null && grahaTextJustify == "inter-character") {
					if(node.childNodes[i].nodeValue != null) {
						for(var x = 0; x < node.childNodes[i].nodeValue.length; x++) {
							var span = document.createElement("span");
							span.appendChild(document.createTextNode(" "));
							span.setAttribute("class", "graha-text-justify");
							element.appendChild(span);
							
							span = document.createElement("span");
							
							span.appendChild(document.createTextNode(node.childNodes[i].nodeValue.charAt(x)));
							element.appendChild(span);
						}
					}
				} else {
					element.appendChild(document.createTextNode(node.childNodes[i].nodeValue));
				}
			}
		}
		if(node.childNodes.length == 0) {
			var span = document.createElement("span");
			span.setAttribute("class", "graha_transparent");
			span.appendChild(document.createTextNode('\u00A0'));
			element.appendChild(span);
		}
	}
};
GrahaOdt2HtmlConverter.prototype.getWrapperCssRuleValue = function(selectorText, propertyName) {
	if(this.styleNode && this.styleNode != null) {
		var selectorPrefix = this.wrapperSelector + " " + selectorText + " {";
		var propertyPrefix = "\t" + propertyName + ": ";
		for(var i = 0; i < this.styleNode.childNodes.length; i++) {
			if(Node.TEXT_NODE == this.styleNode.childNodes[i].nodeType) {
				if(
					this.styleNode.childNodes[i].nodeValue &&
					this.styleNode.childNodes[i].nodeValue != null &&
					this.styleNode.childNodes[i].nodeValue.indexOf(selectorPrefix) == 0
				) {
					var lines = this.styleNode.childNodes[i].nodeValue.split("\n");
					var propertyValue = null;
					for(var x = 0; x < lines.length; x++) {
						if(lines[x] != null && lines[x].indexOf(propertyPrefix) == 0) {
							propertyValue = lines[x].substring(propertyPrefix.length);
							if(propertyValue.length == propertyValue.lastIndexOf(";") + 1) {
								propertyValue = propertyValue.substring(0, propertyValue.length - 1);
							}
						}
					}
					return propertyValue;
				}
			}
		}
	}
	return null;
};
GrahaOdt2HtmlConverter.prototype.draw = function(node, element) {
	if(node != null) {
		var image = null;
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "draw:image") {
					image = document.createElement("img");
					var currentNode = node.childNodes[i];
					attributes = currentNode.attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "xlink:type") {
						} else if(attributes.item(x).name == "xlink:show") {
						} else if(attributes.item(x).name == "xlink:actuate") {
						} else if(attributes.item(x).name == "draw:mime-type") {
						} else if(attributes.item(x).name == "xlink:href") {
							if(this.zip && this.zip != null) {
								if(this.promises && this.promises != null) {
								} else {
									this.promises = new Array();
								}
								var _this = this;
								this.promises.push(new Promise(function(resolve, reject) {
									_this.zip.file(currentNode.getAttribute("xlink:href")).async("base64").then(function(base64Data) {
										var mimeType = null;
										if(currentNode.getAttribute("draw:mime-type") != null) {
											mimeType = currentNode.getAttribute("draw:mime-type");
										}
										if(mimeType == null) {
											var filePath = currentNode.getAttribute("xlink:href");
											if(filePath != null && filePath.lastIndexOf(".") > 0) {
												var fileExtension = filePath.substring(filePath.lastIndexOf(".") + 1);
												if(fileExtension == "apng") {
													mimeType = "image/apng";
												} else if(fileExtension == "avif") {
													mimeType = "image/avif";
												} else if(fileExtension == "gif") {
													mimeType = "image/gif";
												} else if(fileExtension == "jpeg" || fileExtension == "jpg") {
													mimeType = "image/jpeg";
												} else if(fileExtension == "png") {
													mimeType = "image/png";
												} else if(fileExtension == "svg") {
													mimeType = "image/svg+xml";
												} else if(fileExtension == "webp") {
													mimeType = "image/webp";
												} else {
													mimeType = "image/" + fileExtension;
												}
											}
										}
										if(mimeType == null) {
											mimeType = "image/unknown";
										}
										image.setAttribute("src", "data:" + mimeType + ";base64," + base64Data);
										resolve(image);
									}).catch(function(error) {
										console.error(error);
										reject(error);
									});
								}));
							}
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "draw:text-box") {
					var currentNode = node.childNodes[i];
					for(var x = 0; x < currentNode.childNodes.length; x++) {
						if(Node.DOCUMENT_NODE == currentNode.childNodes[x].nodeType || Node.ELEMENT_NODE == currentNode.childNodes[x].nodeType) {
							if(currentNode.childNodes[x].nodeName == "table:table") {
								image = document.createElement("table");
								this.table(currentNode.childNodes[i], image);
							} else {
								console.error(currentNode.childNodes[i]);
							}
						}
					}
					if(image != null) {
						attributes = currentNode.attributes;
						var width = null;
						var height = null;
						for(var x = 0; x < attributes.length; x++) {
							if(attributes.item(x).name == "fo:min-width") {
								width = attributes.item(x).value;
							} else if(attributes.item(x).name == "fo:min-height") {
								height = attributes.item(x).value;
							} else {
								console.error(attributes.item(x));
							}
						}
						if(width != null || height != null) {
							var styleText = "";
							if(width != null) {
								styleText += "width: " + width + ";";
								element.setAttribute("data-graha-width", width);
							}
							if(height != null) {
								styleText += "height: " + height + ";";
								element.setAttribute("data-graha-height", height);
							}
							image.setAttribute("style", styleText);
						}
					} else {
						console.error(node.childNodes[i]);
					}
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		if(node.getAttribute("text:anchor-type") != null && node.getAttribute("text:anchor-type") == "as-char") {
			element.setAttribute("class", "graha_draw_frame_as_char");
			if(image != null) {
				image.setAttribute("class", "graha_draw_image_as_char");
			}
		} else if(image != null && image.nodeName == "TABLE") {
			element.setAttribute("class", "graha_draw_frame_as_table");
			image.setAttribute("class", "graha_draw_image_as_table");
		} else {
			element.setAttribute("class", "graha_draw_frame");
			if(image != null) {
				image.setAttribute("class", "graha_draw_image");
			}
		}
		var attributes = node.attributes;
		for(var i = 0; i < attributes.length; i++) {
			if(attributes.item(i).name == "text:anchor-type") {
				element.setAttribute("data-anchor-type", attributes.item(i).value);
				if(attributes.item(i).value == "page") {
					element.style.display = "none";
				}
			} else if(attributes.item(i).name == "draw:style-name") {
				element.setAttribute("class", element.getAttribute("class") + " " + attributes.item(i).value);
				if(image != null) {
					image.setAttribute("class", image.getAttribute("class") + " " + attributes.item(i).value);
				}
				var wrap = this.getWrapperCssRuleValue(this.toCSSSelector("div", node.getAttribute("draw:style-name")).toString(), "-graha-style-wrap");
				if(wrap != null) {
					element.setAttribute("data-graha-style-wrap", wrap);
				}
			} else if(attributes.item(i).name == "draw:z-index") {
				element.style.zIndex = attributes.item(i).value;
			} else if(attributes.item(i).name == "svg:width") {
				element.style.width = attributes.item(i).value;

				if(image != null) {
					image.style.width = attributes.item(i).value;
				}

			} else if(attributes.item(i).name == "svg:height") {
				element.style.height = attributes.item(i).value;

				if(image != null) {
					image.style.height = attributes.item(i).value;
				}

			} else if(attributes.item(i).name == "svg:x") {
				element.style.left = attributes.item(i).value;
			} else if(attributes.item(i).name == "svg:y") {
				element.style.top = attributes.item(i).value;
			} else if(
				attributes.item(i).name == "draw:name"
			) {
				if(image != null) {
					image.setAttribute(this.localName(attributes.item(i)), attributes.item(i).value);
				}
			} else if(attributes.item(i).name == "text:anchor-page-number") {
				element.setAttribute("data-anchor-page-number", attributes.item(i).value);
//NothingB
			} else {
				console.error(attributes.item(i));
			}
		}
		if(image != null) {
			element.appendChild(image);
		}
	}
};
GrahaOdt2HtmlConverter.prototype.note = function(node, element) {
	if(node == null) {
		return null;
	}
	if(
		this.footnote &&
		this.footnote != null &&
		this.footnote.citationStyleName &&
		this.footnote.citationStyleName != null &&
		this.footnote.citationBodyStyleName &&
		this.footnote.citationBodyStyleName != null
	) {
		var note = document.createElement("p");
		note.setAttribute("class", this.footnote.citationStyleName);
		if(node.getAttribute("text:note-class") != null) {
			note.setAttribute("data-note-class", node.getAttribute("text:note-class"));
		}
		if(node.getAttribute("text:id") != null) {
			note.setAttribute("data-note-id", node.getAttribute("text:id"));
			note.setAttribute("id", node.getAttribute("text:id"));
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "text:note-citation") {
					note.setAttribute("data-note-citation", node.childNodes[i].firstChild.nodeValue);
				} else if(node.childNodes[i].nodeName == "text:note-body") {
					this.text(node.childNodes[i], note);
				}
			}
		}
		if(note != null && note.getAttribute("data-note-citation") != null) {
			if(note.getAttribute("data-note-class") != null) {
				if(note.getAttribute("data-note-class") == "footnote") {
						var span = document.createElement("span");
						if(node.getAttribute("text:id") != null) {
							span.setAttribute("data-note-id", node.getAttribute("text:id"));
							span.setAttribute("id", "footnote_" + node.getAttribute("text:id"));
						}
						span.setAttribute("class", this.footnote.citationBodyStyleName);
						span.appendChild(document.createTextNode(note.getAttribute("data-note-citation")));
						element.appendChild(span);
						if(this.footnote.body && this.footnote.body != null) {
						} else {
							this.footnote.body = document.createElement("div");
							this.footnote.body.setAttribute("class", "graha_footnote");
							var hr = document.createElement("hr");
							hr.setAttribute("class", "graha_footnote_sep");
							this.footnote.body.appendChild(hr);
						}
						if(note.firstChild.firstChild.prepend) {
							note.firstChild.firstChild.prepend(document.createTextNode('\u00A0'));
							note.firstChild.firstChild.prepend(document.createTextNode('\u00A0'));
							note.firstChild.firstChild.prepend(document.createTextNode('\u00A0'));
							note.firstChild.firstChild.prepend(document.createTextNode(note.getAttribute("data-note-citation")));
						} else {
							$(note.firstChild.firstChild).prepend(document.createTextNode('\u00A0'));
							$(note.firstChild.firstChild).prepend(document.createTextNode('\u00A0'));
							$(note.firstChild.firstChild).prepend(document.createTextNode('\u00A0'));
							$(note.firstChild.firstChild).prepend(document.createTextNode(note.getAttribute("data-note-citation")));
						}
						this.footnote.body.appendChild(note);
				} else {
					console.error(node.childNodes[i]);
				}
			} else {
				console.error(node.childNodes[i]);
			}
		} else {
			console.error(node.childNodes[i]);
		}
	} else {
		console.error(note, node);
	}
	return null;
};
GrahaOdt2HtmlConverter.prototype.space = function(node, element) {
	if(node != null) {
		var span = document.createElement("span");
		if(node.getAttribute("text:c") != null) {
			var cnt = this.parseInt(node.getAttribute("text:c"), 1);
			for(var x = 0; x < cnt; x++) {
				span.appendChild(document.createTextNode('\u00A0'));
			}
		} else {
			span.appendChild(document.createTextNode('\u00A0'));
//			element.appendChild(document.createTextNode('\u00A0'));
//			element.appendChild(document.createTextNode('\u2004'));
		}
		element.appendChild(span);
	}
};
GrahaOdt2HtmlConverter.prototype.rect = function(node, element) {
	if(node != null) {
		element.setAttribute("style", "position:relative;");
		element.setAttribute("class", "graha_draw_rect");

		var attributes = node.attributes;
		for(var i = 0; i < attributes.length; i++) {
			if(attributes.item(i).name == "text:anchor-type") {
				element.setAttribute("data-anchor-type", attributes.item(i).value);
			} else if(attributes.item(i).name == "draw:z-index") {
				element.style.zIndex = attributes.item(i).value;
			} else if(attributes.item(i).name == "svg:width") {
				element.style.width = attributes.item(i).value;
			} else if(attributes.item(i).name == "svg:height") {
				element.style.height = attributes.item(i).value;
			} else if(attributes.item(i).name == "svg:x") {
				element.style.left = attributes.item(i).value;
			} else if(attributes.item(i).name == "svg:y") {
				element.style.top = attributes.item(i).value;
			} else if(attributes.item(i).name == "draw:name") {
				element.setAttribute(this.localName(attributes.item(i)), attributes.item(i).value);
			} else if(
				attributes.item(i).name == "draw:style-name" ||
				attributes.item(i).name == "draw:text-style-name"
			) {
				if(element.getAttribute("class") == null) {
					element.setAttribute("class", attributes.item(i).value);
				} else {
					element.setAttribute("class", element.getAttribute("class") + " " + attributes.item(i).value);
				}
			} else {
				console.error(attributes.item(i));
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "text:p") {
					var paragraph = document.createElement("p");
					this.paragraph(node.childNodes[i], paragraph);
					element.appendChild(paragraph);
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
	}
};
GrahaOdt2HtmlConverter.prototype.paragraph = function(node, parentElement) {
	if(node != null) {
		var element = document.createElement("font");
		var grahaTextJustify = null;
		if(node.getAttribute("text:style-name") != null) {
			parentElement.setAttribute("class", node.getAttribute("text:style-name"));
			element.setAttribute("class", node.getAttribute("text:style-name"));
			grahaTextJustify = this.getWrapperCssRuleValue(this.toCSSSelector("p", node.getAttribute("text:style-name")).toString(), "-graha-text-justify");
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "text:s") {
					this.space(node.childNodes[i], element);
				} else if(node.childNodes[i].nodeName == "text:span") {
					var span = document.createElement("span");
					this.span(node.childNodes[i], span, grahaTextJustify);
					element.appendChild(span);
				} else if(node.childNodes[i].nodeName == "draw:frame") {
					var div = document.createElement("div");
					this.draw(node.childNodes[i], div);
					element.appendChild(div);
					parentElement.setAttribute("style", "position:relative;");
				} else if(node.childNodes[i].nodeName == "draw:rect") {
					var div = document.createElement("div");
					this.rect(node.childNodes[i], div);
					element.appendChild(div);
				} else if(node.childNodes[i].nodeName == "text:page-number") {
					var span = document.createElement("span");
					span.setAttribute("class", "graha-page-number");
					if(node.childNodes[i].firstChild) {
						span.appendChild(document.createTextNode(node.childNodes[i].firstChild.nodeValue));
					}
					element.appendChild(span);
				} else if(node.childNodes[i].nodeName == "text:note") {
					this.note(node.childNodes[i], element);
				} else if(node.childNodes[i].nodeName == "text:line-break") {
					var br = document.createElement("br");
					element.appendChild(br);
				} else if(node.childNodes[i].nodeName == "text:soft-page-break") {
				} else if(node.childNodes[i].nodeName == "text:bookmark-start") {
				} else if(node.childNodes[i].nodeName == "text:bookmark-end") {
				} else if(node.childNodes[i].nodeName == "text:bookmark") {
//Nothing
				} else {
					console.error(node.childNodes[i]);
				}
			} else if(Node.TEXT_NODE == node.childNodes[i].nodeType) {
				if(grahaTextJustify != null && grahaTextJustify == "inter-character") {
					if(node.childNodes[i].nodeValue != null) {
						for(var x = 0; x < node.childNodes[i].nodeValue.length; x++) {
							var span = document.createElement("span");
							span.appendChild(document.createTextNode(" "));
							span.setAttribute("class", "graha-text-justify");
							element.appendChild(span);
							
							span = document.createElement("span");
							span.appendChild(document.createTextNode(node.childNodes[i].nodeValue.charAt(x)));
							element.appendChild(span);
						}
					}
				} else {
					element.appendChild(document.createTextNode(node.childNodes[i].nodeValue));
				}
			}
		}
		if(node.childNodes.length == 0) {
			var span = document.createElement("span");
			span.setAttribute("class", "graha_transparent");
			span.appendChild(document.createTextNode('\u00A0'));
			element.appendChild(span);
		}
		parentElement.appendChild(element);
	}
};

GrahaOdt2HtmlConverter.prototype.getMeta = function() {
		return this.findByTagName(this.meta, "office:meta");
};
GrahaOdt2HtmlConverter.prototype.getNodeValue = function(node) {
	return GrahaOdt2PdfConverterUtility.getNodeValue(node);
};
GrahaOdt2HtmlConverter.prototype.getPdfProperties = function() {
	var node = this.getMeta();
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var pdfProperties = {};
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "meta:editing-cycles") {
				} else if(node.childNodes[i].nodeName == "meta:editing-duration") {
				} else if(node.childNodes[i].nodeName == "meta:document-statistic") {
				} else if(node.childNodes[i].nodeName == "meta:creation-date") {
				} else if(node.childNodes[i].nodeName == "dc:date") {
				} else if(node.childNodes[i].nodeName == "meta:print-date") {
				} else if(node.childNodes[i].nodeName == "meta:template") {
				} else if(node.childNodes[i].nodeName == "meta:user-defined") {
//Nothing
				} else if(node.childNodes[i].nodeName == "dc:description") {
					pdfProperties.description = this.getNodeValue(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "dc:title") {
					pdfProperties.title = this.getNodeValue(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "dc:subject") {
					pdfProperties.subject = this.getNodeValue(node.childNodes[i]);
				} else if(
					node.childNodes[i].nodeName == "meta:generator" ||
					node.childNodes[i].nodeName == "meta:initial-creator"
				) {
					if(pdfProperties.creator && pdfProperties.creator != null) {
					} else {
						var nodeValue = this.getNodeValue(node.childNodes[i]);
						if(nodeValue && nodeValue != null) {
							pdfProperties.creator = nodeValue;
						}
					}
				} else if(node.childNodes[i].nodeName == "dc:creator") {
					var nodeValue = this.getNodeValue(node.childNodes[i]);
					if(nodeValue && nodeValue != null) {
						pdfProperties.creator = nodeValue;
					}
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return pdfProperties;
	}
	return null;
};
GrahaOdt2HtmlConverter.prototype.html = function() {
	var htmlElement = this.body();
	$(htmlElement).find("span.graha_transparent").each(function() {
		if(
			$(this).parent().children().length == 1 &&
			$(this).parent().parent().children().length == 1
		) {
			$(this).css("text-decoration", "none");
			$(this).parent().css("text-decoration", "none");
			$(this).parent().parent().css("text-decoration", "none");
		}
	});
	var pdfProperties = this.getPdfProperties();
	if(this.adjustScale) {
		if(this.pageLayout.pageWidth != null) {
			var pageWidthPxUnit = this.convertToPx(this.pageLayout.pageWidth);
			if($(document.body).width() < pageWidthPxUnit) {
				this.scale = $(document.body).width()/pageWidthPxUnit;
				$(htmlElement).css("transform", "scale(" + this.scale + ")");
				$(htmlElement).css("transform-origin", "left top");
			}
		}
	}
	var _this = this;
	return new Promise(function(resolve, reject) {
		window.setTimeout(function() {
			if(this.promises && this.promises != null && Array.isArray(this.promises) && this.promises.length > 0) {
				Promise.all(this.promises).then(function(values) {
					_this.finalizeHtml(htmlElement, pdfProperties).then(function() {
						resolve({
							htmlElement: htmlElement,
							pdfProperties: pdfProperties,
							wrapperSelector: _this.wrapperSelector,
							pageLayout: _this.pageLayout,
							odtBinary: _this.odtBinary,
							overflow: _this.overflow,
							scale: _this.scale
						});
					}).catch(function(error) {
						console.error(error);
						reject(error);
					});
				}).catch(function(error) {
					console.error(error);
					reject(error);
				});	
			} else {
				_this.finalizeHtml(htmlElement, pdfProperties).then(function() {
					resolve({
						htmlElement: htmlElement,
						pdfProperties: pdfProperties,
						wrapperSelector: _this.wrapperSelector,
						pageLayout: _this.pageLayout,
						odtBinary: _this.odtBinary,
						overflow: _this.overflow,
						scale: _this.scale
					});
				}).catch(function(error) {
					console.error(error);
					reject(error);
				});
			}
		}, 10);
	});
};
GrahaOdt2HtmlConverter.prototype.heightForParent = function(jQueryObject) {
	if(jQueryObject && jQueryObject != null && jQueryObject.length > 0) {
		if(
			jQueryObject.parent() &&
			jQueryObject.parent() != null &&
			jQueryObject.parent().length > 0
		) {
			if(jQueryObject.parent()[0].nodeName == "FONT") {
				return this.heightForParent(jQueryObject.parent());
			} else {
				var height = this.height(jQueryObject.parent());
				if(height > 0) {
					return height;
				} else {
					return this.heightForParent(jQueryObject.parent());
				}
			}
		}
	}
};
GrahaOdt2HtmlConverter.prototype.finalizeTextJustify = function() {
	var _this = this;
	return new Promise(function(resolve, reject) {
		window.setTimeout(function() {
			try {
				$(_this.wrapperSelector + " span.graha-text-justify").each(function() {
					var parent = $(this).parent();
					while(parent && parent != null && parent.length > 0) {
						if(parent[0].nodeName == "FONT" || parent[0].nodeName == "P") {
							break;
						}
						parent = $(parent).parent();
					}
					$(this).css("word-spacing", -Math.floor(_this.parseInt(parent.css("font-size"), 0) / 3));
				});
				resolve(true);
			} catch (error) {
				reject(error);
			}
		}, 10);
	});
};
GrahaOdt2HtmlConverter.prototype.finalizeParagraphFontSize = function() {
	var _this = this;
	return new Promise(function(resolve, reject) {
		window.setTimeout(function() {
			try {
				$(_this.wrapperSelector + " p").each(function() {
					if($(this).parent() && $(this).parent().length > 0) {
						if($.trim($(this).text()) != "") {
							if(parseInt($(this).parent().css("font-size")) > parseInt($(this).css("font-size"))) {
								if(
									this.childNodes.length > 0 &&
									this.firstChild.nodeName == "FONT"
								) {
									$(this.firstChild).css("font-size", $(this).css("font-size"));
									$(this).css("font-size", $(this).parent().css("font-size"));
								}
							}
						}
					}
				});
				resolve(true);
			} catch (error) {
				reject(error);
			}
		}, 100);
	});
};
GrahaOdt2HtmlConverter.prototype.finalizeDrawFrameHeight = function() {
	var _this = this;
	return new Promise(function(resolve, reject) {
		window.setTimeout(function() {
			try {
				$(_this.wrapperSelector + " div.graha_draw_frame").each(function(){
					var height = _this.heightForParent($(this));
					if(height > 0 && _this.outerWidthWithMargin(this) > height) {
						$(this).outerHeight(height, true);
					}
					$(this).show();
				});
				resolve(true);
			} catch (error) {
				reject(error);
			}
		}, 10);
	});
};
GrahaOdt2HtmlConverter.prototype.finalizeDrawFrame = function(index, drawFrame) {
	var _this = this;
	return new Promise(function(resolve, reject) {
		window.setTimeout(function() {
			try {
				if($(drawFrame).attr("data-anchor-type")) {
					var parentElement = null;
					var afterElement = null;
					if($(drawFrame).attr("data-anchor-type") == "page") {
						$(drawFrame).show();
						
						var pageTopMargin = _this.parseInt(_this.convertToPx(_this.pageLayout.marginTop), 0);
						var pageLeftMargin = _this.parseInt(_this.convertToPx(_this.pageLayout.marginLeft), 0);
						var top = _this.parseInt($(drawFrame).css("top"), 0) - pageTopMargin;
						var left = _this.parseInt($(drawFrame).css("left"), 0) - pageLeftMargin;
						$(drawFrame).css("top", top);
						$(drawFrame).css("left", left);
						
						top = _this.positionTopWithoutMargin(drawFrame);
						left = _this.positionLeftWithoutMargin(drawFrame);
						$(_this.wrapperSelector + " " + _this.grahaEntirePageSelector + " p").each(function(index, item) {
							var offsetTop = _this.offsetTopWithMargin(item);
							offsetTop -= _this.offsetTopWithoutMargin($(_this.wrapperSelector));
							var offsetBottom = _this.offsetBottomWithMargin(item);;
							offsetBottom -= _this.offsetTopWithoutMargin($(_this.wrapperSelector));
							var offsetLeft = _this.offsetLeftWithMargin(item);
							offsetLeft -= _this.offsetLeftWithoutMargin($(_this.wrapperSelector));
							var offsetRight = _this.offsetRightWithMargin(item);
							offsetRight -= _this.offsetLeftWithoutMargin($(_this.wrapperSelector));
							if(
								top >= offsetTop && top <= offsetBottom &&
								left >= offsetLeft && left <= offsetRight
							) {
								afterElement = $(item);
								parentElement = afterElement;
							}
						});
					} else if(
						$(drawFrame).attr("data-anchor-type") == "paragraph" ||
						$(drawFrame).attr("data-anchor-type") == "char"
					) {
						if($(drawFrame).parent() && $(drawFrame).parent().length > 0) {
							if($(drawFrame).parent()[0].nodeName == "FONT") {
								if($(drawFrame).parent().parent() && $(drawFrame).parent().parent().length > 0) {
									parentElement = $(drawFrame).parent().parent();
								}
							} else {
								parentElement = $(drawFrame).parent();
							}
						}
						if(parentElement != null) {
							var nextElement = parentElement;
							var top = _this.offsetTopWithMargin(drawFrame);
							var left = _this.offsetLeftWithMargin(drawFrame);
							while(nextElement && nextElement.length > 0) {
								if(afterElement == null) {
									if(
										top >= _this.offsetTopWithMargin(nextElement) &&
										left >= _this.offsetLeftWithMargin(nextElement)
									) {
										if(
											top <= _this.offsetBottomWithMargin(nextElement) &&
											left <= _this.offsetRightWithMargin(nextElement)
										) {
											afterElement = nextElement;
										}
									}
								} else {
									if($.trim(nextElement.text()) == "") {
										nextElement.children().first().text(" ");
									} else {
										break;
									}
								}
								nextElement = nextElement.next();
							}
						}
					} else {
						console.error($(drawFrame));
					}
					if($(drawFrame).attr("data-anchor-type") == "char") {
						$(drawFrame).css("margin", "0");
						parentElement.parent().css("position", "relative");
						$(drawFrame).css("position", "absolute");
						parentElement.outerHeight(_this.positionBottomWithMargin(drawFrame));
					} else if(afterElement != null) {
						var dummy = document.createElement("p");
						dummy.setAttribute("class", parentElement.attr("class"));
						dummy.setAttribute("data-graha-dummy-draw", parentElement.attr("class"));
						
						var floatCssValue = null;
						if(drawFrame.getAttribute("data-graha-style-wrap") != null) {
							if(drawFrame.getAttribute("data-graha-style-wrap") == "right") {
								floatCssValue = "left";
							} else if(drawFrame.getAttribute("data-graha-style-wrap") == "left") {
								floatCssValue = "right";
							} else {
								console.error(drawFrame);
							}
						} else {
							console.error(drawFrame);
						}
						
						var width = _this.outerWidthWithoutMargin(drawFrame);
						var height = _this.outerHeightWithoutMargin(drawFrame);

						if($(drawFrame).attr("data-anchor-type") == "page") {
							var extraWidth = 0;
							if(floatCssValue != null && floatCssValue == "left") {
								extraWidth += _this.offsetLeftWithoutMargin(afterElement);
								extraWidth -= _this.offsetLeftWithoutMargin(drawFrame);
							} else {
								extraWidth += _this.offsetRightWithoutMargin(afterElement);
								extraWidth -= _this.offsetRightWithoutMargin(drawFrame);
							}
							if(extraWidth > 0) {
								width += extraWidth;
							}
						} else if($(drawFrame).attr("data-anchor-type") == "paragraph") {
							if(floatCssValue != null && floatCssValue == "left") {
								width += _this.offsetLeftWithoutMargin(drawFrame);
								width -= _this.offsetLeftWithoutMargin(afterElement);
							} else {
								width += _this.offsetRightWithoutMargin(drawFrame);
								width -= _this.offsetRightWithoutMargin(afterElement);
							}
							height += _this.offsetTopWithMargin(drawFrame);
							height -= _this.offsetTopWithMargin(afterElement);
						} else {
							console.error($(drawFrame));
						}
			
						var prev = afterElement.prev();
						if(prev && prev != null && prev.length > 0 && prev[0].getAttribute("data-graha-dummy-draw") != null) {
							width -= _this.outerWidthWithMargin(prev);
						}
						if(floatCssValue == null) {
							dummy.setAttribute("style", "width:" + (width) + "px;height:" + (height) + "px;");
						} else {
							dummy.setAttribute("style", "float:" + floatCssValue + ";width:" + (width) + "px;height:" + (height) + "px;");
						}
						if($(drawFrame).attr("data-anchor-type") == "page") {
							$(drawFrame).find("td").each(function() {
								for(var i = 0; i < this.childNodes.length; i++) {
									$(this.childNodes[i]).css("line-height", $(this.childNodes[i]).css("line-height"));
								}
							});
							for(var i = 0; i < drawFrame.childNodes.length; i++) {
								dummy.appendChild(drawFrame.childNodes[i]);
							}
						}
						afterElement.before(dummy);
						drawFrame.setAttribute("data-graha-finalize", "completed")
					}
				}
				resolve(true);
			} catch (error) {
				reject(error);
			}
		}, 10);
	});
};
GrahaOdt2HtmlConverter.prototype.finalizeDrawFrames = function() {
	var _this = this;
	return new Promise(function(resolve, reject) {
		window.setTimeout(function() {
			try {
				var jobs = new Array();
				$(_this.wrapperSelector + " div.graha_draw_frame_as_table").add(_this.wrapperSelector + " div.graha_draw_rect").each(function(index, drawFrame) {
					if(this.getAttribute("data-graha-finalize") != null) {
						return true;
					}
					jobs.push(_this.finalizeDrawFrame(index, drawFrame));
				});
				if(jobs.length > 0) {
					Promise.all(jobs).then(function(values) {
						resolve(values);
					}).catch(function(error) {
						console.error(error);
						reject(error);
					});
				} else {
					resolve(true);
				}
			} catch (error) {
				reject(error);
			}
		}, 10);
	});
};
GrahaOdt2HtmlConverter.prototype.finalizeWrapperHeight = function(htmlElement) {
	var _this = this;
	return new Promise(function(resolve, reject) {
		window.setTimeout(function() {
			try {
				if(htmlElement.lastChild) {
					var outerHeight = _this.offsetBottomWithMargin(htmlElement.lastChild);

					outerHeight += this.parseFloat($(htmlElement).css("padding-bottom"));
					outerHeight -= _this.offsetTopWithoutMargin($(_this.wrapperSelector));
					
					if(outerHeight > _this.outerHeightWithoutMargin(htmlElement)) {
						$(htmlElement).outerHeight(outerHeight);
						_this.overflow = true;
					} else {
						_this.overflow = false;
					}
					if(_this.scale < 1) {
						var scaledOuterHeight = $(htmlElement).outerHeight(true) * _this.scale;
						$(_this.scaleWrapperSelector).outerHeight(scaledOuterHeight);
						$(_this.scaleWrapperSelector).css("overflow", "hidden");
					}
				}
				resolve(true);
			} catch (error) {
				reject(error);
			}
		}, 10);
	});
};
GrahaOdt2HtmlConverter.prototype.finalizeCollapseTableBorder = function(htmlElement) {
	var _this = this;
	return new Promise(function(resolve, reject) {
		window.setTimeout(function() {
			try {
				$(_this.wrapperSelector + " table").each(function() {
					var boderCollapser = new GrahaOdtTableBorderCollapser({ignoreDotted: true});
					boderCollapser.table(this);
				});
				resolve(true);
			} catch (error) {
				console.error(error);
				reject(error);
			}
		}, 10);
	});
};
GrahaOdt2HtmlConverter.prototype.finalizeHtml = function(htmlElement, pdfProperties) {
	var _this = this;
	return new Promise(function(resolve, reject) {
		_this.finalizeTextJustify().then(function() {
			_this.finalizeParagraphFontSize().then(function() {
				_this.finalizeDrawFrameHeight().then(function() {
					_this.finalizeCollapseTableBorder().then(function() {
						_this.finalizeDrawFrames().then(function() {
							_this.finalizeWrapperHeight(htmlElement).then(function() {
								resolve(true);
							}).catch(function(error) {reject(error);});
						}).catch(function(error) {reject(error);});
					}).catch(function(error) {reject(error);});
				}).catch(function(error) {reject(error);});
			}).catch(function(error) {reject(error);});
		}).catch(function(error) {reject(error);});
	});
};
GrahaOdt2HtmlConverter.prototype.convertToPx = function(value, defaultValue) {
	return GrahaOdt2PdfConverterUtility.convertToPx(value, defaultValue);
};
GrahaOdt2HtmlConverter.prototype.getValueStripUnit = function(value, unit) {
	return GrahaOdt2PdfConverterUtility.getValueStripUnit(value, unit);
};
GrahaOdt2HtmlConverter.prototype.getUnit = function(value) {
	return GrahaOdt2PdfConverterUtility.getUnit(value);
};
GrahaOdt2HtmlConverter.prototype.prepareStyle = function() {
	var _this = this;
	return new Promise(function(resolve, reject) {
		window.setTimeout(function() {
			_this.html().then(function(data) {
				resolve(data);
			}).catch(function(error) {
				console.error(error);
				reject(error);
			});
		}, 10);
	});
};
GrahaOdt2HtmlConverter.prototype.prepare = function() {
	$(this.wrapperSelector).remove();
	$(this.scaleWrapperSelector).remove();
	return this.prepareStyle();
};
GrahaOdt2HtmlConverter.prototype.convertFromUrl = function(metaUrl, headerUrl, contentUrl, options) {
	if(options && options != null && options.defaultFontFamily && options.defaultFontFamily != null) {
		this.defaultFontFamily = options.defaultFontFamily;
	}
	if(options && options != null && options.fontFamilyConverter && options.fontFamilyConverter != null) {
		this.fontFamilyConverter = options.fontFamilyConverter;
	}
	if(options && options != null && options.adjustScale && options.adjustScale != null) {
		this.adjustScale = options.adjustScale;
	}
	var _this = this;
	return new Promise(function(resolve, reject) {
		_this.loadFromUrl(metaUrl, headerUrl, contentUrl).then(function(data) {
			_this.prepare().then(function(data) {
				resolve(data);
			}).catch(function(error) {
				console.error(error);
				reject(error);
			});
		}).catch(function(error) {
			console.error(error);
			reject(error);
		});
	});
};
GrahaOdt2HtmlConverter.prototype.convert = function(meta, header, content, options) {
	if(options && options != null && options.defaultFontFamily && options.defaultFontFamily != null) {
		this.defaultFontFamily = options.defaultFontFamily;
	}
	if(options && options != null && options.fontFamilyConverter && options.fontFamilyConverter != null) {
		this.fontFamilyConverter = options.fontFamilyConverter;
	}
	if(options && options != null && options.adjustScale && options.adjustScale != null) {
		this.adjustScale = options.adjustScale;
	}
	this.load(meta, header, content);
	return this.prepare();
};
GrahaOdt2HtmlConverter.prototype.convertFromOdfFile = function(file, options) {
	if(options && options != null && options.defaultFontFamily && options.defaultFontFamily != null) {
		this.defaultFontFamily = options.defaultFontFamily;
	}
	if(options && options != null && options.fontFamilyConverter && options.fontFamilyConverter != null) {
		this.fontFamilyConverter = options.fontFamilyConverter;
	}
	if(options && options != null && options.adjustScale && options.adjustScale != null) {
		this.adjustScale = options.adjustScale;
	}
	var _this = this;
	return new Promise(function(resolve, reject) {
		_this.loadOdfFromFile(file).then(function(data) {
			_this.prepare().then(function(data) {
				resolve(data);
			}).catch(function(error) {
				console.error(error);
				reject(error);
			});
		}).catch(function(error) {
			console.error(error);
			reject(error);
		});
	});
};
GrahaOdt2HtmlConverter.prototype.convertFromOdfBlob = function(blob, options) {
	if(options && options != null && options.defaultFontFamily && options.defaultFontFamily != null) {
		this.defaultFontFamily = options.defaultFontFamily;
	}
	if(options && options != null && options.fontFamilyConverter && options.fontFamilyConverter != null) {
		this.fontFamilyConverter = options.fontFamilyConverter;
	}
	if(options && options != null && options.adjustScale && options.adjustScale != null) {
		this.adjustScale = options.adjustScale;
	}
	var _this = this;
	return new Promise(function(resolve, reject) {
		_this.loadOdfFromBlob(blob).then(function(data) {
			_this.prepare().then(function(data) {
				resolve(data);
			}).catch(function(error) {
				console.error(error);
				reject(error);
			});
		}).catch(function(error) {
			console.error(error);
		});
	});
};
GrahaOdt2HtmlConverter.prototype.convertFromOdfUrl = function(url, options) {
	if(options && options != null && options.defaultFontFamily && options.defaultFontFamily != null) {
		this.defaultFontFamily = options.defaultFontFamily;
	}
	if(options && options != null && options.fontFamilyConverter && options.fontFamilyConverter != null) {
		this.fontFamilyConverter = options.fontFamilyConverter;
	}
	if(options && options != null && options.adjustScale && options.adjustScale != null) {
		this.adjustScale = options.adjustScale;
	}
	var _this = this;
	return new Promise(function(resolve, reject) {
		_this.loadOdfFromUrl(url).then(function(data) {
			_this.prepare().then(function(data) {
				resolve(data);
			}).catch(function(error) {
				console.error(error);
				reject(error);
			});
		}).catch(function(error) {
			console.error(error);
		});
	});
};
