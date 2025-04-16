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

    if (runAllButton) {
        runAllButton.addEventListener("click", function () {
            const socket = new WebSocket("ws://localhost:7444")
            socket.onopen = function () {
                console.log("WebSocket connection established.");
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
                if(trainingMode === "OFF") {
                    trainingMode = "cpu";
                } else {
                    trainingMode = "cuda";
                }
                if(localMode === "OFF") {
                    localMode = "true";
                } else {
                    localMode = "false";
                }
                if(visualizer === "OFF") {
                    visualizer = "executable";
                } else {
                    visualizer = "web";
                }
                if(resolution === "Use Original") {
                    resolution = "1";
                }
                else if(resolution === "1/2") {
                    resolution = "2";
                }
                else if(resolution === "1/4") {
                    resolution = "4";
                }
                else if(resolution === "1/8") {
                    resolution = "8";
                }
                const request = {
                    action : "run_all",
                    training_mode : trainingMode,
                    local_mode : localMode,
                    renderer_mode : visualizer,
                    resolution : resolution,
                    iterations : iterations,
                    save_iterations : saveIterations,
                    densify_from_iter : densifyFromIter,
                    densify_until_iter : densifyUntilIter,
                    sh_degree : shDegree,
                    white_background : whiteBackground
                }
                socket.send(JSON.stringify(request)); // Send the request to the server
            };
            socket.onmessage = function (event) {
                const response = JSON.parse(event.data);
                console.log("Response from server:", response);

                if (response.status === "success" && response.redirect_url) {
                    // Redirect the browser to the specified URL
                    window.location.href = response.redirect_url;
                } else {
                    console.log(response.message);
                }
            };
            socket.onclose = function () {
                console.log("WebSocket connection closed.");
            };
            socket.onerror = function (error) {
                console.error("WebSocket error:", error);
            };

            setTimeout(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.close(1000, "Closing connection after 5 seconds.");
                }
            }, 5000);
        });
    }

    // Select Zip button event listener
    if (selectZipButton) {
        selectZipButton.addEventListener("click", function () {
            const socket = new WebSocket("ws://localhost:7444")
            socket.onopen = function () {
                console.log("WebSocket connection established.");
                const request = {
                    action : "select_zip"
                }
                socket.send(JSON.stringify(request)); // Send the request to the server
            };
            socket.onmessage = function (event) {
                console.log("Message from server:", event.data);
                // Handle the response from the server if needed
            };
            socket.onclose = function () {
                console.log("WebSocket connection closed.");
            };
            socket.onerror = function (error) {
                console.error("WebSocket error:", error);
            };

            setTimeout(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.close(1000, "Closing connection after 5 seconds.");
                }
            }, 5000);
        });
    } else {
        console.error("Select Zip button not found in the DOM.");
    }

    // Convert Data button event listener
    if (convertDataButton) {
        convertDataButton.addEventListener("click", function () {
            const socket = new WebSocket("ws://localhost:7444")
            socket.onopen = function () {
                console.log("WebSocket connection established.");
                const request = {
                    action : "convert_data",
                }
                socket.send(JSON.stringify(request)); // Send the request to the server
            };
            socket.onmessage = function (event) {
                console.log("Message from server:", event.data);
                // Handle the response from the server if needed
            };
            socket.onclose = function () {
                console.log("WebSocket connection closed.");
            };
            socket.onerror = function (error) {
                console.error("WebSocket error:", error);
            };

            setTimeout(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.close(1000, "Closing connection after 5 seconds.");
                }
            }, 5000);
        });
    } else {
        console.error("Convert Data button not found in the DOM.");
    }

    // Train Data button event listener
    if (trainDataButton) {
        trainDataButton.addEventListener("click", function () {
            const socket = new WebSocket("ws://localhost:7444")
            socket.onopen = function () {
                console.log("WebSocket connection established.");
                let trainingMode = checkBoxState(train_mode_checkbox);
                let localMode = checkBoxState(train_device_checkbox);
                let resolution = resolutionSelect.value;
                let iterations = iterationsText.value;
                let saveIterations = saveIterationsText.value;
                let densifyFromIter = densifyFromIterText.value;
                let densifyUntilIter = densifyUntilIterText.value;
                let shDegree = shDegreeSelect.value;
                let whiteBackground = whiteBackgroundSelect.value;
                if(trainingMode === "OFF") {
                    trainingMode = "cpu";
                } else {
                    trainingMode = "cuda";
                }
                if(localMode === "OFF") {
                    localMode = "true";
                } else {
                    localMode = "false";
                }
                if(resolution === "Use Original") {
                    resolution = "1";
                }
                else if(resolution === "1/2") {
                    resolution = "2";
                }
                else if(resolution === "1/4") {
                    resolution = "4";
                }
                else if(resolution === "1/8") {
                    resolution = "8";
                }
                const request = {
                    action : "train_data",
                    training_mode : trainingMode,
                    local_mode : localMode,
                    resolution : resolution,
                    iterations : iterations,
                    save_iterations : saveIterations,
                    densify_from_iter : densifyFromIter,
                    densify_until_iter : densifyUntilIter,
                    sh_degree : shDegree,
                    white_background : whiteBackground
                }
                socket.send(JSON.stringify(request)); // Send the request to the server
            };
            socket.onmessage = function (event) {
                console.log("Message from server:", event.data);
                // Handle the response from the server if needed
            };
            socket.onclose = function () {
                console.log("WebSocket connection closed.");
            };
            socket.onerror = function (error) {
                console.error("WebSocket error:", error);
            };

            setTimeout(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.close(1000, "Closing connection after 5 seconds.");
                }
            }, 5000);
        });
    }

    // Add event listener for the "Run Visualizer" button
    if (visualizerButton) {
        visualizerButton.addEventListener("click", function () {
            // Call the function to run the executable visualizer via WebSocket
            const socket = new WebSocket("ws://localhost:7444")
            socket.onopen = function () {
                console.log("WebSocket connection established.");
                let visualizerMode = checkBoxState(visualizer_checkbox);
                if(visualizerMode === "OFF") {
                    visualizerMode = "executable";
                } else {
                    visualizerMode = "web";
                }
                const request = {
                    action : "run_visualizer",
                    renderer_mode : visualizerMode
                }
                socket.send(JSON.stringify(request)); // Send the request to the server
            };
            socket.onmessage = function (event) {
                const response = JSON.parse(event.data);
                console.log("Response from server:", response);

                if (response.status === "success" && response.redirect_url) {
                    // Redirect the browser to the specified URL
                    window.location.href = response.redirect_url;
                } else {
                    console.log(response.message);
                }
            };
            socket.onclose = function () {
                console.log("WebSocket connection closed.");
            };
            socket.onerror = function (error) {
                console.error("WebSocket error:", error);
            };

            setTimeout(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.close(1000, "Closing connection after 5 seconds.");
                }
            }, 5000);
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