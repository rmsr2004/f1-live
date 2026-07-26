import axios from 'axios';
import { formatDateTime, formatDateRange, getISOStringFromDateTimePT } from '@utils/dateUtils';
import { GrandPrixData } from './models/GrandPrixData.tsx';
import { SessionResults } from './models/SessionResults.tsx';
import Session from './models/Session.tsx';
import { Standings } from './models/Standings.tsx';
import { GrandPrixResults } from './models/GrandPrixResults.tsx';
import { GrandPrixShortData } from './models/GrandPrixShortData.ts';

const API_URL = 'https://api.jolpi.ca/ergast/';

const API = axios.create({
    baseURL: API_URL,
});

async function safeGet(url: string) {
    try {
        const response = await API.get(url);
        return response.data.MRData.RaceTable.Races[0] || {};
    } catch (error) {
        return {};
    }
}

export async function getNextGrandPrix(season: string): Promise<GrandPrixData | null> {
    const response = await API.get(`/f1/${season}/next.json`);

    const race = response.data.MRData.RaceTable.Races[0];

    if (Number(race.season) > Number(season)) {
        return null;
    }

    const sessionMappings: { key: keyof typeof race; name: string }[] = [
        { key: 'FirstPractice', name: 'FP1' },
        { key: 'SprintQualifying', name: 'SPRINT QUALIFYING' },
        { key: 'Sprint', name: 'SPRINT' },
        { key: 'SecondPractice', name: 'FP2' },
        { key: 'ThirdPractice', name: 'FP3' },
        { key: 'Qualifying', name: 'QUALIFYING' },
    ];

    let sessions: Session[] = [];
    try {
        sessions = sessionMappings
            .filter(({ key }) => race[key])
            .map(({ key, name }) => {
                const dateStr = race[key]!.date;
                const timeStr = race[key]!.time;
    
                return {
                    sessionName: name,
                    datetime: formatDateTime(dateStr, timeStr),
                };
            });
    } catch (error) {
        return null;
    }

    sessions.push({
        sessionName: 'RACE',
        datetime: formatDateTime(race.date, race.time),
    })

    const start = race.FirstPractice.date;
    const end = race.date;
    const dateRange = formatDateRange(start, end);

    let status = 'NEXT';
    const fp1DateTime = new Date(`${start}T${race.FirstPractice.time}`);
    
    if (fp1DateTime < new Date()) {
        status = 'ONGOING';
    }

    const grandPrixData: GrandPrixData = {
        round: race.round,
        raceName: race.raceName.toUpperCase(),
        circuitName: `${race.Circuit.circuitName}, ${race.Circuit.Location.locality}`,
        dateRange: dateRange,
        raceDateISO: getISOStringFromDateTimePT(race.date, race.time),
        sessions: sessions,
        status: status,
    };

    return grandPrixData;
}

export async function getAllGrandPrixes(season: string): Promise<GrandPrixShortData[]> {
    const calendarResponse = await API.get(`/f1/${season}.json`);
    const races = calendarResponse.data.MRData.RaceTable.Races;

    // The API caps results at 100 per request. With ~20 drivers per race,
    // 100 results only covers ~5 rounds. We need to paginate to get all results.
    const resultsByRound = new Map<string, any>();
    let offset = 0;
    const limit = 100;
    let total = Infinity;

    while (offset < total) {
        const resultsResponse = await API.get(`/f1/${season}/results.json?limit=${limit}&offset=${offset}`);
        const mrData = resultsResponse.data.MRData;
        total = Number(mrData.total);
        const resultsRaces = mrData.RaceTable.Races;

        resultsRaces.forEach((race: any) => {
            resultsByRound.set(race.round, race);
        });

        offset += limit;
    }

    const now = new Date();

    return races.map((race: any) => {
        const start = race.FirstPractice?.date;
        const end = race.date;
        const dateRange = formatDateRange(start, end);

        const raceDateTime = new Date(`${race.date}T${race.time}`);
        const fp1DateTime = new Date(`${start}T${race.FirstPractice.time}`);

        let status: 'COMPLETED' | 'ONGOING' | 'UPCOMING' = 'UPCOMING';

        if (raceDateTime < now) status = 'COMPLETED';
        else if (fp1DateTime < now && now < raceDateTime) status = 'ONGOING';

        let winner = "N/D";
        if (status === 'COMPLETED') {
            const raceResult = resultsByRound.get(race.round);
            const winnerDriver = raceResult?.Results?.[0]?.Driver;
            if (winnerDriver) {
                winner = `${winnerDriver.givenName} ${winnerDriver.familyName}`;
            }
        }

        return {
            round: race.round,
            raceName: race.raceName.toUpperCase(),
            circuitName: `${race.Circuit.circuitName}, ${race.Circuit.Location.locality}`,
            dateRange,
            winner,
            status,
        };
    });
}

