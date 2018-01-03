/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "40bb1bbf413318b71df8"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(9)(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(20);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var Vue // late bind
var version
var map = (window.__VUE_HOT_MAP__ = Object.create(null))
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) { return }
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
        'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: []
  }
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render
    options.render = function (h, ctx) {
      var instances = map[id].instances
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent)
      }
      return render(h, ctx)
    }
  } else {
    injectHook(options, initHookName, function() {
      var record = map[id]
      if (!record.Ctor) {
        record.Ctor = this.constructor
      }
      record.instances.push(this)
    })
    injectHook(options, 'beforeDestroy', function() {
      var instances = map[id].instances
      instances.splice(instances.indexOf(this), 1)
    })
  }
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook(options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing) ? existing.concat(hook) : [existing, hook]
    : [hook]
}

function tryWrap(fn) {
  return function (id, arg) {
    try {
      fn(id, arg)
    } catch (e) {
      console.error(e)
      console.warn(
        'Something went wrong during Vue component hot-reload. Full reload required.'
      )
    }
  }
}

function updateOptions (oldOptions, newOptions) {
  for (var key in oldOptions) {
    if (!(key in newOptions)) {
      delete oldOptions[key]
    }
  }
  for (var key$1 in newOptions) {
    oldOptions[key$1] = newOptions[key$1]
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render
    record.Ctor.options.staticRenderFns = options.staticRenderFns
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render
      instance.$options.staticRenderFns = options.staticRenderFns
      // reset static trees
      // pre 2.5, all static trees are cahced together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = []
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = []
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = []
      }
      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)
      instance.$forceUpdate()
    })
  } else {
    // functional or no instance created yet
    record.options.render = options.render
    record.options.staticRenderFns = options.staticRenderFns

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options)
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles
        if (injectStyles) {
          var render = options.render
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx)
            return render(h, ctx)
          }
        }
      }
      record.options._Ctor = null
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = []
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate()
      })
    }
  }
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = vendor_9e7d867a85f186716605;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(undefined);
// imports


// module
exports.push([module.i, "@media (max-width: 767px) {\n    /* On small screens, the nav menu spans the full width of the screen. Leave a space for it. */\n    body {\n        padding-top: 50px;\n    }\n}", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(true);
// imports


// module
exports.push([module.i, "\n.main-nav li .glyphicon {\n    margin-right: 10px;\n}\n\n/* Highlighting rules for nav menu items */\n.main-nav li a.router-link-active,\n.main-nav li a.router-link-active:hover,\n.main-nav li a.router-link-active:focus {\n    background-color: #4189C7;\n    color: white;\n}\n\n/* Keep the nav menu independent of scrolling and on top of other items */\n.main-nav {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    z-index: 1;\n}\n@media (min-width: 768px) {\n    /* On small screens, convert the nav menu to a vertical sidebar */\n.main-nav {\n        height: 100%;\n        width: calc(25% - 20px);\n}\n.main-nav .navbar {\n        border-radius: 0px;\n        border-width: 0px;\n        height: 100%;\n}\n.main-nav .navbar-header {\n        float: none;\n}\n.main-nav .navbar-collapse {\n        border-top: 1px solid #444;\n        padding: 0px;\n}\n.main-nav .navbar ul {\n        float: none;\n}\n.main-nav .navbar li {\n        float: none;\n        font-size: 15px;\n        margin: 6px;\n}\n.main-nav .navbar li a {\n        padding: 10px 16px;\n        border-radius: 4px;\n}\n.main-nav .navbar a {\n        /* If a menu item's text is too long, truncate it */\n        width: 100%;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n}\n}\n", "", {"version":3,"sources":["C:/code/ContactUs/ContactUs.Web/ClientApp/components/navmenu/navmenu.css"],"names":[],"mappings":";AAAA;IACI,mBAAmB;CACtB;;AAED,2CAA2C;AAC3C;;;IAGI,0BAA0B;IAC1B,aAAa;CAChB;;AAED,0EAA0E;AAC1E;IACI,gBAAgB;IAChB,OAAO;IACP,QAAQ;IACR,SAAS;IACT,WAAW;CACd;AAED;IACI,kEAAkE;AAClE;QACI,aAAa;QACb,wBAAwB;CAC3B;AACD;QACI,mBAAmB;QACnB,kBAAkB;QAClB,aAAa;CAChB;AACD;QACI,YAAY;CACf;AACD;QACI,2BAA2B;QAC3B,aAAa;CAChB;AACD;QACI,YAAY;CACf;AACD;QACI,YAAY;QACZ,gBAAgB;QAChB,YAAY;CACf;AACD;QACI,mBAAmB;QACnB,mBAAmB;CACtB;AACD;QACI,oDAAoD;QACpD,YAAY;QACZ,oBAAoB;QACpB,iBAAiB;QACjB,wBAAwB;CAC3B;CACJ","file":"navmenu.css","sourcesContent":[".main-nav li .glyphicon {\n    margin-right: 10px;\n}\n\n/* Highlighting rules for nav menu items */\n.main-nav li a.router-link-active,\n.main-nav li a.router-link-active:hover,\n.main-nav li a.router-link-active:focus {\n    background-color: #4189C7;\n    color: white;\n}\n\n/* Keep the nav menu independent of scrolling and on top of other items */\n.main-nav {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    z-index: 1;\n}\n\n@media (min-width: 768px) {\n    /* On small screens, convert the nav menu to a vertical sidebar */\n    .main-nav {\n        height: 100%;\n        width: calc(25% - 20px);\n    }\n    .main-nav .navbar {\n        border-radius: 0px;\n        border-width: 0px;\n        height: 100%;\n    }\n    .main-nav .navbar-header {\n        float: none;\n    }\n    .main-nav .navbar-collapse {\n        border-top: 1px solid #444;\n        padding: 0px;\n    }\n    .main-nav .navbar ul {\n        float: none;\n    }\n    .main-nav .navbar li {\n        float: none;\n        font-size: 15px;\n        margin: 6px;\n    }\n    .main-nav .navbar li a {\n        padding: 10px 16px;\n        border-radius: 4px;\n    }\n    .main-nav .navbar a {\n        /* If a menu item's text is too long, truncate it */\n        width: 100%;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n    }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
	 true ? factory(exports, __webpack_require__(0), __webpack_require__(35), __webpack_require__(36)) :
	typeof define === 'function' && define.amd ? define(['exports', 'vue', 'vue-class-component', 'reflect-metadata'], factory) :
	(factory((global.VuePropertyDecorator = {}),global.Vue,global.VueClassComponent));
}(this, (function (exports,vue,vueClassComponent) { 'use strict';

vue = vue && vue.hasOwnProperty('default') ? vue['default'] : vue;
var vueClassComponent__default = 'default' in vueClassComponent ? vueClassComponent['default'] : vueClassComponent;

/** vue-property-decorator verson 6.0.0 MIT LICENSE copyright 2017 kaorun343 */
'use strict';
/**
 * decorator of an inject
 * @param key key
 * @return PropertyDecorator
 */
function Inject(key) {
    return vueClassComponent.createDecorator(function (componentOptions, k) {
        if (typeof componentOptions.inject === 'undefined') {
            componentOptions.inject = {};
        }
        if (!Array.isArray(componentOptions.inject)) {
            componentOptions.inject[k] = key || k;
        }
    });
}
/**
 * decorator of a provide
 * @param key key
 * @return PropertyDecorator | void
 */
function Provide(key) {
    return vueClassComponent.createDecorator(function (componentOptions, k) {
        var provide = componentOptions.provide;
        if (typeof provide !== 'function' || !provide.managed) {
            var original_1 = componentOptions.provide;
            provide = componentOptions.provide = function () {
                var rv = Object.create((typeof original_1 === 'function' ? original_1.call(this) : original_1) || null);
                for (var i in provide.managed)
                    rv[provide.managed[i]] = this[i];
                return rv;
            };
            provide.managed = {};
        }
        provide.managed[k] = key || k;
    });
}
/**
 * decorator of model
 * @param  event event name
 * @return PropertyDecorator
 */
function Model(event, options) {
    if (options === void 0) { options = {}; }
    return function (target, key) {
        if (!Array.isArray(options) && typeof options.type === 'undefined') {
            options.type = Reflect.getMetadata('design:type', target, key);
        }
        vueClassComponent.createDecorator(function (componentOptions, k) {
            (componentOptions.props || (componentOptions.props = {}))[k] = options;
            componentOptions.model = { prop: k, event: event || k };
        })(target, key);
    };
}
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
function Prop(options) {
    if (options === void 0) { options = {}; }
    return function (target, key) {
        if (!Array.isArray(options) && typeof options.type === 'undefined') {
            options.type = Reflect.getMetadata('design:type', target, key);
        }
        vueClassComponent.createDecorator(function (componentOptions, k) {
            (componentOptions.props || (componentOptions.props = {}))[k] = options;
        })(target, key);
    };
}
/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
function Watch(path, options) {
    if (options === void 0) { options = {}; }
    var _a = options.deep, deep = _a === void 0 ? false : _a, _b = options.immediate, immediate = _b === void 0 ? false : _b;
    return vueClassComponent.createDecorator(function (componentOptions, handler) {
        if (typeof componentOptions.watch !== 'object') {
            componentOptions.watch = Object.create(null);
        }
        componentOptions.watch[path] = { handler: handler, deep: deep, immediate: immediate };
    });
}
// Code copied from Vue/src/shared/util.js
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = function (str) { return str.replace(hyphenateRE, '-$1').toLowerCase(); };
/**
 * decorator of an event-emitter function
 * @param  event The name of the event
 * @return MethodDecorator
 */
function Emit(event) {
    return function (target, key, descriptor) {
        key = hyphenate(key);
        var original = descriptor.value;
        descriptor.value = function emitter() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (original.apply(this, args) !== false)
                this.$emit.apply(this, [event || key].concat(args));
        };
    };
}

exports.Component = vueClassComponent__default;
exports.Vue = vue;
exports.Inject = Inject;
exports.Provide = Provide;
exports.Model = Model;
exports.Prop = Prop;
exports.Watch = Watch;
exports.Emit = Emit;

Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(10);
__webpack_require__(11);
module.exports = __webpack_require__(24);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(17);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: '',
  autoConnect: true
};
if (true) {
  var querystring = __webpack_require__(13);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  setOverrides(overrides);
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  if (options.autoConnect) {
    connect();
  }
}

/* istanbul ignore next */
function setOptionsAndConnect(overrides) {
  setOverrides(overrides);
  connect();
}

function setOverrides(overrides) {
  if (overrides.autoConnect) options.autoConnect = overrides.autoConnect == 'true';
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }

  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(16);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(18);
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(23);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
      } else {
        if (reporter) {
          if (obj.warnings.length > 0) {
            reporter.problems('warnings', obj);
          } else {
            reporter.cleanProblemsCache();
          }
          reporter.success();
        }
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    },
    setOptionsAndConnect: setOptionsAndConnect
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?path=__webpack_hmr&dynamicPublicPath=true", __webpack_require__(12)(module)))

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(14);
exports.encode = exports.stringify = __webpack_require__(15);


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(17)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};
for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

var ansiHTML = __webpack_require__(19);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

var Entities = __webpack_require__(20).AllHtmlEntities;
var entities = new Entities();

exports.showProblems =
function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
};

exports.clear =
function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
};

var problemColors = {
  errors: colors.red,
  warnings: colors.yellow
};

function problemType (type) {
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(21),
  Html4Entities: __webpack_require__(22),
  Html5Entities: __webpack_require__(6),
  AllHtmlEntities: __webpack_require__(6)
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "https://webpack.js.org/concepts/hot-module-replacement/"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { 				
  ignoreUnaccepted: true,
  ignoreDeclined: true,
  ignoreErrored: true,
  onUnaccepted: function(data) {
    console.warn("Ignored an update to unaccepted module " + data.chain.join(" -> "));
  },
  onDeclined: function(data) {
    console.warn("Ignored an update to declined module " + data.chain.join(" -> "));
  },
  onErrored: function(data) {
    console.error(data.error);
    console.warn("Ignored an error while updating module " + data.moduleId + " (" + data.type + ")");
  } 
}

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_site_css__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_site_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_site_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bootstrap__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_bootstrap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_router__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vee_validate__ = __webpack_require__(30);




__WEBPACK_IMPORTED_MODULE_2_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_3_vue_router__["default"]);


__WEBPACK_IMPORTED_MODULE_2_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_4_vee_validate__["a" /* default */]);

const routes = [
    { path: '/', component: __webpack_require__(31) },
    { path: '/contactus', component: __webpack_require__(33) }
];

new __WEBPACK_IMPORTED_MODULE_2_vue__["default"]({
    el: '#app-root',
    router: new __WEBPACK_IMPORTED_MODULE_3_vue_router__["default"]({ mode: 'history', routes: routes }),
    render: h => h(__webpack_require__(40))
});


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(26)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(4, function() {
			var newContent = __webpack_require__(4);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(27);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 27 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(3);

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(24);

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export install */
/* unused harmony export use */
/* unused harmony export directive */
/* unused harmony export mixin */
/* unused harmony export mapFields */
/* unused harmony export Validator */
/* unused harmony export ErrorBag */
/* unused harmony export Rules */
/* unused harmony export version */
/**
  * vee-validate v2.0.0
  * (c) 2017 Abdelrahman Awad
  * @license MIT
  */
// 

/**
 * Gets the data attribute. the name must be kebab-case.
 */
var getDataAttribute = function (el, name) { return el.getAttribute(("data-vv-" + name)); };

/**
 * Checks if the value is either null or undefined.
 */
var isNullOrUndefined = function (value) {
  return value === null || value === undefined;
};

/**
 * Sets the data attribute.
 */
var setDataAttribute = function (el, name, value) { return el.setAttribute(("data-vv-" + name), value); };

/**
 * Creates a proxy object if available in the environment.
 */
var createProxy = function (target, handler) {
  /* istanbul ignore next */
  if (typeof Proxy === 'undefined') {
    return target;
  }

  return new Proxy(target, handler);
};

/**
 * Creates the default flags object.
 */
var createFlags = function () { return ({
  untouched: true,
  touched: false,
  dirty: false,
  pristine: true,
  valid: null,
  invalid: null,
  validated: false,
  pending: false,
  required: false
}); };

/**
 * Shallow object comparison.
 */
var isEqual = function (lhs, rhs) {
  if (lhs instanceof RegExp && rhs instanceof RegExp) {
    return isEqual(lhs.source, rhs.source) && isEqual(lhs.flags, rhs.flags);
  }

  if (Array.isArray(lhs) && Array.isArray(rhs)) {
    if (lhs.length !== rhs.length) { return false; }

    for (var i = 0; i < lhs.length; i++) {
      if (!isEqual(lhs[i], rhs[i])) {
        return false;
      }
    }

    return true;
  }

  // if both are objects, compare each key recursively.
  if (isObject(lhs) && isObject(rhs)) {
    return Object.keys(lhs).every(function (key) {
      return isEqual(lhs[key], rhs[key]);
    }) && Object.keys(rhs).every(function (key) {
      return isEqual(lhs[key], rhs[key]);
    });
  }

  return lhs === rhs;
};

/**
 * Determines the input field scope.
 */
var getScope = function (el) {
  var scope = getDataAttribute(el, 'scope');
  if (isNullOrUndefined(scope) && el.form) {
    scope = getDataAttribute(el.form, 'scope');
  }

  return !isNullOrUndefined(scope) ? scope : null;
};

/**
 * Gets the value in an object safely.
 */
var getPath = function (path, target, def) {
  if ( def === void 0 ) def = undefined;

  if (!path || !target) { return def; }

  var value = target;
  path.split('.').every(function (prop) {
    if (! Object.prototype.hasOwnProperty.call(value, prop) && value[prop] === undefined) {
      value = def;

      return false;
    }

    value = value[prop];

    return true;
  });

  return value;
};

/**
 * Checks if path exists within an object.
 */
var hasPath = function (path, target) {
  var obj = target;
  return path.split('.').every(function (prop) {
    if (! Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }

    obj = obj[prop];

    return true;
  });
};

/**
 * Parses a rule string expression.
 */
var parseRule = function (rule) {
  var params = [];
  var name = rule.split(':')[0];

  if (~rule.indexOf(':')) {
    params = rule.split(':').slice(1).join(':').split(',');
  }

  return { name: name, params: params };
};

/**
 * Debounces a function.
 */
var debounce = function (fn, wait, immediate) {
  if ( wait === void 0 ) wait = 0;
  if ( immediate === void 0 ) immediate = false;

  if (wait === 0) {
    return fn;
  }

  var timeout;

  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var later = function () {
      timeout = null;
      if (!immediate) { fn.apply(void 0, args); }
    };
    /* istanbul ignore next */
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    /* istanbul ignore next */
    if (callNow) { fn.apply(void 0, args); }
  };
};

/**
 * Normalizes the given rules expression.
 */
var normalizeRules = function (rules) {
  // if falsy value return an empty object.
  if (!rules) {
    return {};
  }

  if (isObject(rules)) {
    // $FlowFixMe
    return Object.keys(rules).reduce(function (prev, curr) {
      var params = [];
      // $FlowFixMe
      if (rules[curr] === true) {
        params = [];
      } else if (Array.isArray(rules[curr])) {
        params = rules[curr];
      } else {
        params = [rules[curr]];
      }

      // $FlowFixMe
      if (rules[curr] !== false) {
        prev[curr] = params;
      }

      return prev;
    }, {});
  }

  if (typeof rules !== 'string') {
    warn('rules must be either a string or an object.');
    return {};
  }

  return rules.split('|').reduce(function (prev, rule) {
    var parsedRule = parseRule(rule);
    if (!parsedRule.name) {
      return prev;
    }

    prev[parsedRule.name] = parsedRule.params;
    return prev;
  }, {});
};

/**
 * Emits a warning to the console.
 */
var warn = function (message) {
  console.warn(("[vee-validate] " + message)); // eslint-disable-line
};

/**
 * Creates a branded error object.
 */
var createError = function (message) { return new Error(("[vee-validate] " + message)); };

/**
 * Checks if the value is an object.
 */
var isObject = function (obj) { return obj !== null && obj && typeof obj === 'object' && ! Array.isArray(obj); };

/**
 * Checks if a function is callable.
 */
var isCallable = function (func) { return typeof func === 'function'; };

/**
 * Check if element has the css class on it.
 */
var hasClass = function (el, className) {
  if (el.classList) {
    return el.classList.contains(className);
  }

  return !!el.className.match(new RegExp(("(\\s|^)" + className + "(\\s|$)")));
};

/**
 * Adds the provided css className to the element.
 */
var addClass = function (el, className) {
  if (el.classList) {
    el.classList.add(className);
    return;
  }

  if (!hasClass(el, className)) {
    el.className += " " + className;
  }
};

/**
 * Remove the provided css className from the element.
 */
var removeClass = function (el, className) {
  if (el.classList) {
    el.classList.remove(className);
    return;
  }

  if (hasClass(el, className)) {
    var reg = new RegExp(("(\\s|^)" + className + "(\\s|$)"));
    el.className = el.className.replace(reg, ' ');
  }
};

/**
 * Adds or removes a class name on the input depending on the status flag.
 */
var toggleClass = function (el, className, status) {
  if (!el || !className) { return; }

  if (status) {
    return addClass(el, className);
  }

  removeClass(el, className);
};

/**
 * Converts an array-like object to array, provides a simple polyfill for Array.from
 */
var toArray = function (arrayLike) {
  if (isCallable(Array.from)) {
    return Array.from(arrayLike);
  }

  var array = [];
  var length = arrayLike.length;
  for (var i = 0; i < length; i++) {
    array.push(arrayLike[i]);
  }

  return array;
};

/**
 * Assign polyfill from the mdn.
 */
var assign = function (target) {
  var others = [], len = arguments.length - 1;
  while ( len-- > 0 ) others[ len ] = arguments[ len + 1 ];

  /* istanbul ignore else */
  if (isCallable(Object.assign)) {
    return Object.assign.apply(Object, [ target ].concat( others ));
  }

  /* istanbul ignore next */
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  /* istanbul ignore next */
  var to = Object(target);
  /* istanbul ignore next */
  others.forEach(function (arg) {
    // Skip over if undefined or null
    if (arg != null) {
      Object.keys(arg).forEach(function (key) {
        to[key] = arg[key];
      });
    }
  });
  /* istanbul ignore next */
  return to;
};

var id = 0;
var idTemplate = '{id}';

/**
 * Generates a unique id.
 */
var uniqId = function () {
  // handle too many uses of uniqId, although unlikely.
  if (id >= 9999) {
    id = 0;
    // shift the template.
    idTemplate = idTemplate.replace('{id}', '_{id}');
  }

  id++;
  var newId = idTemplate.replace('{id}', String(id));

  return newId;
};

/**
 * finds the first element that satisfies the predicate callback, polyfills array.find
 */
var find = function (arrayLike, predicate) {
  var array = Array.isArray(arrayLike) ? arrayLike : toArray(arrayLike);
  for (var i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return array[i];
    }
  }

  return undefined;
};

/**
 * Returns a suitable event name for the input element.
 */
var getInputEventName = function (el) {
  if (el && (el.tagName === 'SELECT' || ~['radio', 'checkbox', 'file'].indexOf(el.type))) {
    return 'change';
  }

  return 'input';
};

var isBuiltInComponent = function (vnode) {
  if (!vnode) {
    return false;
  }

  var tag = vnode.componentOptions.tag;

  return /keep-alive|transition|transition-group/.test(tag);
};

var makeEventsArray = function (events) {
  return (typeof events === 'string' && events.length) ? events.split('|') : [];
};

var makeDelayObject = function (events, delay, delayConfig) {
  if (typeof delay === 'number') {
    return events.reduce(function (prev, e) {
      prev[e] = delay;
      return prev;
    }, {});
  }

  return events.reduce(function (prev, e) {
    if (typeof delay === 'object' && e in delay) {
      prev[e] = delay[e];
      return prev;
    }

    if (typeof delayConfig === 'number') {
      prev[e] = delayConfig;
      return prev;
    }

    prev[e] = (delayConfig && delayConfig[e]) || 0;

    return prev;
  }, {});
};

var deepParseInt = function (input) {
  if (typeof input === 'number') { return input; }

  if (typeof input === 'string') { return parseInt(input); }

  var map = {};
  for (var element in input) {
    map[element] = parseInt(input[element]);
  }

  return map;
};

var merge = function (target, source) {
  if (! (isObject(target) && isObject(source))) {
    return target;
  }

  Object.keys(source).forEach(function (key) {
    if (isObject(source[key])) {
      if (! target[key]) {
        assign(target, ( obj = {}, obj[key] = {}, obj ));
        var obj;
      }

      merge(target[key], source[key]);
      return;
    }

    assign(target, ( obj$1 = {}, obj$1[key] = source[key], obj$1 ));
    var obj$1;
  });

  return target;
};

// 

var ErrorBag = function ErrorBag () {
  this.items = [];
};

/**
 * Adds an error to the internal array.
 */
ErrorBag.prototype.add = function add (error) {
  // handle old signature.
  if (arguments.length > 1) {
    error = {
      field: arguments[0],
      msg: arguments[1],
      rule: arguments[2],
      scope: !isNullOrUndefined(arguments[3]) ? arguments[3] : null,
      regenerate: null
    };
  }

  error.scope = !isNullOrUndefined(error.scope) ? error.scope : null;
  this.items.push(error);
};

/**
 * Regenrates error messages if they have a generator function.
 */
ErrorBag.prototype.regenerate = function regenerate () {
  this.items.forEach(function (i) {
    i.msg = isCallable(i.regenerate) ? i.regenerate() : i.msg;
  });
};

/**
 * Updates a field error with the new field scope.
 */
ErrorBag.prototype.update = function update (id, error) {
  var item = find(this.items, function (i) { return i.id === id; });
  if (!item) {
    return;
  }

  var idx = this.items.indexOf(item);
  this.items.splice(idx, 1);
  item.scope = error.scope;
  this.items.push(item);
};

/**
 * Gets all error messages from the internal array.
 */
ErrorBag.prototype.all = function all (scope) {
  if (isNullOrUndefined(scope)) {
    return this.items.map(function (e) { return e.msg; });
  }

  return this.items.filter(function (e) { return e.scope === scope; }).map(function (e) { return e.msg; });
};

/**
 * Checks if there are any errors in the internal array.
 */
ErrorBag.prototype.any = function any (scope) {
  if (isNullOrUndefined(scope)) {
    return !!this.items.length;
  }

  return !!this.items.filter(function (e) { return e.scope === scope; }).length;
};

/**
 * Removes all items from the internal array.
 */
ErrorBag.prototype.clear = function clear (scope) {
    var this$1 = this;

  if (isNullOrUndefined(scope)) {
    scope = null;
  }

  for (var i = 0; i < this.items.length; ++i) {
    if (this$1.items[i].scope === scope) {
      this$1.items.splice(i, 1);
      --i;
    }
  }
};

/**
 * Collects errors into groups or for a specific field.
 */
ErrorBag.prototype.collect = function collect (field, scope, map) {
    if ( map === void 0 ) map = true;

  if (!field) {
    var collection = {};
    this.items.forEach(function (e) {
      if (! collection[e.field]) {
        collection[e.field] = [];
      }

      collection[e.field].push(map ? e.msg : e);
    });

    return collection;
  }

  field = !isNullOrUndefined(field) ? String(field) : field;
  if (isNullOrUndefined(scope)) {
    return this.items.filter(function (e) { return e.field === field; }).map(function (e) { return (map ? e.msg : e); });
  }

  return this.items.filter(function (e) { return e.field === field && e.scope === scope; })
    .map(function (e) { return (map ? e.msg : e); });
};
/**
 * Gets the internal array length.
 */
ErrorBag.prototype.count = function count () {
  return this.items.length;
};

/**
 * Finds and fetches the first error message for the specified field id.
 */
ErrorBag.prototype.firstById = function firstById (id) {
  var error = find(this.items, function (i) { return i.id === id; });

  return error ? error.msg : null;
};

/**
 * Gets the first error message for a specific field.
 */
ErrorBag.prototype.first = function first (field, scope) {
    var this$1 = this;
    if ( scope === void 0 ) scope = null;

  field = !isNullOrUndefined(field) ? String(field) : field;
  var selector = this._selector(field);
  var scoped = this._scope(field);

  if (scoped) {
    var result = this.first(scoped.name, scoped.scope);
    // if such result exist, return it. otherwise it could be a field.
    // with dot in its name.
    if (result) {
      return result;
    }
  }

  if (selector) {
    return this.firstByRule(selector.name, selector.rule, scope);
  }

  for (var i = 0; i < this.items.length; ++i) {
    if (this$1.items[i].field === field && (this$1.items[i].scope === scope)) {
      return this$1.items[i].msg;
    }
  }

  return null;
};

/**
 * Returns the first error rule for the specified field
 */
ErrorBag.prototype.firstRule = function firstRule (field, scope) {
  var errors = this.collect(field, scope, false);

  return (errors.length && errors[0].rule) || null;
};

/**
 * Checks if the internal array has at least one error for the specified field.
 */
ErrorBag.prototype.has = function has (field, scope) {
    if ( scope === void 0 ) scope = null;

  return !!this.first(field, scope);
};

/**
 * Gets the first error message for a specific field and a rule.
 */
ErrorBag.prototype.firstByRule = function firstByRule (name, rule, scope) {
    if ( scope === void 0 ) scope = null;

  var error = this.collect(name, scope, false).filter(function (e) { return e.rule === rule; })[0];

  return (error && error.msg) || null;
};

/**
 * Gets the first error message for a specific field that not match the rule.
 */
ErrorBag.prototype.firstNot = function firstNot (name, rule, scope) {
    if ( rule === void 0 ) rule = 'required';
    if ( scope === void 0 ) scope = null;

  var error = this.collect(name, scope, false).filter(function (e) { return e.rule !== rule; })[0];

  return (error && error.msg) || null;
};

/**
 * Removes errors by matching against the id.
 */
ErrorBag.prototype.removeById = function removeById (id) {
    var this$1 = this;

  for (var i = 0; i < this.items.length; ++i) {
    if (this$1.items[i].id === id) {
      this$1.items.splice(i, 1);
      --i;
    }
  }
};

/**
 * Removes all error messages associated with a specific field.
 */
ErrorBag.prototype.remove = function remove (field, scope, id) {
    var this$1 = this;

  field = !isNullOrUndefined(field) ? String(field) : field;
  var removeCondition = function (e) {
    if (e.id && id) {
      return e.id === id;
    }

    if (!isNullOrUndefined(scope)) {
      return e.field === field && e.scope === scope;
    }

    return e.field === field && e.scope === null;
  };

  for (var i = 0; i < this.items.length; ++i) {
    if (removeCondition(this$1.items[i])) {
      this$1.items.splice(i, 1);
      --i;
    }
  }
};

/**
 * Get the field attributes if there's a rule selector.
 */
ErrorBag.prototype._selector = function _selector (field) {
  if (field.indexOf(':') > -1) {
    var ref = field.split(':');
      var name = ref[0];
      var rule = ref[1];

    return { name: name, rule: rule };
  }

  return null;
};

/**
 * Get the field scope if specified using dot notation.
 */
ErrorBag.prototype._scope = function _scope (field) {
  if (field.indexOf('.') > -1) {
    var ref = field.split('.');
      var scope = ref[0];
      var name = ref.slice(1);

    return { name: name.join('.'), scope: scope };
  }

  return null;
};

// 

var LOCALE = 'en';

var Dictionary = function Dictionary (dictionary) {
  if ( dictionary === void 0 ) dictionary = {};

  this.container = {};
  this.merge(dictionary);
};

var prototypeAccessors$2 = { locale: {} };

prototypeAccessors$2.locale.get = function () {
  return LOCALE;
};

prototypeAccessors$2.locale.set = function (value) {
  LOCALE = value || 'en';
};

Dictionary.prototype.hasLocale = function hasLocale (locale) {
  return !!this.container[locale];
};

Dictionary.prototype.setDateFormat = function setDateFormat (locale, format) {
  if (!this.container[locale]) {
    this.container[locale] = {};
  }

  this.container[locale].dateFormat = format;
};

Dictionary.prototype.getDateFormat = function getDateFormat (locale) {
  if (!this.container[locale] || !this.container[locale].dateFormat) {
    return null;
  }

  return this.container[locale].dateFormat;
};

Dictionary.prototype.getMessage = function getMessage (locale, key, data) {
  var message = null;
  if (!this.hasMessage(locale, key)) {
    message = this._getDefaultMessage(locale);
  } else {
    message = this.container[locale].messages[key];
  }

  return isCallable(message) ? message.apply(void 0, data) : message;
};

/**
 * Gets a specific message for field. falls back to the rule message.
 */
Dictionary.prototype.getFieldMessage = function getFieldMessage (locale, field, key, data) {
  if (!this.hasLocale(locale)) {
    return this.getMessage(locale, key, data);
  }

  var dict = this.container[locale].custom && this.container[locale].custom[field];
  if (!dict || !dict[key]) {
    return this.getMessage(locale, key, data);
  }

  var message = dict[key];
  return isCallable(message) ? message.apply(void 0, data) : message;
};

Dictionary.prototype._getDefaultMessage = function _getDefaultMessage (locale) {
  if (this.hasMessage(locale, '_default')) {
    return this.container[locale].messages._default;
  }

  return this.container.en.messages._default;
};

Dictionary.prototype.getAttribute = function getAttribute (locale, key, fallback) {
    if ( fallback === void 0 ) fallback = '';

  if (!this.hasAttribute(locale, key)) {
    return fallback;
  }

  return this.container[locale].attributes[key];
};

Dictionary.prototype.hasMessage = function hasMessage (locale, key) {
  return !! (
    this.hasLocale(locale) &&
          this.container[locale].messages &&
          this.container[locale].messages[key]
  );
};

Dictionary.prototype.hasAttribute = function hasAttribute (locale, key) {
  return !! (
    this.hasLocale(locale) &&
          this.container[locale].attributes &&
          this.container[locale].attributes[key]
  );
};

Dictionary.prototype.merge = function merge$1 (dictionary) {
  merge(this.container, dictionary);
};

Dictionary.prototype.setMessage = function setMessage (locale, key, message) {
  if (! this.hasLocale(locale)) {
    this.container[locale] = {
      messages: {},
      attributes: {}
    };
  }

  this.container[locale].messages[key] = message;
};

Dictionary.prototype.setAttribute = function setAttribute (locale, key, attribute) {
  if (! this.hasLocale(locale)) {
    this.container[locale] = {
      messages: {},
      attributes: {}
    };
  }

  this.container[locale].attributes[key] = attribute;
};

Object.defineProperties( Dictionary.prototype, prototypeAccessors$2 );

// 

var normalizeValue = function (value) {
  if (isObject(value)) {
    return Object.keys(value).reduce(function (prev, key) {
      prev[key] = normalizeValue(value[key]);

      return prev;
    }, {});
  }

  if (isCallable(value)) {
    return value('{0}', ['{1}', '{2}', '{3}']);
  }

  return value;
};

var normalizeFormat = function (locale) {
  // normalize messages
  var messages = normalizeValue(locale.messages);
  var custom = normalizeValue(locale.custom);

  return {
    messages: messages,
    custom: custom,
    attributes: locale.attributes,
    dateFormat: locale.dateFormat
  };
};

var I18nDictionary = function I18nDictionary (i18n, rootKey) {
  this.i18n = i18n;
  this.rootKey = rootKey;
};

var prototypeAccessors$3 = { locale: {} };

prototypeAccessors$3.locale.get = function () {
  return this.i18n.locale;
};

prototypeAccessors$3.locale.set = function (value) {
  warn('Cannot set locale from the validator when using vue-i18n, use i18n.locale setter instead');
};

I18nDictionary.prototype.getDateFormat = function getDateFormat (locale) {
  return this.i18n.getDateTimeFormat(locale || this.locale);
};

I18nDictionary.prototype.setDateFormat = function setDateFormat (locale, value) {
  this.i18n.setDateTimeFormat(locale || this.locale, value);
};

I18nDictionary.prototype.getMessage = function getMessage (locale, key, data) {
  var path = (this.rootKey) + ".messages." + key;
  if (!this.i18n.te(path)) {
    return this.i18n.t(((this.rootKey) + ".messages._default"), locale, data);
  }

  return this.i18n.t(path, locale, data);
};

I18nDictionary.prototype.getAttribute = function getAttribute (locale, key, fallback) {
    if ( fallback === void 0 ) fallback = '';

  var path = (this.rootKey) + ".attributes." + key;
  if (!this.i18n.te(path)) {
    return fallback;
  }

  return this.i18n.t(path, locale);
};

I18nDictionary.prototype.getFieldMessage = function getFieldMessage (locale, field, key, data) {
  var path = (this.rootKey) + ".custom." + field + "." + key;
  if (this.i18n.te(path)) {
    return this.i18n.t(path);
  }

  return this.getMessage(locale, key, data);
};

I18nDictionary.prototype.merge = function merge$1 (dictionary) {
    var this$1 = this;

  Object.keys(dictionary).forEach(function (localeKey) {
    // i18n doesn't deep merge
    // first clone the existing locale (avoid mutations to locale)
    var clone = merge({}, getPath((localeKey + "." + (this$1.rootKey)), this$1.i18n.messages, {}));
    // Merge cloned locale with new one
    var locale = merge(clone, normalizeFormat(dictionary[localeKey]));
    this$1.i18n.mergeLocaleMessage(localeKey, ( obj = {}, obj[this$1.rootKey] = locale, obj ));
      var obj;
    if (locale.dateFormat) {
      this$1.i18n.setDateTimeFormat(localeKey, locale.dateFormat);
    }
  });
};

I18nDictionary.prototype.setMessage = function setMessage (locale, key, value) {
  this.merge(( obj$1 = {}, obj$1[locale] = {
      messages: ( obj = {}, obj[key] = value, obj )
    }, obj$1 ));
    var obj;
    var obj$1;
};

I18nDictionary.prototype.setAttribute = function setAttribute (locale, key, value) {
  this.merge(( obj$1 = {}, obj$1[locale] = {
      attributes: ( obj = {}, obj[key] = value, obj )
    }, obj$1 ));
    var obj;
    var obj$1;
};

Object.defineProperties( I18nDictionary.prototype, prototypeAccessors$3 );

// 

var defaultConfig = {
  locale: 'en',
  delay: 0,
  errorBagName: 'errors',
  dictionary: null,
  strict: true,
  fieldsBagName: 'fields',
  classes: false,
  classNames: null,
  events: 'input|blur',
  inject: true,
  fastExit: true,
  aria: true,
  validity: false,
  i18n: null,
  i18nRootKey: 'validation'
};

var currentConfig = assign({}, defaultConfig);
var dependencies = {
  dictionary: new Dictionary({
    en: {
      messages: {},
      attributes: {},
      custom: {}
    }
  })
};

var Config = function Config () {};

var staticAccessors$1 = { default: {},current: {} };

staticAccessors$1.default.get = function () {
  return defaultConfig;
};

staticAccessors$1.current.get = function () {
  return currentConfig;
};

Config.dependency = function dependency (key) {
  return dependencies[key];
};

/**
 * Merges the config with a new one.
 */
Config.merge = function merge$$1 (config) {
  currentConfig = assign({}, currentConfig, config);
  if (currentConfig.i18n) {
    Config.register('dictionary', new I18nDictionary(currentConfig.i18n, currentConfig.i18nRootKey));
  }
};

/**
 * Registers a dependency.
 */
Config.register = function register (key, value) {
  dependencies[key] = value;
};

/**
 * Resolves the working config from a Vue instance.
 */
Config.resolve = function resolve (context) {
  var selfConfig = getPath('$options.$_veeValidate', context, {});

  return assign({}, Config.current, selfConfig);
};

Object.defineProperties( Config, staticAccessors$1 );

/**
 * Generates the options required to construct a field.
 */
var Generator = function Generator () {};

Generator.generate = function generate (el, binding, vnode) {
  var model = Generator.resolveModel(binding, vnode);
  var options = Config.resolve(vnode.context);

  return {
    name: Generator.resolveName(el, vnode),
    el: el,
    listen: !binding.modifiers.disable,
    scope: Generator.resolveScope(el, binding, vnode),
    vm: Generator.makeVM(vnode.context),
    expression: binding.value,
    component: vnode.child,
    classes: options.classes,
    classNames: options.classNames,
    getter: Generator.resolveGetter(el, vnode, model),
    events: Generator.resolveEvents(el, vnode) || options.events,
    model: model,
    delay: Generator.resolveDelay(el, vnode, options),
    rules: Generator.resolveRules(el, binding),
    initial: !!binding.modifiers.initial,
    validity: options.validity,
    aria: options.aria,
    initialValue: Generator.resolveInitialValue(vnode)
  };
};

Generator.getCtorConfig = function getCtorConfig (vnode) {
  if (!vnode.child) { return null; }

  var config = getPath('child.$options.$_veeValidate', vnode);

  return config;
};

/**
 * Resolves the rules defined on an element.
 */
Generator.resolveRules = function resolveRules (el, binding) {
  if (!binding.value && (!binding || !binding.expression)) {
    return getDataAttribute(el, 'rules');
  }

  if (~['string', 'object'].indexOf(typeof binding.value.rules)) {
    return binding.value.rules;
  }

  return binding.value;
};

/**
 * @param {*} vnode
 */
Generator.resolveInitialValue = function resolveInitialValue (vnode) {
  var model = vnode.data.model || find(vnode.data.directives, function (d) { return d.name === 'model'; });

  return model && model.value;
};

/**
 * Creates a non-circular partial VM instance from a Vue instance.
 * @param {*} vm
 */
Generator.makeVM = function makeVM (vm) {
  return {
    get $el () {
      return vm.$el;
    },
    get $refs () {
      return vm.$refs;
    },
    $watch: vm.$watch ? vm.$watch.bind(vm) : function () {},
    $validator: vm.$validator ? {
      errors: vm.$validator.errors,
      validate: vm.$validator.validate.bind(vm.$validator),
      update: vm.$validator.update.bind(vm.$validator)
    } : null
  };
};

/**
 * Resolves the delay value.
 * @param {*} el
 * @param {*} vnode
 * @param {Object} options
 */
Generator.resolveDelay = function resolveDelay (el, vnode, options) {
  var delay = getDataAttribute(el, 'delay');
  var globalDelay = (options && 'delay' in options) ? options.delay : 0;

  if (!delay && vnode.child && vnode.child.$attrs) {
    delay = vnode.child.$attrs['data-vv-delay'];
  }

  if (!isObject(globalDelay)) {
    return deepParseInt(delay || globalDelay);
  }

  globalDelay.input = delay || 0;

  return deepParseInt(globalDelay);
};

/**
 * Resolves the events to validate in response to.
 * @param {*} el
 * @param {*} vnode
 */
Generator.resolveEvents = function resolveEvents (el, vnode) {
  var events = getDataAttribute(el, 'validate-on');

  if (!events && vnode.child && vnode.child.$attrs) {
    events = vnode.child.$attrs['data-vv-validate-on'];
  }

  if (!events && vnode.child) {
    var config = Generator.getCtorConfig(vnode);
    events = config && config.events;
  }

  return events;
};

/**
 * Resolves the scope for the field.
 * @param {*} el
 * @param {*} binding
 */
Generator.resolveScope = function resolveScope (el, binding, vnode) {
    if ( vnode === void 0 ) vnode = {};

  var scope = null;
  if (vnode.child && isNullOrUndefined(scope)) {
    scope = vnode.child.$attrs && vnode.child.$attrs['data-vv-scope'];
  }

  return !isNullOrUndefined(scope) ? scope : getScope(el);
};

/**
 * Checks if the node directives contains a v-model or a specified arg.
 * Args take priority over models.
 *
 * @return {Object}
 */
Generator.resolveModel = function resolveModel (binding, vnode) {
  if (binding.arg) {
    return binding.arg;
  }

  var model = vnode.data.model || find(vnode.data.directives, function (d) { return d.name === 'model'; });
  if (!model) {
    return null;
  }

  var watchable = /^[a-z_]+[0-9]*(\w*\.[a-z_]\w*)*$/i.test(model.expression) && hasPath(model.expression, vnode.context);
  if (!watchable) {
    return null;
  }

  return model.expression;
};

/**
   * Resolves the field name to trigger validations.
   * @return {String} The field name.
   */
Generator.resolveName = function resolveName (el, vnode) {
  var name = getDataAttribute(el, 'name');

  if (!name && !vnode.child) {
    return el.name;
  }

  if (!name && vnode.child && vnode.child.$attrs) {
    name = vnode.child.$attrs['data-vv-name'] || vnode.child.$attrs['name'];
  }

  if (!name && vnode.child) {
    var config = Generator.getCtorConfig(vnode);
    if (config && isCallable(config.name)) {
      var boundGetter = config.name.bind(vnode.child);

      return boundGetter();
    }

    return vnode.child.name;
  }

  return name;
};

/**
 * Returns a value getter input type.
 */
Generator.resolveGetter = function resolveGetter (el, vnode, model) {
  if (model) {
    return function () {
      return getPath(model, vnode.context);
    };
  }

  if (vnode.child) {
    var path = getDataAttribute(el, 'value-path') || (vnode.child.$attrs && vnode.child.$attrs['data-vv-value-path']);
    if (path) {
      return function () {
        return getPath(path, vnode.child);
      };
    }

    var config = Generator.getCtorConfig(vnode);
    if (config && isCallable(config.value)) {
      var boundGetter = config.value.bind(vnode.child);

      return function () {
        return boundGetter();
      };
    }

    return function () {
      return vnode.child.value;
    };
  }

  switch (el.type) {
  case 'checkbox': return function () {
    var els = document.querySelectorAll(("input[name=\"" + (el.name) + "\"]"));

    els = toArray(els).filter(function (el) { return el.checked; });
    if (!els.length) { return undefined; }

    return els.map(function (checkbox) { return checkbox.value; });
  };
  case 'radio': return function () {
    var els = document.querySelectorAll(("input[name=\"" + (el.name) + "\"]"));
    var elm = find(els, function (el) { return el.checked; });

    return elm && elm.value;
  };
  case 'file': return function (context) {
    return toArray(el.files);
  };
  case 'select-multiple': return function () {
    return toArray(el.options).filter(function (opt) { return opt.selected; }).map(function (opt) { return opt.value; });
  };
  default: return function () {
    return el && el.value;
  };
  }
};

// 

var DEFAULT_OPTIONS = {
  targetOf: null,
  initial: false,
  scope: null,
  listen: true,
  name: null,
  rules: {},
  vm: null,
  classes: false,
  validity: true,
  aria: true,
  events: 'input|blur',
  delay: 0,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  }
};

