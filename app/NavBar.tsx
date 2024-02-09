"use client";

import Image from "next/image"; // Import the Image component
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const currentPath = usePathname();

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    //{ label: "Issues", href: "/issues" },
  ];

  return (
    <nav className="flex space-x-6 mb-5 px-5 h-14 items-center">
      <Link href="/">
        <Image
          src="/favicon.ico" // Assuming favicon.ico is in the public folder
          alt="Logo"
          width={30} // Set the width as needed
          height={30} // Set the height as needed
        />
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
