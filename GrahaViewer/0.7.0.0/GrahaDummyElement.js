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
 * GrahaDummyElement

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.6.0.1
 * @since 0.6
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.6.0.1
 */

function GrahaDummyElement(options) {
	if(options && options != null && options.grahaPageInnerSectionClassName && options.grahaPageInnerSectionClassName != null) {
		this.grahaPageInnerSectionClassName = options.grahaPageInnerSectionClassName;
	}
	this.elements = new Array();
	this.attributes = new Array();
}
GrahaDummyElement.prototype.appendChild = function(node) {
	this.elements.push(node);
};
GrahaDummyElement.prototype.append = function(node) {
	this.appendChild(node);
};
GrahaDummyElement.prototype.setAttribute = function(name, value) {
	this.attributes.push({
		name: name,
		value: value
	});
};
GrahaDummyElement.prototype.valid = function() {
	if(this.elements.length > 0) {
		return true;
	}
	return false;
};
GrahaDummyElement.prototype.appendTo = function(node) {
	if(this.valid()) {
		for(var i = 0; i < this.attributes.length; i++) {
			node.setAttribute(this.attributes[i].name, this.attributes[i].value);
		}
		for(var i = 0; i < this.elements.length; i++) {
			node.appendChild(this.elements[i].cloneNode(true));
		}
	}
};
GrahaDummyElement.prototype.moveTo = function(node) {
	if(this.valid()) {
		for(var i = 0; i < this.attributes.length; i++) {
			node.setAttribute(this.attributes[i].name, this.attributes[i].value);
		}
		for(var i = 0; i < this.elements.length; i++) {
			node.appendChild(this.elements[i]);
		}
	}
};
GrahaDummyElement.prototype.getAttribute = function(name) {
	if(this.valid()) {
		for(var i = 0; i < this.attributes.length; i++) {
			if(this.attributes[i].name == name) {
				return this.attributes[i].value;
			}
		}
	}
	return null;
};
GrahaDummyElement.prototype.last = function(skipFootnote) {
	if(this.valid()) {
		return this.elements[this.elements.length - 1];
	}
	return null;
};
GrahaDummyElement.last = function(node) {
	if(node != null) {
		if(node.childNodes && node.childNodes != null && node.childNodes.length > 0) {
			for(var i = node.childNodes.length - 1; i >= 0 ; i--) {
				if(Node.DOCUMENT_NODE == node.childNodes[i].nodeType || Node.ELEMENT_NODE == node.childNodes[i].nodeType) {
					return node.childNodes[i];
				}
			}
		}
	}
};