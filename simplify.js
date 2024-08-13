
  const defaultContext = { // defaults for all global variables replaced by local storage as changed
    contextAry:             [],
    contextIdx:             0,
    previousPrompts:        "",  previousPromptsHeight:        "2em",
    repeatingContext:       "",  repeatingContextHeight:       "1em",
    currentContext:         "",  currentContextHeight:         "2em",
    sourceText:             "",  sourceTextHeight:             "6em",
    currentChunk:           "",  currentChunkHeight:           "4em",
    simplifiedChunk:        "",  simplifiedChunkHeight:        "4em",
    combinedSimplifiedText: "",  combinedSimplifiedTextHeight: "8em",
    chunkSize:              500,
    chunkSeparator:         " ",
    chunkTotal:             1,    // ( length / chunkSize )
    chunkCount:             0,   
    model:                  "gpt=3.5-turbo",
    endpoint:               "",
    isMarkChunk:            true,
    isShowSizes:            false,
    bufferTitle0:           "",
    bufferTitle1:           "",
    bufferTitle2:           "",
    bufferTitle3:           "",
    bufferTitle4:           "",
    bufferTitle5:           "",
    bufferTitle6:           "",
    bufferTitle7:           "",
    bufferTitle8:           "",
    bufferTitle9:           "",
    buffers:                0,
    buffer0:                "",  buffer0Height: "6em",
    buffer1:                "",  buffer1Height: "6em",
    buffer2:                "",  buffer2Height: "6em",
    buffer3:                "",  buffer3Height: "6em",
    buffer4:                "",  buffer4Height: "6em",
    buffer5:                "",  buffer5Height: "6em",
    buffer6:                "",  buffer6Height: "6em",
    buffer7:                "",  buffer7Height: "6em",
    buffer8:                "",  buffer8Height: "6em",
    buffer9:                "",  buffer9Height: "6em",
    bufferToggle0:          true,
    bufferToggle1:          true,
    bufferToggle2:          true,
    bufferToggle3:          true,
    bufferToggle4:          true,
    bufferToggle5:          true,
    bufferToggle6:          true,
    bufferToggle7:          true,
    bufferToggle8:          true,
    bufferToggle9:          true,
    logItems:               0,
    bottom:                 false,
    dragables: {
      log:      {  width:  400,  height: 600,  top: 10,  left:  10 },
      settings: {  width:  400,  height: 600,  top: 20,  left:  20 },
      diff:     {  width:  800,  height: 300,  top: 40,  left:  40 },
      batch:    {  width:  400,  height: 300,  top: 40,  left:  40 },
      help:     {  width:  800,  height: 300,  top: 40,  left:  40 },
      sash:     {  width:   10,  height: 100,  top:  0,  left: 300 }
    },
    models:                 []
  } 
  let context = {};
  
