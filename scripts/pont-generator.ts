import {
  CodeGenerator as OriginCodeGenerator,
  FileStructures as OriginFileStructures,
  getFileName,
  Surrounding,
  Interface
} from 'pont-engine'

export default class CodeGenerator extends OriginCodeGenerator {
  private isTs: boolean = true

  constructor(surrounding: Surrounding, outDir: string, lockFilename: string) {
    super(surrounding, outDir, lockFilename)
    this.isTs = (surrounding ?? Surrounding.typeScript) === Surrounding.typeScript
  }

  /** 对传入的字符进行首字符大写与尾缀内容 */
  private capitalizeAndSuffix(capitalized: string, suffix: string): string {
    return `${capitalized.slice(0, 1).toUpperCase() + capitalized.slice(1) + suffix}`
  }

  /** 根据接口名生成参数类型 */
  getInterfaceParamType(inter: Interface) {
    return this.capitalizeAndSuffix(inter.name, 'Param')
  }

  /** 根据接口名生成响应类型 */
  getInterfaceResponseType(inter: Interface) {
    return this.capitalizeAndSuffix(inter.name, 'Response')
  }

  /** 获取声明文件中类型定义命名空间的名称 */
  getTypeDomainInDeclaration(): string {
    return `PONT_${this.dataSource.name ? this.dataSource.name + '_' : ''}TYPE`
  }

  /** 获取接口实现内容的代码 */
  getInterfaceContent(inter: Interface) {
    const typeDomain = this.getTypeDomainInDeclaration()

    return `
      ${inter.name}: {
        path: "${inter.path}",
        type: "${inter.method}", 
        /*
         * ${inter.description.replace('\n', '\n* ')}${!this.isTs ? '\n* @param {' + this.getInterfaceParamType(inter) + '} param' : ''}
         */
        send: function (param${this.isTs ? ': ' + `${typeDomain}.${this.getInterfaceParamType(inter)}` : ''})${this.isTs ? `: Promise<${typeDomain}.${this.getInterfaceResponseType(inter)}>` : ''} {
          return request({
            url: this.path,
            method: this.type,
            data: param
          })
        }
      }
     `
  }

  /** 获取接口实现内容类型声明 */
  private getInterfaceInDeclarationCustom(inter: Interface, typeDomain: string = '') {
    return `
        ${inter.name}: {
          path: string,
          type: string,
          send(param: ${typeDomain}.${this.getInterfaceParamType(inter)}): Promise<${typeDomain}.${this.getInterfaceResponseType(inter)}>
        }
      `
  }

  /** 在声明文件中为接口生成相关类型 */
  private getInterfaceTypesInDeclaration(inter: Interface) {
    const ParamName = this.getInterfaceParamType(inter)
    const ParamOriginName = `${ParamName}Origin`
    const bodyParams = inter.getBodyParamsCode()
    const ResponseName = this.getInterfaceResponseType(inter)

    return `
          ${inter.getParamsCode(ParamOriginName, this.surrounding)}
          type ${ParamName} = ${ParamOriginName}${bodyParams ? ` & ${bodyParams}` : ''}
          type ${ResponseName} = ${inter.responseType}
        `
  }

  /** 声明文件中类型代码生成 */
  getTypesDeclaration() {
    const mods = this.dataSource.mods
    const typeDomain = this.getTypeDomainInDeclaration()
    const content = `declare namespace ${typeDomain} {
        ${mods
          .map(
            (mod) => `
        /** ${mod.name} start */
        ${mod.interfaces.map(this.getInterfaceTypesInDeclaration.bind(this)).join('\n')}
        /** ${mod.name} end */
        `
          )
          .join('\n')}
      }`

    return content
  }

  /** 获取模块的类型定义代码，一个 namespace */
  getModsDeclaration() {
    const mods = this.dataSource.mods
    const typeDomain = this.getTypeDomainInDeclaration()
    const content = `declare namespace PONT_${this.dataSource.name || 'API'} {
        ${mods
          .map(
            (mod) => `
          /**
           * ${mod.description}
           */
          export class ${reviseModName(mod.name)} {
            ${mod.interfaces.map((inter) => this.getInterfaceInDeclarationCustom.call(this, inter, typeDomain)).join('\n')}
          }
        `
          )
          .join('\n\n')}
          }
          
          ${this.getTypesDeclaration()}
        `

    return content
  }

