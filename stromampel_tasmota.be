# Stromampel for Tasmota devices
# Berry Script - Version 1.1 - 12. September 2024 -- CC Zero - https://creativecommons.org/publicdomain/zero/1.0/
# --- Customizable Settings ---
var yellow_signal_behaviour = "OFF"  # Choose either "ON" or "OFF" for when the signal is yellow
var relay = 0                        # Which Tasmota relay to switch, normally 0
# --- End of Customizable Settings ---

import json

def update_power_status_from_grid_signal()
  var currentTime = tasmota.rtc("local")
  print("Updating power status from grid signal ... Time: " + tasmota.time_str(currentTime))

  var api_url = "https://api.energy-charts.info/signal?country=de"
  # print("Loading API data from " + api_url + " ...")

  try
    var cl = webclient()
    cl.begin(api_url)
    var response_code = cl.GET()
    if response_code != 200
      raise "Error: could not load API data, HTTP response code " + str(response_code)
    end

    var response_content = cl.get_string()
    # print("Response content: " + response_content)
    var data = json.load(response_content)
    # print("Parsed JSON data: " + str(data))

    if !data.contains("signal") || !data.contains("unix_seconds")
      raise "Error: Invalid data (no signal or unix_seconds found)"
    end

    # Find current signal
    var unix_seconds = data["unix_seconds"]
    var signals = data["signal"]
    var current_signal = nil
    for i : 0 .. size(unix_seconds) - 2
      if unix_seconds[i + 1] > currentTime
        current_signal = signals[i]
        break
      end
    end

    # Handle current signal
    if current_signal == nil
      print("Error: No valid signal found")
    else
      if current_signal == 2
        # Green signal
        print("–> Grid signal green, device ON")
        tasmota.set_power(relay, true)
      elif current_signal == 1
        # Yellow signal
        print("–> Grid signal yellow, device " + yellow_signal_behaviour)
        tasmota.set_power(relay, yellow_signal_behaviour == "ON")
      else
        # Red signal
        print("–> Grid signal red, device OFF")
        tasmota.set_power(relay, false)
      end
    end

  except .. as variable, message
    print("Error: " + str(variable) + ": " + message)
    tasmota.resp_cmnd_error()
    return
  end
end

# Add a cron job for periodic updates every 15 minutes.
tasmota.remove_cron("stromampel_update")
tasmota.add_cron("0 */15 * * * *", update_power_status_from_grid_signal, "stromampel_update")

# Update now
update_power_status_from_grid_signal()
