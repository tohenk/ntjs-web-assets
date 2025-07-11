/**
 * Highcharts JS v12.3.0 (2025-06-21)
 * @module highcharts/modules/pyramid3d
 * @requires highcharts
 * @requires highcharts/highcharts-3d
 * @requires highcharts/modules/cylinder
 * @requires highcharts/modules/funnel3d
 *
 * Highcharts 3D funnel module
 *
 * (c) 2010-2025 Kacper Madej
 *
 * License: www.highcharts.com/license
 */import*as e from"../highcharts.js";import"../highcharts-3d.js";import"./cylinder.js";import"./funnel3d.js";var r={};r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var s in t)r.o(t,s)&&!r.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},r.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r);let t=e.default;var s=r.n(t);r.d({},{}),r.d({},{}),r.d({},{});let a=e.default.SeriesRegistry;var d=r.n(a);let{funnel3d:i}=d().seriesTypes,{merge:l}=s();class n extends i{}n.defaultOptions=l(i.defaultOptions,{reversed:!0,neckHeight:0,neckWidth:0,dataLabels:{verticalAlign:"top"}}),d().registerSeriesType("pyramid3d",n);let o=s();export{o as default};