import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { In } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roltype.enum';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { Book } from './book.entity';
import { BookRepository } from './book.repository';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dtos';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    private readonly bookRepository: BookRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async get(bookId: number): Promise<ReadBookDto> {
    const book: Book = await this.bookRepository.findOne(bookId);
    if (!book) {
      throw new NotFoundException('book does not exist');
    }
    return plainToClass(ReadBookDto, book);
  }

  async getAll(): Promise<ReadBookDto[]> {
    const books: Book[] = await this.bookRepository.find({
      where: { status: 1 },
    });

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  async getBookByAuthor(authorId: number): Promise<ReadBookDto[]> {
    if (!authorId) {
      throw new BadRequestException('id must be sent');
    }
    const books: Book[] = await this.bookRepository.find({
      where: { status: 1, authors: In([authorId]) },
    });

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    const authors: User[] = [];

    for (const authorId of book.authors) {
      const authorExists = await this.userRepository.findOne(authorId, {
        where: { status: 1 },
      });

      if (!authorExists) {
        throw new NotFoundException(`
        There's not an author with this Id: ${authorId}
        `);
      }

      const isAuthor = authorExists.roles.some(
        (role: Role) => role.name === RoleType.AUTHOR,
      );

      if (!isAuthor) {
        throw new UnauthorizedException(
          `This user ${authorId} is not an author`,
        );
      }

      authors.push(authorExists);
    }

    const savedBook: Book = await this.bookRepository.save({
      name: book.name,
      description: book.description,
      authors,
    });

    return plainToClass(ReadBookDto, savedBook);
  }

  async createByAuthor(
    book: Partial<CreateBookDto>,
    authorId: number,
  ): Promise<ReadBookDto> {
    const author = await this.userRepository.findOne(authorId, {
      where: { status: 1 },
    });

    if (!author) {
      throw new NotFoundException(`
        There's not an author with this Id: ${authorId}
        `);
    }

    const isAuthor = author.roles.some(
      (role: Role) => role.name === RoleType.AUTHOR,
    );

    if (!isAuthor) {
      throw new UnauthorizedException(`This user ${authorId} is not an author`);
    }

    const savedBook: Book = await this.bookRepository.save({
      name: book.name,
      description: book.description,
      author,
    });

    return plainToClass(ReadBookDto, savedBook);
  }

  async update(
    bookId: number,
    bookUpdate: UpdateBookDto,
  ): Promise<ReadBookDto> {
    const book: Book = await this.bookRepository.findOne(bookId, {
      where: { status: 1 },
    });
    if (!book) {
      throw new NotFoundException('book does not exist');
    }

    book.name = bookUpdate.name;
    book.description = bookUpdate.description;

    const updatedUser = await this.userRepository.save(book);
    return plainToClass(ReadBookDto, updatedUser);
  }

  async delete(bookId: number): Promise<void> {
    const book: Book = await this.bookRepository.findOne(bookId, {
      where: { status: 1 },
    });
    if (!book) {
      throw new NotFoundException('book does not exist');
    }

    await this.bookRepository.update(bookId, { status: 0 });
  }
}
