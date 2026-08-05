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
 * GrahaMenus, GrahaMenu
 * Menu 및 MenuItem 을 관리한다.

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.7.1.2
 * @since 0.7
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.7.1.2
 */

function GrahaMenu(properties) {
	if(properties && properties != null) {
		if(properties.action && properties.action != null) {
			this.setAction(properties.action);
		}
		if(properties.id && properties.id != null) {
			this.setId(properties.id);
		}
		if(properties.title && properties.title != null) {
			this.setTitle(properties.title);
		}
		if(properties.shortcut && properties.shortcut != null) {
			this.setShortcut(properties.shortcut);
		}
		if(properties.modifier && properties.modifier != null) {
			this.setModifier(properties.modifier);
		}
		if(typeof(properties.display) != "undefined" && properties.display != null) {
			this.setDisplay(properties.display);
		}
		if(typeof(properties.viewerDisplay) != "undefined" && properties.viewerDisplay != null) {
			this.setViewerDisplay(properties.viewerDisplay);
		}
		if(typeof(properties.standaloneDisplay) != "undefined" && properties.standaloneDisplay != null) {
			this.setStandaloneDisplay(properties.standaloneDisplay);
		}
		if(typeof(properties.inlineDisplay) != "undefined" && properties.inlineDisplay != null) {
			this.setInlineDisplay(properties.inlineDisplay);
		}
	}
}
GrahaMenu.prototype.setAction = function(action) {
	this._action = action;
};
GrahaMenu.prototype.setId = function(id) {
	this._id = id;
};
GrahaMenu.prototype.setTitle = function(title) {
	this._title = title;
};
/**
 * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
 * https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
*/
GrahaMenu.prototype.setShortcut = function(shortcut) {
	this._shortcut = shortcut;
};
GrahaMenu.prototype.setModifier = function(modifier) {
	this._modifier = modifier;
};
/**
 * display 가 function 인 경우 최우선으로 적용되고,
 * true 나 false 와 같이 function 이 아닌 경우,
 * viewerDisplay, standaloneDisplay, inlineDisplay 가 설정되지 않은 경우에만 적용된다.
*/
GrahaMenu.prototype.setDisplay = function(display) {
	this._display = display;
};
GrahaMenu.prototype.setViewerDisplay = function(viewerDisplay) {
	this._viewerDisplay = viewerDisplay;
};
GrahaMenu.prototype.setStandaloneDisplay = function(standaloneDisplay) {
	this._standaloneDisplay = standaloneDisplay;
};
GrahaMenu.prototype.setInlineDisplay = function(inlineDisplay) {
	this._inlineDisplay = inlineDisplay;
};
GrahaMenu.prototype.action = function() {
	if(this._action && this._action != null) {
		return this._action;
	}
	return null;
};
GrahaMenu.prototype.id = function() {
	if(this._id && this._id != null) {
		return this._id;
	}
	return null;
};
GrahaMenu.prototype.title = function() {
	if(this._title && this._title != null) {
		return this._title;
	}
	return null;
};
GrahaMenu.prototype.shortcut = function() {
	if(typeof(this._shortcut) != "undefined" && this._shortcut != null) {
		return this._shortcut;
	}
	return null;
};
GrahaMenu.prototype.modifier = function() {
	if(typeof(this._modifier) != "undefined" && this._modifier != null) {
		return this._modifier;
	}
	return null;
};
GrahaMenu.prototype.display = function() {
	if(typeof(this._display) != "undefined" && this._display != null) {
		return this._display;
	}
	return true;
};
GrahaMenu.prototype.viewerDisplay = function() {
	if(typeof(this._display) == "function") {
		return this._display("viewer");
	} else if(typeof(this._viewerDisplay) != "undefined" && this._viewerDisplay != null) {
		return this._viewerDisplay;
	} else if(typeof(this._display) != "undefined" && this._display != null) {
		return this._display;
	}
	return true;
};
GrahaMenu.prototype.standaloneDisplay = function() {
	if(typeof(this._display) == "function") {
		return this._display("standalone");
	} else if(typeof(this._standaloneDisplay) != "undefined" && this._standaloneDisplay != null) {
		return this._standaloneDisplay;
	} else if(typeof(this._display) != "undefined" && this._display != null) {
		return this._display;
	}
	return true;
};
GrahaMenu.prototype.inlineDisplay = function() {
	if(typeof(this._display) == "function") {
		return this._display("inline");
	} else if(typeof(this._inlineDisplay) != "undefined" && this._inlineDisplay != null) {
		return this._inlineDisplay;
	} else if(typeof(this._display) != "undefined" && this._display != null) {
		return this._display;
	}
	return true;
};
GrahaMenu.prototype.execute = function() {
	if(this.action() == "split") {
		GrahaViewer.split();
	} else if(this.action() == "print") {
		GrahaViewer.printer();
	} else if(this.action() == "download") {
		GrahaViewer.download();
	} else if(this.action() == "pdf") {
		GrahaViewer.pdf();
	} else if(this.action() == "close") {
		GrahaViewer.close();
	}
};
GrahaMenu.prototype.visibility = function(mode) {
	if(this.action() != null && this.id() != null) {
		if(mode == "standalone") {
			return this.standaloneDisplay();
		} else if(mode == "viewer") {
			return this.viewerDisplay();
		} else if(mode == "inline") {
			return this.inlineDisplay();
		}
	} else {
		throw new Error("action or id is null");
	}
};
GrahaMenu.prototype.selector = function() {
	if(this.action() == "file") {
		return "input#" + this.id();
	} else {
		return "span#" + this.id();
	}
};
GrahaMenu.prototype.createNode = function(mode) {
	if(this.action() != null && this.id() != null) {
		if(this.visibility(mode)) {
			if(this.action() == "file") {
				this._node =  document.createElement("input");
				this._node.setAttribute("type", "file");
				this._node.setAttribute("style", "display:none;");
			} else {
				this._node =  document.createElement("span");
				this._node.setAttribute("class", "material-icons md-18");
				this._node.setAttribute("style", "vertical-align:text-bottom;cursor:pointer;");
				if(this.title() != null) {
					this._node.setAttribute("title", this.title());
				}
				if(this.action() == "split") {
					this._node.setAttribute("onclick", "GrahaViewer.split();");
					this._node.appendChild(document.createTextNode("splitscreen"));
				} else if(this.action() == "print") {
					this._node.setAttribute("onclick", "GrahaViewer.printer();");
					this._node.appendChild(document.createTextNode("print"));
				} else if(this.action() == "download") {
					this._node.setAttribute("onclick", "GrahaViewer.download();");
					this._node.appendChild(document.createTextNode("download"));
				} else if(this.action() == "pdf") {
					this._node.setAttribute("onclick", "GrahaViewer.pdf();");
					this._node.appendChild(document.createTextNode("picture_as_pdf"));
				} else if(this.action() == "close") {
					this._node.setAttribute("onclick", "GrahaViewer.close();");
					this._node.appendChild(document.createTextNode("close"));
				}
			}
			this._node.setAttribute("id", this.id());
		} else {
			this._node = null;
		}
	} else {
		throw new Error("action or id is null");
	}
};
GrahaMenu.prototype.node = function(mode) {
	if(this._node && this._node != null) {
	} else {
		if(this.visibility(mode)) {
			this.createNode(mode);
		}
	}
	return this._node;
};
GrahaMenu.prototype.show = function(mode) {
	if(this.visibility(mode)) {
		$(this._node).show();
	}
};
GrahaMenu.prototype.hide = function(mode) {
	if(this.visibility(mode)) {
		$(this._node).hide();
	}
};

