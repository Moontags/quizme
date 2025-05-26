# Quiz Game - QuizMe

This is a quiz game application, adapted from the Taitaja 2025 Semifinal assignment. The application allows users to test their knowledge in various subject areas by selecting a category and answering questions.

## Description

QuizMe offers a user-friendly way to play a trivia game. Users can choose their preferred category and answer multiple-choice questions. At the end of the game, the user sees their score.

Future development plans include an admin panel for teachers to manage questions and categories, as well as user authentication for saving scores.

## Features 

* Homepage to start the game.
* Category selection before the quiz begins.
* Multiple-choice questions from different categories.
* Score calculation.
* Display of results at the end of the game.
* Option to play again.

## Technologies Used

* **Frontend:** Next.js (React, TypeScript)
* **Backend (API Routes):** Next.js (Node.js)
* **Database:** Supabase (PostgreSQL) - accessed via Supabase JS Client in API Routes.
    * *(Prisma ORM to be potentially integrated later)*
* **Styling:** Custom CSS (currently inline styles, to be refactored to CSS Modules or similar).

