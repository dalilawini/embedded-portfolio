import {
    AfterViewInit,
    Component,
    ElementRef,
    ViewChild
} from '@angular/core';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
    selector: 'app-weather-monitoring',
    standalone: true,
    imports: [
        NgxExtendedPdfViewerModule
    ],
    templateUrl: './weather-monitoring.html',
    styleUrl: './weather-monitoring.css',

    preserveWhitespaces: true
})
export class WeatherMonitoringComponent implements AfterViewInit {

    @ViewChild('projectContentHost')
    projectContentHost?: ElementRef<HTMLElement>;

    private diagramId = 0;

    async ngAfterViewInit(): Promise<void> {

        if (!this.projectContentHost) {
            return;
        }

        const diagrams = Array.from(
            this.projectContentHost.nativeElement
                .querySelectorAll<HTMLElement>(
                    '.mermaid:not([data-mermaid-rendered])'
                )
        );

        if (!diagrams.length) {
            return;
        }

        await this.renderDiagrams(diagrams);
    }

    private async renderDiagrams(
        diagrams: HTMLElement[]
    ): Promise<void> {

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
                fontFamily:
                    'ui-monospace, SFMono-Regular, Consolas, monospace'
            }
        });

        for (const diagram of diagrams) {

            diagram.dataset['mermaidRendered'] = 'true';

            try {

                const source = diagram.textContent?.trim() ?? '';

                console.log('Mermaid source:', source);

                const { svg, bindFunctions } =
                    await mermaid.render(
                        `project-diagram-${this.diagramId++}`,
                        source
                    );

                diagram.innerHTML = svg;

                bindFunctions?.(diagram);

            } catch (error) {

                diagram.removeAttribute(
                    'data-mermaid-rendered'
                );

                console.error(
                    'Unable to render Mermaid diagram.',
                    error
                );
            }
        }
    }
}