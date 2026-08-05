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
 * GrahaViewer
 * odt 혹은 hwpx 을 HTML 로 변환한다.

 * @author HeonJik, KIM (https://graha.kr)
 * @version 0.7.1.2
 * @since 0.7
 * 최종 버전은 다음의 경로에서 다운로드 할 수 있다.
 * https://github.com/logicielkr/client_lib/tree/master/GrahaViewer/0.7.1.2
 */

function GrahaViewer() {
	
}
GrahaViewer.converter = null;
GrahaViewer.opts = null;
GrahaViewer.clearAll = false;
GrahaViewer.menus = null;
GrahaViewer.convert = function(source, opts, menus) {
	if(opts && opts != null) {
		GrahaViewer.opts = opts;
	}
	if(menus && menus != null) {
		GrahaViewer.menus = menus;
	} else {
		GrahaViewer.menus = GrahaMenus.default();
	}
	GrahaViewer.menus.setMode("inline");
	if(opts && opts != null && opts.standalone) {
	} else {
		GrahaViewer.clearAll = true;
	}
	GrahaViewer.close().then(function(result) {
		GrahaViewer.initMenu(opts).then(function (result) {
			if(GrahaViewer.converter == null) {
				GrahaViewer.converter = new GrahaConverter(opts);
			}
			window.devicePixelRatio = 1.25;
			GrahaViewer.detectFileFormat(source).then(function(data) {
				var options = {format: "splitted", adjustScale: true, sourceType: "zip", fileFormat: data.fileFormat};
				if(opts && opts != null && opts.fileName && opts.fileName != null) {
					options.fileName = opts.fileName;
				}
				GrahaConverter.detectFileName(source, options);
					GrahaViewer.converter.convert([data.zip, data.blob], options).then(function() {
						GrahaViewer.displayMenu(false);
					}).catch(function(error) {
						console.error(error);
						$("div.graha_viewer_container").show();
					});
			}).catch(function(error) {
				console.error(error);
			});
		}).catch(function(error) {
			console.error(error);
		});
	}).catch(function(error) {
		console.error(error);
	});
};
GrahaViewer.detectFileFormatFromZip = function(zip, blob) {
	return new Promise(function(resolve, reject) {
		zip.file("mimetype").async("string").then(function(mimeType) {
			var fileFormat = null;
			if(mimeType == "application/hwp+zip") {
				fileFormat = "hwpx";
			} else if(mimeType == "application/vnd.oasis.opendocument.text") {
				fileFormat = "odt";
			}
			resolve({mimeType: mimeType, fileFormat: fileFormat, zip: zip, blob: blob});
		}).catch(function(error) {
			console.error(error);
			reject(error);
		});
	});
};
GrahaViewer.detectFileFormatFromBlob = function(blob) {
	return new Promise(function(resolve, reject) {
		if(blob instanceof JSZip) {
			GrahaViewer.detectFileFormatFromZip(blob, null).then(function(data) {
				resolve(data);
			}).catch(function(error) {
				console.error(error);
				reject(error);
			});
		} else {
			var jSZip = new JSZip();
			jSZip.loadAsync(blob).then(function(zip) {
				GrahaViewer.detectFileFormatFromZip(zip, blob).then(function(data) {
					resolve(data);
				}).catch(function(error) {
					console.error(error);
					reject(error);
				});
			}).catch(function(error) {
				console.error(error);
				reject(error);
			});
		}
	});
};
GrahaViewer.detectFileFormat = function(source) {
	return new Promise(function(resolve, reject) {
		if(source && source != null) {
			if(typeof(source) == "string") {
				JSZipUtils.getBinaryContent(source, function(err, zipData) {
					if(err) {
						console.error(err);
						reject(err);
					} else {
						GrahaViewer.detectFileFormatFromBlob(zipData).then(function(data) {
							resolve(data);
						}).catch(function(error) {
							console.error(error);
							reject(error);
						});
					}
				});
			} else {
				GrahaViewer.detectFileFormatFromBlob(source).then(function(data) {
					resolve(data);
				}).catch(function(error) {
					console.error(error);
					reject(error);
				});
			}
		} else {
			reject("source is null");
		}
	});
};
GrahaViewer.fileName = function(source) {
	return GrahaConverter.fileName(source);
};
GrahaViewer.close = function() {
	GrahaViewer.removeGrahaViewerPrintCSS();
	return new Promise(function(resolve, reject) {
		try {
			$(window).off("keydown");
			if(GrahaViewer.converter != null) {
				GrahaViewer.converter.clearAll();
			}
			if(GrahaViewer.clearAll) {
				$("div.graha_viewer_container").remove();
				$("div#graha_viewer_menu_wrapper").remove();
			} else {
				if(GrahaViewer.menus && GrahaViewer.menus != null) {
					GrahaViewer.menus.hideWithoutFileAction();
				}
			}
			GrahaViewer.removeBeforePrintEventListener();
			GrahaViewer.removeAfterPrintEventListener();
			GrahaViewer.removeResizeEventListener();
			GrahaViewer.removeCopyEventListener();
			window.setTimeout(function() {
				$("body").css("margin-top", "");
				resolve(true);
			}, 10);
		} catch (error) {
			reject(error);
		}
	});
};
GrahaViewer.split = function() {
	if(GrahaViewer.converter != null) {
		GrahaViewer.converter.split();
	}
};
GrahaViewer.printer = function() {
	if(window.document.documentMode) {
		alert("IE 11 에서는 인쇄기능을 지원하지 않습니다.  PDF로 변환해서 PDF를 인쇄해 주세요.");
	} else {
		window.print();
	}
};
GrahaViewer.pdf = function() {
	if(GrahaViewer.converter != null) {
		GrahaViewer.converter.pdf();
	} else {
		console.error("GrahaViewer.converter is null");
	}
};
GrahaViewer.download = function() {
	if(GrahaViewer.converter != null) {
		GrahaViewer.converter.download();
	} else {
		console.error("GrahaViewer.converter is null");
	}
};
GrahaViewer.removeGrahaViewerPrintCSS = function() {
	var printCSS = null;
	var links = document.getElementsByTagName('link');
	for(let i = (links.length - 1); i >= 0 ; i--) {
		var href = links.item(i).href;
		if(
			href.lastIndexOf("/GrahaViewer.css") >= 0 &&
			(href.length - "/GrahaViewer.css".length) == href.lastIndexOf("/GrahaViewer.css")
		) {
			printCSS = href.substring(0, href.lastIndexOf("/GrahaViewer.css") + 1) + "GrahaViewer.print.css"
		} else if(
			href.lastIndexOf("/GrahaViewer.print.css") >= 0 &&
			(href.length - "/GrahaViewer.print.css".length) == href.lastIndexOf("/GrahaViewer.print.css")
		) {
			$(links.item(i)).remove();
		}
	}
	return printCSS;
};
GrahaViewer.insertGrahaViewerPrintCSS = function() {
	return new Promise(function(resolve, reject) {
		var printCSS = GrahaViewer.removeGrahaViewerPrintCSS();
		if(printCSS == null) {
			reject("css for print is not find");
		} else {
			var link = document.createElement('link');
			link.setAttribute("rel", "stylesheet");
			link.href = printCSS;
			link.media = "print";
			 
			link.onload = function() {
				resolve(link);
			}
			link.onerror = function() {
				reject("css for print is not loaded");
			}
			document.getElementsByTagName('HEAD').item(0).appendChild(link);
		}
	});	
};
GrahaViewer.displayMenu = function(modifyDocumentTitle) {
	window.setTimeout(function() {
		if(GrahaViewer.converter != null) {
			if(modifyDocumentTitle && GrahaViewer.converter.getDownloadFileName() && GrahaViewer.converter.getDownloadFileName() != null) {
				document.title = GrahaViewer.converter.getDownloadFileName();
			}
			if(
				$("div#GrahaHtmlConverterWrapper div.graha_header").length > 1 ||
				$("div#GrahaHtmlConverterWrapper div.graha_footer").length > 1
			) {
				alert("지원하는 않는 항목이 있어서, Split 나 PDF 변환 기능을 사용할 수 없습니다.");
			} else {
				if(GrahaViewer.menus && GrahaViewer.menus != null) {
					GrahaViewer.menus.show("pdf");
					GrahaViewer.insertGrahaViewerPrintCSS().then(function(link) {
						GrahaViewer.menus.show("print");
					}).catch(function(error) {
						console.error(error);
					});
				}
			}
			if(GrahaViewer.converter.downloadable()) {
				if(GrahaViewer.menus && GrahaViewer.menus != null) {
					GrahaViewer.menus.show("download");
				}
			}
			if(GrahaViewer.menus && GrahaViewer.menus != null) {
				GrahaViewer.menus.show("close");
			}
			$("div.graha_viewer_container").show();
			$(window).off("keydown");
			$(window).keydown(function(event) {
				if(GrahaViewer.menus && GrahaViewer.menus != null) {
					var exists = GrahaViewer.menus.handleShortcut(event);
					if(exists) {
						event.preventDefault();
						return false;
					}
				}
			});
			GrahaViewer.addBeforePrintEventListener();
			GrahaViewer.addAfterPrintEventListener();
			GrahaViewer.addResizeEventListener();
			GrahaViewer.addCopyEventListener();
		}
	}, 10);
};
GrahaViewer.ready = function(opts, menus) {
	if(opts && opts != null) {
		GrahaViewer.opts = opts;
	}
//	GrahaViewer.addBeforePrintEventListener();
//	GrahaViewer.addAfterPrintEventListener();
//	GrahaViewer.addResizeEventListener();
//	GrahaViewer.addCopyEventListener();
	$(window).on("load", function() {
		if(document.fonts) {
			document.fonts.ready.then(function(fontFaceSet) {
				window.setTimeout(function() {
					GrahaViewer.init(opts, menus);
				}, 1000);
			});
		} else {
			GrahaViewer.IEReady();
		}
	});
};
GrahaViewer.init = function(opts, menus) {
	if(menus && menus != null) {
		GrahaViewer.menus = menus;
	} else {
		GrahaViewer.menus = GrahaMenus.default();
	}
	var params = new URLSearchParams(document.location.search.substring(1));
	if(params.get("path") != null && params.get("path") != "") {
		GrahaViewer.menus.setMode("viewer");
	} else {
		GrahaViewer.menus.setMode("standalone");
	}
	GrahaViewer.close().then(function(result) {
		GrahaViewer.initMenu(opts).then(function (result) {
			GrahaViewer.addFileChangeEventListener();
			$("div.graha_viewer_container").on("drop", function(event) {
				GrahaViewer.dropHandler(event);
			});
			$("div.graha_viewer_container").on("dragover", function(event) {
				GrahaViewer.dragOverHandler(event);
			});
			var params = new URLSearchParams(document.location.search.substring(1));
			if(params.get("path") != null && params.get("path") != "") {
				if(GrahaViewer.converter == null) {
					GrahaViewer.converter = new GrahaConverter(opts);
				}
				var fileName = params.get("name");
				window.devicePixelRatio = 1.25;
				GrahaViewer.detectFileFormat(params.get("path")).then(function(data) {
					var options = {format: "splitted", adjustScale: true, sourceType: "zip", fileFormat: data.fileFormat};
					if(fileName && fileName != null) {
						options.downloadFileName = fileName;
					} else {
						GrahaConverter.detectFileName(params.get("path"), options);
					}
					GrahaViewer.converter.convert([data.zip, data.blob], options).then(function() {
						GrahaViewer.displayMenu(true);
					}).catch(function(error) {
						console.error(error);
						$("div.graha_viewer_container").show();
					});
				}).catch(function(error) {
					console.error(error);
				});
			}
		}).catch(function(error) {
			console.error(error);
		});
	}).catch(function(error) {
		console.error(error);
	});
};
GrahaViewer.IEReady = function(opts, menus) {
	if(hasFont("Nanum Myeongjo") && hasFont("Nanum Gothic")) {
		window.setTimeout(function() {
			GrahaViewer.init(opts, menus);
		}, 1000);
	} else {
		window.setTimeout(function() {
			GrahaViewer.IEReady(opts, menus);
		}, 300);
	}
}
GrahaViewer.removeDragData = function(event) {
	if(event.dataTransfer) {
		if(event.dataTransfer.items) {
			event.dataTransfer.items.clear();
		} else {
			event.dataTransfer.clearData();
		}
	}
};
GrahaViewer.dropHandler = function(event) {
	event.preventDefault();
	var file = null;
	if(event.dataTransfer) {
		if(event.dataTransfer.items) {
			if(event.dataTransfer.items.length > 0) {
				file = event.dataTransfer.items[0].getAsFile();
			}
		} else if(event.dataTransfer.files) {
			if(event.dataTransfer.files.length > 0) {
				file = event.dataTransfer.files[0];
			}
		}
	}
	if(file != null) {
		if(GrahaViewer.converter == null) {
			GrahaViewer.converter = new GrahaConverter(GrahaViewer.opts);
		}
		$("div.graha_viewer_container").hide();
		if(GrahaViewer.menus && GrahaViewer.menus != null) {
			GrahaViewer.menus.hideWithoutFileAction();
		}
		window.devicePixelRatio = 1.25;
		GrahaViewer.close().then(function(result) {
			GrahaViewer.detectFileFormat(file).then(function(data) {
				var options = {format: "splitted", adjustScale: true, sourceType: "zip", fileFormat: data.fileFormat};
				GrahaConverter.detectFileName(file, options);
				GrahaViewer.converter.convert([data.zip, data.blob], options).then(function() {
					GrahaViewer.displayMenu(true);
				}).catch(function(error) {
					console.error(error);
					$("div.graha_viewer_container").show();
				});
			}).catch(function(error) {
				console.error(error);
			});
		}).catch(function(error) {
			console.error(error);
		});
	}
	GrahaViewer.removeDragData(event)
};
GrahaViewer.dragOverHandler = function(event) {
	event.preventDefault();
};
GrahaViewer.addFileChangeEventListener = function() {
	if(GrahaViewer.menus && GrahaViewer.menus != null) {
		var files = GrahaViewer.menus.find("file");
		if(files != null && Array.isArray(files) && files.length > 0) {
			for(var i = 0; i < files.length; i++) {
				$(files[i].selector()).on("change", function() {
					for(var i = 0; i < this.files.length; i++) {
						var file = this.files[i];
						if(GrahaViewer.converter == null) {
							GrahaViewer.converter = new GrahaConverter(GrahaViewer.opts);
						}
						if(GrahaViewer.menus && GrahaViewer.menus != null) {
							GrahaViewer.menus.hideWithoutFileAction();
						}
						window.devicePixelRatio = 1.25;
						GrahaViewer.close().then(function(result) {
							GrahaViewer.detectFileFormat(file).then(function(data) {
								var options = {format: "splitted", adjustScale: true, sourceType: "zip", fileFormat: data.fileFormat};
								GrahaConverter.detectFileName(file, options);
								GrahaViewer.converter.convert([data.zip, data.blob], options).then(function() {
									GrahaViewer.displayMenu(true);
								}).catch(function(error) {
									console.error(error);
									$("div.graha_viewer_container").show();
								});
							}).catch(function(error) {
								console.error(error);
							});
						}).catch(function(error) {
							console.error(error);
						});
					}
				});
			}
		}
	}
	if(GrahaViewer.menus && GrahaViewer.menus != null) {
		GrahaViewer.menus.show("file");
	}
};
GrahaViewer.resizeEventListener = function(event) {
	if(GrahaViewer.debounceTimer && GrahaViewer.debounceTimer != null) {
		window.clearTimeout(GrahaViewer.debounceTimer);
	}
	GrahaViewer.debounceTimer = window.setTimeout(function() {
		GrahaViewer.converter.applyScale(GrahaViewer.converter.calScaleRatio());
	}, 300);
};
GrahaViewer.addResizeEventListener = function() {
	window.addEventListener("resize", GrahaViewer.resizeEventListener);
};
GrahaViewer.removeResizeEventListener = function() {
	window.removeEventListener("resize", GrahaViewer.resizeEventListener);
};
GrahaViewer.copyEventListener = function(event) {
	var selection = window.getSelection();
	if(selection != null) {
		try {
			var selectedText = selection.toString();
			var customText = selectedText.replace(/\u{2000}/ug, ' ').replace(/\u{180E}/ug, '').replace(/\u{00A0}/ug, '');
			event.clipboardData.setData("text/plain", customText);
			event.preventDefault();
		} catch (error) {
			console.error(error);
		}
	}
};

GrahaViewer.addCopyEventListener = function() {
	window.addEventListener("copy", GrahaViewer.copyEventListener);
};
GrahaViewer.removeCopyEventListener = function() {
	window.removeEventListener("copy", GrahaViewer.copyEventListener);
};

GrahaViewer.beforePrintEventListener = function(event) {
	if(window.document.documentMode) {
		alert("IE 11 에서는 인쇄기능을 지원하지 않습니다.  PDF로 변환해서 PDF를 인쇄해 주세요.");
		event.preventDefault();
		return false;
	} else 	if(GrahaViewer.converter != null) {
		GrahaViewer.converter.resetScale();
	}
};
GrahaViewer.addBeforePrintEventListener = function() {
	window.addEventListener("beforeprint", GrahaViewer.beforePrintEventListener);
};
GrahaViewer.removeBeforePrintEventListener = function() {
	window.removeEventListener("beforeprint", GrahaViewer.beforePrintEventListener);
};
GrahaViewer.afterPrintEventListener = function(event) {
	if(GrahaViewer.converter != null) {
		GrahaViewer.converter.applyScale(GrahaViewer.converter.calScaleRatio());
	}
};
GrahaViewer.addAfterPrintEventListener = function() {
	window.addEventListener("afterprint", GrahaViewer.afterPrintEventListener);
};
GrahaViewer.removeAfterPrintEventListener = function() {
	window.removeEventListener("afterprint", GrahaViewer.afterPrintEventListener);
};
GrahaViewer.initMenu = function() {
	JSZip.support.nodebuffer = false;
	return new Promise(function(resolve, reject) {
		window.setTimeout(function() {
			try {
				var menuWrapper = document.createElement("div");
				menuWrapper.setAttribute("id", "graha_viewer_menu_wrapper");
				var menuItems = document.createElement("div");
				menuItems.setAttribute("id", "graha_viewer_menu_items");
				
				if(GrahaViewer.menus && GrahaViewer.menus != null) {
					var items = GrahaViewer.menus.items();
					for(var i = 0; i < items.length; i++) {
						var node = items[i].node(GrahaViewer.menus.mode());
						if(node != null) {
							menuItems.appendChild(node);
						}
					}
				}

				menuWrapper.appendChild(menuItems);
				
				var container =  document.createElement("div");
				container.setAttribute("class", "graha_viewer_container");
				
				if(document.body.prepend) {
					document.body.prepend(menuWrapper);
					document.body.prepend(container);
				} else {
					if(document.body.firstChild && document.body.firstChild != null) {
						document.body.insertBefore(menuWrapper, document.body.firstChild);
						document.body.insertBefore(container, document.body.firstChild);
					} else {
						document.body.appendChild(menuWrapper);
						document.body.appendChild(container);
					}
				}
				resolve(true);
			} catch (error) {
				reject(error);
			}
		}, 10);
	});
};