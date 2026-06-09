import React from "react";
import { HelpCircle } from "lucide-react";
import { Card } from "../shared/Card";
import { Button } from "../shared/Button";

export function FAQs() {
  const faqs = [
    {
      q: "Can you review my startup's term sheet during the session?",
      a: "Yes, I can review term sheets from a taxation and compliance perspective. Please share it with me securely via chat at least 24 hours before our video session so I can prepare."
    },
    {
      q: "Do you help with US company incorporation (C-Corp) for Indian founders?",
      a: "Yes, I frequently advise Indian founders on the tax implications (FEMA, transfer pricing) of setting up a US Delaware C-Corp."
    },
    {
      q: "What if I need more than 30 minutes?",
      a: "You can book consecutive slots on my calendar, or we can discuss a custom milestone-based package during our first session."
    }
  ];

  return (
    <div className="py-10 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="h-8 w-8 text-teal" />
          <h2 className="text-[28px] font-bold text-navy">Frequently Asked Questions</h2>
        </div>
        
        <div className="max-w-3xl space-y-4 mb-10">
          {faqs.map((faq, index) => (
            <Card key={index} padding="24">
              <h3 className="text-[18px] font-bold text-navy mb-3">{faq.q}</h3>
              <p className="text-[16px] text-gray-700 leading-relaxed">{faq.a}</p>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 max-w-3xl">
          <div>
            <h4 className="text-[20px] font-bold text-navy mb-2">Have a different question?</h4>
            <p className="text-[16px] text-gray-600">Send me a quick message before booking.</p>
          </div>
          <Button variant="primary" className="h-[48px] px-8 text-[16px] whitespace-nowrap">
            Ask Pro a Question
          </Button>
        </div>
      </div>
    </div>
  );
}
