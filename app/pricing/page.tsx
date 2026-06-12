import React from 'react';
import { Badge } from '../../components/ui/Badge';

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50 pt-[80px] pb-[120px] px-[24px] md:px-[96px]">
      <div className="max-w-[1440px] mx-auto max-w-[800px] w-full">
        <h1 className="text-[40px] md:text-[48px] font-bold text-navy text-center mb-[16px]">
          Transparent Pricing. No Surprises.
        </h1>
        <p className="text-[18px] text-gray-500 text-center mb-[56px] max-w-[600px] mx-auto">
          Experts set their own rates. You pay a 5% platform fee. All sessions include a GST invoice so you can claim ITC.
        </p>

        <div className="bg-white rounded-[12px] shadow-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-[20px] text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Session Type</th>
                <th className="p-[20px] text-[13px] font-semibold text-gray-400 uppercase tracking-wider text-right">Expert Rate</th>
                <th className="p-[20px] text-[13px] font-semibold text-gray-400 uppercase tracking-wider text-right">Fee (5%)</th>
                <th className="p-[20px] text-[13px] font-semibold text-gray-400 uppercase tracking-wider text-right">You Pay</th>
                <th className="p-[20px] text-[13px] font-semibold text-gray-400 uppercase tracking-wider text-center">ITC Claimable</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "CA for GST Filing", rate: "₹500", fee: "₹25", pay: "₹525" },
                { name: "System Design Review", rate: "₹1,200", fee: "₹60", pay: "₹1,260" },
                { name: "Legal Review", rate: "₹2,000", fee: "₹100", pay: "₹2,100" },
                { name: "Strategy Session", rate: "₹3,000", fee: "₹150", pay: "₹3,150" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="p-[20px] text-[16px] text-navy font-medium">{row.name}</td>
                  <td className="p-[20px] text-[16px] text-gray-600 text-right">{row.rate}</td>
                  <td className="p-[20px] text-[16px] text-gray-600 text-right">{row.fee}</td>
                  <td className="p-[20px] text-[18px] text-navy font-bold text-right">{row.pay}</td>
                  <td className="p-[20px] text-center">
                    <Badge variant="itc" shape="pill" icon className="!px-[10px] !py-[4px] mx-auto w-fit">Yes</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td colSpan={5} className="p-[24px] text-[14px] font-medium text-gray-500 text-center">
                  💡 Your finance team can recover the 18% GST on the total amount via ITC. This typically offsets the platform fee entirely.
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
