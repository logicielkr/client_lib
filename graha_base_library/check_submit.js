function check_submit(form, msg) {
	if(typeof(_check) == "function" && !_check(form)) {
		return false;
	}
	if(confirm(msg)) {
		return true;
	} else {
		return false;
	}
}