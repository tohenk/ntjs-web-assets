/**
 * Remove the whitespace which pretty-printing put between an element's tags.
 *
 * XML written by hand (or via the `stx` template literal) is usually indented,
 * and parsing it turns each run of indentation into a text node. Those
 * whitespace-only text nodes are formatting, not content, so they're removed.
 * Whitespace which is content is kept:
 *
 * - An element whose only child is a text node keeps it, so `<body>   </body>`
 *   survives intact.
 * - A subtree marked `xml:space="preserve"` is left alone, per XML 1.0 § 2.10,
 *   until a descendant sets `xml:space="default"` again.
 * - An XHTML-IM `<body>`, the one in the XHTML namespace, is left alone, since
 *   the whitespace between its inline elements separates words rather than
 *   laying them out, unless it sets `xml:space="default"`.
 * - Anything `keep` claims, which is how a caller which knows more than this
 *   function does says so.
 *
 * Kept out of `utils` because everything `utils` exports is spread onto the
 * `Strophe` object, and `keep` and `preserve` are internal rather than public
 * API. {@link stripWhitespace} is the public entry point.
 *
 * @param el
 * @param keep - Whether a whitespace-only text node is content after all.
 * @param preserve - Whether an ancestor asked for whitespace to be preserved.
 *  Only the recursion passes this.
 * @returns
 */
export declare function strip(el: Element, keep: (node: Node) => boolean, preserve?: boolean): Element;
//# sourceMappingURL=whitespace.d.ts.map