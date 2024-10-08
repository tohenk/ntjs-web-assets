import { btoa as btoa$1, atob as atob$1 } from 'abab';

var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};

/*
 * This module provides uniform
 * Shims APIs and globals that are not present in all JS environments,
 * the most common example for Strophe being browser APIs like WebSocket
 * and DOM that don't exist under nodejs.
 *
 * Usually these will be supplied in nodejs by conditionally requiring a
 * NPM module that provides a compatible implementation.
 */

/* global global */

/**
 * WHATWG WebSockets API
 * https://www.w3.org/TR/websockets/
 *
 * Interface to use the web socket protocol
 *
 * Used implementations:
 * - supported browsers: built-in in WebSocket global
 *   https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Browser_compatibility
 * - nodejs: use standard-compliant 'ws' module
 *   https://www.npmjs.com/package/ws
 */
function getWebSocketImplementation() {
  let WebSocketImplementation = global$1.WebSocket;
  if (typeof WebSocketImplementation === 'undefined') {
    try {
      WebSocketImplementation = require('ws');
    } catch (err) {
      throw new Error('You must install the "ws" package to use Strophe in nodejs.');
    }
  }
  return WebSocketImplementation;
}
const WebSocket = getWebSocketImplementation();

/**
 * DOMParser
 * https://w3c.github.io/DOM-Parsing/#the-domparser-interface
 *
 * Interface to parse XML strings into Document objects
 *
 * Used implementations:
 * - supported browsers: built-in in DOMParser global
 *   https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#Browser_compatibility
 * - nodejs: use '@xmldom/xmldom' module
 *   https://www.npmjs.com/package/@xmldom/xmldom
 */
function getDOMParserImplementation() {
  let DOMParserImplementation = global$1.DOMParser;
  if (typeof DOMParserImplementation === 'undefined') {
    try {
      DOMParserImplementation = require('@xmldom/xmldom').DOMParser;
    } catch (err) {
      throw new Error('You must install the "@xmldom/xmldom" package to use Strophe in nodejs.');
    }
  }
  return DOMParserImplementation;
}
const DOMParser = getDOMParserImplementation();

/**
 *  Gets IE xml doc object. Used by getDummyXMLDocument shim.
 *
 *  Returns:
 *    A Microsoft XML DOM Object
 *  See Also:
 *    http://msdn.microsoft.com/en-us/library/ms757837%28VS.85%29.aspx
 */
function _getIEXmlDom() {
  const docStrings = ['Msxml2.DOMDocument.6.0', 'Msxml2.DOMDocument.5.0', 'Msxml2.DOMDocument.4.0', 'MSXML2.DOMDocument.3.0', 'MSXML2.DOMDocument', 'MSXML.DOMDocument', 'Microsoft.XMLDOM'];
  for (let d = 0; d < docStrings.length; d++) {
    try {
      // eslint-disable-next-line no-undef
      const doc = new ActiveXObject(docStrings[d]);
      return doc;
    } catch (e) {
      // Try next one
    }
  }
}

/**
 * Creates a dummy XML DOM document to serve as an element and text node generator.
 *
 * Used implementations:
 *  - IE < 10: avoid using createDocument() due to a memory leak, use ie-specific
 *    workaround
 *  - other supported browsers: use document's createDocument
 *  - nodejs: use '@xmldom/xmldom'
 */
function getDummyXMLDOMDocument() {
  // nodejs
  if (typeof document === 'undefined') {
    try {
      const DOMImplementation = require('@xmldom/xmldom').DOMImplementation;
      return new DOMImplementation().createDocument('jabber:client', 'strophe', null);
    } catch (err) {
      throw new Error('You must install the "@xmldom/xmldom" package to use Strophe in nodejs.');
    }
  }
  // IE < 10
  if (document.implementation.createDocument === undefined || document.implementation.createDocument && document.documentMode && document.documentMode < 10) {
    const doc = _getIEXmlDom();
    doc.appendChild(doc.createElement('strophe'));
    return doc;
  }
  // All other supported browsers
  return document.implementation.createDocument('jabber:client', 'strophe', null);
}

var shims = /*#__PURE__*/Object.freeze({
            __proto__: null,
            WebSocket: WebSocket,
            DOMParser: DOMParser,
            getDummyXMLDOMDocument: getDummyXMLDOMDocument
});

/** Constants: XMPP Namespace Constants
 *  Common namespace constants from the XMPP RFCs and XEPs.
 *
 *  Strophe.NS.HTTPBIND - HTTP BIND namespace from XEP 124.
 *  Strophe.NS.BOSH - BOSH namespace from XEP 206.
 *  Strophe.NS.CLIENT - Main XMPP client namespace.
 *  Strophe.NS.AUTH - Legacy authentication namespace.
 *  Strophe.NS.ROSTER - Roster operations namespace.
 *  Strophe.NS.PROFILE - Profile namespace.
 *  Strophe.NS.DISCO_INFO - Service discovery info namespace from XEP 30.
 *  Strophe.NS.DISCO_ITEMS - Service discovery items namespace from XEP 30.
 *  Strophe.NS.MUC - Multi-User Chat namespace from XEP 45.
 *  Strophe.NS.SASL - XMPP SASL namespace from RFC 3920.
 *  Strophe.NS.STREAM - XMPP Streams namespace from RFC 3920.
 *  Strophe.NS.BIND - XMPP Binding namespace from RFC 3920 and RFC 6120.
 *  Strophe.NS.SESSION - XMPP Session namespace from RFC 3920.
 *  Strophe.NS.XHTML_IM - XHTML-IM namespace from XEP 71.
 *  Strophe.NS.XHTML - XHTML body namespace from XEP 71.
 */
const NS = {
  HTTPBIND: 'http://jabber.org/protocol/httpbind',
  BOSH: 'urn:xmpp:xbosh',
  CLIENT: 'jabber:client',
  AUTH: 'jabber:iq:auth',
  ROSTER: 'jabber:iq:roster',
  PROFILE: 'jabber:iq:profile',
  DISCO_INFO: 'http://jabber.org/protocol/disco#info',
  DISCO_ITEMS: 'http://jabber.org/protocol/disco#items',
  MUC: 'http://jabber.org/protocol/muc',
  SASL: 'urn:ietf:params:xml:ns:xmpp-sasl',
  STREAM: 'http://etherx.jabber.org/streams',
  FRAMING: 'urn:ietf:params:xml:ns:xmpp-framing',
  BIND: 'urn:ietf:params:xml:ns:xmpp-bind',
  SESSION: 'urn:ietf:params:xml:ns:xmpp-session',
  VERSION: 'jabber:iq:version',
  STANZAS: 'urn:ietf:params:xml:ns:xmpp-stanzas',
  XHTML_IM: 'http://jabber.org/protocol/xhtml-im',
  XHTML: 'http://www.w3.org/1999/xhtml'
};

/** Constants: XHTML_IM Namespace
 *  contains allowed tags, tag attributes, and css properties.
 *  Used in the createHtml function to filter incoming html into the allowed XHTML-IM subset.
 *  See http://xmpp.org/extensions/xep-0071.html#profile-summary for the list of recommended
 *  allowed tags and their attributes.
 */
const XHTML = {
  tags: ['a', 'blockquote', 'br', 'cite', 'em', 'img', 'li', 'ol', 'p', 'span', 'strong', 'ul', 'body'],
  attributes: {
    'a': ['href'],
    'blockquote': ['style'],
    'br': [],
    'cite': ['style'],
    'em': [],
    'img': ['src', 'alt', 'style', 'height', 'width'],
    'li': ['style'],
    'ol': ['style'],
    'p': ['style'],
    'span': ['style'],
    'strong': [],
    'ul': ['style'],
    'body': []
  },
  css: ['background-color', 'color', 'font-family', 'font-size', 'font-style', 'font-weight', 'margin-left', 'margin-right', 'text-align', 'text-decoration']
};

/** Constants: Connection Status Constants
 *  Connection status constants for use by the connection handler
 *  callback.
 *
 *  Strophe.Status.ERROR - An error has occurred
 *  Strophe.Status.CONNECTING - The connection is currently being made
 *  Strophe.Status.CONNFAIL - The connection attempt failed
 *  Strophe.Status.AUTHENTICATING - The connection is authenticating
 *  Strophe.Status.AUTHFAIL - The authentication attempt failed
 *  Strophe.Status.CONNECTED - The connection has succeeded
 *  Strophe.Status.DISCONNECTED - The connection has been terminated
 *  Strophe.Status.DISCONNECTING - The connection is currently being terminated
 *  Strophe.Status.ATTACHED - The connection has been attached
 *  Strophe.Status.REDIRECT - The connection has been redirected
 *  Strophe.Status.CONNTIMEOUT - The connection has timed out
 */
const Status = {
  ERROR: 0,
  CONNECTING: 1,
  CONNFAIL: 2,
  AUTHENTICATING: 3,
  AUTHFAIL: 4,
  CONNECTED: 5,
  DISCONNECTED: 6,
  DISCONNECTING: 7,
  ATTACHED: 8,
  REDIRECT: 9,
  CONNTIMEOUT: 10,
  BINDREQUIRED: 11,
  ATTACHFAIL: 12
};
const ErrorCondition = {
  BAD_FORMAT: 'bad-format',
  CONFLICT: 'conflict',
  MISSING_JID_NODE: 'x-strophe-bad-non-anon-jid',
  NO_AUTH_MECH: 'no-auth-mech',
  UNKNOWN_REASON: 'unknown'
};

/** Constants: Log Level Constants
 *  Logging level indicators.
 *
 *  Strophe.LogLevel.DEBUG - Debug output
 *  Strophe.LogLevel.INFO - Informational output
 *  Strophe.LogLevel.WARN - Warnings
 *  Strophe.LogLevel.ERROR - Errors
 *  Strophe.LogLevel.FATAL - Fatal errors
 */
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
};

/** PrivateConstants: DOM Element Type Constants
 *  DOM element types.
 *
 *  ElementType.NORMAL - Normal element.
 *  ElementType.TEXT - Text data element.
 *  ElementType.FRAGMENT - XHTML fragment element.
 */
const ElementType = {
  NORMAL: 1,
  TEXT: 3,
  CDATA: 4,
  FRAGMENT: 11
};

