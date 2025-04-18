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
import Color from '../../Core/Color/Color.js';
import ColorMapComposition from '../ColorMapComposition.js';
import HeatmapPoint from './HeatmapPoint.js';
import HeatmapSeriesDefaults from './HeatmapSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const { series: Series, seriesTypes: { column: ColumnSeries, scatter: ScatterSeries } } = SeriesRegistry;
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
const { prototype: { symbols } } = SVGRenderer;
import U from '../../Core/Utilities.js';
const { addEvent, extend, fireEvent, isNumber, merge, pick } = U;
import IU from '../InterpolationUtilities.js';
const { colorFromPoint, getContext } = IU;
/* *
 *
 *  Class
 *
 * */
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.heatmap
 *
 * @augments Highcharts.Series
 */
class HeatmapSeries extends ScatterSeries {
    constructor() {
        /* *
         *
         *  Static Properties
         *
         * */
        super(...arguments);
        this.valueMax = NaN;
        this.valueMin = NaN;
        this.isDirtyCanvas = true;
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * @private
     */
    drawPoints() {
        const series = this, seriesOptions = series.options, interpolation = seriesOptions.interpolation, seriesMarkerOptions = seriesOptions.marker || {};
        if (interpolation) {
            const { image, chart, xAxis, yAxis } = series, { reversed: xRev = false, len: width } = xAxis, { reversed: yRev = false, len: height } = yAxis, dimensions = { width, height };
            if (!image || series.isDirtyData || series.isDirtyCanvas) {
                const ctx = getContext(series), { canvas, options: { colsize = 1, rowsize = 1 }, points, points: { length } } = series, pointsLen = length - 1, colorAxis = (chart.colorAxis && chart.colorAxis[0]);
                if (canvas && ctx && colorAxis) {
                    const { min: xMin, max: xMax } = xAxis.getExtremes(), { min: yMin, max: yMax } = yAxis.getExtremes(), xDelta = xMax - xMin, yDelta = yMax - yMin, imgMultiple = 8.0, lastX = Math.round(imgMultiple * ((xDelta / colsize) / imgMultiple)), lastY = Math.round(imgMultiple * ((yDelta / rowsize) / imgMultiple)), [transformX, transformY] = [
                        [lastX, lastX / xDelta, xRev, 'ceil'],
                        [lastY, lastY / yDelta, !yRev, 'floor']
                    ].map(([last, scale, rev, rounding]) => (rev ?
                        (v) => (Math[rounding](last -
                            (scale * (v)))) :
                        (v) => (Math[rounding](scale * v)))), canvasWidth = canvas.width = lastX + 1, canvasHeight = canvas.height = lastY + 1, canvasArea = canvasWidth * canvasHeight, pixelToPointScale = pointsLen / canvasArea, pixelData = new Uint8ClampedArray(canvasArea * 4), pointInPixels = (x, y) => (Math.ceil((canvasWidth * transformY(y - yMin)) +
                        transformX(x - xMin)) * 4);
                    series.buildKDTree();
                    for (let i = 0; i < canvasArea; i++) {
                        const point = points[Math.ceil(pixelToPointScale * i)], { x, y } = point;
                        pixelData.set(colorFromPoint(point.value, point), pointInPixels(x, y));
                    }
                    ctx.putImageData(new ImageData(pixelData, canvasWidth), 0, 0);
                    if (image) {
                        image.attr({
                            ...dimensions,
                            href: canvas.toDataURL('image/png', 1)
                        });
                    }
                    else {
                        series.directTouch = false;
                        series.image = chart.renderer.image(canvas.toDataURL('image/png', 1))
                            .attr(dimensions)
                            .add(series.group);
                    }
                }
                series.isDirtyCanvas = false;
            }
            else if (image.width !== width || image.height !== height) {
                image.attr(dimensions);
            }
        }
        else if (seriesMarkerOptions.enabled || series._hasPointMarkers) {
            Series.prototype.drawPoints.call(series);
            series.points.forEach((point) => {
                if (point.graphic) {
                    // In styled mode, use CSS, otherwise the fill used in
                    // the style sheet will take precedence over
                    // the fill attribute.
                    point.graphic[series.chart.styledMode ? 'css' : 'animate'](series.colorAttribs(point));
                    if (point.value === null) { // #15708
                        point.graphic.addClass('highcharts-null-point');
                    }
                }
            });
        }
    }
    /**
     * @private
     */
    getExtremes() {
        // Get the extremes from the value data
        const { dataMin, dataMax } = Series.prototype.getExtremes
            .call(this, this.getColumn('value'));
        if (isNumber(dataMin)) {
            this.valueMin = dataMin;
        }
        if (isNumber(dataMax)) {
            this.valueMax = dataMax;
        }
        // Get the extremes from the y data
        return Series.prototype.getExtremes.call(this);
    }
    /**
     * Override to also allow null points, used when building the k-d-tree for
     * tooltips in boost mode.
     * @private
     */
    getValidPoints(points, insideOnly) {
        return Series.prototype.getValidPoints.call(this, points, insideOnly, true);
    }
    /**
     * Define hasData function for non-cartesian series. Returns true if the
     * series has points at all.
     * @private
     */
    hasData() {
        return !!this.dataTable.rowCount;
    }
    /**
     * Override the init method to add point ranges on both axes.
     * @private
     */
    init() {
        super.init.apply(this, arguments);
        const options = this.options;
        // #3758, prevent resetting in setData
        options.pointRange = pick(options.pointRange, options.colsize || 1);
        // General point range
        this.yAxis.axisPointRange = options.rowsize || 1;
        // Bind new symbol names
        symbols.ellipse = symbols.circle;
        // @todo
        //
        // Setting the border radius here is a workaround. It should be set in
        // the shapeArgs or returned from `markerAttribs`. However,
        // Series.drawPoints does not pick up markerAttribs to be passed over to
        // `renderer.symbol`. Also, image symbols are not positioned by their
        // top left corner like other symbols are. This should be refactored,
        // then we could save ourselves some tests for .hasImage etc. And the
        // evaluation of borderRadius would be moved to `markerAttribs`.
        if (options.marker && isNumber(options.borderRadius)) {
            options.marker.r = options.borderRadius;
        }
    }
    /**
     * @private
     */
    markerAttribs(point, state) {
        const shapeArgs = point.shapeArgs || {};
        if (point.hasImage) {
            return {
                x: point.plotX,
                y: point.plotY
            };
        }
        // Setting width and height attributes on image does not affect on its
        // dimensions.
        if (state && state !== 'normal') {
            const pointMarkerOptions = point.options.marker || {}, seriesMarkerOptions = this.options.marker || {}, seriesStateOptions = (seriesMarkerOptions.states?.[state]) || {}, pointStateOptions = (pointMarkerOptions.states?.[state]) || {};
            // Set new width and height basing on state options.
            const width = (pointStateOptions.width ||
                seriesStateOptions.width ||
                shapeArgs.width ||
                0) + (pointStateOptions.widthPlus ||
                seriesStateOptions.widthPlus ||
                0);
            const height = (pointStateOptions.height ||
                seriesStateOptions.height ||
                shapeArgs.height ||
                0) + (pointStateOptions.heightPlus ||
                seriesStateOptions.heightPlus ||
                0);
            // Align marker by the new size.
            const x = (shapeArgs.x || 0) + ((shapeArgs.width || 0) - width) / 2, y = (shapeArgs.y || 0) + ((shapeArgs.height || 0) - height) / 2;
            return { x, y, width, height };
        }
        return shapeArgs;
    }
    /**
     * @private
     */
    pointAttribs(point, state) {
        const series = this, attr = Series.prototype.pointAttribs.call(series, point, state), seriesOptions = series.options || {}, plotOptions = series.chart.options.plotOptions || {}, seriesPlotOptions = plotOptions.series || {}, heatmapPlotOptions = plotOptions.heatmap || {}, 
        // Get old properties in order to keep backward compatibility
        borderColor = point?.options.borderColor ||
            seriesOptions.borderColor ||
            heatmapPlotOptions.borderColor ||
            seriesPlotOptions.borderColor, borderWidth = point?.options.borderWidth ||
            seriesOptions.borderWidth ||
            heatmapPlotOptions.borderWidth ||
            seriesPlotOptions.borderWidth ||
            attr['stroke-width'];
        // Apply lineColor, or set it to default series color.
        attr.stroke = (point?.marker?.lineColor ||
            seriesOptions.marker?.lineColor ||
            borderColor ||
            this.color);
        // Apply old borderWidth property if exists.
        attr['stroke-width'] = borderWidth;
        if (state && state !== 'normal') {
            const stateOptions = merge(seriesOptions.states?.[state], seriesOptions.marker?.states?.[state], point?.options.states?.[state] || {});
            attr.fill =
                stateOptions.color ||
                    Color.parse(attr.fill).brighten(stateOptions.brightness || 0).get();
            attr.stroke = (stateOptions.lineColor || attr.stroke); // #17896
        }
        return attr;
    }
    /**
     * @private
     */
    translate() {
        const series = this, options = series.options, { borderRadius, marker } = options, symbol = marker?.symbol || 'rect', shape = symbols[symbol] ? symbol : 'rect', hasRegularShape = ['circle', 'square'].indexOf(shape) !== -1;
        series.generatePoints();
        for (const point of series.points) {
            const cellAttr = point.getCellAttributes();
            let x = Math.min(cellAttr.x1, cellAttr.x2), y = Math.min(cellAttr.y1, cellAttr.y2), width = Math.max(Math.abs(cellAttr.x2 - cellAttr.x1), 0), height = Math.max(Math.abs(cellAttr.y2 - cellAttr.y1), 0);
            point.hasImage = (point.marker?.symbol || symbol || '').indexOf('url') === 0;
            // If marker shape is regular (square), find the shorter cell's
            // side.
            if (hasRegularShape) {
                const sizeDiff = Math.abs(width - height);
                x = Math.min(cellAttr.x1, cellAttr.x2) +
                    (width < height ? 0 : sizeDiff / 2);
                y = Math.min(cellAttr.y1, cellAttr.y2) +
                    (width < height ? sizeDiff / 2 : 0);
                width = height = Math.min(width, height);
            }
            if (point.hasImage) {
                point.marker = { width, height };
            }
            point.plotX = point.clientX = (cellAttr.x1 + cellAttr.x2) / 2;
            point.plotY = (cellAttr.y1 + cellAttr.y2) / 2;
            point.shapeType = 'path';
            point.shapeArgs = merge(true, { x, y, width, height }, {
                d: symbols[shape](x, y, width, height, { r: isNumber(borderRadius) ? borderRadius : 0 })
            });
        }
        fireEvent(series, 'afterTranslate');
    }
}
HeatmapSeries.defaultOptions = merge(ScatterSeries.defaultOptions, HeatmapSeriesDefaults);
addEvent(HeatmapSeries, 'afterDataClassLegendClick', function () {
    this.isDirtyCanvas = true;
    this.drawPoints();
});
extend(HeatmapSeries.prototype, {
    axisTypes: ColorMapComposition.seriesMembers.axisTypes,
    colorKey: ColorMapComposition.seriesMembers.colorKey,
    directTouch: true,
    getExtremesFromAll: true,
    keysAffectYAxis: ['y'],
    parallelArrays: ColorMapComposition.seriesMembers.parallelArrays,
    pointArrayMap: ['y', 'value'],
    pointClass: HeatmapPoint,
    specialGroup: 'group',
    trackerGroups: ColorMapComposition.seriesMembers.trackerGroups,
    /**
     * @private
     */
    alignDataLabel: ColumnSeries.prototype.alignDataLabel,
    colorAttribs: ColorMapComposition.seriesMembers.colorAttribs,
    getSymbol: Series.prototype.getSymbol
});
ColorMapComposition.compose(HeatmapSeries);
SeriesRegistry.registerSeriesType('heatmap', HeatmapSeries);
/* *
 *
 *  Default Export
 *
 * */
export default HeatmapSeries;
/* *
 *
 *  API Declarations
 *
 * */
/**
 * Heatmap series only. Padding between the points in the heatmap.
 * @name Highcharts.Point#pointPadding
 * @type {number|undefined}
 */
/**
 * Heatmap series only. The value of the point, resulting in a color
 * controlled by options as set in the colorAxis configuration.
 * @name Highcharts.Point#value
 * @type {number|null|undefined}
 */
/* *
 * @interface Highcharts.PointOptionsObject in parts/Point.ts
 */ /**
* Heatmap series only. Point padding for a single point.
* @name Highcharts.PointOptionsObject#pointPadding
* @type {number|undefined}
*/ /**
* Heatmap series only. The value of the point, resulting in a color controlled
* by options as set in the colorAxis configuration.
* @name Highcharts.PointOptionsObject#value
* @type {number|null|undefined}
*/
''; // Detach doclets above
