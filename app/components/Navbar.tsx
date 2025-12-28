"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { LayersPlus } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { checkAndAddUser } from "../actions";
const Navbar = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const navLinks = [
    {
      href: "/",
      label: "Factures",
    },
  ];
  useEffect(() => {
  if (user?.primaryEmailAddress?.emailAddress) {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
    checkAndAddUser(user.primaryEmailAddress.emailAddress, fullName || 'Utilisateur');
  }
}, [user]);

  const isActiveLink = (href: string) =>
    pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

  const renderLinks = (classNames: string) =>
    navLinks.map(({ href, label }) => (
      <Link
        href={href}
        key={href}
        className={`btn btn-sm ${classNames} ${isActiveLink(href) ? "btn-info" : ""
          }`}
      >
        {label}
      </Link>
    ));

  return (
    <div className="border-b border-base-300 px-5 md:px-[10%] py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-info-content text-info rounded-full p-5">
            <LayersPlus className="h-6 w-6" />

          </div>
          <span className="ml-3 font-bold text-2xl italic">
            Factu<span className="text-info">Pro</span>
          </span>
        </div>

        <div className="flex space-x-4 items-center">
          {renderLinks("btn")}
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
