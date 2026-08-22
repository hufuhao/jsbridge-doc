import { CopyButton } from "./components/CopyButton";
import { SiteHeader } from "./components/SiteHeader";
import { apiDocs } from "../lib/docs";

const categories = [
  { icon: "↗", title: "页面与导航", desc: "H5 页面栈与 Flutter 原生路由双轨运行", apis: ["navigateTo", "redirectTo", "navigateBack", "switchTab", "openWebview"] },
  { icon: "⌁", title: "系统与交互", desc: "定位、扫码、设备信息、Toast 与 Loading", apis: ["getSystemInfoSync", "getLocation", "scanCode", "showToast", "openLocation"] },
  { icon: "✦", title: "媒体、存储与业务", desc: "图片、原生存储、微信及司机项目 14 个 Native Handler", apis: ["chooseMedia", "pushToWaybillDetails", "shuJuBaoWeb", "waybillTrackCollection", "native / callNative"] },
];

const quickCode = `// #ifdef H5\nimport '@wlydfe/flutter-bridge';\n// #endif\n\n// H5 页面\nuni.navigateTo({ url: '/subs/detail/index?id=1' });\n\n// Flutter 原生页面\nuni.navigateTo({ nativeUrl: '/home' });`;

export default function Home() {
  return <><SiteHeader/><main className="home">
    <section className="hero">
      <div className="heroGrid" aria-hidden="true"/><div className="eyebrow"><span /> Flutter × WebView × JavaScript</div>
      <h1>让 Web，优雅地调用<br/><em>Flutter 原生能力</em></h1>
      <p><strong>@wlydfe/flutter-bridge</strong> 是 Flutter App WebView 与 H5 之间的统一桥接层。它让前端继续使用熟悉的 <code>uni.xxx</code> 风格调用原生能力，同时保留 H5 与小程序原有行为。</p>
      <div className="heroActions"><a className="primary" href="/guide/getting-started">5 分钟接入 <b>→</b></a><a className="secondary" href="/api">浏览全部 API</a></div>
      <div className="install"><span>$</span><code>npm install @wlydfe/flutter-bridge</code><CopyButton text="npm install @wlydfe/flutter-bridge" compact/></div>
      <div className="statRail"><span><b>{apiDocs.length}</b> 个 API 页面</span><span><b>2</b> 种接入入口</span><span><b>1.0</b> Bridge 协议</span></div>
    </section>
    <section className="problemSection homeSection">
      <div className="sectionHeading"><div><span className="sectionNo">01 / WHY BRIDGE</span><h2>它解决的，不只是一次原生调用</h2></div><p>把分散在各业务项目里的通信细节收进一个稳定的基础层，让前端专注业务，让 Flutter 专注能力实现。</p></div>
      <div className="problemGrid">
        <article><span>01</span><h3>告别重复造 Bridge</h3><p>统一维护 <code>callNative</code>、callbackId、Promise 回调池与异常清理，业务项目无需再复制一套通信基础设施。</p></article>
        <article><span>02</span><h3>统一原生能力调用</h3><p>导航、定位、扫码、相机、存储等能力使用接近 <code>uni.xxx</code> 的一致写法，降低接入与迁移成本。</p></article>
        <article><span>03</span><h3>明确 H5 与原生边界</h3><p>通过 <code>url / delta</code> 与 <code>nativeUrl / nativeDelta</code> 清楚区分页面栈；需要时用 <code>useNative</code> 精确切换。</p></article>
        <article><span>04</span><h3>屏蔽协议版本差异</h3><p>兼容 Flutter 新旧两种回包格式，并归一化为统一结果，前端不再为每个 Handler 编写不同解析逻辑。</p></article>
      </div>
    </section>
    <section className="quick homeSection">
      <div className="sectionIntro"><span className="sectionNo">02 / QUICK START</span><h2>为两种 H5 场景而生</h2><p>uni-app 使用 <code>uni.xxx</code> 并配置 Vite 插件；Vue、React 或原生 H5 使用 <code>window.WLYDFlutterBridge</code>。底层通道统一由 Flutter 注入。</p><a className="textLink" href="/guide/getting-started">查看完整接入指南 <b>→</b></a></div>
      <div className="codeBlock homeCode"><div className="codeTop"><span>app.ts</span><CopyButton text={quickCode} compact/></div><pre><code>{quickCode}</code></pre></div>
    </section>
    <section className="apiSection homeSection">
      <div className="sectionHeading"><div><span className="sectionNo">03 / API REFERENCE</span><h2>覆盖常用原生能力</h2></div><a className="textLink" href="/api">全部 {apiDocs.length} 个 API <b>→</b></a></div>
      <div className="apiGrid">{categories.map((group) => <article key={group.title}><span className="apiIcon">{group.icon}</span><h3>{group.title}</h3><p>{group.desc}</p><ul>{group.apis.map((name) => <li key={name}>{name}</li>)}</ul><a href="/api">查看接口 <b>↗</b></a></article>)}</div>
    </section>
    <section className="mechanism homeSection"><div><span className="sectionNo">04 / HOW IT WORKS</span><h2>每次调用，都有迹可循</h2><p>JS Bridge 将类型、参数、唯一回调 ID 与协议版本序列化后发给 Flutter。原生处理完成，再用同一个 ID 精确唤醒对应 Promise。</p><a className="textLink light" href="/guide/protocol">理解通信协议 <b>→</b></a></div><div className="flow"><span>H5 / uni API</span><i>JSON message →</i><span>WLYDBridge</span><i>callbackId →</i><span>Flutter Native</span></div></section>
    <footer><a className="brand" href="/"><span className="brandMark">W</span><span>WLYD Bridge</span></a><p>基于 F-hfh-bridge · 包版本 v0.0.39 · 协议 v1.0</p><div><a href="/guide/getting-started">指南</a><a href="/guide/match-driver">项目实战</a><a href="/api">API</a><a href="/guide/protocol">协议</a></div></footer>
  </main></>;
}
