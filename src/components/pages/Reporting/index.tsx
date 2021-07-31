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
      <div className={styles.reportingSearchButtonDiv}>
        <Button className={styles.reportingSearchButton}>VantageCrypto</Button>
        <Button className={styles.reportingSearchButton}>Short</Button>
        <Button className={styles.reportingSearchButton}>Long</Button>
      </div>
      <Container className={styles.tableWrap}>
        <div className={styles.reportingTableHeaderDiv}>
          <div className={styles.reportingTableHeader}>REL</div>
          <div className={styles.reportingTableHeader}>PERF</div>
          <div className={styles.reportingTableHeader}>NAME</div>
          <div className={styles.reportingTableHeader}>PROVIDER</div>
          <div className={styles.reportingTableHeader}>TOKEN</div>
          <div className={styles.reportingTableHeader}>ASSET</div>
          <div className={styles.reportingTableHeader}>TYPE</div>
          <div className={styles.reportingTableHeader}>CYCLE</div>
          <div className={styles.reportingTableHeader}>AVG FLAGS</div>
          <div className={styles.reportingTableHeader}>TRACKER</div>
        </div>
      </Container>
      <div className={styles.reportingPreview}>
        The Signal Validator is scheduled for launch 4Q 2021
      </div>
    </>
  )
}
