import { Link } from "react-router-dom";

interface HeaderProps {
    seasons?: string[];
    currentSeason: string;
    backButton?: boolean;
}

function Header({ seasons, currentSeason, backButton }: HeaderProps) {
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
                <h1 className="text-3xl md:text-4xl font-black ml-4">F1 LIVE</h1>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <Link to="standings/drivers" className="bg-[#15151E] hover:bg-[#2A2A3A] px-4 py-2 rounded-lg transition">Drivers Standings</Link>

                <Link to="standings/constructors" className="bg-[#15151E] hover:bg-[#2A2A3A] px-4 py-2 rounded-lg transition">Constructors Standings</Link>
            </div>
            <div className="hidden md:block">
                <div className="bg-[#1F1F2B] rounded-full px-4 py-2 flex items-center">
                    <span className="mr-2">{currentSeason} Season</span>
                </div>
            </div>
        </header>
    );

}
export default Header;