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
 * GrahaCSSProperties

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.6.0.1
 * @since 0.6
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.6.0.1
 */

function GrahaCSSProperties() {
	this.cssProperties = new Array();
}
GrahaCSSProperties.prototype.clone = function() {
	var properties = new GrahaCSSProperties();
	for(var i = 0; i < this.cssProperties.length; i++) {
		properties.cssProperties.push(properties.toCSSObject(this.cssProperties[i].name, this.cssProperties[i].value, this.cssProperties[i].unit));
	}
	return properties;
};
GrahaCSSProperties.prototype.parseFloat = function(str, defaultValue) {
	return GrahaPdfConverterUtility.parseFloat(str, defaultValue);
};
GrahaCSSProperties.prototype.push = function(name, value, unit) {
	if(arguments.length == 2) {
		unit = null;
		if(value != null && Array.isArray(value)) {
			if(value.length == 0) {
				value = null;
			} else if(value.length == 1) {
				value = value[0];
			} else if(value.length == 2) {
				unit = value[1];
				value = value[0];
			}
		}
	}
	this.cssProperties.push(this.toCSSObject(name, value, unit));
};
GrahaCSSProperties.prototype.replace = function(name, value, unit) {
	if(arguments.length == 2) {
		unit = null;
		if(value != null && Array.isArray(value)) {
			if(value.length == 0) {
				value = null;
			} else if(value.length == 1) {
				value = value[0];
			} else if(value.length == 2) {
				unit = value[1];
				value = value[0];
			}
		}
	}
	for(var i = 0; i < this.cssProperties.length; i++) {
		var css = this.cssProperties[i];
		if(css.name == name) {
			css.value = value;
			css.unit = unit;
			return;
		}
	}
	this.cssProperties.push(this.toCSSObject(name, value, unit));
};
GrahaCSSProperties.prototype.merge = function(other) {
	if(other != null) {
		var cssProps = other.cssProperties;
		if(cssProps != null && cssProps.length > 0) {
			for(var i = 0; i < cssProps.length; i++) {
				this.replace(cssProps[i].name, cssProps[i].value, cssProps[i].unit);
			}
		}
	}
};
GrahaCSSProperties.prototype.plus = function(name, value, unit) {
	if(arguments.length == 2) {
		unit = null;
		if(value != null && Array.isArray(value)) {
			if(value.length == 0) {
				value = null;
			} else if(value.length == 1) {
				value = value[0];
			} else if(value.length == 2) {
				unit = value[1];
				value = value[0];
			}
		}
		if(unit == null) {
			throw new Error("unit is null");
		}
	}
	for(var i = 0; i < this.cssProperties.length; i++) {
		var css = this.cssProperties[i];
		if(css.name == name) {
			if(css.unit == unit) {
				css.value = this.parseFloat(css.value) + this.parseFloat(value);
			} else {
				throw new Error("unit mismatch");
			}
			return;
		}
	}
	this.cssProperties.push(this.toCSSObject(name, value, unit));
};
GrahaCSSProperties.prototype.toCSSObject = function(name, value, unit) {
	return {
		name: name,
		value: value,
		unit: unit
		, toString: function() {
			if(this.unit == null) {
				return (this.name + ": " + this.value);
			} else {
				return (this.name + ": " + this.value + this.unit);
			}
		}
	};
};
GrahaCSSProperties.prototype.valid = function() {
	if(this.cssProperties == null) {
		return false;
	}
	if(this.cssProperties.length > 0) {
		return true;
	}
	return false;
};
GrahaCSSProperties.prototype.getProperty = function(name) {
	if(name == null) {
		return null;
	}
	for(var i = 0; i < this.cssProperties.length; i++) {
		if(this.cssProperties[i].name == name) {
			return this.cssProperties[i];
		}
	}
	return null;
};
GrahaCSSProperties.prototype.excludes = function(name, excludes) {
	if(excludes && excludes != null) {
		if(Array.isArray(excludes)) {
			for(var i = 0; i < excludes.length; i++) {
				if(name == excludes[i]) {
					return true;
				}
			}
		} else if(name == excludes) {
			return true;
		}
	}
	return false;
};
GrahaCSSProperties.prototype.toString = function(lineBreaks, excludes) {
	if(this.cssProperties == null) {
		return null;
	}
	var result = "";
	if(arguments.length == 0) {
		lineBreaks = true;
	}
	if(this.cssProperties.length > 0) {
		var excludesFontStyle = false;
		var excludesFontWeight = false;
		if(arguments.length > 1 && excludes && excludes != null) {
			excludesFontStyle = this.excludes("font-style", excludes);
			excludesFontWeight = this.excludes("font-weight", excludes);
		}
		if(excludesFontStyle && excludesFontWeight) {
		} else {
			var fontFamilyProperty = this.getProperty("font-family");
			if(fontFamilyProperty != null) {
				if(excludesFontStyle) {
				} else {
					if(
						fontFamilyProperty.value &&
						typeof(fontFamilyProperty.value) == "object" &&
						fontFamilyProperty.value.fontStyle &&
						fontFamilyProperty.value.fontStyle != null
					) {
						this.replace("font-style", fontFamilyProperty.value.fontStyle);
					}
				}
				if(excludesFontWeight) {
				} else {
					if(
						fontFamilyProperty.value &&
						typeof(fontFamilyProperty.value) == "object" &&
						fontFamilyProperty.value.fontWeight &&
						fontFamilyProperty.value.fontWeight != null
					) {
						this.replace("font-weight", fontFamilyProperty.value.fontWeight);
					}
				}
			}
		}
		for(var i = 0; i < this.cssProperties.length; i++) {
			if(lineBreaks) {
				if(i > 0) {
					result += "\n";
				}
			}
			if(arguments.length > 1 && excludes && excludes != null && this.excludes(this.cssProperties[i].name, excludes)) {
			} else {
				result += this.cssProperties[i].toString() + ";";
			}
		}
		if(excludesFontWeight) {
		} else {
			var fontWeightProperty = this.getProperty("font-weight");
			if(fontWeightProperty == null) {
				if(lineBreaks) {
					result += "\n";
				}
				result += "font-weight: normal;";
			}
		}
	} else {
		console.error("this.cssProperties.length is 0");
	}
	return result;
};
