document.getElementById("fileInput").addEventListener("change", function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const json = JSON.parse(reader.result);
        console.log("JSON loaded:", json);

        updateChart(json.activities);
    }
    
    reader.readAsText(file);
})

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
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function updateChart(activities) {
    const labels = activities.map(a => a.name);
    const values = activities.map(a => a.timeSpent);

    chart.data.labels = labels;
    chart.data.datasets[0].data = values;

    chart.update();
}