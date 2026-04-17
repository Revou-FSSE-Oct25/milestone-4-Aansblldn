import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('user')  // ← Base route /user
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')  // ← /user/profile
  getProfile(@CurrentUser() user: { userId: string }) {
    return this.userService.getProfile(user.userId);
  }

  @Patch('profile')  // ← /user/profile
  updateProfile(
    @CurrentUser() user: { userId: string },
    @Body() data: { firstName?: string; lastName?: string },
  ) {
    return this.userService.updateProfile(user.userId, data);
  }
}