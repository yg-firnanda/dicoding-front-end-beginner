const dataBook = JSON.parse(localStorage.getItem('dataBook')) || [];

function updateLocalStorage() {
    localStorage.setItem('dataBook', JSON.stringify(dataBook));
}

function createBookCard(book) {
    const card = document.createElement('div');
    card.classList.add('card', 'w-100', 'd-inline-block', 'p-3');

    const statusButton = book.isFinishRead
    ? `<button class="bg-primary border-0 rounded text-white fs-6" onclick="moveBook(this)">Unfinished Read</button>`
    : `<button class="bg-primary border-0 rounded text-white fs-6" onclick="moveBook(this)">Finish Read</button>`;

    card.innerHTML = `
        <span class="badge bg-primary">${book.year}</span>
        <h5 class="card-title">${book.title}</h5>
        <p class="card-text">${book.author}</p>
        ${statusButton}
        <button class="bg-danger border-0 rounded delete-card" onclick="deleteBook(this)">
            <i class="uil uil-trash-alt text-white fs-5"></i>
        </button>
    `;
    card.dataset.status = book.isFinishRead ? 'finishRead' : 'unFinishedRead';
    return card;
}

function addBook(event) {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const isFinishRead = document.getElementById('isFinishRead').checked;

    const existingBook = dataBook.find(book => book.title === title);
    if (existingBook) {
        alert('Book title must be unique!');
        event.preventDefault();
        return;
    }

    const book = { title, author, year, isFinishRead };
    dataBook.push(book);

    updateLocalStorage();

    const targetRackId = isFinishRead ? 'finishRead' : 'unFinishedRead';

    const card = createBookCard(book);

    document.getElementById(targetRackId).appendChild(card);

    document.getElementById('title').value = "";
    document.getElementById('author').value = "";
    document.getElementById('year').value = "";

    event.preventDefault();
}

function moveBook(button) {
    const card = button.parentElement;
    const currentStatus = card.dataset.status;
    const targetRackId = currentStatus === 'finishRead' ? 'unFinishedRead' : 'finishRead';

    if (currentStatus === 'finishRead') {
        button.innerText = 'Finish Read';
    } else {
        button.innerText = 'Unfinished Read';
    }

    document.getElementById(targetRackId).appendChild(card);
    card.dataset.status = targetRackId;

    const bookTitle = card.querySelector('h5').innerText;
    const bookIndex = dataBook.findIndex(book => book.title === bookTitle);
    dataBook[bookIndex].isFinishRead = !dataBook[bookIndex].isFinishRead;
    updateLocalStorage();
}

function deleteBook(button) {
    const card = button.parentElement;
    const bookTitle = card.querySelector('h5').innerText;
    const bookIndex = dataBook.findIndex(book => book.title === bookTitle);

    if (bookIndex > -1) {
        dataBook.splice(bookIndex, 1);
        updateLocalStorage();
    }

    card.remove();
}

function loadBooks() {
    dataBook.forEach(book => {
        const card = createBookCard(book);
        const targetRackId = book.isFinishRead ? 'finishRead' : 'unFinishedRead';
        document.getElementById(targetRackId).appendChild(card);
    });
}

const finishRead = document.getElementById('finishRead');
const unFinishedRead = document.getElementById('unFinishedRead');

loadBooks();