/**
 * @license Highstock JS v12.3.0 (2025-06-21)
 * @module highcharts/indicators/cmf
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * (c) 2010-2025 Highsoft AS
 * Author: Sebastian Domas
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
;// ./code/es-modules/Stock/Indicators/CMF/CMFIndicator.js
/* *
 *
 *  (c) 2010-2025 Highsoft AS
 *
 *  Author: Sebastian Domas
 *
 *  Chaikin Money Flow indicator for Highcharts Stock
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The CMF series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.cmf
 *
 * @augments Highcharts.Series
 */
class CMFIndicator extends SMAIndicator {
    constructor() {
        /* *
         *
         *  Static Properties
         *
         * */
        super(...arguments);
        this.nameBase = 'Chaikin Money Flow';
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Checks if the series and volumeSeries are accessible, number of
     * points.x is longer than period, is series has OHLC data
     * @private
     * @param {Highcharts.CMFIndicator} this indicator to use.
     * @return {boolean} True if series is valid and can be computed,
     * otherwise false.
     */
    isValid() {
        const chart = this.chart, options = this.options, series = this.linkedParent, volumeSeries = (this.volumeSeries ||
            (this.volumeSeries =
                chart.get(options.params.volumeSeriesID))), isSeriesOHLC = (series?.pointArrayMap?.length === 4);
        /**
         * @private
         * @param {Highcharts.Series} serie to check length validity on.
         * @return {boolean|undefined} true if length is valid.
         */
        function isLengthValid(serie) {
            return serie.dataTable.rowCount >=
                options.params.period;
        }
        return !!(series &&
            volumeSeries &&
            isLengthValid(series) &&
            isLengthValid(volumeSeries) && isSeriesOHLC);
    }
    /**
     * Returns indicator's data.
     * @private
     * @param {Highcharts.CMFIndicator} this indicator to use.
     * @param {Highcharts.Series} series to calculate values from
     * @param {Highcharts.CMFIndicatorParamsOptions} params to pass
     * @return {boolean|Highcharts.IndicatorNullableValuesObject} Returns false if the
     * indicator is not valid, otherwise returns Values object.
     */
    getValues(series, params) {
        if (!this.isValid()) {
            return;
        }
        return this.getMoneyFlow(series.xData, series.yData, this.volumeSeries.getColumn('y'), params.period);
    }
    /**
     * @private
     *
     * @param {Array<number>} xData
     * x timestamp values
     *
     * @param {Array<number>} seriesYData
     * yData of basic series
     *
     * @param {Array<number>} volumeSeriesYData
     * yData of volume series
     *
     * @param {number} period
     * indicator's param
     *
     * @return {Highcharts.IndicatorNullableValuesObject}
     * object containing computed money flow data
     */
    getMoneyFlow(xData, seriesYData, volumeSeriesYData, period) {
        const len = seriesYData.length, moneyFlowVolume = [], moneyFlowXData = [], moneyFlowYData = [], values = [];
        let i, point, nullIndex = -1, sumVolume = 0, sumMoneyFlowVolume = 0;
        /**
         * Calculates money flow volume, changes i, nullIndex vars from
         * upper scope!
         *
         * @private
         *
         * @param {Array<number>} ohlc
         * OHLC point
         *
         * @param {number} volume
         * Volume point's y value
         *
         * @return {number|null}
         * Volume * moneyFlowMultiplier
         */
        function getMoneyFlowVolume(ohlc, volume) {
            const high = ohlc[1], low = ohlc[2], close = ohlc[3], isValid = volume !== null &&
                high !== null &&
                low !== null &&
                close !== null &&
                high !== low;
            /**
             * @private
             * @param {number} h
             * High value
             * @param {number} l
             * Low value
             * @param {number} c
             * Close value
             * @return {number}
             * Calculated multiplier for the point
             */
            function getMoneyFlowMultiplier(h, l, c) {
                return ((c - l) - (h - c)) / (h - l);
            }
            return isValid ?
                getMoneyFlowMultiplier(high, low, close) * volume :
                ((nullIndex = i), null);
        }
        if (period > 0 && period <= len) {
            for (i = 0; i < period; i++) {
                moneyFlowVolume[i] = getMoneyFlowVolume(seriesYData[i], volumeSeriesYData[i]);
                sumVolume += volumeSeriesYData[i];
                sumMoneyFlowVolume += moneyFlowVolume[i];
            }
            moneyFlowXData.push(xData[i - 1]);
            moneyFlowYData.push(i - nullIndex >= period && sumVolume !== 0 ?
                sumMoneyFlowVolume / sumVolume :
                null);
            values.push([moneyFlowXData[0], moneyFlowYData[0]]);
            for (; i < len; i++) {
                moneyFlowVolume[i] = getMoneyFlowVolume(seriesYData[i], volumeSeriesYData[i]);
                sumVolume -= volumeSeriesYData[i - period];
                sumVolume += volumeSeriesYData[i];
                sumMoneyFlowVolume -= moneyFlowVolume[i - period];
                sumMoneyFlowVolume += moneyFlowVolume[i];
                point = [
                    xData[i],
                    i - nullIndex >= period ?
                        sumMoneyFlowVolume / sumVolume :
                        null
                ];
                moneyFlowXData.push(point[0]);
                moneyFlowYData.push(point[1]);
                values.push([point[0], point[1]]);
            }
        }
        return {
            values: values,
            xData: moneyFlowXData,
            yData: moneyFlowYData
        };
    }
}
/**
 * Chaikin Money Flow indicator (cmf).
 *
 * @sample stock/indicators/cmf/
 *         Chaikin Money Flow indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @excluding    animationLimit
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/cmf
 * @optionparent plotOptions.cmf
 */
CMFIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
    /**
     * @excluding index
     */
    params: {
        index: void 0, // Unused index, do not inherit (#15362)
        /**
         * The id of another series to use its data as volume data for the
         * indicator calculation.
         */
        volumeSeriesID: 'volume'
    }
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('cmf', CMFIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const CMF_CMFIndicator = ((/* unused pure expression or super */ null && (CMFIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `CMF` series. If the [type](#series.cmf.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.cmf
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/cmf
 * @apioption series.cmf
 */
''; // Adds doclet above to the transpiled file

;// ./code/es-modules/masters/indicators/cmf.src.js





/* harmony default export */ const cmf_src = ((external_highcharts_src_js_default_default()));

export { cmf_src as default };
