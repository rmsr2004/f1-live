# F1 LIVE

> Linux desktop application to follow the current Formula 1 season in real-time.  
> Built with React, TypeScript, and Tauri, focusing on a smooth experience, modern interface, and up-to-date data.

---

## Overview

**F1 LIVE** is a desktop app providing detailed information about the Formula 1 season, including:

- Next Grand Prix with countdown timer;  
- Full calendar of races with status (completed, upcoming);  
- Race, sprint and qualifying session results;  
- Updated driver and constructor standings;  
- Intuitive navigation between pages to explore each GP’s details;  
- Modern, responsive UI styled with Tailwind CSS.

---

## Technologies Used

- **Frontend:** React + TypeScript + Tailwind CSS  
- **Desktop:** Tauri (Rust) for packaging (Linux .deb)  
- **API:** Consumes [jolpica-f1](https://github.com/jolpica/jolpica-f1?tab=readme-ov-file) REST API for live season data
- **Build:** Cargo, Vite, npm 
- **Distribution:** `.deb` packages for Ubuntu/Debian

---

## Key Features

- Fetch and display the next Grand Prix with detailed sessions and real-time countdown;  
- List all GPs in the season with status, winners, and relevant details;  
- View current driver and constructor standings with automatic updates;  
- Smooth page navigation using React Router;  
- App icons and shortcuts integrated for native system installation.

---

## Installation & Usage

### Linux (Ubuntu/Debian)

1. Download the `.deb` package from `release/`.

2. Install the package with:

```bash
sudo apt install ./f1-live_0.1.0_amd64.deb
```

3. Launch the app from the system menu or via terminal:
```bash
f1-live
```

## Development

1. Clone the repository:
```bash
git clone https://github.com/rmsr2004/f1-live.git
cd f1-live
```

2. Install frontend dependencies:
```bash
npm install
```

3. Run the app in development mode:
```bash
npm run tauri dev
```

## Project Structure
```bash
├── src/                    # React + TypeScript frontend code
├── src-tauri/              # Rust backend + Tauri config
│   ├── icons/              # App icons in multiple resolutions
│   ├── tauri.conf.json     # Build and bundle configuration
│   └── main.rs             # Rust backend integration code
├── package.json            # Frontend configuration
├── README.md               # Project documentation
└── ...
```

## Contributing

Contributions are welcome! Feel free to open issues and pull requests for improvements, bug fixes, or new features.

## Future Plan

Develop a mobile app using React Native

## License

MIT License © 2025 Rodrigo Rodrigues

## Contact

Rodrigo Rodrigues - rodrigomiguelsr2004@gmail.com

Github: https://github.com/rmsr2004.com

## 

This project was developed as a personal app to follow the Formula 1 season live with modern technologies and usability in mind.

[Home Page](assets/homepage.png)

[Grand Prix Details](assets/grandprix.png)

[Standings](assets/standings.png)
