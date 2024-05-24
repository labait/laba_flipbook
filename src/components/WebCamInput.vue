<script setup>

import { ref, onMounted } from 'vue'
import p5 from 'p5';
import ml5 from 'ml5'

/* based on by https://editor.p5js.org/jeffThompson/sketches/acsbpNkef

SKELETON TRACKING
Jeff Thompson | 2021 | jeffreythompson.org

In addition to face tracking, machine-learning allows
us to track all kinds of other things including our
skeletons! This is really fun for interactive projects
like games where you want to get your body involved.

This example uses ml5.js, a wonderful open-source
library intended to be easy to interface with p5.js.
Basically, it wraps up more complex code like
TensorFlow and can save a *ton* of headache
but doesn't give you as much control.

MORE INFO
+ https://learn.ml5js.org/#/reference/posenet

SEE ALSO
+ https://learn.ml5js.org/#/reference/handpose

CHALLENGES
1. What ways can you think to use the skeleton
   points? Can you use the angle/distance in
   interesting ways?
2. Can you get the HandPose library working? It's is 
   also available with ml5.js and should be pretty
   similar

*/

let p;
let video;     // webcam input
let model;     // PoseNet machine-learning model
let skeleton;  // detected skeleton
let firstSkeleton = true;

const width = 640;
const height = 480;

// note: this is a little different than the previous
// versions of this function, since the position from
// PostNet has separate x/y variables
const scalePoint = (pt) => {
  let x = p.map(pt.x, 0,video.width, 0,width);
  let y = p.map(pt.y, 0,video.height, 0,height);
  return p.createVector(x, y);
}

onMounted(() => {
  p = new p5((p) => {
    // p.setup = () => {
    //   p.createCanvas(400, 400);
    // };
    // p.draw = () => {
    //   p.background(220);
    //   p.ellipse(200, 200, 50, 50);
    // };

    p.setup = () => {
      const canvas = p.createCanvas(640, 480);
      canvas.parent("#cam");
      video = p.createCapture(p.VIDEO);
      video.hide();

      // load the PoseNet model
      model = ml5.poseNet(video, { maxPoseDetections: 1 } );
      
      // when it has a new pose (skeleton), this 
      // function will be run!
      // (basically we just grab the first prediction,
      // since we only want one skeleton)
      model.on('pose', function(predictions) {
        skeleton = predictions[0];
      });
    }


    p.draw = () => {
      //console.log('draw')
      if (video.loadedmetadata) {
        p.image(video, 0,0, width,height);
      }
      if (skeleton !== undefined) {

        // if this is the first face we've
        // found, print the info
        if (firstSkeleton) {
          console.log(skeleton);
          firstSkeleton = false;
        }

        // the skeleton includes a list of 17 keypoints,
        // or named locations on the body – let's see them!
        p.fill(255);
        p.noStroke();
        for (let pt of skeleton.pose.keypoints) {
          
          // the points in PoseNet are in a different
          // format than in our face examples – they
          // include a 'part' (rightShoulder, etc), a
          // 'score' (confidence that this is correct)
          // and a position

          pt = scalePoint(pt.position);
          p.circle(pt.x, pt.y, 20);
        }

        // we can also get specific points!
        let leftWrist =  skeleton.pose.leftWrist;
        let rightWrist = skeleton.pose.rightWrist;

        // only display if the confidence level is high enough
        if (rightWrist.confidence > 0.3 && leftWrist.confidence > 0.3) {
          
          // grab the position from the wrists and convert into
          // a vector (which will let us do fancier math below)
          let l = p.createVector(leftWrist.x, leftWrist.y);
          l = scalePoint(l);
          
          let r = p.createVector(rightWrist.x, rightWrist.y);
          r = scalePoint(r);
          
          p.stroke(255);
          p.strokeWeight(6);
          p.line(l.x, l.y, r.x, r.y);

          // bonus!
          // we can use the dist() and angleBetween() functions
          // to calculate useful measurements between points!
          let a = l.angleBetween(r);  // angle (in radians)
          let d = l.dist(r);          // distance too!

          p.fill(0);
          p.noStroke();
          p.text('Angle: ' + p.nf(p.degrees(a), 0,2) + 'º\nDist: ' + p.nf(d, 0,2) + 'px', l.x,l.y);
        }
      }
    }

  });
})

</script>


<template>
  <div id="cam" :style="{width: `${width}px`, height: `${height}px`}"></div>
</template>

<style lang="scss" scoped>

  #cam {
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    opacity: 0.9;
    pointer-events: none;
  }
</style>