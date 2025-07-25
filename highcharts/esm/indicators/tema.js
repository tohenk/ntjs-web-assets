/**
 * Highstock JS v12.3.0 (2025-06-21)
 * @module highcharts/indicators/tema
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2025 Rafal Sebestjanski
 *
 * License: www.highcharts.com/license
 */import*as e from"../highcharts.js";import"../modules/stock.js";var l={};l.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return l.d(t,{a:t}),t},l.d=(e,t)=>{for(var r in t)l.o(t,r)&&!l.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},l.o=(e,l)=>Object.prototype.hasOwnProperty.call(e,l);let t=e.default;var r=l.n(t);l.d({},{});let s=e.default.SeriesRegistry;var a=l.n(s);let{ema:v}=a().seriesTypes,{correctFloat:i,isArray:u,merge:o}=r();class p extends v{getEMA(e,l,t,r,s,a){return super.calculateEma(a||[],e,void 0===s?1:s,this.EMApercent,l,void 0===r?-1:r,t)}getTemaPoint(e,l,t,r){return[e[r-3],i(3*t.level1-3*t.level2+t.level3)]}getValues(e,l){let t=l.period,r=2*t,s=3*t,a=e.xData,v=e.yData,i=v?v.length:0,o=[],p=[],n=[],d=[],h=[],c={},g=-1,m=0,f=0,y,E,M,A;if(this.EMApercent=2/(t+1),!(i<3*t-2)){for(u(v[0])&&(g=l.index?l.index:0),f=(m=super.accumulatePeriodPoints(t,g,v))/t,m=0,M=t;M<i+3;M++)M<i+1&&(c.level1=this.getEMA(v,y,f,g,M)[1],d.push(c.level1)),y=c.level1,M<r?m+=c.level1:(M===r&&(f=m/t,m=0),c.level1=d[M-t-1],c.level2=this.getEMA([c.level1],E,f)[1],h.push(c.level2),E=c.level2,M<s?m+=c.level2:(M===s&&(f=m/t),M===i+1&&(c.level1=d[M-t-1],c.level2=this.getEMA([c.level1],E,f)[1],h.push(c.level2)),c.level1=d[M-t-2],c.level2=h[M-2*t-1],c.level3=this.getEMA([c.level2],c.prevLevel3,f)[1],(A=this.getTemaPoint(a,s,c,M))&&(o.push(A),p.push(A[0]),n.push(A[1])),c.prevLevel3=c.level3));return{values:o,xData:p,yData:n}}}}p.defaultOptions=o(v.defaultOptions),a().registerSeriesType("tema",p);let n=r();export{n as default};