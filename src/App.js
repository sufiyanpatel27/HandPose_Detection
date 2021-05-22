import React, { useRef } from 'react';

//importing tensorflow libraries
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';

//importing webcam library
import Webcam from 'react-webcam';

//importing drawHand from utilities for drawing the pose
import { drawHand } from './drawHand'

//style
import './App.css';

function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async () => {
    const model = await handpose.load()
    console.log('Handpose model loaded.');
    setInterval(() => {
      detect(model)
    }, 10)
  };

  runHandpose();

  const detect = async (model) => {
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await model.estimateHands(video);
      console.log(hand);

      const ctx = canvasRef.current.getContext('2d');
      drawHand(hand, ctx);
    }
  }




  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zindex: 9,
            width: 933.33,
            height: 700
          }} />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zindex: 9,
            width: 933.33,
            height: 700,
          }} />
      </header>
    </div>
  );
}

export default App;
