document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                // Process the parsed data here
                console.log(results.data);
                updateCharts(results.data);
            }
        });
    }
});

// Filter elements
const behaviorFilter = document.getElementById('behaviorFilter');
const studentFilter = document.getElementById('studentFilter');
const timePeriodFilter = document.getElementById('timePeriodFilter');

// Add event listeners to filters
behaviorFilter.addEventListener('change', applyFilters);
studentFilter.addEventListener('change', applyFilters);
timePeriodFilter.addEventListener('change', applyFilters);

let chartData = []; // Holds the original data

function applyFilters() {
    const filteredData = chartData.filter(item => {
        const behaviorMatch = behaviorFilter.value === 'all' || item.behavior === behaviorFilter.value;
        const studentMatch = studentFilter.value === 'all' || item.student === studentFilter.value;
        const timeMatch = timePeriodFilter.value === 'all' || item.timePeriod === timePeriodFilter.value;
        return behaviorMatch && studentMatch && timeMatch;
    });
    
    // Update charts based on the filtered data
    updateCharts(filteredData);
}

function updateCharts(data) {
    chartData = data; // Store data for filtering

    // Example chart updates with filtered data
    const behaviorTrendsCtx = document.getElementById('behaviorTrendsChart').getContext('2d');
    const impactOfTechnologyCtx = document.getElementById('impactOfTechnologyChart').getContext('2d');
    const behavioralDistributionPieCtx = document.getElementById('behavioralDistributionPieChart').getContext('2d');

    // Behavior trends line chart
    new Chart(behaviorTrendsCtx, {
        type: 'line',
        data: {
            labels: data.map(item => item.date), // Map dates
            datasets: [{
                label: 'Engaged Behavior',
                data: data.map(item => item.engaged), // Map engagement values
                borderColor: 'skyblue',
                fill: false
            }]
        },
        options: {
            responsive: true,
            onClick: function(evt, activeElements) {
                const pointIndex = activeElements[0]?.index;
                if (pointIndex !== undefined) {
                    const clickedData = data[pointIndex];
                    drillDownBehavior(clickedData.behavior); // Trigger drill-down
                }
            }
        }
    });

    // Example bar chart for impact of technology
    new Chart(impactOfTechnologyCtx, {
        type: 'bar',
        data: {
            labels: ['Old Tech', 'New Tech'],
            datasets: [{
                label: 'Average Engagement Duration',
                data: [20, 35], // Example data
                backgroundColor: ['#003366', '#66c2ff']
            }]
        },
        options: {
            responsive: true
        }
    });

    // Example pie chart for behavioral distribution
    new Chart(behavioralDistributionPieCtx, {
        type: 'pie',
        data: {
            labels: ['Engaged', 'Off-Task', 'Disruptive'],
            datasets: [{
                data: [50, 30, 20], // Example data
                backgroundColor: ['#003366', '#ff6600', '#66c2ff']
            }]
        },
        options: {
            responsive: true,
            onClick: function(evt, activeElements) {
                const clickedElementIndex = activeElements[0]?.index;
                const clickedLabel = this.data.labels[clickedElementIndex];
                if (clickedLabel) {
                    drillDownBehavior(clickedLabel); // Trigger drill-down for behavior
                }
            }
        }
    });
}

// Function to handle drill-down for behaviors
function drillDownBehavior(behavior) {
    alert(`Drilling down into behavior: ${behavior}`);
    // Implement more detailed analysis or visualization here
}
