Scripts that switches ESP32-based Shelly and Tasmota smart plugs according to the amount of renewable energy in the German power by reqeusting the API of https://energy-charts.info/

Old ESP8266 devices do not work.

stromampel_shelly.js is written in [Shelly Script](https://shelly-api-docs.shelly.cloud/gen2/Scripts/Tutorial/). Just upload and enable "Run on startup".

stromampel_tasmota.be is written in [Tasmota Berry](https://tasmota.github.io/docs/Berry/). Here you first have to set your timezone, e.g. using [tasmotatimezone.com](https://tasmotatimezone.com).

As discussed in [Deutschlandfunk - Selbermachtipp: Eine Steckdose auf erneuerbaren Strom programmieren](https://share.deutschlandradio.de/dlf-audiothek-audio-teilen.html?audio_id=dira_DLF_62eb00f2) on October 6th 2024.
