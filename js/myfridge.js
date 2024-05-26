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
    // Sélectionnez le bouton "Search for recipes"
    let searchButton = document.querySelector('button[type="button"]');

    // Attachez un gestionnaire d'événements au bouton
    searchButton.addEventListener('click', function() {
        // Récupérez la liste des ingrédients
        let ingredients = getIngredients();

        // Créez la requête au serveur
        let url = 'http://localhost:3000/search?' + new URLSearchParams({ingredients: ingredients});

        // Faites la requête au serveur
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Affichez le résultat de la requête dans la console
                console.log(data);

                // Traitez la réponse du serveur
                displayRecipes(data);
            });
    });

    // Cette fonction doit retourner la liste des ingrédients
    function getIngredients() {
        // Récupérez les ingrédients du localStorage
        const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];

        // Créez un tableau pour stocker les noms des ingrédients
        let ingredientNames = [];

        // Parcourez chaque ingrédient et ajoutez son nom au tableau
        ingredients.forEach(ingredient => {
            ingredientNames.push(ingredient.name);
        });

        // Retournez le tableau des noms d'ingrédients
        return ingredientNames;
    }

    // Cette fonction affiche les recettes
    function displayRecipes(recipes) {
        // Sélectionnez la liste de recettes
        let recipeLists = document.getElementsByClassName('recipe-list');
    
        // Parcourez chaque liste de recettes
        for(let i = 0; i < recipeLists.length; i++) {
            // Assurez-vous que la liste de recettes est vide
            recipeLists[i].innerHTML = '';
    
            // Parcourez chaque recette
            recipes.forEach(recipe => {
                // Créez un élément div pour la recette
                let recipeItem = document.createElement('div');
                recipeItem.className = 'recipe-item';
                recipeItem.textContent = recipe.nom_recette;
    
                // Ajoutez l'élément de recette à la liste de recettes
                recipeLists[i].appendChild(recipeItem.cloneNode(true));
            });
        }
    }
});
