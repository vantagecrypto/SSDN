import React, { ReactNode, ReactElement } from 'react'
import PageHeader from '../molecules/PageHeader'
import Seo from '../atoms/Seo'
import Container from '../atoms/Container'

export interface PageProps {
  children: ReactNode
  title?: string
  titleNew?: string
  uri: string
  description?: string
  noPageHeader?: boolean
  headerCenter?: boolean
}

export default function Page({
  children,
  title,
  titleNew,
  uri,
  description,
  noPageHeader,
  headerCenter
}: PageProps): ReactElement {
  if (titleNew)
    return (
      <>
        <Seo title={title} description={description} uri={uri} />
        <Container>
          {titleNew && !noPageHeader && (
            <PageHeader
              title={titleNew}
              description={description}
              center={headerCenter}
            />
          )}
          {children}
        </Container>
      </>
    )
  return (
    <>
      <Seo title={title} description={description} uri={uri} />
      <Container>
        {title && !noPageHeader && (
          <PageHeader
            title={title}
            description={description}
            center={headerCenter}
          />
        )}
        {children}
      </Container>
    </>
  )
}
