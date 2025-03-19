import {Organization} from "../models/organization";
import {User} from "../models/member";
import {Project} from "../models/project";

//type MemberROrganizations = [number, number];

let organizations: Organization[] = [];
let projects: Project[] = [];
let users: User[] = [];

let MemberROrganizations: ([number, number])[] = [];
let MemberRProject: ([number, number])[] = [];
let OrganizationRProject: ([number, number])[] = [];

function addUser(name: string, type: User["type"]): void {
    let candidate = Math.random()%1000000;
    // @ts-ignore
    if (!users.find((x: User) => x.userId === candidate)) {
        users.push({userId: candidate, type, userName: name})
    }
}

function addProject(name: string, description: string): void {
    let candidate = Math.random()%1000000;
    // @ts-ignore
    if (!projects.find((x: Project) => x.projectId === candidate)) {
        projects.push({projectId: candidate, projectName: name, projectDescription: description})
    }
}

export {organizations, projects, users, MemberROrganizations, MemberRProject, OrganizationRProject, addUser, addProject};