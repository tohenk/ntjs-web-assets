/**
 * Highcharts Gantt JS v12.3.0 (2025-06-21)
 * @module highcharts/modules/current-date-indicator
 * @requires highcharts
 *
 * CurrentDateIndicator
 *
 * (c) 2010-2025 Lars A. V. Cabrera
 *
 * License: www.highcharts.com/license
 */import*as t from"../highcharts.js";var e={};e.n=t=>{var a=t&&t.__esModule?()=>t.default:()=>t;return e.d(a,{a:a}),a},e.d=(t,a)=>{for(var r in a)e.o(a,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:a[r]})},e.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);let a=t.default;var r=e.n(a);let{composed:o}=r(),{addEvent:l,merge:n,pushUnique:i,wrap:s}=r(),c={color:"#ccd3ff",width:2,label:{format:"%[abdYHM]",formatter:function(t,e){return this.axis.chart.time.dateFormat(e||"",t,!0)},rotation:0,style:{fontSize:"0.7em"}}};function f(){let t=this.options,e=t.currentDateIndicator;if(e){let a="object"==typeof e?n(c,e):n(c);a.value=Date.now(),a.className="highcharts-current-date-indicator",t.plotLines||(t.plotLines=[]),t.plotLines.push(a)}}function u(){this.label&&this.label.attr({text:this.getLabelText(this.options.label)})}function d(t,e){let a=this.options;return a&&a.className&&-1!==a.className.indexOf("highcharts-current-date-indicator")&&a.label&&"function"==typeof a.label.formatter?(a.value=Date.now(),a.label.formatter.call(this,a.value,a.label.format)):t.call(this,e)}let h=r();({compose:function(t,e){i(o,"CurrentDateIndication")&&(l(t,"afterSetOptions",f),l(e,"render",u),s(e.prototype,"getLabelText",d))}}).compose(h.Axis,h.PlotLineOrBand);let p=r();export{p as default};