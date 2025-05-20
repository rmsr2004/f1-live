import axios from 'axios';

const API_URL = 'https://api.jolpi.ca/ergast/';

interface Sessions {
    sessionName: string;
    datetime: string;
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
    circuitName: string;
    dateRange: string;
    raceDateISO: string;
    sessions: Sessions[];
}

export interface GrandPrixShortData {
    round: number;
    raceName: string;
    circuitName: string;
    dateRange: string;
    winner: string;
    status: string;
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
        { key: 'Qualifying', name: 'QUALIFYING' },
        { key: 'Sprint', name: 'Sprint' },
        { key: 'SprintQualifying', name: 'Sprint Qualifying' },
    ];

    const sessions = sessionMappings
        .filter(({ key }) => race[key])
        .map(({ key, name }) => {
            const dateStr = race[key]!.date;
            const timeStr = race[key]!.time;

            return {
                sessionName: name,
                datetime: formatDateTime(dateStr, timeStr),
            };
        });

    sessions.push({
        sessionName: 'RACE',
        datetime: formatDateTime(race.date, race.time),
    })

    const start = race.FirstPractice.date;
    const end = race.date;
    const dateRange = formatDateRange(start, end);

    const grandPrixData: GrandPrixData = {
        round: race.round,
        raceName: race.raceName.toUpperCase(),
        circuitName: race.Circuit.circuitName + ", " + race.Circuit.Location.locality,
        dateRange: dateRange,
        raceDateISO: getISOStringFromDateTimePT(race.date, race.time),
        sessions: sessions,
    };

    return grandPrixData;
}

export async function getAllGrandPrixes() {
    const response = await API.get('/f1/2025.json');
    const races = response.data.MRData.RaceTable.Races;

    let index = 1;

    const allGrandPrixesPromises = races.map(async (race: any) => {
        const start = race.FirstPractice?.date ?? race.date;
        const end = race.date;
        const dateRange = formatDateRange(start, end);

        const raceDateTime = new Date(`${race.date}T${race.time}`);
        const now = new Date();

        const status = raceDateTime < now ? 'COMPLETED' : 'NEXT';

        const winner = status === 'COMPLETED' ? await getRaceWinner(index++) : "N/D";

        return {
            round: race.round,
            raceName: race.raceName.toUpperCase(),
            circuitName: `${race.Circuit.circuitName}, ${race.Circuit.Location.locality}`,
            dateRange: dateRange,
            winner: winner,
            status: status,
        };
    });

    const allGrandPrixes = await Promise.all(allGrandPrixesPromises);

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

    const start = race.FirstPractice.date;
    const end = race.date;
    const dateRange = formatDateRange(start, end);

    const grandPrixData: GrandPrixData = {
        round: race.round,
        raceName: race.raceName,
        circuitName: race.Circuit.circuitName + ", " + race.Circuit.Location.locality,
        dateRange: dateRange,
        sessions: sessions,
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

async function getRaceWinner(round: number) {
    const response = await API.get(`/f1/2025/${round}/results.json`);

    if (!response.data.MRData.RaceTable.Races[0]) {
        return "N/D";
    }

    const winner = response.data.MRData.RaceTable.Races[0].Results[0].Driver;

    return `${winner.givenName} ${winner.familyName}`;

}

function getISOStringFromDateTimePT(date: string, time: string): string {
    const dateTime = new Date(`${date}T${time}`);
    const utcDate = new Date(
        dateTime.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' })
    );
    return utcDate.toISOString();
}

function formatDateTime(date: string, time: string): string {
    const dt = new Date(`${date}T${time}`);
    const formatter = new Intl.DateTimeFormat('en-EN', {
        weekday: 'short',
        day: '2-digit',
        month: 'long',
        timeZone: 'Europe/Lisbon',
    });
    const weekdayDayMonth = formatter.format(dt).replace('.', '').replace(/^./, c => c.toUpperCase());
    const hourMinute = dt.toLocaleTimeString('pt-PT', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Lisbon',
    });
    return `${weekdayDayMonth} - ${hourMinute}`;
}

function formatDateRange(startDateStr: string, endDateStr: string): string {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const dayStart = startDate.getDate();
    const dayEnd = endDate.getDate();

    const month = startDate.toLocaleString('en-EN', { month: 'long' });
    const year = startDate.getFullYear();

    return `${dayStart}-${dayEnd} ${capitalize(month)} ${year}`;
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
