import { Button } from "@/components/ui/button";
import GridPattern from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { ChartLine, CircleDollarSign, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: <MessageCircle />,
    title: "Guaranteed Engagement",
    description: "Your ad will be seen. Our in-room tablets serve as the primary information hub for guests, creating high visibility for your message in a setting where viewers are naturally engaged.",
  },
  {
    icon: <CircleDollarSign />,
    title: "Reach a Premium Audience",
    description: "Connect with hotel and Airbnb guests who often have disposable income and an intent to spend. With frequent exposure to affluent, international travelers, your brand gets seen by an ideal audience.",
  },
  {
    icon: <ChartLine />,
    title: "Localized and Hyper-Targeted Content",
    description: "Make every ad relevant. Customize your messaging to match the local setting, from nearby attractions to seasonal events, providing guests with timely, tailored offers they’ll want to act on.",
  },
];


export default function Local() {
  return (
    <div className="flex flex-col justify-center py-48 px-4 gap-16 text-center text-slate-900 max-w-screen-lg mx-auto">
      <div className="flex flex-col gap-5 max-w-3xl mx-auto">
        <span className="text-sm md:text-base text-purple-700 font-medium">
          Geo-targeted ads
        </span>
        <h2 className="-mt-2 text-balance font-semibold text-3xl md:text-4xl">
          Perfect for local businesses
        </h2>
        <p className="text-slate-600 text-sm md:text-lg">
          Drive traffic to nearby attractions, small businesses, and unique local experiences. Engage travelers to support local commerce.
        </p>
      </div>
      <div className="grid md:grid-cols-3 place-items-center gap-8">
        <Image
          src="/Ads.webp"
          width="400"
          height="400"
          className="object-cover"
          alt="A Ads1 of the ads"
        />
        <Image
          src="/Ads1.webp"
          width="400"
          height="400"
          className="object-cover"
          alt="A Ads1 of the ads"
        />
        <Image
          src="/Ads2.webp"
          width="400"
          height="400"
          className="object-cover"
          alt="A Ads1 of the ads"
        />
      </div>
    </div>
  )
}
