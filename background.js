
console.log("hello there");


let websiteTimeData; getWebsiteTimeData().then(function(){
    console.log(websiteTimeData);
    updateTimestamps();
});
/*
{
    "window1_id": {
        "https://abc.com": [{start: timestamp, end: timestamp}, {start: timestamp, end: timestamp}],
        "https://def.com": [{start: timestamp, end: timestamp}, {start: timestamp, end: timestamp}],
        ...
    },
    "window2_id": {
        "https://abc.com": [{start: timestamp, end: timestamp}, {start: timestamp, end: timestamp}],
        "https://def.com": [{start: timestamp, end: timestamp}, {start: timestamp, end: timestamp}],
        ...
    },
    ...
}
*/

function getDomain(url){
    return url.split("/").splice(0, 3).join("/");
}

function resetWebsiteTimeData(){
    chrome.storage.local.set({websiteTimeData: {}}, function(){
        websiteTimeData = {};
        prevActiveTabs = undefined;
    });
}

function getWebsiteTimeData(){
    return chrome.storage.local.get(["websiteTimeData"]).then(function(result){
        websiteTimeData = result.websiteTimeData || {};
    });
}

let prevActiveTabs;
function updateTimestamps(){
    return new Promise(function(resolve){
        queryActiveTabs().then(function(tabs){
            tabs.forEach(function(currentTab, i){

                    let currentTabDomain = getDomain(currentTab.url);
                    let currentTabWindowId = currentTab.windowId;

                    if(prevActiveTabs != undefined){
                        var prevTabDomain = getDomain(prevActiveTabs[i].url);
                        var prevTabWindowId = prevActiveTabs[i].windowId;
                        if(websiteTimeData[prevTabWindowId] == undefined){
                            websiteTimeData[prevTabWindowId] = {};
                        }
                    }

                    if(websiteTimeData[currentTabWindowId] == undefined){
                        websiteTimeData[currentTabWindowId] = {};
                    }
                    if(websiteTimeData[currentTabWindowId][currentTabDomain] == undefined){
                        websiteTimeData[currentTabWindowId][currentTabDomain] = [];
                    }
                    
                    if(prevActiveTabs != undefined){
                        let prevTabIntervalsLastIndex = websiteTimeData[prevTabWindowId][prevTabDomain].length-1;
                        websiteTimeData[prevTabWindowId][prevTabDomain][prevTabIntervalsLastIndex].end = Date.now();
                    }

                    websiteTimeData[currentTabWindowId][currentTabDomain].push({
                        start: Date.now()
                    });
            });

            prevActiveTabs = tabs;
            chrome.storage.local.set({websiteTimeData: websiteTimeData});
        }).then(() => {resolve(websiteTimeData)});
    });
}

function queryActiveTabs(){
    // gets the active tab for each window
    // which are the only tabs that the user can interact with
    return chrome.tabs.query({active: true});
}

chrome.tabs.onActivated.addListener(function(activeInfo){
    // Update websiteTimeData
    updateTimestamps().then(function(timeData){
        chrome.tabs.get(activeInfo.tabId, function(tab){
            chrome.tabs.sendMessage(activeInfo.tabId, {
                header: "data",
                tab: tab,
                timeData: timeData
            });
        });
    });
});

chrome.runtime.onMessage.addListener(function(message, sender){
    if(sender.tab && message.header == "data-request"){
        updateTimestamps().then(function(timeData){
                chrome.tabs.sendMessage(sender.tab.id, {
                    header: "data",
                    tab: sender.tab,
                    timeData: timeData
                });
        });
    }
    // if(message.header == "task-input"){
    //     updateTimestamps().then(function(timeData){
                
    //     });
    // }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(changeInfo.status == "complete"){
        updateTimestamps().then(function(timeData){
            chrome.tabs.sendMessage(tabId, {
                header: "data",
                tab: tab,
                timeData: timeData
            });
        });
    }
});


// Reset every day
prevDay = (new Date()).getDate();
setInterval(function(){
    if((new Date()).getDate() != prevDay){
        resetWebsiteTimeData();
    }
}, 60*1000);

