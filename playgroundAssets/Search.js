window.Playground.Search = (() => {
  let ctrlKeyTimer = null
  let ctrlKeyStarted = null
  let selectedIndex = null
  let onCloseCallback = null

  const searchInput = document.getElementById('search-input')
  const searchIntro = document.getElementById('search-intro')
  const searchResult = document.getElementById('search-result')
  const noSearchResult = document.getElementById('no-search-result')
  const searchOverlay = document.getElementById('search-dialog-overlay')
  const searchDialog = document.getElementById('search-dialog')

  searchInput.addEventListener('input', onSearch)
  searchOverlay.addEventListener('click', closeSearch)
  searchDialog.addEventListener('click', (event) => {
    searchInput.focus()
    event.stopPropagation()
  })

  function onClose(callback) {
    onCloseCallback = callback
  }

  function handleKeyDown(event) {
    if (event.key === 'Control')
      handleCtrlKey()

    if (isOpen()) {
      if (event.key === 'Escape') {
        if (event.target.closest('#search-input') && searchInput.value)
          clearSearch()
        else
          closeSearch()
      }

      if (event.key === 'ArrowDown')
        selectNext()

      if (event.key === 'ArrowUp')
        selectPrevious()

      if (event.key === 'PageDown')
        selectPageDown()

      if (event.key === 'PageUp')
        selectPageUp()

      if (event.key === 'Home')
        selectFirst()

      if (event.key === 'End')
        selectLast()

      if (event.key === 'Enter') {
        event.preventDefault()
        searchResult.children[selectedIndex]?.click()
      }

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

  function handleCtrlKey() {
    if (ctrlKeyStarted === null) {
      ctrlKeyStarted = Date.now()

      ctrlKeyTimer = setTimeout(resetCtrlKey, 400)
    }
    else {
      resetCtrlKey()
      if (isOpen())
        closeSearch()
      else
        openSearch()
    }
  }

  function resetCtrlKey() {
    clearTimeout(ctrlKeyTimer)
    ctrlKeyStarted = null
    ctrlKeyTimer = null
  }

  function openSearch() {
    resetSelection()
    searchOverlay.style.display = 'block'
    updateSearchResult(searchInput.value)
    searchInput.focus()
  }

  function closeSearch() {
    searchOverlay.style.display = 'none'
    onCloseCallback?.()
  }

  function isOpen() {
    return searchOverlay.style.display === 'block'
  }
  function clearSearch() {
    searchInput.value = ''
    updateSearchResult('')
  }

  function resetSelection() {
    if (searchInput.value)
      selectedIndex = 0
    else
      selectedIndex = null
    updateSelection()
    searchResult.scrollTo(0, 0)
  }

  function updateSelection() {
    [...searchResult.getElementsByClassName('selected')].forEach(el => el.classList.remove('selected'))

    const count = searchResult.children.length
    if (count) {
      if (selectedIndex >= count)
        selectedIndex = count - 1
      else if (selectedIndex < 0)
        selectedIndex = 0
    }
    else {
      selectedIndex = null
    }

    if (selectedIndex !== null) {
      const element = searchResult.children[selectedIndex]
      element.classList.add('selected')
      element.scrollIntoView({ block: 'nearest' })
    }
  }

  function selectPrevious() {
    if (selectedIndex !== null)
      selectedIndex -= 1

    updateSelection()
  }

  function selectNext() {
    if (selectedIndex !== null)
      selectedIndex += 1
    else
      selectedIndex = 0

    updateSelection()
  }

  function selectPageUp() {
    if (selectedIndex !== null)
      selectedIndex -= 10

    updateSelection()
  }

  function selectPageDown() {
    if (selectedIndex !== null)
      selectedIndex += 10
    else
      selectedIndex = 10

    updateSelection()
  }

  function selectFirst() {
    selectedIndex = 0
    updateSelection()
  }

  function selectLast() {
    selectedIndex = searchResult.children.length - 1
    updateSelection()
  }

  function onSearch(event) {
    const searchString = event.target.value
    updateSearchResult(searchString)
  }

  function updateSearchResult(searchString) {
    searchIntro.style.display = 'none'
    searchResult.style.display = 'none'
    noSearchResult.style.display = 'none'
    searchResult.innerHTML = ''

    const searchResults = Playground.allSearchResultEntries.filter(
      entry => entry.search.toLowerCase().includes(searchString.toLowerCase()),
    )

    if (!searchInput.value)
      searchIntro.style.display = 'flex'

    if (searchResults.length === 0) {
      noSearchResult.style.display = 'flex'
    }
    else {
      searchResult.style.display = 'flex'
      searchResult.innerHTML = searchResults.map(entry => entry.html).join('')
    }

    resetSelection()
  }

  return {
    openSearch,
    closeSearch,
    clearSearch,
    handleKeyDown,
    onClose,
  }
})()
