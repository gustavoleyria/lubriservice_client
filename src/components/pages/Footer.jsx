import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { IoLogoWhatsapp } from 'react-icons/io';

const Footer = () => {
  return (
    <footer className="bg-blue-500 text-white py-4">
      <div className="container mx-auto flex justify-center items-center">
        <a href="https://www.instagram.com/tucuenta" target="_blank" rel="noopener noreferrer" className="text-2xl font-bold mr-4 text-rose-600">
          <FaInstagram />
        </a>
        <a href="https://www.facebook.com/tucuenta" target="_blank" rel="noopener noreferrer" className="text-2xl mr-4 font-bold">
          <FaFacebook />
        </a>
        <a href="https://wa.me/tunumerodeWhatsApp" target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-emerald-700">
          <IoLogoWhatsapp />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
