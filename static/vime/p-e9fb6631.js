import{g as e}from"./p-7d485867.js";import{i as o}from"./p-eef3d203.js";import{P as n}from"./p-29d1ed0b.js";const r=()=>{let e,o;return{promise:new Promise((n,r)=>{e=n,o=r}),resolve:e,reject:o}},t=n=>{let r=o(n,HTMLElement)?n:e(n);for(;!/^VIME-PLAYER$/.test(null==r?void 0:r.nodeName);)r=r.parentElement;return r},s=(o,n)=>function(o,n){var r=o.prototype,t=r.componentWillLoad;r.componentWillLoad=function(){var o,r=this,s=e(this),i={promise:new Promise((function(e){o=e})),resolve:o},l=new CustomEvent("openWormhole",{bubbles:!0,composed:!0,detail:{consumer:this,fields:n,updater:function(e,o){r[e]=o},onOpen:i}});return s.dispatchEvent(l),i.promise.then((function(){if(t)return t.call(r)}))}}(o,n),i=(e,o,s,i)=>{const l=Symbol.for(e.nodeName),u=t(e),m=r();let p;m.promise.then(e=>{null==i||i(),p=e});const a=()=>{e.dispatchEvent(new CustomEvent("openWormhole",{bubbles:!0,composed:!0,detail:{consumer:l,fields:o,updater:s,onOpen:m}})),u.removeEventListener(n.Ready,a)};return u.addEventListener(n.Ready,a),()=>{null==p||p()}};export{i as a,r as d,t as f,s as w}