var Field = function Field (el, options) {
  if ( options === void 0 ) options = {};

  this.id = uniqId();
  this.el = el;
  this.updated = false;
  this.dependencies = [];
  this.watchers = [];
  this.events = [];
  this.delay = 0;
  this.rules = {};
  this._cacheId(options);
  this.classNames = assign({}, DEFAULT_OPTIONS.classNames);
  options = assign({}, DEFAULT_OPTIONS, options);
  this._delay = !isNullOrUndefined(options.delay) ? options.delay : 0; // cache initial delay
  this.validity = options.validity;
  this.aria = options.aria;
  this.flags = createFlags();
  this.vm = options.vm;
  this.component = options.component;
  this.ctorConfig = this.component ? getPath('$options.$_veeValidate', this.component) : undefined;
  this.update(options);
  this.updated = false;
};

var prototypeAccessors$1 = { validator: {},isRequired: {},isDisabled: {},alias: {},value: {},rejectsFalse: {} };

prototypeAccessors$1.validator.get = function () {
  if (!this.vm || !this.vm.$validator) {
    warn('No validator instance detected.');
    return { validate: function () {} };
  }

  return this.vm.$validator;
};

prototypeAccessors$1.isRequired.get = function () {
  return !!this.rules.required;
};

prototypeAccessors$1.isDisabled.get = function () {
  return !!(this.component && this.component.disabled) || !!(this.el && this.el.disabled);
};

/**
 * Gets the display name (user-friendly name).
 */
prototypeAccessors$1.alias.get = function () {
  if (this._alias) {
    return this._alias;
  }

  var alias = null;
  if (this.el) {
    alias = getDataAttribute(this.el, 'as');
  }

  if (!alias && this.component) {
    return this.component.$attrs && this.component.$attrs['data-vv-as'];
  }

  return alias;
};

/**
 * Gets the input value.
 */

prototypeAccessors$1.value.get = function () {
  if (!isCallable(this.getter)) {
    return undefined;
  }

  return this.getter();
};

/**
 * If the field rejects false as a valid value for the required rule.
 */

prototypeAccessors$1.rejectsFalse.get = function () {
  if (this.component && this.ctorConfig) {
    return !!this.ctorConfig.rejectsFalse;
  }

  if (!this.el) {
    return false;
  }

  return this.el.type === 'checkbox';
};

/**
 * Determines if the instance matches the options provided.
 */
Field.prototype.matches = function matches (options) {
  if (options.id) {
    return this.id === options.id;
  }

  if (options.name === undefined && options.scope === undefined) {
    return true;
  }

  if (options.scope === undefined) {
    return this.name === options.name;
  }

  if (options.name === undefined) {
    return this.scope === options.scope;
  }

  return options.name === this.name && options.scope === this.scope;
};

/**
 * Caches the field id.
 */
Field.prototype._cacheId = function _cacheId (options) {
  if (this.el && !options.targetOf) {
    setDataAttribute(this.el, 'id', this.id); // cache field id if it is independent and has a root element.
  }
};

/**
 * Updates the field with changed data.
 */
Field.prototype.update = function update (options) {
  this.targetOf = options.targetOf || null;
  this.initial = options.initial || this.initial || false;

  // update errors scope if the field scope was changed.
  if (!isNullOrUndefined(options.scope) && options.scope !== this.scope && isCallable(this.validator.update)) {
    this.validator.update(this.id, { scope: options.scope });
  }
  this.scope = !isNullOrUndefined(options.scope) ? options.scope
    : !isNullOrUndefined(this.scope) ? this.scope : null;
  this.name = (!isNullOrUndefined(options.name) ? String(options.name) : options.name) || this.name || null;
  this.rules = options.rules !== undefined ? normalizeRules(options.rules) : this.rules;
  this.model = options.model || this.model;
  this.listen = options.listen !== undefined ? options.listen : this.listen;
  this.classes = (options.classes || this.classes || false) && !this.component;
  this.classNames = isObject(options.classNames) ? merge(this.classNames, options.classNames) : this.classNames;
  this.getter = isCallable(options.getter) ? options.getter : this.getter;
  this._alias = options.alias || this._alias;
  this.events = (options.events) ? makeEventsArray(options.events) : this.events;
  this.delay = (options.delay) ? makeDelayObject(this.events, options.delay, this._delay) : makeDelayObject(this.events, this.delay, this._delay);
  this.updateDependencies();
  this.addActionListeners();

  // update required flag flags
  if (options.rules !== undefined) {
    this.flags.required = this.isRequired;
  }

  // validate if it was validated before and field was updated and there was a rules mutation.
  if (this.flags.validated && options.rules !== undefined && this.updated) {
    this.validator.validate(("#" + (this.id)));
  }

  this.updated = true;
  this.addValueListeners();

  // no need to continue.
  if (!this.el) {
    return;
  }

  this.updateClasses();
  this.updateAriaAttrs();
};

/**
 * Resets field flags and errors.
 */
Field.prototype.reset = function reset () {
    var this$1 = this;

  var defaults = createFlags();
  Object.keys(this.flags).filter(function (flag) { return flag !== 'required'; }).forEach(function (flag) {
    this$1.flags[flag] = defaults[flag];
  });

  this.addActionListeners();
  this.updateClasses();
  this.updateAriaAttrs();
  this.updateCustomValidity();
};

/**
 * Sets the flags and their negated counterparts, and updates the classes and re-adds action listeners.
 */
Field.prototype.setFlags = function setFlags (flags) {
    var this$1 = this;

  var negated = {
    pristine: 'dirty',
    dirty: 'pristine',
    valid: 'invalid',
    invalid: 'valid',
    touched: 'untouched',
    untouched: 'touched'
  };

  Object.keys(flags).forEach(function (flag) {
    this$1.flags[flag] = flags[flag];
    // if it has a negation and was not specified, set it as well.
    if (negated[flag] && flags[negated[flag]] === undefined) {
      this$1.flags[negated[flag]] = !flags[flag];
    }
  });

  if (
    flags.untouched !== undefined ||
    flags.touched !== undefined ||
    flags.dirty !== undefined ||
    flags.pristine !== undefined
  ) {
    this.addActionListeners();
  }
  this.updateClasses();
  this.updateAriaAttrs();
  this.updateCustomValidity();
};

/**
 * Determines if the field requires references to target fields.
*/
Field.prototype.updateDependencies = function updateDependencies () {
    var this$1 = this;

  // reset dependencies.
  this.dependencies.forEach(function (d) { return d.field.destroy(); });
  this.dependencies = [];

  // we get the selectors for each field.
  var fields = Object.keys(this.rules).reduce(function (prev, r) {
    if (Validator.isTargetRule(r)) {
      var selector = this$1.rules[r][0];
      if (r === 'confirmed' && !selector) {
        selector = (this$1.name) + "_confirmation";
      }

      prev.push({ selector: selector, name: r });
    }

    return prev;
  }, []);

  if (!fields.length || !this.vm || !this.vm.$el) { return; }

  // must be contained within the same component, so we use the vm root element constrain our dom search.
  fields.forEach(function (ref) {
      var selector = ref.selector;
      var name = ref.name;

    var el = null;
    // vue ref selector.
    if (selector[0] === '$') {
      el = this$1.vm.$refs[selector.slice(1)];
    } else {
      try {
        // try query selector
        el = this$1.vm.$el.querySelector(selector);
      } catch (err) {
        el = null;
      }
    }

    if (!el) {
      try {
        el = this$1.vm.$el.querySelector(("input[name=\"" + selector + "\"]"));
      } catch (err) {
        el = null;
      }
    }

    if (!el) {
      return;
    }

    var options = {
      vm: this$1.vm,
      classes: this$1.classes,
      classNames: this$1.classNames,
      delay: this$1.delay,
      scope: this$1.scope,
      events: this$1.events.join('|'),
      initial: this$1.initial,
      targetOf: this$1.id
    };

    // probably a component.
    if (isCallable(el.$watch)) {
      options.component = el;
      options.el = el.$el;
      options.getter = Generator.resolveGetter(el.$el, { child: el });
    } else {
      options.el = el;
      options.getter = Generator.resolveGetter(el, {});
    }

    this$1.dependencies.push({ name: name, field: new Field(options.el, options) });
  });
};

/**
 * Removes listeners.
 */
Field.prototype.unwatch = function unwatch (tag) {
    if ( tag === void 0 ) tag = null;

  if (!tag) {
    this.watchers.forEach(function (w) { return w.unwatch(); });
    this.watchers = [];
    return;
  }

  this.watchers.filter(function (w) { return tag.test(w.tag); }).forEach(function (w) { return w.unwatch(); });
  this.watchers = this.watchers.filter(function (w) { return !tag.test(w.tag); });
};

/**
 * Updates the element classes depending on each field flag status.
 */
Field.prototype.updateClasses = function updateClasses () {
  if (!this.classes || this.isDisabled) { return; }

  toggleClass(this.el, this.classNames.dirty, this.flags.dirty);
  toggleClass(this.el, this.classNames.pristine, this.flags.pristine);
  toggleClass(this.el, this.classNames.touched, this.flags.touched);
  toggleClass(this.el, this.classNames.untouched, this.flags.untouched);
  // make sure we don't set any classes if the state is undetermined.
  if (!isNullOrUndefined(this.flags.valid) && this.flags.validated) {
    toggleClass(this.el, this.classNames.valid, this.flags.valid);
  }

  if (!isNullOrUndefined(this.flags.invalid) && this.flags.validated) {
    toggleClass(this.el, this.classNames.invalid, this.flags.invalid);
  }
};

/**
 * Adds the listeners required for automatic classes and some flags.
 */
Field.prototype.addActionListeners = function addActionListeners () {
    var this$1 = this;

  // remove previous listeners.
  this.unwatch(/class/);

  var onBlur = function () {
    this$1.flags.touched = true;
    this$1.flags.untouched = false;
    if (this$1.classes) {
      toggleClass(this$1.el, this$1.classNames.touched, true);
      toggleClass(this$1.el, this$1.classNames.untouched, false);
    }

    // only needed once.
    this$1.unwatch(/^class_blur$/);
  };

  var inputEvent = getInputEventName(this.el);
  var onInput = function () {
    this$1.flags.dirty = true;
    this$1.flags.pristine = false;
    if (this$1.classes) {
      toggleClass(this$1.el, this$1.classNames.pristine, false);
      toggleClass(this$1.el, this$1.classNames.dirty, true);
    }

    // only needed once.
    this$1.unwatch(/^class_input$/);
  };

  if (this.component && isCallable(this.component.$once)) {
    this.component.$once('input', onInput);
    this.component.$once('blur', onBlur);
    this.watchers.push({
      tag: 'class_input',
      unwatch: function () {
        this$1.component.$off('input', onInput);
      }
    });
    this.watchers.push({
      tag: 'class_blur',
      unwatch: function () {
        this$1.component.$off('blur', onBlur);
      }
    });
    return;
  }

  if (!this.el) { return; }

  this.el.addEventListener(inputEvent, onInput);
  // Checkboxes and radio buttons on Mac don't emit blur naturally, so we listen on click instead.
  var blurEvent = ['radio', 'checkbox'].indexOf(this.el.type) === -1 ? 'blur' : 'click';
  this.el.addEventListener(blurEvent, onBlur);
  this.watchers.push({
    tag: 'class_input',
    unwatch: function () {
      this$1.el.removeEventListener(inputEvent, onInput);
    }
  });

  this.watchers.push({
    tag: 'class_blur',
    unwatch: function () {
      this$1.el.removeEventListener(blurEvent, onBlur);
    }
  });
};

/**
 * Adds the listeners required for validation.
 */
Field.prototype.addValueListeners = function addValueListeners () {
    var this$1 = this;

  this.unwatch(/^input_.+/);
  if (!this.listen) { return; }

  var fn = this.targetOf ? function () {
    this$1.validator.validate(("#" + (this$1.targetOf)));
  } : function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

    // if its a DOM event, resolve the value, otherwise use the first parameter as the value.
    if (args.length === 0 || (isCallable(Event) && args[0] instanceof Event) || (args[0] && args[0].srcElement)) {
      args[0] = this$1.value;
    }
    this$1.validator.validate(("#" + (this$1.id)), args[0]);
  };

  var inputEvent = getInputEventName(this.el);
  // replace input event with suitable one.
  var events = this.events.map(function (e) {
    return e === 'input' ? inputEvent : e;
  });

  // if there is a watchable model and an on input validation is requested.
  if (this.model && events.indexOf(inputEvent) !== -1) {
    var debouncedFn = debounce(fn, this.delay[inputEvent]);
    var unwatch = this.vm.$watch(this.model, function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

      this$1.flags.pending = true;
      debouncedFn.apply(void 0, args);
    });
    this.watchers.push({
      tag: 'input_model',
      unwatch: unwatch
    });
    // filter out input event as it is already handled by the watcher API.
    events = events.filter(function (e) { return e !== inputEvent; });
  }

  // Add events.
  events.forEach(function (e) {
    var debouncedFn = debounce(fn, this$1.delay[e]);
    var validate = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

      this$1.flags.pending = true;
      debouncedFn.apply(void 0, args);
    };

    this$1._addComponentEventListener(e, validate);
    this$1._addHTMLEventListener(e, validate);
  });
};

