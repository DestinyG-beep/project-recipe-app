let searchResultsDiv;

document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');
    const recipeForm = document.getElementById('recipe-form');
    const searchForm = document.getElementById('search-form');
    const toggleDarkModeButton = document.getElementById('toggle-dark-mode');
    const searchResultsDiv = document.getElementById('search-results');
    const favoritesList = document.getElementById('favorites-list');

    //dark mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-mode', currentTheme === 'dark');

    loadFavorites();

    toggleDarkModeButton.addEventListener('click', () => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        document.body.classList.toggle('dark-mode', newTheme === 'dark');
    });

    // login
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const username = document.getElementById('username').value;
        alert(`Hi ${username}, WELCOME TO RATATOUILLE!Be sure not to burn your kitchen 😂👨‍🍳`);
        loginForm.reset(); // Reset the form
    });

    recipeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('recipe-title').value;
        const ingredients = document.getElementById('ingredients').value.split(',').map(ing => ing.trim());
        const instructions = document.getElementById('instructions').value;

        const recipe = { title, ingredients, instructions };
        saveRecipe(recipe); 
        recipeForm.reset(); 
        loadFavorites(); 
    });

    //search form
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const query = document.getElementById('recipe-search').value; //  search query
        await searchRecipes(query); 
        searchForm.reset(); // Reset 
    });
});

async function searchRecipes(query) {
    const apiKey = '01d82764e8874af2af81f632504645d3'; 
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`;

    console.log('Search query:', query); 
    console.log('API URL:', url);

    try {
        const response = await fetch(url); // Fetch data from the API
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`); // errors
        }

        const data = await response.json(); 
        displaySearchResults(data.results);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        searchResultsDiv.innerHTML = '<p>Error fetching recipes. Please try again.</p>';
    }
}

function displaySearchResults(recipes) {
    searchResultsDiv.innerHTML = '';

    if (recipes.length === 0) {
        searchResultsDiv.innerHTML = '<p>No recipes found.</p>';
        return; 
    }
}


