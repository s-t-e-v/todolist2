"use strict";

// Global variable

let enterPressed = false;
let history = [];


// Functions


/**
 * Retrieves the value of a cookie with the specified name.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {?string} - The value of the cookie, or null if the cookie was not found.
 */
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

/**
 * Tells whether there are tasks or not inside the todolist
 * @returns {Boolean} - True if no tasks, False otherwise
 */
function notasks() {
    const tasks = document.querySelectorAll('#tasklist .task');

    console.log(tasks.length);

    if (tasks.length === 0) { // If there is no element inside tasks list
        return true;
    } else if (history.length === tasks.length) {// If all elements in the history array are in the tasks list
        return true;
    } else {
        return false;
    }

}


/**
 * Switch the App display between 'normal mode' & 'deletion mode'
 *     - normal mode:
 *         - ✓ Enables adding & changing features
 *         - ⨯ Disables deleting features
 *     - deletion mode:
 *         - ✓ Enables deleting features
 *         - ⨯ Disables adding & changing features
 */
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


    // Testing switch mode check state
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

/**
 * Delete the targeted task in the database (Django model - SQLite3)
 * 
 * A 'POST' request is done to the server. The id of the task transfered, in order to select the task to delete
 * csrftoken has to be transfered as well on Firefox. Crashes on Google Chrome. 
 * @async
 * @param {EventTarget} target - The targeted delete buttons, contains the element information, especially its id
 */
async function del_task(target) {

    // retrieve id of the target button
    let id = target.id;

    //  // retrieve big button
    //  let bigbutton = document.getElementById("big_button");

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

        // console.log('Front removal starts!');
        // console.time();
        // // Frontend update
        // console.log(id);
        // let task_id = id.replace('delete_', 'task_')


        //     // ( Remove Event listeners )


        //     // Removal from the DOM
        //     document.getElementById(task_id).remove() // remove the task



        //     // hide button if notasks
        //     if (notasks()) {
        //         bigbutton.hidden = true;
        //     }


        // console.timeEnd();
        // console.log('Front removal ends!');



    } catch(error) {
        console.error(error);
    }


}

/**
 * Delete all task elements in the database (Django model - SQLite3).
 * 
 * A 'POST' request is done to the server.
 * The task id autoincrement in the database is reset in the backend.
 * csrftoken has to be transfered as well on Firefox. Crashes on Google Chrome. 
 * @async
 */
async function del_all() {
    

    // retrieve big button
    // let bigbutton = document.getElementById("big_button");

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

        // // Frontend update
        // const tasklist = document.getElementById('tasklist');
        

        //     // Remove all child elements from the parent element
        //     while (tasklist.firstChild) {
        //         tasklist.removeChild(tasklist.firstChild);
        //     }

        //     // hide button because there is no tasks
        //     bigbutton.hidden = true;
        

    } catch(error) {
        console.error(error);
    }

}

/**
 * Add a task to the database (Django model - SQLite3) & update the frontend accordingly
 * @returns {Number} 0 - If there is nothing is the entry bar in order to exit the function directly
 */
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

/**
 * Update the checkstate of a task in the database (Django model - SQLite3).
 * 
 * @async
 * When a checkbox is checked, a line-through is put on the associated input text containing the task name
 * @param {EventTarget} target - The targeted checkbox, contains its id
 */
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

/**
 * This function serves two purposes:
 *     1. Updating the task name targeted in the database (Django model - SQLite3) when a modification occured on the targeted task bar with the pressing of the Enter key
 *     2. Display back the original name of the targeted task if modification wasn't confirm by Enter key stroke.
 * 
 * - A 'POST' request is done for the first case. The id and the new taskname is transfered to the backend.
 * - A 'GET' request is done for the second case.
 * 
 * @async
 * @param {EventTarget} target - The targeted text input, contains the element information, especially the task name and its id
 */
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

