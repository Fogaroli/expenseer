```Mermaid

erDiagram
    Users ||--|{ Budgets : "One to Many"
    Budgets ||--|{ Expenses : "One to Many"
    Users }|--|{ User_Exchange : "Many to Many"
    Users }|--|{ User_Stock : "Many to Many"
    Categories ||--|{ Expenses : "One to Many"

    Users {
        string username PK
        string password
        string first_name
        string last_name
        string email
        string image_url
    }
    Categories {
        int id PK
        string name
    }
    Budgets {
        int id PK
        string name
        enumeration type
        number amount
        text description
        int username "Foreign key (User table)"

    }
    Expenses {
        int id PK
        string name
        number amount
        text description
        datetime date
        int category "Foreign key (Categories table)"
        int budget_id "Foreign key (Budgets table)"
    }
    Exchanges {
        int id PK
        string currency1
        string currency2
        number rate
        datetime last_update
    }

    User_Exchange {
        int username PK "Foreign key (Users table)"        
        int exchange_id PK "Foreign key (Exchanges table)"        
    }

    Stocks {
        string reference PK
        text description
        number value
        datetime last_update
    }

    User_Stock {
        int username PK "Foreign key (Users table)"        
        string stock_ref PK "Foreign key (Stocks table)"                         
    }
```