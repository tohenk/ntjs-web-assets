/* *
 *
 *  (c) 2010-2025 Torstein Honsi
 *
 *  3D pie series
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../Core/Globals.js';
const { composed, deg2rad } = H;
import Pie3DPoint from './Pie3DPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const { pie: PieSeries } = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const { extend, pick, pushUnique } = U;
/* *
 *
 *  Class
 *
 * */
class Pie3DSeries extends PieSeries {
    /* *
     *
     *  Static Functions
     *
     * */
    static compose(SeriesClass) {
        if (pushUnique(composed, 'Pie3D')) {
            SeriesClass.types.pie = Pie3DSeries;
        }
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * @private
     */
    addPoint() {
        super.addPoint.apply(this, arguments);
        if (this.chart.is3d()) {
            // Destroy (and rebuild) everything!!!
            this.update(this.userOptions, true); // #3845 pass the old options
        }
    }
    /**
     * @private
     */
    animate(init) {
        if (!this.chart.is3d()) {
            super.animate.apply(this, arguments);
        }
        else {
            const center = this.center, group = this.group, markerGroup = this.markerGroup;
            let animation = this.options.animation, attribs;
            if (animation === true) {
                animation = {};
            }
            // Initialize the animation
            if (init) {
                // Scale down the group and place it in the center
                group.oldtranslateX = pick(group.oldtranslateX, group.translateX);
                group.oldtranslateY = pick(group.oldtranslateY, group.translateY);
                attribs = {
                    translateX: center[0],
                    translateY: center[1],
                    scaleX: 0.001, // #1499
                    scaleY: 0.001
                };
                group.attr(attribs);
                if (markerGroup) {
                    markerGroup.attrSetters = group.attrSetters;
                    markerGroup.attr(attribs);
                }
                // Run the animation
            }
            else {
                attribs = {
                    translateX: group.oldtranslateX,
                    translateY: group.oldtranslateY,
                    scaleX: 1,
                    scaleY: 1
                };
                group.animate(attribs, animation);
                if (markerGroup) {
                    markerGroup.animate(attribs, animation);
                }
            }
        }
    }
    /**
     * @private
     */
    getDataLabelPosition(point, distance) {
        const labelPosition = super.getDataLabelPosition(point, distance);
        if (this.chart.is3d()) {
            const options3d = this.chart.options.chart.options3d, shapeArgs = point.shapeArgs, r = shapeArgs.r, 
            // #3240 issue with datalabels for 0 and null values
            a1 = ((shapeArgs.alpha || options3d?.alpha) *
                deg2rad), b1 = ((shapeArgs.beta || options3d?.beta) *
                deg2rad), a2 = (shapeArgs.start + shapeArgs.end) / 2, connectorPosition = labelPosition.connectorPosition, yOffset = (-r * (1 - Math.cos(a1)) * Math.sin(a2)), xOffset = r * (Math.cos(b1) - 1) * Math.cos(a2);
            // Apply perspective on label positions
            for (const coordinates of [
                labelPosition?.natural,
                connectorPosition.breakAt,
                connectorPosition.touchingSliceAt
            ]) {
                coordinates.x += xOffset;
                coordinates.y += yOffset;
            }
        }
        return labelPosition;
    }
    /**
     * @private
     */
    pointAttribs(point) {
        const attr = super.pointAttribs.apply(this, arguments), options = this.options;
        if (this.chart.is3d() && !this.chart.styledMode) {
            attr.stroke = options.edgeColor || point.color || this.color;
            attr['stroke-width'] = pick(options.edgeWidth, 1);
        }
        return attr;
    }
    /**
     * @private
     */
    translate() {
        super.translate.apply(this, arguments);
        // Do not do this if the chart is not 3D
        if (!this.chart.is3d()) {
            return;
        }
        const series = this, seriesOptions = series.options, depth = seriesOptions.depth || 0, options3d = series.chart.options.chart.options3d, alpha = options3d.alpha, beta = options3d.beta;
        let z = seriesOptions.stacking ?
            (seriesOptions.stack || 0) * depth :
            series._i * depth;
        z += depth / 2;
        if (seriesOptions.grouping !== false) {
            z = 0;
        }
        for (const point of series.points) {
            const shapeArgs = point.shapeArgs;
            point.shapeType = 'arc3d';
            shapeArgs.z = z;
            shapeArgs.depth = depth * 0.75;
            shapeArgs.alpha = alpha;
            shapeArgs.beta = beta;
            shapeArgs.center = series.center;
            const angle = (shapeArgs.end + shapeArgs.start) / 2;
            point.slicedTranslation = {
                translateX: Math.round(Math.cos(angle) *
                    seriesOptions.slicedOffset *
                    Math.cos(alpha * deg2rad)),
                translateY: Math.round(Math.sin(angle) *
                    seriesOptions.slicedOffset *
                    Math.cos(alpha * deg2rad))
            };
        }
    }
    /**
     * @private
     */
    drawTracker() {
        super.drawTracker.apply(this, arguments);
        // Do not do this if the chart is not 3D
        if (!this.chart.is3d()) {
            return;
        }
        for (const point of this.points) {
            if (point.graphic) {
                for (const face of ['out', 'inn', 'side1', 'side2']) {
                    if (point.graphic) {
                        point.graphic[face].element.point = point;
                    }
                }
            }
        }
    }
}
extend(Pie3DSeries.prototype, {
    pointClass: Pie3DPoint
});
/* *
 *
 *  Default Export
 *
 * */
export default Pie3DSeries;
/* *
 *
 *  API Options
 *
 * */
/**
 * The thickness of a 3D pie.
 *
 * @type      {number}
 * @default   0
 * @since     4.0
 * @product   highcharts
 * @requires  highcharts-3d
 * @apioption plotOptions.pie.depth
 */
''; // Keeps doclets above after transpiledion
