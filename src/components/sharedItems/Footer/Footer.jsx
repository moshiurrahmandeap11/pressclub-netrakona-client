import React from "react";
import { useNavigate } from "react-router";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-200 border-t border-gray-300 py-8">
      <div className="container mx-auto px-4">
        {/* Top Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center text-gray-800 mb-6">
          <div
            className="hover:text-blue-600 cursor-pointer transition-colors"
            onClick={() => navigate("/privacy-policy")}
          >
            <h3 className="font-bold mb-1">গোপনীয়তার নীতিমালা</h3>
          </div>
          <div
            className="hover:text-blue-600 cursor-pointer transition-colors"
            onClick={() => navigate("/terms-and-conditions")}
          >
            <h3 className="font-bold mb-1">ব্যবহারের শর্তাবলী</h3>
          </div>
          <div
            className="hover:text-blue-600 cursor-pointer transition-colors"
            onClick={() => navigate("/contact")}
          >
            <h3 className="font-bold mb-1">যোগাযোগ</h3>
          </div>
          {/* Extra placeholder divs for spacing on large screens */}
          <div className="hidden md:block"></div>
          <div className="hidden md:block"></div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* Bottom Info */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-10 text-gray-700 text-sm">
          <p>সাইটটি সর্বশেষ হালনাগাদ করা হয়েছে : ২০২৫-০৮-২৮ ২০:২৭:১৯</p>
          <p>
            Designed By{" "}
            <a
              href="https://www.facebook.com/share/17FM8Xqvan/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Azharul Islam
            </a>
          </p>
          <p>
            Developed By{" "}
            <a
              href="https://moshiurrahman.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Moshiur Rahman
            </a>{" "}
            Via{" "}
            <a
              href="https://projuktisheba.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Projukti Sheba
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
