import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import Link from '@/components/link'
import { getMonkeyMemberGetLoginLogs, getMonkeyMemberGetSecurityLogs } from '@/apis/user'
import { UserSafetyRecordType } from '@/typings/api/user'
import { formatDate } from '@/helper/date'
import UserSettingsHeaderInfo from '@/features/user/common/header-info'
import Icon from '@/components/icon'
import styles from './index.module.css'

interface SefetyRecordListProps {
  isLoginLogs?: boolean
  title: string
  tableList: Array<UserSafetyRecordType>
}

enum LoginSuccessEnum {
  success = 1,
  fail,
}

function TableItem({ item }) {
  const clientList = ['', 'web', 'android', 'api', 'h5', 'ios']
  return (
    <>
      <div className="time">
        <label>{formatDate(item.createTime)}</label>
      </div>
      <div className="ip">
        <label>{item.ipAddress}</label>
      </div>
      <div className="city">
        <label>{item.city}</label>
      </div>
      <div className="login-method">
        <label>{clientList[item.client]}</label>
      </div>
      <div className="result">
        {item.status && (
          <label>
            {item.status === LoginSuccessEnum.success
              ? t`assets.enum.tradeRecordStatus.success`
              : t`assets.financial-record.search.failure`}
          </label>
        )}
        {item.securityDesc && <label>{item.securityDesc}</label>}
      </div>
    </>
  )
}

function SefetyRecordList({ isLoginLogs, title, tableList }: SefetyRecordListProps) {
  return (
    <div className="list">
      <div className="header">
        <div className="title">
          <label>{title}</label>
        </div>
        <div className="tips">
          <label>{t`features/user/personal-center/account-security/safety-record/index-0`}</label>
        </div>
      </div>

      <div className="table-header">
        <div className="time">
          <label>{t`future.funding-history.funding-rate.column.time`}</label>
        </div>
        <div className="ip">
          <label>IP</label>
        </div>
        <div className="city">
          <label>{t`features/user/personal-center/account-security/safety-record/index-1`}</label>
        </div>
        <div className="login-method">
          <label>{t`features/user/personal-center/account-security/safety-record/index-2`}</label>
        </div>
        <div className="result">
          <label>
            {isLoginLogs
              ? t`features/user/personal-center/account-security/safety-record/index-3`
              : t`features/user/personal-center/account-security/safety-record/index-4`}
          </label>
        </div>
      </div>

      {tableList.length > 0 ? (
        <>
          {tableList.map(v => (
            <div className="item" key={v.createTime}>
              <TableItem item={v} />
            </div>
          ))}
        </>
      ) : (
        <div className="no-result">
          <div className="icon">
            <Icon name="no_data" hasTheme isRemoteUrl width={175} height={158} />
          </div>
          <div className="text">
            <label>{t`trade.c2c.noData`}</label>
          </div>
        </div>
      )}
    </div>
  )
}

function UserSafetyRecord() {
  const [loginLogsList, setLoginLogsList] = useState<Array<UserSafetyRecordType>>([])
  const [securityLogsList, setSecurityLogsList] = useState<Array<UserSafetyRecordType>>([])
  const [lastLoginInfo, setLastLoginInfo] = useState<UserSafetyRecordType>()

  const getLoginLogs = async () => {
    const res = await getMonkeyMemberGetLoginLogs({})
    if (res.isOk) {
      const arr = [...res.data]
      const lastInfo = arr.shift()

      setLoginLogsList(res.data)
      setLastLoginInfo({
        ...lastInfo,
      })
    }
  }

  const getSecurityLogs = async () => {
    const res = await getMonkeyMemberGetSecurityLogs({})
    if (res.isOk) {
      setSecurityLogsList(res.data)
    }
  }

  useEffect(() => {
    getLoginLogs()
    getSecurityLogs()
  }, [])

  return (
    <section className={`user-safety-record ${styles.scoped}`}>
      <div className="user-safety-record-wrap">
        <UserSettingsHeaderInfo
          footerContent={
            <>
              <label>
                {t`features/user/personal-center/account-security/safety-record/index-8`}：
                {lastLoginInfo?.createTime && formatDate(lastLoginInfo?.createTime)}
              </label>
              <label>IP: {lastLoginInfo?.ipAddress}</label>
            </>
          }
          operateContent={
            <Link href="/personal-center/account-security">
              {t`features/user/personal-center/account-security/safety-record/index-5`}
              <Icon name="next_arrow_hover" />
            </Link>
          }
        />

        <div className="sefety-record-list">
          <div className="sefety-record-list-wrap">
            <SefetyRecordList
              isLoginLogs
              title={t`features/user/personal-center/account-security/safety-record/index-6`}
              tableList={loginLogsList}
            />

            <SefetyRecordList
              title={t`features/user/personal-center/account-security/safety-record/index-7`}
              tableList={securityLogsList}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserSafetyRecord
