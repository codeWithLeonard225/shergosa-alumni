import Navbar from "../components/Navbar";

export const metadata = {
    title: "SOS Hermann Gmeiner Old Students' Association (SHERGOSA)",
    description: "Uniting SOS Hermann Gmeiner alumni to promote development, support education, and strengthen community impact",
};

export default function MainLayout({ children }) {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
}
