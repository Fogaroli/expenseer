# Capstone II Project Proposal

This project proposal describes the full stack application to be developed as the second capstone project for the Springboard Software Engineering track course. The project should cover the technologies and tools taught in the second half of the course.

The final product will consist of a backend API connected to a database an providing information for a frontend application to provide personal financial tracking features for its users.

The technologies and tools planned for this project is as follows:

Backend:

- Developed in Node.js using Express.
- Postgresql database using node-pg to connect the Express application to the database.
- External API connection using Axios.
- User authentication and authorization using JWT.

Frontend:

- Developed using React.
- State data management using Redux.
- Styling using Bootstrap or Material UI (To be evaluated at the time of the project).
- Financial chart build library TBD (Similar to Rechart).

## Project Summary

The project intends to build a Personal Finance Tracker. This tool will be used by any person to better plan and control its finances and expenditures, providing tools to visualize current status and historical expenses.

Access to the tool will be controlled by password and users will have access to private spaces where they will be able to define budgets for different type of expenses and financial planning, budges could be set as monthly, annual or per a specific event (e.g. a special celebration, vacation planning).

Once planned the users can log expenses and deposits against budgets, allowing them to monitor and control such expenses and record information useful for future planning.

Additionally users would have access to a financial dashboard and financial reports, where they could visualize historical data and better understand their expenses profile for informed decisions and financial education.

This tool could be used by any person, from teenager and yong adults to learn and practice financial control up to experienced people to have better control and planning of their finances.

## Functionality details

The backend application will create a API interface, which will be used to store and read details financial data from its users. Access to data will be controlled using JWT.

There will be no public data access to the API endpoints.

The Backend will also connect to external public API to collect daily exchange rates, and current stock market information and make it available to be read by the user interface (Frontend).

> TBC: The backend could generate SMS or Email notifications for specific thresholds related to users expenses, to notify users when their budget is running out.

On the frontend application, once the users are logged in, they would have access to a dashboard showing their current financial status, with aggregated budged, savings and expenses. The dashboard will react pre-configured budgets in order to show the complete information.

Once the user navigates through the application they can edit or create financial budgets that could be split among custom categories, which would behave like a balance, that could be set as monthly, early or for specific events. The budget could also be defined as an expense budget or a savings budget representing either a source for expenses (which would withdrawal from the defined expense budget) or a target for financial deposits (which would accruing for the defined savings budget).

A second tab on the frontend application would allow users to log expenses against pre-defined budgets (and associated categories) and monitor the remaining balance on such budget. For savings it would track deposits and indicate the balance reaming to reach the desired savings budget.

> TBC: The user could also see a list of previous recorded expenses for each budget or category, being able to reassign expenses, the uses of drag and rop features could be investigated to provide a better user experience (Drap and drop might be too complex for a mobile environment? Maybe limited to desktop rendering?)

The third tab would provide access to multiple financial charts for easy visualization of the budgets, with planned and current status, along with historical data for easy checking of how much was spent on each type of expense.

The charts would provide filters to allow users to define which type of data they want to see before rendering the chart.

>TBC: The frontend application should provide means for users to save their favorite report, which will be automatically generated once the user navigate to the report tab, without the need to adjust the filters at every visit.

> TBC: The application would allow exporting financial data to a CSV file for further processing on the user preferred tool. This might require research common formats for easy integration to external tools.

## Internal Structure

The product will have all data stored in a postgres database. Database access will be done by the backend application. Database will be stored on an external database hosting platform.

The backend API will be fully developed in Node.js using Express, the application should provide a login endpoint for users to  register and login. The login endpoint will provide a JWT key to be used on any further request to other endpoints.
Other endpoints will be created as required by the project, starting with a endpoint to read and create budgets, and other to read and record expenses/deposits against existent budgets and a last endpoint to request report data, to be rendered in the frontend.

The Frontend will be fully developed using React. making use of AXIOS to connect to the backend to collect data to be displayed to the user. The application should provide a consistent experience for users accessing it on a desktop browser or on a mobile application.

> TBD: The frontend application will allow to be installed as an application in a mobile device for easy access by the users.

Styling will make user of external libraries like Bootstrap and Material UI, the exact tool is not yet defined.

## Database

This product should have a simple database:

| table: users | Summary |
|---|---|
| id|Primary Key|
|username| unique|
|password| encrypted data|
|First Name||
|Last Name||
|\<profile information>| Profile data to be defined|


| table: budget | Summary |
|---|---|
| id|Primary Key|
|Budget type | enumeration (expenses/savings)|
|Budget period | enumeration (Monthly/Annual/Event)|
|Starting Date | datetime|
|Budget name | |
|Budget value | |
|user_id| Foreign Key (Users)|


| table: expenses | Summary |
|---|---|
| id|Primary Key|
|Expense type | enumeration (expenses/deposit)|
|Expense Date | datetime|
|Expense Description | |
|Expense value | |
|Budget_id| Foreign Key (Budget)|

## Questions:

1. Focus:
    The platform will have backend and frontend functionalities, the exact proportion is still unclear, but the intent is for a full-stack application.

2. Tech Stack:
    The platform will use Node.js with Express, node-pg and axios, along with frontend tools React, Redux, Bootstrap. Database will be based in PostgreSQL

3. Type:
    Web application, with full compatibility to run on small screen devices (mobile phone browser)

4. Goal:
    Design a personal financial tracker for any user to help with financial education and planning, along of providing control and reports for experienced users.

5. Users:
    Any user with independent financial control, using the tool for their daily financial tracking, along with planning for special events (or vacations).

6. Data:
    Currency exchange and stock market information will be extracted from external APIs, this data is later made available for users once the frontend application is run or updated.
    Other data as budgets and expenses will be managed by the internal API developed within the project and accessed by the frontend.
