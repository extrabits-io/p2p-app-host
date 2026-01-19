import { NavLink } from "react-router";
import { Outlet } from "react-router";

const tabClasses = {
  active:
    "border-b-2 border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:hover:text-blue-500",
  inactive:
    "border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200",
};

const tabs = [
  {
    path: "relay",
    title: "Relay",
  },
  {
    path: "app",
    title: "Application",
  },
];

export default function Settings() {
  return (
    <div className="p-4">
      <h1 className="text-2xl">Settings</h1>
      <div className="-mb-px border-b border-gray-200 dark:border-gray-700">
        <div role="tablist" className="flex gap-1">
          {tabs.map(({ path, title }) => (
            <NavLink
              to={`/settings/${path}`}
              key={path}
              role="tab"
              aria-selected="true"
              className={({ isActive }) =>
                isActive ? tabClasses.active : tabClasses.inactive
              }
            >
              {title}
            </NavLink>
          ))}
        </div>
      </div>

      <div role="tabpanel" className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}