export async function getGrandPrixResults(season: string, round: number): Promise<GrandPrixResults> {
    const raceInfo = await safeGet(`/f1/${season}/${round}.json`);
    const race = await safeGet(`/f1/${season}/${round}/results.json`);
    const qualifying = await safeGet(`/f1/${season}/${round}/qualifying.json`);
    const sprint = await safeGet(`/f1/${season}/${round}/sprint.json`);

    const sessionMappings: { key: keyof typeof raceInfo; name: string }[] = [
        { key: 'FirstPractice', name: 'FP1' },
        { key: 'SprintQualifying', name: 'SPRINT QUALIFYING' },
        { key: 'Sprint', name: 'SPRINT' },
        { key: 'SecondPractice', name: 'FP2' },
        { key: 'ThirdPractice', name: 'FP3' },
        { key: 'Qualifying', name: 'QUALIFYING' },
    ];

    const sessions = sessionMappings
        .filter(({ key }) => raceInfo[key])
        .map(({ key, name }) => {
            const dateStr = raceInfo[key]!.date;
            const timeStr = raceInfo[key]!.time;

            return {
                sessionName: name,
                datetime: formatDateTime(dateStr, timeStr),
            };
        });

    sessions.push({
        sessionName: 'RACE',
        datetime: formatDateTime(raceInfo.date, raceInfo.time),
    })

    const start = raceInfo.FirstPractice.date;
    const end = raceInfo.date;
    const dateRange = formatDateRange(start, end);

    const grandPrixData: GrandPrixData = {
        round: raceInfo.round,
        raceName: raceInfo.raceName.toUpperCase(),
        circuitName: `${raceInfo.Circuit.circuitName}, ${raceInfo.Circuit.Location.locality}`,
        dateRange: dateRange,
        sessions: sessions,
    };

    function mapResults(resultsArray: any[]): SessionResults[] {
        if (!resultsArray) return [];
        return resultsArray.map((r) => ({
            position: Number(r.position),
            driver: { name: r.Driver.givenName + ' ' + r.Driver.familyName },
            constructor: { name: r.Constructor.name },
            grid: Number(r.grid) || 0,
            points: Number(r.points) || 0,
            times: {
                timeQ1: r.Q1 || "",
                timeQ2: r.Q2 || "",
                timeQ3: r.Q3 || "",
            },
        }));
    }

    const raceResults = mapResults(race.Results);
    const qualifyingResults = mapResults(qualifying.QualifyingResults);
    const sprintResults = mapResults(sprint.SprintResults);

    let status = raceResults.length > 0 ? 'COMPLETED' : 'UPCOMING';
    let fp1DateTime = new Date(`${start}T${raceInfo.FirstPractice.time}`);

    if (fp1DateTime < new Date()) {
        status = 'ONGOING';
    }

    if (new Date(`${raceInfo.date}T${raceInfo.time}`) < new Date()) {
        status = 'COMPLETED';
    }

    return {
        grandPrixData,
        raceResults,
        qualifyingResults,
        sprintResults,
        status: status,
    };
}

export async function getSeasonDriverChampion(season: string): Promise<string> {
    const response = await API.get(`/f1/${season}/driverStandings.json`);

    const standings = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    if (standings.length === 0) {
        return "N/D";
    }

    const champion = standings[0].Driver;

    return `${champion.givenName} ${champion.familyName}`;
}

export async function getSeasonConstructorChampion(season: string): Promise<string> {
    const response = await API.get(`/f1/${season}/constructorStandings.json`);

    const standings = response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

    if (standings.length === 0) {
        return "N/D";
    }

    const champion = standings[0].Constructor;

    return champion.name;
}

export async function getDriverStandings(season: string): Promise<Standings> {
    let response = await API.get(`/f1/${season}/driverStandings.json`);

    let standings = response.data.MRData.StandingsTable.StandingsLists;

    if (standings.length === 0) {
        let drivers = await API.get(`/f1/${season}/drivers.json`);

        const driverList = drivers.data.MRData.DriverTable.Drivers;
        
        const formattedStandings = driverList.map((driver: any) => ({
            name: `${driver.givenName} ${driver.familyName}`,
            constructor: "N/D",
            points: 0,
        }));

        return {
            standings: formattedStandings,
            lastUpdate: "LAST SEASON",
        }
    }

    standings = standings[0].DriverStandings;

    const formattedStandings = standings.map((entry: any) => ({
        name: `${entry.Driver.givenName} ${entry.Driver.familyName}`,
        constructor: entry.Constructors[0].name,
        points: parseInt(entry.points),
    }));

    response = await API.get(`/f1/${season}/last.json`);
    const lastUpdate = response.data.MRData.RaceTable.Races[0].raceName;

    return {
        standings: formattedStandings,
        lastUpdate: lastUpdate.toUpperCase(),
    };
}

export async function getConstructorStandings(season: string): Promise<Standings> {
    let response = await API.get(`/f1/${season}/constructorStandings.json`);

    let standings = response.data.MRData.StandingsTable.StandingsLists;

    if (standings.length === 0) {
        let constructors = await API.get(`/f1/${season}/constructors.json`);

        const constructorList = constructors.data.MRData.ConstructorTable.Constructors;
        
        const formattedStandings = constructorList.map((constructor: any) => ({
            name: constructor.name,
            points: 0,
        }));

        return {
            standings: formattedStandings,
            lastUpdate: "LAST SEASON",
        }
    }

    standings = standings[0].ConstructorStandings;
    const formattedStandings = standings.map((entry: any) => ({
        name: entry.Constructor.name,
        points: entry.points,
    }));

    response = await API.get(`/f1/${season}/last.json`);
    const lastUpdate = response.data.MRData.RaceTable.Races[0].raceName;

    return {
        standings: formattedStandings,
        lastUpdate: lastUpdate.toUpperCase(),
    };
}

