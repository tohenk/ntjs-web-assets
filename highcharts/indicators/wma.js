!/**
 * Highstock JS v12.3.0 (2025-06-21)
 * @module highcharts/indicators/wma
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2025 Kacper Madej
 *
 * License: www.highcharts.com/license
 */function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(e._Highcharts,e._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/wma",["highcharts/highcharts"],function(e){return t(e,e.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/wma"]=t(e._Highcharts,e._Highcharts.SeriesRegistry):e.Highcharts=t(e.Highcharts,e.Highcharts.SeriesRegistry)}("undefined"==typeof window?this:window,(e,t)=>(()=>{"use strict";var r={512:e=>{e.exports=t},944:t=>{t.exports=e}},s={};function i(e){var t=s[e];if(void 0!==t)return t.exports;var n=s[e]={exports:{}};return r[e](n,n.exports,i),n.exports}i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var r in t)i.o(t,r)&&!i.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var n={};i.d(n,{default:()=>y});var a=i(944),o=i.n(a),h=i(512),u=i.n(h);let{sma:p}=u().seriesTypes,{isArray:c,merge:d}=o();function f(e,t,r,s,i){let n=t[s],a=i<0?r[s]:r[s][i];e.push([n,a])}function l(e,t,r,s){let i=e.length,n=e.reduce(function(e,t,r){return[null,e[1]+t[1]*(r+1)]})[1]/((i+1)/2*i),a=t[s-1];return e.shift(),[a,n]}class g extends p{getValues(e,t){let r=t.period,s=e.xData,i=e.yData,n=i?i.length:0,a=s[0],o=[],h=[],u=[],p=1,d=-1,g,y,x=i[0];if(s.length<r)return;c(i[0])&&(d=t.index,x=i[0][d]);let m=[[a,x]];for(;p!==r;)f(m,s,i,p,d),p++;for(g=p;g<n;g++)o.push(y=l(m,s,i,g)),h.push(y[0]),u.push(y[1]),f(m,s,i,g,d);return o.push(y=l(m,s,i,g)),h.push(y[0]),u.push(y[1]),{values:o,xData:h,yData:u}}}g.defaultOptions=d(p.defaultOptions,{params:{index:3,period:9}}),u().registerSeriesType("wma",g);let y=o();return n.default})());