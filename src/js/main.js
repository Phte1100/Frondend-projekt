"use strict";

document.getElementById('fetch-books').addEventListener('click', async () => {
    document.querySelector('.loader').style.display = 'flex';
    document.getElementById('text').style.display = 'none';
    document.getElementById('slideshowcontainer').innerHTML = '';
    slideIndex = 1;
    const selectedDate = document.getElementById('date-picker').value;
    const selectedGenre = document.getElementById('genre-picker').value;
    const url = `https://api.nytimes.com/svc/books/v3/lists/${selectedDate}/${selectedGenre}.json?api-key=3gySNnE3Ly9D2zD3DEC9GroOYifGli9A`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayBooks(data.results.books);
    } catch (error) {
        document.getElementById('error-message').innerText = 'Det gick inte att hämta böckerna. Försök igen senare.';
        document.querySelector('.loader').style.display = 'none';
    }
    finally {
        // Dölj laddningsanimationen när processen är klar
        document.querySelector('.loader').style.display = 'none';
    }
});

async function displayBooks(books) {
    const bookList = document.getElementById('slideshowcontainer');
    bookList.innerHTML = ''; // Rensa tidigare innehåll
    // Sortera böckerna efter deras rank i stigande ordning
    const sortedBooks = books.sort((a, b) => a.rank - b.rank);
    // Skapa en array av promises för att hämta ytterligare information om varje bok
    const promises = sortedBooks.map(book =>
        fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.primary_isbn13}&key=AIzaSyCPduk_iSsjI6LaBiyVg0x6PDzT0Fa2uDo`)
        .then(response => response.json())
    );

    // Vänta på att alla promises ska lösas
    const results = await Promise.all(promises);

    // Processa varje resultat och skapa en slide för varje bok
    results.forEach((googleBooksData, index) => {
        const book = sortedBooks[index];
        const bookInfo = googleBooksData.items ? googleBooksData.items[0].volumeInfo : {};
        const bookItem = document.createElement('article');
        bookItem.innerHTML = `
        <div class="mySlides fade">
        <picture class="bookimg">
            <img src="${book.book_image}" alt="${book.title}" class="book-image">
          </picture>
            <h2>${book.rank}. ${book.title}</h2>
            <ul class="dotlist">
                <li><strong>Author:</strong> ${book.author}</li>
                <li><strong>ISBN:</strong> ${book.primary_isbn13}</li>
            </ul>
            <p>${book.description}</p>
            <a href="${bookInfo.previewLink || '#'}" target="_blank" class="preview-link">More about: ${book.title}</a>
            <a class="prev">&#10094;</a>
            <a class="next">&#10095;</a>
        </div>
        `;
        bookList.appendChild(bookItem);
    });
    showSlides(1);
}

document.getElementById('slideshowcontainer').addEventListener('click', function(event) {
    // Kontrollera om det bakåt-pilen har klassen 'prev'
    if (event.target.classList.contains('prev')) {
        plusSlides(-1); // Gå ett steg bakåt
    }

    // Kontrollera om det klickade elementet har klassen 'next'
    if (event.target.classList.contains('next')) {
        plusSlides(1); // Gå ett steg framåt
    }
});

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) return; // Avsluta om det inte finns några slides

    slideIndex = n > slides.length ? 1 : n < 1 ? slides.length : n; // Cirkulär navigering

    for (let slide of slides) {
        slide.style.display = "none"; // Dölj alla slides
    }

    slides[slideIndex - 1].style.display = "block"; // Visa den aktuella sliden
}
