const video = document.getElementById('video');
    const canvas = document.getElementById('output');
    const ctx = canvas.getContext('2d');

    async function setupCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support getUserMedia API");
        return;
      }

      video.width = 640;
      video.height = 480;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        video.srcObject = stream;

        return new Promise((resolve) => {
          if (video.readyState >= 2) { // HAVE_CURRENT_DATA
            video.play();
            resolve(video);
          } else {
            video.onloadedmetadata = () => {
              video.play();
              resolve(video);
            };
          }
        });
      } catch (error) {
        alert("Error accessing the camera: " + error.message);
      }
    }

    function onResults(results) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        drawLandmarks(ctx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });
      }
    }

    async function main() {
      await setupCamera();

      const pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      pose.onResults(onResults);

      function resizeCanvas() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      video.addEventListener('loadeddata', () => {
        resizeCanvas();
        detectPose();
      });

      async function detectPose() {
        await pose.send({ image: video });
        requestAnimationFrame(detectPose);
      }
    }

    main();