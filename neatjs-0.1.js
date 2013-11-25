/**
 * NeatJS is a tiny javascript framework which implements the most useful
 * shortcuts you used to use with jQuery
 *
 * @package NeatJS
 *
 * @version 0.1
 * @copyright 2013-2014, NeatJS
 *
 **/
var NeatJS = (function () {

    var magicElementsMethods = [
        'toggleClass',
        'addClass',
        'removeClass',
        'hasClass',
        'text'
    ];

    var magicListenersMethods = [
        'click',
        'change'
    ];

    function NeatJS(elementSelector) {
        if (!elementSelector) return null;
        if (elementSelector instanceof Element) {
            this._elements = [elementSelector];
        } else if (typeof elementSelector == 'string') {
            if (elementSelector[0] == '#') {
                this._elements = [document.getElementById(elementSelector.substr(1))];
            } else if (elementSelector[0] == '.') {
                this._elements = document.getElementsByClassName(elementSelector.substr(1).replace('.', ' '));
            } else {
                this._elements = document.getElementsByTagName(elementSelector);
            }
        }
        this._element = this._elements[0];
        for(var i= 0, l=magicElementsMethods.length; i<l; i++) {
            var method = magicElementsMethods[i];
            NeatJS.prototype[magicElementsMethods[i]] = function(fn) {
                return function(params) {
                    for(var j= 0, n = this._elements.length; j < n; j++) {
                        this._elements[j][fn](params);
                    }
                    return this;
                }
            }(method);
        }

    }

    NeatJS.prototype.callElementFunction = function(fn, params) {
        for(var j= 0, n = this._elements.length; j < n; j++) {
            this._elements[j][fn](params);
        }
        return this;
    }
    NeatJS.prototype.addEventListener = function(eventName, callback) {
        for(var j= 0, n = this._elements.length; j < n; j++) {
            this._elements[j].addEventListener(eventName, callback);
        }
    }

    NeatJS.prototype.click = function(callback) {
        for(var i= 0, l = this._elements.length; i < l; i++) {
            this._elements[i].addEventListener('click', callback);
        }
        return this;
    }
    NeatJS.prototype.attr = function(attributeName, value) {
        if (!this._element) return null;

        attributeName = attributeName.toLowerCase();

        if (value) {
            if (this._element.setAttribute) {
                this._element.setAttribute(attributeName, value);
            } else {
                this._element[attributeName] = value;
            }
        }
        var val;

        // Set document vars if needed
        if ( ( this._element.ownerDocument || this._element ) !== document ) {
            alert('Need to use http://sizzlejs.com :)');
        }
        return ( (val = this._element.getAttributeNode( attributeName ))
            || this._element.getAttribute( attributeName ) ) && this._element[ attributeName ] === true ?
            attributeName : val && val.specified ? val.value : null;
    }
    NeatJS.prototype.data = function(attributeDataName, value) {
        return this.attr('data-' + attributeDataName, value);
    }
    NeatJS.prototype.append = function(element) {
        this._element.appendChild(element instanceof NeatJS ? element.getElement() : element);
        return this;
    }
    NeatJS.prototype.prepend = function(element) {
        element.insertBefore(this._element.firstChild);
        return this;
    }
    NeatJS.prototype.dispose = function() {
        this._element.parentNode.removeChild(this._element);
        return this;
    }
    NeatJS.prototype.getElement = function() {
        return this._element;
    }
    NeatJS.prototype.getParent = function() {
        var parent = this._element.parentNode;
        return parent && parent.nodeType !== 11 ? parent : null;
    }

    NeatJS.prototype.log = function() {
        if (this._elements.length == 1) {
            return this._element;
        } else {
            return this._elements;
        }
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
    }
    Element.prototype.addClass = function(className) {
        var currentClassName = this.className;
        if (currentClassName.indexOf(className) === -1) {
            this.className += ' ' + className;
        }
    }
    Element.prototype.removeClass = function(className) {
        var currentClassName = this.className;
        if (currentClassName.indexOf(className) !== -1) {
            this.className = currentClassName.replace(className, '').trim();
        }
    }
    Element.prototype.hasClass = function(className) {
        return (this.className.indexOf(className) !== -1);
    }
    Element.prototype.text = function(text) {
        return (this.innerText = text);
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