function update_history (target=null) {
    // This function creates a color

    // Should dynamically hide big button if no more task

    let bigbutton = document.getElementById("big_button");



    if (target) { // saving the deleted task into history

        console.log("delete single task -> history");
        // retrieve id of the target
        let id = target.id;

        // pushing the task deleted into the history
        history.push(
            {
                deletion: "individual",
                task: {
                    id: id.replace('delete_', ''),
                    checkstate: document.getElementById(id.replace('delete_', 'checkbox_')).checked,
                    taskname: document.getElementById(id.replace('delete_', 'taskname_')).value,
                },
            }
        );


        console.log("History: ");
        console.dir(history);

        // Updating Frontend

        let task_id = id.replace('delete_', 'task_')

            // Hiding task from the DOM
            document.getElementById(task_id).style.display = "none"; // hide task



            // hide button if notasks
            if (notasks()) {
                bigbutton.hidden = true;
            }



    }
    else { // saving all the deleted tasks into history
        console.log("delete all task -> history");

        // Selecting task elements which are currently displayed
        let tasks = document.getElementsByClassName("task");

        let task_id_list = [];
        let id;
        let task_displayed;

         // pushing all the tasks deleted into the history
         for (var i = 0; i < tasks.length; i++) {

            id = tasks[i].id;

            task_displayed = tasks[i].style.display;

            if (task_displayed != 'none') {
                history.push(
                    {
                        deletion: "multiple",
                        id: id,
                    }
                 );
            }

             task_id_list.push(id);
         }

        console.log("History: ");
        console.dir(history);

        // Updating Frontend

            // Hiding task from the DOM
            for (var i = 0; i < task_id_list.length; i++) {
                document.getElementById(task_id_list[i]).style.display = "none"; // hide task
            }


            // hide button because no tasks displayed
            // hide button if notasks
            if (notasks()) {
                bigbutton.hidden = true;
            }
        

    }




    //


    

}


// Defination of some event handler functions

    // Big button
    
    /**
     * Handles the 'click' events on the big button
     *     - When on normal mode, the async function add() is called
     *     - When on deletion mode, the function update_history() is called
     */
    const bigbuttonhandler = async () => {
        let deletion_mode = document.getElementById("trash").checked;

        if (deletion_mode) {
            console.log("deletion mode: " + deletion_mode)
            // await del_all();

            update_history();
        }
        else {
            await add();
        }
        
    };



    // Text entry

    /**
     * Handles the "keyup" events on the big button. If the key pressed was 'Enter', then the async function add() is called.
     * 
     * After the task added, the entry bar is focused out ('blur').
     * @param {Event} event - The event element related to the text entry bar
     */
    const textEntryHandler = async (event) => {
        if (event.key === 'Enter') {
            await add();
            event.target.blur();
        }
    };


    // Taslisk event handler

    /**
     * Handles the "keyup" events on the targeted task name text input.
     * 
     * If the key pressed was 'Enter',
     *     - the global Boolean 'enterPressed' is set to true
     *     - the task name text input is focused out ('blur').
     * @param {Event} event - The event element related to the targeted task name text input.
     */
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

    /**
     * Handles the 'blur' events on the targeted task name text input. As a result of this event:
     *     - the async function taskname_update() is called
     *     - the global Boolean enterPressed is reset to false right after
     * @param {Event} event - The event element related to the targeted task name text input.
     */
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

    /**
     * Handles the 'click' events on the targeted delete task button. As a result of this event:
     *     - the function update_history() is called
     * @param {*} event - The event element related to the targeted delete task button.
     */
    const delTaskHandler = (event) => {
        // Determine the target element of the blur event
        const target = event.target;

        // Handle the click event based on the target element
        if (target.className === 'del_task') {6
            // await del_task(target);
            update_history(target);
        }
    };


    /**
     * Handles the 'change' events on the targeted checkbox. As a result of this event:
     *     - the async function checkstate_update() is called     * 
     * @param {Event} event - The event element related to the targeted checkbox.
     */
    const checkboxHandler = async (event) => {
        // Determine the target element of the blur event
        const target = event.target;

        // Handle the change event based on the target element
        if (target.className === 'checkbox') {
            await checkstate_update(target);
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
