# CreatorsHub Monorepo

Welcome to the CreatorsHub platform repository. This monorepo houses the full-stack application code, structured into a backend API and a frontend client.

## 📦 Project Structure

### 🖥️ [Frontend](./frontend/README.md)

The user interface built with Next.js 16, React 19, and Tailwind CSS. It handles all user interactions, dashboards, and data visualization.

- **Key Tech**: Next.js, Tailwind CSS, Framer Motion, Lucide React.
- **Docs**: See `frontend/README.md` for setup and details.

### ⚙️ [Backend](./backend/README.md)

The RESTful API server built with Node.js and Express. It manages data persistence, authentication, and business logic.

- **Key Tech**: Node.js, Express, MongoDB, Cloudinary.
- **Docs**: See `backend/README.md` for API endpoints and configuration.

## 🚀 Quick Start

To get the entire platform running locally:

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/onerandomdevv/creatorshub.git
    cd creatorshub
    ```

2.  **Start Backend**:

    ```bash
    cd backend
    npm install
    npm run dev
    ```

    _(The backend runs on port 5000 by default)_

3.  **Start Frontend** (in a new terminal):
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    _(The frontend runs on port 3000 by default)_
