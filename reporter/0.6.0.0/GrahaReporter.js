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
 * @version 0.6.0.0
 * @since 0.5
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/reporter/0.6.0.0
 */

function GrahaReporter() {
}
GrahaReporter.prepareInternal = function() {
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
	var d = new Date();
	GrahaReporter.current = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
};
GrahaReporter.report = function(obj) {
	GrahaReporter.download(obj).then(function(result) {
		if(result) {
		} else {
			console.error(obj);
			alert("원인을 알 수 없는 에러가 발생했습니다(100).");
		}
	}).catch(function(error) {
//		console.error(error);
		if(error && error != null) {
			if(error.code && error.code != null && error.code == "000") {
			} else {
				var message = "";
				if(error.message && error.message != null) {
					message += error.message;
				}
				if(error.code && error.code != null) {
					message += "(" + error.code + ")";
				}
				if(message == "") {
					alert("원인을 알 수 없는 에러가 발생했습니다(101).");
				} else {
					alert(message);
				}
			}
		} else {
			alert("원인을 알 수 없는 에러가 발생했습니다(102).");
		}
	});
};
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
};
GrahaReporter.download = function(obj) {
	return new Promise(function(resolve, reject) {
		GrahaReporter.archive(obj).then(function(result) {
			if(window.navigator && window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(result.blob, result.fileName);
				resolve(true);
			}
			var URL = null;
			if(window.URL) {
				URL = window.URL;
			} else if(window.webkitURL) {
				URL = window.webkitURL;
			} else {
				reject({
					code: "004",
					message: "파일을 다운로드 할 수 없습니다",
					detail: null
				});
			}
			var blobUrl = URL.createObjectURL(result.blob, {type: result.mimeType});
			var a = document.createElement("a");
			if(result.fileName && typeof(a.download) != "undefined") {
				a.href = blobUrl;
				a.download = result.fileName;
				document.body.appendChild(a);
				a.click();
				URL.revokeObjectURL(blobUrl);
				resolve(true);
			} else {
				URL.revokeObjectURL(blobUrl);
				reject({
					code: "005",
					message: "파일을 다운로드 할 수 없습니다",
					detail: null
				});
			}
		}).catch(function(error) {
			reject(error);
		});
	});
};
GrahaReporter.archive = function(obj) {
	return new Promise(function(resolve, reject) {
		GrahaReporter.blob(obj).then(function(values) {
			if(values != null && values.length > 0) {
				if(values.length == 1) {
					resolve(values[0]);
				} else {
					var zip = new JSZip();
					var rootFolder = zip.folder("");
					for(var i = 0; i < values.length; i++) {
						rootFolder.file(
							values[i].fileName,
							values[i].blob,
							{date: GrahaReporter.current}
						);
					}
					if(GrahaReporter.legacy) {
						zip.generateAsync({
							type : "blob",
							encodeFileName: function(str) {
								return iconv.encode(str, "EUC-KR");
							},
							mimeType: GrahaReporter.mimeType
						}).then(function (blob) {
							resolve({
								blob: blob,
								mimeType: GrahaReporter.mimeType,
								fileName: GrahaReporter.fileName
							});
						}).catch(function(error) {
							reject({
								code: "016",
								message: "원인을 알 수 없는 에러가 발생했습니다",
								detail: error
							});
						});
					} else {
						zip.generateAsync({
							type : "blob",
							mimeType: GrahaReporter.mimeType
						}).then(function (blob) {
							resolve({
								blob: blob,
								mimeType: GrahaReporter.mimeType,
								fileName: GrahaReporter.fileName
							});
						}).catch(function(error) {
							reject({
								code: "017",
								message: "원인을 알 수 없는 에러가 발생했습니다",
								detail: error
							});
						});
					}
				}
			} else {
				reject({
					code: "018",
					message: "원인을 알 수 없는 에러가 발생했습니다",
					detail: null
				});
			}
		}).catch(function(error) {
			reject(error);
		});
	});
};
GrahaReporter.blob = function(obj) {
	if(obj.data) {
		GrahaReporter.prepareInternal();
		GrahaReporter.fileName = obj.fileName;
		GrahaReporter.entries = obj.entries;
		if(obj.mimeType) {
			GrahaReporter.mimeType = obj.mimeType;
		} else {
			GrahaReporter.mimeType = null;
		}
		var tasks = new Array();
		for(var i = 0; i < obj.entries.length; i++) {
			tasks.push(GrahaReporter.processInternal(obj.data, obj.entries[i]));
		}
		return new Promise(function(resolve, reject) {
			Promise.all(tasks).then(function(values) {
				resolve(values);
			}).catch(function(error) {
//				console.error(error);
				reject(error);
			});
		});
	} else if(obj.dataUrl) {
		if(obj.dataUrl != null) {
			return new Promise(function(resolve, reject) {
				$.ajax({
					url: obj.dataUrl,
					processData: false,
					contentType: "text/xml",
					type: 'GET',
					success: function(data, textStatus, jqXHR) {
						if(obj.check) {
							if(!obj.check(data)) {
								reject({
									code: "000",
									message: "데이타 무결성 검사를 통과하지 못했습니다",
									detail: null
								});
							}
						}
						GrahaReporter.dataUrl = obj.dataUrl;
						obj.data = data;
						resolve(GrahaReporter.blob(obj));
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.error(jqXHR);
						console.error(textStatus);
						console.error(errorThrown);
						reject({
							code: "008",
							message: "서버에서 데이타를 가져오지 못했습니다",
							detail: err
						});
					}
				});
			});
		} else {
			return Promise.reject({
				code: "009",
				message: "데이타를 가져올 주소가 누락되었습니다",
				detail: null
			});
		}
	} else {
		return Promise.reject({
			code: "010",
			message: "데이타를 가져올 주소가 누락되었습니다",
			detail: null
		});
	}
};
GrahaReporter.processInternal = function(xml, entry) {
	return new Promise(function(resolve, reject) {
		JSZipUtils.getBinaryContent(entry.templateUrl, function(err, zipData) {
			if(err) {
				console.error(err);
				reject({
					code: "001",
					message: "원인을 알 수 없는 에러가 발생했습니다",
					detail: err
				});
			}
			JSZip.loadAsync(zipData).then(function (zip) {
				var tasks = new Array();
				zip.forEach(function (relativePath, file) {
					if(file.dir) {
					} else {
						if(relativePath.lastIndexOf(".xslt") == (relativePath.length - 5)) {
							tasks.push(GrahaReporter.stringFromZip(file, relativePath));
						}
					}
				});
				if(tasks.length == 0) {
					reject({
						code: "019",
						message: "템플릿 파일이 잘못되었습니다",
						detail: null
					});
				}
				Promise.all(tasks).then(function(values) {
					if(values != null && values.length > 0) {
						for(var i = 0; i < values.length; i++) {
							var result = null;
							try {
								result = GrahaReporter.transformInternal(xml, values[i].xslData);
							} catch(error) {
								reject({
									code: "014",
									message: "XSLT 변환 과정에서 알 수 없는 에러가 발생했습니다",
									detail: error
								});
							}
							if(result != null) {
								zip.remove(values[i].relativePath);
								zip.file(
									values[i].relativePath.substring(0, values[i].relativePath.length - 5),
									result,
									{date: GrahaReporter.current}
								);
							} else {
								reject({
									code: "015",
									message: "원인을 알 수 없는 에러가 발생했습니다",
									detail: null
								});
							}
						}
						if(JSZip.support.blob) {
							zip.generateAsync({type : "blob", mimeType: entry.mimeType}).then(function (blob) {
								resolve({
									blob: blob,
									mimeType: entry.mimeType,
									fileName: entry.fileName
								});
							}).catch(function(error) {
								reject({
									code: "013",
									message: "원인을 알 수 없는 에러가 발생했습니다",
									detail: error
								});
							});
						} else {
							reject({
								code: "012",
								message: "BLOB 를 지원하지 않습니다",
								detail: null
							});
						}
					} else {
						reject({
							code: "011",
							message: "원인을 알 수 없는 에러가 발생했습니다",
							detail: null
						});
					}
				}).catch(function(error) {
					console.error(error);
					reject(error);
				});
			});
		});
	});
};
GrahaReporter.stringFromZip = function(file, relativePath) {
	return new Promise(function(resolve, reject) {
		file.async("string").then(
			function success(xslData) {
				resolve({
					relativePath: relativePath,
					xslData: xslData
				});
			},
			function error(e) {
				console.error(e);
				reject({
					code: "002",
					message: "원인을 알 수 없는 에러가 발생했습니다",
					detail: e
				});
			},
			function reject(e) {
				console.error(e);
				reject({
					code: "003",
					message: "원인을 알 수 없는 에러가 발생했습니다",
					detail: e
				});
			}
		);
	});
};
GrahaReporter.transformInternal = function(xml, xslData) {
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
			console.error(error);
			console.log(xslData);
			throw error;
		}
	}
};