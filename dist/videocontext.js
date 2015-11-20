var VideoContext =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _SourceNodesVideonodeJs = __webpack_require__(1);

	var _SourceNodesVideonodeJs2 = _interopRequireDefault(_SourceNodesVideonodeJs);

	var _SourceNodesSourcenodeJs = __webpack_require__(2);

	var _ProcessingNodesCompositingnodeJs = __webpack_require__(10);

	var _ProcessingNodesCompositingnodeJs2 = _interopRequireDefault(_ProcessingNodesCompositingnodeJs);

	var _DestinationNodeDestinationnodeJs = __webpack_require__(5);

	var _DestinationNodeDestinationnodeJs2 = _interopRequireDefault(_DestinationNodeDestinationnodeJs);

	var _ProcessingNodesEffectnodeJs = __webpack_require__(8);

	var _ProcessingNodesEffectnodeJs2 = _interopRequireDefault(_ProcessingNodesEffectnodeJs);

	var _ProcessingNodesTransitionnodeJs = __webpack_require__(11);

	var _ProcessingNodesTransitionnodeJs2 = _interopRequireDefault(_ProcessingNodesTransitionnodeJs);

	var _rendergraphJs = __webpack_require__(9);

	var _rendergraphJs2 = _interopRequireDefault(_rendergraphJs);

	var _utilsJs = __webpack_require__(3);

	var updateables = [];
	var previousTime = undefined;
	function registerUpdateable(updateable) {
	    updateables.push(updateable);
	}
	function update(time) {
	    if (previousTime === undefined) previousTime = time;
	    var dt = (time - previousTime) / 1000;
	    for (var i = 0; i < updateables.length; i++) {
	        updateables[i]._update(dt);
	    }
	    previousTime = time;
	    requestAnimationFrame(update);
	}
	update();

	var STATE = { "playing": 0, "paused": 1, "stalled": 2, "ended": 3, "broken": 4 };
	//playing - all sources are active
	//paused - all sources are paused
	//stalled - one or more sources is unable to play
	//ended - all sources have finished playing
	//broken - the render graph is in a broken state

	var VideoContext = (function () {
	    function VideoContext(canvas) {
	        _classCallCheck(this, VideoContext);

	        this._gl = canvas.getContext("experimental-webgl", { preserveDrawingBuffer: true, alpha: false });
	        this._renderGraph = new _rendergraphJs2["default"]();
	        this._sourceNodes = [];
	        this._processingNodes = [];
	        this._timeline = [];
	        this._currentTime = 0;
	        this._state = STATE.paused;
	        this._destinationNode = new _DestinationNodeDestinationnodeJs2["default"](this._gl, this._renderGraph);
	        registerUpdateable(this);
	    }

	    _createClass(VideoContext, [{
	        key: "play",
	        value: function play() {
	            console.debug("VideoContext - playing");
	            this._state = STATE.playing;
	            return true;
	        }
	    }, {
	        key: "pause",
	        value: function pause() {
	            console.debug("VideoContext - pausing");
	            this._state = STATE.paused;
	            return true;
	        }
	    }, {
	        key: "createVideoSourceNode",
	        value: function createVideoSourceNode(src) {
	            var sourceOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	            var videoNode = new _SourceNodesVideonodeJs2["default"](src, this._gl, this._renderGraph, sourceOffset);
	            this._sourceNodes.push(videoNode);
	            return videoNode;
	        }
	    }, {
	        key: "createEffectNode",
	        value: function createEffectNode(definition) {
	            var effectNode = new _ProcessingNodesEffectnodeJs2["default"](this._gl, this._renderGraph, definition);
	            this._processingNodes.push(effectNode);
	            return effectNode;
	        }
	    }, {
	        key: "createCompositingNode",
	        value: function createCompositingNode(definition) {
	            var compositingNode = new _ProcessingNodesCompositingnodeJs2["default"](this._gl, this._renderGraph, definition);
	            this._processingNodes.push(compositingNode);
	            return compositingNode;
	        }
	    }, {
	        key: "createTransitionNode",
	        value: function createTransitionNode(definition) {
	            var transitionNode = new _ProcessingNodesTransitionnodeJs2["default"](this._gl, this._renderGraph, definition);
	            this._processingNodes.push(transitionNode);
	            return transitionNode;
	        }
	    }, {
	        key: "_isStalled",
	        value: function _isStalled() {
	            for (var i = 0; i < this._sourceNodes.length; i++) {
	                var sourceNode = this._sourceNodes[i];
	                if (!sourceNode._isReady()) {
	                    return true;
	                }
	            }
	            return false;
	        }
	    }, {
	        key: "_update",
	        value: function _update(dt) {

	            if (this._state === STATE.playing || this._state === STATE.stalled || this._state === STATE.paused) {

	                if (this._state !== STATE.paused) {
	                    if (this._isStalled()) {
	                        this._state = STATE.stalled;
	                    } else {
	                        this._state = STATE.playing;
	                    }
	                }

	                if (this._state === STATE.playing) {
	                    this._currentTime += dt;
	                    if (this._currentTime > this.duration) this._state = STATE.ended;
	                }

	                for (var i = 0; i < this._sourceNodes.length; i++) {
	                    var sourceNode = this._sourceNodes[i];
	                    sourceNode._update(this._currentTime);

	                    if (this._state === STATE.stalled) {
	                        if (sourceNode._isReady() && sourceNode._state === _SourceNodesSourcenodeJs.SOURCENODESTATE.playing) sourceNode._pause();
	                    }
	                    if (this._state === STATE.paused) {
	                        if (sourceNode._state === _SourceNodesSourcenodeJs.SOURCENODESTATE.playing) sourceNode._pause();
	                    }
	                    if (this._state === STATE.playing) {
	                        if (sourceNode._state === _SourceNodesSourcenodeJs.SOURCENODESTATE.paused) sourceNode._play();
	                    }
	                }

	                var _iteratorNormalCompletion = true;
	                var _didIteratorError = false;
	                var _iteratorError = undefined;

	                try {
	                    for (var _iterator = this._processingNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                        var node = _step.value;

	                        node._update(this._currentTime);
	                        node._render();
	                    }
	                } catch (err) {
	                    _didIteratorError = true;
	                    _iteratorError = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion && _iterator["return"]) {
	                            _iterator["return"]();
	                        }
	                    } finally {
	                        if (_didIteratorError) {
	                            throw _iteratorError;
	                        }
	                    }
	                }

	                this._destinationNode._render();
	            }
	        }
	    }, {
	        key: "currentTime",
	        set: function set(currentTime) {
	            console.debug("VideoContext - seeking to", currentTime);
	            if (currentTime < this._duration && this._state === STATE.ended) this._state = STATE.duration;
	            if (typeof currentTime === 'string' || currentTime instanceof String) {
	                currentTime = parseFloat(currentTime);
	            }

	            for (var i = 0; i < this._sourceNodes.length; i++) {
	                this._sourceNodes[i]._seek(currentTime);
	            }
	            this._currentTime = currentTime;
	        },

	        /**
	        * Get how far through the internal timeline has been played.
	        *
	        * Getting this value will give the current playhead position. Can be used for updating timelines.
	        * @return {number} The time in seconds through the current playlist.
	        * 
	        * @example
	        * var ctx = new VideoContext();
	        * var canvasElement = document.getElemenyById("canvas");
	        * var videoNode = ctx.createVideoSourceNode("video.mp4");
	        * var outputNode =ctx.createOutputNode(cavnasElement);
	        * videoNode.connect(outputNode);
	        * videoNode.start();
	        * videoCtx.play();
	        *
	        */
	        get: function get() {
	            return this._currentTime;
	        }
	    }, {
	        key: "duration",
	        get: function get() {
	            var maxTime = 0;
	            for (var i = 0; i < this._sourceNodes.length; i++) {
	                if (this._sourceNodes[i]._stopTime > maxTime) {
	                    maxTime = this._sourceNodes[i]._stopTime;
	                }
	            }
	            return maxTime;
	        }
	    }, {
	        key: "destination",
	        get: function get() {
	            return this._destinationNode;
	        }
	    }]);

	    return VideoContext;
	})();

	VideoContext.visualiseVideoContextTimeline = _utilsJs.visualiseVideoContextTimeline;
	VideoContext.visualiseVideoContextGraph = _utilsJs.visualiseVideoContextGraph;

	exports["default"] = VideoContext;
	module.exports = exports["default"];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _sourcenode = __webpack_require__(2);

	var _sourcenode2 = _interopRequireDefault(_sourcenode);

	var _utilsJs = __webpack_require__(3);

	var VideoNode = (function (_SourceNode) {
	    _inherits(VideoNode, _SourceNode);

	    function VideoNode(src, gl, renderGraph) {
	        var sourceOffset = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
	        var preloadTime = arguments.length <= 4 || arguments[4] === undefined ? 4 : arguments[4];

	        _classCallCheck(this, VideoNode);

	        _get(Object.getPrototypeOf(VideoNode.prototype), "constructor", this).call(this, src, gl, renderGraph);
	        this._preloadTime = preloadTime;
	        this._sourceOffset = sourceOffset;
	    }

	    _createClass(VideoNode, [{
	        key: "_load",
	        value: function _load() {
	            if (this._element !== undefined) {
	                if (this._element.readyState > 3 && !this._element.seeking) {
	                    this._ready = true;
	                } else {
	                    this._ready = false;
	                }
	                return;
	            }
	            if (this._isResponsibleForElementLifeCycle) {
	                _get(Object.getPrototypeOf(VideoNode.prototype), "_load", this).call(this);
	                this._element = document.createElement("video");
	                this._element.src = this._elementURL;
	            }
	            this._element.currentTime = this._sourceOffset;
	        }
	    }, {
	        key: "_destroy",
	        value: function _destroy() {
	            _get(Object.getPrototypeOf(VideoNode.prototype), "_destroy", this).call(this);
	            if (this._isResponsibleForElementLifeCycle) {
	                this._element.src = "";
	                this._element = undefined;
	                delete this._element;
	            }
	            this._ready = false;
	        }
	    }, {
	        key: "_seek",
	        value: function _seek(time) {
	            _get(Object.getPrototypeOf(VideoNode.prototype), "_seek", this).call(this, time);
	            if (this.state === _sourcenode.SOURCENODESTATE.playing || this.state === _sourcenode.SOURCENODESTATE.paused) {
	                if (this._element === undefined) this._load();
	                this._element.currentTime = this._currentTime - this._startTime + this._sourceOffset;
	                this._ready = false;
	            }
	        }
	    }, {
	        key: "_update",
	        value: function _update(currentTime) {
	            //if (!super._update(currentTime)) return false;
	            var active = _get(Object.getPrototypeOf(VideoNode.prototype), "_update", this).call(this, currentTime);
	            if (this._startTime - this._currentTime < this._preloadTime && this._state !== _sourcenode.SOURCENODESTATE.waiting && this._state !== _sourcenode.SOURCENODESTATE.ended) this._load();

	            if (this._state === _sourcenode.SOURCENODESTATE.playing) {
	                this._element.play();
	                return true;
	            } else if (this._state === _sourcenode.SOURCENODESTATE.paused) {
	                this._element.pause();
	                return true;
	            } else if (this._state === _sourcenode.SOURCENODESTATE.ended && this._element !== undefined) {
	                this._element.pause();
	                this._destroy();
	                return false;
	            }
	        }
	    }]);

	    return VideoNode;
	})(_sourcenode2["default"]);

	exports["default"] = VideoNode;
	module.exports = exports["default"];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _utilsJs = __webpack_require__(3);

	var _graphnode = __webpack_require__(4);

	var _graphnode2 = _interopRequireDefault(_graphnode);

	var STATE = { "waiting": 0, "sequenced": 1, "playing": 2, "paused": 3, "ended": 4 };

	var SourceNode = (function (_GraphNode) {
	    _inherits(SourceNode, _GraphNode);

	    function SourceNode(src, gl, renderGraph) {
	        _classCallCheck(this, SourceNode);

	        _get(Object.getPrototypeOf(SourceNode.prototype), "constructor", this).call(this, gl, renderGraph, 0);
	        this._element = undefined;
	        this._elementURL = undefined;
	        this._isResponsibleForElementLifeCycle = true;
	        if (typeof src === 'string') {
	            //create the node from the passed url
	            this._elementURL = src;
	        } else {
	            //use the passed element to create the SourceNode
	            this._element = src;
	            this._isResponsibleForElementLifeCycle = false;
	        }

	        this._state = STATE.waiting;
	        this._currentTime = 0;
	        this._startTime = 0;
	        this._stopTime = 0;
	        this._ready = false;
	        this._texture = (0, _utilsJs.createElementTexutre)(gl);
	        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,512,512, gl.RGBA, gl.UNSIGNED_BYTE, this._element);
	        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
	        this._callbacks = [];
	    }

	    _createClass(SourceNode, [{
	        key: "_load",
	        value: function _load() {
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = this._callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var callback = _step.value;

	                    if (callback.type === "load") callback.func(this);
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator["return"]) {
	                        _iterator["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	        }
	    }, {
	        key: "_destroy",
	        value: function _destroy() {
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;

	            try {
	                for (var _iterator2 = this._callbacks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var callback = _step2.value;

	                    if (callback.type === "destroy") callback.func(this);
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
	                        _iterator2["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }
	        }
	    }, {
	        key: "attachCallback",
	        value: function attachCallback(type, func) {
	            this._callbacks.push({ type: type, func: func });
	        }
	    }, {
	        key: "removeCallback",
	        value: function removeCallback(func) {
	            var toRemove = [];
	            var _iteratorNormalCompletion3 = true;
	            var _didIteratorError3 = false;
	            var _iteratorError3 = undefined;

	            try {
	                for (var _iterator3 = this._callbacks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                    var callback = _step3.value;

	                    if (callback.func === func) toRemove.push(callback);
	                }
	            } catch (err) {
	                _didIteratorError3 = true;
	                _iteratorError3 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
	                        _iterator3["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError3) {
	                        throw _iteratorError3;
	                    }
	                }
	            }

	            var _iteratorNormalCompletion4 = true;
	            var _didIteratorError4 = false;
	            var _iteratorError4 = undefined;

	            try {
	                for (var _iterator4 = toRemove[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                    var callback = _step4.value;

	                    var index = this._callbacks.indexOf(callback);
	                    this._callbacks.splice(index, 1);
	                }
	            } catch (err) {
	                _didIteratorError4 = true;
	                _iteratorError4 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
	                        _iterator4["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError4) {
	                        throw _iteratorError4;
	                    }
	                }
	            }
	        }
	    }, {
	        key: "start",
	        value: function start(time) {
	            if (this._state !== STATE.waiting) {
	                console.debug("SourceNode is has already been sequenced. Can't sequence twice.");
	                return false;
	            }

	            this._startTime = this._currentTime + time;
	            this._state = STATE.sequenced;
	            return true;
	        }
	    }, {
	        key: "stop",
	        value: function stop(time) {
	            if (this._state === STATE.ended) {
	                console.debug("SourceNode has already ended. Cannot call stop.");
	                return false;
	            } else if (this._state === STATE.waiting) {
	                console.debug("SourceNode must have start called before stop is called");
	                return false;
	            }
	            if (this._currentTime + time <= this._startTime) {
	                console.debug("SourceNode must have a stop time after it's start time, not before.");
	                return false;
	            }
	            this._stopTime = this._currentTime + time;
	            return true;
	        }
	    }, {
	        key: "_seek",
	        value: function _seek(time) {
	            var _iteratorNormalCompletion5 = true;
	            var _didIteratorError5 = false;
	            var _iteratorError5 = undefined;

	            try {
	                for (var _iterator5 = this._callbacks[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                    var callback = _step5.value;

	                    if (callback.type === "seek") callback.func(this, time);
	                }
	            } catch (err) {
	                _didIteratorError5 = true;
	                _iteratorError5 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
	                        _iterator5["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError5) {
	                        throw _iteratorError5;
	                    }
	                }
	            }

	            if (this._state === STATE.waiting) return;
	            if (time < this._startTime) {
	                (0, _utilsJs.clearTexture)(this._gl, this._texture);
	                this._state = STATE.sequenced;
	            }
	            if (time >= this._startTime && this._state !== STATE.paused) {
	                this._state = STATE.playing;
	            }
	            if (time >= this._stopTime) {
	                (0, _utilsJs.clearTexture)(this._gl, this._texture);
	                this._state = STATE.ended;
	            }
	            //update the current time
	            this._currentTime = time;
	        }
	    }, {
	        key: "_pause",
	        value: function _pause() {
	            var _iteratorNormalCompletion6 = true;
	            var _didIteratorError6 = false;
	            var _iteratorError6 = undefined;

	            try {
	                for (var _iterator6 = this._callbacks[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                    var callback = _step6.value;

	                    if (callback.type === "pause") callback.func(this);
	                }
	            } catch (err) {
	                _didIteratorError6 = true;
	                _iteratorError6 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
	                        _iterator6["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError6) {
	                        throw _iteratorError6;
	                    }
	                }
	            }

	            if (this._state === STATE.playing) {
	                this._state = STATE.paused;
	            }
	        }
	    }, {
	        key: "_play",
	        value: function _play() {
	            var _iteratorNormalCompletion7 = true;
	            var _didIteratorError7 = false;
	            var _iteratorError7 = undefined;

	            try {
	                for (var _iterator7 = this._callbacks[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                    var callback = _step7.value;

	                    if (callback.type === "play") callback.func(this);
	                }
	            } catch (err) {
	                _didIteratorError7 = true;
	                _iteratorError7 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
	                        _iterator7["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError7) {
	                        throw _iteratorError7;
	                    }
	                }
	            }

	            if (this._state === STATE.paused) {
	                this._state = STATE.playing;
	            }
	        }
	    }, {
	        key: "_isReady",
	        value: function _isReady() {
	            if (this._state === STATE.playing || this._state === STATE.paused) {
	                return this._ready;
	            }
	            return true;
	        }
	    }, {
	        key: "_update",
	        value: function _update(currentTime) {
	            this._rendered = true;

	            //update the state
	            if (this._state === STATE.waiting || this._state === STATE.ended) return false;

	            var _iteratorNormalCompletion8 = true;
	            var _didIteratorError8 = false;
	            var _iteratorError8 = undefined;

	            try {
	                for (var _iterator8 = this._callbacks[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	                    var callback = _step8.value;

	                    if (callback.type === "render") callback.func(this, currentTime);
	                }
	            } catch (err) {
	                _didIteratorError8 = true;
	                _iteratorError8 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
	                        _iterator8["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError8) {
	                        throw _iteratorError8;
	                    }
	                }
	            }

	            if (currentTime < this._startTime) {
	                (0, _utilsJs.clearTexture)(this._gl, this._texture);
	                this._state = STATE.sequenced;
	            }

	            if (currentTime >= this._startTime && this._state !== STATE.paused) {
	                this._state = STATE.playing;
	            }

	            if (currentTime >= this._stopTime) {
	                (0, _utilsJs.clearTexture)(this._gl, this._texture);
	                this._state = STATE.ended;
	            }

	            //update the current time
	            this._currentTime = currentTime;

	            //update this source nodes texture
	            if (this._element === undefined || this._ready === false) return true;

	            if (this._state === STATE.playing) {
	                (0, _utilsJs.updateTexture)(this._gl, this._texture, this._element);
	            }

	            return true;
	        }
	    }, {
	        key: "clearTimelineState",
	        value: function clearTimelineState() {
	            this._startTime = 0;
	            this._stopTime = 0;
	            this._state = STATE.waiting;
	        }
	    }, {
	        key: "state",
	        get: function get() {
	            return this._state;
	        }
	    }]);

	    return SourceNode;
	})(_graphnode2["default"]);

	exports["default"] = SourceNode;
	exports.SOURCENODESTATE = STATE;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.compileShader = compileShader;
	exports.createShaderProgram = createShaderProgram;
	exports.createElementTexutre = createElementTexutre;
	exports.updateTexture = updateTexture;
	exports.clearTexture = clearTexture;
	exports.visualiseVideoContextGraph = visualiseVideoContextGraph;
	exports.visualiseVideoContextTimeline = visualiseVideoContextTimeline;

	function compileShader(gl, shaderSource, shaderType) {
	    var shader = gl.createShader(shaderType);
	    gl.shaderSource(shader, shaderSource);
	    gl.compileShader(shader);
	    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	    if (!success) {
	        throw "could not compile shader:" + gl.getShaderInfoLog(shader);
	    }
	    return shader;
	}

	function createShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
	    var vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
	    var fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
	    var program = gl.createProgram();

	    gl.attachShader(program, vertexShader);
	    gl.attachShader(program, fragmentShader);
	    gl.linkProgram(program);

	    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	        throw { "error": 4, "msg": "Can't link shader program for track", toString: function toString() {
	                return this.msg;
	            } };
	    }
	    return program;
	}

	function createElementTexutre(gl) {
	    var type = arguments.length <= 1 || arguments[1] === undefined ? new Uint8Array([0, 0, 0, 0]) : arguments[1];
	    var width = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
	    var height = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

	    var texture = gl.createTexture();
	    gl.bindTexture(gl.TEXTURE_2D, texture);
	    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	    // Set the parameters so we can render any size image.
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	    //Initialise the texture untit to clear.
	    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, type);

	    return texture;
	}

	function updateTexture(gl, texture, element) {
	    gl.bindTexture(gl.TEXTURE_2D, texture);
	    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, element);
	}

	function clearTexture(gl, texture) {
	    gl.bindTexture(gl.TEXTURE_2D, texture);
	    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
	}

	function visualiseVideoContextGraph(videoContext, canvas) {
	    var ctx = canvas.getContext('2d');
	    var w = canvas.width;
	    var h = canvas.height;
	    var renderNodes = [];
	    ctx.clearRect(0, 0, w, h);

	    function getNodePos(node) {
	        for (var i = 0; i < renderNodes.length; i++) {
	            if (renderNodes[i].node === node) return renderNodes[i];
	        }
	        return undefined;
	    }

	    var nodeHeight = h / videoContext._sourceNodes.length / 2;
	    var nodeWidth = nodeHeight * 1.618;

	    var destinationNode = { w: nodeWidth, h: nodeHeight, y: h / 2 - nodeHeight / 2, x: w - nodeWidth, node: videoContext.destination, color: "#7D9F35" };
	    renderNodes.push(destinationNode);

	    for (var i = 0; i < videoContext._sourceNodes.length; i++) {
	        var sourceNode = videoContext._sourceNodes[i];
	        var nodeX = 0;
	        var nodeY = i * (h / videoContext._sourceNodes.length);
	        var renderNode = { w: nodeWidth, h: nodeHeight, x: nodeX, y: nodeY, node: sourceNode, color: "#572A72" };
	        renderNodes.push(renderNode);
	    }

	    for (var i = 0; i < videoContext._processingNodes.length; i++) {
	        var sourceNode = videoContext._processingNodes[i];
	        var color = "#AA9639";
	        if (sourceNode.constructor.name === "CompositingNode") color = "#000000";
	        var nodeX = Math.random() * (w - nodeWidth * 4) + nodeWidth * 2;
	        var nodeY = Math.random() * (h - nodeHeight * 2) + nodeHeight;
	        var renderNode = { w: nodeWidth, h: nodeHeight, x: nodeX, y: nodeY, node: sourceNode, color: color };
	        renderNodes.push(renderNode);
	    }

	    for (var i = 0; i < videoContext._renderGraph.connections.length; i++) {
	        var conn = videoContext._renderGraph.connections[i];
	        var source = getNodePos(conn.source);
	        var destination = getNodePos(conn.destination);
	        if (source !== undefined && destination !== undefined) {
	            ctx.moveTo(source.x + nodeWidth / 2, source.y + nodeHeight / 2);
	            ctx.lineTo(destination.x + nodeWidth / 2, destination.y + nodeHeight / 2);
	            ctx.stroke();
	        }
	    }

	    for (var i = 0; i < renderNodes.length; i++) {
	        var n = renderNodes[i];
	        ctx.fillStyle = n.color;
	        ctx.fillRect(n.x, n.y, n.w, n.h);
	        ctx.fill();
	    }
	}

	function visualiseVideoContextTimeline(videoContext, canvas, currentTime) {
	    var ctx = canvas.getContext('2d');
	    var w = canvas.width;
	    var h = canvas.height;
	    var trackHeight = h / videoContext._sourceNodes.length;
	    var playlistDuration = videoContext.duration;
	    var pixelsPerSecond = w / playlistDuration;
	    var mediaSourceStyle = {
	        "video": ["#572A72", "#3C1255"],
	        "image": ["#7D9F35", "#577714"],
	        "canvas": ["#AA9639", "#806D15"]
	    };

	    ctx.clearRect(0, 0, w, h);
	    ctx.fillStyle = "#999";

	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = videoContext._processingNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var node = _step.value;

	            if (node.constructor.name !== "TransitionNode") continue;
	            for (var propertyName in node._transitions) {
	                var _iteratorNormalCompletion2 = true;
	                var _didIteratorError2 = false;
	                var _iteratorError2 = undefined;

	                try {
	                    for (var _iterator2 = node._transitions[propertyName][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                        var transition = _step2.value;

	                        var tW = (transition.end - transition.start) * pixelsPerSecond;
	                        var tH = h;
	                        var tX = transition.start * pixelsPerSecond;
	                        var tY = 0;
	                        ctx.fillStyle = "rgba(0,0,0, 0.3)";
	                        ctx.fillRect(tX, tY, tW, tH);
	                        ctx.fill();
	                    }
	                } catch (err) {
	                    _didIteratorError2 = true;
	                    _iteratorError2 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
	                            _iterator2["return"]();
	                        }
	                    } finally {
	                        if (_didIteratorError2) {
	                            throw _iteratorError2;
	                        }
	                    }
	                }
	            }
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator["return"]) {
	                _iterator["return"]();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }

	    for (var i = 0; i < videoContext._sourceNodes.length; i++) {
	        var sourceNode = videoContext._sourceNodes[i];
	        var duration = sourceNode._stopTime - sourceNode._startTime;
	        var start = sourceNode._startTime;

	        var msW = duration * pixelsPerSecond;
	        var msH = trackHeight;
	        var msX = start * pixelsPerSecond;
	        var msY = trackHeight * i;
	        ctx.fillStyle = mediaSourceStyle.video[i % mediaSourceStyle.video.length];
	        ctx.fillRect(msX, msY, msW, msH);
	        ctx.fill();
	    }

	    if (currentTime !== undefined) {
	        ctx.fillStyle = "#000";
	        ctx.fillRect(currentTime * pixelsPerSecond, 0, 1, h);
	    }
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var GraphNode = (function () {
	    function GraphNode(gl, renderGraph, maxInputs) {
	        _classCallCheck(this, GraphNode);

	        this._renderGraph = renderGraph;
	        this._maxInputs = maxInputs;

	        //Setup WebGL output texture
	        this._gl = gl;
	        this._renderGraph = renderGraph;
	        this._rendered = false;
	    }

	    _createClass(GraphNode, [{
	        key: "connect",
	        value: function connect(targetNode, zIndex) {
	            if (zIndex === undefined) {
	                var targetInputs = this._renderGraph.getSortedInputsForNode(targetNode);
	                zIndex = targetInputs[targetInputs.length - 1] + 1.0;
	            }
	            return this._renderGraph.registerConnection(this, targetNode, zIndex);
	        }
	    }, {
	        key: "disconnect",
	        value: function disconnect(targetNode) {
	            if (targetNode === undefined) {
	                var toRemove = this._renderGraph.getOutputsForNode(this);
	                toRemove.forEach(function (target) {
	                    this._renderGraph.unregisterConnection(this, target);
	                });
	                if (toRemove.length > 0) return true;
	                return false;
	            }
	            return this._renderGraph.unregisterConnection(this, targetNode);
	        }
	    }, {
	        key: "inputs",
	        get: function get() {
	            var inputConnections = this._renderGraph.getSortedInputsForNode(this);
	            var results = [];
	            inputConnections.forEach(function (connection) {
	                results.push(connection.node);
	            });
	            return results;
	        }
	    }, {
	        key: "outputs",
	        get: function get() {
	            var outputConnections = this._renderGraph.getSortedOutputsForNode(this);
	            var results = [];
	            outputConnections.forEach(function (connection) {
	                results.push(connection.node);
	            });
	            return results;
	        }
	    }]);

	    return GraphNode;
	})();

	exports["default"] = GraphNode;
	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _SourceNodesSourcenode = __webpack_require__(2);

	//import GraphNode from "../graphnode";

	var _ProcessingNodesProcessingnode = __webpack_require__(6);

	var _ProcessingNodesProcessingnode2 = _interopRequireDefault(_ProcessingNodesProcessingnode);

	var DestinationNode = (function (_ProcessingNode) {
	    _inherits(DestinationNode, _ProcessingNode);

	    function DestinationNode(gl, renderGraph) {
	        _classCallCheck(this, DestinationNode);

	        var vertexShader = "\
	            attribute vec2 a_position;\
	            attribute vec2 a_texCoord;\
	            varying vec2 v_texCoord;\
	            void main() {\
	                gl_Position = vec4(vec2(2.0,2.0)*a_position-vec2(1.0, 1.0), 0.0, 1.0);\
	                v_texCoord = a_texCoord;\
	            }";

	        var fragmentShader = "\
	            precision mediump float;\
	            uniform sampler2D u_image;\
	            varying vec2 v_texCoord;\
	            varying float v_progress;\
	            void main(){\
	                gl_FragColor = texture2D(u_image, v_texCoord);\
	            }";

	        _get(Object.getPrototypeOf(DestinationNode.prototype), "constructor", this).call(this, gl, renderGraph, { fragmentShader: fragmentShader, vertexShader: vertexShader, properties: {}, inputs: ["u_image"] });
	    }

	    _createClass(DestinationNode, [{
	        key: "_render",
	        value: function _render() {
	            var _this2 = this;

	            var gl = this._gl;
	            var _this = this;

	            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	            gl.enable(gl.BLEND);
	            gl.clearColor(0, 0, 0, 0.0); // green;
	            gl.clear(gl.COLOR_BUFFER_BIT);

	            this.inputs.forEach(function (node) {
	                _get(Object.getPrototypeOf(DestinationNode.prototype), "_render", _this2).call(_this2);
	                //map the input textures input the node
	                var texture = node._texture;
	                var textureOffset = 0;

	                var _iteratorNormalCompletion = true;
	                var _didIteratorError = false;
	                var _iteratorError = undefined;

	                try {
	                    for (var _iterator = _this._inputTextureUnitMapping[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                        var mapping = _step.value;

	                        gl.activeTexture(mapping.textureUnit);
	                        var textureLocation = gl.getUniformLocation(_this._program, mapping.name);
	                        gl.uniform1i(textureLocation, _this._parameterTextureCount + textureOffset);
	                        textureOffset += 1;
	                        gl.bindTexture(gl.TEXTURE_2D, texture);
	                    }
	                } catch (err) {
	                    _didIteratorError = true;
	                    _iteratorError = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion && _iterator["return"]) {
	                            _iterator["return"]();
	                        }
	                    } finally {
	                        if (_didIteratorError) {
	                            throw _iteratorError;
	                        }
	                    }
	                }

	                gl.drawArrays(gl.TRIANGLES, 0, 6);
	            });
	        }
	    }]);

	    return DestinationNode;
	})(_ProcessingNodesProcessingnode2["default"]);

	exports["default"] = DestinationNode;
	module.exports = exports["default"];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _graphnode = __webpack_require__(4);

	var _graphnode2 = _interopRequireDefault(_graphnode);

	var _utilsJs = __webpack_require__(3);

	var _exceptionsJs = __webpack_require__(7);

	var ProcessingNode = (function (_GraphNode) {
	    _inherits(ProcessingNode, _GraphNode);

	    function ProcessingNode(gl, renderGraph, definition, maxInputs) {
	        var _this = this;

	        _classCallCheck(this, ProcessingNode);

	        _get(Object.getPrototypeOf(ProcessingNode.prototype), "constructor", this).call(this, gl, renderGraph, maxInputs);
	        this._vertexShader = definition.vertexShader;
	        this._fragmentShader = definition.fragmentShader;
	        this._properties = {}; //definition.properties;
	        //copy definition properties
	        for (var propertyName in definition.properties) {
	            var propertyValue = definition.properties[propertyName].value;
	            var propertyType = definition.properties[propertyName].type;
	            this._properties[propertyName] = { type: propertyType, value: propertyValue };
	        }

	        this._inputTextureUnitMapping = [];
	        this._maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
	        this._boundTextureUnits = 0;
	        this._parameterTextureCount = 0;
	        this._inputTextureCount = 0;
	        this._texture = (0, _utilsJs.createElementTexutre)(gl, null, gl.canvas.width, gl.canvas.height);
	        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.canvas.width, gl.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	        //compile the shader
	        this._program = (0, _utilsJs.createShaderProgram)(gl, this._vertexShader, this._fragmentShader);

	        //create and setup the framebuffer
	        this._framebuffer = gl.createFramebuffer();
	        gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
	        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture, 0);
	        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	        //create properties on this object for the passed properties

	        var _loop = function (propertyName) {
	            Object.defineProperty(_this, propertyName, {
	                get: function get() {
	                    return this._properties[propertyName].value;
	                },
	                set: function set(passedValue) {
	                    this._properties[propertyName].value = passedValue;
	                }
	            });
	        };

	        for (var propertyName in this._properties) {
	            _loop(propertyName);
	        }

	        //create texutres for any texture properties
	        for (var propertyName in this._properties) {
	            var propertyValue = this._properties[propertyName].value;
	            if (propertyValue instanceof Image) {
	                this._properties[propertyName].texture = (0, _utilsJs.createElementTexutre)(gl);
	                this._properties[propertyName].texutreUnit = gl.TEXTURE0 + this._boundTextureUnits;
	                this._boundTextureUnits += 1;
	                this._parameterTextureCount += 1;
	                if (this._boundTextureUnits > this._maxTextureUnits) {
	                    throw new _exceptionsJs.RenderException("Trying to bind more than available textures units to shader");
	                }
	            }
	        }

	        //calculate texutre units for input textures
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = definition.inputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var inputName = _step.value;

	                this._inputTextureUnitMapping.push({ name: inputName, textureUnit: gl.TEXTURE0 + this._boundTextureUnits });
	                this._boundTextureUnits += 1;
	                this._inputTextureCount += 1;
	                if (this._boundTextureUnits > this._maxTextureUnits) {
	                    throw new _exceptionsJs.RenderException("Trying to bind more than available textures units to shader");
	                }
	            }

	            //find the locations of the properties in the compiled shader
	        } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion && _iterator["return"]) {
	                    _iterator["return"]();
	                }
	            } finally {
	                if (_didIteratorError) {
	                    throw _iteratorError;
	                }
	            }
	        }

	        for (var propertyName in this._properties) {
	            if (this._properties[propertyName].type === "uniform") {
	                this._properties[propertyName].location = this._gl.getUniformLocation(this._program, propertyName);
	            }
	        }
	        this._currentTimeLocation = this._gl.getUniformLocation(this._program, "currentTime");
	        this._currentTime = 0;

	        //Other setup
	        var positionLocation = gl.getAttribLocation(this._program, "a_position");
	        var buffer = gl.createBuffer();
	        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	        gl.enableVertexAttribArray(positionLocation);
	        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0]), gl.STATIC_DRAW);
	        var texCoordLocation = gl.getAttribLocation(this._program, "a_texCoord");
	        gl.enableVertexAttribArray(texCoordLocation);
	        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

	        //console.log(gl.getUniformLocation(this._program, "u_image"));
	    }

	    _createClass(ProcessingNode, [{
	        key: "_update",
	        value: function _update(currentTime) {
	            this._currentTime = currentTime;
	        }
	    }, {
	        key: "_render",
	        value: function _render() {
	            this._rendered = true;
	            var gl = this._gl;
	            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	            gl.useProgram(this._program);

	            //upload the default uniforms
	            //gl.uniform1fv(this._currentTimeLocation, this._currentTime);

	            //upload/update the custom uniforms
	            var textureOffset = 0;

	            for (var propertyName in this._properties) {
	                var propertyValue = this._properties[propertyName].value;
	                var propertyType = this._properties[propertyName].type;
	                var propertyLocation = this._properties[propertyName].location;
	                if (propertyType !== 'uniform') continue;

	                if (typeof propertyValue === "number") {
	                    gl.uniform1f(propertyLocation, propertyValue);
	                } else if (Object.prototype.toString.call(propertyValue) === '[object Array]') {
	                    if (propertyValue.length === 1) {
	                        gl.uniform1fv(propertyLocation, propertyValue);
	                    } else if (propertyValue.length === 2) {
	                        gl.uniform2fv(propertyLocation, propertyValue);
	                    } else if (propertyValue.length === 3) {
	                        gl.uniform3fv(propertyLocation, propertyValue);
	                    } else if (propertyValue.length === 4) {
	                        gl.uniform4fv(propertyLocation, propertyValue);
	                    } else {
	                        console.debug("Shader parameter", propertyName, "is too long an array:", propertyValue);
	                    }
	                } else if (propertyValue instanceof Image) {
	                    var texture = this._properties[propertyName].texture;
	                    var textureUnit = this._properties[propertyName].texutreUnit;
	                    (0, _utilsJs.updateTexture)(gl, texture, propertyValue);

	                    gl.activeTexture(textureUnit);
	                    gl.uniform1i(propertyLocation, textureOffset);
	                    textureOffset += 1;
	                    gl.bindTexture(gl.TEXTURE_2D, texture);
	                } else {
	                    //TODO - add tests for textures
	                    /*gl.activeTexture(gl.TEXTURE0 + textureOffset);
	                    gl.uniform1i(parameterLoctation, textureOffset);
	                    gl.bindTexture(gl.TEXTURE_2D, textures[textureOffset-1]);*/
	                }
	            }
	        }
	    }]);

	    return ProcessingNode;
	})(_graphnode2["default"]);

	exports["default"] = ProcessingNode;
	module.exports = exports["default"];

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ConnectException = ConnectException;
	exports.RenderException = RenderException;

	function ConnectException(message) {
	    this.message = message;
	    this.name = "ConnectionException";
	}

	function RenderException(message) {
	    this.message = message;
	    this.name = "RenderException";
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _processingnode = __webpack_require__(6);

	var _processingnode2 = _interopRequireDefault(_processingnode);

	var _utilsJs = __webpack_require__(3);

	var EffectNode = (function (_ProcessingNode) {
	    _inherits(EffectNode, _ProcessingNode);

	    function EffectNode(gl, renderGraph, definition) {
	        _classCallCheck(this, EffectNode);

	        var maxInputs = definition.inputs.length;
	        var placeholderTexture = (0, _utilsJs.createElementTexutre)(gl);
	        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

	        _get(Object.getPrototypeOf(EffectNode.prototype), "constructor", this).call(this, gl, renderGraph, definition, maxInputs);

	        this._placeholderTexture = placeholderTexture;
	    }

	    _createClass(EffectNode, [{
	        key: "_render",
	        value: function _render() {
	            var gl = this._gl;
	            gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
	            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture, 0);
	            gl.clearColor(0, 0, 0, 0); // green;
	            gl.clear(gl.COLOR_BUFFER_BIT);

	            _get(Object.getPrototypeOf(EffectNode.prototype), "_render", this).call(this);

	            var inputs = this.inputs;
	            var textureOffset = 0;

	            for (var i = 0; i < this._inputTextureUnitMapping.length; i++) {
	                var inputTexture = this._placeholderTexture;
	                var textureUnit = this._inputTextureUnitMapping[i].textureUnit;
	                var textureName = this._inputTextureUnitMapping[i].name;
	                if (i < inputs.length) {
	                    inputTexture = inputs[i]._texture;
	                    //console.log(textureName, textureUnit);
	                } else {
	                        //console.debug("VideoContext:Warning - not all inputs to effect node are connected");
	                    }

	                gl.activeTexture(textureUnit);
	                var textureLocation = gl.getUniformLocation(this._program, textureName);
	                gl.uniform1i(textureLocation, this._parameterTextureCount + textureOffset);
	                textureOffset += 1;
	                gl.bindTexture(gl.TEXTURE_2D, inputTexture);
	            }
	            gl.drawArrays(gl.TRIANGLES, 0, 6);
	            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	        }
	    }]);

	    return EffectNode;
	})(_processingnode2["default"]);

	exports["default"] = EffectNode;
	module.exports = exports["default"];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _exceptionsJs = __webpack_require__(7);

	var RenderGraph = (function () {
	    function RenderGraph() {
	        _classCallCheck(this, RenderGraph);

	        this.connections = [];
	    }

	    _createClass(RenderGraph, [{
	        key: "getOutputsForNode",
	        value: function getOutputsForNode(node) {
	            var results = [];
	            this.connections.forEach(function (connection) {
	                if (connection.source === node) {
	                    results.push({ "node": connection.destination, "zIndex": connection.zIndex });
	                }
	            });
	            return results;
	        }
	    }, {
	        key: "getSortedOutputsForNode",
	        value: function getSortedOutputsForNode(node) {
	            var outputs = this.getOutputsForNode(node);
	            outputs.sort(function (a, b) {
	                return a.zIndex - b.zIndex;
	            });
	            return outputs;
	        }
	    }, {
	        key: "getInputsForNode",
	        value: function getInputsForNode(node) {
	            var results = [];
	            this.connections.forEach(function (connection) {
	                if (connection.destination === node) {
	                    results.push({ "node": connection.source, "zIndex": connection.zIndex });
	                }
	            });
	            return results;
	        }
	    }, {
	        key: "getSortedInputsForNode",
	        value: function getSortedInputsForNode(node) {
	            var inputs = this.getInputsForNode(node);
	            inputs.sort(function (a, b) {
	                return a.zIndex - b.zIndex;
	            });
	            return inputs;
	        }
	    }, {
	        key: "registerConnection",
	        value: function registerConnection(sourceNode, destinationNode, zIndex) {
	            if (destinationNode._maxInputs !== undefined && destinationNode.inputs.length >= destinationNode._maxInputs) {
	                throw new _exceptionsJs.ConnectException("Node has reached max number of inputs, can't connect");
	            }
	            this.connections.push({ "source": sourceNode, "zIndex": zIndex, "destination": destinationNode });
	            return true;
	        }
	    }, {
	        key: "unregsiterConnection",
	        value: function unregsiterConnection(sourceNode, destinationNode) {
	            var toRemove = [];

	            this.connections.forEach(function (connection) {
	                if (connection.source === sourceNode && connection.destination === destinationNode) {
	                    toRemove.push(connection);
	                }
	            });

	            if (toRemove.length === 0) return false;

	            this.toRemove.forEach(function (removeNode) {
	                var index = this.connections.indexOf(removeNode);
	                this.connections.splice(index, 1);
	            });

	            return true;
	        }
	    }]);

	    return RenderGraph;
	})();

	exports["default"] = RenderGraph;
	module.exports = exports["default"];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _processingnode = __webpack_require__(6);

	var _processingnode2 = _interopRequireDefault(_processingnode);

	var _utilsJs = __webpack_require__(3);

	var CompositingNode = (function (_ProcessingNode) {
	    _inherits(CompositingNode, _ProcessingNode);

	    function CompositingNode(gl, renderGraph, definition) {
	        _classCallCheck(this, CompositingNode);

	        var placeholderTexture = (0, _utilsJs.createElementTexutre)(gl);
	        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
	        _get(Object.getPrototypeOf(CompositingNode.prototype), "constructor", this).call(this, gl, renderGraph, definition);
	        this._placeholderTexture = placeholderTexture;
	    }

	    _createClass(CompositingNode, [{
	        key: "_render",
	        value: function _render() {
	            var _this2 = this;

	            var gl = this._gl;
	            var _this = this;
	            gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
	            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture, 0);
	            gl.clearColor(0, 0, 0, 0); // green;
	            gl.clear(gl.COLOR_BUFFER_BIT);

	            this.inputs.forEach(function (node) {
	                _get(Object.getPrototypeOf(CompositingNode.prototype), "_render", _this2).call(_this2);

	                //map the input textures input the node
	                var texture = node._texture;
	                var textureOffset = 0;

	                var _iteratorNormalCompletion = true;
	                var _didIteratorError = false;
	                var _iteratorError = undefined;

	                try {
	                    for (var _iterator = _this._inputTextureUnitMapping[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                        var mapping = _step.value;

	                        gl.activeTexture(mapping.textureUnit);
	                        var textureLocation = gl.getUniformLocation(_this._program, mapping.name);
	                        gl.uniform1i(textureLocation, _this._parameterTextureCount + textureOffset);
	                        textureOffset += 1;
	                        gl.bindTexture(gl.TEXTURE_2D, texture);
	                    }
	                } catch (err) {
	                    _didIteratorError = true;
	                    _iteratorError = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion && _iterator["return"]) {
	                            _iterator["return"]();
	                        }
	                    } finally {
	                        if (_didIteratorError) {
	                            throw _iteratorError;
	                        }
	                    }
	                }

	                gl.drawArrays(gl.TRIANGLES, 0, 6);
	            });

	            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	        }
	    }]);

	    return CompositingNode;
	})(_processingnode2["default"]);

	exports["default"] = CompositingNode;
	module.exports = exports["default"];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _effectnode = __webpack_require__(8);

	var _effectnode2 = _interopRequireDefault(_effectnode);

	var TransitionNode = (function (_EffectNode) {
	    _inherits(TransitionNode, _EffectNode);

	    function TransitionNode(gl, renderGraph, definition) {
	        _classCallCheck(this, TransitionNode);

	        _get(Object.getPrototypeOf(TransitionNode.prototype), "constructor", this).call(this, gl, renderGraph, definition);
	        this._transitions = {};

	        //save a version of the original property values
	        this._initialPropertyValues = {};
	        for (var propertyName in this._properties) {
	            this._initialPropertyValues[propertyName] = this._properties[propertyName].value;
	        }
	    }

	    _createClass(TransitionNode, [{
	        key: "_doesTransitionFitOnTimeline",
	        value: function _doesTransitionFitOnTimeline(testTransition) {
	            if (this._transitions[testTransition.property] === undefined) return true;
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = this._transitions[testTransition.property][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var transition = _step.value;

	                    if (testTransition.start > transition.start && testTransition.start < transition.end) return false;
	                    if (testTransition.end > transition.start && testTransition.end < transition.end) return false;
	                    if (transition.start > testTransition.start && transition.start < testTransition.end) return false;
	                    if (transition.end > testTransition.start && transition.end < testTransition.end) return false;
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator["return"]) {
	                        _iterator["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }

	            return true;
	        }
	    }, {
	        key: "_insertTransitionInTimeline",
	        value: function _insertTransitionInTimeline(transition) {
	            if (this._transitions[transition.property] === undefined) this._transitions[transition.property] = [];
	            this._transitions[transition.property].push(transition);

	            this._transitions[transition.property].sort(function (a, b) {
	                return a.start - b.start;
	            });
	        }
	    }, {
	        key: "transition",
	        value: function transition(startTime, endTime, targetValue) {
	            var propertyName = arguments.length <= 3 || arguments[3] === undefined ? "progress" : arguments[3];

	            var transition = { start: startTime + this._currentTime, end: endTime + this._currentTime, target: targetValue, property: propertyName };
	            if (!this._doesTransitionFitOnTimeline(transition)) return false;
	            this._insertTransitionInTimeline(transition);
	        }
	    }, {
	        key: "clearTransitions",
	        value: function clearTransitions(propertyName) {
	            if (propertyName === undefined) {
	                this._transitions = {};
	            } else {
	                this._transitions[propertyName] = [];
	            }
	        }
	    }, {
	        key: "_update",
	        value: function _update(currentTime) {
	            _get(Object.getPrototypeOf(TransitionNode.prototype), "_update", this).call(this, currentTime);
	            for (var propertyName in this._transitions) {
	                var value = this._initialPropertyValues[propertyName];
	                var transitionActive = false;

	                for (var i = 0; i < this._transitions[propertyName].length; i++) {
	                    var transition = this._transitions[propertyName][i];
	                    if (currentTime > transition.end) {
	                        value = transition.target;
	                        continue;
	                    }

	                    if (currentTime > transition.start && currentTime < transition.end) {
	                        var difference = transition.target - value;
	                        var progress = (this._currentTime - transition.start) / (transition.end - transition.start);
	                        transitionActive = true;
	                        this[propertyName] = value + difference * progress;
	                        break;
	                    }
	                }

	                if (!transitionActive) this[propertyName] = value;
	            }
	        }
	    }]);

	    return TransitionNode;
	})(_effectnode2["default"]);

	exports["default"] = TransitionNode;
	module.exports = exports["default"];

/***/ }
/******/ ]);