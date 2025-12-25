export interface SessionResults {
    position: number;
    grid?: number;
    driver: {
        name: string;
    };
    constructor: {
        name: string;
    };
    points?: number;
    times?: {
        timeQ1: string;
        timeQ2: string;
        timeQ3: string;
    };
}