function GrahaMenus() {
	this._items = null;
}
GrahaMenus.prototype.setMode = function(mode) {
	this._mode = mode;
};
GrahaMenus.prototype.mode = function() {
	return this._mode;
};
GrahaMenus.prototype.add = function(item) {
	if(this._items == null) {
		this._items = new Array();
	}
	this._items.push(new GrahaMenu(item));
};
GrahaMenus.nvl = function(value, defaultValue) {
	if(typeof(value) == "undefined") {
		return defaultValue;
	}
	if(value != null) {
		return value;
	}
	return defaultValue;
};
GrahaMenus.default = function() {
	var menus  = new GrahaMenus();
	
	var file = {action: "file", id: "graha_viewer_file", viewerDisplay: false, standaloneDisplay: true, inlineDisplay: false};
	var split = {action: "split", id: "graha_viewer_split", title: "split", viewerDisplay: false, standaloneDisplay: false, inlineDisplay: false};
	var print = {action: "print", id: "graha_viewer_print", title: "print", viewerDisplay: true, standaloneDisplay: true, inlineDisplay: true};
	print.display = function(mode) {
		if(window.document.documentMode) {
			return false;
		} else {
			return true;
		}
	};
	var download = {action: "download", id: "graha_viewer_download", title: "download", viewerDisplay: true, standaloneDisplay: true, inlineDisplay: true};
	var pdf = {action: "pdf", id: "graha_viewer_pdf", title: "pdf", viewerDisplay: false, standaloneDisplay: false, inlineDisplay: false};
	pdf.display = function(mode) {
		if(window.document.documentMode) {
			return true;
		} else {
			return false;
		}
	};
//	var close = {action: "close", id: "graha_viewer_close", title: "close", shortcut: GrahaMenus.nvl(KeyboardEvent.DOM_VK_ESCAPE, 0x1B), modifier: null, viewerDisplay: true, standaloneDisplay: true, inlineDisplay: true};
	var close = {action: "close", id: "graha_viewer_close", title: "close", shortcut: "Escape", modifier: null, viewerDisplay: true, standaloneDisplay: true, inlineDisplay: true};
	
	menus.add(file);
	menus.add(split);
	menus.add(print);
	menus.add(download);
	menus.add(pdf);
	menus.add(close);
	
	return menus;
};
GrahaMenus.prototype.handleShortcut = function(event) {
	var exists = false;
	if(this._items && this._items != null && this._items.length > 0) {
		for(var i = 0; i < this._items.length; i++) {
			if(this._items[i].visibility(this.mode()) && this._items[i].shortcut() != null) {
				if(
					(typeof(this._items[i].shortcut()) == "number" && event.keyCode == this._items[i].shortcut()) ||
					(typeof(this._items[i].shortcut()) == "string" && event.key == this._items[i].shortcut())
				) {
					if(this._items[i].modifier() != null) {
						if(this._items[i].modifier() == "alt" && event.altKey) {
							exists = true;
							this._items[i].execute();
						} else if(this._items[i].modifier() == "ctrl" && event.ctrlKey) {
							exists = true;
							this._items[i].execute();
						} else if(this._items[i].modifier() == "meta" && event.metaKey) {
							exists = true;
							this._items[i].execute();
						} else if(this._items[i].modifier() == "shift" && event.shiftKey) {
							exists = true;
							this._items[i].execute();
						}
					} else {
						exists = true;
						this._items[i].execute();
					}
				}
			}
		}
	}
	return exists;
};
GrahaMenus.prototype.items = function() {
	return this._items;
};
GrahaMenus.prototype.find = function(action) {
	if(this._items && this._items != null && this._items.length > 0) {
		var list = new Array();
		for(var i = 0; i < this._items.length; i++) {
			if(this._items[i].action() == action) {
				list.push(this._items[i]);
			}
		}
		if(list.length > 0) {
			return list;
		} else {
			return null;
		}
	}
	return null;
};
GrahaMenus.prototype.show = function(action) {
	if(this._items && this._items != null && this._items.length > 0) {
		for(var i = 0; i < this._items.length; i++) {
			if(this._items[i].action() == action) {
				this._items[i].show(this.mode());
			}
		}
	}
};
GrahaMenus.prototype.showAll = function() {
	if(this._items && this._items != null && this._items.length > 0) {
		for(var i = 0; i < this._items.length; i++) {
			this._items[i].show(this.mode());
		}
	}
};
GrahaMenus.prototype.hide = function(action) {
	if(this._items && this._items != null && this._items.length > 0) {
		for(var i = 0; i < this._items.length; i++) {
			if(this._items[i].action() == action) {
				this._items[i].hide(this.mode());
			}
		}
	}
};
GrahaMenus.prototype.hideWithoutFileAction = function() {
	if(this._items && this._items != null && this._items.length > 0) {
		for(var i = 0; i < this._items.length; i++) {
			if(this._items[i].action() == "file") {
			} else {
				this._items[i].hide(this.mode());
			}
		}
	}
};
GrahaMenus.prototype.hideAll = function(action) {
	if(this._items && this._items != null && this._items.length > 0) {
		for(var i = 0; i < this._items.length; i++) {
			this._items[i].hide(this.mode());
		}
	}
};
