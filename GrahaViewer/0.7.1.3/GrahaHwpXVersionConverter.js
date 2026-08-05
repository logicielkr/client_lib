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
 * GrahaHwpXVersionConverter
 * [한글] 2014 와 [한글] 최신버전 사이에 header.xml 파일을 변환하여 return 한다.
 
 * 제공되는 함수는 다음과 같다.

 * 1. GrahaHwpXVersionConverter.fromUrl = function(url, v2014, download)
 
 * - url : 변환 할 파일을 다운로드 받을 수 있는 url
 * - v2014 : v2014 가 true 이면, [한글] 2014 로 변환하고, false 이면 [한글] 최신버전으로 변환한다.
 * - download : download 가 true 이면, 파일을 자동으로 다운로드 한다.
 
 * @return 다음과 같다.
 * resolve({
 * 	blob: blob, //변환한 후에 JSZip으로 압축한 hwpx 의 blob
 * 	mimeType: mimeType, //hwpx 파일 내에 mimetype 파일에서 읽어온 mimeType 값
 * 	fileName: fileName //url 로부터 가져온 파일이름
 * });
 * 다만, fileName 은 v2014 가 true 이면, "파일이름(v2014).hwpx" 와 같이 반환하고,
 * false 인데, 파일이름이 "파일이름(v2014).hwpx" 와 같은 형태라면, "파일이름.hwpx" 과 같이 "(v2014)" 를 떼어내고 반환한다.
 
 * 2. GrahaHwpXVersionConverter.fromBlob = function(blob, v2014, download, fileName) : blob 혹은 file 을 파라미터로 입력받아 변환한다.
 * - blob : blob 혹은 file 형태의 변환 할 파일
 * - v2014 : v2014 가 true 이면, [한글] 2014 로 변환하고, false 이면 [한글] 최신버전으로 변환한다.
 * - download : download 가 true 이면, 파일을 자동으로 다운로드 한다.
 * - fileName : 변환 후의 파일이름
 * 다만, fileName 이 null 이고, blob 이 file type 인 경우 fileName 을 자동으로 결정하되,
 * v2014 가 true 이면, "파일이름(v2014).hwpx" 와 같이 하고,
 * false 인데, 파일이름이 "파일이름(v2014).hwpx" 와 같은 형태라면, "파일이름.hwpx" 과 같이 "(v2014)" 를 떼어낸다.
 
 * @return 다음과 같다.
 * resolve({
 * 	blob: blob, //변환한 후에 JSZip으로 압축한 hwpx 의 blob
 * 	mimeType: mimeType, //hwpx 파일 내에 mimetype 파일에서 읽어온 mimeType 값
 * 	fileName: fileName //파라미터 fileName 혹은 fileName 이 null 이고, blob 이 file type 인 경우 자동으로 결정된 파일이름
 * });
 * 만약, fileName 을 얻을 수 없다면, (에러를 내지는 않지만, 가급적 응용프로그램을 수정하라는 취지로)"demo.hwpx" 로 반환한다.
 
 * 3. GrahaHwpXVersionConverter.fromZip = function(zip, v2014, download, fileName) : JSZip 의 zip 을 파라미터로 입력받아 변환한다.
 
 * - zip : JSZip 의 zip
 * - v2014 : v2014 가 true 이면, [한글] 2014 로 변환하고, false 이면 [한글] 최신버전으로 변환한다.
 * - download : download 가 true 이면, 파일을 자동으로 다운로드 한다.
 * - fileName : 변환 후의 파일이름
 * 만약, fileName 을 얻을 수 없다면, (에러를 내지는 않지만, 가급적 응용프로그램을 수정하라는 취지로)"demo.hwpx" 로 한다. 
 
 * @return 다음과 같다.
 * resolve({
 * 	blob: blob, //변환한 후에 JSZip으로 압축한 hwpx 의 blob
 * 	mimeType: mimeType, //hwpx 파일 내에 mimetype 파일에서 읽어온 mimeType 값
 * 	fileName: fileName //파라미터 fileName
 * });
 *

 * [한글] 2014 와 [한글] 최신버전 사이에 header.xml 파일의 차이는 다음과 같다.
 
 * 1. [한글] 최신버전의 header.xml 의 DOCUMENT_NODE(최상위 요소)는 [한글] 2014 와 비교해서 다음과 같은 namespace 가 추가된다.
 
 * xmlns:hp10="http://www.hancom.co.kr/hwpml/2016/paragraph"
 * xmlns:ooxmlchart="http://www.hancom.co.kr/hwpml/2016/ooxmlchart"
 * xmlns:hwpunitchar="http://www.hancom.co.kr/hwpml/2016/HwpUnitChar"
 * xmlns:epub="http://www.idpf.org/2007/ops"
 * xmlns:config="urn:oasis:names:tc:opendocument:xmlns:config:1.0"
 
 * 2. 다음 2개의 속성값이 [한글] 최신버전은 "none" 으로 [한글] 2014 는 "#FFFFFFFF" 로 설정되어 있다.
 
 * <hh:charPr shadeColor="">
 * <hc:winBrush faceColor="">
 
 * [한글] 2014 에서 저장한 문서를 [한글] 최신버전에서 열었을 경우는 확인하지 못했지만,
 * [한글] 최신버전에서 저장한 문서를 [한글] 2014 에서 열면, "none" 을 검정색으로 처리해서 화면의 바탕색이 온통 검정색이고 글자를 1개도 알아볼 수 없다.
 
 * 3. [한글] 최신버전과 [한글] 2014 는 <hh:paraPr> 아래의 <hh:margin> 과 <hh:lineSpacing> 의 위치가 다르다.
 
 * - [한글] 최신버전은 다음과 같이 위치한다(가독성을 위해 <hh:margin> 의 하위 요소와 <hh:lineSpacing /> 의 속성들은 생략했다).

 * <hp:switch>
 * 	<hp:case hp:required-namespace="http://www.hancom.co.kr/hwpml/2016/HwpUnitChar">
 * 		<hh:margin>
 * 		</hh:margin>
 * 		<hh:lineSpacing />
 * 	</hp:case>
 * 	<hp:default>
 * 		<hh:margin>
 * 		</hh:margin>
 * 		<hh:lineSpacing />
 * 	</hp:default>
 * </hp:switch>
 
 * [한글] 2014 은 다음과 같다.
 
 * <hh:margin>
 * </hh:margin>
 * <hh:lineSpacing />
 
 * [한글] 2014 에서 저장한 문서를 [한글] 최신버전에서 열었을 경우는 확인하지 못했지만,
 * [한글] 최신버전에서 저장한 문서를 [한글] 2014 에서 열면, margin(여백) 과 lineSpacing(줄간격)이 0으로 처리되어, 1줄로 보인다.
 
 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.7.1.3
 * @since 0.7.1.3
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.7.1.3
 */

