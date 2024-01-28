// alert("i <3 squishy buttons");
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

chrome.runtime.onMessage.addListener(function(message, sender){
    alert("we got mail!!!!!!");
    if(message.header == "data" && sender.tab == undefined){
        timeData = message.timeData;
        myDomain = getDomain(message.tab.url);
        window.requestAnimationFrame(updateTimer);
    }
});

function updateTimer(){
    let totalTime = 0;
    for(windowID in timeData){
        totalTime += getTimeSpentOnDomain(timeData, myDomain, windowID);
    }
    console.log(totalTime);
    window.requestAnimationFrame(updateTimer);
}

// function getDomain(url){
//     return url.split("/").splice(0, 3).join("/");
// }



// function getTimeSpentOnDomain(timeData, domain, windowID){
//     let timeSpent = 0;
//     timeData[windowID][domain].forEach(function(interval){
//         timeSpent += (interval.end || Date.now()) - interval.start;
//     });
//     return timeSpent;
// }

// let timeData;
// let myDomain;

// chrome.runtime.sendMessage({
//     header: "data-request",
// });

// chrome.runtime.onMessage.addListener(function(message, sender){
//     alert("we got mail!!!!!!");
//     if(message.header == "data" && sender.tab == undefined){
//         timeData = message.timeData;
//         myDomain = getDomain(message.tab.url);
//         window.requestAnimationFrame(updateTimer);
//     }
// });

// function updateTimer(){
//     let totalTime = 0;
//     for(windowID in timeData){
//         totalTime += getTimeSpentOnDomain(timeData, myDomain, windowID);
//     }
//     console.log(totalTime);
//     window.requestAnimationFrame(updateTimer);
// }