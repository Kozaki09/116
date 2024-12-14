/* General layout for book details page */
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f9;
}

.container {
    width: 80%;
    margin: 50px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

header {
    text-align: center;
    margin-bottom: 20px;
}

.book-title {
    font-size: 2rem;
    color: #333;
    margin-bottom: 10px;
}

.book-details {
    display: flex;
    justify-content: space-between;
}

.book-info {
    width: 60%;
    padding-right: 20px;
}

.book-info p {
    font-size: 1.2rem;
    margin-bottom: 10px;
}

strong {
    font-weight: bold;
    color: #555;
}

/* Button styles */
.action-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35%;
    padding-left: 20px;
}

button.btn {
    padding: 10px 20px;
    font-size: 1rem;
    color: #fff;
    background-color: #28a745;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button.btn:hover {
    background-color: #218838;
}

button.add-to-library {
    width: 100%;
}

/* 'You own this book' message */
.owned-msg {
    font-size: 1.2rem;
    color: #28a745;
    font-weight: bold;
    text-align: center;
}

/* Back button styles */
footer {
    text-align: center;
    margin-top: 30px;
}

footer .back-btn {
    font-size: 1.1rem;
    color: #007bff;
    text-decoration: none;
}

footer .back-btn:hover {
    text-decoration: underline;
}
