// ROUTE API + Variables globales
let KanapAPI = "http://localhost:3000/api/products/";
const currentLocation = window.location;
const url = new URL(currentLocation);
const id = url.searchParams.get("id")
KanapAPI = KanapAPI + id;
const productIMG = document.querySelector('.item__img');
const title = document.querySelector('#title');
const price = document.querySelector('#price');
const description = document.querySelector('#description');
const colors = document.querySelector('#colors');
console.log(KanapAPI);

// Affichage des élements du produits
fetch(KanapAPI)
    .then((res) => res.json())
    .then ((product) => {
        const insertIMG = document.createElement("img");
        insertIMG.setAttribute("src", product.imageURL);
        insertIMG.setAttribute("alt", product.altTxt)
        productIMG.appendChild(insertIMG);
    }
);