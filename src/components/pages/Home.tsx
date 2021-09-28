import React, { ReactElement, useEffect, useState } from 'react'
import AssetList from '../organisms/AssetList'
import { SearchQuery } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import Button from '../atoms/Button'
import Bookmarks from '../molecules/Bookmarks'
import {
  queryMetadata,
  transformChainIdsListToQuery
} from '../../utils/aquarius'
import Permission from '../organisms/Permission'
import { getHighestLiquidityDIDs } from '../../utils/subgraph'
import { DDO, Logger } from '@oceanprotocol/lib'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { useUserPreferences } from '../../providers/UserPreferences'
import Container from '../atoms/Container'
import SearchBarOld from '../molecules/SearchBarOld'
import styles from './Home.module.css'
import classNames from 'classnames/bind'
import { useIsMounted } from '../../hooks/useIsMounted'
import { useCancelToken } from '../../hooks/useCancelToken'
const cx = classNames.bind(styles)

async function getQueryHighest(
  chainIds: number[]
): Promise<[SearchQuery, string]> {
  const [dids, didsLength] = await getHighestLiquidityDIDs(chainIds)
  const queryHighest = {
    size: didsLength > 0 ? didsLength : 1,
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

function getQueryLatest(chainIds: number[]): any {
  return {
    size: 9,
    query: {
      query_string: {
        query: `(${transformChainIdsListToQuery(
          chainIds
        )}) AND -isInPurgatory:true `
      }
    },
    sort: { created: 'desc' }
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
  const [result, setResult] = useState<any>()
  const [loading, setLoading] = useState<boolean>()
  const isMounted = useIsMounted()
  const newCancelToken = useCancelToken()
  useEffect(() => {
    if (!appConfig.metadataCacheUri) return

    async function init() {
      if (chainIds.length === 0) {
        const result: any = {
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
          const result = await queryMetadata(query, newCancelToken())
          if (!isMounted()) return
          if (queryData && result?.totalResults > 0) {
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
  }, [
    appConfig.metadataCacheUri,
    chainIds.length,
    isMounted,
    newCancelToken,
    query,
    queryData
  ])

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

function SectionSearchButtons({ tt }: { tt?: string }) {
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
  return (
    <div>
      <Container narrow className={styles.searchWrap}>
        <SearchBarOld homeSearchButtonsArr={homeSearchButtons} />
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
    </div>
  )
}

export default function HomePage(): ReactElement {
  const [queryAndDids, setQueryAndDids] = useState<[SearchQuery, string]>()
  const { chainIds } = useUserPreferences()

  useEffect(() => {
    getQueryHighest(chainIds).then((results) => {
      setQueryAndDids(results)
    })
  }, [chainIds])

  return (
    <Permission eventType="browse">
      <>
        <SectionSearchButtons />
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
