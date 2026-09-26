let diagramId = 0;

/**
 * Finds every not-yet-rendered `.mermaid` element inside `container` and
 * replaces its text content with the rendered SVG diagram.
 *
 * Safe to call multiple times on the same container: elements that were
 * already rendered (marked with `data-mermaid-rendered`) are skipped.
 */
export async function renderMermaidDiagrams(container: HTMLElement): Promise<void> {
    const diagrams = Array.from(
        container.querySelectorAll<HTMLElement>('.mermaid:not([data-mermaid-rendered])')
    );

    if (!diagrams.length) {
        return;
    }

    const mermaid = (await import('mermaid')).default;

    mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'dark',
        themeVariables: {
            background: '#0d191c',
            primaryColor: '#102727',
            primaryTextColor: '#e8f3ef',
            primaryBorderColor: '#3e6257',
            lineColor: '#78a897',
            secondaryColor: '#0b1518',
            tertiaryColor: '#132322',
            textColor: '#e8f3ef',
            edgeLabelBackground: '#0d191c',
            fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace'
        }
    });

    for (const diagram of diagrams) {
        diagram.dataset['mermaidRendered'] = 'true';

        try {
            const source = diagram.textContent?.trim() ?? '';
            const { svg, bindFunctions } = await mermaid.render(`project-diagram-${diagramId++}`, source);
            diagram.innerHTML = svg;
            bindFunctions?.(diagram);
        } catch (error) {
            diagram.removeAttribute('data-mermaid-rendered');
            console.error('Unable to render Mermaid diagram.', error);
        }
    }
}
