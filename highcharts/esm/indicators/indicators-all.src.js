/**
 * @license Highstock JS v12.3.0 (2025-06-21)
 * @module highcharts/indicators/indicators-all
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * All technical indicators for Highcharts Stock
 *
 * (c) 2010-2025 Pawel Fus
 *
 * License: www.highcharts.com/license
 */
import * as __WEBPACK_EXTERNAL_MODULE__highcharts_src_js_8202131d__ from "../highcharts.src.js";
import * as __WEBPACK_EXTERNAL_MODULE__modules_datagrouping_src_js_b7a4250c__ from "../modules/datagrouping.src.js";
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
;// external ["../highcharts.src.js","default","Chart"]
const external_highcharts_src_js_default_Chart_namespaceObject = __WEBPACK_EXTERNAL_MODULE__highcharts_src_js_8202131d__["default"].Chart;
var external_highcharts_src_js_default_Chart_default = /*#__PURE__*/__webpack_require__.n(external_highcharts_src_js_default_Chart_namespaceObject);
;// external ["../highcharts.src.js","default","SeriesRegistry"]
const external_highcharts_src_js_default_SeriesRegistry_namespaceObject = __WEBPACK_EXTERNAL_MODULE__highcharts_src_js_8202131d__["default"].SeriesRegistry;
var external_highcharts_src_js_default_SeriesRegistry_default = /*#__PURE__*/__webpack_require__.n(external_highcharts_src_js_default_SeriesRegistry_namespaceObject);
;// ./code/es-modules/Stock/Indicators/SMA/SMAIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */



const { line: LineSeries } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { addEvent, fireEvent, error, extend, isArray, merge, pick } = (external_highcharts_src_js_default_default());
/**
 *
 * Return the parent series values in the legacy two-dimensional yData
 * format
 * @private
 */
const tableToMultiYData = (series, processed) => {
    const yData = [], pointArrayMap = series.pointArrayMap, table = processed && series.dataTable.modified || series.dataTable;
    if (!pointArrayMap) {
        return series.getColumn('y', processed);
    }
    const columns = pointArrayMap.map((key) => series.getColumn(key, processed));
    for (let i = 0; i < table.rowCount; i++) {
        const values = pointArrayMap.map((key, colIndex) => columns[colIndex]?.[i] || 0);
        yData.push(values);
    }
    return yData;
};
/* *
 *
 *  Class
 *
 * */
/**
 * The SMA series type.
 *
 * @private
 */
