/**
 * 此文件为从后端整理出的异常错误码，可以对照自己业务排查具体错误。
 *
 * @author monkey
 */
enum ErrorCodeEnum {
  DEFAULT = -1, // "网络异常，请稍后重试【{0}】", //
  SUCCESS = 200, // "成功", //
  NOT_LOGGED_IN = 401, // "未登录", //
  UNKNOWN_ERROR = 402, // "{0}", //
  FORBIDDEN = 10403, // "Forbidden", //
  SIGN_ERROR = 502, // "签名错误", //
  ILLEGAL_ARGUMENT = 1503, // "参数错误", //
  REQUEST_ERROR = 1504, // "请求无效", //
  SIGN256_ERROR = 1505, // "签名失败", //
  SIGN_CHECK_ERROR = 1506, // "验签失败", //
  SIGN_FAILED = 603, // "签名失败", //
  PARAM_ERROR = 1000, // "参数绑定异常【{0}】", //
  AUTH_ERROR = 1001, // "验证失败", //
  PASS_ERROR = 1002, // "密码输入错误{0}次，//{1}次错误将限制登录", //
  NO_PERMISSON = 1004, // "无权限，//不能访问", //
  CAPTCHA_ERROR = 1005, // "验证码错误", //
  USER_HAVE_REGISTERED = 1006, // "用户已经注册", //
  EXCESSIVE_ATTEMPTS = 1007, // "密码输错{0}次，//帐号{1}分钟后可登录", //
  UNKNOWN_ACCOUNT = 1008, // "用户不存在", //
  LOCKED_ACCOUNT = 1009, // "帐户已被锁定", //
  OLD_PWD_ERROR = 1010, // "旧密码错误", //
  ROLE_EXIST = 1011, // "角色已存在", //
  MOBILE_EXIST = 1012, // "手机号已经使用", //
  LOGIN_NAME_EXIST = 1013, // "登录名已经使用", //
  SET_ANTI_PHISHING_CODE_ERROR = 1014, // "设置钓鱼码失败", //
  MODIFY_ANTI_PHISHING_CODE_ERROR = 1015, // "修改钓鱼码失败", //
  ANTI_PHISHING_CODE_ALREADY_SET = 1016, // "钓鱼码已经设置", //
  OLD_ANTI_PHISHING_CODE_WRONG = 1017, // "原钓鱼码输入错误", //
  PHONE_NUM_NOT_ALLOW_EMPTY = 1018, // "手机号不能为空", //
  PLEASE_INPUT_CORRECT_VERIFICATION_CODE = 1019, // "请输入正确的图片验证码！", //
  PHONE_NUM_FORMAT_INCORRECT = 1020, // "手机号格式不正确", //
  IMG_CODE_ERROR = 1021, // "行为验证失效", //
  PLEASE_LOGIN = 1022, // "请登录！", //
  EMAIL_VALID_CODE_ERROR = 1023, // "邮箱验证码错误", //
  PHONE_VALID_CODE_ERROR = 1024, // "手机验证码错误", //
  GOOGLE_VALID_CODE_ERROR = 1025, // "谷歌验证码错误", //
  IP_LIMIT = 1026, // "IP 限制", //
  ACTIVITY_NOT_LOGIN = 1027, // "活动未登陆", //
  PLEASE_INPUT_CORRECT_WITHDRAW_ADDRESS = 1028, // "提币地址格式错误", //
  PLEASE_ENTER_THE_CORRECT_ADDRESS_LABEL = 1029, // "地址标签格式错误", //
  WITHDRAW_ADDRESS_ALREADY_EXIST = 1030, // "提币地址已存在", //
  WITHDRAW_ADDRESS_EXCEEDS_LIMIT = 1031, // "提币地址不得超过 50 条", //
  WITHDRAW_COIN_NUM_NO_NULL = 1032, // "到账数量不能为 0", //
  EMAIL_VALID_CANNOT_CLOSE = 1035, // "邮箱验证不可关闭", //

  SMS_LIMIT_ERROR = 1033, // "短信发送过于频繁", //
  EMAIL_LIMIT_ERROR = 1034, // "邮件发送过于频繁", //
  SMS_PROVIDER_NOT_FOUND = 1035, // "短信提供商未找到", //
  SMS_TEMPLATE_NOT_FOUND = 1036, // "短信模版未找到", //
  EMAIL_TEMPLATE_NOT_FOUND = 1037, // "邮件模版未找到", //

  /**
   * 登陆错误相关 start
   */
  USER_NONEXISTENT_ERROR = 2000, // "用户不存在", //

  /**
   * 用户名或密码错误
   */
  USER_NAME_OR_PWD_WRONG_ERROR = 2001, // "用户名或密码错误", //

  USER_TOKEN_EXPIRED_ERROR = 2002, // "token 失效", //

  USER_TOKEN_PARSE_ERROR = 2003, // "token 异常", //

  SMS_VERIFY_ERROR = 2004, // "短信校验失败", //

  EMAIL_VERIFY_ERROR = 2005, // "邮件校验失败", //

  GOOGLE_VERIFY_ERROR = 2006, // "谷歌验证码校验失败", //

  USER_TOKEN_NONEXISTENT_ERROR = 2007, // "token 不存在", //

  USER_OLD_PWD_ERROR = 2008, // "输入的旧密码验证错误", //

  USER_SAME_PWD_ERROR = 2009, // "新旧密码一致", //

  EMAIL_BOUND_ERROR = 2010, // "邮件已绑定", //

  USER_FREEZE_ERROR = 2011, // "您的账户已被冻结，请联系您的商务经理", //

  USER_IP_FREEZE_ERROR = 2012, // "发送信息频繁，//ip 被限制", //

  EMAIL_NOT_BINDING = 2013, // "用户邮箱未绑定", //

  TELEPHONE_NOT_BINDING = 2014, // "手机号未绑定", //
  /**
   * 登陆错误相关 end
   */

  CUSTOMER_REBATE_SETTING_ALREADY_EXIST = 3000, // "该级别客户返佣比例已经设置", //
  USER_ID_NOT_FOUND = 3001, // "代理商找不到 userId", //
  INVOKE_EDAS_ERROR = 3002, // "调用 edas 服务异常", //
  CAPITAL_PWD_ERROR = 3003, // "资金密码错误", //
  EMAIL_ALREADY_USE = 3004, // "邮箱已经使用", //
  TELEPHONE_ALREADY_USE = 3005, // "手机号码已经使用", //
  RSA_ERROR = 3006, // "RSA 错误", //
  LOGIN_NAME_ALREADY_EXIST = 3007, // "用户名已经存在", //
  UPLOAD_FACE_PHOTO_FORMAT_ERROR = 3008, // "上傳文件出錯，只能上傳 *.jpg , // *.gif, //*.png, //*.jpeg", //
  TELEPHONE_NO_BIND = 3010, // "手机号未绑定", //

  /**
   * 参数总览相关错误
   */
  EXIST_MARKET = 3011, // "已经存在该市场", //
  MORE_THAN_UPPER_LIMIT = 3012, // "下限大于上限", //
  MARKET_IS_CLOSING_CAN_NOT_UPDATE = 3013, // "市场处于关闭中状态，不能修改市场", //
  PAYMENT_ALREADY_EXIST = 3014, // "已经存在该支付方式", //
  MARKET_NOT_DELETE_PAYMENT = 3015, // "存在市场没有去除当前支付方式", //
  PAYMENT_NOT_CLOSE = 3016, // "收款方式未关闭", //
  LESS_THAN_MIN_PRECISION = 3017, // "数量精度最小为 0.00010000", //
  PRECISION_CAN_NOT_PROVE = 3018, // "币种精度不能随意调高", //
  /**
   * 商家管理相关错误枚举
   */
  GOOGLE_CHECK_NOT_PASS = 3019, // "谷歌验证码未通过", //
  REJECT_REASON_IS_NULL = 3020, // "驳回原因不能为空", //
  EXIST_ADVERT_IS_NOT_CLOSED = 3021, // "存在进行中的广告", //
  EXIST_ORDER_IS_NOT_CLOSED = 3022, // "存在进行中的订单", //
  GOOGLE_CHECK_NOT_SECRET = 3023, // "谷歌校验码秘钥不存在", //
  SYS_MANAGER_NOT_EXIST = 3024, // "管理员不存在", //
  REDUCE_NUMS_MORE_THAN_THROW = 3025, // "扣除数量大于冻结数量", //
  THROW_NUM_MORE_THAN_LEFT_MONEY = 3026, // "冻结额大于可用余额", //
  MERCHANT_IS_ALREADY_EXIST = 3027, // "商家已经存在", //
  USER_IS_NOT_EXIST = 3028, // "用户不存在", //
  REAL_NAME_NOT_AUTHENTICATION = 3029, // "用户没有实名认证", //
  USER_IN_PERM_BLACKLIST = 3030, // "用户处于永久黑名单", //
  USER_IN_TEMP_BLACKLIST = 3031, // "用户处于临时黑名单", //
  PAYMENT_MUST_HAVE_ONE = 3032, // "支付方式至少有一个", //
  USER_ADVERT_MORE_THAN_TEN = 3033, // "进行中广告数量已达上限，请先下架不需要的广告", //
  EXIST_THIS_COIN_TYPE = 3034, // "已经存在该币种了，不能重复添加", //
  ONLY_APPEAL_STATUS_CAN_ARBITRATE = 3035, // "只有申诉中的状态能仲裁", //
  ADV_MONEY_MORE_THAN_THROW_NUM = 3036, // "广告金额大于冻结额", //
  NICKNAME_REDO = 3037, // "昵称重复，//请重新输入", //
  ORDER_IS_NOT_EXIST = 3041, // "订单不存在", //
  UPDATE_OTC_ORDER_FAILED = 3049, // "更新订单失败", //
  UPDATE_OTC_APPEAL_STATUS_FAILED = 3050, // "更新申诉状态失败", //

