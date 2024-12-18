function fillTable(books) {
    try {
        console.log("get books");

        if (typeof books !== "object") {
            throw new Error('Expected books to be an object');
        }

        document.getElementById('loading').style.display = 'none';
        document.getElementById('booksTable').style.display = 'table';

        const tableBody = document.querySelector('#booksTable tbody');
        tableBody.innerHTML = '';

        const viewRows = createViewRows(books);

        length = viewRows.length;
        if (length === 0) {
            document.getElementById('loading').innerHTML = 'No books found.';
            return;
        }

        for (i = 0; i < length; i++) {
            tableBody.appendChild(viewRows[i]);
        }

        
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        console.error('Error fetching books:', error);
    }
}

function createViewRows(books) {
    const rows = [];

    Object.keys(books).forEach(id => {
            const book = books[id];
    
            const row = document.createElement('tr');  
            row.id = 'views_' + id;

                // title columns
            const titleCell = document.createElement('td');
            const titleLink = document.createElement('a');
            titleLink.textContent = book.title;
            titleLink.href = `/get/book?book_id=${book.id}`;
            titleCell.appendChild(titleLink);

                // isbn columns
            const isbnCell = document.createElement('td');
            isbnCell.textContent = book.isbn;

                // authors columns
            const authorCell = document.createElement('td');
            book.authors.forEach((author, index) => {
                const authorLink = document.createElement('a');
                authorLink.textContent = author.name;
                authorLink.href= `author?auth_id=${encodeURIComponent(author.id)}`;

                if (index > 0) {
                    authorCell.appendChild(document.createTextNode(', '));
                }

                authorCell.appendChild(authorLink);
            });

                // publisher columns
            const publisherCell = document.createElement('td');
            publisherCell.textContent = book.publisher.name === 'Unknown' ? '' : book.publisher.name;

                // publication columns
            const publicationCell = document.createElement('td');
            publicationCell.textContent = book.publication === 'Unknown' ? '' :  book.publication;

                // button columns
            const actionCell = document.createElement('td');

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.onclick = () => deleteBook(book.id);

            const trashIcon = document.createElement('span');
            trashIcon.classList.add('material-icons');
            trashIcon.textContent = 'delete';
            deleteButton.prepend(trashIcon);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.type = 'button';
            editButton.addEventListener('click', function() {
                openModal(book);
            })

            actionCell.appendChild(deleteButton);
            actionCell.appendChild(editButton);

            row.appendChild(titleCell);
            row.appendChild(isbnCell);
            row.appendChild(authorCell);
            row.appendChild(publisherCell);
            row.appendChild(publicationCell);
            row.appendChild(actionCell);

            rows.push(row);
        });

    return rows;
}

function openModal(book) {
    const modal = document.getElementById('edit-book-modal');
    const overlay = document.getElementById('modal-overlay');
   // Prefill the modal form fields
    modal.querySelector('#book_id').value = book.id;

    // Title
    modal.querySelector('#title_input').value = book.title || '';
    modal.querySelector('#title_hidden').value = book.title || '';

    // ISBN
    modal.querySelector('#isbn_input').value = book.isbn || '';
    modal.querySelector('#isbn_hidden').value = book.isbn || '';

    // Availability
    modal.querySelector('#availability_input').value = book.availability || 'public';
    modal.querySelector('#availability_hidden').value = book.availability || 'public';

    // Authors
    const authors = book.authors.map(author => author.name).join(', ');
    modal.querySelector('#authors_input').value = authors || '';
    modal.querySelector('#authors_hidden').value = authors || '';

    // Publisher
    modal.querySelector('#publisher_input').value = book.publisher.name || '';
    modal.querySelector('#publisher_hidden').value = book.publisher.name || '';

    // Publication Year
    modal.querySelector('#publication_input').value = book.publication || '';
    modal.querySelector('#publication_hidden').value = book.publication || '';
    
    // Show the modal and overlay
    modal.classList.add('show');
    overlay.classList.add('show');
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('edit-book-modal');
    const overlay = document.getElementById('modal-overlay');
    modal.classList.remove("show");
    overlay.classList.remove("show");
}

// Function to delete a book
async function deleteBook(book_id) {
    try {
        const response = await fetch(`/remove/from_library?book_id=${book_id}`, {
            method: 'DELETE',
        }); 

        console.log(response);
        const result = await response.json();
        console.log(result);

        if (!response.ok) {
            throw new Error(`Failed to delete book. Status: ${response.status}`);
        }

        console.log("attempting to fill table");
        // Refresh the book list after successful deletion
        window.location.href = '/';
    } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete the book. Please try again.');
    }
}