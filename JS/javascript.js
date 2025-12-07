    let cart = [];
    let totalCents = 0;

    window.addEventListener("DOMContentLoaded", () => {

        // Load Cart from localStorage
        const savedCart = localStorage.getItem("cart");
        const savedTotal = localStorage.getItem("totalCents");
        if (savedCart) cart = JSON.parse(savedCart);
        if (savedTotal) totalCents = parseInt(savedTotal);

        updateCart();

        //Load Font Preference (sessionStorage)
        const savedFont = sessionStorage.getItem("fontPreference");
        if (savedFont) {
            document.body.style.fontFamily = savedFont;
            const fontSelect = document.getElementById("fontSelect");
            if (fontSelect) fontSelect.value = savedFont;
        }

        // Font change listener
        const fontSelect = document.getElementById("fontSelect");
        if (fontSelect) {
            fontSelect.addEventListener("change", () => {
                const selectedFont = fontSelect.value;
                document.body.style.fontFamily = selectedFont;
                sessionStorage.setItem("fontPreference", selectedFont);
            });
        }
        // Load Username from Cookies
        const username = getCookie('username');
        if (username) {
            document.getElementById('greeting').textContent = `Welcome back, ${username}!`;
            const loginField = document.getElementById('usernameInput');
            if (loginField) loginField.style.display = 'none';
        }

    // Load Currency Preference
        const savedCurrency = getCookie('preferredCurrency');
        const currencySelect = document.getElementById("currencySelect");
        if (savedCurrency && currencySelect) {
            currencySelect.value = savedCurrency;
        }
        if (currencySelect) {
            currencySelect.addEventListener("change", () => {
                setCookie("preferredCurrency", currencySelect.value, 30);
            });
        }

        //Load Shipping Preference
        const savedShipping = getCookie('shippingMethod');
        const shippingSelect = document.getElementById("shippingMethod");
        if (savedShipping && shippingSelect) {
            shippingSelect.value = savedShipping;
        }
        if (shippingSelect) {
            shippingSelect.addEventListener("change", () => {
                setCookie("shippingMethod", shippingSelect.value, 30);
            });
        }
    });

    // CART FUNCTIONS

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("totalCents", totalCents.toString());
    }

    function addToCart(name, price, image) {
        const priceCents = Math.round(price * 100);
        cart.push({ name, priceCents, image });
        totalCents += priceCents;
        updateCart();
        saveCart();
        showNotification(`${name} added to cart`);
    }

    function updateCart() {
        const cartItems = document.getElementById("cart-items");
        const totalElement = document.getElementById("total");
        cartItems.innerHTML = "";

        if (cart.length === 0) {
            cartItems.innerHTML = `<p class="empty">Your cart is empty.</p>`;
        } else {
            cart.forEach((item, index) => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <strong>${item.name}</strong><br>
                        R${(item.priceCents / 100).toFixed(2)}
                    </div>
                    <button class="remove-btn" onclick="removeItem(${index})">❌</button>
                `;
                cartItems.appendChild(li);
            });
        }

        if (totalElement) totalElement.textContent = (totalCents / 100).toFixed(2);

        const cartCount = document.getElementById("cart-count");
        if (cartCount) cartCount.textContent = cart.length;
    }

    function removeItem(index) {
        totalCents -= cart[index].priceCents;
        cart.splice(index, 1);
        updateCart();
        saveCart();
    }

    function toggleCart() {
        const dropdown = document.getElementById("cart-dropdown");
        if (dropdown) dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }

    function clearCart() {
        cart = [];
        totalCents = 0;

        localStorage.removeItem("cart");
        localStorage.removeItem("totalCents");

        updateCart();
        showNotification("Cart cleared");
    }

    function resetAllPreferences() {
        // Clear cart
        cart = [];
        totalCents = 0;
        localStorage.removeItem("cart");
        localStorage.removeItem("totalCents");

        // Delete cookies
        deleteCookie("username");
        deleteCookie("preferredCurrency");
        deleteCookie("shippingMethod");

        // Clear all sessionStorage
        sessionStorage.clear();

        // Reset greeting
        const greeting = document.getElementById("greeting");
        if (greeting) greeting.textContent = "";

        // Show login input again
        const loginField = document.getElementById("usernameInput");
        if (loginField) loginField.style.display = "block";

        // Reset dropdowns
        const currencySelect = document.getElementById("currencySelect");
        if (currencySelect) currencySelect.value = "ZAR";

        const shippingSelect = document.getElementById("shippingMethod");
        if (shippingSelect) shippingSelect.value = "standard";

        updateCart();
        showNotification("Preferences reset");
    }

    //Cookie function


    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) return decodeURIComponent(value);
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }

    //   Login Function

    function loginUser() {
        const username = document.getElementById('usernameInput').value.trim();
        if (!username) return;

        setCookie('username', username, 30);

        document.getElementById('greeting').textContent = `Welcome back, ${username}!`;

    // Hide input and buttons
        const loginBtn = document.querySelector('.user-auth .login');
        const signupBtn = document.querySelector('.user-auth .signup');
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';


        const loginInput = document.getElementById('usernameInput');
        if (loginInput) loginInput.style.display = 'none';
    }

    // Sign-up function
    function signupUser() {
        const usernameInput = document.getElementById('usernameInput');
        const username = usernameInput.value.trim();
        if (!username) {
            alert('Please enter a name to sign up.');
        return;
    }
    // Hide login and signup buttons
        document.querySelector('.user-auth .login').style.display = 'none';
        document.querySelector('.user-auth .signup').style.display = 'none';
        setCookie('username', username, 30);
    document.getElementById('greeting').textContent = `Welcome, ${username}!`;
        
    // Hide input after signup
        if (usernameInput) usernameInput.style.display = 'none';
    }

    //Notification Popup

    function showNotification(message) {
        const note = document.getElementById("notification");
        if (!note) return;

        note.textContent = message;
        note.classList.add("show");

        setTimeout(() => note.classList.remove("show"), 2000);
    }

    if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.cached) {
        const notification = document.getElementById('cache-notification');
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
        }
    });
    }
