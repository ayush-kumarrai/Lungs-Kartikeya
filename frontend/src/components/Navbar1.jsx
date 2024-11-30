import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { NavLink, useLocation } from 'react-router-dom';
import { AcmeLogo } from "./AcmeLogo.jsx";

const Navbar1 = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Lung Cancer Predictor", href: "/" },
    { name: "Medical Report Analyzer", href: "/report" },
    { name: "Image Cancer Analyzer", href: "/image" }
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white"
      isBordered
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      {/* Brand Logo */}
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit text-black ml-2">Lung Cancer Detector</p>
      </NavbarBrand>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500 font-bold"
                  : "text-gray-600 hover:text-blue-400"
              }
            >
              {item.name}
            </NavLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `w-full ${
                  isActive
                    ? "text-blue-500 font-bold"
                    : "text-gray-600 hover:text-blue-400"
                }`
              }
            >
              {item.name}
            </NavLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default Navbar1;
