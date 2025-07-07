// Libraries required for WiFi client
#include "WiFiS3.h"
#include "secrets.h"

// Libraries required for DS18B20 temperature sensor
#include <OneWire.h>
#include <DallasTemperature.h>

// Ensure the following Wi-Fi credentials have been filled out in secrets.h
constexpr char WIFI_NAME[]{SECRET_WIFI_NAME};
constexpr char WIFI_PW[]{SECRET_WIFI_PW};

// Backend server where we will send sensor readings to
constexpr char SERVER_HOST_NAME[] = "aquarium-monitor-server.onrender.com";

// Delay (ms) between sensor reads
constexpr int SENSORS_READ_DELAY{1000};

constexpr int TEMP_PIN{2};
constexpr int TDS_PIN{A5};

// Setup temperature sensor
OneWire one_wire{TEMP_PIN};
DallasTemperature sensors(&one_wire);

WiFiSSLClient client;

void setup() {
  Serial.begin(9600);
  sensors.begin();
  start_wifi_client();
}

void loop() {
  // Read TDS
  int tds_analog{analogRead(TDS_PIN)};
  double tds_voltage{analog_to_voltage(tds_analog)};
  double tds_ppm{voltage_to_tds_ppm(tds_voltage)};

  // Read temperature
  sensors.requestTemperatures(); 
  double temp_c = sensors.getTempCByIndex(0);

  // Print readings
  print_tds(tds_ppm);
  print_temp(temp_c);
  Serial.println();

  delay(SENSORS_READ_DELAY);
}

void start_wifi_client() {
  // Check Arduino has WiFi module
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("ERROR: No WiFi module found");
    while (true)
      ;
  }

  int status{WL_IDLE_STATUS};

  // Try connect to WiFi until successful connection
  while (status != WL_CONNECTED) {
    Serial.print("Connecting to ");
    Serial.print(WIFI_NAME);
    Serial.println("...");
    Serial.println();

    status = WiFi.begin(WIFI_NAME, WIFI_PW);
    delay(10000);

    if (status != WL_CONNECTED) {
      Serial.print("Failed to connect to ");
      Serial.println(WIFI_NAME);
      Serial.println();
    }
  }

  Serial.print("Successfully connected to ");
  Serial.println(WIFI_NAME);
  Serial.println();

  Serial.print("Connecting to ");
  Serial.print(SERVER_HOST_NAME);
  Serial.println("...");
  Serial.println();

  // Try connect to server
  if (client.connect(SERVER_HOST_NAME, 443)) {
    Serial.print("Successfully connected to ");
    Serial.println(SERVER_HOST_NAME);
    Serial.println();

    // Make HTTP request
    client.println("GET / HTTP/1.1");
    client.print("Host: ");
    client.println(SERVER_HOST_NAME);
    client.println("Connection: close");
    client.println();
  } else {
    Serial.print("Failed to connect to ");
    Serial.println(SERVER_HOST_NAME);
    Serial.println();
  }
}

void print_tds(double tds_ppm) {
  Serial.print("        TDS: ");
  Serial.print(tds_ppm, 0);
  Serial.println(" ppm");
}

void print_temp(double temp_c) {
  Serial.print("Temperature: ");
  Serial.print(temp_c, 1);
  Serial.println(" °C");
}

double voltage_to_tds_ppm(double voltage) {
  // Calibrated against a handheld TDS meter. 
  static constexpr double CALIBRATION_FACTOR{0.5};

  // Formula derived by DFRobot for their Gravity: Analog TDS Sensor.
  // Works for most TDS sensor modules, since they are clones of Gravity: Analog TDS Sensor.
  return (
           133.42 * voltage * voltage * voltage
           - 255.86 * voltage * voltage
           + 857.39 * voltage)
         * CALIBRATION_FACTOR;
}

double analog_to_voltage(int analog_value) {
  static constexpr double VOLTAGE_REF{5.0};
  return VOLTAGE_REF * (analog_value / 1023.0);
}