  /**
   * 参数总览相关错误
   */
  DUPLICATED_KEY = 3051, // "数据库中有重复的 key", //
  EXIST_KEY_OR_ORDER = 3052, // "添加的参数的 key 或 order 已存在", //
  EXIST_KEY = 3053, // "添加的参数的 key 已存在", //
  EXIST_ORDER_PARAM = 3054, // "添加的参数的 order 已存在", //
  RANGE_ERROR = 3055, // "范围表示有错误", //
  NO_SUCH_KEY = 3056, // "要修改的参数 key 不存在", //
  MISMATCH_LENGTH = 3057, // "要修改的参数格式不正确", //
  LOGO_CAN_NOT_EMPTY = 3058, // "收款方式的 LOGO 不能为空", //
  DEPOSIT_CURRENCY_ERROR = 3059, // "保证金币种错误", //
  USER_OTC_COIN_WALLET_NO_EXIST = 3060, // "C2C 钱包不存在该币种", //
  EXIST_CLOSING_STATUS = 3061, // "市场中存在关闭中状态", //
  EXIST_CLOSING_PAYMENT_STATUS = 3062, // "市场中存在修改中的支付状态", //
  THE_COIN_ADD_NOT_SUPPORT = 3063, // "该币种不支持添加", //
  MERCHANT_IS_NOT_EXIST = 3064, // "不存在该商家", //
  ONLY_MERCHANT_IS_CANCEL_CAN_RELEASE_MONEY = 3065, // "只有取消资格的商家才能解冻保证金", //
  ONLY_MERCHANT_IS_CANCEL_CAN_REDUCE_MONEY = 3066, // "只有取消资格的商家才能扣除保证金", //
  ONLY_MERCHANT_IS_PASS_CAN_CANCEL = 3067, // "只有通过审核后的商家才能取消资格", //
  ONLY_MERCHANT_IS_CHECK_CAN_REJECT = 3068, // "只有通过待审核的商家才能驳回申请", //
  ONLY_MERCHANT_IS_CHECK_CAN_PASS = 3069, // "只有通过待审核的商家才能执行该操作", //
  ONLY_TRANSFER_IS_PASS_OR_FAIL_CAN_LOOK = 3070, // "只有划转记录是审核失败或者审核通过才能查看详情", //
  ONLY_TRANSFER_IS_WAIT_AUDIT_CAN_LOOK = 3071, // "只有待审核状态才能进行审核操作", //
  MARKER_PRECISION_CAN_NOT_PROVE = 3072, // "市场精度不能随意调高", //
  EXIST_OTC_ORDER_AMOUNT_CAN_NOT_NULL = 3072, // "存在订单时，总成交金额不能为空", //
  CURRENCY_CAN_NOT_OPEN_OR_CLOSE_IF_IN_CLOSING = 3073, // "市场处于关闭中状态，不能开启或关闭", //
  THE_COIN_ADD_REFERENCE_PRICE_NOT_SUPPORT = 3074, // "该币种未添加参考价，无法添加", //
  INPUT_IS_INVALID = 3075, // "输入查询条件无效", //
  THE_SAME_STATUS_CAN_NOT_UPDATE = 3076, // "已经在该状态下，不能再修改成相同的状态", //
  SINGLE_ORDER_MUST_LOWER_THAN_ADVERT_AMOUNT = 3077, // "单笔订单下限须小于广告金额上限", //
  MIN_BUY_NUM_MUST_LOWER_THAN_ADVERT_AMOUNT = 3078, // "一键买币金额下限须小于广告金额上限", //
  INCORRECT_PARAM_LENGTH = 3079, // "参数值长度不正确，//请输入 50 以内字符", //
  PARAM_MUST_GT_0 = 3080, // "参数值必须为大于 0 的整数，//位数小于等于 9", //
  PARAM_MUST_IS_NUMBER = 3081, // "请输入正确的用户 UID", //
  PARAM_CAN_NOT_LG_PRECISION = 3082, // "上下限数量小数位不能超过精度", //
  PARAM_MUST_GT_OR_EQ_0 = 3083, // "参数值必须为大于 0 或等于 0 的整数", //
  THE_COIN_ADD_IN_INNOVATE_AREA_NOT_SUPPORT = 3084, // "创新区币种不支持添加", //
  PRICE_RANGE_ERROR = 3085, // "价格偏离上限或下限必须为 1-99 的整数", //
  USER_IN_BLACKLIST = 3086, // "用户处于黑名单中", //
  THIS_FUNCTION_IS_UNSUPPORTED_CURRENTLY = 3087, // "当前功能暂不支持", //
  ILLEGAL_PARAMETER_VALUE = 3088, // "非法的参数值", //
  ONLY_PASS_OR_REJECT = 3089, // "只能通过或者拒绝", //
  TOO_MANY_QUERY_CONDITIONS = 3090, // "查询条件过于复杂", //
  TRANSFER_DETAIL_IS_NOT_EXIST = 3091, // "划转记录不存在", //
  THIS_COIN_IS_NOT_OPEN_OTC = 3092, // "该币种尚未开启 C2C，不支持添加币种", //
  /**
   * 绑定
   *
   */
  AGENT_BING_PARAM_WRONG = 4000, // "代理商绑定参数错误", //
  AGENT_BING_USER_NOT_FOUND = 4001, // "UID 非官网真实有效 UID，请重新输入", //
  AGENT_BING_USER_ALREADY_BOUND = 4002, // "UID 已被其他代理商绑定，请重新输入", //

  /**
   * 平移 4100-4150
   *
   */
  AGENT_USER_TOO_MANY_RELATION_ERROR = 4100, // "该账号关联已关联{0}代理商，请联系管理员处理", //
  AGENT_USER_RELATION_TRANSFER_FLOW_EXIST = 4101, // "该 uid 的平移流程已存在", //
  AGENT_USER_RELATION_TRANSFER_FLOW_NOT_EXIST = 4102, // "平移流程已不存在", //
  AGENT_USER_RELATION_TRANSFER_FLOW_STATUS_ERROR = 4103, // "平移流程审批状态异常", //
  AGENT_USER_RELATION_TRANSFER_FLOW_UID_AGENT_ERROR = 4104, // "暂不能平移代理商用户", //
  AGENT_USER_RELATION_TRANSFER_FLOW_UID_AGENT_TOO_MANY_ERROR = 4105, // "该用户状态已变化，请联系管理员处理", //
  AGENT_USER_RELATION_TRANSFER_FLOW_AGENT_NOT_EXIST = 4106, // "目标代理商输入错误", //
  AGENT_USER_RELATION_TRANSFER_FLOW_AGENT_ALREADY_NOT_EXIST = 4107, // "目标代理商已不存在", //
  AGENT_USER_RELATION_TRANSFER_FLOW_SP_REVIEWER_SAME = 4108, // "发起人和审核人不能相同", //
  AGENT_USER_RELATION_TRANSFER_FLOW_OR_TARGET_SAME = 4109, // "原代理商和目标代理商不能相同", //

  /**
   * 新需求
   */
  GOOGLE_KEY_ALEADY_EXIST = 5001, // "已绑定谷歌验证", //
  MUST_CHOOSE_ONE_VALIDATION = 5002, // "必须选择一种验证方式", //
  CHECK_FAIL_NO_PASS = 5003, // "校验失败", //

  /**
   * 动态查询
   */
  // 不支持的操作
  DYNAMIC_QUERY_RULE_NOT_SUPPORT = 5100, // "[{0}] 不支持 [{1}] 操作", //
  // 传参不合法
  DYNAMIC_QUERY_INVALID_PARAM = 5101, // "[{0}] 的 [{1}] 操作 传参不合法", //
  /**
   * 数据导出
   */
  DATA_EXPORT_SETTINGS_NOT_FOUND = 5200, // "没有找到数据导出相关设置", //
  DATA_TYPE_NOT_FOUND_IN_DATA_EXPORT_SETTINGS = 5201, // "在数据导出设置中没有找到 [{0}] 的数据类型设置", //

  /**
   * 权限管理 - 参数设置
   */
  ADMIN_SYSTEM_SETTING_COMMON = 5220, // "{0}", //

