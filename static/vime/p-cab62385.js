import{f as e}from"./p-d22fa63b.js";import{l as o}from"./p-bd8dee20.js";const n="undefined"!=typeof window,i=n?window.navigator.userAgent.toLowerCase():"",t=/iphone|ipad|ipod|ios|CriOS|FxiOS/.test(i),r=/android/.test(i),d=t||r,s=n&&/(iPhone|iPod)/gi.test(window.navigator.platform),a=(/firefox/.test(i),n&&(window.safari||t||/Apple/.test(i)),e=>{if(!n)return()=>{};let i=0;const t=o(document,"touchstart",()=>{i=(new Date).getTime(),e(!0)},!0),r=o(document,"mousemove",()=>{(new Date).getTime()-i<500||e(!1)},!0);return()=>{t(),r()}}),u=()=>{if(!n)return!1;const o=document.createElement("video");return e(o.webkitEnterFullscreen)},m=()=>!!n&&document.createElement("video").canPlayType("application/vnd.apple.mpegurl").length>0,p=()=>{if(!n)return!1;const e=document.createElement("video");return!!document.pictureInPictureEnabled&&!e.disablePictureInPicture},c=()=>{if(!n)return!1;const o=document.createElement("video");return e(o.webkitSupportsPresentationMode)&&e(o.webkitSetPresentationMode)&&!s},f=()=>p()||c(),w=(e=!0,o=!0)=>{if(!n)return Promise.resolve(!1);const i=document.createElement("video");return e&&(i.setAttribute("muted",""),i.muted=!0),o&&(i.setAttribute("playsinline",""),i.setAttribute("webkit-playsinline","")),i.setAttribute("height","0"),i.setAttribute("width","0"),i.style.position="fixed",i.style.top="0",i.style.width="0",i.style.height="0",i.style.opacity="0",new Promise(e=>e(i.play())).catch(()=>{}),Promise.resolve(!i.paused)};export{n as I,d as a,w as b,m as c,t as d,p as e,c as f,f as g,u as h,a as o}