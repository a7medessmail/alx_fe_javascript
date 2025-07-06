// Array to store quotes
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living, or get busy dying.", category: "Motivation" }
];

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" - ${quote.category}`;
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
  } else {
    alert("Please fill in both fields.");
  }
}

// Function to export quotes as JSON
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);  // Revoke the URL after download
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();  // Save the newly imported quotes to LocalStorage
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Attach event listener to "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Call loadQuotes() when the page loads to get stored quotes
loadQuotes();

// Call createAddQuoteForm to dynamically add the form when the page loads
createAddQuoteForm();

// Create the form to add new quotes dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteFormContainer");

  const quoteTextInput = document.createElement("input");
  quoteTextInput.id = "newQuoteText";
  quoteTextInput.type = "text";
  quoteTextInput.placeholder = "Enter a new quote";

  const quoteCategoryInput = document.createElement("input");
  quoteCategoryInput.id = "newQuoteCategory";
  quoteCategoryInput.type = "text";
  quoteCategoryInput.placeholder = "Enter quote category";

  const addQuoteButton = document.createElement("button");
  addQuoteButton.textContent = "Add Quote";
  addQuoteButton.onclick = addQuote;

  // Append the elements to the form container
  formContainer.appendChild(quoteTextInput);
  formContainer.appendChild(quoteCategoryInput);
  formContainer.appendChild(addQuoteButton);

  // Add export and import buttons
  const exportButton = document.createElement("button");
  exportButton.textContent = "Export Quotes to JSON";
  exportButton.onclick = exportQuotes;
  formContainer.appendChild(exportButton);

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = ".json";
  importInput.onchange = importFromJsonFile;
  formContainer.appendChild(importInput);
}
