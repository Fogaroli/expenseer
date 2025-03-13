```Mermaid

erDiagram
    User ||--|{ Budget : "One to Many"
    Budget ||--|{ Expenses : "One to Many"
    User }|--|{ User_Exchange : "Many to Many"
    User }|--|{ User_Stock : "Many to Many"

    User {
        int id PK
        string username
        string password
        string first_name
        string last_name
        string email
        string image_url
    }
    Budget {
        int id PK
        string name
        enumeration category
        number amount
        text description
        int userId "Foreign key (User table)"

    }
    Expenses {
        int id PK
        string name
        enumeration category
        number amount
        text description
        int budgetId "Foreign key (Budget table)"
    }
    Exchange {
        int id PK
        string currency1
        string currency2
        number rate
        datetime lasUpdate
    }

    User_Exchange {
        int userId PK "Foreign key (user table)"        
        int exchangeId PK "Foreign key (Exchange table)"        
    }

    Stock {
        int id PK
        string reference
        text description
        number value
        datetime last_update
    }

    User_Stock {
        int userId PK "Foreign key (user table)"        
        int stockId PK "Foreign key (Stock table)"                         
    }
```