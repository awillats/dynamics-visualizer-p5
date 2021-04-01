
function setupLatexColors(cText,cHigh,c1,c2,c3)
{
    eqStr = ""
    //cMain, cBracket, cInner must be defined, either here or in eq1.txt
    eqStr += buildColorDef("cMain", pColorToHexStr(cText))
    eqStr += buildColorMacro("CH", pColorToHexStr(cHigh))

    eqStr += buildColorMacro("CR", pColorToHexStr(c1))
    eqStr += buildColorMacro("CB", pColorToHexStr(c2))
    eqStr += buildColorMacro("CY", pColorToHexStr(c3))
    eqStr += "\\color{\\cMainDef}"
    return eqStr
}
function pColorToHexStr(pcolor)
{
    return pcolor.toString('#rrggbb')
}
//https://katex.org/docs/supported.html
function buildColorMacro(macroName, macroColorStr)
{
    //expects macroColor to be a string formatted like "#AABBCC"
    defStr = buildColorDef(macroName,macroColorStr)
    return defStr+"\\newcommand{\\"+macroName+"}[1]{\\textcolor{"+macroColorStr.substring(1)+"}{#1} } \n"
}

function buildColorDef(macroName, macroColorStr)
{
    //expects macroColor to be a string formatted like "#AABBCC"
    //return "\\newcommand{\\"+macroName+"}[1]{ \\textcolor{"+macroColorStr.substring(1)+"}{#1} } "
    return "\\def \\"+macroName+"Def {"+macroColorStr.substring(1)+"}\n"
}

// function doubleSlash(strIn)
// {
//   var strOut = strIn.replace(/\\/g, "||")
//   return strOut;
// }


/* Notes down here */
//https://katex.org/docs/supported.html
// https://discourse.processing.org/t/latex-in-processing/19691
// https://cs.nyu.edu/~kapp/cs101/processing_on_the_web/
//

function showFile(input) {
  let file = input.files[0];

  alert(`File name: ${file.name}`); // e.g my.png

  //alert(`Last modified: ${file.lastModified}`); // e.g 1552830408824
  var fileReader = new FileReader();
   fileReader.onload = function(event) {
     console.log(event.target.result);
   }
  // var file2 = event.target.files[0];
   fileReader.readAsText(file);
}
