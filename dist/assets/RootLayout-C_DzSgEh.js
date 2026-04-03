import{j as e,u as h,r as c,N as m,O as p}from"./index-CFBZ9J3R.js";import{c as a,X as u,a as i}from"./clsx-CiEuVa-S.js";import{P as f,C as j}from"./package-DPn3VFE-.js";import{C as y}from"./chevron-down-CKsF-t4J.js";/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],g=a("layout-dashboard",b);/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M3 5h.01",key:"18ugdj"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 19h.01",key:"noohij"}],["path",{d:"M8 5h13",key:"1pao27"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 19h13",key:"m83p4d"}]],k=a("list",v);/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],w=a("menu",N);/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],z=a("settings",M);/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5",key:"slp6dd"}],["path",{d:"M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244",key:"o0xfot"}],["path",{d:"M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05",key:"wn3emo"}]],C=a("store",_),L=[{label:"Estoque",icon:e.jsx(f,{size:18}),children:[{label:"Gerenciamento",to:"/products"}]},{label:"Contas",icon:e.jsx(C,{size:18}),children:[{label:"E-commerce",to:"/accounts"}]},{label:"Configurações",icon:e.jsx(z,{size:18}),children:[{label:"Parâmetros",to:"/settings/parameters"}]}];function S({group:t,collapsed:o}){const n=h(),r=t.children.some(s=>n.pathname.startsWith(s.to)),[l,d]=c.useState(r);return e.jsxs("div",{children:[e.jsxs("button",{onClick:()=>d(s=>!s),className:i("flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors","text-stone-200 hover:bg-stone-700",r&&"bg-stone-700"),children:[e.jsx("span",{className:"flex-shrink-0",children:t.icon}),!o&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"flex-1 text-left",children:t.label}),l?e.jsx(y,{size:14}):e.jsx(j,{size:14})]})]}),!o&&l&&e.jsx("div",{className:"ml-4 mt-1 flex flex-col gap-0.5 border-l border-stone-600 pl-3",children:t.children.map(s=>e.jsxs(m,{to:s.to,className:({isActive:x})=>i("flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",x?"bg-stone-600 text-white font-medium":"text-stone-300 hover:bg-stone-700 hover:text-white"),children:[e.jsx(k,{size:14}),s.label]},s.to))})]})}function A({collapsed:t,onToggle:o}){return e.jsxs("aside",{className:i("flex flex-col bg-stone-800 text-white transition-all duration-300 flex-shrink-0",t?"w-14":"w-56"),children:[e.jsxs("div",{className:"flex items-center justify-between p-3 border-b border-stone-700",children:[!t&&e.jsx("span",{className:"text-sm font-semibold text-stone-200 truncate",children:"Estoque"}),e.jsx("button",{onClick:o,className:"rounded-md p-1.5 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors ml-auto","aria-label":"Toggle sidebar",children:t?e.jsx(w,{size:18}):e.jsx(u,{size:18})})]}),e.jsxs("div",{className:"flex flex-col items-center gap-1 py-5 border-b border-stone-700 px-3",children:[e.jsx("div",{className:"flex h-12 w-12 items-center justify-center rounded-full bg-stone-600",children:e.jsx(g,{size:22,className:"text-stone-200"})}),!t&&e.jsx("p",{className:"text-xs text-stone-400 mt-1",children:"Bem-vindo, operador"})]}),e.jsx("nav",{className:"flex flex-col gap-1 p-3 flex-1 overflow-y-auto",children:L.map(n=>e.jsx(S,{group:n,collapsed:t},n.label))})]})}function $(){const[t,o]=c.useState(!1);return e.jsxs("div",{className:"flex h-screen overflow-hidden bg-gray-50",children:[e.jsx(A,{collapsed:t,onToggle:()=>o(n=>!n)}),e.jsx("main",{className:"flex-1 overflow-y-auto p-6",children:e.jsx(p,{})})]})}export{$ as RootLayout};
