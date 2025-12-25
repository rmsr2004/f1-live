import { Standings } from "@client/models/Standings.ts";

interface StandingsTitleProps {
    type: 'drivers' | 'constructors';
    standings: Standings | null;
}

function StandingsTitle({ type, standings }: StandingsTitleProps) {
    return (
        <>
            <div className="mb-6 md:mb-0">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    {type === 'drivers' ? 'DRIVERS STANDINGS' : 'CONSTRUCTORS STANDINGS'}
                </h3>
                <p className="text-gray-400 mb-4">{type === 'drivers' ? 'DRIVERS STANDINGS AFTER' : 'CONSTRUCTORS STANDINGS AFTER'} {standings?.lastUpdate}</p>
            </div>
        </>
    );
}

export default StandingsTitle;