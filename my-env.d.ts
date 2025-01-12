type OnSelectHandler<T> = {
    onSelection: (s: T | undefined) => void,
    onSelections: (s: T[] | undefined) => void
}
