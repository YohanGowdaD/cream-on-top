export function CakeMark({ className = "" }: { className?: string }) {
  return <svg className={className} width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M8 31h24M11 30V20h18v10M9 20h22M14 19v-7h12v7M12 12h16M20 11V7M18.5 5.5c0-1.3 1.5-3 1.5-3s1.5 1.7 1.5 3a1.5 1.5 0 0 1-3 0Z" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 23c3 4 6-3 9 0s6 1 9 0M14 15c2 3 4-2 6 0s4 1 6 0" stroke="currentColor" strokeWidth="1.1"/></svg>;
}

export function BrandMark({ light = false }: { light?: boolean }) {
  return <a href="#home" className={`brand-mark${light ? " brand-light" : ""}`} aria-label="Cream on Top by Neha Gupta — home"><CakeMark/><span><span className="brand-title">CREAM ON TOP</span><span className="brand-signature">by Neha Gupta</span></span></a>;
}
