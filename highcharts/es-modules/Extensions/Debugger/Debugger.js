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
import D from '../../Core/Defaults.js';
const { setOptions } = D;
import ErrorMessages from './ErrorMessages.js';
import H from '../../Core/Globals.js';
const { composed } = H;
import U from '../../Core/Utilities.js';
const { addEvent, find, isNumber, pushUnique } = U;
/* *
 *
 *  Constants
 *
 * */
const defaultOptions = {
    /**
     * @optionparent chart
     */
    chart: {
        /**
         * Whether to display errors on the chart. When `false`, the errors will
         * be shown only in the console.
         *
         * @sample highcharts/chart/display-errors/
         *         Show errors on chart
         *
         * @since    7.0.0
         * @requires modules/debugger
         */
        displayErrors: true
    }
};
/* *
 *
 *  Functions
 *
 * */
/**
 * @private
 */
function compose(ChartClass) {
    if (pushUnique(composed, 'Debugger')) {
        addEvent(ChartClass, 'beforeRedraw', onChartBeforeRedraw);
        addEvent(H, 'displayError', onHighchartsDisplayError);
        setOptions(defaultOptions);
    }
}
/**
 * @private
 */
function onChartBeforeRedraw() {
    const errorElements = this.errorElements;
    if (errorElements && errorElements.length) {
        for (const el of errorElements) {
            el.destroy();
        }
    }
    delete this.errorElements;
}
/**
 * @private
 */
function onHighchartsDisplayError(e) {
    // Display error on the chart causing the error or the last created chart.
    const chart = (e.chart ||
        find(this.charts.slice().reverse(), (c) => !!c));
    if (!chart) {
        return;
    }
    const code = e.code, options = chart.options.chart, renderer = chart.renderer;
    let msg, chartWidth, chartHeight;
    if (chart.errorElements) {
        for (const el of chart.errorElements) {
            if (el) {
                el.destroy();
            }
        }
    }
    if (options && options.displayErrors && renderer) {
        chart.errorElements = [];
        msg = isNumber(code) ?
            ('Highcharts error #' + code + ': ' +
                ErrorMessages[code].text) :
            code;
        chartWidth = chart.chartWidth;
        chartHeight = chart.chartHeight;
        // Format msg so SVGRenderer can handle it
        msg = msg
            .replace(/<h1>(.*)<\/h1>/g, '<br><span style="font-size: 2em">$1</span><br>')
            .replace(/<p>/g, '')
            .replace(/<\/p>/g, '<br>');
        // Render red chart frame.
        chart.errorElements[0] = renderer.rect(2, 2, chartWidth - 4, chartHeight - 4).attr({
            'stroke-width': 4,
            stroke: '#ff0000',
            zIndex: 3
        }).add();
        // Render error message
        chart.errorElements[1] = renderer.label(msg, 0, 0, 'rect', void 0, void 0, void 0, void 0, 'debugger').css({
            color: '#ffffff',
            fontSize: '0.8em',
            width: (chartWidth - 16) + 'px',
            padding: 0
        }).attr({
            fill: 'rgba(255, 0, 0, 0.9)',
            width: chartWidth,
            padding: 8,
            zIndex: 10
        }).add();
        chart.errorElements[1].attr({
            y: chartHeight - chart.errorElements[1].getBBox().height
        });
    }
}
/* *
 *
 *  Default Export
 *
 * */
const Debugger = {
    compose
};
export default Debugger;
