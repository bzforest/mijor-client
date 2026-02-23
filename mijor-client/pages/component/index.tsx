import Navbar from "@/components/common/navbar";
import Review from "@/components/common/review";
import CardCouponVertical from "@/components/common/cardCouponVertical";
import CardCouponHorizontal from "@/components/common/cardCouponHorizontal";
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

            <section className=" in-h-screen p-10 flex items-center justify-center">
        
                <Review
                userName="Christopher Nolan"
                userImage="/batman.jpg"
                date="24 Jun 2024"
                rating={5}
                content="Lorem ipsum dolor sit amet consectetur. Turpis lobortis elementum amet viverra placerat erat."
                />

            </section>

            <section className="min-h-50 px bg-brand-gray-900 flex  gap-8 flex-wrap p-10">
      
            {/* User size */}
            <CardCouponVertical
                imageSrc="/Merry.png"
                title="Merry March Magic - Get 50 THB Off! (Only in March)"
                validUntil="18 Jun 2025"
            />
            </section>

            <section className="min-h-50 bg-brand-gray-900 p-10 flex gap-6 flex-wrap">
            <CardCouponHorizontal
                couponImage="/Merry.png"
                title="Merry March Magic - Get 50 THB Off! (Only in March)"
                validDate="18 Jun 2025"
            />
            </section>
            </section>

            {/* champ section */}
            
        </div>
    );
}