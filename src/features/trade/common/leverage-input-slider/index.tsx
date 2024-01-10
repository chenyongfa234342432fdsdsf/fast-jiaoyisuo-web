import { useEffect, useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { getLeverSliderPoints } from '@/helper/trade'
import LeverageInput from './leverage-input'
import LeverageSlider from './leverage-slider'

export type TLeverageInputSliderProps = {
  leverage: number
  maxLeverage: number
  onChange?: any
  initLever?: number
}

export function LeverageInputSlider({ leverage, maxLeverage, onChange, initLever }: TLeverageInputSliderProps) {
  const [currentVal, setcurrentVal] = useState(leverage)
  // calculate range steps
  const sliderRange = getLeverSliderPoints(maxLeverage)

  useUpdateEffect(() => {
    onChange && onChange(currentVal)
  }, [currentVal])

  useEffect(() => {
    setcurrentVal(leverage)
  }, [leverage])

  return (
    <>
      <LeverageInput leverage={currentVal} initLever={initLever} range={sliderRange} onchange={v => setcurrentVal(v)} />
      <LeverageSlider leverage={currentVal} range={sliderRange} onchange={v => setcurrentVal(v)} />
    </>
  )
}
