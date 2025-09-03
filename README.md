# School Directory Web Application

> A full-stack web application to add and display a directory of schools, built with Next.js and MySQL as part of a web development assignment.

## ✨ Live Demo

[**View the live project here**](https://school-directory-app.onrender.com)

---

## 🚀 Features

-   **Add School Form**: A polished, responsive form to input school data, including name, address, contact information, and an image.
-   **Input Validation**: The form uses `react-hook-form` for real-time, user-friendly validation.
-   **Image Uploads**: Supports uploading school images, which are stored on the server.
-   **School Gallery**: Fetches and displays all schools from the database in a responsive, e-commerce-style grid layout.
-   **Modern UI/UX**: Styled with Tailwind CSS, featuring a dark theme, a glassmorphism card design, and a dynamic aurora background effect.

---

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Library**: [React](https://reactjs.org/)
-   **Database**: [MySQL](https://www.mysql.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/)
-   **Deployment**: [Vercel](https://vercel.com/)

---

## ⚙️ Getting Started

To run this project locally, follow these steps:

### 1. Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18 or later)
- A running [MySQL](https://www.mysql.com/) server

### 2. Clone the Repository

```bash
git clone [https://github.com/Manjir10/school-directory-app.git](https://github.com/Manjir10/school-directory-app.git)
cd school-directory-app
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up the Database

Connect to your MySQL server and run the following SQL commands:

```sql
CREATE DATABASE schooldirectory_db;

USE schooldirectory_db;

CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    contact BIGINT,
    image TEXT,
    email_id TEXT
);
```

### 5. Configure Environment Variables

Create a file named `.env.local` in the root of the project and add your database credentials:

```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=schooldirectory_db
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
- The form is at `/addSchool`.
- The gallery is at `/showSchools`.
