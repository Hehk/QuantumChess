!function(){"use strict";var e="undefined"==typeof window?global:window;if("function"!=typeof e.require){var t={},n={},i={},o={}.hasOwnProperty,r="components/",s=function(e,t){var n=0;t&&(0===t.indexOf(r)&&(n=r.length),t.indexOf("/",n)>0&&(t=t.substring(n,t.indexOf("/",n))));var o=i[e+"/index.js"]||i[t+"/deps/"+e+"/index.js"];return o?r+o.substring(0,o.length-".js".length):e},a=/^\.\.?(\/|$)/,c=function(e,t){for(var n,i=[],o=(a.test(t)?e+"/"+t:t).split("/"),r=0,s=o.length;s>r;r++)n=o[r],".."===n?i.pop():"."!==n&&""!==n&&i.push(n);return i.join("/")},u=function(e){return e.split("/").slice(0,-1).join("/")},l=function(t){return function(n){var i=c(u(t),n);return e.require(i,t)}},f=function(e,t){var i={id:e,exports:{}};return n[e]=i,t(i.exports,l(e),i),i.exports},h=function(e,i){var r=c(e,".");if(null==i&&(i="/"),r=s(e,i),o.call(n,r))return n[r].exports;if(o.call(t,r))return f(r,t[r]);var a=c(r,"./index");if(o.call(n,a))return n[a].exports;if(o.call(t,a))return f(a,t[a]);throw new Error('Cannot find module "'+e+'" from "'+i+'"')};h.alias=function(e,t){i[t]=e},h.register=h.define=function(e,n){if("object"==typeof e)for(var i in e)o.call(e,i)&&(t[i]=e[i]);else t[e]=n},h.list=function(){var e=[];for(var n in t)o.call(t,n)&&e.push(n);return e},h.brunch=!0,h._cache=n,e.require=h}}(),function(){var e=(window,{assert:{},buffer:{},child_process:{},cluster:{},crypto:{},dgram:{},dns:{},events:{},fs:{},http:{},https:{},net:{},os:{},path:{},punycode:{},querystring:{},readline:{},repl:{},string_decoder:{},tls:{},tty:{},url:{},util:{},vm:{},zlib:{},process:{env:{}}}),t=(e.process,function(t,n){return function(i){return void 0!==n[i]&&(i=n[i]),i=i.replace(".js",""),-1===["assert","buffer","child_process","cluster","crypto","dgram","dns","events","fs","http","https","net","os","path","punycode","querystring","readline","repl","string_decoder","tls","tty","url","util","vm","zlib","process"].indexOf(i)?t(i):e[i]}});require.register("phoenix",function(e,n,i){t(function(e){return n(e.replace("./","phoenix/"))},{});!function(e){"use strict";function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();Object.defineProperty(e,"__esModule",{value:!0});var o="1.0.0",r={connecting:0,open:1,closing:2,closed:3},s=1e4,a={closed:"closed",errored:"errored",joined:"joined",joining:"joining"},c={close:"phx_close",error:"phx_error",join:"phx_join",reply:"phx_reply",leave:"phx_leave"},u={longpoll:"longpoll",websocket:"websocket"},l=function(){function e(n,i,o,r){t(this,e),this.channel=n,this.event=i,this.payload=o||{},this.receivedResp=null,this.timeout=r,this.timeoutTimer=null,this.recHooks=[],this.sent=!1}return i(e,[{key:"resend",value:function(e){this.timeout=e,this.cancelRefEvent(),this.ref=null,this.refEvent=null,this.receivedResp=null,this.sent=!1,this.send()}},{key:"send",value:function(){this.hasReceived("timeout")||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload,ref:this.ref}))}},{key:"receive",value:function(e,t){return this.hasReceived(e)&&t(this.receivedResp.response),this.recHooks.push({status:e,callback:t}),this}},{key:"matchReceive",value:function(e){var t=e.status,n=e.response;e.ref;this.recHooks.filter(function(e){return e.status===t}).forEach(function(e){return e.callback(n)})}},{key:"cancelRefEvent",value:function(){this.refEvent&&this.channel.off(this.refEvent)}},{key:"cancelTimeout",value:function(){clearTimeout(this.timeoutTimer),this.timeoutTimer=null}},{key:"startTimeout",value:function(){var e=this;this.timeoutTimer||(this.ref=this.channel.socket.makeRef(),this.refEvent=this.channel.replyEventName(this.ref),this.channel.on(this.refEvent,function(t){e.cancelRefEvent(),e.cancelTimeout(),e.receivedResp=t,e.matchReceive(t)}),this.timeoutTimer=setTimeout(function(){e.trigger("timeout",{})},this.timeout))}},{key:"hasReceived",value:function(e){return this.receivedResp&&this.receivedResp.status===e}},{key:"trigger",value:function(e,t){this.channel.trigger(this.refEvent,{status:e,response:t})}}]),e}(),f=e.Channel=function(){function e(n,i,o){var r=this;t(this,e),this.state=a.closed,this.topic=n,this.params=i||{},this.socket=o,this.bindings=[],this.timeout=this.socket.timeout,this.joinedOnce=!1,this.joinPush=new l(this,c.join,this.params,this.timeout),this.pushBuffer=[],this.rejoinTimer=new p(function(){return r.rejoinUntilConnected()},this.socket.reconnectAfterMs),this.joinPush.receive("ok",function(){r.state=a.joined,r.rejoinTimer.reset(),r.pushBuffer.forEach(function(e){return e.send()}),r.pushBuffer=[]}),this.onClose(function(){r.socket.log("channel","close "+r.topic),r.state=a.closed,r.socket.remove(r)}),this.onError(function(e){r.socket.log("channel","error "+r.topic,e),r.state=a.errored,r.rejoinTimer.scheduleTimeout()}),this.joinPush.receive("timeout",function(){r.state===a.joining&&(r.socket.log("channel","timeout "+r.topic,r.joinPush.timeout),r.state=a.errored,r.rejoinTimer.scheduleTimeout())}),this.on(c.reply,function(e,t){r.trigger(r.replyEventName(t),e)})}return i(e,[{key:"rejoinUntilConnected",value:function(){this.rejoinTimer.scheduleTimeout(),this.socket.isConnected()&&this.rejoin()}},{key:"join",value:function(){var e=arguments.length<=0||void 0===arguments[0]?this.timeout:arguments[0];if(this.joinedOnce)throw"tried to join multiple times. 'join' can only be called a single time per channel instance";return this.joinedOnce=!0,this.rejoin(e),this.joinPush}},{key:"onClose",value:function(e){this.on(c.close,e)}},{key:"onError",value:function(e){this.on(c.error,function(t){return e(t)})}},{key:"on",value:function(e,t){this.bindings.push({event:e,callback:t})}},{key:"off",value:function(e){this.bindings=this.bindings.filter(function(t){return t.event!==e})}},{key:"canPush",value:function(){return this.socket.isConnected()&&this.state===a.joined}},{key:"push",value:function(e,t){var n=arguments.length<=2||void 0===arguments[2]?this.timeout:arguments[2];if(!this.joinedOnce)throw"tried to push '"+e+"' to '"+this.topic+"' before joining. Use channel.join() before pushing events";var i=new l(this,e,t,n);return this.canPush()?i.send():(i.startTimeout(),this.pushBuffer.push(i)),i}},{key:"leave",value:function(){var e=this,t=arguments.length<=0||void 0===arguments[0]?this.timeout:arguments[0],n=function(){e.socket.log("channel","leave "+e.topic),e.trigger(c.close,"leave")},i=new l(this,c.leave,{},t);return i.receive("ok",function(){return n()}).receive("timeout",function(){return n()}),i.send(),this.canPush()||i.trigger("ok",{}),i}},{key:"onMessage",value:function(e,t,n){}},{key:"isMember",value:function(e){return this.topic===e}},{key:"sendJoin",value:function(e){this.state=a.joining,this.joinPush.resend(e)}},{key:"rejoin",value:function(){var e=arguments.length<=0||void 0===arguments[0]?this.timeout:arguments[0];this.sendJoin(e)}},{key:"trigger",value:function(e,t,n){this.onMessage(e,t,n),this.bindings.filter(function(t){return t.event===e}).map(function(e){return e.callback(t,n)})}},{key:"replyEventName",value:function(e){return"chan_reply_"+e}}]),e}(),h=(e.Socket=function(){function e(n){var i=this,o=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];t(this,e),this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.channels=[],this.sendBuffer=[],this.ref=0,this.timeout=o.timeout||s,this.transport=o.transport||window.WebSocket||h,this.heartbeatIntervalMs=o.heartbeatIntervalMs||3e4,this.reconnectAfterMs=o.reconnectAfterMs||function(e){return[1e3,2e3,5e3,1e4][e-1]||1e4},this.logger=o.logger||function(){},this.longpollerTimeout=o.longpollerTimeout||2e4,this.params=o.params||{},this.endPoint=n+"/"+u.websocket,this.reconnectTimer=new p(function(){i.disconnect(function(){return i.connect()})},this.reconnectAfterMs)}return i(e,[{key:"protocol",value:function(){return location.protocol.match(/^https/)?"wss":"ws"}},{key:"endPointURL",value:function(){var e=d.appendParams(d.appendParams(this.endPoint,this.params),{vsn:o});return"/"!==e.charAt(0)?e:"/"===e.charAt(1)?this.protocol()+":"+e:this.protocol()+"://"+location.host+e}},{key:"disconnect",value:function(e,t,n){this.conn&&(this.conn.onclose=function(){},t?this.conn.close(t,n||""):this.conn.close(),this.conn=null),e&&e()}},{key:"connect",value:function(e){var t=this;e&&(console&&console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor"),this.params=e),this.conn||(this.conn=new this.transport(this.endPointURL()),this.conn.timeout=this.longpollerTimeout,this.conn.onopen=function(){return t.onConnOpen()},this.conn.onerror=function(e){return t.onConnError(e)},this.conn.onmessage=function(e){return t.onConnMessage(e)},this.conn.onclose=function(e){return t.onConnClose(e)})}},{key:"log",value:function(e,t,n){this.logger(e,t,n)}},{key:"onOpen",value:function(e){this.stateChangeCallbacks.open.push(e)}},{key:"onClose",value:function(e){this.stateChangeCallbacks.close.push(e)}},{key:"onError",value:function(e){this.stateChangeCallbacks.error.push(e)}},{key:"onMessage",value:function(e){this.stateChangeCallbacks.message.push(e)}},{key:"onConnOpen",value:function(){var e=this;this.log("transport","connected to "+this.endPointURL(),this.transport.prototype),this.flushSendBuffer(),this.reconnectTimer.reset(),this.conn.skipHeartbeat||(clearInterval(this.heartbeatTimer),this.heartbeatTimer=setInterval(function(){return e.sendHeartbeat()},this.heartbeatIntervalMs)),this.stateChangeCallbacks.open.forEach(function(e){return e()})}},{key:"onConnClose",value:function(e){this.log("transport","close",e),this.triggerChanError(),clearInterval(this.heartbeatTimer),this.reconnectTimer.scheduleTimeout(),this.stateChangeCallbacks.close.forEach(function(t){return t(e)})}},{key:"onConnError",value:function(e){this.log("transport",e),this.triggerChanError(),this.stateChangeCallbacks.error.forEach(function(t){return t(e)})}},{key:"triggerChanError",value:function(){this.channels.forEach(function(e){return e.trigger(c.error)})}},{key:"connectionState",value:function(){switch(this.conn&&this.conn.readyState){case r.connecting:return"connecting";case r.open:return"open";case r.closing:return"closing";default:return"closed"}}},{key:"isConnected",value:function(){return"open"===this.connectionState()}},{key:"remove",value:function(e){this.channels=this.channels.filter(function(t){return!t.isMember(e.topic)})}},{key:"channel",value:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],n=new f(e,t,this);return this.channels.push(n),n}},{key:"push",value:function(e){var t=this,n=e.topic,i=e.event,o=e.payload,r=e.ref,s=function(){return t.conn.send(JSON.stringify(e))};this.log("push",n+" "+i+" ("+r+")",o),this.isConnected()?s():this.sendBuffer.push(s)}},{key:"makeRef",value:function(){var e=this.ref+1;return e===this.ref?this.ref=0:this.ref=e,this.ref.toString()}},{key:"sendHeartbeat",value:function(){this.isConnected()&&this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.makeRef()})}},{key:"flushSendBuffer",value:function(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(function(e){return e()}),this.sendBuffer=[])}},{key:"onConnMessage",value:function(e){var t=JSON.parse(e.data),n=t.topic,i=t.event,o=t.payload,r=t.ref;this.log("receive",(o.status||"")+" "+n+" "+i+" "+(r&&"("+r+")"||""),o),this.channels.filter(function(e){return e.isMember(n)}).forEach(function(e){return e.trigger(i,o,r)}),this.stateChangeCallbacks.message.forEach(function(e){return e(t)})}}]),e}(),e.LongPoll=function(){function e(n){t(this,e),this.endPoint=null,this.token=null,this.skipHeartbeat=!0,this.onopen=function(){},this.onerror=function(){},this.onmessage=function(){},this.onclose=function(){},this.pollEndpoint=this.normalizeEndpoint(n),this.readyState=r.connecting,this.poll()}return i(e,[{key:"normalizeEndpoint",value:function(e){return e.replace("ws://","http://").replace("wss://","https://").replace(new RegExp("(.*)/"+u.websocket),"$1/"+u.longpoll)}},{key:"endpointURL",value:function(){return d.appendParams(this.pollEndpoint,{token:this.token})}},{key:"closeAndRetry",value:function(){this.close(),this.readyState=r.connecting}},{key:"ontimeout",value:function(){this.onerror("timeout"),this.closeAndRetry()}},{key:"poll",value:function(){var e=this;(this.readyState===r.open||this.readyState===r.connecting)&&d.request("GET",this.endpointURL(),"application/json",null,this.timeout,this.ontimeout.bind(this),function(t){if(t){var n=t.status,i=t.token,o=t.messages;e.token=i}else var n=0;switch(n){case 200:o.forEach(function(t){return e.onmessage({data:JSON.stringify(t)})}),e.poll();break;case 204:e.poll();break;case 410:e.readyState=r.open,e.onopen(),e.poll();break;case 0:case 500:e.onerror(),e.closeAndRetry();break;default:throw"unhandled poll status "+n}})}},{key:"send",value:function(e){var t=this;d.request("POST",this.endpointURL(),"application/json",e,this.timeout,this.onerror.bind(this,"timeout"),function(e){e&&200===e.status||(t.onerror(status),t.closeAndRetry())})}},{key:"close",value:function(e,t){this.readyState=r.closed,this.onclose()}}]),e}()),d=e.Ajax=function(){function e(){t(this,e)}return i(e,null,[{key:"request",value:function(e,t,n,i,o,r,s){if(window.XDomainRequest){var a=new XDomainRequest;this.xdomainRequest(a,e,t,i,o,r,s)}else{var a=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");this.xhrRequest(a,e,t,n,i,o,r,s)}}},{key:"xdomainRequest",value:function(e,t,n,i,o,r,s){var a=this;e.timeout=o,e.open(t,n),e.onload=function(){var t=a.parseJSON(e.responseText);s&&s(t)},r&&(e.ontimeout=r),e.onprogress=function(){},e.send(i)}},{key:"xhrRequest",value:function(e,t,n,i,o,r,s,a){var c=this;e.timeout=r,e.open(t,n,!0),e.setRequestHeader("Content-Type",i),e.onerror=function(){a&&a(null)},e.onreadystatechange=function(){if(e.readyState===c.states.complete&&a){var t=c.parseJSON(e.responseText);a(t)}},s&&(e.ontimeout=s),e.send(o)}},{key:"parseJSON",value:function(e){return e&&""!==e?JSON.parse(e):null}},{key:"serialize",value:function(e,t){var i=[];for(var o in e)if(e.hasOwnProperty(o)){var r=t?t+"["+o+"]":o,s=e[o];"object"===("undefined"==typeof s?"undefined":n(s))?i.push(this.serialize(s,r)):i.push(encodeURIComponent(r)+"="+encodeURIComponent(s))}return i.join("&")}},{key:"appendParams",value:function(e,t){if(0===Object.keys(t).length)return e;var n=e.match(/\?/)?"&":"?";return""+e+n+this.serialize(t)}}]),e}();d.states={complete:4};var p=function(){function e(n,i){t(this,e),this.callback=n,this.timerCalc=i,this.timer=null,this.tries=0}return i(e,[{key:"reset",value:function(){this.tries=0,clearTimeout(this.timer)}},{key:"scheduleTimeout",value:function(){var e=this;clearTimeout(this.timer),this.timer=setTimeout(function(){e.tries=e.tries+1,e.callback()},this.timerCalc(this.tries+1))}}]),e}()}("undefined"==typeof e?window.Phoenix=window.Phoenix||{}:e)}),require.register("phoenix_html",function(e,n,i){for(var o=(t(function(e){return n(e.replace("./","phoenix_html/"))},{}),document.querySelectorAll("[data-submit^=parent]")),r=o.length,s=0;r>s;++s)o[s].addEventListener("click",function(e){var t=this.getAttribute("data-confirm");return(null===t||confirm(t))&&this.parentNode.submit(),e.preventDefault(),!1},!1)})}(),require.register("web/static/js/app",function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function o(e){$("#"+e+"_search").on("click",function(t){t.target.classList.toggle("open"),$("#"+e+"_search_input").toggleClass("open").val("")}),$("#"+e+"_search_input").on("input",function(t){var n=t.target.value.trim();$("#"+e+" > .list-item").each(function(e,t){var i=$(t);-1!=i.find(".title").text().toLowerCase().indexOf(n)?i.addClass("open").removeClass("close"):i.addClass("close").removeClass("open")})})}t("phoenix_html");var r=t("./socket"),s=i(r),a=t("./components/board"),c=i(a),u=t("./components/user"),l=i(u);window.onload=function(){if(""!==window.userToken){s["default"].connect();var e=/(\/game\?=)(\S*)/g.exec(document.location.href);null!==e&&c["default"].init(s["default"],e[2]),o("active_players"),o("active_games"),l["default"].init(s["default"])}}}),require.register("web/static/js/components/board",function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},r=t("./utils"),s=i(r),a=t("./pop_ups"),c=i(a),u=function(){function e(e){function i(e){return{y:Math.floor(e/8),x:e%8}}function r(e,t){var n=i(e),o=i(t),r=Math.abs(n.y-o.y),s=Math.abs(n.x-o.x);return t>=0&&64>t&&(2===s&&1===r||1===s&&2===r)}function s(e,t,n){var i=e+n;r(e,i)&&h(i,t)}function a(e,t,n){var o=i(e),r=i(t);return t>=0&&64>t&&(n===!1&&o.y===r.y&&Math.abs(o.x-r.x)===Math.abs(8-Math.abs(t-e))||n===!1&&Math.abs(o.y-r.y)<2&&Math.abs(o.y-r.y)>0||n===!0&&o.y===r.y||n===!0&&o.x===r.x)}function u(){e.each(function(e,t){(t.classList.contains("valid")||t.classList.contains("active"))===!1&&t.classList.add("invalid")})}function l(){t=null,e.each(function(e,t){t.classList.remove("valid"),t.classList.remove("invalid"),t.classList.remove("active")})}function f(){e.each(function(e,t){t.classList.remove("opp-active")})}function h(t,n,i,o,r){var s=e[t];"empty"===s.getAttribute("type")?(s.classList.add("valid"),"function"==typeof r&&r(t,n,i,o)):s.getAttribute("color")!==n&&(s.classList.add("valid"),s.classList.add("target"))}function d(e,t,n,i){var o=e+n;a(e,o,i)&&h(o,t)}function p(e,t,n,i){var o=e+n;a(e,o,i)&&h(o,t,n,i,p)}function v(t,n){e[t].classList.add("active"),p(t,n,8,!0),p(t,n,-8,!0),p(t,n,1,!0),p(t,n,-1,!0),u()}function m(t,n){e[t].classList.add("active"),p(t,n,-9,!1),p(t,n,-7,!1),p(t,n,7,!1),p(t,n,9,!1),u()}function y(t,n){e[t].classList.add("active"),p(t,n,8,!0),p(t,n,-8,!0),p(t,n,1,!0),p(t,n,-1,!0),p(t,n,-9,!1),p(t,n,-7,!1),p(t,n,7,!1),p(t,n,9,!1),u()}function g(t,n){e[t].classList.add("active"),d(t,n,8,!0),d(t,n,-8,!0),d(t,n,1,!0),d(t,n,-1,!0),d(t,n,-9,!1),d(t,n,-7,!1),d(t,n,7,!1),d(t,n,9,!1),u()}function b(t,n){e[t].classList.add("active"),s(t,n,-17,!0),s(t,n,-15,!0),s(t,n,-6,!0),s(t,n,10,!0),s(t,n,17,!0),s(t,n,15,!0),s(t,n,6,!0),s(t,n,-10,!0),u()}function k(t,n){if(e[t].classList.add("active"),"0"===n){var r=e[t+8];if("object"===("undefined"==typeof r?"undefined":o(r))&&"empty"===r.getAttribute("type")){d(t,n,8,!0);var s=e[t+16];1===i(t).y&&"object"===("undefined"==typeof s?"undefined":o(s))&&"empty"===s.getAttribute("type")&&d(t,n,16,!0)}var a=e[t+7];"object"===("undefined"==typeof a?"undefined":o(a))&&"empty"!==a.getAttribute("type")&&d(t,n,7,!1);var c=e[t+9];"object"===("undefined"==typeof c?"undefined":o(c))&&"empty"!==c.getAttribute("type")&&d(t,n,9,!1)}else{var l=e[t-8];if("object"===("undefined"==typeof l?"undefined":o(l))&&"empty"===l.getAttribute("type")){d(t,n,-8,!0);var f=e[t-16];6===i(t).y&&"object"===("undefined"==typeof f?"undefined":o(f))&&"empty"===f.getAttribute("type")&&d(t,n,-16,!0)}var h=e[t-9];"object"===("undefined"==typeof h?"undefined":o(h))&&"empty"!==h.getAttribute("type")&&d(t,n,-9,!1);var p=e[t-7];"object"===("undefined"==typeof p?"undefined":o(p))&&"empty"!==p.getAttribute("type")&&d(t,n,-7,!1)}u()}function w(t){$(e[t]).removeClass().addClass("tile").addClass("color-1").text(" ").attr("type","empty").attr("color","1")}function C(t,n){var i=e[t],o=e[n],r=P[t],s={type:i.getAttribute("type"),color:i.getAttribute("color")};$(o).removeClass().addClass("tile").addClass("color-"+s.color).addClass(_(s.type)).addClass(i.classList.contains("rotate")?"rotate":"").attr("type",s.type).attr("color",s.color),w(t),P[n]={color:r.color,piece:r.piece},P[t]={color:"0",piece:""}}function _(e){switch(e){case"p":return"pawn";case"r":return"rook";case"n":return"knight";case"b":return"bishop";case"q":return"queen";case"k":return"king";default:return""}}function j(e,t){C(e,t),l()}function x(i){var o=P[t],r=e[t];if(o.color===r.getAttribute("color")&&o.piece===r.innerText){var s={start_position:t,end_position:i,color:o.color,win:"K"===P[i].piece};n.push("piece_move",s).receive("error",function(e){T(e.reason),l()})}else console.log("Don't cheat... It is not cool!"),l()}function E(e){$(".active-player").removeClass("active-player"),$(".player > .user-name").each(function(t,n){n.innerText.toLowerCase()===e&&n.classList.add("active-player")}),window.username===e&&L("Your turn!"),A=e}function T(e){M("error",e)}function L(e){M("info",e)}function M(e,t){var n=document.createElement("div"),i=document.getElementById("alerts");n.classList.add("message"),n.classList.add(e),n.innerText=t,i.appendChild(n),setTimeout(function(e){i.removeChild(n)},4e3)}function R(e,t,n){switch(e){case"r":v(t,n);break;case"n":b(t,n);break;case"b":m(t,n);break;case"q":y(t,n);break;case"k":g(t,n);break;case"p":k(t,n)}}function S(e){return"0"===e&&window.username===q||"1"===e&&window.username===N}var P=e.map(function(e,t){return{piece:t.innerText,color:t.getAttribute("color")}}),A="",O=!1,q="",N="";e.on("hover",function(t){var i=t.target,o=i.getAttribute("type"),r=i.getAttribute("color");if(O===!1){var s=e.index(i);"empty"!==o&&S(r)?(l(),A===window.username?(R(o,s,r),n.push("piece_hover",s)):i.classList.add("active")):l()}}),e.on("click",function(n){var i=n.target,o=e.index(i),r=i.getAttribute("type"),s=i.getAttribute("color");A===window.username&&(i.classList.contains("invalid")&&"empty"===r||i.classList.contains("active")&&O===!0?l():i.classList.contains("valid")?x(o):S(s)&&(i.classList.contains("invalid")&&(O=!O,l()),t=o,R(i.getAttribute("type"),o,s)),O=!O)}),n.on("piece_move",function(e){f(),j(e.start_position,e.end_position),E(e.new_active_player)}),n.on("piece_hover",function(t){f(),t.user.username!==window.username&&e[t.position].classList.add("opp-active")}),n.on("game_over",function(e){e.winner===window.username?c["default"].winFlag():e.loser===window.username?c["default"].lossFlag():window.location.replace("/")}),n.push("update_board").receive("ok",function(e){e.moves.forEach(function(e){j(e.start_position,e.end_position)})}),n.push("get_game_info").receive("ok",function(e){var t=e.player_1,n=e.player_2;t===window.username?($(".chess-board").addClass("rotate"),$(".tile").addClass("rotate"),$(".player.player-1 > .user-name").text(n),$(".player.player-2 > .user-name").text(t)):($(".player.player-1 > .user-name").text(t),$(".player.player-2 > .user-name").text(n)),q=e.player_1,N=e.player_2,E(e.active_player)})}var t=null,n=null;return{init:function(t,i){var o=$(".chess-board");o.find(".tile");n=t.channel("games:"+i),n.join().receive("ok",function(t){e(o.find(".tile"))}).receive("error",function(e){return console.log("join failed",e)})},newGame:function(e){var t=s["default"].guid();e(t),window.location.replace("/game?="+t)},enterGame:function(e){window.location.replace("/game?="+e)}}}();e["default"]=u}),require.register("web/static/js/components/pop_ups",function(e,t,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={startGame:function(e){function t(){i.removeChild(n)}var n=document.createElement("div"),i=document.body;n.className="pop-up game-start",n.innerHTML='\n      <div class="title">Join Game</div>\n      <div class="options">\n        <div class="btn join">Join</div>\n        <div class="btn cancel">Cancel</div>\n      </div>',n.getElementsByClassName("join")[0].onclick=function(){t(),"function"==typeof e&&e()},n.getElementsByClassName("cancel")[0].onclick=t,document.body.appendChild(n)},offerGame:function(e){function t(){i.removeChild(n)}var n=document.createElement("div"),i=document.body;n.className="pop-up game-start",n.innerHTML='\n      <div class="title">Join Game</div>\n      <div class="mdl-textfield">\n        <label class="mdl-textfield__label" for="username_input">Password</label>\n        <input class="mdl-textfield__input input" id="username_input" type="text">\n      </div>\n      <div class="btn offer">Offer Game</div>',n.getElementsByClassName("offer")[0].onclick=function(i){var o=n.getElementsByClassName("input")[0].value;t(),"function"==typeof e&&e(o)},document.body.appendChild(n)},winFlag:function(e){var t=document.createElement("div");document.body;t.className="win-flag",t.innerHTML='\n      <div class="title">WIN</div>\n      <div class="content">\n        <div class="prev-elo">\n          Prev Elo: 69\n        </div>\n        <div class="new-elo">\n          New Elo: 1337\n        </div>\n      </div>',document.body.appendChild(t)},lossFlag:function(e){var t=document.createElement("div");document.body;t.className="loss-flag",t.innerHTML='\n      <div class="title">LOSS</div>\n      <div class="content">\n        <div class="prev-elo">\n          Prev Elo: 69\n        </div>\n        <div class="new-elo">\n          New Elo: 1337\n        </div>\n      </div>',document.body.appendChild(t)}};e["default"]=i}),require.register("web/static/js/components/user",function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0});var o=t("./pop_ups"),r=i(o),s=t("./board"),a=i(s),c=function(){function e(e,t){var n=null;t.on("offer_game",function(e){var i=e.to.username;i===n.username&&r["default"].startGame(function(){a["default"].newGame(function(n){var i={to:e.from.username,game_id:n};t.push("start_game",i)})})}),t.on("start_game",function(e){null!==n&&e.to.username===n.username&&a["default"].enterGame(e.game_id)}),t.on("user_info",function(e){n=e})}return{init:function(t){var n=t.channel("users:all");n.join().receive("ok",function(e){return console.log("joined the game channel",e)}).receive("error",function(e){return console.log("join failed",e)}),e(t,n),n.push("get_user_info"),$("#offer_game").on("click",function(e){r["default"].offerGame(function(e){n.push("offer_game",e)})})}}}();e["default"]=c}),require.register("web/static/js/components/utils",function(e,t,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={guid:function(){function e(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()}};e["default"]=i}),require.register("web/static/js/socket",function(e,t,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=t("phoenix"),o=new i.Socket("/socket",{params:{token:window.userToken},logger:function(e,t,n){console.log(e+": "+t,n)}});e["default"]=o}),require("web/static/js/app");