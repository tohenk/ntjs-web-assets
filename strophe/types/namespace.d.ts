/**
 * Return the XML namespace of an element.
 *
 * Prefers the serialized `xmlns` attribute and falls back to the DOM
 * `namespaceURI`, because the two diverge depending on how the element was
 * built and neither is reliable on its own:
 *
 *  - Locally-built stanzas (`$iq`, `stx`, {@link Builder}) are created with
 *    `createElement` and carry their namespace only in the `xmlns` attribute;
 *    their `namespaceURI` is null.
 *  - Stanzas received over the XEP-0114 component transport are built with
 *    `createElementNS` and carry their namespace only on `namespaceURI`; the
 *    redundant `xmlns` attribute is omitted.
 *  - WebSocket / BOSH stanzas parsed by `DOMParser` carry both, except on
 *    child elements that inherit the default namespace without redeclaring it
 *    (those have only `namespaceURI`).
 *
 * Checking both is the transport-agnostic way to read an element's namespace.
 *
 * @method Strophe.getNamespace
 * @param elem - The element whose namespace is wanted.
 * @returns The namespace URI, or null if the element has none.
 */
export declare function getNamespace(elem: Element): string | null;
/**
 * Complain about a stanza which is in neither of the namespaces a stanza may
 * be in.
 *
 * Only `message`, `iq` and `presence` are stanzas. Anything else is some other
 * element which happens to have been passed in, and is in whatever namespace
 * it likes.
 *
 * Reads `namespaceURI` rather than going through {@link getNamespace} because
 * every caller hands it an element which has just come out of the parser,
 * where the resolved namespace is the one that counts.
 *
 * @param node - The element to check.
 * @param throwErrorIfInvalidNS - Whether the wrong namespace is fatal rather
 *  than merely logged.
 */
export declare function checkNamespace(node: Element, throwErrorIfInvalidNS?: boolean): void;
//# sourceMappingURL=namespace.d.ts.map