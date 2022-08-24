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
const toCart = document.querySelector("#addToCart");
const qty = document.querySelector("#quantity");
console.log(KanapAPI);

// Affichage des élements du produits
fetch(KanapAPI)
    .then((res) => res.json())
    .then ((product) => {
        document.querySelector('title').textContent = product.name;
        const insertIMG = document.createElement("img");
        insertIMG.setAttribute("src", product.imageUrl)
        insertIMG.setAttribute("alt", product.altTxt)
        productIMG.appendChild(insertIMG);
        title.innerText = product.name;
        price.innerText = product.price;
        description.innerText = product.description;
        for (let addColor of product.colors) {
            const newColor = document.createElement("option");
            newColor.setAttribute("value", `${addColor}`);
            newColor.innerText = addColor;
            colors.appendChild(newColor);
        }
        
        toCart.addEventListener("click", function() {
            let cartList = localStorage.getItem('cart');
            if(colors.value == "" || qty.value < 1){
                alert("Veuillez choisir une couleur et une quantité")
            }
            
            else{
                if (cartList){
                    let valueCart = JSON.parse(cartList);
                    console.log(valueCart);
                    let returnCart = valueCart.find(contentValue => contentValue._id === id && contentValue.color === colors.value);
                    console.log(returnCart);
                    if (returnCart) {
                        returnCart.qty += parseInt(qty.value);
                        alert('La quantité de votre articlé dans le panier a été mis à jour')
                    }
                    else {
                        valueCart.push(productFormat(product));
                        alert("L'article a été ajouté à votre panier.")
                    }
                    cartUpdate(valueCart);
                    
                }
                else {
                    let valueCart = [];
                    valueCart.push(productFormat(product));
                    cartUpdate(valueCart);
                }
            }
        }
        )
    }
);
// Convertir en {object} pour insérer dans le LocalStorage
function productFormat (data) {
    return productFormated = {
    _id: data._id,
    color: colors.value,
    qty: parseInt(qty.value)
    };
};

function cartUpdate (product) {
    localStorage.setItem('cart', JSON.stringify(product));
    let cartList = localStorage.getItem('cart');
    console.log(cartList);
}