
const KanapAPI = "http://localhost:3000/api/products/";
let cartList = JSON.parse(localStorage.getItem('cart'));
addArticle = document.querySelector('#cart__items');
console.log(cartList);

for(let product of cartList) {
    let KanapApiId = KanapAPI + product._id;
    fetch(KanapApiId)
    .then((res) => res.json())
    .then ((infoProduct) => {
        console.log(infoProduct);
        console.log(product);
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
                        <h2>Nom du produit</h2>
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
    });
}