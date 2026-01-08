import { Navbar } from "../components/Navbar";
import {Hero} from "../components/Hero";
import { Features } from "../components/Features";
import { CoursePreview } from "../components/Coursepreview";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { Testimonials } from "../components/Testimonials ";
import { Footer } from "../components/Footer";

function Landing() {
  return (
    <div>
      {/* Navbar */}
      <Navbar showLogin={true} showProfile={false}/>
      {/* Hero */}
      <Hero/>
      {/* Features */}
      <Features/>
      {/* Courses */}
      <CoursePreview/>
      {/* whychoose us */}
      <WhyChooseUs/>
      {/* testimonials */}
      <Testimonials/>
      {/* Footer */}
      <Footer/>
    </div>
  );
}

export default Landing;
