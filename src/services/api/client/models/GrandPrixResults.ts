import { GrandPrixData } from "./GrandPrixData";
import { SessionResults } from "./SessionResults";

export interface GrandPrixResults {
    grandPrixData: GrandPrixData,
    raceResults: SessionResults[];
    qualifyingResults: SessionResults[];
    sprintResults: SessionResults[];
    status: string;
}