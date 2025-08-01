/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Annotation from '../Annotation.js';
import CrookedLine from './CrookedLine.js';
import D from '../../../Core/Defaults.js';
const { defaultOptions } = D;
import U from '../../../Core/Utilities.js';
const { merge } = U;
if (defaultOptions.annotations) {
    defaultOptions.annotations.types.elliottWave = merge(defaultOptions.annotations.types.crookedLine, 
    /**
     * Options for the elliott wave annotation type.
     *
     * @sample highcharts/annotations-advanced/elliott-wave/
     *         Elliott wave
     *
     * @extends      annotations.types.crookedLine
     * @product      highstock
     * @optionparent annotations.types.elliottWave
     */
    {
        typeOptions: {
            /**
             * @extends   annotations.types.crookedLine.labelOptions
             * @apioption annotations.types.elliottWave.typeOptions.points.label
             */
            /**
             * @ignore-option
             */
            labels: ['(0)', '(A)', '(B)', '(C)', '(D)', '(E)'],
            line: {
                strokeWidth: 1
            }
        },
        labelOptions: {
            align: 'center',
            allowOverlap: true,
            crop: true,
            overflow: 'none',
            type: 'rect',
            backgroundColor: 'none',
            borderWidth: 0,
            y: -5,
            style: {
                color: "#333333" /* Palette.neutralColor80 */
            }
        }
    });
}
/* *
 *
 *  Class
 *
 * */
class ElliottWave extends CrookedLine {
    /* *
     *
     * Functions
     *
     * */
    addLabels() {
        this.getPointsOptions().forEach((point, i) => {
            const typeOptions = this.options.typeOptions, label = this.initLabel(merge(point.label, {
                text: typeOptions.labels[i],
                point: function (target) {
                    return target.annotation.points[i];
                }
            }), false);
            point.label = label.options;
        });
    }
}
Annotation.types.elliottWave = ElliottWave;
/* *
 *
 *  Default Export
 *
 * */
export default ElliottWave;
