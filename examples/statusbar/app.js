(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Adapted from https://github.com/Flet/prettier-bytes/
// Changing 1000 bytes to 1024, so we can keep uppercase KB vs kB
// ISC License (c) Dan Flettre https://github.com/Flet/prettier-bytes/blob/master/LICENSE
module.exports = function prettierBytes (num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number, got ' + typeof num)
  }

  var neg = num < 0
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B'
  }

  var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1)
  num = Number(num / Math.pow(1024, exponent))
  var unit = units[exponent]

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return (neg ? '-' : '') + num.toFixed(0) + ' ' + unit
  } else {
    return (neg ? '-' : '') + num.toFixed(1) + ' ' + unit
  }
}

},{}],2:[function(require,module,exports){
/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],3:[function(require,module,exports){
(function (global){(function (){
/*
 *  base64.js
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(global)
        : typeof define === 'function' && define.amd
        ? define(factory) : factory(global)
}((
    typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof global !== 'undefined' ? global
: this
), function(global) {
    'use strict';
    // existing version for noConflict()
    global = global || {};
    var _Base64 = global.Base64;
    var version = "2.6.4";
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa && typeof global.btoa == 'function'
        ? function(b){ return global.btoa(b) } : function(b) {
        if (b.match(/[^\x00-\xFF]/)) throw new RangeError(
            'The string contains invalid characters.'
        );
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = function(u) {
        return btoa(utob(String(u)));
    };
    var mkUriSafe = function (b64) {
        return b64.replace(/[+\/]/g, function(m0) {
            return m0 == '+' ? '-' : '_';
        }).replace(/=/g, '');
    };
    var encode = function(u, urisafe) {
        return urisafe ? mkUriSafe(_encode(u)) : _encode(u);
    };
    var encodeURI = function(u) { return encode(u, true) };
    var fromUint8Array;
    if (global.Uint8Array) fromUint8Array = function(a, urisafe) {
        // return btoa(fromCharCode.apply(null, a));
        var b64 = '';
        for (var i = 0, l = a.length; i < l; i += 3) {
            var a0 = a[i], a1 = a[i+1], a2 = a[i+2];
            var ord = a0 << 16 | a1 << 8 | a2;
            b64 +=    b64chars.charAt( ord >>> 18)
                +     b64chars.charAt((ord >>> 12) & 63)
                + ( typeof a1 != 'undefined'
                    ? b64chars.charAt((ord >>>  6) & 63) : '=')
                + ( typeof a2 != 'undefined'
                    ? b64chars.charAt( ord         & 63) : '=');
        }
        return urisafe ? mkUriSafe(b64) : b64;
    };
    // decoder stuff
    var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var _atob = global.atob && typeof global.atob == 'function'
        ? function(a){ return global.atob(a) } : function(a){
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function(a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    var _decode = function(a) { return btou(_atob(a)) };
    var _fromURI = function(a) {
        return String(a).replace(/[-_]/g, function(m0) {
            return m0 == '-' ? '+' : '/'
        }).replace(/[^A-Za-z0-9\+\/]/g, '');
    };
    var decode = function(a){
        return _decode(_fromURI(a));
    };
    var toUint8Array;
    if (global.Uint8Array) toUint8Array = function(a) {
        return Uint8Array.from(atob(_fromURI(a)), function(c) {
            return c.charCodeAt(0);
        });
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict,
        fromUint8Array: fromUint8Array,
        toUint8Array: toUint8Array
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function(){ return global.Base64 });
    }
    // that's it!
    return {Base64: global.Base64}
}));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
(function (global){(function (){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
var wildcard = require('wildcard');
var reMimePartSplit = /[\/\+\.]/;

/**
  # mime-match

  A simple function to checker whether a target mime type matches a mime-type
  pattern (e.g. image/jpeg matches image/jpeg OR image/*).

  ## Example Usage

  <<< example.js

**/
module.exports = function(target, pattern) {
  function test(pattern) {
    var result = wildcard(pattern, target, reMimePartSplit);

    // ensure that we have a valid mime type (should have two parts)
    return result && result.length >= 2;
  }

  return pattern ? test(pattern.split(';')[0]) : test;
};

},{"wildcard":28}],6:[function(require,module,exports){
/**
* Create an event emitter with namespaces
* @name createNamespaceEmitter
* @example
* var emitter = require('./index')()
*
* emitter.on('*', function () {
*   console.log('all events emitted', this.event)
* })
*
* emitter.on('example', function () {
*   console.log('example event emitted')
* })
*/
module.exports = function createNamespaceEmitter () {
  var emitter = {}
  var _fns = emitter._fns = {}

  /**
  * Emit an event. Optionally namespace the event. Handlers are fired in the order in which they were added with exact matches taking precedence. Separate the namespace and event with a `:`
  * @name emit
  * @param {String} event – the name of the event, with optional namespace
  * @param {...*} data – up to 6 arguments that are passed to the event listener
  * @example
  * emitter.emit('example')
  * emitter.emit('demo:test')
  * emitter.emit('data', { example: true}, 'a string', 1)
  */
  emitter.emit = function emit (event, arg1, arg2, arg3, arg4, arg5, arg6) {
    var toEmit = getListeners(event)

    if (toEmit.length) {
      emitAll(event, toEmit, [arg1, arg2, arg3, arg4, arg5, arg6])
    }
  }

  /**
  * Create en event listener.
  * @name on
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.on('example', function () {})
  * emitter.on('demo', function () {})
  */
  emitter.on = function on (event, fn) {
    if (!_fns[event]) {
      _fns[event] = []
    }

    _fns[event].push(fn)
  }

  /**
  * Create en event listener that fires once.
  * @name once
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.once('example', function () {})
  * emitter.once('demo', function () {})
  */
  emitter.once = function once (event, fn) {
    function one () {
      fn.apply(this, arguments)
      emitter.off(event, one)
    }
    this.on(event, one)
  }

  /**
  * Stop listening to an event. Stop all listeners on an event by only passing the event name. Stop a single listener by passing that event handler as a callback.
  * You must be explicit about what will be unsubscribed: `emitter.off('demo')` will unsubscribe an `emitter.on('demo')` listener,
  * `emitter.off('demo:example')` will unsubscribe an `emitter.on('demo:example')` listener
  * @name off
  * @param {String} event
  * @param {Function} [fn] – the specific handler
  * @example
  * emitter.off('example')
  * emitter.off('demo', function () {})
  */
  emitter.off = function off (event, fn) {
    var keep = []

    if (event && fn) {
      var fns = this._fns[event]
      var i = 0
      var l = fns ? fns.length : 0

      for (i; i < l; i++) {
        if (fns[i] !== fn) {
          keep.push(fns[i])
        }
      }
    }

    keep.length ? this._fns[event] = keep : delete this._fns[event]
  }

  function getListeners (e) {
    var out = _fns[e] ? _fns[e] : []
    var idx = e.indexOf(':')
    var args = (idx === -1) ? [e] : [e.substring(0, idx), e.substring(idx + 1)]

    var keys = Object.keys(_fns)
    var i = 0
    var l = keys.length

    for (i; i < l; i++) {
      var key = keys[i]
      if (key === '*') {
        out = out.concat(_fns[key])
      }

      if (args.length === 2 && args[0] === key) {
        out = out.concat(_fns[key])
        break
      }
    }

    return out
  }

  function emitAll (e, fns, args) {
    var i = 0
    var l = fns.length

    for (i; i < l; i++) {
      if (!fns[i]) break
      fns[i].event = e
      fns[i].apply(fns[i], args)
    }
  }

  return emitter
}

},{}],7:[function(require,module,exports){
(function (process){(function (){
let { urlAlphabet } = require('./url-alphabet/index.cjs')
if (process.env.NODE_ENV !== 'production') {
  if (
    typeof navigator !== 'undefined' &&
    navigator.product === 'ReactNative' &&
    typeof crypto === 'undefined'
  ) {
    throw new Error(
      'React Native does not have a built-in secure random generator. ' +
        'If you don’t need unpredictable IDs use `nanoid/non-secure`. ' +
        'For secure IDs, import `react-native-get-random-values` ' +
        'before Nano ID.'
    )
  }
  if (typeof msCrypto !== 'undefined' && typeof crypto === 'undefined') {
    throw new Error(
      'Import file with `if (!window.crypto) window.crypto = window.msCrypto`' +
        ' before importing Nano ID to fix IE 11 support'
    )
  }
  if (typeof crypto === 'undefined') {
    throw new Error(
      'Your browser does not have secure random generator. ' +
        'If you don’t need unpredictable IDs, you can use nanoid/non-secure.'
    )
  }
}
let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, size, getRandom) => {
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  let step = -~((1.6 * mask * size) / alphabet.length)
  return () => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size) => customRandom(alphabet, size, random)
let nanoid = (size = 21) => {
  let id = ''
  let bytes = crypto.getRandomValues(new Uint8Array(size))
  while (size--) {
    let byte = bytes[size] & 63
    if (byte < 36) {
      id += byte.toString(36)
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte < 63) {
      id += '_'
    } else {
      id += '-'
    }
  }
  return id
}
module.exports = { nanoid, customAlphabet, customRandom, urlAlphabet, random }

}).call(this)}).call(this,require('_process'))

},{"./url-alphabet/index.cjs":8,"_process":10}],8:[function(require,module,exports){
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
module.exports = { urlAlphabet }

},{}],9:[function(require,module,exports){
var n,l,u,t,i,r,o,f,e={},c=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function a(n,l){for(var u in l)n[u]=l[u];return n}function v(n){var l=n.parentNode;l&&l.removeChild(n)}function h(l,u,t){var i,r,o,f={};for(o in u)"key"==o?i=u[o]:"ref"==o?r=u[o]:f[o]=u[o];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(o in l.defaultProps)void 0===f[o]&&(f[o]=l.defaultProps[o]);return p(l,f,i,r,null)}function p(n,t,i,r,o){var f={type:n,props:t,key:i,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==o?++u:o};return null==o&&null!=l.vnode&&l.vnode(f),f}function y(n){return n.children}function d(n,l){this.props=n,this.context=l}function _(n,l){if(null==l)return n.__?_(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?_(n):null}function k(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return k(n)}}function x(n){(!n.__d&&(n.__d=!0)&&i.push(n)&&!b.__r++||o!==l.debounceRendering)&&((o=l.debounceRendering)||r)(b)}function b(){for(var n;b.__r=i.length;)n=i.sort(function(n,l){return n.__v.__b-l.__v.__b}),i=[],n.some(function(n){var l,u,t,i,r,o;n.__d&&(r=(i=(l=n).__v).__e,(o=l.__P)&&(u=[],(t=a({},i)).__v=i.__v+1,I(o,i,t,l.__n,void 0!==o.ownerSVGElement,null!=i.__h?[r]:null,u,null==r?_(i):r,i.__h),T(u,i),i.__e!=r&&k(i)))})}function m(n,l,u,t,i,r,o,f,s,a){var v,h,d,k,x,b,m,A=t&&t.__k||c,P=A.length;for(u.__k=[],v=0;v<l.length;v++)if(null!=(k=u.__k[v]=null==(k=l[v])||"boolean"==typeof k?null:"string"==typeof k||"number"==typeof k||"bigint"==typeof k?p(null,k,null,null,k):Array.isArray(k)?p(y,{children:k},null,null,null):k.__b>0?p(k.type,k.props,k.key,null,k.__v):k)){if(k.__=u,k.__b=u.__b+1,null===(d=A[v])||d&&k.key==d.key&&k.type===d.type)A[v]=void 0;else for(h=0;h<P;h++){if((d=A[h])&&k.key==d.key&&k.type===d.type){A[h]=void 0;break}d=null}I(n,k,d=d||e,i,r,o,f,s,a),x=k.__e,(h=k.ref)&&d.ref!=h&&(m||(m=[]),d.ref&&m.push(d.ref,null,k),m.push(h,k.__c||x,k)),null!=x?(null==b&&(b=x),"function"==typeof k.type&&k.__k===d.__k?k.__d=s=g(k,s,n):s=w(n,k,d,A,x,s),"function"==typeof u.type&&(u.__d=s)):s&&d.__e==s&&s.parentNode!=n&&(s=_(d))}for(u.__e=b,v=P;v--;)null!=A[v]&&("function"==typeof u.type&&null!=A[v].__e&&A[v].__e==u.__d&&(u.__d=_(t,v+1)),L(A[v],A[v]));if(m)for(v=0;v<m.length;v++)z(m[v],m[++v],m[++v])}function g(n,l,u){for(var t,i=n.__k,r=0;i&&r<i.length;r++)(t=i[r])&&(t.__=n,l="function"==typeof t.type?g(t,l,u):w(u,t,t,i,t.__e,l));return l}function w(n,l,u,t,i,r){var o,f,e;if(void 0!==l.__d)o=l.__d,l.__d=void 0;else if(null==u||i!=r||null==i.parentNode)n:if(null==r||r.parentNode!==n)n.appendChild(i),o=null;else{for(f=r,e=0;(f=f.nextSibling)&&e<t.length;e+=2)if(f==i)break n;n.insertBefore(i,r),o=r}return void 0!==o?o:i.nextSibling}function A(n,l,u,t,i){var r;for(r in u)"children"===r||"key"===r||r in l||C(n,r,null,u[r],t);for(r in l)i&&"function"!=typeof l[r]||"children"===r||"key"===r||"value"===r||"checked"===r||u[r]===l[r]||C(n,r,l[r],u[r],t)}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||s.test(l)?u:u+"px"}function C(n,l,u,t,i){var r;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||P(n.style,l,"");if(u)for(l in u)t&&u[l]===t[l]||P(n.style,l,u[l])}else if("o"===l[0]&&"n"===l[1])r=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+r]=u,u?t||n.addEventListener(l,r?H:$,r):n.removeEventListener(l,r?H:$,r);else if("dangerouslySetInnerHTML"!==l){if(i)l=l.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l))}}function $(n){this.l[n.type+!1](l.event?l.event(n):n)}function H(n){this.l[n.type+!0](l.event?l.event(n):n)}function I(n,u,t,i,r,o,f,e,c){var s,v,h,p,_,k,x,b,g,w,A,P=u.type;if(void 0!==u.constructor)return null;null!=t.__h&&(c=t.__h,e=u.__e=t.__e,u.__h=null,o=[e]),(s=l.__b)&&s(u);try{n:if("function"==typeof P){if(b=u.props,g=(s=P.contextType)&&i[s.__c],w=s?g?g.props.value:s.__:i,t.__c?x=(v=u.__c=t.__c).__=v.__E:("prototype"in P&&P.prototype.render?u.__c=v=new P(b,w):(u.__c=v=new d(b,w),v.constructor=P,v.render=M),g&&g.sub(v),v.props=b,v.state||(v.state={}),v.context=w,v.__n=i,h=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=P.getDerivedStateFromProps&&(v.__s==v.state&&(v.__s=a({},v.__s)),a(v.__s,P.getDerivedStateFromProps(b,v.__s))),p=v.props,_=v.state,h)null==P.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&v.__h.push(v.componentDidMount);else{if(null==P.getDerivedStateFromProps&&b!==p&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(b,w),!v.__e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(b,v.__s,w)||u.__v===t.__v){v.props=b,v.state=v.__s,u.__v!==t.__v&&(v.__d=!1),v.__v=u,u.__e=t.__e,u.__k=t.__k,u.__k.forEach(function(n){n&&(n.__=u)}),v.__h.length&&f.push(v);break n}null!=v.componentWillUpdate&&v.componentWillUpdate(b,v.__s,w),null!=v.componentDidUpdate&&v.__h.push(function(){v.componentDidUpdate(p,_,k)})}v.context=w,v.props=b,v.state=v.__s,(s=l.__r)&&s(u),v.__d=!1,v.__v=u,v.__P=n,s=v.render(v.props,v.state,v.context),v.state=v.__s,null!=v.getChildContext&&(i=a(a({},i),v.getChildContext())),h||null==v.getSnapshotBeforeUpdate||(k=v.getSnapshotBeforeUpdate(p,_)),A=null!=s&&s.type===y&&null==s.key?s.props.children:s,m(n,Array.isArray(A)?A:[A],u,t,i,r,o,f,e,c),v.base=u.__e,u.__h=null,v.__h.length&&f.push(v),x&&(v.__E=v.__=null),v.__e=!1}else null==o&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=j(t.__e,u,t,i,r,o,f,c);(s=l.diffed)&&s(u)}catch(n){u.__v=null,(c||null!=o)&&(u.__e=e,u.__h=!!c,o[o.indexOf(e)]=null),l.__e(n,u,t)}}function T(n,u){l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u)})}catch(n){l.__e(n,u.__v)}})}function j(l,u,t,i,r,o,f,c){var s,a,h,p=t.props,y=u.props,d=u.type,k=0;if("svg"===d&&(r=!0),null!=o)for(;k<o.length;k++)if((s=o[k])&&(s===l||(d?s.localName==d:3==s.nodeType))){l=s,o[k]=null;break}if(null==l){if(null===d)return document.createTextNode(y);l=r?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,y.is&&y),o=null,c=!1}if(null===d)p===y||c&&l.data===y||(l.data=y);else{if(o=o&&n.call(l.childNodes),a=(p=t.props||e).dangerouslySetInnerHTML,h=y.dangerouslySetInnerHTML,!c){if(null!=o)for(p={},k=0;k<l.attributes.length;k++)p[l.attributes[k].name]=l.attributes[k].value;(h||a)&&(h&&(a&&h.__html==a.__html||h.__html===l.innerHTML)||(l.innerHTML=h&&h.__html||""))}if(A(l,y,p,r,c),h)u.__k=[];else if(k=u.props.children,m(l,Array.isArray(k)?k:[k],u,t,i,r&&"foreignObject"!==d,o,f,o?o[0]:t.__k&&_(t,0),c),null!=o)for(k=o.length;k--;)null!=o[k]&&v(o[k]);c||("value"in y&&void 0!==(k=y.value)&&(k!==l.value||"progress"===d&&!k)&&C(l,"value",k,p.value,!1),"checked"in y&&void 0!==(k=y.checked)&&k!==l.checked&&C(l,"checked",k,p.checked,!1))}return l}function z(n,u,t){try{"function"==typeof n?n(u):n.current=u}catch(n){l.__e(n,t)}}function L(n,u,t){var i,r;if(l.unmount&&l.unmount(n),(i=n.ref)&&(i.current&&i.current!==n.__e||z(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(n){l.__e(n,u)}i.base=i.__P=null}if(i=n.__k)for(r=0;r<i.length;r++)i[r]&&L(i[r],u,"function"!=typeof n.type);t||null==n.__e||v(n.__e),n.__e=n.__d=void 0}function M(n,l,u){return this.constructor(n,u)}function N(u,t,i){var r,o,f;l.__&&l.__(u,t),o=(r="function"==typeof i)?null:i&&i.__k||t.__k,f=[],I(t,u=(!r&&i||t).__k=h(y,null,[u]),o||e,e,void 0!==t.ownerSVGElement,!r&&i?[i]:o?null:t.firstChild?n.call(t.childNodes):null,f,!r&&i?i:o?o.__e:t.firstChild,r),T(f,u)}n=c.slice,l={__e:function(n,l){for(var u,t,i;l=l.__;)if((u=l.__c)&&!u.__)try{if((t=u.constructor)&&null!=t.getDerivedStateFromError&&(u.setState(t.getDerivedStateFromError(n)),i=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),i=u.__d),i)return u.__E=u}catch(l){n=l}throw n}},u=0,t=function(n){return null!=n&&void 0===n.constructor},d.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=a({},this.state),"function"==typeof n&&(n=n(a({},u),this.props)),n&&a(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),x(this))},d.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),x(this))},d.prototype.render=y,i=[],r="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,b.__r=0,f=0,exports.render=N,exports.hydrate=function n(l,u){N(l,u,n)},exports.createElement=h,exports.h=h,exports.Fragment=y,exports.createRef=function(){return{current:null}},exports.isValidElement=t,exports.Component=d,exports.cloneElement=function(l,u,t){var i,r,o,f=a({},l.props);for(o in u)"key"==o?i=u[o]:"ref"==o?r=u[o]:f[o]=u[o];return arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),p(l.type,f,i||l.key,r||l.ref,null)},exports.createContext=function(n,l){var u={__c:l="__cC"+f++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,t;return this.getChildContext||(u=[],(t={})[l]=this,this.getChildContext=function(){return t},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(x)},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Provider.__=u.Consumer.contextType=u},exports.toChildArray=function n(l,u){return u=u||[],null==l||"boolean"==typeof l||(Array.isArray(l)?l.some(function(l){n(l,u)}):u.push(l)),u},exports.options=l;


},{}],10:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],11:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encode(key);
      value = encode(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

},{}],12:[function(require,module,exports){
'use strict';

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isReactNative = _interopRequireDefault(require("./isReactNative"));

var _uriToBlob = _interopRequireDefault(require("./uriToBlob"));

var _isCordova = _interopRequireDefault(require("./isCordova"));

var _readAsByteArray = _interopRequireDefault(require("./readAsByteArray"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var FileSource = /*#__PURE__*/function () {
  // Make this.size a method
  function FileSource(file) {
    _classCallCheck(this, FileSource);

    this._file = file;
    this.size = file.size;
  }

  _createClass(FileSource, [{
    key: "slice",
    value: function slice(start, end) {
      // In Apache Cordova applications, a File must be resolved using
      // FileReader instances, see
      // https://cordova.apache.org/docs/en/8.x/reference/cordova-plugin-file/index.html#read-a-file
      if ((0, _isCordova.default)()) {
        return (0, _readAsByteArray.default)(this._file.slice(start, end));
      }

      var value = this._file.slice(start, end);

      return Promise.resolve({
        value: value
      });
    }
  }, {
    key: "close",
    value: function close() {// Nothing to do here since we don't need to release any resources.
    }
  }]);

  return FileSource;
}();

var StreamSource = /*#__PURE__*/function () {
  function StreamSource(reader, chunkSize) {
    _classCallCheck(this, StreamSource);

    this._chunkSize = chunkSize;
    this._buffer = undefined;
    this._bufferOffset = 0;
    this._reader = reader;
    this._done = false;
  }

  _createClass(StreamSource, [{
    key: "slice",
    value: function slice(start, end) {
      if (start < this._bufferOffset) {
        return Promise.reject(new Error("Requested data is before the reader's current offset"));
      }

      return this._readUntilEnoughDataOrDone(start, end);
    }
  }, {
    key: "_readUntilEnoughDataOrDone",
    value: function _readUntilEnoughDataOrDone(start, end) {
      var _this = this;

      var hasEnoughData = end <= this._bufferOffset + len(this._buffer);

      if (this._done || hasEnoughData) {
        var value = this._getDataFromBuffer(start, end);

        var done = value == null ? this._done : false;
        return Promise.resolve({
          value: value,
          done: done
        });
      }

      return this._reader.read().then(function (_ref) {
        var value = _ref.value,
            done = _ref.done;

        if (done) {
          _this._done = true;
        } else if (_this._buffer === undefined) {
          _this._buffer = value;
        } else {
          _this._buffer = concat(_this._buffer, value);
        }

        return _this._readUntilEnoughDataOrDone(start, end);
      });
    }
  }, {
    key: "_getDataFromBuffer",
    value: function _getDataFromBuffer(start, end) {
      // Remove data from buffer before `start`.
      // Data might be reread from the buffer if an upload fails, so we can only
      // safely delete data when it comes *before* what is currently being read.
      if (start > this._bufferOffset) {
        this._buffer = this._buffer.slice(start - this._bufferOffset);
        this._bufferOffset = start;
      } // If the buffer is empty after removing old data, all data has been read.


      var hasAllDataBeenRead = len(this._buffer) === 0;

      if (this._done && hasAllDataBeenRead) {
        return null;
      } // We already removed data before `start`, so we just return the first
      // chunk from the buffer.


      return this._buffer.slice(0, end - start);
    }
  }, {
    key: "close",
    value: function close() {
      if (this._reader.cancel) {
        this._reader.cancel();
      }
    }
  }]);

  return StreamSource;
}();

function len(blobOrArray) {
  if (blobOrArray === undefined) return 0;
  if (blobOrArray.size !== undefined) return blobOrArray.size;
  return blobOrArray.length;
}
/*
  Typed arrays and blobs don't have a concat method.
  This function helps StreamSource accumulate data to reach chunkSize.
*/


function concat(a, b) {
  if (a.concat) {
    // Is `a` an Array?
    return a.concat(b);
  }

  if (a instanceof Blob) {
    return new Blob([a, b], {
      type: a.type
    });
  }

  if (a.set) {
    // Is `a` a typed array?
    var c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }

  throw new Error('Unknown data type');
}

var FileReader = /*#__PURE__*/function () {
  function FileReader() {
    _classCallCheck(this, FileReader);
  }

  _createClass(FileReader, [{
    key: "openFile",
    value: function openFile(input, chunkSize) {
      // In React Native, when user selects a file, instead of a File or Blob,
      // you usually get a file object {} with a uri property that contains
      // a local path to the file. We use XMLHttpRequest to fetch
      // the file blob, before uploading with tus.
      if ((0, _isReactNative.default)() && input && typeof input.uri !== 'undefined') {
        return (0, _uriToBlob.default)(input.uri).then(function (blob) {
          return new FileSource(blob);
        })["catch"](function (err) {
          throw new Error("tus: cannot fetch `file.uri` as Blob, make sure the uri is correct and accessible. ".concat(err));
        });
      } // Since we emulate the Blob type in our tests (not all target browsers
      // support it), we cannot use `instanceof` for testing whether the input value
      // can be handled. Instead, we simply check is the slice() function and the
      // size property are available.


      if (typeof input.slice === 'function' && typeof input.size !== 'undefined') {
        return Promise.resolve(new FileSource(input));
      }

      if (typeof input.read === 'function') {
        chunkSize = +chunkSize;

        if (!isFinite(chunkSize)) {
          return Promise.reject(new Error('cannot create source for stream without a finite value for the `chunkSize` option'));
        }

        return Promise.resolve(new StreamSource(input, chunkSize));
      }

      return Promise.reject(new Error('source object may only be an instance of File, Blob, or Reader in this environment'));
    }
  }]);

  return FileReader;
}();

exports.default = FileReader;
},{"./isCordova":17,"./isReactNative":18,"./readAsByteArray":19,"./uriToBlob":20}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fingerprint;

var _isReactNative = _interopRequireDefault(require("./isReactNative"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Differenciate between input types

/**
 * Generate a fingerprint for a file which will be used the store the endpoint
 *
 * @param {File} file
 * @param {Object} options
 * @param {Function} callback
 */
function fingerprint(file, options) {
  if ((0, _isReactNative.default)()) {
    return Promise.resolve(reactNativeFingerprint(file, options));
  }

  return Promise.resolve(['tus-br', file.name, file.type, file.size, file.lastModified, options.endpoint].join('-'));
}

function reactNativeFingerprint(file, options) {
  var exifHash = file.exif ? hashCode(JSON.stringify(file.exif)) : 'noexif';
  return ['tus-rn', file.name || 'noname', file.size || 'nosize', exifHash, options.endpoint].join('/');
}

function hashCode(str) {
  // from https://stackoverflow.com/a/8831937/151666
  var hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (var i = 0; i < str.length; i++) {
    var _char = str.charCodeAt(i);

    hash = (hash << 5) - hash + _char;
    hash &= hash; // Convert to 32bit integer
  }

  return hash;
}
},{"./isReactNative":18}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* global window */


var XHRHttpStack = /*#__PURE__*/function () {
  function XHRHttpStack() {
    _classCallCheck(this, XHRHttpStack);
  }

  _createClass(XHRHttpStack, [{
    key: "createRequest",
    value: function createRequest(method, url) {
      return new Request(method, url);
    }
  }, {
    key: "getName",
    value: function getName() {
      return 'XHRHttpStack';
    }
  }]);

  return XHRHttpStack;
}();

exports.default = XHRHttpStack;

var Request = /*#__PURE__*/function () {
  function Request(method, url) {
    _classCallCheck(this, Request);

    this._xhr = new XMLHttpRequest();

    this._xhr.open(method, url, true);

    this._method = method;
    this._url = url;
    this._headers = {};
  }

  _createClass(Request, [{
    key: "getMethod",
    value: function getMethod() {
      return this._method;
    }
  }, {
    key: "getURL",
    value: function getURL() {
      return this._url;
    }
  }, {
    key: "setHeader",
    value: function setHeader(header, value) {
      this._xhr.setRequestHeader(header, value);

      this._headers[header] = value;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._headers[header];
    }
  }, {
    key: "setProgressHandler",
    value: function setProgressHandler(progressHandler) {
      // Test support for progress events before attaching an event listener
      if (!('upload' in this._xhr)) {
        return;
      }

      this._xhr.upload.onprogress = function (e) {
        if (!e.lengthComputable) {
          return;
        }

        progressHandler(e.loaded);
      };
    }
  }, {
    key: "send",
    value: function send() {
      var _this = this;

      var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return new Promise(function (resolve, reject) {
        _this._xhr.onload = function () {
          resolve(new Response(_this._xhr));
        };

        _this._xhr.onerror = function (err) {
          reject(err);
        };

        _this._xhr.send(body);
      });
    }
  }, {
    key: "abort",
    value: function abort() {
      this._xhr.abort();

      return Promise.resolve();
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      return this._xhr;
    }
  }]);

  return Request;
}();

var Response = /*#__PURE__*/function () {
  function Response(xhr) {
    _classCallCheck(this, Response);

    this._xhr = xhr;
  }

  _createClass(Response, [{
    key: "getStatus",
    value: function getStatus() {
      return this._xhr.status;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._xhr.getResponseHeader(header);
    }
  }, {
    key: "getBody",
    value: function getBody() {
      return this._xhr.responseText;
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      return this._xhr;
    }
  }]);

  return Response;
}();
},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "enableDebugLog", {
  enumerable: true,
  get: function () {
    return _logger.enableDebugLog;
  }
});
Object.defineProperty(exports, "canStoreURLs", {
  enumerable: true,
  get: function () {
    return _urlStorage.canStoreURLs;
  }
});
Object.defineProperty(exports, "HttpStack", {
  enumerable: true,
  get: function () {
    return _httpStack.default;
  }
});
exports.isSupported = exports.defaultOptions = exports.Upload = void 0;

var _upload = _interopRequireDefault(require("../upload"));

var _noopUrlStorage = _interopRequireDefault(require("../noopUrlStorage"));

var _logger = require("../logger");

var _urlStorage = require("./urlStorage");

var _httpStack = _interopRequireDefault(require("./httpStack"));

var _fileReader = _interopRequireDefault(require("./fileReader"));

var _fingerprint = _interopRequireDefault(require("./fingerprint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/* global window */


var defaultOptions = _objectSpread({}, _upload.default.defaultOptions, {
  httpStack: new _httpStack.default(),
  fileReader: new _fileReader.default(),
  urlStorage: _urlStorage.canStoreURLs ? new _urlStorage.WebStorageUrlStorage() : new _noopUrlStorage.default(),
  fingerprint: _fingerprint.default
});

exports.defaultOptions = defaultOptions;

var Upload = /*#__PURE__*/function (_BaseUpload) {
  _inherits(Upload, _BaseUpload);

  var _super = _createSuper(Upload);

  function Upload() {
    var file = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Upload);

    options = _objectSpread({}, defaultOptions, {}, options);
    return _super.call(this, file, options);
  }

  _createClass(Upload, null, [{
    key: "terminate",
    value: function terminate(url, options, cb) {
      options = _objectSpread({}, defaultOptions, {}, options);
      return _upload.default.terminate(url, options, cb);
    }
  }]);

  return Upload;
}(_upload.default);

exports.Upload = Upload;
var _window = window,
    XMLHttpRequest = _window.XMLHttpRequest,
    Blob = _window.Blob;
var isSupported = XMLHttpRequest && Blob && typeof Blob.prototype.slice === 'function';
exports.isSupported = isSupported;
},{"../logger":23,"../noopUrlStorage":24,"../upload":25,"./fileReader":13,"./fingerprint":14,"./httpStack":15,"./urlStorage":21}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var isCordova = function isCordova() {
  return typeof window != 'undefined' && (typeof window.PhoneGap != 'undefined' || typeof window.Cordova != 'undefined' || typeof window.cordova != 'undefined');
};

var _default = isCordova;
exports.default = _default;
},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var isReactNative = function isReactNative() {
  return typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative';
};

var _default = isReactNative;
exports.default = _default;
},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = readAsByteArray;

/**
 * readAsByteArray converts a File object to a Uint8Array.
 * This function is only used on the Apache Cordova platform.
 * See https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html#read-a-file
 */
function readAsByteArray(chunk) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();

    reader.onload = function () {
      var value = new Uint8Array(reader.result);
      resolve({
        value: value
      });
    };

    reader.onerror = function (err) {
      reject(err);
    };

    reader.readAsArrayBuffer(chunk);
  });
}
},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uriToBlob;

/**
 * uriToBlob resolves a URI to a Blob object. This is used for
 * React Native to retrieve a file (identified by a file://
 * URI) as a blob.
 */
function uriToBlob(uri) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';

    xhr.onload = function () {
      var blob = xhr.response;
      resolve(blob);
    };

    xhr.onerror = function (err) {
      reject(err);
    };

    xhr.open('GET', uri);
    xhr.send();
  });
}
},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebStorageUrlStorage = exports.canStoreURLs = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* global window, localStorage */


var hasStorage = false;

try {
  hasStorage = 'localStorage' in window; // Attempt to store and read entries from the local storage to detect Private
  // Mode on Safari on iOS (see #49)

  var key = 'tusSupport';
  localStorage.setItem(key, localStorage.getItem(key));
} catch (e) {
  // If we try to access localStorage inside a sandboxed iframe, a SecurityError
  // is thrown. When in private mode on iOS Safari, a QuotaExceededError is
  // thrown (see #49)
  if (e.code === e.SECURITY_ERR || e.code === e.QUOTA_EXCEEDED_ERR) {
    hasStorage = false;
  } else {
    throw e;
  }
}

var canStoreURLs = hasStorage;
exports.canStoreURLs = canStoreURLs;

var WebStorageUrlStorage = /*#__PURE__*/function () {
  function WebStorageUrlStorage() {
    _classCallCheck(this, WebStorageUrlStorage);
  }

  _createClass(WebStorageUrlStorage, [{
    key: "findAllUploads",
    value: function findAllUploads() {
      var results = this._findEntries('tus::');

      return Promise.resolve(results);
    }
  }, {
    key: "findUploadsByFingerprint",
    value: function findUploadsByFingerprint(fingerprint) {
      var results = this._findEntries("tus::".concat(fingerprint, "::"));

      return Promise.resolve(results);
    }
  }, {
    key: "removeUpload",
    value: function removeUpload(urlStorageKey) {
      localStorage.removeItem(urlStorageKey);
      return Promise.resolve();
    }
  }, {
    key: "addUpload",
    value: function addUpload(fingerprint, upload) {
      var id = Math.round(Math.random() * 1e12);
      var key = "tus::".concat(fingerprint, "::").concat(id);
      localStorage.setItem(key, JSON.stringify(upload));
      return Promise.resolve(key);
    }
  }, {
    key: "_findEntries",
    value: function _findEntries(prefix) {
      var results = [];

      for (var i = 0; i < localStorage.length; i++) {
        var _key = localStorage.key(i);

        if (_key.indexOf(prefix) !== 0) continue;

        try {
          var upload = JSON.parse(localStorage.getItem(_key));
          upload.urlStorageKey = _key;
          results.push(upload);
        } catch (e) {// The JSON parse error is intentionally ignored here, so a malformed
          // entry in the storage cannot prevent an upload.
        }
      }

      return results;
    }
  }]);

  return WebStorageUrlStorage;
}();

exports.WebStorageUrlStorage = WebStorageUrlStorage;
},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

var DetailedError = /*#__PURE__*/function (_Error) {
  _inherits(DetailedError, _Error);

  var _super = _createSuper(DetailedError);

  function DetailedError(message) {
    var _this;

    var causingErr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var req = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var res = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, DetailedError);

    _this = _super.call(this, message);
    _this.originalRequest = req;
    _this.originalResponse = res;
    _this.causingError = causingErr;

    if (causingErr != null) {
      message += ", caused by ".concat(causingErr.toString());
    }

    if (req != null) {
      var requestId = req.getHeader('X-Request-ID') || 'n/a';
      var method = req.getMethod();
      var url = req.getURL();
      var status = res ? res.getStatus() : 'n/a';
      var body = res ? res.getBody() || '' : 'n/a';
      message += ", originated from request (method: ".concat(method, ", url: ").concat(url, ", response code: ").concat(status, ", response text: ").concat(body, ", request id: ").concat(requestId, ")");
    }

    _this.message = message;
    return _this;
  }

  return DetailedError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var _default = DetailedError;
exports.default = _default;
},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableDebugLog = enableDebugLog;
exports.log = log;

/* eslint no-console: "off" */
var isEnabled = false;

function enableDebugLog() {
  isEnabled = true;
}

function log(msg) {
  if (!isEnabled) return;
  console.log(msg);
}
},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* eslint no-unused-vars: "off" */


var NoopUrlStorage = /*#__PURE__*/function () {
  function NoopUrlStorage() {
    _classCallCheck(this, NoopUrlStorage);
  }

  _createClass(NoopUrlStorage, [{
    key: "listAllUploads",
    value: function listAllUploads() {
      return Promise.resolve([]);
    }
  }, {
    key: "findUploadsByFingerprint",
    value: function findUploadsByFingerprint(fingerprint) {
      return Promise.resolve([]);
    }
  }, {
    key: "removeUpload",
    value: function removeUpload(urlStorageKey) {
      return Promise.resolve();
    }
  }, {
    key: "addUpload",
    value: function addUpload(fingerprint, upload) {
      return Promise.resolve(null);
    }
  }]);

  return NoopUrlStorage;
}();

exports.default = NoopUrlStorage;
},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsBase = require("js-base64");

var _urlParse = _interopRequireDefault(require("url-parse"));

var _error = _interopRequireDefault(require("./error"));

var _logger = require("./logger");

var _uuid = _interopRequireDefault(require("./uuid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* global window */


var defaultOptions = {
  endpoint: null,
  uploadUrl: null,
  metadata: {},
  fingerprint: null,
  uploadSize: null,
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  _onUploadUrlAvailable: null,
  overridePatchMethod: false,
  headers: {},
  addRequestId: false,
  onBeforeRequest: null,
  onAfterResponse: null,
  onShouldRetry: null,
  chunkSize: Infinity,
  retryDelays: [0, 1000, 3000, 5000],
  parallelUploads: 1,
  storeFingerprintForResuming: true,
  removeFingerprintOnSuccess: false,
  uploadLengthDeferred: false,
  uploadDataDuringCreation: false,
  urlStorage: null,
  fileReader: null,
  httpStack: null
};

var BaseUpload = /*#__PURE__*/function () {
  function BaseUpload(file, options) {
    _classCallCheck(this, BaseUpload); // Warn about removed options from previous versions


    if ('resume' in options) {
      console.log('tus: The `resume` option has been removed in tus-js-client v2. Please use the URL storage API instead.'); // eslint-disable-line no-console
    } // The default options will already be added from the wrapper classes.


    this.options = options; // The storage module used to store URLs

    this._urlStorage = this.options.urlStorage; // The underlying File/Blob object

    this.file = file; // The URL against which the file will be uploaded

    this.url = null; // The underlying request object for the current PATCH request

    this._req = null; // The fingerpinrt for the current file (set after start())

    this._fingerprint = null; // The key that the URL storage returned when saving an URL with a fingerprint,

    this._urlStorageKey = null; // The offset used in the current PATCH request

    this._offset = null; // True if the current PATCH request has been aborted

    this._aborted = false; // The file's size in bytes

    this._size = null; // The Source object which will wrap around the given file and provides us
    // with a unified interface for getting its size and slice chunks from its
    // content allowing us to easily handle Files, Blobs, Buffers and Streams.

    this._source = null; // The current count of attempts which have been made. Zero indicates none.

    this._retryAttempt = 0; // The timeout's ID which is used to delay the next retry

    this._retryTimeout = null; // The offset of the remote upload before the latest attempt was started.

    this._offsetBeforeRetry = 0; // An array of BaseUpload instances which are used for uploading the different
    // parts, if the parallelUploads option is used.

    this._parallelUploads = null; // An array of upload URLs which are used for uploading the different
    // parts, if the parallelUploads option is used.

    this._parallelUploadUrls = null;
  }
  /**
   * Use the Termination extension to delete an upload from the server by sending a DELETE
   * request to the specified upload URL. This is only possible if the server supports the
   * Termination extension. If the `options.retryDelays` property is set, the method will
   * also retry if an error ocurrs.
   *
   * @param {String} url The upload's URL which will be terminated.
   * @param {object} options Optional options for influencing HTTP requests.
   * @return {Promise} The Promise will be resolved/rejected when the requests finish.
   */


  _createClass(BaseUpload, [{
    key: "findPreviousUploads",
    value: function findPreviousUploads() {
      var _this = this;

      return this.options.fingerprint(this.file, this.options).then(function (fingerprint) {
        return _this._urlStorage.findUploadsByFingerprint(fingerprint);
      });
    }
  }, {
    key: "resumeFromPreviousUpload",
    value: function resumeFromPreviousUpload(previousUpload) {
      this.url = previousUpload.uploadUrl || null;
      this._parallelUploadUrls = previousUpload.parallelUploadUrls || null;
      this._urlStorageKey = previousUpload.urlStorageKey;
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      var file = this.file;

      if (!file) {
        this._emitError(new Error('tus: no file or stream to upload provided'));

        return;
      }

      if (!this.options.endpoint && !this.options.uploadUrl) {
        this._emitError(new Error('tus: neither an endpoint or an upload URL is provided'));

        return;
      }

      var retryDelays = this.options.retryDelays;

      if (retryDelays != null && Object.prototype.toString.call(retryDelays) !== '[object Array]') {
        this._emitError(new Error('tus: the `retryDelays` option must either be an array or null'));

        return;
      }

      if (this.options.parallelUploads > 1) {
        // Test which options are incompatible with parallel uploads.
        ['uploadUrl', 'uploadSize', 'uploadLengthDeferred'].forEach(function (optionName) {
          if (_this2.options[optionName]) {
            _this2._emitError(new Error("tus: cannot use the ".concat(optionName, " option when parallelUploads is enabled")));
          }
        });
      }

      this.options.fingerprint(file, this.options).then(function (fingerprint) {
        if (fingerprint == null) {
          (0, _logger.log)('No fingerprint was calculated meaning that the upload cannot be stored in the URL storage.');
        } else {
          (0, _logger.log)("Calculated fingerprint: ".concat(fingerprint));
        }

        _this2._fingerprint = fingerprint;

        if (_this2._source) {
          return _this2._source;
        }

        return _this2.options.fileReader.openFile(file, _this2.options.chunkSize);
      }).then(function (source) {
        _this2._source = source; // If the upload was configured to use multiple requests or if we resume from
        // an upload which used multiple requests, we start a parallel upload.

        if (_this2.options.parallelUploads > 1 || _this2._parallelUploadUrls != null) {
          _this2._startParallelUpload();
        } else {
          _this2._startSingleUpload();
        }
      })["catch"](function (err) {
        _this2._emitError(err);
      });
    }
    /**
     * Initiate the uploading procedure for a parallelized upload, where one file is split into
     * multiple request which are run in parallel.
     *
     * @api private
     */

  }, {
    key: "_startParallelUpload",
    value: function _startParallelUpload() {
      var _this3 = this;

      var totalSize = this._size = this._source.size;
      var totalProgress = 0;
      this._parallelUploads = [];
      var partCount = this._parallelUploadUrls != null ? this._parallelUploadUrls.length : this.options.parallelUploads; // The input file will be split into multiple slices which are uploaded in separate
      // requests. Here we generate the start and end position for the slices.

      var parts = splitSizeIntoParts(this._source.size, partCount, this._parallelUploadUrls); // Create an empty list for storing the upload URLs

      this._parallelUploadUrls = new Array(parts.length); // Generate a promise for each slice that will be resolve if the respective
      // upload is completed.

      var uploads = parts.map(function (part, index) {
        var lastPartProgress = 0;
        return _this3._source.slice(part.start, part.end).then(function (_ref) {
          var value = _ref.value;
          return new Promise(function (resolve, reject) {
            // Merge with the user supplied options but overwrite some values.
            var options = _objectSpread({}, _this3.options, {
              // If available, the partial upload should be resumed from a previous URL.
              uploadUrl: part.uploadUrl || null,
              // We take manually care of resuming for partial uploads, so they should
              // not be stored in the URL storage.
              storeFingerprintForResuming: false,
              removeFingerprintOnSuccess: false,
              // Reset the parallelUploads option to not cause recursion.
              parallelUploads: 1,
              metadata: {},
              // Add the header to indicate the this is a partial upload.
              headers: _objectSpread({}, _this3.options.headers, {
                'Upload-Concat': 'partial'
              }),
              // Reject or resolve the promise if the upload errors or completes.
              onSuccess: resolve,
              onError: reject,
              // Based in the progress for this partial upload, calculate the progress
              // for the entire final upload.
              onProgress: function onProgress(newPartProgress) {
                totalProgress = totalProgress - lastPartProgress + newPartProgress;
                lastPartProgress = newPartProgress;

                _this3._emitProgress(totalProgress, totalSize);
              },
              // Wait until every partial upload has an upload URL, so we can add
              // them to the URL storage.
              _onUploadUrlAvailable: function _onUploadUrlAvailable() {
                _this3._parallelUploadUrls[index] = upload.url; // Test if all uploads have received an URL

                if (_this3._parallelUploadUrls.filter(function (u) {
                  return !!u;
                }).length === parts.length) {
                  _this3._saveUploadInUrlStorage();
                }
              }
            });

            var upload = new BaseUpload(value, options);
            upload.start(); // Store the upload in an array, so we can later abort them if necessary.

            _this3._parallelUploads.push(upload);
          });
        });
      });
      var req; // Wait until all partial uploads are finished and we can send the POST request for
      // creating the final upload.

      Promise.all(uploads).then(function () {
        req = _this3._openRequest('POST', _this3.options.endpoint);
        req.setHeader('Upload-Concat', "final;".concat(_this3._parallelUploadUrls.join(' '))); // Add metadata if values have been added

        var metadata = encodeMetadata(_this3.options.metadata);

        if (metadata !== '') {
          req.setHeader('Upload-Metadata', metadata);
        }

        return _this3._sendRequest(req, null);
      }).then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this3._emitHttpError(req, res, 'tus: unexpected response while creating upload');

          return;
        }

        var location = res.getHeader('Location');

        if (location == null) {
          _this3._emitHttpError(req, res, 'tus: invalid or missing Location header');

          return;
        }

        _this3.url = resolveUrl(_this3.options.endpoint, location);
        (0, _logger.log)("Created upload at ".concat(_this3.url));

        _this3._emitSuccess();
      })["catch"](function (err) {
        _this3._emitError(err);
      });
    }
    /**
     * Initiate the uploading procedure for a non-parallel upload. Here the entire file is
     * uploaded in a sequential matter.
     *
     * @api private
     */

  }, {
    key: "_startSingleUpload",
    value: function _startSingleUpload() {
      // First, we look at the uploadLengthDeferred option.
      // Next, we check if the caller has supplied a manual upload size.
      // Finally, we try to use the calculated size from the source object.
      if (this.options.uploadLengthDeferred) {
        this._size = null;
      } else if (this.options.uploadSize != null) {
        this._size = +this.options.uploadSize;

        if (isNaN(this._size)) {
          this._emitError(new Error('tus: cannot convert `uploadSize` option into a number'));

          return;
        }
      } else {
        this._size = this._source.size;

        if (this._size == null) {
          this._emitError(new Error("tus: cannot automatically derive upload's size from input and must be specified manually using the `uploadSize` option"));

          return;
        }
      } // Reset the aborted flag when the upload is started or else the
      // _performUpload will stop before sending a request if the upload has been
      // aborted previously.


      this._aborted = false; // The upload had been started previously and we should reuse this URL.

      if (this.url != null) {
        (0, _logger.log)("Resuming upload from previous URL: ".concat(this.url));

        this._resumeUpload();

        return;
      } // A URL has manually been specified, so we try to resume


      if (this.options.uploadUrl != null) {
        (0, _logger.log)("Resuming upload from provided URL: ".concat(this.options.url));
        this.url = this.options.uploadUrl;

        this._resumeUpload();

        return;
      } // An upload has not started for the file yet, so we start a new one


      (0, _logger.log)('Creating a new upload');

      this._createUpload();
    }
    /**
     * Abort any running request and stop the current upload. After abort is called, no event
     * handler will be invoked anymore. You can use the `start` method to resume the upload
     * again.
     * If `shouldTerminate` is true, the `terminate` function will be called to remove the
     * current upload from the server.
     *
     * @param {boolean} shouldTerminate True if the upload should be deleted from the server.
     * @return {Promise} The Promise will be resolved/rejected when the requests finish.
     */

  }, {
    key: "abort",
    value: function abort(shouldTerminate) {
      var _this4 = this; // Count the number of arguments to see if a callback is being provided in the old style required by tus-js-client 1.x, then throw an error if it is.
      // `arguments` is a JavaScript built-in variable that contains all of the function's arguments.


      if (arguments.length > 1 && typeof arguments[1] === 'function') {
        throw new Error('tus: the abort function does not accept a callback since v2 anymore; please use the returned Promise instead');
      } // Stop any parallel partial uploads, that have been started in _startParallelUploads.


      if (this._parallelUploads != null) {
        this._parallelUploads.forEach(function (upload) {
          upload.abort(shouldTerminate);
        });
      } // Stop any current running request.


      if (this._req !== null) {
        this._req.abort();

        this._source.close();
      }

      this._aborted = true; // Stop any timeout used for initiating a retry.

      if (this._retryTimeout != null) {
        clearTimeout(this._retryTimeout);
        this._retryTimeout = null;
      }

      if (!shouldTerminate || this.url == null) {
        return Promise.resolve();
      }

      return BaseUpload.terminate(this.url, this.options) // Remove entry from the URL storage since the upload URL is no longer valid.
      .then(function () {
        return _this4._removeFromUrlStorage();
      });
    }
  }, {
    key: "_emitHttpError",
    value: function _emitHttpError(req, res, message, causingErr) {
      this._emitError(new _error.default(message, causingErr, req, res));
    }
  }, {
    key: "_emitError",
    value: function _emitError(err) {
      var _this5 = this; // Do not emit errors, e.g. from aborted HTTP requests, if the upload has been stopped.


      if (this._aborted) return; // Check if we should retry, when enabled, before sending the error to the user.

      if (this.options.retryDelays != null) {
        // We will reset the attempt counter if
        // - we were already able to connect to the server (offset != null) and
        // - we were able to upload a small chunk of data to the server
        var shouldResetDelays = this._offset != null && this._offset > this._offsetBeforeRetry;

        if (shouldResetDelays) {
          this._retryAttempt = 0;
        }

        if (shouldRetry(err, this._retryAttempt, this.options)) {
          var delay = this.options.retryDelays[this._retryAttempt++];
          this._offsetBeforeRetry = this._offset;
          this._retryTimeout = setTimeout(function () {
            _this5.start();
          }, delay);
          return;
        }
      }

      if (typeof this.options.onError === 'function') {
        this.options.onError(err);
      } else {
        throw err;
      }
    }
    /**
     * Publishes notification if the upload has been successfully completed.
     *
     * @api private
     */

  }, {
    key: "_emitSuccess",
    value: function _emitSuccess() {
      if (this.options.removeFingerprintOnSuccess) {
        // Remove stored fingerprint and corresponding endpoint. This causes
        // new uploads of the same file to be treated as a different file.
        this._removeFromUrlStorage();
      }

      if (typeof this.options.onSuccess === 'function') {
        this.options.onSuccess();
      }
    }
    /**
     * Publishes notification when data has been sent to the server. This
     * data may not have been accepted by the server yet.
     *
     * @param {number} bytesSent  Number of bytes sent to the server.
     * @param {number} bytesTotal Total number of bytes to be sent to the server.
     * @api private
     */

  }, {
    key: "_emitProgress",
    value: function _emitProgress(bytesSent, bytesTotal) {
      if (typeof this.options.onProgress === 'function') {
        this.options.onProgress(bytesSent, bytesTotal);
      }
    }
    /**
     * Publishes notification when a chunk of data has been sent to the server
     * and accepted by the server.
     * @param {number} chunkSize  Size of the chunk that was accepted by the server.
     * @param {number} bytesAccepted Total number of bytes that have been
     *                                accepted by the server.
     * @param {number} bytesTotal Total number of bytes to be sent to the server.
     * @api private
     */

  }, {
    key: "_emitChunkComplete",
    value: function _emitChunkComplete(chunkSize, bytesAccepted, bytesTotal) {
      if (typeof this.options.onChunkComplete === 'function') {
        this.options.onChunkComplete(chunkSize, bytesAccepted, bytesTotal);
      }
    }
    /**
     * Create a new upload using the creation extension by sending a POST
     * request to the endpoint. After successful creation the file will be
     * uploaded
     *
     * @api private
     */

  }, {
    key: "_createUpload",
    value: function _createUpload() {
      var _this6 = this;

      if (!this.options.endpoint) {
        this._emitError(new Error('tus: unable to create upload because no endpoint is provided'));

        return;
      }

      var req = this._openRequest('POST', this.options.endpoint);

      if (this.options.uploadLengthDeferred) {
        req.setHeader('Upload-Defer-Length', 1);
      } else {
        req.setHeader('Upload-Length', this._size);
      } // Add metadata if values have been added


      var metadata = encodeMetadata(this.options.metadata);

      if (metadata !== '') {
        req.setHeader('Upload-Metadata', metadata);
      }

      var promise;

      if (this.options.uploadDataDuringCreation && !this.options.uploadLengthDeferred) {
        this._offset = 0;
        promise = this._addChunkToRequest(req);
      } else {
        promise = this._sendRequest(req, null);
      }

      promise.then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this6._emitHttpError(req, res, 'tus: unexpected response while creating upload');

          return;
        }

        var location = res.getHeader('Location');

        if (location == null) {
          _this6._emitHttpError(req, res, 'tus: invalid or missing Location header');

          return;
        }

        _this6.url = resolveUrl(_this6.options.endpoint, location);
        (0, _logger.log)("Created upload at ".concat(_this6.url));

        if (typeof _this6.options._onUploadUrlAvailable === 'function') {
          _this6.options._onUploadUrlAvailable();
        }

        if (_this6._size === 0) {
          // Nothing to upload and file was successfully created
          _this6._emitSuccess();

          _this6._source.close();

          return;
        }

        _this6._saveUploadInUrlStorage();

        if (_this6.options.uploadDataDuringCreation) {
          _this6._handleUploadResponse(req, res);
        } else {
          _this6._offset = 0;

          _this6._performUpload();
        }
      })["catch"](function (err) {
        _this6._emitHttpError(req, null, 'tus: failed to create upload', err);
      });
    }
    /*
     * Try to resume an existing upload. First a HEAD request will be sent
     * to retrieve the offset. If the request fails a new upload will be
     * created. In the case of a successful response the file will be uploaded.
     *
     * @api private
     */

  }, {
    key: "_resumeUpload",
    value: function _resumeUpload() {
      var _this7 = this;

      var req = this._openRequest('HEAD', this.url);

      var promise = this._sendRequest(req, null);

      promise.then(function (res) {
        var status = res.getStatus();

        if (!inStatusCategory(status, 200)) {
          if (inStatusCategory(status, 400)) {
            // Remove stored fingerprint and corresponding endpoint,
            // on client errors since the file can not be found
            _this7._removeFromUrlStorage();
          } // If the upload is locked (indicated by the 423 Locked status code), we
          // emit an error instead of directly starting a new upload. This way the
          // retry logic can catch the error and will retry the upload. An upload
          // is usually locked for a short period of time and will be available
          // afterwards.


          if (status === 423) {
            _this7._emitHttpError(req, res, 'tus: upload is currently locked; retry later');

            return;
          }

          if (!_this7.options.endpoint) {
            // Don't attempt to create a new upload if no endpoint is provided.
            _this7._emitHttpError(req, res, 'tus: unable to resume upload (new upload cannot be created without an endpoint)');

            return;
          } // Try to create a new upload


          _this7.url = null;

          _this7._createUpload();

          return;
        }

        var offset = parseInt(res.getHeader('Upload-Offset'), 10);

        if (isNaN(offset)) {
          _this7._emitHttpError(req, res, 'tus: invalid or missing offset value');

          return;
        }

        var length = parseInt(res.getHeader('Upload-Length'), 10);

        if (isNaN(length) && !_this7.options.uploadLengthDeferred) {
          _this7._emitHttpError(req, res, 'tus: invalid or missing length value');

          return;
        }

        if (typeof _this7.options._onUploadUrlAvailable === 'function') {
          _this7.options._onUploadUrlAvailable();
        } // Upload has already been completed and we do not need to send additional
        // data to the server


        if (offset === length) {
          _this7._emitProgress(length, length);

          _this7._emitSuccess();

          return;
        }

        _this7._offset = offset;

        _this7._performUpload();
      })["catch"](function (err) {
        _this7._emitHttpError(req, null, 'tus: failed to resume upload', err);
      });
    }
    /**
     * Start uploading the file using PATCH requests. The file will be divided
     * into chunks as specified in the chunkSize option. During the upload
     * the onProgress event handler may be invoked multiple times.
     *
     * @api private
     */

  }, {
    key: "_performUpload",
    value: function _performUpload() {
      var _this8 = this; // If the upload has been aborted, we will not send the next PATCH request.
      // This is important if the abort method was called during a callback, such
      // as onChunkComplete or onProgress.


      if (this._aborted) {
        return;
      }

      var req; // Some browser and servers may not support the PATCH method. For those
      // cases, you can tell tus-js-client to use a POST request with the
      // X-HTTP-Method-Override header for simulating a PATCH request.

      if (this.options.overridePatchMethod) {
        req = this._openRequest('POST', this.url);
        req.setHeader('X-HTTP-Method-Override', 'PATCH');
      } else {
        req = this._openRequest('PATCH', this.url);
      }

      req.setHeader('Upload-Offset', this._offset);

      var promise = this._addChunkToRequest(req);

      promise.then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this8._emitHttpError(req, res, 'tus: unexpected response while uploading chunk');

          return;
        }

        _this8._handleUploadResponse(req, res);
      })["catch"](function (err) {
        // Don't emit an error if the upload was aborted manually
        if (_this8._aborted) {
          return;
        }

        _this8._emitHttpError(req, null, "tus: failed to upload chunk at offset ".concat(_this8._offset), err);
      });
    }
    /**
     * _addChunktoRequest reads a chunk from the source and sends it using the
     * supplied request object. It will not handle the response.
     *
     * @api private
     */

  }, {
    key: "_addChunkToRequest",
    value: function _addChunkToRequest(req) {
      var _this9 = this;

      var start = this._offset;
      var end = this._offset + this.options.chunkSize;
      req.setProgressHandler(function (bytesSent) {
        _this9._emitProgress(start + bytesSent, _this9._size);
      });
      req.setHeader('Content-Type', 'application/offset+octet-stream'); // The specified chunkSize may be Infinity or the calcluated end position
      // may exceed the file's size. In both cases, we limit the end position to
      // the input's total size for simpler calculations and correctness.

      if ((end === Infinity || end > this._size) && !this.options.uploadLengthDeferred) {
        end = this._size;
      }

      return this._source.slice(start, end).then(function (_ref2) {
        var value = _ref2.value,
            done = _ref2.done; // If the upload length is deferred, the upload size was not specified during
        // upload creation. So, if the file reader is done reading, we know the total
        // upload size and can tell the tus server.

        if (_this9.options.uploadLengthDeferred && done) {
          _this9._size = _this9._offset + (value && value.size ? value.size : 0);
          req.setHeader('Upload-Length', _this9._size);
        }

        if (value === null) {
          return _this9._sendRequest(req);
        }

        _this9._emitProgress(_this9._offset, _this9._size);

        return _this9._sendRequest(req, value);
      });
    }
    /**
     * _handleUploadResponse is used by requests that haven been sent using _addChunkToRequest
     * and already have received a response.
     *
     * @api private
     */

  }, {
    key: "_handleUploadResponse",
    value: function _handleUploadResponse(req, res) {
      var offset = parseInt(res.getHeader('Upload-Offset'), 10);

      if (isNaN(offset)) {
        this._emitHttpError(req, res, 'tus: invalid or missing offset value');

        return;
      }

      this._emitProgress(offset, this._size);

      this._emitChunkComplete(offset - this._offset, offset, this._size);

      this._offset = offset;

      if (offset == this._size) {
        // Yay, finally done :)
        this._emitSuccess();

        this._source.close();

        return;
      }

      this._performUpload();
    }
    /**
     * Create a new HTTP request object with the given method and URL.
     *
     * @api private
     */

  }, {
    key: "_openRequest",
    value: function _openRequest(method, url) {
      var req = openRequest(method, url, this.options);
      this._req = req;
      return req;
    }
    /**
     * Remove the entry in the URL storage, if it has been saved before.
     *
     * @api private
     */

  }, {
    key: "_removeFromUrlStorage",
    value: function _removeFromUrlStorage() {
      var _this10 = this;

      if (!this._urlStorageKey) return;

      this._urlStorage.removeUpload(this._urlStorageKey)["catch"](function (err) {
        _this10._emitError(err);
      });

      this._urlStorageKey = null;
    }
    /**
     * Add the upload URL to the URL storage, if possible.
     *
     * @api private
     */

  }, {
    key: "_saveUploadInUrlStorage",
    value: function _saveUploadInUrlStorage() {
      var _this11 = this; // Only if a fingerprint was calculated for the input (i.e. not a stream), we can store the upload URL.


      if (!this.options.storeFingerprintForResuming || !this._fingerprint) {
        return;
      }

      var storedUpload = {
        size: this._size,
        metadata: this.options.metadata,
        creationTime: new Date().toString()
      };

      if (this._parallelUploads) {
        // Save multiple URLs if the parallelUploads option is used ...
        storedUpload.parallelUploadUrls = this._parallelUploadUrls;
      } else {
        // ... otherwise we just save the one available URL.
        storedUpload.uploadUrl = this.url;
      }

      this._urlStorage.addUpload(this._fingerprint, storedUpload).then(function (urlStorageKey) {
        return _this11._urlStorageKey = urlStorageKey;
      })["catch"](function (err) {
        _this11._emitError(err);
      });
    }
    /**
     * Send a request with the provided body.
     *
     * @api private
     */

  }, {
    key: "_sendRequest",
    value: function _sendRequest(req) {
      var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return sendRequest(req, body, this.options);
    }
  }], [{
    key: "terminate",
    value: function terminate(url, options) {
      // Count the number of arguments to see if a callback is being provided as the last
      // argument in the old style required by tus-js-client 1.x, then throw an error if it is.
      // `arguments` is a JavaScript built-in variable that contains all of the function's arguments.
      if (arguments.length > 1 && typeof arguments[arguments.length - 1] === 'function') {
        throw new Error('tus: the terminate function does not accept a callback since v2 anymore; please use the returned Promise instead');
      } // Note that in order for the trick above to work, a default value cannot be set for `options`,
      // so the check below replaces the old default `{}`.


      if (options === undefined) {
        options = {};
      }

      var req = openRequest('DELETE', url, options);
      return sendRequest(req, null, options).then(function (res) {
        // A 204 response indicates a successfull request
        if (res.getStatus() === 204) {
          return;
        }

        throw new _error.default('tus: unexpected response while terminating upload', null, req, res);
      })["catch"](function (err) {
        if (!(err instanceof _error.default)) {
          err = new _error.default('tus: failed to terminate upload', err, req, null);
        }

        if (!shouldRetry(err, 0, options)) {
          throw err;
        } // Instead of keeping track of the retry attempts, we remove the first element from the delays
        // array. If the array is empty, all retry attempts are used up and we will bubble up the error.
        // We recursively call the terminate function will removing elements from the retryDelays array.


        var delay = options.retryDelays[0];
        var remainingDelays = options.retryDelays.slice(1);

        var newOptions = _objectSpread({}, options, {
          retryDelays: remainingDelays
        });

        return new Promise(function (resolve) {
          return setTimeout(resolve, delay);
        }).then(function () {
          return BaseUpload.terminate(url, newOptions);
        });
      });
    }
  }]);

  return BaseUpload;
}();

function encodeMetadata(metadata) {
  var encoded = [];

  for (var key in metadata) {
    encoded.push("".concat(key, " ").concat(_jsBase.Base64.encode(metadata[key])));
  }

  return encoded.join(',');
}
/**
 * Checks whether a given status is in the range of the expected category.
 * For example, only a status between 200 and 299 will satisfy the category 200.
 *
 * @api private
 */


function inStatusCategory(status, category) {
  return status >= category && status < category + 100;
}
/**
 * Create a new HTTP request with the specified method and URL.
 * The necessary headers that are included in every request
 * will be added, including the request ID.
 *
 * @api private
 */


function openRequest(method, url, options) {
  var req = options.httpStack.createRequest(method, url);
  req.setHeader('Tus-Resumable', '1.0.0');
  var headers = options.headers || {};

  for (var name in headers) {
    req.setHeader(name, headers[name]);
  }

  if (options.addRequestId) {
    var requestId = (0, _uuid.default)();
    req.setHeader('X-Request-ID', requestId);
  }

  return req;
}
/**
 * Send a request with the provided body while invoking the onBeforeRequest
 * and onAfterResponse callbacks.
 *
 * @api private
 */


function sendRequest(req, body, options) {
  var onBeforeRequestPromise = typeof options.onBeforeRequest === 'function' ? Promise.resolve(options.onBeforeRequest(req)) : Promise.resolve();
  return onBeforeRequestPromise.then(function () {
    return req.send(body).then(function (res) {
      var onAfterResponsePromise = typeof options.onAfterResponse === 'function' ? Promise.resolve(options.onAfterResponse(req, res)) : Promise.resolve();
      return onAfterResponsePromise.then(function () {
        return res;
      });
    });
  });
}
/**
 * Checks whether the browser running this code has internet access.
 * This function will always return true in the node.js environment
 *
 * @api private
 */


function isOnline() {
  var online = true;

  if (typeof window !== 'undefined' && 'navigator' in window && window.navigator.onLine === false) {
    online = false;
  }

  return online;
}
/**
 * Checks whether or not it is ok to retry a request.
 * @param {Error} err the error returned from the last request
 * @param {number} retryAttempt the number of times the request has already been retried
 * @param {object} options tus Upload options
 *
 * @api private
 */


function shouldRetry(err, retryAttempt, options) {
  // We only attempt a retry if
  // - retryDelays option is set
  // - we didn't exceed the maxium number of retries, yet, and
  // - this error was caused by a request or it's response and
  // - the error is server error (i.e. not a status 4xx except a 409 or 423) or
  // a onShouldRetry is specified and returns true
  // - the browser does not indicate that we are offline
  if (options.retryDelays == null || retryAttempt >= options.retryDelays.length || err.originalRequest == null) {
    return false;
  }

  if (options && typeof options.onShouldRetry === 'function') {
    return options.onShouldRetry(err, retryAttempt, options);
  }

  var status = err.originalResponse ? err.originalResponse.getStatus() : 0;
  return (!inStatusCategory(status, 400) || status === 409 || status === 423) && isOnline();
}
/**
 * Resolve a relative link given the origin as source. For example,
 * if a HTTP request to http://example.com/files/ returns a Location
 * header with the value /upload/abc, the resolved URL will be:
 * http://example.com/upload/abc
 */


function resolveUrl(origin, link) {
  return new _urlParse.default(link, origin).toString();
}
/**
 * Calculate the start and end positions for the parts if an upload
 * is split into multiple parallel requests.
 *
 * @param {number} totalSize The byte size of the upload, which will be split.
 * @param {number} partCount The number in how many parts the upload will be split.
 * @param {string[]} previousUrls The upload URLs for previous parts.
 * @return {object[]}
 * @api private
 */


function splitSizeIntoParts(totalSize, partCount, previousUrls) {
  var partSize = Math.floor(totalSize / partCount);
  var parts = [];

  for (var i = 0; i < partCount; i++) {
    parts.push({
      start: partSize * i,
      end: partSize * (i + 1)
    });
  }

  parts[partCount - 1].end = totalSize; // Attach URLs from previous uploads, if available.

  if (previousUrls) {
    parts.forEach(function (part, index) {
      part.uploadUrl = previousUrls[index] || null;
    });
  }

  return parts;
}

BaseUpload.defaultOptions = defaultOptions;
var _default = BaseUpload;
exports.default = _default;
},{"./error":22,"./logger":23,"./uuid":26,"js-base64":3,"url-parse":27}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uuid;

/**
 * Generate a UUID v4 based on random numbers. We intentioanlly use the less
 * secure Math.random function here since the more secure crypto.getRandomNumbers
 * is not available on all platforms.
 * This is not a problem for us since we use the UUID only for generating a
 * request ID, so we can correlate server logs to client errors.
 *
 * This function is taken from following site:
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 *
 * @return {string} The generate UUID
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
},{}],27:[function(require,module,exports){
(function (global){(function (){
'use strict';

var required = require('requires-port')
  , qs = require('querystringify')
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i
  , windowsDriveLetter = /^[a-zA-Z]:/
  , whitespace = '[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]'
  , left = new RegExp('^'+ whitespace +'+');

/**
 * Trim a given string.
 *
 * @param {String} str String to trim.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(left, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address, url) {     // Sanitize what is left of the address
    return isSpecial(url.protocol) ? address.replace(/\\/g, '/') : address;
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof global !== 'undefined') globalVar = global;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * Check whether a protocol scheme is special.
 *
 * @param {String} The protocol scheme of the URL
 * @return {Boolean} `true` if the protocol scheme is special, else `false`
 * @private
 */
function isSpecial(scheme) {
  return (
    scheme === 'file:' ||
    scheme === 'ftp:' ||
    scheme === 'http:' ||
    scheme === 'https:' ||
    scheme === 'ws:' ||
    scheme === 'wss:'
  );
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @param {Object} location
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address, location) {
  address = trimLeft(address);
  location = location || {};

  var match = protocolre.exec(address);
  var protocol = match[1] ? match[1].toLowerCase() : '';
  var forwardSlashes = !!match[2];
  var otherSlashes = !!match[3];
  var slashesCount = 0;
  var rest;

  if (forwardSlashes) {
    if (otherSlashes) {
      rest = match[2] + match[3] + match[4];
      slashesCount = match[2].length + match[3].length;
    } else {
      rest = match[2] + match[4];
      slashesCount = match[2].length;
    }
  } else {
    if (otherSlashes) {
      rest = match[3] + match[4];
      slashesCount = match[3].length;
    } else {
      rest = match[4]
    }
  }

  if (protocol === 'file:') {
    if (slashesCount >= 2) {
      rest = rest.slice(2);
    }
  } else if (isSpecial(protocol)) {
    rest = match[4];
  } else if (protocol) {
    if (forwardSlashes) {
      rest = rest.slice(2);
    }
  } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
    rest = match[4];
  }

  return {
    protocol: protocol,
    slashes: forwardSlashes || isSpecial(protocol),
    slashesCount: slashesCount,
    rest: rest
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  address = trimLeft(address);

  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '', location);
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (
    extracted.protocol === 'file:' && (
      extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) ||
    (!extracted.slashes &&
      (extracted.protocol ||
        extracted.slashesCount < 2 ||
        !isSpecial(url.protocol)))
  ) {
    instructions[3] = [/(.*)/, 'pathname'];
  }

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address, url);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // Default to a / for pathname if none exists. This normalizes the URL
  // to always have a /
  //
  if (url.pathname.charAt(0) !== '/' && isSpecial(url.protocol)) {
    url.pathname = '/' + url.pathname;
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes || isSpecial(url.protocol) ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;

module.exports = Url;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"querystringify":11,"requires-port":12}],28:[function(require,module,exports){
/* jshint node: true */
'use strict';

/**
  # wildcard

  Very simple wildcard matching, which is designed to provide the same
  functionality that is found in the
  [eve](https://github.com/adobe-webplatform/eve) eventing library.

  ## Usage

  It works with strings:

  <<< examples/strings.js

  Arrays:

  <<< examples/arrays.js

  Objects (matching against keys):

  <<< examples/objects.js

  While the library works in Node, if you are are looking for file-based
  wildcard matching then you should have a look at:

  <https://github.com/isaacs/node-glob>
**/

function WildcardMatcher(text, separator) {
  this.text = text = text || '';
  this.hasWild = ~text.indexOf('*');
  this.separator = separator;
  this.parts = text.split(separator);
}

WildcardMatcher.prototype.match = function(input) {
  var matches = true;
  var parts = this.parts;
  var ii;
  var partsCount = parts.length;
  var testParts;

  if (typeof input == 'string' || input instanceof String) {
    if (!this.hasWild && this.text != input) {
      matches = false;
    } else {
      testParts = (input || '').split(this.separator);
      for (ii = 0; matches && ii < partsCount; ii++) {
        if (parts[ii] === '*')  {
          continue;
        } else if (ii < testParts.length) {
          matches = parts[ii] === testParts[ii];
        } else {
          matches = false;
        }
      }

      // If matches, then return the component parts
      matches = matches && testParts;
    }
  }
  else if (typeof input.splice == 'function') {
    matches = [];

    for (ii = input.length; ii--; ) {
      if (this.match(input[ii])) {
        matches[matches.length] = input[ii];
      }
    }
  }
  else if (typeof input == 'object') {
    matches = {};

    for (var key in input) {
      if (this.match(key)) {
        matches[key] = input[key];
      }
    }
  }

  return matches;
};

module.exports = function(text, test, separator) {
  var matcher = new WildcardMatcher(text, separator || /[\/\.]/);
  if (typeof test != 'undefined') {
    return matcher.match(test);
  }

  return matcher;
};

},{}],29:[function(require,module,exports){
'use strict';

class AuthError extends Error {
  constructor() {
    super('Authorization required');
    this.name = 'AuthError';
    this.isAuthError = true;
  }

}

module.exports = AuthError;

},{}],30:[function(require,module,exports){
'use strict';

const RequestClient = require('./RequestClient');

const tokenStorage = require('./tokenStorage');

const getName = id => {
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

module.exports = class Provider extends RequestClient {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.provider = opts.provider;
    this.id = this.provider;
    this.name = this.opts.name || getName(this.id);
    this.pluginId = this.opts.pluginId;
    this.tokenKey = `companion-${this.pluginId}-auth-token`;
    this.companionKeysParams = this.opts.companionKeysParams;
    this.preAuthToken = null;
  }

  headers() {
    return Promise.all([super.headers(), this.getAuthToken()]).then(([headers, token]) => {
      const authHeaders = {};

      if (token) {
        authHeaders['uppy-auth-token'] = token;
      }

      if (this.companionKeysParams) {
        authHeaders['uppy-credentials-params'] = btoa(JSON.stringify({
          params: this.companionKeysParams
        }));
      }

      return { ...headers,
        ...authHeaders
      };
    });
  }

  onReceiveResponse(response) {
    response = super.onReceiveResponse(response);
    const plugin = this.uppy.getPlugin(this.pluginId);
    const oldAuthenticated = plugin.getPluginState().authenticated;
    const authenticated = oldAuthenticated ? response.status !== 401 : response.status < 400;
    plugin.setPluginState({
      authenticated
    });
    return response;
  }

  setAuthToken(token) {
    return this.uppy.getPlugin(this.pluginId).storage.setItem(this.tokenKey, token);
  }

  getAuthToken() {
    return this.uppy.getPlugin(this.pluginId).storage.getItem(this.tokenKey);
  }

  authUrl(queries = {}) {
    if (this.preAuthToken) {
      queries.uppyPreAuthToken = this.preAuthToken;
    }

    return `${this.hostname}/${this.id}/connect?${new URLSearchParams(queries)}`;
  }

  fileUrl(id) {
    return `${this.hostname}/${this.id}/get/${id}`;
  }

  fetchPreAuthToken() {
    if (!this.companionKeysParams) {
      return Promise.resolve();
    }

    return this.post(`${this.id}/preauth/`, {
      params: this.companionKeysParams
    }).then(res => {
      this.preAuthToken = res.token;
    }).catch(err => {
      this.uppy.log(`[CompanionClient] unable to fetch preAuthToken ${err}`, 'warning');
    });
  }

  list(directory) {
    return this.get(`${this.id}/list/${directory || ''}`);
  }

  logout() {
    return this.get(`${this.id}/logout`).then(response => Promise.all([response, this.uppy.getPlugin(this.pluginId).storage.removeItem(this.tokenKey)])).then(([response]) => response);
  }

  static initPlugin(plugin, opts, defaultOpts) {
    plugin.type = 'acquirer';
    plugin.files = [];

    if (defaultOpts) {
      plugin.opts = { ...defaultOpts,
        ...opts
      };
    }

    if (opts.serverUrl || opts.serverPattern) {
      throw new Error('`serverUrl` and `serverPattern` have been renamed to `companionUrl` and `companionAllowedHosts` respectively in the 0.30.5 release. Please consult the docs (for example, https://uppy.io/docs/instagram/ for the Instagram plugin) and use the updated options.`');
    }

    if (opts.companionAllowedHosts) {
      const pattern = opts.companionAllowedHosts; // validate companionAllowedHosts param

      if (typeof pattern !== 'string' && !Array.isArray(pattern) && !(pattern instanceof RegExp)) {
        throw new TypeError(`${plugin.id}: the option "companionAllowedHosts" must be one of string, Array, RegExp`);
      }

      plugin.opts.companionAllowedHosts = pattern;
    } else if (/^(?!https?:\/\/).*$/i.test(opts.companionUrl)) {
      // does not start with https://
      plugin.opts.companionAllowedHosts = `https://${opts.companionUrl.replace(/^\/\//, '')}`;
    } else {
      plugin.opts.companionAllowedHosts = new URL(opts.companionUrl).origin;
    }

    plugin.storage = plugin.opts.storage || tokenStorage;
  }

};

},{"./RequestClient":31,"./tokenStorage":35}],31:[function(require,module,exports){
'use strict';

var _class, _getPostResponseFunc, _getUrl, _errorHandler, _temp;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const fetchWithNetworkError = require('./../../utils/lib/fetchWithNetworkError');

const AuthError = require('./AuthError'); // Remove the trailing slash so we can always safely append /xyz.


function stripSlash(url) {
  return url.replace(/\/$/, '');
}

async function handleJSONResponse(res) {
  if (res.status === 401) {
    throw new AuthError();
  }

  const jsonPromise = res.json();

  if (res.status < 200 || res.status > 300) {
    let errMsg = `Failed request with status: ${res.status}. ${res.statusText}`;

    try {
      const errData = await jsonPromise;
      errMsg = errData.message ? `${errMsg} message: ${errData.message}` : errMsg;
      errMsg = errData.requestId ? `${errMsg} request-Id: ${errData.requestId}` : errMsg;
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      throw new Error(errMsg);
    }
  }

  return jsonPromise;
}

module.exports = (_temp = (_getPostResponseFunc = /*#__PURE__*/_classPrivateFieldLooseKey("getPostResponseFunc"), _getUrl = /*#__PURE__*/_classPrivateFieldLooseKey("getUrl"), _errorHandler = /*#__PURE__*/_classPrivateFieldLooseKey("errorHandler"), _class = class RequestClient {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    Object.defineProperty(this, _errorHandler, {
      value: _errorHandler2
    });
    Object.defineProperty(this, _getUrl, {
      value: _getUrl2
    });
    Object.defineProperty(this, _getPostResponseFunc, {
      writable: true,
      value: skip => response => skip ? response : this.onReceiveResponse(response)
    });
    this.uppy = uppy;
    this.opts = opts;
    this.onReceiveResponse = this.onReceiveResponse.bind(this);
    this.allowedHeaders = ['accept', 'content-type', 'uppy-auth-token'];
    this.preflightDone = false;
  }

  get hostname() {
    const {
      companion
    } = this.uppy.getState();
    const host = this.opts.companionUrl;
    return stripSlash(companion && companion[host] ? companion[host] : host);
  }

  headers() {
    const userHeaders = this.opts.companionHeaders || {};
    return Promise.resolve({ ...RequestClient.defaultHeaders,
      ...userHeaders
    });
  }

  onReceiveResponse(response) {
    const state = this.uppy.getState();
    const companion = state.companion || {};
    const host = this.opts.companionUrl;
    const {
      headers
    } = response; // Store the self-identified domain name for the Companion instance we just hit.

    if (headers.has('i-am') && headers.get('i-am') !== companion[host]) {
      this.uppy.setState({
        companion: { ...companion,
          [host]: headers.get('i-am')
        }
      });
    }

    return response;
  }

  preflight(path) {
    if (this.preflightDone) {
      return Promise.resolve(this.allowedHeaders.slice());
    }

    return fetch(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method: 'OPTIONS'
    }).then(response => {
      if (response.headers.has('access-control-allow-headers')) {
        this.allowedHeaders = response.headers.get('access-control-allow-headers').split(',').map(headerName => headerName.trim().toLowerCase());
      }

      this.preflightDone = true;
      return this.allowedHeaders.slice();
    }).catch(err => {
      this.uppy.log(`[CompanionClient] unable to make preflight request ${err}`, 'warning');
      this.preflightDone = true;
      return this.allowedHeaders.slice();
    });
  }

  preflightAndHeaders(path) {
    return Promise.all([this.preflight(path), this.headers()]).then(([allowedHeaders, headers]) => {
      // filter to keep only allowed Headers
      Object.keys(headers).forEach(header => {
        if (!allowedHeaders.includes(header.toLowerCase())) {
          this.uppy.log(`[CompanionClient] excluding disallowed header ${header}`);
          delete headers[header]; // eslint-disable-line no-param-reassign
        }
      });
      return headers;
    });
  }

  get(path, skipPostResponse) {
    const method = 'get';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin'
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

  post(path, data, skipPostResponse) {
    const method = 'post';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: JSON.stringify(data)
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

  delete(path, data, skipPostResponse) {
    const method = 'delete';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(`${this.hostname}/${path}`, {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: data ? JSON.stringify(data) : null
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

}), _class.VERSION = "2.0.3", _class.defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Uppy-Versions': `@uppy/companion-client=${_class.VERSION}`
}, _temp);

function _getUrl2(url) {
  if (/^(https?:|)\/\//.test(url)) {
    return url;
  }

  return `${this.hostname}/${url}`;
}

function _errorHandler2(method, path) {
  return err => {
    var _err;

    if (!((_err = err) != null && _err.isAuthError)) {
      const error = new Error(`Could not ${method} ${_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path)}`);
      error.cause = err;
      err = error; // eslint-disable-line no-param-reassign
    }

    return Promise.reject(err);
  };
}

},{"./../../utils/lib/fetchWithNetworkError":57,"./AuthError":29}],32:[function(require,module,exports){
'use strict';

const RequestClient = require('./RequestClient');

const getName = id => {
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

module.exports = class SearchProvider extends RequestClient {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.provider = opts.provider;
    this.id = this.provider;
    this.name = this.opts.name || getName(this.id);
    this.pluginId = this.opts.pluginId;
  }

  fileUrl(id) {
    return `${this.hostname}/search/${this.id}/get/${id}`;
  }

  search(text, queries) {
    queries = queries ? `&${queries}` : '';
    return this.get(`search/${this.id}/list?q=${encodeURIComponent(text)}${queries}`);
  }

};

},{"./RequestClient":31}],33:[function(require,module,exports){
"use strict";

var _queued, _emitter, _isOpen, _socket, _handleMessage;

let _Symbol$for, _Symbol$for2;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const ee = require('namespace-emitter');

module.exports = (_queued = /*#__PURE__*/_classPrivateFieldLooseKey("queued"), _emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter"), _isOpen = /*#__PURE__*/_classPrivateFieldLooseKey("isOpen"), _socket = /*#__PURE__*/_classPrivateFieldLooseKey("socket"), _handleMessage = /*#__PURE__*/_classPrivateFieldLooseKey("handleMessage"), _Symbol$for = Symbol.for('uppy test: getSocket'), _Symbol$for2 = Symbol.for('uppy test: getQueued'), class UppySocket {
  constructor(opts) {
    Object.defineProperty(this, _queued, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: ee()
    });
    Object.defineProperty(this, _isOpen, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _socket, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _handleMessage, {
      writable: true,
      value: e => {
        try {
          const message = JSON.parse(e.data);
          this.emit(message.action, message.payload);
        } catch (err) {
          // TODO: use a more robust error handler.
          console.log(err); // eslint-disable-line no-console
        }
      }
    });
    this.opts = opts;

    if (!opts || opts.autoOpen !== false) {
      this.open();
    }
  }

  get isOpen() {
    return _classPrivateFieldLooseBase(this, _isOpen)[_isOpen];
  }

  [_Symbol$for]() {
    return _classPrivateFieldLooseBase(this, _socket)[_socket];
  }

  [_Symbol$for2]() {
    return _classPrivateFieldLooseBase(this, _queued)[_queued];
  }

  open() {
    _classPrivateFieldLooseBase(this, _socket)[_socket] = new WebSocket(this.opts.target);

    _classPrivateFieldLooseBase(this, _socket)[_socket].onopen = () => {
      _classPrivateFieldLooseBase(this, _isOpen)[_isOpen] = true;

      while (_classPrivateFieldLooseBase(this, _queued)[_queued].length > 0 && _classPrivateFieldLooseBase(this, _isOpen)[_isOpen]) {
        const first = _classPrivateFieldLooseBase(this, _queued)[_queued].shift();

        this.send(first.action, first.payload);
      }
    };

    _classPrivateFieldLooseBase(this, _socket)[_socket].onclose = () => {
      _classPrivateFieldLooseBase(this, _isOpen)[_isOpen] = false;
    };

    _classPrivateFieldLooseBase(this, _socket)[_socket].onmessage = _classPrivateFieldLooseBase(this, _handleMessage)[_handleMessage];
  }

  close() {
    var _classPrivateFieldLoo;

    (_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _socket)[_socket]) == null ? void 0 : _classPrivateFieldLoo.close();
  }

  send(action, payload) {
    // attach uuid
    if (!_classPrivateFieldLooseBase(this, _isOpen)[_isOpen]) {
      _classPrivateFieldLooseBase(this, _queued)[_queued].push({
        action,
        payload
      });

      return;
    }

    _classPrivateFieldLooseBase(this, _socket)[_socket].send(JSON.stringify({
      action,
      payload
    }));
  }

  on(action, handler) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(action, handler);
  }

  emit(action, payload) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(action, payload);
  }

  once(action, handler) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(action, handler);
  }

});

},{"namespace-emitter":6}],34:[function(require,module,exports){
'use strict';
/**
 * Manages communications with Companion
 */

const RequestClient = require('./RequestClient');

const Provider = require('./Provider');

const SearchProvider = require('./SearchProvider');

const Socket = require('./Socket');

module.exports = {
  RequestClient,
  Provider,
  SearchProvider,
  Socket
};

},{"./Provider":30,"./RequestClient":31,"./SearchProvider":32,"./Socket":33}],35:[function(require,module,exports){
'use strict';
/**
 * This module serves as an Async wrapper for LocalStorage
 */

module.exports.setItem = (key, value) => {
  return new Promise(resolve => {
    localStorage.setItem(key, value);
    resolve();
  });
};

module.exports.getItem = key => {
  return Promise.resolve(localStorage.getItem(key));
};

module.exports.removeItem = key => {
  return new Promise(resolve => {
    localStorage.removeItem(key);
    resolve();
  });
};

},{}],36:[function(require,module,exports){
"use strict";

/**
 * Core plugin logic that all plugins share.
 *
 * BasePlugin does not contain DOM rendering so it can be used for plugins
 * without a user interface.
 *
 * See `Plugin` for the extended version with Preact rendering for interfaces.
 */
const Translator = require('./../../utils/lib/Translator');

module.exports = class BasePlugin {
  constructor(uppy, opts = {}) {
    this.uppy = uppy;
    this.opts = opts;
  }

  getPluginState() {
    const {
      plugins
    } = this.uppy.getState();
    return plugins[this.id] || {};
  }

  setPluginState(update) {
    const {
      plugins
    } = this.uppy.getState();
    this.uppy.setState({
      plugins: { ...plugins,
        [this.id]: { ...plugins[this.id],
          ...update
        }
      }
    });
  }

  setOptions(newOpts) {
    this.opts = { ...this.opts,
      ...newOpts
    };
    this.setPluginState(); // so that UI re-renders with new options

    this.i18nInit();
  }

  i18nInit() {
    const translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = translator.translate.bind(translator);
    this.i18nArray = translator.translateArray.bind(translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  }
  /**
   * Extendable methods
   * ==================
   * These methods are here to serve as an overview of the extendable methods as well as
   * making them not conditional in use, such as `if (this.afterUpdate)`.
   */
  // eslint-disable-next-line class-methods-use-this


  addTarget() {
    throw new Error('Extend the addTarget method to add your plugin to another plugin\'s target');
  } // eslint-disable-next-line class-methods-use-this


  install() {} // eslint-disable-next-line class-methods-use-this


  uninstall() {}
  /**
   * Called when plugin is mounted, whether in DOM or into another plugin.
   * Needed because sometimes plugins are mounted separately/after `install`,
   * so this.el and this.parent might not be available in `install`.
   * This is the case with @uppy/react plugins, for example.
   */


  render() {
    throw new Error('Extend the render method to add your plugin to a DOM element');
  } // eslint-disable-next-line class-methods-use-this


  update() {} // Called after every state update, after everything's mounted. Debounced.
  // eslint-disable-next-line class-methods-use-this


  afterUpdate() {}

};

},{"./../../utils/lib/Translator":55}],37:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  render
} = require('preact');

const findDOMElement = require('./../../utils/lib/findDOMElement');

const BasePlugin = require('./BasePlugin');
/**
 * Defer a frequent call to the microtask queue.
 *
 * @param {() => T} fn
 * @returns {Promise<T>}
 */


function debounce(fn) {
  let calling = null;
  let latestArgs = null;
  return (...args) => {
    latestArgs = args;

    if (!calling) {
      calling = Promise.resolve().then(() => {
        calling = null; // At this point `args` may be different from the most
        // recent state, if multiple calls happened since this task
        // was queued. So we use the `latestArgs`, which definitely
        // is the most recent call.

        return fn(...latestArgs);
      });
    }

    return calling;
  };
}
/**
 * UIPlugin is the extended version of BasePlugin to incorporate rendering with Preact.
 * Use this for plugins that need a user interface.
 *
 * For plugins without an user interface, see BasePlugin.
 */


var _updateUI = /*#__PURE__*/_classPrivateFieldLooseKey("updateUI");

class UIPlugin extends BasePlugin {
  constructor(...args) {
    super(...args);
    Object.defineProperty(this, _updateUI, {
      writable: true,
      value: void 0
    });
  }

  /**
   * Check if supplied `target` is a DOM element or an `object`.
   * If it’s an object — target is a plugin, and we search `plugins`
   * for a plugin with same name and return its target.
   */
  mount(target, plugin) {
    const callerPluginName = plugin.id;
    const targetElement = findDOMElement(target);

    if (targetElement) {
      this.isTargetDOMEl = true; // When target is <body> with a single <div> element,
      // Preact thinks it’s the Uppy root element in there when doing a diff,
      // and destroys it. So we are creating a fragment (could be empty div)

      const uppyRootElement = document.createDocumentFragment(); // API for plugins that require a synchronous rerender.

      _classPrivateFieldLooseBase(this, _updateUI)[_updateUI] = debounce(state => {
        // plugin could be removed, but this.rerender is debounced below,
        // so it could still be called even after uppy.removePlugin or uppy.close
        // hence the check
        if (!this.uppy.getPlugin(this.id)) return;
        render(this.render(state), uppyRootElement);
        this.afterUpdate();
      });
      this.uppy.log(`Installing ${callerPluginName} to a DOM element '${target}'`);

      if (this.opts.replaceTargetContent) {
        // Doing render(h(null), targetElement), which should have been
        // a better way, since because the component might need to do additional cleanup when it is removed,
        // stopped working — Preact just adds null into target, not replacing
        targetElement.innerHTML = '';
      }

      render(this.render(this.uppy.getState()), uppyRootElement);
      this.el = uppyRootElement.firstElementChild;
      targetElement.appendChild(uppyRootElement);
      this.onMount();
      return this.el;
    }

    let targetPlugin;

    if (typeof target === 'object' && target instanceof UIPlugin) {
      // Targeting a plugin *instance*
      targetPlugin = target;
    } else if (typeof target === 'function') {
      // Targeting a plugin type
      const Target = target; // Find the target plugin instance.

      this.uppy.iteratePlugins(p => {
        if (p instanceof Target) {
          targetPlugin = p;
          return false;
        }
      });
    }

    if (targetPlugin) {
      this.uppy.log(`Installing ${callerPluginName} to ${targetPlugin.id}`);
      this.parent = targetPlugin;
      this.el = targetPlugin.addTarget(plugin);
      this.onMount();
      return this.el;
    }

    this.uppy.log(`Not installing ${callerPluginName}`);
    let message = `Invalid target option given to ${callerPluginName}.`;

    if (typeof target === 'function') {
      message += ' The given target is not a Plugin class. ' + 'Please check that you\'re not specifying a React Component instead of a plugin. ' + 'If you are using @uppy/* packages directly, make sure you have only 1 version of @uppy/core installed: ' + 'run `npm ls @uppy/core` on the command line and verify that all the versions match and are deduped correctly.';
    } else {
      message += 'If you meant to target an HTML element, please make sure that the element exists. ' + 'Check that the <script> tag initializing Uppy is right before the closing </body> tag at the end of the page. ' + '(see https://github.com/transloadit/uppy/issues/1042)\n\n' + 'If you meant to target a plugin, please confirm that your `import` statements or `require` calls are correct.';
    }

    throw new Error(message);
  }

  update(state) {
    if (this.el != null) {
      var _classPrivateFieldLoo, _classPrivateFieldLoo2;

      (_classPrivateFieldLoo = (_classPrivateFieldLoo2 = _classPrivateFieldLooseBase(this, _updateUI))[_updateUI]) == null ? void 0 : _classPrivateFieldLoo.call(_classPrivateFieldLoo2, state);
    }
  }

  unmount() {
    if (this.isTargetDOMEl) {
      var _this$el;

      (_this$el = this.el) == null ? void 0 : _this$el.remove();
    }

    this.onUnmount();
  } // eslint-disable-next-line class-methods-use-this


  onMount() {} // eslint-disable-next-line class-methods-use-this


  onUnmount() {}

}

module.exports = UIPlugin;

},{"./../../utils/lib/findDOMElement":58,"./BasePlugin":36,"preact":9}],38:[function(require,module,exports){
/* global AggregateError */
'use strict';

let _Symbol$for, _Symbol$for2;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const Translator = require('./../../utils/lib/Translator');

const ee = require('namespace-emitter');

const {
  nanoid
} = require('nanoid');

const throttle = require('lodash.throttle');

const prettierBytes = require('@transloadit/prettier-bytes');

const match = require('mime-match');

const DefaultStore = require('./../../store-default');

const getFileType = require('./../../utils/lib/getFileType');

const getFileNameAndExtension = require('./../../utils/lib/getFileNameAndExtension');

const generateFileID = require('./../../utils/lib/generateFileID');

const supportsUploadProgress = require('./supportsUploadProgress');

const getFileName = require('./getFileName');

const {
  justErrorsLogger,
  debugLogger
} = require('./loggers'); // Exported from here.


class RestrictionError extends Error {
  constructor(...args) {
    super(...args);
    this.isRestriction = true;
  }

}

if (typeof AggregateError === 'undefined') {
  // eslint-disable-next-line no-global-assign
  globalThis.AggregateError = class AggregateError extends Error {
    constructor(message, errors) {
      super(message);
      this.errors = errors;
    }

  };
}

class AggregateRestrictionError extends AggregateError {
  constructor(...args) {
    super(...args);
    this.isRestriction = true;
  }

}
/**
 * Uppy Core module.
 * Manages plugins, state updates, acts as an event bus,
 * adds/removes files and metadata.
 */


var _plugins = /*#__PURE__*/_classPrivateFieldLooseKey("plugins");

var _storeUnsubscribe = /*#__PURE__*/_classPrivateFieldLooseKey("storeUnsubscribe");

var _emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter");

var _preProcessors = /*#__PURE__*/_classPrivateFieldLooseKey("preProcessors");

var _uploaders = /*#__PURE__*/_classPrivateFieldLooseKey("uploaders");

var _postProcessors = /*#__PURE__*/_classPrivateFieldLooseKey("postProcessors");

var _checkRestrictions = /*#__PURE__*/_classPrivateFieldLooseKey("checkRestrictions");

var _checkMinNumberOfFiles = /*#__PURE__*/_classPrivateFieldLooseKey("checkMinNumberOfFiles");

var _checkRequiredMetaFields = /*#__PURE__*/_classPrivateFieldLooseKey("checkRequiredMetaFields");

var _showOrLogErrorAndThrow = /*#__PURE__*/_classPrivateFieldLooseKey("showOrLogErrorAndThrow");

var _assertNewUploadAllowed = /*#__PURE__*/_classPrivateFieldLooseKey("assertNewUploadAllowed");

var _checkAndCreateFileStateObject = /*#__PURE__*/_classPrivateFieldLooseKey("checkAndCreateFileStateObject");

var _startIfAutoProceed = /*#__PURE__*/_classPrivateFieldLooseKey("startIfAutoProceed");

var _addListeners = /*#__PURE__*/_classPrivateFieldLooseKey("addListeners");

var _updateOnlineStatus = /*#__PURE__*/_classPrivateFieldLooseKey("updateOnlineStatus");

var _createUpload = /*#__PURE__*/_classPrivateFieldLooseKey("createUpload");

var _getUpload = /*#__PURE__*/_classPrivateFieldLooseKey("getUpload");

var _removeUpload = /*#__PURE__*/_classPrivateFieldLooseKey("removeUpload");

var _runUpload = /*#__PURE__*/_classPrivateFieldLooseKey("runUpload");

_Symbol$for = Symbol.for('uppy test: getPlugins');
_Symbol$for2 = Symbol.for('uppy test: createUpload');

class Uppy {
  // eslint-disable-next-line global-require

  /** @type {Record<string, BasePlugin[]>} */

  /**
   * Instantiate Uppy
   *
   * @param {object} opts — Uppy options
   */
  constructor(_opts) {
    Object.defineProperty(this, _runUpload, {
      value: _runUpload2
    });
    Object.defineProperty(this, _removeUpload, {
      value: _removeUpload2
    });
    Object.defineProperty(this, _getUpload, {
      value: _getUpload2
    });
    Object.defineProperty(this, _createUpload, {
      value: _createUpload2
    });
    Object.defineProperty(this, _addListeners, {
      value: _addListeners2
    });
    Object.defineProperty(this, _startIfAutoProceed, {
      value: _startIfAutoProceed2
    });
    Object.defineProperty(this, _checkAndCreateFileStateObject, {
      value: _checkAndCreateFileStateObject2
    });
    Object.defineProperty(this, _assertNewUploadAllowed, {
      value: _assertNewUploadAllowed2
    });
    Object.defineProperty(this, _showOrLogErrorAndThrow, {
      value: _showOrLogErrorAndThrow2
    });
    Object.defineProperty(this, _checkRequiredMetaFields, {
      value: _checkRequiredMetaFields2
    });
    Object.defineProperty(this, _checkMinNumberOfFiles, {
      value: _checkMinNumberOfFiles2
    });
    Object.defineProperty(this, _checkRestrictions, {
      value: _checkRestrictions2
    });
    Object.defineProperty(this, _plugins, {
      writable: true,
      value: Object.create(null)
    });
    Object.defineProperty(this, _storeUnsubscribe, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: ee()
    });
    Object.defineProperty(this, _preProcessors, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _uploaders, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _postProcessors, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _updateOnlineStatus, {
      writable: true,
      value: this.updateOnlineStatus.bind(this)
    });
    this.defaultLocale = {
      strings: {
        addBulkFilesFailed: {
          0: 'Failed to add %{smart_count} file due to an internal error',
          1: 'Failed to add %{smart_count} files due to internal errors'
        },
        youCanOnlyUploadX: {
          0: 'You can only upload %{smart_count} file',
          1: 'You can only upload %{smart_count} files'
        },
        youHaveToAtLeastSelectX: {
          0: 'You have to select at least %{smart_count} file',
          1: 'You have to select at least %{smart_count} files'
        },
        exceedsSize: '%{file} exceeds maximum allowed size of %{size}',
        missingRequiredMetaField: 'Missing required meta fields',
        missingRequiredMetaFieldOnFile: 'Missing required meta fields in %{fileName}',
        inferiorSize: 'This file is smaller than the allowed size of %{size}',
        youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
        noMoreFilesAllowed: 'Cannot add more files',
        noDuplicates: 'Cannot add the duplicate file \'%{fileName}\', it already exists',
        companionError: 'Connection with Companion failed',
        authAborted: 'Authentication aborted',
        companionUnauthorizeHint: 'To unauthorize to your %{provider} account, please go to %{url}',
        failedToUpload: 'Failed to upload %{file}',
        noInternetConnection: 'No Internet connection',
        connectedToInternet: 'Connected to the Internet',
        // Strings for remote providers
        noFilesFound: 'You have no files or folders here',
        selectX: {
          0: 'Select %{smart_count}',
          1: 'Select %{smart_count}'
        },
        allFilesFromFolderNamed: 'All files from folder %{name}',
        openFolderNamed: 'Open folder %{name}',
        cancel: 'Cancel',
        logOut: 'Log out',
        filter: 'Filter',
        resetFilter: 'Reset filter',
        loading: 'Loading...',
        authenticateWithTitle: 'Please authenticate with %{pluginName} to select files',
        authenticateWith: 'Connect to %{pluginName}',
        signInWithGoogle: 'Sign in with Google',
        searchImages: 'Search for images',
        enterTextToSearch: 'Enter text to search for images',
        backToSearch: 'Back to Search',
        emptyFolderAdded: 'No files were added from empty folder',
        folderAlreadyAdded: 'The folder "%{folder}" was already added',
        folderAdded: {
          0: 'Added %{smart_count} file from %{folder}',
          1: 'Added %{smart_count} files from %{folder}'
        }
      }
    };
    const defaultOptions = {
      id: 'uppy',
      autoProceed: false,

      /**
       * @deprecated The method should not be used
       */
      allowMultipleUploads: true,
      allowMultipleUploadBatches: true,
      debug: false,
      restrictions: {
        maxFileSize: null,
        minFileSize: null,
        maxTotalFileSize: null,
        maxNumberOfFiles: null,
        minNumberOfFiles: null,
        allowedFileTypes: null,
        requiredMetaFields: []
      },
      meta: {},
      onBeforeFileAdded: currentFile => currentFile,
      onBeforeUpload: files => files,
      store: DefaultStore(),
      logger: justErrorsLogger,
      infoTimeout: 5000
    }; // Merge default options with the ones set by user,
    // making sure to merge restrictions too

    this.opts = { ...defaultOptions,
      ..._opts,
      restrictions: { ...defaultOptions.restrictions,
        ...(_opts && _opts.restrictions)
      }
    }; // Support debug: true for backwards-compatability, unless logger is set in opts
    // opts instead of this.opts to avoid comparing objects — we set logger: justErrorsLogger in defaultOptions

    if (_opts && _opts.logger && _opts.debug) {
      this.log('You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.', 'warning');
    } else if (_opts && _opts.debug) {
      this.opts.logger = debugLogger;
    }

    this.log(`Using Core v${this.constructor.VERSION}`);

    if (this.opts.restrictions.allowedFileTypes && this.opts.restrictions.allowedFileTypes !== null && !Array.isArray(this.opts.restrictions.allowedFileTypes)) {
      throw new TypeError('`restrictions.allowedFileTypes` must be an array');
    }

    this.i18nInit(); // ___Why throttle at 500ms?
    //    - We must throttle at >250ms for superfocus in Dashboard to work well
    //    (because animation takes 0.25s, and we want to wait for all animations to be over before refocusing).
    //    [Practical Check]: if thottle is at 100ms, then if you are uploading a file,
    //    and click 'ADD MORE FILES', - focus won't activate in Firefox.
    //    - We must throttle at around >500ms to avoid performance lags.
    //    [Practical Check] Firefox, try to upload a big file for a prolonged period of time. Laptop will start to heat up.

    this.calculateProgress = throttle(this.calculateProgress.bind(this), 500, {
      leading: true,
      trailing: true
    });
    this.store = this.opts.store;
    this.setState({
      plugins: {},
      files: {},
      currentUploads: {},
      allowNewUpload: true,
      capabilities: {
        uploadProgress: supportsUploadProgress(),
        individualCancellation: true,
        resumableUploads: false
      },
      totalProgress: 0,
      meta: { ...this.opts.meta
      },
      info: [],
      recoveredState: null
    });
    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[_storeUnsubscribe] = this.store.subscribe((prevState, nextState, patch) => {
      this.emit('state-update', prevState, nextState, patch);
      this.updateAll(nextState);
    }); // Exposing uppy object on window for debugging and testing

    if (this.opts.debug && typeof window !== 'undefined') {
      window[this.opts.id] = this;
    }

    _classPrivateFieldLooseBase(this, _addListeners)[_addListeners]();
  }

  emit(event, ...args) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(event, ...args);
  }

  on(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(event, callback);

    return this;
  }

  once(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(event, callback);

    return this;
  }

  off(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(event, callback);

    return this;
  }
  /**
   * Iterate on all plugins and run `update` on them.
   * Called each time state changes.
   *
   */


  updateAll(state) {
    this.iteratePlugins(plugin => {
      plugin.update(state);
    });
  }
  /**
   * Updates state with a patch
   *
   * @param {object} patch {foo: 'bar'}
   */


  setState(patch) {
    this.store.setState(patch);
  }
  /**
   * Returns current state.
   *
   * @returns {object}
   */


  getState() {
    return this.store.getState();
  }
  /**
   * Back compat for when uppy.state is used instead of uppy.getState().
   *
   * @deprecated
   */


  get state() {
    // Here, state is a non-enumerable property.
    return this.getState();
  }
  /**
   * Shorthand to set state for a specific file.
   */


  setFileState(fileID, state) {
    if (!this.getState().files[fileID]) {
      throw new Error(`Can’t set state for ${fileID} (the file could have been removed)`);
    }

    this.setState({
      files: { ...this.getState().files,
        [fileID]: { ...this.getState().files[fileID],
          ...state
        }
      }
    });
  }

  i18nInit() {
    const translator = new Translator([this.defaultLocale, this.opts.locale]);
    this.i18n = translator.translate.bind(translator);
    this.i18nArray = translator.translateArray.bind(translator);
    this.locale = translator.locale;
  }

  setOptions(newOpts) {
    this.opts = { ...this.opts,
      ...newOpts,
      restrictions: { ...this.opts.restrictions,
        ...(newOpts && newOpts.restrictions)
      }
    };

    if (newOpts.meta) {
      this.setMeta(newOpts.meta);
    }

    this.i18nInit();

    if (newOpts.locale) {
      this.iteratePlugins(plugin => {
        plugin.setOptions();
      });
    } // Note: this is not the preact `setState`, it's an internal function that has the same name.


    this.setState(); // so that UI re-renders with new options
  }

  resetProgress() {
    const defaultProgress = {
      percentage: 0,
      bytesUploaded: 0,
      uploadComplete: false,
      uploadStarted: null
    };
    const files = { ...this.getState().files
    };
    const updatedFiles = {};
    Object.keys(files).forEach(fileID => {
      const updatedFile = { ...files[fileID]
      };
      updatedFile.progress = { ...updatedFile.progress,
        ...defaultProgress
      };
      updatedFiles[fileID] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      totalProgress: 0
    });
    this.emit('reset-progress');
  }

  addPreProcessor(fn) {
    _classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors].add(fn);
  }

  removePreProcessor(fn) {
    return _classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors].delete(fn);
  }

  addPostProcessor(fn) {
    _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].add(fn);
  }

  removePostProcessor(fn) {
    return _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].delete(fn);
  }

  addUploader(fn) {
    _classPrivateFieldLooseBase(this, _uploaders)[_uploaders].add(fn);
  }

  removeUploader(fn) {
    return _classPrivateFieldLooseBase(this, _uploaders)[_uploaders].delete(fn);
  }

  setMeta(data) {
    const updatedMeta = { ...this.getState().meta,
      ...data
    };
    const updatedFiles = { ...this.getState().files
    };
    Object.keys(updatedFiles).forEach(fileID => {
      updatedFiles[fileID] = { ...updatedFiles[fileID],
        meta: { ...updatedFiles[fileID].meta,
          ...data
        }
      };
    });
    this.log('Adding metadata:');
    this.log(data);
    this.setState({
      meta: updatedMeta,
      files: updatedFiles
    });
  }

  setFileMeta(fileID, data) {
    const updatedFiles = { ...this.getState().files
    };

    if (!updatedFiles[fileID]) {
      this.log('Was trying to set metadata for a file that has been removed: ', fileID);
      return;
    }

    const newMeta = { ...updatedFiles[fileID].meta,
      ...data
    };
    updatedFiles[fileID] = { ...updatedFiles[fileID],
      meta: newMeta
    };
    this.setState({
      files: updatedFiles
    });
  }
  /**
   * Get a file object.
   *
   * @param {string} fileID The ID of the file object to return.
   */


  getFile(fileID) {
    return this.getState().files[fileID];
  }
  /**
   * Get all files in an array.
   */


  getFiles() {
    const {
      files
    } = this.getState();
    return Object.values(files);
  }

  getObjectOfFilesPerState() {
    const {
      files: filesObject,
      totalProgress,
      error
    } = this.getState();
    const files = Object.values(filesObject);
    const inProgressFiles = files.filter(({
      progress
    }) => !progress.uploadComplete && progress.uploadStarted);
    const newFiles = files.filter(file => !file.progress.uploadStarted);
    const startedFiles = files.filter(file => file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess);
    const uploadStartedFiles = files.filter(file => file.progress.uploadStarted);
    const pausedFiles = files.filter(file => file.isPaused);
    const completeFiles = files.filter(file => file.progress.uploadComplete);
    const erroredFiles = files.filter(file => file.error);
    const inProgressNotPausedFiles = inProgressFiles.filter(file => !file.isPaused);
    const processingFiles = files.filter(file => file.progress.preprocess || file.progress.postprocess);
    return {
      newFiles,
      startedFiles,
      uploadStartedFiles,
      pausedFiles,
      completeFiles,
      erroredFiles,
      inProgressFiles,
      inProgressNotPausedFiles,
      processingFiles,
      isUploadStarted: uploadStartedFiles.length > 0,
      isAllComplete: totalProgress === 100 && completeFiles.length === files.length && processingFiles.length === 0,
      isAllErrored: !!error && erroredFiles.length === files.length,
      isAllPaused: inProgressFiles.length !== 0 && pausedFiles.length === inProgressFiles.length,
      isUploadInProgress: inProgressFiles.length > 0,
      isSomeGhost: files.some(file => file.isGhost)
    };
  }
  /**
   * A public wrapper for _checkRestrictions — checks if a file passes a set of restrictions.
   * For use in UI pluigins (like Providers), to disallow selecting files that won’t pass restrictions.
   *
   * @param {object} file object to check
   * @param {Array} [files] array to check maxNumberOfFiles and maxTotalFileSize
   * @returns {object} { result: true/false, reason: why file didn’t pass restrictions }
   */


  validateRestrictions(file, files) {
    try {
      _classPrivateFieldLooseBase(this, _checkRestrictions)[_checkRestrictions](file, files);

      return {
        result: true
      };
    } catch (err) {
      return {
        result: false,
        reason: err.message
      };
    }
  }
  /**
   * Check if file passes a set of restrictions set in options: maxFileSize, minFileSize,
   * maxNumberOfFiles and allowedFileTypes.
   *
   * @param {object} file object to check
   * @param {Array} [files] array to check maxNumberOfFiles and maxTotalFileSize
   * @private
   */


  checkIfFileAlreadyExists(fileID) {
    const {
      files
    } = this.getState();

    if (files[fileID] && !files[fileID].isGhost) {
      return true;
    }

    return false;
  }
  /**
   * Create a file state object based on user-provided `addFile()` options.
   *
   * Note this is extremely side-effectful and should only be done when a file state object
   * will be added to state immediately afterward!
   *
   * The `files` value is passed in because it may be updated by the caller without updating the store.
   */


  /**
   * Add a new file to `state.files`. This will run `onBeforeFileAdded`,
   * try to guess file type in a clever way, check file against restrictions,
   * and start an upload if `autoProceed === true`.
   *
   * @param {object} file object to add
   * @returns {string} id for the added file
   */
  addFile(file) {
    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[_assertNewUploadAllowed](file);

    const {
      files
    } = this.getState();

    let newFile = _classPrivateFieldLooseBase(this, _checkAndCreateFileStateObject)[_checkAndCreateFileStateObject](files, file); // Users are asked to re-select recovered files without data,
    // and to keep the progress, meta and everthing else, we only replace said data


    if (files[newFile.id] && files[newFile.id].isGhost) {
      newFile = { ...files[newFile.id],
        data: file.data,
        isGhost: false
      };
      this.log(`Replaced the blob in the restored ghost file: ${newFile.name}, ${newFile.id}`);
    }

    this.setState({
      files: { ...files,
        [newFile.id]: newFile
      }
    });
    this.emit('file-added', newFile);
    this.emit('files-added', [newFile]);
    this.log(`Added file: ${newFile.name}, ${newFile.id}, mime type: ${newFile.type}`);

    _classPrivateFieldLooseBase(this, _startIfAutoProceed)[_startIfAutoProceed]();

    return newFile.id;
  }
  /**
   * Add multiple files to `state.files`. See the `addFile()` documentation.
   *
   * If an error occurs while adding a file, it is logged and the user is notified.
   * This is good for UI plugins, but not for programmatic use.
   * Programmatic users should usually still use `addFile()` on individual files.
   */


  addFiles(fileDescriptors) {
    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[_assertNewUploadAllowed](); // create a copy of the files object only once


    const files = { ...this.getState().files
    };
    const newFiles = [];
    const errors = [];

    for (let i = 0; i < fileDescriptors.length; i++) {
      try {
        let newFile = _classPrivateFieldLooseBase(this, _checkAndCreateFileStateObject)[_checkAndCreateFileStateObject](files, fileDescriptors[i]); // Users are asked to re-select recovered files without data,
        // and to keep the progress, meta and everthing else, we only replace said data


        if (files[newFile.id] && files[newFile.id].isGhost) {
          newFile = { ...files[newFile.id],
            data: fileDescriptors[i].data,
            isGhost: false
          };
          this.log(`Replaced blob in a ghost file: ${newFile.name}, ${newFile.id}`);
        }

        files[newFile.id] = newFile;
        newFiles.push(newFile);
      } catch (err) {
        if (!err.isRestriction) {
          errors.push(err);
        }
      }
    }

    this.setState({
      files
    });
    newFiles.forEach(newFile => {
      this.emit('file-added', newFile);
    });
    this.emit('files-added', newFiles);

    if (newFiles.length > 5) {
      this.log(`Added batch of ${newFiles.length} files`);
    } else {
      Object.keys(newFiles).forEach(fileID => {
        this.log(`Added file: ${newFiles[fileID].name}\n id: ${newFiles[fileID].id}\n type: ${newFiles[fileID].type}`);
      });
    }

    if (newFiles.length > 0) {
      _classPrivateFieldLooseBase(this, _startIfAutoProceed)[_startIfAutoProceed]();
    }

    if (errors.length > 0) {
      let message = 'Multiple errors occurred while adding files:\n';
      errors.forEach(subError => {
        message += `\n * ${subError.message}`;
      });
      this.info({
        message: this.i18n('addBulkFilesFailed', {
          smart_count: errors.length
        }),
        details: message
      }, 'error', this.opts.infoTimeout);

      if (typeof AggregateError === 'function') {
        throw new AggregateError(errors, message);
      } else {
        const err = new Error(message);
        err.errors = errors;
        throw err;
      }
    }
  }

  removeFiles(fileIDs, reason) {
    const {
      files,
      currentUploads
    } = this.getState();
    const updatedFiles = { ...files
    };
    const updatedUploads = { ...currentUploads
    };
    const removedFiles = Object.create(null);
    fileIDs.forEach(fileID => {
      if (files[fileID]) {
        removedFiles[fileID] = files[fileID];
        delete updatedFiles[fileID];
      }
    }); // Remove files from the `fileIDs` list in each upload.

    function fileIsNotRemoved(uploadFileID) {
      return removedFiles[uploadFileID] === undefined;
    }

    Object.keys(updatedUploads).forEach(uploadID => {
      const newFileIDs = currentUploads[uploadID].fileIDs.filter(fileIsNotRemoved); // Remove the upload if no files are associated with it anymore.

      if (newFileIDs.length === 0) {
        delete updatedUploads[uploadID];
        return;
      }

      updatedUploads[uploadID] = { ...currentUploads[uploadID],
        fileIDs: newFileIDs
      };
    });
    const stateUpdate = {
      currentUploads: updatedUploads,
      files: updatedFiles
    }; // If all files were removed - allow new uploads,
    // and clear recoveredState

    if (Object.keys(updatedFiles).length === 0) {
      stateUpdate.allowNewUpload = true;
      stateUpdate.error = null;
      stateUpdate.recoveredState = null;
    }

    this.setState(stateUpdate);
    this.calculateTotalProgress();
    const removedFileIDs = Object.keys(removedFiles);
    removedFileIDs.forEach(fileID => {
      this.emit('file-removed', removedFiles[fileID], reason);
    });

    if (removedFileIDs.length > 5) {
      this.log(`Removed ${removedFileIDs.length} files`);
    } else {
      this.log(`Removed files: ${removedFileIDs.join(', ')}`);
    }
  }

  removeFile(fileID, reason = null) {
    this.removeFiles([fileID], reason);
  }

  pauseResume(fileID) {
    if (!this.getState().capabilities.resumableUploads || this.getFile(fileID).uploadComplete) {
      return undefined;
    }

    const wasPaused = this.getFile(fileID).isPaused || false;
    const isPaused = !wasPaused;
    this.setFileState(fileID, {
      isPaused
    });
    this.emit('upload-pause', fileID, isPaused);
    return isPaused;
  }

  pauseAll() {
    const updatedFiles = { ...this.getState().files
    };
    const inProgressUpdatedFiles = Object.keys(updatedFiles).filter(file => {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: true
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('pause-all');
  }

  resumeAll() {
    const updatedFiles = { ...this.getState().files
    };
    const inProgressUpdatedFiles = Object.keys(updatedFiles).filter(file => {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: false,
        error: null
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('resume-all');
  }

  retryAll() {
    const updatedFiles = { ...this.getState().files
    };
    const filesToRetry = Object.keys(updatedFiles).filter(file => {
      return updatedFiles[file].error;
    });
    filesToRetry.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: false,
        error: null
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      error: null
    });
    this.emit('retry-all', filesToRetry);

    if (filesToRetry.length === 0) {
      return Promise.resolve({
        successful: [],
        failed: []
      });
    }

    const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](filesToRetry, {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }

  cancelAll() {
    this.emit('cancel-all');
    const {
      files
    } = this.getState();
    const fileIDs = Object.keys(files);

    if (fileIDs.length) {
      this.removeFiles(fileIDs, 'cancel-all');
    }

    this.setState({
      totalProgress: 0,
      error: null,
      recoveredState: null
    });
  }

  retryUpload(fileID) {
    this.setFileState(fileID, {
      error: null,
      isPaused: false
    });
    this.emit('upload-retry', fileID);

    const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload]([fileID], {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }

  reset() {
    this.cancelAll();
  }

  logout() {
    this.iteratePlugins(plugin => {
      if (plugin.provider && plugin.provider.logout) {
        plugin.provider.logout();
      }
    });
  }

  calculateProgress(file, data) {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    } // bytesTotal may be null or zero; in that case we can't divide by it


    const canHavePercentage = Number.isFinite(data.bytesTotal) && data.bytesTotal > 0;
    this.setFileState(file.id, {
      progress: { ...this.getFile(file.id).progress,
        bytesUploaded: data.bytesUploaded,
        bytesTotal: data.bytesTotal,
        percentage: canHavePercentage ? Math.round(data.bytesUploaded / data.bytesTotal * 100) : 0
      }
    });
    this.calculateTotalProgress();
  }

  calculateTotalProgress() {
    // calculate total progress, using the number of files currently uploading,
    // multiplied by 100 and the summ of individual progress of each file
    const files = this.getFiles();
    const inProgress = files.filter(file => {
      return file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess;
    });

    if (inProgress.length === 0) {
      this.emit('progress', 0);
      this.setState({
        totalProgress: 0
      });
      return;
    }

    const sizedFiles = inProgress.filter(file => file.progress.bytesTotal != null);
    const unsizedFiles = inProgress.filter(file => file.progress.bytesTotal == null);

    if (sizedFiles.length === 0) {
      const progressMax = inProgress.length * 100;
      const currentProgress = unsizedFiles.reduce((acc, file) => {
        return acc + file.progress.percentage;
      }, 0);
      const totalProgress = Math.round(currentProgress / progressMax * 100);
      this.setState({
        totalProgress
      });
      return;
    }

    let totalSize = sizedFiles.reduce((acc, file) => {
      return acc + file.progress.bytesTotal;
    }, 0);
    const averageSize = totalSize / sizedFiles.length;
    totalSize += averageSize * unsizedFiles.length;
    let uploadedSize = 0;
    sizedFiles.forEach(file => {
      uploadedSize += file.progress.bytesUploaded;
    });
    unsizedFiles.forEach(file => {
      uploadedSize += averageSize * (file.progress.percentage || 0) / 100;
    });
    let totalProgress = totalSize === 0 ? 0 : Math.round(uploadedSize / totalSize * 100); // hot fix, because:
    // uploadedSize ended up larger than totalSize, resulting in 1325% total

    if (totalProgress > 100) {
      totalProgress = 100;
    }

    this.setState({
      totalProgress
    });
    this.emit('progress', totalProgress);
  }
  /**
   * Registers listeners for all global actions, like:
   * `error`, `file-removed`, `upload-progress`
   */


  updateOnlineStatus() {
    const online = typeof window.navigator.onLine !== 'undefined' ? window.navigator.onLine : true;

    if (!online) {
      this.emit('is-offline');
      this.info(this.i18n('noInternetConnection'), 'error', 0);
      this.wasOffline = true;
    } else {
      this.emit('is-online');

      if (this.wasOffline) {
        this.emit('back-online');
        this.info(this.i18n('connectedToInternet'), 'success', 3000);
        this.wasOffline = false;
      }
    }
  }

  getID() {
    return this.opts.id;
  }
  /**
   * Registers a plugin with Core.
   *
   * @param {object} Plugin object
   * @param {object} [opts] object with options to be passed to Plugin
   * @returns {object} self for chaining
   */
  // eslint-disable-next-line no-shadow


  use(Plugin, opts) {
    if (typeof Plugin !== 'function') {
      const msg = `Expected a plugin class, but got ${Plugin === null ? 'null' : typeof Plugin}.` + ' Please verify that the plugin was imported and spelled correctly.';
      throw new TypeError(msg);
    } // Instantiate


    const plugin = new Plugin(this, opts);
    const pluginId = plugin.id;

    if (!pluginId) {
      throw new Error('Your plugin must have an id');
    }

    if (!plugin.type) {
      throw new Error('Your plugin must have a type');
    }

    const existsPluginAlready = this.getPlugin(pluginId);

    if (existsPluginAlready) {
      const msg = `Already found a plugin named '${existsPluginAlready.id}'. ` + `Tried to use: '${pluginId}'.\n` + 'Uppy plugins must have unique `id` options. See https://uppy.io/docs/plugins/#id.';
      throw new Error(msg);
    }

    if (Plugin.VERSION) {
      this.log(`Using ${pluginId} v${Plugin.VERSION}`);
    }

    if (plugin.type in _classPrivateFieldLooseBase(this, _plugins)[_plugins]) {
      _classPrivateFieldLooseBase(this, _plugins)[_plugins][plugin.type].push(plugin);
    } else {
      _classPrivateFieldLooseBase(this, _plugins)[_plugins][plugin.type] = [plugin];
    }

    plugin.install();
    return this;
  }
  /**
   * Find one Plugin by name.
   *
   * @param {string} id plugin id
   * @returns {BasePlugin|undefined}
   */


  getPlugin(id) {
    for (const plugins of Object.values(_classPrivateFieldLooseBase(this, _plugins)[_plugins])) {
      const foundPlugin = plugins.find(plugin => plugin.id === id);
      if (foundPlugin != null) return foundPlugin;
    }

    return undefined;
  }

  [_Symbol$for](type) {
    return _classPrivateFieldLooseBase(this, _plugins)[_plugins][type];
  }
  /**
   * Iterate through all `use`d plugins.
   *
   * @param {Function} method that will be run on each plugin
   */


  iteratePlugins(method) {
    Object.values(_classPrivateFieldLooseBase(this, _plugins)[_plugins]).flat(1).forEach(method);
  }
  /**
   * Uninstall and remove a plugin.
   *
   * @param {object} instance The plugin instance to remove.
   */


  removePlugin(instance) {
    this.log(`Removing plugin ${instance.id}`);
    this.emit('plugin-remove', instance);

    if (instance.uninstall) {
      instance.uninstall();
    }

    const list = _classPrivateFieldLooseBase(this, _plugins)[_plugins][instance.type]; // list.indexOf failed here, because Vue3 converted the plugin instance
    // to a Proxy object, which failed the strict comparison test:
    // obj !== objProxy


    const index = list.findIndex(item => item.id === instance.id);

    if (index !== -1) {
      list.splice(index, 1);
    }

    const state = this.getState();
    const updatedState = {
      plugins: { ...state.plugins,
        [instance.id]: undefined
      }
    };
    this.setState(updatedState);
  }
  /**
   * Uninstall all plugins and close down this Uppy instance.
   */


  close() {
    this.log(`Closing Uppy instance ${this.opts.id}: removing all files and uninstalling plugins`);
    this.reset();

    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[_storeUnsubscribe]();

    this.iteratePlugins(plugin => {
      this.removePlugin(plugin);
    });

    if (typeof window !== 'undefined' && window.removeEventListener) {
      window.removeEventListener('online', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
      window.removeEventListener('offline', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    }
  }

  hideInfo() {
    const {
      info
    } = this.getState();
    this.setState({
      info: info.slice(1)
    });
    this.emit('info-hidden');
  }
  /**
   * Set info message in `state.info`, so that UI plugins like `Informer`
   * can display the message.
   *
   * @param {string | object} message Message to be displayed by the informer
   * @param {string} [type]
   * @param {number} [duration]
   */


  info(message, type = 'info', duration = 3000) {
    const isComplexMessage = typeof message === 'object';
    this.setState({
      info: [...this.getState().info, {
        type,
        message: isComplexMessage ? message.message : message,
        details: isComplexMessage ? message.details : null
      }]
    });
    setTimeout(() => this.hideInfo(), duration);
    this.emit('info-visible');
  }
  /**
   * Passes messages to a function, provided in `opts.logger`.
   * If `opts.logger: Uppy.debugLogger` or `opts.debug: true`, logs to the browser console.
   *
   * @param {string|object} message to log
   * @param {string} [type] optional `error` or `warning`
   */


  log(message, type) {
    const {
      logger
    } = this.opts;

    switch (type) {
      case 'error':
        logger.error(message);
        break;

      case 'warning':
        logger.warn(message);
        break;

      default:
        logger.debug(message);
        break;
    }
  }
  /**
   * Restore an upload by its ID.
   */


  restore(uploadID) {
    this.log(`Core: attempting to restore upload "${uploadID}"`);

    if (!this.getState().currentUploads[uploadID]) {
      _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);

      return Promise.reject(new Error('Nonexistent upload'));
    }

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }
  /**
   * Create an upload for a bunch of files.
   *
   * @param {Array<string>} fileIDs File IDs to include in this upload.
   * @returns {string} ID of this upload.
   */


  [_Symbol$for2](...args) {
    return _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](...args);
  }

  /**
   * Add data to an upload's result object.
   *
   * @param {string} uploadID The ID of the upload.
   * @param {object} data Data properties to add to the result object.
   */
  addResultData(uploadID, data) {
    if (!_classPrivateFieldLooseBase(this, _getUpload)[_getUpload](uploadID)) {
      this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
      return;
    }

    const {
      currentUploads
    } = this.getState();
    const currentUpload = { ...currentUploads[uploadID],
      result: { ...currentUploads[uploadID].result,
        ...data
      }
    };
    this.setState({
      currentUploads: { ...currentUploads,
        [uploadID]: currentUpload
      }
    });
  }
  /**
   * Remove an upload, eg. if it has been canceled or completed.
   *
   * @param {string} uploadID The ID of the upload.
   */


  /**
   * Start an upload for all the files that are not currently being uploaded.
   *
   * @returns {Promise}
   */
  upload() {
    var _classPrivateFieldLoo;

    if (!((_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _plugins)[_plugins].uploader) != null && _classPrivateFieldLoo.length)) {
      this.log('No uploader type plugins are used', 'warning');
    }

    let {
      files
    } = this.getState();
    const onBeforeUploadResult = this.opts.onBeforeUpload(files);

    if (onBeforeUploadResult === false) {
      return Promise.reject(new Error('Not starting the upload because onBeforeUpload returned false'));
    }

    if (onBeforeUploadResult && typeof onBeforeUploadResult === 'object') {
      files = onBeforeUploadResult; // Updating files in state, because uploader plugins receive file IDs,
      // and then fetch the actual file object from state

      this.setState({
        files
      });
    }

    return Promise.resolve().then(() => {
      _classPrivateFieldLooseBase(this, _checkMinNumberOfFiles)[_checkMinNumberOfFiles](files);

      _classPrivateFieldLooseBase(this, _checkRequiredMetaFields)[_checkRequiredMetaFields](files);
    }).catch(err => {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err);
    }).then(() => {
      const {
        currentUploads
      } = this.getState(); // get a list of files that are currently assigned to uploads

      const currentlyUploadingFiles = Object.values(currentUploads).flatMap(curr => curr.fileIDs);
      const waitingFileIDs = [];
      Object.keys(files).forEach(fileID => {
        const file = this.getFile(fileID); // if the file hasn't started uploading and hasn't already been assigned to an upload..

        if (!file.progress.uploadStarted && currentlyUploadingFiles.indexOf(fileID) === -1) {
          waitingFileIDs.push(file.id);
        }
      });

      const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](waitingFileIDs);

      return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
    }).catch(err => {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
        showInformer: false
      });
    });
  }

}

function _checkRestrictions2(file, files = this.getFiles()) {
  const {
    maxFileSize,
    minFileSize,
    maxTotalFileSize,
    maxNumberOfFiles,
    allowedFileTypes
  } = this.opts.restrictions;

  if (maxNumberOfFiles) {
    if (files.length + 1 > maxNumberOfFiles) {
      throw new RestrictionError(`${this.i18n('youCanOnlyUploadX', {
        smart_count: maxNumberOfFiles
      })}`);
    }
  }

  if (allowedFileTypes) {
    const isCorrectFileType = allowedFileTypes.some(type => {
      // check if this is a mime-type
      if (type.indexOf('/') > -1) {
        if (!file.type) return false;
        return match(file.type.replace(/;.*?$/, ''), type);
      } // otherwise this is likely an extension


      if (type[0] === '.' && file.extension) {
        return file.extension.toLowerCase() === type.substr(1).toLowerCase();
      }

      return false;
    });

    if (!isCorrectFileType) {
      const allowedFileTypesString = allowedFileTypes.join(', ');
      throw new RestrictionError(this.i18n('youCanOnlyUploadFileTypes', {
        types: allowedFileTypesString
      }));
    }
  } // We can't check maxTotalFileSize if the size is unknown.


  if (maxTotalFileSize && file.size != null) {
    let totalFilesSize = 0;
    totalFilesSize += file.size;
    files.forEach(f => {
      totalFilesSize += f.size;
    });

    if (totalFilesSize > maxTotalFileSize) {
      throw new RestrictionError(this.i18n('exceedsSize', {
        size: prettierBytes(maxTotalFileSize),
        file: file.name
      }));
    }
  } // We can't check maxFileSize if the size is unknown.


  if (maxFileSize && file.size != null) {
    if (file.size > maxFileSize) {
      throw new RestrictionError(this.i18n('exceedsSize', {
        size: prettierBytes(maxFileSize),
        file: file.name
      }));
    }
  } // We can't check minFileSize if the size is unknown.


  if (minFileSize && file.size != null) {
    if (file.size < minFileSize) {
      throw new RestrictionError(this.i18n('inferiorSize', {
        size: prettierBytes(minFileSize)
      }));
    }
  }
}

function _checkMinNumberOfFiles2(files) {
  const {
    minNumberOfFiles
  } = this.opts.restrictions;

  if (Object.keys(files).length < minNumberOfFiles) {
    throw new RestrictionError(`${this.i18n('youHaveToAtLeastSelectX', {
      smart_count: minNumberOfFiles
    })}`);
  }
}

function _checkRequiredMetaFields2(files) {
  const {
    requiredMetaFields
  } = this.opts.restrictions;
  const {
    hasOwnProperty
  } = Object.prototype;
  const errors = [];

  for (const fileID of Object.keys(files)) {
    const file = this.getFile(fileID);

    for (let i = 0; i < requiredMetaFields.length; i++) {
      if (!hasOwnProperty.call(file.meta, requiredMetaFields[i]) || file.meta[requiredMetaFields[i]] === '') {
        const err = new RestrictionError(`${this.i18n('missingRequiredMetaFieldOnFile', {
          fileName: file.name
        })}`);
        errors.push(err);

        _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
          file,
          showInformer: false,
          throwErr: false
        });
      }
    }
  }

  if (errors.length) {
    throw new AggregateRestrictionError(`${this.i18n('missingRequiredMetaField')}`, errors);
  }
}

function _showOrLogErrorAndThrow2(err, {
  showInformer = true,
  file = null,
  throwErr = true
} = {}) {
  const message = typeof err === 'object' ? err.message : err;
  const details = typeof err === 'object' && err.details ? err.details : ''; // Restriction errors should be logged, but not as errors,
  // as they are expected and shown in the UI.

  let logMessageWithDetails = message;

  if (details) {
    logMessageWithDetails += ` ${details}`;
  }

  if (err.isRestriction) {
    this.log(logMessageWithDetails);
    this.emit('restriction-failed', file, err);
  } else {
    this.log(logMessageWithDetails, 'error');
  } // Sometimes informer has to be shown manually by the developer,
  // for example, in `onBeforeFileAdded`.


  if (showInformer) {
    this.info({
      message,
      details
    }, 'error', this.opts.infoTimeout);
  }

  if (throwErr) {
    throw typeof err === 'object' ? err : new Error(err);
  }
}

function _assertNewUploadAllowed2(file) {
  const {
    allowNewUpload
  } = this.getState();

  if (allowNewUpload === false) {
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](new RestrictionError(this.i18n('noMoreFilesAllowed')), {
      file
    });
  }
}

function _checkAndCreateFileStateObject2(files, fileDescriptor) {
  const fileType = getFileType(fileDescriptor);
  const fileName = getFileName(fileType, fileDescriptor);
  const fileExtension = getFileNameAndExtension(fileName).extension;
  const isRemote = Boolean(fileDescriptor.isRemote);
  const fileID = generateFileID({ ...fileDescriptor,
    type: fileType
  });

  if (this.checkIfFileAlreadyExists(fileID)) {
    const error = new RestrictionError(this.i18n('noDuplicates', {
      fileName
    }));

    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](error, {
      file: fileDescriptor
    });
  }

  const meta = fileDescriptor.meta || {};
  meta.name = fileName;
  meta.type = fileType; // `null` means the size is unknown.

  const size = Number.isFinite(fileDescriptor.data.size) ? fileDescriptor.data.size : null;
  let newFile = {
    source: fileDescriptor.source || '',
    id: fileID,
    name: fileName,
    extension: fileExtension || '',
    meta: { ...this.getState().meta,
      ...meta
    },
    type: fileType,
    data: fileDescriptor.data,
    progress: {
      percentage: 0,
      bytesUploaded: 0,
      bytesTotal: size,
      uploadComplete: false,
      uploadStarted: null
    },
    size,
    isRemote,
    remote: fileDescriptor.remote || '',
    preview: fileDescriptor.preview
  };
  const onBeforeFileAddedResult = this.opts.onBeforeFileAdded(newFile, files);

  if (onBeforeFileAddedResult === false) {
    // Don’t show UI info for this error, as it should be done by the developer
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](new RestrictionError('Cannot add the file because onBeforeFileAdded returned false.'), {
      showInformer: false,
      fileDescriptor
    });
  } else if (typeof onBeforeFileAddedResult === 'object' && onBeforeFileAddedResult !== null) {
    newFile = onBeforeFileAddedResult;
  }

  try {
    const filesArray = Object.keys(files).map(i => files[i]);

    _classPrivateFieldLooseBase(this, _checkRestrictions)[_checkRestrictions](newFile, filesArray);
  } catch (err) {
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
      file: newFile
    });
  }

  return newFile;
}

function _startIfAutoProceed2() {
  if (this.opts.autoProceed && !this.scheduledAutoProceed) {
    this.scheduledAutoProceed = setTimeout(() => {
      this.scheduledAutoProceed = null;
      this.upload().catch(err => {
        if (!err.isRestriction) {
          this.log(err.stack || err.message || err);
        }
      });
    }, 4);
  }
}

function _addListeners2() {
  /**
   * @param {Error} error
   * @param {object} [file]
   * @param {object} [response]
   */
  const errorHandler = (error, file, response) => {
    let errorMsg = error.message || 'Unknown error';

    if (error.details) {
      errorMsg += ` ${error.details}`;
    }

    this.setState({
      error: errorMsg
    });

    if (file != null && file.id in this.getState().files) {
      this.setFileState(file.id, {
        error: errorMsg,
        response
      });
    }
  };

  this.on('error', errorHandler);
  this.on('upload-error', (file, error, response) => {
    errorHandler(error, file, response);

    if (typeof error === 'object' && error.message) {
      const newError = new Error(error.message);
      newError.details = error.message;

      if (error.details) {
        newError.details += ` ${error.details}`;
      }

      newError.message = this.i18n('failedToUpload', {
        file: file.name
      });

      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](newError, {
        throwErr: false
      });
    } else {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](error, {
        throwErr: false
      });
    }
  });
  this.on('upload', () => {
    this.setState({
      error: null
    });
  });
  this.on('upload-started', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: {
        uploadStarted: Date.now(),
        uploadComplete: false,
        percentage: 0,
        bytesUploaded: 0,
        bytesTotal: file.size
      }
    });
  });
  this.on('upload-progress', this.calculateProgress);
  this.on('upload-success', (file, uploadResp) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const currentProgress = this.getFile(file.id).progress;
    this.setFileState(file.id, {
      progress: { ...currentProgress,
        postprocess: _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].size > 0 ? {
          mode: 'indeterminate'
        } : null,
        uploadComplete: true,
        percentage: 100,
        bytesUploaded: currentProgress.bytesTotal
      },
      response: uploadResp,
      uploadURL: uploadResp.uploadURL,
      isPaused: false
    }); // Remote providers sometimes don't tell us the file size,
    // but we can know how many bytes we uploaded once the upload is complete.

    if (file.size == null) {
      this.setFileState(file.id, {
        size: uploadResp.bytesUploaded || currentProgress.bytesTotal
      });
    }

    this.calculateTotalProgress();
  });
  this.on('preprocess-progress', (file, progress) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: { ...this.getFile(file.id).progress,
        preprocess: progress
      }
    });
  });
  this.on('preprocess-complete', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const files = { ...this.getState().files
    };
    files[file.id] = { ...files[file.id],
      progress: { ...files[file.id].progress
      }
    };
    delete files[file.id].progress.preprocess;
    this.setState({
      files
    });
  });
  this.on('postprocess-progress', (file, progress) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: { ...this.getState().files[file.id].progress,
        postprocess: progress
      }
    });
  });
  this.on('postprocess-complete', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const files = { ...this.getState().files
    };
    files[file.id] = { ...files[file.id],
      progress: { ...files[file.id].progress
      }
    };
    delete files[file.id].progress.postprocess;
    this.setState({
      files
    });
  });
  this.on('restored', () => {
    // Files may have changed--ensure progress is still accurate.
    this.calculateTotalProgress();
  }); // show informer if offline

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('online', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    window.addEventListener('offline', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    setTimeout(_classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus], 3000);
  }
}

function _createUpload2(fileIDs, opts = {}) {
  // uppy.retryAll sets this to true — when retrying we want to ignore `allowNewUpload: false`
  const {
    forceAllowNewUpload = false
  } = opts;
  const {
    allowNewUpload,
    currentUploads
  } = this.getState();

  if (!allowNewUpload && !forceAllowNewUpload) {
    throw new Error('Cannot create a new upload: already uploading.');
  }

  const uploadID = nanoid();
  this.emit('upload', {
    id: uploadID,
    fileIDs
  });
  this.setState({
    allowNewUpload: this.opts.allowMultipleUploadBatches !== false && this.opts.allowMultipleUploads !== false,
    currentUploads: { ...currentUploads,
      [uploadID]: {
        fileIDs,
        step: 0,
        result: {}
      }
    }
  });
  return uploadID;
}

function _getUpload2(uploadID) {
  const {
    currentUploads
  } = this.getState();
  return currentUploads[uploadID];
}

function _removeUpload2(uploadID) {
  const currentUploads = { ...this.getState().currentUploads
  };
  delete currentUploads[uploadID];
  this.setState({
    currentUploads
  });
}

async function _runUpload2(uploadID) {
  let {
    currentUploads
  } = this.getState();
  let currentUpload = currentUploads[uploadID];
  const restoreStep = currentUpload.step || 0;
  const steps = [..._classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors], ..._classPrivateFieldLooseBase(this, _uploaders)[_uploaders], ..._classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors]];

  try {
    for (let step = restoreStep; step < steps.length; step++) {
      if (!currentUpload) {
        break;
      }

      const fn = steps[step];
      const updatedUpload = { ...currentUpload,
        step
      };
      this.setState({
        currentUploads: { ...currentUploads,
          [uploadID]: updatedUpload
        }
      }); // TODO give this the `updatedUpload` object as its only parameter maybe?
      // Otherwise when more metadata may be added to the upload this would keep getting more parameters

      await fn(updatedUpload.fileIDs, uploadID); // Update currentUpload value in case it was modified asynchronously.

      currentUploads = this.getState().currentUploads;
      currentUpload = currentUploads[uploadID];
    }
  } catch (err) {
    this.emit('error', err);

    _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);

    throw err;
  } // Set result data.


  if (currentUpload) {
    // Mark postprocessing step as complete if necessary; this addresses a case where we might get
    // stuck in the postprocessing UI while the upload is fully complete.
    // If the postprocessing steps do not do any work, they may not emit postprocessing events at
    // all, and never mark the postprocessing as complete. This is fine on its own but we
    // introduced code in the @uppy/core upload-success handler to prepare postprocessing progress
    // state if any postprocessors are registered. That is to avoid a "flash of completed state"
    // before the postprocessing plugins can emit events.
    //
    // So, just in case an upload with postprocessing plugins *has* completed *without* emitting
    // postprocessing completion, we do it instead.
    currentUpload.fileIDs.forEach(fileID => {
      const file = this.getFile(fileID);

      if (file && file.progress.postprocess) {
        this.emit('postprocess-complete', file);
      }
    });
    const files = currentUpload.fileIDs.map(fileID => this.getFile(fileID));
    const successful = files.filter(file => !file.error);
    const failed = files.filter(file => file.error);
    await this.addResultData(uploadID, {
      successful,
      failed,
      uploadID
    }); // Update currentUpload value in case it was modified asynchronously.

    currentUploads = this.getState().currentUploads;
    currentUpload = currentUploads[uploadID];
  } // Emit completion events.
  // This is in a separate function so that the `currentUploads` variable
  // always refers to the latest state. In the handler right above it refers
  // to an outdated object without the `.result` property.


  let result;

  if (currentUpload) {
    result = currentUpload.result;
    this.emit('complete', result);

    _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);
  }

  if (result == null) {
    this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
  }

  return result;
}

Uppy.VERSION = "2.1.1";
module.exports = Uppy;

},{"./../../store-default":49,"./../../utils/lib/Translator":55,"./../../utils/lib/generateFileID":59,"./../../utils/lib/getFileNameAndExtension":61,"./../../utils/lib/getFileType":62,"./getFileName":39,"./loggers":41,"./supportsUploadProgress":42,"@transloadit/prettier-bytes":1,"lodash.throttle":4,"mime-match":5,"namespace-emitter":6,"nanoid":7}],39:[function(require,module,exports){
"use strict";

module.exports = function getFileName(fileType, fileDescriptor) {
  if (fileDescriptor.name) {
    return fileDescriptor.name;
  }

  if (fileType.split('/')[0] === 'image') {
    return `${fileType.split('/')[0]}.${fileType.split('/')[1]}`;
  }

  return 'noname';
};

},{}],40:[function(require,module,exports){
'use strict';

const Uppy = require('./Uppy');

const UIPlugin = require('./UIPlugin');

const BasePlugin = require('./BasePlugin');

const {
  debugLogger
} = require('./loggers');

module.exports = Uppy;
module.exports.Uppy = Uppy;
module.exports.UIPlugin = UIPlugin;
module.exports.BasePlugin = BasePlugin;
module.exports.debugLogger = debugLogger;

},{"./BasePlugin":36,"./UIPlugin":37,"./Uppy":38,"./loggers":41}],41:[function(require,module,exports){
"use strict";

/* eslint-disable no-console */
const getTimeStamp = require('./../../utils/lib/getTimeStamp'); // Swallow all logs, except errors.
// default if logger is not set or debug: false


const justErrorsLogger = {
  debug: () => {},
  warn: () => {},
  error: (...args) => console.error(`[Uppy] [${getTimeStamp()}]`, ...args)
}; // Print logs to console with namespace + timestamp,
// set by logger: Uppy.debugLogger or debug: true

const debugLogger = {
  debug: (...args) => console.debug(`[Uppy] [${getTimeStamp()}]`, ...args),
  warn: (...args) => console.warn(`[Uppy] [${getTimeStamp()}]`, ...args),
  error: (...args) => console.error(`[Uppy] [${getTimeStamp()}]`, ...args)
};
module.exports = {
  justErrorsLogger,
  debugLogger
};

},{"./../../utils/lib/getTimeStamp":66}],42:[function(require,module,exports){
"use strict";

// Edge 15.x does not fire 'progress' events on uploads.
// See https://github.com/transloadit/uppy/issues/945
// And https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12224510/
module.exports = function supportsUploadProgress(userAgent) {
  // Allow passing in userAgent for tests
  if (userAgent == null) {
    userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;
  } // Assume it works because basically everything supports progress events.


  if (!userAgent) return true;
  const m = /Edge\/(\d+\.\d+)/.exec(userAgent);
  if (!m) return true;
  const edgeVersion = m[1];
  let [major, minor] = edgeVersion.split('.');
  major = parseInt(major, 10);
  minor = parseInt(minor, 10); // Worked before:
  // Edge 40.15063.0.0
  // Microsoft EdgeHTML 15.15063

  if (major < 15 || major === 15 && minor < 15063) {
    return true;
  } // Fixed in:
  // Microsoft EdgeHTML 18.18218


  if (major > 18 || major === 18 && minor >= 18218) {
    return true;
  } // other versions don't work.


  return false;
};

},{}],43:[function(require,module,exports){
"use strict";

var _class, _temp;

const {
  UIPlugin
} = require('./../../core');

const toArray = require('./../../utils/lib/toArray');

const {
  h
} = require('preact');

module.exports = (_temp = _class = class FileInput extends UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.id = this.opts.id || 'FileInput';
    this.title = 'File Input';
    this.type = 'acquirer';
    this.defaultLocale = {
      strings: {
        // The same key is used for the same purpose by @uppy/robodog's `form()` API, but our
        // locale pack scripts can't access it in Robodog. If it is updated here, it should
        // also be updated there!
        chooseFiles: 'Choose files'
      }
    }; // Default options

    const defaultOptions = {
      target: null,
      pretty: true,
      inputName: 'files[]'
    }; // Merge default options with the ones set by user

    this.opts = { ...defaultOptions,
      ...opts
    };
    this.i18nInit();
    this.render = this.render.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  addFiles(files) {
    const descriptors = files.map(file => ({
      source: this.id,
      name: file.name,
      type: file.type,
      data: file
    }));

    try {
      this.uppy.addFiles(descriptors);
    } catch (err) {
      this.uppy.log(err);
    }
  }

  handleInputChange(event) {
    this.uppy.log('[FileInput] Something selected through input...');
    const files = toArray(event.target.files);
    this.addFiles(files); // We clear the input after a file is selected, because otherwise
    // change event is not fired in Chrome and Safari when a file
    // with the same name is selected.
    // ___Why not use value="" on <input/> instead?
    //    Because if we use that method of clearing the input,
    //    Chrome will not trigger change if we drop the same file twice (Issue #768).

    event.target.value = null;
  }

  handleClick() {
    this.input.click();
  }

  render() {
    /* http://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/ */
    const hiddenInputStyle = {
      width: '0.1px',
      height: '0.1px',
      opacity: 0,
      overflow: 'hidden',
      position: 'absolute',
      zIndex: -1
    };
    const {
      restrictions
    } = this.uppy.opts;
    const accept = restrictions.allowedFileTypes ? restrictions.allowedFileTypes.join(',') : null;
    return h("div", {
      className: "uppy-Root uppy-FileInput-container"
    }, h("input", {
      className: "uppy-FileInput-input",
      style: this.opts.pretty && hiddenInputStyle,
      type: "file",
      name: this.opts.inputName,
      onChange: this.handleInputChange,
      multiple: restrictions.maxNumberOfFiles !== 1,
      accept: accept,
      ref: input => {
        this.input = input;
      }
    }), this.opts.pretty && h("button", {
      className: "uppy-FileInput-btn",
      type: "button",
      onClick: this.handleClick
    }, this.i18n('chooseFiles')));
  }

  install() {
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

}, _class.VERSION = "2.0.4", _temp);

},{"./../../core":40,"./../../utils/lib/toArray":74,"preact":9}],44:[function(require,module,exports){
"use strict";

const classNames = require('classnames');

const throttle = require('lodash.throttle');

const prettierBytes = require('@transloadit/prettier-bytes');

const prettyETA = require('./../../utils/lib/prettyETA');

const {
  h
} = require('preact');

const statusBarStates = require('./StatusBarStates');

const DOT = `\u00B7`;

const renderDot = () => ` ${DOT} `;

function UploadBtn(props) {
  const {
    newFiles,
    isUploadStarted,
    recoveredState,
    i18n,
    uploadState,
    isSomeGhost,
    startUpload
  } = props;
  const uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--upload', {
    'uppy-c-btn-primary': uploadState === statusBarStates.STATE_WAITING
  }, {
    'uppy-StatusBar-actionBtn--disabled': isSomeGhost
  });
  const uploadBtnText = newFiles && isUploadStarted && !recoveredState ? i18n('uploadXNewFiles', {
    smart_count: newFiles
  }) : i18n('uploadXFiles', {
    smart_count: newFiles
  });
  return h("button", {
    type: "button",
    className: uploadBtnClassNames,
    "aria-label": i18n('uploadXFiles', {
      smart_count: newFiles
    }),
    onClick: startUpload,
    disabled: isSomeGhost,
    "data-uppy-super-focusable": true
  }, uploadBtnText);
}

function RetryBtn(props) {
  const {
    i18n,
    uppy
  } = props;
  return h("button", {
    type: "button",
    className: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--retry",
    "aria-label": i18n('retryUpload'),
    onClick: () => uppy.retryAll(),
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "8",
    height: "10",
    viewBox: "0 0 8 10"
  }, h("path", {
    d: "M4 2.408a2.75 2.75 0 1 0 2.75 2.75.626.626 0 0 1 1.25.018v.023a4 4 0 1 1-4-4.041V.25a.25.25 0 0 1 .389-.208l2.299 1.533a.25.25 0 0 1 0 .416l-2.3 1.533A.25.25 0 0 1 4 3.316v-.908z"
  })), i18n('retry'));
}

function CancelBtn(props) {
  const {
    i18n,
    uppy
  } = props;
  return h("button", {
    type: "button",
    className: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
    title: i18n('cancel'),
    "aria-label": i18n('cancel'),
    onClick: () => uppy.cancelAll(),
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    fillRule: "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    fill: "#FFF",
    d: "M9.283 8l2.567 2.567-1.283 1.283L8 9.283 5.433 11.85 4.15 10.567 6.717 8 4.15 5.433 5.433 4.15 8 6.717l2.567-2.567 1.283 1.283z"
  }))));
}

function PauseResumeButton(props) {
  const {
    isAllPaused,
    i18n,
    isAllComplete,
    resumableUploads,
    uppy
  } = props;
  const title = isAllPaused ? i18n('resume') : i18n('pause');

  function togglePauseResume() {
    if (isAllComplete) return null;

    if (!resumableUploads) {
      return uppy.cancelAll();
    }

    if (isAllPaused) {
      return uppy.resumeAll();
    }

    return uppy.pauseAll();
  }

  return h("button", {
    title: title,
    "aria-label": title,
    className: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
    type: "button",
    onClick: togglePauseResume,
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    fillRule: "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    fill: "#FFF",
    d: isAllPaused ? 'M6 4.25L11.5 8 6 11.75z' : 'M5 4.5h2v7H5v-7zm4 0h2v7H9v-7z'
  }))));
}

function DoneBtn(props) {
  const {
    i18n,
    doneButtonHandler
  } = props;
  return h("button", {
    type: "button",
    className: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--done",
    onClick: doneButtonHandler,
    "data-uppy-super-focusable": true
  }, i18n('done'));
}

function LoadingSpinner() {
  return h("svg", {
    className: "uppy-StatusBar-spinner",
    "aria-hidden": "true",
    focusable: "false",
    width: "14",
    height: "14"
  }, h("path", {
    d: "M13.983 6.547c-.12-2.509-1.64-4.893-3.939-5.936-2.48-1.127-5.488-.656-7.556 1.094C.524 3.367-.398 6.048.162 8.562c.556 2.495 2.46 4.52 4.94 5.183 2.932.784 5.61-.602 7.256-3.015-1.493 1.993-3.745 3.309-6.298 2.868-2.514-.434-4.578-2.349-5.153-4.84a6.226 6.226 0 0 1 2.98-6.778C6.34.586 9.74 1.1 11.373 3.493c.407.596.693 1.282.842 1.988.127.598.073 1.197.161 1.794.078.525.543 1.257 1.15.864.525-.341.49-1.05.456-1.592-.007-.15.02.3 0 0",
    fillRule: "evenodd"
  }));
}

function ProgressBarProcessing(props) {
  const {
    progress
  } = props;
  const {
    value,
    mode,
    message
  } = progress;
  const roundedValue = Math.round(value * 100);
  const dot = `\u00B7`;
  return h("div", {
    className: "uppy-StatusBar-content"
  }, h(LoadingSpinner, null), mode === 'determinate' ? `${roundedValue}% ${dot} ` : '', message);
}

function ProgressDetails(props) {
  const {
    numUploads,
    complete,
    totalUploadedSize,
    totalSize,
    totalETA,
    i18n
  } = props;
  const ifShowFilesUploadedOfTotal = numUploads > 1;
  return h("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, ifShowFilesUploadedOfTotal && i18n('filesUploadedOfTotal', {
    complete,
    smart_count: numUploads
  }), h("span", {
    className: "uppy-StatusBar-additionalInfo"
  }, ifShowFilesUploadedOfTotal && renderDot(), i18n('dataUploadedOfTotal', {
    complete: prettierBytes(totalUploadedSize),
    total: prettierBytes(totalSize)
  }), renderDot(), i18n('xTimeLeft', {
    time: prettyETA(totalETA)
  })));
}

function UnknownProgressDetails(props) {
  const {
    i18n,
    complete,
    numUploads
  } = props;
  return h("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, i18n('filesUploadedOfTotal', {
    complete,
    smart_count: numUploads
  }));
}

function UploadNewlyAddedFiles(props) {
  const {
    i18n,
    newFiles,
    startUpload
  } = props;
  const uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--uploadNewlyAdded');
  return h("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, h("div", {
    className: "uppy-StatusBar-statusSecondaryHint"
  }, i18n('xMoreFilesAdded', {
    smart_count: newFiles
  })), h("button", {
    type: "button",
    className: uploadBtnClassNames,
    "aria-label": i18n('uploadXFiles', {
      smart_count: newFiles
    }),
    onClick: startUpload
  }, i18n('upload')));
}

const ThrottledProgressDetails = throttle(ProgressDetails, 500, {
  leading: true,
  trailing: true
});

function ProgressBarUploading(props) {
  const {
    i18n,
    supportsUploadProgress,
    totalProgress,
    showProgressDetails,
    isUploadStarted,
    isAllComplete,
    isAllPaused,
    newFiles,
    numUploads,
    complete,
    totalUploadedSize,
    totalSize,
    totalETA,
    startUpload
  } = props;
  const showUploadNewlyAddedFiles = newFiles && isUploadStarted;

  if (!isUploadStarted || isAllComplete) {
    return null;
  }

  const title = isAllPaused ? i18n('paused') : i18n('uploading');

  function renderProgressDetails() {
    if (!isAllPaused && !showUploadNewlyAddedFiles && showProgressDetails) {
      if (supportsUploadProgress) {
        return h(ThrottledProgressDetails, {
          numUploads: numUploads,
          complete: complete,
          totalUploadedSize: totalUploadedSize,
          totalSize: totalSize,
          totalETA: totalETA,
          i18n: i18n
        });
      }

      return h(UnknownProgressDetails, {
        i18n: i18n,
        complete: complete,
        numUploads: numUploads
      });
    }

    return null;
  }

  return h("div", {
    className: "uppy-StatusBar-content",
    "aria-label": title,
    title: title
  }, !isAllPaused ? h(LoadingSpinner, null) : null, h("div", {
    className: "uppy-StatusBar-status"
  }, h("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, supportsUploadProgress ? `${title}: ${totalProgress}%` : title), renderProgressDetails(), showUploadNewlyAddedFiles ? h(UploadNewlyAddedFiles, {
    i18n: i18n,
    newFiles: newFiles,
    startUpload: startUpload
  }) : null));
}

function ProgressBarComplete(props) {
  const {
    i18n
  } = props;
  return h("div", {
    className: "uppy-StatusBar-content",
    role: "status",
    title: i18n('complete')
  }, h("div", {
    className: "uppy-StatusBar-status"
  }, h("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-StatusBar-statusIndicator uppy-c-icon",
    width: "15",
    height: "11",
    viewBox: "0 0 15 11"
  }, h("path", {
    d: "M.414 5.843L1.627 4.63l3.472 3.472L13.202 0l1.212 1.213L5.1 10.528z"
  })), i18n('complete'))));
}

function ProgressBarError(props) {
  const {
    error,
    i18n
  } = props;

  function displayErrorAlert() {
    const errorMessage = `${i18n('uploadFailed')} \n\n ${error}`; // eslint-disable-next-line no-alert

    alert(errorMessage); // TODO: move to custom alert implementation
  }

  return h("div", {
    className: "uppy-StatusBar-content",
    role: "alert",
    title: i18n('uploadFailed')
  }, h("div", {
    className: "uppy-StatusBar-status"
  }, h("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-StatusBar-statusIndicator uppy-c-icon",
    width: "11",
    height: "11",
    viewBox: "0 0 11 11"
  }, h("path", {
    d: "M4.278 5.5L0 1.222 1.222 0 5.5 4.278 9.778 0 11 1.222 6.722 5.5 11 9.778 9.778 11 5.5 6.722 1.222 11 0 9.778z"
  })), i18n('uploadFailed'))), h("button", {
    className: "uppy-StatusBar-details",
    "aria-label": error,
    "data-microtip-position": "top-right",
    "data-microtip-size": "medium",
    onClick: displayErrorAlert,
    type: "button"
  }, "?"));
}

module.exports = {
  UploadBtn,
  RetryBtn,
  CancelBtn,
  PauseResumeButton,
  DoneBtn,
  LoadingSpinner,
  ProgressDetails,
  ProgressBarProcessing,
  ProgressBarError,
  ProgressBarUploading,
  ProgressBarComplete
};

},{"./../../utils/lib/prettyETA":71,"./StatusBarStates":46,"@transloadit/prettier-bytes":1,"classnames":2,"lodash.throttle":4,"preact":9}],45:[function(require,module,exports){
"use strict";

const {
  h
} = require('preact');

const classNames = require('classnames');

const statusBarStates = require('./StatusBarStates');

const calculateProcessingProgress = require('./calculateProcessingProgress');

const {
  UploadBtn,
  RetryBtn,
  CancelBtn,
  PauseResumeButton,
  DoneBtn,
  ProgressBarProcessing,
  ProgressBarError,
  ProgressBarUploading,
  ProgressBarComplete
} = require('./Components');

const {
  STATE_ERROR,
  STATE_WAITING,
  STATE_PREPROCESSING,
  STATE_UPLOADING,
  STATE_POSTPROCESSING,
  STATE_COMPLETE
} = statusBarStates;
module.exports = StatusBar;

function StatusBar(props) {
  const {
    newFiles,
    allowNewUpload,
    isUploadInProgress,
    isAllPaused,
    resumableUploads,
    error,
    hideUploadButton,
    hidePauseResumeButton,
    hideCancelButton,
    hideRetryButton,
    recoveredState,
    uploadState,
    totalProgress,
    files,
    supportsUploadProgress,
    hideAfterFinish,
    isSomeGhost,
    isTargetDOMEl,
    doneButtonHandler,
    isUploadStarted,
    i18n,
    startUpload,
    uppy,
    isAllComplete,
    showProgressDetails,
    numUploads,
    complete,
    totalSize,
    totalETA,
    totalUploadedSize
  } = props;

  function getProgressValue() {
    switch (uploadState) {
      case STATE_POSTPROCESSING:
      case STATE_PREPROCESSING:
        {
          const progress = calculateProcessingProgress(files);

          if (progress.mode === 'determinate') {
            return progress.value * 100;
          }

          return totalProgress;
        }

      case STATE_ERROR:
        {
          return null;
        }

      case STATE_UPLOADING:
        {
          if (!supportsUploadProgress) {
            return null;
          }

          return totalProgress;
        }

      default:
        return totalProgress;
    }
  }

  function getIsIndeterminate() {
    switch (uploadState) {
      case STATE_POSTPROCESSING:
      case STATE_PREPROCESSING:
        {
          const {
            mode
          } = calculateProcessingProgress(files);
          return mode === 'indeterminate';
        }

      case STATE_UPLOADING:
        {
          if (!supportsUploadProgress) {
            return true;
          }

          return false;
        }

      default:
        return false;
    }
  }

  function getIsHidden() {
    if (recoveredState) {
      return false;
    }

    switch (uploadState) {
      case STATE_WAITING:
        return hideUploadButton || newFiles === 0;

      case STATE_COMPLETE:
        return hideAfterFinish;

      default:
        return false;
    }
  }

  const progressValue = getProgressValue();
  const isHidden = getIsHidden();
  const width = progressValue != null ? progressValue : 100;
  const showUploadBtn = !error && newFiles && !isUploadInProgress && !isAllPaused && allowNewUpload && !hideUploadButton;
  const showCancelBtn = !hideCancelButton && uploadState !== STATE_WAITING && uploadState !== STATE_COMPLETE;
  const showPauseResumeBtn = resumableUploads && !hidePauseResumeButton && uploadState === STATE_UPLOADING;
  const showRetryBtn = error && !hideRetryButton;
  const showDoneBtn = doneButtonHandler && uploadState === STATE_COMPLETE;
  const progressClassNames = classNames('uppy-StatusBar-progress', {
    'is-indeterminate': getIsIndeterminate()
  });
  const statusBarClassNames = classNames({
    'uppy-Root': isTargetDOMEl
  }, 'uppy-StatusBar', `is-${uploadState}`, {
    'has-ghosts': isSomeGhost
  });
  return h("div", {
    className: statusBarClassNames,
    "aria-hidden": isHidden
  }, h("div", {
    className: progressClassNames,
    style: {
      width: `${width}%`
    },
    role: "progressbar",
    "aria-label": `${width}%`,
    "aria-valuetext": `${width}%`,
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": progressValue
  }), (() => {
    switch (uploadState) {
      case STATE_PREPROCESSING:
      case STATE_POSTPROCESSING:
        return h(ProgressBarProcessing, {
          progress: calculateProcessingProgress(files)
        });

      case STATE_COMPLETE:
        return h(ProgressBarComplete, {
          i18n: i18n
        });

      case STATE_ERROR:
        return h(ProgressBarError, {
          error: error,
          i18n: i18n
        });

      case STATE_UPLOADING:
        return h(ProgressBarUploading, {
          i18n: i18n,
          supportsUploadProgress: supportsUploadProgress,
          totalProgress: totalProgress,
          showProgressDetails: showProgressDetails,
          isUploadStarted: isUploadStarted,
          isAllComplete: isAllComplete,
          isAllPaused: isAllPaused,
          newFiles: newFiles,
          numUploads: numUploads,
          complete: complete,
          totalUploadedSize: totalUploadedSize,
          totalSize: totalSize,
          totalETA: totalETA,
          startUpload: startUpload
        });

      default:
        return null;
    }
  })(), h("div", {
    className: "uppy-StatusBar-actions"
  }, recoveredState || showUploadBtn ? h(UploadBtn, {
    newFiles: newFiles,
    isUploadStarted: isUploadStarted,
    recoveredState: recoveredState,
    i18n: i18n,
    isSomeGhost: isSomeGhost,
    startUpload: startUpload,
    uploadState: uploadState
  }) : null, showRetryBtn ? h(RetryBtn, {
    i18n: i18n,
    uppy: uppy
  }) : null, showPauseResumeBtn ? h(PauseResumeButton, {
    isAllPaused: isAllPaused,
    i18n: i18n,
    isAllComplete: isAllComplete,
    resumableUploads: resumableUploads,
    uppy: uppy
  }) : null, showCancelBtn ? h(CancelBtn, {
    i18n: i18n,
    uppy: uppy
  }) : null, showDoneBtn ? h(DoneBtn, {
    i18n: i18n,
    doneButtonHandler: doneButtonHandler
  }) : null));
}

},{"./Components":44,"./StatusBarStates":46,"./calculateProcessingProgress":47,"classnames":2,"preact":9}],46:[function(require,module,exports){
"use strict";

module.exports = {
  STATE_ERROR: 'error',
  STATE_WAITING: 'waiting',
  STATE_PREPROCESSING: 'preprocessing',
  STATE_UPLOADING: 'uploading',
  STATE_POSTPROCESSING: 'postprocessing',
  STATE_COMPLETE: 'complete'
};

},{}],47:[function(require,module,exports){
"use strict";

module.exports = function calculateProcessingProgress(files) {
  const values = [];
  let mode;
  let message;

  for (const {
    progress
  } of Object.values(files)) {
    const {
      preprocess,
      postprocess
    } = progress; // In the future we should probably do this differently. For now we'll take the
    // mode and message from the first file…

    if (message == null && (preprocess || postprocess)) {
      ({
        mode,
        message
      } = preprocess || postprocess);
    }

    if ((preprocess == null ? void 0 : preprocess.mode) === 'determinate') values.push(preprocess.value);
    if ((postprocess == null ? void 0 : postprocess.mode) === 'determinate') values.push(postprocess.value);
  }

  const value = values.reduce((total, progressValue) => {
    return total + progressValue / values.length;
  }, 0);
  return {
    mode,
    message,
    value
  };
};

},{}],48:[function(require,module,exports){
"use strict";

var _class, _temp;

const {
  UIPlugin
} = require('./../../core');

const getSpeed = require('./../../utils/lib/getSpeed');

const getBytesRemaining = require('./../../utils/lib/getBytesRemaining');

const getTextDirection = require('./../../utils/lib/getTextDirection');

const statusBarStates = require('./StatusBarStates');

const StatusBarUI = require('./StatusBar');
/**
 * StatusBar: renders a status bar with upload/pause/resume/cancel/retry buttons,
 * progress percentage and time remaining.
 */


module.exports = (_temp = _class = class StatusBar extends UIPlugin {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    super(uppy, opts);

    this.startUpload = () => {
      const {
        recoveredState
      } = this.uppy.getState();

      if (recoveredState) {
        this.uppy.emit('restore-confirmed');
        return undefined;
      }

      return this.uppy.upload().catch(() => {// Error logged in Core
      });
    };

    this.id = this.opts.id || 'StatusBar';
    this.title = 'StatusBar';
    this.type = 'progressindicator';
    this.defaultLocale = {
      strings: {
        uploading: 'Uploading',
        upload: 'Upload',
        complete: 'Complete',
        uploadFailed: 'Upload failed',
        paused: 'Paused',
        retry: 'Retry',
        retryUpload: 'Retry upload',
        cancel: 'Cancel',
        pause: 'Pause',
        resume: 'Resume',
        done: 'Done',
        filesUploadedOfTotal: {
          0: '%{complete} of %{smart_count} file uploaded',
          1: '%{complete} of %{smart_count} files uploaded'
        },
        dataUploadedOfTotal: '%{complete} of %{total}',
        xTimeLeft: '%{time} left',
        uploadXFiles: {
          0: 'Upload %{smart_count} file',
          1: 'Upload %{smart_count} files'
        },
        uploadXNewFiles: {
          0: 'Upload +%{smart_count} file',
          1: 'Upload +%{smart_count} files'
        },
        xMoreFilesAdded: {
          0: '%{smart_count} more file added',
          1: '%{smart_count} more files added'
        }
      }
    }; // set default options

    const defaultOptions = {
      target: 'body',
      hideUploadButton: false,
      hideRetryButton: false,
      hidePauseResumeButton: false,
      hideCancelButton: false,
      showProgressDetails: false,
      hideAfterFinish: true,
      doneButtonHandler: null
    };
    this.opts = { ...defaultOptions,
      ...opts
    };
    this.i18nInit();
    this.render = this.render.bind(this);
    this.install = this.install.bind(this);
  }

  render(state) {
    const {
      capabilities,
      files,
      allowNewUpload,
      totalProgress,
      error,
      recoveredState
    } = state;
    const {
      newFiles,
      startedFiles,
      completeFiles,
      inProgressNotPausedFiles,
      isUploadStarted,
      isAllComplete,
      isAllErrored,
      isAllPaused,
      isUploadInProgress,
      isSomeGhost
    } = this.uppy.getObjectOfFilesPerState(); // If some state was recovered, we want to show Upload button/counter
    // for all the files, because in this case it’s not an Upload button,
    // but “Confirm Restore Button”

    const newFilesOrRecovered = recoveredState ? Object.values(files) : newFiles;
    const totalETA = getTotalETA(inProgressNotPausedFiles);
    const resumableUploads = !!capabilities.resumableUploads;
    const supportsUploadProgress = capabilities.uploadProgress !== false;
    let totalSize = 0;
    let totalUploadedSize = 0;
    startedFiles.forEach(file => {
      totalSize += file.progress.bytesTotal || 0;
      totalUploadedSize += file.progress.bytesUploaded || 0;
    });
    return StatusBarUI({
      error,
      uploadState: getUploadingState(isAllErrored, isAllComplete, recoveredState, state.files || {}),
      allowNewUpload,
      totalProgress,
      totalSize,
      totalUploadedSize,
      isAllComplete: false,
      isAllPaused,
      isAllErrored,
      isUploadStarted,
      isUploadInProgress,
      isSomeGhost,
      recoveredState,
      complete: completeFiles.length,
      newFiles: newFilesOrRecovered.length,
      numUploads: startedFiles.length,
      totalETA,
      files,
      i18n: this.i18n,
      uppy: this.uppy,
      startUpload: this.startUpload,
      doneButtonHandler: this.opts.doneButtonHandler,
      resumableUploads,
      supportsUploadProgress,
      showProgressDetails: this.opts.showProgressDetails,
      hideUploadButton: this.opts.hideUploadButton,
      hideRetryButton: this.opts.hideRetryButton,
      hidePauseResumeButton: this.opts.hidePauseResumeButton,
      hideCancelButton: this.opts.hideCancelButton,
      hideAfterFinish: this.opts.hideAfterFinish,
      isTargetDOMEl: this.isTargetDOMEl
    });
  }

  onMount() {
    // Set the text direction if the page has not defined one.
    const element = this.el;
    const direction = getTextDirection(element);

    if (!direction) {
      element.dir = 'ltr';
    }
  }

  install() {
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

}, _class.VERSION = "2.1.1", _temp);

function getTotalSpeed(files) {
  let totalSpeed = 0;
  files.forEach(file => {
    totalSpeed += getSpeed(file.progress);
  });
  return totalSpeed;
}

function getTotalETA(files) {
  const totalSpeed = getTotalSpeed(files);

  if (totalSpeed === 0) {
    return 0;
  }

  const totalBytesRemaining = files.reduce((total, file) => {
    return total + getBytesRemaining(file.progress);
  }, 0);
  return Math.round(totalBytesRemaining / totalSpeed * 10) / 10;
}

function getUploadingState(isAllErrored, isAllComplete, recoveredState, files) {
  if (isAllErrored) {
    return statusBarStates.STATE_ERROR;
  }

  if (isAllComplete) {
    return statusBarStates.STATE_COMPLETE;
  }

  if (recoveredState) {
    return statusBarStates.STATE_WAITING;
  }

  let state = statusBarStates.STATE_WAITING;
  const fileIDs = Object.keys(files);

  for (let i = 0; i < fileIDs.length; i++) {
    const {
      progress
    } = files[fileIDs[i]]; // If ANY files are being uploaded right now, show the uploading state.

    if (progress.uploadStarted && !progress.uploadComplete) {
      return statusBarStates.STATE_UPLOADING;
    } // If files are being preprocessed AND postprocessed at this time, we show the
    // preprocess state. If any files are being uploaded we show uploading.


    if (progress.preprocess && state !== statusBarStates.STATE_UPLOADING) {
      state = statusBarStates.STATE_PREPROCESSING;
    } // If NO files are being preprocessed or uploaded right now, but some files are
    // being postprocessed, show the postprocess state.


    if (progress.postprocess && state !== statusBarStates.STATE_UPLOADING && state !== statusBarStates.STATE_PREPROCESSING) {
      state = statusBarStates.STATE_POSTPROCESSING;
    }
  }

  return state;
}

},{"./../../core":40,"./../../utils/lib/getBytesRemaining":60,"./../../utils/lib/getSpeed":64,"./../../utils/lib/getTextDirection":65,"./StatusBar":45,"./StatusBarStates":46}],49:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _publish = /*#__PURE__*/_classPrivateFieldLooseKey("publish");

/**
 * Default store that keeps state in a simple object.
 */
class DefaultStore {
  constructor() {
    Object.defineProperty(this, _publish, {
      value: _publish2
    });
    this.state = {};
    this.callbacks = [];
  }

  getState() {
    return this.state;
  }

  setState(patch) {
    const prevState = { ...this.state
    };
    const nextState = { ...this.state,
      ...patch
    };
    this.state = nextState;

    _classPrivateFieldLooseBase(this, _publish)[_publish](prevState, nextState, patch);
  }

  subscribe(listener) {
    this.callbacks.push(listener);
    return () => {
      // Remove the listener.
      this.callbacks.splice(this.callbacks.indexOf(listener), 1);
    };
  }

}

function _publish2(...args) {
  this.callbacks.forEach(listener => {
    listener(...args);
  });
}

DefaultStore.VERSION = "2.0.2";

module.exports = function defaultStore() {
  return new DefaultStore();
};

},{}],50:[function(require,module,exports){
"use strict";

const tus = require('tus-js-client');

function isCordova() {
  return typeof window !== 'undefined' && (typeof window.PhoneGap !== 'undefined' || typeof window.Cordova !== 'undefined' || typeof window.cordova !== 'undefined');
}

function isReactNative() {
  return typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative';
} // We override tus fingerprint to uppy’s `file.id`, since the `file.id`
// now also includes `relativePath` for files added from folders.
// This means you can add 2 identical files, if one is in folder a,
// the other in folder b — `a/file.jpg` and `b/file.jpg`, when added
// together with a folder, will be treated as 2 separate files.
//
// For React Native and Cordova, we let tus-js-client’s default
// fingerprint handling take charge.


module.exports = function getFingerprint(uppyFileObj) {
  return (file, options) => {
    if (isCordova() || isReactNative()) {
      return tus.defaultOptions.fingerprint(file, options);
    }

    const uppyFingerprint = ['tus', uppyFileObj.id, options.endpoint].join('-');
    return Promise.resolve(uppyFingerprint);
  };
};

},{"tus-js-client":16}],51:[function(require,module,exports){
"use strict";

var _class, _temp;

const BasePlugin = require('./../../core/lib/BasePlugin');

const tus = require('tus-js-client');

const {
  Provider,
  RequestClient,
  Socket
} = require('./../../companion-client');

const emitSocketProgress = require('./../../utils/lib/emitSocketProgress');

const getSocketHost = require('./../../utils/lib/getSocketHost');

const settle = require('./../../utils/lib/settle');

const EventTracker = require('./../../utils/lib/EventTracker');

const NetworkError = require('./../../utils/lib/NetworkError');

const isNetworkError = require('./../../utils/lib/isNetworkError');

const {
  RateLimitedQueue
} = require('./../../utils/lib/RateLimitedQueue');

const hasProperty = require('./../../utils/lib/hasProperty');

const getFingerprint = require('./getFingerprint');
/** @typedef {import('..').TusOptions} TusOptions */

/** @typedef {import('tus-js-client').UploadOptions} RawTusOptions */

/** @typedef {import('@uppy/core').Uppy} Uppy */

/** @typedef {import('@uppy/core').UppyFile} UppyFile */

/** @typedef {import('@uppy/core').FailedUppyFile<{}>} FailedUppyFile */

/**
 * Extracted from https://github.com/tus/tus-js-client/blob/master/lib/upload.js#L13
 * excepted we removed 'fingerprint' key to avoid adding more dependencies
 *
 * @type {RawTusOptions}
 */


const tusDefaultOptions = {
  endpoint: '',
  uploadUrl: null,
  metadata: {},
  uploadSize: null,
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  overridePatchMethod: false,
  headers: {},
  addRequestId: false,
  chunkSize: Infinity,
  retryDelays: [0, 1000, 3000, 5000],
  parallelUploads: 1,
  removeFingerprintOnSuccess: false,
  uploadLengthDeferred: false,
  uploadDataDuringCreation: false
};
/**
 * Tus resumable file uploader
 */

module.exports = (_temp = _class = class Tus extends BasePlugin {
  /**
   * @param {Uppy} uppy
   * @param {TusOptions} opts
   */
  constructor(uppy, opts) {
    super(uppy, opts);
    this.type = 'uploader';
    this.id = this.opts.id || 'Tus';
    this.title = 'Tus'; // set default options

    const defaultOptions = {
      useFastRemoteRetry: true,
      limit: 5,
      retryDelays: [0, 1000, 3000, 5000],
      withCredentials: false
    }; // merge default options with the ones set by user

    /** @type {import("..").TusOptions} */

    this.opts = { ...defaultOptions,
      ...opts
    };

    if ('autoRetry' in opts) {
      throw new Error('The `autoRetry` option was deprecated and has been removed.');
    }
    /**
     * Simultaneous upload limiting is shared across all uploads with this plugin.
     *
     * @type {RateLimitedQueue}
     */


    this.requests = new RateLimitedQueue(this.opts.limit);
    this.uploaders = Object.create(null);
    this.uploaderEvents = Object.create(null);
    this.uploaderSockets = Object.create(null);
    this.handleResetProgress = this.handleResetProgress.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleResetProgress() {
    const files = { ...this.uppy.getState().files
    };
    Object.keys(files).forEach(fileID => {
      // Only clone the file object if it has a Tus `uploadUrl` attached.
      if (files[fileID].tus && files[fileID].tus.uploadUrl) {
        const tusState = { ...files[fileID].tus
        };
        delete tusState.uploadUrl;
        files[fileID] = { ...files[fileID],
          tus: tusState
        };
      }
    });
    this.uppy.setState({
      files
    });
  }
  /**
   * Clean up all references for a file's upload: the tus.Upload instance,
   * any events related to the file, and the Companion WebSocket connection.
   *
   * @param {string} fileID
   */


  resetUploaderReferences(fileID, opts = {}) {
    if (this.uploaders[fileID]) {
      const uploader = this.uploaders[fileID];
      uploader.abort();

      if (opts.abort) {
        uploader.abort(true);
      }

      this.uploaders[fileID] = null;
    }

    if (this.uploaderEvents[fileID]) {
      this.uploaderEvents[fileID].remove();
      this.uploaderEvents[fileID] = null;
    }

    if (this.uploaderSockets[fileID]) {
      this.uploaderSockets[fileID].close();
      this.uploaderSockets[fileID] = null;
    }
  }
  /**
   * Create a new Tus upload.
   *
   * A lot can happen during an upload, so this is quite hard to follow!
   * - First, the upload is started. If the file was already paused by the time the upload starts, nothing should happen.
   *   If the `limit` option is used, the upload must be queued onto the `this.requests` queue.
   *   When an upload starts, we store the tus.Upload instance, and an EventTracker instance that manages the event listeners
   *   for pausing, cancellation, removal, etc.
   * - While the upload is in progress, it may be paused or cancelled.
   *   Pausing aborts the underlying tus.Upload, and removes the upload from the `this.requests` queue. All other state is
   *   maintained.
   *   Cancelling removes the upload from the `this.requests` queue, and completely aborts the upload-- the `tus.Upload`
   *   instance is aborted and discarded, the EventTracker instance is destroyed (removing all listeners).
   *   Resuming the upload uses the `this.requests` queue as well, to prevent selectively pausing and resuming uploads from
   *   bypassing the limit.
   * - After completing an upload, the tus.Upload and EventTracker instances are cleaned up, and the upload is marked as done
   *   in the `this.requests` queue.
   * - When an upload completed with an error, the same happens as on successful completion, but the `upload()` promise is
   *   rejected.
   *
   * When working on this function, keep in mind:
   *  - When an upload is completed or cancelled for any reason, the tus.Upload and EventTracker instances need to be cleaned
   *    up using this.resetUploaderReferences().
   *  - When an upload is cancelled or paused, for any reason, it needs to be removed from the `this.requests` queue using
   *    `queuedRequest.abort()`.
   *  - When an upload is completed for any reason, including errors, it needs to be marked as such using
   *    `queuedRequest.done()`.
   *  - When an upload is started or resumed, it needs to go through the `this.requests` queue. The `queuedRequest` variable
   *    must be updated so the other uses of it are valid.
   *  - Before replacing the `queuedRequest` variable, the previous `queuedRequest` must be aborted, else it will keep taking
   *    up a spot in the queue.
   *
   * @param {UppyFile} file for use with upload
   * @param {number} current file in a queue
   * @param {number} total number of files in a queue
   * @returns {Promise<void>}
   */


  upload(file) {
    this.resetUploaderReferences(file.id); // Create a new tus upload

    return new Promise((resolve, reject) => {
      this.uppy.emit('upload-started', file);
      const opts = { ...this.opts,
        ...(file.tus || {})
      };

      if (typeof opts.headers === 'function') {
        opts.headers = opts.headers(file);
      }
      /** @type {RawTusOptions} */


      const uploadOptions = { ...tusDefaultOptions,
        ...opts
      }; // We override tus fingerprint to uppy’s `file.id`, since the `file.id`
      // now also includes `relativePath` for files added from folders.
      // This means you can add 2 identical files, if one is in folder a,
      // the other in folder b.

      uploadOptions.fingerprint = getFingerprint(file);

      uploadOptions.onBeforeRequest = req => {
        const xhr = req.getUnderlyingObject();
        xhr.withCredentials = !!opts.withCredentials;

        if (typeof opts.onBeforeRequest === 'function') {
          opts.onBeforeRequest(req);
        }
      };

      uploadOptions.onError = err => {
        this.uppy.log(err);
        const xhr = err.originalRequest ? err.originalRequest.getUnderlyingObject() : null;

        if (isNetworkError(xhr)) {
          err = new NetworkError(err, xhr);
        }

        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        this.uppy.emit('upload-error', file, err);
        reject(err);
      };

      uploadOptions.onProgress = (bytesUploaded, bytesTotal) => {
        this.onReceiveUploadUrl(file, upload.url);
        this.uppy.emit('upload-progress', file, {
          uploader: this,
          bytesUploaded,
          bytesTotal
        });
      };

      uploadOptions.onSuccess = () => {
        const uploadResp = {
          uploadURL: upload.url
        };
        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        this.uppy.emit('upload-success', file, uploadResp);

        if (upload.url) {
          this.uppy.log(`Download ${upload.file.name} from ${upload.url}`);
        }

        resolve(upload);
      };

      const copyProp = (obj, srcProp, destProp) => {
        if (hasProperty(obj, srcProp) && !hasProperty(obj, destProp)) {
          obj[destProp] = obj[srcProp];
        }
      };
      /** @type {Record<string, string>} */


      const meta = {};
      const metaFields = Array.isArray(opts.metaFields) ? opts.metaFields // Send along all fields by default.
      : Object.keys(file.meta);
      metaFields.forEach(item => {
        meta[item] = file.meta[item];
      }); // tusd uses metadata fields 'filetype' and 'filename'

      copyProp(meta, 'type', 'filetype');
      copyProp(meta, 'name', 'filename');
      uploadOptions.metadata = meta;
      const upload = new tus.Upload(file.data, uploadOptions);
      this.uploaders[file.id] = upload;
      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      upload.findPreviousUploads().then(previousUploads => {
        const previousUpload = previousUploads[0];

        if (previousUpload) {
          this.uppy.log(`[Tus] Resuming upload of ${file.id} started at ${previousUpload.creationTime}`);
          upload.resumeFromPreviousUpload(previousUpload);
        }
      });
      let queuedRequest = this.requests.run(() => {
        if (!file.isPaused) {
          upload.start();
        } // Don't do anything here, the caller will take care of cancelling the upload itself
        // using resetUploaderReferences(). This is because resetUploaderReferences() has to be
        // called when this request is still in the queue, and has not been started yet, too. At
        // that point this cancellation function is not going to be called.
        // Also, we need to remove the request from the queue _without_ destroying everything
        // related to this upload to handle pauses.


        return () => {};
      });
      this.onFileRemove(file.id, targetFileID => {
        queuedRequest.abort();
        this.resetUploaderReferences(file.id, {
          abort: !!upload.url
        });
        resolve(`upload ${targetFileID} was removed`);
      });
      this.onPause(file.id, isPaused => {
        if (isPaused) {
          // Remove this file from the queue so another file can start in its place.
          queuedRequest.abort();
          upload.abort();
        } else {
          // Resuming an upload should be queued, else you could pause and then
          // resume a queued upload to make it skip the queue.
          queuedRequest.abort();
          queuedRequest = this.requests.run(() => {
            upload.start();
            return () => {};
          });
        }
      });
      this.onPauseAll(file.id, () => {
        queuedRequest.abort();
        upload.abort();
      });
      this.onCancelAll(file.id, () => {
        queuedRequest.abort();
        this.resetUploaderReferences(file.id, {
          abort: !!upload.url
        });
        resolve(`upload ${file.id} was canceled`);
      });
      this.onResumeAll(file.id, () => {
        queuedRequest.abort();

        if (file.error) {
          upload.abort();
        }

        queuedRequest = this.requests.run(() => {
          upload.start();
          return () => {};
        });
      });
    }).catch(err => {
      this.uppy.emit('upload-error', file, err);
      throw err;
    });
  }
  /**
   * @param {UppyFile} file for use with upload
   * @param {number} current file in a queue
   * @param {number} total number of files in a queue
   * @returns {Promise<void>}
   */


  uploadRemote(file) {
    this.resetUploaderReferences(file.id);
    const opts = { ...this.opts
    };

    if (file.tus) {
      // Install file-specific upload overrides.
      Object.assign(opts, file.tus);
    }

    this.uppy.emit('upload-started', file);
    this.uppy.log(file.remote.url);

    if (file.serverToken) {
      return this.connectToServerSocket(file);
    }

    return new Promise((resolve, reject) => {
      const Client = file.remote.providerOptions.provider ? Provider : RequestClient;
      const client = new Client(this.uppy, file.remote.providerOptions); // !! cancellation is NOT supported at this stage yet

      client.post(file.remote.url, { ...file.remote.body,
        endpoint: opts.endpoint,
        uploadUrl: opts.uploadUrl,
        protocol: 'tus',
        size: file.data.size,
        headers: opts.headers,
        metadata: file.meta
      }).then(res => {
        this.uppy.setFileState(file.id, {
          serverToken: res.token
        });
        file = this.uppy.getFile(file.id);
        return this.connectToServerSocket(file);
      }).then(() => {
        resolve();
      }).catch(err => {
        this.uppy.emit('upload-error', file, err);
        reject(err);
      });
    });
  }
  /**
   * See the comment on the upload() method.
   *
   * Additionally, when an upload is removed, completed, or cancelled, we need to close the WebSocket connection. This is
   * handled by the resetUploaderReferences() function, so the same guidelines apply as in upload().
   *
   * @param {UppyFile} file
   */


  connectToServerSocket(file) {
    return new Promise((resolve, reject) => {
      const token = file.serverToken;
      const host = getSocketHost(file.remote.companionUrl);
      const socket = new Socket({
        target: `${host}/api/${token}`,
        autoOpen: false
      });
      this.uploaderSockets[file.id] = socket;
      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      this.onFileRemove(file.id, () => {
        queuedRequest.abort();
        socket.send('cancel', {});
        this.resetUploaderReferences(file.id);
        resolve(`upload ${file.id} was removed`);
      });
      this.onPause(file.id, isPaused => {
        if (isPaused) {
          // Remove this file from the queue so another file can start in its place.
          queuedRequest.abort();
          socket.send('pause', {});
        } else {
          // Resuming an upload should be queued, else you could pause and then
          // resume a queued upload to make it skip the queue.
          queuedRequest.abort();
          queuedRequest = this.requests.run(() => {
            socket.send('resume', {});
            return () => {};
          });
        }
      });
      this.onPauseAll(file.id, () => {
        queuedRequest.abort();
        socket.send('pause', {});
      });
      this.onCancelAll(file.id, () => {
        queuedRequest.abort();
        socket.send('cancel', {});
        this.resetUploaderReferences(file.id);
        resolve(`upload ${file.id} was canceled`);
      });
      this.onResumeAll(file.id, () => {
        queuedRequest.abort();

        if (file.error) {
          socket.send('pause', {});
        }

        queuedRequest = this.requests.run(() => {
          socket.send('resume', {});
          return () => {};
        });
      });
      this.onRetry(file.id, () => {
        // Only do the retry if the upload is actually in progress;
        // else we could try to send these messages when the upload is still queued.
        // We may need a better check for this since the socket may also be closed
        // for other reasons, like network failures.
        if (socket.isOpen) {
          socket.send('pause', {});
          socket.send('resume', {});
        }
      });
      this.onRetryAll(file.id, () => {
        // See the comment in the onRetry() call
        if (socket.isOpen) {
          socket.send('pause', {});
          socket.send('resume', {});
        }
      });
      socket.on('progress', progressData => emitSocketProgress(this, progressData, file));
      socket.on('error', errData => {
        const {
          message
        } = errData.error;
        const error = Object.assign(new Error(message), {
          cause: errData.error
        }); // If the remote retry optimisation should not be used,
        // close the socket—this will tell companion to clear state and delete the file.

        if (!this.opts.useFastRemoteRetry) {
          this.resetUploaderReferences(file.id); // Remove the serverToken so that a new one will be created for the retry.

          this.uppy.setFileState(file.id, {
            serverToken: null
          });
        } else {
          socket.close();
        }

        this.uppy.emit('upload-error', file, error);
        queuedRequest.done();
        reject(error);
      });
      socket.on('success', data => {
        const uploadResp = {
          uploadURL: data.url
        };
        this.uppy.emit('upload-success', file, uploadResp);
        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        resolve();
      });
      let queuedRequest = this.requests.run(() => {
        socket.open();

        if (file.isPaused) {
          socket.send('pause', {});
        } // Don't do anything here, the caller will take care of cancelling the upload itself
        // using resetUploaderReferences(). This is because resetUploaderReferences() has to be
        // called when this request is still in the queue, and has not been started yet, too. At
        // that point this cancellation function is not going to be called.
        // Also, we need to remove the request from the queue _without_ destroying everything
        // related to this upload to handle pauses.


        return () => {};
      });
    });
  }
  /**
   * Store the uploadUrl on the file options, so that when Golden Retriever
   * restores state, we will continue uploading to the correct URL.
   *
   * @param {UppyFile} file
   * @param {string} uploadURL
   */


  onReceiveUploadUrl(file, uploadURL) {
    const currentFile = this.uppy.getFile(file.id);
    if (!currentFile) return; // Only do the update if we didn't have an upload URL yet.

    if (!currentFile.tus || currentFile.tus.uploadUrl !== uploadURL) {
      this.uppy.log('[Tus] Storing upload url');
      this.uppy.setFileState(currentFile.id, {
        tus: { ...currentFile.tus,
          uploadUrl: uploadURL
        }
      });
    }
  }
  /**
   * @param {string} fileID
   * @param {function(string): void} cb
   */


  onFileRemove(fileID, cb) {
    this.uploaderEvents[fileID].on('file-removed', file => {
      if (fileID === file.id) cb(file.id);
    });
  }
  /**
   * @param {string} fileID
   * @param {function(boolean): void} cb
   */


  onPause(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-pause', (targetFileID, isPaused) => {
      if (fileID === targetFileID) {
        // const isPaused = this.uppy.pauseResume(fileID)
        cb(isPaused);
      }
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onRetry(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-retry', targetFileID => {
      if (fileID === targetFileID) {
        cb();
      }
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onRetryAll(fileID, cb) {
    this.uploaderEvents[fileID].on('retry-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onPauseAll(fileID, cb) {
    this.uploaderEvents[fileID].on('pause-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onCancelAll(fileID, cb) {
    this.uploaderEvents[fileID].on('cancel-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onResumeAll(fileID, cb) {
    this.uploaderEvents[fileID].on('resume-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {(UppyFile | FailedUppyFile)[]} files
   */


  uploadFiles(files) {
    const promises = files.map((file, i) => {
      const current = i + 1;
      const total = files.length;

      if ('error' in file && file.error) {
        return Promise.reject(new Error(file.error));
      }

      if (file.isRemote) {
        // We emit upload-started here, so that it's also emitted for files
        // that have to wait due to the `limit` option.
        // Don't double-emit upload-started for Golden Retriever-restored files that were already started
        if (!file.progress.uploadStarted || !file.isRestored) {
          this.uppy.emit('upload-started', file);
        }

        return this.uploadRemote(file, current, total);
      } // Don't double-emit upload-started for Golden Retriever-restored files that were already started


      if (!file.progress.uploadStarted || !file.isRestored) {
        this.uppy.emit('upload-started', file);
      }

      return this.upload(file, current, total);
    });
    return settle(promises);
  }
  /**
   * @param {string[]} fileIDs
   */


  handleUpload(fileIDs) {
    if (fileIDs.length === 0) {
      this.uppy.log('[Tus] No files to upload');
      return Promise.resolve();
    }

    if (this.opts.limit === 0) {
      this.uppy.log('[Tus] When uploading multiple files at once, consider setting the `limit` option (to `10` for example), to limit the number of concurrent uploads, which helps prevent memory and network issues: https://uppy.io/docs/tus/#limit-0', 'warning');
    }

    this.uppy.log('[Tus] Uploading...');
    const filesToUpload = fileIDs.map(fileID => this.uppy.getFile(fileID));
    return this.uploadFiles(filesToUpload).then(() => null);
  }

  install() {
    this.uppy.setState({
      capabilities: { ...this.uppy.getState().capabilities,
        resumableUploads: true
      }
    });
    this.uppy.addUploader(this.handleUpload);
    this.uppy.on('reset-progress', this.handleResetProgress);
  }

  uninstall() {
    this.uppy.setState({
      capabilities: { ...this.uppy.getState().capabilities,
        resumableUploads: false
      }
    });
    this.uppy.removeUploader(this.handleUpload);
  }

}, _class.VERSION = "2.1.1", _temp);

},{"./../../companion-client":34,"./../../core/lib/BasePlugin":36,"./../../utils/lib/EventTracker":52,"./../../utils/lib/NetworkError":53,"./../../utils/lib/RateLimitedQueue":54,"./../../utils/lib/emitSocketProgress":56,"./../../utils/lib/getSocketHost":63,"./../../utils/lib/hasProperty":67,"./../../utils/lib/isNetworkError":69,"./../../utils/lib/settle":73,"./getFingerprint":50,"tus-js-client":16}],52:[function(require,module,exports){
"use strict";

var _emitter, _events;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

/**
 * Create a wrapper around an event emitter with a `remove` method to remove
 * all events that were added using the wrapped emitter.
 */
module.exports = (_emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter"), _events = /*#__PURE__*/_classPrivateFieldLooseKey("events"), class EventTracker {
  constructor(emitter) {
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _events, {
      writable: true,
      value: []
    });
    _classPrivateFieldLooseBase(this, _emitter)[_emitter] = emitter;
  }

  on(event, fn) {
    _classPrivateFieldLooseBase(this, _events)[_events].push([event, fn]);

    return _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(event, fn);
  }

  remove() {
    for (const [event, fn] of _classPrivateFieldLooseBase(this, _events)[_events].splice(0)) {
      _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(event, fn);
    }
  }

});

},{}],53:[function(require,module,exports){
"use strict";

class NetworkError extends Error {
  constructor(error, xhr = null) {
    super(`This looks like a network error, the endpoint might be blocked by an internet provider or a firewall.`);
    this.cause = error;
    this.isNetworkError = true;
    this.request = xhr;
  }

}

module.exports = NetworkError;

},{}],54:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

function createCancelError() {
  return new Error('Cancelled');
}

var _activeRequests = /*#__PURE__*/_classPrivateFieldLooseKey("activeRequests");

var _queuedHandlers = /*#__PURE__*/_classPrivateFieldLooseKey("queuedHandlers");

var _call = /*#__PURE__*/_classPrivateFieldLooseKey("call");

var _queueNext = /*#__PURE__*/_classPrivateFieldLooseKey("queueNext");

var _next = /*#__PURE__*/_classPrivateFieldLooseKey("next");

var _queue = /*#__PURE__*/_classPrivateFieldLooseKey("queue");

var _dequeue = /*#__PURE__*/_classPrivateFieldLooseKey("dequeue");

class RateLimitedQueue {
  constructor(limit) {
    Object.defineProperty(this, _dequeue, {
      value: _dequeue2
    });
    Object.defineProperty(this, _queue, {
      value: _queue2
    });
    Object.defineProperty(this, _next, {
      value: _next2
    });
    Object.defineProperty(this, _queueNext, {
      value: _queueNext2
    });
    Object.defineProperty(this, _call, {
      value: _call2
    });
    Object.defineProperty(this, _activeRequests, {
      writable: true,
      value: 0
    });
    Object.defineProperty(this, _queuedHandlers, {
      writable: true,
      value: []
    });

    if (typeof limit !== 'number' || limit === 0) {
      this.limit = Infinity;
    } else {
      this.limit = limit;
    }
  }

  run(fn, queueOptions) {
    if (_classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] < this.limit) {
      return _classPrivateFieldLooseBase(this, _call)[_call](fn);
    }

    return _classPrivateFieldLooseBase(this, _queue)[_queue](fn, queueOptions);
  }

  wrapPromiseFunction(fn, queueOptions) {
    return (...args) => {
      let queuedRequest;
      const outerPromise = new Promise((resolve, reject) => {
        queuedRequest = this.run(() => {
          let cancelError;
          let innerPromise;

          try {
            innerPromise = Promise.resolve(fn(...args));
          } catch (err) {
            innerPromise = Promise.reject(err);
          }

          innerPromise.then(result => {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              resolve(result);
            }
          }, err => {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              reject(err);
            }
          });
          return () => {
            cancelError = createCancelError();
          };
        }, queueOptions);
      });

      outerPromise.abort = () => {
        queuedRequest.abort();
      };

      return outerPromise;
    };
  }

}

function _call2(fn) {
  _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] += 1;
  let done = false;
  let cancelActive;

  try {
    cancelActive = fn();
  } catch (err) {
    _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;
    throw err;
  }

  return {
    abort: () => {
      if (done) return;
      done = true;
      _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;
      cancelActive();

      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    },
    done: () => {
      if (done) return;
      done = true;
      _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;

      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    }
  };
}

function _queueNext2() {
  // Do it soon but not immediately, this allows clearing out the entire queue synchronously
  // one by one without continuously _advancing_ it (and starting new tasks before immediately
  // aborting them)
  queueMicrotask(() => _classPrivateFieldLooseBase(this, _next)[_next]());
}

function _next2() {
  if (_classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] >= this.limit) {
    return;
  }

  if (_classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].length === 0) {
    return;
  } // Dispatch the next request, and update the abort/done handlers
  // so that cancelling it does the Right Thing (and doesn't just try
  // to dequeue an already-running request).


  const next = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].shift();

  const handler = _classPrivateFieldLooseBase(this, _call)[_call](next.fn);

  next.abort = handler.abort;
  next.done = handler.done;
}

function _queue2(fn, options = {}) {
  const handler = {
    fn,
    priority: options.priority || 0,
    abort: () => {
      _classPrivateFieldLooseBase(this, _dequeue)[_dequeue](handler);
    },
    done: () => {
      throw new Error('Cannot mark a queued request as done: this indicates a bug');
    }
  };

  const index = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].findIndex(other => {
    return handler.priority > other.priority;
  });

  if (index === -1) {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].push(handler);
  } else {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].splice(index, 0, handler);
  }

  return handler;
}

function _dequeue2(handler) {
  const index = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].indexOf(handler);

  if (index !== -1) {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].splice(index, 1);
  }
}

module.exports = {
  RateLimitedQueue,
  internalRateLimitedQueue: Symbol('__queue')
};

},{}],55:[function(require,module,exports){
"use strict";

var _apply;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const has = require('./hasProperty');

function insertReplacement(source, rx, replacement) {
  const newParts = [];
  source.forEach(chunk => {
    // When the source contains multiple placeholders for interpolation,
    // we should ignore chunks that are not strings, because those
    // can be JSX objects and will be otherwise incorrectly turned into strings.
    // Without this condition we’d get this: [object Object] hello [object Object] my <button>
    if (typeof chunk !== 'string') {
      return newParts.push(chunk);
    }

    return rx[Symbol.split](chunk).forEach((raw, i, list) => {
      if (raw !== '') {
        newParts.push(raw);
      } // Interlace with the `replacement` value


      if (i < list.length - 1) {
        newParts.push(replacement);
      }
    });
  });
  return newParts;
}
/**
 * Takes a string with placeholder variables like `%{smart_count} file selected`
 * and replaces it with values from options `{smart_count: 5}`
 *
 * @license https://github.com/airbnb/polyglot.js/blob/master/LICENSE
 * taken from https://github.com/airbnb/polyglot.js/blob/master/lib/polyglot.js#L299
 *
 * @param {string} phrase that needs interpolation, with placeholders
 * @param {object} options with values that will be used to replace placeholders
 * @returns {any[]} interpolated
 */


function interpolate(phrase, options) {
  const dollarRegex = /\$/g;
  const dollarBillsYall = '$$$$';
  let interpolated = [phrase];
  if (options == null) return interpolated;

  for (const arg of Object.keys(options)) {
    if (arg !== '_') {
      // Ensure replacement value is escaped to prevent special $-prefixed
      // regex replace tokens. the "$$$$" is needed because each "$" needs to
      // be escaped with "$" itself, and we need two in the resulting output.
      let replacement = options[arg];

      if (typeof replacement === 'string') {
        replacement = dollarRegex[Symbol.replace](replacement, dollarBillsYall);
      } // We create a new `RegExp` each time instead of using a more-efficient
      // string replace so that the same argument can be replaced multiple times
      // in the same phrase.


      interpolated = insertReplacement(interpolated, new RegExp(`%\\{${arg}\\}`, 'g'), replacement);
    }
  }

  return interpolated;
}
/**
 * Translates strings with interpolation & pluralization support.
 * Extensible with custom dictionaries and pluralization functions.
 *
 * Borrows heavily from and inspired by Polyglot https://github.com/airbnb/polyglot.js,
 * basically a stripped-down version of it. Differences: pluralization functions are not hardcoded
 * and can be easily added among with dictionaries, nested objects are used for pluralization
 * as opposed to `||||` delimeter
 *
 * Usage example: `translator.translate('files_chosen', {smart_count: 3})`
 */


module.exports = (_apply = /*#__PURE__*/_classPrivateFieldLooseKey("apply"), class Translator {
  /**
   * @param {object|Array<object>} locales - locale or list of locales.
   */
  constructor(locales) {
    Object.defineProperty(this, _apply, {
      value: _apply2
    });
    this.locale = {
      strings: {},

      pluralize(n) {
        if (n === 1) {
          return 0;
        }

        return 1;
      }

    };

    if (Array.isArray(locales)) {
      locales.forEach(_classPrivateFieldLooseBase(this, _apply)[_apply], this);
    } else {
      _classPrivateFieldLooseBase(this, _apply)[_apply](locales);
    }
  }

  /**
   * Public translate method
   *
   * @param {string} key
   * @param {object} options with values that will be used later to replace placeholders in string
   * @returns {string} translated (and interpolated)
   */
  translate(key, options) {
    return this.translateArray(key, options).join('');
  }
  /**
   * Get a translation and return the translated and interpolated parts as an array.
   *
   * @param {string} key
   * @param {object} options with values that will be used to replace placeholders
   * @returns {Array} The translated and interpolated parts, in order.
   */


  translateArray(key, options) {
    if (!has(this.locale.strings, key)) {
      throw new Error(`missing string: ${key}`);
    }

    const string = this.locale.strings[key];
    const hasPluralForms = typeof string === 'object';

    if (hasPluralForms) {
      if (options && typeof options.smart_count !== 'undefined') {
        const plural = this.locale.pluralize(options.smart_count);
        return interpolate(string[plural], options);
      }

      throw new Error('Attempted to use a string with plural forms, but no value was given for %{smart_count}');
    }

    return interpolate(string, options);
  }

});

function _apply2(locale) {
  if (!(locale != null && locale.strings)) {
    return;
  }

  const prevLocale = this.locale;
  this.locale = { ...prevLocale,
    strings: { ...prevLocale.strings,
      ...locale.strings
    }
  };
  this.locale.pluralize = locale.pluralize || prevLocale.pluralize;
}

},{"./hasProperty":67}],56:[function(require,module,exports){
"use strict";

const throttle = require('lodash.throttle');

function emitSocketProgress(uploader, progressData, file) {
  const {
    progress,
    bytesUploaded,
    bytesTotal
  } = progressData;

  if (progress) {
    uploader.uppy.log(`Upload progress: ${progress}`);
    uploader.uppy.emit('upload-progress', file, {
      uploader,
      bytesUploaded,
      bytesTotal
    });
  }
}

module.exports = throttle(emitSocketProgress, 300, {
  leading: true,
  trailing: true
});

},{"lodash.throttle":4}],57:[function(require,module,exports){
"use strict";

const NetworkError = require('./NetworkError');
/**
 * Wrapper around window.fetch that throws a NetworkError when appropriate
 */


module.exports = function fetchWithNetworkError(...options) {
  return fetch(...options).catch(err => {
    if (err.name === 'AbortError') {
      throw err;
    } else {
      throw new NetworkError(err);
    }
  });
};

},{"./NetworkError":53}],58:[function(require,module,exports){
"use strict";

const isDOMElement = require('./isDOMElement');
/**
 * Find a DOM element.
 *
 * @param {Node|string} element
 * @returns {Node|null}
 */


module.exports = function findDOMElement(element, context = document) {
  if (typeof element === 'string') {
    return context.querySelector(element);
  }

  if (isDOMElement(element)) {
    return element;
  }

  return null;
};

},{"./isDOMElement":68}],59:[function(require,module,exports){
"use strict";

function encodeCharacter(character) {
  return character.charCodeAt(0).toString(32);
}

function encodeFilename(name) {
  let suffix = '';
  return name.replace(/[^A-Z0-9]/ig, character => {
    suffix += `-${encodeCharacter(character)}`;
    return '/';
  }) + suffix;
}
/**
 * Takes a file object and turns it into fileID, by converting file.name to lowercase,
 * removing extra characters and adding type, size and lastModified
 *
 * @param {object} file
 * @returns {string} the fileID
 */


module.exports = function generateFileID(file) {
  // It's tempting to do `[items].filter(Boolean).join('-')` here, but that
  // is slower! simple string concatenation is fast
  let id = 'uppy';

  if (typeof file.name === 'string') {
    id += `-${encodeFilename(file.name.toLowerCase())}`;
  }

  if (file.type !== undefined) {
    id += `-${file.type}`;
  }

  if (file.meta && typeof file.meta.relativePath === 'string') {
    id += `-${encodeFilename(file.meta.relativePath.toLowerCase())}`;
  }

  if (file.data.size !== undefined) {
    id += `-${file.data.size}`;
  }

  if (file.data.lastModified !== undefined) {
    id += `-${file.data.lastModified}`;
  }

  return id;
};

},{}],60:[function(require,module,exports){
"use strict";

module.exports = function getBytesRemaining(fileProgress) {
  return fileProgress.bytesTotal - fileProgress.bytesUploaded;
};

},{}],61:[function(require,module,exports){
"use strict";

/**
 * Takes a full filename string and returns an object {name, extension}
 *
 * @param {string} fullFileName
 * @returns {object} {name, extension}
 */
module.exports = function getFileNameAndExtension(fullFileName) {
  const lastDot = fullFileName.lastIndexOf('.'); // these count as no extension: "no-dot", "trailing-dot."

  if (lastDot === -1 || lastDot === fullFileName.length - 1) {
    return {
      name: fullFileName,
      extension: undefined
    };
  }

  return {
    name: fullFileName.slice(0, lastDot),
    extension: fullFileName.slice(lastDot + 1)
  };
};

},{}],62:[function(require,module,exports){
"use strict";

const getFileNameAndExtension = require('./getFileNameAndExtension');

const mimeTypes = require('./mimeTypes');

module.exports = function getFileType(file) {
  var _getFileNameAndExtens;

  if (file.type) return file.type;
  const fileExtension = file.name ? (_getFileNameAndExtens = getFileNameAndExtension(file.name).extension) == null ? void 0 : _getFileNameAndExtens.toLowerCase() : null;

  if (fileExtension && fileExtension in mimeTypes) {
    // else, see if we can map extension to a mime type
    return mimeTypes[fileExtension];
  } // if all fails, fall back to a generic byte stream type


  return 'application/octet-stream';
};

},{"./getFileNameAndExtension":61,"./mimeTypes":70}],63:[function(require,module,exports){
"use strict";

module.exports = function getSocketHost(url) {
  // get the host domain
  const regex = /^(?:https?:\/\/|\/\/)?(?:[^@\n]+@)?(?:www\.)?([^\n]+)/i;
  const host = regex.exec(url)[1];
  const socketProtocol = /^http:\/\//i.test(url) ? 'ws' : 'wss';
  return `${socketProtocol}://${host}`;
};

},{}],64:[function(require,module,exports){
"use strict";

module.exports = function getSpeed(fileProgress) {
  if (!fileProgress.bytesUploaded) return 0;
  const timeElapsed = Date.now() - fileProgress.uploadStarted;
  const uploadSpeed = fileProgress.bytesUploaded / (timeElapsed / 1000);
  return uploadSpeed;
};

},{}],65:[function(require,module,exports){
"use strict";

/**
 * Get the declared text direction for an element.
 *
 * @param {Node} element
 * @returns {string|undefined}
 */
function getTextDirection(element) {
  var _element;

  // There is another way to determine text direction using getComputedStyle(), as done here:
  // https://github.com/pencil-js/text-direction/blob/2a235ce95089b3185acec3b51313cbba921b3811/text-direction.js
  //
  // We do not use that approach because we are interested specifically in the _declared_ text direction.
  // If no text direction is declared, we have to provide our own explicit text direction so our
  // bidirectional CSS style sheets work.
  while (element && !element.dir) {
    // eslint-disable-next-line no-param-reassign
    element = element.parentNode;
  }

  return (_element = element) == null ? void 0 : _element.dir;
}

module.exports = getTextDirection;

},{}],66:[function(require,module,exports){
"use strict";

/**
 * Adds zero to strings shorter than two characters.
 *
 * @param {number} number
 * @returns {string}
 */
function pad(number) {
  return number < 10 ? `0${number}` : number.toString();
}
/**
 * Returns a timestamp in the format of `hours:minutes:seconds`
 */


module.exports = function getTimeStamp() {
  const date = new Date();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
};

},{}],67:[function(require,module,exports){
"use strict";

module.exports = function has(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
};

},{}],68:[function(require,module,exports){
"use strict";

/**
 * Check if an object is a DOM element. Duck-typing based on `nodeType`.
 *
 * @param {*} obj
 */
module.exports = function isDOMElement(obj) {
  return (obj == null ? void 0 : obj.nodeType) === Node.ELEMENT_NODE;
};

},{}],69:[function(require,module,exports){
"use strict";

function isNetworkError(xhr) {
  if (!xhr) {
    return false;
  }

  return xhr.readyState !== 0 && xhr.readyState !== 4 || xhr.status === 0;
}

module.exports = isNetworkError;

},{}],70:[function(require,module,exports){
"use strict";

// ___Why not add the mime-types package?
//    It's 19.7kB gzipped, and we only need mime types for well-known extensions (for file previews).
// ___Where to take new extensions from?
//    https://github.com/jshttp/mime-db/blob/master/db.json
module.exports = {
  md: 'text/markdown',
  markdown: 'text/markdown',
  mp4: 'video/mp4',
  mp3: 'audio/mp3',
  svg: 'image/svg+xml',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  yaml: 'text/yaml',
  yml: 'text/yaml',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  tab: 'text/tab-separated-values',
  avi: 'video/x-msvideo',
  mks: 'video/x-matroska',
  mkv: 'video/x-matroska',
  mov: 'video/quicktime',
  doc: 'application/msword',
  docm: 'application/vnd.ms-word.document.macroenabled.12',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  dot: 'application/msword',
  dotm: 'application/vnd.ms-word.template.macroenabled.12',
  dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  xla: 'application/vnd.ms-excel',
  xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
  xlc: 'application/vnd.ms-excel',
  xlf: 'application/x-xliff+xml',
  xlm: 'application/vnd.ms-excel',
  xls: 'application/vnd.ms-excel',
  xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xlt: 'application/vnd.ms-excel',
  xltm: 'application/vnd.ms-excel.template.macroenabled.12',
  xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  xlw: 'application/vnd.ms-excel',
  txt: 'text/plain',
  text: 'text/plain',
  conf: 'text/plain',
  log: 'text/plain',
  pdf: 'application/pdf',
  zip: 'application/zip',
  '7z': 'application/x-7z-compressed',
  rar: 'application/x-rar-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',
  dmg: 'application/x-apple-diskimage'
};

},{}],71:[function(require,module,exports){
"use strict";

const secondsToTime = require('./secondsToTime');

module.exports = function prettyETA(seconds) {
  const time = secondsToTime(seconds); // Only display hours and minutes if they are greater than 0 but always
  // display minutes if hours is being displayed
  // Display a leading zero if the there is a preceding unit: 1m 05s, but 5s

  const hoursStr = time.hours === 0 ? '' : `${time.hours}h`;
  const minutesStr = time.minutes === 0 ? '' : `${time.hours === 0 ? time.minutes : ` ${time.minutes.toString(10).padStart(2, '0')}`}m`;
  const secondsStr = time.hours !== 0 ? '' : `${time.minutes === 0 ? time.seconds : ` ${time.seconds.toString(10).padStart(2, '0')}`}s`;
  return `${hoursStr}${minutesStr}${secondsStr}`;
};

},{"./secondsToTime":72}],72:[function(require,module,exports){
"use strict";

module.exports = function secondsToTime(rawSeconds) {
  const hours = Math.floor(rawSeconds / 3600) % 24;
  const minutes = Math.floor(rawSeconds / 60) % 60;
  const seconds = Math.floor(rawSeconds % 60);
  return {
    hours,
    minutes,
    seconds
  };
};

},{}],73:[function(require,module,exports){
"use strict";

module.exports = function settle(promises) {
  const resolutions = [];
  const rejections = [];

  function resolved(value) {
    resolutions.push(value);
  }

  function rejected(error) {
    rejections.push(error);
  }

  const wait = Promise.all(promises.map(promise => promise.then(resolved, rejected)));
  return wait.then(() => {
    return {
      successful: resolutions,
      failed: rejections
    };
  });
};

},{}],74:[function(require,module,exports){
"use strict";

/**
 * Converts list into array
 */
module.exports = Array.from;

},{}],75:[function(require,module,exports){
"use strict";

const Uppy = require('./../../../../packages/@uppy/core');

const FileInput = require('./../../../../packages/@uppy/file-input');

const StatusBar = require('./../../../../packages/@uppy/status-bar');

const Tus = require('./../../../../packages/@uppy/tus');

const uppyOne = new Uppy({
  debug: true,
  autoProceed: true
});
uppyOne.use(FileInput, {
  target: '.UppyInput',
  pretty: false
}).use(Tus, {
  endpoint: 'https://tusd.tusdemo.net/files/'
}).use(StatusBar, {
  target: '.UppyInput-Progress',
  hideUploadButton: true,
  hideAfterFinish: false
});

},{"./../../../../packages/@uppy/core":40,"./../../../../packages/@uppy/file-input":43,"./../../../../packages/@uppy/status-bar":48,"./../../../../packages/@uppy/tus":51}]},{},[75])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQHRyYW5zbG9hZGl0L3ByZXR0aWVyLWJ5dGVzL3ByZXR0aWVyQnl0ZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9qcy1iYXNlNjQvYmFzZTY0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC50aHJvdHRsZS9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9taW1lLW1hdGNoL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL25hbWVzcGFjZS1lbWl0dGVyL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL25hbm9pZC9pbmRleC5icm93c2VyLmNqcyIsIi4uL25vZGVfbW9kdWxlcy9uYW5vaWQvdXJsLWFscGhhYmV0L2luZGV4LmNqcyIsIi4uL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5naWZ5L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JlcXVpcmVzLXBvcnQvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Jyb3dzZXIvZmlsZVJlYWRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvYnJvd3Nlci9maW5nZXJwcmludC5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvYnJvd3Nlci9odHRwU3RhY2suanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Jyb3dzZXIvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Jyb3dzZXIvaXNDb3Jkb3ZhLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9icm93c2VyL2lzUmVhY3ROYXRpdmUuanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Jyb3dzZXIvcmVhZEFzQnl0ZUFycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9icm93c2VyL3VyaVRvQmxvYi5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvYnJvd3Nlci91cmxTdG9yYWdlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9lcnJvci5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvbG9nZ2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9ub29wVXJsU3RvcmFnZS5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvdXBsb2FkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS91dWlkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3VybC1wYXJzZS9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy93aWxkY2FyZC9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvc3JjL0F1dGhFcnJvci5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvc3JjL1Byb3ZpZGVyLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvUmVxdWVzdENsaWVudC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvc3JjL1NlYXJjaFByb3ZpZGVyLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvU29ja2V0LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb21wYW5pb24tY2xpZW50L3NyYy90b2tlblN0b3JhZ2UuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9CYXNlUGx1Z2luLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29yZS9zcmMvVUlQbHVnaW4uanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9VcHB5LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29yZS9zcmMvZ2V0RmlsZU5hbWUuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvc3JjL2xvZ2dlcnMuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9zdXBwb3J0c1VwbG9hZFByb2dyZXNzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvZmlsZS1pbnB1dC9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS9zdGF0dXMtYmFyL3NyYy9Db21wb25lbnRzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvc3RhdHVzLWJhci9zcmMvU3RhdHVzQmFyLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvc3RhdHVzLWJhci9zcmMvU3RhdHVzQmFyU3RhdGVzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvc3RhdHVzLWJhci9zcmMvY2FsY3VsYXRlUHJvY2Vzc2luZ1Byb2dyZXNzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvc3RhdHVzLWJhci9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS9zdG9yZS1kZWZhdWx0L3NyYy9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3R1cy9zcmMvZ2V0RmluZ2VycHJpbnQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS90dXMvc3JjL2luZGV4LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL0V2ZW50VHJhY2tlci5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9OZXR3b3JrRXJyb3IuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvUmF0ZUxpbWl0ZWRRdWV1ZS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9UcmFuc2xhdG9yLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2VtaXRTb2NrZXRQcm9ncmVzcy5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9mZXRjaFdpdGhOZXR3b3JrRXJyb3IuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZmluZERPTUVsZW1lbnQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2VuZXJhdGVGaWxlSUQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2V0Qnl0ZXNSZW1haW5pbmcuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24uanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2V0RmlsZVR5cGUuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2V0U29ja2V0SG9zdC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRTcGVlZC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRUZXh0RGlyZWN0aW9uLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2dldFRpbWVTdGFtcC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9oYXNQcm9wZXJ0eS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9pc0RPTUVsZW1lbnQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvaXNOZXR3b3JrRXJyb3IuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvbWltZVR5cGVzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL3ByZXR0eUVUQS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9zZWNvbmRzVG9UaW1lLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL3NldHRsZS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy90b0FycmF5LmpzIiwic3JjL2V4YW1wbGVzL3N0YXR1c2Jhci9hcHAuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN0T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlEQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDek1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5Z0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFFO0FBRkgsS0FBUDtBQUlELEdBTE0sQ0FBUDtBQU1ELENBcEJEOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEtBQUssQ0FBQyxJQUF2Qjs7Ozs7QUNIQSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsWUFBRCxDQUFwQjs7QUFDQSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsa0JBQUQsQ0FBekI7O0FBQ0EsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGtCQUFELENBQXpCOztBQUNBLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFELENBQW5COztBQUVBLE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSixDQUFTO0FBQUMsRUFBQSxLQUFLLEVBQUUsSUFBUjtBQUFjLEVBQUEsV0FBVyxFQUFFO0FBQTNCLENBQVQsQ0FBaEI7QUFDQSxPQUFPLENBQ0osR0FESCxDQUNPLFNBRFAsRUFDa0I7QUFBRSxFQUFBLE1BQU0sRUFBRSxZQUFWO0FBQXdCLEVBQUEsTUFBTSxFQUFFO0FBQWhDLENBRGxCLEVBRUcsR0FGSCxDQUVPLEdBRlAsRUFFWTtBQUFFLEVBQUEsUUFBUSxFQUFFO0FBQVosQ0FGWixFQUdHLEdBSEgsQ0FHTyxTQUhQLEVBR2tCO0FBQ2QsRUFBQSxNQUFNLEVBQUUscUJBRE07QUFFZCxFQUFBLGdCQUFnQixFQUFFLElBRko7QUFHZCxFQUFBLGVBQWUsRUFBRTtBQUhILENBSGxCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9GbGV0L3ByZXR0aWVyLWJ5dGVzL1xuLy8gQ2hhbmdpbmcgMTAwMCBieXRlcyB0byAxMDI0LCBzbyB3ZSBjYW4ga2VlcCB1cHBlcmNhc2UgS0IgdnMga0Jcbi8vIElTQyBMaWNlbnNlIChjKSBEYW4gRmxldHRyZSBodHRwczovL2dpdGh1Yi5jb20vRmxldC9wcmV0dGllci1ieXRlcy9ibG9iL21hc3Rlci9MSUNFTlNFXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHByZXR0aWVyQnl0ZXMgKG51bSkge1xuICBpZiAodHlwZW9mIG51bSAhPT0gJ251bWJlcicgfHwgaXNOYU4obnVtKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgbnVtYmVyLCBnb3QgJyArIHR5cGVvZiBudW0pXG4gIH1cblxuICB2YXIgbmVnID0gbnVtIDwgMFxuICB2YXIgdW5pdHMgPSBbJ0InLCAnS0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInLCAnRUInLCAnWkInLCAnWUInXVxuXG4gIGlmIChuZWcpIHtcbiAgICBudW0gPSAtbnVtXG4gIH1cblxuICBpZiAobnVtIDwgMSkge1xuICAgIHJldHVybiAobmVnID8gJy0nIDogJycpICsgbnVtICsgJyBCJ1xuICB9XG5cbiAgdmFyIGV4cG9uZW50ID0gTWF0aC5taW4oTWF0aC5mbG9vcihNYXRoLmxvZyhudW0pIC8gTWF0aC5sb2coMTAyNCkpLCB1bml0cy5sZW5ndGggLSAxKVxuICBudW0gPSBOdW1iZXIobnVtIC8gTWF0aC5wb3coMTAyNCwgZXhwb25lbnQpKVxuICB2YXIgdW5pdCA9IHVuaXRzW2V4cG9uZW50XVxuXG4gIGlmIChudW0gPj0gMTAgfHwgbnVtICUgMSA9PT0gMCkge1xuICAgIC8vIERvIG5vdCBzaG93IGRlY2ltYWxzIHdoZW4gdGhlIG51bWJlciBpcyB0d28tZGlnaXQsIG9yIGlmIHRoZSBudW1iZXIgaGFzIG5vXG4gICAgLy8gZGVjaW1hbCBjb21wb25lbnQuXG4gICAgcmV0dXJuIChuZWcgPyAnLScgOiAnJykgKyBudW0udG9GaXhlZCgwKSArICcgJyArIHVuaXRcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gKG5lZyA/ICctJyA6ICcnKSArIG51bS50b0ZpeGVkKDEpICsgJyAnICsgdW5pdFxuICB9XG59XG4iLCIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE4IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcygpIHtcblx0XHR2YXIgY2xhc3NlcyA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKGFyZ1R5cGUgPT09ICdzdHJpbmcnIHx8IGFyZ1R5cGUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChhcmcpO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdFx0aWYgKGFyZy5sZW5ndGgpIHtcblx0XHRcdFx0XHR2YXIgaW5uZXIgPSBjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZyk7XG5cdFx0XHRcdFx0aWYgKGlubmVyKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goaW5uZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRpZiAoYXJnLnRvU3RyaW5nID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goa2V5KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGFyZy50b1N0cmluZygpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdGNsYXNzTmFtZXMuZGVmYXVsdCA9IGNsYXNzTmFtZXM7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsIi8qXG4gKiAgYmFzZTY0LmpzXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbiAqICAgIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqXG4gKiAgUmVmZXJlbmNlczpcbiAqICAgIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmFzZTY0XG4gKi9cbjsoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShnbG9iYWwpXG4gICAgICAgIDogdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kXG4gICAgICAgID8gZGVmaW5lKGZhY3RvcnkpIDogZmFjdG9yeShnbG9iYWwpXG59KChcbiAgICB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmXG4gICAgICAgIDogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3dcbiAgICAgICAgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFxuOiB0aGlzXG4pLCBmdW5jdGlvbihnbG9iYWwpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gZXhpc3RpbmcgdmVyc2lvbiBmb3Igbm9Db25mbGljdCgpXG4gICAgZ2xvYmFsID0gZ2xvYmFsIHx8IHt9O1xuICAgIHZhciBfQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICB2YXIgdmVyc2lvbiA9IFwiMi42LjRcIjtcbiAgICAvLyBjb25zdGFudHNcbiAgICB2YXIgYjY0Y2hhcnNcbiAgICAgICAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG4gICAgdmFyIGI2NHRhYiA9IGZ1bmN0aW9uKGJpbikge1xuICAgICAgICB2YXIgdCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGJpbi5sZW5ndGg7IGkgPCBsOyBpKyspIHRbYmluLmNoYXJBdChpKV0gPSBpO1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9KGI2NGNoYXJzKTtcbiAgICB2YXIgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcbiAgICAvLyBlbmNvZGVyIHN0dWZmXG4gICAgdmFyIGNiX3V0b2IgPSBmdW5jdGlvbihjKSB7XG4gICAgICAgIGlmIChjLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHZhciBjYyA9IGMuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgIHJldHVybiBjYyA8IDB4ODAgPyBjXG4gICAgICAgICAgICAgICAgOiBjYyA8IDB4ODAwID8gKGZyb21DaGFyQ29kZSgweGMwIHwgKGNjID4+PiA2KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8IChjYyAmIDB4M2YpKSlcbiAgICAgICAgICAgICAgICA6IChmcm9tQ2hhckNvZGUoMHhlMCB8ICgoY2MgPj4+IDEyKSAmIDB4MGYpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKChjYyA+Pj4gIDYpICYgMHgzZikpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoIGNjICAgICAgICAgJiAweDNmKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNjID0gMHgxMDAwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgwKSAtIDB4RDgwMCkgKiAweDQwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgxKSAtIDB4REMwMCk7XG4gICAgICAgICAgICByZXR1cm4gKGZyb21DaGFyQ29kZSgweGYwIHwgKChjYyA+Pj4gMTgpICYgMHgwNykpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGNjID4+PiAxMikgJiAweDNmKSlcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+ICA2KSAmIDB4M2YpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKCBjYyAgICAgICAgICYgMHgzZikpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIHJlX3V0b2IgPSAvW1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGRl18W15cXHgwMC1cXHg3Rl0vZztcbiAgICB2YXIgdXRvYiA9IGZ1bmN0aW9uKHUpIHtcbiAgICAgICAgcmV0dXJuIHUucmVwbGFjZShyZV91dG9iLCBjYl91dG9iKTtcbiAgICB9O1xuICAgIHZhciBjYl9lbmNvZGUgPSBmdW5jdGlvbihjY2MpIHtcbiAgICAgICAgdmFyIHBhZGxlbiA9IFswLCAyLCAxXVtjY2MubGVuZ3RoICUgM10sXG4gICAgICAgIG9yZCA9IGNjYy5jaGFyQ29kZUF0KDApIDw8IDE2XG4gICAgICAgICAgICB8ICgoY2NjLmxlbmd0aCA+IDEgPyBjY2MuY2hhckNvZGVBdCgxKSA6IDApIDw8IDgpXG4gICAgICAgICAgICB8ICgoY2NjLmxlbmd0aCA+IDIgPyBjY2MuY2hhckNvZGVBdCgyKSA6IDApKSxcbiAgICAgICAgY2hhcnMgPSBbXG4gICAgICAgICAgICBiNjRjaGFycy5jaGFyQXQoIG9yZCA+Pj4gMTgpLFxuICAgICAgICAgICAgYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDEyKSAmIDYzKSxcbiAgICAgICAgICAgIHBhZGxlbiA+PSAyID8gJz0nIDogYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDYpICYgNjMpLFxuICAgICAgICAgICAgcGFkbGVuID49IDEgPyAnPScgOiBiNjRjaGFycy5jaGFyQXQob3JkICYgNjMpXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBjaGFycy5qb2luKCcnKTtcbiAgICB9O1xuICAgIHZhciBidG9hID0gZ2xvYmFsLmJ0b2EgJiYgdHlwZW9mIGdsb2JhbC5idG9hID09ICdmdW5jdGlvbidcbiAgICAgICAgPyBmdW5jdGlvbihiKXsgcmV0dXJuIGdsb2JhbC5idG9hKGIpIH0gOiBmdW5jdGlvbihiKSB7XG4gICAgICAgIGlmIChiLm1hdGNoKC9bXlxceDAwLVxceEZGXS8pKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgICAgICdUaGUgc3RyaW5nIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycy4nXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBiLnJlcGxhY2UoL1tcXHNcXFNdezEsM30vZywgY2JfZW5jb2RlKTtcbiAgICB9O1xuICAgIHZhciBfZW5jb2RlID0gZnVuY3Rpb24odSkge1xuICAgICAgICByZXR1cm4gYnRvYSh1dG9iKFN0cmluZyh1KSkpO1xuICAgIH07XG4gICAgdmFyIG1rVXJpU2FmZSA9IGZ1bmN0aW9uIChiNjQpIHtcbiAgICAgICAgcmV0dXJuIGI2NC5yZXBsYWNlKC9bK1xcL10vZywgZnVuY3Rpb24obTApIHtcbiAgICAgICAgICAgIHJldHVybiBtMCA9PSAnKycgPyAnLScgOiAnXyc7XG4gICAgICAgIH0pLnJlcGxhY2UoLz0vZywgJycpO1xuICAgIH07XG4gICAgdmFyIGVuY29kZSA9IGZ1bmN0aW9uKHUsIHVyaXNhZmUpIHtcbiAgICAgICAgcmV0dXJuIHVyaXNhZmUgPyBta1VyaVNhZmUoX2VuY29kZSh1KSkgOiBfZW5jb2RlKHUpO1xuICAgIH07XG4gICAgdmFyIGVuY29kZVVSSSA9IGZ1bmN0aW9uKHUpIHsgcmV0dXJuIGVuY29kZSh1LCB0cnVlKSB9O1xuICAgIHZhciBmcm9tVWludDhBcnJheTtcbiAgICBpZiAoZ2xvYmFsLlVpbnQ4QXJyYXkpIGZyb21VaW50OEFycmF5ID0gZnVuY3Rpb24oYSwgdXJpc2FmZSkge1xuICAgICAgICAvLyByZXR1cm4gYnRvYShmcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgYSkpO1xuICAgICAgICB2YXIgYjY0ID0gJyc7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYS5sZW5ndGg7IGkgPCBsOyBpICs9IDMpIHtcbiAgICAgICAgICAgIHZhciBhMCA9IGFbaV0sIGExID0gYVtpKzFdLCBhMiA9IGFbaSsyXTtcbiAgICAgICAgICAgIHZhciBvcmQgPSBhMCA8PCAxNiB8IGExIDw8IDggfCBhMjtcbiAgICAgICAgICAgIGI2NCArPSAgICBiNjRjaGFycy5jaGFyQXQoIG9yZCA+Pj4gMTgpXG4gICAgICAgICAgICAgICAgKyAgICAgYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDEyKSAmIDYzKVxuICAgICAgICAgICAgICAgICsgKCB0eXBlb2YgYTEgIT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgPyBiNjRjaGFycy5jaGFyQXQoKG9yZCA+Pj4gIDYpICYgNjMpIDogJz0nKVxuICAgICAgICAgICAgICAgICsgKCB0eXBlb2YgYTIgIT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgPyBiNjRjaGFycy5jaGFyQXQoIG9yZCAgICAgICAgICYgNjMpIDogJz0nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXJpc2FmZSA/IG1rVXJpU2FmZShiNjQpIDogYjY0O1xuICAgIH07XG4gICAgLy8gZGVjb2RlciBzdHVmZlxuICAgIHZhciByZV9idG91ID0gL1tcXHhDMC1cXHhERl1bXFx4ODAtXFx4QkZdfFtcXHhFMC1cXHhFRl1bXFx4ODAtXFx4QkZdezJ9fFtcXHhGMC1cXHhGN11bXFx4ODAtXFx4QkZdezN9L2c7XG4gICAgdmFyIGNiX2J0b3UgPSBmdW5jdGlvbihjY2NjKSB7XG4gICAgICAgIHN3aXRjaChjY2NjLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICB2YXIgY3AgPSAoKDB4MDcgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDE4KVxuICAgICAgICAgICAgICAgIHwgICAgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCAxMilcbiAgICAgICAgICAgICAgICB8ICAgICgoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSkgPDwgIDYpXG4gICAgICAgICAgICAgICAgfCAgICAgKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMykpLFxuICAgICAgICAgICAgb2Zmc2V0ID0gY3AgLSAweDEwMDAwO1xuICAgICAgICAgICAgcmV0dXJuIChmcm9tQ2hhckNvZGUoKG9mZnNldCAgPj4+IDEwKSArIDB4RDgwMClcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoKG9mZnNldCAmIDB4M0ZGKSArIDB4REMwMCkpO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gZnJvbUNoYXJDb2RlKFxuICAgICAgICAgICAgICAgICgoMHgwZiAmIGNjY2MuY2hhckNvZGVBdCgwKSkgPDwgMTIpXG4gICAgICAgICAgICAgICAgICAgIHwgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCA2KVxuICAgICAgICAgICAgICAgICAgICB8ICAoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gIGZyb21DaGFyQ29kZShcbiAgICAgICAgICAgICAgICAoKDB4MWYgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDYpXG4gICAgICAgICAgICAgICAgICAgIHwgICgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIGJ0b3UgPSBmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBiLnJlcGxhY2UocmVfYnRvdSwgY2JfYnRvdSk7XG4gICAgfTtcbiAgICB2YXIgY2JfZGVjb2RlID0gZnVuY3Rpb24oY2NjYykge1xuICAgICAgICB2YXIgbGVuID0gY2NjYy5sZW5ndGgsXG4gICAgICAgIHBhZGxlbiA9IGxlbiAlIDQsXG4gICAgICAgIG4gPSAobGVuID4gMCA/IGI2NHRhYltjY2NjLmNoYXJBdCgwKV0gPDwgMTggOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMSA/IGI2NHRhYltjY2NjLmNoYXJBdCgxKV0gPDwgMTIgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMiA/IGI2NHRhYltjY2NjLmNoYXJBdCgyKV0gPDwgIDYgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMyA/IGI2NHRhYltjY2NjLmNoYXJBdCgzKV0gICAgICAgOiAwKSxcbiAgICAgICAgY2hhcnMgPSBbXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoIG4gPj4+IDE2KSxcbiAgICAgICAgICAgIGZyb21DaGFyQ29kZSgobiA+Pj4gIDgpICYgMHhmZiksXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoIG4gICAgICAgICAmIDB4ZmYpXG4gICAgICAgIF07XG4gICAgICAgIGNoYXJzLmxlbmd0aCAtPSBbMCwgMCwgMiwgMV1bcGFkbGVuXTtcbiAgICAgICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xuICAgIH07XG4gICAgdmFyIF9hdG9iID0gZ2xvYmFsLmF0b2IgJiYgdHlwZW9mIGdsb2JhbC5hdG9iID09ICdmdW5jdGlvbidcbiAgICAgICAgPyBmdW5jdGlvbihhKXsgcmV0dXJuIGdsb2JhbC5hdG9iKGEpIH0gOiBmdW5jdGlvbihhKXtcbiAgICAgICAgcmV0dXJuIGEucmVwbGFjZSgvXFxTezEsNH0vZywgY2JfZGVjb2RlKTtcbiAgICB9O1xuICAgIHZhciBhdG9iID0gZnVuY3Rpb24oYSkge1xuICAgICAgICByZXR1cm4gX2F0b2IoU3RyaW5nKGEpLnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXS9nLCAnJykpO1xuICAgIH07XG4gICAgdmFyIF9kZWNvZGUgPSBmdW5jdGlvbihhKSB7IHJldHVybiBidG91KF9hdG9iKGEpKSB9O1xuICAgIHZhciBfZnJvbVVSSSA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyhhKS5yZXBsYWNlKC9bLV9dL2csIGZ1bmN0aW9uKG0wKSB7XG4gICAgICAgICAgICByZXR1cm4gbTAgPT0gJy0nID8gJysnIDogJy8nXG4gICAgICAgIH0pLnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXS9nLCAnJyk7XG4gICAgfTtcbiAgICB2YXIgZGVjb2RlID0gZnVuY3Rpb24oYSl7XG4gICAgICAgIHJldHVybiBfZGVjb2RlKF9mcm9tVVJJKGEpKTtcbiAgICB9O1xuICAgIHZhciB0b1VpbnQ4QXJyYXk7XG4gICAgaWYgKGdsb2JhbC5VaW50OEFycmF5KSB0b1VpbnQ4QXJyYXkgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LmZyb20oYXRvYihfZnJvbVVSSShhKSksIGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgICAgIHJldHVybiBjLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIG5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIEJhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgICAgIGdsb2JhbC5CYXNlNjQgPSBfQmFzZTY0O1xuICAgICAgICByZXR1cm4gQmFzZTY0O1xuICAgIH07XG4gICAgLy8gZXhwb3J0IEJhc2U2NFxuICAgIGdsb2JhbC5CYXNlNjQgPSB7XG4gICAgICAgIFZFUlNJT046IHZlcnNpb24sXG4gICAgICAgIGF0b2I6IGF0b2IsXG4gICAgICAgIGJ0b2E6IGJ0b2EsXG4gICAgICAgIGZyb21CYXNlNjQ6IGRlY29kZSxcbiAgICAgICAgdG9CYXNlNjQ6IGVuY29kZSxcbiAgICAgICAgdXRvYjogdXRvYixcbiAgICAgICAgZW5jb2RlOiBlbmNvZGUsXG4gICAgICAgIGVuY29kZVVSSTogZW5jb2RlVVJJLFxuICAgICAgICBidG91OiBidG91LFxuICAgICAgICBkZWNvZGU6IGRlY29kZSxcbiAgICAgICAgbm9Db25mbGljdDogbm9Db25mbGljdCxcbiAgICAgICAgZnJvbVVpbnQ4QXJyYXk6IGZyb21VaW50OEFycmF5LFxuICAgICAgICB0b1VpbnQ4QXJyYXk6IHRvVWludDhBcnJheVxuICAgIH07XG4gICAgLy8gaWYgRVM1IGlzIGF2YWlsYWJsZSwgbWFrZSBCYXNlNjQuZXh0ZW5kU3RyaW5nKCkgYXZhaWxhYmxlXG4gICAgaWYgKHR5cGVvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIG5vRW51bSA9IGZ1bmN0aW9uKHYpe1xuICAgICAgICAgICAgcmV0dXJuIHt2YWx1ZTp2LGVudW1lcmFibGU6ZmFsc2Usd3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZX07XG4gICAgICAgIH07XG4gICAgICAgIGdsb2JhbC5CYXNlNjQuZXh0ZW5kU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgICAgICAgICAgICAgIFN0cmluZy5wcm90b3R5cGUsICdmcm9tQmFzZTY0Jywgbm9FbnVtKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlY29kZSh0aGlzKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLCAndG9CYXNlNjQnLCBub0VudW0oZnVuY3Rpb24gKHVyaXNhZmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZSh0aGlzLCB1cmlzYWZlKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLCAndG9CYXNlNjRVUkknLCBub0VudW0oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlKHRoaXMsIHRydWUpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvL1xuICAgIC8vIGV4cG9ydCBCYXNlNjQgdG8gdGhlIG5hbWVzcGFjZVxuICAgIC8vXG4gICAgaWYgKGdsb2JhbFsnTWV0ZW9yJ10pIHsgLy8gTWV0ZW9yLmpzXG4gICAgICAgIEJhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgfVxuICAgIC8vIG1vZHVsZS5leHBvcnRzIGFuZCBBTUQgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZS5cbiAgICAvLyBtb2R1bGUuZXhwb3J0cyBoYXMgcHJlY2VkZW5jZS5cbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMuQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpeyByZXR1cm4gZ2xvYmFsLkJhc2U2NCB9KTtcbiAgICB9XG4gICAgLy8gdGhhdCdzIGl0IVxuICAgIHJldHVybiB7QmFzZTY0OiBnbG9iYWwuQmFzZTY0fVxufSkpO1xuIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRocm90dGxlZCBmdW5jdGlvbiB0aGF0IG9ubHkgaW52b2tlcyBgZnVuY2AgYXQgbW9zdCBvbmNlIHBlclxuICogZXZlcnkgYHdhaXRgIG1pbGxpc2Vjb25kcy4gVGhlIHRocm90dGxlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGBcbiAqIG1ldGhvZCB0byBjYW5jZWwgZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG9cbiAqIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYFxuICogc2hvdWxkIGJlIGludm9rZWQgb24gdGhlIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YFxuICogdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZVxuICogdGhyb3R0bGVkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gcmV0dXJuIHRoZVxuICogcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLnRocm90dGxlYCBhbmQgYF8uZGVib3VuY2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gdGhyb3R0bGUuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gdGhyb3R0bGUgaW52b2NhdGlvbnMgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgdGhyb3R0bGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBleGNlc3NpdmVseSB1cGRhdGluZyB0aGUgcG9zaXRpb24gd2hpbGUgc2Nyb2xsaW5nLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Njcm9sbCcsIF8udGhyb3R0bGUodXBkYXRlUG9zaXRpb24sIDEwMCkpO1xuICpcbiAqIC8vIEludm9rZSBgcmVuZXdUb2tlbmAgd2hlbiB0aGUgY2xpY2sgZXZlbnQgaXMgZmlyZWQsIGJ1dCBub3QgbW9yZSB0aGFuIG9uY2UgZXZlcnkgNSBtaW51dGVzLlxuICogdmFyIHRocm90dGxlZCA9IF8udGhyb3R0bGUocmVuZXdUb2tlbiwgMzAwMDAwLCB7ICd0cmFpbGluZyc6IGZhbHNlIH0pO1xuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIHRocm90dGxlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyB0aHJvdHRsZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIHRocm90dGxlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsZWFkaW5nID0gdHJ1ZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gJ2xlYWRpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMubGVhZGluZyA6IGxlYWRpbmc7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuICByZXR1cm4gZGVib3VuY2UoZnVuYywgd2FpdCwge1xuICAgICdsZWFkaW5nJzogbGVhZGluZyxcbiAgICAnbWF4V2FpdCc6IHdhaXQsXG4gICAgJ3RyYWlsaW5nJzogdHJhaWxpbmdcbiAgfSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRocm90dGxlO1xuIiwidmFyIHdpbGRjYXJkID0gcmVxdWlyZSgnd2lsZGNhcmQnKTtcbnZhciByZU1pbWVQYXJ0U3BsaXQgPSAvW1xcL1xcK1xcLl0vO1xuXG4vKipcbiAgIyBtaW1lLW1hdGNoXG5cbiAgQSBzaW1wbGUgZnVuY3Rpb24gdG8gY2hlY2tlciB3aGV0aGVyIGEgdGFyZ2V0IG1pbWUgdHlwZSBtYXRjaGVzIGEgbWltZS10eXBlXG4gIHBhdHRlcm4gKGUuZy4gaW1hZ2UvanBlZyBtYXRjaGVzIGltYWdlL2pwZWcgT1IgaW1hZ2UvKikuXG5cbiAgIyMgRXhhbXBsZSBVc2FnZVxuXG4gIDw8PCBleGFtcGxlLmpzXG5cbioqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHBhdHRlcm4pIHtcbiAgZnVuY3Rpb24gdGVzdChwYXR0ZXJuKSB7XG4gICAgdmFyIHJlc3VsdCA9IHdpbGRjYXJkKHBhdHRlcm4sIHRhcmdldCwgcmVNaW1lUGFydFNwbGl0KTtcblxuICAgIC8vIGVuc3VyZSB0aGF0IHdlIGhhdmUgYSB2YWxpZCBtaW1lIHR5cGUgKHNob3VsZCBoYXZlIHR3byBwYXJ0cylcbiAgICByZXR1cm4gcmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPj0gMjtcbiAgfVxuXG4gIHJldHVybiBwYXR0ZXJuID8gdGVzdChwYXR0ZXJuLnNwbGl0KCc7JylbMF0pIDogdGVzdDtcbn07XG4iLCIvKipcbiogQ3JlYXRlIGFuIGV2ZW50IGVtaXR0ZXIgd2l0aCBuYW1lc3BhY2VzXG4qIEBuYW1lIGNyZWF0ZU5hbWVzcGFjZUVtaXR0ZXJcbiogQGV4YW1wbGVcbiogdmFyIGVtaXR0ZXIgPSByZXF1aXJlKCcuL2luZGV4JykoKVxuKlxuKiBlbWl0dGVyLm9uKCcqJywgZnVuY3Rpb24gKCkge1xuKiAgIGNvbnNvbGUubG9nKCdhbGwgZXZlbnRzIGVtaXR0ZWQnLCB0aGlzLmV2ZW50KVxuKiB9KVxuKlxuKiBlbWl0dGVyLm9uKCdleGFtcGxlJywgZnVuY3Rpb24gKCkge1xuKiAgIGNvbnNvbGUubG9nKCdleGFtcGxlIGV2ZW50IGVtaXR0ZWQnKVxuKiB9KVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlTmFtZXNwYWNlRW1pdHRlciAoKSB7XG4gIHZhciBlbWl0dGVyID0ge31cbiAgdmFyIF9mbnMgPSBlbWl0dGVyLl9mbnMgPSB7fVxuXG4gIC8qKlxuICAqIEVtaXQgYW4gZXZlbnQuIE9wdGlvbmFsbHkgbmFtZXNwYWNlIHRoZSBldmVudC4gSGFuZGxlcnMgYXJlIGZpcmVkIGluIHRoZSBvcmRlciBpbiB3aGljaCB0aGV5IHdlcmUgYWRkZWQgd2l0aCBleGFjdCBtYXRjaGVzIHRha2luZyBwcmVjZWRlbmNlLiBTZXBhcmF0ZSB0aGUgbmFtZXNwYWNlIGFuZCBldmVudCB3aXRoIGEgYDpgXG4gICogQG5hbWUgZW1pdFxuICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCDigJMgdGhlIG5hbWUgb2YgdGhlIGV2ZW50LCB3aXRoIG9wdGlvbmFsIG5hbWVzcGFjZVxuICAqIEBwYXJhbSB7Li4uKn0gZGF0YSDigJMgdXAgdG8gNiBhcmd1bWVudHMgdGhhdCBhcmUgcGFzc2VkIHRvIHRoZSBldmVudCBsaXN0ZW5lclxuICAqIEBleGFtcGxlXG4gICogZW1pdHRlci5lbWl0KCdleGFtcGxlJylcbiAgKiBlbWl0dGVyLmVtaXQoJ2RlbW86dGVzdCcpXG4gICogZW1pdHRlci5lbWl0KCdkYXRhJywgeyBleGFtcGxlOiB0cnVlfSwgJ2Egc3RyaW5nJywgMSlcbiAgKi9cbiAgZW1pdHRlci5lbWl0ID0gZnVuY3Rpb24gZW1pdCAoZXZlbnQsIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQsIGFyZzUsIGFyZzYpIHtcbiAgICB2YXIgdG9FbWl0ID0gZ2V0TGlzdGVuZXJzKGV2ZW50KVxuXG4gICAgaWYgKHRvRW1pdC5sZW5ndGgpIHtcbiAgICAgIGVtaXRBbGwoZXZlbnQsIHRvRW1pdCwgW2FyZzEsIGFyZzIsIGFyZzMsIGFyZzQsIGFyZzUsIGFyZzZdKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIENyZWF0ZSBlbiBldmVudCBsaXN0ZW5lci5cbiAgKiBAbmFtZSBvblxuICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICogQGV4YW1wbGVcbiAgKiBlbWl0dGVyLm9uKCdleGFtcGxlJywgZnVuY3Rpb24gKCkge30pXG4gICogZW1pdHRlci5vbignZGVtbycsIGZ1bmN0aW9uICgpIHt9KVxuICAqL1xuICBlbWl0dGVyLm9uID0gZnVuY3Rpb24gb24gKGV2ZW50LCBmbikge1xuICAgIGlmICghX2Zuc1tldmVudF0pIHtcbiAgICAgIF9mbnNbZXZlbnRdID0gW11cbiAgICB9XG5cbiAgICBfZm5zW2V2ZW50XS5wdXNoKGZuKVxuICB9XG5cbiAgLyoqXG4gICogQ3JlYXRlIGVuIGV2ZW50IGxpc3RlbmVyIHRoYXQgZmlyZXMgb25jZS5cbiAgKiBAbmFtZSBvbmNlXG4gICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgKiBAZXhhbXBsZVxuICAqIGVtaXR0ZXIub25jZSgnZXhhbXBsZScsIGZ1bmN0aW9uICgpIHt9KVxuICAqIGVtaXR0ZXIub25jZSgnZGVtbycsIGZ1bmN0aW9uICgpIHt9KVxuICAqL1xuICBlbWl0dGVyLm9uY2UgPSBmdW5jdGlvbiBvbmNlIChldmVudCwgZm4pIHtcbiAgICBmdW5jdGlvbiBvbmUgKCkge1xuICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgZW1pdHRlci5vZmYoZXZlbnQsIG9uZSlcbiAgICB9XG4gICAgdGhpcy5vbihldmVudCwgb25lKVxuICB9XG5cbiAgLyoqXG4gICogU3RvcCBsaXN0ZW5pbmcgdG8gYW4gZXZlbnQuIFN0b3AgYWxsIGxpc3RlbmVycyBvbiBhbiBldmVudCBieSBvbmx5IHBhc3NpbmcgdGhlIGV2ZW50IG5hbWUuIFN0b3AgYSBzaW5nbGUgbGlzdGVuZXIgYnkgcGFzc2luZyB0aGF0IGV2ZW50IGhhbmRsZXIgYXMgYSBjYWxsYmFjay5cbiAgKiBZb3UgbXVzdCBiZSBleHBsaWNpdCBhYm91dCB3aGF0IHdpbGwgYmUgdW5zdWJzY3JpYmVkOiBgZW1pdHRlci5vZmYoJ2RlbW8nKWAgd2lsbCB1bnN1YnNjcmliZSBhbiBgZW1pdHRlci5vbignZGVtbycpYCBsaXN0ZW5lcixcbiAgKiBgZW1pdHRlci5vZmYoJ2RlbW86ZXhhbXBsZScpYCB3aWxsIHVuc3Vic2NyaWJlIGFuIGBlbWl0dGVyLm9uKCdkZW1vOmV4YW1wbGUnKWAgbGlzdGVuZXJcbiAgKiBAbmFtZSBvZmZcbiAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dIOKAkyB0aGUgc3BlY2lmaWMgaGFuZGxlclxuICAqIEBleGFtcGxlXG4gICogZW1pdHRlci5vZmYoJ2V4YW1wbGUnKVxuICAqIGVtaXR0ZXIub2ZmKCdkZW1vJywgZnVuY3Rpb24gKCkge30pXG4gICovXG4gIGVtaXR0ZXIub2ZmID0gZnVuY3Rpb24gb2ZmIChldmVudCwgZm4pIHtcbiAgICB2YXIga2VlcCA9IFtdXG5cbiAgICBpZiAoZXZlbnQgJiYgZm4pIHtcbiAgICAgIHZhciBmbnMgPSB0aGlzLl9mbnNbZXZlbnRdXG4gICAgICB2YXIgaSA9IDBcbiAgICAgIHZhciBsID0gZm5zID8gZm5zLmxlbmd0aCA6IDBcblxuICAgICAgZm9yIChpOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChmbnNbaV0gIT09IGZuKSB7XG4gICAgICAgICAga2VlcC5wdXNoKGZuc1tpXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGtlZXAubGVuZ3RoID8gdGhpcy5fZm5zW2V2ZW50XSA9IGtlZXAgOiBkZWxldGUgdGhpcy5fZm5zW2V2ZW50XVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGlzdGVuZXJzIChlKSB7XG4gICAgdmFyIG91dCA9IF9mbnNbZV0gPyBfZm5zW2VdIDogW11cbiAgICB2YXIgaWR4ID0gZS5pbmRleE9mKCc6JylcbiAgICB2YXIgYXJncyA9IChpZHggPT09IC0xKSA/IFtlXSA6IFtlLnN1YnN0cmluZygwLCBpZHgpLCBlLnN1YnN0cmluZyhpZHggKyAxKV1cblxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoX2ZucylcbiAgICB2YXIgaSA9IDBcbiAgICB2YXIgbCA9IGtleXMubGVuZ3RoXG5cbiAgICBmb3IgKGk7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldXG4gICAgICBpZiAoa2V5ID09PSAnKicpIHtcbiAgICAgICAgb3V0ID0gb3V0LmNvbmNhdChfZm5zW2tleV0pXG4gICAgICB9XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMiAmJiBhcmdzWzBdID09PSBrZXkpIHtcbiAgICAgICAgb3V0ID0gb3V0LmNvbmNhdChfZm5zW2tleV0pXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dFxuICB9XG5cbiAgZnVuY3Rpb24gZW1pdEFsbCAoZSwgZm5zLCBhcmdzKSB7XG4gICAgdmFyIGkgPSAwXG4gICAgdmFyIGwgPSBmbnMubGVuZ3RoXG5cbiAgICBmb3IgKGk7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICghZm5zW2ldKSBicmVha1xuICAgICAgZm5zW2ldLmV2ZW50ID0gZVxuICAgICAgZm5zW2ldLmFwcGx5KGZuc1tpXSwgYXJncylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZW1pdHRlclxufVxuIiwibGV0IHsgdXJsQWxwaGFiZXQgfSA9IHJlcXVpcmUoJy4vdXJsLWFscGhhYmV0L2luZGV4LmNqcycpXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBpZiAoXG4gICAgdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJyAmJlxuICAgIHR5cGVvZiBjcnlwdG8gPT09ICd1bmRlZmluZWQnXG4gICkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdSZWFjdCBOYXRpdmUgZG9lcyBub3QgaGF2ZSBhIGJ1aWx0LWluIHNlY3VyZSByYW5kb20gZ2VuZXJhdG9yLiAnICtcbiAgICAgICAgJ0lmIHlvdSBkb27igJl0IG5lZWQgdW5wcmVkaWN0YWJsZSBJRHMgdXNlIGBuYW5vaWQvbm9uLXNlY3VyZWAuICcgK1xuICAgICAgICAnRm9yIHNlY3VyZSBJRHMsIGltcG9ydCBgcmVhY3QtbmF0aXZlLWdldC1yYW5kb20tdmFsdWVzYCAnICtcbiAgICAgICAgJ2JlZm9yZSBOYW5vIElELidcbiAgICApXG4gIH1cbiAgaWYgKHR5cGVvZiBtc0NyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNyeXB0byA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnSW1wb3J0IGZpbGUgd2l0aCBgaWYgKCF3aW5kb3cuY3J5cHRvKSB3aW5kb3cuY3J5cHRvID0gd2luZG93Lm1zQ3J5cHRvYCcgK1xuICAgICAgICAnIGJlZm9yZSBpbXBvcnRpbmcgTmFubyBJRCB0byBmaXggSUUgMTEgc3VwcG9ydCdcbiAgICApXG4gIH1cbiAgaWYgKHR5cGVvZiBjcnlwdG8gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBoYXZlIHNlY3VyZSByYW5kb20gZ2VuZXJhdG9yLiAnICtcbiAgICAgICAgJ0lmIHlvdSBkb27igJl0IG5lZWQgdW5wcmVkaWN0YWJsZSBJRHMsIHlvdSBjYW4gdXNlIG5hbm9pZC9ub24tc2VjdXJlLidcbiAgICApXG4gIH1cbn1cbmxldCByYW5kb20gPSBieXRlcyA9PiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KGJ5dGVzKSlcbmxldCBjdXN0b21SYW5kb20gPSAoYWxwaGFiZXQsIHNpemUsIGdldFJhbmRvbSkgPT4ge1xuICBsZXQgbWFzayA9ICgyIDw8IChNYXRoLmxvZyhhbHBoYWJldC5sZW5ndGggLSAxKSAvIE1hdGguTE4yKSkgLSAxXG4gIGxldCBzdGVwID0gLX4oKDEuNiAqIG1hc2sgKiBzaXplKSAvIGFscGhhYmV0Lmxlbmd0aClcbiAgcmV0dXJuICgpID0+IHtcbiAgICBsZXQgaWQgPSAnJ1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgYnl0ZXMgPSBnZXRSYW5kb20oc3RlcClcbiAgICAgIGxldCBqID0gc3RlcFxuICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdIHx8ICcnXG4gICAgICAgIGlmIChpZC5sZW5ndGggPT09IHNpemUpIHJldHVybiBpZFxuICAgICAgfVxuICAgIH1cbiAgfVxufVxubGV0IGN1c3RvbUFscGhhYmV0ID0gKGFscGhhYmV0LCBzaXplKSA9PiBjdXN0b21SYW5kb20oYWxwaGFiZXQsIHNpemUsIHJhbmRvbSlcbmxldCBuYW5vaWQgPSAoc2l6ZSA9IDIxKSA9PiB7XG4gIGxldCBpZCA9ICcnXG4gIGxldCBieXRlcyA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoc2l6ZSkpXG4gIHdoaWxlIChzaXplLS0pIHtcbiAgICBsZXQgYnl0ZSA9IGJ5dGVzW3NpemVdICYgNjNcbiAgICBpZiAoYnl0ZSA8IDM2KSB7XG4gICAgICBpZCArPSBieXRlLnRvU3RyaW5nKDM2KVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA8IDYyKSB7XG4gICAgICBpZCArPSAoYnl0ZSAtIDI2KS50b1N0cmluZygzNikudG9VcHBlckNhc2UoKVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA8IDYzKSB7XG4gICAgICBpZCArPSAnXydcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgKz0gJy0nXG4gICAgfVxuICB9XG4gIHJldHVybiBpZFxufVxubW9kdWxlLmV4cG9ydHMgPSB7IG5hbm9pZCwgY3VzdG9tQWxwaGFiZXQsIGN1c3RvbVJhbmRvbSwgdXJsQWxwaGFiZXQsIHJhbmRvbSB9XG4iLCJsZXQgdXJsQWxwaGFiZXQgPVxuICAndXNlYW5kb20tMjZUMTk4MzQwUFg3NXB4SkFDS1ZFUllNSU5EQlVTSFdPTEZfR1FaYmZnaGprbHF2d3l6cmljdCdcbm1vZHVsZS5leHBvcnRzID0geyB1cmxBbHBoYWJldCB9XG4iLCJ2YXIgbixsLHUsdCxpLHIsbyxmLGU9e30sYz1bXSxzPS9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8Z3JpZHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkfGl0ZXJhL2k7ZnVuY3Rpb24gYShuLGwpe2Zvcih2YXIgdSBpbiBsKW5bdV09bFt1XTtyZXR1cm4gbn1mdW5jdGlvbiB2KG4pe3ZhciBsPW4ucGFyZW50Tm9kZTtsJiZsLnJlbW92ZUNoaWxkKG4pfWZ1bmN0aW9uIGgobCx1LHQpe3ZhciBpLHIsbyxmPXt9O2ZvcihvIGluIHUpXCJrZXlcIj09bz9pPXVbb106XCJyZWZcIj09bz9yPXVbb106ZltvXT11W29dO2lmKGFyZ3VtZW50cy5sZW5ndGg+MiYmKGYuY2hpbGRyZW49YXJndW1lbnRzLmxlbmd0aD4zP24uY2FsbChhcmd1bWVudHMsMik6dCksXCJmdW5jdGlvblwiPT10eXBlb2YgbCYmbnVsbCE9bC5kZWZhdWx0UHJvcHMpZm9yKG8gaW4gbC5kZWZhdWx0UHJvcHMpdm9pZCAwPT09ZltvXSYmKGZbb109bC5kZWZhdWx0UHJvcHNbb10pO3JldHVybiBwKGwsZixpLHIsbnVsbCl9ZnVuY3Rpb24gcChuLHQsaSxyLG8pe3ZhciBmPXt0eXBlOm4scHJvcHM6dCxrZXk6aSxyZWY6cixfX2s6bnVsbCxfXzpudWxsLF9fYjowLF9fZTpudWxsLF9fZDp2b2lkIDAsX19jOm51bGwsX19oOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpudWxsPT1vPysrdTpvfTtyZXR1cm4gbnVsbD09byYmbnVsbCE9bC52bm9kZSYmbC52bm9kZShmKSxmfWZ1bmN0aW9uIHkobil7cmV0dXJuIG4uY2hpbGRyZW59ZnVuY3Rpb24gZChuLGwpe3RoaXMucHJvcHM9bix0aGlzLmNvbnRleHQ9bH1mdW5jdGlvbiBfKG4sbCl7aWYobnVsbD09bClyZXR1cm4gbi5fXz9fKG4uX18sbi5fXy5fX2suaW5kZXhPZihuKSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP18obik6bnVsbH1mdW5jdGlvbiBrKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gayhuKX19ZnVuY3Rpb24geChuKXsoIW4uX19kJiYobi5fX2Q9ITApJiZpLnB1c2gobikmJiFiLl9fcisrfHxvIT09bC5kZWJvdW5jZVJlbmRlcmluZykmJigobz1sLmRlYm91bmNlUmVuZGVyaW5nKXx8cikoYil9ZnVuY3Rpb24gYigpe2Zvcih2YXIgbjtiLl9fcj1pLmxlbmd0aDspbj1pLnNvcnQoZnVuY3Rpb24obixsKXtyZXR1cm4gbi5fX3YuX19iLWwuX192Ll9fYn0pLGk9W10sbi5zb21lKGZ1bmN0aW9uKG4pe3ZhciBsLHUsdCxpLHIsbztuLl9fZCYmKHI9KGk9KGw9bikuX192KS5fX2UsKG89bC5fX1ApJiYodT1bXSwodD1hKHt9LGkpKS5fX3Y9aS5fX3YrMSxJKG8saSx0LGwuX19uLHZvaWQgMCE9PW8ub3duZXJTVkdFbGVtZW50LG51bGwhPWkuX19oP1tyXTpudWxsLHUsbnVsbD09cj9fKGkpOnIsaS5fX2gpLFQodSxpKSxpLl9fZSE9ciYmayhpKSkpfSl9ZnVuY3Rpb24gbShuLGwsdSx0LGkscixvLGYscyxhKXt2YXIgdixoLGQsayx4LGIsbSxBPXQmJnQuX19rfHxjLFA9QS5sZW5ndGg7Zm9yKHUuX19rPVtdLHY9MDt2PGwubGVuZ3RoO3YrKylpZihudWxsIT0oaz11Ll9fa1t2XT1udWxsPT0oaz1sW3ZdKXx8XCJib29sZWFuXCI9PXR5cGVvZiBrP251bGw6XCJzdHJpbmdcIj09dHlwZW9mIGt8fFwibnVtYmVyXCI9PXR5cGVvZiBrfHxcImJpZ2ludFwiPT10eXBlb2Ygaz9wKG51bGwsayxudWxsLG51bGwsayk6QXJyYXkuaXNBcnJheShrKT9wKHkse2NoaWxkcmVuOmt9LG51bGwsbnVsbCxudWxsKTprLl9fYj4wP3Aoay50eXBlLGsucHJvcHMsay5rZXksbnVsbCxrLl9fdik6aykpe2lmKGsuX189dSxrLl9fYj11Ll9fYisxLG51bGw9PT0oZD1BW3ZdKXx8ZCYmay5rZXk9PWQua2V5JiZrLnR5cGU9PT1kLnR5cGUpQVt2XT12b2lkIDA7ZWxzZSBmb3IoaD0wO2g8UDtoKyspe2lmKChkPUFbaF0pJiZrLmtleT09ZC5rZXkmJmsudHlwZT09PWQudHlwZSl7QVtoXT12b2lkIDA7YnJlYWt9ZD1udWxsfUkobixrLGQ9ZHx8ZSxpLHIsbyxmLHMsYSkseD1rLl9fZSwoaD1rLnJlZikmJmQucmVmIT1oJiYobXx8KG09W10pLGQucmVmJiZtLnB1c2goZC5yZWYsbnVsbCxrKSxtLnB1c2goaCxrLl9fY3x8eCxrKSksbnVsbCE9eD8obnVsbD09YiYmKGI9eCksXCJmdW5jdGlvblwiPT10eXBlb2Ygay50eXBlJiZrLl9faz09PWQuX19rP2suX19kPXM9ZyhrLHMsbik6cz13KG4sayxkLEEseCxzKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB1LnR5cGUmJih1Ll9fZD1zKSk6cyYmZC5fX2U9PXMmJnMucGFyZW50Tm9kZSE9biYmKHM9XyhkKSl9Zm9yKHUuX19lPWIsdj1QO3YtLTspbnVsbCE9QVt2XSYmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHUudHlwZSYmbnVsbCE9QVt2XS5fX2UmJkFbdl0uX19lPT11Ll9fZCYmKHUuX19kPV8odCx2KzEpKSxMKEFbdl0sQVt2XSkpO2lmKG0pZm9yKHY9MDt2PG0ubGVuZ3RoO3YrKyl6KG1bdl0sbVsrK3ZdLG1bKyt2XSl9ZnVuY3Rpb24gZyhuLGwsdSl7Zm9yKHZhciB0LGk9bi5fX2sscj0wO2kmJnI8aS5sZW5ndGg7cisrKSh0PWlbcl0pJiYodC5fXz1uLGw9XCJmdW5jdGlvblwiPT10eXBlb2YgdC50eXBlP2codCxsLHUpOncodSx0LHQsaSx0Ll9fZSxsKSk7cmV0dXJuIGx9ZnVuY3Rpb24gdyhuLGwsdSx0LGkscil7dmFyIG8sZixlO2lmKHZvaWQgMCE9PWwuX19kKW89bC5fX2QsbC5fX2Q9dm9pZCAwO2Vsc2UgaWYobnVsbD09dXx8aSE9cnx8bnVsbD09aS5wYXJlbnROb2RlKW46aWYobnVsbD09cnx8ci5wYXJlbnROb2RlIT09biluLmFwcGVuZENoaWxkKGkpLG89bnVsbDtlbHNle2ZvcihmPXIsZT0wOyhmPWYubmV4dFNpYmxpbmcpJiZlPHQubGVuZ3RoO2UrPTIpaWYoZj09aSlicmVhayBuO24uaW5zZXJ0QmVmb3JlKGksciksbz1yfXJldHVybiB2b2lkIDAhPT1vP286aS5uZXh0U2libGluZ31mdW5jdGlvbiBBKG4sbCx1LHQsaSl7dmFyIHI7Zm9yKHIgaW4gdSlcImNoaWxkcmVuXCI9PT1yfHxcImtleVwiPT09cnx8ciBpbiBsfHxDKG4scixudWxsLHVbcl0sdCk7Zm9yKHIgaW4gbClpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBsW3JdfHxcImNoaWxkcmVuXCI9PT1yfHxcImtleVwiPT09cnx8XCJ2YWx1ZVwiPT09cnx8XCJjaGVja2VkXCI9PT1yfHx1W3JdPT09bFtyXXx8QyhuLHIsbFtyXSx1W3JdLHQpfWZ1bmN0aW9uIFAobixsLHUpe1wiLVwiPT09bFswXT9uLnNldFByb3BlcnR5KGwsdSk6bltsXT1udWxsPT11P1wiXCI6XCJudW1iZXJcIiE9dHlwZW9mIHV8fHMudGVzdChsKT91OnUrXCJweFwifWZ1bmN0aW9uIEMobixsLHUsdCxpKXt2YXIgcjtuOmlmKFwic3R5bGVcIj09PWwpaWYoXCJzdHJpbmdcIj09dHlwZW9mIHUpbi5zdHlsZS5jc3NUZXh0PXU7ZWxzZXtpZihcInN0cmluZ1wiPT10eXBlb2YgdCYmKG4uc3R5bGUuY3NzVGV4dD10PVwiXCIpLHQpZm9yKGwgaW4gdCl1JiZsIGluIHV8fFAobi5zdHlsZSxsLFwiXCIpO2lmKHUpZm9yKGwgaW4gdSl0JiZ1W2xdPT09dFtsXXx8UChuLnN0eWxlLGwsdVtsXSl9ZWxzZSBpZihcIm9cIj09PWxbMF0mJlwiblwiPT09bFsxXSlyPWwhPT0obD1sLnJlcGxhY2UoL0NhcHR1cmUkLyxcIlwiKSksbD1sLnRvTG93ZXJDYXNlKClpbiBuP2wudG9Mb3dlckNhc2UoKS5zbGljZSgyKTpsLnNsaWNlKDIpLG4ubHx8KG4ubD17fSksbi5sW2wrcl09dSx1P3R8fG4uYWRkRXZlbnRMaXN0ZW5lcihsLHI/SDokLHIpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLHI/SDokLHIpO2Vsc2UgaWYoXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiIT09bCl7aWYoaSlsPWwucmVwbGFjZSgveGxpbmtbSDpoXS8sXCJoXCIpLnJlcGxhY2UoL3NOYW1lJC8sXCJzXCIpO2Vsc2UgaWYoXCJocmVmXCIhPT1sJiZcImxpc3RcIiE9PWwmJlwiZm9ybVwiIT09bCYmXCJ0YWJJbmRleFwiIT09bCYmXCJkb3dubG9hZFwiIT09bCYmbCBpbiBuKXRyeXtuW2xdPW51bGw9PXU/XCJcIjp1O2JyZWFrIG59Y2F0Y2gobil7fVwiZnVuY3Rpb25cIj09dHlwZW9mIHV8fChudWxsIT11JiYoITEhPT11fHxcImFcIj09PWxbMF0mJlwiclwiPT09bFsxXSk/bi5zZXRBdHRyaWJ1dGUobCx1KTpuLnJlbW92ZUF0dHJpYnV0ZShsKSl9fWZ1bmN0aW9uICQobil7dGhpcy5sW24udHlwZSshMV0obC5ldmVudD9sLmV2ZW50KG4pOm4pfWZ1bmN0aW9uIEgobil7dGhpcy5sW24udHlwZSshMF0obC5ldmVudD9sLmV2ZW50KG4pOm4pfWZ1bmN0aW9uIEkobix1LHQsaSxyLG8sZixlLGMpe3ZhciBzLHYsaCxwLF8sayx4LGIsZyx3LEEsUD11LnR5cGU7aWYodm9pZCAwIT09dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDtudWxsIT10Ll9faCYmKGM9dC5fX2gsZT11Ll9fZT10Ll9fZSx1Ll9faD1udWxsLG89W2VdKSwocz1sLl9fYikmJnModSk7dHJ5e246aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUCl7aWYoYj11LnByb3BzLGc9KHM9UC5jb250ZXh0VHlwZSkmJmlbcy5fX2NdLHc9cz9nP2cucHJvcHMudmFsdWU6cy5fXzppLHQuX19jP3g9KHY9dS5fX2M9dC5fX2MpLl9fPXYuX19FOihcInByb3RvdHlwZVwiaW4gUCYmUC5wcm90b3R5cGUucmVuZGVyP3UuX19jPXY9bmV3IFAoYix3KToodS5fX2M9dj1uZXcgZChiLHcpLHYuY29uc3RydWN0b3I9UCx2LnJlbmRlcj1NKSxnJiZnLnN1Yih2KSx2LnByb3BzPWIsdi5zdGF0ZXx8KHYuc3RhdGU9e30pLHYuY29udGV4dD13LHYuX19uPWksaD12Ll9fZD0hMCx2Ll9faD1bXSksbnVsbD09di5fX3MmJih2Ll9fcz12LnN0YXRlKSxudWxsIT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmKHYuX19zPT12LnN0YXRlJiYodi5fX3M9YSh7fSx2Ll9fcykpLGEodi5fX3MsUC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoYix2Ll9fcykpKSxwPXYucHJvcHMsXz12LnN0YXRlLGgpbnVsbD09UC5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPXYuY29tcG9uZW50V2lsbE1vdW50JiZ2LmNvbXBvbmVudFdpbGxNb3VudCgpLG51bGwhPXYuY29tcG9uZW50RGlkTW91bnQmJnYuX19oLnB1c2godi5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihudWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmYiE9PXAmJm51bGwhPXYuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmdi5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGIsdyksIXYuX19lJiZudWxsIT12LnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT12LnNob3VsZENvbXBvbmVudFVwZGF0ZShiLHYuX19zLHcpfHx1Ll9fdj09PXQuX192KXt2LnByb3BzPWIsdi5zdGF0ZT12Ll9fcyx1Ll9fdiE9PXQuX192JiYodi5fX2Q9ITEpLHYuX192PXUsdS5fX2U9dC5fX2UsdS5fX2s9dC5fX2ssdS5fX2suZm9yRWFjaChmdW5jdGlvbihuKXtuJiYobi5fXz11KX0pLHYuX19oLmxlbmd0aCYmZi5wdXNoKHYpO2JyZWFrIG59bnVsbCE9di5jb21wb25lbnRXaWxsVXBkYXRlJiZ2LmNvbXBvbmVudFdpbGxVcGRhdGUoYix2Ll9fcyx3KSxudWxsIT12LmNvbXBvbmVudERpZFVwZGF0ZSYmdi5fX2gucHVzaChmdW5jdGlvbigpe3YuY29tcG9uZW50RGlkVXBkYXRlKHAsXyxrKX0pfXYuY29udGV4dD13LHYucHJvcHM9Yix2LnN0YXRlPXYuX19zLChzPWwuX19yKSYmcyh1KSx2Ll9fZD0hMSx2Ll9fdj11LHYuX19QPW4scz12LnJlbmRlcih2LnByb3BzLHYuc3RhdGUsdi5jb250ZXh0KSx2LnN0YXRlPXYuX19zLG51bGwhPXYuZ2V0Q2hpbGRDb250ZXh0JiYoaT1hKGEoe30saSksdi5nZXRDaGlsZENvbnRleHQoKSkpLGh8fG51bGw9PXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGV8fChrPXYuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUocCxfKSksQT1udWxsIT1zJiZzLnR5cGU9PT15JiZudWxsPT1zLmtleT9zLnByb3BzLmNoaWxkcmVuOnMsbShuLEFycmF5LmlzQXJyYXkoQSk/QTpbQV0sdSx0LGkscixvLGYsZSxjKSx2LmJhc2U9dS5fX2UsdS5fX2g9bnVsbCx2Ll9faC5sZW5ndGgmJmYucHVzaCh2KSx4JiYodi5fX0U9di5fXz1udWxsKSx2Ll9fZT0hMX1lbHNlIG51bGw9PW8mJnUuX192PT09dC5fX3Y/KHUuX19rPXQuX19rLHUuX19lPXQuX19lKTp1Ll9fZT1qKHQuX19lLHUsdCxpLHIsbyxmLGMpOyhzPWwuZGlmZmVkKSYmcyh1KX1jYXRjaChuKXt1Ll9fdj1udWxsLChjfHxudWxsIT1vKSYmKHUuX19lPWUsdS5fX2g9ISFjLG9bby5pbmRleE9mKGUpXT1udWxsKSxsLl9fZShuLHUsdCl9fWZ1bmN0aW9uIFQobix1KXtsLl9fYyYmbC5fX2ModSxuKSxuLnNvbWUoZnVuY3Rpb24odSl7dHJ5e249dS5fX2gsdS5fX2g9W10sbi5zb21lKGZ1bmN0aW9uKG4pe24uY2FsbCh1KX0pfWNhdGNoKG4pe2wuX19lKG4sdS5fX3YpfX0pfWZ1bmN0aW9uIGoobCx1LHQsaSxyLG8sZixjKXt2YXIgcyxhLGgscD10LnByb3BzLHk9dS5wcm9wcyxkPXUudHlwZSxrPTA7aWYoXCJzdmdcIj09PWQmJihyPSEwKSxudWxsIT1vKWZvcig7azxvLmxlbmd0aDtrKyspaWYoKHM9b1trXSkmJihzPT09bHx8KGQ/cy5sb2NhbE5hbWU9PWQ6Mz09cy5ub2RlVHlwZSkpKXtsPXMsb1trXT1udWxsO2JyZWFrfWlmKG51bGw9PWwpe2lmKG51bGw9PT1kKXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh5KTtsPXI/ZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixkKTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KGQseS5pcyYmeSksbz1udWxsLGM9ITF9aWYobnVsbD09PWQpcD09PXl8fGMmJmwuZGF0YT09PXl8fChsLmRhdGE9eSk7ZWxzZXtpZihvPW8mJm4uY2FsbChsLmNoaWxkTm9kZXMpLGE9KHA9dC5wcm9wc3x8ZSkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsaD15LmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLCFjKXtpZihudWxsIT1vKWZvcihwPXt9LGs9MDtrPGwuYXR0cmlidXRlcy5sZW5ndGg7aysrKXBbbC5hdHRyaWJ1dGVzW2tdLm5hbWVdPWwuYXR0cmlidXRlc1trXS52YWx1ZTsoaHx8YSkmJihoJiYoYSYmaC5fX2h0bWw9PWEuX19odG1sfHxoLl9faHRtbD09PWwuaW5uZXJIVE1MKXx8KGwuaW5uZXJIVE1MPWgmJmguX19odG1sfHxcIlwiKSl9aWYoQShsLHkscCxyLGMpLGgpdS5fX2s9W107ZWxzZSBpZihrPXUucHJvcHMuY2hpbGRyZW4sbShsLEFycmF5LmlzQXJyYXkoayk/azpba10sdSx0LGksciYmXCJmb3JlaWduT2JqZWN0XCIhPT1kLG8sZixvP29bMF06dC5fX2smJl8odCwwKSxjKSxudWxsIT1vKWZvcihrPW8ubGVuZ3RoO2stLTspbnVsbCE9b1trXSYmdihvW2tdKTtjfHwoXCJ2YWx1ZVwiaW4geSYmdm9pZCAwIT09KGs9eS52YWx1ZSkmJihrIT09bC52YWx1ZXx8XCJwcm9ncmVzc1wiPT09ZCYmIWspJiZDKGwsXCJ2YWx1ZVwiLGsscC52YWx1ZSwhMSksXCJjaGVja2VkXCJpbiB5JiZ2b2lkIDAhPT0oaz15LmNoZWNrZWQpJiZrIT09bC5jaGVja2VkJiZDKGwsXCJjaGVja2VkXCIsayxwLmNoZWNrZWQsITEpKX1yZXR1cm4gbH1mdW5jdGlvbiB6KG4sdSx0KXt0cnl7XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9uKHUpOm4uY3VycmVudD11fWNhdGNoKG4pe2wuX19lKG4sdCl9fWZ1bmN0aW9uIEwobix1LHQpe3ZhciBpLHI7aWYobC51bm1vdW50JiZsLnVubW91bnQobiksKGk9bi5yZWYpJiYoaS5jdXJyZW50JiZpLmN1cnJlbnQhPT1uLl9fZXx8eihpLG51bGwsdSkpLG51bGwhPShpPW4uX19jKSl7aWYoaS5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7aS5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKG4pe2wuX19lKG4sdSl9aS5iYXNlPWkuX19QPW51bGx9aWYoaT1uLl9faylmb3Iocj0wO3I8aS5sZW5ndGg7cisrKWlbcl0mJkwoaVtyXSx1LFwiZnVuY3Rpb25cIiE9dHlwZW9mIG4udHlwZSk7dHx8bnVsbD09bi5fX2V8fHYobi5fX2UpLG4uX19lPW4uX19kPXZvaWQgMH1mdW5jdGlvbiBNKG4sbCx1KXtyZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihuLHUpfWZ1bmN0aW9uIE4odSx0LGkpe3ZhciByLG8sZjtsLl9fJiZsLl9fKHUsdCksbz0ocj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBpKT9udWxsOmkmJmkuX19rfHx0Ll9fayxmPVtdLEkodCx1PSghciYmaXx8dCkuX19rPWgoeSxudWxsLFt1XSksb3x8ZSxlLHZvaWQgMCE9PXQub3duZXJTVkdFbGVtZW50LCFyJiZpP1tpXTpvP251bGw6dC5maXJzdENoaWxkP24uY2FsbCh0LmNoaWxkTm9kZXMpOm51bGwsZiwhciYmaT9pOm8/by5fX2U6dC5maXJzdENoaWxkLHIpLFQoZix1KX1uPWMuc2xpY2UsbD17X19lOmZ1bmN0aW9uKG4sbCl7Zm9yKHZhciB1LHQsaTtsPWwuX187KWlmKCh1PWwuX19jKSYmIXUuX18pdHJ5e2lmKCh0PXUuY29uc3RydWN0b3IpJiZudWxsIT10LmdldERlcml2ZWRTdGF0ZUZyb21FcnJvciYmKHUuc2V0U3RhdGUodC5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IobikpLGk9dS5fX2QpLG51bGwhPXUuY29tcG9uZW50RGlkQ2F0Y2gmJih1LmNvbXBvbmVudERpZENhdGNoKG4pLGk9dS5fX2QpLGkpcmV0dXJuIHUuX19FPXV9Y2F0Y2gobCl7bj1sfXRocm93IG59fSx1PTAsdD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbCE9biYmdm9pZCAwPT09bi5jb25zdHJ1Y3Rvcn0sZC5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24obixsKXt2YXIgdTt1PW51bGwhPXRoaXMuX19zJiZ0aGlzLl9fcyE9PXRoaXMuc3RhdGU/dGhpcy5fX3M6dGhpcy5fX3M9YSh7fSx0aGlzLnN0YXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYobj1uKGEoe30sdSksdGhpcy5wcm9wcykpLG4mJmEodSxuKSxudWxsIT1uJiZ0aGlzLl9fdiYmKGwmJnRoaXMuX19oLnB1c2gobCkseCh0aGlzKSl9LGQucHJvdG90eXBlLmZvcmNlVXBkYXRlPWZ1bmN0aW9uKG4pe3RoaXMuX192JiYodGhpcy5fX2U9ITAsbiYmdGhpcy5fX2gucHVzaChuKSx4KHRoaXMpKX0sZC5wcm90b3R5cGUucmVuZGVyPXksaT1bXSxyPVwiZnVuY3Rpb25cIj09dHlwZW9mIFByb21pc2U/UHJvbWlzZS5wcm90b3R5cGUudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKTpzZXRUaW1lb3V0LGIuX19yPTAsZj0wLGV4cG9ydHMucmVuZGVyPU4sZXhwb3J0cy5oeWRyYXRlPWZ1bmN0aW9uIG4obCx1KXtOKGwsdSxuKX0sZXhwb3J0cy5jcmVhdGVFbGVtZW50PWgsZXhwb3J0cy5oPWgsZXhwb3J0cy5GcmFnbWVudD15LGV4cG9ydHMuY3JlYXRlUmVmPWZ1bmN0aW9uKCl7cmV0dXJue2N1cnJlbnQ6bnVsbH19LGV4cG9ydHMuaXNWYWxpZEVsZW1lbnQ9dCxleHBvcnRzLkNvbXBvbmVudD1kLGV4cG9ydHMuY2xvbmVFbGVtZW50PWZ1bmN0aW9uKGwsdSx0KXt2YXIgaSxyLG8sZj1hKHt9LGwucHJvcHMpO2ZvcihvIGluIHUpXCJrZXlcIj09bz9pPXVbb106XCJyZWZcIj09bz9yPXVbb106ZltvXT11W29dO3JldHVybiBhcmd1bWVudHMubGVuZ3RoPjImJihmLmNoaWxkcmVuPWFyZ3VtZW50cy5sZW5ndGg+Mz9uLmNhbGwoYXJndW1lbnRzLDIpOnQpLHAobC50eXBlLGYsaXx8bC5rZXkscnx8bC5yZWYsbnVsbCl9LGV4cG9ydHMuY3JlYXRlQ29udGV4dD1mdW5jdGlvbihuLGwpe3ZhciB1PXtfX2M6bD1cIl9fY0NcIitmKyssX186bixDb25zdW1lcjpmdW5jdGlvbihuLGwpe3JldHVybiBuLmNoaWxkcmVuKGwpfSxQcm92aWRlcjpmdW5jdGlvbihuKXt2YXIgdSx0O3JldHVybiB0aGlzLmdldENoaWxkQ29udGV4dHx8KHU9W10sKHQ9e30pW2xdPXRoaXMsdGhpcy5nZXRDaGlsZENvbnRleHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdGhpcy5zaG91bGRDb21wb25lbnRVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5wcm9wcy52YWx1ZSE9PW4udmFsdWUmJnUuc29tZSh4KX0sdGhpcy5zdWI9ZnVuY3Rpb24obil7dS5wdXNoKG4pO3ZhciBsPW4uY29tcG9uZW50V2lsbFVubW91bnQ7bi5jb21wb25lbnRXaWxsVW5tb3VudD1mdW5jdGlvbigpe3Uuc3BsaWNlKHUuaW5kZXhPZihuKSwxKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn19O3JldHVybiB1LlByb3ZpZGVyLl9fPXUuQ29uc3VtZXIuY29udGV4dFR5cGU9dX0sZXhwb3J0cy50b0NoaWxkQXJyYXk9ZnVuY3Rpb24gbihsLHUpe3JldHVybiB1PXV8fFtdLG51bGw9PWx8fFwiYm9vbGVhblwiPT10eXBlb2YgbHx8KEFycmF5LmlzQXJyYXkobCk/bC5zb21lKGZ1bmN0aW9uKGwpe24obCx1KX0pOnUucHVzaChsKSksdX0sZXhwb3J0cy5vcHRpb25zPWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QuanMubWFwXG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuICAsIHVuZGVmO1xuXG4vKipcbiAqIERlY29kZSBhIFVSSSBlbmNvZGVkIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFVSSSBlbmNvZGVkIHN0cmluZy5cbiAqIEByZXR1cm5zIHtTdHJpbmd8TnVsbH0gVGhlIGRlY29kZWQgc3RyaW5nLlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGRlY29kZShpbnB1dCkge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoaW5wdXQucmVwbGFjZSgvXFwrL2csICcgJykpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBBdHRlbXB0cyB0byBlbmNvZGUgYSBnaXZlbiBpbnB1dC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIHN0cmluZyB0aGF0IG5lZWRzIHRvIGJlIGVuY29kZWQuXG4gKiBAcmV0dXJucyB7U3RyaW5nfE51bGx9IFRoZSBlbmNvZGVkIHN0cmluZy5cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBlbmNvZGUoaW5wdXQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGlucHV0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogU2ltcGxlIHF1ZXJ5IHN0cmluZyBwYXJzZXIuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHF1ZXJ5IFRoZSBxdWVyeSBzdHJpbmcgdGhhdCBuZWVkcyB0byBiZSBwYXJzZWQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gcXVlcnlzdHJpbmcocXVlcnkpIHtcbiAgdmFyIHBhcnNlciA9IC8oW149PyMmXSspPT8oW14mXSopL2dcbiAgICAsIHJlc3VsdCA9IHt9XG4gICAgLCBwYXJ0O1xuXG4gIHdoaWxlIChwYXJ0ID0gcGFyc2VyLmV4ZWMocXVlcnkpKSB7XG4gICAgdmFyIGtleSA9IGRlY29kZShwYXJ0WzFdKVxuICAgICAgLCB2YWx1ZSA9IGRlY29kZShwYXJ0WzJdKTtcblxuICAgIC8vXG4gICAgLy8gUHJldmVudCBvdmVycmlkaW5nIG9mIGV4aXN0aW5nIHByb3BlcnRpZXMuIFRoaXMgZW5zdXJlcyB0aGF0IGJ1aWxkLWluXG4gICAgLy8gbWV0aG9kcyBsaWtlIGB0b1N0cmluZ2Agb3IgX19wcm90b19fIGFyZSBub3Qgb3ZlcnJpZGVuIGJ5IG1hbGljaW91c1xuICAgIC8vIHF1ZXJ5c3RyaW5ncy5cbiAgICAvL1xuICAgIC8vIEluIHRoZSBjYXNlIGlmIGZhaWxlZCBkZWNvZGluZywgd2Ugd2FudCB0byBvbWl0IHRoZSBrZXkvdmFsdWUgcGFpcnNcbiAgICAvLyBmcm9tIHRoZSByZXN1bHQuXG4gICAgLy9cbiAgICBpZiAoa2V5ID09PSBudWxsIHx8IHZhbHVlID09PSBudWxsIHx8IGtleSBpbiByZXN1bHQpIGNvbnRpbnVlO1xuICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRyYW5zZm9ybSBhIHF1ZXJ5IHN0cmluZyB0byBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBPYmplY3QgdGhhdCBzaG91bGQgYmUgdHJhbnNmb3JtZWQuXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJlZml4IE9wdGlvbmFsIHByZWZpeC5cbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBxdWVyeXN0cmluZ2lmeShvYmosIHByZWZpeCkge1xuICBwcmVmaXggPSBwcmVmaXggfHwgJyc7XG5cbiAgdmFyIHBhaXJzID0gW11cbiAgICAsIHZhbHVlXG4gICAgLCBrZXk7XG5cbiAgLy9cbiAgLy8gT3B0aW9uYWxseSBwcmVmaXggd2l0aCBhICc/JyBpZiBuZWVkZWRcbiAgLy9cbiAgaWYgKCdzdHJpbmcnICE9PSB0eXBlb2YgcHJlZml4KSBwcmVmaXggPSAnPyc7XG5cbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhcy5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgdmFsdWUgPSBvYmpba2V5XTtcblxuICAgICAgLy9cbiAgICAgIC8vIEVkZ2UgY2FzZXMgd2hlcmUgd2UgYWN0dWFsbHkgd2FudCB0byBlbmNvZGUgdGhlIHZhbHVlIHRvIGFuIGVtcHR5XG4gICAgICAvLyBzdHJpbmcgaW5zdGVhZCBvZiB0aGUgc3RyaW5naWZpZWQgdmFsdWUuXG4gICAgICAvL1xuICAgICAgaWYgKCF2YWx1ZSAmJiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmIHx8IGlzTmFOKHZhbHVlKSkpIHtcbiAgICAgICAgdmFsdWUgPSAnJztcbiAgICAgIH1cblxuICAgICAga2V5ID0gZW5jb2RlKGtleSk7XG4gICAgICB2YWx1ZSA9IGVuY29kZSh2YWx1ZSk7XG5cbiAgICAgIC8vXG4gICAgICAvLyBJZiB3ZSBmYWlsZWQgdG8gZW5jb2RlIHRoZSBzdHJpbmdzLCB3ZSBzaG91bGQgYmFpbCBvdXQgYXMgd2UgZG9uJ3RcbiAgICAgIC8vIHdhbnQgdG8gYWRkIGludmFsaWQgc3RyaW5ncyB0byB0aGUgcXVlcnkuXG4gICAgICAvL1xuICAgICAgaWYgKGtleSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICBwYWlycy5wdXNoKGtleSArJz0nKyB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhaXJzLmxlbmd0aCA/IHByZWZpeCArIHBhaXJzLmpvaW4oJyYnKSA6ICcnO1xufVxuXG4vL1xuLy8gRXhwb3NlIHRoZSBtb2R1bGUuXG4vL1xuZXhwb3J0cy5zdHJpbmdpZnkgPSBxdWVyeXN0cmluZ2lmeTtcbmV4cG9ydHMucGFyc2UgPSBxdWVyeXN0cmluZztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDaGVjayBpZiB3ZSdyZSByZXF1aXJlZCB0byBhZGQgYSBwb3J0IG51bWJlci5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jZGVmYXVsdC1wb3J0XG4gKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IHBvcnQgUG9ydCBudW1iZXIgd2UgbmVlZCB0byBjaGVja1xuICogQHBhcmFtIHtTdHJpbmd9IHByb3RvY29sIFByb3RvY29sIHdlIG5lZWQgdG8gY2hlY2sgYWdhaW5zdC5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBJcyBpdCBhIGRlZmF1bHQgcG9ydCBmb3IgdGhlIGdpdmVuIHByb3RvY29sXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZXF1aXJlZChwb3J0LCBwcm90b2NvbCkge1xuICBwcm90b2NvbCA9IHByb3RvY29sLnNwbGl0KCc6JylbMF07XG4gIHBvcnQgPSArcG9ydDtcblxuICBpZiAoIXBvcnQpIHJldHVybiBmYWxzZTtcblxuICBzd2l0Y2ggKHByb3RvY29sKSB7XG4gICAgY2FzZSAnaHR0cCc6XG4gICAgY2FzZSAnd3MnOlxuICAgIHJldHVybiBwb3J0ICE9PSA4MDtcblxuICAgIGNhc2UgJ2h0dHBzJzpcbiAgICBjYXNlICd3c3MnOlxuICAgIHJldHVybiBwb3J0ICE9PSA0NDM7XG5cbiAgICBjYXNlICdmdHAnOlxuICAgIHJldHVybiBwb3J0ICE9PSAyMTtcblxuICAgIGNhc2UgJ2dvcGhlcic6XG4gICAgcmV0dXJuIHBvcnQgIT09IDcwO1xuXG4gICAgY2FzZSAnZmlsZSc6XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHBvcnQgIT09IDA7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XG5cbnZhciBfaXNSZWFjdE5hdGl2ZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vaXNSZWFjdE5hdGl2ZVwiKSk7XG5cbnZhciBfdXJpVG9CbG9iID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi91cmlUb0Jsb2JcIikpO1xuXG52YXIgX2lzQ29yZG92YSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vaXNDb3Jkb3ZhXCIpKTtcblxudmFyIF9yZWFkQXNCeXRlQXJyYXkgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL3JlYWRBc0J5dGVBcnJheVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cblxudmFyIEZpbGVTb3VyY2UgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAvLyBNYWtlIHRoaXMuc2l6ZSBhIG1ldGhvZFxuICBmdW5jdGlvbiBGaWxlU291cmNlKGZpbGUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZVNvdXJjZSk7XG5cbiAgICB0aGlzLl9maWxlID0gZmlsZTtcbiAgICB0aGlzLnNpemUgPSBmaWxlLnNpemU7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRmlsZVNvdXJjZSwgW3tcbiAgICBrZXk6IFwic2xpY2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2xpY2Uoc3RhcnQsIGVuZCkge1xuICAgICAgLy8gSW4gQXBhY2hlIENvcmRvdmEgYXBwbGljYXRpb25zLCBhIEZpbGUgbXVzdCBiZSByZXNvbHZlZCB1c2luZ1xuICAgICAgLy8gRmlsZVJlYWRlciBpbnN0YW5jZXMsIHNlZVxuICAgICAgLy8gaHR0cHM6Ly9jb3Jkb3ZhLmFwYWNoZS5vcmcvZG9jcy9lbi84LngvcmVmZXJlbmNlL2NvcmRvdmEtcGx1Z2luLWZpbGUvaW5kZXguaHRtbCNyZWFkLWEtZmlsZVxuICAgICAgaWYgKCgwLCBfaXNDb3Jkb3ZhLmRlZmF1bHQpKCkpIHtcbiAgICAgICAgcmV0dXJuICgwLCBfcmVhZEFzQnl0ZUFycmF5LmRlZmF1bHQpKHRoaXMuX2ZpbGUuc2xpY2Uoc3RhcnQsIGVuZCkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLl9maWxlLnNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xvc2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xvc2UoKSB7Ly8gTm90aGluZyB0byBkbyBoZXJlIHNpbmNlIHdlIGRvbid0IG5lZWQgdG8gcmVsZWFzZSBhbnkgcmVzb3VyY2VzLlxuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBGaWxlU291cmNlO1xufSgpO1xuXG52YXIgU3RyZWFtU291cmNlID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU3RyZWFtU291cmNlKHJlYWRlciwgY2h1bmtTaXplKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFN0cmVhbVNvdXJjZSk7XG5cbiAgICB0aGlzLl9jaHVua1NpemUgPSBjaHVua1NpemU7XG4gICAgdGhpcy5fYnVmZmVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2J1ZmZlck9mZnNldCA9IDA7XG4gICAgdGhpcy5fcmVhZGVyID0gcmVhZGVyO1xuICAgIHRoaXMuX2RvbmUgPSBmYWxzZTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhTdHJlYW1Tb3VyY2UsIFt7XG4gICAga2V5OiBcInNsaWNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNsaWNlKHN0YXJ0LCBlbmQpIHtcbiAgICAgIGlmIChzdGFydCA8IHRoaXMuX2J1ZmZlck9mZnNldCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiUmVxdWVzdGVkIGRhdGEgaXMgYmVmb3JlIHRoZSByZWFkZXIncyBjdXJyZW50IG9mZnNldFwiKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9yZWFkVW50aWxFbm91Z2hEYXRhT3JEb25lKHN0YXJ0LCBlbmQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfcmVhZFVudGlsRW5vdWdoRGF0YU9yRG9uZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfcmVhZFVudGlsRW5vdWdoRGF0YU9yRG9uZShzdGFydCwgZW5kKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgaGFzRW5vdWdoRGF0YSA9IGVuZCA8PSB0aGlzLl9idWZmZXJPZmZzZXQgKyBsZW4odGhpcy5fYnVmZmVyKTtcblxuICAgICAgaWYgKHRoaXMuX2RvbmUgfHwgaGFzRW5vdWdoRGF0YSkge1xuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLl9nZXREYXRhRnJvbUJ1ZmZlcihzdGFydCwgZW5kKTtcblxuICAgICAgICB2YXIgZG9uZSA9IHZhbHVlID09IG51bGwgPyB0aGlzLl9kb25lIDogZmFsc2U7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICBkb25lOiBkb25lXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fcmVhZGVyLnJlYWQoKS50aGVuKGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IF9yZWYudmFsdWUsXG4gICAgICAgICAgICBkb25lID0gX3JlZi5kb25lO1xuXG4gICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgX3RoaXMuX2RvbmUgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKF90aGlzLl9idWZmZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIF90aGlzLl9idWZmZXIgPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfdGhpcy5fYnVmZmVyID0gY29uY2F0KF90aGlzLl9idWZmZXIsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfdGhpcy5fcmVhZFVudGlsRW5vdWdoRGF0YU9yRG9uZShzdGFydCwgZW5kKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfZ2V0RGF0YUZyb21CdWZmZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2dldERhdGFGcm9tQnVmZmVyKHN0YXJ0LCBlbmQpIHtcbiAgICAgIC8vIFJlbW92ZSBkYXRhIGZyb20gYnVmZmVyIGJlZm9yZSBgc3RhcnRgLlxuICAgICAgLy8gRGF0YSBtaWdodCBiZSByZXJlYWQgZnJvbSB0aGUgYnVmZmVyIGlmIGFuIHVwbG9hZCBmYWlscywgc28gd2UgY2FuIG9ubHlcbiAgICAgIC8vIHNhZmVseSBkZWxldGUgZGF0YSB3aGVuIGl0IGNvbWVzICpiZWZvcmUqIHdoYXQgaXMgY3VycmVudGx5IGJlaW5nIHJlYWQuXG4gICAgICBpZiAoc3RhcnQgPiB0aGlzLl9idWZmZXJPZmZzZXQpIHtcbiAgICAgICAgdGhpcy5fYnVmZmVyID0gdGhpcy5fYnVmZmVyLnNsaWNlKHN0YXJ0IC0gdGhpcy5fYnVmZmVyT2Zmc2V0KTtcbiAgICAgICAgdGhpcy5fYnVmZmVyT2Zmc2V0ID0gc3RhcnQ7XG4gICAgICB9IC8vIElmIHRoZSBidWZmZXIgaXMgZW1wdHkgYWZ0ZXIgcmVtb3Zpbmcgb2xkIGRhdGEsIGFsbCBkYXRhIGhhcyBiZWVuIHJlYWQuXG5cblxuICAgICAgdmFyIGhhc0FsbERhdGFCZWVuUmVhZCA9IGxlbih0aGlzLl9idWZmZXIpID09PSAwO1xuXG4gICAgICBpZiAodGhpcy5fZG9uZSAmJiBoYXNBbGxEYXRhQmVlblJlYWQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IC8vIFdlIGFscmVhZHkgcmVtb3ZlZCBkYXRhIGJlZm9yZSBgc3RhcnRgLCBzbyB3ZSBqdXN0IHJldHVybiB0aGUgZmlyc3RcbiAgICAgIC8vIGNodW5rIGZyb20gdGhlIGJ1ZmZlci5cblxuXG4gICAgICByZXR1cm4gdGhpcy5fYnVmZmVyLnNsaWNlKDAsIGVuZCAtIHN0YXJ0KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xvc2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICBpZiAodGhpcy5fcmVhZGVyLmNhbmNlbCkge1xuICAgICAgICB0aGlzLl9yZWFkZXIuY2FuY2VsKCk7XG4gICAgICB9XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFN0cmVhbVNvdXJjZTtcbn0oKTtcblxuZnVuY3Rpb24gbGVuKGJsb2JPckFycmF5KSB7XG4gIGlmIChibG9iT3JBcnJheSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gMDtcbiAgaWYgKGJsb2JPckFycmF5LnNpemUgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGJsb2JPckFycmF5LnNpemU7XG4gIHJldHVybiBibG9iT3JBcnJheS5sZW5ndGg7XG59XG4vKlxuICBUeXBlZCBhcnJheXMgYW5kIGJsb2JzIGRvbid0IGhhdmUgYSBjb25jYXQgbWV0aG9kLlxuICBUaGlzIGZ1bmN0aW9uIGhlbHBzIFN0cmVhbVNvdXJjZSBhY2N1bXVsYXRlIGRhdGEgdG8gcmVhY2ggY2h1bmtTaXplLlxuKi9cblxuXG5mdW5jdGlvbiBjb25jYXQoYSwgYikge1xuICBpZiAoYS5jb25jYXQpIHtcbiAgICAvLyBJcyBgYWAgYW4gQXJyYXk/XG4gICAgcmV0dXJuIGEuY29uY2F0KGIpO1xuICB9XG5cbiAgaWYgKGEgaW5zdGFuY2VvZiBCbG9iKSB7XG4gICAgcmV0dXJuIG5ldyBCbG9iKFthLCBiXSwge1xuICAgICAgdHlwZTogYS50eXBlXG4gICAgfSk7XG4gIH1cblxuICBpZiAoYS5zZXQpIHtcbiAgICAvLyBJcyBgYWAgYSB0eXBlZCBhcnJheT9cbiAgICB2YXIgYyA9IG5ldyBhLmNvbnN0cnVjdG9yKGEubGVuZ3RoICsgYi5sZW5ndGgpO1xuICAgIGMuc2V0KGEpO1xuICAgIGMuc2V0KGIsIGEubGVuZ3RoKTtcbiAgICByZXR1cm4gYztcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcignVW5rbm93biBkYXRhIHR5cGUnKTtcbn1cblxudmFyIEZpbGVSZWFkZXIgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBGaWxlUmVhZGVyKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBGaWxlUmVhZGVyKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhGaWxlUmVhZGVyLCBbe1xuICAgIGtleTogXCJvcGVuRmlsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvcGVuRmlsZShpbnB1dCwgY2h1bmtTaXplKSB7XG4gICAgICAvLyBJbiBSZWFjdCBOYXRpdmUsIHdoZW4gdXNlciBzZWxlY3RzIGEgZmlsZSwgaW5zdGVhZCBvZiBhIEZpbGUgb3IgQmxvYixcbiAgICAgIC8vIHlvdSB1c3VhbGx5IGdldCBhIGZpbGUgb2JqZWN0IHt9IHdpdGggYSB1cmkgcHJvcGVydHkgdGhhdCBjb250YWluc1xuICAgICAgLy8gYSBsb2NhbCBwYXRoIHRvIHRoZSBmaWxlLiBXZSB1c2UgWE1MSHR0cFJlcXVlc3QgdG8gZmV0Y2hcbiAgICAgIC8vIHRoZSBmaWxlIGJsb2IsIGJlZm9yZSB1cGxvYWRpbmcgd2l0aCB0dXMuXG4gICAgICBpZiAoKDAsIF9pc1JlYWN0TmF0aXZlLmRlZmF1bHQpKCkgJiYgaW5wdXQgJiYgdHlwZW9mIGlucHV0LnVyaSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuICgwLCBfdXJpVG9CbG9iLmRlZmF1bHQpKGlucHV0LnVyaSkudGhlbihmdW5jdGlvbiAoYmxvYikge1xuICAgICAgICAgIHJldHVybiBuZXcgRmlsZVNvdXJjZShibG9iKTtcbiAgICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHVzOiBjYW5ub3QgZmV0Y2ggYGZpbGUudXJpYCBhcyBCbG9iLCBtYWtlIHN1cmUgdGhlIHVyaSBpcyBjb3JyZWN0IGFuZCBhY2Nlc3NpYmxlLiBcIi5jb25jYXQoZXJyKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSAvLyBTaW5jZSB3ZSBlbXVsYXRlIHRoZSBCbG9iIHR5cGUgaW4gb3VyIHRlc3RzIChub3QgYWxsIHRhcmdldCBicm93c2Vyc1xuICAgICAgLy8gc3VwcG9ydCBpdCksIHdlIGNhbm5vdCB1c2UgYGluc3RhbmNlb2ZgIGZvciB0ZXN0aW5nIHdoZXRoZXIgdGhlIGlucHV0IHZhbHVlXG4gICAgICAvLyBjYW4gYmUgaGFuZGxlZC4gSW5zdGVhZCwgd2Ugc2ltcGx5IGNoZWNrIGlzIHRoZSBzbGljZSgpIGZ1bmN0aW9uIGFuZCB0aGVcbiAgICAgIC8vIHNpemUgcHJvcGVydHkgYXJlIGF2YWlsYWJsZS5cblxuXG4gICAgICBpZiAodHlwZW9mIGlucHV0LnNsaWNlID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBpbnB1dC5zaXplICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBGaWxlU291cmNlKGlucHV0KSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaW5wdXQucmVhZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjaHVua1NpemUgPSArY2h1bmtTaXplO1xuXG4gICAgICAgIGlmICghaXNGaW5pdGUoY2h1bmtTaXplKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ2Nhbm5vdCBjcmVhdGUgc291cmNlIGZvciBzdHJlYW0gd2l0aG91dCBhIGZpbml0ZSB2YWx1ZSBmb3IgdGhlIGBjaHVua1NpemVgIG9wdGlvbicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IFN0cmVhbVNvdXJjZShpbnB1dCwgY2h1bmtTaXplKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ3NvdXJjZSBvYmplY3QgbWF5IG9ubHkgYmUgYW4gaW5zdGFuY2Ugb2YgRmlsZSwgQmxvYiwgb3IgUmVhZGVyIGluIHRoaXMgZW52aXJvbm1lbnQnKSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEZpbGVSZWFkZXI7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEZpbGVSZWFkZXI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBmaW5nZXJwcmludDtcblxudmFyIF9pc1JlYWN0TmF0aXZlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9pc1JlYWN0TmF0aXZlXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLy8gVE9ETzogRGlmZmVyZW5jaWF0ZSBiZXR3ZWVuIGlucHV0IHR5cGVzXG5cbi8qKlxuICogR2VuZXJhdGUgYSBmaW5nZXJwcmludCBmb3IgYSBmaWxlIHdoaWNoIHdpbGwgYmUgdXNlZCB0aGUgc3RvcmUgdGhlIGVuZHBvaW50XG4gKlxuICogQHBhcmFtIHtGaWxlfSBmaWxlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZnVuY3Rpb24gZmluZ2VycHJpbnQoZmlsZSwgb3B0aW9ucykge1xuICBpZiAoKDAsIF9pc1JlYWN0TmF0aXZlLmRlZmF1bHQpKCkpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlYWN0TmF0aXZlRmluZ2VycHJpbnQoZmlsZSwgb3B0aW9ucykpO1xuICB9XG5cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbJ3R1cy1icicsIGZpbGUubmFtZSwgZmlsZS50eXBlLCBmaWxlLnNpemUsIGZpbGUubGFzdE1vZGlmaWVkLCBvcHRpb25zLmVuZHBvaW50XS5qb2luKCctJykpO1xufVxuXG5mdW5jdGlvbiByZWFjdE5hdGl2ZUZpbmdlcnByaW50KGZpbGUsIG9wdGlvbnMpIHtcbiAgdmFyIGV4aWZIYXNoID0gZmlsZS5leGlmID8gaGFzaENvZGUoSlNPTi5zdHJpbmdpZnkoZmlsZS5leGlmKSkgOiAnbm9leGlmJztcbiAgcmV0dXJuIFsndHVzLXJuJywgZmlsZS5uYW1lIHx8ICdub25hbWUnLCBmaWxlLnNpemUgfHwgJ25vc2l6ZScsIGV4aWZIYXNoLCBvcHRpb25zLmVuZHBvaW50XS5qb2luKCcvJyk7XG59XG5cbmZ1bmN0aW9uIGhhc2hDb2RlKHN0cikge1xuICAvLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODMxOTM3LzE1MTY2NlxuICB2YXIgaGFzaCA9IDA7XG5cbiAgaWYgKHN0ci5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gaGFzaDtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIF9jaGFyID0gc3RyLmNoYXJDb2RlQXQoaSk7XG5cbiAgICBoYXNoID0gKGhhc2ggPDwgNSkgLSBoYXNoICsgX2NoYXI7XG4gICAgaGFzaCAmPSBoYXNoOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgfVxuXG4gIHJldHVybiBoYXNoO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59XG4vKiBnbG9iYWwgd2luZG93ICovXG5cblxudmFyIFhIUkh0dHBTdGFjayA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFhIUkh0dHBTdGFjaygpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgWEhSSHR0cFN0YWNrKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhYSFJIdHRwU3RhY2ssIFt7XG4gICAga2V5OiBcImNyZWF0ZVJlcXVlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlUmVxdWVzdChtZXRob2QsIHVybCkge1xuICAgICAgcmV0dXJuIG5ldyBSZXF1ZXN0KG1ldGhvZCwgdXJsKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0TmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXROYW1lKCkge1xuICAgICAgcmV0dXJuICdYSFJIdHRwU3RhY2snO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBYSFJIdHRwU3RhY2s7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFhIUkh0dHBTdGFjaztcblxudmFyIFJlcXVlc3QgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBSZXF1ZXN0KG1ldGhvZCwgdXJsKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFJlcXVlc3QpO1xuXG4gICAgdGhpcy5feGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICB0aGlzLl94aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XG5cbiAgICB0aGlzLl9tZXRob2QgPSBtZXRob2Q7XG4gICAgdGhpcy5fdXJsID0gdXJsO1xuICAgIHRoaXMuX2hlYWRlcnMgPSB7fTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhSZXF1ZXN0LCBbe1xuICAgIGtleTogXCJnZXRNZXRob2RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0TWV0aG9kKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21ldGhvZDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0VVJMXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFVSTCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl91cmw7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldEhlYWRlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRIZWFkZXIoaGVhZGVyLCB2YWx1ZSkge1xuICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCB2YWx1ZSk7XG5cbiAgICAgIHRoaXMuX2hlYWRlcnNbaGVhZGVyXSA9IHZhbHVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRIZWFkZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0SGVhZGVyKGhlYWRlcikge1xuICAgICAgcmV0dXJuIHRoaXMuX2hlYWRlcnNbaGVhZGVyXTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0UHJvZ3Jlc3NIYW5kbGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFByb2dyZXNzSGFuZGxlcihwcm9ncmVzc0hhbmRsZXIpIHtcbiAgICAgIC8vIFRlc3Qgc3VwcG9ydCBmb3IgcHJvZ3Jlc3MgZXZlbnRzIGJlZm9yZSBhdHRhY2hpbmcgYW4gZXZlbnQgbGlzdGVuZXJcbiAgICAgIGlmICghKCd1cGxvYWQnIGluIHRoaXMuX3hocikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl94aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoIWUubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb2dyZXNzSGFuZGxlcihlLmxvYWRlZCk7XG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZW5kXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNlbmQoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgYm9keSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbnVsbDtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIF90aGlzLl94aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKF90aGlzLl94aHIpKTtcbiAgICAgICAgfTtcblxuICAgICAgICBfdGhpcy5feGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH07XG5cbiAgICAgICAgX3RoaXMuX3hoci5zZW5kKGJvZHkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFib3J0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFib3J0KCkge1xuICAgICAgdGhpcy5feGhyLmFib3J0KCk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0VW5kZXJseWluZ09iamVjdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRVbmRlcmx5aW5nT2JqZWN0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3hocjtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gUmVxdWVzdDtcbn0oKTtcblxudmFyIFJlc3BvbnNlID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUmVzcG9uc2UoeGhyKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFJlc3BvbnNlKTtcblxuICAgIHRoaXMuX3hociA9IHhocjtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhSZXNwb25zZSwgW3tcbiAgICBrZXk6IFwiZ2V0U3RhdHVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFN0YXR1cygpIHtcbiAgICAgIHJldHVybiB0aGlzLl94aHIuc3RhdHVzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRIZWFkZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0SGVhZGVyKGhlYWRlcikge1xuICAgICAgcmV0dXJuIHRoaXMuX3hoci5nZXRSZXNwb25zZUhlYWRlcihoZWFkZXIpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRCb2R5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEJvZHkoKSB7XG4gICAgICByZXR1cm4gdGhpcy5feGhyLnJlc3BvbnNlVGV4dDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0VW5kZXJseWluZ09iamVjdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRVbmRlcmx5aW5nT2JqZWN0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3hocjtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gUmVzcG9uc2U7XG59KCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJlbmFibGVEZWJ1Z0xvZ1wiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfbG9nZ2VyLmVuYWJsZURlYnVnTG9nO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImNhblN0b3JlVVJMc1wiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfdXJsU3RvcmFnZS5jYW5TdG9yZVVSTHM7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiSHR0cFN0YWNrXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9odHRwU3RhY2suZGVmYXVsdDtcbiAgfVxufSk7XG5leHBvcnRzLmlzU3VwcG9ydGVkID0gZXhwb3J0cy5kZWZhdWx0T3B0aW9ucyA9IGV4cG9ydHMuVXBsb2FkID0gdm9pZCAwO1xuXG52YXIgX3VwbG9hZCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL3VwbG9hZFwiKSk7XG5cbnZhciBfbm9vcFVybFN0b3JhZ2UgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi9ub29wVXJsU3RvcmFnZVwiKSk7XG5cbnZhciBfbG9nZ2VyID0gcmVxdWlyZShcIi4uL2xvZ2dlclwiKTtcblxudmFyIF91cmxTdG9yYWdlID0gcmVxdWlyZShcIi4vdXJsU3RvcmFnZVwiKTtcblxudmFyIF9odHRwU3RhY2sgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2h0dHBTdGFja1wiKSk7XG5cbnZhciBfZmlsZVJlYWRlciA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vZmlsZVJlYWRlclwiKSk7XG5cbnZhciBfZmluZ2VycHJpbnQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2ZpbmdlcnByaW50XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX3R5cGVvZihvYmopO1xufVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7XG59XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gIF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICAgIG8uX19wcm90b19fID0gcDtcbiAgICByZXR1cm4gbztcbiAgfTtcblxuICByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApO1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSxcbiAgICAgICAgcmVzdWx0O1xuXG4gICAgaWYgKF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSkge1xuICAgICAgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjtcblxuICAgICAgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkge1xuICBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgIHJldHVybiBjYWxsO1xuICB9XG5cbiAgcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7XG59XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikge1xuICBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIHNlbGY7XG59XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTtcbiAgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTtcbiAgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTtcblxuICB0cnkge1xuICAgIERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHtcbiAgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHtcbiAgICByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pO1xuICB9O1xuICByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pO1xufVxuXG5mdW5jdGlvbiBvd25LZXlzKG9iamVjdCwgZW51bWVyYWJsZU9ubHkpIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7XG4gICAgaWYgKGVudW1lcmFibGVPbmx5KSBzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24gKHN5bSkge1xuICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7XG4gICAgfSk7XG4gICAga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpO1xuICB9XG5cbiAgcmV0dXJuIGtleXM7XG59XG5cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXSAhPSBudWxsID8gYXJndW1lbnRzW2ldIDoge307XG5cbiAgICBpZiAoaSAlIDIpIHtcbiAgICAgIG93bktleXMoT2JqZWN0KHNvdXJjZSksIHRydWUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG93bktleXMoT2JqZWN0KHNvdXJjZSkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuLyogZ2xvYmFsIHdpbmRvdyAqL1xuXG5cbnZhciBkZWZhdWx0T3B0aW9ucyA9IF9vYmplY3RTcHJlYWQoe30sIF91cGxvYWQuZGVmYXVsdC5kZWZhdWx0T3B0aW9ucywge1xuICBodHRwU3RhY2s6IG5ldyBfaHR0cFN0YWNrLmRlZmF1bHQoKSxcbiAgZmlsZVJlYWRlcjogbmV3IF9maWxlUmVhZGVyLmRlZmF1bHQoKSxcbiAgdXJsU3RvcmFnZTogX3VybFN0b3JhZ2UuY2FuU3RvcmVVUkxzID8gbmV3IF91cmxTdG9yYWdlLldlYlN0b3JhZ2VVcmxTdG9yYWdlKCkgOiBuZXcgX25vb3BVcmxTdG9yYWdlLmRlZmF1bHQoKSxcbiAgZmluZ2VycHJpbnQ6IF9maW5nZXJwcmludC5kZWZhdWx0XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0T3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zO1xuXG52YXIgVXBsb2FkID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfQmFzZVVwbG9hZCkge1xuICBfaW5oZXJpdHMoVXBsb2FkLCBfQmFzZVVwbG9hZCk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihVcGxvYWQpO1xuXG4gIGZ1bmN0aW9uIFVwbG9hZCgpIHtcbiAgICB2YXIgZmlsZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbnVsbDtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVXBsb2FkKTtcblxuICAgIG9wdGlvbnMgPSBfb2JqZWN0U3ByZWFkKHt9LCBkZWZhdWx0T3B0aW9ucywge30sIG9wdGlvbnMpO1xuICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCBmaWxlLCBvcHRpb25zKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhVcGxvYWQsIG51bGwsIFt7XG4gICAga2V5OiBcInRlcm1pbmF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0ZXJtaW5hdGUodXJsLCBvcHRpb25zLCBjYikge1xuICAgICAgb3B0aW9ucyA9IF9vYmplY3RTcHJlYWQoe30sIGRlZmF1bHRPcHRpb25zLCB7fSwgb3B0aW9ucyk7XG4gICAgICByZXR1cm4gX3VwbG9hZC5kZWZhdWx0LnRlcm1pbmF0ZSh1cmwsIG9wdGlvbnMsIGNiKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gVXBsb2FkO1xufShfdXBsb2FkLmRlZmF1bHQpO1xuXG5leHBvcnRzLlVwbG9hZCA9IFVwbG9hZDtcbnZhciBfd2luZG93ID0gd2luZG93LFxuICAgIFhNTEh0dHBSZXF1ZXN0ID0gX3dpbmRvdy5YTUxIdHRwUmVxdWVzdCxcbiAgICBCbG9iID0gX3dpbmRvdy5CbG9iO1xudmFyIGlzU3VwcG9ydGVkID0gWE1MSHR0cFJlcXVlc3QgJiYgQmxvYiAmJiB0eXBlb2YgQmxvYi5wcm90b3R5cGUuc2xpY2UgPT09ICdmdW5jdGlvbic7XG5leHBvcnRzLmlzU3VwcG9ydGVkID0gaXNTdXBwb3J0ZWQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XG5cbnZhciBpc0NvcmRvdmEgPSBmdW5jdGlvbiBpc0NvcmRvdmEoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmICh0eXBlb2Ygd2luZG93LlBob25lR2FwICE9ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB3aW5kb3cuQ29yZG92YSAhPSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygd2luZG93LmNvcmRvdmEgIT0gJ3VuZGVmaW5lZCcpO1xufTtcblxudmFyIF9kZWZhdWx0ID0gaXNDb3Jkb3ZhO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XG5cbnZhciBpc1JlYWN0TmF0aXZlID0gZnVuY3Rpb24gaXNSZWFjdE5hdGl2ZSgpIHtcbiAgcmV0dXJuIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ3N0cmluZycgJiYgbmF2aWdhdG9yLnByb2R1Y3QudG9Mb3dlckNhc2UoKSA9PT0gJ3JlYWN0bmF0aXZlJztcbn07XG5cbnZhciBfZGVmYXVsdCA9IGlzUmVhY3ROYXRpdmU7XG5leHBvcnRzLmRlZmF1bHQgPSBfZGVmYXVsdDsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHJlYWRBc0J5dGVBcnJheTtcblxuLyoqXG4gKiByZWFkQXNCeXRlQXJyYXkgY29udmVydHMgYSBGaWxlIG9iamVjdCB0byBhIFVpbnQ4QXJyYXkuXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIG9ubHkgdXNlZCBvbiB0aGUgQXBhY2hlIENvcmRvdmEgcGxhdGZvcm0uXG4gKiBTZWUgaHR0cHM6Ly9jb3Jkb3ZhLmFwYWNoZS5vcmcvZG9jcy9lbi9sYXRlc3QvcmVmZXJlbmNlL2NvcmRvdmEtcGx1Z2luLWZpbGUvaW5kZXguaHRtbCNyZWFkLWEtZmlsZVxuICovXG5mdW5jdGlvbiByZWFkQXNCeXRlQXJyYXkoY2h1bmspIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsdWUgPSBuZXcgVWludDhBcnJheShyZWFkZXIucmVzdWx0KTtcbiAgICAgIHJlc29sdmUoe1xuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgIH07XG5cbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoY2h1bmspO1xuICB9KTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHVyaVRvQmxvYjtcblxuLyoqXG4gKiB1cmlUb0Jsb2IgcmVzb2x2ZXMgYSBVUkkgdG8gYSBCbG9iIG9iamVjdC4gVGhpcyBpcyB1c2VkIGZvclxuICogUmVhY3QgTmF0aXZlIHRvIHJldHJpZXZlIGEgZmlsZSAoaWRlbnRpZmllZCBieSBhIGZpbGU6Ly9cbiAqIFVSSSkgYXMgYSBibG9iLlxuICovXG5mdW5jdGlvbiB1cmlUb0Jsb2IodXJpKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYic7XG5cbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGJsb2IgPSB4aHIucmVzcG9uc2U7XG4gICAgICByZXNvbHZlKGJsb2IpO1xuICAgIH07XG5cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgIH07XG5cbiAgICB4aHIub3BlbignR0VUJywgdXJpKTtcbiAgICB4aHIuc2VuZCgpO1xuICB9KTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuV2ViU3RvcmFnZVVybFN0b3JhZ2UgPSBleHBvcnRzLmNhblN0b3JlVVJMcyA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufVxuLyogZ2xvYmFsIHdpbmRvdywgbG9jYWxTdG9yYWdlICovXG5cblxudmFyIGhhc1N0b3JhZ2UgPSBmYWxzZTtcblxudHJ5IHtcbiAgaGFzU3RvcmFnZSA9ICdsb2NhbFN0b3JhZ2UnIGluIHdpbmRvdzsgLy8gQXR0ZW1wdCB0byBzdG9yZSBhbmQgcmVhZCBlbnRyaWVzIGZyb20gdGhlIGxvY2FsIHN0b3JhZ2UgdG8gZGV0ZWN0IFByaXZhdGVcbiAgLy8gTW9kZSBvbiBTYWZhcmkgb24gaU9TIChzZWUgIzQ5KVxuXG4gIHZhciBrZXkgPSAndHVzU3VwcG9ydCc7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSk7XG59IGNhdGNoIChlKSB7XG4gIC8vIElmIHdlIHRyeSB0byBhY2Nlc3MgbG9jYWxTdG9yYWdlIGluc2lkZSBhIHNhbmRib3hlZCBpZnJhbWUsIGEgU2VjdXJpdHlFcnJvclxuICAvLyBpcyB0aHJvd24uIFdoZW4gaW4gcHJpdmF0ZSBtb2RlIG9uIGlPUyBTYWZhcmksIGEgUXVvdGFFeGNlZWRlZEVycm9yIGlzXG4gIC8vIHRocm93biAoc2VlICM0OSlcbiAgaWYgKGUuY29kZSA9PT0gZS5TRUNVUklUWV9FUlIgfHwgZS5jb2RlID09PSBlLlFVT1RBX0VYQ0VFREVEX0VSUikge1xuICAgIGhhc1N0b3JhZ2UgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBlO1xuICB9XG59XG5cbnZhciBjYW5TdG9yZVVSTHMgPSBoYXNTdG9yYWdlO1xuZXhwb3J0cy5jYW5TdG9yZVVSTHMgPSBjYW5TdG9yZVVSTHM7XG5cbnZhciBXZWJTdG9yYWdlVXJsU3RvcmFnZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFdlYlN0b3JhZ2VVcmxTdG9yYWdlKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBXZWJTdG9yYWdlVXJsU3RvcmFnZSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoV2ViU3RvcmFnZVVybFN0b3JhZ2UsIFt7XG4gICAga2V5OiBcImZpbmRBbGxVcGxvYWRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpbmRBbGxVcGxvYWRzKCkge1xuICAgICAgdmFyIHJlc3VsdHMgPSB0aGlzLl9maW5kRW50cmllcygndHVzOjonKTtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXN1bHRzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmluZFVwbG9hZHNCeUZpbmdlcnByaW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpbmRVcGxvYWRzQnlGaW5nZXJwcmludChmaW5nZXJwcmludCkge1xuICAgICAgdmFyIHJlc3VsdHMgPSB0aGlzLl9maW5kRW50cmllcyhcInR1czo6XCIuY29uY2F0KGZpbmdlcnByaW50LCBcIjo6XCIpKTtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXN1bHRzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlVXBsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZVVwbG9hZCh1cmxTdG9yYWdlS2V5KSB7XG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh1cmxTdG9yYWdlS2V5KTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYWRkVXBsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZFVwbG9hZChmaW5nZXJwcmludCwgdXBsb2FkKSB7XG4gICAgICB2YXIgaWQgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxZTEyKTtcbiAgICAgIHZhciBrZXkgPSBcInR1czo6XCIuY29uY2F0KGZpbmdlcnByaW50LCBcIjo6XCIpLmNvbmNhdChpZCk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHVwbG9hZCkpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShrZXkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfZmluZEVudHJpZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2ZpbmRFbnRyaWVzKHByZWZpeCkge1xuICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIF9rZXkgPSBsb2NhbFN0b3JhZ2Uua2V5KGkpO1xuXG4gICAgICAgIGlmIChfa2V5LmluZGV4T2YocHJlZml4KSAhPT0gMCkgY29udGludWU7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgdXBsb2FkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShfa2V5KSk7XG4gICAgICAgICAgdXBsb2FkLnVybFN0b3JhZ2VLZXkgPSBfa2V5O1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh1cGxvYWQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7Ly8gVGhlIEpTT04gcGFyc2UgZXJyb3IgaXMgaW50ZW50aW9uYWxseSBpZ25vcmVkIGhlcmUsIHNvIGEgbWFsZm9ybWVkXG4gICAgICAgICAgLy8gZW50cnkgaW4gdGhlIHN0b3JhZ2UgY2Fubm90IHByZXZlbnQgYW4gdXBsb2FkLlxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBXZWJTdG9yYWdlVXJsU3RvcmFnZTtcbn0oKTtcblxuZXhwb3J0cy5XZWJTdG9yYWdlVXJsU3RvcmFnZSA9IFdlYlN0b3JhZ2VVcmxTdG9yYWdlOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7XG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7XG4gICAgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfdHlwZW9mKG9iaik7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLFxuICAgICAgICByZXN1bHQ7XG5cbiAgICBpZiAoX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpKSB7XG4gICAgICB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yO1xuXG4gICAgICByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7XG4gIGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7XG4gICAgcmV0dXJuIGNhbGw7XG4gIH1cblxuICByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTtcbn1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7XG4gIGlmIChzZWxmID09PSB2b2lkIDApIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gc2VsZjtcbn1cblxuZnVuY3Rpb24gX3dyYXBOYXRpdmVTdXBlcihDbGFzcykge1xuICB2YXIgX2NhY2hlID0gdHlwZW9mIE1hcCA9PT0gXCJmdW5jdGlvblwiID8gbmV3IE1hcCgpIDogdW5kZWZpbmVkO1xuXG4gIF93cmFwTmF0aXZlU3VwZXIgPSBmdW5jdGlvbiBfd3JhcE5hdGl2ZVN1cGVyKENsYXNzKSB7XG4gICAgaWYgKENsYXNzID09PSBudWxsIHx8ICFfaXNOYXRpdmVGdW5jdGlvbihDbGFzcykpIHJldHVybiBDbGFzcztcblxuICAgIGlmICh0eXBlb2YgQ2xhc3MgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgX2NhY2hlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBpZiAoX2NhY2hlLmhhcyhDbGFzcykpIHJldHVybiBfY2FjaGUuZ2V0KENsYXNzKTtcblxuICAgICAgX2NhY2hlLnNldChDbGFzcywgV3JhcHBlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gV3JhcHBlcigpIHtcbiAgICAgIHJldHVybiBfY29uc3RydWN0KENsYXNzLCBhcmd1bWVudHMsIF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3Rvcik7XG4gICAgfVxuXG4gICAgV3JhcHBlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENsYXNzLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IFdyYXBwZXIsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihXcmFwcGVyLCBDbGFzcyk7XG4gIH07XG5cbiAgcmV0dXJuIF93cmFwTmF0aXZlU3VwZXIoQ2xhc3MpO1xufVxuXG5mdW5jdGlvbiBfY29uc3RydWN0KFBhcmVudCwgYXJncywgQ2xhc3MpIHtcbiAgaWYgKF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSkge1xuICAgIF9jb25zdHJ1Y3QgPSBSZWZsZWN0LmNvbnN0cnVjdDtcbiAgfSBlbHNlIHtcbiAgICBfY29uc3RydWN0ID0gZnVuY3Rpb24gX2NvbnN0cnVjdChQYXJlbnQsIGFyZ3MsIENsYXNzKSB7XG4gICAgICB2YXIgYSA9IFtudWxsXTtcbiAgICAgIGEucHVzaC5hcHBseShhLCBhcmdzKTtcbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IEZ1bmN0aW9uLmJpbmQuYXBwbHkoUGFyZW50LCBhKTtcbiAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyBDb25zdHJ1Y3RvcigpO1xuICAgICAgaWYgKENsYXNzKSBfc2V0UHJvdG90eXBlT2YoaW5zdGFuY2UsIENsYXNzLnByb3RvdHlwZSk7XG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfY29uc3RydWN0LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG59XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTtcbiAgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTtcbiAgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTtcblxuICB0cnkge1xuICAgIERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2lzTmF0aXZlRnVuY3Rpb24oZm4pIHtcbiAgcmV0dXJuIEZ1bmN0aW9uLnRvU3RyaW5nLmNhbGwoZm4pLmluZGV4T2YoXCJbbmF0aXZlIGNvZGVdXCIpICE9PSAtMTtcbn1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHtcbiAgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gICAgby5fX3Byb3RvX18gPSBwO1xuICAgIHJldHVybiBvO1xuICB9O1xuXG4gIHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7XG59XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gIF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTtcbiAgfTtcbiAgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTtcbn1cblxudmFyIERldGFpbGVkRXJyb3IgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9FcnJvcikge1xuICBfaW5oZXJpdHMoRGV0YWlsZWRFcnJvciwgX0Vycm9yKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKERldGFpbGVkRXJyb3IpO1xuXG4gIGZ1bmN0aW9uIERldGFpbGVkRXJyb3IobWVzc2FnZSkge1xuICAgIHZhciBfdGhpcztcblxuICAgIHZhciBjYXVzaW5nRXJyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuICAgIHZhciByZXEgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IG51bGw7XG4gICAgdmFyIHJlcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogbnVsbDtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEZXRhaWxlZEVycm9yKTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbWVzc2FnZSk7XG4gICAgX3RoaXMub3JpZ2luYWxSZXF1ZXN0ID0gcmVxO1xuICAgIF90aGlzLm9yaWdpbmFsUmVzcG9uc2UgPSByZXM7XG4gICAgX3RoaXMuY2F1c2luZ0Vycm9yID0gY2F1c2luZ0VycjtcblxuICAgIGlmIChjYXVzaW5nRXJyICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2UgKz0gXCIsIGNhdXNlZCBieSBcIi5jb25jYXQoY2F1c2luZ0Vyci50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICBpZiAocmVxICE9IG51bGwpIHtcbiAgICAgIHZhciByZXF1ZXN0SWQgPSByZXEuZ2V0SGVhZGVyKCdYLVJlcXVlc3QtSUQnKSB8fCAnbi9hJztcbiAgICAgIHZhciBtZXRob2QgPSByZXEuZ2V0TWV0aG9kKCk7XG4gICAgICB2YXIgdXJsID0gcmVxLmdldFVSTCgpO1xuICAgICAgdmFyIHN0YXR1cyA9IHJlcyA/IHJlcy5nZXRTdGF0dXMoKSA6ICduL2EnO1xuICAgICAgdmFyIGJvZHkgPSByZXMgPyByZXMuZ2V0Qm9keSgpIHx8ICcnIDogJ24vYSc7XG4gICAgICBtZXNzYWdlICs9IFwiLCBvcmlnaW5hdGVkIGZyb20gcmVxdWVzdCAobWV0aG9kOiBcIi5jb25jYXQobWV0aG9kLCBcIiwgdXJsOiBcIikuY29uY2F0KHVybCwgXCIsIHJlc3BvbnNlIGNvZGU6IFwiKS5jb25jYXQoc3RhdHVzLCBcIiwgcmVzcG9uc2UgdGV4dDogXCIpLmNvbmNhdChib2R5LCBcIiwgcmVxdWVzdCBpZDogXCIpLmNvbmNhdChyZXF1ZXN0SWQsIFwiKVwiKTtcbiAgICB9XG5cbiAgICBfdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICByZXR1cm4gRGV0YWlsZWRFcnJvcjtcbn0oIC8qI19fUFVSRV9fKi9fd3JhcE5hdGl2ZVN1cGVyKEVycm9yKSk7XG5cbnZhciBfZGVmYXVsdCA9IERldGFpbGVkRXJyb3I7XG5leHBvcnRzLmRlZmF1bHQgPSBfZGVmYXVsdDsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZW5hYmxlRGVidWdMb2cgPSBlbmFibGVEZWJ1Z0xvZztcbmV4cG9ydHMubG9nID0gbG9nO1xuXG4vKiBlc2xpbnQgbm8tY29uc29sZTogXCJvZmZcIiAqL1xudmFyIGlzRW5hYmxlZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiBlbmFibGVEZWJ1Z0xvZygpIHtcbiAgaXNFbmFibGVkID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gbG9nKG1zZykge1xuICBpZiAoIWlzRW5hYmxlZCkgcmV0dXJuO1xuICBjb25zb2xlLmxvZyhtc2cpO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59XG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IFwib2ZmXCIgKi9cblxuXG52YXIgTm9vcFVybFN0b3JhZ2UgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBOb29wVXJsU3RvcmFnZSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTm9vcFVybFN0b3JhZ2UpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE5vb3BVcmxTdG9yYWdlLCBbe1xuICAgIGtleTogXCJsaXN0QWxsVXBsb2Fkc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsaXN0QWxsVXBsb2FkcygpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJmaW5kVXBsb2Fkc0J5RmluZ2VycHJpbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmluZFVwbG9hZHNCeUZpbmdlcnByaW50KGZpbmdlcnByaW50KSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlVXBsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZVVwbG9hZCh1cmxTdG9yYWdlS2V5KSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFkZFVwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRVcGxvYWQoZmluZ2VycHJpbnQsIHVwbG9hZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gTm9vcFVybFN0b3JhZ2U7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IE5vb3BVcmxTdG9yYWdlOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG52YXIgX2pzQmFzZSA9IHJlcXVpcmUoXCJqcy1iYXNlNjRcIik7XG5cbnZhciBfdXJsUGFyc2UgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJ1cmwtcGFyc2VcIikpO1xuXG52YXIgX2Vycm9yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9lcnJvclwiKSk7XG5cbnZhciBfbG9nZ2VyID0gcmVxdWlyZShcIi4vbG9nZ2VyXCIpO1xuXG52YXIgX3V1aWQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL3V1aWRcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBvd25LZXlzKG9iamVjdCwgZW51bWVyYWJsZU9ubHkpIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7XG4gICAgaWYgKGVudW1lcmFibGVPbmx5KSBzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24gKHN5bSkge1xuICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7XG4gICAgfSk7XG4gICAga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpO1xuICB9XG5cbiAgcmV0dXJuIGtleXM7XG59XG5cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXSAhPSBudWxsID8gYXJndW1lbnRzW2ldIDoge307XG5cbiAgICBpZiAoaSAlIDIpIHtcbiAgICAgIG93bktleXMoT2JqZWN0KHNvdXJjZSksIHRydWUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG93bktleXMoT2JqZWN0KHNvdXJjZSkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59XG4vKiBnbG9iYWwgd2luZG93ICovXG5cblxudmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICBlbmRwb2ludDogbnVsbCxcbiAgdXBsb2FkVXJsOiBudWxsLFxuICBtZXRhZGF0YToge30sXG4gIGZpbmdlcnByaW50OiBudWxsLFxuICB1cGxvYWRTaXplOiBudWxsLFxuICBvblByb2dyZXNzOiBudWxsLFxuICBvbkNodW5rQ29tcGxldGU6IG51bGwsXG4gIG9uU3VjY2VzczogbnVsbCxcbiAgb25FcnJvcjogbnVsbCxcbiAgX29uVXBsb2FkVXJsQXZhaWxhYmxlOiBudWxsLFxuICBvdmVycmlkZVBhdGNoTWV0aG9kOiBmYWxzZSxcbiAgaGVhZGVyczoge30sXG4gIGFkZFJlcXVlc3RJZDogZmFsc2UsXG4gIG9uQmVmb3JlUmVxdWVzdDogbnVsbCxcbiAgb25BZnRlclJlc3BvbnNlOiBudWxsLFxuICBvblNob3VsZFJldHJ5OiBudWxsLFxuICBjaHVua1NpemU6IEluZmluaXR5LFxuICByZXRyeURlbGF5czogWzAsIDEwMDAsIDMwMDAsIDUwMDBdLFxuICBwYXJhbGxlbFVwbG9hZHM6IDEsXG4gIHN0b3JlRmluZ2VycHJpbnRGb3JSZXN1bWluZzogdHJ1ZSxcbiAgcmVtb3ZlRmluZ2VycHJpbnRPblN1Y2Nlc3M6IGZhbHNlLFxuICB1cGxvYWRMZW5ndGhEZWZlcnJlZDogZmFsc2UsXG4gIHVwbG9hZERhdGFEdXJpbmdDcmVhdGlvbjogZmFsc2UsXG4gIHVybFN0b3JhZ2U6IG51bGwsXG4gIGZpbGVSZWFkZXI6IG51bGwsXG4gIGh0dHBTdGFjazogbnVsbFxufTtcblxudmFyIEJhc2VVcGxvYWQgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBCYXNlVXBsb2FkKGZpbGUsIG9wdGlvbnMpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQmFzZVVwbG9hZCk7IC8vIFdhcm4gYWJvdXQgcmVtb3ZlZCBvcHRpb25zIGZyb20gcHJldmlvdXMgdmVyc2lvbnNcblxuXG4gICAgaWYgKCdyZXN1bWUnIGluIG9wdGlvbnMpIHtcbiAgICAgIGNvbnNvbGUubG9nKCd0dXM6IFRoZSBgcmVzdW1lYCBvcHRpb24gaGFzIGJlZW4gcmVtb3ZlZCBpbiB0dXMtanMtY2xpZW50IHYyLiBQbGVhc2UgdXNlIHRoZSBVUkwgc3RvcmFnZSBBUEkgaW5zdGVhZC4nKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgfSAvLyBUaGUgZGVmYXVsdCBvcHRpb25zIHdpbGwgYWxyZWFkeSBiZSBhZGRlZCBmcm9tIHRoZSB3cmFwcGVyIGNsYXNzZXMuXG5cblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7IC8vIFRoZSBzdG9yYWdlIG1vZHVsZSB1c2VkIHRvIHN0b3JlIFVSTHNcblxuICAgIHRoaXMuX3VybFN0b3JhZ2UgPSB0aGlzLm9wdGlvbnMudXJsU3RvcmFnZTsgLy8gVGhlIHVuZGVybHlpbmcgRmlsZS9CbG9iIG9iamVjdFxuXG4gICAgdGhpcy5maWxlID0gZmlsZTsgLy8gVGhlIFVSTCBhZ2FpbnN0IHdoaWNoIHRoZSBmaWxlIHdpbGwgYmUgdXBsb2FkZWRcblxuICAgIHRoaXMudXJsID0gbnVsbDsgLy8gVGhlIHVuZGVybHlpbmcgcmVxdWVzdCBvYmplY3QgZm9yIHRoZSBjdXJyZW50IFBBVENIIHJlcXVlc3RcblxuICAgIHRoaXMuX3JlcSA9IG51bGw7IC8vIFRoZSBmaW5nZXJwaW5ydCBmb3IgdGhlIGN1cnJlbnQgZmlsZSAoc2V0IGFmdGVyIHN0YXJ0KCkpXG5cbiAgICB0aGlzLl9maW5nZXJwcmludCA9IG51bGw7IC8vIFRoZSBrZXkgdGhhdCB0aGUgVVJMIHN0b3JhZ2UgcmV0dXJuZWQgd2hlbiBzYXZpbmcgYW4gVVJMIHdpdGggYSBmaW5nZXJwcmludCxcblxuICAgIHRoaXMuX3VybFN0b3JhZ2VLZXkgPSBudWxsOyAvLyBUaGUgb2Zmc2V0IHVzZWQgaW4gdGhlIGN1cnJlbnQgUEFUQ0ggcmVxdWVzdFxuXG4gICAgdGhpcy5fb2Zmc2V0ID0gbnVsbDsgLy8gVHJ1ZSBpZiB0aGUgY3VycmVudCBQQVRDSCByZXF1ZXN0IGhhcyBiZWVuIGFib3J0ZWRcblxuICAgIHRoaXMuX2Fib3J0ZWQgPSBmYWxzZTsgLy8gVGhlIGZpbGUncyBzaXplIGluIGJ5dGVzXG5cbiAgICB0aGlzLl9zaXplID0gbnVsbDsgLy8gVGhlIFNvdXJjZSBvYmplY3Qgd2hpY2ggd2lsbCB3cmFwIGFyb3VuZCB0aGUgZ2l2ZW4gZmlsZSBhbmQgcHJvdmlkZXMgdXNcbiAgICAvLyB3aXRoIGEgdW5pZmllZCBpbnRlcmZhY2UgZm9yIGdldHRpbmcgaXRzIHNpemUgYW5kIHNsaWNlIGNodW5rcyBmcm9tIGl0c1xuICAgIC8vIGNvbnRlbnQgYWxsb3dpbmcgdXMgdG8gZWFzaWx5IGhhbmRsZSBGaWxlcywgQmxvYnMsIEJ1ZmZlcnMgYW5kIFN0cmVhbXMuXG5cbiAgICB0aGlzLl9zb3VyY2UgPSBudWxsOyAvLyBUaGUgY3VycmVudCBjb3VudCBvZiBhdHRlbXB0cyB3aGljaCBoYXZlIGJlZW4gbWFkZS4gWmVybyBpbmRpY2F0ZXMgbm9uZS5cblxuICAgIHRoaXMuX3JldHJ5QXR0ZW1wdCA9IDA7IC8vIFRoZSB0aW1lb3V0J3MgSUQgd2hpY2ggaXMgdXNlZCB0byBkZWxheSB0aGUgbmV4dCByZXRyeVxuXG4gICAgdGhpcy5fcmV0cnlUaW1lb3V0ID0gbnVsbDsgLy8gVGhlIG9mZnNldCBvZiB0aGUgcmVtb3RlIHVwbG9hZCBiZWZvcmUgdGhlIGxhdGVzdCBhdHRlbXB0IHdhcyBzdGFydGVkLlxuXG4gICAgdGhpcy5fb2Zmc2V0QmVmb3JlUmV0cnkgPSAwOyAvLyBBbiBhcnJheSBvZiBCYXNlVXBsb2FkIGluc3RhbmNlcyB3aGljaCBhcmUgdXNlZCBmb3IgdXBsb2FkaW5nIHRoZSBkaWZmZXJlbnRcbiAgICAvLyBwYXJ0cywgaWYgdGhlIHBhcmFsbGVsVXBsb2FkcyBvcHRpb24gaXMgdXNlZC5cblxuICAgIHRoaXMuX3BhcmFsbGVsVXBsb2FkcyA9IG51bGw7IC8vIEFuIGFycmF5IG9mIHVwbG9hZCBVUkxzIHdoaWNoIGFyZSB1c2VkIGZvciB1cGxvYWRpbmcgdGhlIGRpZmZlcmVudFxuICAgIC8vIHBhcnRzLCBpZiB0aGUgcGFyYWxsZWxVcGxvYWRzIG9wdGlvbiBpcyB1c2VkLlxuXG4gICAgdGhpcy5fcGFyYWxsZWxVcGxvYWRVcmxzID0gbnVsbDtcbiAgfVxuICAvKipcbiAgICogVXNlIHRoZSBUZXJtaW5hdGlvbiBleHRlbnNpb24gdG8gZGVsZXRlIGFuIHVwbG9hZCBmcm9tIHRoZSBzZXJ2ZXIgYnkgc2VuZGluZyBhIERFTEVURVxuICAgKiByZXF1ZXN0IHRvIHRoZSBzcGVjaWZpZWQgdXBsb2FkIFVSTC4gVGhpcyBpcyBvbmx5IHBvc3NpYmxlIGlmIHRoZSBzZXJ2ZXIgc3VwcG9ydHMgdGhlXG4gICAqIFRlcm1pbmF0aW9uIGV4dGVuc2lvbi4gSWYgdGhlIGBvcHRpb25zLnJldHJ5RGVsYXlzYCBwcm9wZXJ0eSBpcyBzZXQsIHRoZSBtZXRob2Qgd2lsbFxuICAgKiBhbHNvIHJldHJ5IGlmIGFuIGVycm9yIG9jdXJycy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgdXBsb2FkJ3MgVVJMIHdoaWNoIHdpbGwgYmUgdGVybWluYXRlZC5cbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgT3B0aW9uYWwgb3B0aW9ucyBmb3IgaW5mbHVlbmNpbmcgSFRUUCByZXF1ZXN0cy5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gVGhlIFByb21pc2Ugd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSByZXF1ZXN0cyBmaW5pc2guXG4gICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKEJhc2VVcGxvYWQsIFt7XG4gICAga2V5OiBcImZpbmRQcmV2aW91c1VwbG9hZHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmluZFByZXZpb3VzVXBsb2FkcygpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmluZ2VycHJpbnQodGhpcy5maWxlLCB0aGlzLm9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGZpbmdlcnByaW50KSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5fdXJsU3RvcmFnZS5maW5kVXBsb2Fkc0J5RmluZ2VycHJpbnQoZmluZ2VycHJpbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlc3VtZUZyb21QcmV2aW91c1VwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXN1bWVGcm9tUHJldmlvdXNVcGxvYWQocHJldmlvdXNVcGxvYWQpIHtcbiAgICAgIHRoaXMudXJsID0gcHJldmlvdXNVcGxvYWQudXBsb2FkVXJsIHx8IG51bGw7XG4gICAgICB0aGlzLl9wYXJhbGxlbFVwbG9hZFVybHMgPSBwcmV2aW91c1VwbG9hZC5wYXJhbGxlbFVwbG9hZFVybHMgfHwgbnVsbDtcbiAgICAgIHRoaXMuX3VybFN0b3JhZ2VLZXkgPSBwcmV2aW91c1VwbG9hZC51cmxTdG9yYWdlS2V5O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdGFydFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgZmlsZSA9IHRoaXMuZmlsZTtcblxuICAgICAgaWYgKCFmaWxlKSB7XG4gICAgICAgIHRoaXMuX2VtaXRFcnJvcihuZXcgRXJyb3IoJ3R1czogbm8gZmlsZSBvciBzdHJlYW0gdG8gdXBsb2FkIHByb3ZpZGVkJykpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZW5kcG9pbnQgJiYgIXRoaXMub3B0aW9ucy51cGxvYWRVcmwpIHtcbiAgICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBFcnJvcigndHVzOiBuZWl0aGVyIGFuIGVuZHBvaW50IG9yIGFuIHVwbG9hZCBVUkwgaXMgcHJvdmlkZWQnKSk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmV0cnlEZWxheXMgPSB0aGlzLm9wdGlvbnMucmV0cnlEZWxheXM7XG5cbiAgICAgIGlmIChyZXRyeURlbGF5cyAhPSBudWxsICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChyZXRyeURlbGF5cykgIT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBFcnJvcigndHVzOiB0aGUgYHJldHJ5RGVsYXlzYCBvcHRpb24gbXVzdCBlaXRoZXIgYmUgYW4gYXJyYXkgb3IgbnVsbCcpKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFyYWxsZWxVcGxvYWRzID4gMSkge1xuICAgICAgICAvLyBUZXN0IHdoaWNoIG9wdGlvbnMgYXJlIGluY29tcGF0aWJsZSB3aXRoIHBhcmFsbGVsIHVwbG9hZHMuXG4gICAgICAgIFsndXBsb2FkVXJsJywgJ3VwbG9hZFNpemUnLCAndXBsb2FkTGVuZ3RoRGVmZXJyZWQnXS5mb3JFYWNoKGZ1bmN0aW9uIChvcHRpb25OYW1lKSB7XG4gICAgICAgICAgaWYgKF90aGlzMi5vcHRpb25zW29wdGlvbk5hbWVdKSB7XG4gICAgICAgICAgICBfdGhpczIuX2VtaXRFcnJvcihuZXcgRXJyb3IoXCJ0dXM6IGNhbm5vdCB1c2UgdGhlIFwiLmNvbmNhdChvcHRpb25OYW1lLCBcIiBvcHRpb24gd2hlbiBwYXJhbGxlbFVwbG9hZHMgaXMgZW5hYmxlZFwiKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5maW5nZXJwcmludChmaWxlLCB0aGlzLm9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGZpbmdlcnByaW50KSB7XG4gICAgICAgIGlmIChmaW5nZXJwcmludCA9PSBudWxsKSB7XG4gICAgICAgICAgKDAsIF9sb2dnZXIubG9nKSgnTm8gZmluZ2VycHJpbnQgd2FzIGNhbGN1bGF0ZWQgbWVhbmluZyB0aGF0IHRoZSB1cGxvYWQgY2Fubm90IGJlIHN0b3JlZCBpbiB0aGUgVVJMIHN0b3JhZ2UuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgKDAsIF9sb2dnZXIubG9nKShcIkNhbGN1bGF0ZWQgZmluZ2VycHJpbnQ6IFwiLmNvbmNhdChmaW5nZXJwcmludCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMyLl9maW5nZXJwcmludCA9IGZpbmdlcnByaW50O1xuXG4gICAgICAgIGlmIChfdGhpczIuX3NvdXJjZSkge1xuICAgICAgICAgIHJldHVybiBfdGhpczIuX3NvdXJjZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfdGhpczIub3B0aW9ucy5maWxlUmVhZGVyLm9wZW5GaWxlKGZpbGUsIF90aGlzMi5vcHRpb25zLmNodW5rU2l6ZSk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgICAgX3RoaXMyLl9zb3VyY2UgPSBzb3VyY2U7IC8vIElmIHRoZSB1cGxvYWQgd2FzIGNvbmZpZ3VyZWQgdG8gdXNlIG11bHRpcGxlIHJlcXVlc3RzIG9yIGlmIHdlIHJlc3VtZSBmcm9tXG4gICAgICAgIC8vIGFuIHVwbG9hZCB3aGljaCB1c2VkIG11bHRpcGxlIHJlcXVlc3RzLCB3ZSBzdGFydCBhIHBhcmFsbGVsIHVwbG9hZC5cblxuICAgICAgICBpZiAoX3RoaXMyLm9wdGlvbnMucGFyYWxsZWxVcGxvYWRzID4gMSB8fCBfdGhpczIuX3BhcmFsbGVsVXBsb2FkVXJscyAhPSBudWxsKSB7XG4gICAgICAgICAgX3RoaXMyLl9zdGFydFBhcmFsbGVsVXBsb2FkKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3RoaXMyLl9zdGFydFNpbmdsZVVwbG9hZCgpO1xuICAgICAgICB9XG4gICAgICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgX3RoaXMyLl9lbWl0RXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbml0aWF0ZSB0aGUgdXBsb2FkaW5nIHByb2NlZHVyZSBmb3IgYSBwYXJhbGxlbGl6ZWQgdXBsb2FkLCB3aGVyZSBvbmUgZmlsZSBpcyBzcGxpdCBpbnRvXG4gICAgICogbXVsdGlwbGUgcmVxdWVzdCB3aGljaCBhcmUgcnVuIGluIHBhcmFsbGVsLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfc3RhcnRQYXJhbGxlbFVwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfc3RhcnRQYXJhbGxlbFVwbG9hZCgpIHtcbiAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICB2YXIgdG90YWxTaXplID0gdGhpcy5fc2l6ZSA9IHRoaXMuX3NvdXJjZS5zaXplO1xuICAgICAgdmFyIHRvdGFsUHJvZ3Jlc3MgPSAwO1xuICAgICAgdGhpcy5fcGFyYWxsZWxVcGxvYWRzID0gW107XG4gICAgICB2YXIgcGFydENvdW50ID0gdGhpcy5fcGFyYWxsZWxVcGxvYWRVcmxzICE9IG51bGwgPyB0aGlzLl9wYXJhbGxlbFVwbG9hZFVybHMubGVuZ3RoIDogdGhpcy5vcHRpb25zLnBhcmFsbGVsVXBsb2FkczsgLy8gVGhlIGlucHV0IGZpbGUgd2lsbCBiZSBzcGxpdCBpbnRvIG11bHRpcGxlIHNsaWNlcyB3aGljaCBhcmUgdXBsb2FkZWQgaW4gc2VwYXJhdGVcbiAgICAgIC8vIHJlcXVlc3RzLiBIZXJlIHdlIGdlbmVyYXRlIHRoZSBzdGFydCBhbmQgZW5kIHBvc2l0aW9uIGZvciB0aGUgc2xpY2VzLlxuXG4gICAgICB2YXIgcGFydHMgPSBzcGxpdFNpemVJbnRvUGFydHModGhpcy5fc291cmNlLnNpemUsIHBhcnRDb3VudCwgdGhpcy5fcGFyYWxsZWxVcGxvYWRVcmxzKTsgLy8gQ3JlYXRlIGFuIGVtcHR5IGxpc3QgZm9yIHN0b3JpbmcgdGhlIHVwbG9hZCBVUkxzXG5cbiAgICAgIHRoaXMuX3BhcmFsbGVsVXBsb2FkVXJscyA9IG5ldyBBcnJheShwYXJ0cy5sZW5ndGgpOyAvLyBHZW5lcmF0ZSBhIHByb21pc2UgZm9yIGVhY2ggc2xpY2UgdGhhdCB3aWxsIGJlIHJlc29sdmUgaWYgdGhlIHJlc3BlY3RpdmVcbiAgICAgIC8vIHVwbG9hZCBpcyBjb21wbGV0ZWQuXG5cbiAgICAgIHZhciB1cGxvYWRzID0gcGFydHMubWFwKGZ1bmN0aW9uIChwYXJ0LCBpbmRleCkge1xuICAgICAgICB2YXIgbGFzdFBhcnRQcm9ncmVzcyA9IDA7XG4gICAgICAgIHJldHVybiBfdGhpczMuX3NvdXJjZS5zbGljZShwYXJ0LnN0YXJ0LCBwYXJ0LmVuZCkudGhlbihmdW5jdGlvbiAoX3JlZikge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IF9yZWYudmFsdWU7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIC8vIE1lcmdlIHdpdGggdGhlIHVzZXIgc3VwcGxpZWQgb3B0aW9ucyBidXQgb3ZlcndyaXRlIHNvbWUgdmFsdWVzLlxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBfb2JqZWN0U3ByZWFkKHt9LCBfdGhpczMub3B0aW9ucywge1xuICAgICAgICAgICAgICAvLyBJZiBhdmFpbGFibGUsIHRoZSBwYXJ0aWFsIHVwbG9hZCBzaG91bGQgYmUgcmVzdW1lZCBmcm9tIGEgcHJldmlvdXMgVVJMLlxuICAgICAgICAgICAgICB1cGxvYWRVcmw6IHBhcnQudXBsb2FkVXJsIHx8IG51bGwsXG4gICAgICAgICAgICAgIC8vIFdlIHRha2UgbWFudWFsbHkgY2FyZSBvZiByZXN1bWluZyBmb3IgcGFydGlhbCB1cGxvYWRzLCBzbyB0aGV5IHNob3VsZFxuICAgICAgICAgICAgICAvLyBub3QgYmUgc3RvcmVkIGluIHRoZSBVUkwgc3RvcmFnZS5cbiAgICAgICAgICAgICAgc3RvcmVGaW5nZXJwcmludEZvclJlc3VtaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgcmVtb3ZlRmluZ2VycHJpbnRPblN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAvLyBSZXNldCB0aGUgcGFyYWxsZWxVcGxvYWRzIG9wdGlvbiB0byBub3QgY2F1c2UgcmVjdXJzaW9uLlxuICAgICAgICAgICAgICBwYXJhbGxlbFVwbG9hZHM6IDEsXG4gICAgICAgICAgICAgIG1ldGFkYXRhOiB7fSxcbiAgICAgICAgICAgICAgLy8gQWRkIHRoZSBoZWFkZXIgdG8gaW5kaWNhdGUgdGhlIHRoaXMgaXMgYSBwYXJ0aWFsIHVwbG9hZC5cbiAgICAgICAgICAgICAgaGVhZGVyczogX29iamVjdFNwcmVhZCh7fSwgX3RoaXMzLm9wdGlvbnMuaGVhZGVycywge1xuICAgICAgICAgICAgICAgICdVcGxvYWQtQ29uY2F0JzogJ3BhcnRpYWwnXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAvLyBSZWplY3Qgb3IgcmVzb2x2ZSB0aGUgcHJvbWlzZSBpZiB0aGUgdXBsb2FkIGVycm9ycyBvciBjb21wbGV0ZXMuXG4gICAgICAgICAgICAgIG9uU3VjY2VzczogcmVzb2x2ZSxcbiAgICAgICAgICAgICAgb25FcnJvcjogcmVqZWN0LFxuICAgICAgICAgICAgICAvLyBCYXNlZCBpbiB0aGUgcHJvZ3Jlc3MgZm9yIHRoaXMgcGFydGlhbCB1cGxvYWQsIGNhbGN1bGF0ZSB0aGUgcHJvZ3Jlc3NcbiAgICAgICAgICAgICAgLy8gZm9yIHRoZSBlbnRpcmUgZmluYWwgdXBsb2FkLlxuICAgICAgICAgICAgICBvblByb2dyZXNzOiBmdW5jdGlvbiBvblByb2dyZXNzKG5ld1BhcnRQcm9ncmVzcykge1xuICAgICAgICAgICAgICAgIHRvdGFsUHJvZ3Jlc3MgPSB0b3RhbFByb2dyZXNzIC0gbGFzdFBhcnRQcm9ncmVzcyArIG5ld1BhcnRQcm9ncmVzcztcbiAgICAgICAgICAgICAgICBsYXN0UGFydFByb2dyZXNzID0gbmV3UGFydFByb2dyZXNzO1xuXG4gICAgICAgICAgICAgICAgX3RoaXMzLl9lbWl0UHJvZ3Jlc3ModG90YWxQcm9ncmVzcywgdG90YWxTaXplKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgLy8gV2FpdCB1bnRpbCBldmVyeSBwYXJ0aWFsIHVwbG9hZCBoYXMgYW4gdXBsb2FkIFVSTCwgc28gd2UgY2FuIGFkZFxuICAgICAgICAgICAgICAvLyB0aGVtIHRvIHRoZSBVUkwgc3RvcmFnZS5cbiAgICAgICAgICAgICAgX29uVXBsb2FkVXJsQXZhaWxhYmxlOiBmdW5jdGlvbiBfb25VcGxvYWRVcmxBdmFpbGFibGUoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMzLl9wYXJhbGxlbFVwbG9hZFVybHNbaW5kZXhdID0gdXBsb2FkLnVybDsgLy8gVGVzdCBpZiBhbGwgdXBsb2FkcyBoYXZlIHJlY2VpdmVkIGFuIFVSTFxuXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzMy5fcGFyYWxsZWxVcGxvYWRVcmxzLmZpbHRlcihmdW5jdGlvbiAodSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICEhdTtcbiAgICAgICAgICAgICAgICB9KS5sZW5ndGggPT09IHBhcnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgX3RoaXMzLl9zYXZlVXBsb2FkSW5VcmxTdG9yYWdlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHVwbG9hZCA9IG5ldyBCYXNlVXBsb2FkKHZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHVwbG9hZC5zdGFydCgpOyAvLyBTdG9yZSB0aGUgdXBsb2FkIGluIGFuIGFycmF5LCBzbyB3ZSBjYW4gbGF0ZXIgYWJvcnQgdGhlbSBpZiBuZWNlc3NhcnkuXG5cbiAgICAgICAgICAgIF90aGlzMy5fcGFyYWxsZWxVcGxvYWRzLnB1c2godXBsb2FkKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHZhciByZXE7IC8vIFdhaXQgdW50aWwgYWxsIHBhcnRpYWwgdXBsb2FkcyBhcmUgZmluaXNoZWQgYW5kIHdlIGNhbiBzZW5kIHRoZSBQT1NUIHJlcXVlc3QgZm9yXG4gICAgICAvLyBjcmVhdGluZyB0aGUgZmluYWwgdXBsb2FkLlxuXG4gICAgICBQcm9taXNlLmFsbCh1cGxvYWRzKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVxID0gX3RoaXMzLl9vcGVuUmVxdWVzdCgnUE9TVCcsIF90aGlzMy5vcHRpb25zLmVuZHBvaW50KTtcbiAgICAgICAgcmVxLnNldEhlYWRlcignVXBsb2FkLUNvbmNhdCcsIFwiZmluYWw7XCIuY29uY2F0KF90aGlzMy5fcGFyYWxsZWxVcGxvYWRVcmxzLmpvaW4oJyAnKSkpOyAvLyBBZGQgbWV0YWRhdGEgaWYgdmFsdWVzIGhhdmUgYmVlbiBhZGRlZFxuXG4gICAgICAgIHZhciBtZXRhZGF0YSA9IGVuY29kZU1ldGFkYXRhKF90aGlzMy5vcHRpb25zLm1ldGFkYXRhKTtcblxuICAgICAgICBpZiAobWV0YWRhdGEgIT09ICcnKSB7XG4gICAgICAgICAgcmVxLnNldEhlYWRlcignVXBsb2FkLU1ldGFkYXRhJywgbWV0YWRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF90aGlzMy5fc2VuZFJlcXVlc3QocmVxLCBudWxsKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAoIWluU3RhdHVzQ2F0ZWdvcnkocmVzLmdldFN0YXR1cygpLCAyMDApKSB7XG4gICAgICAgICAgX3RoaXMzLl9lbWl0SHR0cEVycm9yKHJlcSwgcmVzLCAndHVzOiB1bmV4cGVjdGVkIHJlc3BvbnNlIHdoaWxlIGNyZWF0aW5nIHVwbG9hZCcpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxvY2F0aW9uID0gcmVzLmdldEhlYWRlcignTG9jYXRpb24nKTtcblxuICAgICAgICBpZiAobG9jYXRpb24gPT0gbnVsbCkge1xuICAgICAgICAgIF90aGlzMy5fZW1pdEh0dHBFcnJvcihyZXEsIHJlcywgJ3R1czogaW52YWxpZCBvciBtaXNzaW5nIExvY2F0aW9uIGhlYWRlcicpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMzLnVybCA9IHJlc29sdmVVcmwoX3RoaXMzLm9wdGlvbnMuZW5kcG9pbnQsIGxvY2F0aW9uKTtcbiAgICAgICAgKDAsIF9sb2dnZXIubG9nKShcIkNyZWF0ZWQgdXBsb2FkIGF0IFwiLmNvbmNhdChfdGhpczMudXJsKSk7XG5cbiAgICAgICAgX3RoaXMzLl9lbWl0U3VjY2VzcygpO1xuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzMy5fZW1pdEVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5pdGlhdGUgdGhlIHVwbG9hZGluZyBwcm9jZWR1cmUgZm9yIGEgbm9uLXBhcmFsbGVsIHVwbG9hZC4gSGVyZSB0aGUgZW50aXJlIGZpbGUgaXNcbiAgICAgKiB1cGxvYWRlZCBpbiBhIHNlcXVlbnRpYWwgbWF0dGVyLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfc3RhcnRTaW5nbGVVcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3N0YXJ0U2luZ2xlVXBsb2FkKCkge1xuICAgICAgLy8gRmlyc3QsIHdlIGxvb2sgYXQgdGhlIHVwbG9hZExlbmd0aERlZmVycmVkIG9wdGlvbi5cbiAgICAgIC8vIE5leHQsIHdlIGNoZWNrIGlmIHRoZSBjYWxsZXIgaGFzIHN1cHBsaWVkIGEgbWFudWFsIHVwbG9hZCBzaXplLlxuICAgICAgLy8gRmluYWxseSwgd2UgdHJ5IHRvIHVzZSB0aGUgY2FsY3VsYXRlZCBzaXplIGZyb20gdGhlIHNvdXJjZSBvYmplY3QuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZExlbmd0aERlZmVycmVkKSB7XG4gICAgICAgIHRoaXMuX3NpemUgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkU2l6ZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3NpemUgPSArdGhpcy5vcHRpb25zLnVwbG9hZFNpemU7XG5cbiAgICAgICAgaWYgKGlzTmFOKHRoaXMuX3NpemUpKSB7XG4gICAgICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBFcnJvcigndHVzOiBjYW5ub3QgY29udmVydCBgdXBsb2FkU2l6ZWAgb3B0aW9uIGludG8gYSBudW1iZXInKSk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NpemUgPSB0aGlzLl9zb3VyY2Uuc2l6ZTtcblxuICAgICAgICBpZiAodGhpcy5fc2l6ZSA9PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBFcnJvcihcInR1czogY2Fubm90IGF1dG9tYXRpY2FsbHkgZGVyaXZlIHVwbG9hZCdzIHNpemUgZnJvbSBpbnB1dCBhbmQgbXVzdCBiZSBzcGVjaWZpZWQgbWFudWFsbHkgdXNpbmcgdGhlIGB1cGxvYWRTaXplYCBvcHRpb25cIikpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IC8vIFJlc2V0IHRoZSBhYm9ydGVkIGZsYWcgd2hlbiB0aGUgdXBsb2FkIGlzIHN0YXJ0ZWQgb3IgZWxzZSB0aGVcbiAgICAgIC8vIF9wZXJmb3JtVXBsb2FkIHdpbGwgc3RvcCBiZWZvcmUgc2VuZGluZyBhIHJlcXVlc3QgaWYgdGhlIHVwbG9hZCBoYXMgYmVlblxuICAgICAgLy8gYWJvcnRlZCBwcmV2aW91c2x5LlxuXG5cbiAgICAgIHRoaXMuX2Fib3J0ZWQgPSBmYWxzZTsgLy8gVGhlIHVwbG9hZCBoYWQgYmVlbiBzdGFydGVkIHByZXZpb3VzbHkgYW5kIHdlIHNob3VsZCByZXVzZSB0aGlzIFVSTC5cblxuICAgICAgaWYgKHRoaXMudXJsICE9IG51bGwpIHtcbiAgICAgICAgKDAsIF9sb2dnZXIubG9nKShcIlJlc3VtaW5nIHVwbG9hZCBmcm9tIHByZXZpb3VzIFVSTDogXCIuY29uY2F0KHRoaXMudXJsKSk7XG5cbiAgICAgICAgdGhpcy5fcmVzdW1lVXBsb2FkKCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSAvLyBBIFVSTCBoYXMgbWFudWFsbHkgYmVlbiBzcGVjaWZpZWQsIHNvIHdlIHRyeSB0byByZXN1bWVcblxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZFVybCAhPSBudWxsKSB7XG4gICAgICAgICgwLCBfbG9nZ2VyLmxvZykoXCJSZXN1bWluZyB1cGxvYWQgZnJvbSBwcm92aWRlZCBVUkw6IFwiLmNvbmNhdCh0aGlzLm9wdGlvbnMudXJsKSk7XG4gICAgICAgIHRoaXMudXJsID0gdGhpcy5vcHRpb25zLnVwbG9hZFVybDtcblxuICAgICAgICB0aGlzLl9yZXN1bWVVcGxvYWQoKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9IC8vIEFuIHVwbG9hZCBoYXMgbm90IHN0YXJ0ZWQgZm9yIHRoZSBmaWxlIHlldCwgc28gd2Ugc3RhcnQgYSBuZXcgb25lXG5cblxuICAgICAgKDAsIF9sb2dnZXIubG9nKSgnQ3JlYXRpbmcgYSBuZXcgdXBsb2FkJyk7XG5cbiAgICAgIHRoaXMuX2NyZWF0ZVVwbG9hZCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBYm9ydCBhbnkgcnVubmluZyByZXF1ZXN0IGFuZCBzdG9wIHRoZSBjdXJyZW50IHVwbG9hZC4gQWZ0ZXIgYWJvcnQgaXMgY2FsbGVkLCBubyBldmVudFxuICAgICAqIGhhbmRsZXIgd2lsbCBiZSBpbnZva2VkIGFueW1vcmUuIFlvdSBjYW4gdXNlIHRoZSBgc3RhcnRgIG1ldGhvZCB0byByZXN1bWUgdGhlIHVwbG9hZFxuICAgICAqIGFnYWluLlxuICAgICAqIElmIGBzaG91bGRUZXJtaW5hdGVgIGlzIHRydWUsIHRoZSBgdGVybWluYXRlYCBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB0byByZW1vdmUgdGhlXG4gICAgICogY3VycmVudCB1cGxvYWQgZnJvbSB0aGUgc2VydmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSBzaG91bGRUZXJtaW5hdGUgVHJ1ZSBpZiB0aGUgdXBsb2FkIHNob3VsZCBiZSBkZWxldGVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkL3JlamVjdGVkIHdoZW4gdGhlIHJlcXVlc3RzIGZpbmlzaC5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImFib3J0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFib3J0KHNob3VsZFRlcm1pbmF0ZSkge1xuICAgICAgdmFyIF90aGlzNCA9IHRoaXM7IC8vIENvdW50IHRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIHNlZSBpZiBhIGNhbGxiYWNrIGlzIGJlaW5nIHByb3ZpZGVkIGluIHRoZSBvbGQgc3R5bGUgcmVxdWlyZWQgYnkgdHVzLWpzLWNsaWVudCAxLngsIHRoZW4gdGhyb3cgYW4gZXJyb3IgaWYgaXQgaXMuXG4gICAgICAvLyBgYXJndW1lbnRzYCBpcyBhIEphdmFTY3JpcHQgYnVpbHQtaW4gdmFyaWFibGUgdGhhdCBjb250YWlucyBhbGwgb2YgdGhlIGZ1bmN0aW9uJ3MgYXJndW1lbnRzLlxuXG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSAmJiB0eXBlb2YgYXJndW1lbnRzWzFdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndHVzOiB0aGUgYWJvcnQgZnVuY3Rpb24gZG9lcyBub3QgYWNjZXB0IGEgY2FsbGJhY2sgc2luY2UgdjIgYW55bW9yZTsgcGxlYXNlIHVzZSB0aGUgcmV0dXJuZWQgUHJvbWlzZSBpbnN0ZWFkJyk7XG4gICAgICB9IC8vIFN0b3AgYW55IHBhcmFsbGVsIHBhcnRpYWwgdXBsb2FkcywgdGhhdCBoYXZlIGJlZW4gc3RhcnRlZCBpbiBfc3RhcnRQYXJhbGxlbFVwbG9hZHMuXG5cblxuICAgICAgaWYgKHRoaXMuX3BhcmFsbGVsVXBsb2FkcyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3BhcmFsbGVsVXBsb2Fkcy5mb3JFYWNoKGZ1bmN0aW9uICh1cGxvYWQpIHtcbiAgICAgICAgICB1cGxvYWQuYWJvcnQoc2hvdWxkVGVybWluYXRlKTtcbiAgICAgICAgfSk7XG4gICAgICB9IC8vIFN0b3AgYW55IGN1cnJlbnQgcnVubmluZyByZXF1ZXN0LlxuXG5cbiAgICAgIGlmICh0aGlzLl9yZXEgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fcmVxLmFib3J0KCk7XG5cbiAgICAgICAgdGhpcy5fc291cmNlLmNsb3NlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2Fib3J0ZWQgPSB0cnVlOyAvLyBTdG9wIGFueSB0aW1lb3V0IHVzZWQgZm9yIGluaXRpYXRpbmcgYSByZXRyeS5cblxuICAgICAgaWYgKHRoaXMuX3JldHJ5VGltZW91dCAhPSBudWxsKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZXRyeVRpbWVvdXQpO1xuICAgICAgICB0aGlzLl9yZXRyeVRpbWVvdXQgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXNob3VsZFRlcm1pbmF0ZSB8fCB0aGlzLnVybCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIEJhc2VVcGxvYWQudGVybWluYXRlKHRoaXMudXJsLCB0aGlzLm9wdGlvbnMpIC8vIFJlbW92ZSBlbnRyeSBmcm9tIHRoZSBVUkwgc3RvcmFnZSBzaW5jZSB0aGUgdXBsb2FkIFVSTCBpcyBubyBsb25nZXIgdmFsaWQuXG4gICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfdGhpczQuX3JlbW92ZUZyb21VcmxTdG9yYWdlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2VtaXRIdHRwRXJyb3JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsIG1lc3NhZ2UsIGNhdXNpbmdFcnIpIHtcbiAgICAgIHRoaXMuX2VtaXRFcnJvcihuZXcgX2Vycm9yLmRlZmF1bHQobWVzc2FnZSwgY2F1c2luZ0VyciwgcmVxLCByZXMpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2VtaXRFcnJvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZW1pdEVycm9yKGVycikge1xuICAgICAgdmFyIF90aGlzNSA9IHRoaXM7IC8vIERvIG5vdCBlbWl0IGVycm9ycywgZS5nLiBmcm9tIGFib3J0ZWQgSFRUUCByZXF1ZXN0cywgaWYgdGhlIHVwbG9hZCBoYXMgYmVlbiBzdG9wcGVkLlxuXG5cbiAgICAgIGlmICh0aGlzLl9hYm9ydGVkKSByZXR1cm47IC8vIENoZWNrIGlmIHdlIHNob3VsZCByZXRyeSwgd2hlbiBlbmFibGVkLCBiZWZvcmUgc2VuZGluZyB0aGUgZXJyb3IgdG8gdGhlIHVzZXIuXG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmV0cnlEZWxheXMgIT0gbnVsbCkge1xuICAgICAgICAvLyBXZSB3aWxsIHJlc2V0IHRoZSBhdHRlbXB0IGNvdW50ZXIgaWZcbiAgICAgICAgLy8gLSB3ZSB3ZXJlIGFscmVhZHkgYWJsZSB0byBjb25uZWN0IHRvIHRoZSBzZXJ2ZXIgKG9mZnNldCAhPSBudWxsKSBhbmRcbiAgICAgICAgLy8gLSB3ZSB3ZXJlIGFibGUgdG8gdXBsb2FkIGEgc21hbGwgY2h1bmsgb2YgZGF0YSB0byB0aGUgc2VydmVyXG4gICAgICAgIHZhciBzaG91bGRSZXNldERlbGF5cyA9IHRoaXMuX29mZnNldCAhPSBudWxsICYmIHRoaXMuX29mZnNldCA+IHRoaXMuX29mZnNldEJlZm9yZVJldHJ5O1xuXG4gICAgICAgIGlmIChzaG91bGRSZXNldERlbGF5cykge1xuICAgICAgICAgIHRoaXMuX3JldHJ5QXR0ZW1wdCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2hvdWxkUmV0cnkoZXJyLCB0aGlzLl9yZXRyeUF0dGVtcHQsIHRoaXMub3B0aW9ucykpIHtcbiAgICAgICAgICB2YXIgZGVsYXkgPSB0aGlzLm9wdGlvbnMucmV0cnlEZWxheXNbdGhpcy5fcmV0cnlBdHRlbXB0KytdO1xuICAgICAgICAgIHRoaXMuX29mZnNldEJlZm9yZVJldHJ5ID0gdGhpcy5fb2Zmc2V0O1xuICAgICAgICAgIHRoaXMuX3JldHJ5VGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXM1LnN0YXJ0KCk7XG4gICAgICAgICAgfSwgZGVsYXkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbkVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5vbkVycm9yKGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFB1Ymxpc2hlcyBub3RpZmljYXRpb24gaWYgdGhlIHVwbG9hZCBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgY29tcGxldGVkLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfZW1pdFN1Y2Nlc3NcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2VtaXRTdWNjZXNzKCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdmVGaW5nZXJwcmludE9uU3VjY2Vzcykge1xuICAgICAgICAvLyBSZW1vdmUgc3RvcmVkIGZpbmdlcnByaW50IGFuZCBjb3JyZXNwb25kaW5nIGVuZHBvaW50LiBUaGlzIGNhdXNlc1xuICAgICAgICAvLyBuZXcgdXBsb2FkcyBvZiB0aGUgc2FtZSBmaWxlIHRvIGJlIHRyZWF0ZWQgYXMgYSBkaWZmZXJlbnQgZmlsZS5cbiAgICAgICAgdGhpcy5fcmVtb3ZlRnJvbVVybFN0b3JhZ2UoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25TdWNjZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5vblN1Y2Nlc3MoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUHVibGlzaGVzIG5vdGlmaWNhdGlvbiB3aGVuIGRhdGEgaGFzIGJlZW4gc2VudCB0byB0aGUgc2VydmVyLiBUaGlzXG4gICAgICogZGF0YSBtYXkgbm90IGhhdmUgYmVlbiBhY2NlcHRlZCBieSB0aGUgc2VydmVyIHlldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBieXRlc1NlbnQgIE51bWJlciBvZiBieXRlcyBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVzVG90YWwgVG90YWwgbnVtYmVyIG9mIGJ5dGVzIHRvIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9lbWl0UHJvZ3Jlc3NcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2VtaXRQcm9ncmVzcyhieXRlc1NlbnQsIGJ5dGVzVG90YWwpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLm9uUHJvZ3Jlc3MoYnl0ZXNTZW50LCBieXRlc1RvdGFsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUHVibGlzaGVzIG5vdGlmaWNhdGlvbiB3aGVuIGEgY2h1bmsgb2YgZGF0YSBoYXMgYmVlbiBzZW50IHRvIHRoZSBzZXJ2ZXJcbiAgICAgKiBhbmQgYWNjZXB0ZWQgYnkgdGhlIHNlcnZlci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY2h1bmtTaXplICBTaXplIG9mIHRoZSBjaHVuayB0aGF0IHdhcyBhY2NlcHRlZCBieSB0aGUgc2VydmVyLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBieXRlc0FjY2VwdGVkIFRvdGFsIG51bWJlciBvZiBieXRlcyB0aGF0IGhhdmUgYmVlblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2NlcHRlZCBieSB0aGUgc2VydmVyLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBieXRlc1RvdGFsIFRvdGFsIG51bWJlciBvZiBieXRlcyB0byBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfZW1pdENodW5rQ29tcGxldGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2VtaXRDaHVua0NvbXBsZXRlKGNodW5rU2l6ZSwgYnl0ZXNBY2NlcHRlZCwgYnl0ZXNUb3RhbCkge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25DaHVua0NvbXBsZXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5vbkNodW5rQ29tcGxldGUoY2h1bmtTaXplLCBieXRlc0FjY2VwdGVkLCBieXRlc1RvdGFsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IHVwbG9hZCB1c2luZyB0aGUgY3JlYXRpb24gZXh0ZW5zaW9uIGJ5IHNlbmRpbmcgYSBQT1NUXG4gICAgICogcmVxdWVzdCB0byB0aGUgZW5kcG9pbnQuIEFmdGVyIHN1Y2Nlc3NmdWwgY3JlYXRpb24gdGhlIGZpbGUgd2lsbCBiZVxuICAgICAqIHVwbG9hZGVkXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9jcmVhdGVVcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2NyZWF0ZVVwbG9hZCgpIHtcbiAgICAgIHZhciBfdGhpczYgPSB0aGlzO1xuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbmRwb2ludCkge1xuICAgICAgICB0aGlzLl9lbWl0RXJyb3IobmV3IEVycm9yKCd0dXM6IHVuYWJsZSB0byBjcmVhdGUgdXBsb2FkIGJlY2F1c2Ugbm8gZW5kcG9pbnQgaXMgcHJvdmlkZWQnKSk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVxID0gdGhpcy5fb3BlblJlcXVlc3QoJ1BPU1QnLCB0aGlzLm9wdGlvbnMuZW5kcG9pbnQpO1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZExlbmd0aERlZmVycmVkKSB7XG4gICAgICAgIHJlcS5zZXRIZWFkZXIoJ1VwbG9hZC1EZWZlci1MZW5ndGgnLCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcS5zZXRIZWFkZXIoJ1VwbG9hZC1MZW5ndGgnLCB0aGlzLl9zaXplKTtcbiAgICAgIH0gLy8gQWRkIG1ldGFkYXRhIGlmIHZhbHVlcyBoYXZlIGJlZW4gYWRkZWRcblxuXG4gICAgICB2YXIgbWV0YWRhdGEgPSBlbmNvZGVNZXRhZGF0YSh0aGlzLm9wdGlvbnMubWV0YWRhdGEpO1xuXG4gICAgICBpZiAobWV0YWRhdGEgIT09ICcnKSB7XG4gICAgICAgIHJlcS5zZXRIZWFkZXIoJ1VwbG9hZC1NZXRhZGF0YScsIG1ldGFkYXRhKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHByb21pc2U7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkRGF0YUR1cmluZ0NyZWF0aW9uICYmICF0aGlzLm9wdGlvbnMudXBsb2FkTGVuZ3RoRGVmZXJyZWQpIHtcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICAgICAgcHJvbWlzZSA9IHRoaXMuX2FkZENodW5rVG9SZXF1ZXN0KHJlcSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9taXNlID0gdGhpcy5fc2VuZFJlcXVlc3QocmVxLCBudWxsKTtcbiAgICAgIH1cblxuICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKCFpblN0YXR1c0NhdGVnb3J5KHJlcy5nZXRTdGF0dXMoKSwgMjAwKSkge1xuICAgICAgICAgIF90aGlzNi5fZW1pdEh0dHBFcnJvcihyZXEsIHJlcywgJ3R1czogdW5leHBlY3RlZCByZXNwb25zZSB3aGlsZSBjcmVhdGluZyB1cGxvYWQnKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2NhdGlvbiA9IHJlcy5nZXRIZWFkZXIoJ0xvY2F0aW9uJyk7XG5cbiAgICAgICAgaWYgKGxvY2F0aW9uID09IG51bGwpIHtcbiAgICAgICAgICBfdGhpczYuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsICd0dXM6IGludmFsaWQgb3IgbWlzc2luZyBMb2NhdGlvbiBoZWFkZXInKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzNi51cmwgPSByZXNvbHZlVXJsKF90aGlzNi5vcHRpb25zLmVuZHBvaW50LCBsb2NhdGlvbik7XG4gICAgICAgICgwLCBfbG9nZ2VyLmxvZykoXCJDcmVhdGVkIHVwbG9hZCBhdCBcIi5jb25jYXQoX3RoaXM2LnVybCkpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgX3RoaXM2Lm9wdGlvbnMuX29uVXBsb2FkVXJsQXZhaWxhYmxlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgX3RoaXM2Lm9wdGlvbnMuX29uVXBsb2FkVXJsQXZhaWxhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3RoaXM2Ll9zaXplID09PSAwKSB7XG4gICAgICAgICAgLy8gTm90aGluZyB0byB1cGxvYWQgYW5kIGZpbGUgd2FzIHN1Y2Nlc3NmdWxseSBjcmVhdGVkXG4gICAgICAgICAgX3RoaXM2Ll9lbWl0U3VjY2VzcygpO1xuXG4gICAgICAgICAgX3RoaXM2Ll9zb3VyY2UuY2xvc2UoKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzNi5fc2F2ZVVwbG9hZEluVXJsU3RvcmFnZSgpO1xuXG4gICAgICAgIGlmIChfdGhpczYub3B0aW9ucy51cGxvYWREYXRhRHVyaW5nQ3JlYXRpb24pIHtcbiAgICAgICAgICBfdGhpczYuX2hhbmRsZVVwbG9hZFJlc3BvbnNlKHJlcSwgcmVzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfdGhpczYuX29mZnNldCA9IDA7XG5cbiAgICAgICAgICBfdGhpczYuX3BlcmZvcm1VcGxvYWQoKTtcbiAgICAgICAgfVxuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzNi5fZW1pdEh0dHBFcnJvcihyZXEsIG51bGwsICd0dXM6IGZhaWxlZCB0byBjcmVhdGUgdXBsb2FkJywgZXJyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvKlxuICAgICAqIFRyeSB0byByZXN1bWUgYW4gZXhpc3RpbmcgdXBsb2FkLiBGaXJzdCBhIEhFQUQgcmVxdWVzdCB3aWxsIGJlIHNlbnRcbiAgICAgKiB0byByZXRyaWV2ZSB0aGUgb2Zmc2V0LiBJZiB0aGUgcmVxdWVzdCBmYWlscyBhIG5ldyB1cGxvYWQgd2lsbCBiZVxuICAgICAqIGNyZWF0ZWQuIEluIHRoZSBjYXNlIG9mIGEgc3VjY2Vzc2Z1bCByZXNwb25zZSB0aGUgZmlsZSB3aWxsIGJlIHVwbG9hZGVkLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfcmVzdW1lVXBsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9yZXN1bWVVcGxvYWQoKSB7XG4gICAgICB2YXIgX3RoaXM3ID0gdGhpcztcblxuICAgICAgdmFyIHJlcSA9IHRoaXMuX29wZW5SZXF1ZXN0KCdIRUFEJywgdGhpcy51cmwpO1xuXG4gICAgICB2YXIgcHJvbWlzZSA9IHRoaXMuX3NlbmRSZXF1ZXN0KHJlcSwgbnVsbCk7XG5cbiAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHZhciBzdGF0dXMgPSByZXMuZ2V0U3RhdHVzKCk7XG5cbiAgICAgICAgaWYgKCFpblN0YXR1c0NhdGVnb3J5KHN0YXR1cywgMjAwKSkge1xuICAgICAgICAgIGlmIChpblN0YXR1c0NhdGVnb3J5KHN0YXR1cywgNDAwKSkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHN0b3JlZCBmaW5nZXJwcmludCBhbmQgY29ycmVzcG9uZGluZyBlbmRwb2ludCxcbiAgICAgICAgICAgIC8vIG9uIGNsaWVudCBlcnJvcnMgc2luY2UgdGhlIGZpbGUgY2FuIG5vdCBiZSBmb3VuZFxuICAgICAgICAgICAgX3RoaXM3Ll9yZW1vdmVGcm9tVXJsU3RvcmFnZSgpO1xuICAgICAgICAgIH0gLy8gSWYgdGhlIHVwbG9hZCBpcyBsb2NrZWQgKGluZGljYXRlZCBieSB0aGUgNDIzIExvY2tlZCBzdGF0dXMgY29kZSksIHdlXG4gICAgICAgICAgLy8gZW1pdCBhbiBlcnJvciBpbnN0ZWFkIG9mIGRpcmVjdGx5IHN0YXJ0aW5nIGEgbmV3IHVwbG9hZC4gVGhpcyB3YXkgdGhlXG4gICAgICAgICAgLy8gcmV0cnkgbG9naWMgY2FuIGNhdGNoIHRoZSBlcnJvciBhbmQgd2lsbCByZXRyeSB0aGUgdXBsb2FkLiBBbiB1cGxvYWRcbiAgICAgICAgICAvLyBpcyB1c3VhbGx5IGxvY2tlZCBmb3IgYSBzaG9ydCBwZXJpb2Qgb2YgdGltZSBhbmQgd2lsbCBiZSBhdmFpbGFibGVcbiAgICAgICAgICAvLyBhZnRlcndhcmRzLlxuXG5cbiAgICAgICAgICBpZiAoc3RhdHVzID09PSA0MjMpIHtcbiAgICAgICAgICAgIF90aGlzNy5fZW1pdEh0dHBFcnJvcihyZXEsIHJlcywgJ3R1czogdXBsb2FkIGlzIGN1cnJlbnRseSBsb2NrZWQ7IHJldHJ5IGxhdGVyJyk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIV90aGlzNy5vcHRpb25zLmVuZHBvaW50KSB7XG4gICAgICAgICAgICAvLyBEb24ndCBhdHRlbXB0IHRvIGNyZWF0ZSBhIG5ldyB1cGxvYWQgaWYgbm8gZW5kcG9pbnQgaXMgcHJvdmlkZWQuXG4gICAgICAgICAgICBfdGhpczcuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsICd0dXM6IHVuYWJsZSB0byByZXN1bWUgdXBsb2FkIChuZXcgdXBsb2FkIGNhbm5vdCBiZSBjcmVhdGVkIHdpdGhvdXQgYW4gZW5kcG9pbnQpJyk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IC8vIFRyeSB0byBjcmVhdGUgYSBuZXcgdXBsb2FkXG5cblxuICAgICAgICAgIF90aGlzNy51cmwgPSBudWxsO1xuXG4gICAgICAgICAgX3RoaXM3Ll9jcmVhdGVVcGxvYWQoKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvZmZzZXQgPSBwYXJzZUludChyZXMuZ2V0SGVhZGVyKCdVcGxvYWQtT2Zmc2V0JyksIDEwKTtcblxuICAgICAgICBpZiAoaXNOYU4ob2Zmc2V0KSkge1xuICAgICAgICAgIF90aGlzNy5fZW1pdEh0dHBFcnJvcihyZXEsIHJlcywgJ3R1czogaW52YWxpZCBvciBtaXNzaW5nIG9mZnNldCB2YWx1ZScpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxlbmd0aCA9IHBhcnNlSW50KHJlcy5nZXRIZWFkZXIoJ1VwbG9hZC1MZW5ndGgnKSwgMTApO1xuXG4gICAgICAgIGlmIChpc05hTihsZW5ndGgpICYmICFfdGhpczcub3B0aW9ucy51cGxvYWRMZW5ndGhEZWZlcnJlZCkge1xuICAgICAgICAgIF90aGlzNy5fZW1pdEh0dHBFcnJvcihyZXEsIHJlcywgJ3R1czogaW52YWxpZCBvciBtaXNzaW5nIGxlbmd0aCB2YWx1ZScpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBfdGhpczcub3B0aW9ucy5fb25VcGxvYWRVcmxBdmFpbGFibGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBfdGhpczcub3B0aW9ucy5fb25VcGxvYWRVcmxBdmFpbGFibGUoKTtcbiAgICAgICAgfSAvLyBVcGxvYWQgaGFzIGFscmVhZHkgYmVlbiBjb21wbGV0ZWQgYW5kIHdlIGRvIG5vdCBuZWVkIHRvIHNlbmQgYWRkaXRpb25hbFxuICAgICAgICAvLyBkYXRhIHRvIHRoZSBzZXJ2ZXJcblxuXG4gICAgICAgIGlmIChvZmZzZXQgPT09IGxlbmd0aCkge1xuICAgICAgICAgIF90aGlzNy5fZW1pdFByb2dyZXNzKGxlbmd0aCwgbGVuZ3RoKTtcblxuICAgICAgICAgIF90aGlzNy5fZW1pdFN1Y2Nlc3MoKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzNy5fb2Zmc2V0ID0gb2Zmc2V0O1xuXG4gICAgICAgIF90aGlzNy5fcGVyZm9ybVVwbG9hZCgpO1xuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzNy5fZW1pdEh0dHBFcnJvcihyZXEsIG51bGwsICd0dXM6IGZhaWxlZCB0byByZXN1bWUgdXBsb2FkJywgZXJyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdGFydCB1cGxvYWRpbmcgdGhlIGZpbGUgdXNpbmcgUEFUQ0ggcmVxdWVzdHMuIFRoZSBmaWxlIHdpbGwgYmUgZGl2aWRlZFxuICAgICAqIGludG8gY2h1bmtzIGFzIHNwZWNpZmllZCBpbiB0aGUgY2h1bmtTaXplIG9wdGlvbi4gRHVyaW5nIHRoZSB1cGxvYWRcbiAgICAgKiB0aGUgb25Qcm9ncmVzcyBldmVudCBoYW5kbGVyIG1heSBiZSBpbnZva2VkIG11bHRpcGxlIHRpbWVzLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfcGVyZm9ybVVwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfcGVyZm9ybVVwbG9hZCgpIHtcbiAgICAgIHZhciBfdGhpczggPSB0aGlzOyAvLyBJZiB0aGUgdXBsb2FkIGhhcyBiZWVuIGFib3J0ZWQsIHdlIHdpbGwgbm90IHNlbmQgdGhlIG5leHQgUEFUQ0ggcmVxdWVzdC5cbiAgICAgIC8vIFRoaXMgaXMgaW1wb3J0YW50IGlmIHRoZSBhYm9ydCBtZXRob2Qgd2FzIGNhbGxlZCBkdXJpbmcgYSBjYWxsYmFjaywgc3VjaFxuICAgICAgLy8gYXMgb25DaHVua0NvbXBsZXRlIG9yIG9uUHJvZ3Jlc3MuXG5cblxuICAgICAgaWYgKHRoaXMuX2Fib3J0ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVxOyAvLyBTb21lIGJyb3dzZXIgYW5kIHNlcnZlcnMgbWF5IG5vdCBzdXBwb3J0IHRoZSBQQVRDSCBtZXRob2QuIEZvciB0aG9zZVxuICAgICAgLy8gY2FzZXMsIHlvdSBjYW4gdGVsbCB0dXMtanMtY2xpZW50IHRvIHVzZSBhIFBPU1QgcmVxdWVzdCB3aXRoIHRoZVxuICAgICAgLy8gWC1IVFRQLU1ldGhvZC1PdmVycmlkZSBoZWFkZXIgZm9yIHNpbXVsYXRpbmcgYSBQQVRDSCByZXF1ZXN0LlxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLm92ZXJyaWRlUGF0Y2hNZXRob2QpIHtcbiAgICAgICAgcmVxID0gdGhpcy5fb3BlblJlcXVlc3QoJ1BPU1QnLCB0aGlzLnVybCk7XG4gICAgICAgIHJlcS5zZXRIZWFkZXIoJ1gtSFRUUC1NZXRob2QtT3ZlcnJpZGUnLCAnUEFUQ0gnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcSA9IHRoaXMuX29wZW5SZXF1ZXN0KCdQQVRDSCcsIHRoaXMudXJsKTtcbiAgICAgIH1cblxuICAgICAgcmVxLnNldEhlYWRlcignVXBsb2FkLU9mZnNldCcsIHRoaXMuX29mZnNldCk7XG5cbiAgICAgIHZhciBwcm9taXNlID0gdGhpcy5fYWRkQ2h1bmtUb1JlcXVlc3QocmVxKTtcblxuICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKCFpblN0YXR1c0NhdGVnb3J5KHJlcy5nZXRTdGF0dXMoKSwgMjAwKSkge1xuICAgICAgICAgIF90aGlzOC5fZW1pdEh0dHBFcnJvcihyZXEsIHJlcywgJ3R1czogdW5leHBlY3RlZCByZXNwb25zZSB3aGlsZSB1cGxvYWRpbmcgY2h1bmsnKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzOC5faGFuZGxlVXBsb2FkUmVzcG9uc2UocmVxLCByZXMpO1xuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIC8vIERvbid0IGVtaXQgYW4gZXJyb3IgaWYgdGhlIHVwbG9hZCB3YXMgYWJvcnRlZCBtYW51YWxseVxuICAgICAgICBpZiAoX3RoaXM4Ll9hYm9ydGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXM4Ll9lbWl0SHR0cEVycm9yKHJlcSwgbnVsbCwgXCJ0dXM6IGZhaWxlZCB0byB1cGxvYWQgY2h1bmsgYXQgb2Zmc2V0IFwiLmNvbmNhdChfdGhpczguX29mZnNldCksIGVycik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogX2FkZENodW5rdG9SZXF1ZXN0IHJlYWRzIGEgY2h1bmsgZnJvbSB0aGUgc291cmNlIGFuZCBzZW5kcyBpdCB1c2luZyB0aGVcbiAgICAgKiBzdXBwbGllZCByZXF1ZXN0IG9iamVjdC4gSXQgd2lsbCBub3QgaGFuZGxlIHRoZSByZXNwb25zZS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2FkZENodW5rVG9SZXF1ZXN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9hZGRDaHVua1RvUmVxdWVzdChyZXEpIHtcbiAgICAgIHZhciBfdGhpczkgPSB0aGlzO1xuXG4gICAgICB2YXIgc3RhcnQgPSB0aGlzLl9vZmZzZXQ7XG4gICAgICB2YXIgZW5kID0gdGhpcy5fb2Zmc2V0ICsgdGhpcy5vcHRpb25zLmNodW5rU2l6ZTtcbiAgICAgIHJlcS5zZXRQcm9ncmVzc0hhbmRsZXIoZnVuY3Rpb24gKGJ5dGVzU2VudCkge1xuICAgICAgICBfdGhpczkuX2VtaXRQcm9ncmVzcyhzdGFydCArIGJ5dGVzU2VudCwgX3RoaXM5Ll9zaXplKTtcbiAgICAgIH0pO1xuICAgICAgcmVxLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL29mZnNldCtvY3RldC1zdHJlYW0nKTsgLy8gVGhlIHNwZWNpZmllZCBjaHVua1NpemUgbWF5IGJlIEluZmluaXR5IG9yIHRoZSBjYWxjbHVhdGVkIGVuZCBwb3NpdGlvblxuICAgICAgLy8gbWF5IGV4Y2VlZCB0aGUgZmlsZSdzIHNpemUuIEluIGJvdGggY2FzZXMsIHdlIGxpbWl0IHRoZSBlbmQgcG9zaXRpb24gdG9cbiAgICAgIC8vIHRoZSBpbnB1dCdzIHRvdGFsIHNpemUgZm9yIHNpbXBsZXIgY2FsY3VsYXRpb25zIGFuZCBjb3JyZWN0bmVzcy5cblxuICAgICAgaWYgKChlbmQgPT09IEluZmluaXR5IHx8IGVuZCA+IHRoaXMuX3NpemUpICYmICF0aGlzLm9wdGlvbnMudXBsb2FkTGVuZ3RoRGVmZXJyZWQpIHtcbiAgICAgICAgZW5kID0gdGhpcy5fc2l6ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZS5zbGljZShzdGFydCwgZW5kKS50aGVuKGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgICB2YXIgdmFsdWUgPSBfcmVmMi52YWx1ZSxcbiAgICAgICAgICAgIGRvbmUgPSBfcmVmMi5kb25lOyAvLyBJZiB0aGUgdXBsb2FkIGxlbmd0aCBpcyBkZWZlcnJlZCwgdGhlIHVwbG9hZCBzaXplIHdhcyBub3Qgc3BlY2lmaWVkIGR1cmluZ1xuICAgICAgICAvLyB1cGxvYWQgY3JlYXRpb24uIFNvLCBpZiB0aGUgZmlsZSByZWFkZXIgaXMgZG9uZSByZWFkaW5nLCB3ZSBrbm93IHRoZSB0b3RhbFxuICAgICAgICAvLyB1cGxvYWQgc2l6ZSBhbmQgY2FuIHRlbGwgdGhlIHR1cyBzZXJ2ZXIuXG5cbiAgICAgICAgaWYgKF90aGlzOS5vcHRpb25zLnVwbG9hZExlbmd0aERlZmVycmVkICYmIGRvbmUpIHtcbiAgICAgICAgICBfdGhpczkuX3NpemUgPSBfdGhpczkuX29mZnNldCArICh2YWx1ZSAmJiB2YWx1ZS5zaXplID8gdmFsdWUuc2l6ZSA6IDApO1xuICAgICAgICAgIHJlcS5zZXRIZWFkZXIoJ1VwbG9hZC1MZW5ndGgnLCBfdGhpczkuX3NpemUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzOS5fc2VuZFJlcXVlc3QocmVxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzOS5fZW1pdFByb2dyZXNzKF90aGlzOS5fb2Zmc2V0LCBfdGhpczkuX3NpemUpO1xuXG4gICAgICAgIHJldHVybiBfdGhpczkuX3NlbmRSZXF1ZXN0KHJlcSwgdmFsdWUpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIF9oYW5kbGVVcGxvYWRSZXNwb25zZSBpcyB1c2VkIGJ5IHJlcXVlc3RzIHRoYXQgaGF2ZW4gYmVlbiBzZW50IHVzaW5nIF9hZGRDaHVua1RvUmVxdWVzdFxuICAgICAqIGFuZCBhbHJlYWR5IGhhdmUgcmVjZWl2ZWQgYSByZXNwb25zZS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2hhbmRsZVVwbG9hZFJlc3BvbnNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9oYW5kbGVVcGxvYWRSZXNwb25zZShyZXEsIHJlcykge1xuICAgICAgdmFyIG9mZnNldCA9IHBhcnNlSW50KHJlcy5nZXRIZWFkZXIoJ1VwbG9hZC1PZmZzZXQnKSwgMTApO1xuXG4gICAgICBpZiAoaXNOYU4ob2Zmc2V0KSkge1xuICAgICAgICB0aGlzLl9lbWl0SHR0cEVycm9yKHJlcSwgcmVzLCAndHVzOiBpbnZhbGlkIG9yIG1pc3Npbmcgb2Zmc2V0IHZhbHVlJyk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9lbWl0UHJvZ3Jlc3Mob2Zmc2V0LCB0aGlzLl9zaXplKTtcblxuICAgICAgdGhpcy5fZW1pdENodW5rQ29tcGxldGUob2Zmc2V0IC0gdGhpcy5fb2Zmc2V0LCBvZmZzZXQsIHRoaXMuX3NpemUpO1xuXG4gICAgICB0aGlzLl9vZmZzZXQgPSBvZmZzZXQ7XG5cbiAgICAgIGlmIChvZmZzZXQgPT0gdGhpcy5fc2l6ZSkge1xuICAgICAgICAvLyBZYXksIGZpbmFsbHkgZG9uZSA6KVxuICAgICAgICB0aGlzLl9lbWl0U3VjY2VzcygpO1xuXG4gICAgICAgIHRoaXMuX3NvdXJjZS5jbG9zZSgpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcGVyZm9ybVVwbG9hZCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgSFRUUCByZXF1ZXN0IG9iamVjdCB3aXRoIHRoZSBnaXZlbiBtZXRob2QgYW5kIFVSTC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX29wZW5SZXF1ZXN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9vcGVuUmVxdWVzdChtZXRob2QsIHVybCkge1xuICAgICAgdmFyIHJlcSA9IG9wZW5SZXF1ZXN0KG1ldGhvZCwgdXJsLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgdGhpcy5fcmVxID0gcmVxO1xuICAgICAgcmV0dXJuIHJlcTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBlbnRyeSBpbiB0aGUgVVJMIHN0b3JhZ2UsIGlmIGl0IGhhcyBiZWVuIHNhdmVkIGJlZm9yZS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3JlbW92ZUZyb21VcmxTdG9yYWdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9yZW1vdmVGcm9tVXJsU3RvcmFnZSgpIHtcbiAgICAgIHZhciBfdGhpczEwID0gdGhpcztcblxuICAgICAgaWYgKCF0aGlzLl91cmxTdG9yYWdlS2V5KSByZXR1cm47XG5cbiAgICAgIHRoaXMuX3VybFN0b3JhZ2UucmVtb3ZlVXBsb2FkKHRoaXMuX3VybFN0b3JhZ2VLZXkpW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycikge1xuICAgICAgICBfdGhpczEwLl9lbWl0RXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl91cmxTdG9yYWdlS2V5ID0gbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkIHRoZSB1cGxvYWQgVVJMIHRvIHRoZSBVUkwgc3RvcmFnZSwgaWYgcG9zc2libGUuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9zYXZlVXBsb2FkSW5VcmxTdG9yYWdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9zYXZlVXBsb2FkSW5VcmxTdG9yYWdlKCkge1xuICAgICAgdmFyIF90aGlzMTEgPSB0aGlzOyAvLyBPbmx5IGlmIGEgZmluZ2VycHJpbnQgd2FzIGNhbGN1bGF0ZWQgZm9yIHRoZSBpbnB1dCAoaS5lLiBub3QgYSBzdHJlYW0pLCB3ZSBjYW4gc3RvcmUgdGhlIHVwbG9hZCBVUkwuXG5cblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuc3RvcmVGaW5nZXJwcmludEZvclJlc3VtaW5nIHx8ICF0aGlzLl9maW5nZXJwcmludCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBzdG9yZWRVcGxvYWQgPSB7XG4gICAgICAgIHNpemU6IHRoaXMuX3NpemUsXG4gICAgICAgIG1ldGFkYXRhOiB0aGlzLm9wdGlvbnMubWV0YWRhdGEsXG4gICAgICAgIGNyZWF0aW9uVGltZTogbmV3IERhdGUoKS50b1N0cmluZygpXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5fcGFyYWxsZWxVcGxvYWRzKSB7XG4gICAgICAgIC8vIFNhdmUgbXVsdGlwbGUgVVJMcyBpZiB0aGUgcGFyYWxsZWxVcGxvYWRzIG9wdGlvbiBpcyB1c2VkIC4uLlxuICAgICAgICBzdG9yZWRVcGxvYWQucGFyYWxsZWxVcGxvYWRVcmxzID0gdGhpcy5fcGFyYWxsZWxVcGxvYWRVcmxzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gLi4uIG90aGVyd2lzZSB3ZSBqdXN0IHNhdmUgdGhlIG9uZSBhdmFpbGFibGUgVVJMLlxuICAgICAgICBzdG9yZWRVcGxvYWQudXBsb2FkVXJsID0gdGhpcy51cmw7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3VybFN0b3JhZ2UuYWRkVXBsb2FkKHRoaXMuX2ZpbmdlcnByaW50LCBzdG9yZWRVcGxvYWQpLnRoZW4oZnVuY3Rpb24gKHVybFN0b3JhZ2VLZXkpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzMTEuX3VybFN0b3JhZ2VLZXkgPSB1cmxTdG9yYWdlS2V5O1xuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzMTEuX2VtaXRFcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNlbmQgYSByZXF1ZXN0IHdpdGggdGhlIHByb3ZpZGVkIGJvZHkuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9zZW5kUmVxdWVzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfc2VuZFJlcXVlc3QocmVxKSB7XG4gICAgICB2YXIgYm9keSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcbiAgICAgIHJldHVybiBzZW5kUmVxdWVzdChyZXEsIGJvZHksIHRoaXMub3B0aW9ucyk7XG4gICAgfVxuICB9XSwgW3tcbiAgICBrZXk6IFwidGVybWluYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRlcm1pbmF0ZSh1cmwsIG9wdGlvbnMpIHtcbiAgICAgIC8vIENvdW50IHRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIHNlZSBpZiBhIGNhbGxiYWNrIGlzIGJlaW5nIHByb3ZpZGVkIGFzIHRoZSBsYXN0XG4gICAgICAvLyBhcmd1bWVudCBpbiB0aGUgb2xkIHN0eWxlIHJlcXVpcmVkIGJ5IHR1cy1qcy1jbGllbnQgMS54LCB0aGVuIHRocm93IGFuIGVycm9yIGlmIGl0IGlzLlxuICAgICAgLy8gYGFyZ3VtZW50c2AgaXMgYSBKYXZhU2NyaXB0IGJ1aWx0LWluIHZhcmlhYmxlIHRoYXQgY29udGFpbnMgYWxsIG9mIHRoZSBmdW5jdGlvbidzIGFyZ3VtZW50cy5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSAmJiB0eXBlb2YgYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3R1czogdGhlIHRlcm1pbmF0ZSBmdW5jdGlvbiBkb2VzIG5vdCBhY2NlcHQgYSBjYWxsYmFjayBzaW5jZSB2MiBhbnltb3JlOyBwbGVhc2UgdXNlIHRoZSByZXR1cm5lZCBQcm9taXNlIGluc3RlYWQnKTtcbiAgICAgIH0gLy8gTm90ZSB0aGF0IGluIG9yZGVyIGZvciB0aGUgdHJpY2sgYWJvdmUgdG8gd29yaywgYSBkZWZhdWx0IHZhbHVlIGNhbm5vdCBiZSBzZXQgZm9yIGBvcHRpb25zYCxcbiAgICAgIC8vIHNvIHRoZSBjaGVjayBiZWxvdyByZXBsYWNlcyB0aGUgb2xkIGRlZmF1bHQgYHt9YC5cblxuXG4gICAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlcSA9IG9wZW5SZXF1ZXN0KCdERUxFVEUnLCB1cmwsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHNlbmRSZXF1ZXN0KHJlcSwgbnVsbCwgb3B0aW9ucykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIC8vIEEgMjA0IHJlc3BvbnNlIGluZGljYXRlcyBhIHN1Y2Nlc3NmdWxsIHJlcXVlc3RcbiAgICAgICAgaWYgKHJlcy5nZXRTdGF0dXMoKSA9PT0gMjA0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IF9lcnJvci5kZWZhdWx0KCd0dXM6IHVuZXhwZWN0ZWQgcmVzcG9uc2Ugd2hpbGUgdGVybWluYXRpbmcgdXBsb2FkJywgbnVsbCwgcmVxLCByZXMpO1xuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmICghKGVyciBpbnN0YW5jZW9mIF9lcnJvci5kZWZhdWx0KSkge1xuICAgICAgICAgIGVyciA9IG5ldyBfZXJyb3IuZGVmYXVsdCgndHVzOiBmYWlsZWQgdG8gdGVybWluYXRlIHVwbG9hZCcsIGVyciwgcmVxLCBudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2hvdWxkUmV0cnkoZXJyLCAwLCBvcHRpb25zKSkge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSAvLyBJbnN0ZWFkIG9mIGtlZXBpbmcgdHJhY2sgb2YgdGhlIHJldHJ5IGF0dGVtcHRzLCB3ZSByZW1vdmUgdGhlIGZpcnN0IGVsZW1lbnQgZnJvbSB0aGUgZGVsYXlzXG4gICAgICAgIC8vIGFycmF5LiBJZiB0aGUgYXJyYXkgaXMgZW1wdHksIGFsbCByZXRyeSBhdHRlbXB0cyBhcmUgdXNlZCB1cCBhbmQgd2Ugd2lsbCBidWJibGUgdXAgdGhlIGVycm9yLlxuICAgICAgICAvLyBXZSByZWN1cnNpdmVseSBjYWxsIHRoZSB0ZXJtaW5hdGUgZnVuY3Rpb24gd2lsbCByZW1vdmluZyBlbGVtZW50cyBmcm9tIHRoZSByZXRyeURlbGF5cyBhcnJheS5cblxuXG4gICAgICAgIHZhciBkZWxheSA9IG9wdGlvbnMucmV0cnlEZWxheXNbMF07XG4gICAgICAgIHZhciByZW1haW5pbmdEZWxheXMgPSBvcHRpb25zLnJldHJ5RGVsYXlzLnNsaWNlKDEpO1xuXG4gICAgICAgIHZhciBuZXdPcHRpb25zID0gX29iamVjdFNwcmVhZCh7fSwgb3B0aW9ucywge1xuICAgICAgICAgIHJldHJ5RGVsYXlzOiByZW1haW5pbmdEZWxheXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpO1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gQmFzZVVwbG9hZC50ZXJtaW5hdGUodXJsLCBuZXdPcHRpb25zKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQmFzZVVwbG9hZDtcbn0oKTtcblxuZnVuY3Rpb24gZW5jb2RlTWV0YWRhdGEobWV0YWRhdGEpIHtcbiAgdmFyIGVuY29kZWQgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gbWV0YWRhdGEpIHtcbiAgICBlbmNvZGVkLnB1c2goXCJcIi5jb25jYXQoa2V5LCBcIiBcIikuY29uY2F0KF9qc0Jhc2UuQmFzZTY0LmVuY29kZShtZXRhZGF0YVtrZXldKSkpO1xuICB9XG5cbiAgcmV0dXJuIGVuY29kZWQuam9pbignLCcpO1xufVxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIGdpdmVuIHN0YXR1cyBpcyBpbiB0aGUgcmFuZ2Ugb2YgdGhlIGV4cGVjdGVkIGNhdGVnb3J5LlxuICogRm9yIGV4YW1wbGUsIG9ubHkgYSBzdGF0dXMgYmV0d2VlbiAyMDAgYW5kIDI5OSB3aWxsIHNhdGlzZnkgdGhlIGNhdGVnb3J5IDIwMC5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIGluU3RhdHVzQ2F0ZWdvcnkoc3RhdHVzLCBjYXRlZ29yeSkge1xuICByZXR1cm4gc3RhdHVzID49IGNhdGVnb3J5ICYmIHN0YXR1cyA8IGNhdGVnb3J5ICsgMTAwO1xufVxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgSFRUUCByZXF1ZXN0IHdpdGggdGhlIHNwZWNpZmllZCBtZXRob2QgYW5kIFVSTC5cbiAqIFRoZSBuZWNlc3NhcnkgaGVhZGVycyB0aGF0IGFyZSBpbmNsdWRlZCBpbiBldmVyeSByZXF1ZXN0XG4gKiB3aWxsIGJlIGFkZGVkLCBpbmNsdWRpbmcgdGhlIHJlcXVlc3QgSUQuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBvcGVuUmVxdWVzdChtZXRob2QsIHVybCwgb3B0aW9ucykge1xuICB2YXIgcmVxID0gb3B0aW9ucy5odHRwU3RhY2suY3JlYXRlUmVxdWVzdChtZXRob2QsIHVybCk7XG4gIHJlcS5zZXRIZWFkZXIoJ1R1cy1SZXN1bWFibGUnLCAnMS4wLjAnKTtcbiAgdmFyIGhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnMgfHwge307XG5cbiAgZm9yICh2YXIgbmFtZSBpbiBoZWFkZXJzKSB7XG4gICAgcmVxLnNldEhlYWRlcihuYW1lLCBoZWFkZXJzW25hbWVdKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmFkZFJlcXVlc3RJZCkge1xuICAgIHZhciByZXF1ZXN0SWQgPSAoMCwgX3V1aWQuZGVmYXVsdCkoKTtcbiAgICByZXEuc2V0SGVhZGVyKCdYLVJlcXVlc3QtSUQnLCByZXF1ZXN0SWQpO1xuICB9XG5cbiAgcmV0dXJuIHJlcTtcbn1cbi8qKlxuICogU2VuZCBhIHJlcXVlc3Qgd2l0aCB0aGUgcHJvdmlkZWQgYm9keSB3aGlsZSBpbnZva2luZyB0aGUgb25CZWZvcmVSZXF1ZXN0XG4gKiBhbmQgb25BZnRlclJlc3BvbnNlIGNhbGxiYWNrcy5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIHNlbmRSZXF1ZXN0KHJlcSwgYm9keSwgb3B0aW9ucykge1xuICB2YXIgb25CZWZvcmVSZXF1ZXN0UHJvbWlzZSA9IHR5cGVvZiBvcHRpb25zLm9uQmVmb3JlUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJyA/IFByb21pc2UucmVzb2x2ZShvcHRpb25zLm9uQmVmb3JlUmVxdWVzdChyZXEpKSA6IFByb21pc2UucmVzb2x2ZSgpO1xuICByZXR1cm4gb25CZWZvcmVSZXF1ZXN0UHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gcmVxLnNlbmQoYm9keSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICB2YXIgb25BZnRlclJlc3BvbnNlUHJvbWlzZSA9IHR5cGVvZiBvcHRpb25zLm9uQWZ0ZXJSZXNwb25zZSA9PT0gJ2Z1bmN0aW9uJyA/IFByb21pc2UucmVzb2x2ZShvcHRpb25zLm9uQWZ0ZXJSZXNwb25zZShyZXEsIHJlcykpIDogUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICByZXR1cm4gb25BZnRlclJlc3BvbnNlUHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn1cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIGJyb3dzZXIgcnVubmluZyB0aGlzIGNvZGUgaGFzIGludGVybmV0IGFjY2Vzcy5cbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBhbHdheXMgcmV0dXJuIHRydWUgaW4gdGhlIG5vZGUuanMgZW52aXJvbm1lbnRcbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzT25saW5lKCkge1xuICB2YXIgb25saW5lID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ25hdmlnYXRvcicgaW4gd2luZG93ICYmIHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lID09PSBmYWxzZSkge1xuICAgIG9ubGluZSA9IGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIG9ubGluZTtcbn1cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgb3Igbm90IGl0IGlzIG9rIHRvIHJldHJ5IGEgcmVxdWVzdC5cbiAqIEBwYXJhbSB7RXJyb3J9IGVyciB0aGUgZXJyb3IgcmV0dXJuZWQgZnJvbSB0aGUgbGFzdCByZXF1ZXN0XG4gKiBAcGFyYW0ge251bWJlcn0gcmV0cnlBdHRlbXB0IHRoZSBudW1iZXIgb2YgdGltZXMgdGhlIHJlcXVlc3QgaGFzIGFscmVhZHkgYmVlbiByZXRyaWVkXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyB0dXMgVXBsb2FkIG9wdGlvbnNcbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIHNob3VsZFJldHJ5KGVyciwgcmV0cnlBdHRlbXB0LCBvcHRpb25zKSB7XG4gIC8vIFdlIG9ubHkgYXR0ZW1wdCBhIHJldHJ5IGlmXG4gIC8vIC0gcmV0cnlEZWxheXMgb3B0aW9uIGlzIHNldFxuICAvLyAtIHdlIGRpZG4ndCBleGNlZWQgdGhlIG1heGl1bSBudW1iZXIgb2YgcmV0cmllcywgeWV0LCBhbmRcbiAgLy8gLSB0aGlzIGVycm9yIHdhcyBjYXVzZWQgYnkgYSByZXF1ZXN0IG9yIGl0J3MgcmVzcG9uc2UgYW5kXG4gIC8vIC0gdGhlIGVycm9yIGlzIHNlcnZlciBlcnJvciAoaS5lLiBub3QgYSBzdGF0dXMgNHh4IGV4Y2VwdCBhIDQwOSBvciA0MjMpIG9yXG4gIC8vIGEgb25TaG91bGRSZXRyeSBpcyBzcGVjaWZpZWQgYW5kIHJldHVybnMgdHJ1ZVxuICAvLyAtIHRoZSBicm93c2VyIGRvZXMgbm90IGluZGljYXRlIHRoYXQgd2UgYXJlIG9mZmxpbmVcbiAgaWYgKG9wdGlvbnMucmV0cnlEZWxheXMgPT0gbnVsbCB8fCByZXRyeUF0dGVtcHQgPj0gb3B0aW9ucy5yZXRyeURlbGF5cy5sZW5ndGggfHwgZXJyLm9yaWdpbmFsUmVxdWVzdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMub25TaG91bGRSZXRyeSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBvcHRpb25zLm9uU2hvdWxkUmV0cnkoZXJyLCByZXRyeUF0dGVtcHQsIG9wdGlvbnMpO1xuICB9XG5cbiAgdmFyIHN0YXR1cyA9IGVyci5vcmlnaW5hbFJlc3BvbnNlID8gZXJyLm9yaWdpbmFsUmVzcG9uc2UuZ2V0U3RhdHVzKCkgOiAwO1xuICByZXR1cm4gKCFpblN0YXR1c0NhdGVnb3J5KHN0YXR1cywgNDAwKSB8fCBzdGF0dXMgPT09IDQwOSB8fCBzdGF0dXMgPT09IDQyMykgJiYgaXNPbmxpbmUoKTtcbn1cbi8qKlxuICogUmVzb2x2ZSBhIHJlbGF0aXZlIGxpbmsgZ2l2ZW4gdGhlIG9yaWdpbiBhcyBzb3VyY2UuIEZvciBleGFtcGxlLFxuICogaWYgYSBIVFRQIHJlcXVlc3QgdG8gaHR0cDovL2V4YW1wbGUuY29tL2ZpbGVzLyByZXR1cm5zIGEgTG9jYXRpb25cbiAqIGhlYWRlciB3aXRoIHRoZSB2YWx1ZSAvdXBsb2FkL2FiYywgdGhlIHJlc29sdmVkIFVSTCB3aWxsIGJlOlxuICogaHR0cDovL2V4YW1wbGUuY29tL3VwbG9hZC9hYmNcbiAqL1xuXG5cbmZ1bmN0aW9uIHJlc29sdmVVcmwob3JpZ2luLCBsaW5rKSB7XG4gIHJldHVybiBuZXcgX3VybFBhcnNlLmRlZmF1bHQobGluaywgb3JpZ2luKS50b1N0cmluZygpO1xufVxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIHN0YXJ0IGFuZCBlbmQgcG9zaXRpb25zIGZvciB0aGUgcGFydHMgaWYgYW4gdXBsb2FkXG4gKiBpcyBzcGxpdCBpbnRvIG11bHRpcGxlIHBhcmFsbGVsIHJlcXVlc3RzLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbFNpemUgVGhlIGJ5dGUgc2l6ZSBvZiB0aGUgdXBsb2FkLCB3aGljaCB3aWxsIGJlIHNwbGl0LlxuICogQHBhcmFtIHtudW1iZXJ9IHBhcnRDb3VudCBUaGUgbnVtYmVyIGluIGhvdyBtYW55IHBhcnRzIHRoZSB1cGxvYWQgd2lsbCBiZSBzcGxpdC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHByZXZpb3VzVXJscyBUaGUgdXBsb2FkIFVSTHMgZm9yIHByZXZpb3VzIHBhcnRzLlxuICogQHJldHVybiB7b2JqZWN0W119XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIHNwbGl0U2l6ZUludG9QYXJ0cyh0b3RhbFNpemUsIHBhcnRDb3VudCwgcHJldmlvdXNVcmxzKSB7XG4gIHZhciBwYXJ0U2l6ZSA9IE1hdGguZmxvb3IodG90YWxTaXplIC8gcGFydENvdW50KTtcbiAgdmFyIHBhcnRzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0Q291bnQ7IGkrKykge1xuICAgIHBhcnRzLnB1c2goe1xuICAgICAgc3RhcnQ6IHBhcnRTaXplICogaSxcbiAgICAgIGVuZDogcGFydFNpemUgKiAoaSArIDEpXG4gICAgfSk7XG4gIH1cblxuICBwYXJ0c1twYXJ0Q291bnQgLSAxXS5lbmQgPSB0b3RhbFNpemU7IC8vIEF0dGFjaCBVUkxzIGZyb20gcHJldmlvdXMgdXBsb2FkcywgaWYgYXZhaWxhYmxlLlxuXG4gIGlmIChwcmV2aW91c1VybHMpIHtcbiAgICBwYXJ0cy5mb3JFYWNoKGZ1bmN0aW9uIChwYXJ0LCBpbmRleCkge1xuICAgICAgcGFydC51cGxvYWRVcmwgPSBwcmV2aW91c1VybHNbaW5kZXhdIHx8IG51bGw7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbkJhc2VVcGxvYWQuZGVmYXVsdE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucztcbnZhciBfZGVmYXVsdCA9IEJhc2VVcGxvYWQ7XG5leHBvcnRzLmRlZmF1bHQgPSBfZGVmYXVsdDsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHV1aWQ7XG5cbi8qKlxuICogR2VuZXJhdGUgYSBVVUlEIHY0IGJhc2VkIG9uIHJhbmRvbSBudW1iZXJzLiBXZSBpbnRlbnRpb2FubGx5IHVzZSB0aGUgbGVzc1xuICogc2VjdXJlIE1hdGgucmFuZG9tIGZ1bmN0aW9uIGhlcmUgc2luY2UgdGhlIG1vcmUgc2VjdXJlIGNyeXB0by5nZXRSYW5kb21OdW1iZXJzXG4gKiBpcyBub3QgYXZhaWxhYmxlIG9uIGFsbCBwbGF0Zm9ybXMuXG4gKiBUaGlzIGlzIG5vdCBhIHByb2JsZW0gZm9yIHVzIHNpbmNlIHdlIHVzZSB0aGUgVVVJRCBvbmx5IGZvciBnZW5lcmF0aW5nIGFcbiAqIHJlcXVlc3QgSUQsIHNvIHdlIGNhbiBjb3JyZWxhdGUgc2VydmVyIGxvZ3MgdG8gY2xpZW50IGVycm9ycy5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHRha2VuIGZyb20gZm9sbG93aW5nIHNpdGU6XG4gKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDUwMzQvY3JlYXRlLWd1aWQtdXVpZC1pbi1qYXZhc2NyaXB0XG4gKlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgZ2VuZXJhdGUgVVVJRFxuICovXG5mdW5jdGlvbiB1dWlkKCkge1xuICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMCxcbiAgICAgICAgdiA9IGMgPT0gJ3gnID8gciA6IHIgJiAweDMgfCAweDg7XG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICB9KTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZXF1aXJlZCA9IHJlcXVpcmUoJ3JlcXVpcmVzLXBvcnQnKVxuICAsIHFzID0gcmVxdWlyZSgncXVlcnlzdHJpbmdpZnknKVxuICAsIHNsYXNoZXMgPSAvXltBLVphLXpdW0EtWmEtejAtOSstLl0qOlxcL1xcLy9cbiAgLCBwcm90b2NvbHJlID0gL14oW2Etel1bYS16MC05ListXSo6KT8oXFwvXFwvKT8oW1xcXFwvXSspPyhbXFxTXFxzXSopL2lcbiAgLCB3aW5kb3dzRHJpdmVMZXR0ZXIgPSAvXlthLXpBLVpdOi9cbiAgLCB3aGl0ZXNwYWNlID0gJ1tcXFxceDA5XFxcXHgwQVxcXFx4MEJcXFxceDBDXFxcXHgwRFxcXFx4MjBcXFxceEEwXFxcXHUxNjgwXFxcXHUxODBFXFxcXHUyMDAwXFxcXHUyMDAxXFxcXHUyMDAyXFxcXHUyMDAzXFxcXHUyMDA0XFxcXHUyMDA1XFxcXHUyMDA2XFxcXHUyMDA3XFxcXHUyMDA4XFxcXHUyMDA5XFxcXHUyMDBBXFxcXHUyMDJGXFxcXHUyMDVGXFxcXHUzMDAwXFxcXHUyMDI4XFxcXHUyMDI5XFxcXHVGRUZGXSdcbiAgLCBsZWZ0ID0gbmV3IFJlZ0V4cCgnXicrIHdoaXRlc3BhY2UgKycrJyk7XG5cbi8qKlxuICogVHJpbSBhIGdpdmVuIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFN0cmluZyB0byB0cmltLlxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiB0cmltTGVmdChzdHIpIHtcbiAgcmV0dXJuIChzdHIgPyBzdHIgOiAnJykudG9TdHJpbmcoKS5yZXBsYWNlKGxlZnQsICcnKTtcbn1cblxuLyoqXG4gKiBUaGVzZSBhcmUgdGhlIHBhcnNlIHJ1bGVzIGZvciB0aGUgVVJMIHBhcnNlciwgaXQgaW5mb3JtcyB0aGUgcGFyc2VyXG4gKiBhYm91dDpcbiAqXG4gKiAwLiBUaGUgY2hhciBpdCBOZWVkcyB0byBwYXJzZSwgaWYgaXQncyBhIHN0cmluZyBpdCBzaG91bGQgYmUgZG9uZSB1c2luZ1xuICogICAgaW5kZXhPZiwgUmVnRXhwIHVzaW5nIGV4ZWMgYW5kIE5hTiBtZWFucyBzZXQgYXMgY3VycmVudCB2YWx1ZS5cbiAqIDEuIFRoZSBwcm9wZXJ0eSB3ZSBzaG91bGQgc2V0IHdoZW4gcGFyc2luZyB0aGlzIHZhbHVlLlxuICogMi4gSW5kaWNhdGlvbiBpZiBpdCdzIGJhY2t3YXJkcyBvciBmb3J3YXJkIHBhcnNpbmcsIHdoZW4gc2V0IGFzIG51bWJlciBpdCdzXG4gKiAgICB0aGUgdmFsdWUgb2YgZXh0cmEgY2hhcnMgdGhhdCBzaG91bGQgYmUgc3BsaXQgb2ZmLlxuICogMy4gSW5oZXJpdCBmcm9tIGxvY2F0aW9uIGlmIG5vbiBleGlzdGluZyBpbiB0aGUgcGFyc2VyLlxuICogNC4gYHRvTG93ZXJDYXNlYCB0aGUgcmVzdWx0aW5nIHZhbHVlLlxuICovXG52YXIgcnVsZXMgPSBbXG4gIFsnIycsICdoYXNoJ10sICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBiYWNrLlxuICBbJz8nLCAncXVlcnknXSwgICAgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgYmFjay5cbiAgZnVuY3Rpb24gc2FuaXRpemUoYWRkcmVzcywgdXJsKSB7ICAgICAvLyBTYW5pdGl6ZSB3aGF0IGlzIGxlZnQgb2YgdGhlIGFkZHJlc3NcbiAgICByZXR1cm4gaXNTcGVjaWFsKHVybC5wcm90b2NvbCkgPyBhZGRyZXNzLnJlcGxhY2UoL1xcXFwvZywgJy8nKSA6IGFkZHJlc3M7XG4gIH0sXG4gIFsnLycsICdwYXRobmFtZSddLCAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBiYWNrLlxuICBbJ0AnLCAnYXV0aCcsIDFdLCAgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgZnJvbnQuXG4gIFtOYU4sICdob3N0JywgdW5kZWZpbmVkLCAxLCAxXSwgICAgICAgLy8gU2V0IGxlZnQgb3ZlciB2YWx1ZS5cbiAgWy86KFxcZCspJC8sICdwb3J0JywgdW5kZWZpbmVkLCAxXSwgICAgLy8gUmVnRXhwIHRoZSBiYWNrLlxuICBbTmFOLCAnaG9zdG5hbWUnLCB1bmRlZmluZWQsIDEsIDFdICAgIC8vIFNldCBsZWZ0IG92ZXIuXG5dO1xuXG4vKipcbiAqIFRoZXNlIHByb3BlcnRpZXMgc2hvdWxkIG5vdCBiZSBjb3BpZWQgb3IgaW5oZXJpdGVkIGZyb20uIFRoaXMgaXMgb25seSBuZWVkZWRcbiAqIGZvciBhbGwgbm9uIGJsb2IgVVJMJ3MgYXMgYSBibG9iIFVSTCBkb2VzIG5vdCBpbmNsdWRlIGEgaGFzaCwgb25seSB0aGVcbiAqIG9yaWdpbi5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQHByaXZhdGVcbiAqL1xudmFyIGlnbm9yZSA9IHsgaGFzaDogMSwgcXVlcnk6IDEgfTtcblxuLyoqXG4gKiBUaGUgbG9jYXRpb24gb2JqZWN0IGRpZmZlcnMgd2hlbiB5b3VyIGNvZGUgaXMgbG9hZGVkIHRocm91Z2ggYSBub3JtYWwgcGFnZSxcbiAqIFdvcmtlciBvciB0aHJvdWdoIGEgd29ya2VyIHVzaW5nIGEgYmxvYi4gQW5kIHdpdGggdGhlIGJsb2JibGUgYmVnaW5zIHRoZVxuICogdHJvdWJsZSBhcyB0aGUgbG9jYXRpb24gb2JqZWN0IHdpbGwgY29udGFpbiB0aGUgVVJMIG9mIHRoZSBibG9iLCBub3QgdGhlXG4gKiBsb2NhdGlvbiBvZiB0aGUgcGFnZSB3aGVyZSBvdXIgY29kZSBpcyBsb2FkZWQgaW4uIFRoZSBhY3R1YWwgb3JpZ2luIGlzXG4gKiBlbmNvZGVkIGluIHRoZSBgcGF0aG5hbWVgIHNvIHdlIGNhbiB0aGFua2Z1bGx5IGdlbmVyYXRlIGEgZ29vZCBcImRlZmF1bHRcIlxuICogbG9jYXRpb24gZnJvbSBpdCBzbyB3ZSBjYW4gZ2VuZXJhdGUgcHJvcGVyIHJlbGF0aXZlIFVSTCdzIGFnYWluLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gbG9jIE9wdGlvbmFsIGRlZmF1bHQgbG9jYXRpb24gb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gbG9sY2F0aW9uIG9iamVjdC5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gbG9sY2F0aW9uKGxvYykge1xuICB2YXIgZ2xvYmFsVmFyO1xuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgZ2xvYmFsVmFyID0gd2luZG93O1xuICBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykgZ2xvYmFsVmFyID0gZ2xvYmFsO1xuICBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIGdsb2JhbFZhciA9IHNlbGY7XG4gIGVsc2UgZ2xvYmFsVmFyID0ge307XG5cbiAgdmFyIGxvY2F0aW9uID0gZ2xvYmFsVmFyLmxvY2F0aW9uIHx8IHt9O1xuICBsb2MgPSBsb2MgfHwgbG9jYXRpb247XG5cbiAgdmFyIGZpbmFsZGVzdGluYXRpb24gPSB7fVxuICAgICwgdHlwZSA9IHR5cGVvZiBsb2NcbiAgICAsIGtleTtcblxuICBpZiAoJ2Jsb2I6JyA9PT0gbG9jLnByb3RvY29sKSB7XG4gICAgZmluYWxkZXN0aW5hdGlvbiA9IG5ldyBVcmwodW5lc2NhcGUobG9jLnBhdGhuYW1lKSwge30pO1xuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09PSB0eXBlKSB7XG4gICAgZmluYWxkZXN0aW5hdGlvbiA9IG5ldyBVcmwobG9jLCB7fSk7XG4gICAgZm9yIChrZXkgaW4gaWdub3JlKSBkZWxldGUgZmluYWxkZXN0aW5hdGlvbltrZXldO1xuICB9IGVsc2UgaWYgKCdvYmplY3QnID09PSB0eXBlKSB7XG4gICAgZm9yIChrZXkgaW4gbG9jKSB7XG4gICAgICBpZiAoa2V5IGluIGlnbm9yZSkgY29udGludWU7XG4gICAgICBmaW5hbGRlc3RpbmF0aW9uW2tleV0gPSBsb2Nba2V5XTtcbiAgICB9XG5cbiAgICBpZiAoZmluYWxkZXN0aW5hdGlvbi5zbGFzaGVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpbmFsZGVzdGluYXRpb24uc2xhc2hlcyA9IHNsYXNoZXMudGVzdChsb2MuaHJlZik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZpbmFsZGVzdGluYXRpb247XG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhIHByb3RvY29sIHNjaGVtZSBpcyBzcGVjaWFsLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBUaGUgcHJvdG9jb2wgc2NoZW1lIG9mIHRoZSBVUkxcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgcHJvdG9jb2wgc2NoZW1lIGlzIHNwZWNpYWwsIGVsc2UgYGZhbHNlYFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gaXNTcGVjaWFsKHNjaGVtZSkge1xuICByZXR1cm4gKFxuICAgIHNjaGVtZSA9PT0gJ2ZpbGU6JyB8fFxuICAgIHNjaGVtZSA9PT0gJ2Z0cDonIHx8XG4gICAgc2NoZW1lID09PSAnaHR0cDonIHx8XG4gICAgc2NoZW1lID09PSAnaHR0cHM6JyB8fFxuICAgIHNjaGVtZSA9PT0gJ3dzOicgfHxcbiAgICBzY2hlbWUgPT09ICd3c3M6J1xuICApO1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIFByb3RvY29sRXh0cmFjdFxuICogQHR5cGUgT2JqZWN0XG4gKiBAcHJvcGVydHkge1N0cmluZ30gcHJvdG9jb2wgUHJvdG9jb2wgbWF0Y2hlZCBpbiB0aGUgVVJMLCBpbiBsb3dlcmNhc2UuXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IHNsYXNoZXMgYHRydWVgIGlmIHByb3RvY29sIGlzIGZvbGxvd2VkIGJ5IFwiLy9cIiwgZWxzZSBgZmFsc2VgLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IHJlc3QgUmVzdCBvZiB0aGUgVVJMIHRoYXQgaXMgbm90IHBhcnQgb2YgdGhlIHByb3RvY29sLlxuICovXG5cbi8qKlxuICogRXh0cmFjdCBwcm90b2NvbCBpbmZvcm1hdGlvbiBmcm9tIGEgVVJMIHdpdGgvd2l0aG91dCBkb3VibGUgc2xhc2ggKFwiLy9cIikuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFkZHJlc3MgVVJMIHdlIHdhbnQgdG8gZXh0cmFjdCBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IGxvY2F0aW9uXG4gKiBAcmV0dXJuIHtQcm90b2NvbEV4dHJhY3R9IEV4dHJhY3RlZCBpbmZvcm1hdGlvbi5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RQcm90b2NvbChhZGRyZXNzLCBsb2NhdGlvbikge1xuICBhZGRyZXNzID0gdHJpbUxlZnQoYWRkcmVzcyk7XG4gIGxvY2F0aW9uID0gbG9jYXRpb24gfHwge307XG5cbiAgdmFyIG1hdGNoID0gcHJvdG9jb2xyZS5leGVjKGFkZHJlc3MpO1xuICB2YXIgcHJvdG9jb2wgPSBtYXRjaFsxXSA/IG1hdGNoWzFdLnRvTG93ZXJDYXNlKCkgOiAnJztcbiAgdmFyIGZvcndhcmRTbGFzaGVzID0gISFtYXRjaFsyXTtcbiAgdmFyIG90aGVyU2xhc2hlcyA9ICEhbWF0Y2hbM107XG4gIHZhciBzbGFzaGVzQ291bnQgPSAwO1xuICB2YXIgcmVzdDtcblxuICBpZiAoZm9yd2FyZFNsYXNoZXMpIHtcbiAgICBpZiAob3RoZXJTbGFzaGVzKSB7XG4gICAgICByZXN0ID0gbWF0Y2hbMl0gKyBtYXRjaFszXSArIG1hdGNoWzRdO1xuICAgICAgc2xhc2hlc0NvdW50ID0gbWF0Y2hbMl0ubGVuZ3RoICsgbWF0Y2hbM10ubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN0ID0gbWF0Y2hbMl0gKyBtYXRjaFs0XTtcbiAgICAgIHNsYXNoZXNDb3VudCA9IG1hdGNoWzJdLmxlbmd0aDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKG90aGVyU2xhc2hlcykge1xuICAgICAgcmVzdCA9IG1hdGNoWzNdICsgbWF0Y2hbNF07XG4gICAgICBzbGFzaGVzQ291bnQgPSBtYXRjaFszXS5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3QgPSBtYXRjaFs0XVxuICAgIH1cbiAgfVxuXG4gIGlmIChwcm90b2NvbCA9PT0gJ2ZpbGU6Jykge1xuICAgIGlmIChzbGFzaGVzQ291bnQgPj0gMikge1xuICAgICAgcmVzdCA9IHJlc3Quc2xpY2UoMik7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzU3BlY2lhbChwcm90b2NvbCkpIHtcbiAgICByZXN0ID0gbWF0Y2hbNF07XG4gIH0gZWxzZSBpZiAocHJvdG9jb2wpIHtcbiAgICBpZiAoZm9yd2FyZFNsYXNoZXMpIHtcbiAgICAgIHJlc3QgPSByZXN0LnNsaWNlKDIpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChzbGFzaGVzQ291bnQgPj0gMiAmJiBpc1NwZWNpYWwobG9jYXRpb24ucHJvdG9jb2wpKSB7XG4gICAgcmVzdCA9IG1hdGNoWzRdO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgc2xhc2hlczogZm9yd2FyZFNsYXNoZXMgfHwgaXNTcGVjaWFsKHByb3RvY29sKSxcbiAgICBzbGFzaGVzQ291bnQ6IHNsYXNoZXNDb3VudCxcbiAgICByZXN0OiByZXN0XG4gIH07XG59XG5cbi8qKlxuICogUmVzb2x2ZSBhIHJlbGF0aXZlIFVSTCBwYXRobmFtZSBhZ2FpbnN0IGEgYmFzZSBVUkwgcGF0aG5hbWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHJlbGF0aXZlIFBhdGhuYW1lIG9mIHRoZSByZWxhdGl2ZSBVUkwuXG4gKiBAcGFyYW0ge1N0cmluZ30gYmFzZSBQYXRobmFtZSBvZiB0aGUgYmFzZSBVUkwuXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFJlc29sdmVkIHBhdGhuYW1lLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZShyZWxhdGl2ZSwgYmFzZSkge1xuICBpZiAocmVsYXRpdmUgPT09ICcnKSByZXR1cm4gYmFzZTtcblxuICB2YXIgcGF0aCA9IChiYXNlIHx8ICcvJykuc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkuY29uY2F0KHJlbGF0aXZlLnNwbGl0KCcvJykpXG4gICAgLCBpID0gcGF0aC5sZW5ndGhcbiAgICAsIGxhc3QgPSBwYXRoW2kgLSAxXVxuICAgICwgdW5zaGlmdCA9IGZhbHNlXG4gICAgLCB1cCA9IDA7XG5cbiAgd2hpbGUgKGktLSkge1xuICAgIGlmIChwYXRoW2ldID09PSAnLicpIHtcbiAgICAgIHBhdGguc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAocGF0aFtpXSA9PT0gJy4uJykge1xuICAgICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIGlmIChpID09PSAwKSB1bnNoaWZ0ID0gdHJ1ZTtcbiAgICAgIHBhdGguc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICBpZiAodW5zaGlmdCkgcGF0aC51bnNoaWZ0KCcnKTtcbiAgaWYgKGxhc3QgPT09ICcuJyB8fCBsYXN0ID09PSAnLi4nKSBwYXRoLnB1c2goJycpO1xuXG4gIHJldHVybiBwYXRoLmpvaW4oJy8nKTtcbn1cblxuLyoqXG4gKiBUaGUgYWN0dWFsIFVSTCBpbnN0YW5jZS4gSW5zdGVhZCBvZiByZXR1cm5pbmcgYW4gb2JqZWN0IHdlJ3ZlIG9wdGVkLWluIHRvXG4gKiBjcmVhdGUgYW4gYWN0dWFsIGNvbnN0cnVjdG9yIGFzIGl0J3MgbXVjaCBtb3JlIG1lbW9yeSBlZmZpY2llbnQgYW5kXG4gKiBmYXN0ZXIgYW5kIGl0IHBsZWFzZXMgbXkgT0NELlxuICpcbiAqIEl0IGlzIHdvcnRoIG5vdGluZyB0aGF0IHdlIHNob3VsZCBub3QgdXNlIGBVUkxgIGFzIGNsYXNzIG5hbWUgdG8gcHJldmVudFxuICogY2xhc2hlcyB3aXRoIHRoZSBnbG9iYWwgVVJMIGluc3RhbmNlIHRoYXQgZ290IGludHJvZHVjZWQgaW4gYnJvd3NlcnMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzcyBVUkwgd2Ugd2FudCB0byBwYXJzZS5cbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gW2xvY2F0aW9uXSBMb2NhdGlvbiBkZWZhdWx0cyBmb3IgcmVsYXRpdmUgcGF0aHMuXG4gKiBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IFtwYXJzZXJdIFBhcnNlciBmb3IgdGhlIHF1ZXJ5IHN0cmluZy5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIFVybChhZGRyZXNzLCBsb2NhdGlvbiwgcGFyc2VyKSB7XG4gIGFkZHJlc3MgPSB0cmltTGVmdChhZGRyZXNzKTtcblxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVXJsKSkge1xuICAgIHJldHVybiBuZXcgVXJsKGFkZHJlc3MsIGxvY2F0aW9uLCBwYXJzZXIpO1xuICB9XG5cbiAgdmFyIHJlbGF0aXZlLCBleHRyYWN0ZWQsIHBhcnNlLCBpbnN0cnVjdGlvbiwgaW5kZXgsIGtleVxuICAgICwgaW5zdHJ1Y3Rpb25zID0gcnVsZXMuc2xpY2UoKVxuICAgICwgdHlwZSA9IHR5cGVvZiBsb2NhdGlvblxuICAgICwgdXJsID0gdGhpc1xuICAgICwgaSA9IDA7XG5cbiAgLy9cbiAgLy8gVGhlIGZvbGxvd2luZyBpZiBzdGF0ZW1lbnRzIGFsbG93cyB0aGlzIG1vZHVsZSB0d28gaGF2ZSBjb21wYXRpYmlsaXR5IHdpdGhcbiAgLy8gMiBkaWZmZXJlbnQgQVBJOlxuICAvL1xuICAvLyAxLiBOb2RlLmpzJ3MgYHVybC5wYXJzZWAgYXBpIHdoaWNoIGFjY2VwdHMgYSBVUkwsIGJvb2xlYW4gYXMgYXJndW1lbnRzXG4gIC8vICAgIHdoZXJlIHRoZSBib29sZWFuIGluZGljYXRlcyB0aGF0IHRoZSBxdWVyeSBzdHJpbmcgc2hvdWxkIGFsc28gYmUgcGFyc2VkLlxuICAvL1xuICAvLyAyLiBUaGUgYFVSTGAgaW50ZXJmYWNlIG9mIHRoZSBicm93c2VyIHdoaWNoIGFjY2VwdHMgYSBVUkwsIG9iamVjdCBhc1xuICAvLyAgICBhcmd1bWVudHMuIFRoZSBzdXBwbGllZCBvYmplY3Qgd2lsbCBiZSB1c2VkIGFzIGRlZmF1bHQgdmFsdWVzIC8gZmFsbC1iYWNrXG4gIC8vICAgIGZvciByZWxhdGl2ZSBwYXRocy5cbiAgLy9cbiAgaWYgKCdvYmplY3QnICE9PSB0eXBlICYmICdzdHJpbmcnICE9PSB0eXBlKSB7XG4gICAgcGFyc2VyID0gbG9jYXRpb247XG4gICAgbG9jYXRpb24gPSBudWxsO1xuICB9XG5cbiAgaWYgKHBhcnNlciAmJiAnZnVuY3Rpb24nICE9PSB0eXBlb2YgcGFyc2VyKSBwYXJzZXIgPSBxcy5wYXJzZTtcblxuICBsb2NhdGlvbiA9IGxvbGNhdGlvbihsb2NhdGlvbik7XG5cbiAgLy9cbiAgLy8gRXh0cmFjdCBwcm90b2NvbCBpbmZvcm1hdGlvbiBiZWZvcmUgcnVubmluZyB0aGUgaW5zdHJ1Y3Rpb25zLlxuICAvL1xuICBleHRyYWN0ZWQgPSBleHRyYWN0UHJvdG9jb2woYWRkcmVzcyB8fCAnJywgbG9jYXRpb24pO1xuICByZWxhdGl2ZSA9ICFleHRyYWN0ZWQucHJvdG9jb2wgJiYgIWV4dHJhY3RlZC5zbGFzaGVzO1xuICB1cmwuc2xhc2hlcyA9IGV4dHJhY3RlZC5zbGFzaGVzIHx8IHJlbGF0aXZlICYmIGxvY2F0aW9uLnNsYXNoZXM7XG4gIHVybC5wcm90b2NvbCA9IGV4dHJhY3RlZC5wcm90b2NvbCB8fCBsb2NhdGlvbi5wcm90b2NvbCB8fCAnJztcbiAgYWRkcmVzcyA9IGV4dHJhY3RlZC5yZXN0O1xuXG4gIC8vXG4gIC8vIFdoZW4gdGhlIGF1dGhvcml0eSBjb21wb25lbnQgaXMgYWJzZW50IHRoZSBVUkwgc3RhcnRzIHdpdGggYSBwYXRoXG4gIC8vIGNvbXBvbmVudC5cbiAgLy9cbiAgaWYgKFxuICAgIGV4dHJhY3RlZC5wcm90b2NvbCA9PT0gJ2ZpbGU6JyAmJiAoXG4gICAgICBleHRyYWN0ZWQuc2xhc2hlc0NvdW50ICE9PSAyIHx8IHdpbmRvd3NEcml2ZUxldHRlci50ZXN0KGFkZHJlc3MpKSB8fFxuICAgICghZXh0cmFjdGVkLnNsYXNoZXMgJiZcbiAgICAgIChleHRyYWN0ZWQucHJvdG9jb2wgfHxcbiAgICAgICAgZXh0cmFjdGVkLnNsYXNoZXNDb3VudCA8IDIgfHxcbiAgICAgICAgIWlzU3BlY2lhbCh1cmwucHJvdG9jb2wpKSlcbiAgKSB7XG4gICAgaW5zdHJ1Y3Rpb25zWzNdID0gWy8oLiopLywgJ3BhdGhuYW1lJ107XG4gIH1cblxuICBmb3IgKDsgaSA8IGluc3RydWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIGluc3RydWN0aW9uID0gaW5zdHJ1Y3Rpb25zW2ldO1xuXG4gICAgaWYgKHR5cGVvZiBpbnN0cnVjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYWRkcmVzcyA9IGluc3RydWN0aW9uKGFkZHJlc3MsIHVybCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBwYXJzZSA9IGluc3RydWN0aW9uWzBdO1xuICAgIGtleSA9IGluc3RydWN0aW9uWzFdO1xuXG4gICAgaWYgKHBhcnNlICE9PSBwYXJzZSkge1xuICAgICAgdXJsW2tleV0gPSBhZGRyZXNzO1xuICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBwYXJzZSkge1xuICAgICAgaWYgKH4oaW5kZXggPSBhZGRyZXNzLmluZGV4T2YocGFyc2UpKSkge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBpbnN0cnVjdGlvblsyXSkge1xuICAgICAgICAgIHVybFtrZXldID0gYWRkcmVzcy5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoaW5kZXggKyBpbnN0cnVjdGlvblsyXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXJsW2tleV0gPSBhZGRyZXNzLnNsaWNlKGluZGV4KTtcbiAgICAgICAgICBhZGRyZXNzID0gYWRkcmVzcy5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKChpbmRleCA9IHBhcnNlLmV4ZWMoYWRkcmVzcykpKSB7XG4gICAgICB1cmxba2V5XSA9IGluZGV4WzFdO1xuICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXguaW5kZXgpO1xuICAgIH1cblxuICAgIHVybFtrZXldID0gdXJsW2tleV0gfHwgKFxuICAgICAgcmVsYXRpdmUgJiYgaW5zdHJ1Y3Rpb25bM10gPyBsb2NhdGlvbltrZXldIHx8ICcnIDogJydcbiAgICApO1xuXG4gICAgLy9cbiAgICAvLyBIb3N0bmFtZSwgaG9zdCBhbmQgcHJvdG9jb2wgc2hvdWxkIGJlIGxvd2VyY2FzZWQgc28gdGhleSBjYW4gYmUgdXNlZCB0b1xuICAgIC8vIGNyZWF0ZSBhIHByb3BlciBgb3JpZ2luYC5cbiAgICAvL1xuICAgIGlmIChpbnN0cnVjdGlvbls0XSkgdXJsW2tleV0gPSB1cmxba2V5XS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLy9cbiAgLy8gQWxzbyBwYXJzZSB0aGUgc3VwcGxpZWQgcXVlcnkgc3RyaW5nIGluIHRvIGFuIG9iamVjdC4gSWYgd2UncmUgc3VwcGxpZWRcbiAgLy8gd2l0aCBhIGN1c3RvbSBwYXJzZXIgYXMgZnVuY3Rpb24gdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgZGVmYXVsdCBidWlsZC1pblxuICAvLyBwYXJzZXIuXG4gIC8vXG4gIGlmIChwYXJzZXIpIHVybC5xdWVyeSA9IHBhcnNlcih1cmwucXVlcnkpO1xuXG4gIC8vXG4gIC8vIElmIHRoZSBVUkwgaXMgcmVsYXRpdmUsIHJlc29sdmUgdGhlIHBhdGhuYW1lIGFnYWluc3QgdGhlIGJhc2UgVVJMLlxuICAvL1xuICBpZiAoXG4gICAgICByZWxhdGl2ZVxuICAgICYmIGxvY2F0aW9uLnNsYXNoZXNcbiAgICAmJiB1cmwucGF0aG5hbWUuY2hhckF0KDApICE9PSAnLydcbiAgICAmJiAodXJsLnBhdGhuYW1lICE9PSAnJyB8fCBsb2NhdGlvbi5wYXRobmFtZSAhPT0gJycpXG4gICkge1xuICAgIHVybC5wYXRobmFtZSA9IHJlc29sdmUodXJsLnBhdGhuYW1lLCBsb2NhdGlvbi5wYXRobmFtZSk7XG4gIH1cblxuICAvL1xuICAvLyBEZWZhdWx0IHRvIGEgLyBmb3IgcGF0aG5hbWUgaWYgbm9uZSBleGlzdHMuIFRoaXMgbm9ybWFsaXplcyB0aGUgVVJMXG4gIC8vIHRvIGFsd2F5cyBoYXZlIGEgL1xuICAvL1xuICBpZiAodXJsLnBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nICYmIGlzU3BlY2lhbCh1cmwucHJvdG9jb2wpKSB7XG4gICAgdXJsLnBhdGhuYW1lID0gJy8nICsgdXJsLnBhdGhuYW1lO1xuICB9XG5cbiAgLy9cbiAgLy8gV2Ugc2hvdWxkIG5vdCBhZGQgcG9ydCBudW1iZXJzIGlmIHRoZXkgYXJlIGFscmVhZHkgdGhlIGRlZmF1bHQgcG9ydCBudW1iZXJcbiAgLy8gZm9yIGEgZ2l2ZW4gcHJvdG9jb2wuIEFzIHRoZSBob3N0IGFsc28gY29udGFpbnMgdGhlIHBvcnQgbnVtYmVyIHdlJ3JlIGdvaW5nXG4gIC8vIG92ZXJyaWRlIGl0IHdpdGggdGhlIGhvc3RuYW1lIHdoaWNoIGNvbnRhaW5zIG5vIHBvcnQgbnVtYmVyLlxuICAvL1xuICBpZiAoIXJlcXVpcmVkKHVybC5wb3J0LCB1cmwucHJvdG9jb2wpKSB7XG4gICAgdXJsLmhvc3QgPSB1cmwuaG9zdG5hbWU7XG4gICAgdXJsLnBvcnQgPSAnJztcbiAgfVxuXG4gIC8vXG4gIC8vIFBhcnNlIGRvd24gdGhlIGBhdXRoYCBmb3IgdGhlIHVzZXJuYW1lIGFuZCBwYXNzd29yZC5cbiAgLy9cbiAgdXJsLnVzZXJuYW1lID0gdXJsLnBhc3N3b3JkID0gJyc7XG4gIGlmICh1cmwuYXV0aCkge1xuICAgIGluc3RydWN0aW9uID0gdXJsLmF1dGguc3BsaXQoJzonKTtcbiAgICB1cmwudXNlcm5hbWUgPSBpbnN0cnVjdGlvblswXSB8fCAnJztcbiAgICB1cmwucGFzc3dvcmQgPSBpbnN0cnVjdGlvblsxXSB8fCAnJztcbiAgfVxuXG4gIHVybC5vcmlnaW4gPSB1cmwucHJvdG9jb2wgIT09ICdmaWxlOicgJiYgaXNTcGVjaWFsKHVybC5wcm90b2NvbCkgJiYgdXJsLmhvc3RcbiAgICA/IHVybC5wcm90b2NvbCArJy8vJysgdXJsLmhvc3RcbiAgICA6ICdudWxsJztcblxuICAvL1xuICAvLyBUaGUgaHJlZiBpcyBqdXN0IHRoZSBjb21waWxlZCByZXN1bHQuXG4gIC8vXG4gIHVybC5ocmVmID0gdXJsLnRvU3RyaW5nKCk7XG59XG5cbi8qKlxuICogVGhpcyBpcyBjb252ZW5pZW5jZSBtZXRob2QgZm9yIGNoYW5naW5nIHByb3BlcnRpZXMgaW4gdGhlIFVSTCBpbnN0YW5jZSB0b1xuICogaW5zdXJlIHRoYXQgdGhleSBhbGwgcHJvcGFnYXRlIGNvcnJlY3RseS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFydCAgICAgICAgICBQcm9wZXJ0eSB3ZSBuZWVkIHRvIGFkanVzdC5cbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlICAgICAgICAgIFRoZSBuZXdseSBhc3NpZ25lZCB2YWx1ZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbnxGdW5jdGlvbn0gZm4gIFdoZW4gc2V0dGluZyB0aGUgcXVlcnksIGl0IHdpbGwgYmUgdGhlIGZ1bmN0aW9uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VkIHRvIHBhcnNlIHRoZSBxdWVyeS5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdoZW4gc2V0dGluZyB0aGUgcHJvdG9jb2wsIGRvdWJsZSBzbGFzaCB3aWxsIGJlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkIGZyb20gdGhlIGZpbmFsIHVybCBpZiBpdCBpcyB0cnVlLlxuICogQHJldHVybnMge1VSTH0gVVJMIGluc3RhbmNlIGZvciBjaGFpbmluZy5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gc2V0KHBhcnQsIHZhbHVlLCBmbikge1xuICB2YXIgdXJsID0gdGhpcztcblxuICBzd2l0Y2ggKHBhcnQpIHtcbiAgICBjYXNlICdxdWVyeSc6XG4gICAgICBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiB2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgdmFsdWUgPSAoZm4gfHwgcXMucGFyc2UpKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3BvcnQnOlxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG5cbiAgICAgIGlmICghcmVxdWlyZWQodmFsdWUsIHVybC5wcm90b2NvbCkpIHtcbiAgICAgICAgdXJsLmhvc3QgPSB1cmwuaG9zdG5hbWU7XG4gICAgICAgIHVybFtwYXJ0XSA9ICcnO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSkge1xuICAgICAgICB1cmwuaG9zdCA9IHVybC5ob3N0bmFtZSArJzonKyB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdob3N0bmFtZSc6XG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcblxuICAgICAgaWYgKHVybC5wb3J0KSB2YWx1ZSArPSAnOicrIHVybC5wb3J0O1xuICAgICAgdXJsLmhvc3QgPSB2YWx1ZTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnaG9zdCc6XG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcblxuICAgICAgaWYgKC86XFxkKyQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuc3BsaXQoJzonKTtcbiAgICAgICAgdXJsLnBvcnQgPSB2YWx1ZS5wb3AoKTtcbiAgICAgICAgdXJsLmhvc3RuYW1lID0gdmFsdWUuam9pbignOicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsLmhvc3RuYW1lID0gdmFsdWU7XG4gICAgICAgIHVybC5wb3J0ID0gJyc7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncHJvdG9jb2wnOlxuICAgICAgdXJsLnByb3RvY29sID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIHVybC5zbGFzaGVzID0gIWZuO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdwYXRobmFtZSc6XG4gICAgY2FzZSAnaGFzaCc6XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdmFyIGNoYXIgPSBwYXJ0ID09PSAncGF0aG5hbWUnID8gJy8nIDogJyMnO1xuICAgICAgICB1cmxbcGFydF0gPSB2YWx1ZS5jaGFyQXQoMCkgIT09IGNoYXIgPyBjaGFyICsgdmFsdWUgOiB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlucyA9IHJ1bGVzW2ldO1xuXG4gICAgaWYgKGluc1s0XSkgdXJsW2luc1sxXV0gPSB1cmxbaW5zWzFdXS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgdXJsLm9yaWdpbiA9IHVybC5wcm90b2NvbCAhPT0gJ2ZpbGU6JyAmJiBpc1NwZWNpYWwodXJsLnByb3RvY29sKSAmJiB1cmwuaG9zdFxuICAgID8gdXJsLnByb3RvY29sICsnLy8nKyB1cmwuaG9zdFxuICAgIDogJ251bGwnO1xuXG4gIHVybC5ocmVmID0gdXJsLnRvU3RyaW5nKCk7XG5cbiAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIHByb3BlcnRpZXMgYmFjayBpbiB0byBhIHZhbGlkIGFuZCBmdWxsIFVSTCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5naWZ5IE9wdGlvbmFsIHF1ZXJ5IHN0cmluZ2lmeSBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IENvbXBpbGVkIHZlcnNpb24gb2YgdGhlIFVSTC5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcoc3RyaW5naWZ5KSB7XG4gIGlmICghc3RyaW5naWZ5IHx8ICdmdW5jdGlvbicgIT09IHR5cGVvZiBzdHJpbmdpZnkpIHN0cmluZ2lmeSA9IHFzLnN0cmluZ2lmeTtcblxuICB2YXIgcXVlcnlcbiAgICAsIHVybCA9IHRoaXNcbiAgICAsIHByb3RvY29sID0gdXJsLnByb3RvY29sO1xuXG4gIGlmIChwcm90b2NvbCAmJiBwcm90b2NvbC5jaGFyQXQocHJvdG9jb2wubGVuZ3RoIC0gMSkgIT09ICc6JykgcHJvdG9jb2wgKz0gJzonO1xuXG4gIHZhciByZXN1bHQgPSBwcm90b2NvbCArICh1cmwuc2xhc2hlcyB8fCBpc1NwZWNpYWwodXJsLnByb3RvY29sKSA/ICcvLycgOiAnJyk7XG5cbiAgaWYgKHVybC51c2VybmFtZSkge1xuICAgIHJlc3VsdCArPSB1cmwudXNlcm5hbWU7XG4gICAgaWYgKHVybC5wYXNzd29yZCkgcmVzdWx0ICs9ICc6JysgdXJsLnBhc3N3b3JkO1xuICAgIHJlc3VsdCArPSAnQCc7XG4gIH1cblxuICByZXN1bHQgKz0gdXJsLmhvc3QgKyB1cmwucGF0aG5hbWU7XG5cbiAgcXVlcnkgPSAnb2JqZWN0JyA9PT0gdHlwZW9mIHVybC5xdWVyeSA/IHN0cmluZ2lmeSh1cmwucXVlcnkpIDogdXJsLnF1ZXJ5O1xuICBpZiAocXVlcnkpIHJlc3VsdCArPSAnPycgIT09IHF1ZXJ5LmNoYXJBdCgwKSA/ICc/JysgcXVlcnkgOiBxdWVyeTtcblxuICBpZiAodXJsLmhhc2gpIHJlc3VsdCArPSB1cmwuaGFzaDtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5VcmwucHJvdG90eXBlID0geyBzZXQ6IHNldCwgdG9TdHJpbmc6IHRvU3RyaW5nIH07XG5cbi8vXG4vLyBFeHBvc2UgdGhlIFVSTCBwYXJzZXIgYW5kIHNvbWUgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIHRoYXQgbWlnaHQgYmUgdXNlZnVsIGZvclxuLy8gb3RoZXJzIG9yIHRlc3RpbmcuXG4vL1xuVXJsLmV4dHJhY3RQcm90b2NvbCA9IGV4dHJhY3RQcm90b2NvbDtcblVybC5sb2NhdGlvbiA9IGxvbGNhdGlvbjtcblVybC50cmltTGVmdCA9IHRyaW1MZWZ0O1xuVXJsLnFzID0gcXM7XG5cbm1vZHVsZS5leHBvcnRzID0gVXJsO1xuIiwiLyoganNoaW50IG5vZGU6IHRydWUgKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gICMgd2lsZGNhcmRcblxuICBWZXJ5IHNpbXBsZSB3aWxkY2FyZCBtYXRjaGluZywgd2hpY2ggaXMgZGVzaWduZWQgdG8gcHJvdmlkZSB0aGUgc2FtZVxuICBmdW5jdGlvbmFsaXR5IHRoYXQgaXMgZm91bmQgaW4gdGhlXG4gIFtldmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9hZG9iZS13ZWJwbGF0Zm9ybS9ldmUpIGV2ZW50aW5nIGxpYnJhcnkuXG5cbiAgIyMgVXNhZ2VcblxuICBJdCB3b3JrcyB3aXRoIHN0cmluZ3M6XG5cbiAgPDw8IGV4YW1wbGVzL3N0cmluZ3MuanNcblxuICBBcnJheXM6XG5cbiAgPDw8IGV4YW1wbGVzL2FycmF5cy5qc1xuXG4gIE9iamVjdHMgKG1hdGNoaW5nIGFnYWluc3Qga2V5cyk6XG5cbiAgPDw8IGV4YW1wbGVzL29iamVjdHMuanNcblxuICBXaGlsZSB0aGUgbGlicmFyeSB3b3JrcyBpbiBOb2RlLCBpZiB5b3UgYXJlIGFyZSBsb29raW5nIGZvciBmaWxlLWJhc2VkXG4gIHdpbGRjYXJkIG1hdGNoaW5nIHRoZW4geW91IHNob3VsZCBoYXZlIGEgbG9vayBhdDpcblxuICA8aHR0cHM6Ly9naXRodWIuY29tL2lzYWFjcy9ub2RlLWdsb2I+XG4qKi9cblxuZnVuY3Rpb24gV2lsZGNhcmRNYXRjaGVyKHRleHQsIHNlcGFyYXRvcikge1xuICB0aGlzLnRleHQgPSB0ZXh0ID0gdGV4dCB8fCAnJztcbiAgdGhpcy5oYXNXaWxkID0gfnRleHQuaW5kZXhPZignKicpO1xuICB0aGlzLnNlcGFyYXRvciA9IHNlcGFyYXRvcjtcbiAgdGhpcy5wYXJ0cyA9IHRleHQuc3BsaXQoc2VwYXJhdG9yKTtcbn1cblxuV2lsZGNhcmRNYXRjaGVyLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gIHZhciBtYXRjaGVzID0gdHJ1ZTtcbiAgdmFyIHBhcnRzID0gdGhpcy5wYXJ0cztcbiAgdmFyIGlpO1xuICB2YXIgcGFydHNDb3VudCA9IHBhcnRzLmxlbmd0aDtcbiAgdmFyIHRlc3RQYXJ0cztcblxuICBpZiAodHlwZW9mIGlucHV0ID09ICdzdHJpbmcnIHx8IGlucHV0IGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmhhc1dpbGQgJiYgdGhpcy50ZXh0ICE9IGlucHV0KSB7XG4gICAgICBtYXRjaGVzID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlc3RQYXJ0cyA9IChpbnB1dCB8fCAnJykuc3BsaXQodGhpcy5zZXBhcmF0b3IpO1xuICAgICAgZm9yIChpaSA9IDA7IG1hdGNoZXMgJiYgaWkgPCBwYXJ0c0NvdW50OyBpaSsrKSB7XG4gICAgICAgIGlmIChwYXJ0c1tpaV0gPT09ICcqJykgIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmIChpaSA8IHRlc3RQYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICBtYXRjaGVzID0gcGFydHNbaWldID09PSB0ZXN0UGFydHNbaWldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hdGNoZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJZiBtYXRjaGVzLCB0aGVuIHJldHVybiB0aGUgY29tcG9uZW50IHBhcnRzXG4gICAgICBtYXRjaGVzID0gbWF0Y2hlcyAmJiB0ZXN0UGFydHM7XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBpbnB1dC5zcGxpY2UgPT0gJ2Z1bmN0aW9uJykge1xuICAgIG1hdGNoZXMgPSBbXTtcblxuICAgIGZvciAoaWkgPSBpbnB1dC5sZW5ndGg7IGlpLS07ICkge1xuICAgICAgaWYgKHRoaXMubWF0Y2goaW5wdXRbaWldKSkge1xuICAgICAgICBtYXRjaGVzW21hdGNoZXMubGVuZ3RoXSA9IGlucHV0W2lpXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGlucHV0ID09ICdvYmplY3QnKSB7XG4gICAgbWF0Y2hlcyA9IHt9O1xuXG4gICAgZm9yICh2YXIga2V5IGluIGlucHV0KSB7XG4gICAgICBpZiAodGhpcy5tYXRjaChrZXkpKSB7XG4gICAgICAgIG1hdGNoZXNba2V5XSA9IGlucHV0W2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRleHQsIHRlc3QsIHNlcGFyYXRvcikge1xuICB2YXIgbWF0Y2hlciA9IG5ldyBXaWxkY2FyZE1hdGNoZXIodGV4dCwgc2VwYXJhdG9yIHx8IC9bXFwvXFwuXS8pO1xuICBpZiAodHlwZW9mIHRlc3QgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gbWF0Y2hlci5tYXRjaCh0ZXN0KTtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVyO1xufTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBBdXRoRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcignQXV0aG9yaXphdGlvbiByZXF1aXJlZCcpXG4gICAgdGhpcy5uYW1lID0gJ0F1dGhFcnJvcidcbiAgICB0aGlzLmlzQXV0aEVycm9yID0gdHJ1ZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aEVycm9yXG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgUmVxdWVzdENsaWVudCA9IHJlcXVpcmUoJy4vUmVxdWVzdENsaWVudCcpXG5jb25zdCB0b2tlblN0b3JhZ2UgPSByZXF1aXJlKCcuL3Rva2VuU3RvcmFnZScpXG5cbmNvbnN0IGdldE5hbWUgPSAoaWQpID0+IHtcbiAgcmV0dXJuIGlkLnNwbGl0KCctJykubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSkuam9pbignICcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUHJvdmlkZXIgZXh0ZW5kcyBSZXF1ZXN0Q2xpZW50IHtcbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICBzdXBlcih1cHB5LCBvcHRzKVxuICAgIHRoaXMucHJvdmlkZXIgPSBvcHRzLnByb3ZpZGVyXG4gICAgdGhpcy5pZCA9IHRoaXMucHJvdmlkZXJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9wdHMubmFtZSB8fCBnZXROYW1lKHRoaXMuaWQpXG4gICAgdGhpcy5wbHVnaW5JZCA9IHRoaXMub3B0cy5wbHVnaW5JZFxuICAgIHRoaXMudG9rZW5LZXkgPSBgY29tcGFuaW9uLSR7dGhpcy5wbHVnaW5JZH0tYXV0aC10b2tlbmBcbiAgICB0aGlzLmNvbXBhbmlvbktleXNQYXJhbXMgPSB0aGlzLm9wdHMuY29tcGFuaW9uS2V5c1BhcmFtc1xuICAgIHRoaXMucHJlQXV0aFRva2VuID0gbnVsbFxuICB9XG5cbiAgaGVhZGVycyAoKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtzdXBlci5oZWFkZXJzKCksIHRoaXMuZ2V0QXV0aFRva2VuKCldKVxuICAgICAgLnRoZW4oKFtoZWFkZXJzLCB0b2tlbl0pID0+IHtcbiAgICAgICAgY29uc3QgYXV0aEhlYWRlcnMgPSB7fVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICBhdXRoSGVhZGVyc1sndXBweS1hdXRoLXRva2VuJ10gPSB0b2tlblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29tcGFuaW9uS2V5c1BhcmFtcykge1xuICAgICAgICAgIGF1dGhIZWFkZXJzWyd1cHB5LWNyZWRlbnRpYWxzLXBhcmFtcyddID0gYnRvYShcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHsgcGFyYW1zOiB0aGlzLmNvbXBhbmlvbktleXNQYXJhbXMgfSlcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgLi4uaGVhZGVycywgLi4uYXV0aEhlYWRlcnMgfVxuICAgICAgfSlcbiAgfVxuXG4gIG9uUmVjZWl2ZVJlc3BvbnNlIChyZXNwb25zZSkge1xuICAgIHJlc3BvbnNlID0gc3VwZXIub25SZWNlaXZlUmVzcG9uc2UocmVzcG9uc2UpXG4gICAgY29uc3QgcGx1Z2luID0gdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKVxuICAgIGNvbnN0IG9sZEF1dGhlbnRpY2F0ZWQgPSBwbHVnaW4uZ2V0UGx1Z2luU3RhdGUoKS5hdXRoZW50aWNhdGVkXG4gICAgY29uc3QgYXV0aGVudGljYXRlZCA9IG9sZEF1dGhlbnRpY2F0ZWQgPyByZXNwb25zZS5zdGF0dXMgIT09IDQwMSA6IHJlc3BvbnNlLnN0YXR1cyA8IDQwMFxuICAgIHBsdWdpbi5zZXRQbHVnaW5TdGF0ZSh7IGF1dGhlbnRpY2F0ZWQgfSlcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIHNldEF1dGhUb2tlbiAodG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKS5zdG9yYWdlLnNldEl0ZW0odGhpcy50b2tlbktleSwgdG9rZW4pXG4gIH1cblxuICBnZXRBdXRoVG9rZW4gKCkge1xuICAgIHJldHVybiB0aGlzLnVwcHkuZ2V0UGx1Z2luKHRoaXMucGx1Z2luSWQpLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnRva2VuS2V5KVxuICB9XG5cbiAgYXV0aFVybCAocXVlcmllcyA9IHt9KSB7XG4gICAgaWYgKHRoaXMucHJlQXV0aFRva2VuKSB7XG4gICAgICBxdWVyaWVzLnVwcHlQcmVBdXRoVG9rZW4gPSB0aGlzLnByZUF1dGhUb2tlblxuICAgIH1cblxuICAgIHJldHVybiBgJHt0aGlzLmhvc3RuYW1lfS8ke3RoaXMuaWR9L2Nvbm5lY3Q/JHtuZXcgVVJMU2VhcmNoUGFyYW1zKHF1ZXJpZXMpfWBcbiAgfVxuXG4gIGZpbGVVcmwgKGlkKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuaG9zdG5hbWV9LyR7dGhpcy5pZH0vZ2V0LyR7aWR9YFxuICB9XG5cbiAgZmV0Y2hQcmVBdXRoVG9rZW4gKCkge1xuICAgIGlmICghdGhpcy5jb21wYW5pb25LZXlzUGFyYW1zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KGAke3RoaXMuaWR9L3ByZWF1dGgvYCwgeyBwYXJhbXM6IHRoaXMuY29tcGFuaW9uS2V5c1BhcmFtcyB9KVxuICAgICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICB0aGlzLnByZUF1dGhUb2tlbiA9IHJlcy50b2tlblxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLnVwcHkubG9nKGBbQ29tcGFuaW9uQ2xpZW50XSB1bmFibGUgdG8gZmV0Y2ggcHJlQXV0aFRva2VuICR7ZXJyfWAsICd3YXJuaW5nJylcbiAgICAgIH0pXG4gIH1cblxuICBsaXN0IChkaXJlY3RvcnkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoYCR7dGhpcy5pZH0vbGlzdC8ke2RpcmVjdG9yeSB8fCAnJ31gKVxuICB9XG5cbiAgbG9nb3V0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoYCR7dGhpcy5pZH0vbG9nb3V0YClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gUHJvbWlzZS5hbGwoW1xuICAgICAgICByZXNwb25zZSxcbiAgICAgICAgdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKS5zdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy50b2tlbktleSksXG4gICAgICBdKSkudGhlbigoW3Jlc3BvbnNlXSkgPT4gcmVzcG9uc2UpXG4gIH1cblxuICBzdGF0aWMgaW5pdFBsdWdpbiAocGx1Z2luLCBvcHRzLCBkZWZhdWx0T3B0cykge1xuICAgIHBsdWdpbi50eXBlID0gJ2FjcXVpcmVyJ1xuICAgIHBsdWdpbi5maWxlcyA9IFtdXG4gICAgaWYgKGRlZmF1bHRPcHRzKSB7XG4gICAgICBwbHVnaW4ub3B0cyA9IHsgLi4uZGVmYXVsdE9wdHMsIC4uLm9wdHMgfVxuICAgIH1cblxuICAgIGlmIChvcHRzLnNlcnZlclVybCB8fCBvcHRzLnNlcnZlclBhdHRlcm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHNlcnZlclVybGAgYW5kIGBzZXJ2ZXJQYXR0ZXJuYCBoYXZlIGJlZW4gcmVuYW1lZCB0byBgY29tcGFuaW9uVXJsYCBhbmQgYGNvbXBhbmlvbkFsbG93ZWRIb3N0c2AgcmVzcGVjdGl2ZWx5IGluIHRoZSAwLjMwLjUgcmVsZWFzZS4gUGxlYXNlIGNvbnN1bHQgdGhlIGRvY3MgKGZvciBleGFtcGxlLCBodHRwczovL3VwcHkuaW8vZG9jcy9pbnN0YWdyYW0vIGZvciB0aGUgSW5zdGFncmFtIHBsdWdpbikgYW5kIHVzZSB0aGUgdXBkYXRlZCBvcHRpb25zLmAnKVxuICAgIH1cblxuICAgIGlmIChvcHRzLmNvbXBhbmlvbkFsbG93ZWRIb3N0cykge1xuICAgICAgY29uc3QgcGF0dGVybiA9IG9wdHMuY29tcGFuaW9uQWxsb3dlZEhvc3RzXG4gICAgICAvLyB2YWxpZGF0ZSBjb21wYW5pb25BbGxvd2VkSG9zdHMgcGFyYW1cbiAgICAgIGlmICh0eXBlb2YgcGF0dGVybiAhPT0gJ3N0cmluZycgJiYgIUFycmF5LmlzQXJyYXkocGF0dGVybikgJiYgIShwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke3BsdWdpbi5pZH06IHRoZSBvcHRpb24gXCJjb21wYW5pb25BbGxvd2VkSG9zdHNcIiBtdXN0IGJlIG9uZSBvZiBzdHJpbmcsIEFycmF5LCBSZWdFeHBgKVxuICAgICAgfVxuICAgICAgcGx1Z2luLm9wdHMuY29tcGFuaW9uQWxsb3dlZEhvc3RzID0gcGF0dGVyblxuICAgIH0gZWxzZSBpZiAoL14oPyFodHRwcz86XFwvXFwvKS4qJC9pLnRlc3Qob3B0cy5jb21wYW5pb25VcmwpKSB7XG4gICAgICAvLyBkb2VzIG5vdCBzdGFydCB3aXRoIGh0dHBzOi8vXG4gICAgICBwbHVnaW4ub3B0cy5jb21wYW5pb25BbGxvd2VkSG9zdHMgPSBgaHR0cHM6Ly8ke29wdHMuY29tcGFuaW9uVXJsLnJlcGxhY2UoL15cXC9cXC8vLCAnJyl9YFxuICAgIH0gZWxzZSB7XG4gICAgICBwbHVnaW4ub3B0cy5jb21wYW5pb25BbGxvd2VkSG9zdHMgPSBuZXcgVVJMKG9wdHMuY29tcGFuaW9uVXJsKS5vcmlnaW5cbiAgICB9XG5cbiAgICBwbHVnaW4uc3RvcmFnZSA9IHBsdWdpbi5vcHRzLnN0b3JhZ2UgfHwgdG9rZW5TdG9yYWdlXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmZXRjaFdpdGhOZXR3b3JrRXJyb3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZmV0Y2hXaXRoTmV0d29ya0Vycm9yJylcbmNvbnN0IEF1dGhFcnJvciA9IHJlcXVpcmUoJy4vQXV0aEVycm9yJylcblxuLy8gUmVtb3ZlIHRoZSB0cmFpbGluZyBzbGFzaCBzbyB3ZSBjYW4gYWx3YXlzIHNhZmVseSBhcHBlbmQgL3h5ei5cbmZ1bmN0aW9uIHN0cmlwU2xhc2ggKHVybCkge1xuICByZXR1cm4gdXJsLnJlcGxhY2UoL1xcLyQvLCAnJylcbn1cblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSlNPTlJlc3BvbnNlIChyZXMpIHtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSkge1xuICAgIHRocm93IG5ldyBBdXRoRXJyb3IoKVxuICB9XG5cbiAgY29uc3QganNvblByb21pc2UgPSByZXMuanNvbigpXG5cbiAgaWYgKHJlcy5zdGF0dXMgPCAyMDAgfHwgcmVzLnN0YXR1cyA+IDMwMCkge1xuICAgIGxldCBlcnJNc2cgPSBgRmFpbGVkIHJlcXVlc3Qgd2l0aCBzdGF0dXM6ICR7cmVzLnN0YXR1c30uICR7cmVzLnN0YXR1c1RleHR9YFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBlcnJEYXRhID0gYXdhaXQganNvblByb21pc2VcbiAgICAgIGVyck1zZyA9IGVyckRhdGEubWVzc2FnZSA/IGAke2Vyck1zZ30gbWVzc2FnZTogJHtlcnJEYXRhLm1lc3NhZ2V9YCA6IGVyck1zZ1xuICAgICAgZXJyTXNnID0gZXJyRGF0YS5yZXF1ZXN0SWQgPyBgJHtlcnJNc2d9IHJlcXVlc3QtSWQ6ICR7ZXJyRGF0YS5yZXF1ZXN0SWR9YCA6IGVyck1zZ1xuICAgIH0gZmluYWxseSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5zYWZlLWZpbmFsbHlcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpXG4gICAgfVxuICB9XG4gIHJldHVybiBqc29uUHJvbWlzZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJlcXVlc3RDbGllbnQge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgc3RhdGljIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uXG5cbiAgI2dldFBvc3RSZXNwb25zZUZ1bmMgPSBza2lwID0+IHJlc3BvbnNlID0+IChza2lwID8gcmVzcG9uc2UgOiB0aGlzLm9uUmVjZWl2ZVJlc3BvbnNlKHJlc3BvbnNlKSlcblxuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHRoaXMudXBweSA9IHVwcHlcbiAgICB0aGlzLm9wdHMgPSBvcHRzXG4gICAgdGhpcy5vblJlY2VpdmVSZXNwb25zZSA9IHRoaXMub25SZWNlaXZlUmVzcG9uc2UuYmluZCh0aGlzKVxuICAgIHRoaXMuYWxsb3dlZEhlYWRlcnMgPSBbJ2FjY2VwdCcsICdjb250ZW50LXR5cGUnLCAndXBweS1hdXRoLXRva2VuJ11cbiAgICB0aGlzLnByZWZsaWdodERvbmUgPSBmYWxzZVxuICB9XG5cbiAgZ2V0IGhvc3RuYW1lICgpIHtcbiAgICBjb25zdCB7IGNvbXBhbmlvbiB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICBjb25zdCBob3N0ID0gdGhpcy5vcHRzLmNvbXBhbmlvblVybFxuICAgIHJldHVybiBzdHJpcFNsYXNoKGNvbXBhbmlvbiAmJiBjb21wYW5pb25baG9zdF0gPyBjb21wYW5pb25baG9zdF0gOiBob3N0KVxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRIZWFkZXJzID17XG4gICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAnVXBweS1WZXJzaW9ucyc6IGBAdXBweS9jb21wYW5pb24tY2xpZW50PSR7UmVxdWVzdENsaWVudC5WRVJTSU9OfWAsXG4gIH1cblxuICBoZWFkZXJzICgpIHtcbiAgICBjb25zdCB1c2VySGVhZGVycyA9IHRoaXMub3B0cy5jb21wYW5pb25IZWFkZXJzIHx8IHt9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAuLi5SZXF1ZXN0Q2xpZW50LmRlZmF1bHRIZWFkZXJzLFxuICAgICAgLi4udXNlckhlYWRlcnMsXG4gICAgfSlcbiAgfVxuXG4gIG9uUmVjZWl2ZVJlc3BvbnNlIChyZXNwb25zZSkge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICBjb25zdCBjb21wYW5pb24gPSBzdGF0ZS5jb21wYW5pb24gfHwge31cbiAgICBjb25zdCBob3N0ID0gdGhpcy5vcHRzLmNvbXBhbmlvblVybFxuICAgIGNvbnN0IHsgaGVhZGVycyB9ID0gcmVzcG9uc2VcbiAgICAvLyBTdG9yZSB0aGUgc2VsZi1pZGVudGlmaWVkIGRvbWFpbiBuYW1lIGZvciB0aGUgQ29tcGFuaW9uIGluc3RhbmNlIHdlIGp1c3QgaGl0LlxuICAgIGlmIChoZWFkZXJzLmhhcygnaS1hbScpICYmIGhlYWRlcnMuZ2V0KCdpLWFtJykgIT09IGNvbXBhbmlvbltob3N0XSkge1xuICAgICAgdGhpcy51cHB5LnNldFN0YXRlKHtcbiAgICAgICAgY29tcGFuaW9uOiB7IC4uLmNvbXBhbmlvbiwgW2hvc3RdOiBoZWFkZXJzLmdldCgnaS1hbScpIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gICNnZXRVcmwgKHVybCkge1xuICAgIGlmICgvXihodHRwcz86fClcXC9cXC8vLnRlc3QodXJsKSkge1xuICAgICAgcmV0dXJuIHVybFxuICAgIH1cbiAgICByZXR1cm4gYCR7dGhpcy5ob3N0bmFtZX0vJHt1cmx9YFxuICB9XG5cbiAgI2Vycm9ySGFuZGxlciAobWV0aG9kLCBwYXRoKSB7XG4gICAgcmV0dXJuIChlcnIpID0+IHtcbiAgICAgIGlmICghZXJyPy5pc0F1dGhFcnJvcikge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihgQ291bGQgbm90ICR7bWV0aG9kfSAke3RoaXMuI2dldFVybChwYXRoKX1gKVxuICAgICAgICBlcnJvci5jYXVzZSA9IGVyclxuICAgICAgICBlcnIgPSBlcnJvciAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKVxuICAgIH1cbiAgfVxuXG4gIHByZWZsaWdodCAocGF0aCkge1xuICAgIGlmICh0aGlzLnByZWZsaWdodERvbmUpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5hbGxvd2VkSGVhZGVycy5zbGljZSgpKVxuICAgIH1cblxuICAgIHJldHVybiBmZXRjaCh0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgIG1ldGhvZDogJ09QVElPTlMnLFxuICAgIH0pXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmhlYWRlcnMuaGFzKCdhY2Nlc3MtY29udHJvbC1hbGxvdy1oZWFkZXJzJykpIHtcbiAgICAgICAgICB0aGlzLmFsbG93ZWRIZWFkZXJzID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2FjY2Vzcy1jb250cm9sLWFsbG93LWhlYWRlcnMnKVxuICAgICAgICAgICAgLnNwbGl0KCcsJykubWFwKChoZWFkZXJOYW1lKSA9PiBoZWFkZXJOYW1lLnRyaW0oKS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJlZmxpZ2h0RG9uZSA9IHRydWVcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsb3dlZEhlYWRlcnMuc2xpY2UoKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMudXBweS5sb2coYFtDb21wYW5pb25DbGllbnRdIHVuYWJsZSB0byBtYWtlIHByZWZsaWdodCByZXF1ZXN0ICR7ZXJyfWAsICd3YXJuaW5nJylcbiAgICAgICAgdGhpcy5wcmVmbGlnaHREb25lID0gdHJ1ZVxuICAgICAgICByZXR1cm4gdGhpcy5hbGxvd2VkSGVhZGVycy5zbGljZSgpXG4gICAgICB9KVxuICB9XG5cbiAgcHJlZmxpZ2h0QW5kSGVhZGVycyAocGF0aCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChbdGhpcy5wcmVmbGlnaHQocGF0aCksIHRoaXMuaGVhZGVycygpXSlcbiAgICAgIC50aGVuKChbYWxsb3dlZEhlYWRlcnMsIGhlYWRlcnNdKSA9PiB7XG4gICAgICAgIC8vIGZpbHRlciB0byBrZWVwIG9ubHkgYWxsb3dlZCBIZWFkZXJzXG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICAgIGlmICghYWxsb3dlZEhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICB0aGlzLnVwcHkubG9nKGBbQ29tcGFuaW9uQ2xpZW50XSBleGNsdWRpbmcgZGlzYWxsb3dlZCBoZWFkZXIgJHtoZWFkZXJ9YClcbiAgICAgICAgICAgIGRlbGV0ZSBoZWFkZXJzW2hlYWRlcl0gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gaGVhZGVyc1xuICAgICAgfSlcbiAgfVxuXG4gIGdldCAocGF0aCwgc2tpcFBvc3RSZXNwb25zZSkge1xuICAgIGNvbnN0IG1ldGhvZCA9ICdnZXQnXG4gICAgcmV0dXJuIHRoaXMucHJlZmxpZ2h0QW5kSGVhZGVycyhwYXRoKVxuICAgICAgLnRoZW4oKGhlYWRlcnMpID0+IGZldGNoV2l0aE5ldHdvcmtFcnJvcih0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgICBjcmVkZW50aWFsczogdGhpcy5vcHRzLmNvbXBhbmlvbkNvb2tpZXNSdWxlIHx8ICdzYW1lLW9yaWdpbicsXG4gICAgICB9KSlcbiAgICAgIC50aGVuKHRoaXMuI2dldFBvc3RSZXNwb25zZUZ1bmMoc2tpcFBvc3RSZXNwb25zZSkpXG4gICAgICAudGhlbihoYW5kbGVKU09OUmVzcG9uc2UpXG4gICAgICAuY2F0Y2godGhpcy4jZXJyb3JIYW5kbGVyKG1ldGhvZCwgcGF0aCkpXG4gIH1cblxuICBwb3N0IChwYXRoLCBkYXRhLCBza2lwUG9zdFJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWV0aG9kID0gJ3Bvc3QnXG4gICAgcmV0dXJuIHRoaXMucHJlZmxpZ2h0QW5kSGVhZGVycyhwYXRoKVxuICAgICAgLnRoZW4oKGhlYWRlcnMpID0+IGZldGNoV2l0aE5ldHdvcmtFcnJvcih0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgICBjcmVkZW50aWFsczogdGhpcy5vcHRzLmNvbXBhbmlvbkNvb2tpZXNSdWxlIHx8ICdzYW1lLW9yaWdpbicsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgfSkpXG4gICAgICAudGhlbih0aGlzLiNnZXRQb3N0UmVzcG9uc2VGdW5jKHNraXBQb3N0UmVzcG9uc2UpKVxuICAgICAgLnRoZW4oaGFuZGxlSlNPTlJlc3BvbnNlKVxuICAgICAgLmNhdGNoKHRoaXMuI2Vycm9ySGFuZGxlcihtZXRob2QsIHBhdGgpKVxuICB9XG5cbiAgZGVsZXRlIChwYXRoLCBkYXRhLCBza2lwUG9zdFJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWV0aG9kID0gJ2RlbGV0ZSdcbiAgICByZXR1cm4gdGhpcy5wcmVmbGlnaHRBbmRIZWFkZXJzKHBhdGgpXG4gICAgICAudGhlbigoaGVhZGVycykgPT4gZmV0Y2hXaXRoTmV0d29ya0Vycm9yKGAke3RoaXMuaG9zdG5hbWV9LyR7cGF0aH1gLCB7XG4gICAgICAgIG1ldGhvZCxcbiAgICAgICAgaGVhZGVycyxcbiAgICAgICAgY3JlZGVudGlhbHM6IHRoaXMub3B0cy5jb21wYW5pb25Db29raWVzUnVsZSB8fCAnc2FtZS1vcmlnaW4nLFxuICAgICAgICBib2R5OiBkYXRhID8gSlNPTi5zdHJpbmdpZnkoZGF0YSkgOiBudWxsLFxuICAgICAgfSkpXG4gICAgICAudGhlbih0aGlzLiNnZXRQb3N0UmVzcG9uc2VGdW5jKHNraXBQb3N0UmVzcG9uc2UpKVxuICAgICAgLnRoZW4oaGFuZGxlSlNPTlJlc3BvbnNlKVxuICAgICAgLmNhdGNoKHRoaXMuI2Vycm9ySGFuZGxlcihtZXRob2QsIHBhdGgpKVxuICB9XG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgUmVxdWVzdENsaWVudCA9IHJlcXVpcmUoJy4vUmVxdWVzdENsaWVudCcpXG5cbmNvbnN0IGdldE5hbWUgPSAoaWQpID0+IHtcbiAgcmV0dXJuIGlkLnNwbGl0KCctJykubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSkuam9pbignICcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU2VhcmNoUHJvdmlkZXIgZXh0ZW5kcyBSZXF1ZXN0Q2xpZW50IHtcbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICBzdXBlcih1cHB5LCBvcHRzKVxuICAgIHRoaXMucHJvdmlkZXIgPSBvcHRzLnByb3ZpZGVyXG4gICAgdGhpcy5pZCA9IHRoaXMucHJvdmlkZXJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9wdHMubmFtZSB8fCBnZXROYW1lKHRoaXMuaWQpXG4gICAgdGhpcy5wbHVnaW5JZCA9IHRoaXMub3B0cy5wbHVnaW5JZFxuICB9XG5cbiAgZmlsZVVybCAoaWQpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5ob3N0bmFtZX0vc2VhcmNoLyR7dGhpcy5pZH0vZ2V0LyR7aWR9YFxuICB9XG5cbiAgc2VhcmNoICh0ZXh0LCBxdWVyaWVzKSB7XG4gICAgcXVlcmllcyA9IHF1ZXJpZXMgPyBgJiR7cXVlcmllc31gIDogJydcbiAgICByZXR1cm4gdGhpcy5nZXQoYHNlYXJjaC8ke3RoaXMuaWR9L2xpc3Q/cT0ke2VuY29kZVVSSUNvbXBvbmVudCh0ZXh0KX0ke3F1ZXJpZXN9YClcbiAgfVxufVxuIiwiY29uc3QgZWUgPSByZXF1aXJlKCduYW1lc3BhY2UtZW1pdHRlcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVXBweVNvY2tldCB7XG4gICNxdWV1ZWQgPSBbXVxuXG4gICNlbWl0dGVyID0gZWUoKVxuXG4gICNpc09wZW4gPSBmYWxzZVxuXG4gICNzb2NrZXRcblxuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIHRoaXMub3B0cyA9IG9wdHNcblxuICAgIGlmICghb3B0cyB8fCBvcHRzLmF1dG9PcGVuICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5vcGVuKClcbiAgICB9XG4gIH1cblxuICBnZXQgaXNPcGVuICgpIHsgcmV0dXJuIHRoaXMuI2lzT3BlbiB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogZ2V0U29ja2V0JyldICgpIHsgcmV0dXJuIHRoaXMuI3NvY2tldCB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogZ2V0UXVldWVkJyldICgpIHsgcmV0dXJuIHRoaXMuI3F1ZXVlZCB9XG5cbiAgb3BlbiAoKSB7XG4gICAgdGhpcy4jc29ja2V0ID0gbmV3IFdlYlNvY2tldCh0aGlzLm9wdHMudGFyZ2V0KVxuXG4gICAgdGhpcy4jc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIHRoaXMuI2lzT3BlbiA9IHRydWVcblxuICAgICAgd2hpbGUgKHRoaXMuI3F1ZXVlZC5sZW5ndGggPiAwICYmIHRoaXMuI2lzT3Blbikge1xuICAgICAgICBjb25zdCBmaXJzdCA9IHRoaXMuI3F1ZXVlZC5zaGlmdCgpXG4gICAgICAgIHRoaXMuc2VuZChmaXJzdC5hY3Rpb24sIGZpcnN0LnBheWxvYWQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4jc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLiNpc09wZW4gPSBmYWxzZVxuICAgIH1cblxuICAgIHRoaXMuI3NvY2tldC5vbm1lc3NhZ2UgPSB0aGlzLiNoYW5kbGVNZXNzYWdlXG4gIH1cblxuICBjbG9zZSAoKSB7XG4gICAgdGhpcy4jc29ja2V0Py5jbG9zZSgpXG4gIH1cblxuICBzZW5kIChhY3Rpb24sIHBheWxvYWQpIHtcbiAgICAvLyBhdHRhY2ggdXVpZFxuXG4gICAgaWYgKCF0aGlzLiNpc09wZW4pIHtcbiAgICAgIHRoaXMuI3F1ZXVlZC5wdXNoKHsgYWN0aW9uLCBwYXlsb2FkIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLiNzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhY3Rpb24sXG4gICAgICBwYXlsb2FkLFxuICAgIH0pKVxuICB9XG5cbiAgb24gKGFjdGlvbiwgaGFuZGxlcikge1xuICAgIHRoaXMuI2VtaXR0ZXIub24oYWN0aW9uLCBoYW5kbGVyKVxuICB9XG5cbiAgZW1pdCAoYWN0aW9uLCBwYXlsb2FkKSB7XG4gICAgdGhpcy4jZW1pdHRlci5lbWl0KGFjdGlvbiwgcGF5bG9hZClcbiAgfVxuXG4gIG9uY2UgKGFjdGlvbiwgaGFuZGxlcikge1xuICAgIHRoaXMuI2VtaXR0ZXIub25jZShhY3Rpb24sIGhhbmRsZXIpXG4gIH1cblxuICAjaGFuZGxlTWVzc2FnZT0gKGUpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZS5kYXRhKVxuICAgICAgdGhpcy5lbWl0KG1lc3NhZ2UuYWN0aW9uLCBtZXNzYWdlLnBheWxvYWQpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBUT0RPOiB1c2UgYSBtb3JlIHJvYnVzdCBlcnJvciBoYW5kbGVyLlxuICAgICAgY29uc29sZS5sb2coZXJyKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIE1hbmFnZXMgY29tbXVuaWNhdGlvbnMgd2l0aCBDb21wYW5pb25cbiAqL1xuXG5jb25zdCBSZXF1ZXN0Q2xpZW50ID0gcmVxdWlyZSgnLi9SZXF1ZXN0Q2xpZW50JylcbmNvbnN0IFByb3ZpZGVyID0gcmVxdWlyZSgnLi9Qcm92aWRlcicpXG5jb25zdCBTZWFyY2hQcm92aWRlciA9IHJlcXVpcmUoJy4vU2VhcmNoUHJvdmlkZXInKVxuY29uc3QgU29ja2V0ID0gcmVxdWlyZSgnLi9Tb2NrZXQnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgUmVxdWVzdENsaWVudCxcbiAgUHJvdmlkZXIsXG4gIFNlYXJjaFByb3ZpZGVyLFxuICBTb2NrZXQsXG59XG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBzZXJ2ZXMgYXMgYW4gQXN5bmMgd3JhcHBlciBmb3IgTG9jYWxTdG9yYWdlXG4gKi9cbm1vZHVsZS5leHBvcnRzLnNldEl0ZW0gPSAoa2V5LCB2YWx1ZSkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKVxuICAgIHJlc29sdmUoKVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cy5nZXRJdGVtID0gKGtleSkgPT4ge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpXG59XG5cbm1vZHVsZS5leHBvcnRzLnJlbW92ZUl0ZW0gPSAoa2V5KSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSlcbiAgICByZXNvbHZlKClcbiAgfSlcbn1cbiIsIi8qKlxuICogQ29yZSBwbHVnaW4gbG9naWMgdGhhdCBhbGwgcGx1Z2lucyBzaGFyZS5cbiAqXG4gKiBCYXNlUGx1Z2luIGRvZXMgbm90IGNvbnRhaW4gRE9NIHJlbmRlcmluZyBzbyBpdCBjYW4gYmUgdXNlZCBmb3IgcGx1Z2luc1xuICogd2l0aG91dCBhIHVzZXIgaW50ZXJmYWNlLlxuICpcbiAqIFNlZSBgUGx1Z2luYCBmb3IgdGhlIGV4dGVuZGVkIHZlcnNpb24gd2l0aCBQcmVhY3QgcmVuZGVyaW5nIGZvciBpbnRlcmZhY2VzLlxuICovXG5cbmNvbnN0IFRyYW5zbGF0b3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvVHJhbnNsYXRvcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQmFzZVBsdWdpbiB7XG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzID0ge30pIHtcbiAgICB0aGlzLnVwcHkgPSB1cHB5XG4gICAgdGhpcy5vcHRzID0gb3B0c1xuICB9XG5cbiAgZ2V0UGx1Z2luU3RhdGUgKCkge1xuICAgIGNvbnN0IHsgcGx1Z2lucyB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICByZXR1cm4gcGx1Z2luc1t0aGlzLmlkXSB8fCB7fVxuICB9XG5cbiAgc2V0UGx1Z2luU3RhdGUgKHVwZGF0ZSkge1xuICAgIGNvbnN0IHsgcGx1Z2lucyB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcblxuICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICBwbHVnaW5zOiB7XG4gICAgICAgIC4uLnBsdWdpbnMsXG4gICAgICAgIFt0aGlzLmlkXToge1xuICAgICAgICAgIC4uLnBsdWdpbnNbdGhpcy5pZF0sXG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuICB9XG5cbiAgc2V0T3B0aW9ucyAobmV3T3B0cykge1xuICAgIHRoaXMub3B0cyA9IHsgLi4udGhpcy5vcHRzLCAuLi5uZXdPcHRzIH1cbiAgICB0aGlzLnNldFBsdWdpblN0YXRlKCkgLy8gc28gdGhhdCBVSSByZS1yZW5kZXJzIHdpdGggbmV3IG9wdGlvbnNcbiAgICB0aGlzLmkxOG5Jbml0KClcbiAgfVxuXG4gIGkxOG5Jbml0ICgpIHtcbiAgICBjb25zdCB0cmFuc2xhdG9yID0gbmV3IFRyYW5zbGF0b3IoW3RoaXMuZGVmYXVsdExvY2FsZSwgdGhpcy51cHB5LmxvY2FsZSwgdGhpcy5vcHRzLmxvY2FsZV0pXG4gICAgdGhpcy5pMThuID0gdHJhbnNsYXRvci50cmFuc2xhdGUuYmluZCh0cmFuc2xhdG9yKVxuICAgIHRoaXMuaTE4bkFycmF5ID0gdHJhbnNsYXRvci50cmFuc2xhdGVBcnJheS5iaW5kKHRyYW5zbGF0b3IpXG4gICAgdGhpcy5zZXRQbHVnaW5TdGF0ZSgpIC8vIHNvIHRoYXQgVUkgcmUtcmVuZGVycyBhbmQgd2Ugc2VlIHRoZSB1cGRhdGVkIGxvY2FsZVxuICB9XG5cbiAgLyoqXG4gICAqIEV4dGVuZGFibGUgbWV0aG9kc1xuICAgKiA9PT09PT09PT09PT09PT09PT1cbiAgICogVGhlc2UgbWV0aG9kcyBhcmUgaGVyZSB0byBzZXJ2ZSBhcyBhbiBvdmVydmlldyBvZiB0aGUgZXh0ZW5kYWJsZSBtZXRob2RzIGFzIHdlbGwgYXNcbiAgICogbWFraW5nIHRoZW0gbm90IGNvbmRpdGlvbmFsIGluIHVzZSwgc3VjaCBhcyBgaWYgKHRoaXMuYWZ0ZXJVcGRhdGUpYC5cbiAgICovXG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgYWRkVGFyZ2V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4dGVuZCB0aGUgYWRkVGFyZ2V0IG1ldGhvZCB0byBhZGQgeW91ciBwbHVnaW4gdG8gYW5vdGhlciBwbHVnaW5cXCdzIHRhcmdldCcpXG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2xhc3MtbWV0aG9kcy11c2UtdGhpc1xuICBpbnN0YWxsICgpIHt9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgdW5pbnN0YWxsICgpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHBsdWdpbiBpcyBtb3VudGVkLCB3aGV0aGVyIGluIERPTSBvciBpbnRvIGFub3RoZXIgcGx1Z2luLlxuICAgKiBOZWVkZWQgYmVjYXVzZSBzb21ldGltZXMgcGx1Z2lucyBhcmUgbW91bnRlZCBzZXBhcmF0ZWx5L2FmdGVyIGBpbnN0YWxsYCxcbiAgICogc28gdGhpcy5lbCBhbmQgdGhpcy5wYXJlbnQgbWlnaHQgbm90IGJlIGF2YWlsYWJsZSBpbiBgaW5zdGFsbGAuXG4gICAqIFRoaXMgaXMgdGhlIGNhc2Ugd2l0aCBAdXBweS9yZWFjdCBwbHVnaW5zLCBmb3IgZXhhbXBsZS5cbiAgICovXG4gIHJlbmRlciAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHRlbmQgdGhlIHJlbmRlciBtZXRob2QgdG8gYWRkIHlvdXIgcGx1Z2luIHRvIGEgRE9NIGVsZW1lbnQnKVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgdXBkYXRlICgpIHt9XG5cbiAgLy8gQ2FsbGVkIGFmdGVyIGV2ZXJ5IHN0YXRlIHVwZGF0ZSwgYWZ0ZXIgZXZlcnl0aGluZydzIG1vdW50ZWQuIERlYm91bmNlZC5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgYWZ0ZXJVcGRhdGUgKCkge31cbn1cbiIsImNvbnN0IHsgcmVuZGVyIH0gPSByZXF1aXJlKCdwcmVhY3QnKVxuY29uc3QgZmluZERPTUVsZW1lbnQgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZmluZERPTUVsZW1lbnQnKVxuXG5jb25zdCBCYXNlUGx1Z2luID0gcmVxdWlyZSgnLi9CYXNlUGx1Z2luJylcblxuLyoqXG4gKiBEZWZlciBhIGZyZXF1ZW50IGNhbGwgdG8gdGhlIG1pY3JvdGFzayBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0geygpID0+IFR9IGZuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxUPn1cbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UgKGZuKSB7XG4gIGxldCBjYWxsaW5nID0gbnVsbFxuICBsZXQgbGF0ZXN0QXJncyA9IG51bGxcbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgbGF0ZXN0QXJncyA9IGFyZ3NcbiAgICBpZiAoIWNhbGxpbmcpIHtcbiAgICAgIGNhbGxpbmcgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY2FsbGluZyA9IG51bGxcbiAgICAgICAgLy8gQXQgdGhpcyBwb2ludCBgYXJnc2AgbWF5IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBtb3N0XG4gICAgICAgIC8vIHJlY2VudCBzdGF0ZSwgaWYgbXVsdGlwbGUgY2FsbHMgaGFwcGVuZWQgc2luY2UgdGhpcyB0YXNrXG4gICAgICAgIC8vIHdhcyBxdWV1ZWQuIFNvIHdlIHVzZSB0aGUgYGxhdGVzdEFyZ3NgLCB3aGljaCBkZWZpbml0ZWx5XG4gICAgICAgIC8vIGlzIHRoZSBtb3N0IHJlY2VudCBjYWxsLlxuICAgICAgICByZXR1cm4gZm4oLi4ubGF0ZXN0QXJncylcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBjYWxsaW5nXG4gIH1cbn1cblxuLyoqXG4gKiBVSVBsdWdpbiBpcyB0aGUgZXh0ZW5kZWQgdmVyc2lvbiBvZiBCYXNlUGx1Z2luIHRvIGluY29ycG9yYXRlIHJlbmRlcmluZyB3aXRoIFByZWFjdC5cbiAqIFVzZSB0aGlzIGZvciBwbHVnaW5zIHRoYXQgbmVlZCBhIHVzZXIgaW50ZXJmYWNlLlxuICpcbiAqIEZvciBwbHVnaW5zIHdpdGhvdXQgYW4gdXNlciBpbnRlcmZhY2UsIHNlZSBCYXNlUGx1Z2luLlxuICovXG5jbGFzcyBVSVBsdWdpbiBleHRlbmRzIEJhc2VQbHVnaW4ge1xuICAjdXBkYXRlVUlcblxuICAvKipcbiAgICogQ2hlY2sgaWYgc3VwcGxpZWQgYHRhcmdldGAgaXMgYSBET00gZWxlbWVudCBvciBhbiBgb2JqZWN0YC5cbiAgICogSWYgaXTigJlzIGFuIG9iamVjdCDigJQgdGFyZ2V0IGlzIGEgcGx1Z2luLCBhbmQgd2Ugc2VhcmNoIGBwbHVnaW5zYFxuICAgKiBmb3IgYSBwbHVnaW4gd2l0aCBzYW1lIG5hbWUgYW5kIHJldHVybiBpdHMgdGFyZ2V0LlxuICAgKi9cbiAgbW91bnQgKHRhcmdldCwgcGx1Z2luKSB7XG4gICAgY29uc3QgY2FsbGVyUGx1Z2luTmFtZSA9IHBsdWdpbi5pZFxuXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGZpbmRET01FbGVtZW50KHRhcmdldClcblxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICB0aGlzLmlzVGFyZ2V0RE9NRWwgPSB0cnVlXG4gICAgICAvLyBXaGVuIHRhcmdldCBpcyA8Ym9keT4gd2l0aCBhIHNpbmdsZSA8ZGl2PiBlbGVtZW50LFxuICAgICAgLy8gUHJlYWN0IHRoaW5rcyBpdOKAmXMgdGhlIFVwcHkgcm9vdCBlbGVtZW50IGluIHRoZXJlIHdoZW4gZG9pbmcgYSBkaWZmLFxuICAgICAgLy8gYW5kIGRlc3Ryb3lzIGl0LiBTbyB3ZSBhcmUgY3JlYXRpbmcgYSBmcmFnbWVudCAoY291bGQgYmUgZW1wdHkgZGl2KVxuICAgICAgY29uc3QgdXBweVJvb3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cbiAgICAgIC8vIEFQSSBmb3IgcGx1Z2lucyB0aGF0IHJlcXVpcmUgYSBzeW5jaHJvbm91cyByZXJlbmRlci5cbiAgICAgIHRoaXMuI3VwZGF0ZVVJID0gZGVib3VuY2UoKHN0YXRlKSA9PiB7XG4gICAgICAgIC8vIHBsdWdpbiBjb3VsZCBiZSByZW1vdmVkLCBidXQgdGhpcy5yZXJlbmRlciBpcyBkZWJvdW5jZWQgYmVsb3csXG4gICAgICAgIC8vIHNvIGl0IGNvdWxkIHN0aWxsIGJlIGNhbGxlZCBldmVuIGFmdGVyIHVwcHkucmVtb3ZlUGx1Z2luIG9yIHVwcHkuY2xvc2VcbiAgICAgICAgLy8gaGVuY2UgdGhlIGNoZWNrXG4gICAgICAgIGlmICghdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLmlkKSkgcmV0dXJuXG4gICAgICAgIHJlbmRlcih0aGlzLnJlbmRlcihzdGF0ZSksIHVwcHlSb290RWxlbWVudClcbiAgICAgICAgdGhpcy5hZnRlclVwZGF0ZSgpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnVwcHkubG9nKGBJbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX0gdG8gYSBET00gZWxlbWVudCAnJHt0YXJnZXR9J2ApXG5cbiAgICAgIGlmICh0aGlzLm9wdHMucmVwbGFjZVRhcmdldENvbnRlbnQpIHtcbiAgICAgICAgLy8gRG9pbmcgcmVuZGVyKGgobnVsbCksIHRhcmdldEVsZW1lbnQpLCB3aGljaCBzaG91bGQgaGF2ZSBiZWVuXG4gICAgICAgIC8vIGEgYmV0dGVyIHdheSwgc2luY2UgYmVjYXVzZSB0aGUgY29tcG9uZW50IG1pZ2h0IG5lZWQgdG8gZG8gYWRkaXRpb25hbCBjbGVhbnVwIHdoZW4gaXQgaXMgcmVtb3ZlZCxcbiAgICAgICAgLy8gc3RvcHBlZCB3b3JraW5nIOKAlCBQcmVhY3QganVzdCBhZGRzIG51bGwgaW50byB0YXJnZXQsIG5vdCByZXBsYWNpbmdcbiAgICAgICAgdGFyZ2V0RWxlbWVudC5pbm5lckhUTUwgPSAnJ1xuICAgICAgfVxuXG4gICAgICByZW5kZXIodGhpcy5yZW5kZXIodGhpcy51cHB5LmdldFN0YXRlKCkpLCB1cHB5Um9vdEVsZW1lbnQpXG4gICAgICB0aGlzLmVsID0gdXBweVJvb3RFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkXG4gICAgICB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKHVwcHlSb290RWxlbWVudClcblxuICAgICAgdGhpcy5vbk1vdW50KClcblxuICAgICAgcmV0dXJuIHRoaXMuZWxcbiAgICB9XG5cbiAgICBsZXQgdGFyZ2V0UGx1Z2luXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnICYmIHRhcmdldCBpbnN0YW5jZW9mIFVJUGx1Z2luKSB7XG4gICAgICAvLyBUYXJnZXRpbmcgYSBwbHVnaW4gKmluc3RhbmNlKlxuICAgICAgdGFyZ2V0UGx1Z2luID0gdGFyZ2V0XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBUYXJnZXRpbmcgYSBwbHVnaW4gdHlwZVxuICAgICAgY29uc3QgVGFyZ2V0ID0gdGFyZ2V0XG4gICAgICAvLyBGaW5kIHRoZSB0YXJnZXQgcGx1Z2luIGluc3RhbmNlLlxuICAgICAgdGhpcy51cHB5Lml0ZXJhdGVQbHVnaW5zKHAgPT4ge1xuICAgICAgICBpZiAocCBpbnN0YW5jZW9mIFRhcmdldCkge1xuICAgICAgICAgIHRhcmdldFBsdWdpbiA9IHBcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0UGx1Z2luKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKGBJbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX0gdG8gJHt0YXJnZXRQbHVnaW4uaWR9YClcbiAgICAgIHRoaXMucGFyZW50ID0gdGFyZ2V0UGx1Z2luXG4gICAgICB0aGlzLmVsID0gdGFyZ2V0UGx1Z2luLmFkZFRhcmdldChwbHVnaW4pXG5cbiAgICAgIHRoaXMub25Nb3VudCgpXG4gICAgICByZXR1cm4gdGhpcy5lbFxuICAgIH1cblxuICAgIHRoaXMudXBweS5sb2coYE5vdCBpbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX1gKVxuXG4gICAgbGV0IG1lc3NhZ2UgPSBgSW52YWxpZCB0YXJnZXQgb3B0aW9uIGdpdmVuIHRvICR7Y2FsbGVyUGx1Z2luTmFtZX0uYFxuICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXNzYWdlICs9ICcgVGhlIGdpdmVuIHRhcmdldCBpcyBub3QgYSBQbHVnaW4gY2xhc3MuICdcbiAgICAgICAgKyAnUGxlYXNlIGNoZWNrIHRoYXQgeW91XFwncmUgbm90IHNwZWNpZnlpbmcgYSBSZWFjdCBDb21wb25lbnQgaW5zdGVhZCBvZiBhIHBsdWdpbi4gJ1xuICAgICAgICArICdJZiB5b3UgYXJlIHVzaW5nIEB1cHB5LyogcGFja2FnZXMgZGlyZWN0bHksIG1ha2Ugc3VyZSB5b3UgaGF2ZSBvbmx5IDEgdmVyc2lvbiBvZiBAdXBweS9jb3JlIGluc3RhbGxlZDogJ1xuICAgICAgICArICdydW4gYG5wbSBscyBAdXBweS9jb3JlYCBvbiB0aGUgY29tbWFuZCBsaW5lIGFuZCB2ZXJpZnkgdGhhdCBhbGwgdGhlIHZlcnNpb25zIG1hdGNoIGFuZCBhcmUgZGVkdXBlZCBjb3JyZWN0bHkuJ1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlICs9ICdJZiB5b3UgbWVhbnQgdG8gdGFyZ2V0IGFuIEhUTUwgZWxlbWVudCwgcGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHRoZSBlbGVtZW50IGV4aXN0cy4gJ1xuICAgICAgICArICdDaGVjayB0aGF0IHRoZSA8c2NyaXB0PiB0YWcgaW5pdGlhbGl6aW5nIFVwcHkgaXMgcmlnaHQgYmVmb3JlIHRoZSBjbG9zaW5nIDwvYm9keT4gdGFnIGF0IHRoZSBlbmQgb2YgdGhlIHBhZ2UuICdcbiAgICAgICAgKyAnKHNlZSBodHRwczovL2dpdGh1Yi5jb20vdHJhbnNsb2FkaXQvdXBweS9pc3N1ZXMvMTA0MilcXG5cXG4nXG4gICAgICAgICsgJ0lmIHlvdSBtZWFudCB0byB0YXJnZXQgYSBwbHVnaW4sIHBsZWFzZSBjb25maXJtIHRoYXQgeW91ciBgaW1wb3J0YCBzdGF0ZW1lbnRzIG9yIGByZXF1aXJlYCBjYWxscyBhcmUgY29ycmVjdC4nXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKVxuICB9XG5cbiAgdXBkYXRlIChzdGF0ZSkge1xuICAgIGlmICh0aGlzLmVsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuI3VwZGF0ZVVJPy4oc3RhdGUpXG4gICAgfVxuICB9XG5cbiAgdW5tb3VudCAoKSB7XG4gICAgaWYgKHRoaXMuaXNUYXJnZXRET01FbCkge1xuICAgICAgdGhpcy5lbD8ucmVtb3ZlKClcbiAgICB9XG4gICAgdGhpcy5vblVubW91bnQoKVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgb25Nb3VudCAoKSB7fVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzXG4gIG9uVW5tb3VudCAoKSB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVJUGx1Z2luXG4iLCIvKiBnbG9iYWwgQWdncmVnYXRlRXJyb3IgKi9cblxuJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IFRyYW5zbGF0b3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvVHJhbnNsYXRvcicpXG5jb25zdCBlZSA9IHJlcXVpcmUoJ25hbWVzcGFjZS1lbWl0dGVyJylcbmNvbnN0IHsgbmFub2lkIH0gPSByZXF1aXJlKCduYW5vaWQnKVxuY29uc3QgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKVxuY29uc3QgcHJldHRpZXJCeXRlcyA9IHJlcXVpcmUoJ0B0cmFuc2xvYWRpdC9wcmV0dGllci1ieXRlcycpXG5jb25zdCBtYXRjaCA9IHJlcXVpcmUoJ21pbWUtbWF0Y2gnKVxuY29uc3QgRGVmYXVsdFN0b3JlID0gcmVxdWlyZSgnQHVwcHkvc3RvcmUtZGVmYXVsdCcpXG5jb25zdCBnZXRGaWxlVHlwZSA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRGaWxlVHlwZScpXG5jb25zdCBnZXRGaWxlTmFtZUFuZEV4dGVuc2lvbiA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRGaWxlTmFtZUFuZEV4dGVuc2lvbicpXG5jb25zdCBnZW5lcmF0ZUZpbGVJRCA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZW5lcmF0ZUZpbGVJRCcpXG5jb25zdCBzdXBwb3J0c1VwbG9hZFByb2dyZXNzID0gcmVxdWlyZSgnLi9zdXBwb3J0c1VwbG9hZFByb2dyZXNzJylcbmNvbnN0IGdldEZpbGVOYW1lID0gcmVxdWlyZSgnLi9nZXRGaWxlTmFtZScpXG5jb25zdCB7IGp1c3RFcnJvcnNMb2dnZXIsIGRlYnVnTG9nZ2VyIH0gPSByZXF1aXJlKCcuL2xvZ2dlcnMnKVxuXG4vLyBFeHBvcnRlZCBmcm9tIGhlcmUuXG5jbGFzcyBSZXN0cmljdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvciAoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpXG4gICAgdGhpcy5pc1Jlc3RyaWN0aW9uID0gdHJ1ZVxuICB9XG59XG5pZiAodHlwZW9mIEFnZ3JlZ2F0ZUVycm9yID09PSAndW5kZWZpbmVkJykge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZ2xvYmFsLWFzc2lnblxuICBnbG9iYWxUaGlzLkFnZ3JlZ2F0ZUVycm9yID0gY2xhc3MgQWdncmVnYXRlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IgKG1lc3NhZ2UsIGVycm9ycykge1xuICAgICAgc3VwZXIobWVzc2FnZSlcbiAgICAgIHRoaXMuZXJyb3JzID0gZXJyb3JzXG4gICAgfVxuICB9XG59XG5jbGFzcyBBZ2dyZWdhdGVSZXN0cmljdGlvbkVycm9yIGV4dGVuZHMgQWdncmVnYXRlRXJyb3Ige1xuICBjb25zdHJ1Y3RvciAoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpXG4gICAgdGhpcy5pc1Jlc3RyaWN0aW9uID0gdHJ1ZVxuICB9XG59XG5cbi8qKlxuICogVXBweSBDb3JlIG1vZHVsZS5cbiAqIE1hbmFnZXMgcGx1Z2lucywgc3RhdGUgdXBkYXRlcywgYWN0cyBhcyBhbiBldmVudCBidXMsXG4gKiBhZGRzL3JlbW92ZXMgZmlsZXMgYW5kIG1ldGFkYXRhLlxuICovXG5jbGFzcyBVcHB5IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGdsb2JhbC1yZXF1aXJlXG4gIHN0YXRpYyBWRVJTSU9OID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvblxuXG4gIC8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgQmFzZVBsdWdpbltdPn0gKi9cbiAgI3BsdWdpbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgI3N0b3JlVW5zdWJzY3JpYmVcblxuICAjZW1pdHRlciA9IGVlKClcblxuICAjcHJlUHJvY2Vzc29ycyA9IG5ldyBTZXQoKVxuXG4gICN1cGxvYWRlcnMgPSBuZXcgU2V0KClcblxuICAjcG9zdFByb2Nlc3NvcnMgPSBuZXcgU2V0KClcblxuICAvKipcbiAgICogSW5zdGFudGlhdGUgVXBweVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0cyDigJQgVXBweSBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIHRoaXMuZGVmYXVsdExvY2FsZSA9IHtcbiAgICAgIHN0cmluZ3M6IHtcbiAgICAgICAgYWRkQnVsa0ZpbGVzRmFpbGVkOiB7XG4gICAgICAgICAgMDogJ0ZhaWxlZCB0byBhZGQgJXtzbWFydF9jb3VudH0gZmlsZSBkdWUgdG8gYW4gaW50ZXJuYWwgZXJyb3InLFxuICAgICAgICAgIDE6ICdGYWlsZWQgdG8gYWRkICV7c21hcnRfY291bnR9IGZpbGVzIGR1ZSB0byBpbnRlcm5hbCBlcnJvcnMnLFxuICAgICAgICB9LFxuICAgICAgICB5b3VDYW5Pbmx5VXBsb2FkWDoge1xuICAgICAgICAgIDA6ICdZb3UgY2FuIG9ubHkgdXBsb2FkICV7c21hcnRfY291bnR9IGZpbGUnLFxuICAgICAgICAgIDE6ICdZb3UgY2FuIG9ubHkgdXBsb2FkICV7c21hcnRfY291bnR9IGZpbGVzJyxcbiAgICAgICAgfSxcbiAgICAgICAgeW91SGF2ZVRvQXRMZWFzdFNlbGVjdFg6IHtcbiAgICAgICAgICAwOiAnWW91IGhhdmUgdG8gc2VsZWN0IGF0IGxlYXN0ICV7c21hcnRfY291bnR9IGZpbGUnLFxuICAgICAgICAgIDE6ICdZb3UgaGF2ZSB0byBzZWxlY3QgYXQgbGVhc3QgJXtzbWFydF9jb3VudH0gZmlsZXMnLFxuICAgICAgICB9LFxuICAgICAgICBleGNlZWRzU2l6ZTogJyV7ZmlsZX0gZXhjZWVkcyBtYXhpbXVtIGFsbG93ZWQgc2l6ZSBvZiAle3NpemV9JyxcbiAgICAgICAgbWlzc2luZ1JlcXVpcmVkTWV0YUZpZWxkOiAnTWlzc2luZyByZXF1aXJlZCBtZXRhIGZpZWxkcycsXG4gICAgICAgIG1pc3NpbmdSZXF1aXJlZE1ldGFGaWVsZE9uRmlsZTogJ01pc3NpbmcgcmVxdWlyZWQgbWV0YSBmaWVsZHMgaW4gJXtmaWxlTmFtZX0nLFxuICAgICAgICBpbmZlcmlvclNpemU6ICdUaGlzIGZpbGUgaXMgc21hbGxlciB0aGFuIHRoZSBhbGxvd2VkIHNpemUgb2YgJXtzaXplfScsXG4gICAgICAgIHlvdUNhbk9ubHlVcGxvYWRGaWxlVHlwZXM6ICdZb3UgY2FuIG9ubHkgdXBsb2FkOiAle3R5cGVzfScsXG4gICAgICAgIG5vTW9yZUZpbGVzQWxsb3dlZDogJ0Nhbm5vdCBhZGQgbW9yZSBmaWxlcycsXG4gICAgICAgIG5vRHVwbGljYXRlczogJ0Nhbm5vdCBhZGQgdGhlIGR1cGxpY2F0ZSBmaWxlIFxcJyV7ZmlsZU5hbWV9XFwnLCBpdCBhbHJlYWR5IGV4aXN0cycsXG4gICAgICAgIGNvbXBhbmlvbkVycm9yOiAnQ29ubmVjdGlvbiB3aXRoIENvbXBhbmlvbiBmYWlsZWQnLFxuICAgICAgICBhdXRoQWJvcnRlZDogJ0F1dGhlbnRpY2F0aW9uIGFib3J0ZWQnLFxuICAgICAgICBjb21wYW5pb25VbmF1dGhvcml6ZUhpbnQ6ICdUbyB1bmF1dGhvcml6ZSB0byB5b3VyICV7cHJvdmlkZXJ9IGFjY291bnQsIHBsZWFzZSBnbyB0byAle3VybH0nLFxuICAgICAgICBmYWlsZWRUb1VwbG9hZDogJ0ZhaWxlZCB0byB1cGxvYWQgJXtmaWxlfScsXG4gICAgICAgIG5vSW50ZXJuZXRDb25uZWN0aW9uOiAnTm8gSW50ZXJuZXQgY29ubmVjdGlvbicsXG4gICAgICAgIGNvbm5lY3RlZFRvSW50ZXJuZXQ6ICdDb25uZWN0ZWQgdG8gdGhlIEludGVybmV0JyxcbiAgICAgICAgLy8gU3RyaW5ncyBmb3IgcmVtb3RlIHByb3ZpZGVyc1xuICAgICAgICBub0ZpbGVzRm91bmQ6ICdZb3UgaGF2ZSBubyBmaWxlcyBvciBmb2xkZXJzIGhlcmUnLFxuICAgICAgICBzZWxlY3RYOiB7XG4gICAgICAgICAgMDogJ1NlbGVjdCAle3NtYXJ0X2NvdW50fScsXG4gICAgICAgICAgMTogJ1NlbGVjdCAle3NtYXJ0X2NvdW50fScsXG4gICAgICAgIH0sXG4gICAgICAgIGFsbEZpbGVzRnJvbUZvbGRlck5hbWVkOiAnQWxsIGZpbGVzIGZyb20gZm9sZGVyICV7bmFtZX0nLFxuICAgICAgICBvcGVuRm9sZGVyTmFtZWQ6ICdPcGVuIGZvbGRlciAle25hbWV9JyxcbiAgICAgICAgY2FuY2VsOiAnQ2FuY2VsJyxcbiAgICAgICAgbG9nT3V0OiAnTG9nIG91dCcsXG4gICAgICAgIGZpbHRlcjogJ0ZpbHRlcicsXG4gICAgICAgIHJlc2V0RmlsdGVyOiAnUmVzZXQgZmlsdGVyJyxcbiAgICAgICAgbG9hZGluZzogJ0xvYWRpbmcuLi4nLFxuICAgICAgICBhdXRoZW50aWNhdGVXaXRoVGl0bGU6ICdQbGVhc2UgYXV0aGVudGljYXRlIHdpdGggJXtwbHVnaW5OYW1lfSB0byBzZWxlY3QgZmlsZXMnLFxuICAgICAgICBhdXRoZW50aWNhdGVXaXRoOiAnQ29ubmVjdCB0byAle3BsdWdpbk5hbWV9JyxcbiAgICAgICAgc2lnbkluV2l0aEdvb2dsZTogJ1NpZ24gaW4gd2l0aCBHb29nbGUnLFxuICAgICAgICBzZWFyY2hJbWFnZXM6ICdTZWFyY2ggZm9yIGltYWdlcycsXG4gICAgICAgIGVudGVyVGV4dFRvU2VhcmNoOiAnRW50ZXIgdGV4dCB0byBzZWFyY2ggZm9yIGltYWdlcycsXG4gICAgICAgIGJhY2tUb1NlYXJjaDogJ0JhY2sgdG8gU2VhcmNoJyxcbiAgICAgICAgZW1wdHlGb2xkZXJBZGRlZDogJ05vIGZpbGVzIHdlcmUgYWRkZWQgZnJvbSBlbXB0eSBmb2xkZXInLFxuICAgICAgICBmb2xkZXJBbHJlYWR5QWRkZWQ6ICdUaGUgZm9sZGVyIFwiJXtmb2xkZXJ9XCIgd2FzIGFscmVhZHkgYWRkZWQnLFxuICAgICAgICBmb2xkZXJBZGRlZDoge1xuICAgICAgICAgIDA6ICdBZGRlZCAle3NtYXJ0X2NvdW50fSBmaWxlIGZyb20gJXtmb2xkZXJ9JyxcbiAgICAgICAgICAxOiAnQWRkZWQgJXtzbWFydF9jb3VudH0gZmlsZXMgZnJvbSAle2ZvbGRlcn0nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9XG5cbiAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGlkOiAndXBweScsXG4gICAgICBhdXRvUHJvY2VlZDogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqIEBkZXByZWNhdGVkIFRoZSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkXG4gICAgICAgKi9cbiAgICAgIGFsbG93TXVsdGlwbGVVcGxvYWRzOiB0cnVlLFxuICAgICAgYWxsb3dNdWx0aXBsZVVwbG9hZEJhdGNoZXM6IHRydWUsXG4gICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgICByZXN0cmljdGlvbnM6IHtcbiAgICAgICAgbWF4RmlsZVNpemU6IG51bGwsXG4gICAgICAgIG1pbkZpbGVTaXplOiBudWxsLFxuICAgICAgICBtYXhUb3RhbEZpbGVTaXplOiBudWxsLFxuICAgICAgICBtYXhOdW1iZXJPZkZpbGVzOiBudWxsLFxuICAgICAgICBtaW5OdW1iZXJPZkZpbGVzOiBudWxsLFxuICAgICAgICBhbGxvd2VkRmlsZVR5cGVzOiBudWxsLFxuICAgICAgICByZXF1aXJlZE1ldGFGaWVsZHM6IFtdLFxuICAgICAgfSxcbiAgICAgIG1ldGE6IHt9LFxuICAgICAgb25CZWZvcmVGaWxlQWRkZWQ6IChjdXJyZW50RmlsZSkgPT4gY3VycmVudEZpbGUsXG4gICAgICBvbkJlZm9yZVVwbG9hZDogKGZpbGVzKSA9PiBmaWxlcyxcbiAgICAgIHN0b3JlOiBEZWZhdWx0U3RvcmUoKSxcbiAgICAgIGxvZ2dlcjoganVzdEVycm9yc0xvZ2dlcixcbiAgICAgIGluZm9UaW1lb3V0OiA1MDAwLFxuICAgIH1cblxuICAgIC8vIE1lcmdlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHRoZSBvbmVzIHNldCBieSB1c2VyLFxuICAgIC8vIG1ha2luZyBzdXJlIHRvIG1lcmdlIHJlc3RyaWN0aW9ucyB0b29cbiAgICB0aGlzLm9wdHMgPSB7XG4gICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAgIC4uLm9wdHMsXG4gICAgICByZXN0cmljdGlvbnM6IHtcbiAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMucmVzdHJpY3Rpb25zLFxuICAgICAgICAuLi4ob3B0cyAmJiBvcHRzLnJlc3RyaWN0aW9ucyksXG4gICAgICB9LFxuICAgIH1cblxuICAgIC8vIFN1cHBvcnQgZGVidWc6IHRydWUgZm9yIGJhY2t3YXJkcy1jb21wYXRhYmlsaXR5LCB1bmxlc3MgbG9nZ2VyIGlzIHNldCBpbiBvcHRzXG4gICAgLy8gb3B0cyBpbnN0ZWFkIG9mIHRoaXMub3B0cyB0byBhdm9pZCBjb21wYXJpbmcgb2JqZWN0cyDigJQgd2Ugc2V0IGxvZ2dlcjoganVzdEVycm9yc0xvZ2dlciBpbiBkZWZhdWx0T3B0aW9uc1xuICAgIGlmIChvcHRzICYmIG9wdHMubG9nZ2VyICYmIG9wdHMuZGVidWcpIHtcbiAgICAgIHRoaXMubG9nKCdZb3UgYXJlIHVzaW5nIGEgY3VzdG9tIGBsb2dnZXJgLCBidXQgYWxzbyBzZXQgYGRlYnVnOiB0cnVlYCwgd2hpY2ggdXNlcyBidWlsdC1pbiBsb2dnZXIgdG8gb3V0cHV0IGxvZ3MgdG8gY29uc29sZS4gSWdub3JpbmcgYGRlYnVnOiB0cnVlYCBhbmQgdXNpbmcgeW91ciBjdXN0b20gYGxvZ2dlcmAuJywgJ3dhcm5pbmcnKVxuICAgIH0gZWxzZSBpZiAob3B0cyAmJiBvcHRzLmRlYnVnKSB7XG4gICAgICB0aGlzLm9wdHMubG9nZ2VyID0gZGVidWdMb2dnZXJcbiAgICB9XG5cbiAgICB0aGlzLmxvZyhgVXNpbmcgQ29yZSB2JHt0aGlzLmNvbnN0cnVjdG9yLlZFUlNJT059YClcblxuICAgIGlmICh0aGlzLm9wdHMucmVzdHJpY3Rpb25zLmFsbG93ZWRGaWxlVHlwZXNcbiAgICAgICAgJiYgdGhpcy5vcHRzLnJlc3RyaWN0aW9ucy5hbGxvd2VkRmlsZVR5cGVzICE9PSBudWxsXG4gICAgICAgICYmICFBcnJheS5pc0FycmF5KHRoaXMub3B0cy5yZXN0cmljdGlvbnMuYWxsb3dlZEZpbGVUeXBlcykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ByZXN0cmljdGlvbnMuYWxsb3dlZEZpbGVUeXBlc2AgbXVzdCBiZSBhbiBhcnJheScpXG4gICAgfVxuXG4gICAgdGhpcy5pMThuSW5pdCgpXG5cbiAgICAvLyBfX19XaHkgdGhyb3R0bGUgYXQgNTAwbXM/XG4gICAgLy8gICAgLSBXZSBtdXN0IHRocm90dGxlIGF0ID4yNTBtcyBmb3Igc3VwZXJmb2N1cyBpbiBEYXNoYm9hcmQgdG8gd29yayB3ZWxsXG4gICAgLy8gICAgKGJlY2F1c2UgYW5pbWF0aW9uIHRha2VzIDAuMjVzLCBhbmQgd2Ugd2FudCB0byB3YWl0IGZvciBhbGwgYW5pbWF0aW9ucyB0byBiZSBvdmVyIGJlZm9yZSByZWZvY3VzaW5nKS5cbiAgICAvLyAgICBbUHJhY3RpY2FsIENoZWNrXTogaWYgdGhvdHRsZSBpcyBhdCAxMDBtcywgdGhlbiBpZiB5b3UgYXJlIHVwbG9hZGluZyBhIGZpbGUsXG4gICAgLy8gICAgYW5kIGNsaWNrICdBREQgTU9SRSBGSUxFUycsIC0gZm9jdXMgd29uJ3QgYWN0aXZhdGUgaW4gRmlyZWZveC5cbiAgICAvLyAgICAtIFdlIG11c3QgdGhyb3R0bGUgYXQgYXJvdW5kID41MDBtcyB0byBhdm9pZCBwZXJmb3JtYW5jZSBsYWdzLlxuICAgIC8vICAgIFtQcmFjdGljYWwgQ2hlY2tdIEZpcmVmb3gsIHRyeSB0byB1cGxvYWQgYSBiaWcgZmlsZSBmb3IgYSBwcm9sb25nZWQgcGVyaW9kIG9mIHRpbWUuIExhcHRvcCB3aWxsIHN0YXJ0IHRvIGhlYXQgdXAuXG4gICAgdGhpcy5jYWxjdWxhdGVQcm9ncmVzcyA9IHRocm90dGxlKHRoaXMuY2FsY3VsYXRlUHJvZ3Jlc3MuYmluZCh0aGlzKSwgNTAwLCB7IGxlYWRpbmc6IHRydWUsIHRyYWlsaW5nOiB0cnVlIH0pXG5cbiAgICB0aGlzLnN0b3JlID0gdGhpcy5vcHRzLnN0b3JlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwbHVnaW5zOiB7fSxcbiAgICAgIGZpbGVzOiB7fSxcbiAgICAgIGN1cnJlbnRVcGxvYWRzOiB7fSxcbiAgICAgIGFsbG93TmV3VXBsb2FkOiB0cnVlLFxuICAgICAgY2FwYWJpbGl0aWVzOiB7XG4gICAgICAgIHVwbG9hZFByb2dyZXNzOiBzdXBwb3J0c1VwbG9hZFByb2dyZXNzKCksXG4gICAgICAgIGluZGl2aWR1YWxDYW5jZWxsYXRpb246IHRydWUsXG4gICAgICAgIHJlc3VtYWJsZVVwbG9hZHM6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHRvdGFsUHJvZ3Jlc3M6IDAsXG4gICAgICBtZXRhOiB7IC4uLnRoaXMub3B0cy5tZXRhIH0sXG4gICAgICBpbmZvOiBbXSxcbiAgICAgIHJlY292ZXJlZFN0YXRlOiBudWxsLFxuICAgIH0pXG5cbiAgICB0aGlzLiNzdG9yZVVuc3Vic2NyaWJlID0gdGhpcy5zdG9yZS5zdWJzY3JpYmUoKHByZXZTdGF0ZSwgbmV4dFN0YXRlLCBwYXRjaCkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCdzdGF0ZS11cGRhdGUnLCBwcmV2U3RhdGUsIG5leHRTdGF0ZSwgcGF0Y2gpXG4gICAgICB0aGlzLnVwZGF0ZUFsbChuZXh0U3RhdGUpXG4gICAgfSlcblxuICAgIC8vIEV4cG9zaW5nIHVwcHkgb2JqZWN0IG9uIHdpbmRvdyBmb3IgZGVidWdnaW5nIGFuZCB0ZXN0aW5nXG4gICAgaWYgKHRoaXMub3B0cy5kZWJ1ZyAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgd2luZG93W3RoaXMub3B0cy5pZF0gPSB0aGlzXG4gICAgfVxuXG4gICAgdGhpcy4jYWRkTGlzdGVuZXJzKClcbiAgfVxuXG4gIGVtaXQgKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgdGhpcy4jZW1pdHRlci5lbWl0KGV2ZW50LCAuLi5hcmdzKVxuICB9XG5cbiAgb24gKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIHRoaXMuI2VtaXR0ZXIub24oZXZlbnQsIGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBvbmNlIChldmVudCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLiNlbWl0dGVyLm9uY2UoZXZlbnQsIGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBvZmYgKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIHRoaXMuI2VtaXR0ZXIub2ZmKGV2ZW50LCBjYWxsYmFjaylcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb24gYWxsIHBsdWdpbnMgYW5kIHJ1biBgdXBkYXRlYCBvbiB0aGVtLlxuICAgKiBDYWxsZWQgZWFjaCB0aW1lIHN0YXRlIGNoYW5nZXMuXG4gICAqXG4gICAqL1xuICB1cGRhdGVBbGwgKHN0YXRlKSB7XG4gICAgdGhpcy5pdGVyYXRlUGx1Z2lucyhwbHVnaW4gPT4ge1xuICAgICAgcGx1Z2luLnVwZGF0ZShzdGF0ZSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgc3RhdGUgd2l0aCBhIHBhdGNoXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXRjaCB7Zm9vOiAnYmFyJ31cbiAgICovXG4gIHNldFN0YXRlIChwYXRjaCkge1xuICAgIHRoaXMuc3RvcmUuc2V0U3RhdGUocGF0Y2gpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBjdXJyZW50IHN0YXRlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0U3RhdGUgKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JlLmdldFN0YXRlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBCYWNrIGNvbXBhdCBmb3Igd2hlbiB1cHB5LnN0YXRlIGlzIHVzZWQgaW5zdGVhZCBvZiB1cHB5LmdldFN0YXRlKCkuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBnZXQgc3RhdGUgKCkge1xuICAgIC8vIEhlcmUsIHN0YXRlIGlzIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkuXG4gICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGUoKVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0aGFuZCB0byBzZXQgc3RhdGUgZm9yIGEgc3BlY2lmaWMgZmlsZS5cbiAgICovXG4gIHNldEZpbGVTdGF0ZSAoZmlsZUlELCBzdGF0ZSkge1xuICAgIGlmICghdGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fu4oCZdCBzZXQgc3RhdGUgZm9yICR7ZmlsZUlEfSAodGhlIGZpbGUgY291bGQgaGF2ZSBiZWVuIHJlbW92ZWQpYClcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5maWxlcywgW2ZpbGVJRF06IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF0sIC4uLnN0YXRlIH0gfSxcbiAgICB9KVxuICB9XG5cbiAgaTE4bkluaXQgKCkge1xuICAgIGNvbnN0IHRyYW5zbGF0b3IgPSBuZXcgVHJhbnNsYXRvcihbdGhpcy5kZWZhdWx0TG9jYWxlLCB0aGlzLm9wdHMubG9jYWxlXSlcbiAgICB0aGlzLmkxOG4gPSB0cmFuc2xhdG9yLnRyYW5zbGF0ZS5iaW5kKHRyYW5zbGF0b3IpXG4gICAgdGhpcy5pMThuQXJyYXkgPSB0cmFuc2xhdG9yLnRyYW5zbGF0ZUFycmF5LmJpbmQodHJhbnNsYXRvcilcbiAgICB0aGlzLmxvY2FsZSA9IHRyYW5zbGF0b3IubG9jYWxlXG4gIH1cblxuICBzZXRPcHRpb25zIChuZXdPcHRzKSB7XG4gICAgdGhpcy5vcHRzID0ge1xuICAgICAgLi4udGhpcy5vcHRzLFxuICAgICAgLi4ubmV3T3B0cyxcbiAgICAgIHJlc3RyaWN0aW9uczoge1xuICAgICAgICAuLi50aGlzLm9wdHMucmVzdHJpY3Rpb25zLFxuICAgICAgICAuLi4obmV3T3B0cyAmJiBuZXdPcHRzLnJlc3RyaWN0aW9ucyksXG4gICAgICB9LFxuICAgIH1cblxuICAgIGlmIChuZXdPcHRzLm1ldGEpIHtcbiAgICAgIHRoaXMuc2V0TWV0YShuZXdPcHRzLm1ldGEpXG4gICAgfVxuXG4gICAgdGhpcy5pMThuSW5pdCgpXG5cbiAgICBpZiAobmV3T3B0cy5sb2NhbGUpIHtcbiAgICAgIHRoaXMuaXRlcmF0ZVBsdWdpbnMoKHBsdWdpbikgPT4ge1xuICAgICAgICBwbHVnaW4uc2V0T3B0aW9ucygpXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIE5vdGU6IHRoaXMgaXMgbm90IHRoZSBwcmVhY3QgYHNldFN0YXRlYCwgaXQncyBhbiBpbnRlcm5hbCBmdW5jdGlvbiB0aGF0IGhhcyB0aGUgc2FtZSBuYW1lLlxuICAgIHRoaXMuc2V0U3RhdGUoKSAvLyBzbyB0aGF0IFVJIHJlLXJlbmRlcnMgd2l0aCBuZXcgb3B0aW9uc1xuICB9XG5cbiAgcmVzZXRQcm9ncmVzcyAoKSB7XG4gICAgY29uc3QgZGVmYXVsdFByb2dyZXNzID0ge1xuICAgICAgcGVyY2VudGFnZTogMCxcbiAgICAgIGJ5dGVzVXBsb2FkZWQ6IDAsXG4gICAgICB1cGxvYWRDb21wbGV0ZTogZmFsc2UsXG4gICAgICB1cGxvYWRTdGFydGVkOiBudWxsLFxuICAgIH1cbiAgICBjb25zdCBmaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSB7fVxuICAgIE9iamVjdC5rZXlzKGZpbGVzKS5mb3JFYWNoKGZpbGVJRCA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVkRmlsZSA9IHsgLi4uZmlsZXNbZmlsZUlEXSB9XG4gICAgICB1cGRhdGVkRmlsZS5wcm9ncmVzcyA9IHsgLi4udXBkYXRlZEZpbGUucHJvZ3Jlc3MsIC4uLmRlZmF1bHRQcm9ncmVzcyB9XG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZUlEXSA9IHVwZGF0ZWRGaWxlXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsZXM6IHVwZGF0ZWRGaWxlcyxcbiAgICAgIHRvdGFsUHJvZ3Jlc3M6IDAsXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgncmVzZXQtcHJvZ3Jlc3MnKVxuICB9XG5cbiAgYWRkUHJlUHJvY2Vzc29yIChmbikge1xuICAgIHRoaXMuI3ByZVByb2Nlc3NvcnMuYWRkKGZuKVxuICB9XG5cbiAgcmVtb3ZlUHJlUHJvY2Vzc29yIChmbikge1xuICAgIHJldHVybiB0aGlzLiNwcmVQcm9jZXNzb3JzLmRlbGV0ZShmbilcbiAgfVxuXG4gIGFkZFBvc3RQcm9jZXNzb3IgKGZuKSB7XG4gICAgdGhpcy4jcG9zdFByb2Nlc3NvcnMuYWRkKGZuKVxuICB9XG5cbiAgcmVtb3ZlUG9zdFByb2Nlc3NvciAoZm4pIHtcbiAgICByZXR1cm4gdGhpcy4jcG9zdFByb2Nlc3NvcnMuZGVsZXRlKGZuKVxuICB9XG5cbiAgYWRkVXBsb2FkZXIgKGZuKSB7XG4gICAgdGhpcy4jdXBsb2FkZXJzLmFkZChmbilcbiAgfVxuXG4gIHJlbW92ZVVwbG9hZGVyIChmbikge1xuICAgIHJldHVybiB0aGlzLiN1cGxvYWRlcnMuZGVsZXRlKGZuKVxuICB9XG5cbiAgc2V0TWV0YSAoZGF0YSkge1xuICAgIGNvbnN0IHVwZGF0ZWRNZXRhID0geyAuLi50aGlzLmdldFN0YXRlKCkubWV0YSwgLi4uZGF0YSB9XG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuXG4gICAgT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5mb3JFYWNoKChmaWxlSUQpID0+IHtcbiAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlSURdID0geyAuLi51cGRhdGVkRmlsZXNbZmlsZUlEXSwgbWV0YTogeyAuLi51cGRhdGVkRmlsZXNbZmlsZUlEXS5tZXRhLCAuLi5kYXRhIH0gfVxuICAgIH0pXG5cbiAgICB0aGlzLmxvZygnQWRkaW5nIG1ldGFkYXRhOicpXG4gICAgdGhpcy5sb2coZGF0YSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbWV0YTogdXBkYXRlZE1ldGEsXG4gICAgICBmaWxlczogdXBkYXRlZEZpbGVzLFxuICAgIH0pXG4gIH1cblxuICBzZXRGaWxlTWV0YSAoZmlsZUlELCBkYXRhKSB7XG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuICAgIGlmICghdXBkYXRlZEZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgIHRoaXMubG9nKCdXYXMgdHJ5aW5nIHRvIHNldCBtZXRhZGF0YSBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJywgZmlsZUlEKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IG5ld01ldGEgPSB7IC4uLnVwZGF0ZWRGaWxlc1tmaWxlSURdLm1ldGEsIC4uLmRhdGEgfVxuICAgIHVwZGF0ZWRGaWxlc1tmaWxlSURdID0geyAuLi51cGRhdGVkRmlsZXNbZmlsZUlEXSwgbWV0YTogbmV3TWV0YSB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGZpbGVzOiB1cGRhdGVkRmlsZXMgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBmaWxlIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVJRCBUaGUgSUQgb2YgdGhlIGZpbGUgb2JqZWN0IHRvIHJldHVybi5cbiAgICovXG4gIGdldEZpbGUgKGZpbGVJRCkge1xuICAgIHJldHVybiB0aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZUlEXVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbGwgZmlsZXMgaW4gYW4gYXJyYXkuXG4gICAqL1xuICBnZXRGaWxlcyAoKSB7XG4gICAgY29uc3QgeyBmaWxlcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoZmlsZXMpXG4gIH1cblxuICBnZXRPYmplY3RPZkZpbGVzUGVyU3RhdGUgKCkge1xuICAgIGNvbnN0IHsgZmlsZXM6IGZpbGVzT2JqZWN0LCB0b3RhbFByb2dyZXNzLCBlcnJvciB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgY29uc3QgZmlsZXMgPSBPYmplY3QudmFsdWVzKGZpbGVzT2JqZWN0KVxuICAgIGNvbnN0IGluUHJvZ3Jlc3NGaWxlcyA9IGZpbGVzLmZpbHRlcigoeyBwcm9ncmVzcyB9KSA9PiAhcHJvZ3Jlc3MudXBsb2FkQ29tcGxldGUgJiYgcHJvZ3Jlc3MudXBsb2FkU3RhcnRlZClcbiAgICBjb25zdCBuZXdGaWxlcyA9ICBmaWxlcy5maWx0ZXIoKGZpbGUpID0+ICFmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQpXG4gICAgY29uc3Qgc3RhcnRlZEZpbGVzID0gZmlsZXMuZmlsdGVyKFxuICAgICAgZmlsZSA9PiBmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQgfHwgZmlsZS5wcm9ncmVzcy5wcmVwcm9jZXNzIHx8IGZpbGUucHJvZ3Jlc3MucG9zdHByb2Nlc3NcbiAgICApXG4gICAgY29uc3QgdXBsb2FkU3RhcnRlZEZpbGVzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQpXG4gICAgY29uc3QgcGF1c2VkRmlsZXMgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IGZpbGUuaXNQYXVzZWQpXG4gICAgY29uc3QgY29tcGxldGVGaWxlcyA9IGZpbGVzLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5wcm9ncmVzcy51cGxvYWRDb21wbGV0ZSlcbiAgICBjb25zdCBlcnJvcmVkRmlsZXMgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IGZpbGUuZXJyb3IpXG4gICAgY29uc3QgaW5Qcm9ncmVzc05vdFBhdXNlZEZpbGVzID0gaW5Qcm9ncmVzc0ZpbGVzLmZpbHRlcigoZmlsZSkgPT4gIWZpbGUuaXNQYXVzZWQpXG4gICAgY29uc3QgcHJvY2Vzc2luZ0ZpbGVzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnByb2dyZXNzLnByZXByb2Nlc3MgfHwgZmlsZS5wcm9ncmVzcy5wb3N0cHJvY2VzcylcblxuICAgIHJldHVybiB7XG4gICAgICBuZXdGaWxlcyxcbiAgICAgIHN0YXJ0ZWRGaWxlcyxcbiAgICAgIHVwbG9hZFN0YXJ0ZWRGaWxlcyxcbiAgICAgIHBhdXNlZEZpbGVzLFxuICAgICAgY29tcGxldGVGaWxlcyxcbiAgICAgIGVycm9yZWRGaWxlcyxcbiAgICAgIGluUHJvZ3Jlc3NGaWxlcyxcbiAgICAgIGluUHJvZ3Jlc3NOb3RQYXVzZWRGaWxlcyxcbiAgICAgIHByb2Nlc3NpbmdGaWxlcyxcblxuICAgICAgaXNVcGxvYWRTdGFydGVkOiB1cGxvYWRTdGFydGVkRmlsZXMubGVuZ3RoID4gMCxcbiAgICAgIGlzQWxsQ29tcGxldGU6IHRvdGFsUHJvZ3Jlc3MgPT09IDEwMFxuICAgICAgICAmJiBjb21wbGV0ZUZpbGVzLmxlbmd0aCA9PT0gZmlsZXMubGVuZ3RoXG4gICAgICAgICYmIHByb2Nlc3NpbmdGaWxlcy5sZW5ndGggPT09IDAsXG4gICAgICBpc0FsbEVycm9yZWQ6ICEhZXJyb3IgJiYgZXJyb3JlZEZpbGVzLmxlbmd0aCA9PT0gZmlsZXMubGVuZ3RoLFxuICAgICAgaXNBbGxQYXVzZWQ6IGluUHJvZ3Jlc3NGaWxlcy5sZW5ndGggIT09IDAgJiYgcGF1c2VkRmlsZXMubGVuZ3RoID09PSBpblByb2dyZXNzRmlsZXMubGVuZ3RoLFxuICAgICAgaXNVcGxvYWRJblByb2dyZXNzOiBpblByb2dyZXNzRmlsZXMubGVuZ3RoID4gMCxcbiAgICAgIGlzU29tZUdob3N0OiBmaWxlcy5zb21lKGZpbGUgPT4gZmlsZS5pc0dob3N0KSxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBwdWJsaWMgd3JhcHBlciBmb3IgX2NoZWNrUmVzdHJpY3Rpb25zIOKAlCBjaGVja3MgaWYgYSBmaWxlIHBhc3NlcyBhIHNldCBvZiByZXN0cmljdGlvbnMuXG4gICAqIEZvciB1c2UgaW4gVUkgcGx1aWdpbnMgKGxpa2UgUHJvdmlkZXJzKSwgdG8gZGlzYWxsb3cgc2VsZWN0aW5nIGZpbGVzIHRoYXQgd29u4oCZdCBwYXNzIHJlc3RyaWN0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbGUgb2JqZWN0IHRvIGNoZWNrXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtmaWxlc10gYXJyYXkgdG8gY2hlY2sgbWF4TnVtYmVyT2ZGaWxlcyBhbmQgbWF4VG90YWxGaWxlU2l6ZVxuICAgKiBAcmV0dXJucyB7b2JqZWN0fSB7IHJlc3VsdDogdHJ1ZS9mYWxzZSwgcmVhc29uOiB3aHkgZmlsZSBkaWRu4oCZdCBwYXNzIHJlc3RyaWN0aW9ucyB9XG4gICAqL1xuICB2YWxpZGF0ZVJlc3RyaWN0aW9ucyAoZmlsZSwgZmlsZXMpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy4jY2hlY2tSZXN0cmljdGlvbnMoZmlsZSwgZmlsZXMpXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN1bHQ6IHRydWUsXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN1bHQ6IGZhbHNlLFxuICAgICAgICByZWFzb246IGVyci5tZXNzYWdlLFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBmaWxlIHBhc3NlcyBhIHNldCBvZiByZXN0cmljdGlvbnMgc2V0IGluIG9wdGlvbnM6IG1heEZpbGVTaXplLCBtaW5GaWxlU2l6ZSxcbiAgICogbWF4TnVtYmVyT2ZGaWxlcyBhbmQgYWxsb3dlZEZpbGVUeXBlcy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGZpbGUgb2JqZWN0IHRvIGNoZWNrXG4gICAqIEBwYXJhbSB7QXJyYXl9IFtmaWxlc10gYXJyYXkgdG8gY2hlY2sgbWF4TnVtYmVyT2ZGaWxlcyBhbmQgbWF4VG90YWxGaWxlU2l6ZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgI2NoZWNrUmVzdHJpY3Rpb25zIChmaWxlLCBmaWxlcyA9IHRoaXMuZ2V0RmlsZXMoKSkge1xuICAgIGNvbnN0IHsgbWF4RmlsZVNpemUsIG1pbkZpbGVTaXplLCBtYXhUb3RhbEZpbGVTaXplLCBtYXhOdW1iZXJPZkZpbGVzLCBhbGxvd2VkRmlsZVR5cGVzIH0gPSB0aGlzLm9wdHMucmVzdHJpY3Rpb25zXG5cbiAgICBpZiAobWF4TnVtYmVyT2ZGaWxlcykge1xuICAgICAgaWYgKGZpbGVzLmxlbmd0aCArIDEgPiBtYXhOdW1iZXJPZkZpbGVzKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXN0cmljdGlvbkVycm9yKGAke3RoaXMuaTE4bigneW91Q2FuT25seVVwbG9hZFgnLCB7IHNtYXJ0X2NvdW50OiBtYXhOdW1iZXJPZkZpbGVzIH0pfWApXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFsbG93ZWRGaWxlVHlwZXMpIHtcbiAgICAgIGNvbnN0IGlzQ29ycmVjdEZpbGVUeXBlID0gYWxsb3dlZEZpbGVUeXBlcy5zb21lKCh0eXBlKSA9PiB7XG4gICAgICAgIC8vIGNoZWNrIGlmIHRoaXMgaXMgYSBtaW1lLXR5cGVcbiAgICAgICAgaWYgKHR5cGUuaW5kZXhPZignLycpID4gLTEpIHtcbiAgICAgICAgICBpZiAoIWZpbGUudHlwZSkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgcmV0dXJuIG1hdGNoKGZpbGUudHlwZS5yZXBsYWNlKC87Lio/JC8sICcnKSwgdHlwZSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG90aGVyd2lzZSB0aGlzIGlzIGxpa2VseSBhbiBleHRlbnNpb25cbiAgICAgICAgaWYgKHR5cGVbMF0gPT09ICcuJyAmJiBmaWxlLmV4dGVuc2lvbikge1xuICAgICAgICAgIHJldHVybiBmaWxlLmV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpID09PSB0eXBlLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9KVxuXG4gICAgICBpZiAoIWlzQ29ycmVjdEZpbGVUeXBlKSB7XG4gICAgICAgIGNvbnN0IGFsbG93ZWRGaWxlVHlwZXNTdHJpbmcgPSBhbGxvd2VkRmlsZVR5cGVzLmpvaW4oJywgJylcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCd5b3VDYW5Pbmx5VXBsb2FkRmlsZVR5cGVzJywgeyB0eXBlczogYWxsb3dlZEZpbGVUeXBlc1N0cmluZyB9KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXZSBjYW4ndCBjaGVjayBtYXhUb3RhbEZpbGVTaXplIGlmIHRoZSBzaXplIGlzIHVua25vd24uXG4gICAgaWYgKG1heFRvdGFsRmlsZVNpemUgJiYgZmlsZS5zaXplICE9IG51bGwpIHtcbiAgICAgIGxldCB0b3RhbEZpbGVzU2l6ZSA9IDBcbiAgICAgIHRvdGFsRmlsZXNTaXplICs9IGZpbGUuc2l6ZVxuICAgICAgZmlsZXMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgICB0b3RhbEZpbGVzU2l6ZSArPSBmLnNpemVcbiAgICAgIH0pXG4gICAgICBpZiAodG90YWxGaWxlc1NpemUgPiBtYXhUb3RhbEZpbGVTaXplKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXN0cmljdGlvbkVycm9yKHRoaXMuaTE4bignZXhjZWVkc1NpemUnLCB7XG4gICAgICAgICAgc2l6ZTogcHJldHRpZXJCeXRlcyhtYXhUb3RhbEZpbGVTaXplKSxcbiAgICAgICAgICBmaWxlOiBmaWxlLm5hbWUsXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdlIGNhbid0IGNoZWNrIG1heEZpbGVTaXplIGlmIHRoZSBzaXplIGlzIHVua25vd24uXG4gICAgaWYgKG1heEZpbGVTaXplICYmIGZpbGUuc2l6ZSAhPSBudWxsKSB7XG4gICAgICBpZiAoZmlsZS5zaXplID4gbWF4RmlsZVNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCdleGNlZWRzU2l6ZScsIHtcbiAgICAgICAgICBzaXplOiBwcmV0dGllckJ5dGVzKG1heEZpbGVTaXplKSxcbiAgICAgICAgICBmaWxlOiBmaWxlLm5hbWUsXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdlIGNhbid0IGNoZWNrIG1pbkZpbGVTaXplIGlmIHRoZSBzaXplIGlzIHVua25vd24uXG4gICAgaWYgKG1pbkZpbGVTaXplICYmIGZpbGUuc2l6ZSAhPSBudWxsKSB7XG4gICAgICBpZiAoZmlsZS5zaXplIDwgbWluRmlsZVNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCdpbmZlcmlvclNpemUnLCB7XG4gICAgICAgICAgc2l6ZTogcHJldHRpZXJCeXRlcyhtaW5GaWxlU2l6ZSksXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBtaW5OdW1iZXJPZkZpbGVzIHJlc3RyaWN0aW9uIGlzIHJlYWNoZWQgYmVmb3JlIHVwbG9hZGluZy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gICNjaGVja01pbk51bWJlck9mRmlsZXMgKGZpbGVzKSB7XG4gICAgY29uc3QgeyBtaW5OdW1iZXJPZkZpbGVzIH0gPSB0aGlzLm9wdHMucmVzdHJpY3Rpb25zXG4gICAgaWYgKE9iamVjdC5rZXlzKGZpbGVzKS5sZW5ndGggPCBtaW5OdW1iZXJPZkZpbGVzKSB7XG4gICAgICB0aHJvdyBuZXcgUmVzdHJpY3Rpb25FcnJvcihgJHt0aGlzLmkxOG4oJ3lvdUhhdmVUb0F0TGVhc3RTZWxlY3RYJywgeyBzbWFydF9jb3VudDogbWluTnVtYmVyT2ZGaWxlcyB9KX1gKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiByZXF1aXJlZE1ldGFGaWVsZCByZXN0cmljdGlvbiBpcyBtZXQgYmVmb3JlIHVwbG9hZGluZy5cbiAgICpcbiAgICovXG4gICNjaGVja1JlcXVpcmVkTWV0YUZpZWxkcyAoZmlsZXMpIHtcbiAgICBjb25zdCB7IHJlcXVpcmVkTWV0YUZpZWxkcyB9ID0gdGhpcy5vcHRzLnJlc3RyaWN0aW9uc1xuICAgIGNvbnN0IHsgaGFzT3duUHJvcGVydHkgfSA9IE9iamVjdC5wcm90b3R5cGVcblxuICAgIGNvbnN0IGVycm9ycyA9IFtdXG4gICAgZm9yIChjb25zdCBmaWxlSUQgb2YgT2JqZWN0LmtleXMoZmlsZXMpKSB7XG4gICAgICBjb25zdCBmaWxlID0gdGhpcy5nZXRGaWxlKGZpbGVJRClcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxdWlyZWRNZXRhRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcGVydHkuY2FsbChmaWxlLm1ldGEsIHJlcXVpcmVkTWV0YUZpZWxkc1tpXSkgfHwgZmlsZS5tZXRhW3JlcXVpcmVkTWV0YUZpZWxkc1tpXV0gPT09ICcnKSB7XG4gICAgICAgICAgY29uc3QgZXJyID0gbmV3IFJlc3RyaWN0aW9uRXJyb3IoYCR7dGhpcy5pMThuKCdtaXNzaW5nUmVxdWlyZWRNZXRhRmllbGRPbkZpbGUnLCB7IGZpbGVOYW1lOiBmaWxlLm5hbWUgfSl9YClcbiAgICAgICAgICBlcnJvcnMucHVzaChlcnIpXG4gICAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIsIHsgZmlsZSwgc2hvd0luZm9ybWVyOiBmYWxzZSwgdGhyb3dFcnI6IGZhbHNlIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEFnZ3JlZ2F0ZVJlc3RyaWN0aW9uRXJyb3IoYCR7dGhpcy5pMThuKCdtaXNzaW5nUmVxdWlyZWRNZXRhRmllbGQnKX1gLCBlcnJvcnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvZ3MgYW4gZXJyb3IsIHNldHMgSW5mb3JtZXIgbWVzc2FnZSwgdGhlbiB0aHJvd3MgdGhlIGVycm9yLlxuICAgKiBFbWl0cyBhICdyZXN0cmljdGlvbi1mYWlsZWQnIGV2ZW50IGlmIGl04oCZcyBhIHJlc3RyaWN0aW9uIGVycm9yXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0IHwgc3RyaW5nfSBlcnIg4oCUIEVycm9yIG9iamVjdCBvciBwbGFpbiBzdHJpbmcgbWVzc2FnZVxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuc2hvd0luZm9ybWVyPXRydWVdIOKAlCBTb21ldGltZXMgZGV2ZWxvcGVyIG1pZ2h0IHdhbnQgdG8gc2hvdyBJbmZvcm1lciBtYW51YWxseVxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnMuZmlsZT1udWxsXSDigJQgRmlsZSBvYmplY3QgdXNlZCB0byBlbWl0IHRoZSByZXN0cmljdGlvbiBlcnJvclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRocm93RXJyPXRydWVdIOKAlCBFcnJvcnMgc2hvdWxkbuKAmXQgYmUgdGhyb3duLCBmb3IgZXhhbXBsZSwgaW4gYHVwbG9hZC1lcnJvcmAgZXZlbnRcbiAgICogQHByaXZhdGVcbiAgICovXG4gICNzaG93T3JMb2dFcnJvckFuZFRocm93IChlcnIsIHsgc2hvd0luZm9ybWVyID0gdHJ1ZSwgZmlsZSA9IG51bGwsIHRocm93RXJyID0gdHJ1ZSB9ID0ge30pIHtcbiAgICBjb25zdCBtZXNzYWdlID0gdHlwZW9mIGVyciA9PT0gJ29iamVjdCcgPyBlcnIubWVzc2FnZSA6IGVyclxuICAgIGNvbnN0IGRldGFpbHMgPSAodHlwZW9mIGVyciA9PT0gJ29iamVjdCcgJiYgZXJyLmRldGFpbHMpID8gZXJyLmRldGFpbHMgOiAnJ1xuXG4gICAgLy8gUmVzdHJpY3Rpb24gZXJyb3JzIHNob3VsZCBiZSBsb2dnZWQsIGJ1dCBub3QgYXMgZXJyb3JzLFxuICAgIC8vIGFzIHRoZXkgYXJlIGV4cGVjdGVkIGFuZCBzaG93biBpbiB0aGUgVUkuXG4gICAgbGV0IGxvZ01lc3NhZ2VXaXRoRGV0YWlscyA9IG1lc3NhZ2VcbiAgICBpZiAoZGV0YWlscykge1xuICAgICAgbG9nTWVzc2FnZVdpdGhEZXRhaWxzICs9IGAgJHtkZXRhaWxzfWBcbiAgICB9XG4gICAgaWYgKGVyci5pc1Jlc3RyaWN0aW9uKSB7XG4gICAgICB0aGlzLmxvZyhsb2dNZXNzYWdlV2l0aERldGFpbHMpXG4gICAgICB0aGlzLmVtaXQoJ3Jlc3RyaWN0aW9uLWZhaWxlZCcsIGZpbGUsIGVycilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2cobG9nTWVzc2FnZVdpdGhEZXRhaWxzLCAnZXJyb3InKVxuICAgIH1cblxuICAgIC8vIFNvbWV0aW1lcyBpbmZvcm1lciBoYXMgdG8gYmUgc2hvd24gbWFudWFsbHkgYnkgdGhlIGRldmVsb3BlcixcbiAgICAvLyBmb3IgZXhhbXBsZSwgaW4gYG9uQmVmb3JlRmlsZUFkZGVkYC5cbiAgICBpZiAoc2hvd0luZm9ybWVyKSB7XG4gICAgICB0aGlzLmluZm8oeyBtZXNzYWdlLCBkZXRhaWxzIH0sICdlcnJvcicsIHRoaXMub3B0cy5pbmZvVGltZW91dClcbiAgICB9XG5cbiAgICBpZiAodGhyb3dFcnIpIHtcbiAgICAgIHRocm93ICh0eXBlb2YgZXJyID09PSAnb2JqZWN0JyA/IGVyciA6IG5ldyBFcnJvcihlcnIpKVxuICAgIH1cbiAgfVxuXG4gICNhc3NlcnROZXdVcGxvYWRBbGxvd2VkIChmaWxlKSB7XG4gICAgY29uc3QgeyBhbGxvd05ld1VwbG9hZCB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICBpZiAoYWxsb3dOZXdVcGxvYWQgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLiNzaG93T3JMb2dFcnJvckFuZFRocm93KG5ldyBSZXN0cmljdGlvbkVycm9yKHRoaXMuaTE4bignbm9Nb3JlRmlsZXNBbGxvd2VkJykpLCB7IGZpbGUgfSlcbiAgICB9XG4gIH1cblxuICBjaGVja0lmRmlsZUFscmVhZHlFeGlzdHMgKGZpbGVJRCkge1xuICAgIGNvbnN0IHsgZmlsZXMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuXG4gICAgaWYgKGZpbGVzW2ZpbGVJRF0gJiYgIWZpbGVzW2ZpbGVJRF0uaXNHaG9zdCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZmlsZSBzdGF0ZSBvYmplY3QgYmFzZWQgb24gdXNlci1wcm92aWRlZCBgYWRkRmlsZSgpYCBvcHRpb25zLlxuICAgKlxuICAgKiBOb3RlIHRoaXMgaXMgZXh0cmVtZWx5IHNpZGUtZWZmZWN0ZnVsIGFuZCBzaG91bGQgb25seSBiZSBkb25lIHdoZW4gYSBmaWxlIHN0YXRlIG9iamVjdFxuICAgKiB3aWxsIGJlIGFkZGVkIHRvIHN0YXRlIGltbWVkaWF0ZWx5IGFmdGVyd2FyZCFcbiAgICpcbiAgICogVGhlIGBmaWxlc2AgdmFsdWUgaXMgcGFzc2VkIGluIGJlY2F1c2UgaXQgbWF5IGJlIHVwZGF0ZWQgYnkgdGhlIGNhbGxlciB3aXRob3V0IHVwZGF0aW5nIHRoZSBzdG9yZS5cbiAgICovXG4gICNjaGVja0FuZENyZWF0ZUZpbGVTdGF0ZU9iamVjdCAoZmlsZXMsIGZpbGVEZXNjcmlwdG9yKSB7XG4gICAgY29uc3QgZmlsZVR5cGUgPSBnZXRGaWxlVHlwZShmaWxlRGVzY3JpcHRvcilcbiAgICBjb25zdCBmaWxlTmFtZSA9IGdldEZpbGVOYW1lKGZpbGVUeXBlLCBmaWxlRGVzY3JpcHRvcilcbiAgICBjb25zdCBmaWxlRXh0ZW5zaW9uID0gZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24oZmlsZU5hbWUpLmV4dGVuc2lvblxuICAgIGNvbnN0IGlzUmVtb3RlID0gQm9vbGVhbihmaWxlRGVzY3JpcHRvci5pc1JlbW90ZSlcbiAgICBjb25zdCBmaWxlSUQgPSBnZW5lcmF0ZUZpbGVJRCh7XG4gICAgICAuLi5maWxlRGVzY3JpcHRvcixcbiAgICAgIHR5cGU6IGZpbGVUeXBlLFxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5jaGVja0lmRmlsZUFscmVhZHlFeGlzdHMoZmlsZUlEKSkge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgUmVzdHJpY3Rpb25FcnJvcih0aGlzLmkxOG4oJ25vRHVwbGljYXRlcycsIHsgZmlsZU5hbWUgfSkpXG4gICAgICB0aGlzLiNzaG93T3JMb2dFcnJvckFuZFRocm93KGVycm9yLCB7IGZpbGU6IGZpbGVEZXNjcmlwdG9yIH0pXG4gICAgfVxuXG4gICAgY29uc3QgbWV0YSA9IGZpbGVEZXNjcmlwdG9yLm1ldGEgfHwge31cbiAgICBtZXRhLm5hbWUgPSBmaWxlTmFtZVxuICAgIG1ldGEudHlwZSA9IGZpbGVUeXBlXG5cbiAgICAvLyBgbnVsbGAgbWVhbnMgdGhlIHNpemUgaXMgdW5rbm93bi5cbiAgICBjb25zdCBzaXplID0gTnVtYmVyLmlzRmluaXRlKGZpbGVEZXNjcmlwdG9yLmRhdGEuc2l6ZSkgPyBmaWxlRGVzY3JpcHRvci5kYXRhLnNpemUgOiBudWxsXG5cbiAgICBsZXQgbmV3RmlsZSA9IHtcbiAgICAgIHNvdXJjZTogZmlsZURlc2NyaXB0b3Iuc291cmNlIHx8ICcnLFxuICAgICAgaWQ6IGZpbGVJRCxcbiAgICAgIG5hbWU6IGZpbGVOYW1lLFxuICAgICAgZXh0ZW5zaW9uOiBmaWxlRXh0ZW5zaW9uIHx8ICcnLFxuICAgICAgbWV0YToge1xuICAgICAgICAuLi50aGlzLmdldFN0YXRlKCkubWV0YSxcbiAgICAgICAgLi4ubWV0YSxcbiAgICAgIH0sXG4gICAgICB0eXBlOiBmaWxlVHlwZSxcbiAgICAgIGRhdGE6IGZpbGVEZXNjcmlwdG9yLmRhdGEsXG4gICAgICBwcm9ncmVzczoge1xuICAgICAgICBwZXJjZW50YWdlOiAwLFxuICAgICAgICBieXRlc1VwbG9hZGVkOiAwLFxuICAgICAgICBieXRlc1RvdGFsOiBzaXplLFxuICAgICAgICB1cGxvYWRDb21wbGV0ZTogZmFsc2UsXG4gICAgICAgIHVwbG9hZFN0YXJ0ZWQ6IG51bGwsXG4gICAgICB9LFxuICAgICAgc2l6ZSxcbiAgICAgIGlzUmVtb3RlLFxuICAgICAgcmVtb3RlOiBmaWxlRGVzY3JpcHRvci5yZW1vdGUgfHwgJycsXG4gICAgICBwcmV2aWV3OiBmaWxlRGVzY3JpcHRvci5wcmV2aWV3LFxuICAgIH1cblxuICAgIGNvbnN0IG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID0gdGhpcy5vcHRzLm9uQmVmb3JlRmlsZUFkZGVkKG5ld0ZpbGUsIGZpbGVzKVxuXG4gICAgaWYgKG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgLy8gRG9u4oCZdCBzaG93IFVJIGluZm8gZm9yIHRoaXMgZXJyb3IsIGFzIGl0IHNob3VsZCBiZSBkb25lIGJ5IHRoZSBkZXZlbG9wZXJcbiAgICAgIHRoaXMuI3Nob3dPckxvZ0Vycm9yQW5kVGhyb3cobmV3IFJlc3RyaWN0aW9uRXJyb3IoJ0Nhbm5vdCBhZGQgdGhlIGZpbGUgYmVjYXVzZSBvbkJlZm9yZUZpbGVBZGRlZCByZXR1cm5lZCBmYWxzZS4nKSwgeyBzaG93SW5mb3JtZXI6IGZhbHNlLCBmaWxlRGVzY3JpcHRvciB9KVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ID09PSAnb2JqZWN0JyAmJiBvbkJlZm9yZUZpbGVBZGRlZFJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgbmV3RmlsZSA9IG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZpbGVzQXJyYXkgPSBPYmplY3Qua2V5cyhmaWxlcykubWFwKGkgPT4gZmlsZXNbaV0pXG4gICAgICB0aGlzLiNjaGVja1Jlc3RyaWN0aW9ucyhuZXdGaWxlLCBmaWxlc0FycmF5KVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIsIHsgZmlsZTogbmV3RmlsZSB9KVxuICAgIH1cblxuICAgIHJldHVybiBuZXdGaWxlXG4gIH1cblxuICAvLyBTY2hlZHVsZSBhbiB1cGxvYWQgaWYgYGF1dG9Qcm9jZWVkYCBpcyBlbmFibGVkLlxuICAjc3RhcnRJZkF1dG9Qcm9jZWVkICgpIHtcbiAgICBpZiAodGhpcy5vcHRzLmF1dG9Qcm9jZWVkICYmICF0aGlzLnNjaGVkdWxlZEF1dG9Qcm9jZWVkKSB7XG4gICAgICB0aGlzLnNjaGVkdWxlZEF1dG9Qcm9jZWVkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVkQXV0b1Byb2NlZWQgPSBudWxsXG4gICAgICAgIHRoaXMudXBsb2FkKCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIGlmICghZXJyLmlzUmVzdHJpY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMubG9nKGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSB8fCBlcnIpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSwgNClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IGZpbGUgdG8gYHN0YXRlLmZpbGVzYC4gVGhpcyB3aWxsIHJ1biBgb25CZWZvcmVGaWxlQWRkZWRgLFxuICAgKiB0cnkgdG8gZ3Vlc3MgZmlsZSB0eXBlIGluIGEgY2xldmVyIHdheSwgY2hlY2sgZmlsZSBhZ2FpbnN0IHJlc3RyaWN0aW9ucyxcbiAgICogYW5kIHN0YXJ0IGFuIHVwbG9hZCBpZiBgYXV0b1Byb2NlZWQgPT09IHRydWVgLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZmlsZSBvYmplY3QgdG8gYWRkXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IGlkIGZvciB0aGUgYWRkZWQgZmlsZVxuICAgKi9cbiAgYWRkRmlsZSAoZmlsZSkge1xuICAgIHRoaXMuI2Fzc2VydE5ld1VwbG9hZEFsbG93ZWQoZmlsZSlcblxuICAgIGNvbnN0IHsgZmlsZXMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuICAgIGxldCBuZXdGaWxlID0gdGhpcy4jY2hlY2tBbmRDcmVhdGVGaWxlU3RhdGVPYmplY3QoZmlsZXMsIGZpbGUpXG5cbiAgICAvLyBVc2VycyBhcmUgYXNrZWQgdG8gcmUtc2VsZWN0IHJlY292ZXJlZCBmaWxlcyB3aXRob3V0IGRhdGEsXG4gICAgLy8gYW5kIHRvIGtlZXAgdGhlIHByb2dyZXNzLCBtZXRhIGFuZCBldmVydGhpbmcgZWxzZSwgd2Ugb25seSByZXBsYWNlIHNhaWQgZGF0YVxuICAgIGlmIChmaWxlc1tuZXdGaWxlLmlkXSAmJiBmaWxlc1tuZXdGaWxlLmlkXS5pc0dob3N0KSB7XG4gICAgICBuZXdGaWxlID0ge1xuICAgICAgICAuLi5maWxlc1tuZXdGaWxlLmlkXSxcbiAgICAgICAgZGF0YTogZmlsZS5kYXRhLFxuICAgICAgICBpc0dob3N0OiBmYWxzZSxcbiAgICAgIH1cbiAgICAgIHRoaXMubG9nKGBSZXBsYWNlZCB0aGUgYmxvYiBpbiB0aGUgcmVzdG9yZWQgZ2hvc3QgZmlsZTogJHtuZXdGaWxlLm5hbWV9LCAke25ld0ZpbGUuaWR9YClcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiB7XG4gICAgICAgIC4uLmZpbGVzLFxuICAgICAgICBbbmV3RmlsZS5pZF06IG5ld0ZpbGUsXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0aGlzLmVtaXQoJ2ZpbGUtYWRkZWQnLCBuZXdGaWxlKVxuICAgIHRoaXMuZW1pdCgnZmlsZXMtYWRkZWQnLCBbbmV3RmlsZV0pXG4gICAgdGhpcy5sb2coYEFkZGVkIGZpbGU6ICR7bmV3RmlsZS5uYW1lfSwgJHtuZXdGaWxlLmlkfSwgbWltZSB0eXBlOiAke25ld0ZpbGUudHlwZX1gKVxuXG4gICAgdGhpcy4jc3RhcnRJZkF1dG9Qcm9jZWVkKClcblxuICAgIHJldHVybiBuZXdGaWxlLmlkXG4gIH1cblxuICAvKipcbiAgICogQWRkIG11bHRpcGxlIGZpbGVzIHRvIGBzdGF0ZS5maWxlc2AuIFNlZSB0aGUgYGFkZEZpbGUoKWAgZG9jdW1lbnRhdGlvbi5cbiAgICpcbiAgICogSWYgYW4gZXJyb3Igb2NjdXJzIHdoaWxlIGFkZGluZyBhIGZpbGUsIGl0IGlzIGxvZ2dlZCBhbmQgdGhlIHVzZXIgaXMgbm90aWZpZWQuXG4gICAqIFRoaXMgaXMgZ29vZCBmb3IgVUkgcGx1Z2lucywgYnV0IG5vdCBmb3IgcHJvZ3JhbW1hdGljIHVzZS5cbiAgICogUHJvZ3JhbW1hdGljIHVzZXJzIHNob3VsZCB1c3VhbGx5IHN0aWxsIHVzZSBgYWRkRmlsZSgpYCBvbiBpbmRpdmlkdWFsIGZpbGVzLlxuICAgKi9cbiAgYWRkRmlsZXMgKGZpbGVEZXNjcmlwdG9ycykge1xuICAgIHRoaXMuI2Fzc2VydE5ld1VwbG9hZEFsbG93ZWQoKVxuXG4gICAgLy8gY3JlYXRlIGEgY29weSBvZiB0aGUgZmlsZXMgb2JqZWN0IG9ubHkgb25jZVxuICAgIGNvbnN0IGZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuICAgIGNvbnN0IG5ld0ZpbGVzID0gW11cbiAgICBjb25zdCBlcnJvcnMgPSBbXVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZURlc2NyaXB0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgbmV3RmlsZSA9IHRoaXMuI2NoZWNrQW5kQ3JlYXRlRmlsZVN0YXRlT2JqZWN0KGZpbGVzLCBmaWxlRGVzY3JpcHRvcnNbaV0pXG4gICAgICAgIC8vIFVzZXJzIGFyZSBhc2tlZCB0byByZS1zZWxlY3QgcmVjb3ZlcmVkIGZpbGVzIHdpdGhvdXQgZGF0YSxcbiAgICAgICAgLy8gYW5kIHRvIGtlZXAgdGhlIHByb2dyZXNzLCBtZXRhIGFuZCBldmVydGhpbmcgZWxzZSwgd2Ugb25seSByZXBsYWNlIHNhaWQgZGF0YVxuICAgICAgICBpZiAoZmlsZXNbbmV3RmlsZS5pZF0gJiYgZmlsZXNbbmV3RmlsZS5pZF0uaXNHaG9zdCkge1xuICAgICAgICAgIG5ld0ZpbGUgPSB7XG4gICAgICAgICAgICAuLi5maWxlc1tuZXdGaWxlLmlkXSxcbiAgICAgICAgICAgIGRhdGE6IGZpbGVEZXNjcmlwdG9yc1tpXS5kYXRhLFxuICAgICAgICAgICAgaXNHaG9zdDogZmFsc2UsXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMubG9nKGBSZXBsYWNlZCBibG9iIGluIGEgZ2hvc3QgZmlsZTogJHtuZXdGaWxlLm5hbWV9LCAke25ld0ZpbGUuaWR9YClcbiAgICAgICAgfVxuICAgICAgICBmaWxlc1tuZXdGaWxlLmlkXSA9IG5ld0ZpbGVcbiAgICAgICAgbmV3RmlsZXMucHVzaChuZXdGaWxlKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmICghZXJyLmlzUmVzdHJpY3Rpb24pIHtcbiAgICAgICAgICBlcnJvcnMucHVzaChlcnIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgZmlsZXMgfSlcblxuICAgIG5ld0ZpbGVzLmZvckVhY2goKG5ld0ZpbGUpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgnZmlsZS1hZGRlZCcsIG5ld0ZpbGUpXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgnZmlsZXMtYWRkZWQnLCBuZXdGaWxlcylcblxuICAgIGlmIChuZXdGaWxlcy5sZW5ndGggPiA1KSB7XG4gICAgICB0aGlzLmxvZyhgQWRkZWQgYmF0Y2ggb2YgJHtuZXdGaWxlcy5sZW5ndGh9IGZpbGVzYClcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmtleXMobmV3RmlsZXMpLmZvckVhY2goZmlsZUlEID0+IHtcbiAgICAgICAgdGhpcy5sb2coYEFkZGVkIGZpbGU6ICR7bmV3RmlsZXNbZmlsZUlEXS5uYW1lfVxcbiBpZDogJHtuZXdGaWxlc1tmaWxlSURdLmlkfVxcbiB0eXBlOiAke25ld0ZpbGVzW2ZpbGVJRF0udHlwZX1gKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAobmV3RmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy4jc3RhcnRJZkF1dG9Qcm9jZWVkKClcbiAgICB9XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBtZXNzYWdlID0gJ011bHRpcGxlIGVycm9ycyBvY2N1cnJlZCB3aGlsZSBhZGRpbmcgZmlsZXM6XFxuJ1xuICAgICAgZXJyb3JzLmZvckVhY2goKHN1YkVycm9yKSA9PiB7XG4gICAgICAgIG1lc3NhZ2UgKz0gYFxcbiAqICR7c3ViRXJyb3IubWVzc2FnZX1gXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmluZm8oe1xuICAgICAgICBtZXNzYWdlOiB0aGlzLmkxOG4oJ2FkZEJ1bGtGaWxlc0ZhaWxlZCcsIHsgc21hcnRfY291bnQ6IGVycm9ycy5sZW5ndGggfSksXG4gICAgICAgIGRldGFpbHM6IG1lc3NhZ2UsXG4gICAgICB9LCAnZXJyb3InLCB0aGlzLm9wdHMuaW5mb1RpbWVvdXQpXG5cbiAgICAgIGlmICh0eXBlb2YgQWdncmVnYXRlRXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEFnZ3JlZ2F0ZUVycm9yKGVycm9ycywgbWVzc2FnZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihtZXNzYWdlKVxuICAgICAgICBlcnIuZXJyb3JzID0gZXJyb3JzXG4gICAgICAgIHRocm93IGVyclxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUZpbGVzIChmaWxlSURzLCByZWFzb24pIHtcbiAgICBjb25zdCB7IGZpbGVzLCBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi5maWxlcyB9XG4gICAgY29uc3QgdXBkYXRlZFVwbG9hZHMgPSB7IC4uLmN1cnJlbnRVcGxvYWRzIH1cblxuICAgIGNvbnN0IHJlbW92ZWRGaWxlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICBmaWxlSURzLmZvckVhY2goKGZpbGVJRCkgPT4ge1xuICAgICAgaWYgKGZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgICAgcmVtb3ZlZEZpbGVzW2ZpbGVJRF0gPSBmaWxlc1tmaWxlSURdXG4gICAgICAgIGRlbGV0ZSB1cGRhdGVkRmlsZXNbZmlsZUlEXVxuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBSZW1vdmUgZmlsZXMgZnJvbSB0aGUgYGZpbGVJRHNgIGxpc3QgaW4gZWFjaCB1cGxvYWQuXG4gICAgZnVuY3Rpb24gZmlsZUlzTm90UmVtb3ZlZCAodXBsb2FkRmlsZUlEKSB7XG4gICAgICByZXR1cm4gcmVtb3ZlZEZpbGVzW3VwbG9hZEZpbGVJRF0gPT09IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKHVwZGF0ZWRVcGxvYWRzKS5mb3JFYWNoKCh1cGxvYWRJRCkgPT4ge1xuICAgICAgY29uc3QgbmV3RmlsZUlEcyA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXS5maWxlSURzLmZpbHRlcihmaWxlSXNOb3RSZW1vdmVkKVxuXG4gICAgICAvLyBSZW1vdmUgdGhlIHVwbG9hZCBpZiBubyBmaWxlcyBhcmUgYXNzb2NpYXRlZCB3aXRoIGl0IGFueW1vcmUuXG4gICAgICBpZiAobmV3RmlsZUlEcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIHVwZGF0ZWRVcGxvYWRzW3VwbG9hZElEXVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdXBkYXRlZFVwbG9hZHNbdXBsb2FkSURdID0ge1xuICAgICAgICAuLi5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0sXG4gICAgICAgIGZpbGVJRHM6IG5ld0ZpbGVJRHMsXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IHN0YXRlVXBkYXRlID0ge1xuICAgICAgY3VycmVudFVwbG9hZHM6IHVwZGF0ZWRVcGxvYWRzLFxuICAgICAgZmlsZXM6IHVwZGF0ZWRGaWxlcyxcbiAgICB9XG5cbiAgICAvLyBJZiBhbGwgZmlsZXMgd2VyZSByZW1vdmVkIC0gYWxsb3cgbmV3IHVwbG9hZHMsXG4gICAgLy8gYW5kIGNsZWFyIHJlY292ZXJlZFN0YXRlXG4gICAgaWYgKE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykubGVuZ3RoID09PSAwKSB7XG4gICAgICBzdGF0ZVVwZGF0ZS5hbGxvd05ld1VwbG9hZCA9IHRydWVcbiAgICAgIHN0YXRlVXBkYXRlLmVycm9yID0gbnVsbFxuICAgICAgc3RhdGVVcGRhdGUucmVjb3ZlcmVkU3RhdGUgPSBudWxsXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZShzdGF0ZVVwZGF0ZSlcbiAgICB0aGlzLmNhbGN1bGF0ZVRvdGFsUHJvZ3Jlc3MoKVxuXG4gICAgY29uc3QgcmVtb3ZlZEZpbGVJRHMgPSBPYmplY3Qua2V5cyhyZW1vdmVkRmlsZXMpXG4gICAgcmVtb3ZlZEZpbGVJRHMuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoJ2ZpbGUtcmVtb3ZlZCcsIHJlbW92ZWRGaWxlc1tmaWxlSURdLCByZWFzb24pXG4gICAgfSlcblxuICAgIGlmIChyZW1vdmVkRmlsZUlEcy5sZW5ndGggPiA1KSB7XG4gICAgICB0aGlzLmxvZyhgUmVtb3ZlZCAke3JlbW92ZWRGaWxlSURzLmxlbmd0aH0gZmlsZXNgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZyhgUmVtb3ZlZCBmaWxlczogJHtyZW1vdmVkRmlsZUlEcy5qb2luKCcsICcpfWApXG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRmlsZSAoZmlsZUlELCByZWFzb24gPSBudWxsKSB7XG4gICAgdGhpcy5yZW1vdmVGaWxlcyhbZmlsZUlEXSwgcmVhc29uKVxuICB9XG5cbiAgcGF1c2VSZXN1bWUgKGZpbGVJRCkge1xuICAgIGlmICghdGhpcy5nZXRTdGF0ZSgpLmNhcGFiaWxpdGllcy5yZXN1bWFibGVVcGxvYWRzXG4gICAgICAgICB8fCB0aGlzLmdldEZpbGUoZmlsZUlEKS51cGxvYWRDb21wbGV0ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIGNvbnN0IHdhc1BhdXNlZCA9IHRoaXMuZ2V0RmlsZShmaWxlSUQpLmlzUGF1c2VkIHx8IGZhbHNlXG4gICAgY29uc3QgaXNQYXVzZWQgPSAhd2FzUGF1c2VkXG5cbiAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlSUQsIHtcbiAgICAgIGlzUGF1c2VkLFxuICAgIH0pXG5cbiAgICB0aGlzLmVtaXQoJ3VwbG9hZC1wYXVzZScsIGZpbGVJRCwgaXNQYXVzZWQpXG5cbiAgICByZXR1cm4gaXNQYXVzZWRcbiAgfVxuXG4gIHBhdXNlQWxsICgpIHtcbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5maWxlcyB9XG4gICAgY29uc3QgaW5Qcm9ncmVzc1VwZGF0ZWRGaWxlcyA9IE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykuZmlsdGVyKChmaWxlKSA9PiB7XG4gICAgICByZXR1cm4gIXVwZGF0ZWRGaWxlc1tmaWxlXS5wcm9ncmVzcy51cGxvYWRDb21wbGV0ZVxuICAgICAgICAgICAgICYmIHVwZGF0ZWRGaWxlc1tmaWxlXS5wcm9ncmVzcy51cGxvYWRTdGFydGVkXG4gICAgfSlcblxuICAgIGluUHJvZ3Jlc3NVcGRhdGVkRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlZEZpbGUgPSB7IC4uLnVwZGF0ZWRGaWxlc1tmaWxlXSwgaXNQYXVzZWQ6IHRydWUgfVxuICAgICAgdXBkYXRlZEZpbGVzW2ZpbGVdID0gdXBkYXRlZEZpbGVcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGZpbGVzOiB1cGRhdGVkRmlsZXMgfSlcbiAgICB0aGlzLmVtaXQoJ3BhdXNlLWFsbCcpXG4gIH1cblxuICByZXN1bWVBbGwgKCkge1xuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICBjb25zdCBpblByb2dyZXNzVXBkYXRlZEZpbGVzID0gT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5maWx0ZXIoKGZpbGUpID0+IHtcbiAgICAgIHJldHVybiAhdXBkYXRlZEZpbGVzW2ZpbGVdLnByb2dyZXNzLnVwbG9hZENvbXBsZXRlXG4gICAgICAgICAgICAgJiYgdXBkYXRlZEZpbGVzW2ZpbGVdLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWRcbiAgICB9KVxuXG4gICAgaW5Qcm9ncmVzc1VwZGF0ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVkRmlsZSA9IHtcbiAgICAgICAgLi4udXBkYXRlZEZpbGVzW2ZpbGVdLFxuICAgICAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgfVxuICAgICAgdXBkYXRlZEZpbGVzW2ZpbGVdID0gdXBkYXRlZEZpbGVcbiAgICB9KVxuICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlczogdXBkYXRlZEZpbGVzIH0pXG5cbiAgICB0aGlzLmVtaXQoJ3Jlc3VtZS1hbGwnKVxuICB9XG5cbiAgcmV0cnlBbGwgKCkge1xuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICBjb25zdCBmaWxlc1RvUmV0cnkgPSBPYmplY3Qua2V5cyh1cGRhdGVkRmlsZXMpLmZpbHRlcihmaWxlID0+IHtcbiAgICAgIHJldHVybiB1cGRhdGVkRmlsZXNbZmlsZV0uZXJyb3JcbiAgICB9KVxuXG4gICAgZmlsZXNUb1JldHJ5LmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZWRGaWxlID0ge1xuICAgICAgICAuLi51cGRhdGVkRmlsZXNbZmlsZV0sXG4gICAgICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICB9XG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZV0gPSB1cGRhdGVkRmlsZVxuICAgIH0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmaWxlczogdXBkYXRlZEZpbGVzLFxuICAgICAgZXJyb3I6IG51bGwsXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgncmV0cnktYWxsJywgZmlsZXNUb1JldHJ5KVxuXG4gICAgaWYgKGZpbGVzVG9SZXRyeS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICBzdWNjZXNzZnVsOiBbXSxcbiAgICAgICAgZmFpbGVkOiBbXSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLiNjcmVhdGVVcGxvYWQoZmlsZXNUb1JldHJ5LCB7XG4gICAgICBmb3JjZUFsbG93TmV3VXBsb2FkOiB0cnVlLCAvLyBjcmVhdGUgbmV3IHVwbG9hZCBldmVuIGlmIGFsbG93TmV3VXBsb2FkOiBmYWxzZVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXMuI3J1blVwbG9hZCh1cGxvYWRJRClcbiAgfVxuXG4gIGNhbmNlbEFsbCAoKSB7XG4gICAgdGhpcy5lbWl0KCdjYW5jZWwtYWxsJylcblxuICAgIGNvbnN0IHsgZmlsZXMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3QgZmlsZUlEcyA9IE9iamVjdC5rZXlzKGZpbGVzKVxuICAgIGlmIChmaWxlSURzLmxlbmd0aCkge1xuICAgICAgdGhpcy5yZW1vdmVGaWxlcyhmaWxlSURzLCAnY2FuY2VsLWFsbCcpXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0b3RhbFByb2dyZXNzOiAwLFxuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICByZWNvdmVyZWRTdGF0ZTogbnVsbCxcbiAgICB9KVxuICB9XG5cbiAgcmV0cnlVcGxvYWQgKGZpbGVJRCkge1xuICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGVJRCwge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgndXBsb2FkLXJldHJ5JywgZmlsZUlEKVxuXG4gICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLiNjcmVhdGVVcGxvYWQoW2ZpbGVJRF0sIHtcbiAgICAgIGZvcmNlQWxsb3dOZXdVcGxvYWQ6IHRydWUsIC8vIGNyZWF0ZSBuZXcgdXBsb2FkIGV2ZW4gaWYgYWxsb3dOZXdVcGxvYWQ6IGZhbHNlXG4gICAgfSlcbiAgICByZXR1cm4gdGhpcy4jcnVuVXBsb2FkKHVwbG9hZElEKVxuICB9XG5cbiAgcmVzZXQgKCkge1xuICAgIHRoaXMuY2FuY2VsQWxsKClcbiAgfVxuXG4gIGxvZ291dCAoKSB7XG4gICAgdGhpcy5pdGVyYXRlUGx1Z2lucyhwbHVnaW4gPT4ge1xuICAgICAgaWYgKHBsdWdpbi5wcm92aWRlciAmJiBwbHVnaW4ucHJvdmlkZXIubG9nb3V0KSB7XG4gICAgICAgIHBsdWdpbi5wcm92aWRlci5sb2dvdXQoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBjYWxjdWxhdGVQcm9ncmVzcyAoZmlsZSwgZGF0YSkge1xuICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7ZmlsZS5pZH1gKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gYnl0ZXNUb3RhbCBtYXkgYmUgbnVsbCBvciB6ZXJvOyBpbiB0aGF0IGNhc2Ugd2UgY2FuJ3QgZGl2aWRlIGJ5IGl0XG4gICAgY29uc3QgY2FuSGF2ZVBlcmNlbnRhZ2UgPSBOdW1iZXIuaXNGaW5pdGUoZGF0YS5ieXRlc1RvdGFsKSAmJiBkYXRhLmJ5dGVzVG90YWwgPiAwXG4gICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgLi4udGhpcy5nZXRGaWxlKGZpbGUuaWQpLnByb2dyZXNzLFxuICAgICAgICBieXRlc1VwbG9hZGVkOiBkYXRhLmJ5dGVzVXBsb2FkZWQsXG4gICAgICAgIGJ5dGVzVG90YWw6IGRhdGEuYnl0ZXNUb3RhbCxcbiAgICAgICAgcGVyY2VudGFnZTogY2FuSGF2ZVBlcmNlbnRhZ2VcbiAgICAgICAgICA/IE1hdGgucm91bmQoKGRhdGEuYnl0ZXNVcGxvYWRlZCAvIGRhdGEuYnl0ZXNUb3RhbCkgKiAxMDApXG4gICAgICAgICAgOiAwLFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgdGhpcy5jYWxjdWxhdGVUb3RhbFByb2dyZXNzKClcbiAgfVxuXG4gIGNhbGN1bGF0ZVRvdGFsUHJvZ3Jlc3MgKCkge1xuICAgIC8vIGNhbGN1bGF0ZSB0b3RhbCBwcm9ncmVzcywgdXNpbmcgdGhlIG51bWJlciBvZiBmaWxlcyBjdXJyZW50bHkgdXBsb2FkaW5nLFxuICAgIC8vIG11bHRpcGxpZWQgYnkgMTAwIGFuZCB0aGUgc3VtbSBvZiBpbmRpdmlkdWFsIHByb2dyZXNzIG9mIGVhY2ggZmlsZVxuICAgIGNvbnN0IGZpbGVzID0gdGhpcy5nZXRGaWxlcygpXG5cbiAgICBjb25zdCBpblByb2dyZXNzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiB7XG4gICAgICByZXR1cm4gZmlsZS5wcm9ncmVzcy51cGxvYWRTdGFydGVkXG4gICAgICAgIHx8IGZpbGUucHJvZ3Jlc3MucHJlcHJvY2Vzc1xuICAgICAgICB8fCBmaWxlLnByb2dyZXNzLnBvc3Rwcm9jZXNzXG4gICAgfSlcblxuICAgIGlmIChpblByb2dyZXNzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5lbWl0KCdwcm9ncmVzcycsIDApXG4gICAgICB0aGlzLnNldFN0YXRlKHsgdG90YWxQcm9ncmVzczogMCB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgc2l6ZWRGaWxlcyA9IGluUHJvZ3Jlc3MuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnByb2dyZXNzLmJ5dGVzVG90YWwgIT0gbnVsbClcbiAgICBjb25zdCB1bnNpemVkRmlsZXMgPSBpblByb2dyZXNzLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5wcm9ncmVzcy5ieXRlc1RvdGFsID09IG51bGwpXG5cbiAgICBpZiAoc2l6ZWRGaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IHByb2dyZXNzTWF4ID0gaW5Qcm9ncmVzcy5sZW5ndGggKiAxMDBcbiAgICAgIGNvbnN0IGN1cnJlbnRQcm9ncmVzcyA9IHVuc2l6ZWRGaWxlcy5yZWR1Y2UoKGFjYywgZmlsZSkgPT4ge1xuICAgICAgICByZXR1cm4gYWNjICsgZmlsZS5wcm9ncmVzcy5wZXJjZW50YWdlXG4gICAgICB9LCAwKVxuICAgICAgY29uc3QgdG90YWxQcm9ncmVzcyA9IE1hdGgucm91bmQoKGN1cnJlbnRQcm9ncmVzcyAvIHByb2dyZXNzTWF4KSAqIDEwMClcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0b3RhbFByb2dyZXNzIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBsZXQgdG90YWxTaXplID0gc2l6ZWRGaWxlcy5yZWR1Y2UoKGFjYywgZmlsZSkgPT4ge1xuICAgICAgcmV0dXJuIGFjYyArIGZpbGUucHJvZ3Jlc3MuYnl0ZXNUb3RhbFxuICAgIH0sIDApXG4gICAgY29uc3QgYXZlcmFnZVNpemUgPSB0b3RhbFNpemUgLyBzaXplZEZpbGVzLmxlbmd0aFxuICAgIHRvdGFsU2l6ZSArPSBhdmVyYWdlU2l6ZSAqIHVuc2l6ZWRGaWxlcy5sZW5ndGhcblxuICAgIGxldCB1cGxvYWRlZFNpemUgPSAwXG4gICAgc2l6ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICB1cGxvYWRlZFNpemUgKz0gZmlsZS5wcm9ncmVzcy5ieXRlc1VwbG9hZGVkXG4gICAgfSlcbiAgICB1bnNpemVkRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgdXBsb2FkZWRTaXplICs9IChhdmVyYWdlU2l6ZSAqIChmaWxlLnByb2dyZXNzLnBlcmNlbnRhZ2UgfHwgMCkpIC8gMTAwXG4gICAgfSlcblxuICAgIGxldCB0b3RhbFByb2dyZXNzID0gdG90YWxTaXplID09PSAwXG4gICAgICA/IDBcbiAgICAgIDogTWF0aC5yb3VuZCgodXBsb2FkZWRTaXplIC8gdG90YWxTaXplKSAqIDEwMClcblxuICAgIC8vIGhvdCBmaXgsIGJlY2F1c2U6XG4gICAgLy8gdXBsb2FkZWRTaXplIGVuZGVkIHVwIGxhcmdlciB0aGFuIHRvdGFsU2l6ZSwgcmVzdWx0aW5nIGluIDEzMjUlIHRvdGFsXG4gICAgaWYgKHRvdGFsUHJvZ3Jlc3MgPiAxMDApIHtcbiAgICAgIHRvdGFsUHJvZ3Jlc3MgPSAxMDBcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdG90YWxQcm9ncmVzcyB9KVxuICAgIHRoaXMuZW1pdCgncHJvZ3Jlc3MnLCB0b3RhbFByb2dyZXNzKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBsaXN0ZW5lcnMgZm9yIGFsbCBnbG9iYWwgYWN0aW9ucywgbGlrZTpcbiAgICogYGVycm9yYCwgYGZpbGUtcmVtb3ZlZGAsIGB1cGxvYWQtcHJvZ3Jlc3NgXG4gICAqL1xuICAjYWRkTGlzdGVuZXJzICgpIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnJvclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbZmlsZV1cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW3Jlc3BvbnNlXVxuICAgICAqL1xuICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IChlcnJvciwgZmlsZSwgcmVzcG9uc2UpID0+IHtcbiAgICAgIGxldCBlcnJvck1zZyA9IGVycm9yLm1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3InXG4gICAgICBpZiAoZXJyb3IuZGV0YWlscykge1xuICAgICAgICBlcnJvck1zZyArPSBgICR7ZXJyb3IuZGV0YWlsc31gXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogZXJyb3JNc2cgfSlcblxuICAgICAgaWYgKGZpbGUgIT0gbnVsbCAmJiBmaWxlLmlkIGluIHRoaXMuZ2V0U3RhdGUoKS5maWxlcykge1xuICAgICAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgICAgZXJyb3I6IGVycm9yTXNnLFxuICAgICAgICAgIHJlc3BvbnNlLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub24oJ2Vycm9yJywgZXJyb3JIYW5kbGVyKVxuXG4gICAgdGhpcy5vbigndXBsb2FkLWVycm9yJywgKGZpbGUsIGVycm9yLCByZXNwb25zZSkgPT4ge1xuICAgICAgZXJyb3JIYW5kbGVyKGVycm9yLCBmaWxlLCByZXNwb25zZSlcblxuICAgICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ29iamVjdCcgJiYgZXJyb3IubWVzc2FnZSkge1xuICAgICAgICBjb25zdCBuZXdFcnJvciA9IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKVxuICAgICAgICBuZXdFcnJvci5kZXRhaWxzID0gZXJyb3IubWVzc2FnZVxuICAgICAgICBpZiAoZXJyb3IuZGV0YWlscykge1xuICAgICAgICAgIG5ld0Vycm9yLmRldGFpbHMgKz0gYCAke2Vycm9yLmRldGFpbHN9YFxuICAgICAgICB9XG4gICAgICAgIG5ld0Vycm9yLm1lc3NhZ2UgPSB0aGlzLmkxOG4oJ2ZhaWxlZFRvVXBsb2FkJywgeyBmaWxlOiBmaWxlLm5hbWUgfSlcbiAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhuZXdFcnJvciwge1xuICAgICAgICAgIHRocm93RXJyOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuI3Nob3dPckxvZ0Vycm9yQW5kVGhyb3coZXJyb3IsIHtcbiAgICAgICAgICB0aHJvd0VycjogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMub24oJ3VwbG9hZCcsICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogbnVsbCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCd1cGxvYWQtc3RhcnRlZCcsIChmaWxlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZ2V0RmlsZShmaWxlLmlkKSkge1xuICAgICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7ZmlsZS5pZH1gKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgICB1cGxvYWRTdGFydGVkOiBEYXRlLm5vdygpLFxuICAgICAgICAgIHVwbG9hZENvbXBsZXRlOiBmYWxzZSxcbiAgICAgICAgICBwZXJjZW50YWdlOiAwLFxuICAgICAgICAgIGJ5dGVzVXBsb2FkZWQ6IDAsXG4gICAgICAgICAgYnl0ZXNUb3RhbDogZmlsZS5zaXplLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigndXBsb2FkLXByb2dyZXNzJywgdGhpcy5jYWxjdWxhdGVQcm9ncmVzcylcblxuICAgIHRoaXMub24oJ3VwbG9hZC1zdWNjZXNzJywgKGZpbGUsIHVwbG9hZFJlc3ApID0+IHtcbiAgICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJHtmaWxlLmlkfWApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXJyZW50UHJvZ3Jlc3MgPSB0aGlzLmdldEZpbGUoZmlsZS5pZCkucHJvZ3Jlc3NcbiAgICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgcHJvZ3Jlc3M6IHtcbiAgICAgICAgICAuLi5jdXJyZW50UHJvZ3Jlc3MsXG4gICAgICAgICAgcG9zdHByb2Nlc3M6IHRoaXMuI3Bvc3RQcm9jZXNzb3JzLnNpemUgPiAwID8ge1xuICAgICAgICAgICAgbW9kZTogJ2luZGV0ZXJtaW5hdGUnLFxuICAgICAgICAgIH0gOiBudWxsLFxuICAgICAgICAgIHVwbG9hZENvbXBsZXRlOiB0cnVlLFxuICAgICAgICAgIHBlcmNlbnRhZ2U6IDEwMCxcbiAgICAgICAgICBieXRlc1VwbG9hZGVkOiBjdXJyZW50UHJvZ3Jlc3MuYnl0ZXNUb3RhbCxcbiAgICAgICAgfSxcbiAgICAgICAgcmVzcG9uc2U6IHVwbG9hZFJlc3AsXG4gICAgICAgIHVwbG9hZFVSTDogdXBsb2FkUmVzcC51cGxvYWRVUkwsXG4gICAgICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlbW90ZSBwcm92aWRlcnMgc29tZXRpbWVzIGRvbid0IHRlbGwgdXMgdGhlIGZpbGUgc2l6ZSxcbiAgICAgIC8vIGJ1dCB3ZSBjYW4ga25vdyBob3cgbWFueSBieXRlcyB3ZSB1cGxvYWRlZCBvbmNlIHRoZSB1cGxvYWQgaXMgY29tcGxldGUuXG4gICAgICBpZiAoZmlsZS5zaXplID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgICAgIHNpemU6IHVwbG9hZFJlc3AuYnl0ZXNVcGxvYWRlZCB8fCBjdXJyZW50UHJvZ3Jlc3MuYnl0ZXNUb3RhbCxcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5jYWxjdWxhdGVUb3RhbFByb2dyZXNzKClcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncHJlcHJvY2Vzcy1wcm9ncmVzcycsIChmaWxlLCBwcm9ncmVzcykgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgIHByb2dyZXNzOiB7IC4uLnRoaXMuZ2V0RmlsZShmaWxlLmlkKS5wcm9ncmVzcywgcHJlcHJvY2VzczogcHJvZ3Jlc3MgfSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMub24oJ3ByZXByb2Nlc3MtY29tcGxldGUnLCAoZmlsZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBmaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICAgIGZpbGVzW2ZpbGUuaWRdID0geyAuLi5maWxlc1tmaWxlLmlkXSwgcHJvZ3Jlc3M6IHsgLi4uZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MgfSB9XG4gICAgICBkZWxldGUgZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MucHJlcHJvY2Vzc1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgZmlsZXMgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncG9zdHByb2Nlc3MtcHJvZ3Jlc3MnLCAoZmlsZSwgcHJvZ3Jlc3MpID0+IHtcbiAgICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJHtmaWxlLmlkfWApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgICBwcm9ncmVzczogeyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MsIHBvc3Rwcm9jZXNzOiBwcm9ncmVzcyB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncG9zdHByb2Nlc3MtY29tcGxldGUnLCAoZmlsZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBmaWxlcyA9IHtcbiAgICAgICAgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzLFxuICAgICAgfVxuICAgICAgZmlsZXNbZmlsZS5pZF0gPSB7XG4gICAgICAgIC4uLmZpbGVzW2ZpbGUuaWRdLFxuICAgICAgICBwcm9ncmVzczoge1xuICAgICAgICAgIC4uLmZpbGVzW2ZpbGUuaWRdLnByb2dyZXNzLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgZGVsZXRlIGZpbGVzW2ZpbGUuaWRdLnByb2dyZXNzLnBvc3Rwcm9jZXNzXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlcyB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCdyZXN0b3JlZCcsICgpID0+IHtcbiAgICAgIC8vIEZpbGVzIG1heSBoYXZlIGNoYW5nZWQtLWVuc3VyZSBwcm9ncmVzcyBpcyBzdGlsbCBhY2N1cmF0ZS5cbiAgICAgIHRoaXMuY2FsY3VsYXRlVG90YWxQcm9ncmVzcygpXG4gICAgfSlcblxuICAgIC8vIHNob3cgaW5mb3JtZXIgaWYgb2ZmbGluZVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsIHRoaXMuI3VwZGF0ZU9ubGluZVN0YXR1cylcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgdGhpcy4jdXBkYXRlT25saW5lU3RhdHVzKVxuICAgICAgc2V0VGltZW91dCh0aGlzLiN1cGRhdGVPbmxpbmVTdGF0dXMsIDMwMDApXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlT25saW5lU3RhdHVzICgpIHtcbiAgICBjb25zdCBvbmxpbmVcbiAgICAgID0gdHlwZW9mIHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lXG4gICAgICAgIDogdHJ1ZVxuICAgIGlmICghb25saW5lKSB7XG4gICAgICB0aGlzLmVtaXQoJ2lzLW9mZmxpbmUnKVxuICAgICAgdGhpcy5pbmZvKHRoaXMuaTE4bignbm9JbnRlcm5ldENvbm5lY3Rpb24nKSwgJ2Vycm9yJywgMClcbiAgICAgIHRoaXMud2FzT2ZmbGluZSA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbWl0KCdpcy1vbmxpbmUnKVxuICAgICAgaWYgKHRoaXMud2FzT2ZmbGluZSkge1xuICAgICAgICB0aGlzLmVtaXQoJ2JhY2stb25saW5lJylcbiAgICAgICAgdGhpcy5pbmZvKHRoaXMuaTE4bignY29ubmVjdGVkVG9JbnRlcm5ldCcpLCAnc3VjY2VzcycsIDMwMDApXG4gICAgICAgIHRoaXMud2FzT2ZmbGluZSA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgI3VwZGF0ZU9ubGluZVN0YXR1cyA9IHRoaXMudXBkYXRlT25saW5lU3RhdHVzLmJpbmQodGhpcylcblxuICBnZXRJRCAoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0cy5pZFxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIHBsdWdpbiB3aXRoIENvcmUuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBQbHVnaW4gb2JqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0c10gb2JqZWN0IHdpdGggb3B0aW9ucyB0byBiZSBwYXNzZWQgdG8gUGx1Z2luXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IHNlbGYgZm9yIGNoYWluaW5nXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG4gIHVzZSAoUGx1Z2luLCBvcHRzKSB7XG4gICAgaWYgKHR5cGVvZiBQbHVnaW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IG1zZyA9IGBFeHBlY3RlZCBhIHBsdWdpbiBjbGFzcywgYnV0IGdvdCAke1BsdWdpbiA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiBQbHVnaW59LmBcbiAgICAgICAgKyAnIFBsZWFzZSB2ZXJpZnkgdGhhdCB0aGUgcGx1Z2luIHdhcyBpbXBvcnRlZCBhbmQgc3BlbGxlZCBjb3JyZWN0bHkuJ1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihtc2cpXG4gICAgfVxuXG4gICAgLy8gSW5zdGFudGlhdGVcbiAgICBjb25zdCBwbHVnaW4gPSBuZXcgUGx1Z2luKHRoaXMsIG9wdHMpXG4gICAgY29uc3QgcGx1Z2luSWQgPSBwbHVnaW4uaWRcblxuICAgIGlmICghcGx1Z2luSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91ciBwbHVnaW4gbXVzdCBoYXZlIGFuIGlkJylcbiAgICB9XG5cbiAgICBpZiAoIXBsdWdpbi50eXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgcGx1Z2luIG11c3QgaGF2ZSBhIHR5cGUnKVxuICAgIH1cblxuICAgIGNvbnN0IGV4aXN0c1BsdWdpbkFscmVhZHkgPSB0aGlzLmdldFBsdWdpbihwbHVnaW5JZClcbiAgICBpZiAoZXhpc3RzUGx1Z2luQWxyZWFkeSkge1xuICAgICAgY29uc3QgbXNnID0gYEFscmVhZHkgZm91bmQgYSBwbHVnaW4gbmFtZWQgJyR7ZXhpc3RzUGx1Z2luQWxyZWFkeS5pZH0nLiBgXG4gICAgICAgICsgYFRyaWVkIHRvIHVzZTogJyR7cGx1Z2luSWR9Jy5cXG5gXG4gICAgICAgICsgJ1VwcHkgcGx1Z2lucyBtdXN0IGhhdmUgdW5pcXVlIGBpZGAgb3B0aW9ucy4gU2VlIGh0dHBzOi8vdXBweS5pby9kb2NzL3BsdWdpbnMvI2lkLidcbiAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG4gICAgfVxuXG4gICAgaWYgKFBsdWdpbi5WRVJTSU9OKSB7XG4gICAgICB0aGlzLmxvZyhgVXNpbmcgJHtwbHVnaW5JZH0gdiR7UGx1Z2luLlZFUlNJT059YClcbiAgICB9XG5cbiAgICBpZiAocGx1Z2luLnR5cGUgaW4gdGhpcy4jcGx1Z2lucykge1xuICAgICAgdGhpcy4jcGx1Z2luc1twbHVnaW4udHlwZV0ucHVzaChwbHVnaW4pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuI3BsdWdpbnNbcGx1Z2luLnR5cGVdID0gW3BsdWdpbl1cbiAgICB9XG4gICAgcGx1Z2luLmluc3RhbGwoKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIG9uZSBQbHVnaW4gYnkgbmFtZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIHBsdWdpbiBpZFxuICAgKiBAcmV0dXJucyB7QmFzZVBsdWdpbnx1bmRlZmluZWR9XG4gICAqL1xuICBnZXRQbHVnaW4gKGlkKSB7XG4gICAgZm9yIChjb25zdCBwbHVnaW5zIG9mIE9iamVjdC52YWx1ZXModGhpcy4jcGx1Z2lucykpIHtcbiAgICAgIGNvbnN0IGZvdW5kUGx1Z2luID0gcGx1Z2lucy5maW5kKHBsdWdpbiA9PiBwbHVnaW4uaWQgPT09IGlkKVxuICAgICAgaWYgKGZvdW5kUGx1Z2luICE9IG51bGwpIHJldHVybiBmb3VuZFBsdWdpblxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuICBbU3ltYm9sLmZvcigndXBweSB0ZXN0OiBnZXRQbHVnaW5zJyldICh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuI3BsdWdpbnNbdHlwZV1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIHRocm91Z2ggYWxsIGB1c2VgZCBwbHVnaW5zLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXRob2QgdGhhdCB3aWxsIGJlIHJ1biBvbiBlYWNoIHBsdWdpblxuICAgKi9cbiAgaXRlcmF0ZVBsdWdpbnMgKG1ldGhvZCkge1xuICAgIE9iamVjdC52YWx1ZXModGhpcy4jcGx1Z2lucykuZmxhdCgxKS5mb3JFYWNoKG1ldGhvZClcbiAgfVxuXG4gIC8qKlxuICAgKiBVbmluc3RhbGwgYW5kIHJlbW92ZSBhIHBsdWdpbi5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGluc3RhbmNlIFRoZSBwbHVnaW4gaW5zdGFuY2UgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUGx1Z2luIChpbnN0YW5jZSkge1xuICAgIHRoaXMubG9nKGBSZW1vdmluZyBwbHVnaW4gJHtpbnN0YW5jZS5pZH1gKVxuICAgIHRoaXMuZW1pdCgncGx1Z2luLXJlbW92ZScsIGluc3RhbmNlKVxuXG4gICAgaWYgKGluc3RhbmNlLnVuaW5zdGFsbCkge1xuICAgICAgaW5zdGFuY2UudW5pbnN0YWxsKClcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gdGhpcy4jcGx1Z2luc1tpbnN0YW5jZS50eXBlXVxuICAgIC8vIGxpc3QuaW5kZXhPZiBmYWlsZWQgaGVyZSwgYmVjYXVzZSBWdWUzIGNvbnZlcnRlZCB0aGUgcGx1Z2luIGluc3RhbmNlXG4gICAgLy8gdG8gYSBQcm94eSBvYmplY3QsIHdoaWNoIGZhaWxlZCB0aGUgc3RyaWN0IGNvbXBhcmlzb24gdGVzdDpcbiAgICAvLyBvYmogIT09IG9ialByb3h5XG4gICAgY29uc3QgaW5kZXggPSBsaXN0LmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IGluc3RhbmNlLmlkKVxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGxpc3Quc3BsaWNlKGluZGV4LCAxKVxuICAgIH1cblxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgY29uc3QgdXBkYXRlZFN0YXRlID0ge1xuICAgICAgcGx1Z2luczoge1xuICAgICAgICAuLi5zdGF0ZS5wbHVnaW5zLFxuICAgICAgICBbaW5zdGFuY2UuaWRdOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHVwZGF0ZWRTdGF0ZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBVbmluc3RhbGwgYWxsIHBsdWdpbnMgYW5kIGNsb3NlIGRvd24gdGhpcyBVcHB5IGluc3RhbmNlLlxuICAgKi9cbiAgY2xvc2UgKCkge1xuICAgIHRoaXMubG9nKGBDbG9zaW5nIFVwcHkgaW5zdGFuY2UgJHt0aGlzLm9wdHMuaWR9OiByZW1vdmluZyBhbGwgZmlsZXMgYW5kIHVuaW5zdGFsbGluZyBwbHVnaW5zYClcblxuICAgIHRoaXMucmVzZXQoKVxuXG4gICAgdGhpcy4jc3RvcmVVbnN1YnNjcmliZSgpXG5cbiAgICB0aGlzLml0ZXJhdGVQbHVnaW5zKChwbHVnaW4pID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlUGx1Z2luKHBsdWdpbilcbiAgICB9KVxuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy4jdXBkYXRlT25saW5lU3RhdHVzKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCB0aGlzLiN1cGRhdGVPbmxpbmVTdGF0dXMpXG4gICAgfVxuICB9XG5cbiAgaGlkZUluZm8gKCkge1xuICAgIGNvbnN0IHsgaW5mbyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICB0aGlzLnNldFN0YXRlKHsgaW5mbzogaW5mby5zbGljZSgxKSB9KVxuXG4gICAgdGhpcy5lbWl0KCdpbmZvLWhpZGRlbicpXG4gIH1cblxuICAvKipcbiAgICogU2V0IGluZm8gbWVzc2FnZSBpbiBgc3RhdGUuaW5mb2AsIHNvIHRoYXQgVUkgcGx1Z2lucyBsaWtlIGBJbmZvcm1lcmBcbiAgICogY2FuIGRpc3BsYXkgdGhlIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgb2JqZWN0fSBtZXNzYWdlIE1lc3NhZ2UgdG8gYmUgZGlzcGxheWVkIGJ5IHRoZSBpbmZvcm1lclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3R5cGVdXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZHVyYXRpb25dXG4gICAqL1xuICBpbmZvIChtZXNzYWdlLCB0eXBlID0gJ2luZm8nLCBkdXJhdGlvbiA9IDMwMDApIHtcbiAgICBjb25zdCBpc0NvbXBsZXhNZXNzYWdlID0gdHlwZW9mIG1lc3NhZ2UgPT09ICdvYmplY3QnXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGluZm86IFtcbiAgICAgICAgLi4udGhpcy5nZXRTdGF0ZSgpLmluZm8sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIG1lc3NhZ2U6IGlzQ29tcGxleE1lc3NhZ2UgPyBtZXNzYWdlLm1lc3NhZ2UgOiBtZXNzYWdlLFxuICAgICAgICAgIGRldGFpbHM6IGlzQ29tcGxleE1lc3NhZ2UgPyBtZXNzYWdlLmRldGFpbHMgOiBudWxsLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmhpZGVJbmZvKCksIGR1cmF0aW9uKVxuXG4gICAgdGhpcy5lbWl0KCdpbmZvLXZpc2libGUnKVxuICB9XG5cbiAgLyoqXG4gICAqIFBhc3NlcyBtZXNzYWdlcyB0byBhIGZ1bmN0aW9uLCBwcm92aWRlZCBpbiBgb3B0cy5sb2dnZXJgLlxuICAgKiBJZiBgb3B0cy5sb2dnZXI6IFVwcHkuZGVidWdMb2dnZXJgIG9yIGBvcHRzLmRlYnVnOiB0cnVlYCwgbG9ncyB0byB0aGUgYnJvd3NlciBjb25zb2xlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IG1lc3NhZ2UgdG8gbG9nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gb3B0aW9uYWwgYGVycm9yYCBvciBgd2FybmluZ2BcbiAgICovXG4gIGxvZyAobWVzc2FnZSwgdHlwZSkge1xuICAgIGNvbnN0IHsgbG9nZ2VyIH0gPSB0aGlzLm9wdHNcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2Vycm9yJzogbG9nZ2VyLmVycm9yKG1lc3NhZ2UpOyBicmVha1xuICAgICAgY2FzZSAnd2FybmluZyc6IGxvZ2dlci53YXJuKG1lc3NhZ2UpOyBicmVha1xuICAgICAgZGVmYXVsdDogbG9nZ2VyLmRlYnVnKG1lc3NhZ2UpOyBicmVha1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0b3JlIGFuIHVwbG9hZCBieSBpdHMgSUQuXG4gICAqL1xuICByZXN0b3JlICh1cGxvYWRJRCkge1xuICAgIHRoaXMubG9nKGBDb3JlOiBhdHRlbXB0aW5nIHRvIHJlc3RvcmUgdXBsb2FkIFwiJHt1cGxvYWRJRH1cImApXG5cbiAgICBpZiAoIXRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0pIHtcbiAgICAgIHRoaXMuI3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ05vbmV4aXN0ZW50IHVwbG9hZCcpKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLiNydW5VcGxvYWQodXBsb2FkSUQpXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIHVwbG9hZCBmb3IgYSBidW5jaCBvZiBmaWxlcy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBmaWxlSURzIEZpbGUgSURzIHRvIGluY2x1ZGUgaW4gdGhpcyB1cGxvYWQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IElEIG9mIHRoaXMgdXBsb2FkLlxuICAgKi9cbiAgI2NyZWF0ZVVwbG9hZCAoZmlsZUlEcywgb3B0cyA9IHt9KSB7XG4gICAgLy8gdXBweS5yZXRyeUFsbCBzZXRzIHRoaXMgdG8gdHJ1ZSDigJQgd2hlbiByZXRyeWluZyB3ZSB3YW50IHRvIGlnbm9yZSBgYWxsb3dOZXdVcGxvYWQ6IGZhbHNlYFxuICAgIGNvbnN0IHsgZm9yY2VBbGxvd05ld1VwbG9hZCA9IGZhbHNlIH0gPSBvcHRzXG5cbiAgICBjb25zdCB7IGFsbG93TmV3VXBsb2FkLCBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgaWYgKCFhbGxvd05ld1VwbG9hZCAmJiAhZm9yY2VBbGxvd05ld1VwbG9hZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbmV3IHVwbG9hZDogYWxyZWFkeSB1cGxvYWRpbmcuJylcbiAgICB9XG5cbiAgICBjb25zdCB1cGxvYWRJRCA9IG5hbm9pZCgpXG5cbiAgICB0aGlzLmVtaXQoJ3VwbG9hZCcsIHtcbiAgICAgIGlkOiB1cGxvYWRJRCxcbiAgICAgIGZpbGVJRHMsXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgYWxsb3dOZXdVcGxvYWQ6IHRoaXMub3B0cy5hbGxvd011bHRpcGxlVXBsb2FkQmF0Y2hlcyAhPT0gZmFsc2UgJiYgdGhpcy5vcHRzLmFsbG93TXVsdGlwbGVVcGxvYWRzICE9PSBmYWxzZSxcblxuICAgICAgY3VycmVudFVwbG9hZHM6IHtcbiAgICAgICAgLi4uY3VycmVudFVwbG9hZHMsXG4gICAgICAgIFt1cGxvYWRJRF06IHtcbiAgICAgICAgICBmaWxlSURzLFxuICAgICAgICAgIHN0ZXA6IDAsXG4gICAgICAgICAgcmVzdWx0OiB7fSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIHJldHVybiB1cGxvYWRJRFxuICB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogY3JlYXRlVXBsb2FkJyldICguLi5hcmdzKSB7IHJldHVybiB0aGlzLiNjcmVhdGVVcGxvYWQoLi4uYXJncykgfVxuXG4gICNnZXRVcGxvYWQgKHVwbG9hZElEKSB7XG4gICAgY29uc3QgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICByZXR1cm4gY3VycmVudFVwbG9hZHNbdXBsb2FkSURdXG4gIH1cblxuICAvKipcbiAgICogQWRkIGRhdGEgdG8gYW4gdXBsb2FkJ3MgcmVzdWx0IG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwbG9hZElEIFRoZSBJRCBvZiB0aGUgdXBsb2FkLlxuICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSBEYXRhIHByb3BlcnRpZXMgdG8gYWRkIHRvIHRoZSByZXN1bHQgb2JqZWN0LlxuICAgKi9cbiAgYWRkUmVzdWx0RGF0YSAodXBsb2FkSUQsIGRhdGEpIHtcbiAgICBpZiAoIXRoaXMuI2dldFVwbG9hZCh1cGxvYWRJRCkpIHtcbiAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyByZXN1bHQgZm9yIGFuIHVwbG9hZCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7dXBsb2FkSUR9YClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCB7IGN1cnJlbnRVcGxvYWRzIH0gPSB0aGlzLmdldFN0YXRlKClcbiAgICBjb25zdCBjdXJyZW50VXBsb2FkID0geyAuLi5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0sIHJlc3VsdDogeyAuLi5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0ucmVzdWx0LCAuLi5kYXRhIH0gfVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFVwbG9hZHM6IHsgLi4uY3VycmVudFVwbG9hZHMsIFt1cGxvYWRJRF06IGN1cnJlbnRVcGxvYWQgfSxcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiB1cGxvYWQsIGVnLiBpZiBpdCBoYXMgYmVlbiBjYW5jZWxlZCBvciBjb21wbGV0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGxvYWRJRCBUaGUgSUQgb2YgdGhlIHVwbG9hZC5cbiAgICovXG4gICNyZW1vdmVVcGxvYWQgKHVwbG9hZElEKSB7XG4gICAgY29uc3QgY3VycmVudFVwbG9hZHMgPSB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2FkcyB9XG4gICAgZGVsZXRlIGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50VXBsb2FkcyxcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJ1biBhbiB1cGxvYWQuIFRoaXMgcGlja3MgdXAgd2hlcmUgaXQgbGVmdCBvZmYgaW4gY2FzZSB0aGUgdXBsb2FkIGlzIGJlaW5nIHJlc3RvcmVkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXN5bmMgI3J1blVwbG9hZCAodXBsb2FkSUQpIHtcbiAgICBsZXQgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgbGV0IGN1cnJlbnRVcGxvYWQgPSBjdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF1cbiAgICBjb25zdCByZXN0b3JlU3RlcCA9IGN1cnJlbnRVcGxvYWQuc3RlcCB8fCAwXG5cbiAgICBjb25zdCBzdGVwcyA9IFtcbiAgICAgIC4uLnRoaXMuI3ByZVByb2Nlc3NvcnMsXG4gICAgICAuLi50aGlzLiN1cGxvYWRlcnMsXG4gICAgICAuLi50aGlzLiNwb3N0UHJvY2Vzc29ycyxcbiAgICBdXG4gICAgdHJ5IHtcbiAgICAgIGZvciAobGV0IHN0ZXAgPSByZXN0b3JlU3RlcDsgc3RlcCA8IHN0ZXBzLmxlbmd0aDsgc3RlcCsrKSB7XG4gICAgICAgIGlmICghY3VycmVudFVwbG9hZCkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZm4gPSBzdGVwc1tzdGVwXVxuXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRVcGxvYWQgPSB7XG4gICAgICAgICAgLi4uY3VycmVudFVwbG9hZCxcbiAgICAgICAgICBzdGVwLFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY3VycmVudFVwbG9hZHM6IHtcbiAgICAgICAgICAgIC4uLmN1cnJlbnRVcGxvYWRzLFxuICAgICAgICAgICAgW3VwbG9hZElEXTogdXBkYXRlZFVwbG9hZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIFRPRE8gZ2l2ZSB0aGlzIHRoZSBgdXBkYXRlZFVwbG9hZGAgb2JqZWN0IGFzIGl0cyBvbmx5IHBhcmFtZXRlciBtYXliZT9cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHdoZW4gbW9yZSBtZXRhZGF0YSBtYXkgYmUgYWRkZWQgdG8gdGhlIHVwbG9hZCB0aGlzIHdvdWxkIGtlZXAgZ2V0dGluZyBtb3JlIHBhcmFtZXRlcnNcbiAgICAgICAgYXdhaXQgZm4odXBkYXRlZFVwbG9hZC5maWxlSURzLCB1cGxvYWRJRClcblxuICAgICAgICAvLyBVcGRhdGUgY3VycmVudFVwbG9hZCB2YWx1ZSBpbiBjYXNlIGl0IHdhcyBtb2RpZmllZCBhc3luY2hyb25vdXNseS5cbiAgICAgICAgY3VycmVudFVwbG9hZHMgPSB0aGlzLmdldFN0YXRlKCkuY3VycmVudFVwbG9hZHNcbiAgICAgICAgY3VycmVudFVwbG9hZCA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycilcbiAgICAgIHRoaXMuI3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcbiAgICAgIHRocm93IGVyclxuICAgIH1cblxuICAgIC8vIFNldCByZXN1bHQgZGF0YS5cbiAgICBpZiAoY3VycmVudFVwbG9hZCkge1xuICAgICAgLy8gTWFyayBwb3N0cHJvY2Vzc2luZyBzdGVwIGFzIGNvbXBsZXRlIGlmIG5lY2Vzc2FyeTsgdGhpcyBhZGRyZXNzZXMgYSBjYXNlIHdoZXJlIHdlIG1pZ2h0IGdldFxuICAgICAgLy8gc3R1Y2sgaW4gdGhlIHBvc3Rwcm9jZXNzaW5nIFVJIHdoaWxlIHRoZSB1cGxvYWQgaXMgZnVsbHkgY29tcGxldGUuXG4gICAgICAvLyBJZiB0aGUgcG9zdHByb2Nlc3Npbmcgc3RlcHMgZG8gbm90IGRvIGFueSB3b3JrLCB0aGV5IG1heSBub3QgZW1pdCBwb3N0cHJvY2Vzc2luZyBldmVudHMgYXRcbiAgICAgIC8vIGFsbCwgYW5kIG5ldmVyIG1hcmsgdGhlIHBvc3Rwcm9jZXNzaW5nIGFzIGNvbXBsZXRlLiBUaGlzIGlzIGZpbmUgb24gaXRzIG93biBidXQgd2VcbiAgICAgIC8vIGludHJvZHVjZWQgY29kZSBpbiB0aGUgQHVwcHkvY29yZSB1cGxvYWQtc3VjY2VzcyBoYW5kbGVyIHRvIHByZXBhcmUgcG9zdHByb2Nlc3NpbmcgcHJvZ3Jlc3NcbiAgICAgIC8vIHN0YXRlIGlmIGFueSBwb3N0cHJvY2Vzc29ycyBhcmUgcmVnaXN0ZXJlZC4gVGhhdCBpcyB0byBhdm9pZCBhIFwiZmxhc2ggb2YgY29tcGxldGVkIHN0YXRlXCJcbiAgICAgIC8vIGJlZm9yZSB0aGUgcG9zdHByb2Nlc3NpbmcgcGx1Z2lucyBjYW4gZW1pdCBldmVudHMuXG4gICAgICAvL1xuICAgICAgLy8gU28sIGp1c3QgaW4gY2FzZSBhbiB1cGxvYWQgd2l0aCBwb3N0cHJvY2Vzc2luZyBwbHVnaW5zICpoYXMqIGNvbXBsZXRlZCAqd2l0aG91dCogZW1pdHRpbmdcbiAgICAgIC8vIHBvc3Rwcm9jZXNzaW5nIGNvbXBsZXRpb24sIHdlIGRvIGl0IGluc3RlYWQuXG4gICAgICBjdXJyZW50VXBsb2FkLmZpbGVJRHMuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmdldEZpbGUoZmlsZUlEKVxuICAgICAgICBpZiAoZmlsZSAmJiBmaWxlLnByb2dyZXNzLnBvc3Rwcm9jZXNzKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdwb3N0cHJvY2Vzcy1jb21wbGV0ZScsIGZpbGUpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGZpbGVzID0gY3VycmVudFVwbG9hZC5maWxlSURzLm1hcCgoZmlsZUlEKSA9PiB0aGlzLmdldEZpbGUoZmlsZUlEKSlcbiAgICAgIGNvbnN0IHN1Y2Nlc3NmdWwgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+ICFmaWxlLmVycm9yKVxuICAgICAgY29uc3QgZmFpbGVkID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLmVycm9yKVxuICAgICAgYXdhaXQgdGhpcy5hZGRSZXN1bHREYXRhKHVwbG9hZElELCB7IHN1Y2Nlc3NmdWwsIGZhaWxlZCwgdXBsb2FkSUQgfSlcblxuICAgICAgLy8gVXBkYXRlIGN1cnJlbnRVcGxvYWQgdmFsdWUgaW4gY2FzZSBpdCB3YXMgbW9kaWZpZWQgYXN5bmNocm9ub3VzbHkuXG4gICAgICBjdXJyZW50VXBsb2FkcyA9IHRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2Fkc1xuICAgICAgY3VycmVudFVwbG9hZCA9IGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuICAgIH1cbiAgICAvLyBFbWl0IGNvbXBsZXRpb24gZXZlbnRzLlxuICAgIC8vIFRoaXMgaXMgaW4gYSBzZXBhcmF0ZSBmdW5jdGlvbiBzbyB0aGF0IHRoZSBgY3VycmVudFVwbG9hZHNgIHZhcmlhYmxlXG4gICAgLy8gYWx3YXlzIHJlZmVycyB0byB0aGUgbGF0ZXN0IHN0YXRlLiBJbiB0aGUgaGFuZGxlciByaWdodCBhYm92ZSBpdCByZWZlcnNcbiAgICAvLyB0byBhbiBvdXRkYXRlZCBvYmplY3Qgd2l0aG91dCB0aGUgYC5yZXN1bHRgIHByb3BlcnR5LlxuICAgIGxldCByZXN1bHRcbiAgICBpZiAoY3VycmVudFVwbG9hZCkge1xuICAgICAgcmVzdWx0ID0gY3VycmVudFVwbG9hZC5yZXN1bHRcbiAgICAgIHRoaXMuZW1pdCgnY29tcGxldGUnLCByZXN1bHQpXG5cbiAgICAgIHRoaXMuI3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcbiAgICB9XG4gICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcmVzdWx0IGZvciBhbiB1cGxvYWQgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke3VwbG9hZElEfWApXG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCBhbiB1cGxvYWQgZm9yIGFsbCB0aGUgZmlsZXMgdGhhdCBhcmUgbm90IGN1cnJlbnRseSBiZWluZyB1cGxvYWRlZC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICB1cGxvYWQgKCkge1xuICAgIGlmICghdGhpcy4jcGx1Z2lucy51cGxvYWRlcj8ubGVuZ3RoKSB7XG4gICAgICB0aGlzLmxvZygnTm8gdXBsb2FkZXIgdHlwZSBwbHVnaW5zIGFyZSB1c2VkJywgJ3dhcm5pbmcnKVxuICAgIH1cblxuICAgIGxldCB7IGZpbGVzIH0gPSB0aGlzLmdldFN0YXRlKClcblxuICAgIGNvbnN0IG9uQmVmb3JlVXBsb2FkUmVzdWx0ID0gdGhpcy5vcHRzLm9uQmVmb3JlVXBsb2FkKGZpbGVzKVxuXG4gICAgaWYgKG9uQmVmb3JlVXBsb2FkUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignTm90IHN0YXJ0aW5nIHRoZSB1cGxvYWQgYmVjYXVzZSBvbkJlZm9yZVVwbG9hZCByZXR1cm5lZCBmYWxzZScpKVxuICAgIH1cblxuICAgIGlmIChvbkJlZm9yZVVwbG9hZFJlc3VsdCAmJiB0eXBlb2Ygb25CZWZvcmVVcGxvYWRSZXN1bHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBmaWxlcyA9IG9uQmVmb3JlVXBsb2FkUmVzdWx0XG4gICAgICAvLyBVcGRhdGluZyBmaWxlcyBpbiBzdGF0ZSwgYmVjYXVzZSB1cGxvYWRlciBwbHVnaW5zIHJlY2VpdmUgZmlsZSBJRHMsXG4gICAgICAvLyBhbmQgdGhlbiBmZXRjaCB0aGUgYWN0dWFsIGZpbGUgb2JqZWN0IGZyb20gc3RhdGVcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmaWxlcyxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuI2NoZWNrTWluTnVtYmVyT2ZGaWxlcyhmaWxlcylcbiAgICAgICAgdGhpcy4jY2hlY2tSZXF1aXJlZE1ldGFGaWVsZHMoZmlsZXMpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIpXG4gICAgICB9KVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRVcGxvYWRzIH0gPSB0aGlzLmdldFN0YXRlKClcbiAgICAgICAgLy8gZ2V0IGEgbGlzdCBvZiBmaWxlcyB0aGF0IGFyZSBjdXJyZW50bHkgYXNzaWduZWQgdG8gdXBsb2Fkc1xuICAgICAgICBjb25zdCBjdXJyZW50bHlVcGxvYWRpbmdGaWxlcyA9IE9iamVjdC52YWx1ZXMoY3VycmVudFVwbG9hZHMpLmZsYXRNYXAoY3VyciA9PiBjdXJyLmZpbGVJRHMpXG5cbiAgICAgICAgY29uc3Qgd2FpdGluZ0ZpbGVJRHMgPSBbXVxuICAgICAgICBPYmplY3Qua2V5cyhmaWxlcykuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuZ2V0RmlsZShmaWxlSUQpXG4gICAgICAgICAgLy8gaWYgdGhlIGZpbGUgaGFzbid0IHN0YXJ0ZWQgdXBsb2FkaW5nIGFuZCBoYXNuJ3QgYWxyZWFkeSBiZWVuIGFzc2lnbmVkIHRvIGFuIHVwbG9hZC4uXG4gICAgICAgICAgaWYgKCghZmlsZS5wcm9ncmVzcy51cGxvYWRTdGFydGVkKSAmJiAoY3VycmVudGx5VXBsb2FkaW5nRmlsZXMuaW5kZXhPZihmaWxlSUQpID09PSAtMSkpIHtcbiAgICAgICAgICAgIHdhaXRpbmdGaWxlSURzLnB1c2goZmlsZS5pZClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLiNjcmVhdGVVcGxvYWQod2FpdGluZ0ZpbGVJRHMpXG4gICAgICAgIHJldHVybiB0aGlzLiNydW5VcGxvYWQodXBsb2FkSUQpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnIsIHtcbiAgICAgICAgICBzaG93SW5mb3JtZXI6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVwcHlcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0RmlsZU5hbWUgKGZpbGVUeXBlLCBmaWxlRGVzY3JpcHRvcikge1xuICBpZiAoZmlsZURlc2NyaXB0b3IubmFtZSkge1xuICAgIHJldHVybiBmaWxlRGVzY3JpcHRvci5uYW1lXG4gIH1cblxuICBpZiAoZmlsZVR5cGUuc3BsaXQoJy8nKVswXSA9PT0gJ2ltYWdlJykge1xuICAgIHJldHVybiBgJHtmaWxlVHlwZS5zcGxpdCgnLycpWzBdfS4ke2ZpbGVUeXBlLnNwbGl0KCcvJylbMV19YFxuICB9XG5cbiAgcmV0dXJuICdub25hbWUnXG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgVXBweSA9IHJlcXVpcmUoJy4vVXBweScpXG5jb25zdCBVSVBsdWdpbiA9IHJlcXVpcmUoJy4vVUlQbHVnaW4nKVxuY29uc3QgQmFzZVBsdWdpbiA9IHJlcXVpcmUoJy4vQmFzZVBsdWdpbicpXG5jb25zdCB7IGRlYnVnTG9nZ2VyIH0gPSByZXF1aXJlKCcuL2xvZ2dlcnMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVwcHlcbm1vZHVsZS5leHBvcnRzLlVwcHkgPSBVcHB5XG5tb2R1bGUuZXhwb3J0cy5VSVBsdWdpbiA9IFVJUGx1Z2luXG5tb2R1bGUuZXhwb3J0cy5CYXNlUGx1Z2luID0gQmFzZVBsdWdpblxubW9kdWxlLmV4cG9ydHMuZGVidWdMb2dnZXIgPSBkZWJ1Z0xvZ2dlclxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuY29uc3QgZ2V0VGltZVN0YW1wID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2dldFRpbWVTdGFtcCcpXG5cbi8vIFN3YWxsb3cgYWxsIGxvZ3MsIGV4Y2VwdCBlcnJvcnMuXG4vLyBkZWZhdWx0IGlmIGxvZ2dlciBpcyBub3Qgc2V0IG9yIGRlYnVnOiBmYWxzZVxuY29uc3QganVzdEVycm9yc0xvZ2dlciA9IHtcbiAgZGVidWc6ICgpID0+IHt9LFxuICB3YXJuOiAoKSA9PiB7fSxcbiAgZXJyb3I6ICguLi5hcmdzKSA9PiBjb25zb2xlLmVycm9yKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpLFxufVxuXG4vLyBQcmludCBsb2dzIHRvIGNvbnNvbGUgd2l0aCBuYW1lc3BhY2UgKyB0aW1lc3RhbXAsXG4vLyBzZXQgYnkgbG9nZ2VyOiBVcHB5LmRlYnVnTG9nZ2VyIG9yIGRlYnVnOiB0cnVlXG5jb25zdCBkZWJ1Z0xvZ2dlciA9IHtcbiAgZGVidWc6ICguLi5hcmdzKSA9PiBjb25zb2xlLmRlYnVnKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpLFxuICB3YXJuOiAoLi4uYXJncykgPT4gY29uc29sZS53YXJuKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpLFxuICBlcnJvcjogKC4uLmFyZ3MpID0+IGNvbnNvbGUuZXJyb3IoYFtVcHB5XSBbJHtnZXRUaW1lU3RhbXAoKX1dYCwgLi4uYXJncyksXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBqdXN0RXJyb3JzTG9nZ2VyLFxuICBkZWJ1Z0xvZ2dlcixcbn1cbiIsIi8vIEVkZ2UgMTUueCBkb2VzIG5vdCBmaXJlICdwcm9ncmVzcycgZXZlbnRzIG9uIHVwbG9hZHMuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3RyYW5zbG9hZGl0L3VwcHkvaXNzdWVzLzk0NVxuLy8gQW5kIGh0dHBzOi8vZGV2ZWxvcGVyLm1pY3Jvc29mdC5jb20vZW4tdXMvbWljcm9zb2Z0LWVkZ2UvcGxhdGZvcm0vaXNzdWVzLzEyMjI0NTEwL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdXBwb3J0c1VwbG9hZFByb2dyZXNzICh1c2VyQWdlbnQpIHtcbiAgLy8gQWxsb3cgcGFzc2luZyBpbiB1c2VyQWdlbnQgZm9yIHRlc3RzXG4gIGlmICh1c2VyQWdlbnQgPT0gbnVsbCkge1xuICAgIHVzZXJBZ2VudCA9IHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnID8gbmF2aWdhdG9yLnVzZXJBZ2VudCA6IG51bGxcbiAgfVxuICAvLyBBc3N1bWUgaXQgd29ya3MgYmVjYXVzZSBiYXNpY2FsbHkgZXZlcnl0aGluZyBzdXBwb3J0cyBwcm9ncmVzcyBldmVudHMuXG4gIGlmICghdXNlckFnZW50KSByZXR1cm4gdHJ1ZVxuXG4gIGNvbnN0IG0gPSAvRWRnZVxcLyhcXGQrXFwuXFxkKykvLmV4ZWModXNlckFnZW50KVxuICBpZiAoIW0pIHJldHVybiB0cnVlXG5cbiAgY29uc3QgZWRnZVZlcnNpb24gPSBtWzFdXG4gIGxldCBbbWFqb3IsIG1pbm9yXSA9IGVkZ2VWZXJzaW9uLnNwbGl0KCcuJylcbiAgbWFqb3IgPSBwYXJzZUludChtYWpvciwgMTApXG4gIG1pbm9yID0gcGFyc2VJbnQobWlub3IsIDEwKVxuXG4gIC8vIFdvcmtlZCBiZWZvcmU6XG4gIC8vIEVkZ2UgNDAuMTUwNjMuMC4wXG4gIC8vIE1pY3Jvc29mdCBFZGdlSFRNTCAxNS4xNTA2M1xuICBpZiAobWFqb3IgPCAxNSB8fCAobWFqb3IgPT09IDE1ICYmIG1pbm9yIDwgMTUwNjMpKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIC8vIEZpeGVkIGluOlxuICAvLyBNaWNyb3NvZnQgRWRnZUhUTUwgMTguMTgyMThcbiAgaWYgKG1ham9yID4gMTggfHwgKG1ham9yID09PSAxOCAmJiBtaW5vciA+PSAxODIxOCkpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgLy8gb3RoZXIgdmVyc2lvbnMgZG9uJ3Qgd29yay5cbiAgcmV0dXJuIGZhbHNlXG59XG4iLCJjb25zdCB7IFVJUGx1Z2luIH0gPSByZXF1aXJlKCdAdXBweS9jb3JlJylcbmNvbnN0IHRvQXJyYXkgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvdG9BcnJheScpXG5jb25zdCB7IGggfSA9IHJlcXVpcmUoJ3ByZWFjdCcpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRmlsZUlucHV0IGV4dGVuZHMgVUlQbHVnaW4ge1xuICBzdGF0aWMgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb25cblxuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHN1cGVyKHVwcHksIG9wdHMpXG4gICAgdGhpcy5pZCA9IHRoaXMub3B0cy5pZCB8fCAnRmlsZUlucHV0J1xuICAgIHRoaXMudGl0bGUgPSAnRmlsZSBJbnB1dCdcbiAgICB0aGlzLnR5cGUgPSAnYWNxdWlyZXInXG5cbiAgICB0aGlzLmRlZmF1bHRMb2NhbGUgPSB7XG4gICAgICBzdHJpbmdzOiB7XG4gICAgICAgIC8vIFRoZSBzYW1lIGtleSBpcyB1c2VkIGZvciB0aGUgc2FtZSBwdXJwb3NlIGJ5IEB1cHB5L3JvYm9kb2cncyBgZm9ybSgpYCBBUEksIGJ1dCBvdXJcbiAgICAgICAgLy8gbG9jYWxlIHBhY2sgc2NyaXB0cyBjYW4ndCBhY2Nlc3MgaXQgaW4gUm9ib2RvZy4gSWYgaXQgaXMgdXBkYXRlZCBoZXJlLCBpdCBzaG91bGRcbiAgICAgICAgLy8gYWxzbyBiZSB1cGRhdGVkIHRoZXJlIVxuICAgICAgICBjaG9vc2VGaWxlczogJ0Nob29zZSBmaWxlcycsXG4gICAgICB9LFxuICAgIH1cblxuICAgIC8vIERlZmF1bHQgb3B0aW9uc1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgdGFyZ2V0OiBudWxsLFxuICAgICAgcHJldHR5OiB0cnVlLFxuICAgICAgaW5wdXROYW1lOiAnZmlsZXNbXScsXG4gICAgfVxuXG4gICAgLy8gTWVyZ2UgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIG9uZXMgc2V0IGJ5IHVzZXJcbiAgICB0aGlzLm9wdHMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRzIH1cblxuICAgIHRoaXMuaTE4bkluaXQoKVxuXG4gICAgdGhpcy5yZW5kZXIgPSB0aGlzLnJlbmRlci5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVJbnB1dENoYW5nZSA9IHRoaXMuaGFuZGxlSW5wdXRDaGFuZ2UuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcylcbiAgfVxuXG4gIGFkZEZpbGVzIChmaWxlcykge1xuICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gZmlsZXMubWFwKChmaWxlKSA9PiAoe1xuICAgICAgc291cmNlOiB0aGlzLmlkLFxuICAgICAgbmFtZTogZmlsZS5uYW1lLFxuICAgICAgdHlwZTogZmlsZS50eXBlLFxuICAgICAgZGF0YTogZmlsZSxcbiAgICB9KSlcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnVwcHkuYWRkRmlsZXMoZGVzY3JpcHRvcnMpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKGVycilcbiAgICB9XG4gIH1cblxuICBoYW5kbGVJbnB1dENoYW5nZSAoZXZlbnQpIHtcbiAgICB0aGlzLnVwcHkubG9nKCdbRmlsZUlucHV0XSBTb21ldGhpbmcgc2VsZWN0ZWQgdGhyb3VnaCBpbnB1dC4uLicpXG4gICAgY29uc3QgZmlsZXMgPSB0b0FycmF5KGV2ZW50LnRhcmdldC5maWxlcylcbiAgICB0aGlzLmFkZEZpbGVzKGZpbGVzKVxuXG4gICAgLy8gV2UgY2xlYXIgdGhlIGlucHV0IGFmdGVyIGEgZmlsZSBpcyBzZWxlY3RlZCwgYmVjYXVzZSBvdGhlcndpc2VcbiAgICAvLyBjaGFuZ2UgZXZlbnQgaXMgbm90IGZpcmVkIGluIENocm9tZSBhbmQgU2FmYXJpIHdoZW4gYSBmaWxlXG4gICAgLy8gd2l0aCB0aGUgc2FtZSBuYW1lIGlzIHNlbGVjdGVkLlxuICAgIC8vIF9fX1doeSBub3QgdXNlIHZhbHVlPVwiXCIgb24gPGlucHV0Lz4gaW5zdGVhZD9cbiAgICAvLyAgICBCZWNhdXNlIGlmIHdlIHVzZSB0aGF0IG1ldGhvZCBvZiBjbGVhcmluZyB0aGUgaW5wdXQsXG4gICAgLy8gICAgQ2hyb21lIHdpbGwgbm90IHRyaWdnZXIgY2hhbmdlIGlmIHdlIGRyb3AgdGhlIHNhbWUgZmlsZSB0d2ljZSAoSXNzdWUgIzc2OCkuXG4gICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gbnVsbFxuICB9XG5cbiAgaGFuZGxlQ2xpY2sgKCkge1xuICAgIHRoaXMuaW5wdXQuY2xpY2soKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICAvKiBodHRwOi8vdHltcGFudXMubmV0L2NvZHJvcHMvMjAxNS8wOS8xNS9zdHlsaW5nLWN1c3RvbWl6aW5nLWZpbGUtaW5wdXRzLXNtYXJ0LXdheS8gKi9cbiAgICBjb25zdCBoaWRkZW5JbnB1dFN0eWxlID0ge1xuICAgICAgd2lkdGg6ICcwLjFweCcsXG4gICAgICBoZWlnaHQ6ICcwLjFweCcsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB6SW5kZXg6IC0xLFxuICAgIH1cblxuICAgIGNvbnN0IHsgcmVzdHJpY3Rpb25zIH0gPSB0aGlzLnVwcHkub3B0c1xuICAgIGNvbnN0IGFjY2VwdCA9IHJlc3RyaWN0aW9ucy5hbGxvd2VkRmlsZVR5cGVzID8gcmVzdHJpY3Rpb25zLmFsbG93ZWRGaWxlVHlwZXMuam9pbignLCcpIDogbnVsbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBweS1Sb290IHVwcHktRmlsZUlucHV0LWNvbnRhaW5lclwiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBjbGFzc05hbWU9XCJ1cHB5LUZpbGVJbnB1dC1pbnB1dFwiXG4gICAgICAgICAgc3R5bGU9e3RoaXMub3B0cy5wcmV0dHkgJiYgaGlkZGVuSW5wdXRTdHlsZX1cbiAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgbmFtZT17dGhpcy5vcHRzLmlucHV0TmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVJbnB1dENoYW5nZX1cbiAgICAgICAgICBtdWx0aXBsZT17cmVzdHJpY3Rpb25zLm1heE51bWJlck9mRmlsZXMgIT09IDF9XG4gICAgICAgICAgYWNjZXB0PXthY2NlcHR9XG4gICAgICAgICAgcmVmPXsoaW5wdXQpID0+IHsgdGhpcy5pbnB1dCA9IGlucHV0IH19XG4gICAgICAgIC8+XG4gICAgICAgIHt0aGlzLm9wdHMucHJldHR5XG4gICAgICAgICAgJiYgKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInVwcHktRmlsZUlucHV0LWJ0blwiXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RoaXMuaTE4bignY2hvb3NlRmlsZXMnKX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgaW5zdGFsbCAoKSB7XG4gICAgY29uc3QgeyB0YXJnZXQgfSA9IHRoaXMub3B0c1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHRoaXMubW91bnQodGFyZ2V0LCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIHVuaW5zdGFsbCAoKSB7XG4gICAgdGhpcy51bm1vdW50KClcbiAgfVxufVxuIiwiY29uc3QgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKVxuY29uc3QgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKVxuY29uc3QgcHJldHRpZXJCeXRlcyA9IHJlcXVpcmUoJ0B0cmFuc2xvYWRpdC9wcmV0dGllci1ieXRlcycpXG5jb25zdCBwcmV0dHlFVEEgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvcHJldHR5RVRBJylcbmNvbnN0IHsgaCB9ID0gcmVxdWlyZSgncHJlYWN0JylcblxuY29uc3Qgc3RhdHVzQmFyU3RhdGVzID0gcmVxdWlyZSgnLi9TdGF0dXNCYXJTdGF0ZXMnKVxuXG5jb25zdCBET1QgPSBgXFx1MDBCN2BcbmNvbnN0IHJlbmRlckRvdCA9ICgpID0+IGAgJHtET1R9IGBcblxuZnVuY3Rpb24gVXBsb2FkQnRuIChwcm9wcykge1xuICBjb25zdCB7XG4gICAgbmV3RmlsZXMsXG4gICAgaXNVcGxvYWRTdGFydGVkLFxuICAgIHJlY292ZXJlZFN0YXRlLFxuICAgIGkxOG4sXG4gICAgdXBsb2FkU3RhdGUsXG4gICAgaXNTb21lR2hvc3QsXG4gICAgc3RhcnRVcGxvYWQsXG4gIH0gPSBwcm9wc1xuXG4gIGNvbnN0IHVwbG9hZEJ0bkNsYXNzTmFtZXMgPSBjbGFzc05hbWVzKFxuICAgICd1cHB5LXUtcmVzZXQnLFxuICAgICd1cHB5LWMtYnRuJyxcbiAgICAndXBweS1TdGF0dXNCYXItYWN0aW9uQnRuJyxcbiAgICAndXBweS1TdGF0dXNCYXItYWN0aW9uQnRuLS11cGxvYWQnLFxuICAgIHtcbiAgICAgICd1cHB5LWMtYnRuLXByaW1hcnknOiB1cGxvYWRTdGF0ZSA9PT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1dBSVRJTkcsXG4gICAgfSxcbiAgICB7ICd1cHB5LVN0YXR1c0Jhci1hY3Rpb25CdG4tLWRpc2FibGVkJzogaXNTb21lR2hvc3QgfVxuICApXG5cbiAgY29uc3QgdXBsb2FkQnRuVGV4dFxuICAgID0gbmV3RmlsZXMgJiYgaXNVcGxvYWRTdGFydGVkICYmICFyZWNvdmVyZWRTdGF0ZVxuICAgICAgPyBpMThuKCd1cGxvYWRYTmV3RmlsZXMnLCB7IHNtYXJ0X2NvdW50OiBuZXdGaWxlcyB9KVxuICAgICAgOiBpMThuKCd1cGxvYWRYRmlsZXMnLCB7IHNtYXJ0X2NvdW50OiBuZXdGaWxlcyB9KVxuXG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9e3VwbG9hZEJ0bkNsYXNzTmFtZXN9XG4gICAgICBhcmlhLWxhYmVsPXtpMThuKCd1cGxvYWRYRmlsZXMnLCB7IHNtYXJ0X2NvdW50OiBuZXdGaWxlcyB9KX1cbiAgICAgIG9uQ2xpY2s9e3N0YXJ0VXBsb2FkfVxuICAgICAgZGlzYWJsZWQ9e2lzU29tZUdob3N0fVxuICAgICAgZGF0YS11cHB5LXN1cGVyLWZvY3VzYWJsZVxuICAgID5cbiAgICAgIHt1cGxvYWRCdG5UZXh0fVxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmZ1bmN0aW9uIFJldHJ5QnRuIChwcm9wcykge1xuICBjb25zdCB7IGkxOG4sIHVwcHkgfSA9IHByb3BzXG5cbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIGNsYXNzTmFtZT1cInVwcHktdS1yZXNldCB1cHB5LWMtYnRuIHVwcHktU3RhdHVzQmFyLWFjdGlvbkJ0biB1cHB5LVN0YXR1c0Jhci1hY3Rpb25CdG4tLXJldHJ5XCJcbiAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ3JldHJ5VXBsb2FkJyl9XG4gICAgICBvbkNsaWNrPXsoKSA9PiB1cHB5LnJldHJ5QWxsKCl9XG4gICAgICBkYXRhLXVwcHktc3VwZXItZm9jdXNhYmxlXG4gICAgPlxuICAgICAgPHN2Z1xuICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gICAgICAgIGNsYXNzTmFtZT1cInVwcHktYy1pY29uXCJcbiAgICAgICAgd2lkdGg9XCI4XCJcbiAgICAgICAgaGVpZ2h0PVwiMTBcIlxuICAgICAgICB2aWV3Qm94PVwiMCAwIDggMTBcIlxuICAgICAgPlxuICAgICAgICA8cGF0aCBkPVwiTTQgMi40MDhhMi43NSAyLjc1IDAgMSAwIDIuNzUgMi43NS42MjYuNjI2IDAgMCAxIDEuMjUuMDE4di4wMjNhNCA0IDAgMSAxLTQtNC4wNDFWLjI1YS4yNS4yNSAwIDAgMSAuMzg5LS4yMDhsMi4yOTkgMS41MzNhLjI1LjI1IDAgMCAxIDAgLjQxNmwtMi4zIDEuNTMzQS4yNS4yNSAwIDAgMSA0IDMuMzE2di0uOTA4elwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICAgIHtpMThuKCdyZXRyeScpfVxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmZ1bmN0aW9uIENhbmNlbEJ0biAocHJvcHMpIHtcbiAgY29uc3QgeyBpMThuLCB1cHB5IH0gPSBwcm9wc1xuXG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9XCJ1cHB5LXUtcmVzZXQgdXBweS1TdGF0dXNCYXItYWN0aW9uQ2lyY2xlQnRuXCJcbiAgICAgIHRpdGxlPXtpMThuKCdjYW5jZWwnKX1cbiAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ2NhbmNlbCcpfVxuICAgICAgb25DbGljaz17KCkgPT4gdXBweS5jYW5jZWxBbGwoKX1cbiAgICAgIGRhdGEtdXBweS1zdXBlci1mb2N1c2FibGVcbiAgICA+XG4gICAgICA8c3ZnXG4gICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgIGZvY3VzYWJsZT1cImZhbHNlXCJcbiAgICAgICAgY2xhc3NOYW1lPVwidXBweS1jLWljb25cIlxuICAgICAgICB3aWR0aD1cIjE2XCJcbiAgICAgICAgaGVpZ2h0PVwiMTZcIlxuICAgICAgICB2aWV3Qm94PVwiMCAwIDE2IDE2XCJcbiAgICAgID5cbiAgICAgICAgPGcgZmlsbD1cIm5vbmVcIiBmaWxsUnVsZT1cImV2ZW5vZGRcIj5cbiAgICAgICAgICA8Y2lyY2xlIGZpbGw9XCIjODg4XCIgY3g9XCI4XCIgY3k9XCI4XCIgcj1cIjhcIiAvPlxuICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICBmaWxsPVwiI0ZGRlwiXG4gICAgICAgICAgICBkPVwiTTkuMjgzIDhsMi41NjcgMi41NjctMS4yODMgMS4yODNMOCA5LjI4MyA1LjQzMyAxMS44NSA0LjE1IDEwLjU2NyA2LjcxNyA4IDQuMTUgNS40MzMgNS40MzMgNC4xNSA4IDYuNzE3bDIuNTY3LTIuNTY3IDEuMjgzIDEuMjgzelwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9nPlxuICAgICAgPC9zdmc+XG4gICAgPC9idXR0b24+XG4gIClcbn1cblxuZnVuY3Rpb24gUGF1c2VSZXN1bWVCdXR0b24gKHByb3BzKSB7XG4gIGNvbnN0IHsgaXNBbGxQYXVzZWQsIGkxOG4sIGlzQWxsQ29tcGxldGUsIHJlc3VtYWJsZVVwbG9hZHMsIHVwcHkgfSA9IHByb3BzXG4gIGNvbnN0IHRpdGxlID0gaXNBbGxQYXVzZWQgPyBpMThuKCdyZXN1bWUnKSA6IGkxOG4oJ3BhdXNlJylcblxuICBmdW5jdGlvbiB0b2dnbGVQYXVzZVJlc3VtZSAoKSB7XG4gICAgaWYgKGlzQWxsQ29tcGxldGUpIHJldHVybiBudWxsXG5cbiAgICBpZiAoIXJlc3VtYWJsZVVwbG9hZHMpIHtcbiAgICAgIHJldHVybiB1cHB5LmNhbmNlbEFsbCgpXG4gICAgfVxuXG4gICAgaWYgKGlzQWxsUGF1c2VkKSB7XG4gICAgICByZXR1cm4gdXBweS5yZXN1bWVBbGwoKVxuICAgIH1cblxuICAgIHJldHVybiB1cHB5LnBhdXNlQWxsKClcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdGl0bGU9e3RpdGxlfVxuICAgICAgYXJpYS1sYWJlbD17dGl0bGV9XG4gICAgICBjbGFzc05hbWU9XCJ1cHB5LXUtcmVzZXQgdXBweS1TdGF0dXNCYXItYWN0aW9uQ2lyY2xlQnRuXCJcbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgb25DbGljaz17dG9nZ2xlUGF1c2VSZXN1bWV9XG4gICAgICBkYXRhLXVwcHktc3VwZXItZm9jdXNhYmxlXG4gICAgPlxuICAgICAgPHN2Z1xuICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gICAgICAgIGNsYXNzTmFtZT1cInVwcHktYy1pY29uXCJcbiAgICAgICAgd2lkdGg9XCIxNlwiXG4gICAgICAgIGhlaWdodD1cIjE2XCJcbiAgICAgICAgdmlld0JveD1cIjAgMCAxNiAxNlwiXG4gICAgICA+XG4gICAgICAgIDxnIGZpbGw9XCJub25lXCIgZmlsbFJ1bGU9XCJldmVub2RkXCI+XG4gICAgICAgICAgPGNpcmNsZSBmaWxsPVwiIzg4OFwiIGN4PVwiOFwiIGN5PVwiOFwiIHI9XCI4XCIgLz5cbiAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZmlsbD1cIiNGRkZcIlxuICAgICAgICAgICAgZD17XG4gICAgICAgICAgICAgIGlzQWxsUGF1c2VkXG4gICAgICAgICAgICAgICAgPyAnTTYgNC4yNUwxMS41IDggNiAxMS43NXonXG4gICAgICAgICAgICAgICAgOiAnTTUgNC41aDJ2N0g1di03em00IDBoMnY3SDl2LTd6J1xuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmZ1bmN0aW9uIERvbmVCdG4gKHByb3BzKSB7XG4gIGNvbnN0IHsgaTE4biwgZG9uZUJ1dHRvbkhhbmRsZXIgfSA9IHByb3BzXG5cbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIGNsYXNzTmFtZT1cInVwcHktdS1yZXNldCB1cHB5LWMtYnRuIHVwcHktU3RhdHVzQmFyLWFjdGlvbkJ0biB1cHB5LVN0YXR1c0Jhci1hY3Rpb25CdG4tLWRvbmVcIlxuICAgICAgb25DbGljaz17ZG9uZUJ1dHRvbkhhbmRsZXJ9XG4gICAgICBkYXRhLXVwcHktc3VwZXItZm9jdXNhYmxlXG4gICAgPlxuICAgICAge2kxOG4oJ2RvbmUnKX1cbiAgICA8L2J1dHRvbj5cbiAgKVxufVxuXG5mdW5jdGlvbiBMb2FkaW5nU3Bpbm5lciAoKSB7XG4gIHJldHVybiAoXG4gICAgPHN2Z1xuICAgICAgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItc3Bpbm5lclwiXG4gICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgZm9jdXNhYmxlPVwiZmFsc2VcIlxuICAgICAgd2lkdGg9XCIxNFwiXG4gICAgICBoZWlnaHQ9XCIxNFwiXG4gICAgPlxuICAgICAgPHBhdGhcbiAgICAgICAgZD1cIk0xMy45ODMgNi41NDdjLS4xMi0yLjUwOS0xLjY0LTQuODkzLTMuOTM5LTUuOTM2LTIuNDgtMS4xMjctNS40ODgtLjY1Ni03LjU1NiAxLjA5NEMuNTI0IDMuMzY3LS4zOTggNi4wNDguMTYyIDguNTYyYy41NTYgMi40OTUgMi40NiA0LjUyIDQuOTQgNS4xODMgMi45MzIuNzg0IDUuNjEtLjYwMiA3LjI1Ni0zLjAxNS0xLjQ5MyAxLjk5My0zLjc0NSAzLjMwOS02LjI5OCAyLjg2OC0yLjUxNC0uNDM0LTQuNTc4LTIuMzQ5LTUuMTUzLTQuODRhNi4yMjYgNi4yMjYgMCAwIDEgMi45OC02Ljc3OEM2LjM0LjU4NiA5Ljc0IDEuMSAxMS4zNzMgMy40OTNjLjQwNy41OTYuNjkzIDEuMjgyLjg0MiAxLjk4OC4xMjcuNTk4LjA3MyAxLjE5Ny4xNjEgMS43OTQuMDc4LjUyNS41NDMgMS4yNTcgMS4xNS44NjQuNTI1LS4zNDEuNDktMS4wNS40NTYtMS41OTItLjAwNy0uMTUuMDIuMyAwIDBcIlxuICAgICAgICBmaWxsUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgLz5cbiAgICA8L3N2Zz5cbiAgKVxufVxuXG5mdW5jdGlvbiBQcm9ncmVzc0JhclByb2Nlc3NpbmcgKHByb3BzKSB7XG4gIGNvbnN0IHsgcHJvZ3Jlc3MgfSA9IHByb3BzXG4gIGNvbnN0IHsgdmFsdWUsIG1vZGUsIG1lc3NhZ2UgfSA9IHByb2dyZXNzXG4gIGNvbnN0IHJvdW5kZWRWYWx1ZSA9IE1hdGgucm91bmQodmFsdWUgKiAxMDApXG4gIGNvbnN0IGRvdCA9IGBcXHUwMEI3YFxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1jb250ZW50XCI+XG4gICAgICA8TG9hZGluZ1NwaW5uZXIgLz5cbiAgICAgIHttb2RlID09PSAnZGV0ZXJtaW5hdGUnID8gYCR7cm91bmRlZFZhbHVlfSUgJHtkb3R9IGAgOiAnJ31cbiAgICAgIHttZXNzYWdlfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIFByb2dyZXNzRGV0YWlscyAocHJvcHMpIHtcbiAgY29uc3Qge1xuICAgIG51bVVwbG9hZHMsXG4gICAgY29tcGxldGUsXG4gICAgdG90YWxVcGxvYWRlZFNpemUsXG4gICAgdG90YWxTaXplLFxuICAgIHRvdGFsRVRBLFxuICAgIGkxOG4sXG4gIH0gPSBwcm9wc1xuXG4gIGNvbnN0IGlmU2hvd0ZpbGVzVXBsb2FkZWRPZlRvdGFsID0gbnVtVXBsb2FkcyA+IDFcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItc3RhdHVzU2Vjb25kYXJ5XCI+XG4gICAgICB7aWZTaG93RmlsZXNVcGxvYWRlZE9mVG90YWxcbiAgICAgICAgJiYgaTE4bignZmlsZXNVcGxvYWRlZE9mVG90YWwnLCB7XG4gICAgICAgICAgY29tcGxldGUsXG4gICAgICAgICAgc21hcnRfY291bnQ6IG51bVVwbG9hZHMsXG4gICAgICAgIH0pfVxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItYWRkaXRpb25hbEluZm9cIj5cbiAgICAgICAgey8qIFdoZW4gc2hvdWxkIHdlIHJlbmRlciB0aGlzIGRvdD9cbiAgICAgICAgICAxLiAuLWFkZGl0aW9uYWxJbmZvIGlzIHNob3duIChoYXBwZW5zIG9ubHkgb24gZGVza3RvcHMpXG4gICAgICAgICAgMi4gQU5EICdmaWxlc1VwbG9hZGVkT2ZUb3RhbCcgd2FzIHNob3duXG4gICAgICAgICovfVxuICAgICAgICB7aWZTaG93RmlsZXNVcGxvYWRlZE9mVG90YWwgJiYgcmVuZGVyRG90KCl9XG5cbiAgICAgICAge2kxOG4oJ2RhdGFVcGxvYWRlZE9mVG90YWwnLCB7XG4gICAgICAgICAgY29tcGxldGU6IHByZXR0aWVyQnl0ZXModG90YWxVcGxvYWRlZFNpemUpLFxuICAgICAgICAgIHRvdGFsOiBwcmV0dGllckJ5dGVzKHRvdGFsU2l6ZSksXG4gICAgICAgIH0pfVxuXG4gICAgICAgIHtyZW5kZXJEb3QoKX1cblxuICAgICAgICB7aTE4bigneFRpbWVMZWZ0Jywge1xuICAgICAgICAgIHRpbWU6IHByZXR0eUVUQSh0b3RhbEVUQSksXG4gICAgICAgIH0pfVxuICAgICAgPC9zcGFuPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIFVua25vd25Qcm9ncmVzc0RldGFpbHMgKHByb3BzKSB7XG4gIGNvbnN0IHsgaTE4biwgY29tcGxldGUsIG51bVVwbG9hZHMgfSA9IHByb3BzXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c1NlY29uZGFyeVwiPlxuICAgICAge2kxOG4oJ2ZpbGVzVXBsb2FkZWRPZlRvdGFsJywgeyBjb21wbGV0ZSwgc21hcnRfY291bnQ6IG51bVVwbG9hZHMgfSl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZnVuY3Rpb24gVXBsb2FkTmV3bHlBZGRlZEZpbGVzIChwcm9wcykge1xuICBjb25zdCB7IGkxOG4sIG5ld0ZpbGVzLCBzdGFydFVwbG9hZCB9ID0gcHJvcHNcbiAgY29uc3QgdXBsb2FkQnRuQ2xhc3NOYW1lcyA9IGNsYXNzTmFtZXMoXG4gICAgJ3VwcHktdS1yZXNldCcsXG4gICAgJ3VwcHktYy1idG4nLFxuICAgICd1cHB5LVN0YXR1c0Jhci1hY3Rpb25CdG4nLFxuICAgICd1cHB5LVN0YXR1c0Jhci1hY3Rpb25CdG4tLXVwbG9hZE5ld2x5QWRkZWQnXG4gIClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItc3RhdHVzU2Vjb25kYXJ5XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c1NlY29uZGFyeUhpbnRcIj5cbiAgICAgICAge2kxOG4oJ3hNb3JlRmlsZXNBZGRlZCcsIHsgc21hcnRfY291bnQ6IG5ld0ZpbGVzIH0pfVxuICAgICAgPC9kaXY+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzc05hbWU9e3VwbG9hZEJ0bkNsYXNzTmFtZXN9XG4gICAgICAgIGFyaWEtbGFiZWw9e2kxOG4oJ3VwbG9hZFhGaWxlcycsIHsgc21hcnRfY291bnQ6IG5ld0ZpbGVzIH0pfVxuICAgICAgICBvbkNsaWNrPXtzdGFydFVwbG9hZH1cbiAgICAgID5cbiAgICAgICAge2kxOG4oJ3VwbG9hZCcpfVxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuY29uc3QgVGhyb3R0bGVkUHJvZ3Jlc3NEZXRhaWxzID0gdGhyb3R0bGUoUHJvZ3Jlc3NEZXRhaWxzLCA1MDAsIHtcbiAgbGVhZGluZzogdHJ1ZSxcbiAgdHJhaWxpbmc6IHRydWUsXG59KVxuXG5mdW5jdGlvbiBQcm9ncmVzc0JhclVwbG9hZGluZyAocHJvcHMpIHtcbiAgY29uc3Qge1xuICAgIGkxOG4sXG4gICAgc3VwcG9ydHNVcGxvYWRQcm9ncmVzcyxcbiAgICB0b3RhbFByb2dyZXNzLFxuICAgIHNob3dQcm9ncmVzc0RldGFpbHMsXG4gICAgaXNVcGxvYWRTdGFydGVkLFxuICAgIGlzQWxsQ29tcGxldGUsXG4gICAgaXNBbGxQYXVzZWQsXG4gICAgbmV3RmlsZXMsXG4gICAgbnVtVXBsb2FkcyxcbiAgICBjb21wbGV0ZSxcbiAgICB0b3RhbFVwbG9hZGVkU2l6ZSxcbiAgICB0b3RhbFNpemUsXG4gICAgdG90YWxFVEEsXG4gICAgc3RhcnRVcGxvYWQsXG4gIH0gPSBwcm9wc1xuICBjb25zdCBzaG93VXBsb2FkTmV3bHlBZGRlZEZpbGVzID0gbmV3RmlsZXMgJiYgaXNVcGxvYWRTdGFydGVkXG5cbiAgaWYgKCFpc1VwbG9hZFN0YXJ0ZWQgfHwgaXNBbGxDb21wbGV0ZSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBjb25zdCB0aXRsZSA9IGlzQWxsUGF1c2VkID8gaTE4bigncGF1c2VkJykgOiBpMThuKCd1cGxvYWRpbmcnKVxuXG4gIGZ1bmN0aW9uIHJlbmRlclByb2dyZXNzRGV0YWlscyAoKSB7XG4gICAgaWYgKCFpc0FsbFBhdXNlZCAmJiAhc2hvd1VwbG9hZE5ld2x5QWRkZWRGaWxlcyAmJiBzaG93UHJvZ3Jlc3NEZXRhaWxzKSB7XG4gICAgICBpZiAoc3VwcG9ydHNVcGxvYWRQcm9ncmVzcykge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxUaHJvdHRsZWRQcm9ncmVzc0RldGFpbHNcbiAgICAgICAgICAgIG51bVVwbG9hZHM9e251bVVwbG9hZHN9XG4gICAgICAgICAgICBjb21wbGV0ZT17Y29tcGxldGV9XG4gICAgICAgICAgICB0b3RhbFVwbG9hZGVkU2l6ZT17dG90YWxVcGxvYWRlZFNpemV9XG4gICAgICAgICAgICB0b3RhbFNpemU9e3RvdGFsU2l6ZX1cbiAgICAgICAgICAgIHRvdGFsRVRBPXt0b3RhbEVUQX1cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgLz5cbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFVua25vd25Qcm9ncmVzc0RldGFpbHNcbiAgICAgICAgICBpMThuPXtpMThufVxuICAgICAgICAgIGNvbXBsZXRlPXtjb21wbGV0ZX1cbiAgICAgICAgICBudW1VcGxvYWRzPXtudW1VcGxvYWRzfVxuICAgICAgICAvPlxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLWNvbnRlbnRcIiBhcmlhLWxhYmVsPXt0aXRsZX0gdGl0bGU9e3RpdGxlfT5cbiAgICAgIHshaXNBbGxQYXVzZWQgPyA8TG9hZGluZ1NwaW5uZXIgLz4gOiBudWxsfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNQcmltYXJ5XCI+XG4gICAgICAgICAge3N1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MgPyBgJHt0aXRsZX06ICR7dG90YWxQcm9ncmVzc30lYCA6IHRpdGxlfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7cmVuZGVyUHJvZ3Jlc3NEZXRhaWxzKCl9XG5cbiAgICAgICAge3Nob3dVcGxvYWROZXdseUFkZGVkRmlsZXMgPyAoXG4gICAgICAgICAgPFVwbG9hZE5ld2x5QWRkZWRGaWxlc1xuICAgICAgICAgICAgaTE4bj17aTE4bn1cbiAgICAgICAgICAgIG5ld0ZpbGVzPXtuZXdGaWxlc31cbiAgICAgICAgICAgIHN0YXJ0VXBsb2FkPXtzdGFydFVwbG9hZH1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIFByb2dyZXNzQmFyQ29tcGxldGUgKHByb3BzKSB7XG4gIGNvbnN0IHsgaTE4biB9ID0gcHJvcHNcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLWNvbnRlbnRcIlxuICAgICAgcm9sZT1cInN0YXR1c1wiXG4gICAgICB0aXRsZT17aTE4bignY29tcGxldGUnKX1cbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c1ByaW1hcnlcIj5cbiAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgZm9jdXNhYmxlPVwiZmFsc2VcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItc3RhdHVzSW5kaWNhdG9yIHVwcHktYy1pY29uXCJcbiAgICAgICAgICAgIHdpZHRoPVwiMTVcIlxuICAgICAgICAgICAgaGVpZ2h0PVwiMTFcIlxuICAgICAgICAgICAgdmlld0JveD1cIjAgMCAxNSAxMVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0uNDE0IDUuODQzTDEuNjI3IDQuNjNsMy40NzIgMy40NzJMMTMuMjAyIDBsMS4yMTIgMS4yMTNMNS4xIDEwLjUyOHpcIiAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgIHtpMThuKCdjb21wbGV0ZScpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmZ1bmN0aW9uIFByb2dyZXNzQmFyRXJyb3IgKHByb3BzKSB7XG4gIGNvbnN0IHsgZXJyb3IsIGkxOG4gfSA9IHByb3BzXG5cbiAgZnVuY3Rpb24gZGlzcGxheUVycm9yQWxlcnQgKCkge1xuICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGAke2kxOG4oJ3VwbG9hZEZhaWxlZCcpfSBcXG5cXG4gJHtlcnJvcn1gXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWFsZXJ0XG4gICAgYWxlcnQoZXJyb3JNZXNzYWdlKSAvLyBUT0RPOiBtb3ZlIHRvIGN1c3RvbSBhbGVydCBpbXBsZW1lbnRhdGlvblxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1jb250ZW50XCJcbiAgICAgIHJvbGU9XCJhbGVydFwiXG4gICAgICB0aXRsZT17aTE4bigndXBsb2FkRmFpbGVkJyl9XG4gICAgPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNQcmltYXJ5XCI+XG4gICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgIGZvY3VzYWJsZT1cImZhbHNlXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c0luZGljYXRvciB1cHB5LWMtaWNvblwiXG4gICAgICAgICAgICB3aWR0aD1cIjExXCJcbiAgICAgICAgICAgIGhlaWdodD1cIjExXCJcbiAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTEgMTFcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNNC4yNzggNS41TDAgMS4yMjIgMS4yMjIgMCA1LjUgNC4yNzggOS43NzggMCAxMSAxLjIyMiA2LjcyMiA1LjUgMTEgOS43NzggOS43NzggMTEgNS41IDYuNzIyIDEuMjIyIDExIDAgOS43Nzh6XCIgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICB7aTE4bigndXBsb2FkRmFpbGVkJyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLWRldGFpbHNcIlxuICAgICAgICBhcmlhLWxhYmVsPXtlcnJvcn1cbiAgICAgICAgZGF0YS1taWNyb3RpcC1wb3NpdGlvbj1cInRvcC1yaWdodFwiXG4gICAgICAgIGRhdGEtbWljcm90aXAtc2l6ZT1cIm1lZGl1bVwiXG4gICAgICAgIG9uQ2xpY2s9e2Rpc3BsYXlFcnJvckFsZXJ0fVxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgID5cbiAgICAgICAgP1xuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFVwbG9hZEJ0bixcbiAgUmV0cnlCdG4sXG4gIENhbmNlbEJ0bixcbiAgUGF1c2VSZXN1bWVCdXR0b24sXG4gIERvbmVCdG4sXG4gIExvYWRpbmdTcGlubmVyLFxuICBQcm9ncmVzc0RldGFpbHMsXG4gIFByb2dyZXNzQmFyUHJvY2Vzc2luZyxcbiAgUHJvZ3Jlc3NCYXJFcnJvcixcbiAgUHJvZ3Jlc3NCYXJVcGxvYWRpbmcsXG4gIFByb2dyZXNzQmFyQ29tcGxldGUsXG59XG4iLCJjb25zdCB7IGggfSA9IHJlcXVpcmUoJ3ByZWFjdCcpXG5jb25zdCBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpXG5jb25zdCBzdGF0dXNCYXJTdGF0ZXMgPSByZXF1aXJlKCcuL1N0YXR1c0JhclN0YXRlcycpXG5jb25zdCBjYWxjdWxhdGVQcm9jZXNzaW5nUHJvZ3Jlc3MgPSByZXF1aXJlKCcuL2NhbGN1bGF0ZVByb2Nlc3NpbmdQcm9ncmVzcycpXG5cbmNvbnN0IHtcbiAgVXBsb2FkQnRuLFxuICBSZXRyeUJ0bixcbiAgQ2FuY2VsQnRuLFxuICBQYXVzZVJlc3VtZUJ1dHRvbixcbiAgRG9uZUJ0bixcbiAgUHJvZ3Jlc3NCYXJQcm9jZXNzaW5nLFxuICBQcm9ncmVzc0JhckVycm9yLFxuICBQcm9ncmVzc0JhclVwbG9hZGluZyxcbiAgUHJvZ3Jlc3NCYXJDb21wbGV0ZSxcbn0gPSByZXF1aXJlKCcuL0NvbXBvbmVudHMnKVxuXG5jb25zdCB7XG4gIFNUQVRFX0VSUk9SLFxuICBTVEFURV9XQUlUSU5HLFxuICBTVEFURV9QUkVQUk9DRVNTSU5HLFxuICBTVEFURV9VUExPQURJTkcsXG4gIFNUQVRFX1BPU1RQUk9DRVNTSU5HLFxuICBTVEFURV9DT01QTEVURSxcbn0gPSBzdGF0dXNCYXJTdGF0ZXNcblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0dXNCYXJcblxuZnVuY3Rpb24gU3RhdHVzQmFyIChwcm9wcykge1xuICBjb25zdCB7XG4gICAgbmV3RmlsZXMsXG4gICAgYWxsb3dOZXdVcGxvYWQsXG4gICAgaXNVcGxvYWRJblByb2dyZXNzLFxuICAgIGlzQWxsUGF1c2VkLFxuICAgIHJlc3VtYWJsZVVwbG9hZHMsXG4gICAgZXJyb3IsXG4gICAgaGlkZVVwbG9hZEJ1dHRvbixcbiAgICBoaWRlUGF1c2VSZXN1bWVCdXR0b24sXG4gICAgaGlkZUNhbmNlbEJ1dHRvbixcbiAgICBoaWRlUmV0cnlCdXR0b24sXG4gICAgcmVjb3ZlcmVkU3RhdGUsXG4gICAgdXBsb2FkU3RhdGUsXG4gICAgdG90YWxQcm9ncmVzcyxcbiAgICBmaWxlcyxcbiAgICBzdXBwb3J0c1VwbG9hZFByb2dyZXNzLFxuICAgIGhpZGVBZnRlckZpbmlzaCxcbiAgICBpc1NvbWVHaG9zdCxcbiAgICBpc1RhcmdldERPTUVsLFxuICAgIGRvbmVCdXR0b25IYW5kbGVyLFxuICAgIGlzVXBsb2FkU3RhcnRlZCxcbiAgICBpMThuLFxuICAgIHN0YXJ0VXBsb2FkLFxuICAgIHVwcHksXG4gICAgaXNBbGxDb21wbGV0ZSxcbiAgICBzaG93UHJvZ3Jlc3NEZXRhaWxzLFxuICAgIG51bVVwbG9hZHMsXG4gICAgY29tcGxldGUsXG4gICAgdG90YWxTaXplLFxuICAgIHRvdGFsRVRBLFxuICAgIHRvdGFsVXBsb2FkZWRTaXplLFxuICB9ID0gcHJvcHNcblxuICBmdW5jdGlvbiBnZXRQcm9ncmVzc1ZhbHVlICgpIHtcbiAgICBzd2l0Y2ggKHVwbG9hZFN0YXRlKSB7XG4gICAgICBjYXNlIFNUQVRFX1BPU1RQUk9DRVNTSU5HOlxuICAgICAgY2FzZSBTVEFURV9QUkVQUk9DRVNTSU5HOiB7XG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gY2FsY3VsYXRlUHJvY2Vzc2luZ1Byb2dyZXNzKGZpbGVzKVxuXG4gICAgICAgIGlmIChwcm9ncmVzcy5tb2RlID09PSAnZGV0ZXJtaW5hdGUnKSB7XG4gICAgICAgICAgcmV0dXJuIHByb2dyZXNzLnZhbHVlICogMTAwXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvdGFsUHJvZ3Jlc3NcbiAgICAgIH1cbiAgICAgIGNhc2UgU1RBVEVfRVJST1I6IHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICAgIGNhc2UgU1RBVEVfVVBMT0FESU5HOiB7XG4gICAgICAgIGlmICghc3VwcG9ydHNVcGxvYWRQcm9ncmVzcykge1xuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvdGFsUHJvZ3Jlc3NcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB0b3RhbFByb2dyZXNzXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SXNJbmRldGVybWluYXRlICgpIHtcbiAgICBzd2l0Y2ggKHVwbG9hZFN0YXRlKSB7XG4gICAgICBjYXNlIFNUQVRFX1BPU1RQUk9DRVNTSU5HOlxuICAgICAgY2FzZSBTVEFURV9QUkVQUk9DRVNTSU5HOiB7XG4gICAgICAgIGNvbnN0IHsgbW9kZSB9ID0gY2FsY3VsYXRlUHJvY2Vzc2luZ1Byb2dyZXNzKGZpbGVzKVxuICAgICAgICByZXR1cm4gbW9kZSA9PT0gJ2luZGV0ZXJtaW5hdGUnXG4gICAgICB9XG4gICAgICBjYXNlIFNUQVRFX1VQTE9BRElORzoge1xuICAgICAgICBpZiAoIXN1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SXNIaWRkZW4gKCkge1xuICAgIGlmIChyZWNvdmVyZWRTdGF0ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgc3dpdGNoICh1cGxvYWRTdGF0ZSkge1xuICAgICAgY2FzZSBTVEFURV9XQUlUSU5HOlxuICAgICAgICByZXR1cm4gaGlkZVVwbG9hZEJ1dHRvbiB8fCBuZXdGaWxlcyA9PT0gMFxuICAgICAgY2FzZSBTVEFURV9DT01QTEVURTpcbiAgICAgICAgcmV0dXJuIGhpZGVBZnRlckZpbmlzaFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgY29uc3QgcHJvZ3Jlc3NWYWx1ZSA9IGdldFByb2dyZXNzVmFsdWUoKVxuXG4gIGNvbnN0IGlzSGlkZGVuID0gZ2V0SXNIaWRkZW4oKVxuXG4gIGNvbnN0IHdpZHRoID0gcHJvZ3Jlc3NWYWx1ZSA/PyAxMDBcblxuICBjb25zdCBzaG93VXBsb2FkQnRuXG4gICAgPSAhZXJyb3JcbiAgICAmJiBuZXdGaWxlc1xuICAgICYmICFpc1VwbG9hZEluUHJvZ3Jlc3NcbiAgICAmJiAhaXNBbGxQYXVzZWRcbiAgICAmJiBhbGxvd05ld1VwbG9hZFxuICAgICYmICFoaWRlVXBsb2FkQnV0dG9uXG5cbiAgY29uc3Qgc2hvd0NhbmNlbEJ0blxuICAgID0gIWhpZGVDYW5jZWxCdXR0b25cbiAgICAmJiB1cGxvYWRTdGF0ZSAhPT0gU1RBVEVfV0FJVElOR1xuICAgICYmIHVwbG9hZFN0YXRlICE9PSBTVEFURV9DT01QTEVURVxuXG4gIGNvbnN0IHNob3dQYXVzZVJlc3VtZUJ0blxuICAgID0gcmVzdW1hYmxlVXBsb2Fkc1xuICAgICYmICFoaWRlUGF1c2VSZXN1bWVCdXR0b25cbiAgICAmJiB1cGxvYWRTdGF0ZSA9PT0gU1RBVEVfVVBMT0FESU5HXG5cbiAgY29uc3Qgc2hvd1JldHJ5QnRuID0gZXJyb3IgJiYgIWhpZGVSZXRyeUJ1dHRvblxuXG4gIGNvbnN0IHNob3dEb25lQnRuID0gZG9uZUJ1dHRvbkhhbmRsZXIgJiYgdXBsb2FkU3RhdGUgPT09IFNUQVRFX0NPTVBMRVRFXG5cbiAgY29uc3QgcHJvZ3Jlc3NDbGFzc05hbWVzID0gY2xhc3NOYW1lcygndXBweS1TdGF0dXNCYXItcHJvZ3Jlc3MnLCB7XG4gICAgJ2lzLWluZGV0ZXJtaW5hdGUnOiBnZXRJc0luZGV0ZXJtaW5hdGUoKSxcbiAgfSlcblxuICBjb25zdCBzdGF0dXNCYXJDbGFzc05hbWVzID0gY2xhc3NOYW1lcyhcbiAgICB7ICd1cHB5LVJvb3QnOiBpc1RhcmdldERPTUVsIH0sXG4gICAgJ3VwcHktU3RhdHVzQmFyJyxcbiAgICBgaXMtJHt1cGxvYWRTdGF0ZX1gLFxuICAgIHsgJ2hhcy1naG9zdHMnOiBpc1NvbWVHaG9zdCB9XG4gIClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtzdGF0dXNCYXJDbGFzc05hbWVzfSBhcmlhLWhpZGRlbj17aXNIaWRkZW59PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e3Byb2dyZXNzQ2xhc3NOYW1lc31cbiAgICAgICAgc3R5bGU9e3sgd2lkdGg6IGAke3dpZHRofSVgIH19XG4gICAgICAgIHJvbGU9XCJwcm9ncmVzc2JhclwiXG4gICAgICAgIGFyaWEtbGFiZWw9e2Ake3dpZHRofSVgfVxuICAgICAgICBhcmlhLXZhbHVldGV4dD17YCR7d2lkdGh9JWB9XG4gICAgICAgIGFyaWEtdmFsdWVtaW49XCIwXCJcbiAgICAgICAgYXJpYS12YWx1ZW1heD1cIjEwMFwiXG4gICAgICAgIGFyaWEtdmFsdWVub3c9e3Byb2dyZXNzVmFsdWV9XG4gICAgICAvPlxuXG4gICAgICB7KCgpID0+IHtcbiAgICAgICAgc3dpdGNoICh1cGxvYWRTdGF0ZSkge1xuICAgICAgICAgIGNhc2UgU1RBVEVfUFJFUFJPQ0VTU0lORzpcbiAgICAgICAgICBjYXNlIFNUQVRFX1BPU1RQUk9DRVNTSU5HOlxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPFByb2dyZXNzQmFyUHJvY2Vzc2luZ1xuICAgICAgICAgICAgICAgIHByb2dyZXNzPXtjYWxjdWxhdGVQcm9jZXNzaW5nUHJvZ3Jlc3MoZmlsZXMpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKVxuICAgICAgICAgIGNhc2UgU1RBVEVfQ09NUExFVEU6XG4gICAgICAgICAgICByZXR1cm4gPFByb2dyZXNzQmFyQ29tcGxldGUgaTE4bj17aTE4bn0gLz5cbiAgICAgICAgICBjYXNlIFNUQVRFX0VSUk9SOlxuICAgICAgICAgICAgcmV0dXJuIDxQcm9ncmVzc0JhckVycm9yIGVycm9yPXtlcnJvcn0gaTE4bj17aTE4bn0gLz5cbiAgICAgICAgICBjYXNlIFNUQVRFX1VQTE9BRElORzpcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxQcm9ncmVzc0JhclVwbG9hZGluZ1xuICAgICAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICAgICAgc3VwcG9ydHNVcGxvYWRQcm9ncmVzcz17c3VwcG9ydHNVcGxvYWRQcm9ncmVzc31cbiAgICAgICAgICAgICAgICB0b3RhbFByb2dyZXNzPXt0b3RhbFByb2dyZXNzfVxuICAgICAgICAgICAgICAgIHNob3dQcm9ncmVzc0RldGFpbHM9e3Nob3dQcm9ncmVzc0RldGFpbHN9XG4gICAgICAgICAgICAgICAgaXNVcGxvYWRTdGFydGVkPXtpc1VwbG9hZFN0YXJ0ZWR9XG4gICAgICAgICAgICAgICAgaXNBbGxDb21wbGV0ZT17aXNBbGxDb21wbGV0ZX1cbiAgICAgICAgICAgICAgICBpc0FsbFBhdXNlZD17aXNBbGxQYXVzZWR9XG4gICAgICAgICAgICAgICAgbmV3RmlsZXM9e25ld0ZpbGVzfVxuICAgICAgICAgICAgICAgIG51bVVwbG9hZHM9e251bVVwbG9hZHN9XG4gICAgICAgICAgICAgICAgY29tcGxldGU9e2NvbXBsZXRlfVxuICAgICAgICAgICAgICAgIHRvdGFsVXBsb2FkZWRTaXplPXt0b3RhbFVwbG9hZGVkU2l6ZX1cbiAgICAgICAgICAgICAgICB0b3RhbFNpemU9e3RvdGFsU2l6ZX1cbiAgICAgICAgICAgICAgICB0b3RhbEVUQT17dG90YWxFVEF9XG4gICAgICAgICAgICAgICAgc3RhcnRVcGxvYWQ9e3N0YXJ0VXBsb2FkfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKVxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgICB9KSgpfVxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLWFjdGlvbnNcIj5cbiAgICAgICAgeyhyZWNvdmVyZWRTdGF0ZSB8fCBzaG93VXBsb2FkQnRuKSA/IChcbiAgICAgICAgICA8VXBsb2FkQnRuXG4gICAgICAgICAgICBuZXdGaWxlcz17bmV3RmlsZXN9XG4gICAgICAgICAgICBpc1VwbG9hZFN0YXJ0ZWQ9e2lzVXBsb2FkU3RhcnRlZH1cbiAgICAgICAgICAgIHJlY292ZXJlZFN0YXRlPXtyZWNvdmVyZWRTdGF0ZX1cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBpc1NvbWVHaG9zdD17aXNTb21lR2hvc3R9XG4gICAgICAgICAgICBzdGFydFVwbG9hZD17c3RhcnRVcGxvYWR9XG4gICAgICAgICAgICB1cGxvYWRTdGF0ZT17dXBsb2FkU3RhdGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAge3Nob3dSZXRyeUJ0biA/IDxSZXRyeUJ0biBpMThuPXtpMThufSB1cHB5PXt1cHB5fSAvPiA6IG51bGx9XG5cbiAgICAgICAge3Nob3dQYXVzZVJlc3VtZUJ0biA/IChcbiAgICAgICAgICA8UGF1c2VSZXN1bWVCdXR0b25cbiAgICAgICAgICAgIGlzQWxsUGF1c2VkPXtpc0FsbFBhdXNlZH1cbiAgICAgICAgICAgIGkxOG49e2kxOG59XG4gICAgICAgICAgICBpc0FsbENvbXBsZXRlPXtpc0FsbENvbXBsZXRlfVxuICAgICAgICAgICAgcmVzdW1hYmxlVXBsb2Fkcz17cmVzdW1hYmxlVXBsb2Fkc31cbiAgICAgICAgICAgIHVwcHk9e3VwcHl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAge3Nob3dDYW5jZWxCdG4gPyA8Q2FuY2VsQnRuIGkxOG49e2kxOG59IHVwcHk9e3VwcHl9IC8+IDogbnVsbH1cblxuICAgICAgICB7c2hvd0RvbmVCdG4gPyAoXG4gICAgICAgICAgPERvbmVCdG4gaTE4bj17aTE4bn0gZG9uZUJ1dHRvbkhhbmRsZXI9e2RvbmVCdXR0b25IYW5kbGVyfSAvPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgU1RBVEVfRVJST1I6ICdlcnJvcicsXG4gIFNUQVRFX1dBSVRJTkc6ICd3YWl0aW5nJyxcbiAgU1RBVEVfUFJFUFJPQ0VTU0lORzogJ3ByZXByb2Nlc3NpbmcnLFxuICBTVEFURV9VUExPQURJTkc6ICd1cGxvYWRpbmcnLFxuICBTVEFURV9QT1NUUFJPQ0VTU0lORzogJ3Bvc3Rwcm9jZXNzaW5nJyxcbiAgU1RBVEVfQ09NUExFVEU6ICdjb21wbGV0ZScsXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbGN1bGF0ZVByb2Nlc3NpbmdQcm9ncmVzcyAoZmlsZXMpIHtcbiAgY29uc3QgdmFsdWVzID0gW11cbiAgbGV0IG1vZGVcbiAgbGV0IG1lc3NhZ2VcblxuICBmb3IgKGNvbnN0IHsgcHJvZ3Jlc3MgfSBvZiBPYmplY3QudmFsdWVzKGZpbGVzKSkge1xuICAgIGNvbnN0IHsgcHJlcHJvY2VzcywgcG9zdHByb2Nlc3MgfSA9IHByb2dyZXNzXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSB3ZSBzaG91bGQgcHJvYmFibHkgZG8gdGhpcyBkaWZmZXJlbnRseS4gRm9yIG5vdyB3ZSdsbCB0YWtlIHRoZVxuICAgIC8vIG1vZGUgYW5kIG1lc3NhZ2UgZnJvbSB0aGUgZmlyc3QgZmlsZeKAplxuICAgIGlmIChtZXNzYWdlID09IG51bGwgJiYgKHByZXByb2Nlc3MgfHwgcG9zdHByb2Nlc3MpKSB7XG4gICAgICAoeyBtb2RlLCBtZXNzYWdlIH0gPSBwcmVwcm9jZXNzIHx8IHBvc3Rwcm9jZXNzKVxuICAgIH1cbiAgICBpZiAocHJlcHJvY2Vzcz8ubW9kZSA9PT0gJ2RldGVybWluYXRlJykgdmFsdWVzLnB1c2gocHJlcHJvY2Vzcy52YWx1ZSlcbiAgICBpZiAocG9zdHByb2Nlc3M/Lm1vZGUgPT09ICdkZXRlcm1pbmF0ZScpIHZhbHVlcy5wdXNoKHBvc3Rwcm9jZXNzLnZhbHVlKVxuICB9XG5cbiAgY29uc3QgdmFsdWUgPSB2YWx1ZXMucmVkdWNlKCh0b3RhbCwgcHJvZ3Jlc3NWYWx1ZSkgPT4ge1xuICAgIHJldHVybiB0b3RhbCArIHByb2dyZXNzVmFsdWUgLyB2YWx1ZXMubGVuZ3RoXG4gIH0sIDApXG5cbiAgcmV0dXJuIHtcbiAgICBtb2RlLFxuICAgIG1lc3NhZ2UsXG4gICAgdmFsdWUsXG4gIH1cbn1cbiIsImNvbnN0IHsgVUlQbHVnaW4gfSA9IHJlcXVpcmUoJ0B1cHB5L2NvcmUnKVxuY29uc3QgZ2V0U3BlZWQgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0U3BlZWQnKVxuY29uc3QgZ2V0Qnl0ZXNSZW1haW5pbmcgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0Qnl0ZXNSZW1haW5pbmcnKVxuY29uc3QgZ2V0VGV4dERpcmVjdGlvbiA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRUZXh0RGlyZWN0aW9uJylcbmNvbnN0IHN0YXR1c0JhclN0YXRlcyA9IHJlcXVpcmUoJy4vU3RhdHVzQmFyU3RhdGVzJylcbmNvbnN0IFN0YXR1c0JhclVJID0gcmVxdWlyZSgnLi9TdGF0dXNCYXInKVxuXG4vKipcbiAqIFN0YXR1c0JhcjogcmVuZGVycyBhIHN0YXR1cyBiYXIgd2l0aCB1cGxvYWQvcGF1c2UvcmVzdW1lL2NhbmNlbC9yZXRyeSBidXR0b25zLFxuICogcHJvZ3Jlc3MgcGVyY2VudGFnZSBhbmQgdGltZSByZW1haW5pbmcuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU3RhdHVzQmFyIGV4dGVuZHMgVUlQbHVnaW4ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgc3RhdGljIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uO1xuXG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzKSB7XG4gICAgc3VwZXIodXBweSwgb3B0cylcbiAgICB0aGlzLmlkID0gdGhpcy5vcHRzLmlkIHx8ICdTdGF0dXNCYXInXG4gICAgdGhpcy50aXRsZSA9ICdTdGF0dXNCYXInXG4gICAgdGhpcy50eXBlID0gJ3Byb2dyZXNzaW5kaWNhdG9yJ1xuXG4gICAgdGhpcy5kZWZhdWx0TG9jYWxlID0ge1xuICAgICAgc3RyaW5nczoge1xuICAgICAgICB1cGxvYWRpbmc6ICdVcGxvYWRpbmcnLFxuICAgICAgICB1cGxvYWQ6ICdVcGxvYWQnLFxuICAgICAgICBjb21wbGV0ZTogJ0NvbXBsZXRlJyxcbiAgICAgICAgdXBsb2FkRmFpbGVkOiAnVXBsb2FkIGZhaWxlZCcsXG4gICAgICAgIHBhdXNlZDogJ1BhdXNlZCcsXG4gICAgICAgIHJldHJ5OiAnUmV0cnknLFxuICAgICAgICByZXRyeVVwbG9hZDogJ1JldHJ5IHVwbG9hZCcsXG4gICAgICAgIGNhbmNlbDogJ0NhbmNlbCcsXG4gICAgICAgIHBhdXNlOiAnUGF1c2UnLFxuICAgICAgICByZXN1bWU6ICdSZXN1bWUnLFxuICAgICAgICBkb25lOiAnRG9uZScsXG4gICAgICAgIGZpbGVzVXBsb2FkZWRPZlRvdGFsOiB7XG4gICAgICAgICAgMDogJyV7Y29tcGxldGV9IG9mICV7c21hcnRfY291bnR9IGZpbGUgdXBsb2FkZWQnLFxuICAgICAgICAgIDE6ICcle2NvbXBsZXRlfSBvZiAle3NtYXJ0X2NvdW50fSBmaWxlcyB1cGxvYWRlZCcsXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGFVcGxvYWRlZE9mVG90YWw6ICcle2NvbXBsZXRlfSBvZiAle3RvdGFsfScsXG4gICAgICAgIHhUaW1lTGVmdDogJyV7dGltZX0gbGVmdCcsXG4gICAgICAgIHVwbG9hZFhGaWxlczoge1xuICAgICAgICAgIDA6ICdVcGxvYWQgJXtzbWFydF9jb3VudH0gZmlsZScsXG4gICAgICAgICAgMTogJ1VwbG9hZCAle3NtYXJ0X2NvdW50fSBmaWxlcycsXG4gICAgICAgIH0sXG4gICAgICAgIHVwbG9hZFhOZXdGaWxlczoge1xuICAgICAgICAgIDA6ICdVcGxvYWQgKyV7c21hcnRfY291bnR9IGZpbGUnLFxuICAgICAgICAgIDE6ICdVcGxvYWQgKyV7c21hcnRfY291bnR9IGZpbGVzJyxcbiAgICAgICAgfSxcbiAgICAgICAgeE1vcmVGaWxlc0FkZGVkOiB7XG4gICAgICAgICAgMDogJyV7c21hcnRfY291bnR9IG1vcmUgZmlsZSBhZGRlZCcsXG4gICAgICAgICAgMTogJyV7c21hcnRfY291bnR9IG1vcmUgZmlsZXMgYWRkZWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9XG5cbiAgICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICAgIGhpZGVVcGxvYWRCdXR0b246IGZhbHNlLFxuICAgICAgaGlkZVJldHJ5QnV0dG9uOiBmYWxzZSxcbiAgICAgIGhpZGVQYXVzZVJlc3VtZUJ1dHRvbjogZmFsc2UsXG4gICAgICBoaWRlQ2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgIHNob3dQcm9ncmVzc0RldGFpbHM6IGZhbHNlLFxuICAgICAgaGlkZUFmdGVyRmluaXNoOiB0cnVlLFxuICAgICAgZG9uZUJ1dHRvbkhhbmRsZXI6IG51bGwsXG4gICAgfVxuXG4gICAgdGhpcy5vcHRzID0geyAuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0cyB9XG5cbiAgICB0aGlzLmkxOG5Jbml0KClcblxuICAgIHRoaXMucmVuZGVyID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKVxuICAgIHRoaXMuaW5zdGFsbCA9IHRoaXMuaW5zdGFsbC5iaW5kKHRoaXMpXG4gIH1cblxuICBzdGFydFVwbG9hZCA9ICgpID0+IHtcbiAgICBjb25zdCB7IHJlY292ZXJlZFN0YXRlIH0gPSB0aGlzLnVwcHkuZ2V0U3RhdGUoKVxuXG4gICAgaWYgKHJlY292ZXJlZFN0YXRlKSB7XG4gICAgICB0aGlzLnVwcHkuZW1pdCgncmVzdG9yZS1jb25maXJtZWQnKVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnVwcHkudXBsb2FkKCkuY2F0Y2goKCkgPT4ge1xuICAgICAgLy8gRXJyb3IgbG9nZ2VkIGluIENvcmVcbiAgICB9KVxuICB9O1xuXG4gIHJlbmRlciAoc3RhdGUpIHtcbiAgICBjb25zdCB7XG4gICAgICBjYXBhYmlsaXRpZXMsXG4gICAgICBmaWxlcyxcbiAgICAgIGFsbG93TmV3VXBsb2FkLFxuICAgICAgdG90YWxQcm9ncmVzcyxcbiAgICAgIGVycm9yLFxuICAgICAgcmVjb3ZlcmVkU3RhdGUsXG4gICAgfSA9IHN0YXRlXG5cbiAgICBjb25zdCB7XG4gICAgICBuZXdGaWxlcyxcbiAgICAgIHN0YXJ0ZWRGaWxlcyxcbiAgICAgIGNvbXBsZXRlRmlsZXMsXG4gICAgICBpblByb2dyZXNzTm90UGF1c2VkRmlsZXMsXG5cbiAgICAgIGlzVXBsb2FkU3RhcnRlZCxcbiAgICAgIGlzQWxsQ29tcGxldGUsXG4gICAgICBpc0FsbEVycm9yZWQsXG4gICAgICBpc0FsbFBhdXNlZCxcbiAgICAgIGlzVXBsb2FkSW5Qcm9ncmVzcyxcbiAgICAgIGlzU29tZUdob3N0LFxuICAgIH0gPSB0aGlzLnVwcHkuZ2V0T2JqZWN0T2ZGaWxlc1BlclN0YXRlKClcblxuICAgIC8vIElmIHNvbWUgc3RhdGUgd2FzIHJlY292ZXJlZCwgd2Ugd2FudCB0byBzaG93IFVwbG9hZCBidXR0b24vY291bnRlclxuICAgIC8vIGZvciBhbGwgdGhlIGZpbGVzLCBiZWNhdXNlIGluIHRoaXMgY2FzZSBpdOKAmXMgbm90IGFuIFVwbG9hZCBidXR0b24sXG4gICAgLy8gYnV0IOKAnENvbmZpcm0gUmVzdG9yZSBCdXR0b27igJ1cbiAgICBjb25zdCBuZXdGaWxlc09yUmVjb3ZlcmVkID0gcmVjb3ZlcmVkU3RhdGVcbiAgICAgID8gT2JqZWN0LnZhbHVlcyhmaWxlcylcbiAgICAgIDogbmV3RmlsZXNcbiAgICBjb25zdCB0b3RhbEVUQSA9IGdldFRvdGFsRVRBKGluUHJvZ3Jlc3NOb3RQYXVzZWRGaWxlcylcbiAgICBjb25zdCByZXN1bWFibGVVcGxvYWRzID0gISFjYXBhYmlsaXRpZXMucmVzdW1hYmxlVXBsb2Fkc1xuICAgIGNvbnN0IHN1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MgPSBjYXBhYmlsaXRpZXMudXBsb2FkUHJvZ3Jlc3MgIT09IGZhbHNlXG5cbiAgICBsZXQgdG90YWxTaXplID0gMFxuICAgIGxldCB0b3RhbFVwbG9hZGVkU2l6ZSA9IDBcblxuICAgIHN0YXJ0ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICB0b3RhbFNpemUgKz0gZmlsZS5wcm9ncmVzcy5ieXRlc1RvdGFsIHx8IDBcbiAgICAgIHRvdGFsVXBsb2FkZWRTaXplICs9IGZpbGUucHJvZ3Jlc3MuYnl0ZXNVcGxvYWRlZCB8fCAwXG4gICAgfSlcblxuICAgIHJldHVybiBTdGF0dXNCYXJVSSh7XG4gICAgICBlcnJvcixcbiAgICAgIHVwbG9hZFN0YXRlOiBnZXRVcGxvYWRpbmdTdGF0ZShcbiAgICAgICAgaXNBbGxFcnJvcmVkLFxuICAgICAgICBpc0FsbENvbXBsZXRlLFxuICAgICAgICByZWNvdmVyZWRTdGF0ZSxcbiAgICAgICAgc3RhdGUuZmlsZXMgfHwge31cbiAgICAgICksXG4gICAgICBhbGxvd05ld1VwbG9hZCxcbiAgICAgIHRvdGFsUHJvZ3Jlc3MsXG4gICAgICB0b3RhbFNpemUsXG4gICAgICB0b3RhbFVwbG9hZGVkU2l6ZSxcbiAgICAgIGlzQWxsQ29tcGxldGU6IGZhbHNlLFxuICAgICAgaXNBbGxQYXVzZWQsXG4gICAgICBpc0FsbEVycm9yZWQsXG4gICAgICBpc1VwbG9hZFN0YXJ0ZWQsXG4gICAgICBpc1VwbG9hZEluUHJvZ3Jlc3MsXG4gICAgICBpc1NvbWVHaG9zdCxcbiAgICAgIHJlY292ZXJlZFN0YXRlLFxuICAgICAgY29tcGxldGU6IGNvbXBsZXRlRmlsZXMubGVuZ3RoLFxuICAgICAgbmV3RmlsZXM6IG5ld0ZpbGVzT3JSZWNvdmVyZWQubGVuZ3RoLFxuICAgICAgbnVtVXBsb2Fkczogc3RhcnRlZEZpbGVzLmxlbmd0aCxcbiAgICAgIHRvdGFsRVRBLFxuICAgICAgZmlsZXMsXG4gICAgICBpMThuOiB0aGlzLmkxOG4sXG4gICAgICB1cHB5OiB0aGlzLnVwcHksXG4gICAgICBzdGFydFVwbG9hZDogdGhpcy5zdGFydFVwbG9hZCxcbiAgICAgIGRvbmVCdXR0b25IYW5kbGVyOiB0aGlzLm9wdHMuZG9uZUJ1dHRvbkhhbmRsZXIsXG4gICAgICByZXN1bWFibGVVcGxvYWRzLFxuICAgICAgc3VwcG9ydHNVcGxvYWRQcm9ncmVzcyxcbiAgICAgIHNob3dQcm9ncmVzc0RldGFpbHM6IHRoaXMub3B0cy5zaG93UHJvZ3Jlc3NEZXRhaWxzLFxuICAgICAgaGlkZVVwbG9hZEJ1dHRvbjogdGhpcy5vcHRzLmhpZGVVcGxvYWRCdXR0b24sXG4gICAgICBoaWRlUmV0cnlCdXR0b246IHRoaXMub3B0cy5oaWRlUmV0cnlCdXR0b24sXG4gICAgICBoaWRlUGF1c2VSZXN1bWVCdXR0b246IHRoaXMub3B0cy5oaWRlUGF1c2VSZXN1bWVCdXR0b24sXG4gICAgICBoaWRlQ2FuY2VsQnV0dG9uOiB0aGlzLm9wdHMuaGlkZUNhbmNlbEJ1dHRvbixcbiAgICAgIGhpZGVBZnRlckZpbmlzaDogdGhpcy5vcHRzLmhpZGVBZnRlckZpbmlzaCxcbiAgICAgIGlzVGFyZ2V0RE9NRWw6IHRoaXMuaXNUYXJnZXRET01FbCxcbiAgICB9KVxuICB9XG5cbiAgb25Nb3VudCAoKSB7XG4gICAgLy8gU2V0IHRoZSB0ZXh0IGRpcmVjdGlvbiBpZiB0aGUgcGFnZSBoYXMgbm90IGRlZmluZWQgb25lLlxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsXG4gICAgY29uc3QgZGlyZWN0aW9uID0gZ2V0VGV4dERpcmVjdGlvbihlbGVtZW50KVxuICAgIGlmICghZGlyZWN0aW9uKSB7XG4gICAgICBlbGVtZW50LmRpciA9ICdsdHInXG4gICAgfVxuICB9XG5cbiAgaW5zdGFsbCAoKSB7XG4gICAgY29uc3QgeyB0YXJnZXQgfSA9IHRoaXMub3B0c1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHRoaXMubW91bnQodGFyZ2V0LCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIHVuaW5zdGFsbCAoKSB7XG4gICAgdGhpcy51bm1vdW50KClcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUb3RhbFNwZWVkIChmaWxlcykge1xuICBsZXQgdG90YWxTcGVlZCA9IDBcbiAgZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgIHRvdGFsU3BlZWQgKz0gZ2V0U3BlZWQoZmlsZS5wcm9ncmVzcylcbiAgfSlcbiAgcmV0dXJuIHRvdGFsU3BlZWRcbn1cblxuZnVuY3Rpb24gZ2V0VG90YWxFVEEgKGZpbGVzKSB7XG4gIGNvbnN0IHRvdGFsU3BlZWQgPSBnZXRUb3RhbFNwZWVkKGZpbGVzKVxuICBpZiAodG90YWxTcGVlZCA9PT0gMCkge1xuICAgIHJldHVybiAwXG4gIH1cblxuICBjb25zdCB0b3RhbEJ5dGVzUmVtYWluaW5nID0gZmlsZXMucmVkdWNlKCh0b3RhbCwgZmlsZSkgPT4ge1xuICAgIHJldHVybiB0b3RhbCArIGdldEJ5dGVzUmVtYWluaW5nKGZpbGUucHJvZ3Jlc3MpXG4gIH0sIDApXG5cbiAgcmV0dXJuIE1hdGgucm91bmQoKHRvdGFsQnl0ZXNSZW1haW5pbmcgLyB0b3RhbFNwZWVkKSAqIDEwKSAvIDEwXG59XG5cbmZ1bmN0aW9uIGdldFVwbG9hZGluZ1N0YXRlIChpc0FsbEVycm9yZWQsIGlzQWxsQ29tcGxldGUsIHJlY292ZXJlZFN0YXRlLCBmaWxlcykge1xuICBpZiAoaXNBbGxFcnJvcmVkKSB7XG4gICAgcmV0dXJuIHN0YXR1c0JhclN0YXRlcy5TVEFURV9FUlJPUlxuICB9XG5cbiAgaWYgKGlzQWxsQ29tcGxldGUpIHtcbiAgICByZXR1cm4gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX0NPTVBMRVRFXG4gIH1cblxuICBpZiAocmVjb3ZlcmVkU3RhdGUpIHtcbiAgICByZXR1cm4gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1dBSVRJTkdcbiAgfVxuXG4gIGxldCBzdGF0ZSA9IHN0YXR1c0JhclN0YXRlcy5TVEFURV9XQUlUSU5HXG4gIGNvbnN0IGZpbGVJRHMgPSBPYmplY3Qua2V5cyhmaWxlcylcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlSURzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgeyBwcm9ncmVzcyB9ID0gZmlsZXNbZmlsZUlEc1tpXV1cbiAgICAvLyBJZiBBTlkgZmlsZXMgYXJlIGJlaW5nIHVwbG9hZGVkIHJpZ2h0IG5vdywgc2hvdyB0aGUgdXBsb2FkaW5nIHN0YXRlLlxuICAgIGlmIChwcm9ncmVzcy51cGxvYWRTdGFydGVkICYmICFwcm9ncmVzcy51cGxvYWRDb21wbGV0ZSkge1xuICAgICAgcmV0dXJuIHN0YXR1c0JhclN0YXRlcy5TVEFURV9VUExPQURJTkdcbiAgICB9XG4gICAgLy8gSWYgZmlsZXMgYXJlIGJlaW5nIHByZXByb2Nlc3NlZCBBTkQgcG9zdHByb2Nlc3NlZCBhdCB0aGlzIHRpbWUsIHdlIHNob3cgdGhlXG4gICAgLy8gcHJlcHJvY2VzcyBzdGF0ZS4gSWYgYW55IGZpbGVzIGFyZSBiZWluZyB1cGxvYWRlZCB3ZSBzaG93IHVwbG9hZGluZy5cbiAgICBpZiAocHJvZ3Jlc3MucHJlcHJvY2VzcyAmJiBzdGF0ZSAhPT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1VQTE9BRElORykge1xuICAgICAgc3RhdGUgPSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfUFJFUFJPQ0VTU0lOR1xuICAgIH1cbiAgICAvLyBJZiBOTyBmaWxlcyBhcmUgYmVpbmcgcHJlcHJvY2Vzc2VkIG9yIHVwbG9hZGVkIHJpZ2h0IG5vdywgYnV0IHNvbWUgZmlsZXMgYXJlXG4gICAgLy8gYmVpbmcgcG9zdHByb2Nlc3NlZCwgc2hvdyB0aGUgcG9zdHByb2Nlc3Mgc3RhdGUuXG4gICAgaWYgKFxuICAgICAgcHJvZ3Jlc3MucG9zdHByb2Nlc3NcbiAgICAgICYmIHN0YXRlICE9PSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfVVBMT0FESU5HXG4gICAgICAmJiBzdGF0ZSAhPT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1BSRVBST0NFU1NJTkdcbiAgICApIHtcbiAgICAgIHN0YXRlID0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1BPU1RQUk9DRVNTSU5HXG4gICAgfVxuICB9XG4gIHJldHVybiBzdGF0ZVxufVxuIiwiLyoqXG4gKiBEZWZhdWx0IHN0b3JlIHRoYXQga2VlcHMgc3RhdGUgaW4gYSBzaW1wbGUgb2JqZWN0LlxuICovXG5jbGFzcyBEZWZhdWx0U3RvcmUge1xuICBzdGF0aWMgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb25cblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHt9XG4gICAgdGhpcy5jYWxsYmFja3MgPSBbXVxuICB9XG5cbiAgZ2V0U3RhdGUgKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlXG4gIH1cblxuICBzZXRTdGF0ZSAocGF0Y2gpIHtcbiAgICBjb25zdCBwcmV2U3RhdGUgPSB7IC4uLnRoaXMuc3RhdGUgfVxuICAgIGNvbnN0IG5leHRTdGF0ZSA9IHsgLi4udGhpcy5zdGF0ZSwgLi4ucGF0Y2ggfVxuXG4gICAgdGhpcy5zdGF0ZSA9IG5leHRTdGF0ZVxuICAgIHRoaXMuI3B1Ymxpc2gocHJldlN0YXRlLCBuZXh0U3RhdGUsIHBhdGNoKVxuICB9XG5cbiAgc3Vic2NyaWJlIChsaXN0ZW5lcikge1xuICAgIHRoaXMuY2FsbGJhY2tzLnB1c2gobGlzdGVuZXIpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgbGlzdGVuZXIuXG4gICAgICB0aGlzLmNhbGxiYWNrcy5zcGxpY2UoXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLmluZGV4T2YobGlzdGVuZXIpLFxuICAgICAgICAxXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgI3B1Ymxpc2ggKC4uLmFyZ3MpIHtcbiAgICB0aGlzLmNhbGxiYWNrcy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xuICAgICAgbGlzdGVuZXIoLi4uYXJncylcbiAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmYXVsdFN0b3JlICgpIHtcbiAgcmV0dXJuIG5ldyBEZWZhdWx0U3RvcmUoKVxufVxuIiwiY29uc3QgdHVzID0gcmVxdWlyZSgndHVzLWpzLWNsaWVudCcpXG5cbmZ1bmN0aW9uIGlzQ29yZG92YSAoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiAoXG4gICAgdHlwZW9mIHdpbmRvdy5QaG9uZUdhcCAhPT0gJ3VuZGVmaW5lZCdcbiAgICB8fCB0eXBlb2Ygd2luZG93LkNvcmRvdmEgIT09ICd1bmRlZmluZWQnXG4gICAgfHwgdHlwZW9mIHdpbmRvdy5jb3Jkb3ZhICE9PSAndW5kZWZpbmVkJ1xuICApXG59XG5cbmZ1bmN0aW9uIGlzUmVhY3ROYXRpdmUgKCkge1xuICByZXR1cm4gdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB0eXBlb2YgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdzdHJpbmcnXG4gICAgJiYgbmF2aWdhdG9yLnByb2R1Y3QudG9Mb3dlckNhc2UoKSA9PT0gJ3JlYWN0bmF0aXZlJ1xufVxuXG4vLyBXZSBvdmVycmlkZSB0dXMgZmluZ2VycHJpbnQgdG8gdXBweeKAmXMgYGZpbGUuaWRgLCBzaW5jZSB0aGUgYGZpbGUuaWRgXG4vLyBub3cgYWxzbyBpbmNsdWRlcyBgcmVsYXRpdmVQYXRoYCBmb3IgZmlsZXMgYWRkZWQgZnJvbSBmb2xkZXJzLlxuLy8gVGhpcyBtZWFucyB5b3UgY2FuIGFkZCAyIGlkZW50aWNhbCBmaWxlcywgaWYgb25lIGlzIGluIGZvbGRlciBhLFxuLy8gdGhlIG90aGVyIGluIGZvbGRlciBiIOKAlCBgYS9maWxlLmpwZ2AgYW5kIGBiL2ZpbGUuanBnYCwgd2hlbiBhZGRlZFxuLy8gdG9nZXRoZXIgd2l0aCBhIGZvbGRlciwgd2lsbCBiZSB0cmVhdGVkIGFzIDIgc2VwYXJhdGUgZmlsZXMuXG4vL1xuLy8gRm9yIFJlYWN0IE5hdGl2ZSBhbmQgQ29yZG92YSwgd2UgbGV0IHR1cy1qcy1jbGllbnTigJlzIGRlZmF1bHRcbi8vIGZpbmdlcnByaW50IGhhbmRsaW5nIHRha2UgY2hhcmdlLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRGaW5nZXJwcmludCAodXBweUZpbGVPYmopIHtcbiAgcmV0dXJuIChmaWxlLCBvcHRpb25zKSA9PiB7XG4gICAgaWYgKGlzQ29yZG92YSgpIHx8IGlzUmVhY3ROYXRpdmUoKSkge1xuICAgICAgcmV0dXJuIHR1cy5kZWZhdWx0T3B0aW9ucy5maW5nZXJwcmludChmaWxlLCBvcHRpb25zKVxuICAgIH1cblxuICAgIGNvbnN0IHVwcHlGaW5nZXJwcmludCA9IFtcbiAgICAgICd0dXMnLFxuICAgICAgdXBweUZpbGVPYmouaWQsXG4gICAgICBvcHRpb25zLmVuZHBvaW50LFxuICAgIF0uam9pbignLScpXG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVwcHlGaW5nZXJwcmludClcbiAgfVxufVxuIiwiY29uc3QgQmFzZVBsdWdpbiA9IHJlcXVpcmUoJ0B1cHB5L2NvcmUvbGliL0Jhc2VQbHVnaW4nKVxuY29uc3QgdHVzID0gcmVxdWlyZSgndHVzLWpzLWNsaWVudCcpXG5jb25zdCB7IFByb3ZpZGVyLCBSZXF1ZXN0Q2xpZW50LCBTb2NrZXQgfSA9IHJlcXVpcmUoJ0B1cHB5L2NvbXBhbmlvbi1jbGllbnQnKVxuY29uc3QgZW1pdFNvY2tldFByb2dyZXNzID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2VtaXRTb2NrZXRQcm9ncmVzcycpXG5jb25zdCBnZXRTb2NrZXRIb3N0ID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2dldFNvY2tldEhvc3QnKVxuY29uc3Qgc2V0dGxlID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL3NldHRsZScpXG5jb25zdCBFdmVudFRyYWNrZXIgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvRXZlbnRUcmFja2VyJylcbmNvbnN0IE5ldHdvcmtFcnJvciA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9OZXR3b3JrRXJyb3InKVxuY29uc3QgaXNOZXR3b3JrRXJyb3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvaXNOZXR3b3JrRXJyb3InKVxuY29uc3QgeyBSYXRlTGltaXRlZFF1ZXVlIH0gPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvUmF0ZUxpbWl0ZWRRdWV1ZScpXG5jb25zdCBoYXNQcm9wZXJ0eSA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9oYXNQcm9wZXJ0eScpXG5jb25zdCBnZXRGaW5nZXJwcmludCA9IHJlcXVpcmUoJy4vZ2V0RmluZ2VycHJpbnQnKVxuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4nKS5UdXNPcHRpb25zfSBUdXNPcHRpb25zICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgndHVzLWpzLWNsaWVudCcpLlVwbG9hZE9wdGlvbnN9IFJhd1R1c09wdGlvbnMgKi9cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCdAdXBweS9jb3JlJykuVXBweX0gVXBweSAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJ0B1cHB5L2NvcmUnKS5VcHB5RmlsZX0gVXBweUZpbGUgKi9cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCdAdXBweS9jb3JlJykuRmFpbGVkVXBweUZpbGU8e30+fSBGYWlsZWRVcHB5RmlsZSAqL1xuXG4vKipcbiAqIEV4dHJhY3RlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS90dXMvdHVzLWpzLWNsaWVudC9ibG9iL21hc3Rlci9saWIvdXBsb2FkLmpzI0wxM1xuICogZXhjZXB0ZWQgd2UgcmVtb3ZlZCAnZmluZ2VycHJpbnQnIGtleSB0byBhdm9pZCBhZGRpbmcgbW9yZSBkZXBlbmRlbmNpZXNcbiAqXG4gKiBAdHlwZSB7UmF3VHVzT3B0aW9uc31cbiAqL1xuY29uc3QgdHVzRGVmYXVsdE9wdGlvbnMgPSB7XG4gIGVuZHBvaW50OiAnJyxcblxuICB1cGxvYWRVcmw6IG51bGwsXG4gIG1ldGFkYXRhOiB7fSxcbiAgdXBsb2FkU2l6ZTogbnVsbCxcblxuICBvblByb2dyZXNzOiBudWxsLFxuICBvbkNodW5rQ29tcGxldGU6IG51bGwsXG4gIG9uU3VjY2VzczogbnVsbCxcbiAgb25FcnJvcjogbnVsbCxcblxuICBvdmVycmlkZVBhdGNoTWV0aG9kOiBmYWxzZSxcbiAgaGVhZGVyczoge30sXG4gIGFkZFJlcXVlc3RJZDogZmFsc2UsXG5cbiAgY2h1bmtTaXplOiBJbmZpbml0eSxcbiAgcmV0cnlEZWxheXM6IFswLCAxMDAwLCAzMDAwLCA1MDAwXSxcbiAgcGFyYWxsZWxVcGxvYWRzOiAxLFxuICByZW1vdmVGaW5nZXJwcmludE9uU3VjY2VzczogZmFsc2UsXG4gIHVwbG9hZExlbmd0aERlZmVycmVkOiBmYWxzZSxcbiAgdXBsb2FkRGF0YUR1cmluZ0NyZWF0aW9uOiBmYWxzZSxcbn1cblxuLyoqXG4gKiBUdXMgcmVzdW1hYmxlIGZpbGUgdXBsb2FkZXJcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUdXMgZXh0ZW5kcyBCYXNlUGx1Z2luIHtcbiAgc3RhdGljIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7VXBweX0gdXBweVxuICAgKiBAcGFyYW0ge1R1c09wdGlvbnN9IG9wdHNcbiAgICovXG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzKSB7XG4gICAgc3VwZXIodXBweSwgb3B0cylcbiAgICB0aGlzLnR5cGUgPSAndXBsb2FkZXInXG4gICAgdGhpcy5pZCA9IHRoaXMub3B0cy5pZCB8fCAnVHVzJ1xuICAgIHRoaXMudGl0bGUgPSAnVHVzJ1xuXG4gICAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgdXNlRmFzdFJlbW90ZVJldHJ5OiB0cnVlLFxuICAgICAgbGltaXQ6IDUsXG4gICAgICByZXRyeURlbGF5czogWzAsIDEwMDAsIDMwMDAsIDUwMDBdLFxuICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcbiAgICB9XG5cbiAgICAvLyBtZXJnZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgb25lcyBzZXQgYnkgdXNlclxuICAgIC8qKiBAdHlwZSB7aW1wb3J0KFwiLi5cIikuVHVzT3B0aW9uc30gKi9cbiAgICB0aGlzLm9wdHMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRzIH1cblxuICAgIGlmICgnYXV0b1JldHJ5JyBpbiBvcHRzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBgYXV0b1JldHJ5YCBvcHRpb24gd2FzIGRlcHJlY2F0ZWQgYW5kIGhhcyBiZWVuIHJlbW92ZWQuJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaW11bHRhbmVvdXMgdXBsb2FkIGxpbWl0aW5nIGlzIHNoYXJlZCBhY3Jvc3MgYWxsIHVwbG9hZHMgd2l0aCB0aGlzIHBsdWdpbi5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtSYXRlTGltaXRlZFF1ZXVlfVxuICAgICAqL1xuICAgIHRoaXMucmVxdWVzdHMgPSBuZXcgUmF0ZUxpbWl0ZWRRdWV1ZSh0aGlzLm9wdHMubGltaXQpXG5cbiAgICB0aGlzLnVwbG9hZGVycyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICAgIHRoaXMudXBsb2FkZXJTb2NrZXRzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG4gICAgdGhpcy5oYW5kbGVSZXNldFByb2dyZXNzID0gdGhpcy5oYW5kbGVSZXNldFByb2dyZXNzLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVVwbG9hZCA9IHRoaXMuaGFuZGxlVXBsb2FkLmJpbmQodGhpcylcbiAgfVxuXG4gIGhhbmRsZVJlc2V0UHJvZ3Jlc3MgKCkge1xuICAgIGNvbnN0IGZpbGVzID0geyAuLi50aGlzLnVwcHkuZ2V0U3RhdGUoKS5maWxlcyB9XG4gICAgT2JqZWN0LmtleXMoZmlsZXMpLmZvckVhY2goKGZpbGVJRCkgPT4ge1xuICAgICAgLy8gT25seSBjbG9uZSB0aGUgZmlsZSBvYmplY3QgaWYgaXQgaGFzIGEgVHVzIGB1cGxvYWRVcmxgIGF0dGFjaGVkLlxuICAgICAgaWYgKGZpbGVzW2ZpbGVJRF0udHVzICYmIGZpbGVzW2ZpbGVJRF0udHVzLnVwbG9hZFVybCkge1xuICAgICAgICBjb25zdCB0dXNTdGF0ZSA9IHsgLi4uZmlsZXNbZmlsZUlEXS50dXMgfVxuICAgICAgICBkZWxldGUgdHVzU3RhdGUudXBsb2FkVXJsXG4gICAgICAgIGZpbGVzW2ZpbGVJRF0gPSB7IC4uLmZpbGVzW2ZpbGVJRF0sIHR1czogdHVzU3RhdGUgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnVwcHkuc2V0U3RhdGUoeyBmaWxlcyB9KVxuICB9XG5cbiAgLyoqXG4gICAqIENsZWFuIHVwIGFsbCByZWZlcmVuY2VzIGZvciBhIGZpbGUncyB1cGxvYWQ6IHRoZSB0dXMuVXBsb2FkIGluc3RhbmNlLFxuICAgKiBhbnkgZXZlbnRzIHJlbGF0ZWQgdG8gdGhlIGZpbGUsIGFuZCB0aGUgQ29tcGFuaW9uIFdlYlNvY2tldCBjb25uZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqL1xuICByZXNldFVwbG9hZGVyUmVmZXJlbmNlcyAoZmlsZUlELCBvcHRzID0ge30pIHtcbiAgICBpZiAodGhpcy51cGxvYWRlcnNbZmlsZUlEXSkge1xuICAgICAgY29uc3QgdXBsb2FkZXIgPSB0aGlzLnVwbG9hZGVyc1tmaWxlSURdXG5cbiAgICAgIHVwbG9hZGVyLmFib3J0KClcblxuICAgICAgaWYgKG9wdHMuYWJvcnQpIHtcbiAgICAgICAgdXBsb2FkZXIuYWJvcnQodHJ1ZSlcbiAgICAgIH1cblxuICAgICAgdGhpcy51cGxvYWRlcnNbZmlsZUlEXSA9IG51bGxcbiAgICB9XG4gICAgaWYgKHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXSkge1xuICAgICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdLnJlbW92ZSgpXG4gICAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0gPSBudWxsXG4gICAgfVxuICAgIGlmICh0aGlzLnVwbG9hZGVyU29ja2V0c1tmaWxlSURdKSB7XG4gICAgICB0aGlzLnVwbG9hZGVyU29ja2V0c1tmaWxlSURdLmNsb3NlKClcbiAgICAgIHRoaXMudXBsb2FkZXJTb2NrZXRzW2ZpbGVJRF0gPSBudWxsXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBUdXMgdXBsb2FkLlxuICAgKlxuICAgKiBBIGxvdCBjYW4gaGFwcGVuIGR1cmluZyBhbiB1cGxvYWQsIHNvIHRoaXMgaXMgcXVpdGUgaGFyZCB0byBmb2xsb3chXG4gICAqIC0gRmlyc3QsIHRoZSB1cGxvYWQgaXMgc3RhcnRlZC4gSWYgdGhlIGZpbGUgd2FzIGFscmVhZHkgcGF1c2VkIGJ5IHRoZSB0aW1lIHRoZSB1cGxvYWQgc3RhcnRzLCBub3RoaW5nIHNob3VsZCBoYXBwZW4uXG4gICAqICAgSWYgdGhlIGBsaW1pdGAgb3B0aW9uIGlzIHVzZWQsIHRoZSB1cGxvYWQgbXVzdCBiZSBxdWV1ZWQgb250byB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlLlxuICAgKiAgIFdoZW4gYW4gdXBsb2FkIHN0YXJ0cywgd2Ugc3RvcmUgdGhlIHR1cy5VcGxvYWQgaW5zdGFuY2UsIGFuZCBhbiBFdmVudFRyYWNrZXIgaW5zdGFuY2UgdGhhdCBtYW5hZ2VzIHRoZSBldmVudCBsaXN0ZW5lcnNcbiAgICogICBmb3IgcGF1c2luZywgY2FuY2VsbGF0aW9uLCByZW1vdmFsLCBldGMuXG4gICAqIC0gV2hpbGUgdGhlIHVwbG9hZCBpcyBpbiBwcm9ncmVzcywgaXQgbWF5IGJlIHBhdXNlZCBvciBjYW5jZWxsZWQuXG4gICAqICAgUGF1c2luZyBhYm9ydHMgdGhlIHVuZGVybHlpbmcgdHVzLlVwbG9hZCwgYW5kIHJlbW92ZXMgdGhlIHVwbG9hZCBmcm9tIHRoZSBgdGhpcy5yZXF1ZXN0c2AgcXVldWUuIEFsbCBvdGhlciBzdGF0ZSBpc1xuICAgKiAgIG1haW50YWluZWQuXG4gICAqICAgQ2FuY2VsbGluZyByZW1vdmVzIHRoZSB1cGxvYWQgZnJvbSB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlLCBhbmQgY29tcGxldGVseSBhYm9ydHMgdGhlIHVwbG9hZC0tIHRoZSBgdHVzLlVwbG9hZGBcbiAgICogICBpbnN0YW5jZSBpcyBhYm9ydGVkIGFuZCBkaXNjYXJkZWQsIHRoZSBFdmVudFRyYWNrZXIgaW5zdGFuY2UgaXMgZGVzdHJveWVkIChyZW1vdmluZyBhbGwgbGlzdGVuZXJzKS5cbiAgICogICBSZXN1bWluZyB0aGUgdXBsb2FkIHVzZXMgdGhlIGB0aGlzLnJlcXVlc3RzYCBxdWV1ZSBhcyB3ZWxsLCB0byBwcmV2ZW50IHNlbGVjdGl2ZWx5IHBhdXNpbmcgYW5kIHJlc3VtaW5nIHVwbG9hZHMgZnJvbVxuICAgKiAgIGJ5cGFzc2luZyB0aGUgbGltaXQuXG4gICAqIC0gQWZ0ZXIgY29tcGxldGluZyBhbiB1cGxvYWQsIHRoZSB0dXMuVXBsb2FkIGFuZCBFdmVudFRyYWNrZXIgaW5zdGFuY2VzIGFyZSBjbGVhbmVkIHVwLCBhbmQgdGhlIHVwbG9hZCBpcyBtYXJrZWQgYXMgZG9uZVxuICAgKiAgIGluIHRoZSBgdGhpcy5yZXF1ZXN0c2AgcXVldWUuXG4gICAqIC0gV2hlbiBhbiB1cGxvYWQgY29tcGxldGVkIHdpdGggYW4gZXJyb3IsIHRoZSBzYW1lIGhhcHBlbnMgYXMgb24gc3VjY2Vzc2Z1bCBjb21wbGV0aW9uLCBidXQgdGhlIGB1cGxvYWQoKWAgcHJvbWlzZSBpc1xuICAgKiAgIHJlamVjdGVkLlxuICAgKlxuICAgKiBXaGVuIHdvcmtpbmcgb24gdGhpcyBmdW5jdGlvbiwga2VlcCBpbiBtaW5kOlxuICAgKiAgLSBXaGVuIGFuIHVwbG9hZCBpcyBjb21wbGV0ZWQgb3IgY2FuY2VsbGVkIGZvciBhbnkgcmVhc29uLCB0aGUgdHVzLlVwbG9hZCBhbmQgRXZlbnRUcmFja2VyIGluc3RhbmNlcyBuZWVkIHRvIGJlIGNsZWFuZWRcbiAgICogICAgdXAgdXNpbmcgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcygpLlxuICAgKiAgLSBXaGVuIGFuIHVwbG9hZCBpcyBjYW5jZWxsZWQgb3IgcGF1c2VkLCBmb3IgYW55IHJlYXNvbiwgaXQgbmVlZHMgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZSBgdGhpcy5yZXF1ZXN0c2AgcXVldWUgdXNpbmdcbiAgICogICAgYHF1ZXVlZFJlcXVlc3QuYWJvcnQoKWAuXG4gICAqICAtIFdoZW4gYW4gdXBsb2FkIGlzIGNvbXBsZXRlZCBmb3IgYW55IHJlYXNvbiwgaW5jbHVkaW5nIGVycm9ycywgaXQgbmVlZHMgdG8gYmUgbWFya2VkIGFzIHN1Y2ggdXNpbmdcbiAgICogICAgYHF1ZXVlZFJlcXVlc3QuZG9uZSgpYC5cbiAgICogIC0gV2hlbiBhbiB1cGxvYWQgaXMgc3RhcnRlZCBvciByZXN1bWVkLCBpdCBuZWVkcyB0byBnbyB0aHJvdWdoIHRoZSBgdGhpcy5yZXF1ZXN0c2AgcXVldWUuIFRoZSBgcXVldWVkUmVxdWVzdGAgdmFyaWFibGVcbiAgICogICAgbXVzdCBiZSB1cGRhdGVkIHNvIHRoZSBvdGhlciB1c2VzIG9mIGl0IGFyZSB2YWxpZC5cbiAgICogIC0gQmVmb3JlIHJlcGxhY2luZyB0aGUgYHF1ZXVlZFJlcXVlc3RgIHZhcmlhYmxlLCB0aGUgcHJldmlvdXMgYHF1ZXVlZFJlcXVlc3RgIG11c3QgYmUgYWJvcnRlZCwgZWxzZSBpdCB3aWxsIGtlZXAgdGFraW5nXG4gICAqICAgIHVwIGEgc3BvdCBpbiB0aGUgcXVldWUuXG4gICAqXG4gICAqIEBwYXJhbSB7VXBweUZpbGV9IGZpbGUgZm9yIHVzZSB3aXRoIHVwbG9hZFxuICAgKiBAcGFyYW0ge251bWJlcn0gY3VycmVudCBmaWxlIGluIGEgcXVldWVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsIG51bWJlciBvZiBmaWxlcyBpbiBhIHF1ZXVlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgKi9cbiAgdXBsb2FkIChmaWxlKSB7XG4gICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuXG4gICAgLy8gQ3JlYXRlIGEgbmV3IHR1cyB1cGxvYWRcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdGFydGVkJywgZmlsZSlcblxuICAgICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgICAgLi4udGhpcy5vcHRzLFxuICAgICAgICAuLi4oZmlsZS50dXMgfHwge30pLFxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG9wdHMuaGVhZGVycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBvcHRzLmhlYWRlcnMgPSBvcHRzLmhlYWRlcnMoZmlsZSlcbiAgICAgIH1cblxuICAgICAgLyoqIEB0eXBlIHtSYXdUdXNPcHRpb25zfSAqL1xuICAgICAgY29uc3QgdXBsb2FkT3B0aW9ucyA9IHtcbiAgICAgICAgLi4udHVzRGVmYXVsdE9wdGlvbnMsXG4gICAgICAgIC4uLm9wdHMsXG4gICAgICB9XG5cbiAgICAgIC8vIFdlIG92ZXJyaWRlIHR1cyBmaW5nZXJwcmludCB0byB1cHB54oCZcyBgZmlsZS5pZGAsIHNpbmNlIHRoZSBgZmlsZS5pZGBcbiAgICAgIC8vIG5vdyBhbHNvIGluY2x1ZGVzIGByZWxhdGl2ZVBhdGhgIGZvciBmaWxlcyBhZGRlZCBmcm9tIGZvbGRlcnMuXG4gICAgICAvLyBUaGlzIG1lYW5zIHlvdSBjYW4gYWRkIDIgaWRlbnRpY2FsIGZpbGVzLCBpZiBvbmUgaXMgaW4gZm9sZGVyIGEsXG4gICAgICAvLyB0aGUgb3RoZXIgaW4gZm9sZGVyIGIuXG4gICAgICB1cGxvYWRPcHRpb25zLmZpbmdlcnByaW50ID0gZ2V0RmluZ2VycHJpbnQoZmlsZSlcblxuICAgICAgdXBsb2FkT3B0aW9ucy5vbkJlZm9yZVJlcXVlc3QgPSAocmVxKSA9PiB7XG4gICAgICAgIGNvbnN0IHhociA9IHJlcS5nZXRVbmRlcmx5aW5nT2JqZWN0KClcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9ICEhb3B0cy53aXRoQ3JlZGVudGlhbHNcblxuICAgICAgICBpZiAodHlwZW9mIG9wdHMub25CZWZvcmVSZXF1ZXN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgb3B0cy5vbkJlZm9yZVJlcXVlc3QocmVxKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHVwbG9hZE9wdGlvbnMub25FcnJvciA9IChlcnIpID0+IHtcbiAgICAgICAgdGhpcy51cHB5LmxvZyhlcnIpXG5cbiAgICAgICAgY29uc3QgeGhyID0gZXJyLm9yaWdpbmFsUmVxdWVzdCA/IGVyci5vcmlnaW5hbFJlcXVlc3QuZ2V0VW5kZXJseWluZ09iamVjdCgpIDogbnVsbFxuICAgICAgICBpZiAoaXNOZXR3b3JrRXJyb3IoeGhyKSkge1xuICAgICAgICAgIGVyciA9IG5ldyBOZXR3b3JrRXJyb3IoZXJyLCB4aHIpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQpXG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpXG5cbiAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1lcnJvcicsIGZpbGUsIGVycilcblxuICAgICAgICByZWplY3QoZXJyKVxuICAgICAgfVxuXG4gICAgICB1cGxvYWRPcHRpb25zLm9uUHJvZ3Jlc3MgPSAoYnl0ZXNVcGxvYWRlZCwgYnl0ZXNUb3RhbCkgPT4ge1xuICAgICAgICB0aGlzLm9uUmVjZWl2ZVVwbG9hZFVybChmaWxlLCB1cGxvYWQudXJsKVxuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXByb2dyZXNzJywgZmlsZSwge1xuICAgICAgICAgIHVwbG9hZGVyOiB0aGlzLFxuICAgICAgICAgIGJ5dGVzVXBsb2FkZWQsXG4gICAgICAgICAgYnl0ZXNUb3RhbCxcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdXBsb2FkT3B0aW9ucy5vblN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHVwbG9hZFJlc3AgPSB7XG4gICAgICAgICAgdXBsb2FkVVJMOiB1cGxvYWQudXJsLFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmRvbmUoKVxuXG4gICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtc3VjY2VzcycsIGZpbGUsIHVwbG9hZFJlc3ApXG5cbiAgICAgICAgaWYgKHVwbG9hZC51cmwpIHtcbiAgICAgICAgICB0aGlzLnVwcHkubG9nKGBEb3dubG9hZCAke3VwbG9hZC5maWxlLm5hbWV9IGZyb20gJHt1cGxvYWQudXJsfWApXG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKHVwbG9hZClcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29weVByb3AgPSAob2JqLCBzcmNQcm9wLCBkZXN0UHJvcCkgPT4ge1xuICAgICAgICBpZiAoaGFzUHJvcGVydHkob2JqLCBzcmNQcm9wKSAmJiAhaGFzUHJvcGVydHkob2JqLCBkZXN0UHJvcCkpIHtcbiAgICAgICAgICBvYmpbZGVzdFByb3BdID0gb2JqW3NyY1Byb3BdXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fSAqL1xuICAgICAgY29uc3QgbWV0YSA9IHt9XG4gICAgICBjb25zdCBtZXRhRmllbGRzID0gQXJyYXkuaXNBcnJheShvcHRzLm1ldGFGaWVsZHMpXG4gICAgICAgID8gb3B0cy5tZXRhRmllbGRzXG4gICAgICAgIC8vIFNlbmQgYWxvbmcgYWxsIGZpZWxkcyBieSBkZWZhdWx0LlxuICAgICAgICA6IE9iamVjdC5rZXlzKGZpbGUubWV0YSlcbiAgICAgIG1ldGFGaWVsZHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBtZXRhW2l0ZW1dID0gZmlsZS5tZXRhW2l0ZW1dXG4gICAgICB9KVxuXG4gICAgICAvLyB0dXNkIHVzZXMgbWV0YWRhdGEgZmllbGRzICdmaWxldHlwZScgYW5kICdmaWxlbmFtZSdcbiAgICAgIGNvcHlQcm9wKG1ldGEsICd0eXBlJywgJ2ZpbGV0eXBlJylcbiAgICAgIGNvcHlQcm9wKG1ldGEsICduYW1lJywgJ2ZpbGVuYW1lJylcblxuICAgICAgdXBsb2FkT3B0aW9ucy5tZXRhZGF0YSA9IG1ldGFcblxuICAgICAgY29uc3QgdXBsb2FkID0gbmV3IHR1cy5VcGxvYWQoZmlsZS5kYXRhLCB1cGxvYWRPcHRpb25zKVxuICAgICAgdGhpcy51cGxvYWRlcnNbZmlsZS5pZF0gPSB1cGxvYWRcbiAgICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0gPSBuZXcgRXZlbnRUcmFja2VyKHRoaXMudXBweSlcblxuICAgICAgdXBsb2FkLmZpbmRQcmV2aW91c1VwbG9hZHMoKS50aGVuKChwcmV2aW91c1VwbG9hZHMpID0+IHtcbiAgICAgICAgY29uc3QgcHJldmlvdXNVcGxvYWQgPSBwcmV2aW91c1VwbG9hZHNbMF1cbiAgICAgICAgaWYgKHByZXZpb3VzVXBsb2FkKSB7XG4gICAgICAgICAgdGhpcy51cHB5LmxvZyhgW1R1c10gUmVzdW1pbmcgdXBsb2FkIG9mICR7ZmlsZS5pZH0gc3RhcnRlZCBhdCAke3ByZXZpb3VzVXBsb2FkLmNyZWF0aW9uVGltZX1gKVxuICAgICAgICAgIHVwbG9hZC5yZXN1bWVGcm9tUHJldmlvdXNVcGxvYWQocHJldmlvdXNVcGxvYWQpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGxldCBxdWV1ZWRSZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0cy5ydW4oKCkgPT4ge1xuICAgICAgICBpZiAoIWZpbGUuaXNQYXVzZWQpIHtcbiAgICAgICAgICB1cGxvYWQuc3RhcnQoKVxuICAgICAgICB9XG4gICAgICAgIC8vIERvbid0IGRvIGFueXRoaW5nIGhlcmUsIHRoZSBjYWxsZXIgd2lsbCB0YWtlIGNhcmUgb2YgY2FuY2VsbGluZyB0aGUgdXBsb2FkIGl0c2VsZlxuICAgICAgICAvLyB1c2luZyByZXNldFVwbG9hZGVyUmVmZXJlbmNlcygpLiBUaGlzIGlzIGJlY2F1c2UgcmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoKSBoYXMgdG8gYmVcbiAgICAgICAgLy8gY2FsbGVkIHdoZW4gdGhpcyByZXF1ZXN0IGlzIHN0aWxsIGluIHRoZSBxdWV1ZSwgYW5kIGhhcyBub3QgYmVlbiBzdGFydGVkIHlldCwgdG9vLiBBdFxuICAgICAgICAvLyB0aGF0IHBvaW50IHRoaXMgY2FuY2VsbGF0aW9uIGZ1bmN0aW9uIGlzIG5vdCBnb2luZyB0byBiZSBjYWxsZWQuXG4gICAgICAgIC8vIEFsc28sIHdlIG5lZWQgdG8gcmVtb3ZlIHRoZSByZXF1ZXN0IGZyb20gdGhlIHF1ZXVlIF93aXRob3V0XyBkZXN0cm95aW5nIGV2ZXJ5dGhpbmdcbiAgICAgICAgLy8gcmVsYXRlZCB0byB0aGlzIHVwbG9hZCB0byBoYW5kbGUgcGF1c2VzLlxuICAgICAgICByZXR1cm4gKCkgPT4ge31cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMub25GaWxlUmVtb3ZlKGZpbGUuaWQsICh0YXJnZXRGaWxlSUQpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIHRoaXMucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoZmlsZS5pZCwgeyBhYm9ydDogISF1cGxvYWQudXJsIH0pXG4gICAgICAgIHJlc29sdmUoYHVwbG9hZCAke3RhcmdldEZpbGVJRH0gd2FzIHJlbW92ZWRgKVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vblBhdXNlKGZpbGUuaWQsIChpc1BhdXNlZCkgPT4ge1xuICAgICAgICBpZiAoaXNQYXVzZWQpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgdGhpcyBmaWxlIGZyb20gdGhlIHF1ZXVlIHNvIGFub3RoZXIgZmlsZSBjYW4gc3RhcnQgaW4gaXRzIHBsYWNlLlxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICAgIHVwbG9hZC5hYm9ydCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gUmVzdW1pbmcgYW4gdXBsb2FkIHNob3VsZCBiZSBxdWV1ZWQsIGVsc2UgeW91IGNvdWxkIHBhdXNlIGFuZCB0aGVuXG4gICAgICAgICAgLy8gcmVzdW1lIGEgcXVldWVkIHVwbG9hZCB0byBtYWtlIGl0IHNraXAgdGhlIHF1ZXVlLlxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QgPSB0aGlzLnJlcXVlc3RzLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB1cGxvYWQuc3RhcnQoKVxuICAgICAgICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vblBhdXNlQWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIHVwbG9hZC5hYm9ydCgpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uQ2FuY2VsQWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIHRoaXMucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoZmlsZS5pZCwgeyBhYm9ydDogISF1cGxvYWQudXJsIH0pXG4gICAgICAgIHJlc29sdmUoYHVwbG9hZCAke2ZpbGUuaWR9IHdhcyBjYW5jZWxlZGApXG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uUmVzdW1lQWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIGlmIChmaWxlLmVycm9yKSB7XG4gICAgICAgICAgdXBsb2FkLmFib3J0KClcbiAgICAgICAgfVxuICAgICAgICBxdWV1ZWRSZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0cy5ydW4oKCkgPT4ge1xuICAgICAgICAgIHVwbG9hZC5zdGFydCgpXG4gICAgICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtZXJyb3InLCBmaWxlLCBlcnIpXG4gICAgICB0aHJvdyBlcnJcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7VXBweUZpbGV9IGZpbGUgZm9yIHVzZSB3aXRoIHVwbG9hZFxuICAgKiBAcGFyYW0ge251bWJlcn0gY3VycmVudCBmaWxlIGluIGEgcXVldWVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsIG51bWJlciBvZiBmaWxlcyBpbiBhIHF1ZXVlXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgKi9cbiAgdXBsb2FkUmVtb3RlIChmaWxlKSB7XG4gICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuXG4gICAgY29uc3Qgb3B0cyA9IHsgLi4udGhpcy5vcHRzIH1cbiAgICBpZiAoZmlsZS50dXMpIHtcbiAgICAgIC8vIEluc3RhbGwgZmlsZS1zcGVjaWZpYyB1cGxvYWQgb3ZlcnJpZGVzLlxuICAgICAgT2JqZWN0LmFzc2lnbihvcHRzLCBmaWxlLnR1cylcbiAgICB9XG5cbiAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXN0YXJ0ZWQnLCBmaWxlKVxuICAgIHRoaXMudXBweS5sb2coZmlsZS5yZW1vdGUudXJsKVxuXG4gICAgaWYgKGZpbGUuc2VydmVyVG9rZW4pIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbm5lY3RUb1NlcnZlclNvY2tldChmaWxlKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBDbGllbnQgPSBmaWxlLnJlbW90ZS5wcm92aWRlck9wdGlvbnMucHJvdmlkZXIgPyBQcm92aWRlciA6IFJlcXVlc3RDbGllbnRcbiAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQodGhpcy51cHB5LCBmaWxlLnJlbW90ZS5wcm92aWRlck9wdGlvbnMpXG5cbiAgICAgIC8vICEhIGNhbmNlbGxhdGlvbiBpcyBOT1Qgc3VwcG9ydGVkIGF0IHRoaXMgc3RhZ2UgeWV0XG4gICAgICBjbGllbnQucG9zdChmaWxlLnJlbW90ZS51cmwsIHtcbiAgICAgICAgLi4uZmlsZS5yZW1vdGUuYm9keSxcbiAgICAgICAgZW5kcG9pbnQ6IG9wdHMuZW5kcG9pbnQsXG4gICAgICAgIHVwbG9hZFVybDogb3B0cy51cGxvYWRVcmwsXG4gICAgICAgIHByb3RvY29sOiAndHVzJyxcbiAgICAgICAgc2l6ZTogZmlsZS5kYXRhLnNpemUsXG4gICAgICAgIGhlYWRlcnM6IG9wdHMuaGVhZGVycyxcbiAgICAgICAgbWV0YWRhdGE6IGZpbGUubWV0YSxcbiAgICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICB0aGlzLnVwcHkuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHsgc2VydmVyVG9rZW46IHJlcy50b2tlbiB9KVxuICAgICAgICBmaWxlID0gdGhpcy51cHB5LmdldEZpbGUoZmlsZS5pZClcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdFRvU2VydmVyU29ja2V0KGZpbGUpXG4gICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtZXJyb3InLCBmaWxlLCBlcnIpXG4gICAgICAgIHJlamVjdChlcnIpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogU2VlIHRoZSBjb21tZW50IG9uIHRoZSB1cGxvYWQoKSBtZXRob2QuXG4gICAqXG4gICAqIEFkZGl0aW9uYWxseSwgd2hlbiBhbiB1cGxvYWQgaXMgcmVtb3ZlZCwgY29tcGxldGVkLCBvciBjYW5jZWxsZWQsIHdlIG5lZWQgdG8gY2xvc2UgdGhlIFdlYlNvY2tldCBjb25uZWN0aW9uLiBUaGlzIGlzXG4gICAqIGhhbmRsZWQgYnkgdGhlIHJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKCkgZnVuY3Rpb24sIHNvIHRoZSBzYW1lIGd1aWRlbGluZXMgYXBwbHkgYXMgaW4gdXBsb2FkKCkuXG4gICAqXG4gICAqIEBwYXJhbSB7VXBweUZpbGV9IGZpbGVcbiAgICovXG4gIGNvbm5lY3RUb1NlcnZlclNvY2tldCAoZmlsZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB0b2tlbiA9IGZpbGUuc2VydmVyVG9rZW5cbiAgICAgIGNvbnN0IGhvc3QgPSBnZXRTb2NrZXRIb3N0KGZpbGUucmVtb3RlLmNvbXBhbmlvblVybClcbiAgICAgIGNvbnN0IHNvY2tldCA9IG5ldyBTb2NrZXQoeyB0YXJnZXQ6IGAke2hvc3R9L2FwaS8ke3Rva2VufWAsIGF1dG9PcGVuOiBmYWxzZSB9KVxuICAgICAgdGhpcy51cGxvYWRlclNvY2tldHNbZmlsZS5pZF0gPSBzb2NrZXRcbiAgICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZS5pZF0gPSBuZXcgRXZlbnRUcmFja2VyKHRoaXMudXBweSlcblxuICAgICAgdGhpcy5vbkZpbGVSZW1vdmUoZmlsZS5pZCwgKCkgPT4ge1xuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgICAgc29ja2V0LnNlbmQoJ2NhbmNlbCcsIHt9KVxuICAgICAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQpXG4gICAgICAgIHJlc29sdmUoYHVwbG9hZCAke2ZpbGUuaWR9IHdhcyByZW1vdmVkYClcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMub25QYXVzZShmaWxlLmlkLCAoaXNQYXVzZWQpID0+IHtcbiAgICAgICAgaWYgKGlzUGF1c2VkKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHRoaXMgZmlsZSBmcm9tIHRoZSBxdWV1ZSBzbyBhbm90aGVyIGZpbGUgY2FuIHN0YXJ0IGluIGl0cyBwbGFjZS5cbiAgICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgICAgICBzb2NrZXQuc2VuZCgncGF1c2UnLCB7fSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZXN1bWluZyBhbiB1cGxvYWQgc2hvdWxkIGJlIHF1ZXVlZCwgZWxzZSB5b3UgY291bGQgcGF1c2UgYW5kIHRoZW5cbiAgICAgICAgICAvLyByZXN1bWUgYSBxdWV1ZWQgdXBsb2FkIHRvIG1ha2UgaXQgc2tpcCB0aGUgcXVldWUuXG4gICAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgICAgcXVldWVkUmVxdWVzdCA9IHRoaXMucmVxdWVzdHMucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHNvY2tldC5zZW5kKCdyZXN1bWUnLCB7fSlcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMub25QYXVzZUFsbChmaWxlLmlkLCAoKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICBzb2NrZXQuc2VuZCgncGF1c2UnLCB7fSlcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMub25DYW5jZWxBbGwoZmlsZS5pZCwgKCkgPT4ge1xuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgICAgc29ja2V0LnNlbmQoJ2NhbmNlbCcsIHt9KVxuICAgICAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQpXG4gICAgICAgIHJlc29sdmUoYHVwbG9hZCAke2ZpbGUuaWR9IHdhcyBjYW5jZWxlZGApXG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uUmVzdW1lQWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIGlmIChmaWxlLmVycm9yKSB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICAgIH1cbiAgICAgICAgcXVldWVkUmVxdWVzdCA9IHRoaXMucmVxdWVzdHMucnVuKCgpID0+IHtcbiAgICAgICAgICBzb2NrZXQuc2VuZCgncmVzdW1lJywge30pXG4gICAgICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uUmV0cnkoZmlsZS5pZCwgKCkgPT4ge1xuICAgICAgICAvLyBPbmx5IGRvIHRoZSByZXRyeSBpZiB0aGUgdXBsb2FkIGlzIGFjdHVhbGx5IGluIHByb2dyZXNzO1xuICAgICAgICAvLyBlbHNlIHdlIGNvdWxkIHRyeSB0byBzZW5kIHRoZXNlIG1lc3NhZ2VzIHdoZW4gdGhlIHVwbG9hZCBpcyBzdGlsbCBxdWV1ZWQuXG4gICAgICAgIC8vIFdlIG1heSBuZWVkIGEgYmV0dGVyIGNoZWNrIGZvciB0aGlzIHNpbmNlIHRoZSBzb2NrZXQgbWF5IGFsc28gYmUgY2xvc2VkXG4gICAgICAgIC8vIGZvciBvdGhlciByZWFzb25zLCBsaWtlIG5ldHdvcmsgZmFpbHVyZXMuXG4gICAgICAgIGlmIChzb2NrZXQuaXNPcGVuKSB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3Jlc3VtZScsIHt9KVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uUmV0cnlBbGwoZmlsZS5pZCwgKCkgPT4ge1xuICAgICAgICAvLyBTZWUgdGhlIGNvbW1lbnQgaW4gdGhlIG9uUmV0cnkoKSBjYWxsXG4gICAgICAgIGlmIChzb2NrZXQuaXNPcGVuKSB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3Jlc3VtZScsIHt9KVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBzb2NrZXQub24oJ3Byb2dyZXNzJywgKHByb2dyZXNzRGF0YSkgPT4gZW1pdFNvY2tldFByb2dyZXNzKHRoaXMsIHByb2dyZXNzRGF0YSwgZmlsZSkpXG5cbiAgICAgIHNvY2tldC5vbignZXJyb3InLCAoZXJyRGF0YSkgPT4ge1xuICAgICAgICBjb25zdCB7IG1lc3NhZ2UgfSA9IGVyckRhdGEuZXJyb3JcbiAgICAgICAgY29uc3QgZXJyb3IgPSBPYmplY3QuYXNzaWduKG5ldyBFcnJvcihtZXNzYWdlKSwgeyBjYXVzZTogZXJyRGF0YS5lcnJvciB9KVxuXG4gICAgICAgIC8vIElmIHRoZSByZW1vdGUgcmV0cnkgb3B0aW1pc2F0aW9uIHNob3VsZCBub3QgYmUgdXNlZCxcbiAgICAgICAgLy8gY2xvc2UgdGhlIHNvY2tldOKAlHRoaXMgd2lsbCB0ZWxsIGNvbXBhbmlvbiB0byBjbGVhciBzdGF0ZSBhbmQgZGVsZXRlIHRoZSBmaWxlLlxuICAgICAgICBpZiAoIXRoaXMub3B0cy51c2VGYXN0UmVtb3RlUmV0cnkpIHtcbiAgICAgICAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQpXG4gICAgICAgICAgLy8gUmVtb3ZlIHRoZSBzZXJ2ZXJUb2tlbiBzbyB0aGF0IGEgbmV3IG9uZSB3aWxsIGJlIGNyZWF0ZWQgZm9yIHRoZSByZXRyeS5cbiAgICAgICAgICB0aGlzLnVwcHkuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgICAgIHNlcnZlclRva2VuOiBudWxsLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc29ja2V0LmNsb3NlKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtZXJyb3InLCBmaWxlLCBlcnJvcilcbiAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgfSlcblxuICAgICAgc29ja2V0Lm9uKCdzdWNjZXNzJywgKGRhdGEpID0+IHtcbiAgICAgICAgY29uc3QgdXBsb2FkUmVzcCA9IHtcbiAgICAgICAgICB1cGxvYWRVUkw6IGRhdGEudXJsLFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdWNjZXNzJywgZmlsZSwgdXBsb2FkUmVzcClcbiAgICAgICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmRvbmUoKVxuXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcblxuICAgICAgbGV0IHF1ZXVlZFJlcXVlc3QgPSB0aGlzLnJlcXVlc3RzLnJ1bigoKSA9PiB7XG4gICAgICAgIHNvY2tldC5vcGVuKClcbiAgICAgICAgaWYgKGZpbGUuaXNQYXVzZWQpIHtcbiAgICAgICAgICBzb2NrZXQuc2VuZCgncGF1c2UnLCB7fSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERvbid0IGRvIGFueXRoaW5nIGhlcmUsIHRoZSBjYWxsZXIgd2lsbCB0YWtlIGNhcmUgb2YgY2FuY2VsbGluZyB0aGUgdXBsb2FkIGl0c2VsZlxuICAgICAgICAvLyB1c2luZyByZXNldFVwbG9hZGVyUmVmZXJlbmNlcygpLiBUaGlzIGlzIGJlY2F1c2UgcmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoKSBoYXMgdG8gYmVcbiAgICAgICAgLy8gY2FsbGVkIHdoZW4gdGhpcyByZXF1ZXN0IGlzIHN0aWxsIGluIHRoZSBxdWV1ZSwgYW5kIGhhcyBub3QgYmVlbiBzdGFydGVkIHlldCwgdG9vLiBBdFxuICAgICAgICAvLyB0aGF0IHBvaW50IHRoaXMgY2FuY2VsbGF0aW9uIGZ1bmN0aW9uIGlzIG5vdCBnb2luZyB0byBiZSBjYWxsZWQuXG4gICAgICAgIC8vIEFsc28sIHdlIG5lZWQgdG8gcmVtb3ZlIHRoZSByZXF1ZXN0IGZyb20gdGhlIHF1ZXVlIF93aXRob3V0XyBkZXN0cm95aW5nIGV2ZXJ5dGhpbmdcbiAgICAgICAgLy8gcmVsYXRlZCB0byB0aGlzIHVwbG9hZCB0byBoYW5kbGUgcGF1c2VzLlxuICAgICAgICByZXR1cm4gKCkgPT4ge31cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZSB0aGUgdXBsb2FkVXJsIG9uIHRoZSBmaWxlIG9wdGlvbnMsIHNvIHRoYXQgd2hlbiBHb2xkZW4gUmV0cmlldmVyXG4gICAqIHJlc3RvcmVzIHN0YXRlLCB3ZSB3aWxsIGNvbnRpbnVlIHVwbG9hZGluZyB0byB0aGUgY29ycmVjdCBVUkwuXG4gICAqXG4gICAqIEBwYXJhbSB7VXBweUZpbGV9IGZpbGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwbG9hZFVSTFxuICAgKi9cbiAgb25SZWNlaXZlVXBsb2FkVXJsIChmaWxlLCB1cGxvYWRVUkwpIHtcbiAgICBjb25zdCBjdXJyZW50RmlsZSA9IHRoaXMudXBweS5nZXRGaWxlKGZpbGUuaWQpXG4gICAgaWYgKCFjdXJyZW50RmlsZSkgcmV0dXJuXG4gICAgLy8gT25seSBkbyB0aGUgdXBkYXRlIGlmIHdlIGRpZG4ndCBoYXZlIGFuIHVwbG9hZCBVUkwgeWV0LlxuICAgIGlmICghY3VycmVudEZpbGUudHVzIHx8IGN1cnJlbnRGaWxlLnR1cy51cGxvYWRVcmwgIT09IHVwbG9hZFVSTCkge1xuICAgICAgdGhpcy51cHB5LmxvZygnW1R1c10gU3RvcmluZyB1cGxvYWQgdXJsJylcbiAgICAgIHRoaXMudXBweS5zZXRGaWxlU3RhdGUoY3VycmVudEZpbGUuaWQsIHtcbiAgICAgICAgdHVzOiB7IC4uLmN1cnJlbnRGaWxlLnR1cywgdXBsb2FkVXJsOiB1cGxvYWRVUkwgfSxcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbihzdHJpbmcpOiB2b2lkfSBjYlxuICAgKi9cbiAgb25GaWxlUmVtb3ZlIChmaWxlSUQsIGNiKSB7XG4gICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdLm9uKCdmaWxlLXJlbW92ZWQnLCAoZmlsZSkgPT4ge1xuICAgICAgaWYgKGZpbGVJRCA9PT0gZmlsZS5pZCkgY2IoZmlsZS5pZClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbihib29sZWFuKTogdm9pZH0gY2JcbiAgICovXG4gIG9uUGF1c2UgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ3VwbG9hZC1wYXVzZScsICh0YXJnZXRGaWxlSUQsIGlzUGF1c2VkKSA9PiB7XG4gICAgICBpZiAoZmlsZUlEID09PSB0YXJnZXRGaWxlSUQpIHtcbiAgICAgICAgLy8gY29uc3QgaXNQYXVzZWQgPSB0aGlzLnVwcHkucGF1c2VSZXN1bWUoZmlsZUlEKVxuICAgICAgICBjYihpc1BhdXNlZClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBjYlxuICAgKi9cbiAgb25SZXRyeSAoZmlsZUlELCBjYikge1xuICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5vbigndXBsb2FkLXJldHJ5JywgKHRhcmdldEZpbGVJRCkgPT4ge1xuICAgICAgaWYgKGZpbGVJRCA9PT0gdGFyZ2V0RmlsZUlEKSB7XG4gICAgICAgIGNiKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBjYlxuICAgKi9cbiAgb25SZXRyeUFsbCAoZmlsZUlELCBjYikge1xuICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5vbigncmV0cnktYWxsJywgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnVwcHkuZ2V0RmlsZShmaWxlSUQpKSByZXR1cm5cbiAgICAgIGNiKClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBjYlxuICAgKi9cbiAgb25QYXVzZUFsbCAoZmlsZUlELCBjYikge1xuICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5vbigncGF1c2UtYWxsJywgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnVwcHkuZ2V0RmlsZShmaWxlSUQpKSByZXR1cm5cbiAgICAgIGNiKClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBjYlxuICAgKi9cbiAgb25DYW5jZWxBbGwgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ2NhbmNlbC1hbGwnLCAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMudXBweS5nZXRGaWxlKGZpbGVJRCkpIHJldHVyblxuICAgICAgY2IoKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVJRFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IHZvaWR9IGNiXG4gICAqL1xuICBvblJlc3VtZUFsbCAoZmlsZUlELCBjYikge1xuICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5vbigncmVzdW1lLWFsbCcsICgpID0+IHtcbiAgICAgIGlmICghdGhpcy51cHB5LmdldEZpbGUoZmlsZUlEKSkgcmV0dXJuXG4gICAgICBjYigpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyhVcHB5RmlsZSB8IEZhaWxlZFVwcHlGaWxlKVtdfSBmaWxlc1xuICAgKi9cbiAgdXBsb2FkRmlsZXMgKGZpbGVzKSB7XG4gICAgY29uc3QgcHJvbWlzZXMgPSBmaWxlcy5tYXAoKGZpbGUsIGkpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSBpICsgMVxuICAgICAgY29uc3QgdG90YWwgPSBmaWxlcy5sZW5ndGhcblxuICAgICAgaWYgKCdlcnJvcicgaW4gZmlsZSAmJiBmaWxlLmVycm9yKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoZmlsZS5lcnJvcikpXG4gICAgICB9IGlmIChmaWxlLmlzUmVtb3RlKSB7XG4gICAgICAgIC8vIFdlIGVtaXQgdXBsb2FkLXN0YXJ0ZWQgaGVyZSwgc28gdGhhdCBpdCdzIGFsc28gZW1pdHRlZCBmb3IgZmlsZXNcbiAgICAgICAgLy8gdGhhdCBoYXZlIHRvIHdhaXQgZHVlIHRvIHRoZSBgbGltaXRgIG9wdGlvbi5cbiAgICAgICAgLy8gRG9uJ3QgZG91YmxlLWVtaXQgdXBsb2FkLXN0YXJ0ZWQgZm9yIEdvbGRlbiBSZXRyaWV2ZXItcmVzdG9yZWQgZmlsZXMgdGhhdCB3ZXJlIGFscmVhZHkgc3RhcnRlZFxuICAgICAgICBpZiAoIWZpbGUucHJvZ3Jlc3MudXBsb2FkU3RhcnRlZCB8fCAhZmlsZS5pc1Jlc3RvcmVkKSB7XG4gICAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdGFydGVkJywgZmlsZSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy51cGxvYWRSZW1vdGUoZmlsZSwgY3VycmVudCwgdG90YWwpXG4gICAgICB9XG4gICAgICAvLyBEb24ndCBkb3VibGUtZW1pdCB1cGxvYWQtc3RhcnRlZCBmb3IgR29sZGVuIFJldHJpZXZlci1yZXN0b3JlZCBmaWxlcyB0aGF0IHdlcmUgYWxyZWFkeSBzdGFydGVkXG4gICAgICBpZiAoIWZpbGUucHJvZ3Jlc3MudXBsb2FkU3RhcnRlZCB8fCAhZmlsZS5pc1Jlc3RvcmVkKSB7XG4gICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtc3RhcnRlZCcsIGZpbGUpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy51cGxvYWQoZmlsZSwgY3VycmVudCwgdG90YWwpXG4gICAgfSlcblxuICAgIHJldHVybiBzZXR0bGUocHJvbWlzZXMpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gZmlsZUlEc1xuICAgKi9cbiAgaGFuZGxlVXBsb2FkIChmaWxlSURzKSB7XG4gICAgaWYgKGZpbGVJRHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKCdbVHVzXSBObyBmaWxlcyB0byB1cGxvYWQnKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0cy5saW1pdCA9PT0gMCkge1xuICAgICAgdGhpcy51cHB5LmxvZyhcbiAgICAgICAgJ1tUdXNdIFdoZW4gdXBsb2FkaW5nIG11bHRpcGxlIGZpbGVzIGF0IG9uY2UsIGNvbnNpZGVyIHNldHRpbmcgdGhlIGBsaW1pdGAgb3B0aW9uICh0byBgMTBgIGZvciBleGFtcGxlKSwgdG8gbGltaXQgdGhlIG51bWJlciBvZiBjb25jdXJyZW50IHVwbG9hZHMsIHdoaWNoIGhlbHBzIHByZXZlbnQgbWVtb3J5IGFuZCBuZXR3b3JrIGlzc3VlczogaHR0cHM6Ly91cHB5LmlvL2RvY3MvdHVzLyNsaW1pdC0wJyxcbiAgICAgICAgJ3dhcm5pbmcnXG4gICAgICApXG4gICAgfVxuXG4gICAgdGhpcy51cHB5LmxvZygnW1R1c10gVXBsb2FkaW5nLi4uJylcbiAgICBjb25zdCBmaWxlc1RvVXBsb2FkID0gZmlsZUlEcy5tYXAoKGZpbGVJRCkgPT4gdGhpcy51cHB5LmdldEZpbGUoZmlsZUlEKSlcblxuICAgIHJldHVybiB0aGlzLnVwbG9hZEZpbGVzKGZpbGVzVG9VcGxvYWQpXG4gICAgICAudGhlbigoKSA9PiBudWxsKVxuICB9XG5cbiAgaW5zdGFsbCAoKSB7XG4gICAgdGhpcy51cHB5LnNldFN0YXRlKHtcbiAgICAgIGNhcGFiaWxpdGllczogeyAuLi50aGlzLnVwcHkuZ2V0U3RhdGUoKS5jYXBhYmlsaXRpZXMsIHJlc3VtYWJsZVVwbG9hZHM6IHRydWUgfSxcbiAgICB9KVxuICAgIHRoaXMudXBweS5hZGRVcGxvYWRlcih0aGlzLmhhbmRsZVVwbG9hZClcblxuICAgIHRoaXMudXBweS5vbigncmVzZXQtcHJvZ3Jlc3MnLCB0aGlzLmhhbmRsZVJlc2V0UHJvZ3Jlc3MpXG4gIH1cblxuICB1bmluc3RhbGwgKCkge1xuICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICBjYXBhYmlsaXRpZXM6IHsgLi4udGhpcy51cHB5LmdldFN0YXRlKCkuY2FwYWJpbGl0aWVzLCByZXN1bWFibGVVcGxvYWRzOiBmYWxzZSB9LFxuICAgIH0pXG4gICAgdGhpcy51cHB5LnJlbW92ZVVwbG9hZGVyKHRoaXMuaGFuZGxlVXBsb2FkKVxuICB9XG59XG4iLCIvKipcbiAqIENyZWF0ZSBhIHdyYXBwZXIgYXJvdW5kIGFuIGV2ZW50IGVtaXR0ZXIgd2l0aCBhIGByZW1vdmVgIG1ldGhvZCB0byByZW1vdmVcbiAqIGFsbCBldmVudHMgdGhhdCB3ZXJlIGFkZGVkIHVzaW5nIHRoZSB3cmFwcGVkIGVtaXR0ZXIuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRXZlbnRUcmFja2VyIHtcbiAgI2VtaXR0ZXJcblxuICAjZXZlbnRzID0gW11cblxuICBjb25zdHJ1Y3RvciAoZW1pdHRlcikge1xuICAgIHRoaXMuI2VtaXR0ZXIgPSBlbWl0dGVyXG4gIH1cblxuICBvbiAoZXZlbnQsIGZuKSB7XG4gICAgdGhpcy4jZXZlbnRzLnB1c2goW2V2ZW50LCBmbl0pXG4gICAgcmV0dXJuIHRoaXMuI2VtaXR0ZXIub24oZXZlbnQsIGZuKVxuICB9XG5cbiAgcmVtb3ZlICgpIHtcbiAgICBmb3IgKGNvbnN0IFtldmVudCwgZm5dIG9mIHRoaXMuI2V2ZW50cy5zcGxpY2UoMCkpIHtcbiAgICAgIHRoaXMuI2VtaXR0ZXIub2ZmKGV2ZW50LCBmbilcbiAgICB9XG4gIH1cbn1cbiIsImNsYXNzIE5ldHdvcmtFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IgKGVycm9yLCB4aHIgPSBudWxsKSB7XG4gICAgc3VwZXIoYFRoaXMgbG9va3MgbGlrZSBhIG5ldHdvcmsgZXJyb3IsIHRoZSBlbmRwb2ludCBtaWdodCBiZSBibG9ja2VkIGJ5IGFuIGludGVybmV0IHByb3ZpZGVyIG9yIGEgZmlyZXdhbGwuYClcblxuICAgIHRoaXMuY2F1c2UgPSBlcnJvclxuICAgIHRoaXMuaXNOZXR3b3JrRXJyb3IgPSB0cnVlXG4gICAgdGhpcy5yZXF1ZXN0ID0geGhyXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOZXR3b3JrRXJyb3JcbiIsImZ1bmN0aW9uIGNyZWF0ZUNhbmNlbEVycm9yICgpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcignQ2FuY2VsbGVkJylcbn1cblxuY2xhc3MgUmF0ZUxpbWl0ZWRRdWV1ZSB7XG4gICNhY3RpdmVSZXF1ZXN0cyA9IDBcblxuICAjcXVldWVkSGFuZGxlcnMgPSBbXVxuXG4gIGNvbnN0cnVjdG9yIChsaW1pdCkge1xuICAgIGlmICh0eXBlb2YgbGltaXQgIT09ICdudW1iZXInIHx8IGxpbWl0ID09PSAwKSB7XG4gICAgICB0aGlzLmxpbWl0ID0gSW5maW5pdHlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5saW1pdCA9IGxpbWl0XG4gICAgfVxuICB9XG5cbiAgI2NhbGwgKGZuKSB7XG4gICAgdGhpcy4jYWN0aXZlUmVxdWVzdHMgKz0gMVxuXG4gICAgbGV0IGRvbmUgPSBmYWxzZVxuXG4gICAgbGV0IGNhbmNlbEFjdGl2ZVxuICAgIHRyeSB7XG4gICAgICBjYW5jZWxBY3RpdmUgPSBmbigpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLiNhY3RpdmVSZXF1ZXN0cyAtPSAxXG4gICAgICB0aHJvdyBlcnJcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWJvcnQ6ICgpID0+IHtcbiAgICAgICAgaWYgKGRvbmUpIHJldHVyblxuICAgICAgICBkb25lID0gdHJ1ZVxuICAgICAgICB0aGlzLiNhY3RpdmVSZXF1ZXN0cyAtPSAxXG4gICAgICAgIGNhbmNlbEFjdGl2ZSgpXG4gICAgICAgIHRoaXMuI3F1ZXVlTmV4dCgpXG4gICAgICB9LFxuXG4gICAgICBkb25lOiAoKSA9PiB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm5cbiAgICAgICAgZG9uZSA9IHRydWVcbiAgICAgICAgdGhpcy4jYWN0aXZlUmVxdWVzdHMgLT0gMVxuICAgICAgICB0aGlzLiNxdWV1ZU5leHQoKVxuICAgICAgfSxcbiAgICB9XG4gIH1cblxuICAjcXVldWVOZXh0ICgpIHtcbiAgICAvLyBEbyBpdCBzb29uIGJ1dCBub3QgaW1tZWRpYXRlbHksIHRoaXMgYWxsb3dzIGNsZWFyaW5nIG91dCB0aGUgZW50aXJlIHF1ZXVlIHN5bmNocm9ub3VzbHlcbiAgICAvLyBvbmUgYnkgb25lIHdpdGhvdXQgY29udGludW91c2x5IF9hZHZhbmNpbmdfIGl0IChhbmQgc3RhcnRpbmcgbmV3IHRhc2tzIGJlZm9yZSBpbW1lZGlhdGVseVxuICAgIC8vIGFib3J0aW5nIHRoZW0pXG4gICAgcXVldWVNaWNyb3Rhc2soKCkgPT4gdGhpcy4jbmV4dCgpKVxuICB9XG5cbiAgI25leHQgKCkge1xuICAgIGlmICh0aGlzLiNhY3RpdmVSZXF1ZXN0cyA+PSB0aGlzLmxpbWl0KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHRoaXMuI3F1ZXVlZEhhbmRsZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gRGlzcGF0Y2ggdGhlIG5leHQgcmVxdWVzdCwgYW5kIHVwZGF0ZSB0aGUgYWJvcnQvZG9uZSBoYW5kbGVyc1xuICAgIC8vIHNvIHRoYXQgY2FuY2VsbGluZyBpdCBkb2VzIHRoZSBSaWdodCBUaGluZyAoYW5kIGRvZXNuJ3QganVzdCB0cnlcbiAgICAvLyB0byBkZXF1ZXVlIGFuIGFscmVhZHktcnVubmluZyByZXF1ZXN0KS5cbiAgICBjb25zdCBuZXh0ID0gdGhpcy4jcXVldWVkSGFuZGxlcnMuc2hpZnQoKVxuICAgIGNvbnN0IGhhbmRsZXIgPSB0aGlzLiNjYWxsKG5leHQuZm4pXG4gICAgbmV4dC5hYm9ydCA9IGhhbmRsZXIuYWJvcnRcbiAgICBuZXh0LmRvbmUgPSBoYW5kbGVyLmRvbmVcbiAgfVxuXG4gICNxdWV1ZSAoZm4sIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGhhbmRsZXIgPSB7XG4gICAgICBmbixcbiAgICAgIHByaW9yaXR5OiBvcHRpb25zLnByaW9yaXR5IHx8IDAsXG4gICAgICBhYm9ydDogKCkgPT4ge1xuICAgICAgICB0aGlzLiNkZXF1ZXVlKGhhbmRsZXIpXG4gICAgICB9LFxuICAgICAgZG9uZTogKCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBtYXJrIGEgcXVldWVkIHJlcXVlc3QgYXMgZG9uZTogdGhpcyBpbmRpY2F0ZXMgYSBidWcnKVxuICAgICAgfSxcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IHRoaXMuI3F1ZXVlZEhhbmRsZXJzLmZpbmRJbmRleCgob3RoZXIpID0+IHtcbiAgICAgIHJldHVybiBoYW5kbGVyLnByaW9yaXR5ID4gb3RoZXIucHJpb3JpdHlcbiAgICB9KVxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRoaXMuI3F1ZXVlZEhhbmRsZXJzLnB1c2goaGFuZGxlcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4jcXVldWVkSGFuZGxlcnMuc3BsaWNlKGluZGV4LCAwLCBoYW5kbGVyKVxuICAgIH1cbiAgICByZXR1cm4gaGFuZGxlclxuICB9XG5cbiAgI2RlcXVldWUgKGhhbmRsZXIpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuI3F1ZXVlZEhhbmRsZXJzLmluZGV4T2YoaGFuZGxlcilcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLiNxdWV1ZWRIYW5kbGVycy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfVxuICB9XG5cbiAgcnVuIChmbiwgcXVldWVPcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuI2FjdGl2ZVJlcXVlc3RzIDwgdGhpcy5saW1pdCkge1xuICAgICAgcmV0dXJuIHRoaXMuI2NhbGwoZm4pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLiNxdWV1ZShmbiwgcXVldWVPcHRpb25zKVxuICB9XG5cbiAgd3JhcFByb21pc2VGdW5jdGlvbiAoZm4sIHF1ZXVlT3B0aW9ucykge1xuICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgbGV0IHF1ZXVlZFJlcXVlc3RcbiAgICAgIGNvbnN0IG91dGVyUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdCA9IHRoaXMucnVuKCgpID0+IHtcbiAgICAgICAgICBsZXQgY2FuY2VsRXJyb3JcbiAgICAgICAgICBsZXQgaW5uZXJQcm9taXNlXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlubmVyUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShmbiguLi5hcmdzKSlcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlubmVyUHJvbWlzZSA9IFByb21pc2UucmVqZWN0KGVycilcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbm5lclByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBpZiAoY2FuY2VsRXJyb3IpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGNhbmNlbEVycm9yKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcbiAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYgKGNhbmNlbEVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChjYW5jZWxFcnJvcilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpXG4gICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcblxuICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjYW5jZWxFcnJvciA9IGNyZWF0ZUNhbmNlbEVycm9yKClcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHF1ZXVlT3B0aW9ucylcbiAgICAgIH0pXG5cbiAgICAgIG91dGVyUHJvbWlzZS5hYm9ydCA9ICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXRlclByb21pc2VcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFJhdGVMaW1pdGVkUXVldWUsXG4gIGludGVybmFsUmF0ZUxpbWl0ZWRRdWV1ZTogU3ltYm9sKCdfX3F1ZXVlJyksXG59XG4iLCJjb25zdCBoYXMgPSByZXF1aXJlKCcuL2hhc1Byb3BlcnR5JylcblxuZnVuY3Rpb24gaW5zZXJ0UmVwbGFjZW1lbnQgKHNvdXJjZSwgcngsIHJlcGxhY2VtZW50KSB7XG4gIGNvbnN0IG5ld1BhcnRzID0gW11cbiAgc291cmNlLmZvckVhY2goKGNodW5rKSA9PiB7XG4gICAgLy8gV2hlbiB0aGUgc291cmNlIGNvbnRhaW5zIG11bHRpcGxlIHBsYWNlaG9sZGVycyBmb3IgaW50ZXJwb2xhdGlvbixcbiAgICAvLyB3ZSBzaG91bGQgaWdub3JlIGNodW5rcyB0aGF0IGFyZSBub3Qgc3RyaW5ncywgYmVjYXVzZSB0aG9zZVxuICAgIC8vIGNhbiBiZSBKU1ggb2JqZWN0cyBhbmQgd2lsbCBiZSBvdGhlcndpc2UgaW5jb3JyZWN0bHkgdHVybmVkIGludG8gc3RyaW5ncy5cbiAgICAvLyBXaXRob3V0IHRoaXMgY29uZGl0aW9uIHdl4oCZZCBnZXQgdGhpczogW29iamVjdCBPYmplY3RdIGhlbGxvIFtvYmplY3QgT2JqZWN0XSBteSA8YnV0dG9uPlxuICAgIGlmICh0eXBlb2YgY2h1bmsgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3UGFydHMucHVzaChjaHVuaylcbiAgICB9XG5cbiAgICByZXR1cm4gcnhbU3ltYm9sLnNwbGl0XShjaHVuaykuZm9yRWFjaCgocmF3LCBpLCBsaXN0KSA9PiB7XG4gICAgICBpZiAocmF3ICE9PSAnJykge1xuICAgICAgICBuZXdQYXJ0cy5wdXNoKHJhdylcbiAgICAgIH1cblxuICAgICAgLy8gSW50ZXJsYWNlIHdpdGggdGhlIGByZXBsYWNlbWVudGAgdmFsdWVcbiAgICAgIGlmIChpIDwgbGlzdC5sZW5ndGggLSAxKSB7XG4gICAgICAgIG5ld1BhcnRzLnB1c2gocmVwbGFjZW1lbnQpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbiAgcmV0dXJuIG5ld1BhcnRzXG59XG5cbi8qKlxuICogVGFrZXMgYSBzdHJpbmcgd2l0aCBwbGFjZWhvbGRlciB2YXJpYWJsZXMgbGlrZSBgJXtzbWFydF9jb3VudH0gZmlsZSBzZWxlY3RlZGBcbiAqIGFuZCByZXBsYWNlcyBpdCB3aXRoIHZhbHVlcyBmcm9tIG9wdGlvbnMgYHtzbWFydF9jb3VudDogNX1gXG4gKlxuICogQGxpY2Vuc2UgaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKiB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9haXJibmIvcG9seWdsb3QuanMvYmxvYi9tYXN0ZXIvbGliL3BvbHlnbG90LmpzI0wyOTlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGhyYXNlIHRoYXQgbmVlZHMgaW50ZXJwb2xhdGlvbiwgd2l0aCBwbGFjZWhvbGRlcnNcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIHdpdGggdmFsdWVzIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHJlcGxhY2UgcGxhY2Vob2xkZXJzXG4gKiBAcmV0dXJucyB7YW55W119IGludGVycG9sYXRlZFxuICovXG5mdW5jdGlvbiBpbnRlcnBvbGF0ZSAocGhyYXNlLCBvcHRpb25zKSB7XG4gIGNvbnN0IGRvbGxhclJlZ2V4ID0gL1xcJC9nXG4gIGNvbnN0IGRvbGxhckJpbGxzWWFsbCA9ICckJCQkJ1xuICBsZXQgaW50ZXJwb2xhdGVkID0gW3BocmFzZV1cblxuICBpZiAob3B0aW9ucyA9PSBudWxsKSByZXR1cm4gaW50ZXJwb2xhdGVkXG5cbiAgZm9yIChjb25zdCBhcmcgb2YgT2JqZWN0LmtleXMob3B0aW9ucykpIHtcbiAgICBpZiAoYXJnICE9PSAnXycpIHtcbiAgICAgIC8vIEVuc3VyZSByZXBsYWNlbWVudCB2YWx1ZSBpcyBlc2NhcGVkIHRvIHByZXZlbnQgc3BlY2lhbCAkLXByZWZpeGVkXG4gICAgICAvLyByZWdleCByZXBsYWNlIHRva2Vucy4gdGhlIFwiJCQkJFwiIGlzIG5lZWRlZCBiZWNhdXNlIGVhY2ggXCIkXCIgbmVlZHMgdG9cbiAgICAgIC8vIGJlIGVzY2FwZWQgd2l0aCBcIiRcIiBpdHNlbGYsIGFuZCB3ZSBuZWVkIHR3byBpbiB0aGUgcmVzdWx0aW5nIG91dHB1dC5cbiAgICAgIGxldCByZXBsYWNlbWVudCA9IG9wdGlvbnNbYXJnXVxuICAgICAgaWYgKHR5cGVvZiByZXBsYWNlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmVwbGFjZW1lbnQgPSBkb2xsYXJSZWdleFtTeW1ib2wucmVwbGFjZV0ocmVwbGFjZW1lbnQsIGRvbGxhckJpbGxzWWFsbClcbiAgICAgIH1cbiAgICAgIC8vIFdlIGNyZWF0ZSBhIG5ldyBgUmVnRXhwYCBlYWNoIHRpbWUgaW5zdGVhZCBvZiB1c2luZyBhIG1vcmUtZWZmaWNpZW50XG4gICAgICAvLyBzdHJpbmcgcmVwbGFjZSBzbyB0aGF0IHRoZSBzYW1lIGFyZ3VtZW50IGNhbiBiZSByZXBsYWNlZCBtdWx0aXBsZSB0aW1lc1xuICAgICAgLy8gaW4gdGhlIHNhbWUgcGhyYXNlLlxuICAgICAgaW50ZXJwb2xhdGVkID0gaW5zZXJ0UmVwbGFjZW1lbnQoaW50ZXJwb2xhdGVkLCBuZXcgUmVnRXhwKGAlXFxcXHske2FyZ31cXFxcfWAsICdnJyksIHJlcGxhY2VtZW50KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbnRlcnBvbGF0ZWRcbn1cblxuLyoqXG4gKiBUcmFuc2xhdGVzIHN0cmluZ3Mgd2l0aCBpbnRlcnBvbGF0aW9uICYgcGx1cmFsaXphdGlvbiBzdXBwb3J0LlxuICogRXh0ZW5zaWJsZSB3aXRoIGN1c3RvbSBkaWN0aW9uYXJpZXMgYW5kIHBsdXJhbGl6YXRpb24gZnVuY3Rpb25zLlxuICpcbiAqIEJvcnJvd3MgaGVhdmlseSBmcm9tIGFuZCBpbnNwaXJlZCBieSBQb2x5Z2xvdCBodHRwczovL2dpdGh1Yi5jb20vYWlyYm5iL3BvbHlnbG90LmpzLFxuICogYmFzaWNhbGx5IGEgc3RyaXBwZWQtZG93biB2ZXJzaW9uIG9mIGl0LiBEaWZmZXJlbmNlczogcGx1cmFsaXphdGlvbiBmdW5jdGlvbnMgYXJlIG5vdCBoYXJkY29kZWRcbiAqIGFuZCBjYW4gYmUgZWFzaWx5IGFkZGVkIGFtb25nIHdpdGggZGljdGlvbmFyaWVzLCBuZXN0ZWQgb2JqZWN0cyBhcmUgdXNlZCBmb3IgcGx1cmFsaXphdGlvblxuICogYXMgb3Bwb3NlZCB0byBgfHx8fGAgZGVsaW1ldGVyXG4gKlxuICogVXNhZ2UgZXhhbXBsZTogYHRyYW5zbGF0b3IudHJhbnNsYXRlKCdmaWxlc19jaG9zZW4nLCB7c21hcnRfY291bnQ6IDN9KWBcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUcmFuc2xhdG9yIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fEFycmF5PG9iamVjdD59IGxvY2FsZXMgLSBsb2NhbGUgb3IgbGlzdCBvZiBsb2NhbGVzLlxuICAgKi9cbiAgY29uc3RydWN0b3IgKGxvY2FsZXMpIHtcbiAgICB0aGlzLmxvY2FsZSA9IHtcbiAgICAgIHN0cmluZ3M6IHt9LFxuICAgICAgcGx1cmFsaXplIChuKSB7XG4gICAgICAgIGlmIChuID09PSAxKSB7XG4gICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMVxuICAgICAgfSxcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShsb2NhbGVzKSkge1xuICAgICAgbG9jYWxlcy5mb3JFYWNoKHRoaXMuI2FwcGx5LCB0aGlzKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiNhcHBseShsb2NhbGVzKVxuICAgIH1cbiAgfVxuXG4gICNhcHBseSAobG9jYWxlKSB7XG4gICAgaWYgKCFsb2NhbGU/LnN0cmluZ3MpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHByZXZMb2NhbGUgPSB0aGlzLmxvY2FsZVxuICAgIHRoaXMubG9jYWxlID0geyAuLi5wcmV2TG9jYWxlLCBzdHJpbmdzOiB7IC4uLnByZXZMb2NhbGUuc3RyaW5ncywgLi4ubG9jYWxlLnN0cmluZ3MgfSB9XG4gICAgdGhpcy5sb2NhbGUucGx1cmFsaXplID0gbG9jYWxlLnBsdXJhbGl6ZSB8fCBwcmV2TG9jYWxlLnBsdXJhbGl6ZVxuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYyB0cmFuc2xhdGUgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgd2l0aCB2YWx1ZXMgdGhhdCB3aWxsIGJlIHVzZWQgbGF0ZXIgdG8gcmVwbGFjZSBwbGFjZWhvbGRlcnMgaW4gc3RyaW5nXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRyYW5zbGF0ZWQgKGFuZCBpbnRlcnBvbGF0ZWQpXG4gICAqL1xuICB0cmFuc2xhdGUgKGtleSwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZUFycmF5KGtleSwgb3B0aW9ucykuam9pbignJylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSB0cmFuc2xhdGlvbiBhbmQgcmV0dXJuIHRoZSB0cmFuc2xhdGVkIGFuZCBpbnRlcnBvbGF0ZWQgcGFydHMgYXMgYW4gYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgd2l0aCB2YWx1ZXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gcmVwbGFjZSBwbGFjZWhvbGRlcnNcbiAgICogQHJldHVybnMge0FycmF5fSBUaGUgdHJhbnNsYXRlZCBhbmQgaW50ZXJwb2xhdGVkIHBhcnRzLCBpbiBvcmRlci5cbiAgICovXG4gIHRyYW5zbGF0ZUFycmF5IChrZXksIG9wdGlvbnMpIHtcbiAgICBpZiAoIWhhcyh0aGlzLmxvY2FsZS5zdHJpbmdzLCBrZXkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYG1pc3Npbmcgc3RyaW5nOiAke2tleX1gKVxuICAgIH1cblxuICAgIGNvbnN0IHN0cmluZyA9IHRoaXMubG9jYWxlLnN0cmluZ3Nba2V5XVxuICAgIGNvbnN0IGhhc1BsdXJhbEZvcm1zID0gdHlwZW9mIHN0cmluZyA9PT0gJ29iamVjdCdcblxuICAgIGlmIChoYXNQbHVyYWxGb3Jtcykge1xuICAgICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuc21hcnRfY291bnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnN0IHBsdXJhbCA9IHRoaXMubG9jYWxlLnBsdXJhbGl6ZShvcHRpb25zLnNtYXJ0X2NvdW50KVxuICAgICAgICByZXR1cm4gaW50ZXJwb2xhdGUoc3RyaW5nW3BsdXJhbF0sIG9wdGlvbnMpXG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dGVtcHRlZCB0byB1c2UgYSBzdHJpbmcgd2l0aCBwbHVyYWwgZm9ybXMsIGJ1dCBubyB2YWx1ZSB3YXMgZ2l2ZW4gZm9yICV7c21hcnRfY291bnR9JylcbiAgICB9XG5cbiAgICByZXR1cm4gaW50ZXJwb2xhdGUoc3RyaW5nLCBvcHRpb25zKVxuICB9XG59XG4iLCJjb25zdCB0aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC50aHJvdHRsZScpXG5cbmZ1bmN0aW9uIGVtaXRTb2NrZXRQcm9ncmVzcyAodXBsb2FkZXIsIHByb2dyZXNzRGF0YSwgZmlsZSkge1xuICBjb25zdCB7IHByb2dyZXNzLCBieXRlc1VwbG9hZGVkLCBieXRlc1RvdGFsIH0gPSBwcm9ncmVzc0RhdGFcbiAgaWYgKHByb2dyZXNzKSB7XG4gICAgdXBsb2FkZXIudXBweS5sb2coYFVwbG9hZCBwcm9ncmVzczogJHtwcm9ncmVzc31gKVxuICAgIHVwbG9hZGVyLnVwcHkuZW1pdCgndXBsb2FkLXByb2dyZXNzJywgZmlsZSwge1xuICAgICAgdXBsb2FkZXIsXG4gICAgICBieXRlc1VwbG9hZGVkLFxuICAgICAgYnl0ZXNUb3RhbCxcbiAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGhyb3R0bGUoZW1pdFNvY2tldFByb2dyZXNzLCAzMDAsIHtcbiAgbGVhZGluZzogdHJ1ZSxcbiAgdHJhaWxpbmc6IHRydWUsXG59KVxuIiwiY29uc3QgTmV0d29ya0Vycm9yID0gcmVxdWlyZSgnLi9OZXR3b3JrRXJyb3InKVxuXG4vKipcbiAqIFdyYXBwZXIgYXJvdW5kIHdpbmRvdy5mZXRjaCB0aGF0IHRocm93cyBhIE5ldHdvcmtFcnJvciB3aGVuIGFwcHJvcHJpYXRlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmV0Y2hXaXRoTmV0d29ya0Vycm9yICguLi5vcHRpb25zKSB7XG4gIHJldHVybiBmZXRjaCguLi5vcHRpb25zKVxuICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyLm5hbWUgPT09ICdBYm9ydEVycm9yJykge1xuICAgICAgICB0aHJvdyBlcnJcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBOZXR3b3JrRXJyb3IoZXJyKVxuICAgICAgfVxuICAgIH0pXG59XG4iLCJjb25zdCBpc0RPTUVsZW1lbnQgPSByZXF1aXJlKCcuL2lzRE9NRWxlbWVudCcpXG5cbi8qKlxuICogRmluZCBhIERPTSBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7Tm9kZXxzdHJpbmd9IGVsZW1lbnRcbiAqIEByZXR1cm5zIHtOb2RlfG51bGx9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmluZERPTUVsZW1lbnQgKGVsZW1lbnQsIGNvbnRleHQgPSBkb2N1bWVudCkge1xuICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGNvbnRleHQucXVlcnlTZWxlY3RvcihlbGVtZW50KVxuICB9XG5cbiAgaWYgKGlzRE9NRWxlbWVudChlbGVtZW50KSkge1xuICAgIHJldHVybiBlbGVtZW50XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuIiwiZnVuY3Rpb24gZW5jb2RlQ2hhcmFjdGVyIChjaGFyYWN0ZXIpIHtcbiAgcmV0dXJuIGNoYXJhY3Rlci5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDMyKVxufVxuXG5mdW5jdGlvbiBlbmNvZGVGaWxlbmFtZSAobmFtZSkge1xuICBsZXQgc3VmZml4ID0gJydcbiAgcmV0dXJuIG5hbWUucmVwbGFjZSgvW15BLVowLTldL2lnLCAoY2hhcmFjdGVyKSA9PiB7XG4gICAgc3VmZml4ICs9IGAtJHtlbmNvZGVDaGFyYWN0ZXIoY2hhcmFjdGVyKX1gXG4gICAgcmV0dXJuICcvJ1xuICB9KSArIHN1ZmZpeFxufVxuXG4vKipcbiAqIFRha2VzIGEgZmlsZSBvYmplY3QgYW5kIHR1cm5zIGl0IGludG8gZmlsZUlELCBieSBjb252ZXJ0aW5nIGZpbGUubmFtZSB0byBsb3dlcmNhc2UsXG4gKiByZW1vdmluZyBleHRyYSBjaGFyYWN0ZXJzIGFuZCBhZGRpbmcgdHlwZSwgc2l6ZSBhbmQgbGFzdE1vZGlmaWVkXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGZpbGVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBmaWxlSURcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZUZpbGVJRCAoZmlsZSkge1xuICAvLyBJdCdzIHRlbXB0aW5nIHRvIGRvIGBbaXRlbXNdLmZpbHRlcihCb29sZWFuKS5qb2luKCctJylgIGhlcmUsIGJ1dCB0aGF0XG4gIC8vIGlzIHNsb3dlciEgc2ltcGxlIHN0cmluZyBjb25jYXRlbmF0aW9uIGlzIGZhc3RcblxuICBsZXQgaWQgPSAndXBweSdcbiAgaWYgKHR5cGVvZiBmaWxlLm5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgaWQgKz0gYC0ke2VuY29kZUZpbGVuYW1lKGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpKX1gXG4gIH1cblxuICBpZiAoZmlsZS50eXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZCArPSBgLSR7ZmlsZS50eXBlfWBcbiAgfVxuXG4gIGlmIChmaWxlLm1ldGEgJiYgdHlwZW9mIGZpbGUubWV0YS5yZWxhdGl2ZVBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgaWQgKz0gYC0ke2VuY29kZUZpbGVuYW1lKGZpbGUubWV0YS5yZWxhdGl2ZVBhdGgudG9Mb3dlckNhc2UoKSl9YFxuICB9XG5cbiAgaWYgKGZpbGUuZGF0YS5zaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZCArPSBgLSR7ZmlsZS5kYXRhLnNpemV9YFxuICB9XG4gIGlmIChmaWxlLmRhdGEubGFzdE1vZGlmaWVkICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZCArPSBgLSR7ZmlsZS5kYXRhLmxhc3RNb2RpZmllZH1gXG4gIH1cblxuICByZXR1cm4gaWRcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0Qnl0ZXNSZW1haW5pbmcgKGZpbGVQcm9ncmVzcykge1xuICByZXR1cm4gZmlsZVByb2dyZXNzLmJ5dGVzVG90YWwgLSBmaWxlUHJvZ3Jlc3MuYnl0ZXNVcGxvYWRlZFxufVxuIiwiLyoqXG4gKiBUYWtlcyBhIGZ1bGwgZmlsZW5hbWUgc3RyaW5nIGFuZCByZXR1cm5zIGFuIG9iamVjdCB7bmFtZSwgZXh0ZW5zaW9ufVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmdWxsRmlsZU5hbWVcbiAqIEByZXR1cm5zIHtvYmplY3R9IHtuYW1lLCBleHRlbnNpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24gKGZ1bGxGaWxlTmFtZSkge1xuICBjb25zdCBsYXN0RG90ID0gZnVsbEZpbGVOYW1lLmxhc3RJbmRleE9mKCcuJylcbiAgLy8gdGhlc2UgY291bnQgYXMgbm8gZXh0ZW5zaW9uOiBcIm5vLWRvdFwiLCBcInRyYWlsaW5nLWRvdC5cIlxuICBpZiAobGFzdERvdCA9PT0gLTEgfHwgbGFzdERvdCA9PT0gZnVsbEZpbGVOYW1lLmxlbmd0aCAtIDEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogZnVsbEZpbGVOYW1lLFxuICAgICAgZXh0ZW5zaW9uOiB1bmRlZmluZWQsXG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgbmFtZTogZnVsbEZpbGVOYW1lLnNsaWNlKDAsIGxhc3REb3QpLFxuICAgIGV4dGVuc2lvbjogZnVsbEZpbGVOYW1lLnNsaWNlKGxhc3REb3QgKyAxKSxcbiAgfVxufVxuIiwiY29uc3QgZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24gPSByZXF1aXJlKCcuL2dldEZpbGVOYW1lQW5kRXh0ZW5zaW9uJylcbmNvbnN0IG1pbWVUeXBlcyA9IHJlcXVpcmUoJy4vbWltZVR5cGVzJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRGaWxlVHlwZSAoZmlsZSkge1xuICBpZiAoZmlsZS50eXBlKSByZXR1cm4gZmlsZS50eXBlXG5cbiAgY29uc3QgZmlsZUV4dGVuc2lvbiA9IGZpbGUubmFtZSA/IGdldEZpbGVOYW1lQW5kRXh0ZW5zaW9uKGZpbGUubmFtZSkuZXh0ZW5zaW9uPy50b0xvd2VyQ2FzZSgpIDogbnVsbFxuICBpZiAoZmlsZUV4dGVuc2lvbiAmJiBmaWxlRXh0ZW5zaW9uIGluIG1pbWVUeXBlcykge1xuICAgIC8vIGVsc2UsIHNlZSBpZiB3ZSBjYW4gbWFwIGV4dGVuc2lvbiB0byBhIG1pbWUgdHlwZVxuICAgIHJldHVybiBtaW1lVHlwZXNbZmlsZUV4dGVuc2lvbl1cbiAgfVxuICAvLyBpZiBhbGwgZmFpbHMsIGZhbGwgYmFjayB0byBhIGdlbmVyaWMgYnl0ZSBzdHJlYW0gdHlwZVxuICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U29ja2V0SG9zdCAodXJsKSB7XG4gIC8vIGdldCB0aGUgaG9zdCBkb21haW5cbiAgY29uc3QgcmVnZXggPSAvXig/Omh0dHBzPzpcXC9cXC98XFwvXFwvKT8oPzpbXkBcXG5dK0ApPyg/Ond3d1xcLik/KFteXFxuXSspL2lcbiAgY29uc3QgaG9zdCA9IHJlZ2V4LmV4ZWModXJsKVsxXVxuICBjb25zdCBzb2NrZXRQcm90b2NvbCA9IC9eaHR0cDpcXC9cXC8vaS50ZXN0KHVybCkgPyAnd3MnIDogJ3dzcydcblxuICByZXR1cm4gYCR7c29ja2V0UHJvdG9jb2x9Oi8vJHtob3N0fWBcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U3BlZWQgKGZpbGVQcm9ncmVzcykge1xuICBpZiAoIWZpbGVQcm9ncmVzcy5ieXRlc1VwbG9hZGVkKSByZXR1cm4gMFxuXG4gIGNvbnN0IHRpbWVFbGFwc2VkID0gRGF0ZS5ub3coKSAtIGZpbGVQcm9ncmVzcy51cGxvYWRTdGFydGVkXG4gIGNvbnN0IHVwbG9hZFNwZWVkID0gZmlsZVByb2dyZXNzLmJ5dGVzVXBsb2FkZWQgLyAodGltZUVsYXBzZWQgLyAxMDAwKVxuICByZXR1cm4gdXBsb2FkU3BlZWRcbn1cbiIsIi8qKlxuICogR2V0IHRoZSBkZWNsYXJlZCB0ZXh0IGRpcmVjdGlvbiBmb3IgYW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IGVsZW1lbnRcbiAqIEByZXR1cm5zIHtzdHJpbmd8dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIGdldFRleHREaXJlY3Rpb24gKGVsZW1lbnQpIHtcbiAgLy8gVGhlcmUgaXMgYW5vdGhlciB3YXkgdG8gZGV0ZXJtaW5lIHRleHQgZGlyZWN0aW9uIHVzaW5nIGdldENvbXB1dGVkU3R5bGUoKSwgYXMgZG9uZSBoZXJlOlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGVuY2lsLWpzL3RleHQtZGlyZWN0aW9uL2Jsb2IvMmEyMzVjZTk1MDg5YjMxODVhY2VjM2I1MTMxM2NiYmE5MjFiMzgxMS90ZXh0LWRpcmVjdGlvbi5qc1xuICAvL1xuICAvLyBXZSBkbyBub3QgdXNlIHRoYXQgYXBwcm9hY2ggYmVjYXVzZSB3ZSBhcmUgaW50ZXJlc3RlZCBzcGVjaWZpY2FsbHkgaW4gdGhlIF9kZWNsYXJlZF8gdGV4dCBkaXJlY3Rpb24uXG4gIC8vIElmIG5vIHRleHQgZGlyZWN0aW9uIGlzIGRlY2xhcmVkLCB3ZSBoYXZlIHRvIHByb3ZpZGUgb3VyIG93biBleHBsaWNpdCB0ZXh0IGRpcmVjdGlvbiBzbyBvdXJcbiAgLy8gYmlkaXJlY3Rpb25hbCBDU1Mgc3R5bGUgc2hlZXRzIHdvcmsuXG4gIHdoaWxlIChlbGVtZW50ICYmICFlbGVtZW50LmRpcikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgfVxuICByZXR1cm4gZWxlbWVudD8uZGlyXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGV4dERpcmVjdGlvblxuIiwiLyoqXG4gKiBBZGRzIHplcm8gdG8gc3RyaW5ncyBzaG9ydGVyIHRoYW4gdHdvIGNoYXJhY3RlcnMuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IG51bWJlclxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gcGFkIChudW1iZXIpIHtcbiAgcmV0dXJuIG51bWJlciA8IDEwID8gYDAke251bWJlcn1gIDogbnVtYmVyLnRvU3RyaW5nKClcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgdGltZXN0YW1wIGluIHRoZSBmb3JtYXQgb2YgYGhvdXJzOm1pbnV0ZXM6c2Vjb25kc2BcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRUaW1lU3RhbXAgKCkge1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUoKVxuICBjb25zdCBob3VycyA9IHBhZChkYXRlLmdldEhvdXJzKCkpXG4gIGNvbnN0IG1pbnV0ZXMgPSBwYWQoZGF0ZS5nZXRNaW51dGVzKCkpXG4gIGNvbnN0IHNlY29uZHMgPSBwYWQoZGF0ZS5nZXRTZWNvbmRzKCkpXG4gIHJldHVybiBgJHtob3Vyc306JHttaW51dGVzfToke3NlY29uZHN9YFxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoYXMgKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpXG59XG4iLCIvKipcbiAqIENoZWNrIGlmIGFuIG9iamVjdCBpcyBhIERPTSBlbGVtZW50LiBEdWNrLXR5cGluZyBiYXNlZCBvbiBgbm9kZVR5cGVgLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNET01FbGVtZW50IChvYmopIHtcbiAgcmV0dXJuIG9iaj8ubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFXG59XG4iLCJmdW5jdGlvbiBpc05ldHdvcmtFcnJvciAoeGhyKSB7XG4gIGlmICgheGhyKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuICh4aHIucmVhZHlTdGF0ZSAhPT0gMCAmJiB4aHIucmVhZHlTdGF0ZSAhPT0gNCkgfHwgeGhyLnN0YXR1cyA9PT0gMFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTmV0d29ya0Vycm9yXG4iLCIvLyBfX19XaHkgbm90IGFkZCB0aGUgbWltZS10eXBlcyBwYWNrYWdlP1xuLy8gICAgSXQncyAxOS43a0IgZ3ppcHBlZCwgYW5kIHdlIG9ubHkgbmVlZCBtaW1lIHR5cGVzIGZvciB3ZWxsLWtub3duIGV4dGVuc2lvbnMgKGZvciBmaWxlIHByZXZpZXdzKS5cbi8vIF9fX1doZXJlIHRvIHRha2UgbmV3IGV4dGVuc2lvbnMgZnJvbT9cbi8vICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9qc2h0dHAvbWltZS1kYi9ibG9iL21hc3Rlci9kYi5qc29uXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZDogJ3RleHQvbWFya2Rvd24nLFxuICBtYXJrZG93bjogJ3RleHQvbWFya2Rvd24nLFxuICBtcDQ6ICd2aWRlby9tcDQnLFxuICBtcDM6ICdhdWRpby9tcDMnLFxuICBzdmc6ICdpbWFnZS9zdmcreG1sJyxcbiAganBnOiAnaW1hZ2UvanBlZycsXG4gIHBuZzogJ2ltYWdlL3BuZycsXG4gIGdpZjogJ2ltYWdlL2dpZicsXG4gIGhlaWM6ICdpbWFnZS9oZWljJyxcbiAgaGVpZjogJ2ltYWdlL2hlaWYnLFxuICB5YW1sOiAndGV4dC95YW1sJyxcbiAgeW1sOiAndGV4dC95YW1sJyxcbiAgY3N2OiAndGV4dC9jc3YnLFxuICB0c3Y6ICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJyxcbiAgdGFiOiAndGV4dC90YWItc2VwYXJhdGVkLXZhbHVlcycsXG4gIGF2aTogJ3ZpZGVvL3gtbXN2aWRlbycsXG4gIG1rczogJ3ZpZGVvL3gtbWF0cm9za2EnLFxuICBta3Y6ICd2aWRlby94LW1hdHJvc2thJyxcbiAgbW92OiAndmlkZW8vcXVpY2t0aW1lJyxcbiAgZG9jOiAnYXBwbGljYXRpb24vbXN3b3JkJyxcbiAgZG9jbTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy13b3JkLmRvY3VtZW50Lm1hY3JvZW5hYmxlZC4xMicsXG4gIGRvY3g6ICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudCcsXG4gIGRvdDogJ2FwcGxpY2F0aW9uL21zd29yZCcsXG4gIGRvdG06ICdhcHBsaWNhdGlvbi92bmQubXMtd29yZC50ZW1wbGF0ZS5tYWNyb2VuYWJsZWQuMTInLFxuICBkb3R4OiAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwudGVtcGxhdGUnLFxuICB4bGE6ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICB4bGFtOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLmFkZGluLm1hY3JvZW5hYmxlZC4xMicsXG4gIHhsYzogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gIHhsZjogJ2FwcGxpY2F0aW9uL3gteGxpZmYreG1sJyxcbiAgeGxtOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgeGxzOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgeGxzYjogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5iaW5hcnkubWFjcm9lbmFibGVkLjEyJyxcbiAgeGxzbTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5tYWNyb2VuYWJsZWQuMTInLFxuICB4bHN4OiAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXQnLFxuICB4bHQ6ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICB4bHRtOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnRlbXBsYXRlLm1hY3JvZW5hYmxlZC4xMicsXG4gIHhsdHg6ICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC50ZW1wbGF0ZScsXG4gIHhsdzogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gIHR4dDogJ3RleHQvcGxhaW4nLFxuICB0ZXh0OiAndGV4dC9wbGFpbicsXG4gIGNvbmY6ICd0ZXh0L3BsYWluJyxcbiAgbG9nOiAndGV4dC9wbGFpbicsXG4gIHBkZjogJ2FwcGxpY2F0aW9uL3BkZicsXG4gIHppcDogJ2FwcGxpY2F0aW9uL3ppcCcsXG4gICc3eic6ICdhcHBsaWNhdGlvbi94LTd6LWNvbXByZXNzZWQnLFxuICByYXI6ICdhcHBsaWNhdGlvbi94LXJhci1jb21wcmVzc2VkJyxcbiAgdGFyOiAnYXBwbGljYXRpb24veC10YXInLFxuICBnejogJ2FwcGxpY2F0aW9uL2d6aXAnLFxuICBkbWc6ICdhcHBsaWNhdGlvbi94LWFwcGxlLWRpc2tpbWFnZScsXG59XG4iLCJjb25zdCBzZWNvbmRzVG9UaW1lID0gcmVxdWlyZSgnLi9zZWNvbmRzVG9UaW1lJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwcmV0dHlFVEEgKHNlY29uZHMpIHtcbiAgY29uc3QgdGltZSA9IHNlY29uZHNUb1RpbWUoc2Vjb25kcylcblxuICAvLyBPbmx5IGRpc3BsYXkgaG91cnMgYW5kIG1pbnV0ZXMgaWYgdGhleSBhcmUgZ3JlYXRlciB0aGFuIDAgYnV0IGFsd2F5c1xuICAvLyBkaXNwbGF5IG1pbnV0ZXMgaWYgaG91cnMgaXMgYmVpbmcgZGlzcGxheWVkXG4gIC8vIERpc3BsYXkgYSBsZWFkaW5nIHplcm8gaWYgdGhlIHRoZXJlIGlzIGEgcHJlY2VkaW5nIHVuaXQ6IDFtIDA1cywgYnV0IDVzXG4gIGNvbnN0IGhvdXJzU3RyID0gdGltZS5ob3VycyA9PT0gMCA/ICcnIDogYCR7dGltZS5ob3Vyc31oYFxuICBjb25zdCBtaW51dGVzU3RyID0gdGltZS5taW51dGVzID09PSAwID8gJycgOiBgJHt0aW1lLmhvdXJzID09PSAwID8gdGltZS5taW51dGVzIDogYCAke3RpbWUubWludXRlcy50b1N0cmluZygxMCkucGFkU3RhcnQoMiwgJzAnKX1gfW1gXG4gIGNvbnN0IHNlY29uZHNTdHIgPSB0aW1lLmhvdXJzICE9PSAwID8gJycgOiBgJHt0aW1lLm1pbnV0ZXMgPT09IDAgPyB0aW1lLnNlY29uZHMgOiBgICR7dGltZS5zZWNvbmRzLnRvU3RyaW5nKDEwKS5wYWRTdGFydCgyLCAnMCcpfWB9c2BcblxuICByZXR1cm4gYCR7aG91cnNTdHJ9JHttaW51dGVzU3RyfSR7c2Vjb25kc1N0cn1gXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNlY29uZHNUb1RpbWUgKHJhd1NlY29uZHMpIHtcbiAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKHJhd1NlY29uZHMgLyAzNjAwKSAlIDI0XG4gIGNvbnN0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHJhd1NlY29uZHMgLyA2MCkgJSA2MFxuICBjb25zdCBzZWNvbmRzID0gTWF0aC5mbG9vcihyYXdTZWNvbmRzICUgNjApXG5cbiAgcmV0dXJuIHsgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUgKHByb21pc2VzKSB7XG4gIGNvbnN0IHJlc29sdXRpb25zID0gW11cbiAgY29uc3QgcmVqZWN0aW9ucyA9IFtdXG4gIGZ1bmN0aW9uIHJlc29sdmVkICh2YWx1ZSkge1xuICAgIHJlc29sdXRpb25zLnB1c2godmFsdWUpXG4gIH1cbiAgZnVuY3Rpb24gcmVqZWN0ZWQgKGVycm9yKSB7XG4gICAgcmVqZWN0aW9ucy5wdXNoKGVycm9yKVxuICB9XG5cbiAgY29uc3Qgd2FpdCA9IFByb21pc2UuYWxsKFxuICAgIHByb21pc2VzLm1hcCgocHJvbWlzZSkgPT4gcHJvbWlzZS50aGVuKHJlc29sdmVkLCByZWplY3RlZCkpXG4gIClcblxuICByZXR1cm4gd2FpdC50aGVuKCgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2Vzc2Z1bDogcmVzb2x1dGlvbnMsXG4gICAgICBmYWlsZWQ6IHJlamVjdGlvbnMsXG4gICAgfVxuICB9KVxufVxuIiwiLyoqXG4gKiBDb252ZXJ0cyBsaXN0IGludG8gYXJyYXlcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5mcm9tXG4iLCJjb25zdCBVcHB5ID0gcmVxdWlyZSgnQHVwcHkvY29yZScpXG5jb25zdCBGaWxlSW5wdXQgPSByZXF1aXJlKCdAdXBweS9maWxlLWlucHV0JylcbmNvbnN0IFN0YXR1c0JhciA9IHJlcXVpcmUoJ0B1cHB5L3N0YXR1cy1iYXInKVxuY29uc3QgVHVzID0gcmVxdWlyZSgnQHVwcHkvdHVzJylcblxuY29uc3QgdXBweU9uZSA9IG5ldyBVcHB5KHtkZWJ1ZzogdHJ1ZSwgYXV0b1Byb2NlZWQ6IHRydWV9KVxudXBweU9uZVxuICAudXNlKEZpbGVJbnB1dCwgeyB0YXJnZXQ6ICcuVXBweUlucHV0JywgcHJldHR5OiBmYWxzZSB9KVxuICAudXNlKFR1cywgeyBlbmRwb2ludDogJ2h0dHBzOi8vdHVzZC50dXNkZW1vLm5ldC9maWxlcy8nIH0pXG4gIC51c2UoU3RhdHVzQmFyLCB7XG4gICAgdGFyZ2V0OiAnLlVwcHlJbnB1dC1Qcm9ncmVzcycsXG4gICAgaGlkZVVwbG9hZEJ1dHRvbjogdHJ1ZSxcbiAgICBoaWRlQWZ0ZXJGaW5pc2g6IGZhbHNlXG4gIH0pXG4iXX0=
