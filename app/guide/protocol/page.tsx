import type { Metadata } from "next";
import { CodeBlock } from "../../components/CodeBlock";
import { DocsShell } from "../../components/DocsShell";
import { SiteLink } from "../../components/SiteLink";

export const metadata: Metadata = { title: "Bridge 协议", description: "理解 WLYD Bridge 的消息、回调和错误模型。" };
export const dynamic = "force-static";

const message = `{
  "type": "getLocation",
  "data": {},
  "callbackId": "cb_1",
  "version": "1.0"
}`;

export default function Protocol() {
  return <DocsShell current="protocol"><article className="docArticle"><p className="breadcrumb">指南 / Bridge 协议</p><span className="docKicker">BRIDGE PROTOCOL · v1.0</span><h1>一次调用如何完成</h1><p className="lead">无论入口是 uni.xxx、WLYDFlutterBridge 还是 callNative，最终都会进入同一套请求—回调协议。每次调用生成唯一 ID，经由 Flutter Channel 发出；原生完成后用这个 ID 找回对应 Promise。</p>
    <div className="protocolFlow"><div><b>01</b><span>H5 调用</span><small>uni.getLocation(options)</small></div><i>→</i><div><b>02</b><span>消息入栈</span><small>WLYDBridge.postMessage</small></div><i>→</i><div><b>03</b><span>原生处理</span><small>dispatch by type</small></div><i>→</i><div><b>04</b><span>精确回调</span><small>callbackId → Promise</small></div></div>
    <h2>请求消息</h2><CodeBlock code={message} label="JSON"/><div className="paramTable compactTable"><div className="paramHead"><span>字段</span><span>类型</span><span>说明</span></div><div className="paramRow"><span><code>type</code></span><span><code>string</code></span><p>原生方法标识，如 getLocation、updateNavTitle、back。</p></div><div className="paramRow"><span><code>data</code></span><span><code>object</code></span><p>移除 success、fail、complete 后的业务参数。</p></div><div className="paramRow"><span><code>callbackId</code></span><span><code>string</code></span><p>当前页面内递增生成，例如 cb_1。</p></div><div className="paramRow"><span><code>version</code></span><span><code>string</code></span><p>当前固定为 1.0，建议原生端校验兼容性。</p></div></div>
    <h2>响应消息</h2><p>Flutter 端处理完成后执行下列 JavaScript。Bridge 会尝试解析字符串 data，找到 Promise 并 resolve，最后清理回调映射。</p><CodeBlock code={`window.onFlutterCallbackPromise(\n  'cb_1',\n  JSON.stringify({\n    success: true,\n    data: { latitude: 31.2304, longitude: 121.4737 }\n  })\n);`} label="JavaScript"/>
    <h2>两种原生回包</h2><p>App 当前同时存在两类 Handler：<code>registerApi</code> 由调度器包装为 <code>{`{ status, data, error }`}</code>；<code>registerBsHandler</code> 会原样返回业务 Map，因此业务 Handler 自己必须提供 <code>{`{ success, message, data? }`}</code>。<code>native / callNative</code> 会尝试将两者统一为 <code>{`{ success, data?, message? }`}</code>。</p>
    <div className="notice warning"><b>业务 Handler 不会被自动判定成功</b><p>返回空对象或只有 message 时，Bridge 会得到 <code>success:false</code> 与 <code>unknown native response format</code>。司机 App 的 <code>completeLearnDate</code>、<code>pushToWaybillDetails</code>、<code>pushToWaybillCertificate</code> 当前存在这个问题。</p></div>
    <h2>成功、失败与 complete</h2><p>Bridge 核心只在 Channel 不可用时 reject；原生业务失败通常仍通过 resolve 返回，再由具体 API 判断 success/status 并调用 success 或 fail。complete 主要通过 Promise.finally 执行。</p>
    <div className="notice danger"><b>当前没有超时与原生 reject 通道</b><p>如果 Flutter 永不回调，对应 Promise 与 callbackId 会一直保留。生产环境建议增加超时、错误码规范与页面销毁清理机制。</p></div>
    <h2>源码级注意事项</h2><div className="riskGrid"><div><b>初始化时机</b><p>App 环境只在模块加载时判断一次。Channel 若稍后才注入，完整 API 不会自动重新挂载。</p></div><div><b>uni-app 生产构建</b><p>必须配置 vite-plugin，否则官方静态 import 会绕过 window.uni 的覆盖。</p></div><div><b>同步与异步混合</b><p>SystemInfo 与 Storage 在 H5 回退时同步、走 Bridge 时异步，跨模式建议统一 await。</p></div><div><b>结构仍未完全统一</b><p>部分 API 检查 data.success，部分只要 Promise resolve 就算成功；Flutter 返回结构仍需逐项对齐。</p></div></div>
    <h2>推荐的原生响应规范</h2><CodeBlock code={`type BridgeResponse<T> = {\n  success: boolean;\n  data?: T;\n  code?: string;\n  message?: string;\n};`}/><p>这是对现有实现的演进建议，不是当前库的统一强制类型。建议在下一协议版本中补齐错误码、超时、取消与能力探测。</p>
    <div className="nextGuide"><span>继续阅读</span><SiteLink href="/guide/lifecycle">监听页面生命周期 →</SiteLink></div>
  </article><aside className="toc"><b>本页内容</b><a href="#">请求消息</a><a href="#">响应消息</a><a href="#">错误模型</a><a href="#">注意事项</a></aside></DocsShell>;
}
