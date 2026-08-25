import type { Metadata } from "next";
import { CodeBlock } from "../../components/CodeBlock";
import { DocsShell } from "../../components/DocsShell";
import { SiteLink } from "../../components/SiteLink";

export const metadata: Metadata = {
  title: "司机项目实战与限制",
  description: "基于 uniapp-match-driver 与 flutter_match_driver 源码整理的 Bridge API 用法、限制与风险。",
};
export const dynamic = "force-static";

const nativeMethods = [
  ["onceLocation", "一次原生定位", "/api/native-once-location"],
  ["getLocationPermissionStatus", "读取定位服务与授权状态", "/api/native-location-permission-status"],
  ["requestLocationServicePermission", "申请定位权限或引导设置", "/api/native-request-location-permission"],
  ["requestCamera", "人脸认证前申请相机权限", "/api/native-request-camera"],
  ["mediaCameraPermission", "图片上传前申请相机权限", "/api/native-media-camera-permission"],
  ["mediaPhotoPermission", "图片上传前申请相册权限", "/api/native-media-photo-permission"],
  ["chooseMedia", "选图/视频、原生上传并回传 URL", "/api/native-choose-media"],
  ["loginToWeb", "登录后重新打开指定 H5", "/api/native-login-to-web"],
  ["pushToWaybillDetails", "跳转原生运单/货源详情", "/api/native-waybill-details"],
  ["pushToWaybillCertificate", "打开原生装卸凭证页", "/api/native-waybill-certificate"],
  ["shuJuBaoWeb", "数据宝人脸认证与结果轮询", "/api/native-shujubao-web"],
  ["waybillTrackCollection", "上报一次装卸点轨迹", "/api/native-waybill-track"],
  ["jump_to_third_app", "通过 Deep Link/Scheme 返回三方 App", "/api/native-jump-third-app"],
  ["completeLearnDate", "同步学习豁免截止日", "/api/native-complete-learn-date"],
] as const;

const safeNative = `async function callDriverNative<T>(
  method: string,
  params: Record<string, unknown> = {},
  timeout = 15_000,
) {
  if (!uni.isInApp || typeof uni.native !== 'function') {
    return { success: false, message: '当前不在 Flutter App 内' };
  }

  return Promise.race([
    uni.native<T>(method, params),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(method + ' timeout')), timeout)
    ),
  ]);
}`;

