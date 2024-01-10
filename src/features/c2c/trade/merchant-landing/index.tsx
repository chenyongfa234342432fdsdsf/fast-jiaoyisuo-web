import LazyImage, { Type } from '@/components/lazy-image'
import { c2cOssImgUrl } from '@/constants/c2c'
import { c2cOssImgMaNameMap } from '@/constants/c2c/merchant-application'
import C2CTab from '@/features/c2c/trade/c2c-tab'
import { C2cBadgeItem } from '@/features/c2c/trade/merchant-landing/badge-item'
import { C2cMaStatusCheck } from '@/features/c2c/trade/merchant-landing/marchant-info-status'
import { C2cMaTitleWithDecoration } from '@/features/c2c/trade/merchant-landing/title-with-decoration'
import { getIsLogin } from '@/helper/auth'
import { useC2CMaStore } from '@/store/c2c/merchant-application'
import { useLayoutStore } from '@/store/layout'
import { t } from '@lingui/macro'
import { useMount } from 'ahooks'
import classNames from 'classnames'
import { useScaleDom } from '@/hooks/use-scale-dom'
import styles from './index.module.css'

export function C2cMerchantApplicationLanding() {
  const bizName = useLayoutStore().headerData?.businessName || ''
  const domRef = useScaleDom(1000, bizName)

  const store = useC2CMaStore()
  useMount(() => {
    store.apis.fetchCommonSettings()

    if (getIsLogin()) {
      store.apis.fetchUserApplicationStatus()
      store.apis.fetchC2cUserInfo()
      store.apis.fetchKycInfo()
    }
  })

  return (
    <C2CTab>
      <div className={classNames(styles.scope)}>
        <div className="banner">
          <LazyImage imageType={Type.png} src={`${c2cOssImgUrl}/${c2cOssImgMaNameMap.ma_header_bg}`} height={210} />
        </div>

        <div className="logo-row">
          <div className="logo">
            <LazyImage
              imageType={Type.png}
              src={`${c2cOssImgUrl}/${c2cOssImgMaNameMap.ma_header_logo}`}
              width={200}
              height={200}
            />
          </div>
        </div>

        <div className="content">
          <div className="header">
            <div className="header-title" ref={domRef}>
              {t({
                id: 'features_c2c_new_merchant_application_index_222225101366',
                values: { 0: bizName },
              })}
            </div>

            <div className="bullets">
              <div className="wrap">
                <div className="item">{t`features_c2c_new_merchant_application_index_2222225101367`}</div>
                <div className="item">{t`features_c2c_new_merchant_application_index_2222225101368`}</div>
              </div>
              <div className="wrap">
                <div className="item">{t`features_c2c_new_merchant_application_index_225101355`}</div>
                <div className="item">{t`features_c2c_new_merchant_application_index_2222225101369`}</div>
              </div>
            </div>
          </div>
          <div className="row-badges">
            <div className="row-title flex justify-center items-center">
              <C2cMaTitleWithDecoration
                title={
                  <>
                    {bizName} {t`features_c2c_new_merchant_application_index_225101354`}
                  </>
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <C2cBadgeItem
                name={t`features_c2c_new_merchant_application_index_225101355`}
                subName={t`features_c2c_new_merchant_application_index_225101356`}
                imgSrc={`${c2cOssImgUrl}/${c2cOssImgMaNameMap.ma_star}`}
                rightBgImgSrc={`${c2cOssImgUrl}/${c2cOssImgMaNameMap.ma_bg_star}`}
              />
              <C2cBadgeItem
                name={t`features_c2c_new_merchant_application_index_225101357`}
                subName={t`features_c2c_new_merchant_application_index_225101358`}
                imgSrc={`${c2cOssImgUrl}/${c2cOssImgMaNameMap.ma_contact}`}
                rightBgImgSrc={`${c2cOssImgUrl}/${c2cOssImgMaNameMap.ma_bg_contact}`}
              />
            </div>
          </div>

          <C2cMaStatusCheck />
        </div>
      </div>
    </C2CTab>
  )
}
