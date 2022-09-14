const KanapAPI = "http://localhost:3000/api/products/";
let cartList = JSON.parse(localStorage.getItem('cart'));
let addArticle = document.querySelector('#cart__items');
let totalQty = document.querySelector('#totalQuantity');
let totalPrice = document.querySelector('#totalPrice');
let allArticlePrice = [];

if (cartList === null) {
    updateShowCart();
}
else {
    for(let product of cartList) {
    let KanapApiId = KanapAPI + product._id;
    fetch(KanapApiId)
    .then((res) => res.json())
    .then ((infoProduct) => {
        const newProduct = document.createElement("article");
        newProduct.setAttribute("class" , "cart__item");
        newProduct.setAttribute("data-id" , product._id);
        newProduct.setAttribute("data-color" , product.color);
        newProduct.innerHTML= `
        <div class="cart__item__img">
                    <img src="${infoProduct.imageUrl}" alt="${infoProduct.altTxt}">
                    </div>
                    <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${infoProduct.name}</h2>
                        <p>${product.color}</p>
                        <p>${infoProduct.price}</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                    </div>`
        addArticle.appendChild(newProduct);
        const buttonArticle = document.querySelector(`[data-id="${product._id}"][data-color="${product.color}"] .deleteItem`);
        const delArticle = document.querySelector(`[data-id="${product._id}"][data-color="${product.color}"]`);
        const qtyInput = document.querySelector(`[data-id="${product._id}"][data-color="${product.color}"] .itemQuantity`);

        // Suppression d'un article au click
        buttonArticle.addEventListener("click", function() {
            delArticleInPage(delArticle);
            let returnCart = cartList.find(contentValue => contentValue._id === product._id && contentValue.color === product.color);
            let article = cartList.filter(function(article) {
                return !(article._id == returnCart._id && article.color == returnCart.color)
            });
            cartUpdate(article);
            updateShowCart();
        });

        // Changement de la quantité d'un article
        qtyInput.addEventListener('input', function () {
            if (qtyInput.value < 1 || qtyInput.value > 100) {
                alert('Veuillez choisir une quantité comprise en 1 et 100.');
            }
            else {
                let returnCart = cartList.find(contentValue => contentValue._id === product._id && contentValue.color === product.color);
                returnCart.qty = parseInt(qtyInput.value);
                cartUpdate(cartList);
                updateShowCart();
            }
        });
        updateShowCart();
    });
    }
}


function updateShowCart(){
    if (cartList === null) {
        totalQty.innerText = parseInt(0);
        totalPrice.innerText = parseInt(0);
        const newContent = document.createElement("h2");
        newContent.setAttribute("style", "text-align: center");
        newContent.textContent = "Panier vide";
        addArticle.appendChild(newContent);
    }
    else {
        totalQty.innerText = cartList.map(item => parseInt(item.qty)).reduce((compteur, valeur) => compteur + valeur);
        for (product of cartList){
            let KanapApiId = KanapAPI + product._id;
            let articlePrice = parseInt(product.qty);
            fetch(KanapApiId)
            .then((res) => res.json())
            .then ((infoProduct) => {
                articlePrice = articlePrice * parseInt(infoProduct.price);
                allArticlePrice.push(articlePrice);
                console.log(allArticlePrice);
            });
            totalPrice.innerText = allArticlePrice.reduce((compteur, valeur) => compteur + valeur, 0);
        }

    }
    
}

// Suppression d'un article de la page
function delArticleInPage (article) {
    addArticle.removeChild(article);
}

// Mise à jour du panier dans le LS
function cartUpdate (product) {
    localStorage.setItem('cart', JSON.stringify(product));
    cartList = JSON.parse(localStorage.getItem('cart'));
}
