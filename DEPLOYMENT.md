# Deployment Instructions

This project is configured to be deployed to Vercel for the frontend and Firebase for the backend services (Authentication, Firestore).

## Vercel Deployment (Frontend)

1.  **Push to a Git Repository:**
    -   Make sure your project is a Git repository and you have pushed it to a provider like GitHub, GitLab, or Bitbucket.

2.  **Import to Vercel:**
    -   Go to the [Vercel dashboard](https://vercel.com/dashboard).
    -   Click "Add New..." and select "Project".
    -   Import your Git repository.

3.  **Configure Environment Variables:**
    -   In the project settings on Vercel, go to "Environment Variables".
    -   Add the Firebase configuration values from your `.env.local` file as environment variables. Make sure to use the same names (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`).

4.  **Deploy:**
    -   Vercel will automatically detect that this is a Next.js project and configure the build settings.
    -   Click "Deploy". Vercel will build and deploy your application.

## Firebase Deployment (Backend)

The Firebase backend consists of Firestore rules and potentially Cloud Functions in the future.

1.  **Install Firebase CLI:**
    -   If you don't have it, install the Firebase CLI globally:
        ```bash
        npm install -g firebase-tools
        ```

2.  **Login to Firebase:**
    ```bash
    firebase login
    ```

3.  **Initialize Firebase in your project:**
    -   Run the following command in your project root:
        ```bash
        firebase init
        ```
    -   Select "Firestore" and "Hosting". For hosting, choose the `out` directory if you were to export the app, but since we are using Vercel, you can skip this or just configure it without deploying.
    -   Link it to your existing Firebase project.

4.  **Deploy Firestore Rules:**
    -   The default `firestore.rules` file allows all reads and writes for authenticated users. You should modify this for a production environment to be more secure.
    -   To deploy the rules, run:
        ```bash
        firebase deploy --only firestore:rules
        ```

---

This setup provides a seamless deployment experience, with Vercel handling the frontend and Firebase providing the backend infrastructure.
