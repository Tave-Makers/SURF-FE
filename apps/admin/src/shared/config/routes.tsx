import { HeaderMode, HeaderProps } from "@surf/ui/header";
import { useRouter } from "next/navigation";

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
    path: "/signup-request",
    backPath: "/",
    header: {
      mode: HeaderMode.Default,
      title: "회원가입 요청",
      hasLeftIcon: true,
    },
  },
];
