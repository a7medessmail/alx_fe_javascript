// Array to store quotes
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living, or get busy dying.", category: "Motivation" }
];

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

// Call loadQuotes() when the page loads to get stored quotes
loadQuotes();

// Call populateCategories() to populate dropdown with categories
populateCategories();
