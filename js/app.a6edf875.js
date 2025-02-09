(()=>{"use strict";var e={1501:(e,t,r)=>{r(3792),r(3362),r(9085),r(9391);var n=r(5130),a=r(2319),s=(r(2010),r(6768)),o=r(4232),i={id:"app"},u={class:"search"},c={class:"results"},l=["onClick"];function h(e,t,r,a,h,p){return(0,s.uX)(),(0,s.CE)("div",i,[t[2]||(t[2]=(0,s.Lk)("div",{id:"map"},null,-1)),(0,s.Lk)("div",u,[(0,s.bo)((0,s.Lk)("input",{id:"search-input",class:"input",type:"text","onUpdate:modelValue":t[0]||(t[0]=function(e){return h.searchQuery=e}),onInput:t[1]||(t[1]=function(e){return p.handleSearch(e.target.value)}),placeholder:"Nach ARS oder Gebietsbezeichnung suchen...",autofocus:""},null,544),[[n.Jo,h.searchQuery]]),(0,s.Lk)("div",c,[((0,s.uX)(!0),(0,s.CE)(s.FK,null,(0,s.pI)(h.filteredResults,(function(e){return(0,s.uX)(),(0,s.CE)("div",{key:e.ars,class:"container result"},[(0,s.Lk)("p",{onClick:function(t){return p.handleResultClick(e.ars)}},[(0,s.Lk)("strong",null,(0,o.v_)(e.name),1),(0,s.eW)(" | "+(0,o.v_)(e.ars),1)],8,l)])})),128))])])])}var p=r(8676),d=r(4048),f=r(388),v=(r(6280),r(6918),r(8706),r(2008),r(4423),r(8598),r(2062),r(4782),r(5506),r(6099),r(1699),r(1392),r(2762),r(8992),r(4520),r(1454),r(6031),r(6886)),g=r.n(v);const b={name:"App",data:function(){return{map:null,layer:null,shapeStyle:{color:"#2A8A15",weight:4,opacity:.65},arsMap:[],offset:0,PAGE_SIZE:30,searchQuery:"",filteredResults:[]}},mounted:function(){this.map=g().map("map").setView([51.5,11],6),g().tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'Map data &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a> | Gebietsumrisse: <a href="https://geoportal.de/Info/cfbe95dc-81b9-4704-a61c-d71070d15fd3">GeoBasis-DE / BKG 2023</a>'}).addTo(this.map),this.loadARSData(),this.debouncedSearch=this.debounce(this.handleSearch,150)},methods:{loadARSData:function(){var e=this;return(0,f.A)((0,d.A)().mark((function t(){var r;return(0,d.A)().wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fetch("ars_from_geojson.json");case 3:if(r=t.sent,r.ok){t.next=6;break}throw new Error("HTTP error! status: ".concat(r.status));case 6:return t.next=8,r.json();case 8:e.arsMap=t.sent,t.next=14;break;case 11:t.prev=11,t.t0=t["catch"](0),console.error("Failed to load ARS data:",t.t0);case 14:case"end":return t.stop()}}),t,null,[[0,11]])})))()},debounce:function(e,t){var r;return function(){for(var n=arguments.length,a=new Array(n),s=0;s<n;s++)a[s]=arguments[s];var o=function(){clearTimeout(r),e.apply(void 0,a)};clearTimeout(r),r=setTimeout(o,t)}},handleSearch:function(e){this.searchQuery=e,this.offset=0;var t=e.toLowerCase().trim();0!==t.length?t.length<3||(this.filteredResults=Object.entries(this.arsMap).filter((function(e){var r=(0,p.A)(e,2),n=r[0],a=r[1],s=a.toLowerCase().includes(t),o=n.startsWith(t);return s||o})).map((function(e){var t=(0,p.A)(e,2),r=t[0],n=t[1];return{ars:r,name:n}})).slice(0,this.PAGE_SIZE),this.filteredResults.length>0&&this.filteredResults[0].ars===t?(window.location.hash=e,this.showShape(this.filteredResults[0].ars)):this.layer&&this.layer.remove()):this.filteredResults=[]},showShape:function(e){var t=this;return(0,f.A)((0,d.A)().mark((function r(){var n,a;return(0,d.A)().wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.prev=0,t.layer&&t.layer.remove(),r.next=4,fetch("geojson/".concat(e,".geojson.json"));case 4:return n=r.sent,r.next=7,n.json();case 7:a=r.sent,t.layer=g().geoJSON(a.features,{style:t.shapeStyle,onEachFeature:function(r,n){var a=n.getBounds(),s=[a.getWest(),a.getSouth(),a.getEast(),a.getNorth()],o="https://www.govdata.de/suche?boundingbox=".concat(s.join(",")),i="\n            <strong>".concat(t.arsMap[e],"</strong><br><br>\n            ARS: ").concat(e,'<br>\n            <a href="').concat(o,'" target="_blank">\n              GovData-Datensätze für diese Region\n            </a>\n          ');n.bindPopup(i)}}).addTo(t.map),t.map.flyToBounds(t.layer.getBounds(),{duration:1,easeLinearity:.5,padding:[50,50]}),r.next=15;break;case 12:r.prev=12,r.t0=r["catch"](0),console.error("Failed to load shape:",r.t0);case 15:case"end":return r.stop()}}),r,null,[[0,12]])})))()},handleResultClick:function(e){this.searchQuery=e,window.location.hash=e,this.showShape(e),this.filteredResults=[]}}};var y=r(1241);const m=(0,y.A)(b,[["render",h]]),w=m;var k=(0,n.Ef)(w);k.use((0,a.Ey)()),k.mount("#app")}},t={};function r(n){var a=t[n];if(void 0!==a)return a.exports;var s=t[n]={exports:{}};return e[n].call(s.exports,s,s.exports,r),s.exports}r.m=e,(()=>{var e=[];r.O=(t,n,a,s)=>{if(!n){var o=1/0;for(l=0;l<e.length;l++){for(var[n,a,s]=e[l],i=!0,u=0;u<n.length;u++)(!1&s||o>=s)&&Object.keys(r.O).every((e=>r.O[e](n[u])))?n.splice(u--,1):(i=!1,s<o&&(o=s));if(i){e.splice(l--,1);var c=a();void 0!==c&&(t=c)}}return t}s=s||0;for(var l=e.length;l>0&&e[l-1][2]>s;l--)e[l]=e[l-1];e[l]=[n,a,s]}})(),(()=>{r.n=e=>{var t=e&&e.__esModule?()=>e["default"]:()=>e;return r.d(t,{a:t}),t}})(),(()=>{r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}})(),(()=>{r.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()})(),(()=>{r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t)})(),(()=>{var e={524:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var a,s,[o,i,u]=n,c=0;if(o.some((t=>0!==e[t]))){for(a in i)r.o(i,a)&&(r.m[a]=i[a]);if(u)var l=u(r)}for(t&&t(n);c<o.length;c++)s=o[c],r.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return r.O(l)},n=self["webpackChunkars_tool_vue"]=self["webpackChunkars_tool_vue"]||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var n=r.O(void 0,[504],(()=>r(1501)));n=r.O(n)})();
//# sourceMappingURL=app.a6edf875.js.map