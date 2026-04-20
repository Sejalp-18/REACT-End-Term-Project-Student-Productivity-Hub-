# Student Productivity Hub

Student Productivity Hub is a production-style React application for college students who need one place to manage assignments, study planning, and academic progress.

## Problem Statement

Students often juggle multiple classes, deadlines, and study goals across scattered tools like notes apps, messaging groups, LMS portals, and spreadsheets. This project solves that problem by giving students a focused workspace where they can track assignments, plan study sessions, and understand their progress by subject.

## Core Features

- Authentication flow with login and signup
- Protected routes for authenticated users
- Assignment CRUD with priority, deadlines, and status tracking
- Study planner CRUD for focused learning sessions
- Dashboard analytics for completion rate, overdue items, and study patterns
- Firebase Auth + Firestore integration, with demo-mode fallback when env keys are not configured

## React Concepts Covered

- Functional components
- Props and component composition
- `useState`
- `useEffect`
- Conditional rendering
- Lists and keys
- Lifting state up
- Controlled components
- React Router
- Context API
- `useMemo`
- `useCallback`
- `useRef`
- `React.lazy` and `Suspense`

## Folder Structure

```text
src/
  components/
  context/
  hooks/
  pages/
  services/
  styles/
```

## Tech Stack

- React
- Vite
- React Router
- Recharts
- Firebase Authentication
- Cloud Firestore
- LocalStorage demo fallback

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Connect Firebase by adding a `.env` file:

   ```bash
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. In Firebase Console:

- Enable `Authentication` and turn on the `Email/Password` sign-in provider
- Create a `Cloud Firestore` database in production or test mode
- Add the rules from [firestore.rules](/Users/sejal/Documents/Codex/2026-04-20-end-term-project-submission-guidelines-course/firestore.rules)

5. Start the app:

   ```bash
   npm run dev
   ```

## Suggested Demo Flow

1. Create a new account
2. Add assignments with deadlines and priorities
3. Update assignment status
4. Plan study sessions
5. Show dashboard insights and upcoming deadlines

## Future Improvements

- Add reminder notifications
- Add semester calendar view
- Add collaboration for team study groups
