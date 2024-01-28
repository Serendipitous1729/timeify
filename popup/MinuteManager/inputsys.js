
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

console.log(timetable);
}
console.log(timetable);
function gettime(){    
    let hrs = parseInt(document.getElementById('hrs').value)
    let mins = parseInt(document.getElementById('mins').value);
    let free_time = (60*hrs) + mins;
    console.log(free_time)
    console.log('l', limit);
    let working_Time = limit - free_time;
    console.log('q', working_Time)
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
        console.log(daysLeft);
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
            console.log('i', inDay);
            console.log('l', limit);
            let timeLeft = limit - inDay;
            console.log(timeLeft);
            let tasksGiven = [];
            let notAssigned = [];
            for (let i of taskList) {  
                console.log(i[0]);           
                if (i[0] <= timeLeft) {
                    console.log(i);
                    timetable[dayNumber].push(i);
                    tasksGiven.push(i);
                    timeLeft -= i[0];
                } else {
                    notAssigned.push([i]);
                }}
            console.log('l2', limit)
            
            
            
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
                        console.log('d:', day);
                        console.log('t:', task[1])
                        alert("Not possible");
                        return [[]];
                    } else {
                        return outList;
            }
        }
    }
}
}
function scheduleTasks() {
    console.log('w', working_Time)
    let entries = entryList;
    console.log(timetable);
    let outList = final(entries, timetable, working_Time);for (let i = 0; i < outList.length; i++) {
        if (i === 0) {
            console.log("Today: ", outList[i]);
        } else {
            console.log("Day", i, ':', outList[i]);
        }
    }

    }
    
    
