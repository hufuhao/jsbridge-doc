import type { Metadata } from "next";
import { CodeBlock } from "../../components/CodeBlock";
import { DocsShell } from "../../components/DocsShell";

export const metadata: Metadata = { title: "快速开始", description: "在 Flutter WebView 与 H5 中接入 WLYD Bridge。" };

const flutterCode = `// 示意代码：在宿主 WebView 中注册同名 JavaScript Channel\nJavaScriptChannel(\n  name: 'WLYDBridge',\n  onMessageReceived: (message) async {\n    final payload = jsonDecode(message.message);\n    final callbackId = payload['callbackId'];\n\n    final result = await dispatchBridgeMethod(\n+      payload['type'],\n+      payload['data'],\n+    );\n\n    await controller.runJavaScript(\n      'window.onFlutterCallbackPromise(' +\n      jsonEncode(callbackId) + ',' +\n      jsonEncode(jsonEncode(result)) + ')'\n    );\n  },\n);`;

const moduleCode = `// main.ts / app.ts：在任何业务调用前引入一次\nimport '@wlydfe/flutter-bridge';\n\n// WLYDBridge 已就绪时，API 自动挂到 window.uni\nuni.getToken({\n  success: ({ token }) => console.log(token),\n  fail: () => console.error('Bridge 未就绪')\n});`;

const scriptCode = `<script src="/assets/flutter-bridge/index.umd.js"></script>\n<script>\n  uni.getLocation({\n    success(result) { console.log(result); },\n    fail() { console.error('调用失败'); }\n  });\n</script>`;

export default function GettingStarted() {
  return <DocsShell current="getting-started"><article className="docArticle"><p className="breadcrumb">指南 / 快速开始</p><span className="docKicker">GETTING STARTED</span><h1>接入 WLYD Bridge</h1><p className="lead">Bridge 有两端：Flutter 容器负责注入通道并分发原生能力，H5 负责引入包并通过 <code>uni.*</code> 调用。请严格保证初始化顺序。</p>
    <div className="steps"><span>1</span><i/><span>2</span><i/><span>3</span><p>Flutter 注入通道</p><p>H5 引入 Bridge</p><p>调用并处理回调</p></div>
    <h2>1. 安装 H5 包</h2><CodeBlock code="npm install @wlydfe/flutter-bridge" label="Terminal"/><p>当前源码包名为 <code>@wlydfe/flutter-bridge</code>，文档对应版本 <code>0.0.15</code>。</p>
    <h2>2. Flutter 注册 WLYDBridge</h2><p>Flutter 侧必须向 WebView 注入一个名为 <code>WLYDBridge</code>、带 <code>postMessage</code> 方法的对象。下面是与当前 JS 协议匹配的结构示意；实际 WebView 插件 API 请按宿主项目版本调整。</p><CodeBlock code={flutterCode} label="Dart · 概念示例"/>
    <div className="notice warning"><b>回调约定必须一致</b><p>原生处理结束后调用 <code>window.onFlutterCallbackPromise(callbackId, data)</code>。callbackId 必须原样回传；data 可以是对象或 JSON 字符串。</p></div>
    <h2>3. 在 H5 入口引入</h2><p>模块化项目推荐在应用入口副作用导入一次。初始化时若检测到 <code>window.WLYDBridge</code>，Bridge API 会合并到全局 <code>window.uni</code>。</p><CodeBlock code={moduleCode}/>
    <h3>传统 script 标签</h3><p>使用构建产物的 UMD 文件。必须先创建 WebView JavaScript Channel，再加载 Bridge 脚本。</p><CodeBlock code={scriptCode} label="HTML"/>
    <h2>4. 就绪检查</h2><CodeBlock code={`function isBridgeReady() {\n  return Boolean(\n    window.WLYDBridge &&\n    typeof window.WLYDBridge.postMessage === 'function'\n  );\n}\n\nif (!isBridgeReady()) {\n  // 展示“请在 App 内打开”，不要继续调用\n}`}/>
    <h2>接入检查清单</h2><ul className="checklist"><li>Channel 名严格为 <code>WLYDBridge</code>，区分大小写</li><li>先注入 Channel，再加载 H5 Bridge 包</li><li>原生分发支持文档中的全部 Native type</li><li>回调使用同一 callbackId，并返回可解析 JSON</li><li>所有业务调用均实现 fail 与用户可理解的降级提示</li><li>相机、相册、定位、微信等权限已在 iOS / Android 配置</li></ul>
    <div className="nextGuide"><span>下一步</span><a href="/guide/protocol">理解 Bridge 通信协议 →</a></div>
  </article><aside className="toc"><b>本页内容</b><a href="#">安装 H5 包</a><a href="#">Flutter 注册</a><a href="#">H5 引入</a><a href="#">就绪检查</a></aside></DocsShell>;
}
