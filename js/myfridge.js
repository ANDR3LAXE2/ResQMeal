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
});
