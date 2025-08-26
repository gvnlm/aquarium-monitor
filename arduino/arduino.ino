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
constexpr char SERVER_HOST_NAME[]{"aquarium-monitor-backend-c4hzfra3ckbdhqdu.newzealandnorth-01.azurewebsites.net"};

// Max time (ms) requests can be delayed by when the backend server hosted on Render has spun down 
// due to inactivity
constexpr int RENDER_COLD_START_MAX_DELAY{50000};

// Minimum delay (ms) between sensor reads
constexpr int SENSORS_READ_DELAY{60000 * 4};

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

  Serial.print("Establishing connection with ");
  Serial.print(SERVER_HOST_NAME);
  Serial.println("...");
  Serial.println();

  // Try establish connection with backend server
  if (client.connect(SERVER_HOST_NAME, 443)) {
    Serial.print("Successfully established connection with ");
    Serial.println(SERVER_HOST_NAME);
    Serial.println();

    String payload = "{\"tds_ppm\": " + String(tds_ppm, 0) + ", \"temp_c\": " + String(temp_c, 1) + "}";
    Serial.print("Sending ");
    Serial.print(payload);
    Serial.print(" to ");
    Serial.println(SERVER_HOST_NAME);
    Serial.println();

    // Send sensor readings to backend server via an HTTP POST request
    client.println("POST / HTTP/1.1");
    client.print("Host: ");
    client.println(SERVER_HOST_NAME);
    client.println("Content-Type: application/json");
    client.print("Content-Length: ");
    client.println(payload.length());
    client.println("Connection: close");
    client.println();
    client.println(payload);

    unsigned long startTime{millis()};

    // Wait up to 50 seconds for response from backend server
    while (client.available() == 0) {
      unsigned long currTime{millis()};
      unsigned long msElapsed{currTime - startTime};

      if (msElapsed > RENDER_COLD_START_MAX_DELAY) {
        Serial.println("Client has timed out");
        Serial.println();

        client.stop();

        return;
      }
    }

    // Parse entire response from backend server to ensure connection with
    // backend server can be closed properly
    while (client.available()) {
      client.read();
    }

    // Close connection with backend server
    client.stop();
  } else {
    Serial.print("Failed to establish connection with ");
    Serial.println(SERVER_HOST_NAME);
    Serial.println();
  }

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
