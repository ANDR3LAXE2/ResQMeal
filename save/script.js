// URL de l'API Open Food Facts
const apiURL = "https://world.openfoodfacts.org/api/v2/product/";

// Code-barres du produit à récupérer
const barcode = "3263852913714"; // Exemple de code-barres

const search_button = document.getElementById("search-button");
const add_aliment_name = document.getElementById("add-aliment-name");
const product_info = document.getElementById("product-info");

search_button.addEventListener("click", function () {
  const user_barcode = document.getElementById("barcode-input").value;
  console.log(user_barcode);
  getFoodData(user_barcode);
});

async function getFoodData(barcode) {
  try {
    const response = await fetch(apiURL + barcode);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    display_product_info(data.product); // Appel de display_product_info avec les données du produit
    console.log(data);
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
  }
}

function display_product_info(product) {
  product_info.innerHTML = `
  <h2>${product.generic_name_fr}</h2>
  <p>${product.brands}</p>
  <p>${product.categories}</p>
  <img src="${product.image_url}" alt="${product.generic_name_fr}">
  `;
}

add_aliment_name.addEventListener("click", function () {
  const user_name_product = document.getElementById("name-input").value;
  console.log(user_name_product);
});
