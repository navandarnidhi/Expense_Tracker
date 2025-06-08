import { useContext, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import useUserAuth from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

export interface CommonProps {
  activeMenu: string;
}

const Navbar = ({ activeMenu }: CommonProps) => {
  useUserAuth();

  const userContext = useContext(UserContext);

  const navigate = useNavigate();

  if (!userContext) {
    throw new Error("User Context does not exist");
  }

  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <div className="w-full flex items-center justify-center bg-white fixed border border-b border-gray-200/50 backdrop-blur-[2px] py-2 md:py-4 px-4 md:px-6 top-0 z-30 shadow shadow-fuchsia-200">
      <button
        className="block lg:hidden text-black absolute left-4"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-lg md:text-2xl" />
        ) : (
          <HiOutlineMenu className="text-lg md:text-2xl" />
        )}
      </button>
      <div className="w-full flex items-center justify-center">
        <h2 className="text-lg md:text-2xl font-mono font-bold text-black text-center w-full">
          <span className="text-purple-500">EXPENSE</span>💰TRACKER
        </h2>
      </div>
      {openSideMenu && (
        <div className="fixed mt-10 md:mt-14 -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;