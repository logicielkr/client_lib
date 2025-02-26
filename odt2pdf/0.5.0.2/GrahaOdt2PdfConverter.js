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
 * GrahaOdt2PdfConverter
 * GrahaOdt2HtmlConverter 와 GrahaOdtPageSplitter 로 만들어진 HTML 을 PDF 로 변경한다.

 * GrahaOdt2PdfConverter 전체적인 사용법은 README.md 를 참조한다.

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.5.0.2
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/odt2pdf/0.5.0.2
 */

function GrahaOdt2PdfConverter(options) {
	if(arguments.length > 0) {
		this.init(options);
	} else {
		this.init();
	}
}
GrahaOdt2PdfConverter.prototype.init = function(options) {
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
		this.fontFamilyConverter = GrahaOdt2PdfConverter.defaultFontFamilyConverter;
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
};
GrahaOdt2PdfConverter.prototype.pdf = function() {
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
GrahaOdt2PdfConverter.prototype.getValueStripUnit = function(value, unit) {
	return GrahaOdt2PdfConverterUtility.getValueStripUnit(value, unit);
};
GrahaOdt2PdfConverter.prototype.getUnit = function(value) {
	return GrahaOdt2PdfConverterUtility.getUnit(value);
};
GrahaOdt2PdfConverter.prototype.loadFontFromUrl = function(font) {
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
GrahaOdt2PdfConverter.prototype.prepareFont = function(htmlElement, pdfProperties) {
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
GrahaOdt2PdfConverter.prototype.preparePdf = function(fonts, htmlElement, pdfProperties) {
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
	var scale = widthScale;
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
		_this.finilize(doc, options, sourceElement, margin, scale, canvasHeight, canvasWidth).then(function(pdf) {
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

GrahaOdt2PdfConverter.prototype.finilize = function(doc, options, sourceElement, margin, scale, canvasHeight, canvasWidth) {
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
				scale: scale,
				x: 0
				, y: 0
				, height: canvasHeight
				, width: canvasWidth
				, onclone: function(canvas, element) {
					var extraBorderWidth = 0;
					$(element).find("p.graha-dummy-bottom").each(function() {
						$(this).css("border-bottom", "none");
						extraBorderWidth++;
					});
					$(element).find(_this.wrapperSelector).each(function() {
						var outerHeight = $(this).outerHeight() - extraBorderWidth;
						$(this).outerHeight(outerHeight);
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
GrahaOdt2PdfConverter.prototype.setOutputFileName = function(fileName) {
	this.outputFileName = fileName;
};
GrahaOdt2PdfConverter.prototype.split = function() {
	if(this.currentFormat == "html") {
		var splitter = new GrahaOdtPageSplitter({scale: this.scale});
		splitter.split();
		this.currentFormat = "splitted";
	}
};
GrahaOdt2PdfConverter.prototype.convertFromUrl = function(metaUrl, headerUrl, contentUrl, options) {
	if(options && options != null && options.fontFamilyConverter && options.fontFamilyConverter != null) {
		this.fontFamilyConverter = options.fontFamilyConverter;
	} else {
		if(this.fontFamilyConverter && this.fontFamilyConverter != null) {
		} else {
			this.fontFamilyConverter = GrahaOdt2PdfConverter.defaultFontFamilyConverter;
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
	if(options && options != null && options.outputFileName && options.outputFileName != null) {
		this.setOutputFileName(options.outputFileName);
	} else {
		this.setOutputFileName("demo.pdf");
	}
	var htmlConverter = new GrahaOdt2HtmlConverter();
	var _this = this;
	return new Promise(function(resolve, reject) {
		htmlConverter.convertFromUrl(metaUrl, headerUrl, contentUrl, {
			defaultFontFamily: _this.defaultFontFamily,
			fontFamilyConverter: _this.fontFamilyConverter,
			adjustScale: _this.adjustScale
		}).then(function(data) {
			_this.currentFormat = "html";
			_this.htmlElement = data.htmlElement;
			_this.pdfProperties = data.pdfProperties;
			_this.wrapperSelector = data.wrapperSelector;
			_this.pageLayout = data.pageLayout;
			_this.odtBinary = data.odtBinary;
			_this.overflow = data.overflow;
			_this.scale = data.scale;
			
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
GrahaOdt2PdfConverter.prototype.convert = function(meta, header, content, options) {
	if(options && options != null && options.fontFamilyConverter && options.fontFamilyConverter != null) {
		this.fontFamilyConverter = options.fontFamilyConverter;
	} else {
		if(this.fontFamilyConverter && this.fontFamilyConverter != null) {
		} else {
			this.fontFamilyConverter = GrahaOdt2PdfConverter.defaultFontFamilyConverter;
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
	if(options && options != null && options.outputFileName && options.outputFileName != null) {
		this.setOutputFileName(options.outputFileName);
	} else {
		this.setOutputFileName("demo.pdf");
	}
	var htmlConverter = new GrahaOdt2HtmlConverter();
	var _this = this;
	return new Promise(function(resolve, reject) {
		htmlConverter.convert(meta, header, content, {
			defaultFontFamily: _this.defaultFontFamily,
			fontFamilyConverter: _this.fontFamilyConverter,
			adjustScale: _this.adjustScale
		}).then(function(data) {
			_this.currentFormat = "html";
			_this.htmlElement = data.htmlElement;
			_this.pdfProperties = data.pdfProperties;
			_this.wrapperSelector = data.wrapperSelector;
			_this.pageLayout = data.pageLayout;
			_this.odtBinary = data.odtBinary;
			_this.overflow = data.overflow;
			_this.scale = data.scale;
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
GrahaOdt2PdfConverter.prototype.convertFromOdfFile = function(file, options) {
	if(options && options != null && options.fontFamilyConverter && options.fontFamilyConverter != null) {
		this.fontFamilyConverter = options.fontFamilyConverter;
	} else {
		if(this.fontFamilyConverter && this.fontFamilyConverter != null) {
		} else {
			this.fontFamilyConverter = GrahaOdt2PdfConverter.defaultFontFamilyConverter;
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
	if(options && options != null && options.outputFileName && options.outputFileName != null) {
		this.setOutputFileName(options.outputFileName);
	} else {
		this.setOutputFileName("demo.pdf");
		if(file.name && file.name != null && file.name.lastIndexOf(".") > 0) {
			var odfFileName = file.name;
			if(odfFileName.lastIndexOf(".") > 0) {
				var pdfFileName = odfFileName.substring(0, odfFileName.lastIndexOf(".")) + ".pdf";
				this.setOutputFileName(pdfFileName);
			}
		}
	}
	var htmlConverter = new GrahaOdt2HtmlConverter();
	var _this = this;
	return new Promise(function(resolve, reject) {
		htmlConverter.convertFromOdfFile(file, {
			defaultFontFamily: _this.defaultFontFamily,
			fontFamilyConverter: _this.fontFamilyConverter,
			adjustScale: _this.adjustScale
		}).then(function(data) {
			_this.currentFormat = "html";
			_this.htmlElement = data.htmlElement;
			_this.pdfProperties = data.pdfProperties;
			_this.wrapperSelector = data.wrapperSelector;
			_this.pageLayout = data.pageLayout;
			_this.odtBinary = data.odtBinary;
			_this.overflow = data.overflow;
			_this.scale = data.scale;
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
GrahaOdt2PdfConverter.prototype.convertFromOdfBlob = function(blob, options) {
	if(options && options != null && options.fontFamilyConverter && options.fontFamilyConverter != null) {
		this.fontFamilyConverter = options.fontFamilyConverter;
	} else {
		if(this.fontFamilyConverter && this.fontFamilyConverter != null) {
		} else {
			this.fontFamilyConverter = GrahaOdt2PdfConverter.defaultFontFamilyConverter;
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
	if(options && options != null && options.outputFileName && options.outputFileName != null) {
		this.setOutputFileName(outputFileName);
	} else {
		this.setOutputFileName("demo.pdf");
	}
	var htmlConverter = new GrahaOdt2HtmlConverter();
	var _this = this;
	return new Promise(function(resolve, reject) {
		htmlConverter.convertFromOdfBlob(blob, {
			defaultFontFamily: _this.defaultFontFamily,
			fontFamilyConverter: _this.fontFamilyConverter,
			adjustScale: _this.adjustScale
		}).then(function(data) {
			_this.currentFormat = "html";
			_this.htmlElement = data.htmlElement;
			_this.pdfProperties = data.pdfProperties;
			_this.wrapperSelector = data.wrapperSelector;
			_this.pageLayout = data.pageLayout;
			_this.odtBinary = data.odtBinary;
			_this.overflow = data.overflow;
			_this.scale = data.scale;
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
GrahaOdt2PdfConverter.prototype.convertFromOdfUrl = function(url, options) {
	if(options && options != null && options.fontFamilyConverter && options.fontFamilyConverter != null) {
		this.fontFamilyConverter = options.fontFamilyConverter;
	} else {
		if(this.fontFamilyConverter && this.fontFamilyConverter != null) {
		} else {
			this.fontFamilyConverter = GrahaOdt2PdfConverter.defaultFontFamilyConverter;
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
	if(options && options != null && options.outputFileName && options.outputFileName != null) {
		this.setOutputFileName(outputFileName);
	} else {
		this.setOutputFileName("demo.pdf");
		var odfUrl = null;
		if(url.lastIndexOf("?") > 0) {
			odfUrl = url.substring(0, url.lastIndexOf("?"));
		} else {
			odfUrl = url;
		}
		if(odfUrl.lastIndexOf("/") > 0) {
			var odfFileName = decodeURIComponent(odfUrl.substring(odfUrl.lastIndexOf("/") + 1));
			if(odfFileName.lastIndexOf(".") > 0) {
				var pdfFileName = odfFileName.substring(0, odfFileName.lastIndexOf(".")) + ".pdf";
				this.setOutputFileName(pdfFileName);
			}
		}
	}
	var htmlConverter = new GrahaOdt2HtmlConverter();
	var _this = this;
	return new Promise(function(resolve, reject) {
		htmlConverter.convertFromOdfUrl(url, {
			defaultFontFamily: _this.defaultFontFamily,
			fontFamilyConverter: _this.fontFamilyConverter,
			adjustScale: _this.adjustScale
		}).then(function(data) {
			_this.currentFormat = "html";
			_this.htmlElement = data.htmlElement;
			_this.pdfProperties = data.pdfProperties;
			_this.wrapperSelector = data.wrapperSelector;
			_this.pageLayout = data.pageLayout;
			_this.odtBinary = data.odtBinary;
			_this.overflow = data.overflow;
			_this.scale = data.scale;
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
GrahaOdt2PdfConverter.prototype.defaultFontFamily = function() {
	this.defaultFontFamily = null;
	if(this.fonts && this.fonts != null && Array.isArray(this.fonts) && this.fonts.length > 0) {
		this.defaultFontFamily = this.fonts[0].family;
	}
};
GrahaOdt2PdfConverter.prototype.setFonts = function(fonts) {
	this.fonts = fonts;
};
GrahaOdt2PdfConverter.defaultFontFamilyConverter = function(fontFamily, defaultFontFamily) {
	if(
		fontFamily.indexOf("굴림") >= 0 ||
		fontFamily.indexOf("고딕") >= 0 ||
		fontFamily.indexOf("돋움") >= 0 ||
		fontFamily.indexOf("Gulim") >= 0 ||
		fontFamily.indexOf("gulim") >= 0 ||
		fontFamily.indexOf("Dotum") >= 0 ||
		fontFamily.indexOf("dotum") >= 0 ||
		fontFamily.indexOf("Gothic") >= 0 ||
		fontFamily.indexOf("gothic") >= 0 ||
		fontFamily.indexOf("Calibri") >= 0
	) {
		return "'Nanum Gothic'";
	} else if(
		fontFamily.indexOf("바탕") >= 0 ||
		fontFamily.indexOf("명조") >= 0 ||
		fontFamily.indexOf("batang") >= 0 ||
		fontFamily.indexOf("Batang") >= 0 ||
		fontFamily.indexOf("myeongjo") >= 0 ||
		fontFamily.indexOf("Myeongjo") >= 0
	) {
		return "'Nanum Myeongjo'";
	} else {
		console.log(fontFamily);
		return defaultFontFamily;
	}
};
GrahaOdt2PdfConverter.prototype.defaultFonts = function() {
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
GrahaOdt2PdfConverter.prototype.getOdtBinary = function() {
	if(this.odtBinary && this.odtBinary != null) {
		return this.odtBinary;
	}
	return null;
};

