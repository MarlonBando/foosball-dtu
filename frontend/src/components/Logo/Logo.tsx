import React from 'react';
import './Logo.css';
import logoImage from '../../assets/logo.png';

interface LogoProps {
  className?: string;
  alt?: string;
}

const Logo: React.FC<LogoProps> = ({ className, alt = 'Application Logo' }) => {
  return (
    <img src={logoImage} alt={alt} className={`logo ${className || ''}`} />
  );
};

export default Logo;