Field.prototype._addComponentEventListener = function _addComponentEventListener (evt, validate) {
    var this$1 = this;

  if (!this.component) { return; }

  this.component.$on(evt, validate);
  this.watchers.push({
    tag: 'input_vue',
    unwatch: function () {
      this$1.component.$off(evt, validate);
    }
  });
};

Field.prototype._addHTMLEventListener = function _addHTMLEventListener (evt, validate) {
    var this$1 = this;

  if (!this.el) { return; }

  if (~['radio', 'checkbox'].indexOf(this.el.type)) {
    var els = document.querySelectorAll(("input[name=\"" + (this.el.name) + "\"]"));
    toArray(els).forEach(function (el) {
      el.addEventListener(evt, validate);
      this$1.watchers.push({
        tag: 'input_native',
        unwatch: function () {
          el.removeEventListener(evt, validate);
        }
      });
    });

    return;
  }

  this.el.addEventListener(evt, validate);
  this.watchers.push({
    tag: 'input_native',
    unwatch: function () {
      this$1.el.removeEventListener(evt, validate);
    }
  });
};

/**
 * Updates aria attributes on the element.
 */
Field.prototype.updateAriaAttrs = function updateAriaAttrs () {
  if (!this.aria || !this.el || !isCallable(this.el.setAttribute)) { return; }

  this.el.setAttribute('aria-required', this.isRequired ? 'true' : 'false');
  this.el.setAttribute('aria-invalid', this.flags.invalid ? 'true' : 'false');
};

/**
 * Updates the custom validity for the field.
 */
Field.prototype.updateCustomValidity = function updateCustomValidity () {
  if (!this.validity || !this.el || !isCallable(this.el.setCustomValidity)) { return; }

  this.el.setCustomValidity(this.flags.valid ? '' : (this.validator.errors.firstById(this.id) || ''));
};

/**
 * Removes all listeners.
 */
Field.prototype.destroy = function destroy () {
  this.unwatch();
  this.dependencies.forEach(function (d) { return d.field.destroy(); });
  this.dependencies = [];
};

Object.defineProperties( Field.prototype, prototypeAccessors$1 );

// 

var FieldBag = function FieldBag () {
  this.items = [];
};

var prototypeAccessors$4 = { length: {} };

/**
 * Gets the current items length.
 */

prototypeAccessors$4.length.get = function () {
  return this.items.length;
};

/**
 * Finds the first field that matches the provided matcher object.
 */
FieldBag.prototype.find = function find$1 (matcher) {
  return find(this.items, function (item) { return item.matches(matcher); });
};

/**
 * Filters the items down to the matched fields.
 */
FieldBag.prototype.filter = function filter (matcher) {
  // multiple matchers to be tried.
  if (Array.isArray(matcher)) {
    return this.items.filter(function (item) { return matcher.some(function (m) { return item.matches(m); }); });
  }

  return this.items.filter(function (item) { return item.matches(matcher); });
};

/**
 * Maps the field items using the mapping function.
 */
FieldBag.prototype.map = function map (mapper) {
  return this.items.map(mapper);
};

/**
 * Finds and removes the first field that matches the provided matcher object, returns the removed item.
 */
FieldBag.prototype.remove = function remove (matcher) {
  var item = null;
  if (matcher instanceof Field) {
    item = matcher;
  } else {
    item = this.find(matcher);
  }

  if (!item) { return null; }

  var index = this.items.indexOf(item);
  this.items.splice(index, 1);

  return item;
};

/**
 * Adds a field item to the list.
 */
FieldBag.prototype.push = function push (item) {
  if (! (item instanceof Field)) {
    throw createError('FieldBag only accepts instances of Field that has an id defined.');
  }

  if (!item.id) {
    throw createError('Field id must be defined.');
  }

  if (this.find({ id: item.id })) {
    throw createError(("Field with id " + (item.id) + " is already added."));
  }

  this.items.push(item);
};

Object.defineProperties( FieldBag.prototype, prototypeAccessors$4 );

// 

var RULES = {};
var STRICT_MODE = true;
var TARGET_RULES = ['confirmed', 'after', 'before'];
var ERRORS = []; // HOLD errors references to trigger regeneration.

var Validator = function Validator (validations, options) {
  var this$1 = this;
  if ( options === void 0 ) options = { vm: null, fastExit: true };

  this.strict = STRICT_MODE;
  this.errors = new ErrorBag();
  ERRORS.push(this.errors);
  this.fields = new FieldBag();
  this.flags = {};
  this._createFields(validations);
  this.paused = false;
  this.fastExit = options.fastExit || false;
  this.ownerId = options.vm && options.vm._uid;
  // create it statically since we don't need constant access to the vm.
  this.reset = options.vm && isCallable(options.vm.$nextTick) ? function (matcher) {
    return new Promise(function (resolve) {
      options.vm.$nextTick(function () {
        resolve(this$1._reset(matcher));
      });
    });
  } : this._reset;
};

var prototypeAccessors = { dictionary: {},locale: {},rules: {} };
var staticAccessors = { dictionary: {},locale: {},rules: {} };

/**
 * Getter for the dictionary.
 */
prototypeAccessors.dictionary.get = function () {
  return Config.dependency('dictionary');
};

/**
 * Static Getter for the dictionary.
 */
staticAccessors.dictionary.get = function () {
  return Config.dependency('dictionary');
};

/**
 * Getter for the current locale.
 */
prototypeAccessors.locale.get = function () {
  return this.dictionary.locale;
};

/**
 * Setter for the validator locale.
 */
prototypeAccessors.locale.set = function (value) {
  Validator.locale = value;
};

/**
* Static getter for the validator locale.
*/
staticAccessors.locale.get = function () {
  return Validator.dictionary.locale;
};

/**
 * Static setter for the validator locale.
 */
staticAccessors.locale.set = function (value) {
  var hasChanged = value !== Validator.dictionary.locale;
  Validator.dictionary.locale = value;
  if (hasChanged) {
    Validator.regenerate();
  }
};

/**
 * Getter for the rules object.
 */
prototypeAccessors.rules.get = function () {
  return RULES;
};

/**
 * Static Getter for the rules object.
 */
staticAccessors.rules.get = function () {
  return RULES;
};

/**
 * Static constructor.
 */
Validator.create = function create (validations, options) {
  return new Validator(validations, options);
};

/**
 * Adds a custom validator to the list of validation rules.
 */
Validator.extend = function extend (name, validator, options) {
    if ( options === void 0 ) options = {};

  Validator._guardExtend(name, validator);
  Validator._merge(name, validator);
  if (options && options.hasTarget) {
    TARGET_RULES.push(name);
  }
};

/**
 * Regenerates error messages across all validators.
 */
Validator.regenerate = function regenerate () {
  ERRORS.forEach(function (errorBag) { return errorBag.regenerate(); });
};

/**
 * Removes a rule from the list of validators.
 */
Validator.remove = function remove (name) {
  delete RULES[name];
  var idx = TARGET_RULES.indexOf(name);
  if (idx === -1) { return; }

  TARGET_RULES.splice(idx, 1);
};

/**
 * Checks if the given rule name is a rule that targets other fields.
 */
Validator.isTargetRule = function isTargetRule (name) {
  return TARGET_RULES.indexOf(name) !== -1;
};

/**
 * Sets the operating mode for all newly created validators.
 * strictMode = true: Values without a rule are invalid and cause failure.
 * strictMode = false: Values without a rule are valid and are skipped.
 */
Validator.setStrictMode = function setStrictMode (strictMode) {
    if ( strictMode === void 0 ) strictMode = true;

  STRICT_MODE = strictMode;
};

/**
 * Adds and sets the current locale for the validator.
 */
Validator.prototype.localize = function localize (lang, dictionary) {
  Validator.localize(lang, dictionary);
};

/**
 * Adds and sets the current locale for the validator.
 */
Validator.localize = function localize (lang, dictionary) {
  if (isObject(lang)) {
    Validator.dictionary.merge(lang);
    return;
  }

  // merge the dictionary.
  if (dictionary) {
    var locale = lang || dictionary.name;
    dictionary = assign({}, dictionary);
    Validator.dictionary.merge(( obj = {}, obj[locale] = dictionary, obj ));
      var obj;
  }

  if (lang) {
    // set the locale.
    Validator.locale = lang;
  }
};

/**
 * Registers a field to be validated.
 */
Validator.prototype.attach = function attach (field) {
  // deprecate: handle old signature.
  if (arguments.length > 1) {
    warn('This signature of the attach method has been deprecated, please consult the docs.');
    field = assign({}, {
      name: arguments[0],
      rules: arguments[1]
    }, arguments[2] || { vm: { $validator: this } });
  }

  // fixes initial value detection with v-model and select elements.
  var value = field.initialValue;
  if (!(field instanceof Field)) {
    field = new Field(field.el || null, field);
  }

  this.fields.push(field);

  // validate the field initially
  if (field.initial) {
    this.validate(("#" + (field.id)), value || field.value);
  } else {
    this._validate(field, value || field.value, true).then(function (result) {
      field.flags.valid = result.valid;
      field.flags.invalid = !result.valid;
    });
  }

  this._addFlag(field, field.scope);
  return field;
};

/**
 * Sets the flags on a field.
 */
Validator.prototype.flag = function flag (name, flags) {
  var field = this._resolveField(name);
  if (! field || !flags) {
    return;
  }

  field.setFlags(flags);
};

/**
 * Removes a field from the validator.
 */
Validator.prototype.detach = function detach (name, scope) {
  var field = name instanceof Field ? name : this._resolveField(name, scope);
  if (!field) { return; }

  field.destroy();
  this.errors.remove(field.name, field.scope, field.id);
  this.fields.remove(field);
  var flags = this.flags;
  if (!isNullOrUndefined(field.scope) && flags[("$" + (field.scope))]) {
    delete flags[("$" + (field.scope))][field.name];
  } else if (isNullOrUndefined(field.scope)) {
    delete flags[field.name];
  }

  this.flags = assign({}, flags);
};

/**
 * Adds a custom validator to the list of validation rules.
 */
Validator.prototype.extend = function extend (name, validator, options) {
    if ( options === void 0 ) options = {};

  Validator.extend(name, validator, options);
};

/**
 * Updates a field, updating both errors and flags.
 */
Validator.prototype.update = function update (id, ref) {
    var scope = ref.scope;

  var field = this._resolveField(("#" + id));
  if (!field) { return; }

  // remove old scope.
  this.errors.update(id, { scope: scope });
  if (!isNullOrUndefined(field.scope) && this.flags[("$" + (field.scope))]) {
    delete this.flags[("$" + (field.scope))][field.name];
  } else if (isNullOrUndefined(field.scope)) {
    delete this.flags[field.name];
  }

  this._addFlag(field, scope);
};

/**
 * Removes a rule from the list of validators.
 */
Validator.prototype.remove = function remove (name) {
  Validator.remove(name);
};

/**
 * Validates a value against a registered field validations.
 */
Validator.prototype.validate = function validate (name, value, scope) {
    var this$1 = this;
    if ( scope === void 0 ) scope = null;

  if (this.paused) { return Promise.resolve(true); }

  // overload to validate all.
  if (arguments.length === 0) {
    return this.validateScopes();
  }

  // overload to validate scope-less fields.
  if (arguments.length === 1 && arguments[0] === '*') {
    return this.validateAll();
  }

  // overload to validate a scope.
  if (arguments.length === 1 && typeof arguments[0] === 'string' && /^(.+)\.\*$/.test(arguments[0])) {
    var matched = arguments[0].match(/^(.+)\.\*$/)[1];
    return this.validateAll(matched);
  }

  var field = this._resolveField(name, scope);
  if (!field) {
    return this._handleFieldNotFound(name, scope);
  }

  field.flags.pending = true;
  if (arguments.length === 1) {
    value = field.value;
  }

  var silentRun = field.isDisabled;

  return this._validate(field, value, silentRun).then(function (result) {
    this$1.errors.remove(field.name, field.scope, field.id);
    if (silentRun) {
      return Promise.resolve(true);
    } else if (result.errors) {
      result.errors.forEach(function (e) { return this$1.errors.add(e); });
    }

    field.setFlags({
      pending: false,
      valid: result.valid,
      validated: true
    });

    return result.valid;
  });
};

/**
 * Pauses the validator.
 */
Validator.prototype.pause = function pause () {
  this.paused = true;

  return this;
};

/**
 * Resumes the validator.
 */
Validator.prototype.resume = function resume () {
  this.paused = false;

  return this;
};

/**
 * Validates each value against the corresponding field validations.
 */
Validator.prototype.validateAll = function validateAll (values) {
    var arguments$1 = arguments;
    var this$1 = this;

  if (this.paused) { return Promise.resolve(true); }

  var matcher = null;
  var providedValues = false;

  if (typeof values === 'string') {
    matcher = { scope: values };
  } else if (isObject(values)) {
    matcher = Object.keys(values).map(function (key) {
      return { name: key, scope: arguments$1[1] || null };
    });
    providedValues = true;
  } else if (arguments.length === 0) {
    matcher = { scope: null }; // global scope.
  } else if (Array.isArray(values)) {
    matcher = values.map(function (key) {
      return { name: key, scope: arguments$1[1] || null };
    });
  }

  var promises = this.fields.filter(matcher).map(function (field) { return this$1.validate(
    ("#" + (field.id)),
    providedValues ? values[field.name] : field.value
  ); });

  return Promise.all(promises).then(function (results) { return results.every(function (t) { return t; }); });
};

/**
 * Validates all scopes.
 */
Validator.prototype.validateScopes = function validateScopes () {
    var this$1 = this;

  if (this.paused) { return Promise.resolve(true); }

  var promises = this.fields.map(function (field) { return this$1.validate(
    ("#" + (field.id)),
    field.value
  ); });

  return Promise.all(promises).then(function (results) { return results.every(function (t) { return t; }); });
};

/**
 * Perform cleanup.
 */
Validator.prototype.destroy = function destroy () {
  // Remove ErrorBag instance.
  var idx = ERRORS.indexOf(this.errors);
  if (idx === -1) { return; }

  ERRORS.splice(idx, 1);
};

/**
 * Creates the fields to be validated.
 */
Validator.prototype._createFields = function _createFields (validations) {
    var this$1 = this;

  if (!validations) { return; }

  Object.keys(validations).forEach(function (field) {
    var options = assign({}, { name: field, rules: validations[field] });
    this$1.attach(options);
  });
};

/**
 * Date rules need the existence of a format, so date_format must be supplied.
 */
Validator.prototype._getDateFormat = function _getDateFormat (validations) {
  var format = null;
  if (validations.date_format && Array.isArray(validations.date_format)) {
    format = validations.date_format[0];
  }

  return format || this.dictionary.getDateFormat(this.locale);
};

/**
 * Checks if the passed rule is a date rule.
 */
Validator.prototype._isADateRule = function _isADateRule (rule) {
  return !! ~['after', 'before', 'date_between', 'date_format'].indexOf(rule);
};

/**
 * Formats an error message for field and a rule.
 */
Validator.prototype._formatErrorMessage = function _formatErrorMessage (field, rule, data, targetName) {
    if ( data === void 0 ) data = {};
    if ( targetName === void 0 ) targetName = null;

  var name = this._getFieldDisplayName(field);
  var params = this._getLocalizedParams(rule, targetName);

  return this.dictionary.getFieldMessage(this.locale, field.name, rule.name, [name, params, data]);
};

/**
 * Translates the parameters passed to the rule (mainly for target fields).
 */
Validator.prototype._getLocalizedParams = function _getLocalizedParams (rule, targetName) {
    if ( targetName === void 0 ) targetName = null;

  if (~TARGET_RULES.indexOf(rule.name) && rule.params && rule.params[0]) {
    var localizedName = targetName || this.dictionary.getAttribute(this.locale, rule.params[0], rule.params[0]);
    return [localizedName].concat(rule.params.slice(1));
  }

  return rule.params;
};

/**
 * Resolves an appropriate display name, first checking 'data-as' or the registered 'prettyName'
 */
Validator.prototype._getFieldDisplayName = function _getFieldDisplayName (field) {
  return field.alias || this.dictionary.getAttribute(this.locale, field.name, field.name);
};

/**
 * Adds a field flags to the flags collection.
 */
Validator.prototype._addFlag = function _addFlag (field, scope) {
    if ( scope === void 0 ) scope = null;

  if (isNullOrUndefined(scope)) {
    this.flags = assign({}, this.flags, ( obj = {}, obj[("" + (field.name))] = field.flags, obj ));
      var obj;
    return;
  }

  var scopeObj = assign({}, this.flags[("$" + scope)] || {}, ( obj$1 = {}, obj$1[("" + (field.name))] = field.flags, obj$1 ));
    var obj$1;
  this.flags = assign({}, this.flags, ( obj$2 = {}, obj$2[("$" + scope)] = scopeObj, obj$2 ));
    var obj$2;
};

/**
 * Resets fields that matches the matcher options or all fields if not specified.
 */
Validator.prototype._reset = function _reset (matcher) {
    var this$1 = this;

  return new Promise(function (resolve) {
    if (matcher) {
      this$1.fields.filter(matcher).forEach(function (field) {
        field.reset(); // reset field flags.
        this$1.errors.remove(field.name, field.scope, field.id);
      });

      return resolve();
    }

    this$1.fields.items.forEach(function (i) { return i.reset(); });
    this$1.errors.clear();
    resolve();
  });
};

/**
 * Tests a single input value against a rule.
 */
Validator.prototype._test = function _test (field, value, rule) {
    var this$1 = this;

  var validator = RULES[rule.name];
  var params = Array.isArray(rule.params) ? toArray(rule.params) : [];
  var targetName = null;
  if (!validator || typeof validator !== 'function') {
    throw createError(("No such validator '" + (rule.name) + "' exists."));
  }

  // has field dependencies.
  if (TARGET_RULES.indexOf(rule.name) !== -1) {
    var target = find(field.dependencies, function (d) { return d.name === rule.name; });
    if (target) {
      targetName = target.field.alias;
      params = [target.field.value].concat(params.slice(1));
    }
  } else if (rule.name === 'required' && field.rejectsFalse) {
    // invalidate false if no args were specified and the field rejects false by default.
    params = params.length ? params : [true];
  }

  if (this._isADateRule(rule.name)) {
    var dateFormat = this._getDateFormat(field.rules);
    if (rule.name !== 'date_format') {
      params.push(dateFormat);
    }
  }

  var result = validator(value, params);

  // If it is a promise.
  if (isCallable(result.then)) {
    return result.then(function (values) {
      var allValid = true;
      var data = {};
      if (Array.isArray(values)) {
        allValid = values.every(function (t) { return (isObject(t) ? t.valid : t); });
      } else { // Is a single object/boolean.
        allValid = isObject(values) ? values.valid : values;
        data = values.data;
      }

      return {
        valid: allValid,
        error: allValid ? undefined : this$1._createFieldError(field, rule, data, targetName)
      };
    });
  }

  if (!isObject(result)) {
    result = { valid: result, data: {} };
  }

  return {
    valid: result.valid,
    error: result.valid ? undefined : this._createFieldError(field, rule, result.data, targetName)
  };
};

/**
 * Merges a validator object into the RULES and Messages.
 */
Validator._merge = function _merge (name, validator) {
  if (isCallable(validator)) {
    RULES[name] = validator;
    return;
  }

  RULES[name] = validator.validate;
  if (validator.getMessage) {
    Validator.dictionary.setMessage(this.locale, name, validator.getMessage);
  }
};

/**
 * Guards from extension violations.
 */
Validator._guardExtend = function _guardExtend (name, validator) {
  if (isCallable(validator)) {
    return;
  }

  if (!isCallable(validator.validate)) {
    throw createError(
      ("Extension Error: The validator '" + name + "' must be a function or have a 'validate' method.")
    );
  }

  if (!isCallable(validator.getMessage) && typeof validator.getMessage !== 'string') {
    throw createError(
      ("Extension Error: The validator '" + name + "' object must have a 'getMessage' method or string.")
    );
  }
};

/**
 * Creates a Field Error Object.
 */
Validator.prototype._createFieldError = function _createFieldError (field, rule, data, targetName) {
    var this$1 = this;

  return {
    id: field.id,
    field: field.name,
    msg: this._formatErrorMessage(field, rule, data, targetName),
    rule: rule.name,
    scope: field.scope,
    regenerate: function () {
      return this$1._formatErrorMessage(field, rule, data, targetName);
    }
  };
};

/**
 * Tries different strategies to find a field.
 */
Validator.prototype._resolveField = function _resolveField (name, scope) {
  if (!isNullOrUndefined(scope)) {
    return this.fields.find({ name: name, scope: scope });
  }

  if (name[0] === '#') {
    return this.fields.find({ id: name.slice(1) });
  }

  if (name.indexOf('.') > -1) {
    var ref = name.split('.');
      var fieldScope = ref[0];
      var fieldName = ref.slice(1);
    var field = this.fields.find({ name: fieldName.join('.'), scope: fieldScope });
    if (field) {
      return field;
    }
  }

  return this.fields.find({ name: name, scope: null });
};

/**
 * Handles when a field is not found depending on the strict flag.
 */
Validator.prototype._handleFieldNotFound = function _handleFieldNotFound (name, scope) {
  if (!this.strict) { return Promise.resolve(true); }

  var fullName = isNullOrUndefined(scope) ? name : ("" + (!isNullOrUndefined(scope) ? scope + '.' : '') + name);
  throw createError(
    ("Validating a non-existent field: \"" + fullName + "\". Use \"attach()\" first.")
  );
};

/**
 * Starts the validation process.
 */
Validator.prototype._validate = function _validate (field, value, silent) {
    var this$1 = this;
    if ( silent === void 0 ) silent = false;

  if (!field.isRequired && (isNullOrUndefined(value) || value === '')) {
    return Promise.resolve({ valid: true });
  }

  var promises = [];
  var errors = [];
  var isExitEarly = false;
  // use of '.some()' is to break iteration in middle by returning true
  Object.keys(field.rules).some(function (rule) {
    var result = this$1._test(field, value, { name: rule, params: field.rules[rule] });
    if (isCallable(result.then)) {
      promises.push(result);
    } else if (this$1.fastExit && !result.valid) {
      errors.push(result.error);
      isExitEarly = true;
    } else {
      // promisify the result.
      promises.push(new Promise(function (resolve) {
        resolve(result);
      }));
    }

    return isExitEarly;
  });

  if (isExitEarly) {
    return Promise.resolve({
      valid: false,
      errors: errors
    });
  }

  return Promise.all(promises).then(function (values) { return values.map(function (v) {
    if (!v.valid) {
      errors.push(v.error);
    }

    return v.valid;
  }).every(function (t) { return t; }); }
  ).then(function (result) {
    return {
      valid: result,
      errors: errors
    };
  });
};

Object.defineProperties( Validator.prototype, prototypeAccessors );
Object.defineProperties( Validator, staticAccessors );

// 

/* istanbul ignore next */
var fakeFlags = createProxy({}, {
  get: function get (target, key) {
    // is a scope
    if (String(key).indexOf('$') === 0) {
      return fakeFlags;
    }

    return createFlags();
  }
});

/**
 * Checks if a parent validator instance was requested.
 */
var requestsValidator = function (injections) {
  if (isObject(injections) && injections.$validator) {
    return true;
  }

  return false;
};

/**
 * Creates a validator instance.
 */
var createValidator = function (vm, options) { return new Validator(null, { vm: vm, fastExit: options.fastExit }); };

var mixin = {
  provide: function provide () {
    if (this.$validator && !isBuiltInComponent(this.$vnode)) {
      return {
        $validator: this.$validator
      };
    }

    return {};
  },
  beforeCreate: function beforeCreate () {
    // if built in do nothing.
    if (isBuiltInComponent(this.$vnode)) {
      return;
    }

    // if its a root instance set the config if it exists.
    if (!this.$parent) {
      Config.merge(this.$options.$_veeValidate || {});
    }

    var options = Config.resolve(this);
    var Vue = this.$options._base; // the vue constructor.
    // TODO: Deprecate
    /* istanbul ignore next */
    if (this.$options.$validates) {
      warn('The ctor $validates option has been deprecated please set the $_veeValidate.validator option to "new" instead');
      this.$validator = createValidator(this, options);
    }

    // if its a root instance, inject anyways, or if it requested a new instance.
    if (!this.$parent || (this.$options.$_veeValidate && /new/.test(this.$options.$_veeValidate.validator))) {
      this.$validator = createValidator(this, options);
    }

    var requested = requestsValidator(this.$options.inject);

    // if automatic injection is enabled and no instance was requested.
    if (! this.$validator && options.inject && !requested) {
      this.$validator = createValidator(this, options);
    }

    // don't inject errors or fieldBag as no validator was resolved.
    if (! requested && ! this.$validator) {
      return;
    }

    // There is a validator but it isn't injected, mark as reactive.
    if (! requested && this.$validator) {
      Vue.util.defineReactive(this.$validator, 'errors', this.$validator.errors);
      Vue.util.defineReactive(this.$validator, 'flags', this.$validator.flags);
    }

    if (! this.$options.computed) {
      this.$options.computed = {};
    }

    this.$options.computed[options.errorBagName || 'errors'] = function errorBagGetter () {
      return this.$validator.errors;
    };
    this.$options.computed[options.fieldsBagName || 'fields'] = function fieldBagGetter () {
      if (!Object.keys(this.$validator.flags).length) {
        return fakeFlags;
      }

      return this.$validator.flags;
    };
  },
  beforeDestroy: function beforeDestroy () {
    if (isBuiltInComponent(this.$vnode)) { return; }

    // mark the validator paused to prevent delayed validation.
    if (this.$validator && this.$validator.ownerId === this._uid) {
      this.$validator.pause();
      this.$validator.destroy();
    }
  }
};

// 

/**
 * Finds the requested field by id from the context object.
 */
var findField = function (el, context) {
  if (!context || !context.$validator) {
    return null;
  }

  return context.$validator.fields.find({ id: getDataAttribute(el, 'id') });
};

var directive = {
  bind: function bind (el, binding, vnode) {
    var validator = vnode.context.$validator;
    if (! validator) {
      warn("No validator instance is present on vm, did you forget to inject '$validator'?");
      return;
    }

    var fieldOptions = Generator.generate(el, binding, vnode);
    validator.attach(fieldOptions);
  },
  inserted: function (el, binding, vnode) {
    var field = findField(el, vnode.context);
    var scope = Generator.resolveScope(el, binding, vnode);

    // skip if scope hasn't changed.
    if (!field || scope === field.scope) { return; }

    // only update scope.
    field.update({ scope: scope });

    // allows the field to re-evaluated once more in the update hook.
    field.updated = false;
  },
  update: function (el, binding, vnode) {
    var field = findField(el, vnode.context);

    // make sure we don't do unneccasary work if no important change was done.
    if (!field || (field.updated && isEqual(binding.value, binding.oldValue))) { return; }
    var scope = Generator.resolveScope(el, binding, vnode);
    var rules = Generator.resolveRules(el, binding);

    field.update({
      scope: scope,
      rules: rules
    });
  },
  unbind: function unbind (el, binding, ref) {
    var context = ref.context;

    var field = findField(el, context);
    if (!field) { return; }

    context.$validator.detach(field);
  }
};

var Vue;

function install (_Vue, options) {
  if ( options === void 0 ) options = {};

  if (Vue && _Vue === Vue) {
    if (true) {
      warn('already installed, Vue.use(VeeValidate) should only be called once.');
    }
    return;
  }

  Vue = _Vue;
  Config.merge(options);
  var ref = Config.current;
  var dictionary = ref.dictionary;
  var i18n = ref.i18n;

  if (dictionary) {
    Validator.localize(dictionary); // merge the dictionary.
  }

  // try to watch locale changes.
  if (i18n && i18n._vm && isCallable(i18n._vm.$watch)) {
    i18n._vm.$watch('locale', function () {
      Validator.regenerate();
    });
  }

  if (!i18n && options.locale) {
    Validator.localize(options.locale); // set the locale
  }

  Validator.setStrictMode(Config.current.strict);

  Vue.mixin(mixin);
  Vue.directive('validate', directive);
}

/**
 * Formates file size.
 *
 * @param {Number|String} size
 */
var formatFileSize = function (size) {
  var units = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var threshold = 1024;
  size = Number(size) * threshold;
  var i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(threshold));
  return (((size / Math.pow(threshold, i)).toFixed(2) * 1) + " " + (units[i]));
};

/**
 * Checks if vee-validate is defined globally.
 */
var isDefinedGlobally = function () {
  return typeof VeeValidate !== 'undefined';
};

