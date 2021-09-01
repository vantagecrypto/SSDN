import React, { ReactElement } from 'react'
import styles from './Footer.module.css'
import Markdown from '../atoms/Markdown'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { Link } from 'gatsby'
import MarketStats from '../molecules/MarketStats'
import BuildId from '../atoms/BuildId'
import SyncStatus from '../molecules/SyncStatus'

export default function Footer(): ReactElement {
  const { copyright } = useSiteMetadata()
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        {/* <SyncStatus /> |  */}
        <BuildId />
        <MarketStats />
        <div className={styles.copyright}>
          © {year} <Markdown text={copyright} /> —{' '}
          <a href="https://faq.vantagecrypto.com/index.php?sid=4515&lang=en&action=faq&cat=1&id=19&artlang=en">
            Terms
          </a>
          {' — '}
          <a href="https://faq.vantagecrypto.com/index.php?sid=4513&lang=en&action=faq&cat=1&id=20&artlang=en">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  )
}
