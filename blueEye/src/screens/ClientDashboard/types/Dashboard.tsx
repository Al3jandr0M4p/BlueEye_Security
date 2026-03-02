import React, { useEffect, useState, useRef } from "react";

// ─── BlueEye Security — Design Tokens ────────────────────────────────────────
const C = {
  bgBase:    "#060d1a",
  bgCard:    "#0f172a",
  bgCardEnd: "#1e293b",

  primary:      "#22d3ee",
  primaryMid:   "#06b6d4",
  primaryLight: "#0ea5e9",
  primaryBg:    "rgba(34,211,238,0.07)",
  primaryBg2:   "rgba(34,211,238,0.12)",
  primaryBd:    "rgba(34,211,238,0.16)",
  primaryBd2:   "rgba(34,211,238,0.28)",
  primaryGlow:  "0 0 20px rgba(34,211,238,0.1)",

  warning:   "#fbbf24",
  warningBg: "rgba(251,191,36,0.08)",
  warningBd: "rgba(251,191,36,0.22)",

  danger:    "#ef4444",
  dangerBg:  "rgba(239,68,68,0.08)",
  dangerBd:  "rgba(239,68,68,0.22)",

  info:    "#0ea5e9",
  infoBg:  "rgba(14,165,233,0.08)",
  infoBd:  "rgba(14,165,233,0.22)",

  textPrimary:   "#f1f5f9",
  textSecondary: "#e2e8f0",
  textBody:      "#cbd5e1",
  textMuted:     "#94a3b8",
  textSubtle:    "#64748b",

  border:      "rgba(255,255,255,0.06)",
  borderCard:  "rgba(34,211,238,0.1)",
  borderHover: "rgba(34,211,238,0.26)",

  f: "'Geist','Inter',-apple-system,sans-serif",
  m: "'Geist Mono','JetBrains Mono',ui-monospace,monospace",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
type Severity     = "critical" | "warning" | "info";
type CameraStatus = "online" | "offline" | "maintenance";

interface NVRData {
  name: string; model: string; ip: string; temperature: number;
  firmware: string; activeChannels: number; totalChannels: number;
  storageUsed: number; storageTotal: string; status: "online" | "offline";
}
interface AlertItem {
  id: number; severity: Severity; title: string;
  description: string; timestamp: string; deviceName: string; resolved: boolean;
}
interface CameraItem {
  id: string; name: string; location: string; ip: string;
  uptime: string; lastSeen: string; status: CameraStatus;
}
interface ChartPoint { dia: string; value: number; }

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockNVR: NVRData = {
  name: "NVR Principal", model: "Hikvision DS-7616NI", ip: "192.168.1.100",
  temperature: 42, firmware: "v4.31.102", activeChannels: 8, totalChannels: 16,
  storageUsed: 67, storageTotal: "8 TB", status: "online",
};
const mockAlerts: AlertItem[] = [
  { id:1, severity:"critical", title:"Cámara desconectada",   description:"CAM-03 perdió conexión hace 15 min. Ticket generado automáticamente.", timestamp:"09:41 AM", deviceName:"CAM-03", resolved:false },
  { id:2, severity:"warning",  title:"Almacenamiento al 67%", description:"NVR Principal supera el 65% de uso de disco.",                          timestamp:"08:30 AM", deviceName:"NVR-01", resolved:false },
  { id:3, severity:"info",     title:"Firmware disponible",   description:"Actualización v4.32 disponible para el NVR.",                            timestamp:"07:00 AM", deviceName:"NVR-01", resolved:false },
];
const mockCameras: CameraItem[] = [
  { id:"1",  name:"CAM-01", location:"Entrada Principal",  ip:"192.168.1.11", uptime:"99.8%", lastSeen:"Ahora",       status:"online"      },
  { id:"2",  name:"CAM-02", location:"Estacionamiento A",  ip:"192.168.1.12", uptime:"98.5%", lastSeen:"Ahora",       status:"online"      },
  { id:"3",  name:"CAM-03", location:"Pasillo Norte",      ip:"192.168.1.13", uptime:"0%",    lastSeen:"Hace 15 min", status:"offline"     },
  { id:"4",  name:"CAM-04", location:"Sala Servidores",    ip:"192.168.1.14", uptime:"100%",  lastSeen:"Ahora",       status:"online"      },
  { id:"5",  name:"CAM-05", location:"Recepción",          ip:"192.168.1.15", uptime:"99.1%", lastSeen:"Ahora",       status:"online"      },
  { id:"6",  name:"CAM-06", location:"Patio Trasero",      ip:"192.168.1.16", uptime:"0%",    lastSeen:"En revisión", status:"maintenance" },
  { id:"7",  name:"CAM-07", location:"Bodega",             ip:"192.168.1.17", uptime:"97.3%", lastSeen:"Ahora",       status:"online"      },
  { id:"8",  name:"CAM-08", location:"Acceso Vehicular",   ip:"192.168.1.18", uptime:"99.5%", lastSeen:"Ahora",       status:"online"      },
  { id:"9",  name:"CAM-09", location:"Oficina Principal",  ip:"192.168.1.19", uptime:"98.9%", lastSeen:"Ahora",       status:"online"      },
  { id:"10", name:"CAM-10", location:"Escalera Sur",       ip:"192.168.1.20", uptime:"99.0%", lastSeen:"Ahora",       status:"online"      },
  { id:"11", name:"CAM-11", location:"Azotea",             ip:"192.168.1.21", uptime:"99.7%", lastSeen:"Ahora",       status:"online"      },
];
const uptimeData: ChartPoint[] = [{dia:"L",value:98},{dia:"M",value:97},{dia:"Mi",value:99},{dia:"J",value:100},{dia:"V",value:98},{dia:"S",value:99},{dia:"D",value:99.2}];
const alertsData: ChartPoint[] = [{dia:"L",value:3},{dia:"M",value:5},{dia:"Mi",value:2},{dia:"J",value:7},{dia:"V",value:4},{dia:"S",value:1},{dia:"D",value:3}];

// ─── Tag ──────────────────────────────────────────────────────────────────────
const Tag: React.FC<{bg:string;color:string;bd:string;children:React.ReactNode}> = ({bg,color,bd,children}) => (
  <span style={{
    fontSize:9, fontFamily:C.m, letterSpacing:"0.1em", fontWeight:600,
    padding:"3px 9px", borderRadius:5,
    background:bg, color, border:`1px solid ${bd}`,
    flexShrink:0, whiteSpace:"nowrap" as const, lineHeight:1,
  }}>
    {children}
  </span>
);

// ─── Panel (card wrapper) ─────────────────────────────────────────────────────
const Panel: React.FC<{
  title:string; sub:string; right?:React.ReactNode;
  children:React.ReactNode; style?:React.CSSProperties;
}> = ({title,sub,right,children,style}) => (
  <div style={{
    background:   `linear-gradient(135deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
    border:       `1px solid ${C.borderCard}`,
    borderRadius: 12,
    overflow:     "hidden",
    fontFamily:   C.f,
    ...style,
  }}>
    <div style={{
      padding:        "12px 18px",
      borderBottom:   `1px solid ${C.border}`,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "space-between",
      gap:            8,
      background:     "rgba(6,13,26,0.4)",
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary, letterSpacing:"-0.01em" }}>{title}</div>
        <div style={{ fontSize:9, fontFamily:C.m, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:C.textSubtle, marginTop:2 }}>{sub}</div>
      </div>
      {right}
    </div>
    {children}
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const SC: React.FC<{
  label:string; value:string|number; detail:string;
  accent:string; accentBg:string; accentBd:string;
  valueColor:string; dotColor?:string; dotGlow?:string;
  barFill?:string; barWidth?:string;
// Después
}> = ({label,value,detail,accent,valueColor,dotColor,dotGlow,barFill,barWidth}) => {
  const [hov,setHov] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background:    `linear-gradient(135deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
        border:        `1px solid ${hov ? accent+"55" : C.borderCard}`,
        borderTop:     `2px solid ${accent}`,
        borderRadius:  12,
        padding:       "16px 18px",
        display:       "flex",
        flexDirection: "column",
        gap:           5,
        cursor:        "default",
        transition:    "border-color 0.2s, box-shadow 0.2s",
        boxShadow:     hov ? `0 0 24px ${accent}18` : "none",
      }}
    >
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:9, fontFamily:C.m, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:C.textSubtle }}>
          {label}
        </span>
        {dotColor && (
          <div style={{
            width:6, height:6, borderRadius:"50%",
            background:dotColor, flexShrink:0,
            boxShadow: dotGlow ?? `0 0 8px ${dotColor}`,
          }}/>
        )}
      </div>
      <div style={{ fontSize:32, fontWeight:300, letterSpacing:"-0.03em", lineHeight:1, color:valueColor, fontStyle:"normal" }}>
        {value}
      </div>
      <div style={{ fontSize:11, color:C.textSubtle }}>{detail}</div>
      {barWidth && barFill && (
        <div style={{ height:3, background:"rgba(255,255,255,0.05)", borderRadius:2, overflow:"hidden", marginTop:4 }}>
          <div style={{ height:"100%", width:barWidth, background:barFill, borderRadius:2, boxShadow:`0 0 8px ${barFill}55` }}/>
        </div>
      )}
    </div>
  );
};

