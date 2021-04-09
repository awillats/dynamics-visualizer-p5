function setupEquationBlock(tex)
{
    tex = createP();
    tex.style('font-size', '12px');
    tex.position(50, height-300);
    //katex.render(eqStr, tex.elt);
    //
// katex.render("\\href{https://katex.org/}{\\KaTeX}\n", /* element */, {"displayMode":true,"leqno":false,"fleqn":false,"throwOnError":true,"errorColor":"#cc0000","strict":"warn","output":"htmlAndMathml","trust":true,"macros":{"\\f":"#1f(#2)"}})

//    katexStr = katex.renderToString(eqStr, tex.elt, {trust:true});

        // let linkStr = "\\href{https://katex.org/}{\\KaTeX}\n";
//        let linkStr = String.raw`\href{https://katex.org/}{\KaTeX}` //works
        let linkStr = String.raw`\htmlClass{EQDIV}{\href{https://katex.org/}{\KaTeX}} other`

        let simpleOptions = {
            trust:true,
            //displayMode:false
        }

        // let fullOptions = {
        //     "displayMode":true,"leqno":false,"fleqn":false,"throwOnError":true,
        //     "errorColor":"#cc0000","strict":"warn",
        //     "output":"htmlAndMathml","trust":true,
        //     "macros":{"\\f":"#1f(#2)"}
        // }
        //
        // katexStr = katex.renderToString("\\href{https://katex.org/}{\\KaTeX}\n", tex.elt,
        //     fullOptions);
        //         tex.html(`<div class="EQDIV">${katexStr}</div>`)

        katex.render(eqStr, tex.elt,simpleOptions)



    tex.mouseOver(eOver);
    tex.mouseOut(eOut);
    return tex;
}
function setupLatexColors(cText,cHigh,cLow,c1,c2,c3)
{
    eqStr = ""
    //cMain, cBracket, cInner must be defined, either here or in eq1.txt
    eqStr += buildColorDef("cMain", pColorToHexStr(cText))
    eqStr += buildColorMacro("CH", pColorToHexStr(cHigh))
    eqStr += buildColorMacro("CL", pColorToHexStr(cLow))

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




// Try more regexes here: https://regex101.com/r/0XhJre/1
// TRY this regex structure instead!!
// https://stackoverflow.com/questions/46029392/search-and-replace-outer-tag-in-atom-using-regex
// <span class="klass">(.*?)</span>
// <code>$1</code>


function repCMDandDef(strArray, findPre, repPre)
{
    let findCmdPre = `\\\\${findPre}{`
    let repCmdPre = `\\${repPre}{`
    let findDefPre = `\\\\LBC{\\\\${findPre}Def}`
    let repDefPre = `\\LBC{\\${repPre}Def}`

    //e.g. replace ( \CY{xyz} with \CR{xyz} )
    let textRepd = repEachBracket(strArray,findCmdPre,`}`,repCmdPre,`}`);

    //e.g. replace ( \LBC{\CYDef}x\RBC{} with \LBC{\CRDef}x\RBC{} )
    textRepd = repEachBracket(textRepd,findDefPre,'\RBC{}',repDefPre,'\RBC{}');

    return textRepd;
}
function repEachBracket(strArray,findPre,findPost, repPre,repPost)
{
  //finds between "\fStr{" and "}"
  let regp = new RegExp(`${findPre}(.+?)${findPost}`,"gms");
  console.log(regp)
  //let regp =  /\\CR{(.+?)}/g;//'\\CR{.+?}/gm'
  //let regp = new RegExp(`\LBC`,"gms");

//    let regp = new RegExp(`${findPre}(.+?)${findPost}`,"gs");
//
//
  if (Array.isArray(strArray))
      for (let i=0; i<strArray.length; i++)
      {
        let s = strArray[i];
        //s = s.replace(fStr,repStr);

        let middle = s.match(regp)
        if (middle){
            console.log("a match!")
            console.log(middle)
        }

        s = s.replaceAll(regp, `${repPre}$1${repPost}`)
        strArray[i]=s;
     }
  else {
      let middle = strArray.match(regp)
      if (middle){
          console.log("a match!!")
          console.log(middle)
      }
      // console.log("replacing with:")
      // console.log(`${repPre} XXX ${repPost}`)

      strArray = strArray.replaceAll(regp, `${repPre}$1${repPost}`)
  }

  console.log('done')
 return strArray;
}
