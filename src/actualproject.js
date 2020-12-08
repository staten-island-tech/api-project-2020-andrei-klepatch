const DOMSelectors = {
  displayContainer: document.querySelector(".display-container"),
  title: document.getElementById("title"),
  searchBar: document.getElementById("text-input"),
  searchButton: document.querySelector(".search-btn"),
  dropDownButton: document.querySelector(".drop-down-btn"),
  dropDownContents: document.querySelector(".dropdown-content"),
  chart: document.getElementById("chart"),
  sevenDays: document.getElementById("seven-days"),
  fourteenDays: document.getElementById("fourteen-days"),
  thirtyDays: document.getElementById("thirty-days"),
};

const keys = {
  alphaVantage: "U98SY7ABD14NYY0D",
};

var dateRange = 7;
var data = [];

function main() {
  DOMSelectors.dropDownButton.style.display = "none";
  DOMSelectors.searchBar.addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
      inputstring = DOMSelectors.searchBar.value;
      DOMSelectors.searchBar.value = "";
      dataCall(inputstring, dateRange);
    }
  });
  DOMSelectors.searchButton.addEventListener("click", function (e) {
    inputstring = DOMSelectors.searchBar.value;
    DOMSelectors.searchBar.value = "";
    dataCall(inputstring, dateRange);
  });
  DOMSelectors.sevenDays.addEventListener("click", function (e) {
    dateRange = 7;
    generateGraph(data, dateRange, inputstring);
  });
  DOMSelectors.fourteenDays.addEventListener("click", function (e) {
    dateRange = 14;
    generateGraph(data, dateRange, inputstring);
  });
  DOMSelectors.thirtyDays.addEventListener("click", function (e) {
    dateRange = 30;
    generateGraph(data, dateRange, inputstring);
  });
}

async function dataCall(inputstring, range) {
  query = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${inputstring}&apikey=${keys.alphaVantage}`;
  const response = await fetch(query);
  data = await response.json();
  if (data["Meta Data"] == undefined) {
    if (data["Error Message"] !== undefined) {
      alert("Please submit a valid ticker");
      return;
    }
    alert("Please wait before making another request");
    return;
  } else {
    try {
      DOMSelectors.title.style.display = "none";
      DOMSelectors.dropDownButton.style.display = "inline";
      DOMSelectors.dropDownButton.value = `${dateRange} Days`;
      generateGraph(data, dateRange, inputstring);
    } catch (error) {
      console.log(error);
    }
  }
}

function generateGraph(data, dateRange, inputstring) {
  timeSeries = data["Time Series (Daily)"];
  var closingPrices = [];
  var dates = Object.keys(timeSeries).reverse();
  var dates = dates.slice(Math.max(dates.length - dateRange, 0));
  dates.forEach(function (date) {
    closingPrices.push(timeSeries[date]["4. close"]);
  });
  var ctx = DOMSelectors.chart;
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          data: closingPrices,
          borderColor: "#3e95cd",
        },
      ],
    },
    options: {
      responsive: false,
      title: {
        display: true,
        text: `${inputstring.toUpperCase()} Price`,
        fontSize: 26,
      },
      legend: {
        display: false,
      },
    },
  });
}

main();
