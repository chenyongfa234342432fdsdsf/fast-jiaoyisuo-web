import { Button, Checkbox, Input, Message, Modal } from '@nbit/arco'
import React, { useEffect, useState } from 'react'
import { CommonMainOrSubType, MainIndicatorType, SubIndicatorType } from '@nbit/chart-utils'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import cacheUtils from 'store'

import styles from './index.module.css'

interface PropsType {
  visible: boolean
  setVisible: (value: boolean) => void
  mainIndicator: MainIndicatorType
  setMainIndicator: (value: MainIndicatorType) => void
  subIndicator: SubIndicatorType
  setSubIndicator: (value: SubIndicatorType) => void
}

function IndicatorModal(props: PropsType) {
  const { visible, setVisible, mainIndicator, setMainIndicator, subIndicator, setSubIndicator } = props

  const [mainIndicatorCopy, setMainIndicatorCopy] = useState<MainIndicatorType>(
    JSON.parse(JSON.stringify(mainIndicator))
  )
  const [subIndicatorCopy, setSubIndicatorCopy] = useState<SubIndicatorType>(JSON.parse(JSON.stringify(subIndicator)))

  useEffect(() => {
    setMainIndicatorCopy(JSON.parse(JSON.stringify(mainIndicator)))
    setSubIndicatorCopy(JSON.parse(JSON.stringify(subIndicator)))
  }, [mainIndicator, subIndicator])

  const [currentSelect, setCurrentSelect] = useState<string>('ma')

  const closeModal = () => {
    setVisible(false)
  }

  const [subTitleListStatus, setSubTitleListStatus] = useState({
    macd: false,
    kdj: false,
    rsi: false,
    wr: false,
  })

  /** 点击箭头配置指标 */
  const updateCurrentSelect = item => {
    setCurrentSelect(item.value)
  }

  /** 点击主图复选框 */
  const mainCheckboxChange = (value, name) => {
    setMainIndicatorCopy({
      ...mainIndicatorCopy,
      [name]: {
        ...mainIndicatorCopy[name],
        select: value,
      },
    })
  }

  /** 点击副图复选框 */
  const subCheckboxChange = (value, name) => {
    let newSubIndicatorCopy = {
      ...subIndicatorCopy,
      [name]: {
        ...subIndicatorCopy[name],
        select: value,
      },
    }
    setSubIndicatorCopy(newSubIndicatorCopy)

    /** 如果选择的副图超过3个就禁用其它 参考bi an */

    let checkListStatus = {
      macd: false,
      kdj: false,
      rsi: false,
      wr: false,
    }
    let selectList: Array<string> = []
    let notSelectList: Array<string> = []
    for (let i in newSubIndicatorCopy) {
      if (newSubIndicatorCopy[i].select) {
        selectList.push(newSubIndicatorCopy[i].name)
      } else {
        notSelectList.push(newSubIndicatorCopy[i].name)
      }
    }
    if (selectList.length >= 3) {
      notSelectList.forEach(item => {
        checkListStatus[item] = true
      })
    }

    setSubTitleListStatus(checkListStatus)
  }

  /** 点击线复选框 */
  const mainSubCheckboxChange = (value, subType, index, type) => {
    setMainIndicatorCopy({
      ...mainIndicatorCopy,
      [type]: {
        ...mainIndicatorCopy[type],
        [subType]: mainIndicatorCopy[type][subType].map((item, _index) => {
          if (index === _index) {
            return {
              ...item,
              select: value,
            }
          }
          return item
        }),
      },
    })
  }

  const subMainCheckboxChange = (value, subType, index, type) => {
    setSubIndicatorCopy({
      ...subIndicatorCopy,
      [type]: {
        ...subIndicatorCopy[type],
        [subType]: subIndicatorCopy[type][subType].map((item, _index) => {
          if (index === _index) {
            return {
              ...item,
              select: value,
            }
          }
          return item
        }),
      },
    })
  }

  /** ma input change */
  const maIndicatorInputChange = (value, index) => {
    setMainIndicatorCopy({
      ...mainIndicatorCopy,
      ma: {
        ...mainIndicatorCopy.ma,
        cur: mainIndicatorCopy.ma.cur.map((item, _index) => {
          if (index === _index) {
            return {
              ...item,
              strip: value,
            }
          }
          return item
        }),
      },
    })
  }

  const bollIndicatorInputChange = (value, type) => {
    setMainIndicatorCopy({
      ...mainIndicatorCopy,
      boll: {
        ...mainIndicatorCopy.boll,
        cur: {
          ...mainIndicatorCopy.boll.cur,
          [type]: {
            ...mainIndicatorCopy.boll.cur[type],
            value,
          },
        },
      },
    })
  }

  const macdOrKdjIndicatorInputChange = (value, type, name) => {
    setSubIndicatorCopy({
      ...subIndicatorCopy,
      [name]: {
        ...subIndicatorCopy[name],
        cur: {
          ...subIndicatorCopy[name].cur,
          [type]: {
            ...subIndicatorCopy[name].cur[type],
            value,
          },
        },
      },
    })
  }

  const rsiOrWrIndicatorInputChange = (value, index, type) => {
    setSubIndicatorCopy({
      ...subIndicatorCopy,
      [type]: {
        ...subIndicatorCopy[type],
        cur: subIndicatorCopy[type].cur.map((item, _index) => {
          if (index === _index) {
            return {
              ...item,
              value,
            }
          }
          return item
        }),
      },
    })
  }

  /** 重置 */
  const resetMa = () => {
    setMainIndicatorCopy({
      ...mainIndicatorCopy,
      ma: {
        ...mainIndicatorCopy.ma,
        cur: mainIndicatorCopy.ma.init,
      },
    })
  }

  const resetBoll = () => {
    setMainIndicatorCopy({
      ...mainIndicatorCopy,
      boll: {
        ...mainIndicatorCopy.boll,
        cur: mainIndicatorCopy.boll.init,
        curLine: mainIndicatorCopy.boll.initLine,
      },
    })
  }

  const resetMacdOrKdj = key => {
    setSubIndicatorCopy({
      ...subIndicatorCopy,
      [key]: {
        ...subIndicatorCopy[key],
        cur: subIndicatorCopy[key].init,
        curLine: subIndicatorCopy[key].initLine,
      },
    })
  }

  const resetRsiOrWr = key => {
    setSubIndicatorCopy({
      ...subIndicatorCopy,
      [key]: {
        ...subIndicatorCopy[key],
        cur: subIndicatorCopy[key].init,
      },
    })
  }

  /** 保存 */
  const confirmMainAndSub = () => {
    setMainIndicator(mainIndicatorCopy)
    cacheUtils.set('mainIndicator', mainIndicatorCopy)
    setSubIndicator(subIndicatorCopy)
    cacheUtils.set('subIndicator', subIndicatorCopy)
    closeModal()
  }

  // const confirmSub = () => {
  //   setSubIndicator(subIndicatorCopy)
  //   localStorage.setItem('subIndicator', JSON.stringify(subIndicatorCopy))
  //   closeModal()
  // }

  const mainTitleList = [
    {
      title: t`components_chart_indicator_modal_index_2696`,
      value: 'ma',
    },
    {
      title: t`components_chart_indicator_modal_index_2697`,
      value: 'boll',
    },
  ]

  const subTitleList = [
    {
      title: 'VOL',
      value: 'vol',
      disabled: false,
    },
    {
      title: t`components_chart_indicator_modal_index_2698`,
      value: 'macd',
      disabled: false,
    },
    {
      title: t`components_chart_indicator_modal_index_2699`,
      value: 'kdj',
      disabled: false,
    },
    {
      title: t`components_chart_indicator_modal_index_2700`,
      value: 'rsi',
      disabled: false,
    },
    {
      title: t`components_chart_indicator_modal_index_2701`,
      value: 'wr',
      disabled: false,
    },
  ]

  return (
    <Modal
      style={{ width: 655, height: 573 }}
      footer={null}
      title={t`components_chart_indicator_modal_index_2695`}
      visible={visible}
      onCancel={() => {
        closeModal()
      }}
      className={styles.scoped}
      getPopupContainer={() => document.getElementById('fullscreen') as HTMLElement}
    >
      <div className="modal-wrap">
        <div className="left-wrap">
          <div className="main-title">{t`components_chart_indicator_modal_index_2702`}</div>
          {mainTitleList.map(item => {
            return (
              <div key={item.value} className="main left-height">
                <div className="main-select">
                  <Checkbox
                    checked={mainIndicatorCopy[item.value].select}
                    onChange={value => {
                      mainCheckboxChange(value, item.value)
                      // updateCurrentSelect(item)
                    }}
                  />
                </div>
                <div className="select-title-wrap">
                  <span onClick={() => updateCurrentSelect(item)} className="main-select-title">
                    {item.title}
                  </span>
                  <Icon name="next_arrow_white" onClick={() => updateCurrentSelect(item)} className="next-icon" />
                </div>
              </div>
            )
          })}
          <div className="main-title mt-4">{t`components_chart_indicator_modal_index_2703`}</div>
          {subTitleList.map(item => {
            return (
              <div key={item.value} className="main left-height">
                <div className="main-select">
                  <Checkbox
                    disabled={subTitleListStatus[item.value]}
                    checked={subIndicatorCopy[item.value]?.select}
                    onChange={value => {
                      subCheckboxChange(value, item.value)
                      // updateCurrentSelect(item)
                    }}
                  />
                </div>
                <div className="select-title-wrap">
                  <span onClick={() => updateCurrentSelect(item)} className="main-select-title">
                    {item.title}
                  </span>
                  <Icon name="next_arrow_white" onClick={() => updateCurrentSelect(item)} className="next-icon" />
                </div>
              </div>
            )
          })}
        </div>
        <div className="right-wrap">
          {currentSelect === 'ma' && (
            <div className="ma-wrap">
              {mainIndicatorCopy.ma.cur.map((item, index) => {
                return (
                  <div key={item.color} style={{ marginTop: index === 0 ? 0 : '16px' }} className="main right-height">
                    <div className="main-select">
                      <Checkbox
                        checked={item.select}
                        onChange={value => mainSubCheckboxChange(value, 'cur', index, 'ma')}
                      />
                      <span className="ml-2">MA{index + 1}</span>
                    </div>
                    <div className="input-wrap">
                      <Input
                        style={{ width: 88 }}
                        value={item.strip.toString()}
                        allowClear
                        onChange={value => maIndicatorInputChange(value, index)}
                      />
                      <div style={{ background: item.color }} className="color"></div>
                    </div>
                  </div>
                )
              })}
              <div className="des-title">{t`components_chart_indicator_modal_index_2704`}</div>
              <p className="des">
                {t`components_chart_indicator_modal_index_2705`} {t`components_chart_indicator_modal_index_2706`}
              </p>
              <div className="oper">
                <Button onClick={resetMa} className="button">
                  {t`user.field.reuse_47`}
                </Button>
                <Button onClick={confirmMainAndSub} className="button" type="primary">
                  {t`user.field.reuse_10`}
                </Button>
              </div>
            </div>
          )}
          {currentSelect === 'boll' && (
            <div className="ma-wrap">
              <div style={{ marginTop: 0 }} className="main right-height">
                <div className="main-select">{t`components_chart_indicator_modal_index_2707`}</div>
                <div className="input-wrap">
                  <Input
                    style={{ width: 88 }}
                    value={(mainIndicatorCopy.boll.cur.mid as CommonMainOrSubType).value?.toString()}
                    allowClear
                    onChange={value => {
                      bollIndicatorInputChange(value, 'mid')
                    }}
                  />
                </div>
              </div>
              <div className="main right-height">
                <div className="main-select">{t`components_chart_indicator_modal_index_2708`}</div>
                <div className="input-wrap">
                  <Input
                    style={{ width: 88 }}
                    value={(mainIndicatorCopy.boll.cur.std as CommonMainOrSubType).value?.toString()}
                    allowClear
                    onChange={value => {
                      bollIndicatorInputChange(value, 'std')
                    }}
                  />
                </div>
              </div>
              {mainIndicatorCopy.boll.curLine?.map((item, index) => {
                return (
                  <div key={item.name} className="main right-height">
                    <div className="main-select">
                      <Checkbox
                        checked={item.select}
                        onChange={value => mainSubCheckboxChange(value, 'curLine', index, 'boll')}
                      />
                      <span className="ml-2">{item.name}</span>
                    </div>
                    <div className="input-wrap">
                      <div style={{ background: item.color }} className="color"></div>
                    </div>
                  </div>
                )
              })}
              <div className="des-title">{t`components_chart_indicator_modal_index_2704`}</div>
              <p className="des">
                {t`components_chart_indicator_modal_index_2709`} {t`components_chart_indicator_modal_index_2710`}
                {t`components_chart_indicator_modal_index_2711`}
              </p>
              <div className="oper">
                <Button onClick={resetBoll} className="button">
                  {t`user.field.reuse_47`}
                </Button>
                <Button onClick={confirmMainAndSub} className="button" type="primary">
                  {t`user.field.reuse_10`}
                </Button>
              </div>
            </div>
          )}
          {currentSelect === 'macd' && (
            <div className="ma-wrap">
              <div style={{ marginTop: 0 }} className="main right-height">
                <div className="main-select">{t`components_chart_indicator_modal_index_2712`}</div>
                <div className="input-wrap">
                  <Input
                    style={{ width: 88 }}
                    value={(subIndicatorCopy.macd.cur.fast as CommonMainOrSubType).value?.toString()}
                    allowClear
                    onChange={value => {
                      macdOrKdjIndicatorInputChange(value, 'fast', 'macd')
                    }}
                  />
                </div>
              </div>
              <div className="main right-height">
                <div className="main-select">{t`components_chart_indicator_modal_index_2713`}</div>
                <div className="input-wrap">
                  <Input
                    style={{ width: 88 }}
                    value={(subIndicatorCopy.macd.cur.slow as CommonMainOrSubType).value?.toString()}
                    allowClear
                    onChange={value => {
                      macdOrKdjIndicatorInputChange(value, 'slow', 'macd')
                    }}
                  />
                </div>
              </div>
              <div className="main right-height">
                <div className="main-select">{t`components_chart_indicator_modal_index_2714`}</div>
                <div className="input-wrap">
                  <Input
                    style={{ width: 88 }}
                    value={(subIndicatorCopy.macd.cur.signal as CommonMainOrSubType).value?.toString()}
                    allowClear
                    onChange={value => {
                      macdOrKdjIndicatorInputChange(value, 'signal', 'macd')
                    }}
                  />
                </div>
              </div>
              {subIndicatorCopy.macd.curLine?.map((item, index) => {
                return (
                  <div key={item.name} className="main right-height">
                    <div className="main-select">
                      <Checkbox
                        checked={item.select}
                        onChange={value => subMainCheckboxChange(value, 'curLine', index, 'macd')}
                      />
                      <span className="ml-2">{item.name}</span>
                    </div>
                    <div className="input-wrap">
                      <div style={{ background: item.color }} className="color"></div>
                    </div>
                  </div>
                )
              })}
              <div className="des-title">{t`components_chart_indicator_modal_index_2704`}</div>
              <p className="des">
                {t`components_chart_indicator_modal_index_2715`} {t`components_chart_indicator_modal_index_2716`}{' '}
                {t`components_chart_indicator_modal_index_2717`}
                {t`components_chart_indicator_modal_index_2718`} {t`components_chart_indicator_modal_index_2719`}{' '}
                {t`components_chart_indicator_modal_index_2720`}
              </p>
              <div className="oper">
                <Button
                  onClick={() => {
                    resetMacdOrKdj('macd')
                  }}
                  className="button"
                >
                  {t`user.field.reuse_47`}
                </Button>
                <Button onClick={confirmMainAndSub} className="button" type="primary">
                  {t`user.field.reuse_10`}
                </Button>
              </div>
            </div>
          )}
          {currentSelect === 'kdj' && (
            <div className="ma-wrap">
              <div style={{ marginTop: 0 }} className="main right-height">
                <div className="main-select">{t`components_chart_indicator_modal_index_2707`}</div>
                <div className="input-wrap">
                  <Input
                    style={{ width: 88 }}
                    value={(subIndicatorCopy.kdj.cur.k as CommonMainOrSubType).value?.toString()}
                    allowClear
                    onChange={value => {
                      macdOrKdjIndicatorInputChange(value, 'k', 'kdj')
                    }}
                  />
                </div>
              </div>
              <div className="main right-height">
                <div className="main-select">{t`components_chart_indicator_modal_index_2714`}</div>
                <div className="input-wrap">
                  <Input
                    style={{ width: 88 }}
                    value={(subIndicatorCopy.kdj.cur.d as CommonMainOrSubType).value?.toString()}
                    allowClear
                    onChange={value => {
                      macdOrKdjIndicatorInputChange(value, 'd', 'kdj')
                    }}
                  />
                </div>
              </div>
              <div className="main right-height">
                <div className="main-select">{t`components_chart_indicator_modal_index_2714`}</div>
                <div className="input-wrap">
                  <Input
                    style={{ width: 88 }}
                    value={(subIndicatorCopy.kdj.cur.j as CommonMainOrSubType).value?.toString()}
                    allowClear
                    onChange={value => {
                      macdOrKdjIndicatorInputChange(value, 'j', 'kdj')
                    }}
                  />
                </div>
              </div>
              {subIndicatorCopy.kdj.curLine?.map((item, index) => {
                return (
                  <div key={item.name} className="main right-height">
                    <div className="main-select">
                      <Checkbox
                        checked={item.select}
                        onChange={value => subMainCheckboxChange(value, 'curLine', index, 'kdj')}
                      />
                      <span className="ml-2">{item.name}</span>
                    </div>
                    <div className="input-wrap">
                      <div style={{ background: item.color }} className="color"></div>
                    </div>
                  </div>
                )
              })}
              <div className="des-title">{t`components_chart_indicator_modal_index_2704`}</div>
              <p className="des">
                {t`components_chart_indicator_modal_index_2721`} {t`components_chart_indicator_modal_index_2722`}{' '}
                {t`components_chart_indicator_modal_index_2723`}
                {t`components_chart_indicator_modal_index_2724`} {t`components_chart_indicator_modal_index_2725`}
                {t`components_chart_indicator_modal_index_2726`}
              </p>
              <div className="oper">
                <Button
                  onClick={() => {
                    resetMacdOrKdj('kdj')
                  }}
                  className="button"
                >
                  {t`user.field.reuse_47`}
                </Button>
                <Button onClick={confirmMainAndSub} className="button" type="primary">
                  {t`user.field.reuse_10`}
                </Button>
              </div>
            </div>
          )}
          {currentSelect === 'rsi' && (
            <div className="ma-wrap">
              {subIndicatorCopy.rsi.cur.map((item, index) => {
                return (
                  <div key={item.color} style={{ marginTop: !index ? 0 : '16px' }} className="main right-height">
                    <div className="main-select">MA{index + 1}</div>
                    <div className="input-wrap">
                      <Input
                        style={{ width: 88 }}
                        value={item.value?.toString()}
                        allowClear
                        onChange={value => {
                          rsiOrWrIndicatorInputChange(value, index, 'rsi')
                        }}
                      />
                    </div>
                  </div>
                )
              })}

              {subIndicatorCopy.rsi.cur.map((item, index) => {
                return (
                  <div key={item.color} className="main right-height">
                    <div className="main-select">
                      <Checkbox
                        checked={item.select}
                        onChange={value => {
                          subMainCheckboxChange(value, 'cur', index, 'rsi')
                        }}
                      />
                      <span className="ml-2">RSI{index + 1}</span>
                    </div>
                    <div className="input-wrap">
                      <div style={{ background: item.color }} className="color"></div>
                    </div>
                  </div>
                )
              })}
              <div className="des-title">{t`components_chart_indicator_modal_index_2704`}</div>
              <p className="des">
                {t`components_chart_indicator_modal_index_2727`} {t`components_chart_indicator_modal_index_2728`}
              </p>
              <div className="oper">
                <Button
                  onClick={() => {
                    resetRsiOrWr('rsi')
                  }}
                  className="button"
                >
                  {t`user.field.reuse_47`}
                </Button>
                <Button onClick={confirmMainAndSub} className="button" type="primary">
                  {t`user.field.reuse_10`}
                </Button>
              </div>
            </div>
          )}
          {currentSelect === 'wr' && (
            <div className="ma-wrap">
              {subIndicatorCopy.wr.cur.map((item, index) => {
                return (
                  <div key={item.color} style={{ marginTop: !index ? 0 : '16px' }} className="main right-height">
                    <div className="main-select">{t`components_chart_indicator_modal_index_2707`}</div>
                    <div className="input-wrap">
                      <Input
                        style={{ width: 88 }}
                        value={item.value?.toString()}
                        allowClear
                        onChange={value => {
                          rsiOrWrIndicatorInputChange(value, index, 'wr')
                        }}
                      />
                    </div>
                  </div>
                )
              })}

              {subIndicatorCopy.wr.cur.map((item, index) => {
                return (
                  <div key={item.color} className="main right-height">
                    <div className="main-select">
                      <Checkbox
                        checked={item.select}
                        onChange={value => {
                          subMainCheckboxChange(value, 'cur', index, 'wr')
                        }}
                      />
                      <span className="ml-2">WR{index + 1}</span>
                    </div>
                    <div className="input-wrap">
                      <div style={{ background: item.color }} className="color"></div>
                    </div>
                  </div>
                )
              })}
              <div className="des-title">{t`components_chart_indicator_modal_index_2704`}</div>
              <p className="des">
                {t`components_chart_indicator_modal_index_2729`} {t`components_chart_indicator_modal_index_2730`}
                {t`components_chart_indicator_modal_index_2731`} {t`components_chart_indicator_modal_index_2732`}
                {t`components_chart_indicator_modal_index_2733`}
              </p>
              <div className="oper">
                <Button
                  onClick={() => {
                    resetRsiOrWr('wr')
                  }}
                  className="button"
                >
                  {t`user.field.reuse_47`}
                </Button>
                <Button onClick={confirmMainAndSub} className="button" type="primary">
                  {t`user.field.reuse_10`}
                </Button>
              </div>
            </div>
          )}
          {currentSelect === 'vol' && (
            <div className="ma-wrap">
              <div className="des-title" style={{ marginTop: 0 }}>{t`components_chart_indicator_modal_index_2704`}</div>
              <p className="des">{t`components_chart_indicator_modal_index_5101337`}</p>
              <div className="oper">
                <Button
                  // onClick={() => {
                  //   resetRsiOrWr('wr')
                  // }}
                  className="button"
                >
                  {t`user.field.reuse_47`}
                </Button>
                <Button onClick={confirmMainAndSub} className="button" type="primary">
                  {t`user.field.reuse_10`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default IndicatorModal