  /**
   * HotCoin 优化
   */
  BANNER_IS_NOT_EXIST = 6000, // "Banner 不存在", //
  CAN_NOT_REPEAT_UPDATE_STATUS = 6001, // "不能更改为相同的状态", //
  TRADE_PAIR_IS_NOT_EXIST = 6002, // "交易对不存在", //
  APP_VERSION_IS_NOT_EXIST = 6003, // "APP 版本不存在", //
  CURRENCY_IS_NOT_EXIST = 6004, // "该法币不存在", //
  CURRENCY_IS_ALREADY_EXIST = 6005, // "该法币已经存在", //
  DIGITAL_PARSE_WRONG = 6006, // "APP 版本号数字解析错误", //
  APP_VER_NUM_IS_ALREADY_EXIST = 6007, // "当前 APP 版本号已经存在", //
  APP_VER_NUM_LONG_IS_ALREADY_EXIST = 6008, // "当前 APP 长版本号已经存在", //
  SORT_COLUMN_IS_UNSUPPORTED = 6009, // "当前字段不允许排序", //
  UPLOAD_FILE_IS_NOT_ALLOW_NULL = 6011, // "上传文件不允许为空", //
  WRONG_UPGRADE_CONTENT_PATTERN = 6012, // "更新内容格式错误", //
  UPGRADE_CONTENT_IS_TO_LONG = 6013, // "更新内容长度过长", //
  UNMATCHED_INPUT_RULE = 6014, // "输入的规则与字段不匹配", //
  SECURITY_APPLY_ITEM_IS_NOT_EXIST = 6015, // "安全项工单不存在", //
  BANNER_DELETE_MUST_CLOSE = 6016, // "关闭状态的 banner 才能删除", //
  ID_IS_WRONG = 6017, // "ID 格式不正确", //
  UID_IS_WRONG = 6018, // "用户 UID 格式不正确", //
  TIME_IS_WRONG = 6019, // "时间格式不正确", //
  CLIENT_IS_WRONG = 6020, // "客户端格式不正确", //
  IP_IS_WRONG = 6021, // "IP 地址格式不正确", //
  STATUS_IS_WRONG = 6022, // "状态格式不正确", //
  RISK_LEVEL_IS_WRONG = 6023, // "风险等级格式不正确", //
  TYPE_CODE_IS_WRONG = 6024, // "安全设置类型格式不正确", //
  LOGIN_LOG_ID_IS_WRONG = 6025, // "登录日志 ID 格式不正确", //
  ITEM_TYPE_IS_WRONG = 6026, // "安全项类型格式不正确", //
  APP_VER_NUM_IS_INCORRECT = 6027, // "当前 APP 版本号不正确", //
  APP_VER_NUM_LONG_IS_INCORRECT = 6028, // "当前 APP 长版本号不正确", //
  CONTAINS_WRONG_QUERY_RULES = 6029, // "包含错误的查询条件", //
  NO_VALIDATION_CODE_FOUND = 6030, // "验证码获取不到，请重试", //
  SAFETY_ITEM_ERROR = 6031, // "安全项错误", //
  ALREADY_AUDITED = 6032, // "已审核，不允许重复审核", //
  TRADE_PAIR_IS_ALREADY_EXIST = 6033, // "交易对已经存在", //
  INITIAL_EXCHANGE_RATE_CAN_NOT_MORE_THAN_FIVE = 6034, // "初始汇率必须是必须是正数，//小数位数最多为 5 位", //
  SAFETY_ITEM_ALREADY_USED = 6035, // "该安全项已被占用", //
  WRONG_SECURITY_TYPE_DESC = 6036, // "安全设置类型输入不正确", //
  INVITEE_UID_IS_WRONG = 6037, // "好友 UID 格式不正确", //
  IOS_VERSION_IS_WRONG = 6038, // "IOS 版本信息有误：不允许版本号、签名码同时相同", //
  VERSION_UPDATE_IS_NOT_ALLOWED = 6039, // "版本信息更新不允许修改以下字段：客户端、版本号、长版本号、签名码", //
  KLNE_TRADE_TYPE_PRIZE_DIGIT_IS_WRONG = 6040, // "价格精度不符合要求，正确精度应为{0}", //
  KLNE_REPAIR_OCCUR_EROOR = 6041, // "编辑 K 线数据失败，请重新尝试", //
  DEPWD_WARN_PLATFORM_EMPTY = 6042, // "请设置至少一个充提币监控平台或关闭充提币监控规则", //

  /**
   * HotCoin 优化 2
   */
  WS_RESP_TIME_WRONG = 6100, // "ws 响应速度格式错误", //
  API_RESP_TIME_WRONG = 6101, // "Api 响应速度格式错误", //
  WHITE_LIST_IS_WRONG = 6102, // "白名单格式错误", //
  RATE_IS_WRONG = 6103, // "费率格式错误", //
  RIGHT_TYPE_IS_WRONG = 6104, // "权限格式错误", //
  MODIFY_ITEM_IS_WRONG = 6105, // "修改项格式错误", //
  SIGN_FLAG_IS_WRONG = 6106, // "是否需要签名验证格式错误", //
  INVITE_TYPE_IS_WRONG = 6107, // "好友类型格式错误", //
  ISSUE_TYPE_IS_WRONG = 6108, // "发放类型格式错误", //
  ISSUE_USER_IS_NOT_EXIST = 6109, // "发放人不存在", //
  MODIFY_USER_IS_NOT_EXIST = 6110, // "修改人不存在", //
  NO_COMMISSION_DATA_SELECTED = 6111, // "未选中发放佣金数据", //
  ISSUE_COMMISSION_DATA_ERROR = 6112, // "发放佣金数据错误", //
  CONTAINS_STATUS_SUCCESS_DATA = 6113, // "包含状态是成功的数据", //
  TRADE_AMT_IS_WRONG = 6114, // "交易数量格式错误", //
  REBATE_AMT_IS_WRONG = 6115, // "返佣数量格式错误", //
  COIN_NAME_IS_NOT_EXIST = 6116, // "币种名称不存在", //
  PERMISSION_RULE_REPEATED = 6117, // "重复添加权限条件", //
  FRIEND_COUNT_IS_WRONG = 6118, // "好友总数格式错误", //
  DIRECT_FRIEND_COUNT_IS_WRONG = 6119, // "直接好友数格式错误", //
  INDIRECT_FRIEND_COUNT_IS_WRONG = 6120, // "间接好友数格式错误", //
  TOTAL_REBATE_IS_WRONG = 6121, // "总折合返佣格式错误", //
  DIRECT_REBATE_IS_WRONG = 6122, // "直接返佣折合格式错误", //
  INDIRECT_REBATE_IS_WRONG = 6123, // "间接返佣折合格式错误", //
  INVITER_INFO_IS_WRONG = 6124, // "邀请人记录异常", //
  STATUS_IS_NOT_MODIFIED = 6125, // "未更改状态", //
  TOTAL_TRADE_AMT_IS_WRONG = 6126, // "累计交易折合格式错误", //
  TOTAL_REBATE_AMT_IS_WRONG = 6127, // "累计返佣折合格式错误", //
  RELATIONSHIP_TRANSLATION_NOT_EXIST = 6128, // "关系平移记录不存在", //
  STATUS_IS_ALREADY_AUDITED = 6129, // "该记录状态不是待审核", //
  ILLEGAL_AIM_INVITER = 6130, // "目标用户不合法", //
  STATUS_IS_NOT_AUDITED = 6131, // "待审核状态记录不允许查看详情", //
  PRE_INVITER_UID_WRONG = 6132, // "原邀请人有误", //
  COMMISSION_DATA_CONTAINS_NOT_EXIST_DATA = 6133, // "佣金记录包含不存在的记录", //
  AIM_PRE_INVITER_REPEATED = 6134, // "目标邀请人和原邀请人不能一样", //
  COMMISSION_GRANT_FAILURE = 6135, // "佣金发放失败！", //
  RELATION_STATUS_IS_WRONG = 6136, // "关系状态格式错误！", //
  DATA_ERROR_TRANSACTION_DISALLOWED = 6137, // "数据异常，不允许关系平移！", //
  RELATIONSHIP_IS_EXIST = 6138, // "邀请关系已存在！", //
  RELATIONSHIP_IS_NOT_EXIST = 6139, // "邀请关系不存在！", //

  API_KEY_NOT_EXIST = 7000, // "API key 不存在", //
  API_URL_NOT_EXIST = 7002, // "Api url 不存在", //
  API_URL_IS_EXIST = 7003, // "Api url 已经存在", //
  API_URL_NOT_EXIST_OR_MORE_THAN_ONE = 7004, // "Api url 不存在或 url 超过 1 条记录", //
  IDENTITY_AUTH_RECORD_NOT_EXIST = 7005, // "审核记录不存在", //
  WAIT_STATUS_CAN_NOT_CANCEL = 7006, // "待审核状态用户不能取消", //
  YOU_DONT_UPDATE_ANY_DATA = 7007, // "没有修改任何数据", //
  THIS_NOTIONAL_IS_NOT_EXIST = 7008, // "不存在该国籍", //
  NON_WHITE_LIST_FREQUENCY_MORE_THAN_WHITE_LIST_FREQUENCY = 7009, // "非白名单限频不能大于白名单限频", //
  NON_WHITE_LIST_FREQUENCY_IS_WRONG = 7010, // "非白名单限频错误", //
  WHITE_LIST_FREQUENCY_IS_WRONG = 7011, // "白名单限频错误", //

  COIN_IS_NOT_EXIST = 8000, // "币种不存在", //
  SELL_COIN_IS_NOT_EXIST = 8001, // "卖方币种不存在", //
  EXIST_SAME_TRADE_PAIR = 8002, // "已存在相同交易对，请先禁用该交易对再新增，或新增禁用的交易对", //
  ADD_FAIL_SYSTEM_TIME_MORE_THAN_LIST_TIME = 8003, // "新增失败！上市时间不得小于当前时间", //
  MARK_FREE_USER_ID_IS_WRONG = 8004, // "交易免手续费用户 id 填写有误", //
  CREATE_WALLET_ADDRESS_PASSWORD_IS_WRONG = 8004, // "生成钱包地址密码错误", //
  WALLET_DATA_IS_WRONG_PLEASE_RESTART = 8005, // "钱包数据缺少，请检查配置信息！", //
  WALLET_CONNECT_FAILED_PLEASE_RESTART = 8006, // "钱包连接失败，请检查配置信息！", //
  GENERATE_ADDRESS_EXCEPTION = 8007, // "生成地址异常", //
  TRADE_AREA_IS_NOT_EXIST = 8008, // "交易区不存在", //
  TELEPHONE_OR_EMAIL_MUST_HAVE_ONE = 8009, // "手机和邮箱至少保留一个", //
  THREE_SECURITY_MUST_HAVE_ONE = 8010, // "三项验证至少保留一项", //
  MAIL_CANNOT_BE_EMPTY_AFTER_VALIDATE_EMAIL = 8011, // "开启邮箱验证后邮箱不能为空", //
  PHONE_CANNOT_BE_EMPTY_AFTER_VALIDATE_PHONE = 8012, // "开启手机验证后手机号不能为空", //
  NO_BAND_GOOGLE_CANNOT_OPEN_GOOGLE_VALIDATE = 8013, // "客户未绑定谷歌，不能开启谷歌验证", //
  AREA_CODE_CANNOT_EMPTY = 8014, // "区号不能为空", //
  CANNOT_ALLOWED_ONLINE_INNOVATION_AREA = 8015, // "非上线创新区的币不允许上线创新区，请到币种管理更改币种设置", //
  CANNOT_ALLOWED_INNOVATION_AREA_ONLINE_OTHER = 8016, // "创新区币种不允许上其他交易区，请到币种管理更改币种设置", //

