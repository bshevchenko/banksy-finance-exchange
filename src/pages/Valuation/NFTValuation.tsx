import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Property } from 'csstype'
import { NFTValuationChangeData, NFTValuationHistory } from '../../types/NFTValuation'
import CollapsibleBox from './components/CollasibleBox'

import InfoIcon from '../../assets/images/commons/info.png'
import UserIcon from '../../assets/images/commons/user.png'

import ETHColoredOutlinedIcon from '../../assets/images/commons/eth-colored-outlined.png'
import ETHColoredIcon from '../../assets/images/commons/eth-colored.png'
import MarketDataIcon from '../../assets/images/valuation/market-data.png'
import ChangeIcon from '../../assets/images/valuation/changes.png'
import UpIcon from '../../assets/images/valuation/up.png'
import DownIcon from '../../assets/images/valuation/down.png'
import HistoryIcon from '../../assets/images/valuation/history.png'
import TransactionIcon from '../../assets/images/valuation/transaction.png'
import ThemeTable from '../../styles/ThemeTable'
import { DropdownSelector } from '../../styles/DropdownSelector'
import {
  NftAttribute,
  NftValuation,
  OracleNftValuation,
  useTokenValuationBaseInfoQuery
} from '../../hooks/queries/insight/token/useTokenValuationBaseInfoQuery'
import { formatTime, numberWithCommas } from '../../utils'
import {
  NftTransactionType,
  useTokenTransactionsQuery
} from '../../hooks/queries/insight/token/useTokenTransactionsQuery'
import MetamaskAvatar from '../../components/MetamaskAvatar'
import { convertNftValuationToValuationChanges } from '../../converters/insight'
import { ValuationHistoriesChart } from './components/charts/ValuationHistoriesChart'

type NFTValuationPageProps = {
  //
}

const NFTValuationPageContainer = styled.div`
  width: 100%;
  user-select: none;
  padding-bottom: 150px;
`

const Wrapper = styled.div`
  max-width: 1096px;
  margin: 100px auto 0 auto;
`

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
`

const FlexColumn = styled.div<{ width: Property.Width }>`
  display: flex;
  flex-direction: column;

  width: ${props => props.width};
`

const TokenImage = styled.img`
  height: 394px;
  border-radius: 10px;
  border: 1px solid #99BDF9;
  padding: 10px;
  margin-bottom: 50px;
`

const OwnerContainer = styled.div`
  display: flex;
  align-items: center;

  color: #ddd;
  font-size: 16px;
`

const PropertiesContainer = styled.div`

  .text {
    color: white;
    margin-bottom: 15px;
  }

  .label {
    color: #99BDF9;
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .properties {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .property {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: white;
      min-width: 102px;
      height: 78px;
      margin-bottom: 10px;
      padding-top: 8px;
      border-radius: 5px;

      background-color: rgba(255, 255, 255, .1);
    }

    .value {
      max-width: 80%;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
    }

    .property.empty {
      height: 0;
      padding: 0;
      margin: 0;
    }
  }
`

const TitleContainer = styled.div`
  color: #99BDF9;
  display: flex;
  align-items: flex-end;
  margin-bottom: 54px;

  .collection {
    font-size: 50px;
    font-weight: 600;
  }

  .token-id {
    font-size: 24px;
    margin-left: 10px;
    margin-bottom: 6px;
  }
`

const ValuationContainer = styled.div`
  display: flex;
  align-items: center;

  .icon {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    margin-right: 18px;
  }

  .value {
    font-size: 30px;
    color: white;
    font-weight: 500;
    margin-right: 18px;
  }

  .value-in-usd {
    font-size: 18px;
    color: #b2b2b2;
  }

`

const MarketDataContainer = styled.div`
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }

    .key {
      font-size: 14px;
      color: #99BDF9;
      font-weight: 500;
      margin-right: 17px;
      width: 90px;
    }

    .value-box {
      width: 163px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      padding-left: 14px;
      margin-right: 8px;

      img.icon {
        height: 17px;
        margin-right: 9px;
      }

      .value {
        color: white;
        margin-right: 8px;
      }

      .value-in-usd {
        color: #b2b2b2;
      }
    }

    .compare {
      color: white;
      font-size: 14px;
    }
  }