class SMAIndicator extends LineSeries {
    /* *
     *
     *  Functions
     *
     * */
    /**
     * @private
     */
    destroy() {
        this.dataEventsToUnbind.forEach(function (unbinder) {
            unbinder();
        });
        super.destroy.apply(this, arguments);
    }
    /**
     * @private
     */
    getName() {
        const params = [];
        let name = this.name;
        if (!name) {
            (this.nameComponents || []).forEach(function (component, index) {
                params.push(this.options.params[component] +
                    pick(this.nameSuffixes[index], ''));
            }, this);
            name = (this.nameBase || this.type.toUpperCase()) +
                (this.nameComponents ? ' (' + params.join(', ') + ')' : '');
        }
        return name;
    }
    /**
     * @private
     */
    getValues(series, params) {
        const period = params.period, xVal = series.xData || [], yVal = series.yData, yValLen = yVal.length, SMA = [], xData = [], yData = [];
        let i, index = -1, range = 0, SMAPoint, sum = 0;
        if (xVal.length < period) {
            return;
        }
        // Switch index for OHLC / Candlestick / Arearange
        if (isArray(yVal[0])) {
            index = params.index ? params.index : 0;
        }
        // Accumulate first N-points
        while (range < period - 1) {
            sum += index < 0 ? yVal[range] : yVal[range][index];
            range++;
        }
        // Calculate value one-by-one for each period in visible data
        for (i = range; i < yValLen; i++) {
            sum += index < 0 ? yVal[i] : yVal[i][index];
            SMAPoint = [xVal[i], sum / period];
            SMA.push(SMAPoint);
            xData.push(SMAPoint[0]);
            yData.push(SMAPoint[1]);
            sum -= (index < 0 ?
                yVal[i - range] :
                yVal[i - range][index]);
        }
        return {
            values: SMA,
            xData: xData,
            yData: yData
        };
    }
    /**
     * @private
     */
    init(chart, options) {
        const indicator = this;
        super.init.call(indicator, chart, options);
        // Only after series are linked indicator can be processed.
        const linkedSeriesUnbiner = addEvent((external_highcharts_src_js_default_Chart_default()), 'afterLinkSeries', function ({ isUpdating }) {
            // #18643 indicator shouldn't recalculate
            // values while series updating.
            if (isUpdating) {
                return;
            }
            const hasEvents = !!indicator.dataEventsToUnbind.length;
            if (indicator.linkedParent) {
                if (!hasEvents) {
                    // No matter which indicator, always recalculate after
                    // updating the data.
                    indicator.dataEventsToUnbind.push(addEvent(indicator.linkedParent, 'updatedData', function () {
                        indicator.recalculateValues();
                    }));
                    // Some indicators (like VBP) requires an additional
                    // event (afterSetExtremes) to properly show the data.
                    if (indicator.calculateOn.xAxis) {
                        indicator.dataEventsToUnbind.push(addEvent(indicator.linkedParent.xAxis, indicator.calculateOn.xAxis, function () {
                            indicator.recalculateValues();
                        }));
                    }
                }
                // Most indicators are being calculated on chart's init.
                if (indicator.calculateOn.chart === 'init') {
                    // When closestPointRange is set, it is an indication
                    // that `Series.processData` has run. If it hasn't we
                    // need to `recalculateValues`.
                    if (!indicator.closestPointRange) {
                        indicator.recalculateValues();
                    }
                }
                else if (!hasEvents) {
                    // Some indicators (like VBP) has to recalculate their
                    // values after other chart's events (render).
                    const unbinder = addEvent(indicator.chart, indicator.calculateOn.chart, function () {
                        indicator.recalculateValues();
                        // Call this just once.
                        unbinder();
                    });
                }
            }
            else {
                return error('Series ' +
                    indicator.options.linkedTo +
                    ' not found! Check `linkedTo`.', false, chart);
            }
        }, {
            order: 0
        });
        // Make sure we find series which is a base for an indicator
        // chart.linkSeries();
        indicator.dataEventsToUnbind = [];
        indicator.eventsToUnbind.push(linkedSeriesUnbiner);
    }
    /**
     * @private
     */
    recalculateValues() {
        const croppedDataValues = [], indicator = this, table = this.dataTable, oldData = indicator.points || [], oldDataLength = indicator.dataTable.rowCount, emptySet = {
            values: [],
            xData: [],
            yData: []
        };
        let overwriteData = true, oldFirstPointIndex, oldLastPointIndex, min, max;
        // For the newer data table, temporarily set the parent series `yData`
        // to the legacy format that is documented for custom indicators, and
        // get the xData from the data table
        const yData = indicator.linkedParent.yData, processedYData = indicator.linkedParent.processedYData;
        indicator.linkedParent.xData = indicator.linkedParent
            .getColumn('x');
        indicator.linkedParent.yData = tableToMultiYData(indicator.linkedParent);
        indicator.linkedParent.processedYData = tableToMultiYData(indicator.linkedParent, true);
        // Updating an indicator with redraw=false may destroy data.
        // If there will be a following update for the parent series,
        // we will try to access Series object without any properties
        // (except for prototyped ones). This is what happens
        // for example when using Axis.setDataGrouping(). See #16670
        const processedData = indicator.linkedParent.options &&
            // #18176, #18177 indicators should work with empty dataset
            indicator.linkedParent.dataTable.rowCount ?
            (indicator.getValues(indicator.linkedParent, indicator.options.params) || emptySet) : emptySet;
        // Reset
        delete indicator.linkedParent.xData;
        indicator.linkedParent.yData = yData;
        indicator.linkedParent.processedYData = processedYData;
        const pointArrayMap = indicator.pointArrayMap || ['y'], valueColumns = {};
        // Split legacy twodimensional values into value columns
        processedData.yData
            .forEach((values) => {
            pointArrayMap.forEach((key, index) => {
                const column = valueColumns[key] || [];
                column.push(isArray(values) ? values[index] : values);
                if (!valueColumns[key]) {
                    valueColumns[key] = column;
                }
            });
        });
        // We need to update points to reflect changes in all,
        // x and y's, values. However, do it only for non-grouped
        // data - grouping does it for us (#8572)
        if (oldDataLength &&
            !indicator.hasGroupedData &&
            indicator.visible &&
            indicator.points) {
            // When data is cropped update only avaliable points (#9493)
            if (indicator.cropped) {
                if (indicator.xAxis) {
                    min = indicator.xAxis.min;
                    max = indicator.xAxis.max;
                }
                const croppedData = indicator.cropData(table, min, max);
                const keys = ['x', ...(indicator.pointArrayMap || ['y'])];
                for (let i = 0; i < (croppedData.modified?.rowCount || 0); i++) {
                    const values = keys.map((key) => this.getColumn(key)[i] || 0);
                    croppedDataValues.push(values);
                }
                const indicatorXData = indicator.getColumn('x');
                oldFirstPointIndex = processedData.xData.indexOf(indicatorXData[0]);
                oldLastPointIndex = processedData.xData.indexOf(indicatorXData[indicatorXData.length - 1]);
                // Check if indicator points should be shifted (#8572)
                if (oldFirstPointIndex === -1 &&
                    oldLastPointIndex === processedData.xData.length - 2) {
                    if (croppedDataValues[0][0] === oldData[0].x) {
                        croppedDataValues.shift();
                    }
                }
                indicator.updateData(croppedDataValues);
            }
            else if (indicator.updateAllPoints || // #18710
                // Omit addPoint() and removePoint() cases
                processedData.xData.length !== oldDataLength - 1 &&
                    processedData.xData.length !== oldDataLength + 1) {
                overwriteData = false;
                indicator.updateData(processedData.values);
            }
        }
        if (overwriteData) {
            table.setColumns({
                ...valueColumns,
                x: processedData.xData
            });
            indicator.options.data = processedData.values;
        }
        if (indicator.calculateOn.xAxis &&
            indicator.getColumn('x', true).length) {
            indicator.isDirty = true;
            indicator.redraw();
        }
        indicator.isDirtyData = !!indicator.linkedSeries.length;
        fireEvent(indicator, 'updatedData'); // #18689
    }
    /**
     * @private
     */
    processData() {
        const series = this, compareToMain = series.options.compareToMain, linkedParent = series.linkedParent;
        super.processData.apply(series, arguments);
        if (series.dataModify &&
            linkedParent &&
            linkedParent.dataModify &&
            linkedParent.dataModify.compareValue &&
            compareToMain) {
            series.dataModify.compareValue =
                linkedParent.dataModify.compareValue;
        }
        return;
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * The parameter allows setting line series type and use OHLC indicators.
 * Data in OHLC format is required.
 *
 * @sample {highstock} stock/indicators/use-ohlc-data
 *         Use OHLC data format to plot line chart
 *
 * @type      {boolean}
 * @product   highstock
 * @apioption plotOptions.line.useOhlcData
 */
/**
 * Simple moving average indicator (SMA). This series requires `linkedTo`
 * option to be set.
 *
 * @sample stock/indicators/sma
 *         Simple moving average indicator
 *
 * @extends      plotOptions.line
 * @since        6.0.0
 * @excluding    allAreas, colorAxis, dragDrop, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking, useOhlcData
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @optionparent plotOptions.sma
 */
SMAIndicator.defaultOptions = merge(LineSeries.defaultOptions, {
    /**
     * The name of the series as shown in the legend, tooltip etc. If not
     * set, it will be based on a technical indicator type and default
     * params.
     *
     * @type {string}
     */
    name: void 0,
    tooltip: {
        /**
         * Number of decimals in indicator series.
         */
        valueDecimals: 4
    },
    /**
     * The main series ID that indicator will be based on. Required for this
     * indicator.
     *
     * @type {string}
     */
    linkedTo: void 0,
    /**
     * Whether to compare indicator to the main series values
     * or indicator values.
     *
     * @sample {highstock} stock/plotoptions/series-comparetomain/
     *         Difference between comparing SMA values to the main series
     *         and its own values.
     *
     * @type {boolean}
     */
    compareToMain: false,
    /**
     * Parameters used in calculation of regression series' points.
     */
    params: {
        /**
         * The point index which indicator calculations will base. For
         * example using OHLC data, index=2 means the indicator will be
         * calculated using Low values.
         */
        index: 3,
        /**
         * The base period for indicator calculations. This is the number of
         * data points which are taken into account for the indicator
         * calculations.
         */
        period: 14
    }
});
extend(SMAIndicator.prototype, {
    calculateOn: {
        chart: 'init'
    },
    hasDerivedData: true,
    nameComponents: ['period'],
    nameSuffixes: [], // E.g. Zig Zag uses extra '%'' in the legend name
    useCommonDataGrouping: true
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('sma', SMAIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const SMA_SMAIndicator = ((/* unused pure expression or super */ null && (SMAIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `SMA` series. If the [type](#series.sma.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.sma
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL, useOhlcData
 * @requires  stock/indicators/indicators
 * @apioption series.sma
 */
(''); // Adds doclet above to the transpiled file

;// ./code/es-modules/Stock/Indicators/EMA/EMAIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: EMAIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { correctFloat, isArray: EMAIndicator_isArray, merge: EMAIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The EMA series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ema
 *
 * @augments Highcharts.Series
 */
class EMAIndicator extends EMAIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    accumulatePeriodPoints(period, index, yVal) {
        let sum = 0, i = 0, y = 0;
        while (i < period) {
            y = index < 0 ? yVal[i] : yVal[i][index];
            sum = sum + y;
            i++;
        }
        return sum;
    }
    calculateEma(xVal, yVal, i, EMApercent, calEMA, index, SMA) {
        const x = xVal[i - 1], yValue = index < 0 ?
            yVal[i - 1] :
            yVal[i - 1][index], y = typeof calEMA === 'undefined' ?
            SMA : correctFloat((yValue * EMApercent) +
            (calEMA * (1 - EMApercent)));
        return [x, y];
    }
    getValues(series, params) {
        const period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, EMApercent = 2 / (period + 1), EMA = [], xData = [], yData = [];
        let calEMA, EMAPoint, i, index = -1, sum = 0, SMA = 0;
        // Check period, if bigger than points length, skip
        if (yValLen < period) {
            return;
        }
        // Switch index for OHLC / Candlestick / Arearange
        if (EMAIndicator_isArray(yVal[0])) {
            index = params.index ? params.index : 0;
        }
        // Accumulate first N-points
        sum = this.accumulatePeriodPoints(period, index, yVal);
        // First point
        SMA = sum / period;
        // Calculate value one-by-one for each period in visible data
        for (i = period; i < yValLen + 1; i++) {
            EMAPoint = this.calculateEma(xVal, yVal, i, EMApercent, calEMA, index, SMA);
            EMA.push(EMAPoint);
            xData.push(EMAPoint[0]);
            yData.push(EMAPoint[1]);
            calEMA = EMAPoint[1];
        }
        return {
            values: EMA,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Exponential moving average indicator (EMA). This series requires the
 * `linkedTo` option to be set.
 *
 * @sample stock/indicators/ema
 * Exponential moving average indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @optionparent plotOptions.ema
 */
EMAIndicator.defaultOptions = EMAIndicator_merge(EMAIndicator_SMAIndicator.defaultOptions, {
    params: {
        /**
         * The point index which indicator calculations will base. For
         * example using OHLC data, index=2 means the indicator will be
         * calculated using Low values.
         *
         * By default index value used to be set to 0. Since
         * Highcharts Stock 7 by default index is set to 3
         * which means that the ema indicator will be
         * calculated using Close values.
         */
        index: 3,
        period: 9 // @merge 14 in v6.2
    }
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('ema', EMAIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const EMA_EMAIndicator = ((/* unused pure expression or super */ null && (EMAIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `EMA` series. If the [type](#series.ema.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ema
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @apioption series.ema
 */
''; // Adds doclet above to the transpiled file

;// ./code/es-modules/Stock/Indicators/AD/ADIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 * */


const { sma: ADIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { error: ADIndicator_error, extend: ADIndicator_extend, merge: ADIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The AD series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ad
 *
 * @augments Highcharts.Series
 */
class ADIndicator extends ADIndicator_SMAIndicator {
    /* *
     *
     *  Static Functions
     *
     * */
    static populateAverage(xVal, yVal, yValVolume, i, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _period) {
        const high = yVal[i][1], low = yVal[i][2], close = yVal[i][3], volume = yValVolume[i], adY = close === high && close === low || high === low ?
            0 :
            ((2 * close - low - high) / (high - low)) * volume, adX = xVal[i];
        return [adX, adY];
    }
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const period = params.period, xVal = series.xData, yVal = series.yData, volumeSeriesID = params.volumeSeriesID, volumeSeries = series.chart.get(volumeSeriesID), yValVolume = volumeSeries?.getColumn('y'), yValLen = yVal ? yVal.length : 0, AD = [], xData = [], yData = [];
        let len, i, ADPoint;
        if (xVal.length <= period &&
            yValLen &&
            yVal[0].length !== 4) {
            return;
        }
        if (!volumeSeries) {
            ADIndicator_error('Series ' +
                volumeSeriesID +
                ' not found! Check `volumeSeriesID`.', true, series.chart);
            return;
        }
        // When i = period <-- skip first N-points
        // Calculate value one-by-one for each period in visible data
        for (i = period; i < yValLen; i++) {
            len = AD.length;
            ADPoint = ADIndicator.populateAverage(xVal, yVal, yValVolume, i, period);
            if (len > 0) {
                ADPoint[1] += AD[len - 1][1];
            }
            AD.push(ADPoint);
            xData.push(ADPoint[0]);
            yData.push(ADPoint[1]);
        }
        return {
            values: AD,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Accumulation Distribution (AD). This series requires `linkedTo` option to
 * be set.
 *
 * @sample stock/indicators/accumulation-distribution
 *         Accumulation/Distribution indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/accumulation-distribution
 * @optionparent plotOptions.ad
 */
ADIndicator.defaultOptions = ADIndicator_merge(ADIndicator_SMAIndicator.defaultOptions, {
    /**
     * @excluding index
     */
    params: {
        index: void 0, // Unused index, do not inherit (#15362)
        /**
         * The id of volume series which is mandatory.
         * For example using OHLC data, volumeSeriesID='volume' means
         * the indicator will be calculated using OHLC and volume values.
         *
         * @since 6.0.0
         */
        volumeSeriesID: 'volume'
    }
});
ADIndicator_extend(ADIndicator.prototype, {
    nameComponents: false,
    nameBase: 'Accumulation/Distribution'
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('ad', ADIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const AD_ADIndicator = (ADIndicator);
/* *
 *
 *  API Options
 *
 * */
/**
 * A `AD` series. If the [type](#series.ad.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ad
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/accumulation-distribution
 * @apioption series.ad
 */
''; // Add doclet above to transpiled file

;// ./code/es-modules/Stock/Indicators/AO/AOIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { noop } = (external_highcharts_src_js_default_default());

const { column: { prototype: columnProto }, sma: AOIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: AOIndicator_extend, merge: AOIndicator_merge, correctFloat: AOIndicator_correctFloat, isArray: AOIndicator_isArray } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The AO series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ao
 *
 * @augments Highcharts.Series
 */
class AOIndicator extends AOIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    drawGraph() {
        const indicator = this, options = indicator.options, points = indicator.points, userColor = indicator.userOptions.color, positiveColor = options.greaterBarColor, negativeColor = options.lowerBarColor, firstPoint = points[0];
        let i;
        if (!userColor && firstPoint) {
            firstPoint.color = positiveColor;
            for (i = 1; i < points.length; i++) {
                if (points[i].y > points[i - 1].y) {
                    points[i].color = positiveColor;
                }
                else if (points[i].y < points[i - 1].y) {
                    points[i].color = negativeColor;
                }
                else {
                    points[i].color = points[i - 1].color;
                }
            }
        }
    }
    getValues(series) {
        const shortPeriod = 5, longPeriod = 34, xVal = series.xData || [], yVal = series.yData || [], yValLen = yVal.length, AO = [], // 0- date, 1- Awesome Oscillator
        xData = [], yData = [], high = 1, low = 2;
        let shortSMA, // Shorter Period SMA
        longSMA, // Longer Period SMA
        awesome, shortLastIndex, longLastIndex, price, i, j, longSum = 0, shortSum = 0;
        if (xVal.length <= longPeriod ||
            !AOIndicator_isArray(yVal[0]) ||
            yVal[0].length !== 4) {
            return;
        }
        for (i = 0; i < longPeriod - 1; i++) {
            price = (yVal[i][high] + yVal[i][low]) / 2;
            if (i >= longPeriod - shortPeriod) {
                shortSum = AOIndicator_correctFloat(shortSum + price);
            }
            longSum = AOIndicator_correctFloat(longSum + price);
        }
        for (j = longPeriod - 1; j < yValLen; j++) {
            price = (yVal[j][high] + yVal[j][low]) / 2;
            shortSum = AOIndicator_correctFloat(shortSum + price);
            longSum = AOIndicator_correctFloat(longSum + price);
            shortSMA = shortSum / shortPeriod;
            longSMA = longSum / longPeriod;
            awesome = AOIndicator_correctFloat(shortSMA - longSMA);
            AO.push([xVal[j], awesome]);
            xData.push(xVal[j]);
            yData.push(awesome);
            shortLastIndex = j + 1 - shortPeriod;
            longLastIndex = j + 1 - longPeriod;
            shortSum = AOIndicator_correctFloat(shortSum -
                (yVal[shortLastIndex][high] +
                    yVal[shortLastIndex][low]) / 2);
            longSum = AOIndicator_correctFloat(longSum -
                (yVal[longLastIndex][high] +
                    yVal[longLastIndex][low]) / 2);
        }
        return {
            values: AO,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Awesome Oscillator. This series requires the `linkedTo` option to
 * be set and should be loaded after the `stock/indicators/indicators.js`
 *
 * @sample {highstock} stock/indicators/ao
 *         Awesome
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               params, pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/ao
 * @optionparent plotOptions.ao
 */
AOIndicator.defaultOptions = AOIndicator_merge(AOIndicator_SMAIndicator.defaultOptions, {
    params: {
        // Index and period are unchangeable, do not inherit (#15362)
        index: void 0,
        period: void 0
    },
    /**
     * Color of the Awesome oscillator series bar that is greater than the
     * previous one. Note that if a `color` is defined, the `color`
     * takes precedence and the `greaterBarColor` is ignored.
     *
     * @sample {highstock} stock/indicators/ao/
     *         greaterBarColor
     *
     * @type  {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since 7.0.0
     */
    greaterBarColor: "#06b535" /* Palette.positiveColor */,
    /**
     * Color of the Awesome oscillator series bar that is lower than the
     * previous one. Note that if a `color` is defined, the `color`
     * takes precedence and the `lowerBarColor` is ignored.
     *
     * @sample {highstock} stock/indicators/ao/
     *         lowerBarColor
     *
     * @type  {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since 7.0.0
     */
    lowerBarColor: "#f21313" /* Palette.negativeColor */,
    threshold: 0,
    groupPadding: 0.2,
    pointPadding: 0.2,
    crisp: false,
    states: {
        hover: {
            halo: {
                size: 0
            }
        }
    }
});
AOIndicator_extend(AOIndicator.prototype, {
    nameBase: 'AO',
    nameComponents: void 0,
    // Columns support:
    markerAttribs: noop,
    getColumnMetrics: columnProto.getColumnMetrics,
    crispCol: columnProto.crispCol,
    translate: columnProto.translate,
    drawPoints: columnProto.drawPoints
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('ao', AOIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const AO_AOIndicator = ((/* unused pure expression or super */ null && (AOIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * An `AO` series. If the [type](#series.ao.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ao
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/ao
 * @apioption series.ao
 */
''; // For including the above in the doclets

;// ./code/es-modules/Stock/Indicators/MultipleLinesComposition.js
/**
 *
 *  (c) 2010-2025 Wojciech Chmiel
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: { prototype: smaProto } } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { defined, error: MultipleLinesComposition_error, merge: MultipleLinesComposition_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Composition
 *
 * */
var MultipleLinesComposition;
(function (MultipleLinesComposition) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Constants
     *
     * */
    /**
     * Additional lines DOCS names. Elements of linesApiNames array should
     * be consistent with DOCS line names defined in your implementation.
     * Notice that linesApiNames should have decreased amount of elements
     * relative to pointArrayMap (without pointValKey).
     *
     * @private
     * @type {Array<string>}
     */
    const linesApiNames = ['bottomLine'];
    /**
     * Lines ids. Required to plot appropriate amount of lines.
     * Notice that pointArrayMap should have more elements than
     * linesApiNames, because it contains main line and additional lines ids.
     * Also it should be consistent with amount of lines calculated in
     * getValues method from your implementation.
     *
     * @private
     * @type {Array<string>}
     */
    const pointArrayMap = ['top', 'bottom'];
    /**
     * Names of the lines, between which the area should be plotted.
     * If the drawing of the area should
     * be disabled for some indicators, leave this option as an empty array.
     * Names should be the same as the names in the pointArrayMap.
     *
     * @private
     * @type {Array<string>}
     */
    const areaLinesNames = ['top'];
    /**
     * Main line id.
     *
     * @private
     * @type {string}
     */
    const pointValKey = 'top';
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Composition useful for all indicators that have more than one line.
     * Compose it with your implementation where you will provide the
     * `getValues` method appropriate to your indicator and `pointArrayMap`,
     * `pointValKey`, `linesApiNames` properties. Notice that `pointArrayMap`
     * should be consistent with the amount of lines calculated in the
     * `getValues` method.
     *
     * @private
     */
    function compose(IndicatorClass) {
        const proto = IndicatorClass.prototype;
        proto.linesApiNames = (proto.linesApiNames ||
            linesApiNames.slice());
        proto.pointArrayMap = (proto.pointArrayMap ||
            pointArrayMap.slice());
        proto.pointValKey = (proto.pointValKey ||
            pointValKey);
        proto.areaLinesNames = (proto.areaLinesNames ||
            areaLinesNames.slice());
        proto.drawGraph = indicatorDrawGraph;
        proto.getGraphPath = indicatorGetGraphPath;
        proto.toYData = indicatorToYData;
        proto.translate = indicatorTranslate;
        return IndicatorClass;
    }
    MultipleLinesComposition.compose = compose;
    /**
     * Generate the API name of the line
     *
     * @private
     * @param propertyName name of the line
     */
    function getLineName(propertyName) {
        return ('plot' +
            propertyName.charAt(0).toUpperCase() +
            propertyName.slice(1));
    }
    /**
     * Create translatedLines Collection based on pointArrayMap.
     *
     * @private
     * @param {string} [excludedValue]
     *        Main line id
     * @return {Array<string>}
     *         Returns translated lines names without excluded value.
     */
    function getTranslatedLinesNames(indicator, excludedValue) {
        const translatedLines = [];
        (indicator.pointArrayMap || []).forEach((propertyName) => {
            if (propertyName !== excludedValue) {
                translatedLines.push(getLineName(propertyName));
            }
        });
        return translatedLines;
    }
    /**
     * Draw main and additional lines.
     *
     * @private
     */
    function indicatorDrawGraph() {
        const indicator = this, pointValKey = indicator.pointValKey, linesApiNames = indicator.linesApiNames, areaLinesNames = indicator.areaLinesNames, mainLinePoints = indicator.points, mainLineOptions = indicator.options, mainLinePath = indicator.graph, gappedExtend = {
            options: {
                gapSize: mainLineOptions.gapSize
            }
        }, 
        // Additional lines point place holders:
        secondaryLines = [], secondaryLinesNames = getTranslatedLinesNames(indicator, pointValKey);
        let pointsLength = mainLinePoints.length, point;
        // Generate points for additional lines:
        secondaryLinesNames.forEach((plotLine, index) => {
            // Create additional lines point place holders
            secondaryLines[index] = [];
            while (pointsLength--) {
                point = mainLinePoints[pointsLength];
                secondaryLines[index].push({
                    x: point.x,
                    plotX: point.plotX,
                    plotY: point[plotLine],
                    isNull: !defined(point[plotLine])
                });
            }
            pointsLength = mainLinePoints.length;
        });
        // Modify options and generate area fill:
        if (indicator.userOptions.fillColor && areaLinesNames.length) {
            const index = secondaryLinesNames.indexOf(getLineName(areaLinesNames[0])), secondLinePoints = secondaryLines[index], firstLinePoints = areaLinesNames.length === 1 ?
                mainLinePoints :
                secondaryLines[secondaryLinesNames.indexOf(getLineName(areaLinesNames[1]))], originalColor = indicator.color;
            indicator.points = firstLinePoints;
            indicator.nextPoints = secondLinePoints;
            indicator.color = indicator.userOptions.fillColor;
            indicator.options = MultipleLinesComposition_merge(mainLinePoints, gappedExtend);
            indicator.graph = indicator.area;
            indicator.fillGraph = true;
            smaProto.drawGraph.call(indicator);
            indicator.area = indicator.graph;
            // Clean temporary properties:
            delete indicator.nextPoints;
            delete indicator.fillGraph;
            indicator.color = originalColor;
        }
        // Modify options and generate additional lines:
        linesApiNames.forEach((lineName, i) => {
            if (secondaryLines[i]) {
                indicator.points = secondaryLines[i];
                if (mainLineOptions[lineName]) {
                    indicator.options = MultipleLinesComposition_merge(mainLineOptions[lineName].styles, gappedExtend);
                }
                else {
                    MultipleLinesComposition_error('Error: "There is no ' + lineName +
                        ' in DOCS options declared. Check if linesApiNames' +
                        ' are consistent with your DOCS line names."');
                }
                indicator.graph = indicator['graph' + lineName];
                smaProto.drawGraph.call(indicator);
                // Now save lines:
                indicator['graph' + lineName] = indicator.graph;
            }
            else {
                MultipleLinesComposition_error('Error: "' + lineName + ' doesn\'t have equivalent ' +
                    'in pointArrayMap. To many elements in linesApiNames ' +
                    'relative to pointArrayMap."');
            }
        });
        // Restore options and draw a main line:
        indicator.points = mainLinePoints;
        indicator.options = mainLineOptions;
        indicator.graph = mainLinePath;
        smaProto.drawGraph.call(indicator);
    }
    /**
     * Create the path based on points provided as argument.
     * If indicator.nextPoints option is defined, create the areaFill.
     *
     * @private
     * @param points Points on which the path should be created
     */
    function indicatorGetGraphPath(points) {
        let areaPath, path = [], higherAreaPath = [];
        points = points || this.points;
        // Render Span
        if (this.fillGraph && this.nextPoints) {
            areaPath = smaProto.getGraphPath.call(this, this.nextPoints);
            if (areaPath && areaPath.length) {
                areaPath[0][0] = 'L';
                path = smaProto.getGraphPath.call(this, points);
                higherAreaPath = areaPath.slice(0, path.length);
                // Reverse points, so that the areaFill will start from the end:
                for (let i = higherAreaPath.length - 1; i >= 0; i--) {
                    path.push(higherAreaPath[i]);
                }
            }
        }
        else {
            path = smaProto.getGraphPath.apply(this, arguments);
        }
        return path;
    }
    /**
     * @private
     * @param {Highcharts.Point} point
     *        Indicator point
     * @return {Array<number>}
     *         Returns point Y value for all lines
     */
    function indicatorToYData(point) {
        const pointColl = [];
        (this.pointArrayMap || []).forEach((propertyName) => {
            pointColl.push(point[propertyName]);
        });
        return pointColl;
    }
    /**
     * Add lines plot pixel values.
     *
     * @private
     */
    function indicatorTranslate() {
        const pointArrayMap = this.pointArrayMap;
        let LinesNames = [], value;
        LinesNames = getTranslatedLinesNames(this);
        smaProto.translate.apply(this, arguments);
        this.points.forEach((point) => {
            pointArrayMap.forEach((propertyName, i) => {
                value = point[propertyName];
                // If the modifier, like for example compare exists,
                // modified the original value by that method, #15867.
                if (this.dataModify) {
                    value = this.dataModify.modifyValue(value);
                }
                if (value !== null) {
                    point[LinesNames[i]] = this.yAxis.toPixels(value, true);
                }
            });
        });
    }
})(MultipleLinesComposition || (MultipleLinesComposition = {}));
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const Indicators_MultipleLinesComposition = (MultipleLinesComposition);

;// ./code/es-modules/Stock/Indicators/Aroon/AroonIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */



const { sma: AroonIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: AroonIndicator_extend, merge: AroonIndicator_merge, pick: AroonIndicator_pick } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Functions
 *
 * */
// Utils
// Index of element with extreme value from array (min or max)
/**
 * @private
 */
function getExtremeIndexInArray(arr, extreme) {
    let extremeValue = arr[0], valueIndex = 0, i;
    for (i = 1; i < arr.length; i++) {
        if (extreme === 'max' && arr[i] >= extremeValue ||
            extreme === 'min' && arr[i] <= extremeValue) {
            extremeValue = arr[i];
            valueIndex = i;
        }
    }
    return valueIndex;
}
/* *
 *
 *  Class
 *
 * */
/**
 * The Aroon series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.aroon
 *
 * @augments Highcharts.Series
 */
class AroonIndicator extends AroonIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, 
        // 0- date, 1- Aroon Up, 2- Aroon Down
        AR = [], xData = [], yData = [], low = 2, high = 1;
        let aroonUp, aroonDown, xLow, xHigh, i, slicedY;
        // For a N-period, we start from N-1 point, to calculate Nth point
        // That is why we later need to comprehend slice() elements list
        // with (+1)
        for (i = period - 1; i < yValLen; i++) {
            slicedY = yVal.slice(i - period + 1, i + 2);
            xLow = getExtremeIndexInArray(slicedY.map(function (elem) {
                return AroonIndicator_pick(elem[low], elem);
            }), 'min');
            xHigh = getExtremeIndexInArray(slicedY.map(function (elem) {
                return AroonIndicator_pick(elem[high], elem);
            }), 'max');
            aroonUp = (xHigh / period) * 100;
            aroonDown = (xLow / period) * 100;
            if (xVal[i + 1]) {
                AR.push([xVal[i + 1], aroonUp, aroonDown]);
                xData.push(xVal[i + 1]);
                yData.push([aroonUp, aroonDown]);
            }
        }
        return {
            values: AR,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Aroon. This series requires the `linkedTo` option to be
 * set and should be loaded after the `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/aroon
 *         Aroon
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/aroon
 * @optionparent plotOptions.aroon
 */
AroonIndicator.defaultOptions = AroonIndicator_merge(AroonIndicator_SMAIndicator.defaultOptions, {
    /**
     * Parameters used in calculation of aroon series points.
     *
     * @excluding index
     */
    params: {
        index: void 0, // Unchangeable index, do not inherit (#15362)
        period: 25
    },
    marker: {
        enabled: false
    },
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Aroon Up: {point.y}<br/>Aroon Down: {point.aroonDown}<br/>'
    },
    /**
     * AroonDown line options.
     */
    aroonDown: {
        /**
         * Styles for an aroonDown line.
         */
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line. If not set, it's inherited from
             * [plotOptions.aroon.color](#plotOptions.aroon.color).
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    dataGrouping: {
        approximation: 'averages'
    }
});
AroonIndicator_extend(AroonIndicator.prototype, {
    areaLinesNames: [],
    linesApiNames: ['aroonDown'],
    nameBase: 'Aroon',
    pointArrayMap: ['y', 'aroonDown'],
    pointValKey: 'y'
});
Indicators_MultipleLinesComposition.compose(AroonIndicator);
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('aroon', AroonIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const Aroon_AroonIndicator = ((/* unused pure expression or super */ null && (AroonIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A Aroon indicator. If the [type](#series.aroon.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.aroon
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/aroon
 * @apioption series.aroon
 */
''; // To avoid removal of the above jsdoc

;// ./code/es-modules/Stock/Indicators/AroonOscillator/AroonOscillatorIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */



const { aroon: AroonOscillatorIndicator_AroonIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: AroonOscillatorIndicator_extend, merge: AroonOscillatorIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Aroon Oscillator series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.aroonoscillator
 *
 * @augments Highcharts.Series
 */
class AroonOscillatorIndicator extends AroonOscillatorIndicator_AroonIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        // 0- date, 1- Aroon Oscillator
        const ARO = [], xData = [], yData = [];
        let aroonUp, aroonDown, oscillator, i;
        const aroon = super.getValues.call(this, series, params);
        for (i = 0; i < aroon.yData.length; i++) {
            aroonUp = aroon.yData[i][0];
            aroonDown = aroon.yData[i][1];
            oscillator = aroonUp - aroonDown;
            ARO.push([aroon.xData[i], oscillator]);
            xData.push(aroon.xData[i]);
            yData.push(oscillator);
        }
        return {
            values: ARO,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Aroon Oscillator. This series requires the `linkedTo` option to be set
 * and should be loaded after the `stock/indicators/indicators.js` and
 * `stock/indicators/aroon.js`.
 *
 * @sample {highstock} stock/indicators/aroon-oscillator
 *         Aroon Oscillator
 *
 * @extends      plotOptions.aroon
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, aroonDown, colorAxis, compare, compareBase,
 *               joinBy, keys, navigatorOptions, pointInterval,
 *               pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *               showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/aroon
 * @requires     stock/indicators/aroon-oscillator
 * @optionparent plotOptions.aroonoscillator
 */
AroonOscillatorIndicator.defaultOptions = AroonOscillatorIndicator_merge(AroonOscillatorIndicator_AroonIndicator.defaultOptions, {
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b>: {point.y}'
    }
});
AroonOscillatorIndicator_extend(AroonOscillatorIndicator.prototype, {
    nameBase: 'Aroon Oscillator',
    linesApiNames: [],
    pointArrayMap: ['y'],
    pointValKey: 'y'
});
Indicators_MultipleLinesComposition.compose(AroonOscillatorIndicator_AroonIndicator);
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('aroonoscillator', AroonOscillatorIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const AroonOscillator_AroonOscillatorIndicator = ((/* unused pure expression or super */ null && (AroonOscillatorIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * An `Aroon Oscillator` series. If the [type](#series.aroonoscillator.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.aroonoscillator
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, aroonDown, colorAxis, compare, compareBase, dataParser,
 *            dataURL, joinBy, keys, navigatorOptions, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *            showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/aroon
 * @requires  stock/indicators/aroon-oscillator
 * @apioption series.aroonoscillator
 */
''; // Adds doclet above to the transpiled file

;// ./code/es-modules/Stock/Indicators/ATR/ATRIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: ATRIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { isArray: ATRIndicator_isArray, merge: ATRIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Functions
 *
 * */
// Utils:
/**
 * @private
 */
function accumulateAverage(points, xVal, yVal, i) {
    const xValue = xVal[i], yValue = yVal[i];
    points.push([xValue, yValue]);
}
/**
 * @private
 */
function getTR(currentPoint, prevPoint) {
    const pointY = currentPoint, prevY = prevPoint, HL = pointY[1] - pointY[2], HCp = typeof prevY === 'undefined' ? 0 : Math.abs(pointY[1] - prevY[3]), LCp = typeof prevY === 'undefined' ? 0 : Math.abs(pointY[2] - prevY[3]), TR = Math.max(HL, HCp, LCp);
    return TR;
}
/**
 * @private
 */
function populateAverage(points, xVal, yVal, i, period, prevATR) {
    const x = xVal[i - 1], TR = getTR(yVal[i - 1], yVal[i - 2]), y = (((prevATR * (period - 1)) + TR) / period);
    return [x, y];
}
/* *
 *
 *  Class
 *
 * */
/**
 * The ATR series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.atr
 *
 * @augments Highcharts.Series
 */
class ATRIndicator extends ATRIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, xValue = xVal[0], yValue = yVal[0], points = [[xValue, yValue]], ATR = [], xData = [], yData = [];
        let point, i, prevATR = 0, range = 1, TR = 0;
        if ((xVal.length <= period) ||
            !ATRIndicator_isArray(yVal[0]) ||
            yVal[0].length !== 4) {
            return;
        }
        for (i = 1; i <= yValLen; i++) {
            accumulateAverage(points, xVal, yVal, i);
            if (period < range) {
                point = populateAverage(points, xVal, yVal, i, period, prevATR);
                prevATR = point[1];
                ATR.push(point);
                xData.push(point[0]);
                yData.push(point[1]);
            }
            else if (period === range) {
                prevATR = TR / (i - 1);
                ATR.push([xVal[i - 1], prevATR]);
                xData.push(xVal[i - 1]);
                yData.push(prevATR);
                range++;
            }
            else {
                TR += getTR(yVal[i - 1], yVal[i - 2]);
                range++;
            }
        }
        return {
            values: ATR,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Average true range indicator (ATR). This series requires `linkedTo`
 * option to be set.
 *
 * @sample stock/indicators/atr
 *         ATR indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/atr
 * @optionparent plotOptions.atr
 */
ATRIndicator.defaultOptions = ATRIndicator_merge(ATRIndicator_SMAIndicator.defaultOptions, {
    /**
     * @excluding index
     */
    params: {
        index: void 0 // Unused index, do not inherit (#15362)
    }
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('atr', ATRIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const ATR_ATRIndicator = ((/* unused pure expression or super */ null && (ATRIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `ATR` series. If the [type](#series.atr.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.atr
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/atr
 * @apioption series.atr
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/BB/BBIndicator.js
/**
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */



const { sma: BBIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: BBIndicator_extend, isArray: BBIndicator_isArray, merge: BBIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Functions
 *
 * */
// Utils:
/**
 * @private
 */
function getStandardDeviation(arr, index, isOHLC, mean) {
    const arrLen = arr.length;
    let i = 0, std = 0, value, variance = 0;
    for (; i < arrLen; i++) {
        value = (isOHLC ? arr[i][index] : arr[i]) - mean;
        variance += value * value;
    }
    variance = variance / (arrLen - 1);
    std = Math.sqrt(variance);
    return std;
}
/* *
 *
 *  Class
 *
 * */
/**
 * Bollinger Bands series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.bb
 *
 * @augments Highcharts.Series
 */
class BBIndicator extends BBIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    init() {
        external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.sma.prototype.init.apply(this, arguments);
        // Set default color for lines:
        this.options = BBIndicator_merge({
            topLine: {
                styles: {
                    lineColor: this.color
                }
            },
            bottomLine: {
                styles: {
                    lineColor: this.color
                }
            }
        }, this.options);
    }
    getValues(series, params) {
        const period = params.period, standardDeviation = params.standardDeviation, xData = [], yData = [], xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, 
        // 0- date, 1-middle line, 2-top line, 3-bottom line
        BB = [];
        // Middle line, top line and bottom line
        let ML, TL, BL, date, slicedX, slicedY, stdDev, point, i;
        if (xVal.length < period) {
            return;
        }
        const isOHLC = BBIndicator_isArray(yVal[0]);
        for (i = period; i <= yValLen; i++) {
            slicedX = xVal.slice(i - period, i);
            slicedY = yVal.slice(i - period, i);
            point = external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.sma.prototype.getValues.call(this, {
                xData: slicedX,
                yData: slicedY
            }, params);
            date = point.xData[0];
            ML = point.yData[0];
            stdDev = getStandardDeviation(slicedY, params.index, isOHLC, ML);
            TL = ML + standardDeviation * stdDev;
            BL = ML - standardDeviation * stdDev;
            BB.push([date, TL, ML, BL]);
            xData.push(date);
            yData.push([TL, ML, BL]);
        }
        return {
            values: BB,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Bollinger bands (BB). This series requires the `linkedTo` option to be
 * set and should be loaded after the `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/bollinger-bands
 *         Bollinger bands
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/bollinger-bands
 * @optionparent plotOptions.bb
 */
BBIndicator.defaultOptions = BBIndicator_merge(BBIndicator_SMAIndicator.defaultOptions, {
    /**
     * Option for fill color between lines in Bollinger Bands Indicator.
     *
     * @sample {highstock} stock/indicators/indicator-area-fill
     *      Background fill between lines.
     *
     * @type      {Highcharts.ColorType}
     * @since     9.3.2
     * @apioption plotOptions.bb.fillColor
     */
    /**
     * Parameters used in calculation of the regression points.
     */
    params: {
        period: 20,
        /**
         * Standard deviation for top and bottom bands.
         */
        standardDeviation: 2,
        index: 3
    },
    /**
     * Bottom line options.
     */
    bottomLine: {
        /**
         * Styles for the bottom line.
         */
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line. If not set, it's inherited from
             * [plotOptions.bb.color](#plotOptions.bb.color).
             *
             * @type  {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    /**
     * Top line options.
     *
     * @extends plotOptions.bb.bottomLine
     */
    topLine: {
        /**
         * Styles for the top line.
         */
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line. If not set, it's inherited from
             * [plotOptions.bb.color](#plotOptions.bb.color).
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Top: {point.top}<br/>Middle: {point.middle}<br/>Bottom: {point.bottom}<br/>'
    },
    marker: {
        enabled: false
    },
    dataGrouping: {
        approximation: 'averages'
    }
});
BBIndicator_extend(BBIndicator.prototype, {
    areaLinesNames: ['top', 'bottom'],
    linesApiNames: ['topLine', 'bottomLine'],
    nameComponents: ['period', 'standardDeviation'],
    pointArrayMap: ['top', 'middle', 'bottom'],
    pointValKey: 'middle'
});
Indicators_MultipleLinesComposition.compose(BBIndicator);
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('bb', BBIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const BB_BBIndicator = ((/* unused pure expression or super */ null && (BBIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A bollinger bands indicator. If the [type](#series.bb.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.bb
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/bollinger-bands
 * @apioption series.bb
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/CCI/CCIIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 * */


const { sma: CCIIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { isArray: CCIIndicator_isArray, merge: CCIIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Functions
 *
 * */
// Utils:
/**
 * @private
 */
function sumArray(array) {
    return array.reduce(function (prev, cur) {
        return prev + cur;
    }, 0);
}
/**
 * @private
 */
function meanDeviation(arr, sma) {
    const len = arr.length;
    let sum = 0, i;
    for (i = 0; i < len; i++) {
        sum += Math.abs(sma - (arr[i]));
    }
    return sum;
}
/* *
 *
 *  Class
 *
 * */
/**
 * The CCI series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.cci
 *
 * @augments Highcharts.Series
 */
class CCIIndicator extends CCIIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, TP = [], CCI = [], xData = [], yData = [];
        let CCIPoint, p, periodTP = [], len, range = 1, smaTP, TPtemp, meanDev, i;
        // CCI requires close value
        if (xVal.length <= period ||
            !CCIIndicator_isArray(yVal[0]) ||
            yVal[0].length !== 4) {
            return;
        }
        // Accumulate first N-points
        while (range < period) {
            p = yVal[range - 1];
            TP.push((p[1] + p[2] + p[3]) / 3);
            range++;
        }
        for (i = period; i <= yValLen; i++) {
            p = yVal[i - 1];
            TPtemp = (p[1] + p[2] + p[3]) / 3;
            len = TP.push(TPtemp);
            periodTP = TP.slice(len - period);
            smaTP = sumArray(periodTP) / period;
            meanDev = meanDeviation(periodTP, smaTP) / period;
            CCIPoint = ((TPtemp - smaTP) / (0.015 * meanDev));
            CCI.push([xVal[i - 1], CCIPoint]);
            xData.push(xVal[i - 1]);
            yData.push(CCIPoint);
        }
        return {
            values: CCI,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Commodity Channel Index (CCI). This series requires `linkedTo` option to
 * be set.
 *
 * @sample stock/indicators/cci
 *         CCI indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/cci
 * @optionparent plotOptions.cci
 */
CCIIndicator.defaultOptions = CCIIndicator_merge(CCIIndicator_SMAIndicator.defaultOptions, {
    /**
     * @excluding index
     */
    params: {
        index: void 0 // Unused index, do not inherit (#15362)
    }
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('cci', CCIIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const CCI_CCIIndicator = ((/* unused pure expression or super */ null && (CCIIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `CCI` series. If the [type](#series.cci.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.cci
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/cci
 * @apioption series.cci
 */
''; // To include the above in the js output

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


const { sma: CMFIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { merge: CMFIndicator_merge } = (external_highcharts_src_js_default_default());
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
class CMFIndicator extends CMFIndicator_SMAIndicator {
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
CMFIndicator.defaultOptions = CMFIndicator_merge(CMFIndicator_SMAIndicator.defaultOptions, {
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

;// ./code/es-modules/Stock/Indicators/DMI/DMIIndicator.js
/* *
 *  (c) 2010-2025 Rafal Sebestjanski
 *
 *  Directional Movement Index (DMI) indicator for Highcharts Stock
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */



const { sma: DMIIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { correctFloat: DMIIndicator_correctFloat, extend: DMIIndicator_extend, isArray: DMIIndicator_isArray, merge: DMIIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Directional Movement Index (DMI) series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.dmi
 *
 * @augments Highcharts.Series
 */
class DMIIndicator extends DMIIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    calculateDM(yVal, i, isPositiveDM) {
        const currentHigh = yVal[i][1], currentLow = yVal[i][2], previousHigh = yVal[i - 1][1], previousLow = yVal[i - 1][2];
        let DM;
        if (currentHigh - previousHigh > previousLow - currentLow) {
            // For +DM
            DM = isPositiveDM ? Math.max(currentHigh - previousHigh, 0) : 0;
        }
        else {
            // For -DM
            DM = !isPositiveDM ? Math.max(previousLow - currentLow, 0) : 0;
        }
        return DMIIndicator_correctFloat(DM);
    }
    calculateDI(smoothedDM, tr) {
        return smoothedDM / tr * 100;
    }
    calculateDX(plusDI, minusDI) {
        return DMIIndicator_correctFloat(Math.abs(plusDI - minusDI) / Math.abs(plusDI + minusDI) * 100);
    }
    smoothValues(accumulatedValues, currentValue, period) {
        return DMIIndicator_correctFloat(accumulatedValues - accumulatedValues / period + currentValue);
    }
    getTR(currentPoint, prevPoint) {
        return DMIIndicator_correctFloat(Math.max(
        // `currentHigh - currentLow`
        currentPoint[1] - currentPoint[2], 
        // `currentHigh - previousClose`
        !prevPoint ? 0 : Math.abs(currentPoint[1] - prevPoint[3]), 
        // `currentLow - previousClose`
        !prevPoint ? 0 : Math.abs(currentPoint[2] - prevPoint[3])));
    }
    getValues(series, params) {
        const period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, DMI = [], xData = [], yData = [];
        if (
        // Check period, if bigger than points length, skip
        (xVal.length <= period) ||
            // Only ohlc data is valid
            !DMIIndicator_isArray(yVal[0]) ||
            yVal[0].length !== 4) {
            return;
        }
        let prevSmoothedPlusDM = 0, prevSmoothedMinusDM = 0, prevSmoothedTR = 0, i;
        for (i = 1; i < yValLen; i++) {
            let smoothedPlusDM, smoothedMinusDM, smoothedTR, plusDM, // +DM
            minusDM, // -DM
            TR, plusDI, // +DI
            minusDI, // -DI
            DX;
            if (i <= period) {
                plusDM = this.calculateDM(yVal, i, true);
                minusDM = this.calculateDM(yVal, i);
                TR = this.getTR(yVal[i], yVal[i - 1]);
                // Accumulate first period values to smooth them later
                prevSmoothedPlusDM += plusDM;
                prevSmoothedMinusDM += minusDM;
                prevSmoothedTR += TR;
                // Get all values for the first point
                if (i === period) {
                    plusDI = this.calculateDI(prevSmoothedPlusDM, prevSmoothedTR);
                    minusDI = this.calculateDI(prevSmoothedMinusDM, prevSmoothedTR);
                    DX = this.calculateDX(prevSmoothedPlusDM, prevSmoothedMinusDM);
                    DMI.push([xVal[i], DX, plusDI, minusDI]);
                    xData.push(xVal[i]);
                    yData.push([DX, plusDI, minusDI]);
                }
            }
            else {
                // Calculate current values
                plusDM = this.calculateDM(yVal, i, true);
                minusDM = this.calculateDM(yVal, i);
                TR = this.getTR(yVal[i], yVal[i - 1]);
                // Smooth +DM, -DM and TR
                smoothedPlusDM = this.smoothValues(prevSmoothedPlusDM, plusDM, period);
                smoothedMinusDM = this.smoothValues(prevSmoothedMinusDM, minusDM, period);
                smoothedTR = this.smoothValues(prevSmoothedTR, TR, period);
                // Save current smoothed values for the next step
                prevSmoothedPlusDM = smoothedPlusDM;
                prevSmoothedMinusDM = smoothedMinusDM;
                prevSmoothedTR = smoothedTR;
                // Get all next points (except the first one calculated above)
                plusDI = this.calculateDI(prevSmoothedPlusDM, prevSmoothedTR);
                minusDI = this.calculateDI(prevSmoothedMinusDM, prevSmoothedTR);
                DX = this.calculateDX(prevSmoothedPlusDM, prevSmoothedMinusDM);
                DMI.push([xVal[i], DX, plusDI, minusDI]);
                xData.push(xVal[i]);
                yData.push([DX, plusDI, minusDI]);
            }
        }
        return {
            values: DMI,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Directional Movement Index (DMI).
 * This series requires the `linkedTo` option to be set and should
 * be loaded after the `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/dmi
 *         DMI indicator
 *
 * @extends      plotOptions.sma
 * @since 9.1.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/dmi
 * @optionparent plotOptions.dmi
 */
DMIIndicator.defaultOptions = DMIIndicator_merge(DMIIndicator_SMAIndicator.defaultOptions, {
    /**
     * @excluding index
     */
    params: {
        index: void 0 // Unused index, do not inherit (#15362)
    },
    marker: {
        enabled: false
    },
    tooltip: {
        pointFormat: '<span style="color: {point.color}">' +
            '\u25CF</span><b> {series.name}</b><br/>' +
            '<span style="color: {point.color}">DX</span>: {point.y}<br/>' +
            '<span style="color: ' +
            '{point.series.options.plusDILine.styles.lineColor}">' +
            '+DI</span>: {point.plusDI}<br/>' +
            '<span style="color: ' +
            '{point.series.options.minusDILine.styles.lineColor}">' +
            '-DI</span>: {point.minusDI}<br/>'
    },
    /**
     * +DI line options.
     */
    plusDILine: {
        /**
         * Styles for the +DI line.
         */
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line.
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: "#06b535" /* Palette.positiveColor */ // Green-ish
        }
    },
    /**
     * -DI line options.
     */
    minusDILine: {
        /**
         * Styles for the -DI line.
         */
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line.
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: "#f21313" /* Palette.negativeColor */ // Red-ish
        }
    },
    dataGrouping: {
        approximation: 'averages'
    }
});
DMIIndicator_extend(DMIIndicator.prototype, {
    areaLinesNames: [],
    nameBase: 'DMI',
    linesApiNames: ['plusDILine', 'minusDILine'],
    pointArrayMap: ['y', 'plusDI', 'minusDI'],
    parallelArrays: ['x', 'y', 'plusDI', 'minusDI'],
    pointValKey: 'y'
});
Indicators_MultipleLinesComposition.compose(DMIIndicator);
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('dmi', DMIIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const DMI_DMIIndicator = ((/* unused pure expression or super */ null && (DMIIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * The Directional Movement Index (DMI) indicator series.
 * If the [type](#series.dmi.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.dmi
 * @since 9.1.0
 * @product   highstock
 * @excluding allAreas, colorAxis,  dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/dmi
 * @apioption series.dmi
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/DPO/DPOIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: DPOIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: DPOIndicator_extend, merge: DPOIndicator_merge, correctFloat: DPOIndicator_correctFloat, pick: DPOIndicator_pick } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Functions
 *
 * */
// Utils:
/**
 * @private
 */
function accumulatePoints(sum, yVal, i, index, subtract) {
    const price = DPOIndicator_pick(yVal[i][index], yVal[i]);
    if (subtract) {
        return DPOIndicator_correctFloat(sum - price);
    }
    return DPOIndicator_correctFloat(sum + price);
}
/* *
 *
 *  Class
 *
 * */
/**
 * The DPO series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.dpo
 *
 * @augments Highcharts.Series
 */
class DPOIndicator extends DPOIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const period = params.period, index = params.index, offset = Math.floor(period / 2 + 1), range = period + offset, xVal = series.xData || [], yVal = series.yData || [], yValLen = yVal.length, 
        // 0- date, 1- Detrended Price Oscillator
        DPO = [], xData = [], yData = [];
        let oscillator, periodIndex, rangeIndex, price, i, j, sum = 0;
        if (xVal.length <= range) {
            return;
        }
        // Accumulate first N-points for SMA
        for (i = 0; i < period - 1; i++) {
            sum = accumulatePoints(sum, yVal, i, index);
        }
        // Detrended Price Oscillator formula:
        // DPO = Price - Simple moving average [from (n / 2 + 1) days ago]
        for (j = 0; j <= yValLen - range; j++) {
            periodIndex = j + period - 1;
            rangeIndex = j + range - 1;
            // Adding the last period point
            sum = accumulatePoints(sum, yVal, periodIndex, index);
            price = DPOIndicator_pick(yVal[rangeIndex][index], yVal[rangeIndex]);
            oscillator = price - sum / period;
            // Subtracting the first period point
            sum = accumulatePoints(sum, yVal, j, index, true);
            DPO.push([xVal[rangeIndex], oscillator]);
            xData.push(xVal[rangeIndex]);
            yData.push(oscillator);
        }
        return {
            values: DPO,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Detrended Price Oscillator. This series requires the `linkedTo` option to
 * be set and should be loaded after the `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/dpo
 *         Detrended Price Oscillator
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/dpo
 * @optionparent plotOptions.dpo
 */
DPOIndicator.defaultOptions = DPOIndicator_merge(DPOIndicator_SMAIndicator.defaultOptions, {
    /**
     * Parameters used in calculation of Detrended Price Oscillator series
     * points.
     */
    params: {
        index: 0,
        /**
         * Period for Detrended Price Oscillator
         */
        period: 21
    }
});
DPOIndicator_extend(DPOIndicator.prototype, {
    nameBase: 'DPO'
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('dpo', DPOIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const DPO_DPOIndicator = ((/* unused pure expression or super */ null && (DPOIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A Detrended Price Oscillator. If the [type](#series.dpo.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.dpo
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/dpo
 * @apioption series.dpo
 */
''; // To include the above in the js output'

;// ./code/es-modules/Stock/Indicators/Chaikin/ChaikinIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

 // For historic reasons, AD is built into Chaikin

const { ema: ChaikinIndicator_EMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { correctFloat: ChaikinIndicator_correctFloat, extend: ChaikinIndicator_extend, merge: ChaikinIndicator_merge, error: ChaikinIndicator_error } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Chaikin series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.chaikin
 *
 * @augments Highcharts.Series
 */
class ChaikinIndicator extends ChaikinIndicator_EMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const periods = params.periods, period = params.period, 
        // 0- date, 1- Chaikin Oscillator
        CHA = [], xData = [], yData = [];
        let oscillator, i;
        // Check if periods are correct
        if (periods.length !== 2 || periods[1] <= periods[0]) {
            ChaikinIndicator_error('Error: "Chaikin requires two periods. Notice, first ' +
                'period should be lower than the second one."');
            return;
        }
        // Accumulation Distribution Line data
        const ADL = AD_ADIndicator.prototype.getValues.call(this, series, {
            volumeSeriesID: params.volumeSeriesID,
            period: period
        });
        // Check if adl is calculated properly, if not skip
        if (!ADL) {
            return;
        }
        // Shorter Period EMA
        const SPE = super.getValues.call(this, ADL, {
            period: periods[0]
        });
        // Longer Period EMA
        const LPE = super.getValues.call(this, ADL, {
            period: periods[1]
        });
        // Check if ema is calculated properly, if not skip
        if (!SPE || !LPE) {
            return;
        }
        const periodsOffset = periods[1] - periods[0];
        for (i = 0; i < LPE.yData.length; i++) {
            oscillator = ChaikinIndicator_correctFloat(SPE.yData[i + periodsOffset] -
                LPE.yData[i]);
            CHA.push([LPE.xData[i], oscillator]);
            xData.push(LPE.xData[i]);
            yData.push(oscillator);
        }
        return {
            values: CHA,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Chaikin Oscillator. This series requires the `linkedTo` option to
 * be set and should be loaded after the `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/chaikin
 *         Chaikin Oscillator
 *
 * @extends      plotOptions.ema
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/chaikin
 * @optionparent plotOptions.chaikin
 */
ChaikinIndicator.defaultOptions = ChaikinIndicator_merge(ChaikinIndicator_EMAIndicator.defaultOptions, {
    /**
     * Parameters used in calculation of Chaikin Oscillator
     * series points.
     *
     * @excluding index
     */
    params: {
        index: void 0, // Unused index, do not inherit (#15362)
        /**
         * The id of volume series which is mandatory.
         * For example using OHLC data, volumeSeriesID='volume' means
         * the indicator will be calculated using OHLC and volume values.
         */
        volumeSeriesID: 'volume',
        /**
         * Parameter used indirectly for calculating the `AD` indicator.
         * Decides about the number of data points that are taken
         * into account for the indicator calculations.
         */
        period: 9,
        /**
         * Periods for Chaikin Oscillator calculations.
         *
         * @type    {Array<number>}
         * @default [3, 10]
         */
        periods: [3, 10]
    }
});
ChaikinIndicator_extend(ChaikinIndicator.prototype, {
    nameBase: 'Chaikin Osc',
    nameComponents: ['periods']
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('chaikin', ChaikinIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const Chaikin_ChaikinIndicator = ((/* unused pure expression or super */ null && (ChaikinIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `Chaikin Oscillator` series. If the [type](#series.chaikin.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.chaikin
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, stacking, showInNavigator
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/chaikin
 * @apioption series.chaikin
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/CMO/CMOIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: CMOIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { isNumber, merge: CMOIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The CMO series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.cmo
 *
 * @augments Highcharts.Series
 */
class CMOIndicator extends CMOIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, CMO = [], xData = [], yData = [];
        let i, index = params.index, values;
        if (xVal.length < period) {
            return;
        }
        if (isNumber(yVal[0])) {
            values = yVal;
        }
        else {
            // In case of the situation, where the series type has data length
            // shorter then 4 (HLC, range), this ensures that we are not trying
            // to reach the index out of bounds
            index = Math.min(index, yVal[0].length - 1);
            values = yVal.map((value) => value[index]);
        }
        let firstAddedSum = 0, sumOfHigherValues = 0, sumOfLowerValues = 0, y;
        // Calculate first point, check if the first value
        // was added to sum of higher/lower values, and what was the value.
        for (let j = period; j > 0; j--) {
            if (values[j] > values[j - 1]) {
                sumOfHigherValues += values[j] - values[j - 1];
            }
            else if (values[j] < values[j - 1]) {
                sumOfLowerValues += values[j - 1] - values[j];
            }
        }
        // You might divide by 0 if all values are equal,
        // so return 0 in this case.
        y =
            sumOfHigherValues + sumOfLowerValues > 0 ?
                (100 * (sumOfHigherValues - sumOfLowerValues)) /
                    (sumOfHigherValues + sumOfLowerValues) :
                0;
        xData.push(xVal[period]);
        yData.push(y);
        CMO.push([xVal[period], y]);
        for (i = period + 1; i < yValLen; i++) {
            firstAddedSum = Math.abs(values[i - period - 1] - values[i - period]);
            if (values[i] > values[i - 1]) {
                sumOfHigherValues += values[i] - values[i - 1];
            }
            else if (values[i] < values[i - 1]) {
                sumOfLowerValues += values[i - 1] - values[i];
            }
            // Check, to which sum was the first value added to,
            // and subtract this value from given sum.
            if (values[i - period] > values[i - period - 1]) {
                sumOfHigherValues -= firstAddedSum;
            }
            else {
                sumOfLowerValues -= firstAddedSum;
            }
            // Same as above.
            y =
                sumOfHigherValues + sumOfLowerValues > 0 ?
                    (100 * (sumOfHigherValues - sumOfLowerValues)) /
                        (sumOfHigherValues + sumOfLowerValues) :
                    0;
            xData.push(xVal[i]);
            yData.push(y);
            CMO.push([xVal[i], y]);
        }
        return {
            values: CMO,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Chande Momentum Oscilator (CMO) technical indicator. This series
 * requires the `linkedTo` option to be set and should be loaded after
 * the `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/cmo
 *         CMO indicator
 *
 * @extends      plotOptions.sma
 * @since 9.1.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/cmo
 * @optionparent plotOptions.cmo
 */
CMOIndicator.defaultOptions = CMOIndicator_merge(CMOIndicator_SMAIndicator.defaultOptions, {
    params: {
        period: 20,
        index: 3
    }
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('cmo', CMOIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const CMO_CMOIndicator = ((/* unused pure expression or super */ null && (CMOIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `CMO` series. If the [type](#series.cmo.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.cmo
 * @since 9.1.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/cmo
 * @apioption series.cmo
 */
(''); // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/DEMA/DEMAIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { ema: DEMAIndicator_EMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { correctFloat: DEMAIndicator_correctFloat, isArray: DEMAIndicator_isArray, merge: DEMAIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The DEMA series Type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.dema
 *
 * @augments Highcharts.Series
 */
class DEMAIndicator extends DEMAIndicator_EMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getEMA(yVal, prevEMA, SMA, index, i, xVal) {
        return super.calculateEma(xVal || [], yVal, typeof i === 'undefined' ? 1 : i, this.EMApercent, prevEMA, typeof index === 'undefined' ? -1 : index, SMA);
    }
    getValues(series, params) {
        const period = params.period, EMAvalues = [], doubledPeriod = 2 * period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, DEMA = [], xDataDema = [], yDataDema = [];
        let accumulatePeriodPoints = 0, EMA = 0, 
        // EMA(EMA)
        EMAlevel2, 
        // EMA of previous point
        prevEMA, prevEMAlevel2, 
        // EMA values array
        i, index = -1, DEMAPoint, SMA = 0;
        this.EMApercent = (2 / (period + 1));
        // Check period, if bigger than EMA points length, skip
        if (yValLen < 2 * period - 1) {
            return;
        }
        // Switch index for OHLC / Candlestick / Arearange
        if (DEMAIndicator_isArray(yVal[0])) {
            index = params.index ? params.index : 0;
        }
        // Accumulate first N-points
        accumulatePeriodPoints =
            super.accumulatePeriodPoints(period, index, yVal);
        // First point
        SMA = accumulatePeriodPoints / period;
        accumulatePeriodPoints = 0;
        // Calculate value one-by-one for each period in visible data
        for (i = period; i < yValLen + 2; i++) {
            if (i < yValLen + 1) {
                EMA = this.getEMA(yVal, prevEMA, SMA, index, i)[1];
                EMAvalues.push(EMA);
            }
            prevEMA = EMA;
            // Summing first period points for EMA(EMA)
            if (i < doubledPeriod) {
                accumulatePeriodPoints += EMA;
            }
            else {
                // Calculate DEMA
                // First DEMA point
                if (i === doubledPeriod) {
                    SMA = accumulatePeriodPoints / period;
                }
                EMA = EMAvalues[i - period - 1];
                EMAlevel2 = this.getEMA([EMA], prevEMAlevel2, SMA)[1];
                DEMAPoint = [
                    xVal[i - 2],
                    DEMAIndicator_correctFloat(2 * EMA - EMAlevel2)
                ];
                DEMA.push(DEMAPoint);
                xDataDema.push(DEMAPoint[0]);
                yDataDema.push(DEMAPoint[1]);
                prevEMAlevel2 = EMAlevel2;
            }
        }
        return {
            values: DEMA,
            xData: xDataDema,
            yData: yDataDema
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Double exponential moving average (DEMA) indicator. This series requires
 * `linkedTo` option to be set and should be loaded after the
 * `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/dema
 *         DEMA indicator
 *
 * @extends      plotOptions.ema
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/dema
 * @optionparent plotOptions.dema
 */
DEMAIndicator.defaultOptions = DEMAIndicator_merge(DEMAIndicator_EMAIndicator.defaultOptions);
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('dema', DEMAIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const DEMA_DEMAIndicator = ((/* unused pure expression or super */ null && (DEMAIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `DEMA` series. If the [type](#series.dema.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.dema
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/dema
 * @apioption series.dema
 */
''; // Adds doclet above to the transpiled file

;// ./code/es-modules/Stock/Indicators/TEMA/TEMAIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { ema: TEMAIndicator_EMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { correctFloat: TEMAIndicator_correctFloat, isArray: TEMAIndicator_isArray, merge: TEMAIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The TEMA series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.tema
 *
 * @augments Highcharts.Series
 */
class TEMAIndicator extends TEMAIndicator_EMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getEMA(yVal, prevEMA, SMA, index, i, xVal) {
        return super.calculateEma(xVal || [], yVal, typeof i === 'undefined' ? 1 : i, this.EMApercent, prevEMA, typeof index === 'undefined' ? -1 : index, SMA);
    }
    getTemaPoint(xVal, tripledPeriod, EMAlevels, i) {
        const TEMAPoint = [
            xVal[i - 3],
            TEMAIndicator_correctFloat(3 * EMAlevels.level1 -
                3 * EMAlevels.level2 + EMAlevels.level3)
        ];
        return TEMAPoint;
    }
    getValues(series, params) {
        const period = params.period, doubledPeriod = 2 * period, tripledPeriod = 3 * period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, tema = [], xDataTema = [], yDataTema = [], 
        // EMA values array
        emaValues = [], emaLevel2Values = [], 
        // This object contains all EMA EMAlevels calculated like below
        // EMA = level1
        // EMA(EMA) = level2,
        // EMA(EMA(EMA)) = level3,
        emaLevels = {};
        let index = -1, accumulatePeriodPoints = 0, sma = 0, 
        // EMA of previous point
        prevEMA, prevEMAlevel2, i, temaPoint;
        this.EMApercent = (2 / (period + 1));
        // Check period, if bigger than EMA points length, skip
        if (yValLen < 3 * period - 2) {
            return;
        }
        // Switch index for OHLC / Candlestick / Arearange
        if (TEMAIndicator_isArray(yVal[0])) {
            index = params.index ? params.index : 0;
        }
        // Accumulate first N-points
        accumulatePeriodPoints = super.accumulatePeriodPoints(period, index, yVal);
        // First point
        sma = accumulatePeriodPoints / period;
        accumulatePeriodPoints = 0;
        // Calculate value one-by-one for each period in visible data
        for (i = period; i < yValLen + 3; i++) {
            if (i < yValLen + 1) {
                emaLevels.level1 = this.getEMA(yVal, prevEMA, sma, index, i)[1];
                emaValues.push(emaLevels.level1);
            }
            prevEMA = emaLevels.level1;
            // Summing first period points for ema(ema)
            if (i < doubledPeriod) {
                accumulatePeriodPoints += emaLevels.level1;
            }
            else {
                // Calculate dema
                // First dema point
                if (i === doubledPeriod) {
                    sma = accumulatePeriodPoints / period;
                    accumulatePeriodPoints = 0;
                }
                emaLevels.level1 = emaValues[i - period - 1];
                emaLevels.level2 = this.getEMA([emaLevels.level1], prevEMAlevel2, sma)[1];
                emaLevel2Values.push(emaLevels.level2);
                prevEMAlevel2 = emaLevels.level2;
                // Summing first period points for ema(ema(ema))
                if (i < tripledPeriod) {
                    accumulatePeriodPoints += emaLevels.level2;
                }
                else {
                    // Calculate tema
                    // First tema point
                    if (i === tripledPeriod) {
                        sma = accumulatePeriodPoints / period;
                    }
                    if (i === yValLen + 1) {
                        // Calculate the last ema and emaEMA points
                        emaLevels.level1 = emaValues[i - period - 1];
                        emaLevels.level2 = this.getEMA([emaLevels.level1], prevEMAlevel2, sma)[1];
                        emaLevel2Values.push(emaLevels.level2);
                    }
                    emaLevels.level1 = emaValues[i - period - 2];
                    emaLevels.level2 = emaLevel2Values[i - 2 * period - 1];
                    emaLevels.level3 = this.getEMA([emaLevels.level2], emaLevels.prevLevel3, sma)[1];
                    temaPoint = this.getTemaPoint(xVal, tripledPeriod, emaLevels, i);
                    // Make sure that point exists (for TRIX oscillator)
                    if (temaPoint) {
                        tema.push(temaPoint);
                        xDataTema.push(temaPoint[0]);
                        yDataTema.push(temaPoint[1]);
                    }
                    emaLevels.prevLevel3 = emaLevels.level3;
                }
            }
        }
        return {
            values: tema,
            xData: xDataTema,
            yData: yDataTema
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Triple exponential moving average (TEMA) indicator. This series requires
 * `linkedTo` option to be set and should be loaded after the
 * `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/tema
 *         TEMA indicator
 *
 * @extends      plotOptions.ema
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/tema
 * @optionparent plotOptions.tema
 */
TEMAIndicator.defaultOptions = TEMAIndicator_merge(TEMAIndicator_EMAIndicator.defaultOptions);
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('tema', TEMAIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const TEMA_TEMAIndicator = ((/* unused pure expression or super */ null && (TEMAIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `TEMA` series. If the [type](#series.tema.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.tema
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/tema
 * @apioption series.tema
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/TRIX/TRIXIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { tema: TRIXIndicator_TEMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { correctFloat: TRIXIndicator_correctFloat, merge: TRIXIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The TRIX series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.trix
 *
 * @augments Highcharts.Series
 */
class TRIXIndicator extends TRIXIndicator_TEMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    // TRIX is calculated using TEMA so we just extend getTemaPoint method.
    getTemaPoint(xVal, tripledPeriod, EMAlevels, i) {
        if (i > tripledPeriod) {
            return [
                xVal[i - 3],
                EMAlevels.prevLevel3 !== 0 ?
                    TRIXIndicator_correctFloat(EMAlevels.level3 - EMAlevels.prevLevel3) /
                        EMAlevels.prevLevel3 * 100 : null
            ];
        }
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Triple exponential average (TRIX) oscillator. This series requires
 * `linkedTo` option to be set.
 *
 * @sample {highstock} stock/indicators/trix
 * TRIX indicator
 *
 * @extends      plotOptions.tema
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/tema
 * @requires     stock/indicators/trix
 * @optionparent plotOptions.trix
 */
TRIXIndicator.defaultOptions = TRIXIndicator_merge(TRIXIndicator_TEMAIndicator.defaultOptions);
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('trix', TRIXIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const TRIX_TRIXIndicator = ((/* unused pure expression or super */ null && (TRIXIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `TRIX` series. If the [type](#series.trix.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.trix
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/tema
 * @apioption series.trix
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/APO/APOIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { ema: APOIndicator_EMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: APOIndicator_extend, merge: APOIndicator_merge, error: APOIndicator_error } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The APO series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.apo
 *
 * @augments Highcharts.Series
 */
class APOIndicator extends APOIndicator_EMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const periods = params.periods, index = params.index, 
        // 0- date, 1- Absolute price oscillator
        APO = [], xData = [], yData = [];
        let oscillator, i;
        // Check if periods are correct
        if (periods.length !== 2 || periods[1] <= periods[0]) {
            APOIndicator_error('Error: "APO requires two periods. Notice, first period ' +
                'should be lower than the second one."');
            return;
        }
        // Shorter Period EMA
        const SPE = super.getValues.call(this, series, {
            index: index,
            period: periods[0]
        });
        // Longer Period EMA
        const LPE = super.getValues.call(this, series, {
            index: index,
            period: periods[1]
        });
        // Check if ema is calculated properly, if not skip
        if (!SPE || !LPE) {
            return;
        }
        const periodsOffset = periods[1] - periods[0];
        for (i = 0; i < LPE.yData.length; i++) {
            oscillator = (SPE.yData[i + periodsOffset] -
                LPE.yData[i]);
            APO.push([LPE.xData[i], oscillator]);
            xData.push(LPE.xData[i]);
            yData.push(oscillator);
        }
        return {
            values: APO,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Absolute Price Oscillator. This series requires the `linkedTo` option to
 * be set and should be loaded after the `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/apo
 *         Absolute Price Oscillator
 *
 * @extends      plotOptions.ema
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/apo
 * @optionparent plotOptions.apo
 */
APOIndicator.defaultOptions = APOIndicator_merge(APOIndicator_EMAIndicator.defaultOptions, {
    /**
     * Parameters used in calculation of Absolute Price Oscillator
     * series points.
     *
     * @excluding period
     */
    params: {
        period: void 0, // Unchangeable period, do not inherit (#15362)
        /**
         * Periods for Absolute Price Oscillator calculations.
         *
         * @type    {Array<number>}
         * @default [10, 20]
         * @since   7.0.0
         */
        periods: [10, 20]
    }
});
APOIndicator_extend(APOIndicator.prototype, {
    nameBase: 'APO',
    nameComponents: ['periods']
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('apo', APOIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const APO_APOIndicator = ((/* unused pure expression or super */ null && (APOIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * An `Absolute Price Oscillator` series. If the [type](#series.apo.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.apo
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/apo
 * @apioption series.apo
 */
''; // To include the above in the js output

;// external ["../modules/datagrouping.src.js","default","dataGrouping","approximations"]
const datagrouping_src_js_default_dataGrouping_approximations_namespaceObject = __WEBPACK_EXTERNAL_MODULE__modules_datagrouping_src_js_b7a4250c__["default"].dataGrouping.approximations;
var datagrouping_src_js_default_dataGrouping_approximations_default = /*#__PURE__*/__webpack_require__.n(datagrouping_src_js_default_dataGrouping_approximations_namespaceObject);
;// external ["../highcharts.src.js","default","Color"]
const external_highcharts_src_js_default_Color_namespaceObject = __WEBPACK_EXTERNAL_MODULE__highcharts_src_js_8202131d__["default"].Color;
var external_highcharts_src_js_default_Color_default = /*#__PURE__*/__webpack_require__.n(external_highcharts_src_js_default_Color_namespaceObject);
;// ./code/es-modules/Stock/Indicators/IKH/IKHIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */



const { parse: color } = (external_highcharts_src_js_default_Color_default());

const { sma: IKHIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { defined: IKHIndicator_defined, extend: IKHIndicator_extend, isArray: IKHIndicator_isArray, isNumber: IKHIndicator_isNumber, getClosestDistance, merge: IKHIndicator_merge, objectEach } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Functions
 *
 * */
/**
 * @private
 */
function maxHigh(arr) {
    return arr.reduce(function (max, res) {
        return Math.max(max, res[1]);
    }, -Infinity);
}
/**
 * @private
 */
function minLow(arr) {
    return arr.reduce(function (min, res) {
        return Math.min(min, res[2]);
    }, Infinity);
}
/**
 * @private
 */
function highlowLevel(arr) {
    return {
        high: maxHigh(arr),
        low: minLow(arr)
    };
}
/**
 * Check two lines intersection (line a1-a2 and b1-b2)
 * Source: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
 * @private
 */
function checkLineIntersection(a1, a2, b1, b2) {
    if (a1 && a2 && b1 && b2) {
        const saX = a2.plotX - a1.plotX, // Auxiliary section a2-a1 X
        saY = a2.plotY - a1.plotY, // Auxiliary section a2-a1 Y
        sbX = b2.plotX - b1.plotX, // Auxiliary section b2-b1 X
        sbY = b2.plotY - b1.plotY, // Auxiliary section b2-b1 Y
        sabX = a1.plotX - b1.plotX, // Auxiliary section a1-b1 X
        sabY = a1.plotY - b1.plotY, // Auxiliary section a1-b1 Y
        // First degree Bézier parameters
        u = (-saY * sabX + saX * sabY) / (-sbX * saY + saX * sbY), t = (sbX * sabY - sbY * sabX) / (-sbX * saY + saX * sbY);
        if (u >= 0 && u <= 1 && t >= 0 && t <= 1) {
            return {
                plotX: a1.plotX + t * saX,
                plotY: a1.plotY + t * saY
            };
        }
    }
}
/**
 * Parameter opt (indicator options object) include indicator, points,
 * nextPoints, color, options, gappedExtend and graph properties
 * @private
 */
function drawSenkouSpan(opt) {
    const indicator = opt.indicator;
    indicator.points = opt.points;
    indicator.nextPoints = opt.nextPoints;
    indicator.color = opt.color;
    indicator.options = IKHIndicator_merge(opt.options.senkouSpan.styles, opt.gap);
    indicator.graph = opt.graph;
    indicator.fillGraph = true;
    external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.sma.prototype.drawGraph.call(indicator);
}
/**
 * Data integrity in Ichimoku is different than default 'averages':
 * Point: [undefined, value, value, ...] is correct
 * Point: [undefined, undefined, undefined, ...] is incorrect
 * @private
 */
function ichimokuAverages() {
    const ret = [];
    let isEmptyRange;
    [].forEach.call(arguments, function (arr, i) {
        ret.push(datagrouping_src_js_default_dataGrouping_approximations_default().average(arr));
        isEmptyRange = !isEmptyRange && typeof ret[i] === 'undefined';
    });
    // Return undefined when first elem. is undefined and let
    // sum method handle null (#7377)
    return isEmptyRange ? void 0 : ret;
}
/* *
 *
 *  Class
 *
 * */
/**
 * The IKH series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ikh
 *
 * @augments Highcharts.Series
 */
class IKHIndicator extends IKHIndicator_SMAIndicator {
    constructor() {
        /* *
         *
         *  Static Properties
         *
         * */
        super(...arguments);
        /* *
         *
         *  Properties
         *
         * */
        this.data = [];
        this.options = {};
        this.points = [];
        this.graphCollection = [];
    }
    /* *
     *
     * Functions
     *
     * */
    init() {
        super.init.apply(this, arguments);
        // Set default color for lines:
        this.options = IKHIndicator_merge({
            tenkanLine: {
                styles: {
                    lineColor: this.color
                }
            },
            kijunLine: {
                styles: {
                    lineColor: this.color
                }
            },
            chikouLine: {
                styles: {
                    lineColor: this.color
                }
            },
            senkouSpanA: {
                styles: {
                    lineColor: this.color,
                    fill: color(this.color).setOpacity(0.5).get()
                }
            },
            senkouSpanB: {
                styles: {
                    lineColor: this.color,
                    fill: color(this.color).setOpacity(0.5).get()
                }
            },
            senkouSpan: {
                styles: {
                    fill: color(this.color).setOpacity(0.2).get()
                }
            }
        }, this.options);
    }
    toYData(point) {
        return [
            point.tenkanSen,
            point.kijunSen,
            point.chikouSpan,
            point.senkouSpanA,
            point.senkouSpanB
        ];
    }
    translate() {
        const indicator = this;
        external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.sma.prototype.translate.apply(indicator);
        for (const point of indicator.points) {
            for (const key of indicator.pointArrayMap) {
                const pointValue = point[key];
                if (IKHIndicator_isNumber(pointValue)) {
                    point['plot' + key] = indicator.yAxis.toPixels(pointValue, true);
                    // Add extra parameters for support tooltip in moved
                    // lines
                    point.plotY = point['plot' + key];
                    point.tooltipPos = [
                        point.plotX,
                        point['plot' + key]
                    ];
                    point.isNull = false;
                }
            }
        }
    }
    drawGraph() {
        const indicator = this, mainLinePoints = indicator.points, mainLineOptions = indicator.options, mainLinePath = indicator.graph, mainColor = indicator.color, gappedExtend = {
            options: {
                gapSize: mainLineOptions.gapSize
            }
        }, pointArrayMapLength = indicator.pointArrayMap.length, allIchimokuPoints = [
            [],
            [],
            [],
            [],
            [],
            []
        ], ikhMap = {
            tenkanLine: allIchimokuPoints[0],
            kijunLine: allIchimokuPoints[1],
            chikouLine: allIchimokuPoints[2],
            senkouSpanA: allIchimokuPoints[3],
            senkouSpanB: allIchimokuPoints[4],
            senkouSpan: allIchimokuPoints[5]
        }, intersectIndexColl = [], senkouSpanOptions = indicator
            .options.senkouSpan, color = senkouSpanOptions.color ||
            senkouSpanOptions.styles.fill, negativeColor = senkouSpanOptions.negativeColor, 
        // Points to create color and negativeColor senkouSpan
        points = [
            [], // Points color
            [] // Points negative color
        ], 
        // For span, we need an access to the next points, used in
        // getGraphPath()
        nextPoints = [
            [], // Next points color
            [] // Next points negative color
        ];
        let pointsLength = mainLinePoints.length, lineIndex = 0, position, point, i, startIntersect, endIntersect, sectionPoints, sectionNextPoints, pointsPlotYSum, nextPointsPlotYSum, senkouSpanTempColor, concatArrIndex, j, k;
        indicator.ikhMap = ikhMap;
        // Generate points for all lines and spans lines:
        while (pointsLength--) {
            point = mainLinePoints[pointsLength];
            for (i = 0; i < pointArrayMapLength; i++) {
                position = indicator.pointArrayMap[i];
                if (IKHIndicator_defined(point[position])) {
                    allIchimokuPoints[i].push({
                        plotX: point.plotX,
                        plotY: point['plot' + position],
                        isNull: false
                    });
                }
            }
            if (negativeColor && pointsLength !== mainLinePoints.length - 1) {
                // Check if lines intersect
                const index = ikhMap.senkouSpanB.length - 1, intersect = checkLineIntersection(ikhMap.senkouSpanA[index - 1], ikhMap.senkouSpanA[index], ikhMap.senkouSpanB[index - 1], ikhMap.senkouSpanB[index]);
                if (intersect) {
                    const intersectPointObj = {
                        plotX: intersect.plotX,
                        plotY: intersect.plotY,
                        isNull: false,
                        intersectPoint: true
                    };
                    // Add intersect point to ichimoku points collection
                    // Create senkouSpan sections
                    ikhMap.senkouSpanA.splice(index, 0, intersectPointObj);
                    ikhMap.senkouSpanB.splice(index, 0, intersectPointObj);
                    intersectIndexColl.push(index);
                }
            }
        }
        // Modify options and generate lines:
        objectEach(ikhMap, (values, lineName) => {
            if (mainLineOptions[lineName] &&
                lineName !== 'senkouSpan') {
                // First line is rendered by default option
                indicator.points = allIchimokuPoints[lineIndex];
                indicator.options = IKHIndicator_merge(mainLineOptions[lineName].styles, gappedExtend);
                indicator.graph = indicator['graph' + lineName];
                indicator.fillGraph = false;
                indicator.color = mainColor;
                external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.sma.prototype.drawGraph.call(indicator);
                // Now save line
                indicator['graph' + lineName] = indicator.graph;
            }
            lineIndex++;
        });
        // Generate senkouSpan area:
        // If graphCollection exist then remove svg
        // element and indicator property
        if (indicator.graphCollection) {
            for (const graphName of indicator.graphCollection) {
                indicator[graphName].destroy();
                delete indicator[graphName];
            }
        }
        // Clean graphCollection or initialize it
        indicator.graphCollection = [];
        // When user set negativeColor property
        if (negativeColor && ikhMap.senkouSpanA[0] && ikhMap.senkouSpanB[0]) {
            // Add first and last point to senkouSpan area sections
            intersectIndexColl.unshift(0);
            intersectIndexColl.push(ikhMap.senkouSpanA.length - 1);
            // Populate points and nextPoints arrays
            for (j = 0; j < intersectIndexColl.length - 1; j++) {
                startIntersect = intersectIndexColl[j];
                endIntersect = intersectIndexColl[j + 1];
                sectionPoints = ikhMap.senkouSpanB.slice(startIntersect, endIntersect + 1);
                sectionNextPoints = ikhMap.senkouSpanA.slice(startIntersect, endIntersect + 1);
                // Add points to color or negativeColor arrays
                // Check the middle point (if exist)
                if (Math.floor(sectionPoints.length / 2) >= 1) {
                    const x = Math.floor(sectionPoints.length / 2);
                    // When middle points has equal values
                    // Compare all points plotY value sum
                    if (sectionPoints[x].plotY === sectionNextPoints[x].plotY) {
                        pointsPlotYSum = 0;
                        nextPointsPlotYSum = 0;
                        for (k = 0; k < sectionPoints.length; k++) {
                            pointsPlotYSum += sectionPoints[k].plotY;
                            nextPointsPlotYSum += sectionNextPoints[k].plotY;
                        }
                        concatArrIndex =
                            pointsPlotYSum > nextPointsPlotYSum ? 0 : 1;
                        points[concatArrIndex] = points[concatArrIndex].concat(sectionPoints);
                        nextPoints[concatArrIndex] = nextPoints[concatArrIndex].concat(sectionNextPoints);
                    }
                    else {
                        // Compare middle point of the section
                        concatArrIndex = (sectionPoints[x].plotY > sectionNextPoints[x].plotY) ? 0 : 1;
                        points[concatArrIndex] = points[concatArrIndex].concat(sectionPoints);
                        nextPoints[concatArrIndex] = nextPoints[concatArrIndex].concat(sectionNextPoints);
                    }
                }
                else {
                    // Compare first point of the section
                    concatArrIndex = (sectionPoints[0].plotY > sectionNextPoints[0].plotY) ? 0 : 1;
                    points[concatArrIndex] = points[concatArrIndex].concat(sectionPoints);
                    nextPoints[concatArrIndex] = nextPoints[concatArrIndex].concat(sectionNextPoints);
                }
            }
            // Render color and negativeColor paths
            ['graphsenkouSpanColor', 'graphsenkouSpanNegativeColor'].forEach(function (areaName, i) {
                if (points[i].length && nextPoints[i].length) {
                    senkouSpanTempColor = i === 0 ? color : negativeColor;
                    drawSenkouSpan({
                        indicator: indicator,
                        points: points[i],
                        nextPoints: nextPoints[i],
                        color: senkouSpanTempColor,
                        options: mainLineOptions,
                        gap: gappedExtend,
                        graph: indicator[areaName]
                    });
                    // Now save line
                    indicator[areaName] = indicator.graph;
                    indicator.graphCollection.push(areaName);
                }
            });
        }
        else {
            // When user set only senkouSpan style.fill property
            drawSenkouSpan({
                indicator: indicator,
                points: ikhMap.senkouSpanB,
                nextPoints: ikhMap.senkouSpanA,
                color: color,
                options: mainLineOptions,
                gap: gappedExtend,
                graph: indicator.graphsenkouSpan
            });
            // Now save line
            indicator.graphsenkouSpan = indicator.graph;
        }
        // Clean temporary properties:
        delete indicator.nextPoints;
        delete indicator.fillGraph;
        // Restore options and draw the Tenkan line:
        indicator.points = mainLinePoints;
        indicator.options = mainLineOptions;
        indicator.graph = mainLinePath;
        indicator.color = mainColor;
    }
    getGraphPath(points) {
        const indicator = this;
        let path = [], spanA, spanAarr = [];
        points = points || this.points;
        // Render Senkou Span
        if (indicator.fillGraph && indicator.nextPoints) {
            spanA = external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.sma.prototype.getGraphPath.call(indicator, 
            // Reverse points, so Senkou Span A will start from the end:
            indicator.nextPoints);
            if (spanA && spanA.length) {
                spanA[0][0] = 'L';
                path = external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.sma.prototype.getGraphPath
                    .call(indicator, points);
                spanAarr = spanA.slice(0, path.length);
                for (let i = spanAarr.length - 1; i >= 0; i--) {
                    path.push(spanAarr[i]);
                }
            }
        }
        else {
            path = external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.sma.prototype.getGraphPath
                .apply(indicator, arguments);
        }
        return path;
    }
    getValues(series, params) {
        const period = params.period, periodTenkan = params.periodTenkan, periodSenkouSpanB = params.periodSenkouSpanB, xVal = series.xData, yVal = series.yData, xAxis = series.xAxis, yValLen = (yVal && yVal.length) || 0, closestPointRange = getClosestDistance(xAxis.series.map((s) => s.getColumn('x'))), IKH = [], xData = [];
        let date, slicedTSY, slicedKSY, slicedSSBY, pointTS, pointKS, pointSSB, i, TS, KS, CS, SSA, SSB;
        // Ikh requires close value
        if (xVal.length <= period ||
            !IKHIndicator_isArray(yVal[0]) ||
            yVal[0].length !== 4) {
            return;
        }
        // Add timestamps at the beginning
        const dateStart = xVal[0] - period * closestPointRange;
        for (i = 0; i < period; i++) {
            xData.push(dateStart + i * closestPointRange);
        }
        for (i = 0; i < yValLen; i++) {
            // Tenkan Sen
            if (i >= periodTenkan) {
                slicedTSY = yVal.slice(i - periodTenkan, i);
                pointTS = highlowLevel(slicedTSY);
                TS = (pointTS.high + pointTS.low) / 2;
            }
            if (i >= period) {
                slicedKSY = yVal.slice(i - period, i);
                pointKS = highlowLevel(slicedKSY);
                KS = (pointKS.high + pointKS.low) / 2;
                SSA = (TS + KS) / 2;
            }
            if (i >= periodSenkouSpanB) {
                slicedSSBY = yVal.slice(i - periodSenkouSpanB, i);
                pointSSB = highlowLevel(slicedSSBY);
                SSB = (pointSSB.high + pointSSB.low) / 2;
            }
            CS = yVal[i][3];
            date = xVal[i];
            if (typeof IKH[i] === 'undefined') {
                IKH[i] = [];
            }
            if (typeof IKH[i + period - 1] === 'undefined') {
                IKH[i + period - 1] = [];
            }
            IKH[i + period - 1][0] = TS;
            IKH[i + period - 1][1] = KS;
            IKH[i + period - 1][2] = void 0;
            if (typeof IKH[i + 1] === 'undefined') {
                IKH[i + 1] = [];
            }
            IKH[i + 1][2] = CS;
            if (i <= period) {
                IKH[i + period - 1][3] = void 0;
                IKH[i + period - 1][4] = void 0;
            }
            if (typeof IKH[i + 2 * period - 2] === 'undefined') {
                IKH[i + 2 * period - 2] = [];
            }
            IKH[i + 2 * period - 2][3] = SSA;
            IKH[i + 2 * period - 2][4] = SSB;
            xData.push(date);
        }
        // Add timestamps for further points
        for (i = 1; i <= period; i++) {
            xData.push(date + i * closestPointRange);
        }
        return {
            values: IKH,
            xData: xData,
            yData: IKH
        };
    }
}
/**
 * Ichimoku Kinko Hyo (IKH). This series requires `linkedTo` option to be
 * set.
 *
 * @sample stock/indicators/ichimoku-kinko-hyo
 *         Ichimoku Kinko Hyo indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/ichimoku-kinko-hyo
 * @optionparent plotOptions.ikh
 */
IKHIndicator.defaultOptions = IKHIndicator_merge(IKHIndicator_SMAIndicator.defaultOptions, {
    /**
     * @excluding index
     */
    params: {
        index: void 0, // Unused index, do not inherit (#15362)
        period: 26,
        /**
         * The base period for Tenkan calculations.
         */
        periodTenkan: 9,
        /**
         * The base period for Senkou Span B calculations
         */
        periodSenkouSpanB: 52
    },
    marker: {
        enabled: false
    },
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' +
            'TENKAN SEN: {point.tenkanSen:.3f}<br/>' +
            'KIJUN SEN: {point.kijunSen:.3f}<br/>' +
            'CHIKOU SPAN: {point.chikouSpan:.3f}<br/>' +
            'SENKOU SPAN A: {point.senkouSpanA:.3f}<br/>' +
            'SENKOU SPAN B: {point.senkouSpanB:.3f}<br/>'
    },
    /**
     * The styles for Tenkan line
     */
    tenkanLine: {
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line.
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    /**
     * The styles for Kijun line
     */
    kijunLine: {
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line.
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    /**
     * The styles for Chikou line
     */
    chikouLine: {
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line.
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    /**
     * The styles for Senkou Span A line
     */
    senkouSpanA: {
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line.
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    /**
     * The styles for Senkou Span B line
     */
    senkouSpanB: {
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line.
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    /**
     * The styles for area between Senkou Span A and B.
     */
    senkouSpan: {
        /**
         * Color of the area between Senkou Span A and B,
         * when Senkou Span A is above Senkou Span B. Note that if
         * a `style.fill` is defined, the `color` takes precedence and
         * the `style.fill` is ignored.
         *
         * @see [senkouSpan.styles.fill](#series.ikh.senkouSpan.styles.fill)
         *
         * @sample stock/indicators/ichimoku-kinko-hyo
         *         Ichimoku Kinko Hyo color
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since     7.0.0
         * @apioption plotOptions.ikh.senkouSpan.color
         */
        /**
         * Color of the area between Senkou Span A and B,
         * when Senkou Span A is under Senkou Span B.
         *
         * @sample stock/indicators/ikh-negative-color
         *         Ichimoku Kinko Hyo negativeColor
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since     7.0.0
         * @apioption plotOptions.ikh.senkouSpan.negativeColor
         */
        styles: {
            /**
             * Color of the area between Senkou Span A and B.
             *
             * @deprecated
             * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             */
            fill: 'rgba(255, 0, 0, 0.5)'
        }
    },
    dataGrouping: {
        approximation: 'ichimoku-averages'
    }
});
IKHIndicator_extend(IKHIndicator.prototype, {
    pointArrayMap: [
        'tenkanSen',
        'kijunSen',
        'chikouSpan',
        'senkouSpanA',
        'senkouSpanB'
    ],
    pointValKey: 'tenkanSen',
    nameComponents: ['periodSenkouSpanB', 'period', 'periodTenkan']
});
/* *
 *
 *  Registry
 *
 * */
(datagrouping_src_js_default_dataGrouping_approximations_default())["ichimoku-averages"] = ichimokuAverages;
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('ikh', IKHIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const IKH_IKHIndicator = ((/* unused pure expression or super */ null && (IKHIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `IKH` series. If the [type](#series.ikh.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ikh
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/ichimoku-kinko-hyo
 * @apioption series.ikh
 */
(''); // Add doclet above to transpiled file

;// ./code/es-modules/Stock/Indicators/KeltnerChannels/KeltnerChannelsIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */



const { sma: KeltnerChannelsIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { correctFloat: KeltnerChannelsIndicator_correctFloat, extend: KeltnerChannelsIndicator_extend, merge: KeltnerChannelsIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Keltner Channels series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.keltnerchannels
 *
 * @augments Highcharts.Series
 */
class KeltnerChannelsIndicator extends KeltnerChannelsIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    init() {
        external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.sma.prototype.init.apply(this, arguments);
        // Set default color for lines:
        this.options = KeltnerChannelsIndicator_merge({
            topLine: {
                styles: {
                    lineColor: this.color
                }
            },
            bottomLine: {
                styles: {
                    lineColor: this.color
                }
            }
        }, this.options);
    }
    getValues(series, params) {
        const period = params.period, periodATR = params.periodATR, multiplierATR = params.multiplierATR, index = params.index, yVal = series.yData, yValLen = yVal ? yVal.length : 0, 
        // Keltner Channels array structure:
        // 0-date, 1-top line, 2-middle line, 3-bottom line
        KC = [], seriesEMA = external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.ema.prototype.getValues(series, {
            period: period,
            index: index
        }), seriesATR = external_highcharts_src_js_default_SeriesRegistry_default().seriesTypes.atr.prototype.getValues(series, {
            period: periodATR
        }), xData = [], yData = [];
        // Middle line, top line and bottom lineI
        let ML, TL, BL, date, pointEMA, pointATR, i;
        if (yValLen < period) {
            return;
        }
        for (i = period; i <= yValLen; i++) {
            pointEMA = seriesEMA.values[i - period];
            pointATR = seriesATR.values[i - periodATR];
            date = pointEMA[0];
            TL = KeltnerChannelsIndicator_correctFloat(pointEMA[1] + (multiplierATR * pointATR[1]));
            BL = KeltnerChannelsIndicator_correctFloat(pointEMA[1] - (multiplierATR * pointATR[1]));
            ML = pointEMA[1];
            KC.push([date, TL, ML, BL]);
            xData.push(date);
            yData.push([TL, ML, BL]);
        }
        return {
            values: KC,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Keltner Channels. This series requires the `linkedTo` option to be set
 * and should be loaded after the `stock/indicators/indicators.js`,
 * `stock/indicators/atr.js`, and `stock/ema/.js`.
 *
 * @sample {highstock} stock/indicators/keltner-channels
 *         Keltner Channels
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart,showInNavigator,
 *               stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/keltner-channels
 * @optionparent plotOptions.keltnerchannels
 */
KeltnerChannelsIndicator.defaultOptions = KeltnerChannelsIndicator_merge(KeltnerChannelsIndicator_SMAIndicator.defaultOptions, {
    /**
     * Option for fill color between lines in Keltner Channels Indicator.
     *
     * @sample {highstock} stock/indicators/indicator-area-fill
     *      Background fill between lines.
     *
     * @type {Highcharts.Color}
     * @since 9.3.2
     * @apioption plotOptions.keltnerchannels.fillColor
     *
     */
    params: {
        /**
         * The point index which indicator calculations will base. For
         * example using OHLC data, index=2 means the indicator will be
         * calculated using Low values.
         */
        index: 0,
        period: 20,
        /**
         * The ATR period.
         */
        periodATR: 10,
        /**
         * The ATR multiplier.
         */
        multiplierATR: 2
    },
    /**
     * Bottom line options.
     *
     */
    bottomLine: {
        /**
         * Styles for a bottom line.
         *
         */
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line. If not set, it's inherited from
             * `plotOptions.keltnerchannels.color`
             */
            lineColor: void 0
        }
    },
    /**
     * Top line options.
     *
     * @extends plotOptions.keltnerchannels.bottomLine
     */
    topLine: {
        styles: {
            lineWidth: 1,
            lineColor: void 0
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Upper Channel: {point.top}<br/>EMA({series.options.params.period}): {point.middle}<br/>Lower Channel: {point.bottom}<br/>'
    },
    marker: {
        enabled: false
    },
    dataGrouping: {
        approximation: 'averages'
    },
    lineWidth: 1
});
KeltnerChannelsIndicator_extend(KeltnerChannelsIndicator.prototype, {
    nameBase: 'Keltner Channels',
    areaLinesNames: ['top', 'bottom'],
    nameComponents: ['period', 'periodATR', 'multiplierATR'],
    linesApiNames: ['topLine', 'bottomLine'],
    pointArrayMap: ['top', 'middle', 'bottom'],
    pointValKey: 'middle'
});
Indicators_MultipleLinesComposition.compose(KeltnerChannelsIndicator);
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('keltnerchannels', KeltnerChannelsIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const KeltnerChannels_KeltnerChannelsIndicator = ((/* unused pure expression or super */ null && (KeltnerChannelsIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A Keltner Channels indicator. If the [type](#series.keltnerchannels.type)
 * option is not specified, it is inherited from[chart.type](#chart.type).
 *
 * @extends      series,plotOptions.keltnerchannels
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *               joinBy, keys, navigatorOptions, pointInterval,
 *               pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *               stacking, showInNavigator
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/keltner-channels
 * @apioption    series.keltnerchannels
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/Klinger/KlingerIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */



const { ema: KlingerIndicator_EMAIndicator, sma: KlingerIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { correctFloat: KlingerIndicator_correctFloat, error: KlingerIndicator_error, extend: KlingerIndicator_extend, isArray: KlingerIndicator_isArray, merge: KlingerIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Klinger oscillator series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.klinger
 *
 * @augments Highcharts.Series
 */
class KlingerIndicator extends KlingerIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    calculateTrend(yVal, i) {
        const isUpward = yVal[i][1] + yVal[i][2] + yVal[i][3] >
            yVal[i - 1][1] + yVal[i - 1][2] + yVal[i - 1][3];
        return isUpward ? 1 : -1;
    }
    // Checks if the series and volumeSeries are accessible, number of
    // points.x is longer than period, is series has OHLC data
    isValidData(firstYVal) {
        const chart = this.chart, options = this.options, series = this.linkedParent, isSeriesOHLC = KlingerIndicator_isArray(firstYVal) &&
            firstYVal.length === 4, volumeSeries = this.volumeSeries ||
            (this.volumeSeries =
                chart.get(options.params.volumeSeriesID));
        if (!volumeSeries) {
            KlingerIndicator_error('Series ' +
                options.params.volumeSeriesID +
                ' not found! Check `volumeSeriesID`.', true, series.chart);
        }
        const isLengthValid = [series, volumeSeries].every(function (series) {
            return series && series.dataTable.rowCount >=
                options.params.slowAvgPeriod;
        });
        return !!(isLengthValid && isSeriesOHLC);
    }
    getCM(previousCM, DM, trend, previousTrend, prevoiusDM) {
        return KlingerIndicator_correctFloat(DM + (trend === previousTrend ? previousCM : prevoiusDM));
    }
    getDM(high, low) {
        return KlingerIndicator_correctFloat(high - low);
    }
    getVolumeForce(yVal) {
        const volumeForce = [];
        let CM = 0, // Cumulative measurement
        DM, // Daily measurement
        force, i = 1, // Start from second point
        previousCM = 0, previousDM = yVal[0][1] - yVal[0][2], // Initial DM
        previousTrend = 0, trend;
        for (i; i < yVal.length; i++) {
            trend = this.calculateTrend(yVal, i);
            DM = this.getDM(yVal[i][1], yVal[i][2]);
            // For the first iteration when the previousTrend doesn't exist,
            // previousCM doesn't exist either, but it doesn't matter becouse
            // it's filltered out in the getCM method in else statement,
            // (in this iteration, previousCM can be raplaced with the DM).
            CM = this.getCM(previousCM, DM, trend, previousTrend, previousDM);
            force = this.volumeSeries.getColumn('y')[i] *
                trend * Math.abs(2 * ((DM / CM) - 1)) * 100;
            volumeForce.push([force]);
            // Before next iteration, assign the current as the previous.
            previousTrend = trend;
            previousCM = CM;
            previousDM = DM;
        }
        return volumeForce;
    }
    getEMA(yVal, prevEMA, SMA, EMApercent, index, i, xVal) {
        return KlingerIndicator_EMAIndicator.prototype.calculateEma(xVal || [], yVal, typeof i === 'undefined' ? 1 : i, EMApercent, prevEMA, typeof index === 'undefined' ? -1 : index, SMA);
    }
    getSMA(period, index, values) {
        return KlingerIndicator_EMAIndicator.prototype
            .accumulatePeriodPoints(period, index, values) / period;
    }
    getValues(series, params) {
        const Klinger = [], xVal = series.xData, yVal = series.yData, xData = [], yData = [], calcSingal = [];
        let KO, i = 0, fastEMA = 0, slowEMA, previousFastEMA = void 0, previousSlowEMA = void 0, signal = null;
        // If the necessary conditions are not fulfilled, don't proceed.
        if (!this.isValidData(yVal[0])) {
            return;
        }
        // Calculate the Volume Force array.
        const volumeForce = this.getVolumeForce(yVal);
        // Calculate SMA for the first points.
        const SMAFast = this.getSMA(params.fastAvgPeriod, 0, volumeForce), SMASlow = this.getSMA(params.slowAvgPeriod, 0, volumeForce);
        // Calculate EMApercent for the first points.
        const fastEMApercent = 2 / (params.fastAvgPeriod + 1), slowEMApercent = 2 / (params.slowAvgPeriod + 1);
        // Calculate KO
        for (i; i < yVal.length; i++) {
            // Get EMA for fast period.
            if (i >= params.fastAvgPeriod) {
                fastEMA = this.getEMA(volumeForce, previousFastEMA, SMAFast, fastEMApercent, 0, i, xVal)[1];
                previousFastEMA = fastEMA;
            }
            // Get EMA for slow period.
            if (i >= params.slowAvgPeriod) {
                slowEMA = this.getEMA(volumeForce, previousSlowEMA, SMASlow, slowEMApercent, 0, i, xVal)[1];
                previousSlowEMA = slowEMA;
                KO = KlingerIndicator_correctFloat(fastEMA - slowEMA);
                calcSingal.push(KO);
                // Calculate signal SMA
                if (calcSingal.length >= params.signalPeriod) {
                    signal = calcSingal.slice(-params.signalPeriod)
                        .reduce((prev, curr) => prev + curr) / params.signalPeriod;
                }
                Klinger.push([xVal[i], KO, signal]);
                xData.push(xVal[i]);
                yData.push([KO, signal]);
            }
        }
        return {
            values: Klinger,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Klinger oscillator. This series requires the `linkedTo` option to be set
 * and should be loaded after the `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/klinger
 *         Klinger oscillator
 *
 * @extends      plotOptions.sma
 * @since 9.1.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/klinger
 * @optionparent plotOptions.klinger
 */
KlingerIndicator.defaultOptions = KlingerIndicator_merge(KlingerIndicator_SMAIndicator.defaultOptions, {
    /**
     * Parameters used in calculation of Klinger Oscillator.
     *
     * @excluding index, period
     */
    params: {
        /**
         * The fast period for indicator calculations.
         */
        fastAvgPeriod: 34,
        /**
         * The slow period for indicator calculations.
         */
        slowAvgPeriod: 55,
        /**
         * The base period for signal calculations.
         */
        signalPeriod: 13,
        /**
         * The id of another series to use its data as volume data for the
         * indiator calculation.
         */
        volumeSeriesID: 'volume'
    },
    signalLine: {
        /**
         * Styles for a signal line.
         */
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line. If not set, it's inherited from
             * [plotOptions.klinger.color
             * ](#plotOptions.klinger.color).
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: '#ff0000'
        }
    },
    dataGrouping: {
        approximation: 'averages'
    },
    tooltip: {
        pointFormat: '<span style="color: {point.color}">\u25CF</span>' +
            '<b> {series.name}</b><br/>' +
            '<span style="color: {point.color}">Klinger</span>: ' +
            '{point.y}<br/>' +
            '<span style="color: ' +
            '{point.series.options.signalLine.styles.lineColor}">' +
            'Signal</span>' +
            ': {point.signal}<br/>'
    }
});
KlingerIndicator_extend(KlingerIndicator.prototype, {
    areaLinesNames: [],
    linesApiNames: ['signalLine'],
    nameBase: 'Klinger',
    nameComponents: ['fastAvgPeriod', 'slowAvgPeriod'],
    pointArrayMap: ['y', 'signal'],
    parallelArrays: ['x', 'y', 'signal'],
    pointValKey: 'y'
});
Indicators_MultipleLinesComposition.compose(KlingerIndicator);
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('klinger', KlingerIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const Klinger_KlingerIndicator = ((/* unused pure expression or super */ null && (KlingerIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A Klinger oscillator. If the [type](#series.klinger.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.klinger
 * @since 9.1.0
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/klinger
 * @apioption series.klinger
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/MACD/MACDIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { noop: MACDIndicator_noop } = (external_highcharts_src_js_default_default());

const { column: ColumnSeries, sma: MACDIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: MACDIndicator_extend, correctFloat: MACDIndicator_correctFloat, defined: MACDIndicator_defined, merge: MACDIndicator_merge } = (external_highcharts_src_js_default_default());
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
class MACDIndicator extends MACDIndicator_SMAIndicator {
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
            if (MACDIndicator_defined(this.colorIndex)) {
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
            if (MACDIndicator_defined(point.plotMACD)) {
                otherSignals[0].push({
                    plotX: point.plotX,
                    plotY: point.plotMACD,
                    isNull: !MACDIndicator_defined(point.plotMACD)
                });
            }
            if (MACDIndicator_defined(point.plotSignal)) {
                otherSignals[1].push({
                    plotX: point.plotX,
                    plotY: point.plotSignal,
                    isNull: !MACDIndicator_defined(point.plotMACD)
                });
            }
        }
        // Modify options and generate smoothing line:
        ['macd', 'signal'].forEach((lineName, i) => {
            indicator.points = otherSignals[i];
            indicator.options = MACDIndicator_merge(mainLineOptions[`${lineName}Line`]?.styles || {}, gappedExtend);
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
            if (MACDIndicator_defined(longEMA[i]) &&
                MACDIndicator_defined(longEMA[i][1]) &&
                MACDIndicator_defined(shortEMA[i + indexToShift]) &&
                MACDIndicator_defined(shortEMA[i + indexToShift][0])) {
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
                    MACD[i][1] = MACDIndicator_correctFloat(MACD[i][3] -
                        signalLine[j][1]);
                    yMACD[i][0] = MACDIndicator_correctFloat(MACD[i][3] -
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
MACDIndicator.defaultOptions = MACDIndicator_merge(MACDIndicator_SMAIndicator.defaultOptions, {
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
MACDIndicator_extend(MACDIndicator.prototype, {
    nameComponents: ['longPeriod', 'shortPeriod', 'signalPeriod'],
    // "y" value is treated as Histogram data
    pointArrayMap: ['y', 'signal', 'MACD'],
    parallelArrays: ['x', 'y', 'signal', 'MACD'],
    pointValKey: 'y',
    // Columns support:
    markerAttribs: MACDIndicator_noop,
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

;// ./code/es-modules/Stock/Indicators/MFI/MFIIndicator.js
/* *
 *
 *  Money Flow Index indicator for Highcharts Stock
 *
 *  (c) 2010-2025 Grzegorz Blachliński
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: MFIIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: MFIIndicator_extend, merge: MFIIndicator_merge, error: MFIIndicator_error, isArray: MFIIndicator_isArray } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Functions
 *
 * */
// Utils:
/**
 *
 */
function MFIIndicator_sumArray(array) {
    return array.reduce(function (prev, cur) {
        return prev + cur;
    });
}
/**
 *
 */
function toFixed(a, n) {
    return parseFloat(a.toFixed(n));
}
/**
 *
 */
function calculateTypicalPrice(point) {
    return (point[1] + point[2] + point[3]) / 3;
}
/**
 *
 */
function calculateRawMoneyFlow(typicalPrice, volume) {
    return typicalPrice * volume;
}
/* *
 *
 *  Class
 *
 * */
/**
 * The MFI series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.mfi
 *
 * @augments Highcharts.Series
 */
class MFIIndicator extends MFIIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, decimals = params.decimals, volumeSeries = series.chart.get(params.volumeSeriesID), yValVolume = volumeSeries?.getColumn('y') || [], MFI = [], xData = [], yData = [], positiveMoneyFlow = [], negativeMoneyFlow = [];
        let newTypicalPrice, oldTypicalPrice, rawMoneyFlow, negativeMoneyFlowSum, positiveMoneyFlowSum, moneyFlowRatio, MFIPoint, i, isUp = false, 
        // MFI starts calculations from the second point
        // Cause we need to calculate change between two points
        range = 1;
        if (!volumeSeries) {
            MFIIndicator_error('Series ' +
                params.volumeSeriesID +
                ' not found! Check `volumeSeriesID`.', true, series.chart);
            return;
        }
        // MFI requires high low and close values
        if ((xVal.length <= period) || !MFIIndicator_isArray(yVal[0]) ||
            yVal[0].length !== 4 ||
            !yValVolume) {
            return;
        }
        // Calculate first typical price
        newTypicalPrice = calculateTypicalPrice(yVal[range]);
        // Accumulate first N-points
        while (range < period + 1) {
            // Calculate if up or down
            oldTypicalPrice = newTypicalPrice;
            newTypicalPrice = calculateTypicalPrice(yVal[range]);
            isUp = newTypicalPrice >= oldTypicalPrice;
            // Calculate raw money flow
            rawMoneyFlow = calculateRawMoneyFlow(newTypicalPrice, yValVolume[range]);
            // Add to array
            positiveMoneyFlow.push(isUp ? rawMoneyFlow : 0);
            negativeMoneyFlow.push(isUp ? 0 : rawMoneyFlow);
            range++;
        }
        for (i = range - 1; i < yValLen; i++) {
            if (i > range - 1) {
                // Remove first point from array
                positiveMoneyFlow.shift();
                negativeMoneyFlow.shift();
                // Calculate if up or down
                oldTypicalPrice = newTypicalPrice;
                newTypicalPrice = calculateTypicalPrice(yVal[i]);
                isUp = newTypicalPrice > oldTypicalPrice;
                // Calculate raw money flow
                rawMoneyFlow = calculateRawMoneyFlow(newTypicalPrice, yValVolume[i]);
                // Add to array
                positiveMoneyFlow.push(isUp ? rawMoneyFlow : 0);
                negativeMoneyFlow.push(isUp ? 0 : rawMoneyFlow);
            }
            // Calculate sum of negative and positive money flow:
            negativeMoneyFlowSum = MFIIndicator_sumArray(negativeMoneyFlow);
            positiveMoneyFlowSum = MFIIndicator_sumArray(positiveMoneyFlow);
            moneyFlowRatio = positiveMoneyFlowSum / negativeMoneyFlowSum;
            MFIPoint = toFixed(100 - (100 / (1 + moneyFlowRatio)), decimals);
            MFI.push([xVal[i], MFIPoint]);
            xData.push(xVal[i]);
            yData.push(MFIPoint);
        }
        return {
            values: MFI,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Money Flow Index. This series requires `linkedTo` option to be set and
 * should be loaded after the `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/mfi
 *         Money Flow Index Indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/mfi
 * @optionparent plotOptions.mfi
 */
MFIIndicator.defaultOptions = MFIIndicator_merge(MFIIndicator_SMAIndicator.defaultOptions, {
    /**
     * @excluding index
     */
    params: {
        index: void 0, // Unchangeable index, do not inherit (#15362)
        /**
         * The id of volume series which is mandatory.
         * For example using OHLC data, volumeSeriesID='volume' means
         * the indicator will be calculated using OHLC and volume values.
         */
        volumeSeriesID: 'volume',
        /**
         * Number of maximum decimals that are used in MFI calculations.
         */
        decimals: 4
    }
});
MFIIndicator_extend(MFIIndicator.prototype, {
    nameBase: 'Money Flow Index'
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('mfi', MFIIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const MFI_MFIIndicator = ((/* unused pure expression or super */ null && (MFIIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `MFI` series. If the [type](#series.mfi.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.mfi
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/mfi
 * @apioption series.mfi
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/Momentum/MomentumIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: MomentumIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: MomentumIndicator_extend, isArray: MomentumIndicator_isArray, merge: MomentumIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Functions
 *
 * */
/**
 * @private
 */
function MomentumIndicator_populateAverage(xVal, yVal, i, period, index) {
    const mmY = yVal[i - 1][index] - yVal[i - period - 1][index], mmX = xVal[i - 1];
    return [mmX, mmY];
}
/* *
 *
 *  Class
 *
 * */
/**
 * The Momentum series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.momentum
 *
 * @augments Highcharts.Series
 */
class MomentumIndicator extends MomentumIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const period = params.period, index = params.index, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, MM = [], xData = [], yData = [];
        let i, MMPoint;
        if (xVal.length <= period) {
            return;
        }
        // Switch index for OHLC / Candlestick / Arearange
        if (!MomentumIndicator_isArray(yVal[0])) {
            return;
        }
        // Calculate value one-by-one for each period in visible data
        for (i = (period + 1); i < yValLen; i++) {
            MMPoint = MomentumIndicator_populateAverage(xVal, yVal, i, period, index);
            MM.push(MMPoint);
            xData.push(MMPoint[0]);
            yData.push(MMPoint[1]);
        }
        MMPoint = MomentumIndicator_populateAverage(xVal, yVal, i, period, index);
        MM.push(MMPoint);
        xData.push(MMPoint[0]);
        yData.push(MMPoint[1]);
        return {
            values: MM,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Momentum. This series requires `linkedTo` option to be set.
 *
 * @sample stock/indicators/momentum
 *         Momentum indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/momentum
 * @optionparent plotOptions.momentum
 */
MomentumIndicator.defaultOptions = MomentumIndicator_merge(MomentumIndicator_SMAIndicator.defaultOptions, {
    params: {
        index: 3
    }
});
MomentumIndicator_extend(MomentumIndicator.prototype, {
    nameBase: 'Momentum'
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('momentum', MomentumIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const Momentum_MomentumIndicator = ((/* unused pure expression or super */ null && (MomentumIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `Momentum` series. If the [type](#series.momentum.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.momentum
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/momentum
 * @apioption series.momentum
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/NATR/NATRIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { atr: NATRIndicator_ATRIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { merge: NATRIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The NATR series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.natr
 *
 * @augments Highcharts.Series
 */
class NATRIndicator extends NATRIndicator_ATRIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const atrData = (super.getValues.apply(this, arguments)), atrLength = atrData.values.length, yVal = series.yData;
        let i = 0, period = params.period - 1;
        if (!atrData) {
            return;
        }
        for (; i < atrLength; i++) {
            atrData.yData[i] = (atrData.values[i][1] / yVal[period][3] * 100);
            atrData.values[i][1] = atrData.yData[i];
            period++;
        }
        return atrData;
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Normalized average true range indicator (NATR). This series requires
 * `linkedTo` option to be set and should be loaded after the
 * `stock/indicators/indicators.js` and `stock/indicators/atr.js`.
 *
 * @sample {highstock} stock/indicators/natr
 *         NATR indicator
 *
 * @extends      plotOptions.atr
 * @since        7.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/natr
 * @optionparent plotOptions.natr
 */
NATRIndicator.defaultOptions = NATRIndicator_merge(NATRIndicator_ATRIndicator.defaultOptions, {
    tooltip: {
        valueSuffix: '%'
    }
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('natr', NATRIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const NATR_NATRIndicator = ((/* unused pure expression or super */ null && (NATRIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `NATR` series. If the [type](#series.natr.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.natr
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/atr
 * @requires  stock/indicators/natr
 * @apioption series.natr
 */
''; // To include the above in the js output'

;// ./code/es-modules/Stock/Indicators/OBV/OBVIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: OBVIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { isNumber: OBVIndicator_isNumber, error: OBVIndicator_error, extend: OBVIndicator_extend, merge: OBVIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The OBV series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.obv
 *
 * @augments Highcharts.Series
 */
class OBVIndicator extends OBVIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const volumeSeries = series.chart.get(params.volumeSeriesID), xVal = series.xData, yVal = series.yData, OBV = [], xData = [], yData = [], hasOHLC = !OBVIndicator_isNumber(yVal[0]);
        let OBVPoint = [], i = 1, previousOBV = 0, curentOBV = 0, previousClose = 0, curentClose = 0, volume;
        // Checks if volume series exists.
        if (volumeSeries) {
            volume = volumeSeries.getColumn('y');
            // Add first point and get close value.
            OBVPoint = [xVal[0], previousOBV];
            previousClose = hasOHLC ?
                yVal[0][3] : yVal[0];
            OBV.push(OBVPoint);
            xData.push(xVal[0]);
            yData.push(OBVPoint[1]);
            for (i; i < yVal.length; i++) {
                curentClose = hasOHLC ?
                    yVal[i][3] : yVal[i];
                if (curentClose > previousClose) { // Up
                    curentOBV = previousOBV + volume[i];
                }
                else if (curentClose === previousClose) { // Constant
                    curentOBV = previousOBV;
                }
                else { // Down
                    curentOBV = previousOBV - volume[i];
                }
                // Add point.
                OBVPoint = [xVal[i], curentOBV];
                // Assign current as previous for next iteration.
                previousOBV = curentOBV;
                previousClose = curentClose;
                OBV.push(OBVPoint);
                xData.push(xVal[i]);
                yData.push(OBVPoint[1]);
            }
        }
        else {
            OBVIndicator_error('Series ' +
                params.volumeSeriesID +
                ' not found! Check `volumeSeriesID`.', true, series.chart);
            return;
        }
        return {
            values: OBV,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * On-Balance Volume (OBV) technical indicator. This series
 * requires the `linkedTo` option to be set and should be loaded after
 * the `stock/indicators/indicators.js` file. Through the `volumeSeriesID`
 * there also should be linked the volume series.
 *
 * @sample stock/indicators/obv
 *         OBV indicator
 *
 * @extends      plotOptions.sma
 * @since 9.1.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/obv
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @optionparent plotOptions.obv
 */
OBVIndicator.defaultOptions = OBVIndicator_merge(OBVIndicator_SMAIndicator.defaultOptions, {
    marker: {
        enabled: false
    },
    /**
     * @excluding index, period
     */
    params: {
        // Index and period are unchangeable, do not inherit (#15362)
        index: void 0,
        period: void 0,
        /**
         * The id of another series to use its data as volume data for the
         * indicator calculation.
         */
        volumeSeriesID: 'volume'
    },
    tooltip: {
        valueDecimals: 0
    }
});
OBVIndicator_extend(OBVIndicator.prototype, {
    nameComponents: void 0
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('obv', OBVIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const OBV_OBVIndicator = ((/* unused pure expression or super */ null && (OBVIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `OBV` series. If the [type](#series.obv.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.obv
 * @since 9.1.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/obv
 * @apioption series.obv
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/PivotPoints/PivotPointsPoint.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const SMAPoint = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes.sma.prototype.pointClass;
/* *
 *
 *  Functions
 *
 * */
/**
 * @private
 */
function destroyExtraLabels(point, functionName) {
    const props = point.series.pointArrayMap;
    let prop, i = props.length;
    (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes.sma.prototype.pointClass.prototype[functionName].call(point);
    while (i--) {
        prop = 'dataLabel' + props[i];
        // S4 dataLabel could be removed by parent method:
        if (point[prop] && point[prop].element) {
            point[prop].destroy();
        }
        point[prop] = null;
    }
}
/* *
 *
 *  Class
 *
 * */
class PivotPointsPoint extends SMAPoint {
    /* *
     *
     *  Functions
     *
     * */
    destroyElements() {
        destroyExtraLabels(this, 'destroyElements');
    }
    // This method is called when removing points, e.g. series.update()
    destroy() {
        destroyExtraLabels(this, 'destroyElements');
    }
}
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const PivotPoints_PivotPointsPoint = (PivotPointsPoint);

;// ./code/es-modules/Stock/Indicators/PivotPoints/PivotPointsIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */



const { sma: PivotPointsIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { merge: PivotPointsIndicator_merge, extend: PivotPointsIndicator_extend, defined: PivotPointsIndicator_defined, isArray: PivotPointsIndicator_isArray } = (external_highcharts_src_js_default_default());
/**
 *
 *  Class
 *
 **/
/**
 * The Pivot Points series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pivotpoints
 *
 * @augments Highcharts.Series
 */
class PivotPointsIndicator extends PivotPointsIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    toYData(point) {
        return [point.P]; // The rest should not affect extremes
    }
    translate() {
        const indicator = this;
        super.translate.apply(indicator);
        indicator.points.forEach(function (point) {
            indicator.pointArrayMap.forEach(function (value) {
                if (PivotPointsIndicator_defined(point[value])) {
                    point['plot' + value] = (indicator.yAxis.toPixels(point[value], true));
                }
            });
        });
        // Pivot points are rendered as horizontal lines
        // And last point start not from the next one (as it's the last one)
        // But from the approximated last position in a given range
        indicator.plotEndPoint = indicator.xAxis.toPixels(indicator.endPoint, true);
    }
    getGraphPath(points) {
        const indicator = this, allPivotPoints = ([[], [], [], [], [], [], [], [], []]), pointArrayMapLength = indicator.pointArrayMap.length;
        let endPoint = indicator.plotEndPoint, path = [], position, point, pointsLength = points.length, i;
        while (pointsLength--) {
            point = points[pointsLength];
            for (i = 0; i < pointArrayMapLength; i++) {
                position = indicator.pointArrayMap[i];
                if (PivotPointsIndicator_defined(point[position])) {
                    allPivotPoints[i].push({
                        // Start left:
                        plotX: point.plotX,
                        plotY: point['plot' + position],
                        isNull: false
                    }, {
                        // Go to right:
                        plotX: endPoint,
                        plotY: point['plot' + position],
                        isNull: false
                    }, {
                        // And add null points in path to generate breaks:
                        plotX: endPoint,
                        plotY: null,
                        isNull: true
                    });
                }
            }
            endPoint = point.plotX;
        }
        allPivotPoints.forEach((pivotPoints) => {
            path = path.concat(super.getGraphPath.call(indicator, pivotPoints));
        });
        return path;
    }
    // TODO: Rewrite this logic to use multiple datalabels
    drawDataLabels() {
        const indicator = this, pointMapping = indicator.pointArrayMap;
        let currentLabel, pointsLength, point, i;
        if (indicator.options.dataLabels.enabled) {
            pointsLength = indicator.points.length;
            // For every Resistance/Support group we need to render labels.
            // Add one more item, which will just store dataLabels from
            // previous iteration
            pointMapping.concat([false]).forEach((position, k) => {
                i = pointsLength;
                while (i--) {
                    point = indicator.points[i];
                    if (!position) {
                        // Store S4 dataLabel too:
                        point['dataLabel' + pointMapping[k - 1]] =
                            point.dataLabel;
                    }
                    else {
                        point.y = point[position];
                        point.pivotLine = position;
                        point.plotY = point['plot' + position];
                        currentLabel = point['dataLabel' + position];
                        // Store previous label
                        if (k) {
                            point['dataLabel' + pointMapping[k - 1]] = point.dataLabel;
                        }
                        if (!point.dataLabels) {
                            point.dataLabels = [];
                        }
                        point.dataLabels[0] = point.dataLabel =
                            currentLabel =
                                currentLabel && currentLabel.element ?
                                    currentLabel :
                                    null;
                    }
                }
                super.drawDataLabels
                    .call(indicator);
            });
        }
    }
    getValues(series, params) {
        const period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, placement = this[params.algorithm + 'Placement'], 
        // 0- from, 1- to, 2- R1, 3- R2, 4- pivot, 5- S1 etc.
        PP = [], xData = [], yData = [];
        let endTimestamp, slicedXLen, slicedX, slicedY, lastPP, pivot, avg, i;
        // Pivot Points requires high, low and close values
        if (xVal.length < period ||
            !PivotPointsIndicator_isArray(yVal[0]) ||
            yVal[0].length !== 4) {
            return;
        }
        for (i = period + 1; i <= yValLen + period; i += period) {
            slicedX = xVal.slice(i - period - 1, i);
            slicedY = yVal.slice(i - period - 1, i);
            slicedXLen = slicedX.length;
            endTimestamp = slicedX[slicedXLen - 1];
            pivot = this.getPivotAndHLC(slicedY);
            avg = placement(pivot);
            lastPP = PP.push([endTimestamp]
                .concat(avg));
            xData.push(endTimestamp);
            yData.push(PP[lastPP - 1].slice(1));
        }
        // We don't know exact position in ordinal axis
        // So we use simple logic:
        // Get first point in last range, calculate visible average range
        // and multiply by period
        this.endPoint = slicedX[0] + ((endTimestamp - slicedX[0]) /
            slicedXLen) * period;
        return {
            values: PP,
            xData: xData,
            yData: yData
        };
    }
    getPivotAndHLC(values) {
        const close = values[values.length - 1][3];
        let high = -Infinity, low = Infinity;
        values.forEach(function (p) {
            high = Math.max(high, p[1]);
            low = Math.min(low, p[2]);
        });
        const pivot = (high + low + close) / 3;
        return [pivot, high, low, close];
    }
    standardPlacement(values) {
        const diff = values[1] - values[2], avg = [
            null,
            null,
            values[0] + diff,
            values[0] * 2 - values[2],
            values[0],
            values[0] * 2 - values[1],
            values[0] - diff,
            null,
            null
        ];
        return avg;
    }
    camarillaPlacement(values) {
        const diff = values[1] - values[2], avg = [
            values[3] + diff * 1.5,
            values[3] + diff * 1.25,
            values[3] + diff * 1.1666,
            values[3] + diff * 1.0833,
            values[0],
            values[3] - diff * 1.0833,
            values[3] - diff * 1.1666,
            values[3] - diff * 1.25,
            values[3] - diff * 1.5
        ];
        return avg;
    }
    fibonacciPlacement(values) {
        const diff = values[1] - values[2], avg = [
            null,
            values[0] + diff,
            values[0] + diff * 0.618,
            values[0] + diff * 0.382,
            values[0],
            values[0] - diff * 0.382,
            values[0] - diff * 0.618,
            values[0] - diff,
            null
        ];
        return avg;
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Pivot points indicator. This series requires the `linkedTo` option to be
 * set and should be loaded after `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/pivot-points
 *         Pivot points
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/pivot-points
 * @optionparent plotOptions.pivotpoints
 */
PivotPointsIndicator.defaultOptions = PivotPointsIndicator_merge(PivotPointsIndicator_SMAIndicator.defaultOptions, {
    /**
     * @excluding index
     */
    params: {
        index: void 0, // Unchangeable index, do not inherit (#15362)
        period: 28,
        /**
         * Algorithm used to calculate resistance and support lines based
         * on pivot points. Implemented algorithms: `'standard'`,
         * `'fibonacci'` and `'camarilla'`
         */
        algorithm: 'standard'
    },
    marker: {
        enabled: false
    },
    enableMouseTracking: false,
    dataLabels: {
        enabled: true,
        format: '{point.pivotLine}'
    },
    dataGrouping: {
        approximation: 'averages'
    }
});
PivotPointsIndicator_extend(PivotPointsIndicator.prototype, {
    nameBase: 'Pivot Points',
    pointArrayMap: ['R4', 'R3', 'R2', 'R1', 'P', 'S1', 'S2', 'S3', 'S4'],
    pointValKey: 'P',
    pointClass: PivotPoints_PivotPointsPoint
});
/* *
 *
 *  Registry
 *
 * */
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('pivotpoints', PivotPointsIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const PivotPoints_PivotPointsIndicator = ((/* unused pure expression or super */ null && (PivotPointsIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A pivot points indicator. If the [type](#series.pivotpoints.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.pivotpoints
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/pivot-points
 * @apioption series.pivotpoints
 */
''; // To include the above in the js output'

;// ./code/es-modules/Stock/Indicators/PPO/PPOIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { ema: PPOIndicator_EMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { correctFloat: PPOIndicator_correctFloat, extend: PPOIndicator_extend, merge: PPOIndicator_merge, error: PPOIndicator_error } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The PPO series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ppo
 *
 * @augments Highcharts.Series
 */
class PPOIndicator extends PPOIndicator_EMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const periods = params.periods, index = params.index, 
        // 0- date, 1- Percentage Price Oscillator
        PPO = [], xData = [], yData = [];
        let oscillator, i;
        // Check if periods are correct
        if (periods.length !== 2 || periods[1] <= periods[0]) {
            PPOIndicator_error('Error: "PPO requires two periods. Notice, first period ' +
                'should be lower than the second one."');
            return;
        }
        // Shorter Period EMA
        const SPE = super.getValues.call(this, series, {
            index: index,
            period: periods[0]
        });
        // Longer Period EMA
        const LPE = super.getValues.call(this, series, {
            index: index,
            period: periods[1]
        });
        // Check if ema is calculated properly, if not skip
        if (!SPE || !LPE) {
            return;
        }
        const periodsOffset = periods[1] - periods[0];
        for (i = 0; i < LPE.yData.length; i++) {
            oscillator = PPOIndicator_correctFloat((SPE.yData[i + periodsOffset] -
                LPE.yData[i]) /
                LPE.yData[i] *
                100);
            PPO.push([LPE.xData[i], oscillator]);
            xData.push(LPE.xData[i]);
            yData.push(oscillator);
        }
        return {
            values: PPO,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Percentage Price Oscillator. This series requires the
 * `linkedTo` option to be set and should be loaded after the
 * `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/ppo
 *         Percentage Price Oscillator
 *
 * @extends      plotOptions.ema
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/ppo
 * @optionparent plotOptions.ppo
 */
PPOIndicator.defaultOptions = PPOIndicator_merge(PPOIndicator_EMAIndicator.defaultOptions, {
    /**
     * Parameters used in calculation of Percentage Price Oscillator series
     * points.
     *
     * @excluding period
     */
    params: {
        period: void 0, // Unchangeable period, do not inherit (#15362)
        /**
         * Periods for Percentage Price Oscillator calculations.
         *
         * @type    {Array<number>}
         * @default [12, 26]
         */
        periods: [12, 26]
    }
});
PPOIndicator_extend(PPOIndicator.prototype, {
    nameBase: 'PPO',
    nameComponents: ['periods']
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('ppo', PPOIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const PPO_PPOIndicator = ((/* unused pure expression or super */ null && (PPOIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `Percentage Price Oscillator` series. If the [type](#series.ppo.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ppo
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/ppo
 * @apioption series.ppo
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/ArrayUtilities.js
/**
 *
 *  (c) 2010-2025 Pawel Fus & Daniel Studencki
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Functions
 *
 * */
/**
 * Get extremes of array filled by OHLC data.
 *
 * @private
 *
 * @param {Array<Array<number>>} arr
 * Array of OHLC points (arrays).
 *
 * @param {number} minIndex
 * Index of "low" value in point array.
 *
 * @param {number} maxIndex
 * Index of "high" value in point array.
 *
 * @return {Array<number,number>}
 * Returns array with min and max value.
 */
function getArrayExtremes(arr, minIndex, maxIndex) {
    return arr.reduce((prev, target) => [
        Math.min(prev[0], target[minIndex]),
        Math.max(prev[1], target[maxIndex])
    ], [Number.MAX_VALUE, -Number.MAX_VALUE]);
}
/* *
 *
 *  Default Export
 *
 * */
const ArrayUtilities = {
    getArrayExtremes
};
/* harmony default export */ const Indicators_ArrayUtilities = (ArrayUtilities);

;// ./code/es-modules/Core/Color/Palettes.js
/**
 * Series palettes for Highcharts. Series colors are defined in highcharts.css.
 * **Do not edit this file!** This file is generated using the 'gulp palette' task.
 * @private
 */
const SeriesPalettes = {
    /**
     * Colors for data series and points
     */
    colors: [
        '#2caffe',
        '#544fc5',
        '#00e272',
        '#fe6a35',
        '#6b8abc',
        '#d568fb',
        '#2ee0ca',
        '#fa4b42',
        '#feb56a',
        '#91e8e1'
    ],
};
/* harmony default export */ const Palettes = (SeriesPalettes);

;// ./code/es-modules/Stock/Indicators/PC/PCIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */





const { sma: PCIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { merge: PCIndicator_merge, extend: PCIndicator_extend } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Price Channel series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pc
 *
 * @augments Highcharts.Series
 */
class PCIndicator extends PCIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, 
        // 0- date, 1-top line, 2-middle line, 3-bottom line
        PC = [], 
        // Middle line, top line and bottom line
        low = 2, high = 1, xData = [], yData = [];
        let ML, TL, BL, date, slicedY, extremes, i;
        if (yValLen < period) {
            return;
        }
        for (i = period; i <= yValLen; i++) {
            date = xVal[i - 1];
            slicedY = yVal.slice(i - period, i);
            extremes = Indicators_ArrayUtilities.getArrayExtremes(slicedY, low, high);
            TL = extremes[1];
            BL = extremes[0];
            ML = (TL + BL) / 2;
            PC.push([date, TL, ML, BL]);
            xData.push(date);
            yData.push([TL, ML, BL]);
        }
        return {
            values: PC,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Price channel (PC). This series requires the `linkedTo` option to be
 * set and should be loaded after the `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/price-channel
 *         Price Channel
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/price-channel
 * @optionparent plotOptions.pc
 */
PCIndicator.defaultOptions = PCIndicator_merge(PCIndicator_SMAIndicator.defaultOptions, {
    /**
     * Option for fill color between lines in Price channel Indicator.
     *
     * @sample {highstock} stock/indicators/indicator-area-fill
     *      background fill between lines
     *
     * @type {Highcharts.Color}
     * @apioption plotOptions.pc.fillColor
     *
     */
    /**
     * @excluding index
     */
    params: {
        index: void 0, // Unchangeable index, do not inherit (#15362)
        period: 20
    },
    lineWidth: 1,
    topLine: {
        styles: {
            /**
             * Color of the top line. If not set, it's inherited from
             * [plotOptions.pc.color](#plotOptions.pc.color).
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: Palettes.colors[2],
            /**
             * Pixel width of the line.
             */
            lineWidth: 1
        }
    },
    bottomLine: {
        styles: {
            /**
             * Color of the bottom line. If not set, it's inherited from
             * [plotOptions.pc.color](#plotOptions.pc.color).
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: Palettes.colors[8],
            /**
             * Pixel width of the line.
             */
            lineWidth: 1
        }
    },
    dataGrouping: {
        approximation: 'averages'
    }
});
PCIndicator_extend(PCIndicator.prototype, {
    areaLinesNames: ['top', 'bottom'],
    nameBase: 'Price Channel',
    nameComponents: ['period'],
    linesApiNames: ['topLine', 'bottomLine'],
    pointArrayMap: ['top', 'middle', 'bottom'],
    pointValKey: 'middle'
});
Indicators_MultipleLinesComposition.compose(PCIndicator);
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('pc', PCIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const PC_PCIndicator = ((/* unused pure expression or super */ null && (PCIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A Price channel indicator. If the [type](#series.pc.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends      series,plotOptions.pc
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *               joinBy, keys, navigatorOptions, pointInterval,
 *               pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *               showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/price-channel
 * @apioption    series.pc
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/PriceEnvelopes/PriceEnvelopesIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */



const { sma: PriceEnvelopesIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: PriceEnvelopesIndicator_extend, isArray: PriceEnvelopesIndicator_isArray, merge: PriceEnvelopesIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Price Envelopes series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.priceenvelopes
 *
 * @augments Highcharts.Series
 */
class PriceEnvelopesIndicator extends PriceEnvelopesIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    init() {
        super.init.apply(this, arguments);
        // Set default color for lines:
        this.options = PriceEnvelopesIndicator_merge({
            topLine: {
                styles: {
                    lineColor: this.color
                }
            },
            bottomLine: {
                styles: {
                    lineColor: this.color
                }
            }
        }, this.options);
    }
    getValues(series, params) {
        const period = params.period, topPercent = params.topBand, botPercent = params.bottomBand, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, 
        // 0- date, 1-top line, 2-middle line, 3-bottom line
        PE = [], 
        // Middle line, top line and bottom line
        xData = [], yData = [];
        let ML, TL, BL, date, slicedX, slicedY, point, i;
        // Price envelopes requires close value
        if (xVal.length < period ||
            !PriceEnvelopesIndicator_isArray(yVal[0]) ||
            yVal[0].length !== 4) {
            return;
        }
        for (i = period; i <= yValLen; i++) {
            slicedX = xVal.slice(i - period, i);
            slicedY = yVal.slice(i - period, i);
            point = super.getValues({
                xData: slicedX,
                yData: slicedY
            }, params);
            date = point.xData[0];
            ML = point.yData[0];
            TL = ML * (1 + topPercent);
            BL = ML * (1 - botPercent);
            PE.push([date, TL, ML, BL]);
            xData.push(date);
            yData.push([TL, ML, BL]);
        }
        return {
            values: PE,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Price envelopes indicator based on [SMA](#plotOptions.sma) calculations.
 * This series requires the `linkedTo` option to be set and should be loaded
 * after the `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/price-envelopes
 *         Price envelopes
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/price-envelopes
 * @optionparent plotOptions.priceenvelopes
 */
PriceEnvelopesIndicator.defaultOptions = PriceEnvelopesIndicator_merge(PriceEnvelopesIndicator_SMAIndicator.defaultOptions, {
    marker: {
        enabled: false
    },
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Top: {point.top}<br/>Middle: {point.middle}<br/>Bottom: {point.bottom}<br/>'
    },
    params: {
        period: 20,
        /**
         * Percentage above the moving average that should be displayed.
         * 0.1 means 110%. Relative to the calculated value.
         */
        topBand: 0.1,
        /**
         * Percentage below the moving average that should be displayed.
         * 0.1 means 90%. Relative to the calculated value.
         */
        bottomBand: 0.1
    },
    /**
     * Bottom line options.
     */
    bottomLine: {
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line. If not set, it's inherited from
             * [plotOptions.priceenvelopes.color](
             * #plotOptions.priceenvelopes.color).
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    /**
     * Top line options.
     *
     * @extends plotOptions.priceenvelopes.bottomLine
     */
    topLine: {
        styles: {
            lineWidth: 1
        }
    },
    dataGrouping: {
        approximation: 'averages'
    }
    /**
     * Option for fill color between lines in Price Envelopes Indicator.
     *
     * @sample {highstock} stock/indicators/indicator-area-fill
     *      Background fill between lines.
     *
     * @type      {Highcharts.Color}
     * @since 11.0.0
     * @apioption plotOptions.priceenvelopes.fillColor
     *
     */
});
PriceEnvelopesIndicator_extend(PriceEnvelopesIndicator.prototype, {
    areaLinesNames: ['top', 'bottom'],
    linesApiNames: ['topLine', 'bottomLine'],
    nameComponents: ['period', 'topBand', 'bottomBand'],
    nameBase: 'Price envelopes',
    pointArrayMap: ['top', 'middle', 'bottom'],
    parallelArrays: ['x', 'y', 'top', 'bottom'],
    pointValKey: 'middle'
});
Indicators_MultipleLinesComposition.compose(PriceEnvelopesIndicator);
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('priceenvelopes', PriceEnvelopesIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const PriceEnvelopes_PriceEnvelopesIndicator = ((/* unused pure expression or super */ null && (PriceEnvelopesIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A price envelopes indicator. If the [type](#series.priceenvelopes.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.priceenvelopes
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/price-envelopes
 * @apioption series.priceenvelopes
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/PSAR/PSARIndicator.js
/* *
 *
 *  Parabolic SAR indicator for Highcharts Stock
 *
 *  (c) 2010-2025 Grzegorz Blachliński
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: PSARIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { merge: PSARIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Functions
 *
 * */
// Utils:
/**
 *
 */
function PSARIndicator_toFixed(a, n) {
    return parseFloat(a.toFixed(n));
}
/**
 *
 */
function calculateDirection(previousDirection, low, high, PSAR) {
    if ((previousDirection === 1 && low > PSAR) ||
        (previousDirection === -1 && high > PSAR)) {
        return 1;
    }
    return -1;
}
/* *
 * Method for calculating acceleration factor
 * dir - direction
 * pDir - previous Direction
 * eP - extreme point
 * pEP - previous extreme point
 * inc - increment for acceleration factor
 * maxAcc - maximum acceleration factor
 * initAcc - initial acceleration factor
 */
/**
 *
 */
function getAccelerationFactor(dir, pDir, eP, pEP, pAcc, inc, maxAcc, initAcc) {
    if (dir === pDir) {
        if (dir === 1 && (eP > pEP)) {
            return (pAcc === maxAcc) ? maxAcc : PSARIndicator_toFixed(pAcc + inc, 2);
        }
        if (dir === -1 && (eP < pEP)) {
            return (pAcc === maxAcc) ? maxAcc : PSARIndicator_toFixed(pAcc + inc, 2);
        }
        return pAcc;
    }
    return initAcc;
}
/**
 *
 */
function getExtremePoint(high, low, previousDirection, previousExtremePoint) {
    if (previousDirection === 1) {
        return (high > previousExtremePoint) ? high : previousExtremePoint;
    }
    return (low < previousExtremePoint) ? low : previousExtremePoint;
}
/**
 *
 */
function getEPMinusPSAR(EP, PSAR) {
    return EP - PSAR;
}
/**
 *
 */
function getAccelerationFactorMultiply(accelerationFactor, EPMinusSAR) {
    return accelerationFactor * EPMinusSAR;
}
/* *
 * Method for calculating PSAR
 * pdir - previous direction
 * sDir - second previous Direction
 * PSAR - previous PSAR
 * pACCMultiply - previous acceleration factor multiply
 * sLow - second previous low
 * pLow - previous low
 * sHigh - second previous high
 * pHigh - previous high
 * pEP - previous extreme point
 */
/**
 *
 */
function getPSAR(pdir, sDir, PSAR, pACCMulti, sLow, pLow, pHigh, sHigh, pEP) {
    if (pdir === sDir) {
        if (pdir === 1) {
            return (PSAR + pACCMulti < Math.min(sLow, pLow)) ?
                PSAR + pACCMulti :
                Math.min(sLow, pLow);
        }
        return (PSAR + pACCMulti > Math.max(sHigh, pHigh)) ?
            PSAR + pACCMulti :
            Math.max(sHigh, pHigh);
    }
    return pEP;
}
/* *
 *
 *  Class
 *
 * */
/**
 * The Parabolic SAR series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.psar
 *
 * @augments Highcharts.Series
 */
class PSARIndicator extends PSARIndicator_SMAIndicator {
    constructor() {
        /* *
         *
         *  Static Properties
         *
         * */
        super(...arguments);
        this.nameComponents = void 0;
    }
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const xVal = series.xData, yVal = series.yData, maxAccelerationFactor = params.maxAccelerationFactor, increment = params.increment, 
        // Set initial acc factor (for every new trend!)
        initialAccelerationFactor = params.initialAccelerationFactor, decimals = params.decimals, index = params.index, PSARArr = [], xData = [], yData = [];
        let accelerationFactor = params.initialAccelerationFactor, direction, 
        // Extreme point is the lowest low for falling and highest high
        // for rising psar - and we are starting with falling
        extremePoint = yVal[0][1], EPMinusPSAR, accelerationFactorMultiply, newDirection, previousDirection = 1, prevLow, prevPrevLow, prevHigh, prevPrevHigh, PSAR = yVal[0][2], newExtremePoint, high, low, ind;
        if (index >= yVal.length) {
            return;
        }
        for (ind = 0; ind < index; ind++) {
            extremePoint = Math.max(yVal[ind][1], extremePoint);
            PSAR = Math.min(yVal[ind][2], PSARIndicator_toFixed(PSAR, decimals));
        }
        direction = (yVal[ind][1] > PSAR) ? 1 : -1;
        EPMinusPSAR = getEPMinusPSAR(extremePoint, PSAR);
        accelerationFactor = params.initialAccelerationFactor;
        accelerationFactorMultiply = getAccelerationFactorMultiply(accelerationFactor, EPMinusPSAR);
        PSARArr.push([xVal[index], PSAR]);
        xData.push(xVal[index]);
        yData.push(PSARIndicator_toFixed(PSAR, decimals));
        for (ind = index + 1; ind < yVal.length; ind++) {
            prevLow = yVal[ind - 1][2];
            prevPrevLow = yVal[ind - 2][2];
            prevHigh = yVal[ind - 1][1];
            prevPrevHigh = yVal[ind - 2][1];
            high = yVal[ind][1];
            low = yVal[ind][2];
            // Null points break PSAR
            if (prevPrevLow !== null &&
                prevPrevHigh !== null &&
                prevLow !== null &&
                prevHigh !== null &&
                high !== null &&
                low !== null) {
                PSAR = getPSAR(direction, previousDirection, PSAR, accelerationFactorMultiply, prevPrevLow, prevLow, prevHigh, prevPrevHigh, extremePoint);
                newExtremePoint = getExtremePoint(high, low, direction, extremePoint);
                newDirection = calculateDirection(previousDirection, low, high, PSAR);
                accelerationFactor = getAccelerationFactor(newDirection, direction, newExtremePoint, extremePoint, accelerationFactor, increment, maxAccelerationFactor, initialAccelerationFactor);
                EPMinusPSAR = getEPMinusPSAR(newExtremePoint, PSAR);
                accelerationFactorMultiply = getAccelerationFactorMultiply(accelerationFactor, EPMinusPSAR);
                PSARArr.push([xVal[ind], PSARIndicator_toFixed(PSAR, decimals)]);
                xData.push(xVal[ind]);
                yData.push(PSARIndicator_toFixed(PSAR, decimals));
                previousDirection = direction;
                direction = newDirection;
                extremePoint = newExtremePoint;
            }
        }
        return {
            values: PSARArr,
            xData: xData,
            yData: yData
        };
    }
}
/**
 * Parabolic SAR. This series requires `linkedTo`
 * option to be set and should be loaded
 * after `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/psar
 *         Parabolic SAR Indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/psar
 * @optionparent plotOptions.psar
 */
PSARIndicator.defaultOptions = PSARIndicator_merge(PSARIndicator_SMAIndicator.defaultOptions, {
    lineWidth: 0,
    marker: {
        enabled: true
    },
    states: {
        hover: {
            lineWidthPlus: 0
        }
    },
    /**
     * @excluding period
     */
    params: {
        period: void 0, // Unchangeable period, do not inherit (#15362)
        /**
         * The initial value for acceleration factor.
         * Acceleration factor is starting with this value
         * and increases by specified increment each time
         * the extreme point makes a new high.
         * AF can reach a maximum of maxAccelerationFactor,
         * no matter how long the uptrend extends.
         */
        initialAccelerationFactor: 0.02,
        /**
         * The Maximum value for acceleration factor.
         * AF can reach a maximum of maxAccelerationFactor,
         * no matter how long the uptrend extends.
         */
        maxAccelerationFactor: 0.2,
        /**
         * Acceleration factor increases by increment each time
         * the extreme point makes a new high.
         *
         * @since 6.0.0
         */
        increment: 0.02,
        /**
         * Index from which PSAR is starting calculation
         *
         * @since 6.0.0
         */
        index: 2,
        /**
         * Number of maximum decimals that are used in PSAR calculations.
         *
         * @since 6.0.0
         */
        decimals: 4
    }
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('psar', PSARIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const PSAR_PSARIndicator = ((/* unused pure expression or super */ null && (PSARIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `PSAR` series. If the [type](#series.psar.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.psar
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/psar
 * @apioption series.psar
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/ROC/ROCIndicator.js
/* *
 *
 *  (c) 2010-2025 Kacper Madej
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: ROCIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { isArray: ROCIndicator_isArray, merge: ROCIndicator_merge, extend: ROCIndicator_extend } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Functions
 *
 * */
// Utils:
/**
 *
 */
function ROCIndicator_populateAverage(xVal, yVal, i, period, index) {
    /* Calculated as:

       (Closing Price [today] - Closing Price [n days ago]) /
        Closing Price [n days ago] * 100

       Return y as null when avoiding division by zero */
    let nDaysAgoY, rocY;
    if (index < 0) {
        // Y data given as an array of values
        nDaysAgoY = yVal[i - period];
        rocY = nDaysAgoY ?
            (yVal[i] - nDaysAgoY) / nDaysAgoY * 100 :
            null;
    }
    else {
        // Y data given as an array of arrays and the index should be used
        nDaysAgoY = yVal[i - period][index];
        rocY = nDaysAgoY ?
            (yVal[i][index] - nDaysAgoY) / nDaysAgoY * 100 :
            null;
    }
    return [xVal[i], rocY];
}
/* *
 *
 *  Class
 *
 * */
/**
 * The ROC series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.roc
 *
 * @augments Highcharts.Series
 */
class ROCIndicator extends ROCIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, ROC = [], xData = [], yData = [];
        let i, index = -1, ROCPoint;
        // Period is used as a number of time periods ago, so we need more
        // (at least 1 more) data than the period value
        if (xVal.length <= period) {
            return;
        }
        // Switch index for OHLC / Candlestick / Arearange
        if (ROCIndicator_isArray(yVal[0])) {
            index = params.index;
        }
        // I = period <-- skip first N-points
        // Calculate value one-by-one for each period in visible data
        for (i = period; i < yValLen; i++) {
            ROCPoint = ROCIndicator_populateAverage(xVal, yVal, i, period, index);
            ROC.push(ROCPoint);
            xData.push(ROCPoint[0]);
            yData.push(ROCPoint[1]);
        }
        return {
            values: ROC,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Rate of change indicator (ROC). The indicator value for each point
 * is defined as:
 *
 * `(C - Cn) / Cn * 100`
 *
 * where: `C` is the close value of the point of the same x in the
 * linked series and `Cn` is the close value of the point `n` periods
 * ago. `n` is set through [period](#plotOptions.roc.params.period).
 *
 * This series requires `linkedTo` option to be set.
 *
 * @sample stock/indicators/roc
 *         Rate of change indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/roc
 * @optionparent plotOptions.roc
 */
ROCIndicator.defaultOptions = ROCIndicator_merge(ROCIndicator_SMAIndicator.defaultOptions, {
    params: {
        index: 3,
        period: 9
    }
});
ROCIndicator_extend(ROCIndicator.prototype, {
    nameBase: 'Rate of Change'
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('roc', ROCIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const ROC_ROCIndicator = ((/* unused pure expression or super */ null && (ROCIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `ROC` series. If the [type](#series.wma.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * Rate of change indicator (ROC). The indicator value for each point
 * is defined as:
 *
 * `(C - Cn) / Cn * 100`
 *
 * where: `C` is the close value of the point of the same x in the
 * linked series and `Cn` is the close value of the point `n` periods
 * ago. `n` is set through [period](#series.roc.params.period).
 *
 * This series requires `linkedTo` option to be set.
 *
 * @extends   series,plotOptions.roc
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/roc
 * @apioption series.roc
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/RSI/RSIIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: RSIIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { isNumber: RSIIndicator_isNumber, merge: RSIIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Functions
 *
 * */
// Utils:
/**
 *
 */
function RSIIndicator_toFixed(a, n) {
    return parseFloat(a.toFixed(n));
}
/* *
 *
 *  Class
 *
 * */
/**
 * The RSI series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.rsi
 *
 * @augments Highcharts.Series
 */
class RSIIndicator extends RSIIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, decimals = params.decimals, 
        // RSI starts calculations from the second point
        // Cause we need to calculate change between two points
        RSI = [], xData = [], yData = [];
        let gain = 0, loss = 0, index = params.index, range = 1, RSIPoint, change, avgGain, avgLoss, i, values;
        if ((xVal.length < period)) {
            return;
        }
        if (RSIIndicator_isNumber(yVal[0])) {
            values = yVal;
        }
        else {
            // In case of the situation, where the series type has data length
            // longer then 4 (HLC, range), this ensures that we are not trying
            // to reach the index out of bounds
            index = Math.min(index, yVal[0].length - 1);
            values = yVal
                .map((value) => value[index]);
        }
        // Calculate changes for first N points
        while (range < period) {
            change = RSIIndicator_toFixed(values[range] - values[range - 1], decimals);
            if (change > 0) {
                gain += change;
            }
            else {
                loss += Math.abs(change);
            }
            range++;
        }
        // Average for first n-1 points:
        avgGain = RSIIndicator_toFixed(gain / (period - 1), decimals);
        avgLoss = RSIIndicator_toFixed(loss / (period - 1), decimals);
        for (i = range; i < yValLen; i++) {
            change = RSIIndicator_toFixed(values[i] - values[i - 1], decimals);
            if (change > 0) {
                gain = change;
                loss = 0;
            }
            else {
                gain = 0;
                loss = Math.abs(change);
            }
            // Calculate smoothed averages, RS, RSI values:
            avgGain = RSIIndicator_toFixed((avgGain * (period - 1) + gain) / period, decimals);
            avgLoss = RSIIndicator_toFixed((avgLoss * (period - 1) + loss) / period, decimals);
            // If average-loss is equal zero, then by definition RSI is set
            // to 100:
            if (avgLoss === 0) {
                RSIPoint = 100;
                // If average-gain is equal zero, then by definition RSI is set
                // to 0:
            }
            else if (avgGain === 0) {
                RSIPoint = 0;
            }
            else {
                RSIPoint = RSIIndicator_toFixed(100 - (100 / (1 + (avgGain / avgLoss))), decimals);
            }
            RSI.push([xVal[i], RSIPoint]);
            xData.push(xVal[i]);
            yData.push(RSIPoint);
        }
        return {
            values: RSI,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Relative strength index (RSI) technical indicator. This series
 * requires the `linkedTo` option to be set and should be loaded after
 * the `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/rsi
 *         RSI indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/rsi
 * @optionparent plotOptions.rsi
 */
RSIIndicator.defaultOptions = RSIIndicator_merge(RSIIndicator_SMAIndicator.defaultOptions, {
    params: {
        decimals: 4,
        index: 3
    }
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('rsi', RSIIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const RSI_RSIIndicator = ((/* unused pure expression or super */ null && (RSIIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `RSI` series. If the [type](#series.rsi.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.rsi
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/rsi
 * @apioption series.rsi
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/Stochastic/StochasticIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */




const { sma: StochasticIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: StochasticIndicator_extend, isArray: StochasticIndicator_isArray, merge: StochasticIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Stochastic series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.stochastic
 *
 * @augments Highcharts.Series
 */
class StochasticIndicator extends StochasticIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    init() {
        super.init.apply(this, arguments);
        // Set default color for lines:
        this.options = StochasticIndicator_merge({
            smoothedLine: {
                styles: {
                    lineColor: this.color
                }
            }
        }, this.options);
    }
    getValues(series, params) {
        const periodK = params.periods[0], periodD = params.periods[1], xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, 
        // 0- date, 1-%K, 2-%D
        SO = [], xData = [], yData = [], close = 3, low = 2, high = 1;
        let slicedY, CL, HL, LL, K, D = null, points, extremes, i;
        // Stochastic requires close value
        if (yValLen < periodK ||
            !StochasticIndicator_isArray(yVal[0]) ||
            yVal[0].length !== 4) {
            return;
        }
        // If the value of initial points is constant, wait until it changes
        // to calculate correct Stochastic values
        let constantValues = true, j = 0;
        // For a N-period, we start from N-1 point, to calculate Nth point
        // That is why we later need to comprehend slice() elements list
        // with (+1)
        for (i = periodK - 1; i < yValLen; i++) {
            slicedY = yVal.slice(i - periodK + 1, i + 1);
            // Calculate %K
            extremes = Indicators_ArrayUtilities.getArrayExtremes(slicedY, low, high);
            LL = extremes[0]; // Lowest low in %K periods
            CL = yVal[i][close] - LL;
            HL = extremes[1] - LL;
            K = CL / HL * 100;
            if (isNaN(K) && constantValues) {
                j++;
                continue;
            }
            else if (constantValues && !isNaN(K)) {
                constantValues = false;
            }
            const length = xData.push(xVal[i]);
            // If N-period previous values are constant which results in NaN %K,
            // we need to use previous %K value if it is a number,
            // otherwise we should use null
            if (isNaN(K)) {
                yData.push([
                    yData[length - 2] &&
                        typeof yData[length - 2][0] === 'number' ?
                        yData[length - 2][0] : null,
                    null
                ]);
            }
            else {
                yData.push([K, null]);
            }
            // Calculate smoothed %D, which is SMA of %K
            if (i >= j + (periodK - 1) + (periodD - 1)) {
                points = super.getValues({
                    xData: xData.slice(-periodD),
                    yData: yData.slice(-periodD)
                }, {
                    period: periodD
                });
                D = points.yData[0];
            }
            SO.push([xVal[i], K, D]);
            yData[length - 1][1] = D;
        }
        return {
            values: SO,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Stochastic oscillator. This series requires the `linkedTo` option to be
 * set and should be loaded after the `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/stochastic
 *         Stochastic oscillator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/stochastic
 * @optionparent plotOptions.stochastic
 */
StochasticIndicator.defaultOptions = StochasticIndicator_merge(StochasticIndicator_SMAIndicator.defaultOptions, {
    /**
     * @excluding index, period
     */
    params: {
        // Index and period are unchangeable, do not inherit (#15362)
        index: void 0,
        period: void 0,
        /**
         * Periods for Stochastic oscillator: [%K, %D].
         *
         * @type    {Array<number,number>}
         * @default [14, 3]
         */
        periods: [14, 3]
    },
    marker: {
        enabled: false
    },
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>%K: {point.y}<br/>%D: {point.smoothed}<br/>'
    },
    /**
     * Smoothed line options.
     */
    smoothedLine: {
        /**
         * Styles for a smoothed line.
         */
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line. If not set, it's inherited from
             * [plotOptions.stochastic.color
             * ](#plotOptions.stochastic.color).
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    dataGrouping: {
        approximation: 'averages'
    }
});
StochasticIndicator_extend(StochasticIndicator.prototype, {
    areaLinesNames: [],
    nameComponents: ['periods'],
    nameBase: 'Stochastic',
    pointArrayMap: ['y', 'smoothed'],
    parallelArrays: ['x', 'y', 'smoothed'],
    pointValKey: 'y',
    linesApiNames: ['smoothedLine']
});
Indicators_MultipleLinesComposition.compose(StochasticIndicator);
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('stochastic', StochasticIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const Stochastic_StochasticIndicator = ((/* unused pure expression or super */ null && (StochasticIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A Stochastic indicator. If the [type](#series.stochastic.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.stochastic
 * @since     6.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis,  dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/stochastic
 * @apioption series.stochastic
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/SlowStochastic/SlowStochasticIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: SlowStochasticIndicator_SMAIndicator, stochastic: SlowStochasticIndicator_StochasticIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: SlowStochasticIndicator_extend, merge: SlowStochasticIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Slow Stochastic series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.slowstochastic
 *
 * @augments Highcharts.Series
 */
class SlowStochasticIndicator extends SlowStochasticIndicator_StochasticIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const periods = params.periods, fastValues = super.getValues.call(this, series, params), slowValues = {
            values: [],
            xData: [],
            yData: []
        };
        if (!fastValues) {
            return;
        }
        slowValues.xData = fastValues.xData.slice(periods[1] - 1);
        const fastYData = fastValues.yData.slice(periods[1] - 1);
        // Get SMA(%D)
        const smoothedValues = SlowStochasticIndicator_SMAIndicator.prototype.getValues.call(this, {
            xData: slowValues.xData,
            yData: fastYData
        }, {
            index: 1,
            period: periods[2]
        });
        if (!smoothedValues) {
            return;
        }
        // Format data
        for (let i = 0, xDataLen = slowValues.xData.length; i < xDataLen; i++) {
            slowValues.yData[i] = [
                fastYData[i][1],
                smoothedValues.yData[i - periods[2] + 1] || null
            ];
            slowValues.values[i] = [
                slowValues.xData[i],
                fastYData[i][1],
                smoothedValues.yData[i - periods[2] + 1] || null
            ];
        }
        return slowValues;
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Slow Stochastic oscillator. This series requires the `linkedTo` option
 * to be set and should be loaded after `stock/indicators/indicators.js`
 * and `stock/indicators/stochastic.js` files.
 *
 * @sample stock/indicators/slow-stochastic
 *         Slow Stochastic oscillator
 *
 * @extends      plotOptions.stochastic
 * @since        8.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/stochastic
 * @requires     stock/indicators/slow-stochastic
 * @optionparent plotOptions.slowstochastic
 */
SlowStochasticIndicator.defaultOptions = SlowStochasticIndicator_merge(SlowStochasticIndicator_StochasticIndicator.defaultOptions, {
    params: {
        /**
         * Periods for Slow Stochastic oscillator: [%K, %D, SMA(%D)].
         *
         * @type    {Array<number,number,number>}
         * @default [14, 3, 3]
         */
        periods: [14, 3, 3]
    }
});
SlowStochasticIndicator_extend(SlowStochasticIndicator.prototype, {
    nameBase: 'Slow Stochastic'
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('slowstochastic', SlowStochasticIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const SlowStochastic_SlowStochasticIndicator = ((/* unused pure expression or super */ null && (SlowStochasticIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A Slow Stochastic indicator. If the [type](#series.slowstochastic.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.slowstochastic
 * @since     8.0.0
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/stochastic
 * @requires  stock/indicators/slow-stochastic
 * @apioption series.slowstochastic
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/Supertrend/SupertrendIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { atr: SupertrendIndicator_ATRIndicator, sma: SupertrendIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { addEvent: SupertrendIndicator_addEvent, correctFloat: SupertrendIndicator_correctFloat, isArray: SupertrendIndicator_isArray, isNumber: SupertrendIndicator_isNumber, extend: SupertrendIndicator_extend, merge: SupertrendIndicator_merge, objectEach: SupertrendIndicator_objectEach } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Functions
 *
 * */
// Utils:
/**
 * @private
 */
function createPointObj(mainSeries, index) {
    return {
        index,
        close: mainSeries.getColumn('close')[index],
        x: mainSeries.getColumn('x')[index]
    };
}
/* *
 *
 *  Class
 *
 * */
/**
 * The Supertrend series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.supertrend
 *
 * @augments Highcharts.Series
 */
class SupertrendIndicator extends SupertrendIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    init() {
        const indicator = this;
        super.init.apply(indicator, arguments);
        // Only after series are linked add some additional logic/properties.
        const unbinder = SupertrendIndicator_addEvent(this.chart.constructor, 'afterLinkSeries', () => {
            // Protection for a case where the indicator is being updated,
            // for a brief moment the indicator is deleted.
            if (indicator.options) {
                const options = indicator.options, parentOptions = indicator.linkedParent.options;
                // Indicator cropThreshold has to be equal linked series one
                // reduced by period due to points comparison in drawGraph
                // (#9787)
                options.cropThreshold = (parentOptions.cropThreshold -
                    (options.params.period - 1));
            }
            unbinder();
        }, {
            order: 1
        });
    }
    drawGraph() {
        const indicator = this, indicOptions = indicator.options, 
        // Series that indicator is linked to
        mainSeries = indicator.linkedParent, mainXData = mainSeries.getColumn('x'), mainLinePoints = (mainSeries ? mainSeries.points : []), indicPoints = indicator.points, indicPath = indicator.graph, 
        // Points offset between lines
        tempOffset = mainLinePoints.length - indicPoints.length, offset = tempOffset > 0 ? tempOffset : 0, 
        // @todo: fix when ichi-moku indicator is merged to master.
        gappedExtend = {
            options: {
                gapSize: indicOptions.gapSize
            }
        }, 
        // Sorted supertrend points array
        groupedPoints = {
            top: [], // Rising trend line points
            bottom: [], // Falling trend line points
            intersect: [] // Change trend line points
        }, 
        // Options for trend lines
        supertrendLineOptions = {
            top: {
                styles: {
                    lineWidth: indicOptions.lineWidth,
                    lineColor: (indicOptions.fallingTrendColor ||
                        indicOptions.color),
                    dashStyle: indicOptions.dashStyle
                }
            },
            bottom: {
                styles: {
                    lineWidth: indicOptions.lineWidth,
                    lineColor: (indicOptions.risingTrendColor ||
                        indicOptions.color),
                    dashStyle: indicOptions.dashStyle
                }
            },
            intersect: indicOptions.changeTrendLine
        };
        let // Supertrend line point
        point, 
        // Supertrend line next point (has smaller x pos than point)
        nextPoint, 
        // Main series points
        mainPoint, nextMainPoint, 
        // Used when supertrend and main points are shifted
        // relative to each other
        prevMainPoint, prevPrevMainPoint, 
        // Used when particular point color is set
        pointColor, 
        // Temporary points that fill groupedPoints array
        newPoint, newNextPoint, indicPointsLen = indicPoints.length;
        // Loop which sort supertrend points
        while (indicPointsLen--) {
            point = indicPoints[indicPointsLen];
            nextPoint = indicPoints[indicPointsLen - 1];
            mainPoint = mainLinePoints[indicPointsLen - 1 + offset];
            nextMainPoint = mainLinePoints[indicPointsLen - 2 + offset];
            prevMainPoint = mainLinePoints[indicPointsLen + offset];
            prevPrevMainPoint = mainLinePoints[indicPointsLen + offset + 1];
            pointColor = point.options.color;
            newPoint = {
                x: point.x,
                plotX: point.plotX,
                plotY: point.plotY,
                isNull: false
            };
            // When mainPoint is the last one (left plot area edge)
            // but supertrend has additional one
            if (!nextMainPoint &&
                mainPoint &&
                SupertrendIndicator_isNumber(mainXData[mainPoint.index - 1])) {
                nextMainPoint = createPointObj(mainSeries, mainPoint.index - 1);
            }
            // When prevMainPoint is the last one (right plot area edge)
            // but supertrend has additional one (and points are shifted)
            if (!prevPrevMainPoint &&
                prevMainPoint &&
                SupertrendIndicator_isNumber(mainXData[prevMainPoint.index + 1])) {
                prevPrevMainPoint = createPointObj(mainSeries, prevMainPoint.index + 1);
            }
            // When points are shifted (right or left plot area edge)
            if (!mainPoint &&
                nextMainPoint &&
                SupertrendIndicator_isNumber(mainXData[nextMainPoint.index + 1])) {
                mainPoint = createPointObj(mainSeries, nextMainPoint.index + 1);
            }
            else if (!mainPoint &&
                prevMainPoint &&
                SupertrendIndicator_isNumber(mainXData[prevMainPoint.index - 1])) {
                mainPoint = createPointObj(mainSeries, prevMainPoint.index - 1);
            }
            // Check if points are shifted relative to each other
            if (point &&
                mainPoint &&
                prevMainPoint &&
                nextMainPoint &&
                point.x !== mainPoint.x) {
                if (point.x === prevMainPoint.x) {
                    nextMainPoint = mainPoint;
                    mainPoint = prevMainPoint;
                }
                else if (point.x === nextMainPoint.x) {
                    mainPoint = nextMainPoint;
                    nextMainPoint = {
                        close: mainSeries.getColumn('close')[mainPoint.index - 1],
                        x: mainXData[mainPoint.index - 1]
                    };
                }
                else if (prevPrevMainPoint && point.x === prevPrevMainPoint.x) {
                    mainPoint = prevPrevMainPoint;
                    nextMainPoint = prevMainPoint;
                }
            }
            if (nextPoint && nextMainPoint && mainPoint) {
                newNextPoint = {
                    x: nextPoint.x,
                    plotX: nextPoint.plotX,
                    plotY: nextPoint.plotY,
                    isNull: false
                };
                if (point.y >= mainPoint.close &&
                    nextPoint.y >= nextMainPoint.close) {
                    point.color = (pointColor || indicOptions.fallingTrendColor ||
                        indicOptions.color);
                    groupedPoints.top.push(newPoint);
                }
                else if (point.y < mainPoint.close &&
                    nextPoint.y < nextMainPoint.close) {
                    point.color = (pointColor || indicOptions.risingTrendColor ||
                        indicOptions.color);
                    groupedPoints.bottom.push(newPoint);
                }
                else {
                    groupedPoints.intersect.push(newPoint);
                    groupedPoints.intersect.push(newNextPoint);
                    // Additional null point to make a gap in line
                    groupedPoints.intersect.push(SupertrendIndicator_merge(newNextPoint, {
                        isNull: true
                    }));
                    if (point.y >= mainPoint.close &&
                        nextPoint.y < nextMainPoint.close) {
                        point.color = (pointColor || indicOptions.fallingTrendColor ||
                            indicOptions.color);
                        nextPoint.color = (pointColor || indicOptions.risingTrendColor ||
                            indicOptions.color);
                        groupedPoints.top.push(newPoint);
                        groupedPoints.top.push(SupertrendIndicator_merge(newNextPoint, {
                            isNull: true
                        }));
                    }
                    else if (point.y < mainPoint.close &&
                        nextPoint.y >= nextMainPoint.close) {
                        point.color = (pointColor || indicOptions.risingTrendColor ||
                            indicOptions.color);
                        nextPoint.color = (pointColor || indicOptions.fallingTrendColor ||
                            indicOptions.color);
                        groupedPoints.bottom.push(newPoint);
                        groupedPoints.bottom.push(SupertrendIndicator_merge(newNextPoint, {
                            isNull: true
                        }));
                    }
                }
            }
            else if (mainPoint) {
                if (point.y >= mainPoint.close) {
                    point.color = (pointColor || indicOptions.fallingTrendColor ||
                        indicOptions.color);
                    groupedPoints.top.push(newPoint);
                }
                else {
                    point.color = (pointColor || indicOptions.risingTrendColor ||
                        indicOptions.color);
                    groupedPoints.bottom.push(newPoint);
                }
            }
        }
        // Generate lines:
        SupertrendIndicator_objectEach(groupedPoints, function (values, lineName) {
            indicator.points = values;
            indicator.options = SupertrendIndicator_merge(supertrendLineOptions[lineName].styles, gappedExtend);
            indicator.graph = indicator['graph' + lineName + 'Line'];
            SupertrendIndicator_SMAIndicator.prototype.drawGraph.call(indicator);
            // Now save line
            indicator['graph' + lineName + 'Line'] = indicator.graph;
        });
        // Restore options:
        indicator.points = indicPoints;
        indicator.options = indicOptions;
        indicator.graph = indicPath;
    }
    // Supertrend (Multiplier, Period) Formula:
    // BASIC UPPERBAND = (HIGH + LOW) / 2 + Multiplier * ATR(Period)
    // BASIC LOWERBAND = (HIGH + LOW) / 2 - Multiplier * ATR(Period)
    // FINAL UPPERBAND =
    //     IF(
    //      Current BASICUPPERBAND  < Previous FINAL UPPERBAND AND
    //      Previous Close > Previous FINAL UPPERBAND
    //     ) THEN (Current BASIC UPPERBAND)
    //     ELSE (Previous FINALUPPERBAND)
    // FINAL LOWERBAND =
    //     IF(
    //      Current BASIC LOWERBAND  > Previous FINAL LOWERBAND AND
    //      Previous Close < Previous FINAL LOWERBAND
    //     ) THEN (Current BASIC LOWERBAND)
    //     ELSE (Previous FINAL LOWERBAND)
    // SUPERTREND =
    //     IF(
    //      Previous Supertrend == Previous FINAL UPPERBAND AND
    //      Current Close < Current FINAL UPPERBAND
    //     ) THAN Current FINAL UPPERBAND
    //     ELSE IF(
    //      Previous Supertrend == Previous FINAL LOWERBAND AND
    //      Current Close < Current FINAL LOWERBAND
    //     ) THAN Current FINAL UPPERBAND
    //     ELSE IF(
    //      Previous Supertrend == Previous FINAL UPPERBAND AND
    //      Current Close > Current FINAL UPPERBAND
    //     ) THAN Current FINAL LOWERBAND
    //     ELSE IF(
    //      Previous Supertrend == Previous FINAL LOWERBAND AND
    //      Current Close > Current FINAL LOWERBAND
    //     ) THAN Current FINAL LOWERBAND
    getValues(series, params) {
        const period = params.period, multiplier = params.multiplier, xVal = series.xData, yVal = series.yData, 
        // 0- date, 1- Supertrend indicator
        st = [], xData = [], yData = [], close = 3, low = 2, high = 1, periodsOffset = (period === 0) ? 0 : period - 1, finalUp = [], finalDown = [];
        let atrData = [], basicUp, basicDown, supertrend, prevFinalUp, prevFinalDown, prevST, // Previous Supertrend
        prevY, y, i;
        if ((xVal.length <= period) || !SupertrendIndicator_isArray(yVal[0]) ||
            yVal[0].length !== 4 || period < 0) {
            return;
        }
        atrData = SupertrendIndicator_ATRIndicator.prototype.getValues.call(this, series, {
            period: period
        }).yData;
        for (i = 0; i < atrData.length; i++) {
            y = yVal[periodsOffset + i];
            prevY = yVal[periodsOffset + i - 1] || [];
            prevFinalUp = finalUp[i - 1];
            prevFinalDown = finalDown[i - 1];
            prevST = yData[i - 1];
            if (i === 0) {
                prevFinalUp = prevFinalDown = prevST = 0;
            }
            basicUp = SupertrendIndicator_correctFloat((y[high] + y[low]) / 2 + multiplier * atrData[i]);
            basicDown = SupertrendIndicator_correctFloat((y[high] + y[low]) / 2 - multiplier * atrData[i]);
            if ((basicUp < prevFinalUp) ||
                (prevY[close] > prevFinalUp)) {
                finalUp[i] = basicUp;
            }
            else {
                finalUp[i] = prevFinalUp;
            }
            if ((basicDown > prevFinalDown) ||
                (prevY[close] < prevFinalDown)) {
                finalDown[i] = basicDown;
            }
            else {
                finalDown[i] = prevFinalDown;
            }
            if (prevST === prevFinalUp && y[close] < finalUp[i] ||
                prevST === prevFinalDown && y[close] < finalDown[i]) {
                supertrend = finalUp[i];
            }
            else if (prevST === prevFinalUp && y[close] > finalUp[i] ||
                prevST === prevFinalDown && y[close] > finalDown[i]) {
                supertrend = finalDown[i];
            }
            st.push([xVal[periodsOffset + i], supertrend]);
            xData.push(xVal[periodsOffset + i]);
            yData.push(supertrend);
        }
        return {
            values: st,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Supertrend indicator. This series requires the `linkedTo` option to be
 * set and should be loaded after the `stock/indicators/indicators.js` and
 * `stock/indicators/sma.js`.
 *
 * @sample {highstock} stock/indicators/supertrend
 *         Supertrend indicator
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, cropThreshold, negativeColor, colorAxis, joinBy,
 *               keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking, threshold
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/supertrend
 * @optionparent plotOptions.supertrend
 */
SupertrendIndicator.defaultOptions = SupertrendIndicator_merge(SupertrendIndicator_SMAIndicator.defaultOptions, {
    /**
     * Parameters used in calculation of Supertrend indicator series points.
     *
     * @excluding index
     */
    params: {
        index: void 0, // Unchangeable index, do not inherit (#15362)
        /**
         * Multiplier for Supertrend Indicator.
         */
        multiplier: 3,
        /**
         * The base period for indicator Supertrend Indicator calculations.
         * This is the number of data points which are taken into account
         * for the indicator calculations.
         */
        period: 10
    },
    /**
     * Color of the Supertrend series line that is beneath the main series.
     *
     * @sample {highstock} stock/indicators/supertrend/
     *         Example with risingTrendColor
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    risingTrendColor: "#06b535" /* Palette.positiveColor */,
    /**
     * Color of the Supertrend series line that is above the main series.
     *
     * @sample {highstock} stock/indicators/supertrend/
     *         Example with fallingTrendColor
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    fallingTrendColor: "#f21313" /* Palette.negativeColor */,
    /**
     * The styles for the Supertrend line that intersect main series.
     *
     * @sample {highstock} stock/indicators/supertrend/
     *         Example with changeTrendLine
     */
    changeTrendLine: {
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line.
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: "#333333" /* Palette.neutralColor80 */,
            /**
             * The dash or dot style of the grid lines. For possible
             * values, see
             * [this demonstration](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/).
             *
             * @sample {highcharts} highcharts/yaxis/gridlinedashstyle/
             *         Long dashes
             * @sample {highstock} stock/xaxis/gridlinedashstyle/
             *         Long dashes
             *
             * @type  {Highcharts.DashStyleValue}
             * @since 7.0.0
             */
            dashStyle: 'LongDash'
        }
    }
});
SupertrendIndicator_extend(SupertrendIndicator.prototype, {
    nameBase: 'Supertrend',
    nameComponents: ['multiplier', 'period']
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('supertrend', SupertrendIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const Supertrend_SupertrendIndicator = ((/* unused pure expression or super */ null && (SupertrendIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `Supertrend indicator` series. If the [type](#series.supertrend.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.supertrend
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, cropThreshold, data, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, negativeColor, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *            showInNavigator, stacking, threshold
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/supertrend
 * @apioption series.supertrend
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/VBP/VBPPoint.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

const { sma: { prototype: { pointClass: VBPPoint_SMAPoint } } } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;
/* *
 *
 *  Class
 *
 * */
class VBPPoint extends VBPPoint_SMAPoint {
    // Required for destroying negative part of volume
    destroy() {
        // @todo: this.negativeGraphic doesn't seem to be used anywhere
        if (this.negativeGraphic) {
            this.negativeGraphic = this.negativeGraphic.destroy();
        }
        super.destroy.apply(this, arguments);
    }
}
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const VBP_VBPPoint = (VBPPoint);

;// ./code/es-modules/Stock/Indicators/VBP/VBPIndicator.js
/* *
 *
 *  (c) 2010-2025 Paweł Dalek
 *
 *  Volume By Price (VBP) indicator for Highcharts Stock
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */



const { animObject } = (external_highcharts_src_js_default_default());

const { noop: VBPIndicator_noop } = (external_highcharts_src_js_default_default());

const { column: { prototype: VBPIndicator_columnProto }, sma: VBPIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { addEvent: VBPIndicator_addEvent, arrayMax, arrayMin, correctFloat: VBPIndicator_correctFloat, defined: VBPIndicator_defined, error: VBPIndicator_error, extend: VBPIndicator_extend, isArray: VBPIndicator_isArray, merge: VBPIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Constants
 *
 * */
const abs = Math.abs;
/* *
 *
 *  Functions
 *
 * */
// Utils
/**
 * @private
 */
function arrayExtremesOHLC(data) {
    const dataLength = data.length;
    let min = data[0][3], max = min, i = 1, currentPoint;
    for (; i < dataLength; i++) {
        currentPoint = data[i][3];
        if (currentPoint < min) {
            min = currentPoint;
        }
        if (currentPoint > max) {
            max = currentPoint;
        }
    }
    return {
        min: min,
        max: max
    };
}
/* *
 *
 *  Class
 *
 * */
/**
 * The Volume By Price (VBP) series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.vbp
 *
 * @augments Highcharts.Series
 */
class VBPIndicator extends VBPIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    init(chart, options) {
        const indicator = this;
        // Series.update() sends data that is not necessary as everything is
        // calculated in getValues(), #17007
        delete options.data;
        super.init.apply(indicator, arguments);
        // Only after series are linked add some additional logic/properties.
        const unbinder = VBPIndicator_addEvent(this.chart.constructor, 'afterLinkSeries', function () {
            // Protection for a case where the indicator is being updated,
            // for a brief moment the indicator is deleted.
            if (indicator.options) {
                const params = indicator.options.params, baseSeries = indicator.linkedParent, volumeSeries = chart.get(params.volumeSeriesID);
                indicator.addCustomEvents(baseSeries, volumeSeries);
            }
            unbinder();
        }, {
            order: 1
        });
        return indicator;
    }
    // Adds events related with removing series
    addCustomEvents(baseSeries, volumeSeries) {
        const indicator = this, toEmptyIndicator = () => {
            indicator.chart.redraw();
            indicator.setData([]);
            indicator.zoneStarts = [];
            if (indicator.zoneLinesSVG) {
                indicator.zoneLinesSVG = indicator.zoneLinesSVG.destroy();
            }
        };
        // If base series is deleted, indicator series data is filled with
        // an empty array
        indicator.dataEventsToUnbind.push(VBPIndicator_addEvent(baseSeries, 'remove', function () {
            toEmptyIndicator();
        }));
        // If volume series is deleted, indicator series data is filled with
        // an empty array
        if (volumeSeries) {
            indicator.dataEventsToUnbind.push(VBPIndicator_addEvent(volumeSeries, 'remove', function () {
                toEmptyIndicator();
            }));
        }
        return indicator;
    }
    // Initial animation
    animate(init) {
        const series = this, inverted = series.chart.inverted, group = series.group, attr = {};
        if (!init && group) {
            const position = inverted ? series.yAxis.top : series.xAxis.left;
            if (inverted) {
                group['forceAnimate:translateY'] = true;
                attr.translateY = position;
            }
            else {
                group['forceAnimate:translateX'] = true;
                attr.translateX = position;
            }
            group.animate(attr, VBPIndicator_extend(animObject(series.options.animation), {
                step: function (val, fx) {
                    series.group.attr({
                        scaleX: Math.max(0.001, fx.pos)
                    });
                }
            }));
        }
    }
    drawPoints() {
        const indicator = this;
        if (indicator.options.volumeDivision.enabled) {
            indicator.posNegVolume(true, true);
            VBPIndicator_columnProto.drawPoints.apply(indicator, arguments);
            indicator.posNegVolume(false, false);
        }
        VBPIndicator_columnProto.drawPoints.apply(indicator, arguments);
    }
    // Function responsible for dividing volume into positive and negative
    posNegVolume(initVol, pos) {
        const indicator = this, signOrder = pos ?
            ['positive', 'negative'] :
            ['negative', 'positive'], volumeDivision = indicator.options.volumeDivision, pointLength = indicator.points.length;
        let posWidths = [], negWidths = [], i = 0, pointWidth, priceZone, wholeVol, point;
        if (initVol) {
            indicator.posWidths = posWidths;
            indicator.negWidths = negWidths;
        }
        else {
            posWidths = indicator.posWidths;
            negWidths = indicator.negWidths;
        }
        for (; i < pointLength; i++) {
            point = indicator.points[i];
            point[signOrder[0] + 'Graphic'] = point.graphic;
            point.graphic = point[signOrder[1] + 'Graphic'];
            if (initVol) {
                pointWidth = point.shapeArgs.width;
                priceZone = indicator.priceZones[i];
                wholeVol = priceZone.wholeVolumeData;
                if (wholeVol) {
                    posWidths.push(pointWidth / wholeVol * priceZone.positiveVolumeData);
                    negWidths.push(pointWidth / wholeVol * priceZone.negativeVolumeData);
                }
                else {
                    posWidths.push(0);
                    negWidths.push(0);
                }
            }
            point.color = pos ?
                volumeDivision.styles.positiveColor :
                volumeDivision.styles.negativeColor;
            point.shapeArgs.width = pos ?
                indicator.posWidths[i] :
                indicator.negWidths[i];
            point.shapeArgs.x = pos ?
                point.shapeArgs.x :
                indicator.posWidths[i];
        }
    }
    translate() {
        const indicator = this, options = indicator.options, chart = indicator.chart, yAxis = indicator.yAxis, yAxisMin = yAxis.min, zoneLinesOptions = indicator.options.zoneLines, priceZones = (indicator.priceZones);
        let yBarOffset = 0, volumeDataArray, maxVolume, primalBarWidth, barHeight, barHeightP, oldBarHeight, barWidth, pointPadding, chartPlotTop, barX, barY;
        VBPIndicator_columnProto.translate.apply(indicator);
        const indicatorPoints = indicator.points;
        // Do translate operation when points exist
        if (indicatorPoints.length) {
            pointPadding = options.pointPadding < 0.5 ?
                options.pointPadding :
                0.1;
            volumeDataArray = indicator.volumeDataArray;
            maxVolume = arrayMax(volumeDataArray);
            primalBarWidth = chart.plotWidth / 2;
            chartPlotTop = chart.plotTop;
            barHeight = abs(yAxis.toPixels(yAxisMin) -
                yAxis.toPixels(yAxisMin + indicator.rangeStep));
            oldBarHeight = abs(yAxis.toPixels(yAxisMin) -
                yAxis.toPixels(yAxisMin + indicator.rangeStep));
            if (pointPadding) {
                barHeightP = abs(barHeight * (1 - 2 * pointPadding));
                yBarOffset = abs((barHeight - barHeightP) / 2);
                barHeight = abs(barHeightP);
            }
            indicatorPoints.forEach(function (point, index) {
                barX = point.barX = point.plotX = 0;
                barY = point.plotY = (yAxis.toPixels(priceZones[index].start) -
                    chartPlotTop -
                    (yAxis.reversed ?
                        (barHeight - oldBarHeight) :
                        barHeight) -
                    yBarOffset);
                barWidth = VBPIndicator_correctFloat(primalBarWidth *
                    priceZones[index].wholeVolumeData / maxVolume);
                point.pointWidth = barWidth;
                point.shapeArgs = indicator.crispCol.apply(// eslint-disable-line no-useless-call
                indicator, [barX, barY, barWidth, barHeight]);
                point.volumeNeg = priceZones[index].negativeVolumeData;
                point.volumePos = priceZones[index].positiveVolumeData;
                point.volumeAll = priceZones[index].wholeVolumeData;
            });
            if (zoneLinesOptions.enabled) {
                indicator.drawZones(chart, yAxis, indicator.zoneStarts, zoneLinesOptions.styles);
            }
        }
    }
    getExtremes() {
        const prevCompare = this.options.compare, prevCumulative = this.options.cumulative;
        let ret;
        // Temporarily disable cumulative and compare while getting the extremes
        if (this.options.compare) {
            this.options.compare = void 0;
            ret = super.getExtremes();
            this.options.compare = prevCompare;
        }
        else if (this.options.cumulative) {
            this.options.cumulative = false;
            ret = super.getExtremes();
            this.options.cumulative = prevCumulative;
        }
        else {
            ret = super.getExtremes();
        }
        return ret;
    }
    getValues(series, params) {
        const indicator = this, xValues = series.getColumn('x', true), yValues = series.processedYData, chart = indicator.chart, ranges = params.ranges, VBP = [], xData = [], yData = [], volumeSeries = chart.get(params.volumeSeriesID);
        // Checks if base series exists
        if (!series.chart) {
            VBPIndicator_error('Base series not found! In case it has been removed, add ' +
                'a new one.', true, chart);
            return;
        }
        // Checks if volume series exists and if it has data
        if (!volumeSeries ||
            !volumeSeries.getColumn('x', true).length) {
            const errorMessage = volumeSeries &&
                !volumeSeries.getColumn('x', true).length ?
                ' does not contain any data.' :
                ' not found! Check `volumeSeriesID`.';
            VBPIndicator_error('Series ' +
                params.volumeSeriesID + errorMessage, true, chart);
            return;
        }
        // Checks if series data fits the OHLC format
        const isOHLC = VBPIndicator_isArray(yValues[0]);
        if (isOHLC && yValues[0].length !== 4) {
            VBPIndicator_error('Type of ' +
                series.name +
                ' series is different than line, OHLC or candlestick.', true, chart);
            return;
        }
        // Price zones contains all the information about the zones (index,
        // start, end, volumes, etc.)
        const priceZones = indicator.priceZones = indicator.specifyZones(isOHLC, xValues, yValues, ranges, volumeSeries);
        priceZones.forEach(function (zone, index) {
            VBP.push([zone.x, zone.end]);
            xData.push(VBP[index][0]);
            yData.push(VBP[index][1]);
        });
        return {
            values: VBP,
            xData: xData,
            yData: yData
        };
    }
    // Specifying where each zone should start ans end
    specifyZones(isOHLC, xValues, yValues, ranges, volumeSeries) {
        const indicator = this, rangeExtremes = (isOHLC ? arrayExtremesOHLC(yValues) : false), zoneStarts = indicator.zoneStarts = [], priceZones = [];
        let lowRange = rangeExtremes ?
            rangeExtremes.min :
            arrayMin(yValues), highRange = rangeExtremes ?
            rangeExtremes.max :
            arrayMax(yValues), i = 0, j = 1;
        // If the compare mode is set on the main series, change the VBP
        // zones to fit new extremes, #16277.
        const mainSeries = indicator.linkedParent;
        if (!indicator.options.compareToMain &&
            mainSeries.dataModify) {
            lowRange = mainSeries.dataModify.modifyValue(lowRange);
            highRange = mainSeries.dataModify.modifyValue(highRange);
        }
        if (!VBPIndicator_defined(lowRange) || !VBPIndicator_defined(highRange)) {
            if (this.points.length) {
                this.setData([]);
                this.zoneStarts = [];
                if (this.zoneLinesSVG) {
                    this.zoneLinesSVG = this.zoneLinesSVG.destroy();
                }
            }
            return [];
        }
        const rangeStep = indicator.rangeStep =
            VBPIndicator_correctFloat(highRange - lowRange) / ranges;
        zoneStarts.push(lowRange);
        for (; i < ranges - 1; i++) {
            zoneStarts.push(VBPIndicator_correctFloat(zoneStarts[i] + rangeStep));
        }
        zoneStarts.push(highRange);
        const zoneStartsLength = zoneStarts.length;
        //    Creating zones
        for (; j < zoneStartsLength; j++) {
            priceZones.push({
                index: j - 1,
                x: xValues[0],
                start: zoneStarts[j - 1],
                end: zoneStarts[j]
            });
        }
        return indicator.volumePerZone(isOHLC, priceZones, volumeSeries, xValues, yValues);
    }
    // Calculating sum of volume values for a specific zone
    volumePerZone(isOHLC, priceZones, volumeSeries, xValues, yValues) {
        const indicator = this, volumeXData = volumeSeries.getColumn('x', true), volumeYData = volumeSeries.getColumn('y', true), lastZoneIndex = priceZones.length - 1, baseSeriesLength = yValues.length, volumeSeriesLength = volumeYData.length;
        let previousValue, startFlag, endFlag, value, i;
        // Checks if each point has a corresponding volume value
        if (abs(baseSeriesLength - volumeSeriesLength)) {
            // If the first point don't have volume, add 0 value at the
            // beginning of the volume array
            if (xValues[0] !== volumeXData[0]) {
                volumeYData.unshift(0);
            }
            // If the last point don't have volume, add 0 value at the end
            // of the volume array
            if (xValues[baseSeriesLength - 1] !==
                volumeXData[volumeSeriesLength - 1]) {
                volumeYData.push(0);
            }
        }
        indicator.volumeDataArray = [];
        priceZones.forEach(function (zone) {
            zone.wholeVolumeData = 0;
            zone.positiveVolumeData = 0;
            zone.negativeVolumeData = 0;
            for (i = 0; i < baseSeriesLength; i++) {
                startFlag = false;
                endFlag = false;
                value = isOHLC ? yValues[i][3] : yValues[i];
                previousValue = i ?
                    (isOHLC ?
                        yValues[i - 1][3] :
                        yValues[i - 1]) :
                    value;
                // If the compare mode is set on the main series,
                // change the VBP zones to fit new extremes, #16277.
                const mainSeries = indicator.linkedParent;
                if (!indicator.options.compareToMain &&
                    mainSeries.dataModify) {
                    value = mainSeries.dataModify.modifyValue(value);
                    previousValue = mainSeries.dataModify
                        .modifyValue(previousValue);
                }
                // Checks if this is the point with the
                // lowest close value and if so, adds it calculations
                if (value <= zone.start && zone.index === 0) {
                    startFlag = true;
                }
                // Checks if this is the point with the highest
                // close value and if so, adds it calculations
                if (value >= zone.end && zone.index === lastZoneIndex) {
                    endFlag = true;
                }
                if ((value > zone.start || startFlag) &&
                    (value < zone.end || endFlag)) {
                    zone.wholeVolumeData += volumeYData[i];
                    if (previousValue > value) {
                        zone.negativeVolumeData += volumeYData[i];
                    }
                    else {
                        zone.positiveVolumeData += volumeYData[i];
                    }
                }
            }
            indicator.volumeDataArray.push(zone.wholeVolumeData);
        });
        return priceZones;
    }
    // Function responsible for drawing additional lines indicating zones
    drawZones(chart, yAxis, zonesValues, zonesStyles) {
        const indicator = this, renderer = chart.renderer, leftLinePos = 0, rightLinePos = chart.plotWidth, verticalOffset = chart.plotTop;
        let zoneLinesSVG = indicator.zoneLinesSVG, zoneLinesPath = [], verticalLinePos;
        zonesValues.forEach(function (value) {
            verticalLinePos = yAxis.toPixels(value) - verticalOffset;
            zoneLinesPath = zoneLinesPath.concat(chart.renderer.crispLine([[
                    'M',
                    leftLinePos,
                    verticalLinePos
                ], [
                    'L',
                    rightLinePos,
                    verticalLinePos
                ]], zonesStyles.lineWidth));
        });
        // Create zone lines one path or update it while animating
        if (zoneLinesSVG) {
            zoneLinesSVG.animate({
                d: zoneLinesPath
            });
        }
        else {
            zoneLinesSVG = indicator.zoneLinesSVG =
                renderer
                    .path(zoneLinesPath)
                    .attr({
                    'stroke-width': zonesStyles.lineWidth,
                    'stroke': zonesStyles.color,
                    'dashstyle': zonesStyles.dashStyle,
                    'zIndex': indicator.group.zIndex + 0.1
                })
                    .add(indicator.group);
        }
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Volume By Price indicator.
 *
 * This series requires `linkedTo` option to be set.
 *
 * @sample stock/indicators/volume-by-price
 *         Volume By Price indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/volume-by-price
 * @optionparent plotOptions.vbp
 */
VBPIndicator.defaultOptions = VBPIndicator_merge(VBPIndicator_SMAIndicator.defaultOptions, {
    /**
     * @excluding index, period
     */
    params: {
        // Index and period are unchangeable, do not inherit (#15362)
        index: void 0,
        period: void 0,
        /**
         * The number of price zones.
         */
        ranges: 12,
        /**
         * The id of volume series which is mandatory. For example using
         * OHLC data, volumeSeriesID='volume' means the indicator will be
         * calculated using OHLC and volume values.
         */
        volumeSeriesID: 'volume'
    },
    /**
     * The styles for lines which determine price zones.
     */
    zoneLines: {
        /**
         * Enable/disable zone lines.
         */
        enabled: true,
        /**
         * Specify the style of zone lines.
         *
         * @type    {Highcharts.CSSObject}
         * @default {"color": "#0A9AC9", "dashStyle": "LongDash", "lineWidth": 1}
         */
        styles: {
            /** @ignore-option */
            color: '#0A9AC9',
            /** @ignore-option */
            dashStyle: 'LongDash',
            /** @ignore-option */
            lineWidth: 1
        }
    },
    /**
     * The styles for bars when volume is divided into positive/negative.
     */
    volumeDivision: {
        /**
         * Option to control if volume is divided.
         */
        enabled: true,
        styles: {
            /**
             * Color of positive volume bars.
             *
             * @type {Highcharts.ColorString}
             */
            positiveColor: 'rgba(144, 237, 125, 0.8)',
            /**
             * Color of negative volume bars.
             *
             * @type {Highcharts.ColorString}
             */
            negativeColor: 'rgba(244, 91, 91, 0.8)'
        }
    },
    // To enable series animation; must be animationLimit > pointCount
    animationLimit: 1000,
    enableMouseTracking: false,
    pointPadding: 0,
    zIndex: -1,
    crisp: true,
    dataGrouping: {
        enabled: false
    },
    dataLabels: {
        align: 'left',
        allowOverlap: true,
        enabled: true,
        format: 'P: {point.volumePos:.2f} | N: {point.volumeNeg:.2f}',
        padding: 0,
        style: {
            /** @internal */
            fontSize: '0.5em'
        },
        verticalAlign: 'top'
    }
});
VBPIndicator_extend(VBPIndicator.prototype, {
    nameBase: 'Volume by Price',
    nameComponents: ['ranges'],
    calculateOn: {
        chart: 'render',
        xAxis: 'afterSetExtremes'
    },
    pointClass: VBP_VBPPoint,
    markerAttribs: VBPIndicator_noop,
    drawGraph: VBPIndicator_noop,
    getColumnMetrics: VBPIndicator_columnProto.getColumnMetrics,
    crispCol: VBPIndicator_columnProto.crispCol
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('vbp', VBPIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const VBP_VBPIndicator = ((/* unused pure expression or super */ null && (VBPIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `Volume By Price (VBP)` series. If the [type](#series.vbp.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.vbp
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL, compare, compareBase, compareStart
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/volume-by-price
 * @apioption series.vbp
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/VWAP/VWAPIndicator.js
/* *
 *
 *  (c) 2010-2025 Paweł Dalek
 *
 *  Volume Weighted Average Price (VWAP) indicator for Highcharts Stock
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: VWAPIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { error: VWAPIndicator_error, isArray: VWAPIndicator_isArray, merge: VWAPIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Volume Weighted Average Price (VWAP) series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.vwap
 *
 * @augments Highcharts.Series
 */
class VWAPIndicator extends VWAPIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const indicator = this, chart = series.chart, xValues = series.xData, yValues = series.yData, period = params.period;
        let isOHLC = true, volumeSeries;
        // Checks if volume series exists
        if (!(volumeSeries = (chart.get(params.volumeSeriesID)))) {
            VWAPIndicator_error('Series ' +
                params.volumeSeriesID +
                ' not found! Check `volumeSeriesID`.', true, chart);
            return;
        }
        // Checks if series data fits the OHLC format
        if (!(VWAPIndicator_isArray(yValues[0]))) {
            isOHLC = false;
        }
        return indicator.calculateVWAPValues(isOHLC, xValues, yValues, volumeSeries, period);
    }
    /**
     * Main algorithm used to calculate Volume Weighted Average Price (VWAP)
     * values
     *
     * @private
     *
     * @param {boolean} isOHLC
     * Says if data has OHLC format
     *
     * @param {Array<number>} xValues
     * Array of timestamps
     *
     * @param {Array<number|Array<number,number,number,number>>} yValues
     * Array of yValues, can be an array of a four arrays (OHLC) or array of
     * values (line)
     *
     * @param {Array<*>} volumeSeries
     * Volume series
     *
     * @param {number} period
     * Number of points to be calculated
     *
     * @return {Object}
     * Object contains computed VWAP
     **/
    calculateVWAPValues(isOHLC, xValues, yValues, volumeSeries, period) {
        const volumeValues = volumeSeries.getColumn('y'), volumeLength = volumeValues.length, pointsLength = xValues.length, cumulativePrice = [], cumulativeVolume = [], xData = [], yData = [], VWAP = [];
        let commonLength, typicalPrice, cPrice, cVolume, i, j;
        if (pointsLength <= volumeLength) {
            commonLength = pointsLength;
        }
        else {
            commonLength = volumeLength;
        }
        for (i = 0, j = 0; i < commonLength; i++) {
            // Depending on whether series is OHLC or line type, price is
            // average of the high, low and close or a simple value
            typicalPrice = isOHLC ?
                ((yValues[i][1] + yValues[i][2] +
                    yValues[i][3]) / 3) :
                yValues[i];
            typicalPrice *= volumeValues[i];
            cPrice = j ?
                (cumulativePrice[i - 1] + typicalPrice) :
                typicalPrice;
            cVolume = j ?
                (cumulativeVolume[i - 1] + volumeValues[i]) :
                volumeValues[i];
            cumulativePrice.push(cPrice);
            cumulativeVolume.push(cVolume);
            VWAP.push([xValues[i], (cPrice / cVolume)]);
            xData.push(VWAP[i][0]);
            yData.push(VWAP[i][1]);
            j++;
            if (j === period) {
                j = 0;
            }
        }
        return {
            values: VWAP,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Volume Weighted Average Price indicator.
 *
 * This series requires `linkedTo` option to be set.
 *
 * @sample stock/indicators/vwap
 *         Volume Weighted Average Price indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/vwap
 * @optionparent plotOptions.vwap
 */
VWAPIndicator.defaultOptions = VWAPIndicator_merge(VWAPIndicator_SMAIndicator.defaultOptions, {
    /**
     * @excluding index
     */
    params: {
        index: void 0, // Unchangeable index, do not inherit (#15362)
        period: 30,
        /**
         * The id of volume series which is mandatory. For example using
         * OHLC data, volumeSeriesID='volume' means the indicator will be
         * calculated using OHLC and volume values.
         */
        volumeSeriesID: 'volume'
    }
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('vwap', VWAPIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const VWAP_VWAPIndicator = ((/* unused pure expression or super */ null && (VWAPIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `Volume Weighted Average Price (VWAP)` series. If the
 * [type](#series.vwap.type) option is not specified, it is inherited from
 * [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.vwap
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/vwap
 * @apioption series.vwap
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/WilliamsR/WilliamsRIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */



const { sma: WilliamsRIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: WilliamsRIndicator_extend, isArray: WilliamsRIndicator_isArray, merge: WilliamsRIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Williams %R series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.williamsr
 *
 * @augments Highcharts.Series
 */
class WilliamsRIndicator extends WilliamsRIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, WR = [], // 0- date, 1- Williams %R
        xData = [], yData = [], close = 3, low = 2, high = 1;
        let slicedY, extremes, R, HH, // Highest high value in period
        LL, // Lowest low value in period
        CC, // Current close value
        i;
        // Williams %R requires close value
        if (xVal.length < period ||
            !WilliamsRIndicator_isArray(yVal[0]) ||
            yVal[0].length !== 4) {
            return;
        }
        // For a N-period, we start from N-1 point, to calculate Nth point
        // That is why we later need to comprehend slice() elements list
        // with (+1)
        for (i = period - 1; i < yValLen; i++) {
            slicedY = yVal.slice(i - period + 1, i + 1);
            extremes = Indicators_ArrayUtilities.getArrayExtremes(slicedY, low, high);
            LL = extremes[0];
            HH = extremes[1];
            CC = yVal[i][close];
            R = ((HH - CC) / (HH - LL)) * -100;
            if (xVal[i]) {
                WR.push([xVal[i], R]);
                xData.push(xVal[i]);
                yData.push(R);
            }
        }
        return {
            values: WR,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Williams %R. This series requires the `linkedTo` option to be
 * set and should be loaded after the `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/williams-r
 *         Williams %R
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/williams-r
 * @optionparent plotOptions.williamsr
 */
WilliamsRIndicator.defaultOptions = WilliamsRIndicator_merge(WilliamsRIndicator_SMAIndicator.defaultOptions, {
    /**
     * Parameters used in calculation of Williams %R series points.
     * @excluding index
     */
    params: {
        index: void 0, // Unchangeable index, do not inherit (#15362)
        /**
         * Period for Williams %R oscillator
         */
        period: 14
    }
});
WilliamsRIndicator_extend(WilliamsRIndicator.prototype, {
    nameBase: 'Williams %R'
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('williamsr', WilliamsRIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const WilliamsR_WilliamsRIndicator = ((/* unused pure expression or super */ null && (WilliamsRIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `Williams %R Oscillator` series. If the [type](#series.williamsr.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.williamsr
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/williams-r
 * @apioption series.williamsr
 */
''; // Adds doclets above to the transpiled file

;// ./code/es-modules/Stock/Indicators/WMA/WMAIndicator.js
/* *
 *
 *  (c) 2010-2025 Kacper Madej
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: WMAIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { isArray: WMAIndicator_isArray, merge: WMAIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Functions
 *
 * */
// Utils:
/**
 * @private
 */
function WMAIndicator_accumulateAverage(points, xVal, yVal, i, index) {
    const xValue = xVal[i], yValue = index < 0 ? yVal[i] : yVal[i][index];
    points.push([xValue, yValue]);
}
/**
 * @private
 */
function weightedSumArray(array, pLen) {
    // The denominator is the sum of the number of days as a triangular number.
    // If there are 5 days, the triangular numbers are 5, 4, 3, 2, and 1.
    // The sum is 5 + 4 + 3 + 2 + 1 = 15.
    const denominator = (pLen + 1) / 2 * pLen;
    // Reduce VS loop => reduce
    return array.reduce(function (prev, cur, i) {
        return [null, prev[1] + cur[1] * (i + 1)];
    })[1] / denominator;
}
/**
 * @private
 */
function WMAIndicator_populateAverage(points, xVal, yVal, i) {
    const pLen = points.length, wmaY = weightedSumArray(points, pLen), wmaX = xVal[i - 1];
    points.shift(); // Remove point until range < period
    return [wmaX, wmaY];
}
/* *
 *
 *  Class
 *
 * */
/**
 * The SMA series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.wma
 *
 * @augments Highcharts.Series
 */
class WMAIndicator extends WMAIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, xValue = xVal[0], wma = [], xData = [], yData = [];
        let range = 1, index = -1, i, wmaPoint, yValue = yVal[0];
        if (xVal.length < period) {
            return;
        }
        // Switch index for OHLC / Candlestick
        if (WMAIndicator_isArray(yVal[0])) {
            index = params.index;
            yValue = yVal[0][index];
        }
        // Starting point
        const points = [[xValue, yValue]];
        // Accumulate first N-points
        while (range !== period) {
            WMAIndicator_accumulateAverage(points, xVal, yVal, range, index);
            range++;
        }
        // Calculate value one-by-one for each period in visible data
        for (i = range; i < yValLen; i++) {
            wmaPoint = WMAIndicator_populateAverage(points, xVal, yVal, i);
            wma.push(wmaPoint);
            xData.push(wmaPoint[0]);
            yData.push(wmaPoint[1]);
            WMAIndicator_accumulateAverage(points, xVal, yVal, i, index);
        }
        wmaPoint = WMAIndicator_populateAverage(points, xVal, yVal, i);
        wma.push(wmaPoint);
        xData.push(wmaPoint[0]);
        yData.push(wmaPoint[1]);
        return {
            values: wma,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Weighted moving average indicator (WMA). This series requires `linkedTo`
 * option to be set.
 *
 * @sample stock/indicators/wma
 *         Weighted moving average indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/wma
 * @optionparent plotOptions.wma
 */
WMAIndicator.defaultOptions = WMAIndicator_merge(WMAIndicator_SMAIndicator.defaultOptions, {
    params: {
        index: 3,
        period: 9
    }
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('wma', WMAIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const WMA_WMAIndicator = ((/* unused pure expression or super */ null && (WMAIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `WMA` series. If the [type](#series.wma.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.wma
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/wma
 * @apioption series.wma
 */
''; // Adds doclet above to the transpiled file

;// ./code/es-modules/Stock/Indicators/Zigzag/ZigzagIndicator.js
/* *
 *
 *  (c) 2010-2025 Kacper Madej
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: ZigzagIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { merge: ZigzagIndicator_merge, extend: ZigzagIndicator_extend } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Zig Zag series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.zigzag
 *
 * @augments Highcharts.Series
 */
class ZigzagIndicator extends ZigzagIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const lowIndex = params.lowIndex, highIndex = params.highIndex, deviation = params.deviation / 100, deviations = {
            'low': 1 + deviation,
            'high': 1 - deviation
        }, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, zigzag = [], xData = [], yData = [];
        let i, j, zigzagPoint, directionUp, exitLoop = false, yIndex = false;
        // Exit if not enough points or no low or high values
        if (!xVal || xVal.length <= 1 ||
            (yValLen &&
                (typeof yVal[0][lowIndex] === 'undefined' ||
                    typeof yVal[0][highIndex] === 'undefined'))) {
            return;
        }
        // Set first zigzag point candidate
        const firstZigzagLow = yVal[0][lowIndex], firstZigzagHigh = yVal[0][highIndex];
        // Search for a second zigzag point candidate,
        // this will also set first zigzag point
        for (i = 1; i < yValLen; i++) {
            // Required change to go down
            if (yVal[i][lowIndex] <= firstZigzagHigh * deviations.high) {
                zigzag.push([xVal[0], firstZigzagHigh]);
                // Second zigzag point candidate
                zigzagPoint = [xVal[i], yVal[i][lowIndex]];
                // Next line will be going up
                directionUp = true;
                exitLoop = true;
                // Required change to go up
            }
            else if (yVal[i][highIndex] >= firstZigzagLow * deviations.low) {
                zigzag.push([xVal[0], firstZigzagLow]);
                // Second zigzag point candidate
                zigzagPoint = [xVal[i], yVal[i][highIndex]];
                // Next line will be going down
                directionUp = false;
                exitLoop = true;
            }
            if (exitLoop) {
                xData.push(zigzag[0][0]);
                yData.push(zigzag[0][1]);
                j = i++;
                i = yValLen;
            }
        }
        // Search for next zigzags
        for (i = j; i < yValLen; i++) {
            if (directionUp) { // Next line up
                // lower when going down -> change zigzag candidate
                if (yVal[i][lowIndex] <= zigzagPoint[1]) {
                    zigzagPoint = [xVal[i], yVal[i][lowIndex]];
                }
                // Required change to go down -> new zigzagpoint and
                // direction change
                if (yVal[i][highIndex] >=
                    zigzagPoint[1] * deviations.low) {
                    yIndex = highIndex;
                }
            }
            else { // Next line down
                // higher when going up -> change zigzag candidate
                if (yVal[i][highIndex] >= zigzagPoint[1]) {
                    zigzagPoint = [xVal[i], yVal[i][highIndex]];
                }
                // Required change to go down -> new zigzagpoint and
                // direction change
                if (yVal[i][lowIndex] <=
                    zigzagPoint[1] * deviations.high) {
                    yIndex = lowIndex;
                }
            }
            if (yIndex !== false) { // New zigzag point and direction change
                zigzag.push(zigzagPoint);
                xData.push(zigzagPoint[0]);
                yData.push(zigzagPoint[1]);
                zigzagPoint = [xVal[i], yVal[i][yIndex]];
                directionUp = !directionUp;
                yIndex = false;
            }
        }
        const zigzagLen = zigzag.length;
        // No zigzag for last point
        if (zigzagLen !== 0 &&
            zigzag[zigzagLen - 1][0] < xVal[yValLen - 1]) {
            // Set last point from zigzag candidate
            zigzag.push(zigzagPoint);
            xData.push(zigzagPoint[0]);
            yData.push(zigzagPoint[1]);
        }
        return {
            values: zigzag,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Zig Zag indicator.
 *
 * This series requires `linkedTo` option to be set.
 *
 * @sample stock/indicators/zigzag
 *         Zig Zag indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/zigzag
 * @optionparent plotOptions.zigzag
 */
ZigzagIndicator.defaultOptions = ZigzagIndicator_merge(ZigzagIndicator_SMAIndicator.defaultOptions, {
    /**
     * @excluding index, period
     */
    params: {
        // Index and period are unchangeable, do not inherit (#15362)
        index: void 0,
        period: void 0,
        /**
         * The point index which indicator calculations will base - low
         * value.
         *
         * For example using OHLC data, index=2 means the indicator will be
         * calculated using Low values.
         */
        lowIndex: 2,
        /**
         * The point index which indicator calculations will base - high
         * value.
         *
         * For example using OHLC data, index=1 means the indicator will be
         * calculated using High values.
         */
        highIndex: 1,
        /**
         * The threshold for the value change.
         *
         * For example deviation=1 means the indicator will ignore all price
         * movements less than 1%.
         */
        deviation: 1
    }
});
ZigzagIndicator_extend(ZigzagIndicator.prototype, {
    nameComponents: ['deviation'],
    nameSuffixes: ['%'],
    nameBase: 'Zig Zag'
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('zigzag', ZigzagIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const Zigzag_ZigzagIndicator = ((/* unused pure expression or super */ null && (ZigzagIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `Zig Zag` series. If the [type](#series.zigzag.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.zigzag
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/zigzag
 * @apioption series.zigzag
 */
''; // Adds doclets above to transpiled file

;// ./code/es-modules/Stock/Indicators/LinearRegression/LinearRegressionIndicator.js
/**
 *
 *  (c) 2010-2025 Kamil Kulig
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: LinearRegressionIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { isArray: LinearRegressionIndicator_isArray, extend: LinearRegressionIndicator_extend, merge: LinearRegressionIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * Linear regression series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.linearregression
 *
 * @augments Highcharts.Series
 */
class LinearRegressionIndicator extends LinearRegressionIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Return the slope and intercept of a straight line function.
     *
     * @private
     *
     * @param {Array<number>} xData
     * List of all x coordinates in a period.
     *
     * @param {Array<number>} yData
     * List of all y coordinates in a period.
     *
     * @return {Highcharts.RegressionLineParametersObject}
     * Object that contains the slope and the intercept of a straight line
     * function.
     */
    getRegressionLineParameters(xData, yData) {
        // Least squares method
        const yIndex = this.options.params.index, getSingleYValue = function (yValue, yIndex) {
            return LinearRegressionIndicator_isArray(yValue) ? yValue[yIndex] : yValue;
        }, xSum = xData.reduce(function (accX, val) {
            return val + accX;
        }, 0), ySum = yData.reduce(function (accY, val) {
            return getSingleYValue(val, yIndex) + accY;
        }, 0), xMean = xSum / xData.length, yMean = ySum / yData.length;
        let xError, yError, i, formulaNumerator = 0, formulaDenominator = 0;
        for (i = 0; i < xData.length; i++) {
            xError = xData[i] - xMean;
            yError = getSingleYValue(yData[i], yIndex) - yMean;
            formulaNumerator += xError * yError;
            formulaDenominator += Math.pow(xError, 2);
        }
        const slope = formulaDenominator ?
            formulaNumerator / formulaDenominator : 0; // Don't divide by 0
        return {
            slope: slope,
            intercept: yMean - slope * xMean
        };
    }
    /**
     * Return the y value on a straight line.
     *
     * @private
     *
     * @param {Highcharts.RegressionLineParametersObject} lineParameters
     * Object that contains the slope and the intercept of a straight line
     * function.
     *
     * @param {number} endPointX
     * X coordinate of the point.
     *
     * @return {number}
     * Y value of the point that lies on the line.
     */
    getEndPointY(lineParameters, endPointX) {
        return lineParameters.slope * endPointX + lineParameters.intercept;
    }
    /**
     * Transform the coordinate system so that x values start at 0 and
     * apply xAxisUnit.
     *
     * @private
     *
     * @param {Array<number>} xData
     * List of all x coordinates in a period
     *
     * @param {number} xAxisUnit
     * Option (see the API)
     *
     * @return {Array<number>}
     * Array of transformed x data
     */
    transformXData(xData, xAxisUnit) {
        const xOffset = xData[0];
        return xData.map(function (xValue) {
            return (xValue - xOffset) / xAxisUnit;
        });
    }
    /**
     * Find the closest distance between points in the base series.
     * @private
     * @param {Array<number>} xData list of all x coordinates in the base series
     * @return {number} - closest distance between points in the base series
     */
    findClosestDistance(xData) {
        let distance, closestDistance, i;
        for (i = 1; i < xData.length - 1; i++) {
            distance = xData[i] - xData[i - 1];
            if (distance > 0 &&
                (typeof closestDistance === 'undefined' ||
                    distance < closestDistance)) {
                closestDistance = distance;
            }
        }
        return closestDistance;
    }
    // Required to be implemented - starting point for indicator's logic
    getValues(baseSeries, regressionSeriesParams) {
        const xData = baseSeries.xData, yData = baseSeries.yData, period = regressionSeriesParams.period, 
        // Format required to be returned
        indicatorData = {
            xData: [], // By getValues() method
            yData: [],
            values: []
        }, xAxisUnit = this.options.params.xAxisUnit ||
            this.findClosestDistance(xData);
        let lineParameters, i, periodStart, periodEnd, endPointX, endPointY, periodXData, periodYData, periodTransformedXData;
        // Iteration logic: x value of the last point within the period
        // (end point) is used to represent the y value (regression)
        // of the entire period.
        for (i = period - 1; i <= xData.length - 1; i++) {
            periodStart = i - period + 1; // Adjusted for slice() function
            periodEnd = i + 1; // (as above)
            endPointX = xData[i];
            periodXData = xData.slice(periodStart, periodEnd);
            periodYData = yData.slice(periodStart, periodEnd);
            periodTransformedXData = this.transformXData(periodXData, xAxisUnit);
            lineParameters = this.getRegressionLineParameters(periodTransformedXData, periodYData);
            endPointY = this.getEndPointY(lineParameters, periodTransformedXData[periodTransformedXData.length - 1]);
            // @todo this is probably not used anywhere
            indicatorData.values.push({
                regressionLineParameters: lineParameters,
                x: endPointX,
                y: endPointY
            });
            if (LinearRegressionIndicator_isArray(indicatorData.xData)) {
                indicatorData.xData.push(endPointX);
            }
            if (LinearRegressionIndicator_isArray(indicatorData.yData)) {
                indicatorData.yData.push(endPointY);
            }
        }
        return indicatorData;
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Linear regression indicator. This series requires `linkedTo` option to be
 * set.
 *
 * @sample {highstock} stock/indicators/linear-regression
 *         Linear regression indicator
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/regressions
 * @optionparent plotOptions.linearregression
 */
LinearRegressionIndicator.defaultOptions = LinearRegressionIndicator_merge(LinearRegressionIndicator_SMAIndicator.defaultOptions, {
    params: {
        /**
         * Unit (in milliseconds) for the x axis distances used to
         * compute the regression line parameters (slope & intercept)
         * for every range. In Highcharts Stock the x axis values are
         * always represented in milliseconds which may cause that
         * distances between points are "big" integer numbers.
         *
         * Highcharts Stock's linear regression algorithm (least squares
         * method) will utilize these "big" integers for finding the
         * slope and the intercept of the regression line for each
         * period. In consequence, this value may be a very "small"
         * decimal number that's hard to interpret by a human.
         *
         * For instance: `xAxisUnit` equaled to `86400000` ms (1 day)
         * forces the algorithm to treat `86400000` as `1` while
         * computing the slope and the intercept. This may enhance the
         * legibility of the indicator's values.
         *
         * Default value is the closest distance between two data
         * points.
         *
         * In `v9.0.2`, the default value has been changed
         * from `undefined` to `null`.
         *
         * @sample {highstock} stock/plotoptions/linear-regression-xaxisunit
         *         xAxisUnit set to 1 minute
         *
         * @example
         * // In Liniear Regression Slope Indicator series `xAxisUnit`is
         * // `86400000` (1 day) and period is `3`. There're 3 points in
         * // the base series:
         *
         * data: [
         *   [Date.UTC(2020, 0, 1), 1],
         *   [Date.UTC(2020, 0, 2), 3],
         *   [Date.UTC(2020, 0, 3), 5]
         * ]
         *
         * // This will produce one point in the indicator series that
         * // has a `y` value of `2` (slope of the regression line). If
         * // we change the `xAxisUnit` to `1` (ms) the value of the
         * // indicator's point will be `2.3148148148148148e-8` which is
         * // harder to interpert for a human.
         *
         * @type    {null|number}
         * @product highstock
         */
        xAxisUnit: null
    },
    tooltip: {
        valueDecimals: 4
    }
});
LinearRegressionIndicator_extend(LinearRegressionIndicator.prototype, {
    nameBase: 'Linear Regression Indicator'
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('linearRegression', LinearRegressionIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const LinearRegression_LinearRegressionIndicator = ((/* unused pure expression or super */ null && (LinearRegressionIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A linear regression series. If the
 * [type](#series.linearregression.type) option is not specified, it is
 * inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.linearregression
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser,dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/regressions
 * @apioption series.linearregression
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/LinearRegressionSlopes/LinearRegressionSlopesIndicator.js
/**
 *
 *  (c) 2010-2025 Kamil Kulig
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { linearRegression: LinearRegressionSlopesIndicator_LinearRegressionIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: LinearRegressionSlopesIndicator_extend, merge: LinearRegressionSlopesIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Linear Regression Slope series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.linearRegressionSlope
 *
 * @augments Highcharts.Series
 */
class LinearRegressionSlopesIndicator extends LinearRegressionSlopesIndicator_LinearRegressionIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getEndPointY(lineParameters) {
        return lineParameters.slope;
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Linear regression slope indicator. This series requires `linkedTo`
 * option to be set.
 *
 * @sample {highstock} stock/indicators/linear-regression-slope
 *         Linear regression slope indicator
 *
 * @extends      plotOptions.linearregression
 * @since        7.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires  stock/indicators/regressions
 * @optionparent plotOptions.linearregressionslope
 */
LinearRegressionSlopesIndicator.defaultOptions = LinearRegressionSlopesIndicator_merge(LinearRegressionSlopesIndicator_LinearRegressionIndicator.defaultOptions);
LinearRegressionSlopesIndicator_extend(LinearRegressionSlopesIndicator.prototype, {
    nameBase: 'Linear Regression Slope Indicator'
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('linearRegressionSlope', LinearRegressionSlopesIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const LinearRegressionSlopes_LinearRegressionSlopesIndicator = ((/* unused pure expression or super */ null && (LinearRegressionSlopesIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A linear regression intercept series. If the
 * [type](#series.linearregressionslope.type) option is not specified, it is
 * inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.linearregressionslope
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser,dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/regressions
 * @apioption series.linearregressionslope
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/LinearRegressionIntercept/LinearRegressionInterceptIndicator.js
/**
 *
 *  (c) 2010-2025 Kamil Kulig
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { linearRegression: LinearRegressionInterceptIndicator_LinearRegressionIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: LinearRegressionInterceptIndicator_extend, merge: LinearRegressionInterceptIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Linear Regression Intercept series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.linearRegressionIntercept
 *
 * @augments Highcharts.Series
 */
class LinearRegressionInterceptIndicator extends LinearRegressionInterceptIndicator_LinearRegressionIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getEndPointY(lineParameters) {
        return lineParameters.intercept;
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Linear regression intercept indicator. This series requires `linkedTo`
 * option to be set.
 *
 * @sample {highstock} stock/indicators/linear-regression-intercept
 *         Linear intercept slope indicator
 *
 * @extends      plotOptions.linearregression
 * @since        7.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires  stock/indicators/regressions
 * @optionparent plotOptions.linearregressionintercept
 */
LinearRegressionInterceptIndicator.defaultOptions = LinearRegressionInterceptIndicator_merge(LinearRegressionInterceptIndicator_LinearRegressionIndicator.defaultOptions);
LinearRegressionInterceptIndicator_extend(LinearRegressionInterceptIndicator.prototype, {
    nameBase: 'Linear Regression Intercept Indicator'
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('linearRegressionIntercept', LinearRegressionInterceptIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const LinearRegressionIntercept_LinearRegressionInterceptIndicator = ((/* unused pure expression or super */ null && (LinearRegressionInterceptIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A linear regression intercept series. If the
 * [type](#series.linearregressionintercept.type) option is not specified, it is
 * inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.linearregressionintercept
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser,dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/regressions
 * @apioption series.linearregressionintercept
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/LinearRegressionAngle/LinearRegressionAngleIndicator.js
/**
 *
 *  (c) 2010-2025 Kamil Kulig
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { linearRegression: LinearRegressionAngleIndicator_LinearRegressionIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: LinearRegressionAngleIndicator_extend, merge: LinearRegressionAngleIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Linear Regression Angle series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.linearRegressionAngle
 *
 * @augments Highcharts.Series
 */
class LinearRegressionAngleIndicator extends LinearRegressionAngleIndicator_LinearRegressionIndicator {
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Convert a slope of a line to angle (in degrees) between
     * the line and x axis
     * @private
     * @param {number} slope of the straight line function
     * @return {number} angle in degrees
     */
    slopeToAngle(slope) {
        return Math.atan(slope) * (180 / Math.PI); // Rad to deg
    }
    getEndPointY(lineParameters) {
        return this.slopeToAngle(lineParameters.slope);
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Linear regression angle indicator. This series requires `linkedTo`
 * option to be set.
 *
 * @sample {highstock} stock/indicators/linear-regression-angle
 *         Linear intercept angle indicator
 *
 * @extends      plotOptions.linearregression
 * @since        7.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires  stock/indicators/regressions
 * @optionparent plotOptions.linearregressionangle
 */
LinearRegressionAngleIndicator.defaultOptions = LinearRegressionAngleIndicator_merge(LinearRegressionAngleIndicator_LinearRegressionIndicator.defaultOptions, {
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
            '{series.name}: <b>{point.y}°</b><br/>'
    }
});
LinearRegressionAngleIndicator_extend(LinearRegressionAngleIndicator.prototype, {
    nameBase: 'Linear Regression Angle Indicator'
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('linearRegressionAngle', LinearRegressionAngleIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const LinearRegressionAngle_LinearRegressionAngleIndicator = ((/* unused pure expression or super */ null && (LinearRegressionAngleIndicator)));
/**
 * A linear regression intercept series. If the
 * [type](#series.linearregressionangle.type) option is not specified, it is
 * inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.linearregressionangle
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser,dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/regressions
 * @apioption series.linearregressionangle
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/ABands/ABandsIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */



const { sma: ABandsIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { correctFloat: ABandsIndicator_correctFloat, extend: ABandsIndicator_extend, merge: ABandsIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Functions
 *
 * */
/**
 * @private
 */
function getBaseForBand(low, high, factor) {
    return (((ABandsIndicator_correctFloat(high - low)) /
        ((ABandsIndicator_correctFloat(high + low)) / 2)) * 1000) * factor;
}
/**
 * @private
 */
function getPointUB(high, base) {
    return high * (ABandsIndicator_correctFloat(1 + 2 * base));
}
/**
 * @private
 */
function getPointLB(low, base) {
    return low * (ABandsIndicator_correctFloat(1 - 2 * base));
}
/* *
 *
 *  Class
 *
 * */
/**
 * The ABands series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.abands
 *
 * @augments Highcharts.Series
 */
class ABandsIndicator extends ABandsIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const period = params.period, factor = params.factor, index = params.index, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, 
        // Upperbands
        UB = [], 
        // Lowerbands
        LB = [], 
        // ABANDS array structure:
        // 0-date, 1-top line, 2-middle line, 3-bottom line
        ABANDS = [], low = 2, high = 1, xData = [], yData = [];
        // Middle line, top line and bottom line
        let ML, TL, BL, date, bandBase, pointSMA, ubSMA, lbSMA, slicedX, slicedY, i;
        if (yValLen < period) {
            return;
        }
        for (i = 0; i <= yValLen; i++) {
            // Get UB and LB values of every point. This condition
            // is necessary, because there is a need to calculate current
            // UB nad LB values simultaneously with given period SMA
            // in one for loop.
            if (i < yValLen) {
                bandBase = getBaseForBand(yVal[i][low], yVal[i][high], factor);
                UB.push(getPointUB(yVal[i][high], bandBase));
                LB.push(getPointLB(yVal[i][low], bandBase));
            }
            if (i >= period) {
                slicedX = xVal.slice(i - period, i);
                slicedY = yVal.slice(i - period, i);
                ubSMA = super.getValues.call(this, {
                    xData: slicedX,
                    yData: UB.slice(i - period, i)
                }, {
                    period: period
                });
                lbSMA = super.getValues.call(this, {
                    xData: slicedX,
                    yData: LB.slice(i - period, i)
                }, {
                    period: period
                });
                pointSMA = super.getValues.call(this, {
                    xData: slicedX,
                    yData: slicedY
                }, {
                    period: period,
                    index: index
                });
                date = pointSMA.xData[0];
                TL = ubSMA.yData[0];
                BL = lbSMA.yData[0];
                ML = pointSMA.yData[0];
                ABANDS.push([date, TL, ML, BL]);
                xData.push(date);
                yData.push([TL, ML, BL]);
            }
        }
        return {
            values: ABANDS,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Acceleration bands (ABANDS). This series requires the `linkedTo` option
 * to be set and should be loaded after the
 * `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/acceleration-bands
 *         Acceleration Bands
 *
 * @extends      plotOptions.sma
 * @mixes        Highcharts.MultipleLinesMixin
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking,
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/acceleration-bands
 * @optionparent plotOptions.abands
 */
ABandsIndicator.defaultOptions = ABandsIndicator_merge(ABandsIndicator_SMAIndicator.defaultOptions, {
    /**
     * Option for fill color between lines in Accelleration bands Indicator.
     *
     * @sample {highstock} stock/indicators/indicator-area-fill
     *      Background fill between lines.
     *
     * @type {Highcharts.Color}
     * @since 9.3.2
     * @apioption plotOptions.abands.fillColor
     *
     */
    params: {
        period: 20,
        /**
         * The algorithms factor value used to calculate bands.
         *
         * @product highstock
         */
        factor: 0.001,
        index: 3
    },
    lineWidth: 1,
    topLine: {
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1
        }
    },
    bottomLine: {
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1
        }
    },
    dataGrouping: {
        approximation: 'averages'
    }
});
ABandsIndicator_extend(ABandsIndicator.prototype, {
    areaLinesNames: ['top', 'bottom'],
    linesApiNames: ['topLine', 'bottomLine'],
    nameBase: 'Acceleration Bands',
    nameComponents: ['period', 'factor'],
    pointArrayMap: ['top', 'middle', 'bottom'],
    pointValKey: 'middle'
});
Indicators_MultipleLinesComposition.compose(ABandsIndicator);
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('abands', ABandsIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const ABands_ABandsIndicator = ((/* unused pure expression or super */ null && (ABandsIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * An Acceleration bands indicator. If the [type](#series.abands.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.abands
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *            stacking, showInNavigator,
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/acceleration-bands
 * @apioption series.abands
 */
''; // To include the above in jsdoc

;// ./code/es-modules/Stock/Indicators/TrendLine/TrendLineIndicator.js
/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: TrendLineIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { extend: TrendLineIndicator_extend, merge: TrendLineIndicator_merge, isArray: TrendLineIndicator_isArray } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Trend line series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.trendline
 *
 * @augments Highcharts.Series
 */
class TrendLineIndicator extends TrendLineIndicator_SMAIndicator {
    constructor() {
        /* *
         *
         *  Static Properties
         *
         * */
        super(...arguments);
        this.updateAllPoints = true;
    }
    /* *
     *
     *  Functions
     *
     * */
    getValues(series, params) {
        const orgXVal = series.xData, yVal = series.yData, xVal = [], LR = [], xData = [], yData = [], index = params.index;
        let numerator = 0, denominator = 0, xValSum = 0, yValSum = 0, counter = 0;
        // Create an array of consecutive xValues, (don't remove duplicates)
        for (let i = 0; i < orgXVal.length; i++) {
            if (i === 0 || orgXVal[i] !== orgXVal[i - 1]) {
                counter++;
            }
            xVal.push(counter);
        }
        for (let i = 0; i < xVal.length; i++) {
            xValSum += xVal[i];
            yValSum += TrendLineIndicator_isArray(yVal[i]) ? yVal[i][index] : yVal[i];
        }
        const meanX = xValSum / xVal.length, meanY = yValSum / yVal.length;
        for (let i = 0; i < xVal.length; i++) {
            const y = TrendLineIndicator_isArray(yVal[i]) ? yVal[i][index] : yVal[i];
            numerator += (xVal[i] - meanX) * (y - meanY);
            denominator += Math.pow(xVal[i] - meanX, 2);
        }
        // Calculate linear regression:
        for (let i = 0; i < xVal.length; i++) {
            // Check if the xVal is already used
            if (orgXVal[i] === xData[xData.length - 1]) {
                continue;
            }
            const x = orgXVal[i], y = meanY + (numerator / denominator) * (xVal[i] - meanX);
            LR.push([x, y]);
            xData.push(x);
            yData.push(y);
        }
        return {
            xData: xData,
            yData: yData,
            values: LR
        };
    }
}
/**
 * Trendline (linear regression) fits a straight line to the selected data
 * using a method called the Sum Of Least Squares. This series requires the
 * `linkedTo` option to be set.
 *
 * @sample stock/indicators/trendline
 *         Trendline indicator
 *
 * @extends      plotOptions.sma
 * @since        7.1.3
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/trendline
 * @optionparent plotOptions.trendline
 */
TrendLineIndicator.defaultOptions = TrendLineIndicator_merge(TrendLineIndicator_SMAIndicator.defaultOptions, {
    /**
     * @excluding period
     */
    params: {
        period: void 0, // Unchangeable period, do not inherit (#15362)
        /**
         * The point index which indicator calculations will base. For
         * example using OHLC data, index=2 means the indicator will be
         * calculated using Low values.
         *
         * @default 3
         */
        index: 3
    }
});
TrendLineIndicator_extend(TrendLineIndicator.prototype, {
    nameBase: 'Trendline',
    nameComponents: void 0
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('trendline', TrendLineIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const TrendLine_TrendLineIndicator = ((/* unused pure expression or super */ null && (TrendLineIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * A `TrendLine` series. If the [type](#series.trendline.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.trendline
 * @since     7.1.3
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/trendline
 * @apioption series.trendline
 */
''; // To include the above in the js output

;// ./code/es-modules/Stock/Indicators/DisparityIndex/DisparityIndexIndicator.js
/* *
 *  (c) 2010-2025 Rafal Sebestjanski
 *
 *  Disparity Index technical indicator for Highcharts Stock
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */


const { sma: DisparityIndexIndicator_SMAIndicator } = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes;

const { correctFloat: DisparityIndexIndicator_correctFloat, defined: DisparityIndexIndicator_defined, extend: DisparityIndexIndicator_extend, isArray: DisparityIndexIndicator_isArray, merge: DisparityIndexIndicator_merge } = (external_highcharts_src_js_default_default());
/* *
 *
 *  Class
 *
 * */
/**
 * The Disparity Index series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.disparityindex
 *
 * @augments Highcharts.Series
 */
class DisparityIndexIndicator extends DisparityIndexIndicator_SMAIndicator {
    /* *
     *
     *  Functions
     *
     * */
    init() {
        const args = arguments, ctx = this, // Disparity Index indicator
        params = args[1].params, // Options.params
        averageType = params && params.average ? params.average : void 0;
        ctx.averageIndicator = (external_highcharts_src_js_default_SeriesRegistry_default()).seriesTypes[averageType] || DisparityIndexIndicator_SMAIndicator;
        ctx.averageIndicator.prototype.init.apply(ctx, args);
    }
    calculateDisparityIndex(curPrice, periodAverage) {
        return DisparityIndexIndicator_correctFloat(curPrice - periodAverage) / periodAverage * 100;
    }
    getValues(series, params) {
        const index = params.index, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, disparityIndexPoint = [], xData = [], yData = [], 
        // "as any" because getValues doesn't exist on typeof Series
        averageIndicator = this.averageIndicator, isOHLC = DisparityIndexIndicator_isArray(yVal[0]), 
        // Get the average indicator's values
        values = averageIndicator.prototype.getValues(series, params), yValues = values.yData, start = xVal.indexOf(values.xData[0]);
        // Check period, if bigger than points length, skip
        if (!yValues || yValues.length === 0 ||
            !DisparityIndexIndicator_defined(index) ||
            yVal.length <= start) {
            return;
        }
        // Get the Disparity Index indicator's values
        for (let i = start; i < yValLen; i++) {
            const disparityIndexValue = this.calculateDisparityIndex(isOHLC ? yVal[i][index] : yVal[i], yValues[i - start]);
            disparityIndexPoint.push([
                xVal[i],
                disparityIndexValue
            ]);
            xData.push(xVal[i]);
            yData.push(disparityIndexValue);
        }
        return {
            values: disparityIndexPoint,
            xData: xData,
            yData: yData
        };
    }
}
/* *
 *
 *  Static Properties
 *
 * */
/**
 * Disparity Index.
 * This series requires the `linkedTo` option to be set and should
 * be loaded after the `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/disparity-index
 *         Disparity Index indicator
 *
 * @extends      plotOptions.sma
 * @since 9.1.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/disparity-index
 * @optionparent plotOptions.disparityindex
 */
DisparityIndexIndicator.defaultOptions = DisparityIndexIndicator_merge(DisparityIndexIndicator_SMAIndicator.defaultOptions, {
    params: {
        /**
         * The average used to calculate the Disparity Index indicator.
         * By default it uses SMA, with EMA as an option. To use other
         * averages, e.g. TEMA, the `stock/indicators/tema.js` file needs to
         * be loaded.
         *
         * If value is different than `ema`, `dema`, `tema` or `wma`,
         * then sma is used.
         */
        average: 'sma',
        index: 3
    },
    marker: {
        enabled: false
    },
    dataGrouping: {
        approximation: 'averages'
    }
});
DisparityIndexIndicator_extend(DisparityIndexIndicator.prototype, {
    nameBase: 'Disparity Index',
    nameComponents: ['period', 'average']
});
external_highcharts_src_js_default_SeriesRegistry_default().registerSeriesType('disparityindex', DisparityIndexIndicator);
/* *
 *
 *  Default Export
 *
 * */
/* harmony default export */ const DisparityIndex_DisparityIndexIndicator = ((/* unused pure expression or super */ null && (DisparityIndexIndicator)));
/* *
 *
 *  API Options
 *
 * */
/**
 * The Disparity Index indicator series.
 * If the [type](#series.disparityindex.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.disparityindex
 * @since 9.1.0
 * @product   highstock
 * @excluding allAreas, colorAxis,  dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/disparity-index
 * @apioption series.disparityindex
 */
''; // To include the above in the js output

;// external "../modules/stock.src.js"
var x = (y) => {
	var x = {}; __webpack_require__.d(x,
    	y); return x
    } 
    var y = (x) => (() => (x))
    const stock_src_js_namespaceObject = x({  });
;// ./code/es-modules/masters/indicators/indicators-all.src.js





















































const G = (external_highcharts_src_js_default_default());
G.MultipleLinesComposition =
    G.MultipleLinesComposition || Indicators_MultipleLinesComposition;
/* harmony default export */ const indicators_all_src = ((external_highcharts_src_js_default_default()));

export { indicators_all_src as default };