var messages = {
  _default: function (field) { return ("The " + field + " value is not valid."); },
  after: function (field, ref) {
    var target = ref[0];
    var inclusion = ref[1];

    return ("The " + field + " must be after " + (inclusion ? 'or equal to ' : '') + target + ".");
},
  alpha_dash: function (field) { return ("The " + field + " field may contain alpha-numeric characters as well as dashes and underscores."); },
  alpha_num: function (field) { return ("The " + field + " field may only contain alpha-numeric characters."); },
  alpha_spaces: function (field) { return ("The " + field + " field may only contain alphabetic characters as well as spaces."); },
  alpha: function (field) { return ("The " + field + " field may only contain alphabetic characters."); },
  before: function (field, ref) {
    var target = ref[0];
    var inclusion = ref[1];

    return ("The " + field + " must be before " + (inclusion ? 'or equal to ' : '') + target + ".");
},
  between: function (field, ref) {
    var min = ref[0];
    var max = ref[1];

    return ("The " + field + " field must be between " + min + " and " + max + ".");
},
  confirmed: function (field) { return ("The " + field + " confirmation does not match."); },
  credit_card: function (field) { return ("The " + field + " field is invalid."); },
  date_between: function (field, ref) {
    var min = ref[0];
    var max = ref[1];

    return ("The " + field + " must be between " + min + " and " + max + ".");
},
  date_format: function (field, ref) {
    var format = ref[0];

    return ("The " + field + " must be in the format " + format + ".");
},
  decimal: function (field, ref) {
    if ( ref === void 0 ) ref = [];
    var decimals = ref[0]; if ( decimals === void 0 ) decimals = '*';

    return ("The " + field + " field must be numeric and may contain " + (!decimals || decimals === '*' ? '' : decimals) + " decimal points.");
},
  digits: function (field, ref) {
    var length = ref[0];

    return ("The " + field + " field must be numeric and exactly contain " + length + " digits.");
},
  dimensions: function (field, ref) {
    var width = ref[0];
    var height = ref[1];

    return ("The " + field + " field must be " + width + " pixels by " + height + " pixels.");
},
  email: function (field) { return ("The " + field + " field must be a valid email."); },
  ext: function (field) { return ("The " + field + " field must be a valid file."); },
  image: function (field) { return ("The " + field + " field must be an image."); },
  in: function (field) { return ("The " + field + " field must be a valid value."); },
  integer: function (field) { return ("The " + field + " field must be an integer."); },
  ip: function (field) { return ("The " + field + " field must be a valid ip address."); },
  length: function (field, ref) {
    var length = ref[0];
    var max = ref[1];

    if (max) {
      return ("The " + field + " length be between " + length + " and " + max + ".");
    }

    return ("The " + field + " length must be " + length + ".");
  },
  max: function (field, ref) {
    var length = ref[0];

    return ("The " + field + " field may not be greater than " + length + " characters.");
},
  max_value: function (field, ref) {
    var max = ref[0];

    return ("The " + field + " field must be " + max + " or less.");
},
  mimes: function (field) { return ("The " + field + " field must have a valid file type."); },
  min: function (field, ref) {
    var length = ref[0];

    return ("The " + field + " field must be at least " + length + " characters.");
},
  min_value: function (field, ref) {
    var min = ref[0];

    return ("The " + field + " field must be " + min + " or more.");
},
  not_in: function (field) { return ("The " + field + " field must be a valid value."); },
  numeric: function (field) { return ("The " + field + " field may only contain numeric characters."); },
  regex: function (field) { return ("The " + field + " field format is invalid."); },
  required: function (field) { return ("The " + field + " field is required."); },
  size: function (field, ref) {
    var size = ref[0];

    return ("The " + field + " size must be less than " + (formatFileSize(size)) + ".");
},
  url: function (field) { return ("The " + field + " field is not a valid URL."); }
};

var locale = {
  name: 'en',
  messages: messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  VeeValidate.Validator.localize(( obj = {}, obj[locale.name] = locale, obj ));
  var obj;
}

// 

function use (plugin, options) {
  if ( options === void 0 ) options = {};

  if (!isCallable(plugin)) {
    return warn('The plugin must be a callable function');
  }

  plugin({ Validator: Validator, ErrorBag: ErrorBag, Rules: Validator.rules }, options);
}

var MILLISECONDS_IN_HOUR = 3600000;
var MILLISECONDS_IN_MINUTE = 60000;
var DEFAULT_ADDITIONAL_DIGITS = 2;

var patterns = {
  dateTimeDelimeter: /[T ]/,
  plainTime: /:/,

  // year tokens
  YY: /^(\d{2})$/,
  YYY: [
    /^([+-]\d{2})$/, // 0 additional digits
    /^([+-]\d{3})$/, // 1 additional digit
    /^([+-]\d{4})$/ // 2 additional digits
  ],
  YYYY: /^(\d{4})/,
  YYYYY: [
    /^([+-]\d{4})/, // 0 additional digits
    /^([+-]\d{5})/, // 1 additional digit
    /^([+-]\d{6})/ // 2 additional digits
  ],

  // date tokens
  MM: /^-(\d{2})$/,
  DDD: /^-?(\d{3})$/,
  MMDD: /^-?(\d{2})-?(\d{2})$/,
  Www: /^-?W(\d{2})$/,
  WwwD: /^-?W(\d{2})-?(\d{1})$/,

  HH: /^(\d{2}([.,]\d*)?)$/,
  HHMM: /^(\d{2}):?(\d{2}([.,]\d*)?)$/,
  HHMMSS: /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/,

  // timezone tokens
  timezone: /([Z+-].*)$/,
  timezoneZ: /^(Z)$/,
  timezoneHH: /^([+-])(\d{2})$/,
  timezoneHHMM: /^([+-])(\d{2}):?(\d{2})$/
};

/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If an argument is a string, the function tries to parse it.
 * Function accepts complete ISO 8601 formats as well as partial implementations.
 * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
 *
 * If the argument is null, it is treated as an invalid date.
 *
 * If all above fails, the function passes the given argument to Date constructor.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 * All *date-fns* functions will throw `RangeError` if `options.additionalDigits` is not 0, 1, 2 or undefined.
 *
 * @param {*} argument - the value to convert
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - the additional number of digits in the extended year format
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Convert string '2014-02-11T11:30:30' to date:
 * var result = toDate('2014-02-11T11:30:30')
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert string '+02014101' to date,
 * // if the additional number of digits in the extended year format is 1:
 * var result = toDate('+02014101', {additionalDigits: 1})
 * //=> Fri Apr 11 2014 00:00:00
 */
function toDate (argument, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
  }

  if (argument === null) {
    return new Date(NaN)
  }

  var options = dirtyOptions || {};

  var additionalDigits = options.additionalDigits === undefined ? DEFAULT_ADDITIONAL_DIGITS : Number(options.additionalDigits);
  if (additionalDigits !== 2 && additionalDigits !== 1 && additionalDigits !== 0) {
    throw new RangeError('additionalDigits must be 0, 1 or 2')
  }

  // Clone the date
  if (argument instanceof Date) {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime())
  } else if (typeof argument !== 'string') {
    return new Date(argument)
  }

  var dateStrings = splitDateString(argument);

  var parseYearResult = parseYear(dateStrings.date, additionalDigits);
  var year = parseYearResult.year;
  var restDateString = parseYearResult.restDateString;

  var date = parseDate(restDateString, year);

  if (date) {
    var timestamp = date.getTime();
    var time = 0;
    var offset;

    if (dateStrings.time) {
      time = parseTime(dateStrings.time);
    }

    if (dateStrings.timezone) {
      offset = parseTimezone(dateStrings.timezone);
    } else {
      // get offset accurate to hour in timezones that change offset
      offset = new Date(timestamp + time).getTimezoneOffset();
      offset = new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE).getTimezoneOffset();
    }

    return new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE)
  } else {
    return new Date(argument)
  }
}

function splitDateString (dateString) {
  var dateStrings = {};
  var array = dateString.split(patterns.dateTimeDelimeter);
  var timeString;

  if (patterns.plainTime.test(array[0])) {
    dateStrings.date = null;
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
  }

  if (timeString) {
    var token = patterns.timezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], '');
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }

  return dateStrings
}

function parseYear (dateString, additionalDigits) {
  var patternYYY = patterns.YYY[additionalDigits];
  var patternYYYYY = patterns.YYYYY[additionalDigits];

  var token;

  // YYYY or ±YYYYY
  token = patterns.YYYY.exec(dateString) || patternYYYYY.exec(dateString);
  if (token) {
    var yearString = token[1];
    return {
      year: parseInt(yearString, 10),
      restDateString: dateString.slice(yearString.length)
    }
  }

  // YY or ±YYY
  token = patterns.YY.exec(dateString) || patternYYY.exec(dateString);
  if (token) {
    var centuryString = token[1];
    return {
      year: parseInt(centuryString, 10) * 100,
      restDateString: dateString.slice(centuryString.length)
    }
  }

  // Invalid ISO-formatted year
  return {
    year: null
  }
}

function parseDate (dateString, year) {
  // Invalid ISO-formatted year
  if (year === null) {
    return null
  }

  var token;
  var date;
  var month;
  var week;

  // YYYY
  if (dateString.length === 0) {
    date = new Date(0);
    date.setUTCFullYear(year);
    return date
  }

  // YYYY-MM
  token = patterns.MM.exec(dateString);
  if (token) {
    date = new Date(0);
    month = parseInt(token[1], 10) - 1;
    date.setUTCFullYear(year, month);
    return date
  }

  // YYYY-DDD or YYYYDDD
  token = patterns.DDD.exec(dateString);
  if (token) {
    date = new Date(0);
    var dayOfYear = parseInt(token[1], 10);
    date.setUTCFullYear(year, 0, dayOfYear);
    return date
  }

  // YYYY-MM-DD or YYYYMMDD
  token = patterns.MMDD.exec(dateString);
  if (token) {
    date = new Date(0);
    month = parseInt(token[1], 10) - 1;
    var day = parseInt(token[2], 10);
    date.setUTCFullYear(year, month, day);
    return date
  }

  // YYYY-Www or YYYYWww
  token = patterns.Www.exec(dateString);
  if (token) {
    week = parseInt(token[1], 10) - 1;
    return dayOfISOYear(year, week)
  }

  // YYYY-Www-D or YYYYWwwD
  token = patterns.WwwD.exec(dateString);
  if (token) {
    week = parseInt(token[1], 10) - 1;
    var dayOfWeek = parseInt(token[2], 10) - 1;
    return dayOfISOYear(year, week, dayOfWeek)
  }

  // Invalid ISO-formatted date
  return null
}

function parseTime (timeString) {
  var token;
  var hours;
  var minutes;

  // hh
  token = patterns.HH.exec(timeString);
  if (token) {
    hours = parseFloat(token[1].replace(',', '.'));
    return (hours % 24) * MILLISECONDS_IN_HOUR
  }

  // hh:mm or hhmm
  token = patterns.HHMM.exec(timeString);
  if (token) {
    hours = parseInt(token[1], 10);
    minutes = parseFloat(token[2].replace(',', '.'));
    return (hours % 24) * MILLISECONDS_IN_HOUR +
      minutes * MILLISECONDS_IN_MINUTE
  }

  // hh:mm:ss or hhmmss
  token = patterns.HHMMSS.exec(timeString);
  if (token) {
    hours = parseInt(token[1], 10);
    minutes = parseInt(token[2], 10);
    var seconds = parseFloat(token[3].replace(',', '.'));
    return (hours % 24) * MILLISECONDS_IN_HOUR +
      minutes * MILLISECONDS_IN_MINUTE +
      seconds * 1000
  }

  // Invalid ISO-formatted time
  return null
}

function parseTimezone (timezoneString) {
  var token;
  var absoluteOffset;

  // Z
  token = patterns.timezoneZ.exec(timezoneString);
  if (token) {
    return 0
  }

  // ±hh
  token = patterns.timezoneHH.exec(timezoneString);
  if (token) {
    absoluteOffset = parseInt(token[2], 10) * 60;
    return (token[1] === '+') ? -absoluteOffset : absoluteOffset
  }

  // ±hh:mm or ±hhmm
  token = patterns.timezoneHHMM.exec(timezoneString);
  if (token) {
    absoluteOffset = parseInt(token[2], 10) * 60 + parseInt(token[3], 10);
    return (token[1] === '+') ? -absoluteOffset : absoluteOffset
  }

  return 0
}

function dayOfISOYear (isoYear, week, day) {
  week = week || 0;
  day = day || 0;
  var date = new Date(0);
  date.setUTCFullYear(isoYear, 0, 4);
  var fourthOfJanuaryDay = date.getUTCDay() || 7;
  var diff = week * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date
}

/**
 * @name addMilliseconds
 * @category Millisecond Helpers
 * @summary Add the specified number of milliseconds to the given date.
 *
 * @description
 * Add the specified number of milliseconds to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of milliseconds to be added
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @returns {Date} the new date with the milliseconds added
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
 * var result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:30.750
 */
function addMilliseconds (dirtyDate, dirtyAmount, dirtyOptions) {
  if (arguments.length < 2) {
    throw new TypeError('2 arguments required, but only ' + arguments.length + ' present')
  }

  var timestamp = toDate(dirtyDate, dirtyOptions).getTime();
  var amount = Number(dirtyAmount);
  return new Date(timestamp + amount)
}

function cloneObject (dirtyObject) {
  dirtyObject = dirtyObject || {};
  var object = {};

  for (var property in dirtyObject) {
    if (dirtyObject.hasOwnProperty(property)) {
      object[property] = dirtyObject[property];
    }
  }

  return object
}

var MILLISECONDS_IN_MINUTE$2 = 60000;

/**
 * @name addMinutes
 * @category Minute Helpers
 * @summary Add the specified number of minutes to the given date.
 *
 * @description
 * Add the specified number of minutes to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of minutes to be added
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @returns {Date} the new date with the minutes added
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Add 30 minutes to 10 July 2014 12:00:00:
 * var result = addMinutes(new Date(2014, 6, 10, 12, 0), 30)
 * //=> Thu Jul 10 2014 12:30:00
 */
function addMinutes (dirtyDate, dirtyAmount, dirtyOptions) {
  if (arguments.length < 2) {
    throw new TypeError('2 arguments required, but only ' + arguments.length + ' present')
  }

  var amount = Number(dirtyAmount);
  return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_MINUTE$2, dirtyOptions)
}

/**
 * @name isValid
 * @category Common Helpers
 * @summary Is the given date valid?
 *
 * @description
 * Returns false if argument is Invalid Date and true otherwise.
 * Argument is converted to Date using `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * Invalid Date is a Date, whose time value is NaN.
 *
 * Time value of Date: http://es5.github.io/#x15.9.1.1
 *
 * @param {*} date - the date to check
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @returns {Boolean} the date is valid
 * @throws {TypeError} 1 argument required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // For the valid date:
 * var result = isValid(new Date(2014, 1, 31))
 * //=> true
 *
 * @example
 * // For the value, convertable into a date:
 * var result = isValid('2014-02-31')
 * //=> true
 *
 * @example
 * // For the invalid date:
 * var result = isValid(new Date(''))
 * //=> false
 */
function isValid (dirtyDate, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
  }

  var date = toDate(dirtyDate, dirtyOptions);
  return !isNaN(date)
}

var formatDistanceLocale = {
  lessThanXSeconds: {
    one: 'less than a second',
    other: 'less than {{count}} seconds'
  },

  xSeconds: {
    one: '1 second',
    other: '{{count}} seconds'
  },

  halfAMinute: 'half a minute',

  lessThanXMinutes: {
    one: 'less than a minute',
    other: 'less than {{count}} minutes'
  },

  xMinutes: {
    one: '1 minute',
    other: '{{count}} minutes'
  },

  aboutXHours: {
    one: 'about 1 hour',
    other: 'about {{count}} hours'
  },

  xHours: {
    one: '1 hour',
    other: '{{count}} hours'
  },

  xDays: {
    one: '1 day',
    other: '{{count}} days'
  },

  aboutXMonths: {
    one: 'about 1 month',
    other: 'about {{count}} months'
  },

  xMonths: {
    one: '1 month',
    other: '{{count}} months'
  },

  aboutXYears: {
    one: 'about 1 year',
    other: 'about {{count}} years'
  },

  xYears: {
    one: '1 year',
    other: '{{count}} years'
  },

  overXYears: {
    one: 'over 1 year',
    other: 'over {{count}} years'
  },

  almostXYears: {
    one: 'almost 1 year',
    other: 'almost {{count}} years'
  }
};

function formatDistance (token, count, options) {
  options = options || {};

  var result;
  if (typeof formatDistanceLocale[token] === 'string') {
    result = formatDistanceLocale[token];
  } else if (count === 1) {
    result = formatDistanceLocale[token].one;
  } else {
    result = formatDistanceLocale[token].other.replace('{{count}}', count);
  }

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'in ' + result
    } else {
      return result + ' ago'
    }
  }

  return result
}

var tokensToBeShortedPattern = /MMMM|MM|DD|dddd/g;

function buildShortLongFormat (format) {
  return format.replace(tokensToBeShortedPattern, function (token) {
    return token.slice(1)
  })
}

/**
 * @name buildFormatLongFn
 * @category Locale Helpers
 * @summary Build `formatLong` property for locale used by `format`, `formatRelative` and `parse` functions.
 *
 * @description
 * Build `formatLong` property for locale used by `format`, `formatRelative` and `parse` functions.
 * Returns a function which takes one of the following tokens as the argument:
 * `'LTS'`, `'LT'`, `'L'`, `'LL'`, `'LLL'`, `'l'`, `'ll'`, `'lll'`, `'llll'`
 * and returns a long format string written as `format` token strings.
 * See [format]{@link https://date-fns.org/docs/format}
 *
 * `'l'`, `'ll'`, `'lll'` and `'llll'` formats are built automatically
 * by shortening some of the tokens from corresponding unshortened formats
 * (e.g., if `LL` is `'MMMM DD YYYY'` then `ll` will be `MMM D YYYY`)
 *
 * @param {Object} obj - the object with long formats written as `format` token strings
 * @param {String} obj.LT - time format: hours and minutes
 * @param {String} obj.LTS - time format: hours, minutes and seconds
 * @param {String} obj.L - short date format: numeric day, month and year
 * @param {String} [obj.l] - short date format: numeric day, month and year (shortened)
 * @param {String} obj.LL - long date format: day, month in words, and year
 * @param {String} [obj.ll] - long date format: day, month in words, and year (shortened)
 * @param {String} obj.LLL - long date and time format
 * @param {String} [obj.lll] - long date and time format (shortened)
 * @param {String} obj.LLLL - long date, time and weekday format
 * @param {String} [obj.llll] - long date, time and weekday format (shortened)
 * @returns {Function} `formatLong` property of the locale
 *
 * @example
 * // For `en-US` locale:
 * locale.formatLong = buildFormatLongFn({
 *   LT: 'h:mm aa',
 *   LTS: 'h:mm:ss aa',
 *   L: 'MM/DD/YYYY',
 *   LL: 'MMMM D YYYY',
 *   LLL: 'MMMM D YYYY h:mm aa',
 *   LLLL: 'dddd, MMMM D YYYY h:mm aa'
 * })
 */
function buildFormatLongFn (obj) {
  var formatLongLocale = {
    LTS: obj.LTS,
    LT: obj.LT,
    L: obj.L,
    LL: obj.LL,
    LLL: obj.LLL,
    LLLL: obj.LLLL,
    l: obj.l || buildShortLongFormat(obj.L),
    ll: obj.ll || buildShortLongFormat(obj.LL),
    lll: obj.lll || buildShortLongFormat(obj.LLL),
    llll: obj.llll || buildShortLongFormat(obj.LLLL)
  };

  return function (token) {
    return formatLongLocale[token]
  }
}

var formatLong = buildFormatLongFn({
  LT: 'h:mm aa',
  LTS: 'h:mm:ss aa',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D YYYY',
  LLL: 'MMMM D YYYY h:mm aa',
  LLLL: 'dddd, MMMM D YYYY h:mm aa'
});

var formatRelativeLocale = {
  lastWeek: '[last] dddd [at] LT',
  yesterday: '[yesterday at] LT',
  today: '[today at] LT',
  tomorrow: '[tomorrow at] LT',
  nextWeek: 'dddd [at] LT',
  other: 'L'
};

function formatRelative (token, date, baseDate, options) {
  return formatRelativeLocale[token]
}

/**
 * @name buildLocalizeFn
 * @category Locale Helpers
 * @summary Build `localize.weekday`, `localize.month` and `localize.timeOfDay` properties for the locale.
 *
 * @description
 * Build `localize.weekday`, `localize.month` and `localize.timeOfDay` properties for the locale
 * used by `format` function.
 * If no `type` is supplied to the options of the resulting function, `defaultType` will be used (see example).
 *
 * `localize.weekday` function takes the weekday index as argument (0 - Sunday).
 * `localize.month` takes the month index (0 - January).
 * `localize.timeOfDay` takes the hours. Use `indexCallback` to convert them to an array index (see example).
 *
 * @param {Object} values - the object with arrays of values
 * @param {String} defaultType - the default type for the localize function
 * @param {Function} [indexCallback] - the callback which takes the resulting function argument
 *   and converts it into value array index
 * @returns {Function} the resulting function
 *
 * @example
 * var timeOfDayValues = {
 *   uppercase: ['AM', 'PM'],
 *   lowercase: ['am', 'pm'],
 *   long: ['a.m.', 'p.m.']
 * }
 * locale.localize.timeOfDay = buildLocalizeFn(timeOfDayValues, 'long', function (hours) {
 *   // 0 is a.m. array index, 1 is p.m. array index
 *   return (hours / 12) >= 1 ? 1 : 0
 * })
 * locale.localize.timeOfDay(16, {type: 'uppercase'}) //=> 'PM'
 * locale.localize.timeOfDay(5) //=> 'a.m.'
 */
function buildLocalizeFn (values, defaultType, indexCallback) {
  return function (dirtyIndex, dirtyOptions) {
    var options = dirtyOptions || {};
    var type = options.type ? String(options.type) : defaultType;
    var valuesArray = values[type] || values[defaultType];
    var index = indexCallback ? indexCallback(Number(dirtyIndex)) : Number(dirtyIndex);
    return valuesArray[index]
  }
}

/**
 * @name buildLocalizeArrayFn
 * @category Locale Helpers
 * @summary Build `localize.weekdays`, `localize.months` and `localize.timesOfDay` properties for the locale.
 *
 * @description
 * Build `localize.weekdays`, `localize.months` and `localize.timesOfDay` properties for the locale.
 * If no `type` is supplied to the options of the resulting function, `defaultType` will be used (see example).
 *
 * @param {Object} values - the object with arrays of values
 * @param {String} defaultType - the default type for the localize function
 * @returns {Function} the resulting function
 *
 * @example
 * var weekdayValues = {
 *   narrow: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
 *   short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
 *   long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
 * }
 * locale.localize.weekdays = buildLocalizeArrayFn(weekdayValues, 'long')
 * locale.localize.weekdays({type: 'narrow'}) //=> ['Su', 'Mo', ...]
 * locale.localize.weekdays() //=> ['Sunday', 'Monday', ...]
 */
function buildLocalizeArrayFn (values, defaultType) {
  return function (dirtyOptions) {
    var options = dirtyOptions || {};
    var type = options.type ? String(options.type) : defaultType;
    return values[type] || values[defaultType]
  }
}

// Note: in English, the names of days of the week and months are capitalized.
// If you are making a new locale based on this one, check if the same is true for the language you're working on.
// Generally, formatted dates should look like they are in the middle of a sentence,
// e.g. in Spanish language the weekdays and months should be in the lowercase.
var weekdayValues = {
  narrow: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};

var monthValues = {
  short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

// `timeOfDay` is used to designate which part of the day it is, when used with 12-hour clock.
// Use the system which is used the most commonly in the locale.
// For example, if the country doesn't use a.m./p.m., you can use `night`/`morning`/`afternoon`/`evening`:
//
//   var timeOfDayValues = {
//     any: ['in the night', 'in the morning', 'in the afternoon', 'in the evening']
//   }
//
// And later:
//
//   var localize = {
//     // The callback takes the hours as the argument and returns the array index
//     timeOfDay: buildLocalizeFn(timeOfDayValues, 'any', function (hours) {
//       if (hours >= 17) {
//         return 3
//       } else if (hours >= 12) {
//         return 2
//       } else if (hours >= 4) {
//         return 1
//       } else {
//         return 0
//       }
//     }),
//     timesOfDay: buildLocalizeArrayFn(timeOfDayValues, 'any')
//   }
var timeOfDayValues = {
  uppercase: ['AM', 'PM'],
  lowercase: ['am', 'pm'],
  long: ['a.m.', 'p.m.']
};

function ordinalNumber (dirtyNumber, dirtyOptions) {
  var number = Number(dirtyNumber);

  // If ordinal numbers depend on context, for example,
  // if they are different for different grammatical genders,
  // use `options.unit`:
  //
  //   var options = dirtyOptions || {}
  //   var unit = String(options.unit)
  //
  // where `unit` can be 'month', 'quarter', 'week', 'isoWeek', 'dayOfYear',
  // 'dayOfMonth' or 'dayOfWeek'

  var rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + 'st'
      case 2:
        return number + 'nd'
      case 3:
        return number + 'rd'
    }
  }
  return number + 'th'
}

var localize = {
  ordinalNumber: ordinalNumber,
  weekday: buildLocalizeFn(weekdayValues, 'long'),
  weekdays: buildLocalizeArrayFn(weekdayValues, 'long'),
  month: buildLocalizeFn(monthValues, 'long'),
  months: buildLocalizeArrayFn(monthValues, 'long'),
  timeOfDay: buildLocalizeFn(timeOfDayValues, 'long', function (hours) {
    return (hours / 12) >= 1 ? 1 : 0
  }),
  timesOfDay: buildLocalizeArrayFn(timeOfDayValues, 'long')
};

/**
 * @name buildMatchFn
 * @category Locale Helpers
 * @summary Build `match.weekdays`, `match.months` and `match.timesOfDay` properties for the locale.
 *
 * @description
 * Build `match.weekdays`, `match.months` and `match.timesOfDay` properties for the locale used by `parse` function.
 * If no `type` is supplied to the options of the resulting function, `defaultType` will be used (see example).
 * The result of the match function will be passed into corresponding parser function
 * (`match.weekday`, `match.month` or `match.timeOfDay` respectively. See `buildParseFn`).
 *
 * @param {Object} values - the object with RegExps
 * @param {String} defaultType - the default type for the match function
 * @returns {Function} the resulting function
 *
 * @example
 * var matchWeekdaysPatterns = {
 *   narrow: /^(su|mo|tu|we|th|fr|sa)/i,
 *   short: /^(sun|mon|tue|wed|thu|fri|sat)/i,
 *   long: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
 * }
 * locale.match.weekdays = buildMatchFn(matchWeekdaysPatterns, 'long')
 * locale.match.weekdays('Sunday', {type: 'narrow'}) //=> ['Su', 'Su', ...]
 * locale.match.weekdays('Sunday') //=> ['Sunday', 'Sunday', ...]
 */
function buildMatchFn (patterns, defaultType) {
  return function (dirtyString, dirtyOptions) {
    var options = dirtyOptions || {};
    var type = options.type ? String(options.type) : defaultType;
    var pattern = patterns[type] || patterns[defaultType];
    var string = String(dirtyString);
    return string.match(pattern)
  }
}

/**
 * @name buildParseFn
 * @category Locale Helpers
 * @summary Build `match.weekday`, `match.month` and `match.timeOfDay` properties for the locale.
 *
 * @description
 * Build `match.weekday`, `match.month` and `match.timeOfDay` properties for the locale used by `parse` function.
 * The argument of the resulting function is the result of the corresponding match function
 * (`match.weekdays`, `match.months` or `match.timesOfDay` respectively. See `buildMatchFn`).
 *
 * @param {Object} values - the object with arrays of RegExps
 * @param {String} defaultType - the default type for the parser function
 * @returns {Function} the resulting function
 *
 * @example
 * var parseWeekdayPatterns = {
 *   any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
 * }
 * locale.match.weekday = buildParseFn(matchWeekdaysPatterns, 'long')
 * var matchResult = locale.match.weekdays('Friday')
 * locale.match.weekday(matchResult) //=> 5
 */
function buildParseFn (patterns, defaultType) {
  return function (matchResult, dirtyOptions) {
    var options = dirtyOptions || {};
    var type = options.type ? String(options.type) : defaultType;
    var patternsArray = patterns[type] || patterns[defaultType];
    var string = matchResult[1];

    return patternsArray.findIndex(function (pattern) {
      return pattern.test(string)
    })
  }
}