`

const ValuationChangesContainer = styled.div`
  display: flex;
  justify-content: space-between;

  .type {
    width: 300px;
    height: 158px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    padding-top: 15px;
    font-size: 14px;
    font-weight: 500;

    &-name {
      margin-bottom: 12px;
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 70%;
      margin-bottom: 12px;

      .icon > img {
        width: 17px;
        margin-right: 7px;
      }

      .value {
        margin-right: 23px;
        width: 80px;
      }
    }
  }
`

const ValuationHistoryContainer = styled.div`
  .analyze {
    margin-top: 20px;
    color: white;

    .title {
      font-size: 22px;
      font-weight: 600;
    }

    .divider {
      width: 100%;
      height: 1px;
      background-color: #979797;
      margin: 13px 0 22px 0;
    }

    .items {
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      font-weight: 500;
    }
  }
`

const TransactionsContainer = styled.div`
  .operators {
    color: white;
    font-size: 14px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .text {
      margin-right: 10px;
    }

    .selector {
      width: 200px;
      margin-right: 40px;
    }

    .page-input {
      width: 60px;
      margin-right: 10px;
    }
  }
`

const ValuationAnalyzeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -5%;

  .item {
    margin-bottom: 15px;
    margin-right: 5%;
    display: flex;
    color: white;
    align-items: center;
    font-size: 18px;
    width: 45%;
    justify-content: space-between;

    .key {
      color: #99BDF9;
      font-size: 16px;
      text-overflow: ellipsis;
      word-wrap: anywhere;
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: fit-content;

      .value {
        font-weight: 600;
        font-size: 18px;
        width: 85px;
        display: flex;
        align-items: center;
        justify-content: end;
      }

      .change {
        margin-left: 10px;
        display: flex;
        align-items: center;

        .icon {
          position: relative;
          top: 4px;
          width: 12px;
          height: 12px;
          margin-bottom: 7px;
          margin-left: 3px;
        }
      }
    }
  }
`

const Properties: React.FC<{ properties?: NftAttribute[], collectionName?: string, numbWithAttributesCount?: number }> = ({
  properties, collectionName, numbWithAttributesCount
}) => {
  return (
    <CollapsibleBox
      title="Properties"
      collapsible={true}
      titleIcon={<img src={InfoIcon} alt="detail" />}
      style={{ marginBottom: '60px' }}
    >
      <PropertiesContainer>
        <div className="text">
          {
            collectionName && properties && numbWithAttributesCount &&
            `1 of ${numbWithAttributesCount} ${collectionName} with ${properties.length} Properties`
          }
        </div>
        <div className="label">
          Properties
        </div>
        <div className="properties">
          {
            properties?.slice(0, 3).map(({ traitType, value, ratio }, index) => (
              <div className="property" key={index}>
                <div className="key">{traitType}</div>
                <div className="value">{value}</div>
                <div className="rate">{numberWithCommas(ratio * 100)}%</div>
              </div>
            ))
          }
        </div>
      </PropertiesContainer>
    </CollapsibleBox>
  )
}

const Owner: React.FC<{ owner?: string }> = ({ owner }) => {
  return (
    <CollapsibleBox
      title="Owner"
      collapsible={true}
      titleIcon={<img src={UserIcon} alt="owner" />}
      contentPadding="10px 0"
      style={{ marginBottom: '40px' }}
    >
      <OwnerContainer>
        {
          owner ? (
            <>
              <MetamaskAvatar address={owner} width={'40px'} height={'40px'} />
              <div className="address">
                {owner}
              </div>
            </>
          ) : 'Unknown'
        }
      </OwnerContainer>
    </CollapsibleBox>
  )
}

