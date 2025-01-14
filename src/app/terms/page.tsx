import React from "react";

const TermsOfService = () => {
  return (
    <main className="p-8 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <section >
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p className="text-gray-700">
          Welcome to EWERE TECH, Home for all DevOps, AWS and Cloud-native Content. These Terms of Service govern your use of our blog and any related services we provide.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Content</h2>
        <p className="text-gray-700">
          You may use our blog to view, read, and interact with content posted by us and other users. You agree to abide by all applicable laws and regulations.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. User Conduct</h2>
        <ul>
          <li>Posting unauthorized commercial content.</li>
          <li>Transmitting viruses or harmful code.</li>
          <li>Harassing or abusing other users.</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Intellectual Property</h2>
        <p className="text-gray-700">
          All content posted on our blog is owned by us or our users who have authorized its use. You may not use or reproduce this content without permission.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Privacy</h2>
        <p className="text-gray-700">We collect and use your personal information as outlined in our Privacy Policy.</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Modifications</h2>
        <p className="text-gray-700">
          We may update these Terms of Service from time to time. You will be notified of any changes, and continued use of our blog constitutes acceptance of these changes.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
        <p className="text-gray-700">If you have any questions, please contact us at ewere.diagboya@gmail.com.</p>
      </section>
    </main>
  );
};

export default TermsOfService;
