import{c as s,a as n}from"./clsx-CiEuVa-S.js";import{c as u,o as r}from"./Dialog-BNy51vfz.js";import{j as d}from"./index-CFBZ9J3R.js";/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],x=s("trash-2",i),f=u(t=>({accounts:r,addAccount:c=>t(o=>({accounts:[...o.accounts,{...c,id:`acc-${Date.now()}`}]})),updateAccount:(c,o)=>t(a=>({accounts:a.accounts.map(e=>e.id===c?{...e,...o}:e)})),removeAccount:c=>t(o=>({accounts:o.accounts.filter(a=>a.id!==c)}))}));function l({children:t,className:c}){return d.jsx("span",{className:n("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",c),children:t})}export{l as B,x as T,f as u};
