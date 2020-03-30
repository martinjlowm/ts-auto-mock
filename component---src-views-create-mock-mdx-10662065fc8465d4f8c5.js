(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{Ew11:function(e,n,t){"use strict";t.r(n),t.d(n,"_frontmatter",(function(){return c})),t.d(n,"default",(function(){return m}));t("1c7q"),t("abGl"),t("gZHo"),t("Fdmb"),t("Ir+3"),t("2mQt");var o=t("/FXl"),r=t("TjRS");t("aD51");function a(){return(a=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e}).apply(this,arguments)}var c={};void 0!==c&&c&&c===Object(c)&&Object.isExtensible(c)&&!c.hasOwnProperty("__filemeta")&&Object.defineProperty(c,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"src/views/create-mock.mdx"}});var i={_frontmatter:c},s=r.a;function m(e){var n=e.components,t=function(e,n){if(null==e)return{};var t,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)t=a[o],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,["components"]);return Object(o.b)(s,a({},i,t,{components:n,mdxType:"MDXLayout"}),Object(o.b)("h1",{id:"create-mock"},"Create mock"),Object(o.b)("pre",null,Object(o.b)("code",a({parentName:"pre"},{className:"language-ts"}),'import { createMock } from \'ts-auto-mock\';\n\ninterface Person {\n  id: string;\n  getName(): string;\n  details: {\n      phone: number\n  }\n}\nconst mock = createMock<Person>();\nmock.id // ""\nmock.getName() // ""\nmock.details // "{phone: 0} "\n')),Object(o.b)("h2",{id:"default-values"},"Default values"),Object(o.b)("p",null,"You can also define default values to overrides specific fields\nYou dont have to provide the entire interface, just a partial of the one to mock"),Object(o.b)("pre",null,Object(o.b)("code",a({parentName:"pre"},{className:"language-ts"}),'import { createMock } from \'ts-auto-mock\';\n\ninterface Person {\n  id: string;\n  getName(): string;\n  details: {\n      phone: number\n  }\n}\nconst mock = createMock<Person>({\n    details: {\n        phone: 07423232323\n    }\n});\nmock.id // ""\nmock.getName() // ""\nmock.details // "{phone: 07423232323} "\n')))}m&&m===Object(m)&&Object.isExtensible(m)&&!m.hasOwnProperty("__filemeta")&&Object.defineProperty(m,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"src/views/create-mock.mdx"}}),m.isMDXComponent=!0}}]);
//# sourceMappingURL=component---src-views-create-mock-mdx-10662065fc8465d4f8c5.js.map