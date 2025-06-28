constexpr int TDS_PIN{A5};

void setup() {
  Serial.begin(9600);
}

void loop() {
  int tds_analog{analogRead(TDS_PIN)};
  double tds_voltage{analog_to_voltage(tds_analog)};
  double tds_ppm{voltage_to_tds_ppm(tds_voltage)};

  Serial.print("TDS (ppm): ");
  Serial.println(tds_ppm, 0);

  delay(1000);
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
