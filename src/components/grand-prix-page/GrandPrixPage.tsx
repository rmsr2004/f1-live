import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getGrandPrixResults, GrandPrixResults } from '../../services/api';
import ResultsSection from '../results/ResultsSection';
import Spinner from '../spinner/Spinner';
import Header from '../header/Header';
import GrandPrixCard from './GrandPrixCard';
import GrandPrixSchedule from './GrandPrixSchedule';

function GrandPrix() {
    const { round } = useParams<{ round: string }>();
    const [data, setData] = useState<GrandPrixResults>();

    useEffect(() => {
        if (!round) return;

        async function fetchData() {
            try {
                const results = await getGrandPrixResults(Number(round));
                setData(results);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [round]);

    if (!data) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Spinner />
            </div>
        );
    }

    const { grandPrixData, raceResults, qualifyingResults, sprintResults, status } = data;
    const currentSeason = "2025";

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Header currentSeason={currentSeason} backButton={true} />

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

export default GrandPrix;