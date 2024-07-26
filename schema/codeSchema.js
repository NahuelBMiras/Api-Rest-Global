import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const prisma = new PrismaClient();

const getValidationLists = async () => {
  const tags = await prisma.tag.findMany({
    select: {
      tag: true,
    },
  });

  const tagByLanguages = await prisma.tagByLanguage.findMany({
    select: {
      tagByLanguage: true,
    },
  });

  const languages = await prisma.language.findMany({
    select: {
      language: true,
    },
  });
  const code = await prisma.code.findMany({
    select: {
      title: true,
    },
  });

  const tagList = tags.map((tag) => tag.tag);
  const tagLanguageList = tagByLanguages.map(
    (tagLanguage) => tagLanguage.tagByLanguage
  );
  const languageList = languages.map((language) => language.language);

  return { tagList, tagLanguageList, languageList };
};

const createCodeSchema = (tagList) => {
  return Joi.object({
    title: Joi.string().max(100).required(),
    explanation: Joi.string().max(300).required(),
    codeTags: Joi.array()
      .items(Joi.string().valid(...tagList))
      .required(),
  });
};

const createCodeLanguageSchema = (languageList, tagLanguageList, code) => {
  return Joi.object({
    codeTitle: Joi.string()
      .valid(...code)
      .max()
      .required(),
    language: Joi.string()
      .valid(...languageList)
      .max(30)
      .required(),
    tagLanguage: Joi.array()
      .items(Joi.string().valid(...tagLanguageList))
      .required(),
    explanation: Joi.string().max(8000).required(),
    urlAws: Joi.string().max(150).required(),
  });
};

export const getSchema = async () => {
  const { tagList, tagLanguageList, languageList, code } =
    await getValidationLists();
  return {
    createCodeSchema: createCodeSchema(tagList),
    createCodeLanguageSchema: createCodeLanguageSchema(
      languageList,
      tagLanguageList,
      code
    ),
  };
};