/**
 * @name buildMatchPatternFn
 * @category Locale Helpers
 * @summary Build match function from a single RegExp.
 *
 * @description
 * Build match function from a single RegExp.
 * Usually used for building `match.ordinalNumbers` property of the locale.
 *
 * @param {Object} pattern - the RegExp
 * @returns {Function} the resulting function
 *
 * @example
 * locale.match.ordinalNumbers = buildMatchPatternFn(/^(\d+)(th|st|nd|rd)?/i)
 * locale.match.ordinalNumbers('3rd') //=> ['3rd', '3', 'rd', ...]
 */
function buildMatchPatternFn (pattern) {
  return function (dirtyString) {
    var string = String(dirtyString);
    return string.match(pattern)
  }
}

/**
 * @name parseDecimal
 * @category Locale Helpers
 * @summary Parses the match result into decimal number.
 *
 * @description
 * Parses the match result into decimal number.
 * Uses the string matched with the first set of parentheses of match RegExp.
 *
 * @param {Array} matchResult - the object returned by matching function
 * @returns {Number} the parsed value
 *
 * @example
 * locale.match = {
 *   ordinalNumbers: (dirtyString) {
 *     return String(dirtyString).match(/^(\d+)(th|st|nd|rd)?/i)
 *   },
 *   ordinalNumber: parseDecimal
 * }
 */
function parseDecimal (matchResult) {
  return parseInt(matchResult[1], 10)
}

var matchOrdinalNumbersPattern = /^(\d+)(th|st|nd|rd)?/i;

var matchWeekdaysPatterns = {
  narrow: /^(su|mo|tu|we|th|fr|sa)/i,
  short: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  long: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};

var parseWeekdayPatterns = {
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};

var matchMonthsPatterns = {
  short: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  long: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};

var parseMonthPatterns = {
  any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
};

// `timeOfDay` is used to designate which part of the day it is, when used with 12-hour clock.
// Use the system which is used the most commonly in the locale.
// For example, if the country doesn't use a.m./p.m., you can use `night`/`morning`/`afternoon`/`evening`:
//
//   var matchTimesOfDayPatterns = {
//     long: /^((in the)? (night|morning|afternoon|evening?))/i
//   }
//
//   var parseTimeOfDayPatterns = {
//     any: [/(night|morning)/i, /(afternoon|evening)/i]
//   }
var matchTimesOfDayPatterns = {
  short: /^(am|pm)/i,
  long: /^([ap]\.?\s?m\.?)/i
};

var parseTimeOfDayPatterns = {
  any: [/^a/i, /^p/i]
};

var match = {
  ordinalNumbers: buildMatchPatternFn(matchOrdinalNumbersPattern),
  ordinalNumber: parseDecimal,
  weekdays: buildMatchFn(matchWeekdaysPatterns, 'long'),
  weekday: buildParseFn(parseWeekdayPatterns, 'any'),
  months: buildMatchFn(matchMonthsPatterns, 'long'),
  month: buildParseFn(parseMonthPatterns, 'any'),
  timesOfDay: buildMatchFn(matchTimesOfDayPatterns, 'long'),
  timeOfDay: buildParseFn(parseTimeOfDayPatterns, 'any')
};

/**
 * @type {Locale}
 * @category Locales
 * @summary English locale (United States).
 * @language English
 * @iso-639-2 eng
 */
var locale$1 = {
  formatDistance: formatDistance,
  formatLong: formatLong,
  formatRelative: formatRelative,
  localize: localize,
  match: match,
  options: {
    weekStartsOn: 0 /* Sunday */,
    firstWeekContainsDate: 1
  }
};

var MILLISECONDS_IN_DAY$1 = 86400000;

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function getUTCDayOfYear (dirtyDate, dirtyOptions) {
  var date = toDate(dirtyDate, dirtyOptions);
  var timestamp = date.getTime();
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
  var startOfYearTimestamp = date.getTime();
  var difference = timestamp - startOfYearTimestamp;
  return Math.floor(difference / MILLISECONDS_IN_DAY$1) + 1
}

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function startOfUTCISOWeek (dirtyDate, dirtyOptions) {
  var weekStartsOn = 1;

  var date = toDate(dirtyDate, dirtyOptions);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date
}

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function getUTCISOWeekYear (dirtyDate, dirtyOptions) {
  var date = toDate(dirtyDate, dirtyOptions);
  var year = date.getUTCFullYear();

  var fourthOfJanuaryOfNextYear = new Date(0);
  fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear, dirtyOptions);

  var fourthOfJanuaryOfThisYear = new Date(0);
  fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear, dirtyOptions);

  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year
  } else {
    return year - 1
  }
}

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function startOfUTCISOWeekYear (dirtyDate, dirtyOptions) {
  var year = getUTCISOWeekYear(dirtyDate, dirtyOptions);
  var fourthOfJanuary = new Date(0);
  fourthOfJanuary.setUTCFullYear(year, 0, 4);
  fourthOfJanuary.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCISOWeek(fourthOfJanuary, dirtyOptions);
  return date
}

var MILLISECONDS_IN_WEEK$2 = 604800000;

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function getUTCISOWeek (dirtyDate, dirtyOptions) {
  var date = toDate(dirtyDate, dirtyOptions);
  var diff = startOfUTCISOWeek(date, dirtyOptions).getTime() - startOfUTCISOWeekYear(date, dirtyOptions).getTime();

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round(diff / MILLISECONDS_IN_WEEK$2) + 1
}

var formatters = {
  // Month: 1, 2, ..., 12
  'M': function (date) {
    return date.getUTCMonth() + 1
  },

  // Month: 1st, 2nd, ..., 12th
  'Mo': function (date, options) {
    var month = date.getUTCMonth() + 1;
    return options.locale.localize.ordinalNumber(month, {unit: 'month'})
  },

  // Month: 01, 02, ..., 12
  'MM': function (date) {
    return addLeadingZeros(date.getUTCMonth() + 1, 2)
  },

  // Month: Jan, Feb, ..., Dec
  'MMM': function (date, options) {
    return options.locale.localize.month(date.getUTCMonth(), {type: 'short'})
  },

  // Month: January, February, ..., December
  'MMMM': function (date, options) {
    return options.locale.localize.month(date.getUTCMonth(), {type: 'long'})
  },

  // Quarter: 1, 2, 3, 4
  'Q': function (date) {
    return Math.ceil((date.getUTCMonth() + 1) / 3)
  },

  // Quarter: 1st, 2nd, 3rd, 4th
  'Qo': function (date, options) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    return options.locale.localize.ordinalNumber(quarter, {unit: 'quarter'})
  },

  // Day of month: 1, 2, ..., 31
  'D': function (date) {
    return date.getUTCDate()
  },

  // Day of month: 1st, 2nd, ..., 31st
  'Do': function (date, options) {
    return options.locale.localize.ordinalNumber(date.getUTCDate(), {unit: 'dayOfMonth'})
  },

  // Day of month: 01, 02, ..., 31
  'DD': function (date) {
    return addLeadingZeros(date.getUTCDate(), 2)
  },

  // Day of year: 1, 2, ..., 366
  'DDD': function (date) {
    return getUTCDayOfYear(date)
  },

  // Day of year: 1st, 2nd, ..., 366th
  'DDDo': function (date, options) {
    return options.locale.localize.ordinalNumber(getUTCDayOfYear(date), {unit: 'dayOfYear'})
  },

  // Day of year: 001, 002, ..., 366
  'DDDD': function (date) {
    return addLeadingZeros(getUTCDayOfYear(date), 3)
  },

  // Day of week: Su, Mo, ..., Sa
  'dd': function (date, options) {
    return options.locale.localize.weekday(date.getUTCDay(), {type: 'narrow'})
  },

  // Day of week: Sun, Mon, ..., Sat
  'ddd': function (date, options) {
    return options.locale.localize.weekday(date.getUTCDay(), {type: 'short'})
  },

  // Day of week: Sunday, Monday, ..., Saturday
  'dddd': function (date, options) {
    return options.locale.localize.weekday(date.getUTCDay(), {type: 'long'})
  },

  // Day of week: 0, 1, ..., 6
  'd': function (date) {
    return date.getUTCDay()
  },

  // Day of week: 0th, 1st, 2nd, ..., 6th
  'do': function (date, options) {
    return options.locale.localize.ordinalNumber(date.getUTCDay(), {unit: 'dayOfWeek'})
  },

  // Day of ISO week: 1, 2, ..., 7
  'E': function (date) {
    return date.getUTCDay() || 7
  },

  // ISO week: 1, 2, ..., 53
  'W': function (date) {
    return getUTCISOWeek(date)
  },

  // ISO week: 1st, 2nd, ..., 53th
  'Wo': function (date, options) {
    return options.locale.localize.ordinalNumber(getUTCISOWeek(date), {unit: 'isoWeek'})
  },

  // ISO week: 01, 02, ..., 53
  'WW': function (date) {
    return addLeadingZeros(getUTCISOWeek(date), 2)
  },

  // Year: 00, 01, ..., 99
  'YY': function (date) {
    return addLeadingZeros(date.getUTCFullYear(), 4).substr(2)
  },

  // Year: 1900, 1901, ..., 2099
  'YYYY': function (date) {
    return addLeadingZeros(date.getUTCFullYear(), 4)
  },

  // ISO week-numbering year: 00, 01, ..., 99
  'GG': function (date) {
    return String(getUTCISOWeekYear(date)).substr(2)
  },

  // ISO week-numbering year: 1900, 1901, ..., 2099
  'GGGG': function (date) {
    return getUTCISOWeekYear(date)
  },

  // Hour: 0, 1, ... 23
  'H': function (date) {
    return date.getUTCHours()
  },

  // Hour: 00, 01, ..., 23
  'HH': function (date) {
    return addLeadingZeros(date.getUTCHours(), 2)
  },

  // Hour: 1, 2, ..., 12
  'h': function (date) {
    var hours = date.getUTCHours();
    if (hours === 0) {
      return 12
    } else if (hours > 12) {
      return hours % 12
    } else {
      return hours
    }
  },

  // Hour: 01, 02, ..., 12
  'hh': function (date) {
    return addLeadingZeros(formatters['h'](date), 2)
  },

  // Minute: 0, 1, ..., 59
  'm': function (date) {
    return date.getUTCMinutes()
  },

  // Minute: 00, 01, ..., 59
  'mm': function (date) {
    return addLeadingZeros(date.getUTCMinutes(), 2)
  },

  // Second: 0, 1, ..., 59
  's': function (date) {
    return date.getUTCSeconds()
  },

  // Second: 00, 01, ..., 59
  'ss': function (date) {
    return addLeadingZeros(date.getUTCSeconds(), 2)
  },

  // 1/10 of second: 0, 1, ..., 9
  'S': function (date) {
    return Math.floor(date.getUTCMilliseconds() / 100)
  },

  // 1/100 of second: 00, 01, ..., 99
  'SS': function (date) {
    return addLeadingZeros(Math.floor(date.getUTCMilliseconds() / 10), 2)
  },

  // Millisecond: 000, 001, ..., 999
  'SSS': function (date) {
    return addLeadingZeros(date.getUTCMilliseconds(), 3)
  },

  // Timezone: -01:00, +00:00, ... +12:00
  'Z': function (date, options) {
    var originalDate = options._originalDate || date;
    return formatTimezone(originalDate.getTimezoneOffset(), ':')
  },

  // Timezone: -0100, +0000, ... +1200
  'ZZ': function (date, options) {
    var originalDate = options._originalDate || date;
    return formatTimezone(originalDate.getTimezoneOffset())
  },

  // Seconds timestamp: 512969520
  'X': function (date, options) {
    var originalDate = options._originalDate || date;
    return Math.floor(originalDate.getTime() / 1000)
  },

  // Milliseconds timestamp: 512969520900
  'x': function (date, options) {
    var originalDate = options._originalDate || date;
    return originalDate.getTime()
  },

  // AM, PM
  'A': function (date, options) {
    return options.locale.localize.timeOfDay(date.getUTCHours(), {type: 'uppercase'})
  },

  // am, pm
  'a': function (date, options) {
    return options.locale.localize.timeOfDay(date.getUTCHours(), {type: 'lowercase'})
  },

  // a.m., p.m.
  'aa': function (date, options) {
    return options.locale.localize.timeOfDay(date.getUTCHours(), {type: 'long'})
  }
};

function formatTimezone (offset, delimeter) {
  delimeter = delimeter || '';
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  return sign + addLeadingZeros(hours, 2) + delimeter + addLeadingZeros(minutes, 2)
}

function addLeadingZeros (number, targetLength) {
  var output = Math.abs(number).toString();
  while (output.length < targetLength) {
    output = '0' + output;
  }
  return output
}

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function addUTCMinutes (dirtyDate, dirtyAmount, dirtyOptions) {
  var date = toDate(dirtyDate, dirtyOptions);
  var amount = Number(dirtyAmount);
  date.setUTCMinutes(date.getUTCMinutes() + amount);
  return date
}

