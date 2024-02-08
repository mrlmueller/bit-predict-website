"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBtc } from "react-icons/fa";
import React from "react";

const NavBar = () => {
  const currentPath = usePathname();

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    //{ label: "Issues", href: "/issues" },
  ];

  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
      <Link href="/">
        <FaBtc />
      </Link>
      <ul className="flex space-x-6">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
