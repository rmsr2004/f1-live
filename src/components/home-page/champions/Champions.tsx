interface ChampionsProps {
    season: string;
    driverChampion: string | null;
    constructorChampion: string | null;
}

function Champions({ season, driverChampion, constructorChampion }: ChampionsProps) {
    return (
        <>
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">SEASON ENDED</h2>

                <div className="f1-card p-6">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">The {season} Season has ended</h3>
                    <p className="text-gray-400 mb-6">
                        See you next year! Here is the final world champion:
                    </p>

                    <div className="bg-[#15151E] p-4 rounded-lg flex justwify-between items-center mb-4">
                        <div>
                            <span className="text-sm text-gray-400">DRIVER WORLD CHAMPION</span>
                            <p className="font-bold text-xl">
                                {driverChampion ?? "Unknown"}
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#15151E] p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <span className="text-sm text-gray-400">CONSTRUCTOR WORLD CHAMPION</span>
                            <p className="font-bold text-xl">
                                {constructorChampion ?? "Unknown"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Champions;