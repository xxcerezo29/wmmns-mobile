# Waste Management with Mobile Notification System for CENRO

This project repository is for the mobile app of **Waste Management with Mobile Notification System for CENRO**

See repo: https://github.com/FutureProgrammer-Inc/wmmns


## Table of Contents
1. [Introduction](#introduction)
2. [Technologies Used](#technologies-used)
3. [Mobile Application](#mobile-application)
    - [Installation](#installation)
    - [Configuration](#configuration)
    - [Usage](#mobile-usage)

4. [License](#license)

## Introduction

The **Waste Management with Mobile Notification System for CENRO** provides both a web and mobile platform to improve waste management in Santiago City. It addresses several problems like missed collection hours, redundant routes, poor communication, and lack of tracking for garbage truck itineraries.

## Technologies Used

### Mobile Application:
- **Ionic Vue** (Mobile development)
- **Capacitor** (Native mobile functionalities)
- **Tailwind CSS** (For styling)
- **Leaflet.js** (Interactive map integration)
- **Axios** (API requests)

---

# Mobile Application

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/FutureProgrammer-Inc/wmmns-mobile

2. **Install Dependencies**:
    ```bash
    npm install

3. **Build the Ionic App**:
    ```bash
    ionic build

4. **Add native platforms: For Android:**: (note: in this repo android is included)
    ```bash
    ionic capacitor add android
    ```
    For iOS:
    ```bash
    ionic capacitor add ios

5. **Run on a device or emulator: For Android::**: (please find tuto. about emu or usb debugging)
    ```bash
    ionic capacitor run android
    ```
    For iOS:
    ```bash
    ionic capacitor run ios

### Configuration

1. **ENV**: Configure your `.env` file with API andress for the `wmmns web app`.
    ```bash 
    VITE_WMMNS_API_URL="THE WEB APP ADDRESS"

1. **Notification**: See documentation of ``@capacitor/push-notifications`` for configuration

### Mobile Usage

#### For Residents:
- **Login**: Residents can log in to the app using their credentials.
- **View Collection Schedule**: Access the garbage collection schedule for their barangay.
- **Missed Collection Report**: Submit a report for any missed garbage collection.

- **Receive Notifications**: Receive notifications about garbage truck arrival times or changes in the schedule.

#### For Garbage Truck Drivers:
- **Login**: Garbage truck drivers can log in using their credentials.
- **Route Plans**: View their assigned route plan for the day.
- **Real-time Location**: Allow tracking of their current location for monitoring by CENRO and barangay officials.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
