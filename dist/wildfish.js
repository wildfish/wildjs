(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wildfish = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _srcWildjs = require("./src/wildjs");

var _srcWildjs2 = _interopRequireDefault(_srcWildjs);

exports["default"] = _srcWildjs2["default"];
module.exports = exports["default"];

},{"./src/wildjs":6}],2:[function(require,module,exports){
/*******************************************************
 * From:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
 *******************************************************/

// Deal with Node, as there is no `document` in Node
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getCookieStore = function getCookieStore() {
    try {
        return window.document;
    } catch (er) {
        return {
            cookieStore: {},
            cookie: {
                getItem: function getItem(sKey) {
                    return this.cookieStore[sKey];
                },

                setItem: function setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
                    this.cookieStore[sKey] = sValue;
                },

                removeItem: function removeItem(sKey, sPath, sDomain) {
                    delete this.cookieStore[sKey];
                },

                hasItem: function hasItem(sKey) {
                    return this.cookieStore[sKey] !== undefined;
                },

                keys: function keys() {
                    var keyCollection = [];
                    for (var key in this.cookieStore) {
                        if (this.cookieStore.hasOwnProperty(key)) {
                            keyCollection.push(key);
                        }
                    }
                    return keyCollection;
                }
            }
        };
    }
};

var cookies = {
    getItem: function getItem(sKey) {
        if (!sKey) {
            return null;
        }
        return decodeURIComponent(getCookieStore().cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },

    setItem: function setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        getCookieStore().cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },

    removeItem: function removeItem(sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) {
            return false;
        }
        getCookieStore().cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },

    hasItem: function hasItem(sKey) {
        if (!sKey) {
            return false;
        }
        return new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(getCookieStore().cookie);
    },

    keys: function keys() {
        var aKeys = getCookieStore().cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
};

exports.cookies = cookies;

},{}],3:[function(require,module,exports){
//function getCookie (name) {
//    // From https://docs.djangoproject.com/en/1.7/ref/contrib/csrf/
//    var cookieValue = null, cookies, i, cookie;
//    if (document.cookie && document.cookie !== "") {
//        cookies = document.cookie.split(";");
//        for (i = 0; i < cookies.length; i += 1) {
//            cookie = cookies[i].trim(); // Doesn't work in all browsers
//            // Does this cookie string begin with the name we want?
//            if (cookie.substring(0, name.length + 1) === (name + "=")) {
//                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                break;
//            }
//        }
//    }
//    return cookieValue;
//}

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var extraHeaders = {};

function makeRequest(url, method, data) {
    var contentType = arguments[3] === undefined ? "application/json" : arguments[3];

    return new Promise(function (resolve, reject) {

        if (url.indexOf("?format=json") == -1 && url.indexOf("&format=json") == -1) {
            url += "?format=json";
        }

        var req = new XMLHttpRequest();

        // We don't want CSRF tokens if we are using this as
        // a public API for now
        //if (method !== "GET") {
        //    req.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
        //}

        req.open(method, url, true);

        // if the content tpye is multipart/form-data let the browser handle it
        if (contentType !== "multipart/form-data") {
            if (req.overrideMimeType !== undefined) {
                req.overrideMimeType(contentType);
            }

            req.setRequestHeader("Content-Type", contentType);
        }

        for (var key in extraHeaders) {
            req.setRequestHeader(key, extraHeaders[key]);
        }

        // When done processing data
        req.onreadystatechange = function () {
            if (req.readyState !== 4) {
                return;
            }

            if (req.status >= 200 && req.status <= 299) {
                if (req.responseText) {
                    resolve(JSON.parse(req.responseText));
                } else {
                    resolve();
                }
            } else {
                try {
                    var jsonData = JSON.parse(req.responseText);
                    reject(jsonData);
                } catch (err) {
                    reject(req.responseText);
                }
            }
        };

        if (contentType === "application/json") {
            req.send(JSON.stringify(data));
        } else {
            req.send(data);
        }
    });
}

var rest = {
    get: function get(url, data) {
        var contentType = arguments[2] === undefined ? "application/json" : arguments[2];

        return makeRequest(url, "GET", data, contentType);
    },

    post: function post(url, data) {
        var contentType = arguments[2] === undefined ? "application/json" : arguments[2];

        return makeRequest(url, "POST", data, contentType);
    },

    put: function put(url, data) {
        var contentType = arguments[2] === undefined ? "application/json" : arguments[2];

        return makeRequest(url, "PUT", data, contentType);
    },

    patch: function patch(url, data) {
        var contentType = arguments[2] === undefined ? "application/json" : arguments[2];

        return makeRequest(url, "PATCH", data, contentType);
    },

    "delete": function _delete(url, data) {
        var contentType = arguments[2] === undefined ? "application/json" : arguments[2];

        return makeRequest(url, "DELETE", data, contentType);
    },

    setAdditionalHeaders: function setAdditionalHeaders(key, value) {
        extraHeaders[key] = value;
    },

    removeHeader: function removeHeader(key) {
        if (key in extraHeaders) {
            delete extraHeaders[key];
        }
    },

    getHeaders: function getHeaders() {
        return extraHeaders;
    }
};

exports.rest = rest;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var subscribers = {};

/**********************************
 * Get subscribers for an action
 * or an empty list
 **********************************/
function getSubscribers(action) {
    return subscribers[action] || [];
}

/**********************************
 * Subscribe a function to an action.
 * It's safe to subscribe multiple times
 * as the subscriber is only added once
 **********************************/
function subscribe(action, subscriber) {
    subscribers[action] = subscribers[action] || [];
    var subs = getSubscribers(action),
        i = undefined;

    for (i = 0; i < subs.length; i += 1) {
        if (subs[i] === subscriber) {
            return;
        }
    }

    subscribers[action].push(subscriber);
}

/**********************************
 * Unsubscribe a function from an action.
 **********************************/
function unsubscribe(action, subscriber) {
    var subs = _subscribers[action],
        i;
    if (subs === undefined) {
        return;
    }

    for (i = 0; i < subs.length; i += 1) {
        if (subs[i] === subscriber) {
            _subscribers[action].splice(i, 1);
        }
    }

    if (_subscribers[action].length === 0) {
        delete _subscribers[action];
    }
}

/**********************************
 * Publish an action to all subscribers
 **********************************/
function publish(action) {
    var args = [],
        i = undefined;

    for (i = 1; i < arguments.length; i += 1) {
        if (arguments[i]) {
            args.push(arguments[i]);
        } else {
            break;
        }
    }

    var subs = getSubscribers(action);
    for (i = 0; i < subs.length; i += 1) {
        subs[i].apply(this, args);
    }
}

exports.subscribe = subscribe;
exports.unsubscribe = unsubscribe;
exports.publish = publish;

},{}],5:[function(require,module,exports){
/*****************************
 * Format a url based on args
 *****************************/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.formatUrl = formatUrl;

function formatUrl(url, args) {
    var result = url;

    if (args === undefined) {
        return result;
    }

    for (var k in args) {
        result = result.replace("<" + k + ">", args[k]);
    }

    return result;
}

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _rest = require("./rest");

var _urls = require("./urls");

var _subscriptionsPublisher = require("./subscriptions/publisher");

var _cookies = require("./cookies");

exports["default"] = {
    rest: _rest.rest,
    formatUrl: _urls.formatUrl,
    subscribe: _subscriptionsPublisher.subscribe,
    unsubscribe: _subscriptionsPublisher.unsubscribe,
    publish: _subscriptionsPublisher.publish,
    cookies: _cookies.cookies
};
module.exports = exports["default"];

},{"./cookies":2,"./rest":3,"./subscriptions/publisher":4,"./urls":5}]},{},[1])(1)
});