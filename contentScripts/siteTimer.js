let socialMediaDomains = [
    "https://www.youtube.com"
];

function getDomain(url){
    return url.split("/").splice(0, 3).join("/");
}

function getTimeSpentOnDomain(timeData, domain, windowID){
    let timeSpent = 0;
    timeData[windowID][domain].forEach(function(interval){
        timeSpent += (interval.end || Date.now()) - interval.start;
    });
    return timeSpent;
}

let timeData;
let myDomain;
window.addEventListener("load", function(){
    chrome.runtime.sendMessage({
        header: "data-request",
    });
});


chrome.runtime.onMessage.addListener(function(message, sender){
    alert("hgvvbelwefvgbhjbe");
    if(message.header == "data" && sender.tab == undefined){
        timeData = message.timeData;
        myDomain = getDomain(message.tab.url);

        var timerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap');

            .extension-timer-container{
                position: absolute;
                z-index: 100000;
                min-width: 300px;
                pointer-events: none;
            }

            #draggable-elem{
                height: 10%;
                width: 20%;
                background: #0f0f0f;
                font-family: 'Montserrat', sans-serif;
                color: whitesmoke;
                position: relative;
                display: flex;
                justify-content: center;
                cursor: move;
                padding: 25px;
                border-radius: 25px;
                box-shadow: -5px -5px 9px rgba(255,255,255,0.05),
                5px 5px 9px rgba(0,0,0,0.5);
                overflow: hidden;
                border: 3px solid white;
                pointer-events: auto;
            }

            #draggable-elem > .time{
                font-size: 200%;
                vertical-align: middle;
                user-select: none;
            }
        </style>
        <div class="extension-timer-container">
        <div id="draggable-elem">
            <div class="time">
                00:00:00
            </div>
        </div>    
        </div>`
        let draggableElem = document.getElementById("draggable-elem");
        if(!draggableElem && socialMediaDomains.includes(myDomain)){
                let everythingContainer = document.createElement("div");
                everythingContainer.id = "extension-everything-container";
                everythingContainer.innerHTML = timerHTML;
                document.body.append(everythingContainer);
                draggableElem = document.getElementById("draggable-elem");

                let initialX = 0,
                    initialY = 0;
                let moveElement = false;

                //Events Object
                let events = {
                mouse: {
                    down: "mousedown",
                    move: "mousemove",
                    up: "mouseup",
                },
                touch: {
                    down: "touchstart",
                    move: "touchmove",
                    up: "touchend",
                },
                };

                let deviceType = "";

                //Detech touch device
                const isTouchDevice = () => {
                try {
                    //We try to create TouchEvent (it would fail for desktops and throw error)
                    document.createEvent("TouchEvent");
                    deviceType = "touch";
                    return true;
                } catch (e) {
                    deviceType = "mouse";
                    return false;
                }
                };

                isTouchDevice();

                //Start (mouse down / touch start)
                draggableElem.addEventListener(events[deviceType].down, (e) => {
                e.preventDefault();
                //initial x and y points
                initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
                initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;

                //Start movement
                moveElement = true;
                });

                //Move
                draggableElem.addEventListener(events[deviceType].move, (e) => {
                //if movement == true then set top and left to new X andY while removing any offset
                if (moveElement) {
                    e.preventDefault();
                    let newX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
                    let newY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
                    draggableElem.style.top =
                    draggableElem.offsetTop - (initialY - newY) + "px";
                    draggableElem.style.left =
                    draggableElem.offsetLeft - (initialX - newX) + "px";
                    initialX = newX;
                    initialY = newY;
                }
                });

                //mouse up / touch end
                draggableElem.addEventListener(
                events[deviceType].up,
                (stopMovement = (e) => {
                    moveElement = false;
                })
                );

                draggableElem.addEventListener("mouseleave", stopMovement);
                draggableElem.addEventListener(events[deviceType].up, (e) => {
                moveElement = false;
                });
        }
        window.requestAnimationFrame(updateTimer);
    }
});

function updateTimer(){
    if(socialMediaDomains.includes(myDomain)){
        let totalTime = 0;
        for(windowID in timeData){
            totalTime += getTimeSpentOnDomain(timeData, myDomain, windowID);
        }
        console.log(totalTime);
        let seconds = Math.floor((totalTime / 1000) % 60),
        minutes = Math.floor((totalTime / (1000 * 60)) % 60),
        hours = Math.floor(totalTime / (1000 * 60 * 60));

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        document.querySelector("#draggable-elem > .time").innerText = `${hours}:${minutes}:${seconds}`
        window.requestAnimationFrame(updateTimer);
    }
}