window.Playground.Search = (() => {
  let ctrlKeyTimer = null
  let ctrlKeyStarted = null

  const searchInput = document.getElementById('search-input')
  const searchResult = document.getElementById('search-result')
  const noSearchResult = document.getElementById('no-search-result')
  const searchOverlay = document.getElementById('search-dialog-overlay')
  const searchDialod = document.getElementById('search-dialog')

  let search = ''

  function onKeyDown(event) {
    if (event.ctrlKey)
      handleCtrlKey()

    if (isOpen()) {
      if (event.key === 'Escape' && isOpen())
        closeSearch()

      return 'stop'
    }
    else {
      if (event.key === 'k' || event.key === 'K') {
        if (event.ctrlKey || event.metaKey) {
          Playground.Search.openSearch()
          event.preventDefault()
        }
      }
      if (event.key === 'F3') {
        Playground.Search.openSearch()
        event.preventDefault()
      }
    }
  }

  searchInput.addEventListener('input', onSearch)

  function handleCtrlKey() {
    if (event.ctrlKey) {
      if (ctrlKeyStarted === null) {
        ctrlKeyStarted = Date.now()

        ctrlKeyTimer = setTimeout(resetCtrlKey, 400)
      }
      else {
        resetCtrlKey()
        if (isOpen())
          closeSearch()
        else
          openSearch() // TODO, move implementation to here
      }
    }
  }
  function resetCtrlKey() {
    clearTimeout(ctrlKeyTimer)
    ctrlKeyStarted = null
    ctrlKeyTimer = null
  }

  function openSearch() {
    searchOverlay.style.display = 'block'
    searchDialod.open = 'open'
    searchInput.focus()
  }

  function closeSearch() {
    searchOverlay.style.display = 'none'
    searchDialod.open = 'closed'
    clearSearch()
  }

  function isOpen() {
    return searchOverlay.style.display === 'block'
  }
  function clearSearch() {
    search = ''
    searchInput.value = search
  }

  function onSearch(event) {
    const searchString = event.target.value

    console.log('searchString', searchString)
    if (searchString === '') {
      noSearchResult.style.display = 'flex'
      searchResult.style.display = 'none'
    }
    else {
      const searchResults = Playground.allSearchResultEntries.filter(
        entry => entry.name.toLowerCase().includes(searchString.toLowerCase()),
      )
      console.log('searchResults', searchResults)
      if (searchResults.length === 0) {
        noSearchResult.style.display = 'flex'
        searchResult.style.display = 'none'
      }
      else {
        noSearchResult.style.display = 'none'
        searchResult.style.display = 'flex'
        searchResult.innerHTML = searchResults.map(entry => entry.html).join('')
      }
    }
  }

  return {
    openSearch,
    closeSearch,
    clearSearch,
    onKeyDown,
  }
})()