  COIN_INFO_ALREADY_EXIT_THIS_LANG = 8100, // "该语言下当前币种的信息已经存在了", //
  COIN_INFO_IS_NOT_EXIST = 8101, // "币种信息不存在", //

  ENTRUST_INFO_IS_NOT_EXIST = 8102, // "委单信息不存", //
  ENTRUST_ERROR_INFO_IS_NOT_EXIST = 8103, // "委单错误，委单数据不存在或委单状态不是未成交、部分成交", //

  CURRENT_OPERATOR_IS_ERROR = 500, // "参数错误或不支持该操作", //

  CURRENT_USER_ID_IS_EXIST = 8104, // "此 UID 已占用，请重新输入", //
  FORMAT_ERROR_PLEASE_REENTER = 8105, // "费率范围错误，请重新输入", //

  CANCEL_ENTRUST_ERROR = 8106, // "委单撤销失败", //

  TIMES_MUST_GT_ZERO = 8107, // "提现次数必须是大于 0 或等于 0 的整数", //
  RESCAN_BLOCK_ERROR = 8108, // "重扫区块异常", //

  ORDER_LOCK_FAILED = 8109, // "订单锁定失败，//请稍后再试!", //
  THE_ORDER_STATUS_HAS_EXPIRED = 8110, // "该订单状态已结束!", //
  FAILED_TO_UPDATE_ORDER = 8111, // "更新订单失败!", //
  FAILED_TO_UPDATE_THE_VIRTUAL_WALLET = 8112, // "更新虚拟钱包失败!", //
  PLATFORM_INTERCHANGE_RECORD_ERROR = 8113, // "平台互转记录写入出错!", //
  PLATFORM_TRANSFER_FAILURE_THE_USER_MAY_NOT_EXIST = 8114, // "平台互转钱包转入失败，//转入用户可能不存在!", //
  ORDER_LOCKING_DUPLICATE_OPERATIONS_ARE_NOT_ALLOWED = 8115, // "订单锁定中，不允许重复操作!", //
  THE_RECHARGE_HAS_BEEN_ALLOCATED = 8116, // "该充值已被分配!", //

  // 提币
  WITHDRAW_PARAM_ERROR = 9001, // "提币地址，订单 id，签名，时间戳，不能为空", //
  WITHDRAW_WRONG_GOOGLE_CODE = 9002, // "谷歌验证码错误", //
  WITHDRAW_UNKNOWN_MISTAKE = 9003, // "提币未知错误，//请联系技术人员处理", //
  WITHDRAW_INSUFFICIENT_BALANCE = 9004, // "提币地址余额不足", //
  WITHDRAW_PLATFORM_TRANSFER_MEMO_MUST_BE_NUMBER = 9005, // "平台互转地址标签必须为数字", //
  WITHDRAW_ADDRESS_MUST_ADDIN_PLATFORM = 1033, // "提币地址必须是在平台添加的地址", //

  PHONE_LIMIT_BEYOND_ERROR = 10004, // "手机验证码错误多次，请 2 小时后再试！", //
  PHONE_LIMIT_COUNT_ERROR = 10005, // "手机验证码错误！您还有{0}次机会！", //
  LOGIN_NAME_ERROR = 10006, // "登录名错误", //
  TRADE_LIMIT_BEYOND_ERROR = 10008, // "交易密码错误多次，请 2 小时后再试！", //
  TRADE_LIMIT_COUNT_ERROR = 10009, // "交易密码错误！您还有%d次机会！", //
  EMAIL_LIMIT_BEYOND_ERROR = 10014, // "邮箱验证码错误多次，请 2 小时后再试！", //
  EMAIL_LIMIT_COUNT_ERROR = 10015, // "邮箱验证码错误！您还有{0}次机会！", //
  PLEASE_INPUT_CORRECT_EMAIL_ADDRESS = 10016, // "请填写真实邮箱地址！", //
  SEND_EMAIL_MAX_1_IN_TIME = 10017, // "{0}分钟内只能发送一次邮件！", //
  EMAIL_ALREADY_SEND = 10018, // "邮件已经发送", //
  PHONE_NUM_ALREADY_BIND = 10019, // "手机号码已绑定！", //
  EMAIL_ALREADY_BIND = 10020, // "邮箱已绑定！", //
  EMAIL_ADDRESS_CAN_NOT_EMPTY = 10021, // "邮箱地址不能为空", //
  GOOGLE_ALREADY_BIND = 10022, // "谷歌已绑定", //
  NO_BIND_MOBILE_OR_GOOGLE_TO_MODIFY_PWD = 10023, // "您没有绑定手机或谷歌验证暂不允许修改密码", //
  TRADE_PWD_NOT_ALLOW_SAME_WITH_LOGIN_PWD = 10024, // "交易密码不允许与登录密码一致！", //
  ANTI_PHISHING_CODE_FORMAT_ERROR = 10025, // "钓鱼码格式错误", //
  SEND_SMS_FREQUENTLY = 10026, // "发送短信过于频繁", //
  REGISTER_TIMEOUT = 10027, // "注册超时", //
  AREA_CODE_EMPTY = 10028, // "区号为空", //
  SCAN_LOGIN_QR_CODE_EXPIRE = 10029, // "扫码登录二维码已经过期，请重新获取二维码", //
  WAITING_FOR_SCAN_LOGIN = 10030, // "等待用户扫码登录", //
  USER_SCORE_NO_EXIST = 10031, // "用户积分等级不存在", //
  SUSPEND_LOGIN_DURING_SYSTEM_UPGRADE = 10032, // "系统升级中，暂停登录", //
  NOT_NEW_COIN = 10033, // "不是新币", //
  TOTAL_NOT_ENOUGH = 10034, // "钱包余额不够", //
  FROZEN_FAILED = 10035, // "钱包冻结失败", //
  ADD_TOTAL_FAILED = 10036, // "钱包增加可用失败", //
  SUB_FROZEN_FAILED = 10037, // "钱包扣除冻结失败", //
  TRADE_PASSWORD_ERROR = 10038, // "交易密码错误", //
  UNFROZEN_FAILED = 10039, // "钱包解冻失败", //
  SEND_RED_ENVELOPE_DISABLED = 10040, // "您已触发资产平衡限制，暂不能使用红包功能，请联系客服处理！", //
  PHONE_NUM_ALREADY_USED = 10041, // "该手机号码已被占用，请确认后再试", //
  EMAIL_ALREADY_USED = 10042, // "该邮箱已被占用，请确认后再试", //
  GOOGLE_ALREADY_USED = 10043, // "该谷歌秘钥已失效，请确认后再试", //
  DELETE_API_KEY_FAILED = 10150, // "删除 API key 失败", //
  UPDATE_API_KEY_FAILED = 10151, // "更新 API key 失败", //
  UNKNOWN_WALLET = 10152, // "钱包不存在", //
  UPDATE_API_KEY_STATUS_FAILED = 10160, // "修改 API Key 状态失败", //
  API_NO_OPEN = 10170, // "API 未开放", //
  API_KEY_NO_PERM_TO_URL = 10171, // "API KEY 没有权限访问当前接口", //
  SIGNATURE_METHOD_ERROR = 10172, // "签名方法不正确", //
  API_KEY_INVALID = 10173, // "无效 API KEY", //
  VERIFY_SIGNATURE_FAILED = 10174, // "验证签名失败", //
  CREATE_API_KEY_MAX_10 = 10175, // "每个用户最多创建 10 组 API Key", //
  CREATE_API_KEY_REMARK_NOT_BLANK = 10176, // "备注不能为空", //
  IP_MAX_10 = 10177, // "最多绑定 10 个 IP, //以半角逗号分隔", //
  SYMBOL_ERROR = 10192, // "币对错误", //
  DATE_INTERVAL_GREATER_THAN_2 = 10193, // "日期间隔大于两天", //
  DATE_FORMAT_ERROR = 10194, // "日期格式错误", //
  DATE_THAN_START_ERROR = 10195, // "日期开始时间不能大于结束时间", //
  CANCEL_UPDATE_USER_COIN_WALLET_ERROR = 10199, // "撤销修改钱包异常【{0}】", //
  COIN_NOT_FOUND = 10200, // "币种不存在", //
  COIN_STATUS_ABNORMAL = 10201, // "币种状态异常", //
  COIN_WALLET_NOT_FOUND = 10202, // "币币钱包不存在", //
  COIN_WALLET_INSUFFICIENT_BALANCE = 10203, // "币币钱包余额不足", //
  IEO_WALLET_NOT_FOUND = 10204, // "认购钱包不存在", //
  IEO_WALLET_INSUFFICIENT_BALANCE = 10205, // "认购钱包余额不足", //
  IEO_WALLET_INSUFFICIENT_FROZEN = 10206, // "认购钱包冻结资金不足", //
  DTIDEMPOTENT_NOT_SUPPORT = 10219, // "@DtIdempotent 不支持", //
  HAS_REAL_PERSON_AUTH = 10220, // "已经实名认证", //
  USER_CAN_REAL_PERSON_AUTH_3_TIME_1_DAY = 10221, // "每天只能实名认证三次！", //

