"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4448],{5318:function(e,t,a){a.d(t,{Zo:function(){return s},kt:function(){return m}});var n=a(7378);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var u=n.createContext({}),p=function(e){var t=n.useContext(u),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},s=function(e){var t=p(e.components);return n.createElement(u.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,u=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),d=p(a),m=r,y=d["".concat(u,".").concat(m)]||d[m]||c[m]||l;return a?n.createElement(y,o(o({ref:t},s),{},{components:a})):n.createElement(y,o({ref:t},s))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=d;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var p=2;p<l;p++)o[p]=a[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},2750:function(e,t,a){a.d(t,{Z:function(){return b}});var n=a(1244),r=a(2685),l=a(7378),o=a(8944),i=a(3772),u=a(3892),p=a(2709),s=a(2399),c=a(1640),d=a(765);function m(e){return(0,d.Z)("MuiTypography",e)}(0,a(2897).Z)("MuiTypography",["root","h1","h2","h3","h4","h5","h6","subtitle1","subtitle2","body1","body2","inherit","button","caption","overline","alignLeft","alignRight","alignCenter","alignJustify","noWrap","gutterBottom","paragraph"]);var y=a(4246);const f=["align","className","component","gutterBottom","noWrap","paragraph","variant","variantMapping"],g=(0,p.ZP)("span",{name:"MuiTypography",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,a.variant&&t[a.variant],"inherit"!==a.align&&t[`align${(0,c.Z)(a.align)}`],a.noWrap&&t.noWrap,a.gutterBottom&&t.gutterBottom,a.paragraph&&t.paragraph]}})((({theme:e,ownerState:t})=>(0,r.Z)({margin:0},t.variant&&e.typography[t.variant],"inherit"!==t.align&&{textAlign:t.align},t.noWrap&&{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},t.gutterBottom&&{marginBottom:"0.35em"},t.paragraph&&{marginBottom:16}))),h={h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",subtitle1:"h6",subtitle2:"h6",body1:"p",body2:"p",inherit:"p"},v={primary:"primary.main",textPrimary:"text.primary",secondary:"secondary.main",textSecondary:"text.secondary",error:"error.main"};var b=l.forwardRef((function(e,t){const a=(0,s.Z)({props:e,name:"MuiTypography"}),l=(e=>v[e]||e)(a.color),p=(0,i.Z)((0,r.Z)({},a,{color:l})),{align:d="inherit",className:b,component:k,gutterBottom:T=!1,noWrap:N=!1,paragraph:Z=!1,variant:x="body1",variantMapping:I=h}=p,P=(0,n.Z)(p,f),C=(0,r.Z)({},p,{align:d,color:l,className:b,component:k,gutterBottom:T,noWrap:N,paragraph:Z,variant:x,variantMapping:I}),w=k||(Z?"p":I[x]||h[x])||"span",O=(e=>{const{align:t,gutterBottom:a,noWrap:n,paragraph:r,variant:l,classes:o}=e,i={root:["root",l,"inherit"!==e.align&&`align${(0,c.Z)(t)}`,a&&"gutterBottom",n&&"noWrap",r&&"paragraph"]};return(0,u.Z)(i,m,o)})(C);return(0,y.jsx)(g,(0,r.Z)({as:w,ref:t,ownerState:C,className:(0,o.Z)(O.root,b)},P))}))},1640:function(e,t,a){var n=a(9490);t.Z=n.Z},3772:function(e,t,a){a.d(t,{Z:function(){return u}});var n=a(2685),r=a(1244),l=a(3143),o=a(7351);const i=["sx"];function u(e){const{sx:t}=e,a=(0,r.Z)(e,i),{systemProps:u,otherProps:p}=(e=>{const t={systemProps:{},otherProps:{}};return Object.keys(e).forEach((a=>{o.Gc[a]?t.systemProps[a]=e[a]:t.otherProps[a]=e[a]})),t})(a);let s;return s=Array.isArray(t)?[u,...t]:"function"==typeof t?(...e)=>{const a=t(...e);return(0,l.P)(a)?(0,n.Z)({},u,a):u}:(0,n.Z)({},u,t),(0,n.Z)({},p,{sx:s})}},517:function(e,t,a){a.d(t,{Z:function(){return r}});var n=a(7378);function r(e){var t=e.children,a=e.hidden,r=e.className;return n.createElement("div",{role:"tabpanel",hidden:a,className:r},t)}},637:function(e,t,a){a.d(t,{Z:function(){return s}});var n=a(2685),r=a(7378),l=a(6457),o=a(1582),i=a(8944),u="tabItem_WhCL";function p(e){var t,a,l,p=e.lazy,s=e.block,c=e.defaultValue,d=e.values,m=e.groupId,y=e.className,f=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=d?d:f.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),h=(0,o.lx)(g,(function(e,t){return e.value===t.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var v=null===c?c:null!=(t=null!=c?c:null==(a=f.find((function(e){return e.props.default})))?void 0:a.props.value)?t:null==(l=f[0])?void 0:l.props.value;if(null!==v&&!g.some((function(e){return e.value===v})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+g.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var b=(0,o.UB)(),k=b.tabGroupChoices,T=b.setTabGroupChoices,N=(0,r.useState)(v),Z=N[0],x=N[1],I=[],P=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=m){var C=k[m];null!=C&&C!==Z&&g.some((function(e){return e.value===C}))&&x(C)}var w=function(e){var t=e.currentTarget,a=I.indexOf(t),n=g[a].value;n!==Z&&(P(t),x(n),null!=m&&T(m,n))},O=function(e){var t,a=null;switch(e.key){case"ArrowRight":var n=I.indexOf(e.currentTarget)+1;a=I[n]||I[0];break;case"ArrowLeft":var r=I.indexOf(e.currentTarget)-1;a=I[r]||I[I.length-1]}null==(t=a)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":s},y)},g.map((function(e){var t=e.value,a=e.label,l=e.attributes;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:Z===t?0:-1,"aria-selected":Z===t,key:t,ref:function(e){return I.push(e)},onKeyDown:O,onFocus:w,onClick:w},l,{className:(0,i.Z)("tabs__item",u,null==l?void 0:l.className,{"tabs__item--active":Z===t})}),null!=a?a:t)}))),p?(0,r.cloneElement)(f.filter((function(e){return e.props.value===Z}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},f.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==Z})}))))}function s(e){var t=(0,l.Z)();return r.createElement(p,(0,n.Z)({key:String(t)},e))}},2397:function(e,t,a){a.r(t),a.d(t,{assets:function(){return y},contentTitle:function(){return d},default:function(){return h},frontMatter:function(){return c},metadata:function(){return m},toc:function(){return f}});var n=a(2685),r=a(1244),l=(a(7378),a(5318)),o=a(2750),i=a(1884),u=a(637),p=a(517),s=["components"],c={sidebar_position:30,title:"Data Feeds"},d=void 0,m={unversionedId:"developers/feed",id:"developers/feed",title:"Data Feeds",description:"# anchor-feed-parser",source:"@site/docs/developers/feed.mdx",sourceDirName:"developers",slug:"/developers/feed",permalink:"/developers/feed",tags:[],version:"current",sidebarPosition:30,frontMatter:{sidebar_position:30,title:"Data Feeds"},sidebar:"tutorialSidebar",previous:{title:"Oracles",permalink:"/developers/oracle"},next:{title:"Randomness",permalink:"/developers/randomness"}},y={},f=[{value:"Reading a Data Feed",id:"reading-a-data-feed",level:2},{value:"Creating a Data Feed",id:"creating-a-data-feed",level:2},{value:"Funding a Data Feed",id:"funding-a-data-feed",level:2},{value:"Requesting a Feed Update",id:"requesting-a-feed-update",level:2},{value:"Push to Crank",id:"push-to-crank",level:2},{value:"Add History Buffer",id:"add-history-buffer",level:2}],g={toc:f};function h(e){var t=e.components,a=(0,r.Z)(e,s);return(0,l.kt)("wrapper",(0,n.Z)({},g,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)(o.Z,{variant:"h4",mdxType:"Typography"},(0,l.kt)(i.Z,{to:"https://github.com/switchboard-xyz/switchboard-v2/tree/main/programs/anchor-feed-parser",mdxType:"Link"},"# anchor-feed-parser")),(0,l.kt)("h2",{id:"reading-a-data-feed"},"Reading a Data Feed"),(0,l.kt)(u.Z,{mdxType:"Tabs"},(0,l.kt)(p.Z,{value:"Rust",label:"Rust",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-rust"},"// Rust code\n"))),(0,l.kt)(p.Z,{value:"Typescript",label:"Typescript",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"// Typescript code\n"))),(0,l.kt)(p.Z,{value:"Python",label:"Python",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-python"},"# Python code\n"))),(0,l.kt)(p.Z,{value:"CLI",label:"CLI",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"# CLI command\n")))),(0,l.kt)("h2",{id:"creating-a-data-feed"},"Creating a Data Feed"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"aggregatorInit")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"leaseInit")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"jobInit")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"permissionInit")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"aggregatorAddJob"))),(0,l.kt)(u.Z,{mdxType:"Tabs"},(0,l.kt)(p.Z,{value:"Typescript",label:"Typescript",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"// Typescript code\n"))),(0,l.kt)(p.Z,{value:"Python",label:"Python",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-python"},"# Python code\n"))),(0,l.kt)(p.Z,{value:"CLI",label:"CLI",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"# CLI command\n")))),(0,l.kt)("h2",{id:"funding-a-data-feed"},"Funding a Data Feed"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"leeaseExtend"))),(0,l.kt)(u.Z,{mdxType:"Tabs"},(0,l.kt)(p.Z,{value:"Typescript",label:"Typescript",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"// Typescript code\n"))),(0,l.kt)(p.Z,{value:"Python",label:"Python",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-python"},"# Python code\n"))),(0,l.kt)(p.Z,{value:"CLI",label:"CLI",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"# CLI command\n")))),(0,l.kt)("h2",{id:"requesting-a-feed-update"},"Requesting a Feed Update"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"openRound"))),(0,l.kt)(u.Z,{mdxType:"Tabs"},(0,l.kt)(p.Z,{value:"Typescript",label:"Typescript",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"// Typescript code\n"))),(0,l.kt)(p.Z,{value:"Python",label:"Python",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-python"},"# Python code\n"))),(0,l.kt)(p.Z,{value:"CLI",label:"CLI",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"# CLI command\n")))),(0,l.kt)("h2",{id:"push-to-crank"},"Push to Crank"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"crankPush"))),(0,l.kt)(u.Z,{mdxType:"Tabs"},(0,l.kt)(p.Z,{value:"Typescript",label:"Typescript",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"// Typescript code\n"))),(0,l.kt)(p.Z,{value:"Python",label:"Python",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-python"},"# Python code\n"))),(0,l.kt)(p.Z,{value:"CLI",label:"CLI",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"# CLI command\n")))),(0,l.kt)("h2",{id:"add-history-buffer"},"Add History Buffer"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"aggregatorSetHistoryBuffer"))),(0,l.kt)(u.Z,{mdxType:"Tabs"},(0,l.kt)(p.Z,{value:"Typescript",label:"Typescript",default:!0,mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"// Typescript code\n"))),(0,l.kt)(p.Z,{value:"Python",label:"Python",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-python"},"# Python code\n"))),(0,l.kt)(p.Z,{value:"CLI",label:"CLI",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"# CLI command\n")))))}h.isMDXComponent=!0}}]);