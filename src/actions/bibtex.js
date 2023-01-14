const convertMiddleLine = (key, value) => {
  return `${key} = "${value}",\n`;
};

const convertLastLine = (key, value) => {
  return `${key} = "${value}"}\n\n`;
};

const convertRef = (ref) => {
  let type = ref.entryType.toLowerCase();
  const entries = Object.entries(ref.entryTags);
  const strings = entries.map(([key, value], i) => {
    if (i === entries.length - 1) {
      return convertLastLine(key, value);
    }
    return convertMiddleLine(key, value);
  });
  let finalString = `@${type}{${ref.citationKey},\n`;
  strings.forEach((str) => (finalString += str));
  return finalString;
};

export const convertRefs = (refs) => {
  let finalString = '';
  refs.forEach((ref) => {
    finalString += convertRef(ref);
  });
  return finalString;
};

export const xmlToBib = (xmlText) => {
  console.log(xmlText);
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'text/xml');
  const biblStruct = xml.querySelector('biblStruct');
  if (!biblStruct) {
    return { ok: false };
  }
  //
  // Parse Title
  //
  let title;
  if (!xml.querySelector('titleStmt')) {
    title = null;
  } else {
    title = Array.from(
      xml.querySelector('titleStmt').querySelectorAll('title')
    ).find((titleElem) => {
      return titleElem.getAttribute('level') === 'a';
    }).innerHTML;
  }
  console.log('TITLE');
  console.log(title);
  //
  // Parse authors
  //
  const authors = Array.from(biblStruct.querySelectorAll('persName')).map(
    (elem) => {
      let authorString = '';
      Array.from(elem.children)
        .filter((elem) => elem.innerHTML !== '•')
        .forEach((node) => {
          authorString += ' ' + node.innerHTML;
        });
      return authorString.trim();
    }
  );
  let author = null;
  if (authors.length !== 0) {
    author = authors.join(', ').trim();
  }
  console.log('AUTHOR');
  console.log(author);
  //
  // Parse journal
  //
  const journal = xml
    .querySelector('publicationStmt')
    ?.querySelector('publisher')?.innerHTML;
  console.log('JOURNAL');
  console.log(journal);
  //
  // Parse year
  //
  const year = xml.querySelector('publicationStmt')?.querySelector('date')
    ?.innerHTML;
  console.log('YEAR');
  console.log(year);
  //
  // Validate
  //
  if (!title || !author || !journal || !year) {
    return { ok: false };
  }
  return {
    ok: true,
    entry: {
      title,
      author,
      journal,
      year,
    },
  };
};
