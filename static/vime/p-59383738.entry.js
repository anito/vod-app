import{r as t,h as s}from"./p-7d485867.js";import{V as i}from"./p-415151d7.js";const e=class{constructor(s){t(this,s),this.willAttach=!1,this.preload="metadata"}async getAdapter(){return this.fileProvider.getAdapter()}render(){return s("vime-file",{willAttach:this.willAttach,crossOrigin:this.crossOrigin,poster:this.poster,preload:this.preload,controlsList:this.controlsList,autoPiP:this.autoPiP,disablePiP:this.disablePiP,disableRemotePlayback:this.disableRemotePlayback,mediaTitle:this.mediaTitle,viewType:i.Video,ref:t=>{this.fileProvider=t}},s("slot",null))}};export{e as vime_video}