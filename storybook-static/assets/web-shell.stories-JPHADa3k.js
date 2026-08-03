import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as g,a as y,b as j,d as N}from"./card-bs0XE7rL.js";import{B as p}from"./button-C19f22TL.js";import{c as i}from"./utils-DCADjnpI.js";import{c as w}from"./createLucideIcon-BtxYVZsi.js";import"./index-UiW3gZKV.js";import"./_commonjsHelpers-CqkleIqs.js";/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],S=w("arrow-right",v);function d({header:r,footer:t,className:s,children:a,...l}){return e.jsxs("div",{"data-slot":"web-shell",className:i("flex min-h-screen flex-col bg-background text-foreground",s),...l,children:[r?e.jsx("div",{className:"border-b border-border bg-card/80 backdrop-blur",children:r}):null,e.jsx("main",{className:"flex-1",children:a}),t?e.jsx("footer",{className:"border-t border-border bg-background px-6 py-5",children:t}):null]})}function h({title:r,links:t=[],cta:s,className:a,...l}){return e.jsxs("header",{"data-slot":"web-shell-header",className:i("mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-6 px-6 py-3",a),...l,children:[e.jsx("a",{href:"/",className:"text-base font-semibold",children:r}),e.jsx("nav",{"aria-label":"Primary",className:"hidden items-center gap-5 text-sm text-muted-foreground sm:flex",children:t.map(n=>e.jsx("a",{href:n.href,className:"transition-colors hover:text-foreground",children:n.label},n.href))}),s??e.jsx(p,{render:e.jsx("a",{href:"/playground"}),nativeButton:!1,size:"sm",variant:"outline",children:"Playground"})]})}function f({links:r,className:t,...s}){return e.jsxs("div",{"data-slot":"web-shell-footer",className:i("mx-auto flex w-full max-w-6xl flex-col gap-3 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between",t),...s,children:[e.jsx("p",{children:"© 2026 Naneware Labs"}),e.jsx("div",{className:"flex flex-wrap gap-4",children:r.map(a=>e.jsx("a",{href:a.href,className:"hover:text-foreground",children:a.label},a.href))})]})}function x({eyebrow:r,title:t,description:s,action:a,className:l,children:n,...b}){return e.jsx("section",{"data-slot":"web-hero",className:i("border-b border-border",l),...b,children:e.jsxs("div",{className:"mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_24rem]",children:[e.jsxs("div",{className:"max-w-3xl space-y-6",children:[r?e.jsx("p",{className:"text-sm font-medium text-primary",children:r}):null,e.jsx("h1",{className:"text-4xl font-semibold tracking-tight sm:text-5xl",children:t}),e.jsx("p",{className:"max-w-2xl text-base leading-7 text-muted-foreground",children:s}),a??e.jsxs(p,{render:e.jsx("a",{href:"/playground"}),nativeButton:!1,children:["Open playground",e.jsx(S,{"data-icon":"inline-end"})]})]}),n?e.jsx("div",{className:"min-w-0",children:n}):null]})})}x.__docgenInfo={description:"",methods:[],displayName:"WebHero",props:{eyebrow:{required:!1,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},description:{required:!0,tsType:{name:"string"},description:""},action:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};d.__docgenInfo={description:"",methods:[],displayName:"WebShell",props:{header:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},footer:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};f.__docgenInfo={description:"",methods:[],displayName:"WebShellFooter",props:{links:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ label: string; href: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"href",value:{name:"string",required:!0}}]}}],raw:"Array<{ label: string; href: string }>"},description:""}}};h.__docgenInfo={description:"",methods:[],displayName:"WebShellHeader",props:{title:{required:!0,tsType:{name:"string"},description:""},links:{required:!1,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ label: string; href: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"href",value:{name:"string",required:!0}}]}}],raw:"Array<{ label: string; href: string }>"},description:"",defaultValue:{value:"[]",computed:!1}},cta:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const H={title:"SurfaceKit/Patterns/WebShell",component:d},o={render:()=>e.jsx(d,{header:e.jsx(h,{title:"SurfaceKit",links:[{label:"Components",href:"/marketing"},{label:"Playground",href:"/playground"}]}),footer:e.jsx(f,{links:[{label:"Docs",href:"/docs"},{label:"Pricing",href:"/pricing"},{label:"About",href:"/about"}]}),children:e.jsx(x,{eyebrow:"Naneware Labs",title:"SurfaceKit",description:"A production-oriented component system for Next.js product surfaces.",children:e.jsxs(g,{children:[e.jsx(y,{children:e.jsx(j,{children:"Shell preview"})}),e.jsx(N,{children:"Marketing routes use this web shell."})]})})})};var c,m,u;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => <WebShell header={<WebShellHeader title="SurfaceKit" links={[{
    label: "Components",
    href: "/marketing"
  }, {
    label: "Playground",
    href: "/playground"
  }]} />} footer={<WebShellFooter links={[{
    label: "Docs",
    href: "/docs"
  }, {
    label: "Pricing",
    href: "/pricing"
  }, {
    label: "About",
    href: "/about"
  }]} />}>
      <WebHero eyebrow="Naneware Labs" title="SurfaceKit" description="A production-oriented component system for Next.js product surfaces.">
        <Card>
          <CardHeader>
            <CardTitle>Shell preview</CardTitle>
          </CardHeader>
          <CardContent>Marketing routes use this web shell.</CardContent>
        </Card>
      </WebHero>
    </WebShell>
}`,...(u=(m=o.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};const A=["Default"];export{o as Default,A as __namedExportsOrder,H as default};
