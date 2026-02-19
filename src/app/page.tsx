import fs from "fs";
import path from "path";
import { parseStrategy } from "@/lib/parseMarkdown";
import StrategyPage from "@/components/StrategyPage";

export default function Home() {
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "strategy.md"
  );
  const markdown = fs.readFileSync(filePath, "utf-8");
  const { title, subtitle, sections } = parseStrategy(markdown);

  return (
    <StrategyPage title={title} subtitle={subtitle} sections={sections} />
  );
}
