# About

This project uses an Arduino (UNO R4 WiFi), a temperature sensor (DS18B20), and a TDS sensor (Gravity: Analog TDS Sensor clone) to continuously monitor the temperature and total dissolved solids (TDS) of my aquarium.

The Arduino sends sensor readings to the backend server every ~4 minutes. 
The backend server acts as an intermediary &mdash; saving incoming data from the Arduino to MongoDB, and retrieving data from MongoDB upon request from the frontend.
The frontend displays saved data over a user-selectable date range.

<p align="center">
  <img src="./docs/data-flow-diagram.svg"/>
</p>
