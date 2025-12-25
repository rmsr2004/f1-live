import { GrandPrixShortData } from "@client/models/GrandPrixShortData.ts";

import GrandPrixCard from "./grand-prix-card/GrandPrixCard";

interface AllGPsProps {
    season: string;
    allGPs: GrandPrixShortData[];
}

function AllGPs({ season, allGPs }: AllGPsProps) {
    return (
        <>
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
                            <GrandPrixCard season={season} gp={gp} />
                        ))}
                    </div>
                </section>
            </section>
        </>
    );
}

export default AllGPs;