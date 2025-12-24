import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getDriverStandings, getConstructorStandings, Standings } from '../../services/api';
import Spinner from '../../components/spinner/Spinner';
import Header from '../header/Header';
import StandingsTitle from './StandingsTitle';
import StandingsTable from './StandingsTable';

function StandingsPage() {
    const { type } = useParams<{ type: string }>();
    const [standings, setStandings] = useState<Standings | null>(null);

    useEffect(() => {
        async function fetchStandings() {
            try {
                let data;
                if (type === 'drivers') {
                    data = await getDriverStandings();
                } else if (type === 'constructors') {
                    data = await getConstructorStandings();
                }
                setStandings(data || null);
            } catch (err) {
                console.error(err);
            }
        }

        fetchStandings();
    }, [type]);


    if (!standings) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Spinner />
            </div>
        );
    }

    const currentSeason = "2025";
    const tableType = type === 'drivers' ? 'drivers' : 'constructors';

    return (
        <>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Header currentSeason={currentSeason} backButton={true} />

                <section className="mb-8">
                    <StandingsTitle type={tableType} standings={standings} />
                    <StandingsTable type={tableType} standings={standings} />
                </section>

            </div>
        </>
    );
}
export default StandingsPage;