const API_URL = "http://127.0.0.1:5000/predict"; // Flask backend

let chartData = {
  labels: [],
  datasets: [
    {
      label: "Temperature (°C)",
      borderColor: "red",
      data: [],
      fill: false
    },
    {
      label: "Humidity (%)",
      borderColor: "blue",
      data: [],
      fill: false
    }
  ]
};

let ctx = document.getElementById("myChart").getContext("2d");
let myChart = new Chart(ctx, {
  type: "line",
  data: chartData,
  options: { responsive: true, scales: { y: { beginAtZero: true } } }
});

function ruleBasedCheck(temp, hum) {
  if (temp < 20 || hum < 50) return "Too Low";
  if (temp > 40 || hum > 80) return "Too High";
  return "Optimal";
}

async function checkValues() {
  const temp = parseFloat(document.getElementById("tempInput").value);
  const hum = parseFloat(document.getElementById("humInput").value);

  let ruleStatus = ruleBasedCheck(temp, hum);
  document.getElementById("ruleStatus").innerText = ruleStatus;

  // Send to Flask ML backend
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ temperature: temp, humidity: hum })
  });

  const data = await res.json();
  document.getElementById("mlStatus").innerText = data.prediction;

  logData(temp, hum, ruleStatus, data.prediction);
  updateChart(temp, hum);
}

function simulate() {
  const temp = Math.floor(Math.random() * 50);
  const hum = Math.floor(Math.random() * 100);
  document.getElementById("tempInput").value = temp;
  document.getElementById("humInput").value = hum;
  checkValues();
}

function logData(temp, hum, rule, ml) {
  const table = document.getElementById("logTable");
  const row = table.insertRow(1);
  row.insertCell(0).innerText = new Date().toLocaleTimeString();
  row.insertCell(1).innerText = temp;
  row.insertCell(2).innerText = hum;
  row.insertCell(3).innerText = rule;
  row.insertCell(4).innerText = ml;
}

function updateChart(temp, hum) {
  let time = new Date().toLocaleTimeString();
  chartData.labels.push(time);
  chartData.datasets[0].data.push(temp);
  chartData.datasets[1].data.push(hum);
  myChart.update();
}

function resetDashboard() {
  // Clear inputs
  document.getElementById("tempInput").value = '';
  document.getElementById("humInput").value = '';

  // Clear status
  document.getElementById("ruleStatus").innerText = '';
  document.getElementById("mlStatus").innerText = '';

  // Clear logs table
  const table = document.getElementById("logTable");
  while (table.rows.length > 1) { // Keep header
    table.deleteRow(1);
  }

  // Clear chart
  chartData.labels = [];
  chartData.datasets[0].data = [];
  chartData.datasets[1].data = [];
  myChart.update();
}

// Download logs as CSV
function downloadCSV() {
  const table = document.getElementById("logTable");
  let csv = [];
  for (let i = 0; i < table.rows.length; i++) {
    let row = [], cols = table.rows[i].cells;
    for (let j = 0; j < cols.length; j++) {
      row.push(cols[j].innerText);
    }
    csv.push(row.join(","));
  }

  const csvString = csv.join("\\n");
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'fermentation_logs.csv');
  a.click();
  window.URL.revokeObjectURL(url);
}
