import { Link } from "react-router-dom";
import { GrandPrixShortData } from "../../../../services/client/models/GrandPrixShortData.ts";
import GrandPrixInfo from "./GrandPrixInfo";
import GrandPrixCardHeader from "./GrandPrixCardHeader";

interface GrandPrixCardProps {
    season: string;
    gp: GrandPrixShortData;
}

function GrandPrixCard({ season, gp }: GrandPrixCardProps) {
    return (
        <div key={gp.round} className="f1-card">
            <GrandPrixCardHeader gp={gp} />
            <div className="p-6">
                <GrandPrixInfo gp={gp} />
                <div className="flex justify-between">
                    <div>
                        <span className="text-sm text-gray-400">WINNER</span>
                        <p className="font-bold">{gp.winner}</p>
                    </div>
                    <Link to={`/grandprix/${gp.round}?season=${season}`} className="bg-[#15151E] hover:bg-[#2A2A3A] px-4 py-2 rounded-lg transition">Details</Link>
                </div>
            </div>
        </div>
    );
}

export default GrandPrixCard;