import type { Metadata } from "next";
import { CodeBlock } from "../../components/CodeBlock";
import { DocsShell } from "../../components/DocsShell";
import { lifecycleHooks } from "../../../lib/docs";

export const metadata: Metadata = { title: "生命周期", description: "WLYD Bridge 生命周期钩子的注册、触发和注意事项。" };

export default function Lifecycle() {
  return <DocsShell current="lifecycle"><article className="docArticle"><p className="breadcrumb">指南 / 生命周期</p><span className="docKicker">LIFECYCLE</span><h1>同步 Flutter 页面状态</h1><p className="lead">Bridge 暴露 7 个注册函数。Flutter 通过全局 <code>flutterLifeCycleListener(eventName)</code> 广播事件，H5 中同名钩子会依注册顺序执行。</p>
    <CodeBlock code={`// ESM：uni-app 与普通 H5 均可\nimport { onShow, onHide, onDestroy } from\n  '@wlydfe/flutter-bridge';\n\nonShow(() => refreshPageData());\nonHide(() => pauseVideo());\nonDestroy(() => releaseResources());\n\n// 普通 H5 也可使用全局入口\nwindow.WLYDFlutterBridge?.onShow?.(() => refreshPageData());`}/>
    <h2>可用钩子</h2><div className="hookList">{lifecycleHooks.map(([name, desc], index) => <div key={name}><span>{String(index + 1).padStart(2, "0")}</span><code>{name}</code><p>{desc}</p></div>)}</div>
    <h2>Flutter 如何触发</h2><CodeBlock code={`controller.runJavaScript(\n  "window.flutterLifeCycleListener('onShow')"\n);`} label="Dart · 概念示例"/>
    <div className="notice warning"><b>事件名必须完全匹配</b><p>支持值为 onPageCreated、onResume、onPause、onLoad、onShow、onHide、onDestroy。未知事件不会触发任何函数。</p></div>
    <h2>注意事项</h2><ul className="checklist"><li>只有模块加载时已经检测到 WLYDBridge，才会创建全局 listener。</li><li>App 外注册是 no-op，不会触发原生生命周期。</li><li>当前 API 不返回取消订阅函数；避免在重复渲染中多次注册相同回调。</li><li>单个 hook 抛异常时会中断该事件后续回调，业务回调内部应自行兜底。</li><li>页面销毁时优先停止计时器、媒体、定位监听与未完成网络请求。</li></ul>
    <div className="nextGuide"><span>查找能力</span><a href="/api">浏览全部 API →</a></div>
  </article><aside className="toc"><b>本页内容</b><a href="#">使用方式</a><a href="#">可用钩子</a><a href="#">Flutter 触发</a><a href="#">注意事项</a></aside></DocsShell>;
}
