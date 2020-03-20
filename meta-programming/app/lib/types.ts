export type Component<T = unknown> = (props: T) => ReturnType<html>

export interface html {
  (strings: TemplateStringsArray, ...values: unknown[]): string,
  render: (component: Component, container: Element) => void,
}
