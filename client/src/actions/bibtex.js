const convertMiddleLine = (key, value) => {
    return `${key} = "${value}",\n`
}

const convertLastLine = (key, value) => {
    return `${key} = "${value}"}\n\n`
}

const convertRef = (ref) => {
    let type = ref.typeKey.toLowerCase();
    const entries = Object.entries(ref).filter(([key, value]) => { 
        return (key !== 'typeKey' && key !== 'key' && key !== '_id' && key !== 'user')
    });
    const strings = entries.map(([key, value], i) => {
        if (i == entries.length - 1) {
            return convertLastLine(key, value);
        }
        return convertMiddleLine(key, value);
    })
    let finalString = `@${type}{${ref.key},\n`;
    strings.forEach(str => finalString += str);
    return finalString;
}

export const convertRefs = (refs) => {
    let finalString = "";
    refs.forEach(ref => {
        finalString += convertRef(ref);
    })
    return finalString;
}