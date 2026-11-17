# 📮 India Post Smart Challan Generator

An AI-powered, modern web application designed for the **Department of Posts (India)** to streamline and automate the generation of **Post Office Savings Bank (POSB) Pay-in Slips (SB-103)**.

---

## 🌟 Overview

The **India Post Smart Challan Generator** simplifies and speeds up deposit and withdrawal workflows at post office counters. Customers and postal agents can scan their physical passbook or enter details manually to generate official, bilingual/multilingual challan slips ready for printing on standard A4 paper or compact thermal receipt printers.

---

## ✨ Features

- 🌐 **Multilingual Interface**: Full regional language support for **English**, **Hindi (हिन्दी)**, and **Kannada (ಕನ್ನಡ)**.
- 📷 **AI Passbook OCR**: Scan passbooks using your device camera or upload an image to automatically extract:
  - Account Number
  - Account Holder Name
  - Branch / Post Office Name
- ✍️ **Automatic Amount in Words**: Instantly converts numbers into regional currency words (English, Hindi, Kannada).
- 🖨️ **Dual-Copy A4 Print Layout**: Generates pixel-perfect **Customer Copy** and **Post Office Copy** side by side in standard A4 landscape format.
- 📶 **Hardware Thermal Printer Support**:
  - **Bluetooth Thermal Printers**: Direct ESC/POS printing via Web Bluetooth API.
  - **Wi-Fi Network Printers**: Direct IP-based printing over local network.
- 🤖 **Postal Scheme AI Assistant**: Integrated chatbot powered by Google Gemini with live search grounding to answer queries regarding PPF, Sukanya Samriddhi (SSA), Recurring Deposits (RD), and current interest rates.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Bundler & Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI & OCR**: Google Gemini API (`@google/genai`)
- **Hosting**: Vercel / GitHub Pages

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yashaswinim1176/smart-challan-generator.git
   cd smart-challan-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables (Optional for AI OCR & Assistant):
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   > *Note: The core challan generation and manual printing work seamlessly even without an API key.*

4. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Build for production:
   ```bash
   npm run build
   ```
   The built output will be created in the `dist/` directory.

---

## ☁️ Deployment

### Deploying to Vercel

This repository is pre-configured with `vercel.json` for zero-configuration deployment on Vercel.

#### Option 1: Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** > **"Project"**.
3. Import your GitHub repository (`smart-challan-generator`).
4. Framework Preset will automatically detect **Vite**.
5. (Optional) In **Environment Variables**, add:
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API key.
6. Click **Deploy**.

#### Option 2: Vercel CLI
```bash
npm install -g vercel
vercel
```

---

### Deploying to GitHub Pages

A ready-to-use GitHub Actions workflow is included at `.github/workflows/deploy.yml`.

1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Every push to `main` will automatically build and deploy the application.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👤 Author

- **Yashaswini M**
- Email: [yashaswinim1176@gmail.com](mailto:yashaswinim1176@gmail.com)
