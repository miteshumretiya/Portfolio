// Every word on the site lives here, sourced from Mitesh's CV.

export const site = {
  name: "Mitesh Umretiya",
  role: "Web developer & network engineer",
  shortRole: "Web Developer · Network Engineer",
  description:
    "Mitesh Umretiya is a computing graduate from IDEA College, Malta, building fast, accessible websites with a working knowledge of the networks they run on. Open to graduate roles in Malta, the EU and remote.",
  location: "Marsa, Malta",
  timeZone: "Europe/Malta",
  email: "miteshumretiya412@gmail.com",
  github: "https://github.com/miteshumretiya",
  linkedin: "https://www.linkedin.com/in/miteshumretiya/",
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Toolkit", href: "#toolkit" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  eyebrow: "Computing graduate · Class of 2026",
  status: "Open to graduate roles in Malta, the EU & remote",
  intro:
    "I build fast, usable web apps, and I know what happens to a request after it leaves the browser. That's two internships, one in web development and one configuring live network gear at Reliance Jio.",
  bio: "Based in Marsa, Malta. Originally from Gujarat, India. Most at home in Python, PHP and SQL, and not afraid of a router CLI.",
};

export const marquee = [
  "Web development",
  "Network engineering",
  "Python",
  "Computer vision",
  "PHP & MySQL",
  "Data analytics",
  "MERN stack",
  "Routing & switching",
  "SQL Server",
  ".NET",
];

export const about = {
  statement:
    "I'm a computing graduate from IDEA College, Malta, who moved from Gujarat to study here. I like work that sits where software meets infrastructure: the storefront, the database behind it, and the network that keeps both up at 3am.",
  stats: [
    { value: 8.9, decimals: 1, suffix: "/10", label: "Diploma CGPA, Computer Engineering" },
    { value: 2, decimals: 0, suffix: "", label: "Industry internships, web and network" },
    { value: 5, decimals: 0, suffix: "", label: "Certifications, Deloitte to Google Cloud" },
    { value: 7, decimals: 0, suffix: "+", label: "Projects shipped, from CV apps to e-commerce" },
  ],
  principles: [
    {
      title: "Data first",
      body: "I'd rather measure than guess. My analytics training with Deloitte and LinkedIn Learning shows up in how I debug.",
    },
    {
      title: "Reliability is a feature",
      body: "Change management at Jio taught me that the boring, repeatable fix beats the clever one.",
    },
    {
      title: "Learn it properly",
      body: "From MediaPipe to MS SQL Server, I pick up new tools quickly and stick with them until they make sense.",
    },
  ],
};

export type Project = {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  stack: string[];
  image: string;
  alt: string;
  href?: string;
  linkLabel?: string;
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "air-canvas",
    title: "Air Canvas",
    kind: "Computer vision",
    summary:
      "Draw on screen with nothing but your hand. MediaPipe tracks 21 landmarks in real time, and Euclidean-distance gestures switch between drawing and a virtual toolbar for colour and brush size.",
    stack: ["Python", "MediaPipe", "OpenCV", "NumPy"],
    image: "/images/work/air-canvas.webp",
    alt: "Air Canvas interface: a lime hand-landmark skeleton drawing a glowing stroke beneath a virtual colour toolbar.",
    href: "https://www.linkedin.com/posts/miteshumretiya_mediapipe-opencv-python-activity-7411527718208720897-YtHp",
    linkLabel: "Watch the demo",
    accent: "#c6f432",
  },
  {
    slug: "artisanbazaar",
    title: "ArtisanBazaar",
    kind: "Full-stack e-commerce",
    summary:
      "A marketplace for Maltese artists and makers, with secure sessions, a live-updating cart, checkout and a role-based admin dashboard for products, users and stock.",
    stack: ["PHP", "MySQL", "JavaScript", "HTML5 / CSS3"],
    image: "/images/work/artisanbazaar.webp",
    alt: "ArtisanBazaar storefront showing hand-painted tiles, glassware and lace products on a Maltese tile background.",
    href: "https://artisanbazaar.netlify.app/",
    linkLabel: "Visit live site",
    accent: "#f2c230",
  },
  {
    slug: "weather",
    title: "Real-time Weather",
    kind: "Web app · API",
    summary:
      "A live weather tracker that turns raw API data into a calm, glanceable dashboard: current conditions, an hourly outlook and the details you actually check.",
    stack: ["API integration", "Real-time data", "Responsive UI"],
    image: "/images/work/weather.webp",
    alt: "Weather dashboard for Valletta showing 24 degrees, an hourly temperature curve and forecast tiles.",
    accent: "#7fd3ff",
  },
  {
    slug: "netflix-clone",
    title: "Netflix Clone",
    kind: "Front-end rebuild",
    summary:
      "A from-scratch rebuild of a streaming platform's browse experience: the featured billboard, scrolling title rows and poster grids that hold up on any screen.",
    stack: ["Front-end", "Layout systems", "Responsive UI"],
    image: "/images/work/streambox.webp",
    alt: "Dark streaming interface with a red featured-series banner and a row of film posters.",
    accent: "#ff5a36",
  },
  {
    slug: "drive-clone",
    title: "Google Drive Clone",
    kind: "Full-stack storage",
    summary:
      "Cloud file storage modelled on the real thing, with folders, uploads, recent files and a storage meter. A deep dive into auth, file handling and data design.",
    stack: ["Full-stack", "File handling", "Authentication"],
    image: "/images/work/drive.webp",
    alt: "Cloud drive interface with folders, a file list and an upload progress toast.",
    accent: "#4f8cff",
  },
  {
    slug: "music-library",
    title: "Music Library System",
    kind: "Database application",
    summary:
      "A library manager for albums, artists and playlists, built on a relational schema with search and a now-playing view.",
    stack: ["Database design", "SQL", "CRUD"],
    image: "/images/work/music.webp",
    alt: "Music library app with album artwork, a recently-added track list and a waveform player.",
    accent: "#ff7a4d",
  },
];

