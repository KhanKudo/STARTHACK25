import {coordinates} from "./coordinates";

interface Organization {
    organizationId: number;
    organizationName: string;
    locations: coordinates[];
    description: string;
}

export { Organization };