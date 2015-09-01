/*global app:true */

app = {};
var tools;
(function (){
    app.utils = {};
    tools = app.utils;
    
    
    app.utils.cloneObject = function (obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        var temp = obj.constructor(); // give temp the original obj's constructor
        for (var key in obj) {
            temp[key] = app.utils.cloneObject(obj[key]);
        }

        return temp;
    };

    app.utils.mergeObjects = function(obj1,obj2){
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    };

    app.utils.extend = function(childObj, parentObj) {
        var Func = function() { };
        Func.prototype = parentObj.prototype;
        childObj.prototype = new Func();
        childObj.prototype.constructor = childObj;
        childObj.superclass = parentObj.prototype;
    };

	app.utils.padLeft = function (str, len, char) {
		return ((len = len - str.length) > 0 ? Array(len + 1).join(char||" ") : "") + str;
	}

    app.utils.getUniqueId = function() {
        var getStamp = function(){
                return "_" + (new Date() * 1).toString(32);
            },
            padLeft = function (str, len, char) {
                return ((len = len - str.length) > 0 ? Array(len + 1).join(char||" ") : "") + str;
            },
            pk = getStamp(), pkn = 0;
        return function(){
            if (pkn > 999){
                pkn = 0;
                pk = getStamp();
            }
            return pk + padLeft((++pkn).toString(32), 3, "0");
        };
    }();
    app.utils.trim = function(str) {
        return str.replace(/^\s+|\s+$/g, '');
    };
    
    app.utils.capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    app.utils.format = function (){
        var pattern = /\{\d+\}/g;
        var str = arguments[0];
        [].shift.apply(arguments);
        var args = arguments;
        return str.replace(pattern, function(capture){ return args[capture.match(/\d+/)]; });
    }
    
    function getDom(el) {
        if (typeof(el) == "string") {
            el = document.getElementById(el);
        }
        return (el instanceof HTMLElement || el == window) ? el : null;
    }
	
	app.utils.getElement = getDom;
	
	app.utils.remove =  function(element) {
		if ((element = getDom(element)) && element.parentNode) {
			element.parentNode.removeChild(element);
			return true;
		}
	};

	app.utils.append =  function(element, child) {
		if (element = getDom(element)) {
			if (typeof (child) == 'string'){
				element.insertAdjacentHTML("beforeEnd", child);
			} else if (child = getDom(child)){
				element.appendChild(child);
			}
		}
	};
	
    app.utils.setStyle = function(element, cssProp, value){
        if(element = getDom(element)) {
            element.style[cssProp] = value;
        }
        return element;
    };
    app.utils.getStyle = function (element, property) {
        var css = null;

        if(element.currentStyle) {
            css = element.currentStyle[property];
        } else if(window.getComputedStyle) {
            css = document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
        }

        return css;
    };
    app.utils.getStylePropertyName = function(){
        var properties = {};
        return function(element, propName){
            var res, elementPropList, resProp;
            if (properties[propName]){
                res = properties[propName];
            } else {
                element = getDom(element);
                elementPropList = document.defaultView.getComputedStyle(element, null);
                resProp = [].filter.call(elementPropList, function(el){return el == propName || (el == "-webkit-" + propName) || (el == "-moz-" + propName)})
                if (resProp.length){
                    res = properties[propName] = resProp[0];
                }
            }
            return res;
        }
    }();

	app.utils.hasClass = function(element, className) {
        element = getDom(element)
		return element && element.classList.contains(className);
	},
	app.utils.addClass = function(element, className) {
		(element = getDom(element)) && element.classList.add(className);
	},
	app.utils.removeClass = function(element, className) {
		(element = getDom(element)) && element.classList.remove(className);
	},
    app.utils.switchClass = function(element, className, condition) {
		if (element = getDom(element)) {
            if (condition){
                tools.addClass(element, className)
            }else{
                tools.removeClass(element, className);
            }
        }
	},
    app.utils.toggle = function(element, className) {
		return (element = getDom(element)) && element.classList.toggle(className);
	}

    app.utils.getParent = function(startElement, condition, lastElement){
        if (startElement = getDom(startElement)) {
            if (condition) {
                if (!lastElement || !(lastElement = getDom(lastElement))) {
                    lastElement = document.body;
                }
                for (; startElement && startElement != lastElement; startElement = startElement.parentNode) {
                    if (condition(startElement)) {
                        return startElement;
                    }
                }
            } else {
                return startElement.parentNode;
            }
        }
    };
    
    app.utils.getParents = function(startElement, condition, lastElement){
        var res = [];
        if (startElement = getDom(startElement)) {
            if (!lastElement || !(lastElement = getDom(lastElement))) {
                lastElement = document.body;
            }
            for (; startElement && startElement != lastElement; startElement = startElement.parentNode) {
                if (condition(startElement)) {
                    res.push(startElement);
                }
            }
        }
        return res;
    };
    
    app.utils.applyTemplate = function(templateId, data){
        return doT.template(getDom(templateId).textContent)(data);
    };
    app.utils.cancelEvent = function(ev){
        ev.stopPropagation();
        ev.preventDefault();
    }
	app.utils.sendAjax = function(url, method, data, callback){
        var ajaxRequest = getXmlHttp(),
            prop,
            tmp_data;

        ajaxRequest.onreadystatechange = function() {
            if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {

                if (callback) {
                    return callback(ajaxRequest.responseText);
                }
            }
        };
        
        if (data && typeof(data) == 'object' && !(data instanceof FormData)){
            tmp_data = [];
            for(prop in data){
                tmp_data.push(prop + "=" + encodeURIComponent((typeof data[prop] == "string") ? data[prop] : JSON.stringify(data[prop])));
            }
            data = tmp_data.join("&");
        }

        if (method === "POST" || method === "PUT") {
            ajaxRequest.open(method, url, true);
            !(data instanceof FormData) && ajaxRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
            ajaxRequest.send(data);
        } else {
            data = (data ? data + "&" : "") + "ts="+ (new Date())*1;
            ajaxRequest.open(method, url + "?" + data, true);
            ajaxRequest.send("");
        }
    };
})();
