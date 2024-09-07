// Stromampel Shelly
// Checks the API of the Energy-Charts.info - Trafficlight for renewable Energy

function getGridSignal() {
  // Get current time in seconds (Linux time)
  let currentTime = Math.floor(Date.now() / 1000);

  // HTTP GET request using Shelly.call
  Shelly.call("HTTP.GET", { url: "https://api.energy-charts.info/signal?country=de" }, function (result, error_code, error_message) {
    if (error_code === 0) {
      try {
        let parsedData = JSON.parse(result.body);
        if (parsedData && parsedData.unix_seconds && parsedData.signal) {
          let closestSignal = getClosestSignal(parsedData.signal, parsedData.unix_seconds, currentTime);
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
  });
}

function getClosestSignal(signals, unix_seconds, currentTime) {
  let closestIndex = null;
  let closestDiff = Number.MAX_VALUE;

  // Loop through unix_seconds and find the closest to the current time
  for (let i = 0; i < unix_seconds.length; i++) {
    let timeDiff = Math.abs(currentTime - unix_seconds[i]);
    if (timeDiff < closestDiff) {
      closestDiff = timeDiff;
      closestIndex = i;
    }
  }

  // Return the signal corresponding to the closest unix_seconds
  return closestIndex !== null ? signals[closestIndex] : null;
}

function setDeviceState(state) {
  Shelly.call("Switch.Set", { id: 0, on: state }, null);  // Assume relay is at id 0
}

function handleSignal(signal) {
  if (signal === 2) {
    // Green signal: Turn ON the device
    setDeviceState(true);
    print("Grid signal green, turning device ON");
  } else if (signal === 1) {
    // Yellow signal: Customize what you want to do with the device
    // Uncomment the following lines to turn OFF the device for yellow signal
    setDeviceState(false);
    print("Grid signal yellow, turning device OFF");
    // Uncomment the following lines to turn ON the device for yellow signal
    // setDeviceState(true);
    // print("Grid signal yellow, turning device ON");
  
  } else {
    // Red signal: Turn OFF the device
    setDeviceState(false);
    print("Grid signal red, turning device OFF");
  }
}

// Main loop to check the grid signal every 5 minutes
Timer.set(300000, true, getGridSignal);

// Initial call to start the process
getGridSignal();
