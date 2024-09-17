# **Stromampel Plug** 
Scripts that switch ESP32-based Shelly and Tasmota smart plugs according to the amount of renewable energy in the German power by reqeusting the API of [energy-charts.info](https://energy-charts.info/charts/consumption_advice/chart.htm?l=de&c=DE). ESP32 Plugs required, older ESP8266 devices do not work!

**stromampel_shelly.js** is written in [Shelly Script](https://shelly-api-docs.shelly.cloud/gen2/Scripts/Tutorial/). Just upload and enable "Run on startup". Tested with Shelly Plus Plug S v2.
**stromampel_tasmota.be** is written in [Tasmota Berry](https://tasmota.github.io/docs/Berry/). Here you first have to set your timezone, e.g. using [tasmotatimezone.com](https://tasmotatimezone.com). Tested with NOUS A8T Smart Plug but it should work with other ESP32-devices, too.

## Anleitung Deutsch
Skripte, die ESP32-basierte Shelly- und Tasmota-Smart-Plugs je nach Anteil erneuerbarer Energien im deutschen Stromnetz steuern, indem sie die API von energy-charts.info abfragen. Erforderlich sind neuere ESP32-Steckdosenadapter. Ältere ESP8266-Geräte funktionieren nicht! Wie vorgestellt im [Deutschlandfunk - Selbermachtipp: Eine Steckdose auf erneuerbaren Strom programmieren](https://share.deutschlandradio.de/dlf-audiothek-audio-teilen.html?audio_id=dira_DLF_62eb00f2) am 6. Oktober 2024.

### Shelly
[stromampel_shelly.js](https://raw.githubusercontent.com/netzbasteln/stromampel-plug/main/Shelly/stromampel_shelly.js "stromampel_shelly.js") ist in Shelly Script geschrieben. Einfach hochladen und "Run on startup" aktivieren. Getestet mit [Shelly Plus Plug S v2](https://preisvergleich.heise.de/?fs=Shelly+Plus+Plug+S&hloc=at&hloc=de "Shelly Plus Plug S v2").

- Einstecken. Mit dem WLAN ShellyPlusPlugS-.... verbinden
- Im Browser Seite http://192.168.33.1 aufrufen
- Configure Wi-Fi settings, Wi-Fi 1 aktivieren, Ihr WLAN auswählen, Passwort eingeben, Speichern, die unter "Wi-Fi status" angegebene IP-Adresse zB 192.168.178.123 merken, wieder mit eigenem WLAN verbinden, diese IP-Adresse im Browser aufrufen.
- Über Settings -> Access Point diesen abschalten, ist unnötig
- Über Settings -> Firmware Updates starten, ist zweifach nötig, aktuell ist derzeit die Version 1.4.2
- über Scripts -> Create A Script ein Skript anlegen
- "Script Name" kann zB "Stromampel" sein
- In das große Fenster den kompletten Code von [stromampel_shelly.js](https://raw.githubusercontent.com/netzbasteln/stromampel-plug/main/Shelly/stromampel_shelly.js "stromampel_shelly.js") einfügen
- Save. Start. Logs aktivieren mit "Enable Logs"
- Nach 30 Sekunden sollte das Skript erstmals die Stromampel abrufen, das sollte auch in den Logs stehen. 
- Falls alles klappt, das Skript in der Scripts-Übersicht mit "Run on startup" dauerhaft aktivieren
- Bei Home -> Switches (Bereich in der Mitte) -> LED Indication den LED indication mode auf "Switch state stellen", Save.
- Im obersten Teil des Skripts kann eingestellt werden, ob eine gelbe Stromampel den Schalter ON oder OFF schaltet. Standard ist OFF.
 
### Tasmota
[stromampel_tasmota.be](https://raw.githubusercontent.com/netzbasteln/stromampel-plug/main/Tasmota/stromampel_tasmota.be "stromampel_tasmota.be")  ist in Tasmota Berry geschrieben. Getestet mit [NOUS A8T Smart Plug](https://preisvergleich.heise.de/nous-smart-wifi-a8t-a3292043.html "NOUS A8T Smart Plug."), sollte auch auf [anderen ESP32-Devices](https://templates.blakadder.com/esp32.html) laufen.

- Einstecken. Mit dem WLAN tasmota-..... verbinden. Falls kein Popup erscheint, http://192.168.4.1 öffnen
- Eigenes WLAN wählen und Passwort eingeben- Absenden
- Dann wird auch wieder die IP-Aresse im Heimnetz angezeigt, zB 192.168.178.123 
- Mit dem Heimnetz verbinden, diese IP im Browser öffnen
- Firmware-Upgrade durchführen, aktuell ist 14.2.0, dafür bootet die Dose in einen anderen Modus, erreichbar über dieselbe IP. Restart
- Zeitzone einstellen über "Tools" –> "Console". Hierfür das entsprechende Kommando von der Website [tasmotatimezone.com](https://tasmotatimezone.com "tasmotatimezone.com") erstellen lassen, so lernt die Steckdose auch den Sonnenauf/Untergang zu berechnen. Das Kommando in die untere Zeile einfügen und mit Enter absenden, es kommt eine mehrzeilige Bestätigung.
- Das Berry-Script im Dateisystem speichern, 
- Zu Tools -> Manage File system –> Create and edit new file gehen
- Hier unter "File:" statt `/newfile.txt` Dateinamen eingeben: `/stromampel_tasmota.be`
- und den Inhalt der Datei [stromampel_tasmota.be](https://raw.githubusercontent.com/netzbasteln/stromampel-plug/main/Tasmota/stromampel_tasmota.be "stromampel_tasmota.be") in das Inhaltsfeld kopieren (das evtl. darin stehende "newfile.txt" ersetzen) 
- Speichern, stromampel_tasmota.be sollte in der Liste erscheinen
- Genauso die Datei `/autostart.be` [mit diesem Inhalt](https://raw.githubusercontent.com/netzbasteln/stromampel-plug/main/Tasmota/autoexec.be "/autostart.be") anlegen (falls noch keine da ist, sonst mit dem Inhalt ergänzen) und speichern
- Steckdose neu starten. Nach 30 Sekunden sollten die ersten API-Abfragen laufen und sich die Dose entsprechend an/ausschalten.
- Im obersten Teil des Skripts kann eingestellt werden, ob eine gelbe Stromampel den Schalter ON oder OFF schaltet. Standard ist OFF.
