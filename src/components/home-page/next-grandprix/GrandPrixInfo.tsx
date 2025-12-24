import { GrandPrixData } from "../../../services/api";

interface GrandPrixInfoProps {
    nextGP: GrandPrixData;
}

function GrandPrixInfo({ nextGP }: GrandPrixInfoProps) {
    return (
        <>
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
        </>
    );
}

export default GrandPrixInfo;