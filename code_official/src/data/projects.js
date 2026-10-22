export const projects = [
  {
    id: 1,
    slug: 'meal-platform',
    title: 'MEAL Platform',
    category: 'Software',
    type: 'Digital Platform',
    year: '2026',
    description:
      'An intelligent monitoring, evaluation, accountability and learning platform designed to help organizations collect, analyze and act on program data.',
    image: '/projects/meal-platform.jpg',
    technologies: ['React', 'AI', 'Data'],
    featured: true,
    challenge:
      'Organizations needed a way to bring fragmented monitoring data, reporting processes and accountability workflows into a single digital system.',
    approach:
      'We mapped the user journey across field teams, program managers and leadership stakeholders to design a structured workflow that could scale with real usage.',
    solution:
      'The result is a modern digital platform that centralizes data collection, analysis and reporting while keeping the experience clear, collaborative and aligned to operational realities.',
    outcome:
      'A more connected system for program oversight, reporting and learning across teams and stakeholders.',
    gallery: [
      '/projects/meal-platform.jpg',
      '/projects/meal-platform.jpg',
      '/projects/meal-platform.jpg',
    ],
  },
  {
    id: 2,
    slug: 'nyapui-radio',
    title: 'Nyapui Radio',
    category: 'Mobile',
    type: 'Digital Media Platform',
    year: '2025',
    description:
      'A modern digital radio experience connecting listeners with programs, podcasts, news and community voices.',
    image: '/projects/nyapui-radio.jpg',
    technologies: ['Mobile', 'Audio', 'UX'],
    featured: false,
    challenge:
      'The audience needed a simpler, more engaging way to discover live content, podcasts and community stories through a mobile experience.',
    approach:
      'We designed the product around listening behavior, content discovery and accessibility so the experience felt immediate and easy to navigate.',
    solution:
      'A mobile-first listening interface that organizes content into clear categories, supports live and on-demand experiences, and strengthens audience connection.',
    outcome:
      'A digital media product that feels warm, accessible and built around community listening habits.',
    gallery: [
      '/projects/nyapui-radio.jpg',
      '/projects/nyapui-radio.jpg',
      '/projects/nyapui-radio.jpg',
    ],
  },
  {
    id: 3,
    slug: 'etu-elibrary',
    title: 'ETU eLibrary',
    category: 'Software',
    type: 'Education Platform',
    year: '2025',
    description:
      'A digital learning and resource platform designed to make educational materials easier to access.',
    image: '/projects/etu-elibrary.jpg',
    technologies: ['Web', 'Education', 'Data'],
    featured: false,
    challenge:
      'Educational resources were spread across fragmented systems, making it harder for learners and institutions to access the right materials quickly.',
    approach:
      'We focused on information architecture, discoverability and a clean content experience that could support learning at different levels.',
    solution:
      'A structured digital library that makes resources easier to browse, manage and use across education-focused contexts.',
    outcome:
      'A clearer learning experience with improved access to digital resources and educational content.',
    gallery: [
      '/projects/etu-elibrary.jpg',
      '/projects/etu-elibrary.jpg',
      '/projects/etu-elibrary.jpg',
    ],
  },
  
  {
    id: 5,
    slug: 'nyapui-school',
    title: 'Nyapui School',
    category: 'Web',
    type: 'Education Website',
    year: '2024',
    description:
      'A modern digital presence designed to communicate the school\'s mission, academics and opportunities.',
    image: '/projects/nyapui-school.jpg',
    technologies: ['Web', 'Content', 'Strategy'],
    featured: false,
    challenge:
      'The school needed a stronger online presence that could reflect its mission and better support how families and partners engage with it.',
    approach:
      'We developed a content structure and visual system that makes the school feel welcoming, credible and future-focused.',
    solution:
      'A clean and modern website experience built around clarity, storytelling and easy access to key information.',
    outcome:
      'A digital front door that better communicates who the school is and what it offers.',
    gallery: [
      '/projects/nyapui-school.jpg',
      '/projects/nyapui-school.jpg',
      '/projects/nyapui-school.jpg',
    ],
  },
  {
    id: 6,
    slug: 'connect-sierra-leone',
    title: 'Connect Sierra Leone',
    category: 'Web',
    type: 'Organization Website',
    year: '2024',
    description:
      'A digital platform supporting communication, visibility and engagement for a technology-focused organization.',
    image: '/projects/connect-sierra-leone.jpg',
    technologies: ['Web', 'Content', 'Strategy'],
    featured: false,
    challenge:
      'The organization needed an online presence that could make its mission, work and network more visible and easier to understand.',
    approach:
      'We shaped the digital experience around storytelling, information clarity and a credible institutional voice.',
    solution:
      'A polished organization website that brings together mission, impact and engagement in a more unified way.',
    outcome:
      'A stronger and more consistent public platform for their mission and community work.',
    gallery: [
      '/projects/connect-sierra-leone.jpg',
      '/projects/connect-sierra-leone.jpg',
      '/projects/connect-sierra-leone.jpg',
    ],
  },
]

export const categories = ['All', 'Software', 'Web', 'Mobile', 'Design', 'Branding', 'Media']

export const projectMap = Object.fromEntries(projects.map((project) => [project.slug, project]))