// ─── Alert Row ────────────────────────────────────────────────────────────────
const ASEV: Record<Severity,{bar:string;title:string;tagBg:string;tagCl:string;tagBd:string}> = {
  critical: { bar:C.danger,  title:"#f87171", tagBg:C.dangerBg,  tagCl:"#f87171", tagBd:C.dangerBd  },
  warning:  { bar:C.warning, title:"#fcd34d", tagBg:C.warningBg, tagCl:"#fcd34d", tagBd:C.warningBd },
  info:     { bar:C.info,    title:"#38bdf8", tagBg:C.infoBg,    tagCl:"#38bdf8", tagBd:C.infoBd    },
};

const ARow: React.FC<{a:AlertItem;last?:boolean}> = ({a,last}) => {
  const [h,setH] = useState(false);
  const s = ASEV[a.severity];
  return (
    <div
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:"grid", gridTemplateColumns:"3px 1fr auto",
        gap:14, alignItems:"start", padding:"12px 18px",
        borderBottom: last ? "none" : `1px solid ${C.border}`,
        background: h ? "rgba(255,255,255,0.02)" : "transparent",
        cursor:"pointer", transition:"background 0.15s",
      }}
    >
      <div style={{ width:3, borderRadius:2, minHeight:36, marginTop:3, background:s.bar, boxShadow:`0 0 8px ${s.bar}55` }}/>
      <div>
        <div style={{ fontSize:12, fontWeight:500, color:s.title, marginBottom:3 }}>{a.title}</div>
        <div style={{ fontSize:11, color:C.textMuted, lineHeight:1.55 }}>{a.description}</div>
      </div>
      <div style={{ textAlign:"right" as const, flexShrink:0 }}>
        <span style={{ display:"block", fontSize:9, fontFamily:C.m, color:C.textSubtle, letterSpacing:"0.06em", marginBottom:5 }}>{a.timestamp}</span>
        <Tag bg={s.tagBg} color={s.tagCl} bd={s.tagBd}>{a.deviceName}</Tag>
      </div>
    </div>
  );
};