var longFormattingTokensRegExp = /(\[[^[]*])|(\\)?(LTS|LT|LLLL|LLL|LL|L|llll|lll|ll|l)/g;
var defaultFormattingTokensRegExp = /(\[[^[]*])|(\\)?(x|ss|s|mm|m|hh|h|do|dddd|ddd|dd|d|aa|a|ZZ|Z|YYYY|YY|X|Wo|WW|W|SSS|SS|S|Qo|Q|Mo|MMMM|MMM|MM|M|HH|H|GGGG|GG|E|Do|DDDo|DDDD|DDD|DD|D|A|.)/g;

/**
 * @name format
 * @category Common Helpers
 * @summary Format the date.
 *
 * @description
 * Return the formatted date string in the given format.
 *
 * Accepted tokens:
 * | Unit                    | Token | Result examples                  |
 * |-------------------------|-------|----------------------------------|
 * | Month                   | M     | 1, 2, ..., 12                    |
 * |                         | Mo    | 1st, 2nd, ..., 12th              |
 * |                         | MM    | 01, 02, ..., 12                  |
 * |                         | MMM   | Jan, Feb, ..., Dec               |
 * |                         | MMMM  | January, February, ..., December |
 * | Quarter                 | Q     | 1, 2, 3, 4                       |
 * |                         | Qo    | 1st, 2nd, 3rd, 4th               |
 * | Day of month            | D     | 1, 2, ..., 31                    |
 * |                         | Do    | 1st, 2nd, ..., 31st              |
 * |                         | DD    | 01, 02, ..., 31                  |
 * | Day of year             | DDD   | 1, 2, ..., 366                   |
 * |                         | DDDo  | 1st, 2nd, ..., 366th             |
 * |                         | DDDD  | 001, 002, ..., 366               |
 * | Day of week             | d     | 0, 1, ..., 6                     |
 * |                         | do    | 0th, 1st, ..., 6th               |
 * |                         | dd    | Su, Mo, ..., Sa                  |
 * |                         | ddd   | Sun, Mon, ..., Sat               |
 * |                         | dddd  | Sunday, Monday, ..., Saturday    |
 * | Day of ISO week         | E     | 1, 2, ..., 7                     |
 * | ISO week                | W     | 1, 2, ..., 53                    |
 * |                         | Wo    | 1st, 2nd, ..., 53rd              |
 * |                         | WW    | 01, 02, ..., 53                  |
 * | Year                    | YY    | 00, 01, ..., 99                  |
 * |                         | YYYY  | 1900, 1901, ..., 2099            |
 * | ISO week-numbering year | GG    | 00, 01, ..., 99                  |
 * |                         | GGGG  | 1900, 1901, ..., 2099            |
 * | AM/PM                   | A     | AM, PM                           |
 * |                         | a     | am, pm                           |
 * |                         | aa    | a.m., p.m.                       |
 * | Hour                    | H     | 0, 1, ... 23                     |
 * |                         | HH    | 00, 01, ... 23                   |
 * |                         | h     | 1, 2, ..., 12                    |
 * |                         | hh    | 01, 02, ..., 12                  |
 * | Minute                  | m     | 0, 1, ..., 59                    |
 * |                         | mm    | 00, 01, ..., 59                  |
 * | Second                  | s     | 0, 1, ..., 59                    |
 * |                         | ss    | 00, 01, ..., 59                  |
 * | 1/10 of second          | S     | 0, 1, ..., 9                     |
 * | 1/100 of second         | SS    | 00, 01, ..., 99                  |
 * | Millisecond             | SSS   | 000, 001, ..., 999               |
 * | Timezone                | Z     | -01:00, +00:00, ... +12:00       |
 * |                         | ZZ    | -0100, +0000, ..., +1200         |
 * | Seconds timestamp       | X     | 512969520                        |
 * | Milliseconds timestamp  | x     | 512969520900                     |
 * | Long format             | LT    | 05:30 a.m.                       |
 * |                         | LTS   | 05:30:15 a.m.                    |
 * |                         | L     | 07/02/1995                       |
 * |                         | l     | 7/2/1995                         |
 * |                         | LL    | July 2 1995                      |
 * |                         | ll    | Jul 2 1995                       |
 * |                         | LLL   | July 2 1995 05:30 a.m.           |
 * |                         | lll   | Jul 2 1995 05:30 a.m.            |
 * |                         | LLLL  | Sunday, July 2 1995 05:30 a.m.   |
 * |                         | llll  | Sun, Jul 2 1995 05:30 a.m.       |
 *
 * The characters wrapped in square brackets are escaped.
 *
 * The result may vary by locale.
 *
 * @param {Date|String|Number} date - the original date
 * @param {String} format - the string of tokens
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
 * @returns {String} the formatted date string
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 * @throws {RangeError} `options.locale` must contain `localize` property
 * @throws {RangeError} `options.locale` must contain `formatLong` property
 *
 * @example
 * // Represent 11 February 2014 in middle-endian format:
 * var result = format(
 *   new Date(2014, 1, 11),
 *   'MM/DD/YYYY'
 * )
 * //=> '02/11/2014'
 *
 * @example
 * // Represent 2 July 2014 in Esperanto:
 * import { eoLocale } from 'date-fns/locale/eo'
 * var result = format(
 *   new Date(2014, 6, 2),
 *   'Do [de] MMMM YYYY',
 *   {locale: eoLocale}
 * )
 * //=> '2-a de julio 2014'
 */
function format (dirtyDate, dirtyFormatStr, dirtyOptions) {
  if (arguments.length < 2) {
    throw new TypeError('2 arguments required, but only ' + arguments.length + ' present')
  }

  var formatStr = String(dirtyFormatStr);
  var options = dirtyOptions || {};

  var locale = options.locale || locale$1;

  if (!locale.localize) {
    throw new RangeError('locale must contain localize property')
  }

  if (!locale.formatLong) {
    throw new RangeError('locale must contain formatLong property')
  }

  var localeFormatters = locale.formatters || {};
  var formattingTokensRegExp = locale.formattingTokensRegExp || defaultFormattingTokensRegExp;
  var formatLong = locale.formatLong;

  var originalDate = toDate(dirtyDate, options);

  if (!isValid(originalDate, options)) {
    return 'Invalid Date'
  }

  // Convert the date in system timezone to the same date in UTC+00:00 timezone.
  // This ensures that when UTC functions will be implemented, locales will be compatible with them.
  // See an issue about UTC functions: https://github.com/date-fns/date-fns/issues/376
  var timezoneOffset = originalDate.getTimezoneOffset();
  var utcDate = addUTCMinutes(originalDate, -timezoneOffset, options);

  var formatterOptions = cloneObject(options);
  formatterOptions.locale = locale;
  formatterOptions.formatters = formatters;

  // When UTC functions will be implemented, options._originalDate will likely be a part of public API.
  // Right now, please don't use it in locales. If you have to use an original date,
  // please restore it from `date`, adding a timezone offset to it.
  formatterOptions._originalDate = originalDate;

  var result = formatStr
    .replace(longFormattingTokensRegExp, function (substring) {
      if (substring[0] === '[') {
        return substring
      }

      if (substring[0] === '\\') {
        return cleanEscapedString(substring)
      }

      return formatLong(substring)
    })
    .replace(formattingTokensRegExp, function (substring) {
      var formatter = localeFormatters[substring] || formatters[substring];

      if (formatter) {
        return formatter(utcDate, formatterOptions)
      } else {
        return cleanEscapedString(substring)
      }
    });

  return result
}

function cleanEscapedString (input) {
  if (input.match(/\[[\s\S]/)) {
    return input.replace(/^\[|]$/g, '')
  }
  return input.replace(/\\/g, '')
}

/**
 * @name subMinutes
 * @category Minute Helpers
 * @summary Subtract the specified number of minutes from the given date.
 *
 * @description
 * Subtract the specified number of minutes from the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of minutes to be subtracted
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @returns {Date} the new date with the mintues subtracted
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Subtract 30 minutes from 10 July 2014 12:00:00:
 * var result = subMinutes(new Date(2014, 6, 10, 12, 0), 30)
 * //=> Thu Jul 10 2014 11:30:00
 */
function subMinutes (dirtyDate, dirtyAmount, dirtyOptions) {
  if (arguments.length < 2) {
    throw new TypeError('2 arguments required, but only ' + arguments.length + ' present')
  }

  var amount = Number(dirtyAmount);
  return addMinutes(dirtyDate, -amount, dirtyOptions)
}

/**
 * @name isAfter
 * @category Common Helpers
 * @summary Is the first date after the second one?
 *
 * @description
 * Is the first date after the second one?
 *
 * @param {Date|String|Number} date - the date that should be after the other one to return true
 * @param {Date|String|Number} dateToCompare - the date to compare with
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @returns {Boolean} the first date is after the second date
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Is 10 July 1989 after 11 February 1987?
 * var result = isAfter(new Date(1989, 6, 10), new Date(1987, 1, 11))
 * //=> true
 */
function isAfter (dirtyDate, dirtyDateToCompare, dirtyOptions) {
  if (arguments.length < 2) {
    throw new TypeError('2 arguments required, but only ' + arguments.length + ' present')
  }

  var date = toDate(dirtyDate, dirtyOptions);
  var dateToCompare = toDate(dirtyDateToCompare, dirtyOptions);
  return date.getTime() > dateToCompare.getTime()
}

/**
 * @name isBefore
 * @category Common Helpers
 * @summary Is the first date before the second one?
 *
 * @description
 * Is the first date before the second one?
 *
 * @param {Date|String|Number} date - the date that should be before the other one to return true
 * @param {Date|String|Number} dateToCompare - the date to compare with
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @returns {Boolean} the first date is before the second date
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Is 10 July 1989 before 11 February 1987?
 * var result = isBefore(new Date(1989, 6, 10), new Date(1987, 1, 11))
 * //=> false
 */
function isBefore (dirtyDate, dirtyDateToCompare, dirtyOptions) {
  if (arguments.length < 2) {
    throw new TypeError('2 arguments required, but only ' + arguments.length + ' present')
  }

  var date = toDate(dirtyDate, dirtyOptions);
  var dateToCompare = toDate(dirtyDateToCompare, dirtyOptions);
  return date.getTime() < dateToCompare.getTime()
}

/**
 * @name isEqual
 * @category Common Helpers
 * @summary Are the given dates equal?
 *
 * @description
 * Are the given dates equal?
 *
 * @param {Date|String|Number} dateLeft - the first date to compare
 * @param {Date|String|Number} dateRight - the second date to compare
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @returns {Boolean} the dates are equal
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Are 2 July 2014 06:30:45.000 and 2 July 2014 06:30:45.500 equal?
 * var result = isEqual(
 *   new Date(2014, 6, 2, 6, 30, 45, 0)
 *   new Date(2014, 6, 2, 6, 30, 45, 500)
 * )
 * //=> false
 */
function isEqual$1 (dirtyLeftDate, dirtyRightDate, dirtyOptions) {
  if (arguments.length < 2) {
    throw new TypeError('2 arguments required, but only ' + arguments.length + ' present')
  }

  var dateLeft = toDate(dirtyLeftDate, dirtyOptions);
  var dateRight = toDate(dirtyRightDate, dirtyOptions);
  return dateLeft.getTime() === dateRight.getTime()
}

var patterns$1 = {
  'M': /^(1[0-2]|0?\d)/, // 0 to 12
  'D': /^(3[0-1]|[0-2]?\d)/, // 0 to 31
  'DDD': /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/, // 0 to 366
  'W': /^(5[0-3]|[0-4]?\d)/, // 0 to 53
  'YYYY': /^(\d{1,4})/, // 0 to 9999
  'H': /^(2[0-3]|[0-1]?\d)/, // 0 to 23
  'm': /^([0-5]?\d)/, // 0 to 59
  'Z': /^([+-])(\d{2}):(\d{2})/,
  'ZZ': /^([+-])(\d{2})(\d{2})/,
  singleDigit: /^(\d)/,
  twoDigits: /^(\d{2})/,
  threeDigits: /^(\d{3})/,
  fourDigits: /^(\d{4})/,
  anyDigits: /^(\d+)/
};

function parseDecimal$1 (matchResult) {
  return parseInt(matchResult[1], 10)
}

var parsers = {
  // Year: 00, 01, ..., 99
  'YY': {
    unit: 'twoDigitYear',
    match: patterns$1.twoDigits,
    parse: function (matchResult) {
      return parseDecimal$1(matchResult)
    }
  },

  // Year: 1900, 1901, ..., 2099
  'YYYY': {
    unit: 'year',
    match: patterns$1.YYYY,
    parse: parseDecimal$1
  },

  // ISO week-numbering year: 00, 01, ..., 99
  'GG': {
    unit: 'isoYear',
    match: patterns$1.twoDigits,
    parse: function (matchResult) {
      return parseDecimal$1(matchResult) + 1900
    }
  },

  // ISO week-numbering year: 1900, 1901, ..., 2099
  'GGGG': {
    unit: 'isoYear',
    match: patterns$1.YYYY,
    parse: parseDecimal$1
  },

  // Quarter: 1, 2, 3, 4
  'Q': {
    unit: 'quarter',
    match: patterns$1.singleDigit,
    parse: parseDecimal$1
  },

  // Ordinal quarter
  'Qo': {
    unit: 'quarter',
    match: function (string, options) {
      return options.locale.match.ordinalNumbers(string, {unit: 'quarter'})
    },
    parse: function (matchResult, options) {
      return options.locale.match.ordinalNumber(matchResult, {unit: 'quarter'})
    }
  },

  // Month: 1, 2, ..., 12
  'M': {
    unit: 'month',
    match: patterns$1.M,
    parse: function (matchResult) {
      return parseDecimal$1(matchResult) - 1
    }
  },

  // Ordinal month
  'Mo': {
    unit: 'month',
    match: function (string, options) {
      return options.locale.match.ordinalNumbers(string, {unit: 'month'})
    },
    parse: function (matchResult, options) {
      return options.locale.match.ordinalNumber(matchResult, {unit: 'month'}) - 1
    }
  },

  // Month: 01, 02, ..., 12
  'MM': {
    unit: 'month',
    match: patterns$1.twoDigits,
    parse: function (matchResult) {
      return parseDecimal$1(matchResult) - 1
    }
  },

  // Month: Jan, Feb, ..., Dec
  'MMM': {
    unit: 'month',
    match: function (string, options) {
      return options.locale.match.months(string, {type: 'short'})
    },
    parse: function (matchResult, options) {
      return options.locale.match.month(matchResult, {type: 'short'})
    }
  },

  // Month: January, February, ..., December
  'MMMM': {
    unit: 'month',
    match: function (string, options) {
      return options.locale.match.months(string, {type: 'long'}) ||
        options.locale.match.months(string, {type: 'short'})
    },
    parse: function (matchResult, options) {
      var parseResult = options.locale.match.month(matchResult, {type: 'long'});

      if (parseResult == null) {
        parseResult = options.locale.match.month(matchResult, {type: 'short'});
      }

      return parseResult
    }
  },

  // ISO week: 1, 2, ..., 53
  'W': {
    unit: 'isoWeek',
    match: patterns$1.W,
    parse: parseDecimal$1
  },

  // Ordinal ISO week
  'Wo': {
    unit: 'isoWeek',
    match: function (string, options) {
      return options.locale.match.ordinalNumbers(string, {unit: 'isoWeek'})
    },
    parse: function (matchResult, options) {
      return options.locale.match.ordinalNumber(matchResult, {unit: 'isoWeek'})
    }
  },

  // ISO week: 01, 02, ..., 53
  'WW': {
    unit: 'isoWeek',
    match: patterns$1.twoDigits,
    parse: parseDecimal$1
  },

  // Day of week: 0, 1, ..., 6
  'd': {
    unit: 'dayOfWeek',
    match: patterns$1.singleDigit,
    parse: parseDecimal$1
  },

  // Ordinal day of week
  'do': {
    unit: 'dayOfWeek',
    match: function (string, options) {
      return options.locale.match.ordinalNumbers(string, {unit: 'dayOfWeek'})
    },
    parse: function (matchResult, options) {
      return options.locale.match.ordinalNumber(matchResult, {unit: 'dayOfWeek'})
    }
  },

  // Day of week: Su, Mo, ..., Sa
  'dd': {
    unit: 'dayOfWeek',
    match: function (string, options) {
      return options.locale.match.weekdays(string, {type: 'narrow'})
    },
    parse: function (matchResult, options) {
      return options.locale.match.weekday(matchResult, {type: 'narrow'})
    }
  },

  // Day of week: Sun, Mon, ..., Sat
  'ddd': {
    unit: 'dayOfWeek',
    match: function (string, options) {
      return options.locale.match.weekdays(string, {type: 'short'}) ||
        options.locale.match.weekdays(string, {type: 'narrow'})
    },
    parse: function (matchResult, options) {
      var parseResult = options.locale.match.weekday(matchResult, {type: 'short'});

      if (parseResult == null) {
        parseResult = options.locale.match.weekday(matchResult, {type: 'narrow'});
      }

      return parseResult
    }
  },

  // Day of week: Sunday, Monday, ..., Saturday
  'dddd': {
    unit: 'dayOfWeek',
    match: function (string, options) {
      return options.locale.match.weekdays(string, {type: 'long'}) ||
        options.locale.match.weekdays(string, {type: 'short'}) ||
        options.locale.match.weekdays(string, {type: 'narrow'})
    },
    parse: function (matchResult, options) {
      var parseResult = options.locale.match.weekday(matchResult, {type: 'long'});

      if (parseResult == null) {
        parseResult = options.locale.match.weekday(matchResult, {type: 'short'});

        if (parseResult == null) {
          parseResult = options.locale.match.weekday(matchResult, {type: 'narrow'});
        }
      }

      return parseResult
    }
  },

  // Day of ISO week: 1, 2, ..., 7
  'E': {
    unit: 'dayOfISOWeek',
    match: patterns$1.singleDigit,
    parse: function (matchResult) {
      return parseDecimal$1(matchResult)
    }
  },

  // Day of month: 1, 2, ..., 31
  'D': {
    unit: 'dayOfMonth',
    match: patterns$1.D,
    parse: parseDecimal$1
  },

  // Ordinal day of month
  'Do': {
    unit: 'dayOfMonth',
    match: function (string, options) {
      return options.locale.match.ordinalNumbers(string, {unit: 'dayOfMonth'})
    },
    parse: function (matchResult, options) {
      return options.locale.match.ordinalNumber(matchResult, {unit: 'dayOfMonth'})
    }
  },

  // Day of month: 01, 02, ..., 31
  'DD': {
    unit: 'dayOfMonth',
    match: patterns$1.twoDigits,
    parse: parseDecimal$1
  },

  // Day of year: 1, 2, ..., 366
  'DDD': {
    unit: 'dayOfYear',
    match: patterns$1.DDD,
    parse: parseDecimal$1
  },

  // Ordinal day of year
  'DDDo': {
    unit: 'dayOfYear',
    match: function (string, options) {
      return options.locale.match.ordinalNumbers(string, {unit: 'dayOfYear'})
    },
    parse: function (matchResult, options) {
      return options.locale.match.ordinalNumber(matchResult, {unit: 'dayOfYear'})
    }
  },

  // Day of year: 001, 002, ..., 366
  'DDDD': {
    unit: 'dayOfYear',
    match: patterns$1.threeDigits,
    parse: parseDecimal$1
  },

  // AM, PM
  'A': {
    unit: 'timeOfDay',
    match: function (string, options) {
      return options.locale.match.timesOfDay(string, {type: 'short'})
    },
    parse: function (matchResult, options) {
      return options.locale.match.timeOfDay(matchResult, {type: 'short'})
    }
  },

  // a.m., p.m.
  'aa': {
    unit: 'timeOfDay',
    match: function (string, options) {
      return options.locale.match.timesOfDay(string, {type: 'long'}) ||
        options.locale.match.timesOfDay(string, {type: 'short'})
    },
    parse: function (matchResult, options) {
      var parseResult = options.locale.match.timeOfDay(matchResult, {type: 'long'});

      if (parseResult == null) {
        parseResult = options.locale.match.timeOfDay(matchResult, {type: 'short'});
      }

      return parseResult
    }
  },

  // Hour: 0, 1, ... 23
  'H': {
    unit: 'hours',
    match: patterns$1.H,
    parse: parseDecimal$1
  },

  // Hour: 00, 01, ..., 23
  'HH': {
    unit: 'hours',
    match: patterns$1.twoDigits,
    parse: parseDecimal$1
  },

  // Hour: 1, 2, ..., 12
  'h': {
    unit: 'timeOfDayHours',
    match: patterns$1.M,
    parse: parseDecimal$1
  },

  // Hour: 01, 02, ..., 12
  'hh': {
    unit: 'timeOfDayHours',
    match: patterns$1.twoDigits,
    parse: parseDecimal$1
  },

  // Minute: 0, 1, ..., 59
  'm': {
    unit: 'minutes',
    match: patterns$1.m,
    parse: parseDecimal$1
  },

  // Minute: 00, 01, ..., 59
  'mm': {
    unit: 'minutes',
    match: patterns$1.twoDigits,
    parse: parseDecimal$1
  },

  // Second: 0, 1, ..., 59
  's': {
    unit: 'seconds',
    match: patterns$1.m,
    parse: parseDecimal$1
  },

  // Second: 00, 01, ..., 59
  'ss': {
    unit: 'seconds',
    match: patterns$1.twoDigits,
    parse: parseDecimal$1
  },

  // 1/10 of second: 0, 1, ..., 9
  'S': {
    unit: 'milliseconds',
    match: patterns$1.singleDigit,
    parse: function (matchResult) {
      return parseDecimal$1(matchResult) * 100
    }
  },

  // 1/100 of second: 00, 01, ..., 99
  'SS': {
    unit: 'milliseconds',
    match: patterns$1.twoDigits,
    parse: function (matchResult) {
      return parseDecimal$1(matchResult) * 10
    }
  },

  // Millisecond: 000, 001, ..., 999
  'SSS': {
    unit: 'milliseconds',
    match: patterns$1.threeDigits,
    parse: parseDecimal$1
  },

  // Timezone: -01:00, +00:00, ... +12:00
  'Z': {
    unit: 'timezone',
    match: patterns$1.Z,
    parse: function (matchResult) {
      var sign = matchResult[1];
      var hours = parseInt(matchResult[2], 10);
      var minutes = parseInt(matchResult[3], 10);
      var absoluteOffset = hours * 60 + minutes;
      return (sign === '+') ? absoluteOffset : -absoluteOffset
    }
  },

  // Timezone: -0100, +0000, ... +1200
  'ZZ': {
    unit: 'timezone',
    match: patterns$1.ZZ,
    parse: function (matchResult) {
      var sign = matchResult[1];
      var hours = parseInt(matchResult[2], 10);
      var minutes = parseInt(matchResult[3], 10);
      var absoluteOffset = hours * 60 + minutes;
      return (sign === '+') ? absoluteOffset : -absoluteOffset
    }
  },

  // Seconds timestamp: 512969520
  'X': {
    unit: 'timestamp',
    match: patterns$1.anyDigits,
    parse: function (matchResult) {
      return parseDecimal$1(matchResult) * 1000
    }
  },

  // Milliseconds timestamp: 512969520900
  'x': {
    unit: 'timestamp',
    match: patterns$1.anyDigits,
    parse: parseDecimal$1
  }
};

parsers['a'] = parsers['A'];

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function setUTCDay (dirtyDate, dirtyDay, dirtyOptions) {
  var options = dirtyOptions || {};
  var locale = options.locale;
  var localeWeekStartsOn = locale && locale.options && locale.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn === undefined ? 0 : Number(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn === undefined ? defaultWeekStartsOn : Number(options.weekStartsOn);

  // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively')
  }

  var date = toDate(dirtyDate, dirtyOptions);
  var day = Number(dirtyDay);

  var currentDay = date.getUTCDay();

  var remainder = day % 7;
  var dayIndex = (remainder + 7) % 7;

  var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;

  date.setUTCDate(date.getUTCDate() + diff);
  return date
}

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function setUTCISODay (dirtyDate, dirtyDay, dirtyOptions) {
  var day = Number(dirtyDay);

  if (day % 7 === 0) {
    day = day - 7;
  }

  var weekStartsOn = 1;
  var date = toDate(dirtyDate, dirtyOptions);
  var currentDay = date.getUTCDay();

  var remainder = day % 7;
  var dayIndex = (remainder + 7) % 7;

  var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;

  date.setUTCDate(date.getUTCDate() + diff);
  return date
}

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function setUTCISOWeek (dirtyDate, dirtyISOWeek, dirtyOptions) {
  var date = toDate(dirtyDate, dirtyOptions);
  var isoWeek = Number(dirtyISOWeek);
  var diff = getUTCISOWeek(date, dirtyOptions) - isoWeek;
  date.setUTCDate(date.getUTCDate() - diff * 7);
  return date
}

var MILLISECONDS_IN_DAY$3 = 86400000;

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function setUTCISOWeekYear (dirtyDate, dirtyISOYear, dirtyOptions) {
  var date = toDate(dirtyDate, dirtyOptions);
  var isoYear = Number(dirtyISOYear);
  var dateStartOfYear = startOfUTCISOWeekYear(date, dirtyOptions);
  var diff = Math.floor((date.getTime() - dateStartOfYear.getTime()) / MILLISECONDS_IN_DAY$3);
  var fourthOfJanuary = new Date(0);
  fourthOfJanuary.setUTCFullYear(isoYear, 0, 4);
  fourthOfJanuary.setUTCHours(0, 0, 0, 0);
  date = startOfUTCISOWeekYear(fourthOfJanuary, dirtyOptions);
  date.setUTCDate(date.getUTCDate() + diff);
  return date
}

var MILLISECONDS_IN_MINUTE$7 = 60000;

function setTimeOfDay (hours, timeOfDay) {
  var isAM = timeOfDay === 0;

  if (isAM) {
    if (hours === 12) {
      return 0
    }
  } else {
    if (hours !== 12) {
      return 12 + hours
    }
  }

  return hours
}

var units = {
  twoDigitYear: {
    priority: 10,
    set: function (dateValues, value) {
      var century = Math.floor(dateValues.date.getUTCFullYear() / 100);
      var year = century * 100 + value;
      dateValues.date.setUTCFullYear(year, 0, 1);
      dateValues.date.setUTCHours(0, 0, 0, 0);
      return dateValues
    }
  },

  year: {
    priority: 10,
    set: function (dateValues, value) {
      dateValues.date.setUTCFullYear(value, 0, 1);
      dateValues.date.setUTCHours(0, 0, 0, 0);
      return dateValues
    }
  },

  isoYear: {
    priority: 10,
    set: function (dateValues, value, options) {
      dateValues.date = startOfUTCISOWeekYear(setUTCISOWeekYear(dateValues.date, value, options), options);
      return dateValues
    }
  },

  quarter: {
    priority: 20,
    set: function (dateValues, value) {
      dateValues.date.setUTCMonth((value - 1) * 3, 1);
      dateValues.date.setUTCHours(0, 0, 0, 0);
      return dateValues
    }
  },

  month: {
    priority: 30,
    set: function (dateValues, value) {
      dateValues.date.setUTCMonth(value, 1);
      dateValues.date.setUTCHours(0, 0, 0, 0);
      return dateValues
    }
  },

  isoWeek: {
    priority: 40,
    set: function (dateValues, value, options) {
      dateValues.date = startOfUTCISOWeek(setUTCISOWeek(dateValues.date, value, options), options);
      return dateValues
    }
  },

  dayOfWeek: {
    priority: 50,
    set: function (dateValues, value, options) {
      dateValues.date = setUTCDay(dateValues.date, value, options);
      dateValues.date.setUTCHours(0, 0, 0, 0);
      return dateValues
    }
  },

  dayOfISOWeek: {
    priority: 50,
    set: function (dateValues, value, options) {
      dateValues.date = setUTCISODay(dateValues.date, value, options);
      dateValues.date.setUTCHours(0, 0, 0, 0);
      return dateValues
    }
  },

  dayOfMonth: {
    priority: 50,
    set: function (dateValues, value) {
      dateValues.date.setUTCDate(value);
      dateValues.date.setUTCHours(0, 0, 0, 0);
      return dateValues
    }
  },

  dayOfYear: {
    priority: 50,
    set: function (dateValues, value) {
      dateValues.date.setUTCMonth(0, value);
      dateValues.date.setUTCHours(0, 0, 0, 0);
      return dateValues
    }
  },

  timeOfDay: {
    priority: 60,
    set: function (dateValues, value, options) {
      dateValues.timeOfDay = value;
      return dateValues
    }
  },

  hours: {
    priority: 70,
    set: function (dateValues, value, options) {
      dateValues.date.setUTCHours(value, 0, 0, 0);
      return dateValues
    }
  },

  timeOfDayHours: {
    priority: 70,
    set: function (dateValues, value, options) {
      var timeOfDay = dateValues.timeOfDay;
      if (timeOfDay != null) {
        value = setTimeOfDay(value, timeOfDay);
      }
      dateValues.date.setUTCHours(value, 0, 0, 0);
      return dateValues
    }
  },

  minutes: {
    priority: 80,
    set: function (dateValues, value) {
      dateValues.date.setUTCMinutes(value, 0, 0);
      return dateValues
    }
  },

  seconds: {
    priority: 90,
    set: function (dateValues, value) {
      dateValues.date.setUTCSeconds(value, 0);
      return dateValues
    }
  },

  milliseconds: {
    priority: 100,
    set: function (dateValues, value) {
      dateValues.date.setUTCMilliseconds(value);
      return dateValues
    }
  },

  timezone: {
    priority: 110,
    set: function (dateValues, value) {
      dateValues.date = new Date(dateValues.date.getTime() - value * MILLISECONDS_IN_MINUTE$7);
      return dateValues
    }
  },

  timestamp: {
    priority: 120,
    set: function (dateValues, value) {
      dateValues.date = new Date(value);
      return dateValues
    }
  }
};

var TIMEZONE_UNIT_PRIORITY = 110;
var MILLISECONDS_IN_MINUTE$6 = 60000;

var longFormattingTokensRegExp$1 = /(\[[^[]*])|(\\)?(LTS|LT|LLLL|LLL|LL|L|llll|lll|ll|l)/g;
var defaultParsingTokensRegExp = /(\[[^[]*])|(\\)?(x|ss|s|mm|m|hh|h|do|dddd|ddd|dd|d|aa|a|ZZ|Z|YYYY|YY|X|Wo|WW|W|SSS|SS|S|Qo|Q|Mo|MMMM|MMM|MM|M|HH|H|GGGG|GG|E|Do|DDDo|DDDD|DDD|DD|D|A|.)/g;

/**
 * @name parse
 * @category Common Helpers
 * @summary Parse the date.
 *
 * @description
 * Return the date parsed from string using the given format.
 *
 * Accepted format tokens:
 * | Unit                    | Priority | Token | Input examples                   |
 * |-------------------------|----------|-------|----------------------------------|
 * | Year                    | 10       | YY    | 00, 01, ..., 99                  |
 * |                         |          | YYYY  | 1900, 1901, ..., 2099            |
 * | ISO week-numbering year | 10       | GG    | 00, 01, ..., 99                  |
 * |                         |          | GGGG  | 1900, 1901, ..., 2099            |
 * | Quarter                 | 20       | Q     | 1, 2, 3, 4                       |
 * |                         |          | Qo    | 1st, 2nd, 3rd, 4th               |
 * | Month                   | 30       | M     | 1, 2, ..., 12                    |
 * |                         |          | Mo    | 1st, 2nd, ..., 12th              |
 * |                         |          | MM    | 01, 02, ..., 12                  |
 * |                         |          | MMM   | Jan, Feb, ..., Dec               |
 * |                         |          | MMMM  | January, February, ..., December |
 * | ISO week                | 40       | W     | 1, 2, ..., 53                    |
 * |                         |          | Wo    | 1st, 2nd, ..., 53rd              |
 * |                         |          | WW    | 01, 02, ..., 53                  |
 * | Day of week             | 50       | d     | 0, 1, ..., 6                     |
 * |                         |          | do    | 0th, 1st, ..., 6th               |
 * |                         |          | dd    | Su, Mo, ..., Sa                  |
 * |                         |          | ddd   | Sun, Mon, ..., Sat               |
 * |                         |          | dddd  | Sunday, Monday, ..., Saturday    |
 * | Day of ISO week         | 50       | E     | 1, 2, ..., 7                     |
 * | Day of month            | 50       | D     | 1, 2, ..., 31                    |
 * |                         |          | Do    | 1st, 2nd, ..., 31st              |
 * |                         |          | DD    | 01, 02, ..., 31                  |
 * | Day of year             | 50       | DDD   | 1, 2, ..., 366                   |
 * |                         |          | DDDo  | 1st, 2nd, ..., 366th             |
 * |                         |          | DDDD  | 001, 002, ..., 366               |
 * | Time of day             | 60       | A     | AM, PM                           |
 * |                         |          | a     | am, pm                           |
 * |                         |          | aa    | a.m., p.m.                       |
 * | Hour                    | 70       | H     | 0, 1, ... 23                     |
 * |                         |          | HH    | 00, 01, ... 23                   |
 * | Time of day hour        | 70       | h     | 1, 2, ..., 12                    |
 * |                         |          | hh    | 01, 02, ..., 12                  |
 * | Minute                  | 80       | m     | 0, 1, ..., 59                    |
 * |                         |          | mm    | 00, 01, ..., 59                  |
 * | Second                  | 90       | s     | 0, 1, ..., 59                    |
 * |                         |          | ss    | 00, 01, ..., 59                  |
 * | 1/10 of second          | 100      | S     | 0, 1, ..., 9                     |
 * | 1/100 of second         | 100      | SS    | 00, 01, ..., 99                  |
 * | Millisecond             | 100      | SSS   | 000, 001, ..., 999               |
 * | Timezone                | 110      | Z     | -01:00, +00:00, ... +12:00       |
 * |                         |          | ZZ    | -0100, +0000, ..., +1200         |
 * | Seconds timestamp       | 120      | X     | 512969520                        |
 * | Milliseconds timestamp  | 120      | x     | 512969520900                     |
 *
 * Values will be assigned to the date in the ascending order of its unit's priority.
 * Units of an equal priority overwrite each other in the order of appearance.
 *
 * If no values of higher priority are parsed (e.g. when parsing string 'January 1st' without a year),
 * the values will be taken from 3rd argument `baseDate` which works as a context of parsing.
 *
 * `baseDate` must be passed for correct work of the function.
 * If you're not sure which `baseDate` to supply, create a new instance of Date:
 * `parse('02/11/2014', 'MM/DD/YYYY', new Date())`
 * In this case parsing will be done in the context of the current date.
 * If `baseDate` is `Invalid Date` or a value not convertible to valid `Date`,
 * then `Invalid Date` will be returned.
 *
 * Also, `parse` unfolds long formats like those in [format]{@link https://date-fns.org/docs/format}:
 * | Token | Input examples                 |
 * |-------|--------------------------------|
 * | LT    | 05:30 a.m.                     |
 * | LTS   | 05:30:15 a.m.                  |
 * | L     | 07/02/1995                     |
 * | l     | 7/2/1995                       |
 * | LL    | July 2 1995                    |
 * | ll    | Jul 2 1995                     |
 * | LLL   | July 2 1995 05:30 a.m.         |
 * | lll   | Jul 2 1995 05:30 a.m.          |
 * | LLLL  | Sunday, July 2 1995 05:30 a.m. |
 * | llll  | Sun, Jul 2 1995 05:30 a.m.     |
 *
 * The characters wrapped in square brackets in the format string are escaped.
 *
 * The result may vary by locale.
 *
 * If `formatString` matches with `dateString` but does not provides tokens, `baseDate` will be returned.
 *
 * If parsing failed, `Invalid Date` will be returned.
 * Invalid Date is a Date, whose time value is NaN.
 * Time value of Date: http://es5.github.io/#x15.9.1.1
 *
 * @param {String} dateString - the string to parse
 * @param {String} formatString - the string of tokens
 * @param {Date|String|Number} baseDate - the date to took the missing higher priority values from
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
 * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @returns {Date} the parsed date
 * @throws {TypeError} 3 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
 * @throws {RangeError} `options.locale` must contain `match` property
 * @throws {RangeError} `options.locale` must contain `formatLong` property
 *
 * @example
 * // Parse 11 February 2014 from middle-endian format:
 * var result = parse(
 *   '02/11/2014',
 *   'MM/DD/YYYY',
 *   new Date()
 * )
 * //=> Tue Feb 11 2014 00:00:00
 *
 * @example
 * // Parse 28th of February in English locale in the context of 2010 year:
 * import eoLocale from 'date-fns/locale/eo'
 * var result = parse(
 *   '28-a de februaro',
 *   'Do [de] MMMM',
 *   new Date(2010, 0, 1)
 *   {locale: eoLocale}
 * )
 * //=> Sun Feb 28 2010 00:00:00
 */
function parse (dirtyDateString, dirtyFormatString, dirtyBaseDate, dirtyOptions) {
  if (arguments.length < 3) {
    throw new TypeError('3 arguments required, but only ' + arguments.length + ' present')
  }

  var dateString = String(dirtyDateString);
  var options = dirtyOptions || {};

  var weekStartsOn = options.weekStartsOn === undefined ? 0 : Number(options.weekStartsOn);

  // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively')
  }

  var locale = options.locale || locale$1;
  var localeParsers = locale.parsers || {};
  var localeUnits = locale.units || {};

  if (!locale.match) {
    throw new RangeError('locale must contain match property')
  }

  if (!locale.formatLong) {
    throw new RangeError('locale must contain formatLong property')
  }

  var formatString = String(dirtyFormatString)
    .replace(longFormattingTokensRegExp$1, function (substring) {
      if (substring[0] === '[') {
        return substring
      }

      if (substring[0] === '\\') {
        return cleanEscapedString$1(substring)
      }

      return locale.formatLong(substring)
    });

  if (formatString === '') {
    if (dateString === '') {
      return toDate(dirtyBaseDate, options)
    } else {
      return new Date(NaN)
    }
  }

  var subFnOptions = cloneObject(options);
  subFnOptions.locale = locale;

  var tokens = formatString.match(locale.parsingTokensRegExp || defaultParsingTokensRegExp);
  var tokensLength = tokens.length;

  // If timezone isn't specified, it will be set to the system timezone
  var setters = [{
    priority: TIMEZONE_UNIT_PRIORITY,
    set: dateToSystemTimezone,
    index: 0
  }];

  var i;
  for (i = 0; i < tokensLength; i++) {
    var token = tokens[i];
    var parser = localeParsers[token] || parsers[token];
    if (parser) {
      var matchResult;

      if (parser.match instanceof RegExp) {
        matchResult = parser.match.exec(dateString);
      } else {
        matchResult = parser.match(dateString, subFnOptions);
      }

      if (!matchResult) {
        return new Date(NaN)
      }

      var unitName = parser.unit;
      var unit = localeUnits[unitName] || units[unitName];

      setters.push({
        priority: unit.priority,
        set: unit.set,
        value: parser.parse(matchResult, subFnOptions),
        index: setters.length
      });

      var substring = matchResult[0];
      dateString = dateString.slice(substring.length);
    } else {
      var head = tokens[i].match(/^\[.*]$/) ? tokens[i].replace(/^\[|]$/g, '') : tokens[i];
      if (dateString.indexOf(head) === 0) {
        dateString = dateString.slice(head.length);
      } else {
        return new Date(NaN)
      }
    }
  }

  var uniquePrioritySetters = setters
    .map(function (setter) {
      return setter.priority
    })
    .sort(function (a, b) {
      return a - b
    })
    .filter(function (priority, index, array) {
      return array.indexOf(priority) === index
    })
    .map(function (priority) {
      return setters
        .filter(function (setter) {
          return setter.priority === priority
        })
        .reverse()
    })
    .map(function (setterArray) {
      return setterArray[0]
    });

  var date = toDate(dirtyBaseDate, options);

  if (isNaN(date)) {
    return new Date(NaN)
  }

  // Convert the date in system timezone to the same date in UTC+00:00 timezone.
  // This ensures that when UTC functions will be implemented, locales will be compatible with them.
  // See an issue about UTC functions: https://github.com/date-fns/date-fns/issues/37
  var utcDate = subMinutes(date, date.getTimezoneOffset());

  var dateValues = {date: utcDate};

  var settersLength = uniquePrioritySetters.length;
  for (i = 0; i < settersLength; i++) {
    var setter = uniquePrioritySetters[i];
    dateValues = setter.set(dateValues, setter.value, subFnOptions);
  }

  return dateValues.date
}

function dateToSystemTimezone (dateValues) {
  var date = dateValues.date;
  var time = date.getTime();

  // Get the system timezone offset at (moment of time - offset)
  var offset = date.getTimezoneOffset();

  // Get the system timezone offset at the exact moment of time
  offset = new Date(time + offset * MILLISECONDS_IN_MINUTE$6).getTimezoneOffset();

  // Convert date in timezone "UTC+00:00" to the system timezone
  dateValues.date = new Date(time + offset * MILLISECONDS_IN_MINUTE$6);

  return dateValues
}

function cleanEscapedString$1 (input) {
  if (input.match(/\[[\s\S]/)) {
    return input.replace(/^\[|]$/g, '')
  }
  return input.replace(/\\/g, '')
}

// This file is generated automatically by `scripts/build/indices.js`. Please, don't change it.

// 

/**
 * Custom parse behavior on top of date-fns parse function.
 */
function parseDate$1 (date, format$$1) {
  if (typeof date !== 'string') {
    return isValid(date) ? date : null;
  }

  var parsed = parse(date, format$$1, new Date());

  // if date is not valid or the formatted output after parsing does not match
  // the string value passed in (avoids overflows)
  if (!isValid(parsed) || format(parsed, format$$1) !== date) {
    return null;
  }

  return parsed;
}

var after = function (value, ref) {
  var otherValue = ref[0];
  var inclusion = ref[1];
  var format = ref[2];

  if (typeof format === 'undefined') {
    format = inclusion;
    inclusion = false;
  }
  value = parseDate$1(value, format);
  otherValue = parseDate$1(otherValue, format);

  // if either is not valid.
  if (!value || !otherValue) {
    return false;
  }

  return isAfter(value, otherValue) || (inclusion && isEqual$1(value, otherValue));
};

/**
 * Some Alpha Regex helpers.
 * https://github.com/chriso/validator.js/blob/master/src/lib/alpha.js
 */

var alpha$1 = {
  en: /^[A-Z]*$/i,
  cs: /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]*$/i,
  da: /^[A-ZÆØÅ]*$/i,
  de: /^[A-ZÄÖÜß]*$/i,
  es: /^[A-ZÁÉÍÑÓÚÜ]*$/i,
  fr: /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]*$/i,
  lt: /^[A-ZĄČĘĖĮŠŲŪŽ]*$/i,
  nl: /^[A-ZÉËÏÓÖÜ]*$/i,
  hu: /^[A-ZÁÉÍÓÖŐÚÜŰ]*$/i,
  pl: /^[A-ZĄĆĘŚŁŃÓŻŹ]*$/i,
  pt: /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]*$/i,
  ru: /^[А-ЯЁ]*$/i,
  sk: /^[A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ]*$/i,
  sr: /^[A-ZČĆŽŠĐ]*$/i,
  tr: /^[A-ZÇĞİıÖŞÜ]*$/i,
  uk: /^[А-ЩЬЮЯЄІЇҐ]*$/i,
  ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]*$/
};

var alphaSpaces = {
  en: /^[A-Z\s]*$/i,
  cs: /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s]*$/i,
  da: /^[A-ZÆØÅ\s]*$/i,
  de: /^[A-ZÄÖÜß\s]*$/i,
  es: /^[A-ZÁÉÍÑÓÚÜ\s]*$/i,
  fr: /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ\s]*$/i,
  lt: /^[A-ZĄČĘĖĮŠŲŪŽ\s]*$/i,
  nl: /^[A-ZÉËÏÓÖÜ\s]*$/i,
  hu: /^[A-ZÁÉÍÓÖŐÚÜŰ\s]*$/i,
  pl: /^[A-ZĄĆĘŚŁŃÓŻŹ\s]*$/i,
  pt: /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ\s]*$/i,
  ru: /^[А-ЯЁ\s]*$/i,
  sk: /^[A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ\s]*$/i,
  sr: /^[A-ZČĆŽŠĐ\s]*$/i,
  tr: /^[A-ZÇĞİıÖŞÜ\s]*$/i,
  uk: /^[А-ЩЬЮЯЄІЇҐ\s]*$/i,
  ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ\s]*$/
};

