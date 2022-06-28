"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3822],{5318:(e,t,r)=>{r.d(t,{Zo:()=>d,kt:()=>g});var o=r(7378);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,o,n=function(e,t){if(null==e)return{};var r,o,n={},a=Object.keys(e);for(o=0;o<a.length;o++)r=a[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)r=a[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var p=o.createContext({}),c=function(e){var t=o.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},d=function(e){var t=c(e.components);return o.createElement(p.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},f=o.forwardRef((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,p=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),f=c(r),g=n,m=f["".concat(p,".").concat(g)]||f[g]||s[g]||a;return r?o.createElement(m,i(i({ref:t},d),{},{components:r})):o.createElement(m,i({ref:t},d))}));function g(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,i=new Array(a);i[0]=f;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:n,i[1]=l;for(var c=2;c<a;c++)i[c]=r[c];return o.createElement.apply(null,i)}return o.createElement.apply(null,r)}f.displayName="MDXCreateElement"},2494:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>T,contentTitle:()=>Z,default:()=>M,frontMatter:()=>C,metadata:()=>P,toc:()=>z});var o=r(2685),n=r(7378),a=r(5318),i=(r(7845),r(5520)),l=r(4384),p=r(47),c=r(2750),d=r(9502),s=r(1884),f=r(6769),g=r(8948),m=r(4776),u=r(8181),b=r(8745),h=r(9703),y=r(3277);const x=(0,b.Z)(d.Z)((e=>{let{theme:t,dark:r}=e;return{display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"stretch",textAlign:"left",backgroundColor:r?t.palette.footer.background:t.palette.white,position:"relative",borderRadius:"13.2px",boxShadow:"0 6px 7px 5px rgba("+(r?"107 107 107":"86, 86, 86")+", 0.03)",[t.breakpoints.down(300)]:{paddingLeft:""}}})),S=(0,b.Z)(c.Z)((e=>{let{theme:t}=e;return{whiteSpace:"nowrap",fontSize:22,marginLeft:"22px",fontWeight:600,letterSpacing:"0.16px",[t.breakpoints.down(300)]:{marginLeft:"10px"}}})),k=(0,b.Z)(c.Z)((e=>{let{theme:t}=e;return{fontSize:18.5,margin:"20px 0px 0px",height:"110px",lineHeight:1.29,letterSpacing:"0.44px",[t.breakpoints.down(400)]:{fontSize:"17px"},[t.breakpoints.down(300)]:{fontSize:13}}})),w=(0,b.Z)(p.Z)((e=>{let{theme:t}=e;return{padding:"21px",[t.breakpoints.down(300)]:{paddingLeft:"10px",paddingRight:"10px"}}}));function v(e){(0,u.Z)(y.ZP.breakpoints.down("sm"),{defaultMatches:!0});const{colorMode:t}=(0,f.If)();return n.createElement(n.Fragment,null,n.createElement(h.Z,{theme:y.ZP},n.createElement(l.ZP,{container:!0,spacing:2,sx:{maxWidth:1024,alignSelf:"center"}},e.items.map(((e,t)=>n.createElement(l.ZP,{item:!0,key:e.title,xs:12,sm:12,md:6},n.createElement(E,e)))))))}function E(e){let{title:t,image:r,description:o,linkTo:a}=e;const{colorMode:l}=(0,f.If)();(0,m.Z)();return n.createElement(x,{dark:"dark"===l?1:0},n.createElement(w,null,n.createElement("div",{style:{display:"flex",alignItems:"center"}},n.createElement("div",{style:{backgroundColor:"#4c6fff",borderRadius:"8px",height:48,width:48,display:"flex",alignItems:"center",justifyContent:"center"}},n.createElement("img",{src:(0,g.Z)(r),alt:"feature card",height:26,width:26})),n.createElement(S,{sx:{color:"dark"===l?"#dbdbdb":"#0b3863"}},t)),n.createElement(k,{variant:"body2",sx:{color:"dark"===l?"#dbdbdb":"#313e79"}},o),n.createElement("div",{style:{width:"100%",height:"31px",display:"flex",flexDirection:"column"}},n.createElement(i.Z,{sx:{margin:"0px -21px 15px",borderColor:"dark"===l?"gray":"Active Border"}}),n.createElement(s.Z,{to:a,style:{fontWeight:"bold",alignSelf:"flex-end",fontSize:14,marginRight:"21px"}},"View More"))))}r(353),r(2676);const C={id:"typescript-overview",title:"Typescript"},Z=void 0,P={unversionedId:"typescript-overview",id:"typescript-overview",title:"Typescript",description:"Libraries",source:"@site/api/typescript-overview.mdx",sourceDirName:".",slug:"/typescript-overview",permalink:"/api/typescript-overview",tags:[],version:"current",frontMatter:{id:"typescript-overview",title:"Typescript"}},T={},O=[{title:"switchboard-v2",image:"/img/icons/info.png",description:"Switchboard V2 Typescript client",linkTo:"https://docs.switchboard.xyz/api/ts"},{title:"sbv2-lite",image:"/img/icons/info.png",description:"Switchboard V2 Typescript client",linkTo:"https://docs.switchboard.xyz/api/ts"}],z=[{value:"Libraries",id:"libraries",level:2},{value:"Examples",id:"examples",level:2}],j={toc:z};function M(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,o.Z)({},j,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"libraries"},"Libraries"),(0,a.kt)(v,{items:O,mdxType:"CardSet"}),(0,a.kt)("h2",{id:"examples"},"Examples"))}M.isMDXComponent=!0},7845:(e,t,r)=>{r.d(t,{T:()=>h});var o=r(5520),n=r(47),a=r(2750),i=r(9502),l=r(1884),p=r(6769),c=r(8948),d=r(4776),s=r(8745),f=r(7378);const g=(0,s.Z)(i.Z)((e=>{let{theme:t,dark:r}=e;return{display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"stretch",textAlign:"left",backgroundColor:r?t.palette.footer.background:t.palette.white,position:"relative",borderRadius:"13.2px",boxShadow:"0 6px 7px 5px rgba("+(r?"107 107 107":"86, 86, 86")+", 0.03)",[t.breakpoints.down(300)]:{paddingLeft:""}}})),m=(0,s.Z)(a.Z)((e=>{let{theme:t}=e;return{whiteSpace:"nowrap",fontSize:22,marginLeft:"22px",fontWeight:600,letterSpacing:"0.16px",[t.breakpoints.down(300)]:{marginLeft:"10px"}}})),u=(0,s.Z)(a.Z)((e=>{let{theme:t}=e;return{fontSize:18.5,margin:"20px 0px 0px",height:"110px",lineHeight:1.29,letterSpacing:"0.44px",[t.breakpoints.down(400)]:{fontSize:"17px"},[t.breakpoints.down(300)]:{fontSize:13}}})),b=(0,s.Z)(n.Z)((e=>{let{theme:t}=e;return{padding:"21px",[t.breakpoints.down(300)]:{paddingLeft:"10px",paddingRight:"10px"}}}));function h(e){let{title:t,image:r,description:n,linkTo:a}=e;const{colorMode:i}=(0,p.If)();(0,d.Z)();return f.createElement(g,{dark:"dark"===i?1:0},f.createElement(b,null,f.createElement("div",{style:{display:"flex",alignItems:"center"}},f.createElement("div",{style:{backgroundColor:"#4c6fff",borderRadius:"8px",height:48,width:48,display:"flex",alignItems:"center",justifyContent:"center"}},f.createElement("img",{src:(0,c.Z)(r),alt:"feature card",height:26,width:26})),f.createElement(m,{sx:{color:"dark"===i?"#dbdbdb":"#0b3863"}},t)),f.createElement(u,{variant:"body2",sx:{color:"dark"===i?"#dbdbdb":"#313e79"}},n),f.createElement("div",{style:{width:"100%",height:"31px",display:"flex",flexDirection:"column"}},f.createElement(o.Z,{sx:{margin:"0px -21px 15px",borderColor:"dark"===i?"gray":"Active Border"}}),f.createElement(l.Z,{to:a,style:{fontWeight:"bold",alignSelf:"flex-end",fontSize:14,marginRight:"21px"}},"View More"))))}},3277:(e,t,r)=>{r.d(t,{ZP:()=>s});var o=r(2905);const n="#4c6fff",a="#ffffff",i={black:"#000000",blue:n,white:a,indigo:"#635bff",yellow:"#fab007",orange:"#ff7602",cyan:"#12bcf5",pink:"#D372FC",red:"#fc5a5a",lightGray:"#f3f4f7",transparent:"rgba(0,0,0,0)",footer:{background:"#0a2540",text:"#8998AA"},pageText:{title:"#0a2540",body:"#425466",bodySecondary:"#6B7C93",highlight:n},pageBackground:{primary:a,secondary:"#f7f9fc"},navbar:{marketplace:"#061024"},background:{},primary:{}};i.background={default:i.white},i.primary={main:i.black};const l=i,p=(0,o.Z)({typography:{fontFamily:["Source Sans Pro","Poppins"].join(","),fontPrimary:"Source Sans Pro"},components:{MuiTextField:{defaultProps:{autoComplete:"off"}},MuiFilledInput:{defaultProps:{autoComplete:"off"}}},palette:l}),c={root:{backgroundColor:p.palette.white,height:52,borderRadius:26,fontFamily:"Source Sans Pro",fontSize:16,fontWeight:600,fontStretch:"normal",fontStyle:"normal",whiteSpace:"nowrap",lineHeight:"normal",letterSpacing:.51,color:p.palette.black,"&.Mui-disabled":{color:p.palette.white[1]}},contained:{color:p.palette.white,textTransform:"none",padding:"0px 72px",backgroundColor:p.palette.blue,boxShadow:"0 11px 15px 0 rgba(164, 164, 164, 0.21)",[p.breakpoints.down("sm")]:{padding:"0px 56px"},"&:hover":{boxShadow:"0 11px 15px 0 rgba(164, 164, 164, 0.21)",backgroundColor:p.palette.footer.background},"@media (hover: none)":{"&:hover":{boxShadow:"0 11px 15px 0 rgba(164, 164, 164, 0.21) !important",backgroundColor:p.palette.footer.background+" !important"}}},containedSecondary:{color:p.palette.blue,backgroundColor:p.palette.white,"&:hover":{color:p.palette.white,backgroundColor:p.palette.footer.background},"@media (hover: none)":{"&:hover":{color:p.palette.white+" !important",backgroundColor:p.palette.footer.background+" !important"}}},text:{backgroundColor:p.palette.transparent,color:p.palette.blue,borderRadius:12,"&:hover":{backgroundColor:p.palette.transparent,color:p.palette.cyan},"& .MuiTouchRipple-root span":{backgroundColor:"rgba(0, 0, 0, 0.08)!important"}}},d={root:{fontFamily:"Source Sans Pro",fontSize:16,fontWeight:"normal",fontStretch:"normal",fontStyle:"normal",lineHeight:"normal",letterSpacing:"normal",color:p.palette.pageText.title,marginRight:12},h1:{fontFamily:"Source Sans Pro",fontSize:56,fontWeight:500,fontStretch:"normal",fontStyle:"normal",lineHeight:1.21,letterSpacing:.08,color:p.palette.pageText.title,[p.breakpoints.down("sm")]:{fontSize:42,lineHeight:1.28,letterSpacing:-2.23}},h2:{fontFamily:"Source Sans Pro",fontSize:32,fontWeight:600,fontStretch:"normal",fontStyle:"normal",lineHeight:1.03,letterSpacing:2.91,color:p.palette.pageText.title},h3:{fontFamily:"Source Sans Pro",fontSize:22,fontWeight:600,fontStretch:"normal",fontStyle:"normal",lineHeight:1.5,letterSpacing:2,color:p.palette.pageText.title,[p.breakpoints.down("sm")]:{fontSize:15.4,letterSpacing:"1.4px"}},subtitle1:{fontFamily:"Source Sans Pro",fontSize:18,fontWeight:600,fontStretch:"normal",fontStyle:"normal",lineHeight:1.83,letterSpacing:1.64,color:p.palette.blue},subtitle2:{},body1:{fontFamily:"Source Sans Pro",fontSize:20,fontWeight:"normal",fontStretch:"normal",fontStyle:"normal",lineHeight:1.6,letterSpacing:.49,color:p.palette.pageText.body,[p.breakpoints.down("sm")]:{fontSize:17,lineHeight:1.5,letterSpacing:.7}},body2:{fontFamily:"Source Sans Pro",fontSize:17,fontWeight:"normal",fontStretch:"normal",fontStyle:"normal",lineHeight:1.53,letterSpacing:.5,color:p.palette.pageText.body},button:{},gutterBottom:{marginBottom:"8px"}};p.components={MuiTypography:{styleOverrides:d},MuiButton:{styleOverrides:c},MuiIconButton:{styleOverrides:{root:{backgroundColor:"rgba(0, 0, 0, 0)","&:hover":{backgroundColor:"rgba(0, 0, 0, 0.2)"}}}}};const s=p}}]);