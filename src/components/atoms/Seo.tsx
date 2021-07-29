import React, { ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { isBrowser } from '../../utils'

export default function Seo({
  title,
  description,
  uri
}: {
  title?: string
  description?: string
  uri: string
}): ReactElement {
  const { siteTitle, siteTagline, siteUrl, siteImage } = useSiteMetadata()

  // Remove trailing slash from all URLs
  const canonical = `${siteUrl}${uri}`.replace(/\/$/, '')

  return (
    <Helmet
      defaultTitle={`${siteTitle} — ${siteTagline}`}
      titleTemplate={`%s — ${siteTitle}`}
      title={title}
    >
      <html lang="en" />

      {isBrowser &&
        window.location &&
        window.location.hostname !== 'oceanprotocol.com' && (
          <meta name="robots" content="noindex,nofollow" />
        )}

      <link rel="canonical" href={canonical} />

      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={uri} />

      <meta name="image" content={`${siteUrl}/preview.png`} />
      <meta property="og:image" content={`${siteUrl}/preview.png`} />

      <meta property="og:site_name" content={siteTitle} />
    </Helmet>
  )
}
