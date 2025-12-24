import { GrandPrixShortData } from "../../../../services/api";

interface GrandPrixCardHeaderProps {
    gp: GrandPrixShortData;
}

function GrandPrixCardHeader({ gp }: GrandPrixCardHeaderProps) {
    return (
        <>
            <div className="f1-red p-4">
                <div className="flex justify-between items-center">
                    <span className="font-bold">ROUND {gp.round}</span>
                    <div
                        className={`text-xs font-bold px-3 py-1 rounded-full ${gp.status === 'COMPLETED'
                            ? 'race-status-completed'
                            : gp.status === 'ONGOING'
                                ? 'race-status-ongoing'
                                : 'race-status-upcoming'
                            }`}
                    >
                        {gp.status}
                    </div>
                </div>
            </div>
        </>
    );
}

export default GrandPrixCardHeader;