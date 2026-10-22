export default function Loading() {
  return <div style={{ display:"grid",placeItems:"center",minHeight:"100svh",background:"#f6f7fb",color:"#525a6b",fontFamily:"system-ui,sans-serif" }} role="status" aria-label="Loading edx"><div style={{textAlign:"center"}}><div style={{width:72,height:72,borderRadius:24,background:"linear-gradient(135deg,#a64df5,#4c91ff 65%,#62dafa)",margin:"0 auto 20px",boxShadow:"0 12px 35px #668fe84d"}}/><span style={{fontWeight:700,letterSpacing:"-.02em"}}>Getting your school day ready…</span></div></div>;
}
