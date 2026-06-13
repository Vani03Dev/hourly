import React from "react";
import { Star } from "lucide-react";
import { Card } from "../shared/Card";
import { Badge } from "../shared/Badge";
import { mockReviews } from "@/lib/mock-data";
import { Button } from "../shared/Button";
import { SHOW_RATINGS_AND_REVIEWS } from "@/lib/feature-flags";

export function Reviews() {
  if (!SHOW_RATINGS_AND_REVIEWS) return null;

  return (
    <div className="py-10 bg-gray-50 border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-[28px] font-bold text-navy mb-8">127 Reviews</h2>
        
        <div className="flex items-center gap-6 mb-10">
          <div className="text-[48px] font-bold text-gold flex items-center leading-none">
            4.9 <Star className="h-10 w-10 fill-current ml-2" />
          </div>
          
          <div className="flex-grow max-w-sm space-y-2">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-3 text-[14px] text-gray-600">
                <span className="w-3">{star}</span>
                <div className="h-2 flex-grow bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold rounded-full" 
                    style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : star === 3 ? '5%' : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {mockReviews.map((review) => (
            <Card key={review.id} padding="24">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-[18px] font-bold text-navy">{review.userName}</h4>
                  <p className="text-[14px] text-gray-500">{review.date}</p>
                </div>
                <div className="text-gold flex items-center text-[18px]">
                  {"★".repeat(review.rating)}
                </div>
              </div>
              <div className="mb-4">
                <Badge variant="gray" className="text-[12px] font-normal">{review.type}</Badge>
              </div>
              <p className="text-[16px] text-gray-700 leading-relaxed">
                "{review.text}"
              </p>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" className="h-[48px] px-8 text-[16px]">
            Load More Reviews
          </Button>
        </div>
      </div>
    </div>
  );
}
