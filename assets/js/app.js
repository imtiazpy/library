const searchBtn = document.getElementById('search-btn');
const errorMessage = document.getElementById('error-message');
const totalFound = document.getElementById('total-found');
const searchResult = document.getElementById('search-result');
const spinner = document.getElementById('spinner');


searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchField = document.getElementById('search-field');
    const searchText = searchField.value;

    // clearing search field value 
    searchField.value = '';

    // clearing previous search result 
    searchResult.textContent = '';

    // hiding previous error message 
    handleError(false);

    // hiding previous total found message 
    totalFound.innerText = '';

    if (!searchText) {
        handleError("Please Type in a book name", true)
    } else {
        toggleSpinner(true);
        fetchData(searchText);
    }
});


const fetchData = async (searchText) => {
    const url = `https://openlibrary.org/search.json?q=${searchText}`;
    const res = await fetch(url);
    const data = await res.json();
    showBook(data);
}


const showBook = async (data) => {
    const bookList = await data.docs

    const searchResult = document.getElementById('search-result');

    if (bookList.length === 0) {
        toggleSpinner(false);
        handleError("No books found with the name, Try another one", true)
    } else {
        // showing total found
        totalFound.innerText = `Total Book found ${bookList.length}`;

        // showing the found books
        bookList.slice(0, 20).forEach(book => {

            const div = document.createElement('div');
            div.classList.add('col');

            try {
                div.innerHTML = `
                    <div id="card" class="card h-100 rounded-3">
                        <div class="p-2" style="height: 350px">
                            <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg"    class="card-img-top img-fluid h-100 rounded-3" alt="...">
                        </div>
                        <div class="card-body">
                            <h4 class="card-title">${book.title ? book.title : 'Not Found'}</h4>
                            <h6>Author: ${book.author_name ? book.author_name[0] : 'Not Found'}</h6>
                            <p>
                                First published in: ${book.first_publish_year ? book.first_publish_year : 'Not Found'}
                            </p>
                            <p>publisher: ${book.publisher ? book.publisher[0] : 'Not Found'}</p>
                        </div>
                    </div>    
                `
                searchResult.appendChild(div);
                handleError(false)
                toggleSpinner(false);
            } catch (error) {
                //In case any property does not exist.
            }
        })
    }
};



const handleError = (msg = '', toShow) => {
    if (toShow) {
        // errorMessage is globally defined
        errorMessage.innerText = msg;
        errorMessage.classList.remove('d-none');
    } else {
        errorMessage.classList.add('d-none');
    }
}


const toggleSpinner = (bool) => {
    if (bool) {
        spinner.classList.remove('d-none');
    } else {
        spinner.classList.add('d-none')
    }
};