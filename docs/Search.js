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
      switch (event.key) {
        case 'Escape':
          if (event.target.closest('#search-input') && searchInput.value)
            clearSearch()
          else
            closeSearch()
          break
        case 'ArrowDown':
          selectNext()
          break
        case 'ArrowUp':
          selectPrevious()
          break
        case 'PageDown':
          selectPageDown()
          break
        case 'PageUp':
          selectPageUp()
          break
        case 'Home':
          selectFirst()
          break
        case 'End':
          selectLast()
          break
        case 'Enter':
          event.preventDefault()
          searchResult.children[selectedIndex]?.click()
          break
        case 'k':
        case 'K':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            Playground.Search.openSearch()
          }
          break
        case 'F3':
          event.preventDefault()
          Playground.Search.openSearch()
          break
      }

      return 'stop'
    }
    else {
      switch (event.key) {
        case 'k':
        case 'K':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            Playground.Search.openSearch()
          }
          break

        case 'F3':
          event.preventDefault()
          Playground.Search.openSearch()
          break
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
    searchResult.style.display = 'none'
    noSearchResult.style.display = 'none'
    searchResult.innerHTML = ''

    const searchResults = Playground.allSearchResultEntries.filter(
      entry => entry.search.toLowerCase().includes(searchString.toLowerCase()),
    )

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
