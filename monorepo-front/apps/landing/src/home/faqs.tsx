import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@common/components/ui/accordion"


const faqs = [
  {
    question: "What makes our advertising different from traditional digital ads?",
    answer:
      "Our advertising stands out by reaching a captive audience in an engaged setting. In-room tablets serve as the primary interface for hotel services, ensuring high visibility and interaction with your ads.",
  },
  {
    question: "Who is the ideal audience for OOH Hospitality ads?",
    answer:
      "Hotel and Airbnb guests, often with disposable income and in vacation or business mode, are the ideal audience. This includes international travelers and guests looking for local services.",
  },
  {
    question: "How are ads customized for different locations?",
    answer:
      "Ads are hyper-targeted, offering localized content based on the hotel's location. They highlight local attractions, events, and services, while dynamic ads allow real-time updates.",
  },
  {
    question: "Can guests interact with the ads?",
    answer:
      "Yes, guests can click on ads directly through the tablet to book services, make reservations, or complete purchases instantly. Integrated promo codes make it even easier to drive engagement.",
  },
  {
    question: "How are campaign results measured?",
    answer:
      "Detailed analytics track impressions, click-through rates, and conversions. Campaigns can be adjusted in real time to optimize performance and maximize ROI.",
  },
  {
    question: "What kind of businesses benefit the most from our advertising?",
    answer:
      "Local businesses, luxury brands, and services catering to travelers benefit the most. These include restaurants, tours, transportation, and high-end products or services.",
  },
];



export default function FAQs() {
  return (
    <div className="flex flex-col gap-12 justify-center py-80 px-4 text-slate-900 max-w-screen-md mx-auto">
      <h2 className="text-balance font-semibold text-center text-3xl md:text-4xl">
        Frequently asked questions
      </h2>
      <Accordion type="single" collapsible className="w-full text-left ">
        {faqs.map((faq, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
