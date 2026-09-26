import { Component} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PROJECTS } from '../../data/projects.data';
import { Project } from '../../models/project.model';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
    selector: 'app-project-detail',
    standalone: true,
    imports: [NgFor, NgIf, RouterLink,RouterOutlet,NgxExtendedPdfViewerModule],
    templateUrl: './project-detail.component.html',
    styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent  {

    project: Project | undefined;
    projectContent = '';
    contentLoadError = false;
    videoEmbedUrl: SafeResourceUrl | undefined;
    tutoEmbedUrl: SafeResourceUrl | undefined;

    constructor(route: ActivatedRoute, sanitizer: DomSanitizer, private http: HttpClient) {
        this.project = PROJECTS.find(p => p.slug === route.snapshot.paramMap.get('slug'));
        this.videoEmbedUrl = this.getEmbedUrl(this.project?.videoUrl, sanitizer);
        this.tutoEmbedUrl = this.getEmbedUrl(this.project?.tutoUrl, sanitizer);
        this.loadProjectContent();
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