const Title: React.FC<{ seriesName?: string, tokenId?: number }> = ({ seriesName, tokenId }) => {
  return (
    <TitleContainer>
      <div className="collection">{seriesName}</div>
      <div className="token-id">{tokenId && `#${tokenId}`}</div>
    </TitleContainer>
  )
}

const Valuation: React.FC<{ valuation?: string, valuationInUsd?: string }> = ({ valuation, valuationInUsd }) => {
  return (
    <CollapsibleBox
      collapsible={false}
      title="NFT Valuation"
      titleIcon={<img src={ETHColoredIcon} alt="NFT valuation" />}
      style={{ marginBottom: '60px' }}
    >
      <ValuationContainer>
        <img src={ETHColoredOutlinedIcon} alt="eth" className="icon" />
        <div className="value">{valuation ?? '-'}</div>
        <div className="value-in-usd">{valuationInUsd && `$${valuationInUsd}`}</div>
      </ValuationContainer>
    </CollapsibleBox>
  )
}

const MarketData: React.FC<{ valuation?: NftValuation }> = ({ valuation }) => {
  return (
    <CollapsibleBox
      title="Market Data"
      titleIcon={<img src={MarketDataIcon} alt="market data" />}
      style={{ marginBottom: '60px' }}
    >
      <MarketDataContainer>
        <div className="item">
          <div className="key">Asking Price</div>
          <div className="value-box">
            <img src={ETHColoredIcon} alt="eth" className="icon" />
            <div className="value">{valuation?.askingPrice ?? '-'}</div>
            <div className="value-in-usd">{valuation?.askingPriceUsd}</div>
          </div>
          <span className="compare">
            {valuation?.askingPriceFloatEth && `${valuation.askingPriceFloatEth} ETH`}
            {valuation?.askingPriceFloatUsd && `($${valuation.askingPriceFloatUsd})`}
            {valuation?.askingPriceBias && ` vs NFT Valuation: ${valuation.askingPriceBias}%`}
          </span>
        </div>
        <div className="item">
          <div className="key">Last Sale</div>
          <div className="value-box">
            <img src={ETHColoredIcon} alt="eth" className="icon" />
            <div className="value">{valuation?.lastSalePrice ?? '-'}</div>
            <div className="value-in-usd">{valuation?.lastSalePriceUsd}</div>
          </div>
          <span className="compare">
            {valuation?.lastSaleTime && formatTime(new Date(valuation.lastSaleTime * 1000))}
          </span>
        </div>
        <div className="item">
          <div className="key">Bids</div>
          <div className="value-box">
            <img src={ETHColoredIcon} alt="eth" className="icon" />
            <div className="value">{valuation?.bids ?? '-'}</div>
            <div className="value-in-usd">{valuation?.bidsPriceUsd}</div>
          </div>
          <span className="compare">
            {valuation?.bidsPriceFloatEth && `${valuation.bidsPriceFloatEth} ETH`}
            {valuation?.bidsPriceFloatUsd && `($${valuation.bidsPriceFloatUsd})`}
            {valuation?.bidsPriceBias && ` vs NFT Valuation: ${valuation.bidsPriceBias}%`}
          </span>
        </div>
      </MarketDataContainer>
    </CollapsibleBox>
  )
}

const ValuationChanges: React.FC<{ changes: NFTValuationChangeData[] }> = ({
  changes
}) => {
  const Item: React.FC<{ label: string, value?: number }> = ({ label, value }) => (
    <div className="item" key={label}>
      <div className="icon">
        {
          !!value && value > 0 && <img src={UpIcon} alt="up" />
        }
        {
          !!value && value < 0 && <img src={DownIcon} alt="down" />
        }
        {
          value === undefined && '-'
        }
      </div>
      <div className="value">
        {
          value
            ? [
              value > 0 ? '+' : '',
              value.toString(),
              '%'
            ].concat('')
            : 'No changes'
        }
      </div>
      <div className="key">{label}</div>
    </div>
  )

  return (
    <CollapsibleBox
      title="Valuation Change"
      titleIcon={<img src={ChangeIcon} alt="Valuation Change" />}
      style={{ marginBottom: '60px' }}
    >
      <ValuationChangesContainer>
        {
          changes.map(({ type, last30DaysPercent, last7DaysPercent, fromYesterdayPercent }) => (
            <div className="type" key={type}>
              <div className="type-name">{type}</div>
              <Item label={'from yesterday'} value={fromYesterdayPercent} />
              <Item label={'last 7 days'} value={last7DaysPercent} />
              <Item label={'last 30 days'} value={last30DaysPercent} />
            </div>
          ))
        }
      </ValuationChangesContainer>
    </CollapsibleBox>
  )
}