  /** 获取所有模块的 index 入口文件 */
  getModsIndex() {
    const modList = `${this.dataSource.mods.map((mod) => reviseModName(mod.name) + 'Api').join(', \n')}`
    const conclusion = this.dataSource.name
      ? `
      export const ${this.dataSource.name} = {
        ${modList}
      };
      `
      : `
      export default {
        ${modList}
      };
      `

    return `
        ${this.dataSource.mods
          .map((mod) => {
            const modName = reviseModName(mod.name)
            return `import ${modName}Api from './${modName}';`
          })
          .join('\n')}
  
        ${conclusion}
      `
  }

  /** 获取接口类和基类的总的 index 入口文件代码 */
  getIndex() {
    let conclusion = `
          import * as defs from './baseClass';
          import api from './mods';
  
          export default api
          export { defs as PONT_DEFS }
        `
    // dataSource name means multiple dataSource
    if (this.dataSource.name) {
      conclusion = `
            import { ${this.dataSource.name} as defs } from './baseClass';
            import { ${this.dataSource.name} as api } from './mods';
  
            export default api
            export { defs as PONT_DEFS };
          `
    }
    return conclusion
  }
}

export class FileStructures extends OriginFileStructures {
  private surroundingCopy: Surrounding
  constructor(
    generators: CodeGenerator[],
    usingMultipleOrigins: boolean,
    surrounding = Surrounding.typeScript,
    baseDir = 'src/api',
    templateType = '',
    spiltApiLock: boolean
  ) {
    super(generators, usingMultipleOrigins, surrounding, baseDir, templateType, spiltApiLock)
    this.surroundingCopy = surrounding
  }

  /** 定义每个接口模块文件结构 */
  getOriginFileStructures(generator: CodeGenerator, usingMultipleOrigins = false) {
    const mods = {}
    const dataSource = generator.dataSource

    const indexFileName = getFileName('index', this.surroundingCopy)

    dataSource.mods.forEach((mod) => {
      Object.assign(mods, {
        [getFileName(reviseModName(mod.name), this.surroundingCopy)]: () => `
        import request from "@/utils/request";
  
        const apiData = {
          ${mod.interfaces.reduce((snippet, inter, index, interfaces) => {
            return (
              snippet +
              generator.getInterfaceContent.call(generator, inter) +
              (interfaces.length - 1 > index ? ',\n' : '')
            )
          }, '')}
        };
  
        export default apiData;
        `,
        [indexFileName]: generator.getModsIndex.bind(generator)
      })
    })

    if (!generator.hasContextBund) {
      generator.getBaseClassesInDeclaration = this.getBaseClassesInDeclaration.bind(
        this,
        generator.getBaseClassesInDeclaration.bind(generator),
        usingMultipleOrigins
      )
      generator.getModsDeclaration = this.getModsDeclaration.bind(
        this,
        generator.getModsDeclaration.bind(generator),
        usingMultipleOrigins
      )
      generator.hasContextBund = true
    }

    const fileStructures = {
      [getFileName('baseClass', this.surroundingCopy)]:
        generator.getBaseClassesIndex.bind(generator),
      mods: mods,
      [indexFileName]: generator.getIndex.bind(generator),
      'api.d.ts': generator.getDeclaration.bind(generator)
    }

    if (this.spiltApiLock && usingMultipleOrigins) {
      fileStructures[generator.lockFilename] = this.getLockContent(generator)
    } else if (!usingMultipleOrigins) {
      fileStructures[generator.lockFilename] = this.getLockContent()
    }

    return fileStructures
  }
}

function reviseModName(modName: string) {
  // .replace(/\//g, '.').replace(/^\../, '').replace(/\../g, '_') 转换 / .为下划线
  // exp: /api/v1/users  => api_v1_users
  // exp: api.v1.users => api_v1_users
  return modName.replace(/\//g, '.').replace(/^\../, '').replace(/\../g, '_')
}
