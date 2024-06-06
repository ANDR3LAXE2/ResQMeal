document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded');
});

let totalRotation = 0;

document.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    totalRotation = scrollTop;
    document.documentElement.style.setProperty('--rotation', `${totalRotation}deg`);
});

document.addEventListener('DOMContentLoaded', () => {
    let searchButton = document.querySelector('button[type="submit"]');

    // Attachez un gestionnaire d'événements au bouton
    searchButton.addEventListener('click', function() {
        // Récupérez la liste des ingrédients
        let recipe = getRecipe();

        // Créez la requête au serveur
        let url = 'http://localhost:3000/getRecipe' + new URLSearchParams({recipe: recipe});

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