export function ArchitectureDiagram({ steps, caption }: { steps: string[]; caption: string }) {
  return <figure className="architecture-diagram"><ol>{steps.map((step, index) => <li key={step}><span className="diagram-number">{String(index + 1).padStart(2, '0')}</span><span>{step}</span>{index < steps.length - 1 && <span className="flow-arrow" aria-hidden="true">→</span>}</li>)}</ol><figcaption>{caption}</figcaption></figure>;
}
export function SystemStack() {
  const rows = [['01', 'Foundation models', 'Capability'], ['02', 'Agents & orchestration', 'Coordination'], ['03', 'Retrieval · tools · data', 'Context'], ['04', 'Evaluation & observability', 'Evidence'], ['05', 'Security & governance', 'Trust']];
  return <figure className="system-stack"><figcaption><span>THE SYSTEM, NOT JUST THE MODEL</span><span aria-hidden="true">↗</span></figcaption><ol>{rows.map(([n, title, note]) => <li key={n}><span className="stack-number">{n}</span><span>{title}</span><span className="stack-note">{note}</span></li>)}</ol><div className="stack-result"><span className="status-dot" aria-hidden="true" /><span>Production systems</span><span aria-hidden="true">↳</span></div><p>Designed together. Operated as a whole.</p></figure>;
}
