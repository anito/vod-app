import{r as s,c as t,h as i}from"./p-6a8a5b8e.js";import{P as a}from"./p-7e342812.js";import{a as r,d as h,b as e}from"./p-d22fa63b.js";import{c as o}from"./p-1f4b6ee8.js";import"./p-bd8dee20.js";import{M as n}from"./p-8b74fa0e.js";import{c}from"./p-cab62385.js";import{a as d}from"./p-03f3cfce.js";import{h as l,b as p}from"./p-b0ea4d0d.js";const m=class{constructor(i){s(this,i),this.vLoadStart=t(this,"vLoadStart",7),this.hasAttached=!1,this.version="latest",this.preload="metadata"}async componentDidLoad(){if(this.dispatch=o(this),!c())try{const s="https://cdn.jsdelivr.net/npm/hls.js@"+this.version,t=await d(s,"Hls"),i=this.videoProvider.querySelector("video");if(!t.isSupported())return void this.dispatch(a.errors,[new Error("hls.js is not supported")]);this.hls=new t(this.config),this.hls.on("hlsMediaAttached",()=>{this.hasAttached=!0,this.onSrcChange()}),this.hls.on("hlsError",(s,t)=>{this.dispatch(a.errors,[{e:s,data:t}])}),this.hls.on("hlsManifestParsed",()=>{this.dispatch(a.mediaType,n.Video),this.dispatch(a.currentSrc,this.src),this.dispatch(a.playbackReady,!0)}),this.hls.attachMedia(i)}catch(s){this.dispatch(a.errors,[s])}}disconnectedCallback(){var s;null===(s=this.hls)||void 0===s||s.destroy(),this.hls=void 0,this.hasAttached=!1}get src(){if(r(this.videoProvider))return;const s=this.videoProvider.querySelectorAll("source"),t=Array.from(s).find(s=>l.test(s.src)||p.test(s.type));return null==t?void 0:t.src}onSrcChange(){c()||this.hasAttached&&(this.vLoadStart.emit(),h(this.src)||this.hls.loadSource(this.src))}async getAdapter(){const s=await this.videoProvider.getAdapter(),t=s.canPlay;return Object.assign(Object.assign({},s),{getInternalPlayer:async()=>this.hls,canPlay:async s=>e(s)&&l.test(s)||t(s)})}render(){return i("vime-video",{willAttach:!c(),crossOrigin:this.crossOrigin,preload:this.preload,poster:this.poster,controlsList:this.controlsList,autoPiP:this.autoPiP,disablePiP:this.disablePiP,disableRemotePlayback:this.disableRemotePlayback,mediaTitle:this.mediaTitle,ref:s=>{this.videoProvider=s}},i("slot",null))}};export{m as vime_hls}