export const experience = [
  {
    role: "Network Engineer Trainee",
    company: "Reliance Jio Infocomm Ltd",
    place: "Gujarat, India",
    period: "Feb 2024 – Jun 2024",
    points: [
      "Configured and installed routers, switches, firewalls, VPNs and load balancers.",
      "Ran network maintenance, system upgrades and security patching.",
      "Monitored performance, availability and capacity-planning metrics.",
      "Provided Level 2/3 technical support and troubleshooting.",
      "Followed change-management and configuration policy to keep the network stable.",
    ],
    tags: ["Routing", "Switching", "Firewalls", "VPN", "QoS", "Monitoring"],
  },
  {
    role: "Web Developer Intern",
    company: "Infinity Digital",
    place: "Gujarat, India",
    period: "Oct 2023 – Jan 2024",
    points: [
      "Designed and built responsive websites and web apps with HTML, CSS, PHP and JavaScript.",
      "Built user-friendly interfaces with a focus on performance and usability.",
      "Worked alongside designers and developers to ship working digital products.",
      "Learned full-stack workflows end to end, from mock-up to deploy.",
    ],
    tags: ["HTML", "CSS", "PHP", "JavaScript", "Responsive UI"],
  },
];

export const toolkit = [
  { group: "Programming", items: ["Python", "Java", "C", "C++", ".NET", "PHP", "JavaScript"] },
  { group: "Data", items: ["SQL", "MS SQL Server", "MySQL", "MongoDB", "Data analytics"] },
  { group: "Web", items: ["HTML", "CSS", "React", "Node / Express", "Responsive design"] },
  { group: "Networking", items: ["Routers", "Switches", "Firewalls", "VPN", "QoS", "Monitoring"] },
  { group: "Tools", items: ["Git & GitHub", "OpenCV", "MediaPipe", "NumPy", "Network tools"] },
];

export const education = [
  {
    title: "BSc in Computing",
    school: "IDEA College",
    place: "Mosta, Malta",
    period: "Graduated 2026",
    note: "Programming, databases, web and networking. This degree is behind most of the work on this page.",
  },
  {
    title: "Diploma in Computer Engineering",
    school: "N. G. Patel Polytechnic (GTU)",
    place: "Gujarat, India",
    period: "CGPA 8.9 / 10",
    note: "Final-year project: a full-stack MERN system focused on database integration, reliability and performance.",
  },
];

export const certifications = [
  { title: "Data Analytics Job Simulation", issuer: "Deloitte Australia" },
  { title: "Learning Data Analytics, Parts 1\u00a0&\u00a02", issuer: "LinkedIn Learning" },
  { title: "Introduction to Generative AI", issuer: "Google Cloud · Coursera" },
  { title: "5G for Everyone", issuer: "Qualcomm · Coursera" },
  { title: "Python Programming Language", issuer: "Softech Computers" },
];
