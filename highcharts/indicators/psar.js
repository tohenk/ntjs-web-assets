!/**
 * Highstock JS v11.4.0 (2024-03-04)
 *
 * Parabolic SAR Indicator for Highcharts Stock
 *
 * (c) 2010-2024 Grzegorz Blachliński
 *
 * License: www.highcharts.com/license
 */function(t){"object"==typeof module&&module.exports?(t.default=t,module.exports=t):"function"==typeof define&&define.amd?define("highcharts/indicators/psar",["highcharts","highcharts/modules/stock"],function(e){return t(e),t.Highcharts=e,t}):t("undefined"!=typeof Highcharts?Highcharts:void 0)}(function(t){"use strict";var e=t?t._modules:{};function i(t,e,i,a){t.hasOwnProperty(e)||(t[e]=a.apply(null,i),"function"==typeof CustomEvent&&window.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:e,module:t[e]}})))}i(e,"Stock/Indicators/PSAR/PSARIndicator.js",[e["Core/Series/SeriesRegistry.js"],e["Core/Utilities.js"]],function(t,e){let{sma:i}=t.seriesTypes,{merge:a}=e;function n(t,e){return parseFloat(t.toFixed(e))}class r extends i{constructor(){super(...arguments),this.nameComponents=void 0}getValues(t,e){let i=t.xData,a=t.yData,r=e.maxAccelerationFactor,s=e.increment,o=e.initialAccelerationFactor,l=e.decimals,c=e.index,u=[],d=[],h=[],p=e.initialAccelerationFactor,m,f=a[0][1],x,g,y,v=1,A,F,M,j,C=a[0][2],S,w,D,H;if(!(c>=a.length)){for(H=0;H<c;H++)f=Math.max(a[H][1],f),C=Math.min(a[H][2],n(C,l));for(m=a[H][1]>C?1:-1,x=f-C,g=(p=e.initialAccelerationFactor)*x,u.push([i[c],C]),d.push(i[c]),h.push(n(C,l)),H=c+1;H<a.length;H++)if(A=a[H-1][2],F=a[H-2][2],M=a[H-1][1],j=a[H-2][1],w=a[H][1],D=a[H][2],null!==F&&null!==j&&null!==A&&null!==M&&null!==w&&null!==D){var P,b,k,E,O,R,I,T,W,G,L,U,V;O=m,R=v,I=C,T=g,W=f,C=O===R?1===O?I+T<Math.min(F,A)?I+T:Math.min(F,A):I+T>Math.max(j,M)?I+T:Math.max(j,M):W,P=m,b=f,S=1===P?w>b?w:b:D<b?D:b,k=v,E=C,G=y=1===k&&D>E||-1===k&&w>E?1:-1,L=m,U=f,V=p,g=(p=G===L?1===G&&S>U||-1===G&&S<U?V===r?r:n(V+s,2):V:o)*(x=S-C),u.push([i[H],n(C,l)]),d.push(i[H]),h.push(n(C,l)),v=m,m=y,f=S}return{values:u,xData:d,yData:h}}}}return r.defaultOptions=a(i.defaultOptions,{lineWidth:0,marker:{enabled:!0},states:{hover:{lineWidthPlus:0}},params:{period:void 0,initialAccelerationFactor:.02,maxAccelerationFactor:.2,increment:.02,index:2,decimals:4}}),t.registerSeriesType("psar",r),r}),i(e,"masters/indicators/psar.src.js",[e["Core/Globals.js"]],function(t){return t})});