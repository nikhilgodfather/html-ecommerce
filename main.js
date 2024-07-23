let cart = [];
let count = 0;
let grandTotal = 0;
document.addEventListener('DOMContentLoaded', () => {
    const DataJson = 'data.json';
    fetch(DataJson)
    .then(response => response.json())
    .then(data => {
        DataLoadJson(data);
    })
    .catch(error => {
        console.log(error);
    });
});

function DataLoadJson(data) {
    // Product Cards
    const ShirtsCard = document.getElementById('Shirts');
    const JeansCard = document.getElementById('Jeans');
    const WatchesCard = document.getElementById('Watches');
    const ShoesCard = document.getElementById('Shoes');
    const latestProducts = document.getElementById('latest-Product-list');
    data.forEach(item => {
        // Create Card Container
        const CardContainer = document.createElement('div');
        CardContainer.className = 'card';
        CardContainer.style.width = '200px';
        
        // Create Card Image
        const CardImage = document.createElement('img');
        CardImage.className = 'card-img-top';
        CardImage.src = item.ImageSrc;
        CardImage.alt = 'Image';
        CardImage.style.width = '200px';
        CardImage.style.height = '150px';
        CardContainer.appendChild(CardImage);

        // Create Card Body
        const CardBody = document.createElement('div');
        CardBody.className = 'card-body';
        CardContainer.appendChild(CardBody);

        // Create Card Title
        const Title = document.createElement('h5');
        Title.className = 'card-title';
        Title.textContent = item.Title;
        CardBody.appendChild(Title);

        // Create Card Price
        const Price = document.createElement('h4');
        Price.textContent = `₹${item.Price}`;
        CardBody.appendChild(Price);

        // Create Card Text
        const CardText = document.createElement('p');
        CardText.className = 'card-text';
        CardText.textContent = item.Discription.length > 50 ? item.Discription.substring(0, 100) + '...' : item.Discription;
        CardBody.appendChild(CardText);

        // Create Add to Cart Button
        const Button = document.createElement('button');
        Button.className = 'btn btn-primary CartButton';
        Button.id = `CartButton${item.id}`;
        Button.textContent = 'Add To Cart';
        CardBody.appendChild(Button);
        Button.onclick = () => {
            AddToCart(item.id);
        };
        
        const GoButton = document.createElement('button');
        GoButton.className = 'btn btn-primary';
        GoButton.style.marginLeft = '10px';
        GoButton.textContent = '>'
        GoButton.onclick = () =>{
            window.location = `/ProductView.html#${item.id}`
        }
        CardBody.appendChild(GoButton)

        // Create Increment Decrement Container
        const IncreDcreContainer = document.createElement('div');
        IncreDcreContainer.id = `Incre-Dcre${item.id}`;
        IncreDcreContainer.className = 'IncreDcre';
        IncreDcreContainer.style.display = 'none';

        // Create Increment Decrement Controls
        const IncreDcre = document.createElement('div');
        IncreDcre.className = 'quantity-controls';

        // Create Decrement Button
        const DecrementButton = document.createElement('button');
        DecrementButton.textContent = '-';
        DecrementButton.onclick = () => {
            changeQuantity(item.id, -1);
        };
        IncreDcre.appendChild(DecrementButton);

        // Create Quantity Display
        const QuantityDisplay = document.createElement('p');
        QuantityDisplay.id = `Quantity${item.id}`;
        QuantityDisplay.textContent = '1';
        IncreDcre.appendChild(QuantityDisplay);

        // Create Increment Button
        const IncrementButton = document.createElement('button');
        IncrementButton.textContent = '+';
        IncrementButton.onclick = () => {
            changeQuantity(item.id, 1);
        };
        IncreDcre.appendChild(IncrementButton);
        IncreDcreContainer.appendChild(IncreDcre);
        CardContainer.appendChild(IncreDcreContainer);

        // Append the card to the appropriate category
        if (item.Filter === "Shirts & T-shirts" && ShirtsCard) {
            ShirtsCard.appendChild(CardContainer);
        } else if (item.Filter === "Jeans" && JeansCard) {
            JeansCard.appendChild(CardContainer);
        } else if (item.Filter === "Watches" && WatchesCard) {
            WatchesCard.appendChild(CardContainer);
        } else if (item.Filter === "shoes" && ShoesCard) {
            ShoesCard.appendChild(CardContainer);
        } else if(item.Filter === 'Latest'){
           latestProducts.appendChild(CardContainer)
        }
    });
}