const ValuationHistory: React.FC<{ history: NFTValuationHistory, valuations?: OracleNftValuation[] }> = ({
  history,
  valuations
}) => {
  return (
    <CollapsibleBox
      title="Valuation History"
      titleIcon={<img src={HistoryIcon} alt="market data" />}
      style={{ marginBottom: '60px' }}
    >
      <ValuationHistoryContainer>
        <div className="analyze">
          <ValuationHistoriesChart valuations={valuations} />
          <div className="title">Price Analyze</div>
          <div className="divider" />
          <div className="items">
            <div>Price volatility: {history.analyze.priceVolatilityPercent}%</div>
            <div>Heat rank: {history.analyze.heatRank}</div>
            <div>Turnover rate: {history.analyze.turnoverRatePercent}%</div>
          </div>
        </div>
      </ValuationHistoryContainer>
    </CollapsibleBox>
  )
}

const Transactions: React.FC<{ assetContractAddress?: string, tokenId?: number }> = ({
  assetContractAddress,
  tokenId
}) => {
  const columns = [
    {
      title: 'Type',
      key: 'eventType',
      dataIndex: 'eventType'
    },
    {
      title: 'From Address',
      key: 'transactionFromAccountAddress',
      render: (row: any) => row.transactionFromAccountAddress ?? '-',
      width: '240px'
    },
    {
      title: 'To Address',
      key: 'transactionToAccountAddress',
      render: (row: any) => row.transactionToAccountAddress ?? '-',
      width: '240px'
    },
    {
      title: 'Values(Ξ)',
      key: 'price',
      render: (row: any) => row.price ? numberWithCommas(row.price) : '-'
    },
    {
      title: 'Date',
      key: 'date',
      render: (row: any) => new Date(row.date * 1000).toLocaleDateString()
    }
  ]

  const filterOptions: NftTransactionType[] = ['Sales', 'Transfers', 'Bids', 'Listings']

  const [selectedOptions, setSelectedOptions] = useState<NftTransactionType[]>([])

  const handleChange = (value: any) => {
    setSelectedOptions(value)
  }

  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data, isLoading } = useTokenTransactionsQuery({
    tokenId: tokenId?.toString() ?? '',
    assetContractAddress: assetContractAddress ?? '',
    filter: selectedOptions,
    current,
    size: pageSize
  })

  const handlePaginationChange = (page: number, size?: number) => {
    setCurrent(page)
    size && setPageSize(size)
  }

  return (
    <CollapsibleBox
      collapsible={true}
      title="Transactions"
      titleIcon={<img src={TransactionIcon} alt="transactions" />}
    >
      <TransactionsContainer>
        <div className="operators">
          <div className="text">Filter by:</div>
          <DropdownSelector
            mode="multiple"
            allowClear={true}
            value={selectedOptions}
            onChange={handleChange}
            backgroundColor={'rgba(69, 98, 163)'}
            minWidth={'120px'}
          >
            {
              filterOptions.map((option, index) => (
                <DropdownSelector.Option value={option} key={index}>{option}</DropdownSelector.Option>
              ))
            }
          </DropdownSelector>
        </div>
        <ThemeTable
          columns={columns}
          dataSource={data?.records}
          pagination={{ pageSize, current, total: data?.total, onChange: handlePaginationChange }}
          loading={isLoading}
        />
      </TransactionsContainer>
    </CollapsibleBox>
  )
}

