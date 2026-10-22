import Link from "next/link";
export default function NotFound() {
 return <main style={{minHeight:"100svh",display:"grid",placeItems:"center",fontFamily:"system-ui,sans-serif",background:"#f6f7fb",color:"#191b22",padding:24,textAlign:"center"}}><div><span style={{fontSize:64}}>✳</span><h1>Looks like this page wandered off.</h1><p>Let's find our way back together.</p><Link href="/">Return to edx home</Link></div></main>;
}
