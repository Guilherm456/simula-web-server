import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {ChildProcessWithoutNullStreams, spawn} from 'child_process'

import {SimulacaoDTO} from 'src/DTO/simulacao.dto'
import {
  DatasProps,
  SearchsProps,
  Simulacao,
} from 'src/Mongo/Interface/simulacao.interface'
import {SimulacaoRepository} from 'src/Mongo/repository/simulacao.repository'
import {BaseService} from 'src/modules/base/service/base.service'
import {LoggerServer} from 'src/loggerServer'
import {mkdirSync, writeFileSync} from 'fs'
const path = require('path')
const queuesExecutions = []

// proc execution information
export interface ProcessExecution {
  id: string
  process: ChildProcessWithoutNullStreams
  output?: string
}

@Injectable()
export class SimulacaoService {
  constructor(
    private readonly simulacaoRepository: SimulacaoRepository,
    private readonly baseService: BaseService,
    private readonly logger: LoggerServer,
  ) {}

  private executions: Record<string, ProcessExecution> = {}

  async replaceColumn(simulacaoID: string, nameColumn: string, newValue: any) {
    try {
      return await this.simulacaoRepository.replaceColumn(
        simulacaoID,
        nameColumn,
        newValue,
      )
    } catch {
      throw new HttpException(
        'Erro ao atualizar a simulação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  private generateExecutionId(): string {
    return Date.now().toString()
  }

  async executeCommand(simulationId: string, command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const childProc = spawn(`${command}`, {shell: true})
      const id = this.generateExecutionId()

      this.replaceColumn(simulationId, 'status', 'RUNNING')

      this.executions[id] = {
        id,
        process: childProc,
      }

      childProc.stdout.on('data', (data) => {
        const message = `[${id}] ${data.toString()}`
        this.logger.log(message)
      })

      childProc.stderr.on('data', (data) => {
        const message = `[${id}] ${data.toString()}`
        this.logger.error(message)
      })

      childProc.on('error', (error) => {
        this.logger.error(`[${id}] ${error.message}`)
        this.replaceColumn(simulationId, 'status', 'ERROR')
        reject(error)
      })

      childProc.on('close', (code) => {
        if (code !== 0) {
          // If there is an error, remove the process from the executions map
          delete this.executions[id]
          const message = `Process exited with code ${code}`
          this.logger.error(`[${id}] ${message}`)
          this.replaceColumn(simulationId, 'status', 'ERROR')
          reject(new Error(message))
        }

        this.replaceColumn(simulationId, 'status', 'FINISHED')
      })

      resolve(id)
    })
  }

  async getExecutionStatus(id: string): Promise<any> {
    if (!this.executions[id]) {
      throw new Error(`No execution found with id: ${id}`)
    }

    let status = ''
    if (this.executions[id].process.killed) {
      status = 'FINISHED_ERROR'
    } else if (this.executions[id].process.exitCode === null) {
      status = 'RUNNING'
    } else if (this.executions[id].process.exitCode === 0) {
      status = 'FINISHED_OK'
    } else {
      status = 'FINISHED_ERROR'
    }

    return {
      id: this.executions[id].id,
      output: this.executions[id].output,
      status: status,
    }
  }