function AddToCart(id) {
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const item = data.find(item => id === item.id);
        let CartCount = document.getElementById('CartCount');
        const AddToCartButtons = document.getElementById(`CartButton${id}`);
        const IncreDcreElements = document.getElementById(`Incre-Dcre${id}`);
        AddToCartButtons.style.display = 'none';
        IncreDcreElements.style.display = 'block';
        count += 1;
        CartCount.innerHTML = count;
        // Check if item is already in the cart
        let itemInCart = cart.find(cartItem => cartItem.id === item.id);
    
        if (itemInCart) {
            // If the item is already in the cart, increase the quantity
            itemInCart.quantity += 1;
        } else {
            // If the item is not in the cart, add it
            const newItem = {...item, quantity: 1 }; // Create a new object with quantity property
            cart.push(newItem);
        }
        updateGrandTotal();
        displayCartItems();
    })
    .catch(error => {
        console.log(error);
    });
}

function changeQuantity(id, change) {
    const Quantity = document.getElementById('Quantity' + id);
    const ItemChange = cart.find(item => item.id === id);
    const AddToCartButtons = document.getElementById(`CartButton${id}`);
    const IncreDcreElements = document.getElementById(`Incre-Dcre${id}`);
    let CartCount = document.getElementById('CartCount');
    
    if (ItemChange) {
        ItemChange.quantity += change;
        if (ItemChange.quantity < 1) {
            AddToCartButtons.style.display = 'block';
            IncreDcreElements.style.display = 'none';
        }
        Quantity.innerHTML = ItemChange.quantity;
        count += change;
        if (count < 0) {
            count = 0;
        }
        CartCount.innerHTML = count;
        
        if (ItemChange.quantity === 0) {
            cart = cart.filter(item => item.id !== id);
            console.log(cart)
            AddToCartButtons.style.display = 'block';
            IncreDcreElements.style.display = 'none';
        }
    }
    
    updateGrandTotal();
    displayCartItems();
}

function updateGrandTotal() {
    grandTotal = 0; // Reset the grand total
    cart.forEach(item => {
        grandTotal += parseInt(item.Price.replace(',', '')) * item.quantity;
    });
    document.getElementById('GrandTotal').innerHTML = `\u20b9${grandTotal.toFixed(2)}`; // Display with currency symbol and fixed to 2 decimal places
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    document.getElementById(`CartButton${id}`).style.display = 'block';
    document.getElementById(`Incre-Dcre${id}`).style.display = 'none';
    count = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('CartCount').innerHTML = count;
    updateGrandTotal();
    displayCartItems();
}

