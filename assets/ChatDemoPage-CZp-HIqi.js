import{r as u,j as e}from"./vendor-react-DZBLqRoZ.js";import{j as R,o as C,a9 as P,S as $,c as N,aa as T,ab as W}from"./index-yYAevcas.js";import"./vendor-utils-CyCIFleB.js";import"./vendor-radix-l6SspY3j.js";import"./vendor-state-BcI4Ks17.js";import"./vendor-ui-1xqm2XjH.js";import"./vendor-icons-BXLcdExx.js";import"./vendor-motion-BFFxa_to.js";function J(s){const n=new TextEncoder,i=s.model??"mock-gpt-4o",l=s.chunkDelayMs??30,c=s.chunkSize??3,f=[...s.messages].reverse().find(r=>r.role==="user"),m=_(f?.content??"");return new ReadableStream({start(r){const d=`chatcmpl-${Math.random().toString(36).slice(2,12)}`,a=Math.floor(Date.now()/1e3),t={id:d,object:"chat.completion.chunk",created:a,model:i,choices:[{index:0,delta:{role:"assistant"},finish_reason:null}]};r.enqueue(n.encode(`data: ${JSON.stringify(t)}

`));let h=0,b=!1;const y=()=>{b=!0,clearInterval(p);try{r.close()}catch{}};s.signal?.addEventListener("abort",y,{once:!0});const p=setInterval(()=>{if(b)return;if(h>=m.length){const E={id:d,object:"chat.completion.chunk",created:a,model:i,choices:[{index:0,delta:{},finish_reason:"stop"}]};r.enqueue(n.encode(`data: ${JSON.stringify(E)}

`)),r.enqueue(n.encode(`data: [DONE]

`)),clearInterval(p),r.close();return}const j=m.slice(h,h+c);h+=c;const v={id:d,object:"chat.completion.chunk",created:a,model:i,choices:[{index:0,delta:{content:j},finish_reason:null}]};r.enqueue(n.encode(`data: ${JSON.stringify(v)}

`))},l)}})}function _(s){const n=s.toLowerCase();return/(你好|hi|hello|嗨)/.test(n)?`你好！我是 Workbench AI，一个面向高校场景的多智能体助手。

我可以帮你：
- 📚 学业辅导（知识图谱、解题思路）
- 💚 心理支持（情绪疏导、压力管理）
- 📋 教务咨询（请假、选课、奖学金）
- ✨ 通用问答（写作、翻译、规划）

请告诉我你想聊什么？`:/(数据|学习|课程|知识|考试|作业|论文|编程|代码|数学|英语|物理|化学|生物|历史|政治|语文)/.test(n)?`关于"${s.trim()}"，我从三个维度帮你拆解：

## 1. 知识框架
梳理相关概念的层级关系和依赖图谱，建立完整的认知地图。

## 2. 方法路径
- **基础阶段**：理解定义、定理、典型例题
- **进阶阶段**：归纳题型、提炼套路、刻意练习
- **融会贯通**：跨章节联想、跨学科迁移

## 3. 行动建议
1. 每天 30 分钟专项训练
2. 错题本：归类、重做、总结
3. 每周一次综合复盘

> 想要更具体的指导，请告诉我你的学习目标和当前水平。`:/(心情|情绪|压力|焦虑|抑郁|难过|失眠|睡不着|想死|自杀|自残|活不下去|心理)/.test(n)?`我听到你最近不太舒服，这很正常，先深呼吸一下。

## 短期应对
- 🧘 4-7-8 呼吸法：吸气 4 秒、屏息 7 秒、呼气 8 秒
- 📝 把烦恼写下来，外化情绪
- 🚶 出门走走 10 分钟

## 中期调整
- 保持规律作息，固定起床时间
- 减少咖啡因摄入，尤其是下午
- 每天给自己 30 分钟"无目的"时间

## 重要提醒
如果你持续两周以上情绪低落，或有自伤想法，请**立即联系学校心理咨询中心**：
- 📞 校内热线：1234-5678
- 🏥 24 小时危机干预：400-161-9995

你愿意先聊聊具体是什么事情让你不舒服吗？`:/(请假|选课|退课|成绩|奖学金|学籍|转专业|考试|缓考|补考|休学|复学|教务)/.test(n)?`关于"${s.trim()}"，根据学校最新规定：

## 办理流程
1. **登录教务系统**：http://jw.example.edu
2. **在线申请**：填写申请表 + 上传证明材料
3. **辅导员审核**：1-2 个工作日
4. **院系审批**：2-3 个工作日
5. **教务处备案**：完成后系统自动通知

## 常见注意事项
- 请假超过 3 天需附医院证明
- 考试期间请假需办理缓考手续
- 奖学金评审需提前 30 天提交材料

> 如需加急处理，请联系辅导员或院系教务老师。`:/(代码|编程|python|javascript|js|ts|react|vue|api|bug|报错|异常|sql|git|docker)/.test(n)?`这是个很棒的技术问题！

## 排查思路
1. **复现问题**：最小化复现代码 + 准确报错信息
2. **看错误栈**：定位到具体文件和行号
3. **查文档/源码**：理解相关 API 的预期行为
4. **打印调试**：在关键位置添加日志
5. **二分定位**：逐步缩小问题范围

## 推荐工具
- **调试**：浏览器 DevTools / VS Code Debugger
- **网络**：Charles / Wireshark
- **性能**：Lighthouse / Chrome Performance

\`\`\`bash
# 常用排查命令
git log --oneline -20     # 查看最近改动
npm run dev --verbose     # 详细启动日志
\`\`\`

> 把你的代码和报错贴出来，我可以帮你具体分析。`:`收到你的问题："${s.trim()}"

我来梳理一下要点：

## 关键信息
- 这是一个需要进一步澄清的问题
- 建议先明确具体场景和目标
- 拆解为可执行的小步骤

## 我的建议
1. 补充更多上下文，让问题更具体
2. 列出你已经尝试过的方法
3. 明确期望的结果

你愿意从哪个方向继续？`}async function*U(s){const n=s.getReader(),i=new TextDecoder;let l="";try{for(;;){const{done:c,value:f}=await n.read();if(c)break;l+=i.decode(f,{stream:!0});const m=l.split(`

`);l=m.pop()??"";for(const r of m){const d=r.trim();if(!d.startsWith("data:"))continue;const a=d.slice(5).trim();if(a==="[DONE]")return;try{yield JSON.parse(a)}catch{}}}}finally{n.releaseLock()}}const L=()=>Math.random().toString(36).slice(2,12);function G(s={}){const{model:n,systemPrompt:i,initialMessages:l=[],onError:c,onFinish:f,chunkDelayMs:m,chunkSize:r}=s,[d,a]=u.useState(l),[t,h]=u.useState(""),[b,y]=u.useState(!1),p=u.useRef(null),j=u.useCallback(()=>{p.current?.abort(),p.current=null,y(!1)},[]),v=u.useCallback(async k=>{if(!k.trim()||b)return;const w={id:L(),role:"user",content:k,createdAt:Date.now()},S=L(),z={id:S,role:"assistant",content:"",createdAt:Date.now()};a(o=>[...o,w,z]),y(!0);const D=[];i&&D.push({role:"system",content:i});for(const o of[...d,w])(o.role==="user"||o.role==="assistant")&&D.push({role:o.role,content:o.content});const M=new AbortController;p.current=M;try{const o=J({messages:D,model:n,signal:M.signal,chunkDelayMs:m,chunkSize:r});for await(const g of U(o)){const x=g.choices[0]?.delta?.content;if(x&&a(A=>A.map(I=>I.id===S?{...I,content:I.content+x}:I)),g.choices[0]?.finish_reason==="stop")break}a(g=>{const x=g.find(A=>A.id===S);return x&&f?.(x),g})}catch(o){if(o instanceof DOMException&&o.name==="AbortError")return;c?.(o instanceof Error?o:new Error(String(o))),a(g=>g.filter(x=>x.id!==S||x.content!==""))}finally{y(!1),p.current=null}},[b,d,n,i,c,f,m,r]),E=u.useCallback(k=>{k?.preventDefault();const w=t.trim();w&&(h(""),v(w))},[t,v]),O=u.useCallback(()=>{j(),a(l),h("")},[j,l]);return{messages:d,input:t,setInput:h,isLoading:b,handleSubmit:E,append:v,stop:j,reset:O,setMessages:a}}const K=["你好，介绍一下你自己","数据结构有哪些核心知识点？","最近压力很大，怎么调节？","请假超过 3 天的流程是什么？","帮我写一个 Python 排序算法"];function Z(){const{messages:s,input:n,setInput:i,handleSubmit:l,isLoading:c,stop:f,reset:m}=G({model:"mock-gpt-4o",systemPrompt:"你是 Workbench AI，一个面向高校的多智能体助手。请用中文回答，简洁专业。"}),r=u.useRef(null),[d,a]=u.useState(!0);return u.useEffect(()=>{const t=setInterval(()=>a(h=>!h),500);return()=>clearInterval(t)},[]),u.useEffect(()=>{r.current&&(r.current.scrollTop=r.current.scrollHeight)},[s]),e.jsxs("div",{className:"mx-auto flex h-[calc(100vh-3.5rem-3rem)] max-w-3xl flex-col rounded-lg border border-border bg-card/30",children:[e.jsxs("header",{className:"flex h-14 items-center justify-between border-b border-border bg-card/50 px-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-blue-500 text-white",children:e.jsx(R,{className:"h-4 w-4",weight:"bold"})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-sm font-semibold",children:"Workbench AI · Mock Stream"}),e.jsx("p",{className:"text-[10px] text-muted-foreground",children:"借皮 OpenAI SSE 协议 · useChatStream hook 演示"})]})]}),e.jsx(C,{variant:"ghost",size:"icon",className:"h-8 w-8",onClick:m,"aria-label":"清空对话",children:e.jsx(P,{className:"h-3.5 w-3.5"})})]}),e.jsx($,{className:"flex-1",ref:r,children:e.jsxs("div",{className:"flex flex-col gap-4 p-4",children:[s.length===0&&e.jsxs("div",{className:"flex h-full min-h-[400px] flex-col items-center justify-center gap-4 text-center",children:[e.jsx("div",{className:"text-5xl",children:"✨"}),e.jsx("h2",{className:"text-lg font-semibold",children:"开始对话"}),e.jsx("p",{className:"max-w-md text-sm text-muted-foreground",children:"模拟 OpenAI ChatCompletion 流式 API。输入消息后会看到字符级流式输出，可随时中断。"}),e.jsx("div",{className:"flex flex-wrap justify-center gap-2",children:K.map(t=>e.jsx(C,{variant:"outline",size:"sm",onClick:()=>i(t),className:"h-7 text-[11px]",children:t},t))})]}),s.map(t=>e.jsxs("div",{className:N("flex gap-3",t.role==="user"?"flex-row-reverse":"flex-row"),children:[e.jsx("div",{className:N("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",t.role==="user"?"bg-primary text-primary-foreground":"bg-gradient-to-br from-violet-500 to-blue-500 text-white"),children:t.role==="user"?"U":"AI"}),e.jsx("div",{className:N("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",t.role==="user"?"bg-primary text-primary-foreground":"bg-muted text-foreground"),children:e.jsxs("div",{className:"whitespace-pre-wrap",children:[t.content,t.role==="assistant"&&c&&t.id===s[s.length-1]?.id&&e.jsx("span",{className:N("ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-current align-middle",d?"opacity-100":"opacity-0")})]})})]},t.id)),c&&s[s.length-1]?.content===""&&e.jsxs("div",{className:"flex items-center gap-2 text-xs text-muted-foreground",children:[e.jsxs("span",{className:"flex gap-0.5",children:[e.jsx("span",{className:"h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary"}),e.jsx("span",{className:"h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary",style:{animationDelay:"0.2s"}}),e.jsx("span",{className:"h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary",style:{animationDelay:"0.4s"}})]}),"AI 正在思考..."]})]})}),e.jsxs("form",{onSubmit:l,className:"flex items-end gap-2 border-t border-border bg-card/50 p-3",children:[e.jsx("textarea",{value:n,onChange:t=>i(t.target.value),onKeyDown:t=>{t.key==="Enter"&&!t.shiftKey&&(t.preventDefault(),l())},placeholder:"输入消息，Enter 发送，Shift+Enter 换行...",rows:1,disabled:c,className:N("flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm","placeholder:text-muted-foreground","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2","disabled:opacity-50","max-h-32 min-h-[36px]")}),c?e.jsx(C,{type:"button",size:"icon",variant:"destructive",onClick:f,className:"h-9 w-9 shrink-0","aria-label":"停止生成",children:e.jsx(T,{className:"h-4 w-4",weight:"fill"})}):e.jsx(C,{type:"submit",size:"icon",disabled:!n.trim(),className:"h-9 w-9 shrink-0","aria-label":"发送",children:e.jsx(W,{className:"h-4 w-4",weight:"bold"})})]})]})}export{Z as default};
