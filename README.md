# Checklist Checker

Checklist Checker is a web application designed to help users manage, track, and verify event activities through checklist functionalities. Built with Next.js, Convex, and other modern tools, the project focuses on simplifying event activity tracking.

## Installation

To set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/Frenagon/checklist-checker.git
   # or SSH
   git clone git@github.com:Frenagon/checklist-checker.git
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   Create a `.env` file based on `.env.example` and provide the necessary values.

   ```env
   CONVEX_DEPLOY_KEY=your_key
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

## Structure

- **Frontend with Next.js:** Pages are organized under `app/`.
- **Server Logic:** Convex-based functions for server-side logic in the `convex/` directory.

## Deployment on Vercel

To deploy the application on Vercel:

1. Push changes to a branch connected to Vercel.
2. Preview deployments will use the `seedPreviewDeployment` API for data initialization.
