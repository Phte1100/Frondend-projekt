"use strict";

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('fetch-books').addEventListener('click', async () => {
        const selectedDate = document.getElementById('date-picker').value;
        const selectedGenre = document.getElementById('genre-picker').value;
        const url = `https://api.nytimes.com/svc/books/v3/lists/${selectedDate}/${selectedGenre}.json?api-key=3gySNnE3Ly9D2zD3DEC9GroOYifGli9A`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            displayBooks(data.results.books);
        } catch (error) {
            console.error('Det gick inte att hämta böckerna', error);
        }
    });

    async function displayBooks(books) {
      const bookList = document.getElementById('slideshowcontainer');
      if (!bookList) {
          console.error('Elementet "slideshowcontainer" hittades inte i DOM.');
          return; // Avsluta funktionen tidigt om elementet inte finns
      }
      bookList.innerHTML = '';

        const promises = books.map(book => 
            fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.primary_isbn13}&key=AIzaSyCPduk_iSsjI6LaBiyVg0x6PDzT0Fa2uDo`)
            .then(response => response.json())
        );

        const results = await Promise.all(promises);

        results.forEach((googleBooksData, index) => {
            const book = books[index];
            const bookInfo = googleBooksData.items ? googleBooksData.items[0].volumeInfo : {};
            const bookItem = document.createElement('article');
            bookItem.className = "mySlides fade";
            bookItem.innerHTML = `
                <img src="${book.book_image}" alt="${book.title}" class="book-image">
                <h2>${book.rank}. ${book.title}</h2>
                <ul>
                    <li><strong>Författare:</strong> ${book.author}</li>
                    <li><strong>ISBN:</strong> ${book.primary_isbn13}</li>
                </ul>
                <p>${book.description}</p>
                <a href="${bookInfo.previewLink || '#'}" target="_blank" class="preview-link">Läs mer om ${book.title}</a>
            `;
            bookList.appendChild(bookItem);
        });
    }

});
