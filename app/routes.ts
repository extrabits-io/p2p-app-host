import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("settings", "./settings/index.tsx", [
    route("relay", "./settings/relay.tsx"),
  ]),
] satisfies RouteConfig;
