import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { PROJECTS } from '../../data/projects.data';

@Component({ selector: 'app-home', imports: [NgFor, ProjectCardComponent], templateUrl: './home.component.html', styleUrl: './home.component.scss' }) export class HomeComponent {
    projects = PROJECTS;
    skills = { Embedded: ['C', 'C++', 'STM32', 'STM32CubeMX', 'ESP32', 'ESP8266', 'Arduino', 'LVGL'], Software: ['Java', 'JavaFX', 'Python', 'Git', 'GitHub', 'Linux', 'Docker', 'CI/CD'], Electronics: ['PCB Design', 'Altium Designer', 'Schematic Design', 'PCB Manufacturing', 'CNC 3018 Pro', 'FlatCAM', '3D Printing', 'Hardware Debugging'], Communication: ['ESP-NOW', 'Bluetooth', 'RF', 'nRF24', 'UART', 'SPI', 'I2C', 'CAN'], Engineering: ['Software Architecture', 'Embedded Architecture', 'Debugging', 'Testing', 'Code Generation', 'State Machines', 'Event-Driven Architecture'] };
    skillGroups = Object.entries(this.skills);
    currentYear = new Date().getFullYear();
}
