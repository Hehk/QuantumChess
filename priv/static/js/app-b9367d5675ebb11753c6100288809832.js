(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var _cmp = 'components/';
  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf(_cmp) === 0) {
        start = _cmp.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return _cmp + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var _reg = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (_reg.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
(function() {
    var global = window;
    var __shims = {assert: ({}),buffer: ({}),child_process: ({}),cluster: ({}),crypto: ({}),dgram: ({}),dns: ({}),events: ({}),fs: ({}),http: ({}),https: ({}),net: ({}),os: ({}),path: ({}),punycode: ({}),querystring: ({}),readline: ({}),repl: ({}),string_decoder: ({}),tls: ({}),tty: ({}),url: ({}),util: ({}),vm: ({}),zlib: ({}),process: ({"env":{}})};
    var process = __shims.process;

    var __makeRequire = function(r, __brmap) {
      return function(name) {
        if (__brmap[name] !== undefined) name = __brmap[name];
        name = name.replace(".js", "");
        return ["assert","buffer","child_process","cluster","crypto","dgram","dns","events","fs","http","https","net","os","path","punycode","querystring","readline","repl","string_decoder","tls","tty","url","util","vm","zlib","process"].indexOf(name) === -1 ? r(name) : __shims[name];
      }
    };
  require.register('phoenix', function(exports,req,module){
    var require = __makeRequire((function(n) { return req(n.replace('./', 'phoenix/')); }), {});
    (function(exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Phoenix Channels JavaScript client
//
// ## Socket Connection
//
// A single connection is established to the server and
// channels are mulitplexed over the connection.
// Connect to the server using the `Socket` class:
//
//     let socket = new Socket("/ws", {params: {userToken: "123"}})
//     socket.connect()
//
// The `Socket` constructor takes the mount point of the socket,
// the authentication params, as well as options that can be found in
// the Socket docs, such as configuring the `LongPoll` transport, and
// heartbeat.
//
// ## Channels
//
// Channels are isolated, concurrent processes on the server that
// subscribe to topics and broker events between the client and server.
// To join a channel, you must provide the topic, and channel params for
// authorization. Here's an example chat room example where `"new_msg"`
// events are listened for, messages are pushed to the server, and
// the channel is joined with ok/error/timeout matches:
//
//     let channel = socket.channel("rooms:123", {token: roomToken})
//     channel.on("new_msg", msg => console.log("Got message", msg) )
//     $input.onEnter( e => {
//       channel.push("new_msg", {body: e.target.val}, 10000)
//        .receive("ok", (msg) => console.log("created message", msg) )
//        .receive("error", (reasons) => console.log("create failed", reasons) )
//        .receive("timeout", () => console.log("Networking issue...") )
//     })
//     channel.join()
//       .receive("ok", ({messages}) => console.log("catching up", messages) )
//       .receive("error", ({reason}) => console.log("failed join", reason) )
//       .receive("timeout", () => console.log("Networking issue. Still waiting...") )
//
//
// ## Joining
//
// Creating a channel with `socket.channel(topic, params)`, binds the params to
// `channel.params`, which are sent up on `channel.join()`.
// Subsequent rejoins will send up the modified params for
// updating authorization params, or passing up last_message_id information.
// Successful joins receive an "ok" status, while unsuccessful joins
// receive "error".
//
//
// ## Pushing Messages
//
// From the previous example, we can see that pushing messages to the server
// can be done with `channel.push(eventName, payload)` and we can optionally
// receive responses from the push. Additionally, we can use
// `receive("timeout", callback)` to abort waiting for our other `receive` hooks
//  and take action after some period of waiting. The default timeout is 5000ms.
//
//
// ## Socket Hooks
//
// Lifecycle events of the multiplexed connection can be hooked into via
// `socket.onError()` and `socket.onClose()` events, ie:
//
//     socket.onError( () => console.log("there was an error with the connection!") )
//     socket.onClose( () => console.log("the connection dropped") )
//
//
// ## Channel Hooks
//
// For each joined channel, you can bind to `onError` and `onClose` events
// to monitor the channel lifecycle, ie:
//
//     channel.onError( () => console.log("there was an error!") )
//     channel.onClose( () => console.log("the channel has gone away gracefully") )
//
// ### onError hooks
//
// `onError` hooks are invoked if the socket connection drops, or the channel
// crashes on the server. In either case, a channel rejoin is attemtped
// automatically in an exponential backoff manner.
//
// ### onClose hooks
//
// `onClose` hooks are invoked only in two cases. 1) the channel explicitly
// closed on the server, or 2). The client explicitly closed, by calling
// `channel.leave()`
//

var VSN = "1.0.0";
var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
var DEFAULT_TIMEOUT = 10000;
var CHANNEL_STATES = {
  closed: "closed",
  errored: "errored",
  joined: "joined",
  joining: "joining"
};
var CHANNEL_EVENTS = {
  close: "phx_close",
  error: "phx_error",
  join: "phx_join",
  reply: "phx_reply",
  leave: "phx_leave"
};
var TRANSPORTS = {
  longpoll: "longpoll",
  websocket: "websocket"
};

var Push = function () {

  // Initializes the Push
  //
  // channel - The Channel
  // event - The event, for example `"phx_join"`
  // payload - The payload, for example `{user_id: 123}`
  // timeout - The push timeout in milliseconds
  //

  function Push(channel, event, payload, timeout) {
    _classCallCheck(this, Push);

    this.channel = channel;
    this.event = event;
    this.payload = payload || {};
    this.receivedResp = null;
    this.timeout = timeout;
    this.timeoutTimer = null;
    this.recHooks = [];
    this.sent = false;
  }

  _createClass(Push, [{
    key: "resend",
    value: function resend(timeout) {
      this.timeout = timeout;
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
      this.send();
    }
  }, {
    key: "send",
    value: function send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload,
        ref: this.ref
      });
    }
  }, {
    key: "receive",
    value: function receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }

      this.recHooks.push({ status: status, callback: callback });
      return this;
    }

    // private

  }, {
    key: "matchReceive",
    value: function matchReceive(_ref) {
      var status = _ref.status;
      var response = _ref.response;
      var ref = _ref.ref;

      this.recHooks.filter(function (h) {
        return h.status === status;
      }).forEach(function (h) {
        return h.callback(response);
      });
    }
  }, {
    key: "cancelRefEvent",
    value: function cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
  }, {
    key: "cancelTimeout",
    value: function cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
  }, {
    key: "startTimeout",
    value: function startTimeout() {
      var _this = this;

      if (this.timeoutTimer) {
        return;
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);

      this.channel.on(this.refEvent, function (payload) {
        _this.cancelRefEvent();
        _this.cancelTimeout();
        _this.receivedResp = payload;
        _this.matchReceive(payload);
      });

      this.timeoutTimer = setTimeout(function () {
        _this.trigger("timeout", {});
      }, this.timeout);
    }
  }, {
    key: "hasReceived",
    value: function hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
  }, {
    key: "trigger",
    value: function trigger(status, response) {
      this.channel.trigger(this.refEvent, { status: status, response: response });
    }
  }]);

  return Push;
}();

var Channel = exports.Channel = function () {
  function Channel(topic, params, socket) {
    var _this2 = this;

    _classCallCheck(this, Channel);

    this.state = CHANNEL_STATES.closed;
    this.topic = topic;
    this.params = params || {};
    this.socket = socket;
    this.bindings = [];
    this.timeout = this.socket.timeout;
    this.joinedOnce = false;
    this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
    this.pushBuffer = [];
    this.rejoinTimer = new Timer(function () {
      return _this2.rejoinUntilConnected();
    }, this.socket.reconnectAfterMs);
    this.joinPush.receive("ok", function () {
      _this2.state = CHANNEL_STATES.joined;
      _this2.rejoinTimer.reset();
      _this2.pushBuffer.forEach(function (pushEvent) {
        return pushEvent.send();
      });
      _this2.pushBuffer = [];
    });
    this.onClose(function () {
      _this2.socket.log("channel", "close " + _this2.topic);
      _this2.state = CHANNEL_STATES.closed;
      _this2.socket.remove(_this2);
    });
    this.onError(function (reason) {
      _this2.socket.log("channel", "error " + _this2.topic, reason);
      _this2.state = CHANNEL_STATES.errored;
      _this2.rejoinTimer.scheduleTimeout();
    });
    this.joinPush.receive("timeout", function () {
      if (_this2.state !== CHANNEL_STATES.joining) {
        return;
      }

      _this2.socket.log("channel", "timeout " + _this2.topic, _this2.joinPush.timeout);
      _this2.state = CHANNEL_STATES.errored;
      _this2.rejoinTimer.scheduleTimeout();
    });
    this.on(CHANNEL_EVENTS.reply, function (payload, ref) {
      _this2.trigger(_this2.replyEventName(ref), payload);
    });
  }

  _createClass(Channel, [{
    key: "rejoinUntilConnected",
    value: function rejoinUntilConnected() {
      this.rejoinTimer.scheduleTimeout();
      if (this.socket.isConnected()) {
        this.rejoin();
      }
    }
  }, {
    key: "join",
    value: function join() {
      var timeout = arguments.length <= 0 || arguments[0] === undefined ? this.timeout : arguments[0];

      if (this.joinedOnce) {
        throw "tried to join multiple times. 'join' can only be called a single time per channel instance";
      } else {
        this.joinedOnce = true;
      }
      this.rejoin(timeout);
      return this.joinPush;
    }
  }, {
    key: "onClose",
    value: function onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
  }, {
    key: "onError",
    value: function onError(callback) {
      this.on(CHANNEL_EVENTS.error, function (reason) {
        return callback(reason);
      });
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      this.bindings.push({ event: event, callback: callback });
    }
  }, {
    key: "off",
    value: function off(event) {
      this.bindings = this.bindings.filter(function (bind) {
        return bind.event !== event;
      });
    }
  }, {
    key: "canPush",
    value: function canPush() {
      return this.socket.isConnected() && this.state === CHANNEL_STATES.joined;
    }
  }, {
    key: "push",
    value: function push(event, payload) {
      var timeout = arguments.length <= 2 || arguments[2] === undefined ? this.timeout : arguments[2];

      if (!this.joinedOnce) {
        throw "tried to push '" + event + "' to '" + this.topic + "' before joining. Use channel.join() before pushing events";
      }
      var pushEvent = new Push(this, event, payload, timeout);
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }

      return pushEvent;
    }

    // Leaves the channel
    //
    // Unsubscribes from server events, and
    // instructs channel to terminate on server
    //
    // Triggers onClose() hooks
    //
    // To receive leave acknowledgements, use the a `receive`
    // hook to bind to the server ack, ie:
    //
    //     channel.leave().receive("ok", () => alert("left!") )
    //

  }, {
    key: "leave",
    value: function leave() {
      var _this3 = this;

      var timeout = arguments.length <= 0 || arguments[0] === undefined ? this.timeout : arguments[0];

      var onClose = function onClose() {
        _this3.socket.log("channel", "leave " + _this3.topic);
        _this3.trigger(CHANNEL_EVENTS.close, "leave");
      };
      var leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
      leavePush.receive("ok", function () {
        return onClose();
      }).receive("timeout", function () {
        return onClose();
      });
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }

      return leavePush;
    }

    // Overridable message hook
    //
    // Receives all events for specialized message handling

  }, {
    key: "onMessage",
    value: function onMessage(event, payload, ref) {}

    // private

  }, {
    key: "isMember",
    value: function isMember(topic) {
      return this.topic === topic;
    }
  }, {
    key: "sendJoin",
    value: function sendJoin(timeout) {
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
  }, {
    key: "rejoin",
    value: function rejoin() {
      var timeout = arguments.length <= 0 || arguments[0] === undefined ? this.timeout : arguments[0];
      this.sendJoin(timeout);
    }
  }, {
    key: "trigger",
    value: function trigger(triggerEvent, payload, ref) {
      this.onMessage(triggerEvent, payload, ref);
      this.bindings.filter(function (bind) {
        return bind.event === triggerEvent;
      }).map(function (bind) {
        return bind.callback(payload, ref);
      });
    }
  }, {
    key: "replyEventName",
    value: function replyEventName(ref) {
      return "chan_reply_" + ref;
    }
  }]);

  return Channel;
}();

var Socket = exports.Socket = function () {

  // Initializes the Socket
  //
  // endPoint - The string WebSocket endpoint, ie, "ws://example.com/ws",
  //                                               "wss://example.com"
  //                                               "/ws" (inherited host & protocol)
  // opts - Optional configuration
  //   transport - The Websocket Transport, for example WebSocket or Phoenix.LongPoll.
  //               Defaults to WebSocket with automatic LongPoll fallback.
  //   timeout - The default timeout in milliseconds to trigger push timeouts.
  //             Defaults `DEFAULT_TIMEOUT`
  //   heartbeatIntervalMs - The millisec interval to send a heartbeat message
  //   reconnectAfterMs - The optional function that returns the millsec
  //                      reconnect interval. Defaults to stepped backoff of:
  //
  //     function(tries){
  //       return [1000, 5000, 10000][tries - 1] || 10000
  //     }
  //
  //   logger - The optional function for specialized logging, ie:
  //     `logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
  //
  //   longpollerTimeout - The maximum timeout of a long poll AJAX request.
  //                        Defaults to 20s (double the server long poll timer).
  //
  //   params - The optional params to pass when connecting
  //
  // For IE8 support use an ES5-shim (https://github.com/es-shims/es5-shim)
  //

  function Socket(endPoint) {
    var _this4 = this;

    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Socket);

    this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
    this.channels = [];
    this.sendBuffer = [];
    this.ref = 0;
    this.timeout = opts.timeout || DEFAULT_TIMEOUT;
    this.transport = opts.transport || window.WebSocket || LongPoll;
    this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 30000;
    this.reconnectAfterMs = opts.reconnectAfterMs || function (tries) {
      return [1000, 2000, 5000, 10000][tries - 1] || 10000;
    };
    this.logger = opts.logger || function () {}; // noop
    this.longpollerTimeout = opts.longpollerTimeout || 20000;
    this.params = opts.params || {};
    this.endPoint = endPoint + "/" + TRANSPORTS.websocket;
    this.reconnectTimer = new Timer(function () {
      _this4.disconnect(function () {
        return _this4.connect();
      });
    }, this.reconnectAfterMs);
  }

  _createClass(Socket, [{
    key: "protocol",
    value: function protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
  }, {
    key: "endPointURL",
    value: function endPointURL() {
      var uri = Ajax.appendParams(Ajax.appendParams(this.endPoint, this.params), { vsn: VSN });
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return this.protocol() + ":" + uri;
      }

      return this.protocol() + "://" + location.host + uri;
    }
  }, {
    key: "disconnect",
    value: function disconnect(callback, code, reason) {
      if (this.conn) {
        this.conn.onclose = function () {}; // noop
        if (code) {
          this.conn.close(code, reason || "");
        } else {
          this.conn.close();
        }
        this.conn = null;
      }
      callback && callback();
    }

    // params - The params to send when connecting, for example `{user_id: userToken}`

  }, {
    key: "connect",
    value: function connect(params) {
      var _this5 = this;

      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = params;
      }
      if (this.conn) {
        return;
      }

      this.conn = new this.transport(this.endPointURL());
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = function () {
        return _this5.onConnOpen();
      };
      this.conn.onerror = function (error) {
        return _this5.onConnError(error);
      };
      this.conn.onmessage = function (event) {
        return _this5.onConnMessage(event);
      };
      this.conn.onclose = function (event) {
        return _this5.onConnClose(event);
      };
    }

    // Logs the message. Override `this.logger` for specialized logging. noops by default

  }, {
    key: "log",
    value: function log(kind, msg, data) {
      this.logger(kind, msg, data);
    }

    // Registers callbacks for connection state change events
    //
    // Examples
    //
    //    socket.onError(function(error){ alert("An error occurred") })
    //

  }, {
    key: "onOpen",
    value: function onOpen(callback) {
      this.stateChangeCallbacks.open.push(callback);
    }
  }, {
    key: "onClose",
    value: function onClose(callback) {
      this.stateChangeCallbacks.close.push(callback);
    }
  }, {
    key: "onError",
    value: function onError(callback) {
      this.stateChangeCallbacks.error.push(callback);
    }
  }, {
    key: "onMessage",
    value: function onMessage(callback) {
      this.stateChangeCallbacks.message.push(callback);
    }
  }, {
    key: "onConnOpen",
    value: function onConnOpen() {
      var _this6 = this;

      this.log("transport", "connected to " + this.endPointURL(), this.transport.prototype);
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      if (!this.conn.skipHeartbeat) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(function () {
          return _this6.sendHeartbeat();
        }, this.heartbeatIntervalMs);
      }
      this.stateChangeCallbacks.open.forEach(function (callback) {
        return callback();
      });
    }
  }, {
    key: "onConnClose",
    value: function onConnClose(event) {
      this.log("transport", "close", event);
      this.triggerChanError();
      clearInterval(this.heartbeatTimer);
      this.reconnectTimer.scheduleTimeout();
      this.stateChangeCallbacks.close.forEach(function (callback) {
        return callback(event);
      });
    }
  }, {
    key: "onConnError",
    value: function onConnError(error) {
      this.log("transport", error);
      this.triggerChanError();
      this.stateChangeCallbacks.error.forEach(function (callback) {
        return callback(error);
      });
    }
  }, {
    key: "triggerChanError",
    value: function triggerChanError() {
      this.channels.forEach(function (channel) {
        return channel.trigger(CHANNEL_EVENTS.error);
      });
    }
  }, {
    key: "connectionState",
    value: function connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
  }, {
    key: "isConnected",
    value: function isConnected() {
      return this.connectionState() === "open";
    }
  }, {
    key: "remove",
    value: function remove(channel) {
      this.channels = this.channels.filter(function (c) {
        return !c.isMember(channel.topic);
      });
    }
  }, {
    key: "channel",
    value: function channel(topic) {
      var chanParams = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
  }, {
    key: "push",
    value: function push(data) {
      var _this7 = this;

      var topic = data.topic;
      var event = data.event;
      var payload = data.payload;
      var ref = data.ref;

      var callback = function callback() {
        return _this7.conn.send(JSON.stringify(data));
      };
      this.log("push", topic + " " + event + " (" + ref + ")", payload);
      if (this.isConnected()) {
        callback();
      } else {
        this.sendBuffer.push(callback);
      }
    }

    // Return the next message ref, accounting for overflows

  }, {
    key: "makeRef",
    value: function makeRef() {
      var newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }

      return this.ref.toString();
    }
  }, {
    key: "sendHeartbeat",
    value: function sendHeartbeat() {
      if (!this.isConnected()) {
        return;
      }
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.makeRef() });
    }
  }, {
    key: "flushSendBuffer",
    value: function flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach(function (callback) {
          return callback();
        });
        this.sendBuffer = [];
      }
    }
  }, {
    key: "onConnMessage",
    value: function onConnMessage(rawMessage) {
      var msg = JSON.parse(rawMessage.data);
      var topic = msg.topic;
      var event = msg.event;
      var payload = msg.payload;
      var ref = msg.ref;

      this.log("receive", (payload.status || "") + " " + topic + " " + event + " " + (ref && "(" + ref + ")" || ""), payload);
      this.channels.filter(function (channel) {
        return channel.isMember(topic);
      }).forEach(function (channel) {
        return channel.trigger(event, payload, ref);
      });
      this.stateChangeCallbacks.message.forEach(function (callback) {
        return callback(msg);
      });
    }
  }]);

  return Socket;
}();

