/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Annotation from '../Annotation.js';
import ControlPoint from '../ControlPoint.js';
import D from '../../../Core/Defaults.js';
const { defaultOptions } = D;
import MockPoint from '../MockPoint.js';
import U from '../../../Core/Utilities.js';
const { merge } = U;
if (defaultOptions.annotations) {
    /**
    * Options for the crooked line annotation type.
    *
    * @sample highcharts/annotations-advanced/crooked-line/
    *         Crooked line
    *
    * @product      highstock
    * @optionparent annotations.types.crookedLine
    */
    defaultOptions.annotations.types.crookedLine = {
        /**
         * @extends   annotations.labelOptions
         * @apioption annotations.types.crookedLine.labelOptions
         */
        /**
         * @extends   annotations.shapeOptions
         * @apioption annotations.types.crookedLine.shapeOptions
         */
        /**
         * Additional options for an annotation with the type.
         */
        typeOptions: {
            /**
             * This number defines which xAxis the point is connected to.
             * It refers to either the axis id or the index of the axis
             * in the xAxis array.
             */
            xAxis: 0,
            /**
             * This number defines which yAxis the point is connected to.
             * It refers to either the axis id or the index of the axis
             * in the xAxis array.
             */
            yAxis: 0,
            /**
             * @type      {Array<*>}
             * @apioption annotations.types.crookedLine.typeOptions.points
             */
            /**
             * The x position of the point.
             *
             * @type      {number}
             * @apioption annotations.types.crookedLine.typeOptions.points.x
             */
            /**
             * The y position of the point.
             *
             * @type      {number}
             * @apioption annotations.types.crookedLine.typeOptions.points.y
             */
            /**
             * @type      {number}
             * @excluding positioner, events
             * @apioption annotations.types.crookedLine.typeOptions.points.controlPoint
             */
            /**
             * Line options.
             *
             * @excluding height, point, points, r, type, width
             */
            line: {
                fill: 'none'
            }
        },
        /**
         * @excluding positioner, events
         */
        controlPointOptions: {
            positioner: function (target) {
                const graphic = this.graphic, xy = MockPoint.pointToPixels(target.points[this.index]);
                return {
                    x: xy.x - (graphic.width || 0) / 2,
                    y: xy.y - (graphic.height || 0) / 2
                };
            },
            events: {
                drag: function (e, target) {
                    if (target.chart.isInsidePlot(e.chartX - target.chart.plotLeft, e.chartY - target.chart.plotTop, {
                        visiblePlotOnly: true
                    })) {
                        const translation = this.mouseMoveToTranslation(e), typeOptions = target.options.typeOptions;
                        target.translatePoint(translation.x, translation.y, this.index);
                        // Update options:
                        typeOptions.points[this.index].x =
                            target.points[this.index].x;
                        typeOptions.points[this.index].y =
                            target.points[this.index].y;
                        target.redraw(false);
                    }
                }
            }
        }
    };
}
/* *
 *
 *  Class
 *
 * */
class CrookedLine extends Annotation {
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Overrides default setter to get axes from typeOptions.
     * @private
     */
    setClipAxes() {
        this.clipXAxis = this.chart.xAxis[this.options.typeOptions.xAxis];
        this.clipYAxis = this.chart.yAxis[this.options.typeOptions.yAxis];
    }
    getPointsOptions() {
        const typeOptions = this.options.typeOptions;
        return (typeOptions.points || []).map((pointOptions) => {
            pointOptions.xAxis = typeOptions.xAxis;
            pointOptions.yAxis = typeOptions.yAxis;
            return pointOptions;
        });
    }
    getControlPointsOptions() {
        return this.getPointsOptions();
    }
    addControlPoints() {
        this.getControlPointsOptions().forEach(function (pointOptions, i) {
            const controlPoint = new ControlPoint(this.chart, this, merge(this.options.controlPointOptions, pointOptions.controlPoint), i);
            this.controlPoints.push(controlPoint);
            pointOptions.controlPoint = controlPoint.options;
        }, this);
    }
    addShapes() {
        const typeOptions = this.options.typeOptions, shape = this.initShape(merge(typeOptions.line, {
            type: 'path',
            className: 'highcharts-crooked-lines',
            points: this.points.map((_point, i) => (function (target) {
                return target.annotation.points[i];
            }))
        }), 0);
        typeOptions.line = shape.options;
    }
}
Annotation.types.crookedLine = CrookedLine;
/* *
 *
 *  Default Export
 *
 * */
export default CrookedLine;
