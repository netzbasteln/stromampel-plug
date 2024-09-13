Scripts that switches ESP32-based Shelly and Tasmota smart plugs according to the amount of renewable energy in the German power by reqeusting the API of [energy-charts.info](https://energy-charts.info/charts/consumption_advice/chart.htm?l=de&c=DE) by 

Old ESP8266 devices do not work!

stromampel_shelly.js is written in [Shelly Script](https://shelly-api-docs.shelly.cloud/gen2/Scripts/Tutorial/). Just upload and enable "Run on startup". Tested with Shelly Plus Plug S v2.

stromampel_tasmota.be is written in [Tasmota Berry](https://tasmota.github.io/docs/Berry/). Here you first have to set your timezone, e.g. using [tasmotatimezone.com](https://tasmotatimezone.com). Tested with NOUS A8T Smart Plug.

As discussed in [Deutschlandfunk - Selbermachtipp: Eine Steckdose auf erneuerbaren Strom programmieren](https://share.deutschlandradio.de/dlf-audiothek-audio-teilen.html?audio_id=dira_DLF_62eb00f2) on October 6th 2024.
