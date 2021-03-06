let cuisineDropdown = document.querySelector("#cuisineDropdown");
let cuisineImgPlaceholder = document.querySelector("#cuisineImgPlaceholder");
let cuisineOnlyButton = document.querySelector("#cuisineShBtn");
let cuisinePicture = document.querySelector("#cuisinePicture");
let ingredientString;
let listOfIngredients;
let movieOnlyButton = document.querySelector("#movieShBtn");
let orderedListForRecipe = document.querySelector("#orderedListForRecipe");
let pastCuisineArea = document.querySelector("#pastCuisineHistory");
let pastMovieArea = document.querySelector("#pastMovieHistory");
let pickBothButton = document.querySelector("#bothShBtn");
let querySpecificMovieLink;
let randomRecipeRequest;
let recipeIdentifier;
let recipeImageLink;
let recipeTextArea;
let recipeTitle;
let recipeTitleArea = document.querySelector("#recipeTitle");
let stepDetails;
let stepIngredients;
let steps;
let typeOfCuisineText = document.querySelector("#selectedTypeOfCuisineField");
let unorderedIngredientList = document.querySelector("#listForIngredients");
let userSelectedCuisine = "";
let userSelectedMovie = "";
let movieDropdown = document.querySelector("#movieDropdown");
let typeOfMovieText = document.querySelector("#selectedTypeOfMovieField")
let movieImgPlaceholder = document.querySelector("#movieImgPlaceholder");
let userSelectedMovieGenre = "";
let queryString;
let deleteModalBtnElt = document.querySelector("#deleteModalBtn");


    let api_key = 'd748f076b1e977b08676c44b46816848';
    let mainURL = `http://api.themoviedb.org/3/discover/movie/?api_key=${api_key}&language=en-US&sort_by=popularity.desc&include_adult=false&with_genres=`;

    //listener to movie button
    function createMovieQueryURL() {
        if (userSelectedMovieGenre === "") {
            queryURL =
                `${mainURL}` + '&page=' + [Math.floor(Math.random() * 9 + 1)] + '/';
        } else {
            queryURL =
                `${mainURL}` + userSelectedMovieGenre + '&page=' + [Math.floor(Math.random() * 9 + 1)] + '/';
        }
        ajaxMovieCall(queryURL);
    }
    
// Creates a URL to be queried based off of past movie search history
function createSpecificMovieURL (movieID) {
    movieID = movieID.toString();
    querySpecificMovieLink = 'http://api.themoviedb.org/3/movie/' + movieID + '?api_key=' + api_key;
    console.log(querySpecificMovieLink);
    specificMovieCall(querySpecificMovieLink);
}

//Query for a specific movie
function specificMovieCall (queryURL) {
    $.ajax({
        url: queryURL,
        method: 'GET',
        success: function (response) {
            console.log(response);
        },
        error: function (response) {
            console.log(response);
        },
    }).then(function (response) {
        console.log(response);
        renderMovie(response);
    });
}

// call function
function ajaxMovieCall(queryURL) {
    $.ajax({
        url: queryURL,
        method: 'GET',
        success: function (response) {
            console.log(response);
        },
        error: function (response) {
            console.log(response);
        },
    }).then(function (response) {
        console.log(response);
        console.log(response.results[0].poster_path);
        renderMovies(response, 1);
    });
}
//fuction that renders movie
function renderMovie(movie) {
    let posterImageCode = movie.backdrop_path;
    let movieIdentifier = movie.id;
    let posterImageURL = `https://image.tmdb.org/t/p/w500/${posterImageCode}`;
    document.getElementById("picturelink").src = posterImageURL;

    let titleMovie = movie.title;
    document.getElementById("movieT").innerHTML = titleMovie;
    let overviewMovie = movie.overview;
    document.getElementById("overview").innerHTML = "Synopsis: " + overviewMovie;
    let releaseMovie = movie.release_date;
    document.getElementById("release").innerHTML = "Release Date: " + releaseMovie;
    let ratingMovie = movie.vote_average;
    document.getElementById("ratings").innerHTML = "Rating: " + ratingMovie;
    let moviesList = $('#movies-list');
    movieImgPlaceholder.setAttribute("class", "image is-5by3");
    addMovieToHistory(movieIdentifier, titleMovie, posterImageCode);
}

