export function removeFromArray(array, isProblem) {
    //mutates the given array
    //isProblem is a function which returns true or false depending on whether the item in the array should be removed

    let indecesToRemove = []
    for (let i = 0; i < array.length; i++) {
        if (isProblem(array[i])) {
            indecesToRemove.push(i)
        }
    }
    //iterate through the array backwards when removing by index
    for (let i = indecesToRemove.length - 1; i >= 0; i--) {
        array.splice(indecesToRemove[i], 1)
    }
}