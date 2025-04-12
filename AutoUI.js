// Ensure DOM elements are loaded before accessing them
document.addEventListener("DOMContentLoaded", function () {
    // CPU or CUDA
    const train_mode_checkbox = document.getElementById("toggle-train-mode");
    // Executable or Website
    const visualizer_checkbox = document.getElementById("toggle-visualizer");
    // Local or Server
    const train_device_checkbox = document.getElementById("toggle-train-device");

    // Buttons
    const selectZipButton = document.getElementById("select-zip-button");
    const visualizerButton = document.getElementById("visualizer-button");
    const autoUIButton = document.getElementById("auto-ui-button");

    // Helper function to check checkbox state
    function checkBoxState(checkbox) {
        return checkbox && checkbox.checked ? "ON" : "OFF";
    }

    // Add event listener for the "Select Zip" button
    if (selectZipButton) {
        selectZipButton.addEventListener("click", function () {
            const socket = new WebSocket("ws://localhost:7444")
            // Call imageprocessor.py to handle the zip file via JSON request
            
        })
    } else {
        
    }

    // Add event listener for the "Run Visualizer" button
    if (visualizerButton) {
        visualizerButton.addEventListener("click", function () {
            if (checkBoxState(visualizer_checkbox) === "ON") {
                goToPage("visualizer"); // Navigate to the visualizer page
            } else {
                console.error("Visualizer checkbox is OFF. Cannot proceed.");
            }
        });
    } else {
        console.error("Visualizer button not found in the DOM.");
    }

    // Add event listener for the "Auto UI" button (if applicable)
    if (autoUIButton) {
        autoUIButton.addEventListener("click", function () {
            goToPage("home"); // Navigate to the Auto UI page
        });
    } else {
        console.error("Auto UI button not found in the DOM.");
    }
});