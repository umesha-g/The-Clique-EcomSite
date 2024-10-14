import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  "/assets/homePage/hero/hero-1.png",
  "/assets/homePage/hero/hero-2.png",
  "/assets/homePage/hero/hero-3.png",
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 10 : -10,

      opacity: 0,
    }),
    center: {
      x: 0,

      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 10 : -10,

      opacity: 0,
    }),
  };

  return (
    <div>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="relative w-[130%] md:w-[70%] lg:w-[60%] xl:w-[60%] 2xl:w-[50%] flex md:ml-[350px] lg:ml-[550px] xl:ml-[650px] 2xl:ml-[770px]"
        >
          <Image
            src={images[currentIndex]}
            alt={`Slide`}
            width={500}
            height={800}
            priority={true}
            layout="responsive"
            objectFit="contain"
            className="absolute right-0 top-0 md:-mt-20 lg:-mt-32"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ImageSlider;
