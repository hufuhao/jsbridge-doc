import { CopyButton } from "./components/CopyButton";
import { SiteHeader } from "./components/SiteHeader";
import { apiDocs } from "../lib/docs";

const categories = [
  { icon: "⌁", title: "设备能力", desc: "相册、相机、图片预览与定位", apis: ["chooseImage", "getLocation", "previewImage"] },
  { icon: "↗", title: "页面与导航", desc: "原生路由、返回与导航栏标题", apis: ["FlutterNavigateTo", "FlutterNavigateBack", "setNavigationBarTitle"] },
  { icon: "✦", title: "用户与生态", desc: "登录、Token、微信与文件能力", apis: ["login", "getToken", "wxShare", "navigateToMiniProgram", "openFile"] },
];

const quickCode = `import '@wlydfe/flutter-bridge';\n\nuni.getLocation({\n  success: ({ latitude, longitude }) => {\n    console.log(latitude, longitude);\n  },\n  fail: () => console.error('定位失败')\n});`;

export default function Home() {
  return <><SiteHeader/><main className="home">
    <section className="hero">
      <div className="heroGrid" aria-hidden="true"/><div className="eyebrow"><span /> Flutter × WebView × JavaScript</div>
      <h1>让 Web，优雅地调用<br/><em>Flutter 原生能力</em></h1>
      <p>@wlydfe/flutter-bridge 为 H5 提供一套接近 uni-app 的调用体验，统一处理消息发送、异步回调与页面生命周期。</p>
      <div className="heroActions"><a className="primary" href="/guide/getting-started">5 分钟接入 <b>→</b></a><a className="secondary" href="/api">浏览全部 API</a></div>
      <div className="install"><span>$</span><code>npm install @wlydfe/flutter-bridge</code><CopyButton text="npm install @wlydfe/flutter-bridge" compact/></div>
      <div className="statRail"><span><b>{apiDocs.length}</b> 个原生 API</span><span><b>7</b> 个生命周期钩子</span><span><b>1.0</b> Bridge 协议</span></div>
    </section>
    <section className="quick homeSection">
      <div className="sectionIntro"><span className="sectionNo">01 / QUICK START</span><h2>接入只需两步</h2><p>Flutter 注册名为 <code>WLYDBridge</code> 的 JavaScript Channel；H5 在应用入口引入一次包，API 会自动挂载到全局 <code>uni</code>。</p><a className="textLink" href="/guide/getting-started">查看完整接入指南 <b>→</b></a></div>
      <div className="codeBlock homeCode"><div className="codeTop"><span>app.ts</span><CopyButton text={quickCode} compact/></div><pre><code>{quickCode}</code></pre></div>
    </section>
    <section className="apiSection homeSection">
      <div className="sectionHeading"><div><span className="sectionNo">02 / API REFERENCE</span><h2>覆盖常用原生能力</h2></div><a className="textLink" href="/api">全部 {apiDocs.length} 个 API <b>→</b></a></div>
      <div className="apiGrid">{categories.map((group) => <article key={group.title}><span className="apiIcon">{group.icon}</span><h3>{group.title}</h3><p>{group.desc}</p><ul>{group.apis.map((name) => <li key={name}>{name}</li>)}</ul><a href="/api">查看接口 <b>↗</b></a></article>)}</div>
    </section>
    <section className="mechanism homeSection"><div><span className="sectionNo">03 / HOW IT WORKS</span><h2>每次调用，都有迹可循</h2><p>JS Bridge 将类型、参数、唯一回调 ID 与协议版本序列化后发给 Flutter。原生处理完成，再用同一个 ID 精确唤醒对应 Promise。</p><a className="textLink light" href="/guide/protocol">理解通信协议 <b>→</b></a></div><div className="flow"><span>H5 / uni API</span><i>JSON message →</i><span>WLYDBridge</span><i>callbackId →</i><span>Flutter Native</span></div></section>
    <footer><a className="brand" href="/"><span className="brandMark">W</span><span>WLYD Bridge</span></a><p>基于源码 v0.0.15 · 协议 v1.0</p><div><a href="/guide/getting-started">指南</a><a href="/api">API</a><a href="/guide/protocol">协议</a></div></footer>
  </main></>;
}
