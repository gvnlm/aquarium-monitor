// Libraries required for DS18B20 temperature sensor
#include <OneWire.h>
#include <DallasTemperature.h>

// Delay (ms) between sensor reads
constexpr int SENSORS_READ_DELAY{1000};

constexpr int TEMP_PIN{2};
constexpr int TDS_PIN{A5};

// Setup temperature sensor
OneWire one_wire{TEMP_PIN};
DallasTemperature sensors(&one_wire);

void setup() {
  Serial.begin(9600);
  sensors.begin();
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
