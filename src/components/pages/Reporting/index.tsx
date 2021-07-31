import React, { ReactElement } from 'react'
import styles from './index.module.css'
import SearchBarReporting from '../../molecules/SearchBarReporting'
import Container from '../../atoms/Container'
import Button from '../../atoms/Button'

export default function PageReporting(): ReactElement {
  return (
    <>
      <Container narrow className={styles.searchWrap}>
        <SearchBarReporting size="large" />
      </Container>
      <div className={styles.homeSearchButtonDiv}>
        <Button className={styles.homeSearchButton}>VantageCrypto</Button>
        <Button className={styles.homeSearchButton}>Short</Button>
        <Button className={styles.homeSearchButton}>Long</Button>
      </div>
      <article className={styles.content} />
    </>
  )
}
