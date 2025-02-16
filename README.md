# Chores App

## Overview

The **Chores App** is a simple web application designed to help families manage their household chores. The app allows users to:

- Add new chores with a description.
- Mark chores as complete.
- Add notes about completed chores.
- Display completed chores with the time and date they were completed.
- Delete chores (if not marked as completed).
- View the most recent completed chores.

This app is built using **React** for the frontend, **Express.js** for the backend, and **SQLite** as the database.

## Features

- **Add New Chores**: Allows users to add new chores with a description, which are initially marked as incomplete.
- **Mark Chores as Complete**: Users can mark a chore as complete. Once marked, the chore is moved to the "Completed Chores" section and cannot be edited.
- **Notes for Completed Chores**: After completing a chore, users can add a note about what was done.
- **Date and Time of Completion**: Each completed chore is timestamped with the date and time when it was marked as complete.
- **Delete Incomplete Chores**: Incomplete chores can be deleted from the list if needed.
- **Responsive**: The app is designed to work on both desktop and mobile devices.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: SQLite3
- **UI Components**: Material-UI (MUI)

## Setup and Installation

### Prerequisites

1. [Node.js](https://nodejs.org/) (version 14 or higher)
2. [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/chores-app.git
