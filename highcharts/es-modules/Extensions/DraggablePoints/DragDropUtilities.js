/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  Authors: Øystein Moseng, Torstein Hønsi, Jon A. Nygård
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import U from '../../Core/Utilities.js';
const { addEvent } = U;
/* *
 *
 *  Functions
 *
 * */
/**
 * Add multiple event listeners with the same handler to the same element.
 *
 * @private
 * @function addEvents
 * @param {T} el
 *        The element or object to add listeners to.
 * @param {Array<string>} types
 *        Array with the event types this handler should apply to.
 * @param {Function|Highcharts.EventCallbackFunction<T>} fn
 *        The function callback to execute when the events are fired.
 * @param {Highcharts.EventOptionsObject} [options]
 *        Event options:
 *        - `order`: The order the event handler should be called. This opens
 *          for having one handler be called before another, independent of in
 *          which order they were added.
 * @return {Function}
 *         A callback function to remove the added events.
 * @template T
 */
function addEvents(el, types, fn, options) {
    const removeFuncs = types.map((type) => addEvent(el, type, fn, options));
    return function () {
        for (const fn of removeFuncs) {
            fn();
        }
    };
}
/**
 * Utility function to count the number of props in an object.
 *
 * @private
 * @function countProps
 *
 * @param {Object} obj
 *        The object to count.
 *
 * @return {number}
 *         Number of own properties on the object.
 */
function countProps(obj) {
    return Object.keys(obj).length;
}
/**
 * Utility function to get the value of the first prop of an object. (Note that
 * the order of keys in an object is usually not guaranteed.)
 *
 * @private
 * @function getFirstProp
 * @param {Highcharts.Dictionary<T>} obj
 *        The object to count.
 * @return {T}
 *         Value of the first prop in the object.
 * @template T
 */
function getFirstProp(obj) {
    for (const p in obj) {
        if (Object.hasOwnProperty.call(obj, p)) {
            return obj[p];
        }
    }
}
/**
 * Take a mouse/touch event and return the event object with chartX/chartY.
 *
 * @private
 * @function getNormalizedEvent
 * @param {global.PointerEvent} e
 *        The event to normalize.
 * @param {Highcharts.Chart} chart
 *        The related chart.
 * @return {Highcharts.PointerEventLObject}
 *         The normalized event.
 */
function getNormalizedEvent(e, chart) {
    return (typeof e.chartX === 'undefined' ||
        typeof e.chartY === 'undefined' ?
        chart.pointer?.normalize(e) || e :
        e);
}
/* *
 *
 *  Default Export
 *
 * */
const DragDropUtilities = {
    addEvents,
    countProps,
    getFirstProp,
    getNormalizedEvent
};
export default DragDropUtilities;
