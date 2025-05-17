
import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

// URLs for hug-themed GIFs
const HUG_GIFS = [
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHFsM3puOW9hYmR6bGsxaDJiNW1odDV1MHZ4eGFheWV0bDV4M2JyYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5OqXb948EBkyUcnwHt/giphy.gif", // Baymax hug
  "https://media.giphy.com/media/3oriO6qJiXajN0TyDu/giphy.gif", // Lilo & Stitch hug
  "https://media.giphy.com/media/ZBQhoZC0nqknSviPqT/giphy.gif", // Cute bear hug
];

interface GifCarouselProps {
  value: string;
  onChange: (url: string) => void;
}

const GifCarousel = ({ value, onChange }: GifCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
      onChange(HUG_GIFS[slider.track.details.rel]);
    },
    created() {
      setLoaded(true);
    },
    loop: true,
  });

  // Set the initial value when mounted
  useEffect(() => {
    if (!value && HUG_GIFS.length > 0) {
      onChange(HUG_GIFS[0]);
    }
  }, [value, onChange]);

  return (
    <Card className="w-full border border-hug-secondary bg-hug-light shadow-sm">
      <CardContent className="p-4">
        <div className="relative">
          <div ref={sliderRef} className="keen-slider h-64 sm:h-80 rounded-md overflow-hidden">
            {HUG_GIFS.map((gif, idx) => (
              <div key={idx} className="keen-slider__slide rounded-md overflow-hidden">
                <img
                  src={gif}
                  alt={`Hug GIF ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
          
          {loaded && instanceRef.current && (
            <>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  instanceRef.current?.prev();
                }}
                className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full p-2 text-hug-dark focus:outline-none focus:ring-2 focus:ring-hug-primary"
                aria-label="Previous GIF"
              >
                <ArrowLeft size={20} />
              </button>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  instanceRef.current?.next();
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full p-2 text-hug-dark focus:outline-none focus:ring-2 focus:ring-hug-primary"
                aria-label="Next GIF"
              >
                <ArrowRight size={20} />
              </button>
              
              {/* Indicator dots */}
              <div className="flex justify-center gap-2 mt-3">
                {Array.from(Array(HUG_GIFS.length).keys()).map((idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      instanceRef.current?.moveToIdx(idx);
                    }}
                    className={`w-3 h-3 rounded-full focus:outline-none ${
                      currentSlide === idx
                        ? "bg-hug-primary scale-125"
                        : "bg-hug-secondary"
                    }`}
                    aria-label={`Go to GIF ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GifCarousel;
