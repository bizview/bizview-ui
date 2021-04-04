import React from "react";
import { Typography} from "antd";

const { Title, Paragraph, Link } = Typography;

export default function Page401() {
  return <div>
    <Typography>
      <Title>401</Title>
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