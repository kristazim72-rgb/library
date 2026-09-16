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
