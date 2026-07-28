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
 * GrahaHwpX2HtmlConverter

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.6.0.1
 * @since 0.6
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.6.0.1
 */

function GrahaHwpX2HtmlConverter() {
	this.init();
}
GrahaHwpX2HtmlConverter.prototype.init = function() {
	this.grahaPages = null;
	this.relativePageNumber = 0;
	this.absolutePageNumber = 0;
	
	this.adjustScale = false;
	this.scaleRatio = 1;
	
	this.hwpXBinary = null;

	this.boderCollapser = new GrahaOdtTableBorderCollapser(
		{ignoreDotted: false}
	);
	this.pageHeaders = null;
	this.pageFooters = null;
	this.pageNumbers = null;
	
	this.relativePageNumber = null;

	this.pageOddHeaderLastIndex = null;
	this.pageOddFooterLastIndex = null;
	
	this.pageEvenHeaderLastIndex = null;
	this.pageEvenFooterLastIndex = null;
	
	this.pageNumberLastIndex = null;
	
	this.superscriptRatio = 0.58;
	
	this.htmlConverterWrapper = null;
};
GrahaHwpX2HtmlConverter.prototype.parseInt = function(str, defaultValue) {
	return GrahaPdfConverterUtility.parseInt(str, defaultValue);
};
GrahaHwpX2HtmlConverter.prototype.parseFloat = function(str, defaultValue) {
	return GrahaPdfConverterUtility.parseFloat(str, defaultValue);
};
GrahaHwpX2HtmlConverter.prototype.splitValueAndUnit = function(value) {
	if(value == null) {
		console.error("value is null");
		return null;
	}
	var arr = value.split(" ");
	if(arr != null && Array.isArray(arr) && arr.length > 1) {
		if(arr.length > 2) {
			console.error("arr length > 2");
		}
		return arr;
	} else {
		var unit = GrahaPdfConverterUtility.getUnit(value);
		if(unit != null) {
			var v = GrahaPdfConverterUtility.getValueStripUnit(value, unit);
			if(v != null) {
				return [v, unit];
			}
		}
		console.error("arr is null or is not Array or length <= 1", value);
		return value;
	}
	return value.replace(/\s/g, "");
};
GrahaHwpX2HtmlConverter.prototype.fixVerticalAlign = function(verticalAlign) {
	if(verticalAlign == "CENTER") {
		return "middle";
	}
	return verticalAlign;
};
GrahaHwpX2HtmlConverter.prototype.textNode = function(text) {
	if(text != null) {
		return document.createTextNode(text.replace(/\s/g, '\u2000'));
//		return document.createTextNode(text.replace(/\s/g, '\u2007'));
	} else {
		return null;
	}
};
GrahaHwpX2HtmlConverter.prototype.appendText = function(text, node) {
	if(text != null) {
		if(node.append) {
			node.append(this.textNode(text));
		} else {
			node.appendChild(this.textNode(text));
		}
	}
};
GrahaHwpX2HtmlConverter.prototype.convertToPtForMargin = function(value, unit) {
	if(arguments.length == 1) {
		return this.convertToPt(value) / 2;
	} else {
		return this.convertToPt(value, unit) / 2;
	}
};
GrahaHwpX2HtmlConverter.prototype.convertToHwpUnit = function(value, unit) {
	if(arguments.length == 1) {
//default : pt
		return value * 100;
	} else {
		if(unit == "HWPUNIT") {
			return value;
		} else {
			return GrahaPdfConverterUtility.convertToPtWithUnit(value, unit) * 100;
		}
	}
};
GrahaHwpX2HtmlConverter.prototype.convertColor = function(value) {
	if(value.indexOf("#") == 0) {
		if(value.length == 7) {
			return "#" + value.substring(5, 7) + value.substring(3, 5) + value.substring(1, 3);
		} else if(value.length == 9) {
			return "#" + value.substring(5, 7) + value.substring(3, 5) + value.substring(1, 3) + value.substring(7, 9);
		}
	}
	return value;
};
GrahaHwpX2HtmlConverter.prototype.convertToPt = function(value, unit) {
	if(arguments.length == 1) {
//default : HWPUNIT
		if(value > 2147483647) {
			return ((4294965879 - 2147483647) - 2147483649) / 100;
		} else {
			return value / 100;
		}
	} else {
		if(unit == "HWPUNIT") {
			if(value > 2147483647) {
				return ((4294965879 - 2147483647) - 2147483649) / 100;
			} else {
				return value / 100;
			}
		} else {
			return GrahaPdfConverterUtility.convertToPtWithUnit(value, unit);
		}
	}
};
GrahaHwpX2HtmlConverter.prototype.fontFamily = function(fontFamily) {
	if(this.fontFamilyConverter && this.fontFamilyConverter != null) {
		return this.fontFamilyConverter(fontFamily,this.defaultFontFamily);
	} else {
		return this.defaultFontFamily;
	}
};
GrahaHwpX2HtmlConverter.prototype.parseFromStringForIE = function(str) {
	try {
		var xml = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.6.0");
//		var xml = new ActiveXObject("Msxml2.DOMDocument.6.0");
		
		xml.validateOnParse = false;
		xml.preserveWhiteSpace = true;
		xml.setProperty("AllowDocumentFunction", true);
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
GrahaHwpX2HtmlConverter.prototype.loadXmlFromUrl = function(url) {
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
GrahaHwpX2HtmlConverter.prototype.load = function(content, header, sections) {
	if(window.ActiveXObject || "ActiveXObject" in window) {
		this.contentXml = this.parseFromStringForIE(content);
		this.headerXml = this.parseFromStringForIE(header);
		this.sectionXmls = new Array();
		if(Array.isArray(sections)) {
			for(var i = 0; i < sections.length; i++) {
				this.sectionXmls.push(this.parseFromStringForIE(sections[i]));
			}
		} else {
			this.sectionXmls.push(this.parseFromStringForIE(sections));
		}
	} else {
		var parser = new DOMParser();
		this.contentXml = parser.parseFromString(content, "text/xml");
		this.headerXml = parser.parseFromString(header, "text/xml");
		this.sectionXmls = new Array();
		if(Array.isArray(sections)) {
			for(var i = 0; i < sections.length; i++) {
				this.sectionXmls.push(parser.parseFromString(sections[i], "text/xml"));
			}
		} else {
			this.sectionXmls.push(parser.parseFromString(sections, "text/xml"));
		}
	}
};
GrahaHwpX2HtmlConverter.prototype.loadHwpXFromFile = function(file) {
	return this.loadHwpXFromBlob(file);
};
GrahaHwpX2HtmlConverter.prototype.loadHwpXFromBlob = function(blob) {
	this.hwpXBinary = blob;
	var _this = this;
	return new Promise(function(resolve, reject) {
		_this.zip = new JSZip();
		_this.zip.loadAsync(blob).then(function (zip) {
			var tasks = new Array();
			tasks.push(zip.file("Contents/content.hpf").async("string"));
			tasks.push(zip.file("Contents/header.xml").async("string"));
			zip.forEach(function (relativePath, file) {
				if(file.dir) {
				} else {
					if(relativePath.indexOf("Contents/section") == 0) {
						tasks.push(file.async("string"));
					}
				}
			});
			Promise.all(tasks).then(function(values) {
				var content = values[0];
				var header = values[1];
				var sections = new Array();
				for(var i = 2; i < values.length; i++) {
					sections.push(values[i]);
				}
				_this.load(content, header, sections);
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
GrahaHwpX2HtmlConverter.prototype.loadHwpXFromUrl = function(url) {
	var _this = this;
	return new Promise(function(resolve, reject) {
		JSZipUtils.getBinaryContent(url, function(err, zipData) {
			if(err) {
				console.error(err);
				reject(err);
			} else {
				_this.loadHwpXFromBlob(zipData).then(function(data) {
					resolve(data);
				}).catch(function(error) {
					console.error(error);
					reject(error);
				});
			}
		});
	});
};
GrahaHwpX2HtmlConverter.prototype.loadFromUrl = function(contentUrl, headerUrl, sectionsUrl) {
	var _this = this;
	var tasks = new Array();
	tasks.push(this.loadXmlFromUrl(contentUrl));
	tasks.push(this.loadXmlFromUrl(headerUrl));
	if(Array.isArray(sectionsUrl)) {
		for(var i = 0; i < sectionsUrl.length; i++) {
			tasks.push(this.loadXmlFromUrl(sectionsUrl[i]));
		}
	} else {
		tasks.push(this.loadXmlFromUrl(sectionsUrl));
	}
	return new Promise(function(resolve, reject) {
		Promise.all(tasks).then(function(values) {
			_this.contentXml = values[0];
			_this.headerXml = values[1];
			_this.sectionXmls = new Array();
			for(var i = 2; i < values.length; i++) {
				_this.sectionXmls.push(values[i]);
			}
			resolve(values);
		}).catch(function(error) {
			console.error(error);
			reject(error);
		});
	});
};
GrahaHwpX2HtmlConverter.prototype.convertFromUrl = function(url, options) {
	return this.convertFromHwpXUrl(url, options);
};
GrahaHwpX2HtmlConverter.prototype.convertFromHwpXUrl = function(url, options) {
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
		_this.loadHwpXFromUrl(url).then(function(data) {
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
GrahaHwpX2HtmlConverter.prototype.convertFromFile = function(file, options) {
	return this.convertFromHwpXFile(file, options);
};
GrahaHwpX2HtmlConverter.prototype.convertFromHwpXFile = function(file, options) {
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
		_this.loadHwpXFromFile(file).then(function(data) {
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
GrahaHwpX2HtmlConverter.prototype.convertFromBlob = function(blob, options) {
	return this.convertFromHwpXBlob(blob, options);
};
GrahaHwpX2HtmlConverter.prototype.convertFromHwpXBlob = function(blob, options) {
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
		_this.loadHwpXFromBlob(blob).then(function(data) {
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
GrahaHwpX2HtmlConverter.prototype.findByTagName = function(node, nodeName) {
	return GrahaPdfConverterUtility.findByTagName(node, nodeName);
};
GrahaHwpX2HtmlConverter.prototype.getMeta = function() {
	return this.findByTagName(this.contentXml, "opf:metadata");
};
GrahaHwpX2HtmlConverter.prototype.getNodeValue = function(node) {
	return GrahaPdfConverterUtility.getNodeValue(node);
};
GrahaHwpX2HtmlConverter.prototype.getPdfProperties = function() {
	var node = this.getMeta();
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var pdfProperties = {};
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "opf:title") {
					var title = this.getNodeValue(node.childNodes[i]);
					if(title != null) {
						pdfProperties.title = title;
					}
				} else if(node.childNodes[i].nodeName == "opf:language") {
					pdfProperties.language = this.getNodeValue(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "opf:meta") {
					if(node.childNodes[i].getAttribute("name") == "CreatedDate") {
					} else if(node.childNodes[i].getAttribute("name") == "ModifiedDate") {
//Nothing
					} else if(node.childNodes[i].getAttribute("name") == "creator") {
						var nodeValue = this.getNodeValue(node.childNodes[i]);
						if(nodeValue && nodeValue != null) {
							pdfProperties.author = nodeValue;
						}
					} else if(node.childNodes[i].getAttribute("name") == "subject") {
						var nodeValue = this.getNodeValue(node.childNodes[i]);
						if(nodeValue && nodeValue != null) {
							pdfProperties.subject = nodeValue;
						}
					} else if(node.childNodes[i].getAttribute("name") == "description") {
						var nodeValue = this.getNodeValue(node.childNodes[i]);
						if(nodeValue && nodeValue != null) {
							pdfProperties.description = nodeValue;
						}
					} else if(node.childNodes[i].getAttribute("name") == "keyword") {
						var nodeValue = this.getNodeValue(node.childNodes[i]);
						if(nodeValue && nodeValue != null) {
							pdfProperties.keywords = nodeValue;
						}
					} else {
						console.error(node.childNodes[i]);
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
GrahaHwpX2HtmlConverter.prototype.font = function(node) {
	var font = {};
	var attributes = node.attributes;
	for(var x = 0; x < attributes.length; x++) {
		if(attributes.item(x).name == "id") {
			font.id = attributes.item(x).value;
		} else if(attributes.item(x).name == "face") {
			font.face = attributes.item(x).value;
		} else if(attributes.item(x).name == "type") {
			font.type = attributes.item(x).value;
		} else if(attributes.item(x).name == "isEmbedded") {
			font.isEmbedded = attributes.item(x).value;
		} else {
			console.error(attributes.item(x));
		}
	}
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hh:typeInfo") {
					font.typeInfo = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "familyType") {
							font.typeInfo.familyType = attributes.item(x).value;
						} else if(attributes.item(x).name == "weight") {
							font.typeInfo.weight = attributes.item(x).value;
						} else if(attributes.item(x).name == "proportion") {
							font.typeInfo.proportion = attributes.item(x).value;
						} else if(attributes.item(x).name == "contrast") {
							font.typeInfo.contrast = attributes.item(x).value;
						} else if(attributes.item(x).name == "strokeVariation") {
							font.typeInfo.strokeVariation = attributes.item(x).value;
						} else if(attributes.item(x).name == "armStyle") {
							font.typeInfo.armStyle = attributes.item(x).value;
						} else if(attributes.item(x).name == "letterform") {
							font.typeInfo.letterform = attributes.item(x).value;
						} else if(attributes.item(x).name == "midline") {
							font.typeInfo.midline = attributes.item(x).value;
						} else if(attributes.item(x).name == "xHeight") {
							font.typeInfo.xHeight = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hh:substFont") {
					font.substFont = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "face") {
							font.substFont.face = attributes.item(x).value;
						} else if(attributes.item(x).name == "type") {
							font.substFont.type = attributes.item(x).value;
						} else if(attributes.item(x).name == "isEmbedded") {
							font.substFont.isEmbedded = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
	}
	return font;
};
GrahaHwpX2HtmlConverter.prototype.fontface = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var fontface = {};
		fontface.items = new Array();
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "fontCnt") {
				fontface.fontCnt = attributes.item(x).value;
			} else if(attributes.item(x).name == "lang") {
				fontface.lang = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hh:font") {
					fontface.items.push(this.font(node.childNodes[i]));
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return fontface;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.fontfaces = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var fontfaces = {};
		fontfaces.items = new Array();
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "itemCnt") {
				fontfaces.itemCnt = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hh:fontface") {
					fontfaces.items.push(this.fontface(node.childNodes[i]));
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return fontfaces;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.fillBrush = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var fillBrush = {};
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			console.error(attributes.item(x));
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hc:winBrush") {
					fillBrush.winBrush = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "faceColor") {
							fillBrush.winBrush.faceColor = attributes.item(x).value;
						} else if(attributes.item(x).name == "hatchColor") {
							fillBrush.winBrush.hatchColor = attributes.item(x).value;
						} else if(attributes.item(x).name == "alpha") {
							fillBrush.winBrush.alpha = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return fillBrush;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.fixBorderStyle = function(borderStyle) {
	if(borderStyle == "DOT") {
		return "dotted";
	}
	if(borderStyle == "DASH") {
		return "dashed";
	}
	return borderStyle;
};
GrahaHwpX2HtmlConverter.prototype.borderFill = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var borderFill = {};
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "id") {
				borderFill.id = attributes.item(x).value;
			} else if(attributes.item(x).name == "threeD") {
				borderFill.threeD = attributes.item(x).value;
			} else if(attributes.item(x).name == "shadow") {
				borderFill.shadow = attributes.item(x).value;
			} else if(attributes.item(x).name == "centerLine") {
				borderFill.centerLine = attributes.item(x).value;
			} else if(attributes.item(x).name == "breakCellSeparateLine") {
				borderFill.breakCellSeparateLine = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hh:slash") {
					borderFill.slash = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "isCrooked") {
							borderFill.slash.isCrooked = attributes.item(x).value;
						} else if(attributes.item(x).name == "isCounter") {
							borderFill.slash.isCounter = attributes.item(x).value;
						} else if(attributes.item(x).name == "Crooked") {
							borderFill.slash.Crooked = attributes.item(x).value;
						} else if(attributes.item(x).name == "type") {
							borderFill.slash.type = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hh:backSlash") {
					borderFill.backSlash = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "isCrooked") {
							borderFill.backSlash.isCrooked = attributes.item(x).value;
						} else if(attributes.item(x).name == "isCounter") {
							borderFill.backSlash.isCounter = attributes.item(x).value;
						} else if(attributes.item(x).name == "Crooked") {
							borderFill.backSlash.Crooked = attributes.item(x).value;
						} else if(attributes.item(x).name == "type") {
							borderFill.backSlash.type = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hh:leftBorder") {
					borderFill.leftBorder = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "type") {
							borderFill.leftBorder.type = this.fixBorderStyle(attributes.item(x).value);
						} else if(attributes.item(x).name == "width") {
							borderFill.leftBorder.width = attributes.item(x).value;
						} else if(attributes.item(x).name == "color") {
							borderFill.leftBorder.color = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hh:rightBorder") {
					borderFill.rightBorder = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "type") {
							borderFill.rightBorder.type = this.fixBorderStyle(attributes.item(x).value);
						} else if(attributes.item(x).name == "width") {
							borderFill.rightBorder.width = attributes.item(x).value;
						} else if(attributes.item(x).name == "color") {
							borderFill.rightBorder.color = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hh:topBorder") {
					borderFill.topBorder = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "type") {
							borderFill.topBorder.type = this.fixBorderStyle(attributes.item(x).value);
						} else if(attributes.item(x).name == "width") {
							borderFill.topBorder.width = attributes.item(x).value;
						} else if(attributes.item(x).name == "color") {
							borderFill.topBorder.color = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hh:bottomBorder") {
					borderFill.bottomBorder = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "type") {
							borderFill.bottomBorder.type = this.fixBorderStyle(attributes.item(x).value);
						} else if(attributes.item(x).name == "width") {
							borderFill.bottomBorder.width = attributes.item(x).value;
						} else if(attributes.item(x).name == "color") {
							borderFill.bottomBorder.color = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hh:diagonal") {
					borderFill.diagonal = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "type") {
							borderFill.diagonal.type = attributes.item(x).value;
						} else if(attributes.item(x).name == "width") {
							borderFill.diagonal.width = attributes.item(x).value;
						} else if(attributes.item(x).name == "color") {
							borderFill.diagonal.color = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hc:fillBrush") {
					borderFill.fillBrush = this.fillBrush(node.childNodes[i]);
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return borderFill;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.borderFills = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var borderFills = {};
		borderFills.items = new Array();
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "itemCnt") {
				borderFills.itemCnt = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hh:borderFill") {
					borderFills.items.push(this.borderFill(node.childNodes[i]));
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return borderFills;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.fontRef = function(node) {
	if(node != null) {
		var attributes = node.attributes;
		if(attributes.length > 0) {
			var fontRef = {};
			for(var x = 0; x < attributes.length; x++) {
				if(attributes.item(x).name == "hangul") {
					fontRef.hangul = attributes.item(x).value;
				} else if(attributes.item(x).name == "latin") {
					fontRef.latin = attributes.item(x).value;
				} else if(attributes.item(x).name == "hanja") {
					fontRef.hanja = attributes.item(x).value;
				} else if(attributes.item(x).name == "japanese") {
					fontRef.japanese = attributes.item(x).value;
				} else if(attributes.item(x).name == "other") {
					fontRef.other = attributes.item(x).value;
				} else if(attributes.item(x).name == "symbol") {
					fontRef.symbol = attributes.item(x).value;
				} else if(attributes.item(x).name == "user") {
					fontRef.user = attributes.item(x).value;
				} else {
					console.error(attributes.item(x));
				}
			}
			return fontRef;
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.charPr = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var charPr = {};
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "id") {
				charPr.id = attributes.item(x).value;
			} else if(attributes.item(x).name == "height") {
				charPr.height = attributes.item(x).value;
			} else if(attributes.item(x).name == "textColor") {
				charPr.textColor = attributes.item(x).value;
			} else if(attributes.item(x).name == "shadeColor") {
				charPr.shadeColor = attributes.item(x).value;
			} else if(attributes.item(x).name == "useFontSpace") {
				charPr.useFontSpace = attributes.item(x).value;
			} else if(attributes.item(x).name == "useKerning") {
				charPr.useKerning = attributes.item(x).value;
			} else if(attributes.item(x).name == "symMark") {
				charPr.symMark = attributes.item(x).value;
			} else if(attributes.item(x).name == "borderFillIDRef") {
				charPr.borderFillIDRef = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hh:fontRef") {
					charPr.fontRef = this.fontRef(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hh:ratio") {
					charPr.ratio = this.fontRef(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hh:spacing") {
					charPr.spacing = this.fontRef(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hh:relSz") {
					charPr.relSz = this.fontRef(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hh:offset") {
					charPr.offset = this.fontRef(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hh:bold") {
					charPr.bold = true;
				} else if(node.childNodes[i].nodeName == "hh:supscript") {
					charPr.superscript = true;
				} else if(node.childNodes[i].nodeName == "hh:underline") {
					charPr.underline = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "type") {
							charPr.underline.type = attributes.item(x).value;
						} else if(attributes.item(x).name == "shape") {
							charPr.underline.shape = attributes.item(x).value;
						} else if(attributes.item(x).name == "color") {
							charPr.underline.color = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return charPr;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.charProperties = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var charProperties = {};
		charProperties.items = new Array();
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "itemCnt") {
				charProperties.itemCnt = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hh:charPr") {
					charProperties.items.push(this.charPr(node.childNodes[i]));
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return charProperties;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.tabPr = function(node) {
	if(node != null) {
		var tabPr = {};
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "id") {
				tabPr.id = attributes.item(x).value;
			} else if(attributes.item(x).name == "autoTabLeft") {
				tabPr.autoTabLeft = attributes.item(x).value;
			} else if(attributes.item(x).name == "autoTabRight") {
				tabPr.autoTabRight = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		return tabPr;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.tabProperties = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var tabProperties = {};
		tabProperties.items = new Array();
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "itemCnt") {
				tabProperties.itemCnt = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hh:tabPr") {
					tabProperties.items.push(this.tabPr(node.childNodes[i]));
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return tabProperties;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.paraHead = function(node) {
	if(node != null) {
		var paraHead = {};
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "start") {
				paraHead.start = attributes.item(x).value;
			} else if(attributes.item(x).name == "level") {
				paraHead.level = attributes.item(x).value;
			} else if(attributes.item(x).name == "align") {
				paraHead.align = attributes.item(x).value;
			} else if(attributes.item(x).name == "useInstWidth") {
				paraHead.useInstWidth = attributes.item(x).value;
			} else if(attributes.item(x).name == "autoIndent") {
				paraHead.autoIndent = attributes.item(x).value;
			} else if(attributes.item(x).name == "widthAdjust") {
				paraHead.widthAdjust = attributes.item(x).value;
			} else if(attributes.item(x).name == "textOffsetType") {
				paraHead.textOffsetType = attributes.item(x).value;
			} else if(attributes.item(x).name == "textOffset") {
				paraHead.textOffset = attributes.item(x).value;
			} else if(attributes.item(x).name == "numFormat") {
				paraHead.numFormat = attributes.item(x).value;
			} else if(attributes.item(x).name == "charPrIDRef") {
				paraHead.charPrIDRef = attributes.item(x).value;
			} else if(attributes.item(x).name == "checkable") {
				paraHead.checkable = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.TEXT_NODE == node.childNodes[i].nodeType) {
				paraHead.body = node.childNodes[i].nodeValue;
			} else if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				console.error(node.childNodes[i]);
			}
		}
		return paraHead;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.numbering = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var numbering = {};
		numbering.items = new Array();
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "id") {
				numbering.id = attributes.item(x).value;
			} else if(attributes.item(x).name == "start") {
				numbering.start = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hh:paraHead") {
					numbering.items.push(this.paraHead(node.childNodes[i]));
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return numbering;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.numberings = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var numberings = {};
		numberings.items = new Array();
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "itemCnt") {
				numberings.itemCnt = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hh:numbering") {
					numberings.items.push(this.numbering(node.childNodes[i]));
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return numberings;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.margin = function(node) {
	if(node != null) {
		var attributes = node.attributes;
		if(attributes.length > 0) {
			var margin = {};
			for(var x = 0; x < attributes.length; x++) {
				if(attributes.item(x).name == "value") {
					margin.value = attributes.item(x).value;
				} else if(attributes.item(x).name == "unit") {
					margin.unit = attributes.item(x).value;
				} else {
					console.error(attributes.item(x));
				}
			}
			return margin;
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.margins = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var margins = {};
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hc:intent") {
					margins.intent = this.margin(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hc:left") {
					margins.left = this.margin(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hc:right") {
					margins.right = this.margin(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hc:prev") {
					margins.prev = this.margin(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hc:next") {
					margins.next = this.margin(node.childNodes[i]);
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return margins;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.getDefaultSwitch = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hp:default") {
					return node.childNodes[i];
				}
			}
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.paraPr = function(node, paraPr) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		if(paraPr && paraPr != null) {
		} else {
			paraPr = {};
		}
		if(node.nodeName == "hh:paraPr") {
			var attributes = node.attributes;
			for(var x = 0; x < attributes.length; x++) {
				if(attributes.item(x).name == "id") {
					paraPr.id = attributes.item(x).value;
				} else if(attributes.item(x).name == "tabPrIDRef") {
					paraPr.tabPrIDRef = attributes.item(x).value;
				} else if(attributes.item(x).name == "condense") {
					paraPr.condense = attributes.item(x).value;
				} else if(attributes.item(x).name == "fontLineHeight") {
					paraPr.fontLineHeight = attributes.item(x).value;
				} else if(attributes.item(x).name == "snapToGrid") {
					paraPr.snapToGrid = attributes.item(x).value;
				} else if(attributes.item(x).name == "suppressLineNumbers") {
					paraPr.suppressLineNumbers = attributes.item(x).value;
				} else if(attributes.item(x).name == "checked") {
					paraPr.checked = attributes.item(x).value;
				} else {
					console.error(attributes.item(x));
				}
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hh:align") {
					paraPr.align = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "horizontal") {
							paraPr.align.horizontal = attributes.item(x).value;
						} else if(attributes.item(x).name == "vertical") {
							paraPr.align.vertical = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hh:heading") {
					paraPr.heading = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "type") {
							paraPr.heading.type = attributes.item(x).value;
						} else if(attributes.item(x).name == "idRef") {
							paraPr.heading.idRef = attributes.item(x).value;
						} else if(attributes.item(x).name == "level") {
							paraPr.heading.level = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hh:breakSetting") {
					paraPr.breakSetting = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "breakLatinWord") {
							paraPr.breakSetting.breakLatinWord = attributes.item(x).value;
						} else if(attributes.item(x).name == "breakNonLatinWord") {
							paraPr.breakSetting.breakNonLatinWord = attributes.item(x).value;
						} else if(attributes.item(x).name == "widowOrphan") {
							paraPr.breakSetting.widowOrphan = attributes.item(x).value;
						} else if(attributes.item(x).name == "keepWithNext") {
							paraPr.breakSetting.keepWithNext = attributes.item(x).value;
						} else if(attributes.item(x).name == "keepLines") {
							paraPr.breakSetting.keepLines = attributes.item(x).value;
						} else if(attributes.item(x).name == "pageBreakBefore") {
							paraPr.breakSetting.pageBreakBefore = attributes.item(x).value;
						} else if(attributes.item(x).name == "lineWrap") {
							paraPr.breakSetting.lineWrap = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hh:autoSpacing") {
					paraPr.autoSpacing = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "eAsianEng") {
							paraPr.autoSpacing.eAsianEng = attributes.item(x).value;
						} else if(attributes.item(x).name == "eAsianNum") {
							paraPr.autoSpacing.eAsianNum = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hh:margin") {
					paraPr.margin = this.margins(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hh:lineSpacing") {
					paraPr.lineSpacing = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "type") {
							paraPr.lineSpacing.type = attributes.item(x).value;
						} else if(attributes.item(x).name == "value") {
							paraPr.lineSpacing.value = attributes.item(x).value;
						} else if(attributes.item(x).name == "unit") {
							paraPr.lineSpacing.unit = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hh:border") {
					paraPr.border = {};
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "borderFillIDRef") {
							paraPr.border.borderFillIDRef = attributes.item(x).value;
						} else if(attributes.item(x).name == "offsetLeft") {
							paraPr.border.offsetLeft = attributes.item(x).value;
						} else if(attributes.item(x).name == "offsetRight") {
							paraPr.border.offsetRight = attributes.item(x).value;
						} else if(attributes.item(x).name == "offsetTop") {
							paraPr.border.offsetTop = attributes.item(x).value;
						} else if(attributes.item(x).name == "offsetBottom") {
							paraPr.border.offsetBottom = attributes.item(x).value;
						} else if(attributes.item(x).name == "connect") {
							paraPr.border.connect = attributes.item(x).value;
						} else if(attributes.item(x).name == "ignoreMargin") {
							paraPr.border.ignoreMargin = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:switch") {
					var defaultSwitch = this.getDefaultSwitch(node.childNodes[i]);
					if(defaultSwitch != null) {
						this.paraPr(defaultSwitch, paraPr);
					}
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return paraPr;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.paraProperties = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var paraProperties = {};
		paraProperties.items = new Array();
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "itemCnt") {
				paraProperties.itemCnt = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hh:paraPr") {
					paraProperties.items.push(this.paraPr(node.childNodes[i]));
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return paraProperties;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.style = function(node) {
	if(node != null) {
		var style = {};
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "id") {
				style.id = attributes.item(x).value;
			} else if(attributes.item(x).name == "type") {
				style.type = attributes.item(x).value;
			} else if(attributes.item(x).name == "name") {
				style.name = attributes.item(x).value;
			} else if(attributes.item(x).name == "engName") {
				style.engName = attributes.item(x).value;
			} else if(attributes.item(x).name == "paraPrIDRef") {
				style.paraPrIDRef = attributes.item(x).value;
			} else if(attributes.item(x).name == "charPrIDRef") {
				style.charPrIDRef = attributes.item(x).value;
			} else if(attributes.item(x).name == "nextStyleIDRef") {
				style.nextStyleIDRef = attributes.item(x).value;
			} else if(attributes.item(x).name == "langID") {
				style.langID = attributes.item(x).value;
			} else if(attributes.item(x).name == "lockForm") {
				style.lockForm = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		return style;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.styles = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var styles = {};
		styles.items = new Array();
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "itemCnt") {
				styles.itemCnt = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hh:style") {
					styles.items.push(this.style(node.childNodes[i]));
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		return styles;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.getRefList = function() {
	return this.findByTagName(this.headerXml, "hh:refList");
};
GrahaHwpX2HtmlConverter.prototype.getHeader = function() {
	var node = this.getRefList();
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var header = {};
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hh:fontfaces") {
					header.fontfaces = this.fontfaces(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hh:borderFills") {
					header.borderFills = this.borderFills(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hh:charProperties") {
					header.charProperties = this.charProperties(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hh:tabProperties") {
					header.tabProperties = this.tabProperties(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hh:numberings") {
					header.numberings = this.numberings(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hh:paraProperties") {
					header.paraProperties = this.paraProperties(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hh:styles") {
					header.styles = this.styles(node.childNodes[i]);
				} else {
					console.error(node.childNodes[i]);
				}
			} else {
				console.error(node.childNodes[i]);
			}
		}
		return header;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.getFontface = function(id) {
	if(this.header && this.header != null) {
		if(this.header.fontfaces && this.header.fontfaces != null) {
			if(this.header.fontfaces.items && this.header.fontfaces.items != null && this.header.fontfaces.items.length > 0) {
				for(var i = 0; i < this.header.fontfaces.items.length; i++) {
					if(this.header.fontfaces.items[i].items && this.header.fontfaces.items[i].items != null) {
						for(var x = 0; x < this.header.fontfaces.items[i].items.length; x++) {
							if(id == this.header.fontfaces.items[i].items[x].id) {
								return this.header.fontfaces.items[i].items[x];
							}
						}
					}
				}
			}
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.getBorderFill = function(id) {
	if(this.header && this.header != null) {
		if(this.header.borderFills && this.header.borderFills != null) {
			if(this.header.borderFills.items && this.header.borderFills.items != null && this.header.borderFills.items.length > 0) {
				for(var i = 0; i < this.header.borderFills.items.length; i++) {
					if(id == this.header.borderFills.items[i].id) {
						return this.header.borderFills.items[i];
					}
				}
			}
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.getCharProperty = function(id) {
	if(this.header && this.header != null) {
		if(this.header.charProperties && this.header.charProperties != null) {
			if(this.header.charProperties.items && this.header.charProperties.items != null && this.header.charProperties.items.length > 0) {
				for(var i = 0; i < this.header.charProperties.items.length; i++) {
					if(id == this.header.charProperties.items[i].id) {
						return this.header.charProperties.items[i];
					}
				}
			}
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.getTabProperty = function(id) {
	if(this.header && this.header != null) {
		if(this.header.tabProperties && this.header.tabProperties != null) {
			if(this.header.tabProperties.items && this.header.tabProperties.items != null && this.header.tabProperties.items.length > 0) {
				for(var i = 0; i < this.header.tabProperties.items.length; i++) {
					if(id == this.header.tabProperties.items[i].id) {
						return this.header.tabProperties.items[i];
					}
				}
			}
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype._getNumberingItemIndex = function(numbering, level) {
	if(numbering && numbering != null) {
		if(numbering.items && numbering.items != null && numbering.items.length > 0) {
			for(var i = 0; i < numbering.items.length; i++) {
				if(level == numbering.items[i].level) {
					return i;
				}
			}
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype._getNumberingItem = function(numbering, level) {
	var itemIndex = this._getNumberingItemIndex(numbering, level);
	if(itemIndex != null) {
		return numbering.items[itemIndex];
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.convertNumberingLevel = function(level) {
	return (this.parseInt(level) + 1).toString();
};
GrahaHwpX2HtmlConverter.prototype._getNumberingParaHead = function(id, level) {
	var numbering = this.getNumbering(id);
	if(numbering != null) {
		return this._getNumberingItem(numbering, this.convertNumberingLevel(level));
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.computeOutlineWidth = function(id, level, fontHeight) {
	var numbering = this.getNumbering(id);
	if(numbering != null) {
		var convertedLevel = this.convertNumberingLevel(level);
		var itemIndex = this._getNumberingItemIndex(numbering, convertedLevel);
		if(itemIndex != null) {
			var paraHead = numbering.items[itemIndex];
			if(paraHead && paraHead != null) {
				if(paraHead.body && paraHead.body != null) {
					if(paraHead.body == "^" + convertedLevel + ".") {
//font-family 에 따라 width 가 달라진다. 임시로 나눔명조로
						return ((fontHeight * 54/95) + (fontHeight * 27/95) + (fontHeight * 50/95));
//						return ((fontHeight * 0.5) + (fontHeight * 0.25) + (fontHeight * 0.5));
					} else if(paraHead.body == "^" + convertedLevel + ")") {
//font-family 에 따라 width 가 달라진다. 임시로 나눔명조로
						return ((fontHeight * 54/95) + (fontHeight * 37/95) + (fontHeight * 50/95));
//						return ((fontHeight * 0.5) + (fontHeight * 0.33) + (fontHeight * 0.5));
					} else if(paraHead.body.indexOf("^") >= 0) {
						var prefix = paraHead.body.substring(0, paraHead.body.indexOf("^"));
						var suffix= paraHead.body.substring(paraHead.body.indexOf("^") + 2);
						return ((fontHeight * 54/95) + (fontHeight * prefix.length) + (fontHeight * suffix.length));
					} else {
						console.error(paraHead.body, convertedLevel);
					}
				}
			}
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.getOutline = function(id, level) {
	var numbering = this.getNumbering(id);
	if(numbering != null) {
		var convertedLevel = this.convertNumberingLevel(level);
		var itemIndex = this._getNumberingItemIndex(numbering, convertedLevel);
		if(itemIndex != null) {
			var paraHead = numbering.items[itemIndex];
			if(paraHead && paraHead != null) {
				if(paraHead.body && paraHead.body != null) {
					if(paraHead._current && paraHead._current != null) {
					} else {
						paraHead._current = this.parseInt(paraHead.start);
					}
					var outline = null;
					if(paraHead.body == "^" + convertedLevel + ".") {
						outline = paraHead._current + ". ";
					} else if(paraHead.body == "^" + convertedLevel + ")") {
						outline = paraHead._current + ") ";
					} else if(paraHead.body.indexOf("^") >= 0) {
						outline = paraHead.body.substring(0, paraHead.body.indexOf("^"));
						outline += paraHead._current;
						outline += paraHead.body.substring(paraHead.body.indexOf("^") + 2);
					} else {
						console.error(paraHead.body, convertedLevel);
					}
					for(var i = (itemIndex + 1); i < numbering.items.length; i++) {
						if(numbering.items[i]._current && numbering.items[i]._current != null) {
							numbering.items[i]._current = this.parseInt(numbering.items[i].start);
						}
					}
					paraHead._current++;
					return outline;
				}
			}
		} else {
			console.error(numbering);
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype._getNumbering = function(id) {
	if(this.header && this.header != null) {
		if(this.header.numberings && this.header.numberings != null) {
			if(this.header.numberings.items && this.header.numberings.items != null && this.header.numberings.items.length > 0) {
				for(var i = 0; i < this.header.numberings.items.length; i++) {
					if(id == this.header.numberings.items[i].id) {
						return this.header.numberings.items[i];
					}
				}
			}
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.convertNumberingId = function(id) {
	if(id == "0") {
		return "1";
	} else {
		return id;
	}
};
GrahaHwpX2HtmlConverter.prototype.getNumbering = function(id) {
	return this._getNumbering(this.convertNumberingId(id));
};
GrahaHwpX2HtmlConverter.prototype.getParaProperty = function(id) {
	if(this.header && this.header != null) {
		if(this.header.paraProperties && this.header.paraProperties != null) {
			if(this.header.paraProperties.items && this.header.paraProperties.items != null && this.header.paraProperties.items.length > 0) {
				for(var i = 0; i < this.header.paraProperties.items.length; i++) {
					if(id == this.header.paraProperties.items[i].id) {
						return this.header.paraProperties.items[i];
					}
				}
			}
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.getStyle = function(id) {
	if(this.header && this.header != null) {
		if(this.header.styles && this.header.styles != null) {
			if(this.header.styles.items && this.header.styles.items != null && this.header.styles.items.length > 0) {
				for(var i = 0; i < this.header.styles.items.length; i++) {
					if(id == this.header.styles.items[i].id) {
						return this.header.styles.items[i];
					}
				}
			}
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.findStyle = function(engName) {
	if(this.header && this.header != null) {
		if(this.header.styles && this.header.styles != null) {
			if(this.header.styles.items && this.header.styles.items != null && this.header.styles.items.length > 0) {
				for(var i = 0; i < this.header.styles.items.length; i++) {
					if(engName == this.header.styles.items[i].engName) {
						return this.header.styles.items[i];
					}
				}
			}
		}
	}
	return null;
};
/*
GrahaHwpX2HtmlConverter.prototype.getStylePropertiesFromFontface = function(fontface) {
	if(fontface != null) {
		
	}
	return null;
};
*/
GrahaHwpX2HtmlConverter.prototype.getStylePropertiesFromBorderFill = function(borderFill) {
	if(borderFill != null) {
		var properties = new GrahaCSSProperties();
		properties.push("border-left-style", "none");
		properties.push("border-right-style", "none");
		properties.push("border-top-style", "none");
		properties.push("border-bottom-style", "none");
		if(borderFill.leftBorder && borderFill.leftBorder != null) {
			if(borderFill.leftBorder.type && borderFill.leftBorder.type != null) {
				if(borderFill.leftBorder.type != "NONE") {
					properties.replace("border-left-style", borderFill.leftBorder.type);
					properties.push("border-left-color", this.convertColor(borderFill.leftBorder.color));
					properties.push("border-left-width", this.splitValueAndUnit(borderFill.leftBorder.width));
				}
			}
		}
		if(borderFill.rightBorder && borderFill.rightBorder != null) {
			if(borderFill.rightBorder.type && borderFill.rightBorder.type != null) {
				if(borderFill.rightBorder.type != "NONE") {
					properties.replace("border-right-style", borderFill.rightBorder.type);
					properties.push("border-right-color", this.convertColor(borderFill.rightBorder.color));
					properties.push("border-right-width", this.splitValueAndUnit(borderFill.rightBorder.width));
				}
			}
		}
		if(borderFill.topBorder && borderFill.topBorder != null) {
			if(borderFill.topBorder.type && borderFill.topBorder.type != null) {
				if(borderFill.topBorder.type != "NONE") {
					properties.replace("border-top-style", borderFill.topBorder.type);
					properties.push("border-top-color", this.convertColor(borderFill.topBorder.color));
					properties.push("border-top-width", this.splitValueAndUnit(borderFill.topBorder.width));
				}
			}
		}
		if(borderFill.bottomBorder && borderFill.bottomBorder != null) {
			if(borderFill.bottomBorder.type && borderFill.bottomBorder.type != null) {
				if(borderFill.bottomBorder.type != "NONE") {
					properties.replace("border-bottom-style", borderFill.bottomBorder.type);
					properties.push("border-bottom-color", this.convertColor(borderFill.bottomBorder.color));
					properties.push("border-bottom-width", this.splitValueAndUnit(borderFill.bottomBorder.width));
				}
			}
		}
		return properties;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.getStylePropertiesFromCharProperty = function(charProperty) {
	if(charProperty != null) {
		var properties = new GrahaCSSProperties();
		var fontSize = 0;
		if(charProperty.height && charProperty.height != null) {
			fontSize = this.convertToPt(charProperty.height);
			properties.push("font-size", fontSize, "pt");
		}
		if(charProperty.textColor && charProperty.textColor != null) {
			properties.push("color", this.convertColor(charProperty.textColor));
		}
		if(charProperty.borderFillIDRef && charProperty.borderFillIDRef != null) {
			var props = this.getStylePropertiesFromBorderFill(charProperty.borderFillIDRef);
			if(props != null) {
				properties.merge(props);
			}
		}
		if(charProperty.fontRef && charProperty.fontRef != null) {
			if(charProperty.fontRef.hangul && charProperty.fontRef.hangul != null) {
				var fontface = this.getFontface(charProperty.fontRef.hangul);
				if(fontface != null) {
					if(fontface.face && fontface.face != null) {
						properties.push("font-family", this.fontFamily(fontface.face));
					}
				}
			}
		}
		if(charProperty.relSz && charProperty.relSz != null) {
			if(charProperty.relSz.hangul && charProperty.relSz.hangul != null) {
				if(charProperty.relSz.hangul != "100") {
					properties.push("font-stretch", charProperty.relSz.hangul, "%");
				}
			}
		}
		if(charProperty.ratio && charProperty.ratio!= null) {
			if(charProperty.ratio.hangul && charProperty.ratio.hangul != null) {
				if(charProperty.ratio.hangul != "100") {
//font-width 는 아직이다.
//font-stretch 는 명세서에는 Deprecated 되었다고 기술되어 있지만, Firefox 기준으로 font 만 지원하면 지원한다.
//단, 기본폰트는 font-stretch 를 지원하지 않는다.
//					properties.replace("font-size", (fontSize * this.parseInt(charProperty.ratio.hangul) / 100), "pt");
					properties.replace("font-stretch", charProperty.ratio.hangul, "%");
					properties.replace("font-width", charProperty.ratio.hangul, "%");
				}
			}
		}
		if(charProperty.spacing && charProperty.spacing!= null) {
			if(charProperty.spacing.hangul && charProperty.spacing.hangul != null) {
				if(charProperty.spacing.hangul != "0") {
					properties.replace("letter-spacing", (fontSize * this.parseInt(charProperty.spacing.hangul) / 100), "pt");
				}
			}
		}
		if(charProperty.bold && charProperty.bold != null) {
			properties.replace("font-weight", "bold");
		}
		if(charProperty.superscript && charProperty.superscript != null) {
			properties.replace("vertical-align", "super");
			properties.replace("font-size", fontSize * this.superscriptRatio, "pt");
		}
		return properties;
	}
	return null;
};
/*
GrahaHwpX2HtmlConverter.prototype.getStylePropertiesFromTabProperty = function(tabProperty) {
	if(tabProperty != null) {
		
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.getStylePropertiesFromNumbering = function(numbering) {
	if(numbering != null) {
		
	}
	return null;
};
*/
GrahaHwpX2HtmlConverter.prototype.getStylePropertiesFromParaProperty = function(paraProperty) {
	if(paraProperty != null) {
		var properties = new GrahaCSSProperties();
		if(paraProperty.align && paraProperty.align != null) {
			if(paraProperty.align.horizontal && paraProperty.align.horizontal != null) {
				properties.push("text-align", paraProperty.align.horizontal);
			}
			if(paraProperty.align.vertical && paraProperty.align.vertical != null) {
//Nothing
//				properties.push("vertical-align", paraProperty.align.vertical);
			}
		}
		if(paraProperty.breakSetting && paraProperty.breakSetting != null) {
			if(paraProperty.breakSetting.breakNonLatinWord && paraProperty.breakSetting.breakNonLatinWord != null) {
				if(paraProperty.breakSetting.breakNonLatinWord == "BREAK_WORD") {
					properties.push("word-break", "break-all");
				} else if(paraProperty.breakSetting.breakNonLatinWord == "KEEP_WORD") {
					properties.push("word-break", "break-word");
				} else {
					console.error(paraProperty.breakSetting.breakNonLatinWord);
				}
			}
		}
		if(paraProperty.lineSpacing && paraProperty.lineSpacing != null) {
			if(
				paraProperty.lineSpacing.type &&
				paraProperty.lineSpacing.type != null &&
				paraProperty.lineSpacing.value &&
				paraProperty.lineSpacing.value != null
			) {
				if(paraProperty.lineSpacing.type == "PERCENT") {
					properties.push("line-height", paraProperty.lineSpacing.value, "%");
				} else if(
					paraProperty.lineSpacing.type == "FIXED" ||
					paraProperty.lineSpacing.type == "AT_LEAST"
				) {
					properties.push("line-height", this.convertToPt(paraProperty.lineSpacing.value, paraProperty.lineSpacing.unit), "pt");
				} else if(paraProperty.lineSpacing.type == "BETWEEN_LINES") {
//Nothing 글자크기를 알 수 있게 된 후에 계산하여 처리한다.
//					properties.push("line-height", "calc(100% + " + this.convertToPt(paraProperty.lineSpacing.value, paraProperty.lineSpacing.unit) + "pt)");
				} else {
					console.error(paraProperty.lineSpacing);
				}
			} else {
				console.error(paraProperty.lineSpacing);
			}
		}
		var ignoreMargin = 0;
		if(paraProperty.border && paraProperty.border != null) {
			if(paraProperty.border.borderFillIDRef && paraProperty.border.borderFillIDRef != null) {
				var borderFill = this.getBorderFill(paraProperty.border.borderFillIDRef);
				if(borderFill != null) {
					if(paraProperty.border.ignoreMargin && paraProperty.border.ignoreMargin != null) {
						ignoreMargin = this.parseInt(paraProperty.border.ignoreMargin);
					}
					if(borderFill.leftBorder && borderFill.leftBorder != null) {
						if(borderFill.leftBorder.type && borderFill.leftBorder.type != null) {
							if(borderFill.leftBorder.type != "NONE") {
								if(paraProperty.border.offsetLeft && paraProperty.border.offsetLeft != null) {
									properties.push("padding-left", this.convertToPt(paraProperty.border.offsetLeft), "pt");
								}
								properties.push("border-left-style", borderFill.leftBorder.type);
								properties.push("border-left-color", this.convertColor(borderFill.leftBorder.color));
								properties.push("border-left-width", this.splitValueAndUnit(borderFill.leftBorder.width));
							}
						}
					}
					if(borderFill.rightBorder && borderFill.rightBorder != null) {
						if(borderFill.rightBorder.type && borderFill.rightBorder.type != null) {
							if(borderFill.rightBorder.type != "NONE") {
								if(paraProperty.border.offsetRight && paraProperty.border.offsetRight != null) {
									properties.push("padding-right", this.convertToPt(paraProperty.border.offsetRight), "pt");
								}
								properties.push("border-right-style", borderFill.rightBorder.type);
								properties.push("border-right-color", this.convertColor(borderFill.rightBorder.color));
								properties.push("border-right-width", this.splitValueAndUnit(borderFill.rightBorder.width));
							}
						}
					}
					if(borderFill.topBorder && borderFill.topBorder != null) {
						if(borderFill.topBorder.type && borderFill.topBorder.type != null) {
							if(borderFill.topBorder.type != "NONE") {
								if(paraProperty.border.offsetTop && paraProperty.border.offsetTop != null) {
									properties.push("padding-top", this.convertToPt(paraProperty.border.offsetTop), "pt");
								}
								properties.push("border-top-style", borderFill.topBorder.type);
								properties.push("border-top-color", this.convertColor(borderFill.topBorder.color));
								properties.push("border-top-width", this.splitValueAndUnit(borderFill.topBorder.width));
							}
						}
					}
					if(borderFill.bottomBorder && borderFill.bottomBorder != null) {
						if(borderFill.bottomBorder.type && borderFill.bottomBorder.type != null) {
							if(borderFill.bottomBorder.type != "NONE") {
								if(paraProperty.border.offsetBottom && paraProperty.border.offsetBottom != null) {
									properties.push("padding-bottom", this.convertToPt(paraProperty.border.offsetBottom), "pt");
								}
								properties.push("border-bottom-style", borderFill.bottomBorder.type);
								properties.push("border-bottom-color", this.convertColor(borderFill.bottomBorder.color));
								properties.push("border-bottom-width", this.splitValueAndUnit(borderFill.bottomBorder.width));
							}
						}
					}
				}
			}
		}
		if(paraProperty.margin && paraProperty.margin != null) {
			var intent = 0;
			if(paraProperty.margin.intent && paraProperty.margin.intent != null) {
				intent = this.convertToPtForMargin(paraProperty.margin.intent.value, paraProperty.margin.intent.unit);
				if(ignoreMargin == 0) {
					properties.push("text-indent", intent, "pt");
				} else {
					properties.plus("text-indent", intent, "pt");
				}
			}
			var marginLeft = 0;
			if(paraProperty.margin.left && paraProperty.margin.left != null) {
				marginLeft = this.convertToPtForMargin(paraProperty.margin.left.value, paraProperty.margin.left.unit);
				if(intent < 0) {
					marginLeft += Math.abs(intent);
				}
				if(ignoreMargin == 0) {
					properties.push("padding-left", marginLeft, "pt");
				} else {
					properties.plus("margin-left", marginLeft, "pt");
				}
			}
			if(paraProperty.margin.right && paraProperty.margin.right != null) {
				if(ignoreMargin == 0) {
					properties.push("padding-right", this.convertToPtForMargin(paraProperty.margin.right.value, paraProperty.margin.right.unit), "pt");
				} else {
					properties.plus("margin-right", this.convertToPtForMargin(paraProperty.margin.right.value, paraProperty.margin.right.unit), "pt");
				}
			}
			if(paraProperty.margin.prev && paraProperty.margin.prev != null) {
				if(ignoreMargin == 0) {
					properties.push("padding-top", this.convertToPtForMargin(paraProperty.margin.prev.value, paraProperty.margin.prev.unit), "pt");
				} else {
					properties.plus("margin-top", this.convertToPtForMargin(paraProperty.margin.prev.value, paraProperty.margin.prev.unit), "pt");
				}
			}
			if(paraProperty.margin.next && paraProperty.margin.next != null) {
				if(ignoreMargin == 0) {
					properties.push("padding-bottom", this.convertToPtForMargin(paraProperty.margin.next.value, paraProperty.margin.next.unit), "pt");
				} else {
					properties.plus("margin-bottom", this.convertToPtForMargin(paraProperty.margin.next.value, paraProperty.margin.next.unit), "pt");
				}
			}
		}
		return properties;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.getStylePropertiesFromStyle = function(style) {
	if(style != null) {
		var paraProperties = null;
		if(style.paraPrIDRef && style.paraPrIDRef != null) {
			paraProperties = this.getStylePropertiesFromParaPropertyId(style.paraPrIDRef);
		}
		var charProperties = null;
		if(style.charPrIDRef && style.charPrIDRef != null) {
			charProperties = this.getStylePropertiesFromCharPropertyId(style.charPrIDRef);
		}
		return {
			paraProperties: paraProperties,
			charProperties: charProperties
		}
	}
	return null;
};
/*
GrahaHwpX2HtmlConverter.prototype.getStylePropertiesFromFontfaceId = function(id) {
	return this.getStylePropertiesFromFontface(this.getFontface(id));
};
*/
GrahaHwpX2HtmlConverter.prototype.getStylePropertiesFromBorderFillId = function(id) {
	return this.getStylePropertiesFromBorderFill(this.getBorderFill(id));
};
GrahaHwpX2HtmlConverter.prototype.getStylePropertiesFromCharPropertyId = function(id) {
	return this.getStylePropertiesFromCharProperty(this.getCharProperty(id));
};
/*
GrahaHwpX2HtmlConverter.prototype.getStylePropertiesFromTabPropertyId = function(id) {
	return this.getStylePropertiesFromTabProperty(this.getTabProperty(id));
};
GrahaHwpX2HtmlConverter.prototype.getStylePropertiesFromNumberingId = function(id) {
	return this.getStylePropertiesFromNumbering(this.getNumbering(id));
};
*/
GrahaHwpX2HtmlConverter.prototype.getStylePropertiesFromParaPropertyId = function(id) {
	return this.getStylePropertiesFromParaProperty(this.getParaProperty(id));
};
GrahaHwpX2HtmlConverter.prototype.getStylePropertiesFromStyleId = function(id) {
	return this.getStylePropertiesFromStyle(this.getStyle(id));
};
GrahaHwpX2HtmlConverter.prototype.getSec = function(sectionXml) {
	return this.findByTagName(sectionXml, "hs:sec");
};
GrahaHwpX2HtmlConverter.prototype.sections = function() {
	if(this.sectionXmls && this.sectionXmls != null && this.sectionXmls.length > 0) {
		if(this.htmlConverterWrapper == null) {
			this.htmlConverterWrapper = new GrahaHtmlConverterWrapper(GrahaHtmlConverterWrapper.HWPX_FORMAT);
		}
		this.htmlConverterWrapper.clearAll();

		this.htmlConverterWrapper.addFile();
		this.pageSplitter = new GrahaHwpXPageSplitter({
			grahaPageInnerSectionClassName: this.htmlConverterWrapper.getPageInnerSectionClassName()
		});
		var styleNode = this.createElement("style");
		styleNode.type = "text/css";
		styleNode.setAttribute("type", "text/css");
		styleNode.append(document.createTextNode(this.htmlConverterWrapper.getLastFileWrapperClassSelector() + " p {margin: 0;z-index: 1;}"));
		this.htmlConverterWrapper.appendStyleForWrapper(styleNode);
		for(var i = 0; i < this.sectionXmls.length; i++) {
			this.section(this.sectionXmls[i]);
		}
		if(this.htmlConverterWrapper.getLastPage() != null) {
			this.boderCollapser.collapse(this.htmlConverterWrapper.getLastPage());
		}
		this.htmlConverterWrapper.rewidthLastFileWrapperElement();
		return this.htmlConverterWrapper.getHtmlElement();
	}
};
GrahaHwpX2HtmlConverter.prototype.createElement = function(nodeName) {
	return this.htmlConverterWrapper.createElement(nodeName);
};
GrahaHwpX2HtmlConverter.prototype.addPage = function(parentElement) {
	if(this.htmlConverterWrapper.getLastPage() != null) {
		this.boderCollapser.collapse(this.htmlConverterWrapper.getLastPage());
	}
	var section = this.htmlConverterWrapper.createPage();
	this.htmlConverterWrapper.addPage(section);
	this.setPage(section);
	var inner = this.htmlConverterWrapper.createPageInnerSection();
	this.htmlConverterWrapper.addPageInnerSection(inner);
	this.relativePageNumber++;
	this.absolutePageNumber++;
	return inner;
};
GrahaHwpX2HtmlConverter.prototype.overflow = function(inner) {
	var lastPage = this.getLastPage();
	return this.pageSplitter.overflow(inner, lastPage);
};
GrahaHwpX2HtmlConverter.prototype.split = function(node) {
	var lastPage = this.getLastPage();
	return this.pageSplitter.split(node, lastPage);
};
GrahaHwpX2HtmlConverter.prototype.initPageFootNote = function() {
	var style = new GrahaCSSProperties();
	style.push("width", 33, "%");
	style.push("border-style", "none");
	style.push("margin-right", 100, "%");
	if(this.footNoteLayout && this.footNoteLayout != null) {
		if(this.footNoteLayout.noteLine && this.footNoteLayout.noteLine != null) {
			if(this.footNoteLayout.noteLine.color && this.footNoteLayout.noteLine.color != null) {
				style.push("color", this.convertColor(this.footNoteLayout.noteLine.color));
				style.push("background-color", this.convertColor(this.footNoteLayout.noteLine.color));
			}
			if(this.footNoteLayout.noteLine.width && this.footNoteLayout.noteLine.width != null) {
				style.push("height", this.splitValueAndUnit(this.footNoteLayout.noteLine.width));
			}
		}
		if(this.footNoteLayout.noteSpacing && this.footNoteLayout.noteSpacing != null) {
			if(this.footNoteLayout.noteSpacing.belowLine && this.footNoteLayout.noteSpacing.belowLine != null) {
				style.push("margin-bottom", this.convertToPt(this.footNoteLayout.noteSpacing.belowLine), "pt");
			}
			if(this.footNoteLayout.noteSpacing.aboveLine && this.footNoteLayout.noteSpacing.aboveLine != null) {
				style.push("margin-top", this.convertToPt(this.footNoteLayout.noteSpacing.aboveLine), "pt");
			}
		}
	}
	var p = this.createElement("p");
	p.setAttribute("class", "graha_page_footnote");
	var hr = this.createElement("hr");
	hr.setAttribute("style", style.toString(false));
	p.append(hr);
	return p;
};
GrahaHwpX2HtmlConverter.prototype.getPageFootNote = function(node) {
	if(node != null) {
		if(node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
			for(var i = 0; i < node.childNodes.length; i++) {
				if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
					if(node.childNodes[i].nodeName == "P") {
						if(
							node.childNodes[i].getAttribute("class") != null &&
							node.childNodes[i].getAttribute("class") == "graha_page_footnote"
						) {
							return node.childNodes[i];
						}
					}
				}
			}
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.getPageFootNoteWithInit = function(node) {
	var pageFootNote = this.getPageFootNote(node);
	if(pageFootNote != null) {
		return pageFootNote;
	}
	var pageFootNote = this.initPageFootNote();
	node.append(pageFootNote);
	return pageFootNote;
};
GrahaHwpX2HtmlConverter.prototype.appendPageFootNote = function(inner) {
	if(this.footNotes && this.footNotes != null) {
		var pageFootNote = null;
		var appended = null;
		for(var i = 0; i < this.footNotes.length; i++) {
			var footNote = this.footNotes[i];
			if(footNote.absolutePageNumber == null) {
				if(pageFootNote == null) {
					pageFootNote = this.getPageFootNoteWithInit(inner);
				}
				footNote.element.moveTo(pageFootNote);
				var overflow = this.overflow(inner);
				if(overflow) {
					footNote.overflowed = true;
				}
				footNote.absolutePageNumber = this.absolutePageNumber;
				if(appended == null) {
					appended = new Array();
				}
				appended.push(i);
			}
		}
		return appended;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.setPageFootNotePosition = function(inner) {
	var pageFootNote = this.getPageFootNote(inner);
	if(pageFootNote != null) {
		$(inner).css("position", "relative");
		$(pageFootNote).css("position", "absolute");
		$(pageFootNote).css("bottom", "0px");
	}
};
GrahaHwpX2HtmlConverter.prototype.overflowFootNote = function(node) {
	var lastPage = this.getLastPage();
	return this.pageSplitter.overflow(node, lastPage, true);
};
GrahaHwpX2HtmlConverter.prototype.setPageHeaderAndFooterAndPagerNumber = function(inner) {
	var _this = this;
	$(inner).find("span.newNum").each(function() {
		if($(this).attr("data-numType") == "PAGE") {
			if($(this).attr("data-num") != null && $(this).attr("data-num") != "") {
				var newNum = _this.parseInt($(this).attr("data-num"));
				if(isNaN(newNum)) {
					console.error(this);
				} else {
					_this.relativePageNumber = newNum;
				}
			}
		}
	});
	$(inner).find("span.header").each(function() {
		if($(this).attr("data-pageHeaderIndex") != null && $(this).attr("data-pageHeaderIndex") != "") {
			var pageHeaderIndex = _this.parseInt($(this).attr("data-pageHeaderIndex"));
			if(isNaN(pageHeaderIndex)) {
				console.error(this);
			} else {
				var applyPageType = $(this).attr("data-applyPageType");
				if(applyPageType == "ODD") {
					_this.pageOddHeaderLastIndex = pageHeaderIndex;
				} else if(applyPageType == "EVEN") {
					_this.pageEvenHeaderLastIndex = pageHeaderIndex;
				} else if(applyPageType == "BOTH") {
					_this.pageOddHeaderLastIndex = pageHeaderIndex;
					_this.pageEvenHeaderLastIndex = pageHeaderIndex;
				} else {
					console.error(this);
				}
			}
		}
	});
	$(inner).find("span.footer").each(function() {
		if($(this).attr("data-pageFooterIndex") != null && $(this).attr("data-pageFooterIndex") != "") {
			var pageFooterIndex = _this.parseInt($(this).attr("data-pageFooterIndex"));
			if(isNaN(pageFooterIndex)) {
				console.error(this);
			} else {
				var applyPageType = $(this).attr("data-applyPageType");
				if(applyPageType == "ODD") {
					_this.pageOddFooterLastIndex = pageFooterIndex;
				} else if(applyPageType == "EVEN") {
					_this.pageEvenFooterLastIndex = pageFooterIndex;
				} else if(applyPageType == "BOTH") {
					_this.pageOddFooterLastIndex = pageFooterIndex;
					_this.pageEvenFooterLastIndex = pageFooterIndex;
				} else {
					console.error(this);
				}
			}
		}
	});
	$(inner).find("span.pageNumber").each(function() {
		if($(this).attr("data-pageNumberIndex") != null && $(this).attr("data-pageNumberIndex") != "") {
			var pageNumberIndex = _this.parseInt($(this).attr("data-pageNumberIndex"));
			if(isNaN(pageNumberIndex)) {
				console.error(this);
			} else {
				_this.pageNumberLastIndex = pageNumberIndex;
			}
		}
	});
	var hidePageNum = 0;
	var hideHeader = 0;
	var hideFooter = 0;
	$(inner).find("span.pageHiding").each(function() {
		if(
			$(this).attr("data-hidePageNum") != null &&
			$(this).attr("data-hidePageNum") != "" &&
			$(this).attr("data-hidePageNum") == "1"
		) {
			hidePageNum = _this.parseInt($(this).attr("data-hidePageNum"));
		}
		if(
			$(this).attr("data-hideHeader") != null &&
			$(this).attr("data-hideHeader") != "" &&
			$(this).attr("data-hideHeader") == "1"
		) {
			hideHeader = _this.parseInt($(this).attr("data-hideHeader"));
		}
		if(
			$(this).attr("data-hideFooter") != null &&
			$(this).attr("data-hideFooter") != "" &&
			$(this).attr("data-hideFooter") == "1"
		) {
			hideFooter = _this.parseInt($(this).attr("data-hideFooter"));
		}
	});
	var lastPage = this.getLastPage();
	if(lastPage != null) {
		lastPage.setAttribute("data-relativePageNumber", this.relativePageNumber);
	}
	if(
		this.pageProperties.gutterType &&
		this.pageProperties.gutterType != null &&
		this.pageProperties.gutterType == "LEFT_RIGHT"
	) {
		var pageLayout = this.getPageLayout(this.relativePageNumber);
		lastPage.style.paddingLeft = pageLayout.left();
		lastPage.style.paddingRight = pageLayout.right();
	}
	if(this.pageMargin && this.pageMargin != null) {
		var inValidPageHeader = true;
		var lastPageHeaderElement = this.getLastPageHeaderElement();
		var pageHeaderLastIndex = null;
		if(this.relativePageNumber % 2 == 0) {
			pageHeaderLastIndex = this.pageEvenHeaderLastIndex;
		} else if(this.relativePageNumber % 2 == 1) {
			pageHeaderLastIndex = this.pageOddHeaderLastIndex;
		}
		if(hideHeader == 0 && pageHeaderLastIndex != null) {
			if(this.pageHeaders != null && (this.pageHeaders.length + 1) >= pageHeaderLastIndex) {
				var pageHeader = this.pageHeaders[pageHeaderLastIndex];
				if(pageHeader && pageHeader != null) {
					pageHeader.appendTo(lastPageHeaderElement);
					$(lastPageHeaderElement).find("span.autoNum").each(function() {
						$(this).text(_this.relativePageNumber);
					});
					inValidPageHeader = false;
				}
			}
		}
		if(inValidPageHeader && lastPageHeaderElement != null) {
			var font = this.createElement("font");
			this.appendText(" ", font);
			lastPageHeaderElement.append(font);
		}
		var inValidPageFooter = true;
		var lastPageFooterElement = this.getLastPageFooterElement();
		var pageFooterLastIndex = null;
		if(this.relativePageNumber % 2 == 0) {
			pageFooterLastIndex = this.pageEvenFooterLastIndex;
		} else if(this.relativePageNumber % 2 == 1) {
			pageFooterLastIndex = this.pageOddFooterLastIndex;
		}
		if(hideFooter == 0 && pageFooterLastIndex != null) {
			if(this.pageFooters != null && (this.pageFooters.length + 1) >= pageFooterLastIndex) {
				var pageFooter = this.pageFooters[pageFooterLastIndex];
				if(pageFooter && pageFooter != null) {
					pageFooter.appendTo(lastPageFooterElement);
					$(lastPageFooterElement).find("span.autoNum").each(function() {
						$(this).text(_this.relativePageNumber);
					});
					inValidPageFooter = false;
				}
			}
		}
		if(inValidPageFooter && lastPageFooterElement != null) {
			var font = this.createElement("font");
			this.appendText(" ", font);
			lastPageFooterElement.append(font);
		}
	}
	if(hidePageNum == 0 && this.pageNumberLastIndex != null) {
		var lastPageNumberElement = this.getLastPageNumberElement();
		if(this.pageNumbers != null && (this.pageNumbers.length + 1) >= this.pageNumberLastIndex) {
			var pageNumber = this.pageNumbers[this.pageNumberLastIndex];
			if(pageNumber && pageNumber != null) {
				if(
					pageNumber.pos == "TOP_LEFT" ||
					pageNumber.pos == "TOP_CENTER" ||
					pageNumber.pos == "TOP_RIGHT" ||
					pageNumber.pos == "INSIDE_TOP" ||
					pageNumber.pos == "OUTSIDE_TOP"
				) {
					lastPageNumberElement.style.bottom = '';
				}
				if(pageNumber.pos == "BOTTOM_CENTER" || pageNumber.pos == "TOP_CENTER") {
					lastPageNumberElement.style.textAlign = "center";
				}
				if(pageNumber.pos == "TOP_RIGHT" || pageNumber.pos == "BOTTOM_RIGHT") {
					lastPageNumberElement.style.textAlign = "right";
				} else if(this.relativePageNumber % 2 == 0 && (pageNumber.pos == "INSIDE_TOP" || pageNumber.pos == "INSIDE_BOTTOM")) {
					lastPageNumberElement.style.textAlign = "right";
				} else if(this.relativePageNumber % 2 == 1 && (pageNumber.pos == "OUTSIDE_TOP" || pageNumber.pos == "OUTSIDE_BOTTOM")) {
					lastPageNumberElement.style.textAlign = "right";
				}
				var font = this.createElement("font");
				if(pageNumber.sideChar && pageNumber.sideChar != null) {
					this.appendText(pageNumber.sideChar, font);
				}
				if(pageNumber.formatType == "DIGIT") {
					font.append(document.createTextNode(this.relativePageNumber));
				}
				if(pageNumber.sideChar && pageNumber.sideChar != null) {
					this.appendText(pageNumber.sideChar, font);
				}
				var pageNumberStyle = this.getStylePropertiesFromStyle(this.findStyle("Page Number"));
				if(pageNumberStyle && pageNumberStyle != null) {
					if(pageNumberStyle.charProperties && pageNumberStyle.charProperties != null) {
						font.setAttribute("style", pageNumberStyle.charProperties.toString(false));
					}
				}
				lastPageNumberElement.append(font);
			}
		}
	}
};
GrahaHwpX2HtmlConverter.prototype.splitFootNote = function(inner) {
	if(inner != null) {
		var pageFootNote = this.getPageFootNote(inner);
		if(pageFootNote != null) {
			var overflowed = false;
			var nextPageFootNote = null;
			var lastPageFootNoteElement = null;
			for(var x = 0; x < pageFootNote.childNodes.length; x++) {
				if(Node.DOCUMENT_NODE == pageFootNote.childNodes[x].nodeType || Node.ELEMENT_NODE == pageFootNote.childNodes[x].nodeType) {
					if(pageFootNote.childNodes[x].nodeName == "P") {
						var node = pageFootNote.childNodes[x];
						if(overflowed) {
							nextPageFootNote.append(node);
							lastPageFootNoteElement = node;
							continue;
						}
						var childNodesLength = node.childNodes.length;
						for(var i = 0; i < childNodesLength; i++) {
							if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
								if(node.childNodes[i].nodeName == "P") {
									if(overflowed) {
										nextPageFootNote.append(node.childNodes[i]);
										lastPageFootNoteElement = node.childNodes[i];
										continue;
									}
									overflowed = this.overflowFootNote(node.childNodes[i]);
									if(overflowed) {
										var splitted = this.split(node.childNodes[i]);
										if(splitted.after != null) {
											this.setPageHeaderAndFooterAndPagerNumber(inner);
											this.setPageFootNotePosition(inner);
											inner = this.addPage();
											this.setPageLayout();
											nextPageFootNote = this.getPageFootNoteWithInit(inner);
											nextPageFootNote.append(splitted.after);
											lastPageFootNoteElement = splitted.after;
										}
									}
								}
							}
						}
					}
				}
			}
			if(lastPageFootNoteElement != null) {
				overflow = this.overflowFootNote(lastPageFootNoteElement);
				if(overflow) {
					inner = this.splitFootNote(inner);
					return inner;
				}
			}
		}
	}
	return inner;
};
GrahaHwpX2HtmlConverter.prototype.section = function(sectionXml, parentElement) {
	var node = this.getSec(sectionXml);
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var inner = this.addPage();
		var index = 0;
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hp:p") {
					inner = this.paragraph(node.childNodes[i], inner);
					if(index == 0) {
						this.setPageLayout();
					}
					var overflow = this.overflow(inner);
					if(overflow) {
						var overed = inner.last(true);
						var splitted = this.split(overed);
						if(splitted != null && splitted.after && splitted.after != null) {
							this.setPageHeaderAndFooterAndPagerNumber(inner);
							this.setPageFootNotePosition(inner);
							inner = this.addPage();
							this.setPageLayout();
							inner.append(splitted.after);
						}
					} else {
						var appended = this.appendPageFootNote(inner);
						if(appended != null) {
							overflow = this.overflow(inner);
							if(overflow) {
								var lastPageFootNoteElement = null;
								var overflowed = false;
								for(var x = 0; x < appended.length; x++) {
									if(
										this.footNotes[appended[x]] &&
										this.footNotes[appended[x]] != null &&
										this.footNotes[appended[x]].element &&
										this.footNotes[appended[x]].element != null &&
										this.footNotes[appended[x]].element.valid()
									) {
										var splitted = this.split(this.footNotes[appended[x]].element);
										if(splitted != null && splitted.after != null) {
											this.setPageHeaderAndFooterAndPagerNumber(inner);
											this.setPageFootNotePosition(inner);
											inner = this.addPage();
											this.setPageLayout();
											var pageFootNote = null;
											for(var z = 0; z < splitted.after.length; z++) {
												if(pageFootNote == null) {
													pageFootNote = this.getPageFootNoteWithInit(inner);
												}
												pageFootNote.append(splitted.after[z]);
												lastPageFootNoteElement = splitted.after[z];
											}
										}
									}
								}
								if(lastPageFootNoteElement != null) {
									overflow = this.overflowFootNote(lastPageFootNoteElement);
									if(overflow) {
										inner = this.splitFootNote(inner);
									}
								}
							}
						}
					}
					index++;
				} else {
					console.error(node.childNodes[i]);
				}
			} else {
				console.error(node.childNodes[i]);
			}
		}
		this.setPageHeaderAndFooterAndPagerNumber(inner);
		this.setPageFootNotePosition(inner);
	}
};
GrahaHwpX2HtmlConverter.prototype.subList = function(node, parentElement, cellStyle) {
	var paragraph = this.createElement("p");
	var attributes = node.attributes;
	for(var x = 0; x < attributes.length; x++) {
		if(attributes.item(x).name == "textDirection") {
		} else if(attributes.item(x).name == "lineWrap") {
//TODO
		} else if(attributes.item(x).name == "vertAlign") {
			parentElement.setAttribute("data-vertical-align", this.fixVerticalAlign(attributes.item(x).value));
		} else if(attributes.item(x).name == "linkListIDRef") {
		} else if(attributes.item(x).name == "linkListNextIDRef") {
		} else if(attributes.item(x).name == "textWidth") {
		} else if(attributes.item(x).name == "textHeight") {
		} else if(attributes.item(x).name == "hasTextRef") {
		} else if(attributes.item(x).name == "hasNumRef") {
		} else if(attributes.item(x).name == "id") {
		} else {
			console.error(attributes.item(x));
		}
	}
	for(var a = 0; a < node.childNodes.length; a++) {
		if(Node.DOCUMENT_NODE == node.childNodes[a].nodeType || Node.ELEMENT_NODE == node.childNodes[a].nodeType) {
			if(node.childNodes[a].nodeName == "hp:p") {
				if(a + 1 == node.childNodes.length && parentElement.getAttribute("data-vertical-align") != null) {
					paragraph.setAttribute("data-vertical-align", parentElement.getAttribute("data-vertical-align"));
				}
				this.paragraph(node.childNodes[a], paragraph);
			}
		}
	}
	if(cellStyle != null && cellStyle.valid()) {
		var excludes = null;
		if(parentElement.nodeName == "TD") {
			if(
				parentElement.getAttribute("data-vertical-align") != null &&
				parentElement.getAttribute("data-vertical-align") == "middle"
			) {
				excludes = ["padding-top", "padding-bottom"];
			}
			if(
				paragraph.firstChild &&
				paragraph.firstChild != null &&
				paragraph.firstChild.nodeName == "P" &&
				paragraph.firstChild.style &&
				paragraph.firstChild.style != null &&
				paragraph.firstChild.style.textAlign &&
				paragraph.firstChild.style.textAlign != null &&
				paragraph.firstChild.style.textAlign == "center"
			) {
				if(excludes == null) {
					excludes = ["padding-left", "padding-right"];
				} else {
					excludes.push("padding-left");
					excludes.push("padding-right");
				}
			}
		}
		paragraph.setAttribute("style", cellStyle.toString(false, excludes));
	}
	if(paragraph.getAttribute("data-graha-css-position") != null) {
		parentElement.setAttribute("data-graha-css-position", paragraph.getAttribute("data-graha-css-position"));
	}
	if(parentElement.append) {
		parentElement.append(paragraph);
	} else {
		parentElement.appendChild(paragraph);
	}
};
GrahaHwpX2HtmlConverter.prototype.tc = function(node, parentElement, cellStyle, tableCellzoneList) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var td = this.createElement("td");
		var attributes = node.attributes;
		var style = new GrahaCSSProperties();
		style.push("box-sizing", "border-box");
		var height = null;
		var width = null;
		var colAddr = null;
		var colspan = null;
		var hasMargin = "0";
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "header") {
				td.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "hasMargin") {
				td.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
				hasMargin = attributes.item(x).value;
			} else if(attributes.item(x).name == "protect") {
				td.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "editable") {
				td.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "dirty") {
				td.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "borderFillIDRef") {
				td.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
				var borderFillStyle = this.getStylePropertiesFromBorderFillId(attributes.item(x).value);
				if(borderFillStyle != null && borderFillStyle.valid()) {
					style.merge(borderFillStyle);
				}
			} else if(attributes.item(x).name == "name") {
			} else {
				console.error(attributes.item(x));
			}
		}
		var colAddr = null;
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hp:cellAddr") {
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "colAddr") {
							td.setAttribute("data-table-cell-index", this.parseInt(attributes.item(x).value) + 1);
							colAddr = this.parseInt(attributes.item(x).value);
						} else if(attributes.item(x).name == "rowAddr") {
							td.setAttribute("data-table-row-index", this.parseInt(attributes.item(x).value) + 1);
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:cellSpan") {
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "colSpan") {
							colspan = this.parseInt(attributes.item(x).value);
							if(colspan > 1) {
								td.setAttribute("colspan", attributes.item(x).value);
							}
						} else if(attributes.item(x).name == "rowSpan") {
							if(this.parseInt(attributes.item(x).value) > 1) {
								td.setAttribute("rowspan", attributes.item(x).value);
							}
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:cellSz") {
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "width") {
							width = this.parseInt(attributes.item(x).value);
							style.push(attributes.item(x).name, this.convertToPt(width), "pt");
							td.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else if(attributes.item(x).name == "height") {
							height = this.parseInt(attributes.item(x).value);
							style.push(attributes.item(x).name, this.convertToPt(height), "pt");
							td.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(hasMargin != "0" && node.childNodes[i].nodeName == "hp:cellMargin") {
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "left") {
							td.setAttribute("data-hwpx-cellMargin-" + attributes.item(x).name, attributes.item(x).value);
							cellStyle.replace("padding-" + attributes.item(x).name, this.convertToPt(attributes.item(x).value), "pt");
						} else if(attributes.item(x).name == "right") {
							td.setAttribute("data-hwpx-cellMargin-" + attributes.item(x).name, attributes.item(x).value);
							cellStyle.replace("padding-" + attributes.item(x).name, this.convertToPt(attributes.item(x).value), "pt");
						} else if(attributes.item(x).name == "top") {
							td.setAttribute("data-hwpx-cellMargin-" + attributes.item(x).name, attributes.item(x).value);
							cellStyle.replace("padding-" + attributes.item(x).name, this.convertToPt(attributes.item(x).value), "pt");
						} else if(attributes.item(x).name == "bottom") {
							td.setAttribute("data-hwpx-cellMargin-" + attributes.item(x).name, attributes.item(x).value);
							cellStyle.replace("padding-" + attributes.item(x).name, this.convertToPt(attributes.item(x).value), "pt");
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:subList") {
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hp:cellAddr") {
				} else if(node.childNodes[i].nodeName == "hp:cellSpan") {
				} else if(node.childNodes[i].nodeName == "hp:cellSz") {
				} else if(node.childNodes[i].nodeName == "hp:cellMargin") {
				} else if(node.childNodes[i].nodeName == "hp:subList") {
					this.subList(node.childNodes[i], td, cellStyle);
					if(td.getAttribute("data-vertical-align") != null) {
						style.push("vertical-align", td.getAttribute("data-vertical-align"));
					}
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		if(td.getAttribute("data-graha-css-position") != null) {
			style.replace("position", td.getAttribute("data-graha-css-position"));
		}
		if(style != null && style.valid()) {
			td.setAttribute("style", style.toString(false));
		}
		parentElement.append(td);
		return {
			width: width,
			height: height,
			colAddr: colAddr,
			colspan: colspan 
		};
	}
};
GrahaHwpX2HtmlConverter.prototype.tr = function(node, parentElement, cellStyle, tableCellzoneList) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var width = 0;
		var height = 0;
		var tr = this.createElement("tr");
		var cellAttrs = new Array();
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hp:tc") {
					cellAttrs.push(this.tc(node.childNodes[i], tr, cellStyle.clone(), tableCellzoneList));
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		tr.setAttribute("data-hwpx-width", width);
		tr.setAttribute("data-hwpx-height", height);
		parentElement.append(tr);
		return cellAttrs;
	}
};
GrahaHwpX2HtmlConverter.prototype.computeColumnWidth = function(rowAttrs, colCnt) {
	if(rowAttrs != null && colCnt != null) {
		if(rowAttrs.length > 0 && colCnt > 0) {
			var cols = new Array(colCnt);
			var filled = 0;
			for(var i = 0; i < rowAttrs.length; i++) {
				for(var x = 0; x < rowAttrs[i].length; x++) {
					if(rowAttrs[i][x].colspan == 1) {
						if(cols[rowAttrs[i][x].colAddr]) {
						} else {
							cols[rowAttrs[i][x].colAddr] = rowAttrs[i][x].width;
							filled++;
						}
					}
				}
			}
			var index = 0;
			while(filled < colCnt) {
				index++;
				if(index > colCnt * 3) {
					break;
				}
				for(var a = 0; a < cols.length; a++) {
					if(cols[a]) {
					} else {
						for(var z = 1; z < cols.length; z++) {
							if(a > (z - 1)) {
								var valid = true;
								for(var q = 1; q <= z; q++) {
									if(cols[a - q]) {
									} else {
										valid = false;
									}
								}
								if(valid) {
									for(var i = 0; i < rowAttrs.length; i++) {
										for(var x = 0; x < rowAttrs[i].length; x++) {
											if(rowAttrs[i][x].colAddr == (a - z) && rowAttrs[i][x].colspan == (z + 1)) {
												if(cols[a]) {
												} else {
													cols[a] = rowAttrs[i][x].width;
													for(var q = 1; q <= z; q++) {
														cols[a] -= cols[a - q];
													}
													filled++;
												}
											}
										}
									}
								}
							}
							if(a < (cols.length - z)) {
								var valid = true;
								for(var q = 1; q <= z; q++) {
									if(cols[a + q]) {
									} else {
										valid = false;
									}
								}
								if(valid) {
									for(var i = 0; i < rowAttrs.length; i++) {
										for(var x = 0; x < rowAttrs[i].length; x++) {
											if(rowAttrs[i][x].colAddr == a && rowAttrs[i][x].colspan == (z + 1)) {
												if(cols[a]) {
												} else {
													cols[a] = rowAttrs[i][x].width;
													for(var q = 1; q <= z; q++) {
														cols[a] -= cols[a + q];
													}
													filled++;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			return cols;
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.tbl = function(node, parentElement) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var table = this.createElement("table");
		var attributes = node.attributes;
		var cellStyle = new GrahaCSSProperties();
		var style = new GrahaCSSProperties();
		style.push("all", "initial");
		style.push("border-collapse", "collapse");
		style.push("box-sizing", "border-box");
		var rowAttrs = new Array();
		var colCnt = null;
		style.push("table-layout", "fixed");
		var borderFillStyle = null;
		var cellSpacing = 0;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "id") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "zOrder") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "numberingType") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "textWrap") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "textFlow") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "lock") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "ctrlch") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "ctrlid") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "pageBreak") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "repeatHeader") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "rowCnt") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "colCnt") {
				colCnt = this.parseInt(attributes.item(x).value);
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "cellSpacing") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
				cellSpacing = this.convertToPt(this.parseInt(attributes.item(x).value));
				style.push("border-spacing", cellSpacing, "pt");
			} else if(attributes.item(x).name == "borderFillIDRef") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
				borderFillStyle = this.getStylePropertiesFromBorderFillId(attributes.item(x).value);
			} else if(attributes.item(x).name == "noAdjust") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "hasOldAddrInfo") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "invalidFormulas") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "sizeAuto") {
				table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else {
				console.error(attributes.item(x));
			}
		}
		if(cellSpacing > 0 && borderFillStyle != null && borderFillStyle.valid()) {
			style.merge(borderFillStyle);
		}
		var cellzoneList = null;
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hp:sz") {
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "width") {
							style.push(attributes.item(x).name, this.convertToPt(attributes.item(x).value), "pt");
							table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else if(attributes.item(x).name == "height") {
							style.push(attributes.item(x).name, this.convertToPt(attributes.item(x).value), "pt");
							table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else if(attributes.item(x).name == "widthRelTo") {
						} else if(attributes.item(x).name == "heightRelTo") {
						} else if(attributes.item(x).name == "protect") {
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:pos") {
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "treatAsChar") {
							table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else if(attributes.item(x).name == "affectLSpacing") {
							table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else if(attributes.item(x).name == "flowWithText") {
							table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else if(attributes.item(x).name == "allowOverlap") {
							table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else if(attributes.item(x).name == "holdAnchorAndSO") {
							table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else if(attributes.item(x).name == "vertRelTo") {
							table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else if(attributes.item(x).name == "horzRelTo") {
							table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else if(attributes.item(x).name == "vertAlign") {
							table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else if(attributes.item(x).name == "horzAlign") {
							table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else if(attributes.item(x).name == "vertOffset") {
							table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else if(attributes.item(x).name == "horzOffset") {
							table.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:outMargin") {
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "left") {
							style.push("margin-" + attributes.item(x).name, this.convertToPt(attributes.item(x).value), "pt");
						} else if(attributes.item(x).name == "right") {
							style.push("margin-" + attributes.item(x).name, this.convertToPt(attributes.item(x).value), "pt");
						} else if(attributes.item(x).name == "top") {
							style.push("margin-" + attributes.item(x).name, this.convertToPt(attributes.item(x).value), "pt");
						} else if(attributes.item(x).name == "bottom") {
							style.push("margin-" + attributes.item(x).name, this.convertToPt(attributes.item(x).value), "pt");
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:inMargin") {
					attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "left") {
							cellStyle.push("padding-" + attributes.item(x).name, this.convertToPt(attributes.item(x).value), "pt");
						} else if(attributes.item(x).name == "right") {
							cellStyle.push("padding-" + attributes.item(x).name, this.convertToPt(attributes.item(x).value), "pt");
						} else if(attributes.item(x).name == "top") {
							cellStyle.push("padding-" + attributes.item(x).name, this.convertToPt(attributes.item(x).value), "pt");
						} else if(attributes.item(x).name == "bottom") {
							cellStyle.push("padding-" + attributes.item(x).name, this.convertToPt(attributes.item(x).value), "pt");
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:cellzoneList") {
					if(node.childNodes[i].childNodes.length > 0) {
						cellzoneList = new Array();
						for(var a = 0; a < node.childNodes[i].childNodes.length; a++) {
							if(Node.DOCUMENT_NODE == node.childNodes[i].childNodes[a].nodeType || Node.ELEMENT_NODE == node.childNodes[i].childNodes[a].nodeType) {
								if(node.childNodes[i].childNodes[a].nodeName == "hp:cellzone") {
									var cellzone = {};
									attributes = node.childNodes[i].childNodes[a].attributes;
									for(var x = 0; x < attributes.length; x++) {
										if(attributes.item(x).name == "startRowAddr") {
											cellzone.startRowAddr = attributes.item(x).value;
										} else if(attributes.item(x).name == "startColAddr") {
											cellzone.startColAddr = attributes.item(x).value;
										} else if(attributes.item(x).name == "endRowAddr") {
											cellzone.endRowAddr = attributes.item(x).value;
										} else if(attributes.item(x).name == "endColAddr") {
											cellzone.endColAddr = attributes.item(x).value;
										} else if(attributes.item(x).name == "borderFillIDRef") {
											cellzone.borderFillIDRef = attributes.item(x).value;
										} else {
											console.error(attributes.item(x));
										}
									}
									cellzoneList.push(cellzone);
								} else {
									console.error(node.childNodes[i].childNodes[a]);
								}
							}
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:tr") {
				} else {
					console.error(node.childNodes[i]);
				}
			} else if(Node.TEXT_NODE == node.childNodes[i].nodeType) {
			} else {
				console.error(node.childNodes[i]);
			}
		}
		if(table.getAttribute("data-hwpx-treatAsChar") != null) {
			if(table.getAttribute("data-hwpx-treatAsChar") == "0") {
				var vertOffset = null;
				var horzOffset = null;
				if(table.getAttribute("data-hwpx-vertOffset") != null) {
					vertOffset = this.parseInt(table.getAttribute("data-hwpx-vertOffset"));
				}
				if(table.getAttribute("data-hwpx-horzOffset") != null) {
					horzOffset = this.parseInt(table.getAttribute("data-hwpx-horzOffset"));
				}
				var prevTable = parentElement.last(false);
				if(prevTable && prevTable != null) {
					var prevLeft = this.splitValueAndUnit($(prevTable).css("left"));
					var prevWidth = this.splitValueAndUnit($(prevTable).css("width"));
					if(prevLeft != null && prevLeft.length == 2 && prevLeft[1] == "pt") {
						horzOffset -= this.convertToHwpUnit(prevLeft[0]);
					}
					if(prevWidth != null && prevWidth.length == 2 && prevWidth[1] == "pt") {
						horzOffset -= this.convertToHwpUnit(prevWidth[0]);
					}
				}
				if(
					(vertOffset != null && vertOffset > 0) ||
					(horzOffset != null && horzOffset) > 0
				) {
					style.push("position", "relative");
					if(vertOffset > 0) {
//TODO [한/글] 에서 줄간격은 줄 아래의 간격 but HTML 에서 줄간격은 1줄의 높이 이므로 [한/글] 문단/위 와 HTML 에서 문단위는 ( {줄간격} - {글자높이} ) / 2 만큼 차이가 난다. 
						style.push("top", this.convertToPt(vertOffset), "pt");
						style.plus("margin-bottom", this.convertToPt(vertOffset), "pt");
					}
					if(horzOffset > 0) {
						style.push("left", this.convertToPt(horzOffset), "pt");
						style.plus("margin-right", this.convertToPt(vertOffset), "pt");
					}
				}
				if(table.getAttribute("data-hwpx-textWrap") != null) {
//textWrap TIGHT 혹은 SQUARE 인 경우, vertOffset 가 font-size 보다 큰 경우 table 앞/뒤의 span 이 table 의 위에 있는 것과 같이 배치된다.
//textWrap TIGHT인 경우 vertOffset 가 font-size 보다 작은 경우 <td></td><td><table></table></td><td></td> 에 양쪽 td 에 있는 것과 같이 배치된다.
					if(table.getAttribute("data-hwpx-textWrap") == "SQUARE") {
						style.push("float", "left");
					} else if(table.getAttribute("data-hwpx-textWrap") == "THROUGH") {
						style.replace("position", "absolute");
						parentElement.setAttribute("data-graha-css-position", "relative");
					}
				}
				style.push("display", "inline-table");
			} else {
				style.push("display", "inline");
			}
		}
		if(style != null && style.valid()) {
			table.setAttribute("style", style.toString(false));
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hp:sz") {
				} else if(node.childNodes[i].nodeName == "hp:pos") {
//TODO
				} else if(node.childNodes[i].nodeName == "hp:outMargin") {
				} else if(node.childNodes[i].nodeName == "hp:inMargin") {
				} else if(node.childNodes[i].nodeName == "hp:cellzoneList") {
				} else if(node.childNodes[i].nodeName == "hp:tr") {
					rowAttrs.push(this.tr(node.childNodes[i], table, cellStyle, cellzoneList));
				} else {
					console.error(node.childNodes[i]);
				}
			} else if(Node.TEXT_NODE == node.childNodes[i].nodeType) {
			} else {
				console.error(node.childNodes[i]);
			}
		}
		var cols = this.computeColumnWidth(rowAttrs, colCnt);
		if(cols != null) {
			var colgroup = this.createElement("colgroup");
			for(var a = 0; a < cols.length; a++) {
				var col = this.createElement("col");
				if(cols[a]) {
					col.setAttribute("style", "width:" + this.convertToPt(cols[a]) + "pt;");
				} else {
					col.setAttribute("style", "width:auto;");
				}
				colgroup.append(col);
			}
			$(table).prepend(colgroup);
		}
		parentElement.append(table);
	}
};
GrahaHwpX2HtmlConverter.prototype.span = function(node, parentElement, prefixText) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var span = this.createElement("span");
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			console.error(attributes.item(x));
		}
		if(prefixText && prefixText != null) {
			this.appendText(prefixText, span);
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hp:lineBreak") {
					span.append(document.createElement("br"));
				} else {
					console.error(node.childNodes[i]);
				}
			} else if(Node.TEXT_NODE == node.childNodes[i].nodeType) {
				this.appendText(node.childNodes[i].nodeValue, span);
			} else {
				console.error(node.childNodes[i]);
			}
		}
		parentElement.append(span);
		return true;
	}
	return false;
};
GrahaHwpX2HtmlConverter.prototype.setPage = function(section) {
	if(this.grahaPages == null) {
		this.grahaPages = new Array();
	}
	this.grahaPages.push(section);
};
GrahaHwpX2HtmlConverter.prototype.getLastPageElement = function(type) {
	var lastPage = this.getLastPage();
	for(var i = 0; i < lastPage.childNodes.length; i++) {
		if(Node.DOCUMENT_NODE == lastPage.childNodes[i].nodeType || Node.ELEMENT_NODE == lastPage.childNodes[i].nodeType) {
			if(lastPage.childNodes[i].getAttribute("class") && lastPage.childNodes[i].getAttribute("class") != null) {
				if(
					type == "header" &&
					lastPage.childNodes[i].nodeName == this.htmlConverterWrapper.getPageHeaderUpperCaseTagName() &&
					lastPage.childNodes[i].getAttribute("class") == this.htmlConverterWrapper.getPageHeaderClassName()
				) {
					return lastPage.childNodes[i];
				} else if(
					type == "footer" &&
					lastPage.childNodes[i].nodeName == this.htmlConverterWrapper.getPageFooterUpperCaseTagName() &&
					lastPage.childNodes[i].getAttribute("class") == this.htmlConverterWrapper.getPageFooterClassName()
				) {
					return lastPage.childNodes[i];
				} else if(
					type == "page_number" &&
					lastPage.childNodes[i].nodeName == this.htmlConverterWrapper.getPageNumberUpperCaseTagName() &&
					lastPage.childNodes[i].getAttribute("class") == this.htmlConverterWrapper.getPageNumberClassName()
				) {
					return lastPage.childNodes[i];
				}
			}
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.getLastPageHeaderElement = function() {
	return this.getLastPageElement("header");
};
GrahaHwpX2HtmlConverter.prototype.getLastPageFooterElement = function() {
	return this.getLastPageElement("footer");
};
GrahaHwpX2HtmlConverter.prototype.getLastPageNumberElement = function() {
	return this.getLastPageElement("page_number");
};
GrahaHwpX2HtmlConverter.prototype.getLastPage = function() {
	if(this.grahaPages == null) {
		return null;
	}
	if(this.grahaPages.length > 0) {
		return this.grahaPages[this.grahaPages.length - 1];
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.setPageProperties = function(pageProperties) {
	this.pageProperties = pageProperties;
	if(this.pageProperties.landscape && this.pageProperties.landscape != null) {
//	WIDELY : 세로 : p
//	NARROWLY : 가로 : landscape
	} else {
		this.pageProperties.landscape = "WIDELY";
	}
	if(this.pageProperties.gutterType && this.pageProperties.gutterType != null) {
//	LEFT_ONLY : 한쪽
//	LEFT_RIGHT : 맞쪽
//	TOP_BOTTOM : 위로
	} else {
		this.pageProperties.gutterType = "LEFT_ONLY";
	}
};
GrahaHwpX2HtmlConverter.prototype.setPageMargin = function(pageMargin) {
	this.pageMargin = pageMargin;
};
GrahaHwpX2HtmlConverter.prototype.setPageBorderFills = function(pageBorderFills) {
	this.pageBorderFills = pageBorderFills;
};
GrahaHwpX2HtmlConverter.prototype.setFootNoteLayout = function(footNoteLayout) {
	this.footNoteLayout = footNoteLayout;
};
GrahaHwpX2HtmlConverter.prototype.setEndNoteLayout = function(endNoteLayout) {
	this.endNoteLayout = endNoteLayout;
};
GrahaHwpX2HtmlConverter.prototype.addPageHeader = function(header) {
	if(this.pageHeaders == null) {
		this.pageHeaders = new Array();
	}
	var lastPageHeaderIndex = this.pageHeaders.length;
	this.pageHeaders.push(header);
	return lastPageHeaderIndex;
};
GrahaHwpX2HtmlConverter.prototype.addPageNumber = function(pageNumber) {
	if(this.pageNumbers == null) {
		this.pageNumbers = new Array();
	}
	var lastPageNumberIndex = this.pageNumbers.length;
	this.pageNumbers.push(pageNumber);
	return lastPageNumberIndex;
};
GrahaHwpX2HtmlConverter.prototype.addPageFooter = function(footer) {
	if(this.pageFooters == null) {
		this.pageFooters = new Array();
	}
	var lastPageFooterIndex = this.pageFooters.length;
	this.pageFooters.push(footer);
	return lastPageFooterIndex;
};
GrahaHwpX2HtmlConverter.prototype.addFootNote = function(footNote) {
	if(this.footNotes && this.footNotes != null) {
	} else {
		this.footNotes = new Array();
	}
	this.footNotes.push({element: footNote, absolutePageNumber: null});
};
GrahaHwpX2HtmlConverter.prototype.setCurrentAutoNum = function(currentAutoNum) {
	this.currentAutoNum = currentAutoNum;
};
GrahaHwpX2HtmlConverter.prototype.getCurrentAutoNum = function() {
	if(this.currentAutoNum && this.currentAutoNum != null) {
		return this.currentAutoNum;
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.getPageLayout = function(page) {
	var pageLayout = {};
	if(
		this.pageProperties.height && this.pageProperties.height != null &&
		this.pageProperties.width && this.pageProperties.width != null
	) {
		if(this.pageProperties.landscape && this.pageProperties.landscape != null) {
			if(this.pageProperties.landscape == "WIDELY") {
				pageLayout.pageHeight = this.pageProperties.height;
				pageLayout.pageWidth = this.pageProperties.width;
			} else {
				pageLayout.pageHeight = this.pageProperties.width;
				pageLayout.pageWidth = this.pageProperties.height;
			}
		} else {
			pageLayout.pageHeight = this.pageProperties.width;
			pageLayout.pageWidth = this.pageProperties.height;
		}
	}
	if(this.pageMargin && this.pageMargin != null) {
		if(this.pageMargin.left && this.pageMargin.left != null) {
			pageLayout.paddingLeft = this.pageMargin.left;
		}
		if(this.pageMargin.right && this.pageMargin.right != null) {
			pageLayout.paddingRight = this.pageMargin.right;
		}
		if(this.pageMargin.top && this.pageMargin.top != null) {
			pageLayout.paddingTop = this.pageMargin.top;
		}
		if(this.pageMargin.bottom && this.pageMargin.bottom != null) {
			pageLayout.paddingBottom = this.pageMargin.bottom;
		}
		if(this.pageMargin.gutter && this.pageMargin.gutter != null) {
			if(this.pageProperties.gutterType && this.pageProperties.gutterType != null) {
				if(this.pageProperties.gutterType == "LEFT_ONLY") {
					pageLayout.gutterLeft = this.pageMargin.gutter;
				} else if(this.pageProperties.gutterType == "LEFT_RIGHT") {
					if(arguments.length > 0 && page && page != null) {
						if(page % 2 == 1) {
							pageLayout.gutterLeft = this.pageMargin.gutter;
						} else {
							pageLayout.gutterRight = this.pageMargin.gutter;
						}
					} else {
						pageLayout.gutterLeft = this.pageMargin.gutter;
					}
				} else if(this.pageProperties.gutterType == "TOP_BOTTOM") {
					pageLayout.gutterTop = this.pageMargin.gutter;
				}
			}
		}
	}
	if(this.pageMargin.header && this.pageMargin.header != null) {
		pageLayout.header = this.pageMargin.header;
	}
	if(this.pageMargin.footer && this.pageMargin.footer != null) {
		pageLayout.footer = this.pageMargin.footer;
	}
	pageLayout.left = function() {
		if(this.gutterLeft && this.gutterLeft != null) {
			if(this.paddingLeft && this.paddingLeft != null) {
				return (this.paddingLeft + this.gutterLeft);
			} else {
				return this.gutterLeft;
			}
		} else {
			if(this.paddingLeft && this.paddingLeft != null) {
				return this.paddingLeft;
			} else {
				return 0;
			}
		}
	};
	pageLayout.right = function() {
		if(this.gutterRight && this.gutterRight != null) {
			if(this.paddingRight && this.paddingRight != null) {
				return (this.paddingRight + this.gutterRight);
			} else {
				return this.gutterRight;
			}
		} else {
			if(this.paddingRight && this.paddingRight != null) {
				return this.paddingRight;
			} else {
				return 0;
			}
		}
	};
	pageLayout.top = function() {
		if(this.gutterTop && this.gutterTop != null) {
			if(this.paddingTop && this.paddingTop != null) {
				return (this.paddingTop + this.gutterTop);
			} else {
				return this.gutterTop;
			}
		} else {
			if(this.paddingTop && this.paddingTop != null) {
				return this.paddingTop;
			} else {
				return 0;
			}
		}
	};
	pageLayout.bottom = function() {
		if(this.paddingBottom && this.paddingBottom != null) {
			return this.paddingBottom;
		} else {
			return 0;
		}
	};
	pageLayout.width = function() {
		if(this.pageWidth && this.pageWidth != null) {
			return this.pageWidth;
		} else {
			return 0;
		}
	};
	pageLayout.height = function() {
		if(this.pageHeight && this.pageHeight != null) {
			return this.pageHeight;
		} else {
			return 0;
		}
	};
	pageLayout.headerHeight = function() {
		if(this.header && this.header != null) {
			return this.header;
		} else {
			return 0;
		}
	};
	pageLayout.footerHeight = function() {
		if(this.footer && this.footer != null) {
			return this.footer;
		} else {
			return 0;
		}
	};
	pageLayout.innerHeight = function() {
		return (this.height() - this.top() - this.bottom() - this.headerHeight() - this.footerHeight());
	};
	pageLayout.innerWidth = function() {
		return (this.width() - this.left() - this.right());
	};
	return pageLayout;
};
GrahaHwpX2HtmlConverter.prototype.setPageLayout = function() {
	var style = new GrahaCSSProperties();
	style.push("position", "relative");
	var pageLayout = this.getPageLayout();
	if(pageLayout.height() > 0 && pageLayout.width() > 0) {
		style.push("height", this.convertToPt(pageLayout.height()), "pt");
		style.push("width", this.convertToPt(pageLayout.width()), "pt");
	} else {
		throw new Error("page width or height is null or undefined");
	}
	style.push("background-color", "white");
	style.push("margin-bottom", "10px");
	var innerStyle = new GrahaCSSProperties();
	var pageHeaderStyle = new GrahaCSSProperties();
	var pageFooterStyle = new GrahaCSSProperties();
	var pageNumberStyle = new GrahaCSSProperties();
	pageHeaderStyle.push("position", "relative");
	pageHeaderStyle.push("top", "0", "px");
	
	pageFooterStyle.push("position", "absolute");
	pageFooterStyle.push("bottom", this.convertToPt(pageLayout.bottom()), "pt");
	
	pageNumberStyle.push("position", "absolute");
	pageNumberStyle.push("bottom", this.convertToPt(pageLayout.bottom()), "pt");
	style.push("box-sizing", "border-box");
	if(pageLayout.left() > 0) {
		style.push("padding-left", this.convertToPt(pageLayout.left()), "pt");
	}
	if(pageLayout.right() > 0) {
		style.push("padding-right", this.convertToPt(pageLayout.right()), "pt");
	}
	if(pageLayout.top() > 0) {
		style.push("padding-top", this.convertToPt(pageLayout.top()), "pt");
	}
	if(pageLayout.bottom() > 0) {
		style.push("padding-bottom", this.convertToPt(pageLayout.bottom()), "pt");
	}
	pageHeaderStyle.push("height", this.convertToPt(pageLayout.headerHeight()), "pt");
	pageFooterStyle.push("height", this.convertToPt(pageLayout.footerHeight()), "pt");
	
	innerStyle.push("width", this.convertToPt(pageLayout.innerWidth()), "pt");
	innerStyle.push("height", this.convertToPt(pageLayout.innerHeight()), "pt");
	pageHeaderStyle.push("width", this.convertToPt(pageLayout.innerWidth()), "pt");
	pageFooterStyle.push("width", this.convertToPt(pageLayout.innerWidth()), "pt");
	pageNumberStyle.push("width", this.convertToPt(pageLayout.innerWidth()), "pt");
	
	var lastPage = this.getLastPage();
	if(lastPage != null) {
		lastPage.setAttribute("style", style.toString(false));
		lastPage.setAttribute("data-absolutePageNumber", this.absolutePageNumber);
		if(
			lastPage.firstChild &&
			lastPage.firstChild != null &&
			lastPage.firstChild.nodeName == "P" &&
			lastPage.firstChild.getAttribute("class") == this.htmlConverterWrapper.getPageInnerSectionClassName()
		) {
			lastPage.firstChild.setAttribute("style", innerStyle.toString(false));
		} else {
			console.error(lastPage);
		}
		if(this.pageMargin && this.pageMargin != null) {
			var pageHeader = this.htmlConverterWrapper.createPageHeaderElement();
			pageHeader.setAttribute("style", pageHeaderStyle.toString(false));
			$(lastPage).prepend(pageHeader);
			var pageFooter = this.htmlConverterWrapper.createPageFooterElement();
			pageFooter.setAttribute("style", pageFooterStyle.toString(false));
			lastPage.append(pageFooter);
			var pageNumber = this.htmlConverterWrapper.createPageNumberElement();
			pageNumber.setAttribute("style", pageNumberStyle.toString(false));
			lastPage.append(pageNumber);
		}
	}
};
GrahaHwpX2HtmlConverter.prototype.pageBorderFill = function(node) {
	if(node != null) {
		var pageBorderFill = {};
		var attributes = node.attributes;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "type") {
				pageBorderFill.type = attributes.item(x).value;
			} else if(attributes.item(x).name == "borderFillIDRef") {
				pageBorderFill.borderFillIDRef = attributes.item(x).value;
			} else if(attributes.item(x).name == "textBorder") {
				pageBorderFill.textBorder = attributes.item(x).value;
			} else if(attributes.item(x).name == "headerInside") {
				pageBorderFill.headerInside = attributes.item(x).value;
			} else if(attributes.item(x).name == "footerInside") {
				pageBorderFill.footerInside = attributes.item(x).value;
			} else if(attributes.item(x).name == "fillArea") {
				pageBorderFill.fillArea = attributes.item(x).value;
			} else {
				console.error(attributes.item(x));
			}
		}
		if(node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
			for(var i = 0; i < node.childNodes.length; i++) {
				if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
					if(node.childNodes[i].nodeName == "hp:offset") {
						pageBorderFill.offset = {};
						attributes = node.childNodes[i].attributes;
						for(var x = 0; x < attributes.length; x++) {
							if(attributes.item(x).name == "left") {
								pageBorderFill.offset.left = attributes.item(x).value;
							} else if(attributes.item(x).name == "right") {
								pageBorderFill.offset.right = attributes.item(x).value;
							} else if(attributes.item(x).name == "top") {
								pageBorderFill.offset.top = attributes.item(x).value;
							} else if(attributes.item(x).name == "bottom") {
								pageBorderFill.offset.bottom = attributes.item(x).value;
							} else {
								console.error(attributes.item(x));
							}
						}
					} else {
						console.error(node.childNodes[i]);
					}
				}
			}
		}
		this.setPageBorderFills(pageBorderFill);
	}
};
GrahaHwpX2HtmlConverter.prototype.footNotePr = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var noteLayout = {};
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hp:autoNumFormat") {
					noteLayout.autoNumFormat = {};
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "type") {
							noteLayout.autoNumFormat.type = attributes.item(x).value;
						} else if(attributes.item(x).name == "suffixChar") {
							noteLayout.autoNumFormat.suffixChar = attributes.item(x).value;
						} else if(attributes.item(x).name == "supscript") {
							noteLayout.autoNumFormat.supscript = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:noteLine") {
					noteLayout.noteLine = {};
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "length") {
							noteLayout.noteLine.length = attributes.item(x).value;
						} else if(attributes.item(x).name == "type") {
							noteLayout.noteLine.type = attributes.item(x).value;
						} else if(attributes.item(x).name == "width") {
							noteLayout.noteLine.width = attributes.item(x).value;
						} else if(attributes.item(x).name == "color") {
							noteLayout.noteLine.color = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:noteSpacing") {
					noteLayout.noteSpacing = {};
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "betweenNotes") {
							noteLayout.noteSpacing.betweenNotes = attributes.item(x).value;
						} else if(attributes.item(x).name == "belowLine") {
							noteLayout.noteSpacing.belowLine = attributes.item(x).value;
						} else if(attributes.item(x).name == "aboveLine") {
							noteLayout.noteSpacing.aboveLine = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:numbering") {
					noteLayout.numbering = {};
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "type") {
							noteLayout.numbering.type = attributes.item(x).value;
						} else if(attributes.item(x).name == "newNum") {
							noteLayout.numbering.newNum = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:placement") {
					noteLayout.placement = {};
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "place") {
							noteLayout.placement.place = attributes.item(x).value;
						} else if(attributes.item(x).name == "beneathText") {
							noteLayout.placement.beneathText = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
		if(node.nodeName == "hp:footNotePr") {
			this.setFootNoteLayout(noteLayout);
		} else if(node.nodeName == "hp:endNotePr") {
			this.setEndNoteLayout(noteLayout);
		} else {
			console.error(node);
		}
	}
};
GrahaHwpX2HtmlConverter.prototype.secPr = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hp:grid") {
//Nothing
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "lineGrid") {
						} else if(attributes.item(x).name == "charGrid") {
						} else if(attributes.item(x).name == "wonggojiFormat") {
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:startNum") {
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "pageStartsOn") {
						} else if(attributes.item(x).name == "page") {
//NOTHING
						} else if(attributes.item(x).name == "pic") {
						} else if(attributes.item(x).name == "tbl") {
						} else if(attributes.item(x).name == "equation") {
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:visibility") {
//Nothing
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "hideFirstHeader") {
						} else if(attributes.item(x).name == "hideFirstFooter") {
						} else if(attributes.item(x).name == "hideFirstMasterPage") {
						} else if(attributes.item(x).name == "border") {
						} else if(attributes.item(x).name == "fill") {
						} else if(attributes.item(x).name == "hideFirstPageNum") {
						} else if(attributes.item(x).name == "hideFirstEmptyLine") {
						} else if(attributes.item(x).name == "showLineNumber") {
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:lineNumberShape") {
//Nothing
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "restartType") {
						} else if(attributes.item(x).name == "countBy") {
						} else if(attributes.item(x).name == "distance") {
						} else if(attributes.item(x).name == "startNumber") {
						} else {
							console.error(attributes.item(x));
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:pagePr") {
					var pageProperties = {};
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "landscape") {
							pageProperties.landscape = attributes.item(x).value;
						} else if(attributes.item(x).name == "width") {
							pageProperties.width = attributes.item(x).value;
						} else if(attributes.item(x).name == "height") {
							pageProperties.height = attributes.item(x).value;
						} else if(attributes.item(x).name == "gutterType") {
							pageProperties.gutterType = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
					this.setPageProperties(pageProperties);
					for(var a = 0; a < node.childNodes[i].childNodes.length; a++) {
						if(Node.DOCUMENT_NODE == node.childNodes[i].childNodes[a].nodeType || Node.ELEMENT_NODE == node.childNodes[i].childNodes[a].nodeType) {
							if(node.childNodes[i].childNodes[a].nodeName == "hp:margin") {
								var margin = {};
								attributes = node.childNodes[i].childNodes[a].attributes;
								for(var x = 0; x < attributes.length; x++) {
									if(attributes.item(x).name == "header") {
										margin.header = this.parseInt(attributes.item(x).value);
									} else if(attributes.item(x).name == "footer") {
										margin.footer = this.parseInt(attributes.item(x).value);
									} else if(attributes.item(x).name == "gutter") {
//제본
										margin.gutter = this.parseInt(attributes.item(x).value);
									} else if(attributes.item(x).name == "left") {
										margin.left = this.parseInt(attributes.item(x).value);
									} else if(attributes.item(x).name == "right") {
										margin.right = this.parseInt(attributes.item(x).value);
									} else if(attributes.item(x).name == "top") {
										margin.top = this.parseInt(attributes.item(x).value);
									} else if(attributes.item(x).name == "bottom") {
										margin.bottom = this.parseInt(attributes.item(x).value);
									} else {
										console.error(attributes.item(x));
									}
								}
								this.setPageMargin(margin);
							} else {
								console.error(node.childNodes[i].childNodes[a]);
							}
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:footNotePr") {
					this.footNotePr(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hp:endNotePr") {
					this.footNotePr(node.childNodes[i]);
				} else if(node.childNodes[i].nodeName == "hp:pageBorderFill") {
					this.pageBorderFill(node.childNodes[i]);
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.ctrl = function(node, parentElement) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hp:colPr") {
//Nothing
				} else if(node.childNodes[i].nodeName == "hp:footer") {
					var footer = new GrahaDummyElement({grahaPageInnerSectionClassName:this.grahaPageInnerSectionClassName});
					var span = this.createElement("span");
					span.setAttribute("class", "footer");
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "id") {
							footer.setAttribute("data-id", attributes.item(x).value);
							span.setAttribute("data-id", attributes.item(x).value);
						} else if(attributes.item(x).name == "applyPageType") {
							footer.setAttribute("data-applyPageType", attributes.item(x).value);
							span.setAttribute("data-applyPageType", attributes.item(x).value);
						} else {
							console.error(attributes.item(x));
						}
					}
					var cellStyle = new GrahaCSSProperties();
					for(var a = 0; a < node.childNodes[i].childNodes.length; a++) {
						if(Node.DOCUMENT_NODE == node.childNodes[i].childNodes[a].nodeType || Node.ELEMENT_NODE == node.childNodes[i].childNodes[a].nodeType) {
							if(node.childNodes[i].childNodes[a].nodeName == "hp:subList") {
								this.subList(node.childNodes[i].childNodes[a], footer, cellStyle);
							}
						}
					}
					var pageFooterIndex = this.addPageFooter(footer);
					span.setAttribute("data-pageFooterIndex", pageFooterIndex);
					parentElement.append(span);
				} else if(node.childNodes[i].nodeName == "hp:header") {
					var header = new GrahaDummyElement({grahaPageInnerSectionClassName:this.grahaPageInnerSectionClassName});
					var span = this.createElement("span");
					span.setAttribute("class", "header");
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "id") {
							header.setAttribute("data-id", attributes.item(x).value);
							span.setAttribute("data-id", attributes.item(x).value);
						} else if(attributes.item(x).name == "applyPageType") {
							header.setAttribute("data-applyPageType", attributes.item(x).value);
							span.setAttribute("data-applyPageType", attributes.item(x).value);
						} else {
							console.error(attributes.item(x));
						}
					}
					var cellStyle = new GrahaCSSProperties();
					for(var a = 0; a < node.childNodes[i].childNodes.length; a++) {
						if(Node.DOCUMENT_NODE == node.childNodes[i].childNodes[a].nodeType || Node.ELEMENT_NODE == node.childNodes[i].childNodes[a].nodeType) {
							if(node.childNodes[i].childNodes[a].nodeName == "hp:subList") {
								this.subList(node.childNodes[i].childNodes[a], header, cellStyle);
							}
						}
					}
					var pageHeaderIndex = this.addPageHeader(header);
					span.setAttribute("data-pageHeaderIndex", pageHeaderIndex);
					parentElement.append(span);
				} else if(node.childNodes[i].nodeName == "hp:pageNum") {
/**
<hp:pageNum sideChar="-" formatType="DIGIT" pos="BOTTOM_CENTER"/>

[@formatType]
DIGIT : 1 2 3
CIRCLED_DIGIT : ① ② ③
ROMAN_CAPITAL : ⅠⅡⅢ
ROMAN_SMALL : ⅰⅱⅲ
LATIN_CAPITAL : A B C
HANGUL_SYLLABLE : 가 나 다
IDEOGRAPH : 一 二 三
DECAGON_CIRCLE : 갑을병(한글) (11부터는 다시 갑)
DECAGON_CIRCLE_HANJA : 갑을병(한자)

[@pos]
TOP_LEFT	TOP_CENTER	TOP_RIGHT
BOTTOM_LEFT	BOTTOM_CENTER	BOTTOM_RIGHT
INSIDE_TOP	OUTSIDE_TOP
INSIDE_BOTTOM	OUTSIDE_BOTTOM
*/
					var pageNum = {};
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "pos") {
							pageNum.pos = attributes.item(x).value;
						} else if(attributes.item(x).name == "formatType") {
							pageNum.formatType = attributes.item(x).value;
						} else if(attributes.item(x).name == "sideChar") {
							pageNum.sideChar = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
					var pageNumberIndex = this.addPageNumber(pageNum);
					var span = this.createElement("span");
					span.setAttribute("class", "pageNumber");
					span.setAttribute("data-pageNumberIndex", pageNumberIndex);
					parentElement.append(span);
				} else if(node.childNodes[i].nodeName == "hp:footNote") {
					var footNote = new GrahaDummyElement({grahaPageInnerSectionClassName:this.grahaPageInnerSectionClassName});
					var cellStyle = new GrahaCSSProperties();
					for(var a = 0; a < node.childNodes[i].childNodes.length; a++) {
						if(Node.DOCUMENT_NODE == node.childNodes[i].childNodes[a].nodeType || Node.ELEMENT_NODE == node.childNodes[i].childNodes[a].nodeType) {
							if(node.childNodes[i].childNodes[a].nodeName == "hp:subList") {
								this.subList(node.childNodes[i].childNodes[a], footNote, cellStyle);
							}
						}
					}
					var currentAutoNum = this.getCurrentAutoNum();
					if(currentAutoNum != null) {
						if(parentElement && parentElement != null) {
							var span = this.createElement("span");
							span.setAttribute("style", "vertical-align:super;font-size: 58%;");
							this.appendText(currentAutoNum.num, span);
							if(currentAutoNum.autoNumFormat && currentAutoNum.autoNumFormat != null && currentAutoNum.autoNumFormat.suffixChar && currentAutoNum.autoNumFormat.suffixChar != null) {
								this.appendText(currentAutoNum.autoNumFormat.suffixChar, span);
							}
							parentElement.append(span);
						}
					}
					this.addFootNote(footNote);
				} else if(node.childNodes[i].nodeName == "hp:newNum") {
					var newNum = {};
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "num") {
							newNum.num = attributes.item(x).value;
						} else if(attributes.item(x).name == "numType") {
							newNum.numType = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
					if(
						newNum.num && newNum.num != null &&
						newNum.numType && newNum.numType != null && newNum.numType == "PAGE"
					) {
						var span = this.createElement("span");
						span.setAttribute("class", "newNum");
						span.setAttribute("data-num", newNum.num);
						span.setAttribute("data-numType", newNum.numType);
						parentElement.append(span);
					}
				} else if(node.childNodes[i].nodeName == "hp:pageHiding") {
					var pageHiding = {};
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "hideHeader") {
							pageHiding.hideHeader = attributes.item(x).value;
						} else if(attributes.item(x).name == "hideFooter") {
							pageHiding.hideFooter = attributes.item(x).value;
						} else if(attributes.item(x).name == "hideMasterPage") {
							pageHiding.hideMasterPage = attributes.item(x).value;
						} else if(attributes.item(x).name == "hideBorder") {
							pageHiding.hideBorder = attributes.item(x).value;
						} else if(attributes.item(x).name == "hideFill") {
							pageHiding.hideFill = attributes.item(x).value;
						} else if(attributes.item(x).name == "hidePageNum") {
							pageHiding.hidePageNum = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
					if(
						pageHiding.hideHeader && pageHiding.hideHeader != null &&
						pageHiding.hideFooter && pageHiding.hideFooter != null &&
						pageHiding.hideMasterPage && pageHiding.hideMasterPage != null &&
						pageHiding.hideBorder && pageHiding.hideBorder != null &&
						pageHiding.hideFill && pageHiding.hideFill != null &&
						pageHiding.hideFooter && pageHiding.hideFooter != null
					) {
						var span = this.createElement("span");
						span.setAttribute("class", "pageHiding");
						span.setAttribute("data-hideHeader", pageHiding.hideHeader);
						span.setAttribute("data-hideFooter", pageHiding.hideFooter);
						span.setAttribute("data-hideMasterPage", pageHiding.hideMasterPage);
						span.setAttribute("data-hideBorder", pageHiding.hideBorder);
						span.setAttribute("data-hideFill", pageHiding.hideFill);
						span.setAttribute("data-hidePageNum", pageHiding.hidePageNum);
						parentElement.append(span);
					}
				} else if(node.childNodes[i].nodeName == "hp:autoNum") {
					var autoNum = {};
					var attributes = node.childNodes[i].attributes;
					for(var x = 0; x < attributes.length; x++) {
						if(attributes.item(x).name == "num") {
							autoNum.num = attributes.item(x).value;
						} else if(attributes.item(x).name == "numType") {
							autoNum.numType = attributes.item(x).value;
						} else {
							console.error(attributes.item(x));
						}
					}
					for(var a = 0; a < node.childNodes[i].childNodes.length; a++) {
						if(Node.DOCUMENT_NODE == node.childNodes[i].childNodes[a].nodeType || Node.ELEMENT_NODE == node.childNodes[i].childNodes[a].nodeType) {
							if(node.childNodes[i].childNodes[a].nodeName == "hp:autoNumFormat") {
								autoNum.autoNumFormat = {};
								attributes = node.childNodes[i].childNodes[a].attributes;
								for(var x = 0; x < attributes.length; x++) {
									if(attributes.item(x).name == "type") {
										autoNum.autoNumFormat.type = attributes.item(x).value;
									} else if(attributes.item(x).name == "suffixChar") {
										autoNum.autoNumFormat.suffixChar = attributes.item(x).value;
									} else if(attributes.item(x).name == "supscript") {
										autoNum.autoNumFormat.supscript = attributes.item(x).value;
									} else {
										console.error(attributes.item(x));
									}
								}
							} else {
								console.error(node.childNodes[i].childNodes[a]);
							}
						}
					}
					if(autoNum.num && autoNum.num != null) {
						if(parentElement && parentElement != null) {
							this.setCurrentAutoNum(autoNum);
							if(autoNum.numType && autoNum.numType != null && (autoNum.numType == "PAGE" || autoNum.numType == "TOTAL_PAGE")) {
								var span = this.createElement("span");
								span.setAttribute("class", "autoNum");
								span.setAttribute("data-numType", autoNum.numType);
								this.appendText(autoNum.num, span);
								parentElement.append(span);
							} else {
								this.appendText(autoNum.num, parentElement);
								if(autoNum.autoNumFormat && autoNum.autoNumFormat != null && autoNum.autoNumFormat.suffixChar && autoNum.autoNumFormat.suffixChar != null) {
									this.appendText(autoNum.autoNumFormat.suffixChar, parentElement);
								}
							}
						}
					}
				} else {
					console.error(node.childNodes[i]);
				}
			}
		}
	}
	return null;
};
GrahaHwpX2HtmlConverter.prototype.rtrim = function(node) {
	if(node != null) {
		if(node.childNodes != null && node.childNodes.length > 0) {
			for(var i = (node.childNodes.length - 1); i >= 0; i--) {
				if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
					if(node.childNodes[i].nodeName == "FONT") {
						var stop = false;
						for(var a = (node.childNodes[i].childNodes.length - 1); a >= 0; a--) {
							if(Node.DOCUMENT_NODE == node.childNodes[i].childNodes[a].nodeType || Node.ELEMENT_NODE == node.childNodes[i].childNodes[a].nodeType) {
								if(node.childNodes[i].childNodes[a].nodeName == "SPAN") {
									for(var z = (node.childNodes[i].childNodes[a].childNodes.length - 1); z >= 0; z--) {
										if(Node.TEXT_NODE == node.childNodes[i].childNodes[a].childNodes[z].nodeType) {
											var textNodeValue = node.childNodes[i].childNodes[a].childNodes[z].nodeValue;
											if(textNodeValue && textNodeValue != null) {
												textNodeValue = textNodeValue.replace(/\s*$/, "");
												var textNode = this.textNode(textNodeValue);
												if(textNode != null) {
													$(node.childNodes[i].childNodes[a].childNodes[z]).replaceWith(textNode);
												}
												if(textNodeValue != "") {
													stop = true;
													break;
												}
											}
										}
									}
									if(stop) {
										break;
									}
								} else {
									break;
								}
							}
						}
						if(stop) {
							break;
						}
					} else {
						break;
					}
				}
			}
		}
	}
};
GrahaHwpX2HtmlConverter.prototype.ltrim = function(node) {
	if(node != null) {
		if(node.childNodes != null && node.childNodes.length > 0) {
			for(var i = 0; i < node.childNodes.length; i++) {
				if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
					if(node.childNodes[i].nodeName == "FONT") {
						var stop = false;
						 for(var a = 0; a < node.childNodes[i].childNodes.length; a++) {
							if(Node.DOCUMENT_NODE == node.childNodes[i].childNodes[a].nodeType || Node.ELEMENT_NODE == node.childNodes[i].childNodes[a].nodeType) {
								if(node.childNodes[i].childNodes[a].nodeName == "SPAN") {
									for(var z = 0; z < node.childNodes[i].childNodes[a].childNodes.length; z++) {
										if(Node.TEXT_NODE == node.childNodes[i].childNodes[a].childNodes[z].nodeType) {
											var textNodeValue = node.childNodes[i].childNodes[a].childNodes[z].nodeValue;
											if(textNodeValue && textNodeValue != null) {
												textNodeValue = textNodeValue.replace(/^\s*/, "");
												var textNode = this.textNode(textNodeValue);
												if(textNode != null) {
													$(node.childNodes[i].childNodes[a].childNodes[z]).replaceWith(textNode);
												}
												if(textNodeValue != "") {
													stop = true;
													break;
												}
											}
										}
									}
									if(stop) {
										break;
									}
								} else {
									break;
								}
							}
						}
						if(stop) {
							break;
						}
					} else {
						break;
					}
				}
			}
		}
	}
};
GrahaHwpX2HtmlConverter.prototype.run = function(node, parentElement, paraProperty, isFirstRun) {
	if(node != null) {
		var font = this.createElement("font");
		var attributes = node.attributes;
		var charHeight = null;
		var charPrIDRef = null;
		var style = null;
		var existsSpan = false;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "charPrIDRef") {
				font.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
				charPrIDRef = attributes.item(x).value;
				var charProperty = this.getCharProperty(attributes.item(x).value);
				if(charProperty != null) {
					if(charProperty.height && charProperty.height != null) {
						if(charProperty.superscript && charProperty.superscript != null) {
							charHeight = charProperty.height * this.superscriptRatio;
						} else {
							charHeight = charProperty.height;
						}
					}
					style = this.getStylePropertiesFromCharProperty(charProperty);
				}
			} else {
				console.error(attributes.item(x));
			}
		}
		if(style != null && style.valid()) {
			font.setAttribute("style", style.toString(false));
		}
		parentElement.append(font);
		if(paraProperty && paraProperty != null) {
			var verticalAlign = null;
			if(style != null && style.valid()) {
				verticalAlign = style.getProperty("vertical-align");
			}
			if(verticalAlign == null) {
				if(paraProperty.align && paraProperty.align != null) {
					if(paraProperty.align.vertical && paraProperty.align.vertical != null) {
						if(font.getAttribute("style") == null) {
							font.setAttribute("style", "vertical-align: " + paraProperty.align.vertical + ";");
						} else {
							font.setAttribute("style", font.getAttribute("style") + "vertical-align: " + paraProperty.align.vertical + ";");
						}
					}
				}
			}
			var prefixText = null;
			if(isFirstRun && paraProperty.heading && paraProperty.heading != null) {
				if(paraProperty.heading.type && paraProperty.heading.type != null) {
					if(paraProperty.heading.type == "OUTLINE" || paraProperty.heading.type == "NUMBER") {
						var outline = this.getOutline(paraProperty.heading.idRef, paraProperty.heading.level);
						if(outline != null) {
							prefixText = outline;
						} else {
							console.error(paraProperty);
						}
					}
				}
			}
		}
		if(node.childNodes != null && node.childNodes.length > 0) {
			for(var i = 0; i < node.childNodes.length; i++) {
				if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
					if(node.childNodes[i].nodeName == "hp:ctrl") {
						this.ctrl(node.childNodes[i], font);
					} else if(node.childNodes[i].nodeName == "hp:secPr") {
						this.secPr(node.childNodes[i]);
					} else if(node.childNodes[i].nodeName == "hp:t") {
						if(existsSpan) {
							this.span(node.childNodes[i], font, null);
						} else if(this.span(node.childNodes[i], font, prefixText)) {
							existsSpan = true;
						}
					} else if(node.childNodes[i].nodeName == "hp:tbl") {
						this.tbl(node.childNodes[i], font);
						if(font.getAttribute("data-graha-css-position") != null) {
							parentElement.setAttribute("data-graha-css-position", font.getAttribute("data-graha-css-position"));
						}
					} else {
						console.error(node.childNodes[i]);
					}
				} else {
					console.error(node.childNodes[i]);
				}
			}
		} else {
//			font.append(document.createTextNode('\u0020'));
			font.append(document.createTextNode('\u180E'));
			existsSpan = true;
		}
		if(existsSpan) {
			return charHeight;
		}
	}
	return null;
};

GrahaHwpX2HtmlConverter.prototype.clearBoth = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "FONT") {
					var font = node.childNodes[i];
					if(font != null && font.childNodes && font.childNodes != null && font.childNodes.length > 0) {
						for(var a = 0; a < font.childNodes.length; a++) {
							if(Node.DOCUMENT_NODE == font.childNodes[a].nodeType || Node.ELEMENT_NODE == font.childNodes[a].nodeType) {
								if(font.childNodes[a].nodeName == "TABLE") {
									var table = font.childNodes[a];
									if(table.getAttribute("data-hwpx-treataschar") != null) {
										if(table.getAttribute("data-hwpx-treatAsChar") == "0") {
											if(table.getAttribute("data-hwpx-textWrap") != null) {
												if(table.getAttribute("data-hwpx-textWrap") == "SQUARE") {
													return true;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};

GrahaHwpX2HtmlConverter.prototype.paragraph = function(node, parentElement) {
//[한/글] 의 문단(<hp:p>)은 display: inline 에 prev() 에 p 가 있는 경우에만 줄바꿈을 하는 (<br> 이 붙어 있는 것과 유사한) 것으로 생각된다.
//[한/글] 에서 "본문과의 배치 = 어울림" 은 같은 문단과 이어지는 다음 문단에서 각 줄의 그 자리에 (span 따위로 처리되는) 비어있는 공간이 있는 것과 유사하게 처리된다. ("본문 위치 = 양쪽" 이 기본값이다.)
//(span 따위로 처리되는) 비어있는 공간의 최소 넓이는 글자크기가 5pt 인 경우에도 최소 6mm 이상은 되어 보이고, 글자크기가 매우 커지면 글자크기에 따라 넓어지는 것으로 생각된다.
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var paragraph = this.createElement("p");
		var attributes = node.attributes;
		var paraProperty = null;
		var maximumCharHeight = null;
		for(var x = 0; x < attributes.length; x++) {
			if(attributes.item(x).name == "id") {
				paragraph.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "paraPrIDRef") {
				paragraph.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
				paraProperty = this.getParaProperty(attributes.item(x).value);
			} else if(attributes.item(x).name == "styleIDRef") {
				paragraph.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "pageBreak") {
				if(attributes.item(x).value == "1") {
					if(
						parentElement.nodeName == "P" &&
						parentElement.getAttribute("class") == "graha_page_inner_section" &&
						parentElement.childNodes.length == 0
					) {
					} else {
						this.setPageHeaderAndFooterAndPagerNumber(parentElement);
						this.setPageFootNotePosition(parentElement);
						parentElement = this.addPage();
						this.setPageLayout();
					}
				}
				paragraph.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "columnBreak") {
				paragraph.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else if(attributes.item(x).name == "merged") {
				paragraph.setAttribute("data-hwpx-" + attributes.item(x).name, attributes.item(x).value);
			} else {
				console.error(attributes.item(x));
			}
		}
		parentElement.append(paragraph);
		var isFirstRun = true;
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeName == "hp:run") {
					var charHeight = this.run(node.childNodes[i], paragraph, paraProperty, isFirstRun);
					isFirstRun = false;
					if(charHeight != null) {
						if(maximumCharHeight == null) {
							maximumCharHeight = charHeight;
						} else {
							maximumCharHeight = Math.max(maximumCharHeight, charHeight);
						}
					}
				} else if(node.childNodes[i].nodeName == "hp:linesegarray") {
				} else {
					console.error(node.childNodes[i]);
				}
			} else {
				console.error(node.childNodes[i]);
			}
		}
		/*
		this.rtrim(paragraph);
		if(paraProperty.align && paraProperty.align != null) {
			if(paraProperty.align.horizontal && paraProperty.align.horizontal != null) {
				if(paraProperty.align.horizontal == "RIGHT") {
					this.ltrim(paragraph);
				}
			}
		}
		*/
		if(paraProperty != null) {
			var style = this.getStylePropertiesFromParaProperty(paraProperty);
			
			var clearBoth = this.clearBoth(paragraph);
			if(clearBoth) {
				style.push("width", "100%");
				style.push("float", "left");
			} else {
				style.push("clear", "both");
			}
			
			if(paraProperty.lineSpacing && paraProperty.lineSpacing != null) {
				if(paraProperty.lineSpacing.type && paraProperty.lineSpacing.type != null) {
					if(paraProperty.lineSpacing.type == "BETWEEN_LINES") {
						if(maximumCharHeight != null) {
							style.push("line-height", maximumCharHeight + this.convertToPt(paraProperty.lineSpacing.value, paraProperty.lineSpacing.unit), "pt");
						} else {
							if(style == null) {
								style = new GrahaCSSProperties();
							}
							style.push("line-height", "calc(100% + " + this.convertToPt(paraProperty.lineSpacing.value, paraProperty.lineSpacing.unit) + "pt)");
							console.error("maximumCharHeight is missing", paraProperty.lineSpacing.type);
						}
					}
				}
			}
			if(paraProperty.heading && paraProperty.heading != null) {
				if(paraProperty.heading.type && paraProperty.heading.type != null) {
					if(paraProperty.heading.type == "OUTLINE" || paraProperty.heading.type == "NUMBER") {
						var paddingLeftProperty = style.getProperty("padding-left");
						if(paddingLeftProperty != null) {
							if(paddingLeftProperty.value != null) {
								var computeOutlineWidth = this.computeOutlineWidth(paraProperty.heading.idRef, paraProperty.heading.level, maximumCharHeight);
								if(computeOutlineWidth == null) {
									console.error("computeOutlineWidth is null");
								} else {
									style.plus("padding-left", this.convertToPt(computeOutlineWidth), "pt");
									style.plus("text-indent", -this.convertToPt(computeOutlineWidth), "pt");
								}
							}
						}
					}
				}
			}
			if(style != null && style.valid()) {
				var lineHeightProperty = style.getProperty("line-height");
				if(lineHeightProperty != null) {
					var lineHeight = null;
					if(lineHeightProperty.unit != null) {
						if(lineHeightProperty.unit == "%") {
							if(maximumCharHeight != null) {
								lineHeight = this.convertToPt(maximumCharHeight) * this.parseInt(lineHeightProperty.value) / 100;
							}
						} else {
							lineHeight = this.convertToPt(lineHeightProperty.value, lineHeightProperty.unit);
						}
					}
					if(lineHeight != null && maximumCharHeight != null) {
//HTML 의 줄간격과 [한/글] 의 줄간격이 표시되는 방법이 다르다.  HTML 은 middle 에 [한/글] 은 top 에 글자가 배치된다.
						var marginTop = lineHeight - this.convertToPt(maximumCharHeight);
						marginTop = marginTop / 2;
						style.plus("margin-top", -marginTop, "pt");
						if(parentElement.nodeName == "P" && parentElement.getAttribute("data-vertical-align") != null) {
							style.plus("margin-bottom", -marginTop, "pt");
						} else {
							style.plus("margin-bottom", marginTop, "pt");
						}
					}
				}
				paragraph.setAttribute("style", style.toString(false));
			}
		}
		if(paragraph.getAttribute("data-graha-css-position") != null) {
			parentElement.setAttribute("data-graha-css-position", paragraph.getAttribute("data-graha-css-position"));
		}
		if(maximumCharHeight != null) {
			if(paragraph.getAttribute("style") == null) {
				paragraph.setAttribute("style", "font-size: " + this.convertToPt(maximumCharHeight) + "pt;");
			} else {
				paragraph.setAttribute("style", paragraph.getAttribute("style") + "font-size: " + this.convertToPt(maximumCharHeight) + "pt;");
			}
		}
	}
	return parentElement;
};
GrahaHwpX2HtmlConverter.prototype.prepare = function() {
	var _this = this;
	return new Promise(function(resolve, reject) {
		window.setTimeout(function() {
			_this.pdfProperties = _this.getPdfProperties();
			_this.header = _this.getHeader();
			var htmlElement = _this.sections();
			var pageLayout = _this.getPageLayout();
			if(pageLayout != null) {
				if(pageLayout.pageWidth && pageLayout.pageWidth != null) {
					pageLayout.pageWidth = _this.convertToPt(pageLayout.pageWidth) + "pt";
				}
				if(pageLayout.pageHeight && pageLayout.pageHeight != null) {
					pageLayout.pageHeight = _this.convertToPt(pageLayout.pageHeight) + "pt";
				}
			}
			resolve({
				htmlElement: htmlElement,
				pdfProperties: _this.pdfProperties,
				htmlConverterWrapper: _this.htmlConverterWrapper,
				pageLayout: pageLayout,
				binary: _this.hwpXBinary,
				overflow: _this.overflow,
				scaleRatio: _this.scaleRatio
			});
		}, 10);
	});
};
