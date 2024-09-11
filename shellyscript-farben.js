// Additiona script for Shelly Plus Plug S
// Lets the LED light green when the switch is on - and red if it is off
// Controls Shelly Plug S LED based on the German energy grid traffic light.
// Version 1.0 - 10 September 2024 -- CC Zero - https://creativecommons.org/publicdomain/zero/1.0/

Shelly.call( 
  "PLUGS_UI.SetConfig",
  {
    id: 0,
    config: {
      "leds": {
        "mode": "switch",
        "colors": {
          "switch:0": {
            "on": { "rgb": [0, 100, 0], "brightness": 100 },  // Green for ON
            "off": { "rgb": [100, 0, 0], "brightness": 100 } // Red for OFF
          }
        }
      }
    }
  },
  function (result, code, msg, ud) {},
  null
);
