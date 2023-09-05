  let defaultContext = {
    repeatingContext: "",  repeatingContextHeight: "1em",
    previousPrompts:  "",  previousPromptsHeight:  "2em",
    sourceText:       "",  sourceTextHeight:       "6em",
    thisChunk:        "",  thisChunkHeight:        "4em",
    simpleChunk:      "",  simpleChunkHeight:      "4em",
    target:           "",  targetHeight:           "8em",
    chunkSize:        500,
    chunkSeparator:   " ",
    chunkCount:       0,
    model:            "gpt=3.5-turbo",
    endpoint:         "",
    isMarkChunk:      true,
    bufferTitle1:     "",
    bufferTitle2:     "",
    bufferTitle3:     "",
    bufferTitle4:     "",
    bufferTitle5:     "",
    bufferTitle6:     "",
    buffers:          0,
    buffer1:          "",  buffer1Height: "6em",
    buffer2:          "",  buffer2Height: "6em",
    buffer3:          "",  buffer3Height: "6em",
    buffer4:          "",  buffer4Height: "6em",
    buffer5:          "",  buffer5Height: "6em",
    buffer6:          "",  buffer6Height: "6em",
    logItems:         0
  }
  
/*
  let models = [ 
   { "chat", "gpt-4" },
     { "chat", "gpt-4-0613" },
     { "chat", "gpt-4-32k" },
     { "chat", "gpt-4-32k-0613" },
     { "chat", "gpt-3.5-turbo" },
     { "chat", "gpt-3.5-turbo-0613" },
     { "chat", "gpt-3.5-turbo-16k" },
     { "chat", "gpt-3.5-turbo-16k-0613 " },
     { ""    , "text-davinci-003" },
     { ""    , "text-davinci-002" },
     { ""    , "text-davinci-001" },
     { ""    , "text-curie-001" },
     { ""    , "text-babbage-001" },
     { ""    , "text-ada-001" },
     { ""    , "davinci" },
     { ""    , "curie" },
     { ""    , "babbage" },
     { ""    , "ada" },
  ];
*/  

  let machineState = "";
  let started = false; 
  let context = {};
  let candidate  = "";
  
/*  
  function cancel() {  // Stop simplification at end of this chunk
    markState( "Cancelling" );
    isCancel = true;
  }
*/  
  
  function cancel() {                                /** Stop processing and prepare to restart */                           
    started = false;
    markState( "Canceling" );
    startStop( "", "play pause next redo cancel" )
  }
  
  function clearChunks( string ) {
    var list = string.split( " " );

    for( var itm in list ) {
      $( "#" + list[ itm ] ).val( "" );
    }
  }

  $( document ).ready( function() {                  /** Things that cannot happen until document is fully loaded */ 
    dragElement( document.getElementById( "help" ) );
    dragElement( document.getElementById( "log" ) );
    init();
  } );

  function getContext() {                            /** Retrieve variables from localstorage */    
    context = defaultContext;
    // dbRead( 'settings', '', '' );
    let contextString = localStorage.getItem( "openAiContext" );
    
    if( contextString ) {
      const storedContext = JSON.parse( contextString );
      
      for( var attr in storedContext ) {  // copy from saved context to current context. hint saved may not have all current values
        if( storedContext.hasOwnProperty( attr ) ) {
          context[ attr ] = storedContext[ attr ];
        }
      }

      for( var attr in context ) {  // Copy from current context to form  
        if( context.hasOwnProperty( attr ) && ( attr.indexOf( "Height" ) < 0 ) ) {      
          switch( attr ) {
            case "chunkSizeValue":
              document.getElementById( attr ).innerText = context.chunkSize;
              break;
            
            case "isMarkChunk":  
              document.getElementById( "isMarkChunk" ).checked   = context.isMarkChunk;
              break;
            
            case "chunkSize":
            case "chunkCount":
            case "isMarkChunks":
            case "model":
              break;
          
            case "previousPrompts": // These have height attributes that may change
            case "repeatingContext":
            case "sourceText":
            case "thisChunk":
            case "simpleChunk":
            case "target":
            case "buffer1":
            case "buffer2":
            case "buffer3":
            case "buffer4":
            case "buffer5":
            case "buffer6":
              var obj = document.getElementById( attr );
              obj.value = context[ attr ];
              obj.style.height = context[ attr + "Height" ];               
              break;
              
            default:
              if( context[ attr ] ) {
                console.log( attr );
                document.getElementById( attr ).value = context[ attr ];
              }
          }
        }
      }      
    }
  }

  function hide( id ) {
    toggle( id );
    context.buffers -= 1;
    
    if( context.buffers < 7 ) {
      $( "#newBuffers" ).show();
    }
  }

  function init() {
    initDb( 'simplify', 'context' );
    getContext();
    markState( "Initializing" );
    markState( "Idling" );
    startStop( "play next", "pause redo cancel" );
  }
  
  function markState( txt ) {                        /** Set overall machine state to control action buttons */
    machineState = txt;
    toast( txt, "Progress" );
  }
  
  function newBuffer() {                             /** Add a buffer to list */
    context.buffers += 1;

    if( context.buffers < 7 ) {
      $( "#b" + context.buffers ).show();
      $( "#newBuffers" ).show();
    } else {
      $( "#newBuffers" ).hide();
    }
  }

  function next() {                                  /** resume processing next chunk */
    markState( "Stepping" );
    
    if( ! started ) {
      simplify();    
    }

    startStop( "cancel", "play pause redo next" );
  }
   
  function pause() {                                 /** interrupt simplification */
    markState( "Pausing" );
    startStop( "cancel", "play pause next redo" );
  }
  
  function play() {                                  /** start or resume simplification */
    markState( "Playing" );

    if( ! started ) {
      simplify();
    }
      
    startStop( "pause cancel", "play redo next" );
  }
  
  function redo() {                                  /** reprocess current chunk */                          
    markState( "Redoing" );
    document.getElementById( "simpleChunk" ).value = "";    
    startStop( "next pause cancel", "play" );
  }
   
  function saveContext( attr, val ) {                /** Save all persistant variables in localstorage */    
    markState( "Saving" );

    if( attr ) {
      switch( attr ) {  
        case "chunkSize":
          document.getElementById( "chunkSizeValue" ).innerText = val; // this is a span
          break;
          
        case "model":
          break;

        default:
          document.getElementById( attr ).value = val; // normal context attributes
      }
      
      scanSizes();
      context[ attr ] = val;
      localStorage.setItem( "openAiContext", JSON.stringify( context ) );
      markState( "Saved" );
    }
  }
        
  function scanSizes() {                             /** Look for resized textareas and save them context */    
    $( '.resizable' ).each( function( id ) {
      var ta = this[ 'id' ];
      var h = document.getElementById( ta );
      context[ ta + "Height" ] = h.style.height;
    } );
  }
 
  
