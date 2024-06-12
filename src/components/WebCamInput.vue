<script setup>

import {useGlobal} from '../global.js'
const global = useGlobal()

import { ref, onMounted } from 'vue'
import p5 from 'p5';
import ml5 from 'ml5'

// import * as tf from '@tensorflow/tfjs';
// import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
// import mediapipeFacemesh from '@mediapipe/face_mesh';

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

const poinSize = 10;
const width = 320;
const height = 240;

// note: this is a little different than the previous
// versions of this function, since the position from
// PostNet has separate x/y variables
const scalePoint = (pt) => {
  let x = p.map(pt.x, 0,video.width, 0,width);
  let y = p.map(pt.y, 0,video.height, 0,height);
  return p.createVector(x, y);
}

// load the Face Landmarks model – this can be super
// slow so you might want to add a loading screen!
async function loadFaceModel() {
  console.log(faceLandmarksDetection.SupportedPackages)
  model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
    
    // optional: limit results to just one face
    { maxFaces: 1 }
  );
}

let throttleCounter = 0;



onMounted(() => {



  //return
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
      //model = ml5.poseNet(video, { maxPoseDetections: 1 } );
      model = ml5.poseNet(video, () => {
        console.log('Model loaded!');
      })
      
      // when it has a new pose (skeleton), this 
      // function will be run!
      // (basically we just grab the first prediction,
      // since we only want one skeleton)
      model.on('pose', function(predictions) {
        //console.log(predictions);
        skeleton = predictions[0];
      });

      // while(!tf.ready()) {
      //   // this while-loop will just repeat until
      //   // everything is ready for us
      // }
      // loadFaceModel();
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
          p.circle(pt.x, pt.y, poinSize);
        }

        // we can also get specific points!
        let leftWrist = skeleton.pose.leftWrist;
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
          //p.text('Angle: ' + p.nf(p.degrees(a), 0,2) + 'º\nDist: ' + p.nf(d, 0,2) + 'px', l.x,l.y);
          if(p.nf(d, 0,2) < (width/8) && skeleton.pose.score > 0.5) {
            global.triggerGesture('ok', skeleton.pose);
          }
        }

        // detect input
        // if(!flag) console.log(skeleton.pose)
        // flag = true;
        const time = new Date().getTime();
        if((throttleCounter % 20)  == 0) {
          const pose = skeleton.pose;
          const ratioThreshold = 0.3;
          if(pose.score > 0.5) {
            if(
              pose.rightShoulder.x > pose.rightWrist.x 
              && (pose.rightShoulder.x - pose.rightWrist.x) / pose.rightShoulder.x > ratioThreshold
            ) global.triggerGesture('right', pose);
            if(
              pose.leftWrist.x > pose.leftShoulder.x 
              && (pose.leftWrist.x - pose.leftShoulder.x) / pose.leftWrist.x > ratioThreshold
            ) global.triggerGesture('left', pose);
            if(
              (
                pose.rightElbow.y < pose.rightShoulder.y
                && pose.leftElbow.y < pose.leftShoulder.y
              )
            ) global.triggerGesture('back', pose);
          }
        }
        throttleCounter++;
      }
    }

  });
})

</script>


<template>
  <div class="camera-input">
    <!-- <a href="chrome://settings/content/camera">browser camera settings</a> -->
    <div id="cam" :style="{width: `${width}px`, height: `${height}px`}"></div>
  </div>
</template>

<style lang="scss" scoped>
  .camera-input {
    pointer-events: none;
    position: absolute;
    bottom: 0;
    #cam {
      transform: scale(-1, 1);
      opacity: 0.9;
    }
    z-index: 1000;
  }


  @media screen and (min-width: 768px) {
    .camera-input {
      right: 0;
    }
  }
</style>