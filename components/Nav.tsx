"use client";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";
import { User2 } from "lucide-react";

export default function Nav({ user }: { user: User }) {
  return (
    <div className=" ">
      <div className=" flex flex-row justify-between items-center  ">
        <Link href="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26">
            <path
              className="fill-black dark:fill-white"
              fill="#FFF"
              fillRule="evenodd"
              d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z"
            />
          </svg>
        </Link>
        <div className=" flex flex-row space-x-4 h-5 items-center">
          <ModeToggle />
          <Separator orientation="vertical" />
          <Link href="/api/auth/signout">
            <Avatar>
              <AvatarImage src={user.image as string} />
              <AvatarFallback>
                <User2 size={24} />
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </div>
  );
}
