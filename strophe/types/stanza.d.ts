import Builder from './builder.js';
export declare class UnsafeXML extends String {
}
export type StanzaValue = string | Stanza | Builder | UnsafeXML | StanzaValue[];
/**
 * Where in the template the next value lands.
 */
export interface Cursor {
    mode: 'text' | 'tag' | 'pi' | 'comment' | 'cdata';
    quote: string;
    depth: number;
    element: boolean;
    prev: string;
    tail: number;
    opened: boolean;
    slot: string;
}
/**
 * A cursor placed at the start of a template. A nested template shares it, so
 * the whole stanza is expanded with the one slot name and filled in one pass.
 */
export declare function newCursor(): Cursor;
/**
 * The run of text ended in the middle of what it was reading. The construct
 * carries on into the next run, so the cursor is left in the mode it reached.
 */
export declare const EXHAUSTED = -1;
/**
 * Element content, up to the `<` which ends it.
 *
 * What follows the `<` says what was opened. A comment, a CDATA section and a
 * processing instruction are read whole by {@link scanDelimited}; everything
 * else is a tag, and only some tags are an element's.
 */
export declare function scanText(xml: string, i: number, cursor: Cursor): number;
/**
 * The inside of a tag, a character at a time, up to the `>` which ends it.
 *
 * A character at a time because a `>` inside an attribute value does not end
 * the tag, so the quoting has to be followed through, and because whether the
 * tag closed the element it opened is only readable from the character before
 * the `>`.
 */
export declare function scanTag(xml: string, i: number, cursor: Cursor): number;
/**
 * A processing instruction, a comment or a CDATA section, up to its closing
 * token.
 *
 * All three are opaque. What they hold is not markup, so there is nothing in
 * there to count and nowhere in there to stand a value.
 *
 * A run can end part-way through a `]]>`, with the `]` in this run and the `>`
 * in the next. Neither run holds the token, so a search of either finds
 * nothing, yet the parser reads the two as one text and closes the section
 * there. The `]` a CDATA run ends in are therefore counted into
 * {@link Cursor.tail}, for {@link emit} to hold against the run which follows.
 * Two are all a `]]>` can use, so no more are counted.
 */
export declare function scanDelimited(xml: string, i: number, cursor: Cursor): number;
/**
 * Read a run of template text, leaving the cursor where that text ended.
 *
 * This is a lexer that answers the question where in the markup the next value
 * lands, because that decides whether it can be represented by a processing
 * instruction or has to be written out verbatim.
 *
 * The parser can't answer this because it needs the finished text with every
 * interpolated value already written, but the way the values are written (i.e.
 * with or without whitespace) depends on the answer.
 *
 * It is deliberately not a validator and rejects nothing, since the parser will
 * validate a moment later and will say it better. All it has to get right is which
 * of three places the text ended in, and how many elements are open there:
 *
 * - in element content, where a value can be stood in for by a processing
 *   instruction, so long as an element encloses it
 * - inside a tag, where no processing instruction can go, so the value is
 *   written out instead
 * - inside a processing instruction, a comment or a CDATA section, likewise
 */
export declare function scan(xml: string, cursor: Cursor): void;
/**
 * A Stanza represents a XML element used in XMPP (commonly referred to as stanzas).
 */
