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

            // Change button to "-"
            bigbutton.innerHTML = "-";


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
            bigbutton.innerHTML = "+";

    }
}

function del_task() {
    console.log("Deleting task");
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
      takslist = document.getElementById("tasklist");
      task = document.createElement("div");
        task.className = "task";
        task.id = "task_" + data["id"];

        // check_box div
        checkbox_box = document.createElement("div");
            checkbox_box.className = "checkbox_box";

            // Input checkbox attributes
            input_checkbox = document.createElement("input");
                input_checkbox.className = "checkbox";
                input_checkbox.type = "checkbox";
                input_checkbox.name = "checkbox";
                input_checkbox.id = "checkbox_" + data["id"];

            
            // Assembly
            checkbox_box.appendChild(input_checkbox);

        // taskname_box
        taskname_box = document.createElement("div");
            taskname_box.className = "taskname_box";

            // input text attributes
            input_taskname = document.createElement("input");
                input_taskname.className = "taskname";
                input_taskname.type = "text";
                input_taskname.id = "taskname_" + data["id"];
                input_taskname.value = text_entry.value;

            // Assembly
            taskname_box.appendChild(input_taskname);


        // del_task_box
        del_task_box = document.createElement("div");
            del_task_box.className = "del_task_box";

            // del button attributes
            del_task_button = document.createElement("button");
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

      takslist.appendChild(task); // add new task front end

      // clear entry bar
      text_entry.value = "";


    } catch (error) {
      console.error(error);
    }
}





// Event listener attachment

    // Individual elements

    document.getElementById("big_button").addEventListener("click", add);

    document.getElementById("trash").addEventListener("click", switch_mode);


    // Set elements

    let del_task_buttons = document.getElementsByClassName("del_task");

    for (let i = 0; i < del_task_buttons.length; i++) { // Loop over the collection of elements and assign event listener
        del_task_buttons[i].addEventListener("click", del_task);
    }



