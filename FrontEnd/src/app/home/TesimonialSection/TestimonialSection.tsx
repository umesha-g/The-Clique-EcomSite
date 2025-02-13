import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';

const TestimonialSection: React.FC = () => (
  <div className=" bg-beige-100 flex items-center text-center justify-center md:py-28">
      <div className={"border max-w-[1500px] p-6"}>
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Testimonials</h2>
        <blockquote className="text-lg font-playfair italic font-thin px-5 mb-4">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        </blockquote>
        <div className=" flex justify-center items-center">
          <Avatar className=" ring-1 ring-offset-2 ring-neutral-800 h-10 w-10 mr-5">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="font-semibold">Morty Smith</p>
        </div>
      </div>
  </div>
);

export default TestimonialSection;