export declare class Stanza extends Builder {
    #private;
    constructor(strings: TemplateStringsArray, values: StanzaValue[]);
    /**
     * A directive which can be used to pass a string of XML as a value to the
     * stx tagged template literal.
     *
     * It's considered "unsafe" because it can pose a security risk if used with
     * untrusted input.
     *
     * @example
     *    const status = '<status>I am busy!</status>';
     *    const pres = stx`
     *       <presence from='juliet@example.com/chamber' id='pres1'>
     *           <show>dnd</show>
     *           ${unsafeXML(status)}
     *       </presence>`;
     *    connection.send(pres);
     */
    static unsafeXML(string: string): UnsafeXML;
    /**
     * Turns the passed-in string into an XML Element.
     */
    static toElement(string: string, throwErrorIfInvalidNS?: boolean): Element;
    /**
     * Build the stanza the template describes.
     */
    buildTree(): Element;
}
/**
 * Tagged template literal function which generates {@link Stanza} objects
 *
 * @example
 *      const pres = stx`<presence type="${type}" xmlns="jabber:client"><show>${show}</show></presence>`
 *      connection.send(pres);
 *
 * @example
 *      const msg = stx`<message
 *          from='sender@example.org'
 *          id='hgn27af1'
 *          to='recipient@example.org'
 *          type='chat'>
 *          <body>Hello world</body>
 *      </message>`;
 *
 *      connection.send(msg);
 *
 * Templates may be indented freely. The whitespace written between their tags
 * is formatting and is removed. However, whitespace which arrives through a `${}`
 * value (and is not itself inside a template) is considered content and kept.
 *
 * So the rule to write by is that whitespace you want on the wire goes inside
 * the `${}`.
 *
 *      stx`<div xmlns="${XHTML}">${[link1, '\n', link2]}</div>`  // kept
 *      stx`<div xmlns="${XHTML}">${link1}
 *          ${link2}</div>`                                      // removed
 *
 * Which way the template's own indentation around a `${}` goes is decided by
 * what the value puts against it, not by how the value was written. Indentation
 * against text is part of that text and is kept; indentation against an element
 * separates elements and is formatting, so it is removed. A string and markup
 * which begins and ends in text therefore lay out alike:
 *
 *      stx`<c>
 *          ${'hello'}
 *      </c>`                     // <c> holds a line break, "hello", a line break
 *      stx`<c>
 *          ${unsafeXML('hello')}
 *      </c>`                     // the same
 *      stx`<c>
 *          ${unsafeXML('<p>hello</p>')}
 *      </c>`                     // <c> holds only the <p>
 *
 * Each end is read on its own, so markup which begins in text and ends in an
 * element keeps the indentation before it and loses the indentation after it.
 * Whitespace inside the value is its own either way and is never touched.
 *
 * Two things are exempt, because their whitespace is read rather than laid
 * out: an XHTML-IM `<body>`, the one in the XHTML namespace, where a run of
 * whitespace between two inline elements separates words, and any subtree
 * marked `xml:space="preserve"`. The latter is also how to keep whitespace in
 * a string passed to {@link Stanza.toElement}, where there is no `${}` to put
 * it in. Either may opt out again with `xml:space="default"`.
 *
 * A value interpolated at document level, where no element encloses it, is
 * the exception to all of the above. It is the stanza rather than content
 * within one, so it is considered markup like a template's and its whitespace
 * is stripped the same way:
 *
 *      const xhtml = `<title type="xhtml"><div xmlns="${XHTML}">
 *          <a href="${a}">@bob</a>\n<a href="${b}">link</a>
 *      </div></title>`;
 *
 *      stx`<message xmlns="jabber:client">${unsafeXML(xhtml)}</message>`
 *      // the line break between the two <a> elements is kept
 *
 *      stx`${unsafeXML(`<message xmlns="jabber:client">${xhtml}</message>`)}`
 *      // it is stripped, along with the template's own indentation
 *
 * The two are told apart by where the whitespace came from, and at document
 * level that is no longer knowable. `xml:space="preserve"` is the only handle
 * there, so mark the elements whose whitespace matters before passing the markup in.
 *
 * Whitespace between XHTML elements is fragile in general, since it collapses
 * to a single space when rendered and this library is not the only thing
 * which may drop it. The business rules of XEP-0071 recommend writing a line
 * break as `<br/>` and whitespace which carries meaning as the equivalent
 * number of no-break spaces, which survives regardless.
 */
export declare function stx(strings: TemplateStringsArray, ...values: StanzaValue[]): Stanza;
//# sourceMappingURL=stanza.d.ts.map