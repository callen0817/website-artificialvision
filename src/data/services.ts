import { Service } from "@/types/service";

export const services: Service[] = [
  // Hardware
  {
    id: "scanar",
    category: "Hardware",
    name: "scanAR",
    shortDescription: "Professional handheld LiDAR scanning system - Preorder",
    description: "scanAR is a hard-hat-mounted mapping device that combines a hemispherical LiDAR sensor, global shutter camera, and dual RTK positioning. Capture accurate indoor and outdoor environments while walking the site—ideal for rapid as-built documentation, facility mapping, and construction verification.",
    startingPrice: 15000,
    image: "card-scanar",
    features: [
      "Handheld mobility",
      "±5mm accuracy",
      "Real-time preview",
      "SLAM technology",
      "Long battery life",
      "Ruggedized design"
    ],
    deliverables: [],
    reviews: [
      {
        id: "r15",
        author: "Jordan Martinez",
        rating: 5,
        comment: "Perfect for our renovation projects. Gets into spaces our tripod scanner can't and delivers quality data.",
        date: "2024-03-10"
      },
      {
        id: "r16",
        author: "Sam Patterson",
        rating: 5,
        comment: "The mobility is incredible. We're completing scans in half the time.",
        date: "2024-02-25"
      }
    ],
    formFields: []
  },
  // Reality Capture Services
  {
    id: "lidar-scanning",
    category: "Reality Capture",
    name: "LiDAR Scanning",
    shortDescription: "High-precision 3D scanning for as-built documentation",
    description: "Capture precise, high-resolution spatial data with our advanced LiDAR scanning services. We deliver accurate point clouds ideal for as-built documentation, clash detection, construction validation, and digital twin creation. Our workflows ensure fast turnaround, exceptional accuracy, and seamless integration into your CAD or BIM environment.",
    startingPrice: 1000,
    image: "card-lidar-scanning",
    features: [
      "±2mm accuracy",
      "Full-color point clouds",
      "BIM-ready deliverables",
      "Fast site capture",
      "Minimal disruption"
    ],
    deliverables: [
      "Raw Point Cloud (E57/LAS)",
      "Mesh Model"
    ],
    reviews: [
      {
        id: "r1",
        author: "Sarah Mitchell",
        rating: 5,
        comment: "Exceptional accuracy and turnaround time. The team was professional and the deliverables exceeded expectations.",
        date: "2024-01-15"
      },
      {
        id: "r2",
        author: "Michael Chen",
        rating: 5,
        comment: "Used for our hospital renovation project. The precision was critical and C4 delivered flawlessly.",
        date: "2024-02-20"
      }
    ],
    formFields: [
      {
        id: "building-size",
        label: "Approximate Building Size (sq ft)",
        type: "text",
        required: true
      },
      {
        id: "num-buildings",
        label: "Number of Buildings",
        type: "select",
        options: ["1", "2", "3", "4", "5", "6-10", "10+"],
        required: true
      }
    ]
  },
  {
    id: "photogrammetry",
    category: "Reality Capture",
    name: "Photogrammetry",
    shortDescription: "Detailed 3D models from high-resolution photography",
    description: "Transform real-world environments into immersive digital experiences. Using high-quality imagery and precise reconstruction techniques, we deliver detailed photogrammetry models and interactive virtual tours for design, engineering, real estate, and facility management.",
    startingPrice: 1000,
    image: "card-photogrammetry",
    features: [
      "Photo-realistic textures",
      "High-resolution models",
      "Scalable to any size",
      "Cost-effective",
      "Detailed facades"
    ],
    deliverables: [
      "3D Textured Mesh",
      "High-Resolution Orthophotos",
      "Point Cloud",
      "CAD Drawings",
      "BIM Integration",
      "4K Texture Maps"
    ],
    reviews: [
      {
        id: "r3",
        author: "Jennifer Lopez",
        rating: 5,
        comment: "Perfect for our historic building documentation. The textures were incredibly detailed.",
        date: "2024-01-28"
      }
    ],
    formFields: [
      {
        id: "structure-type",
        label: "Structure Type",
        type: "select",
        options: ["Building Facade", "Interior Space", "Monument", "Landscape", "Other"],
        required: true
      },
      {
        id: "coverage-area",
        label: "Coverage Area Description",
        type: "textarea",
        required: true
      }
    ]
  },
  {
    id: "drone-services",
    category: "Reality Capture",
    name: "Drone Services",
    shortDescription: "Aerial documentation and site analysis",
    description: "Acquire aerial insights with professional drone imagery and mapping. We provide high-definition photos, videos, orthomosaic maps, elevation models, and site documentation. Perfect for construction progress tracking, site planning, asset inspection, and marketing visuals.",
    startingPrice: 1000,
    image: "card-drone-services",
    features: [
      "FAA certified pilots",
      "4K video capability",
      "Aerial mapping",
      "Progress tracking",
      "Site inspection"
    ],
    deliverables: [
      "Aerial Photographs (4K)",
      "Video Documentation",
      "Point Cloud"
    ],
    reviews: [
      {
        id: "r4",
        author: "David Brown",
        rating: 5,
        comment: "Regular progress documentation for our construction site. Always on time and high quality.",
        date: "2024-03-05"
      }
    ],
    formFields: [
      {
        id: "site-size",
        label: "Site Size (sq ft)",
        type: "text",
        required: true
      },
      {
        id: "flight-restrictions",
        label: "Known Flight Restrictions",
        type: "textarea",
        required: false
      }
    ]
  },
  
  // BIM Services
  {
    id: "bim-coordination",
    category: "BIM Services",
    name: "BIM Coordination",
    shortDescription: "Multi-discipline clash detection and coordination",
    description: "Streamline project collaboration with expert BIM coordination. We manage model integration, clash detection, design validation, and constructability reviews, ensuring your project progresses smoothly with fewer conflicts, delays, and rework.",
    startingPrice: 1,
    image: "card-bim-coordination",
    features: [
      "Clash detection",
      "Multi-discipline coordination",
      "Navisworks expertise",
      "Coordination meetings",
      "Issue tracking"
    ],
    deliverables: [
      "Clash Detection Report",
      "Coordinated Model",
      "Issue Log",
      "Coordination Drawings",
      "Meeting Minutes",
      "Resolution Documentation"
    ],
    reviews: [
      {
        id: "r5",
        author: "Robert Martinez",
        rating: 5,
        comment: "Caught multiple conflicts that would have been costly on site. Excellent coordination throughout.",
        date: "2024-02-10"
      }
    ],
    formFields: [
      {
        id: "project-size",
        label: "Project Size (sq ft)",
        type: "text",
        required: true
      },
      {
        id: "disciplines",
        label: "Disciplines to Coordinate",
        type: "checkboxlist",
        options: ["Arch", "Struct", "M Duct", "M Pipe", "Elec", "LV", "A/V", "Fire", "Security", "Other"],
        hasOther: true,
        required: true
      }
    ]
  },
  {
    id: "2d-cad",
    category: "BIM Services",
    name: "2D CAD Drafting",
    shortDescription: "Professional 2D drafting and documentation",
    description: "Our drafting services deliver clear, precise 2D drawings for architectural, engineering, and manufacturing needs. From redlines and as-builts to detailed plans, sections, and elevations, we ensure accuracy, consistency, and professional documentation every time.",
    startingPrice: 1,
    image: "card-2d-cad-drafting",
    features: [
      "AutoCAD expertise",
      "Construction documents",
      "As-built drawings",
      "Detail drawings",
      "Fast turnaround"
    ],
    deliverables: [
      "CAD Files (DWG)",
      "PDF Documents"
    ],
    reviews: [
      {
        id: "r6",
        author: "Lisa Anderson",
        rating: 5,
        comment: "Clean, accurate drawings. Great communication throughout the process.",
        date: "2024-03-12"
      }
    ],
    formFields: [
      {
        id: "project-size",
        label: "Project Size (sq ft)",
        type: "text",
        required: true
      }
    ]
  },
  {
    id: "3d-modeling",
    category: "BIM Services",
    name: "BIM (3D Modeling)",
    shortDescription: "Detailed Revit and BIM modeling services",
    description: "We create accurate 3D models tailored to your project requirements—architectural, structural, mechanical, or product-based. Whether for visualization, engineering analysis, fabrication, or digital twins, our models are built to industry standards and optimized for downstream workflows. Standard plan, RCP, interior, and exterior elevation views are included as applicable.",
    startingPrice: 1,
    image: "card-bim-3d-modeling",
    features: [
      "Revit native",
      "LOD 100-500",
      "Parametric families",
      "Data-rich models",
      "Visualization ready"
    ],
    deliverables: [
      "Revit Model (RVT)",
      "IFC Export",
      "Navisworks Model"
    ],
    reviews: [
      {
        id: "r7",
        author: "Tom Wilson",
        rating: 5,
        comment: "High-quality Revit models that integrated perfectly with our workflow.",
        date: "2024-01-22"
      }
    ],
    formFields: [
      {
        id: "project-size",
        label: "Project Size (sq ft)",
        type: "text",
        required: true
      },
      {
        id: "lod-level",
        label: "Required Level of Detail (LOD)",
        type: "select",
        options: ["LOD 100", "LOD 200", "LOD 300", "LOD 350", "LOD 400", "LOD 500"],
        required: true
      },
      {
        id: "phases",
        label: "Phases",
        type: "checkboxlist",
        options: ["Existing", "Demo", "Proposed", "Record"],
        required: true
      },
      {
        id: "disciplines",
        label: "Disciplines",
        type: "checkboxlist",
        options: ["Arch", "Struct", "M Duct", "M Pipe", "Elec", "LV", "A/V", "Fire", "Security", "Other"],
        hasOther: true,
        required: true
      }
    ]
  },
  {
    id: "construction-drawings",
    category: "BIM Services",
    name: "Construction Drawings",
    shortDescription: "Complete construction document sets",
    description: "Get complete, code-compliant construction documentation prepared to meet industry and permitting standards. We produce detailed plans, annotations, schedules, and specifications to support seamless construction execution.",
    startingPrice: 400,
    image: "card-construction-drawings",
    features: [
      "Permit-ready",
      "Fully coordinated",
      "Detail-rich",
      "Code compliant",
      "Multiple formats"
    ],
    deliverables: [
      "PDF Documents",
      "DWG Files",
      "Updated Revit File"
    ],
    reviews: [
      {
        id: "r8",
        author: "Emily Johnson",
        rating: 5,
        comment: "Thorough documentation that passed plan review on first submission.",
        date: "2024-02-28"
      }
    ]
  },

  // Custom
  {
    id: "custom-services",
    category: "Custom",
    name: "Custom Services",
    shortDescription: "Describe your unique project needs",
    description: "Have a unique challenge? We design custom solutions that combine scanning, modeling, BIM, automation, and software workflows to fit your specific needs. From bespoke data processing to specialized hardware integrations, we deliver solutions built just for you.",
    startingPrice: 0,
    image: "card-custom-services",
    features: [
      "Flexible solutions",
      "Custom pricing",
      "Tailored approach",
      "Expert consultation",
      "Any scale project"
    ],
    deliverables: [],
    reviews: [],
    formFields: []
  }
];
