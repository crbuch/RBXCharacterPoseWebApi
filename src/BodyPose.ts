import {Pose, POSE_CONNECTIONS} from "@mediapipe/pose"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";


const video = document.getElementById('video') as HTMLVideoElement;
const canvas = document.getElementById('output') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

async function setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support getUserMedia API");
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });
        video.srcObject = stream;

        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve(video);
            };
        });
    } catch (error) {
        alert("Error accessing the camera: " + error.message);
    }
}




let rslt;
let conn;

function onResults(results) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    rslt = results.poseLandmarks
    conn = POSE_CONNECTIONS


    if (results.poseLandmarks) {
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        drawLandmarks(ctx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });
    }
}






function GetPoseLankmarks(){
    return rslt
}
function GetPoseConnections(){
    return conn
}



async function SetupPoseDetection() {
    await setupCamera();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
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

    async function detectPose() {
        await pose.send({ image: video });
        requestAnimationFrame(detectPose);
    }

    detectPose();
}

export {SetupPoseDetection, GetPoseLankmarks, GetPoseConnections}