
const search_input = document.getElementById("search_input");

const fav_button = document.getElementsByClassName("favourite_button");

const movie_detail_link = document.getElementsByClassName("movie_card_link");

const back_button = document.getElementById("back_button_container");

renderFavouriteMovies();

// Search for the result when provided search bar input changed
function searchMovie(event) {

    // Preventing the default
    event.preventDefault();

    // Get required DOM objects
    const search_bar = document.getElementById("search_input");
    const search_result_list = document.getElementById("search_result_list");


    // Get the input string from search bar
    const search_query = search_bar.value;

    console.log("Search Query", search_query);

    // Get response for the provided input
    const movie_list_response = $.ajax({
        url: "http://www.omdbapi.com/?s=" + search_query + "&apikey=f27ad85c",
        type: "GET",
        success: (movie_list) => {

            if (movie_list.Response === 'True') {

                console.log("Is Movie list available", movie_list.Response)

                const movie_list_card_DOM = [];

                // Empty the list
                $("#search_result_list").empty();

                // Create a list of cards with the response for the input

                for (let index = 0; index < (movie_list.totalResults <= 5 ? movie_list.totalResults : 5); index++) {

                    // Getting the  movie from the list
                    let movie = movie_list.Search[index];

                    let title = movie.Title;

                    // Constructing the movie DOM using the object
                    let movie_DOM = $(`
                    <li class="search_result_content">
                            <a href="./movie_detail.html" data-movie-title="${title}" class="movie_card_link">
    
                                <div class="movie_card_container" data-movie-title="${title}">
    
                                    <div class="card_left" data-movie-title="${title}">
                                        <img src="${movie.Poster}" alt="movie_poster" height="150px" width="120px"
                                            class="movie_poster_img">
                                    </div>
    
                                    <div class="card_right" data-movie-title="${title}">
    
                                        <h3><b>Name: </b>${title}</h3>
    
                                        <div id="star_rating">
                                            <span class="fa fa-star checked"></span>
                                            <span class="fa fa-star checked"></span>
                                            <span class="fa fa-star"></span>
                                            <span class="fa fa-star"></span>
                                            <span class="fa fa-star"></span>
                                        </div>
    
                                        <button class="favourite_button" data-movie-title="${movie.Title}">Add to Fav</button>
    
                                    </div>
    
                                </div>
    
                            </a>
                        </li>
                        `);


                    // Push the movie DOM into the DOM list 
                    $("#search_result_list").append(movie_DOM);
                }
            }

        },
        error: (error) => {
            console.log(error);
        }
    })
}

// add to favourite when clicked the add button
function addToFavourite(event) {

    // Get the particular target from event
    const target = event.target;

    // Get the title of the movie
    const movie_name = target.getAttribute("data-movie-title");

    const fav_list_movies = localStorage.getItem("movie_info");

    if (movie_name && fav_list_movies.includes(movie_name) === false) {

        // Add movie into favourite
        $.ajax({
            url: "http://www.omdbapi.com/?t=" + movie_name + "&apikey=f27ad85c",
            type: "GET",
            success: (movie_response) => {

                // Check if the movie response is present
                if (movie_response) {

                    // If present, Get the movie details from response

                    // Construct the movie detail DOM with required information
                    const movie_DOM = $(`<li class="favourite_card_container" id ="${movie_response.Title}">

                        <div class="fav_card_left">
                            <img src="${movie_response.Poster}" alt="movie_poster" height="100px" width="80px"
                                class="movie_poster_img">
                        </div>

                        <div class="fav_card_right">

                            <div id="name_section"><b>Name: </b>${movie_response.Title}</div>

                            <div id="star_rating">
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star"></span>
                                <span class="fa fa-star"></span>
                                <span class="fa fa-star"></span>
                            </div>

                        </div>

                        <button class="remove_button" data-movie-title="${movie_response.Title}"> Remove </button>

                    </li>`);

                    // render the full page 
                    $("#favourite_list").append(movie_DOM);
                }
            }
        })

        // add the movie title to the local storage
        let previous_movies_names = localStorage.getItem("movie_info");
        if (previous_movies_names) {
            localStorage.setItem("movie_info", previous_movies_names + "," + movie_name);
        } else {
            localStorage.setItem("movie_info", movie_name);
        }

    }
}

