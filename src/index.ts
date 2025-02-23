import { SetupPoseDetection, GetPoseConnections, GetPoseLankmarks } from "./BodyPose";
import * as Kalidokit from "kalidokit";



function GetQueryParam(param: string): string | null {
    return (new URLSearchParams(window.location.search)).get(param)
}


let canRun = true;
async function main() {

    GetQueryParam("Server") ?? (() => { alert("Proxy server address invalid. Please rescan QR code or try again later"); canRun = false })();
    GetQueryParam("AuthToken") ?? (() => { alert("Authentication token invalid. Please rescan QR code or try again later");canRun = false })();

    if(!canRun){
        return
    }

    await SetupPoseDetection()

    
    const serverUrl = decodeURIComponent(GetQueryParam("Server")!)
    const AuthenticationToken = decodeURIComponent(GetQueryParam("AuthToken")!)


    //Kalidokit.Pose.solve()d

    setInterval(async function () {
        const response = await fetch(serverUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "PoseConnections": GetPoseConnections(),
                "PoseLandmarks": GetPoseLankmarks(),
                "AuthToken": AuthenticationToken
            })

        })
        


        if (response.status !== 200) {
            alert("Internal server error")
        }

    }, 100)



}

main();