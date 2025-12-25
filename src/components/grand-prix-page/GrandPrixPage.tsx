import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { getGrandPrixResults } from '@client/client.ts';
import { GrandPrixResults } from '@client/models/GrandPrixResults.ts';

import ResultsSection from '@components/results/ResultsSection';
import Spinner from '@components/spinner/Spinner';
import Header from '@components/header/Header';

import GrandPrixCard from './GrandPrixCard';
import GrandPrixSchedule from './GrandPrixSchedule';

function GrandPrixPage() {
    const { round } = useParams<{ round: string }>();
    const [searchParams] = useSearchParams();
    const season = searchParams.get("season") || "2026";

    const [data, setData] = useState<GrandPrixResults>();

    useEffect(() => {
        if (!round) return;

        async function fetchData() {
            try {
                const results = await getGrandPrixResults(season, Number(round));
                setData(results);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [round, season]);

    if (!data) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Spinner />
            </div>
        );
    }

    const { grandPrixData, raceResults, qualifyingResults, sprintResults, status } = data;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Header currentSeason={season} backButton={true} />

            <GrandPrixCard
                grandPrixData={grandPrixData}
                status={status}
                raceResults={raceResults}
                qualifyingResults={qualifyingResults}
            />

            <GrandPrixSchedule grandPrixData={grandPrixData} />

            <ResultsSection
                qualifyingResults={qualifyingResults}
                raceResults={raceResults}
                {...(grandPrixData.sessions.some(session => session.sessionName === 'SPRINT') && sprintResults && {
                    sprintResults,
                })}
            />
        </div>
    );
}

export default GrandPrixPage;