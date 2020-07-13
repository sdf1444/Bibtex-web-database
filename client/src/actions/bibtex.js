const typeChange = {
    'Article': 'article',
    'Book': 'book',
    'Booklet': 'booklet',
    'Conference': 'conference',
    'InBook': 'inBook',
    'InCollection': 'incollection',
    'InProceedings': 'inproceedings',
    'Manual': 'manual',
    'Master Thesis': 'mastersthesis',
    'Misc': 'misc',
    'Online': 'online',
    'Phd Thesis': 'phdthesis',
    'Proceedings': 'proceedings'
}

const convertMiddleLine = (key, value) => {
    return `${key} = "${value}",\n`
}

const convertLastLine = (key, value) => {
    return `${key} = "${value}"}\n\n`
}

const convertRef = (ref) => {
    console.log(ref.type)
    ref.type = typeChange[ref.type];
    const entries = Object.entries(ref).filter(([key, value]) => { 
        return (key !== 'type' && key !== 'key' && key !== '_id' && key !== 'user')
    });
    const strings = entries.map(([key, value], i) => {
        if (i == entries.length - 1) {
            return convertLastLine(key, value);
        }
        return convertMiddleLine(key, value);
    })
    let finalString = `@${ref.type}{${ref.key},\n`;
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