
  function dragElement( subject ) {          /** Move selected element anywhere on page */
    // See init for required initialization
    var x1, y1, x2, y2, dx;
    
    if( document.getElementById( subject.id + "header" ) ) {
      // if present, the header is where you move the DIV from:
      document.getElementById( subject.id + "header" ).onmousedown = dragMouseDown;
      dx = 0;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      subject.onmousedown = dragMouseDown;
      dx = 0;
    }

    function dragMouseDown( e ) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      x2 = e.clientX;
      y2 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag( e ) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      x1 = x2 - e.clientX;
      y1 = y2 - e.clientY;
      x2 = e.clientX;
      y2 = e.clientY;
      // set the element's new position:
      subject.style.top  = ( subject.offsetTop  - y1 - dx ) + "px";
      subject.style.left = ( subject.offsetLeft - x1 - dx ) + "px";
    }

    function closeDragElement() {  // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;

      if( ! context.dragables ) {
        context.dragables = {};
      }

      var itm = subject.id;

      if( ! context.dragables[ itm ] ) {
        context.dragables[ itm ] = {};
      }

      context.dragables[ itm ].left    = x2;    // remember position and size
      context.dragables[ itm ].top     = y2;
      context.dragables[ itm ].width   = subject.offsetWidth;
      context.dragables[ itm ].height  = subject.offsetHeight;
//      saveContext( context.dragables[ itm ] );
    }
  }