var LongPoll = exports.LongPoll = function () {
  function LongPoll(endPoint) {
    _classCallCheck(this, LongPoll);

    this.endPoint = null;
    this.token = null;
    this.skipHeartbeat = true;
    this.onopen = function () {}; // noop
    this.onerror = function () {}; // noop
    this.onmessage = function () {}; // noop
    this.onclose = function () {}; // noop
    this.pollEndpoint = this.normalizeEndpoint(endPoint);
    this.readyState = SOCKET_STATES.connecting;

    this.poll();
  }

  _createClass(LongPoll, [{
    key: "normalizeEndpoint",
    value: function normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)\/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
  }, {
    key: "endpointURL",
    value: function endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
  }, {
    key: "closeAndRetry",
    value: function closeAndRetry() {
      this.close();
      this.readyState = SOCKET_STATES.connecting;
    }
  }, {
    key: "ontimeout",
    value: function ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry();
    }
  }, {
    key: "poll",
    value: function poll() {
      var _this8 = this;

      if (!(this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting)) {
        return;
      }

      Ajax.request("GET", this.endpointURL(), "application/json", null, this.timeout, this.ontimeout.bind(this), function (resp) {
        if (resp) {
          var status = resp.status;
          var token = resp.token;
          var messages = resp.messages;

          _this8.token = token;
        } else {
          var status = 0;
        }

        switch (status) {
          case 200:
            messages.forEach(function (msg) {
              return _this8.onmessage({ data: JSON.stringify(msg) });
            });
            _this8.poll();
            break;
          case 204:
            _this8.poll();
            break;
          case 410:
            _this8.readyState = SOCKET_STATES.open;
            _this8.onopen();
            _this8.poll();
            break;
          case 0:
          case 500:
            _this8.onerror();
            _this8.closeAndRetry();
            break;
          default:
            throw "unhandled poll status " + status;
        }
      });
    }
  }, {
    key: "send",
    value: function send(body) {
      var _this9 = this;

      Ajax.request("POST", this.endpointURL(), "application/json", body, this.timeout, this.onerror.bind(this, "timeout"), function (resp) {
        if (!resp || resp.status !== 200) {
          _this9.onerror(status);
          _this9.closeAndRetry();
        }
      });
    }
  }, {
    key: "close",
    value: function close(code, reason) {
      this.readyState = SOCKET_STATES.closed;
      this.onclose();
    }
  }]);

  return LongPoll;
}();

