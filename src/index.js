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
  })
}

const deleteQuote = (quoteId) => {
  fetch(quotesUrl + quoteId, {
    method: 'DELETE'
  })
}

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

/* CREATE NEW LIKE
  1. ADD EVENTLISTENER THAT GETS TO LIKES BUTTON WITHIN CLICK HANDLER
  2. CREATE SEPARATE NEW LIKE METHOD
  3. FETCH REQUEST TO LIKE WITH POST METHOD
  4. RENDER NEW COUNT OF LIKE
*/



clickHandler()
newQuote()
getQuotes()

/* 
Clicking the like button will create a like for this particular quote in the API and update the number of likes displayed on the page without having to refresh.

Use a POST request to http://localhost:3000/likes
The body of the request should be a JSON object containing a key of quoteId, with an integer value. Use the ID of the quote you're creating the like for — e.g. { quoteId: 5 } to create a like for quote 5.
IMPORTANT: if the quoteID is a string for some reason (for example, if you've pulled the ID from a dataset) the index page will not include the like you create on any quote.
Bonus (not required): add a createdAt key to your object to track when the like was created. Use UNIX time (the number of seconds since January 1, 1970). The documentation for the JS Date class may be helpful here!
Extend Your Learning
Add an edit button to each quote-card that will allow the editing of a quote. (Hint: there is no 'correct' way to do this. You can try creating a hidden form that will only show up when hitting the edit button.)
Currently, the number of likes of each post does not persist on the frontend after we refresh, as we set the beginning value to 0. Include an additional fetch to always have an updated number of likes for each post. You will send a GET request to http://localhost:3000/likes?quoteId= and interpolate the id of a given post.
Add a sort button that can be toggled on or off. When off the list of quotes will appear sorted by the ID. When the sort is active, it will display the quotes by author's name, alphabetically.
One way of doing this is to sort the quotes in JS after you've retrieved them from the API. Try this way first.
Another way of doing this is to make a fetch to http://localhost:3000/quotes?_sort=author
What are the pros and cons in doing the sorting on the client vs. the server? Discuss with a partner. */