// The following info is found at: openai.com/api/pricing
  let defaultModels = [ // known models their compatabilities and prices
    { model: "ada"                         , target: "",      input: "$0.00010   ", output: "$0.00010  ", units: "1k", asOf: "7/22" }, 
    { model: "babbage"                     , target: "",      input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" }, 
    { model: "babbage-002"                 , target: "",      input: "$0.00040   ", output: "$0.00040  ", units: "1k", asOf: "7/22" },
    { model: "curie"                       , target: "chat",  input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" }, 
    { model: "davinci"                     , target: "",      input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" }, 
    { model: "davinci-002"                 , target: "",      input: "$0.0020    ", output: "$0.0020   ", units: "1k", asOf: "7/22" },
    { model: "gpt-3.5-turbo"               , target: "chat",  input: "$0.0030    ", output: "$0.0030   ", units: "1k", asOf: "" }, 
    { model: "gpt-3.5-turbo-0125"          , target: "chat",  input: "$0.00050   ", output: "$0.00150  ", units: "1k", asOf: "7/22" },
    { model: "gpt-3.5-turbo-0301"          , target: "chat",  input: "$0.00150   ", output: "$0.0020   ", units: "1k", asOf: "" },
    { model: "gpt-3.5-turbo-0613"          , target: "chat",  input: "$0.00150   ", output: "$0.0020   ", units: "1k", asOf: "" }, 
    { model: "gpt-3.5-turbo-1106"          , target: "chat",  input: "$0.0010    ", output: "$0.0020   ", units: "1k", asOf: "7/22" },
    { model: "gpt-3.5-turbo-16k"           , target: "chat",  input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" },
    { model: "gpt-3.5-turbo-16k-0613"      , target: "chat",  input: "$0.0030    ", output: "$0.0040   ", units: "1k", asOf: "7/22" }, 
    { model: "gpt-3.5-turbo-instruct"      , target: "chat",  input: "$0.00050   ", output: "$0.0020   ", units: "1k", asOf: "7/22" },
    { model: "gpt-3.5-turbo-instruct-0914" , target: "chat",  input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" },
    { model: "gpt-4"                       , target: "chat",  input: "$0.030     ", output: "$0.060    ", units: "1k", asOf: "7/22" }, 
    { model: "gpt-4-0125-preview"          , target: "chat",  input: "$0.010     ", output: "$0.030    ", units: "1k", asOf: "7/22" },
    { model: "gpt-4-0613"                  , target: "chat",  input: "$0.010     ", output: "$0.01     ", units: "1k", asOf: "" }, 
    { model: "gpt-4-1106-preview"          , target: "chat",  input: "$0.010     ", output: "$0.030    ", units: "1k", asOf: "7/22" },
    { model: "gpt-4-32k"                   , target: "chat",  input: "$0.060     ", output: "$0.120    ", units: "1k", asOf: "7/22" }, 
    { model: "gpt-4-32k-0613"              , target: "chat",  input: "$0.060     ", output: "$0.120    ", units: "1k", asOf: "" }, 
    { model: "gpt-4-32k-0314"              , target: "chat",  input: "$0.060     ", output: "$0.120    ", units: "1k", asOf: "" }, 
    { model: "gpt-4-turbo"                 , target: "chat",  input: "$0.010     ", output: "$0.030    ", units: "1k", asOf: "7/22" },
    { model: "gpt-4-turbo-2024-04-09"      , target: "chat",  input: "$0.010     ", output: "$0.030    ", units: "1k", asOf: "7/22" },
    { model: "gpt-4-turbo-preview"         , target: "chat",  input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" },
    { model: "gpt-4o"                      , target: "chat",  input: "$0.0050    ", output: "$0.0150   ", units: "1k", asOf: "7/22" },
    { model: "gpt-4o-2024-05-13"           , target: "chat",  input: "$0.0050    ", output: "$0.0150   ", units: "1k", asOf: "7/22" },
    { model: "gpt-4o-mini"                 , target: "chat",  input: "$0.000150  ", output: "$0.00060  ", units: "1k", asOf: "7/22" },
    { model: "gpt-4o-mini-2024-07-18"      , target: "chat",  input: "$0.000150  ", output: "$0.00060  ", units: "1k", asOf: "7/22" },
    { model: "text-ada-001"                , target: "chat",  input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" }, 
    { model: "text-babbage-001"            , target: "chat",  input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" }, 
    { model: "text-curie-001"              , target: "chat",  input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" }, 
    { model: "text-davinci-001"            , target: "chat",  input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" }, 
    { model: "text-davinci-002"            , target: "chat",  input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" }, 
    { model: "text-davinci-003"            , target: "chat",  input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" }, 
    { model: "text-embedding-3-large"      , target: "embed", input: "$0.00013   ", output: "$0.00013  ", units: "1k", asOf: "7/22" },
    { model: "text-embedding-3-small"      , target: "embed", input: "$0.00002   ", output: "$0.00002  ", units: "1k", asOf: "7/22" },
    { model: "text-embedding-ada-002"      , target: "embed", input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" },
    { model: "tts-1"                       , target: "audio", input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" },
    { model: "tts-1-1106"                  , target: "audio", input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" },
    { model: "tts-1-hd"                    , target: "audio", input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" },
    { model: "tts-1-hd-1106"               , target: "audio", input: "$0.01      ", output: "$0.01     ", units: "1k", asOf: "" }
  ];  

  let validModels     = [];
  let machineState    = "";
  let previousState   = "";
  let machineStateAll = "";
  let isContinue      = false; 
  let candidate       = "";
  
  // references to oft used DOM elements
    let repeatingContextObj       = {};
    let currentContextObj         = {};  
    let sourceTextObj             = {};
    let currentChunkObj           = {};
    let simplifiedChunkObj        = {};
    let combinedSimplifiedTextObj = {};
  
  let dummy       = [];
  let fileContent = []; 
  let fileNames   = [];
  

  let cost = {
    input:  0,
    output: 0,
  }
  
  function addDot() {                                /** Proof of life while processing */
    var err = document.getElementById( 'chatError' )
    err.innerText += ".";
  }

  function assessCost( bufr, rep, fin ) {            /** Compute cost of input tokens using current model and passed text */
    var rptCost = "";
    var thisModel, atr, tokens, price, costParm, cost;

    if( rep ) {          // include repeating context in cost
      rptCost = repeatingContextObj.value;
    }

    var srcCost = $( bufr ).val();
   
    if( fin ) {
      atr = "output";
    } else {
      atr = "input";
    }
    
    thisModel = context.model;
    tokens = String( ( ( srcCost.length ??= 0 ) + ( rptCost.length ??= 0 ) ) / 4 );
    costParm = context.models.find( ( { model } ) => model == thisModel );
    
    if( costParm ) {
      cost = parseFloat( costParm.input.replace( "$", "" ) );

    
      if( context.contextAry.length > 1 ) { // multiply by number of prompts
        tokens = tokens *= context.contextAry.length;
      } 
    
      price = Number.parseFloat( ( tokens * cost ) / 1000  ).toFixed( 6 );
      return [ tokens, price ];
    } else {
      return [ tokens, 0 ];
    }
  }

  function bufferToggle( idx, val ) {                /** Toggle textarea visibility */
    $( "#buffer" + idx ).toggle();
    saveContext( "bufferToggle" + idx, val.checked );
  }
  
  function cancel() {                                /** Stop processing at end of current chunk and prepare to restart */                           
    markState( "Canceling" );
    startStop( "play pause next redo cancel", "" );
    setError( "" );
  }
  
  function cancelAll() {                             /** Stop processing at end of current file and prepare to restart */                           
    markState( "Canceling" );
    startStopAll( "play next", "pause cancel" );
    setError( "" );
  }

  function clearChunks( string ) {                   /** Clear out a list of text areas before processing further */ 
    var list = string.split( " " );

    for( var itm in list ) {
      $( "#" + list[ itm ] ).val( "" );
      context[ itm ] = ""; 
    }
  }

  function clearLog() {                              /** Empty log content but leave it displayed */
    $( '#eventLogBody' ).html( "" );
  }
 
  function completePrev() {                          /** Before moving to next step, save results of previous after a pause */
    currentChunkObj.value = context.currentChunk;
    var [ tokens, price ] = assessCost( "#currentChunk", true, false );
    var [ oTokens, oPrice ] = assessCost( "#simplifiedChunk", false, true );
    toast( `Completed chunk: ${context.chunkCount} with ${tokens} input tokens at cost ${price} 
            plus ${oTokens} output tokens at ${oPrice}.`, "Progress" );
    document.getElementById( "chunksComplete").innerText = context.chunkCount;
    context.sourceText = context.sourceText.substring( context.currentChunk.length + 1 );
    sourceTextObj.value = context.sourceText;
    
    if( candidate.length > 1 ) {
      combinedSimplifiedTextObj.value += candidate;
      context.combinedSimplifiedText += candidate
      candidate = "";
    }          
  }

  $( document ).ready( function() {                  /** Things that cannot happen until document is fully loaded */ 
    // make some windows dragable
      dragElement(  document.getElementById( "help"     ) );
      dragElement(  document.getElementById( "log"      ) );
      dragElement(  document.getElementById( "settings" ) );
      dragElement(  document.getElementById( "diff"     ) );
      dragElement(  document.getElementById( "batch"    ) );
//    dragElement(  document.getElementById( "sash"     ) );
    
    repeatingContextObj        = document.getElementById( "repeatingContext"       ); 
    currentContextObj          = document.getElementById( "currentContext"         );
    sourceTextObj              = document.getElementById( "sourceText"             );    
    currentChunkObj            = document.getElementById( "currentChunk"           );
    simplifiedChunkObj         = document.getElementById( "simplifiedChunk"        );
    combinedSimplifiedTextObj  = document.getElementById( "combinedSimplifiedText" );
   
    init();

    $( '.dragable' ).on( 'click', toHigher );
    $( '.textBox'  ).on( 'mouseup', function() { scanSizes(); } ); 
  } ) 
    
  function estimateCost() {                          /** Display estimated cost of input tokens using current model and source text */
    if( context.model.length > 0 ) {
      var [ tokens, price ] = assessCost( '#sourceText', true, false );
      $( '#inputTokens' ).text( tokens );   
      $( '#inputCost' ).text( price )  ; 

      var [ otokens, oprice ] = assessCost( '#sourceText', false, true );
      $( '#outputTokens' ).text( otokens );   
      $( '#outputCost' ).text( oprice )  ; 
      $( '#totalCost' ).text( ( parseFloat( price ) + parseFloat( oprice ) ).toFixed( 6 ) );
    } else {
      toast( "No model selected. Select model", "Fault" );
    }
  }

  async function getContext() {                      /** Retrieve variables from local storage update UI */    
    let storedContext = {};
    context = JSON.parse( JSON.stringify( defaultContext ) );
    context.models = defaultModels;
    let contextString = await localStorage.getItem( "openAiContext" );
   
    if( contextString ) {
      storedContext = JSON.parse( contextString ); 

      for( var attr in defaultContext ) {  // copy from saved context to current context. hint saved may not have all current values
        if( storedContext.hasOwnProperty( attr ) ) {
          context[ attr ] = storedContext[ attr ];
        }
      }

      for( mod in storedContext.models ) {
        if( storedContext.models.hasOwnProperty( mod ) ) {
          context.models[ mod ] = storedContext.models[ mod ];
        }
      }
    }

    for( bIdx = 0; bIdx < 10; bIdx += 1 ) {
      $( "#b" + bIdx ).show();
    }

    for( var attr in context ) {  // Copy from current context to form  
      if( context.hasOwnProperty( attr ) && ( attr.indexOf( "Height" ) < 0 ) ) {      
        switch( attr ) {
          case "chunkSize":
            document.getElementById( "chunkSizeValue" ).innerText = context.chunkSize;
            document.getElementById( attr ).value = context[ attr ];
            break;
          
          case "chunkSeparator":
            $( "#" + attr ).val( context.chunkSeparator ) /*.change()*/ ;
            break;
            
          case "currentContext":
            // make context pipeline
              context.contextAry = context.repeatingContext.replace( /\n/g, "" ).split( "---" );
              context.contextIdx = 0;
            
            // get first one and show it if in pipeline
              context.currentContext = context.contextAry[ 0 ];
              document.getElementById( attr ).value = context.currentContext;
            break;
            
          case "isMarkChunk":  
            document.getElementById( "isMarkChunk" ).checked   = context.isMarkChunk;
            break;
          
          case "isShowSizes":  
            document.getElementById( "isShowSizes" ).checked   = context.isShowSizes;
            break;
          
          case "dragables":
            for( itm in context.dragables ) {
              for( atr in context.dragables[ itm ] ) {
                $( `#${itm}`).css( atr, context.dragables[ itm ][ atr ] );
              }                
            } 

            break;

          case "contextAry":
          case "contextIdx":
          case "buffers":
          case "chunkCount":
          case "isMarkChunks":
          case "chunkTotal":
          case "endpoint":
          case "logItems":
          case "bottom":
          case "models":
            break;

          case "model":
            $( "#model" ).val( context.model );
            break;
        
          case "bufferTitle0":
          case "bufferTitle1":
          case "bufferTitle2":
          case "bufferTitle3":
          case "bufferTitle4":
          case "bufferTitle5":
          case "bufferTitle6":
          case "bufferTitle7":
          case "bufferTitle8":
          case "bufferTitle9":
            if( context.hasOwnProperty( attr ) ) {
              var ttl = document.getElementById( attr );
              ttl.value = context[ attr ];
              ttl.style.height = context[ attr + "Height" ];  
            }
            break;
            
          case "previousPrompts": // These have height attributes that may change
          case "repeatingContext":
          case "sourceText":
          case "currentChunk":
          case "simplifiedChunk":
          case "combinedSimplifiedText":
          case "buffer0":
          case "buffer1":
          case "buffer2":
          case "buffer3":
          case "buffer4":
          case "buffer5":
          case "buffer6":
          case "buffer7":
          case "buffer8":
          case "buffer9":
            var obj = document.getElementById( attr );
            obj.value = context[ attr ];
            obj.style.height = context[ attr + "Height" ];               
            break;
          
          case "bufferToggle0":
          case "bufferToggle1":
          case "bufferToggle2":
          case "bufferToggle3":
          case "bufferToggle4":
          case "bufferToggle5":
          case "bufferToggle6":
          case "bufferToggle7":
          case "bufferToggle8":
          case "bufferToggle9":
            var idx = attr.slice( -1 );
            $( "#" + attr ).prop( "checked", context[ attr ] ).change();  
            $( "#buffer" + idx ).css( "display", context[ attr ] ? "inline" : "none" );   
            break;
            
          default:
            toast( `Getting: ${attr}`, 'Progress' );
            
            if( document.hasOwnProperty( attr ) ) {
              document.getElementById( attr ).value = context[ attr ];
            } else {
              toast( `GetContext: Unsupported property: '${attr}' found in localStorage. Ignoring.`, 'Fault' );
            }
        }
      }
    }      
    
    localStorage.setItem( "openAiContext", JSON.stringify( context ) );
  }

  function getModels() {                             /** Retrieve chatgpt supported models */ 
    const subscriptionKey = "Bearer " + localStorage.getItem( "openAiKey" );
    const endpoint = 'https://api.openai.com/v1/models';
    var valid = [];

    fetch( endpoint, {
      mode:      "cors",
      headers: { "Authorization": subscriptionKey }
    } )
    
    .then( response => response.json() )
    .then( obj => {
      obj.data.map( item => validModel( item.id ) );   
      validModels.sort();
      document.getElementById( "model" ).innerHTML = validModels.join( "\n" );
      $( "#model" ).val( context.model ); // select default model
      initModels();
      estimateCost();
      }
    )
    .catch( error => {
      console.error( error );
      setError( error );
    });
  }
  
  function init() {                                  /** Configure app at startup */
    markState( "Initializing" );
    getContext();       // override all defaults with saved data
    getModels();        // set default model
    markState( "Idling" );
    startStop( "play next", "pause redo cancel" );
//    setCopies();
  }
  
  function initBatch( id ) {                         /** Begin processing files in batch pipeline */
    toggle( id );
    
    if( $( '#textFile' ).val().length > 0 ) {
      startStopAll( "play next", "pause cancel" );
    } else {
      startStopAll( "", "play next pause cancel" );
    }
    
    setProgress( "fileProgress", 0 );
  }
  
  function initModels() {                            /** Get valid openai models */
    var mdlAry = [];
    var mdlIdx = 0;

    for( itm in context.models ) { // build table of default models
      mdlAry.push( 
        `<tr>
           <td>                                                               ${context.models[mdlIdx].model} </td> 
           <td> <input type='text' name='${mdlIdx}-target' class='edt' value='${context.models[mdlIdx].target}'> </td> 
           <td> <input type='text' name='${mdlIdx}-input'  class='edt' value='${context.models[mdlIdx].input}'  > </td> 
           <td> <input type='text' name='${mdlIdx}-output' class='edt' value='${context.models[mdlIdx].output}'  > </td> 
         </tr>` );
        mdlIdx += 1;
    }

    document.getElementById( "modelSettingsBody" ).innerHTML = mdlAry.join( "\n" );
    
    $( '.edt' ).on( "change", function() { 
      var itm = this.value;
      var [row, id] = this.name.split( "-" );
      context.models[row][id] = itm;
      estimateCost();
    } );
  }

  function initStepper() {                           /** Set up the first chunk */
    candidate = "";
    context.contextIdx = 0;
    context.currentContext = context.contextAry[ context.contextIdx ];
    currentContextObj.value = context.currentContext;
    isContinue = true;
    toast( "Init Stepper.", "Progress" );
    startStop( "cancel pause", "play next redo" );
    resetChunks();
  }

  async function loadFile( files ) {                 /** Capture list of files, download them and list in textarea */
//    var tgt = document.getElementById( 'textFile' );
//    var fn = document.getElementById( 'fileName' );
    
    for( fleIdx = 0; fleIdx < files.length; fleIdx += 1 ) {
      var txt = await files[ fleIdx ].text() ;
      $( "#textFile" ).append( files[ fleIdx ].name + "\n" );
      fileContent.push( txt );
      fileNames.push( files[ fleIdx ].name )
    }
    
    startStopAll( "play next", "pause cancel" );
  }

  function markState( txt ) {                        /** Set overall machine state to control action buttons */
    previousState = machineState;
    machineState = txt;
    toast( txt, "Progress" );
  }
  
  function markStateAll( txt ) {                     /** Set overall machine state to control action buttons */
    machineStateAll = txt;
    toastWhere( "#toasterAll", txt, "Progress" );
  }

  function next() {                                  /** Resume processing next chunk or begin single stepping first chunk */
    markState( "Stepping" );
    setError( "" );
    startStop( "pause cancel", "play next redo" );

    if( ! isContinue ) {
      initStepper();
      simplifyProcess();    
    } else {
      completePrev();
    }
  }
   
  function nextAll() {                               /** Resume processing next file or begin single stepping from first file */
    markStateAll( "Stepping" );
    setError( "" );
    startStopAll( "pause cancel", "play next" );

    if( ! isContinue ) {
      initStepper();
      simplifyProcess();    
    }
  }
   
  function nextStep() {                              /** Set up the next chunk */
    toast( "Next Step.", "Progress" );
    document.getElementById( "chunksComplete" ).innerText = context.chunkCount;
    context.chunkCount += 1;

    let pos = context.sourceText.split( " ", context.chunkSize ).join( " " ).length;

    if( pos < 0 ) {  // if no delimiter then send whole chunk
      context.currentChunk = context.sourceText;
    } else {
      context.currentChunk = context.sourceText.substring( 0, pos );        
    }
   
    let separatorPosition = context.currentChunk.lastIndexOf( context.chunkSeparator );

    if( separatorPosition >= 0 ) { // backup to separator
      context.currentChunk.substring( 0, separatorPosition );
    }
    
    currentChunkObj.value = context.currentChunk;
  }

  function pause() {                                 /** Interrupt simplification */
    markState( "Pausing" );
    startStop( "play cancel next redo", "pause" );
    setError( "" );
  }
  
  function pauseAll() {                              /** Interrupt simplification file list processing */
    markStateAll( "Pausing" );
    startStopAll( "play cancel next", "pause" );
//    setError( "" );
  }
  
  function persist() {                               /** Save context in local storage */
    localStorage.setItem( "openAiContext", JSON.stringify( context ) );
  }
 
  function play() {                                  /** Start or resume simplification */
    markState( "Playing" );
    startStop( "pause cancel", "play redo next" );
    setError( "" );

    if( ! isContinue ) {
      initStepper();
      showCurrentContext();
      simplifyProcess();
    }    
  }
  
  async function playAll() {                         /** Initiate or resume processing of all files in batch list */
    var fileCount = 0;
    document.getElementById( "filesComplete" ).innerText = fileCount;
    
    for( fileIdx in fileNames ) {
      isLooping = true;
      fileCount += 1;
      toastWhere( "#toasterAll", `Processing: ${fileNames[ fileIdx ]}.`, "Progress" );
      
      if( fileContent[ fileIdx ].length > 0 ) {
        $( '#sourceText' ).val( fileContent[ fileIdx ] );
        startStopAll( "pause cancel", "play next" );
        play();
        
        while( isLooping ) {
          switch( machineState ) {
            case "Idling":
              saveAsFile( fileIdx );
              isLooping = false;
              break;
            
            case "Completing":
//              isLooping = false;
              break;
              
            case "Stepping":
              saveAsFile( fileIdx );
              markStateAll( "Pausing" );
              startStopAll( "play next cancel", "pause" );
              break;
              
            case "Pausing": // just hang out
              break;
              
            case "Canceling":
              isContinue = false;
              isLooping = false;
              break;            
          }
          
          await sleep( 2000 );
        }
      }
      
      document.getElementById( "filesComplete" ).innerText = fileCount;
      setProgress( "fileProgress", parseInt( ( ( fileCount / fileNames.length ) ) * 100 ) );
      toastWhere( '#toasterAll', `Completed file: ${fileNames[fileCount - 1]}`, 'Progress' )
//    document.getElementById( "fileNumber" ).innerText = fileIdx + 1;

    }

    switch( machineStateAll ) {
      case "Idling":
        $( '#fileName' ).text( `Processing Complete.` );
        toastWhere( "#toasterAll", `Completed batch processing after ${fileCount} files.`, "Complete" );
        break
        
      case "Canceling":
        $( '#fileName' ).text( `Processing canceled.` );
        toastWhere( "#toasterAll", `Interrupted batch processing after ${fileCount} files.`, "Complete" );
        break;            
    }
  }
  
  async function processStep() {                     /** Call chatgpt with request and wait for response */
    showSizes();
    toast( `Simplifying chunk: ${context.chunkCount} of  ${context.chunkTotal} chunks.`, "Progress" );   
    document.getElementById( "chunkNumber" ).innerText = context.chunkCount;
    setProgress( "chunkProgress", parseInt( ( ( context.chunkCount - 1 ) / context.chunkTotal ) * 100 ) );
    
    await simplifyText( context.currentChunk, context.chunkCount );  
  }
  
  function redo() {                                  /** Reprocess current chunk. do not advance to next */                          
    markState( "Redoing" );
    clearChunks( "simplifiedChunk" );    
    startStop( "pause cancel", "play next redo" );
    setError( "" );
  }
  
  function removeLocalStorage() {                    /** Confirm user wants to reset app to initial conditions (keeping API key) */
    if( window.confirm( "Warning: This will remove all locally stored data and and reset to default values except API Key." ) ) {
      localStorage.removeItem( 'openAiContext' );
      sleep( 1000 );
      context = [];
      init();
      toast( "Reset", "Complete" );
    } else {
      toast( "Reset", "Canceled" );
    }
  } 

  function resetChunks() {                           /** Initialize buffers and counters for processing */
    clearChunks( "currentChunk simplifiedChunk combinedSimplifiedText" );
    context.sourceText = sourceTextObj.value;
    context.chunkTotal = parseInt( ( context.sourceText.split( " " ).length / context.chunkSize ) + 1 );
    context.chunkCount = 0;
    setProgress( "chunkProgress", 0 );
    document.getElementById( "chunksComplete" ).innerText = 0;
    context.currentChunk = "";
  }
  
  function saveAsFile( idx ) {                       /** Use idx to find file name then download combined */
    var txt = $( '#target'  ).val();
    var pat = $( '#pattern' ).val();
    var f1 = fileNames[ idx ];
    var pos = f1.lastIndexOf( "." );
    var ext = f1.slice( pos );
    var base = f1.slice( 0, pos );
    var path = /*dir +*/ base + pat + ext;
    var blob = new Blob( [ txt ], { type: 'text/plain' } );
    
	  var a = document.createElement( 'a' );
    a.download = path
    a.href = window.URL.createObjectURL( blob );
    a.textContent = 'Download ready';
    a.style='display:none';
    a.click();    
    toast( `Save file as: ${path}`, "Progress" );    
  }
  
  function saveContext( attr, val ) {                /** Save all persistent variables in localstorage */    
    markState( "Saving" );
    toast( `SaveContext: ${attr}`, "Progress" );

    if( attr ) {
      switch( attr ) {  
        case "chunkSize":
          document.getElementById( "chunkSizeValue" ).innerText = val;           // this is a span
          break;
        
        case "chunkSeparator":
          context.chunkSeparator = $('#chunkSeparator').find(":selected").val(); // select drop down
          break;
          
        case "diff": 
        case "log": 
        case "batch": 
        case "settings":  
        case "help":
          break;
          
        case "model":
          context.model = $( '#model' ).val();                                   // select drop down
          break;

        case "repeatingContext":
          context.repeatingContext = repeatingContextObj.value       // textarea  
          context.contextAry = context.repeatingContext.replace( /\n/g, "" ).split( "---" );
          context.contextIdx = 0
          currentContextObj.value = context.contextAry[ context.contextIdx ]
          showCurrentContext();
          break;
          
        case "sourceText":
          startStop( "play next", "pause cancel redo" );
          break;

        default:
          if( attr.slice( 0, -1 ).indexOf( "bufferToggle" ) >= 0 ) {
            context[ attr ] = val;
          } else {
            if( document.hasOwnProperty( attr ) ) {
              document.getElementById( attr ).value = val; // normal context attributes
              context[ attr ] = val;
            } else {
              toast( `No longer such a property as: ${attr}. Ignoring.`, 'Fault' );
            }
          }
      }
      
      estimateCost();
      context[ attr ] = val;
      scanSizes();    
      showSizes();      
      markState( "Saved" );
    }
  }
        
  function scanSizes() {                             /** Look for resized textareas and save them in context */    
    $( '.resizable' ).each( function( id ) {
      var tElem = this[ 'id' ];
      var h = document.getElementById( tElem );
      context[ tElem + "Height" ] = h.style.height;
      persist();
    } );

   }
  
  async function scrapeModel() {
    await fetch( 'https://platform.openai.com/docs/models', { method: "GET",  mode: "no-cors" } )
    .then( response => response.json() ) 
    .then( data => {       // got a response.. but wait there may be more
      var res = data.error;

      if( res ) {
        toast( `Error: ${JSON.stringify( res.message )}`, "Fault" );
        setError( res.message.slice( 0, 60 ) + "... See Log." );
        cancel();
      } else {
        var dta = data.choices[0].message.content;
      }
    });
  }
  
  function setCopies() {
    setCopy( "orgBuffer" );
    setCopy( "changedBuffer" );
  }
  
  function setCopy( id ) {
    var val = $( `#${id}` ).find( 'option:selected' ).text();
    $( `#${id}Selection` ).html( val );
  }
  
  function setError( txt ) {                         /** Put some exception text near app state for a few seconds */
    document.getElementById( 'chatError' ).innerText = txt;
    
    if( txt.length > 0 ) {
      toast( txt, "Fault" );
    
      setTimeout( function(){ // After 5 seconds, remove the show class from DIV
        document.getElementById( 'chatError' ).innerText = ""; 
      }, 10000 );
    }
  }
   
  function setKey() {                                /** Save secret chatgpt key in localstorage */    
     var retVal = prompt("Enter your OpenAI API Key: ", "your key here" );
     
     if( retVal.length > 20 || retVal.indexOf( "your key here" ) < 0 ) {
       localStorage.setItem( "openAiKey", retVal );
     }
  }
  
  function setProgress( bar, pct ) {                 /**  */
    var cur = document.getElementById( bar );
    cur.value = pct;
  }
  
  function showCurrentContext() {                    /** Only show current context if repeatingcontext specifies a pipeline */
    if( context.contextAry.length > 1 ) {
      $( "#currentContextScope" ).show();
    } else {
      $( "#currentContextScope" ).hide();
    }  
  }
  
  function showSizes() {                             /** Keep the sizes as well as content of buffers */
    var bufferNames = [ 
        "sourceText", "repeatingContext", "currentContext", "currentChunk", "simplifiedChunk", 
        "combinedSimplifiedText",
        "buffer0", "buffer1", "buffer2", "buffer3", "buffer4", 
        "buffer5", "buffer6", "buffer7", "buffer8", "buffer9" 
    ];
    
    for( bufId in bufferNames ) {
      var bufName = "#" + bufferNames[ bufId ];
      var bufTxt =   "";
      
      if( context.isShowSizes && context.isShowSizes.indexOf( "on" ) >= 0 ) {
        var bufLen =  $( bufName ).val().length;
        
        if( bufLen > 0 ) {
          bufTxt = " (" + bufLen + "b)";
        }
      }
      
      $( bufName + "Size" ).text( bufTxt );
    }
  }

  async function simplifyProcess() {                 /** Walk through the source text breaking off chunks and sending them to chatgpt */    
    toast( `Simplifying: ${machineState} with ${context.model}`, "Progress" );
    
    while( isContinue ) {
      switch( machineState ) {
        case "Initing":
          break;
        
        case "Saved":          // happens if you toggle buffers while processing
          markState( previousState );
          break;
          
        case "Idling":
          break;

        case "Stepping":
          if( context.sourceText.length > 0 ) {
            nextStep();
            await processStep();
            markState( "Pausing" );
          } else {
            markState( "Completing" );
            isContinue = false;
          }
          break;
          
        case "Pausing":
          startStop( "play next redo cancel", "pause" );  
                              // we get here every couple seconds but otherwise do nothing           
          break;
        
        case "Playing":
          setError( "" );
         
          if( context.chunkCount > 0 ) {
            completePrev();
          }

          if( context.sourceText.length > 0 ) {
            nextStep();
            await processStep();
          }else {                              // at end so check for continuation prompt
            if( context.contextAry.length > 1 &&
                context.contextIdx < ( context.contextAry.length - 1 ) ) {
              context.contextIdx += 1;
              context.currentContext = context.contextAry[ context.contextIdx ];
              currentContextObj.value = context.currentContext;
              
              context.combinedSimplifiedText = combinedSimplifiedTextObj.value; 
              context.sourceText = context.combinedSimplifiedText;
              sourceTextObj.value = context.sourceText; 
              
              resetChunks();
//              context.combinedSimplifiedText = "";
//              combinedSimplifiedTextObj.value = "";
            } else {
              markState( "Completing" );
              isContinue = false;
            }
          }
          break        
          
        case "Redoing":
          await processStep();
          markState( "Pausing" );
          break;
          
        case "Canceling":
          isContinue = false;
          break;
      }
        
      await sleep( 3000 ); // throttle ai process to one call per second and check status once per second
      addDot(); 
    }
    
    switch( machineState ) {
      case  "Canceling":
        toast( "Canceled", "Complete" );
        setError( "Canceled" );
        break;
        
      default:
        isContinue = false;
        startStop( "", "play pause next redo cancel" ); 
        toast( "End of Text.", "Complete" );
        setProgress( "chunkProgress", 100 );
    }
    
    if( context.contextAry.length > 1 &&
        context.contextIdx < ( context.contextAry.length - 1 ) ) {
      context.contextIdx += 1;
      currentContextObj.value = context.contextAry[ context.contextIdx ]; 
    } else {
      startStop( "play next", "pause redo cancel" );
      showSizes();
      await sleep( 1000 );
      markState( "Idling" );
    }
  }

  async function simplifyText( text, chunkCount ) {  /** Invoke chat-gpt */
    var resp = "";

    if( context.model == null ) {
      toast( "No model selected. First select a model", "Fault" );
      return;
    }

    const subscriptionKey = "Bearer " + localStorage.getItem( "openAiKey" );
    const endpoint = 'https://api.openai.com/v1/chat/completions';
 
    await fetch( endpoint, {
      method:   "POST",
      mode:     "cors",
      headers:  {
        "Content-Type":  "application/json",      
        "Authorization": subscriptionKey
      },
      "body":            JSON.stringify( {
        "model":         context.model,
        "temperature":   Number( $( '#temperature' ).val() ), // default to 0.2
        "messages": [ {
           "role":       "user", 
           "content":    context.currentContext + " " + text
         } ] 
       } )
    } )
    .then( response => response.json() ) 
    .then( data => {       // got a response.. but wait there may be more
      var res = data.error;

      if( res ) {
        toast( `Error: ${JSON.stringify( res.message )}`, "Fault" );
        setError( res.message.slice( 0, 60 ) + "... See Log." );
        cancel();
      } else {
        var sep = "\n";
      
        if( context.isMarkChunk ) {
          sep = "\n\n---" + chunkCount + "---\n\n";
        }
      
        var dta = data.choices[0].message.content;
        simplifiedChunkObj.value = dta;
        document.getElementById( "simplifiedChunkNumber" ).innerText = chunkCount;
        candidate = sep + dta;
      }
    } )
    .catch( error => {
      setError( `simplifyText: ${error.message}`, "Fault" );
    });  
  }
    
  function sleep( ms ) {                             /** Suspend processing for some time */    
    return new Promise( resolve => setTimeout( resolve, ms ) );
  }
  
  function startStop( buttonStart, buttonStop ) {    /** Turn on and off sets of action buttons */
    if( buttonStart != "" ) {
      var startList = "#" + buttonStart.trim().split( " " ).join( ", #" );
      $( startList ).removeClass( "disabled-button" );
    }
    
    if( buttonStop != "" ) {
      var stopList = "#" + buttonStop.trim().split( " " ).join( ", #" );
      $( stopList ).addClass( "disabled-button" );
    }
  }
  
  function startStopAll( buttonStart, buttonStop ) { /** Turn on and off sets of action buttons */
    if( buttonStart != "" ) {
      var startList = "#all-" + buttonStart.trim().split( " " ).join( ", #all-" );
      $( startList ).removeClass( "disabled-button" );
    }
    
    if( buttonStop != "" ) {
      var stopList = "#all-" + buttonStop.trim().split( " " ).join( ", #all-" );
      $( stopList ).addClass( "disabled-button" );
    }
  }
  
  function toggle( divId ) {                         /** Toggle div visibility */
    $( divId ).toggle();
    toHigh( divId );
  }
  
  function toHigher( e ) {                           /** While rasing to top, persist current size and location  */
    var eObj = e.currentTarget;
    var id   = eObj.id;
    toHigh( "#" + id );
    
    var itm = context.dragables[ id ];
    
    itm.left    = eObj.offsetLeft;    // remember position and size
    itm.top     = eObj.offsetTop; 
    itm.width   = eObj.offsetWidth;
    itm.height  = eObj.offsetHeight;
    
    persist();
  }
  
  function toHigh( id ) {                            /** Move this dragable to top of stack on click */
    console.log( id );
    $( ".dragable" ).each( function() { $( this ).removeClass( "high" ) } )
    $( id ).addClass( "high" );
  }

  function validModel( itm ) {                       /** See if retrived model works with opanai chat */
    for( idx in defaultModels ) {
      if( itm.indexOf( defaultModels[idx].model ) >= 0 ) {
        if( defaultModels[idx].target.indexOf( 'chat' ) >= 0 ) {
          validModels.push( "<option value='" + itm + "' > " + itm + " </option>" );
          return;
        }
      }
    }
  }


  