var Ajax = exports.Ajax = function () {
  function Ajax() {
    _classCallCheck(this, Ajax);
  }

  _createClass(Ajax, null, [{
    key: "request",
    value: function request(method, endPoint, accept, body, timeout, ontimeout, callback) {
      if (window.XDomainRequest) {
        var req = new XDomainRequest(); // IE8, IE9
        this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else {
        var req = window.XMLHttpRequest ? new XMLHttpRequest() : // IE7+, Firefox, Chrome, Opera, Safari
        new ActiveXObject("Microsoft.XMLHTTP"); // IE6, IE5
        this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
      }
    }
  }, {
    key: "xdomainRequest",
    value: function xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
      var _this10 = this;

      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = function () {
        var response = _this10.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }

      // Work around bug in IE9 that requires an attached onprogress handler
      req.onprogress = function () {};

      req.send(body);
    }
  }, {
    key: "xhrRequest",
    value: function xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
      var _this11 = this;

      req.timeout = timeout;
      req.open(method, endPoint, true);
      req.setRequestHeader("Content-Type", accept);
      req.onerror = function () {
        callback && callback(null);
      };
      req.onreadystatechange = function () {
        if (req.readyState === _this11.states.complete && callback) {
          var response = _this11.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }

      req.send(body);
    }
  }, {
    key: "parseJSON",
    value: function parseJSON(resp) {
      return resp && resp !== "" ? JSON.parse(resp) : null;
    }
  }, {
    key: "serialize",
    value: function serialize(obj, parentKey) {
      var queryStr = [];
      for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
          continue;
        }
        var paramKey = parentKey ? parentKey + "[" + key + "]" : key;
        var paramVal = obj[key];
        if ((typeof paramVal === "undefined" ? "undefined" : _typeof(paramVal)) === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
        }
      }
      return queryStr.join("&");
    }
  }, {
    key: "appendParams",
    value: function appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }

      var prefix = url.match(/\?/) ? "&" : "?";
      return "" + url + prefix + this.serialize(params);
    }
  }]);

  return Ajax;
}();

