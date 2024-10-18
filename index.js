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



