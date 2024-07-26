import { PrismaClient } from '@prisma/client';
import { getSchema } from '../schema/codeSchema.js';
import { verifiedToken } from '../utils/jwt.js';
const prisma = new PrismaClient();

export const codeController = () => {
  const createCode = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Token not found');
    }
    const userId = verifiedToken(token).userId;

    const newCode = req.body;
    const user = await prisma.users.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const schema = await getSchema();
    const { error } = schema.createCodeSchema.validate(newCode);
    if (error) {
      return res.status(400).json({ error: error.details });
    }

    try {
      const codeTags = newCode.codeTags;

      const findTags = await prisma.tag.findMany({
        where: {
          tag: { in: codeTags },
        },
      });
      if (!findTags.length) {
        return res.status(404).json({ message: 'Tags not found' });
      }
      // Obtenemos un array con los valor del id de cada tag encontrado
      const tagListId = findTags.map((tag) => tag.tagId);

      const code = await prisma.code.create({
        data: {
          userId: userId,
          title: newCode.title,
          explanation: newCode.explanation,
          codeTag: {
            create: tagListId.map((id) => ({ tagId: id })),
          },
        },
      });

      return res
        .status(200)
        .json({ message: 'Code created successfully', code });
    } catch (error) {
      next(error);
    }
  };
  const createCodeLanguage = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Token not found');
    }
    const userId = verifiedToken(token).userId;

    const newCode = req.body;
    const user = await prisma.users.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const schema = await getSchema();
    const { error } = schema.createCodeLanguageSchema.validate(newCode);
    if (error) {
      return res.status(400).json({ error: error.details });
    }

    try {
      const codeLanguageTags = newCode.tagLanguage;

      const findCode = await prisma.code.findMany({
        where: {
          userId: user.userId,
          title: newCode.title,
        },
      });

      const findTags = await prisma.tagByLanguage.findMany({
        where: {
          tagByLanguage: { in: codeLanguageTags },
        },
      });
      if (!findTags.length) {
        return res.status(404).json({ message: 'Tags not found' });
      }
      // Obtenemos un array con los valor del id de cada tag encontrado
      const tagListId = findTags.map((tag) => tag.tagByLanguageId);

      const languages = await prisma.language.findMany({
        where: {
          language: {
            in: language,
          },
        },
      });
      if (!languages.length) {
        return res.status(404).json({ message: 'Language not found' });
      }

      const code = await prisma.codeLanguage.create({
        data: {
          codeId: findCode.codeId,
          explanation: newCode.explanation,
          codeTag: {
            create: tagListId.map((id) => ({ tagId: id })),
          },
          urlAws: newCode.urlAws,
        },
      });

      return res
        .status(200)
        .json({ message: 'Code created successfully', code });
    } catch (error) {
      next(error);
    }
  };
  const getCode = async (_req, res, next) => {
    try {
      const codeList = await prisma.code.findMany({
        include: {
          codeLanguage: true,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Codigos obtenidos correctamente',
        data: codeList,
      });
    } catch (error) {
      next(error);
    }
  };
  const getCodeByOption = async (req, res, next) => {
    const { title, tag, tagLanguage, language } = req.params;

    try {
      const options = [];

      if (tag) {
        const tagList = await prisma.tag.findMany({
          where: {
            tag: {
              in: tag,
            },
          },
          select: {
            tagId: true,
          },
        });
        const tagIds = tagList.map((tag) => tag.tagId);
        if (tagIds.length > 0) {
          options.push({
            codeTag: {
              some: {
                tagId: {
                  in: tagIds,
                },
              },
            },
          });
        }
      }

      if (tagLanguage) {
        const tagLanguageList = await prisma.tagByLanguage.findMany({
          where: {
            tagByLanguage: {
              in: tagLanguage,
            },
          },
          select: {
            tagByLanguageId: true,
          },
        });
        const tagLanguageIds = tagLanguageList.map(
          (tagLang) => tagLang.tagByLanguageId
        );
        if (tagLanguageIds.length > 0) {
          options.push({
            codeLanguageTag: {
              some: {
                tagByLanguageId: {
                  in: tagLanguageIds,
                },
              },
            },
          });
        }
      }

      if (language) {
        const findLanguage = await prisma.language.findUnique({
          where: {
            language: language,
          },
          select: {
            languageId: true,
          },
        });
        if (findLanguage) {
          options.push({
            codeLanguage: {
              languageId: findLanguage.languageId,
            },
          });
        }
      }

      if (title) {
        options.push({
          title: {
            contains: title,
            mode: 'insensitive',
          },
        });
      }

      const code = await prisma.code.findMany({
        where: {
          OR: options,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Códigos obtenidos correctamente',
        data: code,
      });
    } catch (error) {
      next(error);
    }
  };
  const editCode = async (req, res, next) => {};
  const deleteCode = async (req, res, next) => {};
  return {
    createCode,
    getCode,
    getCodeByOption,
    editCode,
    deleteCode,
  };
};
