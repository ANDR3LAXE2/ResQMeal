document.addEventListener('DOMContentLoaded', () => {
    const groceryForm = document.getElementById('add-grocery-form');
    const groceryList = document.querySelector('.grocery-list');

    // Load groceries from localStorage
    loadGroceries();

    groceryForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('grocery-name').value;
        const quantity = document.getElementById('grocery-quantity').value;

        if (name && quantity > 0) {
            addGrocery(name, quantity);
            saveGrocery(name, quantity);
            groceryForm.reset();
        }
    });

    function loadGroceries() {
        const groceries = JSON.parse(localStorage.getItem('groceries')) || [];
        groceries.forEach(grocery => {
            addGrocery(grocery.name, grocery.quantity);
        });
    }

    function saveGrocery(name, quantity) {
        const groceries = JSON.parse(localStorage.getItem('groceries')) || [];
        groceries.push({ name, quantity });
        localStorage.setItem('groceries', JSON.stringify(groceries));
    }

    function addGrocery(name, quantity) {
        const groceryItem = document.createElement('div');
        groceryItem.className = 'grocery-item';
        groceryItem.textContent = `${name} - ${quantity}`;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = function() {
            groceryList.removeChild(groceryItem);
            removeGrocery(name);
        };
        
        groceryItem.appendChild(deleteButton);
        groceryList.appendChild(groceryItem);
    }

    function removeGrocery(name) {
        let groceries = JSON.parse(localStorage.getItem('groceries')) || [];
        groceries = groceries.filter(grocery => grocery.name !== name);
        localStorage.setItem('groceries', JSON.stringify(groceries));
    }
});
