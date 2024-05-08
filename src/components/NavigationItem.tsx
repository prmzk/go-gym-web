import { Link } from "@tanstack/react-router";

type Props = { to: string; icon: string; label: string };

const NavigationItem = ({ to, icon, label }: Props) => (
  <li className="cursor-pointe hover:bg-slate-900 p-2 rounded-sm md:w-24 w-full">
    <Link className="flex flex-col items-center " to={to}>
      <h2 className="text-xl">{icon}</h2>
      <p className="font-bold">{label}</p>
    </Link>
  </li>
);

export default NavigationItem;
