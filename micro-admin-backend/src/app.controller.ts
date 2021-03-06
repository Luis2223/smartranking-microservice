import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Categoria } from './categorias/interface/categoria.interface';

const ackErrors: String[] = ['E11000'] 

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @EventPattern('criar-categoria')
  async criarCategoria(@Payload() categoria: Categoria, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    
    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);
    try {
      await this.appService.criarCategoria(categoria);
      await channel.ack(originalMessage);  
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      const filterAckError =  ackErrors.filter(ackError => error.message.includes(ackError))
      
      if (filterAckError) await channel.ack(originalMessage)
    }  
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(
    @Payload() _id: string,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`id fornecido: ${JSON.stringify(_id)}`);

    try {
      if (_id) return await this.appService.consultarCategoriaPeloId(_id);

      return await this.appService.consultarTodasCategorias();
    } finally {
      await channel.ack(originalMessage)
    }
  }

  @EventPattern('atualizar-categoria')
  async atualizarCategoria(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`data: ${JSON.stringify(data)}`);

    try {
      const _id: string = data.id;
      const categoria: Categoria = data.categoria;
      await this.appService.atualizarCategoria(_id, categoria);
      await channel.ack(originalMessage);
    } catch (error) {
      const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError))

      if (filterAckError) await channel.ack(originalMessage)
    }
  }
}
