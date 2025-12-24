import { useEffect, useState } from "react";

import { getNextGrandPrix, getAllGrandPrixes } from "../../services/api";
import { GrandPrixData, GrandPrixShortData } from "../../services/api";
import Spinner from "../spinner/Spinner";
import Header from "../header/Header";
import NextGrandPrix from "./next-grandprix/NextGrandPrix";
import AllGPs from "./all-gps/AllGPs";

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

    const champion = "Lando Norris";
    const currentSeason = "2025";

    return (
        <>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {isLoading ? (
                    <Spinner />
                ) : (
                    <>
                        <Header currentSeason={currentSeason} />

                        {nextGP ? (
                            <NextGrandPrix nextGP={nextGP} />
                        ) : (
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold mb-6">SEASON ENDED</h2>

                                <div className="f1-card p-6">
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4">The 2025 Season has ended</h3>
                                    <p className="text-gray-400 mb-6">
                                        See you next year! Here is the final world champion:
                                    </p>

                                    <div className="bg-[#15151E] p-4 rounded-lg flex justify-between items-center">
                                        <div>
                                            <span className="text-sm text-gray-400">WORLD CHAMPION</span>
                                            <p className="font-bold text-xl">
                                                {champion ?? "Unknown"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                        <AllGPs allGPs={allGPs} />
                    </>
                )}
            </div>
        </>
    );
}

export default HomePage;