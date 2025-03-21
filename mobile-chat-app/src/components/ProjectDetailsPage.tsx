import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectDetailsPage.css';

// Import SVG for back button
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"></path>
    <path d="M12 19l-7-7 7-7"></path>
  </svg>
);

interface InitiativeDetails {
  company: string;
  challenge: string;
  description: string;
  imageUrl: string;
  callToAction: string;
}

interface InitiativeDetailsMap {
  [key: string]: InitiativeDetails;
}

interface InitiativeTopicsMap {
  [key: string]: string[];
}
const handleShareClick = () => {
  // In a real app, this would open a share dialog
  alert('Share functionality would be implemented here');
};

const handleDonateClick = () => {
  // In a real app, this would navigate to a donation page
  alert('Donation functionality would be implemented here');
};

const handleVolunteerClick = () => {
  // In a real app, this would navigate to a volunteer signup page
  alert('Volunteer signup would be implemented here');
};
const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [projectDetails, setProjectDetails] = useState<{ name: string; details: InitiativeDetails; topics: string[] } | null>(null);

  // Initiative topics map
  const initiativeMap: InitiativeTopicsMap = {
    'Virgin Atlantic - Youngest, Cleanest Fleet in the Sky': [
      'Climate Action',
      'Technological Innovation',
      'Environmental Protection & Carbon Reduction'
    ],
    'Virgin Atlantic & Virgin Unite - Protecting our Planet': [
      'Ecosystem Conservation',
      'Biodiversity Preservation',
      'Climate Action'
    ],
    'Virgin Voyages - Epic Sea Change For All': [
      'Ecosystem Conservation',
      'Biodiversity Preservation',
      'Climate Action'
    ],
    'Virgin Media O2 - Better Connections Plan (Recycling)': [
      'Circular Economy',
      'Waste Reduction',
      'Environmental Protection & Carbon Reduction'
    ],
    'Virgin Media O2 - Better Connections Plan (Digital Divide)': [
      'Digital Inclusion',
      'Social Equity',
      'Community Empowerment'
    ],
    'Virgin Media O2 - Better Connections Plan (Eco Rating)': [
      'Sustainable Consumption',
      'Environmental Protection & Carbon Reduction',
      'Transparency & Accountability'
    ],
    'Virgin Media O2 - Better Connections Plan (Second-hand Devices)': [
      'Circular Economy',
      'Waste Reduction',
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

  // Initiative details
  const initiativeDetails: InitiativeDetailsMap = {
    'Virgin Atlantic - Youngest, Cleanest Fleet in the Sky': {
      company: 'Virgin Atlantic',
      challenge: 'The time for action against climate change is now. Virgin Atlantic are on a mission to achieve net-zero by 2050.',
      description: 'Virgin Atlantic is working to accelerate the development of sustainable fuels. On November 28th, we made history with Flight100 becoming the first commercial airline to fly across the Atlantic on 100% SAF - marking a key milestone on the path to decarbonising aviation.',
      imageUrl: 'https://images.ctfassets.net/rxqefefl3t5b/3cNPacvs5XOn36kvDhDkXf/a9a46bd03c2e5b9da9c5398ae14eb34b/A350_Air2Air2019_Retouched_DSC4963_EM4.jpg?fl=progressive&q=80',
      callToAction:'Stay informed, Sign up for updates on ways you can get involved in making a difference'
    },
    'Virgin Atlantic & Virgin Unite - Protecting our Planet': {
      company: 'Virgin Atlantic & Virgin Unite',
      challenge: 'Preserving our planet requires collaborative approaches to environmental conservation.',
      description: 'Virgin Atlantic and Virgin Unite are collaborating on comprehensive environmental initiatives aimed at protecting biodiversity and natural habitats while implementing sustainable practices throughout their operations.',
      imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=500&auto=format&fit=crop',
      callToAction:'Stay informed, Donate to RMI'
    },
    'Virgin Voyages - Epic Sea Change For All': {
      company: 'Virgin Voyages',
      challenge: 'Wildlife havens, carbon stores, storm defences, ocean purifiers - mangrove swamps are one of the hardest-working habitats on Earth, but they\'re disappearing fast.',
      description: 'Virgin Voyages have teamed up with Virgin\'s Foundation, Virgin Unite, to support mangrove forest projects in the Caribbean. The aim is to accelerate nature-based solutions to climate change, and create a scalable model for other regions in the world.',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop',
      callToAction:'Get involved in a Beach Clean onboard, Donate to Sea Change For All Fund (not currently available)'
    },
    'Virgin Media O2 - Better Connections Plan (Recycling)': {
      company: 'Virgin Media O2',
      challenge: 'Electronic waste is one of the fastest-growing waste streams globally, with significant environmental impacts.',
      description: 'Virgin Media O2\'s recycling initiative is tackling e-waste by implementing comprehensive recycling programs for electronic devices and accessories, reducing landfill waste and promoting circular economy principles.',
      imageUrl: 'https://images.unsplash.com/photo-1590219590780-f8cfab573cc1?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=500&auto=format&fit=crop',
      callToAction:'Sell your old device with O2 Recycle'
    },
    'Virgin Media O2 - Better Connections Plan (Digital Divide)': {
      company: 'Virgin Media O2',
      challenge: 'The digital divide, or the split between those with and without reliable internet connectivity and related technologies, has profound implications on society.',
      description: 'Community Calling is a pioneering initiative by Virgin Media O2 and environmental charity Hubbub to tackle digital exclusion. It has already rehomed more than 20,000 unused smartphones with people who need them across the country.',
      imageUrl: 'https://images.unsplash.com/photo-1595392029731-a6a252df1fd1?q=80&w=500&auto=format&fit=crop',
      callToAction:'Donate devices via Community Calling'
    },
    'Virgin Media O2 - Better Connections Plan (Eco Rating)': {
      company: 'Virgin Media O2',
      challenge: 'Consumers often lack transparent information about the environmental impact of their technology choices.',
      description: 'The Eco Rating initiative provides clear information about the environmental impact of mobile devices, helping consumers make more sustainable choices and encouraging manufacturers to improve their practices.',
      imageUrl: 'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?q=80&w=500&auto=format&fit=crop',
      callToAction:'Use the Eco Rating Scheme'
    },
    'Virgin Media O2 - Better Connections Plan (Second-hand Devices)': {
      company: 'Virgin Media O2',
      challenge: 'The continuous cycle of new device purchases contributes significantly to electronic waste and resource depletion.',
      description: 'Virgin Media O2\'s second-hand device program extends the lifecycle of electronic devices, reducing waste and making technology more accessible while significantly reducing the carbon footprint associated with manufacturing new devices.',
      imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=500&auto=format&fit=crop',
      callToAction:'Buy a like-new second hand smartphone or tablet'
    },
    'Virgin Limited Edition & Virgin Unite - Pride \'n Purpose': {
      company: 'Virgin Limited Edition & Virgin Unite',
      challenge: 'Many communities face socioeconomic challenges that require sustainable development approaches.',
      description: 'Pride \'n Purpose works with communities to develop sustainable livelihoods, addressing social inequities through education, healthcare, and entrepreneurial initiatives that empower local populations and create lasting positive change.',
      imageUrl: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=500&auto=format&fit=crop',
      callToAction:'Volunteer during your visit to Ulusaba, Pack for a Purpose: Donate clothing and household supplies, Make a donation'
    },
    'Virgin Limited Edition & Virgin Unite - Mahali Mzuri: Inua Jamii': {
      company: 'Virgin Limited Edition & Virgin Unite',
      challenge: 'Wildlife conservation efforts must balance ecological needs with the socioeconomic well-being of local communities.',
      description: 'Mahali Mzuri\'s Inua Jamii initiative promotes sustainable tourism practices while supporting wildlife conservation and community development, creating a model where tourism benefits both nature and local communities.',
      imageUrl: 'https://www.virginlimitededition.com/media/yakleqrf/mahali-mzuri-camp-and-guides-1.jpg?q=80&w=500&auto=format&fit=crop',
      callToAction:'Volunteer during your visit to Mahali Mzuri, Visit the community or the Maa Trust, Pack for a Purpose: Donate clothing and household supplies, Make a donation'
    },
    'Virgin Unite - Planetary Guardians': {
      company: 'Virgin Unite',
      challenge: 'The dual crises of climate change and mass wildlife extinctions threaten to forever change our world.',
      description: 'Planetary Guardians brings together global leaders and organizations to address climate change through collaborative efforts, driving innovation and policy changes that protect our planet\'s ecosystems and biodiversity.',
      imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=500&auto=format&fit=crop',
      callToAction:'Watch the video to learn more about our nine planetary boundaries'
    },
    'Virgin Unite - The Elders': {
      company: 'Virgin Unite',
      challenge: 'Complex global issues require experienced leadership and collaborative approaches.',
      description: 'The Elders brings together former heads of state, peace activists, and human rights advocates to promote peace, justice, and sustainable development through independent leadership and constructive dialogue.',
      imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=500&auto=format&fit=crop',
      callToAction:'Sign their open letter calling for long view leadership on existential threats.'
    },
    'Virgin Unite - Ocean Unite / ORRAA': {
      company: 'Virgin Unite',
      challenge: 'The dual crises of climate change and mass wildlife extinctions threaten to forever change our world.',
      description: 'Ocean Unite / ORRAA in collaboration with the Marine Conservation Institute and Oceans 5, brought together 30 of the largest NGOs from around the world, stimulating joint efforts towards the goal of strongly protecting at least 30% of the Ocean by 2030.',
      imageUrl: 'https://onlyone-cms.imgix.net/v1v8cy5da8fh/6ef2qr8mVLZwMpctd7jlY9/37858fc8bc929522620398e35d016b3f/Alpha-Universe-Photo-by-Sony-Artisan-of-Imagery-Andy-Mann-DSC08557-Edit.880074f1fd6d9422f6c3fded126a54c8.jpg?w=1920&auto=compress,format?q=80&w=500&auto=format&fit=crop',
      callToAction:"Add your name to the petition urging leaders from CCAMLR member countries to act now to protect Antarctica's waters #CallOnCCAMLR"
    },
    'Virgin Unite - Community Mapathon: Humanitarian OpenStreetMap (HOT)': {
      company: 'Virgin Unite',
      challenge: 'Effective disaster response and climate change adaptation require accurate, up-to-date geographical information.',
      description: 'The Community Mapathon initiative uses open-source mapping to support humanitarian efforts, disaster relief, and climate change adaptation, building community resilience through improved geographical data and collaborative mapping.',
      imageUrl: 'https://images.ctfassets.net/rxqefefl3t5b/3K5qvqVy2RDMSapLI2yuaZ/79d2e16132d06d017b20e013ce47d643/Humanitarian_OpenStreetMap_Team_2.jpg?q=80&w=500&auto=format&fit=crop',
      callToAction:'Spare some time to join the mappers and help with mapping'
    },
    'Virgin Unite - Project CETI (Cetacean Translation Initiative)': {
      company: 'Virgin Unite',
      challenge: 'Humanity is facing the collapse of entire ecosystems, and the biodiversity of our planet is being eroded at unprecedented rates.',
      description: 'Project CETI uses machine learning and robotics to translate sperm whale clicks in Dominica. By shedding light on the intricate and intelligent communication of whales, the project not only aims to accelerate conservation efforts, but has the potential to transform the way we understand our relationship with the natural world.',
      imageUrl: 'https://cdn.prod.website-files.com/643ddd7ffdf12273933a8cec/66db26d5082b9717e2855981_male-and-female-whale-p-500.png?q=80&w=500&auto=format&fit=crop',
      callToAction:'Become a whale interpreter, Donate to support Project CETI'
    },
    'Virgin Unite - Eve Branson Foundation': {
      company: 'Virgin Unite',
      challenge: 'Rural communities often lack access to education, healthcare, and sustainable economic opportunities.',
      description: 'The Eve Branson Foundation supports rural communities by providing education, healthcare, and sustainable livelihood opportunities, empowering local artisans and entrepreneurs while preserving cultural heritage.',
      imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=500&auto=format&fit=crop',
      callToAction:'Donate, Visit, Pack for a Purpose, Buy EBF products through Virgin Red'
    },
    'Virgin Unite - Unite BVI': {
      company: 'Virgin Unite',
      challenge: 'Island communities face unique environmental and social challenges requiring sustainable development approaches.',
      description: 'Unite BVI works to create positive community and environmental impact in the British Virgin Islands through projects that support local entrepreneurs, conserve natural resources, and promote social equity.',
      imageUrl: 'https://images.ctfassets.net/zois51yf0qbx/1gd29y9PXUzXMFiUD6KzH6/531bdf4dc2df770b33ad004d3d6e604b/How_supports_us_piture_good_quality_cropped_for_website.jpg?q=80&w=500&auto=format&fit=crop',
      callToAction:'Join the community'
    } 
  };

  // Get the initiatives in the same order as they appear in the SwipeContainer
  const initiatives = Object.keys(initiativeMap);

  useEffect(() => {
    if (projectId) {
      try {
        // Decode the URL-encoded project name
        const decodedProjectId = decodeURIComponent(projectId);
        
        // Find the initiative by name
        if (initiativeDetails[decodedProjectId]) {
          setProjectDetails({
            name: decodedProjectId,
            details: initiativeDetails[decodedProjectId],
            topics: initiativeMap[decodedProjectId] || []
          });
        } else {
          console.error(`Project not found: ${decodedProjectId}`);
        }
      } catch (error) {
        console.error("Error finding project:", error);
      }
    }
  }, [projectId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleChatClick = () => {
    if (projectDetails) {
      // Find the index in the initiatives array to keep compatibility with chat routing
      const projectIndex = initiatives.indexOf(projectDetails.name);
      navigate(`/chat/${projectIndex >= 0 ? projectIndex : 0}`);
    }
  };

  if (!projectDetails) {
    return (
      <div className="project-details-loading">
        <p>Loading project details...</p>
      </div>
    );
  }
  const suggestedActions = [
    {
      title: 'Share Your Knowledge',
      description: 'Contribute to our environmental research by sharing your observations and data',
      icon: 'research',
      action: handleShareClick
    },
    {
      title: 'Make a Donation',
      description: 'Support this initiative with a financial contribution to accelerate our progress',
      icon: 'donate',
      action: handleDonateClick
    },
    {
      title: 'Volunteer Your Time',
      description: 'Join our team of volunteers working on implementing sustainable solutions',
      icon: 'volunteer',
      action: handleVolunteerClick
    }
  ];


  return (
    <div className="project-details-page">
      <div className="project-header">
        <button className="back-button" onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          Back
        </button>
        <h1>Project Details</h1>
      </div>

      <div className="project-image-container">
        <img 
          src={projectDetails.details.imageUrl || 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=500&auto=format&fit=crop'} 
          alt={projectDetails.name}
          className="project-image" 
        />
        <div className="project-image-overlay"></div>
      </div>

      <div className="project-content">
        <div className="project-title-section">
          <h2 className="project-company">{projectDetails.details.company}</h2>
          <h1 className="project-title">{projectDetails.name}</h1>
        </div>
        
        <div className="project-section">
          <h3 className="section-title">The Challenge</h3>
          <p className="section-content">{projectDetails.details.challenge}</p>
        </div>
        
        <div className="project-section">
          <h3 className="section-title">About the Initiative</h3>
          <p className="section-content">{projectDetails.details.description}</p>
        </div>
      
        <div className="project-section">
            <h3 className="section-title">How You Can Help</h3>
            <div className="actions-container">
              {suggestedActions.map((action, index) => (
                <div key={index} className="action-card">
                  <div className={`action-icon ${action.icon}`}>
                    {action.icon === 'research' && (
                     <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5c-.5-4.5-4-8-8.5-8.5-4 0-7.5 3.5-8.5 8.5-.5 4 3 7.5 7 8.5 4.5.5 8-3 9-7 .5-1 .5-1 1-1.5" />
                        <path d="M12 6L12 12 17 12" />
                      </svg>
                    )}
                    {action.icon === 'donate' && (
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 10V8c0-1.1.9-2 2-2h6a2 2 0 0 1 2 2v2H7z" />
                        <path d="M5 18a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5z" />
                        <path d="M12 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                      </svg>
                    )}
                    {action.icon === 'volunteer' && (
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    )}
                  </div>
                  <div className="action-content">
                    <h4 className="action-title">{action.title}</h4>
                    <p className="action-description">{action.description}</p>
                    <button className="action-button_2" onClick={action.action}>
                      Get Involved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
    

        <div className="project-section">
          <h3 className="section-title">Call to Action</h3>
          <p className="section-content">{projectDetails.details.callToAction}</p>
        </div>
        
        
        <div className="project-section">
          <h3 className="section-title">Sustainability Topics</h3>
          <div className="sustainability-topics">
            {projectDetails.topics.map((topic, index) => (
              <div key={index} className="topic-tag">
                {topic}
              </div>
            ))}
          </div>
        </div>
        
        <button className="chat-button primary-button" onClick={handleChatClick}>
          <svg className="chat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Chat with {projectDetails.details.company.split(' ')[0]}
        </button>
      </div>
    </div>
  );
};

export default ProjectDetailsPage; 