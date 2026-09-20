import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../models/project.model';

@Component({
    selector: 'app-project-card',
    imports: [NgFor, NgIf],
    template: `
        <article class="project" [class.featured]="project.featured" role="link" tabindex="0"
            [attr.aria-label]="'View ' + project.title" (click)="openProject()"
            (keydown.enter)="openProject()" (keydown.space)="$event.preventDefault(); openProject()">
            <div class="visual">
                <img *ngIf="project.imageUrl; else imagePlaceholder" [src]="project.imageUrl"
                    [alt]="project.title + ' project image'">
                <ng-template #imagePlaceholder>
                    <span>PROJECT EVIDENCE</span>
                    <strong>{{ project.imageLabel }}</strong>
                    <i>Add a local image asset</i>
                </ng-template>
            </div>
            <div class="copy">
                <p class="eyebrow">{{ project.featured ? 'Featured system' : 'Engineering project' }}</p>
                <h3>{{ project.title }}</h3>
                <p>{{ project.description }}</p>
                <div class="tags"><span *ngFor="let tag of project.tags">{{ tag }}</span></div>
                <div *ngIf="project.github" class="actions">
                    <a [href]="project.github" target="_blank" rel="noopener" (click)="$event.stopPropagation()">GitHub ↗</a>
                </div>
            </div>
        </article>
    `,
    styles: [`
        .project { border: 1px solid #25373b; background: #0d191c; display: grid; grid-template-columns: 190px 1fr; min-height: 230px; cursor: pointer; transition: border-color .2s, transform .2s }
        .project:hover { border-color: #3ecf9a; transform: translateY(-2px) }
        .project:focus-visible { outline: 2px solid #3ecf9a; outline-offset: 3px }
        .project.featured { grid-column: 1 / -1; grid-template-columns: minmax(270px, .85fr) 1.15fr }
        .visual { background: linear-gradient(135deg, #11282a, #0a1417); padding: 22px; display: flex; flex-direction: column; justify-content: end; gap: 9px; border-right: 1px solid #25373b; position: relative; overflow: hidden }
        .visual:before { content: ''; position: absolute; inset: 16px; background: linear-gradient(90deg, transparent 49%, #3ecf9a33 50%, transparent 51%), linear-gradient(transparent 49%, #3ecf9a33 50%, transparent 51%); background-size: 34px 34px }
        .visual > * { position: relative }
        .visual img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover }
        .visual span { font: 10px monospace; color: #3ecf9a }
        .visual strong { font-size: .88rem; line-height: 1.4 }
        .visual i { font-size: .68rem; color: #8aa09a }
        .copy { padding: 28px }
        .copy h3 { margin: 5px 0 11px; font-size: 1.2rem }
        .copy > p:not(.eyebrow) { color: #b2c2bd; line-height: 1.65; font-size: .9rem; margin: 0 }
        .tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 19px 0 }
        .tags span { font: 10px monospace; color: #a9c9be; padding: 5px 7px; background: #132428; border: 1px solid #244147 }
        .actions { display: flex; gap: 16px; font-size: .78rem; font-weight: 700; color: #3ecf9a }
        @media(max-width: 650px) { .project, .project.featured { grid-template-columns: 1fr } .visual { min-height: 145px; border-right: 0; border-bottom: 1px solid #25373b } }
    `]
})
export class ProjectCardComponent {
    @Input({ required: true }) project!: Project;

    constructor(private router: Router) {}

    openProject(): void {
        this.router.navigate(['/projects', this.project.slug]);
    }
}
