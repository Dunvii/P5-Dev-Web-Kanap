const KanapAPI = "http://localhost:3000/api/products/";
let cartList = JSON.parse(localStorage.getItem('cart'));
let addArticle = document.querySelector('#cart__items');
let totalQty = document.querySelector('#totalQuantity');
let totalPrice = document.querySelector('#totalPrice');
let allArticlePrice = [];
class articlePrice {
    constructor(id, price, color, qty, total) {
        this.id = id;
        this.price = price;
        this.color = color;
        this.qty = qty;
        this.total = total;
    }
}
const allRegex = [
    {
        name: "firstName",
        regex: "/^[a-zéèçà]{2,50}(-| )?([a-zéèçà]{2,50})?$/gmi",
        error: "Prénom incorrecte"
    },
    {
        name: "lastName",
        regex: "/^[a-zéèçà]{2,50}(-| )?([a-zéèçà]{2,50})?$/gmi",
        error: "Nom incorrecte"
    },
    {
        name: "address",
        regex: "\d+\s(.+)\s\d+\s\w+",
        error: "Adresse incorrecte"
    },
    {
        name: "city",
        regex: "/^\s*[a-zA-Z]{1}[0-9a-zA-Z][0-9a-zA-Z '-.=#/]*$/gmi",
        error: "Ville incorrecte"
    },
    {
        name: "email",
        regex: "/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm",
        error: "email incorrecte, exemple : test@gmail.com"
    }
];

// Verification si présence de panier(Si non affiche "0" + panier vide)
if (cartList === null) {
    updateShowCart();
}
else {
    liveCheckInputs();
    for(let product of cartList) {
    let KanapApiId = KanapAPI + product._id;
    fetch(KanapApiId)
    .then((res) => res.json())
    .then ((infoProduct) => {
        // Preparation informations pour calcul total quantité + prix
        if(allArticlePrice){
            let aAP = allArticlePrice.find(contentValue => contentValue.id === product._id && contentValue.color === product.color );
            if (!aAP){
                let addProduct = new articlePrice(infoProduct._id, infoProduct.price, product.color, product.qty,(infoProduct.price * product.qty));
                allArticlePrice.push(addProduct);
            }
        }
        else {
        let addProduct = new articlePrice(infoProduct._id, infoProduct.price);
        allArticlePrice.push(addProduct);
        }

        // Insertion articles dans la page
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

        // Récupération des élements DOM liées à son articles
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
            let returnAAP = allArticlePrice.find(contentValue => contentValue.id === product._id && contentValue.color === product.color);
            indexElement = allArticlePrice.indexOf(returnAAP);
            allArticlePrice.splice(indexElement, 1);
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
                let returnAAP = allArticlePrice.find(contentValue => contentValue.id === product._id && contentValue.color === product.color);
                returnAAP.total = (returnAAP.price * parseInt(qtyInput.value));
                cartUpdate(cartList);
                updateShowCart();
            }
        });
        updateShowCart();
    });
    }
}

// Mise à jour quantité + prix total du panier
function updateShowCart(){
    if (cartList === null) {
        totalQty.innerText = 0;
        totalPrice.innerText = 0;
        const newContent = document.createElement("h2");
        newContent.setAttribute("style", "text-align: center");
        newContent.textContent = "Panier vide";
        addArticle.appendChild(newContent);
    }
    else {
        totalQty.innerText = cartList.map(item => parseInt(item.qty)).reduce((compteur, valeur) => compteur + valeur);
        totalPrice.innerText = allArticlePrice.map(item => parseInt(item.total)).reduce((compteur, valeur) => compteur + valeur,0);

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


function liveCheckInputs(){
    const order = document.getElementById("order");
    for (infos of allRegex){
        let input = document.getElementById(infos.name);
        let regex = infos.regex;
        let error = input.nextElementSibling;
        input.addEventListener("change", () => {
        let testInput = regex.test(input.value);
        if (testInput) {
            error.innerText = "Ok";
        }
        else {
            error.innerText = infos.regex;
        }
        });
    }
    order.addEventListener("click", function() {
        // AU CLIQUE
    });
}
{/* <p id="firstNameErrorMsg"><!-- ci est un message d'erreur --></p> */}