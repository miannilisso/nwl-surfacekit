import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{c as a}from"./utils-DCADjnpI.js";function n({className:e,...t}){return r.jsx("div",{"data-slot":"card",className:a("bg-card text-card-foreground rounded-2xl border shadow-sm",e),...t})}function i({className:e,...t}){return r.jsx("div",{"data-slot":"card-header",className:a("flex flex-col gap-2 p-6",e),...t})}function l({className:e,...t}){return r.jsx("h3",{"data-slot":"card-title",className:a("text-lg font-semibold",e),...t})}function m({className:e,...t}){return r.jsx("p",{"data-slot":"card-description",className:a("text-muted-foreground text-sm",e),...t})}function p({className:e,...t}){return r.jsx("div",{"data-slot":"card-content",className:a("p-6 pt-0",e),...t})}function C({className:e,...t}){return r.jsx("div",{"data-slot":"card-footer",className:a("flex items-center p-6 pt-0",e),...t})}n.__docgenInfo={description:"",methods:[],displayName:"Card"};p.__docgenInfo={description:"",methods:[],displayName:"CardContent"};m.__docgenInfo={description:"",methods:[],displayName:"CardDescription"};C.__docgenInfo={description:"",methods:[],displayName:"CardFooter"};i.__docgenInfo={description:"",methods:[],displayName:"CardHeader"};l.__docgenInfo={description:"",methods:[],displayName:"CardTitle"};const h={title:"SurfaceKit/Card",component:n,args:{children:"SurfaceKit Card"}},o={render:e=>React.createElement(n,{...e},React.createElement(i,null,React.createElement(l,null,"Card title"),React.createElement(m,null,"A short description for the card.")),React.createElement(p,null,React.createElement("p",null,"This is the card body content.")),React.createElement(C,null,"Footer content"))};var d,s,c;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: (args: React.ComponentProps<typeof Card>) => <Card {...args}>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>A short description for the card.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card body content.</p>
      </CardContent>
      <CardFooter>Footer content</CardFooter>
    </Card>
}`,...(c=(s=o.parameters)==null?void 0:s.docs)==null?void 0:c.source}}};const x=["Default"];export{o as Default,x as __namedExportsOrder,h as default};
