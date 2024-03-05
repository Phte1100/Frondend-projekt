!function(){async function e(e){let t=document.getElementById("slideshowcontainer");t.innerHTML="";let l=e.sort((e,t)=>e.rank-t.rank),s=l.map(e=>fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${e.primary_isbn13}&key=AIzaSyCPduk_iSsjI6LaBiyVg0x6PDzT0Fa2uDo`).then(e=>e.json())),i=await Promise.all(s);console.log(i),i.forEach((e,n)=>{let s=l[n],i=e.items?e.items[0].volumeInfo:{},o=document.createElement("article");o.innerHTML=`
        <div class="mySlides fade">
        <picture class="bookimg">
            <img src="${s.book_image}" alt="${s.title}" class="book-image">
          </picture>
            <h2>${s.rank}. ${s.title}</h2>
            <ul class="dotlist">
                <li><strong>Author:</strong> ${s.author}</li>
                <li><strong>ISBN:</strong> ${s.primary_isbn13}</li>
            </ul>
            <p>${s.description}</p>
            <a href="${i.previewLink||"#"}" target="_blank" class="preview-link">More about: ${s.title}</a>
            <a class="prev">&#10094;</a>
            <a class="next">&#10095;</a>
        </div>
        `,t.appendChild(o)}),n(1)}document.getElementById("fetch-books").addEventListener("click",async()=>{document.querySelector(".loader").style.display="flex",document.getElementById("text").style.display="none",document.getElementById("slideshowcontainer").innerHTML="",t=1;let n=document.getElementById("date-picker").value,l=document.getElementById("genre-picker").value,s=`https://api.nytimes.com/svc/books/v3/lists/${n}/${l}.json?api-key=3gySNnE3Ly9D2zD3DEC9GroOYifGli9A`;try{let t=await fetch(s),n=await t.json();e(n.results.books)}catch(e){console.error("Det gick inte att hämta böckerna",e)}finally{document.querySelector(".loader").style.display="none"}}),document.getElementById("slideshowcontainer").addEventListener("click",function(e){e.target.classList.contains("prev")&&n(t+=-1),e.target.classList.contains("next")&&n(t+=1)});let t=1;function n(e){let n=document.getElementsByClassName("mySlides");if(0!==n.length){for(let l of(t=e>n.length?1:e<1?n.length:e,n))l.style.display="none";n[t-1].style.display="block"}}n(1)}();
//# sourceMappingURL=index.fae2d46f.js.map
