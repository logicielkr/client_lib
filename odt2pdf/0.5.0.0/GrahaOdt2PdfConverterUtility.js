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
	if(str && str != null) {
		return parseInt(str);
	}
	return defaultValue;
};
GrahaOdt2PdfConverterUtility.parseFloat = function(str, defaultValue) {
	if(str && str != null) {
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
		var units = ["pt", "points", "mm", "cm", "m", "in", "px"];
		for(var i = 0; i < units.length; i++) {
			if(value.length == value.lastIndexOf(units[i]) + units[i].length) {
				return units[i];
			}
		}
	}
	return null;
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
	if(unit == "cm") {
		return GrahaOdt2PdfConverterUtility.parseFloat(value) * 37.8;
	} else if(unit == "mm") {
		return GrahaOdt2PdfConverterUtility.parseFloat(value) * 3.78;
	} else {
		console.error(value);
	}
};