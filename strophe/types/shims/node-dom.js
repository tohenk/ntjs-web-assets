/**
 * Node.js DOM shim.
 *
 * Browsers provide `DOMParser`, `XMLSerializer` and a `document` natively;
 * Node.js does not. The Node build therefore wires up `@xmldom/xmldom`, a
 * small, pure-JS, XML-only W3C DOM, together with the `ws` WebSocket.
 *
 * It is imported for its side effects by the Node entry point (see
 * `index-node.ts`) before any Connection is created, and is never part of the
 * browser build.
 *
 * Thin compatibility shims bridge the gaps between `@xmldom/xmldom` and the
 * browser DOM that Strophe's shared code assumes:
 *
 *  - `firstElementChild` and `adoptNode`: `@xmldom/xmldom` implements neither,
 *    so both are polyfilled onto its prototypes.
 *  - parse errors: browsers return a document whose root is a `<parsererror>`
 *    element for malformed input, whereas `@xmldom/xmldom` throws. `DOMParser`
 *    is wrapped to restore the browser behaviour, which is what
 *    {@link getParserError} and the BOSH/WebSocket parse paths expect. The
 *    wrapper also refuses the characters XML cannot represent, which a browser
 *    rejects and `@xmldom/xmldom` passes through without a word.
 */
