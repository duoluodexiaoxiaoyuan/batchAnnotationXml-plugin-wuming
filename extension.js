const vscode = require('vscode');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('vscode插件已经激活');
  // 指定位置插入字符串
  // souece 原字符串 start 要截取的位置 newStr 要插入的字符
  function insertStr(source, start, newStr) {
    console.log(source.slice(0, start) + newStr + source.slice(start));
    return source.slice(0, start) + newStr + source.slice(start)
  }

  // 批量注释
	let disposable = vscode.commands.registerCommand('batchAnnotationXml-plugin-wuming.batchAnnotationXml', function () {
    // const path = '/Users/d/Desktop/testreact2/react练习项目/xml的学习/按压效果.html';
    // const options = {
    //   // 选中第3行第9列到第3行第17列
    //   selection: new vscode.Range(new vscode.Position(2, 8), new vscode.Position(2, 16)),
    //   // 是否预览，默认true，预览的意思是下次再打开文件是否会替换当前文件, 假如为false就是你关闭以后再次打开的时候它还是会选中指定内容
    //   preview: false,
    //   // 显示在第二个编辑器
    //   viewColumn: vscode.ViewColumn.Two
    // };
    // vscode.window.showTextDocument(vscode.Uri.file(path), options);
    const { document, selection } = vscode.window.activeTextEditor;
    document.uri; // 获取编辑文件 Uri
    document.getText(); // 获取编辑器文本内容
    document.getText(selection); // 获取选中部分内容
    // 文件总行数
    let lineCount = document.lineCount;
    if(selection.isEmpty){
      vscode.window.showWarningMessage("请选择要单行注释的内容,这个软件只对xml文件的注释有效")
    } else {
      // 拿到选中的开始的行号
      let startLine = selection.start.line;
      // 拿到选中的结束的行号
      let endLine = selection.end.line;
      // 选中文本一行的开始的位置
      let start_num = selection.start.character;
      // 选择文本一行的结束的位置
      var end_num = selection.end.character;
      let selectContent =document.getText(selection).split(/[\r\n]+/);
      // 这里遍历两次是因为我删除数组里面一个空格的位置，数组的长度发送了变化，后面的补到原来空格占的索引的位置，导致我遍历补到所以我就为了
      // 方便写了遍历两次
      console.log(selectContent);
      selectContent.forEach((item,index)=>{
        // console.log(item,index);
        // trim方法去除首尾的空格
        if(!item.trim()){
          // 表示在索引的位置删除一个元素，就是把空格的删除了
          selectContent.splice(index,1);
        } 
      })
      selectContent.forEach((item,index)=>{ 
        if(item.indexOf('<!--') > -1 && item.indexOf('-->') > -1){
          console.log('注释的代码');
        }else{
          if(item.indexOf('<!--') > -1){
            selectContent[index] =  item + ' -->'
          } else if (item.indexOf('-->') > -1){
            let num = item.indexOf('<')
            selectContent[index] = insertStr(item, num, '<!-- ')
          } else {
            let num = item.indexOf('<')
            selectContent[index] = insertStr(item+' -->', num, '<!-- ')
          }
         
        }
      })      
      vscode.window.activeTextEditor.edit(editBuilder => {
        // // 从开始到结束，全量替换
        // const end = new vscode.Position(vscode.window.activeTextEditor.document.lineCount + 1, 0);
        // const text = '新替换的内容';
        // // (0,0)表示的就是最开始的坐标
        // editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), end), text);
        //  新增代码
        // let lines_add = [];
        // lines_add.push(document.lineAt(lineCount - 1).text);
        // lines_add.push('你好世界');   
        let range = new vscode.Range(
          startLine,
          start_num,
          endLine,
          end_num
        )
        editBuilder.replace(range, selectContent.join('\n'))
    });

    }

     
    
    

    // vscode.workspace.fs.writeFile(document.uri, new Uint8Array(Buffer.from(document.getText()))); 
		vscode.window.showInformationMessage('欢迎使用插件，这个插件是给xml进行批量注释的');
	});
	context.subscriptions.push(disposable);

  // 取消批量注释
  let cancelDisposable = vscode.commands.registerCommand('batchAnnotationXml-plugin-wuming.cancelBatchAnnotationXml', function () {
    const { document, selection } = vscode.window.activeTextEditor;
    document.uri; // 获取编辑文件 Uri
    document.getText(); // 获取编辑器文本内容
    document.getText(selection); // 获取选中部分内容
    // 文件总行数
    let lineCount = document.lineCount;
    if(selection.isEmpty){
      vscode.window.showWarningMessage("请选择要取消单行注释的内容,这个软件只对xml文件的注释有效")
    } else {
      // 拿到选中的开始的行号
      let startLine = selection.start.line;
      // 拿到选中的结束的行号
      let endLine = selection.end.line;
      // 选中文本一行的开始的位置
      let start_num = selection.start.character;
      // 选择文本一行的结束的位置
      var end_num = selection.end.character;
      let selectContent =document.getText(selection).split(/[\r\n]+/);
      // 这里遍历两次是因为我删除数组里面一个空格的位置，数组的长度发送了变化，后面的补到原来空格占的索引的位置，导致我遍历补到所以我就为了
      // 方便写了遍历两次
      selectContent.forEach((item,index)=>{
        // console.log(item,index);
        // trim方法去除首尾的空格
        if(!item.trim()){
          // 表示在索引的位置删除一个元素，就是把空格的删除了
          selectContent.splice(index,1);
        } 
      })
      console.log(selectContent);
      selectContent.forEach((item,index)=>{ 
        if(item.indexOf('<!--') > -1){
          if(item.split('<!--')[1].split('-->')[0].indexOf('<') > -1){
            selectContent[index] = item.split('<!--')[0]+item.split('<!--')[1].split('-->')[0]
          }
        }
      })

      console.log(selectContent);
      
      vscode.window.activeTextEditor.edit(editBuilder => {
        // // 从开始到结束，全量替换
        // const end = new vscode.Position(vscode.window.activeTextEditor.document.lineCount + 1, 0);
        // const text = '新替换的内容';
        // // (0,0)表示的就是最开始的坐标
        // editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), end), text);
        //  新增代码
        // let lines_add = [];
        // lines_add.push(document.lineAt(lineCount - 1).text);
        // lines_add.push('你好世界');   
        let range = new vscode.Range(
          startLine,
          start_num,
          endLine,
          end_num
        )
        editBuilder.replace(range, selectContent.join('\n'))
      });

    }

     
    
    

    // vscode.workspace.fs.writeFile(document.uri, new Uint8Array(Buffer.from(document.getText()))); 
		vscode.window.showInformationMessage('欢迎使用插件，这个插件是给xml进行批量注释的');
	});
	context.subscriptions.push(cancelDisposable);



  // 获取文件的路径
  context.subscriptions.push(vscode.commands.registerCommand('extension.demo.getCurrentFilePath', (uri) => {
    vscode.window.showInformationMessage(`当前文件(夹)路径是：${uri ? uri.path : '空'}`);
  }));
  
}

function deactivate() {
  console.log("插件已经关闭");
}

module.exports = {
	activate,
	deactivate
}