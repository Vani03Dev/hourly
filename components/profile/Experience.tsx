import React from "react";
import { Briefcase } from "lucide-react";

export function Experience() {
  const experiences = [
    {
      role: "Partner & Tax Head",
      company: "Sharma & Associates",
      duration: "2018 - Present",
      description: "Leading the startup taxation and compliance division. Helped 50+ startups with structuring, GST compliance, and fundraising due diligence.",
    },
    {
      role: "Senior Manager, Taxation",
      company: "KPMG India",
      duration: "2014 - 2018",
      description: "Managed direct tax litigation and advisory for Fortune 500 tech clients.",
    },
    {
      role: "Articled Assistant",
      company: "Deloitte",
      duration: "2010 - 2013",
      description: "Statutory audits and tax compliance for manufacturing and IT sectors.",
    }
  ];

  return (
    <div className="py-10 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 mb-8">
          <Briefcase className="h-8 w-8 text-teal" />
          <h2 className="text-[28px] font-bold text-navy">Experience</h2>
        </div>
        
        <div className="relative border-l-2 border-gray-200 ml-4 space-y-10 py-2">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-8">
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-teal ring-4 ring-white" />
              <h3 className="text-[20px] font-bold text-navy mb-1">{exp.role}</h3>
              <div className="text-[16px] text-gray-500 font-medium mb-3">
                {exp.company} <span className="mx-2 text-gray-300">|</span> {exp.duration}
              </div>
              <p className="text-[16px] text-gray-700 leading-relaxed max-w-3xl">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
