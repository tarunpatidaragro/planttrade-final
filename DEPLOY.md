# Deploying PlantTrade to Production

Since this is a Next.js application, the best and easiest way to deploy it is using **Vercel** (the creators of Next.js).

## Option 1: Using Vercel CLI (Recommended)

1.  **Install the Vercel CLI**:
    Open your terminal in this folder and run:
    ```bash
    npm install -g vercel
    ```

2.  **Login to Vercel**:
    Run the following command and follow the instructions in your browser:
    ```bash
    vercel login
    ```

3.  **Deploy**:
    Run the deployment command:
    ```bash
    vercel
    ```
    - Set up and deploy `c:\Users\FARMKART\Desktop\Antigravity\Plantify\plantify`? **y**
    - Which scope do you want to deploy to? **(Select your account)**
    - Link to existing project? **n**
    - What’s your project’s name? **planttrade**
    - In which directory is your code located? **./**
    - Want to modify these settings? **n**

    Wait for deployment to finish! You will get a production URL (e.g., `https://planttrade.vercel.app`).

4.  **Connect Your Domain (planttrade.in)**:
    - Go to your Vercel Dashboard (online).
    - Select the **PlantTrade** project.
    - Go to **Settings > Domains**.
    - Enter `planttrade.in` and click **Add**.
    - Vercel will give you DNS records (A Record: `76.76.21.21`).
    - Go to your Domain Registrar (GoDaddy, Namecheap, etc.) and add this A Record.

## Option 2: Connecting via GitHub (Automatic Updates)

1.  Create a fresh repository on GitHub.
2.  Push this code to GitHub.
3.  Login to Vercel.com -> "Add New Project" -> "Import from GitHub".
4.  Select your `planttrade` repo.
5.  Click **Deploy**.

**Note for Production:**
Ensure your environment variables (like Database URLs if you add a real DB later) are added in the Vercel Project Settings.
