// Stromampel Shelly
// Controls Shelly Plug S LED based on the German energy grid traffic light.

// --- Customizable Settings ---
const CHECK_INTERVAL_MS = 300000;  // Check the grid status every 5 minutes
const YELLOW_SIGNAL_BEHAVIOR = "OFF"; // Choose either "ON" or "OFF" for the yellow signal
// --- End of Customizable Settings ---

var r = 0;
var g = 0;
var b = 0;

// Function to set the RGB LED color
function setRGB() {
  Shelly.call(
    "PLUGS_UI.SetConfig",
    {
      id: 0,
      config: {
        "leds": {
          "mode": "switch",
          "colors": {
            "switch:0": {
              "on": { "rgb": [r, g, b], "brightness": 100 },
              "off": { "rgb": [r, g, b], "brightness": 100 } 
            }
          },
          "power": { "brightness": 100 },
          "night_mode": { "enable": true, "brightness": 100, "active_between": ["20:00", "08:00"] }
        },
        "controls": { "switch:0": { "in_mode": "momentary" } }
      }
    },
    null,
    null
  );
}

// --- Energy Grid Traffic Light Logic ---

// Function to get the energy grid signal
function getGridSignal() {
  // Get and format the local time 
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  // Add leading zero if needed
  hours = (hours < 10 ? "0" : "") + hours;
  minutes = (minutes < 10 ? "0" : "") + minutes;
  seconds = (seconds < 10 ? "0" : "") + seconds;

  let localTime = hours + ":" + minutes + ":" + seconds;

  print("Checking API at", localTime); 
  let currentTime = Math.floor(Date.now() / 1000);

  Shelly.call(
    "HTTP.GET",
    { url: "https://api.energy-charts.info/signal?country=de" },
    function (result, error_code, error_message) {
      if (error_code === 0) {
        try {
          let parsedData = JSON.parse(result.body);
          if (parsedData && parsedData.unix_seconds && parsedData.signal) {
            let closestSignal = getClosestSignal(
              parsedData.signal,
              parsedData.unix_seconds,
              currentTime
            );
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
function getClosestSignal(signals, unix_seconds, currentTime) {
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

// Function to set the device state and LED color
function handleSignal(signal) {
  if (signal === 2) {
    // Green signal
    setDeviceState(true);
    r = 0;
    g = 100;
    b = 0;
    setRGB();
    print("Grid signal green, device ON");
  } else if (signal === 1) {
    // Yellow signal
    if (YELLOW_SIGNAL_BEHAVIOR === "ON") {
      setDeviceState(true);
    } else {
      setDeviceState(false);
    }
    r = 100; 
    g = 100;
    b = 0;  
    setRGB();
    print("Grid signal yellow, device " + YELLOW_SIGNAL_BEHAVIOR);
  } else {
    // Red signal
    setDeviceState(false);
    r = 100;
    g = 0;
    b = 0;
    setRGB();
    print("Grid signal red, device OFF");
  }
}

// Function to set the device state (on/off)
function setDeviceState(state) {
  Shelly.call("Switch.Set", { id: 0, on: state }, null);
}

// Start checking the grid signal
getGridSignal();
Timer.set(CHECK_INTERVAL_MS, true, getGridSignal);
