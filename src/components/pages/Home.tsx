import React, { ReactElement, useEffect, useState } from 'react'
import SearchBar from '../molecules/SearchBar'
import AssetList from '../organisms/AssetList'
import {
  QueryResult,
  SearchQuery
} from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import Container from '../atoms/Container'
import { useOcean } from '../../providers/Ocean'
import Button from '../atoms/Button'
import Bookmarks from '../molecules/Bookmarks'
import axios from 'axios'
import {
  queryMetadata,
  transformChainIdsListToQuery
} from '../../utils/aquarius'
import Permission from '../organisms/Permission'
import { getHighestLiquidityDIDs } from '../../utils/subgraph'
import { DDO, Logger } from '@oceanprotocol/lib'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { useUserPreferences } from '../../providers/UserPreferences'
import styles from './Home.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

async function getQueryHighest(
  chainIds: number[]
): Promise<[SearchQuery, string]> {
  const [dids, didsLength] = await getHighestLiquidityDIDs(chainIds)
  const queryHighest = {
    page: 1,
    offset: didsLength > 0 ? didsLength : 1,
    query: {
      query_string: {
        query: `${dids && `(${dids}) AND`}(${transformChainIdsListToQuery(
          chainIds
        )}) AND -isInPurgatory:true `,
        fields: ['dataToken']
      }
    }
  }

  return [queryHighest, dids]
}

function getQueryLatest(chainIds: number[]): SearchQuery {
  return {
    page: 1,
    offset: 9,
    query: {
      query_string: {
        query: `(${transformChainIdsListToQuery(
          chainIds
        )}) AND -isInPurgatory:true `
      }
    },
    sort: { created: -1 }
  }
}

function sortElements(items: DDO[], sorted: string[]) {
  items.sort(function (a, b) {
    return sorted.indexOf(a.dataToken) - sorted.indexOf(b.dataToken)
  })
  return items
}

function SectionQueryResult({
  title,
  query,
  action,
  queryData
}: {
  title: ReactElement | string
  query: SearchQuery
  action?: ReactElement
  queryData?: string
}) {
  const { appConfig } = useSiteMetadata()
  const { chainIds } = useUserPreferences()
  const [result, setResult] = useState<QueryResult>()
  const [loading, setLoading] = useState<boolean>()

  useEffect(() => {
    if (!appConfig.metadataCacheUri) return
    const source = axios.CancelToken.source()

    async function init() {
      if (chainIds.length === 0) {
        const result: QueryResult = {
          results: [],
          page: 0,
          totalPages: 0,
          totalResults: 0
        }
        setResult(result)
        setLoading(false)
      } else {
        try {
          setLoading(true)
          const result = await queryMetadata(query, source.token)
          if (queryData && result.totalResults > 0) {
            const searchDIDs = queryData.split(' ')
            const sortedAssets = sortElements(result.results, searchDIDs)
            const overflow = sortedAssets.length - 9
            sortedAssets.splice(sortedAssets.length - overflow, overflow)
            result.results = sortedAssets
          }
          setResult(result)
          setLoading(false)
        } catch (error) {
          Logger.error(error.message)
        }
      }
    }
    init()

    return () => {
      source.cancel()
    }
  }, [appConfig.metadataCacheUri, query, queryData])

  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      <AssetList
        assets={result?.results}
        showPagination={false}
        isLoading={loading}
      />
      {action && action}
    </section>
  )
}

export default function HomePage(): ReactElement {
  const [queryAndDids, setQueryAndDids] = useState<[SearchQuery, string]>()
  const { chainIds } = useUserPreferences()
  const [homeSearchButtons, setHomeSearchButtons] = useState<string[]>([])
  const selectHomeSearchButtonStyleVa = cx({
    [styles.homeSearchButton]: true,
    [styles.selected]: homeSearchButtons.includes('va')
  })
  const selectHomeSearchButtonStyleMe = cx({
    [styles.homeSearchButton]: true,
    [styles.selected]: homeSearchButtons.includes('me')
  })
  const selectHomeSearchButtonStyleSi = cx({
    [styles.homeSearchButton]: true,
    [styles.selected]: homeSearchButtons.includes('si')
  })
  function selectHomeSearchButton(val: string) {
    if (homeSearchButtons.includes(val)) {
      setHomeSearchButtons((prev) => [
        ...prev.filter(function (str) {
          return !str.includes(val)
        })
      ])
    } else {
      setHomeSearchButtons((prev) => [...prev, val])
    }
  }
  /* useEffect(() => {
    getQueryHighest(chainIds).then((results) => {
      setQueryAndDids(results)
    })
  }, [chainIds]) */

  return (
    <Permission eventType="browse">
      <>
        <Container narrow className={styles.searchWrap}>
          <SearchBar homeSearchButtonsArr={homeSearchButtons} />
        </Container>
        <div className={styles.homeSearchButtonDiv}>
          <Button
            className={selectHomeSearchButtonStyleVa}
            onClick={() => {
              selectHomeSearchButton('va')
            }}
          >
            VantageCrypto
          </Button>
          <Button
            className={selectHomeSearchButtonStyleMe}
            onClick={() => {
              selectHomeSearchButton('me')
            }}
          >
            Metrics
          </Button>
          <Button
            className={selectHomeSearchButtonStyleSi}
            onClick={() => {
              selectHomeSearchButton('si')
            }}
          >
            Signals
          </Button>
        </div>
        <SectionQueryResult
          title="Recently Published"
          query={getQueryLatest(chainIds)}
          action={
            <Button style="text" to="/search?sort=created&sortOrder=desc">
              All data sets and algorithms →
            </Button>
          }
        />
      </>
    </Permission>
  )
}