  async executeSimulacao(simulacaoID: string) {
    const csvConverter = require('csvjson-json2csv')

    const simulacao = await this.getSimulacaoByID(simulacaoID)

    //Vai buscar a estrutura da base
    const structure = await this.baseService.getStructureByID(
      simulacao.base._id.toString(),
    )

    if (structure == undefined) {
      throw new HttpException(
        'Tipo de estrutura não encontrada',
        HttpStatus.NOT_FOUND,
      )
    } else {
      //Consegue o endereço da pasta da simulação
      const folderExec = path.join(
        path.resolve(`output/${structure.outputFolder}/`),
        `${simulacaoID}/`,
      )

      try {
        //Vai criar a pasta da simulação
        mkdirSync(folderExec, {recursive: true})

        const names = Object.keys(structure.type_parameters)

        for (const name of names) {
          const names_param = Object.keys(structure.type_parameters[name])
          const actualDir = path.join(folderExec, name)

          if (names_param.length == 0) {
            mkdirSync(actualDir, {recursive: true})
            for (const name_param of names_param) {
              const csv = csvConverter(
                simulacao.base.parameters[name][name_param],
                {
                  separator: ';',
                },
              )

              writeFileSync(path.join(actualDir, `${name_param}.csv`), csv)
            }
          } else {
            const csv = csvConverter(simulacao.base.parameters[name], {
              separator: ';',
            })
            writeFileSync(path.join(actualDir, '.csv'), csv)
          }
        }

        //Vai executar a simulação
        const command = 'cd ./simulator && ./AEDES_Acoplado'
        const id = await this.executeCommand(simulacaoID, command)
        this.logger.log(`Execution started with id: ${id}`)

        return simulacao
      } catch (e) {
        //Caso dê algum erro, vai remover a simulação da fila de execução
        queuesExecutions.pop()
        this.logger.error('Algum erro ocorreu ao executar uma simulação')
        this.logger.error(e)
        throw new HttpException(
          'Erro ao criar pasta da simulação',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      }
    }
  }

  async getSimulacaoStatus(simulacaoID: string): Promise<ProcessExecution> {
    try {
      const execution = await this.getExecutionStatus(simulacaoID)
      return execution
    } catch (error) {
      this.logger.error(
        'An error occurred during fetching the execution status',
      )
      this.logger.error(error.message)
      throw new HttpException(
        'Error during fetching execution status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async saveSimulacao(
    simulacao: SimulacaoDTO,
    baseID: string,
  ): Promise<Simulacao> {
    const base = await this.baseService.getBaseByID(baseID)
    if (base) {
      return await this.simulacaoRepository.saveSimulacao(simulacao, base)
    } else throw new HttpException('Base não encontrada', HttpStatus.NOT_FOUND)
  }

  async getAllSimulacoes(): Promise<Simulacao[]> {
    return await this.simulacaoRepository.getAllSimulacoes()
  }

  async getSimulacaoByID(ID: string): Promise<Simulacao> {
    const simulacao = await this.simulacaoRepository.getSimulacaoByID(ID)
    if (!simulacao) {
      throw new HttpException('Simulação não encontrada', HttpStatus.NOT_FOUND)
    } else return simulacao
  }

  async getSimulacoesByStatus(status: string): Promise<Simulacao[]> {
    switch (status) {
      case 'new':
        return await this.simulacaoRepository.getSimulacoesByStatus({$eq: 0})
      case 'running':
        return await this.simulacaoRepository.getSimulacoesByStatus({
          $gte: 1,
          $lt: 100,
        })
      case 'finished':
        return await this.simulacaoRepository.getSimulacoesByStatus({
          $gte: 100,
        })
      default:
        throw new HttpException('Status inválido', HttpStatus.NOT_ACCEPTABLE)
    }
  }

  async addExecuteSimulacao(simulacaoID: string) {
    this.logger.warn('Adicionando nova simulação na fila de execução')
    const simulacao = await this.getSimulacaoByID(simulacaoID)
    if (!simulacao) return
    // this.fakeData(simulacao);
    if (!queuesExecutions.includes(simulacaoID)) {
      queuesExecutions.push(simulacaoID)
      if (queuesExecutions.length == 1) {
        return await this.executeSimulacao(simulacaoID)
      }
      //Vai passar o tanto de simulações que estão a ser executadas
      return queuesExecutions.length
    } else return 'Simulação já está na fila de execução'
  }

  async fakeData(simulacao: Simulacao) {
    const data: DatasProps[] = []
    const fakeCiclos = Math.random() * 150

    const agensNum = 190
    const estados = this.baseService.getStatesByBase(
      simulacao.base._id.toString(),
    )
    for (let j = 0; j < fakeCiclos; j++) {
      const tempData = []
      for (let i = 0; i < agensNum; i++) {
        const stateN = Math.floor(Math.random() * (await estados).length)
        const isNegativeX = Math.floor(Math.random() * 2)
        const isNegativeY = Math.floor(Math.random() * 2)

        const max = 0.07
        tempData.push({
          codName: `Agente ${i}`,
          state: stateN,
          coord: {
            lat:
              isNegativeX == 0
                ? simulacao.city[0] + Math.random() * max
                : simulacao.city[0] - Math.random() * max,
            lng:
              isNegativeY == 0
                ? simulacao.city[1] + Math.random() * max
                : simulacao.city[1] - Math.random() * max,
          },
        })
      }
      data.push(tempData)
    }
    await this.simulacaoRepository.executeSimulacao(
      simulacao._id.toString(),
      data,
    )
    this.logger.log('Simulação executada')
  }

  async getSimulacoesByBaseID(baseID: string): Promise<Simulacao[]> {
    return this.simulacaoRepository.getSimulacoesByBaseID(baseID)
  }

  async updateSimulacao(
    simulacaoID: string,
    newSimulacao: SimulacaoDTO,
  ): Promise<Simulacao> {
    const simulacaoOld = await this.simulacaoRepository.getSimulacaoByID(
      simulacaoID,
    )
    if (!simulacaoOld) {
      throw new HttpException('Simulação não encontrada', HttpStatus.NOT_FOUND)
    }

    return await this.simulacaoRepository.updateSimulacao(
      simulacaoID,
      newSimulacao,
    )
  }

  async deleteSimulacao(simulacaoID: string): Promise<Simulacao> {
    try {
      const simulacaoDeleted = await this.simulacaoRepository.deleteSimulacao(
        simulacaoID,
      )
      this.logger.warn(`Base deletada: ${simulacaoDeleted.name}`)
      return simulacaoDeleted
    } catch (e) {
      this.logger.error('Solicitação de exclusão de base não existente')
      throw new HttpException(
        'Nenhuma base encontrada com esse ID',
        HttpStatus.NOT_FOUND,
      )
    }
  }

  //Busca os agentes pela suas caracteristicas
  async findAgents(
    simulacaoID: string,
    agents: SearchsProps,
  ): Promise<number[][] | number[]> {
    const simulacao = await this.getSimulacaoByID(simulacaoID)

    if (!simulacao) {
      throw new HttpException('Simulação não encontrada', HttpStatus.NOT_FOUND)
    }
    const structure = await this.baseService.getStructureByID(
      simulacao.base._id.toString(),
    )
    if (!structure) {
      throw new HttpException(
        'Tipo de estrutura não encontrada',
        HttpStatus.NOT_FOUND,
      )
    }

    if (!agents.stateAgent && agents.propertiesAgent.length === 0) {
      return []
    }
    try {
      this.logger.log(`Buscando agentes na simulação ${simulacao.name}`)

      //Vai buscar os dados originais dos agentes
      //Pega a partir da estrutura da doença
      const whereNeedFind: Array<Object> =
        simulacao.base.parameters[structure.defaultSearch[0]][
          structure.defaultSearch[1]
        ]

      //Vai adicionar um campo para achar os agentes (index de cada um)
      let resultsSimulation: DatasProps[] = simulacao.result.map((resul) =>
        resul.map((obj, i) => {
          Object.defineProperty(obj, 'index', {value: i})
          return obj
        }),
      )

      let agentsFound: number[][] | number[]

      //Busca pelas propriedades dos agentes
      if (agents.propertiesAgent && agents.propertiesAgent.length > 0) {
        const indexFound = []

        //Vai buscar em todas caracteristicas dos agentes
        for (let i = 0; i < whereNeedFind.length; i++) {
          const whereActual = whereNeedFind[i]
          //Verifica todas caracteristicas passadas pelo agente
          for (let j = 0; j < agents.propertiesAgent.length; j++) {
            const propertie = agents.propertiesAgent[j].properties
            const value = agents.propertiesAgent[j].value
            if (
              //Verifica se possui aquela propriedade
              whereActual.hasOwnProperty(propertie) &&
              //Verifica se os valores são iguais
              whereActual[propertie] == value
            ) {
              indexFound.push(i)
            }
          }
        }

        //Caso tenha achado algum agente
        if (indexFound.length > 0) {
          resultsSimulation = resultsSimulation.map((agents, i) =>
            agents.filter((a) => indexFound.includes(a.index)),
          )
        } else return []
      }

      //Vai buscar os agentes pelo estado
      if (agents.stateAgent) {
        resultsSimulation = resultsSimulation.map((agentsSimulation) =>
          agentsSimulation.filter(
            (agent) => agent.state === agents.stateAgent.value,
          ),
        )

        //Vai converter os agentes para o nome do agente
        agentsFound = resultsSimulation.map((agents) =>
          agents.map((agent) => agent.index),
        )
      } else {
        /*
          Se não possuir filtro por estado, não necessita filtrar todos os ciclos,
          já que todos os ciclos vão contar agentes com a mesma propriedade
        */
        agentsFound = resultsSimulation[0].map((agents) => agents.index)
      }

      return agentsFound
    } catch (e) {
      this.logger.error('Erro ao encontrar o campo defaultSearch | ' + e)
      throw new HttpException(
        'Erro ao encontrar o campo defaultSearch',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
