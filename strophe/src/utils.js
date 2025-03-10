"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCookies = addCookies;
exports.arrayBufToBase64 = arrayBufToBase64;
exports.base64ToArrayBuf = base64ToArrayBuf;
exports.copyElement = copyElement;
exports.createHtml = createHtml;
exports.default = void 0;
exports.escapeNode = escapeNode;
exports.forEachChild = forEachChild;
exports.getBareJidFromJid = getBareJidFromJid;
exports.getDomainFromJid = getDomainFromJid;
exports.getNodeFromJid = getNodeFromJid;
exports.getResourceFromJid = getResourceFromJid;
exports.getText = getText;
exports.isTagEqual = isTagEqual;
exports.serialize = serialize;
exports.stringToArrayBuf = stringToArrayBuf;
exports.unescapeNode = unescapeNode;
exports.utf16to8 = utf16to8;
exports.validAttribute = validAttribute;
exports.validCSS = validCSS;
exports.validTag = validTag;
exports.xmlElement = xmlElement;
exports.xmlGenerator = xmlGenerator;
exports.xmlHtmlNode = xmlHtmlNode;
exports.xmlTextNode = xmlTextNode;
exports.xmlescape = xmlescape;
exports.xmlunescape = xmlunescape;
exports.xorArrayBuffers = xorArrayBuffers;
var _core = _interopRequireDefault(require("./core.js"));
var shims = _interopRequireWildcard(require("./shims.js"));
var _constants = require("./constants.js");
var _builder = _interopRequireDefault(require("./builder.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* global btoa */

/**
 * @param {string} str
 * @return {string}
 */
function utf16to8(str) {
  let out = '';
  const len = str.length;
  for (let i = 0; i < len; i++) {
    const c = str.charCodeAt(i);
    if (c >= 0x0000 && c <= 0x007f) {
      out += str.charAt(i);
    } else if (c > 0x07ff) {
      out += String.fromCharCode(0xe0 | c >> 12 & 0x0f);
      out += String.fromCharCode(0x80 | c >> 6 & 0x3f);
      out += String.fromCharCode(0x80 | c >> 0 & 0x3f);
    } else {
      out += String.fromCharCode(0xc0 | c >> 6 & 0x1f);
      out += String.fromCharCode(0x80 | c >> 0 & 0x3f);
    }
  }
  return out;
}
function xorArrayBuffers(x, y) {
  const xIntArray = new Uint8Array(x);
  const yIntArray = new Uint8Array(y);
  const zIntArray = new Uint8Array(x.byteLength);
  for (let i = 0; i < x.byteLength; i++) {
    zIntArray[i] = xIntArray[i] ^ yIntArray[i];
  }
  return zIntArray.buffer;
}

/**
 * @param {ArrayBufferLike} buffer
 * @return {string}
 */
function arrayBufToBase64(buffer) {
  // This function is due to mobz (https://stackoverflow.com/users/1234628/mobz)
  // and Emmanuel (https://stackoverflow.com/users/288564/emmanuel)
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * @param {string} str
 * @return {ArrayBufferLike}
 */
function base64ToArrayBuf(str) {
  var _Uint8Array$from;
  return (_Uint8Array$from = Uint8Array.from(atob(str), c => c.charCodeAt(0))) === null || _Uint8Array$from === void 0 ? void 0 : _Uint8Array$from.buffer;
}

/**
 * @param {string} str
 * @return {ArrayBufferLike}
 */
function stringToArrayBuf(str) {
  const bytes = new TextEncoder().encode(str);
  return bytes.buffer;
}

/**
 * @param {Cookies} cookies
 */
function addCookies(cookies) {
  if (typeof document === 'undefined') {
    _core.default.log(_core.default.LogLevel.ERROR, `addCookies: not adding any cookies, since there's no document object`);
  }

  /**
   * @typedef {Object.<string, string>} Cookie
   *
   * A map of cookie names to string values or to maps of cookie values.
   * @typedef {Cookie|Object.<string, Cookie>} Cookies
   *
   * For example:
   * { "myCookie": "1234" }
   *
   * or:
   * { "myCookie": {
   *    "value": "1234",
   *    "domain": ".example.org",
   *    "path": "/",
   *    "expires": expirationDate
   *    }
   * }
   *
   * These values get passed to {@link Strophe.Connection} via options.cookies
   */
  cookies = cookies || {};
  for (const cookieName in cookies) {
    if (Object.prototype.hasOwnProperty.call(cookies, cookieName)) {
      let expires = '';
      let domain = '';
      let path = '';
      const cookieObj = cookies[cookieName];
      const isObj = typeof cookieObj === 'object';
      const cookieValue = escape(unescape(isObj ? cookieObj.value : cookieObj));
      if (isObj) {
        expires = cookieObj.expires ? ';expires=' + cookieObj.expires : '';
        domain = cookieObj.domain ? ';domain=' + cookieObj.domain : '';
        path = cookieObj.path ? ';path=' + cookieObj.path : '';
      }
      document.cookie = cookieName + '=' + cookieValue + expires + domain + path;
    }
  }
}
let _xmlGenerator = null;

/**
 * Get the DOM document to generate elements.
 * @return {Document} - The currently used DOM document.
 */
function xmlGenerator() {
  if (!_xmlGenerator) {
    _xmlGenerator = shims.getDummyXMLDOMDocument();
  }
  return _xmlGenerator;
}

/**
 * Creates an XML DOM text node.
 * Provides a cross implementation version of document.createTextNode.
 * @param {string} text - The content of the text node.
 * @return {Text} - A new XML DOM text node.
 */
function xmlTextNode(text) {
  return xmlGenerator().createTextNode(text);
}

/**
 * Creates an XML DOM node.
 * @param {string} html - The content of the html node.
 * @return {XMLDocument}
 */
function xmlHtmlNode(html) {
  const parser = new shims.DOMParser();
  return parser.parseFromString(html, 'text/xml');
}

/**
 * Create an XML DOM element.
 *
 * This function creates an XML DOM element correctly across all
 * implementations. Note that these are not HTML DOM elements, which
 * aren't appropriate for XMPP stanzas.
 *
 * @param {string} name - The name for the element.
 * @param {Array<Array<string>>|Object} [attrs] - An optional array or object containing
 *    key/value pairs to use as element attributes.
 *    The object should be in the format `{'key': 'value'}`.
 *    The array should have the format `[['key1', 'value1'], ['key2', 'value2']]`.
 * @param {string|number} [text] - The text child data for the element.
 *
 * @return {Element} A new XML DOM element.
 */
function xmlElement(name, attrs, text) {
  if (!name) return null;
  const node = xmlGenerator().createElement(name);
  if (text && (typeof text === 'string' || typeof text === 'number')) {
    node.appendChild(xmlTextNode(text.toString()));
  } else if (typeof attrs === 'string' || typeof attrs === 'number') {
    node.appendChild(xmlTextNode(attrs.toString()));
    return node;
  } else if (!attrs) {
    return node;
  }
  if (Array.isArray(attrs)) {
    for (const attr of attrs) {
      if (Array.isArray(attr)) {
        // eslint-disable-next-line no-eq-null
        if (attr[0] != null && attr[1] != null) {
          node.setAttribute(attr[0], attr[1]);
        }
      }
    }
  } else {
    for (const k of Object.keys(attrs)) {
      // eslint-disable-next-line no-eq-null
      if (k && attrs[k] != null) {
        node.setAttribute(k, attrs[k]);
      }
    }
  }
  return node;
}

/**
 * Utility method to determine whether a tag is allowed
 * in the XHTML_IM namespace.
 *
 * XHTML tag names are case sensitive and must be lower case.
 * @method Strophe.XHTML.validTag
 * @param {string} tag
 */
function validTag(tag) {
  for (let i = 0; i < _constants.XHTML.tags.length; i++) {
    if (tag === _constants.XHTML.tags[i]) {
      return true;
    }
  }
  return false;
}

/**
 * Utility method to determine whether an attribute is allowed
 * as recommended per XEP-0071
 *
 * XHTML attribute names are case sensitive and must be lower case.
 * @method Strophe.XHTML.validAttribute
 * @param {string} tag
 * @param {string} attribute
 */
function validAttribute(tag, attribute) {
  if (typeof _constants.XHTML.attributes[tag] !== 'undefined' && _constants.XHTML.attributes[tag].length > 0) {
    for (let i = 0; i < _constants.XHTML.attributes[tag].length; i++) {
      if (attribute === _constants.XHTML.attributes[tag][i]) {
        return true;
      }
    }
  }
  return false;
}

/**
 * @method Strophe.XHTML.validCSS
 * @param {string} style
 */
function validCSS(style) {
  for (let i = 0; i < _constants.XHTML.css.length; i++) {
    if (style === _constants.XHTML.css[i]) {
      return true;
    }
  }
  return false;
}

/**
 * Copy an HTML DOM Element into an XML DOM.
 * This function copies a DOM element and all its descendants and returns
 * the new copy.
 * @method Strophe.createHtml
 * @param {HTMLElement} elem - A DOM element.
 * @return {Node} - A new, copied DOM element tree.
 */
function createFromHtmlElement(elem) {
  let el;
  const tag = elem.nodeName.toLowerCase(); // XHTML tags must be lower case.
  if (validTag(tag)) {
    try {
      el = xmlElement(tag);
      for (let i = 0; i < _constants.XHTML.attributes[tag].length; i++) {
        const attribute = _constants.XHTML.attributes[tag][i];
        let value = elem.getAttribute(attribute);
        if (typeof value === 'undefined' || value === null || value === '') {
          continue;
        }
        if (attribute === 'style' && typeof value === 'object') {
          var _value$cssText;
          value = /** @type {Object} */(_value$cssText = value.cssText) !== null && _value$cssText !== void 0 ? _value$cssText : value; // we're dealing with IE, need to get CSS out
        }

        // filter out invalid css styles
        if (attribute === 'style') {
          const css = [];
          const cssAttrs = value.split(';');
          for (let j = 0; j < cssAttrs.length; j++) {
            const attr = cssAttrs[j].split(':');
            const cssName = attr[0].replace(/^\s*/, '').replace(/\s*$/, '').toLowerCase();
            if (validCSS(cssName)) {
              const cssValue = attr[1].replace(/^\s*/, '').replace(/\s*$/, '');
              css.push(cssName + ': ' + cssValue);
            }
          }
          if (css.length > 0) {
            value = css.join('; ');
            el.setAttribute(attribute, value);
          }
        } else {
          el.setAttribute(attribute, value);
        }
      }
      for (let i = 0; i < elem.childNodes.length; i++) {
        el.appendChild(createHtml(elem.childNodes[i]));
      }
    } catch (e) {
      // invalid elements
      el = xmlTextNode('');
    }
  } else {
    el = xmlGenerator().createDocumentFragment();
    for (let i = 0; i < elem.childNodes.length; i++) {
      el.appendChild(createHtml(elem.childNodes[i]));
    }
  }
  return el;
}

/**
 * Copy an HTML DOM Node into an XML DOM.
 * This function copies a DOM element and all its descendants and returns
 * the new copy.
 * @method Strophe.createHtml
 * @param {Node} node - A DOM element.
 * @return {Node} - A new, copied DOM element tree.
 */
function createHtml(node) {
  if (node.nodeType === _constants.ElementType.NORMAL) {
    return createFromHtmlElement( /** @type {HTMLElement} */node);
  } else if (node.nodeType === _constants.ElementType.FRAGMENT) {
    const el = xmlGenerator().createDocumentFragment();
    for (let i = 0; i < node.childNodes.length; i++) {
      el.appendChild(createHtml(node.childNodes[i]));
    }
    return el;
  } else if (node.nodeType === _constants.ElementType.TEXT) {
    return xmlTextNode(node.nodeValue);
  }
}

/**
 * Copy an XML DOM element.
 *
 * This function copies a DOM element and all its descendants and returns
 * the new copy.
 * @method Strophe.copyElement
 * @param {Node} node - A DOM element.
 * @return {Element|Text} - A new, copied DOM element tree.
 */
function copyElement(node) {
  let out;
  if (node.nodeType === _constants.ElementType.NORMAL) {
    const el = /** @type {Element} */node;
    out = xmlElement(el.tagName);
    for (let i = 0; i < el.attributes.length; i++) {
      out.setAttribute(el.attributes[i].nodeName, el.attributes[i].value);
    }
    for (let i = 0; i < el.childNodes.length; i++) {
      out.appendChild(copyElement(el.childNodes[i]));
    }
  } else if (node.nodeType === _constants.ElementType.TEXT) {
    out = xmlGenerator().createTextNode(node.nodeValue);
  }
  return out;
}

/**
 * Excapes invalid xml characters.
 * @method Strophe.xmlescape
 * @param {string} text - text to escape.
 * @return {string} - Escaped text.
 */
function xmlescape(text) {
  text = text.replace(/\&/g, '&amp;');
  text = text.replace(/</g, '&lt;');
  text = text.replace(/>/g, '&gt;');
  text = text.replace(/'/g, '&apos;');
  text = text.replace(/"/g, '&quot;');
  return text;
}

/**
 * Unexcapes invalid xml characters.
 * @method Strophe.xmlunescape
 * @param {string} text - text to unescape.
 * @return {string} - Unescaped text.
 */
function xmlunescape(text) {
  text = text.replace(/\&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&apos;/g, "'");
  text = text.replace(/&quot;/g, '"');
  return text;
}

/**
 * Render a DOM element and all descendants to a String.
 * @method Strophe.serialize
 * @param {Element|Builder} elem - A DOM element.
 * @return {string} - The serialized element tree as a String.
 */
function serialize(elem) {
  if (!elem) return null;
  const el = elem instanceof _builder.default ? elem.tree() : elem;
  const names = [...Array(el.attributes.length).keys()].map(i => el.attributes[i].nodeName);
  names.sort();
  let result = names.reduce((a, n) => `${a} ${n}="${xmlescape(el.attributes.getNamedItem(n).value)}"`, `<${el.nodeName}`);
  if (el.childNodes.length > 0) {
    result += '>';
    for (let i = 0; i < el.childNodes.length; i++) {
      const child = el.childNodes[i];
      switch (child.nodeType) {
        case _constants.ElementType.NORMAL:
          // normal element, so recurse
          result += serialize( /** @type {Element} */child);
          break;
        case _constants.ElementType.TEXT:
          // text element to escape values
          result += xmlescape(child.nodeValue);
          break;
        case _constants.ElementType.CDATA:
          // cdata section so don't escape values
          result += '<![CDATA[' + child.nodeValue + ']]>';
      }
    }
    result += '</' + el.nodeName + '>';
  } else {
    result += '/>';
  }
  return result;
}

/**
 * Map a function over some or all child elements of a given element.
 *
 * This is a small convenience function for mapping a function over
 * some or all of the children of an element.  If elemName is null, all
 * children will be passed to the function, otherwise only children
 * whose tag names match elemName will be passed.
 *
 * @method Strophe.forEachChild
 * @param {Element} elem - The element to operate on.
 * @param {string} elemName - The child element tag name filter.
 * @param {Function} func - The function to apply to each child.  This
 *    function should take a single argument, a DOM element.
 */
function forEachChild(elem, elemName, func) {
  for (let i = 0; i < elem.childNodes.length; i++) {
    const childNode = elem.childNodes[i];
    if (childNode.nodeType === _constants.ElementType.NORMAL && (!elemName || this.isTagEqual(childNode, elemName))) {
      func(childNode);
    }
  }
}

/**
 * Compare an element's tag name with a string.
 * This function is case sensitive.
 * @method Strophe.isTagEqual
 * @param {Element} el - A DOM element.
 * @param {string} name - The element name.
 * @return {boolean}
 *  true if the element's tag name matches _el_, and false
 *  otherwise.
 */
function isTagEqual(el, name) {
  return el.tagName === name;
}

/**
 * Get the concatenation of all text children of an element.
 * @method Strophe.getText
 * @param {Element} elem - A DOM element.
 * @return {string} - A String with the concatenated text of all text element children.
 */
function getText(elem) {
  var _elem$childNodes;
  if (!elem) {
    return null;
  }
  let str = '';
  if (!((_elem$childNodes = elem.childNodes) !== null && _elem$childNodes !== void 0 && _elem$childNodes.length) && elem.nodeType === _constants.ElementType.TEXT) {
    str += elem.nodeValue;
  }
  for (let i = 0; (_ref = i < ((_elem$childNodes2 = elem.childNodes) === null || _elem$childNodes2 === void 0 ? void 0 : _elem$childNodes2.length)) !== null && _ref !== void 0 ? _ref : 0; i++) {
    var _ref, _elem$childNodes2;
    if (elem.childNodes[i].nodeType === _constants.ElementType.TEXT) {
      str += elem.childNodes[i].nodeValue;
    }
  }
  return xmlescape(str);
}

/**
 * Escape the node part (also called local part) of a JID.
 * @method Strophe.escapeNode
 * @param {string} node - A node (or local part).
 * @return {string} An escaped node (or local part).
 */
function escapeNode(node) {
  if (typeof node !== 'string') {
    return node;
  }
  return node.replace(/^\s+|\s+$/g, '').replace(/\\/g, '\\5c').replace(/ /g, '\\20').replace(/\"/g, '\\22').replace(/\&/g, '\\26').replace(/\'/g, '\\27').replace(/\//g, '\\2f').replace(/:/g, '\\3a').replace(/</g, '\\3c').replace(/>/g, '\\3e').replace(/@/g, '\\40');
}

/**
 * Unescape a node part (also called local part) of a JID.
 * @method Strophe.unescapeNode
 * @param {string} node - A node (or local part).
 * @return {string} An unescaped node (or local part).
 */
function unescapeNode(node) {
  if (typeof node !== 'string') {
    return node;
  }
  return node.replace(/\\20/g, ' ').replace(/\\22/g, '"').replace(/\\26/g, '&').replace(/\\27/g, "'").replace(/\\2f/g, '/').replace(/\\3a/g, ':').replace(/\\3c/g, '<').replace(/\\3e/g, '>').replace(/\\40/g, '@').replace(/\\5c/g, '\\');
}

/**
 * Get the node portion of a JID String.
 * @method Strophe.getNodeFromJid
 * @param {string} jid - A JID.
 * @return {string} - A String containing the node.
 */
function getNodeFromJid(jid) {
  if (jid.indexOf('@') < 0) {
    return null;
  }
  return jid.split('@')[0];
}

/**
 * Get the domain portion of a JID String.
 * @method Strophe.getDomainFromJid
 * @param {string} jid - A JID.
 * @return {string} - A String containing the domain.
 */
function getDomainFromJid(jid) {
  const bare = getBareJidFromJid(jid);
  if (bare.indexOf('@') < 0) {
    return bare;
  } else {
    const parts = bare.split('@');
    parts.splice(0, 1);
    return parts.join('@');
  }
}

/**
 * Get the resource portion of a JID String.
 * @method Strophe.getResourceFromJid
 * @param {string} jid - A JID.
 * @return {string} - A String containing the resource.
 */
function getResourceFromJid(jid) {
  if (!jid) {
    return null;
  }
  const s = jid.split('/');
  if (s.length < 2) {
    return null;
  }
  s.splice(0, 1);
  return s.join('/');
}

/**
 * Get the bare JID from a JID String.
 * @method Strophe.getBareJidFromJid
 * @param {string} jid - A JID.
 * @return {string} - A String containing the bare JID.
 */
function getBareJidFromJid(jid) {
  return jid ? jid.split('/')[0] : null;
}
const utils = {
  utf16to8,
  xorArrayBuffers,
  arrayBufToBase64,
  base64ToArrayBuf,
  stringToArrayBuf,
  addCookies
};
exports.default = utils;