Ajax.states = { complete: 4 };

// Creates a timer that accepts a `timerCalc` function to perform
// calculated timeout retries, such as exponential backoff.
//
// ## Examples
//
//    let reconnectTimer = new Timer(() => this.connect(), function(tries){
//      return [1000, 5000, 10000][tries - 1] || 10000
//    })
//    reconnectTimer.scheduleTimeout() // fires after 1000
//    reconnectTimer.scheduleTimeout() // fires after 5000
//    reconnectTimer.reset()
//    reconnectTimer.scheduleTimeout() // fires after 1000
//

var Timer = function () {
  function Timer(callback, timerCalc) {
    _classCallCheck(this, Timer);

    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = null;
    this.tries = 0;
  }

  _createClass(Timer, [{
    key: "reset",
    value: function reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }

    // Cancels any previous scheduleTimeout and schedules callback

  }, {
    key: "scheduleTimeout",
    value: function scheduleTimeout() {
      var _this12 = this;

      clearTimeout(this.timer);

      this.timer = setTimeout(function () {
        _this12.tries = _this12.tries + 1;
        _this12.callback();
      }, this.timerCalc(this.tries + 1));
    }
  }]);

  return Timer;
}();


})(typeof(exports) === "undefined" ? window.Phoenix = window.Phoenix || {} : exports);

  });
require.register('phoenix_html', function(exports,req,module){
    var require = __makeRequire((function(n) { return req(n.replace('./', 'phoenix_html/')); }), {});
    'use strict';

// Although ^=parent is not technically correct,
// we need to use it in order to get IE8 support.
var elements = document.querySelectorAll('[data-submit^=parent]');
var len = elements.length;

for (var i = 0; i < len; ++i) {
  elements[i].addEventListener('click', function (event) {
    var message = this.getAttribute("data-confirm");
    if (message === null || confirm(message)) {
      this.parentNode.submit();
    };
    event.preventDefault();
    return false;
  }, false);
}

;
  });
})();require.register("web/static/js/app", function(exports, require, module) {
"use strict";

require("phoenix_html");

var _socket = require("./socket");

var _socket2 = _interopRequireDefault(_socket);

var _board = require("./components/board");

var _board2 = _interopRequireDefault(_board);

var _user = require("./components/user");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".


function initList(id) {
  $('#' + id + '_search').on('click', function (event) {
    event.target.classList.toggle('open');
    $('#' + id + '_search_input').toggleClass('open').val("");
  });

  $('#' + id + '_search_input').on('input', function (event) {
    var filterTerm = event.target.value.trim();

    $('#' + id + ' > .list-item').each(function (_index, elem) {
      var target = $(elem);
      if (target.find('.title').text().toLowerCase().indexOf(filterTerm) != -1) {
        target.addClass('open').removeClass('close');
      } else {
        target.addClass('close').removeClass('open');
      }
    });
  });
}

//Board.init(socket, $('.player'));


// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

window.onload = function () {
  if (window.userToken !== "") {
    _socket2.default.connect();

    var isGame = /(\/game\?=)(\S*)/g.exec(document.location.href);
    if (isGame !== null) {
      _board2.default.init(_socket2.default, isGame[2]);
    }

    initList('active_players');
    initList('active_games');

    _user2.default.init(_socket2.default);
  }
};
});

