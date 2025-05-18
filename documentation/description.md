# Expenseer

The Expenseer project is intended to cover all content given in the second half of the springboard software engineering career track course.

The project is split into a backend application developed in node.js + Express and a frontend application developed in React.

Details of the tools and libraries used in this project can be found below.

The project implements unit testing and CI/CD workflows, which will de designed in Github and the chosen deployment infrastructure (under evaluation).

## Database

This project will use a Postgresql database to store all the information provided by the user, which includes user profile, goals/budgets/savings definition, along with all expenses/savings logs.
Data from this database will be use to compile reports and notifications to the users (notifications still under consideration).

## Backend

The backend application should provide an API interface to the frontend application to access information stored in the database and on externals APIs. It should be the single point of contact from the frontend application.

The technologies planned to be used in the backend are:

- Node.JS
- Express
- Node-pg
- JWT
- JSON Schema
- Axios

## Frontend

The frontend application should provide a single page application for user interface, providing a single and optimized workflow for users to visualize past dat and record new inputs on budgets/savings and expenses.

The technologies planned to be used in the frontend are:

- Vite
- React
- React Router
- Redux
- Axios
- MaterialUI
- JWT

## Additional information

Additional to the tools described on the items above, this application should implement unit tests developed using Jest and react-testing-library.
