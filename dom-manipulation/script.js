// Array to store quotes
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living, or get busy dying.", category: "Motivation" }
];

// Function to simulate server interaction and fetch quotes periodically using mock API
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();
    
    // Transform mock API data into our quote structure
    const formattedServerQuotes = serverQuotes.slice(0, 5).map(post => ({
      text: post.title,  // Using post title as quote text
      category: "General"  // Mock category
    }));

    // Call the syncQuotes function to update localStorage with the server data
    syncQuotes(formattedServerQuotes);
  } catch (error) {
    console.error("Error fetching data from server:", error);
  }
}

// Function to sync localStorage data with server data
function syncQuotes(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  // Simulate conflict resolution: server data takes precedence
  if (serverQuotes.length > localQuotes.length) {
    // If the server has more quotes, replace the localStorage data
    localStorage.setItem('quotes', JSON.stringify(serverQuotes));
    quotes = serverQuotes; // Update the quotes array
    showSyncNotification("Quotes synced with server!");  // Show notification
  } else {
    showSyncNotification("Local data is up to date.");  // Show notification if local data is up to date
  }

  // Re-populate the category filter and display quotes after sync
  populateCategories();
  displayQuotes(quotes);
}

// Function to display notification for sync success or failure
function showSyncNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = 'block';

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// Function to populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Get unique categories from quotes
  const categories = new Set(quotes.map(quote => quote.category));
  
  // Add categories to dropdown
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Load the last selected category from localStorage
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
    filterQuotes(); // Apply the filter on page load
  }
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  
  // Save the selected category in localStorage
  localStorage.setItem('lastSelectedCategory', selectedCategory);

  // Filter quotes based on the selected category
  const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  
  // Select a random quote from the filtered quotes
  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  
  // Display the random quote
  displayQuotes([randomQuote]);
}

// Function to display quotes
function displayQuotes(filteredQuotes) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";  // Clear the previous quote

  // Display each filtered quote
  filteredQuotes.forEach(quote => {
    const div = document.createElement("div");
    div.textContent = `"${quote.text}" - ${quote.category}`;
    quoteDisplay.appendChild(div);
  });
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();  // Save to LocalStorage after adding new quote
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");

    // Re-populate the categories after adding a new quote
    populateCategories();
  } else {
    alert("Please fill in both fields.");
  }
}

// Save quotes to LocalStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from LocalStorage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }
}

// Function to post data to the server using a mock API
async function postDataToServer() {
  const url = 'https://jsonplaceholder.typicode.com/posts'; // Mock API

  // Prepare data to be sent to the server (for example, a new quote)
  const newQuote = {
    title: "This is a new quote", // Example text for new quote
    body: "This is a body of the new quote",
    userId: 1, // Mock user ID
  };

  try {
    // Send data to the server using POST with proper headers
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Correct header for JSON data
      },
      body: JSON.stringify(newQuote), // Convert object to JSON string
    });

    if (!response.ok) {
      throw new Error('Failed to post data');
    }

    const data = await response.json();
    console.log('Data posted successfully:', data);
    alert('Quote posted successfully!');
  } catch (error) {
    console.error('Error posting data:', error);
    alert('There was an error posting the quote.');
  }
}

// Function to export quotes as a JSON file
function exportQuotes() {
  // Convert quotes array to JSON
  const quotesJSON = JSON.stringify(quotes, null, 2);

  // Create a Blob from the JSON string
  const blob = new Blob([quotesJSON], { type: 'application/json' });

  // Create a link element for downloading
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'quotes.json'; // The name of the file

  // Programmatically click the link to trigger the download
  link.click();
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes = importedQuotes;  // Update the quotes array with imported data
      saveQuotes();  // Save the imported quotes to localStorage
      populateCategories();  // Re-populate categories dropdown
      displayQuotes(quotes);  // Display the imported quotes
      alert('Quotes imported successfully!');
    } catch (error) {
      alert('Error importing quotes. Please make sure the file is a valid JSON format.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Call loadQuotes() when the page loads to get stored quotes
loadQuotes();

// Call populateCategories() to populate dropdown with categories
populateCategories();

// Call fetchQuotesFromServer() to simulate fetching data from the server
fetchQuotesFromServer();

// Periodically check for new quotes every 10 seconds
setInterval(fetchQuotesFromServer, 10000); // Fetch every 10 seconds

// Add event listener to "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Create the "Add Quote" form dynamically when the page loads
createAddQuoteForm();
