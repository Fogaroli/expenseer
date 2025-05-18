# Capstone Project II

## Project Ideas

Below there are 3 project ideas. Each idea consist of a fullstack application that will be developed using the tools learned on the second half of the SpringBoard Software Engineering Track.  
The idea selected will evolve to a project proposal, which further details will be added, providing an in depth view of the project.

The ideas below were prepared for evaluation of the Course Mentor in order to provide guidance and select the best option to proceed for further steps.

### Idea 1

The first project idea consist of a student companion web application.  This app would provide simple tools for usage at a school environment, including a to do list, a calendar and a grade tracking page.

- For the calendar, users of this application would be able to load important events (e.g. Assignment due dates, tests, presentations), which could be used on organization and planning.
- The To Do list would allow users to track pending activities, with an associated status (e.g. open, ongoing, review, done) and a due date. The list could be color coded based on the remaining days to be completed.
- The grade tracking would allow easy recording and checking grades from tests, presentations, assignments. This page could calculate average grade and provide a GPA based on the course information.

For this application a backend API would be created for the 3 endpoints, ToDo, Calendar and Grades which would be accessed by the front end application.
An external API would be used to generate SMS or E-mail reminders to the user for fast approach due dates or calendar events.

There are several applications online to handle todo list with calendar events, this project would intend to create a tool with simple and fast interface for everyday usage without distractions, exercising most of the features
of a fullstack application.
Additional tools could be added to the application given time availability.

References:

API to send SMS and E-mail:  [Twilio](https://www.twilio.com/en-us)  
API to send E-mails: [MailJet](https://www.mailjet.com/)

### Idea 2

The second idea consists of a personal finance tracker. This application would allow users to define financial budgets for different types of expenses and record expenditures against defined budgets.  
The tool would be able to generate charts and summary reports monthly with the expenses logged and trends based on past information.

The application would provide 3 main interfaces:

- The first would allow users to register financial budgets for different types of expenses, budgets periods would be adjustable to a single month, multiple months, or annual.
- Second would accept expenses input, registering the value and type of expense and the associated date. Providing feedback of the available balance.
- The third interface would provide reports of the expenses filtered by type of expense or period, among other reports that provide insightful information to the user.

For this application a backend API with 2 end points, budgets and expenses would be developed and used by the front end to generate the appropriate view for the user.  
An external API would be used to convert currency. Additional features like stock market updates could be provided using external APIs.

Although financial control applications exist int eh market, this tool would not be integrated to any bank, it would behave as a simplified tool to load expense information on the daily usage, to promote financial awareness and control.

References:

Stock market data API: [Finage](https://finage.co.uk/product/stock)

### Idea 3

The third idea consists or a news aggregator web application. This application would allow users to select multiple news sources to receive a feed of the latest news from such sources.  
The user would then be able to read the information, mark it as favorite or store it for reading later. At anytime the users would be able to pick up the news stored for future reading or open stories saved as favorites.

The application would provide means to update and browse the news feed, change teh news sources, search news for specific subjects.
Additionally a profile page would list all articles marked as favorites and articles marked to be read later.
Additionally a notification service could be set in order to notify the user if any new article is published based on a specific query or subject provided by the user.

External APIs would be used to collect news information, each source would allow being activated/deactivated for each user.

References:

API to collect news from ultiple sources: [NewsAPI](https://newsapi.org/)
