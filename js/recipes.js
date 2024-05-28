document.addEventListener("DOMContentLoaded", () => {
  const recipeForm = document.getElementById("recipeForm");
  recipeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("recipeName").value;
    const description = document.getElementById("description").value;
    const ingredientInputs = document.querySelectorAll('[name^="ingredient"]');
    const ingredients = Array.from(ingredientInputs).map(
      (input) => input.value
    );
    console.log(name, description, ingredients);

    if (name && ingredients && description) {
      fetch("http://localhost:3000/submitrecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, ingredients, description }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => {
          console.error("Error:", error);
        });

      recipeForm.reset();
      resetIngredientFields();
    }
  });

  window.generateIngredientFields = function () {
    const ingredientCount = document.getElementById("ingredientCount").value;
    const ingredientFields = document.getElementById("ingredientFields");
    ingredientFields.innerHTML = ""; // Clear previous fields

    for (let i = 1; i <= ingredientCount; i++) {
      const div = document.createElement("div");
      div.className = "ingredient-form";

      const ingredientLabel = document.createElement("label");
      ingredientLabel.textContent = `Ingrédient ${i}: `;
      div.appendChild(ingredientLabel);

      const ingredientInput = document.createElement("input");
      ingredientInput.type = "text";
      ingredientInput.name = `ingredient${i}`;
      ingredientInput.placeholder = "Nom de l'ingrédient";
      ingredientInput.required = true;
      div.appendChild(ingredientInput);

      ingredientFields.appendChild(div);
    }
  };

  window.resetIngredientFields = function () {
    document.getElementById("ingredientFields").innerHTML = "";
  };
});