/* global btoa, ActiveXObject */
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
function base64ToArrayBuf(str) {
  var _Uint8Array$from;
  return (_Uint8Array$from = Uint8Array.from(atob(str), c => c.charCodeAt(0))) === null || _Uint8Array$from === void 0 ? void 0 : _Uint8Array$from.buffer;
}
function stringToArrayBuf(str) {
  const bytes = new TextEncoder('utf-8').encode(str);
  return bytes.buffer;
}
function addCookies(cookies) {
  if (typeof document === 'undefined') {
    Strophe.log(Strophe.LogLevel.ERROR, `addCookies: not adding any cookies, since there's no document object`);
  }

  /* Parameters:
   *  (Object) cookies - either a map of cookie names
   *    to string values or to maps of cookie values.
   *
   * For example:
   * { "myCookie": "1234" }
   *
   * or:
   * { "myCookie": {
   *      "value": "1234",
   *      "domain": ".example.org",
   *      "path": "/",
   *      "expires": expirationDate
   *      }
   *  }
   *
   *  These values get passed to Strophe.Connection via
   *   options.cookies
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

/** Function: Strophe.xmlGenerator
 *  Get the DOM document to generate elements.
 *
 *  Returns:
 *    The currently used DOM document.
 */
function xmlGenerator() {
  if (!_xmlGenerator) {
    _xmlGenerator = getDummyXMLDOMDocument();
  }
  return _xmlGenerator;
}

/** Function: Strophe.xmlTextNode
 *  Creates an XML DOM text node.
 *
 *  Provides a cross implementation version of document.createTextNode.
 *
 *  Parameters:
 *    (String) text - The content of the text node.
 *
 *  Returns:
 *    A new XML DOM text node.
 */
function xmlTextNode(text) {
  return xmlGenerator().createTextNode(text);
}

/** Function: Strophe.xmlHtmlNode
 *  Creates an XML DOM html node.
 *
 *  Parameters:
 *    (String) html - The content of the html node.
 *
 *  Returns:
 *    A new XML DOM text node.
 */
function xmlHtmlNode(html) {
  let node;
  //ensure text is escaped
  if (DOMParser) {
    const parser = new DOMParser();
    node = parser.parseFromString(html, 'text/xml');
  } else {
    node = new ActiveXObject('Microsoft.XMLDOM');
    node.async = 'false';
    node.loadXML(html);
  }
  return node;
}

/** Function: Strophe.xmlElement
 *  Create an XML DOM element.
 *
 *  This function creates an XML DOM element correctly across all
 *  implementations. Note that these are not HTML DOM elements, which
 *  aren't appropriate for XMPP stanzas.
 *
 *  Parameters:
 *    (String) name - The name for the element.
 *    (Array|Object) attrs - An optional array or object containing
 *      key/value pairs to use as element attributes. The object should
 *      be in the format {'key': 'value'} or {key: 'value'}. The array
 *      should have the format [['key1', 'value1'], ['key2', 'value2']].
 *    (String) text - The text child data for the element.
 *
 *  Returns:
 *    A new XML DOM element.
 */
function xmlElement(name) {
  if (!name) {
    return null;
  }
  const node = xmlGenerator().createElement(name);
  // FIXME: this should throw errors if args are the wrong type or
  // there are more than two optional args
  for (let a = 1; a < arguments.length; a++) {
    const arg = arguments[a];
    if (!arg) {
      continue;
    }
    if (typeof arg === 'string' || typeof arg === 'number') {
      node.appendChild(xmlTextNode(arg));
    } else if (typeof arg === 'object' && typeof arg.sort === 'function') {
      for (let i = 0; i < arg.length; i++) {
        const attr = arg[i];
        if (typeof attr === 'object' && typeof attr.sort === 'function' && attr[1] !== undefined && attr[1] !== null) {
          node.setAttribute(attr[0], attr[1]);
        }
      }
    } else if (typeof arg === 'object') {
      for (const k in arg) {
        if (Object.prototype.hasOwnProperty.call(arg, k) && arg[k] !== undefined && arg[k] !== null) {
          node.setAttribute(k, arg[k]);
        }
      }
    }
  }
  return node;
}

/** Function: Strophe.XHTML.validTag
 *
 * Utility method to determine whether a tag is allowed
 * in the XHTML_IM namespace.
 *
 * XHTML tag names are case sensitive and must be lower case.
 */
function validTag(tag) {
  for (let i = 0; i < XHTML.tags.length; i++) {
    if (tag === XHTML.tags[i]) {
      return true;
    }
  }
  return false;
}

/** Function: Strophe.XHTML.validAttribute
 *
 * Utility method to determine whether an attribute is allowed
 * as recommended per XEP-0071
 *
 * XHTML attribute names are case sensitive and must be lower case.
 */
function validAttribute(tag, attribute) {
  if (typeof XHTML.attributes[tag] !== 'undefined' && XHTML.attributes[tag].length > 0) {
    for (let i = 0; i < XHTML.attributes[tag].length; i++) {
      if (attribute === XHTML.attributes[tag][i]) {
        return true;
      }
    }
  }
  return false;
}

/** Function: Strophe.XHTML.validCSS */
function validCSS(style) {
  for (let i = 0; i < XHTML.css.length; i++) {
    if (style === XHTML.css[i]) {
      return true;
    }
  }
  return false;
}

/** Function: Strophe.createHtml
 *
 *  Copy an HTML DOM element into an XML DOM.
 *
 *  This function copies a DOM element and all its descendants and returns
 *  the new copy.
 *
 *  Parameters:
 *    (HTMLElement) elem - A DOM element.
 *
 *  Returns:
 *    A new, copied DOM element tree.
 */
function createHtml(elem) {
  let el;
  if (elem.nodeType === ElementType.NORMAL) {
    const tag = elem.nodeName.toLowerCase(); // XHTML tags must be lower case.
    if (validTag(tag)) {
      try {
        el = xmlElement(tag);
        for (let i = 0; i < XHTML.attributes[tag].length; i++) {
          const attribute = XHTML.attributes[tag][i];
          let value = elem.getAttribute(attribute);
          if (typeof value === 'undefined' || value === null || value === '' || value === false || value === 0) {
            continue;
          }
          if (attribute === 'style' && typeof value === 'object' && typeof value.cssText !== 'undefined') {
            value = value.cssText; // we're dealing with IE, need to get CSS out
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
  } else if (elem.nodeType === ElementType.FRAGMENT) {
    el = xmlGenerator().createDocumentFragment();
    for (let i = 0; i < elem.childNodes.length; i++) {
      el.appendChild(createHtml(elem.childNodes[i]));
    }
  } else if (elem.nodeType === ElementType.TEXT) {
    el = xmlTextNode(elem.nodeValue);
  }
  return el;
}

/** Function: Strophe.copyElement
 *  Copy an XML DOM element.
 *
 *  This function copies a DOM element and all its descendants and returns
 *  the new copy.
 *
 *  Parameters:
 *    (XMLElement) elem - A DOM element.
 *
 *  Returns:
 *    A new, copied DOM element tree.
 */
function copyElement(elem) {
  let el;
  if (elem.nodeType === ElementType.NORMAL) {
    el = xmlElement(elem.tagName);
    for (let i = 0; i < elem.attributes.length; i++) {
      el.setAttribute(elem.attributes[i].nodeName, elem.attributes[i].value);
    }
    for (let i = 0; i < elem.childNodes.length; i++) {
      el.appendChild(copyElement(elem.childNodes[i]));
    }
  } else if (elem.nodeType === ElementType.TEXT) {
    el = xmlGenerator().createTextNode(elem.nodeValue);
  }
  return el;
}

/*  Function: Strophe.xmlescape
 *  Excapes invalid xml characters.
 *
 *  Parameters:
 *     (String) text - text to escape.
 *
 *  Returns:
 *      Escaped text.
 */
function xmlescape(text) {
  text = text.replace(/\&/g, '&amp;');
  text = text.replace(/</g, '&lt;');
  text = text.replace(/>/g, '&gt;');
  text = text.replace(/'/g, '&apos;');
  text = text.replace(/"/g, '&quot;');
  return text;
}

/*  Function: Strophe.xmlunescape
 *  Unexcapes invalid xml characters.
 *
 *  Parameters:
 *     (String) text - text to unescape.
 *
 *  Returns:
 *      Unescaped text.
 */
function xmlunescape(text) {
  text = text.replace(/\&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&apos;/g, "'");
  text = text.replace(/&quot;/g, '"');
  return text;
}

/** Function: Strophe.serialize
 *  Render a DOM element and all descendants to a String.
 *
 *  Parameters:
 *    (XMLElement) elem - A DOM element.
 *
 *  Returns:
 *    The serialized element tree as a String.
 */
function serialize(elem) {
  if (!elem) {
    return null;
  }
  if (typeof elem.tree === 'function') {
    elem = elem.tree();
  }
  const names = [...Array(elem.attributes.length).keys()].map(i => elem.attributes[i].nodeName);
  names.sort();
  let result = names.reduce((a, n) => `${a} ${n}="${xmlescape(elem.attributes.getNamedItem(n).value)}"`, `<${elem.nodeName}`);
  if (elem.childNodes.length > 0) {
    result += '>';
    for (let i = 0; i < elem.childNodes.length; i++) {
      const child = elem.childNodes[i];
      switch (child.nodeType) {
        case ElementType.NORMAL:
          // normal element, so recurse
          result += serialize(child);
          break;
        case ElementType.TEXT:
          // text element to escape values
          result += xmlescape(child.nodeValue);
          break;
        case ElementType.CDATA:
          // cdata section so don't escape values
          result += '<![CDATA[' + child.nodeValue + ']]>';
      }
    }
    result += '</' + elem.nodeName + '>';
  } else {
    result += '/>';
  }
  return result;
}

/** Function: Strophe.forEachChild
 *  Map a function over some or all child elements of a given element.
 *
 *  This is a small convenience function for mapping a function over
 *  some or all of the children of an element.  If elemName is null, all
 *  children will be passed to the function, otherwise only children
 *  whose tag names match elemName will be passed.
 *
 *  Parameters:
 *    (XMLElement) elem - The element to operate on.
 *    (String) elemName - The child element tag name filter.
 *    (Function) func - The function to apply to each child.  This
 *      function should take a single argument, a DOM element.
 */
function forEachChild(elem, elemName, func) {
  for (let i = 0; i < elem.childNodes.length; i++) {
    const childNode = elem.childNodes[i];
    if (childNode.nodeType === ElementType.NORMAL && (!elemName || this.isTagEqual(childNode, elemName))) {
      func(childNode);
    }
  }
}

/** Function: Strophe.isTagEqual
 *  Compare an element's tag name with a string.
 *
 *  This function is case sensitive.
 *
 *  Parameters:
 *    (XMLElement) el - A DOM element.
 *    (String) name - The element name.
 *
 *  Returns:
 *    true if the element's tag name matches _el_, and false
 *    otherwise.
 */
function isTagEqual(el, name) {
  return el.tagName === name;
}

/** Function: Strophe.getText
 *  Get the concatenation of all text children of an element.
 *
 *  Parameters:
 *    (XMLElement) elem - A DOM element.
 *
 *  Returns:
 *    A String with the concatenated text of all text element children.
 */
function getText(elem) {
  var _elem$childNodes;
  if (!elem) {
    return null;
  }
  let str = '';
  if (!((_elem$childNodes = elem.childNodes) !== null && _elem$childNodes !== void 0 && _elem$childNodes.length) && elem.nodeType === ElementType.TEXT) {
    str += elem.nodeValue;
  }
  for (let i = 0; (_ref = i < ((_elem$childNodes2 = elem.childNodes) === null || _elem$childNodes2 === void 0 ? void 0 : _elem$childNodes2.length)) !== null && _ref !== void 0 ? _ref : 0; i++) {
    var _ref, _elem$childNodes2;
    if (elem.childNodes[i].nodeType === ElementType.TEXT) {
      str += elem.childNodes[i].nodeValue;
    }
  }
  return xmlescape(str);
}

/** Function: Strophe.escapeNode
 *  Escape the node part (also called local part) of a JID.
 *
 *  Parameters:
 *    (String) node - A node (or local part).
 *
 *  Returns:
 *    An escaped node (or local part).
 */
function escapeNode(node) {
  if (typeof node !== 'string') {
    return node;
  }
  return node.replace(/^\s+|\s+$/g, '').replace(/\\/g, '\\5c').replace(/ /g, '\\20').replace(/\"/g, '\\22').replace(/\&/g, '\\26').replace(/\'/g, '\\27').replace(/\//g, '\\2f').replace(/:/g, '\\3a').replace(/</g, '\\3c').replace(/>/g, '\\3e').replace(/@/g, '\\40');
}

/** Function: Strophe.unescapeNode
 *  Unescape a node part (also called local part) of a JID.
 *
 *  Parameters:
 *    (String) node - A node (or local part).
 *
 *  Returns:
 *    An unescaped node (or local part).
 */
function unescapeNode(node) {
  if (typeof node !== 'string') {
    return node;
  }
  return node.replace(/\\20/g, ' ').replace(/\\22/g, '"').replace(/\\26/g, '&').replace(/\\27/g, "'").replace(/\\2f/g, '/').replace(/\\3a/g, ':').replace(/\\3c/g, '<').replace(/\\3e/g, '>').replace(/\\40/g, '@').replace(/\\5c/g, '\\');
}

/** Function: Strophe.getNodeFromJid
 *  Get the node portion of a JID String.
 *
 *  Parameters:
 *    (String) jid - A JID.
 *
 *  Returns:
 *    A String containing the node.
 */
function getNodeFromJid(jid) {
  if (jid.indexOf('@') < 0) {
    return null;
  }
  return jid.split('@')[0];
}

/** Function: Strophe.getDomainFromJid
 *  Get the domain portion of a JID String.
 *
 *  Parameters:
 *    (String) jid - A JID.
 *
 *  Returns:
 *    A String containing the domain.
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

/** Function: Strophe.getResourceFromJid
 *  Get the resource portion of a JID String.
 *
 *  Parameters:
 *    (String) jid - A JID.
 *
 *  Returns:
 *    A String containing the resource.
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

/** Function: Strophe.getBareJidFromJid
 *  Get the bare JID from a JID String.
 *
 *  Parameters:
 *    (String) jid - A JID.
 *
 *  Returns:
 *    A String containing the bare JID.
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

var utils$1 = /*#__PURE__*/Object.freeze({
            __proto__: null,
            utf16to8: utf16to8,
            xorArrayBuffers: xorArrayBuffers,
            arrayBufToBase64: arrayBufToBase64,
            base64ToArrayBuf: base64ToArrayBuf,
            stringToArrayBuf: stringToArrayBuf,
            addCookies: addCookies,
            xmlGenerator: xmlGenerator,
            xmlTextNode: xmlTextNode,
            xmlHtmlNode: xmlHtmlNode,
            xmlElement: xmlElement,
            validTag: validTag,
            validAttribute: validAttribute,
            validCSS: validCSS,
            createHtml: createHtml,
            copyElement: copyElement,
            xmlescape: xmlescape,
            xmlunescape: xmlunescape,
            serialize: serialize,
            forEachChild: forEachChild,
            isTagEqual: isTagEqual,
            getText: getText,
            escapeNode: escapeNode,
            unescapeNode: unescapeNode,
            getNodeFromJid: getNodeFromJid,
            getDomainFromJid: getDomainFromJid,
            getResourceFromJid: getResourceFromJid,
            getBareJidFromJid: getBareJidFromJid,
            'default': utils
});

/** Function: $build
 *  Create a Strophe.Builder.
 *  This is an alias for 'new Strophe.Builder(name, attrs)'.
 *
 *  Parameters:
 *    (String) name - The root element name.
 *    (Object) attrs - The attributes for the root element in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $build(name, attrs) {
  return new Builder(name, attrs);
}

/** Function: $msg
 *  Create a Strophe.Builder with a <message/> element as the root.
 *
 *  Parameters:
 *    (Object) attrs - The <message/> element attributes in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $msg(attrs) {
  return new Builder('message', attrs);
}

/** Function: $iq
 *  Create a Strophe.Builder with an <iq/> element as the root.
 *
 *  Parameters:
 *    (Object) attrs - The <iq/> element attributes in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $iq(attrs) {
  return new Builder('iq', attrs);
}

/** Function: $pres
 *  Create a Strophe.Builder with a <presence/> element as the root.
 *
 *  Parameters:
 *    (Object) attrs - The <presence/> element attributes in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $pres(attrs) {
  return new Builder('presence', attrs);
}

/** Class: Strophe.Builder
 *  XML DOM builder.
 *
 *  This object provides an interface similar to JQuery but for building
 *  DOM elements easily and rapidly.  All the functions except for toString()
 *  and tree() return the object, so calls can be chained.  Here's an
 *  example using the $iq() builder helper.
 *  > $iq({to: 'you', from: 'me', type: 'get', id: '1'})
 *  >     .c('query', {xmlns: 'strophe:example'})
 *  >     .c('example')
 *  >     .toString()
 *
 *  The above generates this XML fragment
 *  > <iq to='you' from='me' type='get' id='1'>
 *  >   <query xmlns='strophe:example'>
 *  >     <example/>
 *  >   </query>
 *  > </iq>
 *  The corresponding DOM manipulations to get a similar fragment would be
 *  a lot more tedious and probably involve several helper variables.
 *
 *  Since adding children makes new operations operate on the child, up()
 *  is provided to traverse up the tree.  To add two children, do
 *  > builder.c('child1', ...).up().c('child2', ...)
 *  The next operation on the Builder will be relative to the second child.
 */

/** Constructor: Strophe.Builder
 *  Create a Strophe.Builder object.
 *
 *  The attributes should be passed in object notation.  For example
 *  > let b = new Builder('message', {to: 'you', from: 'me'});
 *  or
 *  > let b = new Builder('messsage', {'xml:lang': 'en'});
 *
 *  Parameters:
 *    (String) name - The name of the root element.
 *    (Object) attrs - The attributes for the root element in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder.
 */

class Builder {
  constructor(name, attrs) {
    // Set correct namespace for jabber:client elements
    if (name === 'presence' || name === 'message' || name === 'iq') {
      if (attrs && !attrs.xmlns) {
        attrs.xmlns = NS.CLIENT;
      } else if (!attrs) {
        attrs = {
          xmlns: NS.CLIENT
        };
      }
    }
    // Holds the tree being built.
    this.nodeTree = xmlElement(name, attrs);
    // Points to the current operation node.
    this.node = this.nodeTree;
  }

  /** Function: tree
   *  Return the DOM tree.
   *
   *  This function returns the current DOM tree as an element object.  This
   *  is suitable for passing to functions like Strophe.Connection.send().
   *
   *  Returns:
   *    The DOM tree as a element object.
   */
  tree() {
    return this.nodeTree;
  }

  /** Function: toString
   *  Serialize the DOM tree to a String.
   *
   *  This function returns a string serialization of the current DOM
   *  tree.  It is often used internally to pass data to a
   *  Strophe.Request object.
   *
   *  Returns:
   *    The serialized DOM tree in a String.
   */
  toString() {
    return serialize(this.nodeTree);
  }

  /** Function: up
   *  Make the current parent element the new current element.
   *
   *  This function is often used after c() to traverse back up the tree.
   *  For example, to add two children to the same element
   *  > builder.c('child1', {}).up().c('child2', {});
   *
   *  Returns:
   *    The Stophe.Builder object.
   */
  up() {
    this.node = this.node.parentNode;
    return this;
  }

  /** Function: root
   *  Make the root element the new current element.
   *
   *  When at a deeply nested element in the tree, this function can be used
   *  to jump back to the root of the tree, instead of having to repeatedly
   *  call up().
   *
   *  Returns:
   *    The Stophe.Builder object.
   */
  root() {
    this.node = this.nodeTree;
    return this;
  }

  /** Function: attrs
   *  Add or modify attributes of the current element.
   *
   *  The attributes should be passed in object notation.  This function
   *  does not move the current element pointer.
   *
   *  Parameters:
   *    (Object) moreattrs - The attributes to add/modify in object notation.
   *
   *  Returns:
   *    The Strophe.Builder object.
   */
  attrs(moreattrs) {
    for (const k in moreattrs) {
      if (Object.prototype.hasOwnProperty.call(moreattrs, k)) {
        if (moreattrs[k] === undefined) {
          this.node.removeAttribute(k);
        } else {
          this.node.setAttribute(k, moreattrs[k]);
        }
      }
    }
    return this;
  }

  /** Function: c
   *  Add a child to the current element and make it the new current
   *  element.
   *
   *  This function moves the current element pointer to the child,
   *  unless text is provided.  If you need to add another child, it
   *  is necessary to use up() to go back to the parent in the tree.
   *
   *  Parameters:
   *    (String) name - The name of the child.
   *    (Object) attrs - The attributes of the child in object notation.
   *    (String) text - The text to add to the child.
   *
   *  Returns:
   *    The Strophe.Builder object.
   */
  c(name, attrs, text) {
    const child = xmlElement(name, attrs, text);
    this.node.appendChild(child);
    if (typeof text !== 'string' && typeof text !== 'number') {
      this.node = child;
    }
    return this;
  }

  /** Function: cnode
   *  Add a child to the current element and make it the new current
   *  element.
   *
   *  This function is the same as c() except that instead of using a
   *  name and an attributes object to create the child it uses an
   *  existing DOM element object.
   *
   *  Parameters:
   *    (XMLElement) elem - A DOM element.
   *
   *  Returns:
   *    The Strophe.Builder object.
   */
  cnode(elem) {
    let impNode;
    const xmlGen = xmlGenerator();
    try {
      impNode = xmlGen.importNode !== undefined;
    } catch (e) {
      impNode = false;
    }
    const newElem = impNode ? xmlGen.importNode(elem, true) : copyElement(elem);
    this.node.appendChild(newElem);
    this.node = newElem;
    return this;
  }

  /** Function: t
   *  Add a child text element.
   *
   *  This *does not* make the child the new current element since there
   *  are no children of text elements.
   *
   *  Parameters:
   *    (String) text - The text data to append to the current element.
   *
   *  Returns:
   *    The Strophe.Builder object.
   */
  t(text) {
    const child = xmlTextNode(text);
    this.node.appendChild(child);
    return this;
  }

  /** Function: h
   *  Replace current element contents with the HTML passed in.
   *
   *  This *does not* make the child the new current element
   *
   *  Parameters:
   *    (String) html - The html to insert as contents of current element.
   *
   *  Returns:
   *    The Strophe.Builder object.
   */
  h(html) {
    const fragment = xmlGenerator().createElement('body');
    // force the browser to try and fix any invalid HTML tags
    fragment.innerHTML = html;
    // copy cleaned html into an xml dom
    const xhtml = createHtml(fragment);
    while (xhtml.childNodes.length > 0) {
      this.node.appendChild(xhtml.childNodes[0]);
    }
    return this;
  }
}

/** PrivateClass: Strophe.Handler
 *  _Private_ helper class for managing stanza handlers.
 *
 *  A Strophe.Handler encapsulates a user provided callback function to be
 *  executed when matching stanzas are received by the connection.
 *  Handlers can be either one-off or persistant depending on their
 *  return value. Returning true will cause a Handler to remain active, and
 *  returning false will remove the Handler.
 *
 *  Users will not use Strophe.Handler objects directly, but instead they
 *  will use Strophe.Connection.addHandler() and
 *  Strophe.Connection.deleteHandler().
 */

/** PrivateConstructor: Strophe.Handler
 *  Create and initialize a new Strophe.Handler.
 *
 *  Parameters:
 *    (Function) handler - A function to be executed when the handler is run.
 *    (String) ns - The namespace to match.
 *    (String) name - The element name to match.
 *    (String) type - The element type to match.
 *    (String) id - The element id attribute to match.
 *    (String) from - The element from attribute to match.
 *    (Object) options - Handler options
 *
 *  Returns:
 *    A new Strophe.Handler object.
 */

class Handler {
  constructor(handler, ns, name, type, id, from, options) {
    this.handler = handler;
    this.ns = ns;
    this.name = name;
    this.type = type;
    this.id = id;
    this.options = options || {
      'matchBareFromJid': false,
      'ignoreNamespaceFragment': false
    };
    // BBB: Maintain backward compatibility with old `matchBare` option
    if (this.options.matchBare) {
      Strophe.warn('The "matchBare" option is deprecated, use "matchBareFromJid" instead.');
      this.options.matchBareFromJid = this.options.matchBare;
      delete this.options.matchBare;
    }
    if (this.options.matchBareFromJid) {
      this.from = from ? getBareJidFromJid(from) : null;
    } else {
      this.from = from;
    }
    // whether the handler is a user handler or a system handler
    this.user = true;
  }

  /** PrivateFunction: getNamespace
   *  Returns the XML namespace attribute on an element.
   *  If `ignoreNamespaceFragment` was passed in for this handler, then the
   *  URL fragment will be stripped.
   *
   *  Parameters:
   *    (XMLElement) elem - The XML element with the namespace.
   *
   *  Returns:
   *    The namespace, with optionally the fragment stripped.
   */
  getNamespace(elem) {
    let elNamespace = elem.getAttribute('xmlns');
    if (elNamespace && this.options.ignoreNamespaceFragment) {
      elNamespace = elNamespace.split('#')[0];
    }
    return elNamespace;
  }

  /** PrivateFunction: namespaceMatch
   *  Tests if a stanza matches the namespace set for this Strophe.Handler.
   *
   *  Parameters:
   *    (XMLElement) elem - The XML element to test.
   *
   *  Returns:
   *    true if the stanza matches and false otherwise.
   */
  namespaceMatch(elem) {
    let nsMatch = false;
    if (!this.ns) {
      return true;
    } else {
      forEachChild(elem, null, elem => {
        if (this.getNamespace(elem) === this.ns) {
          nsMatch = true;
        }
      });
      return nsMatch || this.getNamespace(elem) === this.ns;
    }
  }

  /** PrivateFunction: isMatch
   *  Tests if a stanza matches the Strophe.Handler.
   *
   *  Parameters:
   *    (XMLElement) elem - The XML element to test.
   *
   *  Returns:
   *    true if the stanza matches and false otherwise.
   */
  isMatch(elem) {
    let from = elem.getAttribute('from');
    if (this.options.matchBareFromJid) {
      from = getBareJidFromJid(from);
    }
    const elem_type = elem.getAttribute('type');
    if (this.namespaceMatch(elem) && (!this.name || Strophe.isTagEqual(elem, this.name)) && (!this.type || (Array.isArray(this.type) ? this.type.indexOf(elem_type) !== -1 : elem_type === this.type)) && (!this.id || elem.getAttribute('id') === this.id) && (!this.from || from === this.from)) {
      return true;
    }
    return false;
  }

  /** PrivateFunction: run
   *  Run the callback on a matching stanza.
   *
   *  Parameters:
   *    (XMLElement) elem - The DOM element that triggered the
   *      Strophe.Handler.
   *
   *  Returns:
   *    A boolean indicating if the handler should remain active.
   */
  run(elem) {
    let result = null;
    try {
      result = this.handler(elem);
    } catch (e) {
      Strophe._handleError(e);
      throw e;
    }
    return result;
  }

  /** PrivateFunction: toString
   *  Get a String representation of the Strophe.Handler object.
   *
   *  Returns:
   *    A String.
   */
  toString() {
    return '{Handler: ' + this.handler + '(' + this.name + ',' + this.id + ',' + this.ns + ')}';
  }
}

/** PrivateClass: Strophe.TimedHandler
 *  _Private_ helper class for managing timed handlers.
 *
 *  A Strophe.TimedHandler encapsulates a user provided callback that
 *  should be called after a certain period of time or at regular
 *  intervals.  The return value of the callback determines whether the
 *  Strophe.TimedHandler will continue to fire.
 *
 *  Users will not use Strophe.TimedHandler objects directly, but instead
 *  they will use Strophe.Connection.addTimedHandler() and
 *  Strophe.Connection.deleteTimedHandler().
 */
class TimedHandler {
  /** PrivateConstructor: Strophe.TimedHandler
   *  Create and initialize a new Strophe.TimedHandler object.
   *
   *  Parameters:
   *    (Integer) period - The number of milliseconds to wait before the
   *      handler is called.
   *    (Function) handler - The callback to run when the handler fires.  This
   *      function should take no arguments.
   *
   *  Returns:
   *    A new Strophe.TimedHandler object.
   */
  constructor(period, handler) {
    this.period = period;
    this.handler = handler;
    this.lastCalled = new Date().getTime();
    this.user = true;
  }

  /** PrivateFunction: run
   *  Run the callback for the Strophe.TimedHandler.
   *
   *  Returns:
   *    true if the Strophe.TimedHandler should be called again, and false
   *      otherwise.
   */
  run() {
    this.lastCalled = new Date().getTime();
    return this.handler();
  }

  /** PrivateFunction: reset
   *  Reset the last called time for the Strophe.TimedHandler.
   */
  reset() {
    this.lastCalled = new Date().getTime();
  }

  /** PrivateFunction: toString
   *  Get a string representation of the Strophe.TimedHandler object.
   *
   *  Returns:
   *    The string representation.
   */
  toString() {
    return '{TimedHandler: ' + this.handler + '(' + this.period + ')}';
  }
}

/*sessionStorage, setTimeout, clearTimeout */

/** Class: Strophe.Connection
 *  XMPP Connection manager.
 *
 *  This class is the main part of Strophe.  It manages a BOSH or websocket
 *  connection to an XMPP server and dispatches events to the user callbacks
 *  as data arrives. It supports SASL PLAIN, SASL SCRAM-SHA-1
 *  and legacy authentication.
 *
 *  After creating a Strophe.Connection object, the user will typically
 *  call connect() with a user supplied callback to handle connection level
 *  events like authentication failure, disconnection, or connection
 *  complete.
 *
 *  The user will also have several event handlers defined by using
 *  addHandler() and addTimedHandler().  These will allow the user code to
 *  respond to interesting stanzas or do something periodically with the
 *  connection. These handlers will be active once authentication is
 *  finished.
 *
 *  To send data to the connection, use send().
 */

/** Constructor: Strophe.Connection
 *  Create and initialize a Strophe.Connection object.
 *
 *  The transport-protocol for this connection will be chosen automatically
 *  based on the given service parameter. URLs starting with "ws://" or
 *  "wss://" will use WebSockets, URLs starting with "http://", "https://"
 *  or without a protocol will use BOSH.
 *
 *  To make Strophe connect to the current host you can leave out the protocol
 *  and host part and just pass the path, e.g.
 *
 *  > let conn = new Strophe.Connection("/http-bind/");
 *
 *  Options common to both Websocket and BOSH:
 *  ------------------------------------------
 *
 *  cookies:
 *
 *  The *cookies* option allows you to pass in cookies to be added to the
 *  document. These cookies will then be included in the BOSH XMLHttpRequest
 *  or in the websocket connection.
 *
 *  The passed in value must be a map of cookie names and string values.
 *
 *  > { "myCookie": {
 *  >     "value": "1234",
 *  >     "domain": ".example.org",
 *  >     "path": "/",
 *  >     "expires": expirationDate
 *  >     }
 *  > }
 *
 *  Note that cookies can't be set in this way for other domains (i.e. cross-domain).
 *  Those cookies need to be set under those domains, for example they can be
 *  set server-side by making a XHR call to that domain to ask it to set any
 *  necessary cookies.
 *
 *  mechanisms:
 *
 *  The *mechanisms* option allows you to specify the SASL mechanisms that this
 *  instance of Strophe.Connection (and therefore your XMPP client) will
 *  support.
 *
 *  The value must be an array of objects with Strophe.SASLMechanism
 *  prototypes.
 *
 *  If nothing is specified, then the following mechanisms (and their
 *  priorities) are registered:
 *
 *      SCRAM-SHA-512 - 72
 *      SCRAM-SHA-384 - 71
 *      SCRAM-SHA-256 - 70
 *      SCRAM-SHA-1   - 60
 *      PLAIN         - 50
 *      OAUTHBEARER   - 40
 *      X-OAUTH2      - 30
 *      ANONYMOUS     - 20
 *      EXTERNAL      - 10
 *
 *  explicitResourceBinding:
 *
 *  If `explicitResourceBinding` is set to a truthy value, then the XMPP client
 *  needs to explicitly call `Strophe.Connection.prototype.bind` once the XMPP
 *  server has advertised the "urn:ietf:params:xml:ns:xmpp-bind" feature.
 *
 *  Making this step explicit allows client authors to first finish other
 *  stream related tasks, such as setting up an XEP-0198 Stream Management
 *  session, before binding the JID resource for this session.
 *
 *  WebSocket options:
 *  ------------------
 *
 *  protocol:
 *
 *  If you want to connect to the current host with a WebSocket connection you
 *  can tell Strophe to use WebSockets through a "protocol" attribute in the
 *  optional options parameter. Valid values are "ws" for WebSocket and "wss"
 *  for Secure WebSocket.
 *  So to connect to "wss://CURRENT_HOSTNAME/xmpp-websocket" you would call
 *
 *  > let conn = new Strophe.Connection("/xmpp-websocket/", {protocol: "wss"});
 *
 *  Note that relative URLs _NOT_ starting with a "/" will also include the path
 *  of the current site.
 *
 *  Also because downgrading security is not permitted by browsers, when using
 *  relative URLs both BOSH and WebSocket connections will use their secure
 *  variants if the current connection to the site is also secure (https).
 *
 *  worker:
 *
 *  Set this option to URL from where the shared worker script should be loaded.
 *
 *  To run the websocket connection inside a shared worker.
 *  This allows you to share a single websocket-based connection between
 *  multiple Strophe.Connection instances, for example one per browser tab.
 *
 *  The script to use is the one in `src/shared-connection-worker.js`.
 *
 *  BOSH options:
 *  -------------
 *
 *  By adding "sync" to the options, you can control if requests will
 *  be made synchronously or not. The default behaviour is asynchronous.
 *  If you want to make requests synchronous, make "sync" evaluate to true.
 *  > let conn = new Strophe.Connection("/http-bind/", {sync: true});
 *
 *  You can also toggle this on an already established connection.
 *  > conn.options.sync = true;
 *
 *  The *customHeaders* option can be used to provide custom HTTP headers to be
 *  included in the XMLHttpRequests made.
 *
 *  The *keepalive* option can be used to instruct Strophe to maintain the
 *  current BOSH session across interruptions such as webpage reloads.
 *
 *  It will do this by caching the sessions tokens in sessionStorage, and when
 *  "restore" is called it will check whether there are cached tokens with
 *  which it can resume an existing session.
 *
 *  The *withCredentials* option should receive a Boolean value and is used to
 *  indicate wether cookies should be included in ajax requests (by default
 *  they're not).
 *  Set this value to true if you are connecting to a BOSH service
 *  and for some reason need to send cookies to it.
 *  In order for this to work cross-domain, the server must also enable
 *  credentials by setting the Access-Control-Allow-Credentials response header
 *  to "true". For most usecases however this setting should be false (which
 *  is the default).
 *  Additionally, when using Access-Control-Allow-Credentials, the
 *  Access-Control-Allow-Origin header can't be set to the wildcard "*", but
 *  instead must be restricted to actual domains.
 *
 *  The *contentType* option can be set to change the default Content-Type
 *  of "text/xml; charset=utf-8", which can be useful to reduce the amount of
 *  CORS preflight requests that are sent to the server.
 *
 *  Parameters:
 *    (String) service - The BOSH or WebSocket service URL.
 *    (Object) options - A hash of configuration options
 *
 *  Returns:
 *    A new Strophe.Connection object.
 */

class Connection {
  constructor(service, options) {
    // The service URL
    this.service = service;
    // Configuration options
    this.options = options || {};
    this.setProtocol();

    /* The connected JID. */
    this.jid = '';
    /* the JIDs domain */
    this.domain = null;
    /* stream:features */
    this.features = null;

    // SASL
    this._sasl_data = {};
    this.do_bind = false;
    this.do_session = false;
    this.mechanisms = {};

    // handler lists
    this.timedHandlers = [];
    this.handlers = [];
    this.removeTimeds = [];
    this.removeHandlers = [];
    this.addTimeds = [];
    this.addHandlers = [];
    this.protocolErrorHandlers = {
      'HTTP': {},
      'websocket': {}
    };
    this._idleTimeout = null;
    this._disconnectTimeout = null;
    this.authenticated = false;
    this.connected = false;
    this.disconnecting = false;
    this.do_authentication = true;
    this.paused = false;
    this.restored = false;
    this._data = [];
    this._uniqueId = 0;
    this._sasl_success_handler = null;
    this._sasl_failure_handler = null;
    this._sasl_challenge_handler = null;

    // Max retries before disconnecting
    this.maxRetries = 5;

    // Call onIdle callback every 1/10th of a second
    this._idleTimeout = setTimeout(() => this._onIdle(), 100);
    addCookies(this.options.cookies);
    this.registerSASLMechanisms(this.options.mechanisms);

    // A client must always respond to incoming IQ "set" and "get" stanzas.
    // See https://datatracker.ietf.org/doc/html/rfc6120#section-8.2.3
    //
    // This is a fallback handler which gets called when no other handler
    // was called for a received IQ "set" or "get".
    this.iqFallbackHandler = new Handler(iq => this.send($iq({
      type: 'error',
      id: iq.getAttribute('id')
    }).c('error', {
      'type': 'cancel'
    }).c('service-unavailable', {
      'xmlns': Strophe.NS.STANZAS
    })), null, 'iq', ['get', 'set']);

    // initialize plugins
    for (const k in Strophe._connectionPlugins) {
      if (Object.prototype.hasOwnProperty.call(Strophe._connectionPlugins, k)) {
        const F = function () {};
        F.prototype = Strophe._connectionPlugins[k];
        this[k] = new F();
        this[k].init(this);
      }
    }
  }

  /** Function: setProtocol
   *  Select protocal based on this.options or this.service
   */
  setProtocol() {
    const proto = this.options.protocol || '';
    if (this.options.worker) {
      this._proto = new Strophe.WorkerWebsocket(this);
    } else if (this.service.indexOf('ws:') === 0 || this.service.indexOf('wss:') === 0 || proto.indexOf('ws') === 0) {
      this._proto = new Strophe.Websocket(this);
    } else {
      this._proto = new Strophe.Bosh(this);
    }
  }

  /** Function: reset
   *  Reset the connection.
   *
   *  This function should be called after a connection is disconnected
   *  before that connection is reused.
   */
  reset() {
    this._proto._reset();

    // SASL
    this.do_session = false;
    this.do_bind = false;

    // handler lists
    this.timedHandlers = [];
    this.handlers = [];
    this.removeTimeds = [];
    this.removeHandlers = [];
    this.addTimeds = [];
    this.addHandlers = [];
    this.authenticated = false;
    this.connected = false;
    this.disconnecting = false;
    this.restored = false;
    this._data = [];
    this._requests = [];
    this._uniqueId = 0;
  }

  /** Function: pause
   *  Pause the request manager.
   *
   *  This will prevent Strophe from sending any more requests to the
   *  server.  This is very useful for temporarily pausing
   *  BOSH-Connections while a lot of send() calls are happening quickly.
   *  This causes Strophe to send the data in a single request, saving
   *  many request trips.
   */
  pause() {
    this.paused = true;
  }

  /** Function: resume
   *  Resume the request manager.
   *
   *  This resumes after pause() has been called.
   */
  resume() {
    this.paused = false;
  }

  /** Function: getUniqueId
   *  Generate a unique ID for use in <iq/> elements.
   *
   *  All <iq/> stanzas are required to have unique id attributes.  This
   *  function makes creating these easy.  Each connection instance has
   *  a counter which starts from zero, and the value of this counter
   *  plus a colon followed by the suffix becomes the unique id. If no
   *  suffix is supplied, the counter is used as the unique id.
   *
   *  Suffixes are used to make debugging easier when reading the stream
   *  data, and their use is recommended.  The counter resets to 0 for
   *  every new connection for the same reason.  For connections to the
   *  same server that authenticate the same way, all the ids should be
   *  the same, which makes it easy to see changes.  This is useful for
   *  automated testing as well.
   *
   *  Parameters:
   *    (String) suffix - A optional suffix to append to the id.
   *
   *  Returns:
   *    A unique string to be used for the id attribute.
   */
  // eslint-disable-next-line class-methods-use-this
  getUniqueId(suffix) {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
    if (typeof suffix === 'string' || typeof suffix === 'number') {
      return uuid + ':' + suffix;
    } else {
      return uuid + '';
    }
  }

  /** Function: addProtocolErrorHandler
   *  Register a handler function for when a protocol (websocker or HTTP)
   *  error occurs.
   *
   *  NOTE: Currently only HTTP errors for BOSH requests are handled.
   *  Patches that handle websocket errors would be very welcome.
   *
   *  Parameters:
   *    (String) protocol - 'HTTP' or 'websocket'
   *    (Integer) status_code - Error status code (e.g 500, 400 or 404)
   *    (Function) callback - Function that will fire on Http error
   *
   *  Example:
   *  function onError(err_code){
   *    //do stuff
   *  }
   *
   *  let conn = Strophe.connect('http://example.com/http-bind');
   *  conn.addProtocolErrorHandler('HTTP', 500, onError);
   *  // Triggers HTTP 500 error and onError handler will be called
   *  conn.connect('user_jid@incorrect_jabber_host', 'secret', onConnect);
   */
  addProtocolErrorHandler(protocol, status_code, callback) {
    this.protocolErrorHandlers[protocol][status_code] = callback;
  }

  /** Function: connect
   *  Starts the connection process.
   *
   *  As the connection process proceeds, the user supplied callback will
   *  be triggered multiple times with status updates.  The callback
   *  should take two arguments - the status code and the error condition.
   *
   *  The status code will be one of the values in the Strophe.Status
   *  constants.  The error condition will be one of the conditions
   *  defined in RFC 3920 or the condition 'strophe-parsererror'.
   *
   *  The Parameters _wait_, _hold_ and _route_ are optional and only relevant
   *  for BOSH connections. Please see XEP 124 for a more detailed explanation
   *  of the optional parameters.
   *
   *  Parameters:
   *    (String) jid - The user's JID.  This may be a bare JID,
   *      or a full JID.  If a node is not supplied, SASL OAUTHBEARER or
   *      SASL ANONYMOUS authentication will be attempted (OAUTHBEARER will
   *      process the provided password value as an access token).
   *    (String or Object) pass - The user's password, or an object containing
   *      the users SCRAM client and server keys, in a fashion described as follows:
   *
   *      { name: String, representing the hash used (eg. SHA-1),
   *        salt: String, base64 encoded salt used to derive the client key,
   *        iter: Int,    the iteration count used to derive the client key,
   *        ck:   String, the base64 encoding of the SCRAM client key
   *        sk:   String, the base64 encoding of the SCRAM server key
   *      }
   *
   *    (Function) callback - The connect callback function.
   *    (Integer) wait - The optional HTTPBIND wait value.  This is the
   *      time the server will wait before returning an empty result for
   *      a request.  The default setting of 60 seconds is recommended.
   *    (Integer) hold - The optional HTTPBIND hold value.  This is the
   *      number of connections the server will hold at one time.  This
   *      should almost always be set to 1 (the default).
   *    (String) route - The optional route value.
   *    (String) authcid - The optional alternative authentication identity
   *      (username) if intending to impersonate another user.
   *      When using the SASL-EXTERNAL authentication mechanism, for example
   *      with client certificates, then the authcid value is used to
   *      determine whether an authorization JID (authzid) should be sent to
   *      the server. The authzid should NOT be sent to the server if the
   *      authzid and authcid are the same. So to prevent it from being sent
   *      (for example when the JID is already contained in the client
   *      certificate), set authcid to that same JID. See XEP-178 for more
   *      details.
   *     (Integer) disconnection_timeout - The optional disconnection timeout
   *      in milliseconds before _doDisconnect will be called.
   */
  connect(jid, pass, callback, wait, hold, route, authcid) {
    let disconnection_timeout = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 3000;
    this.jid = jid;
    /** Variable: authzid
     *  Authorization identity.
     */
    this.authzid = Strophe.getBareJidFromJid(this.jid);

    /** Variable: authcid
     *  Authentication identity (User name).
     */
    this.authcid = authcid || Strophe.getNodeFromJid(this.jid);

    /** Variable: pass
     *  Authentication identity (User password).
     *
     */
    this.pass = pass;

    /** Variable: scram_keys
     *  The SASL SCRAM client and server keys. This variable will be populated with a non-null
     *  object of the above described form after a successful SCRAM connection
     *
     */
    this.scram_keys = null;
    this.connect_callback = callback;
    this.disconnecting = false;
    this.connected = false;
    this.authenticated = false;
    this.restored = false;
    this.disconnection_timeout = disconnection_timeout;

    // parse jid for domain
    this.domain = Strophe.getDomainFromJid(this.jid);
    this._changeConnectStatus(Status.CONNECTING, null);
    this._proto._connect(wait, hold, route);
  }

  /** Function: attach
   *  Attach to an already created and authenticated BOSH session.
   *
   *  This function is provided to allow Strophe to attach to BOSH
   *  sessions which have been created externally, perhaps by a Web
   *  application.  This is often used to support auto-login type features
   *  without putting user credentials into the page.
   *
   *  Parameters:
   *    (String) jid - The full JID that is bound by the session.
   *    (String) sid - The SID of the BOSH session.
   *    (String) rid - The current RID of the BOSH session.  This RID
   *      will be used by the next request.
   *    (Function) callback The connect callback function.
   *    (Integer) wait - The optional HTTPBIND wait value.  This is the
   *      time the server will wait before returning an empty result for
   *      a request.  The default setting of 60 seconds is recommended.
   *      Other settings will require tweaks to the Strophe.TIMEOUT value.
   *    (Integer) hold - The optional HTTPBIND hold value.  This is the
   *      number of connections the server will hold at one time.  This
   *      should almost always be set to 1 (the default).
   *    (Integer) wind - The optional HTTBIND window value.  This is the
   *      allowed range of request ids that are valid.  The default is 5.
   */
  attach(jid, sid, rid, callback, wait, hold, wind) {
    if (this._proto._attach) {
      return this._proto._attach(jid, sid, rid, callback, wait, hold, wind);
    } else {
      const error = new Error('The "attach" method is not available for your connection protocol');
      error.name = 'StropheSessionError';
      throw error;
    }
  }

  /** Function: restore
   *  Attempt to restore a cached BOSH session.
   *
   *  This function is only useful in conjunction with providing the
   *  "keepalive":true option when instantiating a new Strophe.Connection.
   *
   *  When "keepalive" is set to true, Strophe will cache the BOSH tokens
   *  RID (Request ID) and SID (Session ID) and then when this function is
   *  called, it will attempt to restore the session from those cached
   *  tokens.
   *
   *  This function must therefore be called instead of connect or attach.
   *
   *  For an example on how to use it, please see examples/restore.js
   *
   *  Parameters:
   *    (String) jid - The user's JID.  This may be a bare JID or a full JID.
   *    (Function) callback - The connect callback function.
   *    (Integer) wait - The optional HTTPBIND wait value.  This is the
   *      time the server will wait before returning an empty result for
   *      a request.  The default setting of 60 seconds is recommended.
   *    (Integer) hold - The optional HTTPBIND hold value.  This is the
   *      number of connections the server will hold at one time.  This
   *      should almost always be set to 1 (the default).
   *    (Integer) wind - The optional HTTBIND window value.  This is the
   *      allowed range of request ids that are valid.  The default is 5.
   */
  restore(jid, callback, wait, hold, wind) {
    if (this._sessionCachingSupported()) {
      this._proto._restore(jid, callback, wait, hold, wind);
    } else {
      const error = new Error('The "restore" method can only be used with a BOSH connection.');
      error.name = 'StropheSessionError';
      throw error;
    }
  }

  /** PrivateFunction: _sessionCachingSupported
   * Checks whether sessionStorage and JSON are supported and whether we're
   * using BOSH.
   */
  _sessionCachingSupported() {
    if (this._proto instanceof Strophe.Bosh) {
      if (!JSON) {
        return false;
      }
      try {
        sessionStorage.setItem('_strophe_', '_strophe_');
        sessionStorage.removeItem('_strophe_');
      } catch (e) {
        return false;
      }
      return true;
    }
    return false;
  }

  /** Function: xmlInput
   *  User overrideable function that receives XML data coming into the
   *  connection.
   *
   *  The default function does nothing.  User code can override this with
   *  > Strophe.Connection.xmlInput = function (elem) {
   *  >   (user code)
   *  > };
   *
   *  Due to limitations of current Browsers' XML-Parsers the opening and closing
   *  <stream> tag for WebSocket-Connoctions will be passed as selfclosing here.
   *
   *  BOSH-Connections will have all stanzas wrapped in a <body> tag. See
   *  <Strophe.Bosh.strip> if you want to strip this tag.
   *
   *  Parameters:
   *    (XMLElement) elem - The XML data received by the connection.
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  xmlInput(elem) {
    return;
  }

  /** Function: xmlOutput
   *  User overrideable function that receives XML data sent to the
   *  connection.
   *
   *  The default function does nothing.  User code can override this with
   *  > Strophe.Connection.xmlOutput = function (elem) {
   *  >   (user code)
   *  > };
   *
   *  Due to limitations of current Browsers' XML-Parsers the opening and closing
   *  <stream> tag for WebSocket-Connoctions will be passed as selfclosing here.
   *
   *  BOSH-Connections will have all stanzas wrapped in a <body> tag. See
   *  <Strophe.Bosh.strip> if you want to strip this tag.
   *
   *  Parameters:
   *    (XMLElement) elem - The XMLdata sent by the connection.
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  xmlOutput(elem) {
    return;
  }

  /** Function: rawInput
   *  User overrideable function that receives raw data coming into the
   *  connection.
   *
   *  The default function does nothing.  User code can override this with
   *  > Strophe.Connection.rawInput = function (data) {
   *  >   (user code)
   *  > };
   *
   *  Parameters:
   *    (String) data - The data received by the connection.
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  rawInput(data) {
    return;
  }

  /** Function: rawOutput
   *  User overrideable function that receives raw data sent to the
   *  connection.
   *
   *  The default function does nothing.  User code can override this with
   *  > Strophe.Connection.rawOutput = function (data) {
   *  >   (user code)
   *  > };
   *
   *  Parameters:
   *    (String) data - The data sent by the connection.
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  rawOutput(data) {
    return;
  }

  /** Function: nextValidRid
   *  User overrideable function that receives the new valid rid.
   *
   *  The default function does nothing. User code can override this with
   *  > Strophe.Connection.nextValidRid = function (rid) {
   *  >    (user code)
   *  > };
   *
   *  Parameters:
   *    (Number) rid - The next valid rid
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  nextValidRid(rid) {
    return;
  }

  /** Function: send
   *  Send a stanza.
   *
   *  This function is called to push data onto the send queue to
   *  go out over the wire.  Whenever a request is sent to the BOSH
   *  server, all pending data is sent and the queue is flushed.
   *
   *  Parameters:
   *    (XMLElement |
   *     [XMLElement] |
   *     Strophe.Builder) elem - The stanza to send.
   */
  send(elem) {
    if (elem === null) {
      return;
    }
    if (typeof elem.sort === 'function') {
      for (let i = 0; i < elem.length; i++) {
        this._queueData(elem[i]);
      }
    } else if (typeof elem.tree === 'function') {
      this._queueData(elem.tree());
    } else {
      this._queueData(elem);
    }
    this._proto._send();
  }

  /** Function: flush
   *  Immediately send any pending outgoing data.
   *
   *  Normally send() queues outgoing data until the next idle period
   *  (100ms), which optimizes network use in the common cases when
   *  several send()s are called in succession. flush() can be used to
   *  immediately send all pending data.
   */
  flush() {
    // cancel the pending idle period and run the idle function
    // immediately
    clearTimeout(this._idleTimeout);
    this._onIdle();
  }

  /** Function: sendPresence
   *  Helper function to send presence stanzas. The main benefit is for
   *  sending presence stanzas for which you expect a responding presence
   *  stanza with the same id (for example when leaving a chat room).
   *
   *  Parameters:
   *    (XMLElement) elem - The stanza to send.
   *    (Function) callback - The callback function for a successful request.
   *    (Function) errback - The callback function for a failed or timed
   *      out request.  On timeout, the stanza will be null.
   *    (Integer) timeout - The time specified in milliseconds for a
   *      timeout to occur.
   *
   *  Returns:
   *    The id used to send the presence.
   */
  sendPresence(elem, callback, errback, timeout) {
    let timeoutHandler = null;
    if (typeof elem.tree === 'function') {
      elem = elem.tree();
    }
    let id = elem.getAttribute('id');
    if (!id) {
      // inject id if not found
      id = this.getUniqueId('sendPresence');
      elem.setAttribute('id', id);
    }
    if (typeof callback === 'function' || typeof errback === 'function') {
      const handler = this.addHandler(stanza => {
        // remove timeout handler if there is one
        if (timeoutHandler) {
          this.deleteTimedHandler(timeoutHandler);
        }
        if (stanza.getAttribute('type') === 'error') {
          if (errback) {
            errback(stanza);
          }
        } else if (callback) {
          callback(stanza);
        }
      }, null, 'presence', null, id);

      // if timeout specified, set up a timeout handler.
      if (timeout) {
        timeoutHandler = this.addTimedHandler(timeout, () => {
          // get rid of normal handler
          this.deleteHandler(handler);
          // call errback on timeout with null stanza
          if (errback) {
            errback(null);
          }
          return false;
        });
      }
    }
    this.send(elem);
    return id;
  }

  /** Function: sendIQ
   *  Helper function to send IQ stanzas.
   *
   *  Parameters:
   *    (XMLElement) elem - The stanza to send.
   *    (Function) callback - The callback function for a successful request.
   *    (Function) errback - The callback function for a failed or timed
   *      out request.  On timeout, the stanza will be null.
   *    (Integer) timeout - The time specified in milliseconds for a
   *      timeout to occur.
   *
   *  Returns:
   *    The id used to send the IQ.
   */
  sendIQ(elem, callback, errback, timeout) {
    let timeoutHandler = null;
    if (typeof elem.tree === 'function') {
      elem = elem.tree();
    }
    let id = elem.getAttribute('id');
    if (!id) {
      // inject id if not found
      id = this.getUniqueId('sendIQ');
      elem.setAttribute('id', id);
    }
    if (typeof callback === 'function' || typeof errback === 'function') {
      const handler = this.addHandler(stanza => {
        // remove timeout handler if there is one
        if (timeoutHandler) {
          this.deleteTimedHandler(timeoutHandler);
        }
        const iqtype = stanza.getAttribute('type');
        if (iqtype === 'result') {
          if (callback) {
            callback(stanza);
          }
        } else if (iqtype === 'error') {
          if (errback) {
            errback(stanza);
          }
        } else {
          const error = new Error(`Got bad IQ type of ${iqtype}`);
          error.name = 'StropheError';
          throw error;
        }
      }, null, 'iq', ['error', 'result'], id);

      // if timeout specified, set up a timeout handler.
      if (timeout) {
        timeoutHandler = this.addTimedHandler(timeout, () => {
          // get rid of normal handler
          this.deleteHandler(handler);
          // call errback on timeout with null stanza
          if (errback) {
            errback(null);
          }
          return false;
        });
      }
    }
    this.send(elem);
    return id;
  }

  /** PrivateFunction: _queueData
   *  Queue outgoing data for later sending.  Also ensures that the data
   *  is a DOMElement.
   */
  _queueData(element) {
    if (element === null || !element.tagName || !element.childNodes) {
      const error = new Error('Cannot queue non-DOMElement.');
      error.name = 'StropheError';
      throw error;
    }
    this._data.push(element);
  }

  /** PrivateFunction: _sendRestart
   *  Send an xmpp:restart stanza.
   */
  _sendRestart() {
    this._data.push('restart');
    this._proto._sendRestart();
    this._idleTimeout = setTimeout(() => this._onIdle(), 100);
  }

  /** Function: addTimedHandler
   *  Add a timed handler to the connection.
   *
   *  This function adds a timed handler.  The provided handler will
   *  be called every period milliseconds until it returns false,
   *  the connection is terminated, or the handler is removed.  Handlers
   *  that wish to continue being invoked should return true.
   *
   *  Because of method binding it is necessary to save the result of
   *  this function if you wish to remove a handler with
   *  deleteTimedHandler().
   *
   *  Note that user handlers are not active until authentication is
   *  successful.
   *
   *  Parameters:
   *    (Integer) period - The period of the handler.
   *    (Function) handler - The callback function.
   *
   *  Returns:
   *    A reference to the handler that can be used to remove it.
   */
  addTimedHandler(period, handler) {
    const thand = new Strophe.TimedHandler(period, handler);
    this.addTimeds.push(thand);
    return thand;
  }

  /** Function: deleteTimedHandler
   *  Delete a timed handler for a connection.
   *
   *  This function removes a timed handler from the connection.  The
   *  handRef parameter is *not* the function passed to addTimedHandler(),
   *  but is the reference returned from addTimedHandler().
   *
   *  Parameters:
   *    (Strophe.TimedHandler) handRef - The handler reference.
   */
  deleteTimedHandler(handRef) {
    // this must be done in the Idle loop so that we don't change
    // the handlers during iteration
    this.removeTimeds.push(handRef);
  }

  /** Function: addHandler
   *  Add a stanza handler for the connection.
   *
   *  This function adds a stanza handler to the connection.  The
   *  handler callback will be called for any stanza that matches
   *  the parameters.  Note that if multiple parameters are supplied,
   *  they must all match for the handler to be invoked.
   *
   *  The handler will receive the stanza that triggered it as its argument.
   *  *The handler should return true if it is to be invoked again;
   *  returning false will remove the handler after it returns.*
   *
   *  As a convenience, the ns parameters applies to the top level element
   *  and also any of its immediate children.  This is primarily to make
   *  matching /iq/query elements easy.
   *
   *  Options
   *  ~~~~~~~
   *  With the options argument, you can specify boolean flags that affect how
   *  matches are being done.
   *
   *  Currently two flags exist:
   *
   *  - matchBareFromJid:
   *      When set to true, the from parameter and the
   *      from attribute on the stanza will be matched as bare JIDs instead
   *      of full JIDs. To use this, pass {matchBareFromJid: true} as the
   *      value of options. The default value for matchBareFromJid is false.
   *
   *  - ignoreNamespaceFragment:
   *      When set to true, a fragment specified on the stanza's namespace
   *      URL will be ignored when it's matched with the one configured for
   *      the handler.
   *
   *      This means that if you register like this:
   *      >   connection.addHandler(
   *      >       handler,
   *      >       'http://jabber.org/protocol/muc',
   *      >       null, null, null, null,
   *      >       {'ignoreNamespaceFragment': true}
   *      >   );
   *
   *      Then a stanza with XML namespace of
   *      'http://jabber.org/protocol/muc#user' will also be matched. If
   *      'ignoreNamespaceFragment' is false, then only stanzas with
   *      'http://jabber.org/protocol/muc' will be matched.
   *
   *  Deleting the handler
   *  ~~~~~~~~~~~~~~~~~~~~
   *  The return value should be saved if you wish to remove the handler
   *  with deleteHandler().
   *
   *  Parameters:
   *    (Function) handler - The user callback.
   *    (String) ns - The namespace to match.
   *    (String) name - The stanza name to match.
   *    (String|Array) type - The stanza type (or types if an array) to match.
   *    (String) id - The stanza id attribute to match.
   *    (String) from - The stanza from attribute to match.
   *    (String) options - The handler options
   *
   *  Returns:
   *    A reference to the handler that can be used to remove it.
   */
  addHandler(handler, ns, name, type, id, from, options) {
    const hand = new Handler(handler, ns, name, type, id, from, options);
    this.addHandlers.push(hand);
    return hand;
  }

  /** Function: deleteHandler
   *  Delete a stanza handler for a connection.
   *
   *  This function removes a stanza handler from the connection.  The
   *  handRef parameter is *not* the function passed to addHandler(),
   *  but is the reference returned from addHandler().
   *
   *  Parameters:
   *    (Handler) handRef - The handler reference.
   */
  deleteHandler(handRef) {
    // this must be done in the Idle loop so that we don't change
    // the handlers during iteration
    this.removeHandlers.push(handRef);
    // If a handler is being deleted while it is being added,
    // prevent it from getting added
    const i = this.addHandlers.indexOf(handRef);
    if (i >= 0) {
      this.addHandlers.splice(i, 1);
    }
  }

  /** Function: registerSASLMechanisms
   *
   * Register the SASL mechanisms which will be supported by this instance of
   * Strophe.Connection (i.e. which this XMPP client will support).
   *
   *  Parameters:
   *    (Array) mechanisms - Array of objects with Strophe.SASLMechanism prototypes
   *
   */
  registerSASLMechanisms(mechanisms) {
    this.mechanisms = {};
    mechanisms = mechanisms || [Strophe.SASLAnonymous, Strophe.SASLExternal, Strophe.SASLOAuthBearer, Strophe.SASLXOAuth2, Strophe.SASLPlain, Strophe.SASLSHA1, Strophe.SASLSHA256, Strophe.SASLSHA384, Strophe.SASLSHA512];
    mechanisms.forEach(m => this.registerSASLMechanism(m));
  }

  /** Function: registerSASLMechanism
   *
   * Register a single SASL mechanism, to be supported by this client.
   *
   *  Parameters:
   *    (Object) mechanism - Object with a Strophe.SASLMechanism prototype
   *
   */
  registerSASLMechanism(Mechanism) {
    const mechanism = new Mechanism();
    this.mechanisms[mechanism.mechname] = mechanism;
  }

  /** Function: disconnect
   *  Start the graceful disconnection process.
   *
   *  This function starts the disconnection process.  This process starts
   *  by sending unavailable presence and sending BOSH body of type
   *  terminate.  A timeout handler makes sure that disconnection happens
   *  even if the BOSH server does not respond.
   *  If the Connection object isn't connected, at least tries to abort all pending requests
   *  so the connection object won't generate successful requests (which were already opened).
   *
   *  The user supplied connection callback will be notified of the
   *  progress as this process happens.
   *
   *  Parameters:
   *    (String) reason - The reason the disconnect is occuring.
   */
  disconnect(reason) {
    this._changeConnectStatus(Status.DISCONNECTING, reason);
    if (reason) {
      Strophe.warn('Disconnect was called because: ' + reason);
    } else {
      Strophe.info('Disconnect was called');
    }
    if (this.connected) {
      let pres = false;
      this.disconnecting = true;
      if (this.authenticated) {
        pres = $pres({
          'xmlns': Strophe.NS.CLIENT,
          'type': 'unavailable'
        });
      }
      // setup timeout handler
      this._disconnectTimeout = this._addSysTimedHandler(this.disconnection_timeout, this._onDisconnectTimeout.bind(this));
      this._proto._disconnect(pres);
    } else {
      Strophe.warn('Disconnect was called before Strophe connected to the server');
      this._proto._abortAllRequests();
      this._doDisconnect();
    }
  }

  /** PrivateFunction: _changeConnectStatus
   *  _Private_ helper function that makes sure plugins and the user's
   *  callback are notified of connection status changes.
   *
   *  Parameters:
   *    (Integer) status - the new connection status, one of the values
   *      in Strophe.Status
   *    (String) condition - the error condition or null
   *    (XMLElement) elem - The triggering stanza.
   */
  _changeConnectStatus(status, condition, elem) {
    // notify all plugins listening for status changes
    for (const k in Strophe._connectionPlugins) {
      if (Object.prototype.hasOwnProperty.call(Strophe._connectionPlugins, k)) {
        const plugin = this[k];
        if (plugin.statusChanged) {
          try {
            plugin.statusChanged(status, condition);
          } catch (err) {
            Strophe.error(`${k} plugin caused an exception changing status: ${err}`);
          }
        }
      }
    }
    // notify the user's callback
    if (this.connect_callback) {
      try {
        this.connect_callback(status, condition, elem);
      } catch (e) {
        Strophe._handleError(e);
        Strophe.error(`User connection callback caused an exception: ${e}`);
      }
    }
  }

  /** PrivateFunction: _doDisconnect
   *  _Private_ function to disconnect.
   *
   *  This is the last piece of the disconnection logic.  This resets the
   *  connection and alerts the user's connection callback.
   */
  _doDisconnect(condition) {
    if (typeof this._idleTimeout === 'number') {
      clearTimeout(this._idleTimeout);
    }

    // Cancel Disconnect Timeout
    if (this._disconnectTimeout !== null) {
      this.deleteTimedHandler(this._disconnectTimeout);
      this._disconnectTimeout = null;
    }
    Strophe.debug('_doDisconnect was called');
    this._proto._doDisconnect();
    this.authenticated = false;
    this.disconnecting = false;
    this.restored = false;

    // delete handlers
    this.handlers = [];
    this.timedHandlers = [];
    this.removeTimeds = [];
    this.removeHandlers = [];
    this.addTimeds = [];
    this.addHandlers = [];

    // tell the parent we disconnected
    this._changeConnectStatus(Status.DISCONNECTED, condition);
    this.connected = false;
  }

  /** PrivateFunction: _dataRecv
   *  _Private_ handler to processes incoming data from the the connection.
   *
   *  Except for _connect_cb handling the initial connection request,
   *  this function handles the incoming data for all requests.  This
   *  function also fires stanza handlers that match each incoming
   *  stanza.
   *
   *  Parameters:
   *    (Strophe.Request) req - The request that has data ready.
   *    (string) req - The stanza a raw string (optiona).
   */
  _dataRecv(req, raw) {
    const elem = this._proto._reqToData(req);
    if (elem === null) {
      return;
    }
    if (this.xmlInput !== Strophe.Connection.prototype.xmlInput) {
      if (elem.nodeName === this._proto.strip && elem.childNodes.length) {
        this.xmlInput(elem.childNodes[0]);
      } else {
        this.xmlInput(elem);
      }
    }
    if (this.rawInput !== Strophe.Connection.prototype.rawInput) {
      if (raw) {
        this.rawInput(raw);
      } else {
        this.rawInput(Strophe.serialize(elem));
      }
    }

    // remove handlers scheduled for deletion
    while (this.removeHandlers.length > 0) {
      const hand = this.removeHandlers.pop();
      const i = this.handlers.indexOf(hand);
      if (i >= 0) {
        this.handlers.splice(i, 1);
      }
    }

    // add handlers scheduled for addition
    while (this.addHandlers.length > 0) {
      this.handlers.push(this.addHandlers.pop());
    }

    // handle graceful disconnect
    if (this.disconnecting && this._proto._emptyQueue()) {
      this._doDisconnect();
      return;
    }
    const type = elem.getAttribute('type');
    if (type !== null && type === 'terminate') {
      // Don't process stanzas that come in after disconnect
      if (this.disconnecting) {
        return;
      }
      // an error occurred
      let cond = elem.getAttribute('condition');
      const conflict = elem.getElementsByTagName('conflict');
      if (cond !== null) {
        if (cond === 'remote-stream-error' && conflict.length > 0) {
          cond = 'conflict';
        }
        this._changeConnectStatus(Status.CONNFAIL, cond);
      } else {
        this._changeConnectStatus(Status.CONNFAIL, Strophe.ErrorCondition.UNKOWN_REASON);
      }
      this._doDisconnect(cond);
      return;
    }

    // send each incoming stanza through the handler chain
    Strophe.forEachChild(elem, null, child => {
      const matches = [];
      this.handlers = this.handlers.reduce((handlers, handler) => {
        try {
          if (handler.isMatch(child) && (this.authenticated || !handler.user)) {
            if (handler.run(child)) {
              handlers.push(handler);
            }
            matches.push(handler);
          } else {
            handlers.push(handler);
          }
        } catch (e) {
          // if the handler throws an exception, we consider it as false
          Strophe.warn('Removing Strophe handlers due to uncaught exception: ' + e.message);
        }
        return handlers;
      }, []);

      // If no handler was fired for an incoming IQ with type="set",
      // then we return an IQ error stanza with service-unavailable.
      if (!matches.length && this.iqFallbackHandler.isMatch(child)) {
        this.iqFallbackHandler.run(child);
      }
    });
  }

  /** PrivateFunction: _connect_cb
   *  _Private_ handler for initial connection request.
   *
   *  This handler is used to process the initial connection request
   *  response from the BOSH server. It is used to set up authentication
   *  handlers and start the authentication process.
   *
   *  SASL authentication will be attempted if available, otherwise
   *  the code will fall back to legacy authentication.
   *
   *  Parameters:
   *    (Strophe.Request) req - The current request.
   *    (Function) _callback - low level (xmpp) connect callback function.
   *      Useful for plugins with their own xmpp connect callback (when they
   *      want to do something special).
   */
  _connect_cb(req, _callback, raw) {
    Strophe.debug('_connect_cb was called');
    this.connected = true;
    let bodyWrap;
    try {
      bodyWrap = this._proto._reqToData(req);
    } catch (e) {
      if (e.name !== Strophe.ErrorCondition.BAD_FORMAT) {
        throw e;
      }
      this._changeConnectStatus(Status.CONNFAIL, Strophe.ErrorCondition.BAD_FORMAT);
      this._doDisconnect(Strophe.ErrorCondition.BAD_FORMAT);
    }
    if (!bodyWrap) {
      return;
    }
    if (this.xmlInput !== Strophe.Connection.prototype.xmlInput) {
      if (bodyWrap.nodeName === this._proto.strip && bodyWrap.childNodes.length) {
        this.xmlInput(bodyWrap.childNodes[0]);
      } else {
        this.xmlInput(bodyWrap);
      }
    }
    if (this.rawInput !== Strophe.Connection.prototype.rawInput) {
      if (raw) {
        this.rawInput(raw);
      } else {
        this.rawInput(Strophe.serialize(bodyWrap));
      }
    }
    const conncheck = this._proto._connect_cb(bodyWrap);
    if (conncheck === Status.CONNFAIL) {
      return;
    }

    // Check for the stream:features tag
    let hasFeatures;
    if (bodyWrap.getElementsByTagNameNS) {
      hasFeatures = bodyWrap.getElementsByTagNameNS(Strophe.NS.STREAM, 'features').length > 0;
    } else {
      hasFeatures = bodyWrap.getElementsByTagName('stream:features').length > 0 || bodyWrap.getElementsByTagName('features').length > 0;
    }
    if (!hasFeatures) {
      this._proto._no_auth_received(_callback);
      return;
    }
    const matched = Array.from(bodyWrap.getElementsByTagName('mechanism')).map(m => this.mechanisms[m.textContent]).filter(m => m);
    if (matched.length === 0) {
      if (bodyWrap.getElementsByTagName('auth').length === 0) {
        // There are no matching SASL mechanisms and also no legacy
        // auth available.
        this._proto._no_auth_received(_callback);
        return;
      }
    }
    if (this.do_authentication !== false) {
      this.authenticate(matched);
    }
  }

  /** Function: sortMechanismsByPriority
   *
   *  Sorts an array of objects with prototype SASLMechanism according to
   *  their priorities.
   *
   *  Parameters:
   *    (Array) mechanisms - Array of SASL mechanisms.
   *
   */
  // eslint-disable-next-line  class-methods-use-this
  sortMechanismsByPriority(mechanisms) {
    // Sorting mechanisms according to priority.
    for (let i = 0; i < mechanisms.length - 1; ++i) {
      let higher = i;
      for (let j = i + 1; j < mechanisms.length; ++j) {
        if (mechanisms[j].priority > mechanisms[higher].priority) {
          higher = j;
        }
      }
      if (higher !== i) {
        const swap = mechanisms[i];
        mechanisms[i] = mechanisms[higher];
        mechanisms[higher] = swap;
      }
    }
    return mechanisms;
  }

  /** Function: authenticate
   * Set up authentication
   *
   *  Continues the initial connection request by setting up authentication
   *  handlers and starting the authentication process.
   *
   *  SASL authentication will be attempted if available, otherwise
   *  the code will fall back to legacy authentication.
   *
   *  Parameters:
   *    (Array) matched - Array of SASL mechanisms supported.
   *
   */
  authenticate(matched) {
    if (!this._attemptSASLAuth(matched)) {
      this._attemptLegacyAuth();
    }
  }

  /** PrivateFunction: _attemptSASLAuth
   *
   *  Iterate through an array of SASL mechanisms and attempt authentication
   *  with the highest priority (enabled) mechanism.
   *
   *  Parameters:
   *    (Array) mechanisms - Array of SASL mechanisms.
   *
   *  Returns:
   *    (Boolean) mechanism_found - true or false, depending on whether a
   *          valid SASL mechanism was found with which authentication could be
   *          started.
   */
  _attemptSASLAuth(mechanisms) {
    mechanisms = this.sortMechanismsByPriority(mechanisms || []);
    let mechanism_found = false;
    for (let i = 0; i < mechanisms.length; ++i) {
      if (!mechanisms[i].test(this)) {
        continue;
      }
      this._sasl_success_handler = this._addSysHandler(this._sasl_success_cb.bind(this), null, 'success', null, null);
      this._sasl_failure_handler = this._addSysHandler(this._sasl_failure_cb.bind(this), null, 'failure', null, null);
      this._sasl_challenge_handler = this._addSysHandler(this._sasl_challenge_cb.bind(this), null, 'challenge', null, null);
      this._sasl_mechanism = mechanisms[i];
      this._sasl_mechanism.onStart(this);
      const request_auth_exchange = $build('auth', {
        'xmlns': Strophe.NS.SASL,
        'mechanism': this._sasl_mechanism.mechname
      });
      if (this._sasl_mechanism.isClientFirst) {
        const response = this._sasl_mechanism.clientChallenge(this);
        request_auth_exchange.t(btoa$1(response));
      }
      this.send(request_auth_exchange.tree());
      mechanism_found = true;
      break;
    }
    return mechanism_found;
  }

  /** PrivateFunction: _sasl_challenge_cb
   *  _Private_ handler for the SASL challenge
   *
   */
  async _sasl_challenge_cb(elem) {
    const challenge = atob$1(getText(elem));
    const response = await this._sasl_mechanism.onChallenge(this, challenge);
    const stanza = $build('response', {
      'xmlns': Strophe.NS.SASL
    });
    if (response !== '') {
      stanza.t(btoa$1(response));
    }
    this.send(stanza.tree());
    return true;
  }

  /** PrivateFunction: _attemptLegacyAuth
   *
   *  Attempt legacy (i.e. non-SASL) authentication.
   */
  _attemptLegacyAuth() {
    if (Strophe.getNodeFromJid(this.jid) === null) {
      // we don't have a node, which is required for non-anonymous
      // client connections
      this._changeConnectStatus(Status.CONNFAIL, Strophe.ErrorCondition.MISSING_JID_NODE);
      this.disconnect(Strophe.ErrorCondition.MISSING_JID_NODE);
    } else {
      // Fall back to legacy authentication
      this._changeConnectStatus(Status.AUTHENTICATING, null);
      this._addSysHandler(this._onLegacyAuthIQResult.bind(this), null, null, null, '_auth_1');
      this.send($iq({
        'type': 'get',
        'to': this.domain,
        'id': '_auth_1'
      }).c('query', {
        xmlns: Strophe.NS.AUTH
      }).c('username', {}).t(Strophe.getNodeFromJid(this.jid)).tree());
    }
  }

  /** PrivateFunction: _onLegacyAuthIQResult
   *  _Private_ handler for legacy authentication.
   *
   *  This handler is called in response to the initial <iq type='get'/>
   *  for legacy authentication.  It builds an authentication <iq/> and
   *  sends it, creating a handler (calling back to _auth2_cb()) to
   *  handle the result
   *
   *  Parameters:
   *    (XMLElement) elem - The stanza that triggered the callback.
   *
   *  Returns:
   *    false to remove the handler.
   */
  // eslint-disable-next-line no-unused-vars
  _onLegacyAuthIQResult(elem) {
    // build plaintext auth iq
    const iq = $iq({
      type: 'set',
      id: '_auth_2'
    }).c('query', {
      xmlns: Strophe.NS.AUTH
    }).c('username', {}).t(Strophe.getNodeFromJid(this.jid)).up().c('password').t(this.pass);
    if (!Strophe.getResourceFromJid(this.jid)) {
      // since the user has not supplied a resource, we pick
      // a default one here.  unlike other auth methods, the server
      // cannot do this for us.
      this.jid = Strophe.getBareJidFromJid(this.jid) + '/strophe';
    }
    iq.up().c('resource', {}).t(Strophe.getResourceFromJid(this.jid));
    this._addSysHandler(this._auth2_cb.bind(this), null, null, null, '_auth_2');
    this.send(iq.tree());
    return false;
  }

  /** PrivateFunction: _sasl_success_cb
   *  _Private_ handler for succesful SASL authentication.
   *
   *  Parameters:
   *    (XMLElement) elem - The matching stanza.
   *
   *  Returns:
   *    false to remove the handler.
   */
  _sasl_success_cb(elem) {
    if (this._sasl_data['server-signature']) {
      let serverSignature;
      const success = atob$1(getText(elem));
      const attribMatch = /([a-z]+)=([^,]+)(,|$)/;
      const matches = success.match(attribMatch);
      if (matches[1] === 'v') {
        serverSignature = matches[2];
      }
      if (serverSignature !== this._sasl_data['server-signature']) {
        // remove old handlers
        this.deleteHandler(this._sasl_failure_handler);
        this._sasl_failure_handler = null;
        if (this._sasl_challenge_handler) {
          this.deleteHandler(this._sasl_challenge_handler);
          this._sasl_challenge_handler = null;
        }
        this._sasl_data = {};
        return this._sasl_failure_cb(null);
      }
    }
    Strophe.info('SASL authentication succeeded.');
    if (this._sasl_data.keys) {
      this.scram_keys = this._sasl_data.keys;
    }
    if (this._sasl_mechanism) {
      this._sasl_mechanism.onSuccess();
    }
    // remove old handlers
    this.deleteHandler(this._sasl_failure_handler);
    this._sasl_failure_handler = null;
    if (this._sasl_challenge_handler) {
      this.deleteHandler(this._sasl_challenge_handler);
      this._sasl_challenge_handler = null;
    }
    const streamfeature_handlers = [];
    const wrapper = (handlers, elem) => {
      while (handlers.length) {
        this.deleteHandler(handlers.pop());
      }
      this._onStreamFeaturesAfterSASL(elem);
      return false;
    };
    streamfeature_handlers.push(this._addSysHandler(elem => wrapper(streamfeature_handlers, elem), null, 'stream:features', null, null));
    streamfeature_handlers.push(this._addSysHandler(elem => wrapper(streamfeature_handlers, elem), Strophe.NS.STREAM, 'features', null, null));

    // we must send an xmpp:restart now
    this._sendRestart();
    return false;
  }

  /** PrivateFunction: _onStreamFeaturesAfterSASL
   *  Parameters:
   *    (XMLElement) elem - The matching stanza.
   *
   *  Returns:
   *    false to remove the handler.
   */
  _onStreamFeaturesAfterSASL(elem) {
    // save stream:features for future usage
    this.features = elem;
    for (let i = 0; i < elem.childNodes.length; i++) {
      const child = elem.childNodes[i];
      if (child.nodeName === 'bind') {
        this.do_bind = true;
      }
      if (child.nodeName === 'session') {
        this.do_session = true;
      }
    }
    if (!this.do_bind) {
      this._changeConnectStatus(Status.AUTHFAIL, null);
      return false;
    } else if (!this.options.explicitResourceBinding) {
      this.bind();
    } else {
      this._changeConnectStatus(Status.BINDREQUIRED, null);
    }
    return false;
  }

  /** Function: bind
   *
   *  Sends an IQ to the XMPP server to bind a JID resource for this session.
   *
   *  https://tools.ietf.org/html/rfc6120#section-7.5
   *
   *  If `explicitResourceBinding` was set to a truthy value in the options
   *  passed to the Strophe.Connection constructor, then this function needs
   *  to be called explicitly by the client author.
   *
   *  Otherwise it'll be called automatically as soon as the XMPP server
   *  advertises the "urn:ietf:params:xml:ns:xmpp-bind" stream feature.
   */
  bind() {
    if (!this.do_bind) {
      Strophe.log(Strophe.LogLevel.INFO, `Strophe.Connection.prototype.bind called but "do_bind" is false`);
      return;
    }
    this._addSysHandler(this._onResourceBindResultIQ.bind(this), null, null, null, '_bind_auth_2');
    const resource = Strophe.getResourceFromJid(this.jid);
    if (resource) {
      this.send($iq({
        type: 'set',
        id: '_bind_auth_2'
      }).c('bind', {
        xmlns: Strophe.NS.BIND
      }).c('resource', {}).t(resource).tree());
    } else {
      this.send($iq({
        type: 'set',
        id: '_bind_auth_2'
      }).c('bind', {
        xmlns: Strophe.NS.BIND
      }).tree());
    }
  }

  /** PrivateFunction: _onResourceBindIQ
   *  _Private_ handler for binding result and session start.
   *
   *  Parameters:
   *    (XMLElement) elem - The matching stanza.
   *
   *  Returns:
   *    false to remove the handler.
   */
  _onResourceBindResultIQ(elem) {
    if (elem.getAttribute('type') === 'error') {
      Strophe.warn('Resource binding failed.');
      const conflict = elem.getElementsByTagName('conflict');
      let condition;
      if (conflict.length > 0) {
        condition = Strophe.ErrorCondition.CONFLICT;
      }
      this._changeConnectStatus(Status.AUTHFAIL, condition, elem);
      return false;
    }
    // TODO - need to grab errors
    const bind = elem.getElementsByTagName('bind');
    if (bind.length > 0) {
      const jidNode = bind[0].getElementsByTagName('jid');
      if (jidNode.length > 0) {
        this.authenticated = true;
        this.jid = getText(jidNode[0]);
        if (this.do_session) {
          this._establishSession();
        } else {
          this._changeConnectStatus(Status.CONNECTED, null);
        }
      }
    } else {
      Strophe.warn('Resource binding failed.');
      this._changeConnectStatus(Status.AUTHFAIL, null, elem);
      return false;
    }
  }

  /** PrivateFunction: _establishSession
   *  Send IQ request to establish a session with the XMPP server.
   *
   *  See https://xmpp.org/rfcs/rfc3921.html#session
   *
   *  Note: The protocol for session establishment has been determined as
   *  unnecessary and removed in RFC-6121.
   */
  _establishSession() {
    if (!this.do_session) {
      throw new Error(`Strophe.Connection.prototype._establishSession ` + `called but apparently ${Strophe.NS.SESSION} wasn't advertised by the server`);
    }
    this._addSysHandler(this._onSessionResultIQ.bind(this), null, null, null, '_session_auth_2');
    this.send($iq({
      type: 'set',
      id: '_session_auth_2'
    }).c('session', {
      xmlns: Strophe.NS.SESSION
    }).tree());
  }

  /** PrivateFunction: _onSessionResultIQ
   *  _Private_ handler for the server's IQ response to a client's session
   *  request.
   *
   *  This sets Connection.authenticated to true on success, which
   *  starts the processing of user handlers.
   *
   *  See https://xmpp.org/rfcs/rfc3921.html#session
   *
   *  Note: The protocol for session establishment has been determined as
   *  unnecessary and removed in RFC-6121.
   *
   *  Parameters:
   *    (XMLElement) elem - The matching stanza.
   *
   *  Returns:
   *    false to remove the handler.
   */
  _onSessionResultIQ(elem) {
    if (elem.getAttribute('type') === 'result') {
      this.authenticated = true;
      this._changeConnectStatus(Status.CONNECTED, null);
    } else if (elem.getAttribute('type') === 'error') {
      this.authenticated = false;
      Strophe.warn('Session creation failed.');
      this._changeConnectStatus(Status.AUTHFAIL, null, elem);
      return false;
    }
    return false;
  }

  /** PrivateFunction: _sasl_failure_cb
   *  _Private_ handler for SASL authentication failure.
   *
   *  Parameters:
   *    (XMLElement) elem - The matching stanza.
   *
   *  Returns:
   *    false to remove the handler.
   */
  _sasl_failure_cb(elem) {
    // delete unneeded handlers
    if (this._sasl_success_handler) {
      this.deleteHandler(this._sasl_success_handler);
      this._sasl_success_handler = null;
    }
    if (this._sasl_challenge_handler) {
      this.deleteHandler(this._sasl_challenge_handler);
      this._sasl_challenge_handler = null;
    }
    if (this._sasl_mechanism) this._sasl_mechanism.onFailure();
    this._changeConnectStatus(Status.AUTHFAIL, null, elem);
    return false;
  }

  /** PrivateFunction: _auth2_cb
   *  _Private_ handler to finish legacy authentication.
   *
   *  This handler is called when the result from the jabber:iq:auth
   *  <iq/> stanza is returned.
   *
   *  Parameters:
   *    (XMLElement) elem - The stanza that triggered the callback.
   *
   *  Returns:
   *    false to remove the handler.
   */
  _auth2_cb(elem) {
    if (elem.getAttribute('type') === 'result') {
      this.authenticated = true;
      this._changeConnectStatus(Status.CONNECTED, null);
    } else if (elem.getAttribute('type') === 'error') {
      this._changeConnectStatus(Status.AUTHFAIL, null, elem);
      this.disconnect('authentication failed');
    }
    return false;
  }

  /** PrivateFunction: _addSysTimedHandler
   *  _Private_ function to add a system level timed handler.
   *
   *  This function is used to add a Strophe.TimedHandler for the
   *  library code.  System timed handlers are allowed to run before
   *  authentication is complete.
   *
   *  Parameters:
   *    (Integer) period - The period of the handler.
   *    (Function) handler - The callback function.
   */
  _addSysTimedHandler(period, handler) {
    const thand = new TimedHandler(period, handler);
    thand.user = false;
    this.addTimeds.push(thand);
    return thand;
  }

  /** PrivateFunction: _addSysHandler
   *  _Private_ function to add a system level stanza handler.
   *
   *  This function is used to add a Handler for the
   *  library code.  System stanza handlers are allowed to run before
   *  authentication is complete.
   *
   *  Parameters:
   *    (Function) handler - The callback function.
   *    (String) ns - The namespace to match.
   *    (String) name - The stanza name to match.
   *    (String) type - The stanza type attribute to match.
   *    (String) id - The stanza id attribute to match.
   */
  _addSysHandler(handler, ns, name, type, id) {
    const hand = new Handler(handler, ns, name, type, id);
    hand.user = false;
    this.addHandlers.push(hand);
    return hand;
  }

  /** PrivateFunction: _onDisconnectTimeout
   *  _Private_ timeout handler for handling non-graceful disconnection.
   *
   *  If the graceful disconnect process does not complete within the
   *  time allotted, this handler finishes the disconnect anyway.
   *
   *  Returns:
   *    false to remove the handler.
   */
  _onDisconnectTimeout() {
    Strophe.debug('_onDisconnectTimeout was called');
    this._changeConnectStatus(Status.CONNTIMEOUT, null);
    this._proto._onDisconnectTimeout();
    // actually disconnect
    this._doDisconnect();
    return false;
  }

  /** PrivateFunction: _onIdle
   *  _Private_ handler to process events during idle cycle.
   *
   *  This handler is called every 100ms to fire timed handlers that
   *  are ready and keep poll requests going.
   */
  _onIdle() {
    // add timed handlers scheduled for addition
    // NOTE: we add before remove in the case a timed handler is
    // added and then deleted before the next _onIdle() call.
    while (this.addTimeds.length > 0) {
      this.timedHandlers.push(this.addTimeds.pop());
    }

    // remove timed handlers that have been scheduled for deletion
    while (this.removeTimeds.length > 0) {
      const thand = this.removeTimeds.pop();
      const i = this.timedHandlers.indexOf(thand);
      if (i >= 0) {
        this.timedHandlers.splice(i, 1);
      }
    }

    // call ready timed handlers
    const now = new Date().getTime();
    const newList = [];
    for (let i = 0; i < this.timedHandlers.length; i++) {
      const thand = this.timedHandlers[i];
      if (this.authenticated || !thand.user) {
        const since = thand.lastCalled + thand.period;
        if (since - now <= 0) {
          if (thand.run()) {
            newList.push(thand);
          }
        } else {
          newList.push(thand);
        }
      }
    }
    this.timedHandlers = newList;
    clearTimeout(this._idleTimeout);
    this._proto._onIdle();

    // reactivate the timer only if connected
    if (this.connected) {
      this._idleTimeout = setTimeout(() => this._onIdle(), 100);
    }
  }
}

/** Class: Strophe.SASLMechanism
 *
 *  Encapsulates an SASL authentication mechanism.
 *
 *  User code may override the priority for each mechanism or disable it completely.
 *  See <priority> for information about changing priority and <test> for informatian on
 *  how to disable a mechanism.
 *
 *  By default, all mechanisms are enabled and the priorities are
 *
 *      SCRAM-SHA-512 - 72
 *      SCRAM-SHA-384 - 71
 *      SCRAM-SHA-256 - 70
 *      SCRAM-SHA-1   - 60
 *      PLAIN         - 50
 *      OAUTHBEARER   - 40
 *      X-OAUTH2      - 30
 *      ANONYMOUS     - 20
 *      EXTERNAL      - 10
 *
 *  See: Strophe.Connection.addSupportedSASLMechanisms
 */
class SASLMechanism {
  /**
   * PrivateConstructor: Strophe.SASLMechanism
   * SASL auth mechanism abstraction.
   *
   *  Parameters:
   *    (String) name - SASL Mechanism name.
   *    (Boolean) isClientFirst - If client should send response first without challenge.
   *    (Number) priority - Priority.
   *
   *  Returns:
   *    A new Strophe.SASLMechanism object.
   */
  constructor(name, isClientFirst, priority) {
    /** PrivateVariable: mechname
     *  Mechanism name.
     */
    this.mechname = name;

    /** PrivateVariable: isClientFirst
     *  If client sends response without initial server challenge.
     */
    this.isClientFirst = isClientFirst;

    /** Variable: priority
     *  Determines which <SASLMechanism> is chosen for authentication (Higher is better).
     *  Users may override this to prioritize mechanisms differently.
     *
     *  Example: (This will cause Strophe to choose the mechanism that the server sent first)
     *
     *  > Strophe.SASLPlain.priority = Strophe.SASLSHA1.priority;
     *
     *  See <SASL mechanisms> for a list of available mechanisms.
     *
     */
    this.priority = priority;
  }

  /**
   *  Function: test
   *  Checks if mechanism able to run.
   *  To disable a mechanism, make this return false;
   *
   *  To disable plain authentication run
   *  > Strophe.SASLPlain.test = function() {
   *  >   return false;
   *  > }
   *
   *  See <SASL mechanisms> for a list of available mechanisms.
   *
   *  Parameters:
   *    (Strophe.Connection) connection - Target Connection.
   *
   *  Returns:
   *    (Boolean) If mechanism was able to run.
   */
  // eslint-disable-next-line class-methods-use-this
  test() {
    return true;
  }

  /** PrivateFunction: onStart
   *  Called before starting mechanism on some connection.
   *
   *  Parameters:
   *    (Strophe.Connection) connection - Target Connection.
   */
  onStart(connection) {
    this._connection = connection;
  }

  /** PrivateFunction: onChallenge
   *  Called by protocol implementation on incoming challenge.
   *
   *  By deafult, if the client is expected to send data first (isClientFirst === true),
   *  this method is called with `challenge` as null on the first call,
   *  unless `clientChallenge` is overridden in the relevant subclass.
   *
   *  Parameters:
   *    (Strophe.Connection) connection - Target Connection.
   *    (String) challenge - current challenge to handle.
   *
   *  Returns:
   *    (String) Mechanism response.
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  onChallenge(connection, challenge) {
    throw new Error('You should implement challenge handling!');
  }

  /** PrivateFunction: clientChallenge
   *  Called by the protocol implementation if the client is expected to send
   *  data first in the authentication exchange (i.e. isClientFirst === true).
   *
   *  Parameters:
   *    (Strophe.Connection) connection - Target Connection.
   *
   *  Returns:
   *    (String) Mechanism response.
   */
  clientChallenge(connection) {
    if (!this.isClientFirst) {
      throw new Error('clientChallenge should not be called if isClientFirst is false!');
    }
    return this.onChallenge(connection);
  }

  /** PrivateFunction: onFailure
   *  Protocol informs mechanism implementation about SASL failure.
   */
  onFailure() {
    this._connection = null;
  }

  /** PrivateFunction: onSuccess
   *  Protocol informs mechanism implementation about SASL success.
   */
  onSuccess() {
    this._connection = null;
  }
}

// Building SASL callbacks

class SASLAnonymous extends SASLMechanism {
  /** PrivateConstructor: SASLAnonymous
   *  SASL ANONYMOUS authentication.
   */
  constructor() {
    let mechname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ANONYMOUS';
    let isClientFirst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
    super(mechname, isClientFirst, priority);
  }

  // eslint-disable-next-line class-methods-use-this
  test(connection) {
    return connection.authcid === null;
  }
}

class SASLExternal extends SASLMechanism {
  /** PrivateConstructor: SASLExternal
   *  SASL EXTERNAL authentication.
   *
   *  The EXTERNAL mechanism allows a client to request the server to use
   *  credentials established by means external to the mechanism to
   *  authenticate the client. The external means may be, for instance,
   *  TLS services.
   */
  constructor() {
    let mechname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'EXTERNAL';
    let isClientFirst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
    super(mechname, isClientFirst, priority);
  }

  // eslint-disable-next-line class-methods-use-this
  onChallenge(connection) {
    /** According to XEP-178, an authzid SHOULD NOT be presented when the
     * authcid contained or implied in the client certificate is the JID (i.e.
     * authzid) with which the user wants to log in as.
     *
     * To NOT send the authzid, the user should therefore set the authcid equal
     * to the JID when instantiating a new Strophe.Connection object.
     */
    return connection.authcid === connection.authzid ? '' : connection.authzid;
  }
}

class SASLOAuthBearer extends SASLMechanism {
  /** PrivateConstructor: SASLOAuthBearer
   *  SASL OAuth Bearer authentication.
   */
  constructor() {
    let mechname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'OAUTHBEARER';
    let isClientFirst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 40;
    super(mechname, isClientFirst, priority);
  }

  // eslint-disable-next-line class-methods-use-this
  test(connection) {
    return connection.pass !== null;
  }

  // eslint-disable-next-line class-methods-use-this
  onChallenge(connection) {
    let auth_str = 'n,';
    if (connection.authcid !== null) {
      auth_str = auth_str + 'a=' + connection.authzid;
    }
    auth_str = auth_str + ',';
    auth_str = auth_str + '\u0001';
    auth_str = auth_str + 'auth=Bearer ';
    auth_str = auth_str + connection.pass;
    auth_str = auth_str + '\u0001';
    auth_str = auth_str + '\u0001';
    return utils.utf16to8(auth_str);
  }
}

class SASLPlain extends SASLMechanism {
  /** PrivateConstructor: SASLPlain
   *  SASL PLAIN authentication.
   */
  constructor() {
    let mechname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'PLAIN';
    let isClientFirst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 50;
    super(mechname, isClientFirst, priority);
  }

  // eslint-disable-next-line class-methods-use-this
  test(connection) {
    return connection.authcid !== null;
  }

  // eslint-disable-next-line class-methods-use-this
  onChallenge(connection) {
    const {
      authcid,
      authzid,
      domain,
      pass
    } = connection;
    if (!domain) {
      throw new Error('SASLPlain onChallenge: domain is not defined!');
    }
    // Only include authzid if it differs from authcid.
    // See: https://tools.ietf.org/html/rfc6120#section-6.3.8
    let auth_str = authzid !== `${authcid}@${domain}` ? authzid : '';
    auth_str = auth_str + '\u0000';
    auth_str = auth_str + authcid;
    auth_str = auth_str + '\u0000';
    auth_str = auth_str + pass;
    return utils.utf16to8(auth_str);
  }
}

async function scramClientProof(authMessage, clientKey, hashName) {
  const storedKey = await crypto.subtle.importKey('raw', await crypto.subtle.digest(hashName, clientKey), {
    'name': 'HMAC',
    'hash': hashName
  }, false, ['sign']);
  const clientSignature = await crypto.subtle.sign('HMAC', storedKey, utils.stringToArrayBuf(authMessage));
  return utils.xorArrayBuffers(clientKey, clientSignature);
}

/* This function parses the information in a SASL SCRAM challenge response,
 * into an object of the form
 * { nonce: String,
 *   salt:  ArrayBuffer,
 *   iter:  Int
 * }
 * Returns undefined on failure.
 */
function scramParseChallenge(challenge) {
  let nonce, salt, iter;
  const attribMatch = /([a-z]+)=([^,]+)(,|$)/;
  while (challenge.match(attribMatch)) {
    const matches = challenge.match(attribMatch);
    challenge = challenge.replace(matches[0], '');
    switch (matches[1]) {
      case 'r':
        nonce = matches[2];
        break;
      case 's':
        salt = utils.base64ToArrayBuf(matches[2]);
        break;
      case 'i':
        iter = parseInt(matches[2], 10);
        break;
      default:
        return undefined;
    }
  }

  // Consider iteration counts less than 4096 insecure, as reccommended by
  // RFC 5802
  if (isNaN(iter) || iter < 4096) {
    Strophe.warn('Failing SCRAM authentication because server supplied iteration count < 4096.');
    return undefined;
  }
  if (!salt) {
    Strophe.warn('Failing SCRAM authentication because server supplied incorrect salt.');
    return undefined;
  }
  return {
    'nonce': nonce,
    'salt': salt,
    'iter': iter
  };
}

/* Derive the client and server keys given a string password,
 * a hash name, and a bit length.
 * Returns an object of the following form:
 * { ck: ArrayBuffer, the client key
 *   sk: ArrayBuffer, the server key
 * }
 */
async function scramDeriveKeys(password, salt, iter, hashName, hashBits) {
  const saltedPasswordBits = await crypto.subtle.deriveBits({
    'name': 'PBKDF2',
    'salt': salt,
    'iterations': iter,
    'hash': {
      'name': hashName
    }
  }, await crypto.subtle.importKey('raw', utils.stringToArrayBuf(password), 'PBKDF2', false, ['deriveBits']), hashBits);
  const saltedPassword = await crypto.subtle.importKey('raw', saltedPasswordBits, {
    'name': 'HMAC',
    'hash': hashName
  }, false, ['sign']);
  return {
    'ck': await crypto.subtle.sign('HMAC', saltedPassword, utils.stringToArrayBuf('Client Key')),
    'sk': await crypto.subtle.sign('HMAC', saltedPassword, utils.stringToArrayBuf('Server Key'))
  };
}
async function scramServerSign(authMessage, sk, hashName) {
  const serverKey = await crypto.subtle.importKey('raw', sk, {
    'name': 'HMAC',
    'hash': hashName
  }, false, ['sign']);
  return crypto.subtle.sign('HMAC', serverKey, utils.stringToArrayBuf(authMessage));
}

// Generate an ASCII nonce (not containing the ',' character)
function generate_cnonce() {
  // generate 16 random bytes of nonce, base64 encoded
  const bytes = new Uint8Array(16);
  return utils.arrayBufToBase64(crypto.getRandomValues(bytes).buffer);
}
const scram = {
  /* On success, sets
   * connection_sasl_data["server-signature"]
   * and
   * connection._sasl_data.keys
   *
   * The server signature should be verified after this function completes..
   *
   * On failure, returns connection._sasl_failure_cb();
   */
  async scramResponse(connection, challenge, hashName, hashBits) {
    var _connection$pass, _connection$pass2, _connection$pass3;
    const cnonce = connection._sasl_data.cnonce;
    const challengeData = scramParseChallenge(challenge);

    // The RFC requires that we verify the (server) nonce has the client
    // nonce as an initial substring.
    if (!challengeData && (challengeData === null || challengeData === void 0 ? void 0 : challengeData.nonce.slice(0, cnonce.length)) !== cnonce) {
      Strophe.warn('Failing SCRAM authentication because server supplied incorrect nonce.');
      connection._sasl_data = {};
      return connection._sasl_failure_cb();
    }
    let clientKey, serverKey;

    // Either restore the client key and server key passed in, or derive new ones
    if (((_connection$pass = connection.pass) === null || _connection$pass === void 0 ? void 0 : _connection$pass.name) === hashName && ((_connection$pass2 = connection.pass) === null || _connection$pass2 === void 0 ? void 0 : _connection$pass2.salt) === utils.arrayBufToBase64(challengeData.salt) && ((_connection$pass3 = connection.pass) === null || _connection$pass3 === void 0 ? void 0 : _connection$pass3.iter) === challengeData.iter) {
      clientKey = utils.base64ToArrayBuf(connection.pass.ck);
      serverKey = utils.base64ToArrayBuf(connection.pass.sk);
    } else if (typeof connection.pass === 'string' || connection.pass instanceof String) {
      const keys = await scramDeriveKeys(connection.pass, challengeData.salt, challengeData.iter, hashName, hashBits);
      clientKey = keys.ck;
      serverKey = keys.sk;
    } else {
      return connection._sasl_failure_cb();
    }
    const clientFirstMessageBare = connection._sasl_data['client-first-message-bare'];
    const serverFirstMessage = challenge;
    const clientFinalMessageBare = `c=biws,r=${challengeData.nonce}`;
    const authMessage = `${clientFirstMessageBare},${serverFirstMessage},${clientFinalMessageBare}`;
    const clientProof = await scramClientProof(authMessage, clientKey, hashName);
    const serverSignature = await scramServerSign(authMessage, serverKey, hashName);
    connection._sasl_data['server-signature'] = utils.arrayBufToBase64(serverSignature);
    connection._sasl_data.keys = {
      'name': hashName,
      'iter': challengeData.iter,
      'salt': utils.arrayBufToBase64(challengeData.salt),
      'ck': utils.arrayBufToBase64(clientKey),
      'sk': utils.arrayBufToBase64(serverKey)
    };
    return `${clientFinalMessageBare},p=${utils.arrayBufToBase64(clientProof)}`;
  },
  // Returns a string containing the client first message
  clientChallenge(connection, test_cnonce) {
    const cnonce = test_cnonce || generate_cnonce();
    const client_first_message_bare = `n=${connection.authcid},r=${cnonce}`;
    connection._sasl_data.cnonce = cnonce;
    connection._sasl_data['client-first-message-bare'] = client_first_message_bare;
    return `n,,${client_first_message_bare}`;
  }
};

class SASLSHA1 extends SASLMechanism {
  /** PrivateConstructor: SASLSHA1
   *  SASL SCRAM SHA 1 authentication.
   */
  constructor() {
    let mechname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'SCRAM-SHA-1';
    let isClientFirst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
    super(mechname, isClientFirst, priority);
  }

  // eslint-disable-next-line class-methods-use-this
  test(connection) {
    return connection.authcid !== null;
  }

  // eslint-disable-next-line class-methods-use-this
  async onChallenge(connection, challenge) {
    return await scram.scramResponse(connection, challenge, 'SHA-1', 160);
  }

  // eslint-disable-next-line class-methods-use-this
  clientChallenge(connection, test_cnonce) {
    return scram.clientChallenge(connection, test_cnonce);
  }
}

class SASLSHA256 extends SASLMechanism {
  /** PrivateConstructor: SASLSHA256
   *  SASL SCRAM SHA 256 authentication.
   */
  constructor() {
    let mechname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'SCRAM-SHA-256';
    let isClientFirst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 70;
    super(mechname, isClientFirst, priority);
  }

  // eslint-disable-next-line class-methods-use-this
  test(connection) {
    return connection.authcid !== null;
  }

  // eslint-disable-next-line class-methods-use-this
  async onChallenge(connection, challenge) {
    return await scram.scramResponse(connection, challenge, 'SHA-256', 256);
  }

  // eslint-disable-next-line class-methods-use-this
  clientChallenge(connection, test_cnonce) {
    return scram.clientChallenge(connection, test_cnonce);
  }
}

class SASLSHA384 extends SASLMechanism {
  /** PrivateConstructor: SASLSHA384
   *  SASL SCRAM SHA 384 authentication.
   */
  constructor() {
    let mechname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'SCRAM-SHA-384';
    let isClientFirst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 71;
    super(mechname, isClientFirst, priority);
  }

  // eslint-disable-next-line class-methods-use-this
  test(connection) {
    return connection.authcid !== null;
  }

  // eslint-disable-next-line class-methods-use-this
  async onChallenge(connection, challenge) {
    return await scram.scramResponse(connection, challenge, 'SHA-384', 384);
  }

  // eslint-disable-next-line class-methods-use-this
  clientChallenge(connection, test_cnonce) {
    return scram.clientChallenge(connection, test_cnonce);
  }
}

class SASLSHA512 extends SASLMechanism {
  /** PrivateConstructor: SASLSHA512
   *  SASL SCRAM SHA 512 authentication.
   */
  constructor() {
    let mechname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'SCRAM-SHA-512';
    let isClientFirst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 72;
    super(mechname, isClientFirst, priority);
  }

  // eslint-disable-next-line class-methods-use-this
  test(connection) {
    return connection.authcid !== null;
  }

  // eslint-disable-next-line class-methods-use-this
  async onChallenge(connection, challenge) {
    return await scram.scramResponse(connection, challenge, 'SHA-512', 512);
  }

  // eslint-disable-next-line class-methods-use-this
  clientChallenge(connection, test_cnonce) {
    return scram.clientChallenge(connection, test_cnonce);
  }
}

class SASLXOAuth2 extends SASLMechanism {
  /** PrivateConstructor: SASLXOAuth2
   *  SASL X-OAuth2 authentication.
   */
  constructor() {
    let mechname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'X-OAUTH2';
    let isClientFirst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;
    super(mechname, isClientFirst, priority);
  }

  // eslint-disable-next-line class-methods-use-this
  test(connection) {
    return connection.pass !== null;
  }

  // eslint-disable-next-line class-methods-use-this
  onChallenge(connection) {
    let auth_str = '\u0000';
    if (connection.authcid !== null) {
      auth_str = auth_str + connection.authzid;
    }
    auth_str = auth_str + '\u0000';
    auth_str = auth_str + connection.pass;
    return utils.utf16to8(auth_str);
  }
}

/*
    This program is distributed under the terms of the MIT license.
    Please see the LICENSE file for details.

    Copyright 2006-2018, OGG, LLC
*/

/** Class: Strophe
 *  An object container for all Strophe library functions.
 *
 *  This class is just a container for all the objects and constants
 *  used in the library.  It is not meant to be instantiated, but to
 *  provide a namespace for library objects, constants, and functions.
 */
const Strophe = {
  /** Constant: VERSION */
  VERSION: '1.6.1',
  Builder,
  Connection,
  ElementType,
  ErrorCondition,
  Handler,
  LogLevel,
  NS,
  SASLMechanism,
  Status,
  TimedHandler,
  ...utils$1,
  XHTML: {
    ...XHTML,
    validTag: validTag,
    validCSS: validCSS,
    validAttribute: validAttribute
  },
  /** Function: addNamespace
   *  This function is used to extend the current namespaces in
   *  Strophe.NS.  It takes a key and a value with the key being the
   *  name of the new namespace, with its actual value.
   *  For example:
   *  Strophe.addNamespace('PUBSUB', "http://jabber.org/protocol/pubsub");
   *
   *  Parameters:
   *    (String) name - The name under which the namespace will be
   *      referenced under Strophe.NS
   *    (String) value - The actual namespace.
   */
  addNamespace(name, value) {
    Strophe.NS[name] = value;
  },
  /** PrivateFunction: _handleError
   *  _Private_ function that properly logs an error to the console
   */
  _handleError(e) {
    if (typeof e.stack !== 'undefined') {
      Strophe.fatal(e.stack);
    }
    if (e.sourceURL) {
      Strophe.fatal('error: ' + this.handler + ' ' + e.sourceURL + ':' + e.line + ' - ' + e.name + ': ' + e.message);
    } else if (e.fileName) {
      Strophe.fatal('error: ' + this.handler + ' ' + e.fileName + ':' + e.lineNumber + ' - ' + e.name + ': ' + e.message);
    } else {
      Strophe.fatal('error: ' + e.message);
    }
  },
  /** Function: log
   *  User overrideable logging function.
   *
   *  This function is called whenever the Strophe library calls any
   *  of the logging functions.  The default implementation of this
   *  function logs only fatal errors.  If client code wishes to handle the logging
   *  messages, it should override this with
   *  > Strophe.log = function (level, msg) {
   *  >   (user code here)
   *  > };
   *
   *  Please note that data sent and received over the wire is logged
   *  via Strophe.Connection.rawInput() and Strophe.Connection.rawOutput().
   *
   *  The different levels and their meanings are
   *
   *    DEBUG - Messages useful for debugging purposes.
   *    INFO - Informational messages.  This is mostly information like
   *      'disconnect was called' or 'SASL auth succeeded'.
   *    WARN - Warnings about potential problems.  This is mostly used
   *      to report transient connection errors like request timeouts.
   *    ERROR - Some error occurred.
   *    FATAL - A non-recoverable fatal error occurred.
   *
   *  Parameters:
   *    (Integer) level - The log level of the log message.  This will
   *      be one of the values in Strophe.LogLevel.
   *    (String) msg - The log message.
   */
  log(level, msg) {
    if (level === this.LogLevel.FATAL) {
      var _console;
      (_console = console) === null || _console === void 0 ? void 0 : _console.error(msg);
    }
  },
  /** Function: debug
   *  Log a message at the Strophe.LogLevel.DEBUG level.
   *
   *  Parameters:
   *    (String) msg - The log message.
   */
  debug(msg) {
    this.log(this.LogLevel.DEBUG, msg);
  },
  /** Function: info
   *  Log a message at the Strophe.LogLevel.INFO level.
   *
   *  Parameters:
   *    (String) msg - The log message.
   */
  info(msg) {
    this.log(this.LogLevel.INFO, msg);
  },
  /** Function: warn
   *  Log a message at the Strophe.LogLevel.WARN level.
   *
   *  Parameters:
   *    (String) msg - The log message.
   */
  warn(msg) {
    this.log(this.LogLevel.WARN, msg);
  },
  /** Function: error
   *  Log a message at the Strophe.LogLevel.ERROR level.
   *
   *  Parameters:
   *    (String) msg - The log message.
   */
  error(msg) {
    this.log(this.LogLevel.ERROR, msg);
  },
  /** Function: fatal
   *  Log a message at the Strophe.LogLevel.FATAL level.
   *
   *  Parameters:
   *    (String) msg - The log message.
   */
  fatal(msg) {
    this.log(this.LogLevel.FATAL, msg);
  },
  /** PrivateVariable: _requestId
   *  _Private_ variable that keeps track of the request ids for
   *  connections.
   */
  _requestId: 0,
  /** PrivateVariable: Strophe.connectionPlugins
   *  _Private_ variable Used to store plugin names that need
   *  initialization on Strophe.Connection construction.
   */
  _connectionPlugins: {},
  /** Function: addConnectionPlugin
   *  Extends the Strophe.Connection object with the given plugin.
   *
   *  Parameters:
   *    (String) name - The name of the extension.
   *    (Object) ptype - The plugin's prototype.
   */
  addConnectionPlugin(name, ptype) {
    Strophe._connectionPlugins[name] = ptype;
  }
};

/** Constants: SASL mechanisms
 *  Available authentication mechanisms
 *
 *  Strophe.SASLAnonymous   - SASL ANONYMOUS authentication.
 *  Strophe.SASLPlain       - SASL PLAIN authentication.
 *  Strophe.SASLSHA1        - SASL SCRAM-SHA-1 authentication
 *  Strophe.SASLSHA256      - SASL SCRAM-SHA-256 authentication
 *  Strophe.SASLSHA384      - SASL SCRAM-SHA-384 authentication
 *  Strophe.SASLSHA512      - SASL SCRAM-SHA-512 authentication
 *  Strophe.SASLOAuthBearer - SASL OAuth Bearer authentication
 *  Strophe.SASLExternal    - SASL EXTERNAL authentication
 *  Strophe.SASLXOAuth2     - SASL X-OAuth2 authentication
 */
Strophe.SASLAnonymous = SASLAnonymous;
Strophe.SASLPlain = SASLPlain;
Strophe.SASLSHA1 = SASLSHA1;
Strophe.SASLSHA256 = SASLSHA256;
Strophe.SASLSHA384 = SASLSHA384;
Strophe.SASLSHA512 = SASLSHA512;
Strophe.SASLOAuthBearer = SASLOAuthBearer;
Strophe.SASLExternal = SASLExternal;
Strophe.SASLXOAuth2 = SASLXOAuth2;
var core = {
  'Strophe': Strophe,
  '$build': $build,
  '$iq': $iq,
  '$msg': $msg,
  '$pres': $pres
};

/*
    This program is distributed under the terms of the MIT license.
    Please see the LICENSE file for details.

    Copyright 2006-2008, OGG, LLC
*/

/** PrivateClass: Strophe.Request
 *  _Private_ helper class that provides a cross implementation abstraction
 *  for a BOSH related XMLHttpRequest.
 *
 *  The Strophe.Request class is used internally to encapsulate BOSH request
 *  information.  It is not meant to be used from user's code.
 */
Strophe.Request = class Request {
  /** PrivateConstructor: Strophe.Request
   *  Create and initialize a new Strophe.Request object.
   *
   *  Parameters:
   *    (XMLElement) elem - The XML data to be sent in the request.
   *    (Function) func - The function that will be called when the
   *      XMLHttpRequest readyState changes.
   *    (Integer) rid - The BOSH rid attribute associated with this request.
   *    (Integer) sends - The number of times this same request has been sent.
   */
  constructor(elem, func, rid, sends) {
    this.id = ++Strophe._requestId;
    this.xmlData = elem;
    this.data = Strophe.serialize(elem);
    // save original function in case we need to make a new request
    // from this one.
    this.origFunc = func;
    this.func = func;
    this.rid = rid;
    this.date = NaN;
    this.sends = sends || 0;
    this.abort = false;
    this.dead = null;
    this.age = function () {
      if (!this.date) {
        return 0;
      }
      const now = new Date();
      return (now - this.date) / 1000;
    };
    this.timeDead = function () {
      if (!this.dead) {
        return 0;
      }
      const now = new Date();
      return (now - this.dead) / 1000;
    };
    this.xhr = this._newXHR();
  }

  /** PrivateFunction: getResponse
   *  Get a response from the underlying XMLHttpRequest.
   *
   *  This function attempts to get a response from the request and checks
   *  for errors.
   *
   *  Throws:
   *    "parsererror" - A parser error occured.
   *    "bad-format" - The entity has sent XML that cannot be processed.
   *
   *  Returns:
   *    The DOM element tree of the response.
   */
  getResponse() {
    let node = null;
    if (this.xhr.responseXML && this.xhr.responseXML.documentElement) {
      node = this.xhr.responseXML.documentElement;
      if (node.tagName === 'parsererror') {
        Strophe.error('invalid response received');
        Strophe.error('responseText: ' + this.xhr.responseText);
        Strophe.error('responseXML: ' + Strophe.serialize(this.xhr.responseXML));
        throw new Error('parsererror');
      }
    } else if (this.xhr.responseText) {
      var _node;
      // In Node (with xhr2) or React Native, we may get responseText but no responseXML.
      // We can try to parse it manually.
      Strophe.debug('Got responseText but no responseXML; attempting to parse it with DOMParser...');
      node = new DOMParser().parseFromString(this.xhr.responseText, 'application/xml').documentElement;
      const parserError = (_node = node) === null || _node === void 0 ? void 0 : _node.querySelector('parsererror');
      if (!node || parserError) {
        if (parserError) {
          Strophe.error('invalid response received: ' + parserError.textContent);
          Strophe.error('responseText: ' + this.xhr.responseText);
        }
        const error = new Error();
        error.name = Strophe.ErrorCondition.BAD_FORMAT;
        throw error;
      }
    }
    return node;
  }

  /** PrivateFunction: _newXHR
   *  _Private_ helper function to create XMLHttpRequests.
   *
   *  This function creates XMLHttpRequests across all implementations.
   *
   *  Returns:
   *    A new XMLHttpRequest.
   */
  _newXHR() {
    let xhr = null;
    if (globalThis.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
      if (xhr.overrideMimeType) {
        xhr.overrideMimeType('text/xml; charset=utf-8');
      }
    } else if (globalThis.ActiveXObject) {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    // use Function.bind() to prepend ourselves as an argument
    xhr.onreadystatechange = this.func.bind(null, this);
    return xhr;
  }
};

/** Class: Strophe.Bosh
 *  _Private_ helper class that handles BOSH Connections
 *
 *  The Strophe.Bosh class is used internally by Strophe.Connection
 *  to encapsulate BOSH sessions. It is not meant to be used from user's code.
 */

/** File: bosh.js
 *  A JavaScript library to enable BOSH in Strophejs.
 *
 *  this library uses Bidirectional-streams Over Synchronous HTTP (BOSH)
 *  to emulate a persistent, stateful, two-way connection to an XMPP server.
 *  More information on BOSH can be found in XEP 124.
 */

/** PrivateConstructor: Strophe.Bosh
 *  Create and initialize a Strophe.Bosh object.
 *
 *  Parameters:
 *    (Strophe.Connection) connection - The Strophe.Connection that will use BOSH.
 *
 *  Returns:
 *    A new Strophe.Bosh object.
 */
Strophe.Bosh = class Bosh {
  constructor(connection) {
    this._conn = connection;
    /* request id for body tags */
    this.rid = Math.floor(Math.random() * 4294967295);
    /* The current session ID. */
    this.sid = null;

    // default BOSH values
    this.hold = 1;
    this.wait = 60;
    this.window = 5;
    this.errors = 0;
    this.inactivity = null;
    this.lastResponseHeaders = null;
    this._requests = [];
  }

  /** PrivateFunction: _buildBody
   *  _Private_ helper function to generate the <body/> wrapper for BOSH.
   *
   *  Returns:
   *    A Strophe.Builder with a <body/> element.
   */
  _buildBody() {
    const bodyWrap = $build('body', {
      'rid': this.rid++,
      'xmlns': Strophe.NS.HTTPBIND
    });
    if (this.sid !== null) {
      bodyWrap.attrs({
        'sid': this.sid
      });
    }
    if (this._conn.options.keepalive && this._conn._sessionCachingSupported()) {
      this._cacheSession();
    }
    return bodyWrap;
  }

  /** PrivateFunction: _reset
   *  Reset the connection.
   *
   *  This function is called by the reset function of the Strophe Connection
   */
  _reset() {
    this.rid = Math.floor(Math.random() * 4294967295);
    this.sid = null;
    this.errors = 0;
    if (this._conn._sessionCachingSupported()) {
      sessionStorage.removeItem('strophe-bosh-session');
    }
    this._conn.nextValidRid(this.rid);
  }

  /** PrivateFunction: _connect
   *  _Private_ function that initializes the BOSH connection.
   *
   *  Creates and sends the Request that initializes the BOSH connection.
   */
  _connect(wait, hold, route) {
    this.wait = wait || this.wait;
    this.hold = hold || this.hold;
    this.errors = 0;
    const body = this._buildBody().attrs({
      'to': this._conn.domain,
      'xml:lang': 'en',
      'wait': this.wait,
      'hold': this.hold,
      'content': 'text/xml; charset=utf-8',
      'ver': '1.6',
      'xmpp:version': '1.0',
      'xmlns:xmpp': Strophe.NS.BOSH
    });
    if (route) {
      body.attrs({
        'route': route
      });
    }
    const _connect_cb = this._conn._connect_cb;
    this._requests.push(new Strophe.Request(body.tree(), this._onRequestStateChange.bind(this, _connect_cb.bind(this._conn)), body.tree().getAttribute('rid')));
    this._throttledRequestHandler();
  }

  /** PrivateFunction: _attach
   *  Attach to an already created and authenticated BOSH session.
   *
   *  This function is provided to allow Strophe to attach to BOSH
   *  sessions which have been created externally, perhaps by a Web
   *  application.  This is often used to support auto-login type features
   *  without putting user credentials into the page.
   *
   *  Parameters:
   *    (String) jid - The full JID that is bound by the session.
   *    (String) sid - The SID of the BOSH session.
   *    (String) rid - The current RID of the BOSH session.  This RID
   *      will be used by the next request.
   *    (Function) callback The connect callback function.
   *    (Integer) wait - The optional HTTPBIND wait value.  This is the
   *      time the server will wait before returning an empty result for
   *      a request.  The default setting of 60 seconds is recommended.
   *      Other settings will require tweaks to the Strophe.TIMEOUT value.
   *    (Integer) hold - The optional HTTPBIND hold value.  This is the
   *      number of connections the server will hold at one time.  This
   *      should almost always be set to 1 (the default).
   *    (Integer) wind - The optional HTTBIND window value.  This is the
   *      allowed range of request ids that are valid.  The default is 5.
   */
  _attach(jid, sid, rid, callback, wait, hold, wind) {
    this._conn.jid = jid;
    this.sid = sid;
    this.rid = rid;
    this._conn.connect_callback = callback;
    this._conn.domain = Strophe.getDomainFromJid(this._conn.jid);
    this._conn.authenticated = true;
    this._conn.connected = true;
    this.wait = wait || this.wait;
    this.hold = hold || this.hold;
    this.window = wind || this.window;
    this._conn._changeConnectStatus(Strophe.Status.ATTACHED, null);
  }

  /** PrivateFunction: _restore
   *  Attempt to restore a cached BOSH session
   *
   *  Parameters:
   *    (String) jid - The full JID that is bound by the session.
   *      This parameter is optional but recommended, specifically in cases
   *      where prebinded BOSH sessions are used where it's important to know
   *      that the right session is being restored.
   *    (Function) callback The connect callback function.
   *    (Integer) wait - The optional HTTPBIND wait value.  This is the
   *      time the server will wait before returning an empty result for
   *      a request.  The default setting of 60 seconds is recommended.
   *      Other settings will require tweaks to the Strophe.TIMEOUT value.
   *    (Integer) hold - The optional HTTPBIND hold value.  This is the
   *      number of connections the server will hold at one time.  This
   *      should almost always be set to 1 (the default).
   *    (Integer) wind - The optional HTTBIND window value.  This is the
   *      allowed range of request ids that are valid.  The default is 5.
   */
  _restore(jid, callback, wait, hold, wind) {
    const session = JSON.parse(sessionStorage.getItem('strophe-bosh-session'));
    if (typeof session !== 'undefined' && session !== null && session.rid && session.sid && session.jid && (typeof jid === 'undefined' || jid === null || Strophe.getBareJidFromJid(session.jid) === Strophe.getBareJidFromJid(jid) ||
    // If authcid is null, then it's an anonymous login, so
    // we compare only the domains:
    Strophe.getNodeFromJid(jid) === null && Strophe.getDomainFromJid(session.jid) === jid)) {
      this._conn.restored = true;
      this._attach(session.jid, session.sid, session.rid, callback, wait, hold, wind);
    } else {
      const error = new Error('_restore: no restoreable session.');
      error.name = 'StropheSessionError';
      throw error;
    }
  }

  /** PrivateFunction: _cacheSession
   *  _Private_ handler for the beforeunload event.
   *
   *  This handler is used to process the Bosh-part of the initial request.
   *  Parameters:
   *    (Strophe.Request) bodyWrap - The received stanza.
   */
  _cacheSession() {
    if (this._conn.authenticated) {
      if (this._conn.jid && this.rid && this.sid) {
        sessionStorage.setItem('strophe-bosh-session', JSON.stringify({
          'jid': this._conn.jid,
          'rid': this.rid,
          'sid': this.sid
        }));
      }
    } else {
      sessionStorage.removeItem('strophe-bosh-session');
    }
  }

  /** PrivateFunction: _connect_cb
   *  _Private_ handler for initial connection request.
   *
   *  This handler is used to process the Bosh-part of the initial request.
   *  Parameters:
   *    (Strophe.Request) bodyWrap - The received stanza.
   */
  _connect_cb(bodyWrap) {
    const typ = bodyWrap.getAttribute('type');
    if (typ !== null && typ === 'terminate') {
      // an error occurred
      let cond = bodyWrap.getAttribute('condition');
      Strophe.error('BOSH-Connection failed: ' + cond);
      const conflict = bodyWrap.getElementsByTagName('conflict');
      if (cond !== null) {
        if (cond === 'remote-stream-error' && conflict.length > 0) {
          cond = 'conflict';
        }
        this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, cond);
      } else {
        this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, 'unknown');
      }
      this._conn._doDisconnect(cond);
      return Strophe.Status.CONNFAIL;
    }

    // check to make sure we don't overwrite these if _connect_cb is
    // called multiple times in the case of missing stream:features
    if (!this.sid) {
      this.sid = bodyWrap.getAttribute('sid');
    }
    const wind = bodyWrap.getAttribute('requests');
    if (wind) {
      this.window = parseInt(wind, 10);
    }
    const hold = bodyWrap.getAttribute('hold');
    if (hold) {
      this.hold = parseInt(hold, 10);
    }
    const wait = bodyWrap.getAttribute('wait');
    if (wait) {
      this.wait = parseInt(wait, 10);
    }
    const inactivity = bodyWrap.getAttribute('inactivity');
    if (inactivity) {
      this.inactivity = parseInt(inactivity, 10);
    }
  }

  /** PrivateFunction: _disconnect
   *  _Private_ part of Connection.disconnect for Bosh
   *
   *  Parameters:
   *    (Request) pres - This stanza will be sent before disconnecting.
   */
  _disconnect(pres) {
    this._sendTerminate(pres);
  }

  /** PrivateFunction: _doDisconnect
   *  _Private_ function to disconnect.
   *
   *  Resets the SID and RID.
   */
  _doDisconnect() {
    this.sid = null;
    this.rid = Math.floor(Math.random() * 4294967295);
    if (this._conn._sessionCachingSupported()) {
      sessionStorage.removeItem('strophe-bosh-session');
    }
    this._conn.nextValidRid(this.rid);
  }

  /** PrivateFunction: _emptyQueue
   * _Private_ function to check if the Request queue is empty.
   *
   *  Returns:
   *    True, if there are no Requests queued, False otherwise.
   */
  _emptyQueue() {
    return this._requests.length === 0;
  }

  /** PrivateFunction: _callProtocolErrorHandlers
   *  _Private_ function to call error handlers registered for HTTP errors.
   *
   *  Parameters:
   *    (Strophe.Request) req - The request that is changing readyState.
   */
  _callProtocolErrorHandlers(req) {
    const reqStatus = Bosh._getRequestStatus(req);
    const err_callback = this._conn.protocolErrorHandlers.HTTP[reqStatus];
    if (err_callback) {
      err_callback.call(this, reqStatus);
    }
  }

  /** PrivateFunction: _hitError
   *  _Private_ function to handle the error count.
   *
   *  Requests are resent automatically until their error count reaches
   *  5.  Each time an error is encountered, this function is called to
   *  increment the count and disconnect if the count is too high.
   *
   *  Parameters:
   *    (Integer) reqStatus - The request status.
   */
  _hitError(reqStatus) {
    this.errors++;
    Strophe.warn('request errored, status: ' + reqStatus + ', number of errors: ' + this.errors);
    if (this.errors > 4) {
      this._conn._onDisconnectTimeout();
    }
  }

  /** PrivateFunction: _no_auth_received
   *
   * Called on stream start/restart when no stream:features
   * has been received and sends a blank poll request.
   */
  _no_auth_received(callback) {
    Strophe.warn('Server did not yet offer a supported authentication ' + 'mechanism. Sending a blank poll request.');
    if (callback) {
      callback = callback.bind(this._conn);
    } else {
      callback = this._conn._connect_cb.bind(this._conn);
    }
    const body = this._buildBody();
    this._requests.push(new Strophe.Request(body.tree(), this._onRequestStateChange.bind(this, callback), body.tree().getAttribute('rid')));
    this._throttledRequestHandler();
  }

  /** PrivateFunction: _onDisconnectTimeout
   *  _Private_ timeout handler for handling non-graceful disconnection.
   *
   *  Cancels all remaining Requests and clears the queue.
   */
  _onDisconnectTimeout() {
    this._abortAllRequests();
  }

  /** PrivateFunction: _abortAllRequests
   *  _Private_ helper function that makes sure all pending requests are aborted.
   */
  _abortAllRequests() {
    while (this._requests.length > 0) {
      const req = this._requests.pop();
      req.abort = true;
      req.xhr.abort();
      req.xhr.onreadystatechange = function () {};
    }
  }

  /** PrivateFunction: _onIdle
   *  _Private_ handler called by Strophe.Connection._onIdle
   *
   *  Sends all queued Requests or polls with empty Request if there are none.
   */
  _onIdle() {
    const data = this._conn._data;
    // if no requests are in progress, poll
    if (this._conn.authenticated && this._requests.length === 0 && data.length === 0 && !this._conn.disconnecting) {
      Strophe.debug('no requests during idle cycle, sending blank request');
      data.push(null);
    }
    if (this._conn.paused) {
      return;
    }
    if (this._requests.length < 2 && data.length > 0) {
      const body = this._buildBody();
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== null) {
          if (data[i] === 'restart') {
            body.attrs({
              'to': this._conn.domain,
              'xml:lang': 'en',
              'xmpp:restart': 'true',
              'xmlns:xmpp': Strophe.NS.BOSH
            });
          } else {
            body.cnode(data[i]).up();
          }
        }
      }
      delete this._conn._data;
      this._conn._data = [];
      this._requests.push(new Strophe.Request(body.tree(), this._onRequestStateChange.bind(this, this._conn._dataRecv.bind(this._conn)), body.tree().getAttribute('rid')));
      this._throttledRequestHandler();
    }
    if (this._requests.length > 0) {
      const time_elapsed = this._requests[0].age();
      if (this._requests[0].dead !== null) {
        if (this._requests[0].timeDead() > Math.floor(Strophe.SECONDARY_TIMEOUT * this.wait)) {
          this._throttledRequestHandler();
        }
      }
      if (time_elapsed > Math.floor(Strophe.TIMEOUT * this.wait)) {
        Strophe.warn('Request ' + this._requests[0].id + ' timed out, over ' + Math.floor(Strophe.TIMEOUT * this.wait) + ' seconds since last activity');
        this._throttledRequestHandler();
      }
    }
  }

  /** PrivateFunction: _getRequestStatus
   *
   *  Returns the HTTP status code from a Strophe.Request
   *
   *  Parameters:
   *    (Strophe.Request) req - The Strophe.Request instance.
   *    (Integer) def - The default value that should be returned if no
   *          status value was found.
   */
  static _getRequestStatus(req, def) {
    let reqStatus;
    if (req.xhr.readyState === 4) {
      try {
        reqStatus = req.xhr.status;
      } catch (e) {
        // ignore errors from undefined status attribute. Works
        // around a browser bug
        Strophe.error("Caught an error while retrieving a request's status, " + 'reqStatus: ' + reqStatus);
      }
    }
    if (typeof reqStatus === 'undefined') {
      reqStatus = typeof def === 'number' ? def : 0;
    }
    return reqStatus;
  }

  /** PrivateFunction: _onRequestStateChange
   *  _Private_ handler for Strophe.Request state changes.
   *
   *  This function is called when the XMLHttpRequest readyState changes.
   *  It contains a lot of error handling logic for the many ways that
   *  requests can fail, and calls the request callback when requests
   *  succeed.
   *
   *  Parameters:
   *    (Function) func - The handler for the request.
   *    (Strophe.Request) req - The request that is changing readyState.
   */
  _onRequestStateChange(func, req) {
    Strophe.debug('request id ' + req.id + '.' + req.sends + ' state changed to ' + req.xhr.readyState);
    if (req.abort) {
      req.abort = false;
      return;
    }
    if (req.xhr.readyState !== 4) {
      // The request is not yet complete
      return;
    }
    const reqStatus = Bosh._getRequestStatus(req);
    this.lastResponseHeaders = req.xhr.getAllResponseHeaders();
    if (this._conn.disconnecting && reqStatus >= 400) {
      this._hitError(reqStatus);
      this._callProtocolErrorHandlers(req);
      return;
    }
    const reqIs0 = this._requests[0] === req;
    const reqIs1 = this._requests[1] === req;
    const valid_request = reqStatus > 0 && reqStatus < 500;
    const too_many_retries = req.sends > this._conn.maxRetries;
    if (valid_request || too_many_retries) {
      // remove from internal queue
      this._removeRequest(req);
      Strophe.debug('request id ' + req.id + ' should now be removed');
    }
    if (reqStatus === 200) {
      // request succeeded
      // if request 1 finished, or request 0 finished and request
      // 1 is over Strophe.SECONDARY_TIMEOUT seconds old, we need to
      // restart the other - both will be in the first spot, as the
      // completed request has been removed from the queue already
      if (reqIs1 || reqIs0 && this._requests.length > 0 && this._requests[0].age() > Math.floor(Strophe.SECONDARY_TIMEOUT * this.wait)) {
        this._restartRequest(0);
      }
      this._conn.nextValidRid(Number(req.rid) + 1);
      Strophe.debug('request id ' + req.id + '.' + req.sends + ' got 200');
      func(req); // call handler
      this.errors = 0;
    } else if (reqStatus === 0 || reqStatus >= 400 && reqStatus < 600 || reqStatus >= 12000) {
      // request failed
      Strophe.error('request id ' + req.id + '.' + req.sends + ' error ' + reqStatus + ' happened');
      this._hitError(reqStatus);
      this._callProtocolErrorHandlers(req);
      if (reqStatus >= 400 && reqStatus < 500) {
        this._conn._changeConnectStatus(Strophe.Status.DISCONNECTING, null);
        this._conn._doDisconnect();
      }
    } else {
      Strophe.error('request id ' + req.id + '.' + req.sends + ' error ' + reqStatus + ' happened');
    }
    if (!valid_request && !too_many_retries) {
      this._throttledRequestHandler();
    } else if (too_many_retries && !this._conn.connected) {
      this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, 'giving-up');
    }
  }

  /** PrivateFunction: _processRequest
   *  _Private_ function to process a request in the queue.
   *
   *  This function takes requests off the queue and sends them and
   *  restarts dead requests.
   *
   *  Parameters:
   *    (Integer) i - The index of the request in the queue.
   */
  _processRequest(i) {
    let req = this._requests[i];
    const reqStatus = Bosh._getRequestStatus(req, -1);

    // make sure we limit the number of retries
    if (req.sends > this._conn.maxRetries) {
      this._conn._onDisconnectTimeout();
      return;
    }
    const time_elapsed = req.age();
    const primary_timeout = !isNaN(time_elapsed) && time_elapsed > Math.floor(Strophe.TIMEOUT * this.wait);
    const secondary_timeout = req.dead !== null && req.timeDead() > Math.floor(Strophe.SECONDARY_TIMEOUT * this.wait);
    const server_error = req.xhr.readyState === 4 && (reqStatus < 1 || reqStatus >= 500);
    if (primary_timeout || secondary_timeout || server_error) {
      if (secondary_timeout) {
        Strophe.error(`Request ${this._requests[i].id} timed out (secondary), restarting`);
      }
      req.abort = true;
      req.xhr.abort();
      // setting to null fails on IE6, so set to empty function
      req.xhr.onreadystatechange = function () {};
      this._requests[i] = new Strophe.Request(req.xmlData, req.origFunc, req.rid, req.sends);
      req = this._requests[i];
    }
    if (req.xhr.readyState === 0) {
      Strophe.debug('request id ' + req.id + '.' + req.sends + ' posting');
      try {
        const content_type = this._conn.options.contentType || 'text/xml; charset=utf-8';
        req.xhr.open('POST', this._conn.service, this._conn.options.sync ? false : true);
        if (typeof req.xhr.setRequestHeader !== 'undefined') {
          // IE9 doesn't have setRequestHeader
          req.xhr.setRequestHeader('Content-Type', content_type);
        }
        if (this._conn.options.withCredentials) {
          req.xhr.withCredentials = true;
        }
      } catch (e2) {
        Strophe.error('XHR open failed: ' + e2.toString());
        if (!this._conn.connected) {
          this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, 'bad-service');
        }
        this._conn.disconnect();
        return;
      }

      // Fires the XHR request -- may be invoked immediately
      // or on a gradually expanding retry window for reconnects
      const sendFunc = () => {
        req.date = new Date();
        if (this._conn.options.customHeaders) {
          const headers = this._conn.options.customHeaders;
          for (const header in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, header)) {
              req.xhr.setRequestHeader(header, headers[header]);
            }
          }
        }
        req.xhr.send(req.data);
      };

      // Implement progressive backoff for reconnects --
      // First retry (send === 1) should also be instantaneous
      if (req.sends > 1) {
        // Using a cube of the retry number creates a nicely
        // expanding retry window
        const backoff = Math.min(Math.floor(Strophe.TIMEOUT * this.wait), Math.pow(req.sends, 3)) * 1000;
        setTimeout(function () {
          // XXX: setTimeout should be called only with function expressions (23974bc1)
          sendFunc();
        }, backoff);
      } else {
        sendFunc();
      }
      req.sends++;
      if (this._conn.xmlOutput !== Strophe.Connection.prototype.xmlOutput) {
        if (req.xmlData.nodeName === this.strip && req.xmlData.childNodes.length) {
          this._conn.xmlOutput(req.xmlData.childNodes[0]);
        } else {
          this._conn.xmlOutput(req.xmlData);
        }
      }
      if (this._conn.rawOutput !== Strophe.Connection.prototype.rawOutput) {
        this._conn.rawOutput(req.data);
      }
    } else {
      Strophe.debug('_processRequest: ' + (i === 0 ? 'first' : 'second') + ' request has readyState of ' + req.xhr.readyState);
    }
  }

  /** PrivateFunction: _removeRequest
   *  _Private_ function to remove a request from the queue.
   *
   *  Parameters:
   *    (Strophe.Request) req - The request to remove.
   */
  _removeRequest(req) {
    Strophe.debug('removing request');
    for (let i = this._requests.length - 1; i >= 0; i--) {
      if (req === this._requests[i]) {
        this._requests.splice(i, 1);
      }
    }
    // IE6 fails on setting to null, so set to empty function
    req.xhr.onreadystatechange = function () {};
    this._throttledRequestHandler();
  }

  /** PrivateFunction: _restartRequest
   *  _Private_ function to restart a request that is presumed dead.
   *
   *  Parameters:
   *    (Integer) i - The index of the request in the queue.
   */
  _restartRequest(i) {
    const req = this._requests[i];
    if (req.dead === null) {
      req.dead = new Date();
    }
    this._processRequest(i);
  }

  /** PrivateFunction: _reqToData
   * _Private_ function to get a stanza out of a request.
   *
   * Tries to extract a stanza out of a Request Object.
   * When this fails the current connection will be disconnected.
   *
   *  Parameters:
   *    (Object) req - The Request.
   *
   *  Returns:
   *    The stanza that was passed.
   */
  _reqToData(req) {
    try {
      return req.getResponse();
    } catch (e) {
      if (e.message !== 'parsererror') {
        throw e;
      }
      this._conn.disconnect('strophe-parsererror');
    }
  }

  /** PrivateFunction: _sendTerminate
   *  _Private_ function to send initial disconnect sequence.
   *
   *  This is the first step in a graceful disconnect.  It sends
   *  the BOSH server a terminate body and includes an unavailable
   *  presence if authentication has completed.
   */
  _sendTerminate(pres) {
    Strophe.debug('_sendTerminate was called');
    const body = this._buildBody().attrs({
      type: 'terminate'
    });
    if (pres) {
      body.cnode(pres.tree());
    }
    const req = new Strophe.Request(body.tree(), this._onRequestStateChange.bind(this, this._conn._dataRecv.bind(this._conn)), body.tree().getAttribute('rid'));
    this._requests.push(req);
    this._throttledRequestHandler();
  }

  /** PrivateFunction: _send
   *  _Private_ part of the Connection.send function for BOSH
   *
   * Just triggers the RequestHandler to send the messages that are in the queue
   */
  _send() {
    clearTimeout(this._conn._idleTimeout);
    this._throttledRequestHandler();
    this._conn._idleTimeout = setTimeout(() => this._conn._onIdle(), 100);
  }

  /** PrivateFunction: _sendRestart
   *
   *  Send an xmpp:restart stanza.
   */
  _sendRestart() {
    this._throttledRequestHandler();
    clearTimeout(this._conn._idleTimeout);
  }

  /** PrivateFunction: _throttledRequestHandler
   *  _Private_ function to throttle requests to the connection window.
   *
   *  This function makes sure we don't send requests so fast that the
   *  request ids overflow the connection window in the case that one
   *  request died.
   */
  _throttledRequestHandler() {
    if (!this._requests) {
      Strophe.debug('_throttledRequestHandler called with ' + 'undefined requests');
    } else {
      Strophe.debug('_throttledRequestHandler called with ' + this._requests.length + ' requests');
    }
    if (!this._requests || this._requests.length === 0) {
      return;
    }
    if (this._requests.length > 0) {
      this._processRequest(0);
    }
    if (this._requests.length > 1 && Math.abs(this._requests[0].rid - this._requests[1].rid) < this.window) {
      this._processRequest(1);
    }
  }
};

/** Variable: strip
 *
 *  BOSH-Connections will have all stanzas wrapped in a <body> tag when
 *  passed to <Strophe.Connection.xmlInput> or <Strophe.Connection.xmlOutput>.
 *  To strip this tag, User code can set <Strophe.Bosh.strip> to "body":
 *
 *  > Strophe.Bosh.prototype.strip = "body";
 *
 *  This will enable stripping of the body tag in both
 *  <Strophe.Connection.xmlInput> and <Strophe.Connection.xmlOutput>.
 */
Strophe.Bosh.prototype.strip = null;

/*
    This program is distributed under the terms of the MIT license.
    Please see the LICENSE file for details.

    Copyright 2006-2008, OGG, LLC
*/

/** Class: Strophe.WebSocket
 *  _Private_ helper class that handles WebSocket Connections
 *
 *  The Strophe.WebSocket class is used internally by Strophe.Connection
 *  to encapsulate WebSocket sessions. It is not meant to be used from user's code.
 */

/** File: websocket.js
 *  A JavaScript library to enable XMPP over Websocket in Strophejs.
 *
 *  This file implements XMPP over WebSockets for Strophejs.
 *  If a Connection is established with a Websocket url (ws://...)
 *  Strophe will use WebSockets.
 *  For more information on XMPP-over-WebSocket see RFC 7395:
 *  http://tools.ietf.org/html/rfc7395
 *
 *  WebSocket support implemented by Andreas Guth (andreas.guth@rwth-aachen.de)
 */
Strophe.Websocket = class Websocket {
  /** PrivateConstructor: Strophe.Websocket
   *  Create and initialize a Strophe.WebSocket object.
   *  Currently only sets the connection Object.
   *
   *  Parameters:
   *    (Strophe.Connection) connection - The Strophe.Connection that will use WebSockets.
   *
   *  Returns:
   *    A new Strophe.WebSocket object.
   */
  constructor(connection) {
    this._conn = connection;
    this.strip = 'wrapper';
    const service = connection.service;
    if (service.indexOf('ws:') !== 0 && service.indexOf('wss:') !== 0) {
      // If the service is not an absolute URL, assume it is a path and put the absolute
      // URL together from options, current URL and the path.
      let new_service = '';
      if (connection.options.protocol === 'ws' && location.protocol !== 'https:') {
        new_service += 'ws';
      } else {
        new_service += 'wss';
      }
      new_service += '://' + location.host;
      if (service.indexOf('/') !== 0) {
        new_service += location.pathname + service;
      } else {
        new_service += service;
      }
      connection.service = new_service;
    }
  }

  /** PrivateFunction: _buildStream
   *  _Private_ helper function to generate the <stream> start tag for WebSockets
   *
   *  Returns:
   *    A Strophe.Builder with a <stream> element.
   */
  _buildStream() {
    return $build('open', {
      'xmlns': Strophe.NS.FRAMING,
      'to': this._conn.domain,
      'version': '1.0'
    });
  }

  /** PrivateFunction: _checkStreamError
   * _Private_ checks a message for stream:error
   *
   *  Parameters:
   *    (Strophe.Request) bodyWrap - The received stanza.
   *    connectstatus - The ConnectStatus that will be set on error.
   *  Returns:
   *     true if there was a streamerror, false otherwise.
   */
  _checkStreamError(bodyWrap, connectstatus) {
    let errors;
    if (bodyWrap.getElementsByTagNameNS) {
      errors = bodyWrap.getElementsByTagNameNS(Strophe.NS.STREAM, 'error');
    } else {
      errors = bodyWrap.getElementsByTagName('stream:error');
    }
    if (errors.length === 0) {
      return false;
    }
    const error = errors[0];
    let condition = '';
    let text = '';
    const ns = 'urn:ietf:params:xml:ns:xmpp-streams';
    for (let i = 0; i < error.childNodes.length; i++) {
      const e = error.childNodes[i];
      if (e.getAttribute('xmlns') !== ns) {
        break;
      }
      if (e.nodeName === 'text') {
        text = e.textContent;
      } else {
        condition = e.nodeName;
      }
    }
    let errorString = 'WebSocket stream error: ';
    if (condition) {
      errorString += condition;
    } else {
      errorString += 'unknown';
    }
    if (text) {
      errorString += ' - ' + text;
    }
    Strophe.error(errorString);

    // close the connection on stream_error
    this._conn._changeConnectStatus(connectstatus, condition);
    this._conn._doDisconnect();
    return true;
  }

  /** PrivateFunction: _reset
   *  Reset the connection.
   *
   *  This function is called by the reset function of the Strophe Connection.
   *  Is not needed by WebSockets.
   */
  // eslint-disable-next-line class-methods-use-this
  _reset() {
    return;
  }

  /** PrivateFunction: _connect
   *  _Private_ function called by Strophe.Connection.connect
   *
   *  Creates a WebSocket for a connection and assigns Callbacks to it.
   *  Does nothing if there already is a WebSocket.
   */
  _connect() {
    // Ensure that there is no open WebSocket from a previous Connection.
    this._closeSocket();
    this.socket = new WebSocket(this._conn.service, 'xmpp');
    this.socket.onopen = () => this._onOpen();
    this.socket.onerror = e => this._onError(e);
    this.socket.onclose = e => this._onClose(e);
    // Gets replaced with this._onMessage once _onInitialMessage is called
    this.socket.onmessage = message => this._onInitialMessage(message);
  }

  /** PrivateFunction: _connect_cb
   *  _Private_ function called by Strophe.Connection._connect_cb
   *
   * checks for stream:error
   *
   *  Parameters:
   *    (Strophe.Request) bodyWrap - The received stanza.
   */
  _connect_cb(bodyWrap) {
    const error = this._checkStreamError(bodyWrap, Strophe.Status.CONNFAIL);
    if (error) {
      return Strophe.Status.CONNFAIL;
    }
  }

  /** PrivateFunction: _handleStreamStart
   * _Private_ function that checks the opening <open /> tag for errors.
   *
   * Disconnects if there is an error and returns false, true otherwise.
   *
   *  Parameters:
   *    (Node) message - Stanza containing the <open /> tag.
   */
  _handleStreamStart(message) {
    let error = false;

    // Check for errors in the <open /> tag
    const ns = message.getAttribute('xmlns');
    if (typeof ns !== 'string') {
      error = 'Missing xmlns in <open />';
    } else if (ns !== Strophe.NS.FRAMING) {
      error = 'Wrong xmlns in <open />: ' + ns;
    }
    const ver = message.getAttribute('version');
    if (typeof ver !== 'string') {
      error = 'Missing version in <open />';
    } else if (ver !== '1.0') {
      error = 'Wrong version in <open />: ' + ver;
    }
    if (error) {
      this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, error);
      this._conn._doDisconnect();
      return false;
    }
    return true;
  }

  /** PrivateFunction: _onInitialMessage
   * _Private_ function that handles the first connection messages.
   *
   * On receiving an opening stream tag this callback replaces itself with the real
   * message handler. On receiving a stream error the connection is terminated.
   */
  _onInitialMessage(message) {
    if (message.data.indexOf('<open ') === 0 || message.data.indexOf('<?xml') === 0) {
      // Strip the XML Declaration, if there is one
      const data = message.data.replace(/^(<\?.*?\?>\s*)*/, '');
      if (data === '') return;
      const streamStart = new DOMParser().parseFromString(data, 'text/xml').documentElement;
      this._conn.xmlInput(streamStart);
      this._conn.rawInput(message.data);

      //_handleStreamSteart will check for XML errors and disconnect on error
      if (this._handleStreamStart(streamStart)) {
        //_connect_cb will check for stream:error and disconnect on error
        this._connect_cb(streamStart);
      }
    } else if (message.data.indexOf('<close ') === 0) {
      // <close xmlns="urn:ietf:params:xml:ns:xmpp-framing />
      // Parse the raw string to an XML element
      const parsedMessage = new DOMParser().parseFromString(message.data, 'text/xml').documentElement;
      // Report this input to the raw and xml handlers
      this._conn.xmlInput(parsedMessage);
      this._conn.rawInput(message.data);
      const see_uri = parsedMessage.getAttribute('see-other-uri');
      if (see_uri) {
        const service = this._conn.service;
        // Valid scenarios: WSS->WSS, WS->ANY
        const isSecureRedirect = service.indexOf('wss:') >= 0 && see_uri.indexOf('wss:') >= 0 || service.indexOf('ws:') >= 0;
        if (isSecureRedirect) {
          this._conn._changeConnectStatus(Strophe.Status.REDIRECT, 'Received see-other-uri, resetting connection');
          this._conn.reset();
          this._conn.service = see_uri;
          this._connect();
        }
      } else {
        this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, 'Received closing stream');
        this._conn._doDisconnect();
      }
    } else {
      this._replaceMessageHandler();
      const string = this._streamWrap(message.data);
      const elem = new DOMParser().parseFromString(string, 'text/xml').documentElement;
      this._conn._connect_cb(elem, null, message.data);
    }
  }

  /** PrivateFunction: _replaceMessageHandler
   *
   * Called by _onInitialMessage in order to replace itself with the general message handler.
   * This method is overridden by Strophe.WorkerWebsocket, which manages a
   * websocket connection via a service worker and doesn't have direct access
   * to the socket.
   */
  _replaceMessageHandler() {
    this.socket.onmessage = m => this._onMessage(m);
  }

  /** PrivateFunction: _disconnect
   *  _Private_ function called by Strophe.Connection.disconnect
   *
   *  Disconnects and sends a last stanza if one is given
   *
   *  Parameters:
   *    (Request) pres - This stanza will be sent before disconnecting.
   */
  _disconnect(pres) {
    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      if (pres) {
        this._conn.send(pres);
      }
      const close = $build('close', {
        'xmlns': Strophe.NS.FRAMING
      });
      this._conn.xmlOutput(close.tree());
      const closeString = Strophe.serialize(close);
      this._conn.rawOutput(closeString);
      try {
        this.socket.send(closeString);
      } catch (e) {
        Strophe.warn("Couldn't send <close /> tag.");
      }
    }
    setTimeout(() => this._conn._doDisconnect(), 0);
  }

  /** PrivateFunction: _doDisconnect
   *  _Private_ function to disconnect.
   *
   *  Just closes the Socket for WebSockets
   */
  _doDisconnect() {
    Strophe.debug('WebSockets _doDisconnect was called');
    this._closeSocket();
  }

  /** PrivateFunction _streamWrap
   *  _Private_ helper function to wrap a stanza in a <stream> tag.
   *  This is used so Strophe can process stanzas from WebSockets like BOSH
   */
  // eslint-disable-next-line class-methods-use-this
  _streamWrap(stanza) {
    return '<wrapper>' + stanza + '</wrapper>';
  }

  /** PrivateFunction: _closeSocket
   *  _Private_ function to close the WebSocket.
   *
   *  Closes the socket if it is still open and deletes it
   */
  _closeSocket() {
    if (this.socket) {
      try {
        this.socket.onclose = null;
        this.socket.onerror = null;
        this.socket.onmessage = null;
        this.socket.close();
      } catch (e) {
        Strophe.debug(e.message);
      }
    }
    this.socket = null;
  }

  /** PrivateFunction: _emptyQueue
   * _Private_ function to check if the message queue is empty.
   *
   *  Returns:
   *    True, because WebSocket messages are send immediately after queueing.
   */
  // eslint-disable-next-line class-methods-use-this
  _emptyQueue() {
    return true;
  }

  /** PrivateFunction: _onClose
   * _Private_ function to handle websockets closing.
   */
  _onClose(e) {
    if (this._conn.connected && !this._conn.disconnecting) {
      Strophe.error('Websocket closed unexpectedly');
      this._conn._doDisconnect();
    } else if (e && e.code === 1006 && !this._conn.connected && this.socket) {
      // in case the onError callback was not called (Safari 10 does not
      // call onerror when the initial connection fails) we need to
      // dispatch a CONNFAIL status update to be consistent with the
      // behavior on other browsers.
      Strophe.error('Websocket closed unexcectedly');
      this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, 'The WebSocket connection could not be established or was disconnected.');
      this._conn._doDisconnect();
    } else {
      Strophe.debug('Websocket closed');
    }
  }

  /** PrivateFunction: _no_auth_received
   *
   * Called on stream start/restart when no stream:features
   * has been received.
   */
  _no_auth_received(callback) {
    Strophe.error('Server did not offer a supported authentication mechanism');
    this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, Strophe.ErrorCondition.NO_AUTH_MECH);
    if (callback) {
      callback.call(this._conn);
    }
    this._conn._doDisconnect();
  }

  /** PrivateFunction: _onDisconnectTimeout
   *  _Private_ timeout handler for handling non-graceful disconnection.
   *
   *  This does nothing for WebSockets
   */
  _onDisconnectTimeout() {} // eslint-disable-line class-methods-use-this

  /** PrivateFunction: _abortAllRequests
   *  _Private_ helper function that makes sure all pending requests are aborted.
   */
  _abortAllRequests() {} // eslint-disable-line class-methods-use-this

  /** PrivateFunction: _onError
   * _Private_ function to handle websockets errors.
   *
   * Parameters:
   * (Object) error - The websocket error.
   */
  _onError(error) {
    Strophe.error('Websocket error ' + JSON.stringify(error));
    this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, 'The WebSocket connection could not be established or was disconnected.');
    this._disconnect();
  }

  /** PrivateFunction: _onIdle
   *  _Private_ function called by Strophe.Connection._onIdle
   *
   *  sends all queued stanzas
   */
  _onIdle() {
    const data = this._conn._data;
    if (data.length > 0 && !this._conn.paused) {
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== null) {
          let stanza;
          if (data[i] === 'restart') {
            stanza = this._buildStream().tree();
          } else {
            stanza = data[i];
          }
          const rawStanza = Strophe.serialize(stanza);
          this._conn.xmlOutput(stanza);
          this._conn.rawOutput(rawStanza);
          this.socket.send(rawStanza);
        }
      }
      this._conn._data = [];
    }
  }

  /** PrivateFunction: _onMessage
   * _Private_ function to handle websockets messages.
   *
   * This function parses each of the messages as if they are full documents.
   * [TODO : We may actually want to use a SAX Push parser].
   *
   * Since all XMPP traffic starts with
   *  <stream:stream version='1.0'
   *                 xml:lang='en'
   *                 xmlns='jabber:client'
   *                 xmlns:stream='http://etherx.jabber.org/streams'
   *                 id='3697395463'
   *                 from='SERVER'>
   *
   * The first stanza will always fail to be parsed.
   *
   * Additionally, the seconds stanza will always be <stream:features> with
   * the stream NS defined in the previous stanza, so we need to 'force'
   * the inclusion of the NS in this stanza.
   *
   * Parameters:
   * (string) message - The websocket message.
   */
  _onMessage(message) {
    let elem;
    // check for closing stream
    const close = '<close xmlns="urn:ietf:params:xml:ns:xmpp-framing" />';
    if (message.data === close) {
      this._conn.rawInput(close);
      this._conn.xmlInput(message);
      if (!this._conn.disconnecting) {
        this._conn._doDisconnect();
      }
      return;
    } else if (message.data.search('<open ') === 0) {
      // This handles stream restarts
      elem = new DOMParser().parseFromString(message.data, 'text/xml').documentElement;
      if (!this._handleStreamStart(elem)) {
        return;
      }
    } else {
      const data = this._streamWrap(message.data);
      elem = new DOMParser().parseFromString(data, 'text/xml').documentElement;
    }
    if (this._checkStreamError(elem, Strophe.Status.ERROR)) {
      return;
    }

    //handle unavailable presence stanza before disconnecting
    if (this._conn.disconnecting && elem.firstChild.nodeName === 'presence' && elem.firstChild.getAttribute('type') === 'unavailable') {
      this._conn.xmlInput(elem);
      this._conn.rawInput(Strophe.serialize(elem));
      // if we are already disconnecting we will ignore the unavailable stanza and
      // wait for the </stream:stream> tag before we close the connection
      return;
    }
    this._conn._dataRecv(elem, message.data);
  }

  /** PrivateFunction: _onOpen
   * _Private_ function to handle websockets connection setup.
   *
   * The opening stream tag is sent here.
   */
  _onOpen() {
    Strophe.debug('Websocket open');
    const start = this._buildStream();
    this._conn.xmlOutput(start.tree());
    const startString = Strophe.serialize(start);
    this._conn.rawOutput(startString);
    this.socket.send(startString);
  }

  /** PrivateFunction: _reqToData
   * _Private_ function to get a stanza out of a request.
   *
   * WebSockets don't use requests, so the passed argument is just returned.
   *
   *  Parameters:
   *    (Object) stanza - The stanza.
   *
   *  Returns:
   *    The stanza that was passed.
   */
  // eslint-disable-next-line class-methods-use-this
  _reqToData(stanza) {
    return stanza;
  }

  /** PrivateFunction: _send
   *  _Private_ part of the Connection.send function for WebSocket
   *
   * Just flushes the messages that are in the queue
   */
  _send() {
    this._conn.flush();
  }

  /** PrivateFunction: _sendRestart
   *
   *  Send an xmpp:restart stanza.
   */
  _sendRestart() {
    clearTimeout(this._conn._idleTimeout);
    this._conn._onIdle.bind(this._conn)();
  }
};