var alphanumeric = {
  en: /^[0-9A-Z]*$/i,
  cs: /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]*$/i,
  da: /^[0-9A-ZÆØÅ]$/i,
  de: /^[0-9A-ZÄÖÜß]*$/i,
  es: /^[0-9A-ZÁÉÍÑÓÚÜ]*$/i,
  fr: /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]*$/i,
  lt: /^[0-9A-ZĄČĘĖĮŠŲŪŽ]*$/i,
  hu: /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]*$/i,
  nl: /^[0-9A-ZÉËÏÓÖÜ]*$/i,
  pl: /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]*$/i,
  pt: /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]*$/i,
  ru: /^[0-9А-ЯЁ]*$/i,
  sk: /^[0-9A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ]*$/i,
  sr: /^[0-9A-ZČĆŽŠĐ]*$/i,
  tr: /^[0-9A-ZÇĞİıÖŞÜ]*$/i,
  uk: /^[0-9А-ЩЬЮЯЄІЇҐ]*$/i,
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]*$/
};

var alphaDash = {
  en: /^[0-9A-Z_-]*$/i,
  cs: /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ_-]*$/i,
  da: /^[0-9A-ZÆØÅ_-]*$/i,
  de: /^[0-9A-ZÄÖÜß_-]*$/i,
  es: /^[0-9A-ZÁÉÍÑÓÚÜ_-]*$/i,
  fr: /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ_-]*$/i,
  lt: /^[0-9A-ZĄČĘĖĮŠŲŪŽ_-]*$/i,
  nl: /^[0-9A-ZÉËÏÓÖÜ_-]*$/i,
  hu: /^[0-9A-ZÁÉÍÓÖŐÚÜŰ_-]*$/i,
  pl: /^[0-9A-ZĄĆĘŚŁŃÓŻŹ_-]*$/i,
  pt: /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ_-]*$/i,
  ru: /^[0-9А-ЯЁ_-]*$/i,
  sk: /^[0-9A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ_-]*$/i,
  sr: /^[0-9A-ZČĆŽŠĐ_-]*$/i,
  tr: /^[0-9A-ZÇĞİıÖŞÜ_-]*$/i,
  uk: /^[0-9А-ЩЬЮЯЄІЇҐ_-]*$/i,
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ_-]*$/
};

var validate = function (value, ref) {
  if ( ref === void 0 ) ref = [];
  var locale = ref[0]; if ( locale === void 0 ) locale = null;

  if (Array.isArray(value)) {
    return value.every(function (val) { return validate(val, [locale]); });
  }

  // Match at least one locale.
  if (! locale) {
    return Object.keys(alpha$1).some(function (loc) { return alpha$1[loc].test(value); });
  }

  return (alpha$1[locale] || alpha$1.en).test(value);
};

var validate$1 = function (value, ref) {
  if ( ref === void 0 ) ref = [];
  var locale = ref[0]; if ( locale === void 0 ) locale = null;

  if (Array.isArray(value)) {
    return value.every(function (val) { return validate$1(val, [locale]); });
  }

  // Match at least one locale.
  if (! locale) {
    return Object.keys(alphaDash).some(function (loc) { return alphaDash[loc].test(value); });
  }

  return (alphaDash[locale] || alphaDash.en).test(value);
};

var validate$2 = function (value, ref) {
  if ( ref === void 0 ) ref = [];
  var locale = ref[0]; if ( locale === void 0 ) locale = null;

  if (Array.isArray(value)) {
    return value.every(function (val) { return validate$2(val, [locale]); });
  }

  // Match at least one locale.
  if (! locale) {
    return Object.keys(alphanumeric).some(function (loc) { return alphanumeric[loc].test(value); });
  }

  return (alphanumeric[locale] || alphanumeric.en).test(value);
};

var validate$3 = function (value, ref) {
  if ( ref === void 0 ) ref = [];
  var locale = ref[0]; if ( locale === void 0 ) locale = null;

  if (Array.isArray(value)) {
    return value.every(function (val) { return validate$3(val, [locale]); });
  }

  // Match at least one locale.
  if (! locale) {
    return Object.keys(alphaSpaces).some(function (loc) { return alphaSpaces[loc].test(value); });
  }

  return (alphaSpaces[locale] || alphaSpaces.en).test(value);
};

var before = function (value, ref) {
  var otherValue = ref[0];
  var inclusion = ref[1];
  var format = ref[2];

  if (typeof format === 'undefined') {
    format = inclusion;
    inclusion = false;
  }
  value = parseDate$1(value, format);
  otherValue = parseDate$1(otherValue, format);

  // if either is not valid.
  if (!value || !otherValue) {
    return false;
  }

  return isBefore(value, otherValue) || (inclusion && isEqual$1(value, otherValue));
};

var validate$4 = function (value, ref) {
  var min = ref[0];
  var max = ref[1];

  if (Array.isArray(value)) {
    return value.every(function (val) { return validate$4(val, [min, max]); });
  }

  return Number(min) <= value && Number(max) >= value;
};

var confirmed = function (value, other) { return String(value) === String(other); };

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var assertString_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assertString;
function assertString(input) {
  var isString = typeof input === 'string' || input instanceof String;

  if (!isString) {
    throw new TypeError('This library (validator.js) validates strings only');
  }
}
module.exports = exports['default'];
});

unwrapExports(assertString_1);

var isCreditCard_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isCreditCard;



var _assertString2 = _interopRequireDefault(assertString_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|62[0-9]{14})$/;
/* eslint-enable max-len */

function isCreditCard(str) {
  (0, _assertString2.default)(str);
  var sanitized = str.replace(/[- ]+/g, '');
  if (!creditCard.test(sanitized)) {
    return false;
  }
  var sum = 0;
  var digit = void 0;
  var tmpNum = void 0;
  var shouldDouble = void 0;
  for (var i = sanitized.length - 1; i >= 0; i--) {
    digit = sanitized.substring(i, i + 1);
    tmpNum = parseInt(digit, 10);
    if (shouldDouble) {
      tmpNum *= 2;
      if (tmpNum >= 10) {
        sum += tmpNum % 10 + 1;
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }
    shouldDouble = !shouldDouble;
  }
  return !!(sum % 10 === 0 ? sanitized : false);
}
module.exports = exports['default'];
});

var isCreditCard = unwrapExports(isCreditCard_1);

var credit_card = function (value) { return isCreditCard(String(value)); };

var validate$5 = function (value, ref) {
  if ( ref === void 0 ) ref = [];
  var decimals = ref[0]; if ( decimals === void 0 ) decimals = '*';
  var separator = ref[1]; if ( separator === void 0 ) separator = '.';

  if (Array.isArray(value)) {
    return value.every(function (val) { return validate$5(val, [decimals, separator]); });
  }

  if (value === null || value === undefined || value === '') {
    return true;
  }

  // if is 0.
  if (Number(decimals) === 0) {
    return /^-?\d*$/.test(value);
  }

  var regexPart = decimals === '*' ? '+' : ("{1," + decimals + "}");
  var regex = new RegExp(("^-?\\d*(\\" + separator + "\\d" + regexPart + ")?$"));

  if (! regex.test(value)) {
    return false;
  }

  var parsedValue = parseFloat(value);

  // eslint-disable-next-line
    return parsedValue === parsedValue;
};

var date_between = function (value, params) {
  var min;
  var max;
  var format;
  var inclusivity = '()';

  if (params.length > 3) {
    var assign;
    (assign = params, min = assign[0], max = assign[1], inclusivity = assign[2], format = assign[3]);
  } else {
    var assign$1;
    (assign$1 = params, min = assign$1[0], max = assign$1[1], format = assign$1[2]);
  }

  var minDate = parseDate$1(min, format);
  var maxDate = parseDate$1(max, format);
  var dateVal = parseDate$1(value, format);

  if (!minDate || !maxDate || !dateVal) {
    return false;
  }

  if (inclusivity === '()') {
    return isAfter(dateVal, minDate) && isBefore(dateVal, maxDate);
  }

  if (inclusivity === '(]') {
    return isAfter(dateVal, minDate) && (isEqual$1(dateVal, maxDate) || isBefore(dateVal, maxDate));
  }

  if (inclusivity === '[)') {
    return isBefore(dateVal, maxDate) && (isEqual$1(dateVal, minDate) || isAfter(dateVal, minDate));
  }

  return isEqual$1(dateVal, maxDate) || isEqual$1(dateVal, minDate) ||
        (isBefore(dateVal, maxDate) && isAfter(dateVal, minDate));
};

var date_format = function (value, ref) {
  var format = ref[0];

  return !!parseDate$1(value, format);
};

var validate$6 = function (value, ref) {
  var length = ref[0];

  if (Array.isArray(value)) {
    return value.every(function (val) { return validate$6(val, [length]); });
  }
  var strVal = String(value);

  return /^[0-9]*$/.test(strVal) && strVal.length === Number(length);
};

var validateImage = function (file, width, height) {
  var URL = window.URL || window.webkitURL;
  return new Promise(function (resolve) {
    var image = new Image();
    image.onerror = function () { return resolve({ valid: false }); };
    image.onload = function () { return resolve({
      valid: image.width === Number(width) && image.height === Number(height)
    }); };

    image.src = URL.createObjectURL(file);
  });
};

var dimensions = function (files, ref) {
  var width = ref[0];
  var height = ref[1];

  var list = [];
  for (var i = 0; i < files.length; i++) {
    // if file is not an image, reject.
    if (! /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
      return false;
    }

    list.push(files[i]);
  }

  return Promise.all(list.map(function (file) { return validateImage(file, width, height); }));
};

var merge_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = merge;
function merge() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaults = arguments[1];

  for (var key in defaults) {
    if (typeof obj[key] === 'undefined') {
      obj[key] = defaults[key];
    }
  }
  return obj;
}
module.exports = exports['default'];
});

unwrapExports(merge_1);

var isByteLength_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = isByteLength;



var _assertString2 = _interopRequireDefault(assertString_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable prefer-rest-params */
function isByteLength(str, options) {
  (0, _assertString2.default)(str);
  var min = void 0;
  var max = void 0;
  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else {
    // backwards compatibility: isByteLength(str, min [, max])
    min = arguments[1];
    max = arguments[2];
  }
  var len = encodeURI(str).split(/%..|./).length - 1;
  return len >= min && (typeof max === 'undefined' || len <= max);
}
module.exports = exports['default'];
});

unwrapExports(isByteLength_1);

var isFQDN = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFDQN;



var _assertString2 = _interopRequireDefault(assertString_1);



var _merge2 = _interopRequireDefault(merge_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_fqdn_options = {
  require_tld: true,
  allow_underscores: false,
  allow_trailing_dot: false
};

function isFDQN(str, options) {
  (0, _assertString2.default)(str);
  options = (0, _merge2.default)(options, default_fqdn_options);

  /* Remove the optional trailing dot before checking validity */
  if (options.allow_trailing_dot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1);
  }
  var parts = str.split('.');
  if (options.require_tld) {
    var tld = parts.pop();
    if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
      return false;
    }
    // disallow spaces
    if (/[\s\u2002-\u200B\u202F\u205F\u3000\uFEFF\uDB40\uDC20]/.test(tld)) {
      return false;
    }
  }
  for (var part, i = 0; i < parts.length; i++) {
    part = parts[i];
    if (options.allow_underscores) {
      part = part.replace(/_/g, '');
    }
    if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    }
    // disallow full-width chars
    if (/[\uff01-\uff5e]/.test(part)) {
      return false;
    }
    if (part[0] === '-' || part[part.length - 1] === '-') {
      return false;
    }
  }
  return true;
}
module.exports = exports['default'];
});

unwrapExports(isFQDN);

var isEmail_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEmail;



var _assertString2 = _interopRequireDefault(assertString_1);



var _merge2 = _interopRequireDefault(merge_1);



var _isByteLength2 = _interopRequireDefault(isByteLength_1);



var _isFQDN2 = _interopRequireDefault(isFQDN);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_email_options = {
  allow_display_name: false,
  require_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true
};

/* eslint-disable max-len */
/* eslint-disable no-control-regex */
var displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\,\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
/* eslint-enable max-len */
/* eslint-enable no-control-regex */

function isEmail(str, options) {
  (0, _assertString2.default)(str);
  options = (0, _merge2.default)(options, default_email_options);

  if (options.require_display_name || options.allow_display_name) {
    var display_email = str.match(displayName);
    if (display_email) {
      str = display_email[1];
    } else if (options.require_display_name) {
      return false;
    }
  }

  var parts = str.split('@');
  var domain = parts.pop();
  var user = parts.join('@');

  var lower_domain = domain.toLowerCase();
  if (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com') {
    user = user.replace(/\./g, '').toLowerCase();
  }

  if (!(0, _isByteLength2.default)(user, { max: 64 }) || !(0, _isByteLength2.default)(domain, { max: 254 })) {
    return false;
  }

  if (!(0, _isFQDN2.default)(domain, { require_tld: options.require_tld })) {
    return false;
  }

  if (user[0] === '"') {
    user = user.slice(1, user.length - 1);
    return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
  }

  var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;

  var user_parts = user.split('.');
  for (var i = 0; i < user_parts.length; i++) {
    if (!pattern.test(user_parts[i])) {
      return false;
    }
  }

  return true;
}
module.exports = exports['default'];
});

var isEmail = unwrapExports(isEmail_1);

var validate$7 = function (value) {
  if (Array.isArray(value)) {
    return value.every(function (val) { return isEmail(String(val)); });
  }

  return isEmail(String(value));
};

var ext = function (files, extensions) {
  var regex = new RegExp((".(" + (extensions.join('|')) + ")$"), 'i');

  return files.every(function (file) { return regex.test(file.name); });
};

var image = function (files) { return files.every(function (file) { return /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(file.name); }
); };

var validate$8 = function (value, options) {
  if (Array.isArray(value)) {
    return value.every(function (val) { return validate$8(val, options); });
  }

  // eslint-disable-next-line
  return !! options.filter(function (option) { return option == value; }).length;
};

var isIP_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIP;



var _assertString2 = _interopRequireDefault(assertString_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
var ipv6Block = /^[0-9A-F]{1,4}$/i;

function isIP(str) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  (0, _assertString2.default)(str);
  version = String(version);
  if (!version) {
    return isIP(str, 4) || isIP(str, 6);
  } else if (version === '4') {
    if (!ipv4Maybe.test(str)) {
      return false;
    }
    var parts = str.split('.').sort(function (a, b) {
      return a - b;
    });
    return parts[3] <= 255;
  } else if (version === '6') {
    var blocks = str.split(':');
    var foundOmissionBlock = false; // marker to indicate ::

    // At least some OS accept the last 32 bits of an IPv6 address
    // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
    // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
    // and '::a.b.c.d' is deprecated, but also valid.
    var foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4);
    var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

    if (blocks.length > expectedNumberOfBlocks) {
      return false;
    }
    // initial or final ::
    if (str === '::') {
      return true;
    } else if (str.substr(0, 2) === '::') {
      blocks.shift();
      blocks.shift();
      foundOmissionBlock = true;
    } else if (str.substr(str.length - 2) === '::') {
      blocks.pop();
      blocks.pop();
      foundOmissionBlock = true;
    }

    for (var i = 0; i < blocks.length; ++i) {
      // test for a :: which can not be at the string start/end
      // since those cases have been handled above
      if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
        if (foundOmissionBlock) {
          return false; // multiple :: in address
        }
        foundOmissionBlock = true;
      } else if (foundIPv4TransitionBlock && i === blocks.length - 1) {
        // it has been checked before that the last
        // block is a valid IPv4 address
      } else if (!ipv6Block.test(blocks[i])) {
        return false;
      }
    }
    if (foundOmissionBlock) {
      return blocks.length >= 1;
    }
    return blocks.length === expectedNumberOfBlocks;
  }
  return false;
}
module.exports = exports['default'];
});

var isIP = unwrapExports(isIP_1);

var ip = function (value, ref) {
  if ( ref === void 0 ) ref = [];
  var version = ref[0]; if ( version === void 0 ) version = 4;

  if (isNullOrUndefined(value)) {
    value = '';
  }

  if (Array.isArray(value)) {
    return value.every(function (val) { return isIP(val, version); });
  }

  return isIP(value, version);
};

var is = function (value, ref) {
  if ( ref === void 0 ) ref = [];
  var other = ref[0];

  return value === other;
};

var is_not = function (value, ref) {
  if ( ref === void 0 ) ref = [];
  var other = ref[0];

  return value !== other;
};

/**
 * @param {Array|String} value
 * @param {Number} length
 * @param {Number} max
 */
var compare = function (value, length, max) {
  if (max === undefined) {
    return value.length === length;
  }

  // cast to number.
  max = Number(max);

  return value.length >= length && value.length <= max;
};

var length = function (value, ref) {
  var length = ref[0];
  var max = ref[1]; if ( max === void 0 ) max = undefined;

  length = Number(length);
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'number') {
    value = String(value);
  }

  if (!value.length) {
    value = toArray(value);
  }

  return compare(value, length, max);
};

var integer = function (value) {
  if (Array.isArray(value)) {
    return value.every(function (val) { return /^-?[0-9]+$/.test(String(val)); });
  }

  return /^-?[0-9]+$/.test(String(value));
};

var max$1 = function (value, ref) {
  var length = ref[0];

  if (value === undefined || value === null) {
    return length >= 0;
  }

  return String(value).length <= length;
};

var max_value = function (value, ref) {
  var max = ref[0];

  if (Array.isArray(value) || value === null || value === undefined || value === '') {
    return false;
  }

  return Number(value) <= max;
};

var mimes = function (files, mimes) {
  var regex = new RegExp(((mimes.join('|').replace('*', '.+')) + "$"), 'i');

  return files.every(function (file) { return regex.test(file.type); });
};

var min$1 = function (value, ref) {
  var length = ref[0];

  if (value === undefined || value === null) {
    return false;
  }
  return String(value).length >= length;
};

var min_value = function (value, ref) {
  var min = ref[0];

  if (Array.isArray(value) || value === null || value === undefined || value === '') {
    return false;
  }

  return Number(value) >= min;
};

var validate$9 = function (value, options) {
  if (Array.isArray(value)) {
    return value.every(function (val) { return validate$9(val, options); });
  }

  // eslint-disable-next-line
  return ! options.filter(function (option) { return option == value; }).length;
};

var numeric = function (value) {
  if (Array.isArray(value)) {
    return value.every(function (val) { return /^[0-9]+$/.test(String(val)); });
  }

  return /^[0-9]+$/.test(String(value));
};

var regex = function (value, ref) {
  var regex = ref[0];
  var flags = ref.slice(1);

  if (regex instanceof RegExp) {
    return regex.test(value);
  }

  return new RegExp(regex, flags).test(String(value));
};

var required = function (value, ref) {
  if ( ref === void 0 ) ref = [];
  var invalidateFalse = ref[0]; if ( invalidateFalse === void 0 ) invalidateFalse = false;

  if (Array.isArray(value)) {
    return !! value.length;
  }

  // incase a field considers `false` as an empty value like checkboxes.
  if (value === false && invalidateFalse) {
    return false;
  }

  if (value === undefined || value === null) {
    return false;
  }

  return !! String(value).trim().length;
};

var size = function (files, ref) {
  var size = ref[0];

  if (isNaN(size)) {
    return false;
  }

  var nSize = Number(size) * 1024;
  for (var i = 0; i < files.length; i++) {
    if (files[i].size > nSize) {
      return false;
    }
  }

  return true;
};

var isURL_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isURL;



var _assertString2 = _interopRequireDefault(assertString_1);



var _isFQDN2 = _interopRequireDefault(isFQDN);



var _isIP2 = _interopRequireDefault(isIP_1);



var _merge2 = _interopRequireDefault(merge_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_url_options = {
  protocols: ['http', 'https', 'ftp'],
  require_tld: true,
  require_protocol: false,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false
};

var wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;

function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
}

function checkHost(host, matches) {
  for (var i = 0; i < matches.length; i++) {
    var match = matches[i];
    if (host === match || isRegExp(match) && match.test(host)) {
      return true;
    }
  }
  return false;
}

function isURL(url, options) {
  (0, _assertString2.default)(url);
  if (!url || url.length >= 2083 || /[\s<>]/.test(url)) {
    return false;
  }
  if (url.indexOf('mailto:') === 0) {
    return false;
  }
  options = (0, _merge2.default)(options, default_url_options);
  var protocol = void 0,
      auth = void 0,
      host = void 0,
      hostname = void 0,
      port = void 0,
      port_str = void 0,
      split = void 0,
      ipv6 = void 0;

  split = url.split('#');
  url = split.shift();

  split = url.split('?');
  url = split.shift();

  split = url.split('://');
  if (split.length > 1) {
    protocol = split.shift();
    if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
      return false;
    }
  } else if (options.require_protocol) {
    return false;
  } else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
    split[0] = url.substr(2);
  }
  url = split.join('://');

  if (url === '') {
    return false;
  }

  split = url.split('/');
  url = split.shift();

  if (url === '' && !options.require_host) {
    return true;
  }

  split = url.split('@');
  if (split.length > 1) {
    auth = split.shift();
    if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
      return false;
    }
  }
  hostname = split.join('@');

  port_str = null;
  ipv6 = null;
  var ipv6_match = hostname.match(wrapped_ipv6);
  if (ipv6_match) {
    host = '';
    ipv6 = ipv6_match[1];
    port_str = ipv6_match[2] || null;
  } else {
    split = hostname.split(':');
    host = split.shift();
    if (split.length) {
      port_str = split.join(':');
    }
  }

  if (port_str !== null) {
    port = parseInt(port_str, 10);
    if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
      return false;
    }
  }

  if (!(0, _isIP2.default)(host) && !(0, _isFQDN2.default)(host, options) && (!ipv6 || !(0, _isIP2.default)(ipv6, 6))) {
    return false;
  }

  host = host || ipv6;

  if (options.host_whitelist && !checkHost(host, options.host_whitelist)) {
    return false;
  }
  if (options.host_blacklist && checkHost(host, options.host_blacklist)) {
    return false;
  }

  return true;
}
module.exports = exports['default'];
});

var isURL = unwrapExports(isURL_1);

var url = function (value, ref) {
  if ( ref === void 0 ) ref = [];
  var requireProtocol = ref[0]; if ( requireProtocol === void 0 ) requireProtocol = false;

  var options = { require_protocol: !!requireProtocol, allow_underscores: true };
  if (isNullOrUndefined(value)) {
    value = '';
  }

  if (Array.isArray(value)) {
    return value.every(function (val) { return isURL(val, options); });
  }

  return isURL(value, options);
};

/* eslint-disable camelcase */
var Rules = {
  after: after,
  alpha_dash: validate$1,
  alpha_num: validate$2,
  alpha_spaces: validate$3,
  alpha: validate,
  before: before,
  between: validate$4,
  confirmed: confirmed,
  credit_card: credit_card,
  date_between: date_between,
  date_format: date_format,
  decimal: validate$5,
  digits: validate$6,
  dimensions: dimensions,
  email: validate$7,
  ext: ext,
  image: image,
  in: validate$8,
  integer: integer,
  length: length,
  ip: ip,
  is_not: is_not,
  is: is,
  max: max$1,
  max_value: max_value,
  mimes: mimes,
  min: min$1,
  min_value: min_value,
  not_in: validate$9,
  numeric: numeric,
  regex: regex,
  required: required,
  size: size,
  url: url
};

// 

var normalize = function (fields) {
  if (Array.isArray(fields)) {
    return fields.reduce(function (prev, curr) {
      if (~curr.indexOf('.')) {
        prev[curr.split('.')[1]] = curr;
      } else {
        prev[curr] = curr;
      }

      return prev;
    }, {});
  }

  return fields;
};

// Combines two flags using either AND or OR depending on the flag type.
var combine = function (lhs, rhs) {
  var mapper = {
    pristine: function (lhs, rhs) { return lhs && rhs; },
    dirty: function (lhs, rhs) { return lhs || rhs; },
    touched: function (lhs, rhs) { return lhs || rhs; },
    untouched: function (lhs, rhs) { return lhs && rhs; },
    valid: function (lhs, rhs) { return lhs && rhs; },
    invalid: function (lhs, rhs) { return lhs || rhs; },
    pending: function (lhs, rhs) { return lhs || rhs; },
    required: function (lhs, rhs) { return lhs || rhs; },
    validated: function (lhs, rhs) { return lhs && rhs; }
  };

  return Object.keys(mapper).reduce(function (flags, flag) {
    flags[flag] = mapper[flag](lhs[flag], rhs[flag]);

    return flags;
  }, {});
};

var mapScope = function (scope, deep) {
  if ( deep === void 0 ) deep = true;

  return Object.keys(scope).reduce(function (flags, field) {
    if (!flags) {
      flags = assign({}, scope[field]);
      return flags;
    }

    // scope.
    var isScope = field.indexOf('$') === 0;
    if (deep && isScope) {
      return combine(mapScope(scope[field]), flags);
    } else if (!deep && isScope) {
      return flags;
    }

    flags = combine(flags, scope[field]);

    return flags;
  }, null);
};

/**
 * Maps fields to computed functions.
 */
var mapFields = function (fields) {
  if (!fields) {
    return function () {
      return mapScope(this.$validator.flags);
    };
  }

  var normalized = normalize(fields);
  return Object.keys(normalized).reduce(function (prev, curr) {
    var field = normalized[curr];
    prev[curr] = function mappedField () {
      // if field exists
      if (this.$validator.flags[field]) {
        return this.$validator.flags[field];
      }

      // scopeless fields were selected.
      if (normalized[curr] === '*') {
        return mapScope(this.$validator.flags, false);
      }

      // if it has a scope defined
      var index = field.indexOf('.');
      if (index <= 0) {
        return {};
      }

      var ref = field.split('.');
      var scope = ref[0];
      var name = ref.slice(1);

      scope = this.$validator.flags[("$" + scope)];
      name = name.join('.');

      // an entire scope was selected: scope.*
      if (name === '*' && scope) {
        return mapScope(scope);
      }

      if (scope && scope[name]) {
        return scope[name];
      }

      return {};
    };

    return prev;
  }, {});
};

var version = '2.0.0';

var rulesPlugin = function (ref) {
  var Validator$$1 = ref.Validator;

  Object.keys(Rules).forEach(function (rule) {
    Validator$$1.extend(rule, Rules[rule]);
  });

  // Merge the english messages.
  Validator$$1.localize('en', locale);
};

use(rulesPlugin);

var index_esm = {
  install: install,
  use: use,
  directive: directive,
  mixin: mixin,
  mapFields: mapFields,
  Validator: Validator,
  ErrorBag: ErrorBag,
  Rules: Rules,
  version: version
};


/* harmony default export */ __webpack_exports__["a"] = (index_esm);


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(3)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(32)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "ClientApp\\components\\home\\home.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-216b3d2c", Component.options)
  } else {
    hotAPI.reload("data-v-216b3d2c", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0, false, false)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", [
      _c("h1", [_vm._v("Contact Us")]),
      _vm._v(" "),
      _c("p", [_vm._v("A single-page application, built with:")]),
      _vm._v(" "),
      _c("ul", [
        _c("li", [
          _c("a", { attrs: { href: "https://get.asp.net/" } }, [
            _vm._v("ASP.NET Core")
          ]),
          _vm._v(" and "),
          _c(
            "a",
            {
              attrs: {
                href: "https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx"
              }
            },
            [_vm._v("C#")]
          ),
          _vm._v(" for cross-platform server-side code")
        ]),
        _vm._v(" "),
        _c("li", [
          _c("a", { attrs: { href: "https://vuejs.org/" } }, [
            _vm._v("Vue.js")
          ]),
          _vm._v(" and "),
          _c("a", { attrs: { href: "http://www.typescriptlang.org/" } }, [
            _vm._v("TypeScript")
          ]),
          _vm._v(" for client-side code")
        ]),
        _vm._v(" "),
        _c("li", [
          _c("a", { attrs: { href: "https://webpack.github.io/" } }, [
            _vm._v("Webpack")
          ]),
          _vm._v(" for building and bundling client-side resources")
        ]),
        _vm._v(" "),
        _c("li", [
          _c("a", { attrs: { href: "http://getbootstrap.com/" } }, [
            _vm._v("Bootstrap")
          ]),
          _vm._v(" for layout and styling")
        ])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (true) {
  module.hot.accept()
  if (module.hot.data) {
    __webpack_require__(1)      .rerender("data-v-216b3d2c", module.exports)
  }
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(3)
/* script */
var __vue_script__ = __webpack_require__(34)
/* template */
var __vue_template__ = __webpack_require__(39)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "ClientApp\\components\\contactus\\contactus.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6343a564", Component.options)
  } else {
    hotAPI.reload("data-v-6343a564", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var ContactUsComponent = /** @class */ (function (_super) {
    __extends(ContactUsComponent, _super);
    function ContactUsComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = '';
        _this.firstName = '';
        _this.lastName = '';
        _this.email = '';
        _this.message = '';
        _this.showSuccessMessage = false;
        _this.titles = ['Mr', 'Mrs', 'Miss', 'Ms', 'Master'];
        return _this;
    }
    ContactUsComponent.prototype.validateAndSubmit = function () {
        var _this = this;
        this.$validator.validateAll().then(function (result) {
            if (result) {
                _this.submit();
                return;
            }
            alert('Please correct errors before submitting');
        });
    };
    ContactUsComponent.prototype.submit = function () {
        var _this = this;
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        fetch('api/Contact/Create', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                title: this.title,
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                message: this.message
            })
        })
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.showSuccessMessage = true;
            setTimeout(function () { return _this.showSuccessMessage = false; }, 5000);
        });
    };
    ContactUsComponent = __decorate([
        __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__["Component"]
    ], ContactUsComponent);
    return ContactUsComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (ContactUsComponent);


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
  * vue-class-component v6.1.0
  * (c) 2015-2017 Evan You
  * @license MIT
  */


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(__webpack_require__(0));