// ─── Camera Card ──────────────────────────────────────────────────────────────
const CAMCFG: Record<CameraStatus,{label:string;color:string;bg:string;bd:string;previewBg:string;nameCl:string;glow:string}> = {
  online:      { label:"En línea",      color:C.primary,  bg:C.primaryBg,  bd:C.primaryBd,  previewBg:"#020810", nameCl:C.textPrimary, glow:`0 0 18px rgba(34,211,238,0.09)` },
  offline:     { label:"Sin señal",     color:C.danger,   bg:C.dangerBg,   bd:C.dangerBd,   previewBg:"#0d0406", nameCl:"#f87171",     glow:`0 0 18px rgba(239,68,68,0.09)`  },
  maintenance: { label:"Mantenimiento", color:C.warning,  bg:C.warningBg,  bd:C.warningBd,  previewBg:"#0d0b03", nameCl:"#fcd34d",     glow:`0 0 18px rgba(251,191,36,0.09)` },
};

const gridLines = `repeating-linear-gradient(0deg,rgba(255,255,255,0.015) 0,transparent 1px,transparent 20px),repeating-linear-gradient(90deg,rgba(255,255,255,0.015) 0,transparent 1px,transparent 20px)`;

const CamCard: React.FC<{cam:CameraItem}> = ({cam}) => {
  const [h,setH] = useState(false);
  const c = CAMCFG[cam.status];
  return (
    <div
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        background:   `linear-gradient(160deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
        border:       `1px solid ${h ? c.color+"44" : C.borderCard}`,
        borderRadius: 10, overflow:"hidden", cursor:"pointer",
        transform:    h ? "translateY(-2px)" : "none",
        transition:   "all 0.18s ease",
        boxShadow:    h ? c.glow : "none",
      }}
    >
      {/* Preview area */}
      <div style={{ aspectRatio:"16/9", background:c.previewBg, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:gridLines }}/>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 40%, ${c.color}0A 0%, transparent 65%)` }}/>
        <span style={{ fontSize:22, opacity:0.05, position:"relative" }}>📷</span>
        {/* Status badge */}
        <span style={{
          position:"absolute", bottom:6, left:8,
          fontSize:8, fontFamily:C.m, letterSpacing:"0.1em", textTransform:"uppercase" as const,
          padding:"2px 7px", borderRadius:4, fontWeight:600,
          background:c.bg, color:c.color, border:`1px solid ${c.bd}`,
        }}>
          {c.label}
        </span>
        {/* REC dot */}
        {cam.status==="online" && (
          <span style={{
            position:"absolute", top:7, right:8,
            fontSize:8, fontFamily:C.m, color:"#7f1d1d",
            letterSpacing:"0.1em", display:"flex", alignItems:"center", gap:4,
          }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"#dc2626", display:"inline-block" }}/>
            REC
          </span>
        )}
      </div>
      {/* Info */}
      <div style={{ padding:"9px 12px 11px" }}>
        <div style={{ fontSize:12, fontWeight:600, color:c.nameCl, marginBottom:2, letterSpacing:"-0.01em" }}>{cam.name}</div>
        <div style={{ fontSize:9, color:C.textSubtle, marginBottom:8 }}>{cam.location}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:4 }}>
          {([["IP",cam.ip],["Uptime",cam.uptime],["Visto",cam.lastSeen]] as [string,string][]).map(([k,v])=>(
            <div key={k}>
              <div style={{ fontSize:8, fontFamily:C.m, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:C.textSubtle, marginBottom:2 }}>{k}</div>
              <div style={{ fontSize:10, fontFamily:C.m, color:C.textMuted }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Area Chart ───────────────────────────────────────────────────────────────
const AreaChart: React.FC<{data:ChartPoint[];color:string;suffix?:string;minY?:number;maxY?:number}> = ({data,color,suffix="",minY,maxY}) => {
  const [tip,setTip] = useState<{x:number;y:number;v:number;l:string}|null>(null);
  const ref = useRef<SVGSVGElement>(null);
  const W=480,H=110,pL=30,pR=10,pT=8,pB=24;
  const vals=data.map(d=>d.value);
  const lo=minY??Math.min(...vals)-1, hi=maxY??Math.max(...vals)+1;
  const xs=(i:number)=>pL+(i/(data.length-1))*(W-pL-pR);
  const ys=(v:number)=>pT+H-((v-lo)/(hi-lo))*H;
  const pts=data.map((d,i)=>`${xs(i)},${ys(d.value)}`).join(" ");
  const area=`M${xs(0)},${ys(data[0].value)} `+data.slice(1).map((d,i)=>`L${xs(i+1)},${ys(d.value)}`).join(" ")+` L${xs(data.length-1)},${pT+H} L${xs(0)},${pT+H} Z`;
  const gid=`g${color.replace(/[^a-z0-9]/gi,"")}`;
  return (
    <div style={{ position:"relative", width:"100%", height:H+pT+pB }}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H+pT+pB}`} style={{ width:"100%", height:"100%" }} onMouseLeave={()=>setTip(null)}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.22}/>
            <stop offset="100%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        {[lo,(lo+hi)/2,hi].map(v=>(
          <g key={v}>
            <line x1={pL} y1={ys(v)} x2={W-pR} y2={ys(v)} stroke="rgba(255,255,255,0.04)" strokeWidth={1}/>
            <text x={pL-5} y={ys(v)+4} textAnchor="end" fill={C.textSubtle} fontSize={9} fontFamily={C.m}>{Math.round(v)}</text>
          </g>
        ))}
        <path d={area} fill={`url(#${gid})`}/>
        <polyline points={pts} fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round"/>
        {data.map((d,i)=>(
          <g key={i}>
            <circle cx={xs(i)} cy={ys(d.value)} r={3.5} fill={color} style={{ filter:`drop-shadow(0 0 5px ${color})` }}/>
            <text x={xs(i)} y={H+pT+18} textAnchor="middle" fill={C.textSubtle} fontSize={9} fontFamily={C.m}>{d.dia}</text>
            <circle cx={xs(i)} cy={ys(d.value)} r={12} fill="transparent" style={{ cursor:"pointer" }}
              onMouseEnter={()=>{ const r=ref.current?.getBoundingClientRect(); if(r) setTip({x:(xs(i)/W)*r.width+r.left,y:(ys(d.value)/(H+pT+pB))*r.height+r.top,v:d.value,l:d.dia}); }}
            />
          </g>
        ))}
      </svg>
      {tip&&(
        <div style={{
          position:"fixed", left:tip.x+10, top:tip.y-34,
          background:C.bgCard, border:`1px solid ${C.borderCard}`,
          borderRadius:8, padding:"6px 12px",
          fontSize:11, color:C.textPrimary,
          pointerEvents:"none", zIndex:999,
          whiteSpace:"nowrap" as const, fontFamily:C.m,
          boxShadow:"0 4px 20px rgba(0,0,0,0.5)",
        }}>
          <span style={{ color:C.textSubtle, marginRight:6 }}>{tip.l}</span>
          <strong style={{ color:C.textPrimary }}>{tip.v}{suffix}</strong>
        </div>
      )}
    </div>
  );
};

// ─── NVR Block ────────────────────────────────────────────────────────────────
const NVRBlock: React.FC = () => {
  const pct   = mockNVR.storageUsed;
  // success/warning/danger states
  const sc    = pct>85 ? C.danger : pct>65 ? C.warning : C.primary;
  const chPct = (mockNVR.activeChannels/mockNVR.totalChannels)*100;
  return (
    <Panel title="Estado del NVR" sub="Grabador de Video en Red">
      <div style={{ padding:"14px 18px", display:"flex", flexDirection:"column", gap:12 }}>
        {/* Device badge — primary tinted */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"10px 14px", borderRadius:10,
          background:C.primaryBg, border:`1px solid ${C.primaryBd}`,
          boxShadow: C.primaryGlow,
        }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary }}>{mockNVR.name}</div>
            <div style={{ fontSize:10, color:C.textSubtle, fontFamily:C.m }}>{mockNVR.model}</div>
          </div>
          <Tag bg={C.primaryBg} color={C.primary} bd={C.primaryBd}>ONLINE</Tag>
        </div>

        {/* Info grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
          {([
            ["IP",          mockNVR.ip,                                                                                               C.textSecondary],
            ["Temperatura", `${mockNVR.temperature}°C`, mockNVR.temperature>60?C.danger:mockNVR.temperature>45?C.warning:C.textSecondary],
            ["Firmware",    mockNVR.firmware,                                                                                         C.textSecondary],
            ["Canales",     `${mockNVR.activeChannels} / ${mockNVR.totalChannels}`,                                                   C.primary       ],
          ] as [string,string,string][]).map(([k,v,vc])=>(
            <div key={k} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 11px" }}>
              <div style={{ fontSize:8, fontFamily:C.m, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:C.textSubtle, marginBottom:4 }}>{k}</div>
              <div style={{ fontSize:12, fontWeight:500, fontFamily:C.m, color:vc }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Storage bar — danger/warning/success */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontSize:9, fontFamily:C.m, color:C.textSubtle }}>Almacenamiento</span>
            <span style={{ fontSize:9, fontFamily:C.m, color:sc, fontWeight:600 }}>{pct}% — {mockNVR.storageTotal}</span>
          </div>
          <div style={{ height:4, background:"rgba(255,255,255,0.05)", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:sc, borderRadius:2, boxShadow:`0 0 8px ${sc}44`, transition:"width 0.8s ease" }}/>
          </div>
        </div>

        {/* Channel bar — info */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontSize:9, fontFamily:C.m, color:C.textSubtle }}>Canales activos</span>
            <span style={{ fontSize:9, fontFamily:C.m, color:C.info, fontWeight:600 }}>{mockNVR.activeChannels}/{mockNVR.totalChannels}</span>
          </div>
          <div style={{ height:4, background:"rgba(255,255,255,0.05)", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${chPct}%`, background:C.info, borderRadius:2, boxShadow:`0 0 8px ${C.info}44` }}/>
          </div>
        </div>
      </div>
    </Panel>
  );
};

// ─── Clock ────────────────────────────────────────────────────────────────────
const useClock = () => {
  const [t,setT] = useState(new Date());
  useEffect(()=>{const id=setInterval(()=>setT(new Date()),1000);return()=>clearInterval(id);},[]);
  const p=(n:number)=>String(n).padStart(2,"0");
  const h=t.getHours()%12||12;
  return `${p(h)}:${p(t.getMinutes())}:${p(t.getSeconds())} ${t.getHours()>=12?"p.m.":"a.m."}`;
};

// ─── Dashboard — content only ─────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const clock       = useClock();
  const unresolved  = mockAlerts.filter(a=>!a.resolved);
  const online      = mockCameras.filter(c=>c.status==="online").length;
  const offline     = mockCameras.filter(c=>c.status==="offline").length;
  const maintenance = mockCameras.filter(c=>c.status==="maintenance").length;

  return (
    <div style={{
      width:"100%", minHeight:"100%",
      background: C.bgBase,
      color:      C.textPrimary,
      fontFamily: C.f,
      fontSize:   13,
      padding:    "24px 28px 56px",
      boxSizing:  "border-box" as const,
      display:    "flex",
      flexDirection: "column",
      gap: 16,
    }}>

      {/* ── Page header ──────────────────────────────── */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16 }}>
        <div>
          <div style={{ fontSize:10, fontFamily:C.m, letterSpacing:"0.18em", textTransform:"uppercase" as const, color:C.primary, marginBottom:6, opacity:0.8 }}>
            Portal del cliente · Infraestructura
          </div>
          <h1 style={{ fontSize:24, fontWeight:600, color:C.textPrimary, letterSpacing:"-0.02em", margin:0, lineHeight:1.15 }}>
            Estado del Sistema
          </h1>
          <p style={{ fontSize:12, color:C.textSubtle, margin:"5px 0 0" }}>
            Infraestructura activa · Actualizado ahora
          </p>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          {/* Live clock — primary */}
          <div style={{
            display:"flex", alignItems:"center", gap:8,
            padding:"7px 14px", borderRadius:20,
            background:C.primaryBg, border:`1px solid ${C.primaryBd}`,
            fontFamily:C.m, fontSize:12, color:C.primary, fontWeight:500, letterSpacing:"0.04em",
            boxShadow: C.primaryGlow,
          }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:C.primary, boxShadow:`0 0 8px ${C.primary}` }}/>
            {clock}
          </div>

          {/* Alert badge — danger */}
          {unresolved.length>0&&(
            <div style={{
              display:"flex", alignItems:"center", gap:9,
              padding:"7px 14px", borderRadius:10,
              background:C.dangerBg, border:`1px solid ${C.dangerBd}`,
            }}>
              <span style={{ fontSize:14 }}>🔔</span>
              <div>
                <p style={{ fontSize:11, fontWeight:600, color:C.danger, margin:0, lineHeight:1.3 }}>{unresolved.length} alertas activas</p>
                <p style={{ fontSize:9,  color:C.textSubtle, margin:0, fontFamily:C.m }}>Requieren atención</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Alert ribbon — danger ─────────────────────── */}
      {unresolved.length>0&&(
        <div style={{ background:C.dangerBg, border:`1px solid ${C.dangerBd}`, borderRadius:10, padding:"10px 18px", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ color:C.danger, fontSize:11, fontWeight:700, flexShrink:0 }}>▲</span>
          <span style={{ fontSize:11, color:"#fca5a5", flex:1 }}>
            {unresolved.length} incidentes activos — {unresolved.map(a=>a.deviceName).join(" · ")}
          </span>
          <Tag bg="rgba(239,68,68,0.14)" color="#f87171" bd="rgba(239,68,68,0.3)">{unresolved.length} ALERTAS</Tag>
        </div>
      )}

      {/* ── Stat cards ───────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {/* success */}
        <SC label="Cámaras Online"     value={online}      detail={`de ${mockCameras.length} instaladas`}
          accent={C.primary}  accentBg={C.primaryBg}  accentBd={C.primaryBd}
          valueColor={C.primary}  dotColor={C.primary}
          barFill={C.primary} barWidth={`${(online/mockCameras.length)*100}%`}
        />
        {/* danger */}
        <SC label="Cámaras Offline"    value={offline}     detail="requieren atención"
          accent={C.danger}   accentBg={C.dangerBg}   accentBd={C.dangerBd}
          valueColor="#f87171" dotColor={C.danger}
        />
        {/* warning */}
        <SC label="Mantenimiento"      value={maintenance} detail="en revisión técnica"
          accent={C.warning}  accentBg={C.warningBg}  accentBd={C.warningBd}
          valueColor="#fcd34d" dotColor={C.warning}
        />
        {/* info */}
        <SC label="Uptime del Sistema" value="99.2%"       detail="últimos 30 días"
          accent={C.info}     accentBg={C.infoBg}     accentBd={C.infoBd}
          valueColor="#38bdf8"
          barFill={C.info}    barWidth="99.2%"
        />
      </div>

      {/* ── Charts ───────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Panel title="Uptime del Sistema" sub="Últimos 7 días (%)"
          right={<Tag bg={C.primaryBg} color={C.primary} bd={C.primaryBd}>99.2% promedio</Tag>}>
          <div style={{ padding:"14px 18px 12px" }}>
            <AreaChart data={uptimeData} color={C.primary} suffix="%" minY={90} maxY={100}/>
          </div>
        </Panel>
        <Panel title="Alertas por Día" sub="Últimos 7 días"
          right={<Tag bg={C.warningBg} color={C.warning} bd={C.warningBd}>Esta semana</Tag>}>
          <div style={{ padding:"14px 18px 12px" }}>
            <AreaChart data={alertsData} color={C.warning} minY={0} maxY={10}/>
          </div>
        </Panel>
      </div>

      {/* ── Alerts + NVR ─────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 310px", gap:14 }}>
        <Panel title="Alertas Activas" sub="Notificaciones del sistema"
          right={<Tag bg={C.dangerBg} color={C.danger} bd={C.dangerBd}>{unresolved.length} activas</Tag>}>
          {unresolved.length===0
            ? <div style={{ padding:"40px 0", textAlign:"center" as const, color:C.textSubtle, fontSize:12 }}>✓ Sin alertas activas</div>
            : unresolved.map((a,i)=><ARow key={a.id} a={a} last={i===unresolved.length-1}/>)
          }
        </Panel>
        <NVRBlock/>
      </div>

      {/* ── Camera grid ──────────────────────────────── */}
      <Panel title="Cámaras del Sistema" sub="Monitoreo en tiempo real"
        right={<Tag bg={C.primaryBg} color={C.primary} bd={C.primaryBd}>{online} / {mockCameras.length} activas</Tag>}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, padding:"16px 18px" }}>
          {mockCameras.map(cam=><CamCard key={cam.id} cam={cam}/>)}
        </div>
      </Panel>

    </div>
  );
};

export default Dashboard;