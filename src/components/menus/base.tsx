import React from "react";

interface MenuItemProps {
  onClick?: (e: React.MouseEvent<HTMLLIElement>) => void;
  children: React.ReactNode;
}

interface MenuItemGroupProps {
  border?: boolean;
  children: React.ReactNode;
}

const MenuItem = (props: MenuItemProps) => {
  return (
    <li
      onClick={props.onClick}
      className="leading-5 h-[22px] flex items-center cursor-default px-2 rounded-[4px] hover:text-white hover:bg-[#006AFF] transition-colors"
    >
      <span className="text-[13px] font-medium">{props.children}</span>
    </li>
  );
};

const MenuItemGroup = (props: MenuItemGroupProps) => {
  const border =
    props.border === false
      ? ""
      : "border-b border-white/10 pb-1 mb-1";
  return <ul className={`px-1 pt-1 ${border}`}>{props.children}</ul>;
};

export { MenuItem, MenuItemGroup };
