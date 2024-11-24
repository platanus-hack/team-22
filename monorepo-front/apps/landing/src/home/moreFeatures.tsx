import { Button } from "@/components/ui/button";
import GridPattern from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { ChartLine, CircleDollarSign, MessageCircle, MousePointerClickIcon, PercentDiamond, Recycle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: <MousePointerClickIcon />,
    title: "Clickable Ads",
    description: "Guests can interact with ads directly through the tablet, such as booking services, reservations, or purchasing items instantly.",
  },
  {
    icon: <Recycle />,
    title: "Easy Transaction",
    description: "With integrated hotel services or partnered apps, guests can make immediate purchases with little to no friction.",
  },
  {
    icon: <PercentDiamond />,
    title: "Discount & Promo Codes",
    description: "Special offers or promo codes for local services can drive higher engagement, enticing guests to act on impulse.",
  },
];


export default function MoreFeatures() {
  return (
    <div className="bg-slate-50">
      <div className="grid md:grid-cols-3 place-items-center gap-16 py-24 px-4 md:px-8 text-center text-slate-900 max-w-screen-lg mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center gap-5">
            <div className="flex items-center justify-center size-12 bg-white ring-1 ring-slate-200 shadow-md rounded-lg">
              {feature.icon}
            </div>
            <h3 className="text-balance font-semibold text-lg md:text-xl">
              {feature.title}
            </h3>
            <p className="-mt-2 text-slate-600 text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
