import { t } from '@lingui/macro'
import { CardType } from '../kyt-const'

const usePersonApplication = () => {
  const findDriverCountry = country => {
    return ['US', 'AU', 'NZ', 'CA', 'GB', 'DE'].includes(country)
  }

  const getFormCardType = () => {
    return [
      { title: t`features_user_person_application_index_5101098`, value: CardType.IDENTITYCARD },
      { title: t`features_user_person_application_index_5101099`, value: CardType.PASSPORT },
      { title: t`features_user_person_application_index_5101100`, value: CardType.DRIVINGLICENCE },
    ]
  }

  const setMessage = () => {
    return [{ required: true, message: t`features/c2c-trade/creates-advertisements/createsadvertisements-0` }]
  }

  return { findDriverCountry, getFormCardType, setMessage }
}

export { usePersonApplication }
