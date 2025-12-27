import React from "react";

const ScrollBrandsComponents = () => {


let brands  = [

"https://images.meesho.com/images/marketing/1743159302944.webp",


"https://images.meesho.com/images/marketing/1743159322237.webp",


"https://images.meesho.com/images/marketing/1743159363205.webp",


"https://images.meesho.com/images/marketing/1743159377598.webp",


"https://images.meesho.com/images/marketing/1743159393231.webp",


"https://images.meesho.com/images/marketing/1743159415385.webp",


"	https://images.meesho.com/images/marketing/1744636558884.webp",


"https://images.meesho.com/images/marketing/1744636599446.webp",


"https://images.meesho.com/images/marketing/1743159302944.webp",


"https://images.meesho.com/images/marketing/1743159322237.webp",



"https://images.meesho.com/images/marketing/1743159363205.webp",


"https://images.meesho.com/images/marketing/1743159377598.webp",


"https://images.meesho.com/images/marketing/1743159393231.webp",


"https://images.meesho.com/images/marketing/1743159415385.webp",


"	https://images.meesho.com/images/marketing/1744636558884.webp",


"https://images.meesho.com/images/marketing/1744636599446.webp",


"https://images.meesho.com/images/marketing/1743159302944.webp",

]








  return (
        <div
      className="
        relative w-full overflow-hidden
       
        border-b 
        border-pink-300
       h-25 
       mt-10
       mb-30
        group

       
      
      "
    >
      {/* Track */}
      <div
        className="
          flex items-center  gap-10
          absolute left-0 top-1/2 -translate-y-1/2
          animate-marquee
          group-hover:[animation-play-state:paused]
        
        "
      >
        {/* Duplicate for infinite loop */}
        {[...brands, ...brands].map((src, i) => (
          <img
            key={i}
            src={src}
            alt="brand"
            className="
              h-14 w-auto
              transition-transform duration-300
              hover:scale-110
              px-10
            "
          />
        ))}
      </div>
      
    </div>
  );
};

export default ScrollBrandsComponents;
