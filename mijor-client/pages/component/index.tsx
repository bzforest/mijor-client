import Navbar from "@/components/common/navbar";
import Review from "@/components/common/review";
import Image from "next/image";
export default function Component() {
    return (
        <div>
            {/* first section */}
            
            {/* foy section */}
            <section className="min-h-screen bg-brand-gray-900 text-white flex flex-col">
        
                {/* Navbar */}
                <Navbar 
                isLoggedIn={true}
                userName="Tony Stark"
                userImage="/stark.jpg"
                />

            <section className=" in-h-screen p-40 flex items-center justify-center">
        
                <Review
                userName="Christopher Nolan"
                userImage="/batman.jpg"
                date="24 Jun 2024"
                rating={5}
                content="Lorem ipsum dolor sit amet consectetur. Turpis lobortis elementum amet viverra placerat erat."
                />

            </section>
            </section>

            {/* champ section */}
            
        </div>
    );
}