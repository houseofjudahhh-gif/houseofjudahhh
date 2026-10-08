/** Displays the original lion file without altering its pixels or proportions. */
export default function Logo({large=false}:{large?:boolean}) {
 return <span className={`brand-logo ${large?'brand-logo-large':''}`}><img src="/hoj-lion.png" alt="" width="1250" height="1250"/><span>{large?<>HOUSE OF<br/>JUDAH</>:'HOUSE OF JUDAH'}</span></span>;
}
