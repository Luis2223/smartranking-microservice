import { Controller, Post, Body, Get, Query, Delete, UsePipes, ValidationPipe, Param, Put, Logger, BadRequestException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/criar-jogador.dto';
import { ValidateParameter } from '../common/pipes/validate-parameter.pipe';
import { UpdatePlayerDto } from './dtos/atualizar-jogador.dto';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { Observable } from 'rxjs';

@Controller('api/v1/jogadores')
export class JogadoresController {

    private logger = new Logger(JogadoresController.name)

    constructor(
        private clientProxySmartRanking: ClientProxySmartRanking
    ) {
    }
    private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()


    @Post()
    @UsePipes(ValidationPipe)
    async criarJogador(
        @Body() createPlayerDto: CreatePlayerDto
    ) {
        this.logger.log(`criarJogadorDto: ${JSON.stringify(createPlayerDto)}`);
        const categoria = await this.clientAdminBackend.send('consultar-categorias', createPlayerDto.category).toPromise();

        if(categoria) {
            await this.clientAdminBackend.emit('criar-jogador', createPlayerDto);
        } else {
            throw new BadRequestException(`Category not found!`);
        }
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(
        @Body() updatePlayerDto: UpdatePlayerDto,
        @Param('_id', ValidateParameter) _id: string
    ) {
        const categoria = await this.clientAdminBackend.send('consultar-categoria', updatePlayerDto.category).toPromise();

        if (categoria) {
            await this.clientAdminBackend.emit('atualizar-jogador', { id: _id, jogador: updatePlayerDto })
        } else {
            throw new BadRequestException(`Category not register.`)
        }
    }

    @Get()
    consultarJogadores(@Query('idJogador') _id: string): Observable<any> {
        return this.clientAdminBackend.send('consultar-jogadores', _id ? _id : '');
    }

    @Delete('/:_id')
    async deletarJogador(@Param('_id', ValidateParameter) _id: string) {
        await this.clientAdminBackend.emit('deletar-jogador', { _id })
    }
}
