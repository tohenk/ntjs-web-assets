!/**
 * Highstock JS v12.3.0 (2025-06-21)
 * @module highcharts/indicators/natr
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2025 Paweł Dalek
 *
 * License: www.highcharts.com/license
 */function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(e._Highcharts,e._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/natr",["highcharts/highcharts"],function(e){return t(e,e.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/natr"]=t(e._Highcharts,e._Highcharts.SeriesRegistry):e.Highcharts=t(e.Highcharts,e.Highcharts.SeriesRegistry)}("undefined"==typeof window?this:window,(e,t)=>(()=>{"use strict";var r={512:e=>{e.exports=t},944:t=>{t.exports=e}},s={};function i(e){var t=s[e];if(void 0!==t)return t.exports;var a=s[e]={exports:{}};return r[e](a,a.exports,i),a.exports}i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var r in t)i.o(t,r)&&!i.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var a={};i.d(a,{default:()=>f});var o=i(944),n=i.n(o),h=i(512),u=i.n(h);let{atr:p}=u().seriesTypes,{merge:c}=n();class d extends p{getValues(e,t){let r=super.getValues.apply(this,arguments),s=r.values.length,i=e.yData,a=0,o=t.period-1;if(r){for(;a<s;a++)r.yData[a]=r.values[a][1]/i[o][3]*100,r.values[a][1]=r.yData[a],o++;return r}}}d.defaultOptions=c(p.defaultOptions,{tooltip:{valueSuffix:"%"}}),u().registerSeriesType("natr",d);let f=n();return a.default})());