import type { Metadata } from "next";
import ShowStage from "./show-stage";

export const metadata: Metadata = {
  title: "乐队登场｜重庆大学 EF 邦多利马群",
  description: "12 支乐队、60 位角色依次登场，在校园里遇见频率相同的伙伴。",
};

export default function ShowPage() {
  return <ShowStage />;
}
