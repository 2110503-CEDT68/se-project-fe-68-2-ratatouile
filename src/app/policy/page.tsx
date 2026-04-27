import React from 'react';

export default function PolicyPage() {
  return (
    <main className="ds-shell py-20 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-soft">
        <h1 className="text-4xl font-bold text-[#59200d] mb-8">User Policy & Concerns</h1>
        
        <section className="space-y-6 text-gray-700 leading-relaxed">
          <div className="p-4 bg-brand-accent/10 rounded-lg border-l-4 border-brand-accent mb-8">
            <p className="font-medium text-[#59200d]">
              Welcome to Ratatouille. Your privacy and security are our top priorities. 
              Please read our policy regarding user data and concerns carefully.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#59200d] mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, 
              make a reservation, or contact us for support. This may include your name, 
              email address, and phone number.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#59200d] mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, 
              specifically to manage your restaurant bookings and notify you of any changes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#59200d] mb-3">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal data. 
              Your password is encrypted and we do not share your private details with third parties 
              without your explicit consent.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#59200d] mb-3">4. User Concerns</h2>
            <p>
              If you have any concerns regarding your data or our services, please reach out to our 
              support team at support@ratatouille.com. We aim to respond to all inquiries within 24 hours.
            </p>
          </div>
          
          <div className="pt-8 border-t border-soft italic text-sm text-gray-500">
            Last updated: April 27, 2026
          </div>
        </section>
      </div>
    </main>
  );
}
