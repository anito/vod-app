import{P as e}from"./p-7e342812.js";const a=new Set([e.isFullscreenActive,e.isControlsActive,e.isPiPActive,e.isLive,e.isTouch,e.isAudio,e.isVideo,e.isAudioView,e.isVideoView]),n=new Set([e.ready,e.mounted,e.destroyed,e.playbackStarted,e.playbackEnded,e.playbackReady]),v=e=>a.has(e)?`v${e.replace("is","").replace("Active","")}Change`:n.has(e)?`v${e.charAt(0).toUpperCase()}${e.slice(1)}`:`v${e.charAt(0).toUpperCase()}${e.slice(1)}Change`;var g;!function(e){e.themeChange="vThemeChange",e.pausedChange="vPausedChange",e.play="vPlay",e.playingChange="vPlayingChange",e.seekingChange="vSeekingChange",e.seeked="vSeeked",e.mutedChange="vMutedChange",e.bufferingChange="vBufferingChange",e.durationChange="vDurationChange",e.currentTimeChange="vCurrentTimeChange",e.ready="vReady",e.mounted="vMounted",e.destroyed="vDestroyed",e.playbackReady="vPlaybackReady",e.playbackStarted="vPlaybackStarted",e.playbackEnded="vPlaybackEnded",e.bufferedChange="vBufferedChange",e.currentSrcChange="vCurrentSrcChange",e.currentPosterChange="vCurrentPosterChange",e.mediaTitleChange="vMediaTitleChange",e.errorsChange="vErrorsChange",e.textTracksChange="vTextTracksChange",e.loadStart="vLoadStart",e.playbackRateChange="vPlaybackRateChange",e.playbackRatesChange="vPlaybackRatesChange",e.playbackQualityChange="vPlaybackQualityChange",e.playbackQualitiesChange="vPlaybackQualitiesChange",e.volumeChange="vVolumeChange",e.mediaTypeChange="vMediaTypeChange",e.viewTypeChange="vViewTypeChange",e.controlsChange="vControlsChange",e.liveChange="vLiveChange",e.touchChange="vTouchChange",e.languageChange="vLanguageChange",e.languagesChange="vLanguagesChange",e.fullscreenChange="vFullscreenChange",e.pipChange="vPiPChange"}(g||(g={}));export{g as P,v as g}