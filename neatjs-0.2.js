/**
 * NeatJS is a tiny javascript framework which implements the most useful
 * shortcuts you used to use with jQuery
 *
 * @package NeatJS
 *
 * @version 0.2
 * @copyright 2013-2014, NeatJS
 *
 **/
"use strict";
var NeatID = 1;
var NeatJS = (function () {

    function NeatJS(elementSelector) {
        this.NeatID = NeatID++;
        return this.$(elementSelector);
    }

    var magicElementsMethods = [
        'toggleClass',
        'addClass',
        'removeClass',
        'hasClass',
        'text',
        'attr',
        'data',
        'html',
        'addEventListener'
    ];
    for(var i= 0, l=magicElementsMethods.length; i<l; i++) {
        var method = magicElementsMethods[i];
        NeatJS.prototype[method] = function(fn) {
            return function() {
                var params = Array.prototype.slice.call(arguments, 0);
                return this._callElementFunction(fn, params);
            }
        }(magicElementsMethods[i]);
    }

    NeatJS.prototype.$ = function(elementSelector) {
        if (!elementSelector) return null;

        var context =  this._element || document;
        this._elements = [];
        if (elementSelector instanceof Element) {
            this._elements = [elementSelector];
        } else if (typeof elementSelector === 'string') {
            if (elementSelector[0] === '#') {
                this._elements = [context.getElementById(elementSelector.substr(1))];
            } else if (elementSelector[0] === '.') {
                var tmp = context.getElementsByClassName(elementSelector.substr(1).replace('.', ' '));
                for (var ti = 0; ti < tmp.length; ti++) {
                    this._elements.push(tmp[ti]);
                }
                ti = null;
                tmp = null;
            } else {
                this._elements = context.getElementsByTagName(elementSelector);
            }
        }
        this._element = this._elements[0];
        return this;
    }

    NeatJS.prototype._callElementFunction = function(fn, params) {
        var res = [];
        for(var j= 0, n = this._elements.length; j < n; j++) {
            res.push(this._elements[j][fn].apply(this._elements[j], params));
        }
        return (res.length == 1)  ? (res[0] instanceof Element ? this : res[0]) : this;
    }
    NeatJS.prototype.click = function(callback) {
        for(var i= 0, l = this._elements.length; i < l; i++) {
            this._elements[i].addEventListener('click', callback);
        }
        return this;
    }
    NeatJS.prototype.append = function(element) {
        this._element.appendChild(element instanceof NeatJS ? element.getElement() : element);
        return this;
    }
    NeatJS.prototype.prepend = function(element) {
        element.insertBefore(this._element.firstChild);
        return this;
    }
    NeatJS.prototype.remove = function() {
        while (this._elements.length) {
            this._elements[0].remove();
        }
        return this;
    }
    NeatJS.prototype.dispose = function() {
        this._element.parentNode.removeChild(this._element);
        return this;
    }
    NeatJS.prototype.getElement = function() {
        return this._element;
    }
    NeatJS.prototype.length = function() {
        return this._elements.length;
    };
    NeatJS.prototype.getParent = function() {
        var parent = this._element.parentNode;
        return parent && parent.nodeType !== 11 ? parent : null;
    }

    return NeatJS;
})();


if (!Element.prototype.toggleClass) {
    Element.prototype.toggleClass = function(className) {
        var currentClassName = this.className;
        if (currentClassName.indexOf(className) !== -1) {
            this.className = currentClassName.replace(className, '').trim();
        } else {
            this.className += ' ' + className;
        }
        return this;
    }
    Element.prototype.addClass = function(className) {
        var currentClassName = this.className;
        if (currentClassName.indexOf(className) === -1) {
            this.className += ' ' + className;
        }
        return this;
    }
    Element.prototype.removeClass = function(className) {
        var currentClassName = this.className;
        if (currentClassName.indexOf(className) !== -1) {
            currentClassName = currentClassName.replace(className, '').trim();
        }
        this.className = currentClassName;
        return this;
    }
    Element.prototype.hasClass = function(className) {
        return (this.className.indexOf(className) !== -1);
    }
    Element.prototype.text = function(text) {
        return (this.innerText = text);
    }
    Element.prototype.html = function(html) {
        return (this.innerHTML = html);
    }
    Element.prototype.attr = function(attributeName, value) {
        attributeName = attributeName.toLowerCase();

        if (value) {
            if (this.setAttribute) {
                this.setAttribute(attributeName, value);
            } else {
                this[attributeName] = value;
            }
        }
        // Set document vars if needed
        if ( ( this.ownerDocument || this ) !== document ) {
            alert('Need to use http://sizzlejs.com :)');
        }
        var val;
        var res = ((val = this.getAttributeNode( attributeName ))
            || this.getAttribute( attributeName ) ) && this[ attributeName ] === true ?
            attributeName : val && val.specified ? val.value : null;


        return value ? this : res;

    }
    Element.prototype.data = function(attributeDataName, value) {
        return this.attr('data-' + attributeDataName, value);
    }
}

if (!Element.prototype.addEventListener) {
    Element.prototype.addEventListener = function(event, handler) { this.attachEvent("on"+event, handler); }
}

if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault = function() {
        this.returnValue = false;
    }
}
String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};

String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};



window.$ = function(selector) {
    return new NeatJS(selector);
}
window.$.request = function (options) {

    var _options = {
        'method'    : 'POST',
        'url'       : '/',
        'query'     : '',
        'success'   : null
    };

    if (options) {
        for(var i in options) {
            if (_options[i] !== undefined) {
                _options[i] = options[i];
            }
        }
    }

    var r = new XMLHttpRequest();
    r.open(_options.method, _options.url, true);

    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;
        if (_options.success) {
            _options.success(r.responseText);
        }
    };
    r.send(_options.query);

}