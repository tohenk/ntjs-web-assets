!/**
 * Highstock JS v12.3.0 (2025-06-21)
 * @module highcharts/indicators/williams-r
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2025 Wojciech Chmiel
 *
 * License: www.highcharts.com/license
 */function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(e._Highcharts,e._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/williams-r",["highcharts/highcharts"],function(e){return t(e,e.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/williams-r"]=t(e._Highcharts,e._Highcharts.SeriesRegistry):e.Highcharts=t(e.Highcharts,e.Highcharts.SeriesRegistry)}("undefined"==typeof window?this:window,(e,t)=>(()=>{"use strict";var r={512:e=>{e.exports=t},944:t=>{t.exports=e}},s={};function i(e){var t=s[e];if(void 0!==t)return t.exports;var a=s[e]={exports:{}};return r[e](a,a.exports,i),a.exports}i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var r in t)i.o(t,r)&&!i.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var a={};i.d(a,{default:()=>y});var o=i(944),n=i.n(o);let h={getArrayExtremes:function(e,t,r){return e.reduce((e,s)=>[Math.min(e[0],s[t]),Math.max(e[1],s[r])],[Number.MAX_VALUE,-Number.MAX_VALUE])}};var p=i(512),u=i.n(p);let{sma:l}=u().seriesTypes,{extend:d,isArray:c,merge:f}=n();class g extends l{getValues(e,t){let r,s,i,a,o,n,p=t.period,u=e.xData,l=e.yData,d=l?l.length:0,f=[],g=[],y=[];if(!(u.length<p)&&c(l[0])&&4===l[0].length){for(n=p-1;n<d;n++)r=l.slice(n-p+1,n+1),o=(s=h.getArrayExtremes(r,2,1))[0],i=-(((a=s[1])-l[n][3])/(a-o)*100),u[n]&&(f.push([u[n],i]),g.push(u[n]),y.push(i));return{values:f,xData:g,yData:y}}}}g.defaultOptions=f(l.defaultOptions,{params:{index:void 0,period:14}}),d(g.prototype,{nameBase:"Williams %R"}),u().registerSeriesType("williamsr",g);let y=n();return a.default})());