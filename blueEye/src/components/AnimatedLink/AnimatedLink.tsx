import type React from "react";
import { Link, useNavigate } from "react-router-dom";

export const AnimatedLink = ({
  to,
  children,
  className,
  closeSideBar,
}: {
  to: string;
  className: string;
  children: React.ReactNode;
  closeSideBar?: () => void;
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeSideBar?.();

    setTimeout(() => {
      navigate(to);
    }, 400);
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={className}
      style={{ fontFamily: "Google Sans" }}
    >
      {children}
    </Link>
  );
};
