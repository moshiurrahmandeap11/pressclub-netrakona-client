import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-200 border-t border-gray-300 py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-gray-800">
          {/* Gramni City Memorial Complex */}
          <div>
            <h3 className="font-bold mb-2">গ োপনীয়তোর নীততমোলো </h3>
          </div>
          {/* Officer Module */}
          <div>
            <h3 className="font-bold mb-2">ব্যব্হোররর শততোব্তল</h3>
          </div>
          {/* Service Module */}
          <div>
            <h3 className="font-bold mb-2">সোইট-মযোপ</h3>
          </div>
          <div>
            <h3 className="font-bold mb-2">যোগাযোগ</h3>
          </div>
          {/* General Information */}
          <div>
            <h3 className="font-bold mb-2">সচোরোচর জিজ্ঞোসো</h3>
          </div>
        </div>
        <h1>সোইটটট গশষ হোল-নো োদ করো হরয়রে: ২০২৫-০৮-২৮ ২০:২৭:১৯</h1>
      </div>
    </footer>
  );
};

export default Footer;