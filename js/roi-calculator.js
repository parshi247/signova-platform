// ROI Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const documentsSlider = document.getElementById('documents-per-month');
    const timeSlider = document.getElementById('time-per-document');
    const rateSlider = document.getElementById('hourly-rate');
    
    const documentsValue = document.getElementById('documents-value');
    const timeValue = document.getElementById('time-value');
    const rateValue = document.getElementById('rate-value');
    
    const timeSavings = document.getElementById('time-savings');
    const costSavings = document.getElementById('cost-savings');
    const annualRoi = document.getElementById('annual-roi');
    
    const savingsChart = document.getElementById('savings-chart');
    
    // Initialize chart
    let chart;
    if (savingsChart) {
        const ctx = savingsChart.getContext('2d');
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Traditional Process', 'With Signova AI'],
                datasets: [{
                    label: 'Monthly Hours Spent',
                    data: [33.33, 8.33],
                    backgroundColor: [
                        'rgba(160, 174, 192, 0.7)',
                        'rgba(74, 144, 226, 0.7)'
                    ],
                    borderColor: [
                        'rgba(160, 174, 192, 1)',
                        'rgba(74, 144, 226, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw + ' hours';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update values on slider change
    function updateValues() {
        if (!documentsSlider || !timeSlider || !rateSlider) return;
        
        const documents = parseInt(documentsSlider.value);
        const timePerDoc = parseInt(timeSlider.value);
        const hourlyRate = parseInt(rateSlider.value);
        
        // Update display values
        documentsValue.textContent = documents;
        timeValue.textContent = timePerDoc;
        rateValue.textContent = '$' + hourlyRate;
        
        // Calculate savings
        const traditionalHours = (documents * timePerDoc) / 60; // Convert minutes to hours
        const signovaHours = traditionalHours * 0.25; // 75% time savings
        const hoursSaved = traditionalHours - signovaHours;
        
        const monthlyCostSavings = hoursSaved * hourlyRate;
        const annualCostSavings = monthlyCostSavings * 12;
        
        // Assume Signova costs $500/month for this calculation
        const annualSignovaCost = 500 * 12;
        const calculatedRoi = (annualCostSavings / annualSignovaCost) * 100;
        
        // Update result displays
        timeSavings.textContent = hoursSaved.toFixed(1) + ' hours';
        costSavings.textContent = '$' + monthlyCostSavings.toFixed(0);
        annualRoi.textContent = calculatedRoi.toFixed(0) + '%';
        
        // Update chart
        if (chart) {
            chart.data.datasets[0].data = [traditionalHours.toFixed(2), signovaHours.toFixed(2)];
            chart.update();
        }
    }
    
    // Add event listeners
    if (documentsSlider) {
        documentsSlider.addEventListener('input', updateValues);
    }
    
    if (timeSlider) {
        timeSlider.addEventListener('input', updateValues);
    }
    
    if (rateSlider) {
        rateSlider.addEventListener('input', updateValues);
    }
    
    // Initialize values
    updateValues();
});
