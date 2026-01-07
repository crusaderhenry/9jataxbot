const Footer = () => {
  return (
    <footer className="bg-foreground py-6 px-4 border-t border-background/10">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-background/50 text-sm">
          TaxSphere is based on the 2025 Tax Bills. Content is for informational purposes only and does not constitute professional tax advice.
          {" "}&bull;{" "}
          <span className="text-background/70">
            Feedback: hello@danieltadeyemi.com
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
