import { Workbook } from 'exceljs';
// 移除file-saver导入

/**
 导出的数据格式示例：

//  多个表格数据
const allTableData = {
    // 文件名
    file: [],
    // 编码
    code: [],
    // 构件信息深度
    attr: [
        {
            errorContent: {
                id: '0x56112', // 构件ID
                name: '路线',  // 分类名称
                value: '18.0.0.00', // 分类编码
                hasCorrectAttrs: ['长度'], // 已有属性
                missAttrs: ['面积'], // 缺少属性
            }
        },
        {
            errorContent: {
                id: '0x56112', // 构件ID
                name: '不匹配',  // 分类名称
                value: '18.0.0.00', // 分类编码
                hasCorrectAttrs: ['长度'], // 已有属性
                missAttrs: ['面积'], // 缺少属性
            }
        }
    ],
    // 信息深度冗余
    redundancy: [
        {
            errorContent: {
                id: '0x56112', // 构件ID
                redundancyType: '路线',  // 冗余构件类型
            }
        }
    ],
    // 标识码
    signCodeResult: [
        {
            errorContent: {
                id: '0x56112', // 构件ID
                countryCode: '076',  // 国家码
                unitCode: '01', // 单位工程码
                panelCode: 'L, // 分幅码
                sideCode: 'A', // 外部工程码
                signErrors: '076;01;L;', // 错误信息
            }
        }
    ],
    // 标识码冗余
    signCodeRedundancyResult: [
        {
            errorContent: {
                id: '0x56112', // 构件ID
                signCode: '010_01_L_A',  // 标识码
            }
        }
    ],
    totalIdsNum: 0,
}

忽略allTableData下的file 和 code 两个表
只导出allTableData下的
attr -> 工作表名为 构件信息深度
redundancy -> 表名为 信息深度冗余
signCodeResult -> 表名为 标识码
signCodeRedundancyResult -> 表名为 标识码冗余

只要数据长度大于0 就导出

每个工作表的每列标题使用每条数据的字段注释

另外其他没出现在上面的注释中的字段不计入导出，直接忽略掉，与业务无关。

 */

/**
 * 导出Excel文件
 * @param {*} allTableData 包含所有表格数据的对象
 * @param {*} fileName 导出的文件名
 */
async function exportExcel(allTableData, fileName) {
  // 创建工作簿
  const workbook = new Workbook();
  
  // 删除默认的工作表（如果有的话）
  workbook.removeWorksheet(workbook.worksheets[0]?.id);
  
  // 处理"构件信息深度"工作表 (attr)
  if (allTableData.attr && allTableData.attr.length > 0) {
    const attrWorksheet = workbook.addWorksheet('构件信息深度');
    
    // 添加表头
    const attrHeaders = [
      { header: '构件ID', key: 'id', width: 25 },
      { header: '分类名称', key: 'name', width: 20 },
      { header: '分类编码', key: 'value', width: 20 },
      { header: '已有属性', key: 'hasCorrectAttrs', width: 35 },
      { header: '缺少属性', key: 'missAttrs', width: 35 }
    ];
    
    attrWorksheet.columns = attrHeaders;
    
    // 添加数据行
    allTableData.attr.forEach(item => {
      const errorContent = item.errorContent;
      attrWorksheet.addRow({
        id: errorContent.id,
        name: errorContent.name,
        value: errorContent.value,
        hasCorrectAttrs: Array.isArray(errorContent.hasCorrectAttrs) ? errorContent.hasCorrectAttrs.join(', ') : '',
        missAttrs: Array.isArray(errorContent.missAttrs) ? errorContent.missAttrs.join(', ') : ''
      });
    });
    
    // 设置表头样式
    attrWorksheet.getRow(1).font = { bold: true };
  }
  
  // 处理"信息深度冗余"工作表 (redundancy)
  if (allTableData.redundancy && allTableData.redundancy.length > 0) {
    const redundancyWorksheet = workbook.addWorksheet('信息深度冗余');
    
    // 添加表头
    const redundancyHeaders = [
      { header: '构件ID', key: 'id', width: 25 },
      { header: '冗余构件类型', key: 'redundancyType', width: 25 }
    ];
    
    redundancyWorksheet.columns = redundancyHeaders;
    
    // 添加数据行
    allTableData.redundancy.forEach(item => {
      const errorContent = item.errorContent;
      redundancyWorksheet.addRow({
        id: errorContent.id,
        redundancyType: errorContent.redundancyType
      });
    });
    
    // 设置表头样式
    redundancyWorksheet.getRow(1).font = { bold: true };
  }
  
  // 处理"标识码"工作表 (signCodeResult)
  if (allTableData.signCodeResult && allTableData.signCodeResult.length > 0) {
    const signCodeWorksheet = workbook.addWorksheet('标识码');
    
    // 添加表头
    const signCodeHeaders = [
      { header: '构件ID', key: 'id', width: 25 },
      { header: '国家码', key: 'countryCode', width: 15 },
      { header: '单位工程码', key: 'unitCode', width: 15 },
      { header: '分幅码', key: 'panelCode', width: 15 },
      { header: '外部工程码', key: 'sideCode', width: 15 },
      { header: '错误信息', key: 'signErrors', width: 40 }
    ];
    
    signCodeWorksheet.columns = signCodeHeaders;
    
    // 添加数据行
    allTableData.signCodeResult.forEach(item => {
      const errorContent = item.errorContent;
      signCodeWorksheet.addRow({
        id: errorContent.id,
        countryCode: errorContent.countryCode,
        unitCode: errorContent.unitCode,
        panelCode: errorContent.panelCode,
        sideCode: errorContent.sideCode,
        signErrors: errorContent.signErrors
      });
    });
    
    // 设置表头样式
    signCodeWorksheet.getRow(1).font = { bold: true };
  }
  
  // 处理"标识码冗余"工作表 (signCodeRedundancyResult)
  if (allTableData.signCodeRedundancyResult && allTableData.signCodeRedundancyResult.length > 0) {
    const signCodeRedundancyWorksheet = workbook.addWorksheet('标识码冗余');
    
    // 添加表头
    const signCodeRedundancyHeaders = [
      { header: '构件ID', key: 'id', width: 50 },
    ];
    
    signCodeRedundancyWorksheet.columns = signCodeRedundancyHeaders;
    
    // 添加数据行
    allTableData.signCodeRedundancyResult.forEach(item => {
      const errorContent = item.errorContent;
      signCodeRedundancyWorksheet.addRow({
        id: errorContent.id,
        signCode: errorContent.signCode
      });
    });
    
    // 设置表头样式
    signCodeRedundancyWorksheet.getRow(1).font = { bold: true };
  }
  
  // 导出文件
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  
  // 使用原生API保存文件
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || '导出结果.xlsx';
  a.click();
  URL.revokeObjectURL(url);
}

export default exportExcel;