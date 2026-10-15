/* Add or edit project objects in this file to update the project library. */
window.PROJECTS = [
  {
    id: "esp32-rc-car", number: "01", title: "ESP32 Bluetooth RC Car",
    category: "RC Cars", tags: ["ESP32", "Bluetooth", "Motors"], difficulty: "BEGINNER",
    icon: "🚙", artColor: "#38e8ff", glow: "#0b5268",
    description: "Build a phone-controlled four-wheel robot using an ESP32 and a suitable motor driver. This starter page gives you a place to document your exact wiring and control app.",
    parts: ["ESP32 development board", "Motor driver matched to your motors (for example, TB6612FNG or a suitable L298N module)", "DC gear motors and chassis", "Battery suitable for the motors and driver", "Jumper wires"],
    steps: ["Assemble the chassis and securely mount the motors.", "Connect the motor driver logic pins to ESP32 GPIO pins you select.", "Power the motors through the driver and use a shared ground with the ESP32.", "Upload a tested control sketch and pair/connect with your chosen phone controller.", "Test wheels with the car lifted, then drive slowly in an open area."],
    filename: "esp32_rc_car.ino",
    code: `// ESP32 RC car — safe starter template
// Fill in the GPIO pins and driver logic for YOUR hardware.
// Do not connect motors directly to ESP32 GPIO pins.

const int LEFT_IN1 = 18;
const int LEFT_IN2 = 19;
const int RIGHT_IN1 = 21;
const int RIGHT_IN2 = 22;

void setup() {
  pinMode(LEFT_IN1, OUTPUT);
  pinMode(LEFT_IN2, OUTPUT);
  pinMode(RIGHT_IN1, OUTPUT);
  pinMode(RIGHT_IN2, OUTPUT);
  stopMotors();
}

void stopMotors() {
  digitalWrite(LEFT_IN1, LOW);
  digitalWrite(LEFT_IN2, LOW);
  digitalWrite(RIGHT_IN1, LOW);
  digitalWrite(RIGHT_IN2, LOW);
}

void loop() {
  // Add Bluetooth / Wi-Fi command handling here.
  // Test each direction only after verifying your driver wiring.
  stopMotors();
}`
  },
  {
    id: "obstacle-avoider", number: "02", title: "Obstacle-Avoiding Car",
    category: "Arduino", tags: ["Arduino", "HC-SR04", "Servo"], difficulty: "INTERMEDIATE",
    icon: "🤖", artColor: "#5df0bc", glow: "#104c45",
    description: "A robot that measures distance and chooses a direction when something is in its path. Adapt the pin numbers to your board and motor driver.",
    parts: ["Arduino Uno or compatible board", "HC-SR04 ultrasonic sensor", "Motor driver compatible with your motors", "Robot chassis and DC gear motors", "Battery pack and jumper wires", "Optional servo to scan left and right"],
    steps: ["Mount the ultrasonic sensor facing forward.", "Wire the sensor and motor driver using their pin labels and voltage requirements.", "Keep motor power separate from the Arduino 5 V pin unless your power design explicitly supports it.", "Upload and test the sensor readings before enabling motor movement.", "Tune the distance threshold and test in a clear area."],
    filename: "obstacle_avoider.ino",
    code: `// Arduino obstacle-avoider — sensor test starter
// Verify HC-SR04 wiring and voltage before connecting.
// Add your motor-driver movement functions after sensor testing.

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

float readDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(3);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000UL);
  if (duration == 0) return -1; // no echo / out of range
  return duration * 0.0343 / 2.0;
}

void loop() {
  float cm = readDistanceCm();
  Serial.print("Distance (cm): ");
  Serial.println(cm);
  // Once sensor readings are reliable, add your tested
  // motor-driver stop / turn / forward logic here.
  delay(250);
}`

  },
  {
    id: "arduino-blink", number: "03", title: "Arduino LED Blink",
    category: "Arduino", tags: ["Arduino", "LED", "Beginner"], difficulty: "BEGINNER",
    icon: "💡", artColor: "#ffc86b", glow: "#58401d",
    description: "Blink the built-in LED to test your Arduino board and programming setup.",
    parts: ["Arduino Uno or compatible board", "USB data cable"],
    steps: ["Connect the Arduino using a USB data cable.", "Select the correct board and port in Arduino IDE.", "Upload the sketch and observe the built-in LED."],
    filename: "blink_led.ino",
    code: `void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}`
  },
  {
    id: "esp32-web-led", number: "04", title: "ESP32 Wi-Fi LED Control",
    category: "ESP32", tags: ["ESP32", "Wi-Fi", "Web"], difficulty: "INTERMEDIATE",
    icon: "📡", artColor: "#bb91ff", glow: "#35235d",
    description: "Explore how an ESP32 can host a small local webpage. Use a low-voltage LED circuit and keep your network credentials private.",
    parts: ["ESP32 development board", "USB data cable", "LED and suitable resistor, or the board's built-in LED if supported", "2.4 GHz Wi-Fi network"],
    steps: ["Install ESP32 board support in Arduino IDE.", "Confirm the LED pin for your exact ESP32 board.", "Add your Wi-Fi name and password locally; never publish them in shared code.", "Upload and open the serial monitor to find the local address.", "Test only on a trusted local network."],
    filename: "esp32_wifi_led.ino",
    code: `// ESP32 Wi-Fi project starter
// This starter checks the board's LED pin.
// Add a WebServer only after confirming Wi-Fi setup.
// Do not publish Wi-Fi passwords in a public repository.

#ifndef LED_BUILTIN
#define LED_BUILTIN 2
#endif

void setup() {
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.println("ESP32 starter ready");
}

void loop() {
  digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
  delay(500);
}`
  },
  {
    id: "line-follower", number: "05", title: "Line-Following Robot",
    category: "Sensors", tags: ["Arduino", "IR Sensor", "Robotics"], difficulty: "INTERMEDIATE",
    icon: "〰️", artColor: "#ff7dba", glow: "#5b2348",
    description: "A small robot follows a dark track using infrared reflectance sensors. Sensor outputs and thresholds depend on the module you use.",
    parts: ["Arduino Uno or compatible board", "Two or more IR line-tracking sensors", "Motor driver", "DC gear motors and chassis", "Battery pack"],
    steps: ["Mount the sensors close to the floor and in front of the wheels.", "Read the sensor values over Serial Monitor on both dark and light surfaces.", "Choose thresholds based on your readings.", "Implement steering corrections using your motor driver.", "Test on a high-contrast track and adjust sensor height."],
    filename: "line_follower.ino",
    code: `// Line follower — sensor reading starter
// Check whether your sensor output is analog or digital.

const int LEFT_SENSOR = A0;
const int RIGHT_SENSOR = A1;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int leftValue = analogRead(LEFT_SENSOR);
  int rightValue = analogRead(RIGHT_SENSOR);

  Serial.print("Left: ");
  Serial.print(leftValue);
  Serial.print(" | Right: ");
  Serial.println(rightValue);

  // Use measured values to determine steering logic.
  delay(100);
}`
  },
  {
    id: "ultrasonic-radar", number: "06", title: "Ultrasonic Distance Scanner",
    category: "Sensors", tags: ["Arduino", "HC-SR04", "Servo"], difficulty: "BEGINNER",
    icon: "📟", artColor: "#6fb5ff", glow: "#163d69",
    description: "Measure distance with an ultrasonic sensor and view readings in the Serial Monitor. A servo can be added later for a scanning display.",
    parts: ["Arduino Uno or compatible board", "HC-SR04 ultrasonic sensor", "Jumper wires", "USB cable", "Optional compatible servo with a suitable power supply"],
    steps: ["Wire TRIG and ECHO to the chosen digital pins.", "Open the Serial Monitor at the sketch's baud rate.", "Check readings at several known distances.", "If adding a servo, verify its current needs and use an appropriate supply.", "Keep the sensor away from moving wheels and loose wires."],
    filename: "ultrasonic_scanner.ino",
    code: `// HC-SR04 distance measurement starter

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(3);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000UL);
  if (duration == 0) {
    Serial.println("No echo detected");
  } else {
    float distanceCm = duration * 0.0343 / 2.0;
    Serial.print("Distance: ");
    Serial.print(distanceCm);
    Serial.println(" cm");
  }
  delay(250);
}`
  }
];
