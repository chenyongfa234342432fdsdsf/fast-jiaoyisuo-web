import React from 'react'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { useCommonStore } from '@/store/common'
import { CardType } from '../kyt-const'

type StandardItem = {
  text: string
  icon: React.ReactNode
  src: string
}

type RequirementItem = {
  text: string
  icon: React.ReactNode
}

const useKycrEquirement = (selectChange: string) => {
  const { theme } = useCommonStore()

  const themeColor = theme === 'dark' ? 'black' : 'white'

  const getSelectChange = () => {
    const certificatesType = {
      [CardType.PASSPORT]: 'passport',
      [CardType.IDENTITYCARD]: 'id_card',
      [CardType.DRIVINGLICENCE]: 'driving',
    }
    return certificatesType[selectChange]
  }

  const standardList: StandardItem[] = [
    {
      icon: <Icon name="login_satisfied" />,
      text: t`features_kyc_kyc_requirement_kycrequirement_2660`,
      src: `${getSelectChange()}_standard_${themeColor}`,
    },
    {
      icon: <Icon name="icon_fail" />,
      text: t`features_kyc_kyc_requirement_kycrequirement_2661`,
      src: `${getSelectChange()}_missing_${themeColor}`,
    },
    {
      icon: <Icon name="icon_fail" />,
      text: t`features_kyc_kyc_requirement_kycrequirement_2662`,
      src: `${getSelectChange()}_blur_${themeColor}`,
    },
    {
      icon: <Icon name="icon_fail" />,
      text: t`features_kyc_kyc_requirement_kycrequirement_2663`,
      src: `${getSelectChange()}_flash_${themeColor}`,
    },
  ]

  const requirementList: RequirementItem[] = [
    {
      icon: <Icon name="login_satisfied" />,
      text: t`features_kyc_kyc_requirement_kycrequirement_5101274`,
    },
    {
      icon: <Icon name="login_satisfied" />,
      text: t`features_kyc_kyc_requirement_kycrequirement_5101275`,
    },
    {
      icon: <Icon name="login_satisfied" />,
      text: t`features_kyc_kyc_requirement_kycrequirement_5101276`,
    },
    {
      icon: <Icon name="login_satisfied" />,
      text: t`features_kyc_kyc_requirement_kycrequirement_5101277`,
    },
    {
      icon: <Icon name="icon_fail" />,
      text: t`features_kyc_kyc_requirement_kycrequirement_2666`,
    },
  ]

  return { standardList, requirementList }
}

export { useKycrEquirement }
