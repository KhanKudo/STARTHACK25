import {Organization} from "../models/organization";
import {User} from "../models/member";
import {Project} from "../models/project";

//type MemberROrganizations = [number, number];

let organizations: Organization[];
let projects: Project[];
let users: User[];

let MemberROrganizations: ([number, number])[];
let MemberRProject: ([number, number])[];
let OrganizationRProject: ([number, number])[];

function addMember(name: string): void {
    let candidate = Math.random()%1000000;
}

export {organizations, projects, users, MemberROrganizations, MemberRProject, OrganizationRProject};