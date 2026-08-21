import { CopyButton } from "./components/CopyButton";
import { SiteHeader } from "./components/SiteHeader";
import { apiDocs } from "../lib/docs";

const categories = [
  { icon: "↗", title: "页面与导航", desc: "H5 页面栈与 Flutter 原生路由双轨运行", apis: ["navigateTo", "redirectTo", "navigateBack", "switchTab", "openWebview"] },
  { icon: "⌁", title: "系统与交互", desc: "定位、扫码、设备信息、Toast 与 Loading", apis: ["getSystemInfoSync", "getLocation", "scanCode", "showToast", "openLocation"] },
  { icon: "✦", title: "媒体、存储与扩展", desc: "图片、原生存储、微信及自定义 Handler", apis: ["chooseImage", "setStorageSync", "wxShare", "openFile", "native / callNative"] },
];

const quickCode = `// #ifdef H5\nimport '@wlydfe/flutter-bridge';\n// #endif\n\n// H5 页面\nuni.navigateTo({ url: '/subs/detail/index?id=1' });\n\n// Flutter 原生页面\nuni.navigateTo({ nativeUrl: '/home' });`;

export default function Home() {
  return <><SiteHeader/><main className="home">
    <section className="hero">
      <div className="heroGrid" aria-hidden="true"/><div className="eyebrow"><span /> Flutter × WebView × JavaScript</div>
      <h1>让 Web，优雅地调用<br/><em>Flutter 原生能力</em></h1>
      <p>@wlydfe/flutter-bridge 为 uni-app 与纯 H5 提供双入口，在保留 H5 官方行为的同时，按参数切换 Flutter 原生能力。</p>
      <div className="heroActions"><a className="primary" href="/guide/getting-started">5 分钟接入 <b>→</b></a><a className="secondary" href="/api">浏览全部 API</a></div>
      <div className="install"><span>$</span><code>npm install @wlydfe/flutter-bridge</code><CopyButton text="npm install @wlydfe/flutter-bridge" compact/></div>
      <div className="statRail"><span><b>{apiDocs.length}</b> 个 API 页面</span><span><b>2</b> 种接入入口</span><span><b>1.0</b> Bridge 协议</span></div>
    </section>
    <section className="quick homeSection">
      <div className="sectionIntro"><span className="sectionNo">01 / QUICK START</span><h2>为两种 H5 场景而生</h2><p>uni-app 使用 <code>uni.xxx</code> 并配置 Vite 插件；Vue、React 或原生 H5 使用 <code>window.WLYDFlutterBridge</code>。底层通道统一由 Flutter 注入。</p><a className="textLink" href="/guide/getting-started">查看完整接入指南 <b>→</b></a></div>
      <div className="codeBlock homeCode"><div className="codeTop"><span>app.ts</span><CopyButton text={quickCode} compact/></div><pre><code>{quickCode}</code></pre></div>
    </section>
    <section className="apiSection homeSection">
      <div className="sectionHeading"><div><span className="sectionNo">02 / API REFERENCE</span><h2>覆盖常用原生能力</h2></div><a className="textLink" href="/api">全部 {apiDocs.length} 个 API <b>→</b></a></div>
      <div className="apiGrid">{categories.map((group) => <article key={group.title}><span className="apiIcon">{group.icon}</span><h3>{group.title}</h3><p>{group.desc}</p><ul>{group.apis.map((name) => <li key={name}>{name}</li>)}</ul><a href="/api">查看接口 <b>↗</b></a></article>)}</div>
    </section>
    <section className="mechanism homeSection"><div><span className="sectionNo">03 / HOW IT WORKS</span><h2>每次调用，都有迹可循</h2><p>JS Bridge 将类型、参数、唯一回调 ID 与协议版本序列化后发给 Flutter。原生处理完成，再用同一个 ID 精确唤醒对应 Promise。</p><a className="textLink light" href="/guide/protocol">理解通信协议 <b>→</b></a></div><div className="flow"><span>H5 / uni API</span><i>JSON message →</i><span>WLYDBridge</span><i>callbackId →</i><span>Flutter Native</span></div></section>
    <footer><a className="brand" href="/"><span className="brandMark">W</span><span>WLYD Bridge</span></a><p>基于 F-hfh-bridge · 包版本 v0.0.39 · 协议 v1.0</p><div><a href="/guide/getting-started">指南</a><a href="/api">API</a><a href="/guide/protocol">协议</a></div></footer>
  </main></>;
}
