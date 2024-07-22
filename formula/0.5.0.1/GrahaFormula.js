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
 * Graha(그라하) 수식실행기
 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.5.0.1
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/formula
 */

function GrahaFormula() {
}
GrahaFormula.FORM_NAME = null;
GrahaFormula.INDEX = null;
GrahaFormula.Oper = function(value) {
	this.value = value;
};
GrahaFormula.Oper.prototype.valueOf = function() {
	return this.value;
};
GrahaFormula.Const = function(value, type) {
	this.value = value;
	if(type) {
		this.type = type;
	}
};
GrahaFormula.Const.prototype.valueOf = function() {
	if(typeof(this.value) == "number") {
		return this.value;
	} else if(
		this.value != null && this.value.length >= 2 &&
		(
			(this.value.charAt(0) == "\"" && this.value.charAt(this.value.length - 1) == "\"")
			|| (this.value.charAt(0) == "'" && this.value.charAt(this.value.length - 1) == "'")
		)
	) {
		if(this.value.length > 1) {
			return this.value.substring(1, this.value.length - 1)
		} else {
			throw new Error(this.value.substring(0,1) + " literal not terminated before end of script");
		}
	} else if(this.type && this.type == "string") {
		return this.value;
	} else if(isNaN(this.value)) {
		return NaN;
	} else {
		return GrahaFormula.Func.udf.number(this.value);
	}
};
GrahaFormula.Const.prototype.typeOf = function() {
	if(
		this.value != null && this.value.length >= 2 &&
		(
			(this.value.charAt(0) == "\"" && this.value.charAt(this.value.length - 1) == "\"")
			|| (this.value.charAt(0) == "'" && this.value.charAt(this.value.length - 1) == "'")
		)
	) {
		return "string";
	} else if(this.type && this.type == "string") {
		return "string";
	} else if(isNaN(this.value)) {
		return NaN;
	} else {
		return "number";
	}
};
GrahaFormula.Val = function(value, index) {
	this.value = value;
	if(arguments.length) {
		this.index = index;
	}
};
GrahaFormula.Val.prototype.valueOf = function() {
	var name = this.value;
	if(
		GrahaFormula.INDEX != null &&
		GrahaFormula.util.isArrayName(name)
	) {
		name = name.substring(0, name.lastIndexOf("[N]"));
	} else if(
		GrahaFormula.INDEX != null &&
		GrahaFormula.util.isNumberingName(name, GrahaFormula.INDEX)
	) {
		name = name.substring(0, name.lastIndexOf("{N}")) + GrahaFormula.INDEX;
	}
	var result = GrahaFormula.Val._get(name);
	if(result == null) {
		return NaN;
	} else if(result.length && result.length > 1) {
		if(this.index != null && this.index >= 0 && result.length > this.index) {
			return result[this.index].value;
		} else if(GrahaFormula.INDEX != null && GrahaFormula.INDEX >= 0 && result.length > GrahaFormula.INDEX) {
			return result[GrahaFormula.INDEX].value;
		} else {
			return NaN;
		}
	} else if(result.length && result.length > 0) {
		return result[0].value;
	} else {
		return result.value;
	}
};
GrahaFormula.Val.prototype.extract = function() {
	var result = GrahaFormula.Val._extract(this.value);
	if(result instanceof Array) {
		var arr = new Array();
		for(var i = 0; i < result.length; i++) {
			var data = GrahaFormula.Val._get(result[i]);
			if(data == null) {
			} else if(data.length && data.length > 1) {
				for(var x = 0; x < data.length; x++) {
					arr.push(new GrahaFormula.Val(result[i], x));
				}
			} else {
				arr.push(new GrahaFormula.Val(result[i]));
			}
		}
		return arr;
	} else {
		return this;
	}
};
GrahaFormula.Val._typeof = function(name) {
	var result = GrahaFormula.Val._get(name);
	if(result == null) {
		return null;
	} else if(result.length && result.length > 1) {
		return "array";
	} else {
		return "single";
	}
};
GrahaFormula.Val._has = function(name) {
	var result = GrahaFormula.Val._typeof(name);
	if(result == null) {
		return false;
	} else {
		return true;
	}
};
GrahaFormula.Val._get = function(name) {
	var jquery = false;
	var selector = false;
	var legacy = false;
	if(typeof($) == "function") {
		jquery = true;
	} else if(document.querySelector && document.querySelectorAll) {
		selector = true;
	} else {
		legacy = true;
	}
	var formName = null;
	var elementName = null;
	if(name.indexOf("#") > 0) {
		formName = name.substring(0, name.indexOf("#"));
		if(formName != null && formName.trim() != "") {
			if(
				(jquery && $("form[name='" + formName + "']").length > 0) ||
				(selector && document.querySelectorAll("form[name='" + formName + "']").length > 0) ||
				(legacy && document.forms[formName])
			) {
				elementName = name.substring(name.indexOf("#") + 1);
			} else {
				formName = null;
			}
		} else {
			formName = null;
		}
	}
	if(formName == null && GrahaFormula.FORM_NAME != null) {
		formName = GrahaFormula.FORM_NAME;
	}
	if(formName == null) {
		return null;
	}
	if(elementName == null) {
		elementName = name;
	}
	if(jquery) {
		if($("form[name='" + formName + "'] [name='" + elementName.replace(/'/g, "\\'").replace(/\./g, "\\.") + "']").length == 0) {
			return null;
		} else {
			return $("form[name='" + formName + "'] [name='" + elementName.replace(/'/g, "\\'").replace(/\./g, "\\.") + "']");
		}
	} else if(selector) {
		if(document.querySelectorAll("form[name='" + formName + "'] [name='" + elementName.replace(/'/g, "\\'").replace(/\./g, "\\.") + "']").length == 0) {
			return null;
		} else {
			return document.querySelectorAll("form[name='" + formName + "'] [name='" + elementName.replace(/'/g, "\\'").replace(/\./g, "\\.") + "']");
		}
	} else {
		var result = document.forms[formName].elements[elementName];
		if(result) {
			if(
				(result.length && result.length > 1) ||
				(result.name && result.name == elementName)
			) {
				return document.forms[formName].elements[elementName];
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
};
GrahaFormula.Val._extract = function(name) {
	if(GrahaFormula.Val._isExtract(name)) {
		var result = new Array();
		if(
			name.length >= 2 &&
			name.charAt(name.length - 1) == "." &&
			GrahaFormula.Val._has(name + "1")
		) {
			var index = 1;
			while(true) {
				if(GrahaFormula.Val._has(name + index)) {
					result.push(name + index);
				} else {
					break;
				}
				index++;
			}
			return result;
		} else if(
			name.indexOf(":") > 1 &&
			name.indexOf(":") == name.lastIndexOf(":")
		) {
			var left = name.substring(0, name.indexOf(":"));
			var right = name.substring(name.lastIndexOf(":") + 1);
			if(left == null || right == null || left == "" || right == "") {
				throw new Error("syntax error (" + name + ")");
			} else if(
				GrahaFormula.Val._has(left) &&
				GrahaFormula.Val._has(right)
			) {
				if(
					left.lastIndexOf(".") > 0 &&
					right.lastIndexOf(".") > 0 &&
					left.substring(0, left.lastIndexOf(".")) == right.substring(0, right.lastIndexOf(".")) &&
					!isNaN(left.substring(left.lastIndexOf(".") + 1)) &&
					!isNaN(right.substring(right.lastIndexOf(".") + 1))
				) {
					var min = Math.min(
						parseInt(left.substring(left.lastIndexOf(".") + 1)),
						parseInt(right.substring(right.lastIndexOf(".") + 1))
					);
					var max = Math.max(
						parseInt(left.substring(left.lastIndexOf(".") + 1)),
						parseInt(right.substring(right.lastIndexOf(".") + 1))
					);
					for(var index = min; index <= max; index++) {
						if(GrahaFormula.Val._has(left.substring(0, left.lastIndexOf(".") + 1) + index)) {
							result.push(left.substring(0, left.lastIndexOf(".") + 1) + index);
						} else {
							throw new Error("syntax error (" + name + ")");
						}
					}
					return result;
				} else {
					result.push(left);
					result.push(right);
					return result;
				}
			} else {
				throw new Error("syntax error (" + name + ")");
			}
		} else {
			result.push(name);
			return result;
		}
	} else if(
		GrahaFormula.INDEX != null &&
		GrahaFormula.util.isNumberingName(name, GrahaFormula.INDEX)
	) {
		result.push(name.substring(0, name.lastIndexOf("{N}")) + GrahaFormula.INDEX);
		return result;
	} else if(
		GrahaFormula.INDEX != null &&
		GrahaFormula.util.isArrayName(name)
	) {
		result.push(name);
		return result;
	} else {
		return name;
	}
};
GrahaFormula.Val.prototype.isExtract = function() {
	return GrahaFormula.Val._isExtract(this.value);
};
GrahaFormula.Val._isExtract = function(name) {
	if(
		name.length >= 2 &&
		name.charAt(name.length - 1) == "." &&
		GrahaFormula.Val._has(name + "1")
	) {
		return true;
	} else if(
		name.indexOf(":") > 1 &&
		name.indexOf(":") == name.lastIndexOf(":")
	) {
		var left = name.substring(0, name.indexOf(":"));
		var right = name.substring(name.lastIndexOf(":") + 1);
		if(left == null || right == null || left == "" || right == "") {
			return false;
		} else if(
			GrahaFormula.Val._has(left) &&
			GrahaFormula.Val._has(right)
		) {
			return true;
		} else {
			return false;
		}
	} else if(GrahaFormula.util.isNumberingName(name, null)) {
		return true;
	} else if(GrahaFormula.util.isArrayName(name)) {
		return true;
	} else if(GrahaFormula.Val._typeof(name) == "array") {
		return true;
	}
	return false;
};
GrahaFormula.Val.contains = function(name) {
	
	if(name == null || name == "") {
		
		return false;
	} else if(
		name != null && name.length >= 2 &&
		(
			(name.charAt(0) == "\"" && name.charAt(name.length - 1) == "\"")
			|| (name.charAt(0) == "'" && name.charAt(name.length - 1) == "'")
		)
	) {
		return false;
	} else if(GrahaFormula.Val._has(name)) {
		return true;
	} else if(GrahaFormula.Val._isExtract(name)) {
		return true;
	}
	return false;
};
GrahaFormula.Func = function(value) {
	this.value = value;
	this.element = new Array();
};
GrahaFormula.Func.prototype.valueOf = function() {
	var args = new Array();
	var last = 0;
	for(var i = 0; i < this.element.length; i++) {
		if(this.element[i] == ",") {
			if(last == (i - 1)) {
				args.push(this.element[last]);
			} else {
				args.push(new GrahaFormula.Expr(this.element.slice(last, i)));
			}
			last = i + 1;
		}
	}
	if(last < this.element.length) {

		if(last == (this.element.length - 1)) {
			args.push(this.element[last]);
		} else {
			args.push(new GrahaFormula.Expr(this.element.slice(last)));
		}
	}
	return GrahaFormula.Func.udf[this.value].call(this, args);
};
GrahaFormula.Func.prototype.append = function(expr) {
	this.element.push(expr);
};
GrahaFormula.Func.udf = function() {
};
GrahaFormula.Func.udf.trim = function(data) {
	var result = GrahaFormula.Func.udf.string(data);
	if(result == null) {
		return null;
	} else {
		return result.trim();
	}
};
GrahaFormula.Func.udf.upper = function(data) {
	var result = GrahaFormula.Func.udf.string(data);
	if(result == null) {
		return null;
	} else {
		return result.toUpperCase();
	}
};
GrahaFormula.Func.udf.lower = function(data) {
	var result = GrahaFormula.Func.udf.string(data);
	if(result == null) {
		return null;
	} else {
		return result.toLowerCase();
	}
};
GrahaFormula.Func.udf.typeof = function(data) {
	if(
		data instanceof GrahaFormula.Const
		|| data instanceof GrahaFormula.Func
		|| data instanceof GrahaFormula.Expr
	) {
		var result = data.valueOf();
		if(typeof(result) == "number") {
			return "number";
		} else if(typeof(result) == "string") {
			if(new RegExp(/^-?[0-9,]+$/).test(result.trim())) {
				return "int";
			} else if(new RegExp(/^-?[0-9.,]+$/).test(result.trim())) {
				return "float"; 
			} else {
				return "string";
			}
		}
	} else if(data instanceof GrahaFormula.Val) {
		var reult;
		if(data.isExtract()) {
			var arr = data.extract();
			if(arr instanceof Array && arr.length > 0) {
				result = arr[0].valueOf();
			} else {
				result = data.valueOf();
			}
		} else {
			result = data.valueOf();
		}
		if(typeof(result) == "number") {
			return "number";
		} else if(typeof(result) == "string") {
			if(new RegExp(/^-?[0-9,]+$/).test(result.trim())) {
				return "int";
			} else if(new RegExp(/^-?[0-9.,]+$/).test(result.trim())) {
				return "float"; 
			} else {
				return "string";
			}
		}
	} else if(typeof(data) == "number") {
		return "number";
	} else if(typeof(data) == "string") {
		if(new RegExp(/^-?[0-9,]+$/).test(data.trim())) {
			return "int";
		} else if(new RegExp(/^-?[0-9.,]+$/).test(data.trim())) {
			return "float"; 
		} else {
			return "string";
		}
	} else if(data.length) {
		if(
			data[0] instanceof GrahaFormula.Const
			|| data[0] instanceof GrahaFormula.Func
			|| data[0] instanceof GrahaFormula.Expr
		) {
			result = data[0].valueOf();
			if(typeof(result) == "number") {
				return "number";
			} else if(typeof(result) == "string") {
				if(new RegExp(/^-?[0-9,]+$/).test(result.trim())) {
					return "int";
				} else if(new RegExp(/^-?[0-9.,]+$/).test(result.trim())) {
					return "float";
				} else {
					return "string";
				}
			}
		} else if(data[0] instanceof GrahaFormula.Val) {
			var reult;
			if(data[0].isExtract()) {
				var arr = data[0].extract();
				if(arr instanceof Array && arr.length > 0) {
					result = arr[0].valueOf();
				} else {
					result = data[0].valueOf();
				}
			} else {
				result = data[0].valueOf();
			}
			if(typeof(result) == "number") {
				return "number";
			} else if(typeof(result) == "string") {
				if(new RegExp(/^-?[0-9,]+$/).test(result.trim())) {
					return "int";
				} else if(new RegExp(/^-?[0-9.,]+$/).test(result.trim())) {
					return "float";
				} else {
					return "string";
				}
			}
		} else if(typeof(data[0]) == "number") {
			return "number";
		} else if(typeof(data[0]) == "string") {
			if(new RegExp(/^-?[0-9,]+$/).test(data[0].trim())) {
				return "int";
			} else if(new RegExp(/^-?[0-9.,]+$/).test(data[0].trim())) {
				return "float";
			} else {
				return "string";
			}
		} else {
			return null;
		}
	} else {
		return null;
	}
};
GrahaFormula.Func.udf._int = function(data) {
	if(GrahaFormula.Func.udf._isInt(data)) {
		return parseInt(data.trim().replace(/,/g, ""));
	} else {
		return NaN;
	}
};
GrahaFormula.Func.udf._isInt = function(data) {
	var type = GrahaFormula.Func.udf.typeof(data);
	if(type == "string") {
		return false;
	} else if(type == "float") {
		return false;
	} else if(type == "int") {
		return true;
	} else if(type == "number") {
		var value = GrahaFormula.Func.udf.number(data);
		if(Math.floor(value) === value) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};
GrahaFormula.Func.udf._isNumber = function(data) {
	var type = GrahaFormula.Func.udf.typeof(data);
	if(type == "string") {
		return false;
	} else if(type == "float") {
		return true;
	} else if(type == "int") {
		return true;
	} else if(type == "number") {
		return true;
	} else {
		return false;
	}
};
GrahaFormula.Func.udf._isFloat = function(data) {
	var type = GrahaFormula.Func.udf.typeof(data);
	if(type == "string") {
		return false;
	} else if(type == "float") {
		return true;
	} else if(type == "int") {
		return false;
	} else if(type == "number") {
		var value = GrahaFormula.Func.udf.number(data);
		if(Math.floor(value) === value) {
			return false;
		} else {
			return true;
		}
	} else {
		return false;
	}
};
GrahaFormula.Func.udf._float = function(data) {
	if(GrahaFormula.Func.udf._isNumber(data)) {
		return parseFloat(data.trim().replace(/,/g, ""));
	} else {
		return NaN;
	}
};
GrahaFormula.Func.udf.comma = function(data) {
	if(GrahaFormula.Func.udf._isNumber(data)) {
		var value = GrahaFormula.Func.udf.number(data);
		if(value == null) {
			return null;
		} else if(isNaN(value)) {
			return NaN;
		} else {
			return value.toLocaleString();
		}
	} else {
		return GrahaFormula.Func.udf.string(data);
	}
};
GrahaFormula.Func.udf.nvl = function(data) {
	if(data.length == 1) {
		var value = GrahaFormula.Func.udf.string(data[0]);
		return value;
	} else if(data.length > 1) {
		var value = GrahaFormula.Func.udf.string(data[0]);
		var defaultValue = GrahaFormula.Func.udf.string(data[1]);
		if(value == null || value == "") {
			return defaultValue;
		} else {
			return value;
		}
	} else {
		return NaN;
	}
};
GrahaFormula.Func.udf.ceil = function(data) {
	var value = GrahaFormula.Func.udf.number(data);
	if(value == null) {
		return NaN;
	} else if(isNaN(value)) {
		return NaN;
	} else {
		return Math.ceil(value);
	}
};
GrahaFormula.Func.udf.round = function(data) {
	var value = GrahaFormula.Func.udf.number(data);
	if(value == null) {
		return NaN;
	} else if(isNaN(value)) {
		return NaN;
	} else {
		return Math.round(value);
	}
};
GrahaFormula.Func.udf.floor = function(data) {
	var value = GrahaFormula.Func.udf.number(data);
	if(value == null) {
		return NaN;
	} else if(isNaN(value)) {
		return NaN;
	} else {
		return Math.floor(value);
	}
};
GrahaFormula.Func.udf.abs = function(data) {
	var value = GrahaFormula.Func.udf.number(data);
	if(value == null) {
		return NaN;
	} else if(isNaN(value)) {
		return NaN;
	} else {
		return Math.abs(value);
	}
};
GrahaFormula.Func.udf.number = function(data) {
	if(
		data instanceof GrahaFormula.Const
		|| data instanceof GrahaFormula.Func
		|| data instanceof GrahaFormula.Expr
	) {
		var result = data.valueOf();
		if(typeof(result) == "number") {
			return result;
		} else if(result.indexOf(".") >= 0) {
			return GrahaFormula.Func.udf._float(result);
		} else {
			return GrahaFormula.Func.udf._int(result);
		}
	} else if(data instanceof GrahaFormula.Val) {
		var result;
		if(data.isExtract()) {
			var arr = data.extract();
			if(arr instanceof Array && arr.length > 0) {
				result = arr[0].valueOf().trim();
			} else {
				result = data.valueOf().trim();
			}
		} else {
			result = data.valueOf().trim();
		}
		if(typeof(result) == "number") {
			return result;
		} else if(result.indexOf(".") >= 0) {
			return GrahaFormula.Func.udf._float(result);
		} else {
			return GrahaFormula.Func.udf._int(result);
		}
	} else if(typeof(data) == "number") {
		return data;
	} else if(typeof(data) == "string") {
		if(data.indexOf(".") >= 0) {
			return GrahaFormula.Func.udf._float(data);
		} else {
			return GrahaFormula.Func.udf._int(data);
		}
	} else if(data.length) {
		if(
			data[0] instanceof GrahaFormula.Const
			|| data[0] instanceof GrahaFormula.Func
			|| data[0] instanceof GrahaFormula.Expr
		) {
			var result = data[0].valueOf();
			if(typeof(result) == "number") {
				return result;
			} else if(result.indexOf(".") >= 0) {
				return GrahaFormula.Func.udf._float(result);
			} else {
				return GrahaFormula.Func.udf._int(result);
			}
		} else if(data[0] instanceof GrahaFormula.Val) {
			var result;
			if(data[0].isExtract()) {
				var arr = data[0].extract();
				if(arr instanceof Array && arr.length > 0) {
					result = arr[0].valueOf().trim();
				} else {
					result = data[0].valueOf().trim();
				}
			} else {
				result = data[0].valueOf().trim();
			}
			if(typeof(result) == "number") {
				return result;
			} else if(result.indexOf(".") >= 0) {
				return GrahaFormula.Func.udf._float(result);
			} else {
				return GrahaFormula.Func.udf._int(result);
			}
		} else if(typeof(data[0]) == "number") {
			return data[0];
		} else if(typeof(data[0]) == "string") {
			if(data[0].indexOf(".") >= 0) {
				return GrahaFormula.Func.udf._float(data[0]);
			} else {
				return GrahaFormula.Func.udf._int(data[0]);
			}
		} else {
			return NaN;
		}
	} else {
		return NaN;
	}
};
GrahaFormula.Func.udf.string = function(data) {
	if(
		data instanceof GrahaFormula.Const
		|| data instanceof GrahaFormula.Func
		|| data instanceof GrahaFormula.Expr
	) {
		var result = data.valueOf();
		if(typeof(result) == "string") {
			return result;
		} else if(typeof(result) == "number") {
			return result.toString();
		} else {
			return null;
		}
	} else if(data instanceof GrahaFormula.Val) {
		var result;
		if(data.isExtract()) {
			var arr = data.extract();
			if(arr instanceof Array && arr.length > 0) {
				result = arr[0].valueOf().trim();
			} else {
				result = data.valueOf().trim();
			}
		} else {
			result = data.valueOf().trim();
		}
		if(typeof(result) == "string") {
			return result;
		} else if(typeof(result) == "number") {
			return result.toString();
		} else {
			return null;
		}
	} else if(typeof(data) == "string") {
		return data;
	} else if(typeof(data) == "number") {
		return data.toString();
	} else if(data.length) {
		if(
			data[0] instanceof GrahaFormula.Const
			|| data[0] instanceof GrahaFormula.Func
			|| data[0] instanceof GrahaFormula.Expr
		) {
			var result = data[0].valueOf();
			if(typeof(result) == "string") {
				return result;
			} else if(typeof(result) == "number") {
				return result.toString();
			} else {
				return null;
			}
		} else if(data[0] instanceof GrahaFormula.Val) {
			var result;
			if(data[0].isExtract()) {
				var arr = data[0].extract();
				if(arr instanceof Array && arr.length > 0) {
					result = arr[0].valueOf().trim();
				} else {
					result = data[0].valueOf().trim();
				}
			} else {
				result = data[0].valueOf().trim();
			}
			if(typeof(result) == "string") {
				return result;
			} else if(typeof(result) == "number") {
				return result.toString();
			} else {
				return null;
			}
		} else if(typeof(data[0]) == "string") {
			return data[0];
		} else if(typeof(data[0]) == "number") {
			return data[0].toString();
		} else {
			return null;
		}
	} else {
		return null;
	}
};
GrahaFormula.Func.udf._extract = function(data) {
	var result = new Array();
	for(var i = 0; i < data.length; i++) {
		if(data[i] instanceof GrahaFormula.Val) {
			if(data[i].isExtract()) {
				var arr = data[i].extract();
				if(arr instanceof Array && arr.length > 0) {
					Array.prototype.push.apply(result, arr);
				} else {
					result.push(data[i]);
				}
			}
		} else {
			result.push(data[i]);
			
		}
	}
	return result;
};
GrahaFormula.Func.udf.sum = function(data) {
	var sum = 0;
	var arr = GrahaFormula.Func.udf._extract(data);
	var result;
	for(var i = 0; i < arr.length; i++) {
		result = arr[i].valueOf();
		if(typeof(result) == "number") {
			sum += result;
		} else if(result != null && result != "") {
			sum += GrahaFormula.Func.udf.number(result);
		}
	}
	return sum;
};
GrahaFormula.Func.udf.max = function(data) {
	var max;
	var arr = GrahaFormula.Func.udf._extract(data);
	var result;
	for(var i = 0; i < arr.length; i++) {
		result = arr[i].valueOf();
		if(i == 0) {
			if(typeof(result) == "number") {
				max = result;
			} else if(result != null && result != "") {
				max = GrahaFormula.Func.udf.number(result);
			}
		} else {
			if(typeof(result) == "number") {
				max = Math.max(max, result);
			} else if(result != null && result != "") {
				max = Math.max(max, GrahaFormula.Func.udf.number(result));
			}
		}
	}
	return max;
};
GrahaFormula.Func.udf.min = function(data) {
	var min;
	var arr = GrahaFormula.Func.udf._extract(data);
	var result;
	for(var i = 0; i < arr.length; i++) {
		result = arr[i].valueOf();
		if(i == 0) {
			if(typeof(result) == "number") {
				min = result;
			} else if(result != null && result != "") {
				min = GrahaFormula.Func.udf.number(result);
			}
		} else {
			if(typeof(result) == "number") {
				min = Math.min(min, result);
			} else if(result != null && result != "") {
				min = Math.min(min, GrahaFormula.Func.udf.number(result));
			}
		}
	}
	return min;
};
GrahaFormula.Func.udf.avg = function(data) {
	var sum = 0;
	var count = 0;
	var result;
	var arr = GrahaFormula.Func.udf._extract(data);
	for(var i = 0; i < arr.length; i++) {
		result = arr[i].valueOf();
		if(typeof(result) == "number") {
			sum += result;
			count++;
		} else if(result != null && result != "") {
			sum += GrahaFormula.Func.udf.number(result);
			count++;
		}
	}
	if(count > 0) {
		return sum/count;
	} else {
		return 0;
	}
};
GrahaFormula.Func.udf.count = function(data) {
	var count = 0;
	var arr = GrahaFormula.Func.udf._extract(data);
	var result;
	for(var i = 0; i < arr.length; i++) {
		result = arr[i].valueOf();
		if(result != null && result != "") {
			count++;
		}
	}
	return count;
};
GrahaFormula.Func.udf.plus = function() {
	var first;
	var second;
	if(arguments.length == 1) {
		first = GrahaFormula.Func.udf.number(arguments[0][0]); 
		second = GrahaFormula.Func.udf.number(arguments[0][1]);
	} else if(arguments.length == 2) {
		first = GrahaFormula.Func.udf.number(arguments[0]); 
		second = GrahaFormula.Func.udf.number(arguments[1]);
	} else {
		return NaN;
	}
	return first + second;
};
GrahaFormula.Func.udf.minus = function() {
	var first;
	var second;
	if(arguments.length == 1) {
		first = GrahaFormula.Func.udf.number(arguments[0][0]); 
		second = GrahaFormula.Func.udf.number(arguments[0][1]);
	} else if(arguments.length == 2) {
		first = GrahaFormula.Func.udf.number(arguments[0]); 
		second = GrahaFormula.Func.udf.number(arguments[1]);
	} else {
		return NaN;
	}
	return first - second;
};
GrahaFormula.Func.udf.concat = function() {
	if(arguments.length == 1) {
		return GrahaFormula.Func.udf.string(arguments[0][0]) + GrahaFormula.Func.udf.string(arguments[0][1]);
	} else if(arguments.length == 2) {
		return GrahaFormula.Func.udf.string(arguments[0]) + GrahaFormula.Func.udf.string(arguments[1]);
	} else {
		return NaN;
	}
};
GrahaFormula.Func.udf.multiplication = function() {
	var first;
	var second;
	if(arguments.length == 1) {
		first = GrahaFormula.Func.udf.number(arguments[0][0]); 
		second = GrahaFormula.Func.udf.number(arguments[0][1]);
	} else if(arguments.length == 2) {
		first = GrahaFormula.Func.udf.number(arguments[0]); 
		second = GrahaFormula.Func.udf.number(arguments[1]);
	} else {
		return NaN;
	}
	return first * second;
};
GrahaFormula.Func.udf.division = function() {
	if(arguments.length == 1) {
		if(GrahaFormula.Func.udf.number(arguments[0][1]) == 0) {
			return Infinity;
		} else {
			return GrahaFormula.Func.udf.number(arguments[0][0]) / GrahaFormula.Func.udf.number(arguments[0][1]);
		}
	} else if(arguments.length == 2) {
		if(GrahaFormula.Func.udf.number(arguments[1]) == 0) {
			return Infinity;
		} else {
			return GrahaFormula.Func.udf.number(arguments[0]) / GrahaFormula.Func.udf.number(arguments[1]);
		}
	} else {
		return NaN;
	}
};
GrahaFormula.Func.contains = function(name) {
	if(name == null || name == "") {
		return false;
	} else if(GrahaFormula.Func.udf[name]) {
		return true;
	} else {
		return false;
	}
};
GrahaFormula.Expr = function() {
	if(arguments.length == 0) {
		this.element = new Array();
	} else {
		this.element = arguments[0];
	}
};
GrahaFormula.Expr.typeof = function(name) {
	if(GrahaFormula.Func.contains(name)) {
		return "function";
	} else if(GrahaFormula.Val.contains(name)) {
		return "val";
	} else if(name != "") {
		return "const";
	} else {
		return "undifined";
	}
};
GrahaFormula.Expr.prototype.append = function(expr) {
	this.element.push(expr);
};
GrahaFormula.Expr.prototype.prevIndex = function(z, el) {
	if(arguments.length > 1) {
		if(z > 0) {
			for(var i = (z - 1); i >= 0; i--) {
				if(el != null) {
					return i;
				}
			}
		}
	} else {
		if(z > 0) {
			for(var i = (z - 1); i >= 0; i--) {
				if(this.element[i] != null) {
					return i;
				}
			}
		}
	}
	return NaN;
};
GrahaFormula.Expr.prototype.nextIndex = function(z, el) {
	if(arguments.length > 1) {
		if(z < this.element.length - 1) {
			for(var i = (z + 1); i < el.length; i++) {
				if(el[i] != null) {
					return i;
				}
			}
		}
	} else {
		if(z < el.length - 1) {
			for(var i = (z + 1); i < this.element.length; i++) {
				if(this.element[i] != null) {
					return i;
				}
			}
		}
	}
	return NaN;
};
GrahaFormula.Expr.prototype.valueOf = function() {
	if(this.element.length == 1) {
		return this.element[0].valueOf();
	}
	var clone = this.element.slice();
	for(var z = 0; z < clone.length; z++) {
		var a = clone[z];
		if(a instanceof GrahaFormula.Oper && a == "%") {
			var prevIndex = this.prevIndex(z, clone);
			if(isNaN(prevIndex)) {
				throw new Error("unknown syntax");
			} else {
				var prev = clone[prevIndex].valueOf();
				clone[nextIndex] = new GrahaFormula.Const(GrahaFormula.Func.udf.division(prev, 100));
				clone[z] = null;
			}
		} else if(a instanceof GrahaFormula.Oper && (a == "*" || a == "/")) {
			var prevIndex = this.prevIndex(z, clone);
			var nextIndex = this.nextIndex(z, clone);
			if(isNaN(prevIndex) || isNaN(nextIndex)) {
				throw new Error("unknown syntax");
			} else {
				var prev = clone[prevIndex].valueOf();
				var next = clone[nextIndex].valueOf();
				clone[prevIndex] = null;
				clone[z] = null;
				if(a == "*") {
					clone[nextIndex] = new GrahaFormula.Const(GrahaFormula.Func.udf.multiplication(prev, next));
				} else if(a == "/") {
					clone[nextIndex] = new GrahaFormula.Const(GrahaFormula.Func.udf.division(prev, next));
				}
				z = nextIndex;
			}
		}
	}
	for(var z = 0; z < clone.length; z++) {
		var a = clone[z];
		if(a instanceof GrahaFormula.Oper && (a == "+" || a == "-")) {
			var prevIndex = this.prevIndex(z, clone);
			var nextIndex = this.nextIndex(z, clone);
			if(isNaN(prevIndex) || isNaN(nextIndex)) {
				throw new Error("unknown syntax");
			} else {
				var prev = clone[prevIndex].valueOf();
				var next = clone[nextIndex].valueOf();
				
				clone[prevIndex] = null;
				clone[z] = null;
				if(a == "+") {
					clone[nextIndex] = new GrahaFormula.Const(GrahaFormula.Func.udf.plus(prev, next));
				} else if(a == "-") {
					clone[nextIndex] = new GrahaFormula.Const(GrahaFormula.Func.udf.minus(prev, next));
				}
				z = nextIndex;
			}
		}
	}
	for(var z = 0; z < clone.length; z++) {
		var a = clone[z];
		if(a instanceof GrahaFormula.Oper && a == "&") {
			var prevIndex = this.prevIndex(z, clone);
			var nextIndex = this.nextIndex(z, clone);
			if(isNaN(prevIndex) || isNaN(nextIndex)) {
				throw new Error("unknown syntax");
			} else {
				var prev = clone[prevIndex].valueOf();
				var next = clone[nextIndex].valueOf();
				clone[prevIndex] = null;
				clone[z] = null;
				clone[nextIndex] = new GrahaFormula.Const(GrahaFormula.Func.udf.concat(prev, next), "string");
				z = nextIndex;
			}
		}
	}
	for(var i = (clone.length - 1); i >= 0; i--) {
		if(clone[i] != null) {
			return clone[i].valueOf();
		}
	}
	return NaN;
};
GrahaFormula.parseFormula = function(formula) {
	var isQ = false;
	var qT = null;
	var t = "";
	var result = new Array();
	var hist = new Array();
	var refer = new Array();
	result.push(new GrahaFormula.Expr());
	var current = 0;
	for(var z in formula) {
		var x = formula[z];
		if(x == "\"" && !isQ && qT == null) {
			qT = "\"";
			isQ = !isQ;
			t += x;
		} else if(x == "\"" && isQ && qT == "\"") {
			if(
				t.substring(t.length-1) != "\\"
				|| (t.substring(t.length-1) == "\\" && t.substring(t.length-2) == "\\")
			) {
				qT = null;
				isQ = !isQ;
			}
			t += x;
		} else if(x == "'" && !isQ && qT == null) {
			qT = "'";
			isQ = !isQ;
			t += x;
		} else if(x == "'" && isQ && qT == "'") {
			if(
				t.substring(t.length-1) != "\\"
				|| (t.substring(t.length-1) == "\\" && t.substring(t.length-2) == "\\")
			) {
				qT = null;
				isQ = !isQ;
			}
			t += x;
		} else if(
			!isQ && (
				x == "+"
				|| x == "-"
				|| x == "*"
				|| x == "/"
				|| x == "%"
				|| x == "&"
				|| x == ")"
				|| x == "("
				|| x == ","
			)
		) {
			if(x == "(") {
				if(GrahaFormula.Expr.typeof(t.trim()) == "function") {
					hist.push(current);
					result.push(new GrahaFormula.Func(t.trim()));
					current = result.length - 1;
				} else {
					if(GrahaFormula.Expr.typeof(t.trim()) == "val") {
						result[current].append(new GrahaFormula.Val(t.trim()));
						if(GrahaFormula.Val._isExtract(t.trim())) {
							Array.prototype.push.apply(refer, GrahaFormula.Val._extract(t.trim()));
						} else {
							refer.push(t.trim());
						}
					} else if(GrahaFormula.Expr.typeof(t.trim()) == "const") {
						result[current].append(new GrahaFormula.Const(t.trim()));
					}
					hist.push(current);
					result.push(new GrahaFormula.Expr());
					current = result.length - 1;
				}
			} else if(x == ")") {
				if(GrahaFormula.Expr.typeof(t.trim()) == "val") {
					result[current].append(new GrahaFormula.Val(t.trim()));
					if(GrahaFormula.Val._isExtract(t.trim())) {
						Array.prototype.push.apply(refer, GrahaFormula.Val._extract(t.trim()));
					} else {
						refer.push(t.trim());
					}
				} else if(GrahaFormula.Expr.typeof(t.trim()) == "const") {
					result[current].append(new GrahaFormula.Const(t.trim()));
				}
				
				hist.pop();
				if(result[result.length - 2]) {
					result[result.length - 2].append(result[current]);
					result.pop();
					current = result.length - 1;
				} else {
					throw new Error("syntax error )");
				}
			} else {
				if(t.trim() != "") {
					if(GrahaFormula.Expr.typeof(t.trim()) == "val") {
						result[current].append(new GrahaFormula.Val(t.trim()));
						if(GrahaFormula.Val._isExtract(t.trim())) {
							Array.prototype.push.apply(refer, GrahaFormula.Val._extract(t.trim()));
						} else {
							refer.push(t.trim());
						}
					} else {
						result[current].append(new GrahaFormula.Const(t.trim()));
					}
				}
				result[current].append(new GrahaFormula.Oper(x));
			}
			t = "";
		} else {
			t += x;
		}
	}
	if(GrahaFormula.Expr.typeof(t.trim()) == "val") {
		result[current].append(new GrahaFormula.Val(t.trim()));
		if(GrahaFormula.Val._isExtract(t.trim())) {
			Array.prototype.push.apply(refer, GrahaFormula.Val._extract(t.trim()));
		} else {
			refer.push(t.trim());
		}
	} else if(t.trim() != "") {
		result[current].append(new GrahaFormula.Const(t.trim()));
	}
	if(hist.length > 0) {
		hist.pop();
		result[result.length - 1].append(result[current])
		result.pop();
	}
	return {
		expr:result[0],
		refer:refer
	};
};
GrahaFormula.util = function() {
};
GrahaFormula.util.compare = function(data1, data2, isExtract) {
	if(isExtract) {
		if(data1 == data2) {
			return true;
		} else {
			if(GrahaFormula.util.isNumberingName(data1, null)) {
				var t1 = data1.substring(0, data1.lastIndexOf("{N}"));
				if(
					data2.length > t1.length &&
					data2.indexOf(t1) == 0 &&
					!isNaN(parseInt(data2.substring(t1.length)))
				) {
					return true;
				}
			} else if(
				GrahaFormula.util.isArrayName(data1) &&
				data2 == data1.substring(0, data1.lastIndexOf("[N]"))
			) {
				return true;
			} else if(GrahaFormula.util.isNumberingName(data2, null)) {
				var t1 = data2.substring(0, data2.lastIndexOf("{N}"));
				if(
					data1.length > t1.length &&
					data1.indexOf(t1) == 0 &&
					!isNaN(parseInt(data1.substring(t1.length)))
				) {
					return true;
				}
			} else if(
				GrahaFormula.util.isArrayName(data2) &&
				data1 == data2.substring(0, data2.lastIndexOf("[N]"))
			) {
				return true;
			}
		}
	} else {
		if(data1 == data2) {
			return true;
		}
	}
	return false;
};
GrahaFormula.util.indexOf = function(arr, data, isExtract) {
	for(var i = 0; i < arr.length; i++) {
		if(GrahaFormula.util.compare(arr[i], data, isExtract)) {
			return i;
		}
	}
	return -1;
};
GrahaFormula.util.isArrayName = function(elementName) {
	return (
		elementName.length > 3 &&
		elementName.lastIndexOf("[N]") == (elementName.length - 3) &&
		GrahaFormula.Val._has(elementName.substring(0, elementName.lastIndexOf("[N]")))
	);
};

GrahaFormula.util.getForm = function(formName) {
	if(formName == null || formName == "") {
		return null;
	} else if(typeof($) == "function") {
		if($("form[name='" + formName + "']").length > 0) {
			return $("form[name='" + formName + "']");
		}
	} else if(document.querySelector && document.querySelectorAll) {
		if(document.querySelectorAll("form[name='" + formName + "']").length > 0) {
			return document.querySelectorAll("form[name='" + formName + "']");
		}
	} else {
		if(document.forms[formName]) {
			return document.forms[formName];
		}
	}
	return null;
};				
				
GrahaFormula.util.isNumberingName = function(elementName, index) {
	if(index != null && index > 0) {
		return (
			elementName.length > 3 &&
			elementName.lastIndexOf("{N}") == (elementName.length - 3) &&
			GrahaFormula.Val._has(elementName.substring(0, elementName.lastIndexOf("{N}")) + index)
		);
	} else {
		return (
			elementName.length > 3 &&
			elementName.lastIndexOf("{N}") == (elementName.length - 3) &&
			GrahaFormula.Val._has(elementName.substring(0, elementName.lastIndexOf("{N}")) + "1")
		);
	}
};
GrahaFormula.util.set = function(obj, value) {
	if(typeof(value) == "number" && isNaN(value)) {
		obj.value = "";
	} else {
		obj.value = value;
	}
};
GrahaFormula.util.make = function(formName, elementName, index) {
	if(elementName == null || elementName == "") {
		throw new Error("elementName is null");
	}
	var realElementName = elementName;
	if(arguments.length > 2 && index != null) {
		if(GrahaFormula.util.isNumberingName(elementName, index)) {
			realElementName = elementName.substring(0, elementName.lastIndexOf("{N}")) + index;
		} else if(GrahaFormula.util.isArrayName(elementName, index)) {
			realElementName = elementName.substring(0, elementName.lastIndexOf("[N]")) + "[" + index + "]";
		}
	}
	if(formName == null || formName == "") {
		return realElementName;
	}
	if(realElementName.indexOf("#") > 0) {
		return realElementName;
	} else {
		return formName + "#" +  realElementName;
	}
};
GrahaFormula.fire = function(formName, elementName, eventType, index) {
	var elementNames = new Array();
	if(elementName != null) {
		elementNames.push(GrahaFormula.util.make(formName, elementName));
	}
	if(index != null && index >= 0) {
		GrahaFormula.INDEX = index;
	}
	if(GrahaFormula.expr) {
		for(var i = 0; i < GrahaFormula.expr.length; i++) {
			var refer = null;
			var isUserDefinedFunction = false;
			if(GrahaFormula.expr[i].func && GrahaFormula.expr[i].refer != null && GrahaFormula.expr[i].refers) {
				refer = GrahaFormula.expr[i].refers;
				isUserDefinedFunction = true;
			} else if(GrahaFormula.expr[i].expr && GrahaFormula.expr[i].expr != "" && GrahaFormula.expr[i].formula && GrahaFormula.expr[i].formula.refer) {
				refer = GrahaFormula.expr[i].formula.refer;
				isUserDefinedFunction = false;
			}
			if(
				refer != null &&
				(eventType == "blur" || eventType == "ready" || eventType == "submit" || eventType == "focus")  &&
				GrahaFormula.expr[i].event && 
				GrahaFormula.expr[i].event != null && 
				GrahaFormula.expr[i].event.indexOf(eventType) >= 0 
			) {
				var elementNameIndex = -1;
				var exists = false;
				var isArray = false;
				if(eventType == "blur") {
					for(var x = 0; x < refer.length; x++) {
						elementNameIndex = GrahaFormula.util.indexOf(elementNames, GrahaFormula.util.make(GrahaFormula.expr[i].formName, refer[x]), true);
						if(elementNameIndex >= 0) {
							exists = true;
							elementNames.push(GrahaFormula.util.make(GrahaFormula.expr[i].formName, GrahaFormula.expr[i].name));
						}
					}
				} else if(eventType == "ready") {
					exists = true;
				} else if(eventType == "submit") {
					if(formName == GrahaFormula.expr[i].formName) {
						exists = true;
					}
				} else if(eventType == "focus") {
					if(
						GrahaFormula.util.make(GrahaFormula.expr[i].formName, GrahaFormula.expr[i].name) == GrahaFormula.util.make(formName, elementName)
					) {
						exists = true;
					}
				}
				if(exists) {
					var target = null;
					if(
						GrahaFormula.INDEX != null &&
						GrahaFormula.util.isArrayName(GrahaFormula.expr[i].name)
					) {
						isArray = true;
						target = GrahaFormula.Val._get(GrahaFormula.expr[i].name.substring(0, GrahaFormula.expr[i].name.lastIndexOf("[N]")));
					} else if(
						GrahaFormula.INDEX != null &&
						GrahaFormula.util.isNumberingName(GrahaFormula.expr[i].name, GrahaFormula.INDEX)
					) {
						target = GrahaFormula.Val._get(GrahaFormula.expr[i].name.substring(0, GrahaFormula.expr[i].name.lastIndexOf("{N}")) + GrahaFormula.INDEX);
					} else {
						target = GrahaFormula.Val._get(GrahaFormula.expr[i].name);
					}
					if(target != null) {
						if(isArray && GrahaFormula.INDEX != null && GrahaFormula.INDEX >= 0 && target.length > GrahaFormula.INDEX) {
							if(isUserDefinedFunction) {
								GrahaFormula.util.set(target[GrahaFormula.INDEX], GrahaFormula.expr[i].func(GrahaFormula.INDEX));
							} else {
								GrahaFormula.util.set(target[GrahaFormula.INDEX], GrahaFormula.expr[i].formula.expr.valueOf());
							}
						} else if(target.length && target.length > 0) {
							if(isUserDefinedFunction) {
								GrahaFormula.util.set(target[0], GrahaFormula.expr[i].func(GrahaFormula.INDEX));
							} else {
								GrahaFormula.util.set(target[0], GrahaFormula.expr[i].formula.expr.valueOf());
							}
						} else {
							if(isUserDefinedFunction) {
								GrahaFormula.util.set(target, GrahaFormula.expr[i].func(GrahaFormula.INDEX));
							} else {
								GrahaFormula.util.set(target, GrahaFormula.expr[i].formula.expr.valueOf());
							}
						}
					} else if(eventType != "focus") {
						if(GrahaFormula.util.isArrayName(GrahaFormula.expr[i].name)) {
							target = GrahaFormula.Val._get(GrahaFormula.expr[i].name.substring(0, GrahaFormula.expr[i].name.lastIndexOf("[N]")));
							for(var z = 0; z < target.length; z++) {
								GrahaFormula.INDEX = z;
								if(isUserDefinedFunction) {
									GrahaFormula.util.set(target[z], GrahaFormula.expr[i].func(GrahaFormula.INDEX));
								} else {
									GrahaFormula.util.set(target[z], GrahaFormula.expr[i].formula.expr.valueOf());
								}
							}
							if(index != null && index >= 0) {
								GrahaFormula.INDEX = index;
							} else {
								GrahaFormula.INDEX = null;
							}
						} else if(GrahaFormula.util.isNumberingName(GrahaFormula.expr[i].name, null)) {
							var arr = GrahaFormula.Val._extract(GrahaFormula.expr[i].name.substring(0, GrahaFormula.expr[i].name.lastIndexOf("{N}")));
							for(var z = 0; z < arr.length; z++) {
								target = GrahaFormula.Val._get(arr[z]);
								if(target != null && target.length && target.length > 0) {
									GrahaFormula.INDEX = (z + 1);
									if(isUserDefinedFunction) {
										GrahaFormula.util.set(target[0], GrahaFormula.expr[i].func(GrahaFormula.INDEX));
									} else {
										GrahaFormula.util.set(target[0], GrahaFormula.expr[i].formula.expr.valueOf());
									}
								} else if(target != null) {
									GrahaFormula.INDEX = (z + 1);
									if(isUserDefinedFunction) {
										GrahaFormula.util.set(target, GrahaFormula.expr[i].func(GrahaFormula.INDEX));
									} else {
										GrahaFormula.util.set(target, GrahaFormula.expr[i].formula.expr.valueOf());
									}
								}
							}
							if(index != null && index >= 0) {
								GrahaFormula.INDEX = index;
							} else {
								GrahaFormula.INDEX = null;
							}
						}
					}
				}
			}
		}
	}
	if(eventType == "submit") {
		return true;
	}
};
GrahaFormula.addEventAll = function(formName, elementName, type) {
	var isNumbering = false;
	var obj = null;
	if(elementName == null) {
		obj = GrahaFormula.util.getForm(formName);
	} else if(GrahaFormula.util.isArrayName(elementName)) {
		obj = GrahaFormula.Val._get(elementName.substring(0, elementName.lastIndexOf("[N]")));
	} else if(GrahaFormula.util.isNumberingName(elementName, null)) {
		obj = new Array();
		var data = GrahaFormula.Val._extract(elementName.substring(0, elementName.lastIndexOf("{N}")));
		for(var z = 0; z < data.length; z++) {
			var arr = GrahaFormula.Val._get(data[z]);
			if(arr != null && arr.length > 0) {
				Array.prototype.push.apply(obj, arr);
			}
		}
		isNumbering = true;
	} else {
		obj = GrahaFormula.Val._get(elementName);
	}
	if(obj) {
		if(obj.length) {
			for(var a = 0; a < obj.length; a++) {
				if(isNumbering) {
					GrahaFormula._addEvent(obj[a], formName, elementName, type, a + 1);
				} else {
					GrahaFormula._addEvent(obj[a], formName, elementName, type, a);
				}
			}
		} else {
			GrahaFormula._addEvent(obj, formName, elementName, type, null);
		}
	} else {
		console.error("check formName and elementName!!!");
		console.error("	formName = " + formName);
		console.error("	elementName = " + elementName);
		console.error("	type = " + type);
	}
};
GrahaFormula.ready = function() {
	if(GrahaFormula.expr) {
		var executedReadyEvent = false;
		for(var i = 0; i < GrahaFormula.expr.length; i++) {
			GrahaFormula.FORM_NAME = GrahaFormula.expr[i].formName;
			if(GrahaFormula.expr[i].func) {
				if(GrahaFormula.expr[i].refer != null) {
					if(GrahaFormula.expr[i].refer instanceof Array) {
						var refer = new Array();
						for(var x = 0; x < GrahaFormula.expr[i].refer.length; x++) {
							if(GrahaFormula.Val._isExtract(GrahaFormula.expr[i].refer[x])) {
								Array.prototype.push.apply(refer, GrahaFormula.Val._extract(GrahaFormula.expr[i].refer[x]));
							} else {
								refer.push(GrahaFormula.expr[i].refer[x]);
							}
						}
						GrahaFormula.expr[i].refers = refer;
					} else if(GrahaFormula.expr[i].refer != "") {
						var arr = GrahaFormula.expr[i].refer.trim().split(/\s*(?:,|$)\s*/);
						var refer = new Array();
						for(var x = 0; x < arr.length; x++) {
							if(GrahaFormula.Val._isExtract(arr[x])) {
								Array.prototype.push.apply(refer, GrahaFormula.Val._extract(arr[x]));
							} else {
								refer.push(arr[x]);
							}
						}
						GrahaFormula.expr[i].refers = refer;
					}
				}
			} else if(GrahaFormula.expr[i].expr && GrahaFormula.expr[i].expr != "") {
				GrahaFormula.expr[i].formula = GrahaFormula.parseFormula(GrahaFormula.expr[i].expr);
			}
			if(
				GrahaFormula.expr[i].event && 
				GrahaFormula.expr[i].event != null && 
				GrahaFormula.expr[i].event.indexOf("ready") >= 0 
			) {
				executedReadyEvent = true;
			}
			if(
				GrahaFormula.expr[i].event && 
				GrahaFormula.expr[i].event != null && 
				GrahaFormula.expr[i].event.indexOf("focus") >= 0 
			) {
				var formName = GrahaFormula.expr[i].formName;
				var elementName = GrahaFormula.expr[i].name;
				GrahaFormula.addEventAll(formName, elementName, "focus");
			}
			if(
				GrahaFormula.expr[i].event && 
				GrahaFormula.expr[i].event != null && 
				GrahaFormula.expr[i].event.indexOf("submit") >= 0 
			) {
				var formName = GrahaFormula.expr[i].formName;
				GrahaFormula.addEventAll(formName, null, "submit");
			}
			var refer = null;
			if(GrahaFormula.expr[i].func && GrahaFormula.expr[i].refer != null && GrahaFormula.expr[i].refers) {
				refer = GrahaFormula.expr[i].refers;
			} else if(GrahaFormula.expr[i].expr && GrahaFormula.expr[i].expr != "" && GrahaFormula.expr[i].formula && GrahaFormula.expr[i].formula.refer) {
				refer = GrahaFormula.expr[i].formula.refer;
			}
			if(
				refer != null &&
				GrahaFormula.expr[i].event && 
				GrahaFormula.expr[i].event != null && 
				GrahaFormula.expr[i].event.indexOf("blur") >= 0 
			) {
				for(var x = 0; x < refer.length; x++) {
					var formName = GrahaFormula.expr[i].formName;
					var elementName = refer[x];
					GrahaFormula.addEventAll(formName, elementName, "blur");
				}
			}
		}
		if(executedReadyEvent) {
			GrahaFormula.fire(null, null, "ready", null);
		}
	}
};

GrahaFormula._addEvent = function(obj, formName, elementName, type, index) {
	if(type == "blur") {
		if(GrahaFormula.blurEventTarget && GrahaFormula.util.indexOf(GrahaFormula.blurEventTarget, GrahaFormula.util.make(formName, elementName, index), false) >= 0) {
			return;
		}
	} else if(type == "focus") {
		if(GrahaFormula.focusEventTarget && GrahaFormula.util.indexOf(GrahaFormula.focusEventTarget, GrahaFormula.util.make(formName, elementName, index), false) >= 0) {
			return;
		}
	} else if(type == "submit") {
		if(GrahaFormula.submitEventTarget && GrahaFormula.util.indexOf(GrahaFormula.submitEventTarget, formName) >= 0) {
			return;
		}
	}
	GrahaFormula.addEvent(obj, GrahaFormula.fire.bind(null, formName, elementName, type, index), type);
	if(type == "blur") {
		if(!GrahaFormula.blurEventTarget) {
			GrahaFormula.blurEventTarget = new Array();
		}
		GrahaFormula.blurEventTarget.push(GrahaFormula.util.make(formName, elementName, index));
	} else if(type == "focus") {
		if(!GrahaFormula.focusEventTarget) {
			GrahaFormula.focusEventTarget = new Array();
		}
		GrahaFormula.focusEventTarget.push(GrahaFormula.util.make(formName, elementName, index));
	} else if(type == "submit") {
		if(!GrahaFormula.submitEventTarget) {
			GrahaFormula.submitEventTarget = new Array();
		}
		GrahaFormula.submitEventTarget.push(formName);
	}
};

GrahaFormula.addEvent = function(obj, func, type) {
	if(typeof($) == "function") {
		if(type == "ready") {
			$(document).ready(func);
		} else if(type == "focus") {
			$(obj).bind("focus", func);
		} else if(type == "blur") {
			$(obj).bind("blur", func);
		} else if(type == "submit") {
			$(obj).bind("submit", func);
		}
	} else if(window.addEventListener) {
		if(type == "ready") {
			window.addEventListener("DOMContentLoaded", func);
		} else if(type == "focus") {
			obj.addEventListener("focus", func);
		} else if(type == "blur") {
			obj.addEventListener("blur", func);
		} else if(type == "submit") {
			obj.addEventListener("sumbit", func);
		}
	} else if(window.attachEvent) {
		if(type == "ready") {
			window.attachEvent("onload", func);
		} else if(type == "focus") {
			obj.attachEvent("onfocus", func);
		} else if(type == "blur") {
			obj.attachEvent("onblur", func);
		} else if(type == "submit") {
			obj.attachEvent("onsubmit", func);
		}
	} else {
		if(type == "ready") {
			window.onload = func;
		} else if(type == "focus") {
			obj.onfocus = func;
		} else if(type == "blur") {
			obj.onblur = func;
		} else if(type == "submit") {
			obj.onsubmit = func;
		}
	}
};