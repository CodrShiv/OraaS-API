let form = document.querySelector("#queryParamsForm");
function handleForm(event) {
  event.preventDefault();
  getOutput();
}
form.addEventListener("submit", handleForm);

function getOutput(e) {
  // Custom Endpoint based on TLE Parameters
  let query = {
    "tle": {
      "line1": `${document.querySelector("#line1").value}`,
      "line2": `${document.querySelector("#line2").value}`,
    }
  }
  let url = `https://oraas.herokuapp.com/https://oraas.orekit.space/tle/translate?json=${JSON.stringify(query)}`;
  // Creating a Request to Fetch the Data from the URL
  fetch(url, { method: "GET"})
    .then((res) => res.json()) // Getting JSON Data from the returned Promise
    .then(data => displayResults(data))
}

function displayResults(output) {
  if (output["tleDate"]) {
    output = flattenObj(output);
    date = output["tleDate"].split("T")[0];
    time = output["tleDate"].split("T")[1];
    output["tleDate"] = date;
    output = insertKey("tleTime", time, output, 1);
    document.querySelector("#values").innerHTML = '';
    for (key in output) {
      document.querySelector("#values").innerHTML += `
      <tr class="property">
        <td>${key.replace(/-/g, " ")}</td>
        <td>${output[key]}</td>
      </tr>
    `;
    }
  } else {
    document.querySelector("#values").innerHTML = "The TLE Values are Invalid!";
    document.querySelector("#values").setAttribute("class", "InvalidTLE")
  }
}
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

function insertKey(key, value, obj, pos) {
  return Object.keys(obj).reduce((ac, a, i) => {
    if (i === pos) ac[key] = value;
    ac[a] = obj[a];
    return ac;
  }, {});
}
