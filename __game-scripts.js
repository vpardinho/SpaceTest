var Terrain=pc.createScript("terrain");Terrain.attributes.add("width",{type:"number",default:100}),Terrain.attributes.add("depth",{type:"number",default:100}),Terrain.prototype.initialize=function(){this.world=[];for(var t=this.app.root.findByName("Tile"),i=0;i<this.width;i++){this.world[i]=[];for(var r=0;r<this.depth;r++){var e=t.clone();this.app.root.addChild(e),this.world[i][r]=e}}this.timer=0},Terrain.prototype.update=function(t){this.timer+=t;for(var i=this.width,r=this.depth,e=.5*i,a=.5*r,h=2*Math.sin(this.timer),o=0;o<i;o++)for(var d=0;d<r;d++){this.world[o][d].setLocalPosition(o-e,Math.cos(o/3)*Math.sin(d/3)*h,d-a)}};var Rotate=pc.createScript("rotate");Rotate.attributes.add("distance",{type:"number",default:15}),Rotate.attributes.add("speed",{type:"number",default:10}),Rotate.prototype.initialize=function(){this.pivot=this.entity.getPosition().clone()},Rotate.prototype.update=function(t){this.entity.setPosition(this.pivot),this.entity.rotate(0,t*this.speed,0),this.entity.translateLocal(0,0,this.distance)};var Balls=pc.createScript("balls");Balls.attributes.add("count",{type:"number",default:25}),Balls.prototype.initialize=function(){this.balls=[];for(var t=this.app.root.findByName("Ball"),a=0;a<this.count;a++){var l=t.clone();this.app.root.addChild(l),l.rigidbody.teleport(30*(Math.random()-.5),5,30*(Math.random()-.5)),this.balls.push(l)}},Balls.prototype.update=function(t){for(var a=0;a<this.balls.length;a++){var l=this.balls[a];l.getPosition().y<-10&&(l.rigidbody.linearVelocity=pc.Vec3.ZERO,l.rigidbody.angularVelocity=pc.Vec3.ZERO,l.rigidbody.teleport(30*(Math.random()-.5),5,30*(Math.random()-.5)))}};pc.script.createLoadingScreen((function(e){var t,a;t=["body {","    background-color: #000000;","}","#application-splash-wrapper {","    position: absolute;","    top: 0;","    left: 0;","    height: 100%;","    width: 100%;","    background-color: #000000;","}","#application-splash {","    position: absolute;","    top: calc(30% - 28px);","    width: 264px;","    left: calc(50% - 132px);","}","#application-splash img {","    width: 100%;","}","#progress-bar-container {","    margin: 20px auto 0 auto;","    height: 2px;","    width: 50%;","    background-color: #1d292c;","}","#progress-bar {","    width: 0%;","    height: 100%;","    background-color: #6f03fc;","}","@media (max-width: 480px) {","    #application-splash {","        width: 170px;","        left: calc(50% - 85px);","    }","}"].join("\n"),(a=document.createElement("style")).type="text/css",a.styleSheet?a.styleSheet.cssText=t:a.appendChild(document.createTextNode(t)),document.head.appendChild(a),function(){var e=document.createElement("div");e.id="application-splash-wrapper",document.body.appendChild(e);var t=document.createElement("div");t.id="application-splash",e.appendChild(t),t.style.display="none";var a=document.createElement("img");a.src="https://images.squarespace-cdn.com/content/5a3677c290badeaa35866b97/1515273659369-GJWNS15GSIDBX35EDATD/light_icon.png",t.appendChild(a),a.onload=function(){t.style.display="block"};var n=document.createElement("div");n.id="progress-bar-container",t.appendChild(n);var o=document.createElement("div");o.id="progress-bar",n.appendChild(o)}(),e.on("preload:end",(function(){e.off("preload:progress")})),e.on("preload:progress",(function(e){var t=document.getElementById("progress-bar");t&&(e=Math.min(1,Math.max(0,e)),t.style.width=100*e+"%")})),e.on("start",(function(){var e=document.getElementById("application-splash-wrapper");e.parentElement.removeChild(e)}))}));