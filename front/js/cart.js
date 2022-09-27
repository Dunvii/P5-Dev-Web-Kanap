const KanapAPI = "http://localhost:3000/api/products/";
let cartList = JSON.parse(localStorage.getItem('cart'));
let addArticle = document.querySelector('#cart__items');
let totalQty = document.querySelector('#totalQuantity');
let totalPrice = document.querySelector('#totalPrice');
const order = document.getElementById("order");
const allInputs = document.querySelectorAll("form input[name]");
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

// Regex pour verification des champs inputs
const allRegex = [
    {
        name: "firstName",
        regex: /^[A-Za-zÀ-ü-' ]+$/,
        error: "Prénom incorrect",
        validate: "Prénom ✓"
    },
    {
        name: "lastName",
        regex: /^[A-Za-zÀ-ü-' ]+$/,
        error: "Nom incorrecte",
        validate: "Nom ✓"
    },
    {
        name: "address",
        regex: /^[0-9]+\s[A-Za-zÀ-ü-'\s]+/,
        error: "Adresse incorrecte",
        validate: "Adresse ✓"
    },
    {
        name: "city",
        regex: /^[A-Za-zÀ-ü-' ]+$/,
        error: "Ville incorrecte",
        validate: "Ville ✓"
    },
    {
        name: "email",
        regex: /.+\@.+\..+/,
        error: "email incorrecte, exemple : test@gmail.com",
        validate: "email ✓"
    }
];

// Verification si présence de panier(Si non affiche "0" + panier vide)
if (cartList === null) {
    updateShowCart();
}
else {
    liveCheckInputs();
    sendPost();
    fetch(KanapAPI)
            .then((res) => res.json())
            .then((infoProduct) => {
            for (let product of cartList) {
                const theProduct = infoProduct.find(contentValue => contentValue._id === product._id);
                // Preparation informations pour calcul total quantité + prix
                if (allArticlePrice) {
                    let aAP = allArticlePrice.find(contentValue => contentValue.id === product._id && contentValue.color === product.color);
                    if (!aAP) {
                        let addProduct = new articlePrice(theProduct._id, theProduct.price, product.color, product.qty, (theProduct.price * product.qty));
                        allArticlePrice.push(addProduct);
                    }
                }
                else {
                    let addProduct = new articlePrice(theProduct._id, theProduct.price);
                    allArticlePrice.push(addProduct);
                }

                // Insertion articles dans la page
                const newProduct = document.createElement("article");
                newProduct.setAttribute("class", "cart__item");
                newProduct.setAttribute("data-id", product._id);
                newProduct.setAttribute("data-color", product.color);
                newProduct.innerHTML = `
                    <div class="cart__item__img">
                        <img src="${theProduct.imageUrl}" alt="${theProduct.altTxt}">
                    </div>
                    <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${theProduct.name}</h2>
                        <p>${product.color}</p>
                        <p>${theProduct.price}</p>
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
                buttonArticle.addEventListener("click", function () {
                    delArticleInPage(delArticle);
                    let returnCart = cartList.find(contentValue => contentValue._id === product._id && contentValue.color === product.color);
                    let article = cartList.filter(function (article) {
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
                        qtyInput.value = 1;
                        let returnCart = cartList.find(contentValue => contentValue._id === product._id && contentValue.color === product.color);
                        returnCart.qty = qtyInput.value;
                        let returnAAP = allArticlePrice.find(contentValue => contentValue.id === product._id && contentValue.color === product.color);
                        returnAAP.total = (returnAAP.price * parseInt(qtyInput.value));
                        cartUpdate(cartList);
                        updateShowCart();
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
        }
    });
}

// Mise à jour quantité + prix total du panier
function updateShowCart() {
    if (cartList === null) {
        totalQty.innerText = 0;
        totalPrice.innerText = 0;
        const newContent = document.createElement("h2");
        newContent.setAttribute("style", "text-align: center");
        newContent.textContent = "Panier vide";
        addArticle.appendChild(newContent);
    }
    else {
        totalQty.innerText = cartList.map(item => parseInt(item.qty)).reduce((compteur, valeur) => compteur + valeur, 0);
        totalPrice.innerText = allArticlePrice.map(item => parseInt(item.total)).reduce((compteur, valeur) => compteur + valeur, 0);

    }
}

// Suppression d'un article de la page
function delArticleInPage(article) {
    addArticle.removeChild(article);
}

// Mise à jour du panier dans le LS
function cartUpdate(product) {
    localStorage.setItem('cart', JSON.stringify(product));
    cartList = JSON.parse(localStorage.getItem('cart'));
}

function testInput(input, regex) {
    let test = regex.test(input.value);
    if (test) {
        return true;
    }
    else {
        return false;
    }
}

// Verification direct des champs avec message (Soucis restant : ordre d'affichage)
function liveCheckInputs() {
    for(infos of allRegex) {
        let infosContent = infos;
        let input = document.getElementById(infosContent.name);
        let error = input.nextElementSibling;
        input.addEventListener("change", () => {
            let regex = infosContent.regex;
            let returnTest = testInput(input,regex);
            if(returnTest){
                error.innerText = infosContent.validate;

            }
            else {
                error.innerText = infosContent.error;
            }  
        })
    }
}

// Verification + Requete POST à l'api (Soucis restant : Verification non complet ou décalé)
function sendPost() {
    order.addEventListener("click", (event) => {
        event.preventDefault();
        let next = true;
        for(infos of allRegex){
            let infosContent = infos;
            let input = document.getElementById(infosContent.name);
            let regex = infosContent.regex;
            let test = testInput(input,regex);
            let error = input.nextElementSibling;
            if(test){
                next = true;
            }
            else {
                next = false;
                error.innerText = infosContent.error;
                break;
                
            }
        }
        if (next){
            fetch("http://localhost:3000/api/products/order", {
                method: 'POST',
                body: JSON.stringify(
                    {contact: {
                        firstName: document.getElementById("firstName").value,
                        lastName: document.getElementById("lastName").value,
                        address: document.getElementById("address").value,
                        city: document.getElementById("city").value,
                        email: document.getElementById("email").value
                    },
                    products: cartList.map(product => product._id)
                    }),
                headers : {
                    'Content-Type': 'application/json'
                },
            })
                .then(res => res.json())
                .then(back => {
                    localStorage.clear('cart');
                    document.location = `./confirmation.html?id=${back.orderId}`;
                });
        }
        else{
            alert("Veuillez remplir les champs correctements.");
        }
    })
}