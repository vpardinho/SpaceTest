var FirstPersonMovement=pc.createScript("firstPersonMovement");FirstPersonMovement.attributes.add("camera",{type:"entity",description:"Optional, assign a camera entity, otherwise one is created"}),FirstPersonMovement.attributes.add("power",{type:"number",default:2500,description:"Adjusts the speed of player movement"}),FirstPersonMovement.attributes.add("lookSpeed",{type:"number",default:.25,description:"Adjusts the sensitivity of looking"}),FirstPersonMovement.prototype.initialize=function(){this.force=new pc.Vec3,this.eulers=new pc.Vec3;var e=this.app;e.mouse.on("mousemove",this._onMouseMove,this),e.mouse.on("mousedown",(function(){e.mouse.enablePointerLock()}),this),this.entity.collision||console.error("First Person Movement script needs to have a 'collision' component"),this.entity.rigidbody&&this.entity.rigidbody.type===pc.BODYTYPE_DYNAMIC||console.error("First Person Movement script needs to have a DYNAMIC 'rigidbody' component")},FirstPersonMovement.prototype.update=function(e){this.camera||this._createCamera();var t=this.force,s=this.app,o=this.camera.forward,i=this.camera.right,r=0,n=0;(s.keyboard.isPressed(pc.KEY_A)||s.keyboard.isPressed(pc.KEY_Q))&&(r-=i.x,n-=i.z),s.keyboard.isPressed(pc.KEY_D)&&(r+=i.x,n+=i.z),s.keyboard.isPressed(pc.KEY_W)&&(r+=o.x,n+=o.z),s.keyboard.isPressed(pc.KEY_S)&&(r-=o.x,n-=o.z),0!==r&&0!==n&&(t.set(r,0,n).normalize().scale(this.power),this.entity.rigidbody.applyForce(t)),this.camera.setLocalEulerAngles(this.eulers.y,this.eulers.x,0)},FirstPersonMovement.prototype._onMouseMove=function(e){(pc.Mouse.isPointerLocked()||e.buttons[0])&&(this.eulers.x-=this.lookSpeed*e.dx,this.eulers.y-=this.lookSpeed*e.dy)},FirstPersonMovement.prototype._createCamera=function(){this.camera=new pc.Entity,this.camera.setName("First Person Camera"),this.camera.addComponent("camera"),this.entity.addChild(this.camera),this.camera.translateLocal(0,.5,0)};var Ui=pc.createScript("ui");Ui.attributes.add("html",{type:"asset",assetType:"html"}),Ui.attributes.add("css",{type:"asset",assetType:"css"}),Ui.prototype.initialize=function(){var e=document.createElement("div");e.id="ui",e.innerHTML=this.html.resource,document.body.appendChild(e),style=pc.createStyle(this.css.resource),document.head.appendChild(style)};var Manager=pc.createScript("manager");Manager.attributes.add("template",{title:"Template",type:"entity"}),Manager.attributes.add("numClones",{title:"Num Clones",type:"number",default:50}),Manager.attributes.add("spread",{title:"Spread",type:"number",default:10}),Manager.prototype.initialize=function(){this.entities=[];for(var t=0;t<this.numClones;t++){var e=this.template.clone();e.enabled=!0,this.app.root.addChild(e),this.entities.push(e),this.reset(e)}},Manager.prototype.update=function(t){this.entities.forEach((function(t){t.getPosition().y<-10&&this.reset(t)}),this)},Manager.prototype.reset=function(t){var e=this.entity.getPosition();t.rigidbody.linearVelocity=pc.Vec3.ZERO,t.rigidbody.angularVelocity=pc.Vec3.ZERO,t.rigidbody.teleport(e.x+(Math.random()-.5)*this.spread,e.y,e.z+(Math.random()-.5)*this.spread)};var TvScreen=pc.createScript("tvScreen");TvScreen.attributes.add("screenMaterial",{title:"Screen Material",description:"The screen material of the TV that displays the video texture.",type:"asset",assetType:"material"}),TvScreen.attributes.add("playEvent",{title:"Play Event",description:"Set the TV screen material emissive map on this event.",type:"string",default:""}),TvScreen.prototype.initialize=function(){this.app.on(this.playEvent,(function(e){var t=this.screenMaterial.resource;t.emissiveMap=e,t.update()}),this)};pc.extend(pc,function(){function computeGaussian(e,t){return 1/Math.sqrt(2*Math.PI*t)*Math.exp(-e*e/(2*t*t))}function calculateBlurValues(e,t,s,o,r){e[0]=computeGaussian(0,r),t[0]=0,t[1]=0;var i,a,l=e[0];for(i=0,a=Math.floor(7.5);i<a;i++){var u=computeGaussian(i+1,r);e[2*i]=u,e[2*i+1]=u,l+=2*u;var h=2*i+1.5;t[4*i]=s*h,t[4*i+1]=o*h,t[4*i+2]=-s*h,t[4*i+3]=-o*h}for(i=0,a=e.length;i<a;i++)e[i]/=l}var BloomEffect=function(e){var t={aPosition:pc.SEMANTIC_POSITION},s=["attribute vec2 aPosition;","","varying vec2 vUv0;","","void main(void)","{","    gl_Position = vec4(aPosition, 0.0, 1.0);","    vUv0 = (aPosition + 1.0) * 0.5;","}"].join("\n"),o=["precision "+e.precision+" float;","","varying vec2 vUv0;","","uniform sampler2D uBaseTexture;","uniform float uBloomThreshold;","","void main(void)","{","    vec4 color = texture2D(uBaseTexture, vUv0);","","    gl_FragColor = clamp((color - uBloomThreshold) / (1.0 - uBloomThreshold), 0.0, 1.0);","}"].join("\n"),r=["precision "+e.precision+" float;","","#define SAMPLE_COUNT 15","","varying vec2 vUv0;","","uniform sampler2D uBloomTexture;","uniform vec2 uBlurOffsets[SAMPLE_COUNT];","uniform float uBlurWeights[SAMPLE_COUNT];","","void main(void)","{","    vec4 color = vec4(0.0);","    for (int i = 0; i < SAMPLE_COUNT; i++)","    {","        color += texture2D(uBloomTexture, vUv0 + uBlurOffsets[i]) * uBlurWeights[i];","    }","","    gl_FragColor = color;","}"].join("\n"),i=["precision "+e.precision+" float;","","varying vec2 vUv0;","","uniform float uBloomEffectIntensity;","uniform sampler2D uBaseTexture;","uniform sampler2D uBloomTexture;","","void main(void)","{","    vec4 bloom = texture2D(uBloomTexture, vUv0) * uBloomEffectIntensity;","    vec4 base = texture2D(uBaseTexture, vUv0);","","    base *= (1.0 - clamp(bloom, 0.0, 1.0));","","    gl_FragColor = base + bloom;","}"].join("\n");this.extractShader=new pc.Shader(e,{attributes:t,vshader:s,fshader:o}),this.blurShader=new pc.Shader(e,{attributes:t,vshader:s,fshader:r}),this.combineShader=new pc.Shader(e,{attributes:t,vshader:s,fshader:i});var a=e.width,l=e.height;this.targets=[];for(var u=0;u<2;u++){var h=new pc.Texture(e,{format:pc.PIXELFORMAT_R8_G8_B8_A8,width:a>>1,height:l>>1});h.minFilter=pc.FILTER_LINEAR,h.magFilter=pc.FILTER_LINEAR,h.addressU=pc.ADDRESS_CLAMP_TO_EDGE,h.addressV=pc.ADDRESS_CLAMP_TO_EDGE;var n=new pc.RenderTarget(e,h,{depth:!1});this.targets.push(n)}this.bloomThreshold=.25,this.blurAmount=4,this.bloomIntensity=1.25,this.sampleWeights=new Float32Array(15),this.sampleOffsets=new Float32Array(30)};return(BloomEffect=pc.inherits(BloomEffect,pc.PostEffect)).prototype=pc.extend(BloomEffect.prototype,{render:function(e,t,s){var o=this.device,r=o.scope;r.resolve("uBloomThreshold").setValue(this.bloomThreshold),r.resolve("uBaseTexture").setValue(e.colorBuffer),pc.drawFullscreenQuad(o,this.targets[0],this.vertexBuffer,this.extractShader),calculateBlurValues(this.sampleWeights,this.sampleOffsets,1/this.targets[1].width,0,this.blurAmount),r.resolve("uBlurWeights[0]").setValue(this.sampleWeights),r.resolve("uBlurOffsets[0]").setValue(this.sampleOffsets),r.resolve("uBloomTexture").setValue(this.targets[0].colorBuffer),pc.drawFullscreenQuad(o,this.targets[1],this.vertexBuffer,this.blurShader),calculateBlurValues(this.sampleWeights,this.sampleOffsets,0,1/this.targets[0].height,this.blurAmount),r.resolve("uBlurWeights[0]").setValue(this.sampleWeights),r.resolve("uBlurOffsets[0]").setValue(this.sampleOffsets),r.resolve("uBloomTexture").setValue(this.targets[1].colorBuffer),pc.drawFullscreenQuad(o,this.targets[0],this.vertexBuffer,this.blurShader),r.resolve("uBloomEffectIntensity").setValue(this.bloomIntensity),r.resolve("uBloomTexture").setValue(this.targets[0].colorBuffer),r.resolve("uBaseTexture").setValue(e.colorBuffer),pc.drawFullscreenQuad(o,t,this.vertexBuffer,this.combineShader,s)}}),{BloomEffect:BloomEffect}}());var Bloom=pc.createScript("bloom");Bloom.attributes.add("bloomIntensity",{type:"number",default:1,min:0,title:"Intensity"}),Bloom.attributes.add("bloomThreshold",{type:"number",default:.25,min:0,max:1,precision:2,title:"Threshold"}),Bloom.attributes.add("blurAmount",{type:"number",default:4,min:1,title:"Blur amount"}),Bloom.prototype.initialize=function(){this.effect=new pc.BloomEffect(this.app.graphicsDevice),this.effect.bloomThreshold=this.bloomThreshold,this.effect.blurAmount=this.blurAmount,this.effect.bloomIntensity=this.bloomIntensity;var e=this.entity.camera.postEffects;e.addEffect(this.effect),this.on("attr",(function(e,t){this.effect[e]=t}),this),this.on("state",(function(t){t?e.addEffect(this.effect):e.removeEffect(this.effect)})),this.on("destroy",(function(){e.removeEffect(this.effect)}))};pc.extend(pc,function(){var BrightnessContrastEffect=function(t){this.shader=new pc.Shader(t,{attributes:{aPosition:pc.SEMANTIC_POSITION},vshader:["attribute vec2 aPosition;","","varying vec2 vUv0;","","void main(void)","{","    gl_Position = vec4(aPosition, 0.0, 1.0);","    vUv0 = (aPosition.xy + 1.0) * 0.5;","}"].join("\n"),fshader:["precision "+t.precision+" float;","uniform sampler2D uColorBuffer;","uniform float uBrightness;","uniform float uContrast;","varying vec2 vUv0;","void main() {","gl_FragColor = texture2D( uColorBuffer, vUv0 );","gl_FragColor.rgb += uBrightness;","if (uContrast > 0.0) {","gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) / (1.0 - uContrast) + 0.5;","} else {","gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) * (1.0 + uContrast) + 0.5;","}","}"].join("\n")}),this.brightness=0,this.contrast=0};return(BrightnessContrastEffect=pc.inherits(BrightnessContrastEffect,pc.PostEffect)).prototype=pc.extend(BrightnessContrastEffect.prototype,{render:function(t,e,r){var s=this.device,i=s.scope;i.resolve("uBrightness").setValue(this.brightness),i.resolve("uContrast").setValue(this.contrast),i.resolve("uColorBuffer").setValue(t.colorBuffer),pc.drawFullscreenQuad(s,e,this.vertexBuffer,this.shader,r)}}),{BrightnessContrastEffect:BrightnessContrastEffect}}());var BrightnessContrast=pc.createScript("brightnessContrast");BrightnessContrast.attributes.add("brightness",{type:"number",default:0,min:-1,max:1,precision:5,title:"Brightness"}),BrightnessContrast.attributes.add("contrast",{type:"number",default:0,min:-1,max:1,precision:5,title:"Contrast"}),BrightnessContrast.prototype.initialize=function(){this.effect=new pc.BrightnessContrastEffect(this.app.graphicsDevice),this.effect.brightness=this.brightness,this.effect.contrast=this.contrast,this.on("attr",(function(t,e){this.effect[t]=e}),this);var t=this.entity.camera.postEffects;t.addEffect(this.effect),this.on("state",(function(e){e?t.addEffect(this.effect):t.removeEffect(this.effect)})),this.on("destroy",(function(){t.removeEffect(this.effect)}))};pc.extend(pc,function(){var FxaaEffect=function(e){var o={aPosition:pc.SEMANTIC_POSITION},r=["attribute vec2 aPosition;","","void main(void)","{","    gl_Position = vec4(aPosition, 0.0, 1.0);","}"].join("\n"),a=["precision "+e.precision+" float;","","uniform sampler2D uColorBuffer;","uniform vec2 uResolution;","","#define FXAA_REDUCE_MIN   (1.0/128.0)","#define FXAA_REDUCE_MUL   (1.0/8.0)","#define FXAA_SPAN_MAX     8.0","","void main()","{","    vec3 rgbNW = texture2D( uColorBuffer, ( gl_FragCoord.xy + vec2( -1.0, -1.0 ) ) * uResolution ).xyz;","    vec3 rgbNE = texture2D( uColorBuffer, ( gl_FragCoord.xy + vec2( 1.0, -1.0 ) ) * uResolution ).xyz;","    vec3 rgbSW = texture2D( uColorBuffer, ( gl_FragCoord.xy + vec2( -1.0, 1.0 ) ) * uResolution ).xyz;","    vec3 rgbSE = texture2D( uColorBuffer, ( gl_FragCoord.xy + vec2( 1.0, 1.0 ) ) * uResolution ).xyz;","    vec4 rgbaM  = texture2D( uColorBuffer,  gl_FragCoord.xy  * uResolution );","    vec3 rgbM  = rgbaM.xyz;","    float opacity  = rgbaM.w;","","    vec3 luma = vec3( 0.299, 0.587, 0.114 );","","    float lumaNW = dot( rgbNW, luma );","    float lumaNE = dot( rgbNE, luma );","    float lumaSW = dot( rgbSW, luma );","    float lumaSE = dot( rgbSE, luma );","    float lumaM  = dot( rgbM,  luma );","    float lumaMin = min( lumaM, min( min( lumaNW, lumaNE ), min( lumaSW, lumaSE ) ) );","    float lumaMax = max( lumaM, max( max( lumaNW, lumaNE) , max( lumaSW, lumaSE ) ) );","","    vec2 dir;","    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));","    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));","","    float dirReduce = max( ( lumaNW + lumaNE + lumaSW + lumaSE ) * ( 0.25 * FXAA_REDUCE_MUL ), FXAA_REDUCE_MIN );","","    float rcpDirMin = 1.0 / ( min( abs( dir.x ), abs( dir.y ) ) + dirReduce );","    dir = min( vec2( FXAA_SPAN_MAX, FXAA_SPAN_MAX), max( vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), dir * rcpDirMin)) * uResolution;","","    vec3 rgbA = 0.5 * (","        texture2D( uColorBuffer, gl_FragCoord.xy  * uResolution + dir * ( 1.0 / 3.0 - 0.5 ) ).xyz +","        texture2D( uColorBuffer, gl_FragCoord.xy  * uResolution + dir * ( 2.0 / 3.0 - 0.5 ) ).xyz );","","    vec3 rgbB = rgbA * 0.5 + 0.25 * (","        texture2D( uColorBuffer, gl_FragCoord.xy  * uResolution + dir * -0.5 ).xyz +","        texture2D( uColorBuffer, gl_FragCoord.xy  * uResolution + dir * 0.5 ).xyz );","","    float lumaB = dot( rgbB, luma );","","    if ( ( lumaB < lumaMin ) || ( lumaB > lumaMax ) )","    {","        gl_FragColor = vec4( rgbA, opacity );","    }","    else","    {","        gl_FragColor = vec4( rgbB, opacity );","    }","}"].join("\n");this.fxaaShader=new pc.Shader(e,{attributes:o,vshader:r,fshader:a}),this.resolution=new Float32Array(2)};return(FxaaEffect=pc.inherits(FxaaEffect,pc.PostEffect)).prototype=pc.extend(FxaaEffect.prototype,{render:function(e,o,r){var a=this.device,t=a.scope;this.resolution[0]=1/e.width,this.resolution[1]=1/e.height,t.resolve("uResolution").setValue(this.resolution),t.resolve("uColorBuffer").setValue(e.colorBuffer),pc.drawFullscreenQuad(a,o,this.vertexBuffer,this.fxaaShader,r)}}),{FxaaEffect:FxaaEffect}}());var Fxaa=pc.createScript("fxaa");Fxaa.prototype.initialize=function(){this.effect=new pc.FxaaEffect(this.app.graphicsDevice);var e=this.entity.camera.postEffects;e.addEffect(this.effect),this.on("state",(function(o){o?e.addEffect(this.effect):e.removeEffect(this.effect)})),this.on("destroy",(function(){e.removeEffect(this.effect)}))};pc.extend(pc,function(){var VignetteEffect=function(e){var t={aPosition:pc.SEMANTIC_POSITION},i=["attribute vec2 aPosition;","","varying vec2 vUv0;","","void main(void)","{","    gl_Position = vec4(aPosition, 0.0, 1.0);","    vUv0 = (aPosition.xy + 1.0) * 0.5;","}"].join("\n"),s=["precision "+e.precision+" float;","","uniform sampler2D uColorBuffer;","uniform float uDarkness;","uniform float uOffset;","","varying vec2 vUv0;","","void main() {","    vec4 texel = texture2D(uColorBuffer, vUv0);","    vec2 uv = (vUv0 - vec2(0.5)) * vec2(uOffset);","    gl_FragColor = vec4(mix(texel.rgb, vec3(1.0 - uDarkness), dot(uv, uv)), texel.a);","}"].join("\n");this.vignetteShader=new pc.Shader(e,{attributes:t,vshader:i,fshader:s}),this.offset=1,this.darkness=1};return(VignetteEffect=pc.inherits(VignetteEffect,pc.PostEffect)).prototype=pc.extend(VignetteEffect,{render:function(e,t,i){var s=this.device,f=s.scope;f.resolve("uColorBuffer").setValue(e.colorBuffer),f.resolve("uOffset").setValue(this.offset),f.resolve("uDarkness").setValue(this.darkness),pc.drawFullscreenQuad(s,t,this.vertexBuffer,this.vignetteShader,i)}}),{VignetteEffect:VignetteEffect}}());var Vignette=pc.createScript("vignette");Vignette.attributes.add("offset",{type:"number",default:1,min:0,precision:5,title:"Offset"}),Vignette.attributes.add("darkness",{type:"number",default:1,precision:5,title:"Darkness"}),Vignette.prototype.initialize=function(){this.effect=new pc.VignetteEffect(this.app.graphicsDevice),this.effect.offset=this.offset,this.effect.darkness=this.darkness,this.on("attr",(function(e,t){this.effect[e]=t}),this);var e=this.entity.camera.postEffects;e.addEffect(this.effect),this.on("state",(function(t){t?e.addEffect(this.effect):e.removeEffect(this.effect)})),this.on("destroy",(function(){e.removeEffect(this.effect)}))};var VideoTexture=pc.createScript("videoTexture");VideoTexture.attributes.add("video",{title:"Video",description:"MP4 video asset to play back on this video texture.",type:"asset"}),VideoTexture.attributes.add("playEvent",{title:"Play Event",description:"Event that is fired as soon as the video texture is ready to play.",type:"string",default:""}),VideoTexture.prototype.initialize=function(){var e=this.app,t=document.createElement("video");t.autoplay=!0,t.crossOrigin="anonymous",t.loop=!0,t.muted=!0,t.playsInline=!0,t.src=this.video.getFileUrl();var i=t.style;i.width="1px",i.height="1px",i.position="absolute",i.opacity="0",i.zIndex="-1000",i.pointerEvents="none",document.body.appendChild(t),this.videoTexture=new pc.Texture(e.graphicsDevice,{format:pc.PIXELFORMAT_R8_G8_B8,minFilter:pc.FILTER_LINEAR_MIPMAP_LINEAR,magFilter:pc.FILTER_LINEAR,addressU:pc.ADDRESS_CLAMP_TO_EDGE,addressV:pc.ADDRESS_CLAMP_TO_EDGE,mipmaps:!0,autoMipmap:!0}),this.videoTexture.setSource(t),t.addEventListener("canplay",function(t){e.fire(this.playEvent,this.videoTexture)}.bind(this))},VideoTexture.prototype.update=function(e){this.videoTexture.upload()};var LocalAudio=pc.createScript("localAudio");LocalAudio.attributes.add("audio",{type:"asset"}),LocalAudio.extend({initialize:function(){this.app.mouse.on(pc.EVENT_MOUSEDOWN,this.play,this),this.camera=this.app.root.findByName("Camera");var t=this.app.systems.sound.context,a=(t.listener,this.entity.getPosition()),e=new PannerNode(t,{panningModel:"HRTF",distanceModel:"linear",positionX:a.x,positionY:a.y,positionZ:a.z,orientationX:-1,orientationY:0,orientationZ:0,refDistance:5,maxDistance:3,rolloffFactor:10,coneInnerAngle:40,coneOuterAngle:60,coneOuterGain:.4}),i=t.createGain(),n=new StereoPannerNode(t,{pan:0}),o=new Audio,r=this.audio.getFileUrl();o.src=r,o.crossOrigin="anonymous",o.loop=!0;var s=t.createAnalyser();t.createMediaElementSource(o).connect(s).connect(i).connect(n).connect(e).connect(t.destination),this.context=t,this.audioSource=o,this.stereoPanner=n,this.panner=e,this.gainNode=i,this.analyser=s,this.initBars()},initBars:function(){this.context;var t=this.analyser;t.fftSize=128;var a=t.fftSize,e=new Uint8Array(a),i=null,n=0,o=0,r=[],s=this.entity.findByName("bar");for(n=-4;n<4;++n)for(o=-4;o<4;++o)i=s.clone(),r.push(i),i.setPosition(.2*n,0,.2*o),i.enabled=!0,this.entity.addChild(i);this.dataArray=e,this.analyser=t,this.bars=r},updateBars:function(){var t=this.bars;this.analyser.getByteFrequencyData(this.dataArray);for(var a=0;a<t.length;++a){var e=this.bars[a],i=e.getPosition();e.setPosition(i.x,this.dataArray[a]/100,i.z)}},play:function(){this.audioSource&&this.audioSource.play()},update:function(t){if(this.context){var a=this.context.listener,e=this.camera.getPosition(),i=this.camera.up,n=this.camera.forward;a.positionX.value=e.x,a.positionY.value=e.y,a.positionZ.value=e.z,a.forwardX.value=n.x,a.forwardY.value=n.y,a.forwardZ.value=n.z,a.upX.value=i.x,a.upY.value=i.y,a.upZ.value=i.z}},postUpdate:function(){this.dataArray&&this.updateBars()}});