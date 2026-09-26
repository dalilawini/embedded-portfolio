import {
    AfterViewInit,
    Component,
    ElementRef
} from '@angular/core';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { renderMermaidDiagrams } from '../../shared/mermaid-render';

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

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    async ngAfterViewInit(): Promise<void> {
        // Query from the component's own host element rather than a single
        // #projectContentHost template ref, since this template has more
        // than one .project-content block (hardware + software sections).
        await renderMermaidDiagrams(this.elementRef.nativeElement);
    }
}
