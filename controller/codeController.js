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

      const findCode = await prisma.code.findFirst({
        where: {
          userId: user.userId,
          title: newCode.codeTitle,
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

      const languages = await prisma.language.findUnique({
        where: {
          language: newCode.language,
        },
      });
      if (!languages) {
        return res.status(404).json({ message: 'Language not found' });
      }

      const codeLanguage = await prisma.codeLanguage.create({
        data: {
          languageId: languages.languageId,
          codeId: findCode.codeId,
          explanation: newCode.explanation,
          codeLanguageTag: {
            create: tagListId.map((id) => ({ tagByLanguageId: id })),
          },
          urlAws: newCode.urlAws,
        },
      });

      return res
        .status(200)
        .json({ message: 'Code created successfully', codeLanguage });
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
    const { title, tag, tagLanguage, language } = req.query;

    try {
      const options = [];
      let tagLanguageIds = []; // Inicializa tagLanguageIds aquí

      if (tag) {
        const tagList = await prisma.tag.findMany({
          where: {
            tag: {
              in: tag.split(','),
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
              in: tagLanguage.split(','),
            },
          },
          select: {
            tagByLanguageId: true,
          },
        });

        tagLanguageIds = tagLanguageList.map(
          (tagLang) => tagLang.tagByLanguageId
        );
      }

      if (tagLanguageIds.length > 0) {
        options.push({
          codeLanguage: {
            some: {
              codeLanguageTag: {
                some: {
                  tagByLanguageId: {
                    in: tagLanguageIds,
                  },
                },
              },
            },
          },
        });
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
              some: {
                languageId: findLanguage.languageId,
              },
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

      const codes = await prisma.code.findMany({
        where: {
          OR: options.length > 0 ? options : undefined,
        },
        include: {
          codeTag: true,
          codeLanguage: {
            include: {
              codeLanguageTag: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Códigos obtenidos correctamente',
        data: { codes },
      });
    } catch (error) {
      next(error);
    }
  };

  const editCode = async (req, res, next) => {
    const { title } = req.query;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Token not found');
    }
    const userId = verifiedToken(token).userId;

    const updateCode = req.body;
    const user = await prisma.users.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const schema = await getSchema();
    const { error } = schema.updateCodeSchema.validate(updateCode);
    if (error) {
      return res.status(400).json({ error: error.details });
    }

    try {
      const codeTags = updateCode.codeTags;
      const deleteCodeTags = updateCode.deleteTags;

      const findCode = await prisma.code.findFirst({
        where: {
          title: title,
          userId: userId,
        },
      });

      if (!findCode) {
        return res.status(404).json({ message: 'Code not found' });
      }

      const findTags = await prisma.tag.findMany({
        where: {
          tag: { in: codeTags },
        },
      });
      const findDeleteTags = await prisma.tag.findMany({
        where: {
          tag: { in: deleteCodeTags },
        },
      });
      if (!findTags.length) {
        return res.status(404).json({ message: 'Tags not found' });
      }
      const tagListId = findTags.map((tag) => tag.tagId);
      const deleteTagListId = findDeleteTags.map((tag) => tag.tagId);
      const codeId = findCode.codeId;

      await prisma.codeTag.deleteMany({
        where: {
          codeId: codeId,
          tagId: {
            in: deleteTagListId,
          },
        },
      });
      if (tagListId.length > 0) {
        await prisma.codeTag.deleteMany({
          create: tagListId.map((id) => ({ tagId: id })),
        });
      }

      const code = await prisma.code.update({
        where: {
          codeId: codeId,
        },
        data: {
          title: updateCode.updateTitle,
          explanation: updateCode.explanation,
        },
      });

      return res
        .status(200)
        .json({ message: 'Code created successfully', code });
    } catch (error) {
      next(error);
    }
  };
  const editCodeLanguage = async (req, res, next) => {
    const { title } = req.query;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Token not found');
    }
    const userId = verifiedToken(token).userId;

    const updateCode = req.body;
    const user = await prisma.users.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const schema = await getSchema();
    const { error } = schema.updateCodeLanguageSchema.validate(updateCode);
    if (error) {
      return res.status(400).json({ error: error.details });
    }

    try {
      const LanguageTags = updateCode.tagLanguage;
      const deleteLanguageTags = updateCode.deleteTagLanguage;

      const languages = await prisma.language.findUnique({
        where: {
          language: updateCode.language,
        },
      });

      const findCode = await prisma.code.findFirst({
        where: {
          userId: user.userId,
          title: title,
          codeLanguage: {
            language: languages.languageId,
          },
        },
        include: {
          codeLanguage: true,
        },
      });

      if (!findCode) {
        return res.status(404).json({ message: 'Code not found' });
      }

      const findTags = await prisma.tagByLanguage.findMany({
        where: {
          tagByLanguage: { in: LanguageTags },
        },
      });
      const findDeleteTags = await prisma.tagByLanguage.findMany({
        where: {
          tagByLanguage: { in: deleteLanguageTags },
        },
      });
      if (!findTags.length) {
        return res.status(404).json({ message: 'Tags not found' });
      }

      const tagListId = findTags.map((tag) => tag.tagByLanguageId);
      const deleteTagListId = findDeleteTags.map((tag) => tag.tagByLanguageId);

      if (!languages) {
        return res.status(404).json({ message: 'Language not found' });
      }

      await prisma.codeLanguageTag.deleteMany({
        where: {
          codeLanguageId: findCode.codeLanguage.codeLanguageId,
          tagByLanguage: { in: deleteTagListId },
        },
      });

      if (tagListId.length > 0) {
        await prisma.codeLanguageTag.deleteMany({
          create: tagListId.map((id) => ({ tagByLanguageId: id })),
        });
      }

      const codeLanguage = await prisma.codeLanguage.update({
        where: {
          codeLanguageId: findCode.codeLanguage.codeLanguageId,
        },
        data: {
          explanation: updateCode.explanation,
          urlAws: updateCode.urlAws,
        },
      });

      return res
        .status(200)
        .json({ message: 'Code created successfully', codeLanguage });
    } catch (error) {
      next(error);
    }
  };
  const deleteCode = async (req, res, next) => {
    const { access } = req.user;

    let userId;
    if (!access) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: 'No authorization header provided' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Token not found' });
      }

      const decodedToken = verifiedToken(token);
      userId = decodedToken.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      userId = parseInt(req.query.userId);
      if (!userId) {
        return res.status(400).json({ message: 'User ID not provided' });
      }
    }

    const { title } = req.query;

    try {
      const findCode = await prisma.code.findFirst({
        where: {
          userId: userId,
          title: title,
        },
      });
      if (!findCode) {
        return res.status(404).json({ message: 'Title and user do not match' });
      }
      await prisma.code.delete({
        where: {
          userId: userId,
          codeId: findCode.codeId,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Code deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
  const deleteCodeLanguage = async (req, res, next) => {
    const { access } = req.user;

    let userId;
    if (!access) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: 'No authorization header provided' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Token not found' });
      }

      const decodedToken = verifiedToken(token);
      userId = decodedToken.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      userId = parseInt(req.query.userId);
      if (!userId) {
        return res.status(400).json({ message: 'User ID not provided' });
      }
    }

    const { title, language } = req.query;

    try {
      const findLanguage = await prisma.language.findUnique({
        where: {
          language: language,
        },
      });
      console.log(findLanguage.languageId);
      if (!findLanguage) {
        return res.status(404).json({ message: 'language not found' });
      }
      const findCode = await prisma.code.findFirst({
        where: {
          userId: userId,
          title: title,
          codeLanguage: {
            some: {
              languageId: findLanguage.languageId,
            },
          },
        },
        include: {
          codeLanguage: true,
        },
      });
      if (!findCode) {
        return res
          .status(404)
          .json({ message: 'Title, user and language do not match' });
      }

      const findCodeLanguage = await prisma.codeLanguage.findFirst({
        where: {
          codeId: findCode.codeId,
          languageId: findLanguage.languageId,
        },
      });
      if (!findCode) {
        return res
          .status(404)
          .json({ message: 'Title, user and language do not match' });
      }
      console.log(findCode.codeLanguage.codeLanguageId);
      const findLanguageId = findLanguage.languageId;
      await prisma.codeLanguage.delete({
        where: {
          codeId: findCode.codeId,
          codeLanguageId: findCodeLanguage.codeLanguageId,
          languageId: findLanguageId,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Code Language deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    createCode,
    createCodeLanguage,
    getCode,
    getCodeByOption,
    editCode,
    editCodeLanguage,
    deleteCode,
    deleteCodeLanguage,
  };
};
