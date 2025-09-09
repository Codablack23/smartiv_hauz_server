import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoEntity } from 'src/entities/entity.videos';
import { Repository } from 'typeorm';
import { AppResponse, SanitizerProvider } from 'src/lib';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(VideoEntity)
    private videoRepository: Repository<VideoEntity>,
  ) {}

  async create(createVideoDto: CreateVideoDto) {
    const existingVideo = await this.videoRepository.findOne({
      where: { title: createVideoDto.title },
    });

    if (existingVideo) {
      throw new BadRequestException(
        AppResponse.getResponse('failed', {
          message: 'Please provide a unique title for this video',
        }),
      );
    }

    const newVideo = this.videoRepository.create(createVideoDto);
    const video = await this.videoRepository.save(newVideo);

    return AppResponse.getResponse('success', {
      data: { video },
      message: 'New video added successfully',
    });
  }

  async findAll() {
    const videos = await this.videoRepository.find();
    return AppResponse.getResponse('success', {
      data: { videos },
      message: 'Videos retrieved successfully',
    });
  }

  async findOne(id: string) {
    const video = await this.videoRepository.findOne({ where: { id } });

    if (!video) {
      throw new NotFoundException(
        AppResponse.getResponse('failed', {
          message:
            "Sorry, the video you are looking for doesn't exist or may have been removed",
        }),
      );
    }

    return AppResponse.getResponse('success', {
      data: { video },
      message: 'Video retrieved successfully',
    });
  }

  async update(id: string, updateVideoDto: UpdateVideoDto) {
    const { data } = await this.findOne(id);
    const video = data?.video;

    if (!video) {
      throw new NotFoundException(
        AppResponse.getResponse('failed', {
          message:
            "Sorry, the video you are trying to update doesn't exist or may have been removed",
        }),
      );
    }

    // sanitize update object
    const sanitized = SanitizerProvider.sanitizeEmptyObjectProp(updateVideoDto);

    if (sanitized.title !== undefined) {
      const duplicate = await this.videoRepository.findOne({
        where: { title: sanitized.title },
      });
      if (duplicate && duplicate.id !== id) {
        throw new BadRequestException(
          AppResponse.getResponse('failed', {
            message: 'Another video already uses this title',
          }),
        );
      }
      video.title = sanitized.title;
    }

    if (sanitized.banner_url !== undefined)
      video.banner_url = sanitized.banner_url;
    if (sanitized.video_url !== undefined)
      video.video_url = sanitized.video_url;
    if (sanitized.duration !== undefined) video.duration = sanitized.duration;
    if (sanitized.is_featured !== undefined)
      video.is_featured = sanitized.is_featured;
    if (sanitized.description !== undefined)
      video.description = sanitized.description;
    if (sanitized.services !== undefined) video.services = sanitized.services;

    const updatedVideo = await this.videoRepository.save(video);

    return AppResponse.getResponse('success', {
      message: `Video #${id} updated successfully`,
      data: { video: updatedVideo },
    });
  }

  async remove(id: string) {
    const { data } = await this.findOne(id);
    const video = data?.video;

    if (!video) {
      throw new NotFoundException(
        AppResponse.getResponse('failed', {
          message:
            "Sorry, the video you are trying to delete doesn't exist or may have been removed",
        }),
      );
    }

    await this.videoRepository.delete({ id });

    return AppResponse.getResponse('success', {
      message: 'Video deleted successfully',
    });
  }
}
