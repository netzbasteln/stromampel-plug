// Stromampel for Shelly Plus Plug S
// Controls Shelly Plus Plug S Output based on the German energy grid traffic light by energy-charts.info
// Shelly Script - Version 1.0 - 10 September 2024 -- CC Zero - https://creativecommons.org/publicdomain/zero/1.0/
// --- Customizable Settings ---
const CHECK_INTERVAL_MINUTES = 5;  // Check the grid status every 5 minutes
const YELLOW_SIGNAL_BEHAVIOR = "OFF"; // Choose either "ON" or "OFF" for the yellow signal
// --- End of Customizable Settings ---

// Calculate check interval in milliseconds
const CHECK_INTERVAL_MS = CHECK_INTERVAL_MINUTES * 60 * 1000; 

// --- Energy Grid Traffic Light Logic ---

// Function to get the energy grid signal
function getGridSignal() {
  let now = new Date();
  let localTime = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  print("Checking API at", localTime); 

  Shelly.call(
    "HTTP.GET",
    { url: "https://api.energy-charts.info/signal?country=de" },
    function (result, error_code, error_message) {
      if (error_code === 0) {
        try {
          let parsedData = JSON.parse(result.body);
          if (parsedData && parsedData.unix_seconds && parsedData.signal) {
            let closestSignal = getClosestSignal(parsedData.signal, parsedData.unix_seconds);
            if (closestSignal !== null) {
              handleSignal(closestSignal);
            } else {
              print("Error: No matching signal found");
            }
          } else {
            print("Error: No signal or unix_seconds data found");
          }
        } catch (error) {
          print("Error parsing JSON: " + error.message);
        }
      } else {
        print("Error fetching API: " + error_message);
      }
    }
  );
}

// Function to find the closest signal time
function getClosestSignal(signals, unix_seconds) {
  let currentTime = Math.floor(Date.now() / 1000);
  let closestIndex = null;
  let closestDiff = Number.MAX_VALUE;
  for (let i = 0; i < unix_seconds.length; i++) {
    let timeDiff = Math.abs(currentTime - unix_seconds[i]);
    if (timeDiff < closestDiff) {
      closestDiff = timeDiff;
      closestIndex = i;
    }
  }

  return closestIndex !== null ? signals[closestIndex] : null;
}

// Function to handle the grid signal
function handleSignal(signal) {
  if (signal === 2) {
    // Green signal
    Shelly.call("Switch.Set", { id: 0, on: true }, null, null);
    print("Grid signal green, device ON");
  } else if (signal === 1) {
    // Yellow signal
    if (YELLOW_SIGNAL_BEHAVIOR === "ON") {
      Shelly.call("Switch.Set", { id: 0, on: true }, null, null);
    } else {
      Shelly.call("Switch.Set", { id: 0, on: false }, null, null);
    }
    print("Grid signal yellow, device " + YELLOW_SIGNAL_BEHAVIOR);
  } else {
    // Red signal
    Shelly.call("Switch.Set", { id: 0, on: false }, null, null);
    print("Grid signal red, device OFF");
  }
}

// Start checking the grid signal
getGridSignal();
Timer.set(CHECK_INTERVAL_MS, true, getGridSignal);
