import { ReactNode } from "react";

type Props<T> = {
  items: T[],
  children: (item: T, i: number) => ReactNode,
  as?: "div" | "ul" | "ol",
  className?: string
}

export default function For<T>(props: Props<T>) {

  if (props.as) return (
    <props.as className={props.className}>
      {props.items.map(props.children)}
    </props.as>
  )

  return props.items.map(props.children)
}
