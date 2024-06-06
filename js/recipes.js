document.addEventListener('DOMContentLoaded', () => {
    const recipeForm = document.getElementById('create-recipe-form');
    const recipeList = document.querySelector('.recipe-list');

    // Load recipes from localStorage
    loadRecipes();

    recipeForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('recipe-name').value;
        const ingredients = document.getElementById('recipe-ingredients').value;
        const steps = document.getElementById('recipe-steps').value;

        if (name && ingredients && steps) {
            addRecipe(name, ingredients, steps);
            saveRecipe(name, ingredients, steps);
            recipeForm.reset();
        }
    });

    function loadRecipes() {
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.forEach(recipe => {
            addRecipe(recipe.name, recipe.ingredients, recipe.steps);
        });
    }

    function saveRecipe(name, ingredients, steps) {
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.push({ name, ingredients, steps });
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }

    function addRecipe(name, ingredients, steps) {
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';

        const recipeName = document.createElement('h3');
        recipeName.textContent = name;

        const recipeIngredients = document.createElement('p');
        recipeIngredients.innerHTML = `<strong>Ingredients:</strong> ${ingredients}`;

        const recipeSteps = document.createElement('p');
        recipeSteps.innerHTML = `<strong>Steps:</strong> ${steps}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = function() {
            recipeList.removeChild(recipeItem);
            removeRecipe(name);
        };

        recipeItem.appendChild(recipeName);
        recipeItem.appendChild(recipeIngredients);
        recipeItem.appendChild(recipeSteps);
        recipeItem.appendChild(deleteButton);
        recipeList.appendChild(recipeItem);
    }

    function removeRecipe(name) {
        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes = recipes.filter(recipe => recipe.name !== name);
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }
});
