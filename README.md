# Finmate - Student Edition

Finmate is a comprehensive personal finance tracker designed for students to manage income, expenses, savings goals, and budgets. It provides a user-friendly interface to help students stay on top of their finances and make informed financial decisions.

## Tech Stack

- **Frontend:** React, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (for database and authentication)
- **Routing:** React Router
- **Charts:** Recharts
- **Icons:** Lucide React

## Features

- **Dashboard:** An overview of your financial status, including income, expenses, and savings.
- **Transactions:** Add, edit, and delete income and expense transactions.
- **Goals:** Set and track your savings goals.
- **Budgets:** Create and manage budgets to control your spending.
- **User Authentication:** Secure user authentication with Supabase.
- **Settings:** Customize your profile, currency, and notification preferences.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ExplainHub/Finmate.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Set up your environment variables by creating a `.env` file in the root directory and adding your Supabase URL and anon key:
   ```
   VITE_SUPABASE_URL=YOUR_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

### Running the Application

Use the following command to run the development server:

```sh
npm run dev
```

This will start the application on `http://localhost:5173`.

## Available Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the code using ESLint.
- `npm run preview`: Serves the production build locally for preview.

## License

Distributed under the Apache-2.0 License. See `LICENSE` for more information.