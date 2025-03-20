import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SwipeCard, { CardData } from './SwipeCard';
import './SwipeContainer.css';
import ResultsCard from './ResultsCard';

// Extend the CardData interface to include matchedTopics
interface ExtendedCardData extends CardData {
  matchedTopics?: string[];
  liked?: boolean;
}

// Define types for initiative mapping
type InitiativeTopicsMap = {
  [initiative: string]: string[];
};

// Define types for initiative details
interface InitiativeDetail {
  company: string;
  challenge: string;
  description: string;
  imageUrl: string;
}

type InitiativeDetailsMap = {
  [initiative: string]: InitiativeDetail;
};

// Define types for topic images
type TopicImageMap = {
  [topic: string]: string;
};

// Data mapping topics to initiatives
const initiativeMap: InitiativeTopicsMap = {
  'Virgin Atlantic - Youngest, Cleanest Fleet in the Sky': [
    'Climate Action',
    'Sustainable Aviation',
    'Innovation in Renewable Energy'
  ],
  'Virgin Atlantic & Virgin Unite - Protecting our Planet': [
    'Climate Action',
    'Environmental Protection & Carbon Reduction',
    'Global Collaboration'
  ],
  'Virgin Voyages - Epic Sea Change For All': [
    'Ecosystem Conservation',
    'Climate Action',
    'Community Empowerment'
  ],
  'Virgin Media O2 - Better Connections Plan (Recycling)': [
    'E-waste Reduction',
    'Sustainable Consumption',
    'Circular Economy'
  ],
  'Virgin Media O2 - Better Connections Plan (Digital Divide)': [
    'Digital Inclusion',
    'Social Equity',
    'Community Empowerment'
  ],
  'Virgin Media O2 - Better Connections Plan (Eco Rating)': [
    'Sustainable Technology',
    'Consumer Awareness',
    'Environmental Protection & Carbon Reduction'
  ],
  'Virgin Media O2 - Better Connections Plan (Second-hand Devices)': [
    'Sustainable Consumption',
    'E-waste Reduction',
    'Environmental Protection & Carbon Reduction'
  ],
  'Virgin Limited Edition & Virgin Unite - Pride \'n Purpose': [
    'Community Empowerment',
    'Sustainable Livelihoods',
    'Social Equity'
  ],
  'Virgin Limited Edition & Virgin Unite - Mahali Mzuri: Inua Jamii': [
    'Ecosystem Conservation',
    'Community Empowerment',
    'Sustainable Tourism'
  ],
  'Virgin Unite - Planetary Guardians': [
    'Climate Action',
    'Environmental Protection & Carbon Reduction',
    'Global Collaboration'
  ],
  'Virgin Unite - The Elders': [
    'Global Leadership',
    'Peace and Justice',
    'Sustainable Development'
  ],
  'Virgin Unite - Ocean Unite / ORRAA': [
    'Ecosystem Conservation',
    'Climate Action',
    'Global Collaboration'
  ],
  'Virgin Unite - Community Mapathon: Humanitarian OpenStreetMap (HOT)': [
    'Disaster Relief',
    'Climate Action',
    'Community Empowerment'
  ],
  'Virgin Unite - Project CETI (Cetacean Translation Initiative)': [
    'Ecosystem Conservation',
    'Biodiversity Preservation',
    'Technological Innovation'
  ],
  'Virgin Unite - Eve Branson Foundation': [
    'Community Empowerment',
    'Education and Healthcare',
    'Sustainable Livelihoods'
  ],
  'Virgin Unite - Unite BVI': [
    'Community Empowerment',
    'Environmental Protection & Carbon Reduction',
    'Social Equity'
  ]
};

