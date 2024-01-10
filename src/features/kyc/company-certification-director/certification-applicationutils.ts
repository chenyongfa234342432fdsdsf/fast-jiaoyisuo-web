import { t } from '@lingui/macro'
import { CardType } from '../kyt-const'

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

const getInitialDirector = () => {
  return {
    birthDay: '',
    country: undefined,
    firstName: '',
    certNumber: '',
    realPersonPhotoUrl: '',
    cardFrontPhotoUrlBack: '',
    cardFrontPhotoUrl: '',
    lastName: '',
    middleName: '',
    certificateValidity: { certValidDateStart: '', certValidDateEnd: '', certIsPermanent: 2 },
    certValidDateEnd: '',
    certValidDateStart: '',
  }
}

export { findDriverCountry, getFormCardType, setMessage, getInitialDirector }
