# 🛡️ Plantify Access & Deployment Guide

**Status:** Secured & Deployed
**Last Updated:** February 10, 2026
**Production URL:** [https://plantify-wine.vercel.app](https://plantify-wine.vercel.app)

---

## 🔑 Admin Panel Access
*   **URL:** `/admin/login` (e.g., https://plantify-wine.vercel.app/admin/login)
*   **Email:** `tarunpatidar.agro@gmail.com`
*   **Password:** `Tarun@1998`
*   **Security:** Double-Lock System (Cookie + SessionStorage), 60s Idle Timeout, Auto-Logout on Tab Close.

## 🏪 Vendor Portal Access
*   **Login URL:** `/vendor/login`
*   **Registration URL:** `/vendor/register`
*   **Authentication:** Email + OTP
*   **Demo OTP:** `1234` (Hardcoded for demo/testing)
*   **Security:** Dedicated `plant_vendor_v1` cookie protection.

---

## ⚠️ Important Deployment Note
**Data Persistence (Vercel Demo Mode):**
This application currently uses a local `lib/data.json` file for storing nurseries and products. With Vercel serverless deployment:
*   Any new data added (Products, Nurseries) will **reset** whenever the site redeploys or the server restarts.
*   **Recommendation:** For a production app needing permanent storage, migrate to a cloud database (MongoDB Atlas or Vercel Postgres).

---

## 🛠️ Credential Management
*   **Admin Credentials:** Edit `app/admin/login/page.js`
*   **Vendor OTP Logic:** Edit `app/vendor/login/page.js` & `app/vendor/register/page.js`
