import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './CategoryHero.css';

const CategoryHero = ({ title, description, images = [] }) => {
  if (images.length === 0) return null;

  return (
    <div className="relative h-64 md:h-96 w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-full"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-full w-full bg-cover bg-center relative"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${img})`
              }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#18181880] to-transparent"></div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <h1 className="text-4xl md:text-6xl font-bold text-white">{title}</h1>
                {description && (
                  <p className="text-lg text-gray-300 mt-2 max-w-2xl">{description}</p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryHero;
