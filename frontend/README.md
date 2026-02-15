# CreatorsHub Frontend

The React/Next.js frontend for the CreatorsHub platform. It features a modern, responsive UI built with Tailwind CSS, Framer Motion for animations, and Lucide for icons.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Validation**: Zod & React Hook Form
- **Charts**: Recharts
- **Utilities**: date-fns, html2canvas, jspdf

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Backend server running (for API calls)

### Installation

1.  Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  Set up environment variables:
    Create a `.env.local` file in the `frontend` directory:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```

4.  Start the development server:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `src/app`: App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/context`: React Context providers (Auth, Theme, etc.).
- `src/lib`: Utility functions and library wrappers.
- `src/types`: TypeScript interfaces and types.
- `public`: Static assets (images, fonts).

## ✨ Key Features

- **Dashboard**: Interactive analytics and overview.
- **Product Management**: Create, edit, and list products.
- **Order Tracking**: View and manage customer orders.
- **Settings**: Configure application preferences.
- **Reporting**: Export data (PDF/Canvas) via `html2canvas`/`jspdf`.
