import { Link, useSearchParams } from "react-router-dom";

interface HeaderProps {
    currentSeason: string;
    backButton?: boolean;
    onSeasonChange?: (season: string) => void;
}

function Header({ currentSeason, backButton, onSeasonChange }: HeaderProps) {
    const seasons = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010"];

    const [searchParams, setSearchParams] = useSearchParams();
    const seasonFromUrl = searchParams.get("season");
    const season = seasonFromUrl || currentSeason;

    const handleClickHome = () => {
        setSearchParams({ season: "2026" });
    };

    return (
        <header className="flex justify-between items-center mb-8">
            <div className="flex items-center">
                {backButton && (
                    <Link to="/">
                        <button id="back-button" className="mr-4 bg-[#1F1F2B] hover:bg-[#2A2A3A] p-2 rounded-full transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </Link>
                )}
                <Link to="/" onClick={handleClickHome}>
                    <h1 className="text-3xl md:text-4xl font-black ml-4 cursor-pointer">F1 LIVE</h1>
                </Link>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <Link
                    to={`/standings/drivers?season=${season}`}
                    className="bg-[#15151E] hover:bg-[#2A2A3A] px-4 py-2 rounded-lg transition"
                >
                    Drivers Standings
                </Link>

                <Link
                    to={`/standings/constructors?season=${season}`}
                    className="bg-[#15151E] hover:bg-[#2A2A3A] px-4 py-2 rounded-lg transition"
                >
                    Constructors Standings
                </Link>
            </div>
            {seasons && onSeasonChange && (
                <div className="hidden md:block">
                    <select
                        value={currentSeason}
                        onChange={(e) => {
                            onSeasonChange(e.target.value);
                            setSearchParams({ season: e.target.value });
                        }}
                        className="bg-[#1F1F2B] text-white rounded-full px-4 py-2 outline-none cursor-pointer hover:bg-[#2A2A3A] transition"
                    >
                        {seasons.map((season) => (
                            <option key={season} value={season}>
                                {season} Season
                            </option>
                        ))}
                    </select>
                </div>
            )}

        </header>
    );
}

export default Header;