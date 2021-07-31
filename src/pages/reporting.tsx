import React, { ReactElement } from 'react'
import PageReporting from '../components/pages/Reporting'
import Page from '../components/templates/Page'
import { graphql, PageProps } from 'gatsby'

export default function PageGatsbyReporting(props: PageProps): ReactElement {
  const content = (props.data as any).content.edges[0].node.childPagesJson
  const { title, description } = content
  const titleNew = 'Signal Syndication & Data Network'
  return (
    <Page
      title={title}
      titleNew={titleNew}
      description={description}
      headerCenter
      uri={props.uri}
    >
      <PageReporting />
    </Page>
  )
}

export const contentQuery = graphql`
  query ReportingPageQuery {
    content: allFile(filter: { relativePath: { eq: "pages/reporting.json" } }) {
      edges {
        node {
          childPagesJson {
            title
            description
          }
        }
      }
    }
  }
`
