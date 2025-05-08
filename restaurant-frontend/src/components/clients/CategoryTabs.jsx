import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Mobile: Swiper (carousel) sticky */}
        <div className="block sm:hidden">
          <Swiper
            spaceBetween={8}
            slidesPerView="auto"
            freeMode
            className="w-full"
          >
            {categories.map((c) => (
              <SwiperSlide key={c} style={{ width: 'auto' }}>
                <button
                  onClick={() => onChange(c)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-transform duration-200 ${
                    active === c
                      ? 'bg-green-600 text-white scale-105 shadow-md'
                      : 'bg-green-200 text-green-800 hover:bg-green-300'
                  }`}
                >
                  {c}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop: Flex-wrap */}
        <div className="hidden sm:flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => onChange(c)}
              className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-transform duration-200 ${
                active === c
                  ? 'bg-green-600 text-white scale-105 shadow-md'
                  : 'bg-green-200 text-green-800 hover:bg-green-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
