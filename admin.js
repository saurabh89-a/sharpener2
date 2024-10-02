const apiUrl = 'https://crudcrud.com/api/852d403b5b94454db87d2fc6ac2680b2/admin'; // Change this to your actual API endpoint

let products = [];
let currentProductId = null;

async function handleFormSubmit(event) {
    event.preventDefault();

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
            // Create new product
            const response = await axios.post(apiUrl, productData);
            products.push(response.data);
        }
        clearFormFields();
        displayProducts();
    } catch (error) {
        console.error('Error saving product:', error.response ? error.response.data : error.message);
    }
}

async function displayProducts() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    // Categories to display
    const categories = ['skincare', 'food', 'electronics'];

    const productsHeader = document.createElement('h1');
    productsHeader.textContent = 'Products';
    userList.appendChild(productsHeader);

    try {
        const response = await axios.get(apiUrl);
        products = response.data;

        // Create a map to categorize products
        const categorizedProducts = categories.reduce((acc, category) => {
            acc[category] = products.filter(product => product.category === category);
            return acc;
        }, {});

        // Display categories and products
        for (const [category, items] of Object.entries(categorizedProducts)) {
            const categoryHeader = document.createElement('h3');
            categoryHeader.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Items`;
            userList.appendChild(categoryHeader);

            items.forEach((product) => {
                const listItem = document.createElement('li');
                listItem.textContent = `Product Name: ${product.productName}, Selling Price: ${product.sellingPrice}`;
                
                // Add margin to indent the items under their respective categories
                listItem.style.marginLeft = '30px'; // Indent the item

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

async function deleteProduct(productId) {
    try {
        await axios.delete(`${apiUrl}/${productId}`);
        displayProducts();
    } catch (error) {
        console.error('Error deleting product:', error.response ? error.response.data : error.message);
    }
}

function clearFormFields() {
    document.getElementById('sellingPrice').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('category').value = '';
}

window.onload = displayProducts;
