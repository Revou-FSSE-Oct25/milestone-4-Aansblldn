import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('deposit')
  deposit(
    @CurrentUser() user: { userId: string },
    @Body() dto: DepositDto,
  ) {
    return this.transactionsService.deposit(user.userId, dto);
  }

  @Post('withdraw')
  withdraw(
    @CurrentUser() user: { userId: string },
    @Body() dto: WithdrawDto,
  ) {
    return this.transactionsService.withdraw(user.userId, dto);
  }

  @Post('transfer')
  transfer(
    @CurrentUser() user: { userId: string },
    @Body() dto: TransferDto,
  ) {
    return this.transactionsService.transfer(user.userId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: { userId: string }) {
    return this.transactionsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    return this.transactionsService.findOne(user.userId, id);
  }
}