const KanapAPI = "http://localhost:3000/api/products/";
let cartList = JSON.parse(localStorage.getItem('cart'));
let lsCartList = JSON.parse(localStorage.getItem('cart'));
let addArticle = document.querySelector('#cart__items');
let totalQty = document.querySelector('#totalQuantity');
let totalPrice = document.querySelector('#totalPrice');
let firstName = document.querySelector('#firstName');
let lastName = document.querySelector('#lastName');
let address = document.querySelector('#address');
let city = document.querySelector('#city');
let email = document.querySelector('#email');
let order = document.querySelector('#order');
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
        // Suppression d'un article au click
        buttonArticle.addEventListener("click", function() {
            delArticleInPage(delArticle);
            let returnCart = cartList.find(contentValue => contentValue._id === product._id && contentValue.color === product.color);
            let article = lsCartList.filter(function(article) {
                return !(article._id == returnCart._id && article.color == returnCart.color)
            });
            cartUpdate(article);
        });
        // Changement de la quantité d'un article
        const qtyInput = document.querySelector(`[data-id="${product._id}"][data-color="${product.color}"] .itemQuantity`);
        let totalArticlePrice = parseInt(qtyInput.value) * parseInt(infoProduct.price);
        let showCart = parseInt(totalPrice.textContent);
        qtyInput.addEventListener('input', function () {
            if (qtyInput.value < 1 || qtyInput.value > 100) {
                alert('Veuillez choisir une quantité comprise en 1 et 100.');
            }
            else {
                let returnCart = cartList.find(contentValue => contentValue._id === product._id && contentValue.color === product.color);
                returnCart.qty = parseInt(qtyInput.value);
                console.log(cartList);
                cartUpdate(cartList);
                updateShowCart(totalArticlePrice, parseInt(qtyInput.value), showCart);
            }
        });
        updateShowCart(totalArticlePrice, parseInt(qtyInput.value), showCart);
    });
}
function updateShowCart (totalArticlesPrice, totalArticleQty, showCart) {
    if(isNaN(showCart)) {
        let cartPrice = totalArticlesPrice;
        let cartQty = totalArticleQty;
        totalPrice.innerText = cartPrice;
        totalQty.innerText = cartQty;
    }
    else {
        let cartPrice = parseInt(totalPrice.innerText) + totalArticlesPrice;
        let cartQty = parseInt(totalQty.innerText) + totalArticleQty;
        totalPrice.innerText = cartPrice;
        totalQty.innerText = cartQty;
    }
}

// Suppression d'un article de la page
function delArticleInPage (article) {
    addArticle.removeChild(article);
}

// Mise à jour du panier dans le LS
function cartUpdate (product) {
    localStorage.setItem('cart', JSON.stringify(product));
    let cartList = localStorage.getItem('cart');
}

firstName.addEventListener('input', function() {

});

lastName.addEventListener('input', function() {

});

address.addEventListener('input', function() {

});

city.addEventListener('input', function() {

});

email.addEventListener('input', function() {

});

order.addEventListener('input', function() {

});