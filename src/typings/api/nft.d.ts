export type NewsDetailReq = { id: any; locale?: string }
export type NewsDetailResp = {
  id: number
  uid: string
  title: string
  description: string
  description_html: string
  image: string
  counter_ids: string[]
  markets: string[]
  publish_at: number
  source: string
  source_url: string
  subject_codes: string
  views_count: string
  body: string
  stocks: any[]
  hot: boolean
  important: boolean
  is_like: boolean
  related_event_category: number
  main_event_title: string
  main_event_uuid: string
  locales: NewsDetailLocale
  related_events: RelatedEvent
}
