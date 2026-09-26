export interface Project {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    featured?: boolean;
    github?: string;
    tutoUrl?: string;
    videoUrl?: string;
    imageUrl?: string;
    imageLabel: string;
}
