/**
 * Highstock JS v12.3.0 (2025-06-21)
 * @module highcharts/indicators/zigzag
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2025 Kacper Madej
 *
 * License: www.highcharts.com/license
 */import*as e from"../highcharts.js";import"../modules/stock.js";var t={};t.n=e=>{var a=e&&e.__esModule?()=>e.default:()=>e;return t.d(a,{a:a}),a},t.d=(e,a)=>{for(var s in a)t.o(a,s)&&!t.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:a[s]})},t.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);let a=e.default;var s=t.n(a);t.d({},{});let r=e.default.SeriesRegistry;var o=t.n(r);let{sma:i}=o().seriesTypes,{merge:l,extend:n}=s();class h extends i{getValues(e,t){let a=t.lowIndex,s=t.highIndex,r=t.deviation/100,o={low:1+r,high:1-r},i=e.xData,l=e.yData,n=l?l.length:0,h=[],d=[],p=[],u,g,f,v,m=!1,x=!1;if(!i||i.length<=1||n&&(void 0===l[0][a]||void 0===l[0][s]))return;let c=l[0][a],y=l[0][s];for(u=1;u<n;u++)l[u][a]<=y*o.high?(h.push([i[0],y]),f=[i[u],l[u][a]],v=!0,m=!0):l[u][s]>=c*o.low&&(h.push([i[0],c]),f=[i[u],l[u][s]],v=!1,m=!0),m&&(d.push(h[0][0]),p.push(h[0][1]),g=u++,u=n);for(u=g;u<n;u++)v?(l[u][a]<=f[1]&&(f=[i[u],l[u][a]]),l[u][s]>=f[1]*o.low&&(x=s)):(l[u][s]>=f[1]&&(f=[i[u],l[u][s]]),l[u][a]<=f[1]*o.high&&(x=a)),!1!==x&&(h.push(f),d.push(f[0]),p.push(f[1]),f=[i[u],l[u][x]],v=!v,x=!1);let w=h.length;return 0!==w&&h[w-1][0]<i[n-1]&&(h.push(f),d.push(f[0]),p.push(f[1])),{values:h,xData:d,yData:p}}}h.defaultOptions=l(i.defaultOptions,{params:{index:void 0,period:void 0,lowIndex:2,highIndex:1,deviation:1}}),n(h.prototype,{nameComponents:["deviation"],nameSuffixes:["%"],nameBase:"Zig Zag"}),o().registerSeriesType("zigzag",h);let d=s();export{d as default};