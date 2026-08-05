"use client";

import React from "react";
import { Star, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

const MOCK_REVIEWS = [
  { id: "rev_1", product: "Cherry Noir", customer: "Sarah J.", rating: 5, date: "Oct 2, 2026", status: "pending", comment: "These are absolutely stunning! The glossy finish is so reflective and they fit perfectly.", img: "/images/products/cherry-noir.png" },
  { id: "rev_2", product: "Midnight Fig", customer: "Amanda B.", rating: 4, date: "Sep 28, 2026", status: "approved", comment: "Love the matte look. Took a little bit of filing to fit my thumbnails but overall great quality.", img: "/images/products/midnight-fig.png" },
  { id: "rev_3", product: "Bridal Pearl", customer: "Jessica Tan", rating: 5, date: "Sep 25, 2026", status: "rejected", comment: "Spam link http://example.com/buy-now", img: "/images/products/bridal-pearl-cascade.png" },
];

export default function ReviewsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display text-[--color-obsidian]">Reviews Moderation</h1>
          <p className="text-sm text-[--color-ink] mt-1">Approve customer photos and reviews before they go live.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_REVIEWS.map((review) => (
          <div key={review.id} className="bg-white border border-[--color-chrome] rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-[--color-chrome] relative">
                   <Image src={review.img} alt={review.product} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-medium text-[--color-obsidian]">{review.product}</h3>
                  <p className="text-xs text-[--color-ink]">by {review.customer} on {review.date}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} className={i <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-200"} />
                ))}
              </div>
            </div>

            <div className="flex-1 bg-[--color-mist]/30 rounded-xl p-4 text-sm text-[--color-obsidian] italic mb-6">
              &quot;{review.comment}&quot;
            </div>

            <div className="flex items-center justify-between border-t border-[--color-chrome] pt-4 mt-auto">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                review.status === 'approved' ? 'bg-green-100 text-green-700' :
                review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {review.status.toUpperCase()}
              </span>
              
              {review.status === 'pending' && (
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors">
                    <XCircle size={14} /> Reject
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[--color-obsidian] text-white hover:bg-black rounded-lg text-xs font-medium transition-colors">
                    <CheckCircle size={14} /> Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
