const apiUrl = 'https://crudcrud.com/api/132322d465414bb09e8091d4f04161f3/unicorns'; 
//Ye ek endpoint hai jahan se data fetch, save, update, aur delete hota hai.

//It uses Axios for making API calls and performs operations such as adding, displaying, categorizing, updating, and deleting products from an external API.

// axios:Axios is a popular JavaScript library used to make HTTP requests from a web browser or Node.js.

let products = [];  
// products: Ek array jo API se fetched products ko store karta hai.
// currentProductId: Agar kisi product ko update karna ho, toh uska ID yahan store hota hai.
let currentProductId = null;  

// Naya product add karna ya existing product ko update karna.
async function handleFormSubmit(event) {
    event.preventDefault(); //Default form reload ko prevent karta hai.

    // Form fields (sellingPrice, productName, category) se data le kar ek object (productData) me store karta hai.
    const sellingPrice = document.getElementById('sellingPrice').value;
    const productName = document.getElementById('productName').value;
    const category = document.getElementById('category').value;

    const productData = { sellingPrice, productName, category };

    try {
        if (currentProductId) {
            // Update existing product
            await axios.post(apiUrl, productData);
            await axios.delete(`${apiUrl}/${currentProductId}`);
            currentProductId = null; // Reset the current product ID
        } else {
            
            // Adds a new product to the API and stores it in the products array.
            const response = await axios.post(apiUrl, productData);
            products.push(response.data);
        }
        clearFormFields();// Form fields ko reset karta hai.
        displayProducts();//Updated list ko dikhata hai.
    } catch (error) {
        console.error('Error saving product:', error.response ? error.response.data : error.message);
    }
}


// Products ko category-wise organize karna
async function displayProducts() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    // Categories to display
    const categories = ['skincare', 'food', 'electronics'];

    const productsHeader = document.createElement('h1');
    productsHeader.textContent = 'Products';
    userList.appendChild(productsHeader);

    try {
        // Fetches all products from the API and stores them in the products array.
        const response = await axios.get(apiUrl);
        products = response.data;

        // Create a map to categorize products
        // Groups the products into categories.
        const categorizedProducts = categories.reduce((acc, category) => {
            acc[category] = products.filter(product => product.category === category);
            return acc;
        }, {});

       
        // Add a header (h3) for the category.
        // Add each product under its respective category.
        for (const [category, items] of Object.entries(categorizedProducts)) {
            const categoryHeader = document.createElement('h3');
            categoryHeader.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Items`;
            userList.appendChild(categoryHeader);

            items.forEach((product) => {
                const listItem = document.createElement('li');
                listItem.textContent = `Product Name: ${product.productName}, Selling Price: ${product.sellingPrice}`;
                
                // Add margin to indent the items under their respective categories
                listItem.style.marginLeft = '30px'; // Indent the item

                // Adds a "Delete Order" button next to each product.
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete Order';
                deleteButton.onclick = () => deleteProduct(product._id);

                // Append the delete button at the end of the list item
                listItem.appendChild(deleteButton);
                userList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error('Error fetching products:', error.response ? error.response.data : error.message);
    }
}


// Sends a DELETE request to the API with the product's ID.
// Refreshes the product list to reflect the change.
async function deleteProduct(productId) {
    try {
        await axios.delete(`${apiUrl}/${productId}`);
        displayProducts();
    } catch (error) {
        console.error('Error deleting product:', error.response ? error.response.data : error.message);
    }
}


// Clears the input fields in the form.
function clearFormFields() {
    document.getElementById('sellingPrice').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('category').value = '';
}

window.onload = displayProducts;