function cleanMoviesList(movie) {
    let moviesList = $('#movies-list');
    moviesList.empty();
}
//generating random number
function getRandomMovie(movies) {
    let randomNumber = Math.floor(Math.random() * movies.results.length);
    let movie = movies.results[randomNumber];

    return movie;
}

//for loop if user would like to display more than one movie
function renderMovies(movies, length) {
    cleanMoviesList();

    for (let i = 0; i < length; i++) {
        let randomMovie = getRandomMovie(movies);
        renderMovie(randomMovie);
    }
}


// Fetches the data for a specific recipe
function getRecipeDetails(recipeIdentifier) {
    fetch('https://api.spoonacular.com/recipes/' + recipeIdentifier + '/analyzedInstructions?apiKey=b7ca7b33f13b41f881b4b3c91ec90189')   //6bcf2249e71b4f518c9bc66ffb045b87  <- Scott T
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data[0].steps);
            steps = data[0].steps;
            goThroughRecipeSteps();
        });
}

// Takes in the user specified search criteria and uses it to find them a random recipe matching that criteria
function getRandomRecipe(recipeRequestLink) {
    fetch(recipeRequestLink)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            recipeIdentifier = data.results[0].id;
            recipeImageLink = data.results[0].image;
            recipeTitle = data.results[0].title;
            displayRecipeHeaderInfo(recipeIdentifier, recipeImageLink, recipeTitle);
        });
}

// Displays the Recipe header information on the page
function displayRecipeHeaderInfo (recipeIdentifier, recipeImageLink, recipeTitle) {
    addCuisineToHistory(recipeIdentifier, recipeImageLink, recipeTitle);
    recipeTitleArea.innerHTML = recipeTitle;
    cuisinePicture.setAttribute("src", recipeImageLink);
    cuisineImgPlaceholder.setAttribute("class", "image is-5by3");
    displayIngredientsBetter(recipeIdentifier);
    getRecipeDetails(recipeIdentifier);
}

// Gets the user selected cuisine from the cuisine dropdown and creates a link to be fetched from
function getCuisineSelection() {
    if (userSelectedCuisine === "" || userSelectedCuisine === "Random") {
        randomRecipeRequest = 'https://api.spoonacular.com/recipes/complexSearch?number=1&sort=random&type=main course&&apiKey=b7ca7b33f13b41f881b4b3c91ec90189';
    } else {
        randomRecipeRequest = 'https://api.spoonacular.com/recipes/complexSearch?number=1&sort=random&type=main course&cuisine=' + userSelectedCuisine + '&apiKey=b7ca7b33f13b41f881b4b3c91ec90189';
    }
    getRandomRecipe(randomRecipeRequest);
}

// Goes through each of the steps for a recipe
function goThroughRecipeSteps() {
    clearRecipeArea();
    for (let i = 0; i < steps.length; i++) {
        stepDetails = steps[i].step;
        let listItem = document.createElement("LI");
        listItem.innerHTML = stepDetails;
        orderedListForRecipe.appendChild(listItem);
    }
}

// Clears out the area containing recipe information so it can be populated cleanly
function clearRecipeArea() {
    for(let i = 0; i < orderedListForRecipe.children.length; i++){
        orderedListForRecipe.removeChild(orderedListForRecipe.children[i]);
        i--;
    }
}

// Clears out the area containing required ingredients so it can be populated cleanly
function clearIngredientArea() {
    for(let i = 0; i < unorderedIngredientList.children.length; i++){
        unorderedIngredientList.removeChild(unorderedIngredientList.children[i]);
        i--;
    }
}

