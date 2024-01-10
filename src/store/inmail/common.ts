enum InmailBizEnum {
  spot = 'spot',
}

enum InmailTypeEnum {
  notice = 'notice',
}

export const InmailDepthSubs = () => {
  return {
    biz: InmailBizEnum.spot,
    type: InmailTypeEnum.notice,
  }
}
