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
import Point from '../../Core/Series/Point.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const { seriesTypes: { scatter: { prototype: { pointClass: ScatterPoint } } } } = SeriesRegistry;
import U from '../../Core/Utilities.js';
const { extend } = U;
/* *
 *
 *  Class
 *
 * */
class BubblePoint extends ScatterPoint {
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     */
    haloPath(size) {
        const computedSize = (size && this.marker ?
            this.marker.radius ||
                0 :
            0) + size;
        if (this.series.chart.inverted) {
            const pos = this.pos() || [0, 0], { xAxis, yAxis, chart } = this.series, diameter = computedSize * 2;
            return chart.renderer.symbols.circle((xAxis?.len || 0) - pos[1] - computedSize, (yAxis?.len || 0) - pos[0] - computedSize, diameter, diameter);
        }
        return Point.prototype.haloPath.call(this, 
        // #6067
        computedSize);
    }
}
/* *
 *
 *  Class Prototype
 *
 * */
extend(BubblePoint.prototype, {
    ttBelow: false
});
/* *
 *
 *  Default Export
 *
 * */
export default BubblePoint;
