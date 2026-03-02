import minor_cineplex from "@/assets/logo/minor_cineplex.png";

export default function Footer() {
    return (
        <footer className="flex items-center justify-center h-[200px] bg-brand-gray-0 bottom-0 left-0 right-0">
            <img src={minor_cineplex.src} alt="Minor Cineplex" />
        </footer>
    );
}