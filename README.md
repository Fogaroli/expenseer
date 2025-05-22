# Expenseer

Expenseer is a full stack application for personal finance tracking. The application allows new and experienced users to plan and control their financial expenses, promoting financial education and assisting users to achieve their goals.

Users are able to define multiple budgets with a target value and expense categories. For every expense logged in the tool, the user can assign a budget and a category.

With the information loaded on the system the user can have access to dashboards and expense history to better understand the expenses and how they fit against their financial goals.

## Where to find it

This application is currently deployed in 2 environments:

1. Production

Production environment holds the code from the **Main** branch, server can be accessed here:  
[https://expenseer.fogaroli.freeddns.org](https://expenseer.fogaroli.freeddns.org)

Direct access to the API is also possible using the address below. Feel free to use the [Postman Collection file](./src-backend/Expenseer.postman_collection.json) from the src-backend folder for easy access to the API routes.
https://expenseer.fogaroli.freeddns.org/api

2. Development

Development environment holds the code from the branches **Develop-Backend** and **Develop-Frontend**. This environment is intended for integration tests and validation before being deployed to production.
[https://dev.expenseer.fogaroli.freeddns.org](https://dev.expenseer.fogaroli.freeddns.org)

> NOTE: Dev server url is not included in th ssl certificate, expect notification from the browser that site is not secure.

Direct access to the API is also possible using the address below.
https://dev.expenseer.fogaroli.freeddns.org/api

## Whats in the box

The fullstack application is developed in Javascript, details of the tools and libraries used in this project can be found below.

The project implements CI/CD workflows, which are designed using Github workflow on ubuntu runners for unit testing and frontend compilation. Deployment is done on self-hosted solution.

### Database

This project uses Postgresql database to store all the information provided by the user, which includes user profile, budgets and category definition, along with all expense logs.
Data from this database is used to compile dashboard with aggregated data to the users.
Database details can be found [here](./documentation/database.md)

### Backend

The backend application provides a REST API interface to the frontend, providing access to information stored in the database and to externals APIs. It should be the single point of contact from the frontend application.

The backend application interfaces with 2 external API to collect stock market value and currency exchange rates. These information are available to users and are updated on demand when new data is requested by the frontend.

The technologies used in the backend are:

- Node.JS
- Express
- Node-pg
- JWT
- JSON Schema
- Axios

### Frontend

The frontend application is developed using the single page concept, providing a single and optimized workflow for users to visualize past data and record new inputs on budgets and expenses.

The application is developed with the mobile first idea, providing similar experience while navigating on the mobile or desktop. With the exclusion of few components where the amount of data available on the desktop is extended to make use of a wider navigation window.

The technologies used in the frontend are:

- Vite
- React
- React Router
- Redux
- Axios
- MaterialUI
- JWT

## Setting up yourself

If cloning this repository, follow the instructions below to get it working locally.

### Database

Either install a local copy of Postgres (recommended) or create a new database on a externally hosted solution (e.g. Supabase).
Once the database is created, use the [database structure file](./src-backend/expenseer.sql) to create the tables and relationships required by the application.

### Backend

Create a **.env** file in the **src-backend** folder with the basic information required by the backend application. The file [**templatenv**](./src-backend/templateenv) contains a sample of the required content for this environment file. The application will not launch properly with any of the parameters missing, make sure they are available and correct.

Make sure you have **node.js** with **npm** (other package manager are fine, just adapt the commands below accordingly) installed in your system and navigate to the **src-backend** folder.

Run:  
`npm install`  
`npm run dev`

Once started the backend application should print to the console the current tcp port it is running on.

To run Unit tests use:  
`npm test`

### Frontend

Similar to the backend, create a env file in the **src-frontend** folder a [**templatenv**](./src-frontend/templateenv) file is also available for the frontend. The only required environment variable is the URL for the running backend application. If running on the same machine use localhost:<port> use the port number where the backend is listening for requests.

If running both applications locally make sure the tcp port form the backend do not conflict with the tcp port defined in the vite config file [here](./src-frontend/vite.config.js).

Make sure you have **node.js** with **npm** (other package manager are fine, just adapt the commands below accordingly) installed in your system and navigate to the **src-backend** folder.

Run:  
`npm install`  
`npm run dev`

The application should print in the console the url to connect to it using your preferred browser.
The frontend application is created using Vite, which support Hot Module Replacement, feel free to keep the server running while working on the project.

To build the applicaton use:  
`npm run build`

This command will generate files in the `/dist` folder. The data can be copied to a web server application or reverse proxy.

## Using he App

Expenseer is build to be simple and intuitive, but it is fine if you feel you need some instructions on where to start.

The application is build to generate aggregated data from logged expenses. Each expense require a Budget and a Category. Start by creating those, navigate to the Budgts menu and add as many budges as you would like, for each budget set the amount $ to be your expense limit every month. After that navigate to the Category menu and add categories as you see relevant. Categories could be associated to types of expenses, bank accounts to track where the expense was withdraw or any other logic way that will help you stay organized.

After that just keep logging all your expenses, use the correct budget and category for each expense. Navigate to the dashboards menu for a quick view of the status of each budged. Enter each budget to have access to more detailed information including a historic chart of the expenses against that budged for the last 6 month.

For convenience, the application offers access to stock values and currency exchange under the Indexes menu. On the stocks page, search for stocks based on stock symbol or company name. Select the pin icon to add the stock to your tracked stocks. Every time you visit this page you will get updated stock information. Currency exchange rates are available in the exchange page, where you can select a currency pair and check current rate, use the pin icon to add the exchange par to your tracked list and get updated information every time you visit the page.

> NOTE: In order to reduce excessive requests to the external APIs (offering Stock and exchange information) the data is only updated once a hour.

## Why Expenseer

This application is quick and easy to use, what makes it a great alternative for the heavy weight apps available.

This application was developed as the Capstone Project for Springboard Software Engineering Career Track course and includes some the technologies and tools learned in the course.

## Contributions

At this moment Expenseer is not accepting any code contributors, but we do value your feedback.
Feel free to open new issues in the Github portal to report bugs and suggest improvements.
