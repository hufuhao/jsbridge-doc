export type ApiParam = {
  name: string;
  type: string;
  required?: boolean;
  description: string;
};

export type ApiDoc = {
  slug: string;
  name: string;
  exportedAs?: string;
  category: "设备" | "导航" | "用户" | "生态";
  summary: string;
  nativeType: string;
  availability?: string;
  params: ApiParam[];
  returns: string;
  example: string;
  notes: string[];
};

const callbacks: ApiParam[] = [
  { name: "success", type: "(result?) => void", description: "调用成功时执行。不同 API 的 result 结构见返回值。" },
  { name: "fail", type: "(error?) => void", description: "Bridge 未就绪、Promise 拒绝或业务结果判定失败时执行。" },
  { name: "complete", type: "() => void", description: "Promise 结束后执行；个别前置校验失败场景除外。" },
];

export const apiDocs: ApiDoc[] = [
  {
    slug: "choose-image", name: "chooseImage", category: "设备", summary: "从相册选择图片或唤起相机拍摄。", nativeType: "chooseImage",
    params: [
      { name: "count", type: "number", required: true, description: "最多选择的图片数量。" },
      { name: "sizeType", type: "['original', 'compressed']", required: true, description: "源码当前声明为固定二元组，需同时传 original 与 compressed。" },
      { name: "sourceType", type: "['album', 'camera']", required: true, description: "源码当前声明为固定二元组，需同时传 album 与 camera。" }, ...callbacks,
    ],
    returns: "success 回调收到原生完整响应，应包含 tempFilePaths: string[]、tempFiles: { size, type }[] 以及 success 标记。",
    example: `uni.chooseImage({\n  count: 3,\n  sizeType: ['original', 'compressed'],\n  sourceType: ['album', 'camera'],\n  success: ({ tempFilePaths }) => {\n    console.log('已选择', tempFilePaths);\n  },\n  fail: () => console.error('选择失败'),\n  complete: () => console.log('选择流程结束')\n});`,
    notes: ["权限申请与拒绝后的提示由 Flutter 容器负责。", "大图建议在原生侧压缩并限制数量，避免 WebView 内存峰值。"],
  },
  {
    slug: "get-location", name: "getLocation", category: "设备", summary: "获取当前经纬度。", nativeType: "getLocation",
    params: callbacks,
    returns: "原生响应需使用 { data: { latitude: number, longitude: number } } 结构；success 仅收到 data。",
    example: `uni.getLocation({\n  success: ({ latitude, longitude }) => {\n    console.log({ latitude, longitude });\n  },\n  fail: () => console.error('定位失败')\n});`,
    notes: ["源码使用真值判断校验经纬度；latitude 或 longitude 为 0 时会被误判失败，建议后续修正为数值类型判断。", "定位权限与隐私文案必须由宿主应用完整配置。"],
  },
  {
    slug: "preview-image", name: "previewImage", category: "设备", summary: "使用原生图片查看器预览一张或多张图片。", nativeType: "previewImage",
    params: [{ name: "urls", type: "string[]", required: true, description: "待预览的图片 URL 列表，不可为空。" }, ...callbacks],
    returns: "Promise resolve 后直接触发 success，不读取业务 success 字段。",
    example: `uni.previewImage({\n  urls: [\n    'https://example.com/a.jpg',\n    'https://example.com/b.jpg'\n  ],\n  success: () => console.log('预览器已打开'),\n  fail: () => console.error('打开失败')\n});`,
    notes: ["urls 为空时会立即触发 fail，但当前实现不会触发 complete。", "远程图片需为 HTTPS，并确保原生网络安全策略允许访问。"],
  },
  {
    slug: "login", name: "login", category: "用户", summary: "触发宿主应用登录流程。", nativeType: "login",
    params: callbacks,
    returns: "原生响应 success 为真时，success 回调收到完整结果；类型声明包含 loginSuccess: boolean 与 userId: string。",
    example: `uni.login({\n  success: ({ loginSuccess, userId }) => {\n    if (loginSuccess) console.log('用户', userId);\n  },\n  fail: () => console.error('登录失败')\n});`,
    notes: ["登录态与敏感凭证应由宿主安全保存，不要写入 URL 或日志。", "建议 Flutter 端区分取消、失败和未登录三种状态。"],
  },
  {
    slug: "get-token", name: "getToken", category: "用户", summary: "读取宿主应用当前登录令牌。", nativeType: "getToken",
    params: callbacks,
    returns: "success 回调收到 { token: string }；原生响应 success 为假时触发 fail。",
    example: `uni.getToken({\n  success: ({ token }) => {\n    fetch('/api/profile', {\n      headers: { Authorization: \`Bearer \${token}\` }\n    });\n  },\n  fail: () => console.error('未获取到 token')\n});`,
    notes: ["token 只在内存中短暂使用，不要写入 localStorage、埋点或控制台。", "建议原生端返回过期时间，并提供刷新或重新登录策略。"],
  },
  {
    slug: "navigate-to", name: "FlutterNavigateTo", exportedAs: "native type: navigateTo", category: "导航", summary: "跳转到宿主应用中的指定路由。", nativeType: "navigateTo",
    params: [
      { name: "route", type: "string", required: true, description: "目标页面路由。注意源码字段名是 route，不是 url。" },
      { name: "params", type: "any", required: true, description: "传给目标页面的可序列化参数。" }, ...callbacks,
    ],
    returns: "原生响应 success 为真时触发 success，无回调参数。",
    example: `uni.FlutterNavigateTo({\n  route: '/freightDetail',\n  params: { orderId: 'CHDD20241012000000144273' },\n  success: () => console.log('跳转成功'),\n  fail: () => console.error('跳转失败')\n});`,
    notes: ["源码导出并挂载的名称是 FlutterNavigateTo，不是 README 示例中的 navigateTo。后者可能来自已有 uni runtime。", "params 必须可被 JSON.stringify 正确序列化。"],
  },
  {
    slug: "navigate-back", name: "FlutterNavigateBack", exportedAs: "native type: back", category: "导航", summary: "返回宿主应用上一页。", nativeType: "back",
    params: callbacks,
    returns: "当前实现不检查原生结果，也不会调用 success；Promise 拒绝时会调用 fail，结束时调用 complete。",
    example: `uni.FlutterNavigateBack({\n  fail: () => console.error('返回失败'),\n  complete: () => console.log('返回请求已结束')\n});`,
    notes: ["虽然 options 在类型上可省略，但实现会直接解构它；调用时请务必传入对象。", "源码导出名称是 FlutterNavigateBack；现有 uni.navigateBack 可能属于 uni-app runtime。"],
  },
  {
    slug: "set-navigation-bar-title", name: "setNavigationBarTitle", category: "导航", summary: "更新 Flutter 原生导航栏标题。", nativeType: "updateNavTitle",
    params: [{ name: "title", type: "string", required: true, description: "新的导航栏标题，不可为空。" }, ...callbacks],
    returns: "Promise resolve 后直接触发 success，不读取业务 success 字段。",
    example: `uni.setNavigationBarTitle({\n  title: '货源详情',\n  success: () => console.log('标题已更新'),\n  fail: () => console.error('更新失败')\n});`,
    notes: ["JavaScript API 名与发送给原生的 type 不同：前者是 setNavigationBarTitle，后者是 updateNavTitle。", "标题为空会立即触发 fail，当前实现不会触发 complete。"],
  },
  {
    slug: "wx-share", name: "wxShare", category: "生态", summary: "通过 Flutter 宿主分享到微信。", nativeType: "wxShare", availability: "仅 Flutter 容器",
    params: [
      { name: "title", type: "string", required: true, description: "分享标题。" },
      { name: "url", type: "string", required: true, description: "分享链接，建议使用 HTTPS。" },
      { name: "shareType", type: "['appMessage', 'timeline', 'favorite']", required: true, description: "源码声明为固定三项元组；分别代表好友、朋友圈、收藏。" }, ...callbacks,
    ],
    returns: "原生响应 success 为真时触发 success，无回调参数。",
    example: `uni.wxShare({\n  title: '货源详情',\n  url: location.href,\n  shareType: ['appMessage', 'timeline', 'favorite'],\n  success: () => console.log('分享成功'),\n  fail: () => console.error('分享失败')\n});`,
    notes: ["README 示例传两项，但类型声明要求固定三项；这是现有类型与示例的差异。", "微信 SDK 注册、Universal Link / App Link 等平台配置由 Flutter 宿主负责。"],
  },
  {
    slug: "navigate-to-mini-program", name: "navigateToMiniProgram", category: "生态", summary: "从宿主应用打开指定微信小程序。", nativeType: "navigateToMiniProgram", availability: "依赖微信能力",
    params: [
      { name: "username", type: "string", required: true, description: "小程序原始 ID，例如 gh_xxx。" },
      { name: "path", type: "string", description: "打开的小程序页面路径，可携带查询参数。" },
      { name: "miniProgramType", type: "'release' | 'trial'", description: "正式版或体验版；未提供时由原生侧决定。" }, ...callbacks,
    ],
    returns: "原生响应 success 为真时触发 success，无回调参数。",
    example: `uni.navigateToMiniProgram({\n  username: 'gh_0f5f3e0e118f',\n  path: 'pages/detail/index?id=123',\n  miniProgramType: 'release',\n  success: () => console.log('已打开')\n});`,
    notes: ["需要宿主应用完成微信开放平台配置。", "username 是小程序原始 ID，不是展示名称或 AppID。"],
  },
  {
    slug: "open-file", name: "openFile", category: "生态", summary: "下载或打开远程文件。", nativeType: "openFile",
    params: [
      { name: "fileUrl", type: "string", required: true, description: "远程文件地址。" },
      { name: "fileName", type: "string", required: true, description: "带扩展名的文件名，用于识别文件类型。" }, ...callbacks,
    ],
    returns: "原生响应 success 为真时触发 success，无回调参数。",
    example: `uni.openFile({\n  fileUrl: 'https://example.com/files/report.xlsx',\n  fileName: 'report.xlsx',\n  success: () => console.log('文件已打开'),\n  fail: () => console.error('打开失败')\n});`,
    notes: ["建议原生侧限制 URL 协议、域名、文件大小和 MIME 类型，避免打开不可信内容。", "文件下载进度与缓存策略目前未暴露给 H5。"],
  },
];

export const lifecycleHooks = [
  ["onPageCreated", "页面对应的 Flutter 容器创建完成"],
  ["onResume", "宿主应用从后台回到前台"],
  ["onPause", "宿主应用进入后台或失去焦点"],
  ["onLoad", "页面加载事件"],
  ["onShow", "页面变为可见"],
  ["onHide", "页面变为不可见"],
  ["onDestroy", "页面或容器销毁"],
] as const;

export const navGroups = [
  { label: "设备能力", items: apiDocs.filter((x) => x.category === "设备") },
  { label: "页面与导航", items: apiDocs.filter((x) => x.category === "导航") },
  { label: "用户与生态", items: apiDocs.filter((x) => x.category === "用户" || x.category === "生态") },
];

