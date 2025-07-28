"use client";

import useLoginModel from "@/hook/useLoginModal";
import useRegisterModal from "@/hook/useRegisterModal";
import useRentModal from "@/hook/useRentModal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { SafeUser } from "../../app/types";
import { signOut } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import useContactModal from "@/hook/useContactModal";

type Props = {
  currentUser?: SafeUser | null;
};

function UserMenu({ currentUser }: Props) {
  const router = useRouter();
  const registerModel = useRegisterModal();
  const loginModel = useLoginModel();
  const rentModel = useRentModal();
  const contactModal = useContactModal();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModel.onOpen();
    }

    if (currentUser.role === "host" || currentUser.role === "admin") {
      return rentModel.onOpen();
    }

    contactModal.onOpen();
  }, [currentUser, loginModel, rentModel, contactModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          <span className="block md:hidden text-xl">
            <FaHome />
          </span>
          <span className="hidden md:block">
            Become a host with TripleOne
          </span>
        </div>

        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            {currentUser ? (
              <Avatar src={currentUser?.image!} userName={currentUser?.name} />
            ) : (
              <Image
                className="rounded-full"
                height="30"
                width="30"
                alt="Avatar"
                src="/assets/avatar.png"
              />
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm z-50">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                {currentUser.role === "user" && (
                  <MenuItem
                    onClick={() => router.push("/trips")}
                    label="🧳 My trips"
                  />
                )}

                {currentUser.role === "user" && (
                  <MenuItem
                    onClick={() => router.push("/reservations")}
                    label="📆 My reservations"
                  />
                )}

                <MenuItem
                  onClick={() => router.push("/favorites")}
                  label="❤️ My favorites"
                />
                <MenuItem
                  onClick={() => router.push("/properties")}
                  label="🏡 My properties"
                />

                {currentUser.role === "admin" && (
                  <MenuItem
                    onClick={() => router.push("/admin")}
                    label="🛠️ Admin Panel"
                  />
                )}

                {currentUser?.role === "host" && (
  <MenuItem onClick={() => router.push("/host")} label="🏘️ Host Dashboard" />
)}





                <hr />
                <MenuItem onClick={() => signOut()} label="🚪 Logout" />
              </>
            ) : (
              <>
                <MenuItem onClick={loginModel.onOpen} label="🔑 Login" />
                <MenuItem onClick={registerModel.onOpen} label="📝 Sign up" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
