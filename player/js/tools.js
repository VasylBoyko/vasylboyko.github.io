/*jslint browser:true */
/*global HTMLElement:true, doT:true */
var tools = {};

(function () {
    'use strict';
    tools.cloneObject = function (obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        var temp = obj.constructor(), // give temp the original obj's constructor
            key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                temp[key] = tools.cloneObject(obj[key]);
            }
        }

        return temp;
    };

    tools.mergeObjects = function (obj1, obj2) {
        var obj3 = {},
            attrName;

        for (attrName in obj1) {
            if (obj1.hasOwnProperty(attrName)) {
                obj3[attrName] = obj1[attrName];
            }
        }
        for (attrName in obj2) {
            if (obj2.hasOwnProperty(attrName)) {
                obj3[attrName] = obj2[attrName];
            }
        }
        return obj3;
    };

    tools.setProperties = function (obj, properties) {
        var formattedPropertiesList = tools.formattingOrderOfProperties(obj.constructor.orderImportProperties, Object.keys(properties));

        formattedPropertiesList.forEach(function (prop) {
            if (Object.keys(obj).indexOf(prop) !== -1) {
                obj[prop] = properties[prop];
            }
        });
    };

    tools.formattingOrderOfProperties = function (control, json) {
        var tmp;
        if (!control) {
            tmp = json;
        } else {
            tmp = [];
            control.forEach(function (el) {
                if (json.indexOf(el) !== -1) {
                    tmp.push(el);
                }
            });
            json.forEach(function (el) {
                if (tmp.indexOf(el) === -1) {
                    tmp.push(el);
                }
            });
        }
        return tmp;
    };

    tools.getJSON = (function () {
        var getJSON = function (obj) {
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }
            var temp = obj instanceof Array ? [] : {},
                ignorePropertiesRegexp = new RegExp("^[_$]");

            Object.keys(obj).forEach(function (key) {
                if (!ignorePropertiesRegexp.test(key)) {
                    temp[key] = getJSON(obj[key]);
                }
            });

            return temp;
        };
        return getJSON;
    }());

    tools.extend = function(childObj, parentObj) {
        /** @constructor */
        var Func = function() { };
        Func.prototype = parentObj.prototype;
        childObj.prototype = new Func();
        childObj.prototype.constructor = childObj;
        childObj.superclass = parentObj.prototype;
    };

    tools.getUniqueId = (function () {
        var getStamp = function () {
                return "_" + ((new Date()).valueOf()).toString(32);
            },
            padLeft = function (str, len, charCode) {
                return ((len = len - str.length) > 0 ? Array(len + 1).join(charCode||" ") : "") + str;
            },
            pk = getStamp(), pkn = 0;
        return function () {
            if (pkn > 999) {
                pkn = 0;
                pk = getStamp();
            }
            return pk + padLeft((++pkn).toString(32), 3, "0");
        };
    }());

    /**
      * @param {string} prefix
      * @param {Array|Object} existingIndexes
      * @param {string=} delimiter
      * @param {string=} ending
      */
    tools.generateName = function (prefix, existingIndexes /*object!*/, delimiter, ending) {
        var i = 1;
        delimiter = delimiter || "_";
        ending = ending || "";
        while (i) {
            if (!existingIndexes[i]){
                return prefix + delimiter + i + ending;
            }
            i++;
        }
    };

    /**
      * @param {string} str
      */
    tools.trim = function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    };

    /**
      * @param {string} string
      */
    tools.capitalize = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    /** @type {function(...[*])} */
    tools.format = function (){
        var pattern = /\{\d+\}/g,
            str = arguments[0],
            args;

        [].shift.apply(arguments);
        args = arguments;
        return str.replace(pattern, function (capture) { return args[capture.match(/\d+/)]; });
    };

    /**
      * @param {string|Object} element
      */
    function getDom(element) {
        if (typeof element === "string") {
            element = document.getElementById(element);
        }
        return (element instanceof HTMLElement || element === window) ? element : null;
    }

	tools.getElement = getDom;

    /**
      * @param {string|Object} element
      */
	tools.remove =  function (element) {
        element = getDom(element);
		if (element && element.parentNode) {
			element.parentNode.removeChild(element);
			return true;
		}
	};

    /**
      * @param {string|Object} element
      * @param {string|Object} child
      */
    tools.append =  function(element, child) {
        element = getDom(element);
        if (element) {
            if (typeof child === 'string') {
                element.insertAdjacentHTML("beforeEnd", child);
            }
            else {
                child = getDom(child);
                if (child) {
                    element.appendChild(child);
                }
            }
        }
    };

    tools.prepend = function(element, child) {
        element = getDom(element);
        if (element) {
            if (typeof child === 'string') {
                element.insertAdjacentHTML("afterBegin", child);
            } else {
                child = getDom(child);
                if (child) {
                    element.insertBefore(child, element.firstChild);
                }
            }
        }
    };

    tools.insertAfter = function (referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };

    /** @param {boolean=} checkPropName */
    tools.setStyle = function (element, cssProp, value, checkPropName) {
        element = getDom(element);
        if (element) {
            if (checkPropName) {
                cssProp = tools.getStylePropertyName(element, cssProp);
            }
            element.style[cssProp] = value;
        }
        return element;
    };

    /**
      * @param {string|Object} element
      * @param {string} property
      */
    tools.getStyle = function (element, property) {
        var css = null;

        element = getDom(element);
        if (element) {
            if (element.currentStyle) {
                css = element.currentStyle[property];
            } else if (window.getComputedStyle) {
                css = document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
            }
        }
        return css;
    };

    tools.getStylePropertyName = (function () {
        var properties = {};
        return function(element, propName){
            var res, elementPropList, resProp;
            if (properties[propName]){
                res = properties[propName];
            } else {
                element = getDom(element);
                elementPropList = document.defaultView.getComputedStyle(element, null);
                resProp = [].filter.call(elementPropList, function(el){return el === propName || (el === "-webkit-" + propName) || (el === "-moz-" + propName);});
                if (resProp.length){
                    res = properties[propName] = resProp[0];
                }
            }
            res = res.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
            return res[0].toLowerCase()+res.substr(1);
        };
    }());

    /**
      * @param {string|Object} element
      * @param {string} className
      */
    tools.hasClass = function (element, className) {
        element = getDom(element);
        return element && element.classList.contains(className);
    };

    /**
      * @param {string|Object} element
      * @param {string} className
      */
    tools.addClass = function(element, className) {
        element = getDom(element);
        if (element) {
            element.classList.add(className);   
        }
    };

    /**
      * @param {string|Object} element
      * @param {string} className
      */
    tools.removeClass = function(element, className) {
        element = getDom(element);
        if (element) {
            element.classList.remove(className);   
        }
    };

    /**
      * @param {string|Object} element
      * @param {string} className
      * @param {boolean} condition
      */
    tools.switchClass = function(element, className, condition) {
        element = getDom(element);
        if (element) {
            if (condition) {
                tools.addClass(element, className);
            }
            else {
                tools.removeClass(element, className);
            }
        }
    };

    /**
      * @param {string|Object} element
      * @param {string} className
      */
    tools.toggleClass = function(element, className) {
        element = getDom(element);
        return element && element.classList.toggle(className);
    };

    /**
     * @param {string|Object} startElement
     * @param {Function=} condition
     * @param {string|Object=} lastElement
     */
    tools.getParent = function(startElement, condition, lastElement) {
        startElement = getDom(startElement);

        if (!startElement) {
            return null;
        }

        if (!condition) {
            return startElement.parentNode;
        }

        if (!lastElement || !(lastElement = getDom(lastElement))) {
            lastElement = document.body;
        }

        var result;
        for (result = null; startElement && startElement !== lastElement; startElement = startElement.parentNode) {
            if (condition(startElement)) {
                result = startElement;
                break;
            }
        }
        return result;
    };

    /**
     * @param {string|Object} startElement
     * @param {Function=} condition
     * @param {string|Object=} lastElement
     */
    tools.getParents = function(startElement, condition, lastElement) {
        startElement = getDom(startElement);
        
        if (!startElement) {
            return [];
        }

        if (!lastElement || !(lastElement = getDom(lastElement))) {
            lastElement = document.body;
        }

        var res;

        for (res = []; startElement && startElement !== lastElement; startElement = startElement.parentNode) {
            if (condition(startElement)) {
                res.push(startElement);
            }
        }

        return res;
    };

    /**
     * @param {Array} array1
     * @param {Array} array2
     */
    tools.compareArrays = function (array1, array2) {
        if (array1.length !== array2.length) {
            return false;
        }

        return !array1.some(function (item, index) {
            if (Array.isArray(item) && Array.isArray(array2[index])) {
                return !tools.compareArrays(item, array2[index]);
            }
            
            if (item !== array2[index]) {
                return true;
            }
        });
    };

    /**
     * Converts input Object to Array
     * @param {Object} obj
     * @returns {Array}
     */
    tools.objectToArray = function (obj){
        var list = [],
            key;

        for (key in obj){
            if (obj.hasOwnProperty(key)){
                list.push(obj[key]);
            }
        }

        return list;
    };

    /**
     * Tests whether rect1 entirely contains rect2
     * @param {ClientRect} rect1
     * @param {ClientRect} rect2
     * @returns {boolean}
     */

    (function () {
        var loadedTemplates = {},
            template;

        tools.applyTemplate = function(templateId, data) {
            if (!loadedTemplates[templateId]) {
                loadedTemplates[templateId] = doT.template(getDom(templateId).textContent);
                tools.remove(templateId);
            }

            template = loadedTemplates[templateId];
            return template(data);
        };
    }());
	
	tools.sendAjax = function (url, method, data, callback, type){
        var ajaxRequest = new XMLHttpRequest(),
            prop,
            tmp_data;

        if (!ajaxRequest) {
            console.log("Error: This web browser does not support AJAX, no communication with a server is possible.");
            return;
        }
		if (type) {
			xhr.responseType = type;
		}
        ajaxRequest.onreadystatechange = function() {
            if (ajaxRequest.readyState === 4 && ajaxRequest.status === 200) {

                if (callback) {
                    return callback(ajaxRequest);
                }
            }
        };
        
        if (data && (typeof data === 'object') && !(data instanceof FormData)){
            tmp_data = [];

            Object.keys(data).forEach(function (prop) {
                var value = data[prop];
                tmp_data.push(prop + "=" + encodeURIComponent((typeof value === "string") ? value : JSON.stringify(value)));
            });

            data = tmp_data.join("&");
        }

        if (method === "POST" || method === "PUT") {
            ajaxRequest.open(method, url, true);
            if (!(data instanceof FormData)) {
                ajaxRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');  
            }
            ajaxRequest.send(data);
        }
        else {
            data = (data ? data + "&" : "") /*+ "ts="+ (new Date()).valueOf()*/;
            ajaxRequest.open(method, url+'&e=download&gd=true', true);
            ajaxRequest.setRequestHeader('Authorization', 'Bearer ' + access_token);
            ///ajaxRequest.setRequestHeader('Origin', location.host);  
            
            ajaxRequest.send("");
        }
    }
	
}());
