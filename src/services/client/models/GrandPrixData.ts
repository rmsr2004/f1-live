import Session from "./Session";

/**
 * GrandPrixData interface representing detailed information about a Grand Prix event. Does not include results data.
 */
export interface GrandPrixData {
    round: number;
    raceName: string;
    circuitName: string;
    dateRange: string;
    raceDateISO?: string;
    sessions: Session[];
    status?: string;
}