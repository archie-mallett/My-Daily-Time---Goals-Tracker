// Listen for a file being selected in the file input
document.getElementById("fileInput").addEventListener("change", function(e) {
    const file = e.target.files[0]; // Get the uploaded file
    const reader = new FileReader(); // Create a FileReader to read it

    // Runs when the file has finished loading
    reader.onload = function() {
        const json = JSON.parse(reader.result); // Convert JSON text into an object
        console.log("JSON loaded:", json);

        updateChart(json.activities); // Upldate the bar chart with activity data
        updateGoals(json.goals); // Update the goals list and summary
    }
    
    reader.readAsText(file); // Read the uploaded file as plain text
})

// Predefined colours for each activity type
const activityColours = {
    Coding: "lightblue",
    Reading: "peachpuff",
    Exercise: "lightgreen",
    Studying: "lavender",
    Relaxing: "lightcoral"
}

// Create the Chart.js bar chart with empty initial data
const ctx = document.getElementById("chart").getContext("2d");
const chart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: [], // Activity names (filled after upload)
        datasets: [{
            label: "Time Spent (minutes)", // Dataset label (legend hidden)
            data: [], // Time spent values
            backgroundColor: "white", // Default colour before upload
            borderColor: "black",
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false // Hide legend for a cleaner layout
            }
        },
        scales: {
            y: {
                beginAtZero: true, // Start y-axis at 0 for clarity
                title: {
                    display: true,
                    text: "Time (minutes)", // Y-axis label
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#000'
                },
                border: {
                    display: true,
                    width: 1, // Thickness of y-axis line
                    color: '#000'
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Activity", // X-axis label
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#000'
                },
                border: {
                    display: true,
                    width: 1, // Thickness of x-axis line
                    color: '#000'
                }
            }
        }
    }
});

// Update the chart with new activity data from the uploaded JSON
function updateChart(activities) {
    const labels = activities.map(a => a.name); // Extract activity names
    const values = activities.map(a => a.timeSpent); // Extract time spent values

    // Assign colours based on activity name, fallback to grey if unkown
    const colours = labels.map(label => activityColours[label] || "lightgray");

    chart.data.labels = labels; // Update x-axis labels
    chart.data.datasets[0].data = values; // Update bar heights
    chart.data.datasets[0].backgroundColor = colours; // Apply colours

    chart.update(); // Redraw chart
}

// Update the goals list and completion summary
function updateGoals(goals) {
    const list = document.getElementById("goals"); // UL element for goals
    const summary = document.getElementById("goalSummary"); // Summary text element

    list.innerHTML = ""; // Clear previous goals

    let completed = 0; // Track completed goals

    // Loop through each goal and build the list
    for (let i = 0; i < goals.length; i++) {
        const goal = goals[i];

        // Determine if the goal is completed
        let achieved = false;
        if (goal.completed === true) {
            achieved = true;
        }

        // Choose the correct symbol and update count
        let symbol;
        if (achieved === true) {
            symbol = "✓";
            completed = completed + 1;
        } else {
            symbol = "✗";
        }

        // Create list item for the goal
        const li = document.createElement("li");
        
        // Create the symbol element (tick or cross)
        const symbolSpan = document.createElement("span");
        symbolSpan.textContent = " " + symbol;

        // Apply CSS based on completion
        if (achieved === true) {
            symbolSpan.classList.add("goal-done");
        } else {
            symbolSpan.classList.add("goal-not-done");
        }

        // Add goal name and symbol to the list item
        li.textContent = goal.name + ":";
        li.appendChild(symbolSpan);

        list.appendChild(li); // Add to the list
    }

    // Update the summary text
    summary.textContent = completed + " out of " + goals.length + " goals completed";
}

// Reset the page back to its initial empty state
function resetPage() {
    chart.data.labels = []; // Clear chart labels
    chart.data.datasets[0].data = []; // Clear chart data
    chart.update(); // Redraw empty chart

    document.getElementById("goals").innerHTML = ""; // Clear goals list
    document.getElementById("goalSummary").textContent = ""; // Clear summary
    document.getElementById("fileInput").value = ""; // Reset file input
}

// Reset button listener
document.getElementById("resetButton").addEventListener("click", resetPage);