// Render all the favourite movies list
function renderFavouriteMovies() {

    $("#favourite_list").empty();

    const fav_movie_list = localStorage.getItem("movie_info").split(",");

    // Iterate the movie list
    for (let index = 0; index < fav_movie_list.length; index++) {
        // Get the movie response from DB
        let movie_name = fav_movie_list[index];

        // Construct the favourite DOM

        // Add it to the favourite list

        // Get required movie title response from OMDB
        $.ajax({
            url: "http://www.omdbapi.com/?t=" + movie_name + "&apikey=f27ad85c",
            type: "GET",
            success: (movie_response) => {

                // Check if the movie response is present
                if (movie_response) {

                    // If present, Get the movie details from response

                    // Construct the movie detail DOM with required information
                    const movie_DOM = $(`<li class="favourite_card_container" id="${movie_response.Title}">

                        <div class="fav_card_left">
                            <img src="${movie_response.Poster}" alt="movie_poster" height="100px" width="80px"
                                class="movie_poster_img">
                        </div>

                        <div class="fav_card_right">

                        <div id="name_section"><b>Name: </b>${movie_response.Title}</div>

                            <div id="star_rating">
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star"></span>
                                <span class="fa fa-star"></span>
                                <span class="fa fa-star"></span>
                            </div>

                        </div>

                        <button class="remove_button" data-movie-title="${movie_response.Title}"> Remove </button>

                    </li>`);

                    // render the full page 
                    $("#favourite_list").append(movie_DOM);
                }
            }
        })
    }

}

function removeFavFromList(event) {

    event.preventDefault();

    // Get the current target
    let current_target = event.target;

    // Get the movie title
    let movie_name = current_target.getAttribute("data-movie-title");

    let fav_movie_list = localStorage.getItem("movie_info").split(",");

    fav_movie_list = fav_movie_list.filter(movie => movie != movie_name);

    localStorage.setItem("movie_info", fav_movie_list);

    renderFavouriteMovies();
}

// show full movie detail when clicked the information
function showFullMovieDetail(event) {

    event.preventDefault();

    // Get the current target
    const current_target = event.target;

    // Get the movie title
    const movie_name = current_target.getAttribute("data-movie-title");

    // Get required movie title response from OMDB
    $.ajax({
        url: "http://www.omdbapi.com/?t=" + movie_name + "&apikey=f27ad85c",
        type: "GET",
        success: (movie_response) => {

            // Check if the movie response is present
            if (movie_response) {

                // If present, Get the movie details from response

                // Construct the movie detail DOM with required information
                const movie_detail_DOM = $(`

                <div id="movie_detail_information"
                    style="background-image: -webkit-linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 10) 100%), url(${movie_response.Poster});">
            
                    <!-- movie title -->
                    <div id="movie_title_header">
                    ${movie_response.Title}
                    </div>
            
                    <!-- ratings, movie run time, released Date,  -->
                    <div id="ratingsAndRuntime">
            
                        <!-- star rating -->
                        <div id="star_rating_detail">
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>
                </div>
            
                        <!-- number of votes -->
                        <div id="number_of_votes">
                            (${movie_response.imdbVotes})
                        </div>
            
                        <!-- IMDB rating -->
                        <div id="IMDB_rating">
                            <img class="rating_img"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/2560px-IMDB_Logo_2016.svg.png"
                                alt="imdb_logo" height="20px" width="50px">
                            <span>${movie_response.imdbRating}</span>
                        </div>
            
                        <!-- total run time -->
                        <div id="total_run_time">
                        ${movie_response.Runtime}
                        </div>
            
                        <!-- released year -->
                        <div id="released_year">
                        ${movie_response.Year}
                        </div>
            
                    </div>
            
                    <!-- movie description -->
                    <div id="movie_description">
                    ${movie_response.Plot}
                    </div>
            
                    <!-- starring -->
                    <div id="starring_info">
                        <b>Starring:</b> ${movie_response.Actors}
                    </div>
            
                    <!-- Director -->
                    <div id="director_info">
                        <b>Director:</b> ${movie_response.Director}
                    </div>

                    <div class = "back_button_container">
                        <img class="back_button"
                            src="https://cdn-icons-png.flaticon.com/128/6318/6318577.png"
                            alt="back_button" height="50px" width="50px">
                    </div>
                </div>
    `);

                // Create Styling class
                $(document.body).html(movie_detail_DOM);
            }
        }
    });
}

function handleClickEvent(event) {

    // Check what is the target
    const target = event.target;
    const targetName = event.target.className;

    event.preventDefault();

    // If the target is checkbox to toggle
    if (targetName == "movie_card_container" || targetName == "card_left" || targetName == "card_right" || targetName == "star_rating" || targetName == "movie_poster_img") {
        showFullMovieDetail(event);
    }
    else if (targetName == "favourite_button") {
        addToFavourite(event);
    }
    else if (targetName == "remove_button") {
        removeFavFromList(event);
    }
    else if (targetName == "back_button_container" || targetName == "back_button") {
        event.preventDefault();
        window.location = "index.html";
        renderFavouriteMovies();
    }
}

// search_icon.addEventListener("click", searchMovie);
search_input.addEventListener("input", searchMovie);

// fav_button.addEventListener("click", addToFavourite);

document.addEventListener("click", handleClickEvent);