;require.register("web/static/js/components/board", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _pop_ups = require('./pop_ups');

var _pop_ups2 = _interopRequireDefault(_pop_ups);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var board = function () {
  // private
  var selectedPos = null;
  var chessBoard = null;
  var channel = null;

  var boardPlayers = [];

  function _initTiles(tiles) {
    // stores the values of all tiles on the board is a temporary solution to the user
    // being able to simply recolor the pieces and move any they wish
    var tileValues = tiles.map(function (index, elem) {
      return {
        piece: elem.innerText,
        color: elem.getAttribute('color')
      };
    });

    var activePlayer = '';
    var boardLocked = false;
    var player1 = '';
    var player2 = '';

    /**
     * Converts an index into an object with x and y cordinates of the element on the
     * chessBoard. Makes for some of the validation math to be easier.
     *
     * @param  {Number} index :Number from 0-63
     * @return {Object}       :Object with x and y params
     */
    function _getPosition(index) {
      return {
        y: Math.floor(index / 8),
        x: index % 8
      };
    }

    /**
     * Validates a knight move
     *
     * @param  {Number} oldIndex :Number from 0-63
     * @param  {Number} newIndex :Number from 0-63
     * @return {Boolean}         :If move is valid
     */
    function _validateKnighMove(oldIndex, newIndex) {
      var oldPos = _getPosition(oldIndex);
      var newPos = _getPosition(newIndex);
      var verMove = Math.abs(oldPos.y - newPos.y);
      var horMove = Math.abs(oldPos.x - newPos.x);

      return newIndex >= 0 && newIndex < 64 && (horMove === 2 && verMove === 1 || horMove === 1 && verMove === 2);
    }

    /**
     * simulates a knight move and marks the end position if the move would be valid
     *
     * @param  {Number} index  :Number from 0-63
     * @param  {String} color  :Color of the piece being moved
     * @param  {Number} change :Delta of index in the move
     * @return {Null}
     */
    function _moveKnightToBlock(index, color, change) {
      var newIndex = index + change;

      if (_validateKnighMove(index, newIndex)) {
        _makeMove(newIndex, color);
      }
    }

    /**
     * Validates any linear move. Basically the way every piece except for knights move.
     *
     * @param  {Number}  oldIndex   :Start position of the piece
     * @param  {Number}  newIndex   :End position of piece
     * @param  {Boolean} horizontal :If the move is horizontal or not
     * @return {Boolean}            :If the move is valid
     */
    function _validateLinearMove(oldIndex, newIndex, horizontal) {
      var oldPos = _getPosition(oldIndex);
      var newPos = _getPosition(newIndex);

      return(
        // within bounds of the board
        newIndex >= 0 && newIndex < 64 && (
        // did no skip to the other side of the board
        horizontal === false && oldPos.y === newPos.y && Math.abs(oldPos.x - newPos.x) === Math.abs(8 - Math.abs(newIndex - oldIndex)) || horizontal === false && Math.abs(oldPos.y - newPos.y) < 2 && Math.abs(oldPos.y - newPos.y) > 0 || horizontal === true && oldPos.y === newPos.y || horizontal === true && oldPos.x === newPos.x)
      );
    }

    /**
     * Coats all the positions not considered valid with an invalid class
     *
     * @return {Null}
     */
    function _makeRestInvalid() {
      tiles.each(function (_index, tile) {
        if ((tile.classList.contains('valid') || tile.classList.contains('active')) === false) {
          tile.classList.add('invalid');
        }
      });
    }

    /**
     * Removes all the classes used to classify positions for a piece move
     *
     * @return {Null}
     */
    function _clearBoard() {
      selectedPos = null;
      tiles.each(function (_index, tile) {
        tile.classList.remove('valid');
        tile.classList.remove('invalid');
        tile.classList.remove('active');
      });
    }

    function _clearOppTarget() {
      tiles.each(function (_index, tile) {
        tile.classList.remove('opp-active');
      });
    }

    /**
     * Coats the end position of a move with class depending if the position if empty
     * or of the same color
     *
     * @param  {Number}    index      :Start position of the piece
     * @param  {String}    color      :Color of the piece
     * @param  {Number}    change     :Delta of index in move, for callback
     * @param  {Boolean}   horizontal :If the move is horizontal, for callback
     * @param  {Function}  callback   :Function called if the end position is empty
     * @return {Null}
     */
    function _makeMove(index, color, change, horizontal, callback) {
      var tile = tiles[index];

      if (tile.getAttribute('type') === 'empty') {
        tile.classList.add('valid');
        if (typeof callback === 'function') {
          callback(index, color, change, horizontal);
        }
      } else if (tile.getAttribute('color') !== color) {
        tile.classList.add('valid');
        tile.classList.add('target');
      }
    }

    /**
     * Move a piece linearly only a single block
     *
     * @param  {Number}    index      :Start position of the piece
     * @param  {String}    color      :Color of the piece
     * @param  {Number}    change     :Delta of index in move
     * @param  {Boolean}   horizontal :If the move is horizontal
     * @return {Null}
     */
    function _moveLinearlySingleBlock(index, color, change, horizontal) {
      var newIndex = index + change;

      if (_validateLinearMove(index, newIndex, horizontal)) {
        _makeMove(newIndex, color);
      }
    }

    /**
     * Move a piece linearly until a barrier is hit
     *
     * @param  {Number}    index      :Start position of the piece
     * @param  {String}    color      :Color of the piece
     * @param  {Number}    change     :Delta of index in move
     * @param  {Boolean}   horizontal :If the move is horizontal
     * @return {Null}
     */
    function _moveLinearlyUntilBlocked(index, color, change, horizontal) {
      var newIndex = index + change;

      if (_validateLinearMove(index, newIndex, horizontal)) {
        _makeMove(newIndex, color, change, horizontal, _moveLinearlyUntilBlocked);
      }
    }

    /**
     * Shows the possible moves of this rook
     *
     * @param  {Number} pos   :Position of the rook
     * @param  {String} color :Color of the rook
     * @return {Null}
     */
    function _rookClicked(pos, color) {
      tiles[pos].classList.add('active');

      // down
      _moveLinearlyUntilBlocked(pos, color, 8, true);
      // up
      _moveLinearlyUntilBlocked(pos, color, -8, true);
      // left
      _moveLinearlyUntilBlocked(pos, color, 1, true);
      // right
      _moveLinearlyUntilBlocked(pos, color, -1, true);

      // reds out the board
      _makeRestInvalid();
    }

    /**
     * Shows the possible moves of this bishop
     *
     * @param  {Number} pos   :Position of the bishop
     * @param  {String} color :Color of the bishop
     * @return {Null}
     */
    function _bishopClicked(pos, color) {
      tiles[pos].classList.add('active');

      // up left
      _moveLinearlyUntilBlocked(pos, color, -9, false);
      // up right
      _moveLinearlyUntilBlocked(pos, color, -7, false);
      // down left
      _moveLinearlyUntilBlocked(pos, color, 7, false);
      // down right
      _moveLinearlyUntilBlocked(pos, color, 9, false);

      // reds out the board
      _makeRestInvalid();
    }

    /**
     * Shows the possible moves of this queen
     *
     * @param  {Number} pos   :Position of the queen
     * @param  {String} color :Color of the queen
     * @return {Null}
     */
    function _queenClicked(pos, color) {
      tiles[pos].classList.add('active');

      // down
      _moveLinearlyUntilBlocked(pos, color, 8, true);
      // up
      _moveLinearlyUntilBlocked(pos, color, -8, true);
      // left
      _moveLinearlyUntilBlocked(pos, color, 1, true);
      // right
      _moveLinearlyUntilBlocked(pos, color, -1, true);

      // up left
      _moveLinearlyUntilBlocked(pos, color, -9, false);
      // up right
      _moveLinearlyUntilBlocked(pos, color, -7, false);
      // down left
      _moveLinearlyUntilBlocked(pos, color, 7, false);
      // down right
      _moveLinearlyUntilBlocked(pos, color, 9, false);

      // reds out the board
      _makeRestInvalid();
    }

    /**
     * Shows the possible moves of this king
     *
     * @param  {Number} pos   :Position of the king
     * @param  {String} color :Color of the king
     * @return {Null}
     */
    function _kingClicked(pos, color) {
      tiles[pos].classList.add('active');

      // down
      _moveLinearlySingleBlock(pos, color, 8, true);
      // up
      _moveLinearlySingleBlock(pos, color, -8, true);
      // left
      _moveLinearlySingleBlock(pos, color, 1, true);
      // right
      _moveLinearlySingleBlock(pos, color, -1, true);

      // up left
      _moveLinearlySingleBlock(pos, color, -9, false);
      // up right
      _moveLinearlySingleBlock(pos, color, -7, false);
      // down left
      _moveLinearlySingleBlock(pos, color, 7, false);
      // down right
      _moveLinearlySingleBlock(pos, color, 9, false);

      // reds out the board
      _makeRestInvalid();
    }

    /**
     * Shows the possible moves of this knight
     *
     * @param  {Number} pos   :Position of the knight
     * @param  {String} color :Color of the knight
     * @return {Null}
     */
    function _knightClicked(pos, color) {
      tiles[pos].classList.add('active');

      // up left
      _moveKnightToBlock(pos, color, -17, true);
      // up right
      _moveKnightToBlock(pos, color, -15, true);
      // right up
      _moveKnightToBlock(pos, color, -6, true);
      // right down
      _moveKnightToBlock(pos, color, 10, true);
      // down left
      _moveKnightToBlock(pos, color, 17, true);
      // down right
      _moveKnightToBlock(pos, color, 15, true);
      // left down
      _moveKnightToBlock(pos, color, 6, true);
      // left up
      _moveKnightToBlock(pos, color, -10, true);

      // reds out the board
      _makeRestInvalid();
    }

    /**
     * Shows the possible moves of this pawn
     *
     * @param  {Number} pos   :Position of the pawn
     * @param  {String} color :Color of the pawn
     * @return {Null}
     */
    function _pawnClicked(pos, color) {
      tiles[pos].classList.add('active');

      if (color === '0') {
        // down
        var tileDown = tiles[pos + 8];
        if ((typeof tileDown === 'undefined' ? 'undefined' : _typeof(tileDown)) === 'object' && tileDown.getAttribute('type') === 'empty') {
          _moveLinearlySingleBlock(pos, color, 8, true);

          var tileDoubleDown = tiles[pos + 16];
          if (_getPosition(pos).y === 1 && (typeof tileDoubleDown === 'undefined' ? 'undefined' : _typeof(tileDoubleDown)) === 'object' && tileDoubleDown.getAttribute('type') === 'empty') {
            _moveLinearlySingleBlock(pos, color, 16, true);
          }
        }

        var tileDownLeft = tiles[pos + 7];
        if ((typeof tileDownLeft === 'undefined' ? 'undefined' : _typeof(tileDownLeft)) === 'object' && tileDownLeft.getAttribute('type') !== 'empty') {
          _moveLinearlySingleBlock(pos, color, 7, false);
        }
        var tileDownRight = tiles[pos + 9];
        if ((typeof tileDownRight === 'undefined' ? 'undefined' : _typeof(tileDownRight)) === 'object' && tileDownRight.getAttribute('type') !== 'empty') {
          _moveLinearlySingleBlock(pos, color, 9, false);
        }
      } else {
        // up
        var tileUp = tiles[pos - 8];
        if ((typeof tileUp === 'undefined' ? 'undefined' : _typeof(tileUp)) === 'object' && tileUp.getAttribute('type') === 'empty') {
          _moveLinearlySingleBlock(pos, color, -8, true);

          var tileDoubleUp = tiles[pos - 16];
          if (_getPosition(pos).y === 6 && (typeof tileDoubleUp === 'undefined' ? 'undefined' : _typeof(tileDoubleUp)) === 'object' && tileDoubleUp.getAttribute('type') === 'empty') {
            _moveLinearlySingleBlock(pos, color, -16, true);
          }
        }

        var tileUpLeft = tiles[pos - 9];
        if ((typeof tileUpLeft === 'undefined' ? 'undefined' : _typeof(tileUpLeft)) === 'object' && tileUpLeft.getAttribute('type') !== 'empty') {
          _moveLinearlySingleBlock(pos, color, -9, false);
        }
        var tileUpRight = tiles[pos - 7];
        if ((typeof tileUpRight === 'undefined' ? 'undefined' : _typeof(tileUpRight)) === 'object' && tileUpRight.getAttribute('type') !== 'empty') {
          _moveLinearlySingleBlock(pos, color, -7, false);
        }
      }

      // reds out the board
      _makeRestInvalid();
    }

    /**
     * Clears out the contents of a tile
     *
     * @param  {Number} index :Position of the tile
     * @return {Null}
     */
    function _clearTile(index) {
      $(tiles[index]).removeClass().addClass('tile').addClass('color-1').text(' ').attr('type', 'empty').attr('color', '1');
    }

    /**
     * Transfers the content of one position to another
     *
     * @param  {Number} startPos :Transfer from position
     * @param  {Number} endPos   :Transfer to position
     * @return {Null}
     */
    function _transferTile(startPos, endPos) {
      var oldTile = tiles[startPos];
      var newTile = tiles[endPos];
      var startTileValue = tileValues[startPos];
      var vals = {
        type: oldTile.getAttribute('type'),
        color: oldTile.getAttribute('color')
      };

      // moves the tile on the board
      $(newTile).removeClass().addClass('tile').addClass('color-' + vals.color).addClass(_getTypeClass(vals.type)).addClass(oldTile.classList.contains('rotate') ? 'rotate' : '').attr('type', vals.type).attr('color', vals.color);

      _clearTile(startPos);

      // moves the tile in the value array
      tileValues[endPos] = {
        color: startTileValue.color,
        piece: startTileValue.piece
      };
      tileValues[startPos] = {
        color: '0',
        piece: ''
      };
    }

    function _getTypeClass(type) {
      switch (type) {
        case 'p':
          return 'pawn';
        case 'r':
          return 'rook';
        case 'n':
          return 'knight';
        case 'b':
          return 'bishop';
        case 'q':
          return 'queen';
        case 'k':
          return 'king';
        default:
          return '';
      }
    }

    /**
     * Makes a move that has already been verified
     *
     * @param  {Number} startPos :Starting position
     * @param  {Number} endPos   :Ending position
     * @return {Null}
     */
    function _makeVerifiedMove(startPos, endPos) {
      _transferTile(startPos, endPos);
      _clearBoard();
    }

    /**
     * Pushes a piece move to the server so it can be double checked and then broadcast
     * to all the users watching the game
     *
     * @param  {Number} newPos :New position of the piece
     * @return {Null}
     */
    function _pushPieceMove(newPos) {
      var startTileValue = tileValues[selectedPos];
      var startTile = tiles[selectedPos];

      // verifies that the piece the user is moving is actually their piece
      // not a piece they recolored on the dom
      if (startTileValue.color === startTile.getAttribute('color') && startTileValue.piece === startTile.innerText) {

        var payload = {
          start_position: selectedPos,
          end_position: newPos,
          color: startTileValue.color,
          win: tileValues[newPos].piece === 'K'
        };

        // if this works properly the server will broadcast the piece move
        // making listening for an ok useless
        channel.push('piece_move', payload).receive('error', function (resp) {
          _pushErrorAlert(resp.reason);
          _clearBoard();
        });
      } else {
        console.log('Don\'t cheat... It is not cool!');
        _clearBoard();
      }
    }

    /**
     * Change the active player display and sets the active player for use in other functions
     *
     * @param {String} player :Player username
     */
    function _setActivePlayer(player) {
      $('.active-player').removeClass('active-player');
      $('.player > .user-name').each(function (index, elem) {
        if (elem.innerText.toLowerCase() === player) {
          elem.classList.add('active-player');
        }
      });

      if (window.username === player) {
        _pushInfoAlert('Your turn!');
      }

      activePlayer = player;
    }

    function _pushErrorAlert(message) {
      _pushAlert('error', message);
    }
    function _pushInfoAlert(message) {
      _pushAlert('info', message);
    }
    function _pushAlert(type, message) {
      var alert = document.createElement('div');
      var alertContainer = document.getElementById('alerts');

      alert.classList.add('message');
      alert.classList.add(type);
      alert.innerText = message;

      alertContainer.appendChild(alert);
      setTimeout(function (_) {
        alertContainer.removeChild(alert);
      }, 4000);
    }

    function _pieceTargeted(type, pos, color) {
      switch (type) {
        case 'r':
          _rookClicked(pos, color);
          break;
        case 'n':
          _knightClicked(pos, color);
          break;
        case 'b':
          _bishopClicked(pos, color);
          break;
        case 'q':
          _queenClicked(pos, color);
          break;
        case 'k':
          _kingClicked(pos, color);
          break;
        case 'p':
          _pawnClicked(pos, color);
          break;
        default:
        // should do nothing by default
      }
    }

    function _validateColor(color) {
      return color === '0' && window.username === player1 || color === '1' && window.username === player2;
    }

    tiles.on('hover', function (event) {
      var target = event.target;
      var type = target.getAttribute('type');
      var color = target.getAttribute('color');

      if (boardLocked === false) {
        var pos = tiles.index(target);

        if (type !== 'empty' && _validateColor(color)) {
          _clearBoard();
          if (activePlayer === window.username) {
            _pieceTargeted(type, pos, color);
            channel.push('piece_hover', pos);
          } else {
            target.classList.add('active');
          }
        } else {
          _clearBoard();
        }
      }
    });

    // click events on tiles and what behavior to do
    tiles.on('click', function (event) {
      var target = event.target;
      var pos = tiles.index(target);
      var type = target.getAttribute('type');
      var color = target.getAttribute('color');

      if (activePlayer === window.username) {
        if (target.classList.contains('invalid') && type === 'empty' || target.classList.contains('active') && boardLocked === true) {
          // clearing the board
          _clearBoard();
        } else if (target.classList.contains('valid')) {
          _pushPieceMove(pos);
        } else if (_validateColor(color)) {
          if (target.classList.contains('invalid')) {
            boardLocked = !boardLocked;
            //
            _clearBoard();
          }

          selectedPos = pos;
          _pieceTargeted(target.getAttribute('type'), pos, color);
        }

        boardLocked = !boardLocked;
      }
    });

    // watches for broadcasts of piece moves from the server and moves the piece
    channel.on('piece_move', function (resp) {
      _clearOppTarget();
      _makeVerifiedMove(resp.start_position, resp.end_position);
      _setActivePlayer(resp.new_active_player);
    });

    channel.on('piece_hover', function (resp) {
      _clearOppTarget();

      if (resp.user.username !== window.username) {
        tiles[resp.position].classList.add('opp-active');
      }
    });

    // watches for when the game ends and displays the win/loss flag
    channel.on('game_over', function (resp) {
      if (resp.winner === window.username) {
        _pop_ups2.default.winFlag();
      } else if (resp.loser === window.username) {
        _pop_ups2.default.lossFlag();
      } else {
        window.location.replace('/');
      }
    });

    // updates the pieces of the board based on previous moves in the game
    channel.push('update_board').receive('ok', function (resp) {
      resp.moves.forEach(function (move) {
        _makeVerifiedMove(move.start_position, move.end_position);
      });
    });

    // updates the basic game info like usernames and the active player
    channel.push('get_game_info').receive('ok', function (resp) {
      var player_1 = resp.player_1;
      var player_2 = resp.player_2;

      if (player_1 === window.username) {
        $('.chess-board').addClass('rotate');
        $('.tile').addClass('rotate');
        $('.player.player-1 > .user-name').text(player_2);
        $('.player.player-2 > .user-name').text(player_1);
      } else {
        $('.player.player-1 > .user-name').text(player_1);
        $('.player.player-2 > .user-name').text(player_2);
      }

      player1 = resp.player_1;
      player2 = resp.player_2;
      _setActivePlayer(resp.active_player);
    });
  }

  // public
  return {
    /**
     * Initializes the board
     *
     * @param  {Object} socket :socket used to communicate with the server
     * @param  {String} id     :game id
     * @return {Null}
     */
    init: function init(socket, id) {
      var chessBoard = $('.chess-board');
      var tiles = chessBoard.find('.tile');

      channel = socket.channel('games:' + id);
      channel.join().receive('ok', function (_) {
        _initTiles(chessBoard.find('.tile'));
      }).receive('error', function (reason) {
        return console.log('join failed', reason);
      });
    },
    /**
     * Creates a new game id and passes it into a callback before redirect
     * @param {Object} beforeRedirect :What needs to be done before redirect
     */
    newGame: function newGame(beforeRedirect) {
      var id = _utils2.default.guid();
      beforeRedirect(id);

      window.location.replace('/game?=' + id);
    },
    /**
     * Redirects a user to the game
     * @param {String} id :ID of the game
     */
    enterGame: function enterGame(id) {
      window.location.replace('/game?=' + id);
    }
  };
}();

exports.default = board;
});