// When user selects a type of cuisine it is saved as a variable and updated on the page
function setUserCuisineChoice(event) {
    event.preventDefault();
    userSelectedCuisine = event.target;
    userSelectedCuisine = userSelectedCuisine.innerHTML.trim();
    typeOfCuisineText.innerHTML = "Type of Cuisine: " + userSelectedCuisine;
}

// When user selects a genre of movie it is saved as a variable and updated on the page
function setUserMovieChoice(event) {
    event.preventDefault();
    userSelectedMovie = event.target;
    userSelectedMovieGenre = userSelectedMovie.getAttribute("value");
    userSelectedMovie = userSelectedMovie.innerHTML.trim();
    typeOfMovieText.innerHTML = "Genre of Movie: " + userSelectedMovie;
    console.log(userSelectedMovieGenre);

}

// Fetches and displays the ingredients for the recipe
function displayIngredientsBetter (recipeIdentifier) {
    fetch('https://api.spoonacular.com/recipes/' + recipeIdentifier + '/information?includeNutrition=false&apiKey=b7ca7b33f13b41f881b4b3c91ec90189')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            clearIngredientArea()
            listOfIngredients = data.extendedIngredients;
            for(let i = 0; i < listOfIngredients.length; i++){
                console.log(listOfIngredients[i].original);
                let ingredientNeeded = document.createElement("LI");
                ingredientNeeded.innerHTML = listOfIngredients[i].original;
                unorderedIngredientList.appendChild(ingredientNeeded);
            }
        });
        return;
}

// Handles both searches for when the pick both button is pressed
function pickBothHandle() {
    getCuisineSelection();
    createMovieQueryURL();
}

// When a cuisine is searched it is then added to the local storage
function addCuisineToHistory (recipeIdentifier, recipeImageLink, recipeTitle) {
    if (localStorage.getItem('PreviousRecipes') === null){
        let recipeArray = [];
        let recipeObject = {};
        let item = {
            "id": recipeIdentifier,
            "imgLink": recipeImageLink,
            "title": recipeTitle
        }
        recipeObject.items = recipeArray;
        recipeObject.items.unshift(item);
        localStorage.setItem('PreviousRecipes', JSON.stringify(recipeObject));
    }else{
        recipeObject = JSON.parse(localStorage.getItem("PreviousRecipes"));
        for (let i = 0; i < recipeObject.items.length; i++){
            if (recipeObject.items[i].id === recipeIdentifier) {
                recipeObject.items.splice(i,1);
            }
        }
        if(recipeObject.items.length > 2) {
            recipeObject.items.pop();
        }
        let item = {
            "id": recipeIdentifier,
            "imgLink": recipeImageLink,
            "title": recipeTitle
        }
        recipeObject.items.unshift(item);
        localStorage.setItem('PreviousRecipes', JSON.stringify(recipeObject));
    }
    createRecipeButtons();
}

