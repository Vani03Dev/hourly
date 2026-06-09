import React from "react";
import { Badge } from "../shared/Badge";
import { ShieldCheck } from "lucide-react";

export function Credentials() {
  const creds = ["SEBI Registered", "CA (ICAI)", "B.Com (Hons)"];
  
  return (
    <div className="py-10 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="h-8 w-8 text-teal" />
          <h2 className="text-[28px] font-bold text-navy">Credentials</h2>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {creds.map(cred => (
            <Badge key={cred} variant="teal" rounded="md" className="h-[28px] px-4 text-[14px] font-medium cursor-pointer hover:bg-teal/80 transition-colors">
              {cred}
            </Badge>
          ))}
        </div>
        <p className="text-[14px] text-gray-500 mt-4 italic">
          * All credentials have been manually verified by our Trust & Safety team. Click on a badge to view the verified certificate.
        </p>
      </div>
    </div>
  );
}
