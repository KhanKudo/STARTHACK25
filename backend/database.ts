import {Organization} from "../models/organization";
import {User} from "../models/member";
import {Project} from "../models/project";
import {ProjectRequest} from "../models/projectrequest";

//type MemberROrganizations = [number, number];

let organizations: Organization[] = [];
let projects: Project[] = [];
let users: User[] = [];

let projectRequests: ProjectRequest[] = [];

let MemberROrganizations: ([number, number])[] = [];
let MemberRProject: ([number, number])[] = [];
let MemberRProjectRequest: ([number, number])[] = [];
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
        projects.push({
            id: candidate.toString(),
            company: "Default Company",
            initiative: name,
            challenge: "Default Challenge",
            description: description,
            imageUrl: "https://example.com/default.jpg"
        })
    }
}

function addProjectWithDetails(
    company: string,
    initiative: string,
    challenge: string,
    description: string,
    imageUrl: string,
    callToAction?: string,
    links?: string[]
): void {
    let candidate = Math.random()%1000000;
    if (!projects.find((x: Project) => x.id === candidate.toString())) {
        projects.push({
            id: candidate.toString(),
            company,
            initiative,
            challenge,
            description,
            imageUrl,
            callToAction,
            links
        });
    }
}

function addProjectRequest(name: string, description: string): void {
    let candidate = Math.random() % 1000000;
    // @ts-ignore
    if (!projectRequests.find((x: ProjectRequest) => x.projectRequestId === candidate)) {
        projectRequests.push({requestId : candidate, requestName: name, requestDescription: description });
    }
}

function addMemberToOrganization(memberId: number, organizationId: number): void {
    // @ts-ignore
    if (!MemberROrganizations.find(([mId, oId]) => mId === memberId && oId === organizationId)) {
        MemberROrganizations.push([memberId, organizationId]);
    }
}

function removeMemberFromOrganization(memberId: number, organizationId: number): void {
    MemberROrganizations = MemberROrganizations.filter(([mId, oId]) => mId !== memberId || oId !== organizationId);
}

function isMemberInOrganization(memberId: number, organizationId: number): boolean {
    return MemberROrganizations.some(([mId, oId]) => mId === memberId && oId === organizationId);
}

function addMemberToProject(memberId: number, projectId: number): void {
    // @ts-ignore
    if (!MemberRProject.find(([mId, pId]) => mId === memberId && pId === projectId)) {
        MemberRProject.push([memberId, projectId]);
    }
}

function removeMemberFromProject(memberId: number, projectId: number): void {
    MemberRProject = MemberRProject.filter(([mId, pId]) => mId !== memberId || pId !== projectId);
}

function isMemberInProject(memberId: number, projectId: number): boolean {
    return MemberRProject.some(([mId, pId]) => mId === memberId && pId === projectId);
}

function addMemberToProjectRequest(memberId: number, projectRequestId: number): void {
    // @ts-ignore
    if (!MemberRProjectRequest.find(([mId, prId]) => mId === memberId && prId === projectRequestId)) {
        MemberRProjectRequest.push([memberId, projectRequestId]);
    }
}

function removeMemberFromProjectRequest(memberId: number, projectRequestId: number): void {
    MemberRProjectRequest = MemberRProjectRequest.filter(([mId, prId]) => mId !== memberId || prId !== projectRequestId);
}

function isMemberInProjectRequest(memberId: number, projectRequestId: number): boolean {
    return MemberRProjectRequest.some(([mId, prId]) => mId === memberId && prId === projectRequestId);
}

function addProjectToOrganization(organizationId: number, projectId: number): void {
    // @ts-ignore
    if (!OrganizationRProject.find(([oId, pId]) => oId === organizationId && pId === projectId)) {
        OrganizationRProject.push([organizationId, projectId]);
    }
}

function removeProjectFromOrganization(organizationId: number, projectId: number): void {
    OrganizationRProject = OrganizationRProject.filter(([oId, pId]) => oId !== organizationId || pId !== projectId);
}

function isProjectInOrganization(organizationId: number, projectId: number): boolean {
    return OrganizationRProject.some(([oId, pId]) => oId === organizationId && pId === projectId);
}


export {organizations, projects, users, MemberROrganizations, MemberRProject, OrganizationRProject};
export {
    addUser,
    addProject,
    addMemberToOrganization,
    removeMemberFromOrganization,
    isMemberInOrganization,
    addMemberToProject,
    removeMemberFromProject,
    isMemberInProject,
    addMemberToProjectRequest,
    removeMemberFromProjectRequest,
    isMemberInProjectRequest,
    addProjectToOrganization,
    removeProjectFromOrganization,
    isProjectInOrganization,
};
