import React, { useState, ChangeEvent, FormEvent, ReactElement } from 'react'
import { navigate } from 'gatsby'
import styles from './SearchBar.module.css'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import InputGroup from '../atoms/Input/InputGroup'
import { addExistingParamsToUrl } from '../templates/Search/utils'

export default function SearchBar({
  placeholder,
  initialValue,
  homeSearchButtonsArr,
  filters,
  size
}: {
  placeholder?: string
  initialValue?: string
  homeSearchButtonsArr?: string[]
  filters?: boolean
  size?: 'small' | 'large'
}): ReactElement {
  let [value, setValue] = useState(initialValue || '')

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
    if (value === '') value = ' '
    if (addToSearch !== '') {
      if (value === ' ') {
        value = addToSearch
      } else {
        value = value + ' ' + addToSearch
      }
    }

    const urlEncodedValue = encodeURIComponent(value)
    const url = await addExistingParamsToUrl(location, [
      'text',
      'owner',
      'tags'
    ])
    navigate(`${url}&text=${urlEncodedValue}`)
  }

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

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    e.target.value === '' && emptySearch()
  }

  return (
    <form className={styles.form}>
      <InputGroup>
        <Input
          type="search"
          name="search"
          placeholder={placeholder || 'What are you looking for?'}
          value={value}
          onChange={handleChange}
          required
          size={size}
        />
        <Button
          onClick={async (e: FormEvent<HTMLButtonElement>) =>
            await startSearch(e)
          }
        >
          Search
        </Button>
      </InputGroup>

      {filters && <fieldset className={styles.filters}>Type, Price</fieldset>}
    </form>
  )
}
