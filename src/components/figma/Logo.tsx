// Logo Component - Uses PNG image instead of SVG
import logoImage from "../../assets/smart-realtor-logo-primary-transparent.png";

export const Logo = ({ className = "w-full h-full" }) => (
  <img 
    src={logoImage} 
    alt="Smart Realtor Tool Logo" 
    className={className}
    style={{ objectFit: "contain" }}
  />
);