import { nativeBusinessDocs } from "./native-business-docs";

export type ApiParam = { name: string; type: string; required?: boolean; description: string };
export type ApiDoc = {
  slug: string; name: string; aliases?: string; exportedAs?: string; category: "导航" | "系统" | "交互" | "媒体" | "存储" | "扩展" | "业务";
  summary: string; nativeType: string; availability?: string; params: ApiParam[]; returns: string; returnFields?: ApiParam[]; example: string; notes: string[];
};

const cb: ApiParam[] = [
  { name: "success", type: "(result?) => void", description: "成功时执行；具体 result 见返回说明。" },
  { name: "fail", type: "(error?) => void", description: "Bridge 拒绝、原生返回失败或校验失败时执行。" },
  { name: "complete", type: "() => void", description: "异步流程结束后执行；同步回退与个别前置校验除外。" },
];
const native = (description = "设为 true 时强制走 Flutter；false 时回退官方 uni API。") => ({ name: "useNative", type: "boolean", description });

export const apiDocs: ApiDoc[] = [
  { slug:"navigate-to",name:"navigateTo",category:"导航",summary:"在 H5 页面栈或 Flutter 原生页面之间导航。",nativeType:"navigateTo",params:[
    {name:"url",type:"string",description:"H5 页面地址；纯 H5 App 环境也可作为原生地址。"},{name:"nativeUrl",type:"string",description:"App 原生路由；传入即走 Bridge。"},{name:"params",type:"any",description:"原生路由参数；未传时从 URL query 解析。"},native(),...cb],
    returns:"H5 模式调用被覆盖前的官方 uni.navigateTo；原生模式识别 success、status 或 data.success 后触发回调。",
    example:`// uni-app：H5 页面\nuni.navigateTo({ url: '/subs/detail/index?id=1' });\n\n// uni-app：App 原生页面\nuni.navigateTo({ nativeUrl: '/home', params: { id: 1 } });\n\n// 纯 H5：App 内默认原生\nwindow.WLYDFlutterBridge?.navigateTo({ url: '/home' });`,
    notes:["uni-app 不传 nativeUrl/useNative 时保持官方 H5 行为。","纯 H5 没有官方 uni 回退，App 内默认走原生。"] },
  { slug:"redirect-to",name:"redirectTo",category:"导航",summary:"关闭当前页后跳转，可选择 H5 或 Flutter 原生路由。",nativeType:"redirectTo",params:[{name:"url",type:"string",description:"H5 页面地址。"},{name:"nativeUrl",type:"string",description:"App 原生路由；传入即走 Bridge。"},{name:"params",type:"any",description:"原生路由参数。"},native(),...cb],returns:"双轨行为与 navigateTo 相同；原生成功兼容三种回包形态。",example:`uni.redirectTo({\n  nativeUrl: '/order-list',\n  params: { status: 'pending' },\n  fail: console.error\n});`,notes:["URL query 仅在未显式传 params 时解析。","H5 回退依赖初始化时成功捕获官方 redirectTo。"] },
  { slug:"navigate-back",name:"navigateBack",category:"导航",summary:"返回 H5 页面栈或 Flutter 原生页面栈。",nativeType:"navigateBack",params:[{name:"delta",type:"number",description:"H5 返回层数，默认 1。"},{name:"nativeDelta",type:"number",description:"原生返回层数；传入即走 Bridge。"},...cb],returns:"原生响应 success 为真时触发 success；H5 模式调用官方 uni.navigateBack。",example:`// H5 返回\nuni.navigateBack({ delta: 1 });\n\n// App 原生返回\nuni.navigateBack({ nativeDelta: 2 });`,notes:["options 现在可以安全省略。","nativeDelta 为 0 时不会单独触发原生分支，建议使用正整数。"] },
  { slug:"switch-tab",name:"switchTab",category:"导航",summary:"切换 H5 tabBar 页面或 App 原生主 Tab。",nativeType:"switchTab",params:[{name:"url",type:"string",description:"H5 tabBar 页面路径。"},native(),{name:"nativeTabIndex",type:"number",description:"App Tab 下标：0 首页、1 找货、2 运单、3 我的。"},...cb],returns:"原生模式返回原始成功数据；H5 模式调用官方 switchTab。",example:`uni.switchTab({\n  useNative: true,\n  nativeTabIndex: 2,\n  success: () => console.log('已切换到运单')\n});`,notes:["原生侧实际收到字段 index。","未传 nativeTabIndex 时原生默认切到 0。"] },
  { slug:"open-webview",name:"openWebview",category:"导航",summary:"由 Flutter 打开新的 WebView 页面。",nativeType:"openWebview",availability:"仅 App",params:[
    {name:"url",type:"string",required:true,description:"要打开的完整 H5 地址或 App 支持的相对路径；空地址不会打开页面。"},
    {name:"route",type:"string",description:"桥接层会透传该字段，但当前司机 App 的 openWebview Handler 不读取它，不能代替 url。"},
    {name:"params",type:"object",description:"打开页面的控制参数；URL query 先解析到此对象，显式 params 再覆盖同名字段。"},
    {name:"params.needUserInfo",type:"0 | 1",description:"1：对完整 http(s) URL 追加 token（若有）、sysType=47、theme=red 和 env；0 或省略：完整 URL 不追加这些字段。相对路径仍会由原生自动追加。原生严格比较数字 1。"},
    {name:"params.closePage",type:"0 | 1",description:"1：先关闭当前 WebView，再打开目标页；0 或省略：保留当前页。原生严格比较数字 1。"},
    {name:"params.title",type:"string",description:"新页面原生导航栏标题；非空时传给 WebView 路由。"},
    {name:"params.needWebRtc",type:"0 | 1",description:"1：使用独立的内嵌 WebView 路由；0 或省略：使用普通 WebView 路由。原生严格比较数字 1。"},...cb],
    returns:"调用本身无返回值，通过 success / fail / complete 回调通知；当前司机 App Handler 仅返回 message，没有 success 字段，所以桥接层会触发 fail，即使页面已打开。",
    example:`uni.openWebview({\n  url: 'https://example.com/detail?id=1',\n  params: { needUserInfo: 1, closePage: 0, title: '详情' }\n});`,
    notes:["URL query 解析结果为字符串；needUserInfo、closePage、needWebRtc 必须在显式 params 中传数字 1，URL 中的 ?needUserInfo=1 不会触发原生开关。","原生 WebUrlValue 还会为未携带 app_channel 的地址追加该参数；除上述字段外，其它 params 当前不会被 openWebview Handler 使用。","当前 Handler 即使 url 为空也返回“成功”文案；且没有 success 字段，调用前请校验 url，不要把 fail 回调当作页面未打开的证据。"] },
  { slug:"set-navigation-bar-title",name:"setNavigationBarTitle",category:"导航",summary:"更新 App 原生导航栏标题。",nativeType:"setNavigationBarTitle",params:[{name:"title",type:"string",required:true,description:"新标题，不可为空。"},...cb],returns:"Promise resolve 后触发 success。",example:`uni.setNavigationBarTitle({ title: '订单详情' });`,notes:["v0.0.39 的 Native type 已与 JS API 名统一。","uni-app shim 在 App 内走原生，App 外回退官方实现。"] },
  { slug:"set-navigation-bar-visible",name:"setNavigationBarVisible",category:"导航",summary:"控制 App 原生导航栏显示或隐藏。",nativeType:"setNavigationBarVisible",params:[{name:"visible",type:"boolean",required:true,description:"true 显示，false 隐藏。"},...cb],returns:"Promise resolve 后触发 success。",example:`uni.setNavigationBarVisible({ visible: false });`,notes:["App 外的 uni-app shim 会直接执行 success，不改变 H5 UI。","纯 H5 仅在 App 内挂载完整 API。"] },
  { slug:"get-system-info-sync",name:"getSystemInfoSync",category:"系统",summary:"获取设备、系统、屏幕、安全区和 App 版本信息。",nativeType:"getSystemInfoSync",params:[native(),...cb],returns:"不传参数时同步返回官方 uni 系统信息；传 { useNative: true } 时返回 Promise，解析为下表中的 Flutter 字段。",returnFields:[
    {name:"deviceBrand",type:"string",description:"设备品牌，例如 apple、huawei；获取失败时为 unknown。"},
    {name:"deviceModel",type:"string",description:"设备型号；获取失败时为 unknown。"},
    {name:"osName",type:"string",description:"系统名称：ios、android，或 Flutter 识别的其它系统名。"},
    {name:"osVersion",type:"string",description:"系统版本文本，来自 Platform.operatingSystemVersion。"},
    {name:"appVersion",type:"string",description:"当前 App 版本号；取不到时为空字符串。"},
    {name:"screenWidth",type:"number",description:"屏幕宽度，使用 Flutter ScreenUtil 返回的逻辑像素。"},
    {name:"screenHeight",type:"number",description:"屏幕高度，使用 Flutter ScreenUtil 返回的逻辑像素。"},
    {name:"statusBarHeight",type:"number",description:"顶部状态栏高度，逻辑像素。"},
    {name:"safeArea.height",type:"number",description:"可用内容高度，按 screenHeight − statusBarHeight − bottomBarHeight 计算；这里不是含 top/left 的矩形。"},
    {name:"safeAreaInsets.left / right",type:"number",description:"左右安全区内边距；当前原生实现固定返回 0。"},
    {name:"safeAreaInsets.top",type:"number",description:"顶部安全区内边距，等于 statusBarHeight。"},
    {name:"safeAreaInsets.bottom",type:"number",description:"底部安全区内边距，等于 Flutter ScreenUtil 的 bottomBarHeight。"},
    {name:"deviceId",type:"string",description:"App 获取的设备标识；取不到时为空字符串。"}],example:`const info = await uni.getSystemInfoSync({ useNative: true });\nconsole.log(info.statusBarHeight, info.safeAreaInsets.bottom);`,notes:["同一个 API 可能同步或异步，跨模式代码建议统一使用 await。","上表仅描述 useNative:true 的 Flutter 返回值；官方 uni 返回值还可能包含 windowWidth、pixelRatio 等字段，不应假定 Flutter 分支也有这些字段。"] },
  { slug:"get-location",name:"getLocation",category:"系统",summary:"使用官方 H5 定位或 Flutter 原生定位获取经纬度。",nativeType:"getLocation",params:[native(),...cb],returns:"success 收到 { latitude, longitude }，Bridge 已解开 registerApi 与业务 data 两层包装。",example:`uni.getLocation({\n  useNative: true,\n  success: ({ latitude, longitude }) => console.log(latitude, longitude),\n  fail: console.error\n});`,notes:["原生定位需要 iOS/Android 权限声明与用户授权。","纯 H5 App 环境默认走原生。"] },
  { slug:"open-location",name:"openLocation",category:"系统",summary:"在 H5 或原生地图中查看指定位置。",nativeType:"openLocation",params:[native(),{name:"latitude",type:"number",required:true,description:"纬度。"},{name:"longitude",type:"number",required:true,description:"经度。"},{name:"scale",type:"number",description:"缩放级别，建议 5–18。"},{name:"name",type:"string",description:"位置名称。"},{name:"address",type:"string",description:"地址详情。"},...cb],returns:"原生响应未明确返回 success:false 时视为成功；H5 模式调用官方 API。",example:`uni.openLocation({\n  useNative: true, latitude: 31.2304, longitude: 121.4737,\n  name: '上海', scale: 15\n});`,notes:["经纬度应使用 WGS84/宿主约定坐标系。","App 地图能力不可用时通过 fail 降级提示。"] },
  { slug:"make-phone-call",name:"makePhoneCall",category:"系统",summary:"调用 Flutter 宿主发起电话拨号。",nativeType:"makePhoneCall",availability:"App 原生",params:[{name:"phoneNumber",type:"string",required:true,description:"需要拨打的电话号码。"},...cb],returns:"响应未明确为 success:false 时触发 success。",example:`uni.makePhoneCall({ phoneNumber: '10086', fail: console.error });`,notes:["当前实现始终调用 Bridge，不走官方 H5 回退。","应在原生侧校验号码并让用户确认。"] },
  { slug:"scan-code",name:"scanCode",category:"系统",summary:"调用 H5 或 Flutter 扫码能力。",nativeType:"scanCode",params:[native(),{name:"onlyFromCamera",type:"boolean",description:"是否仅允许相机扫码。"},{name:"scanType",type:"Array<'barCode' | 'qrCode' | 'datamatrix' | 'pdf417'>",description:"允许识别的码制。"},...cb],returns:"success 收到 { result, scanType?, charSet?, path? }；原生函数也返回该结果 Promise。",example:`uni.scanCode({\n  useNative: true,\n  scanType: ['qrCode', 'barCode'],\n  success: ({ result }) => console.log(result)\n});`,notes:["需要相机权限。","扫码内容属于不可信输入，使用前需校验协议和业务格式。"] },
  { slug:"show-toast",name:"showToast",category:"交互",summary:"显示 H5 或 Flutter 原生轻提示。",nativeType:"showToast",params:[native(),{name:"title",type:"string",required:true,description:"提示内容。"},{name:"icon",type:"'success' | 'loading' | 'error' | 'none' | 'fail' | 'exception'",description:"图标类型。"},{name:"duration",type:"number",description:"展示时长，单位毫秒。"},{name:"mask",type:"boolean",description:"是否阻止穿透。"},{name:"position",type:"'top' | 'center' | 'bottom'",description:"展示位置。"},...cb],returns:"原生响应未明确失败时视为成功；否则回退官方 uni.showToast。",example:`uni.showToast({ useNative: true, title: '保存成功', icon: 'success', duration: 1800 });`,notes:["提示文案保持简短。","image 参数也会透传，但是否支持取决于原生 Handler。"] },
  { slug:"hide-toast",name:"hideToast",category:"交互",summary:"隐藏当前 H5 或 Flutter Toast。",nativeType:"hideToast",params:[native(),...cb],returns:"原生响应未明确失败时视为成功。",example:`uni.hideToast({ useNative: true });`,notes:["需与显示 Toast 的执行通道一致。"] },
  { slug:"show-loading",name:"showLoading",category:"交互",summary:"显示 H5 或 Flutter 原生加载提示。",nativeType:"showLoading",params:[native(),{name:"title",type:"string",description:"加载文案。"},{name:"mask",type:"boolean",description:"是否阻止触摸穿透。"},...cb],returns:"原生响应未明确失败时视为成功。",example:`uni.showLoading({ useNative: true, title: '加载中', mask: true });`,notes:["无论业务成功或失败，都应配对调用 hideLoading。"] },
  { slug:"hide-loading",name:"hideLoading",category:"交互",summary:"隐藏当前 H5 或 Flutter Loading。",nativeType:"hideLoading",params:[native(),...cb],returns:"原生响应未明确失败时视为成功。",example:`uni.hideLoading({ useNative: true });`,notes:["建议放在业务 Promise 的 finally 中。"] },
  { slug:"choose-image",name:"chooseImage",category:"媒体",summary:"从相册选择图片或调用相机拍摄。",nativeType:"chooseImage",params:[native(),{name:"count",type:"number",required:true,description:"最多选择数量。"},{name:"sizeType",type:"Array<'original' | 'compressed'>",required:true,description:"图片质量选项：原图或压缩图。"},{name:"sourceType",type:"Array<'album' | 'camera'>",required:true,description:"可选来源：相册或相机。"},{name:"businessType",type:"string",description:"传入时走原生选择后立即上传的旧流程；成功结果的 url 为上传地址。"},{name:"maxSingleFileMb",type:"number",description:"原生上传时允许的单文件大小上限，单位 MB。"},{name:"returnType",type:"'blob' | 'localUrl'",description:"仅原生模式：blob 默认将图片转为 H5 File/blob URL；localUrl 保留原生本地地址描述符。"},...cb],returns:"原生 data.success 为真时，success 收到下表的选择结果；否则触发 fail。",returnFields:[{name:"tempFilePaths",type:"string[]",description:"所选图片的可用路径列表；blob 模式为浏览器 blob URL。"},{name:"tempFiles",type:"File[] | NativeFileDescriptor[]",description:"所选图片对象；blob 模式为 File，localUrl 模式为原生文件描述符。"},{name:"nativeTempFiles",type:"NativeFileDescriptor[]?",description:"blob 模式下保留的原始原生文件描述符，可用于释放暂存文件。"},{name:"url",type:"string?",description:"使用 businessType 原生立即上传时返回的远端文件地址。"},{name:"errMsg",type:"string?",description:"原生或 uni 的结果说明文本。"}],example:`uni.chooseImage({\n  useNative: true, count: 1,\n  sizeType: ['original', 'compressed'],\n  sourceType: ['album', 'camera'],\n  returnType: 'blob',\n  success: ({ tempFilePaths }) => console.log(tempFilePaths)\n});`,notes:["可传单项数组选择单一来源；当前桥接源码已使用普通数组类型。","需要相册/相机权限。"] },
  { slug:"preview-image",name:"previewImage",category:"媒体",summary:"使用 Flutter 原生查看器预览一张或多张图片。",nativeType:"previewImage",availability:"App 原生",params:[{name:"urls",type:"string[]",required:true,description:"图片 URL 列表，不可为空。"},...cb],returns:"Promise resolve 后直接触发 success。",example:`uni.previewImage({ urls: ['https://example.com/a.jpg', 'https://example.com/b.jpg'] });`,notes:["urls 为空会触发 fail，但不会触发 complete。","远程图片建议使用 HTTPS。"] },
  { slug:"set-storage-sync",name:"setStorageSync",category:"存储",summary:"写入官方 uni 存储或 Flutter 原生存储。",nativeType:"setStorageSync",params:[native(),{name:"key",type:"string",required:true,description:"存储键。"},{name:"data",type:"any",required:true,description:"可序列化值。"},...cb],returns:"H5 模式同步返回官方结果；原生模式返回 Promise。",example:`await uni.setStorageSync({ useNative: true, key: 'token', data: 'xxx' });`,notes:["签名与官方 uni.setStorageSync(key, data) 不兼容：Bridge 必须传对象。","敏感 token 不建议长期放在 H5 可读存储。"] },
  { slug:"get-storage-sync",name:"getStorageSync",category:"存储",summary:"读取官方 uni 存储或 Flutter 原生存储。",nativeType:"getStorageSync",params:[native(),{name:"key",type:"string",required:true,description:"存储键。"},...cb],returns:"H5 模式同步返回值；原生模式 Promise resolve 为 data 或原始回包。",example:`const token = await uni.getStorageSync({ useNative: true, key: 'token' });`,notes:["签名与官方 uni.getStorageSync(key) 不兼容：Bridge 必须传对象。","跨模式建议统一使用 await。"] },
  { slug:"remove-storage-sync",name:"removeStorageSync",category:"存储",summary:"删除官方 uni 存储或 Flutter 原生存储中的键。",nativeType:"removeStorageSync",params:[native(),{name:"key",type:"string",required:true,description:"要删除的存储键。"},...cb],returns:"H5 模式同步；原生 data.success 为真时返回 data。",example:`await uni.removeStorageSync({ useNative: true, key: 'token' });`,notes:["签名与官方 removeStorageSync(key) 不兼容。","原生回包需要将 success 放在 data 内。"] },
  { slug:"login",name:"login",category:"扩展",summary:"触发 Flutter 宿主登录流程。",nativeType:"login",availability:"仅 App",params:cb,returns:"原生响应 success 为真时，success 收到包含 loginSuccess、userId 的完整结果。",example:`uni.login({ success: ({ loginSuccess, userId }) => console.log(loginSuccess, userId) });`,notes:["登录凭证由宿主安全保存，不要写入 URL 或日志。"] },
  { slug:"wx-share",name:"wxShare",category:"扩展",summary:"通过 Flutter 宿主分享到微信。",nativeType:"wxShare",availability:"仅 App",params:[{name:"title",type:"string",required:true,description:"分享标题。"},{name:"url",type:"string",description:"网页分享地址。"},{name:"path",type:"string",description:"小程序页面路径。"},{name:"imageUrl",type:"string",description:"分享图片地址。"},{name:"shareType",type:"Array<'appMessage' | 'timeline' | 'favorite'>",required:true,description:"分享渠道数组。"},...cb],returns:"原生响应 success 为真时触发 success。",example:`uni.wxShare({ title: '订单详情', url: location.href, shareType: ['appMessage'] });`,notes:["v0.0.39 已改为普通数组，可只传需要的渠道。","微信平台能力与白名单由宿主配置。"] },
  { slug:"navigate-to-mini-program",name:"navigateToMiniProgram",category:"扩展",summary:"从 Flutter 宿主打开指定微信小程序。",nativeType:"navigateToMiniProgram",availability:"仅 App",params:[{name:"username",type:"string",required:true,description:"小程序原始 ID。"},{name:"path",type:"string",description:"目标页面路径。"},{name:"miniProgramType",type:"'release' | 'trial'",description:"正式版或体验版。"},...cb],returns:"原生响应 success 为真时触发 success。",example:`uni.navigateToMiniProgram({ username: 'gh_xxx', path: 'pages/detail/index?id=1', miniProgramType: 'release' });`,notes:["选项类型已更名为 FlutterBridgeNavigateToMiniProgramOptions，旧名仍保留为 deprecated 别名。"] },
  { slug:"open-file",name:"openFile",category:"扩展",summary:"让 Flutter 下载并打开远程文件。",nativeType:"openFile",availability:"仅 App",params:[{name:"fileUrl",type:"string",required:true,description:"远程文件地址。"},{name:"fileName",type:"string",required:true,description:"带扩展名的文件名。"},...cb],returns:"原生响应 success 为真时触发 success。",example:`uni.openFile({ fileUrl: 'https://example.com/report.xlsx', fileName: 'report.xlsx' });`,notes:["原生侧应限制协议、域名、MIME 和文件大小。"] },
  ...nativeBusinessDocs,
  { slug:"native",name:"native / callNative",aliases:"window.WLYDFlutterBridge.native",category:"扩展",summary:"调用 Flutter registerBsHandler 注册的自定义业务方法。",nativeType:"动态 method",availability:"仅 App",params:[{name:"method",type:"string",required:true,description:"原生注册的 Handler 名，区分大小写。"},{name:"params",type:"Record<string, unknown>",description:"传给该 Handler 的业务参数对象，默认空对象；各方法字段见下方司机业务 API 页面。"}],returns:"Promise<NativeResponse<T>>，归一化后的通用字段见下表。具体 data 结构取决于 method。",returnFields:[{name:"success",type:"boolean",description:"调用结果。旧协议读取原生 success；新协议 status=success 为 true、fail/error 为 false；无协议壳的对象当前视为 true。"},{name:"data",type:"T?",description:"业务返回数据；有些旧 Handler 把结果放在顶层，此字段可能不存在。"},{name:"message",type:"string?",description:"原生提示或失败原因；新协议失败时由 error 转换而来。"},{name:"其它字段",type:"unknown",description:"原生业务回包的其它字段会保留在结果顶层。"}],example:`const res = await uni.native<{ riskDeviceId: string }>('getRiskDeviceId');\nif (res.success) console.log(res.data?.riskDeviceId);\n\n// 纯 H5 也可调用 window.WLYDFlutterBridge?.native(method, params)`,notes:["uni.native 仅在 App WebView 中可用，业务页面先检查 uni.isInApp。","无协议壳的原生对象当前被视为 success:true；是否真正完成操作仍要结合返回字段判断。","空值或非对象回包转换为 success:false、message:'invalid native response'。"] },
];


