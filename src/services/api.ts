import axios from 'axios';

const API_URL = 'https://api.jolpi.ca/ergast/';

interface Sessions {
    sessionName: string;
    date: string;
    time: string
}

export interface SessionResults {
    position: number;
    driver: {
        name: string;
    };
    constructor: {
        name: string;
    };
    grid: number | string;
}

export interface GrandPrixData {
    round: number;
    raceName: string;
    date: string;
    time: string;
    sessions: Sessions[];
}

export interface GrandPrixResults {
    grandPrixData: GrandPrixData,
    raceResults: SessionResults[];
    qualifyingResults: SessionResults[];
}

const API = axios.create({
    baseURL: API_URL,
});

export async function getNextGrandPrix() {
    const response = await API.get('/f1/2025/next.json');

    const race = response.data.MRData.RaceTable.Races[0];

    const sessionMappings: { key: keyof typeof race; name: string }[] = [
        { key: 'FirstPractice', name: 'FP1' },
        { key: 'SecondPractice', name: 'FP2' },
        { key: 'ThirdPractice', name: 'FP3' },
        { key: 'Qualifying', name: 'Qualifying' },
        { key: 'Sprint', name: 'Sprint' },
        { key: 'SprintQualifying', name: 'Sprint Qualifying' },
    ];

    const sessions = sessionMappings
        .filter(({ key }) => race[key])
        .map(({ key, name }) => ({
            sessionName: name,
            date: race[key]!.date,
            time: race[key]!.time,
        }));

    const grandPrixData: GrandPrixData = {
        round: race.round,
        raceName: race.raceName,
        date: race.date,
        time: race.time,
        sessions: sessions,
    };

    return grandPrixData;
}

export async function getAllGrandPrixes() {
    const response = await API.get('/f1/2025.json');

    const races = response.data.MRData.RaceTable.Races;

    const allGrandPrixes: GrandPrixData[] = races.map((race: any) => {
        const sessions: GrandPrixData["sessions"] = [];

        const sessionKeys = [
            { key: "FirstPractice", name: "FP1" },
            { key: "SecondPractice", name: "FP2" },
            { key: "ThirdPractice", name: "FP3" },
            { key: "Sprint", name: "Sprint" },
            { key: "SprintQualifying", name: "Sprint Qualifying" },
            { key: "Qualifying", name: "Qualifying" },
        ];

        for (const { key, name } of sessionKeys) {
            if (race[key]) {
                sessions.push({
                    sessionName: name,
                    date: race[key].date,
                    time: race[key].time,
                });
            }
        }

        return {
            raceName: race.raceName,
            date: race.date,
            time: race.time,
            sessions,
        };
    });

    return allGrandPrixes;
}

async function safeGet(url: string) {
    try {
        const response = await API.get(url);
        return response.data.MRData.RaceTable.Races[0] || {};
    } catch (error) {
        return {};
    }
}

export async function getGrandPrixResults(round: number) {
    const race = await safeGet(`/f1/2025/${round}/results.json`);
    const qualifying = await safeGet(`/f1/2025/${round}/qualifying.json`);

    const sessionMappings: { key: string; name: string }[] = [
        { key: 'FirstPractice', name: 'FP1' },
        { key: 'SecondPractice', name: 'FP2' },
        { key: 'ThirdPractice', name: 'FP3' },
        { key: 'Qualifying', name: 'Qualifying' },
    ];

    const sessions = sessionMappings
        .filter(({ key }) => race[key])
        .map(({ key, name }) => ({
            sessionName: name,
            date: race[key]?.date,
            time: race[key]?.time,
        }));

    const grandPrixData: GrandPrixData = {
        round: race.round,
        raceName: race.raceName,
        date: race.date,
        time: race.time,
        sessions,
    };

    function mapResults(resultsArray: any[]): SessionResults[] {
        if (!resultsArray) return [];
        return resultsArray.map((r) => ({
            position: Number(r.position),
            driver: { name: r.Driver.givenName + ' ' + r.Driver.familyName },
            constructor: { name: r.Constructor.name },
            grid: Number(r.grid) || "",
        }));
    }

    const raceResults = mapResults(race.Results);
    const qualifyingResults = mapResults(qualifying.QualifyingResults);

    return {
        grandPrixData,
        raceResults,
        qualifyingResults
    };
}

export async function getDriverStandings() {
    const response = await API.get('/f1/2025/driverStandings.json');

    const standings = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    const formattedStandings = standings.map((entry: any) => ({
        name: `${entry.Driver.givenName} ${entry.Driver.familyName}`,
        constructor: entry.Constructors[0].name,
        points: entry.points,
    }));

    return formattedStandings;
}

export async function getConstructorStandings() {
    const response = await API.get('/f1/2025/constructorStandings.json');

    const standings = response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

    const formattedStandings = standings.map((entry: any) => ({
        name: entry.Constructor.name,
        points: entry.points,
    }));

    return formattedStandings;
}