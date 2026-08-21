import type { Metadata } from "next";
import { CodeBlock } from "../../components/CodeBlock";
import { DocsShell } from "../../components/DocsShell";

export const metadata: Metadata = { title: "快速开始", description: "在 uni-app 或纯 H5 中接入 WLYD Bridge v0.0.39。" };

const uniMain = `// main.ts：多端项目仅在 H5 打入 Bridge\n// #ifdef H5\nimport '@wlydfe/flutter-bridge';\n// #endif`;
const viteCode = `import { createRequire } from 'node:module';\n\nconst { flutterBridgeUniPlugin } = createRequire(import.meta.url)(\n  '@wlydfe/flutter-bridge/vite-plugin'\n);\n\n// vite plugins 中注册\nplugins: [\n  platform === 'h5' && flutterBridgeUniPlugin('h5'),\n  // ...其他插件\n]`;
const typeCode = `{\n  "compilerOptions": {\n    "types": [\n      "@dcloudio/types",\n      "@wlydfe/flutter-bridge/uni"\n    ]\n  }\n}`;
const h5Code = `// Vue / React / Vanilla H5 的客户端入口\nimport '@wlydfe/flutter-bridge';\n\nconst bridge = window.WLYDFlutterBridge;\n\nif (bridge?.isInApp) {\n  bridge.navigateTo?.({ url: '/pages/detail' });\n\n  const result = await bridge.native?.(\n    'getUserInfo',\n    { id: 1 }\n  );\n}`;
const flutterCode = `// 概念示例：Flutter WebView 注入底层 Channel\ncontroller.addJavaScriptChannel(\n  'WLYDBridge',\n  onMessageReceived: (message) {\n    dispatcher.handle(jsonDecode(message.message));\n  },\n);\n\n// 处理结束后回调 H5\ncontroller.runJavaScript(\n  'window.onFlutterCallbackPromise(' +\n  jsonEncode(callbackId) + ',' +\n  jsonEncode(jsonEncode(result)) + ')'\n);`;

export default function GettingStarted() {
  return <DocsShell current="getting-started"><article className="docArticle"><p className="breadcrumb">指南 / 快速开始</p><span className="docKicker">GETTING STARTED · v0.0.39</span><h1>接入 WLYD Bridge</h1><p className="lead">先确定你的 H5 类型：uni-app 需要入口、Vite 插件和类型三步配置；普通 Vue、React 或原生 H5 只需在客户端引入主包。两种方式共享同一 Flutter 通道。</p>
    <div className="notice info"><b>两个对象，不要混用</b><p><code>window.WLYDBridge</code> 是 Flutter 注入的底层通信对象；<code>window.WLYDFlutterBridge</code> 是本库为普通 H5 提供的业务 API。</p></div>
    <h2>1. 安装</h2><CodeBlock code="pnpm add @wlydfe/flutter-bridge" label="Terminal"/><p>当前文档基于 <code>F-hfh-bridge</code> 分支，包版本为 <code>0.0.39</code>。</p>
    <h2>2A. uni-app H5 接入</h2><h3>入口仅在 H5 引入</h3><CodeBlock code={uniMain}/><p>多端项目强烈建议保留条件编译，避免 Bridge 无意义地进入小程序或 App 包。只构建 H5 的项目可以省略，但保留更清晰。</p>
    <h3>配置 Vite 插件（必须）</h3><p>uni-app H5 生产构建会把 <code>uni.xxx</code> 转成官方静态 import，仅覆盖 <code>window.uni</code> 不足以拦截。插件会把受支持 API 重写到 Bridge 的统一代理。</p><CodeBlock code={viteCode} label="vite.config.ts"/>
    <h3>补充 TypeScript 类型</h3><CodeBlock code={typeCode} label="tsconfig.json"/>
    <h3>按参数选择 H5 或原生</h3><CodeBlock code={`// 保持 H5 页面栈\nuni.navigateTo({ url: '/subs/detail/index' });\n\n// 跳 App 原生页\nuni.navigateTo({ nativeUrl: '/home' });\nuni.navigateBack({ nativeDelta: 1 });\n\n// 强制使用原生能力\nuni.getLocation({ useNative: true, success: console.log });\nuni.showToast({ useNative: true, title: '保存成功' });`}/>
    <div className="paramTable compactTable"><div className="paramHead"><span>参数</span><span>适用能力</span><span>行为</span></div><div className="paramRow"><span><code>url / delta</code></span><span>导航</span><p>使用官方 uni H5 页面栈。</p></div><div className="paramRow"><span><code>nativeUrl / nativeDelta</code></span><span>导航</span><p>切换到 Flutter 原生路由或返回。</p></div><div className="paramRow"><span><code>useNative: true</code></span><span>双轨 API</span><p>强制调用 Flutter 原生能力。</p></div><div className="paramRow"><span><code>useNative: false</code></span><span>双轨 API</span><p>明确回退官方 uni API。</p></div></div>
    <h2>2B. Vue / React / 原生 H5</h2><p>普通 H5 不需要 uni-app Vite 插件。主包引入后使用 <code>window.WLYDFlutterBridge</code>；App 内默认走原生，不必重复传 <code>useNative: true</code>。</p><CodeBlock code={h5Code}/><p>也可以按需 ESM 导入：<code>import {`{ navigateTo, showToast, callNative }`} from '@wlydfe/flutter-bridge'</code>。</p>
    <h2>3. Flutter 注入通道</h2><p>Flutter WebView 必须先提供名为 <code>WLYDBridge</code> 的 JavaScript Channel，并按消息中的 type 分发 Handler。</p><CodeBlock code={flutterCode} label="Dart · 概念示例"/>
    <div className="notice warning"><b>初始化顺序</b><p>先注入 <code>WLYDBridge</code>，再加载 H5 Bridge 包。库只在模块初始化时判断 App 环境；通道若稍后出现，不会自动重新挂载完整 API。</p></div>
    <h2>环境判断</h2><CodeBlock code={`// uni-app\nif (uni.isInApp) console.log(uni.bridgeVersion);\n\n// 普通 H5\nif (window.WLYDFlutterBridge?.isInApp) {\n  console.log(window.WLYDFlutterBridge.bridgeVersion);\n}`}/><p>App 外仅提供 <code>isInApp</code> 与 <code>bridgeVersion</code>，完整原生 API 只会在 Flutter WebView 内挂载。</p>
    <h2>上线前检查</h2><ul className="checklist"><li>Channel 名严格为 <code>WLYDBridge</code>，区分大小写</li><li>uni-app H5 已同时配置入口、Vite 插件与类型</li><li>纯 H5 仅在客户端执行 import，SSR 不在服务端求值</li><li>Flutter 已注册所用 API 或业务 Handler</li><li>回调使用相同 callbackId，并返回可解析 JSON</li><li>相机、相册、定位、微信等系统权限已经配置</li></ul>
    <div className="nextGuide"><span>下一步</span><a href="/guide/protocol">理解 Bridge 通信协议 →</a></div>
  </article><aside className="toc"><b>本页内容</b><a href="#">安装</a><a href="#">uni-app 接入</a><a href="#">纯 H5 接入</a><a href="#">Flutter 通道</a><a href="#">上线检查</a></aside></DocsShell>;
}
