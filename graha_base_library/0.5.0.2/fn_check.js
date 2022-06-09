function _minValue(form, name, value) {
	var obj = form[name];
	if(obj.value == null) {
		return false;
	} else if((obj.value).length == 0) {
		return false;
	} else {
		var v = obj.value;
		v = v.replace(/,/g, "");
		v = v.replace(/ /g, "");
		if(v == "") {
			return false;
		}
		if(v.indexOf(".") >= 0 || value.toString().indexOf(".") >= 0) {
			if(parseFloat(v) >= value) {
				return true;
			}
		} else {
			if(parseInt(v) >= value) {
				return true;
			}
		}
	}
	return false;
}
function _maxValue(form, name, value) {
	var obj = form[name];
	if(obj.value == null) {
		return true;
	} else {
		var v = obj.value;
		v = v.replace(/,/g, "");
		v = v.replace(/ /g, "");
		if(v == "") {
			return true;
		}
		if(v.indexOf(".") >= 0 || value.toString().indexOf(".") >= 0) {
			if(parseFloat(v) <= value) {
				return true;
			}
		} else {
			if(parseInt(v) <= value) {
				return true;
			}
		}
	}
	return false;
}

function _minLength(form, name, len) {
	var obj = form[name];
	if(obj.value == null) {
		return false;
	} else if((obj.value).length == 0) {
		return false;
	} else if((obj.value).length >= len) {
		return true;
	}
	return false;
}
function _maxLength(form, name, len) {
	var obj = form[name];
	if(obj.value == null) {
		return true;
	} else if((obj.value).length <= len) {
		return true;
	}
	return false;
}
function _notNull(form, name) {
	var obj = form[name];
	if(obj.value == null) {
		return false;
	} else if(obj.value == "") {
		return false;
	}
	return true;
}
function _numberFormat(form, name, t) {
	var obj = form[name];
	var v = obj.value;
	v = v.replace(/,/g, "");
	v = v.replace(/ /g, "");
	if(v == "") {
		return true;
	}
	if(t == "int" || t == "long") {
		if(!isNaN(Number(v)) && !isNaN(parseInt(v)) && parseInt(v).toString() == v) {
			if(t == "int") {
				if(parseInt(v) >= -2147483648 && parseInt(v) <= 2147483647) {
					return true;
				} else {
					return false;
				}
			}
			return true;
		}
	} else if(t == "float" || t == "double") {
		if(!isNaN(Number(v)) && !isNaN(parseFloat(v))) {
			if(t == "float") {
				if(parseFloat(v) >= 1.4E-45 && parseFloat(v) <= 3.4028235E38) {
					return true;
				} else {
					return false;
				}
			}
			return true;
		}
	}
	return false;
}
function _format(form, name, t) {
	var obj = form[name];
	var v = obj.value;
	return (new RegExp(t)).test(v);
}