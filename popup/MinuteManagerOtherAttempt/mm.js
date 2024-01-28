function getInput(){
    let taskName = document.querySelector("#task-name").value;
    let taskDeadline = document.querySelector("#task-deadline").value;
    return {
        header: "task-input",
        taskName: taskName,
        taskDeadline: taskDeadline,
        completed: false,
    };
}

document.querySelector("#submit").addEventListener("click", function(){
    chrome.storage.local.get(["tasks"], function(data){
        let currentTasks = data.tasks || [];
        currentTasks.push(getInput());
        chrome.storage.local.set({tasks: currentTasks});
        
    });
});
