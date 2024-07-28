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
  const titleList = code.map((code) => code.title);

  return { tagList, tagLanguageList, languageList, titleList };
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

const updateCodeSchema = (tagList) => {
  return Joi.object({
    updateTitle: Joi.string().max(100),
    explanation: Joi.string().max(300),
    codeTags: Joi.array().items(Joi.string().valid(...tagList)),
    deleteTags: Joi.array().items(Joi.string().valid(...tagList)),
  });
};

const createCodeLanguageSchema = (languageList, tagLanguageList, titleList) => {
  return Joi.object({
    codeTitle: Joi.string()
      .valid(...titleList)
      .max(100)
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

const updateCodeLanguageSchema = (languageList, tagLanguageList, titleList) => {
  return Joi.object({
    language: Joi.string()
      .valid(...languageList)
      .max(30)
      .required(),
    tagLanguage: Joi.array().items(Joi.string().valid(...tagLanguageList)),
    deleteTagLanguage: Joi.array().items(
      Joi.string().valid(...tagLanguageList)
    ),
    explanation: Joi.string().max(8000),
    urlAws: Joi.string().max(150),
  });
};

export const getSchema = async () => {
  const { tagList, tagLanguageList, languageList, titleList } =
    await getValidationLists();
  return {
    updateCodeSchema: updateCodeSchema(tagList),
    createCodeSchema: createCodeSchema(tagList),
    createCodeLanguageSchema: createCodeLanguageSchema(
      languageList,
      tagLanguageList,
      titleList
    ),
    updateCodeLanguageSchema: updateCodeLanguageSchema(
      languageList,
      tagLanguageList,
      titleList
    ),
  };
};