  MORE_THAN_LIMIT_AMOUNT_24HOURS_TO_STANDARD = 10222, // "个人标准认证用户 24 小时 C2C 交易量超过限额！", //
  MORE_THAN_LIMIT_AMOUNT_24HOURS_TO_ADVANCED = 10223, // "个人高级认证用户 24 小时 C2C 交易量超过限额！", //
  MORE_THAN_LIMIT_AMOUNT_24HOURS_TO_ENTERPRISE = 10224, // "企业认证用户 24 小时 C2C 交易量超过限额！", //
  MORE_THAN_LIMIT_AMOUNT_24HOURS_TO_UNAUTHORIZED = 10225, // "未认证用户 24 小时 C2C 交易量超过限额！", //
  MORE_THAN_LIMIT_AMOUNT_24HOURS = 10226, // "您提交的订单已超出当日最大交易金额，请完成个人认证后提升额度。", //

  WALLET_ALREADY_EXISTS = 10300, // "钱包已存在", //
  FROZEN_NOT_ENOUGH = 10311, // "冻结资金不足", //
  BORROW_NOT_ENOUGH = 10312, // "理财资金不足", //
  DEPOSIT_FROZEN_NOT_ENOUGH = 10313, // "创新区锁仓资金不足", //
  DEPOSIT_FROZEN_TOTAL_NOT_ENOUGH = 10314, // "创新区锁仓统计资金不足", //
  WITHDRAW_WALLET_ADDRESS_NOT_FOUND = 10315, // "提币地址不存在", //
  ANTI_PHISHING_CODE_FORMAT_ERROR_TIP = 10316, // "4 到 20 位以内的英文、数字或下划线，英文包含大小写", //
  ICO_NOT_ENOUGH = 10317, // "ico 资金不足", //

  TRANSFER_PARAM_ERROR = 10500, // "划转参数错误", //
  TRANSFER_INSERT_ERROR = 10501, // "划转记录插入失败", //
  TRANSFER_UPDATE_ERROR = 10502, // "更新划转钱包失败", //
  TRANSFER_SELECT_ERROR = 10503, // "划转查询钱包失败", //
  TRANSFER_INSERT_BALANCE_LOG_ERROR = 10504, // "划转插入 balanceLog 失败", //
  AGENT_CONTRACT_COMMISSION_INSERT_BALANCE_LOG_ERROR = 10510, // "代理商佣金插入 balanceLog 失败", //

  UNVERIFIED = 10601, // "未认证", //
  CERTIFICATION_FAILED = 10602, // "实名认证未通过", //
  ID_CARD_NUMBER_ALREADY_USE = 10603, // "身份证号码已被实名验证，不能重复验证，请注意您的信息安全！", //

  IEO_ITEM_ACCOUNT_WALLET_NOT_ENOUGH = 10604, // "项目资金池不足，请联系客服处理", //

  OTC_COIN_NO_FOUND = 20000, // "C2C 没有该法币", //
  OTC_CURRENCY_NO_FOUND = 20001, // "C2C 没有该市场", //
  NO_PERM_TO_POST_ADS = 20002, // "无发布广告权限", //
  USER_BANK_INFO_ERROR = 20003, // "支付方式有误", //
  USER_BANK_NOT_ALLOWED_ADD = 20004, // "该支付方式不允许添加", //
  USER_BANK_INFO_LIMIT_REACHED = 20005, // "该支付方式数量已达上限，若要添加请先删除原有支付方式。", //
  USER_BANK_INFO_NOT_FOUND = 20006, // "支付方式不存在", //
  REPEAT_USER_BANK_INFO = 20007, // "该账号已存在", //
  EXIST_ADV = 20008, // "该支付方式有进行中的订单或者广告，不允许修改或者关闭，请先进行处理。", //
  OPEN_BANK_INFO_MAX_COUNT = 20009, // "最多只能开启{0}个支付方式", //
  REPEAT_APPLY = 20010, // "您已提交过申请，请勿重复提交", //
  NOT_APPLY = 20011, // "您未提交过申请", //
  NO_OPEN_BANK_INFO = 20012, // "您未开启该市场相应付款方式，请开启付款方式后再发广告", //
  BANK_INFO_NO_SUPPORT = 20013, // "您选择的支付方式未开启或该交易市场不支持，请重新选择", //
  CURRENCY_NO_OPEN = 20014, // "市场未开放", //
  EXIST_ORDER = 20015, // "该支付方式有进行中的订单或者广告，不允许修改或者关闭，请先进行处理。", //
  CERTIFICATION_FIRST = 20020, // "请先完成实名认证！", //
  TRADE_PASSWORD_FIRST = 20021, // "请先设置资金密码。", //
  MERCHANT_AUDIT_FAIL_TO_POST_ADS = 20022, // "您未通过商户审核，无法发布广告", //
  TRADE_PASSWORD_OVER_LIMIT = 20030, // "交易密码错误多次，请 2 小时后再试！", //
  PROHIBIT_USE_FUNCTION = 20031, // "您已触发平台风控，暂不能使用该功能，请联系客服处理！", //
  PAYMENT_NO_FOUND = 20032, // "支付方式不存在", //
  REAL_NAME_IS_INCONSISTENT = 20033, // "与当前实名认证信息不符，请重新添加", //

  UNKNOWN_MERCHANT = 20040, // "商户不存在", //
  NO_DEPOSIT_UNFREEZE = 20041, // "您没有保证金可用解冻", //
  HAVING_ACTIVITY_ADV = 20042, // "目前有进行中的订单或者广告，不允许解冻保证金，请先进行处理", //
  NO_PERMISSION_UNFREEZE = 20043, // "您无权解冻保证金，请联系客服", //

  ADV_PRICE_OVER_LIMIT = 20050, // "广告价格超过限制", //
  ADV_PRICE_LOWER_LIMIT = 20051, // "广告价格低于限制", //
  ADV_VOLUME_OVER_LIMIT = 20052, // "广告数量超过限制", //
  ADV_VOLUME_LOWER_LIMIT = 20053, // "广告数量低于限制", //
  SINGLE_ORDER_AMOUNT_OVER_LIMIT = 20054, // "单笔订单金额超过限制", //
  SINGLE_ORDER_AMOUNT_LOWER_LIMIT = 20055, // "单笔订单金额低于限制", //
  PROCESS_ADV_OVER_LIMIT = 20056, // "进行中的广告已达上限，请先下架不需要的广告", //
  ADV_REMARK_OVER_LIMIT = 20057, // "广告备注过长，请保证 50 字以内（包括空格，标点符号）", //
  ADV_AUTOREPLY_OVER_LIMIT = 20058, // "回复内容过长，请保证 50 字以内（包括空格，标点符号）", //

  CAN_NOT_FIND_ADV = 20060, // "找不到广告", //
  CLOSE_ADV_FIRST = 20061, // "请先关闭广告，再进行修改或下架操作", //
  ADV_ALREADY_REMOVED = 20062, // "广告已经下架，无法操作", //
  ADV_HAVING_NO_FNISH_ORDER = 20063, // "您的广告有未完成的订单，请订单结束后再进行更改", //
  ADV_BANK_INFO_IS_CLOSE = 20064, // "请开启相应的支付方式后再开启广告", //
  AMOUNT_MIN_OVER_MAX = 20065, // "最小金额大于最大金额", //
  MIN_OVER_TOTAL_AMOUNT = 20066, // "最小金额大于总金额", //
  MAX_PAY_TIME_ERROR = 20067, // "付款期限超过限制", //
  ADV_USER_OUTDATE_PAYMENT = 20068, // "当前市场已不再支持您使用的支付方式，请修改广告的支付方式", //
  JPUSH_SEND_ERROR = 20069, // "push exception", //

