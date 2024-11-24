import { Button } from "@common/components/ui/button";
import LinePattern from "@common/components/ui/line-pattern";
import { cn } from "@/lib/utils";
import Particles from "@common/components/ui/particles";

export default function Hero() {
  return (
    <div className="overflow-clip flex flex-col pt-24 px-4 justify-between items-center relative text-center min-h-svh text-neutral-800 bg-brandgradient">
      <div className="z-10 flex flex-col items-center gap-8 max-w-5xl">
        <div className="flex flex-col gap-12">
          <span className="text-sm md:text-base text-neutral-400">
            Simple. Rápido. Fácil.
          </span>
          {/* <h1 className="-mt-6 bg-gradient-to-br from-neutral-800 from-30% to-neutral-800/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tight text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl">
            Tu diario de vida cómo siempre tuvo que ser
          </h1> */}
          <h1 className="-mt-6 bg-gradient-to-br from-[rgb(251,205,156)] from-30% via-[#ebb6ec] to-[#b0bbec] bg-clip-text py-6 text-5xl font-medium leading-none tracking-tight text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl">
            Tu diario de vida cómo siempre tuvo que ser
          </h1>
          <p className="-mt-8 text-neutral-400 text-sm md:text-lg max-w-2xl mx-auto">
            Lleva un registro de tus actividades diarias, tus pensamientos y recibe recomendaciones personalizadas basadas en patrones y tendencias de tu vida.
          </p>
        </div>
        <Button size="lg" className="text-neutral-800 mt-6 bg-gradient-to-br from-[rgb(251,205,156)] from-30% via-[#ebb6ec] to-[#b0bbec] rounded-full hover:opacity-90 shadow-sm hover:shadow-md duration-300 transition-all" asChild>
          <a href="#">
            Empieza ahora
          </a>
        </Button>
      </div>
      <div className="z-10 relative mt-[8rem] animate-fade-up [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,#000,transparent)]">
        <div className="relative before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom,#FF91F4,#FF91F4,transparent_40%)]">
          <img
            src="https://startup-template-sage.vercel.app/hero-dark.png"
            width="1280"
            height="512"
            className="relative w-full h-full rounded-[inherit] object-contain"
            alt="A tablet with the UI"
          />
        </div>
      </div>
      <LinePattern
        height={24}
        lineColor="#E5E5E5"
        className={cn(
          // "[mask-image:linear-gradient(to_bottom,white,transparent,transparent)]",
          "opacity-40"
        )}
      />
      <Particles
        className={cn(
          "absolute inset-0",
        )}
        quantity={120}
        ease={80}
        color="#737373"
        refresh
      />
    </div>
  )
}
