import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getNextGrandPrix, getAllGrandPrixes } from "../services/api";
import { GrandPrixData, GrandPrixShortData } from "../services/api";
import Countdown from "../components/Countdown";
import Spinner from "../components/Spinner";

function HomePage() {
    const [nextGP, setNextGP] = useState<GrandPrixData | null>(null);
    const [allGPs, setAllGPs] = useState<GrandPrixShortData[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const next = await getNextGrandPrix();
            const all = await getAllGrandPrixes();

            setNextGP(next);
            setAllGPs(all);
            setLoading(false);
        }

        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <header className="flex justify-between items-center mb-8">
                        <div className="flex items-center">
                            <h1 className="text-3xl md:text-4xl font-black ml-4">F1 LIVE</h1>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                            <Link to="/standings/drivers" className="bg-[#15151E] hover:bg-[#2A2A3A] px-4 py-2 rounded-lg transition">Drivers Standings</Link>

                            <Link to="/standings/constructors" className="bg-[#15151E] hover:bg-[#2A2A3A] px-4 py-2 rounded-lg transition">Constructors Standings</Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-[#1F1F2B] rounded-full px-4 py-2 flex items-center">
                                <span className="mr-2">2025 Season</span>
                            </div>
                        </div>
                    </header>

                    {nextGP && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-6">NEXT GRAND PRIX</h2>
                            <div className="f1-card p-6">
                                <div className="flex flex-col md:flex-row justify-between">
                                    <div className="mb-6 md:mb-0">
                                        <div className="flex items-center mb-2">
                                            <div
                                                className={`${nextGP.status === 'NEXT' ? 'race-status-next' : 'race-status-ongoing'} text-xs font-bold px-3 py-1 rounded-full mr-3`}
                                            >
                                                {nextGP.status}
                                            </div>

                                            <span className="text-gray-400">ROUND {nextGP.round}</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{nextGP.raceName}</h3>
                                        <p className="text-gray-400 mb-4">{nextGP.circuitName}</p>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            <span>{nextGP.dateRange}</span>
                                        </div>
                                    </div>
                                    <Countdown targetDate={nextGP.raceDateISO ?? ""} />
                                </div>
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {nextGP.sessions.map((session, index) => (
                                        <div key={index} className={`bg-[#15151E] p-4 rounded-lg ${session.sessionName === 'RACE' ? 'md:col-span-2' : ''}`}>
                                            <span className="text-sm text-gray-400">{session.sessionName}</span>
                                            <p className="font-bold">{session.datetime}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    <div className="mb-6 border-b border-gray-700">
                        <div className="flex">
                            <button id="tab-all" className="tab-active px-6 py-3 font-bold text-lg">ALL GPs</button>
                            {/*
                    <button id="tab-completed" className="px-6 py-3 font-bold text-lg text-gray-400">COMPLETED</button>
                    <button id="tab-upcoming" className="px-6 py-3 font-bold text-lg text-gray-400">NEXT</button>
                    */}
                        </div>
                    </div>

                    <section id="race-calendar" className="mb-12">
                        <section id="race-calendar" className="mb-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {allGPs.map((gp) => (
                                    <div key={gp.round} className="f1-card">
                                        <div className="f1-red p-4">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold">ROUND {gp.round}</span>
                                                <div
                                                    className={`text-xs font-bold px-3 py-1 rounded-full ${gp.status === 'COMPLETED'
                                                        ? 'race-status-completed'
                                                        : gp.status === 'ONGOING'
                                                            ? 'race-status-ongoing'
                                                            : 'race-status-upcoming'
                                                        }`}
                                                >
                                                    {gp.status}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2">{gp.raceName}</h3>
                                            <p className="text-gray-400 mb-4">{gp.circuitName}</p>
                                            <div className="flex items-center mb-4">
                                                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                <span>{gp.dateRange}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <div>
                                                    <span className="text-sm text-gray-400">WINNER</span>
                                                    <p className="font-bold">{gp.winner}</p>
                                                </div>
                                                <Link to={`/grandprix/${gp.round}`} className="bg-[#15151E] hover:bg-[#2A2A3A] px-4 py-2 rounded-lg transition">Details</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </section>
                </>
            )}
        </div>
    );
}

export default HomePage;