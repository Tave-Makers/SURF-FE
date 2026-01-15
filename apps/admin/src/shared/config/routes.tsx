import { HeaderMode, HeaderProps } from "@surf/ui/header";
import { useRouter } from "next/navigation";
import { PAGE_ROUTES } from "./path";

type RouterInstance = ReturnType<typeof useRouter>;

export type RouteConfig = {
  id: string;
  path: string;
  backPath: string;
  header: HeaderProps;
};

export const createRouteConfig = (router: RouterInstance): RouteConfig[] => [
  {
    id: "signup-request",
    path: PAGE_ROUTES.SIGNUP_REQUEST,
    backPath: PAGE_ROUTES.HOME,
    header: {
      mode: HeaderMode.Default,
      title: "회원가입 요청",
      hasLeftIcon: true,
    },
  },
];
