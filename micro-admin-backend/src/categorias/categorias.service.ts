import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from './interface/categoria.interface';

@Injectable()
export class CategoriasService {

    private readonly logger = new Logger(CategoriasService.name);

    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    ) {}

    async createCategory(categoria: Categoria): Promise<void> {
        try {
            const categoriaCriada = new this.categoriaModel(categoria);
            await categoriaCriada.save();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async updateCategory(categoria: string, updateCategoryDto: UpdateCategoryDto): Promise<void> {
        const categoryExists = await this.categoriaModel.findOne({ categoria }).exec();

        if (!categoryExists) {
            throw new NotFoundException(`Category ${categoryExists} not found.`)
        }
        
        await this.categoriaModel.findOneAndUpdate({ categoria }, {
            $set: updateCategoryDto
        }).exec();
    }

    async searchAllCategorys(): Promise<Categoria[]> {
        try {
            return await this.categoriaModel.find().populate('jogadores').exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async serachCategoryForId(categoria: string): Promise<Categoria> {
        try {
            return await this.categoriaModel.findOne({ categoria }).exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async addCategoryPlayer(params: string[]): Promise<void> {
        const categoria = params['categoria'];
        const idJogador = params['idJogador'];

        const categoryExists = await this.categoriaModel.findOne({ categoria }).exec();
        const playerExistsWithCategory = await this.categoriaModel.find({ categoria }).where('jogadores').in(idJogador).exec();

        await this.jogadoresService.searchPlayerForId(idJogador);

        if (!categoryExists) {
            throw new BadRequestException(`Category ${categoria} not exists!`)
        }

        if (playerExistsWithCategory.length > 0) {
            throw new BadRequestException(`Player with id ${idJogador} already exists in category ${categoria}.`)
        }

        categoryExists.jogadores.push(idJogador);
        await this.categoriaModel.findOneAndUpdate({ categoria }, { $set: categoryExists }).exec();
    }

    async searchCategoryToPlayer(idJogador: any): Promise<Categoria> {
        return await this.categoriaModel.findOne().where('jogadores').in(idJogador).exec();
    }
}
