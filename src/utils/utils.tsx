export default function getTeamColorClass(teamName: string): string {
    const map: Record<string, string> = {
        'Red Bull': 'team-color-redbull',
        'Ferrari': 'team-color-ferrari',
        'Mercedes': 'team-color-mercedes',
        'McLaren': 'team-color-mclaren',
        'Aston Martin': 'team-color-aston',
        'Alpine F1 Team': 'team-color-alpine',
        'Williams': 'team-color-williams',
        'Sauber': 'team-color-sauber',
        'RB F1 Team': 'team-color-rb',
        'Haas F1 Team': 'team-color-haas',
    };

    return map[teamName];
}