const myLibrary = [];

// Constructor Function
function Book(title, author, pages, read) {
  this.id = crypto.randomUUID(); // Stable unique identifier
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read; // true/false
}

// Prototype Methods
Book.prototype.info = function () {
  const readStatus = this.read ? "already read" : "not read yet";
  return `${this.title} by ${this.author}, ${this.pages} pages, ${readStatus}`;
};

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

// Adds books to array
function addBookToLibrary(title, author, pages, read) {
  const newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);
}

// DOM elements
const libraryContainer = document.querySelector("#library-container");
const dialog = document.querySelector("#book-dialog");
const newBookBtn = document.querySelector("#new-book-btn");
const closeDialogBtn = document.querySelector("#close-dialog");
const bookForm = document.querySelector("#book-form");

//Renders books to grid
function displayBooks() {
  libraryContainer.innerHTML = ""; // Clears existing elements to avoid duplicate renders

  myLibrary.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.dataset.id = book.id; // Attaches an ID to dataset for event delegation

    bookCard.innerHTML = `
      <h3>${book.title}</h3>
      <p>Author: ${book.author}</p>
      <p>Pages: ${book.pages}</p>
      <p>Status: ${book.read ? "Read" : "Not Read Yet"}</p>
      <button class="toggle-btn">Toggle Status</button>
      <button class="delete-btn">Delete</button>
    `;

    libraryContainer.appendChild(bookCard);
  });
}

//Dialog modal event listeners
newBookBtn.addEventListener("click", () => dialog.showModal());
closeDialogBtn.addEventListener("click", () => dialog.close());

//Form submission handler
bookForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Stop standard form page reload

  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;
  const read = document.querySelector("#read").checked; // Read boolean state

  addBookToLibrary(title, author, pages, read);
  displayBooks();

  bookForm.reset();
  dialog.close();
});

//Event delegation for toggle and delete buttons
libraryContainer.addEventListener("click", (e) => {
  const isDeleteBtn = e.target.classList.contains("delete-btn");
  const isToggleBtn = e.target.classList.contains("toggle-btn");

  // Ignore clicks that aren't on action buttons
  if (!isDeleteBtn && !isToggleBtn) return;

  const card = e.target.closest(".book-card");
  if (!card) return;

  const bookId = card.dataset.id;
  const bookIndex = myLibrary.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) return;

  if (isDeleteBtn) {
    myLibrary.splice(bookIndex, 1);
  } else if (isToggleBtn) {
    myLibrary[bookIndex].toggleRead();
  }

  displayBooks(); // Refresh UI after updating array
});