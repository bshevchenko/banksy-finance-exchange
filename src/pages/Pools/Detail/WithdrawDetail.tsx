import React, { useState } from 'react'
import styled from 'styled-components'
import DepositAPY from '../../../components/EchartsStatistics/DepositAPY'
import { useHistory } from 'react-router-dom'
import { Button, Form, Input } from 'antd'
// import { useSelector } from 'react-redux'
// import { getAccount } from '../../../store/wallet'
import { useWithdrawCheckoutModal } from '../../../hooks/modals/useWithdrawCheckoutModal'
import { LeftOutlined } from '@ant-design/icons'

const ItemDetailMain = styled.div`
  min-height: 100vh;
  width: 130rem;
  margin-left: calc((100% - 130rem) / 2);
  padding-top: 8rem;
`

const DetailTop = styled.div`
  height: 5rem;
  background: #111C3A;
  border-radius: 1.5rem;
  padding-left: 3rem;
  position: relative;
  display: flex;
  align-items: center;

  span {
    color: #fff;
    font-size: 1.7rem;
  }

  span:nth-of-type(2) {
    margin-left: 7rem;
  }
`

const ItemDetailData = styled.div`
  border-radius: 1.5rem;
  margin-top: 2rem;
  background: #101D44;

  .detailData-top {
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 3rem;
    color: #fff;
    position: relative;

    .detailData-top-name {
      font-size: 1.4rem;
      position: absolute;
      left: 3rem;
    }

    .detailData-top-overview {
      display: flex;
      align-items: center;

      img {
        width: 2rem;
        height: 2rem;
        border-radius: 3rem;
        background: gray;
      }

      div {
        margin-left: 1rem;
      }
    }
  }
`

const Line = styled.div`
  width: 100%;
  height: 0.1rem;
  background: linear-gradient(to right, #00FFFF, #5D00B3);
`

const ItemDetailDataMain = styled.div`
  display: flex;
  padding: 2rem 3rem;
`

const DetailDataMainItem = styled.div`
  padding-right: 3rem;
  width: 28%;

  .item-line {
    display: flex;
    padding: 2rem 0;
    justify-content: space-between;
    color: #fff;

    div:nth-of-type(1) {
      font-size: 1.8rem;
    }

    div:nth-of-type(2) {
      font-weight: bolder;
      font-size: 2rem;
    }
  }
`

const DetailDataMainStatistics = styled.div`
  width: 60%;
  padding: 1rem;
  margin-left: 15rem;
`

const ScheduleMain = styled.div`
  margin-top: 3rem;
`

const ScheduleFirst = styled.div`
  text-align: center;
  width: 60rem;
  margin-left: calc((100% - 60rem) / 2);

  .title {
    color: #F172ED;
    font-size: 2rem;
    font-weight: bolder;
    margin-bottom: 2rem;
  }

  .main-title {
    font-weight: bolder;
    font-size: 1.7rem;
    color: #fff;
    margin-bottom: 2rem;
  }

  .main-text {
    font-size: 1.7rem;
    color: #fff;
    margin-bottom: 2rem;
  }

  .input-text {
    width: 70%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
  }

  .ant-input-group.ant-input-group-compact > *:first-child, .ant-input-group.ant-input-group-compact > .ant-select:first-child > .ant-select-selector, .ant-input-group.ant-input-group-compact > .ant-select-auto-complete:first-child .ant-input, .ant-input-group.ant-input-group-compact > .ant-cascader-picker:first-child .ant-input {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }

  .ant-input {
    width: 70% !important;
    height: 5rem;
    color: white;
    font-size: 1.6rem;
    font-weight: 550;
    background: #305099 !important;
    border-radius: 1rem;
    border: none;
  }
`

const ConfirmButton = styled(Button)`
  width: 16.9rem;
  height: 4.8rem;
  background: #554BFF;
  border-radius: 1rem;
  border: none;
  color: #fff;
  font-weight: bolder;
  font-size: 1.7rem;
  transition: all 0.7s;
  margin-top: 1rem;

  &:hover {
    background: #7A7AFF;
    color: #fff;
  }
`
const BackIconButton = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #284779;
  transition: all 0.7s;
  margin-right: 1rem;

  &:hover {
    background: #6C48FF;
  }
`

const BackIcon:React.FC = () => {
  const history = useHistory()
  return (
    <BackIconButton onClick={() => history.goBack()}>
      <LeftOutlined style={{ fontSize: '1.6rem', color: '#fff' }} />
    </BackIconButton>
  )
}


const Schedule:React.FC<{ data: any }> = () => {
  // const account = useSelector(getAccount)

  // const [formData, setFormData] = useState<any>()

  const formInitialValues = {
    price: ''
  }

  const { withdrawCheckoutModal, openWithdrawCheckoutModal } = useWithdrawCheckoutModal()

  const [form] = Form.useForm<typeof formInitialValues>()

  const confirm = () => {
    openWithdrawCheckoutModal()
  }

  return (
    <ScheduleMain>
      <ScheduleFirst>
        <div className="title">Withdraw overview</div>
        <div className="main-title">
          How much would you like to withdraw ?
        </div>
        <div className="main-text">
          Please enter an amount you would like to withdraw.The maximum amount you can deposit is shown below.
        </div>
        <Form form={form} initialValues={formInitialValues}>
          <div className="fixedPrice">
            <div className="input-text">
              <span>available to withdraw</span>
              <span>19.668322 MATIC</span>
            </div>
            <Form.Item name="price">
              <Input style={{ width: '50%' }} />
            </Form.Item>
          </div>
        </Form>
        <ConfirmButton onClick={confirm}>Continue</ConfirmButton>
      </ScheduleFirst>
      {withdrawCheckoutModal}
    </ScheduleMain>
  )
}

const WithdrawDetailPage:React.FC = () => {

  // const history = useHistory()

  // const id = history.location.pathname.slice(22)

  const [data] = useState<any>() // [data, setData]

  return (
    <ItemDetailMain>
      <DetailTop>
        <BackIcon />
        <span>Your balance in Banksy -</span>
      </DetailTop>
      <ItemDetailData>
        <div className="detailData-top">
          <div className="detailData-top-name">Withdraw</div>
          <div className="detailData-top-overview">
            <img src={data?.assetsImage} alt="" />
            <div>{data?.assetsName} Reserve Overview</div>
          </div>
        </div>
        <Line />
        <ItemDetailDataMain>
          <DetailDataMainItem>
            <div className="item-line">
              <div>Utilization rate</div>
              <div>{data?.utilizationRate ? data?.utilizationRate : '- -' }</div>
            </div>
            <div className="item-line">
              <div>Available liquidity</div>
              <div>{data?.availableLiquidity ? data?.availableLiquidity : '- -'}</div>
            </div>
            <div className="item-line">
              <div>Deposit APY</div>
              <div>{data?.depositApy ? data?.depositApy : '- -' }</div>
            </div>
            <div className="item-line">
              <div>Asset price</div>
              <div>64.71</div>
            </div>
          </DetailDataMainItem>
          <DetailDataMainStatistics>
            <DepositAPY />
          </DetailDataMainStatistics>
        </ItemDetailDataMain>
      </ItemDetailData>
      <Schedule data={data} />
    </ItemDetailMain>
  )
}

export default WithdrawDetailPage