// Creates the buttons on the page for the Recent Recipes Area
function createRecipeButtons () {
    while (pastCuisineArea.firstChild){
        pastCuisineArea.removeChild(pastCuisineArea.firstChild);
    }
    if(localStorage.getItem("PreviousRecipes")!== null) {
        let recentRecipesList = JSON.parse(localStorage.getItem("PreviousRecipes"));
        for (let i = 0; i < recentRecipesList.items.length; i++){
            let newDiv = document.createElement("DIV");
            newDiv.setAttribute("class", "box");
            newDiv.setAttribute("data-id", recentRecipesList.items[i].id);
            pastCuisineArea.appendChild(newDiv);
            let newArticle = document.createElement("ARTICLE");
            newArticle.setAttribute("data-id", recentRecipesList.items[i].id);
            newArticle.setAttribute("class", "media");
            newDiv.appendChild(newArticle);
            let anotherDiv = document.createElement("DIV");
            anotherDiv.setAttribute("data-id", recentRecipesList.items[i].id);
            anotherDiv.setAttribute("class", "media-left");
            newArticle.appendChild(anotherDiv);
            let newFigure = document.createElement("FIGURE");
            newFigure.setAttribute("data-id", recentRecipesList.items[i].id);
            newFigure.setAttribute("class", "image is-64x64");
            anotherDiv.appendChild(newFigure);
            let newImg = document.createElement("IMG");
            newImg.setAttribute("data-id", recentRecipesList.items[i].id);
            newImg.setAttribute("src", recentRecipesList.items[i].imgLink);
            newImg.setAttribute("alt", "Cuisine");
            newFigure.appendChild(newImg);
            let yetAnotherDiv = document.createElement("DIV");
            yetAnotherDiv.setAttribute("data-id", recentRecipesList.items[i].id);
            yetAnotherDiv.setAttribute("class", "media-content");
            newArticle.appendChild(yetAnotherDiv);
            let fourthDiv = document.createElement("DIV");
            fourthDiv.setAttribute("data-id", recentRecipesList.items[i].id);
            fourthDiv.setAttribute("class", "content has-text-weight-bold is-size-4 has-text-centered");
            yetAnotherDiv.appendChild(fourthDiv);
            let newParagraph = document.createElement("P");
            newParagraph.setAttribute("data-id", recentRecipesList.items[i].id);
            newParagraph.innerHTML = recentRecipesList.items[i].title;
            fourthDiv.appendChild(newParagraph);
        }
    }
}

// Handles when a button is clicked in the Recipe History Area
function handlePastRecipeAreaClick (event) {
    event.preventDefault();
    let newRecipe = event.target;
    if (newRecipe.nodeName === "DIV" || newRecipe.nodeName === "FIGURE" || newRecipe.nodeName === "IMG" || newRecipe.nodeName === "ARTICLE" || newRecipe.nodeName === "P"){
        newRecipe = newRecipe.getAttribute("data-id");
        let recentRecipesList = JSON.parse(localStorage.getItem("PreviousRecipes"));
        for (let i = 0; i < recentRecipesList.items.length; i++){
            if (recentRecipesList.items[i].id == newRecipe) {
                recipeIdentifier = recentRecipesList.items[i].id;
                recipeImageLink = recentRecipesList.items[i].imgLink;
                recipeTitle = recentRecipesList.items[i].title;
                console.log(recipeIdentifier);
                displayRecipeHeaderInfo(recipeIdentifier, recipeImageLink, recipeTitle);
            }
    }
    } else{
        return;
    }

}

// When a movie is searched it is then added to the local storage
function addMovieToHistory (movieID, movieTitle, moviePoster) {
    if (localStorage.getItem('PreviousMovies') === null){
        let movieArray = [];
        let movieObject = {};
        let item = {
            "id": movieID,
            "title": movieTitle,
            "poster": moviePoster
        }
        movieObject.items = movieArray;
        movieObject.items.unshift(item);
        localStorage.setItem('PreviousMovies', JSON.stringify(movieObject));
    }else{
        movieObject = JSON.parse(localStorage.getItem("PreviousMovies"));
        for (let i = 0; i < movieObject.items.length; i++){
            if (movieObject.items[i].id === movieID) {
                movieObject.items.splice(i,1);
            }
        }
        if(movieObject.items.length > 2) {
            movieObject.items.pop();
        }
        let item = {
            "id": movieID,
            "title": movieTitle,
            "poster": moviePoster
        }
        movieObject.items.unshift(item);
        localStorage.setItem('PreviousMovies', JSON.stringify(movieObject));
    }
    createMovieButtons();
}

