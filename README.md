# 🐓 Poultry Farm E-Commerce & Admin Dashboard (Abu Imran)

A complete, mobile-first e-commerce solution built specifically for a poultry farm in Algeria. This repository contains both the customer-facing storefront and the internal administrative dashboard, streamlined for a Cash on Delivery (COD) business model.

## 🎯 Overview

This project is a dual-application workspace (monorepo style) designed to handle end-to-end poultry sales:

1. **Storefront:** An elegant, RTL-optimized Arabic interface for customers to browse breeds, book hatching services, and place orders easily.
2. **Admin Dashboard:** A secure control panel for farm management to track orders, update statuses, and manage inventory.

## ⚙️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **Design & UI/UX:** Custom mobile-first design, RTL layout.

## ✨ Key Features

- **Cash on Delivery (COD) Workflow:** Frictionless checkout process tailored for emerging markets.
- **Real-Time Alerts:** Instant Telegram notifications sent to the admin the moment a customer places an order.
- **Seamless Database Integration:** Supabase handles all relational data between clients, orders, and products.
- **Modern UI/UX:** High-contrast, accessible, and intuitive design optimized for mobile users.

## 📂 Project Structure

This repository is divided into two distinct Next.js applications:

```text
/ (Root)
├── store-front      # High-performance customer website (Next.js Server Components)
└── admin-dashboard  # Secure operational control center (Bento Grid UI)
```

## 🛠️ Advanced Architecture (2026 Standard)

- **Architecture:** Next.js App Router with full **Server Component** implementation for optimized performance.
- **Internationalization:** custom `i18n` engine with dynamic RTL/LTR synchronization across AR, FR, and EN.
- **Security:** Hardened **Supabase RLS** policies and transactional RPC functions.
- **UI/UX:** Framer Motion micro-interactions, layered Glassmorphism, and optimized Bento Grid layouts.
- **Reliability:** Automated production build verification and strict TypeScript enforcement.
