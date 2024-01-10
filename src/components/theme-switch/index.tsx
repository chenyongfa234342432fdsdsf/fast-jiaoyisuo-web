import { useState } from 'react'
import { useCommonStore } from '@/store/common'
import Icon from '@/components/icon'
import { ThemeEnum } from '@/constants/base'

function ThemeSwitch() {
  const commonState = useCommonStore()

  const [theme, setTheme] = useState(commonState.theme)

  const updateTheme = () => {
    let themeSetting: ThemeEnum
    if (theme === ThemeEnum.light) {
      themeSetting = ThemeEnum.dark
    } else {
      themeSetting = ThemeEnum.light
    }
    commonState.setTheme(themeSetting)
    setTheme(themeSetting)
  }

  return (
    <div className="theme-menu">
      <Icon
        onClick={updateTheme}
        className="cursor-pointer"
        name={`${theme === ThemeEnum.dark ? 'nav_night' : 'nav_day'}`}
        hover
        fontSize={22}
      />
    </div>
  )
}
export default ThemeSwitch
