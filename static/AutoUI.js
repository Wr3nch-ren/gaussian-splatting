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

    // Helper function to check checkbox state
    function checkBoxState(checkbox) {
        return checkbox && checkbox.checked ? "ON" : "OFF";
    }

    if (runAllButton) {
        runAllButton.addEventListener("click", function () {
            const socket = new WebSocket("ws://localhost:7444")
            socket.onopen = function () {
                console.log("WebSocket connection established.");
                let checkMode = checkBoxState(train_mode_checkbox);
                let localDevice = checkBoxState(train_device_checkbox);
                let visualizer = checkBoxState(visualizer_checkbox);
                if(checkMode === "OFF") {
                    checkMode = "cpu";
                } else {
                    checkMode = "cuda";
                }
                if(localDevice === "OFF") {
                    localDevice = "true";
                } else {
                    localDevice = "false";
                }
                if(visualizer === "OFF") {
                    visualizer = "executable";
                } else {
                    visualizer = "web";
                }
                const request = {
                    action : "run_all",
                    training_mode : checkMode,
                    local_mode : localDevice,
                    renderer_mode : visualizer
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
                const request = {
                    action : "train_data",
                    training_mode : trainingMode,
                    local_mode : localMode
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