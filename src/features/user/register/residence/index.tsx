import { useState } from 'react'
import { useMount } from 'react-use'
import { Button, Form, Select, Image, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import UserSearchArea from '@/features/user/common/search-area'
import UserPopUp from '@/features/user/components/popup'
import UserFormLayout from '@/features/user/common/user-form-layout'
import { useUserStore } from '@/store/user'
import { usePageContext } from '@/hooks/use-page-context'
import { MemberMemberAreaType } from '@/typings/user'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { getMemberAreaIp } from '@/apis/user'
import { UserEnabledStateTypeEnum } from '@/constants/user'
import Icon from '@/components/icon'
import styles from './index.module.css'

const FormItem = Form.Item

function UserRegisterResidence() {
  const [isEnble, setIsEnble] = useState<boolean>(true)
  const [area, setArea] = useState<MemberMemberAreaType>({
    codeVal: '86',
    codeKey: t`features_user_personal_center_account_security_phone_index_2432`,
    remark: 'CN',
  })

  const [visible, setVisible] = useState<boolean>(false)
  const store = useUserStore()
  const pageContext = usePageContext()
  const { invitationCode } = pageContext.urlParsed.search
  const hasInvitationCode = invitationCode ? `&invitationCode=${invitationCode}` : ''

  const getAreaIp = async () => {
    const res = await getMemberAreaIp({})
    if (res.isOk) {
      const { enCode, fullName, shortName } = res.data

      setArea({
        codeVal: enCode,
        codeKey: fullName,
        remark: shortName,
      })
      // res.data.enableInd === UserEnabledStateTypeEnum.unEnable ? setIsEnble(false) : setIsEnble(true)
    }
  }

  useMount(getAreaIp)

  const handleSelectArea = (v: MemberMemberAreaType) => {
    if (v.enableInd === UserEnabledStateTypeEnum.enable) setIsEnble(true)
    setArea(v)
    setVisible(false)
  }

  const handleNextStep = () => {
    if (!isEnble || !area?.codeVal) {
      Message.info(t`features_user_register_residence_index_2600`)
      return
    }

    store.setUserTransitionDatas(area)
    link(`/register/flow?regCountry=${area?.remark}${hasInvitationCode}`)
  }

  return (
    <div className={`user-register-residence user-form-style ${styles.scoped}`}>
      <div className="user-register-residence-wrap">
        <UserFormLayout title={t`user.register.fresidence_01`}>
          <Form layout="vertical" onSubmit={handleNextStep}>
            <div className="tips">
              <label>{t`user.register.fresidence_02`}</label>
            </div>
            <FormItem
              label={t`features_user_company_basic_imformation_index_2585`}
              field="area"
              validateStatus={isEnble ? undefined : 'error'}
            >
              <Select
                onClick={() => setVisible(true)}
                popupVisible={false}
                arrowIcon={<Icon name="arrow_open" hasTheme />}
                prefix={
                  !isEnble ? (
                    `-- : --`
                  ) : (
                    <>
                      <Image preview={false} src={`${oss_area_code_image_domain_address}${area?.remark}.png`} />
                      <label>{area?.codeKey}</label>
                    </>
                  )
                }
              />
            </FormItem>

            <div className="text">
              <label>
                {t`user.register.fresidence_04`} <span>{t`user.register.fresidence_05`}</span>{' '}
                {t`user.register.fresidence_06`}
              </label>
            </div>

            <FormItem style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                // disabled={!isEnble}
              >
                {t`user.field.reuse_23`}
              </Button>
            </FormItem>
          </Form>
        </UserFormLayout>
      </div>

      <UserPopUp
        title={<div style={{ textAlign: 'left' }}>{t`user.search_area_04`}</div>}
        className="user-popup"
        maskClosable={false}
        visible={visible}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <UserSearchArea
          type="area"
          checkedValue={area?.codeVal}
          placeholderText={t`user.field.reuse_25`}
          selectArea={handleSelectArea}
        />
      </UserPopUp>
    </div>
  )
}

export default UserRegisterResidence
