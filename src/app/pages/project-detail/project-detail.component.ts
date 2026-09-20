import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PROJECTS } from '../../data/projects.data';
import { Project } from '../../models/project.model';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
    selector: 'app-project-detail',
    standalone: true,
    imports: [NgFor, NgIf, RouterLink,NgxExtendedPdfViewerModule],
    templateUrl: './project-detail.component.html',
    styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements AfterViewChecked {
    @ViewChild('projectContentHost') projectContentHost?: ElementRef<HTMLElement>;

    project: Project | undefined;
    projectContent = '';
    contentLoadError = false;
    videoEmbedUrl: SafeResourceUrl | undefined;
    tutoEmbedUrl: SafeResourceUrl | undefined;
    private diagramId = 0;
    private diagramsRendering = false;

    constructor(route: ActivatedRoute, sanitizer: DomSanitizer, private http: HttpClient) {
        this.project = PROJECTS.find(p => p.slug === route.snapshot.paramMap.get('slug'));
        this.videoEmbedUrl = this.getEmbedUrl(this.project?.videoUrl, sanitizer);
        this.tutoEmbedUrl = this.getEmbedUrl(this.project?.tutoUrl, sanitizer);
        this.loadProjectContent();
    }

    ngAfterViewChecked(): void {
        if (this.diagramsRendering || !this.projectContentHost) return;

        const diagrams = Array.from(
            this.projectContentHost.nativeElement.querySelectorAll<HTMLElement>('.mermaid:not([data-mermaid-rendered])')
        );

        if (!diagrams.length) return;

        this.diagramsRendering = true;
        void this.renderDiagrams(diagrams).finally(() => this.diagramsRendering = false);
    }

private async renderDiagrams(diagrams: HTMLElement[]): Promise<void> {
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
            const { svg, bindFunctions } = await mermaid.render(
                `project-diagram-${this.diagramId++}`,
                diagram.textContent?.trim() ?? ''
            );

            diagram.innerHTML = svg;
            bindFunctions?.(diagram);
        } catch (error) {
            diagram.removeAttribute('data-mermaid-rendered');
            console.error('Unable to render Mermaid diagram.', error);
        }
    }
}

    private loadProjectContent(): void {
        if (!this.project?.contentUrl) return;

        this.http.get(this.project.contentUrl, { responseType: 'text' }).subscribe({
            next: content => this.projectContent = content,
            error: () => this.contentLoadError = true
        });
    }

    private getEmbedUrl(url: string | undefined, sanitizer: DomSanitizer): SafeResourceUrl | undefined {
        const videoId = this.getYouTubeVideoId(url);
        return videoId
            ? sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${videoId}`)
            : undefined;
    }

    private getYouTubeVideoId(url: string | undefined): string | undefined {
        if (!url) return undefined;
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
        return match?.[1];
    }
}
