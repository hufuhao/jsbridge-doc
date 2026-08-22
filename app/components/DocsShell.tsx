import { navGroups } from "../../lib/docs";
import { SiteHeader } from "./SiteHeader";

export function DocsShell({ children, current }: { children: React.ReactNode; current?: string }) {
  return <><SiteHeader/><div className="docsLayout">
    <aside className="sidebar">
      <div className="sidebarGroup"><h3>开始</h3><a className={current === "getting-started" ? "active" : ""} href="/guide/getting-started">快速开始</a><a className={current === "match-driver" ? "active" : ""} href="/guide/match-driver">司机项目实战</a><a className={current === "protocol" ? "active" : ""} href="/guide/protocol">Bridge 协议</a><a className={current === "lifecycle" ? "active" : ""} href="/guide/lifecycle">生命周期</a></div>
      {navGroups.map((group) => <div className="sidebarGroup" key={group.label}><h3>{group.label}</h3>{group.items.map((api) => <a className={current === api.slug ? "active" : ""} key={api.slug} href={`/api/${api.slug}`}>{api.name}</a>)}</div>)}
    </aside>
    <main className="docsMain">{children}</main>
  </div></>;
}
