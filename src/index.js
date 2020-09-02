//HELPER METHODS
const ce = (item) => document.createElement(item)
const qs = (tag) => document.querySelector(tag)

//GLOBAL VARIABLES
const baseUrl = 'http://localhost:3000/quotes?_embed=likes'
const quotesUrl = 'http://localhost:3000/quotes/'
const likesUrl = 'http://localhost:3000/likes/'
const quoteList = qs('#quote-list')
const newForm = qs('#new-quote-form')

async function getQuotes() {
  let response = await fetch(baseUrl)
  let quotes = await response.json()
  renderQuotes(quotes)
}

const renderQuotes = (quotes) => {
  quoteList.innerHTML = ""
  for (const quote of quotes) {
    renderQuote(quote)
  }
}

const renderQuote = (quote) => {
  const li = ce('li')
  li.classList.add('quote-card')
  li.dataset.id = quote.id

  li.innerHTML = `
  <blockquote class="blockquote">
  <p class="mb-0">${quote.quote}</p>
  <footer class="blockquote-footer">${quote.author}</footer>
  <br>
  <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
  <button class='btn-danger'>Delete</button>
  <button class='btn-secondary' style="visibility: visible;" data-edit-id='${quote.id}'>Edit</button>
  <div class='edit-form' data-id='${quote.id}'></div>
  </blockquote>
  `

  quoteList.append(li)
}

/* SUBMIT NEW QUOTE
√ 1. QS THE FORM
√ 2. GRAB THE SUBMIT
√ 3. ADDEVENTLISTENER & PREVENTDEFAULT
√ 4. FETCH WITH POST REQUEST
√ 5. RENDER NEW LIST OF QUOTES
*/

const newQuote = () => {
  newForm.addEventListener('submit', e => {
    e.preventDefault();
    form = e.target

    const quote = form.quote
    const author = form.author

    const newQuote = quote.value
    const newAuthor = author.value

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        'quote': newQuote,
        'author': newAuthor
      })
    }

    fetch(quotesUrl, options)
      .then(resp => resp.json())
      .then(getQuotes)

    quote.value = ''
    author.value = ''
  })
}

/* DELETE NEW QUOTE
√ 1. CREATE A CLICKHANDLER
√ 2. ADD EVENTLISTENER THAT GETS TO DELETE BUTTON
√ 3. CREATE SEPARATE DELETE METHOD
√ 4. FETCH WITH DELETE REQUEST
√ 5. RENDER NEW LIST OF QUOTES
*/

const clickHandler = () => {
  quoteList.addEventListener('click', e => {
    const quoteId = e.target.closest('li').dataset.id
    if (e.target.matches('.btn-danger')) {
      deleteQuote(quoteId)
      getQuotes()
    }
    if (e.target.matches('.btn-success')) {
      createLike(quoteId)
      getQuotes()
    }
    if (e.target.matches('.btn-secondary')) {
      const button = e.target
      button.style.visibility = 'hidden'
      editQuote(quoteId)
    }
  })
}

const deleteQuote = (quoteId) => {
  fetch(quotesUrl + quoteId, {
    method: 'DELETE'
  })
}

/* CREATE NEW LIKE
√ 1. ADD EVENTLISTENER THAT GETS TO LIKES BUTTON WITHIN CLICK HANDLER
√ 2. CREATE SEPARATE NEW LIKE METHOD
√ 3. FETCH REQUEST TO LIKE WITH POST METHOD
√ 4. RENDER NEW COUNT OF LIKE
*/

const createLike = (quoteId) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      'quoteId': parseInt(quoteId),
      'createdAt': Date.now()
    })
  }

  fetch(likesUrl, options)
    .then(resp => resp.json())
    .then(getQuotes)
}

/* ADD EDIT BUTTON
√ 1. CREATE EDIT BUTTON IN INITIAL RENDERING
√ 2. ADD BUTTON TO CLICKHANDLER
√ 3. CREATE FORM FROM PUSH OF BUTTON
√ 4. CREATE EDIT METHOD SIMILAR TO NEWQUOTE FORM
√ 5. FETCH REQUEST USING PATCH
*/

const editQuote = (quoteId) => {
  const editForm = ce('form')
  const editDiv = document.querySelectorAll('.edit-form')
  const editDivArr = Array.from(editDiv)
  const singleDiv = editDivArr.find(item => (item.dataset.id === quoteId))
  const blockquote = singleDiv.closest('blockquote')
  const quoteInput = blockquote.querySelector('p')
  const authorInput = blockquote.querySelector('footer')

  editForm.innerHTML = `
  <div class="form-group mt-3">
  <label for="edit-quote">Quote</label>
  <input name="quote" type="text" class="form-control" id="edit-quote" placeholder="quote" value="${quoteInput.innerText}">
  </div>
  <div class="form-group">
  <label for="Author">Author</label>
  <input name="author" type="text" class="form-control" id="author" placeholder="Flatiron School" value="${authorInput.innerText}">
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
  `
  blockquote.append(editForm)

  editForm.addEventListener('submit', e => {
    e.preventDefault()
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        'quote': editForm.quote.value,
        'author': editForm.author.value
      })
    }

    fetch(quotesUrl + quoteId, options)
      .then(resp => resp.json())
      .then(getQuotes())
  })
}

const sortButton = () => {
  const button = ce('button')
  button.id = 'sort'
  button.classList.add('btn', 'btn-warning', 'mt-3', 'mb-3')
  button.innerText = 'Sort by Author First Name'
  const body = qs('body')
  body.prepend(button)


  button.addEventListener('click', e => {
    const quoteListArr = Array.from(quoteList.querySelectorAll('footer'))
    const authorNamesArr = quoteListArr.map(footer => footer.innerText)
    if (e.target.innerText === 'Sort by Author') {
      const alphabetical = authorNamesArr.sort()
      debugger
    }
  })
}

clickHandler()
newQuote()
getQuotes()
sortButton()

/* 
Extend Your Learning
Add a sort button that can be toggled on or off. When off the list of quotes will appear sorted by the ID. When the sort is active, it will display the quotes by author's name, alphabetically.
One way of doing this is to sort the quotes in JS after you've retrieved them from the API. Try this way first.
Another way of doing this is to make a fetch to http://localhost:3000/quotes?_sort=author
What are the pros and cons in doing the sorting on the client vs. the server? Discuss with a partner. */