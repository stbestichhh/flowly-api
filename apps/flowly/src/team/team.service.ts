import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TeamRepository } from './team.repository';
import { CreateTeamDto, UpdateTeamDto } from './dto';
import { ProjectService } from '../project/project.service';
import { ClientProxy } from '@nestjs/microservices';
import { RolesEnum } from '@app/common/enums';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly projectService: ProjectService,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  public async getAll() {
    return await this.teamRepository.findAll();
  }

  public async getById(id: string, managerId: string) {
    const team = await this.teamRepository.findByPk(id);

    if (team.project.managerId !== managerId) {
      throw new NotFoundException(`Entity not found by id: ${id}`);
    }

    return team;
  }

  public async create(dto: CreateTeamDto, managerId: string) {
    const project = await this.projectService.getById(dto.projectId, managerId);

    if (project.team) {
      throw new ForbiddenException('Team already exists');
    }

    await this.authService.emit('give_role', {
      userId: dto.teamLeaderId,
      role: RolesEnum.TEAMLEAD,
    });

    return await this.teamRepository.create(dto);
  }

  public async update(id: string, dto: UpdateTeamDto, managerId: string) {
    await this.getById(id, managerId);
    return await this.teamRepository.update(id, dto);
  }

  public async delete(id: string, managerId: string) {
    await this.getById(id, managerId);
    return await this.teamRepository.delete(id);
  }
}
