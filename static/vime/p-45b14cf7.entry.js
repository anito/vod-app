import{g as t,a as i,r as e,c as s,h as a,H as n}from"./p-7d485867.js";import{P as h,r,i as o,a as l}from"./p-d8000c6e.js";import{e as c,g as u,a as d}from"./p-eef3d203.js";import{g as v}from"./p-29d1ed0b.js";import{V as y}from"./p-415151d7.js";import{l as p}from"./p-bd8dee20.js";import{a as b,b as g,o as m,d as f}from"./p-0d34702b.js";import{M as C}from"./p-8b74fa0e.js";import{D as w}from"./p-874fa941.js";var k=new Map,P=function(t,i){var e=t.updater;t.fields.forEach((function(t){e(t,i[t])}))},E=function(t,e){var s=t.state,a=i();if(k.has(a)){var n=k.get(a);n.state=s,n.wormholes.forEach((function(t){P(t,s)}))}return e};const x=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror","fullscreen"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror","-webkit-full-screen"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror","-moz-full-screen"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError","-ms-fullscreen"]];class F{constructor(t,i){this.el=t,this.listener=i,this.disposal=new w,this.api=(()=>{const t={prefixed:!1},i=x[0];let e;for(let t=0;t<x.length;t+=1)if(x[t][1]in document){e=x[t];break}if(e){for(let s=0;s<e.length;s+=1)t[i[s]]=e[s];t.prefixed=e[0]!==i[0]}return t})(),this.isSupported&&(this.disposal.add(p(document,this.api.fullscreenchange,this.onFullscreenChange.bind(this))),document.webkitExitFullscreen&&this.disposal.add(p(document,"webkitfullscreenchange",this.onFullscreenChange.bind(this))),document.mozCancelFullScreen&&this.disposal.add(p(document,"mozfullscreenchange",this.onFullscreenChange.bind(this))))}async enterFullscreen(t){if(!this.isSupported)throw Error("Fullscreen API is not available.");return this.el[this.api.requestFullscreen](t)}async exitFullscreen(){if(!this.isSupported)throw Error("Fullscreen API is not available.");if(!this.isActive)throw Error("Player is not currently in fullscreen mode to exit.");return document[this.api.exitFullscreen]()}get isActive(){if(!this.isSupported)return!1;const t=document[this.api.fullscreenElement];return this.el===t||this.el.matches(":"+this.api.fullscreen)||this.el.contains(t)}get isSupported(){return!c(this.api.requestFullscreen)}onFullscreenChange(){this.listener(this.isActive)}destroy(){this.disposal.empty()}}const T={play:"Play",pause:"Pause",playback:"Playback",scrubber:"Scrubber",scrubberLabel:"{currentTime} of {duration}",played:"Played",duration:"Duration",buffered:"Buffered",close:"Close",currentTime:"Current time",live:"LIVE",volume:"Volume",mute:"Mute",unmute:"Unmute",captions:"Captions",subtitlesOrCc:"Subtitles/CC",enableCaptions:"Enable subtitles/captions",disableCaptions:"Disable subtitles/captions",auto:"Auto",fullscreen:"Fullscreen",enterFullscreen:"Enter fullscreen",exitFullscreen:"Exit fullscreen",settings:"Settings",seekForward:"Seek forward",seekBackward:"Seek backward",seekTotal:"Seek total",normal:"Normal",none:"None",playbackRate:"Playback Rate",playbackQuality:"Playback Quality",loop:"Loop",disabled:"Disabled",off:"Off",enabled:"Enabled",pip:"Picture-in-Picture",enterPiP:"Miniplayer",exitPiP:"Expand"},M=t=>t.querySelectorAll(".lazy"),S=t=>{const i=t.nodeName.toLowerCase();if("picture"===i){const i=document.createElement("img");u(t.getAttribute("data-alt"))||(i.alt=t.getAttribute("data-alt")),t.append(i)}if(("video"===i||"audio"===i)&&!u(t.children)){const i=t.children;for(let t=0;t<=i.length-1;t+=1){const e=i[t].getAttribute("data-src");u(e)||(i[t].src=e)}t.load()}u(t.getAttribute("data-poster"))||(t.poster=t.getAttribute("data-poster")),u(t.getAttribute("data-src"))||(t.src=t.getAttribute("data-src")),u(t.getAttribute("data-srcset"))||t.setAttribute("srcset",t.getAttribute("data-srcset"))},A=t=>{M(t).forEach(t=>{S(t)})},R=(t,i)=>{t.forEach(t=>{if(t.intersectionRatio>0||t.isIntersecting){const e=t.target;i.unobserve(e),"VIME-PLAYER"===e.nodeName?A(e):S(e)}})};class j{constructor(t){this.player=t,this.hasMediaChangedBefore=!1,this.cache=new Map,this.internalState=new Map,this.providerState=new Map,this.adapterCalls=new Map,Object.values(h).forEach(t=>{this.cache.set(t,this.player[t]),this.internalState.set(t,this.player[t]),this.providerState.set(t,r[t])})}async onWillRender(){const t=Object.values(h);await this.flushAdapterCalls();for(let i=0;i<t.length;i+=1){const e=t[i],s=this.cache.get(e),a=this.player[e];if(s===a)continue;const n=this.internalState.get(e)===a;!o(e)||n?(this.fireEvent(e,a,s),this.cache.set(e,a)):(this.player[e]=this.internalState.get(e),console.error(`Player.${e} is readonly. Do not attempt to change it.`))}}async flushAdapterCalls(){if(!this.player.playbackReady||0===this.adapterCalls.size)return;const t=await this.player.getAdapter();await Promise.all(Array.from(this.adapterCalls.values()).map(async i=>{try{await i(t)}catch(t){this.player.errors=[...this.player.errors,t],this.markAsInternallyChanged(h.Errors)}})),this.adapterCalls.clear()}queueAdapterCall(t,i){this.adapterCalls.set(t,i)}onMediaChange(){this.hasMediaChangedBefore?(this.adapterCalls.clear(),Object.keys(r).forEach(t=>{const i=r[t];this.internalState.set(t,i),this.providerState.set(t,i),this.player[t]=i})):this.hasMediaChangedBefore=!0}markAsInternallyChanged(t){this.internalState.set(t,this.player[t])}async onInternalStateChange(t,i,e){var s;if(l(i))throw Error(`INTERNAL STATECHANGE [${t.nodeName}]: attempted to change readonly prop \`${i}\`.`);if(this.player.debug&&i!==h.CurrentTime&&console.log(`STATECHANGE [${t.nodeName}]: ${i} -> ${e}`),i===h.Errors)return this.player.errors=[...this.player.errors,...e],void this.markAsInternallyChanged(i);const a=await this.player.getProvider();(a===t||(null===(s=a)||void 0===s?void 0:s.contains(t)))&&this.providerState.set(i,e),this.player[i]=e,this.markAsInternallyChanged(i)}onPausedChange(t){t!==this.providerState.get(h.Paused)&&this.queueAdapterCall(h.Paused,i=>(this.player.paused=t,t?i.pause():i.play()))}onCurrentTimeChange(t){const i=Math.max(0,Math.min(t,this.player.playbackReady?this.player.duration:1/0)),e=this.providerState.get(h.CurrentTime);Math.floor(i)!==Math.floor(e)&&this.queueAdapterCall(h.CurrentTime,t=>(this.player.currentTime=i,t.setCurrentTime(i)))}onVolumeChange(t){const i=Math.max(0,Math.min(t,100));i!==this.providerState.get(h.Volume)&&this.queueAdapterCall(h.Volume,t=>(this.player.volume=i,t.setVolume(i)))}onMutedChange(t){t!==this.providerState.get(h.Muted)&&this.queueAdapterCall(h.Muted,i=>(this.player.muted=t,i.setMuted(t)))}async onPlaybackRateChange(t,i){if(i===this.providerState.get(h.PlaybackRate))return;let e=!0;if(await this.player.canSetPlaybackRate()||(console.warn("Cannot change `playbackRate`."),e=!1),this.player.playbackRates.includes(i)||(console.warn(`Invalid \`playbackRate\` of ${i}. Valid values are [${this.player.playbackRates.join(", ")}]`),e=!1),!e)return this.player.playbackRate=t,void this.cache.set(h.PlaybackRate,t);this.queueAdapterCall(h.PlaybackRate,async t=>{var e;return null===(e=t.setPlaybackRate)||void 0===e?void 0:e.call(t,i)})}async onPlaybackQualityChange(t,i){if(c(i)||i===this.providerState.get(h.PlaybackQuality))return;let e=!0;if(await this.player.canSetPlaybackQuality()||(console.warn("Cannot change `playbackQuality`."),e=!1),this.player.playbackQualities.includes(i)||(console.warn(`Invalid \`playbackQuality\` of ${i}. Valid values are [${this.player.playbackQualities.join(", ")}]`),e=!1),!e)return this.player.playbackQuality=t,void this.cache.set(h.PlaybackQuality,t);this.queueAdapterCall(h.PlaybackQuality,async t=>{var e;return null===(e=t.setPlaybackQuality)||void 0===e?void 0:e.call(t,i)})}fireEvent(t,i,e){const s=[];s.push(new CustomEvent(v(t),{bubbles:!1,detail:i})),t!==h.Paused||i||s.push(new CustomEvent("vPlay",{bubbles:!1})),t===h.Seeking&&e&&!i&&s.push(new CustomEvent("vSeeked",{bubbles:!1})),s.forEach(t=>{this.player.dispatchEvent(t)})}destroy(){this.cache.clear(),this.internalState.clear(),this.providerState.clear(),this.adapterCalls.clear()}}let I=[];class z{constructor(t){this.player=t,I.push(t)}willPlay(){I.forEach(t=>{try{t!==this.player&&t.autopause&&(t.paused=!0)}catch(t){}})}destroy(){I=I.filter(t=>t!==this.player)}}let L=0;const O=class{constructor(t){e(this,t),this.vPausedChange=s(this,"vPausedChange",7),this.vPlay=s(this,"vPlay",7),this.vPlayingChange=s(this,"vPlayingChange",7),this.vSeekingChange=s(this,"vSeekingChange",7),this.vSeeked=s(this,"vSeeked",7),this.vBufferingChange=s(this,"vBufferingChange",7),this.vDurationChange=s(this,"vDurationChange",7),this.vCurrentTimeChange=s(this,"vCurrentTimeChange",7),this.vReady=s(this,"vReady",7),this.vPlaybackReady=s(this,"vPlaybackReady",7),this.vPlaybackStarted=s(this,"vPlaybackStarted",7),this.vPlaybackEnded=s(this,"vPlaybackEnded",7),this.vBufferedChange=s(this,"vBufferedChange",7),this.vTextTracksChange=s(this,"vTextTracksChange",7),this.vErrorsChange=s(this,"vErrorsChange",7),this.vLoadStart=s(this,"vLoadStart",7),this.vCurrentSrcChange=s(this,"vCurrentSrcChange",7),this.vCurrentPosterChange=s(this,"vCurrentPosterChange",7),this.vMediaTitleChange=s(this,"vMediaTitleChange",7),this.vControlsChange=s(this,"vControlsChange",7),this.vPlaybackRateChange=s(this,"vPlaybackRateChange",7),this.vPlaybackRatesChange=s(this,"vPlaybackRatesChange",7),this.vPlaybackQualityChange=s(this,"vPlaybackQualityChange",7),this.vPlaybackQualitiesChange=s(this,"vPlaybackQualitiesChange",7),this.vMutedChange=s(this,"vMutedChange",7),this.vVolumeChange=s(this,"vVolumeChange",7),this.vViewTypeChange=s(this,"vViewTypeChange",7),this.vMediaTypeChange=s(this,"vMediaTypeChange",7),this.vLiveChange=s(this,"vLiveChange",7),this.vTouchChange=s(this,"vTouchChange",7),this.vLanguageChange=s(this,"vLanguageChange",7),this.vLanguagesChange=s(this,"vLanguagesChange",7),this.vFullscreenChange=s(this,"vFullscreenChange",7),this.vPiPChange=s(this,"vPiPChange",7),this.disposal=new w,this.paused=!0,this.playing=!1,this.duration=-1,this.currentTime=0,this.autoplay=!1,this.ready=!1,this.playbackReady=!1,this.loop=!1,this.muted=!1,this.buffered=0,this.playbackRate=1,this.playbackRates=[1],this.playbackQualities=[],this.seeking=!1,this.debug=!1,this.playbackStarted=!1,this.playbackEnded=!1,this.buffering=!1,this.controls=!1,this.isControlsActive=!1,this.errors=[],this.isCaptionsActive=!1,this.isSettingsActive=!1,this.volume=50,this.isFullscreenActive=!1,this.aspectRatio="16:9",this.isAudioView=!1,this.isVideoView=!1,this.isAudio=!1,this.isVideo=!1,this.isLive=!1,this.isMobile=b,this.isTouch=!1,this.isPiPActive=!1,this.autopause=!0,this.playsinline=!1,this.language="en",this.translations={en:T},this.languages=["en"],this.i18n=T,this.noSkeleton=!1}onPausedChange(){this.paused?(this.playing=!1,this.scheduler.markAsInternallyChanged(h.Playing)):this.autopauseMgr.willPlay(),this.scheduler.onPausedChange(this.paused)}onCurrentTimeChange(){this.scheduler.onCurrentTimeChange(this.currentTime)}onPlaybackReady(){this.ready||(this.ready=!0,this.scheduler.markAsInternallyChanged(h.Ready))}onMutedChange(){this.scheduler.onMutedChange(this.muted)}onPlaybackRateChange(t,i){this.scheduler.onPlaybackRateChange(i,t)}onPlaybackQualityChange(t,i){this.scheduler.onPlaybackQualityChange(i,t)}onErrorsChange(){this.debug&&console.error(this.errors[this.errors.length-1])}onTextTracksChange(){var t;if(c(this.textTracks))return null===(t=this.textTracksChangeListener)||void 0===t||t.call(this),this.currentCaption=void 0,this.scheduler.markAsInternallyChanged(h.CurrentCaption),this.isCaptionsActive=!1,void this.scheduler.markAsInternallyChanged(h.IsCaptionsActive);this.onActiveCaptionChange(),this.textTracksChangeListener=p(this.textTracks,"change",this.onActiveCaptionChange.bind(this))}onVolumeChange(){this.scheduler.onVolumeChange(this.volume)}onViewTypeChange(){this.isAudioView=this.viewType===y.Audio,this.scheduler.markAsInternallyChanged(h.IsAudioView),this.isVideoView=this.viewType===y.Video,this.scheduler.markAsInternallyChanged(h.IsVideoView)}onMediaTypeChange(){this.isAudio=this.mediaType===C.Audio,this.scheduler.markAsInternallyChanged(h.IsAudio),this.isVideo=this.mediaType===C.Video,this.scheduler.markAsInternallyChanged(h.IsVideo)}onLiveChange(){this.isLive=this.duration===1/0,this.scheduler.markAsInternallyChanged(h.IsLive)}onLanguagesUpdate(){this.languages=Object.keys(this.translations),this.scheduler.markAsInternallyChanged(h.Languages)}onI18NUpdate(){var t;this.i18n=Object.assign({},null!==(t=this.translations[this.language])&&void 0!==t?t:T),this.scheduler.markAsInternallyChanged(h.I18N)}async getProvider(){if(!this.provider){const{children:t}=this.el;let i=0;for(;!this.provider&&i<t.length;){const e=t[i];c(null==e?void 0:e.getAdapter)||(this.provider=e),i+=1}if(!this.provider)throw Error("No media provider was found.")}return this.provider}async getAdapter(){if(!this.adapter){const t=await this.getProvider();this.adapter=await t.getAdapter()}return this.adapter}async play(){return(await this.getAdapter()).play()}async pause(){return(await this.getAdapter()).pause()}async canPlay(t){return(await this.getAdapter()).canPlay(t)}async canAutoplay(){return g()}async canMutedAutoplay(){return g(!0)}async canSetPlaybackRate(){var t,i;const e=await this.getAdapter();return null!==(i=null===(t=e.canSetPlaybackRate)||void 0===t?void 0:t.call(e))&&void 0!==i&&i}async canSetPlaybackQuality(){var t,i;const e=await this.getAdapter();return null!==(i=null===(t=e.canSetPlaybackQuality)||void 0===t?void 0:t.call(e))&&void 0!==i&&i}async canSetFullscreen(){var t,i;const e=await this.getAdapter();return this.fullscreen.isSupported||null!==(i=null===(t=e.canSetFullscreen)||void 0===t?void 0:t.call(e))&&void 0!==i&&i}async enterFullscreen(t){var i,e;if(!this.isVideoView)throw Error("Cannot enter fullscreen on an audio player view.");if(this.fullscreen.isSupported)return this.fullscreen.enterFullscreen(t);const s=await this.getAdapter();if(await(null===(i=s.canSetFullscreen)||void 0===i?void 0:i.call(s)))return null===(e=s.enterFullscreen)||void 0===e?void 0:e.call(s,t);throw Error("Fullscreen API is not available.")}async exitFullscreen(){var t;if(this.fullscreen.isSupported)return this.fullscreen.exitFullscreen();const i=await this.getAdapter();return null===(t=i.exitFullscreen)||void 0===t?void 0:t.call(i)}async canSetPiP(){var t,i;const e=await this.getAdapter();return null!==(i=null===(t=e.canSetPiP)||void 0===t?void 0:t.call(e))&&void 0!==i&&i}async enterPiP(){var t;if(!this.isVideoView)throw Error("Cannot enter PiP mode on an audio player view.");if(!await this.canSetPiP())throw Error("Picture-in-Picture API is not available.");const i=await this.getAdapter();return null===(t=i.enterPiP)||void 0===t?void 0:t.call(i)}async exitPiP(){var t;const i=await this.getAdapter();return null===(t=i.exitPiP)||void 0===t?void 0:t.call(i)}async extendLanguage(t,i){var e;this.translations=Object.assign(Object.assign({},this.translations),{[t]:Object.assign(Object.assign({},null!==(e=this.translations[t])&&void 0!==e?e:{}),i)}),this.scheduler.markAsInternallyChanged(h.Translations)}async onMediaChange(t){t.stopPropagation(),this.scheduler.onMediaChange()}async onStateChange(t){t.stopImmediatePropagation();const i=t.detail;this.scheduler.onInternalStateChange(i.by,i.prop,i.value)}connectedCallback(){this.autopauseMgr=new z(this.el),this.scheduler=new j(this.el),this.onPausedChange(),this.onCurrentTimeChange(),this.onVolumeChange(),this.onMutedChange(),this.fullscreen=new F(this.el,t=>{this.isFullscreenActive=t,this.scheduler.markAsInternallyChanged(h.IsFullscreenActive)}),this.disposal.add(m(t=>{this.isTouch=t,this.scheduler.markAsInternallyChanged(h.IsTouch)}))}componentWillLoad(){return function(i,e){var s=t(i),a=new Map,n={wormholes:a,state:e};k.set(i,n);var h=i.connectedCallback;i.connectedCallback=function(){k.set(i,n),h&&h.call(i)};var r=i.disconnectedCallback;i.disconnectedCallback=function(){k.delete(i),r&&r.call(i)},s.addEventListener("openWormhole",(function(t){t.stopPropagation();var i=t.detail,e=i.consumer,s=i.onOpen;if(!a.has(e)){if("symbol"!=typeof e){var h=e.connectedCallback,r=e.disconnectedCallback;e.connectedCallback=function(){a.set(e,t.detail),h&&h.call(e)},e.disconnectedCallback=function(){a.delete(e),r&&r.call(e)}}a.set(e,t.detail),P(t.detail,n.state),null==s||s.resolve((function(){a.delete(e)}))}})),s.addEventListener("closeWormhole",(function(t){a.delete(t.detail)}))}(this,this.getPlayerState()),this.getProvider()}componentDidLoad(){this.disposal.add(((t,i={})=>{const e=new w;if("undefined"!=typeof window&&window.IntersectionObserver){const s=new IntersectionObserver(R,i);s.observe(t),e.add(()=>{s.unobserve(t)}),M(t).forEach(t=>{s.observe(t),e.add(()=>{s.unobserve(t)})})}else A(t);return()=>{e.empty()}})(this.el))}componentWillRender(){return this.scheduler.onWillRender()}disconnectedCallback(){var t;null===(t=this.textTracksChangeListener)||void 0===t||t.call(this),this.fullscreen.destroy(),this.autopauseMgr.destroy(),this.scheduler.destroy(),this.toggledCaption=void 0,this.provider=void 0,this.adapter=void 0,this.disposal.empty()}getPlayerState(){return Object.values(h).reduce((t,i)=>Object.assign(Object.assign({},t),{[i]:this[i]}),{})}calcAspectRatio(){const[t,i]=this.aspectRatio.split(":");return 100/Number(t)*Number(i)}async callAdapter(t,i){return(await this.getAdapter())[t](i)}async toggleCaptionsVisiblity(t){const i=null!=t?t:!this.isCaptionsActive;if(c(this.textTracks)||i&&c(this.toggledCaption)||!i&&c(this.getActiveCaption()))return;if(i)return this.toggledCaption.mode="showing",void(this.toggledCaption=void 0);const e=this.getActiveCaption();this.toggledCaption=e,e.mode=this.hasCustomCaptions()?"disabled":"hidden"}hasCustomControls(){return!u(this.el.querySelector("vime-ui vime-controls"))}hasCustomCaptions(){return!u(this.el.querySelector("vime-ui vime-captions"))}getActiveCaption(){var t;return Array.from(null!==(t=this.textTracks)&&void 0!==t?t:[]).filter(t=>"subtitles"===t.kind||"captions"===t.kind).find(t=>t.mode===(this.hasCustomCaptions()?"hidden":"showing"))}onActiveCaptionChange(){const t=this.getActiveCaption();this.currentCaption=t||this.toggledCaption,this.scheduler.markAsInternallyChanged(h.CurrentCaption),this.isCaptionsActive=!c(t),this.scheduler.markAsInternallyChanged(h.IsCaptionsActive)}genId(){var t;const i=null===(t=this.el)||void 0===t?void 0:t.id;return d(i)&&i.length>0?i:(L+=1,"vime-player-"+L)}render(){const t=(this.isAudioView?"Audio Player":"Video Player")+(c(this.mediaTitle)?"":" - "+this.mediaTitle),i=!f||!this.isVideoView||this.playsinline&&!this.isFullscreenActive;return a(n,{id:this.genId(),tabindex:"0","aria-label":t,"aria-hidden":this.ready?"false":"true",style:{paddingBottom:this.isVideoView?this.calcAspectRatio()+"%":void 0},class:{idle:i&&this.hasCustomControls()&&this.isVideoView&&!this.paused&&!this.isControlsActive,mobile:this.isMobile,touch:this.isTouch,audio:this.isAudioView,video:this.isVideoView,fullscreen:this.isFullscreenActive}},!this.noSkeleton&&a("div",{class:{skeleton:!0,active:!this.ready}}),!this.controls&&i&&this.isVideoView&&a("div",{class:"blocker"}),a(E,{state:this.getPlayerState()},a("slot",null)))}get el(){return t(this)}static get watchers(){return{paused:["onPausedChange"],currentTime:["onCurrentTimeChange"],playbackReady:["onPlaybackReady"],muted:["onMutedChange"],playbackRate:["onPlaybackRateChange"],playbackQuality:["onPlaybackQualityChange"],errors:["onErrorsChange"],textTracks:["onTextTracksChange"],volume:["onVolumeChange"],viewType:["onViewTypeChange"],mediaType:["onMediaTypeChange"],duration:["onLiveChange"],translations:["onLanguagesUpdate","onI18NUpdate"],language:["onI18NUpdate"]}}};O.style='vime-player{--player-font-family:"Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif;box-sizing:border-box;direction:ltr;font-family:var(--player-font-family);-moz-osx-font-smoothing:auto;-webkit-font-smoothing:subpixel-antialiased;-webkit-tap-highlight-color:transparent;font-variant-numeric:tabular-nums;font-weight:500;line-height:1.7;width:100%;display:block;max-width:100%;min-width:275px;min-height:40px;position:relative;text-shadow:none;outline:0;background-color:var(--player-bg, #000);transition:box-shadow 0.3s ease, height 0.3s ease, padding 0.3s ease;box-shadow:var(--player-box-shadow)}vime-player *,vime-player *::after,vime-player *::before{box-sizing:inherit}vime-player button{font:inherit;line-height:inherit;width:auto;margin:0}vime-player button::-moz-focus-inner{border:0}vime-player a,vime-player button,vime-player input,vime-player label{touch-action:manipulation}vime-player.idle{cursor:none}vime-player.audio{background-color:transparent !important}vime-player.video{height:0;overflow:hidden}vime-player.fullscreen{margin:0;border-radius:0;width:100%;height:100%;padding-bottom:0 !important}vime-player>.blocker{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;display:inline-block}vime-player>.skeleton{display:inline-block;position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;background-color:var(--player-skeleton-base-color);background-image:linear-gradient(90deg, var(--player-skeleton-base-color), var(--player-skeleton-highlight-color), var(--player-skeleton-base-color));background-size:200px 100%;background-repeat:no-repeat;line-height:1;pointer-events:none;animation:load var(--player-skeleton-duration) ease-in-out infinite;opacity:0;visibility:hidden;transition:var(--player-fade-transition, opacity 0.4s ease-in-out)}@keyframes load{0%{background-position:-200px 0}100%{background-position:calc(200px + 100%) 0}}vime-player>.skeleton.active{opacity:1;visibility:visible}';export{O as vime_player}