const ValuationAnalyze: React.FC<{ valuation?: OracleNftValuation }> = ({ valuation }) => {
  const Item: React.FC<{ label: string, value?: number, change?: number }> = ({ label, value, change = 0 }) => (
    <div className="item" key={label}>
      <div className="key">{label}</div>
      <div className="right">
        <div className="value">
          {value ? numberWithCommas(value) : '-'}
        </div>
        <div className="change">
          {
            `${numberWithCommas(change ?? 0)}%`
          }
          {
            change >= 0
              ? <img src={UpIcon} alt="up" className="icon" />
              : <img src={DownIcon} alt="down" className="icon" />
          }
        </div>
      </div>
    </div>
  )

  return (
    <CollapsibleBox
      collapsible={true}
      title="Lasted Valuation Analyzing"
      titleIcon={<img src={TransactionIcon} alt="analyze" />}
      style={{ marginBottom: '40px' }}
    >
      <ValuationAnalyzeContainer>
        <Item
          label="BTC Market Index"
          value={valuation?.btcMarketIndex}
          change={valuation?.btcMarketIndexChange}
        />
        <Item
          label="Type Heat"
          value={valuation?.typeHeat}
          change={valuation?.typeHeatChange}
        />
        <Item
          label="NFT Market Index"
          value={valuation?.nftMarketIndex}
          change={valuation?.nftMarketIndexChange}
        />
        <Item
          label="Collection Market Index"
          value={valuation?.seriesMarketIndex}
          change={valuation?.seriesMarketIndexChange}
        />
        <Item
          label="Community Market Index"
          value={valuation?.communityHeatIndex}
          change={valuation?.communityHeatIndexChange}
        />
        <Item
          label="Fans loyalty Index"
          value={valuation?.fansLoyaltyIndex}
          change={valuation?.fansLoyaltyIndexChange}
        />
        {
          valuation?.attributeHeats?.sort((b, a) => a.heat - b.heat).map((o, index) => (
            <Item
              label={`${o.traitType}: ${o.value}`}
              value={o.heat}
              change={o.change}
              key={index}
            />
          ))
        }
      </ValuationAnalyzeContainer>
    </CollapsibleBox>
  )
}

const NFTValuationPage: React.FC<NFTValuationPageProps> = () => {
  const { id } = useParams<{ id: string }>()

  const { data } = useTokenValuationBaseInfoQuery(id)

  // fixme: mock data
  const valuationHistory = {
    data: [],
    analyze: {
      priceVolatilityPercent: '25.11',
      heatRank: 2,
      turnoverRatePercent: '49.55'
    }
  }

  useEffect(() => {
    document.getElementById('main')!.scrollTo(0, 0)
  }, [])

  return (
    <NFTValuationPageContainer>
      <Wrapper>
        <FlexRow>
          <FlexColumn width="358px">
            <TokenImage src={data?.nftImageUrl} />
            <Properties properties={data?.nftAttributes}
              collectionName={data?.seriesName}
              numbWithAttributesCount={data?.numbWithAttributesCount}
            />
            <Owner owner={data?.nftOwner} />
          </FlexColumn>
          <FlexColumn width="660px">
            <Title tokenId={data?.tokenId} seriesName={data?.seriesName} />
            <Valuation valuation={data?.aiPrice} valuationInUsd={data?.oracleValuationUsd} />
            <MarketData valuation={data} />
            <ValuationChanges changes={convertNftValuationToValuationChanges(data)} />
          </FlexColumn>
        </FlexRow>

        <ValuationAnalyze valuation={data?.oracleNftValuationVo} />
        <ValuationHistory valuations={data?.oracleNftValuationVoList} history={valuationHistory} />
        <Transactions assetContractAddress={data?.assetContractAddress} tokenId={data?.tokenId} />
      </Wrapper>
    </NFTValuationPageContainer>
  )
}

export default NFTValuationPage