  OTC_ORDER_NO_INVALID = 20100, // "订单状态已发生变化", //
  UPDATE_USER_OTC_COIN_WALLET_FAILED = 20101, // "更新 C2C 钱包失败", //
  ADV_VISIABLE_VOLUME_NOT_ENOUGH = 20102, // "广告可用币种数量不足", //
  AMOUNT_OR_QUANTITY_WRONG = 20103, // "数量或金额有误", //
  OTC_ORDER_AMOUNT_NOT_MEET_LIMIT = 20104, // "C2C 订单金额不满足限额", //
  OTC_CREATE_ORDER_PAYMENT_NO_MATCH_TIP = 20105, // "买家仅支持通过{0}向您付款，您需要前往收款方式管理添加并开启相应收款方式", //
  OTC_ADVERT_FROZEN_NOT_ENOUGH = 20106, // "广告的币种冻结数量不足", //
  USER_IN_OTC_BLACKLIST = 20107, // "账户已被加入到黑名单中，限制交易，请点击页面右下角帮助，联系客服。", //
  BEFORE_CREATE_OTC_ORDER_NEED_REAL_NAME = 20108, // "进行 C2C 交易前请先进行实名认证", //
  ADVERTISER_IN_BLACKLIST = 20109, // "对方账户 ={0}已被限制交易，请更换广告方下单。", //
  USER_HAVE_OTC_ORDER_IN_PROCESS = 20110, // "已经有进行中的订单，请前往处理", //
  OTC_ADVERT_VOLUMN_NOT_ENOUGH = 20111, // "广告总数量不足", //
  OTC_ADVERT_VISIBLE_VOLUMN_NOT_ENOUGH = 20112, // "广告可用数量不足", //
  OTC_ADVERT_TRADING_VOLUME_NOT_ENOUGH = 20113, // "广告进行中数量不足", //
  UPDATE_OTC_ADVERT_FAILED = 20114, // "更新广告失败", //
  UPDATE_OTC_USER_EXT_FAILED = 20115, // "更新 C2C 用户信息失败", //
  UNABLE_TO_TRADE_WITH_YOURSELF = 20116, // "无法与自己交易", //
  OTC_REORDER_TIP = 20117, // "行情价格变动，请重新下单", //
  THE_COIN_TRANSFER_NOT_SUPPORT = 20118, // "该币种不支持划转", //
  USER_NOT_FOUND = 20119, // "用户未找到", //
  OTC_PARAM_NOT_SET = 20120, // "C2C param is not set:{0}", //
  OTC_ORDER_NOT_IN_APPEAL = 20121, // "C2C 订单状态不在申诉中", //
  COIN_HAS_NOT_BEEN_ADDED = 20122, // "币种尚未添加", //
  MIN_SINGLE_LIMIT_GREATER_THAN_AD_AMOUNT = 20123, // "最小单笔限额大于广告金额", //
  THE_ACOUNT_NOT_REGISTER = 20124, // "该帐号尚未注册", //
  THE_SECURITY_ITEM_APPLY_ALREADY_POST = 20125, // "已提交变更工单，请耐心等待", //
  SYSTEM_UPGRADE_PAUSE_OTC = 20130, // "系统升级，暂停 C2C 交易", //
  LOGIN_TYPE_ERROR = 20133, // "登录类型错误", //
  PLEASE_INPUT_VERIFICATION_CODE = 20134, // "请输入验证码", //
  LOGIN_NAME_OR_PASSWORD_CANNOT_BE_EMPTY = 20135, // "用户名或密码不能为空！", //
  FAILURE_SECOND_VERIFY = 20136, // "二次验证失败", //
  PLEASE_ENTER_LESS_THAN_25_CHARACTERS = 20137, // "请输入 25 个以内字符", //
  APP_VERSION_ERROR = 20140, // "APP 版本号不正确", //
  UPGRADE_CONTENT_IS_OVERSIZE = 20141, // "更新内容过多", //
  IP_ADDR_ERROR = 20150, // "IP 地址不正确", //
  TRANSFER_APPLY_SUCCESS = 20351, // "申请划转成功", //
  CURRENCY_NO_FOUND = 20500, // "未找到法币相关配置【{0}】", //
  SYSTEM_TRADE_TYPE_NO_FOUND = 20501, // "未找到币对【{0}】", //
  TRADE_TYPE_NO_LATEST_PRICE = 20502, // "币对没有最新成交价【{0}】", //
  PLEASE_UPLOAD_PHOTO = 20503, // "请上传照片", //
  SEND_VALID_CODE_FREQUENTLY = 20504, // "发送验证码过于频繁，请稍后重试", //
  ACCOUNT_ERROR = 20505, // "账号不正确，请重新输入", //
  REGISTER_NO_OPEN = 20506, // "会员注册暂未开放！", //
  REFERENCE_NOT_EXIST = 20507, // "推荐人 ID 不存在！", //
  EMAIL_HAS_ALREADY_REGISTER = 20508, // "该邮箱已经注册", //
  TELEPHONE_HAS_ALREADY_REGISTER = 20509, // "该手机号已经注册", //
  CANNOT_CONNECT_WITH_CONTRACT = 20510, // "暂无法对接合约系统，请稍后重试！", //
  TWO_VERIFICATIONS_MUST_BE_TURNED_ON = 20511, // "为了保证您的资金安全，请至少开启两种安全验证方式！", //
  WITHDRAW_MUST_BIND_EMAIL = 20512, // "提币前请先绑定邮箱，绑定后可通过手机号或邮箱登录此账号", //
  WITHDRAW_MUST_OPEN_EMAIL_INVALID = 20513, // "提币前请先开启邮箱验证", //
  SERVER_ERROR = 20701, // "服务器异常！", //
  ILLEGAL_REQUEST = 20702, // "非法请求", //
  PASSWORD_DOES_NOT_ENTER_TWICE = 20703, // "两次密码输入不一致！", //
  WRONG_PASSWORD_FORMAT = 20704, // "密码格式错误，必须以字母开头且大于 6 位！", //
  FAILED_TO_PASS_VALIDATION = 20705, // "未通过验证", //
  CERTIFICATION_NUMBER_OCCUPIED = 20706, // "证件号码已被实名验证，不能重复验证，请注意您的信息安全！", //
  REPEAT_SUBMIT_ERROR = 20707, // "审核已通过，请不要重复提交！", //
  WAIT_APPROVAL = 20708, // "实名正在审核中，请等待审核通过！", //
  REGISTRATION_NOT_YET_OPEN = 20709, // "会员注册暂未开放！", //
  REFERENCES_ID_MISSING = 20710, // "推荐人 ID 不存在！", //
  AT_LEAST_ONE_SECURITY_VALIDATION = 20711, // "安全验证至少保留一项", //
  PHONE_VALIDATION_UNBOUND = 20712, // "操作失败，您的手机未绑定。", //
  GOOGLE_VALIDATION_UNBOUND = 20713, // "操作失败，您的谷歌未绑定。", //
  MAILBOX_VALIDATION_UNBOUND = 20714, // "操作失败，您的邮箱未绑定。", //
  PHONE_VALIDATION_CODE_MISSING = 20715, // "请输入手机验证码！", //
  LOGIN_USING_GOOGLE_VALIDATION = 20716, // "使用谷歌验证登录", //
  LOGIN_USING_TELEPHONE_VALIDATION = 20717, // "使用手机验证登录", //
  LOGIN_USING_EMAIL_VALIDATION = 20718, // "使用邮件验证登录", //
  FROZEN_ACCOUNT_CONTACT_CUSTOMER_SERVICE_STAFF = 20719, // "账户出现安全隐患被冻结，请尽快联系客服！", //
  ID_FORMAT_WRONG_PLEASE_RE_ENTER = 20720, // "身份证格式有误，请重新输入", //
  REAL_PERSON_AUTH_CAN_NOT_POST_MULTIPLE_TIMES = 20721, // "实名不能多次提交申请", //
  REAL_PERSON_AUTH_TOKEN_INVALID = 20722, // "实名认证 token 失效", //
  LOGIN_LIMIT = 20723, // "账户登录限制", //
  API_REQUEST_FREQUENT = 20724, // "API 请求过于频繁", //
  BEFORE_CREATE_OTC_ORDER_NEED_PASS_RISK_CONTROL = 20725, // "由于风控原因，您暂时不可使用 C2C 卖出功能", //
  IDENTITY_COMPANY_CAN_NOT_POST_MULTIPLE_TIMES = 20726, // "企业认证不能多次提交申请", //

  ALREADY_UPDATE_NICK_NAME = 20800, // "您已修改过昵称了", //
  NICK_NAME_IS_EXIST = 20801, // "昵称已被使用，请更换昵称", //
  ORIGIN_PWD_IS_ERROR = 20802, // "原始密码错误！", //
  LOGIN_PWD_IS_NOT_ALLOWED_EQUAL_TRADE_PWD = 20803, // "登录密码不允许与交易密码一致！", //
  WRONG_PASSWORD_FORMAT_PLEASE_EDIT_IN_RIGHT_PWD = 20804, // "密码是 8-20 位字符，不能为纯数字", //
  TRADE_PWD_IS_EXIST = 20805, // "交易密码已设置过！", //
  ACCOUNT_OR_PASSWORD_WRONG = 20806, // "用户名或密码错误，您还有{0}次机会", //
  NICK_NAME_IS_EXIST_PLEASE_SET_AGAIN = 20807, // "昵称重复，请重新设置", //
  LOGIN_PASSWORD_AVAILABLE = 20808, // "因修改登录密码，为保证资金安全 24H 禁止提币和 C2C 交易", //
  TRADE_PASSWORD_AVAILABLE = 20809, // "因修改资金密码，为保证资金安全 24H 禁止提币和 C2C 交易", //
  RESET_LOGIN_PASSWORD_AVAILABLE = 20810, // "因重置登录密码，为保证资金安全 24H 禁止提币和 C2C 交易", //
  VALIDATE_USER_IF_UPDATE_PHONE = 20811, // "因修改手机号，为保证资金安全 24H 禁止提币和 C2C 交易", //
  VALIDATE_USER_IF_UPDATE_EMAIL = 20812, // "因修改邮箱，为保证资金安全 24H 禁止提币和 C2C 交易", //
  VALIDATE_USER_IF_UPDATE_GOOGLE = 20813, // "因重新绑定谷歌验证码，为保证资金安全 24H 禁止提币和 C2C 交易", //
  VALIDATE_USER_IF_OTC_RULE = 20814, // "因触发 C2C 风控规则限制，24 小时内限制提出资产", //

  THIS_EMAIL_ALREADY_SEND = 30000, // "当前邮箱已发送", //
  THIS_USER_ALREADY_INVITED = 30001, // "该用户已经注册，不能被邀请", //
  THE_SYSTEM_INFORMS = 30002, // "系统通知", //
  THE_SYSTEM_INFORMS2 = 30003, // "您提交的实名认证请求已通过，现在可以进行交易", //
  THE_SYSTEM_INFORMS3 = 30004, // "您提交的实名认证请求未通过，请重新认证", //

