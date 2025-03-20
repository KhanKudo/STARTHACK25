import { Project } from '../../../models/project';

// Export the Project type for use in components
export type { Project };

// Simple API object for working with projects
export const api = {
  getAllProjects: async (): Promise<Project[]> => {
    // Simulating API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(projectData), 800);
    });
  },
  
  getProjectById: async (id: string): Promise<Project | undefined> => {
    // Simulating API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(getProjectById(id)), 500);
    });
  },
  
  addProject: async (project: Omit<Project, 'id'>): Promise<Project> => {
    // Simulating API call with a delay
    return new Promise((resolve) => {
      const newProject = addProject(project);
      setTimeout(() => resolve(newProject), 500);
    });
  }
};

// Export the project data array
export const projectData: Project[] = [
  {
    id: "va-fleet",
    company: 'Virgin Atlantic',
    initiative: 'Youngest, Cleanest Fleet in the Sky',
    challenge: 'The time for action against climate change is now. Virgin Atlantic are on a mission to achieve net-zero by 2050.',
    description: 'Virgin Atlantic is working to accelerate the development of sustainable fuels. On November 28th, we made history with Flight100 becoming the first commercial airline to fly across the Atlantic on 100% SAF - marking a key milestone on the path to decarbonising aviation.',
    callToAction: 'Stay informed, Sign up for updates on ways you can get involved in making a difference',
    links: [
      'https://corporate.virginatlantic.com/gb/en/business-for-good/planet.html',
      'https://corporate.virginatlantic.com/gb/en/business-for-good/planet/fuel/flight100.html',
      'https://corporate.virginatlantic.com/gb/en/business-for-good/planet/fuel.html'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1521727857535-28d2029f06c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "va-unite-planet",
    company: 'Virgin Atlantic & Virgin Unite',
    initiative: 'Protecting our Planet',
    challenge: 'Contrails, aircraft condensation trails, heighten the effect of global warming, which may account for more than half (57%) of the entire climate impact of aviation.',
    description: 'Virgin Atlantic, Virgin Unite, and Flight100 have also joined forces with RMI to establish the Contrail Impact Task Force, aiming to address the environmental impact of aircraft contrails.',
    callToAction: 'Stay informed, Donate to RMI',
    links: [
      'https://corporate.virginatlantic.com/gb/en/business-for-good/planet/fleet.html',
      'https://www.virgin.com/virgin-unite/latest/flight100-virgin-atlantic-and-rmi-test-new-ways-to-reduce-aviations-climate'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1533931736198-f7ca2a10f2b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "vv-sea-change",
    company: 'Virgin Voyages',
    initiative: 'Epic Sea Change For All',
    challenge: 'Wildlife havens, carbon stores, storm defences, ocean purifiers – mangrove swamps are one of the hardest-working habitats on Earth, but theyre disappearing fast.',
    description: 'Virgin Voyages have teamed up with Virgins Foundation, Virgin Unite, to support mangrove forest projects in the Caribbean. The aim is to accelerate nature-based solutions to climate change, and create a scalable model for other regions in the world.',
    callToAction: 'Get involved in a Beach Clean onboard, Donate to Sea Change For All Fund (not currently available)',
    links: [
      'https://www.virginvoyages.com/sustainability'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1550951957-3ab761159b8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "vmo2-ewaste",
    company: 'Virgin Media 02',
    initiative: 'Better Connections Plan',
    challenge: 'Old IT equipment can lead to electronic waste, or e-waste, polluting the environment. Recycling old IT equipment plays a vital role in preventing this.',
    description: 'O2 Recycle is a service launched in October 2009, which allows anyone in the UK whether an O2 customer or not, to trade in their devices and gadgets responsibly, in return for cash. The vast majority of phones we receive will be reused, repaired or recycled for parts. Since launch, the scheme has paid out more than £320 million, and sustainably recycled 3.8 million devices – with zero going to landfill.',
    callToAction: 'Sell your old device with O2 Recycle',
    links: [
      'https://www.virgin.com/about-virgin/latest/virgin-media-o2-launches-better-connections-plan',
      'https://www.o2recycle.co.uk/'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611846199542-9dd16dcc4354?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "vmo2-digital",
    company: 'Virgin Media 02',
    initiative: 'Better Connections Plan',
    challenge: 'The digital divide, or the split between those with and without reliable internet connectivity and related technologies, has profound implications on society.',
    description: 'Community Calling is a pioneering initiative by Virgin Media O2 and environmental charity Hubbub to tackle digital exclusion. It has already rehomed more than 20,000 unused smartphones with people who need them across the country.',
    callToAction: 'Donate devices via Community Calling',
    links: [
      'https://www.virgin.com/about-virgin/latest/virgin-media-o2-launches-better-connections-plan',
      'https://hubbub.org.uk/community-calling'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "vmo2-eco-rating",
    company: 'Virgin Media 02',
    initiative: 'Better Connections Plan',
    challenge: 'Mobile phones can have a significant environmental impact in their production and disposal. The mass production of smartphones not only contributes to environmental pollution but also results in a substantial carbon footprint.',
    description: 'Virgin Media O2 is one of 5 of Europes leading mobile operators to have joined forces to update and launch a new pan-industry Eco Rating labelling scheme that will help consumers identify and compare the most sustainable mobile phones and encourage suppliers to reduce the environmental impact of their devices.',
    callToAction: 'Use the Eco Rating Scheme',
    links: [
      'https://news.virginmediao2.co.uk/archive/new-pan-industry-eco-rating-scheme-launched-for-mobile-phones/',
      'https://www.o2.co.uk/inspiration/the-drop/eco-rating-for-mobile-phones'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "vmo2-secondhand",
    company: 'Virgin Media 02',
    initiative: 'Better Connections Plan',
    challenge: 'Mobile phones can have a significant environmental impact in their production and disposal. The mass production of smartphones not only contributes to environmental pollution but also results in a substantial carbon footprint.',
    description: 'Virgin Media O2 offer a range of like-new second hand smart phones and tablets to help reduce your carbon footprint.',
    callToAction: 'Buy a like-new second hand smartphone or tablet',
    links: [
      'https://www.o2.co.uk/shop/like-new'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "vle-pride",
    company: 'Virgin Limited Edition (VLE) & Virgin Unite',
    initiative: 'Pride \'n Purpose',
    challenge: 'Many communities surrounding Ulusaba lack basic needs such as access to clean drinking water, basic healthcare, food, childcare, and job opportunities.',
    description: 'Pride \'n Purpose is a non-for-profit organisation, committed to helping disadvantaged communities living adjacent to the Sabi Sand Reserve. The Pride n Purpose philosophy is that people are most effectively helped if they are empowered to help themselves, with this in mind the organisation\'s work focuses primarily on sustainable initiatives and it is estimated that Pride \'n Purpose benefits over 35,000 people across six communities.',
    callToAction: 'Volunteer during your visit to Ulusaba, Pack for a Purpose: Donate clothing and household supplies, Make a donation',
    links: [
      'https://www.virginlimitededition.com/ulusaba/the-reserve/our-commitment/',
      'https://www.packforapurpose.org/destinations/africa/south-africa/ulusaba-private-game-reserve/'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "vle-inua-jamii",
    company: 'Virgin Limited Edition (VLE) & Virgin Unite',
    initiative: 'Mahali Mzuri: Inua Jamii',
    challenge: 'A key conservation goal around Mahali Mzuri is to aid conservation and preserve the under-threat route of the Great Wildebeest Migration. We also aim to support and enhance the standard of living in local communities.',
    description: 'Inua Jamii is Mahali Mzuris charitable arm, committed to working with and supporting the local Maasai communities in the Olare Motorogi Conservancy to improve their standards of living. The name "Inua Jamii" means "uplifting the local community" in Swahili. Our philosophy is that people are most effectively helped if they are empowered to help themselves. Our aim is to nurture communities that thrive through our involvement, simultaneously fostering selfreliance and establishing sustainable resources for generations to come.',
    callToAction: 'Volunteer during your visit to Mahali Mzuri, Visit the community or the Maa Trust, Pack for a Purpose: Donate clothing and household supplies, Make a donation',
    links: [
      'https://www.virginlimitededition.com/mahali-mzuri/the-camp/our-commitment/',
      'https://www.virginlimitededition.com/media/dvvi4c4q/mahali-mzuri-inua-jamii-brochure-oct-24.pdf'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "vu-planetary",
    company: 'Virgin Unite',
    initiative: 'Planetary Guardians',
    challenge: 'The planetary boundaries framework is a key framework for grasping and addressing our footprint on Earth and identifies nine critical systems needed to regulate the health of the entire planet.',
    description: 'The new assessment of the Planetary Boundaries was so stark it compelled Virgin Unite to work with the Potsdam Institute to convene a group of leaders and activists to become "Planetary Guardians", with an aim to "elevate the science, catalyse systems change to safeguard the global commons, and spark a movement to tackle the biggest crisis we have ever faced."',
    callToAction: 'Watch the video to learn more about our nine planetary boundaries',
    links: [
      'https://www.youtube.com/watch?v=d4fdF8rq5h8',
      'https://www.virgin.com/branson-family/richard-branson-blog/how-the-planetary-guardians-can-help-secure-earths-future',
      'https://unite.virgin.com/our-work/planetary-guardians/index.html?region=gb'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "vu-elders",
    company: 'Virgin Unite',
    initiative: 'The Elders',
    challenge: 'The world is rapidly changing, and is facing challenges in leadership, peace-building, inequality, exclusion and injustice.',
    description: 'The Elders were incubated by Virgin Unite and launched by Nelson Mandela in 2007 to create an independent global leaders working together for peace, justice, human rights and a sustainable plane. Their work has been truly world changing. They have written an open letter to call on world leaders to address the world\'s existential threats more decisivesly.',
    callToAction: 'Sign their open letter calling for long view leadership on existential threats.',
    links: [
      'https://theelders.org/news/elders-and-future-life-institute-release-open-letter-calling-long-view-leadership-existential',
      'https://futureoflife.org/open-letter/long-view-leadership-on-existential-threats/'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "vu-ocean",
    company: 'Virgin Unite',
    initiative: 'Ocean Unite / ORRAA',
    challenge: 'The dual crises of climate change and mass wildlife extinctions threaten to forever change our world. By 2050, over 570 low-lying coastal cities will face threats from sea level rise and an estimated 800 million people will be at risk.',
    description: 'In October 2016, Ocean Unite / ORRAA in collaboration with the Marine Conservation Institute and Oceans 5, brought together 30 of the largest NGOs from around the world, stimulating joint efforts towards the goal of strongly protecting at least 30% of the Ocean by 2030. A current campaign is to secure the largest act of Ocean Protection in history by protecting Antarctica\'s waters.',
    callToAction: 'Add your name to the petition urging leaders from CCAMLR member countries to act now to protect Antarctica\'s waters #CallOnCCAMLR',
    links: [
      'https://only.one/act/antarctica',
      'https://www.virgin.com/virgin-unite/latest/securing-the-largest-act-of-ocean-protection-in-history'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1583722888584-283c44a5684b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "vu-mapathon",
    company: 'Virgin Unite',
    initiative: 'Community Mapathon: Humanitarian OpenStreetMap',
    challenge: 'Every day, millions of people worldwide face life-threatening crises. Humanitarian aid is a vital lifeline that delivers a variety of essential services to those in need. But as global crises escalate, so does the need for support.',
    description: 'The Humanitarian OpenStreetMap Team (HOT) is community mapping organisation supporting humanitarian responses to nearly 100 crises; many caused by the impacts of Climate Change. Funded by one of Virgin Unite\'s co-funded initiative\'s Audacious, HOT specialises in humanitarian action and community development through open mapping, mapping areas for one billion people vulnerable to disasters in 94 countries. This covers a range of things – from supporting disaster relief efforts, to helping to inform action to combat the effects of climate change.',
    callToAction: 'Spare some time to join the mappers and help with mapping',
    links: [
      'https://www.virgin.com/virgin-unite/latest/join-humanitarian-openstreetmap-team-to-help-map-el-nino-2023',
      'https://www.hotosm.org/updates/mapping-for-el-nino-2023-early-warning-and-anticipatory-action/'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1569396116180-210c182bedb8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "vu-ceti",
    company: 'Virgin Unite',
    initiative: 'Project CETI (Cetacean Translation Initiative)',
    challenge: 'Humanity is facing the collapse of entire ecosystems, and the biodiversity of our planet is being eroded at unprecedented rates. It is a pivotal time for us to reshape how we co-exist in and with nature.',
    description: 'Project CETI is one of Virgin Unite\'s co-funded Audacious projects. It uses machine learning and robotics to translate sperm whale clicks in Dominica. By shedding light on the intricate and intelligent communication of whales, the project not only aims to accelerate conservation efforts, but has the potential to transform the way we understand our relationship with the natural world.',
    callToAction: 'Become a whale interpreter, Donate to support Project CETI',
    links: [
      'https://www.projectceti.org/get-involved',
      'https://www.audaciousproject.org/grantees/project-ceti'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1586856212723-95f70d8283ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "vu-branson-foundation",
    company: 'Virgin Unite',
    initiative: 'Eve Branson Foundation',
    challenge: 'The aim of the Eve Branson Foundation is to support local people and communities around the Atlas Mountains. On 8th September 2023, Morocco was hit hard by a strong earthquake measuring magnitude 6.8.',
    description: 'The Eve Branson Foundation is a small non-profit based in Morocco. Their mission is to create opportunities for local people in the High Atlas Mountains which can make a meaningful difference to their families and community. They have developed initiatives in four key areas: artisanal training, environment, healthcare and education.',
    callToAction: 'Donate, Visit, Pack for a Purpose, Buy EBF products through Virgin Red',
    links: [
      'https://evebransonfoundation.org.uk/',
      'https://evebransonfoundation.org.uk/pack-for-a-purpose/',
      'https://www.virgin.com/virgin-red'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1504886373602-9bffbf68e9e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: "vu-bvi",
    company: 'Virgin Unite',
    initiative: 'Unite BVI',
    challenge: 'The BVI faces a number of pressing issues including creating opportunities in the community, improving the quality of education, developing a vibrant entrepeneurial cultre and preservation of the nartual environment.',
    description: 'Since its launch, Unite BVI has brought together people, ideas and resources to help tackle community and environmental challenges. The Unite BVI team collaborate with communities and BVI change-makers to solve the most pressing issues faced by the BVI and its people. Working across a wide range of projects, Unite BVI advocate for the protection of the environment as well as enriching the community through supporting entrepreneurs, investing in education, and addressing public health and social welfare issues with sustainable solutions.',
    callToAction: 'Join the community',
    links: [
      'https://unitebvi.com/get-involved/index.html?region=gb'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1580455552921-abcf9393b2d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
];

// Helper function to get project by ID
export const getProjectById = (id: string): Project | undefined => {
  return projectData.find(project => project.id === id);
};

// Helper function to add a new project
export const addProject = (project: Omit<Project, 'id'>): Project => {
  // Generate ID from company and initiative (simplified slug)
  const slug = project.company
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-')
    .substring(0, 10);
  
  const initiative = project.initiative
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-')
    .substring(0, 10);
  
  // Generate a unique ID
  const timestamp = Date.now().toString(36);
  const id = `${slug}-${initiative}-${timestamp}`;
  
  // Create the new project with the ID
  const newProject: Project = {
    id,
    ...project
  };
  
  // Add to the beginning of the array
  projectData.unshift(newProject);
  
  return newProject;
}; 