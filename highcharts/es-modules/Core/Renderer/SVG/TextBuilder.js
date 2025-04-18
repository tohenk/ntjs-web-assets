/* *
 *
 *  (c) 2010-2025 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import AST from '../HTML/AST.js';
import H from '../../Globals.js';
const { doc, SVG_NS, win } = H;
import U from '../../Utilities.js';
const { attr, extend, fireEvent, isString, objectEach, pick } = U;
// Function used to test string length including an ellipsis
const stringWithEllipsis = (text, currentIndex) => text.substring(0, currentIndex) + '\u2026';
/* *
 *
 *  Class
 *
 * */
/**
 * SVG Text Builder
 * @private
 * @class
 * @name Highcharts.TextBuilder
 */
class TextBuilder {
    constructor(svgElement) {
        const textStyles = svgElement.styles;
        this.renderer = svgElement.renderer;
        this.svgElement = svgElement;
        this.width = svgElement.textWidth;
        this.textLineHeight = textStyles?.lineHeight;
        this.textOutline = textStyles?.textOutline;
        this.ellipsis = Boolean(textStyles?.textOverflow === 'ellipsis');
        this.lineClamp = textStyles?.lineClamp;
        this.noWrap = Boolean(textStyles?.whiteSpace === 'nowrap');
    }
    /**
     * Build an SVG representation of the pseudo HTML given in the object's
     * svgElement.
     *
     * @private
     *
     * @return {void}.
     */
    buildSVG() {
        const wrapper = this.svgElement, textNode = wrapper.element, renderer = wrapper.renderer, textStr = pick(wrapper.textStr, '').toString(), hasMarkup = textStr.indexOf('<') !== -1, childNodes = textNode.childNodes, tempParent = !wrapper.added && renderer.box, regexMatchBreaks = /<br.*?>/g, 
        // The buildText code is quite heavy, so if we're not changing
        // something that affects the text, skip it (#6113).
        textCache = [
            textStr,
            this.ellipsis,
            this.noWrap,
            this.textLineHeight,
            this.textOutline,
            wrapper.getStyle('font-size'),
            wrapper.styles.lineClamp,
            this.width
        ].join(',');
        if (textCache === wrapper.textCache) {
            return;
        }
        wrapper.textCache = textCache;
        delete wrapper.actualWidth;
        // Remove old text
        for (let i = childNodes.length; i--;) {
            textNode.removeChild(childNodes[i]);
        }
        // Simple strings, add text directly and return
        if (!hasMarkup &&
            !this.ellipsis &&
            !this.width &&
            !wrapper.textPath &&
            (textStr.indexOf(' ') === -1 ||
                (this.noWrap && !regexMatchBreaks.test(textStr)))) {
            textNode.appendChild(doc.createTextNode(this.unescapeEntities(textStr)));
            // Complex strings, add more logic
        }
        else if (textStr !== '') {
            if (tempParent) {
                // Attach it to the DOM to read offset width and font size
                tempParent.appendChild(textNode);
            }
            // Step 1. Parse the markup safely and directly into a tree
            // structure.
            const ast = new AST(textStr);
            // Step 2. Do as many as we can of the modifications to the tree
            // structure before it is added to the DOM
            this.modifyTree(ast.nodes);
            ast.addToDOM(textNode);
            // Step 3. Some modifications can't be done until the structure is
            // in the DOM, because we need to read computed metrics.
            this.modifyDOM();
            // Add title if an ellipsis was added
            if (this.ellipsis &&
                (textNode.textContent || '').indexOf('\u2026') !== -1) {
                wrapper.attr('title', this.unescapeEntities(wrapper.textStr || '', ['&lt;', '&gt;']) // #7179
                );
            }
            if (tempParent) {
                tempParent.removeChild(textNode);
            }
        }
        // Apply the text outline
        if (isString(this.textOutline) && wrapper.applyTextOutline) {
            wrapper.applyTextOutline(this.textOutline);
        }
    }
    /**
     * Modify the DOM of the generated SVG structure. This function only does
     * operations that cannot be done until the elements are attached to the
     * DOM, like doing layout based on rendered metrics of the added elements.
     *
     * @private
     *
     */
    modifyDOM() {
        const wrapper = this.svgElement;
        const x = attr(wrapper.element, 'x');
        wrapper.firstLineMetrics = void 0;
        // Remove empty tspans (including breaks) from the beginning because
        // SVG's getBBox doesn't count empty lines. The use case is tooltip
        // where the header is empty. By doing this in the DOM rather than in
        // the AST, we can inspect the textContent directly and don't have to
        // recurse down to look for valid content.
        let firstChild;
        while ((firstChild = wrapper.element.firstChild)) {
            if (/^[\s\u200B]*$/.test(firstChild.textContent || ' ')) {
                wrapper.element.removeChild(firstChild);
            }
            else {
                break;
            }
        }
        // Modify hard line breaks by applying the rendered line height
        [].forEach.call(wrapper.element.querySelectorAll('tspan.highcharts-br'), (br, i) => {
            if (br.nextSibling && br.previousSibling) { // #5261
                if (i === 0 && br.previousSibling.nodeType === 1) {
                    wrapper.firstLineMetrics = wrapper.renderer
                        .fontMetrics(br.previousSibling);
                }
                attr(br, {
                    // Since the break is inserted in front of the next
                    // line, we need to use the next sibling for the line
                    // height
                    dy: this.getLineHeight(br.nextSibling),
                    x
                });
            }
        });
        // Constrain the line width, either by ellipsis or wrapping
        const width = this.width || 0;
        if (!width) {
            return;
        }
        // Insert soft line breaks into each text node
        const modifyTextNode = (textNode, parentElement) => {
            const text = textNode.textContent || '';
            const words = text
                .replace(/([^\^])-/g, '$1- ') // Split on hyphens
                // .trim()
                .split(' '); // #1273
            const hasWhiteSpace = !this.noWrap && (words.length > 1 || wrapper.element.childNodes.length > 1);
            const dy = this.getLineHeight(parentElement), ellipsisWidth = Math.max(0, 
            // Subtract the font face to make room for
            // the ellipsis itself
            width - 0.8 * dy);
            let lineNo = 0;
            let startAt = wrapper.actualWidth;
            if (hasWhiteSpace) {
                const lines = [];
                // Remove preceding siblings in order to make the text length
                // calculation correct in the truncate function
                const precedingSiblings = [];
                while (parentElement.firstChild &&
                    parentElement.firstChild !== textNode) {
                    precedingSiblings.push(parentElement.firstChild);
                    parentElement.removeChild(parentElement.firstChild);
                }
                while (words.length) {
                    // Apply the previous line
                    if (words.length && !this.noWrap && lineNo > 0) {
                        lines.push(textNode.textContent || '');
                        textNode.textContent = words.join(' ')
                            .replace(/- /g, '-');
                    }
                    // For each line, truncate the remaining
                    // words into the line length.
                    this.truncate(textNode, void 0, words, lineNo === 0 ? (startAt || 0) : 0, width, ellipsisWidth, 
                    // Build the text to test for
                    (t, currentIndex) => words
                        .slice(0, currentIndex)
                        .join(' ')
                        .replace(/- /g, '-'));
                    startAt = wrapper.actualWidth;
                    lineNo++;
                    // Line clamp. Break out after n lines and append an
                    // ellipsis regardless of the text length.
                    if (this.lineClamp && lineNo >= this.lineClamp) {
                        // Only if there are remaining words that should have
                        // been rendered.
                        if (words.length) {
                            this.truncate(textNode, textNode.textContent || '', void 0, 0, 
                            // Target width
                            width, ellipsisWidth, stringWithEllipsis);
                            textNode.textContent = textNode.textContent
                                ?.replace('\u2026', '') + '\u2026';
                        }
                        break;
                    }
                }
                // Reinsert the preceding child nodes
                precedingSiblings.forEach((childNode) => {
                    parentElement.insertBefore(childNode, textNode);
                });
                // Insert the previous lines before the original text node
                lines.forEach((line) => {
                    // Insert the line
                    parentElement.insertBefore(doc.createTextNode(line), textNode);
                    // Insert a break
                    const br = doc.createElementNS(SVG_NS, 'tspan');
                    br.textContent = '\u200B'; // Zero-width space
                    attr(br, { dy, x });
                    parentElement.insertBefore(br, textNode);
                });
            }
            else if (this.ellipsis) {
                if (text) {
                    this.truncate(textNode, text, void 0, 0, 
                    // Target width
                    width, ellipsisWidth, stringWithEllipsis);
                }
            }
        };
        // Recurse down the DOM tree and handle line breaks for each text node
        const modifyChildren = ((node) => {
            const childNodes = [].slice.call(node.childNodes);
            childNodes.forEach((childNode) => {
                if (childNode.nodeType === win.Node.TEXT_NODE) {
                    modifyTextNode(childNode, node);
                }
                else {
                    // Reset word-wrap width readings after hard breaks
                    if (childNode.className.baseVal
                        .indexOf('highcharts-br') !== -1) {
                        wrapper.actualWidth = 0;
                    }
                    // Recurse down to child node
                    modifyChildren(childNode);
                }
            });
        });
        modifyChildren(wrapper.element);
    }
    /**
     * Get the rendered line height of a <text>, <tspan> or pure text node.
     * @private
     * @param {DOMElementType|Text} node The node to check for
     * @return {number} The rendered line height
     */
    getLineHeight(node) {
        // If the node is a text node, use its parent
        const element = (node.nodeType === win.Node.TEXT_NODE) ?
            node.parentElement :
            node;
        return this.textLineHeight ?
            parseInt(this.textLineHeight.toString(), 10) :
            this.renderer.fontMetrics(element || this.svgElement.element).h;
    }
    /**
     * Transform a pseudo HTML AST node tree into an SVG structure. We do as
     * much heavy lifting as we can here, before doing the final processing in
     * the modifyDOM function. The original data is mutated.
     *
     * @private
     *
     * @param {ASTNode[]} nodes The AST nodes
     *
     */
    modifyTree(nodes) {
        const modifyChild = (node, i) => {
            const { attributes = {}, children, style = {}, tagName } = node, styledMode = this.renderer.styledMode;
            // Apply styling to text tags
            if (tagName === 'b' || tagName === 'strong') {
                if (styledMode) {
                    // eslint-disable-next-line dot-notation
                    attributes['class'] = 'highcharts-strong';
                }
                else {
                    style.fontWeight = 'bold';
                }
            }
            else if (tagName === 'i' || tagName === 'em') {
                if (styledMode) {
                    // eslint-disable-next-line dot-notation
                    attributes['class'] = 'highcharts-emphasized';
                }
                else {
                    style.fontStyle = 'italic';
                }
            }
            // Modify styling
            if (style?.color) {
                style.fill = style.color;
            }
            // Handle breaks
            if (tagName === 'br') {
                attributes['class'] = 'highcharts-br'; // eslint-disable-line dot-notation
                node.textContent = '\u200B'; // Zero-width space
                // Trim whitespace off the beginning of new lines
                const nextNode = nodes[i + 1];
                if (nextNode?.textContent) {
                    nextNode.textContent =
                        nextNode.textContent.replace(/^ +/gm, '');
                }
                // If an anchor has direct text node children, the text is unable to
                // wrap because there is no `getSubStringLength` function on the
                // element. Therefore we need to wrap the child text node or nodes
                // in a tspan. #16173.
            }
            else if (tagName === 'a' &&
                children &&
                children.some((child) => child.tagName === '#text')) {
                node.children = [{ children, tagName: 'tspan' }];
            }
            if (tagName !== '#text' && tagName !== 'a') {
                node.tagName = 'tspan';
            }
            extend(node, { attributes, style });
            // Recurse
            if (children) {
                children
                    .filter((c) => c.tagName !== '#text')
                    .forEach(modifyChild);
            }
        };
        nodes.forEach(modifyChild);
        fireEvent(this.svgElement, 'afterModifyTree', { nodes });
    }
    /*
     * Truncate the text node contents to a given length. Used when the css
     * width is set. If the `textOverflow` is `ellipsis`, the text is truncated
     * character by character to the given length. If not, the text is
     * word-wrapped line by line.
     */
    truncate(textNode, text, words, startAt, width, ellipsisWidth, getString) {
        const svgElement = this.svgElement;
        const { rotation } = svgElement;
        // Cache the lengths to avoid checking the same twice
        const lengths = [];
        // Word wrap cannot be truncated to shorter than one word, ellipsis
        // text can be completely blank.
        let minIndex = words && !startAt ? 1 : 0;
        let maxIndex = (text || words || '').length;
        let currentIndex = maxIndex;
        let str;
        let actualWidth;
        if (!words) {
            width = ellipsisWidth;
        }
        const getSubStringLength = function (charEnd, concatenatedEnd) {
            // `charEnd` is used when finding the character-by-character
            // break for ellipsis, concatenatedEnd is used for word-by-word
            // break for word wrapping.
            const end = concatenatedEnd || charEnd;
            const parentNode = textNode.parentNode;
            if (parentNode && typeof lengths[end] === 'undefined') {
                // Modern browsers
                if (parentNode.getSubStringLength) {
                    // Fails with DOM exception on unit-tests/legend/members
                    // of unknown reason. Desired width is 0, text content
                    // is "5" and end is 1.
                    try {
                        lengths[end] = startAt +
                            parentNode.getSubStringLength(0, words ? end + 1 : end);
                    }
                    catch (e) {
                        '';
                    }
                }
            }
            return lengths[end];
        };
        svgElement.rotation = 0; // Discard rotation when computing box
        actualWidth = getSubStringLength(textNode.textContent.length);
        if (startAt + actualWidth > width) {
            // Do a binary search for the index where to truncate the text
            while (minIndex <= maxIndex) {
                currentIndex = Math.ceil((minIndex + maxIndex) / 2);
                // When checking words for word-wrap, we need to build the
                // string and measure the subStringLength at the concatenated
                // word length.
                if (words) {
                    str = getString(words, currentIndex);
                }
                actualWidth = getSubStringLength(currentIndex, str && str.length - 1);
                if (minIndex === maxIndex) {
                    // Complete
                    minIndex = maxIndex + 1;
                }
                else if (actualWidth > width) {
                    // Too large. Set max index to current.
                    maxIndex = currentIndex - 1;
                }
                else {
                    // Within width. Set min index to current.
                    minIndex = currentIndex;
                }
            }
            // If max index was 0 it means the shortest possible text was also
            // too large. For ellipsis that means only the ellipsis, while for
            // word wrap it means the whole first word.
            if (maxIndex === 0) {
                // Remove ellipsis
                textNode.textContent = '';
                // If the new text length is one less than the original, we don't
                // need the ellipsis
            }
            else if (!(text && maxIndex === text.length - 1)) {
                textNode.textContent = str || getString(text || words, currentIndex);
            }
            // Add ellipsis on individual lines
            if (this.ellipsis && actualWidth > width) {
                this.truncate(textNode, textNode.textContent || '', void 0, 0, width, ellipsisWidth, stringWithEllipsis);
            }
        }
        // When doing line wrapping, prepare for the next line by removing the
        // items from this line.
        if (words) {
            words.splice(0, currentIndex);
        }
        svgElement.actualWidth = actualWidth;
        svgElement.rotation = rotation; // Apply rotation again.
    }
    /*
     * Un-escape HTML entities based on the public `renderer.escapes` list
     *
     * @private
     *
     * @param {string} inputStr The string to unescape
     * @param {Array<string>} [except] Exceptions
     *
     * @return {string} The processed string
     */
    unescapeEntities(inputStr, except) {
        objectEach(this.renderer.escapes, function (value, key) {
            if (!except || except.indexOf(value) === -1) {
                inputStr = inputStr.toString().replace(new RegExp(value, 'g'), key);
            }
        });
        return inputStr;
    }
}
export default TextBuilder;
