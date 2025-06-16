import { EmailComponent, EmailComponentType } from "@backend/lib/email/types";

function getComponentText(component: EmailComponent): string {
  switch (component.type) {
    case EmailComponentType.LIST:
      return component.items.join("\n");
    case EmailComponentType.IMAGE:
      return "";
    case EmailComponentType.BUTTON:
      return `\n${component.url}`;
    case EmailComponentType.HEADING:
      return "\n" + component.content;
    case EmailComponentType.GRID:
      return buildTemplateText(component.components);
  }
  return component.content;
}

function buildTemplateText(components: EmailComponent[]) {
  return components.map((c) => getComponentText(c)).join("\n");
}
export const getRenderedTemplateText = (
  heading: string,
  components: EmailComponent[],
) => {
  const content = buildTemplateText(components);
  return `${heading}\n\n${content}`;
};
