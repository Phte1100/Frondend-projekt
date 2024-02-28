"use strict";

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
            <img src="${book.book_image}" alt="${book.title}" class="book-image">
            <h2>${book.rank}. ${book.title}</h2>
            <ul>
                <li><strong>Författare:</strong> ${book.author}</li>
                <li><strong>ISBN:</strong> ${book.primary_isbn13}</li>
            </ul>
            <p>${book.description}</p>
            <a href="${bookInfo.previewLink || '#'}" target="_blank" class="preview-link">Läs mer om ${book.title}</a>
            <a class="prev">&#10094;</a>
            <a class="next">&#10095;</a>
        </div>
        `;
        bookList.appendChild(bookItem);
    });
    showSlides(1); // Visa den första sliden

    document.getElementById('slideshowcontainer').addEventListener('click', function(event) {
        // Kontrollera om det klickade elementet har klassen 'prev'
        if (event.target.classList.contains('prev')) {
            plusSlides(-1); // Gå ett steg bakåt
        }
    
        // Kontrollera om det klickade elementet har klassen 'next'
        if (event.target.classList.contains('next')) {
            plusSlides(1); // Gå ett steg framåt
        }
    });
    

}




/*
function extractISBNs(books) {
    return books.map(book => book.primary_isbn13);
}
*/

// google books api: AIzaSyCPduk_iSsjI6LaBiyVg0x6PDzT0Fa2uDo
// GET https://www.googleapis.com/books/v1/volumes?q=isbn:keyes&key=yourAPIKey
// NY TIMES: 3gySNnE3Ly9D2zD3DEC9GroOYifGli9A

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
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

/*
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    // Kontrollera och justera slideIndex innan visning
    slideIndex += n;
    showSlides(slideIndex);
}

function currentSlide(n) {
    // Sätt slideIndex till det valda slidenumret och visa den sliden
    slideIndex = n;
    showSlides(slideIndex);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");

    // Kontrollera om det finns slides att visa
    if (!slides.length) {
        console.warn("Inga slides att visa.");
        return;
    }

    // Återställa slideIndex om det är utanför det tillgängliga intervallet
    if (n > slides.length) {
        slideIndex = 1;
    } else if (n < 1) {
        slideIndex = slides.length;
    }

    // Dölja alla slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // Visa den aktuella sliden
    // Använd slideIndex-1 eftersom array-index startar från 0
    slides[slideIndex - 1].style.display = "block";
}
*/