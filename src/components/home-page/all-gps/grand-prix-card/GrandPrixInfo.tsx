import { GrandPrixShortData } from "../../../../services/api";

interface GrandPrixInfoProps {
    gp: GrandPrixShortData;
}

function GrandPrixInfo({ gp }: GrandPrixInfoProps) {
    return (
        <>
            <h3 className="text-xl font-bold mb-2">{gp.raceName}</h3>
            <p className="text-gray-400 mb-4">{gp.circuitName}</p>
            <div className="flex items-center mb-4">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>{gp.dateRange}</span>
            </div>
        </>
    );
}

export default GrandPrixInfo;