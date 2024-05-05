// Configuration de QuaggaJS
Quagga.init(
  {
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#barcode-result"), // Or '#yourElement' (optional)
    },
    decoder: {
      readers: ["ean_reader"],
    },
  },
  function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
  }
);

// Gérer les résultats du scanner
Quagga.onDetected((result) => {
  console.log("Barcode detected:", result.codeResult.code);
  console.log(result);
  // Vous pouvez faire quelque chose avec le code-barres détecté ici, par exemple l'afficher dans une zone de texte
  document.getElementById("barcode-result").textContent =
    result.codeResult.code;
});
