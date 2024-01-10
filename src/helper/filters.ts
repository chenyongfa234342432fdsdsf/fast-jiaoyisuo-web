export function replaceEmpty(str?: string | number) {
  return str?.toString() ? str : '--'
}
