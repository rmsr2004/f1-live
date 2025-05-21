import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getGrandPrixResults, GrandPrixResults } from '../services/api';
import ResultsSection from '../components/ResultsSection';

function getTeamColorClass(teamName: string): string {
    const map: Record<string, string> = {
        'Red Bull': 'team-color-redbull',
        'Ferrari': 'team-color-ferrari',
        'Mercedes': 'team-color-mercedes',
        'McLaren': 'team-color-mclaren',
        'Aston Martin': 'team-color-aston',
        'Alpine': 'team-color-alpine',
        'Williams': 'team-color-williams',
        'Kick Sauber': 'team-color-sauber',
        'RB': 'team-color-rb',
        'Haas F1 Team': 'team-color-haas',
    };

    return map[teamName];
}

function GrandPrix() {
    const { round } = useParams<{ round: string }>();
    const [data, setData] = useState<GrandPrixResults | null>(null);

    useEffect(() => {
        if (!round) return;

        async function fetchData() {
            try {
                const results = await getGrandPrixResults(Number(round));
                setData(results);
                console.log('Fetched data:', results);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [round]);

    if (!data) return <div className="text-white">Loading...</div>;

    const { grandPrixData, raceResults, qualifyingResults, sprintResults, status } = data;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                    <Link to="/">
                        <button id="back-button" className="mr-4 bg-[#1F1F2B] hover:bg-[#2A2A3A] p-2 rounded-full transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-black ml-4">F1-LIVE</h1>
                </div>
                <div className="hidden md:block bg-[#1F1F2B] rounded-full px-4 py-2">
                    <span>2025 Season</span>
                </div>
            </header>

            <section className="mb-8">
                <div className="f1-card">
                    <div className="f1-red p-4">
                        <div className="flex justify-between items-center">
                            <span className="font-bold">ROUND {grandPrixData.round}</span>
                            <div className={`${status === 'COMPLETED' ? 'race-status-completed' : 'race-status-upcoming'} text-xs font-bold px-3 py-1 rounded-full`}>
                                {status}
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{grandPrixData.raceName}</h2>
                                <p className="text-gray-400 mb-4">{grandPrixData.circuitName}</p>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{grandPrixData.dateRange}</span>
                                </div>
                            </div>
                            {status === 'COMPLETED' && raceResults.length > 0 && (
                                <div className="mt-4 md:mt-0 flex flex-col items-end">
                                    <div className="flex items-center mb-2">
                                        <span className="text-sm text-gray-400 mr-2">WINNER:</span>
                                        <span className="font-bold">{raceResults[0].driver.name}</span>
                                        <div className={`w-3 h-3 ml-2 rounded-full ${getTeamColorClass(raceResults[0].constructor.name)}`}></div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-400 mr-2">POLE POSITION:</span>
                                        <span className="font-bold">{qualifyingResults[0]?.driver.name ?? 'N/A'}</span>
                                        <div className={`w-3 h-3 ml-2 rounded-full ${getTeamColorClass(qualifyingResults[0].constructor.name)}`}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">SCHEDULE</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {grandPrixData.sessions.map((session, index) => (
                        <div
                            key={index}
                            className={`f1-card p-4 ${session.sessionName === 'RACE' ? 'md:col-span-2' : ''}`}
                        >
                            <span className="text-sm text-gray-400">{session.sessionName}</span>
                            <p className="font-bold">{session.datetime}</p>
                        </div>
                    ))}
                </div>
            </section>

            <ResultsSection
                qualifyingResults={qualifyingResults}
                raceResults={raceResults}
                sprintResults={sprintResults}
            />
        </div>
    );
}

export default GrandPrix;