// 结构化成功回调的字段；没有结构化数据的接口由上方文字说明。
const structuredReturnFields: Record<string, ApiParam[]> = {
  "get-location": [
    { name: "latitude", type: "number", description: "当前位置纬度。" },
    { name: "longitude", type: "number", description: "当前位置经度。" },
  ],
  "scan-code": [
    { name: "result", type: "string", description: "识别出的码内容。" },
    { name: "scanType", type: "string?", description: "实际识别出的码制。" },
    { name: "charSet", type: "string?", description: "码内容的字符集。" },
    { name: "path", type: "string?", description: "扫码图片路径；是否返回取决于原生实现。" },
  ],
  "login": [
    { name: "loginSuccess", type: "boolean", description: "宿主登录流程是否成功。" },
    { name: "userId", type: "string?", description: "登录成功后的用户 ID；具体值由宿主返回。" },
  ],
};
for (const doc of apiDocs) {
  doc.returnFields ??= structuredReturnFields[doc.slug];
}

export const lifecycleHooks = [
  ["onPageCreated","Flutter 页面容器创建完成"],["onResume","宿主应用回到前台"],["onPause","宿主应用进入后台"],["onLoad","页面加载"],["onShow","页面显示"],["onHide","页面隐藏"],["onDestroy","页面或容器销毁"],
] as const;

export const navGroups = [
  {label:"导航与页面",items:apiDocs.filter(x=>x.category==="导航")},
  {label:"系统能力",items:apiDocs.filter(x=>x.category==="系统")},
  {label:"交互反馈",items:apiDocs.filter(x=>x.category==="交互")},
  {label:"媒体与存储",items:apiDocs.filter(x=>x.category==="媒体"||x.category==="存储")},
  {label:"App 扩展",items:apiDocs.filter(x=>x.category==="扩展")},
  {label:"司机业务 Native",items:apiDocs.filter(x=>x.category==="业务")},
];
