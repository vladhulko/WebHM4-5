document.addEventListener("DOMContentLoaded", function () {
    const pizzaMenu = document.getElementById("pizza-menu");
    const orderItemsContainer = document.querySelector(".order-items");
    const orderQuantity = document.querySelector(".order-quantity");
    const orderSum = document.querySelector(".sum");
    const clearOrderButton = document.querySelector(".clear-order");
    const filterButtons = document.querySelectorAll(".filters button");
    const filterNameElement = document.querySelector(".filter-name");
    const totalQuantityElement = document.getElementById("amount-main");

    let pizzaInfo = [];
    let order = JSON.parse(localStorage.getItem("order")) || [];

    function fetchPizzas() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                pizzaInfo = data;
                renderPizzas(pizzaInfo);
                updateTotalQuantity(pizzaInfo.length);
            })
            .catch(error => console.error("Error fetching pizzas:", error));
    }

    function renderPizzas(pizzas) {
        pizzaMenu.innerHTML = "";
        pizzas.forEach(pizza => {
            const pizzaItem = createPizzaItem(pizza);
            pizzaMenu.appendChild(pizzaItem);
        });
    }

    function filterPizzas(filter) {
        let filteredPizzas;

        if (filter === "all") {
            filteredPizzas = pizzaInfo;
        } else if (filter === "meat") {
            filteredPizzas = pizzaInfo.filter(pizza => pizza.content.meat && pizza.content.meat.length > 0);
        } else if (filter === "pineapple") {
            filteredPizzas = pizzaInfo.filter(pizza => pizza.content.pineapple && pizza.content.pineapple.length > 0);
        } else if (filter === "mushroom") {
            filteredPizzas = pizzaInfo.filter(pizza => pizza.content.mushroom && pizza.content.mushroom.length > 0);
        } else if (filter === "seafood") {
            filteredPizzas = pizzaInfo.filter(pizza => pizza.content.ocean && pizza.content.ocean.length > 0);
        } else if (filter === "vegan") {
            filteredPizzas = pizzaInfo.filter(pizza => pizza.type === "Веган піца");
        }

        const filteredQuantity = filteredPizzas.length;

        const filterNameElement = document.querySelector(".filter-name span.total-quantity");
        filterNameElement.textContent = filteredQuantity;

        renderPizzas(filteredPizzas);
        updateActiveFilterButton(filter);
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.removeAttribute('chosen'));

            this.setAttribute('chosen', 'chosen');
        });
    });

    function updateTotalQuantity(quantity) {
        totalQuantityElement.textContent = quantity;
    }

    function updateFilterName(filter) {
        const filterNames = {
            "all": "Усі піци",
            "meat": "М'ясні піци",
            "pineapple": "Піци з ананасами",
            "mushroom": "Піци з грибами",
            "seafood": "Піци з морепродуктами",
            "vegan": "Веган піци"
        };
        filterNameElement.textContent = filterNames[filter];
    }

    function updateActiveFilterButton(activeButton) {
        filterButtons.forEach(button => {
            if (button === activeButton) {
                button.setAttribute("chosen", "chosen");
            } else {
                button.removeAttribute("chosen");
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const filter = event.target.getAttribute("content");
            filterPizzas(filter);
            updateActiveFilterButton(event.target);
        });
    });

    function createPizzaItem(pizza) {
        const pizzaItem = document.createElement("div");
        pizzaItem.classList.add("pizza-item");

        const img = document.createElement("img");
        img.src = pizza.icon;
        img.alt = pizza.title;
        img.classList.add("pizza-icon");

        const title = document.createElement("span");
        title.textContent = pizza.title;
        title.classList.add("pizza-title");

        const type = document.createElement("span");
        type.textContent = pizza.type;
        type.classList.add("pizza-type");

        const content = document.createElement("span");
        content.classList.add("pizza-content");

        const ingredientsList = document.createElement("span");
        ingredientsList.classList.add("pizza-ingredients");

        let ingredientsArray = [];

        for (const category in pizza.content) {
            const ingredients = pizza.content[category];
            ingredients.forEach(ingredient => {
                ingredientsArray.push(ingredient.toLowerCase());
            });
        }

        ingredientsList.textContent = ingredientsArray.join(', ');

        pizzaItem.appendChild(img);
        pizzaItem.appendChild(title);
        pizzaItem.appendChild(type);
        pizzaItem.appendChild(content);
        pizzaItem.appendChild(ingredientsList);

        const sizesContainer = document.createElement("div");
        sizesContainer.classList.add("sizes-container");

        if (pizza.small_size) {
            const smallSize = createPizzaSizeElement(pizza.small_size, pizza, "small");
            sizesContainer.appendChild(smallSize);
        }

        if (pizza.big_size) {
            const bigSize = createPizzaSizeElement(pizza.big_size, pizza, "big");
            sizesContainer.appendChild(bigSize);
        }

        pizzaItem.appendChild(sizesContainer);

        if (pizza.is_popular) {
            const popularIndicator = document.createElement("div");
            popularIndicator.textContent = "Популярна";
            popularIndicator.classList.add("indicator", "popular");
            pizzaItem.appendChild(popularIndicator);
        }

        if (pizza.is_new) {
            const newIndicator = document.createElement("div");
            newIndicator.textContent = "Нова";
            newIndicator.classList.add("indicator", "new");
            pizzaItem.appendChild(newIndicator);
        }

        return pizzaItem;
    }

    function createPizzaSizeElement(size, pizza, sizeType) {
        const sizeContainer = document.createElement("div");
        sizeContainer.classList.add("pizza-size");

        const sizeDetails = document.createElement("div");
        sizeDetails.classList.add("size-details");

        const sizeImg = document.createElement("img");
        sizeImg.src = "size-icon.svg";
        sizeImg.alt = "Розмір";
        sizeImg.classList.add("size-icon");
        sizeDetails.appendChild(sizeImg);

        const sizeText = document.createElement("span");
        sizeText.textContent = `${size.size} см`;
        sizeText.classList.add("size-text");
        sizeDetails.appendChild(sizeText);

        sizeContainer.appendChild(sizeDetails);

        const weightDetails = document.createElement("div");
        weightDetails.classList.add("weight-details");

        const weightImg = document.createElement("img");
        weightImg.src = "weight.svg";
        weightImg.alt = "Вага";
        weightImg.classList.add("weight-icon");
        weightDetails.appendChild(weightImg);

        const weightText = document.createElement("span");
        weightText.textContent = `${size.weight} г`;
        weightText.classList.add("weight-text");
        weightDetails.appendChild(weightText);

        sizeContainer.appendChild(weightDetails);

        const price = document.createElement("span");
        price.classList.add("pizza-price");
        price.textContent = `${size.price} грн.`;

        const buyButton = document.createElement("button");
        buyButton.textContent = "Купити";
        buyButton.classList.add("buy-button");
        buyButton.addEventListener("click", () => {
            addToOrder(pizza, size, sizeType);
        });

        price.appendChild(buyButton);
        sizeContainer.appendChild(price);

        return sizeContainer;
    }

    function addToOrder(pizza, size, sizeType) {
        const existingItem = order.find(item => item.id === pizza.id && item.size === size.size);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            order.push({
                id: pizza.id,
                icon: pizza.icon,
                title: pizza.title,
                size: size.size,
                sizeValue: `${size.size} см`,
                weight: size.weight,
                price: size.price,
                quantity: 1,
                sizeType: sizeType === "big" ? "Велика" : "Мала"
            });
        }

        updateLocalStorage();
        renderOrderItems();
        updateOrderSummary();
    }

    function updateLocalStorage() {
        localStorage.setItem("order", JSON.stringify(order));
    }

    function calculateTotalOrderQuantity() {
        return order.reduce((sum, item) => sum + item.quantity, 0);
    }

    function calculateTotalOrderSum() {
        return order.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    function updateOrderSummary() {
        orderQuantity.textContent = calculateTotalOrderQuantity();
        orderSum.textContent = `${calculateTotalOrderSum()} грн`;
    }

    function renderOrderItems() {
        orderItemsContainer.innerHTML = "";

        order.forEach((item) => {
            const orderPizza = document.createElement("div");
            orderPizza.classList.add("order-pizza");

            const orderItem = document.createElement("div");
            orderItem.classList.add("order-item");

            const orderName = document.createElement("div");
            orderName.textContent = `${item.title} (${item.sizeType})`;
            orderName.classList.add("order-name");

            const orderCharacteristics = document.createElement("div");
            orderCharacteristics.classList.add("order-characteristics");

            const sizeImg = document.createElement("img");
            sizeImg.src = "size-icon.svg";
            sizeImg.alt = "size";
            orderCharacteristics.appendChild(sizeImg);

            const sizeText = document.createElement("span");
            sizeText.textContent = item.sizeValue;
            orderCharacteristics.appendChild(sizeText);

            const weightImg = document.createElement("img");
            weightImg.src = "weight.svg";
            weightImg.alt = "weight";
            orderCharacteristics.appendChild(weightImg);

            const weightText = document.createElement("span");
            weightText.textContent = item.weight;
            orderCharacteristics.appendChild(weightText);

            const orderPrice = document.createElement("div");
            orderPrice.classList.add("order-price");

            const priceText = document.createElement("span");
            priceText.textContent = `${item.price * item.quantity} грн`;

            const decreaseButton = document.createElement("button");
            decreaseButton.textContent = "-";
            decreaseButton.classList.add("order-button-decrease");
            decreaseButton.addEventListener("click", () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    order = order.filter((orderItem) => orderItem !== item);
                }
                updateLocalStorage();
                renderOrderItems();
                updateOrderSummary();
            });

            const quantityText = document.createElement("span");
            quantityText.textContent = item.quantity;

            const increaseButton = document.createElement("button");
            increaseButton.textContent = "+";
            increaseButton.classList.add("order-button-increase");
            increaseButton.addEventListener("click", () => {
                item.quantity++;
                updateLocalStorage();
                renderOrderItems();
                updateOrderSummary();
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "X";
            deleteButton.classList.add("order-button-delete");
            deleteButton.addEventListener("click", () => {
                order = order.filter((orderItem) => orderItem !== item);
                updateLocalStorage();
                renderOrderItems();
                updateOrderSummary();
            });

            orderPrice.appendChild(priceText);
            orderPrice.appendChild(decreaseButton);
            orderPrice.appendChild(quantityText);
            orderPrice.appendChild(increaseButton);
            orderPrice.appendChild(deleteButton);

            orderItem.appendChild(orderName);
            orderItem.appendChild(orderCharacteristics);
            orderItem.appendChild(orderPrice);

            const orderImage = document.createElement("div");
            orderImage.classList.add("order-image");

            const pizzaImage = document.createElement("img");
            pizzaImage.src = item.icon;
            pizzaImage.alt = item.title;
            pizzaImage.classList.add("cut-pizza");

            orderImage.appendChild(pizzaImage);

            orderPizza.appendChild(orderItem);
            orderPizza.appendChild(orderImage);
            orderItemsContainer.appendChild(orderPizza);
        });
    }

    clearOrderButton.addEventListener("click", () => {
        order = [];
        updateLocalStorage();
        renderOrderItems();
        updateOrderSummary();
    });

    fetchPizzas();
    renderOrderItems();
    updateOrderSummary();
});
