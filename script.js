const resultsDiv = document.querySelector(".results");
// Function to simulate delay
function delayFetching(ms) {
    return new Promise ((resolve) => setTimeout(resolve, ms));
}
// Event listener for button click
document.getElementById("fetchMovieButton").addEventListener("click", async () => {
            // Get movie title from input
            const movieTitle = document.getElementById("movieTitleInput").value.trim();
            // Validate input
            if (movieTitle === "") {
                console.error("Movie title cannot be empty!");
                resultsDiv.innerHTML = `<p class="error-message"><strong>Movie title cannot be empty!</strong></p>`;
                return;
            }
            resultsDiv.innerHTML = `<p><strong>Fetching movie data...</strong></p>`;
            await delayFetching(1500);
            // Fetch movie data from OMDB API

    try {
        // Make API request
        const response = await fetch(`/.netlify/functions/movies?title=${encodeURIComponent(movieTitle)}`);
        // Check if response is ok
        if (response.ok) {
            // Parse JSON data
            const movieData = await response.json();
            // Check if movie was found
            if (movieData.Response === "True") {
                resultsDiv.innerHTML = movieData.Search.map(movie =>
                    `<div class="movie-card" data-id="${movie.imdbID}">
                    <h2>${movie.Title} (${movie.Year})</h2>
                    <img
                    src="${movie.Poster !== "N/A" ? movie.Poster : "https://cdn.pixabay.com/photo/2019/04/24/21/55/cinema-4153289_1280.jpg"}"
                    alt="${movie.Title}"
                    onerror="this.onerror=null; this.src='https://cdn.pixabay.com/photo/2019/04/24/21/55/cinema-4153289_1280.jpg';"
                    >
                </div>`
                ).join("");

                // Find all those cards in the DOM
                const cards = document.querySelectorAll(".movie-card");

                // Add event listener to each card
                cards.forEach(card => {
                    card.addEventListener("click", () => {
                        const imdbID = card.dataset.id;
                        showModal(imdbID);
                    });
                });
            } else {
                resultsDiv.innerHTML = `<p><strong>Movie not found!</strong></p>`;
            }
        } else {
            resultsDiv.innerHTML = `<p><strong>Error fetching movie data: ${response.statusText}</strong></p>`;
        }

        console.log("Data fetched successfully!");
        document.getElementById("movieTitleInput").value = "";

    } catch (error) {
        console.log("Network error:", error);
        resultsDiv.innerHTML = `<p><strong>Network error. Please try again later.</strong></p>`;
    }
})

// Event listener for Enter key press
document.getElementById("movieTitleInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("fetchMovieButton").click();
    }
})




// Modal code:
//Show Modal:
async function showModal(imdbID) {
    const modal = document.getElementById("movieModal");
    const modalDetails = document.querySelector(".modal-body");
    const fallbackPosterUrl = "https://cdn.pixabay.com/photo/2019/04/24/21/55/cinema-4153289_1280.jpg";

    try {
        const res = await fetch(`/.netlify/functions/movies?id=${imdbID}`);
        const data = await res.json();

        //Fill the modal with the details:
        modalDetails.innerHTML = `
        <h2>${data.Title}(${data.Year})</h2>
        <img 
        src="${data.Poster !== "N/A" ? data.Poster : fallbackPosterUrl}"
        alt="${data.Title}"
        onerror="this.onerror=null; this.src='${fallbackPosterUrl}';"
        >
        <p><strong>Genre: </strong>${data.Genre}</p>
        <p><strong>Director: </strong>${data.Director}</p>
        <p><strong>Actors: </strong>${data.Actors}</p>
        <p>${data.Plot}</p>
        `;
        // modal.style.display = "flex";
        const pageContent = document.querySelector(".page-content");
        modal.classList.add("show");
        pageContent.classList.add("modal-active");
        // document.body.classList.add("modal-open");
        document.body.style.overflow = "hidden";

    } catch (error) {
        console.error("Error fetching movie details:", error);
        modalDetails.innerHTML = `<p><strong>Error fetching movie details. Please try again later.</strong></p>`;
        modal.style.display = "flex";
        modal.classList.add("show");
    }
}

//Close Modal on click:
function closeModal() {
    const modal = document.getElementById("movieModal");
    const closeButton = document.querySelector(".close-btn");

    const hideModal = () => {
        modal.classList.remove("show");
        const pageContent = document.querySelector(".page-content");
        pageContent.classList.remove("modal-active");
        document.body.style.overflow = "auto";
    }

    closeButton.addEventListener("click", hideModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            hideModal();
        }
    })
    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {
            hideModal();
        }
    })
}
closeModal();

//Load theme from local storage:
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    document.getElementById("themeToggle").innerHTML = "&#x1F31E;";
}

//Theme toggle:
    const body = document.body;
    const themeToggle = document.getElementById("themeToggle");
    themeToggle.addEventListener("click", () => {
        const isLightMode = body.classList.toggle("light-mode");

        //Spin animation
        themeToggle.classList.add("spin");
        setTimeout(() => {
            themeToggle.classList.remove("spin")}, 600);

        themeToggle.innerHTML = isLightMode ? "&#x1F31E;": "&#x1F319;"
        localStorage.setItem("theme", isLightMode ? "light" : "dark");
    })