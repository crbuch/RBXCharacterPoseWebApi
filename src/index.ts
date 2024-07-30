import { SetupPoseDetection, GetPoseConnections, GetPoseLankmarks } from "./BodyPose";



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


    setInterval(async function () {
        const response = await fetch(serverUrl, {
            method: "POST",
            body: JSON.stringify({
                "PoseConnections": GetPoseConnections(),
                "PoseLandmarks": GetPoseLankmarks(),
                "AuthToken": AuthenticationToken
            })

        })

        if (response.status !== 200) {
            alert(response.statusText)
        }

    }, 100)



}
main()