const languageData = newCode.codeLanguage.map((languageItem) => {
  const language = languageItem.language;
  const tagLanguage = languageItem.tagLanguage;
  const explanation = languageItem.explanation;
  const urlAws = languageItem.urlAws;
  return {
    language,
    tagLanguage,
    explanation,
    urlAws,
  };
});
const tagLanguages = languageData.map((item) => item.tagLanguage);
console.log(tagLanguages);
const language = languageData.map((item) => item.language);

const findTagLanguage = await prisma.tagByLanguage.findMany({
  where: {
    tagByLanguage: {
      in: tagLanguage,
    },
  },
});
const tagLanguageMap = new Map(
  findTagLanguage.map((lang) => [lang.tagByLanguage, lang.tagByLanguageId])
);
if (!findTagLanguage.length) {
  return res.status(404).json({ message: 'TagLanguages not found' });
}

await prisma.codeLanguage.createMany({
  data: languageData.map((item) => ({
    codeId: code.codeId,
    explanation: item.explanation,
    urlAws: item.urlAws,
    languageId: languageMap.get(item.language),
  })),
});

const codeLanguages = await prisma.codeLanguage.findMany({
  where: {
    codeId: code.codeId,
  },
  include: {
    language: true,
  },
});

await prisma.codeLanguageTag.createMany({
  data: codeLanguages.map((item) => ({
    tagByLanguageId: tagLanguages.map(
      (tagLanguage, index) => tagLanguage[index]
    ),
    codeLanguageId: item.codeLanguageId,
  })),
});

const createdCodeLanguages = await prisma.codeLanguage.findMany({
  where: { codeId: code.codeId },
});
const createdCodeLanguagesTag = await prisma.codeLanguageTag.findMany({
  where: { codeLanguageTagId: codeLanguages.codeLanguageId },
});
