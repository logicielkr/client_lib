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
 * GrahaPdfConverterUtility
 * GrahaOdt2PdfConverter, GrahaOdt2HtmlConverter, GrahaOdtPageSplitter, GrahaOdtTableBorderCollapser 에서 공동으로 사용하는 함수 모음.

 * GrahaOdt2PdfConverter 전체적인 사용법은 README.md 를 참조한다.

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.5.0.4
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/odt2pdf/0.5.0.4
 */

function GrahaPdfConverterUtility() {
	
}
GrahaPdfConverterUtility.width = function(node, scale) {
	if(node instanceof jQuery) {
		return node.width();
	} else {
		return $(node).width();
	}
};
GrahaPdfConverterUtility.height = function(node, scale) {
	if(node instanceof jQuery) {
		return node.height();
	} else {
		return $(node).height();
	}
};
GrahaPdfConverterUtility.outerWidthWithMargin = function(node, scale) {
	return GrahaPdfConverterUtility.outerWidth(node, true, scale);
};
GrahaPdfConverterUtility.outerWidthWithoutMargin = function(node, scale) {
	return GrahaPdfConverterUtility.outerWidth(node, false, scale);
};
GrahaPdfConverterUtility.outerWidth = function(node, includeMargin, scale) {
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
GrahaPdfConverterUtility.outerHeightWithMargin = function(node, scale) {
	return GrahaPdfConverterUtility.outerHeight(node, true, scale);
};
GrahaPdfConverterUtility.outerHeightWithoutMargin = function(node, scale) {
	return GrahaPdfConverterUtility.outerHeight(node, false, scale);
};
GrahaPdfConverterUtility.outerHeight = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			var marginBottom = GrahaPdfConverterUtility.parseFloat(node.css("margin-bottom"), 0);
			if(marginBottom < 0) {
				return node.outerHeight(true) + marginBottom;
			} else {
				return node.outerHeight(true);
			}
		} else {
			return node.outerHeight(false);
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			var marginBottom = GrahaPdfConverterUtility.parseFloat($(node).css("margin-bottom"), 0);
			if(marginBottom < 0) {
				return $(node).outerHeight(true) + marginBottom;
			} else {
				return $(node).outerHeight(true);
			}
		} else {
			return $(node).outerHeight(false);
		}
	}
};
GrahaPdfConverterUtility.positionLeftWithMargin = function(node, scale) {
	return GrahaPdfConverterUtility.positionLeft(node, true, scale);
};
GrahaPdfConverterUtility.positionLeftWithoutMargin = function(node, scale) {
	return GrahaPdfConverterUtility.positionLeft(node, false, scale);
};
GrahaPdfConverterUtility.positionLeft = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.position().left/scale - GrahaPdfConverterUtility.parseFloat(node.css("margin-left"), 0);
		} else {
			return node.position().left/scale;
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).position().left/scale - GrahaPdfConverterUtility.parseFloat($(node).css("margin-left"), 0);
		} else {
			return $(node).position().left/scale;
		}
	}
};
GrahaPdfConverterUtility.positionRightWithMargin = function(node, scale) {
	return GrahaPdfConverterUtility.positionRight(node, true, scale);
};
GrahaPdfConverterUtility.positionRightWithoutMargin = function(node, scale) {
	return GrahaPdfConverterUtility.positionRight(node, false, scale);
};
GrahaPdfConverterUtility.positionRight = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.position().left/scale - GrahaPdfConverterUtility.parseFloat(node.css("margin-left"), 0) + node.outerWidth(true);
		} else {
			return node.position().left/scale + node.outerWidth();
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).position().left/scale - GrahaPdfConverterUtility.parseFloat($(node).css("margin-left"), 0) + $(node).outerWidth(true);
		} else {
			return $(node).position().left/scale + $(node).outerWidth();
		}
	}
};
GrahaPdfConverterUtility.positionTopWithMargin = function(node, scale) {
	return GrahaPdfConverterUtility.positionTop(node, true, scale);
};
GrahaPdfConverterUtility.positionTopWithoutMargin = function(node, scale) {
	return GrahaPdfConverterUtility.positionTop(node, false, scale);
};
GrahaPdfConverterUtility.positionTop = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.position().top/scale - GrahaPdfConverterUtility.parseFloat(node.css("margin-top"), 0);
		} else {
			return node.position().top/scale;
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).position().top/scale - GrahaPdfConverterUtility.parseFloat($(node).css("margin-top"), 0);
		} else {
			return $(node).position().top/scale;
		}
	}
};
GrahaPdfConverterUtility.positionBottomWithMargin = function(node, scale) {
	return GrahaPdfConverterUtility.positionBottom(node, true, scale);
};
GrahaPdfConverterUtility.positionBottomWithoutMargin = function(node, scale) {
	return GrahaPdfConverterUtility.positionBottom(node, false, scale);
};
GrahaPdfConverterUtility.positionBottom = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.position().top/scale - GrahaPdfConverterUtility.parseFloat(node.css("margin-top"), 0) + node.outerHeight(true);
		} else {
			return node.position().top/scale + node.outerHeight();
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).position().top/scale - GrahaPdfConverterUtility.parseFloat($(node).css("margin-top"), 0) + $(node).outerHeight(true);
		} else {
			return $(node).position().top/scale + $(node).outerHeight();
		}
	}
};
GrahaPdfConverterUtility.offsetLeftWithMargin = function(node, scale) {
	return GrahaPdfConverterUtility.offsetLeft(node, true, scale);
};
GrahaPdfConverterUtility.offsetLeftWithoutMargin = function(node, scale) {
	return GrahaPdfConverterUtility.offsetLeft(node, false, scale);
};
GrahaPdfConverterUtility.offsetLeft = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.offset().left/scale - GrahaPdfConverterUtility.parseFloat(node.css("margin-left"), 0);
		} else {
			return node.offset().left/scale;
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).offset().left/scale - GrahaPdfConverterUtility.parseFloat($(node).css("margin-left"), 0);
		} else {
			return $(node).offset().left/scale;
		}
	}
};
GrahaPdfConverterUtility.offsetRightWithMargin = function(node, scale) {
	return GrahaPdfConverterUtility.offsetRight(node, true, scale);
};
GrahaPdfConverterUtility.offsetRightWithoutMargin = function(node, scale) {
	return GrahaPdfConverterUtility.offsetRight(node, false, scale);
};
GrahaPdfConverterUtility.offsetRight = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.offset().left/scale - GrahaPdfConverterUtility.parseFloat(node.css("margin-left"), 0) + node.outerWidth(true);
		} else {
			return node.offset().left/scale + node.outerWidth();
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).offset().left/scale - GrahaPdfConverterUtility.parseFloat($(node).css("margin-left"), 0) + $(node).outerWidth(true);
		} else {
			return $(node).offset().left/scale + $(node).outerWidth();
		}
	}
};
GrahaPdfConverterUtility.offsetTopWithMargin = function(node, scale) {
	return GrahaPdfConverterUtility.offsetTop(node, true, scale);
};
GrahaPdfConverterUtility.offsetTopWithoutMargin = function(node, scale) {
	return GrahaPdfConverterUtility.offsetTop(node, false, scale);
};
GrahaPdfConverterUtility.offsetTop = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.offset().top/scale - GrahaPdfConverterUtility.parseFloat(node.css("margin-top"), 0);
		} else {
			return node.offset().top/scale;
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).offset().top/scale - GrahaPdfConverterUtility.parseFloat($(node).css("margin-top"), 0);
		} else {
			return $(node).offset().top/scale;
		}
	}
};
GrahaPdfConverterUtility.offsetBottomWithMargin = function(node, scale) {
	return GrahaPdfConverterUtility.offsetBottom(node, true, scale);
};
GrahaPdfConverterUtility.offsetBottomWithoutMargin = function(node, scale) {
	return GrahaPdfConverterUtility.offsetBottom(node, false, scale);
};
GrahaPdfConverterUtility.offsetBottom = function(node, includeMargin, scale) {
	if(node instanceof jQuery) {
		if(arguments.length > 1 && includeMargin) {
			return node.offset().top/scale - GrahaPdfConverterUtility.parseFloat(node.css("margin-top"), 0) + GrahaPdfConverterUtility.outerHeight(node, includeMargin, scale);
		} else {
			return node.offset().top/scale + node.outerHeight();
		}
	} else {
		if(arguments.length > 1 && includeMargin) {
			return $(node).offset().top/scale - GrahaPdfConverterUtility.parseFloat($(node).css("margin-top"), 0) + GrahaPdfConverterUtility.outerHeight(node, includeMargin, scale);
		} else {
			return $(node).offset().top/scale + $(node).outerHeight();
		}
	}
};
GrahaPdfConverterUtility.parseInt = function(str, defaultValue) {
	if(str != null) {
		return parseInt(str);
	}
	return defaultValue;
};
GrahaPdfConverterUtility.parseFloat = function(str, defaultValue) {
	if(str != null) {
		if(typeof(str) == "number") {
			return str;
		}
		return parseFloat(str);
	}
	return defaultValue;
};
GrahaPdfConverterUtility.getValueStripUnit = function(value, unit) {
	if(value != null && unit != null) {
		if(value.length == value.lastIndexOf(unit) + unit.length) {
			return value.substring(0, value.length - unit.length);
		}
	}
	return null;
};
GrahaPdfConverterUtility.getUnit = function(value) {
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
GrahaPdfConverterUtility.convertToPtWithUnit = function(value, unit) {
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
GrahaPdfConverterUtility.convertToPxWithUnit = function(value, unit) {
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
GrahaPdfConverterUtility.convertToPx = function(value, defaultValue) {
	var unit = GrahaPdfConverterUtility.getUnit(value);
	if(unit == null) {
		return defaultValue;
	}
	var value = GrahaPdfConverterUtility.getValueStripUnit(value, unit);
	if(value == null) {
		return defaultValue;
	}
	return GrahaPdfConverterUtility.convertToPxWithUnit(GrahaPdfConverterUtility.parseFloat(value), unit);
};
GrahaPdfConverterUtility.findByTagName = function(node, nodeName) {
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
GrahaPdfConverterUtility.getNodeValue = function(node) {
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
GrahaPdfConverterUtility.toCSSObject = function(name, value) {
	return {
		name: name,
		value: value
		, toString: function() {
			return (this.name + ": " + this.value);
		}
	};
};
GrahaPdfConverterUtility.defaultFontFamilyConverter = function(fontFamily, defaultFontFamily) {
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