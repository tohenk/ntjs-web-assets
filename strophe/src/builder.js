"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$build = $build;
exports.$iq = $iq;
exports.$msg = $msg;
exports.$pres = $pres;
exports.default = void 0;
var _constants = require("./constants.js");
var _utils = require("./utils.js");
/**
 * Create a {@link Strophe.Builder}
 * This is an alias for `new Strophe.Builder(name, attrs)`.
 * @param {string} name - The root element name.
 * @param {Object} attrs - The attributes for the root element in object notation.
 * @return {Builder} A new Strophe.Builder object.
 */
function $build(name, attrs) {
  return new Builder(name, attrs);
}

/**
 * Create a {@link Strophe.Builder} with a `<message/>` element as the root.
 * @param {Object} attrs - The <message/> element attributes in object notation.
 * @return {Builder} A new Strophe.Builder object.
 */
function $msg(attrs) {
  return new Builder('message', attrs);
}

/**
 * Create a {@link Strophe.Builder} with an `<iq/>` element as the root.
 * @param {Object} attrs - The <iq/> element attributes in object notation.
 * @return {Builder} A new Strophe.Builder object.
 */
function $iq(attrs) {
  return new Builder('iq', attrs);
}

/**
 * Create a {@link Strophe.Builder} with a `<presence/>` element as the root.
 * @param {Object} attrs - The <presence/> element attributes in object notation.
 * @return {Builder} A new Strophe.Builder object.
 */
function $pres(attrs) {
  return new Builder('presence', attrs);
}

/**
 * This class provides an interface similar to JQuery but for building
 * DOM elements easily and rapidly.  All the functions except for `toString()`
 * and tree() return the object, so calls can be chained.
 *
 * The corresponding DOM manipulations to get a similar fragment would be
 * a lot more tedious and probably involve several helper variables.
 *
 * Since adding children makes new operations operate on the child, up()
 * is provided to traverse up the tree.  To add two children, do
 * > builder.c('child1', ...).up().c('child2', ...)
 *
 * The next operation on the Builder will be relative to the second child.
 *
 * @example
 *  // Here's an example using the $iq() builder helper.
 *  $iq({to: 'you', from: 'me', type: 'get', id: '1'})
 *      .c('query', {xmlns: 'strophe:example'})
 *      .c('example')
 *      .toString()
 *
 *  // The above generates this XML fragment
 *  //  <iq to='you' from='me' type='get' id='1'>
 *  //    <query xmlns='strophe:example'>
 *  //      <example/>
 *  //    </query>
 *  //  </iq>
 */
class Builder {
  /**
   * The attributes should be passed in object notation.
   * @param {string} name - The name of the root element.
   * @param {Object} attrs - The attributes for the root element in object notation.
   * @example const b = new Builder('message', {to: 'you', from: 'me'});
   * @example const b = new Builder('messsage', {'xml:lang': 'en'});
   */
  constructor(name, attrs) {
    // Set correct namespace for jabber:client elements
    if (name === 'presence' || name === 'message' || name === 'iq') {
      if (attrs && !attrs.xmlns) {
        attrs.xmlns = _constants.NS.CLIENT;
      } else if (!attrs) {
        attrs = {
          xmlns: _constants.NS.CLIENT
        };
      }
    }
    // Holds the tree being built.
    this.nodeTree = (0, _utils.xmlElement)(name, attrs);
    // Points to the current operation node.
    this.node = this.nodeTree;
  }

  /**
   * Return the DOM tree.
   *
   * This function returns the current DOM tree as an element object.  This
   * is suitable for passing to functions like Strophe.Connection.send().
   *
   * @return {Element} The DOM tree as a element object.
   */
  tree() {
    return this.nodeTree;
  }

  /**
   * Serialize the DOM tree to a String.
   *
   * This function returns a string serialization of the current DOM
   * tree.  It is often used internally to pass data to a
   * Strophe.Request object.
   *
   * @return {string} The serialized DOM tree in a String.
   */
  toString() {
    return (0, _utils.serialize)(this.nodeTree);
  }

  /**
   * Make the current parent element the new current element.
   * This function is often used after c() to traverse back up the tree.
   *
   * @example
   *  // For example, to add two children to the same element
   *  builder.c('child1', {}).up().c('child2', {});
   *
   * @return {Builder} The Strophe.Builder object.
   */
  up() {
    this.node = this.node.parentElement;
    return this;
  }

  /**
   * Make the root element the new current element.
   *
   * When at a deeply nested element in the tree, this function can be used
   * to jump back to the root of the tree, instead of having to repeatedly
   * call up().
   *
   * @return {Builder} The Strophe.Builder object.
   */
  root() {
    this.node = this.nodeTree;
    return this;
  }

  /**
   * Add or modify attributes of the current element.
   *
   * The attributes should be passed in object notation.  This function
   * does not move the current element pointer.
   *
   * @param {Object} moreattrs - The attributes to add/modify in object notation.
   * @return {Builder} The Strophe.Builder object.
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

  /**
   * Add a child to the current element and make it the new current
   * element.
   *
   * This function moves the current element pointer to the child,
   * unless text is provided.  If you need to add another child, it
   * is necessary to use up() to go back to the parent in the tree.
   *
   * @param {string} name - The name of the child.
   * @param {Object} attrs - The attributes of the child in object notation.
   * @param {string} [text] - The text to add to the child.
   *
   * @return {Builder} The Strophe.Builder object.
   */
  c(name, attrs, text) {
    const child = (0, _utils.xmlElement)(name, attrs, text);
    this.node.appendChild(child);
    if (typeof text !== 'string' && typeof text !== 'number') {
      this.node = child;
    }
    return this;
  }

  /**
   * Add a child to the current element and make it the new current
   * element.
   *
   * This function is the same as c() except that instead of using a
   * name and an attributes object to create the child it uses an
   * existing DOM element object.
   *
   * @param {Element} elem - A DOM element.
   * @return {Builder} The Strophe.Builder object.
   */
  cnode(elem) {
    let impNode;
    const xmlGen = (0, _utils.xmlGenerator)();
    try {
      impNode = xmlGen.importNode !== undefined;
    } catch (e) {
      impNode = false;
    }
    const newElem = impNode ? xmlGen.importNode(elem, true) : (0, _utils.copyElement)(elem);
    this.node.appendChild(newElem);
    this.node = /** @type {Element} */newElem;
    return this;
  }

  /**
   * Add a child text element.
   *
   * This *does not* make the child the new current element since there
   * are no children of text elements.
   *
   * @param {string} text - The text data to append to the current element.
   * @return {Builder} The Strophe.Builder object.
   */
  t(text) {
    const child = (0, _utils.xmlTextNode)(text);
    this.node.appendChild(child);
    return this;
  }

  /**
   * Replace current element contents with the HTML passed in.
   *
   * This *does not* make the child the new current element
   *
   * @param {string} html - The html to insert as contents of current element.
   * @return {Builder} The Strophe.Builder object.
   */
  h(html) {
    const fragment = (0, _utils.xmlGenerator)().createElement('body');
    // force the browser to try and fix any invalid HTML tags
    fragment.innerHTML = html;
    // copy cleaned html into an xml dom
    const xhtml = (0, _utils.createHtml)(fragment);
    while (xhtml.childNodes.length > 0) {
      this.node.appendChild(xhtml.childNodes[0]);
    }
    return this;
  }
}
var _default = Builder;
exports.default = _default;