// Definition of initiative details
const initiativeDetails: InitiativeDetailsMap = {
  'Virgin Atlantic - Youngest, Cleanest Fleet in the Sky': {
    company: 'Virgin Atlantic',
    challenge: 'The time for action against climate change is now. Virgin Atlantic are on a mission to achieve net-zero by 2050.',
    description: 'Virgin Atlantic is working to accelerate the development of sustainable fuels. On November 28th, we made history with Flight100 becoming the first commercial airline to fly across the Atlantic on 100% SAF - marking a key milestone on the path to decarbonising aviation.',
    imageUrl: 'https://images.unsplash.com/photo-1595392029731-a6a252df1fd1?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Atlantic & Virgin Unite - Protecting our Planet': {
    company: 'Virgin Atlantic & Virgin Unite',
    challenge: 'Preserving our planet requires collaborative approaches to environmental conservation.',
    description: 'Virgin Atlantic and Virgin Unite are collaborating on comprehensive environmental initiatives aimed at protecting biodiversity and natural habitats while implementing sustainable practices throughout their operations.',
    imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Voyages - Epic Sea Change For All': {
    company: 'Virgin Voyages',
    challenge: 'Wildlife havens, carbon stores, storm defences, ocean purifiers - mangrove swamps are one of the hardest-working habitats on Earth, but they\'re disappearing fast.',
    description: 'Virgin Voyages have teamed up with Virgin\'s Foundation, Virgin Unite, to support mangrove forest projects in the Caribbean. The aim is to accelerate nature-based solutions to climate change, and create a scalable model for other regions in the world.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Media O2 - Better Connections Plan (Recycling)': {
    company: 'Virgin Media O2',
    challenge: 'Electronic waste is one of the fastest-growing waste streams globally, with significant environmental impacts.',
    description: 'Virgin Media O2\'s recycling initiative is tackling e-waste by implementing comprehensive recycling programs for electronic devices and accessories, reducing landfill waste and promoting circular economy principles.',
    imageUrl: 'https://images.unsplash.com/photo-1590219590780-f8cfab573cc1?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Media O2 - Better Connections Plan (Digital Divide)': {
    company: 'Virgin Media O2',
    challenge: 'The digital divide, or the split between those with and without reliable internet connectivity and related technologies, has profound implications on society.',
    description: 'Community Calling is a pioneering initiative by Virgin Media O2 and environmental charity Hubbub to tackle digital exclusion. It has already rehomed more than 20,000 unused smartphones with people who need them across the country.',
    imageUrl: 'https://images.unsplash.com/photo-1595392029731-a6a252df1fd1?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Media O2 - Better Connections Plan (Eco Rating)': {
    company: 'Virgin Media O2',
    challenge: 'Consumers often lack transparent information about the environmental impact of their technology choices.',
    description: 'The Eco Rating initiative provides clear information about the environmental impact of mobile devices, helping consumers make more sustainable choices and encouraging manufacturers to improve their practices.',
    imageUrl: 'https://news.virginmediao2.co.uk/wp-content/uploads/2021/06/Eco-rating.jpg'
  },
  'Virgin Media O2 - Better Connections Plan (Second-hand Devices)': {
    company: 'Virgin Media O2',
    challenge: 'The continuous cycle of new device purchases contributes significantly to electronic waste and resource depletion.',
    description: 'Virgin Media O2\'s second-hand device program extends the lifecycle of electronic devices, reducing waste and making technology more accessible while significantly reducing the carbon footprint associated with manufacturing new devices.',
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Limited Edition & Virgin Unite - Pride \'n Purpose': {
    company: 'Virgin Limited Edition & Virgin Unite',
    challenge: 'Many communities face socioeconomic challenges that require sustainable development approaches.',
    description: 'Pride \'n Purpose works with communities to develop sustainable livelihoods, addressing social inequities through education, healthcare, and entrepreneurial initiatives that empower local populations and create lasting positive change.',
    imageUrl: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Limited Edition & Virgin Unite - Mahali Mzuri: Inua Jamii': {
    company: 'Virgin Limited Edition & Virgin Unite',
    challenge: 'Wildlife conservation efforts must balance ecological needs with the socioeconomic well-being of local communities.',
    description: 'Mahali Mzuri\'s Inua Jamii initiative promotes sustainable tourism practices while supporting wildlife conservation and community development, creating a model where tourism benefits both nature and local communities.',
    imageUrl: 'https://www.virginlimitededition.com/media/yakleqrf/mahali-mzuri-camp-and-guides-1.jpg?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Unite - Planetary Guardians': {
    company: 'Virgin Unite',
    challenge: 'The dual crises of climate change and mass wildlife extinctions threaten to forever change our world.',
    description: 'Planetary Guardians brings together global leaders and organizations to address climate change through collaborative efforts, driving innovation and policy changes that protect our planet\'s ecosystems and biodiversity.',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Unite - The Elders': {
    company: 'Virgin Unite',
    challenge: 'Complex global issues require experienced leadership and collaborative approaches.',
    description: 'The Elders brings together former heads of state, peace activists, and human rights advocates to promote peace, justice, and sustainable development through independent leadership and constructive dialogue.',
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Unite - Ocean Unite / ORRAA': {
    company: 'Virgin Unite',
    challenge: 'The dual crises of climate change and mass wildlife extinctions threaten to forever change our world.',
    description: 'Ocean Unite / ORRAA in collaboration with the Marine Conservation Institute and Oceans 5, brought together 30 of the largest NGOs from around the world, stimulating joint efforts towards the goal of strongly protecting at least 30% of the Ocean by 2030.',
    imageUrl: 'https://onlyone-cms.imgix.net/v1v8cy5da8fh/6ef2qr8mVLZwMpctd7jlY9/37858fc8bc929522620398e35d016b3f/Alpha-Universe-Photo-by-Sony-Artisan-of-Imagery-Andy-Mann-DSC08557-Edit.880074f1fd6d9422f6c3fded126a54c8.jpg?w=1920&auto=compress,format?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Unite - Community Mapathon: Humanitarian OpenStreetMap (HOT)': {
    company: 'Virgin Unite',
    challenge: 'Effective disaster response and climate change adaptation require accurate, up-to-date geographical information.',
    description: 'The Community Mapathon initiative uses open-source mapping to support humanitarian efforts, disaster relief, and climate change adaptation, building community resilience through improved geographical data and collaborative mapping.',
    imageUrl: 'https://images.ctfassets.net/rxqefefl3t5b/3K5qvqVy2RDMSapLI2yuaZ/79d2e16132d06d017b20e013ce47d643/Humanitarian_OpenStreetMap_Team_2.jpg'
  },
  'Virgin Unite - Project CETI (Cetacean Translation Initiative)': {
    company: 'Virgin Unite',
    challenge: 'Humanity is facing the collapse of entire ecosystems, and the biodiversity of our planet is being eroded at unprecedented rates.',
    description: 'Project CETI uses machine learning and robotics to translate sperm whale clicks in Dominica. By shedding light on the intricate and intelligent communication of whales, the project not only aims to accelerate conservation efforts, but has the potential to transform the way we understand our relationship with the natural world.',
    imageUrl: 'https://cdn.prod.website-files.com/643ddd7ffdf12273933a8cec/66db26d5082b9717e2855981_male-and-female-whale-p-500.png?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Unite - Eve Branson Foundation': {
    company: 'Virgin Unite',
    challenge: 'Rural communities often lack access to education, healthcare, and sustainable economic opportunities.',
    description: 'The Eve Branson Foundation supports rural communities by providing education, healthcare, and sustainable livelihood opportunities, empowering local artisans and entrepreneurs while preserving cultural heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Unite - Unite BVI': {
    company: 'Virgin Unite',
    challenge: 'Island communities face unique environmental and social challenges requiring sustainable development approaches.',
    description: 'Unite BVI works to create positive community and environmental impact in the British Virgin Islands through projects that support local entrepreneurs, conserve natural resources, and promote social equity.',
    imageUrl: 'https://images.ctfassets.net/zois51yf0qbx/1gd29y9PXUzXMFiUD6KzH6/531bdf4dc2df770b33ad004d3d6e604b/How_supports_us_piture_good_quality_cropped_for_website.jpg'
  }
};

// Create interest topic cards
const interestTopics = [
  'Climate Action',
  'Sustainable Aviation',
  'Innovation in Renewable Energy',
  'Environmental Protection & Carbon Reduction',
  'Global Collaboration',
  'Ecosystem Conservation',
  'Community Empowerment',
  'E-waste Reduction',
  'Sustainable Consumption',
  'Circular Economy',
  'Digital Inclusion',
  'Social Equity',
  'Sustainable Technology',
  'Consumer Awareness',
  'Sustainable Livelihoods',
  'Sustainable Tourism',
  'Global Leadership',
  'Peace and Justice',
  'Sustainable Development',
  'Disaster Relief',
  'Biodiversity Preservation',
  'Technological Innovation',
  'Education and Healthcare'
];

// Map topics to image URLs for visualization
const topicImages: TopicImageMap = {
  'Climate Action': 'https://images.unsplash.com/photo-1552799446-159ba9523315?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xpbWF0ZSUyMGFjdGlvbnxlbnwwfHwwfHx8MA%3D%3D?s=612x612&w=0&k=20&c=8UNtQLTwL3tsSxrCZ0PPAb9edE2Jl4SPXVXWKVLU_3Y=?q=80&w=500&auto=format&fit=crop',
  'Sustainable Aviation': 'https://flywith.virginatlantic.com/content/dam/va-shared/a350-october-2019/A350_Air2Air2019_Retouched_DSC4911_EM4.jpg',
  'Innovation in Renewable Energy': 'https://images.unsplash.com/photo-1625301840055-7c1b7198cfc0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5ub3ZhdGlvbiUyMGluJTIwcmVuZXdhYmxlJTIwZW5lcmd5fGVufDB8fDB8fHww?s=612x612&w=0&k=20&c=LsdaF_vGaaLzX8P34yqPeAcjs-MaR06GmytHyWMQXac=?q=80&w=500&auto=format&fit=crop',
  'Environmental Protection & Carbon Reduction': 'https://images.unsplash.com/photo-1622254936966-4a3c4def576f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?s=612x612&w=0&k=20&c=B92LB96WkFYe2K9KYG8wNhYU3cj1hBa2QezZ9OUfXS8=?q=80&w=500&auto=format&fit=crop',
  'Global Collaboration': 'https://images.unsplash.com/photo-1622674777904-386b3ef30c4a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?s=612x612&w=0&k=20&c=zWRK-V5jo7eUSsofoHh39HrhB5rcQPdg_9h9KA-gwCo=?q=80&w=500&auto=format&fit=crop',
  'Ecosystem Conservation': 'https://images.unsplash.com/photo-1700934163012-b4ae4459e7a6?q=80&w=1066&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?s=612x612&w=0&k=20&c=Iyx-gCMSByZJUFvWAeKyIj2q1Of1GyXtkW0Ba2-Gs7g=?q=80&w=500&auto=format&fit=crop',
  'Community Empowerment': 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?q=80&w=985&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=500&auto=format&fit=crop',
  'E-waste Reduction': 'https://images.unsplash.com/photo-1614201756100-1ccde6a6589e?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?s=612x612&w=0&k=20&c=q_MmxgGUveX1gaEq75trpiE5ShN-t9QGNt-8wKY_aP0=?q=80&w=500&auto=format&fit=crop',
  'Sustainable Consumption': 'https://plus.unsplash.com/premium_photo-1713820020903-527120477bcc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3VzdGFpbmFibGUlMjBjb25zdW1wdGlvbnxlbnwwfHwwfHx8MA%3D%3D?s=612x612&w=0&k=20&c=N4WTVGZ_TL5CCKCkc-k1WsVTbBaEOsSp5_QbDf1DFVQ=?q=80&w=500&auto=format&fit=crop',
  'Circular Economy': 'https://plus.unsplash.com/premium_photo-1711987229773-3832fca590cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2lyY3VsYXIlMjBlY29ub215fGVufDB8fDB8fHww?s=612x612&w=0&k=20&c=xIKo4MSlR5gft6eucUOhf-F3Mi825HR63KJTR9Khu1Q=?q=80&w=500&auto=format&fit=crop',
  'Digital Inclusion': 'https://media-hosting.imagekit.io//35335b3e911c4b47/istockphoto-1219569791-612x612.jpg?Expires=1837085115&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=2l6pOL7c9o9hfwB8klVCp9fHK5xI~q63UzKcRZtEHNHq-EVfylSr7K8CPSGLgFerF6jDz9oupddExqTTKKamK18xvyoDK6p3nOn5E2MPXq~wEQ~V2ZJ1b5SVGI5azLvueOlHb4ijlhwRLcEo6zHo9cBNhc76Q~qYpfHRacLhaj87vgRcvAEBYbMdSMSNyDwF9lIOurlN4-BThOAUz5sruD6ALtpBk7Euad6QUa19~5ZmYdrl2J0vvAaqXM29GH3UCGV4PbbEHj7yGGQjNw6-n07fKlbyQtIzIERyx0b7mCuAQklgfiHC1~Zenh7cuHT5u1gR1p-Syo~~gH4GBYkuXw__',
  'Social Equity': 'https://plus.unsplash.com/premium_photo-1723921267251-120560d6ab71?q=80&w=1046&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?s=612x612&w=0&k=20&c=KUbSd05rSSgbPNfRoogdaiGYkExurmDUJMpXQ7d5OlM=?q=80&w=500&auto=format&fit=crop',
  'Sustainable Technology': 'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?s=612x612&w=0&k=20&c=XXQ5aui1TdSAegGU0QP-yIeUWFYJtnB1x5RdFW_cs6w=?q=80&w=500&auto=format&fit=crop',
  'Consumer Awareness': 'https://images.unsplash.com/photo-1629959000608-3ec4fc3194b5?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?s=612x612&w=0&k=20&c=qZ-6_ZUia5vMDcYPBaq-ur4YDaTNQS2I2GDwJP-74nM=?q=80&w=500&auto=format&fit=crop',
  'Sustainable Livelihoods': 'https://images.unsplash.com/photo-1592178036182-5400889dfc74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHN1c3RhaW5hYmxlJTIwbGlmZWx5aG9vZHN8ZW58MHx8MHx8fDA%3D?s=612x612&w=0&k=20&c=3B3oVBUFSygaMILGqRtvJJkSsMY1GqxdjQY6_2zFF08=?q=80&w=500&auto=format&fit=crop',
  'Sustainable Tourism': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?s=612x612&w=0&k=20&c=vdadQOUizAi28ZkLVgBHqW7woQwqVmn_3D9Wiyfk56Y=?q=80&w=500&auto=format&fit=crop',
  'Global Leadership': 'https://images.unsplash.com/photo-1622675235457-38708d51d6d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGdsb2JhbCUyMGxlYWRlcnNoaXB8ZW58MHx8MHx8fDA%3D?s=612x612&w=0&k=20&c=9xRTpsi4QN_0vPQjFQhaQBOnBrr7hTznxWDGoELJrTI=?q=80&w=500&auto=format&fit=crop',
  'Peace and Justice': 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?s=612x612&w=0&k=20&c=sNQFJsm5b3lDAZnFIrIuqcJ87KAyFvgnRBauQXV-B5U=?q=80&w=500&auto=format&fit=crop',
  'Sustainable Development': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1013&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?s=612x612&w=0&k=20&c=l5I31RBIL5eeEJXVzJld8o9dcUPSOWqBXnTra31Ud4s=?q=80&w=500&auto=format&fit=crop',
  'Disaster Relief': 'https://www.samariter-favoriten.at/wp-content/uploads/2020/09/csm_-DSC_9086_bbe0f99026.jpg?s=612x612&w=0&k=20&c=jq15kLlDozQ1Opa2eKY4pp585QCANixpGs4Jhrgjek4=?q=80&w=500&auto=format&fit=crop',
  'Biodiversity Preservation': 'https://images.unsplash.com/photo-1709761942157-2014363b2d09?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmlvZGl2ZXJzZXR5JTIwcHJlc2VydmF0aW9ufGVufDB8fDB8fHww?s=612x612&w=0&k=20&c=LnwNgiqNZ_EtPzBy09WON5zetoo5mHj6PHF-Mc17chg=?q=80&w=500&auto=format&fit=crop',
  'Technological Innovation': 'https://images.unsplash.com/photo-1593349480506-8433634cdcbe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVjaG5vbG9naWNhbCUyMGlubm92YXRpb258ZW58MHx8MHx8fDA%3D?s=612x612&w=0&k=20&c=t_CHPyJiIM2-_ZOPKs9Vz9zL-opSBZvEGrTlJzpBIgs=?q=80&w=500&auto=format&fit=crop',
  'Education and Healthcare': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?s=612x612&w=0&k=20&c=KjoTL4oBpc5dokGIeMtGFGjyTw-cku5SQnrMAKK9rCM=?q=80&w=500&auto=format&fit=crop'
};

// Create topic cards for the swipe interface
const getRandomTopicCards = (): CardData[] => {
  // Shuffle the topics array
  const shuffledTopics = [...interestTopics].sort(() => 0.5 - Math.random());
  
  // Take only 6 random topics (changed from 10)
  const selectedTopics = shuffledTopics.slice(0, 6);
  
  // Create cards for the selected topics
  return selectedTopics.map((topic, index) => ({
    id: (index + 1).toString(),
    name: topic,
    imageUrl: topicImages[topic] || 'https://images.unsplash.com/photo-1624138784192-88cee49d64af?q=80&w=500&auto=format&fit=crop',
    details: {
      company: 'Sustainability Interest',
      challenge: 'Are you interested in this sustainability topic?',
      description: `Swipe right if you're interested in ${topic}, or left if you're not.`
    }
  }));
};

// Generate random topic cards
const topicCards: CardData[] = getRandomTopicCards();

interface Choice {
  cardId: string;
  liked: boolean;
  timestamp: number;
}

const SwipeContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [completed, setCompleted] = useState(false);
  const [topMatches, setTopMatches] = useState<any[]>([]);
  const [likedTopics, setLikedTopics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('projects');
  const [userPoints, setUserPoints] = useState(750); // Total sustainability points for the user
  const [nextBadge, setNextBadge] = useState({ name: 'Eco Champion', progress: 70, remaining: 250 });
  const [viewedCards, setViewedCards] = useState<ExtendedCardData[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Add refs for the navbar drag scroll functionality
  const navRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  
  // Mouse drag event handlers for navbar scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    isMouseDown.current = true;
    startX.current = e.pageX - navRef.current.offsetLeft;
    scrollLeft.current = navRef.current.scrollLeft;
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || !navRef.current) return;
    e.preventDefault();
    const x = e.pageX - navRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll multiplier
    navRef.current.scrollLeft = scrollLeft.current - walk;
  };
  
  const handleMouseUp = () => {
    isMouseDown.current = false;
  };
  
  const handleMouseLeave = () => {
    isMouseDown.current = false;
  };
  
  // Check for tab parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['projects', 'badges', 'leaderboard', 'community'].includes(tab)) {
      setActiveNav(tab);
    }
  }, [location]);

  // Load viewed cards and calculated matches from localStorage
  useEffect(() => {
    try {
      const savedChoices = localStorage.getItem('topic-swipe-choices');
      const savedSkipped = localStorage.getItem('topic-swipe-skipped');
      const completedSwipe = localStorage.getItem('swipe-completed');
      const savedLikedTopics = localStorage.getItem('liked-topics');
      const savedMatches = localStorage.getItem('calculated-matches');
      
      // Restore liked topics if available
      if (savedLikedTopics) {
        try {
          const parsedLikedTopics = JSON.parse(savedLikedTopics);
          if (Array.isArray(parsedLikedTopics)) {
            setLikedTopics(parsedLikedTopics);
          }
        } catch (e) {
          console.error('Error parsing saved liked topics:', e);
        }
      }
      
      // Check if user has already completed swiping
      if (savedSkipped === 'true' || completedSwipe === 'true') {
        setCompleted(true);
        
        // Restore saved matches if available
        if (savedMatches) {
          try {
            const parsedMatches = JSON.parse(savedMatches);
            if (Array.isArray(parsedMatches)) {
              setTopMatches(parsedMatches);
              return;
            }
          } catch (e) {
            console.error('Error parsing saved matches:', e);
          }
        }
        
        // If no valid saved matches, recalculate
        findTopMatches();
        return;
      }
      
      let viewedCardIds: string[] = [];
      
      if (savedChoices) {
        const parsedChoices = JSON.parse(savedChoices);
        if (Array.isArray(parsedChoices)) {
          setChoices(parsedChoices);
          viewedCardIds = parsedChoices.map(choice => choice.cardId);
        }
      }
      
      // Generate fresh random topic cards for this session
      const currentTopicCards = getRandomTopicCards();
      
      // Filter out cards that have already been viewed
      // Note: since topics are random each time, viewedCardIds may not match exactly
      // This is intentional - we want new topics each time the app is loaded
      const remainingCards = currentTopicCards.filter(card => !viewedCardIds.includes(card.id));
      
      if (remainingCards.length === 0) {
        setCompleted(true);
        // Calculate matched projects
        findTopMatches();
      } else {
        setCards(remainingCards);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // If there's an error, just load a fresh set of random topics
      setCards(getRandomTopicCards());
    }
  }, []);

  const handleLike = () => {
    // No points awarded during preference swiping phase
    // This is just to determine user interests
    
    // Original functionality
    const extendedCard = currentCard as ExtendedCardData;
    const currentTopics = extendedCard.matchedTopics || [];
    const updatedLikedTopics = [...likedTopics, extendedCard.name];
    setLikedTopics(updatedLikedTopics);
    localStorage.setItem('liked-topics', JSON.stringify(updatedLikedTopics));
    setViewedCards([...viewedCards, { ...extendedCard, liked: true }]);
    
    // If there are more cards, go to the next one
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCompleted(true);
      localStorage.setItem('swipe-completed', 'true');
      findTopMatches(); // Ensure matches are calculated
    }
  };

  const handleDislike = () => {
    // No points awarded during preference swiping phase
    // This is just to determine user interests
    
    // Original functionality
    const extendedCard = currentCard as ExtendedCardData;
    setViewedCards([...viewedCards, { ...extendedCard, liked: false }]);
    
    // If there are more cards, go to the next one
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCompleted(true);
      localStorage.setItem('swipe-completed', 'true');
      findTopMatches(); // Ensure matches are calculated
    }
  };

  const handleSkip = () => {
    localStorage.setItem('topic-swipe-skipped', 'true');
    setCompleted(true);
  };

  const goToNextCard = () => {
    const nextIndex = currentCardIndex + 1;
    setCurrentCardIndex(nextIndex);
    
    if (nextIndex >= cards.length) {
      setCompleted(true);
      findTopMatches();
    }
  };

  const findTopMatches = () => {
    // Find all liked topics
    const likedChoices = choices.filter(choice => choice.liked);
    
    // Map to topic names using the entire interestTopics array
    // This ensures we can find the names even if the cards have changed
    const calculatedLikedTopics = likedChoices.map(choice => {
      // For each liked choice, find the corresponding topic
      const cardId = parseInt(choice.cardId);
      const card = cards.find(c => c.id === choice.cardId);
      return card ? card.name : null;
    }).filter(name => name !== null) as string[];
    
    // If we have explicitly set likedTopics, use those, otherwise use calculated ones
    const effectiveLikedTopics = likedTopics.length > 0 ? likedTopics : calculatedLikedTopics;
    
    // Update the likedTopics state for the results view
    setLikedTopics(effectiveLikedTopics);
    localStorage.setItem('liked-topics', JSON.stringify(effectiveLikedTopics));
    
    // If no interests were selected, show a default set
    if (effectiveLikedTopics.length === 0) {
      // Get all initiative keys
      const allInitiatives = Object.keys(initiativeMap);
      
      // Shuffle them
      const shuffledInitiatives = [...allInitiatives].sort(() => 0.5 - Math.random());
      
      // Take 3 random initiatives
      const randomInitiatives = shuffledInitiatives.slice(0, 3);
      
      const defaultMatches = randomInitiatives.map(initiative => ({
        initiative: initiative,
        matchScore: 0,
        details: initiativeDetails[initiative],
        matchedTopics: []
      }));
      
      setTopMatches(defaultMatches);
      localStorage.setItem('calculated-matches', JSON.stringify(defaultMatches));
      return;
    }
    
    // Calculate matches for each initiative
    const initiativeMatches = Object.keys(initiativeMap).map(initiative => {
      const initiativeTopics = initiativeMap[initiative];
      
      // Count how many of the user's liked topics match this initiative
      const matchedTopics = initiativeTopics.filter(topic => effectiveLikedTopics.includes(topic));
      const matchScore = matchedTopics.length / initiativeTopics.length; // Score based on % match
      
      return {
        initiative,
        matchScore,
        details: initiativeDetails[initiative],
        matchedTopics
      };
    });
    
    // Sort by match score (highest first)
    const sortedMatches = initiativeMatches
      .sort((a, b) => b.matchScore - a.matchScore)
      .filter(match => match.matchScore > 0);
    
    // Take top 3 matches
    const top3Matches = sortedMatches.slice(0, 3);
    
    // If we have fewer than 3 matches, add random initiatives to reach 3
    let finalMatches = [...top3Matches];
    
    if (finalMatches.length < 3) {
      const unmatchedInitiatives = Object.keys(initiativeMap)
        .filter(initiative => !finalMatches.some(match => match.initiative === initiative));
      
      // Shuffle unmatched initiatives
      const shuffled = unmatchedInitiatives.sort(() => 0.5 - Math.random());
      
      // Add random initiatives until we have 3
      for (const initiative of shuffled) {
        if (finalMatches.length >= 3) break;
        
        finalMatches.push({
          initiative,
          matchScore: 0,
          details: initiativeDetails[initiative],
          matchedTopics: []
        });
      }
    }
    
    setTopMatches(finalMatches);
    localStorage.setItem('calculated-matches', JSON.stringify(finalMatches));
  };

  const resetChoices = () => {
    localStorage.removeItem('topic-swipe-choices');
    localStorage.removeItem('topic-swipe-skipped');
    localStorage.removeItem('swipe-completed');
    localStorage.removeItem('liked-topics');
    localStorage.removeItem('calculated-matches');
    setChoices([]);
    setLikedTopics([]);
    setCurrentCardIndex(0);
    setCompleted(false);
    
    // Generate a new set of random topic cards
    const newRandomTopics = getRandomTopicCards();
    setCards(newRandomTopics);
  };

  const handleChatClick = (projectId: string) => {
    // Make sure we save the completed state to localStorage before navigating
    localStorage.setItem('swipe-completed', 'true');
    
    // Add points for engaging with chat - this is a meaningful interaction
    setUserPoints(prevPoints => prevPoints + 15);
    updateNextBadgeProgress();
    
    // Find the project in the displayed cards
    const projectIndex = parseInt(projectId);
    if (!isNaN(projectIndex) && projectIndex >= 0 && projectIndex < topMatches.length) {
      const initiativeName = topMatches[projectIndex].initiative;
      
      // Find the index in the original initiatives array for the chat routing
      const initiativeIndex = Object.keys(initiativeMap).indexOf(initiativeName);
      if (initiativeIndex >= 0) {
        navigate(`/chat/${initiativeIndex}`);
        return;
      }
    }
    
    // Fallback to original behavior
    navigate(`/chat/${projectId}`);
  };

  const updateNextBadgeProgress = () => {
    // Update progress towards next badge
    const newRemaining = Math.max(0, nextBadge.remaining - 10);
    const newProgress = Math.min(100, nextBadge.progress + (10 * 100) / (nextBadge.remaining + nextBadge.progress * 10));
    
    setNextBadge(prev => ({
      ...prev,
      remaining: newRemaining,
      progress: newProgress
    }));
    
    // If reached 100%, could trigger badge award notification
    if (newProgress >= 100) {
      alert(`Congratulations! You've earned the ${nextBadge.name} badge!`);
      // Here you would normally update the user's badge collection and set a new next badge
    }
  };

  const handleDiscussionClick = (discussionId: string) => {
    navigate(`/discussion/${discussionId}`);
  };

  if (completed) {
    const displayCards = localStorage.getItem('topic-swipe-skipped') === 'true' 
      ? Object.keys(initiativeMap).map((initiative, index) => ({
          initiative,
          matchScore: 0,
          details: initiativeDetails[initiative],
          matchedTopics: []
        }))
      : topMatches;

    const filteredCards = displayCards.filter(card => {
      const searchLower = searchQuery.toLowerCase();
      return (
        card.initiative.toLowerCase().includes(searchLower) ||
        card.details.company.toLowerCase().includes(searchLower) ||
        card.details.challenge.toLowerCase().includes(searchLower) ||
        card.details.description.toLowerCase().includes(searchLower) ||
        card.matchedTopics.some((topic: string) => topic.toLowerCase().includes(searchLower))
      );
    });

    return (
      <div className="swipe-container">
        <div className="results-container">
          <div className="results-nav"
               ref={navRef}
               onMouseDown={handleMouseDown}
               onMouseMove={handleMouseMove}
               onMouseUp={handleMouseUp}
               onMouseLeave={handleMouseLeave}>
            <button 
              className={`nav-button ${activeNav === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveNav('projects')}
            >
              Projects
            </button>
            <button 
              className={`nav-button ${activeNav === 'badges' ? 'active' : ''}`}
              onClick={() => setActiveNav('badges')}
            >
              My Badges
            </button>
            <button 
              className={`nav-button ${activeNav === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveNav('leaderboard')}
            >
              Leaderboard
            </button>
            <button 
              className={`nav-button ${activeNav === 'community' ? 'active' : ''}`}
              onClick={() => setActiveNav('community')}
            >
              Community
            </button>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search initiatives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          {activeNav === 'projects' && (
            <>
          {likedTopics && likedTopics.length === 0 ? (
            <>
              <h2>Discover Virgin Initiatives</h2>
              <p>Here are some initiatives that might interest you:</p>
            </>
          ) : (
            <>
              <h2>Your Top Initiative Matches</h2>
              <p>Based on your interests, these Virgin initiatives align with your values:</p>
            </>
          )}
          
          <div className="results-grid">
            {filteredCards.map((match, index) => (
                  <div key={match.initiative} className="swipe-match-result">
                <ResultsCard 
                  project={{
                    id: index.toString(),
                    name: match.initiative,
                    imageUrl: match.details.imageUrl,
                    details: {
                      company: match.details.company,
                      challenge: match.details.challenge,
                      description: match.details.description
                    }
                  }} 
                  rank={index + 1} 
                  onChatClick={handleChatClick}
                      matchedInterests={match.matchedTopics}
                      index={index}
                    />
              </div>
            ))}
          </div>
          
          {filteredCards.length === 0 && (
            <div className="no-results">
              No initiatives found matching your search.
            </div>
          )}
          
          {likedTopics && likedTopics.length === 0 && (
            <div className="discovery-hint">
              Try again to find initiatives that match your specific interests!
            </div>
          )}
          
          <button className="reset-button" onClick={resetChoices}>
            Start Over
          </button>
            </>
          )}
          
          {activeNav === 'badges' && (
            <div className="badges-container">
              <h2>My Sustainability Badges</h2>
              <p>Track your achievements and impact on sustainability initiatives.</p>
              
              <div className="user-total-points">
                <div className="total-points-value">{userPoints}</div>
                <div className="total-points-label">Total Sustainability Points</div>
              </div>
              
              <div className="stats-container">
                <div className="stat-card">
                  <div className="stat-value">3</div>
                  <div className="stat-label">Projects Joined</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Interests Matched</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">2</div>
                  <div className="stat-label">Badges Earned</div>
                </div>
              </div>

              <div className="next-milestone">
                <div className="next-milestone-title">Next Badge: {nextBadge.name}</div>
                <div className="milestone-progress-bar">
                  <div className="milestone-progress-fill" style={{ width: `${nextBadge.progress}%` }}></div>
                </div>
                <div className="milestone-remaining">{nextBadge.remaining} more points needed</div>
              </div>

              <div className="badges-section">
                <h3>Earned Badges</h3>
                <div className="badges-grid">
                  <div className="badge-item">
                    <div className="badge-icon earned">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"></path>
                        <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"></path>
                      </svg>
                    </div>
                    <div className="badge-name">Early Adopter</div>
                    <div className="badge-description">Joined the sustainability initiative</div>
                  </div>
                  
                  <div className="badge-item">
                    <div className="badge-icon earned">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10"></path>
                      </svg>
                    </div>
                    <div className="badge-name">Climate Defender</div>
                    <div className="badge-description">Supported climate initiatives</div>
                  </div>
                </div>
              </div>
              
              <div className="badges-section">
                <h3>Locked Badges</h3>
                <div className="badges-grid">
                  <div className="badge-item">
                    <div className="badge-icon locked">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 17.2a6 6 0 0 0 8 0"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    </div>
                    <div className="badge-name">Community Champion</div>
                    <div className="badge-description">Engage with 5 community projects</div>
                  </div>
                  
                  <div className="badge-item">
                    <div className="badge-icon locked">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12h6"></path>
                        <path d="M22 12h-6"></path>
                        <path d="M12 2v6"></path>
                        <path d="M12 22v-6"></path>
                        <path d="m17 3-5 5-5-5"></path>
                        <path d="m17 21-5-5-5 5"></path>
                        <path d="m3 17 5-5-5-5"></path>
                        <path d="m21 17-5-5 5-5"></path>
                      </svg>
                    </div>
                    <div className="badge-name">Ocean Guardian</div>
                    <div className="badge-description">Support marine conservation</div>
                  </div>
                  
                  <div className="badge-item">
                    <div className="badge-icon locked">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 11V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v5"></path>
                        <path d="M9 12h6"></path>
                        <path d="M12 22v-6"></path>
                        <path d="M8 22h8"></path>
                      </svg>
                    </div>
                    <div className="badge-name">Eco Innovator</div>
                    <div className="badge-description">Engage with technology initiatives</div>
                  </div>
                  
                  <div className="badge-item">
                    <div className="badge-icon locked">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                      </svg>
                    </div>
                    <div className="badge-name">Consistency Master</div>
                    <div className="badge-description">Join for 30 consecutive days</div>
                  </div>
                </div>
              </div>
              
            </div>
          )}
          
          {activeNav === 'leaderboard' && (
            <div className="leaderboard-container">
              <h2>Sustainability Leaderboard</h2>
              <p>See how your sustainability efforts compare to others.</p>
              
              <div className="leaderboard-list">
                <div className="leaderboard-item">
                  <div className="leaderboard-rank">1</div>
                  <div className="leaderboard-user">
                    <div className="user-avatar">JD</div>
                    <div className="user-info">
                      <div className="user-name">Jane Doe</div>
                      <div className="user-badges">8 badges • 5 projects</div>
                    </div>
                  </div>
                  <div className="leaderboard-points">1240</div>
                </div>
                
                <div className="leaderboard-item">
                  <div className="leaderboard-rank">2</div>
                  <div className="leaderboard-user">
                    <div className="user-avatar">MS</div>
                    <div className="user-info">
                      <div className="user-name">Mike Smith</div>
                      <div className="user-badges">6 badges • 4 projects</div>
                    </div>
                  </div>
                  <div className="leaderboard-points">980</div>
                </div>
                
                <div className="leaderboard-item current-user">
                  <div className="leaderboard-rank">3</div>
                  <div className="leaderboard-user">
                    <div className="user-avatar">ME</div>
                    <div className="user-info">
                      <div className="user-name">You</div>
                      <div className="user-badges">2 badges • 3 projects</div>
                    </div>
                  </div>
                  <div className="leaderboard-points">750</div>
                </div>
                
                <div className="leaderboard-item">
                  <div className="leaderboard-rank">4</div>
                  <div className="leaderboard-user">
                    <div className="user-avatar">TK</div>
                    <div className="user-info">
                      <div className="user-name">Taylor Kim</div>
                      <div className="user-badges">3 badges • 2 projects</div>
                    </div>
                  </div>
                  <div className="leaderboard-points">620</div>
                </div>
                
                <div className="leaderboard-item">
                  <div className="leaderboard-rank">5</div>
                  <div className="leaderboard-user">
                    <div className="user-avatar">RJ</div>
                    <div className="user-info">
                      <div className="user-name">Robin Jones</div>
                      <div className="user-badges">2 badges • 1 project</div>
                    </div>
                  </div>
                  <div className="leaderboard-points">450</div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'community' && (
            <div className="community-container">
              <h2>Community</h2>
              <p>Connect with like-minded individuals passionate about sustainability.</p>
              
              <div className="community-stats">
                <div className="stat-card">
                  <div className="stat-value">1,240</div>
                  <div className="stat-label">Community Members</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">32</div>
                  <div className="stat-label">Active Discussions</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">8</div>
                  <div className="stat-label">Upcoming Events</div>
                </div>
              </div>
              
              <div className="discussion-section">
                <h3>Active Discussions</h3>
                <div className="discussion-list">
                  <div className="discussion-item" onClick={() => handleDiscussionClick('1')}>
                    <div className="discussion-avatar">SG</div>
                    <div className="discussion-content">
                      <div className="discussion-header">
                        <div className="discussion-title">Ideas for reducing plastic waste</div>
                        <div className="discussion-meta">Started by Sarah Green • 2 days ago</div>
                      </div>
                      <div className="discussion-stats">
                        <span>24 replies</span>
                        <span>38 likes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="discussion-item" onClick={() => handleDiscussionClick('2')}>
                    <div className="discussion-avatar">JR</div>
                    <div className="discussion-content">
                      <div className="discussion-header">
                        <div className="discussion-title">Virgin Atlantic's SAF initiative discussion</div>
                        <div className="discussion-meta">Started by John Reese • 5 days ago</div>
                      </div>
                      <div className="discussion-stats">
                        <span>18 replies</span>
                        <span>29 likes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="discussion-item" onClick={() => handleDiscussionClick('3')}>
                    <div className="discussion-avatar">AG</div>
                    <div className="discussion-content">
                      <div className="discussion-header">
                        <div className="discussion-title">Community clean-up event planning</div>
                        <div className="discussion-meta">Started by Alice Garcia • 1 week ago</div>
                      </div>
                      <div className="discussion-stats">
                        <span>42 replies</span>
                        <span>56 likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="events-section">
                <h3>Upcoming Events</h3>
                <div className="events-list">
                  <div className="event-item">
                    <div className="event-date">
                      <div className="date-month">MAY</div>
                      <div className="date-day">15</div>
                    </div>
                    <div className="event-details">
                      <div className="event-title">Virtual Sustainability Workshop</div>
                      <div className="event-description">Learn practical ways to reduce your carbon footprint</div>
                      <div className="event-meta">Online • 45 participants</div>
                    </div>
                  </div>
                  
                  <div className="event-item">
                    <div className="event-date">
                      <div className="date-month">MAY</div>
                      <div className="date-day">22</div>
                    </div>
                    <div className="event-details">
                      <div className="event-title">Beach Clean-up Initiative</div>
                      <div className="event-description">Join us in cleaning local beaches and waterways</div>
                      <div className="event-meta">Multiple Locations • 120 participants</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="community-action-button">
                Start New Discussion
              </button>
              
            </div>
          )}
          
        
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="swipe-container">
        <div className="swipe-loading">Loading...</div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="swipe-container">
      <SwipeCard 
        card={currentCard} 
        onLike={handleLike} 
        onDislike={handleDislike}
        onSkip={handleSkip}
      />
      <div className="swipe-progress">
        Card {currentCardIndex + 1} of {cards.length}
      </div>
    </div>
  );
};

export default SwipeContainer; 