GrahaHwpXVersionConverter.defaultFileName = "demo.hwpx";
GrahaHwpXVersionConverter.current = null;
JSZip.support.nodebuffer = false;
function GrahaHwpXVersionConverter() {
}
GrahaHwpXVersionConverter.clearCurrent = function() {
	GrahaHwpXVersionConverter.current = null;
};
GrahaHwpXVersionConverter.initCurrent = function() {
	var d = new Date();
	GrahaHwpXVersionConverter.current = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
};
GrahaHwpXVersionConverter.xmlFromString = function(str) {
	if(window.ActiveXObject || "ActiveXObject" in window) {
		try {
			var xml = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.6.0");
			xml.validateOnParse = false;
			xml.setProperty("ProhibitDTD", false);
			xml.async = false;
			xml.loadXML(str);
			return xml;
		} catch (error) {
			console.error(error);
			console.log(str);
			throw error;
		}
	} else {
		try {
			var serializer = new XMLSerializer();
			var parser = new DOMParser();
			var xml = parser.parseFromString(str, "text/xml");
			return xml;
		} catch (error) {
			console.error(error);
			console.log(str);
			throw error;
		}
	}
};
GrahaHwpXVersionConverter.stringFromXML = function(xml) {
	if(xml == null) {
		return null;
	}
	if(xml.xml) {
		return xml.xml;
	} else {
		return new XMLSerializer().serializeToString(xml);
	}
};
GrahaHwpXVersionConverter.download = function(result) {
	if(window.navigator && window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(result.blob, result.fileName);
	}
	var URL = null;
	if(window.URL) {
		URL = window.URL;
	} else if(window.webkitURL) {
		URL = window.webkitURL;
	} else {
		console.error("window.URL is not supported");
	}
	var blobUrl = URL.createObjectURL(result.blob, {type: result.mimeType});
	var a = document.createElement("a");
	if(result.fileName && typeof(a.download) != "undefined") {
		a.href = blobUrl;
		a.download = result.fileName;
		document.body.appendChild(a);
		a.click();
		URL.revokeObjectURL(blobUrl);
	} else {
		URL.revokeObjectURL(blobUrl);
		console.error("download is not supported");
	}
};
GrahaHwpXVersionConverter.fileName = function(source, v2014) {
	var fileName = null;
	if(source && source != null) {
		if(typeof(source) == "string") {
			var url = null;
			if(source.lastIndexOf("?") > 0) {
				url = source.substring(0, source.lastIndexOf("?"));
			} else {
				url = source;
			}
			if(url.lastIndexOf("/") > 0) {
				fileName = decodeURIComponent(url.substring(url.lastIndexOf("/") + 1));
			}
		} else if(source.name && source.name != null) {
			fileName = source.name;
		}
		if(fileName != null && fileName.lastIndexOf(".hwpx") >= 0 && fileName.length == fileName.lastIndexOf(".hwpx") + ".hwpx".length) {
			if(fileName.lastIndexOf("(v2014).hwpx") >= 0 && fileName.length == fileName.lastIndexOf("(v2014).hwpx") + "(v2014).hwpx".length) {
				if(v2014) {
				} else {
					fileName = fileName.substring(0, fileName.lastIndexOf("(v2014).hwpx")) + ".hwpx";
				}
			} else if(v2014) {
				fileName = fileName.substring(0, fileName.lastIndexOf(".hwpx")) + "(v2014).hwpx";
			}
		}
	}
	return fileName;
};
GrahaHwpXVersionConverter.fixFor2014 = function(node, doc) {
	if(
		node.nodeType == Node.ELEMENT_NODE ||
		node.nodeType == Node.DOCUMENT_NODE
	) {
		if(node.nodeType == Node.DOCUMENT_NODE) {
			node.documentElement.removeAttribute("xmlns:hp10");
			node.documentElement.removeAttribute("xmlns:ooxmlchart");
			node.documentElement.removeAttribute("xmlns:hwpunitchar");
			node.documentElement.removeAttribute("xmlns:epub");
			node.documentElement.removeAttribute("xmlns:config");
		} else if(node.nodeType == Node.ELEMENT_NODE) {
			if(node.nodeName == "hh:charPr" && node.getAttribute("shadeColor") != null && node.getAttribute("shadeColor") == "none") {
				node.setAttribute("shadeColor", "#FFFFFFFF");
			} else if(node.nodeName == "hc:winBrush" && node.getAttribute("faceColor") != null && node.getAttribute("faceColor") == "none") {
				node.setAttribute("faceColor", "#FFFFFFFF");
			}
		}
		if(node.nodeName == "hp:switch") {
			var defaultChild = node.getElementsByTagName("hp:default");
			if(defaultChild.length > 0) {
				for(var x = (defaultChild.item(0).childNodes.length - 1); x >= 0; x--) {
					node.parentNode.appendChild(defaultChild.item(0).childNodes[x]);
				}
				node.parentNode.removeChild(node);
			}
		} else {
			for(var i = (node.childNodes.length - 1); i >= 0; i--) {
				GrahaHwpXVersionConverter.fixFor2014(node.childNodes[i], doc);
			}
		}
	}
};
GrahaHwpXVersionConverter.fixFrom2014 = function(node, doc) {
	if(
		node.nodeType == Node.ELEMENT_NODE ||
		node.nodeType == Node.DOCUMENT_NODE
	) {
		if(node.nodeType == Node.DOCUMENT_NODE) {
			node.documentElement.setAttribute("xmlns:hp10", "http://www.hancom.co.kr/hwpml/2016/paragraph");
			node.documentElement.setAttribute("xmlns:ooxmlchart", "http://www.hancom.co.kr/hwpml/2016/ooxmlchart");
			node.documentElement.setAttribute("xmlns:hwpunitchar", "http://www.hancom.co.kr/hwpml/2016/HwpUnitChar");
			node.documentElement.setAttribute("xmlns:epub", "http://www.idpf.org/2007/ops");
			node.documentElement.setAttribute("xmlns:config", "urn:oasis:names:tc:opendocument:xmlns:config:1.0");
		} else if(node.nodeType == Node.ELEMENT_NODE) {
			if(node.nodeName == "hh:charPr" && node.getAttribute("shadeColor") != null && node.getAttribute("shadeColor") == "#FFFFFFFF") {
				
				node.setAttribute("shadeColor", "none");
			} else if(node.nodeName == "hc:winBrush" && node.getAttribute("faceColor") != null && node.getAttribute("faceColor") == "#FFFFFFFF") {
				node.setAttribute("faceColor", "none");
			}
		}
		if(node.nodeName == "hh:margin" || node.nodeName == "hh:lineSpacing") {
			var switchNode = node.parentNode.getElementsByTagName("hp:switch");
			if(switchNode.length > 0) {
				switchNode = switchNode[0];
			} else {
				var switchNode = doc.createElement("hp:switch");
				node.parentNode.appendChild(switchNode);
			}
			var caseNode = switchNode.getElementsByTagName("hp:case");
			if(caseNode.length > 0) {
				caseNode = caseNode[0];
			} else {
				caseNode = doc.createElement("hp:case");
				caseNode.setAttribute("hp:required-namespace", "http://www.hancom.co.kr/hwpml/2016/HwpUnitChar");
				switchNode.appendChild(caseNode);
			}
			caseNode.appendChild(node.cloneNode(true));
			var defaultNode = node.parentNode.getElementsByTagName("hp:default");
			if(defaultNode.length > 0) {
				defaultNode = defaultNode[0];
			} else {
				defaultNode = doc.createElement("hp:default");
				switchNode.appendChild(defaultNode);
			}
			defaultNode.appendChild(node);
		} else {
			for(var i = (node.childNodes.length - 1); i >= 0; i--) {
				GrahaHwpXVersionConverter.fixFrom2014(node.childNodes[i], doc);
			}
		}
	}
};
GrahaHwpXVersionConverter.fromZip = function(zip, v2014, download, fileName) {
	if(fileName && fileName != null) {
	} else {
		if(fileName == null) {
			fileName = GrahaHwpXVersionConverter.defaultFileName;
		}
	}
	GrahaHwpXVersionConverter.initCurrent();
	return new Promise(function(resolve, reject) {
		zip.file("mimetype").async("string").then(
			function success(mimeType) {
				zip.file("Contents/header.xml").async("string").then(
					function success(xmlData) {
						var xml = GrahaHwpXVersionConverter.xmlFromString(xmlData);
						if(v2014) {
							GrahaHwpXVersionConverter.fixFor2014(xml, xml);
						} else {
							GrahaHwpXVersionConverter.fixFrom2014(xml, xml);
						}
						zip.file(
							"Contents/header.xml",
							GrahaHwpXVersionConverter.stringFromXML(xml),
							{date: GrahaHwpXVersionConverter.current}
						);
						zip.generateAsync({type : "blob", mimeType: mimeType}).then(function (blob) {
							if(download) {
								GrahaHwpXVersionConverter.download({
									blob: blob,
									mimeType: mimeType,
									fileName: fileName
								});
							}
							resolve({
								blob: blob,
								mimeType: mimeType,
								fileName: fileName
							});
						}).catch(function(error) {
							console.error(error);
							reject(e);
						});
					},
					function error(e) {
						console.error(e);
						reject(e);
					},
					function reject(e) {
						console.error(e);
						reject(e);
					}
				);
			},
			function error(e) {
				console.error(e);
				reject(e);
			},
			function reject(e) {
				console.error(e);
				reject(e);
			}
		);
	});
};
GrahaHwpXVersionConverter.fromBlob = function(blob, v2014, download, fileName) {
	return new Promise(function(resolve, reject) {
		JSZip.loadAsync(blob).then(function (zip) {
			if(fileName && fileName != null) {
			} else {
				fileName = GrahaHwpXVersionConverter.fileName(blob, v2014);
				if(fileName == null) {
					fileName = GrahaHwpXVersionConverter.defaultFileName;
				}
			}
			GrahaHwpXVersionConverter.fromZip(zip, v2014, download, fileName).then(function(result) {
				resolve(result);
			}).catch(function(error) {
				reject(error);
			});
		}).catch(function(error) {
			reject(error);
		});
	});
};
GrahaHwpXVersionConverter.fromUrl = function(url, v2014, download) {
	return new Promise(function(resolve, reject) {
		JSZipUtils.getBinaryContent(url, function(err, zipData) {
			if(err) {
				console.log(err);
				reject(err);
			}
			GrahaHwpXVersionConverter.fromBlob(zipData, v2014, download, GrahaHwpXVersionConverter.fileName(url, v2014)).then(function(result) {
				resolve(result);
			}).catch(function(error) {
				reject(error);
			});
		});
	});
};
