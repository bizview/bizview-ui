import React from "react";
import { Typography } from "antd";

const { Title, Paragraph, Link } = Typography;

export default function Page404() {
  return <div>
    <Typography>
      <Title>404</Title>
      <Paragraph>
        <ul>
          <li>
            <Link href={"/login"}>登陆</Link>
          </li>
          <li>
            <Link href="/">返回首页</Link>
          </li>
        </ul>
      </Paragraph>
    </Typography>
  </div>;
}