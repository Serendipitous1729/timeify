function createRow(name, time) {
    let row = document.createElement("tr");
    let c1 = document.createElement("td");
    let c2 = document.createElement("td");
    c1.innerText = name;
    let s = Math.floor((time/1000) % 60);
    let m = Math.floor((time/(1000 * 60)) % 60);
    let h = Math.floor((time/(1000 * 60 * 60)) % 24);
    c2.innerText = `${h}h ${m}m ${s}s`;
    row.appendChild(c1);
    row.appendChild(c2);
    return row;
}

function getTimeSpentOnDomain(timeData, domain){
    let timeSpent = 0;
    timeData[domain].forEach(function(interval){
        timeSpent += (interval.end || Date.now()) - interval.start;
    });
    return timeSpent;
}

function createForWindow(windowID, data){
    let parent = document.createElement("div");
    parent.innerHTML = `
    <details>
        <summary>Window ${windowID}</summary>
        <div>
        <table id="${windowID}table" width="300px" border="3px" bordercolor="white">
            <thead>
            <th> Site </th>
            <th> Time% </th>
            </thead>
            <tbody id="tb${windowID}">
            </tbody>
        </table>
        </div>
    </details><br>`;
    document.body.append(parent);
    let tbody = document.querySelector("#tb"+windowID);
    let total = 0;
    for(let domain in data){
        total += getTimeSpentOnDomain(data, domain);
        if(domain.length > 0){
            let row = createRow(domain, getTimeSpentOnDomain(data, domain));
            tbody.append(row);
        }
        createRow("TOTAL", total);
    }
}

chrome.storage.local.get(["websiteTimeData"], function(data){
    for(let window in data.websiteTimeData){
        createForWindow(window, data.websiteTimeData[window]);
    }
})