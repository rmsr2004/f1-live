import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { getDriverStandings, getConstructorStandings } from '../../services/client/client.ts';
import Spinner from '../../components/spinner/Spinner';
import Header from '../header/Header';
import StandingsTitle from './StandingsTitle';
import StandingsTable from './StandingsTable';
import { Standings } from '../../services/client/models/Standings.ts';

function StandingsPage() {
    const { type } = useParams<{ type: string }>();
    const [searchParams] = useSearchParams();

    const season = searchParams.get("season") || "2025";
    const [standings, setStandings] = useState<Standings | null>(null);

    useEffect(() => {
        async function fetchStandings() {
            try {
                let data;
                if (type === 'drivers') {
                    data = await getDriverStandings(season);
                } else if (type === 'constructors') {
                    data = await getConstructorStandings(season);
                }
                setStandings(data || null);
            } catch (err) {
                console.error(err);
            }
        }

        fetchStandings();
    }, [type, season]);

    if (!standings) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Spinner />
            </div>
        );
    }

    const tableType = type === 'drivers' ? 'drivers' : 'constructors';

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Header currentSeason={season} backButton={true} />

            <section className="mb-8">
                <StandingsTitle type={tableType} standings={standings} />
                <StandingsTable type={tableType} standings={standings} />
            </section>
        </div>
    );
}

export default StandingsPage;