/*
    This program is distributed under the terms of the MIT license.
    Please see the LICENSE file for details.

    Copyright 2020, JC Brand
*/
const lmap = {};
lmap['debug'] = Strophe.LogLevel.DEBUG;
lmap['info'] = Strophe.LogLevel.INFO;
lmap['warn'] = Strophe.LogLevel.WARN;
lmap['error'] = Strophe.LogLevel.ERROR;
lmap['fatal'] = Strophe.LogLevel.FATAL;

/** Class: Strophe.WorkerWebsocket
 *  _Private_ helper class that handles a websocket connection inside a shared worker.
 */
Strophe.WorkerWebsocket = class WorkerWebsocket extends Strophe.Websocket {
  /** PrivateConstructor: Strophe.WorkerWebsocket
   *  Create and initialize a Strophe.WorkerWebsocket object.
   *
   *  Parameters:
   *    (Strophe.Connection) connection - The Strophe.Connection
   *
   *  Returns:
   *    A new Strophe.WorkerWebsocket object.
   */
  constructor(connection) {
    super(connection);
    this._conn = connection;
    this.worker = new SharedWorker(this._conn.options.worker, 'Strophe XMPP Connection');
    this.worker.onerror = e => {
      var _console;
      (_console = console) === null || _console === void 0 ? void 0 : _console.error(e);
      Strophe.log(Strophe.LogLevel.ERROR, `Shared Worker Error: ${e}`);
    };
  }
  get socket() {
    return {
      'send': str => this.worker.port.postMessage(['send', str])
    };
  }
  _connect() {
    this._messageHandler = m => this._onInitialMessage(m);
    this.worker.port.start();
    this.worker.port.onmessage = ev => this._onWorkerMessage(ev);
    this.worker.port.postMessage(['_connect', this._conn.service, this._conn.jid]);
  }
  _attach(callback) {
    this._messageHandler = m => this._onMessage(m);
    this._conn.connect_callback = callback;
    this.worker.port.start();
    this.worker.port.onmessage = ev => this._onWorkerMessage(ev);
    this.worker.port.postMessage(['_attach', this._conn.service]);
  }
  _attachCallback(status, jid) {
    if (status === Strophe.Status.ATTACHED) {
      this._conn.jid = jid;
      this._conn.authenticated = true;
      this._conn.connected = true;
      this._conn.restored = true;
      this._conn._changeConnectStatus(Strophe.Status.ATTACHED);
    } else if (status === Strophe.Status.ATTACHFAIL) {
      this._conn.authenticated = false;
      this._conn.connected = false;
      this._conn.restored = false;
      this._conn._changeConnectStatus(Strophe.Status.ATTACHFAIL);
    }
  }
  _disconnect(readyState, pres) {
    pres && this._conn.send(pres);
    const close = $build('close', {
      'xmlns': Strophe.NS.FRAMING
    });
    this._conn.xmlOutput(close.tree());
    const closeString = Strophe.serialize(close);
    this._conn.rawOutput(closeString);
    this.worker.port.postMessage(['send', closeString]);
    this._conn._doDisconnect();
  }
  _onClose(e) {
    if (this._conn.connected && !this._conn.disconnecting) {
      Strophe.error('Websocket closed unexpectedly');
      this._conn._doDisconnect();
    } else if (e && e.code === 1006 && !this._conn.connected) {
      // in case the onError callback was not called (Safari 10 does not
      // call onerror when the initial connection fails) we need to
      // dispatch a CONNFAIL status update to be consistent with the
      // behavior on other browsers.
      Strophe.error('Websocket closed unexcectedly');
      this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, 'The WebSocket connection could not be established or was disconnected.');
      this._conn._doDisconnect();
    } else {
      Strophe.debug('Websocket closed');
    }
  }
  _closeSocket() {
    this.worker.port.postMessage(['_closeSocket']);
  }

  /** PrivateFunction: _replaceMessageHandler
   *
   * Called by _onInitialMessage in order to replace itself with the general message handler.
   * This method is overridden by Strophe.WorkerWebsocket, which manages a
   * websocket connection via a service worker and doesn't have direct access
   * to the socket.
   */
  _replaceMessageHandler() {
    this._messageHandler = m => this._onMessage(m);
  }

  /** PrivateFunction: _onWorkerMessage
   * _Private_ function that handles messages received from the service worker
   */
  _onWorkerMessage(ev) {
    const {
      data
    } = ev;
    const method_name = data[0];
    if (method_name === '_onMessage') {
      this._messageHandler(data[1]);
    } else if (method_name in this) {
      try {
        this[method_name].apply(this, ev.data.slice(1));
      } catch (e) {
        Strophe.log(Strophe.LogLevel.ERROR, e);
      }
    } else if (method_name === 'log') {
      const level = data[1];
      const msg = data[2];
      Strophe.log(lmap[level], msg);
    } else {
      Strophe.log(Strophe.LogLevel.ERROR, `Found unhandled service worker message: ${data}`);
    }
  }
};

global$1.$build = core.$build;
global$1.$iq = core.$iq;
global$1.$msg = core.$msg;
global$1.$pres = core.$pres;
global$1.Strophe = core.Strophe;
global$1.Strophe.shims = shims;

export { $build, $iq, $msg, $pres, Strophe };
