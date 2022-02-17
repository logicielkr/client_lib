function _minLength(form, name, len) {
	var obj = eval("form." + name);
	if(obj.value == null) {
		return true;
	} else if((obj.value).length == 0) {
		return true;
	} else if((obj.value).length >= len) {
		return true;
	}
	return false;
}
function _maxLength(form, name, len) {
	var obj = eval("form." + name);
	if(obj.value == null) {
		return true;
	} else if((obj.value).length <= len) {
		return true;
	}
	return false;
}
function _notNull(form, name) {
	var obj = eval("form." + name);
	if(obj.value == null) {
		return false;
	} else if(obj.value == "") {
		return false;
	}
	return true;
}
function _numberFormat(form, name, t) {
	var obj = eval("form." + name);
	var v = obj.value;
	v = v.replace(/,/g, "");
	if(t == "int" || t == "long") {
		if(!isNaN(Number(v)) && !isNaN(parseInt(v)) && parseInt(v).toString() == v) {
			return true;
		}
	} else if(t == "float" || t == "double") {
		if(!isNaN(Number(v)) && !isNaN(parseFloat(v))) {
			return true;
		}
	}
	return false;
}
function _format(form, name, t) {
	var obj = eval("form." + name);
	var v = obj.value;
	return (new RegExp(t)).test(v);
}