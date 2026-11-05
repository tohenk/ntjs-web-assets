export interface StreamParserHandlers {
    /** Called once the opening `<stream:stream …>` header is seen, with its
     * attributes (most importantly `id`). The header never closes until the
     * stream ends, so this fires as soon as its start tag is complete. */
    onStreamStart: (attrs: Record<string, string>) => void;
    /** Called with each complete top-level stanza as a DOM {@link Element}. */
    onStanza: (stanza: Element) => void;
    /** Called when the closing `</stream:stream>` tag is received. */
    onStreamEnd: () => void;
    /** Called on any XML parse error. The stream should be considered dead. */
    onError: (error: Error) => void;
}
/**
 * Incrementally parses an XMPP component stream.
 *
 * Feed it raw socket chunks via {@link ComponentParser#write}; it emits
 * stream-start, per-stanza and stream-end events through the handlers passed to
 * the constructor. Robust to a stanza (or a single multi-byte character) being
 * split across arbitrary chunk boundaries.
 */
export default class ComponentParser {
    private readonly _handlers;
    private _decoder;
    private _parser;
    /** Stack of elements currently being built (the in-progress stanza subtree).
     * Empty in between top-level stanzas. Excludes the stream root, which is
     * never materialised as an element. */
    private _stack;
    /** Whether the opening `<stream:stream>` header has been seen. */
    private _streamOpened;
    /** Set after a fatal parse error so that further writes are ignored. */
    private _errored;
    constructor(handlers: StreamParserHandlers);
    /**
     * Discard all parser state and start afresh. Called when a (re)connection
     * begins so a new stream is parsed from a clean slate.
     */
    reset(): void;
    /**
     * Feed a chunk of raw stream data into the parser.
     *
     * Accepts bytes (a `Buffer`, as delivered by a `node:net` socket, is a
     * `Uint8Array`) or an already decoded string. Bytes are run through a {@link StringDecoder} so that a
     * multi-byte UTF-8 character split across two chunks is reassembled instead
     * of corrupted.
     * @param chunk - The bytes (or string) received from the socket.
     */
    write(chunk: Uint8Array | string): void;
    private _fail;
    private _onOpenTag;
    private _onText;
    private _onCloseTag;
    private _createElement;
    private _flattenAttributes;
}
//# sourceMappingURL=component-parser.d.ts.map