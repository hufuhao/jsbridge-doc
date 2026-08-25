import type { Metadata } from "next";
import { DocsShell } from "../components/DocsShell";
import { SiteLink } from "../components/SiteLink";
import { apiDocs } from "../../lib/docs";

export const metadata: Metadata = { title: "API 参考", description: "WLYD Bridge 全部原生 API 的参数、返回值、示例和注意事项。" };

export default function ApiIndex() {
  return <DocsShell><article className="docArticle apiIndex"><p className="breadcrumb">文档 / API 参考</p><span className="docKicker">API REFERENCE · v0.0.39</span><h1>API 参考</h1><p className="lead">共 {apiDocs.length} 个接口页面，覆盖 Bridge 内置 API 与司机项目实际使用的 14 个 Native Handler。内容由 F-hfh-bridge、uniapp-match-driver 与 flutter_match_driver 源码交叉整理，包括参数、回包、限制和已知风险。</p>
    <div className="notice info"><b>先判断入口与运行环境</b><p>uni-app 使用 <code>uni.xxx</code> 和 Vite 插件；普通 H5 使用 <code>window.WLYDFlutterBridge</code>。完整原生 API 仅在 Flutter 注入 <code>window.WLYDBridge</code> 后挂载。司机项目的源码审计结论见<SiteLink href="/guide/match-driver">项目实战</SiteLink>。</p></div>
    <div className="apiTable">{apiDocs.map((api) => <SiteLink key={api.slug} href={`/api/${api.slug}`}><span className="method">JS</span><span><b>{api.name}</b><small>{api.summary}</small></span><em>{api.category}</em><strong>→</strong></SiteLink>)}</div>
  </article></DocsShell>;
}
