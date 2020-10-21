export const siteMap = [
  {
    icon: "home",
    href: "/",
    title: "Home",
    children: [
      {
        href: "~/settings",
        title: "设置",
        children: [
          { href: "~/user", title: "用户" },
          { href: "~/group", title: "组" },
          { href: "~/share", title: "共享" },
          { href: "~/feature", title: "功能" },
          { href: "~/app", title: "应用程序" },
          { href: "~/theme", title: "主题" },
          { href: "~/globalnav", title: "全局导航" },
          { href: "~/sitenav", title: "左侧导航" },
          { href: "~/solution", title: "管理解决方案" }
        ]
      }
    ]
  }
];