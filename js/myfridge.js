document.addEventListener('DOMContentLoaded', () => {
    const ingredientForm = document.getElementById('add-ingredient-form');
    const ingredientList = document.querySelector('.ingredient-list');

    // Load ingredients from localStorage
    loadIngredients();

    ingredientForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('ingredient-name').value;
        const quantity = document.getElementById('ingredient-quantity').value;

        if (name && quantity > 0) {
            addIngredient(name, quantity);
            saveIngredient(name, quantity);
            ingredientForm.reset();
        }
    });

    function loadIngredients() {
        const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
        ingredients.forEach(ingredient => {
            addIngredient(ingredient.name, ingredient.quantity);
        });
    }

    function saveIngredient(name, quantity) {
        const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
        ingredients.push({ name, quantity });
        localStorage.setItem('ingredients', JSON.stringify(ingredients));
    }

    function addIngredient(name, quantity) {
        const ingredientItem = document.createElement('div');
        ingredientItem.className = 'ingredient-item';
        ingredientItem.textContent = `${name} - ${quantity}`;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = function() {
            ingredientList.removeChild(ingredientItem);
            removeIngredient(name);
        };
        
        ingredientItem.appendChild(deleteButton);
        ingredientList.appendChild(ingredientItem);
    }

    function removeIngredient(name) {
        let ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
        ingredients = ingredients.filter(ingredient => ingredient.name !== name);
        localStorage.setItem('ingredients', JSON.stringify(ingredients));
    }

    // Select the "Search for recipes" button
    let searchButton = document.querySelector('button[type="button"]');

    // Attach an event listener to the button
    searchButton.addEventListener('click', function() {
        // Get the list of ingredients
        let ingredients = getIngredients();

        // Create the server request
        let url = 'http://localhost:3000/search?' + new URLSearchParams({ ingredients: ingredients });

        // Make the server request
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Display the result of the request
                console.log(data);

                // Handle the server response
                displayRecipes(data);
            });
    });

    // This function should return the list of ingredients
    function getIngredients() {
        // Get the ingredients from localStorage
        const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];

        // Create an array to store the ingredient names
        let ingredientNames = [];

        // Iterate through each ingredient and add its name to the array
        ingredients.forEach(ingredient => {
            ingredientNames.push(ingredient.name);
        });

        // Return the array of ingredient names
        return ingredientNames;
    }

    // This function displays the recipes
    function displayRecipes(recipes) {
        // Select the recipe list
        let recipeLists = document.querySelector('.recipe-list');

        // Ensure the recipe list is empty
        recipeLists.innerHTML = '';

        // Iterate through each recipe
        recipes.forEach(recipe => {
            // Create a div element for the recipe
            let recipeItem = document.createElement('div');
            recipeItem.className = 'recipe-item';
            recipeItem.textContent = recipe.nom_recette;

            // Add a hover event to show ingredients
            recipeItem.addEventListener('mouseenter', () => {
                showRecipeDetails(recipeItem, recipe);
            });

            recipeItem.addEventListener('mouseleave', () => {
                hideRecipeDetails(recipeItem);
            });

            // Add the recipe element to the recipe list
            recipeLists.appendChild(recipeItem);
        });
    }

    function showRecipeDetails(recipeItem, recipe) {
        let details = document.createElement('div');
        details.className = 'recipe-details';
        details.innerHTML = `<strong>Ingredients:</strong><p>${recipe.description_recette}</p>`;
        recipeItem.appendChild(details);
    }

    function hideRecipeDetails(recipeItem) {
        const details = recipeItem.querySelector('.recipe-details');
        if (details) {
            recipeItem.removeChild(details);
        }
    }
});
