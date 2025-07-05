export const getSuggestedTopics = async (occupation: string): Promise<string[]> => {
  // Simulate processing delay for UX
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let topics: string[] = [
    "Build a Personal Portfolio Website in Just 3 Days",
    "Master Time Management Tools and Techniques",
    "Start Journaling to Improve Daily Focus and Productivity",
    "Learn to Give Constructive Feedback in Any Situation",
    "Explore Productivity Hacks to Work Smarter Every Day"
  ];

  switch (occupation?.toLowerCase()) {
    case "software engineer":
      topics = [
        "Build a RESTful API with Node.js and Express in 3 Days",
        "React Fundamentals and Hooks – A Rapid Hands-On Guide",
        "Master Git & GitHub Workflows for Collaboration",
        "TypeScript Crash Course for JavaScript Developers",
        "Create a Full-Stack Mini Project (Frontend + Backend)"
      ];
      break;
    case "designer":
      topics = [
        "Redesign a Modern Landing Page from Scratch in Figma",
        "UX Research & Wireframing: Start to Finish in 3 Days",
        "Create a Reusable Design System for Web Apps",
        "Master Figma Auto-Layout and Responsive Design",
        "Add Motion and Interaction with Framer Motion Basics"
      ];
      break;
    case "product manager":
      topics = [
        "Write a Complete Product Requirement Doc (PRD) in 3 Days",
        "Master Agile Methodologies and Sprint Planning Basics",
        "Learn Prioritization Frameworks: RICE, MoSCoW, ICE",
        "Conduct User Interviews and Define Personas Quickly",
        "Build a Lean MVP Roadmap with Real-World Constraints"
      ];
      break;
    case "data scientist":
      topics = [
        "Build a Machine Learning Model Using scikit-learn",
        "3-Day Pandas Bootcamp for Data Cleaning and Analysis",
        "Visualize Insights with Seaborn, Plotly & Matplotlib",
        "Understand Regression and Classification Fundamentals",
        "Start a Kaggle Project and Publish Your First Notebook"
      ];
      break;
    case "marketing manager":
      topics = [
        "Design and Launch a Simple Digital Ad Campaign in 3 Days",
        "Learn Meta Ads and Google Ads Basics with Hands-On Labs",
        "Get Started with Email Marketing Tools like Mailchimp",
        "SEO Basics: Optimize Content and Track Rankings Fast",
        "Build a Social Media Content Calendar for Your Brand"
      ];
      break;
    case "sales representative":
      topics = [
        "Craft a High-Converting Sales Pitch and Refine It",
        "CRM Mastery: HubSpot or Zoho in 3 Days",
        "Learn to Handle Objections and Close More Deals",
        "Create a Sales Funnel Strategy from Lead to Deal",
        "Write Effective Cold Emails That Get Replies"
      ];
      break;
    case "teacher":
      topics = [
        "Design a Digital Lesson Plan and Teach it Online",
        "Gamify Your Teaching with Kahoot & Quizizz",
        "Get Started with Google Classroom in 3 Days",
        "Create Interactive Learning Activities in Canva",
        "Master Online Teaching Tools for Student Engagement"
      ];
      break;
    case "doctor":
      topics = [
        "Learn the Basics of Telemedicine and Virtual Care",
        "Use Digital Tools to Track and Improve Patient Care",
        "Explore Emerging Healthcare Technologies in 3 Days",
        "Write Effective and Automated Medical Notes",
        "Improve Patient Communication and Counseling Skills"
      ];
      break;
    case "lawyer":
      topics = [
        "Draft and Review Basic Contracts in Google Docs",
        "Explore Legal Tech Tools to Improve Case Management",
        "IP Law Crash Course: Trademarks, Copyrights & Patents",
        "Master Legal Research Using Free Online Tools",
        "Compliance and Ethics Essentials for Modern Law"
      ];
      break;
    case "consultant":
      topics = [
        "Create a Business Discovery Framework and Test It",
        "Design a Full Business Case Deck in Google Slides",
        "Build a Simple Financial Model from a Case Study",
        "Client Onboarding & Relationship Management in 3 Days",
        "Market Sizing Techniques Using Real Data Sets"
      ];
      break;
    case "entrepreneur":
      topics = [
        "Validate Your Startup Idea with Real Feedback in 3 Days",
        "Build a Landing Page and Collect Signups Using No-Code",
        "Integrate Stripe or Razorpay for Fast Payments",
        "Set Up Your MVP Using Softr, Tally or Notion",
        "Learn to Pitch Your Idea with a Powerful Story"
      ];
      break;
    case "student":
      topics = [
        "Craft a Polished Resume with ATS Optimization Tips",
        "Learn Python Basics and Build a Mini App in 3 Days",
        "Organize Study & Projects with Notion Like a Pro",
        "Create a To-Do App Project with HTML, CSS and JS",
        "Practice for an Interview Using Common Questions"
      ];
      break;
    case "other":
    default:
      topics = [
        "Set Up a Personal Knowledge System Using Notion",
        "Learn to Speak Confidently with Public Speaking Drills",
        "Master Google Workspace for Productivity and Teams",
        "Design Your Ideal Week Using Time-Blocking Techniques",
        "Create a Digital Vision Board and Life Dashboard"
      ];
      break;
  }

  return topics;
};
