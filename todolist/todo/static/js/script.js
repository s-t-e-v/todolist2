function add() {

    let text_entry = document.getElementById("text_entry");

    if (text_entry.value != "") {
        alert(text_entry.value);
    }
}



document.getElementById("add").addEventListener("click", add);

console.log("arabe")