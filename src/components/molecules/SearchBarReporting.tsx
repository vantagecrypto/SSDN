import React, { useState, ChangeEvent, FormEvent, ReactElement } from 'react'
import styles from './SearchBarReporting.module.css'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import InputGroup from '../atoms/Input/InputGroup'

function handleSearchBarReportingSubmit(e: { preventDefault: () => void }) {
  e.preventDefault()
}
export default function SearchBarReporting({
  placeholder,
  filters,
  size
}: {
  placeholder?: string
  initialValue?: string
  filters?: boolean
  size?: 'small' | 'large'
}): ReactElement {
  return (
    <form className={styles.form} onSubmit={handleSearchBarReportingSubmit}>
      <InputGroup>
        <Input
          type="search"
          name="search"
          placeholder={placeholder || 'What are you looking for?'}
          required
          size={size}
        />
        <Button>Search</Button>
      </InputGroup>
    </form>
  )
}
