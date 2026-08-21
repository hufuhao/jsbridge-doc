import type { Metadata } from "next";
import { CodeBlock } from "../../components/CodeBlock";
import { DocsShell } from "../../components/DocsShell";

export const metadata: Metadata = { title: "Bridge 协议", description: "理解 WLYD Bridge 的消息、回调和错误模型。" };

const message = `{
  "type": "getLocation",
  "data": {},
  "callbackId": "cb_1",
  "version": "1.0"
}`;

export default function Protocol() {
  return <DocsShell current="protocol"><article className="docArticle"><p className="breadcrumb">指南 / Bridge 协议</p><span className="docKicker">BRIDGE PROTOCOL</span><h1>一次调用如何完成</h1><p className="lead">WLYD Bridge 是一个轻量的请求—回调协议。每次 H5 调用都会生成唯一 ID，经由 Flutter Channel 发出；原生完成后用这个 ID 找回对应 Promise。</p>
    <div className="protocolFlow"><div><b>01</b><span>H5 调用</span><small>uni.getLocation(options)</small></div><i>→</i><div><b>02</b><span>消息入栈</span><small>WLYDBridge.postMessage</small></div><i>→</i><div><b>03</b><span>原生处理</span><small>dispatch by type</small></div><i>→</i><div><b>04</b><span>精确回调</span><small>callbackId → Promise</small></div></div>
    <h2>请求消息</h2><CodeBlock code={message} label="JSON"/><div className="paramTable compactTable"><div className="paramHead"><span>字段</span><span>类型</span><span>说明</span></div><div className="paramRow"><span><code>type</code></span><span><code>string</code></span><p>原生方法标识，如 getLocation、updateNavTitle、back。</p></div><div className="paramRow"><span><code>data</code></span><span><code>object</code></span><p>移除 success、fail、complete 后的业务参数。</p></div><div className="paramRow"><span><code>callbackId</code></span><span><code>string</code></span><p>当前页面内递增生成，例如 cb_1。</p></div><div className="paramRow"><span><code>version</code></span><span><code>string</code></span><p>当前固定为 1.0，建议原生端校验兼容性。</p></div></div>
    <h2>响应消息</h2><p>Flutter 端处理完成后执行下列 JavaScript。Bridge 会尝试解析字符串 data，找到 Promise 并 resolve，最后清理回调映射。</p><CodeBlock code={`window.onFlutterCallbackPromise(\n  'cb_1',\n  JSON.stringify({\n    success: true,\n    data: { latitude: 31.2304, longitude: 121.4737 }\n  })\n);`} label="JavaScript"/>
    <h2>成功、失败与 complete</h2><p>Bridge 核心只在 Channel 不可用时 reject；原生业务失败通常仍通过 resolve 返回 <code>{`{ success: false }`}</code>，再由具体 API 决定调用 success 或 fail。complete 主要通过 Promise.finally 执行。</p>
    <div className="notice danger"><b>当前没有超时与原生 reject 通道</b><p>如果 Flutter 永不回调，对应 Promise 与 callbackId 会一直保留。生产环境建议增加超时、错误码规范与页面销毁清理机制。</p></div>
    <h2>源码级注意事项</h2><div className="riskGrid"><div><b>初始化时机</b><p>是否在 App 内只在模块加载时判断一次。Channel 若稍后才注入，API 不会自动挂载。</p></div><div><b>SSR 安全</b><p>源码直接访问 window。仅在浏览器端加载，不要在 SSR 求值阶段执行。</p></div><div><b>命名差异</b><p>导航 API 实际挂载为 FlutterNavigateTo / FlutterNavigateBack，与 README 示例不一致。</p></div><div><b>结构不统一</b><p>部分 API 检查 data.success，部分只要 Promise resolve 就算成功；Flutter 返回结构必须逐项对齐。</p></div></div>
    <h2>推荐的原生响应规范</h2><CodeBlock code={`type BridgeResponse<T> = {\n  success: boolean;\n  data?: T;\n  code?: string;\n  message?: string;\n};`}/><p>这是对现有实现的演进建议，不是当前库的统一强制类型。建议在下一协议版本中补齐错误码、超时、取消与能力探测。</p>
    <div className="nextGuide"><span>继续阅读</span><a href="/guide/lifecycle">监听页面生命周期 →</a></div>
  </article><aside className="toc"><b>本页内容</b><a href="#">请求消息</a><a href="#">响应消息</a><a href="#">错误模型</a><a href="#">注意事项</a></aside></DocsShell>;
}
