import React from 'react';

type HeaderProps = {
  title: string;
  subtitle?: string;
};

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
};

export default Header;