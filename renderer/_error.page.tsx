import { ErrorPage } from '@/components/error-page'

export function Page({ is404, errorInfo }: { is404: boolean; errorInfo?: string }) {
  return <ErrorPage is404={is404} errorInfo={errorInfo} />
}