  /**
   * 币币优化（hjf）30100 ~ 30200
   */
  PLEASE_ENTER_CORRECT_TRANSACTION_AMOUNT = 30100, // "请输入正确的交易数量", //
  PLEASE_SET_TRADE_PWD_FIRST = 30101, // "请先设置交易密码", //
  PLEASE_ENTER_TRADE_PWD = 30102, // "请输入交易密码", //
  FAILED_TO_OBTAIN_TRADE_INFO = 30103, // "获取交易信息失败", //
  VERIFICATION_FAILED = 30104, // "校验失败【{0}】", //
  PRE_SALE_IS_NOT_OPEN_TO_SELL = 30105, // "预售阶段暂未开放卖出功能，请等待项目正式上线交易后再卖出", //
  PLACE_ORDER_LIMIT = 30106, // "对不起，您下单已超过限额!", //
  TRADE_TYPE_NOT_OPEN = 30107, // "该交易对暂未开放", //
  TRADE_PRICE_ACCURACY_CANNOT_BE_HIGHER_THAN = 30108, // "交易价格精度不能高于{0}位", //
  STOP_TRADING_CURRENT_TIME = 30109, // "当前时间段停止交易", //
  TRADE_PRICE_MUST_BE_GREATER_THAN = 30110, // "交易价格必须大于{0}", //
  TRADE_PRICE_MUST_BE_LESS_THAN = 30111, // "交易价格必须小于{0}", //
  TRADE_AMOUNT_MUST_BE_GREATER_THAN = 30112, // "交易数量必须大于{0}", //
  TRADE_AMOUNT_MUST_BE_LESS_THAN = 30113, // "交易数量必须小于{0}", //
  TRADE_PRICE_MUST_BE_GREATER_THAN_LATEST_PRICE = 30114, // "交易价格不能高于最新价的{0}", //
  TRADE_PRICE_MUST_BE_LESS_THAN_LATEST_PRICE = 30115, // "交易价格不能低于于最新价的{0}", //
  INSUFFICIENT_BALANCE = 30116, // "余额不足", //
  TRADE_PRICE_CANNOT_GREATER_THAN_OPEN_PRICE = 30117, // "交易价格不能高于开盘价的{0}", //
  TRADE_PRICE_CANNOT_LESS_THAN_OPEN_PRICE = 30118, // "交易价格不能低于开盘价的{0}", //
  FAIL_TO_ENTRUST = 30119, // "委托失败", //
  TRADE_PWD_REMAIN_TIMES = 30120, // "交易密码错误！您还有{0}次机会！", //
  ENTRUST_NOT_FOUND = 30121, // "委单不存在", //
  CURRENT_ENTRUST_PLACE_TOO_MUCH = 30122, // "当前委托数量过多，不可提交", //
  PLEASE_ENTER_CORRECT_TRANSACTION_PRICE = 30123, // "请输入正确的交易价格", //
  TRADE_COMBINATORIAL_ERROR = 30124, // "请开启谷歌验证或者手机验证或邮箱验证", //
  TRADE_USER_FORBIDDEN_COIN = 30125, // "账号虚拟币操作已冻结，如有疑问请联系客服！", //
  TRADE_USER_FORBIDDEN_CNY = 30126, // "账号资金操作已冻结，如有疑问请联系客服！", //

  /**
   * 充提币（hjf）30201 ~ 30300
   */
  PAUSE_TRANSFER = 30201, // "暂停划转", //
  PLATFORM_TRANSFER_MEMO_MUST_BE_NUMBER = 30202, // "平台互转地址标签必须为数字", //
  CANCEL_WITHDRAW_ERROR = 30203, // "撤销失败", //
  PLATFORM_TRANSFER_USER_NO_EXIST = 30204, // "平台互转用户不存在，请重新填写地址标签", //

  /**
   * OTC 优化（hjf）30301 ~ 30400
   */
  BUY_ADVERT_LIMIT = 30301, // "进行中购买广告数量已达上限，请先下架不需要的广告。", //
  SELL_ADVERT_LIMIT = 30302, // "进行中出售广告数量已达上限，请先下架不需要的广告。", //
  OTC_TEMPORARY_BLACKLIST_TIP = 30303, // "由于您多次主动取消订单，24 小时内无法进行 C2C 交易，如有疑问请联系客服。", //
  OTC_PERMANENT_BLACKLIST_TIP = 30304, // "由于风控原因，您已被永久停止 C2C 交易，如有疑问请联系客服。", //

  /**
   * 热币宝理财 30401 ~ 30600
   */
  EARN_PARAM_ERROR = 30401, // "PARAMETER ''{0}'' MUST NOT BE EMPTY/NULL", //
  EARN_COIN_TAKE_OFF_ERROR = 30402, // "转入失败，请稍后再试", //
  EARN_COIN_INWARD_ERROR = 30403, // "转出失败，请稍后再试", //
  EARN_PRODUCT_SELL_STATUS_ERROR = 30404, // "当前产品已停止销售，多谢您的关注", //
  EARN_PRODUCT_STATUS_ERROR = 30405, // "当前产品已下架，多谢您的关注", //
  EARN_PRODUCT_PURCHASE_AMOUNT_BEYOND = 30406, // "当前产品已售罄，多谢您的关注", //
  EARN_PURCHASE_AMOUNT_LESS = 30407, // "申购金额最小单位为{0}，请检查后再试", //
  EARN_PRODUCT_PURCHASE_LIMIT_BEYOND = 30408, // "申购金额大于购买上限，请检查后再试", //
  EARN_PURCHASE_BALANCE_NOT_ENOUGH = 30409, // "金额不足，请检查后再试", //
  EARN_PRODUCT_PURCHASE_HAND_LESS = 30410, // "申购手数至少为 1，请检查后再试", //
  EARN_PRODUCT_PURCHASE_HAND_BEYOND = 30411, // "申购手数大于购买上限，请检查后再试", //
  EARN_ORDER_REDEEM_AMOUNT_BEYOND = 30412, // "金额不足，请检查后再试", //
  EARN_ORDER_REDEEM_DAY_LIMIT = 30413, // "已超当日快速赎回上限，请明日再试", //
  EARN_ORDER_BUY_FAIL = 30414, // "申购异常，请联系客服", //
  EARN_ORDER_REDEEM_FAIL = 30415, // "赎回异常，请联系客服", //
  EARN_ORDER_REDEEM_ILLEGAL = 30416, // "非法请求，请检查后再试", //
  EARN_ORDER_REDEEM_STATUS_ERROR = 30417, // "当前状态不支持赎回", //
  EARN_DURING_SETTLE_TIME_ERROR = 30418, // "系统结算中，请稍后再试", //
  EARN_NOT_EXISTS_ERROR = 30419, // "{0}不存在，请检查后再试", //

  /**
   * 现货杠杆 30601 ~ 30800
   */
  MAG_PARAM_ERROR = 30601, // "PARAMETER ''{0}'' MUST NOT BE EMPTY/NULL", //
  MAG_CANCEL_UPDATE_USER_WALLET_ERROR = 30602, // "撤销修改杠杆钱包异常【{0}】", //
  MAG_FREE_NOT_ENOUGH = 30603, // "可用余额不足", //
  MAG_FROZEN_NOT_ENOUGH = 30604, // "冻结资金不足", //
  MAG_BORROWED_NOT_ENOUGH = 30605, // "当前已借不足", //
  MAG_INTEREST_NOT_ENOUGH = 30606, // "未还利息不足", //
  MAG_USER_MARGIN_ACTIVATE_ERROR = 30607, // "开通杠杆交易异常，请稍后重试", //
  MAG_USER_NOT_ACTIVATE_MARGIN = 30608, // "操作失败，请先开通杠杆", //
  MAG_MARGIN_MODE_ERROR = 30609, // "杠杆模式错误", //
  MAG_OVER_MAX_AMOUNT_PLEASE_RE_ENTER = 30700, // "超出最大借款数量，请重新输入", //
  MAG_COIN_NOT_SUPPORT = 30701, // "当前币种不可借出，请联系客服", //
  MAG_TRADE_AMOUNT_TOO_SMALL = 30702, // "交易额不得小于 10USDT，请划转资金", //
  MAG_TRANSFER_ERROR_UNOPENED = 30703, // "划转失败，请先开通杠杆", //
  MAG_FORBID_TRANSFER = 30704, // "划转失败，该币种禁止划转", //
  MAG_TRANSFER_EXCESS_MAX_COUNT = 30705, // "划转数量超过最大可划转数量", //
  // MAG_TRANSFER_NO_ASSETS =30706, //"当前账户无资产，请先划转", //
  MAG_EXCESS_MAX_REPAY_COUNT = 30707, // "还款数量已超过最大还款额", //
  MAG_NO_BORROW_COUNT = 30708, // "您还未借款", //
  MAG_REMAINING_AMOUNT_TOO_SMALL = 30709, // "您的剩余负债金额太小不足以进行下单，请手动进行平仓还款操作。", //
  MAG_CURRENCY_LEND_ALL = 30710, // "当前币种已经全部借出", //
  MAG_REPAY_COUNT_MUST_GT_ZERO = 30711, // "还款数量必须大于 0", //
  MAG_BORROW_COUNT_MUST_GT_ZERO = 30712, // "借款数量必须大于 0", //
  MAG_BORROW_TOTAL_NOT_ENOUGH = 30713, // "由于借币额度不足，下单失败", //

