import Hero from "@/components/Hero";
import FAQSection from "@/components/FAQSection";
import ChatButton from "@/components/ChatButton";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FAQSection />
      <Footer />
      <ChatButton />
    </div>
  );
};

export default Index;
