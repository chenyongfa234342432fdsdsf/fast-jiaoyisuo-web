import styles from './index.module.css'
import SearchCoin from './coin-search'
import HideLess from './hide-less'
/** 币种搜索 & 隐藏零额资产 */
function SearchWrap({
  onSearchChangeFn,
  onHideLessFn,
  className,
  onChangeHideLess,
}: {
  onSearchChangeFn(val): void
  onHideLessFn(val): void
  className?: string
  onChangeHideLess?: (val) => void
}) {
  return (
    <div className={styles.scoped}>
      <div className="mr-8">
        <SearchCoin onSearchChangeFn={onSearchChangeFn} className={className as string} />
      </div>
      <div className="flex items-center">
        <HideLess onHideLessFn={onHideLessFn} onChangeHideLess={onChangeHideLess} />
      </div>
    </div>
  )
}

export { SearchWrap }
