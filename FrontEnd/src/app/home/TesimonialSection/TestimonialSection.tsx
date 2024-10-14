import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TestimonialSection = () => (
  <div className=" bg-beige-100 text-center py-20 md:py-28">
    <h2 className="text-xl md:text-2xl font-semibold mb-6">Testimonials</h2>
    <blockquote className="text-lg font-playfair italic font-thin px-5 mb-4">
      Exercitation photo booth stumptown tote bag Banksy, elit small batch
      freegan sed
    </blockquote>
    <div className=" flex justify-center items-center">
      <Avatar className=" ring-1 ring-offset-2 ring-neutral-800 h-10 w-10 mr-5">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <p className="font-semibold">Sarah Connor</p>
    </div>
  </div>
);

export default TestimonialSection;
