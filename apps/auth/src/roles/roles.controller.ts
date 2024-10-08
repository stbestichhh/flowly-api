import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard, RoleGuard } from '@app/common/guards';
import { RolesService } from './roles.service';
import { WhereOptions } from 'sequelize';
import { Role } from '@app/common/database';
import { CreateRoleDto } from './dto';
import { Roles } from '@app/common/decorators';
import { RolesEnum } from '@app/common/enums';

@ApiTags('Roles')
@ApiBearerAuth()
@Roles(RolesEnum.ADMIN)
@UseGuards(JwtGuard, RoleGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Get role by property' })
  @ApiQuery({
    name: 'value',
    example: 'super_admin',
    description: 'Find user by its value',
  })
  @ApiResponse({ status: 200, type: Role })
  @ApiResponse({ status: 404, description: 'Role not found by: value' })
  @Get('search')
  public async getByOption(@Query() options: WhereOptions<Role>) {
    return await this.rolesService.getOne(options);
  }

  @ApiOperation({ summary: 'Get role by id' })
  @ApiResponse({ status: 200, type: Role })
  @ApiResponse({ status: 404, description: 'Role not found by: id' })
  @Get(':id')
  public async getById(@Param('id') id: string) {
    return await this.rolesService.getById(id);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, type: Role })
  @ApiResponse({ status: 404, description: 'Etities of type: Role not found' })
  @Get()
  public async getAll() {
    return await this.rolesService.getAll();
  }

  @ApiOperation({ summary: 'Create new role' })
  @ApiResponse({ status: 201, type: Role })
  @ApiResponse({ status: 403, description: 'Role already exists' })
  @ApiResponse({ status: 400, description: 'Body is not correct' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async create(@Body() dto: CreateRoleDto) {
    return await this.rolesService.create(dto);
  }

  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({ status: 204, description: 'Role deleted' })
  @ApiResponse({ status: 404, description: 'Role not found by: id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param('id') id: string) {
    return await this.rolesService.delete(id);
  }
}
