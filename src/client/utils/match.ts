export function matchInput(state, value) {
    return (
        state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    )
}

export function matchScentInput(state, value) {
    return (
        state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        state.brand.toLowerCase().indexOf(value.toLowerCase()) !== -1
    )
}
