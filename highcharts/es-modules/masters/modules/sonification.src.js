/**
 * @license Highcharts JS v12.2.0 (2025-04-07)
 * @module highcharts/modules/sonification
 * @requires highcharts
 *
 * Sonification module
 *
 * (c) 2010-2025 Highsoft AS
 * Author: Øystein Moseng
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import Sonification from '../../Extensions/Sonification/Sonification.js';
import SynthPatch from '../../Extensions/Sonification/SynthPatch.js';
import InstrumentPresets from '../../Extensions/Sonification/InstrumentPresets.js';
import Scales from '../../Extensions/Sonification/Scales.js';
import SonificationInstrument from '../../Extensions/Sonification/SonificationInstrument.js';
import SonificationSpeaker from '../../Extensions/Sonification/SonificationSpeaker.js';
import SonificationTimeline from '../../Extensions/Sonification/SonificationTimeline.js';
const G = Highcharts;
// Global objects
G.sonification = {
    InstrumentPresets,
    Scales,
    SynthPatch,
    SonificationInstrument,
    SonificationSpeaker,
    SonificationTimeline,
    Sonification
};
Sonification.compose(G.Chart, G.Series, G.Point);
export default Highcharts;
