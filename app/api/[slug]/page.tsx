import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodeBlock } from "../../components/CodeBlock";
import { DocsShell } from "../../components/DocsShell";
import { apiDocs } from "../../../lib/docs";

export function generateStaticParams() { return apiDocs.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const api = apiDocs.find((item) => item.slug === slug);
  if (!api) return {};
  return { title: api.name, description: api.summary, openGraph: { title: `${api.name} · WLYD Bridge`, description: api.summary, images: [] }, twitter: { card: "summary", title: `${api.name} · WLYD Bridge`, description: api.summary, images: [] } };
}

export default async function ApiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const api = apiDocs.find((item) => item.slug === slug); if (!api) notFound();
  const index = apiDocs.findIndex((item) => item.slug === slug); const prev = apiDocs[index - 1]; const next = apiDocs[index + 1];
  return <DocsShell current={api.slug}><article className="docArticle">
    <p className="breadcrumb"><a href="/api">API 参考</a> / {api.name}</p><div className="apiTitle"><div><span className="docKicker">{api.category} API</span><h1>{api.name}</h1></div>{api.availability && <span className="availability">{api.availability}</span>}</div>
    <p className="lead">{api.summary}</p><div className="signature"><span>Native type</span><code>{api.nativeType}</code>{api.exportedAs && <small>{api.exportedAs}</small>}</div>
    <h2 id="usage">使用示例</h2><CodeBlock code={api.example}/>
    <h2 id="params">参数</h2><div className="paramTable"><div className="paramHead"><span>字段</span><span>类型</span><span>说明</span></div>{api.params.map((param, i) => <div className="paramRow" key={`${param.name}-${i}`}><span><code>{param.name}</code>{param.required && <i>必填</i>}</span><span><code>{param.type}</code></span><p>{param.description}</p></div>)}</div>
    <h2 id="return">返回与回调</h2><p>{api.returns}</p>
    <h2 id="notes">注意事项</h2><div className="notice warning"><b>实现提示</b><ul>{api.notes.map((note) => <li key={note}>{note}</li>)}</ul></div>
    <div className="pager">{prev ? <a href={`/api/${prev.slug}`}><small>← 上一个</small><b>{prev.name}</b></a> : <span/>}{next ? <a className="next" href={`/api/${next.slug}`}><small>下一个 →</small><b>{next.name}</b></a> : <span/>}</div>
  </article><aside className="toc"><b>本页内容</b><a href="#usage">使用示例</a><a href="#params">参数</a><a href="#return">返回与回调</a><a href="#notes">注意事项</a></aside></DocsShell>;
}
