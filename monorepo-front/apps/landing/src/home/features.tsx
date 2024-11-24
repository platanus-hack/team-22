import { ChartLine, CircleDollarSign, MessageCircle } from "lucide-react";

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


export default function Features() {
  return (
    <div className="flex flex-col justify-center py-48 px-4 md:px-8 gap-16 text-slate-900 max-w-screen-lg mx-auto">
      <div className="flex flex-col gap-5 max-w-3xl">
        <span className="text-sm md:text-base text-purple-700 font-medium">
          Features
        </span>
        <h2 className="-mt-2 text-balance font-semibold text-3xl md:text-4xl">
          Why us?
        </h2>
        <p className="text-slate-600 text-sm md:text-lg">
        Spend smarter, lower your bills, get cashback on everything you buy, and unlock credit to grow your business.
        </p>
      </div>
      <div className="grid md:grid-cols-2 place-items-center gap-16">
        <div className="flex flex-col gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center justify-center bg-purple-100 ring-4 ring-purple-50 text-purple-600 size-11 aspect-square rounded-full">
                {feature.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="md:text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        <img
          src="/Map.webp"
          width="576"
          height="576"
          className="object-cover"
          alt="A map of the ads"
        />
      </div>
    </div>
  )
}
