class Book {
  constructor(title, author, pages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = Number(pages);
    this.read = Boolean(read);
  }

  info() {S
    const readStatus = this.read ? "already read" : "not read yet";
    return `${this.title} by ${this.author}, ${this.pages} pages, ${readStatus}`;
  }

  toggleRead() {
    this.read = !this.read;
  }
}

class Library {
  constructor() {
    this.books = [];
  }

  addBook(title, author, pages, read) {
    const book = new Book(title, author, pages, read);
    this.books.push(book);
    return book;
  }

  removeBook(id) {
    const index = this.books.findIndex((b) => b.id === id);
    if (index !== -1) this.books.splice(index, 1);
  }

  toggleBookRead(id) {
    const book = this.books.find((b) => b.id === id);
    if (book) book.toggleRead();
  }
}

class LibraryUI {
  constructor(library) {
    this.library = library;

    this.container = document.querySelector("#library-container");
    this.dialog = document.querySelector("#book-dialog");
    this.newBookBtn = document.querySelector("#new-book-btn");
    this.closeDialogBtn = document.querySelector("#close-dialog");
    this.form = document.querySelector("#book-form");

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    this.newBookBtn.addEventListener("click", () => this.dialog.showModal());
    this.closeDialogBtn.addEventListener("click", () => this.dialog.close());

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.container.addEventListener("click", (e) => this.handleCardClick(e));
  }

  handleSubmit(e) {
    e.preventDefault();

    const title = document.querySelector("#title").value.trim();
    const author = document.querySelector("#author").value.trim();
    const pages = document.querySelector("#pages").value;
    const read = document.querySelector("#read").checked;

    this.library.addBook(title, author, pages, read);
    this.render();

    this.form.reset();
    this.dialog.close();
  }

  handleCardClick(e) {
    const isDelete = e.target.classList.contains("delete-btn");
    const isToggle = e.target.classList.contains("toggle-btn");
    if (!isDelete && !isToggle) return;

    const card = e.target.closest(".book-card");
    if (!card) return;

    const { id } = card.dataset;

    if (isDelete) this.library.removeBook(id);
    else this.library.toggleBookRead(id);

    this.render();
  }

  render() {
    this.container.innerHTML = "";

    for (const book of this.library.books) {
      const card = document.createElement("div");
      card.classList.add("book-card");
      card.dataset.id = book.id;

      card.innerHTML = `
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Pages: ${book.pages}</p>
        <p>Status: ${book.read ? "Read" : "Not Read Yet"}</p>
        <button class="toggle-btn">Toggle Status</button>
        <button class="delete-btn">Delete</button>
      `;

      this.container.appendChild(card);
    }
  }
}

const library = new Library();
new LibraryUI(library);