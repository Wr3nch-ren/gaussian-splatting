// Ensure DOM elements are loaded before accessing them
document.addEventListener("DOMContentLoaded", function () {
    // CPU or CUDA
    const train_mode_checkbox = document.getElementById("toggle-train-mode");
    // Executable or Website
    const visualizer_checkbox = document.getElementById("toggle-visualizer");
    // Local or Server
    const train_device_checkbox = document.getElementById("toggle-train-device");

    // Buttons
    const runAllButton = document.getElementById("run-all-button");
    const selectZipButton = document.getElementById("select-zip-button");
    const convertDataButton = document.getElementById("convert-data-button");
    const trainDataButton = document.getElementById("train-data-button");
    const visualizerButton = document.getElementById("visualizer-button");
    const autoUIButton = document.getElementById("auto-ui-button");

    // Advanced settings
    const advancedBtn = document.querySelector('.advanced-toggle-button');
    const advancedSettings = document.querySelector('.advanced-settings');
    const resetBtn = document.getElementById("reset-button");
    const resolutionSelect = document.getElementById("resolution-select");
    const iterationsText = document.getElementById("iterations-text");
    const saveIterationsText = document.getElementById("save-iterations-text");
    const densifyFromIterText = document.getElementById("densify-from-iter-text");
    const densifyUntilIterText = document.getElementById("densify-until-iter-text");
    const shDegreeSelect = document.getElementById("sh-degree-select");
    const whiteBackgroundSelect = document.getElementById("white-background-select");

    let timeout_second = 60; // 60 seconds
    let timeout = timeout_second * 1000; // Convert to milliseconds

    // Change button label on click
    advancedBtn.addEventListener('click', () => {
      advancedSettings.classList.toggle('hidden');
      advancedBtn.textContent = advancedSettings.classList.contains('hidden')
        ? 'Advanced'
        : 'Hide Advanced';
    });

    resetBtn.addEventListener("click", () => {
      // Reset selects
      document.querySelectorAll("select").forEach(select => {
        select.selectedIndex = 0;
        select.dispatchEvent(new Event('change'));
      });

      // Reset text inputs
      document.querySelectorAll("input[type='text']").forEach(input => {
        input.value = '';
      });

    });
    
    // Helper function to check checkbox state
    function checkBoxState(checkbox) {
        return checkbox && checkbox.checked ? "ON" : "OFF";
    }

    // Helper function to handle WebSocket communication
    function handleWebSocket(request, onResponse) {
        const socket = new WebSocket("ws://localhost:7444");
        socket.onopen = function () {
            console.log("WebSocket connection established.");
            socket.send(JSON.stringify(request)); // Send the request to the server
        };
        socket.onmessage = function (event) {
            const response = JSON.parse(event.data);
            console.log("Response from server:", response);
            if (onResponse) onResponse(response);
            socket.close(1000, "Closing connection after receiving response.");
        };
        socket.onclose = function () {
            console.log("WebSocket connection closed.");
        };
        socket.onerror = function (error) {
            console.error("WebSocket error:", error);
        };
    }

    // Run All button event listener
    if (runAllButton) {
        runAllButton.addEventListener("click", function () {
            let trainingMode = checkBoxState(train_mode_checkbox);
            let localMode = checkBoxState(train_device_checkbox);
            let visualizer = checkBoxState(visualizer_checkbox);
            let resolution = resolutionSelect.value;
            let iterations = iterationsText.value;
            let saveIterations = saveIterationsText.value;
            let densifyFromIter = densifyFromIterText.value;
            let densifyUntilIter = densifyUntilIterText.value;
            let shDegree = shDegreeSelect.value;
            let whiteBackground = whiteBackgroundSelect.value;

            // Set default values if inputs are empty
            trainingMode = trainingMode === "OFF" ? "cpu" : "cuda";
            localMode = localMode === "OFF" ? "true" : "false";
            visualizer = visualizer === "OFF" ? "executable" : "web";
            resolution = resolution === "Use Original" ? "1" : resolution === "1/2" ? "2" : resolution === "1/4" ? "4" : resolution === "1/8" ? "8" : resolution;
            iterations = iterations || "30000";
            saveIterations = saveIterations || "7000";
            densifyFromIter = densifyFromIter || "500";
            densifyUntilIter = densifyUntilIter || "15000";
            shDegree = shDegree || "3";
            whiteBackground = whiteBackground || "On";

            const request = {
                action: "run_all",
                training_mode: trainingMode,
                local_mode: localMode,
                renderer_mode: visualizer,
                resolution: resolution,
                iterations: iterations,
                save_iterations: saveIterations,
                densify_from_iter: densifyFromIter,
                densify_until_iter: densifyUntilIter,
                sh_degree: shDegree,
                white_background: whiteBackground,
            };
            handleWebSocket(request, function (response) {
                if (response.status === "success" && response.redirect_url) {
                    window.location.href = response.redirect_url;
                } else {
                    console.log(response.message);
                }
            });
        });
    }

    // Select Zip button event listener
    if (selectZipButton) {
        selectZipButton.addEventListener("click", function () {
            const request = { action: "select_zip" };
            handleWebSocket(request);
        });
    }

    // Convert Data button event listener
    if (convertDataButton) {
        convertDataButton.addEventListener("click", function () {
            const request = { action: "convert_data" };
            handleWebSocket(request);
        });
    }

    // Train Data button event listener
    if (trainDataButton) {
        trainDataButton.addEventListener("click", function () {
            let trainingMode = checkBoxState(train_mode_checkbox);
            let localMode = checkBoxState(train_device_checkbox);
            let resolution = resolutionSelect.value;
            let iterations = iterationsText.value;
            let saveIterations = saveIterationsText.value;
            let densifyFromIter = densifyFromIterText.value;
            let densifyUntilIter = densifyUntilIterText.value;
            let shDegree = shDegreeSelect.value;
            let whiteBackground = whiteBackgroundSelect.value;

            // Set default values if inputs are empty
            trainingMode = trainingMode === "OFF" ? "cpu" : "cuda";
            localMode = localMode === "OFF" ? "true" : "false";
            resolution = resolution === "Use Original" ? "1" : resolution === "1/2" ? "2" : resolution === "1/4" ? "4" : resolution === "1/8" ? "8" : resolution;
            iterations = iterations || "30000";
            saveIterations = saveIterations || "7000";
            densifyFromIter = densifyFromIter || "500";
            densifyUntilIter = densifyUntilIter || "15000";
            shDegree = shDegree || "3";
            whiteBackground = whiteBackground || "On";

            const request = {
                action: "train_data",
                training_mode: trainingMode,
                local_mode: localMode,
                resolution: resolution,
                iterations: iterations,
                save_iterations: saveIterations,
                densify_from_iter: densifyFromIter,
                densify_until_iter: densifyUntilIter,
                sh_degree: shDegree,
                white_background: whiteBackground,
            };
            handleWebSocket(request);
        });
    }

    // Visualizer button event listener
    if (visualizerButton) {
        visualizerButton.addEventListener("click", function () {
            let visualizerMode = checkBoxState(visualizer_checkbox);
            visualizerMode = visualizerMode === "OFF" ? "executable" : "web";

            const request = {
                action: "run_visualizer",
                renderer_mode: visualizerMode,
            };
            handleWebSocket(request, function (response) {
                if (response.status === "success" && response.redirect_url) {
                    window.location.href = response.redirect_url;
                } else {
                    console.log(response.message);
                }
            });
        });
    }

    // Auto UI button event listener
    if (autoUIButton) {
        autoUIButton.addEventListener("click", function () {
            goToPage("home"); // Navigate to the Auto UI page
        });
    }
});