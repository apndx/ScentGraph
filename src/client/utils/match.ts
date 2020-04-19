export function matchInput(state, value) {
    return (
        state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    )
}
