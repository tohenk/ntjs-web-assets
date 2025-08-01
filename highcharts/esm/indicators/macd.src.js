/**
 * @license Highstock JS v12.3.0 (2025-06-21)
 * @module highcharts/indicators/macd
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2025 Sebastian Bochan
 *
 * License: www.highcharts.com/license
 */
import * as __WEBPACK_EXTERNAL_MODULE__highcharts_src_js_8202131d__ from "../highcharts.src.js";
import * as __WEBPACK_EXTERNAL_MODULE__modules_stock_src_js_b3d80146__ from "../modules/stock.src.js";
/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/

;// external ["../highcharts.src.js","default"]
const external_highcharts_src_js_default_namespaceObject = __WEBPACK_EXTERNAL_MODULE__highcharts_src_js_8202131d__["default"];
var external_highcharts_src_js_default_default = /*#__PURE__*/__webpack_require__.n(external_highcharts_src_js_default_namespaceObject);
;// external "../modules/stock.src.js"
var x = (y) => {
	var x = {}; __webpack_require__.d(x,
    	y); return x
    } 
    var y = (x) => (() => (x))
    const stock_src_js_namespaceObject = x({  });
;// external ["../highcharts.src.js","default","SeriesRegistry"]
const external_highcharts_src_js_default_SeriesRegistry_namespaceObject = __WEBPACK_EXTERNAL_MODULE__highcharts_src_js_8202131d__["default"].SeriesRegistry;
var external_highcharts_src_js_default_SeriesRegistry_default = /*#__PURE__*/__webpack_require__.n(external_highcharts_src_js_default_SeriesRegistry_namespaceObject);
;// ./code/es-modules/Stock/Indicators/MACD/MACDIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { noop } = (external_highcharts_src_js_default_default());

