import { useEffect, useState } from "react";

import { getNextGrandPrix, getAllGrandPrixes, getSeasonDriverChampion, getSeasonConstructorChampion } from "../../services/client/client.ts";
import { GrandPrixData } from "../../services/client/models/GrandPrixData.ts";

import Spinner from "../spinner/Spinner";
import Header from "../header/Header";
import NextGrandPrix from "./next-grandprix/NextGrandPrix";
import AllGPs from "./all-gps/AllGPs";
import { GrandPrixShortData } from "../../services/client/models/GrandPrixShortData.ts";
import { useSearchParams } from "react-router-dom";
import Champions from "./champions/Champions.tsx";

function HomePage() {
    const [searchParams] = useSearchParams();

    const seasonFromUrl = searchParams.get("season");

    const [season, setSeason] = useState(
        seasonFromUrl || "2026"
    );

    const [nextGP, setNextGP] = useState<GrandPrixData | null>(null);
    const [allGPs, setAllGPs] = useState<GrandPrixShortData[]>([]);
    const [driverChampion, setDriverChampion] = useState<string | null>(null);
    const [constructorChampion, setConstructorChampion] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setDriverChampion(null);
            setConstructorChampion(null);

            const next = await getNextGrandPrix(season);

            if (!next) {
                setDriverChampion(await getSeasonDriverChampion(season));
                setConstructorChampion(await getSeasonConstructorChampion(season));
            }

            const all = await getAllGrandPrixes(season);

            setNextGP(next);
            setAllGPs(all);
            setLoading(false);
        }

        fetchData();
    }, [season]);

    useEffect(() => {
        const seasonFromUrl = searchParams.get("season");
        if (seasonFromUrl && seasonFromUrl !== season) {
            setSeason(seasonFromUrl);
        }
    }, [searchParams]);

    return (
        <>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {isLoading ? (
                    <Spinner />
                ) : (
                    <>
                        <Header currentSeason={season} onSeasonChange={setSeason} />

                        {nextGP ? (
                            <NextGrandPrix nextGP={nextGP} />
                        ) : (
                            <Champions season={season} driverChampion={driverChampion} constructorChampion={constructorChampion} />
                        )}
                        <AllGPs season={season} allGPs={allGPs} />
                    </>
                )}
            </div>
        </>
    );
}

export default HomePage;