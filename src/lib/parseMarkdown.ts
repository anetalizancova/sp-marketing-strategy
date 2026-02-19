export interface Section {
  id: string;
  title: string;
  content: string;
}

export interface StrategyDocument {
  title: string;
  subtitle: string;
  sections: Section[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function parseStrategy(markdown: string): StrategyDocument {
  const lines = markdown.split("\n");

  let title = "";
  let subtitle = "";
  const sections: Section[] = [];

  let currentTitle = "";
  let currentLines: string[] = [];
  let parsingHeader = true;

  for (const line of lines) {
    if (parsingHeader && line.startsWith("# ") && !line.startsWith("## ")) {
      title = line.replace(/^# /, "").trim();
      continue;
    }

    if (parsingHeader && line.startsWith("**") && !subtitle) {
      subtitle = line.replace(/\*\*/g, "").trim();
      continue;
    }

    if (line.startsWith("## ")) {
      if (currentTitle) {
        sections.push({
          id: slugify(currentTitle),
          title: currentTitle,
          content: currentLines.join("\n").trim(),
        });
      }
      currentTitle = line.replace(/^## /, "").trim();
      currentLines = [];
      parsingHeader = false;
      continue;
    }

    if (!parsingHeader || currentTitle) {
      currentLines.push(line);
    }
  }

  if (currentTitle) {
    sections.push({
      id: slugify(currentTitle),
      title: currentTitle,
      content: currentLines.join("\n").trim(),
    });
  }

  return { title, subtitle, sections };
}