const { column: ColumnSeries, sma: SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend, correctFloat, defined, merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The MACD series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.macd
 *
 * @augments Highcharts.Series
 */
class MACDIndicator extends SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    init() {
        external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.sma.prototype.init.apply(this, arguments);
        const originalColor = this.color;
        // Check whether series is initialized. It may be not initialized,
        // when any of required indicators is missing.
        if (this.options) {
            // If the default colour doesn't set, get the next available from
            // the array and apply it #15608.
            if (defined(this.colorIndex)) {
                if (this.options.signalLine &&
                    this.options.signalLine.styles &&
                    !this.options.signalLine.styles.lineColor) {
                    this.options.colorIndex = this.colorIndex + 1;
                    this.getCyclic('color', void 0, this.chart.options.colors);
                    this.options.signalLine.styles.lineColor =
                        this.color;
                }
                if (this.options.macdLine &&
                    this.options.macdLine.styles &&
                    !this.options.macdLine.styles.lineColor) {
                    this.options.colorIndex = this.colorIndex + 1;
                    this.getCyclic('color', void 0, this.chart.options.colors);
                    this.options.macdLine.styles.lineColor =
                        this.color;
                }
            }
            // Zones have indexes automatically calculated, we need to
            // translate them to support multiple lines within one indicator
            this.macdZones = {
                zones: this.options.macdLine.zones,
                startIndex: 0
            };
            this.signalZones = {
                zones: this.macdZones.zones.concat(this.options.signalLine.zones),
                startIndex: this.macdZones.zones.length
            };
        }
        // Reset color and index #15608.
        this.color = originalColor;
    }
    toYData(point) {
        return [point.y, point.signal, point.MACD];
    }
    translate() {
        const indicator = this, plotNames = ['plotSignal', 'plotMACD'];
        external_highcharts_src_js_default_default().seriesTypes.column.prototype.translate.apply(indicator);
        indicator.points.forEach(function (point) {
            [point.signal, point.MACD].forEach(function (value, i) {
                if (value !== null) {
                    point[plotNames[i]] =
                        indicator.yAxis.toPixels(value, true);
                }
            });
        });
    }
    destroy() {
        // This.graph is null due to removing two times the same SVG element
        this.graph = null;
        this.graphmacd = this.graphmacd && this.graphmacd.destroy();
        this.graphsignal = this.graphsignal && this.graphsignal.destroy();
        external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.sma.prototype.destroy.apply(this, arguments);
    }
    drawGraph() {
        const indicator = this, mainLinePoints = indicator.points, mainLineOptions = indicator.options, histogramZones = indicator.zones, gappedExtend = {
            options: {
                gapSize: mainLineOptions.gapSize
            }
        }, otherSignals = [[], []];
        let point, pointsLength = mainLinePoints.length;
        // Generate points for top and bottom lines:
        while (pointsLength--) {
            point = mainLinePoints[pointsLength];
            if (defined(point.plotMACD)) {
                otherSignals[0].push({
                    plotX: point.plotX,
                    plotY: point.plotMACD,
                    isNull: !defined(point.plotMACD)
                });
            }
            if (defined(point.plotSignal)) {
                otherSignals[1].push({
                    plotX: point.plotX,
                    plotY: point.plotSignal,
                    isNull: !defined(point.plotMACD)
                });
            }
        }
        // Modify options and generate smoothing line:
        ['macd', 'signal'].forEach((lineName, i) => {
            indicator.points = otherSignals[i];
            indicator.options = merge(mainLineOptions[`${lineName}Line`]?.styles || {}, gappedExtend);
            indicator.graph = indicator[`graph${lineName}`];
            // Zones extension:
            indicator.zones = (indicator[`${lineName}Zones`].zones || []).slice(indicator[`${lineName}Zones`].startIndex || 0);
            external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.sma.prototype.drawGraph.call(indicator);
            indicator[`graph${lineName}`] = indicator.graph;
        });
        // Restore options:
        indicator.points = mainLinePoints;
        indicator.options = mainLineOptions;
        indicator.zones = histogramZones;
    }
    applyZones() {
        // Histogram zones are handled by drawPoints method
        // Here we need to apply zones for all lines
        const histogramZones = this.zones;
        // `signalZones.zones` contains all zones:
        this.zones = this.signalZones.zones;
        external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.sma.prototype.applyZones.call(this);
        // `applyZones` hides only main series.graph, hide macd line manually
        if (this.graphmacd && this.options.macdLine.zones.length) {
            this.graphmacd.hide();
        }
        this.zones = histogramZones;
    }
    getValues(series, params) {
        const indexToShift = (params.longPeriod - params.shortPeriod), // #14197
        MACD = [], xMACD = [], yMACD = [];
        let shortEMA, longEMA, i, j = 0, signalLine = [];
        if (series.xData.length <
            params.longPeriod + params.signalPeriod) {
            return;
        }
        // Calculating the short and long EMA used when calculating the MACD
        shortEMA = external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.ema.prototype.getValues(series, {
            period: params.shortPeriod,
            index: params.index
        });
        longEMA = external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.ema.prototype.getValues(series, {
            period: params.longPeriod,
            index: params.index
        });
        shortEMA = shortEMA.values;
        longEMA = longEMA.values;
        // Subtract each Y value from the EMA's and create the new dataset
        // (MACD)
        for (i = 0; i <= shortEMA.length; i++) {
            if (defined(longEMA[i]) &&
                defined(longEMA[i][1]) &&
                defined(shortEMA[i + indexToShift]) &&
                defined(shortEMA[i + indexToShift][0])) {
                MACD.push([
                    shortEMA[i + indexToShift][0],
                    0,
                    null,
                    shortEMA[i + indexToShift][1] -
                        longEMA[i][1]
                ]);
            }
        }
        // Set the Y and X data of the MACD. This is used in calculating the
        // signal line.
        for (i = 0; i < MACD.length; i++) {
            xMACD.push(MACD[i][0]);
            yMACD.push([0, null, MACD[i][3]]);
        }
        // Setting the signalline (Signal Line: X-day EMA of MACD line).
        signalLine = external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.ema.prototype.getValues({
            xData: xMACD,
            yData: yMACD
        }, {
            period: params.signalPeriod,
            index: 2
        });
        signalLine = signalLine.values;
        // Setting the MACD Histogram. In comparison to the loop with pure
        // MACD this loop uses MACD x value not xData.
        for (i = 0; i < MACD.length; i++) {
            // Detect the first point
            if (MACD[i][0] >= signalLine[0][0]) {
                MACD[i][2] = signalLine[j][1];
                yMACD[i] = [0, signalLine[j][1], MACD[i][3]];
                if (MACD[i][3] === null) {
                    MACD[i][1] = 0;
                    yMACD[i][0] = 0;
                }
                else {
                    MACD[i][1] = correctFloat(MACD[i][3] -
                        signalLine[j][1]);
                    yMACD[i][0] = correctFloat(MACD[i][3] -
                        signalLine[j][1]);
                }
                j++;
            }
        }
        return {
            values: MACD,
            xData: xMACD,
            yData: yMACD
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Moving Average Convergence Divergence (MACD). This series requires
 * `linkedTo` option to be set and should be loaded after the
 * `stock/indicators/indicators.js`.
 *
 * @sample stock/indicators/macd
 *         MACD indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/macd
 * @optionparent plotOptions.macd
 */
MACDIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
    params: {
        /**
         * The short period for indicator calculations.
         */
        shortPeriod: 12,
        /**
         * The long period for indicator calculations.
         */
        longPeriod: 26,
        /**
         * The base period for signal calculations.
         */
        signalPeriod: 9,
        period: 26
    },
    /**
     * The styles for signal line
     */
    signalLine: {
        /**
         * @sample stock/indicators/macd-zones
         *         Zones in MACD
         *
         * @extends plotOptions.macd.zones
         */
        zones: [],
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line.
             *
             * @type  {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    /**
     * The styles for macd line
     */
    macdLine: {
        /**
         * @sample stock/indicators/macd-zones
         *         Zones in MACD
         *
         * @extends plotOptions.macd.zones
         */
        zones: [],
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line.
             *
             * @type  {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    /**
     * @type {number|null}
     */
    threshold: 0,
    groupPadding: 0.1,
    pointPadding: 0.1,
    crisp: false,
    states: {
        hover: {
            halo: {
                size: 0
            }
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' +
            'Value: {point.MACD}<br/>' +
            'Signal: {point.signal}<br/>' +
            'Histogram: {point.y}<br/>'
    },
    dataGrouping: {
        approximation: 'averages'
    },
    minPointLength: 0
});
extend(MACDIndicator.prototype, {
    nameComponents: ['longPeriod', 'shortPeriod', 'signalPeriod'],
    // "y" value is treated as Histogram data
    pointArrayMap: ['y', 'signal', 'MACD'],
    parallelArrays: ['x', 'y', 'signal', 'MACD'],
    pointValKey: 'y',
    // Columns support:
    markerAttribs: noop,
    getColumnMetrics: (external_highcharts_src_js_default_default()).seriesTypes.column.prototype.getColumnMetrics,
    crispCol: (external_highcharts_src_js_default_default()).seriesTypes.column.prototype.crispCol,
    drawPoints: (external_highcharts_src_js_default_default()).seriesTypes.column.prototype.drawPoints
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('macd', MACDIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const MACD_MACDIndicator = ((/* unused pure expression or super */ null && (MACDIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `MACD` series. If the [type](#series.macd.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.macd
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/macd
 * @apioption series.macd
 */
''; // To include the above in the js output

;// ./code/es-modules/masters/indicators/macd.src.js





/* harmony default export */ const macd_src = ((external_highcharts_src_js_default_default()));

export { macd_src as default };
