let searchResultsDiv;
let favoritesList; // globally declared favorites list

document.addEventListener('DOMContentLoaded', () => { //this is the section that is setting up the event listeners when DOM loads.
    const loginForm = document.getElementById('login-form');//this gets the login form element
    const recipeForm = document.getElementById('recipe-form');//this gets form  for submitting recipes
    const searchForm = document.getElementById('search-form'); //this gets the search form for recipes
    const toggleDarkModeButton = document.getElementById('toggle-dark-mode');//switches b2n light and dark mode
    searchResultsDiv = document.getElementById('search-results');
    favoritesList = document.getElementById('favorites-list');

    // Dark mode
    const currentTheme = localStorage.getItem('theme') || 'light'; //the dark or light mode preference is saved in the local storage
    document.body.classList.toggle('dark-mode', currentTheme === 'dark');

    loadFavorites(); //this loads the favourites list from local storage

    toggleDarkModeButton.addEventListener('click', () => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        document.body.classList.toggle('dark-mode', newTheme === 'dark');
    }); //click 'Dark Mode' above the nav bar and the body will turn black. You need to reload the page though for it to work again

    // Login
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const username = document.getElementById('username').value;
        alert(`Hi ${username}, WELCOME TO RATATOUILLE! Be sure not to burn your kitchen 😂👨‍🍳`);
        loginForm.reset(); // to reset the form to a blank one
    }); // once you fill the form you will get an alert 'popping up' on your screen

    recipeForm.addEventListener('submit', (event) => {// this is the event listener for the recipe submitting for at the end of the page
        event.preventDefault();
        const title = document.getElementById('recipe-title').value;
        const ingredients = document.getElementById('ingredients').value.split(',').map(ing => ing.trim());
        const instructions = document.getElementById('instructions').value;

        const recipe = { title, ingredients, instructions };
        saveRecipe(recipe); 
        recipeForm.reset(); 
        loadFavorites(); 
    });

    // Search form where the user writes the meal or what they are looking for
    searchForm.addEventListener('submit', async (event) => { //this is the event listener for the search form
        event.preventDefault();
        const query = document.getElementById('recipe-search').value; 
        await searchRecipes(query); 
        searchForm.reset(); // to reset the input field once the user clicks search
    });
});

async function searchRecipes(query) {// to get the meal objects / the pics of the recipes . this asyncronous function will only get the image of the recipe serched
    const apiKey = '01d82764e8874af2af81f632504645d3'; 
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&apiKey=${apiKey}`;

    console.log('Search query:', query); //this will log in the console.
    console.log('API URL:', url);// this logs in the console to show the url of the api

    try {// this is the block that will be used to handle errors
        const response = await fetch(url); // this sends a request to the api using the fetch function
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`); 
        }

        const data = await response.json(); // this will parse the JSON data returned by the API
        const recipeDetailsPromises = data.results.map(recipe => fetchRecipeDetails(recipe.id)); //creates an array of promises by mapping over the results
        const recipesWithDetails = await Promise.all(recipeDetailsPromises);

        displaySearchResults(recipesWithDetails); // this displays the search results 
    } catch (error) { // this block will catch the errors should they occur
        console.error('Error fetching recipes:', error);
        searchResultsDiv.innerHTML = '<p>Error fetching recipes. Please try again.</p>';
    }
} 

async function fetchRecipeDetails(id) { // this is the second block that will fetch the detailed info. on the recipes . the items are identical to the one above
    const apiKey = '01d82764e8874af2af81f632504645d3';
    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching recipe details:', error); // this throughs an error if there is an issue fetching the recipe details.
        return null; 
    }
}// this part gets the ingredients and the instructions lists from the api .Without it only the images will be visible

function displaySearchResults(recipes) {// fuction will display the search results
    searchResultsDiv.innerHTML = '';// this will clear any content existing in the div so that the results will not overlap

    if (!recipes || recipes.length === 0) {// this will show a message if no recipes were found and ends the function
        searchResultsDiv.innerHTML = '<p>No recipes found.</p>';
        return; 
    }

    recipes.forEach(recipe => {
        if (!recipe) return; // this is a loop to skip null results

        const recipeElement = document.createElement('div');// this block handles the divs created for each recipe so as to seperate them
        recipeElement.className = 'recipe';
        recipeElement.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" />
            <p>Ready in ${recipe.readyInMinutes} minutes</p>
            <h4>Ingredients:</h4>
            <ul>
                ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}
            </ul>
            <h4>Instructions:</h4>
            <p>${recipe.instructions || 'No instructions available.'}</p>
            <button class="favorite-btn" data-title="${recipe.title}" data-image="${recipe.image}">Add to Favorites</button>
        `;
        searchResultsDiv.appendChild(recipeElement); // Add recipe to the results div
    });

    document.querySelectorAll('.favorite-btn').forEach(button => {// this is the event listener for button click below each recipe. You click this for the recipe to be added to the favourites list
        button.addEventListener('click', () => {
            const title = button.getAttribute('data-title');
            const image = button.getAttribute('data-image');
            saveFavorite({ title, image });
        });
    }); 
}

function saveRecipe(recipe) {// this saves a recipe to local storage . it adds it to an array of the saved recipes
    const savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    savedRecipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(savedRecipes));
}

function saveFavorite(recipe) {// this block adds aa recipe to the favourites list that is stored in local storage
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(recipe);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites(); // reloads the favourites list
}

function loadFavorites() {//this is the block that will retrieve the user's fav recipes from local storage
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesList.innerHTML = ''; // Clear the list

    if (favorites.length === 0) {// this will showw a message if there is nothing in the favourite
        favoritesList.innerHTML = '<li>No favorites yet.</li>';
        return;
    }
       
    favorites.forEach(favorite => {// this williterate over each item in the favourites array
        const favoriteItem = document.createElement('li');// this creates a new list item element for each recipe
        favoriteItem.innerHTML = `
            <img src="${favorite.image}" alt="${favorite.title}" />
            <span>${favorite.title}</span>
        `;
        favoritesList.appendChild(favoriteItem); // Add favorites to the list
    });
}