// Creates the buttons on the page for the Recent Movies Area
function createMovieButtons () {
    while (pastMovieArea.firstChild){
        pastMovieArea.removeChild(pastMovieArea.firstChild);
    }
    if(localStorage.getItem("PreviousMovies")!== null) {
        let recentMoviesList = JSON.parse(localStorage.getItem("PreviousMovies"));
        for (let i = 0; i < recentMoviesList.items.length; i++){
            let newDiv = document.createElement("DIV");
            newDiv.setAttribute("class", "box");
            newDiv.setAttribute("data-id", recentMoviesList.items[i].id);
            pastMovieArea.appendChild(newDiv);
            let newArticle = document.createElement("ARTICLE");
            newArticle.setAttribute("class", "media");
            newArticle.setAttribute("data-id", recentMoviesList.items[i].id);
            newDiv.appendChild(newArticle);
            let anotherDiv = document.createElement("DIV");
            anotherDiv.setAttribute("class", "media-left");
            anotherDiv.setAttribute("data-id", recentMoviesList.items[i].id);
            newArticle.appendChild(anotherDiv);
            let newFigure = document.createElement("FIGURE");
            newFigure.setAttribute("class", "image is-64x64");
            newFigure.setAttribute("data-id", recentMoviesList.items[i].id);
            anotherDiv.appendChild(newFigure);
            let newImg = document.createElement("IMG");
            newImg.setAttribute("src", 'https://image.tmdb.org/t/p/w500/' + recentMoviesList.items[i].poster);
            newImg.setAttribute("data-id", recentMoviesList.items[i].id);
            newImg.setAttribute("alt", "Cuisine");
            newFigure.appendChild(newImg);
            let yetAnotherDiv = document.createElement("DIV");
            yetAnotherDiv.setAttribute("data-id", recentMoviesList.items[i].id);
            yetAnotherDiv.setAttribute("class", "media-content");
            newArticle.appendChild(yetAnotherDiv);
            let fourthDiv = document.createElement("DIV");
            fourthDiv.setAttribute("data-id", recentMoviesList.items[i].id);
            fourthDiv.setAttribute("class", "content has-text-weight-bold is-size-4 has-text-centered");
            yetAnotherDiv.appendChild(fourthDiv);
            let newParagraph = document.createElement("P");
            newParagraph.setAttribute("data-id", recentMoviesList.items[i].id);
            newParagraph.innerHTML = recentMoviesList.items[i].title;
            fourthDiv.appendChild(newParagraph);
        }
    }
}

// Handles when a button is clicked in the Movie History Area
function handlePastMovieAreaClick (event) {
    event.preventDefault();
    let newMovie = event.target;
    if (newMovie.nodeName === "DIV" || newMovie.nodeName === "FIGURE" || newMovie.nodeName === "IMG" || newMovie.nodeName === "ARTICLE" || newMovie.nodeName === "P"){
        newMovie = newMovie.getAttribute("data-id");
        console.log(newMovie);
        let recentMoviesList = JSON.parse(localStorage.getItem("PreviousMovies"));
        for (let i = 0; i < recentMoviesList.items.length; i++){
            if (recentMoviesList.items[i].id == newMovie) {
                movieID = recentMoviesList.items[i].id;
                createSpecificMovieURL(movieID);
            }
    }
    } else{
        return;
    }

}

// Deletes all past History Area using Modal
function deleteItems() {
    localStorage.clear();
    location.reload()
    $(".modal").removeClass("is-active");
  }

  $("#showModal").click(function() {
    $(".modal").addClass("is-active");  
  });
  
  $(".delete").click(function() {
     $(".modal").removeClass("is-active");
  });

  $("#cancelModalBtn").click(function() {
    $(".modal").removeClass("is-active");  
  });

cuisineDropdown.addEventListener("click", setUserCuisineChoice);
cuisineOnlyButton.addEventListener("click", getCuisineSelection);
movieDropdown.addEventListener("click", setUserMovieChoice);
movieOnlyButton.addEventListener("click", createMovieQueryURL);
pickBothButton.addEventListener("click", pickBothHandle);
pastCuisineArea.addEventListener("click", handlePastRecipeAreaClick);
pastMovieArea.addEventListener("click", handlePastMovieAreaClick);
deleteModalBtnElt.addEventListener("click", deleteItems);

createRecipeButtons();
createMovieButtons();

