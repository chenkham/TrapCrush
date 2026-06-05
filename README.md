# TrapCrush 💘

TrapCrush is a modern, interactive web platform built to help users create beautiful, customized, and animated single-page experiences (like digital love letters, date proposals, or anniversary surprises) to share with their partners.

## 🌟 Features
- **Interactive Wizard**: A beautiful step-by-step editor to build customizable pages.
- **Auto-Save Drafts**: Never lose your progress. The wizard automatically saves your state locally.
- **Premium Themes & Animations**: Built with TailwindCSS and Framer Motion for buttery-smooth micro-interactions.
- **Secure Authentication**: Email/Password and Google OAuth integrations.
- **Spam Protection**: Enforced Email Verification before users can publish content.
- **Cloud Database**: Built on Appwrite Pro for secure, real-time data storage.

## 🛠 Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS, Framer Motion
- **Icons**: Lucide React
- **Backend/BaaS**: Appwrite Cloud (Auth & Databases)

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation
1. Clone the repository
```bash
git clone https://github.com/chenkham/TrapCrush.git
cd TrapCrush
```

2. Install dependencies
```bash
npm install
```

3. Configure Environment Variables
Create a `.env` file in the root directory and add your Appwrite credentials:
```env
VITE_APPWRITE_PROJECT_ID="your_project_id"
VITE_APPWRITE_DATABASE_ID="your_database_id"
VITE_APPWRITE_PAGES_COLLECTION_ID="pages"
```

4. Run the Development Server
```bash
npm run dev
```

## 🔐 Appwrite Setup
To self-host the backend, you must create a project in Appwrite with the following structure:
- **Database**: Create a database and update `VITE_APPWRITE_DATABASE_ID`.
- **Collection**: Create a `pages` collection.
- **Attributes**:
  - `user_id` (String, size 50, required)
  - `slug` (String, size 50, required)
  - `purpose` (String, size 50, required)
  - `theme` (String, size 50, required)
  - `sender_name` (String, size 100, required)
  - `recipient_name` (String, size 100, required)
  - `target_ratio` (String, size 50, required)
  - `screens` (String, size 100000, required)
  - `has_been_opened` (Boolean, default: false)
  - `created_at` (Datetime, required)

## 📄 License
This project is proprietary and confidential.
