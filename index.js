// OraaS Translate TLE API Implementation
const PROXY_URL = `https://oraas.herokuapp.com/`; // To be prefixed to the URL of the Requests
const API_ENDPOINT = `https://oraas.orekit.space/tle/translate`;
// TLE Form
let form = document.querySelector("#queryParamsForm"),
table = document.querySelector("#values");
// getOutput Function to Send Request to the API and receive JSON Data
function getOutput(e) {
  // TLE Parameters Object
  let params = JSON.stringify({
    tle: {
      line1: `${document.querySelector("#line1").value}`,
      line2: `${document.querySelector("#line2").value}`,
    },
  });
  // Query String to be placed at the end of Request URL
  let query = `?json=${params}`;
  // Endpoint URL based on TLE Parameters
  let url = `${PROXY_URL}${API_ENDPOINT}${query}`;

  // Creating a Request to Fetch the Data from the API using the URL
  fetch(url, { method: "GET" })
    .then((res) => res.json()) // Getting JSON Data from the returned Promise
    .then((data) => displayResults(data)); // Displaying the received Data
}

// displayResults Function to parse the received Data and Display it in a Readable format
function displayResults(output) {
  table.classList.remove("querySent");
  table.classList.remove("InvalidTLE");
  // Checking if the Request was
  if (output["tleDate"]) {
    // Flattening the Object to get a one-dimensional Object
    output = flattenObj(output);
    // Separating the Date and Time
    date = output["tleDate"].split("T")[0];
    time = output["tleDate"].split("T")[1];
    output["tleDate"] = date;
    // Inserting the Time Property into the Object
    output = insertKey("tleTime", time, output, 1);

    // Clearing any previous output
    table.innerHTML = "";
    // Looping throught the 1-D Object and Populating the HTML with the received Data
    for (key in output) {
      table.innerHTML += `
      <tr class="property">
        <td>${key.replace(/-/g, " ").replace(/([A-Z])/g, ' $1').trim()}</td>
        <td>${output[key]}</td>
      </tr>
    `;
    }
  } else {
    // Displaying Errors if any
    table.innerHTML = "The TLE Values are Invalid!";
    table.setAttribute("class", "InvalidTLE");
  }
}

// Preventing the Page from Reloading after Form Submit
function getData(event) {
  event.preventDefault();
  table.innerHTML = '';
  table.classList.add("querySent");
  table.classList.remove("InvalidTLE");
  getOutput();
}
form.addEventListener("submit", getData);


// Utility Functions
// Flatten Object into 1-dimension
function flattenObj(ob) {
  let result = {};

  for (const i in ob) {
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        result[i + "-" + j] = temp[j];
      }
    } else {
      result[i] = ob[i];
    }
  }
  return result;
}
// Insery Key into Object at a specific postiion
function insertKey(key, value, obj, pos) {
  return Object.keys(obj).reduce((ac, a, i) => {
    if (i === pos) ac[key] = value;
    ac[a] = obj[a];
    return ac;
  }, {});
}
