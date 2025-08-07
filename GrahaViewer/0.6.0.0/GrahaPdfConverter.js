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
 * GrahaPdfConverter
 * odt 혹은 hwpx 로부터 만들어진 HTML 을 PDF 로 변경한다.

 * GrahaPdfConverter 전체적인 사용법은 README.md 를 참조한다.

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.6.0.0
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.6.0.0
 */

function GrahaPdfConverter(options) {
	if(arguments.length > 0) {
		this.init(options);
	} else {
		this.init();
	}
}
GrahaPdfConverter.prototype.init = function(options) {
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
		this.fontFamilyConverter = GrahaPdfConverter.defaultFontFamilyConverter;
	}
	if(arguments.length > 0 && options != null && options.format && options.format != null) {
		this.format = options.format;
	} else {
		this.format = "pdf";
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
};
GrahaPdfConverter.prototype.pdf = function() {
	var _this = this;
	return new Promise(function(resolve, reject) {
		if(_this.currentFormat == "html") {
			_this.split();
		}
		if(_this.currentFormat == "splitted" || _this.currentFormat == "pdf") {
			_this.prepareFont(_this.htmlElement, _this.pdfProperties).then(function(data) {
				_this.currentFormat = "pdf";
				resolve(data);
			}).catch(function(error) {
				console.error(error);
				reject(error);
			});
		}
	});
};
GrahaPdfConverter.prototype.getValueStripUnit = function(value, unit) {
	return GrahaPdfConverterUtility.getValueStripUnit(value, unit);
};
GrahaPdfConverter.prototype.getUnit = function(value) {
	return GrahaPdfConverterUtility.getUnit(value);
};
GrahaPdfConverter.prototype.loadFontFromUrl = function(font) {
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
GrahaPdfConverter.prototype.prepareFont = function(htmlElement, pdfProperties) {
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
GrahaPdfConverter.prototype.preparePdf = function(fonts, htmlElement, pdfProperties) {
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
							pageHeight = GrahaPdfConverterUtility.floorWith(pageHeight, 2);
							pageWidth = GrahaPdfConverterUtility.floorWith(pageWidth, 2);
						} else if(unit == "pt" || unit == "px" || unit == "mm") {
							pageHeight = GrahaPdfConverterUtility.floorWith(pageHeight, 1);
							pageWidth = GrahaPdfConverterUtility.floorWith(pageWidth, 1);
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
//			console.log(doc.getFontList());
//			window.open(doc.output('bloburl'));
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

GrahaPdfConverter.prototype.finilize = function(doc, options, sourceElement, margin, scaleRatio, canvasHeight, canvasWidth) {
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
GrahaPdfConverter.prototype.setOutputFileName = function(fileName) {
	this.outputFileName = fileName;
};
GrahaPdfConverter.prototype.getOutputFileName = function(fileName) {
	return this.outputFileName;
};
GrahaPdfConverter.prototype.setDownloadFileName = function(fileName) {
	this.downloadFileName = fileName;
};
GrahaPdfConverter.prototype.getDownloadFileName = function() {
	return this.downloadFileName;
};
GrahaPdfConverter.prototype.getDownloadMimeType = function() {
//	if(this.fileFormat == "odt") {
	if(this.fileFormat == "hwpx") {
		return "application/hwp+zip";
	} else {
		return "application/vnd.oasis.opendocument.text";
	}
};
GrahaPdfConverter.prototype.split = function() {
	if(this.currentFormat == "html") {
		if(this.fileFormat == "odt") {
			var splitter = new GrahaOdtPageSplitter({scaleRatio: this.scaleRatio, pageLayout: this.pageLayout}, this.htmlConverterWrapper);
			splitter.split();
		}
		this.currentFormat = "splitted";
	}
};
GrahaPdfConverter.prototype.getHtmlConverter = function() {
	if(this.fileFormat == "hwpx") {
		return new GrahaHwpX2HtmlConverter();
	} else {
		return new GrahaOdt2HtmlConverter();
	}
};
GrahaPdfConverter.prototype.prepareConvert = function(options) {
	if(options && options != null && options.fontFamilyConverter && options.fontFamilyConverter != null) {
		this.fontFamilyConverter = options.fontFamilyConverter;
	} else {
		if(this.fontFamilyConverter && this.fontFamilyConverter != null) {
		} else {
			this.fontFamilyConverter = GrahaPdfConverter.defaultFontFamilyConverter;
		}
	}
	if(options && options != null && options.format && options.format != null) {
		this.format = options.format;
	} else {
		if(this.format && this.format != null) {
		} else {
			this.format = "pdf";
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
GrahaPdfConverter.prototype.convertFromOdtContentsUrl = function(metaUrl, headerUrl, contentUrl, options) {
	this.prepareConvert(options);
	var htmlConverter = this.getHtmlConverter();
	var _this = this;
	return new Promise(function(resolve, reject) {
		htmlConverter.convertFromContentsUrl(metaUrl, headerUrl, contentUrl, {
			defaultFontFamily: _this.defaultFontFamily,
			fontFamilyConverter: _this.fontFamilyConverter,
			adjustScale: _this.adjustScale
		}).then(function(data) {
			_this.currentFormat = "html";
			_this.htmlElement = data.htmlElement;
			_this.pdfProperties = data.pdfProperties;
			_this.htmlConverterWrapper = data.htmlConverterWrapper;
			_this.pageLayout = data.pageLayout;
			_this.binary = data.binary;
			_this.overflow = data.overflow;
			_this.scaleRatio = data.scaleRatio;
			
			if(_this.format == "splitted" || _this.format == "pdf") {
				_this.split();
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
			} else {
				resolve(data);
			}
		}).catch(function(error) {
			console.error(error);
			reject(error);
		});
	});
};
GrahaPdfConverter.prototype.convertFromOdtContents = function(meta, header, content, options) {
	this.prepareConvert(options);
	var htmlConverter = this.getHtmlConverter();
	var _this = this;
	return new Promise(function(resolve, reject) {
		htmlConverter.convertFromContents(meta, header, content, {
			defaultFontFamily: _this.defaultFontFamily,
			fontFamilyConverter: _this.fontFamilyConverter,
			adjustScale: _this.adjustScale
		}).then(function(data) {
			_this.currentFormat = "html";
			_this.htmlElement = data.htmlElement;
			_this.pdfProperties = data.pdfProperties;
			_this.htmlConverterWrapper = data.htmlConverterWrapper;
			_this.pageLayout = data.pageLayout;
			_this.binary = data.binary;
			_this.overflow = data.overflow;
			_this.scaleRatio = data.scaleRatio;
			if(_this.format == "splitted" || _this.format == "pdf") {
				_this.split();
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
			} else {
				resolve(data);
			}
		}).catch(function(error) {
			console.error(error);
			reject(error);
		});
	});
};
GrahaPdfConverter.prototype.convertFromOdtFile = function(file, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.fileFormat = "odt";
	return this.convertFromFile(file, options);
};
GrahaPdfConverter.prototype.convertFromHwpXFile = function(file, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.fileFormat = "hwpx";
	return this.convertFromFile(file, options);
};
GrahaPdfConverter.prototype.convertFromFile = function(file, options) {
	if(options && options != null) {
	} else {
		options = {};
	}
	if(options.outputFileName && options.outputFileName != null) {
	} else {
		if(file.name && file.name != null && file.name.lastIndexOf(".") > 0) {
			var odtFileName = file.name;
			var pdfFileName = null;
			var fileExtension = null;
			if(odtFileName.lastIndexOf(".") > 0) {
				pdfFileName = odtFileName.substring(0, odtFileName.lastIndexOf(".")) + ".pdf";
				fileExtension = odtFileName.substring(odtFileName.lastIndexOf(".") + 1);
			} else {
				pdfFileName = odtFileName + ".pdf";
				if(options.fileFormat && options.fileFormat != null) {
					odtFileName = odtFileName + "." + options.fileFormat;
				}
			}
			options.outputFileName = pdfFileName;
			if(options.fileFormat && options.fileFormat != null) {
			} else if(fileExtension != null) {
				options.fileFormat = fileExtension;
			}
			if(options.downloadFileName && options.downloadFileName != null) {
			} else {
				options.downloadFileName = odtFileName;
			}
		}
	}
	this.prepareConvert(options);
	var htmlConverter = this.getHtmlConverter();
	var _this = this;
	return new Promise(function(resolve, reject) {
		htmlConverter.convertFromFile(file, {
			defaultFontFamily: _this.defaultFontFamily,
			fontFamilyConverter: _this.fontFamilyConverter,
			adjustScale: _this.adjustScale
		}).then(function(data) {
			_this.currentFormat = "html";
			_this.htmlElement = data.htmlElement;
			_this.pdfProperties = data.pdfProperties;
			_this.htmlConverterWrapper = data.htmlConverterWrapper;
			_this.pageLayout = data.pageLayout;
			_this.binary = data.binary;
			_this.overflow = data.overflow;
			_this.scaleRatio = data.scaleRatio;
			if(_this.format == "splitted" || _this.format == "pdf") {
				_this.split();
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
			} else {
				resolve(data);
			}
		}).catch(function(error) {
			console.error(error);
			reject(error);
		});
	});
};
GrahaPdfConverter.prototype.convertFromOdtBlob = function(blob, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.fileFormat = "odt";
	return this.convertFromBlob(blob, options);
};
GrahaPdfConverter.prototype.convertFromHwpXBlob = function(blob, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.fileFormat = "hwpx";
	return this.convertFromBlob(blob, options);
};
GrahaPdfConverter.prototype.convertFromBlob = function(blob, options) {
	this.prepareConvert(options);
	var htmlConverter = this.getHtmlConverter();
	var _this = this;
	return new Promise(function(resolve, reject) {
		htmlConverter.convertFromBlob(blob, {
			defaultFontFamily: _this.defaultFontFamily,
			fontFamilyConverter: _this.fontFamilyConverter,
			adjustScale: _this.adjustScale
		}).then(function(data) {
			_this.currentFormat = "html";
			_this.htmlElement = data.htmlElement;
			_this.pdfProperties = data.pdfProperties;
			_this.htmlConverterWrapper = data.htmlConverterWrapper;
			_this.pageLayout = data.pageLayout;
			_this.binary = data.binary;
			_this.overflow = data.overflow;
			_this.scaleRatio = data.scaleRatio;
			if(_this.format == "splitted" || _this.format == "pdf") {
				_this.split();
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
			} else {
				resolve(data);
			}
		}).catch(function(error) {
			console.error(error);
			reject(error);
		});
	});
};
GrahaPdfConverter.prototype.convertFromOdtUrl = function(url, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.fileFormat = "odt";
	return this.convertFromUrl(url, options);
};
GrahaPdfConverter.prototype.convertFromHwpXUrl = function(url, options) {
	if(arguments.length > 1 && options && options != null) {
	} else {
		options = {};
	}
	options.fileFormat = "hwpx";
	return this.convertFromUrl(url, options);
};
GrahaPdfConverter.prototype.convertFromUrl = function(url, options) {
	if(options && options != null) {
	} else {
		options = {};
	}
	if(options.outputFileName && options.outputFileName != null) {
	} else {
		var odtUrl = null;
		if(url.lastIndexOf("?") > 0) {
			odtUrl = url.substring(0, url.lastIndexOf("?"));
		} else {
			odtUrl = url;
		}
		if(odtUrl.lastIndexOf("/") > 0) {
			var odtFileName = decodeURIComponent(odtUrl.substring(odtUrl.lastIndexOf("/") + 1));
			var pdfFileName = null;
			var fileExtension = null;
			if(odtFileName.lastIndexOf(".") > 0) {
				pdfFileName = odtFileName.substring(0, odtFileName.lastIndexOf(".")) + ".pdf";
				fileExtension = odtFileName.substring(odtFileName.lastIndexOf(".") + 1);
			} else {
				pdfFileName = odtFileName + ".pdf";
				if(options.fileFormat && options.fileFormat != null) {
					odtFileName = odtFileName + "." + options.fileFormat;
				}
			}
			options.outputFileName = pdfFileName;
			if(options.fileFormat && options.fileFormat != null) {
			} else if(fileExtension != null) {
				options.fileFormat = fileExtension;
			}
			if(options.downloadFileName && options.downloadFileName != null) {
			} else {
				options.downloadFileName = odtFileName;
			}
		}
	}
	this.prepareConvert(options);
	var htmlConverter = this.getHtmlConverter();
	var _this = this;
	return new Promise(function(resolve, reject) {
		htmlConverter.convertFromUrl(url, {
			defaultFontFamily: _this.defaultFontFamily,
			fontFamilyConverter: _this.fontFamilyConverter,
			adjustScale: _this.adjustScale
		}).then(function(data) {
			_this.currentFormat = "html";
			_this.htmlElement = data.htmlElement;
			_this.pdfProperties = data.pdfProperties;
			_this.htmlConverterWrapper = data.htmlConverterWrapper;
			_this.pageLayout = data.pageLayout;
			_this.binary = data.binary;
			_this.overflow = data.overflow;
			_this.scaleRatio = data.scaleRatio;
			if(_this.format == "splitted" || _this.format == "pdf") {
				_this.split();
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
			} else {
				resolve(data);
			}
		}).catch(function(error) {
			console.error(error);
			reject(error);
		});
	});
};
GrahaPdfConverter.prototype.defaultFontFamily = function() {
	this.defaultFontFamily = null;
	if(this.fonts && this.fonts != null && Array.isArray(this.fonts) && this.fonts.length > 0) {
		this.defaultFontFamily = this.fonts[0].family;
	}
};
GrahaPdfConverter.prototype.setFonts = function(fonts) {
	this.fonts = fonts;
};
GrahaPdfConverter.defaultFontFamilyConverter = function(fontFamily, defaultFontFamily) {
	return GrahaPdfConverterUtility.defaultFontFamilyConverter(fontFamily, defaultFontFamily);
};
GrahaPdfConverter.prototype.defaultFonts = function() {
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
GrahaPdfConverter.prototype.getBinary = function() {
	if(this.binary && this.binary != null) {
		if(this.binary instanceof Blob) {
			return this.binary;
		} else if(this.binary instanceof ArrayBuffer) {
			return new Blob([this.binary]);
		} else {
			throw new Error("this.binary is not Blob and ArrayBuffer");
		}
	}
	return null;
};
GrahaPdfConverter.prototype.downloadable = function() {
	var binary = this.getBinary();
	if(binary != null) {
		return true;
	}
	return false;
};
GrahaPdfConverter.prototype.download = function() {
	var _this = this;
	return new Promise(function(resolve, reject) {
		if(window.navigator && window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(_this.getBinary(), _this.getDownloadFileName());
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
		var blobUrl = URL.createObjectURL(_this.getBinary(), {type: _this.getDownloadMimeType()});
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
	});
};
GrahaPdfConverter.prototype.getWrapperSelector = function() {
	if(this.htmlConverterWrapper && this.htmlConverterWrapper != null) {
		return this.htmlConverterWrapper.getWrapperSelector();
	}
	return null;
};
GrahaPdfConverter.prototype.getScaleWrapperSelector = function() {
	if(this.htmlConverterWrapper && this.htmlConverterWrapper != null) {
		return this.htmlConverterWrapper.getScaleWrapperSelector();
	}
	return null;
};
GrahaPdfConverter.prototype.applyScale = function(node) {
	if(this.adjustScale && this.scaleRatio && this.scaleRatio != null && this.scaleRatio < 1) {
		if(arguments.length > 0) {
			node.css("transform", "scale(" + this.scaleRatio + ")");
		} else {
			$(this.getWrapperSelector()).css("transform", "scale(" + this.scaleRatio + ")");;
		}
		var scaleWrapperSelector = this.getScaleWrapperSelector();
		if(scaleWrapperSelector != null) {
			var scaledOuterWidth = $(this.htmlElement).outerWidth(true) * this.scaleRatio;
			$(scaleWrapperSelector).outerWidth(scaledOuterWidth);
			
			var scaledOuterHeight = $(this.htmlElement).outerHeight(true) * this.scaleRatio;
			$(scaleWrapperSelector).outerHeight(scaledOuterHeight);
		}
	}
};
GrahaPdfConverter.prototype.resetScale = function(node) {
	if(this.adjustScale && this.scaleRatio && this.scaleRatio != null && this.scaleRatio < 1) {
		if(arguments.length > 0) {
			node.css("transform", "scale(1)");
		} else {
			$(this.getWrapperSelector()).css("transform", "scale(1)");
		}
		var scaleWrapperSelector = this.getScaleWrapperSelector();
		if(scaleWrapperSelector != null) {
			var scaledOuterWidth = $(this.htmlElement).outerWidth(true);
			$(scaleWrapperSelector).outerWidth(scaledOuterWidth);
			
			var scaledOuterHeight = $(this.htmlElement).outerHeight(true);
			$(scaleWrapperSelector).outerHeight(scaledOuterHeight);
		}
	}
};