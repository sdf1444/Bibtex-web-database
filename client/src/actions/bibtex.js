<<<<<<< HEAD
=======
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

>>>>>>> 1daa008c91b5e6282d25163fb46e35d76d7709c9
const convertMiddleLine = (key, value) => {
    return `${key} = "${value}",\n`
}

const convertLastLine = (key, value) => {
    return `${key} = "${value}"}\n\n`
}

const convertRef = (ref) => {
<<<<<<< HEAD
    let type = ref.typeKey.toLowerCase();
    const entries = Object.entries(ref).filter(([key, value]) => { 
        return (key !== 'typeKey' && key !== 'key' && key !== '_id' && key !== 'user')
=======
    console.log(ref.type)
    ref.type = typeChange[ref.type];
    const entries = Object.entries(ref).filter(([key, value]) => { 
        return (key !== 'type' && key !== 'key' && key !== '_id' && key !== 'user')
>>>>>>> 1daa008c91b5e6282d25163fb46e35d76d7709c9
    });
    const strings = entries.map(([key, value], i) => {
        if (i == entries.length - 1) {
            return convertLastLine(key, value);
        }
        return convertMiddleLine(key, value);
    })
<<<<<<< HEAD
    let finalString = `@${type}{${ref.key},\n`;
=======
    let finalString = `@${ref.type}{${ref.key},\n`;
>>>>>>> 1daa008c91b5e6282d25163fb46e35d76d7709c9
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