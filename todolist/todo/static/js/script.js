"use strict";

// Global variable

let enterPressed = false;
let history;


// Functions

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
}

function notasks() {
    const tasks = document.querySelectorAll('#tasklist .task');

    console.log(tasks.length);

    if (tasks.length === 0) {
        return true;
    } else {
        return false;
    }

}

function switch_mode() {


    // Get swith mode button
    let switch_mode_button = document.getElementById("trash");

    // Set elements retrieval

        // retrieve all del buttons
        let del_task_buttons = document.getElementsByClassName("del_task");
        // retrieve all tasks checkboxes
        let checkbox = document.getElementsByClassName("checkbox");
        // retrieve all tasks name
        let taskname_list = document.getElementsByClassName("taskname");

    // Individual elements retrieval

        // retrieve undo button
        let undo = document.getElementById("undo");
        // retrieve entry bar
        let entrybar = document.getElementById("text_entry");
        // retrieve big button
        let bigbutton = document.getElementById("big_button");

    if (switch_mode_button.checked) {
        console.log("deletion mode");


        // Change set elements

            // Display del button
            for (let i = 0; i < del_task_buttons.length; i++) { // Loop over the collection of elements and set their hidden state
                del_task_buttons[i].hidden = false;
            }

            // Hide checkboxes
            for (let i = 0; i < checkbox.length; i++) { // Loop over the collection of elements and set their hidden state
                checkbox[i].hidden = true;
            }

            // Prevent task name modification
            for (let i = 0; i < taskname_list.length; i++) { // Loop over the collection of elements and set their hidden state
                taskname_list[i].readOnly = true;
            }

         // Change Individual elements

            // Disable entry bar
            entrybar.disabled = true;

            // Change button to "-" & hide button if notasks
            if (notasks()) {
                bigbutton.hidden = true;
            }
            bigbutton.innerHTML = "-";   

            // Display undo button
            undo.hidden = false;

    }
    else {
        console.log("normal mode");

         // Change set elements

            // Hide del button
            for (let i = 0; i < del_task_buttons.length; i++) { // Loop over the collection of elements and set their hidden state
                del_task_buttons[i].hidden = true;
            }

            // Hide checkboxes
            for (let i = 0; i < checkbox.length; i++) { // Loop over the collection of elements and set their hidden state
                checkbox[i].hidden = false;
            }

            // Allow task name modification
            for (let i = 0; i < taskname_list.length; i++) { // Loop over the collection of elements and set their hidden state
                taskname_list[i].readOnly = false;
            }

         // Change Individual elements

            // Disable entry bar
            entrybar.disabled = false;

            // Change button to "+"
            if (bigbutton.hidden) {
                bigbutton.hidden = false;
            }

            bigbutton.innerHTML = "+";

            // Hide undo button
            undo.hidden = true;

    }
}

async function del_task(target) {

    // retrieve id of the target button
    let id = target.id;

     // retrieve big button
     let bigbutton = document.getElementById("big_button");

    console.log("Deleting task");
    console.log("id: " + id)
    console.time();

    try {
        // Database update
        const response = await fetch('delete/', {
            method: 'POST',
            headers:  {
                'Content-Type': 'application/json',
                "X-CSRFToken": getCookie('csrftoken'),
            },
            body: JSON.stringify({"id": id.replace('delete_', '')}),

        });
        const data = await response.json();

        console.log("Response")
        console.timeEnd();


        // Do something with the data
        console.log(data);

        console.log('Front removal starts!');
        console.time();
        // Frontend update
        console.log(id);
        let task_id = id.replace('delete_', 'task_')


            // ( Remove Event listeners )


            // Removal from the DOM
            document.getElementById(task_id).remove() // remove the task



            // hide button if notasks
            if (notasks()) {
                bigbutton.hidden = true;
            }


        console.timeEnd();
        console.log('Front removal ends!');



    } catch(error) {
        console.error(error);
    }


}

async function del_all(event) {
    

    // retrieve big button
    let bigbutton = document.getElementById("big_button");

    console.log("Delete all");


    try {
        // Database update

        const response = await fetch('delete_all/', {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                "X-CSRFToken": getCookie('csrftoken'),
              },
        });
        const data = await response.json();

        // Do something with the data
        console.log(data);

        // Frontend update
        const tasklist = document.getElementById('tasklist');
        

            // Remove all child elements from the parent element
            while (tasklist.firstChild) {
                tasklist.removeChild(tasklist.firstChild);
            }

            // hide button because there is no tasks
            bigbutton.hidden = true;
        

    } catch(error) {
        console.error(error);
    }

}