require.register("web/static/js/components/pop_ups", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// defines the popups used throughout the app

var popUps = {
  startGame: function startGame(onJoin) {
    var popUp = document.createElement('div');
    var body = document.body;

    function closePopUp() {
      body.removeChild(popUp);
    }

    popUp.className = 'pop-up game-start';
    popUp.innerHTML = '\n      <div class="title">Join Game</div>\n      <div class="options">\n        <div class="btn join">Join</div>\n        <div class="btn cancel">Cancel</div>\n      </div>';

    popUp.getElementsByClassName('join')[0].onclick = function () {
      closePopUp();
      if (typeof onJoin === 'function') {
        onJoin();
      }
    };

    popUp.getElementsByClassName('cancel')[0].onclick = closePopUp;

    document.body.appendChild(popUp);
  },
  offerGame: function offerGame(onOffer) {
    var popUp = document.createElement('div');
    var body = document.body;

    function closePopUp() {
      body.removeChild(popUp);
    }

    popUp.className = 'pop-up game-start';
    popUp.innerHTML = '\n      <div class="title">Join Game</div>\n      <div class="mdl-textfield">\n        <label class="mdl-textfield__label" for="username_input">Password</label>\n        <input class="mdl-textfield__input input" id="username_input" type="text">\n      </div>\n      <div class="btn offer">Offer Game</div>';

    popUp.getElementsByClassName('offer')[0].onclick = function (_) {
      var inputValue = popUp.getElementsByClassName('input')[0].value;
      closePopUp();

      if (typeof onOffer === 'function') {
        onOffer(inputValue);
      }
    };

    document.body.appendChild(popUp);
  },
  winFlag: function winFlag(params) {
    var popUp = document.createElement('div');
    var body = document.body;

    popUp.className = 'win-flag';
    popUp.innerHTML = '\n      <div class="title">WIN</div>\n      <div class="content">\n        <div class="prev-elo">\n          Prev Elo: 69\n        </div>\n        <div class="new-elo">\n          New Elo: 1337\n        </div>\n      </div>';

    document.body.appendChild(popUp);
  },
  lossFlag: function lossFlag(params) {
    var popUp = document.createElement('div');
    var body = document.body;

    popUp.className = 'loss-flag';
    popUp.innerHTML = '\n      <div class="title">LOSS</div>\n      <div class="content">\n        <div class="prev-elo">\n          Prev Elo: 69\n        </div>\n        <div class="new-elo">\n          New Elo: 1337\n        </div>\n      </div>';

    document.body.appendChild(popUp);
  }
};

exports.default = popUps;
});