/*  let hist = document.getElementById( "history" );
  localStorage.getItem( "openAiHistory" );
  getModels();
  */
   
/*  function getModels() {                           /** Retrieve chatgpt supported models */ /*
    const subscriptionKey = "Bearer " + localStorage.getItem( "openAiKey" );
    const endpoint = 'https://api.openai.com/v1/models';
    
    fetch( endpoint, {
      mode:      "cors",
      headers: { "Authorization": subscriptionKey }
    } )
    
    .then( response => response.json() )
    .then( obj => 
      document.getElementById( "models" ).innerHTML = 
      obj.data.map( item => "<option value='" + item.id + "' > " + item.id + " </option>" )   
    )
    .catch( error => {
      console.error( error );
    });
  }
  */
  
/*  function pickModel() {                           /** Choose one of the chatgpt supported models */ /*
  }
*/ 
   
  async function simplify() {                        /** Walk through the source text breaking off chunks and sending them to chatgpt */
    //markState( "Playing" );
    started = true;
    let src  = document.getElementById( "sourceText"  );
    clearChunks( "thisChunk simpleChunk target" );
/*  // manage history  
    let hist = document.getElementById( "history" );
    let combined = localStorage.getItem( "openAiHistory" );
    hist.value = combined;
*/    

    srcText = src.value;
//console.log( "|" + srcText + "| ChunkSize: " + context.chunkSize );  
    let chunkN = parseInt( srcText.split( " " ).length / context.chunkSize );
    context.chunkCount = 1;
    let thisChunk = "";
//    document.getElementById( "target" ).value = "";
    let current = document.getElementById( "thisChunk" );
     document.getElementById( "simpleChunk" ).value = "";
     
    while( srcText.length > 0 ) {
      let pos = srcText.split( " ", context.chunkSize ).join( " " ).length;

      if( pos < 0 ) {  // if no delimiter then send whole chunk
        thisChunk = srcText;
      } else {
        thisChunk = srcText.substring( 0, pos );        
      }
     
      let separatorPosition = thisChunk.lastIndexOf( context.separator ).length;

      if( separatorPosition >= 0 ) { // backup to separator
        thisChunk.substring( 0, separatorPosition );
      }
      
      current.value = thisChunk;
      toast( "Simplify chunk: " + context.chunkCount, "Progress" );   
      document.getElementById( "chunkNumber" ).innerText = context.chunkCount;
      document.getElementById( "chunkProgress" ).value = parseInt( ( context.chunkCount / chunkN ) * 100 );
      await simplifyText( thisChunk, context.chunkCount );
      context.chunkCount += 1;
      
      document.getElementById( "thisChunk" ).value = thisChunk;
      srcText = srcText.substring( thisChunk.length + 1 );
      src.value = srcText;
     
      if( machineState.indexOf( "Canceling" ) >= 0 ) {
        startStop( "play next", "pause redo cancel" );
        break;
      }
        
      console.log( "sleeping." );        
      await sleep( 1000 );
      
      if( machineState.indexOf( "Stepping" ) >= 0 ) { // if next then set to pause after 1 loop
        //console.log( "had single stepped" );
        markState( "Pausing" );
      }
      
      while( machineState.indexOf( "Pausing" ) >= 0 ) {  // wait for redo or next 
        startStop( "play next redo cancel", "pause" );             
        await sleep( 2000 );
      }

       
      //markState( "Playing" );
      //console.log( "Processing." );        
       
      if( candidate.length > 10 ) {
        document.getElementById( "target" ).value += candidate;
        candidate = "";
      }
      
/*
      hist.value += "\n" + srcText;
      localStorage.setItem( "openAiHistory", hist.value );
      src.value = ""
*/

    }
    
    toast( "End of Text", "Complete." );   
    startStop( "play next", "pause redo cancel" );
    markState( "Idling" );
  }

  async function simplifyText( text, chunkCount ) {  /** invoke chat-gpt */
    const subscriptionKey = "Bearer " + localStorage.getItem( "openAiKey" );
    //const organizationKey = localStorage.getItem( "openAiOrg" );
    const endpoint = 'https://api.openai.com/v1/chat/completions';
/*    
    const queryParams = '?q=' + encodeURIComponent( text ) + 
        '&count=10&offset=0&mkt=en-us&safesearch=Moderate';
    let model = document.getElementById( "models" );
    selectedModel = model.value;
*/
     
    await fetch( endpoint, {
      method:   "POST",
      mode:     "cors",
      headers:  {
        "Content-Type":  "application/json",      
        "Authorization": subscriptionKey
      },
      "body": JSON.stringify( {
        "model":      "gpt-3.5-turbo", //selectedModel, 
        "temperature": 0.2,
        "messages": [ {
           "role":    "user", 
           "content": context.repeatingContext + " " + text
         } ] 
       } )
    } )
    .then( response => response.json() )
    .then( data => { 
      console.log( "Simplified in target" );    
      var sep = "\n";
      
      if( context.isMarkChunk ) {
        sep = "\n\n---" + chunkCount + "---\n\n";
      }
      
      document.getElementById( "simpleChunk" ).value =   data.choices[0].message.content;
      document.getElementById( "simplifiedNumber" ).innerText = chunkCount;
      candidate = sep + data.choices[0].message.content;
//      document.getElementById( "target" ).value += sep + data.choices[0].message.content; 
    } )
    .catch( error => {
      toast( "simplifyText: " + error.message, "Fault" );
//      document.getElementById( "chatError" ).innerText = error.message;
    });
    
  }
    
  function setKey() {                                /** Save secret chatgpt key in localstorage */    
     var retVal = prompt("Enter your OpenAI API Key: ", "your key here" );
     
     if( retVal.length > 20 || retVal.indexOf( "your key here" ) < 0 ) {
       localStorage.setItem( "openAiKey", retVal );
     }
  }
  
  function startStop( buttonStart, buttonStop ) {    /** turn on and off sets of action buttons */
    if( buttonStart != "" ) {
      var startList = "#" + buttonStart.trim().split( " " ).join( ", #" );
      $( startList ).removeClass( "disabled-button" );
    }
    
    if( buttonStop != "" ) {
      var stopList = "#" + buttonStop.trim().split( " " ).join( ", #" );
      $( stopList ).addClass( "disabled-button" );
    }
  }
  
  /*function toast( msg, st ){                  / ** Post up message then log it * /
    $( '.toaster' ).html( msg );
    $( '.toaster',  ).addClass( 'show' );

    setTimeout( function(){ // After 5 seconds, remove the show class from DIV
      $( '.toaster',  ).removeClass( 'show' ); 
    }, 5000 );
  }
  */
    
  function toggle( divId ) {                         /** toggle div visibility */
    $( divId ).toggle();
  }
  
  function sleep( ms ) {                             /** suspend processing for some time */    
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
