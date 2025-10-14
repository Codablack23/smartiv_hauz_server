/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/entity.article';
import { Repository } from 'typeorm';
import { AppResponse, SanitizerProvider } from 'src/lib';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
  ) {}

  async create(createArticleDto: CreateArticleDto, user: any) {
    const articleSlug = SanitizerProvider.generateSlug(createArticleDto.title);

    const existingArticle = await this.articleRepository.findOne({
      where: [{ title: createArticleDto.title }, { slug: articleSlug }],
    });

    if (existingArticle)
      throw new BadRequestException(
        AppResponse.getResponse('failed', {
          message: 'Please create an article with a different title',
        }),
      );

    const newArticle = this.articleRepository.create({
      ...createArticleDto,
      author: user,
    });

    const article = await this.articleRepository.save(newArticle);

    return AppResponse.getResponse('success', {
      data: {
        article,
      },
      message: 'Article Added successfully',
    });
  }

  async findAll(page: number = 1, limit: number = 8) {
    const [articles, total, top_articles] = await Promise.all([
      this.articleRepository.find({
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.articleRepository.count(),
      this.articleRepository.find({
        order: { views: 'DESC' },
        take: 3,
      }),
    ]);

    const highlight = articles[0] ?? top_articles[0] ?? null;
    const total_pages = Math.ceil(total / limit);

    // 🔹 Pagination logic
    const has_next_page = page < total_pages;
    const has_prev_page = page > 1;

    const next_page = has_next_page ? page + 1 : null;
    const prev_page = has_prev_page ? page - 1 : null;

    return AppResponse.getResponse('success', {
      data: {
        articles,
        highlight,
        top_articles,
        pagination: {
          page,
          limit,
          total,
          total_pages,
          has_next_page,
          has_prev_page,
          next_page,
          prev_page,
        },
      },
      message: 'articles retrieved successfully',
    });
  }

  async findOne(id: string) {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article)
      throw new NotFoundException(
        AppResponse.getResponse('failed', {
          message:
            "Sorry the article you are looking for doesn't exist or may have been removed",
        }),
      );

    article.views = article.views + 1;
    await this.articleRepository.save(article);

    return AppResponse.getResponse('success', {
      data: {
        article,
      },
      message: 'article retrieved successfully',
    });
  }
  async update(id: string, updateArticleDto: UpdateArticleDto) {
    // 1. Fetch the existing article
    const { data } = await this.findOne(id);

    if (!data?.article) {
      throw new NotFoundException(
        AppResponse.getResponse('failed', {
          message:
            "Sorry, the article you are looking for doesn't exist or may have been removed",
        }),
      );
    }

    // 2. Sanitize incoming data
    const sanitizedObject =
      SanitizerProvider.sanitizeEmptyObjectProp(updateArticleDto);

    // 3. Update only the provided fields
    if (sanitizedObject.title !== undefined)
      data.article.title = sanitizedObject.title;
    if (sanitizedObject.content !== undefined)
      data.article.content = sanitizedObject.content;
    if (sanitizedObject.services !== undefined)
      data.article.services = sanitizedObject.services;
    if (sanitizedObject.banner_url !== undefined)
      data.article.banner_url = sanitizedObject.banner_url;

    // 4. Save the updated article
    const updatedArticle = await this.articleRepository.save(data.article);

    // 5. Return a structured response
    return AppResponse.getResponse('success', {
      message: `Article #${id} updated successfully`,
      data: {
        article: updatedArticle,
      },
    });
  }

  async remove(id: string) {
    // 1. Fetch the existing article
    const { data } = await this.findOne(id);

    if (!data?.article) {
      throw new NotFoundException(
        AppResponse.getResponse('failed', {
          message:
            "Sorry, the article you are looking for doesn't exist or may have been removed",
        }),
      );
    }

    await this.articleRepository.delete({ id });

    return AppResponse.getResponse('success', {
      message: 'Article delete successfully',
    });
  }
}
