// Stromampel for Shelly Plus Plug S
// Controls Shelly Plus Plug S Output based on the German energy grid traffic light by energy-charts.info
// Shelly Script - Version 1.1 - 12 September 2024 -- CC Zero - https://creativecommons.org/publicdomain/zero/1.0/
// --- Customizable Settings ---
const YELLOW_SIGNAL_BEHAVIOR = "OFF";  // Choose either "ON" or "OFF" for when the signal is yellow
// --- End of Customizable Settings ---

// Loads the energy grid signal via API
function updatePowerStatusFromGridSignal() {
  let now = new Date();
  let localTime = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  print("Updating power status from grid signal ... Time: ", localTime);

  let apiUrl = "https://api.energy-charts.info/signal?country=de";
  // print("Loading API data from " + apiUrl + " ...");

  Shelly.call(
    "HTTP.GET",
    { url: apiUrl },
    function (result, error_code, error_message) {
      if (error_code === 0) {
        try {
          let parsedData = JSON.parse(result.body);
          if (parsedData && parsedData.unix_seconds && parsedData.signal) {
            let closestSignal = getCurrentSignal(parsedData.signal, parsedData.unix_seconds);
            if (closestSignal !== null) {
              handleSignal(closestSignal);
            } else {
              print("Error: No valid signal found");
            }
          } else {
            print("Error: Invalid data (no signal or unix_seconds found)");
          }
        } catch (error) {
          print("Error parsing JSON: " + error.message);
        }
      } else {
        print("Error: could not load API data. " + error_message);
      }
    }
  );
}

// Finds the current signal in API data
function getCurrentSignal(signals, unix_seconds) {
  let currentTime = Math.floor(Date.now() / 1000);
  let currentSignal = null;
  for (let i = 0; i < unix_seconds.length -1; i++) {
    if (unix_seconds[i + 1] > currentTime) {
      currentSignal = signals[i];
      break;
    }
  }

  return currentSignal;
}

// Handles the grid signal
function handleSignal(signal) {
  if (signal === 2) {
    // Green signal
    Shelly.call("Switch.Set", { id: 0, on: true }, null, null);
    print("–> Grid signal green, device ON");
  } else if (signal === 1) {
    // Yellow signal
    if (YELLOW_SIGNAL_BEHAVIOR === "ON") {
      Shelly.call("Switch.Set", { id: 0, on: true }, null, null);
    } else {
      Shelly.call("Switch.Set", { id: 0, on: false }, null, null);
    }
    print("–> Grid signal yellow, device " + YELLOW_SIGNAL_BEHAVIOR);
  } else {
    // Red signal
    Shelly.call("Switch.Set", { id: 0, on: false }, null, null);
    print("Grid signal red, device OFF");
  }
}

// Start checking the grid signal every 15 minutes
Timer.set(15 * 60 * 1000, true, updatePowerStatusFromGridSignal);

// Update (wait 30 seconds for the network connection to establish on boot)
Timer.set(30 * 1000, false, updatePowerStatusFromGridSignal);
// To immediately update instead, eg. when testing the script in the Shelly console:
//updatePowerStatusFromGridSignal()