import ws from 'ws';
import { DOMParser as XmlDOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import { PARSE_ERROR_NS } from '../constants.js';
import { findDisallowedChar } from '../xml-chars.js';
const domImplementation = new DOMImplementation();
globalThis.WebSocket = ws;
globalThis.XMLSerializer = XMLSerializer;
// `xmlGenerator()` only ever calls `document.implementation.createDocument(...)`,
// so an empty document is the entire global `document` surface Strophe needs.
globalThis.document = domImplementation.createDocument(null, null, null);
// --- strict parsing --------------------------------------------------------
/**
 * Parse as strictly as a browser does, throwing on anything a browser refuses.
 *
 * `@xmldom/xmldom` reports a character which XML cannot represent neither as a
 * `fatalError` nor as anything else: it hands the text back with the character
 * still in it. A stanza built or received under Node would then carry it to the
 * wire, and the server would answer the stream with `not-well-formed` and close
 * it. Browsers refuse such a document, and so does the `saxes` parser the
 * XEP-0114 transport uses, so this is the one place the three disagreed.
 *
 * Everything the library parses arrives here, which is why the check lives at
 * the parser rather than at each of the places a value can be interpolated: a
 * value written into an attribute, a comment, a CDATA section or at document
 * level is read by the parser like any other markup, and so is a stanza which
 * came off the wire. A value in element content is the one exception, since it
 * becomes a text node without being parsed at all; `stanza` refuses it there,
 * which is why both ask {@link findDisallowedChar} rather than one of them
 * covering the other.
 *
 * The source is not the only way in. A character reference such as `&#0;` is
 * plain ASCII in the source, and `@xmldom/xmldom` resolves it to the character
 * it names without a word, though XML 1.0 § 4.1 forbids a reference to one as
 * it forbids the character. So the tree is read again after parsing, but only
 * where the source holds a reference: everything else was already read whole.
 */
function parseStrictly(source, mimeType) {
    const found = findDisallowedChar(source);
    if (found) {
        throw new Error(`disallowed character ${found.point} at index ${found.index}`);
    }
    const parser = new XmlDOMParser({
        onError: (level, message) => {
            if (level === 'fatalError') {
                throw new Error(typeof message === 'string' ? message : String(message));
            }
        },
    });
    const doc = parser.parseFromString(source, mimeType);
    if (source.includes('&#'))
        assertRepresentable(doc);
    return doc;
}
/**
 * Throw if a text node or an attribute value under `node` holds a character XML
 * cannot represent. Only those two can: a reference is not read as one inside a
 * comment, a CDATA section or a processing instruction.
 */
function assertRepresentable(node) {
    var _a;
    if (node.nodeType === node.TEXT_NODE) {
        const found = findDisallowedChar((_a = node.nodeValue) !== null && _a !== void 0 ? _a : '');
        if (found)
            throw new Error(`disallowed character ${found.point} referenced in text`);
    }
    else if (node.nodeType === node.ELEMENT_NODE) {
        for (const attr of Array.from(node.attributes)) {
            const found = findDisallowedChar(attr.value);
            if (found) {
                throw new Error(`disallowed character ${found.point} referenced in the "${attr.name}" attribute`);
            }
        }
    }
    for (let child = node.firstChild; child; child = child.nextSibling)
        assertRepresentable(child);
}
// --- DOM API polyfills -----------------------------------------------------
// `@xmldom/xmldom` omits a couple of browser DOM APIs that Strophe's shared code
// assumes. Add them to xmldom's Element/Document prototypes, grabbed off a
// sample tree, so the rest of the library stays browser-idiomatic.
const sample = domImplementation.createDocument(null, 'sample', null);
const elementProto = Object.getPrototypeOf(sample.documentElement);
const documentProto = Object.getPrototypeOf(sample);
// `ParentNode.firstElementChild`: the first child whose nodeType is ELEMENT_NODE.
for (const proto of [elementProto, documentProto]) {
    if (proto && !('firstElementChild' in proto)) {
        Object.defineProperty(proto, 'firstElementChild', {
            configurable: true,
            get() {
                var _a;
                let node = this.firstChild;
                while (node && node.nodeType !== 1) {
                    node = node.nextSibling;
                }
                return (_a = node) !== null && _a !== void 0 ? _a : null;
            },
        });
    }
}
// `Document.adoptNode`: take a node out of the document it was parsed into and
// into this one, in place. `stx` uses it to move an interpolated fragment into
// the stanza rather than deep-copying it with `importNode`, the fragment's own
// document being thrown away the moment it has been read.
//
// Attributes are left as they are. Their `ownerDocument` is not consulted by
// anything here, and walking them would cost more than the move saves.
if (documentProto && !('adoptNode' in documentProto)) {
    Object.defineProperty(documentProto, 'adoptNode', {
        configurable: true,
        value: function (node) {
            var _a;
            const doc = this;
            (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(node);
            const claim = (n) => {
                n.ownerDocument = doc;
                for (let child = n.firstChild; child; child = child.nextSibling)
                    claim(child);
            };
            claim(node);
            return node;
        },
    });
}
// `Element.innerHTML`: used by Builder.h() for XHTML-IM. jsdom parsed this as
// HTML; a lightweight XML DOM cannot, but XHTML-IM payloads are well-formed XML
// by definition, so parse the assigned markup as XML. Malformed input leaves the
// element empty rather than throwing (Builder.h() then produces no XHTML body).
// The getter serialises the children back, escaping text as XML.
if (elementProto && !('innerHTML' in elementProto)) {
    Object.defineProperty(elementProto, 'innerHTML', {
        configurable: true,
        get() {
            const serializer = new XMLSerializer();
            let out = '';
            for (let i = 0; i < this.childNodes.length; i++) {
                out += serializer.serializeToString(this.childNodes[i]);
            }
            return out;
        },
        set(html) {
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }
            let root;
            try {
                const doc = parseStrictly(`<xhtml>${html}</xhtml>`, 'text/xml');
                root = doc.documentElement;
            }
            catch (_a) {
                return;
            }
            if (root) {
                while (root.firstChild) {
                    this.appendChild(root.firstChild);
                }
            }
        },
    });
}
// --- DOMParser parse-error compatibility -----------------------------------
// Browsers return a document rooted at a `<parsererror>` element on malformed
// XML; `@xmldom/xmldom` throws instead. Wrap it so downstream code keeps seeing
// the browser shape.
class DOMParser {
    parseFromString(source, mimeType) {
        var _a;
        try {
            return parseStrictly(source, mimeType);
        }
        catch (e) {
            const doc = domImplementation.createDocument(PARSE_ERROR_NS, 'parsererror', null);
            (_a = doc.documentElement) === null || _a === void 0 ? void 0 : _a.appendChild(doc.createTextNode(e.message));
            return doc;
        }
    }
}
globalThis.DOMParser = DOMParser;
