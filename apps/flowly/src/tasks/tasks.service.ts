import { ForbiddenException, Injectable } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { ProjectRepository } from '../project/project.repository';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository, private readonly projectRepository: ProjectRepository) {}

  public async getById(id: string) {
    //!TODO update logic for team lead and collaborators
    return await this.taskRepository.findByPk(id);
  }

  public async create(dto: CreateTaskDto, teamLeadId: string) {
    await this.checkTeamLeadOnProject(teamLeadId, dto.projectId);
    return await this.taskRepository.create(dto);
  }

  public async update(id: string, dto: UpdateTaskDto, teamLeadId: string) {
    const { projectId } = await this.taskRepository.findByPk(id);
    await this.checkTeamLeadOnProject(teamLeadId, projectId);
    return await this.taskRepository.update(id, dto);
  }

  public async completeTask(id: string) {
    //!TODO update logic for team lead and collaborators
    return await this.taskRepository.update(id, { completed: true });
  }

  public async delete(id: string, teamLeadId: string) {
    const { projectId } = await this.taskRepository.findByPk(id);
    await this.checkTeamLeadOnProject(teamLeadId, projectId);
    return await this.taskRepository.delete(id);
  }

  private async checkTeamLeadOnProject(teamLeadId: string, projectId: string) {
    const { team } = await this.projectRepository.findByPk(projectId);

    if (team.teamLeaderId !== teamLeadId) {
      throw new ForbiddenException();
    }
  }
}
