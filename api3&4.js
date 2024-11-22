const apiUrl = 'https://crudcrud.com/api/601369662ff040fb8fbd241adcf4512e/unicorns'; // Change this to your actual API endpoint

let users = [];
let currentUserId = null;

async function handleFormSubmit(event){
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const userData = { username, email, phone };

    try {
        if (currentUserId) {
            // Update existing user with POST
            await axios.post(apiUrl, userData);
            // Delete the previous user after posting new details
            await axios.delete(`${apiUrl}/${currentUserId}`);
            currentUserId = null; // Reset the current user ID
        } else {
            // Create new user
            const response = await axios.post(apiUrl, userData);
            users.push(response.data);
        }
        clearFormFields();
        displayUsers();
    } catch (error) {
        console.error('Error saving user:', error.response ? error.response.data : error.message);
    }
}

async function displayUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    try {
        const response = await axios.get(apiUrl);
        users = response.data;

        users.forEach((user) => {
            const listItem = document.createElement('li');
            listItem.textContent = `Username: ${user.username}, Email: ${user.email}, Phone: ${user.phone}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteUser(user._id);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editUser(user);

            listItem.appendChild(deleteButton);
            listItem.appendChild(editButton);
            userList.appendChild(listItem);
        });
     } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
    }
}


async function deleteUser(userId){
    try {
        await axios.delete(`${apiUrl}/${userId}`);
        displayUsers();
    } catch (error) {
        console.error('Error deleting user:', error.response ? error.response.data : error.message);
    }
}

function editUser(user) {
    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone;
    currentUserId = user._id; // Set the current user ID for later use
}

function clearFormFields() {
    document.getElementById('username').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
}

window.onload = displayUsers;
