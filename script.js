class Book {
  constructor(title, author, pages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = Number(pages);
    this.read = Boolean(read);
  }

  info() {
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

    // Inputs to validate
    this.titleInput = document.querySelector("#title");
    this.authorInput = document.querySelector("#author");
    this.pagesInput = document.querySelector("#pages");

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    this.newBookBtn.addEventListener("click", () => this.dialog.showModal());
    this.closeDialogBtn.addEventListener("click", () => this.closeDialog());

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.container.addEventListener("click", (e) => this.handleCardClick(e));

    // Live validation as the user types/inputs data
    [this.titleInput, this.authorInput, this.pagesInput].forEach((input) => {
      input.addEventListener("input", () => this.validateField(input));
    });
  }

  validateField(input) {
    const errorSpan = input.nextElementSibling;

    if (input.validity.valid) {
      if (errorSpan && errorSpan.classList.contains("error")) {
        errorSpan.textContent = "";
      }
      input.classList.remove("invalid");
      input.classList.add("valid");
      return true;
    }

    // Custom Error Messages
    if (input.id === "title") {
      if (input.validity.valueMissing) {
        errorSpan.textContent = "The book title must be filled!";
      } else if (input.validity.tooShort) {
        errorSpan.textContent = "Title must be at least 2 characters.";
      }
    } else if (input.id === "author") {
      if (input.validity.valueMissing) {
        errorSpan.textContent = "The author name must be filled!";
      } else if (input.validity.tooShort) {
        errorSpan.textContent = "Author name must be at least 2 characters.";
      }
    } else if (input.id === "pages") {
      if (input.validity.valueMissing) {
        errorSpan.textContent = "Please enter the number of pages.";
      } else if (input.validity.rangeUnderflow) {
        errorSpan.textContent = "Page count must be at least 1.";
      }
    }

    input.classList.remove("valid");
    input.classList.add("invalid");
    return false;
  }

  handleSubmit(e) {
    e.preventDefault();

    // Validate all fields on submit
    const isTitleValid = this.validateField(this.titleInput);
    const isAuthorValid = this.validateField(this.authorInput);
    const isPagesValid = this.validateField(this.pagesInput);

    if (!isTitleValid || !isAuthorValid || !isPagesValid) {
      return; // Block submission if errors exist
    }

    const title = this.titleInput.value.trim();
    const author = this.authorInput.value.trim();
    const pages = this.pagesInput.value;
    const read = document.querySelector("#read").checked;

    this.library.addBook(title, author, pages, read);
    this.render();

    this.closeDialog();
  }

  closeDialog() {
    this.form.reset();
    
    // Clear validation states and error text when closing
    [this.titleInput, this.authorInput, this.pagesInput].forEach((input) => {
      input.classList.remove("valid", "invalid");
      const errorSpan = input.nextElementSibling;
      if (errorSpan && errorSpan.classList.contains("error")) {
        errorSpan.textContent = "";
      }
    });

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