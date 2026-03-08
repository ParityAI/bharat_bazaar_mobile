# BharatBazaar AI

> **Smart Kirana Store Management** — AI-powered inventory and billing for Indian retail store owners.

> **Note:** This project is currently under active development. Features and APIs are subject to change.

[![Build Status](https://github.com/ParityAI/bharat_bazaar_mobile/actions/workflows/build-apk.yml/badge.svg)](https://github.com/ParityAI/bharat_bazaar_mobile/actions)
[![Expo SDK](https://img.shields.io/badge/Expo_SDK-54-blue)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB)](https://reactnative.dev)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## Overview

BharatBazaar AI is a mobile-first application designed specifically for Indian Kirana (retail) store owners. It leverages AI to simplify day-to-day operations like inventory tracking, bill scanning, invoice generation, and pricing management — all from a single app.

## Web App

We have a mobile application for BharatBazaar AI.

- **Repository**: [Bharat Bazaar](https://github.com/m-zest/bharat_bazaar_v2.4.8)
- **Live Preview**: ([https://d2a5rnm0qdxhtx.cloudfront.net](https://d3j4u51h5o0dhm.cloudfront.net/)

## Features

- **AI Bill Scanner** — Scan wholesale bills using the device camera to auto-update inventory
- **Smart Inventory Management** — Track stock levels with low-stock alerts and category-based organization
- **Invoice Generator** — Create GST-compliant invoices instantly
- **AI Assistant (Munim-ji)** — Voice-enabled AI assistant for store operations and queries
- **Dynamic Pricing** — Manage and update product pricing with margin calculations
- **Notifications** — Stay informed about stock levels, orders, and store activity
- **Offline Support** — Core functionality works without internet connectivity
- **Localization** — Hindi and English language support, UPI-ready, GST-compliant

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | React Native 0.81 + Expo SDK 54    |
| Language     | TypeScript                          |
| Navigation   | Expo Router (file-based routing)    |
| Storage      | AsyncStorage (local persistence)    |
| Camera       | expo-camera (bill scanning)         |
| UI           | Custom components + React Native    |
| Platform     | Android, iOS, Web                   |

## Project Structure

```
frontend/
  app/
    (tabs)/           # Tab-based navigation screens
      index.tsx       # Dashboard / Home
      chat.tsx        # Munim-ji AI Assistant
      invoice.tsx     # Invoice generation
      pricing.tsx     # Price management
      scanner.tsx     # Bill scanner
    auth.tsx          # Authentication
    inventory.tsx     # Inventory management
    notifications.tsx # Notifications
    onboarding.tsx    # First-time user setup
    settings.tsx      # App settings
  assets/             # Images, icons, fonts
  components/         # Reusable UI components
  constants/          # App constants and config
```

## Getting Started

### Prerequisites

- Node.js 22+
- Yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
# Clone the repository
git clone https://github.com/ParityAI/bharat_bazaar_mobile.git
cd bharat_bazaar_mobile/frontend

# Install dependencies
yarn install

# Start the development server
npx expo start
```

### Running on Device

```bash
# Android
npx expo start --android

# iOS
npx expo start --ios

# Web
npx expo start --web
```

### Demo Access

Use **Quick Demo Login** or enter:
- Phone: `9876543210`
- OTP: `123456`

## Web Demo

Try the live web prototype: [bharat-bazaar-mobile.vercel.app](https://bharat-bazaar-mobile.vercel.app)

## Building

### Web Export

```bash
npx expo export --platform web
```

### Android APK

APK builds are automated via GitHub Actions on tag pushes (`v*`) or manual workflow dispatch. See `.github/workflows/build-apk.yml`.

## Contributing

This project is under active development. Contributions, issues, and feature requests are welcome.

## Author

**Mohammad Zeeshan** — [zeeshanm8313@gmail.com](mailto:zeeshanm8313@gmail.com)

## License

This project is licensed under the MIT License.
