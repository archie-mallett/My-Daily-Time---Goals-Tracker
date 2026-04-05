document.getElementById("fileInput").addEventListener("change", function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const json = JSON.parse(reader.result);
        console.log("JSON loaded:", json);

        updateChart(json.activities);
        updateGoals(json.goals);
    }
    
    reader.readAsText(file);
})

const activityColours = {
    Coding: "lightblue",
    Reading: "peachpuff",
    Exercise: "lightgreen",
    Studying: "lavender",
    Relaxing: "lightcoral"
}

const ctx = document.getElementById("chart").getContext("2d");
const chart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: [],
        datasets: [{
            label: "Time Spent (minutes)",
            data: [],
            backgroundColor: "white",
            borderColor: "black",
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Time (minutes)",
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#000'
                },
                border: {
                    display: true,
                    width: 1,
                    color: '#000'
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Activity",
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#000'
                },
                border: {
                    display: true,
                    width: 1,
                    color: '#000'
                }
            }
        }
    }
});

function updateChart(activities) {
    const labels = activities.map(a => a.name);
    const values = activities.map(a => a.timeSpent);
    const colours = labels.map(label => activityColours[label] || "lightgray");

    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    chart.data.datasets[0].backgroundColor = colours;

    chart.update();
}

function updateGoals(goals) {
    const list = document.getElementById("goals");
    const summary = document.getElementById("goalSummary");

    list.innerHTML = "";

    let completed = 0;

    for (let i = 0; i < goals.length; i++) {
        const goal = goals[i];

        let achieved = false;
        if (goal.completed === true) {
            achieved = true;
        }

        let symbol;
        if (achieved === true) {
            symbol = "✓";
            completed = completed + 1;
        } else {
            symbol = "✗";
        }

        const li = document.createElement("li");
        
        const symbolSpan = document.createElement("span");
        symbolSpan.textContent = " " + symbol;

        if (achieved === true) {
            symbolSpan.classList.add("goal-done");
        } else {
            symbolSpan.classList.add("goal-not-done");
        }

        li.textContent = goal.name + ":";
        li.appendChild(symbolSpan);

        list.appendChild(li);
    }

    summary.textContent = completed + " out of " + goals.length + " goals completed";
}

function resetPage() {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.update();

    document.getElementById("goals").innerHTML = "";
    document.getElementById("goalSummary").textContent = "";
    document.getElementById("fileInput").value = "";
}

document.getElementById("resetButton").addEventListener("click", resetPage);
