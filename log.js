
  function addLog( msg, st ) {                /** Log a message */
    var tbl = $( '#eventLogBody' )[0];
    var row = tbl.insertRow();
    $( row ).attr( 'id', context.logItems );
    var theTimeIsNow = thisDate();
    newCell( row, 0, theTimeIsNow );
    newCell( row, 1, msg );
    newCell( row, 2, st );
    $( '#logTime' ).html( theTimeIsNow );
    setBottom();
  }
 
  function thisDate() {                       /** Construct a timestamp */
  // now in form yyyy-dd-mm hh:mm:ss
    var dte = new Date();
    var dteFmt  = dte.getFullYear() + "-" + zp( dte.getMonth() + 1 ) + "-" + zp( dte.getDate() ) + " " +
              zp( dte.getHours() )  + ":" + zp( dte.getMinutes()   ) + ":" + zp( dte.getSeconds() );
    return dteFmt;
  }
    
//  async 
  function toast( msg, st ){                  /** Post up message then log it */
    toastWho( "#toaster", msg, st )
  }
  
  function toastWho( toste, msg, st ) {
    $( toste ).html( msg );
    addLog( msg, st );
    $( toste ).addClass( 'show' );
    console.log( msg );
    
    setTimeout( function(){ // After 5 seconds, remove the show class from DIV
      $( toste  ).removeClass( 'show' ); 
    }, 5000 );
  }
  
  function zp( num ) {                        /** Zero pad 2 digit numbers */
    return ( "0" + num ).slice( -2 );
  }

  function newCell( row, idx, val ) {                 /** Append cell to table row */
    var cell = row.insertCell( idx );
    cell.innerHTML = val;
    $( cell ).addClass( 'col-' + idx );
    return cell;
  }

  function setBottom() {                              /** auto scroll to bottom */
    context.bottom = $( "input[name='bottomFeeder']:checked" ).val();
    
    if( context.bottom == 'on' ) {  
      $( '.logBody' ).scrollTop( $( '.logBody' )[0].scrollHeight );
    }  
  }
   
