# UpayPulse AI (Upay_Agent)

<div align="center">
  <img src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" alt="UpayPulse AI" width="800"/>
</div>

## Project Overview
**Problem Statement:** Small and medium enterprises (SMEs) and everyday users often struggle with fragmented financial tools. Merchants lack deep insights into inventory and loan eligibility, while individual users face challenges in managing personal budgets and tracking financial habits.  
**Proposed Solution:** UpayPulse AI is a unified, intelligent financial platform. It leverages a centralized dual-dashboard system that caters to both businesses and customers, powered by an AI assistant that offers real-time, context-aware financial guidance.  
**Main Goal:** To democratize financial intelligence by equipping merchants with automated growth analytics and empowering customers with smart, personalized financial insights—all within a seamless and secure ecosystem.

## Features
- **Dual Dashboard Architecture:** Role-based UI offering tailored experiences for Business (merchants) and Customer (individual users).
- **AI Financial Agent:** An intelligent chatbot integrated directly into the dashboard to answer queries regarding loan eligibility, spending habits, and market trends. 
- **Business Insights:** Real-time analytics for revenue, inventory tracking, and automated risk scoring to help merchants secure credit.
- **Customer Financial Health:** Visual tracking of monthly budgets, personalized savings recommendations, and categorized expenditure breakdowns.
- **How AI is utilized:** The AI components (powered by Gemini) process textual financial queries, analyze simulated transaction data to generate summaries, and predict loan eligibilities by evaluating synthesized risk factors.

## Technology Stack
- **Frontend Framework:** React 18, Vite
- **Programming Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **Icons & UI Components:** Lucide React
- **Data Visualization:** Recharts
- **AI Model/API:** Google Gemini API (for the intelligent financial agent and data insights)

## Requirements
To run this project locally, you must have the following installed:
- **Node.js**: v18.0.0 or higher
- **Package Manager**: `npm` (v9+) or `bun`
- **Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Hardware**: Standard development machine (4GB+ RAM recommended)

## Installation and Setup
Follow these step-by-step instructions to configure and run the project:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MdSadiarRahman/Upay_Agent.git
   cd Upay_Agent
   ```

2. **Install dependencies:**
   Using npm (legacy peer deps required due to dependency resolution):
   ```bash
   npm install --legacy-peer-deps
   ```
   *Alternatively, using bun:*
   ```bash
   bun install
   ```

3. **Configure Environment Variables:**
   Rename the `.env.example` file to `.env` (or create a new `.env` file) and populate it with the required keys (see the Environment Variables section below).

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

## Environment Variables
The project requires the following environment variables. **Do not publish real secret values in the repository.**

Create a `.env` file in the root directory:
```env
# Google Gemini API Key for the AI Agent
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Base URL for the Backend API (if applicable in the future)
VITE_API_BASE_URL=https://api.example.com
```

## Run and Build Commands
- **Start Development Server:**
  ```bash
  npm run dev
  ```
- **Build for Production:**
  ```bash
  npm run build
  ```
- **Preview Production Build:**
  ```bash
  npm run preview
  ```

## Live Deployment URL
The project is continuously deployed via GitHub Actions and hosted on GitHub Pages. 
**Access the live project here:** 
🔗 [https://MdSadiarRahman.github.io/Upay_Agent/](https://MdSadiarRahman.github.io/Upay_Agent/)

## Testing Instructions
To verify and test the implemented features:
1. **Access the Application:** Open the [Live URL](https://MdSadiarRahman.github.io/Upay_Agent/) or run locally and navigate to `http://localhost:5173`.
2. **Login Simulation:** On the login page, you can choose to enter as a "Business" or "Customer".
3. **Explore Business Dashboard:** Verify that the revenue charts render correctly. Interact with the metrics cards and inventory mock data.
4. **Explore Customer Dashboard:** Check the budget trackers, recent transactions, and goal progress.
5. **AI Agent Interaction:** Open the AI Assistant widget (chat icon) and type a financial query (e.g., "What is my loan eligibility?") to test the simulated AI response logic.

## Other Configuration
- **GitHub Pages Configuration:** The `vite.config.ts` is configured with `base: '/Upay_Agent/'` to ensure proper asset routing on GitHub Pages.
- **GitHub Actions Workflow:** Deployment is automated via `.github/workflows/deploy.yml` which triggers on pushes to the `main` or `upay-development` branches. Ensure that GitHub Pages is enabled in the repository settings (Settings > Pages > Source: GitHub Actions) for deployments to succeed.
