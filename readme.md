
# Ebook Library Web App Concept

A web based application that allows user create a library of ebooks using publicly available books or using their own submissions. It uses node.js as the backend to connect to an online PostgresSQL and to also enhance the frontend through the use of EJS to serve web pages with dynamic contents. 


## Features

- Book Catalog:
    - Users can browse, search, and filter through available eBooks based on categories, authors, genres, or other metadata.  
- User Library:
    - A personalized section where users can view, edit or delete their owned books.

## Backend Architecture and Dynamic Query Handling
-  **Node.js, Express and PG**
    - The backend of the application is built using Node.js and Express. PostgreSQL is integrated for data management, with the pg library used to handle database queries. The backend serves as the bridge between the frontend and the database, managing routing, data processing, and client requests.
- **Render and PostgresSQL**
    - This setup enables collaboration across multiple machines without the need for local database configurations. Hosting on Render ensures consistent access and simplifies the development workflow. 
- **EJS and Dynamic Contents**
    - The EJS (Embedded JavaScript) library is used to render dynamic content on web pages. Partial views are employed for modularity, allowing HTML code to be refactored into separate files. EJS dynamically inserts values queried from the PostgreSQL database, providing flexible and data-driven front-end content.
- **Dynamic Queries with Builders**
    - pecial functions are employed to generate custom queries based on specific conditions. This approach allows for flexibility in query construction while avoiding an excessive number of specialized functions, helping to maintain cleaner and more maintainable code.

## Schema Structure
- `users` Table
    - Contains information about users, such as user ID, username, email, etc. This table enables user authentication and tracks ownership of books.
- `books` Table
    - Stores key information of a book such as title and ISBN along with a unique ID. It also serves as the central repository for all book data.
- `authors` and `publishers` Tables
    - Each tables stores the name of their respective type and assign a unique id to each to setup a many-to-many relationship with `books` Table, allowing each book to have multiple authors or publishers and vice versa
- `book_copies` Table
    - Sets relationship between `books` and `users` signifying ownership
- `book_authors` and `book_publishers` Tables
    - Sets many-to-many relationship between `books` table and `authors` or `publishers`

## Authors

- [Godwin Florendo](https://github.com/Kozaki09)
- [Melvie Jeanna Abad](https://github.com/vie-yanna)

