import React, { ReactElement } from 'react'
import { PageProps } from 'gatsby'
import PageHome from '../components/pages/Home'
import { useSiteMetadata } from '../hooks/useSiteMetadata'
import Page from '../components/templates/Page'

export default function PageGatsbyHome(props: PageProps): ReactElement {
  const { siteTitle, siteTagline } = useSiteMetadata()
  const siteTitleNew = 'Signal Syndication & Data Network'
  return (
    <Page
      title={siteTitle}
      titleNew={siteTitleNew}
      description={siteTagline}
      uri={props.uri}
      headerCenter
    >
      <PageHome />
    </Page>
  )
}