function displayCartItems() {
    let cartItems = document.getElementById('cartItems');    
    const CartCount = document.getElementById('CartCount');
    const CartCounting = document.getElementById('CartCounting');
    console.log(CartCount.textContent)
    CartCounting.innerHTML = CartCount.textContent;
    cartItems.innerHTML = '';
    // Display each item in the cart
    cart.forEach(item => {
        let cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.ImageSrc}" alt="${item.Title}" style="width: 50px; height: 50px;">
            <span>${item.Title}</span>
            <span>\u20b9${(item.Price)}</span>
            <span>Quantity: <span id="Quantity${item.id}">${item.quantity}</span></span>
            <span>Total: \u20b9${(item.quantity * item.Price.replace(',' , ''))}</span>
            <div class="IcreDcre" style="display: flex;">
                <div class="quantity-controls">
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    <p id="Quantity${item.id}">${item.quantity}</p>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="btn btn-primary" style="margin-left: 4px;" onclick="removeFromCart(${item.id})"><i class="fa fa-trash" aria-hidden="true"></i></button>
            
        `;
        cartItems.appendChild(cartItem);
    });
}

function displayCart() {
    const CartDisplay = document.getElementById('CartDisplay');
    // Toggle cart display
    CartDisplay.style.display = CartDisplay.style.display === 'none' ? 'block' : 'none';
}

function filter(){
    const Filter = document.getElementById('filter');
    if(Filter.style.display === 'none'){
        Filter.style.display = 'block';
    }else{
        Filter.style.display = 'none';
    }
}

function filterProducts() {
    const MainProducts = document.getElementById('MainProducts');
    const FilterSection = document.getElementById('FilterSection');
    const priceRange = document.getElementById('price-range').value;
    const selectedCategories = Array.from(document.querySelectorAll('.form-check-input:checked')).map(checkbox => checkbox.value);
    const data_json = 'data.json';
    fetch(data_json)
    .then(response => response.json())
    .then(data=>{
      selectedCategories.forEach(ItemSelected => {
          data.forEach(item => {
            if(ItemSelected === item.Filter){
                MainProducts.style.display = 'none';
                    FilterSection.style.display = 'block';
                if (priceRange >= parseInt(item.Price.replace(',', ''))){
                     
                    const FilterProducts = document.getElementById('filter-product');
                     // Create Card Container
                    const CardContainer = document.createElement('div');
                    CardContainer.className = 'card';
                    CardContainer.style.width = '200px';
            
                    // Create Card Image
                    const CardImage = document.createElement('img');
                    CardImage.className = 'card-img-top';
                    CardImage.src = item.ImageSrc;
                    CardImage.alt = 'Image';
                    CardImage.style.width = '200px';
                    CardImage.style.height = '150px';
                    CardContainer.appendChild(CardImage);
            
                    // Create Card Body
                    const CardBody = document.createElement('div');
                    CardBody.className = 'card-body';
                    CardContainer.appendChild(CardBody);
            
                    // Create Card Title
                    const Title = document.createElement('h5');
                    Title.className = 'card-title';
                    Title.textContent = item.Title;
                    CardBody.appendChild(Title);
            
                    // Create Card Price
                    const Price = document.createElement('h4');
                    Price.textContent = `₹${item.Price}`;
                    CardBody.appendChild(Price);
            
                    // Create Card Text
                    const CardText = document.createElement('p');
                    CardText.className = 'card-text';
                    CardText.textContent = item.Discription.length > 50 ? item.Discription.substring(0, 100) + '...' : item.Discription;
                    CardBody.appendChild(CardText);
            
                    // Create Add to Cart Button
                    const Button = document.createElement('button');
                    Button.className = 'btn btn-primary CartButton';
                    Button.id = `CartButton${item.id}`;
                    Button.textContent = 'Add To Cart';
                    CardBody.appendChild(Button);
                    Button.onclick = () => {
                        AddToCart(item.id);
                    };
            
                    // Create Increment Decrement Container
                    const IncreDcreContainer = document.createElement('div');
                    IncreDcreContainer.id = `Incre-Dcre${item.id}`;
                    IncreDcreContainer.className = 'IncreDcre';
                    IncreDcreContainer.style.display = 'none';
            
                    // Create Increment Decrement Controls
                    const IncreDcre = document.createElement('div');
                    IncreDcre.className = 'quantity-controls';
            
                    // Create Decrement Button
                    const DecrementButton = document.createElement('button');
                    DecrementButton.textContent = '-';
                    DecrementButton.onclick = () => {
                        changeQuantity(item.id, -1);
                    };
                    IncreDcre.appendChild(DecrementButton);
            
                    // Create Quantity Display
                    const QuantityDisplay = document.createElement('p');
                    QuantityDisplay.id = `Quantity${item.id}`;
                    QuantityDisplay.textContent = '1';
                    IncreDcre.appendChild(QuantityDisplay);
            
                    // Create Increment Button
                    const IncrementButton = document.createElement('button');
                    IncrementButton.textContent = '+';
                    IncrementButton.onclick = () => {
                        changeQuantity(item.id, 1);
                    };
                    IncreDcre.appendChild(IncrementButton);
                    IncreDcreContainer.appendChild(IncreDcre);
                    CardContainer.appendChild(IncreDcreContainer);
                    FilterProducts.appendChild(CardContainer);
                    
                }
                
            }
          });
      });

    })
}


function getItemIdFromHash() {
    return window.location.hash.substring(1);
}
const itemId = getItemIdFromHash();
MainCard(itemId)
function MainCard(id){
    console.log(id)
    fetch('data.json')
       .then(response =>{
        if(!response.ok){
            console.log("Error on Response");
        }
        return response.json()
       })
       .then(data =>{
        const Item = data.find(item => parseInt(id)===item.id)
        const ImageId = document.getElementById('ImageId');
        const MainCardTitle = document.getElementById('MainCardTitle');
        const MainCardPrice = document.getElementById('MainCardPrice');
        const MainCardDescription = document.getElementById('MainCardDescription');
        ImageId.src = Item.ImageSrc;
        MainCardTitle.innerHTML = Item.Title;
        MainCardPrice.innerText = '\u20b9'+Item.Price;
        MainCardDescription.innerHTML = Item.Discription;
        data.forEach(entry => {
            if(Item.Filter === entry.Filter){
               const RelatedProduct = document.getElementById('related-product-cards');
               //Related-Product-Card
               const RelatedProductCard = document.createElement('div');
               RelatedProductCard.className = 'related-product-card';
               

               //card Image
               const RelatedCardImage = document.createElement('img');
               RelatedCardImage.src = entry.ImageSrc;
               RelatedCardImage.alt = entry.Title;
               RelatedCardImage.style.width = '200px';
               RelatedCardImage.style.height = '200px';
               RelatedProductCard.appendChild(RelatedCardImage)

               // Related Card Body
               const RelatedProductInfo = document.createElement('div')
               RelatedProductInfo.className = 'related-product-info';
               RelatedProductCard.appendChild(RelatedProductInfo)

               //Related  product title
               const RelatedProductTitle = document.createElement('p');
               RelatedProductTitle.className = 'related-product-title';
               RelatedProductTitle.textContent = entry.Title;
               RelatedProductInfo.appendChild(RelatedProductTitle);

               // Realted Card Price
               const RelatedProductPrice = document.createElement('p')
               RelatedProductPrice.className = 'related-product-price';
               RelatedProductPrice.textContent = '\u20b9'+entry.Price;
               RelatedProductInfo.appendChild(RelatedProductPrice)

               RelatedProduct.appendChild(RelatedProductCard);
            }
        });
         });
}

function CheckItOut() {
    if (cart <= 0){
        alert("No More Items ,Please Add Items!")
        console.log("No More Items ,Please Add Items!")
    }else{
        const CheckItOut = document.getElementById('CheckItOut');
        const CartDisplay = document.getElementById('CartDisplay');
        const OrderSummary = document.getElementById('order-summary');
        
        // Clear existing order summary if it exists
        OrderSummary.innerHTML = '';
    
        // Table
        const CheckItOutTable = document.createElement('table');
        OrderSummary.appendChild(CheckItOutTable);
    
        // Table row (Heading)
        const CheckItOutTableRow_Heading = document.createElement('tr');
        CheckItOutTable.appendChild(CheckItOutTableRow_Heading);
    
        // Table headings
        const headings = ['Item', 'Quantity', 'Price'];
        headings.forEach(heading => {
            const th = document.createElement('th');
            th.textContent = heading;
            CheckItOutTableRow_Heading.appendChild(th);
        });
    
        let grandTotal = 0;
    
        cart.forEach(item => {
            // Table Row for data
            const CheckItOutTableRow_Data = document.createElement('tr');
            CheckItOutTable.appendChild(CheckItOutTableRow_Data);
            
            // Table data
            const CheckItOutTableData_1 = document.createElement('td');
            CheckItOutTableData_1.textContent = item.Title;
            CheckItOutTableRow_Data.appendChild(CheckItOutTableData_1);
    
            const CheckItOutTableData_2 = document.createElement('td');
            CheckItOutTableData_2.textContent = item.quantity;
            CheckItOutTableRow_Data.appendChild(CheckItOutTableData_2);
    
            const itemTotalPrice = parseInt(item.quantity) * parseInt(item.Price.replace(',', ''));
            const CheckItOutTableData_3 = document.createElement('td');
            CheckItOutTableData_3.textContent = '\u20b9' + itemTotalPrice;
            CheckItOutTableRow_Data.appendChild(CheckItOutTableData_3);
    
            grandTotal += itemTotalPrice;
        });
    
        // Delivery Charges Table Row
        const deliveryCharges = 50.00;
    
        const DeliveryChargesTableRow = document.createElement('tr');
        CheckItOutTable.appendChild(DeliveryChargesTableRow);
    
        const DeliveryChargesData1 = document.createElement('td');
        DeliveryChargesData1.textContent = 'Delivery Charges';
        DeliveryChargesTableRow.appendChild(DeliveryChargesData1);
    
        const DeliveryChargesData2 = document.createElement('td');
        DeliveryChargesData2.textContent = '';
        DeliveryChargesTableRow.appendChild(DeliveryChargesData2);
    
        const DeliveryChargesData3 = document.createElement('td');
        DeliveryChargesData3.textContent = '\u20b9' + deliveryCharges.toFixed(2);
        DeliveryChargesTableRow.appendChild(DeliveryChargesData3);
    
        // Update grand total to include delivery charges
        grandTotal += deliveryCharges;
    
        // Total Heading Section
        const TotalHeading = document.createElement('tr');
        CheckItOutTable.appendChild(TotalHeading);
    
        const TotalData1 = document.createElement('td');
        TotalData1.textContent = 'Total';
        TotalHeading.appendChild(TotalData1);
    
        const TotalData2 = document.createElement('td');
        TotalData2.textContent = '';
        TotalHeading.appendChild(TotalData2);
    
        const TotalData3 = document.createElement('td');
        TotalData3.textContent = '\u20b9' + grandTotal.toFixed(2);
        TotalHeading.appendChild(TotalData3);
    
        // Toggle display of CheckItOut and CartDisplay
        if (CheckItOut.style.display === 'none') {
            CheckItOut.style.display = 'block'; 
            CartDisplay.style.display = 'none';
        } else {
            CheckItOut.style.display = 'none';
            CartDisplay.style.display = 'block';
        }
    }
}
function ShippingForm() {
    const Name = document.getElementById('ShippingName').value;
    const Address = document.getElementById('address').value;
    const City = document.getElementById('city').value;
    const State = document.getElementById('state').value;
    const ZIP = document.getElementById('zip').value;
    const Country = document.getElementById('country').value;
    const Phone = document.getElementById('phone').value;
    const OrderNo = Date.now() + Math.floor(Math.random() * 1000);
    // Assuming `cart`, `count`, and `grandTotal` are defined somewhere in your code.
    const ShippingFormData = {
        "OrderNo":OrderNo,
        "Name": Name,
        "Address": Address,
        "City": City,
        "State": State,
        "ZIP": ZIP,
        "Country": Country,
        "Phone": Phone,
        "cart": cart,
        "Total-Item": count,
        "Total": grandTotal,
    };
    console.log(ShippingFormData);

    // Retrieve existing orders from local storage or initialize as an empty array
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Add the new order to the orders array
    orders.push(ShippingFormData);

    // Store the updated orders array back to local storage
    localStorage.setItem('orders', JSON.stringify(orders));
    window.location = '/orders.html'
    console.log('Updated orders:', orders);
}


function generateOrderCard(order) {
    // Format the date
    const orderDate = new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Generate HTML for the order card
    return `
        <div class="card mb-3">
            <div class="card-horizontal p-3">
                <div class="img-square-wrapper me-3">
                    <img class="" src="/assests/img/order-placed-purchased-icon.webp" alt="Card image cap" width="150px">
                </div>
                <div class="card-body">
                    <h5 class="card-title">Order Placed</h5>
                    <p class="card-text">Order No: <span class="text-muted">${order.OrderNo}</span></p>
                    <p class="card-text">Total Amount: <span class="text-muted">$${order.Total}</span></p>
                    <p class="card-text">Status: <span class="order-status">Processing..</span></p>
                    <button class="btn btn-primary view-details-btn" data-order='${JSON.stringify(order)}'>View Details</button>
                </div>
            </div>
        </div>`;
}

document.addEventListener("DOMContentLoaded", function() {
    // Add event listener to all view details buttons
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retrieve order data from data-order attribute
            const orderData = JSON.parse(this.getAttribute('data-order'));
            // Call function to show order details popup
            showOrderDetailsPopup(orderData);
        });
    });
});

function showOrderDetailsPopup(order) {
    // Set the modal body content with order details
    const modalBody = document.getElementById('orderDetailsBody');

    // Generate HTML for cart items
    const cartItemsHTML = order.cart.map(item => `<li>${item.Title} - Quantity: ${item.quantity}</li>`).join('');

    modalBody.innerHTML = `
        <p>Name: ${order.Name}</p>
        <p>Address: ${order.Address}</p>
        <p>City: ${order.City}</p>
        <p>State: ${order.State}</p>
        <p>ZIP: ${order.ZIP}</p>
        <p>Country: ${order.Country}</p>
        <p>Phone: ${order.Phone}</p>
        
        <p>Cart:</p>
        <ul>${cartItemsHTML}</ul>
        
        <p>Total Items: ${order['Total-Item']}</p>
        <p>Total: ${order.Total}</p>
    `;

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    modal.show();
}


function fetchOrders() {
    // Retrieve orders from local storage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Log the fetched orders to the console
    console.log('Fetched orders:', orders);
    
    // Reference to the order container element
    const orderContainer = document.getElementById('orderContainer');
    
    // Clear any existing content in the order container
    orderContainer.innerHTML = '';

    // Loop through each order and generate HTML for order cards
    orders.forEach(order => {
        // Generate HTML for the order card
        const orderCardHTML = generateOrderCard(order);
        
        // Create a div element to hold the order card HTML
        const orderCardDiv = document.createElement('div');
        orderCardDiv.classList.add('col-md-6'); // Set Bootstrap column class
        
        // Set the innerHTML of the div to the generated order card HTML
        orderCardDiv.innerHTML = orderCardHTML;
        
        // Append the order card div to the order container
        orderContainer.appendChild(orderCardDiv);
    });
}