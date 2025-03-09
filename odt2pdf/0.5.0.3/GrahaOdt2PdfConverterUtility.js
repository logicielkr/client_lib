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
 * GrahaOdt2PdfConverterUtility
 * GrahaOdt2PdfConverter, GrahaOdt2HtmlConverter, GrahaOdtPageSplitter, GrahaOdtTableBorderCollapser 에서 공동으로 사용하는 함수 모음.

 * GrahaOdt2PdfConverter 전체적인 사용법은 README.md 를 참조한다.

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.5.0.3
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/odt2pdf/0.5.0.3
 */

function GrahaOdt2PdfConverterUtility() {
	
}
GrahaOdt2PdfConverterUtility.width = function(node, scale) {
	if(node instanceof jQuery) {
		return node.width();
	} else {
		return $(node).width();
	}
};
GrahaOdt2PdfConverterUtility.height = function(node, scale) {
	if(node instanceof jQuery) {
		return node.height();
	} else {
		return $(node).height();
	}
};
GrahaOdt2PdfConverterUtility.outerWidthWithMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.outerWidth(node, true, scale);
};
GrahaOdt2PdfConverterUtility.outerWidthWithoutMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.outerWidth(node, false, scale);
};
GrahaOdt2PdfConverterUtility.outerWidth = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.outerWidth(true);
		} else {
			return node.outerWidth(false);
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).outerWidth(true);
		} else {
			return $(node).outerWidth(false);
		}
	}
};
GrahaOdt2PdfConverterUtility.outerHeightWithMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.outerHeight(node, true, scale);
};
GrahaOdt2PdfConverterUtility.outerHeightWithoutMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.outerHeight(node, false, scale);
};
GrahaOdt2PdfConverterUtility.outerHeight = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.outerHeight(true);
		} else {
			return node.outerHeight(false);
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).outerHeight(true);
		} else {
			return $(node).outerHeight(false);
		}
	}
};
GrahaOdt2PdfConverterUtility.positionLeftWithMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.positionLeft(node, true, scale);
};
GrahaOdt2PdfConverterUtility.positionLeftWithoutMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.positionLeft(node, false, scale);
};
GrahaOdt2PdfConverterUtility.positionLeft = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.position().left/scale - GrahaOdt2PdfConverterUtility.parseFloat(node.css("margin-left"), 0);
		} else {
			return node.position().left/scale;
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).position().left/scale - GrahaOdt2PdfConverterUtility.parseFloat($(node).css("margin-left"), 0);
		} else {
			return $(node).position().left/scale;
		}
	}
};
GrahaOdt2PdfConverterUtility.positionRightWithMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.positionRight(node, true, scale);
};
GrahaOdt2PdfConverterUtility.positionRightWithoutMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.positionRight(node, false, scale);
};
GrahaOdt2PdfConverterUtility.positionRight = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.position().left/scale - GrahaOdt2PdfConverterUtility.parseFloat(node.css("margin-left"), 0) +  + node.outerWidth(true);
		} else {
			return node.position().left/scale + node.outerWidth();
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).position().left/scale - GrahaOdt2PdfConverterUtility.parseFloat($(node).css("margin-left"), 0) +  + $(node).outerWidth(true);
		} else {
			return $(node).position().left/scale + $(node).outerWidth();
		}
	}
};
GrahaOdt2PdfConverterUtility.positionTopWithMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.positionTop(node, true, scale);
};
GrahaOdt2PdfConverterUtility.positionTopWithoutMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.positionTop(node, false, scale);
};
GrahaOdt2PdfConverterUtility.positionTop = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.position().top/scale - GrahaOdt2PdfConverterUtility.parseFloat(node.css("margin-top"), 0);
		} else {
			return node.position().top/scale;
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).position().top/scale - GrahaOdt2PdfConverterUtility.parseFloat($(node).css("margin-top"), 0);
		} else {
			return $(node).position().top/scale;
		}
	}
};
GrahaOdt2PdfConverterUtility.positionBottomWithMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.positionBottom(node, true, scale);
};
GrahaOdt2PdfConverterUtility.positionBottomWithoutMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.positionBottom(node, false, scale);
};
GrahaOdt2PdfConverterUtility.positionBottom = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.position().top/scale - GrahaOdt2PdfConverterUtility.parseFloat(node.css("margin-top"), 0) +  + node.outerHeight(true);
		} else {
			return node.position().top/scale + node.outerHeight();
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).position().top/scale - GrahaOdt2PdfConverterUtility.parseFloat($(node).css("margin-top"), 0) +  + $(node).outerHeight(true);
		} else {
			return $(node).position().top/scale + $(node).outerHeight();
		}
	}
};
GrahaOdt2PdfConverterUtility.offsetLeftWithMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.offsetLeft(node, true, scale);
};
GrahaOdt2PdfConverterUtility.offsetLeftWithoutMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.offsetLeft(node, false, scale);
};
GrahaOdt2PdfConverterUtility.offsetLeft = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.offset().left/scale - GrahaOdt2PdfConverterUtility.parseFloat(node.css("margin-left"), 0);
		} else {
			return node.offset().left/scale;
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).offset().left/scale - GrahaOdt2PdfConverterUtility.parseFloat($(node).css("margin-left"), 0);
		} else {
			return $(node).offset().left/scale;
		}
	}
};
GrahaOdt2PdfConverterUtility.offsetRightWithMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.offsetRight(node, true, scale);
};
GrahaOdt2PdfConverterUtility.offsetRightWithoutMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.offsetRight(node, false, scale);
};
GrahaOdt2PdfConverterUtility.offsetRight = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.offset().left/scale - GrahaOdt2PdfConverterUtility.parseFloat(node.css("margin-left"), 0) +  + node.outerWidth(true);
		} else {
			return node.offset().left/scale + node.outerWidth();
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).offset().left/scale - GrahaOdt2PdfConverterUtility.parseFloat($(node).css("margin-left"), 0) +  + $(node).outerWidth(true);
		} else {
			return $(node).offset().left/scale + $(node).outerWidth();
		}
	}
};
GrahaOdt2PdfConverterUtility.offsetTopWithMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.offsetTop(node, true, scale);
};
GrahaOdt2PdfConverterUtility.offsetTopWithoutMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.offsetTop(node, false, scale);
};
GrahaOdt2PdfConverterUtility.offsetTop = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.offset().top/scale - GrahaOdt2PdfConverterUtility.parseFloat(node.css("margin-top"), 0);
		} else {
			return node.offset().top/scale;
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).offset().top/scale - GrahaOdt2PdfConverterUtility.parseFloat($(node).css("margin-top"), 0);
		} else {
			return $(node).offset().top/scale;
		}
	}
};
GrahaOdt2PdfConverterUtility.offsetBottomWithMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.offsetBottom(node, true, scale);
};
GrahaOdt2PdfConverterUtility.offsetBottomWithoutMargin = function(node, scale) {
	return GrahaOdt2PdfConverterUtility.offsetBottom(node, false, scale);
};
GrahaOdt2PdfConverterUtility.offsetBottom = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.offset().top/scale - GrahaOdt2PdfConverterUtility.parseFloat(node.css("margin-top"), 0) +  + node.outerHeight(true);
		} else {
			return node.offset().top/scale + node.outerHeight();
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).offset().top/scale - GrahaOdt2PdfConverterUtility.parseFloat($(node).css("margin-top"), 0) +  + $(node).outerHeight(true);
		} else {
			return $(node).offset().top/scale + $(node).outerHeight();
		}
	}
};
GrahaOdt2PdfConverterUtility.parseInt = function(str, defaultValue) {
	if(str != null) {
		return parseInt(str);
	}
	return defaultValue;
};
GrahaOdt2PdfConverterUtility.parseFloat = function(str, defaultValue) {
	if(str != null) {
		if(typeof(str) == "number") {
			return str;
		}
		return parseFloat(str);
	}
	return defaultValue;
};
GrahaOdt2PdfConverterUtility.getValueStripUnit = function(value, unit) {
	if(value != null && unit != null) {
		if(value.length == value.lastIndexOf(unit) + unit.length) {
			return value.substring(0, value.length - unit.length);
		}
	}
	return null;
};
GrahaOdt2PdfConverterUtility.getUnit = function(value) {
	if(value != null) {
		var units = ["pt", "points", "mm", "cm", "m", "in", "px", "%"];
		for(var i = 0; i < units.length; i++) {
			if(value.length == value.lastIndexOf(units[i]) + units[i].length) {
				return units[i];
			}
		}
	}
	return null;
};
GrahaOdt2PdfConverterUtility.convertToPtWithUnit = function(value, unit) {
	if(unit == "pt") {
		return value;
	} else if(unit == "points") {
		return value;
	} else if(unit == "mm") {
		return value * 7.2 / 2.54;
	} else if(unit == "cm") {
		return value * 72 / 2.54;
	} else if(unit == "m") {
		return value * 720 / 2.54;
	} else if(unit == "in") {
		return value * 72;
	} else if(unit == "px") {
		return value * 72 / 96;
	} else {
		console.error(value);
		return null;
	}
};
GrahaOdt2PdfConverterUtility.convertToPxWithUnit = function(value, unit) {
	if(unit == "pt") {
		return value * 96 / 72;
	} else if(unit == "points") {
		return value * 96 / 72;
	} else if(unit == "mm") {
		return value * 3.78;
	} else if(unit == "cm") {
		return value * 37.8;
	} else if(unit == "m") {
		return value * 378;
	} else if(unit == "in") {
		return value * 96;
	} else if(unit == "px") {
		return value;
	} else {
		console.error(value);
		return null;
	}
};
GrahaOdt2PdfConverterUtility.convertToPx = function(value, defaultValue) {
	var unit = GrahaOdt2PdfConverterUtility.getUnit(value);
	if(unit == null) {
		return defaultValue;
	}
	var value = GrahaOdt2PdfConverterUtility.getValueStripUnit(value, unit);
	if(value == null) {
		return defaultValue;
	}
	return GrahaOdt2PdfConverterUtility.convertToPxWithUnit(GrahaOdt2PdfConverterUtility.parseFloat(value), unit);
};
GrahaOdt2PdfConverterUtility.findByTagName = function(node, nodeName) {
	if(node != null) {
		if(Node.DOCUMENT_NODE == node.nodeType || Node.ELEMENT_NODE == node.nodeType) {
			if(node.nodeName == nodeName) {
				return node;
			}
			for(var i = 0; i < node.childNodes.length; i++) {
				var target = this.findByTagName(node.childNodes[i], nodeName);
				if(target != null) {
					return target;
				}
			}
		} else {
			return null;
		}
	}
	return null;
};
GrahaOdt2PdfConverterUtility.getNodeValue = function(node) {
	if(node != null && node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
		var nodeValue = "";
		for(var i = 0; i < node.childNodes.length; i++) {
			if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
				var childNodeValue = this.getNodeValue(node.childNodes[i]);
				if(childNodeValue != null) {
					nodeValue += childNodeValue;
				}
			} else if(Node.TEXT_NODE == node.childNodes[i].nodeType) {
				if(node.childNodes[i].nodeValue && node.childNodes[i].nodeValue != null) {
					nodeValue += node.childNodes[i].nodeValue;
				}
			} else {
				console.error(node.childNodes[i]);
			}
		}
		return nodeValue;
	}
	return null;
};
GrahaOdt2PdfConverterUtility.toCSSObject = function(name, value) {
	return {
		name: name,
		value: value
		, toString: function() {
			return (this.name + ": " + this.value);
		}
	};
};
GrahaOdt2PdfConverterUtility.defaultFontFamilyConverter = function(fontFamily, defaultFontFamily) {
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