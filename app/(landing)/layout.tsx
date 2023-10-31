import { LandingFooter } from "./components/landing-footer";
import LandingNavbar from "./components/landing-navbar";
import LandingNavbarMobile from "./components/landing-navbar-mobile";



export default function LandingLayout({
    children
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex min-h-screen flex-col justify-between">
            <LandingNavbar />
            <LandingNavbarMobile />
            {children}
            <LandingFooter />
        </div>
    );

}