  /**
   * 量化错误码 40000 ~ 40199
   */
  QTV_SUCCESS = 40000, // "请求成功", //
  QTV_PARAM_BLANK_ACCESSKEYID = 40001, // "非法请求，AccessKeyId 不能为空", //
  QTV_PARAM_ORDERS_TEN_MAX = 40002, // "单次请求最多支持 10 笔订单", //
  QTV_PARAM_BLANK_SYMBOL = 40003, // "非法请求，symbol 不能为空", //
  QTV_PARAM_BLANK_TRADE_AMOUNT = 40004, // "tradeAmount 必须大于 0", //
  QTV_PARAM_BLANK_TRADE_PRICE = 40005, // "tradePrice 必须大于 0", //
  QTV_PARAM_ERROR_TYPE = 40006, // "交易类型【type】错误", //
  QTV_PARAM_ERROR_SYMBOL = 40007, // "非法请求，symbol 格式不正确", //
  QTV_PARAM_NOT_EXIST_SYMBOL = 40008, // "symbol 有误，对应币种不存在或已禁用", //
  QTV_SYSTEM_TIMEOUT = 40009, // "网络超时，请重试", //
  QTV_PARAM_ERROR_ID = 40010, // "委单不存在，请确认 AccessKeyId 或 id 是否正确", //
  QTV_SYSTEM_ERROR = 40011, // "系统错误，请重试", //
  QTV_PARAM_ERROR_COUNT = 40012, // "请求条数【count】不能超过 100", //
  QTV_PARAM_ERROR_ACCESSKEYID = 40013, // "用户不存在，请确认 AccessKeyId 是否正确", //
  QTV_PARAM_ERROR_ACCESSKEYID_ID = 40014, // "非法请求，请确认 AccessKeyId 或 id 是否正确", //
  QTV_PARAM_EMPTY_ORDERIDS = 40015, // "订单列表【orderIds】不能为空", //
  QTV_PARAM_BLANK_ADDRESS = 40016, // "非法请求，address 不能为空", //
  TRANSFER_ERROR_UNOPENED_CONTRACT = 40017, // "划转失败，请先开通合约", //
  QTV_PARAM_ERROR_COUNT500 = 40018, // "请求条数【count】不能超过 500", //
  QTV_PARAM_ERROR_COUNT1000 = 40018, // "请求条数【count】不能超过 1000", //
  QTV_PARAM_ERROR_ORDERTYPE = 40019, // "请求参数【orderType】范围在 0-1 之间", //
  QTV_PARAM_ORDERS_FIFTY_MAX = 40020, // "单次请求批量下单最多支持 50 笔订单", //
  QTV_PARAM_BLANK_CLIENT_ORDERID = 40021, // "ClientOrderId 客户端 ID 不能为空", //
  QTV_HEDGING_REFER_NOT_EXIST = 40022, // "该对冲信息不存在", //
  QTV_PARAM_DMS_TIMEOUT_ERROR = 40023, // "timeout 应该为 0 或大于等于 10", //

  /**
   * 帮助中心错误码 40200 ~ 40299
   */
  CMS_SUPPORT_EXIST_TEXT = 40201, // "该目录 =不同语言下存在正文，//不允许新增目录", //
  CMS_SUPPORT_EXIST_CATALOG = 40202, // "该目录 =不同语言下存在目录，//不允许新增正文", //
  CMS_SUPPORT_SORT_MAX = 40203, // "排序最大，//不准上移", //
  CMS_SUPPORT_SORT_MIN = 40204, // "排序最小，//不准下移", //
  CMS_SUPPORT_EXIST_COPY_TEXT = 40205, // "该目录 =不同语言下存在目录，//不允许复制正文", //
  CMS_SUPPORT_EXIST_COPY_CATALOG = 40206, // "该目录 =不同语言下存在正文，//不允许复制目录", //
  CMS_SUPPORT_EXIST_MOVE_TEXT = 40207, // "该目录 =不同语言下存在目录，//不允许移动正文", //
  CMS_SUPPORT_EXIST_MOVE_CATALOG = 40208, // "该目录 =不同语言下存在正文，//不允许移动目录", //
  CMS_SUPPORT_MOVE_LIMIT = 40209, // "该目录 =不同语言移动后目录层级大于 3 级，//请检查后移动", //
  CMS_SUPPORT_DELETE_EXIST_TASK = 40210, // "操作失败，//该目录或子目录下有计划任务，//请取消后重试", //

  /**
   * 风控错误码
   */
  RC_RISK_SCENE_ISEXIST = 50001, // "风险场景已存在", //
  RC_RISK_SCENE_UNEXIST = 50002, // "风险场景不存在或已被修改", //
  RC_RISK_TAG_ISEXIST = 50003, // "风险标签已存在", //
  RC_RISK_TAG_UNEXIST = 50004, // "风险标签不存在或已被修改", //
  RC_RISK_NAMELIST_UNEXIST = 50005, // "风险名单不存在或已被修改", //
  RC_RISK_FIELDMETHOD_ISEXIST = 50006, // "风险字段方法已存在", //
  RC_RISK_FIELDMETHOD_UNEXIST = 50007, // "风险字段方法不存在或已被修改", //
  RC_RISK_FIELD_ISEXIST = 50008, // "风险字段已存在", //
  RC_RISK_FIELD_UNEXIST = 50009, // "风险字段不存在或已被修改", //
  RC_RISK_FIELDTYPE_ISEXIST = 50010, // "风险字段类别已存在", //
  RC_RISK_FIELDTYPE_UNEXIST = 50011, // "风险字段类别不存在或已被修改", //
  RC_RISK_EVENT_ISEXIST = 50012, // "风险事件已存在", //
  RC_RISK_EVENT_UNEXIST = 50013, // "风险事件不存在或已被修改", //
  RC_RISK_STRATEGY_ISEXIST = 50014, // "风险策略已存在", //
  RC_RISK_STRATEGY_UNEXIST = 50015, // "风险策略不存在或已被修改", //
  RC_RISK_RULE_ISEXIST = 50016, // "风险策略规则已存在", //
  RC_RISK_RULE_UNEXIST = 50017, // "风险策略规则不存在或已被修改", //
  RC_USER_PERMITS_UNEXIST = 50018, // "风险用户权限状态不存在或已被修改", //
  RC_STRATEGY_FLOWRATE_ILLEGAL = 50019, // "流量占比需在 0~100 之间", //

  /**
   * 质押借币 43000~44000
   */
  // 质押借币 - 订单
  DER_ORDER_IS_NOT_EXIST = 43000, // "订单不存在", //
  DER_ORDER_STATUS_NOT_SUPPORTED = 43001, // "订单状态不支持", //
  DER_COIN_LAST_PRICE_NOT_FOUND = 43002, // "币种最新价未找到", //
  DER_ORDER_CANNOT_BE_RENEWED_AGAIN = 43003, // "订单无法再次续借", //
  DER_ORDER_RENEWAL_CONDITIONS_ARE_NOT_MET = 43004, // "续借将在 UTC+8 {0}月{1}日{2} 时开放选择", //
  ABNORMAL_REPAYMENT_AMOUNT = 43005, // "还款金额异常", //
  DER_LOAN_CURRENCY_NOT_FOUND = 43006, // "借出币未找到", //
  DER_LOAN_CURRENCY_HAS_BEEN_REMOVED = 43007, // "借出币已下架", //
  DER_MIN_LOAN_AMOUNT = 43008, // "最小可借数量为{0}", //
  DER_MAX_LOAN_AMOUNT = 43009, // "最大可借数量为{0}", //
  DER_LOAN_CYCLE_NOT_SUPPORTED = 43010, // "借款周期不支持", //
  DER_PLEDGE_CURRENCY_NOT_FOUND = 43011, // "质押币未找到", //
  DER_PLEDGE_CURRENCY_HAS_BEEN_REMOVED = 43012, // "质押币已下架", //
  DER_FEE_CONFIG_NOT_INIT = 43013, // "手续费配置没有初始化", //
  DER_UNREASONABLE_PLEDGE_RATE = 43014, // "目标质押率不合理", //

  // 质押借币 - 产品
  DER_LOAN_CURRENCY_NOT_EXIST = 43100, // "借出币不存在", //
  DER_LOAN_STOCK_INSUFFICIENT = 43101, // "借出币库存数量不足", //
  DER_FAILED_TO_UPDATE_LOAN_STOCK = 43102, // "更新借出币库存数量失败", //
  DER_FAILED_TO_UPDATE_LOAN_AMOUNT_AND_RATE = 43103, // "更新借出币已借出数量、库存比例失败", //
  DER_PLEDGE_CURRENCY_NOT_EXIST = 43104, // "质押币不存在", //
  DER_FAILED_TO_UPDATE_PLEDGE_NUM_AND_AMOUNT = 43105, // "更新总质押数量、总质押金额失败", //
  DER_PLEDGE_STOCK_INSUFFICIENT = 43106, // "总质押币数量不足回赎", //
  DER_FAILED_TO_UPDATE_PLEDGE_TOTAL_NUM = 43107, // "更新质押币总质押币数量失败", //
  DER_FAILED_TO_UPDATE_PLEDGE_TOTAL_AMOUNT = 43108, // "更新总质押金额失败", //
  DER_FAILED_TO_UPDATE_LOAN_STOCK_AND_AMOUNT_AND_RATE = 43109, // "更新借出币库存数量、已借出数量、库存比例失败", //

  // 站内信
  INM_OUTOF_ALL_MAX_PRICE_ALERT = 60001, // "所有交易对的价格提醒总数不超过{0}条", //
  INM_OUTOF_PAIR_MAX_PRICE_ALERT = 60002, // "每个交易对只可设置{0}条价格提醒", //
  INM_PAIR_PRICE_ALERT_NOT_EXIST = 60003, // "此条交易对价格订阅已不存在", //
  INM_UID_LIMIT = 60004, // "uid={0}不存在，//请检查后再插入", //
  INM_UPDATE_PUBLISH = 60005, // "站内信已发布，//不可再发布", //
  // 风控的拦截
  RISK_CONTROL_AMOUNT_ADDRESS = 60006, // "由于金额或地址不符被风控拦截"
}