require.register("web/static/js/components/user", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pop_ups = require('./pop_ups');

var _pop_ups2 = _interopRequireDefault(_pop_ups);

var _board = require('./board');

var _board2 = _interopRequireDefault(_board);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = function () {
  function initChannelEvents(socket, channel) {
    var userInfo = null;

    channel.on("offer_game", function (resp) {
      var username = resp.to.username;

      if (username === userInfo.username) {
        _pop_ups2.default.startGame(function () {
          // fire code to enter a game for the current user
          _board2.default.newGame(function (id) {
            var payload = {
              to: resp.from.username,
              game_id: id
            };
            channel.push("start_game", payload);
          });
        });
      }
    });

    channel.on("start_game", function (resp) {
      if (userInfo !== null && resp.to.username === userInfo.username) {
        _board2.default.enterGame(resp.game_id);
      }
    });

    channel.on("user_info", function (resp) {
      userInfo = resp;
    });
  }

  return {
    init: function init(socket) {
      var userChannel = socket.channel("users:all");

      userChannel.join().receive("ok", function (resp) {
        return console.log("joined the game channel", resp);
      }).receive("error", function (reason) {
        return console.log("join failed", reason);
      });

      initChannelEvents(socket, userChannel);
      userChannel.push("get_user_info");

      $('#offer_game').on('click', function (_) {
        _pop_ups2.default.offerGame(function (target) {
          userChannel.push("offer_game", target);
        });
      });
    }
  };
}();

exports.default = User;
});

require.register("web/static/js/components/utils", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var utils = {
  guid: function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
};

exports.default = utils;
});

require.register("web/static/js/socket", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _phoenix = require("phoenix");

var socket = new _phoenix.Socket("/socket", {
  params: { token: window.userToken },
  logger: function logger(kind, msg, data) {
    console.log(kind + ": " + msg, data);
  }
});

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
exports.default = socket;
});

;require('web/static/js/app');
//# sourceMappingURL=app.js.map