function createDecorator(factory) {
    return function (target, key, index) {
        var Ctor = typeof target === 'function'
            ? target
            : target.constructor;
        if (!Ctor.__decorators__) {
            Ctor.__decorators__ = [];
        }
        if (typeof index !== 'number') {
            index = undefined;
        }
        Ctor.__decorators__.push(function (options) { return factory(options, key, index); });
    };
}
function warn(message) {
    if (typeof console !== 'undefined') {
        console.warn('[vue-class-component] ' + message);
    }
}

function collectDataFromConstructor(vm, Component) {
    Component.prototype._init = function () {
        var _this = this;
        var keys = Object.getOwnPropertyNames(vm);
        if (vm.$options.props) {
            for (var key in vm.$options.props) {
                if (!vm.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
        }
        keys.forEach(function (key) {
            if (key.charAt(0) !== '_') {
                Object.defineProperty(_this, key, {
                    get: function () { return vm[key]; },
                    set: function (value) { return vm[key] = value; },
                    configurable: true
                });
            }
        });
    };
    var data = new Component();
    var plainData = {};
    Object.keys(data).forEach(function (key) {
        if (data[key] !== undefined) {
            plainData[key] = data[key];
        }
    });
    if (true) {
        if (!(Component.prototype instanceof Vue) && Object.keys(plainData).length > 0) {
            warn('Component class must inherit Vue or its descendant class ' +
                'when class property is used.');
        }
    }
    return plainData;
}

var $internalHooks = [
    'data',
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeDestroy',
    'destroyed',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'render',
    'errorCaptured'
];
function componentFactory(Component, options) {
    if (options === void 0) { options = {}; }
    options.name = options.name || Component._componentTag || Component.name;
    var proto = Component.prototype;
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === 'constructor') {
            return;
        }
        if ($internalHooks.indexOf(key) > -1) {
            options[key] = proto[key];
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (typeof descriptor.value === 'function') {
            (options.methods || (options.methods = {}))[key] = descriptor.value;
        }
        else if (descriptor.get || descriptor.set) {
            (options.computed || (options.computed = {}))[key] = {
                get: descriptor.get,
                set: descriptor.set
            };
        }
    });
    (options.mixins || (options.mixins = [])).push({
        data: function () {
            return collectDataFromConstructor(this, Component);
        }
    });
    var decorators = Component.__decorators__;
    if (decorators) {
        decorators.forEach(function (fn) { return fn(options); });
    }
    var superProto = Object.getPrototypeOf(Component.prototype);
    var Super = superProto instanceof Vue
        ? superProto.constructor
        : Vue;
    var Extended = Super.extend(options);
    for (var staticKey in Component) {
        if (Component.hasOwnProperty(staticKey)) {
            Extended[staticKey] = Component[staticKey];
        }
    }
    return Extended;
}

function Component(options) {
    if (typeof options === 'function') {
        return componentFactory(options);
    }
    return function (Component) {
        return componentFactory(Component, options);
    };
}
(function (Component) {
    function registerHooks(keys) {
        $internalHooks.push.apply($internalHooks, keys);
    }
    Component.registerHooks = registerHooks;
})(Component || (Component = {}));
var Component$1 = Component;

exports['default'] = Component$1;
exports.createDecorator = createDecorator;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    // feature test for Symbol support
    var supportsSymbol = typeof Symbol === "function";
    var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
    var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
    var HashMap;
    (function (HashMap) {
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        HashMap.create = supportsCreate
            ? function () { return MakeDictionary(Object.create(null)); }
            : supportsProto
                ? function () { return MakeDictionary({ __proto__: null }); }
                : function () { return MakeDictionary({}); };
        HashMap.has = downLevel
            ? function (map, key) { return hasOwn.call(map, key); }
            : function (map, key) { return key in map; };
        HashMap.get = downLevel
            ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
            : function (map, key) { return map[key]; };
    })(HashMap || (HashMap = {}));
    // Load global or shim versions of Map, Set, and WeakMap
    var functionPrototype = Object.getPrototypeOf(Function);
    var usePolyfill = typeof process === "object" && Object({"NODE_ENV":"development"}) && Object({"NODE_ENV":"development"})["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
    var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
    var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
    var Metadata = new _WeakMap();
    /**
      * Applies a set of decorators to a property of a target object.
      * @param decorators An array of decorators.
      * @param target The target object.
      * @param propertyKey (Optional) The property key to decorate.
      * @param attributes (Optional) The property descriptor for the target key.
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Example = Reflect.decorate(decoratorsArray, Example);
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(Example, "staticMethod",
      *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
      *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(Example.prototype, "method",
      *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
      *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
      *
      */
    function decorate(decorators, target, propertyKey, attributes) {
        if (!IsUndefined(propertyKey)) {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsObject(target))
                throw new TypeError();
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                throw new TypeError();
            if (IsNull(attributes))
                attributes = undefined;
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(decorators, target, propertyKey, attributes);
        }
        else {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsConstructor(target))
                throw new TypeError();
            return DecorateConstructor(decorators, target);
        }
    }
    Reflect.decorate = decorate;
    // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
    /**
      * A default metadata decorator factory that can be used on a class, class member, or parameter.
      * @param metadataKey The key for the metadata entry.
      * @param metadataValue The value for the metadata entry.
      * @returns A decorator function.
      * @remarks
      * If `metadataKey` is already defined for the target and target key, the
      * metadataValue for that key will be overwritten.
      * @example
      *
      *     // constructor
      *     @Reflect.metadata(key, value)
      *     class Example {
      *     }
      *
      *     // property (on constructor, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticProperty;
      *     }
      *
      *     // property (on prototype, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         property;
      *     }
      *
      *     // method (on constructor)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticMethod() { }
      *     }
      *
      *     // method (on prototype)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         method() { }
      *     }
      *
      */
    function metadata(metadataKey, metadataValue) {
        function decorator(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                throw new TypeError();
            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
    }
    Reflect.metadata = metadata;
    /**
      * Define a unique metadata entry on the target.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param metadataValue A value that contains attached metadata.
      * @param target The target object on which to define metadata.
      * @param propertyKey (Optional) The property key for the target.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Reflect.defineMetadata("custom:annotation", options, Example);
      *
      *     // property (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
      *
      *     // method (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): Decorator {
      *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
      *     }
      *
      */
    function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }
    Reflect.defineMetadata = defineMetadata;
    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasMetadata = hasMetadata;
    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getMetadata = getMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;
    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "method");
      *
      */
    function getMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryMetadataKeys(target, propertyKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;
    /**
      * Gets the unique metadata keys defined on the target object.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
      *
      */
    function getOwnMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryOwnMetadataKeys(target, propertyKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;
    /**
      * Deletes the metadata entry from the target object with the provided key.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.deleteMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function deleteMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        if (!metadataMap.delete(metadataKey))
            return false;
        if (metadataMap.size > 0)
            return true;
        var targetMetadata = Metadata.get(target);
        targetMetadata.delete(propertyKey);
        if (targetMetadata.size > 0)
            return true;
        Metadata.delete(target);
        return true;
    }
    Reflect.deleteMetadata = deleteMetadata;
    function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated))
                    throw new TypeError();
                target = decorated;
            }
        }
        return target;
    }
    function DecorateProperty(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated))
                    throw new TypeError();
                descriptor = decorated;
            }
        }
        return descriptor;
    }
    function GetOrCreateMetadataMap(O, P, Create) {
        var targetMetadata = Metadata.get(O);
        if (IsUndefined(targetMetadata)) {
            if (!Create)
                return undefined;
            targetMetadata = new _Map();
            Metadata.set(O, targetMetadata);
        }
        var metadataMap = targetMetadata.get(P);
        if (IsUndefined(metadataMap)) {
            if (!Create)
                return undefined;
            metadataMap = new _Map();
            targetMetadata.set(P, metadataMap);
        }
        return metadataMap;
    }
    // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
    function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return true;
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryHasMetadata(MetadataKey, parent, P);
        return false;
    }
    // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        return ToBoolean(metadataMap.has(MetadataKey));
    }
    // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
    function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryGetMetadata(MetadataKey, parent, P);
        return undefined;
    }
    // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return undefined;
        return metadataMap.get(MetadataKey);
    }
    // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
        metadataMap.set(MetadataKey, MetadataValue);
    }
    // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
    function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (parent === null)
            return ownKeys;
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0)
            return ownKeys;
        if (ownKeys.length <= 0)
            return parentKeys;
        var set = new _Set();
        var keys = [];
        for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
            var key = ownKeys_1[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
            var key = parentKeys_1[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }
    // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
    function OrdinaryOwnMetadataKeys(O, P) {
        var keys = [];
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return keys;
        var keysObj = metadataMap.keys();
        var iterator = GetIterator(keysObj);
        var k = 0;
        while (true) {
            var next = IteratorStep(iterator);
            if (!next) {
                keys.length = k;
                return keys;
            }
            var nextValue = IteratorValue(next);
            try {
                keys[k] = nextValue;
            }
            catch (e) {
                try {
                    IteratorClose(iterator);
                }
                finally {
                    throw e;
                }
            }
            k++;
        }
    }
    // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
    function Type(x) {
        if (x === null)
            return 1 /* Null */;
        switch (typeof x) {
            case "undefined": return 0 /* Undefined */;
            case "boolean": return 2 /* Boolean */;
            case "string": return 3 /* String */;
            case "symbol": return 4 /* Symbol */;
            case "number": return 5 /* Number */;
            case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
            default: return 6 /* Object */;
        }
    }
    // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
    function IsUndefined(x) {
        return x === undefined;
    }
    // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
    function IsNull(x) {
        return x === null;
    }
    // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
    function IsSymbol(x) {
        return typeof x === "symbol";
    }
    // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type
    function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
    }
    // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion
    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive
    function ToPrimitive(input, PreferredType) {
        switch (Type(input)) {
            case 0 /* Undefined */: return input;
            case 1 /* Null */: return input;
            case 2 /* Boolean */: return input;
            case 3 /* String */: return input;
            case 4 /* Symbol */: return input;
            case 5 /* Number */: return input;
        }
        var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
        var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== undefined) {
            var result = exoticToPrim.call(input, hint);
            if (IsObject(result))
                throw new TypeError();
            return result;
        }
        return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    }
    // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
    function OrdinaryToPrimitive(O, hint) {
        if (hint === "string") {
            var toString_1 = O.toString;
            if (IsCallable(toString_1)) {
                var result = toString_1.call(O);
                if (!IsObject(result))
                    return result;
            }
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        else {
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
            var toString_2 = O.toString;
            if (IsCallable(toString_2)) {
                var result = toString_2.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        throw new TypeError();
    }
    // 7.1.2 ToBoolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean
    function ToBoolean(argument) {
        return !!argument;
    }
    // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring
    function ToString(argument) {
        return "" + argument;
    }
    // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey
    function ToPropertyKey(argument) {
        var key = ToPrimitive(argument, 3 /* String */);
        if (IsSymbol(key))
            return key;
        return ToString(key);
    }
    // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray
    function IsArray(argument) {
        return Array.isArray
            ? Array.isArray(argument)
            : argument instanceof Object
                ? argument instanceof Array
                : Object.prototype.toString.call(argument) === "[object Array]";
    }
    // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable
    function IsCallable(argument) {
        // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
        return typeof argument === "function";
    }
    // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor
    function IsConstructor(argument) {
        // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
        return typeof argument === "function";
    }
    // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey
    function IsPropertyKey(argument) {
        switch (Type(argument)) {
            case 3 /* String */: return true;
            case 4 /* Symbol */: return true;
            default: return false;
        }
    }
    // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects
    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod
    function GetMethod(V, P) {
        var func = V[P];
        if (func === undefined || func === null)
            return undefined;
        if (!IsCallable(func))
            throw new TypeError();
        return func;
    }
    // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
    function GetIterator(obj) {
        var method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method))
            throw new TypeError(); // from Call
        var iterator = method.call(obj);
        if (!IsObject(iterator))
            throw new TypeError();
        return iterator;
    }
    // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
    function IteratorValue(iterResult) {
        return iterResult.value;
    }
    // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep
    function IteratorStep(iterator) {
        var result = iterator.next();
        return result.done ? false : result;
    }
    // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose
    function IteratorClose(iterator) {
        var f = iterator["return"];
        if (f)
            f.call(iterator);
    }
    // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
    function OrdinaryGetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype)
            return proto;
        // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
        // Try to determine the superclass constructor. Compatible implementations
        // must either set __proto__ on a subclass constructor to the superclass constructor,
        // or ensure each class has a valid `constructor` property on its prototype that
        // points back to the constructor.
        // If this is not the same as Function.[[Prototype]], then this is definately inherited.
        // This is the case when in ES6 or when using __proto__ in a compatible browser.
        if (proto !== functionPrototype)
            return proto;
        // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
        var prototype = O.prototype;
        var prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype)
            return proto;
        // If the constructor was not a function, then we cannot determine the heritage.
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function")
            return proto;
        // If we have some kind of self-reference, then we cannot determine the heritage.
        if (constructor === O)
            return proto;
        // we have a pretty good guess at the heritage.
        return constructor;
    }
    // naive Map shim
    function CreateMapPolyfill() {
        var cacheSentinel = {};
        var arraySentinel = [];
        var MapIterator = (function () {
            function MapIterator(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
            }
            MapIterator.prototype["@@iterator"] = function () { return this; };
            MapIterator.prototype[iteratorSymbol] = function () { return this; };
            MapIterator.prototype.next = function () {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                    var result = this._selector(this._keys[index], this._values[index]);
                    if (index + 1 >= this._keys.length) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    else {
                        this._index++;
                    }
                    return { value: result, done: false };
                }
                return { value: undefined, done: true };
            };
            MapIterator.prototype.throw = function (error) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                throw error;
            };
            MapIterator.prototype.return = function (value) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                return { value: value, done: true };
            };
            return MapIterator;
        }());
        return (function () {
            function Map() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            }
            Object.defineProperty(Map.prototype, "size", {
                get: function () { return this._keys.length; },
                enumerable: true,
                configurable: true
            });
            Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
            Map.prototype.get = function (key) {
                var index = this._find(key, /*insert*/ false);
                return index >= 0 ? this._values[index] : undefined;
            };
            Map.prototype.set = function (key, value) {
                var index = this._find(key, /*insert*/ true);
                this._values[index] = value;
                return this;
            };
            Map.prototype.delete = function (key) {
                var index = this._find(key, /*insert*/ false);
                if (index >= 0) {
                    var size = this._keys.length;
                    for (var i = index + 1; i < size; i++) {
                        this._keys[i - 1] = this._keys[i];
                        this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (key === this._cacheKey) {
                        this._cacheKey = cacheSentinel;
                        this._cacheIndex = -2;
                    }
                    return true;
                }
                return false;
            };
            Map.prototype.clear = function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            };
            Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
            Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
            Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
            Map.prototype["@@iterator"] = function () { return this.entries(); };
            Map.prototype[iteratorSymbol] = function () { return this.entries(); };
            Map.prototype._find = function (key, insert) {
                if (this._cacheKey !== key) {
                    this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                }
                if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(undefined);
                }
                return this._cacheIndex;
            };
            return Map;
        }());
        function getKey(key, _) {
            return key;
        }
        function getValue(_, value) {
            return value;
        }
        function getEntry(key, value) {
            return [key, value];
        }
    }
    // naive Set shim
    function CreateSetPolyfill() {
        return (function () {
            function Set() {
                this._map = new _Map();
            }
            Object.defineProperty(Set.prototype, "size", {
                get: function () { return this._map.size; },
                enumerable: true,
                configurable: true
            });
            Set.prototype.has = function (value) { return this._map.has(value); };
            Set.prototype.add = function (value) { return this._map.set(value, value), this; };
            Set.prototype.delete = function (value) { return this._map.delete(value); };
            Set.prototype.clear = function () { this._map.clear(); };
            Set.prototype.keys = function () { return this._map.keys(); };
            Set.prototype.values = function () { return this._map.values(); };
            Set.prototype.entries = function () { return this._map.entries(); };
            Set.prototype["@@iterator"] = function () { return this.keys(); };
            Set.prototype[iteratorSymbol] = function () { return this.keys(); };
            return Set;
        }());
    }
    // naive WeakMap shim
    function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var keys = HashMap.create();
        var rootKey = CreateUniqueKey();
        return (function () {
            function WeakMap() {
                this._key = CreateUniqueKey();
            }
            WeakMap.prototype.has = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.has(table, this._key) : false;
            };
            WeakMap.prototype.get = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.get(table, this._key) : undefined;
            };
            WeakMap.prototype.set = function (target, value) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                table[this._key] = value;
                return this;
            };
            WeakMap.prototype.delete = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? delete table[this._key] : false;
            };
            WeakMap.prototype.clear = function () {
                // NOTE: not a real clear, just makes the previous data unreachable
                this._key = CreateUniqueKey();
            };
            return WeakMap;
        }());
        function CreateUniqueKey() {
            var key;
            do
                key = "@@WeakMap@@" + CreateUUID();
            while (HashMap.has(keys, key));
            keys[key] = true;
            return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
            if (!hasOwn.call(target, rootKey)) {
                if (!create)
                    return undefined;
                Object.defineProperty(target, rootKey, { value: HashMap.create() });
            }
            return target[rootKey];
        }
        function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i)
                buffer[i] = Math.random() * 0xff | 0;
            return buffer;
        }
        function GenRandomBytes(size) {
            if (typeof Uint8Array === "function") {
                if (typeof crypto !== "undefined")
                    return crypto.getRandomValues(new Uint8Array(size));
                if (typeof msCrypto !== "undefined")
                    return msCrypto.getRandomValues(new Uint8Array(size));
                return FillRandomBytes(new Uint8Array(size), size);
            }
            return FillRandomBytes(new Array(size), size);
        }
        function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            // mark as random - RFC 4122 § 4.4
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8)
                    result += "-";
                if (byte < 16)
                    result += "0";
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
    }
    // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
    function MakeDictionary(obj) {
        obj.__ = undefined;
        delete obj.__;
        return obj;
    }
    // patch global Reflect
    (function (__global) {
        if (typeof __global.Reflect !== "undefined") {
            if (__global.Reflect !== Reflect) {
                for (var p in Reflect) {
                    if (hasOwn.call(Reflect, p)) {
                        __global.Reflect[p] = Reflect[p];
                    }
                }
            }
        }
        else {
            __global.Reflect = Reflect;
        }
    })(typeof global !== "undefined" ? global :
        typeof self !== "undefined" ? self :
            Function("return this;")());
})(Reflect || (Reflect = {}));
//# sourceMappingURL=Reflect.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(37), __webpack_require__(38)))

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(23);

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(2))(1);

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("h1", [_vm._v("Contact Us")]),
    _vm._v(" "),
    _c(
      "form",
      {
        attrs: {
          id: "contact-form",
          method: "post",
          action: "api/contact/create",
          role: "form"
        },
        on: {
          submit: function($event) {
            $event.preventDefault()
            _vm.validateAndSubmit($event)
          }
        }
      },
      [
        _vm.showSuccessMessage
          ? _c(
              "p",
              { staticClass: "alert alert-success", attrs: { role: "alert" } },
              [_vm._v("Your message was submitted successfully")]
            )
          : _vm._e(),
        _vm._v(" "),
        _c("div", { staticClass: "controls" }, [
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "col-md-2" }, [
              _c(
                "div",
                {
                  staticClass: "form-group",
                  class: { "has-error": _vm.errors.has("title") }
                },
                [
                  _c("label", { attrs: { for: "form_name" } }, [
                    _vm._v("Title *")
                  ]),
                  _vm._v(" "),
                  _c(
                    "select",
                    {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.title,
                          expression: "title"
                        },
                        {
                          name: "validate",
                          rawName: "v-validate",
                          value: "required",
                          expression: "'required'"
                        }
                      ],
                      staticClass: "form-control",
                      attrs: { id: "title", name: "title" },
                      on: {
                        change: function($event) {
                          var $$selectedVal = Array.prototype.filter
                            .call($event.target.options, function(o) {
                              return o.selected
                            })
                            .map(function(o) {
                              var val = "_value" in o ? o._value : o.value
                              return val
                            })
                          _vm.title = $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        }
                      }
                    },
                    [
                      _c("option", { attrs: { disabled: "", value: "" } }, [
                        _vm._v("Please select your title *")
                      ]),
                      _vm._v(" "),
                      _vm._l(_vm.titles, function(title) {
                        return _c("option", { domProps: { value: title } }, [
                          _vm._v(_vm._s(title))
                        ])
                      })
                    ],
                    2
                  ),
                  _vm._v(" "),
                  _c(
                    "span",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.errors.has("title"),
                          expression: "errors.has('title')"
                        }
                      ],
                      staticClass: "help text-danger"
                    },
                    [_vm._v(_vm._s(_vm.errors.first("title")))]
                  )
                ]
              )
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "col-md-5" }, [
              _c(
                "div",
                {
                  staticClass: "form-group",
                  class: { "has-error": _vm.errors.has("firstname") }
                },
                [
                  _c("label", { attrs: { for: "form_name" } }, [
                    _vm._v("First name *")
                  ]),
                  _vm._v(" "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.firstName,
                        expression: "firstName"
                      },
                      {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required",
                        expression: "'required'"
                      }
                    ],
                    staticClass: "form-control",
                    attrs: {
                      id: "form_firstname",
                      type: "text",
                      name: "firstname",
                      placeholder: "Please enter your first name *"
                    },
                    domProps: { value: _vm.firstName },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.firstName = $event.target.value
                      }
                    }
                  }),
                  _vm._v(" "),
                  _c(
                    "span",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.errors.has("firstname"),
                          expression: "errors.has('firstname')"
                        }
                      ],
                      staticClass: "help text-danger"
                    },
                    [_vm._v(_vm._s(_vm.errors.first("firstname")))]
                  )
                ]
              )
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "col-md-5" }, [
              _c(
                "div",
                {
                  staticClass: "form-group",
                  class: { "has-error": _vm.errors.has("lastname") }
                },
                [
                  _c("label", { attrs: { for: "form_lastname" } }, [
                    _vm._v("Last name *")
                  ]),
                  _vm._v(" "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.lastName,
                        expression: "lastName"
                      },
                      {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required",
                        expression: "'required'"
                      }
                    ],
                    staticClass: "form-control",
                    attrs: {
                      id: "form_lastname",
                      type: "text",
                      name: "lastname",
                      placeholder: "Please enter your last name *"
                    },
                    domProps: { value: _vm.lastName },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.lastName = $event.target.value
                      }
                    }
                  }),
                  _vm._v(" "),
                  _c(
                    "span",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.errors.has("lastname"),
                          expression: "errors.has('lastname')"
                        }
                      ],
                      staticClass: "help text-danger"
                    },
                    [_vm._v(_vm._s(_vm.errors.first("lastname")))]
                  )
                ]
              )
            ])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "col-md-12" }, [
              _c(
                "div",
                {
                  staticClass: "form-group",
                  class: { "has-error": _vm.errors.has("email") }
                },
                [
                  _c("label", { attrs: { for: "form_email" } }, [
                    _vm._v("Email *")
                  ]),
                  _vm._v(" "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.email,
                        expression: "email"
                      },
                      {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required|email",
                        expression: "'required|email'"
                      }
                    ],
                    staticClass: "form-control",
                    attrs: {
                      id: "form_email",
                      type: "email",
                      name: "email",
                      placeholder: "Please enter your email *"
                    },
                    domProps: { value: _vm.email },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.email = $event.target.value
                      }
                    }
                  }),
                  _vm._v(" "),
                  _c(
                    "span",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.errors.has("email"),
                          expression: "errors.has('email')"
                        }
                      ],
                      staticClass: "help text-danger"
                    },
                    [_vm._v(_vm._s(_vm.errors.first("email")))]
                  )
                ]
              )
            ])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "col-md-12" }, [
              _c(
                "div",
                {
                  staticClass: "form-group",
                  class: { "has-error": _vm.errors.has("message") }
                },
                [
                  _c("label", { attrs: { for: "form_message" } }, [
                    _vm._v("Message *")
                  ]),
                  _vm._v(" "),
                  _c("textarea", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.message,
                        expression: "message"
                      },
                      {
                        name: "validate",
                        rawName: "v-validate",
                        value: "required",
                        expression: "'required'"
                      }
                    ],
                    staticClass: "form-control",
                    attrs: {
                      id: "form_message",
                      name: "message",
                      placeholder: "Please enter your message *",
                      rows: "4"
                    },
                    domProps: { value: _vm.message },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.message = $event.target.value
                      }
                    }
                  }),
                  _vm._v(" "),
                  _c(
                    "span",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.errors.has("message"),
                          expression: "errors.has('message')"
                        }
                      ],
                      staticClass: "help text-danger"
                    },
                    [_vm._v(_vm._s(_vm.errors.first("message")))]
                  )
                ]
              )
            ]),
            _vm._v(" "),
            _vm._m(0, false, false)
          ])
        ])
      ]
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-md-12" }, [
      _c(
        "button",
        { staticClass: "btn btn-success btn-send", attrs: { type: "submit" } },
        [_vm._v("Send message")]
      )
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (true) {
  module.hot.accept()
  if (module.hot.data) {
    __webpack_require__(1)      .rerender("data-v-6343a564", module.exports)
  }
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(3)
/* script */
var __vue_script__ = __webpack_require__(41)
/* template */
var __vue_template__ = __webpack_require__(47)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "ClientApp\\components\\app\\app.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e4cf9bd8", Component.options)
  } else {
    hotAPI.reload("data-v-e4cf9bd8", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var AppComponent = /** @class */ (function (_super) {
    __extends(AppComponent, _super);
    function AppComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__["Component"])({
            components: {
                MenuComponent: __webpack_require__(42)
            }
        })
    ], AppComponent);
    return AppComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (AppComponent);


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(43)
}
var normalizeComponent = __webpack_require__(3)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(46)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "ClientApp\\components\\navmenu\\navmenu.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4ba73554", Component.options)
  } else {
    hotAPI.reload("data-v-4ba73554", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(44)("5534be53", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(5, function() {
     var newContent = __webpack_require__(5);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(45)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 45 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "main-nav" }, [
    _c("div", { staticClass: "navbar navbar-inverse" }, [
      _vm._m(0, false, false),
      _vm._v(" "),
      _c("div", { staticClass: "clearfix" }),
      _vm._v(" "),
      _c("div", { staticClass: "navbar-collapse collapse" }, [
        _c("ul", { staticClass: "nav navbar-nav" }, [
          _c(
            "li",
            [
              _c("router-link", { attrs: { to: "/", exact: true } }, [
                _c("span", { staticClass: "glyphicon glyphicon-home" }),
                _vm._v(" Home\n                    ")
              ])
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "li",
            [
              _c("router-link", { attrs: { to: "/contactus" } }, [
                _c("span", { staticClass: "glyphicon glyphicon-th-list" }),
                _vm._v(" Contact Us\n                    ")
              ])
            ],
            1
          )
        ])
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "navbar-header" }, [
      _c(
        "button",
        {
          staticClass: "navbar-toggle",
          attrs: {
            type: "button",
            "data-toggle": "collapse",
            "data-target": ".navbar-collapse"
          }
        },
        [
          _c("span", { staticClass: "sr-only" }, [_vm._v("Toggle navigation")]),
          _vm._v(" "),
          _c("span", { staticClass: "icon-bar" }),
          _vm._v(" "),
          _c("span", { staticClass: "icon-bar" }),
          _vm._v(" "),
          _c("span", { staticClass: "icon-bar" })
        ]
      ),
      _vm._v(" "),
      _c("a", { staticClass: "navbar-brand", attrs: { href: "/" } }, [
        _vm._v("Contact Us")
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (true) {
  module.hot.accept()
  if (module.hot.data) {
    __webpack_require__(1)      .rerender("data-v-4ba73554", module.exports)
  }
}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "container-fluid", attrs: { id: "app-root" } },
    [
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-sm-3" }, [_c("menu-component")], 1),
        _vm._v(" "),
        _c("div", { staticClass: "col-sm-9" }, [_c("router-view")], 1)
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (true) {
  module.hot.accept()
  if (module.hot.data) {
    __webpack_require__(1)      .rerender("data-v-e4cf9bd8", module.exports)
  }
}

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map