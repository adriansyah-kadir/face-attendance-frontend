(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[578],{23831:(e,t,n)=>{Promise.resolve().then(n.bind(n,28865))},61086:(e,t,n)=>{"use strict";n.d(t,{N:()=>s});var i=n(6719);let a=null;function s(){return a=null!=a?a:new i.A("https://alyijvsqnohukelkwhgu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFseWlqdnNxbm9odWtlbGt3aGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1ODYwNzYsImV4cCI6MjA1MDE2MjA3Nn0.FESZqJzs4FnNdxhoWrNXNczU-rjHLtwPfm8P9qZhNpU")}},32092:(e,t,n)=>{"use strict";n.d(t,{O:()=>s});var i=n(12115),a=n(61086);function s(){let[e,t]=(0,i.useState)({});async function n(){let{data:n}=await (0,a.N)().from("settings").select();t(()=>{var t;return null!==(t=null==n?void 0:n.reduce((e,t)=>({...e,[t.key]:t}),e))&&void 0!==t?t:e})}return(0,i.useEffect)(()=>{n();let e=(0,a.N)().channel("settings").on("postgres_changes",{event:"*",schema:"public",table:"settings"},e=>{"UPDATE"===e.eventType&&t(t=>({...t,[e.new.key]:e.new}))}).subscribe();return()=>{e.unsubscribe()}},[]),e}},70094:(e,t,n)=>{"use strict";n.d(t,{F:()=>a,M:()=>s});var i=n(61086);function a(e){if(!e)return;if(e.startsWith("http"))return e;let[t,...n]=e.split("/");return(0,i.N)().storage.from(t).getPublicUrl(n.join("/")).data.publicUrl}async function s(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];for(let e of t.filter(e=>null!=e).map(e=>{if(e.startsWith("http"))return;let[t,...n]=e.split("/");if(t.length&&n.length)return{bucket:t,nodes:n}}).filter(e=>void 0!==e))try{await (0,i.N)().storage.from(e.bucket).remove([e.nodes.join("/")])}catch(e){console.error(e)}}},28865:(e,t,n)=>{"use strict";n.d(t,{default:()=>M});var i=n(95155),a=n(69623),s=n(79020),r=n(77803),l=n(12115),c=n(43025),o=n(42008);function d(e){var t;let n=function(e){let[t,n]=(0,l.useState)(void 0);async function i(){(await navigator.mediaDevices.getUserMedia(e)).getTracks()[0].stop(),n(await navigator.mediaDevices.enumerateDevices())}return(0,l.useEffect)(()=>{i().catch(e=>{console.error(e),alert("gagal mendapatkan informasi media devices")})},[]),t}({video:!0});return(0,i.jsx)(c.d,{...e,onSelectionChange:t=>{var i,a;let s=Array.from(t),r=null==n?void 0:n.filter(e=>s.includes(e.deviceId));null===(i=e.onSelection)||void 0===i||i.call(void 0,null==r?void 0:r.at(0)),null===(a=e.onSelections)||void 0===a||a.call(void 0,r)},items:null!==(t=null==n?void 0:n.filter(e=>!!e.deviceId))&&void 0!==t?t:[],isLoading:void 0===n,children:e=>(0,i.jsx)(o.y,{children:e.label},e.deviceId)})}var u=n(35435),v=n(91637),f=n(3148),h=n(61086);function m(){let[e,t]=(0,l.useState)({});return(0,l.useEffect)(()=>{(0,h.N)().from("profiles").select("*").then(e=>{t(()=>{var t,n;return null!==(n=null===(t=e.data)||void 0===t?void 0:t.reduce((e,t)=>({...e,[t.id]:t}),{}))&&void 0!==n?n:{}})})},[]),e}var g=n(70094),p=n(21567),x=n(42966),S=n(47684),b=n(25683),j=n(26424),w=n(51055),y=n(12475);function E(){let e=m(),t=function(){let[e,t]=(0,l.useState)([]);async function n(){let{data:e}=await (0,h.N)().from("attendances").select();t(null!=e?e:[])}return(0,l.useEffect)(()=>{n();let e=(0,h.N)().channel("attendances").on("postgres_changes",{event:"INSERT",schema:"public",table:"attendances"},async e=>{t(t=>[...t,e.new])}).subscribe();return()=>{e.unsubscribe()}},[]),e}(),n=(0,l.useMemo)(()=>t.filter(e=>{let t=y.c9.fromISO(e.created_at).setZone("Asia/Makassar");return y.c9.now().setZone("Asia/Makassar").toISODate()===t.toISODate()}),[t]);return(0,i.jsxs)(x.H,{className:"px-5 pb-5",children:[(0,i.jsx)("h3",{className:"text-xl mb-5",children:"Live data"}),(0,i.jsx)("div",{className:"flex flex-col gap-2 z-[-1]",children:(0,i.jsx)(b.N,{mode:"popLayout",children:n.map(t=>{var n;return(0,i.jsx)(j.P.div,{layout:!0,initial:{opacity:0,x:-400,scale:.5},animate:{opacity:1,x:0,scale:1},exit:{opacity:0,x:200,scale:1.2},transition:{duration:.6,type:"spring"},children:(0,i.jsxs)(a.Z,{className:"flex flex-row w-fit overflow-visible max-w-none",children:[(0,i.jsx)(s.d,{className:"w-fit",children:(0,i.jsx)("img",{src:(0,g.F)(t.data instanceof Object&&"image"in t.data?null===(n=t.data.image)||void 0===n?void 0:n.toString():""),width:50})}),(0,i.jsxs)(r.U,{className:"flex-shrink-0 w-fit",children:[(0,i.jsx)("h4",{children:(0,p.Rp)(e,[t.profile_id,"name"],"...")}),(0,i.jsx)("p",{children:new Date(t.created_at).toLocaleString("id")}),(0,i.jsxs)("p",{children:[(100*(0,p.Rp)(t.data,["similarity"],0)).toFixed(2),"%"]})]}),(0,i.jsx)(S.Z,{className:"items-start",children:(0,i.jsx)(u.T,{variant:"light",size:"sm",isIconOnly:!0,children:(0,i.jsx)(w.A,{size:18})})})]})},t.id)})})})]})}var N=n(43415);class L{static fromArray(e){return new L(e[0],e[1],e[2],e[3],e[5],e[4])}constructor(e,t,n,i,a,s){this.topx=e,this.topy=t,this.botx=n,this.boty=i,this.score=a,this.id=s}}var C=n(32092),I=n(52043),k=n(72366),z=n(92807),A=n(73239),O=n(48617),D=n(41244),R=n.n(D),_=n(30814);function F(e){let t=function(e){let[t,n]=(0,l.useState)(),[i,a]=(0,l.useState)(null==t?void 0:t.iceGatheringState),[s,r]=(0,l.useState)(null==t?void 0:t.iceConnectionState),[c,o]=(0,l.useState)([]),[d,u]=(0,l.useState)([]),[v,f]=(0,l.useState)([]),[h,m]=(0,l.useState)([]),[g,p]=(0,l.useState)(!1),[x,S]=(0,l.useState)(null==t?void 0:t.signalingState),[b,j]=(0,l.useState)(null==t?void 0:t.connectionState),w=(0,l.useCallback)(function(e){e&&e.getTracks().forEach(n=>null==t?void 0:t.addTrack(n,e))},[t]);function y(){console.debug("iceGatheringState",this.iceGatheringState),a(this.iceGatheringState)}function E(){console.debug("iceConnectionState",this.iceConnectionState),r(this.iceConnectionState)}function N(e){let t=e.candidate;t&&(console.debug("iceCandidate",t),o(e=>[...e,t]))}function L(e){console.debug("iceCandidateError",e),u(t=>[...t,e])}function C(e){console.debug("track",e),f(t=>[...t,e])}function I(e){console.debug("dataChannel",e.channel),m(t=>[...t,e.channel])}function k(){console.debug("negotiationNeeded"),p(!0)}function z(){console.debug("signalingState",this.signalingState),S(this.signalingState)}function A(){console.debug("connectionState",this.connectionState),j(this.connectionState)}return(0,l.useEffect)(()=>{let e=(RTCPeerConnection,new RTCPeerConnection(void 0));return e.addEventListener("icegatheringstatechange",y),e.addEventListener("iceconnectionstatechange",E),e.addEventListener("icecandidate",N),e.addEventListener("icecandidateerror",L),e.addEventListener("track",C),e.addEventListener("datachannel",I),e.addEventListener("negotiationneeded",k),e.addEventListener("signalingstatechange",z),e.addEventListener("connectionstatechange",A),n(e),()=>{e.removeEventListener("icegatheringstatechange",y),e.removeEventListener("iceconnectionstatechange",E),e.removeEventListener("icecandidate",N),e.removeEventListener("icecandidateerror",L),e.removeEventListener("track",C),e.removeEventListener("datachannel",I),e.removeEventListener("negotiationneeded",k),e.removeEventListener("signalingstatechange",z),e.removeEventListener("connectionstatechange",A),e.close(),n(void 0)}},[]),{pc:t,iceGatheringState:i,iceConnectionState:s,iceCandidates:c,iceCandidateErrors:d,tracks:v,channels:h,negotiationNeeded:g,signalingState:x,connectionState:b,addStream:w}}(),n=(0,C.O)(),a=function(){let[e,t]=(0,l.useState)([]),[n,i]=(0,l.useState)(),a=N.z.object({boxes:N.z.array(N.z.array(N.z.number()).min(4)),scores:N.z.array(N.z.number())}),s=(0,l.useMemo)(()=>new TextDecoder("utf-8"),[]);async function r(e){let n={};e.data instanceof ArrayBuffer?n=JSON.parse(s.decode(e.data)):"string"==typeof e.data&&(n=JSON.parse(e.data));let i=a.safeParse(n);i.success&&t(()=>(0,p.yU)(i.data.boxes,i.data.scores).map(e=>{let[t,n]=e,[i,a,s,r]=t;return new L(i,a,s,r,n,t[4])}))}return(0,l.useEffect)(()=>(null==n||n.addEventListener("message",r),()=>{null==n||n.removeEventListener("message",r)}),[n]),{detections:e,dataChannel:n,setDataChannel:i}}(),s=function(){let[e,t]=(0,l.useState)({}),[n,i]=(0,l.useState)(),a=(0,l.useMemo)(()=>new TextDecoder("utf-8"),[]);async function s(e){let n={};e.data instanceof ArrayBuffer?n=JSON.parse(a.decode(e.data)):"string"==typeof e.data&&(n=JSON.parse(e.data)),t(n)}return(0,l.useEffect)(()=>(null==n||n.addEventListener("message",s),()=>{null==n||n.removeEventListener("message",s)}),[n]),{verifications:e,dataChannel:n,setDataChannel:i}}(),r=(0,l.useRef)(null),c=m();return(0,l.useEffect)(()=>{if(_.o.info("Ice Gathering",{description:t.iceGatheringState}),"complete"===t.iceGatheringState&&"BACKEND_SERVER"in n){var e;z.Ay.post("".concat(n.BACKEND_SERVER.value,"/offer"),{json:null===(e=t.pc)||void 0===e?void 0:e.localDescription}).json().then(e=>{var n;null===(n=t.pc)||void 0===n||n.setRemoteDescription(e),_.o.success("Offering Success")},e=>_.o.error("Offering Error",{description:String(e)}))}},[t.iceGatheringState,n]),(0,l.useEffect)(()=>{if(t.negotiationNeeded){var e,n,i;a.setDataChannel(null===(e=t.pc)||void 0===e?void 0:e.createDataChannel("detections")),s.setDataChannel(null===(n=t.pc)||void 0===n?void 0:n.createDataChannel("verifications")),null===(i=t.pc)||void 0===i||i.createOffer().then(e=>{var n;return null===(n=t.pc)||void 0===n?void 0:n.setLocalDescription(e)})}},[t.negotiationNeeded]),(0,i.jsx)(i.Fragment,{children:(0,i.jsxs)("div",{className:"h-full w-full flex items-center justify-center bg-black relative",children:[t.connectionState&&(0,i.jsx)(I.R,{className:"absolute top-5 left-5",variant:"shadow",color:function(e){switch(e){case"connected":return"success";case"connecting":return"primary";case"closed":case"failed":return"danger";default:return"default"}}(t.connectionState),children:t.connectionState}),(0,i.jsx)(R(),{className:"w-full h-full",ref:r,onUserMedia:t.addStream,videoConstraints:{deviceId:e.deviceId}}),a.detections.map(e=>{var t;return(0,i.jsx)(U,{detection:e,verifications:s.verifications,videoEl:null===(t=r.current)||void 0===t?void 0:t.video,profiles:c},e.id)})]})})}function U(e){var t,n,a,s;let{detection:r,verifications:l,videoEl:c,profiles:o}=e,d=r.id?l[r.id]:void 0,u=(null!==(t=null==d?void 0:d.similarity)&&void 0!==t?t:0)*100,v=d?o[d.label]:void 0,f=null!==(a=null!==(n=null==v?void 0:v.name)&&void 0!==n?n:null==d?void 0:d.label)&&void 0!==a?a:"Unknown",h=null!==(s=null==d?void 0:d.extra.status)&&void 0!==s?s:"idle",m="red";return"loading"===h&&(m="blue"),"success"===h&&(m="green"),(0,i.jsx)("div",{className:"fixed ring",ref:(0,p.QS)(r,c),children:(0,i.jsxs)("span",{className:"text-white whitespace-nowrap text-nowrap -translate-y-[calc(100%_+_3px)] inline-flex flex-nowrap items-center gap-3 px-1 min-w-full",style:{backgroundColor:m},children:["loading"===h&&(0,i.jsx)(k.o,{size:"sm"}),u>=50?(0,i.jsxs)(i.Fragment,{children:["success"===h?(0,i.jsx)(A.A,{size:18}):(0,i.jsx)(O.A,{size:18}),"".concat(null!=f?f:"..."," ").concat(u.toFixed(2),"%")]}):(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(O.A,{size:18}),"Unknown"]})]})},r.id)}var J=n(96098);function M(){let[e,t]=(0,l.useState)(void 0);return e?(0,i.jsx)(T,{cam:e}):(0,i.jsxs)(a.Z,{className:"max-w-sm w-full",children:[(0,i.jsx)(s.d,{children:"Absen"}),(0,i.jsx)(r.U,{className:"gap-2",children:(0,i.jsx)(d,{label:"Cam",placeholder:"-",onSelection:t})})]})}function T(e){var t;let n=(0,l.useRef)(null),[a,s]=(0,l.useState)(!1);return(0,l.useEffect)(()=>{n.current&&(a?n.current.requestFullscreen():document.fullscreenElement===n.current&&document.exitFullscreen())},[a,n]),(0,i.jsxs)("div",{className:"w-full h-full flex relative overflow-hidden",ref:n,children:[(0,i.jsx)(F,{deviceId:null===(t=e.cam)||void 0===t?void 0:t.deviceId}),(0,i.jsx)("div",{className:(0,J.cn)("w-96 h-full transition-all bg-white",a?"max-w-96":"max-w-0"),children:(0,i.jsx)(E,{})}),(0,i.jsx)("div",{className:"absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 hover:-translate-y-0 scale-80 hover:scale-100 transition-all",children:(0,i.jsxs)("div",{className:"flex items-center gap-3 p-3 bg-black ring rounded-full mb-3",children:[(0,i.jsx)(u.T,{color:"warning",onPress:()=>location.reload(),children:"Stop"}),(0,i.jsx)(u.T,{isIconOnly:!0,onPress:()=>s(e=>!e),children:a?(0,i.jsx)(f.A,{size:18}):(0,i.jsx)(v.A,{size:18})})]})})]})}},21567:(e,t,n)=>{"use strict";function i(e,t){return n=>{function i(){if(!t||!n)return;let i=t.videoWidth/t.videoHeight,a=t.getBoundingClientRect(),s=a.height*i,r=a.width/i;s>a.width&&(s=a.width),r>a.height&&(r=a.height);let l=a.width-s,c=a.height-r,o=a.x+l/2,d=a.y+c/2,u=e.topx*s+o,v=e.topy*r+d,f=e.botx*s+o,h=e.boty*r+d;n.style.top=v+"px",n.style.left=u+"px",n.style.width=f-u+"px",n.style.height=h-v+"px"}null==t||t.addEventListener("loadedmetadata",i),i()}}async function a(e){var t,n;let i=Promise.withResolvers(),a=document.createElement("input");return a.multiple=null!==(t=null==e?void 0:e.multiple)&&void 0!==t&&t,a.accept=null!==(n=null==e?void 0:e.accept)&&void 0!==n?n:"*",a.type="file",a.oncancel=i.reject,a.onchange=()=>{var e;let t=Array.from(null!==(e=a.files)&&void 0!==e?e:[]);i.resolve(t)},a.click(),i.promise}function s(e,t){return e.map(function(e,n){return[e,t[n]]})}function r(e,t,n){let i=e;for(let e of t){if(!i||!(e in i))return n;i=i[e]}return null!=i?i:n}n.d(t,{JR:()=>a,QS:()=>i,Rp:()=>r,yU:()=>s})}},e=>{var t=t=>e(e.s=t);e.O(0,[555,435,334,467,982,274,719,814,367,205,418,441,517,358],()=>t(23831)),_N_E=e.O()}]);