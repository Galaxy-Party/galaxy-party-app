export interface Hello {
    value: string;
}

export interface Room {
    id: string;
    name: string;
    hasPassword: boolean;
    ownerId: string;
}