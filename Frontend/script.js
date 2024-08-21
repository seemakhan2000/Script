console.log('script is loaded');

//currentPage: Tracks the current page number for pagination (starts at 1).
let currentPage = 1;
const limit = 100; // limit: The number of users to be fetched per page (100 users)
let allUsers = []; // allUsers: An array that will store all the fetched users.

// Function to fetch users
async function fetchUsers(page = 1) {
    console.log('fetchUsers');
    try {
        const response = await fetch(`http://localhost:8003/users?page=${page}&limit=${limit}`);
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const users = await response.json();
        console.log('Fetched users:', users);

        allUsers = users; // Store fetched users globally
        displayUsers(users); // Display users in the table

        currentPage = page; // Update the current page after data is fetched
        updatePagination(); // Update pagination buttons
    } catch (error) {
        console.log('user not found');
    }
}

// Function to display users in the table
function displayUsers(users) {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user._id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to filter users based on search input
function filterUsers() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
//filter: Iterates over each user in the allUsers array.
//includes: Checks if username, email, or phone
    const filteredUsers = allUsers.filter(user => {
        return user.username.toLowerCase().includes(searchInput) ||
            user.email.toLowerCase().includes(searchInput) ||
            user.phone.includes(searchInput); // Phone doesn't need .toLowerCase() as it's numeric
    });

    displayUsers(filteredUsers);
}

// Function to update pagination
function updatePagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Assume you know the total number of pages; adjust as necessary
    const totalPages = 10; // Example value, replace with actual total pages if available

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.disabled = i === currentPage; // Disable button for the current page
        button.addEventListener('click', () => fetchUsers(i));
        pagination.appendChild(button);
    }
}

// Function to generate data
async function generateData() {
    console.log('generateData');
    console.time('generateData'); // Start timing
    try {
        const response = await fetch('http://localhost:8003/populate', {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error('Failed to generate data');
        }
        // Fetch users after generating new data
        await fetchUsers();
        console.timeEnd('generateData'); // End timing
    } catch (error) {
        console.log('Error generating data:', error);
    }
}

// Function to delete all users in batches
async function deleteAllUsers() {
    console.log('Delete button clicked');
    console.time('deleteAllUsers'); // Start timing
    try {
        const response = await fetch('http://localhost:8003/deleteAll', {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete users');
        }
        // Fetch users after deletion
        await fetchUsers(currentPage); // Fetch users with the current page number
        console.timeEnd('deleteAllUsers'); // End timing
    } catch (error) {
        console.log('Error deleting users:', error);
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers(); // Fetch users for the initial page load
    document.getElementById('generateButton').addEventListener('click', generateData);
    document.getElementById('DeleteButton').addEventListener('click', deleteAllUsers);
    document.getElementById('searchInput').addEventListener('input', filterUsers); // Add search input listener
});
