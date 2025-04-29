import React from "react";
import { Link } from "react-router-dom";
import { ImGithub, ImLinkedin2 } from "react-icons/im";
import StudyNotionLogo from "../../assets/Logo/Logo-Full-Light.png";

const companyLinks = ["About", "Careers", "Affiliates"];
const resourcesLinks = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const plansLinks = ["Paid memberships", "For students", "Business solutions"];
const communityLinks = ["Forums", "Chapters", "Events"];
const bottomLinks = ["Privacy Policy", "Cookie Policy", "Terms"];

const socialIcons = [
  { name: "Github", icon: <ImGithub className="w-5 h-5 hover:scale-110 transition-all" /> },
  { name: "LinkedIn", icon: <ImLinkedin2 className="w-5 h-5 hover:scale-110 transition-all" /> },
];

const FooterSection = ({ title, links }) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-richblack-50 text-sm font-semibold">{title}</h3>
    {links.map((link, i) => (
      <Link
        key={i}
        to={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
        className="text-richblack-400 text-sm hover:text-richblack-50 transition"
      >
        {link}
      </Link>
    ))}
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-richblack-800 text-richblack-400 py-12 mt-10 mb-4 rounded-2xl mx-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-richblack-700 pb-10">
          {/* Company Logo and Links */}
          <div className="flex flex-col gap-4">
            <img src={StudyNotionLogo} alt="StudyNotion" className="w-40 object-contain" />
            <FooterSection title="Company" links={companyLinks} />
            <div className="flex gap-4 mt-4">
              {socialIcons.map((item, i) => (
                <span key={i} className="text-xl cursor-pointer">{item.icon}</span>
              ))}
            </div>
          </div>

          {/* Resources */}
          <FooterSection title="Resources" links={resourcesLinks} />

          {/* Plans */}
          <FooterSection title="Plans" links={plansLinks} />

          {/* Community + Support */}
          <div className="flex flex-col gap-8">
            <FooterSection title="Community" links={communityLinks} />
            <FooterSection title="Support" links={["Help Center"]} />
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="mb-3 md:mb-0">&copy; {new Date().getFullYear()} StudyNotion. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {bottomLinks.map((link, i) => (
              <Link
                key={i}
                to={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:text-richblack-50 transition"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
