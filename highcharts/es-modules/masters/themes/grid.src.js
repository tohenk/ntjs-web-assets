/**
 * @license Highcharts JS v12.3.0 (2025-06-21)
 * @module highcharts/themes/grid
 * @requires highcharts
 *
 * (c) 2009-2025 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../../Core/Globals.js';
import GridTheme from '../../Extensions/Themes/Grid.js';
H.theme = GridTheme.options;
GridTheme.apply();
export default H;
