/**
 * What XML 1.0 says a document may be made of, character by character.
 *
 * Kept in a module of its own because the `stx` builder and the Node DOM shim
 * both have to ask this, and neither is somewhere the other can import from.
 * It pulls in nothing itself, so the shim can have it at load time without
 * dragging the library along behind it.
 */
/**
 * Where a string first holds something XML cannot represent.
 */
export interface DisallowedChar {
    /** The offending code point, written the way Unicode writes one. */
    point: string;
    /** Where in the string it was found. */
    index: number;
}
/**
 * The first character of `text` which XML cannot represent, if it holds one.
 *
 * The caller words its own error, since what is worth saying depends on where
 * the text came from: a value handed to `stx` can be pointed at and named,
 * whereas a document arriving at the parser can only be refused.
 *
 * @param text
 * @returns The character and where it is, or null if the text is entirely
 *  representable.
 */
export declare function findDisallowedChar(text: string): DisallowedChar | null;
/**
 * A string as XML is able to carry it, for the places one is put into a tree
 * without a parser ever reading it.
 *
 * Line endings are normalised as XML 1.0 § 2.11 requires. Left alone, a CRLF
 * reaches the wire intact and every recipient's parser turns it into a line
 * feed, so the sender's own tree disagrees with the one everyone else holds
 * about a message they all received whole.
 *
 * A character XML cannot represent is refused. Nothing escapes one, so a stanza
 * carrying it is unsendable: it would be serialized unchanged, and the server
 * would answer the stream with `not-well-formed` and close it, costing the
 * connection rather than the one message.
 *
 * @param text
 * @param subject - What to call the text in the error, as the sentence's
 *  subject: `A text node`, `The "id" attribute`.
 * @returns The text, with its line endings normalised.
 */
export declare function xmlText(text: string, subject: string): string;
/**
 * Text already escaped by `xmlescape`, with its whitespace written so that an
 * attribute value reads it back unchanged.
 *
 * A parser normalises the whitespace in an attribute value (XML 1.0 § 3.3.3):
 * a tab, a line feed or a carriage return written literally is read back as a
 * space. Written as a character reference each is read back as itself, which is
 * the only way an attribute can carry one at all. Element content needs none of
 * it, since a parser leaves the whitespace between tags as it stands.
 *
 * Takes the text escaped rather than escaping it, so that this module still
 * pulls in nothing.
 *
 * @param escaped - Text which has been through `xmlescape`.
 * @returns The text, as an attribute value has to hold it.
 */
export declare function attributeWhitespace(escaped: string): string;
//# sourceMappingURL=xml-chars.d.ts.map