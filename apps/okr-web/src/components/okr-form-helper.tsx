
function RenderRevisedOKR({ content }: { content: any }) {
    if (!content) return null;
    if (typeof content === 'string') {
        return <>{content}</>;
    }
    if (typeof content === 'object') {
        return (
            <div className="space-y-2 text-left">
                {content.objective && (
                    <div className="font-semibold">Objective: {content.objective}</div>
                )}
                {content.keyResults && Array.isArray(content.keyResults) && (
                    <ul className="list-disc pl-5 space-y-1">
                        {content.keyResults.map((kr: any, i: number) => (
                            <li key={i}>
                                {typeof kr === 'string' ? kr : (kr.value || JSON.stringify(kr))}
                                {kr.deadline && <span className="text-xs text-muted-foreground ml-2">(Due: {kr.deadline})</span>}
                            </li>
                        ))}
                    </ul>
                )}
                {!content.objective && !content.keyResults && (
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                        {JSON.stringify(content, null, 2)}
                    </pre>
                )}
            </div>
        );
    }
    return null;
}
