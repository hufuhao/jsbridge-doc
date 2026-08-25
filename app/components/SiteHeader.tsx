"use client";

import { useEffect, useState } from "react";
import { apiDocs } from "../../lib/docs";
import { SiteLink } from "./SiteLink";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen(true); }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const results = apiDocs.filter((api) => `${api.name}${api.summary}${api.category}`.toLowerCase().includes(query.toLowerCase()));
  return <>
    <header className="topbar">
      <SiteLink className="brand" href="/"><span className="brandMark">W</span><span>WLYD Bridge</span></SiteLink>
      <nav className="topnav" aria-label="主导航"><SiteLink href="/guide/getting-started">指南</SiteLink><SiteLink href="/guide/match-driver">项目实战</SiteLink><SiteLink href="/api">API 参考</SiteLink><SiteLink href="/guide/protocol">工作原理</SiteLink></nav>
      <div className="topActions"><button className="searchButton" onClick={() => setOpen(true)}><span>⌕</span> 搜索文档 <kbd>⌘ K</kbd></button><span className="version">v0.0.39</span></div>
    </header>
    {open && <div className="searchOverlay" role="presentation" onMouseDown={() => setOpen(false)}>
      <div className="searchDialog" role="dialog" aria-modal="true" aria-label="搜索文档" onMouseDown={(e) => e.stopPropagation()}>
        <div className="searchInput"><span>⌕</span><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索 API、能力或关键词…"/><button onClick={() => setOpen(false)}>ESC</button></div>
        <div className="searchResults">{results.length ? results.map((api) => <SiteLink key={api.slug} href={`/api/${api.slug}`} onClick={() => setOpen(false)}><span><b>{api.name}</b><small>{api.summary}</small></span><em>{api.category} ↗</em></SiteLink>) : <p>没有找到相关内容</p>}</div>
      </div>
    </div>}
  </>;
}
