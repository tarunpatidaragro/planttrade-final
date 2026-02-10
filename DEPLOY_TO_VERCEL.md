
# Deploying PlantTrade to Vercel

Congratulations! Your PlantTrade application is ready to be deployed. Since you want to keep the Admin Panel secure and hidden, Vercel is a great choice as it handles security and scaling automatically.

## **Step 1: Preparation**
1.  **Codebase:** Ensure your latest code is saved.
2.  **No Frontend Links:** I have already ensured there are NO links to the `/admin` section on the website. The only way to access it is by manually typing `/admin` in the URL bar.

## **Step 2: Deploying via Vercel Dashboard (Easiest)**
1.  Go to [Vercel.com](https://vercel.com) and Sign Up/Login.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your Git repository (if you pushed this code to GitHub/GitLab).
    *   *If you haven't used Git yet, you can initialize it in your project folder:*
        ```bash
        git init
        git add .
        git commit -m "Initial commit"
        ```
    *   *Then push to GitHub.*
4.  In Vercel, select the repository.
5.  **Configure Project:**
    *   **Framework:** Next.js (should be auto-detected)
    *   **Root Directory:** `plantify` (if your code is inside a subfolder, otherwise leave as `./`)
6.  Click **Deploy**.

## **Step 3: Accessing Your Admin Panel**
Once deployed, your website will have a public URL like `https://planttrade-app.vercel.app`.
*   **Public Access:** Visitors can see the homepage but **cannot** find the admin panel.
*   **Admin Access:** You (and only you) can access it by going to:
    `https://YOUR-APP-URL.vercel.app/admin`
*   **Login:**
    *   **Email:** `tarunpatidar.agro@gmail.com`
    *   **Password:** `Tarun@1998`

## **IMPORTANT NOTE: Data Storage**
Currently, the Admin Panel uses a **local JSON file** (`lib/data.json`) to store nurseries and products. Vercel is a "serverless" platform, which means **it does not support saving changes to local files permanently**.
*   **What this means:** You can VIEW all existing data perfectly. However, if you add a new nursery or product via the admin panel on the live site, it might disappear after a few minutes or when the site updates.
*   **Recommendation:** For a fully functional live admin panel where you can add/edit data permanently, we should connect a real database (like **MongoDB** or **Vercel Postgres**) in the future.
*   **For now:** The admin panel works perfect as a **Demo/Prototype** to view data and test the interface.
