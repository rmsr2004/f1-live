export interface Standings {
    standings: {
        name: string;
        constructor?: string;
        points: number;
    }[];
    lastUpdate: string;
}