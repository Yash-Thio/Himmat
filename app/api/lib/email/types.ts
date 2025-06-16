export enum EmailComponentType {
  HEADING,
  PARAGRAPH,
  BUTTON,
  GRID,
  IMAGE,
  LIST,
}
export interface TemplateLayoutOptions {
  width?: number;
  align?: string;
  style?: string;
  marginTop?: string;
  marginBottom?: string;
}
export type EmailComponent = { options?: TemplateLayoutOptions } & (
  | {
      type: EmailComponentType.HEADING | EmailComponentType.PARAGRAPH;
      content: string;
    }
  | {
      type: EmailComponentType.BUTTON;
      content: string;
      url: string;
    }
  | {
      type: EmailComponentType.GRID;
      components: EmailComponent[];
    }
  | {
      type: EmailComponentType.LIST;
      items: string[];
    }
  | {
      type: EmailComponentType.IMAGE;
      url: string;
      width: number;
    }
);
