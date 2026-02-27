export interface ResumeData {
  name: string
  title: string
  summary: string
  avatar?: string
  contact: {
    email: string
    phone: string
    location: string
    linkedin?: string
    github?: string
    website?: string
    socials?: { label: string; url: string }[]
  }
  experience: {
    company: string
    position: string
    period: string
    description: string[]
  }[]
  education: {
    school: string
    degree: string
    period: string
    description?: string
  }[]
  projects: {
    name: string
    description: string
    tech: string[]
    demo?: string
    github?: string
  }[]
  skills: {
    category: string
    items: string[]
  }[]
}

export const resumeData: ResumeData = {
  name: "Từ Phương Vinh",
  title: "Full-stack Web Development | AI Operator | Unity Developer",
  summary:
    "Passionate software engineer with experience in building modern web applications. I love creating clean, efficient, and user-friendly digital experiences that solve real-world problems.",
  contact: {
    email: "vinh@example.com",
    phone: "+84 123 456 789",
    location: "Ho Chi Minh City, Vietnam",
    linkedin: "linkedin.com/in/vinh",
    github: "github.com/vinh",
    website: "vinh-cv.web.app",
    socials: [
      { label: "GitHub", url: "https://github.com/vinh" },
      { label: "LinkedIn", url: "https://linkedin.com/in/vinh" },
    ],
  },
  experience: [
    {
      company: "Tech Company A",
      position: "Senior Frontend Developer",
      period: "2023 - Present",
      description: [
        "Led development of customer-facing web application serving 100K+ users",
        "Built reusable component library reducing development time by 40%",
        "Mentored junior developers and conducted code reviews",
      ],
    },
    {
      company: "Startup B",
      position: "Full Stack Developer",
      period: "2021 - 2023",
      description: [
        "Developed RESTful APIs and microservices using Node.js",
        "Implemented CI/CD pipelines improving deployment frequency by 3x",
        "Collaborated with design team to build responsive UI components",
      ],
    },
    {
      company: "Agency C",
      position: "Junior Developer",
      period: "2020 - 2021",
      description: [
        "Built and maintained websites for multiple clients",
        "Optimized page load performance achieving 90+ Lighthouse scores",
        "Participated in agile development sprints and daily standups",
      ],
    },
  ],
  education: [
    {
      school: "University of Technology",
      degree: "Bachelor of Computer Science",
      period: "2016 - 2020",
      description: "GPA: 3.5/4.0 — Dean's List",
    },
  ],
  projects: [
    {
      name: "Portfolio Website",
      description: "Personal portfolio built with React and Firebase, featuring inline editing and dark mode.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
      demo: "https://vinhphuong.id.vn/",
      github: "",
    },
  ],
  skills: [
    {
      category: "Frontend",
      items: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Vue.js"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "Python", "PostgreSQL", "MongoDB"],
    },
    {
      category: "Tools & DevOps",
      items: ["Git", "Docker", "Firebase", "AWS", "CI/CD"],
    },
    {
      category: "Soft Skills",
      items: ["Team Leadership", "Problem Solving", "Communication", "Agile"],
    },
  ],
}
