// Selecting elements
let typingText = document.querySelector(".typing-text");
let inputField = document.querySelector(".wrapper .input-field");
let mistakeTag = document.querySelector(".mistake span b");
let accuracyTag = document.querySelector(".accuracy span b");
let cpmTag = document.querySelector(".cpm span b");
let timeTag = document.querySelector(".time span b");
let restartButton = document.querySelector('.nav_buttons .large-button:first-child');
let submitButton = document.querySelector('.nav_buttons .large-button:last-child');

// Disable the submit button initially
submitButton.disabled = true;

// Initialize arrays to store data
let time_arr = [];
let accuracy_arr = [];
let mistakes_arr = [];

// Initialize timer and variables
let timer = -1;
let max_timer = 60;
let time_left = 60;
let mistakes = 0;
let corrects = 0;
let charIndex = 0;
let isTyping = false;
let startTime; // Variable to store the start time

// Function to generate a random paragraph
function generate_random_paragraph() {
    let random_index = Math.floor(Math.random() * paragraphs.length);
    paragraphs[random_index].split('').forEach(span => {
        let spanTag = `<span>${span}</span>`;
        typingText.innerHTML += spanTag;
    });

    // Event listeners for input field focus
    document.addEventListener("keydown", () => inputField.focus());
    typingText.addEventListener("click", () => inputField.focus());
}

// Function to handle typing and data collection
function initTyping() {
    const characters = typingText.querySelectorAll("span");
    let typedChar = inputField.value.split('')[charIndex];

    if (timer == -1) {
        startTime = new Date(); // Record the start time
        timer = setInterval(initTimer, 1000);
        isTyping = true;
    }

    if (isTyping == true) {
        // Case for the backspace
        if (typedChar == null) {
            characters[charIndex].classList.remove("active");
            charIndex -= 1;
            if (characters[charIndex].classList.contains("incorrect")) {
                mistakes -= 1;
            } else {
                corrects -= 1;
            }
            characters[charIndex].classList.remove("correct", "incorrect");
            characters[charIndex].classList.add("active");
        } else {
            characters[charIndex].classList.remove("active");
            if (characters[charIndex].innerHTML === typedChar) {
                corrects += 1;
                characters[charIndex].classList.add("correct");
            } else {
                mistakes += 1;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex += 1;
            characters[charIndex].classList.add("active");
        }

        // Update UI
        mistakeTag.innerHTML = mistakes;
        if (charIndex != 0) {
            accuracyTag.innerHTML = (corrects * 100 / (charIndex)).toFixed(2);
        } else {
            accuracyTag.innerHTML = 0;
        }

        const currentTime = new Date(); // Get the current time
        const elapsedSeconds = (currentTime - startTime) / 1000; // Calculate elapsed seconds
        time_arr.push(elapsedSeconds); // Push the elapsed time into the array
        mistakes_arr.push(mistakes);

        if (charIndex != 0) {
            accuracy_arr.push((corrects * 100 / (charIndex)).toFixed(2));
        } else {
            accuracy_arr.push(0);
        }

        cpmTag.innerHTML=Math.floor(charIndex*60/elapsedSeconds);
    }
}

// Function to plot data in a new window
function plotDataInNewWindow() {
    var newWindow = window.open("", "_blank", "width=800,height=600"); // Adjusted window size

    // Create a canvas element for Accuracies
    var canvasAccuracy = document.createElement("canvas");
    canvasAccuracy.width = 400; // Adjusted width
    canvasAccuracy.height = 300; // Adjusted height

    // Append the canvas to the new window's document
    newWindow.document.body.appendChild(canvasAccuracy);

    // Create a canvas element for Mistakes
    var canvasMistakes = document.createElement("canvas");
    canvasMistakes.width = 400; // Adjusted width
    canvasMistakes.height = 300; // Adjusted height

    // Append the canvas to the new window's document
    newWindow.document.body.appendChild(canvasMistakes);

    // Prepare data for Chart.js
    var dataAccuracy = {
        labels: time_arr,
        datasets: [
            {
                label: "Accuracies",
                borderColor: "blue",
                data: accuracy_arr,
            },
        ],
    };

    var dataMistakes = {
        labels: time_arr,
        datasets: [
            {
                label: "Mistakes",
                borderColor: "red",
                data: mistakes_arr,
            },
        ],
    };

    // Render the Accuracies chart
    var ctxAccuracy = canvasAccuracy.getContext("2d");
    new Chart(ctxAccuracy, {
        type: "line",
        data: dataAccuracy,
    });

    // Render the Mistakes chart
    var ctxMistakes = canvasMistakes.getContext("2d");
    new Chart(ctxMistakes, {
        type: "line",
        data: dataMistakes,
    });
}

// Function to initialize the timer
function initTimer() {
    if (time_left > 0) {
        time_left -= 1;
        timeTag.innerHTML = time_left;
    } else {
        clearInterval(timer);
        isTyping = false;
        submitButton.disabled = false;
        cpmTag.innerHTML = charIndex
    }
}

// Function to restart the page
function restartPage() {
    inputField.value = "";
    location.reload();
}

// Event listeners
generate_random_paragraph();
inputField.addEventListener("input", initTyping);
submitButton.addEventListener("click", plotDataInNewWindow);
restartButton.addEventListener("click", restartPage);
