!/**
 * Highstock JS v12.3.0 (2025-06-21)
 * @module highcharts/indicators/dpo
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2025 Wojciech Chmiel
 *
 * License: www.highcharts.com/license
 */function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(e._Highcharts,e._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/dpo",["highcharts/highcharts"],function(e){return t(e,e.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/dpo"]=t(e._Highcharts,e._Highcharts.SeriesRegistry):e.Highcharts=t(e.Highcharts,e.Highcharts.SeriesRegistry)}("undefined"==typeof window?this:window,(e,t)=>(()=>{"use strict";var r={512:e=>{e.exports=t},944:t=>{t.exports=e}},s={};function o(e){var t=s[e];if(void 0!==t)return t.exports;var i=s[e]={exports:{}};return r[e](i,i.exports,o),i.exports}o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var i={};o.d(i,{default:()=>x});var a=o(944),n=o.n(a),h=o(512),p=o.n(h);let{sma:d}=p().seriesTypes,{extend:u,merge:c,correctFloat:f,pick:l}=n();function g(e,t,r,s,o){let i=l(t[r][s],t[r]);return o?f(e-i):f(e+i)}class y extends d{getValues(e,t){let r=t.period,s=t.index,o=Math.floor(r/2+1),i=r+o,a=e.xData||[],n=e.yData||[],h=n.length,p=[],d=[],u=[],c,f,y,x,v,m=0;if(!(a.length<=i)){for(x=0;x<r-1;x++)m=g(m,n,x,s);for(v=0;v<=h-i;v++)f=v+r-1,y=v+i-1,m=g(m,n,f,s),c=l(n[y][s],n[y])-m/r,m=g(m,n,v,s,!0),p.push([a[y],c]),d.push(a[y]),u.push(c);return{values:p,xData:d,yData:u}}}}y.defaultOptions=c(d.defaultOptions,{params:{index:0,period:21}}),u(y.prototype,{nameBase:"DPO"}),p().registerSeriesType("dpo",y);let x=n();return i.default})());