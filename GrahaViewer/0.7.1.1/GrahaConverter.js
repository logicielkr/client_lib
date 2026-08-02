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
 * GrahaConverter
 * odt 혹은 hwpx 로부터 만들어진 HTML 을 PDF 로 변경한다.

 * GrahaConverter 전체적인 사용법은 README.md 를 참조한다.
 
 * 0.7.0.0 에서 GrahaPdfConverter 에서 GrahaConverter 로 변경되었다.

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.7.1.1
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.7.1.1
 */

function GrahaConverter(options) {
	if(arguments.length > 0) {
		this.init(options);
	} else {
		this.init();
	}
}
GrahaConverter.prototype.init = function(options) {
	if(arguments.length > 0 && options != null && options.fonts && options.fonts != null) {
		this.setFonts(options.fonts);
	} else {
		this.setFonts(this.defaultFonts());
	}
	if(arguments.length > 0 && options != null && options.defaultFontFamily && options.defaultFontFamily != null) {
		this.defaultFontFamily = options.defaultFontFamily;
	} else {
		this.defaultFontFamily();
	}
	if(arguments.length > 0 && options != null && options.fontFamilyConverter && options.fontFamilyConverter != null) {
		this.fontFamilyConverter = options.fontFamilyConverter;
	} else {
		this.fontFamilyConverter = GrahaConverter.defaultFontFamilyConverter;
	}
	if(arguments.length > 0 && options != null && options.format && options.format != null) {
		this.format = options.format;
	} else {
		this.format = "splitted";
	}
	if(arguments.length > 0 && options != null && options.adjustScale && options.adjustScale != null) {
		this.adjustScale = options.adjustScale;
	} else {
		this.adjustScale = false;
	}
	if(arguments.length > 0 && options != null && options.fileFormat && options.fileFormat != null) {
		this.fileFormat = options.fileFormat;
	} else {
		this.fileFormat = "odt";
	}
	this.htmlConverter = null;
};
GrahaConverter.prototype.pdf = function() {
	var _this = this;
	return new Promise(function(resolve, reject) {
		_this.split().then(function(result) {
			if(_this.currentFormat == "splitted" || _this.currentFormat == "pdf") {
				_this.prepareFont(_this.htmlElement, _this.pdfProperties).then(function(data) {
					_this.currentFormat = "pdf";
					resolve(data);
				}).catch(function(error) {
					console.error(error);
					reject(error);
				});
			}
		}).catch(function(error) {
			console.error(error);
			reject(error);
		});
	});
};
GrahaConverter.prototype.getValueStripUnit = function(value, unit) {
	return GrahaConverterUtility.getValueStripUnit(value, unit);
};
GrahaConverter.prototype.getUnit = function(value) {
	return GrahaConverterUtility.getUnit(value);
};
GrahaConverter.prototype.loadFontFromUrl = function(font) {
	var ttfFileName = font.truetype.substring(font.truetype.lastIndexOf("/") + 1);
	var fontStyle = "normal";
	var fontWeight = "normal";
	if(font.weight && font.weight != null) {
		fontWeight = font.weight;
	}
	if(font.style && font.style != null) {
		fontStyle = font.style;
	}
	$.ajaxSetup({ cache: true});
	return new Promise(function(resolve, reject) {
		$.ajax({
			url: font.truetype,
			cache: true,
			xhrFields: {
				responseType: "blob"
			},
			success: function(data, textStatus, jqXHR) {
				var reader = new FileReader();
				reader.onload = function() {
					resolve({
						url: font.truetype,
						ttfFileName: ttfFileName,
						fontFamily: font.family,
						fontStyle: fontStyle,
						fontWeight: fontWeight,
						fontData: reader.result.substring(21)
					});
				}
				reader.onerror = function(error) {
					console.error(error);
					reject(error);
				}
				reader.readAsDataURL(data);
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
GrahaConverter.prototype.prepareFont = function(htmlElement, pdfProperties) {
	var fonts = new Array();
	if(this.fonts && this.fonts != null && Array.isArray(this.fonts) && this.fonts.length > 0) {
		for(var i = 0; i < this.fonts.length; i++) {
			fonts.push(this.loadFontFromUrl(this.fonts[i]));
		}
		var _this = this;
		return new Promise(function(resolve, reject) {
			Promise.all(fonts).then(function(values) {
				_this.preparePdf(values, htmlElement, pdfProperties).then(function(data) {
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
	} else {
		var _this = this;
		return new Promise(function(resolve, reject) {
			_this.preparePdf(null, htmlElement, pdfProperties).then(function(data) {
				resolve(data);
			}).catch(function(error) {
				console.error(error);
				reject(error);
			});
		});
	}
};
GrahaConverter.prototype.preparePdf = function(fonts, htmlElement, pdfProperties) {
	if (!window.jsPDF) window.jsPDF = window.jspdf.jsPDF;
	var options = {
		orientation: "p",
		unit: "cm",
		format: "a4",
		putOnlyUsedFonts: true,
		compress: true
		, hotfixes: ["px_scaling"]
	};
	if(this.pageLayout && this.pageLayout != null) {
		if(this.pageLayout.pageOrientation && this.pageLayout.pageOrientation != null) {
			options.orientation = this.pageLayout.pageOrientation;
		}
		if(this.pageLayout.pageWidth && this.pageLayout.pageWidth != null && this.pageLayout.pageHeight && this.pageLayout.pageHeight != null) {
			var unit = this.getUnit(this.pageLayout.pageWidth);
			if(unit != null) {
				options.unit = unit;
				var pageWidth = this.getValueStripUnit(this.pageLayout.pageWidth, unit);
				if(pageWidth != null) {
					var pageHeight = this.getValueStripUnit(this.pageLayout.pageHeight, unit);
					if(pageHeight != null) {
						if(unit == "cm") {
							pageHeight = GrahaConverterUtility.floorWith(pageHeight, 2);
							pageWidth = GrahaConverterUtility.floorWith(pageWidth, 2);
						} else if(unit == "pt" || unit == "px" || unit == "mm") {
							pageHeight = GrahaConverterUtility.floorWith(pageHeight, 1);
							pageWidth = GrahaConverterUtility.floorWith(pageWidth, 1);
						}
						options.format = [pageWidth, pageHeight];
					} else {
						console.error(this.pageLayout.pageWidth);
						console.error(this.pageLayout.pageHeight);
						console.error(unit);
					}
				} else {
					console.error(this.pageLayout.pageWidth);
					console.error(unit);
				}
			} else {
				console.error(this.pageLayout.pageWidth);
				console.error(unit);
			}
		}
	}
	var doc = null;
	var unitWidth = 1;
	var ptWidth = 1;
	if(options.unit != "pt") {
		doc = new jsPDF({
			orientation: options.orientation,
			unit: options.unit,
			format: "a4"
			, hotfixes: ["px_scaling"]
		});
		unitWidth = doc.internal.pageSize.width;
		doc = new jsPDF({
			orientation: options.orientation,
			unit: "px",
//			unit: "pt",
			format: "a4"
			, hotfixes: ["px_scaling"]
		});
		ptWidth = doc.internal.pageSize.width;
	}
	if(options.format != null && Array.isArray(options.format)) {
		for(var i = 0; i < options.format.length; i++) {
			options.format[i] = options.format[i] * ptWidth / unitWidth;
		}
	}
	options.unit = "px";
//	options.unit = "pt";
	doc = new jsPDF(options);
	if(pdfProperties != null) {
		doc.setProperties(pdfProperties);
	}
	doc.setLanguage("ko-KR");
	if(fonts != null && Array.isArray(fonts) && fonts.length > 0) {
		for(var i = 0; i < fonts.length; i++) {
			var font = fonts[i];
			doc.addFileToVFS(font.ttfFileName, font.fontData);
			doc.addFont(font.ttfFileName, font.fontFamily, font.fontStyle, font.fontWeight);
		}
	}
	doc.setFont(this.defaultFontFamily);
	var computedStyleWidth = $(htmlElement).outerWidth();
	var computedStyleHeight = $(htmlElement).outerHeight(true);
	var widthScale = doc.internal.pageSize.width/computedStyleWidth;
	var heightScale = doc.internal.pageSize.height/computedStyleHeight;
	var scaleRatio = widthScale;
	var margin = [0,0,0,0];
	var sourceElement = htmlElement;
	computedStyleHeight = 0;
	for(var i = sourceElement.childNodes.length - 1; i >= 0; i--) {
		if(sourceElement.childNodes[i].nodeName == "P") {
			computedStyleHeight += Math.floor($(sourceElement.childNodes[i]).outerHeight());
		}
	}
	var canvasWidth = Math.floor(computedStyleWidth);
	var canvasHeight = Math.floor(computedStyleHeight);

	var _this = this;
	return new Promise(function(resolve, reject) {
		_this.finilize(doc, options, sourceElement, margin, scaleRatio, canvasHeight, canvasWidth).then(function(pdf) {
			doc.save(_this.outputFileName);
			doc = new jsPDF();
			doc = null;
			resolve(doc);
		}).catch(function(error) {
			console.error(error);
			reject(error);
		});
	});
};
GrahaConverter.prototype.finilize = function(doc, options, sourceElement, margin, scaleRatio, canvasHeight, canvasWidth) {
	var _this = this;
	return new Promise(function(resolve, reject) {
		doc.html(sourceElement, {
			callback: function(pdf) {
				resolve(pdf);
			},
			jsPDF: doc,
			x: 0,
			y: 0,
			margin: margin,
			autoPaging: "text",
			html2canvas: {
				scale: scaleRatio,
				x: 0
				, y: 0
				, height: canvasHeight
				, width: canvasWidth
				, onclone: function(canvas, element) {
					var extraBorderWidth = 0;
					if(_this.htmlConverterWrapper && _this.htmlConverterWrapper != null) {
						var styles = _this.htmlConverterWrapper.getWrapperStyles();
						if(styles != null && styles.length > 0) {
							for(var i = 0; i < styles.length; i++) {
								_this.htmlConverterWrapper.appendStyle(element, styles[i].cloneNode(true));
							}
						}
					}
					$(element).find("p.graha_page").each(function() {
						$(this).css("border-bottom", "none");
						$(this).css("margin", "0px");
						$(this).css("overflow", "hidden");
					});
					$(element).find(_this.htmlConverterWrapper.getWrapper()).each(function() {
						var outerHeight = Math.floor($(this).outerHeight() - extraBorderWidth);
						$(this).outerHeight(outerHeight);
						$(this).css("overflow", "hidden");
						$(this).css("margin", "0px");
						if(_this.adjustScale) {
							$(this).css("transform", "scale(1)");
						}
					});
				}
				, onrendered: function (canvas) {
//					console.log(canvas);
				}
			}
		});
	});
};
GrahaConverter.prototype.setMimeType = function(mimeType) {
	this.mimeType = mimeType;
};
GrahaConverter.prototype.setOutputFileName = function(fileName) {
	this.outputFileName = fileName;
};
GrahaConverter.prototype.getOutputFileName = function(fileName) {
	return this.outputFileName;
};
GrahaConverter.prototype.setDownloadFileName = function(fileName) {
	this.downloadFileName = fileName;
};
GrahaConverter.prototype.getDownloadFileName = function() {
	return this.downloadFileName;
};
GrahaConverter.prototype.getDownloadMimeType = function() {
	if(this.mimeType && this.mimeType != null) {
		return this.mimeType;
	}
	
	console.error("this.mimeType is null");
	
	if(this.fileFormat == "hwpx") {
		return "application/hwp+zip";
	} else {
		return "application/vnd.oasis.opendocument.text";
	}
};
GrahaConverter.prototype.split = function() {
	var _this = this;
	return new Promise(function(resolve, reject) {
		if(_this.currentFormat == "html") {
			if(_this.fileFormat == "odt") {
				if(_this.htmlConverter == null) {
					reject("this.htmlConverter is null");
				} else {
					_this.htmlConverter.split().then(function(result) {
						_this.currentFormat = "splitted";
						resolve(true);
					}).catch(function(error) {
						console.error(error);
						reject(error);
					});
				}
			} else {
				_this.currentFormat = "splitted";
				resolve(true);
			}
		} else {
			resolve(true);
		}
	});
};
GrahaConverter.prototype.getHtmlConverter = function() {
	if(this.fileFormat == "hwpx") {
		this.htmlConverter = new GrahaHwpX2HtmlConverter();
	} else {
		this.htmlConverter = new GrahaOdt2HtmlConverter();
	}
	return this.htmlConverter;
};
GrahaConverter.prototype.prepareConvert = function(options) {
	if(options && options != null && options.fontFamilyConverter && options.fontFamilyConverter != null) {
		this.fontFamilyConverter = options.fontFamilyConverter;
	} else {
		if(this.fontFamilyConverter && this.fontFamilyConverter != null) {
		} else {
			this.fontFamilyConverter = GrahaConverter.defaultFontFamilyConverter;
		}
	}
	if(options && options != null && options.format && options.format != null) {
		this.format = options.format;
	} else {
		if(this.format && this.format != null) {
		} else {
			this.format = "splitted";
		}
	}
	if(options && options != null && options.adjustScale && options.adjustScale != null) {
		this.adjustScale = options.adjustScale;
	} else {
		if(this.adjustScale && this.adjustScale != null) {
		} else {
			this.adjustScale = false;
		}
	}
	if(options && options != null && options.fileFormat && options.fileFormat != null) {
		this.fileFormat = options.fileFormat;
	} else {
		if(this.fileFormat && this.fileFormat != null) {
		} else {
			this.fileFormat = "odt";
		}
	}
	if(options && options != null && options.mimeType && options.mimeType != null) {
		this.setMimeType(options.mimeType);
	} else {
		if(this.fileFormat == "odt") {
			this.setMimeType("application/vnd.oasis.opendocument.text");
		} else if(this.fileFormat == "hwpx") {
			this.setMimeType("application/hwp+zip");
		}
	}
	if(options && options != null && options.outputFileName && options.outputFileName != null) {
		this.setOutputFileName(options.outputFileName);
	} else {
		if(options && options != null && options.downloadFileName && options.downloadFileName != null) {
			if(options.downloadFileName.lastIndexOf(".") > 0) {
				this.setOutputFileName(options.downloadFileName.substring(0, options.downloadFileName.lastIndexOf(".")) + ".pdf");
			} else {
				this.setOutputFileName(options.downloadFileName + ".pdf");
			}
		} else {
			this.setOutputFileName("demo.pdf");
		}
	}
	if(options && options != null && options.downloadFileName && options.downloadFileName != null) {
		this.setDownloadFileName(options.downloadFileName);
	} else {
		if(options && options != null && options.outputFileName && options.outputFileName != null) {
			if(options.outputFileName.lastIndexOf(".") > 0) {
				this.setOutputFileName(options.outputFileName.substring(0, options.outputFileName.lastIndexOf(".")) + ".pdf");
			} else {
				this.setOutputFileName(options.outputFileName + ".pdf");
			}
		} else {
			if(this.fileFormat && this.fileFormat != null) {
				this.setDownloadFileName("demo." + this.fileFormat);
			} else {
				this.setDownloadFileName("demo.odt");
			}
		}
	}
};
GrahaConverter.prototype.convertFromOdtContentsUrl = function(metaUrl, headerUrl, contentUrl, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.fileFormat = "odt";
	options.sourceType = "contentsUrl";
	return this.convert([metaUrl, headerUrl, contentUrl], options);
};
GrahaConverter.prototype.convertFromOdtContents = function(meta, header, content, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.fileFormat = "odt";
	options.sourceType = "contents";
	return this.convert([meta, header, content], options);
};
GrahaConverter.prototype.convertFromOdtFile = function(file, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.fileFormat = "odt";
	return this.convertFromFile(file, options);
};
GrahaConverter.prototype.convertFromHwpXFile = function(file, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.fileFormat = "hwpx";
	return this.convertFromFile(file, options);
};
GrahaConverter.fileName = function(source) {
	var fileName = null;
	if(source && source != null) {
		if(typeof(source) == "string") {
			var url = null;
			if(source.lastIndexOf("?") > 0) {
				url = source.substring(0, source.lastIndexOf("?"));
			} else {
				url = source;
			}
			if(url.lastIndexOf("/") > 0) {
				fileName = decodeURIComponent(url.substring(url.lastIndexOf("/") + 1));
			}
		} else if(source.name && source.name != null) {
			fileName = source.name;
		}
	}
	return fileName;
};
GrahaConverter.detectFileName = function(source, options) {
	var fileName = null;
	if(options && options != null && options.fileName && options.fileName != null) {
		fileName = options.fileName;
	} else if(source && source != null) {
		fileName = GrahaConverter.fileName(source);
	} else if(options && options != null && options.downloadFileName && options.downloadFileName != null) {
		fileName = options.downloadFileName;
	} else if(options && options != null && options.outputFileName && options.outputFileName != null) {
		fileName = options.outputFileName;
	}
	if(fileName != null) {
		if(options && options != null) {
		} else {
			options = {};
		}
		var pdfFileName = null;
		var fileExtension = null;
		if(fileName.lastIndexOf(".") > 0) {
			pdfFileName = fileName.substring(0, fileName.lastIndexOf(".")) + ".pdf";
			fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
		} else {
			pdfFileName = fileName + ".pdf";
			if(options.fileFormat && options.fileFormat != null) {
				fileName = fileName + "." + options.fileFormat;
			}
		}
		if(options.outputFileName && options.outputFileName != null) {
		} else {
			options.outputFileName = pdfFileName;
		}
		if(options.fileFormat && options.fileFormat != null) {
		} else if(fileExtension != null && fileExtension != "pdf") {
			options.fileFormat = fileExtension;
		}
		if(options.downloadFileName && options.downloadFileName != null) {
		} else {
			if(fileExtension == null) {
				options.downloadFileName = fileName;
			} else if(fileExtension == "pdf") {
				options.downloadFileName = fileName.substring(0, fileName.lastIndexOf("."));
			} else {
				options.downloadFileName = fileName;
			}
		}
	}
	if(options.outputFileName && options.outputFileName != null) {
	} else {
		options.downloadFileName = "demo.pdf";
	}
	if(options.downloadFileName && options.downloadFileName != null) {
	} else {
		if(options && options != null && options.fileFormat && options.fileFormat != null) {
			options.downloadFileName = "demo" + options.fileFormat;
		} else {
			options.downloadFileName = "demo";
		}
	}
};
GrahaConverter.prototype.convertFromFile = function(file, options) {
	if(options && options != null) {
	} else {
		options = {};
	}
	GrahaConverter.detectFileName(file, options);
	options.sourceType = "file";
	return this.convert(file, options);
};
GrahaConverter.prototype.convertFromOdtBlob = function(blob, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.fileFormat = "odt";
	return this.convertFromBlob(blob, options);
};
GrahaConverter.prototype.convertFromHwpXBlob = function(blob, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.fileFormat = "hwpx";
	return this.convertFromBlob(blob, options);
};
GrahaConverter.prototype.convert = function(source, options) {
	this.prepareConvert(options);
	var htmlConverter = this.getHtmlConverter();
	var _this = this;
	return new Promise(function(resolve, reject) {
		htmlConverter.convert(source, {
			defaultFontFamily: _this.defaultFontFamily,
			fontFamilyConverter: _this.fontFamilyConverter,
			adjustScale: _this.adjustScale,
			sourceType: options.sourceType
		}).then(function(data) {
			_this.currentFormat = "html";
			_this.htmlElement = data.htmlElement;
			_this.pdfProperties = data.pdfProperties;
			_this.htmlConverterWrapper = data.htmlConverterWrapper;
			_this.pageLayout = data.pageLayout;
			_this.binary = data.binary;
			_this.zip = data.zip;
			_this.overflow = data.overflow;
			_this.scaleRatio = data.scaleRatio;
			if(_this.format == "splitted" || _this.format == "pdf") {
				_this.split().then(function(result) {
					if(_this.format == "pdf") {
						_this.pdf().then(function(pdf) {
							resolve(pdf);
						}).catch(function(error) {
							console.error(error);
							reject(error);
						});
					} else {
						resolve(data);
					}
				}).catch(function(error) {
					reject(error);
				});
			} else {
				resolve(data);
			}
		}).catch(function(error) {
			console.error(error);
			reject(error);
		});
	});
};
GrahaConverter.prototype.convertFromBlob = function(blob, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.sourceType = "blob";
	GrahaConverter.detectFileName(null, options);
	return this.convert(blob, options);
};
GrahaConverter.prototype.convertFromOdtUrl = function(url, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.fileFormat = "odt";
	return this.convertFromUrl(url, options);
};
GrahaConverter.prototype.convertFromHwpXUrl = function(url, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.fileFormat = "hwpx";
	return this.convertFromUrl(url, options);
};
GrahaConverter.prototype.convertFromUrl = function(url, options) {
	if(options && options != null) {
	} else {
		options = {};
	}
	GrahaConverter.detectFileName(url, options);
	options.sourceType = "url";
	return this.convert(url, options);
};
GrahaConverter.prototype.defaultFontFamily = function() {
	this.defaultFontFamily = null;
	if(this.fonts && this.fonts != null && Array.isArray(this.fonts) && this.fonts.length > 0) {
		this.defaultFontFamily = this.fonts[0].family;
	}
};
GrahaConverter.prototype.setFonts = function(fonts) {
	this.fonts = fonts;
};
GrahaConverter.defaultFontFamilyConverter = function(fontFamily, defaultFontFamily) {
	return GrahaConverterUtility.defaultFontFamilyConverter(fontFamily, defaultFontFamily);
};
GrahaConverter.prototype.defaultFonts = function() {
	var fonts = new Array();
	fonts.push({
		family: "Nanum Gothic",
		truetype: "//cdn.jsdelivr.net/font-nanum/1.0/nanumgothic/v3/NanumGothic-Regular.ttf",
		weight: "400"
	});
	fonts.push({
		family: "Nanum Gothic",
		truetype: "//cdn.jsdelivr.net/font-nanum/1.0/nanumgothic/v3/NanumGothic-Bold.ttf",
		weight: "700"
	});
	fonts.push({
//		family: "Nanum Gothic ExtraBold",
		family: "Nanum Gothic",
		truetype: "//cdn.jsdelivr.net/font-nanum/1.0/nanumgothic/v3/NanumGothic-ExtraBold.ttf",
		weight: "800"
	});
	fonts.push({
		family: "Nanum Myeongjo",
		truetype: "//cdn.jsdelivr.net/font-nanum/1.0/nanummyeongjo/v2/NanumMyeongjo-Regular.ttf",
		weight: "400"
	});
	fonts.push({
		family: "Nanum Myeongjo",
		truetype: "//cdn.jsdelivr.net/font-nanum/1.0/nanummyeongjo/v2/NanumMyeongjo-Bold.ttf",
		weight: "700"
	});
	fonts.push({
//		family: "Nanum Myeongjo ExtraBold",
		family: "Nanum Myeongjo",
		truetype: "//cdn.jsdelivr.net/font-nanum/1.0/nanummyeongjo/v2/NanumMyeongjo-ExtraBold.ttf",
		weight: "800"
	});
	return fonts;
};
GrahaConverter.prototype.binaryFromZip = function(zip) {
	JSZip.support.nodebuffer = false;
	var legacy = false;
	if(typeof(iconv) != "undefined" && typeof(encode) == "function") {
		var userAgent = navigator.userAgent;
		if(userAgent.indexOf("Windows") > 0) {
			if(userAgent.indexOf("Windows NT") > 0) {
				var text = userAgent.substring(0, userAgent.indexOf(";"));
				if(parseFloat(text.substring(text.lastIndexOf(" ") + 1)) >= 10) {
				} else {
					var legacy = true;
				}
			} else {
				var legacy = true;
			}
		}
	}
	var _this = this;
	return new Promise(function(resolve, reject) {
		if(legacy) {
			zip.generateAsync({
				type : "blob",
				encodeFileName: function(str) {
					return iconv.encode(str, "EUC-KR");
				},
				mimeType: _this.mimeType
			}).then(function (blob) {
				resolve(blob);
			}).catch(function(error) {
				reject(error);
			});
		} else {
			zip.generateAsync({
				type : "blob",
				mimeType: _this.mimeType
			}).then(function (blob) {
				resolve(blob);
			}).catch(function(error) {
				reject(error);
			});
		}
	});	
};
GrahaConverter.prototype.getBinary = function() {
	var _this = this;
	return new Promise(function(resolve, reject) {
		if(_this.binary && _this.binary != null) {
			if(_this.binary instanceof Blob) {
				resolve(_this.binary);
			} else if(_this.binary instanceof ArrayBuffer) {
				resolve(new Blob([_this.binary]));
			} else {
				reject("_this.binary is not Blob and ArrayBuffer");
			}
		} if(_this.zip && _this.zip != null) {
			_this.binaryFromZip(_this.zip).then(function(blob) {
				_this.binary = blob;
				resolve(blob);
			}).catch(function(error) {
				reject(error);
			});
		} else {
			reject("_this.binary or this.zip is null");
		}
	});
};
GrahaConverter.prototype.downloadable = function() {
	if(this.zip && this.zip != null) {
		return true;
	}
	if(this.binary && this.binary != null) {
		if(this.binary instanceof Blob) {
			return true;
		} else if(this.binary instanceof ArrayBuffer) {
			return true;
		}
	}
	return false;
};
GrahaConverter.prototype.download = function() {
	var _this = this;
	return new Promise(function(resolve, reject) {
		_this.getBinary().then(function(blobBinary) {
			if(window.navigator && window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(blobBinary, _this.getDownloadFileName());
				resolve(true);
			}
			var URL = null;
			if(window.URL) {
				URL = window.URL;
			} else if(window.webkitURL) {
				URL = window.webkitURL;
			} else {
				reject("Web browser is not support window.URL and window.webkitURL");
			}
			var blobUrl = URL.createObjectURL(blobBinary, {type: _this.getDownloadMimeType()});
			var a = document.createElement("a");
			if(_this.getDownloadFileName() && typeof(a.download) != "undefined") {
				a.href = blobUrl;
				a.download = _this.getDownloadFileName();
				document.body.appendChild(a);
				a.click();
				URL.revokeObjectURL(blobUrl);
				resolve(true);
			} else {
				URL.revokeObjectURL(blobUrl);
				reject("Web browser is not support document.createElement(\"a\").download");
			}
		}).catch(function (error) {
			reject(error);
		});
	});
};
GrahaConverter.prototype.getWrapperSelector = function() {
	if(this.htmlConverterWrapper && this.htmlConverterWrapper != null) {
		return this.htmlConverterWrapper.getWrapperSelector();
	}
	return null;
};
GrahaConverter.prototype.getScaleWrapperSelector = function() {
	if(this.htmlConverterWrapper && this.htmlConverterWrapper != null) {
		return this.htmlConverterWrapper.getScaleWrapperSelector();
	}
	return null;
};
GrahaConverter.prototype.calScaleRatio = function() {
	var scaleRatio = this.htmlConverterWrapper.calScaleRatio();
	return this.htmlConverterWrapper.calScaleRatio();
};
GrahaConverter.prototype.applyScale = function(scaleRatio) {
	if(scaleRatio != this.scaleRatio) {
		this.htmlConverterWrapper.applyScale(scaleRatio);
		this.scaleRatio = scaleRatio;
	}
};
GrahaConverter.prototype.resetScale = function() {
	if(this.scaleRatio < 1) {
		this.htmlConverterWrapper.resetScale();
		this.scaleRatio = 1;
	}
};
GrahaConverter.prototype.clearAll = function() {
	if(this.htmlConverterWrapper != null) {
		this.htmlConverterWrapper.clearAll();
	}
};