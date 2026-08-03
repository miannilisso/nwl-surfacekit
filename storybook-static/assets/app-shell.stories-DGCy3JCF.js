import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as l}from"./button-C19f22TL.js";import{c as o}from"./utils-DCADjnpI.js";import{c as u}from"./createLucideIcon-BtxYVZsi.js";import{C as h,a as f,b as g,d as j}from"./card-bs0XE7rL.js";import"./index-UiW3gZKV.js";import"./_commonjsHelpers-CqkleIqs.js";/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],y=u("search",v);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],k=u("settings",N);function d({topbar:r,sidebar:s,className:t,children:n,...a}){return e.jsxs("div",{"data-slot":"app-shell",className:o("flex min-h-screen flex-col bg-background text-foreground",t),...a,children:[r?e.jsx("div",{className:"border-b border-border bg-card/80 backdrop-blur",children:r}):null,e.jsxs("div",{className:"flex flex-1 overflow-hidden",children:[s?e.jsx("aside",{className:"hidden w-72 shrink-0 border-r border-border bg-sidebar p-4 text-sidebar-foreground md:block",children:s}):null,e.jsx("main",{className:"min-w-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8",children:n})]})]})}function b({title:r,eyebrow:s="Workspace",actions:t,className:n,...a}){return e.jsxs("header",{"data-slot":"app-topbar",className:o("flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6",n),...a,children:[e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"text-xs font-medium uppercase text-muted-foreground",children:s}),e.jsx("h1",{className:"truncate text-lg font-semibold",children:r})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(l,{"aria-label":"Search workspace",variant:"ghost",size:"icon-sm",children:e.jsx(y,{})}),t??e.jsx(l,{"aria-label":"Open settings",variant:"outline",size:"icon-sm",children:e.jsx(k,{})})]})]})}function x({items:r,label:s="Navigation",className:t,...n}){return e.jsxs("nav",{"data-slot":"app-sidebar","aria-label":s,className:o("space-y-4",t),...n,children:[e.jsx("div",{className:"px-2",children:e.jsx("p",{className:"text-xs font-semibold uppercase text-sidebar-foreground/60",children:s})}),e.jsx("ul",{className:"space-y-1",children:r.map(a=>e.jsx("li",{children:e.jsx("a",{href:a.href??"#","aria-current":a.active?"page":void 0,className:o("block rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",a.active&&"bg-sidebar-accent font-medium text-sidebar-accent-foreground"),children:a.label})},a.label))})]})}d.__docgenInfo={description:"",methods:[],displayName:"AppShell",props:{topbar:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},sidebar:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};x.__docgenInfo={description:"",methods:[],displayName:"AppSidebar",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ label: string; href?: string; active?: boolean }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"href",value:{name:"string",required:!1}},{key:"active",value:{name:"boolean",required:!1}}]}}],raw:"Array<{ label: string; href?: string; active?: boolean }>"},description:""},label:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"Navigation"',computed:!1}}}};b.__docgenInfo={description:"",methods:[],displayName:"AppTopbar",props:{title:{required:!0,tsType:{name:"string"},description:""},eyebrow:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"Workspace"',computed:!1}},actions:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const q={title:"SurfaceKit/Patterns/AppShell",component:d},i={render:()=>e.jsx(d,{topbar:e.jsx(b,{title:"Workspace",eyebrow:"Playground"}),sidebar:e.jsx(x,{items:[{label:"Overview",active:!0},{label:"Projects"},{label:"Reports"}]}),children:e.jsx("div",{className:"grid gap-4 md:grid-cols-3",children:["Components","Patterns","Tokens"].map(r=>e.jsxs(h,{children:[e.jsx(f,{children:e.jsx(g,{children:r})}),e.jsx(j,{children:"Production-ready shell content."})]},r))})})};var c,p,m;i.parameters={...i.parameters,docs:{...(c=i.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => <AppShell topbar={<AppTopbar title="Workspace" eyebrow="Playground" />} sidebar={<AppSidebar items={[{
    label: "Overview",
    active: true
  }, {
    label: "Projects"
  }, {
    label: "Reports"
  }]} />}>
      <div className="grid gap-4 md:grid-cols-3">
        {["Components", "Patterns", "Tokens"].map(item => <Card key={item}>
            <CardHeader>
              <CardTitle>{item}</CardTitle>
            </CardHeader>
            <CardContent>Production-ready shell content.</CardContent>
          </Card>)}
      </div>
    </AppShell>
}`,...(m=(p=i.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};const P=["Default"];export{i as Default,P as __namedExportsOrder,q as default};
