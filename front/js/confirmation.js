function showOrder(){
    const currentLocation = window.location;
    const url = new URL(currentLocation);
    const id = url.searchParams.get("id")
    let confirmation = document.getElementById("orderId");
    confirmation.innerText = id;
}
showOrder();