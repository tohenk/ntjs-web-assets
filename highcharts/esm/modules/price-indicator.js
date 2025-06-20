/**
 * Highstock JS v12.3.0 (2025-06-21)
 * @module highcharts/modules/price-indicator
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Advanced Highcharts Stock tools
 *
 * (c) 2010-2025 Highsoft AS
 * Author: Torstein Honsi
 *
 * License: www.highcharts.com/license
 */import*as s from"../highcharts.js";import"./stock.js";var i={};i.n=s=>{var r=s&&s.__esModule?()=>s.default:()=>s;return i.d(r,{a:r}),r},i.d=(s,r)=>{for(var e in r)i.o(r,e)&&!i.o(s,e)&&Object.defineProperty(s,e,{enumerable:!0,get:r[e]})},i.o=(s,i)=>Object.prototype.hasOwnProperty.call(s,i);let r=s.default;var e=i.n(r);i.d({},{});let{composed:t}=e(),{addEvent:o,merge:l,pushUnique:a}=e();function c(){let s=this.options,i=s.lastVisiblePrice,r=s.lastPrice;if((i||r)&&"highcharts-navigator-series"!==s.id){let e=this.xAxis,t=this.yAxis,o=t.crosshair,a=t.cross,c=t.crossLabel,h=this.points,n=h.length,b=this.dataTable.rowCount,d=this.getColumn("x")[b-1],P=this.getColumn("y")[b-1]??this.getColumn("close")[b-1];if(r&&r.enabled&&(t.crosshair=t.options.crosshair=s.lastPrice,!this.chart.styledMode&&t.crosshair&&t.options.crosshair&&s.lastPrice&&(t.crosshair.color=t.options.crosshair.color=s.lastPrice.color||this.color),t.cross=this.lastPrice,this.lastPriceLabel&&this.lastPriceLabel.destroy(),delete t.crossLabel,t.drawCrosshair(null,{x:d,y:P,plotX:e.toPixels(d,!0),plotY:t.toPixels(P,!0)}),this.yAxis.cross&&(this.lastPrice=this.yAxis.cross,this.lastPrice.addClass("highcharts-color-"+this.colorIndex),this.lastPrice.y=P),this.lastPriceLabel=t.crossLabel),i&&i.enabled&&n>0){t.crosshair=t.options.crosshair=l({color:"transparent"},s.lastVisiblePrice),t.cross=this.lastVisiblePrice;let i=h[n-1].isInside?h[n-1]:h[n-2];this.lastVisiblePriceLabel&&this.lastVisiblePriceLabel.destroy(),delete t.crossLabel,t.drawCrosshair(null,i),t.cross&&(this.lastVisiblePrice=t.cross,i&&"number"==typeof i.y&&(this.lastVisiblePrice.y=i.y)),this.lastVisiblePriceLabel=t.crossLabel}t.crosshair=t.options.crosshair=o,t.cross=a,t.crossLabel=c}}({compose:function(s){a(t,"PriceIndication")&&o(s,"afterRender",c)}}).compose(e().Series);let h=e();export{h as default};