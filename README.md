# PlantTrade 🌿
**India's Premium Marketplace for Authentic Nurseries & Plants**

PlantTrade (formerly Plantify) is a Next.js-based platform connecting plant lovers directly with trusted nurseries across India. It features a modern, premium design, viral features like "Rescue Plants," and a powerful admin dashboard.

## 🚀 Getting Started (Setup Guide)

Follow these steps to set up the project on your local machine.

### 1. Prerequisites
Ensure you have the following installed:
*   **Node.js** (v18 or higher recommended) - [Download Here](https://nodejs.org/)
*   **Git** - [Download Here](https://git-scm.com/)
*   **VS Code** (Optional, for editing)

### 2. Installation

1.  **Clone the Repository** (or unzip the project folder):
    ```bash
    git clone https://github.com/your-username/planttrade.git
    cd planttrade
    ```

2.  **Install Dependencies**:
    Open your terminal in the project folder and run:
    ```bash
    npm install
    # or
    yarn install
    ```
    This will download all necessary libraries like Next.js, React, and Lucide Icons.

### 3. Running Locally

To start the development server and see the website:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the **PlantTrade** homepage.

---

## 📂 Project Structure

*   **`app/`**: Contains all pages and routes (Next.js App Router).
    *   `page.js`: Homepage.
    *   `layout.js`: Global layout (Header, Footer, SEO).
    *   `admin/`: Admin dashboard and login.
    *   `nursery/[id]`: Individual nursery profiles.
    *   `product/[id]`: Product details page.
*   **`components/`**: Reusable UI components (ProductCard, Header, Footer).
*   **`lib/data.json`**: The "database" file containing all nursery and product data.
*   **`public/`**: Static assets like images (if any).

---

## 🛠 Features

*   **Viral "Rescue Plant" System**: Products marked as `isRescue: true` get special badges and pricing.
*   **Master Admin Dashboard**: Manage nurseries, products, and view stats at `/admin`.
*   **Nursery Finder**: Filter nurseries by location or category.
*   **Direct WhatsApp Enquiry**: "Enquire" buttons link directly to the nursery's WhatsApp with a pre-filled message.
*   **SEO Optimized**: Fully updated metadata for `planttrade.in`.

---

## 🌍 Deployment (Go Live)

To publish your website to the internet, we recommend **Vercel**.

1.  Install Vercel CLI: `npm install -g vercel`
2.  Login: `vercel login`
3.  Deploy: `vercel`

For detailed deployment steps, read [DEPLOY.md](./DEPLOY.md).

---

## 📝 License

This project is proprietary software for **PlantTrade India**.
