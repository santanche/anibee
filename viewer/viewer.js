class Anim {

start() {
  var video = document.querySelector("#background-media");

  if (navigator.mediaDevices.getUserMedia) {
   navigator.mediaDevices.getUserMedia({ video: true })
     .then(function (stream) {
       video.srcObject = stream;
     })
     .catch(function (err0r) {
       console.log("Something went wrong!");
     });
  }

  this._groupMove = 1;

  this.targetMove = this.targetMove.bind(this);
  this.movementEnd = this.movementEnd.bind(this);
  this.groupSelected = this.groupSelected.bind(this);

  this._backMedia = document.querySelector("#background-media");
  this._backMedia.addEventListener("click", this.targetMove, false);

  this._targetImage = [];
  for (let ti = 0; ti < 5; ti++)
     this._targetImage[ti] = document.querySelector("#target-image-" + (ti+1));
  this._targetImage[0].
      addEventListener("animationend", this.movementEnd, false);

  document.querySelector("#button-group-1").
     addEventListener("click", function(){Anim.instance.groupSelected(1)}, false);
  document.querySelector("#button-group-2").
     addEventListener("click", function(){Anim.instance.groupSelected(2)}, false);
  document.querySelector("#button-group-3").
     addEventListener("click", function(){Anim.instance.groupSelected(3)}, false);
  document.querySelector("#button-group-4").
     addEventListener("click", function(){Anim.instance.groupSelected(4)}, false);
  document.querySelector("#button-group-5").
     addEventListener("click", function(){Anim.instance.groupSelected(5)}, false);

  this._dimensions = this.screenDimensions();

  this._lastTransX = 0;
  this._lastTransY = 0;
}

/*
zoomInClicked() {
  this._buttonZoomIn.style.display = "none";
  this._buttonSelectGroup.style.display = "inline";
  this._buttonState = 2;
}
*/

groupSelected(group) {
   console.log("group " + group);
   this._targetImage[this._groupMove-1].
      removeEventListener("animationend", this.movementEnd, false);
   this._targetImage[group-1].
      addEventListener("animationend", this.movementEnd, false);
   this._targetImage[group-1].style.display = "inline";
   this._groupMove = group;
}

moveTo(transX, transY) {
  this.moveToAnim(transX, transY);

  this._lastTransX = transX;
  this._lastTransY = transY;
}

moveToStraight(transX, transY) {
  this._targetImage[this._groupMove-1].style.left = transX + "px";
  this._targetImage[this._groupMove-1].style.top = transY + "px";
}

moveToAnim(transX, transY) {
  let rule = this.findKeyframesRule("image-anim");

  rule.appendRule("100% {left:" + transX + "px; top:" + transY + "px}");

  this._targetImage[this._groupMove-1].classList.add("animated-image");
}

movementEnd() {
   this.moveToStraight(this._lastTransX, this._lastTransY);
   this._targetImage[this._groupMove-1].classList.remove("animated-image");
}

targetMove(event) {
  console.log("translate(" + event.clientX + "px," + event.clientY + "px)");
  this.moveTo(event.clientX, event.clientY);
}

screenDimensions() {
  let dimensions = {
     left: (window.screenLeft != undefined) ? window.screenLeft : window.screenX,
     top: (window.screenTop != undefined) ? window.screenTop : window.screenY,
     width: (window.innerWidth)
               ? window.innerWidth
               : (document.documentElement.clientWidth)
                  ? document.documentElement.clientWidth
                  : screen.width,
     height: (window.innerHeight)
                ? window.innerHeight
                : (document.documentElement.clientHeight)
                   ? document.documentElement.clientHeight
                   : screen.height,
     };
  dimensions.zoom = dimensions.width / window.screen.availWidth;
  return dimensions;
}

findKeyframesRule(rule) {
  console.log(rule);
  let ss = document.styleSheets;
  for (let i = 0; i < ss.length; i++) {
    console.log(ss[i]);
    for (let j = 0; j < ss[i].cssRules.length; j++) {
      if (ss[i].cssRules[j].type == window.CSSRule.KEYFRAMES_RULE && 
      ss[i].cssRules[j].name == rule) { 
        return ss[i].cssRules[j]; }
    }
  }
  return null;
}

}

(function() {
   Anim.instance = new Anim();
})();