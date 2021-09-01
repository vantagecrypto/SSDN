import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  ReactElement
} from 'react'
import { navigate } from 'gatsby'
import queryString from 'query-string'
import { addExistingParamsToUrl } from '../templates/Search/utils'
import { ReactComponent as SearchIcon } from '../../images/search.svg'
import InputElement from '../atoms/Input/InputElement'
import styles from './SearchBar.module.css'

async function emptySearch() {
  const searchParams = new URLSearchParams(window.location.href)
  const text = searchParams.get('text')
  if (text !== ('' || undefined || null)) {
    const url = await addExistingParamsToUrl(location, [
      'text',
      'owner',
      'tags'
    ])
    navigate(`${url}&text=%20`)
  }
}

export default function SearchBar({
  placeholder,
  homeSearchButtonsArr,
  initialValue
}: {
  placeholder?: string
  initialValue?: string
  homeSearchButtonsArr?: string[]
}): ReactElement {
  const [value, setValue] = useState(initialValue || '')
  const parsed = queryString.parse(location.search)
  const { text, owner } = parsed

  useEffect(() => {
    ;(text || owner) && setValue((text || owner) as string)
  }, [text, owner])

  async function startSearch(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    let addToSearch = ''
    const searchWords: { [k: string]: string } = {
      va: 'VantageCrypto',
      me: 'Metrics',
      si: 'trading signals'
    }
    if (homeSearchButtonsArr && homeSearchButtonsArr.length > 0) {
      const words = homeSearchButtonsArr.map(function (st) {
        return searchWords[st]
      })
      addToSearch = words.join(' ')
    }
    if (value === '') setValue(' ')
    if (addToSearch !== '') {
      if (value === ' ') {
        setValue(addToSearch)
      } else {
        setValue(value + ' ' + addToSearch)
      }
    }
    console.log(value, addToSearch)
    const urlEncodedValue = encodeURIComponent(value)
    const url = await addExistingParamsToUrl(location, [
      'text',
      'owner',
      'tags'
    ])
    //navigate(`${url}&text=${urlEncodedValue}`)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    e.target.value === '' && emptySearch()
  }

  async function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      await startSearch(e)
    }
  }

  async function handleButtonClick(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    await startSearch(e)
  }

  return (
    <form className={styles.search}>
      <InputElement
        type="search"
        name="search"
        placeholder={placeholder || 'Search...'}
        value={value}
        onChange={handleChange}
        required
        size="small"
        className={styles.input}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleButtonClick} className={styles.button}>
        <SearchIcon className={styles.searchIcon} />
      </button>
    </form>
  )
}
