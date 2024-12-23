#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <Servo.h>

// WiFi Credentials
#define WIFI_SSID "your_wifi_ssid"
#define WIFI_PASSWORD "your_wifi_password"

// Firebase Credentials
#define FIREBASE_HOST "your_firebase_project.firebaseio.com"
#define FIREBASE_AUTH "your_firebase_database_secret"

// Pin Definitions
#define ULTRASONIC_TRIGGER_PIN D1
#define ULTRASONIC_ECHO_PIN D2
#define FSR_PIN A0
#define SERVO_PIN D3
#define MANUAL_OPEN_BUTTON_PIN D5
#define MANUAL_CLOSE_BUTTON_PIN D6

// Thresholds and Constants
#define MAX_WATER_LEVEL 300  // Max water level in cm
#define CRITICAL_WATER_LEVEL 210 // 70% of MAX_WATER_LEVEL
#define SAFE_PRESSURE_THRESHOLD 700

// Firebase Paths
#define FIREBASE_PATH_WATER_LEVEL "/dam/water_level"
#define FIREBASE_PATH_PRESSURE "/dam/pressure"
#define FIREBASE_PATH_GATE_STATUS "/dam/gate_status"
#define FIREBASE_PATH_ALERT "/dam/alert"

// Objects
Servo gateServo;
FirebaseData firebaseData;

// Variables
int waterLevel = 0;
int waterPressure = 0;
bool isGateOpen = false;

// Function to connect to WiFi
void connectToWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi.");
}

// Function to measure water level
int measureWaterLevel() {
  digitalWrite(ULTRASONIC_TRIGGER_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(ULTRASONIC_TRIGGER_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(ULTRASONIC_TRIGGER_PIN, LOW);
  long duration = pulseIn(ULTRASONIC_ECHO_PIN, HIGH);
  int distance = duration * 0.034 / 2;
  return constrain(distance, 0, MAX_WATER_LEVEL);
}

// Function to measure water pressure
int measureWaterPressure() {
  int analogValue = analogRead(FSR_PIN);
  return analogValue;
}

// Function to control gate
void controlGate(bool open) {
  if (open) {
    gateServo.write(90);  // Open position
    isGateOpen = true;
  } else {
    gateServo.write(0);   // Closed position
    isGateOpen = false;
  }
  Firebase.setBool(firebaseData, FIREBASE_PATH_GATE_STATUS, isGateOpen);
}

// Setup function
void setup() {
  Serial.begin(115200);
  pinMode(ULTRASONIC_TRIGGER_PIN, OUTPUT);
  pinMode(ULTRASONIC_ECHO_PIN, INPUT);
  pinMode(FSR_PIN, INPUT);
  pinMode(MANUAL_OPEN_BUTTON_PIN, INPUT_PULLUP);
  pinMode(MANUAL_CLOSE_BUTTON_PIN, INPUT_PULLUP);

  gateServo.attach(SERVO_PIN);
  controlGate(false);  // Ensure gate starts closed

  connectToWiFi();
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}

// Main loop
void loop() {
  // Measure sensors
  waterLevel = measureWaterLevel();
  waterPressure = measureWaterPressure();

  // Update Firebase
  Firebase.setInt(firebaseData, FIREBASE_PATH_WATER_LEVEL, waterLevel);
  Firebase.setInt(firebaseData, FIREBASE_PATH_PRESSURE, waterPressure);

  // Check critical conditions
  if (waterLevel > CRITICAL_WATER_LEVEL || waterPressure > SAFE_PRESSURE_THRESHOLD) {
    Firebase.setString(firebaseData, FIREBASE_PATH_ALERT, "Critical condition detected!");
    controlGate(true); // Automatically open gate
  }

  // Manual control
  if (digitalRead(MANUAL_OPEN_BUTTON_PIN) == LOW) {
    controlGate(true);
  } else if (digitalRead(MANUAL_CLOSE_BUTTON_PIN) == LOW) {
    controlGate(false);
  }

  // Print values for debugging
  Serial.print("Water Level: ");
  Serial.print(waterLevel);
  Serial.print(" cm, Pressure: ");
  Serial.print(waterPressure);
  Serial.print(", Gate: ");
  Serial.println(isGateOpen ? "Open" : "Closed");

  delay(1000); // Loop delay
}
