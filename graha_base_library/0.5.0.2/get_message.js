function _getMessage(msg) {
	if(typeof(_messages) != "undefined" && msg.indexOf("message.") == 0) {
		for(var i = 0; i < _messages.length; i++) {
			if("message." + _messages[i].name == msg) {
				return _messages[i].label;
			}
		}
	}
	return msg;
}