export default function MatchDriverGuide() {
  return <DocsShell current="match-driver"><article className="docArticle">
    <p className="breadcrumb">指南 / 司机项目实战</p>
    <span className="docKicker">SOURCE AUDIT · uniapp-match-driver</span>
    <h1>司机项目中的真实用法与限制</h1>
    <p className="lead">本页不是抽象接口清单，而是对 <code>uniapp-match-driver</code> 实际调用与 <code>flutter_match_driver</code> Handler 实现的交叉核对。当前项目使用 Bridge v0.0.39，共发现 14 个业务 Native 方法，以及导航、定位、系统信息、标题、拨号和分享等统一 API。</p>

    <div className="notice info"><b>扫描口径</b><p>只把会进入 Flutter Bridge 的调用计入：<code>nativeUrl</code>、<code>nativeDelta</code>、<code>useNative:true</code>、App 内自动走原生的 API，以及 <code>uni.native(method)</code>。普通 H5/小程序里的官方 <code>uni.xxx</code> 仍遵循 uni-app 文档。</p></div>

    <h2 id="used-apis">项目实际使用的统一 API</h2>
    <div className="paramTable compactTable">
      <div className="paramHead"><span>API</span><span>项目用途</span><span>关键边界</span></div>
      <div className="paramRow"><span><SiteLink href="/api/navigate-to"><code>navigateTo</code></SiteLink></span><span>原生首页、资质、登录、活动页</span><p>只有 <code>nativeUrl</code> 才进入原生路由；普通 <code>url</code> 保持 H5 页面栈。</p></div>
      <div className="paramRow"><span><SiteLink href="/api/navigate-back"><code>navigateBack</code></SiteLink></span><span>关闭 App WebView 或返回原生页</span><p>使用 <code>nativeDelta:1</code>；值为 0 不会触发原生分支。</p></div>
      <div className="paramRow"><span><SiteLink href="/api/get-system-info-sync"><code>getSystemInfoSync</code></SiteLink></span><span>读取原生状态栏高度</span><p><code>useNative:true</code> 后由同步 API 变成 Promise，必须 <code>await</code> 或 <code>.then</code>。</p></div>
      <div className="paramRow"><span><SiteLink href="/api/get-location"><code>getLocation</code></SiteLink></span><span>App 内统一定位</span><p>App 失败后项目不再回退官方定位，避免重复权限弹窗。</p></div>
      <div className="paramRow"><span><SiteLink href="/api/set-navigation-bar-title"><code>setNavigationBarTitle</code></SiteLink></span><span>同步 H5 页面标题到原生导航栏</span><p>App 内自动走 Bridge；必须保证 Channel 在包加载前完成注入。</p></div>
      <div className="paramRow"><span><SiteLink href="/api/make-phone-call"><code>makePhoneCall</code></SiteLink></span><span>客服电话、调度电话、虚拟号拨打</span><p>App 内自动走原生；号码仍需业务校验，敏感号码不要写日志。</p></div>
      <div className="paramRow"><span><SiteLink href="/api/wx-share"><code>wxShare</code></SiteLink></span><span>招募活动、公共分享</span><p>只在 App 内挂载；项目里出现的 <code>timeLine</code>、<code>poster</code> 不属于当前类型声明的标准值，应与 Flutter 再对齐。</p></div>
      <div className="paramRow"><span><code>chooseImage / scanCode / openLocation</code></span><span>桥接测试与部分业务能力</span><p>不传 <code>useNative:true</code> 时仍调用官方 uni API；不要以为安装包后所有同名方法都会自动走 Flutter。</p></div>
    </div>

    <h2 id="native-methods">14 个 uni.native 业务方法</h2>
    <p>这些方法不是 npm 包内置能力，而是司机 App 通过 <code>registerBsHandler</code> 注册的业务协议。点击方法名可查看参数、返回值、示例和源码限制。</p>
    <div className="apiTable">{nativeMethods.map(([name, summary, href]) => <SiteLink key={name} href={href}><span className="method">APP</span><span><b>{name}</b><small>{summary}</small></span><em>uni.native</em><strong>→</strong></SiteLink>)}</div>

    <h2 id="important-risks">当前最需要注意的限制</h2>
    <div className="riskGrid">
      <div><b>部分业务回包不合规</b><p><code>pushToWaybillDetails</code>、<code>pushToWaybillCertificate</code> 只返回 message，<code>completeLearnDate</code> 返回空对象。原生副作用可能已经成功，但 Bridge 会得到 <code>success:false</code>。</p></div>
      <div><b>没有内置超时</b><p>Flutter 不回调时 Promise 和 callbackId 会永久保留。普通能力建议业务层加超时；人脸识别可能接近 1 分钟，需要单独配置更长时间。</p></div>
      <div><b>能力由 App 版本决定</b><p>npm 包有类型不代表旧版 App 已注册对应 Handler。<code>bridgeVersion</code> 是 JS 包版本，不是 App 能力版本；未注册会返回 Method not implemented。</p></div>
      <div><b>初始化只判断一次</b><p>Bridge 包加载时如果 <code>window.WLYDBridge</code> 尚未注入，<code>uni.native</code> 与完整 API 不会在 Channel 出现后自动补挂载。</p></div>
      <div><b>权限状态不能只看一项</b><p>Android 定位需要同时满足系统服务 <code>service</code> 与 App 授权 <code>location</code>。相机永久拒绝后需要明确引导用户去系统设置。</p></div>
      <div><b>Native 导航会改变页面栈</b><p><code>loginToWeb</code>、<code>jump_to_third_app</code> 会关闭当前 WebView；<code>jumpType</code> 非空时运单详情会替换原生页面。调用后应停止旧页后续逻辑。</p></div>
      <div><b>chooseMedia 已包含上传</b><p>最多选 9 个，单文件默认 50 MB，返回的是已上传 URL 的 JSON 字符串；原生上传业务类型当前固定为 <code>lmtProblemFeedback</code>。</p></div>
      <div><b>生产 H5 依赖 Vite 重写</b><p>插件只重写声明的 16 个统一 API。<code>uni.native</code> 与扩展 API 依赖 App 内全局挂载；普通 uni API 仍可能走官方静态实现。</p></div>
    </div>

    <h2 id="recommended-pattern">推荐调用模板</h2>
    <CodeBlock code={safeNative}/>
    <div className="notice warning"><b>超时需要按能力分类</b><p>权限、导航、定位通常可设 10–15 秒；<code>shuJuBaoWeb</code> 的原生轮询接近 1 分钟，不应套用 15 秒超时。涉及页面跳转的通知型方法，还应避免超时后重复触发。</p></div>

    <h2 id="fix-priority">建议优先修复</h2>
    <ul className="checklist">
      <li>Flutter 为三个非标准 Handler 补齐 <code>{`{ success, message, data }`}</code>，并在写入完成后再回包</li>
      <li>司机项目定位权限判断同时校验 <code>service</code> 与 <code>location</code></li>
      <li><code>pushToWaybillCertificate</code> 补传 <code>plateNo</code> 与 <code>carColor</code></li>
      <li><code>jump_to_third_app</code> 启动失败时返回 <code>success:false</code>，并限制可接受的 Deep Link/Scheme</li>
      <li><code>chooseMedia</code> 移除原生硬编码 businessType，让上传归属由调用参数决定</li>
      <li>为 Native 能力建立最低 App 版本表或能力探测接口，避免只依赖 npm 版本</li>
    </ul>
    <div className="nextGuide"><span>逐项查看</span><SiteLink href="/api/native-once-location">从 onceLocation 开始 →</SiteLink></div>
  </article><aside className="toc"><b>本页内容</b><a href="#used-apis">项目 API</a><a href="#native-methods">Native 方法</a><a href="#important-risks">重要限制</a><a href="#recommended-pattern">调用模板</a><a href="#fix-priority">修复建议</a></aside></DocsShell>;
}
