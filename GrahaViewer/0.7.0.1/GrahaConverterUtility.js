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
 * GrahaConverterUtility
 * GrahaOdt2PdfConverter, GrahaOdt2HtmlConverter, GrahaOdtPageSplitter, GrahaOdtTableBorderCollapser 에서 공동으로 사용하는 함수 모음.

 * GrahaOdt2PdfConverter 전체적인 사용법은 README.md 를 참조한다.

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.6.0.1
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.6.0.1
 */

function GrahaConverterUtility() {
	
}
GrahaConverterUtility.jQuery = function(node) {
	if(node instanceof jQuery) {
		return node;
	} else {
		return $(node);
	}
};
GrahaConverterUtility.width = function(node, scale) {
	return GrahaConverterUtility.jQuery(node).width();
};
/*
GrahaConverterUtility.widthWithoutPadding = function(node, scale) {
	var element = GrahaConverterUtility.jQuery(node);
	return element.width() - GrahaConverterUtility.parseFloat(element.css("padding-left"), 0) - GrahaConverterUtility.parseFloat(element.css("padding-right"), 0);
};
*/
GrahaConverterUtility.height = function(node, scale) {
	return GrahaConverterUtility.jQuery(node).height();
};
GrahaConverterUtility.paddingBottom = function(node, scale) {
	return GrahaConverterUtility.parseFloat(GrahaConverterUtility.jQuery(node).css("padding-bottom"), 0);
};
GrahaConverterUtility.paddingTop = function(node, scale) {
	return GrahaConverterUtility.parseFloat(GrahaConverterUtility.jQuery(node).css("padding-top"), 0);
};
/*
GrahaConverterUtility.heightWithoutPadding = function(node, scale) {
	var element = GrahaConverterUtility.jQuery(node);
	return element.height() - GrahaConverterUtility.parseFloat(element.css("padding-top"), 0) - GrahaConverterUtility.parseFloat(element.css("padding-bottom"), 0);
};
*/
GrahaConverterUtility.outerWidthWithMargin = function(node, scale) {
	return GrahaConverterUtility.outerWidth(node, true, scale);
};
GrahaConverterUtility.outerWidthWithoutMargin = function(node, scale) {
	return GrahaConverterUtility.outerWidth(node, false, scale);
};
GrahaConverterUtility.outerWidth = function(node, includeMargin, scale) {
	if(arguments.length > 1 && includeMargin) {
		return GrahaConverterUtility.jQuery(node).outerWidth(true);
	} else {
		return GrahaConverterUtility.jQuery(node).outerWidth(false);
	}
};
GrahaConverterUtility.outerHeightWithMargin = function(node, scale) {
	return GrahaConverterUtility.outerHeight(node, true, scale);
};
GrahaConverterUtility.outerHeightWithoutMargin = function(node, scale) {
	return GrahaConverterUtility.outerHeight(node, false, scale);
};
GrahaConverterUtility.outerHeight = function(node, includeMargin, scale) {
	var element = GrahaConverterUtility.jQuery(node);
	if(arguments.length > 1 && includeMargin) {
		var marginBottom = GrahaConverterUtility.parseFloat(element.css("margin-bottom"), 0);
		if(marginBottom < 0) {
			return element.outerHeight(includeMargin) + marginBottom;
		} else {
			return element.outerHeight(includeMargin);
		}
	} else {
		return element.outerHeight(includeMargin);
	}
};
GrahaConverterUtility.positionLeftWithMargin = function(node, scale) {
	return GrahaConverterUtility.positionLeft(node, true, scale);
};
GrahaConverterUtility.positionLeftWithoutMargin = function(node, scale) {
	return GrahaConverterUtility.positionLeft(node, false, scale);
};
GrahaConverterUtility.positionLeft = function(node, includeMargin, scale) {
	var element = GrahaConverterUtility.jQuery(node);
	if(arguments.length > 1 && includeMargin) {
		return element.position().left/scale - GrahaConverterUtility.parseFloat(element.css("margin-left"), 0);
	} else {
		return element.position().left/scale;
	}
};
GrahaConverterUtility.positionRightWithMargin = function(node, scale) {
	return GrahaConverterUtility.positionRight(node, true, scale);
};
GrahaConverterUtility.positionRightWithoutMargin = function(node, scale) {
	return GrahaConverterUtility.positionRight(node, false, scale);
};
GrahaConverterUtility.positionRight = function(node, includeMargin, scale) {
	var element = GrahaConverterUtility.jQuery(node);
	if(arguments.length > 1 && includeMargin) {
		return element.position().left/scale - GrahaConverterUtility.parseFloat(element.css("margin-left"), 0) + element.outerWidth(true);
	} else {
		return element.position().left/scale + element.outerWidth();
	}
};
GrahaConverterUtility.positionTopWithMargin = function(node, scale) {
	return GrahaConverterUtility.positionTop(node, true, scale);
};
GrahaConverterUtility.positionTopWithoutMargin = function(node, scale) {
	return GrahaConverterUtility.positionTop(node, false, scale);
};
GrahaConverterUtility.positionTop = function(node, includeMargin, scale) {
	var element = GrahaConverterUtility.jQuery(node);
	if(arguments.length > 1 && includeMargin) {
		return element.position().top/scale - GrahaConverterUtility.parseFloat(element.css("margin-top"), 0);
	} else {
		return element.position().top/scale;
	}
};
GrahaConverterUtility.positionBottomWithMargin = function(node, scale) {
	return GrahaConverterUtility.positionBottom(node, true, scale);
};
GrahaConverterUtility.positionBottomWithoutMargin = function(node, scale) {
	return GrahaConverterUtility.positionBottom(node, false, scale);
};
GrahaConverterUtility.positionBottom = function(node, includeMargin, scale) {
	var element = GrahaConverterUtility.jQuery(node);
	if(arguments.length > 1 && includeMargin) {
		return element.position().top/scale - GrahaConverterUtility.parseFloat(element.css("margin-top"), 0) + element.outerHeight(true);
	} else {
		return element.position().top/scale + element.outerHeight();
	}
};
GrahaConverterUtility.offsetLeftWithMargin = function(node, scale) {
	return GrahaConverterUtility.offsetLeft(node, true, scale);
};
GrahaConverterUtility.offsetLeftWithoutMargin = function(node, scale) {
	return GrahaConverterUtility.offsetLeft(node, false, scale);
};
GrahaConverterUtility.offsetLeft = function(node, includeMargin, scale) {
	var element = GrahaConverterUtility.jQuery(node);
	if(arguments.length > 1 && includeMargin) {
		return element.offset().left/scale - GrahaConverterUtility.parseFloat(element.css("margin-left"), 0);
	} else {
		return element.offset().left/scale;
	}
};
GrahaConverterUtility.offsetRightWithMargin = function(node, scale) {
	return GrahaConverterUtility.offsetRight(node, true, scale);
};
GrahaConverterUtility.offsetRightWithoutMargin = function(node, scale) {
	return GrahaConverterUtility.offsetRight(node, false, scale);
};
GrahaConverterUtility.offsetRight = function(node, includeMargin, scale) {
	var element = GrahaConverterUtility.jQuery(node);
	if(arguments.length > 1 && includeMargin) {
		return element.offset().left/scale - GrahaConverterUtility.parseFloat(element.css("margin-left"), 0) + element.outerWidth(true);
	} else {
		return element.offset().left/scale + element.outerWidth();
	}
};
GrahaConverterUtility.offsetTopWithMargin = function(node, scale) {
	return GrahaConverterUtility.offsetTop(node, true, scale);
};
GrahaConverterUtility.offsetTopWithoutMargin = function(node, scale) {
	return GrahaConverterUtility.offsetTop(node, false, scale);
};
GrahaConverterUtility.offsetTop = function(node, includeMargin, scale) {
	var element = GrahaConverterUtility.jQuery(node);
	if(arguments.length > 1 && includeMargin) {
		return element.offset().top/scale - GrahaConverterUtility.parseFloat(element.css("margin-top"), 0);
	} else {
		return element.offset().top/scale;
	}
};
GrahaConverterUtility.offsetBottomWithMargin = function(node, scale) {
	return GrahaConverterUtility.offsetBottom(node, true, scale);
};
GrahaConverterUtility.offsetBottomWithoutMargin = function(node, scale) {
	return GrahaConverterUtility.offsetBottom(node, false, scale);
};
GrahaConverterUtility.offsetBottom = function(node, includeMargin, scale) {
	var element = GrahaConverterUtility.jQuery(node);
	if(arguments.length > 1 && includeMargin) {
		return element.offset().top/scale - GrahaConverterUtility.parseFloat(element.css("margin-top"), 0) + GrahaConverterUtility.outerHeight(element, includeMargin, scale);
	} else {
		return element.offset().top/scale + element.outerHeight();
	}
};
GrahaConverterUtility.roundWith = function(value, digit) {
	return (Math.round(value * Math.pow(10, digit))/Math.pow(10, digit));
};
GrahaConverterUtility.floorWith = function(value, digit) {
	return (Math.floor(value * Math.pow(10, digit))/Math.pow(10, digit));
};
GrahaConverterUtility.ceilWith = function(value, digit) {
	return (Math.ceil(value * Math.pow(10, digit))/Math.pow(10, digit));
};
GrahaConverterUtility.parseInt = function(str, defaultValue) {
	if(str != null) {
		return parseInt(str);
	}
	return defaultValue;
};
GrahaConverterUtility.parseFloat = function(str, defaultValue) {
	if(str != null) {
		if(typeof(str) == "number") {
			return str;
		}
		return parseFloat(str);
	}
	return defaultValue;
};
GrahaConverterUtility.getValueStripUnit = function(value, unit) {
	if(value != null && unit != null) {
		if(value.length == value.lastIndexOf(unit) + unit.length) {
			return value.substring(0, value.length - unit.length);
		}
	}
	return null;
};
GrahaConverterUtility.getUnit = function(value) {
	if(value != null) {
		var units = ["pt", "points", "mm", "cm", "m", "in", "px", "%"];
		for(var i = 0; i < units.length; i++) {
			if(value.lastIndexOf(units[i]) > 0 && value.length == value.lastIndexOf(units[i]) + units[i].length) {
				return units[i];
			}
		}
	}
	return null;
};
GrahaConverterUtility.convertToPtWithUnit = function(value, unit) {
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
	} else if(unit == "HWPUNIT") {
		if(value > 2147483647) {
//			return ((4294965879 - 2147483647) - 2147483649) / 100;
			return ((value - 2147483647) - 2147483649) / 100;
		} else {
			return value / 100;
		}
	} else {
		console.error(value);
		return null;
	}
};
GrahaConverterUtility.convertToPxWithUnit = function(value, unit) {
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
	} else if(unit == "HWPUNIT") {
		if(value > 2147483647) {
			return (((value - 2147483647) - 2147483649) / 100) * 96 / 72;
		} else {
			return (value / 100) * 96 / 72;
		}
	} else {
		console.error(value);
		return null;
	}
};
GrahaConverterUtility.convertToPx = function(value, defaultValue) {
	var unit = GrahaConverterUtility.getUnit(value);
	if(unit == null) {
		return defaultValue;
	}
	var value = GrahaConverterUtility.getValueStripUnit(value, unit);
	if(value == null) {
		return defaultValue;
	}
	return GrahaConverterUtility.convertToPxWithUnit(GrahaConverterUtility.parseFloat(value), unit);
};
GrahaConverterUtility.findByTagName = function(node, nodeName) {
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
GrahaConverterUtility.getNodeValue = function(node) {
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
GrahaConverterUtility.toCSSObject = function(name, value) {
	return {
		name: name,
		value: value
		, toString: function() {
			return (this.name + ": " + this.value);
		}
	};
};
GrahaConverterUtility.defaultFontFamilyConverter = function(fontFamily, defaultFontFamily) {
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