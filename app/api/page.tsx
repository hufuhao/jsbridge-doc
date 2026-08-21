import type { Metadata } from "next";
import { DocsShell } from "../components/DocsShell";
import { apiDocs } from "../../lib/docs";

export const metadata: Metadata = { title: "API 参考", description: "WLYD Bridge 全部原生 API 的参数、返回值、示例和注意事项。" };

export default function ApiIndex() {
  return <DocsShell><article className="docArticle apiIndex"><p className="breadcrumb">文档 / API 参考</p><span className="docKicker">API REFERENCE</span><h1>API 参考</h1><p className="lead">共 {apiDocs.length} 个原生能力。每个页面均按当前 TypeScript 源码整理，包括真实导出名、Native type、参数、回调行为与已知边界。</p>
    <div className="notice info"><b>调用前提</b><p>所有 API 仅在 Flutter WebView 注入 <code>window.WLYDBridge.postMessage</code> 后可用；普通浏览器中调用会进入 fail。</p></div>
    <div className="apiTable">{apiDocs.map((api) => <a key={api.slug} href={`/api/${api.slug}`}><span className="method">JS</span><span><b>{api.name}</b><small>{api.summary}</small></span><em>{api.category}</em><strong>→</strong></a>)}</div>
  </article></DocsShell>;
}
