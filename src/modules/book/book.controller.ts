import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roltype.enum';
import { BookService } from './book.service';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dtos';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get(':bookId')
  getBook(@Param('bookId', ParseIntPipe) bookId: number): Promise<ReadBookDto> {
    return this.bookService.get(bookId);
  }

  @Get()
  getBooks(): Promise<ReadBookDto[]> {
    return this.bookService.getAll();
  }

  @Get('author/:authorId')
  getBookByAuthor(
    @Param('authorId', ParseIntPipe) authorId: number,
  ): Promise<ReadBookDto[]> {
    return this.bookService.getBookByAuthor(authorId);
  }

  @Post()
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createBook(@Body() book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    return this.bookService.create(book);
  }

  @Post('/author/:authorId')
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createByAuthor(
    @Body() book: Partial<CreateBookDto>,
    @Param('authorId', ParseIntPipe) authorId: number,
  ): Promise<ReadBookDto> {
    return this.bookService.createByAuthor(book, authorId);
  }

  @Put(':bookId')
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  updateBook(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() book: UpdateBookDto,
  ) {
    return this.bookService.update(bookId, book);
  }

  @Delete(':bookId')
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  deleteBook(@Param('bookId', ParseIntPipe) bookId): Promise<void> {
    return this.bookService.delete(bookId);
  }
}
