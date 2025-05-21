import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDriverStandings, getConstructorStandings, Standings } from '../services/api';

function getTeamColorClass(teamName: string): string {
    const map: Record<string, string> = {
        'Red Bull': 'team-color-redbull',
        'Ferrari': 'team-color-ferrari',
        'Mercedes': 'team-color-mercedes',
        'McLaren': 'team-color-mclaren',
        'Aston Martin': 'team-color-aston',
        'Alpine F1 Team': 'team-color-alpine',
        'Williams': 'team-color-williams',
        'Sauber': 'team-color-sauber',
        'RB F1 Team': 'team-color-rb',
        'Haas F1 Team': 'team-color-haas',
    };

    return map[teamName];
}

function StandingsPage() {
    const { type } = useParams<{ type: string }>();
    const [standings, setStandings] = useState<Standings | null>(null);

    useEffect(() => {
        async function fetchStandings() {
            try {
                let data;
                if (type === 'drivers') {
                    data = await getDriverStandings();
                    console.log('Driver Standings:', data);
                } else if (type === 'constructors') {
                    data = await getConstructorStandings();
                    console.log('Constructor Standings:', data);
                }
                setStandings(data || null);
            } catch (err) {
                console.error(err);
            }
        }

        fetchStandings();
    }, [type]);

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
                {type === 'drivers' ? (
                    <Link to="/standings/constructors" className="bg-[#15151E] hover:bg-[#2A2A3A] px-4 py-2 rounded-lg transition">Constructors Standings</Link>
                ) : (
                    <Link to="/standings/drivers" className="bg-[#15151E] hover:bg-[#2A2A3A] px-4 py-2 rounded-lg transition">Drivers Standings</Link>
                )}
                <div className="hidden md:block bg-[#1F1F2B] rounded-full px-4 py-2">
                    <span>2025 Season</span>
                </div>
            </header>

            <section className="mb-8">
                <div className="mb-6 md:mb-0">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        {type === 'drivers' ? 'DRIVERS STANDINGS' : 'CONSTRUCTORS STANDINGS'}
                    </h3>
                    <p className="text-gray-400 mb-4">{type === 'drivers' ? 'DRIVERS STANDINGS AFTER' : 'CONSTRUCTORS STANDINGS AFTER'} {standings?.lastUpdate}</p>
                </div>
                <div className="f1-card overflow-x-auto">
                    <div id="results" className="results-table">
                        <table className="w-full">
                            <thead className="bg-[#15151E]">
                                <tr>
                                    <th className="px-3 py-4 text-left">Pos</th>
                                    {type === 'drivers' && (
                                        <th className="pth3 py-4 text-left">Driver</th>                                    
                                    )}
                                    <th className="px-3 py-4 text-left">Team</th>
                                    <th className="px-3 py-4 text-left">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {standings?.standings.map((result, index) => (
                                    <tr key={index} className="result-row">
                                        <td className="px-3 py-4 font-bold">{index + 1}</td>

                                        {type === 'drivers' && (
                                            <td className="px-3 py-4">
                                                <div className="flex items-center">
                                                    <div className={`w-1 h-6 mr-3 ${getTeamColorClass(result.constructor ?? '')}`}></div>
                                                    <span>{result.name}</span>
                                                </div>
                                            </td>
                                        )}

                                        <td className="px-3 py-4">
                                            <div className="flex items-center">
                                                {type === 'constructors' && (
                                                    <div className={`w-1 h-6 mr-3 ${getTeamColorClass(result.name)}`}></div>
                                                )}
                                                <span>{result.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4">{result.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

        </div>
    );
}
export default StandingsPage;