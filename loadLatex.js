function setupEquationBlock(tex)
{
    tex = createP();
    tex.style('font-size', '12px');
    tex.position(50, height-350);

    // let linkStr = String.raw`\htmlClass{EQDIV}{\href{https://katex.org/}{\KaTeX}} other`
    let simpleOptions = {
        trust:true,
    }
    katex.render(eqStr, tex.elt,simpleOptions)


    // attach color-class specific mouseOver functions

    let redEq = selectAll('.CRClass',tex);
    console.log(redEq)
    redEq.forEach( (eq) =>{
        eq.mouseOver(eigOverFn)
        eq.mouseOut(eigOutFn)
    });

    let dynEq = selectAll('.CYClass',tex);
    console.log(dynEq)
    dynEq.forEach( (eq) =>{
        eq.mouseOver(dynOverFn)
        eq.mouseOut(dynOutFn)
    });

    let initEq = selectAll('.CLClass',tex);
    initEq.forEach( (eq) =>{
        eq.mouseOver(x0OverFn)
        eq.mouseOut(x0OutFn)
    });

     let xtEq = selectAll('.XTClass',tex);
    xtEq.forEach( (eq) =>{
        eq.mouseOver(xtOverFn)
        eq.mouseOut(xtOutFn)
    });

    let realEq = selectAll('.RealClass',tex);
    realEq.forEach( (eq) =>{
        eq.mouseOver(realOverFn)
        eq.mouseOut(realOutFn)
    });

    let imagEq = selectAll('.ImagClass',tex);
    imagEq.forEach( (eq) =>{
        eq.mouseOver(imagOverFn)
        eq.mouseOut(imagOutFn)
    });
/*
*/
    return tex;
}
function setupLatexColors(cText,cHigh,cLow,c1,c2,c3)
{
    //automate this with a dictionary: {tag:"CH",color:c1,mouseOverFun:eigMouseOver()}
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

    //old functional def
    //return defStr+"\\newcommand{\\"+macroName+"}[1]{\\textcolor{"+macroColorStr.substring(1)+"}{#1}} \n"

    //twist: add html class in with macro defintion so we can find these later
    return defStr+"\\newcommand{\\"+macroName+"}[1]{\\htmlClass{"+macroName+"Class}{\\textcolor{"+macroColorStr.substring(1)+"}{#1}}} \n"

    //return defStr+String.raw`\\newcommand{\\${macroName}}[1]{\\textcolor{${macroColorStr.substring(1)}}{#1}} \n`
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
//let textRepd = repEachBracket(strArray,findCmdPre,`}`,repCmdPre,`}`);

    //e.g. replace ( \LBC{\CYDef}x\RBC{} with \LBC{\CRDef}x\RBC{} )
//textRepd = repEachBracket(textRepd,findDefPre,'\RBC{}',repDefPre,'\RBC{}');
    textRepd = strArray;
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
