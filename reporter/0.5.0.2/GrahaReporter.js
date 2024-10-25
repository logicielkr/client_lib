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
 * Graha(그라하) Reporter
 * 한/글, Microsoft Word, OpenOffice(LibreOffice) 등으로 작성한 Template 으로부터 hwpx, oft, docx 등의 문서파일을 생성하기 위한 Javascript 라이브러리이다.

 * 사용법은 README.md 를 참조한다.

 * 의존성 : 
 * https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
 * https://cdn.jsdelivr.net/gh/jcubic/static@master/js/iconv.js
 * https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
 * https://cdn.jsdelivr.net/npm/jszip-utils@0.1.0/dist/jszip-utils.min.js
 
 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.5.0.2
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/reporter/0.5.0.2
 */

function GrahaReporter() {
}
GrahaReporter.prepare = function() {
	JSZip.support.nodebuffer = false;
	GrahaReporter.legacy = false;
	var userAgent = navigator.userAgent;
	if(userAgent.indexOf("Windows") > 0) {
		if(userAgent.indexOf("Windows NT") > 0) {
			var text = userAgent.substring(0, userAgent.indexOf(";"));
			if(parseFloat(text.substring(text.lastIndexOf(" ") + 1)) >= 10) {
//				console.log("Windows 10");
			} else {
				GrahaReporter.legacy = true;
			}
		} else {
			GrahaReporter.legacy = true;
		}
	}
}
GrahaReporter.report = function(obj) {
	if(obj.data) {
		GrahaReporter.prepare();
		GrahaReporter.fileName = obj.fileName;
		GrahaReporter.entries = obj.entries;
		if(obj.mimeType) {
			GrahaReporter.mimeType = obj.mimeType;
		} else {
			GrahaReporter.mimeType = null;
		}
		for(var i = 0; i < obj.entries.length; i++) {
			GrahaReporter.process(obj.data, obj.entries[i], i);
		}
	} else if(obj.dataUrl) {
		if(obj.dataUrl != null) {
			$.ajax({
				url: obj.dataUrl,
				processData: false,
				contentType: "text/xml",
				type: 'GET',
				success: function(data, textStatus, jqXHR) {
					if(obj.check) {
						if(!obj.check(data)) {
							return;
						}
					}
					GrahaReporter.dataUrl = obj.dataUrl;
					obj.data = data;
					GrahaReporter.report(obj);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					alert("서버에서 데이타를 가져오지 못했습니다(008).");
					console.error(jqXHR);
					console.error(textStatus);
					console.error(errorThrown);
				}
			});
		} else {
			alert("데이타를 가져올 주소가 누락되었습니다(009).");
		}
	} else {
		alert("데이타를 가져올 주소가 누락되었습니다(010).");
	}
}
GrahaReporter.create = function(dataUrl, entries, fileName, mimeType) {
	var obj = {
		dataUrl: dataUrl,
		entries: entries
	};
	if(fileName) {
		obj.fileName = fileName;
	}
	if(mimeType) {
		obj.mimeType = mimeType;
	}
	GrahaReporter.report(obj);
}
GrahaReporter.process = function(xml, entry, index) {
	JSZipUtils.getBinaryContent(entry.templateUrl, function(err, zipData) {
		if(err) {
			alert("원인을 알 수 없는 에러가 발생했습니다(001).");
			console.error(err);
		}
		JSZip.loadAsync(zipData).then(function (zip) {
			GrahaReporter.entries[index].files = new Array();
			zip.forEach(function (relativePath, file) {
					if(file.dir) {
					} else {
						if(relativePath.lastIndexOf(".xslt") == (relativePath.length - 5)) {
							GrahaReporter.entries[index].files.push({
									path: relativePath,
									end: false
							});
						}
					}
			});
			if(GrahaReporter.entries[index].files.length == 0) {
				alert("템플릿 파일이 잘못되었습니다(009).");
			}
			zip.forEach(function (relativePath, file) {
				if(file.dir) {
				} else {
					if(relativePath.lastIndexOf(".xslt") == (relativePath.length - 5)) {
						file.async("string").then(
							function success(xslData) {
								zip.remove(relativePath);
								var result = GrahaReporter.transform(xml, xslData);
								if(result != null) {
									zip.file(
										relativePath.substring(0, relativePath.length - 5),
										result
									);
									for(var i = 0; i < GrahaReporter.entries[index].files.length; i++) {
										if(GrahaReporter.entries[index].files[i].path == relativePath) {
											GrahaReporter.entries[index].files[i].end = true;
										}
									}
									var ends = true;
									for(var i = 0; i < GrahaReporter.entries[index].files.length; i++) {
										if(!GrahaReporter.entries[index].files[i].end) {
											ends = false;
										}
									}
									if(ends) {
										GrahaReporter.blob(zip, index, entry.mimeType);
									}
								}
							},
							function error(e) {
								alert("원인을 알 수 없는 에러가 발생했습니다(002).");
								console.error(e);
							},
							function reject(e) {
								alert("원인을 알 수 없는 에러가 발생했습니다(003).");
								console.error(e);
							}
						);
					}
				}
			});
		});
	});
}
GrahaReporter.zip = function() {
	var ends = true;
	for(var i = 0; i < GrahaReporter.entries.length; i++) {
		if(!GrahaReporter.entries[i].ends) {
			ends = false;
		}
	}
	if(ends) {
		if(GrahaReporter.entries.length == 1) {
			GrahaReporter.download(GrahaReporter.entries[0].blob, GrahaReporter.entries[0].fileName, GrahaReporter.entries[0].mimeType);
		} else {
			if(GrahaReporter.mimeType) {
			} else {
				GrahaReporter.mimeType = "application/zip";
			}
			var zip = new JSZip();
			var rootFolder = zip.folder("");
			for(var i = 0; i < GrahaReporter.entries.length; i++) {
				rootFolder.file(GrahaReporter.entries[i].fileName, GrahaReporter.entries[i].blob);
			}
			if(GrahaReporter.legacy) {
				zip.generateAsync({
					type : "blob",
					encodeFileName: function(str) {
						return iconv.encode(str, "EUC-KR");
					},
					mimeType: GrahaReporter.mimeType
				}).then(function (blob) {
					GrahaReporter.download(blob, GrahaReporter.fileName, GrahaReporter.mimeType);
				});
			} else {
				zip.generateAsync({
					type : "blob",
					mimeType: GrahaReporter.mimeType
				}).then(function (blob) {
					GrahaReporter.download(blob, GrahaReporter.fileName, GrahaReporter.mimeType);
				});
			}
		}
	}
}
GrahaReporter.blob = function(zip, index, mimeType) {
	if (JSZip.support.blob) {
		zip.generateAsync({type : "blob", mimeType: mimeType}).then(function (blob) {
			GrahaReporter.entries[index].blob = blob;
			GrahaReporter.entries[index].ends = true;
			GrahaReporter.zip();
		});
	}
}
GrahaReporter.download = function(blob, fileName, mimeType) {
			if(window.navigator && window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(blob, fileName);
				return;
			}
			var URL = null;
			if(window.URL) {
				URL = window.URL;
			} else if(window.webkitURL) {
				URL = window.webkitURL;
			} else {
				alert("파일을 다운로드 할 수 없습니다(004).");
				return;
			}
			var blobUrl = URL.createObjectURL(blob, {type: mimeType});
			var a = document.createElement("a");
			if(fileName && typeof(a.download) != "undefined") {
				a.href = blobUrl;
				a.download = fileName;
				document.body.appendChild(a);
				a.click();
				URL.revokeObjectURL(blobUrl);
			} else {
				URL.revokeObjectURL(blobUrl);
				alert("파일을 다운로드 할 수 없습니다(005).");
				return;
			}
}
GrahaReporter.transform = function(xml, xslData) {
	if(window.ActiveXObject || "ActiveXObject" in window) {
		var xsl = null;
		try {
			var xsl = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.6.0");
			xsl.validateOnParse = false;
			xsl.setProperty("ProhibitDTD", false);
			xsl.async = false;
			xsl.loadXML(xslData);
			var template = new ActiveXObject("MSXML2.XSLTemplate.6.0");
			template.stylesheet = xsl;
			var processor = template.createProcessor();
			processor.input = xml;
			processor.transform();
			return processor.output;
		} catch (error) {
			alert("파일을 생성할 수 없습니다(006).");
			console.error(error);
			console.log(xslData);
			throw error;
		}
	} else {
		try {
			var serializer = new XMLSerializer();
			var parser = new DOMParser();
			var xsl = parser.parseFromString(xslData, "text/xml");
			var xsltProcessor = new XSLTProcessor();
			xsltProcessor.importStylesheet(xsl);
			return serializer.serializeToString(xsltProcessor.transformToFragment(xml, document));
		} catch (error) {
			alert("파일을 생성할 수 없습니다(007).");
			console.error(error);
			console.log(xslData);
			throw error;
		}
	}
}