async function add() {

    let text_entry = document.getElementById("text_entry");

    if (text_entry.value == "") {
        return 0;
    }

    console.log("adding elements");    


    try {
      // Database update
      const response = await fetch('add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": getCookie('csrftoken'),
        },
        body: JSON.stringify({"taskname": text_entry.value}),
      });
      const data = await response.json();

      // Do something with the data
      console.log(data);



      // Frontend update
      let tasklist = document.getElementById("tasklist");

      let task = document.createElement("div");
        task.className = "task";
        task.id = "task_" + data["id"];

        // check_box div
        let checkbox_box = document.createElement("div");
        checkbox_box.className = "checkbox_box";

            // Input checkbox attributes
            let input_checkbox = document.createElement("input");
                input_checkbox.className = "checkbox";
                input_checkbox.type = "checkbox";
                input_checkbox.name = "checkbox";
                input_checkbox.id = "checkbox_" + data["id"];


            // Assembly
            checkbox_box.appendChild(input_checkbox);

        // taskname_box
        let taskname_box = document.createElement("div");
            taskname_box.className = "taskname_box";

            // input text attributes
            let input_taskname = document.createElement("input");
                input_taskname.className = "taskname";
                input_taskname.type = "text";
                input_taskname.id = "taskname_" + data["id"];
                input_taskname.value = text_entry.value;


            // Assembly
            taskname_box.appendChild(input_taskname);



        // del_task_box
        let del_task_box = document.createElement("div");
            del_task_box.className = "del_task_box";

            // del button attributes
            let del_task_button = document.createElement("button");
                del_task_button.className = "del_task";
                del_task_button.id = "delete_" + data["id"];
                del_task_button.hidden = true;
                del_task_button.innerHTML = "-";
            
            // Assembly
            del_task_box.appendChild(del_task_button);

        // Task child element assembly

        task.appendChild(checkbox_box);
        task.appendChild(taskname_box);
        task.appendChild(del_task_box);

      tasklist.appendChild(task); // add new task front end

      // clear entry bar
      text_entry.value = "";


    } catch (error) {
      console.error(error);
    }
}

async function checkstate_update(target) {

    let id = target.id;
    let checkstate = document.getElementById(id).checked;

    console.log("Updating checkstate");

    try {

    // Database update
    const response = await fetch('checkstateup/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({"checkstate": checkstate, "id": id.replace('checkbox_', '')}),

    });
    const data = await response.json();    

    // Do something with the data
    console.log(data);
    

    } catch (error) {
        console.error(error);
    }

    // Frontend update
    let task_id = id.replace('checkbox_', 'taskname_');
    console.log(task_id);
    let taskname = document.getElementById(task_id);

    if (checkstate == true) {
        console.log('line-through');
        taskname.style.textDecoration = 'line-through';
    }
    else {
        console.log('none');
        taskname.style.textDecoration = 'none';
    }

}

async function taskname_update (target){

    let id = target.id;
    let taskname = document.getElementById(id);

    console.log("task_updating");


    if (enterPressed) { // Update the database

        try {

        // Database update
        const response = await fetch('tasknameup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({"newtaskname": taskname.value, "id": id.replace('taskname_','')}),

        });
        const data = await response.json();

        // Do something with the data
        console.log(data);


        // Frontend update
        taskname.value = data["newtaskname"]; // update the html

        } catch(error) {
            console.error(error);
        }

    }
    else { // we retrieve the former value from the database

        try {

        // Database query
        const response = await fetch(`tasknameup/?id=${id.replace('taskname_','')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });
        const data = await response.json();

        // Do something with the data
        console.log(data);


        // Frontend update
        taskname.value = data["taskname"]; // set back to initial value


        } catch(error) {
            console.error(error);
        }

    }
}


// History

function update_history (event) {
    // This function creates a color

    
    

}


// Define some of the event listener function

    // Big button
    const bigbuttonhandler = async (event) => {
        let deletion_mode = document.getElementById("trash").checked;

        if (deletion_mode) {
            console.log("deletion mode: " + deletion_mode)
            await del_all();
        }
        else {
            await add();
        }
        
    };



    // Text entry
    const textEntryHandler = async (event) => {
        if (event.key === 'Enter') {
            await add();
            event.target.blur();
        }
    };


    // Taslisk event handler


    const tasknameKeyupHandler = (event) => {

        console.log("taskname keyup handling");

        // Determine the target element of the keyup event
        const target = event.target;

        console.log(target);


        // Handle the keyup event based on the target element
        if (target.className === 'taskname') {
            if (event.key === 'Enter') {
                enterPressed = true;
                target.blur();
                console.log("enterPressed:" + enterPressed)
            }
        }
  
    };

    const tasknameBlurHandler = async (event) => { 

        console.log("taskname Blur handling");


        // Determine the target element of the blur event
        const target = event.target;

        console.log(target);
        console.log("enterPressed:" + enterPressed)

        // Handle the blur event based on the target element
        if (target.className === 'taskname') {
            await taskname_update(target);
            enterPressed = false;
        }

    };

    const delTaskHandler = (event) => {
        // Determine the target element of the blur event
        const target = event.target;

        // Handle the blur event based on the target element
        if (target.className === 'del_task') {
            del_task(target);
        }
    };


    const checkboxHandler = (event) => {
        // Determine the target element of the blur event
        const target = event.target;

        // Handle the change event based on the target element
        if (target.className === 'checkbox') {
            checkstate_update(target);
        }
    }



 // line-through

 let taskname_list = document.getElementsByClassName("taskname");

 for (let i = 0; i < taskname_list.length; i++) { // Loop over the collection of elements and assign event listener


     let check_id = taskname_list[i].id.replace('taskname_', 'checkbox_');
     let checked = document.getElementById(check_id).checked;

     if (checked) {
         taskname_list[i].style.textDecoration = 'line-through';
     }
 }

// Event listenner attachment

    // Individual elements

    document.getElementById("big_button").addEventListener("click", bigbuttonhandler);

    document.getElementById("text_entry").addEventListener('keyup', textEntryHandler);

    document.getElementById("trash").addEventListener("click", switch_mode);


    // Set elements

        // tasklist

        let tasklist = document.getElementById('tasklist');

        tasklist.addEventListener('keyup', tasknameKeyupHandler);

        tasklist.addEventListener('focusout', tasknameBlurHandler);

        tasklist.addEventListener('click', delTaskHandler);

        tasklist.addEventListener('change', checkboxHandler);
