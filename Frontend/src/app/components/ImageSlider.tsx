"use client";

import { useState } from "react";
import Image from "next/image";
import { IMAGEKIT_BANNERS } from "../apiConfig";

const images = [
  `${IMAGEKIT_BANNERS}/banner1.jpg`,
  `${IMAGEKIT_BANNERS}/banner2.jpg`,
  `${IMAGEKIT_BANNERS}/banner3.jpg`,
];

export default function ImageSlider() {

  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((index - 1 + images.length) % images.length);
  }
  function next() {
    setIndex((index + 1) % images.length);
  }
  function goTo(i: number) {
    setIndex(i);
  }

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex justify-center mb-10">
      <div className="relative w-full h-[340px] bg-white rounded-2xl shadow-lg overflow-hidden flex items-center">
        <Image
          src={images[index]}
          alt={`Slide ${index + 1}`}
          fill
          className="object-cover"
          priority={index === 0} // Prioritize first banner for LCP
          sizes="100vw"
        />
        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute top-1/2 left-6 -translate-y-1/2 bg-indigo-500 text-white p-3 rounded-full shadow-lg hover:bg-indigo-600 transition-colors z-10"
        >
          &#8592;
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 right-6 -translate-y-1/2 bg-indigo-500 text-white p-3 rounded-full shadow-lg hover:bg-indigo-600 transition-colors z-10"
        >
          &#8594;
        </button>
        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-4 h-4 rounded-full border-2 border-indigo-300 ${
                i === index ? "bg-indigo-500" : "bg-gray-300"
              } transition-colors`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
