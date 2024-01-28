
let limit = 1440;

let done = false; 
    
let entryList = [];  

let slptm = 0;
timetable = [[]];
let working_Time = 1440;
let outList = [];


function getplan(){
    let hrs = parseInt(document.getElementById('pe_hrs').value)
    let mins = parseInt(document.getElementById('pe_mins').value);
    let duration = (60*hrs) + mins;
    let name = document.getElementById("pe_name").value;
    let date = document.getElementById('pe_date').value;
    let time = document.getElementById('pe_time').value;
    planned_event = [duration, time, name]
    var nowDate = new Date;
    var subDay = date.slice(8, 10);
    var subMonth = date.slice(5, 7) - 1;
    var subYear = date.slice(0, 4);
    var hwDate = new Date;
    hwDate.setFullYear(subYear, subMonth, subDay);
    var daysLeft = (hwDate - nowDate)/(24*60*60*1000);
    daysLeft = daysLeft.toFixed(0);
    if (daysLeft < timetable.length){
        timetable[daysLeft].push(planned_event);
    } else {
        while (daysLeft >= timetable.length){
            empty = [];
            timetable.push(empty);
        }
        timetable[daysLeft].push(planned_event);
        
    }

}
function gettime(){    
    let hrs = parseInt(document.getElementById('hrs').value)
    let mins = parseInt(document.getElementById('mins').value);
    let free_time = (60*hrs) + mins;
    let working_Time = limit - free_time;
}

    function ask() {
        if (!done){
        let time = parseInt(document.getElementById("time").value);
        let deadline = document.getElementById('deadline').value;
        var nowDate = new Date;
        var subDay = deadline.slice(8, 10);
        var subMonth = deadline.slice(5, 7) - 1;
        var subYear = deadline.slice(0, 4);
        var hwDate = new Date;
        hwDate.setFullYear(subYear, subMonth, subDay);
        var daysLeft = (hwDate - nowDate)/(24*60*60*1000);
        daysLeft = daysLeft.toFixed(0);
        let priority = parseInt(document.getElementById("Priority").value);
        let name = document.getElementById("name").value;
        let task = [time, daysLeft, priority, name];
        entryList.push(task);
        entryList = entryList.sort(
            (a, b) => b[2] - a[2] || a[1] - b[1]
        );
        }
    }
    
    function add(taskList, timetable, dayNumber, limit) {
        if (dayNumber < timetable.length) {
            let inDay = 0;
            
            for (let i = 0; i < timetable[dayNumber].length; i++) {
                inDay += timetable[dayNumber][i][0];
            }
            let timeLeft = limit - inDay;
            let tasksGiven = [];
            let notAssigned = [];
            for (let i of taskList) {        
                if (i[0] <= timeLeft) {
                    timetable[dayNumber].push(i);
                    tasksGiven.push(i);
                    timeLeft -= i[0];
                } else {
                    notAssigned.push([i]);
                }}
            
            
            
            for (let i of tasksGiven) {
                if (taskList.includes(i)) {
                    taskList.splice(taskList.indexOf(i), 1);
                }
            }
            
            return [timetable, taskList, notAssigned];
        } else {
            timetable.push([[0]]);
            return add(taskList, timetable, dayNumber, limit);
        }
    }
    
    function final(input, outList, workTime) {
        let notAssigned = [];
        let entries = input;
        
        for (let i = 0; i < outList.length; i++) {
            [outList, entries, notAssigned] = add(input, outList, i, workTime);
        }
        
        for (let i of notAssigned) {
            outList.push(i);
        }
        
        for (let day = 0; day < outList.length; day++) {
            for (let task of outList[day]) {
                if (task.length > 1) {
                    if (day > task[1]) {
                        alert("Not possible. Try changing some values.");
                        return [[]];
                    } else {
                        return outList;
            }
        }
    }
}
}
function scheduleTasks() {
    let entries = entryList;
    let outList = final(entries, timetable, working_Time);for (let i = 0; i < outList.length; i++) {
        if (i === 0) {
            console.log("Today: ", outList[i]);
        } else {
            console.log("Day", i, ':', outList[i]);
        }
    }
    alert("Press Ctrl+Shift+J");

    }
    
    
document.getElementById("all-submit").addEventListener("click", function(){
    scheduleTasks();
});
document.getElementById("tasks-submit").addEventListener("click", function(){
    ask();
});
document.getElementById("free-submit").addEventListener("click", function(){
    gettime();
});
document.getElementById("planned-submit").addEventListener("click", function(){
    getplan();
});